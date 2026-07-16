#!/bin/bash
# i18n-batch-translate.sh - 批量翻译文章 8 语言 (es/ar/fr/pt/ru/ja/de/hi)
# 用法:
#   bash i18n-batch-translate.sh h2         # 翻译所有 160 篇 h2 缺失的
#   bash i18n-batch-translate.sh body        # 翻译所有 181 篇 body 缺失/短的
#   bash i18n-batch-translate.sh all         # 两者都跑
#   bash i18n-batch-translate.sh h2 <slug>   # 翻译单篇
#
# 设计原则 (2026-07-16 总裁拍板):
#   - 按 article 批量 (避免 1 call = 1 translation 的 N 次浪费)
#   - 4 langs/call (豆包输出限制, 8 langs 一次会截断)
#   - checkpoint state: logs/i18n-translate/{type}.done 记录已完成的
#   - rate-limit 4s/call (避免豆包 ban)
#   - 失败 retry 2 次, 还失败写 failed.jsonl
#   - 不用 minimax (7/6 永禁), 走 ai-router 豆包 → Gemini fallback
#
# 检查: 已有 4 篇 (ghana-tema-port / uganda-oil-refinery / rwanda-construction / angola-lng)
#       全 10 语言翻译好, 会自动 skip

set -e

PROJECT_DIR="$HOME/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
ARTICLES_DIR="$PROJECT_DIR/content/articles"
LOG_DIR="$PROJECT_DIR/logs/i18n-translate"
TMP_DIR="$LOG_DIR/tmp"
DONE_FILE="$LOG_DIR/${1:-h2}.done"
FAIL_FILE="$LOG_DIR/${1:-h2}.failed.jsonl"

LANGS=("es" "ar" "fr" "pt" "ru" "ja" "de" "hi")
LANG_NAMES=("Spanish" "Arabic" "French" "Portuguese" "Russian" "Japanese" "German" "Hindi")
# 2026-07-16 调优: 豆包 24h dedup + 30s too_frequent cooldown
# 用 nonce + sleep 35s (>=30s cooldown 阈值) 绕开
COOLDOWN_SLEEP=35

mkdir -p "$LOG_DIR" "$TMP_DIR"

# 加载 env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

# 检查 Chrome
if ! curl -sf http://localhost:18800/json/version > /dev/null 2>&1; then
  echo "[fatal] Chrome 18800 not running, ai-router unavailable" >&2
  exit 2
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# 检测单篇缺失情况
# Usage: detect_missing <slug> h2|body
detect_missing() {
  local slug="$1"
  local type="$2"  # h2 or body
  local file="$ARTICLES_DIR/${slug}.json"
  if [ ! -f "$file" ]; then echo "NOFILE"; return; fi

  python3 -c "
import json, sys
slug = '$slug'
typ = '$type'
LANGS = ['es','ar','fr','pt','ru','ja','de','hi']
PLACEHOLDER = ['coming soon', 'content coming', 'todo', 'placeholder', 'tbd']
with open('$file') as f:
    a = json.load(f)
missing = {}
for s_idx, sec in enumerate(a.get('sections', [])):
    for lang in LANGS:
        if typ == 'h2':
            v = sec.get('heading', {}).get(lang, '')
        else:  # body
            v = sec.get('body', {}).get(lang, '')
        v_lower = str(v).lower().strip()
        is_placeholder = any(p in v_lower for p in PLACEHOLDER)
        # 2026-07-16 fix: 不用 <50 chars 判定 (JA/ZH 短句合法, 误判)
        # 改为: 只看空/占位符
        if (not v) or is_placeholder:
            missing.setdefault(lang, []).append(s_idx)
print('|'.join(f'{lang}:{','.join(map(str,idxs))}' for lang,idxs in missing.items()))
" 2>/dev/null
}

