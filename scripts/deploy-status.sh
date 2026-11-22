#!/usr/bin/env bash
# 查看生产部署队列：最新 Ready 版本 + 正在排队/构建的条数
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
OUT=$(npx vercel ls tradego-fasteners --json 2>/dev/null)
python3 - "$OUT" <<'PY'
import json,sys
try:
    d=json.loads(sys.argv[1]); ds=d.get('deployments') or d
except Exception:
    print("⚠️ 无法获取部署列表（检查 vercel CLI 登录）"); raise SystemExit(1)
ready=[x for x in ds if x.get('state')=='READY' and x.get('target')=='production']
busy=[x for x in ds if x.get('state') in ('QUEUED','BUILDING','INITIALIZING')]
if ready:
    m=ready[0].get('meta') or {}
    print(f"最新 Ready: {ready[0]['url'].split('-')[1]} commit {m.get('githubCommitSha','')[:7]}")
for x in busy[:5]:
    m=x.get('meta') or {}
    print(f"  {x.get('state'):12s} {m.get('githubCommitSha','')[:7]} {x['url'].split('-')[1]}")
print("建议: " + ("队列空闲，可以 push" if not busy else "已有构建在跑，攒批等 Ready 再推"))
PY
