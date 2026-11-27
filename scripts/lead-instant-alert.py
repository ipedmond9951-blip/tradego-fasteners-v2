#!/usr/bin/env python3
"""lead-instant-alert.py — 网站留资近实时提醒（Vercel 日志 → Telegram）

背景：生产环境没配 CRM_API_URL，serverless 也写不了本地文件，客户在首页弹框
留下邮箱或 WhatsApp 之后，痕迹只在函数日志 + 一封销售邮件里。2026-11-28 07:13
那条自测线索，从提交到我发现隔了 6 分钟。

做法：每 2 分钟读一次生产 runtime logs（vercel logs --json --non-interactive），
按 requestId 聚合成一条线索发到 Telegram，按 lead id 去重，状态写
logs/lead-alert-state.json。

用法：
  python3 scripts/lead-instant-alert.py --once            # 跑一次（launchd 用这个）
  python3 scripts/lead-instant-alert.py --once --dry-run  # 只打印不发送
  python3 scripts/lead-instant-alert.py --bootstrap       # 历史线索记为已处理，不发
  python3 scripts/lead-instant-alert.py --test            # 发一条自检消息

凭据：TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 环境变量，或复用
~/bin/telegram-poller.sh 里已有的 TOKEN（同一个 bot），chat id 默认 8758157215。
"""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE_FILE = os.path.join(ROOT, "logs", "lead-alert-state.json")
LOG_FILE = os.path.join(ROOT, "logs", "lead-alert.log")
SITE = "https://www.tradego-fasteners.com"
DEFAULT_CHAT = "8758157215"
LOOKBACK = os.environ.get("LEAD_ALERT_LOOKBACK", "45m")

FIELD_KEYS = ("Time", "Name", "Email", "Phone", "Company", "Products",
              "Quantity", "Country", "Message", "HIGH VALUE")


def log(msg):
    line = "[%s] %s" % (dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), msg)
    print(line)
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def bot_token():
    tok = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    if tok:
        return tok
    sh = os.path.expanduser("~/bin/telegram-poller.sh")
    if os.path.exists(sh):
        m = re.search(r'TOKEN="([^"]+)"', open(sh, encoding="utf-8", errors="ignore").read())
        if m:
            return m.group(1)
    return ""


def tg_send(text):
    token = bot_token()
    if not token:
        log("跳过 Telegram：没有 bot token")
        return False
    chat = os.environ.get("TELEGRAM_CHAT_ID", DEFAULT_CHAT)
    data = urllib.parse.urlencode({
        "chat_id": chat, "text": text, "disable_web_page_preview": "true"}).encode()
    req = urllib.request.Request("https://api.telegram.org/bot%s/sendMessage" % token, data=data)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            ok = json.load(r).get("ok")
        log("Telegram 发送: %s" % ok)
        return bool(ok)
    except Exception as e:
        log("Telegram 发送失败: %s: %s" % (type(e).__name__, e))
        return False


def find_cli():
    """挑一个支持 logs --since/--json 的 vercel CLI（>=60）。

    launchd 里 PATH 很短，`npx vercel` 会命中 /opt/homebrew/bin/vercel（51 版，
    不支持 --since，会退化成 follow 报错）；这里直接锁定 npx 缓存里的新版二进制。
    """
    import glob
    cands = sorted(glob.glob(os.path.expanduser("~/.npm/_npx/*/node_modules/.bin/vercel")))
    cands += ["/opt/homebrew/bin/vercel", "npx"]
    for c in cands:
        if c == "npx":
            return c
        try:
            v = subprocess.run([c, "--version"], capture_output=True, text=True, timeout=25)
            m = re.search(r"(\d+)\.(\d+)", v.stdout or "")
            if m and int(m.group(1)) >= 60:
                return c
        except Exception:
            continue
    return "npx"


def fetch_records():
    runner = find_cli()
    cmd = [runner, "logs", "--deployment", SITE, "--since", LOOKBACK,
           "--json", "--non-interactive"]
    try:
        out = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=120)
    except subprocess.TimeoutExpired:
        log("vercel logs 超时")
        return []
    except Exception as e:
        log("vercel logs 失败: %s" % type(e).__name__)
        return []
    recs = []
    for line in out.stdout.splitlines():
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue
        if obj.get("type") != "log":
            continue
        d = obj.get("data") or {}
        if not str(d.get("requestPath", "")).startswith("/api/inquiry"):
            continue
        recs.append(d)
    if not recs:
        tail = (out.stderr or "").strip().splitlines()
        log("本轮无记录（stderr 尾行: %s）" % (tail[-1][:120] if tail else "空"))
    return recs


