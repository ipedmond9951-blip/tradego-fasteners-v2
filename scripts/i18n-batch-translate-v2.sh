#!/bin/bash
# i18n-batch-translate-v2.sh - 8 langs/call 批量 (h2 优化版)
# 用法: bash i18n-batch-translate-v2.sh h2
#
# 关键优化 (2026-07-16 22:00 实战调优):
# - v1: 1 call = 1 article × 1 lang → 63s/语言 → 161 篇 × 8 langs = 22.5h (太慢)
# - v2: 1 call = 1 article × 8 langs → 50s/篇 → 161 篇 × 1 call = 2.5h (8x 提速)
# - 关键: h2 短 (1 句), 7 sections × 8 langs = 56 translations, 输出约 2KB, 豆包能装下
# - 风险: 单次失败 = 8 langs 全废; 但失败可 retry 一次
# - body 仍用 v1 (单 lang/call, 输出大) - 等 v2 验证 h2 后再优化 body

set -e

PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
DONE_FILE="$LOG_DIR/${1:-h2}.done"
FAIL_FILE="$LOG_DIR/${1:-h2}.failed.jsonl"

LANGS=("es" "ar" "fr" "pt" "ru" "ja" "de" "hi")

mkdir -p "$LOG_DIR" "$TMP_DIR"

# 加载 env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

# 检查 Chrome
if ! curl -sf http://localhost:18800/json/version > /dev/null 2>&1; then
  echo "[fatal] Chrome 18800 not running" >&2; exit 2
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# detect missing sections for an article (h2 only)
# Output: list of (lang, [s_idx]) for missing
detect_missing() {
  local slug="$1"
  local type="$2"
  local file="$ARTICLES_DIR/${slug}.json"
  if [ ! -f "$file" ]; then echo "NOFILE"; return; fi
  python3 -c "
import json
slug = '$slug'
typ = '$type'
LANGS = ['es','ar','fr','pt','ru','ja','de','hi']
PLACEHOLDER = ['coming soon', 'content coming', 'todo', 'placeholder', 'tbd']
with open('$file') as f: a = json.load(f)
missing_by_lang = {}
for s_idx, sec in enumerate(a.get('sections', [])):
    for lang in LANGS:
        v = sec.get('heading' if typ == 'h2' else 'body', {}).get(lang, '')
        v_lower = str(v).lower().strip()
        is_placeholder = any(p in v_lower for p in PLACEHOLDER)
        if (not v) or is_placeholder:
            missing_by_lang.setdefault(lang, []).append(s_idx)
# output as JSON for easy parsing
print('MISSING_JSON_START' + json.dumps(missing_by_lang) + 'MISSING_JSON_END')
" 2>/dev/null | sed -n 's/.*MISSING_JSON_START\(.*\)MISSING_JSON_END.*/\1/p'
}

