#!/bin/bash
# OpenClaw 链路体检：按配置里的 primary + fallbacks 顺序逐个真跑一次短提示。
# 用法: bash scripts/oc_route_check.sh [--fast]
# 退出码 0=全通，1=有不通的模型
set -uo pipefail

OC="$HOME/.nvm/versions/node/v24.22.3/bin/node $HOME/.nvm/versions/node/v24.22.3/lib/node_modules/openclaw/dist/index.js"
CFG="$HOME/.openclaw/openclaw.json"

PROMPT="${OC_PROMPT:-只回复两个字：在线}"
[ "${1:-}" = "--fast" ] && PROMPT="ok"

CHAIN=()
while IFS= read -r line; do
  [ -n "$line" ] && CHAIN+=("$line")
done < <(python3 -c '
import json, sys
c = json.load(open(sys.argv[1]))
d = c["agents"]["defaults"]["model"]
print(d.get("primary"))
for m in (d.get("fallbacks") or []):
    print(m)
' "$CFG")

if [ ${#CHAIN[@]} -eq 0 ]; then
  echo "读不到链路，检查 $CFG"
  exit 1
fi

fail=0
printf '%-54s %-4s %s\n' "模型" "结果" "耗时"
for m in "${CHAIN[@]}"; do
  t0=$(date +%s)
  out=$(timeout 60 $OC infer model run --model "$m" --prompt "$PROMPT" --json 2>&1)
  t1=$(date +%s)
  if echo "$out" | grep -q '"ok": true'; then
    st="OK"
  else
    st="FAIL"
    fail=$((fail + 1))
  fi
  printf '%-54s %-4s %ss\n' "$m" "$st" "$((t1 - t0))"
done

echo
if [ "$fail" -eq 0 ]; then
  echo "链路全通（${#CHAIN[@]} 个模型）"
  exit 0
fi
echo "有 $fail 个模型不通：先看 ~/.openclaw/openclaw.json，再查各家余额/限流"
exit 1
