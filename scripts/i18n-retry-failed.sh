#!/bin/bash
# i18n-retry-failed.sh - 重试 minimax 5x fail 翻译, 用 ai-router 兜底
# 2026-07-19 21:18 创建
#
# 用法: bash scripts/i18n-retry-failed.sh [lang1] [lang2] ...
# 默认重试 hi/ar/ja/ru (已知 minimax 长 prompt 失败率高的语言)

set -e

FAIL_FILE="$HOME/workspace/tradego-fasteners-v2/logs/i18n-translate/body-minimax.failed.jsonl"
ARTICLES_DIR="$HOME/workspace/tradego-fasteners-v2/content/articles"
TMP_DIR="$HOME/workspace/tradego-fasteners-v2/logs/i18n-translate/tmp"
LOG_DIR="$HOME/workspace/tradego-fasteners-v2/logs/i18n-translate"
SCRIPT_DIR="$HOME/workspace/tradego-fasteners-v2/scripts"

LANGS=("${@:-hi ar ja ru}")

# Load env
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a; source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"; set +a
fi

# Check Chrome
if ! curl -sf http://localhost:18800/json/version > /dev/null 2>&1; then
  echo "[fatal] Chrome 18800 not running" >&2
  exit 2
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# Build _build_prompt.py on the fly (simple version)
cat > "$TMP_DIR/_retry_prompt.py" <<'PYEOF'
import json, os, sys
slug = os.environ['SLUG']
lang = os.environ['LANG']
articles_dir = os.environ['ARTICLES_DIR']
with open(f"{articles_dir}/{slug}.json") as f:
    a = json.load(f)
title = a['title']['en']
sections = a.get('sections', [])

parts = [f'Translate ALL section bodies to {lang}.']
parts.append(f'Article title (EN): {title}')
parts.append('')
parts.append('Output STRICT JSON: {"translations": {"<lang>": {"title": "...", "sections": [{"heading": "...", "body": "..."}], "faqs": [{"q": "...", "a": "..."}], "ctaText": "..."}}}')
parts.append('RULES:')
parts.append(f'1. Output ONLY in {lang} (NO Chinese, NO other languages)')
parts.append('2. Preserve technical terms (HS code, ISO, EN, ASTM, etc.)')
parts.append('3. Preserve HTML <a href="..."> tags as-is')
parts.append('4. In JSON string values, escape ALL double quotes with backslash')
parts.append('5. Output ONLY the JSON object, no markdown fence, no commentary')
parts.append('')
parts.append('SECTION BODIES:')
for i, s in enumerate(sections):
    body_en = s.get('body', {}).get('en', '')
    if not body_en:
        continue
    parts.append(f'--- section {i} ---')
    parts.append(f'heading(en): {s["heading"]["en"]}')
    parts.append(f'body(en):')
    parts.append(body_en)
faqs = a.get('faqs', [])
if faqs:
    parts.append('')
    parts.append('FAQs:')
    for i, f in enumerate(faqs):
        parts.append(f'--- faq {i} ---')
        parts.append(f'q(en): {f["q"]["en"]}')
        parts.append(f'a(en): {f["a"]["en"]}')
cta = a.get('cta', {}).get('text', {}).get('en', '')
if cta:
    parts.append('')
    parts.append(f'CTA(en): {cta}')
print('\n'.join(parts))
PYEOF

log "===== i18n-retry-failed START (langs: ${LANGS[@]}) ====="

# Read fail file
if [ ! -f "$FAIL_FILE" ]; then
  log "no fail file, nothing to retry"
  exit 0
fi

# Parse fail entries
RETRY_ENTRIES=$(python3 -c "
import json
LANGS = set('${LANGS[@]}'.split())
with open('$FAIL_FILE') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('langs') in LANGS:
                print(f'{d[\"slug\"]}|{d[\"langs\"]}')
        except: pass
" | sort -u)

if [ -z "$RETRY_ENTRIES" ]; then
  log "no retry entries for these langs"
  exit 0
fi

log "retry entries:"
echo "$RETRY_ENTRIES" | head -10

# Process each
echo "$RETRY_ENTRIES" | while IFS='|' read -r SLUG LANG; do
  ARTICLE_FILE="$ARTICLES_DIR/${SLUG}.json"
  if [ ! -f "$ARTICLE_FILE" ]; then
    log "❌ article not found: $SLUG"
    continue
  fi

  log "---- retry $SLUG / $LANG ----"
  PROMPT_FILE="$TMP_DIR/${SLUG}_body_${LANG}_retry.txt"
  RESULT_FILE="$TMP_DIR/${SLUG}_body_${LANG}_retry.json"
  RAW_FILE="$TMP_DIR/${SLUG}_body_${LANG}_retry.raw.txt"

  # Build prompt
  SLUG="$SLUG" LANG="$LANG" ARTICLES_DIR="$ARTICLES_DIR" python3 "$TMP_DIR/_retry_prompt.py" > "$PROMPT_FILE"

  # Call i18n-single-ai-router.sh (grok/gemini/doubao fallback)
  if bash "$SCRIPT_DIR/i18n-single-ai-router.sh" "$SLUG" "$LANG" > /tmp/retry-${SLUG}-${LANG}.log 2>&1; then
    log "  ✅ ai-router success for $SLUG / $LANG"
    # Remove from fail list
    grep -v "\"slug\":\"$SLUG\".*\"langs\":\"$LANG\"" "$FAIL_FILE" > "$FAIL_FILE.tmp" && mv "$FAIL_FILE.tmp" "$FAIL_FILE" 2>/dev/null || true
  else
    log "  ❌ ai-router still fail for $SLUG / $LANG"
  fi
  sleep 3
done

log "===== i18n-retry-failed DONE ====="
