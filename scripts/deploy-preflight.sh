#!/bin/bash
# deploy-preflight.sh — push 之前的本地构建体检（fail-closed）
#
# 背景（2026-11-25）：Vercel 通知邮件显示当天两次生产构建因为同一类本地问题挂掉
# （058ea10 12:51 UTC、a48bd40 11:44 UTC，根因是 favicon.ico 的 PNG 帧不是 RGBA）。
# 每次远端失败都：① 烧掉一次部署额度 ② 让生产域名继续停在旧版本 ③ 触发一封失败邮件。
# 本地先跑一遍 `next build` 的代价远小于一次远端失败，所以把体检前置到 push 之前。
#
# 检查项：
#   1. 品牌资产二进制体检（scripts/check-build-assets.py）—— 永远跑
#   2. 文章 schema 体检（scripts/check-article-schema.sh）—— 本批改了 content/articles 时跑
#   3. 本地 next build —— 本批改了 src/ public/ next.config.ts package.json 时跑
#
# 用法：
#   bash scripts/deploy-preflight.sh                 # 自动判断要跑哪些
#   PREFLIGHT_BUILD=always bash scripts/deploy-preflight.sh   # 强制本地构建
#   PREFLIGHT_SKIP=1 bash scripts/deploy-flush.sh    # 跳过体检（只在明确知道后果时用）
#
# 退出码：0 = 可以推；1 = 体检未通过，别推

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1

BASELINE="${PREFLIGHT_BASELINE:-$(python3 scripts/_prev-prod-sha.py 2>/dev/null || echo '')}"
BUILD_MODE="${PREFLIGHT_BUILD:-auto}"
FAIL=0

say() { echo "[preflight $(date '+%F %T')] $*"; }

if [ "${PREFLIGHT_SKIP:-0}" = "1" ]; then
  say "⚠️  PREFLIGHT_SKIP=1，跳过本地体检（远端失败将直接烧部署额度）"
  exit 0
fi

say "本地构建体检开始（baseline=${BASELINE:0:8}${BASELINE:+...}）"

# 远端只构建“已提交”的树，本地构建读的是工作区。两者不一致时体检结论会失真，必须先说清楚。
DIRTY="$(git diff --name-only HEAD -- content src public next.config.ts package.json 2>/dev/null | head -3)"
if [ -n "$DIRTY" ]; then
  say "⚠️  工作区有未提交改动（本地构建会包含它们，远端不会）：$(echo "$DIRTY" | tr '\n' ' ')"
fi

# 1) 品牌资产（本次事故根因）
if python3 scripts/check-build-assets.py; then
  say "品牌资产 OK"
else
  say "❌ 品牌资产体检未通过"
  FAIL=1
fi

# 变更范围：优先用“上一次成功上线的 sha..HEAD”，拿不到就退回“origin/main..HEAD”
if [ -n "$BASELINE" ] && git cat-file -e "$BASELINE" 2>/dev/null; then
  DIFF_BASE="$BASELINE"
else
  DIFF_BASE="$(git rev-parse origin/main 2>/dev/null || git rev-parse HEAD)"
fi
CHANGED="$(git diff --name-only "$DIFF_BASE"..HEAD 2>/dev/null || true)"

# 2) 文章 schema（改过文章才跑）
if printf '%s\n' "$CHANGED" | grep -q '^content/articles/'; then
  if bash scripts/check-article-schema.sh >/tmp/preflight-schema.log 2>&1; then
    say "文章 schema OK"
  else
    say "❌ 文章 schema 未通过（见 /tmp/preflight-schema.log 末尾）"
    tail -20 /tmp/preflight-schema.log
    FAIL=1
  fi
else
  say "本批未改 content/articles，跳过 schema"
fi

# 3) 本地构建（改代码/资产/依赖才跑）
NEED_BUILD=0
case "$BUILD_MODE" in
  always) NEED_BUILD=1 ;;
  never) NEED_BUILD=0 ;;
  auto)
    if printf '%s\n' "$CHANGED" | grep -qE '^(src/|public/|next\.config\.|package(-lock)?\.json|tsconfig\.json)'; then
      NEED_BUILD=1
    fi
    ;;
esac

if [ "$NEED_BUILD" -eq 1 ]; then
  say "改动触及构建代码/资产，跑本地 next build（这是唯一能复现远端报错的办法）"
  ATTEMPT=0
  BUILD_OK=0
  while [ "$ATTEMPT" -lt 2 ]; do
    ATTEMPT=$((ATTEMPT + 1))
    if npm run build >/tmp/preflight-build.log 2>&1; then
      BUILD_OK=1
      break
    fi
    # 2026-11-25 实测：另一个 agent 正在写文章 JSON 时，构建期读目录会读到半截文件，
    # 报 `SyntaxError: Unexpected end of JSON input`。这是竞态、不是代码坏了 —— 等一会儿重跑一次。
    if grep -qE 'Unexpected end of JSON input|in JSON at position|Unexpected token .* in JSON' /tmp/preflight-build.log; then
      say "⚠️  构建撞上 JSON 写入竞态（Unexpected end of JSON input），15s 后重试一次"
      sleep 15
      continue
    fi
    break
  done
  if [ "$BUILD_OK" -eq 1 ]; then
    say "本地构建 OK（第 ${ATTEMPT} 次；日志 /tmp/preflight-build.log）"
  else
    say "❌ 本地构建失败，远端必然失败 —— 不要 push。日志末尾："
    tail -40 /tmp/preflight-build.log
    FAIL=1
  fi
else
  say "本批未触及 src/public/依赖，跳过本地构建"
fi

if [ "$FAIL" -ne 0 ]; then
  say "❌ 体检未通过，push 中止（修好再跑，或明确 PREFLIGHT_SKIP=1 承担后果）"
  exit 1
fi
say "✅ 体检通过，可以 push"
exit 0
