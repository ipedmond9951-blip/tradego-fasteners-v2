#!/bin/bash
# TradeGo Article Publisher — 生成文章JSON → git push → Vercel自动部署
# 用法: bash publish-article.sh [article-slug]
# 无参数时推送所有未发布的文章

set -e
cd "$(dirname "$0")"

SLUG="${1:-}"
ARTICLES_DIR="content/articles"

# 检查是否有新文章
if [ -n "$SLUG" ]; then
  if [ ! -f "$ARTICLES_DIR/${SLUG}.json" ]; then
    echo "❌ 文章不存在: $ARTICLES_DIR/${SLUG}.json"
    exit 1
  fi
  echo "📝 发布文章: $SLUG"
else
  ARTICLE_COUNT=$(ls "$ARTICLES_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
  echo "📝 当前文章数: $ARTICLE_COUNT"
fi

# 删除旧的硬编码文章页面（已被动态slug页面替代）
if [ -d "src/app/[locale]/industry/drywall-screws-complete-guide" ]; then
  echo "🧹 清理旧硬编码页面..."
  rm -rf "src/app/[locale]/industry/drywall-screws-complete-guide"
fi

# Git操作
echo "📦 提交到Git..."
git add "$ARTICLES_DIR/" src/lib/articles.ts "src/app/[locale]/industry/"
if git diff --cached --quiet; then
  echo "✅ 没有变更需要提交"
else
  MSG="content: add/update articles"
  [ -n "$SLUG" ] && MSG="content: publish article '$SLUG'"
  git commit -m "$MSG"
  echo "🚀 推送到GitHub..."
  git push origin main 2>/dev/null || git push origin master 2>/dev/null
  echo "✅ 推送成功！Vercel将自动部署（约1-2分钟）"
fi

# 部署地址
echo ""
echo "🌐 网站地址: https://tradego-fasteners-v2.vercel.app"
if [ -n "$SLUG" ]; then
  echo "📄 文章地址: https://tradego-fasteners-v2.vercel.app/en/industry/$SLUG"
fi
