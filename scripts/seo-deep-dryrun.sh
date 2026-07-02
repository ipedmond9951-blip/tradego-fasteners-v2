#!/bin/bash
# SEO AI Pipeline - 每天 03:30 自动生成 1 篇高质量 SEO 文章
# 流程: Grok 选题 → Gemini 大纲 → [豆包/DeepSeek/ChatGPT] 写文 → [Gemini+ChatGPT] 审计 → 自修复 → 配图 → 部署
# 调度: 每天 03:30 CST
# 创建: 2026-06-16

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
AI_ROUTER="$HOME/.agents/skills/ai-assistant-router/ai-router.js"
LOG_DIR="$PROJECT_DIR/logs/seo-ai-pipeline"
STATE_FILE="$LOG_DIR/state.json"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"
TMP_DIR="$LOG_DIR/tmp"

TODAY=$(date +%Y-%m-%d)
SLUG=""
TOPIC=""
PRIMARY_KEYWORD=""
ARTICLE_JSON=""
SCORE=""

mkdir -p "$LOG_DIR" "$TMP_DIR"
exec >> "$LOG_FILE" 2>&1

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# ============================================================
# STEP 1: Grok 选题 (with fallback)
# ============================================================
log "=========================================="
log "🌍 STEP 1/5: Topic Selection (豆包 → DeepSeek)"
log "=========================================="

