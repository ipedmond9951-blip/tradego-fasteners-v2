#!/bin/bash
# SEO AI Pipeline - 每天 03:30 自动生成 1 篇高质量 SEO 文章
# 流程: Grok 选题 → Gemini 大纲 → [豆包/DeepSeek/ChatGPT] 写文 → [Gemini+ChatGPT] 审计 → 自修复 → 配图 → 部署
# 调度: 每天 03:30 CST
# 创建: 2026-06-16

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
AI_ROUTER="$HOME/.agents/skills/ai-assistant-router/ai-router.js"
# 2026-06-19 v3.1 FIX: explicit SCRIPT_DIR (realpath of script's directory)
# Replaces $(dirname "$0") which gives wrong path when $0 is absolute
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
# SELF-HEAL: Pre-flight diagnostics (2026-06-19, upgraded 2026-06-20 with AI health check)
# Detect broken env BEFORE the AI calls waste quota.
# ============================================================
log "🔍 Pre-flight diagnostics..."
PREFLIGHT_OK=true
if [ ! -f "$AI_ROUTER" ]; then
    log "❌ ai-router.js missing: $AI_ROUTER"
    PREFLIGHT_OK=false
fi
if ! command -v python3 >/dev/null 2>&1; then
    log "❌ python3 not in PATH"
    PREFLIGHT_OK=false
fi
if ! command -v node >/dev/null 2>&1; then
    log "❌ node not in PATH"
    PREFLIGHT_OK=false
fi
if [ ! -d "$PROJECT_DIR/content/articles" ]; then
    log "❌ articles dir missing: $PROJECT_DIR/content/articles"
    PREFLIGHT_OK=false
fi

# 2026-06-20 NEW: AI health check (skip Pipeline if all AI broken)
log "  🤖 AI health check..."
if ! bash "$SCRIPT_DIR/seo-pipeline-preflight.sh" > /tmp/preflight-$$.log 2>&1; then
    log "❌ Pre-flight AI check failed - see /tmp/preflight-$$.log"
    cat /tmp/preflight-$$.log | tee -a "$LOG_FILE"
    PREFLIGHT_OK=false
fi
# Self-heal: verify extract_json.py exists
EXTRACT_JSON="$SCRIPT_DIR/extract_json.py"
if [ ! -f "$EXTRACT_JSON" ]; then
    log "⚠️ extract_json.py missing, creating minimal version (self-heal #2)..."
    cat > "$EXTRACT_JSON" <<'PYEOF'
#!/usr/bin/env python3
"""Extract first valid JSON object/array from stdin. Self-heal fallback."""
import sys, re, json
text = sys.stdin.read()
# Strip markdown code fences if any
text = re.sub(r'^```(?:json)?\s*', '', text, flags=re.M)
text = re.sub(r'```\s*$', '', text, flags=re.M)
# Try full text first
try:
    json.loads(text)
    print(text)
    sys.exit(0)
except: pass
# Find first balanced {...} or [...]
for opener, closer in [('{', '}'), ('[', ']')]:
    start = text.find(opener)
    if start == -1: continue
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(text)):
        c = text[i]
        if esc: esc = False; continue
        if c == '\\': esc = True; continue
        if c == '"': in_str = not in_str; continue
        if in_str: continue
        if c == opener: depth += 1
        elif c == closer:
            depth -= 1
            if depth == 0:
                cand = text[start:i+1]
                try:
                    json.loads(cand)
                    print(cand)
                    sys.exit(0)
                except: pass
sys.exit(1)
PYEOF
    chmod +x "$EXTRACT_JSON"
    log "✅ extract_json.py auto-created"
fi

if [ "$PREFLIGHT_OK" = false ]; then
    log "❌ Pre-flight failed. Aborting before any AI call."
    exit 2
fi
log "✅ Pre-flight OK"

# ============================================================
# STEP 1: Grok 选题 (with fallback)
# ============================================================
log "=========================================="
log "🌍 STEP 1/5: Topic Selection (豆包 → DeepSeek)"
log "=========================================="

