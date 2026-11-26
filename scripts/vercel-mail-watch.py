#!/usr/bin/env python3
"""vercel-mail-watch.py — push 之后的"邮件 + 部署结果"盯梢（2026-11-26 新增）

为什么要有它：2026-11-25 那次 favicon 构建失败，Vercel 当天就发了
`Production deployment failed` 邮件，但线上停在旧版本十几个小时没人发现；
AgentOps CI 连续 7 次红也没人看。push 之后不能只看"推送成功"，必须有人去看
(1) Vercel 构建到底有没有 READY，(2) 邮箱里 Vercel 有没有发告警。

两层检测：
  层 1（默认可用）：Vercel API 查本次 sha 的部署状态 —— ERROR / CANCELED / 超时未 READY 都算异常。
  层 2（可选）：Gmail IMAP 读 vercel.com 发来的邮件，按主题分类（构建失败、站点停用、
              额度超限、存储告警、域名验证、作者非团队成员…），命中的都报出来。
              需要 `~/.config/tradego/gmail-app-password`（或环境变量 GMAIL_APP_PASSWORD），
              Gmail 里生成"应用专用密码"后写入即可；没配置时只跑层 1，并在日志里写明。

用法：
  python3 scripts/vercel-mail-watch.py --register            # deploy-flush.sh 推成功后自动调用
  python3 scripts/vercel-mail-watch.py --check               # launchd 每 10 分钟跑一次
  python3 scripts/vercel-mail-watch.py --check --backfill-hours 24   # 手工补查最近 24h 邮件
  python3 scripts/vercel-mail-watch.py --status

退出码：0 无异常 / 1 参数或环境错误 / 2 发现异常（已写日志、已发 Telegram）
"""
import argparse
import base64
import datetime as dt
import imaplib
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE_FILE = os.path.join(ROOT, "logs", "vercel-mail-watch-state.json")
LOG_FILE = os.path.join(ROOT, "logs", "vercel-mail-watch.log")

GMAIL_USER = os.environ.get("GMAIL_USER", "ipedmond9951@gmail.com")
GMAIL_PASS_FILE = os.path.expanduser("~/.config/tradego/gmail-app-password")

WATCH_MINUTES = int(os.environ.get("MAIL_WATCH_MINUTES", "120"))
STALE_MINUTES = int(os.environ.get("MAIL_WATCH_STALE_MINUTES", "25"))

# 主题关键词 → (severity, 说明)。命中第一条即用；收据类直接忽略。
SUBJECT_RULES = [
    ("receipt", "info", None),
    ("invoice", "info", None),
    ("production deployment failed", "P1", "生产部署构建失败"),
    ("deployment failed", "P1", "部署失败"),
    ("build failed", "P1", "构建失败"),
    ("failed deployment from", "P1", "部署被拒（作者不是团队成员 / 来源受限）"),
    ("your sites are offline", "P0", "站点被停用（额度或账号问题）"),
    ("exceeded your limits", "P0", "额度超限"),
    ("account has been paused", "P0", "账号被暂停"),
    ("function storage", "P2", "函数存储用量告警"),
    ("deployment storage", "P2", "部署存储用量告警"),
    ("verify your domain contact", "P2", "域名联系人验证到期"),
    ("domain verification", "P2", "域名验证提醒"),
    ("spend management", "P2", "花费上限提醒"),
]


def now_utc():
    return dt.datetime.now(dt.timezone.utc)


def load_state():
    try:
        with open(STATE_FILE, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"watches": [], "seen_mails": {}}


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    os.replace(tmp, STATE_FILE)


def log(msg):
    line = f"{dt.datetime.now(dt.timezone.utc).astimezone().strftime('%F %T %Z')} | {msg}"
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")
    print(line)


def git_head_sha():
    out = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True)
    return out.stdout.strip() if out.returncode == 0 else ""


def deployments():
    """复用 scripts/vercel_deployments.py 的取数口径（token 由 vercel_auth 统一续期）。"""
    sys.path.insert(0, os.path.join(ROOT, "scripts"))
    from vercel_deployments import list_deployments  # noqa: E402
    return list_deployments(limit=40).get("deployments", [])


def find_deployment(sha, items):
    for d in items:
        meta = d.get("meta") or {}
        if (meta.get("githubCommitSha") or "").startswith(sha[:8]):
            return d
    return None