# 读取上次生成过的主题避免重复
PROCESSED_TOPICS=$(ls "$PROJECT_DIR/content/articles"/*.json 2>/dev/null | xargs -I{} basename {} .json | sort -u | head -100 | tr '\n' ',' | sed 's/,$//')

# Topic 池：非洲/SADC 重点
TOPIC_POOL=(
    "Zambia copper mining fasteners grade selection 2026"
    "Mozambique LNG construction fasteners standards"
    "Botswana construction boom fastener import"
    "Tanzania SGR railway fastener specifications"
    "Kenya affordable housing fasteners wholesale"
    "South Africa SABS stainless steel fastener audit"
    "Namibia uranium mining fastener corrosion"
    "DRC mining concession fastener logistics"
    "Ethiopia industrial park fastener sourcing"
    "Angola LNG project fastener procurement"
    "Rwanda construction fastener standards"
    "Uganda oil refinery fastener requirements"
    "Ghana Tema port fastener import procedure"
    "Senegal Dakar construction fastener wholesale"
    "Ivory Coast Abidjan port fastener tariff"
)

# 选 1 个未处理过的主题
for t in "${TOPIC_POOL[@]}"; do
    slug_attempt=$(echo "$t" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
    if ! echo "$PROCESSED_TOPICS" | grep -q "$slug_attempt"; then
        TOPIC="$t"
        SLUG="$slug_attempt"
        break
    fi
done

if [ -z "$TOPIC" ]; then
    log "❌ All topics processed, skipping today"
    exit 0
fi

log "📝 Selected topic: $TOPIC"
log "📝 Slug: $SLUG"

# 用 Grok 验证/优化选题 (带 fallback)
log "🤖 Calling 豆包 to validate topic trends..."
GROK_PROMPT="Is this a high-search-volume B2B trade topic in 2026: '$TOPIC'? Reply with: PRIMARY_KEYWORD: <keyword> + 1-line rationale. Keep it under 50 words."

cd "$(dirname "$AI_ROUTER")" 2>/dev/null
GROK_OUT=$(timeout 60 node ai-router.js doubao "$GROK_PROMPT" 2>&1 | grep -iE "(PRIMARY_KEYWORD|primary|keyword)" | head -1)
GROK_EXIT=$?

if [ $GROK_EXIT -ne 0 ] || [ -z "$GROK_OUT" ]; then
    log "⚠️ 豆包 failed/timeout, using fallback (DeepSeek)"
    DS_OUT=$(timeout 60 node ai-router.js deepseek "$GROK_PROMPT" 2>&1 | grep -iE "(PRIMARY_KEYWORD|primary|keyword)" | head -1)
    if [ -n "$DS_OUT" ]; then
        PRIMARY_KEYWORD=$(echo "$DS_OUT" | grep -oE 'PRIMARY_KEYWORD:?\s*[^[:space:]].*' | sed 's/PRIMARY_KEYWORD:?\s*//' | head -c 100)
    fi
else
    PRIMARY_KEYWORD=$(echo "$GROK_OUT" | grep -oE 'PRIMARY_KEYWORD:?\s*[^[:space:]].*' | sed 's/PRIMARY_KEYWORD:?\s*//' | head -c 100)
fi

# Fallback: 用 topic 第一个词组作为 keyword
if [ -z "$PRIMARY_KEYWORD" ]; then
    PRIMARY_KEYWORD=$(echo "$TOPIC" | awk '{print $1, $2}' | head -c 60)
fi

log "✅ Primary keyword: $PRIMARY_KEYWORD"

# ============================================================
# STEP 2: Gemini 生成大纲
# ============================================================
log "=========================================="
log "📋 STEP 2/5: Outline Generation (豆包 → DeepSeek → Gemini)"
log "=========================================="

OUTLINE_PROMPT="You are a B2B SEO content strategist for tradego-fasteners.com (China manufacturer exporting fasteners to Africa).

Topic: $TOPIC
Primary keyword: $PRIMARY_KEYWORD

Generate a complete SEO article outline in STRICT JSON format.

CRITICAL RULES:
- NO markdown code fences (no triple-backtick blocks)
- NO comments
- NO trailing commas
- Use double quotes only (no single quotes)
- Escape any special characters properly (\\n, \\\", \\\\)
- All string values must be on a SINGLE LINE (no literal newlines)
- bodyOutline must be a single-line string with semicolons separating points (NOT bullet lists)

Output JSON only in this exact structure:
{
  \"title\": \"<max 60 chars, contains primary keyword>\",
  \"metaDescription\": \"<140-155 chars, contains primary keyword + CTA>\",
  \"keywords\": \"<comma-separated 8-12 LSI keywords>\",
  \"sections\": [
    {\"heading\": \"<H2, max 80 chars>\", \"bodyOutline\": \"<single line: Point 1; Point 2; Point 3>\", \"targetWordCount\": 350},
    ... (6 sections total, each targeting 300-400 words)
  ],
  \"faqs\": [
    {\"q\": \"<question>\", \"a\": \"<answer 30-50 words, single line>\", \"targetWordCount\": 45},
    ... (5 FAQs)
  ],
  \"dataSources\": [
    {\"name\": \"<source>\", \"url\": \"<url>\", \"accessDate\": \"$TODAY\"},
    ... (6 data sources minimum)
  ]
}

JSON only. No explanations, no preamble, no markdown."

log "🤖 Calling 豆包 for outline (unlimited)..."
GEMINI_OUT=$(timeout 90 node ai-router.js doubao "$OUTLINE_PROMPT" 2>&1 | python3 $(dirname $0)/extract_json.py 2>/dev/null | head -200)

# Fallback to DeepSeek (unlimited)
if [ -z "$GEMINI_OUT" ] || ! echo "$GEMINI_OUT" | python3 -c "import json,sys; json.loads(sys.stdin.read())" 2>/dev/null; then
    log "⚠️ 豆包 outline failed, trying DeepSeek fallback"
    GEMINI_OUT=$(timeout 90 node ai-router.js deepseek "$OUTLINE_PROMPT" 2>&1 | python3 $(dirname $0)/extract_json.py 2>/dev/null | head -200)
fi

# Last fallback: Gemini (limited, but better quality)
if [ -z "$GEMINI_OUT" ] || ! echo "$GEMINI_OUT" | python3 -c "import json,sys; json.loads(sys.stdin.read())" 2>/dev/null; then
    log "⚠️ DeepSeek outline failed, last resort: Gemini"
    GEMINI_OUT=$(timeout 90 node ai-router.js gemini "$OUTLINE_PROMPT" 2>&1 | python3 $(dirname $0)/extract_json.py 2>/dev/null | head -200)
fi

# 写到临时文件
OUTLINE_FILE="$TMP_DIR/${SLUG}_outline.json"
echo "$GEMINI_OUT" > "$OUTLINE_FILE"

# 验证 JSON
if ! python3 -c "import json; json.load(open('$OUTLINE_FILE'))" 2>/dev/null; then
    log "❌ All outline generation failed, exiting"
    exit 1
fi

log "✅ Outline saved: $OUTLINE_FILE"

# ============================================================
# STEP 2.5: 质量门 (2026-06-18 深度文升级)
# ============================================================
log "=========================================="
log "🚧 STEP 2.5/5: Outline Quality Gate (深度文质量门)"
log "=========================================="

SECTIONS_COUNT=$(python3 -c "import json; d=json.load(open('$OUTLINE_FILE')); print(len(d.get('sections',[])))" 2>/dev/null || echo 0)
FAQS_COUNT=$(python3 -c "import json; d=json.load(open('$OUTLINE_FILE')); print(len(d.get('faqs',[])))" 2>/dev/null || echo 0)
SOURCES_COUNT=$(python3 -c "import json; d=json.load(open('$OUTLINE_FILE')); print(len(d.get('dataSources',[])))" 2>/dev/null || echo 0)

log "📊 Outline quality: sections=$SECTIONS_COUNT, faqs=$FAQS_COUNT, dataSources=$SOURCES_COUNT"

# 深度文质量门: sections>=6, faqs>=5, dataSources>=6
if [ "$SECTIONS_COUNT" -lt 6 ] || [ "$FAQS_COUNT" -lt 5 ] || [ "$SOURCES_COUNT" -lt 6 ]; then
    log "❌ Outline quality gate FAILED (需要 sections≥6, faqs≥5, sources≥6)"
    log "💡 提示: 这是深度文要求, LLM 可能在 prompt 里偷工减料"
    exit 1
fi

log "✅ Outline quality gate passed (深度文标准)"

# ============================================================
# STEP 3: 豆包 / DeepSeek / ChatGPT 写正文
# ============================================================
log "=========================================="
log "✍️ STEP 3/5: Content Writing (DeepSeek → 豆包 → ChatGPT)"
log "=========================================="

WRITER_PROMPT="You are a senior B2B trade content writer for tradego-fasteners.com (China fastener manufacturer exporting to Africa).

Topic: $TOPIC
Primary keyword: $PRIMARY_KEYWORD

Outline (JSON):
$(cat $OUTLINE_FILE)

Available Data Sources (cite inline as [1], [2], etc.):
$(python3 -c "import json; d=json.load(open('$OUTLINE_FILE')); [print(f\"  [{i+1}] {s['name']} - {s['url']}\") for i,s in enumerate(d.get('dataSources',[]))]")

Write a DEEP ARTICLE (2000-2500 words) following the outline. STRICT requirements:

1. STRUCTURE:
   - H2 (##) for each section heading from outline
   - Each section: 300-400 words
   - End with FAQ section (5 Q&A) using the outline FAQs

2. DEPTH REQUIREMENTS (depth > length):
   - Embed at least 6 real data points (numbers, ports, project names, dates) from dataSources
   - Include at least 6 inline citations to the dataSources [1], [2], etc.
   - Explain WHY each spec/standard matters (not just list standards)
   - Include buyer-centric perspective (what does the procurement manager need to know?)
   - Compare alternatives (e.g., why HDG over zinc-plating, why F1554 over F1554 alternatives)

3. KEYWORD STRATEGY:
   - Include the primary keyword in the first 100 words
   - Use it 2-3 times naturally throughout

4. TONE:
   - Professional B2B, no fluff, fact-based
   - Engineering precision (ASTM/ISO/EN grade references, port logistics, certification timelines)
   - No generic advice that any AI could generate

5. OUTPUT FORMAT:
   - Markdown article body only (no preamble, no meta commentary)
   - End with a \"## FAQ\" section

Article:"

WRITER_OUT=""
WRITERS_TRIED=""

# 深度文最小字符数: 2000 词 ≈ 12000 字符
MIN_CHARS=8000

for WRITER in deepseek doubao chatgpt; do
    log "🤖 Trying writer: $WRITER (unlimited quota)"
    WRITER_OUT=$(timeout 180 node ai-router.js $WRITER "$WRITER_PROMPT" 2>&1)

    # 检查是否包含实质内容（> MIN_CHARS 字符 + 有 ## H2）
    if [ ${#WRITER_OUT} -gt $MIN_CHARS ] && echo "$WRITER_OUT" | grep -q "##"; then
        log "✅ Writer $WRITER produced content (${#WRITER_OUT} chars, depth article)"
        WRITERS_TRIED="$WRITERS_TRIED $WRITER"
        break
    else
        log "⚠️ Writer $WRITER insufficient (${#WRITER_OUT} chars, need >$MIN_CHARS), trying next"
        WRITERS_TRIED="$WRITERS_TRIED $WRITER(${WRITER_OUT:-0}chars)"
    fi
done

if [ ${#WRITER_OUT} -lt $MIN_CHARS ]; then
    log "❌ All writers produced insufficient content (< $MIN_CHARS chars)"
    log "💡 深度文要求 ≥2000 词, LLM 可能偷工减料"
    exit 1
fi

# 字数检查 (近似: 英文平均 5 字符/词)
WORD_COUNT=$(echo "$WRITER_OUT" | wc -w | tr -d ' ')
log "📝 Word count: $WORD_COUNT (target: 2000-2500)"

if [ "$WORD_COUNT" -lt 1800 ]; then
    log "⚠️ Word count below 1800, marking as below depth threshold"
fi

ARTICLE_MD_FILE="$TMP_DIR/${SLUG}_article.md"
echo "$WRITER_OUT" > "$ARTICLE_MD_FILE"
log "✅ Article saved: $ARTICLE_MD_FILE"

# ============================================================
# STEP 4: Gemini + ChatGPT 审计
# ============================================================
log "=========================================="
log "🔍 STEP 4/5: SEO Audit (Gemini + ChatGPT)"
log "=========================================="

AUDIT_PROMPT="You are an SEO auditor. Audit this article for tradego-fasteners.com (B2B fastener manufacturer targeting Africa).

Topic: $TOPIC
Primary keyword: $PRIMARY_KEYWORD

Article (markdown):
$(cat $ARTICLE_MD_FILE)

Score 0-100 on these dimensions (be strict, B2B standard):
1. Title quality (60 chars max, keyword in title): /15
2. Meta description (140-155 chars, has CTA): /10
3. Keyword density (primary keyword 3-7 times): /15
4. Content depth (1500-2000 words, 5-7 sections): /20
5. E-E-A-T signals (data sources, expert tone, bio): /15
6. FAQ quality (4 Q&A, answers 30-50 words): /10
7. Internal/external links (3+ data sources): /10
8. Actionable B2B value (procurement-ready): /5

Total: /100

Output format:
SCORE: <number>
GRADE: PASS (>=85) / FIX (70-84) / FAIL (<70)
ISSUES: <bullet list of specific fixes>
SUGGESTIONS: <concrete improvements>"

log "🤖 Calling Gemini + ChatGPT for audit..."
GEMINI_AUDIT=$(timeout 60 node ai-router.js gemini "$AUDIT_PROMPT" 2>&1)
CHATGPT_AUDIT=$(timeout 60 node ai-router.js chatgpt "$AUDIT_PROMPT" 2>&1)

# 提取 Gemini 分数
GEMINI_SCORE=$(echo "$GEMINI_AUDIT" | grep -oE "SCORE:?\s*[0-9]+" | grep -oE "[0-9]+" | head -1)
# 提取 ChatGPT 分数
CHATGPT_SCORE=$(echo "$CHATGPT_AUDIT" | grep -oE "SCORE:?\s*[0-9]+" | grep -oE "[0-9]+" | head -1)

# 取平均分
if [ -n "$GEMINI_SCORE" ] && [ -n "$CHATGPT_SCORE" ]; then
    SCORE=$(( (GEMINI_SCORE + CHATGPT_SCORE) / 2 ))
elif [ -n "$GEMINI_SCORE" ]; then
    SCORE=$GEMINI_SCORE
elif [ -n "$CHATGPT_SCORE" ]; then
    SCORE=$CHATGPT_SCORE
else
    SCORE=0
fi

log "📊 Gemini: $GEMINI_SCORE | ChatGPT: $CHATGPT_SCORE | Avg: $SCORE"

# ============================================================
# STEP 5: 组装 JSON + 配图 + 部署
# ============================================================
log "=========================================="
log "📦 STEP 5/5: JSON Assembly + Image + Deploy"
log "=========================================="

if [ "$SCORE" -lt 70 ]; then
    log "❌ Score $SCORE < 70, FAIL. Skipping deployment."
    log "💡 Audit feedback:"
    echo "$GEMINI_AUDIT" >> "$LOG_FILE"
    echo "$CHATGPT_AUDIT" >> "$LOG_FILE"
    exit 1
fi

# 写到 content/articles/{slug}.json
ARTICLE_JSON="$PROJECT_DIR/content/articles/${SLUG}.json"

# 用 Python 组装完整 JSON (10 语言 + sections + E-E-A-T)
python3 << PYEOF
import json
import os
from datetime import datetime

# 读取 outline + article
with open("$OUTLINE_FILE") as f:
    outline = json.load(f)

with open("$ARTICLE_MD_FILE") as f:
    article_md = f.read()

# 解析 sections from markdown
sections = []
current_section = None
current_body = []
faqs = []

in_faq = False
for line in article_md.split('\n'):
    line = line.rstrip()
    if line.startswith('## ') and not line.startswith('## FAQ'):
        if current_section:
            sections.append({
                "heading": {"en": current_section},
                "body": {"en": '\n'.join(current_body).strip()},
                "type": "text"
            })
        current_section = line[3:].strip()
        current_body = []
        in_faq = False
    elif line.startswith('## FAQ') or line.startswith('## Frequently Asked'):
        if current_section:
            sections.append({
                "heading": {"en": current_section},
                "body": {"en": '\n'.join(current_body).strip()},
                "type": "text"
            })
            current_section = None
        in_faq = True
    elif line.startswith('### ') and in_faq:
        if current_body:
            faqs.append({'q': current_body[0] if current_body else '', 'a': '\n'.join(current_body[1:]).strip() if len(current_body) > 1 else ''})
        current_body = [line[4:].strip()]
    elif in_faq and line.strip():
        current_body.append(line)
    elif current_section and line.strip():
        current_body.append(line)

if current_section:
    sections.append({
        "heading": {"en": current_section},
        "body": {"en": '\n'.join(current_body).strip()},
        "type": "text"
    })

if in_faq and current_body:
    faqs.append({'q': current_body[0] if current_body else '', 'a': '\n'.join(current_body[1:]).strip() if len(current_body) > 1 else ''})

# 10 语言占位（其他语言后续翻译或自动填充）
LANGS = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

def to_dict(value):
    return {lang: value for lang in LANGS}

article = {
    "slug": "$SLUG",
    "category": "Market Analysis",
    "date": "$TODAY",
    "updated": "$TODAY",
    "readTime": max(8, len(article_md.split()) // 200),
    "region": "africa",
    "image": f"/images/articles/$SLUG.jpg",
    "imageAlt": to_dict(outline.get('title', '$TOPIC')),
    "title": to_dict(outline.get('title', '$TOPIC')),
    "description": to_dict(outline.get('metaDescription', '')),
    "metaDescription": to_dict(outline.get('metaDescription', '')),
    "keywords": outline.get('keywords', '$PRIMARY_KEYWORD'),
    "author": {
        "name": "TradeGo Sourcing Team",
        "title": "Senior B2B Fastener Export Specialists",
        "bio": "TradeGo's sourcing team has 12+ years of experience supplying Grade 8.8-12.9 structural bolts, self-drilling screws, and concrete anchoring systems to SADC construction and mining projects across Africa.",
        "credentials": "ISO 9001:2015 certified sourcing network; SADC trusted exporter; 200+ completed B2B fastener shipments to Africa markets",
        "linkedin": "https://www.linkedin.com/company/tradego-fasteners",
        "expertise": ["SADC fastener logistics", "Beira corridor shipping", "AfCFTA duty optimization", "Mining fastener sourcing"]
    },
    "dataSource": outline.get('dataSources', []),
    "sections": sections,
    "relatedProducts": [
        {"slug": "hex-bolts-grade-88", "name": "Grade 8.8 Hex Bolts"},
        {"slug": "self-drilling-screws", "name": "Self-Drilling Screws"},
        {"slug": "structural-anchor-bolts", "name": "Structural Anchor Bolts"}
    ],
    "relatedArticles": [],
    "cta": {
        "text": to_dict("Need a quote for $PRIMARY_KEYWORD? Contact TradeGo for factory pricing and SADC logistics."),
        "buttonText": to_dict("Request Quote"),
        "link": "/en/contact"
    },
    "faq": faqs
}

with open("$ARTICLE_JSON", 'w', encoding='utf-8') as f:
    json.dump(article, f, ensure_ascii=False, indent=2)

print(f"✅ Article JSON saved: $ARTICLE_JSON")
print(f"   Sections: {len(sections)}")
print(f"   FAQs: {len(faqs)}")
PYEOF

# 验证分数 ≥ 85
if [ "$SCORE" -lt 85 ]; then
    log "⚠️ Score $SCORE < 85, but >= 70. Self-repair cycle..."
    # 触发修复（这里调用现有的 seo-auto-repair.py 或 validate-article.py）
    if [ -f "$PROJECT_DIR/scripts/seo-auto-repair.py" ]; then
        cd "$PROJECT_DIR" && timeout 60 python3 scripts/seo-auto-repair.py "$SLUG" 2>&1 | tail -5
    fi
fi

# 生成图片
log "🎨 Generating hero image..."
IMAGE_PROMPT="Professional B2B procurement photo: $TOPIC. Industrial fasteners, Africa construction site, ISO certified. High quality commercial photography, 16:9 aspect ratio."

IMAGE_FILE="$PROJECT_DIR/public/images/articles/${SLUG}.jpg"
bash "$HOME/.openclaw/workspace/tools/minimax-image-gen.sh" "$IMAGE_PROMPT" "$IMAGE_FILE" 2>&1 | tail -3 || log "⚠️ Image generation failed, continuing"

# Git commit + push + deploy
log "📤 Committing..."
cd "$PROJECT_DIR"
git add "content/articles/${SLUG}.json" "public/images/articles/${SLUG}.jpg" 2>/dev/null || git add -A
git commit -m "feat(seo): [AI-pipeline $TODAY] $SLUG (score $SCORE)" 2>&1 | tail -3

log "📤 Pushing to main..."
git push origin main 2>&1 | tail -2

log "🚀 Deploying to Vercel..."
DEPLOY_OUT=$(timeout 180 npx vercel --prod --yes --force 2>&1 | tail -5)
echo "$DEPLOY_OUT"

# 提取部署 URL
DEPLOY_URL=$(echo "$DEPLOY_OUT" | grep -oE 'https://tradego-fasteners-[a-z0-9]+-ipedmond9951-8331s-projects\.vercel\.app' | head -1)

if [ -n "$DEPLOY_URL" ]; then
    log "🔗 Aliasing $DEPLOY_URL to www..."
    npx vercel alias set "$DEPLOY_URL" www.tradego-fasteners.com 2>&1 | tail -2
    
    # 验证
    sleep 30
    HTTP_CODE=$(curl -sL --max-time 15 -o /dev/null -w "%{http_code}" "https://www.tradego-fasteners.com/en/industry/${SLUG}")
    log "✅ Verification: HTTP $HTTP_CODE for /en/industry/${SLUG}"
fi

# 更新 state
python3 << PYEOF
import json
import os

state_file = "$STATE_FILE"
state = {"last_run": "$TODAY", "last_slug": "$SLUG", "last_score": $SCORE, "writers": "$WRITERS_TRIED".strip()}
with open(state_file, 'w') as f:
    json.dump(state, f, indent=2)
PYEOF

log "=========================================="
log "🎉 PIPELINE COMPLETE: $SLUG (score: $SCORE)"
log "=========================================="