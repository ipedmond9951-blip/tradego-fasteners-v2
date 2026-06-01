#!/bin/bash
# ============================================
# competitor-monitor.sh
# 
# Monitor competitor websites for new content
# Detects new articles/pages via sitemap diff
#
# 用法: bash competitor-monitor.sh [--notify]
# ============================================

set -e

CACHE_DIR="$HOME/.cache/competitor-monitor"
mkdir -p "$CACHE_DIR"

# Define competitors
COMPETITORS=(
    "zimbiz.co.zw|https://zimbiz.co.zw/sitemap.xml"
    "tradeford.com|https://www.tradeford.com/sitemap.xml"
    "africabusinesspages.com|https://www.africabusinesspages.com/sitemap.xml"
)

NOTIFY=false
for arg in "$@"; do
    case $arg in
        --notify) NOTIFY=true ;;
    esac
done

NEW_CONTENT=()

for comp in "${COMPETITORS[@]}"; do
    name="${comp%%|*}"
    url="${comp##*|}"
    
    CACHE_FILE="$CACHE_DIR/${name}.urls"
    NEW_FILE="$CACHE_DIR/${name}.new"
    
    echo "🔍 Checking: $name"
    
    # Fetch sitemap
    if ! curl -sL --max-time 30 "$url" -o "$NEW_FILE" 2>/dev/null; then
        echo "   ❌ Failed to fetch"
        continue
    fi
    
    if [ ! -s "$NEW_FILE" ]; then
        echo "   ⚠️  Empty sitemap"
        continue
    fi
    
    # Extract URLs
    NEW_URLS=$(grep -oE "<loc>[^<]+</loc>" "$NEW_FILE" | sed 's/<loc>//;s/<\/loc>//' | sort -u)
    
    if [ -z "$NEW_URLS" ]; then
        echo "   ⚠️  No URLs found"
        continue
    fi
    
    # Compare with cache
    if [ -f "$CACHE_FILE" ]; then
        DIFF=$(comm -23 <(echo "$NEW_URLS") <(sort "$CACHE_FILE"))
        if [ -n "$DIFF" ]; then
            COUNT=$(echo "$DIFF" | wc -l | tr -d ' ')
            echo "   🆕 $COUNT new URLs"
            
            # Save for notification
            echo "$DIFF" > "$CACHE_DIR/${name}.diff"
            NEW_CONTENT+=("$name: $COUNT new pages")
        else
            echo "   ✅ No new content"
        fi
    else
        COUNT=$(echo "$NEW_URLS" | wc -l | tr -d ' ')
        echo "   📊 First run: $COUNT URLs (caching)"
    fi
    
    # Update cache
    echo "$NEW_URLS" > "$CACHE_FILE"
done

echo ""
if [ ${#NEW_CONTENT[@]} -gt 0 ] && [ "$NOTIFY" = true ]; then
    MSG="🚨 竞品新内容告警

"
    for c in "${NEW_CONTENT[@]}"; do
        MSG="$MSG- $c
"
    done
    MSG="$MSG

详情: $CACHE_DIR/*.diff"
    
    bash ~/workspace/tradego-fasteners-v2/scripts/telegram-notify.sh \
        --severity=P2 \
        "$MSG" 2>&1 | tail -3
fi
