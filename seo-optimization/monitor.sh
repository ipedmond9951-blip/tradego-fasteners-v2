#!/bin/bash

# SEO优化进度监控脚本
# 用法: ./monitor.sh

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_FILE="$PROJECT_DIR/seo-optimization/review-log.md"

echo "=========================================="
echo "🚀 TradeGo SEO优化进度监控"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

# 检查日志文件是否存在
if [ ! -f "$LOG_FILE" ]; then
    echo "❌ 日志文件不存在: $LOG_FILE"
    echo "请先运行: ./auto-review-loop.sh"
    exit 1
fi

# 统计完成轮次
TOTAL_ROUNDS=40
COMPLETED=$(grep -c "完成" "$LOG_FILE" 2>/dev/null || echo "0")
PHASE1=$(grep -E "\| [0-9]+\|.*SEO优化.*完成" "$LOG_FILE" 2>/dev/null | wc -l)
PHASE2=$(grep -E "\| [0-9]+\|.*产品优化.*完成" "$LOG_FILE" 2>/dev/null | wc -l)

echo "📊 优化进度:"
echo "   - 第一阶段(SEO优化): $PHASE1/20 轮"
echo "   - 第二阶段(产品优化): $PHASE2/20 轮"
echo "   - 总进度: $COMPLETED/$TOTAL_ROUNDS 轮"
echo ""

# 计算百分比
PERCENT=$((COMPLETED * 100 / TOTAL_ROUNDS))
echo "📈 完成度: [$PERCENT%]"
echo ""

# 进度条
FILLED=$((PERCENT / 2))
EMPTY=$((50 - FILLED))
printf "   ["
printf "%${FILLED}s" | tr ' ' '█'
printf "%${EMPTY}s" | tr ' ' '░'
printf "] %d%%\n" "$PERCENT"
echo ""

# 显示最近5条记录
echo "📝 最近优化记录:"
echo "----------------------------------------"
tail -5 "$LOG_FILE" | grep "|"
echo ""

# 检查未完成项目
echo "⏳ 待完成项目:"
REMAINING=0
for i in {1..20}; do
    if ! grep -q "| $i |.*完成" "$LOG_FILE" 2>/dev/null; then
        if [ $REMAINING -lt 5 ]; then
            echo "   - 第 $i 轮待完成"
            REMAINING=$((REMAINING + 1))
        fi
    fi
done

if [ $REMAINING -eq 0 ] && [ $COMPLETED -lt 40 ]; then
    echo "   - 第 $((COMPLETED + 1)) 轮待完成"
fi

echo ""
echo "=========================================="
echo "💡 提示: 运行 ./auto-review-loop.sh 继续优化"
echo "=========================================="
