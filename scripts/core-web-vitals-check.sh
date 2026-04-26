#!/bin/bash
# Core Web Vitals Checker for TradeGo Fasteners
# Usage: bash scripts/core-web-vitals-check.sh

cd "$(dirname "$0")/.."

REPORT_FILE="/tmp/lighthouse-report-$(date +%Y-%m-%d).json"
HTML_REPORT="logs/core-web-vitals-$(date +%Y-%m-%d).html"

echo "=== TradeGo Core Web Vitals Check $(date) ==="
echo ""

# Run Lighthouse
echo "Running Lighthouse performance audit..."
cd /tmp
npx --yes lighthouse https://tradego-fasteners.com \
  --only-categories=performance \
  --output=json \
  --output-path="$REPORT_FILE" \
  --quiet 2>&1 | grep -v "^$"

if [ ! -f "$REPORT_FILE" ]; then
  echo "❌ Lighthouse failed to generate report"
  exit 1
fi

# Extract key metrics
echo ""
echo "=== Performance Metrics ==="

PERFORMANCE=$(cat "$REPORT_FILE" | jq '.categories.performance.score * 100 | floor')
LCP=$(cat "$REPORT_FILE" | jq -r '.audits."largest-contentful-paint".displayValue')
CLS=$(cat "$REPORT_FILE" | jq -r '.audits."cumulative-layout-shift".displayValue')
FID=$(cat "$REPORT_FILE" | jq -r '.audits."max-potential-fid".displayValue // "N/A"')

echo "Performance Score: $PERFORMANCE/100"
echo "LCP (Largest Contentful Paint): $LCP (target: <2.5s)"
echo "CLS (Cumulative Layout Shift): $CLS (target: <0.1)"
echo "FID (First Input Delay): $FID (target: <100ms)"

# Check for issues
echo ""
echo "=== Key Issues ==="

# Unused JavaScript
UNUSED_JS=$(cat "$REPORT_FILE" | jq '.audits."unused-javascript".details.overallSavingsBytes // 0')
if [ "$UNUSED_JS" -gt 0 ]; then
  echo "❌ Unused JavaScript: $(numfmt --to=iec "$UNUSED_JS") bytes could be saved"
fi

# Image issues
IMAGE_SAVINGS=$(cat "$REPORT_FILE" | jq '.audits."image-delivery-insight".details.overallSavingsBytes // 0')
if [ "$IMAGE_SAVINGS" -gt 0 ]; then
  echo "❌ Image optimization: $(numfmt --to=iec "$IMAGE_SAVINGS") bytes could be saved"
fi

# Render blocking
RENDER_BLOCK=$(cat "$REPORT_FILE" | jq '.audits."render-blocking-resources".details.overallSavingsMs // 0')
if [ "$RENDER_BLOCK" -gt 0 ]; then
  echo "❌ Render blocking resources: ${RENDER_BLOCK}ms could be saved"
fi

# Save to logs
mkdir -p logs
cp "$REPORT_FILE" "logs/lighthouse-report-$(date +%Y-%m-%d).json"

# Generate HTML report
cat > "$HTML_REPORT" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Core Web Vitals Report - TradeGo Fasteners</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .metric { display: inline-block; margin: 10px; padding: 15px; border-radius: 8px; }
    .good { background: #d4edda; color: #155724; }
    .needs-improvement { background: #fff3cd; color: #856404; }
    .poor { background: #f8d7da; color: #721c24; }
    .issue { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #dc3545; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>🏭 TradeGo Fasteners - Core Web Vitals Report</h1>
  <p>Generated: TIMESTAMP</p>
  
  <h2>📊 Key Metrics</h2>
  <div id="metrics"></div>
  
  <h2>⚠️ Issues & Recommendations</h2>
  <div id="issues"></div>
  
  <h2>📋 Detailed Audit Data</h2>
  <table>
    <tr><th>Audit</th><th>Score</th><th>Details</th></tr>
    INSERT_AUDITS
  </table>
</body>
</html>
EOF

# Replace placeholders
sed -i '' "s/TIMESTAMP/$(date)/" "$HTML_REPORT"

echo ""
echo "Reports saved to:"
echo "  - JSON: $REPORT_FILE"
echo "  - HTML: $HTML_REPORT"

# Return exit code based on performance
if [ "$PERFORMANCE" -lt 50 ]; then
  exit 1
fi
