#!/bin/bash
# ============================================
# gsc-failure-classifier.sh
# 
# Classify GSC submission failures by type
# Returns exit code based on severity:
#   0 = no failures
#   1 = transient (retry)
#   2 = rate limit (backoff)
#   3 = auth error (needs reauth)
#   4 = permanent (skip)
#
# 用法: bash gsc-failure-classifier.sh <log-file>
# ============================================

set -e

LOG_FILE="${1:-/tmp/gsc-submit.log}"

if [ ! -f "$LOG_FILE" ]; then
    exit 0
fi

# Read log
LOG=$(cat "$LOG_FILE")

# Classify
if echo "$LOG" | grep -qiE "401|unauthoriz|invalid.*token|expired.*token"; then
    echo "🔴 AUTH_ERROR: Token invalid or expired"
    echo "   Action: Re-run OAuth flow, save new token"
    exit 3
fi

if echo "$LOG" | grep -qiE "429|rate.*limit|too many requests|quota.*exceed"; then
    echo "🟡 RATE_LIMIT: Hit API rate limit"
    echo "   Action: Backoff 60-300 seconds, retry tomorrow"
    exit 2
fi

if echo "$LOG" | grep -qiE "500|502|503|504|server error|internal error"; then
    echo "🟠 TRANSIENT: Server error"
    echo "   Action: Retry in 5 minutes"
    exit 1
fi

if echo "$LOG" | grep -qiE "timeout|connection.*refused|ETIMEDOUT|ECONNRESET"; then
    echo "🟠 TRANSIENT: Network timeout"
    echo "   Action: Retry in 5 minutes"
    exit 1
fi

if echo "$LOG" | grep -qiE "404|not found|invalid.*url"; then
    echo "🔴 PERMANENT: URL not found in sitemap"
    echo "   Action: Fix sitemap, no point retrying"
    exit 4
fi

if echo "$LOG" | grep -qiE "permission.*denied|forbidden|access.*denied"; then
    echo "🔴 PERMANENT: Permission denied"
    echo "   Action: Check GSC service account permissions"
    exit 4
fi

if echo "$LOG" | grep -qiE "Error|FAIL|❌"; then
    echo "⚪ UNKNOWN: Generic error"
    echo "   Action: Check log manually"
    exit 1
fi

echo "✅ No failures detected"
exit 0
