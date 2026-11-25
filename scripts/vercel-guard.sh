#!/bin/bash
# vercel-guard.sh - TradeGo Vercel 运维规范的可执行校验 (2026-11-25)
#
# 对应 docs/VERCEL-OPS.md：
#   默认模式  : 推送前自检（同步状态 / 禁用写法 / 配置不变量 / 部署保留数）
#   --live    : 上线后验收（sha 对齐 / READY / Lambda ≤5MB / 页面 200 / 缓存头）
#   --build   : 本地构建产物自检（函数 trace ≤5MB，替代肉眼看 .next）
#
# 退出码: 0 = 通过；1 = 有硬性违规（禁止上线）；2 = 通过但有警告
#
# 用法:
#   bash scripts/vercel-guard.sh
#   bash scripts/vercel-guard.sh --live
#   bash scripts/vercel-guard.sh --build

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1

MODE="pre"
case "${1:-}" in
  --live) MODE="live" ;;
  --build) MODE="build" ;;
  --quiet) MODE="pre" ;;
  "") MODE="pre" ;;
  *) echo "未知参数: $1（可用: --live / --build）"; exit 1 ;;
esac

FAIL=0
WARN=0
ok()   { echo "  ✅ $1"; }
warn() { echo "  ⚠️  $1"; WARN=$((WARN+1)); }
bad()  { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

PROJECT_ID="prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
PROD_URL="https://www.tradego-fasteners.com"

echo "🛡  Vercel 规范自检（模式: ${MODE}）"

# ---------------------------------------------------------------- 配置不变量
check_invariants() {
  echo ""
  echo "① 配置不变量（docs/VERCEL-OPS.md 第 5 节）"
  if grep -q "outputFileTracingExcludes" next.config.ts 2>/dev/null; then
    ok "next.config.ts 保留 outputFileTracingExcludes"
  else
    bad "next.config.ts 缺少 outputFileTracingExcludes（函数包会重新膨胀到 136MB+）"
  fi
  for pat in "public/images" "content"; do
    if grep -q "$pat" next.config.ts 2>/dev/null; then
      ok "trace 排除项包含 $pat"
    else
      bad "trace 排除项缺少 $pat"
    fi
  done
  if grep -q "s-maxage=86400" next.config.ts 2>/dev/null; then
    ok "CDN 长缓存 s-maxage=86400 仍在"
  else
    bad "next.config.ts 里找不到 s-maxage=86400（缓存头被删会推高 FOT）"
  fi
  if grep -q "export const dynamic = 'force-static'" "src/app/sitemap.xml/route.ts" 2>/dev/null; then
    ok "sitemap.xml 仍是 force-static"
  else
    bad "sitemap.xml 不再是 force-static（每次抓取都会回源）"
  fi
  if grep -q "export const dynamic = 'force-static'" "src/app/[locale]/llms.txt/route.ts" 2>/dev/null; then
    ok "llms.txt 仍是 force-static"
  else
    bad "llms.txt 退回动态（每请求进函数 + 自 fetch 回源）"
  fi
  CNT=$(grep -rl "dynamicParams = false" src/app 2>/dev/null | wc -l | tr -d ' ')
  if [ "$CNT" -ge 5 ]; then
    ok "动态路由 dynamicParams=false 覆盖 $CNT 处"
  else
    bad "dynamicParams=false 只覆盖 $CNT 处（应 ≥5，否则未预生成 slug 会回源读磁盘）"
  fi
}

# ---------------------------------------------------------------- 禁用写法扫描
check_forbidden() {
  echo ""
  echo "② 禁用写法扫描（第 4 节）"
  HIT=$(grep -rnE "vercel (deploy|--prod)|vercel deploy --prod" scripts/*.sh package.json 2>/dev/null \
        | grep -v "vercel-guard.sh" | grep -v "^scripts/deploy-flush.sh" | grep -v "_deny-direct-deploy.sh" \
        | grep -vE ":[0-9]+:\s*#" || true)
  if [ -z "$HIT" ]; then
    ok "scripts/ 与 package.json 无绕过闸门的直推写法"
  else
    bad "发现绕过闸门的直推写法："
    echo "$HIT" | sed 's/^/      /'
  fi
  NB=$(grep -l "DEPLOY_FORCE=1" scripts/*.sh 2>/dev/null | grep -vE "deploy-flush.sh|deploy-budget.sh|vercel-guard.sh" | wc -l | tr -d ' ')
  if [ "$NB" -eq 0 ]; then
    ok "DEPLOY_FORCE=1 仅出现在 deploy-flush.sh / deploy-budget.sh"
  else
    warn "DEPLOY_FORCE=1 出现在 $NB 个其他脚本，确认是否为事故通道"
  fi
}

# ---------------------------------------------------------------- git 状态
check_git() {
  echo ""
  echo "③ 仓库状态（第 3 节 步骤 3-4）"
  BRANCH=$(git branch --show-current 2>/dev/null)
  [ "$BRANCH" = "main" ] && ok "当前分支 main" || bad "当前分支 $BRANCH（发布只允许 main）"
  BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
  [ "$BEHIND" -eq 0 ] && ok "与 origin/main 同步（落后 0）" || bad "落后 origin $BEHIND 个提交，先 rebase，禁止硬推"
  UNPUSHED=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
  echo "  ℹ️  待推送提交: $UNPUSHED 个"
  if [ "$UNPUSHED" -eq 0 ]; then
    ok "没有待推提交"
  else
    echo "  提交清单:"
    git log --oneline origin/main..HEAD | head -5 | sed 's/^/      /'
  fi
  DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  if [ "$DIRTY" -eq 0 ]; then
    ok "工作区干净"
  else
    warn "工作区有 $DIRTY 个未提交改动（确认不应混入本次发布）"
  fi
}

# ---------------------------------------------------------------- Vercel 侧
vercel_json() {
  npx --yes vercel ls tradego-fasteners --json 2>/dev/null
}

check_vercel() {
  echo ""
  echo "④ Vercel 部署保留数（第 2 节 · 只留 3 条）"
  J=$(vercel_json)
  if [ -z "$J" ]; then
    warn "无法读取部署列表（检查 vercel CLI 登录），跳过"
    return
  fi
  COUNT=$(echo "$J" | python3 -c "import json,sys;print(len(json.load(sys.stdin).get('deployments',[])))" 2>/dev/null || echo 0)
  if [ "$COUNT" -le 3 ]; then
    ok "线上部署 $COUNT 条（≤3）"
  elif [ "$COUNT" -eq 4 ]; then
    warn "线上部署 4 条，本次 push 后自动 prune 到 3 条"
  else
    bad "线上部署 $COUNT 条（>4），先执行 bash scripts/vercel-prune.sh --apply"
  fi
}

# ---------------------------------------------------------------- 构建产物
check_build() {
  echo ""
  echo "⑤ 本地构建产物（单函数 trace ≤5MB）"
  if [ ! -d .next/server/app ]; then
    bad ".next 不存在，先跑 npx next build"
    return
  fi
  python3 - <<'PY'
import json, os, glob
def size(p):
    if os.path.isdir(p):
        return sum(os.path.getsize(os.path.join(r,f)) for r,_,fs in os.walk(p) for f in fs)
    try:
        return os.path.getsize(p)
    except Exception:
        return 0
worst = 0; worst_name = ""
for t in glob.glob('.next/server/app/**/*.nft.json', recursive=True):
    d = json.load(open(t)); base = os.path.dirname(t)
    tot = sum(size(os.path.normpath(os.path.join(base, x))) for x in d.get('files', []))
    tot_mb = tot / 1e6
    if tot_mb > worst:
        worst = tot_mb; worst_name = t
print(f"  最大函数 trace: {worst:.1f} MB → {worst_name}")
if worst > 10:
    print("  ❌ 超过硬上限 10MB")
    raise SystemExit(1)
elif worst > 5:
    print("  ⚠️  超过目标 5MB（可接受但需记录原因）")
    raise SystemExit(2)
else:
    print("  ✅ 单函数 ≤5MB")
PY
  case $? in
    0) FAIL=$FAIL ;; 2) WARN=$((WARN+1)) ;; *) FAIL=$((FAIL+1)) ;;
  esac
  ROUTES=$(python3 -c "import json;print(len(json.load(open('.next/prerender-manifest.json'))['routes']))" 2>/dev/null)
  if [ -n "${ROUTES:-}" ]; then
    if [ "$ROUTES" -ge 4400 ]; then ok "预渲染路由 $ROUTES 条（≥4400）"; else bad "预渲染路由只有 $ROUTES 条，疑似大量页面退化为动态"; fi
  fi
}

