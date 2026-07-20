#!/bin/bash
# check-images-tracked.sh - 检查 article.json 引用 image 是否在 git tracked
# 7/20 bug: egypt-cairo image 生成后没 add, Vercel 部署缺图 404
# 用法:
#   1. pre-push hook (.git/hooks/pre-push): git push 前自动跑
#   2. 手动: bash scripts/check-images-tracked.sh
#
# 退出码: 0=全 OK, 1=有 untracked image 引用, 2=严重错误

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "🔍 Checking article.json image references vs git tracked files..."

# 收集所有 article.json 的 image 字段
UNTRACKED=()
MISSING_FILE=()
TOTAL=0
HAS_ISSUE=0

for ARTICLE_FILE in content/articles/*.json; do
    [ -f "$ARTICLE_FILE" ] || continue
    TOTAL=$((TOTAL+1))
    SLUG=$(basename "$ARTICLE_FILE" .json)

    # 提取 image 字段 (python 防 json 嵌套)
    IMG_PATH=$(python3 -c "
import json, sys
try:
    with open('$ARTICLE_FILE') as f:
        d = json.load(f)
    img = d.get('image', '')
    if img and img.startswith('/images/'):
        # 提取 filename
        print(img.lstrip('/'))
    else:
        print('')
except Exception as e:
    print('')
" 2>/dev/null)

    if [ -z "$IMG_PATH" ]; then
        # 没 image 字段 (老文章无图, skip)
        continue
    fi

    IMG_FULL="$PROJECT_DIR/public/$IMG_PATH"
    if [ ! -f "$IMG_FULL" ]; then
        MISSING_FILE+=("$SLUG: $IMG_PATH (file not exist on disk)")
        HAS_ISSUE=1
        continue
    fi

    # 检查是否 git tracked
    if ! git ls-files --error-unmatch "public/$IMG_PATH" >/dev/null 2>&1; then
        UNTRACKED+=("$SLUG: public/$IMG_PATH")
        HAS_ISSUE=1
    fi
done

if [ $HAS_ISSUE -eq 0 ]; then
    echo "✅ All $TOTAL article images tracked and on disk"
    exit 0
fi

echo ""
echo "❌ Found image issues:"
if [ ${#UNTRACKED[@]} -gt 0 ]; then
    echo ""
    echo "  🚨 UNTRACKED (article 引用但 git 没 add, Vercel 部署会 404):"
    for u in "${UNTRACKED[@]}"; do
        echo "    - $u"
    done
    echo ""
    echo "  💡 Fix: git add public/images/articles/*.jpg && git commit"
fi
if [ ${#MISSING_FILE[@]} -gt 0 ]; then
    echo ""
    echo "  ⚠️  FILE MISSING (article 引用但磁盘没文件, Vercel 也会 404):"
    for m in "${MISSING_FILE[@]}"; do
        echo "    - $m"
    done
fi

exit 1
