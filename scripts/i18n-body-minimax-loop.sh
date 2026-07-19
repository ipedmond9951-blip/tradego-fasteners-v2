#!/bin/bash
# i18n-body-minimax-loop.sh - Body 翻译 minimax-only 1-lang/call 主循环
# 2026-07-19 04:55 创建: 替代 v2 1-lang fix6 (太慢 + minimax 兜底 6+min timeout)
#
# 优势:
# - minimax 1-lang 翻译已知稳定 (Senegal 8 langs / Ivory Coast 9 langs 验证)
# - 8 langs × ~1m15s/lang = 10min/篇
# - 不抢 chrome 18800 (与 v2 i18n 主循环可并行)
# - minimax 串行 8 langs → 修豆包串语言污染 (lang chars < 30% 视为污染)
# - 失败 retry 5 次 (minimax 偶发 3-6min timeout)
# - 180 篇 × 10min = ~30h 完成
#
# 用法: nohup bash scripts/i18n-body-minimax-loop.sh > logs/i18n-translate/body-minimax-loop-$(date +%Y%m%d).log 2>&1 < /dev/null &

set -e

PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
mkdir -p "$LOG_DIR" "$TMP_DIR"

LANGS=("es" "ar" "fr" "pt" "ru" "ja" "de" "hi")
DONE_FILE="$LOG_DIR/body-minimax.done"
FAIL_FILE="$LOG_DIR/body-minimax.failed.jsonl"
touch "$DONE_FILE"

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

log "===== body minimax-only LOOP START (8 langs/call) ====="

# Get all slugs (skip already done)
for slug in $(jq -r '.slug' "$ARTICLES_DIR"/*.json 2>/dev/null | sort -u); do
  if grep -q "^${slug}\$" "$DONE_FILE" 2>/dev/null; then
    continue
  fi
  ARTICLE_FILE="$ARTICLES_DIR/${slug}.json"
  if [ ! -f "$ARTICLE_FILE" ]; then continue; fi

  # Detect missing body langs
  MISSING=$(python3 -c "
import json
LANGS = ['es','ar','fr','pt','ru','ja','de','hi']
with open('$ARTICLE_FILE') as f: a = json.load(f)
missing = []
for lang in LANGS:
    for s in a.get('sections', []):
        v = s.get('body', {}).get(lang, '')
        if not v:
            missing.append(lang)
            break
print(','.join(missing))
" 2>/dev/null)

  if [ -z "$MISSING" ]; then
    echo "$slug" >> "$DONE_FILE"
    continue
  fi

  log "translating $slug: missing $MISSING"

  # 1 lang/call minimax
  IFS=',' read -ra MISSING_ARR <<< "$MISSING"
  for LANG in "${MISSING_ARR[@]}"; do
    log "  -- $LANG --"

    PROMPT_FILE="$TMP_DIR/${slug}_body_${LANG}_mini.txt"
    RESULT_FILE="$TMP_DIR/${slug}_body_${LANG}_mini.json"
    RAW_FILE="$TMP_DIR/${slug}_body_${LANG}_mini.raw.txt"

    # Build prompt (use external python file to avoid bash double-quote escape hell)
    LANG="$LANG" ARTICLE_FILE="$ARTICLE_FILE" python3 "$SCRIPT_DIR/_build_body_prompt.py" > "$PROMPT_FILE"

    # Retry 5 times
    SUCCESS=0
    for ATTEMPT in 1 2 3 4 5; do
      log "    attempt $ATTEMPT: minimax M2.7 16000..."
      if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M2.7" 16000 > "$RAW_FILE" 2>&1; then
        RAW_LEN=$(wc -c < "$RAW_FILE")
        if [ "$RAW_LEN" -gt 1000 ]; then
          # Parse
          if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors-minimax.log"; then
            # Verify target lang chars > 30%
            LANG_RATIO=$(python3 -c "
import json
try:
    with open('$RESULT_FILE') as f: r = json.load(f)
    trans = r.get('translations', {}).get('$LANG', {})
    all_text = json.dumps(trans, ensure_ascii=False)
    # Lang char ratio check
    if '$LANG' in ['zh', 'ja', 'hi']:
        non_ascii = sum(1 for c in all_text if ord(c) > 127)
        ratio = non_ascii / max(len(all_text), 1)
    elif '$LANG' == 'ar':
        non_ascii = sum(1 for c in all_text if 0x0600 <= ord(c) <= 0x06FF)
        ratio = non_ascii / max(len(all_text), 1)
    elif '$LANG' == 'ru':
        cyr = sum(1 for c in all_text if 0x0400 <= ord(c) <= 0x04FF)
        ratio = cyr / max(len(all_text), 1)
    else:
        # Latin: just check length
        ratio = 1.0
    print(f'{ratio:.2f}')
except Exception as e:
    print('0.0')
" 2>/dev/null)
            if (( $(echo "$LANG_RATIO > 0.30" | bc -l 2>/dev/null || echo "1") )); then
              # Merge to article
              python3 -c "
import json
with open('$ARTICLE_FILE') as f: a = json.load(f)
with open('$RESULT_FILE') as f: r = json.load(f)
trans = r.get('translations', {}).get('$LANG', {})
if trans:
    if 'title' in trans: a['title']['$LANG'] = trans['title']
    if 'sections' in trans:
        for i, st in enumerate(trans['sections']):
            if i < len(a.get('sections', [])):
                sec = a['sections'][i]
                # 2026-07-19 21:13 FIX: FAQ sections 没 body 字段 (用 faqItems) → 报 KeyError 'body'
                if not isinstance(sec.get('body'), dict):
                    sec['body'] = {}
                if not isinstance(sec.get('heading'), dict):
                    sec['heading'] = {}
                if isinstance(st, dict) and 'heading' in st and st['heading']:
                    sec['heading']['$LANG'] = st['heading']
                if isinstance(st, dict) and 'body' in st and st['body']:
                    sec['body']['$LANG'] = st['body']
    if 'faqs' in trans and a.get('faqs'):
        for i, ft in enumerate(trans['faqs']):
            if i < len(a['faqs']):
                if isinstance(ft, dict) and 'q' in ft and ft['q']:
                    a['faqs'][i]['q']['$LANG'] = ft['q']
                if isinstance(ft, dict) and 'a' in ft and ft['a']:
                    a['faqs'][i]['a']['$LANG'] = ft['a']
    if 'ctaText' in trans and a.get('cta'):
        a['cta']['text']['$LANG'] = trans['ctaText']
    with open('$ARTICLE_FILE', 'w') as f:
        json.dump(a, f, ensure_ascii=False, indent=2)
print(f'    ✅ merged $LANG (ratio=$LANG_RATIO)')
" 2>&1
              SUCCESS=1
              break
            else
              log "    ⚠️ lang ratio $LANG_RATIO too low (污染?), retry"
            fi
          else
            log "    ⚠️ parse fail (raw $RAW_LEN chars), retry"
          fi
        else
          log "    ⚠️ raw too short ($RAW_LEN chars), retry"
        fi
      else
        log "    ⚠️ minimax fail, retry"
      fi
      sleep 5
    done

    if [ "$SUCCESS" = "0" ]; then
      log "  ❌ FAIL $LANG for $slug (5 attempts)"
      echo "{\"slug\":\"$slug\",\"type\":\"body\",\"langs\":\"$LANG\",\"reason\":\"minimax_5x_fail\"}" >> "$FAIL_FILE"
    fi
    sleep 3
  done

  echo "$slug" >> "$DONE_FILE"
  log "✅ DONE $slug"
done

log "===== body minimax-only LOOP END ====="