# ---------------------------------------------------------------- 上线验收
check_live() {
  echo ""
  echo "⑥ 线上验收（第 3 节 步骤 5）"
  HEAD_SHA=$(git rev-parse --short HEAD)
  J=$(vercel_json)
  if [ -z "$J" ]; then bad "无法读取部署列表"; return; fi
  INFO=$(echo "$J" | python3 -c "
import json,sys
d=json.load(sys.stdin)['deployments'][0]
print(d['state'], d['target'], (d['meta'] or {}).get('githubCommitSha','')[:8], d['url'])
")
  STATE=$(echo "$INFO" | awk '{print $1}')
  TARGET=$(echo "$INFO" | awk '{print $2}')
  SHA=$(echo "$INFO" | awk '{print $3}')
  URL=$(echo "$INFO" | awk '{print $4}')
  [ "$SHA" = "$HEAD_SHA" ] && ok "线上最新 commit $SHA = 本地 HEAD" || bad "线上最新 $SHA ≠ 本地 $HEAD_SHA"
  [ "$STATE" = "READY" ] && ok "状态 READY" || bad "状态 $STATE"
  [ "$TARGET" = "production" ] && ok "target=production" || bad "target=$TARGET"

  MAXMB=$(npx --yes vercel inspect "$URL" 2>&1 | grep -oE "λ [^ ]+ ?\([0-9.]+MB\)" | grep -oE "[0-9.]+MB" | sed 's/MB//' | sort -rn | head -1)
  if [ -n "$MAXMB" ]; then
    if [ "$(echo "$MAXMB < 5" | bc -l 2>/dev/null || echo 1)" = "1" ]; then
      ok "最大 Lambda ${MAXMB}MB（≤5MB）"
    else
      bad "最大 Lambda ${MAXMB}MB 超过 5MB"
    fi
  else
    warn "未能解析 Lambda 尺寸"
  fi

  for u in "/en/" "/ja/industry/drywall-screws-complete-guide/" "/en/llms.txt" "/sitemap.xml"; do
    CODE=$(curl -s -o /tmp/vg_page -w "%{http_code}" -L "$PROD_URL$u")
    if [ "$CODE" = "200" ]; then ok "$u → 200"; else bad "$u → $CODE"; fi
  done
  LANG=$(curl -s -L "$PROD_URL/ja/industry/drywall-screws-complete-guide/" | grep -o '<html[^>]*lang="[^"]*"' | head -1)
  case "$LANG" in *'"ja"'*) ok "日语页 lang=ja 正确";; *) bad "日语页语言标记异常: ${LANG:-<空>}";; esac
  CC=$(curl -sI -L "$PROD_URL/en/" | grep -i "cache-control" | head -1)
  case "$CC" in *s-maxage=86400*) ok "CDN 长缓存生效（${CC}）";; *) bad "缓存头异常: ${CC:-<空>}";; esac
  for k in "ld+json" canonical hreflang; do
    if curl -s -L "$PROD_URL/ja/industry/drywall-screws-complete-guide/" | grep -qi "$k"; then ok "页面保留 ${k}"; else bad "页面缺失 ${k}"; fi
  done
}

# ---------------------------------------------------------------- run
case "$MODE" in
  build) check_build ;;
  live)  check_live ;;
  *)     check_invariants; check_forbidden; check_git; check_vercel ;;
esac

echo ""
if [ "$FAIL" -gt 0 ]; then
  echo "❌ 自检未通过：$FAIL 项硬性违规，$WARN 项警告。按 docs/VERCEL-OPS.md 修正后再继续。"
  exit 1
elif [ "$WARN" -gt 0 ]; then
  echo "⚠️  自检通过，但有 $WARN 项警告，请确认后在 logs/vercel-usage-watch.md 留痕。"
  exit 2
else
  echo "✅ 自检通过，符合 docs/VERCEL-OPS.md。"
  exit 0
fi
