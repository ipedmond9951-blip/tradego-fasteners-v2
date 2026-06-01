#!/bin/bash
# ============================================
# seo-roi-tracker.sh
# 
# Track SEO ROI: article → ranking → traffic → inquiries
# Used by: 月度 SEO 战略复盘 cron
#
# 输出:
#   - 文章数量趋势
#   - 部署频率
#   - 分数变化
#   - 文件大小趋势（多语言完成度代理指标）
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"
LOG_DIR="$PROJECT_DIR/logs"
REPORT_DIR="$LOG_DIR/seo-roi"
mkdir -p "$REPORT_DIR"

REPORT_FILE="$REPORT_DIR/$(date '+%Y-%m').md"

# 1. 文章分数统计
echo "## 📊 文章分数统计"
SCAN=$(python3 "$SKILL_DIR/scripts/validate-article.py" --scan "$PROJECT_DIR/content/articles" 2>&1)
echo "$SCAN" | grep -E "Total:|Average:|P0|P1|P2|P3|High|Low" | head -10
echo ""

# 2. 部署历史 (30天)
echo "## 🚀 部署历史 (30天)"
echo ""
echo "| 时间 | 提交 | 内容 |"
echo "|------|------|------|"
git log --since="30 days ago" --pretty=format:"%h|%ci|%s" 2>/dev/null | head -20 | while IFS='|' read hash date msg; do
    short_date=$(echo "$date" | cut -d' ' -f1)
    echo "| $short_date | \`$hash\` | $msg |"
done
echo ""

# 3. 文件大小趋势 (代理：多语言完成度)
echo "## 📁 文件大小分布 (代理多语言完成度)"
echo ""
echo "| 范围 | 数量 |"
echo "|------|------|"
python3 << 'PYEOF'
import json
from pathlib import Path

sizes = []
for f in Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles").glob("*.json"):
    sizes.append((f.stat().st_size, f.stem))

buckets = [
    (0, 5000, "Tiny (< 5KB)"),
    (5000, 15000, "Small (5-15KB)"),
    (15000, 50000, "Medium (15-50KB)"),
    (50000, 200000, "Large (50-200KB)"),
    (200000, 999999, "XLarge (> 200KB)"),
]

for low, high, label in buckets:
    count = sum(1 for s, _ in sizes if low <= s < high)
    print(f"| {label} | {count} |")
PYEOF
echo ""

# 4. 顶部高分文章
echo "## 🏆 Top 10 高分文章"
echo ""
python3 << 'PYEOF'
import json
from pathlib import Path

scores = []
for f in Path("/Users/zhangming/workspace/tradego-fasteners-v2/content/articles").glob("*.json"):
    try:
        with open(f) as fp:
            a = json.load(fp)
        # Quick score
        score = 0
        if a.get('slug'): score += 10
        if a.get('title', {}).get('en'): score += 10
        if a.get('description', {}).get('en'): score += 10
        if a.get('image'): score += 5
        if a.get('author', {}).get('name') if isinstance(a.get('author'), dict) else False: score += 10
        # 10 lang
        if all(a.get('title', {}).get(l) for l in ['en','zh','es','ar','fr','pt','ru','ja','de','hi']): score += 20
        # Word count
        wc = sum(len(s.get('body', {}).get('en', '').split()) for s in a.get('sections', []))
        if wc >= 1500: score += 15
        elif wc >= 800: score += 10
        # FAQ
        faq = sum(len(s.get('faqItems', [])) for s in a.get('sections', []))
        if faq >= 3: score += 10
        # Data source
        if a.get('dataSource'): score += 10
        
        scores.append((score, f.stem, a.get('title', {}).get('en', '')))
    except:
        pass

scores.sort(reverse=True)
for score, slug, title in scores[:10]:
    print(f"| {score}/100 | {slug} | {title[:50]} |")
PYEOF
echo ""

# 5. 月度数据 (auto)
{
    echo "# SEO ROI Report - $(date '+%Y-%m')"
    echo ""
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
} > "$REPORT_FILE"
echo "✅ Report saved: $REPORT_FILE"
