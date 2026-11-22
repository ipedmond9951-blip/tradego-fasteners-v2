#!/bin/bash
# seo-pipeline-preflight.sh - Pipeline 启动前 AI 健康检测
#
# 功能:
# 1. Pipeline 开始前实测每个写作通道能否真的"出字"(不再只看端口/余额字段)
# 2. 不健康的通道自动从健康清单移除, 由 Pipeline 的 fallback 链兜底
# 3. 全部失败 → 最多重试 3 轮(间隔 90 秒), 仍失败才跳过, 并留状态文件 + 本地告警
#
# 创建: 2026-06-20 09:10 (总裁批评: 没自修复机制)
# 2026-11-22 加固: ai-router 端到端实测 / 三轮重试 / 本机告警 / blocked 状态文件
#   背景: 18800 端口在线但 AI 页面不可用时, 旧预检判"健康",
#   整条流水线跑了十几分钟什么都不产出, 日志只剩空转记录。

set +e   # 任何单步失败都不能杀掉脚本 (7/18 教训)

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs/seo-ai-pipeline"
mkdir -p "$LOG_DIR"
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT="${TELEGRAM_CHAT_ID:-8758157215}"
MAX_ATTEMPTS="${PREFLIGHT_MAX_ATTEMPTS:-3}"
RETRY_SLEEP="${PREFLIGHT_RETRY_SLEEP:-90}"

notify() {
    local msg="$1"
    if [ -n "$TELEGRAM_TOKEN" ]; then
        curl -s --max-time 10 -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT}" \
            -d "text=${msg}" > /dev/null 2>&1 || true
    fi
    # 本地兜底: 没有 Telegram token 时也要让人看到
    /usr/bin/osascript -e "display notification \"${msg//\"/}\" with title \"TradeGo SEO 流水线\"" >/dev/null 2>&1 || true
}

ERROR_PATTERN="api error|payment required|402|insufficient|unauthorized|invalid api|not set|no api key|missing|empty|timed out|timeout|\[error\]"

# ---------- 单通道检测 ----------
# 2026-11-22: DeepSeek(余额不足) 与 MiniMax(402) 两条 API 路线已绕开,
# 这里不再探测它们的 key/余额, 只留一行说明, 不计入健康通道。
check_bypassed_apis() {
    echo "BYPASSED"
}

