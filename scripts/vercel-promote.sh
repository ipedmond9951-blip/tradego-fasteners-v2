#!/usr/bin/env bash
# vercel-promote.sh — 把生产域名指向「最新 READY 的 production 部署」并抽检
#
# 背景：本项目三个生产域名（tradego-fasteners.com / www / .vercel.app）曾被手工
# 钉在某一个部署上，git push 产生的新部署只会拿到 git-main 别名，域名不动，
# 于是「push 成功 + 构建 READY」但线上还是旧内容（2026-11-25 踩到）。
#
# 用法：
#   bash scripts/vercel-promote.sh            # 只看状态，不切换
#   bash scripts/vercel-promote.sh --apply    # 切换域名到最新 READY 部署
#   bash scripts/vercel-promote.sh --apply --slug coach-screws-buying-guide
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT_ID="prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
TOKEN="${VERCEL_TOKEN:-$(python3 "$(dirname "$0")/vercel-token.py")}"
DOMAINS="tradego-fasteners.vercel.app tradego-fasteners.com www.tradego-fasteners.com"
APPLY=0; SLUG="coach-screws-buying-guide"
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --slug) SLUG="$2"; shift ;;
  esac; shift
done

latest=$(python3 scripts/vercel_deployments.py --limit 10 --target production | python3 -c '
import json,sys
d=json.load(sys.stdin)["deployments"]
for x in d:
    if x.get("readyState")=="READY":
        print(x["uid"], (x.get("meta") or {}).get("githubCommitSha","")[:8], x["url"]); break
')
[ -z "$latest" ] && { echo "❌ 没有 READY 的 production 部署"; exit 2; }
uid=$(echo "$latest" | cut -d' ' -f1); sha=$(echo "$latest" | cut -d' ' -f2); url=$(echo "$latest" | cut -d' ' -f3)
echo "最新 READY 部署: $uid  提交 $sha"

cur=$(curl -s "https://api.vercel.com/v4/aliases?limit=100" -H "Authorization: Bearer $TOKEN" | python3 -c '
import json,sys
for a in json.load(sys.stdin).get("aliases",[]):
    if a.get("alias")=="tradego-fasteners.vercel.app": print((a.get("deploymentId") or "")[:12])
')
echo "域名当前指向: ${cur:-未知}"

if [ "$APPLY" = "1" ]; then
  for d in $DOMAINS; do
    npx vercel alias set "$url" "$d" --token="$TOKEN" >/dev/null 2>&1 && echo "  ✅ $d -> $sha"
  done
  sleep 5
fi

body=$(curl -s "https://tradego-fasteners.vercel.app/en/industry/$SLUG/?promote=$RANDOM")
echo "抽检 /en/industry/$SLUG/: ${#body} 字节, FAQPage=$([ "${body#*FAQPage}" != "$body" ] && echo yes || echo no)"
