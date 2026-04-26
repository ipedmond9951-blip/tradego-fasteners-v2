#!/bin/bash
# TradeGo GEO 自动SEO任务 - 津巴布韦边境市场版
# 功能：
#   1. 生成针对津巴布韦边境国家的GEO文章
#   2. 验证网站可访问性
#   3. 检查Schema标记
#   4. 验证sitemap和robots.txt
#   5. 检查页面响应时间
#   6. 检查AI友好性
#   7. 记录SEO状态到日志
#   8. 提交代码并推送到GitHub（Vercel自动部署）
# 
# 使用方法: ./scripts/auto-seo.sh
# 定时任务: 每天 08:00 Asia/Shanghai

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs"
SITE_URL="https://www.tradego-fasteners.com"
SITEMAP_URL="${SITE_URL}/sitemap.xml"
ROBOTS_URL="${SITE_URL}/robots.txt"
LOG_FILE="$LOG_DIR/auto-seo-$(date '+%Y-%m-%d').log"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "🌍 TradeGo GEO 自动SEO任务开始"
log "   目标: 津巴布韦边境市场优化"
log "=========================================="

cd "$PROJECT_DIR" || exit 1

# 1. 检查Git状态
log "📦 检查Git状态..."
if [ -n "$(git status --short)" ]; then
    log "⚠️ 有未提交的更改，尝试拉取最新..."
    git stash 2>/dev/null || true
    git pull origin main --rebase 2>/dev/null || true
else
    log "✅ Git工作区干净"
fi

# 2. 生成GEO文章（津巴布韦边境市场）
log "🌍 生成津巴布韦边境市场GEO文章..."
ARTICLE_COUNT_BEFORE=$(ls content/articles/*.json 2>/dev/null | wc -l)
node scripts/gen-zimbabwe-border.js 2>&1 | tee -a "$LOG_FILE" || {
    log "⚠️ gen-zimbabwe-border.js 执行失败"
}
ARTICLE_COUNT_AFTER=$(ls content/articles/*.json 2>/dev/null | wc -l)
NEW_ARTICLES=$((ARTICLE_COUNT_AFTER - ARTICLE_COUNT_BEFORE))
if [ "$NEW_ARTICLES" -gt 0 ]; then
    log "📝 新增 $NEW_ARTICLES 篇GEO文章"
else
    log "📝 没有新增文章（津巴布韦边境市场已全覆盖）"
fi

# 3. 检查网站可访问性
log "🔍 检查网站可访问性..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    log "✅ Sitemap可访问 (HTTP $HTTP_STATUS)"
else
    log "❌ Sitemap不可访问 (HTTP $HTTP_STATUS)"
fi

# 4. 检查sitemap URL数量
log "📊 Sitemap统计..."
SITEMAP_COUNT=$(curl -s "$SITEMAP_URL" 2>/dev/null | grep -c "<loc>" || echo "0")
log "   Sitemap包含 $SITEMAP_COUNT 个URL"

# 5. 检查robots.txt
log "🤖 检查robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$ROBOTS_URL" 2>/dev/null || echo "000")
if [ "$ROBOTS_STATUS" = "200" ]; then
    log "✅ robots.txt可访问 (HTTP $ROBOTS_STATUS)"
else
    log "❌ robots.txt不可访问 (HTTP $ROBOTS_STATUS)"
fi

# 6. 检查各语言版本首页响应时间
log "⚡ 检查响应时间..."
for lang in en zh es ar fr pt ru ja de; do
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "${SITE_URL}/$lang" 2>/dev/null || echo "0")
    RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc 2>/dev/null || echo "N/A")
    log "   /$lang: ${RESPONSE_TIME_MS}ms"
done

# 7. 检查locale重定向
log "🔀 检查locale重定向..."
DEFAULT_REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" "${SITE_URL}" 2>/dev/null)
if echo "$DEFAULT_REDIRECT" | grep -q "/en\|/zh\|/es"; then
    log "   ✅ Root重定向到: $DEFAULT_REDIRECT"
else
    log "   ⚠️ Root重定向到: $DEFAULT_REDIRECT"
fi

# 8. 检查主要页面
log "📄 检查主要页面..."
for path in "/en/products" "/en/industry" "/zh/products" "/zh/industry"; do
    PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}$path" 2>/dev/null || echo "000")
    log "   $path: HTTP $PAGE_STATUS"
done

# 9. 检查AI友好性 - Schema标记验证
log "🤖 检查AI友好性 - Schema标记..."
for path in "/en" "/en/industry/africa-fastener-market-opportunities-2026"; do
    PAGE_CONTENT=$(curl -s "${SITE_URL}$path" 2>/dev/null)
    if echo "$PAGE_CONTENT" | grep -q "application/ld+json"; then
        log "   ✅ $path: Schema标记存在"
    else
        log "   ⚠️ $path: Schema标记缺失"
    fi
done

# 10. 文章统计
log "📚 文章统计..."
ARTICLE_TOTAL=$(ls content/articles/*.json 2>/dev/null | wc -l)
ZIMBABWE_BORDER_ARTICLES=$(ls content/articles/*-fasteners-*.json 2>/dev/null | wc -l)
log "   总文章数: $ARTICLE_TOTAL"
log "   津巴布韦边境市场文章: $ZIMBABWE_BORDER_ARTICLES"

# 11. 提交并推送更改（如果有的话）
log "📤 检查是否有新内容需要提交..."
git add -A
if git diff --cached --quiet; then
    log "📝 没有新更改，无需提交"
else
    COMMIT_MSG="GEO Auto SEO: $(date '+%Y-%m-%d %H:%M') - $NEW_ARTICLES new articles"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE" || {
        log "⚠️ Git推送失败"
    }
    log "✅ 已提交并推送，Vercel将自动部署"
fi

# 12. 记录完成
log "=========================================="
log "✅ 自动SEO任务完成"
log "=========================================="

# 清理旧日志（保留30天）
find "$LOG_DIR" -name "auto-seo-*.log" -mtime +30 -delete 2>/dev/null || true
