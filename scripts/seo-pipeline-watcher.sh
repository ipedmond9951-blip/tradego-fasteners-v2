#!/bin/bash
# seo-pipeline-watcher.sh - SEO Pipeline 实时健康监控
#
# 功能:
# 1. 每 30 分钟检查 Pipeline 状态
# 2. 检测到异常 → 立即推 Telegram + 自动重启
# 3. 不靠人盯 — 全自动
#
# 创建: 2026-06-20 09:08 (总裁批评: 没自修复机制)
# Cron: */30 * * * *

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs/seo-ai-pipeline"
STATE_FILE="$LOG_DIR/state.json"
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT="${TELEGRAM_CHAT_ID:-8758157215}"
LOG_FILE="$LOG_DIR/watcher-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify_telegram() {
    local msg="$1"
    if [ -n "$TELEGRAM_TOKEN" ]; then
        curl -s --max-time 10 -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT}" \
            -d "text=${msg}" \
            -d "parse_mode=Markdown" > /dev/null 2>&1 || true
    fi
}

TODAY=$(date +%Y-%m-%d)

# ========== 检测 1: Pipeline 进程是否在跑 (卡死检测) ==========
PIPELINE_PROCS=$(ps aux | grep "seo-ai-pipeline.sh" | grep -v grep | wc -l | tr -d ' ')

if [ "$PIPELINE_PROCS" -gt 1 ]; then
    # 多个 pipeline 进程 → 卡死 or 重复启动
    RUNTIME=$(ps aux | grep "seo-ai-pipeline.sh" | grep -v grep | head -1 | awk '{print $10}')
    log "⚠️ Pipeline 进程异常: $PIPELINE_PROCS 个, 运行时长 $RUNTIME"
    
    # 如果运行超过 30 分钟 → 卡死, 自动 kill
    if [[ "$RUNTIME" =~ ^[0-9]+$ ]] && [ "$RUNTIME" -gt 1800 ]; then
        log "❌ Pipeline 卡死 (${RUNTIME}s), 强制 kill"
        pkill -9 -f "seo-ai-pipeline.sh" 2>/dev/null || true
        pkill -9 -f "node.*ai-router" 2>/dev/null || true
        notify_telegram "🚨 Pipeline 卡死自动清理
⏰ Runtime: ${RUNTIME}s
🛡️ Watcher 自动 kill + 重启"
        
        # 重启
        sleep 5
        bash "$PROJECT_DIR/scripts/seo-ai-pipeline.sh" >> "$LOG_DIR/watcher-restart-$(date +%H%M).log" 2>&1 &
        log "✅ Pipeline 已重启 PID=$!"
    fi
fi

# ========== 检测 2: 今天还没成功发布 ==========
if [ -f "$STATE_FILE" ]; then
    LAST_RUN=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_run',''))" 2>/dev/null || echo "")
    LAST_SLUG=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_slug',''))" 2>/dev/null || echo "")
    
    if [ "$LAST_RUN" != "$TODAY" ]; then
        HOUR=$(date '+%H')
        
        # 04:00 之后还没今天文章 → 警告
        if [ "$HOUR" -ge 4 ] && [ "$HOUR" -lt 12 ]; then
            log "⚠️ 今天 ($TODAY) 还没成功发布文章"
            
            # 检查 guardian 是否在跑
            GUARDIAN_PROCS=$(ps aux | grep "seo-pipeline-guardian" | grep -v grep | wc -l | tr -d ' ')
            
            if [ "$GUARDIAN_PROCS" -eq 0 ]; then
                log "🚀 触发 Guardian"
                bash "$PROJECT_DIR/scripts/seo-pipeline-guardian.sh" >> "$LOG_DIR/watcher-triggered-$(date +%H%M).log" 2>&1 &
                notify_telegram "⚠️ Watcher 检测到今日未发布
📅 $TODAY $HOUR:00
🛡️ 已自动触发 Guardian
⏳ Guardian 将在后台自动修复"
            fi
        fi
    else
        # 已有今日文章, 验证 HTTP 200
        HTTP_CODE=$(curl -sL --max-time 10 -o /dev/null -w "%{http_code}" "https://www.tradego-fasteners.com/en/industry/${LAST_SLUG}/" 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" != "200" ]; then
            log "⚠️ state.json 说已跑, 但 HTTP $HTTP_CODE — 部署异常"
            
            # 重 deploy
            cd "$PROJECT_DIR"
            git status -s | head -3 | tee -a "$LOG_FILE"
            if ! git status -s | grep -q "zambia\|${LAST_SLUG}"; then
                log "  文章未 commit, 自动 commit + push + deploy"
                git add "content/articles/${LAST_SLUG}.json" 2>/dev/null || git add -A
                git commit -m "fix(seo): [watcher] auto-commit $LAST_SLUG" 2>&1 | tail -3 | tee -a "$LOG_FILE"
                git push origin main 2>&1 | tail -2 | tee -a "$LOG_FILE"
                timeout 180 npx vercel --prod --yes --force 2>&1 | tail -5 | tee -a "$LOG_FILE"
                notify_telegram "🚨 Watcher 自动重新部署
🔗 Slug: $LAST_SLUG
💡 state.json 显示已跑但 HTTP 异常
🛠️ Watcher 自动 git commit + push + vercel deploy"
            fi
        fi
    fi
fi

log "✅ Watcher tick complete"