def parse_leads(recs):
    groups = {}
    for d in recs:
        rid = d.get("requestId") or "?"
        g = groups.setdefault(rid, {"msgs": [], "ts": ""})
        g["msgs"].append(d.get("message") or "")
        if d.get("timestamp"):
            g["ts"] = d["timestamp"]

    id_re = re.compile(r"lead_\d+_[a-z0-9]+")
    leads = []
    for rid, g in groups.items():
        msgs = g["msgs"]
        if not any(m.strip().endswith("=== NEW INQUIRY ===") for m in msgs):
            continue
        lead = {}
        for m in msgs:
            hit = id_re.search(m)
            if hit:
                lead["id"] = hit.group(0)
            if ":" in m:
                k, _, v = m.partition(":")
                k = k.strip()
                if any(k.startswith(fk) for fk in FIELD_KEYS):
                    lead.setdefault(k, v.strip())
        lead.setdefault("id", "req-" + rid[:12])
        lead.setdefault("Time", g.get("ts") or "")
        flags = []
        for bad, label in (("Email to sales: false", "销售邮件未发出"),
                           ("CRM sync: FAILED", "CRM 未入库"),
                           ("Webhook alert: false", "站外 webhook 未触发")):
            if any(bad in m for m in msgs):
                flags.append(label)
        if flags:
            lead["_warn"] = "、".join(flags)
        if any("HIGH VALUE" in m for m in msgs):
            lead["_high"] = True
        leads.append(lead)
    return leads


def fmt_cst(iso):
    try:
        d = dt.datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return (d + dt.timedelta(hours=8)).strftime("%m-%d %H:%M:%S")
    except Exception:
        return iso or "?"


def build_message(l):
    email = l.get("Email") or ""
    phone = l.get("Phone") or ""
    products = l.get("Products") or "—"
    src = "首页留资弹框" if products == "lead_modal" else "询盘表单"
    lines = ["🔔 TradeGo 新线索" + ("（高价值）" if l.get("_high") else ""),
             "时间：%s CST" % fmt_cst(l.get("Time", "")),
             "渠道：%s" % src]
    if email:
        lines.append("邮箱：%s" % email)
    if phone:
        lines.append("WhatsApp/电话：%s" % phone)
    if not email and not phone:
        lines.append("联系方式：⚠️ 既没留邮箱也没留电话")
    if l.get("Company") and l["Company"] not in ("N/A", "Unknown", ""):
        lines.append("公司：%s" % l["Company"])
    if l.get("Country") and l["Country"] not in ("Unknown", "N/A", ""):
        lines.append("国家：%s" % l["Country"])
    if products != "lead_modal":
        lines.append("产品：%s" % products)
    msg = (l.get("Message") or "").strip()
    if msg and "lead capture popup" not in msg:
        lines.append("留言：%s" % msg[:200])
    lines.append("ID：%s" % l["id"])
    if l.get("_warn"):
        lines.append("⚠️ %s" % l["_warn"])
    return "\n".join(lines)


def load_state():
    try:
        return json.load(open(STATE_FILE, encoding="utf-8"))
    except Exception:
        return {"sent": []}


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    state["sent"] = state.get("sent", [])[-500:]
    state["updated"] = dt.datetime.now().isoformat(timespec="seconds")
    json.dump(state, open(STATE_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--once", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--bootstrap", action="store_true")
    ap.add_argument("--test", action="store_true")
    a = ap.parse_args()

    if a.test:
        print("发送结果:", tg_send("✅ lead-instant-alert 自检：通道正常"))
        return 0

    recs = fetch_records()
    if not recs:
        return 0
    leads = parse_leads(recs)
    state = load_state()
    sent = set(state.get("sent", []))
    new = [l for l in leads if l["id"] not in sent]
    log("inquiry 日志 %d 条 → 线索 %d 条，新 %d 条" % (len(recs), len(leads), len(new)))

    if a.bootstrap:
        sent.update(l["id"] for l in new)
        state["sent"] = list(sent)
        save_state(state)
        log("bootstrap：%d 条历史线索记为已处理" % len(new))
        return 0

    fails = 0
    for l in new:
        body = build_message(l)
        if a.dry_run:
            print(body)
            print("-" * 36)
            continue
        if tg_send(body):
            sent.add(l["id"])
        else:
            fails += 1
    if not a.dry_run:
        state["sent"] = list(sent)
        save_state(state)
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
