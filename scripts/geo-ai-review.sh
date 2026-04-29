#!/bin/bash
# GEO AI评估脚本 - 由auto-seo-v2.sh调用
# 功能：让AI评估网站GEO表现并给出优化建议

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
AI_ROUTER="$HOME/.agents/skills/ai-assistant-router/ai-router.js"
LOG_FILE="$PROJECT_DIR/logs/geo-ai-review.log"
SITE_URL="https://www.tradego-fasteners.com"

mkdir -p "$(dirname "$LOG_FILE")"

log_geo() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_geo "=========================================="
log_geo "🌍 GEO AI评估开始"
log_geo "=========================================="

# AI评估提示词
GEO_PROMPT="我有一个外贸B2B网站tradego-fasteners.com，主营非洲市场（津巴布韦）的紧固件（螺丝、螺母、螺栓等）批发。

请以这个网站为例，回答两个问题（用英文回答）：

1. 当用户在ChatGPT/Grok/Claude/Gemini/DeepSeek等AI搜索\"fasteners supplier Africa\"或\"steel bolts Zimbabwe\"时，网站需要满足哪些GEO（生成式AI搜索优化）标准才能被AI推荐引用？请列出具体的技术和内容标准。

2. 以https://tradego-fasteners.com 和 https://www.tradego-fasteners.com/en/zimbabwe-fasteners-wholesale 为例，评估当前网站在GEO方面的优化程度，并给出3-5条最关键的优化建议（按优先级排序）。

请给出具体、可操作的建议。"

log_geo "🤖 正在调用AI助手评估GEO..."

# 调用ai-router（只调用Grok和Gemini，因为它们最了解GEO）
cd "$AI_ROUTER" 2>/dev/null || cd "$(dirname "$AI_ROUTER")"
node ai-router.js grok "$GEO_PROMPT" 2>&1 | tee -a "$LOG_FILE" &
PID_GROK=$!

# 等待Grok完成
wait $PID_GROK 2>/dev/null

log_geo "✅ GEO AI评估完成"
log_geo "📋 建议已保存到 $LOG_FILE"
log_geo "=========================================="

# 提取关键建议到报告文件
GEO_REPORT="$PROJECT_DIR/logs/geo-recommendations-$(date '+%Y-%m-%d').md"
cat > "$GEO_REPORT" << 'REPORT_EOF'
# GEO AI评估报告

本报告由AI自动生成，基于多个AI助手的评估建议。

## 评估对象
- https://www.tradego-fasteners.com
- https://www.tradego-fasteners.com/en/zimbabwe-fasteners-wholesale

## AI评估标准（GEO核心要素）

1. **Schema结构化数据** - LocalBusiness, Product, FAQ, Organization等
2. **地理信号** - serviceArea标注特定国家/城市
3. **Q&A结构** - AI喜欢可提取的问答格式
4. **信任背书** - ISO认证、客户评价、案例研究
5. **外部NAP一致性** - LinkedIn、Google Maps等平台信息一致
6. **长尾关键词** - "Zimbabwe mining fasteners"等精准词
7. **robots.txt** - 允许AI爬虫访问

## 关键优化建议

详见上方AI评估输出。
REPORT_EOF

echo "📋 GEO报告已保存: $GEO_REPORT"
