#!/bin/bash
# seo-pipeline-guardian.sh - SEO AI Pipeline 自修复守护器
#
# 功能:
# 1. 检测今天文章是否已发布 (curl HTTP 200)
# 2. 如果失败, 自动诊断 + 重跑
# 3. 重跑也失败, 推 Telegram
# 4. 终极保底: 用 minimax-quick.sh 直接生成简化版
#
# 创建: 2026-06-20 09:05 GMT+8
# 触发: cron 04:00 (cron 03:30 跑完 30min 后)
# 教训: 总裁批评 "到现在为止还没有建立起自修复机制"
#
# 2026-07-03 FIX: cron 裸 bash 无 env, source gateway env 让 minimax-quick 拿到 key
# 否则 stderr: "line 87: timeout: " 是 python 报 "MINIMAX_API_KEY not set"

set -e

# 加载 MiniMax API key (cron 环境下没有)
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a
  source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"
  set +a
fi

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs/seo-ai-pipeline"
LOG_FILE="$LOG_DIR/guardian-$(date +%Y-%m-%d).log"
STATE_FILE="$LOG_DIR/state.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT="${TELEGRAM_CHAT_ID:-8758157215}"

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify_telegram() {
    local msg="$1"
    if [ -n "$TELEGRAM_TOKEN" ]; then
        curl -s --max-time 10 -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT}" \
            -d "text=${msg}" \
            -d "parse_mode=Markdown" > /dev/null 2>&1 || true
    fi
}

TODAY=$(date +%Y-%m-%d)
log "=========================================="
log "🛡️ Pipeline Guardian 启动: $TODAY"
log "=========================================="

# ========== 阶段 1: 检查今天是否已成功 ==========
log "📋 阶段 1: 检查今天是否已成功"

# 1.1 检查 state.json
if [ -f "$STATE_FILE" ]; then
    LAST_RUN=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_run',''))" 2>/dev/null || echo "")
    LAST_SLUG=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_slug',''))" 2>/dev/null || echo "")
    LAST_SCORE=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_score',''))" 2>/dev/null || echo "")
    log "  state.json: last_run=$LAST_RUN, last_slug=$LAST_SLUG, score=$LAST_SCORE"
    
    if [ "$LAST_RUN" = "$TODAY" ] && [ -n "$LAST_SLUG" ]; then
        # 1.2 HTTP 验证
        HTTP_CODE=$(curl -sL --max-time 15 -o /dev/null -w "%{http_code}" "https://www.tradego-fasteners.com/en/industry/${LAST_SLUG}/" 2>/dev/null || echo "000")
        log "  HTTP check /en/industry/${LAST_SLUG}/ = $HTTP_CODE"
        
        if [ "$HTTP_CODE" = "200" ]; then
            log "✅ 今日文章已成功发布: $LAST_SLUG (score=$LAST_SCORE)"
            log "🛡️ Guardian 不需要干预, 正常退出"
            exit 0
        else
            log "⚠️ state.json 显示已跑, 但 HTTP $HTTP_CODE — 文章没真正上线"
            log "💡 启动自愈流程"
        fi
    fi
fi

log "❌ 今天没成功发布 (state.json 显示 last_run=$LAST_RUN, today=$TODAY)"

# ========== 阶段 2: 诊断 ==========
log "📋 阶段 2: 诊断最近 Pipeline 失败原因"

# 2.1 看今天的 log
if [ -f "$LOG_DIR/$TODAY.log" ]; then
    FAIL_LINES=$(grep -E "❌|FAIL|failed" "$LOG_DIR/$TODAY.log" 2>/dev/null | tail -10)
    if [ -n "$FAIL_LINES" ]; then
        log "  最近失败 (top 10):"
        echo "$FAIL_LINES" | while read line; do log "    $line"; done
    fi
fi

# 2.2 检查 AI 客户端
log "🔍 AI 客户端健康检查"
# 2026-07-03 FIX: 把 stderr 分开, 避免错误文本渗透. 严格判定: 非空且不含错误关键词
MINIMAX_OUT=$(timeout 10 bash "$PROJECT_DIR/scripts/minimax-quick.sh" "Reply OK" "MiniMax-M2.7-highspeed" 50 2>/tmp/minimax.err)
MINIMAX_ERR=$(cat /tmp/minimax.err 2>/dev/null | head -c 200)
MINIMAX_STATUS=$(echo "$MINIMAX_OUT" | head -c 100)
if [ -z "$MINIMAX_OUT" ] || echo "$MINIMAX_OUT$MINIMAX_ERR" | grep -qi "MINIMAX_API_KEY not set\|Traceback\|Error"; then
    log "  ❌ MiniMax API 异常: $MINIMAX_ERR"
    log "  (可能原因: cron 裸环境未 source env, 或 key 过期)"
else
    log "  ✅ MiniMax API 工作正常"
fi

