#!/bin/bash
#
# TradeGo Content Cron Setup
# 
# This script sets up the automatic content generation cron job
# 
# Usage: ./setup-content-cron.sh [options]
#   --install     Install the cron job
#   --remove      Remove the cron job
#   --status      Check current cron status
#   --test        Run a test generation (dry-run)
#   --show        Show the current crontab
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
CRON_USER="${CRON_USER:-$(whoami)}"
LOG_DIR="$PROJECT_ROOT/logs"

# Cron schedule: Every Monday at 6:00 AM
# 0 6 * * 1 = At 06:00 on Monday
CRON_SCHEDULE="0 6 * * 1"

# Cron command
CRON_COMMAND="cd $PROJECT_ROOT && node scripts/content-cron/gen-zimbabwe-content.js --deploy >> $LOG_DIR/content-cron.log 2>&1"

# Cron identifier comment
CRON_IDENTIFIER="# TradeGo Zimbabwe Content Cron"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

show_help() {
    cat << EOF
TradeGo Content Cron Setup

Usage: $0 [options]

Options:
    --install     Install the cron job
    --remove      Remove the cron job
    --status      Check current cron status
    --test        Run a test generation (dry-run)
    --show        Show the current crontab
    --help        Show this help message

Schedule:
    Every Monday at 6:00 AM (Asia/Shanghai timezone)

Cron Command:
    $CRON_COMMAND

EOF
}

# Check if cron exists
check_cron_installed() {
    crontab -l 2>/dev/null | grep -q "$CRON_IDENTIFIER"
}

# Install cron
install_cron() {
    echo "Installing TradeGo Content Cron job..."
    
    # First, remove any existing instance
    remove_cron
    
    # Create the cron entry
    (crontab -l 2>/dev/null || true; echo "$CRON_IDENTIFIER"; echo "$CRON_SCHEDULE $CRON_COMMAND") | crontab -
    
    echo "✓ Cron job installed"
    echo "  Schedule: $CRON_SCHEDULE (Every Monday at 6:00 AM)"
    echo "  Command: $CRON_COMMAND"
    echo ""
    echo "Next run: $(next_cron_run)"
}

# Remove cron
remove_cron() {
    echo "Removing TradeGo Content Cron job..."
    
    # Remove lines containing our identifier
    crontab -l 2>/dev/null | grep -v "$CRON_IDENTIFIER" | grep -v "^$CRON_SCHEDULE" | crontab - 2>/dev/null || true
    
    # Also remove the specific line
    crontab -l 2>/dev/null | grep -v "$CRON_COMMAND" | crontab - 2>/dev/null || true
    
    echo "✓ Cron job removed"
}

# Show status
show_status() {
    echo "=== TradeGo Content Cron Status ==="
    echo ""
    
    if check_cron_installed; then
        echo "Status: INSTALLED ✓"
        echo "Schedule: $CRON_SCHEDULE (Every Monday at 6:00 AM)"
        echo "Command: $CRON_COMMAND"
        echo ""
        echo "Next run: $(next_cron_run)"
    else
        echo "Status: NOT INSTALLED"
        echo ""
        echo "To install, run: $0 --install"
    fi
    
    echo ""
    echo "=== Recent Logs ==="
    if [ -f "$LOG_DIR/content-cron.log" ]; then
        tail -20 "$LOG_DIR/content-cron.log"
    else
        echo "No logs yet"
    fi
}

# Show crontab
show_crontab() {
    echo "=== Current Crontab ==="
    crontab -l 2>/dev/null || echo "(empty)"
}

# Test run (dry-run)
test_run() {
    echo "=== Test Run (Dry Run) ==="
    cd "$PROJECT_ROOT"
    node scripts/content-cron/gen-zimbabwe-content.js --dry-run --next
}

# Calculate next cron run time
next_cron_run() {
    # Simple approximation - show next Monday at 6 AM
    date -v+1w "+%Y-%m-%d (next Monday) at 06:00" 2>/dev/null || \
    date --date="next Monday" "+%Y-%m-%d (next Monday) at 06:00" 2>/dev/null || \
    echo "Next Monday at 06:00"
}

# Main
case "${1:-}" in
    --install)
        install_cron
        ;;
    --remove)
        remove_cron
        ;;
    --status)
        show_status
        ;;
    --test)
        test_run
        ;;
    --show)
        show_crontab
        ;;
    --help|-h)
        show_help
        ;;
    *)
        show_help
        echo ""
        echo "Error: Unknown option: $1"
        exit 1
        ;;
esac
