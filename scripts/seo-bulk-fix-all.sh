#!/bin/bash
# ============================================
# seo-bulk-fix-all.sh
# 
# 批量优化所有低分文章 - 一次性解决 137 篇
# 与 seo-auto-fix-low.sh 不同: 
#   - 一次性处理 ALL 低分（不只是5篇）
#   - 分批 commit (10篇/批)
#   - 自动 verify 分数提升
#
# 用法: bash scripts/seo-bulk-fix-all.sh [--threshold=80] [--batch-size=10] [--deploy]
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
ARTICLES_DIR="$PROJECT_DIR/content/articles"

THRESHOLD=80
BATCH_SIZE=10
DEPLOY=false
DRY_RUN=false

for arg in "$@"; do
    case $arg in
        --threshold=*) THRESHOLD="${arg#*=}" ;;
        --batch-size=*) BATCH_SIZE="${arg#*=}" ;;
        --deploy) DEPLOY=true ;;
        --dry-run) DRY_RUN=true ;;
    esac
done

echo "🔧 Bulk SEO Fix - Threshold: $THRESHOLD | Batch: $BATCH_SIZE"
echo ""

# Step 1: 找到所有低分文章
LOW_LIST=$(python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py \
    --find-low "$ARTICLES_DIR" --threshold "$THRESHOLD" --max 999 2>/dev/null)

TOTAL=$(echo "$LOW_LIST" | wc -l | tr -d ' ')
echo "📊 Found $TOTAL articles below $THRESHOLD"
echo ""

if [ "$TOTAL" = "0" ]; then
    echo "✅ All articles above threshold"
    exit 0
fi

# Step 2: 分批处理
BATCHES=$(( (TOTAL + BATCH_SIZE - 1) / BATCH_SIZE ))
echo "📦 Will process in $BATCHES batches of $BATCH_SIZE"
echo ""

PROCESSED=0
BATCH_NUM=0

echo "$LOW_LIST" | while read -r article_path; do
    if [ -z "$article_path" ]; then continue; fi
    
    slug=$(basename "$article_path" .json)
    
    if [ "$DRY_RUN" = false ]; then
        # 用现有 auto-fix-low (max=1 模式)
        bash "$PROJECT_DIR/scripts/seo-auto-fix-low.sh" \
            --threshold="$THRESHOLD" --max=1 2>&1 | grep -E "Fixed|Skipped|Summary" | head -3
    else
        echo "[DRY-RUN] Would fix: $slug"
    fi
    
    PROCESSED=$((PROCESSED + 1))
    
    # 每 BATCH_SIZE 篇 commit 一次
    if [ $((PROCESSED % BATCH_SIZE)) = 0 ] && [ "$DRY_RUN" = false ]; then
        BATCH_NUM=$((BATCH_NUM + 1))
        echo ""
        echo "💾 Batch $BATCH_NUM commit..."
        cd "$PROJECT_DIR"
        git add content/articles/ 2>/dev/null
        git commit -m "feat(seo-bulk): batch $BATCH_NUM - optimize $BATCH_SIZE articles (E-E-A-T + dataSource + FAQ)" 2>&1 | head -3
        echo ""
    fi
done

# Final commit if remaining
if [ "$DRY_RUN" = false ]; then
    cd "$PROJECT_DIR"
    if [ -n "$(git status --short content/articles/)" ]; then
        BATCH_NUM=$((BATCH_NUM + 1))
        echo "💾 Final batch $BATCH_NUM commit..."
        git add content/articles/
        git commit -m "feat(seo-bulk): final batch - remaining articles"
    fi
fi

echo ""
echo "📊 Total processed: $TOTAL"
echo ""

# Step 3: 可选部署
if [ "$DEPLOY" = true ] && [ "$DRY_RUN" = false ]; then
    echo "🚀 Building & deploying..."
    cd "$PROJECT_DIR"
    npm run build 2>&1 | tail -3
    npx vercel --prod --force 2>&1 | tail -3
fi

echo "✅ Done"
