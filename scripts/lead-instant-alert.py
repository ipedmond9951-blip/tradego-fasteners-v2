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
        # 站内直推已经成功（新部署会打 "Telegram alert: true"）时不再重复推，
        # 这个轮询器只在站内推送失败或老部署（没这行日志）时补一刀。
        if any(m.strip() == "Telegram alert: true" for m in msgs):
            lead["_inapp"] = True
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


ARCHIVE_FILE = os.path.join(ROOT, "logs", "leads-archive.jsonl")


def archive(leads, state):
    """把每条线索按 lead id 追加到本地 jsonl 台账（不依赖 Vercel / CRM / 隧道）。

    站点侧 serverless 写不了盘、CRM 隧道也断过，这份本地台账是"线索最后一定留得下"的
    那层；后续要补录到 Postgres，照这个文件回放即可。
    """
    seen = set(state.get("archived", []))
    rows = []
    for l in leads:
        if l["id"] in seen:
            continue
        seen.add(l["id"])
        rows.append({k: v for k, v in l.items()
                     if k == "id" or (not k.startswith("_") and any(k.startswith(fk) for fk in FIELD_KEYS))})
    if not rows:
        return 0
    os.makedirs(os.path.dirname(ARCHIVE_FILE), exist_ok=True)
    with open(ARCHIVE_FILE, "a", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    state["archived"] = list(seen)[-1000:]
    return len(rows)


DB_ENV = "/Users/zhangming/Projects/tradebrain-v2/.env"
PSQL = "/opt/homebrew/bin/psql"


def db_url():
    if os.environ.get("DATABASE_URL"):
        return os.environ["DATABASE_URL"]
    try:
        for line in open(DB_ENV, encoding="utf-8"):
            if line.startswith("DATABASE_URL="):
                return line.split("=", 1)[1].strip().strip('"')
    except Exception:
        pass
    return ""


def q(v):
    return "'" + str(v).replace("'", "''") + "'"


def is_test_lead(l):
    """内部自测（QA/自检）不往 CRM 里灌，只留在本地台账。"""
    blob = " ".join(str(l.get(k, "")) for k in ("Name", "Message", "Email"))
    return bool(re.search(r"\bQA[:：]|test-alert@|lead-instant-alert 自检", blob))


def db_sync(leads, state):
    """把线索写进 TradeBrain 的 customer_leads（本机直连 Postgres，不走公网隧道）。

    站点 serverless 写不了盘、CRM 隧道也常断，所以落库这一步放在本机定时器里做，
    以 json_id = lead id 去重，重复跑不会出重复行。
    """
    url = db_url()
    if not url:
        log("DB 同步跳过：没找到 DATABASE_URL")
        return 0
    done = set(state.get("db", []))
    todo = [l for l in leads if l["id"] not in done and not is_test_lead(l)]
    if not todo:
        return 0

    inserted = 0
    for l in todo:
        wa = re.sub(r"\D", "", l.get("Phone") or "")
        email = (l.get("Email") or "").strip()
        if not wa and not email:
            continue
        sql = f"""
INSERT INTO customer_leads
  (contact_name, email, phone, whatsapp, country, source, lead_status, lead_stage,
   lead_score, lead_grade, product_interest, notes, tags, json_id, created_at)
SELECT {q(l.get('Name') or 'Website lead')}, {q(email)}, {q(l.get('Phone') or '')},
       {q(wa)}, {q((l.get('Country') or '').replace('Unknown',''))},
       'tradego_website', 'new', 'identified', {50 if l.get('_high') else 10}, 'C',
       {q((l.get('Products') or '').replace('lead_modal','') or 'Website lead modal')},
       {q('TradeGo 官网留资 · ' + ('首页弹框' if (l.get('Products') == 'lead_modal') else '询盘表单')
          + ' · lead_id=' + l['id'] + ((' · ' + (l.get('Message') or '')[:200]) if l.get('Message') else ''))},
       ARRAY['website_inquiry','tradego_site'], {q(l['id'])}, now()
WHERE NOT EXISTS (SELECT 1 FROM customer_leads c WHERE c.json_id = {q(l['id'])})
RETURNING id;
"""
        try:
            r = subprocess.run([PSQL, url, "-q", "-tAc", sql], capture_output=True, text=True, timeout=30)
            if r.returncode != 0:
                log("DB 写入失败 %s: %s" % (l["id"], (r.stderr or "").strip()[:150]))
                continue
            if not (r.stdout or "").strip():
                # NOT EXISTS 挡住了重复，本来就有这行；也算已处理，别每轮重试
                done.add(l["id"])
                continue
            inserted += 1
            done.add(l["id"])
        except Exception as e:
            log("DB 写入异常 %s: %s" % (l["id"], type(e).__name__))
    if inserted:
        state["db"] = list(done)[-1000:]
        save_state(state)
        log("CRM 落库新增 %d 条（customer_leads）" % inserted)
    return inserted


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--once", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--bootstrap", action="store_true")
    ap.add_argument("--test", action="store_true")
    ap.add_argument("--backfill", action="store_true", help="把本地台账里还没入库的线索补进 CRM")
    a = ap.parse_args()

    if a.backfill:
        state = load_state()
        try:
            rows = [json.loads(x) for x in open(ARCHIVE_FILE, encoding="utf-8") if x.strip()]
        except Exception:
            rows = []
        log("补录：台账 %d 条" % len(rows))
        db_sync(rows, state)
        return 0

    if a.test:
        print("发送结果:", tg_send("✅ lead-instant-alert 自检：通道正常"))
        return 0

    recs = fetch_records()
    if not recs:
        return 0
    leads = parse_leads(recs)
    state = load_state()
    n_arc = archive(leads, state)
    if n_arc:
        save_state(state)
        log("本地台账新增 %d 条 → %s" % (n_arc, ARCHIVE_FILE))
    db_sync(leads, state)
    sent = set(state.get("sent", []))
    new = [l for l in leads if l["id"] not in sent and not l.get("_inapp")]
    log("inquiry 日志 %d 条 → 线索 %d 条，需补推 %d 条" % (len(recs), len(leads), len(new)))

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
