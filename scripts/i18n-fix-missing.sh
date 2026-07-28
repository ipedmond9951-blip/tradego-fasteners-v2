#!/bin/bash
# i18n-fix-missing.sh - 补 placeholder/empty 翻译 (单 lang 1 call, minimax 1 section/call)
# 2026-07-21 实战: 7/19 minimax 主循环 100% 报告是误判, 实际 172 (slug, lang) 是 0c 或 placeholder
#
# 用法:
#   bash scripts/i18n-fix-missing.sh                # 默认: 跑所有 172 个
#   LANG=hi bash scripts/i18n-fix-missing.sh       # 只跑某一 lang
#   SLUG=morocco-casablanca-... bash ...           # 只跑某一 article

set -e

PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
mkdir -p "$LOG_DIR" "$TMP_DIR"

LANGS=("es" "ar" "fr" "pt" "ru" "ja" "de" "hi")

# 标准化: 剥 .UTF-8 / .utf8 / .UTF-16 等 locale 后缀,避免写到 'pt.UTF-8' 这种坏 key
# (macOS 默认 LANG=zh_CN.UTF-8, cron 不指定时会被原样传到代码里)
# 注意 bash 5.x quirk: env LANG="" 让 LANG 是 set-but-empty (1 元素空数组),
# 不是 unset, 所以 ${LANG[@]:-${LANGS[@]}} 不会 fallback, 拿到 (""). 用 if/else 严格处理.
if [ -n "$LANG" ]; then
  LANG="${LANG%.*}"
  TARGET_LANGS=("$LANG")
else
  TARGET_LANGS=("${LANGS[@]}")
fi

PLACEHOLDER_PATTERNS=("coming soon" "todo" "placeholder" "tbd")

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "===== i18n-fix-missing START (target langs: ${TARGET_LANGS[@]}) ====="

