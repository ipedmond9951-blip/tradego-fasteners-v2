#!/bin/bash
# ============================================
# gsc-cache.sh
# 
# Cache GSC data to reduce API calls
# Saves daily snapshots to local JSON files
#
# 用法: bash gsc-cache.sh [fetch|query|stats]
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
CACHE_DIR="$PROJECT_DIR/data/gsc-cache"
mkdir -p "$CACHE_DIR"

ACTION="${1:-query}"
TODAY=$(date '+%Y-%m-%d')
CACHE_FILE="$CACHE_DIR/$TODAY.json"

case "$ACTION" in
    fetch)
        echo "🔄 Fetching fresh GSC data..."
        if [ -f "$PROJECT_DIR/scripts/gsc-fetch-data.js" ]; then
            node "$PROJECT_DIR/scripts/gsc-fetch-data.js" > "$CACHE_FILE" 2>&1
            echo "✅ Cached: $CACHE_FILE"
        else
            echo "⚠️  gsc-fetch-data.js not found, creating mock cache"
            cat > "$CACHE_FILE" << EOF
{
  "date": "$TODAY",
  "clicks": 0,
  "impressions": 0,
  "ctr": 0,
  "position": 0,
  "pages": [],
  "queries": [],
  "mock": true
}
EOF
        fi
        ;;
    
    query)
        echo "📊 GSC Cache Status"
        echo "─────────────────────────────────────────"
        if [ -d "$CACHE_DIR" ]; then
            COUNT=$(ls "$CACHE_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
            SIZE=$(du -sh "$CACHE_DIR" 2>/dev/null | cut -f1)
            NEWEST=$(ls -t "$CACHE_DIR"/*.json 2>/dev/null | head -1)
            echo "   Cached days: $COUNT"
            echo "   Total size: $SIZE"
            echo "   Newest: $(basename "$NEWEST" 2>/dev/null)"
            
            if [ -f "$CACHE_FILE" ]; then
                echo ""
                echo "📅 Today's Cache:"
                cat "$CACHE_FILE" | python3 -m json.tool 2>/dev/null | head -20
            fi
        else
            echo "   (no cache yet)"
        fi
        ;;
    
    stats)
        echo "📈 GSC Trend (last 30 days)"
        echo "─────────────────────────────────────────"
        if [ -d "$CACHE_DIR" ]; then
            python3 << 'PYEOF'
import json
from pathlib import Path
from datetime import datetime

cache_dir = Path("/Users/zhangming/workspace/tradego-fasteners-v2/data/gsc-cache")
files = sorted(cache_dir.glob("*.json"), reverse=True)[:30]

if not files:
    print("   No data")
else:
    total_clicks = 0
    total_impressions = 0
    for f in files:
        try:
            d = json.load(open(f))
            total_clicks += d.get("clicks", 0)
            total_impressions += d.get("impressions", 0)
        except:
            pass
    print(f"   Days cached: {len(files)}")
    print(f"   Total clicks: {total_clicks}")
    print(f"   Total impressions: {total_impressions}")
    print(f"   Avg CTR: {(total_clicks / total_impressions * 100) if total_impressions else 0:.2f}%")
PYEOF
        fi
        ;;
    
    *)
        echo "Usage: $0 [fetch|query|stats]"
        ;;
esac
