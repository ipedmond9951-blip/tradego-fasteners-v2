#!/bin/bash
# i18n-batch-all-langs.sh - 7/23 创建: 7 langs 顺序批处理 (zh 后跑)
# 顺序: hi (34) -> ar (9) -> ja (13) -> de (11) -> es (12) -> fr (7) -> pt (9) -> ru (12)
# 总计: ~107 placeholder/empty, ~53 min at 30s/call
#
# 用法: nohup bash scripts/i18n-batch-all-langs.sh > /tmp/i18n-batch-all.log 2>&1 &

set -e
SCRIPT_DIR="$HOME/workspace/tradego-fasteners-v2/scripts"
LOG="/tmp/i18n-batch-all.log"
LANGS=("hi" "ar" "ja" "de" "es" "fr" "pt" "ru")

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ===== i18n-batch-all-langs START (waiting for zh first) =====" | tee -a "$LOG"

# Wait for zh batch to finish
ZH_PID=$(pgrep -f "i18n-fix-placeholders-batch" | head -1)
if [ -n "$ZH_PID" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Waiting for zh batch (PID $ZH_PID) to finish..." | tee -a "$LOG"
  while kill -0 "$ZH_PID" 2>/dev/null; do
    sleep 30
  done
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] zh batch finished, starting other langs" | tee -a "$LOG"
fi

# Run each lang sequentially
for LANG in "${LANGS[@]}"; do
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ===== Starting $LANG batch =====" | tee -a "$LOG"
  LANG="$LANG" bash "$SCRIPT_DIR/i18n-fix-placeholders-batch.sh" 2>&1 | tee -a "$LOG"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ===== $LANG batch done =====" | tee -a "$LOG"
  sleep 10
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ===== i18n-batch-all-langs ALL DONE =====" | tee -a "$LOG"