# Translate 1 article × N langs in 1 call
# Usage: translate_article_batch <slug> <type> <lang1,lang2,...>
translate_article_batch() {
  local slug="$1"
  local type="$2"
  local langs_csv="$3"  # comma-separated
  local file="$ARTICLES_DIR/${slug}.json"
  local prompt_file="$TMP_DIR/${slug}_${type}_batch.txt"
  local result_file="$TMP_DIR/${slug}_${type}_batch.json"
  local nonce=$(date +%s%N | sha256sum | head -c 12)
  IFS=',' read -ra LANGS_ARR <<< "$langs_csv"

  # Build prompt: translate all sections in all given langs
  python3 -c "
import json
slug = '$slug'
typ = '$type'
LANGS_LIST = '$langs_csv'.split(',')
LANGS_MAP = {'es':'Spanish','ar':'Arabic','fr':'French','pt':'Portuguese','ru':'Russian','ja':'Japanese','de':'German','hi':'Hindi'}
PLACEHOLDER = ['coming soon', 'content coming', 'todo', 'placeholder', 'tbd']
nonce = '$nonce'
with open('$file') as f: a = json.load(f)
sections = a.get('sections', [])
# For each section, collect items per lang
items_by_lang = {lang: [] for lang in LANGS_LIST}
for s_idx, sec in enumerate(sections):
    field = 'heading' if typ == 'h2' else 'body'
    for lang in LANGS_LIST:
        v_en = sec.get(field, {}).get('en', '')
        v_target = sec.get(field, {}).get(lang, '')
        v_target_lower = str(v_target).lower().strip()
        is_placeholder = any(p in v_target_lower for p in PLACEHOLDER)
        if (not v_target) or is_placeholder:
            items_by_lang[lang].append({'idx': s_idx, 'en': v_en})
# Only output langs that have items
non_empty = {k: v for k, v in items_by_lang.items() if v}
if not non_empty:
    import sys; sys.exit(0)
lang_blocks = []
for lang, items in non_empty.items():
    target = LANGS_MAP[lang]
    lang_blocks.append(f'  \"{lang}\" ({target}):\n    {json.dumps(items, ensure_ascii=False)}')
prompt = f'''You are a professional B2B trade content translator for fasteners/hardware targeting African and global B2B buyers. (session: {nonce})

Translate each section's English text to the listed languages. The same section index may appear in multiple languages — translate each one independently.

Output ONLY a valid JSON object (no markdown fence, no commentary) in this EXACT structure:
{{
{',\n'.join(f'  \"{lang}\": [{{\"idx\": <int>, \"translation\": \"<text>\"}}, ...]' for lang in non_empty.keys())}
}}

Items to translate:
{chr(10).join(lang_blocks)}

Critical:
- Use SHORT, NATURAL translations for headings (h2) — should be similar length to English
- For body, preserve all HTML anchor tags exactly (e.g. <a href=\"...\">text</a>)
- Technical terms (ISO 898-1, EN 14399, HS 7318, port names, org names) keep in their commonly-used form
- Each idx must match the input idx exactly'''
with open('$prompt_file', 'w') as f: f.write(prompt)
" 2>/dev/null

  if [ ! -s "$prompt_file" ]; then
    return 0
  fi

  # Call AI (doubao primary, others fallback)
  # 2026-07-17 00:30 调优: Grok 出现 echo prompt 异常 (dedup 残留或 chat 状态)
  # 改用 豆包 主线 (7/17 quota 重置, 30/day 充裕)
  local result=""
  for ai in doubao gemini grok deepseek; do
    result=$(timeout 300 bash "$SCRIPT_DIR/seo-ai-router-call.sh" "$ai" "$prompt_file" 270 2>&1) || true
    if [ -n "$result" ] && ! echo "$result" | grep -qE "^\[error\]|^\[warn\]|daily_limit|duplicate_prompt|too_frequent|ai-guard|quarantine|不可达|静默"; then
      break
    fi
    sleep 3
  done

  if [ -z "$result" ] || echo "$result" | grep -qE "^\[error\]|^\[warn\]|daily_limit|duplicate_prompt|too_frequent|ai-guard|quarantine|不可达"; then
    log "  ❌ FAIL batch ($langs_csv) for $slug"
    echo "{\"slug\":\"$slug\",\"type\":\"$type\",\"langs\":\"$langs_csv\",\"reason\":\"all_ai_fail\"}" >> "$FAIL_FILE"
    return 1
  fi

  # Save raw + parse
  echo "$result" > "$TMP_DIR/${slug}_${type}_batch.raw.txt"
  if python3 "$SCRIPT_DIR/parse_translation_result.py" "$TMP_DIR/${slug}_${type}_batch.raw.txt" "$result_file" 2>> "$LOG_DIR/parse_errors.log"; then
    log "  ✅ OK batch ($langs_csv) for $slug"
    return 0
  else
    log "  ❌ PARSE FAIL batch ($langs_csv) for $slug"
    echo "{\"slug\":\"$slug\",\"type\":\"$type\",\"langs\":\"$langs_csv\",\"reason\":\"parse_fail\"}" >> "$FAIL_FILE"
    return 1
  fi
}

