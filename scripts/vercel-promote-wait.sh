#!/bin/bash
# vercel-promote-wait.sh — 等本次提交构建 READY 后，把生产域名指过去
#
# 为什么需要它（2026-11-25）：
# git push 只会产生部署并给它 git-main 别名，三个生产域名钉在旧部署上不动。
# 结果是"push 成功、构建 READY、线上还是旧内容"。上线必须再跑 vercel-promote.sh --apply。
#
# 用法：
#   bash scripts/vercel-promote-wait.sh                 # 等 origin/main 最新提交
#   bash scripts/vercel-promote-wait.sh --sha abc1234   # 等指定提交
#   TIMEOUT=1800 bash scripts/vercel-promote-wait.sh    # 自定义超时（秒，默认 900）
#
# 退出码：0 已切换；1 超时/构建失败；2 参数或 API 错误
set -u
cd "$(dirname "$0")/.." || exit 2

PROJECT_ID="prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
TEAM_ID="team_zpNihQv4m6nG8EPZqu079v8k"
TOKEN="${VERCEL_TOKEN:-$(python3 "$(dirname "$0")/vercel-token.py")}"
TIMEOUT="${TIMEOUT:-900}"
LOG="logs/promote.log"
mkdir -p logs

SHA=""
while [ $# -gt 0 ]; do
  case "$1" in
    --sha) SHA="$2"; shift ;;
  esac; shift
done
[ -z "$SHA" ] && SHA=$(git rev-parse HEAD)

echo "[promote-wait $(date '+%F %T')] 等待提交 ${SHA:0:8} 构建完成（超时 ${TIMEOUT}s）" >> "$LOG"

start=$(date +%s)
while :; do
  state=$(python3 scripts/vercel_deployments.py --limit 50 | SHA="$SHA" python3 -c '
import json,os,sys
want=os.environ["SHA"]
for x in json.load(sys.stdin).get("deployments",[]):
    if ((x.get("meta") or {}).get("githubCommitSha") or "")==want:
        print(x.get("readyState") or x.get("state") or "UNKNOWN"); break
else:
    print("NOTFOUND")
')
  case "$state" in
    READY)
      echo "[promote-wait $(date '+%F %T')] ${SHA:0:8} READY，切换域名" >> "$LOG"
      if bash scripts/vercel-promote.sh --apply >> "$LOG" 2>&1; then
        echo "[promote-wait $(date '+%F %T')] ✅ 域名已指向 ${SHA:0:8}" >> "$LOG"
        exit 0
      fi
      echo "[promote-wait $(date '+%F %T')] ❌ promote 失败" >> "$LOG"; exit 2 ;;
    ERROR|CANCELED)
      echo "[promote-wait $(date '+%F %T')] ❌ 构建 ${state}（${SHA:0:8}）" >> "$LOG"; exit 1 ;;
    NOTFOUND)
      : ;;
  esac
  now=$(date +%s)
  if [ $((now - start)) -ge "$TIMEOUT" ]; then
    echo "[promote-wait $(date '+%F %T')] ⏱ 超时（最后状态 ${state}），仍需人工 promote" >> "$LOG"
    exit 1
  fi
  sleep 20
done
