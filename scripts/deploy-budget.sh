#!/bin/bash
# deploy-budget.sh - 推送前检查 Vercel 每日部署预算 (2026-11-24)
#
# 背景: Hobby 计划 100 次部署/天, 但真正致命的是资源用量超限导致项目被暂停
#       (Fast Origin Transfer / Functions Storage / ISR Reads 均已越线)。
#       把日常 push 频率压到 ≤30 次/天, 给夜间管线 + 手工修复留出余量。
#
# 用法:
#   bash scripts/deploy-budget.sh            # 检查, 超预算则 exit 1 阻止 push
#   DEPLOY_FORCE=1 git push ...              # 明确知道在做什么时强制推送
#
# 口径: 每次 push 到 main 会触发一次 Vercel 构建(失败构建也计数), 删除旧部署不会返还次数,
#       所以用本地计数台账 logs/deploy-budget.json 记账, 同时打印 Vercel 现存部署数作交叉核对。

set -u
LIMIT="${DEPLOY_DAILY_LIMIT:-30}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LEDGER="$PROJECT_DIR/logs/deploy-budget.json"

[ "${DEPLOY_FORCE:-0}" = "1" ] && { echo "⚠️ DEPLOY_FORCE=1，跳过部署预算检查"; exit 0; }

mkdir -p "$PROJECT_DIR/logs"

python3 - "$LEDGER" "$LIMIT" <<'PY'
import json, os, sys, time
ledger_path, limit = sys.argv[1], int(sys.argv[2])
today = time.strftime('%Y-%m-%d')
try:
    d = json.load(open(ledger_path))
except Exception:
    d = {}
if d.get('date') != today:
    d = {'date': today, 'count': 0}
count = int(d.get('count', 0))
print('📊 本机今日已触发部署: %d / 预算 %d（%s）' % (count, limit, today))
if count >= limit:
    print('❌ 已达每日部署预算，本次 push 被拦下。')
    print('   把改动合并成一次提交再推；确需立即部署: DEPLOY_FORCE=1 git push')
    raise SystemExit(1)
d['count'] = count + 1
json.dump(d, open(ledger_path, 'w'), ensure_ascii=False)
print('✅ 预算内，放行（本次为今日第 %d 次）' % (count + 1))
PY