# 翻译单篇
# Usage: translate_article <slug> <type> <lang>
translate_article() {
  local slug="$1"
  local type="$2"  # h2 or body
  local lang="$3"
  local file="$ARTICLES_DIR/${slug}.json"
  local prompt_file="$TMP_DIR/${slug}_${type}_${lang}.txt"
  local result_file="$TMP_DIR/${slug}_${type}_${lang}.json"

  # Build prompt (with nonce to avoid 24h dedup)
  local nonce=$(date +%s%N | sha256sum | head -c 12)
  python3 -c "
import json, sys
slug = '$slug'
typ = '$type'
lang = '$lang'
nonce = '$nonce'
LANGS_MAP = {'es':'Spanish','ar':'Arabic','fr':'French','pt':'Portuguese','ru':'Russian','ja':'Japanese','de':'German','hi':'Hindi'}
PLACEHOLDER = ['coming soon', 'content coming', 'todo', 'placeholder', 'tbd']
with open('$file') as f:
    a = json.load(f)
sections = a.get('sections', [])
items = []
for s_idx, sec in enumerate(sections):
    if typ == 'h2':
        v_en = sec.get('heading', {}).get('en', '')
        v_target = sec.get('heading', {}).get(lang, '')
    else:
        v_en = sec.get('body', {}).get('en', '')
        v_target = sec.get('body', {}).get(lang, '')
    v_target_lower = str(v_target).lower().strip()
    is_placeholder = any(p in v_target_lower for p in PLACEHOLDER)
    if (not v_target) or is_placeholder:
        items.append({'idx': s_idx, 'en': v_en, 'id': sec.get('id', f'section-{s_idx+1}')})
if not items:
    sys.exit(0)
target_lang = LANGS_MAP[lang]
prompt = f'''You are a professional B2B trade content translator specializing in fasteners, hardware, and industrial procurement for African and global markets. (session: {nonce})

Translate the following English texts to {target_lang} ({lang}). The content is for a B2B fasteners website targeting importers, distributors, and industrial buyers. Keep technical terms (ISO standards, HS codes, port names, organization names) accurate and in their commonly-used form. Preserve all HTML anchor tags and structure exactly.

Output ONLY a JSON object: {{\"translations\": [{{\"idx\": <int>, \"translation\": \"<text>\"}}, ...]}}

Items to translate:
{json.dumps(items, ensure_ascii=False, indent=2)}

Critical: output valid JSON only, no markdown fence, no commentary.'''
with open('$prompt_file', 'w') as f:
    f.write(prompt)
" 2>/dev/null

  if [ ! -s "$prompt_file" ]; then
    return 0  # nothing to translate
  fi

  # Call ai-router 豆包
  local AI="doubao"
  local TIMEOUT=300
  local MAX_ATTEMPTS=2
  local attempt=0
  local result=""
  while [ $attempt -lt $MAX_ATTEMPTS ]; do
    attempt=$((attempt + 1))
    result=$(timeout --kill-after=20 "$TIMEOUT" bash "$SCRIPT_DIR/seo-ai-router-call.sh" "$AI" "$prompt_file" 195 2>&1) || true
    if [ -n "$result" ] && ! echo "$result" | grep -qE "^\[error\]|^\[warn\]"; then
      break
    fi
    if [ $attempt -lt $MAX_ATTEMPTS ]; then
      log "  retry $attempt for $slug $type $lang"
      sleep 5
    fi
  done

  if [ -z "$result" ] || echo "$result" | grep -qE "^\[error\]|^\[warn\]"; then
    # Try Gemini as fallback
    log "  doubao fail, trying gemini for $slug $type $lang"
    result=$(timeout --kill-after=20 "$TIMEOUT" bash "$SCRIPT_DIR/seo-ai-router-call.sh" "gemini" "$prompt_file" 195 2>&1) || true
  fi

  if [ -z "$result" ] || echo "$result" | grep -qE "^\[error\]|^\[warn\]"; then
    log "  ❌ FAIL: $slug $type $lang (all AIs failed)"
    echo "{\"slug\":\"$slug\",\"type\":\"$type\",\"lang\":\"$lang\",\"reason\":\"all_ai_fail\"}" >> "$FAIL_FILE"
    return 1
  fi

  # Parse result as JSON (use separate python script for reliable exit code)
  echo "$result" > "$TMP_DIR/${slug}_${type}_${lang}.raw.txt"
  if python3 "$SCRIPT_DIR/parse_translation_result.py" "$TMP_DIR/${slug}_${type}_${lang}.raw.txt" "$result_file" 2>> "$LOG_DIR/parse_errors.log"; then
    log "  ✅ OK: $slug $type $lang"
    return 0
  else
    log "  ❌ PARSE FAIL: $slug $type $lang (see $LOG_DIR/parse_errors.log)"
    echo "{\"slug\":\"$slug\",\"type\":\"$type\",\"lang\":\"$lang\",\"reason\":\"parse_fail\",\"raw_preview\":\"$(echo "$result" | head -c 200 | tr '\n' ' ')\"}" >> "$FAIL_FILE"
    return 1
  fi
}

