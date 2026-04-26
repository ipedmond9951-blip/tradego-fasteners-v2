#!/bin/bash
# TradeGo 自动SEO任务
# 功能：
#   1. 生成新的GEO市场文章
#   2. 更新sitemap
#   3. 生成robots.txt和sitemap.xml
#   4. 检查网站可访问性
#   5. 记录SEO状态
# 使用方法: ./scripts/auto-seo.sh

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs"
SITEMAP_URL="https://tradego-fasteners.com/sitemap.xml"
LOG_FILE="$LOG_DIR/auto-seo-$(date '+%Y-%m-%d').log"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "TradeGo 自动SEO任务开始"
log "=========================================="

cd "$PROJECT_DIR" || exit 1

# 1. 检查Git状态，如有变更则提交
log "📦 检查Git状态..."
if [ -n "$(git status --short)" ]; then
    log "⚠️ 有未提交的更改，尝试拉取最新..."
    git stash 2>/dev/null || true
    git pull origin main --rebase 2>/dev/null || true
fi

# 2. 生成新的GEO文章（每次添加2-3个非洲城市/国家）
log "🌍 生成新的GEO文章..."
node scripts/gen-geo-articles.js 2>&1 | tee -a "$LOG_FILE" || {
    log "⚠️ gen-geo-articles.js 执行失败，跳过文章生成"
}

# 3. 更新sitemap（如果有任何新页面）
log "📄 更新sitemap..."
npm run generate-sitemap 2>&1 | tee -a "$LOG_FILE" || {
    log "⚠️ sitemap生成失败"
}

# 4. 检查网站可访问性
log "🔍 检查网站可访问性..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://tradego-fasteners.com" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "307" ] || [ "$HTTP_STATUS" = "301" ]; then
    log "✅ 网站可访问 (HTTP $HTTP_STATUS)"
else
    log "❌ 网站不可访问 (HTTP $HTTP_STATUS)"
fi

# 5. 提交并推送更改
log "📤 提交更改..."
git add -A
COMMIT_MSG="Auto SEO: $(date '+%Y-%m-%d %H:%M') - GEO updates"
if git diff --cached --quiet; then
    log "📝 没有新更改，无需提交"
else
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE" || {
        log "⚠️ Git推送失败"
    }
    log "✅ 已提交并推送"
fi

# 6. 检查sitemap状态
log "📊 Sitemap状态..."
SITEMAP_COUNT=$(curl -s "$SITEMAP_URL" 2>/dev/null | grep -c "<loc>" || echo "0")
log "   Sitemap包含 $SITEMAP_COUNT 个URL"

# 7. 记录完成
log "=========================================="
log "✅ 自动SEO任务完成"
log "=========================================="

# 清理旧日志（保留30天）
find "$LOG_DIR" -name "auto-seo-*.log" -mtime +30 -delete 2>/dev/null || true
