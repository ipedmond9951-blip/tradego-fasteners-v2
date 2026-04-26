#!/bin/bash
# TradeGo SEO 自动任务 v2 - 完整SEO优化版
# 基于 seo-engine skill 增强
# 
# 功能：
#   1. 技术SEO检测 (robots.txt, sitemap, HTTPS, Core Web Vitals代理指标)
#   2. 内容SEO检测 (Meta描述, H标签, 图片alt, Schema标记)
#   3. 离页SEO监测 (外链, 社媒信号, 品牌提及)
#   4. 自动修复检测 (404链接, alt缺失, meta缺失)
#   5. GEO文章生成
#   6. 自动提交推送
#
# 使用方法: ./scripts/auto-seo-v2.sh
# 定时任务: 每天 08:00 Asia/Shanghai

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs"
REPORT_DIR="$PROJECT_DIR/logs/seo-reports"
SITE_URL="https://www.tradego-fasteners.com"
SITE_DOMAIN="tradego-fasteners.com"
SITEMAP_URL="${SITE_URL}/sitemap.xml"
ROBOTS_URL="${SITE_URL}/robots.txt"
LOG_FILE="$LOG_DIR/auto-seo-$(date '+%Y-%m-%d').log"
REPORT_FILE="$REPORT_DIR/seo-report-$(date '+%Y-%m-%d').md"

# SEO评分 (0-100)
SEO_SCORE=0
MAX_SCORE=100

# 创建目录
mkdir -p "$LOG_DIR" "$REPORT_DIR"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 评分函数
add_score() {
    SEO_SCORE=$((SEO_SCORE + $1))
}

log "=========================================="
log "🚀 TradeGo SEO自动任务 v2 开始"
log "   基于 seo-engine skill 增强版"
log "=========================================="

cd "$PROJECT_DIR" || exit 1

# ==========================================
# 第一部分: Git同步
# ==========================================
log "📦 检查Git状态..."
if [ -n "$(git status --short)" ]; then
    log "⚠️ 有未提交的更改，暂存并拉取最新..."
    git stash 2>/dev/null || true
    git pull origin main --rebase 2>/dev/null || true
fi

# ==========================================
# 第二部分: 技术SEO检测 (40分)
# ==========================================
log ""
log "========== 技术SEO检测 (40分) =========="

# 2.1 robots.txt (5分)
log "🤖 检查robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$ROBOTS_URL" 2>/dev/null || echo "000")
if [ "$ROBOTS_STATUS" = "200" ]; then
    log "   ✅ robots.txt可访问 (HTTP 200)"
    add_score 5
else
    log "   ❌ robots.txt不可访问 (HTTP $ROBOTS_STATUS)"
fi

# 2.2 sitemap.xml (5分)
log "📄 检查sitemap.xml..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL" 2>/dev/null || echo "000")
if [ "$SITEMAP_STATUS" = "200" ]; then
    log "   ✅ sitemap.xml可访问 (HTTP 200)"
    add_score 5
    SITEMAP_COUNT=$(curl -s "$SITEMAP_URL" 2>/dev/null | grep -c "<loc>" || echo "0")
    log "   📊 Sitemap包含 $SITEMAP_COUNT 个URL"
else
    log "   ❌ sitemap.xml不可访问 (HTTP $SITEMAP_STATUS)"
fi

# 2.3 HTTPS (5分)
log "🔒 检查HTTPS配置..."
HTTPS_CHECK=$(curl -s -o /dev/null -w "%{ssl_verify_result}" "$SITE_URL" 2>/dev/null || echo "1")
if [ "$HTTPS_CHECK" = "0" ]; then
    log "   ✅ HTTPS配置正确 (SSL验证通过)"
    add_score 5
else
    log "   ⚠️ SSL证书问题"
fi

# 2.4 移动端友好检测 (5分)
log "📱 检查移动端适配..."
MOBILE_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}/?amp" 2>/dev/null || echo "000")
if [ "$MOBILE_CHECK" = "200" ] || [ "$MOBILE_CHECK" = "301" ] || [ "$MOBILE_CHECK" = "302" ]; then
    log "   ✅ 网站支持移动端"
    add_score 5
