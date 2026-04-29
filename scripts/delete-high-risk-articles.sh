#!/bin/bash
# Delete high-risk AI-generated articles
# Date: 2026-04-29
# Backup location: content/articles/backup/

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
BACKUP_DIR="$PROJECT_DIR/content/articles/backup/$(date '+%Y%m%d-%H%M%S')"
ARTICLES_DIR="$PROJECT_DIR/content/articles"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# High-risk articles to delete (19 articles)
HIGH_RISK_ARTICLES=(
    "automotive-fasteners-guide"
    "bulk-fastener-ordering-strategies"
    "china-hex-nuts-manufacturer"
    "concrete-anchors-selection-guide"
    "fastener-applications-construction-solar-telecom"
    "fastener-coating-systems-guide"
    "fastener-cost-analysis-template"
    "fastener-material-selection-guide"
    "fastener-negotiation-supplier-china"
    "fastener-packaging-shipping-guide"
    "fastener-storage-handling-guide"
    "ghana-fastener-market-guide"
    "marine-fasteners-guide"
    "payment-terms-international-fastener-trade"
    "rivets-blind-rivets-guide"
    "screws-different-materials-guide"
    "structural-steel-connections-guide"
    "threaded-rod-applications-guide"
    "timber-fasteners-guide"
)

echo "🔴 Backing up and deleting 19 high-risk articles..."
echo "📁 Backup location: $BACKUP_DIR"
echo ""

DELETED_COUNT=0
NOT_FOUND_COUNT=0

for slug in "${HIGH_RISK_ARTICLES[@]}"; do
    FILE="$ARTICLES_DIR/${slug}.json"
    if [ -f "$FILE" ]; then
        # Backup first
        cp "$FILE" "$BACKUP_DIR/"
        # Delete
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
    echo "⚠️ Not found (already deleted?): $NOT_FOUND_COUNT articles"
fi
echo "📁 Backup: $BACKUP_DIR"
echo ""

# Count remaining articles
REMAINING=$(ls $ARTICLES_DIR/*.json 2>/dev/null | wc -l | xargs)
echo "📝 Remaining articles: $REMAINING"

# Commit
cd "$PROJECT_DIR" || exit 1
echo ""
echo "🔄 Committing changes..."
git add content/articles/
git commit -m "🔴 Content Audit: Remove 19 high-risk AI-generated articles (2026-04-29)

Deleted articles (high-risk, low E-E-A-T, template patterns):
- automotive-fasteners-guide
- bulk-fastener-ordering-strategies
- china-hex-nuts-manufacturer
- concrete-anchors-selection-guide
- fastener-applications-construction-solar-telecom
- fastener-coating-systems-guide
- fastener-cost-analysis-template
- fastener-material-selection-guide
- fastener-negotiation-supplier-china
- fastener-packaging-shipping-guide
- fastener-storage-handling-guide
- ghana-fastener-market-guide
- marine-fasteners-guide
- payment-terms-international-fastener-trade
- rivets-blind-rivets-guide
- screws-different-materials-guide
- structural-steel-connections-guide
- threaded-rod-applications-guide
- timber-fasteners-guide

Reason: Zero E-E-A-T signals, template-based slug patterns, thin content (<300 words)
Risk: Google automated content detection" 2>&1

echo ""
echo "=========================================="
echo "✅ Done! Git commit created."
echo "=========================================="