# ========== 阶段 3: 自动重跑 Pipeline ==========
log "📋 阶段 3: 自动重跑 Pipeline (v5 修复版)"

RETRY_COUNT=${RETRY_COUNT:-0}
MAX_RETRIES=2

if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    log "🔄 重试 #$((RETRY_COUNT+1))/$MAX_RETRIES"
    
    # 后台跑 Pipeline (timeout 30 分钟)
    cd "$PROJECT_DIR"
    timeout 1800 bash "$SCRIPT_DIR/seo-ai-pipeline.sh" >> "$LOG_DIR/guardian-retry-$(date +%H%M).log" 2>&1 &
    PIPELINE_PID=$!
    log "  Pipeline PID=$PIPELINE_PID"
    
    # 监控进度 (每 5 分钟看一次, 最多等 25 分钟)
    for i in 1 2 3 4 5; do
        sleep 300
        if ! kill -0 $PIPELINE_PID 2>/dev/null; then
            log "  ✅ Pipeline 进程已退出"
            break
        fi
        log "  ⏳ Pipeline 仍在跑... ${i}x5min"
    done
    
    # 强 kill (如果还在跑)
    if kill -0 $PIPELINE_PID 2>/dev/null; then
        log "  ⚠️ Pipeline 超过 25 分钟, 强 kill"
        kill -9 $PIPELINE_PID 2>/dev/null || true
        pkill -9 -P $PIPELINE_PID 2>/dev/null || true
    fi
    
    # 验证结果
    if [ -f "$STATE_FILE" ]; then
        NEW_LAST_RUN=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_run',''))" 2>/dev/null || echo "")
        NEW_LAST_SLUG=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_slug',''))" 2>/dev/null || echo "")
        NEW_HTTP=$(curl -sL --max-time 15 -o /dev/null -w "%{http_code}" "https://www.tradego-fasteners.com/en/industry/${NEW_LAST_SLUG}/" 2>/dev/null || echo "000")
        log "  重跑后: last_run=$NEW_LAST_RUN, slug=$NEW_LAST_SLUG, HTTP=$NEW_HTTP"
        
        if [ "$NEW_LAST_RUN" = "$TODAY" ] && [ "$NEW_HTTP" = "200" ]; then
            log "🎉 自愈成功! 文章已发布"
            notify_telegram "✅ SEO Pipeline 自愈成功
📅 日期: $TODAY
🔗 Slug: $NEW_LAST_SLUG
🛡️ Guardian 自动重跑成功"
            exit 0
        fi
    fi
    
    RETRY_COUNT=$((RETRY_COUNT+1))
    log "  ⚠️ 重试失败, 准备下一轮"
fi

# ========== 阶段 4: 终极保底 — 直接 API 生成简化版 ==========
log "📋 阶段 4: 终极保底 — 用 minimax-quick.sh 生成简化版文章"

EMERGENCY_SLUG="emergency-${TODAY}-fastener-sourcing-guide"
EMERGENCY_TOPIC="Industrial Fastener Sourcing Guide for African Markets ${TODAY}"
EMERGENCY_PROMPT="Write a 1500-word SEO article (Markdown with H2/H3) for tradego-fasteners.com (China fastener manufacturer exporting to Africa).

Topic: $EMERGENCY_TOPIC

Required sections:
- Market overview
- Grade selection criteria
- Coating systems for tropical climate
- Logistics from China to Africa
- Quality assurance
- FAQ (4 questions)

Include:
- Real data (use placeholders if needed)
- Actionable B2B value
- Internal CTA to /en/contact

Output ONLY the markdown article, no preamble."

log "  调用 MiniMax M2.7-highspeed (max_tokens=6000, timeout 240s)..."
EMERGENCY_ARTICLE=$(timeout 240 bash "$PROJECT_DIR/scripts/minimax-quick.sh" "$EMERGENCY_PROMPT" "MiniMax-M2.7-highspeed" 6000 2>&1 || echo "")

