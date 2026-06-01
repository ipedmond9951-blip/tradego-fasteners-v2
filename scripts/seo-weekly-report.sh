#!/bin/bash
# ============================================
# seo-weekly-report.sh
# 
# Generate weekly SEO summary
# Runs on Monday morning, sent via Telegram
#
# 用法: bash seo-weekly-report.sh [--send]
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"
WEEK=$(date '+%Y-W%V')
REPORT="$PROJECT_DIR/logs/seo-weekly-$WEEK.md"

SEND=false
for arg in "$@"; do
    case $arg in
        --send) SEND=true ;;
    esac
done

{
echo "# 📊 SEO Weekly Report - $WEEK"
echo ""
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

echo "## Articles"
SCAN=$(python3 "$SKILL_DIR/scripts/validate-article.py" --scan "$PROJECT_DIR/content/articles" 2>&1)
echo "$SCAN" | grep -E "Total:|Average:|P0 errors|P1 warnings|P2 warnings|High score|Low score" | sed 's/^/   /'
echo ""

echo "## This Week's Commits"
cd "$PROJECT_DIR" && git log --since="7 days ago" --pretty=format:"   - %h %s" 2>/dev/null | head -10
echo ""
echo ""

echo "## Top 5 High Score"
python3 -c "
import json
from pathlib import Path
scores = []
for f in Path('$PROJECT_DIR/content/articles').glob('*.json'):
    try:
        a = json.load(open(f))
        s = 0
        if a.get('slug'): s += 10
        if a.get('title', {}).get('en'): s += 10
        if a.get('description', {}).get('en'): s += 10
        if a.get('image'): s += 5
        if isinstance(a.get('author'), dict) and a['author'].get('name'): s += 10
        if all(a.get('title', {}).get(l) for l in ['en','zh','es','ar','fr','pt','ru','ja','de','hi']): s += 20
        wc = sum(len(s.get('body', {}).get('en', '').split()) for s in a.get('sections', []))
        if wc >= 1500: s += 15
        elif wc >= 800: s += 10
        faq = sum(len(s.get('faqItems', [])) for s in a.get('sections', []))
        if faq >= 3: s += 10
        if a.get('dataSource'): s += 10
        scores.append((s, f.stem))
    except: pass
scores.sort(reverse=True)
for s, slug in scores[:5]:
    print(f'   {s:3d}/100  {slug}')
"
echo ""

echo "## A/B Test Status"
AB_DIR="$PROJECT_DIR/data/ab-tests"
if [ -d "$AB_DIR" ]; then
    COUNT=$(ls "$AB_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
    echo "   Active tests: $COUNT"
else
    echo "   (no tests yet)"
fi
echo ""

echo "## Cron Status"
openclaw cron list 2>/dev/null | grep -E "SEO" | head -3 | sed 's/^/   /'
echo ""

} > "$REPORT"

cat "$REPORT"

if [ "$SEND" = true ]; then
    echo ""
    echo "📤 Sending to Telegram..."
    bash ~/workspace/tradego-fasteners-v2/scripts/telegram-notify.sh \
        --severity=info \
        --report="$REPORT" 2>&1 | tail -3
fi
