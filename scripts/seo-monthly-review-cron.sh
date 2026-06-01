#!/bin/bash
# ============================================
# seo-monthly-review-cron.sh
# 
# Monthly SEO Strategic Review
# Used by: 月度SEO战略复盘 cron (1st of month 10:00)
#
# 输出:
#   - 30天文章分数变化趋势
#   - 部署频率统计
#   - 失败/成功分析
#   - 战略建议
# ============================================

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SKILL_DIR="$HOME/.agents/skills/seo-universal-author"
LOG_DIR="$PROJECT_DIR/logs"
REPORT_DIR="$LOG_DIR/seo-monthly"
mkdir -p "$REPORT_DIR"

REPORT_FILE="$REPORT_DIR/$(date '+%Y-%m').md"

# 当前状态扫描
echo "📊 Monthly SEO Review - $(date '+%Y-%m')"
echo ""

# 当前分数
echo "## 当前状态"
SCAN=$(python3 "$SKILL_DIR/scripts/validate-article.py" --scan "$PROJECT_DIR/content/articles" 2>&1)
echo '```'
echo "$SCAN"
echo '```'
echo ""

# 30 天文章优化历史
echo "## 30天文章优化历史"
echo ""
echo "| 日期 | 文章数 | 提交 |"
echo "|------|--------|------|"
git log --since="30 days ago" --pretty=format:"%h %s" --grep="SEO" 2>/dev/null | head -20 | while read hash msg; do
    date=$(git show -s --format="%ci" $hash 2>/dev/null | cut -d' ' -f1)
    echo "| $date | \`$hash\` | $msg |"
done
echo ""

# Cron 执行情况
echo "## Cron 任务状态"
echo ""
openclaw cron list 2>/dev/null | grep -E "SEO" | while read line; do
    echo "- $line"
done
echo ""

# 失败统计
echo "## 失败统计 (30天)"
git log --since="30 days ago" --pretty=format:"%s" 2>/dev/null | grep -iE "fix|bug|error" | head -10
echo ""

# 建议
echo "## 战略建议"
TOTAL=$(echo "$SCAN" | grep "Total:" | grep -oE "[0-9]+" | head -1)
AVG=$(echo "$SCAN" | grep "Average:" | grep -oE "[0-9]+" | head -1)
P0=$(echo "$SCAN" | grep "P0 errors:" | grep -oE "[0-9]+" | head -1)
HIGH=$(echo "$SCAN" | grep "High score" | grep -oE "[0-9]+" | head -1)
LOW=$(echo "$SCAN" | grep "Low score" | grep -oE "[0-9]+" | head -1)

if [ "${P0:-0}" -gt 0 ]; then
    echo "⚠️  P0 错误: $P0 - 优先修复"
fi

if [ "${AVG:-0}" -lt 70 ]; then
    echo "📈 平均分: $AVG/100 - 需要提升到 80+"
fi

if [ "${HIGH:-0}" -lt 10 ]; then
    echo "🎯 高分文章: $HIGH - 目标 30+ 篇 90+"
fi

if [ "${LOW:-0}" -gt 100 ]; then
    echo "🚨 低分文章: $LOW - 太多，需要批量优化"
fi

echo ""
echo "## 下月目标"
echo "- 平均分提升 10 点"
echo "- 高分文章 +10 篇"
echo "- P0 错误清零"
echo "- 部署成功率 100%"
echo ""
echo "✅ 报告保存到: $REPORT_FILE"

# Write report
{
    echo "# Monthly SEO Strategic Review - $(date '+%Y-%m')"
    echo ""
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
} > "$REPORT_FILE"
