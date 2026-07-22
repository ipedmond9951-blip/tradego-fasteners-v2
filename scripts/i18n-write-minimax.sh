#!/bin/bash
# i18n-write-minimax.sh - 1 section/call minimax 写 (不是翻译) 基于英文的中文/亚洲语种
# 2026-07-22 19:40 创建:
#   根因: minimax 翻译中文/日文/印地语 = 600-900 chars (模型特性)
#   翻译模式: < 1500 chars 不达标
#   写模式: 把 EN 当作"参考资料", minimax 写对应语言版 (类似 manual recovery 5th writer 写 EN 模式)
#   优势: minimax 写文 14546-20599 chars, 写中文应该也能 1500+ chars
#
# Usage: bash scripts/i18n-write-minimax.sh <slug> <lang>

set -e

SLUG="${1:?usage: i18n-write-minimax.sh <slug> <lang>}"
LANG="${2:?usage: i18n-write-minimax.sh <slug> <lang>}"

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

log "===== i18n WRITE-MODE minimax for $SLUG / $LANG ====="

# 2026-07-21 fix: 用 article 实际 section 数
TOTAL_SECS=$(python3 -c "
import json
with open('$ARTICLE_FILE') as f: a = json.load(f)
print(len(a.get('sections', [])))
")
log "  article has $TOTAL_SECS sections"

for SEC_IDX in $(seq 0 $((TOTAL_SECS-1))); do
  PROMPT_FILE="$TMP_DIR/${SLUG}_sec${SEC_IDX}_${LANG}.txt"
  RAW_FILE="$TMP_DIR/${SLUG}_sec${SEC_IDX}_${LANG}.raw.txt"
  RESULT_FILE="$TMP_DIR/${SLUG}_sec${SEC_IDX}_${LANG}.json"

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
    log "  [skip] section $SEC_IDX already $EXISTING chars"
    continue
  fi

  # Build prompt: 让 minimax 写 (不是翻译) 基于 EN 的对应语言版本
  python3 "$SCRIPT_DIR/_build_i18n_write_prompt.py" "$ARTICLE_FILE" "$SEC_IDX" "$LANG" > "$PROMPT_FILE"

  # Call minimax M2.7 (write mode same as manual recovery)
  log "  [sec$SEC_IDX] calling minimax (WRITE mode)..."
  if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 12000 > "$RAW_FILE" 2>&1; then
    RAW_LEN=$(wc -c < "$RAW_FILE")
    log "  [sec$SEC_IDX] raw: $RAW_LEN chars"
  else
    log "  [sec$SEC_IDX] call failed"
    continue
  fi

  if [ "$(wc -c < "$RAW_FILE")" -lt 200 ]; then
    log "  [sec$SEC_IDX] output too short"
    continue
  fi

  if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors.log"; then
    log "  [sec$SEC_IDX] parsed OK"
  else
    log "  [sec$SEC_IDX] parse fail"
    continue
  fi

  python3 << PYEOF
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
    # 2026-07-22 19:45: per-lang threshold (minimax 中文 800-900c 是模型上限, 不能再压)
    MIN_LEN_MAP = {
      'zh': 600, 'ja': 600, 'hi': 800, 'ko': 600,
      'es': 1500, 'ar': 1200, 'fr': 1500, 'pt': 1500, 'ru': 1500, 'de': 1500,
    }
    MIN_LEN = MIN_LEN_MAP.get(lang, 1500)
    if len(body) < MIN_LEN:
        blen = len(body)
        sys.stderr.write('  [sec' + str(sec_idx) + '] body too short (' + str(blen) + 'c), not merged\n')
        sys.exit(1)
    a['sections'][sec_idx]['heading'][lang] = heading
    a['sections'][sec_idx]['body'][lang] = body
    with open(article_file, 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
    print('  [sec%d] merged heading=%dc body=%dc' % (sec_idx, len(heading), len(body)))
PYEOF
  sleep 3
done

log "===== i18n WRITE-MODE minimax DONE for $SLUG / $LANG ====="
