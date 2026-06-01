#!/bin/bash
# ============================================
# telegram-notify.sh
# 
# Send Telegram message via OpenClaw
# Used by: SEO Universal Cron, weekly intelligent cron, monthly review
#
# 用法: bash telegram-notify.sh <chat_id> <message>
#       bash telegram-notify.sh --severity=P0 "Critical issue"
#       bash telegram-notify.sh --report /path/to/report.md
# ============================================

set -e

CHAT_ID="${TELEGRAM_CHAT_ID:-8758157215}"
SEVERITY=""
MESSAGE=""
REPORT_FILE=""

for arg in "$@"; do
    case $arg in
        --severity=*) SEVERITY="${arg#*=}" ;;
        --report=*) REPORT_FILE="${arg#*=}" ;;
        --chat=*) CHAT_ID="${arg#*=}" ;;
        *) MESSAGE="$MESSAGE $arg" ;;
    esac
done

# Severity icon
case "$SEVERITY" in
    P0|critical) ICON="🔴"; LABEL="P0 紧急" ;;
    P1|high) ICON="🟠"; LABEL="P1 高优" ;;
    P2|medium) ICON="🟡"; LABEL="P2 中" ;;
    P3|low) ICON="🟢"; LABEL="P3 低" ;;
    info) ICON="ℹ️"; LABEL="INFO" ;;
    *) ICON="📢"; LABEL="通知" ;;
esac

# Read report if provided
if [ -n "$REPORT_FILE" ] && [ -f "$REPORT_FILE" ]; then
    REPORT_CONTENT=$(cat "$REPORT_FILE")
    MESSAGE="$MESSAGE

$REPORT_CONTENT"
fi

# Trim message (Telegram limit: 4096 chars)
if [ ${#MESSAGE} -gt 3800 ]; then
    MESSAGE="${MESSAGE:0:3800}...
[truncated, see full report]"
fi

# Send via openclaw
openclaw message send \
    --channel telegram \
    -t "$CHAT_ID" \
    -m "$ICON $LABEL

$MESSAGE" 2>&1
