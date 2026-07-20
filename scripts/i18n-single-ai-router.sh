#!/bin/bash
# i18n-single-ai-router.sh - 单 lang 翻译走 ai-router (chrome 18800) 兜底 minimax 失败
# Usage: bash scripts/i18n-single-ai-router.sh <slug> <lang>
# 2026-07-18 22:10 创建: minimax hi 翻译持续失败, fallback ai-router gemini
#
# 注意: 会争 chrome 18800 端口, 与 i18n 主循环冲突 (主循环跑时此脚本会 hang)

set -e

SLUG="${1:-ivory-coast-abidjan-port-fastener-tariff}"
LANG="${2:-hi}"
PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
mkdir -p "$LOG_DIR" "$TMP_DIR"

ARTICLE_FILE="$ARTICLES_DIR/${SLUG}.json"
if [ ! -f "$ARTICLE_FILE" ]; then
  echo "[fatal] article not found: $ARTICLE_FILE" >&2
  exit 2
fi

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

# Check Chrome
if ! curl -sf http://localhost:18800/json/version > /dev/null 2>&1; then
  echo "[fatal] Chrome 18800 not running" >&2
  exit 2
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

log "===== i18n SINGLE-AI-ROUTER for $SLUG / $LANG ====="

PROMPT_FILE="$TMP_DIR/${SLUG}_body_${LANG}_ar.txt"
RESULT_FILE="$TMP_DIR/${SLUG}_body_${LANG}_ar.json"
RAW_FILE="$TMP_DIR/${SLUG}_body_${LANG}_ar.raw.txt"

# Build prompt (same as i18n-single-minimax.sh)
python3 -c "
import json
slug = '$SLUG'
lang = '$LANG'
with open('$ARTICLE_FILE') as f: a = json.load(f)
title = a['title']['en']
sections = a.get('sections', [])
parts = [f'Translate ALL section bodies to {lang}.']
parts.append(f'Article title (EN, for context): {title}')
parts.append('')
parts.append('Output STRICT JSON: {\"translations\": {\"<lang>\": {\"title\": \"...\", \"sections\": [{\"heading\": \"...\", \"body\": \"...\"}, ...], \"faqs\": [{\"q\": \"...\", \"a\": \"...\"}, ...], \"ctaText\": \"...\"}}}')
parts.append('RULES:')
parts.append('1. Translate every section body (preserve markdown links, escape ALL double quotes inside JSON string values with \\\\\")')
parts.append('2. Preserve technical terms (HS code, ECOWAS, ECOWAS CET, etc.)')
parts.append('3. Keep citations like [1], [2] intact')
parts.append('4. Keep any HTML <a href=\"...\"> tags as-is in body (preserve link structure)')
parts.append('5. CRITICAL: In JSON string values, escape ALL double quotes with backslash. Use single quotes for any quoted text inside content.')
parts.append('6. Output ONLY the JSON object, no markdown fence, no commentary')
parts.append('')
parts.append('SECTION BODIES TO TRANSLATE:')
for i, s in enumerate(sections):
    body_en = s.get('body', {}).get('en', '')  # 2026-07-19 FIX: 防御 FAQ section 缺 body 字段
    if not body_en:
        continue
    parts.append(f'--- section {i} ---')
    parts.append(f'heading(en): {s[\"heading\"][\"en\"]}')
    parts.append(f'body(en):')
    parts.append(body_en)
faqs = a.get('faqs', [])
if faqs:
    parts.append('')
    parts.append('FAQs:')
    for i, f in enumerate(faqs):
        parts.append(f'--- faq {i} ---')
        parts.append(f'q(en): {f[\"q\"][\"en\"]}')
        parts.append(f'a(en): {f[\"a\"][\"en\"]}')
cta = a.get('cta', {}).get('text', {}).get('en', '')
if cta:
    parts.append('')
    parts.append(f'CTA text(en): {cta}')
print('\n'.join(parts))
" > "$PROMPT_FILE"

log "  calling ai-router grok (270s timeout)..."
# Try gemini first, fallback grok, fallback doubao
RESULT=""
for AI_TRY in grok gemini doubao; do
  log "  trying $AI_TRY..."
  sleep 5  # avoid too_frequent from v2 main loop
  RESULT=$(timeout 300 bash "$SCRIPT_DIR/seo-ai-router-call.sh" "$AI_TRY" "$PROMPT_FILE" 270 2>&1) || true
  RESULT_LEN=${#RESULT}
  if [ "$RESULT_LEN" -gt 200 ] && ! echo "$RESULT" | grep -qE "^\[error\]|^\[warn\]|too_frequent|daily_limit|ai-guard|quarantine|不可达|静默"; then
    echo "$RESULT" > "$RAW_FILE"
    log "  ✅ $AI_TRY output: $RESULT_LEN chars"
    # 2026-07-20 04:50 FIX: parse fail 不能立即 break, 要 try next AI
    if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors.log"; then
      log "  ✅ parsed OK"
      break
    else
      log "  ⚠️ $AI_TRY parse fail, try next"
      continue
    fi
  else
    log "  $AI_TRY fail (len=$RESULT_LEN), next"
  fi
done

if [ ! -s "$RESULT_FILE" ]; then
  log "  ❌ all AI fail, exit"
  exit 1
fi

# Parse
if ! python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors.log"; then
  log "  ❌ parse fail"
  cat "$RAW_FILE" | tail -3
  exit 1
fi
log "  ✅ parsed -> $RESULT_FILE"

# Merge
python3 -c "
import json
article_file = '$ARTICLE_FILE'
result_file = '$RESULT_FILE'
lang = '$LANG'
with open(article_file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
trans = r.get('translations', {}).get(lang, {})
if not trans:
    print(f'  ❌ no translations for {lang} in result')
    exit(1)
if 'title' in trans:
    a['title'][lang] = trans['title']
if 'sections' in trans:
    for i, sec_trans in enumerate(trans['sections']):
        if i < len(a.get('sections', [])):
            if 'heading' in sec_trans:
                a['sections'][i]['heading'][lang] = sec_trans['heading']
            if 'body' in sec_trans:
                a['sections'][i]['body'][lang] = sec_trans['body']
if 'faqs' in trans and a.get('faqs'):
    for i, f_trans in enumerate(trans['faqs']):
        if i < len(a['faqs']):
            if 'q' in f_trans:
                a['faqs'][i]['q'][lang] = f_trans['q']
            if 'a' in f_trans:
                a['faqs'][i]['a'][lang] = f_trans['a']
if 'ctaText' in trans and a.get('cta'):
    a['cta']['text'][lang] = trans['ctaText']
with open(article_file, 'w') as f:
    json.dump(a, f, ensure_ascii=False, indent=2)
print(f'  ✅ merged {lang}')
" 2>&1

log "✅ DONE $LANG"
