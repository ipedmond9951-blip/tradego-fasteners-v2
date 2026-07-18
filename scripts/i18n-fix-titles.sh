#!/bin/bash
# i18n-fix-titles.sh - 补/修单文章 title 翻译 (8 langs)
# 2026-07-18 22:46: 修复 ivory coast 3 个 title 问题 (zh 缺, ja EN placeholder, de 部分 EN)
#
# Usage: bash scripts/i18n-fix-titles.sh <slug>

set -e

SLUG="${1:-ivory-coast-abidjan-port-fastener-tariff}"
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

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# Detect missing/bad titles
MISSING_LANGS=$(python3 -c "
import json
with open('$ARTICLE_FILE') as f: a = json.load(f)
en_title = a['title']['en']
LANGS = ['zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']
missing = []
for lang in LANGS:
    t = a['title'].get(lang, '')
    # Heuristic: if title is same as en, treat as untranslated (except en)
    if not t or t == en_title:
        missing.append(lang)
        continue
    # For non-Latin scripts (zh, ar, ja, hi, ru), check if contains any non-ASCII characters
    # For Latin (es, fr, pt, de), check word overlap with en
    if lang in ['zh', 'ja', 'hi']:
        # CJK/Devanagari: must have non-ASCII chars
        if not any(ord(c) > 127 for c in t):
            missing.append(lang)
    elif lang in ['ar']:
        if not any(ord(c) > 127 for c in t):
            missing.append(lang)
    elif lang in ['ru']:
        if not any(ord(c) > 127 for c in t):
            missing.append(lang)
    elif lang in ['de', 'es', 'fr', 'pt']:
        # Latin scripts: at least 1 different word from en
        en_words = set(en_title.lower().split())
        t_words = set(t.lower().split())
        if en_words and t_words and (len(t_words - en_words) / len(t_words | en_words)) < 0.3:
            missing.append(lang)
print(','.join(missing))
" 2>/dev/null)

if [ -z "$MISSING_LANGS" ]; then
  log "✅ all titles translated, nothing to do"
  exit 0
fi

log "missing/bad title langs: $MISSING_LANGS"

IFS=',' read -ra LANGS_ARR <<< "$MISSING_LANGS"
for LANG in "${LANGS_ARR[@]}"; do
  log "---- fixing title $LANG ----"
  PROMPT_FILE="$TMP_DIR/${SLUG}_title_${LANG}.txt"
  RESULT_FILE="$TMP_DIR/${SLUG}_title_${LANG}.json"
  RAW_FILE="$TMP_DIR/${SLUG}_title_${LANG}.raw.txt"

  # Build prompt: translate only title
  LANG="$LANG" python3 -c "
import json, os
lang = os.environ['LANG']
with open('$ARTICLE_FILE') as f: a = json.load(f)
print(f'Translate the following English title to {lang}.')
print(f'')
print(f'EN title: {a[\"title\"][\"en\"]}')
print(f'')
print(f'Output STRICT JSON: {{\"translated_title\": \"<the translation>\"}}')
print(f'')
print(f'RULES:')
print(f'1. Translate accurately, preserving technical terms (HS code, B2B, etc.)')
print(f'2. Keep proper nouns like \"Abidjan\" as-is or use local spelling')
print(f'3. Output ONLY the JSON object, no markdown fence, no commentary')
print(f'4. Escape any double quotes inside the translation with backslash')
" > "$PROMPT_FILE"

  # Call minimax (try multiple times for stability)
  SUCCESS=0
  for ATTEMPT in 1 2 3 4 5; do
    log "  attempt $ATTEMPT: minimax M2.7 1000 tokens..."
    if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 1000 > "$RAW_FILE" 2>&1; then
      RAW_LEN=$(wc -c < "$RAW_FILE")
      if [ "$RAW_LEN" -gt 50 ]; then
        SUCCESS=1
        break
      fi
    fi
    log "  attempt $ATTEMPT failed, sleep 10s..."
    sleep 10
  done

  if [ "$SUCCESS" -eq 0 ]; then
    log "  ❌ all attempts failed for $LANG"
    continue
  fi

  # Parse
  python3 -c "
import json, sys, re
raw_file = '$RAW_FILE'
out_file = '$RESULT_FILE'
lang = '$LANG'
with open(raw_file) as f: text = f.read()
# Extract JSON
m = re.search(r'\{.*?\}', text, re.DOTALL)
if m:
    try:
        d = json.loads(m.group(0))
        if 'translated_title' in d:
            with open(out_file, 'w') as f:
                json.dump({'translated_title': d['translated_title']}, f, ensure_ascii=False)
            print(f'  ✅ parsed title: {d[\"translated_title\"][:80]}')
            sys.exit(0)
    except json.JSONDecodeError as e:
        pass
print('  ❌ parse fail')
sys.exit(1)
" 2>&1

  if [ ! -f "$RESULT_FILE" ]; then
    log "  ❌ no result file, skipping"
    continue
  fi

  # Merge title
  python3 -c "
import json
article_file = '$ARTICLE_FILE'
result_file = '$RESULT_FILE'
lang = '$LANG'
with open(article_file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
new_title = r.get('translated_title', '').strip()
if new_title:
    a['title'][lang] = new_title
    with open(article_file, 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
    print(f'  ✅ merged title.{lang}: {new_title[:80]}')
else:
    print(f'  ❌ empty translated_title')
" 2>&1

  log "  ✅ DONE title $LANG"
  sleep 2
done

log "===== i18n-fix-titles DONE for $SLUG ====="
