#!/bin/bash
# check-article-schema.sh - 检查 article.json 必填字段 schema 完整性
# 7/20 bug: 23 老文章缺 imageAlt field, Vercel build prerender 报 'undefined.length'
# 用法:
#   1. pre-commit hook: 阻止 schema 不全的 article commit
#   2. 手动: bash scripts/check-article-schema.sh
#
# 必填 schema 字段:
#   - slug, image, date, category, readTime (top-level)
#   - title, description, imageAlt: dict per lang (10 langs: en/zh/ja/de/ru/pt/es/ar/fr/hi)
#
# 退出码: 0=全 OK, 1=有 schema 问题, 2=严重错误

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "🔍 Checking article.json schema completeness (227 articles)..."

LANGS=("en" "zh" "ja" "de" "ru" "pt" "es" "ar" "fr" "hi")
TOTAL=0
HAS_ISSUE=0
PROBLEMS=()

for ARTICLE_FILE in content/articles/*.json; do
    [ -f "$ARTICLE_FILE" ] || continue
    TOTAL=$((TOTAL+1))
    SLUG=$(basename "$ARTICLE_FILE" .json)

    # 用 python 扫 schema 完整性
    RESULT=$(python3 - "$ARTICLE_FILE" << 'PYEOF'
import json, sys
fp = sys.argv[1]
try:
    with open(fp) as f:
        d = json.load(f)
except Exception as e:
    print(f"JSON_PARSE_ERR: {e}")
    sys.exit(0)

problems = []
# Top-level 必填
for k in ['slug', 'image', 'date', 'category', 'readTime']:
    if not d.get(k):
        problems.append(f"missing top-level '{k}'")

# Dict per lang 必填
for k in ['title', 'description', 'imageAlt']:
    v = d.get(k)
    if not isinstance(v, dict):
        problems.append(f"'{k}' not dict (type={type(v).__name__})")

# Check at least en has all 3 dict per lang fields
for k in ['title', 'description', 'imageAlt']:
    v = d.get(k)
    if isinstance(v, dict) and not v.get('en'):
        problems.append(f"'{k}' missing 'en' lang")

if problems:
    print(' | '.join(problems))
else:
    print('OK')
PYEOF
)

    if [ "$RESULT" != "OK" ]; then
        PROBLEMS+=("$SLUG: $RESULT")
        HAS_ISSUE=1
    fi
done

if [ $HAS_ISSUE -eq 0 ]; then
    echo "✅ All $TOTAL articles schema valid"
    exit 0
fi

echo ""
echo "❌ Found schema issues in ${#PROBLEMS[@]} articles:"
for p in "${PROBLEMS[@]}"; do
    echo "  - $p"
done
echo ""
echo "💡 Fix: imageAlt/description/title 必须是 dict per lang (10 langs), 用 title[lang] 兜底"
echo "   python3 -c \"import json; d=json.load(open('content/articles/SLUG.json')); d['imageAlt']={L: d.get('title',{}).get(L,'') for L in ['en','zh','ja','de','ru','pt','es','ar','fr','hi']}; json.dump(d, open('content/articles/SLUG.json','w'), ensure_ascii=False, indent=2)\""
exit 1
