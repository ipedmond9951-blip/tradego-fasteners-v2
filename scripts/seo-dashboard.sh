#!/bin/bash
# ============================================
# seo-dashboard.sh
# 
# Quick dashboard for SEO health
# 用法: bash scripts/seo-dashboard.sh
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║          🎯 SEO Universal Dashboard             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

echo "📊 Articles Score"
echo "─────────────────────────────────────────"
python3 "$SKILL_DIR/scripts/validate-article.py" --scan "$PROJECT_DIR/content/articles" 2>&1 | grep -E "Total:|Average:|P0 errors|P1 warnings|P2 warnings|High score|Low score" | sed 's/^/   /'
echo ""

echo "🚀 Today's Deployments"
echo "─────────────────────────────────────────"
cd "$PROJECT_DIR" && git log --since="$(date '+%Y-%m-%d') 00:00" --pretty=format:"   %h %s" 2>/dev/null | head -5 || echo "   (no commits today)"
echo ""

echo "📝 Top 5 Low Score Articles"
echo "─────────────────────────────────────────"
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
scores.sort()
for s, slug in scores[:5]:
    print(f'   {s:3d}/100  {slug}')
"
echo ""

echo "📁 Language Coverage (file size proxy)"
echo "─────────────────────────────────────────"
python3 -c "
from pathlib import Path
sizes = [(f.stat().st_size, f.stem) for f in Path('$PROJECT_DIR/content/articles').glob('*.json')]
buckets = [(0,5000,'Tiny'),(5000,15000,'Small'),(15000,50000,'Medium'),(50000,200000,'Large'),(200000,9999999,'XLarge')]
for low, high, label in buckets:
    n = sum(1 for s,_ in sizes if low <= s < high)
    print(f'   {label:8s} {n:3d} {\"█\" * (n//5)}')"
echo ""

echo "⏰ Cron Tasks (SEO)"
echo "─────────────────────────────────────────"
openclaw cron list 2>/dev/null | grep -i seo | head -10 | sed 's/^/   /' || echo "   (openclaw not available)"
echo ""

echo "💡 Recent Learnings"
echo "─────────────────────────────────────────"
ls -t "$SKILL_DIR/evolution/"*.md 2>/dev/null | head -3 | while read f; do
    title=$(head -3 "$f" | grep "^# " | head -1 | sed 's/^# //')
    echo "   📄 $title"
done
echo ""
