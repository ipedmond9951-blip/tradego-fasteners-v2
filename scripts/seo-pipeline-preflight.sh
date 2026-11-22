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

# 2026-11-22 FIX: set -e 会在 Vercel grep -c 返回 1 时静默杀掉脚本, 造成"预检失败"假象
set +e

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
# 2026-11-22 FIX: 原判断只看长度 >5, 把 "API error: HTTP Error 402" 也当成 OK (假阳)
if [ ${#MM_TEST} -gt 5 ] && ! echo "$MM_TEST" | grep -qiE "api error|payment required|402|insufficient|unauthorized|invalid api|not set|no api key|missing|empty"; then
    HEALTHY_AIS+=("MiniMax-M2.7-highspeed")
    echo "  ✅ MiniMax-M2.7-highspeed: OK"
else
    UNHEALTHY_AIS+=("MiniMax-M2.7-highspeed")
    echo "  ❌ MiniMax-M2.7-highspeed: FAIL ($MM_TEST)"
fi

# ========== Test MiniMax M2.7 (备用) ==========
MM27_TEST=$(timeout 30 bash "$PROJECT_DIR/scripts/minimax-quick.sh" "Reply only: OK" "MiniMax-M2.7" 50 2>&1 | head -c 200)
if [ ${#MM27_TEST} -gt 5 ] && ! echo "$MM27_TEST" | grep -qiE "api error|payment required|402|insufficient|unauthorized|invalid api|not set|no api key|missing|empty"; then
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
# 2026-11-22 FIX: grep -c 计数为 0 时退出码 1, 在 set -e 下会直接杀掉整个 preflight (今天就是这样误判失败的)
VERCEL_TEST=$( (cd "$PROJECT_DIR" && timeout 45 npx vercel ls --prod 2>&1) | grep -c "Ready" || true )
if [ "${VERCEL_TEST:-0}" -gt 0 ]; then
    HEALTHY_AIS+=("vercel")
    echo "  ✅ Vercel: OK ($VERCEL_TEST deployments)"
else
    UNHEALTHY_AIS+=("vercel")
    echo "  ⚠️ Vercel: 未取到部署列表 (网络/鉴权慢, 不阻断)"
fi

# ========== Test ai-router (Chrome 18800, 免费通道) ==========
# 2026-11-22: 未启动时自动拉起调试版 Chrome (独立 profile, 不影响用户日常浏览器),
# 否则 03:30 定时任务只会在"全通道不可用"上空转
if ! curl -sf --max-time 5 http://localhost:18800/json/version > /dev/null 2>&1; then
    CHROME_DEBUG_PROFILE="$HOME/Library/Application Support/Google/Chrome-Debug"
    if [ -d "$CHROME_DEBUG_PROFILE" ]; then
        echo "  🔄 调试 Chrome 未启动, 自动拉起 (profile: Chrome-Debug)..."
        nohup "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
            --remote-debugging-port=18800 \
            --user-data-dir="$CHROME_DEBUG_PROFILE" >/dev/null 2>&1 &
        for _ in 1 2 3 4 5 6 7 8 9 10 11 12; do
            sleep 2
            curl -sf --max-time 3 http://localhost:18800/json/version > /dev/null 2>&1 && break
        done
    fi
fi

if curl -sf --max-time 5 http://localhost:18800/json/version > /dev/null 2>&1; then
    HEALTHY_AIS+=("ai-router")
    echo "  ✅ ai-router (Chrome 18800): 在线"
else
    UNHEALTHY_AIS+=("ai-router")
    echo "  ⚠️ ai-router (Chrome 18800): 未启动"
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

# 2026-11-22: vercel 不算写作通道, 只有 AI 或 ai-router 在才能继续
HAS_AI_CHANNEL=0
for a in "${HEALTHY_AIS[@]}"; do
    if [ "$a" != "vercel" ]; then HAS_AI_CHANNEL=1; fi
done
if [ "$HAS_AI_CHANNEL" -eq 0 ]; then
    echo "  🚨 没有任何可用的写作通道 (AI + ai-router 全挂) — skip Pipeline"
    notify_telegram "🚨 写作通道全断
❌ API 余额/Chrome 18800 均不可用
💡 今日文章跳过, 需充值 API 或启动调试 Chrome"
    exit 1
fi

if [ ${#UNHEALTHY_AIS[@]} -gt 0 ]; then
    notify_telegram "⚠️ Pipeline Pre-flight 部分失败
✅ 健康: ${HEALTHY_AIS[*]}
❌ 异常: ${UNHEALTHY_AIS[*]}
💡 Pipeline 会用健康 AI fallback"
fi

exit 0