#!/bin/bash
# Delete DELETE-recommended articles (second batch)
# Date: 2026-04-29
# Following user's directive: "按你的建议行动"

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
BACKUP_DIR="$PROJECT_DIR/content/articles/backup/20260429-085603"  # Same backup as first batch
ARTICLES_DIR="$PROJECT_DIR/content/articles"

# DELETE-recommended articles (19 articles)
DELETE_ARTICLES=(
    "anchor-bolts-suppliers-africa"
    "bolt-tightening-torque-guide"
    "bolt-types-applications-guide"
    "buy-construction-fasteners-wholesale-china"
    "drywall-screws-bulk-price-africa-procurement"
    "drywall-screws-complete-guide"
    "fastener-common-problems-solutions"
    "fastener-quality-inspection-guide"
    "fastener-standards-din-iso-astm-comparison"
    "kenya-fastener-market-guide"
    "m10-galvanized-bolt-fob-china-price"
    "mining-fasteners-africa"
    "nigeria-fastener-market-guide"
    "self-drilling-tek-screws-price-list"
    "solar-panel-mounting-fasteners-africa"
    "south-africa-fastener-market-guide"
    "stainless-steel-fasteners-africa"
    "timber-construction-fasteners-africa"
    "washer-types-applications-guide"
)

echo "🔴 Deleting 19 DELETE-recommended articles..."
echo ""

DELETED_COUNT=0
NOT_FOUND_COUNT=0

for slug in "${DELETE_ARTICLES[@]}"; do
    FILE="$ARTICLES_DIR/${slug}.json"
    if [ -f "$FILE" ]; then
        cp "$FILE" "$BACKUP_DIR/"
        rm "$FILE"
        echo "✅ Deleted: $slug"
        ((DELETED_COUNT++))
    else
        echo "⚠️ Not found: $slug"
        ((NOT_FOUND_COUNT++))
    fi
done

echo ""
echo "=========================================="
echo "📊 Summary"
echo "=========================================="
echo "✅ Deleted: $DELETED_COUNT articles"
if [ $NOT_FOUND_COUNT -gt 0 ]; then
    echo "⚠️ Not found: $NOT_FOUND_COUNT articles"
fi

REMAINING=$(ls $ARTICLES_DIR/*.json 2>/dev/null | wc -l | xargs)
echo "📝 Remaining articles: $REMAINING"

cd "$PROJECT_DIR" || exit 1
echo ""
echo "🔄 Committing changes..."
git add content/articles/
git commit -m "🔴 Content Audit: Remove 19 DELETE-recommended articles (batch 2, 2026-04-29)

Deleted articles (low E-E-A-T, template patterns, thin content):
- anchor-bolts-suppliers-africa
- bolt-tightening-torque-guide
- bolt-types-applications-guide
- buy-construction-fasteners-wholesale-china
- drywall-screws-bulk-price-africa-procurement
- drywall-screws-complete-guide
- fastener-common-problems-solutions
- fastener-quality-inspection-guide
- fastener-standards-din-iso-astm-comparison
- kenya-fastener-market-guide
- m10-galvanized-bolt-fob-china-price
- mining-fasteners-africa
- nigeria-fastener-market-guide
- self-drilling-tek-screws-price-list
- solar-panel-mounting-fasteners-africa
- south-africa-fastener-market-guide
- stainless-steel-fasteners-africa
- timber-construction-fasteners-africa
- washer-types-applications-guide

Total removed: 38 articles (19 batch 1 + 19 batch 2)
Remaining: 85 articles

Reason: Low E-E-A-T, template slug patterns, insufficient content depth" 2>&1

echo ""
echo "✅ Done!"