# Merge 单篇翻译结果回 article.json
# Usage: merge_translations <slug> <type> <lang>
merge_translations() {
  local slug="$1"
  local type="$2"
  local lang="$3"
  local file="$ARTICLES_DIR/${slug}.json"
  local result_file="$TMP_DIR/${slug}_${type}_${lang}.json"

  if [ ! -s "$result_file" ]; then
    return 0
  fi

  python3 -c "
import json
slug = '$slug'
typ = '$type'
lang = '$lang'
file = '$file'
result_file = '$result_file'
with open(file) as f: a = json.load(f)
with open(result_file) as f: r = json.load(f)
translations = {t['idx']: t['translation'] for t in r.get('translations', []) if 'idx' in t and 'translation' in t}
for s_idx, sec in enumerate(a.get('sections', [])):
    if s_idx in translations:
        if typ == 'h2':
            sec.setdefault('heading', {})[lang] = translations[s_idx]
        else:
            sec.setdefault('body', {})[lang] = translations[s_idx]
with open(file, 'w') as f:
    json.dump(a, f, ensure_ascii=False, indent=2)
" 2>/dev/null
}

# 主流程
MODE="${1:-h2}"
if [ "$MODE" = "h2" ] || [ "$MODE" = "all" ]; then
  log "===== H2 TRANSLATION START ====="
  for slug in $(jq -r '.slug' "$ARTICLES_DIR"/*.json 2>/dev/null | sort -u); do
    if grep -q "^${slug}\$" "$DONE_FILE" 2>/dev/null; then
      log "skip (done): $slug"
      continue
    fi
    # Check if has missing h2
    missing=$(detect_missing "$slug" "h2")
    if [ -z "$missing" ] || [ "$missing" = "NOFILE" ]; then
      echo "$slug" >> "$DONE_FILE"
      continue
    fi
    log "translating h2: $slug (missing: $missing)"
    # 2026-07-16 调优: 每 article 前先 sleep 35s, 避开上一 article 最后一 call + 任何 manual test 的 30s cooldown
    sleep "$COOLDOWN_SLEEP"
    ok=true
    for lang in "${LANGS[@]}"; do
      # 2026-07-16 fix: missing 是单行 (es:0,1,2|ar:0,1,2|...), 不能用 ^ 锚定
      if echo "$missing" | grep -qE "(^|\|)${lang}:"; then
        if ! translate_article "$slug" "h2" "$lang"; then
          ok=false
        fi
        sleep "$COOLDOWN_SLEEP"
      fi
    done
    if $ok; then
      # Merge all langs
      for lang in "${LANGS[@]}"; do
        merge_translations "$slug" "h2" "$lang"
      done
      echo "$slug" >> "$DONE_FILE"
      log "✅ DONE h2: $slug"
    else
      log "⚠️ PARTIAL: $slug (see $FAIL_FILE)"
    fi
  done
  log "===== H2 TRANSLATION END ====="
fi

if [ "$MODE" = "body" ] || [ "$MODE" = "all" ]; then
  log "===== BODY TRANSLATION START ====="
  DONE_FILE="$LOG_DIR/body.done"
  FAIL_FILE="$LOG_DIR/body.failed.jsonl"
  for slug in $(jq -r '.slug' "$ARTICLES_DIR"/*.json 2>/dev/null | sort -u); do
    if grep -q "^${slug}\$" "$DONE_FILE" 2>/dev/null; then
      log "skip (done): $slug"
      continue
    fi
    missing=$(detect_missing "$slug" "body")
    if [ -z "$missing" ] || [ "$missing" = "NOFILE" ]; then
      echo "$slug" >> "$DONE_FILE"
      continue
    fi
    log "translating body: $slug (missing: $missing)"
    sleep "$COOLDOWN_SLEEP"
    ok=true
    for lang in "${LANGS[@]}"; do
      # 2026-07-16 fix: missing 单行匹配, 用 (^|\|) 锚定
      if echo "$missing" | grep -qE "(^|\|)${lang}:"; then
        if ! translate_article "$slug" "body" "$lang"; then
          ok=false
        fi
        sleep "$COOLDOWN_SLEEP"  # body calls are bigger, longer cooldown
      fi
    done
    if $ok; then
      for lang in "${LANGS[@]}"; do
        merge_translations "$slug" "body" "$lang"
      done
      echo "$slug" >> "$DONE_FILE"
      log "✅ DONE body: $slug"
    else
      log "⚠️ PARTIAL body: $slug"
    fi
  done
  log "===== BODY TRANSLATION END ====="
fi

log "===== ALL DONE ====="
