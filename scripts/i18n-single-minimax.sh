#!/bin/bash
# i18n-single-minimax.sh - 单文章 8 langs body i18n 翻译 (1 lang/call, 用 minimax 避开 chrome 18800)
# Usage: bash scripts/i18n-single-minimax.sh <slug>
# 2026-07-18 21:30 创建: Ivory Coast 单独翻译, 不抢 i18n 主循环 chrome 18800
#
# 设计: v2 脚本 1 call = 8 langs (123K input) 太大, minimax 1 call = 1 lang 稳

set -e

SLUG="${1:-ivory-coast-abidjan-port-fastener-tariff}"
PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
mkdir -p "$LOG_DIR" "$TMP_DIR"

LANGS=("es" "ar" "fr" "pt" "ru" "ja" "de" "hi")

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

# Verify slug exists
ARTICLE_FILE="$ARTICLES_DIR/${SLUG}.json"
if [ ! -f "$ARTICLE_FILE" ]; then
  echo "[fatal] article not found: $ARTICLE_FILE" >&2
  exit 2
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# Detect missing langs (only body, only these 8 langs)
log "===== i18n SINGLE-ARTICLE minimax TRANSLATION for $SLUG ====="
MISSING=$(python3 -c "
import json
LANGS = ['es','ar','fr','pt','ru','ja','de','hi']
with open('$ARTICLE_FILE') as f: a = json.load(f)
missing = []
for lang in LANGS:
    for s_idx, sec in enumerate(a.get('sections', [])):
        v = sec.get('body', {}).get(lang, '')
        if not v:
            missing.append((lang, s_idx))
            break  # one missing is enough to translate this lang
print(','.join(set(l[0] for l in missing)))
" 2>/dev/null)
if [ -z "$MISSING" ]; then
  log "✅ all 8 langs already translated, nothing to do"
  exit 0
fi
log "missing langs: $MISSING"

# Translate each missing lang
IFS=',' read -ra MISSING_ARR <<< "$MISSING"
for LANG in "${MISSING_ARR[@]}"; do
  log "---- translating $LANG ----"
  PROMPT_FILE="$TMP_DIR/${SLUG}_body_${LANG}.txt"
  RESULT_FILE="$TMP_DIR/${SLUG}_body_${LANG}.json"
  RAW_FILE="$TMP_DIR/${SLUG}_body_${LANG}.raw.txt"

  # Build prompt: 1 lang, all sections body
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
    parts.append(f'--- section {i} ---')
    parts.append(f'heading(en): {s[\"heading\"][\"en\"]}')
    parts.append(f'body(en):')
    parts.append(s['body']['en'])
# FAQs
faqs = a.get('faqs', [])
if faqs:
    parts.append('')
    parts.append('FAQs:')
    for i, f in enumerate(faqs):
        parts.append(f'--- faq {i} ---')
        parts.append(f'q(en): {f[\"q\"][\"en\"]}')
        parts.append(f'a(en): {f[\"a\"][\"en\"]}')
# CTA
cta = a.get('cta', {}).get('text', {}).get('en', '')
if cta:
    parts.append('')
    parts.append(f'CTA text(en): {cta}')
print('\n'.join(parts))
" > "$PROMPT_FILE"

  # Call minimax (max_tokens=16000 for body 翻译 10000+ chars output)
  log "  calling minimax-quick.sh (max_tokens=16000, M2.7 standard)..."
  if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 16000 > "$RAW_FILE" 2>&1; then
    RAW_LEN=$(wc -c < "$RAW_FILE")
    log "  raw output: $RAW_LEN chars"
    if [ "$RAW_LEN" -lt 200 ]; then
      log "  ❌ output too short, skipping (raw head: $(head -c 200 "$RAW_FILE"))"
      continue
    fi
  else
    log "  ❌ minimax call failed (exit $?), skipping"
    continue
  fi

  # Parse
  if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors.log"; then
    log "  ✅ parsed OK -> $RESULT_FILE"
  else
    log "  ❌ parse fail, skipping $LANG"
    continue
  fi

  # Merge into article.json
  python3 -c "
import json
article_file = '$ARTICLE_FILE'
result_file = '$RESULT_FILE'
lang = '$LANG'
with open(article_file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
trans = r.get('translations', {}).get(lang, {})
if not trans:
    print(f'  ❌ no translations for {lang} in result', flush=True)
    exit(1)
# Update title
if 'title' in trans:
    a['title'][lang] = trans['title']
# Update sections
if 'sections' in trans:
    for i, sec_trans in enumerate(trans['sections']):
        if i < len(a.get('sections', [])):
            if 'heading' in sec_trans:
                a['sections'][i]['heading'][lang] = sec_trans['heading']
            if 'body' in sec_trans:
                a['sections'][i]['body'][lang] = sec_trans['body']
# Update faqs
if 'faqs' in trans and a.get('faqs'):
    for i, f_trans in enumerate(trans['faqs']):
        if i < len(a['faqs']):
            if 'q' in f_trans:
                a['faqs'][i]['q'][lang] = f_trans['q']
            if 'a' in f_trans:
                a['faqs'][i]['a'][lang] = f_trans['a']
# Update cta
if 'ctaText' in trans and a.get('cta'):
    a['cta']['text'][lang] = trans['ctaText']
with open(article_file, 'w') as f:
    json.dump(a, f, ensure_ascii=False, indent=2)
print(f'  ✅ merged {lang} into {article_file}', flush=True)
" 2>&1
  log "  ✅ DONE $LANG"
  sleep 2  # cooldown
done

log "===== i18n SINGLE-ARTICLE minimax DONE for $SLUG ====="
