#!/bin/bash
# TradeGo 自动SEO任务
# 功能：
#   1. 检查网站可访问性
#   2. 验证sitemap和robots.txt
#   3. 检查页面响应时间
#   4. 检查各语言版本
#   5. 记录SEO状态到日志
#   6. 提交代码并推送到GitHub（Vercel自动部署）
# 使用方法: ./scripts/auto-seo.sh

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs"
SITEMAP_URL="https://tradego-fasteners.com/sitemap.xml"
ROBOTS_URL="https://tradego-fasteners.com/robots.txt"
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

# 1. 检查Git状态
log "📦 检查Git状态..."
if [ -n "$(git status --short)" ]; then
    log "⚠️ 有未提交的更改，尝试拉取最新..."
    git stash 2>/dev/null || true
    git pull origin main --rebase 2>/dev/null || true
else
    log "✅ Git工作区干净"
fi

# 2. 检查网站可访问性
log "🔍 检查网站可访问性..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    log "✅ Sitemap可访问 (HTTP $HTTP_STATUS)"
else
    log "❌ Sitemap不可访问 (HTTP $HTTP_STATUS)"
fi

# 3. 检查sitemap URL数量
log "📊 Sitemap统计..."
SITEMAP_COUNT=$(curl -s "$SITEMAP_URL" 2>/dev/null | grep -c "<loc>" || echo "0")
log "   Sitemap包含 $SITEMAP_COUNT 个URL"

# 4. 检查robots.txt
log "🤖 检查robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$ROBOTS_URL" 2>/dev/null || echo "000")
if [ "$ROBOTS_STATUS" = "200" ]; then
    log "✅ robots.txt可访问 (HTTP $ROBOTS_STATUS)"
else
    log "❌ robots.txt不可访问 (HTTP $ROBOTS_STATUS)"
fi

# 5. 检查各语言版本首页响应时间
log "⚡ 检查响应时间..."
for lang in en zh es ar fr pt ru ja de; do
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://tradego-fasteners.com/$lang" 2>/dev/null || echo "0")
    RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc 2>/dev/null || echo "N/A")
    log "   /$lang: ${RESPONSE_TIME_MS}ms"
done

# 6. 检查locale重定向
log "🔀 检查locale重定向..."
DEFAULT_REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" "https://tradego-fasteners.com" 2>/dev/null)
if echo "$DEFAULT_REDIRECT" | grep -q "/en\|/zh\|/es"; then
    log "   ✅ Root重定向到: $DEFAULT_REDIRECT"
else
    log "   ⚠️ Root重定向到: $DEFAULT_REDIRECT"
fi

# 7. 检查主要页面
log "📄 检查主要页面..."
for path in "/en/products" "/en/industry" "/zh/products" "/zh/industry"; do
    PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://tradego-fasteners.com$path" 2>/dev/null || echo "000")
    log "   $path: HTTP $PAGE_STATUS"
done

# 8. 提交并推送更改（如果有的话）
log "📤 检查是否有新内容需要提交..."
git add -A
if git diff --cached --quiet; then
    log "📝 没有新更改，无需提交"
else
    COMMIT_MSG="Auto SEO: $(date '+%Y-%m-%d %H:%M') - Daily check"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE" || {
        log "⚠️ Git推送失败"
    }
    log "✅ 已提交并推送，Vercel将自动部署"
fi

# 9. 记录完成
log "=========================================="
log "✅ 自动SEO任务完成"
log "=========================================="

# 清理旧日志（保留30天）
find "$LOG_DIR" -name "auto-seo-*.log" -mtime +30 -delete 2>/dev/null || true
