#!/bin/bash
# GEO优化进度监控脚本

GEO_DIR="/Users/zhangming/workspace/tradego-fasteners-v2/geo-optimization"
LOG_FILE="$GEO_DIR/review-log.md"

echo "=========================================="
echo "   GEO优化 100轮进度监控"
echo "   $(date)"
echo "=========================================="
echo ""

if [ ! -f "$LOG_FILE" ]; then
    echo "❌ 日志文件不存在"
    echo "请先运行: ./geo-review-loop.sh init"
    exit 1
fi

# 统计完成轮数
completed=$(grep -c "✅\|完成" "$LOG_FILE" 2>/dev/null || echo "0")
total=100
progress=$((completed * 100 / total))

echo "完成进度: $completed/$total 轮 ($progress%)"
echo ""

# 进度条
printf "进度: ["
for i in $(seq 1 50); do
    if [ $i -le $((completed * 50 / total)) ]; then
        printf "█"
    else
        printf "░"
    fi
done
printf "] %d%%\n" $progress
echo ""

# 显示最近5轮
echo "最近5轮:"
tail -10 "$LOG_FILE" | head -5
echo ""

# 检查是否有进行中的轮次
in_progress=$(grep -c "进行中" "$LOG_FILE" 2>/dev/null || echo "0")
if [ "$in_progress" -gt 0 ]; then
    echo "⚠️  有 $in_progress 轮正在进行中"
fi

echo "=========================================="
echo "详细日志: $LOG_FILE"
echo "=========================================="