def deployment_check(watch, items):
    """返回 (状态字符串, 是否异常)。"""
    dep = find_deployment(watch["sha"], items)
    if dep is None:
        age = (now_utc() - dt.datetime.fromisoformat(watch["registered_at"])).total_seconds() / 60
        if age > STALE_MINUTES:
            return "未找到该提交的部署记录（可能被 ignoreCommand 跳过或未触发）", False
        return "等待 Vercel 生成部署记录", False

    state = dep.get("readyState") or dep.get("state") or "UNKNOWN"
    if state == "READY":
        return f"部署 READY（{dep.get('url','')}）", False
    if state in ("ERROR", "CANCELED"):
        return f"部署 {state}（{dep.get('url','')}）", True
    age = (now_utc() - dt.datetime.fromisoformat(watch["registered_at"])).total_seconds() / 60
    if state in ("QUEUED", "BUILDING", "INITIALIZING") and age > STALE_MINUTES:
        return f"部署停在 {state} 已 {int(age)} 分钟", True
    return f"部署 {state}（构建中）", False


def gmail_password():
    """应用专用密码来源（从宽到窄）：环境变量 → tradebrain 的 .env（同一 Gmail 账号）→ 本机配置文件。"""
    pwd = os.environ.get("GMAIL_APP_PASSWORD", "").strip()
    if pwd:
        return pwd
    tb_env = os.path.expanduser("~/Projects/tradebrain-v2/server/.env")
    try:
        with open(tb_env, encoding="utf-8") as f:
            kv = {}
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.split("=", 1)
                    kv[k.strip()] = v.strip().strip('"').strip("'")
            if kv.get("SMTP_USER", "").endswith("@gmail.com") and kv.get("SMTP_PASSWORD"):
                global GMAIL_USER
                GMAIL_USER = kv["SMTP_USER"]
                return kv["SMTP_PASSWORD"]
    except Exception:
        pass
    try:
        with open(GMAIL_PASS_FILE, encoding="utf-8") as f:
            return f.read().strip()
    except Exception:
        return ""


def decode_header(raw):
    from email import message_from_bytes
    from email.header import decode_header as dh
    msg = message_from_bytes(raw)
    subject_parts = dh(msg.get("Subject", "") or "")
    subject = "".join(
        (p.decode(enc or "utf-8", errors="ignore") if isinstance(p, bytes) else p)
        for p, enc in subject_parts
    )
    from email.utils import parsedate_to_datetime
    raw_date = (msg.get("Date") or "").strip()
    try:
        date_iso = parsedate_to_datetime(raw_date).astimezone(dt.timezone.utc).isoformat()
    except Exception:
        date_iso = ""
    return {
        "message_id": (msg.get("Message-ID") or "").strip(),
        "from": (msg.get("From") or "").strip(),
        "subject": subject.strip(),
        "date": raw_date,
        "date_iso": date_iso,
    }


def classify(subject):
    low = subject.lower()
    for key, sev, text in SUBJECT_RULES:
        if key in low:
            return sev, text
    return "P2", "未分类的 Vercel 邮件（需人工看一眼）"


def mail_scan(since_days, seen):
    """返回 (是否启用, [异常项])。启用=拿到应用专用密码。"""
    pwd = gmail_password()
    if not pwd:
        return False, []

    hits = []
    try:
        box = imaplib.IMAP4_SSL("imap.gmail.com", 993)
        box.login(GMAIL_USER, pwd)
        box.select("INBOX", readonly=True)
        since = (now_utc() - dt.timedelta(days=since_days)).strftime("%d-%b-%Y")
        typ, data = box.search(None, f'(SINCE "{since}" FROM "vercel")')
        ids = data[0].split() if typ == "OK" else []
        for mid in ids[-60:]:
            typ, raw = box.fetch(mid, "(RFC822)")
            if typ != "OK" or not raw or not raw[0]:
                continue
            info = decode_header(raw[0][1])
            key = info["message_id"] or f"{info['date']}|{info['subject']}"
            if key in seen:
                continue
            seen[key] = True
            sev, text = classify(info["subject"])
            if sev == "info":
                continue
            hits.append({"severity": sev, "text": text, "subject": info["subject"], "date": info["date"]})
        box.logout()
    except Exception as e:  # 登录失败 / 网络问题：不要把整个巡检搞挂
        return True, [{"severity": "P2", "text": f"邮箱层读取失败：{type(e).__name__}", "subject": "", "date": ""}]
    return True, hits