# 找所有 placeholder + empty
MISSING=()
for ARTICLE_FILE in "$ARTICLES_DIR"/*.json; do
  [ -f "$ARTICLE_FILE" ] || continue
  SLUG=$(basename "$ARTICLE_FILE" .json)
  [ -n "$SLUG_OVERRIDE" ] && [ "$SLUG" != "$SLUG_OVERRIDE" ] && continue

  for LANG in "${TARGET_LANGS[@]}"; do
    # 用 python 检测 (per-section 维度, 任何 1 section 空就触发)
    # 7/28 bug fix: 之前用 avg < 50, 1-2 个空 section 不会让 avg < 50, 检测漏掉
    RESULT=$(python3 - "$ARTICLE_FILE" "$LANG" << 'PYEOF'
import json, sys, re
fp, lang = sys.argv[1], sys.argv[2]
PLACEHOLDER_RE = re.compile(r"\b(coming soon|placeholder|tbd)\b", re.IGNORECASE)
EMPTY_THRESHOLD = 50
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
# Per-section empty check
empty_sections = [
    i for i, s in enumerate(sections)
    if len(s.get('body', {}).get(lang, '')) < EMPTY_THRESHOLD
]
# Per-section placeholder check
placeholder_sections = [
    i for i, s in enumerate(sections)
    if EMPTY_THRESHOLD <= len(s.get('body', {}).get(lang, '')) < 200
    and PLACEHOLDER_RE.search(s.get('body', {}).get(lang, ''))
]
# Description check
desc = d.get('description', {})
desc_empty = isinstance(desc, dict) and not desc.get(lang, '').strip()
desc_placeholder = (
    isinstance(desc, dict)
    and 0 < len(desc.get(lang, '')) < 200
    and PLACEHOLDER_RE.search(desc.get(lang, ''))
)
if empty_sections:
    print(f'EMPTY:{",".join(str(i) for i in empty_sections)}')
elif placeholder_sections:
    print(f'PLACEHOLDER:{",".join(str(i) for i in placeholder_sections)}')
elif desc_empty or desc_placeholder:
    print(f'DESC:{int(desc_placeholder)}')
else:
    print('OK')
PYEOF
)
    if [[ "$RESULT" == EMPTY:* ]] || [[ "$RESULT" == PLACEHOLDER:* ]] || [[ "$RESULT" == DESC:* ]]; then
      MISSING+=("$SLUG:$LANG")
    fi
  done
done

log "Found ${#MISSING[@]} (slug, lang) pairs to fix"

# 跑 minimax 1 lang/call (8 langs batch 容易 3min timeout)
TOTAL=${#MISSING[@]}
i=0
for ENTRY in "${MISSING[@]}"; do
  i=$((i+1))
  SLUG="${ENTRY%%:*}"
  LANG="${ENTRY##*:}"

  ARTICLE_FILE="$ARTICLES_DIR/${SLUG}.json"
  [ -f "$ARTICLE_FILE" ] || continue

  # Build 1 lang prompt
  PROMPT_FILE="$TMP_DIR/${SLUG}_body_${LANG}_fix.txt"
  RAW_FILE="$TMP_DIR/${SLUG}_body_${LANG}_fix.raw.txt"
  RESULT_FILE="$TMP_DIR/${SLUG}_body_${LANG}_fix.json"

  python3 - "$ARTICLE_FILE" "$LANG" > "$PROMPT_FILE" << 'PYEOF'
import json, sys
fp, lang = sys.argv[1], sys.argv[2]
with open(fp) as f:
    a = json.load(f)
title = a['title']['en']
sections = a.get('sections', [])
parts = [f'Translate ALL section bodies to {lang} (full 1500+ chars per section, not placeholder).']
parts.append(f'Article title (EN, for context): {title}')
parts.append('')
parts.append('Output STRICT JSON: {"translations": {"' + lang + '": {"title": "...", "sections": [{"heading": "...", "body": "..."}, ...], "faqs": [{"q": "...", "a": "..."}, ...], "ctaText": "..."}}}')
parts.append('RULES:')
parts.append('1. Translate EVERY section body FULLY (1500+ chars each, no placeholder/todo/coming-soon)')
parts.append('2. Preserve technical terms (HS code, ISO, ASTM, AfCFTA, ECOWAS) as-is')
parts.append('3. Preserve citations [1], [2] intact')
parts.append('4. Keep HTML <a href="..."> tags as-is in body')
parts.append('5. CRITICAL: escape ALL double quotes in JSON string values with backslash')
parts.append('6. Output ONLY the JSON object, no markdown fence, no commentary')
parts.append('')
parts.append('SECTION BODIES TO TRANSLATE:')
for i, s in enumerate(sections):
    body_en = s.get('body', {}).get('en', '')
    if not body_en:
        # Fallback: 缺 en 用 zh 或 first available lang
        for L in ['zh','ja','de','ru','pt','es','ar','fr','hi']:
            alt = s.get('body', {}).get(L, '')
            if alt:
                body_en = f'[EN body missing, using {L} as source] {alt}'
                break
        if not body_en:
            continue
    heading_en = s.get('heading', {}).get('en', '')
    if not heading_en:
        for L in ['zh','ja','de','ru','pt','es','ar','fr','hi']:
            alt = s.get('heading', {}).get(L, '')
            if alt:
                heading_en = alt
                break
        if not heading_en:
            heading_en = f'Section {i}'
    parts.append(f'--- section {i} ---')
    parts.append(f'heading(en): {heading_en}')
    parts.append(f'body(en):')
    parts.append(body_en)
faqs = a.get('faqs', [])
if faqs:
    parts.append('')
    parts.append('FAQs:')
    for i, f in enumerate(faqs):
        q_en = f.get('q', {}).get('en', '')
        a_en = f.get('a', {}).get('en', '')
        if not q_en:
            for L in ['zh','ja','de','ru','pt','es','ar','fr','hi']:
                alt = f.get('q', {}).get(L, '')
                if alt:
                    q_en = f'[EN missing, using {L}] {alt}'
                    break
        if not a_en:
            for L in ['zh','ja','de','ru','pt','es','ar','fr','hi']:
                alt = f.get('a', {}).get(L, '')
                if alt:
                    a_en = f'[EN missing, using {L}] {alt}'
                    break
        parts.append(f'--- faq {i} ---')
        parts.append(f'q(en): {q_en}')
        parts.append(f'a(en): {a_en}')
cta = a.get('cta', {}).get('text', {}).get('en', '')
if cta:
    parts.append('')
    parts.append(f'CTA text(en): {cta}')
print('\n'.join(parts))
PYEOF

  # Retry 3 times (minimax 偶发 3min timeout, ja/ar 长 prompt 触发)
  log "[$i/$TOTAL] $SLUG $LANG"
  SUCCESS=0
  for ATTEMPT in 1 2 3; do
    if [ "$ATTEMPT" -gt 1 ]; then
      log "    retry $ATTEMPT: sleep 8s + inject nonce"
      sleep 8
    fi
    if bash "$SCRIPT_DIR/minimax-quick.sh" "$(cat "$PROMPT_FILE")" "MiniMax-M3" 16000 > "$RAW_FILE" 2>&1; then
      RAW_LEN=$(wc -c < "$RAW_FILE")
      if [ "$RAW_LEN" -ge 200 ]; then
        SUCCESS=1
        break
      else
        log "    attempt $ATTEMPT: raw too short ($RAW_LEN c)"
      fi
    else
      log "    attempt $ATTEMPT: minimax exit $?"
    fi
  done

  if [ "$SUCCESS" -eq 0 ]; then
    log "  ❌ all 3 attempts failed"
    continue
  fi

    # Parse
    if python3 "$SCRIPT_DIR/parse_translation_result.py" "$RAW_FILE" "$RESULT_FILE" 2>> "$LOG_DIR/parse_errors-fix.log"; then
      # Merge
      python3 - "$ARTICLE_FILE" "$RESULT_FILE" "$LANG" << 'PYEOF'
import json, sys
af, rf, lang = sys.argv[1], sys.argv[2], sys.argv[3]
with open(af) as f: a = json.load(f)
with open(rf) as f: r = json.load(f)
# parse_translation_result.py 8 langs batch 返 {"translations": {lang: ...}}, 单段返 {"translations": {"sec": ...}}
# 兼容两种格式
trans = r.get('translations', {}).get(lang)
if not trans or not isinstance(trans, dict):
    # fallback to 'sec' (single-section format)
    trans = r.get('translations', {}).get('sec', r)
if not trans or not isinstance(trans, dict):
    print(f'  ❌ no valid {lang} in result', flush=True)
    sys.exit(0)
if 'title' in trans and isinstance(trans['title'], str):
    a['title'][lang] = trans['title']
if 'sections' in trans and isinstance(trans['sections'], list):
    for i, sec_trans in enumerate(trans['sections']):
        if i < len(a.get('sections', [])) and isinstance(sec_trans, dict):
            if 'heading' in sec_trans:
                a['sections'][i]['heading'][lang] = sec_trans['heading']
            if 'body' in sec_trans:
                a['sections'][i]['body'][lang] = sec_trans['body']
if 'faqs' in trans and a.get('faqs'):
    for i, f_trans in enumerate(trans['faqs']):
        if i < len(a['faqs']) and isinstance(f_trans, dict):
            if 'q' in f_trans:
                a['faqs'][i]['q'][lang] = f_trans['q']
            if 'a' in f_trans:
                a['faqs'][i]['a'][lang] = f_trans['a']
if 'ctaText' in trans and a.get('cta'):
    a['cta']['text'][lang] = trans['ctaText']
# Atomic write: write to .tmp, fsync, rename (7/28 fix: 防止 kill 中间留下半成品 JSON)
tmp_af = af + '.tmp'
with open(tmp_af, 'w') as f:
    json.dump(a, f, ensure_ascii=False, indent=2)
    f.flush()
    import os as _os; _os.fsync(f.fileno())
_os.rename(tmp_af, af)
n = sum(1 for s in a.get('sections', []) if len(s.get('body',{}).get(lang,'')) > 200)
print(f'  ✅ merged {n}/{len(a.get("sections",[]))} sections', flush=True)
PYEOF
    else
      log "  ❌ parse fail"
    fi
  sleep 3
done

log "===== i18n-fix-missing DONE ====="