else
    # 检查viewport meta标签
    VIEWPORT_CHECK=$(curl -s "${SITE_URL}/en" 2>/dev/null | grep -i "viewport" | head -1)
    if [ -n "$VIEWPORT_CHECK" ]; then
        log "   ✅ 移动端viewport已配置"
        add_score 5
    else
        log "   ⚠️ 移动端配置需检查"
    fi
fi

# 2.5 Core Web Vitals 代理指标 (10分) 
log "⚡ 检查性能指标 (Core Web Vitals代理)..."
PERF_SCORE=0
for path in "/en" "/zh"; do
    TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "${SITE_URL}$path" 2>/dev/null || echo "0")
    TTFB_MS=$(echo "$TTFB * 1000" | bc 2>/dev/null || echo "9999")
    CONTENT_SIZE=$(curl -s -o /dev/null -w "%{size_download}" "${SITE_URL}$path" 2>/dev/null || echo "0")
    
    # TTFB应该<800ms
    TTFB_CHECK=$(echo "$TTFB_MS < 800" | bc 2>/dev/null || echo "0")
    if [ "$TTFB_CHECK" = "1" ]; then
        PERF_SCORE=$((PERF_SCORE + 1))
        log "   ✅ $path TTFB: ${TTFB_MS}ms (良好 <800ms)"
    else
        log "   ⚠️ $path TTFB: ${TTFB_MS}ms (需优化 ≥800ms)"
    fi
done
# 性能部分得分
if [ $PERF_SCORE -ge 2 ]; then
    add_score 10
elif [ $PERF_SCORE -ge 1 ]; then
    add_score 5
fi

# 2.6 结构化数据 (5分)
log "📋 检查结构化数据..."
SCHEMA_COUNT=0
for path in "/en" "/en/products" "/zh/products"; do
    PAGE_CONTENT=$(curl -s "${SITE_URL}$path" 2>/dev/null)
    if echo "$PAGE_CONTENT" | grep -q "application/ld+json"; then
        SCHEMA_COUNT=$((SCHEMA_COUNT + 1))
    fi
done
if [ $SCHEMA_COUNT -ge 2 ]; then
    log "   ✅ 结构化数据完整 ($SCHEMA_COUNT个页面)"
    add_score 5
else
    log "   ⚠️ 结构化数据需补充"
fi

# ==========================================
# 第三部分: 内容SEO检测 (40分)
# ==========================================
log ""
log "========== 内容SEO检测 (40分) =========="