def notify(sev, message):
    script = os.path.join(ROOT, "scripts", "telegram-notify.sh")
    if not os.path.exists(script):
        return
    try:
        subprocess.run(["bash", script, f"--severity={sev}", message], cwd=ROOT,
                       capture_output=True, text=True, timeout=45)
    except Exception:
        pass


def cmd_register(sha):
    state = load_state()
    sha = sha or git_head_sha()
    if not sha:
        print("无法取 HEAD sha", file=sys.stderr)
        return 1
    watches = [w for w in state["watches"] if w["sha"] != sha]
    watches.append({
        "sha": sha,
        "registered_at": now_utc().isoformat(),
        "deadline": (now_utc() + dt.timedelta(minutes=WATCH_MINUTES)).isoformat(),
        "reported": [],
    })
    state["watches"] = watches
    save_state(state)
    log(f"已登记 push 盯梢 sha={sha[:8]}（盯 {WATCH_MINUTES} 分钟）")
    return 0


NO_NOTIFY = False


def cmd_check(backfill_hours):
    state = load_state()
    anomalies = []
    explicit_backfill = backfill_hours > 2

    pending = [w for w in state["watches"] if now_utc() <= dt.datetime.fromisoformat(w["deadline"])]
    if not pending and not explicit_backfill:
        return 0  # 没有在盯的 push，也没有要求补查：空跑退出，不做网络请求

    mail_on, mail_hits = mail_scan(max(2, backfill_hours // 24 + 1), state.setdefault("seen_mails", {}))

    if mail_on:
        cutoff = None
        if not explicit_backfill and pending:
            earliest = min(dt.datetime.fromisoformat(w["registered_at"]) for w in pending)
            cutoff = (earliest - dt.timedelta(minutes=30)).isoformat()
        for h in mail_hits:
            if cutoff and h.get("date_iso") and h["date_iso"] < cutoff:
                continue  # 窗口外的历史邮件不重复报
            anomalies.append(f"[邮件 {h['severity']}] {h['text']}：{h['subject']}（{h['date']}）")
    else:
        log("邮箱层未启用（缺 Gmail 应用专用密码），本次只用 Vercel API 判部署结果")

    items = None
    active = []
    for w in state["watches"]:
        deadline = dt.datetime.fromisoformat(w["deadline"])
        if now_utc() > deadline:
            log(f"盯梢结束 sha={w['sha'][:8]}（超窗，历史结论见上方日志/邮件告警）")
            continue
        active.append(w)
        if items is None:
            try:
                items = deployments()
            except Exception as e:
                anomalies.append(f"[Vercel API] 取部署列表失败：{type(e).__name__}")
                items = []
        status, bad = deployment_check(w, items)
        if bad and status not in w["reported"]:
            w["reported"].append(status)
            anomalies.append(f"[部署 {w['sha'][:8]}] {status}")
        elif not bad:
            log(f"sha={w['sha'][:8]} {status}")

    state["watches"] = active
    save_state(state)

    if anomalies:
        seen_key = set()
        uniq = []
        for a in anomalies:
            k = a[:120]
            if k in seen_key:
                continue
            seen_key.add(k)
            uniq.append(a)
        anomalies = uniq
        log("发现异常 " + str(len(anomalies)) + " 项：")
        for a in anomalies:
            log("  - " + a)
        if not NO_NOTIFY:
            notify("P1", "Vercel push 后异常：\n" + "\n".join(anomalies[:6]))
        return 2

    log("push 后巡检：无异常")
    return 0


def cmd_status():
    state = load_state()
    print(json.dumps({"watches": state.get("watches", []),
                      "mail_layer": bool(gmail_password())}, ensure_ascii=False, indent=2))
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--register", nargs="?", const="", default=None)
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--backfill-hours", type=int, default=2)
    ap.add_argument("--no-notify", action="store_true")
    a = ap.parse_args()

    if a.register is not None:
        return cmd_register(a.register)
    if a.check:
        global NO_NOTIFY
        NO_NOTIFY = a.no_notify
        return cmd_check(a.backfill_hours)
    if a.status:
        return cmd_status()
    ap.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
