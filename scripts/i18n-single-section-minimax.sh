#!/bin/bash
# i18n-single-section-minimax.sh - 1 section/call minimax 翻译 (避开长 prompt 3min timeout)
# 2026-07-20 08:30 创建: egypt-cairo hi 印地语 minimax 8+ retry 全 3min timeout, 改 1 section/call
#
# Usage: bash scripts/i18n-single-section-minimax.sh <slug> <lang>
# 输出: 直接 merge 进 article.json (跟 i18n-single-minimax.sh 同样 merge 逻辑)

set -e

SLUG="${1:-egypt-cairo-construction-fastener-wholesale}"
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

# Backup
BAK_FILE="/tmp/${SLUG}.${LANG}.bak.$(date +%Y%m%d-%H%M%S).json"
cp "$ARTICLE_FILE" "$BAK_FILE"
echo "[backup] $BAK_FILE"

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

log "===== i18n SINGLE-SECTION minimax for $SLUG / $LANG ====="

# Loop each missing section
for SEC_IDX in 0 1 2 3 4 5; do
  PROMPT_FILE="$TMP_DIR/${SLUG}_sec${SEC_IDX}_${LANG}.txt"
  RAW_FILE="$TMP_DIR/${SLUG}_sec${SEC_IDX}_${LANG}.raw.txt"
  RESULT_FILE="$TMP_DIR/${SLUG}_sec${SEC_IDX}_${LANG}.json"

  # Check if already translated
  EXISTING=$(python3 -c "
import json
with open('$ARTICLE_FILE') as f: a = json.load(f)
if $SEC_IDX < len(a.get('sections', [])):
    b = a['sections'][$SEC_IDX].get('body', {}).get('$LANG', '')
    print(len(b))
else:
    print(-1)
" 2>/dev/null)

  if [ "$EXISTING" -gt 200 ] 2>/dev/null; then
    log "  [skip] section $SEC_IDX already $EXISTING chars"
    continue
  fi

  # Build prompt for 1 section
  python3 -c "
import json
with open('$ARTICLE_FILE') as f: a = json.load(f)
sections = a.get('sections', [])
sec = sections[$SEC_IDX]
title = a['title']['en']
parts = [f'Translate section body to $LANG (Hindi/Devanagari script).']
parts.append(f'Article title (EN, for context): {title}')
parts.append('')
parts.append('Output STRICT JSON: {\"heading\": \"...\", \"body\": \"...\"}')
parts.append('RULES:')
parts.append('1. Translate the body faithfully, keep technical terms (HS code, ISO, ASTM, etc.) as-is')
parts.append('2. Preserve citations [1], [2] intact')
parts.append('3. Keep HTML <a href=\"...\"> tags as-is in body')
parts.append('4. CRITICAL: escape ALL double quotes in JSON string values with backslash')
parts.append('5. Output ONLY the JSON object, no markdown fence, no commentary')
parts.append('')
parts.append(f'--- section $SEC_IDX ---')
parts.append(f'heading(en): {sec[\"heading\"][\"en\"]}')
parts.append(f'body(en):')
parts.append(sec['body']['en'])
print('\n'.join(parts))
" > "$PROMPT_FILE"

  # Call minimax
  log "  [sec$SEC_IDX] calling minimax-quick.sh (max_tokens=8000, M2.7 standard)..."
  if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 8000 > "$RAW_FILE" 2>&1; then
    RAW_LEN=$(wc -c < "$RAW_FILE")
    log "  [sec$SEC_IDX] raw output: $RAW_LEN chars"
    if [ "$RAW_LEN" -lt 200 ]; then
      log "  [sec$SEC_IDX] ❌ output too short (raw head: $(head -c 200 "$RAW_FILE"))"
      continue
    fi
  else
    log "  [sec$SEC_IDX] ❌ minimax call failed (exit $?)"
    continue
  fi

  # Parse
  if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors.log"; then
    log "  [sec$SEC_IDX] ✅ parsed OK"
  else
    log "  [sec$SEC_IDX] ❌ parse fail"
    continue
  fi

  # Merge
  python3 -c "
import json
article_file = '$ARTICLE_FILE'
result_file = '$RESULT_FILE'
sec_idx = $SEC_IDX
lang = '$LANG'
with open(article_file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
# parse_translation_result.py wraps single-section as {'translations': {'sec': {heading, body}}}
trans = r.get('translations', {}).get('sec', r.get('translations', {}).get(lang, r))
heading = trans.get('heading', '')
body = trans.get('body', '')
if not heading and not body:
    print(f'  [sec{sec_idx}] ❌ no heading/body in result')
    exit(1)
if sec_idx < len(a.get('sections', [])):
    if 'heading' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['heading'] = {}
    if 'body' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['body'] = {}
    a['sections'][sec_idx]['heading'][lang] = heading
    a['sections'][sec_idx]['body'][lang] = body
    with open(article_file, 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
    print('  [sec%d] ✅ merged heading=%dc body=%dc' % (sec_idx, len(heading), len(body)))
" 2>&1
  sleep 3
done

log "===== i18n SINGLE-SECTION minimax DONE for $SLUG / $LANG ====="
