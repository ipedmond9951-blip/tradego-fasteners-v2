#!/bin/bash
# i18n-fix-placeholders-batch.sh - 7/23 创建: 批量处理 placeholder sections
# Strategy: 用 minimax-quick-json.sh (30s) 1 section/call, 跳过已有翻译, 3 retry
#
# Usage:
#   LANG=zh bash scripts/i18n-fix-placeholders-batch.sh           # 跑所有 zh placeholders
#   LANG=zh SLUG=algeria-... bash scripts/i18n-fix-placeholders-batch.sh   # 跑 1 article
#   LANG=zh MAX_ARTICLES=5 bash scripts/i18n-fix-placeholders-batch.sh    # 限制 5 articles

set -e

PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
CHECKPOINT_DIR="$LOG_DIR/checkpoints"
mkdir -p "$LOG_DIR" "$TMP_DIR" "$CHECKPOINT_DIR"

LANG="${LANG:-zh}"
# 2026-07-23 fix: macOS default LANG=zh_CN.UTF-8 会污染, 强制 strip locale
LANG="${LANG%_*}"
LANG="${LANG%.*}"
SLUG="${SLUG:-}"
MAX_ARTICLES="${MAX_ARTICLES:-999}"

# Per-lang threshold (2026-07-23: zh/ja 400, hi 600, ar 1000, others 1500)
# Lower from 600 to 400 because minimax 中文极限 400-700c
case "$LANG" in
  zh|ja) MIN_LEN=400 ;;
  hi)    MIN_LEN=600 ;;
  ar)    MIN_LEN=1000 ;;
  *)     MIN_LEN=1500 ;;
esac

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

PLACEHOLDER=("coming soon" "todo" "placeholder" "tbd")
CKPT_FILE="$CHECKPOINT_DIR/i18n-batch-${LANG}.ckpt"

# Find all articles with this lang placeholder/empty sections
log "===== i18n-fix-placeholders-batch START (lang=$LANG min_len=$MIN_LEN) ====="