# 2026-11-22 新增: 本机 Codex CLI (ChatGPT 订阅) 是主力写手, 必须实测
check_codex() {
    local work="/tmp/preflight-codex-$$.txt" out
    printf 'Reply with exactly one line: OK' > "$work"
    out=$(timeout 150 bash "$SCRIPT_DIR/codex-channel.sh" "$work" 120 2>&1 | head -c 120)
    rm -f "$work"
    if [ ${#out} -ge 2 ] && ! echo "$out" | grep -qiE "model_not_found|not supported|unauthorized|invalid|\[error\]"; then
        echo "OK"
    else
        echo "FAIL:$(echo "$out" | head -c 80)"
    fi
}

ensure_router_chrome() {
    curl -sf --max-time 5 http://localhost:18800/json/version > /dev/null 2>&1 && return 0
    local profile="$HOME/Library/Application Support/Google/Chrome-Debug"
    [ -d "$profile" ] || return 0
    echo "  🔄 调试 Chrome 未启动, 自动拉起 (profile: Chrome-Debug)..."
    nohup "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --remote-debugging-port=18800 \
        --user-data-dir="$profile" >/dev/null 2>&1 &
    local i
    for i in $(seq 1 12); do
        sleep 2
        curl -sf --max-time 3 http://localhost:18800/json/version > /dev/null 2>&1 && return 0
    done
    return 0
}

# 2026-11-22 新增: 端到端实测, 端口在线 ≠ 能出字
# 输出 OK:<能用的AI> 或 FAIL:<原因>, 并把能用的 AI 写进 healthy-router-ais.txt
probe_router_ais() {
    [ "${PREFLIGHT_SKIP_ROUTER_PROBE:-0}" = "1" ] && { echo "SKIP"; return 0; }
    local work="/tmp/preflight-probe-$$.txt"
    printf 'Reply with exactly one line: OK. Do not explain.' > "$work"
    local usable=() ai out
    # 2026-11-22: 豆包输入框 verify 长期失败, 只测 gemini / grok / chatgpt
    for ai in gemini grok chatgpt; do
        out=$(SEO_LLM_CHANNELS="$ai" timeout 120 bash "$SCRIPT_DIR/seo-llm.sh" "$work" 100 2 2>&1 | head -c 200)
        if [ ${#out} -ge 2 ] && ! echo "$out" | grep -qiE "$ERROR_PATTERN"; then
            usable+=("$ai")
        fi
    done
    rm -f "$work"
    printf '%s\n' "${usable[@]}" > "$LOG_DIR/healthy-router-ais.txt"
    if [ ${#usable[@]} -gt 0 ]; then
        echo "OK:${usable[*]}"
    else
        echo "FAIL:所有 AI 页面都未出字"
    fi
}

run_checks() {
    HEALTHY_AIS=()
    UNHEALTHY_AIS=()
    ROUTER_AIS=""
    echo ""
    echo "[$(date '+%H:%M:%S')] 🔍 Pre-flight AI health check (第 $1 轮)..."

    local r
    # 2026-11-22: DeepSeek / MiniMax 走 API 已绕过, 不再计入健康检查
    echo "  ↷ DeepSeek / MiniMax API: 已绕过 (余额不足 / 402), 不计入健康通道"

    r=$(check_codex)
    if [ "$r" = "OK" ]; then HEALTHY_AIS+=("codex"); echo "  ✅ Codex CLI (ChatGPT 订阅): OK"
    else UNHEALTHY_AIS+=("codex"); echo "  ❌ Codex CLI: FAIL (${r#FAIL:})"; fi

    local vercel_count
    vercel_count=$( (cd "$PROJECT_DIR" && timeout 45 npx vercel ls --prod 2>&1) | grep -c "Ready" || true )
    if [ "${vercel_count:-0}" -gt 0 ]; then
        HEALTHY_AIS+=("vercel"); echo "  ✅ Vercel: OK ($vercel_count deployments)"
    else
        UNHEALTHY_AIS+=("vercel"); echo "  ⚠️ Vercel: 未取到部署列表 (不阻断)"
    fi

    ensure_router_chrome
    if curl -sf --max-time 5 http://localhost:18800/json/version > /dev/null 2>&1; then
        r=$(probe_router_ais)
        case "$r" in
            SKIP) HEALTHY_AIS+=("ai-router"); echo "  ↷ ai-router: 跳过实测 (PREFLIGHT_SKIP_ROUTER_PROBE=1)" ;;
            OK:*) HEALTHY_AIS+=("ai-router"); ROUTER_AIS="${r#OK:}"; echo "  ✅ ai-router (18800): 实测出字 → $ROUTER_AIS" ;;
            *)    UNHEALTHY_AIS+=("ai-router"); echo "  ❌ ai-router (18800): 端口在线但 AI 未出字, 判为不可用" ;;
        esac
    else
        UNHEALTHY_AIS+=("ai-router"); echo "  ⚠️ ai-router (Chrome 18800): 未启动"
    fi

    WRITING_CHANNELS=()
    local a
    for a in "${HEALTHY_AIS[@]}"; do
        [ "$a" != "vercel" ] && WRITING_CHANNELS+=("$a")
    done
}

# ---------- 主循环: 三轮重试 ----------
attempt=1
while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
    run_checks "$attempt"

    echo ""
    echo "[$(date '+%H:%M:%S')] Health summary: ${#HEALTHY_AIS[@]} healthy, ${#UNHEALTHY_AIS[@]} unhealthy"
    echo "${HEALTHY_AIS[@]}" > "$LOG_DIR/healthy-ais.txt"

    if [ ${#WRITING_CHANNELS[@]} -gt 0 ]; then
        rm -f "$LOG_DIR"/blocked-*.txt 2>/dev/null
        if [ ${#UNHEALTHY_AIS[@]} -gt 0 ]; then
            notify "⚠️ Pipeline Pre-flight 部分通道异常
✅ 健康: ${HEALTHY_AIS[*]}
❌ 异常: ${UNHEALTHY_AIS[*]}
💡 Pipeline 会按健康通道 fallback"
        fi
        exit 0
    fi

    if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
        echo "  ⏳ 没有可用写作通道, ${RETRY_SLEEP}s 后重试 ($attempt/$MAX_ATTEMPTS)"
        sleep "$RETRY_SLEEP"
    fi
    attempt=$((attempt+1))
done

# ---------- 三轮都失败 ----------
BLOCK_FILE="$LOG_DIR/blocked-$(date '+%Y%m%d').txt"
{
    echo "time=$(date '+%Y-%m-%d %H:%M:%S')"
    echo "reason=no_writing_channel"
    echo "unhealthy=${UNHEALTHY_AIS[*]}"
    echo "attempts=$MAX_ATTEMPTS"
    echo "next=在 Chrome-Debug 里登录 Gemini / Grok / ChatGPT 任一账号, 然后手动补跑:"
    echo "     bash $PROJECT_DIR/scripts/seo-ai-pipeline.sh"
} > "$BLOCK_FILE"

echo "  🚨 三轮均无可用写作通道 — skip Pipeline (状态已写入 $BLOCK_FILE)"
notify "🚨 今日文章未生成
❌ 所有写作通道三轮均不可用
✅ 已记录: $BLOCK_FILE
💡 请在 Chrome-Debug 登录 Gemini / Grok / ChatGPT 后补跑"
exit 1