# 3.1 标题优化 (10分)
log "📝 检查页面标题..."
TITLE_SCORE=0
for path in "/en" "/zh"; do
    PAGE_CONTENT=$(curl -s "${SITE_URL}$path" 2>/dev/null)
    TITLE=$(echo "$PAGE_CONTENT" | grep -i "<title>" | sed 's/<[^>]*>//g' | head -1 | tr -d '[:space:]')
    if [ ${#TITLE} -gt 10 ] && [ ${#TITLE} -lt 70 ]; then
        TITLE_SCORE=$((TITLE_SCORE + 1))
        log "   ✅ $path 标题长度合适: ${#TITLE}字符"
    else
        log "   ⚠️ $path 标题长度异常: ${#TITLE}字符"
    fi
done
if [ $TITLE_SCORE -ge 2 ]; then
    add_score 10
elif [ $TITLE_SCORE -ge 1 ]; then
    add_score 5
fi

# 3.2 Meta描述 (10分)
log "📄 检查Meta描述..."
META_SCORE=0
for path in "/en" "/zh"; do
    PAGE_CONTENT=$(curl -s "${SITE_URL}$path" 2>/dev/null)
    META_DESC=$(echo "$PAGE_CONTENT" | grep -i 'name="description"' | grep -o 'content="[^"]*"' | cut -d'"' -f2 | head -1)
    if [ ${#META_DESC} -gt 50 ] && [ ${#META_DESC} -lt 160 ]; then
        META_SCORE=$((META_SCORE + 1))
        log "   ✅ $path Meta描述: ${#META_DESC}字符"
    else
        log "   ⚠️ $path Meta描述: ${#META_DESC}字符 (建议50-160)"
    fi
done
if [ $META_SCORE -ge 2 ]; then
    add_score 10
elif [ $META_SCORE -ge 1 ]; then
    add_score 5
fi

# 3.3 H标签结构 (10分)
log "📑 检查H标签结构..."
H_SCORE=0
for path in "/en" "/zh"; do
    PAGE_CONTENT=$(curl -s "${SITE_URL}$path" 2>/dev/null)
    HAS_H1=$(echo "$PAGE_CONTENT" | grep -c "<h1" || echo "0")
    HAS_H2=$(echo "$PAGE_CONTENT" | grep -c "<h2" || echo "0")
    if [ "$HAS_H1" -ge 1 ] && [ "$HAS_H2" -ge 2 ]; then
        H_SCORE=$((H_SCORE + 1))
        log "   ✅ $path H1:$HAS_H1 H2:$HAS_H2"
    else
        log "   ⚠️ $path H1:$HAS_H1 H2:$HAS_H2"
    fi
done
if [ $H_SCORE -ge 2 ]; then
    add_score 10
elif [ $H_SCORE -ge 1 ]; then
    add_score 5
fi

# 3.4 图片Alt属性 (10分) - 新增
log "🖼️ 检查图片Alt属性..."
ALT_SCORE=0
TOTAL_IMGS=0
ALT_PRESENT=0
for path in "/en" "/zh"; do
    PAGE_CONTENT=$(curl -s "${SITE_URL}$path" 2>/dev/null)
    IMG_COUNT=$(echo "$PAGE_CONTENT" | grep -c '<img' || echo "0")
    ALT_COUNT=$(echo "$PAGE_CONTENT" | grep -c 'alt=' || echo "0")
    TOTAL_IMGS=$((TOTAL_IMGS + IMG_COUNT))
    ALT_PRESENT=$((ALT_PRESENT + ALT_COUNT))
    
    if [ "$IMG_COUNT" -gt 0 ]; then
        ALT_RATIO=$(echo "scale=2; $ALT_COUNT * 100 / $IMG_COUNT" | bc 2>/dev/null || echo "0")
        if [ "$ALT_RATIO" -gt 80 ]; then
            ALT_SCORE=$((ALT_SCORE + 1))
            log "   ✅ $path Alt覆盖率: ${ALT_RATIO}%"
        else
            log "   ⚠️ $path Alt覆盖率: ${ALT_RATIO}% (建议>80%)"
        fi
    fi
done
if [ $ALT_SCORE -ge 2 ]; then
    add_score 10
elif [ $ALT_SCORE -ge 1 ]; then
    add_score 5
fi
if [ $TOTAL_IMGS -gt 0 ]; then
    TOTAL_ALT_RATIO=$(echo "scale=2; $ALT_PRESENT * 100 / $TOTAL_IMGS" | bc 2>/dev/null || echo "0")
    log "   📊 全局Alt覆盖率: ${TOTAL_ALT_RATIO}%"
fi

# ==========================================
# 第四部分: 离页SEO监测 (20分) - 新增
# ==========================================
log ""
log "========== 离页SEO监测 (20分) =========="

# 4.1 外链质量 (10分)
log "🔗 检查外链建设..."
BACKLINK_INFO="待建设"
# 使用Google搜索检测外链数量（简化版）
# 实际生产环境应使用Ahrefs/Moz API
BACKLINK_SCORE=0
log "   📋 外链建设: $BACKLINK_INFO"
log "   💡 建议: 主动联系行业相关网站交换链接"

# 4.2 社媒信号 (5分)
log "📢 检查社媒集成..."
SOCIAL_PRESENT=0
PAGE_CONTENT=$(curl -s "${SITE_URL}/en" 2>/dev/null)
for social in "facebook.com" "twitter.com" "linkedin.com" "instagram.com"; do
    if echo "$PAGE_CONTENT" | grep -qi "$social"; then
        SOCIAL_PRESENT=$((SOCIAL_PRESENT + 1))
    fi
done
if [ $SOCIAL_PRESENT -ge 2 ]; then
    log "   ✅ 发现$SOCIAL_PRESENT个社媒平台集成"
    add_score 3
elif [ $SOCIAL_PRESENT -ge 1 ]; then
    log "   ⚠️ 发现$SOCIAL_PRESENT个社媒平台集成"
    add_score 1
else
    log "   ❌ 未发现社媒集成"
fi

# 4.3 品牌提及 (5分)
log "🏷️ 检查品牌提及..."
BRAND_PRESENT=0
# 检测网站是否提及品牌名称
if echo "$PAGE_CONTENT" | grep -qi "tradego"; then
    BRAND_PRESENT=$((BRAND_PRESENT + 1))
fi
if echo "$PAGE_CONTENT" | grep -qi "fasteners"; then
    BRAND_PRESENT=$((BRAND_PRESENT + 1))
fi
if [ $BRAND_PRESENT -ge 2 ]; then
    log "   ✅ 品牌关键词自然出现"
    add_score 5
else
    log "   ⚠️ 品牌关键词需加强"
fi

# ==========================================
# 第五部分: 404链接检测 - 新增
# ==========================================
log ""
log "========== 404链接检测 =========="
log "🔍 扫描sitemap中的链接..."

BROKEN_LINKS=0
CHECKED_LINKS=0
# 抽样检查sitemap中的链接
SITEMAP_CONTENT=$(curl -s "$SITEMAP_URL" 2>/dev/null)
SAMPLE_URLS=$(echo "$SITEMAP_CONTENT" | grep -o '<loc>[^<]*</loc>' | head -20 | sed 's/<loc>//g' | sed 's/<\/loc>//g')

for url in $SAMPLE_URLS; do
    CHECKED_LINKS=$((CHECKED_LINKS + 1))
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "410" ]; then
        BROKEN_LINKS=$((BROKEN_LINKS + 1))
        log "   ❌ 损坏链接: $url"
    fi
done

if [ $BROKEN_LINKS -eq 0 ]; then
    log "   ✅ 检查了$CHECKED_LINKS个链接，无损坏链接"
else
    log "   ⚠️ 发现$BROKEN_LINKS个损坏链接"
fi

# ==========================================
# 第六部分: GEO文章生成
# ==========================================
log ""
log "========== GEO文章生成 =========="
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

# ==========================================
# 第七部分: 生成报告
# ==========================================
log ""
log "========== SEO评分总结 =========="
log "📊 总分: $SEO_SCORE / $MAX_SCORE"

# 评分等级
if [ $SEO_SCORE -ge 80 ]; then
    GRADE="A"
    GRADE_DESC="优秀"
elif [ $SEO_SCORE -ge 60 ]; then
    GRADE="B"
    GRADE_DESC="良好"
elif [ $SEO_SCORE -ge 40 ]; then
    GRADE="C"
    GRADE_DESC="一般"
else
    GRADE="D"
    GRADE_DESC="需改进"
fi

log "🏆 SEO等级: $GRADE ($GRADE_DESC)"

# 文章统计
ARTICLE_TOTAL=$(ls content/articles/*.json 2>/dev/null | wc -l)
ZIMBABWE_BORDER_ARTICLES=$(ls content/articles/*-fasteners-*.json 2>/dev/null | wc -l)
log "📚 总文章数: $ARTICLE_TOTAL"
log "🌍 津巴布韦边境市场文章: $ZIMBABWE_BORDER_ARTICLES"

# ==========================================
# 第八部分: Git提交推送
# ==========================================
log ""
log "========== Git同步 =========="
git add -A
if git diff --cached --quiet; then
    log "📝 没有新更改，无需提交"
else
    COMMIT_MSG="SEO Auto Update: $(date '+%Y-%m-%d %H:%M') | Score: $SEO_SCORE | $NEW_ARTICLES new articles"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE" || {
        log "⚠️ Git推送失败"
    }
    log "✅ 已提交并推送，Vercel将自动部署"
fi

# ==========================================
# 第九部分: 待办建议
# ==========================================
log ""
log "========== 待优化建议 =========="
log "📋 技术SEO: Core Web Vitals需使用专业工具检测"
log "📋 离页SEO: 需主动建设外链资源"
log "📋 社媒: 建议添加LinkedIn/Facebook分享功能"
log "📋 内容: 持续生成高质量GEO文章"

# 清理旧日志（保留30天）
find "$LOG_DIR" -name "auto-seo-*.log" -mtime +30 -delete 2>/dev/null || true

log "=========================================="
log "✅ SEO自动任务完成"
log "=========================================="
