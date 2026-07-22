#!/bin/bash
# i18n-single-section.sh - 1 section/call 翻译, 接受 AI 参数
# 2026-07-22 19:30 创建:
#   gemini 适合亚洲语种 (zh/ja/hi) - minimax 中文 800-1200c 顶, gemini 3000+ 字符
#   minimax 适合欧洲语种 (es/ar/fr/pt/ru/de) - 2000-3000c OK
#
# Usage: bash scripts/i18n-single-section.sh <slug> <lang> [ai]
#   ai: gemini (default for asian langs) | minimax (default for euro langs) | doubao | grok
# Output: 写进 article.json

set -e

SLUG="${1:?usage: i18n-single-section.sh <slug> <lang> [ai]}"
LANG="${2:?usage: i18n-single-section.sh <slug> <lang> [ai]}"
AI="${3:-auto}"

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

# auto-pick AI based on lang
if [ "$AI" = "auto" ]; then
  case "$LANG" in
    zh|ja|hi|ko|th|vi) AI="gemini" ;;
    *) AI="minimax" ;;
  esac
fi

echo "[config] slug=$SLUG lang=$LANG ai=$AI"

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

log "===== i18n SINGLE-SECTION $AI for $SLUG / $LANG ====="

# 2026-07-21 fix: 用 article 实际 section 数
TOTAL_SECS=$(python3 -c "
import json
with open('$ARTICLE_FILE') as f: a = json.load(f)
print(len(a.get('sections', [])))
")
log "  article has $TOTAL_SECS sections, will process 0..$((TOTAL_SECS-1))"

# Loop each missing section
for SEC_IDX in $(seq 0 $((TOTAL_SECS-1))); do
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

  if [ "$EXISTING" -gt 1500 ] 2>/dev/null; then
    log "  [skip] section $SEC_IDX already $EXISTING chars (>=1500, OK)"
    continue
  fi
  if [ "$EXISTING" -gt 50 ] 2>/dev/null; then
    log "  [deep-translate] section $SEC_IDX currently $EXISTING chars, will re-translate to >=1500"
  fi

  # Build prompt for 1 section
  # 2026-07-22 19:35 修复: 改用独立 _build_i18n_prompt.py 避免 bash heredoc escape hell
  python3 "$SCRIPT_DIR/_build_i18n_prompt.py" "$ARTICLE_FILE" "$SEC_IDX" "$LANG" > "$PROMPT_FILE"

  # Call AI
  log "  [sec$SEC_IDX] calling $AI (1 section/call)..."
  if [ "$AI" = "gemini" ] || [ "$AI" = "grok" ] || [ "$AI" = "chatgpt" ] || [ "$AI" = "doubao" ]; then
    # Use ai-router (Chrome CDP)
    if bash "$SCRIPT_DIR/seo-ai-router-call.sh" "$AI" "$PROMPT_FILE" 180 > "$RAW_FILE" 2>&1; then
      RAW_LEN=$(wc -c < "$RAW_FILE")
      log "  [sec$SEC_IDX] $AI raw: $RAW_LEN chars"
    else
      log "  [sec$SEC_IDX] $AI call failed"
      continue
    fi
  elif [ "$AI" = "minimax" ]; then
    # Use direct API
    if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 12000 > "$RAW_FILE" 2>&1; then
      RAW_LEN=$(wc -c < "$RAW_FILE")
      log "  [sec$SEC_IDX] minimax raw: $RAW_LEN chars"
    else
      log "  [sec$SEC_IDX] minimax call failed"
      continue
    fi
  else
    log "  [sec$SEC_IDX] unknown AI: $AI"
    continue
  fi

  if [ ! -s "$RAW_FILE" ] || [ "$(wc -c < "$RAW_FILE")" -lt 100 ]; then
    log "  [sec$SEC_IDX] empty/short output, skip"
    continue
  fi

  # Parse
  if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors.log"; then
    log "  [sec$SEC_IDX] parsed OK"
  else
    log "  [sec$SEC_IDX] parse fail"
    continue
  fi

  # Merge
  python3 -c "
import json
import sys
article_file = '$ARTICLE_FILE'
result_file = '$RESULT_FILE'
sec_idx = $SEC_IDX
lang = '$LANG'
with open(article_file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
trans = r.get('translations', {}).get('sec', r.get('translations', {}).get(lang, r))
heading = trans.get('heading', '')
body = trans.get('body', '')
if not heading and not body:
    sys.stderr.write('  [sec' + str(sec_idx) + '] no heading/body\n')
    sys.exit(1)
if sec_idx < len(a.get('sections', [])):
    if 'heading' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['heading'] = dict()
    if 'body' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['body'] = dict()
    MIN_LEN = 1500
    if len(body) < MIN_LEN:
        blen = len(body)
        sys.stderr.write('  [sec' + str(sec_idx) + '] body too short (' + str(blen) + 'c), not merged\n')
        sys.exit(1)
    a['sections'][sec_idx]['heading'][lang] = heading
    a['sections'][sec_idx]['body'][lang] = body
    with open(article_file, 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
    print('  [sec%d] merged heading=%dc body=%dc' % (sec_idx, len(heading), len(body)))
" 2>&1
  sleep 5
done

log "===== i18n SINGLE-SECTION $AI DONE for $SLUG / $LANG ====="
