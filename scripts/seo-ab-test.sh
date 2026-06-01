#!/bin/bash
# ============================================
# seo-ab-test.sh
# 
# A/B test images for articles
# Generates 2 image variants + tracks CTR
#
# 用法: bash seo-ab-test.sh <slug>
#   生成 2 个变体 (variant-A.jpg, variant-B.jpg)
#   记录到 ab-tests/[slug].json
# ============================================

set -e

SLUG="${1:?Usage: $0 <article-slug>}"
PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
ARTICLE="$PROJECT_DIR/content/articles/$SLUG.json"
AB_DIR="$PROJECT_DIR/public/images/articles/ab-tests"
TRACKING_DIR="$PROJECT_DIR/data/ab-tests"
IMG_DIR="$PROJECT_DIR/public/images/articles"

mkdir -p "$AB_DIR" "$TRACKING_DIR"

if [ ! -f "$ARTICLE" ]; then
    echo "❌ Article not found: $SLUG"
    exit 1
fi

# Get article title
TITLE=$(python3 -c "
import json
with open('$ARTICLE') as f:
    a = json.load(f)
print(a.get('title', {}).get('en', ''))
")

if [ -z "$TITLE" ]; then
    echo "❌ No English title"
    exit 1
fi

# Generate 2 variants with different styles
echo "🎨 Generating 2 image variants for: $SLUG"
echo ""

# Variant A: Hero (people-focused)
PROMPT_A="Professional hero photo for B2B fastener industry: $TITLE, modern factory setting, sharp focus, professional lighting, 16:9 aspect ratio, commercial photography style"
echo "  Variant A: Hero / commercial"
bash ~/.openclaw/workspace/tools/minimax-image-gen.sh "$PROMPT_A" "$AB_DIR/$SLUG-A.jpg" 2>&1 | tail -2

# Variant B: Technical (close-up)
PROMPT_B="Detailed macro photography of industrial fasteners: $TITLE, technical close-up showing metal texture, 4K quality, white background, product photography style"
echo "  Variant B: Technical / close-up"
bash ~/.openclaw/workspace/tools/minimax-image-gen.sh "$PROMPT_B" "$AB_DIR/$SLUG-B.jpg" 2>&1 | tail -2

# Create tracking record
TRACK_FILE="$TRACKING_DIR/$SLUG.json"
cat > "$TRACK_FILE" << EOF
{
  "slug": "$SLUG",
  "title": "$TITLE",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "variants": {
    "A": {
      "path": "/images/articles/ab-tests/$SLUG-A.jpg",
      "style": "hero_commercial",
      "views": 0,
      "clicks": 0,
      "ctr": 0.0
    },
    "B": {
      "path": "/images/articles/ab-tests/$SLUG-B.jpg",
      "style": "technical_macro",
      "views": 0,
      "clicks": 0,
      "ctr": 0.0
    }
  },
  "winner": null,
  "status": "active"
}
EOF

echo ""
echo "✅ Generated 2 variants:"
ls -la "$AB_DIR/$SLUG-A.jpg" "$AB_DIR/$SLUG-B.jpg" 2>/dev/null | awk '{print "   ", $5, "bytes  ", $9}'
echo ""
echo "📊 Tracking: $TRACK_FILE"
echo ""
echo "🔍 To analyze (after 7 days):"
echo "   python3 scripts/seo-ab-test-analyze.py $SLUG"
