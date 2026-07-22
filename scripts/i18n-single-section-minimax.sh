#!/bin/bash
# i18n-single-section-minimax.sh - 1 section/call minimax 翻译 (避开长 prompt 3min timeout)
# 2026-07-20 08:30 创建: egypt-cairo hi 印地语 minimax 8+ retry 全 3min timeout, 改 1 section/call
# 2026-07-22 19:15 总裁反馈"翻译还是不好"修复:
#   1. prompt 强制 JSON-only, 禁 thinking preamble
#   2. prompt 强调"1800+ chars"硬要求
#   3. parser 加 raw newline → \\n escape (minimax 拒绝输出字面 \\n)
#   4. 加 zh lang 名称
#
# Usage: bash scripts/i18n-single-section-minimax.sh <slug> <lang>

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

# 2026-07-21 fix: 用 article 实际 section 数, 避免 sec5 IndexError on <6-section articles
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
    log "  [skip] section $SEC_IDX already $EXISTING chars (≥1500, OK)"
    continue
  fi
  if [ "$EXISTING" -gt 50 ] 2>/dev/null; then
    log "  [deep-translate] section $SEC_IDX currently $EXISTING chars, will re-translate to ≥1800"
  fi

  # Build prompt for 1 section
  # 2026-07-22 19:15 总裁反馈"翻译还是不好" 二次修复:
  #  - 改"translate"为"write content"绕过 minimax 翻译压缩
  #  - 强约束 body ≥1800 chars (硬指标, 短于这个 merge reject)
  #  - max_tokens 12000 + 12K 模型输出
  python3 -c "
import json
LANG_NAMES = {
  'es': 'Spanish (Espanol)',
  'ar': 'Arabic (Arabic, RTL)',
  'fr': 'French (Francais)',
  'pt': 'Portuguese (Portugues)',
  'ru': 'Russian (Russkij)',
  'ja': 'Japanese (Nihongo)',
  'de': 'German (Deutsch)',
  'hi': 'Hindi (Hindi, Devanagari script)',
  'zh': 'Chinese Simplified (Zhongwen)',
}
with open('$ARTICLE_FILE') as f: a = json.load(f)
sections = a.get('sections', [])
sec = sections[$SEC_IDX]
title = a['title']['en']
lang_name = LANG_NAMES.get('$LANG', '$LANG')
parts = []
parts.append('You are a professional ' + lang_name + ' technical content writer for industrial B2B trade publications.')
parts.append('Write the ' + lang_name + ' version of the section below, based on the English source.')
parts.append('HARD LENGTH REQUIREMENT: body MUST be at least 1800 characters. Anything shorter will be rejected and the task will fail.')
parts.append('')
parts.append('=== OUTPUT FORMAT (CRITICAL) ===')
parts.append('Response must START with { character and END with } character.')
parts.append('No markdown fence. No commentary. No preamble. No thinking aloud. No analysis.')
parts.append('If you would normally think before answering, do it silently and output only the JSON.')
parts.append('The body field is a JSON string. Every paragraph break inside the body MUST be the two characters backslash+n (\\\\n), not a real line break.')
parts.append('Real newlines in the body value will cause JSON parse failure. Use \\\\n literally.')
parts.append('')
parts.append('=== EXACT JSON SHAPE ===')
parts.append('JSON object: {\"heading\": \"<translated heading 30-50 chars>\", \"body\": \"<translated body 1800+ chars>\".}')
parts.append('Every inner double quote inside the body must be escaped as backslash-quote (\\\\\").')
parts.append('Every newline inside the body must be the two characters backslash+n (\\\\n), not a real line break.')
parts.append('')
parts.append('=== RULES ===')
parts.append('1. Cover EVERY sentence from the English source. Do not skip. Do not summarize.')
parts.append('2. Keep technical terms (ISO, ASTM, A193 B7, API 6A, HS code, BX-series, H2S) in English.')
parts.append('3. Preserve all citations [1], [2], [3] intact in the body.')
parts.append('4. Include all numbers, dimensions, percentages, temperatures from the source.')
parts.append('5. Translate the heading to the target language. Keep it concise and technical.')
parts.append('6. Output 4-5 paragraphs covering the same depth as the English source.')
parts.append('')
parts.append('=== ARTICLE TITLE (EN, for context) ===')
parts.append(title)
parts.append('')
parts.append('=== SECTION ' + str($SEC_IDX) + ' TO TRANSLATE ===')
parts.append('heading(en): ' + sec['heading']['en'])
parts.append('body(en):')
parts.append(sec['body']['en'])
parts.append('')
parts.append('=== NOW OUTPUT THE JSON OBJECT ===')
parts.append('Body 1800+ chars. Newlines as literal backslash+n (two chars). No preamble.')
print('\n'.join(parts))
" > "$PROMPT_FILE"

  # Call minimax
  log "  [sec$SEC_IDX] calling minimax-quick.sh (max_tokens=12000, M2.7 standard)..."
  if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 12000 > "$RAW_FILE" 2>&1; then
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
    sys.stderr.write('  [sec' + str(sec_idx) + '] no heading/body in result\n')
    sys.exit(1)
if sec_idx < len(a.get('sections', [])):
    if 'heading' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['heading'] = dict()
    if 'body' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['body'] = dict()
    # 2026-07-22 19:15 提升阈值: 1500 → 1800 (总裁 7/22 18:58 反馈)
    MIN_LEN = 1800
    if len(body) < MIN_LEN:
        blen = len(body)
        sys.stderr.write('  [sec' + str(sec_idx) + '] body too short (' + str(blen) + 'c below ' + str(MIN_LEN) + ' threshold), not merged\n')
        sys.exit(1)
    a['sections'][sec_idx]['heading'][lang] = heading
    a['sections'][sec_idx]['body'][lang] = body
    with open(article_file, 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
    print('  [sec%d] merged heading=%dc body=%dc' % (sec_idx, len(heading), len(body)))
" 2>&1
  sleep 3
done

log "===== i18n SINGLE-SECTION minimax DONE for $SLUG / $LANG ====="