# Build list of (slug, sec_idx) pairs to process
log "Scanning articles for $LANG placeholder/empty sections..."
MISSING=()
ARTICLE_COUNT=0
for ARTICLE_FILE in "$ARTICLES_DIR"/*.json; do
  [ -f "$ARTICLE_FILE" ] || continue
  SLUG_CUR=$(basename "$ARTICLE_FILE" .json)
  [ -n "$SLUG" ] && [ "$SLUG_CUR" != "$SLUG" ] && continue
  ARTICLE_COUNT=$((ARTICLE_COUNT + 1))
  [ "$ARTICLE_COUNT" -gt "$MAX_ARTICLES" ] && break

  # Find which sections are placeholder/empty
  SECS=$(python3 - "$ARTICLE_FILE" "$LANG" << 'PYEOF'
import json, sys
fp, lang = sys.argv[1], sys.argv[2]
PLACEHOLDER = ['coming soon', 'todo', 'placeholder', 'tbd']
with open(fp) as f:
    a = json.load(f)
out = []
for i, s in enumerate(a.get('sections', [])):
    body = s.get('body', {}).get(lang, '')
    if len(body) < 200 and any(p in body.lower() for p in PLACEHOLDER):
        out.append(str(i))
    elif not body:
        out.append(str(i))
print(' '.join(out))
PYEOF
)
  for SEC_IDX in $SECS; do
    # Check checkpoint - skip if already done
    DONE_KEY="${SLUG_CUR}:sec${SEC_IDX}"
    if [ -f "$CKPT_FILE" ] && grep -q "^${DONE_KEY}$" "$CKPT_FILE" 2>/dev/null; then
      continue
    fi
    MISSING+=("${SLUG_CUR}:${SEC_IDX}")
  done
done

TOTAL=${#MISSING[@]}
log "Found $TOTAL (slug, sec_idx) pairs to fix across $ARTICLE_COUNT articles"

if [ "$TOTAL" -eq 0 ]; then
  log "Nothing to do!"
  exit 0
fi

# Process each
i=0
SUCCESS=0
FAIL=0
for ENTRY in "${MISSING[@]}"; do
  i=$((i+1))
  SLUG_CUR="${ENTRY%%:*}"
  SEC_IDX="${ENTRY##*:}"
  ARTICLE_FILE="$ARTICLES_DIR/${SLUG_CUR}.json"
  [ -f "$ARTICLE_FILE" ] || continue

  # Build 1-section prompt
  PROMPT_FILE="$TMP_DIR/${SLUG_CUR}_sec${SEC_IDX}_${LANG}_batch.txt"
  RAW_FILE="$TMP_DIR/${SLUG_CUR}_sec${SEC_IDX}_${LANG}_batch.raw.txt"
  RESULT_FILE="$TMP_DIR/${SLUG_CUR}_sec${SEC_IDX}_${LANG}_batch.json"

  python3 "$SCRIPT_DIR/_build_i18n_prompt.py" "$ARTICLE_FILE" "$SEC_IDX" "$LANG" > "$PROMPT_FILE"

  PROMPT="$(cat "$PROMPT_FILE")"

  # Retry 3 times (minimax 偶发 60-180s timeout)
  log "[$i/$TOTAL] $SLUG_CUR sec$SEC_IDX $LANG (min_len=$MIN_LEN)"
  ATTEMPT_SUCCESS=0
  for ATTEMPT in 1 2 3; do
    if [ "$ATTEMPT" -gt 1 ]; then
      log "    retry $ATTEMPT: sleep 5s"
      sleep 5
    fi
    if timeout 90 bash "$SCRIPT_DIR/minimax-quick-json.sh" "$PROMPT" "MiniMax-M2.7" 12000 > "$RAW_FILE" 2>&1; then
      RAW_LEN=$(wc -c < "$RAW_FILE" 2>/dev/null || echo 0)
      if [ "$RAW_LEN" -ge 200 ]; then
        log "    attempt $ATTEMPT: raw $RAW_LEN c OK"
        ATTEMPT_SUCCESS=1
        break
      else
        log "    attempt $ATTEMPT: raw too short ($RAW_LEN c)"
      fi
    else
      EXIT=$?
      log "    attempt $ATTEMPT: minimax exit $EXIT"
    fi
  done

  if [ "$ATTEMPT_SUCCESS" -eq 0 ]; then
    log "  ❌ all 3 attempts failed"
    FAIL=$((FAIL+1))
    continue
  fi

  # Parse
  if ! python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors-batch.log"; then
    log "  ❌ parse fail"
    FAIL=$((FAIL+1))
    continue
  fi

  # Merge with per-lang threshold
  MERGE_OUT=$(python3 - "$ARTICLE_FILE" "$RESULT_FILE" "$SEC_IDX" "$LANG" "$MIN_LEN" << 'PYEOF'
import json, sys
af, rf, sec_idx_s, lang, min_len_s = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
sec_idx = int(sec_idx_s)
min_len = int(min_len_s)
with open(af) as f: a = json.load(f)
with open(rf) as f: r = json.load(f)
trans = r.get('translations', {}).get('sec', r.get('translations', {}).get(lang, r))
heading = trans.get('heading', '')
body = trans.get('body', '')
if not heading and not body:
    print('no_content')
    sys.exit(0)
if sec_idx < len(a.get('sections', [])):
    if 'heading' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['heading'] = dict()
    if 'body' not in a['sections'][sec_idx]:
        a['sections'][sec_idx]['body'] = dict()
    if len(body) < min_len:
        print('too_short:' + str(len(body)))
        sys.exit(0)
    a['sections'][sec_idx]['heading'][lang] = heading
    a['sections'][sec_idx]['body'][lang] = body
    with open(af, 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
    print('merged:' + str(len(body)))
PYEOF
)
  if [[ "$MERGE_OUT" == merged:* ]]; then
    BODY_LEN="${MERGE_OUT#merged:}"
    log "  ✅ merged heading=${#heading}c body=${BODY_LEN}c"
    echo "${SLUG_CUR}:sec${SEC_IDX}" >> "$CKPT_FILE"
    SUCCESS=$((SUCCESS+1))
  else
    log "  ⚠️  $MERGE_OUT"
    FAIL=$((FAIL+1))
  fi

  # Rate limit
  sleep 3
done

log "===== i18n-fix-placeholders-batch DONE: success=$SUCCESS fail=$FAIL total=$TOTAL ====="