# Merge batch result back to article.json
merge_batch() {
  local slug="$1"
  local type="$2"
  local file="$ARTICLES_DIR/${slug}.json"
  local result_file="$TMP_DIR/${slug}_${type}_batch.json"
  if [ ! -s "$result_file" ]; then return 0; fi
  python3 -c "
import json
slug = '$slug'
typ = '$type'
file = '$file'
result_file = '$result_file'
with open(file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
field = 'heading' if typ == 'h2' else 'body'
translations = r.get('translations', {})
if not isinstance(translations, dict):
    print(f'[merge] unexpected format: {type(translations)}')
    import sys; sys.exit(1)
for lang, items in translations.items():
    trans_map = {t['idx']: t['translation'] for t in items if isinstance(t, dict) and 'idx' in t and 'translation' in t}
    for s_idx, sec in enumerate(a.get('sections', [])):
        if s_idx in trans_map:
            sec.setdefault(field, {})[lang] = trans_map[s_idx]
with open(file, 'w') as f:
    json.dump(a, f, ensure_ascii=False, indent=2)
print(f'[merge] updated {len(translations)} langs for {slug}')
" 2>> "$LOG_DIR/parse_errors.log"
}

# === MAIN ===
MODE="${1:-h2}"
COOLDOWN_SLEEP=35
# 2026-07-16 21:15 调整 (总裁选项 C): 每天 max 50 calls, 留 15 buffer 不触 65 上限
# 不动 ai-guard.js (硬安全机制), 仅在脚本层限速
DAILY_QUOTA=50
QUOTA_COUNTER="$HOME/.openclaw/workspace/ai-guard-counter.json"
get_today_used() {
  python3 -c "
import json, os
try:
    with open(os.path.expanduser('$QUOTA_COUNTER')) as f:
        d = json.load(f)
    today = __import__('datetime').date.today().isoformat()
    print(sum(d.get('daily', {}).get(today, {}).values()))
except Exception as e:
    print(0)
" 2>/dev/null
}

log "===== ${MODE} BATCH TRANSLATION v2 START (8 langs/call, daily quota $DAILY_QUOTA) ====="

for slug in $(jq -r '.slug' "$ARTICLES_DIR"/*.json 2>/dev/null | sort -u); do
  # 2026-07-16 quota check: 每天 max $DAILY_QUOTA calls
  TODAY_USED=$(get_today_used)
  if [ "$TODAY_USED" -ge "$DAILY_QUOTA" ]; then
    log "⏸️ 今日 quota 已用 $TODAY_USED/$DAILY_QUOTA, 退出等明天 00:00 cron 重启"
    log "   (cron ee39e1bc 每天 0 0 * * * 自动恢复)"
    exit 0
  fi

  if grep -q "^${slug}\$" "$DONE_FILE" 2>/dev/null; then
    continue
  fi
  missing_json=$(detect_missing "$slug" "$MODE")
  if [ -z "$missing_json" ] || [ "$missing_json" = "NOFILE" ]; then
    echo "$slug" >> "$DONE_FILE"
    continue
  fi

  # Build langs CSV
  missing_langs=$(echo "$missing_json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(','.join(d.keys()))" 2>/dev/null)
  if [ -z "$missing_langs" ]; then
    echo "$slug" >> "$DONE_FILE"
    continue
  fi

  log "translating $MODE batch ($missing_langs): $slug"

  # Sleep before to respect cooldown
  sleep "$COOLDOWN_SLEEP"
  if translate_article_batch "$slug" "$MODE" "$missing_langs"; then
    merge_batch "$slug" "$MODE"
    echo "$slug" >> "$DONE_FILE"
    log "✅ DONE $MODE: $slug"
  else
    log "⚠️ FAIL $MODE: $slug (see $FAIL_FILE)"
  fi
done
log "===== ${MODE} BATCH TRANSLATION v2 END ====="
