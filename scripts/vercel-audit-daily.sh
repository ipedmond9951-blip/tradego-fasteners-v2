#!/bin/bash
# vercel-audit-daily.sh - 合规审计的无人值守入口（launchd 每 6 小时 + 开机时各跑一次）
# 平台侧还有一条 08:30 的定时任务；两者都只读，重复跑无副作用。
# 失败时: 写状态文件 + 发 macOS 通知 + 记台账，便于回来第一眼看到。

set -u
ROOT="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG="$ROOT/logs/vercel-audit-launchd.log"
STATE="$ROOT/logs/vercel-audit-last.json"
mkdir -p "$ROOT/logs"

cd "$ROOT" || { echo "$(date '+%F %T') 仓库不存在" >> "$LOG"; exit 1; }

# 先抓用量快照（best-effort：ego 抓不到也不该让审计整体失败，审计会按"快照过期"报出来）
bash scripts/vercel-usage-snapshot.sh >> "$LOG" 2>&1 || echo "$(date '+%F %T') 用量快照抓取失败（审计会报快照过期）" >> "$LOG"

OUT=$(bash scripts/vercel-audit.sh --quiet 2>&1)
CODE=$?
printf '%s | exit=%s\n%s\n' "$(date '+%F %T')" "$CODE" "$OUT" >> "$LOG"

python3 - "$STATE" "$CODE" "$OUT" <<'PY'
import json, sys, datetime
state, code, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
old = {}
try: old = json.load(open(state))
except Exception: pass
data = {
    "checked_at": datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec="seconds"),
    "exit": code,
    "ok": code == 0,
    "detail": out.strip()[-1500:],
    "consecutive_fail": (0 if code == 0 else int(old.get("consecutive_fail", 0)) + 1),
}
json.dump(data, open(state, "w"), ensure_ascii=False, indent=1)
PY

if [ "$CODE" -ne 0 ]; then
  SUMMARY=$(printf '%s' "$OUT" | grep '❌' | head -3 | tr '\n' ' ')
  osascript -e "display notification \"${SUMMARY:-审计未通过，详见 logs/vercel-audit.log}\" with title \"TradeGo Vercel 审计未通过\"" >/dev/null 2>&1 || true
fi

exit "$CODE"
