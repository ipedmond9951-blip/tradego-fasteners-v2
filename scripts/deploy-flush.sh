#!/bin/bash
# deploy-flush.sh - 唯一的推送入口 (2026-11-24)
#
# 背景: 这台机器上有两套东西往同一个 main 推 —— 豆包 Agent(手工修站) + OpenClaw 夜间管线
# (seo-ai-pipeline.sh / publish-queue.sh)。两边各推一次就是两次 Vercel 构建,
# 每次多一份 1–1.9GB 产物、重写 4400 页预渲染缓存, Hobby 免费额度扛不住。
# 而且 pre-push 钩子里的预算闸门被管线硬编码的 DEPLOY_FORCE=1 直接绕过。
#
# 做法: 所有推送收敛到本脚本。谁想上线都调它, 由它统一决定"现在能不能推":
#   1) 目录锁 —— 同一时刻只有一个部署在跑
#   2) 没有未推提交 → 直接退出
#   3) 落后 origin → 先 rebase, 冲突就停手交给人
#   4) 跑 deploy-budget.sh(查 Vercel API 真实当日部署数), 超预算就保留提交、等下一个窗口
#   5) 推成功后立刻 prune 到最近 3 条部署
#
# 用法:
#   bash scripts/deploy-flush.sh            # 正常推送(受预算约束)
#   bash scripts/deploy-flush.sh --force    # 人工明确要求立即上线, 跳过预算
#
# 退出码: 0 = 已推送 / 无可推送 / 预算内暂缓(都算正常结束, 调用方不必当失败)
#         1 = 需要人工介入(rebase 冲突、push 失败)

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOCK="$ROOT/logs/.deploy-flush.lock"
LOG_PREFIX="[deploy-flush $(date '+%F %T')]"

mkdir -p "$ROOT/logs"

if ! mkdir "$LOCK" 2>/dev/null; then
  echo "$LOG_PREFIX 另一个部署流程正在运行，本次跳过"
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

git fetch -q origin main || { echo "$LOG_PREFIX fetch 失败"; exit 1; }

UNPUSHED=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)

if [ "$BEHIND" -gt 0 ]; then
  echo "$LOG_PREFIX 本地落后 origin $BEHIND 个提交，先 rebase"
  if ! git rebase -q origin/main; then
    echo "$LOG_PREFIX ❌ rebase 冲突，已中止，需要人工解决（不影响线上）"
    git rebase --abort 2>/dev/null
    exit 1
  fi
fi

if [ "$UNPUSHED" -eq 0 ]; then
  echo "$LOG_PREFIX 没有待推送提交"
  exit 0
fi

echo "$LOG_PREFIX 待推送提交: $UNPUSHED 个"

# 只改 docs/scripts 等非构建路径时, vercel.json 的 ignoreCommand 会跳过构建 →
# 不产生新部署、不占部署预算。按真实构建计数, 而不是按 push 次数。
# 判定依据是 vercel.json 里 ignoreCommand 的实际口径: 上一次成功部署的 sha .. HEAD。
# 不能用 origin/main..HEAD：中间若有别人推的 content 变更没上线, 这次 push 会连带构建。
WILL_BUILD=1
PREV_SHA=$(python3 scripts/_prev-prod-sha.py)
if [ -n "$PREV_SHA" ] && git cat-file -e "$PREV_SHA" 2>/dev/null; then
  [ -z "$(git diff --name-only "$PREV_SHA"..HEAD -- content src public next.config.ts package.json 2>/dev/null)" ] && WILL_BUILD=0
fi

if [ "$FORCE" -eq 0 ]; then
  if [ "$WILL_BUILD" -eq 0 ]; then
    COUNT_FILE="logs/deploy-pushless.json"
    PUSHES=$(python3 -c "
import json,os,datetime
p='$COUNT_FILE'
try: d=json.load(open(p))
except Exception: d={}
today=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).strftime('%Y-%m-%d')
print(d['count'] if d.get('date')==today else 0)
")
    if [ "$PUSHES" -ge 5 ]; then
      echo "$LOG_PREFIX ⏸ 今日无构建推送已达 5 次，先停手（避免刷屏部署记录）"
      exit 0
    fi
    echo "$LOG_PREFIX 本次仅 docs/scripts 改动，ignoreCommand 会跳过构建，不占部署预算（今日无构建推送 ${PUSHES}/5）"
    python3 -c "
import json,datetime
p='$COUNT_FILE'; today=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).strftime('%Y-%m-%d')
try: d=json.load(open(p))
except Exception: d={}
d={'date':today,'count':(d.get('count',0) if d.get('date')==today else 0)+1}
json.dump(d,open(p,'w'),ensure_ascii=False)
"
  elif ! bash scripts/deploy-budget.sh; then
    echo "$LOG_PREFIX ⏸ 今日部署预算已用完，$UNPUSHED 个提交保留在本地，等下一个部署窗口或人工 --force"
    exit 0
  fi
fi

if ! DEPLOY_FORCE=1 git push -q origin main; then
  echo "$LOG_PREFIX ❌ push 失败"
  exit 1
fi
echo "$LOG_PREFIX ✅ 已推送 $UNPUSHED 个提交，Vercel 开始构建"

if [ -x scripts/vercel-prune.sh ]; then
  bash scripts/vercel-prune.sh --apply 2>&1 | tail -2
fi

exit 0
