#!/usr/bin/env bash
# Vercel 部署自动清理：只保留最近 N 条（默认 3），其余删除，避免 Functions/Deployment Storage 线性叠加。
# 默认 dry-run，只打印将要删除的清单；加 --apply 才真正执行删除。
#
# 用法:
#   bash scripts/vercel-prune.sh              # 只看
#   bash scripts/vercel-prune.sh --apply      # 真删
#   KEEP=2 bash scripts/vercel-prune.sh --apply
#
# 只处理主项目 prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ（tradego-fasteners），
# 绝不触碰 yoke-voltage-regulator / chinatianmai / workspace 三个项目。
set -euo pipefail

PROJECT_ID="prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
KEEP="${KEEP:-3}"
APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

TOKEN=$(python3 -c "import json;print(json.load(open('$HOME/Library/Application Support/com.vercel.cli/auth.json'))['token'])")

LIST=$(python3 scripts/vercel_deployments.py --limit 50)

TOTAL=$(echo "$LIST" | python3 -c "import json,sys;print(len(json.load(sys.stdin)['deployments']))")
echo "📦 主项目当前部署: $TOTAL 条，保留最近 $KEEP 条"

TO_DELETE=$(echo "$LIST" | python3 -c "
import json,sys,datetime
d=json.load(sys.stdin)['deployments']
keep_ready=$KEEP
out=[]
for x in d:
    st=x['state']
    t=datetime.datetime.fromtimestamp(x['createdAt']/1000).strftime('%Y-%m-%d %H:%M')
    if st in ('CANCELED',):  # ERROR 保留作证据, 供审计识别构建失败
        out.append((x['uid'], st, (x['meta'].get('githubCommitSha') or '')[:8], t))
    elif st=='READY':
        if keep_ready>0:
            keep_ready-=1
        else:
            out.append((x['uid'], st, (x['meta'].get('githubCommitSha') or '')[:8], t))
for r in out: print(*r)
")

if [ -z "$TO_DELETE" ]; then
  echo "✅ 无需清理"
  exit 0
fi

echo "🗑  待删除:"
echo "$TO_DELETE" | while read -r uid state sha t; do echo "   - $uid  $state  $sha  $t"; done

if [ "$APPLY" = "0" ]; then
  echo "（dry-run，未删除；加 --apply 执行）"
  exit 0
fi

echo "$TO_DELETE" | while read -r uid _state _sha _t; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "https://api.vercel.com/v13/deployments/$uid" -H "Authorization: Bearer $TOKEN")
  echo "   delete $uid -> HTTP $code"
done

echo "✅ 清理完成。注意：删除不可逆，回滚靠 git（见 logs/vercel-archive/回滚路线.md）"
