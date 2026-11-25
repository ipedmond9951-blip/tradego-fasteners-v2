#!/bin/bash
# deploy-budget.sh - 推送前检查 Vercel 每日部署预算 (2026-11-24, v2)
#
# v1 的缺陷: 只读本机台账 logs/deploy-budget.json。本机有两个 agent 同时往同一个 GitHub 仓库推
# (本会话 + OpenClaw SEO Agent), 各记各的账 → 两边都以为在预算内, 实际 Vercel 侧一天构建 4 次。
# 每次部署都会多一份 1–1.9GB 产物并重写 4400 页预渲染缓存, 直接推高 Deployment/Functions Storage。
#
# v2 口径: 直接查 Vercel API 的「今日(北京时间)真实部署条数」, 与本地台账取较大值;
#          API 不可用时回退本地台账。默认每日 3 次(夜间管线 1 次 + 手工修复余量)。
#
# 用法:
#   bash scripts/deploy-budget.sh                 # 检查, 超预算 exit 1 阻止 push
#   DEPLOY_DAILY_LIMIT=5 bash scripts/deploy-budget.sh
#   DEPLOY_FORCE=1 git push                       # 明确知道在做什么时强制推送

set -u
LIMIT="${DEPLOY_DAILY_LIMIT:-3}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LEDGER="$PROJECT_DIR/logs/deploy-budget.json"
PROJECT_ID="${VERCEL_PROJECT_ID:-prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ}"
AUTH="$HOME/Library/Application Support/com.vercel.cli/auth.json"

[ "${DEPLOY_FORCE:-0}" = "1" ] && { echo "⚠️ DEPLOY_FORCE=1，跳过部署预算检查"; exit 0; }

mkdir -p "$PROJECT_DIR/logs"

python3 - "$LEDGER" "$LIMIT" "$PROJECT_ID" "$AUTH" "$PROJECT_DIR/logs/deploy-history.jsonl" <<'PY'
import json, os, sys, time, datetime, urllib.request

ledger_path, limit, project_id, auth_path, hist_path = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5]
tz = datetime.timezone(datetime.timedelta(hours=8))
today = datetime.datetime.now(tz).strftime('%Y-%m-%d')  # 统一用北京时间判定"今天"

# --- 1) Vercel API: 今日(Asia/Shanghai)真实部署条数 ---
api_count = None
try:
    token = json.load(open(os.path.expanduser(auth_path)))['token']
    req = urllib.request.Request(
        'https://api.vercel.com/v6/deployments?projectId=' + project_id + '&limit=50',
        headers={'Authorization': 'Bearer ' + token},
    )
    data = json.load(urllib.request.urlopen(req, timeout=15))
    today_start = datetime.datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
    api_count = sum(1 for d in data.get('deployments', []) if d['createdAt'] / 1000 >= today_start and d.get('state') != 'CANCELED')  # ignoreCommand 跳过的记录不占预算
except Exception as e:
    print('⚠️ 读 Vercel 部署数失败(%s), 回退本地台账' % type(e).__name__)

# --- 2) 本地台账 ---
try:
    d = json.load(open(ledger_path))
except Exception:
    d = {}
if d.get('date') != today:
    d = {'date': today, 'count': 0}
local_count = int(d.get('count', 0))

# 真实构建台账 deploy-history.jsonl(按 uid 持久化, 删部署不影响计数) —— 权威口径
hist_count = 0
try:
    for line in open(hist_path):
        line = line.strip()
        if line and json.loads(line).get('ts', '').startswith(today):
            hist_count += 1
except Exception:
    pass

# 2026-11-25 修: 只看 API 会被自己的剪枝洗白 —— 删掉两条旧部署，5 次真实构建就显示成 3 次。
# 台账按 uid 持久化，删除不影响计数，所以取 max(API, 台账)：API 补"别的 agent 刚推的"，
# 台账补"已经删掉的"。ignoreCommand 跳过的记录不计入台账（sync 时按 state 过滤）。
count = max([c for c in (api_count, local_count, hist_count) if c is not None] or [0])
src = []
if api_count is not None:
    src.append('Vercel=%d' % api_count)
src.append('本地=%d' % local_count); src.append('台账=%d' % hist_count)
print('📊 今日已发生部署: %d / 预算 %d（%s；%s）' % (count, limit, today, ' '.join(src)))

if api_count is not None and count >= limit:
    print('❌ 已达每日部署预算，本次 push 被拦下。')
    print('   原因: 每次部署都会新增 1–1.9GB 产物并重写全站预渲染缓存，Hobby 免费额度扛不住高频部署。')
    print('   把改动合并成一次提交再推；确需立即部署: DEPLOY_FORCE=1 git push')
    raise SystemExit(1)

d['count'] = count + 1
json.dump(d, open(ledger_path, 'w'), ensure_ascii=False)
print('✅ 预算内，放行（push 后将是今日第 %d 次）' % (count + 1))
PY
