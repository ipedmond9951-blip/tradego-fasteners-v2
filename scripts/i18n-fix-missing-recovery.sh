#!/bin/bash
# i18n-fix-missing-recovery.sh - 2026-07-21 20:45 创建
# 修复 i18n-fix-missing 主循环 minimax JSON 截断失败的 33 (slug, lang) 必修
# 策略: 1 section/call 用 i18n-single-section-minimax.sh (避 minimax 长 prompt 截断)
#
# Usage: bash scripts/i18n-fix-missing-recovery.sh [LANG]
#        不传 LANG = 跑全部 必修 (8 langs: ar/de/es/hi/ja/pt/ru)

set -e

LANG_ARG="${1:-}"
PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
mkdir -p "$LOG_DIR" "$TMP_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

LANGS=("ar" "de" "es" "hi" "ja" "pt" "ru")
if [ -n "$LANG_ARG" ]; then
  LANGS=("$LANG_ARG")
fi

log "===== i18n-fix-missing RECOVERY START (langs: ${LANGS[*]}) ====="

# 找所有 placeholder + empty
MISSING=()
for LANG in "${LANGS[@]}"; do
  for ARTICLE_FILE in "$ARTICLES_DIR"/*.json; do
    [ -f "$ARTICLE_FILE" ] || continue
    SLUG=$(basename "$ARTICLE_FILE" .json)

    RESULT=$(python3 - "$ARTICLE_FILE" "$LANG" << 'PYEOF'
import json, sys
fp, lang = sys.argv[1], sys.argv[2]
PLACEHOLDER = ['coming soon', 'todo', 'placeholder', 'tbd']
try:
    with open(fp) as f:
        d = json.load(f)
except:
    print('PARSE_ERR')
    sys.exit(0)
sections = d.get('sections', [])
if not sections:
    print('NO_SECTIONS')
    sys.exit(0)
body_lens = [len(s.get('body', {}).get(lang, '')) for s in sections]
avg = sum(body_lens) / max(len(body_lens), 1)
is_placeholder = any(
    any(p in s.get('body', {}).get(lang, '').lower() for p in PLACEHOLDER)
    for s in sections if len(s.get('body', {}).get(lang, '')) < 200
)
if avg < 50:
    print('EMPTY')
elif is_placeholder:
    print('PLACEHOLDER')
else:
    print('OK')
PYEOF
)
    if [ "$RESULT" = "EMPTY" ] || [ "$RESULT" = "PLACEHOLDER" ]; then
      MISSING+=("$SLUG:$LANG")
    fi
  done
done

log "Found ${#MISSING[@]} (slug, lang) pairs to recover"

TOTAL=${#MISSING[@]}
i=0
for ENTRY in "${MISSING[@]}"; do
  i=$((i+1))
  SLUG="${ENTRY%%:*}"
  LANG="${ENTRY##*:}"

  log "[$i/$TOTAL] recovering $SLUG $LANG via single-section minimax"

  # Run single-section minimax (1 section/call, 6 sections)
  if bash scripts/i18n-single-section-minimax.sh "$SLUG" "$LANG" > /tmp/recovery-${SLUG}-${LANG}.log 2>&1; then
    log "  ✅ recovered"
  else
    log "  ❌ recovery failed for $SLUG $LANG"
  fi
done

log "===== i18n-fix-missing RECOVERY DONE ====="
