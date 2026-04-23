#!/bin/bash

# TradeGo SEO优化马拉松 - 每日提醒
# 每天早上9点自动运行
# 设置: crontab -e 添加: 0 9 * * * /path/to/daily-reminder.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OPTIMIZE_SCRIPT="$SCRIPT_DIR/optimize.sh"
LOG_FILE="$SCRIPT_DIR/daily_log.txt"

# 日期
TODAY=$(date '+%Y-%m-%d %H:%M')
echo "[$TODAY] 每日检查" >> "$LOG_FILE"

# 检查上次更新时间
LAST_UPDATE=$(cat "$SCRIPT_DIR/round_progress.json" 2>/dev/null | grep -o '"last_updated": "[^"]*"' | cut -d'"' -f4 || echo "")

# 如果今天还没有完成任何操作，显示提醒
if [ "$LAST_UPDATE" != "$(date '+%Y-%m-%d')" ]; then
    echo "📋 今日待办提醒" >> "$LOG_FILE"
    "$OPTIMIZE_SCRIPT" next >> "$LOG_FILE" 2>&1
else
    echo "✓ 今日已完成优化任务" >> "$LOG_FILE"
fi

# 显示状态
echo "" >> "$LOG_FILE"
"$OPTIMIZE_SCRIPT" status >> "$LOG_FILE" 2>&1

# 如果是从cron运行，输出到控制台
if [ -t 0 ]; then
    cat "$LOG_FILE"
fi