if [ ${#EMERGENCY_ARTICLE} -gt 3000 ] && echo "$EMERGENCY_ARTICLE" | grep -q "^## "; then
    log "  ✅ 紧急文章生成成功 (${#EMERGENCY_ARTICLE} 字符)"
    
    # 组装 JSON
    mkdir -p "$PROJECT_DIR/content/articles"
    EMERGENCY_JSON="$PROJECT_DIR/content/articles/${EMERGENCY_SLUG}.json"
    
    python3 << PYEOF
import json, re
from datetime import datetime

article_md = """$EMERGENCY_ARTICLE"""

# Parse sections
sections = []
current = None
body = []
faqs = []
in_faq = False
for line in article_md.split('\n'):
    line = line.rstrip()
    if line.startswith('## ') and 'FAQ' not in line:
        if current:
            sections.append({"heading": {"en": current}, "body": {"en": '\n'.join(body).strip()}, "type": "text"})
        current = line[3:].strip()
        body = []
        in_faq = False
    elif 'FAQ' in line and line.startswith('## '):
        if current:
            sections.append({"heading": {"en": current}, "body": {"en": '\n'.join(body).strip()}, "type": "text"})
            current = None
        in_faq = True
    elif line.startswith('### ') and in_faq:
        if body:
            faqs.append({"q": body[0] if body else "", "a": {'en': '\n'.join(body[1:]).strip() if len(body) > 1 else ''}})
        body = [line[4:].strip()]
    elif in_faq and line.strip():
        body.append(line)
    elif current and line.strip():
        body.append(line)

if current:
    sections.append({"heading": {"en": current}, "body": {"en": '\n'.join(body).strip()}, "type": "text"})
if in_faq and body:
    faqs.append({"q": body[0] if body else "", "a": {'en': '\n'.join(body[1:]).strip() if len(body) > 1 else ''}})

LANGS = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']
def to_dict(v): return {l: v for l in LANGS}

article = {
    "slug": "$EMERGENCY_SLUG",
    "category": "Market Analysis",
    "date": "$TODAY",
    "updated": "$TODAY",
    "readTime": 8,
    "region": "africa",
    "image": f"/images/articles/$EMERGENCY_SLUG.jpg",
    "imageAlt": to_dict("$EMERGENCY_TOPIC"),
    "title": to_dict("$EMERGENCY_TOPIC"),
    "description": to_dict("Emergency fallback article - TradeGo fasteners"),
    "metaDescription": to_dict("Industrial fastener sourcing guide for Africa. TradeGo manufacturing."),
    "keywords": "fastener, Africa, sourcing, industrial, B2B",
    "author": {"name": "TradeGo", "title": "B2B Sourcing", "bio": "Auto-generated."},
    "dataSource": [],
    "sections": sections,
    "relatedProducts": [],
    "relatedArticles": [],
    "cta": {"text": to_dict("Contact TradeGo for quotes."), "buttonText": to_dict("Request Quote"), "link": "/en/contact"},
    "faq": faqs,
    "emergency": True,
    "guardian_note": "Auto-generated by seo-pipeline-guardian.sh fallback mode"
}

with open("$EMERGENCY_JSON", 'w', encoding='utf-8') as f:
    json.dump(article, f, ensure_ascii=False, indent=2)
print(f"✅ Emergency article saved: $EMERGENCY_JSON ({len(sections)} sections, {len(faqs)} FAQs)")
PYEOF
    
    # 生成占位图片 (用 SVG, 避免依赖外部 API)
    EMERGENCY_IMG="$PROJECT_DIR/public/images/articles/${EMERGENCY_SLUG}.jpg"
    if [ ! -f "$EMERGENCY_IMG" ]; then
        log "  🎨 生成占位图 (SVG→JPG placeholder)"
        python3 -c "
from PIL import Image, ImageDraw, ImageFont
img = Image.new('RGB', (1200, 675), color=(30, 58, 138))
d = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
except: font = ImageFont.load_default()
d.text((60, 280), 'TradeGo Fastener Guide', fill='white', font=font)
d.text((60, 360), '$TODAY', fill='white', font=font)
img.save('$EMERGENCY_IMG', 'JPEG', quality=85)
print('✅ Image saved')
" 2>&1 || log "  ⚠️ Image gen failed, but article will still publish"
    fi
    
    # 简化: 不 git commit, 不 Vercel deploy (太复杂, 留给明天 cron 跑)
    # 仅更新 state.json
    python3 -c "
import json
state = {
    'last_run': '$TODAY',
    'last_slug': '$EMERGENCY_SLUG',
    'last_score': 60,
    'writers': 'emergency-fallback',
    'note': 'Guardian fallback mode - emergency article generated'
}
with open('$STATE_FILE', 'w') as f:
    json.dump(state, f, indent=2)
print('✅ state.json updated (fallback mode)')
"
    
    log "  ⚠️ 文章 JSON 已生成但未 commit (fallback mode)"
    log "  💡 明早 cron 会自动 commit + deploy"
    log ""
    log "🎯 终极保底成功: 文章 JSON + state.json 已保存"
    notify_telegram "⚠️ SEO Pipeline 进入 fallback 模式
📅 日期: $TODAY
🔗 Slug: $EMERGENCY_SLUG
🛡️ Guardian 已生成简化版文章
⏳ 明早 cron 会自动 deploy
💡 正常 Pipeline 需要人工排查"
    
else
    log "❌ 终极保底也失败 — MiniMax 返回空"
    notify_telegram "🚨 SEO Pipeline 全部失败
📅 日期: $TODAY
❌ 正常 Pipeline: 失败
❌ 重跑: 失败
❌ 终极保底: MiniMax 无响应
💡 需立即人工介入
📞 联系总裁"
fi

log "=========================================="
log "🛡️ Guardian 结束: $TODAY"
log "=========================================="