#!/bin/bash
# Keyword Ranking Checker for TradeGo Fasteners
# Usage: bash scripts/check-rankings.sh

cd "$(dirname "$0")/.."

LOG_FILE="logs/keyword-rankings.csv"
KEYWORDS=(
  "TradeGo fasteners Zimbabwe"
  "fastener supplier Africa China"
  "drywall screws Zimbabwe"
  "IBR roofing nails South Africa"
  "hex bolts Nigeria supplier"
  "anchor bolts Kenya construction"
  "self-drilling screws Africa"
  "bulk fasteners China export"
)

echo "=== TradeGo Keyword Ranking Check $(date) ==="
echo ""

# Check if log file exists, if not create with headers
if [ ! -f "$LOG_FILE" ]; then
  echo "keyword,date,ranking,search_volume,notes" > "$LOG_FILE"
fi

TODAY=$(date +%Y-%m-%d)

for keyword in "${KEYWORDS[@]}"; do
  echo "Checking: $keyword"
  
  # Use curl to search via Google (simplified check)
  # Note: This is a basic check, real ranking tracking requires Google Search Console API
  result=$(curl -s "https://www.google.com/search?q=$(echo "$keyword" | tr ' ' '+')" \
    -H "User-Agent: Mozilla/5.0" \
    --max-time 10 2>/dev/null | grep -o "tradego-fasteners.com" | head -1)
  
  if [ -n "$result" ]; then
    echo "  ✅ Found in results"
    ranking="found"
  else
    echo "  ❌ Not found in top results"
    ranking="not_found"
  fi
  
  # Append to CSV
  echo "\"$keyword\",$TODAY,$ranking,,\"\"" >> "$LOG_FILE"
  
  sleep 2  # Rate limiting
done

echo ""
echo "Results saved to $LOG_FILE"
echo "Today's rankings:"
grep "$TODAY" "$LOG_FILE"
