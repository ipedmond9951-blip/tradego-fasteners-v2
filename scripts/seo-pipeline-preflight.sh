#!/bin/bash
# seo-pipeline-preflight.sh - Pipeline 启动前 AI 健康检测
#
# 功能:
# 1. Pipeline 开始前先 ping 所有 AI
# 2. 不健康的 AI 自动从 fallback 链移除
# 3. 全部失败 → 立即推 Telegram + 跳过 Pipeline
#
# 创建: 2026-06-20 09:10 (总裁批评: 没自修复机制)
# 用途: 被 seo-ai-pipeline.sh 调用 (line 30: Pre-flight diagnostics)

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs/seo-ai-pipeline"
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT="${TELEGRAM_CHAT_ID:-8758157215}"

notify_telegram() {
    local msg="$1"
    if [ -n "$TELEGRAM_TOKEN" ]; then
        curl -s --max-time 10 -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT}" \
            -d "text=${msg}" > /dev/null 2>&1 || true
    fi
}

echo "[$(date '+%H:%M:%S')] 🔍 Pre-flight AI health check..."

HEALTHY_AIS=()
UNHEALTHY_AIS=()

# ========== Test MiniMax M2.7-highspeed (主力) ==========
MM_TEST=$(timeout 30 bash "$PROJECT_DIR/scripts/minimax-quick.sh" "Reply only: OK" "MiniMax-M2.7-highspeed" 50 2>&1 | head -c 200)
if [ ${#MM_TEST} -gt 5 ]; then
    HEALTHY_AIS+=("MiniMax-M2.7-highspeed")
    echo "  ✅ MiniMax-M2.7-highspeed: OK"
else
    UNHEALTHY_AIS+=("MiniMax-M2.7-highspeed")
    echo "  ❌ MiniMax-M2.7-highspeed: FAIL ($MM_TEST)"
fi

# ========== Test MiniMax M2.7 (备用) ==========
MM27_TEST=$(timeout 30 bash "$PROJECT_DIR/scripts/minimax-quick.sh" "Reply only: OK" "MiniMax-M2.7" 50 2>&1 | head -c 200)
if [ ${#MM27_TEST} -gt 5 ]; then
    HEALTHY_AIS+=("MiniMax-M2.7")
    echo "  ✅ MiniMax-M2.7: OK"
else
    UNHEALTHY_AIS+=("MiniMax-M2.7")
    echo "  ❌ MiniMax-M2.7: FAIL"
fi

# ========== Test DeepSeek API (备用, 绕过禁言) ==========
DS_TEST=$(curl -s --max-time 15 -X POST "https://api.deepseek.com/v1/chat/completions" \
    -H "Authorization: Bearer sk-43be94f13cad4c80bd934c85ccd43a5d" \
    -H "Content-Type: application/json" \
    -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"OK"}],"max_tokens":5}' 2>&1 | head -c 200)

if echo "$DS_TEST" | grep -q '"choices"'; then
    HEALTHY_AIS+=("deepseek-api")
    echo "  ✅ DeepSeek API: OK"
else
    UNHEALTHY_AIS+=("deepseek-api")
    echo "  ⚠️ DeepSeek API: FAIL ($DS_TEST)"
fi

# ========== Test Vercel CLI (部署链) ==========
VERCEL_TEST=$(cd "$PROJECT_DIR" && timeout 30 npx vercel ls --prod 2>&1 | grep -c "Ready")
if [ "$VERCEL_TEST" -gt 0 ]; then
    HEALTHY_AIS+=("vercel")
    echo "  ✅ Vercel: OK ($VERCEL_TEST deployments)"
else
    UNHEALTHY_AIS+=("vercel")
    echo "  ❌ Vercel: FAIL (no Ready deployments)"
fi

# ========== 总结 ==========
echo ""
echo "[$(date '+%H:%M:%S')] Health summary: ${#HEALTHY_AIS[@]} healthy, ${#UNHEALTHY_AIS[@]} unhealthy"

# 写入 health 状态供 Pipeline 使用
echo "${HEALTHY_AIS[@]}" > "$LOG_DIR/healthy-ais.txt"

if [ ${#HEALTHY_AIS[@]} -eq 0 ]; then
    echo "  🚨 ALL AI FAIL — skip Pipeline"
    notify_telegram "🚨 Pipeline Pre-flight 全部失败
❌ 所有 AI 不可用
💡 跳过今日文章生成
📞 联系总裁"
    exit 1
fi

if [ ${#UNHEALTHY_AIS[@]} -gt 0 ]; then
    notify_telegram "⚠️ Pipeline Pre-flight 部分失败
✅ 健康: ${HEALTHY_AIS[*]}
❌ 异常: ${UNHEALTHY_AIS[*]}
💡 Pipeline 会用健康 AI fallback"
fi

exit 0