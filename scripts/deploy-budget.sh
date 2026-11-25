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
HIST="${DEPLOY_HIST:-$PROJECT_DIR/logs/deploy-history.jsonl}"

[ "${DEPLOY_FORCE:-0}" = "1" ] && { echo "⚠️ DEPLOY_FORCE=1，跳过部署预算检查"; exit 0; }

mkdir -p "$PROJECT_DIR/logs"

python3 - "$LEDGER" "$LIMIT" "$PROJECT_ID" "$HIST" "$PROJECT_DIR/scripts/vercel-token.py" <<'PY'
import json, os, sys, time, datetime, subprocess, urllib.request

ledger_path, limit, project_id, hist_path = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
token_helper = sys.argv[5]
tz = datetime.timezone(datetime.timedelta(hours=8))
today = datetime.datetime.now(tz).strftime('%Y-%m-%d')  # 统一用北京时间判定"今天"

# --- 1) Vercel API: 今日(Asia/Shanghai)真实部署条数 ---
api_count = None
def _pull(token):
    # 2026-11-25: 带 projectId 查会被 403（项目在团队下、token 无该团队 deployments 读权限），
    # 改成拉全量再按 projectId / name 本地过滤；团队口径变了也不会再瞎。
    req = urllib.request.Request(
        'https://api.vercel.com/v6/deployments?limit=100',
        headers={'Authorization': 'Bearer ' + token},
    )
    data = json.load(urllib.request.urlopen(req, timeout=20))
    today_start = datetime.datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
    return sum(1 for d in data.get('deployments', [])
               if (d.get('projectId') == project_id or d.get('name') == 'tradego-fasteners')
               and d['createdAt'] / 1000 >= today_start and d.get('state') != 'CANCELED')  # ignoreCommand 跳过的记录不占预算

# 2026-11-26 修: auth.json 的 token 会过期（只在 CLI 联网时自动续期），直接读文件常拿到
# 过期 token → invalidToken → 只能回退台账。改用 scripts/vercel-token.py 取"当前可用"token，
# 遇到 401/403 再强制续期重试一次。
try:
    token = subprocess.check_output(['/usr/bin/env', 'python3', token_helper], text=True, timeout=90).strip()
    api_count = _pull(token)
except Exception:
    try:
        token = subprocess.check_output(['/usr/bin/env', 'python3', token_helper, '--force'], text=True, timeout=90).strip()
        api_count = _pull(token)
    except Exception as e:
        print('⚠️ 读 Vercel 部署数失败(%s), 回退本地台账' % type(e).__name__)

# --- 2) 本地台账 ---
try:
    d = json.load(open(ledger_path))
except Exception:
    d = {}
if d.get('date') != today:
    d = {'date': today, 'count': 0}
local_count = 0  # 2026-11-26: 历史字段不再参与判定（会把尝试当构建）

# 真实构建台账 deploy-history.jsonl(按 uid 持久化, 删部署不影响计数) —— 权威口径
hist_count = 0
hist_ok = os.path.exists(hist_path)
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

# fail-closed（2026-11-25 用户口径：护栏/预算类脚本上游读不到数据时不能放行）
# Vercel API 读不到、且本地 uid 台账也不存在 → 无法判定当天真实构建数，一律拦下。
if api_count is None and not hist_ok:
    print('❌ 上游(Vercel API)与本地台账都不可读，无法判定今日构建数 —— 按 fail-closed 拦下。')
    print('   确认当天确实没有构建过，再用 DEPLOY_FORCE=1 git push 显式放行。')
    raise SystemExit(1)

# 2026-11-25 修: 原先只有 api_count 有效时才拦，API 一失败(401/超时)就直接放行，
# 结果今天真实推到 10 次。预算判定不该依赖 API 是否读得到 —— 取 max 的任何一个来源够数就拦。
if count >= limit:
    print('❌ 已达每日部署预算，本次 push 被拦下。')
    print('   原因: 每次部署都会新增 1–1.9GB 产物并重写全站预渲染缓存，Hobby 免费额度扛不住高频部署。')
    print('   把改动合并成一次提交再推；确需立即部署: DEPLOY_FORCE=1 git push')
    raise SystemExit(1)

# 2026-11-25: pre-push 钩子用只读模式调用，只判定不计数（避免钩子和 push 各记一次）
if os.environ.get('DEPLOY_BUDGET_READONLY') == '1':
    print('✅ 预算内，放行（钩子只读校验，不计数）')
    raise SystemExit(0)
# 2026-11-26 修: 原来自增本地 count 会把"尝试推送"也算成一次构建 —— 推送失败/被钩子拦截
# 同样 +1，一晚上能把 3 次额度凭空烧光（11-26 零点就这样全满）。现在只记录尝试时间戳，
# 预算一律以 Vercel API 与 uid 台账（真实构建）为准。
d.setdefault('attempts', []).append(datetime.datetime.now(tz).strftime('%Y-%m-%dT%H:%M:%S'))
d['attempts'] = d['attempts'][-20:]
d['count'] = int(d.get('count', 0))  # 仅留历史值，不再参与判定
json.dump(d, open(ledger_path, 'w'), ensure_ascii=False)
print('✅ 预算内，放行（push 后将是今日第 %d 次）' % (count + 1))
PY
