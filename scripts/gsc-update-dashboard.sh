#!/bin/bash
# gsc-update-dashboard.sh - 跑 GSC scraper 并同步到前端 dashboard (2026-07-03)
#
# 流程:
# 1. 调用 gsc-scraper.js 拉 GSC 真实数据
# 2. 写入 public/data/seo-stats.json (前端 API 直接读)
# 3. 备份旧数据到 logs/seo-stats-history/
#
# 用法:
#   ./scripts/gsc-update-dashboard.sh            # 13 weeks 默认
#   ./scripts/gsc-update-dashboard.sh --weeks 4   # 4 weeks
#
# Cron:
#   每 6 小时跑一次: 0 */6 * * * /path/to/gsc-update-dashboard.sh

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$PROJECT_DIR/scripts"
LOG_DIR="$PROJECT_DIR/logs/seo-stats-history"
DATA_DIR="$PROJECT_DIR/public/data"

mkdir -p "$LOG_DIR" "$DATA_DIR"

WEEKS=13
if [ "$1" = "--weeks" ] && [ -n "$2" ]; then
    WEEKS="$2"
fi

TIMESTAMP=$(date +%Y%m%d-%H%M)
LOG_FILE="$LOG_DIR/gsc-$TIMESTAMP.log"
JSON_FILE="$LOG_DIR/gsc-$TIMESTAMP.json"

echo "[$TIMESTAMP] 🚀 GSC scraper 启动 (weeks=$WEEKS)" | tee -a "$LOG_FILE"

# 1. 跑 scraper, 输出 JSON
cd "$PROJECT_DIR"
# 2026-07-03 FIX: gsc-scraper.js 接受 --weeks=N 格式, 不是空格
node "$SCRIPT_DIR/gsc-scraper.js" "--weeks=$WEEKS" > "$JSON_FILE" 2>> "$LOG_FILE"

if [ ! -s "$JSON_FILE" ]; then
    echo "[$TIMESTAMP] ❌ Scraper 输出为空, 不更新 dashboard" | tee -a "$LOG_FILE"
    exit 1
fi

# 2. 验证 JSON 有效
if ! python3 -c "import json; json.load(open('$JSON_FILE'))" 2>/dev/null; then
    echo "[$TIMESTAMP] ❌ JSON 无效, 不更新" | tee -a "$LOG_FILE"
    exit 1
fi

# 3. 写入前端可访问的位置
cp "$JSON_FILE" "$DATA_DIR/seo-stats.json"

# 4. 添加时间戳元数据
python3 << PYEOF
import json
data = json.load(open("$DATA_DIR/seo-stats.json"))
data['_meta'] = {
    "scraped_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "weeks": $WEEKS,
    "source": "gsc-scraper.js + Chrome CDP"
}
json.dump(data, open("$DATA_DIR/seo-stats.json", 'w'), indent=2)
PYEOF

echo "[$TIMESTAMP] ✅ Dashboard 已更新: $DATA_DIR/seo-stats.json" | tee -a "$LOG_FILE"

# 5. 清理: 只保留最近 30 个 history
cd "$LOG_DIR"
ls -t gsc-*.json | tail -n +31 | xargs -I {} rm {} 2>/dev/null || true
ls -t gsc-*.log | tail -n +31 | xargs -I {} rm {} 2>/dev/null || true

echo "[$TIMESTAMP] 🏁 完成" | tee -a "$LOG_FILE"