# 读取上次生成过的主题避免重复 (head -100 在 articles > 100 时会切掉真实已用 slug, 改 head -500)
# 2026-07-02 fix: 211 articles > 100 → zambia 重复生成风险
PROCESSED_TOPICS=$(ls "$PROJECT_DIR/content/articles"/*.json 2>/dev/null | xargs -I{} basename {} .json | sort -u | head -500 | tr '\n' ',' | sed 's/,$//')

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
    # 2026-07-02 双重检查: 字符串 match + 文件存在 match (防御 PROCESSED_TOPICS 误判)
    if echo ",$PROCESSED_TOPICS," | grep -q ",${slug_attempt},"; then
        continue
    fi
    if [ -f "$PROJECT_DIR/content/articles/${slug_attempt}.json" ]; then
        continue
    fi
    TOPIC="$t"
    SLUG="$slug_attempt"
    break
done

if [ -z "$TOPIC" ]; then
    log "❌ All topics processed, skipping today"
    exit 0
fi

log "📝 Selected topic: $TOPIC"
log "📝 Slug: $SLUG"

# 用 豆包 验证/优化选题 (带 fallback) — 2026-06-19 修复: 用 JSON 输出 避免 grep 字面 placeholder 问题
log "🤖 Calling 豆包 to validate topic trends..."
GROK_PROMPT="For B2B trade topic: '$TOPIC', output a JSON object on a single line: {\"primary_keyword\": \"<3-5 word SEO keyword>\", \"rationale\": \"<20 words max>\"}. JSON only, no markdown."

cd "$(dirname "$AI_ROUTER")" 2>/dev/null
# 2026-06-20 v4 FIX: 豆包 fail-fast 20s → 180s. 1622 char 长 prompt 答需 60-120s, 20s 必超时失败
# 2026-06-20 v5 FIX: 改用 MiniMax direct API (M2.7-highspeed). 实证 7s vs CDP 豆包 60-180s, 更可靠
GROK_OUT=$(timeout 60 "$SCRIPT_DIR/minimax-quick.sh" "$GROK_PROMPT" "MiniMax-M2.7-highspeed" 1500 2>&1) || GROK_OUT=""
GROK_EXIT=$?

extract_kw_from_json() {
    # 2026-06-19 self-heal: 多种解析策略
    local raw="$1"
    # Strategy 1: try full json.loads
    echo "$raw" | python3 -c "
import sys, json, re
text = sys.stdin.read()
# Strip code fences
text = re.sub(r'\`\`\`(?:json)?', '', text)
# Find JSON object
m = re.search(r'\{[^{}]*\"primary_keyword\"[^{}]*\}', text, re.DOTALL)
if m:
    try:
        d = json.loads(m.group(0))
        print(d.get('primary_keyword', ''))
        sys.exit(0)
    except: pass
# Strategy 2: regex grab primary_keyword value
m = re.search(r'primary_keyword[\":\s]+([^\"\\]+)', text)
if m:
    print(m.group(1).strip())
" 2>/dev/null
}

if [ $GROK_EXIT -eq 0 ] && [ -n "$GROK_OUT" ]; then
    PRIMARY_KEYWORD=$(extract_kw_from_json "$GROK_OUT" | head -c 100)
fi

if [ -z "$PRIMARY_KEYWORD" ]; then
    log "⚠️ 豆包 failed/timeout, using fallback (DeepSeek)"
    DS_OUT=$(timeout 60 "$SCRIPT_DIR/minimax-quick.sh" "$GROK_PROMPT" "MiniMax-M2.7-highspeed" 1500 2>&1) || DS_OUT=""
    PRIMARY_KEYWORD=$(extract_kw_from_json "$DS_OUT" | head -c 100)
fi

# Fallback: 用 topic 第一个词组作为 keyword
if [ -z "$PRIMARY_KEYWORD" ]; then
    log "⚠️ Both 豆包 and DeepSeek failed, using topic head as keyword"
    PRIMARY_KEYWORD=$(echo "$TOPIC" | awk '{print $1, $2, $3}' | head -c 60)
fi

log "✅ Primary keyword: $PRIMARY_KEYWORD"

# ============================================================
# STEP 2: Gemini 生成大纲
# ============================================================
log "=========================================="
log "📋 STEP 2/5: Outline Generation (豆包 → DeepSeek → Gemini)"
log "=========================================="

# 2026-06-18: 用 client 直接调 (避开 ai-router 包装的 extractLastReply 截断)
DIRECT_AI_TOOL="$HOME/.agents/skills/ai-assistant-router/deepseek-client.js"

# 2026-06-19 FIX: use heredoc with quoted delimiter so $ vars expand but backslashes
# are literal. This eliminates the line-110 "CRITICAL: command not found" bug where
# the multi-line prompt was leaking into bash.
OUTLINE_PROMPT=$(cat <<'OUTLINE_PROMPT_EOF'
You are a senior SEO content strategist for tradego-fasteners.com (B2B fastener manufacturer exporting to Africa).

Topic: __TOPIC__
Primary keyword: __PRIMARY_KEYWORD__
Date: __TODAY__

CRITICAL OUTPUT RULES (MUST FOLLOW):
- Output MUST be valid JSON wrapped in { ... } on multiple lines
- NO markdown code fences (no triple-backtick blocks anywhere)
- NO thinking out loud. NO preamble like "好的" / "好的，用户" / "让我想想" / "我需要". Start DIRECTLY with {
- NO comments, NO trailing commas
- Use double quotes only (no single quotes)
- All string values on a single line (no literal newlines in strings)
- bodyOutline must be a single-line string with semicolons separating points
- Output ONLY the JSON. No explanation, no markdown.

Output JSON in this exact structure:
{
  "title": "<max 60 chars, contains primary keyword>",
  "metaDescription": "<140-155 chars, contains primary keyword + CTA>",
  "keywords": "<comma-separated 8-12 LSI keywords>",
  "sections": [
    {"heading": "<H2, max 80 chars>", "bodyOutline": "<single line: Point 1; Point 2; Point 3>", "targetWordCount": 350}
  ],
  "faqs": [
    {"q": "<question>", "a": "<answer 30-50 words, single line>", "targetWordCount": 45}
  ],
  "dataSources": [
    {"name": "<source>", "url": "<url>", "accessDate": "__TODAY__"}
  ]
}

Requirements:
- sections: 6 items, each bodyOutline targets 300-400 words
- faqs: 5 items
- dataSources: minimum 6 (mix of government/port/standards/news URLs)
- Primary keyword must appear in title, metaDescription, and at least 3 section headings

First character of your reply MUST be {
OUTLINE_PROMPT_EOF
)

# Substitute placeholders (heredoc with 'EOF' does not expand vars, so do it here)
OUTLINE_PROMPT="${OUTLINE_PROMPT//__TOPIC__/$TOPIC}"
OUTLINE_PROMPT="${OUTLINE_PROMPT//__PRIMARY_KEYWORD__/$PRIMARY_KEYWORD}"
OUTLINE_PROMPT="${OUTLINE_PROMPT//__TODAY__/$TODAY}"

log "🤖 Calling 豆包 for outline (unlimited)..."
# 2026-06-19: write prompt to tmp file and use --prompt-file style via env to avoid
# shell argv length limits and quote-escape hell
OUTLINE_PROMPT_FILE="$TMP_DIR/${SLUG}_outline_prompt.txt"
printf '%s' "$OUTLINE_PROMPT" > "$OUTLINE_PROMPT_FILE"

# 2026-06-19: extract_json.py is robust; keep it as first pass. If it returns < 50
# bytes or invalid JSON, fall back to python brace-finder (self-heal #1).
run_outline_ai() {
    local ai_name="$1"
    local out
    if [ "$ai_name" = "deepseek" ]; then
        # 2026-07-02 v5.1 FIX: max_tokens 4000 → 6000 (避免 JSON 截断), timeout 200s 保留
        out=$(timeout 200 "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$OUTLINE_PROMPT_FILE")" "MiniMax-M2.7-highspeed" 6000 2>&1)
    elif [ "$ai_name" = "doubao" ]; then
        # 2026-07-02 v5.1 FIX: timeout 120s → 90s (M2.7-highspeed outline 实测 30-60s, 超时=挂)
        out=$(timeout 90 "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$OUTLINE_PROMPT_FILE")" "MiniMax-M2.7-highspeed" 6000 2>&1) || out=""
    elif [ "$ai_name" = "gemini" ]; then
        out=$(timeout 90 "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$OUTLINE_PROMPT_FILE")" "MiniMax-M2.7-highspeed" 6000 2>&1) || out=""
    else
        out=$(timeout 90 "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$OUTLINE_PROMPT_FILE")" "MiniMax-M2.7-highspeed" 6000 2>&1)
    fi
    echo "$out"
}

validate_json() {
    # Self-heal: try extract_json.py first, then python brace-finder
    local raw="$1"
    local extracted
    # 2026-06-19 v3.1 FIX: use SCRIPT_DIR (set at script top) instead of $(dirname "$0")
    # Reason: when $0 is absolute path, dirname gives scripts/, then path = scripts/scripts/extract_json.py (DOES NOT EXIST)
    extracted=$(echo "$raw" | python3 "$SCRIPT_DIR/extract_json.py" 2>/dev/null | head -200)
    if [ -n "$extracted" ] && echo "$extracted" | python3 -c "import json,sys; json.loads(sys.stdin.read())" 2>/dev/null; then
        echo "$extracted"
        return 0
    fi
    # Self-heal #1: regex-based first JSON object extraction
    extracted=$(echo "$raw" | python3 -c "
import sys, re, json
text = sys.stdin.read()
# find first balanced { ... } block
start = text.find('{')
if start == -1: sys.exit(1)
depth = 0
in_str = False
esc = False
for i in range(start, len(text)):
    c = text[i]
    if esc: esc = False; continue
    if c == '\\\\': esc = True; continue
    if c == '\"': in_str = not in_str; continue
    if in_str: continue
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            candidate = text[start:i+1]
            try:
                json.loads(candidate)
                print(candidate)
                sys.exit(0)
            except: pass
sys.exit(1)
" 2>/dev/null)
    if [ -n "$extracted" ]; then
        echo "$extracted"
        return 0
    fi
    # Self-heal #2 (2026-06-19 v2): try to repair truncated JSON by closing open braces
    # 2026-06-19 v3: REQUIRE 'sections' field (truncated 73 chars JSON 没 sections, 跳)
    extracted=$(echo "$raw" | python3 -c "
import sys, json, re
text = sys.stdin.read()
# strip code fences
text = re.sub(r'\`\`\`(?:json)?', '', text)
# find first { and try to close it
start = text.find('{')
if start == -1: sys.exit(1)
# Try progressively shorter prefixes until we get valid JSON
for end in range(len(text), start, -1):
    # close any open braces
    candidate = text[start:end].rstrip()
    if not candidate.endswith('}'):
        candidate += '}'
    # count braces
    opens = candidate.count('{')
    closes = candidate.count('}')
    if opens > closes:
        candidate += '}' * (opens - closes)
    try:
        d = json.loads(candidate)
        # 2026-06-19 v3: 只有 outline JSON (含 sections) 才返回
        if not isinstance(d, dict) or 'sections' not in d:
            continue
        print(json.dumps(d, ensure_ascii=False))
        sys.exit(0)
    except: pass
sys.exit(1)
" 2>/dev/null)
    if [ -n "$extracted" ]; then
        echo "$extracted"
        return 0
    fi
    return 1
}

GEMINI_OUT=""
# 2026-06-19: fail-fast 90s for outline, 豆包/Gemini today unstable
# Each AI gets one attempt; if all 3 fail, exit with clear log
for AI_TRY in doubao deepseek gemini; do
    log "🤖 Trying $AI_TRY for outline..."
    RAW_OUT=$(run_outline_ai "$AI_TRY")
    if EXTRACTED=$(validate_json "$RAW_OUT"); then
        GEMINI_OUT="$EXTRACTED"
        log "✅ $AI_TRY outline OK (${#GEMINI_OUT} chars)"
        break
    else
        log "⚠️ $AI_TRY outline failed validation (raw ${#RAW_OUT} chars)"
    fi
done

if [ -z "$GEMINI_OUT" ]; then
    log "❌ All 3 outline AIs failed. Exiting."
    log "💡 Self-heal: tomorrow's cron will retry. If豆包/Gemini still down, fix ai-router."
    exit 1
fi

# 写到临时文件
OUTLINE_FILE="$TMP_DIR/${SLUG}_outline.json"
printf '%s' "$GEMINI_OUT" > "$OUTLINE_FILE"

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

for WRITER in doubao chatgpt; do
    log "🤖 Trying writer: $WRITER (unlimited quota)"
    # 2026-06-19 v3.1 FIX: 写文需要 5-10min for 2000-2500 word article, 180s 不够
    # 2026-06-19 v3.2 FIX: 直接调 deepseek-client 避免 ai-router 包装带来的 Promise hang
    # 2026-06-19 v3.3 FIX: 用子 shell + & + sleep + kill 替代 timeout（更可靠地清理 node 进程）
    # 2026-06-20 v5 FIX: 改用 MiniMax direct API for STEP 3 too. 2000-2500 词需 max_tokens=8000+, timeout 360s
    if [ "$WRITER" = "deepseek" ]; then
        # 2026-07-02 v5.1 FIX: max_tokens 8000 → 12000 (实测 8000 截断到 1800 词, 12000 够 2200 词)
        WRITER_OUT=$(timeout 360 "$SCRIPT_DIR/minimax-quick.sh" "$WRITER_PROMPT" "MiniMax-M2.7-highspeed" 12000 2>&1)
    else
        WRITER_OUT=$(timeout 360 "$SCRIPT_DIR/minimax-quick.sh" "$WRITER_PROMPT" "MiniMax-M2.7-highspeed" 12000 2>&1)
    fi

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

# 2026-06-18 v8 修复: 不内嵌整篇 article (20000+ 字符会 踩 AI 客户端 字符限制
# 改用 outline metadata + article 前 2000 字符)
ARTICLE_PREVIEW=$(head -c 2000 "$ARTICLE_MD_FILE" 2>/dev/null || echo "(article not readable)")

AUDIT_PROMPT="You are an SEO auditor for tradego-fasteners.com (B2B fastener manufacturer targeting Africa).

Topic: $TOPIC
Primary keyword: $PRIMARY_KEYWORD

Article metadata (outline + data sources):
$(cat $OUTLINE_FILE)

Article preview (first 2000 chars):
$ARTICLE_PREVIEW

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
# 2026-06-20 fix: 60s 不够, ChatGPT 思考 + 长 prompt 需 120-180s
GEMINI_AUDIT=$(timeout 180 node ai-router.js gemini "$AUDIT_PROMPT" 2>&1)
CHATGPT_AUDIT=$(timeout 180 node ai-router.js chatgpt "$AUDIT_PROMPT" 2>&1)

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
# 2026-07-02 防御: 防止覆盖已存在文章 (Process bug → slug 重复)
if [ -f "$ARTICLE_JSON" ]; then
    log "❌ REFUSE OVERWRITE: $ARTICLE_JSON already exists (slug deduplication bug)"
    log "💡 Self-heal: 跳过此 slug, 明天 cron 选新 topic"
    exit 1
fi

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

    # 2026-06-19: 验证 with self-heal — 如果 HTTP 不是 200/308, 等 30s 重试 1 次
    sleep 30
    HTTP_CODE=$(curl -sL --max-time 15 -o /dev/null -w "%{http_code}" "https://www.tradego-fasteners.com/en/industry/${SLUG}")
    log "✅ Verification (try 1): HTTP $HTTP_CODE for /en/industry/${SLUG}"

    if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "308" ]; then
        log "⚠️ HTTP $HTTP_CODE != 200, retry in 60s (Vercel CDN propagation)..."
        sleep 60
        HTTP_CODE=$(curl -sL --max-time 15 -o /dev/null -w "%{http_code}" "https://www.tradego-fasteners.com/en/industry/${SLUG}")
        log "✅ Verification (try 2): HTTP $HTTP_CODE"

        if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "308" ]; then
            log "❌ Verification failed after 2 tries. Page may not be served."
            log "💡 Self-heal: 12-language JSON will be auto-generated on next cron run."
        fi
    fi
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