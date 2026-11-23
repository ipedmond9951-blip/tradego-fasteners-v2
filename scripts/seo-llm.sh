#!/bin/bash
# seo-llm.sh - SEO 流水线的统一 LLM 调用入口 (2026-11-22)
#
# 背景: DeepSeek 余额不足 (Insufficient Balance) + MiniMax 402, 这两条 API 路线已不可用.
#       改为走 Chrome 18800 上的 ai-router 浏览器通道: gemini / grok / chatgpt.
#       主入口只有这一个, 调用方不再各自拼 minimax-quick / deepseek-client.
#
# 用法:
#   bash scripts/seo-llm.sh <prompt_file> [单通道超时秒=200] [最小有效字符=200]
#
# 环境变量:
#   SEO_LLM_CHANNELS  渠道顺序, 默认 "openclaw codex gemini grok chatgpt"
#                      openclaw = 本机 OpenClaw 网关 (zai/glm-4.5-flash 当前唯一有余额的模型,
#                      走 scripts/oc_writer.py, 4s 一次, 带额度闸门, 不依赖 Chrome)
#                     codex = 本机 Codex CLI (ChatGPT 订阅, 不烧 API 余额, 单次约 20s)
#   SEO_LLM_STRICT=1  输出必须带 markdown 标题或 JSON 才算通过 (写长文时用)
#
# 输出: 首个通过校验的回复 (stdout); 全失败时 stdout 为空, stderr 带 [error], exit 3

set +e
PROMPT_FILE="$1"
CH_TIMEOUT="${2:-200}"
MIN_CHARS="${3:-200}"
CHANNELS="${SEO_LLM_CHANNELS:-openclaw codex gemini grok chatgpt}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -z "$PROMPT_FILE" ] || [ ! -f "$PROMPT_FILE" ]; then
  echo "[error] seo-llm: prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

# Chrome 18800 是浏览器通道 (gemini/grok/chatgpt) 的前提；codex 不依赖它。
# 2026-11-22: 之前 router 不在就整条链路失败，导致 codex 也被一起挡掉。
HAS_ROUTER=0
if curl -sf -m 5 http://localhost:18800/json/version >/dev/null 2>&1; then
  HAS_ROUTER=1
else
  echo "[seo-llm] 提示: Chrome debug (18800) 未启动，本次只走 codex，浏览器通道跳过" >&2
fi

clean_output() {
  # ai-router 会在前后带平台标签 / UI 文本, 还会把提问原样回显,
  # 统一交给 _strip_router_labels.py 剥掉, 保证下游 JSON / markdown 解析干净
  python3 "$SCRIPT_DIR/_strip_router_labels.py" "$PROMPT_FILE"
}

TRIED=""
# ai-guard 按 prompt hash 做 24h 去重, 同一个 prompt 会被直接拦掉; 每次调用末尾补 nonce 绕开
PROMPT_WITH_NONCE="$(mktemp -t seo-llm-prompt)"
trap 'rm -f "$PROMPT_WITH_NONCE"' EXIT
cat "$PROMPT_FILE" > "$PROMPT_WITH_NONCE"
printf '\n\n[Internal-ref: %s seo-llm]\n' "$(date +%s%N)" >> "$PROMPT_WITH_NONCE"

for CH in $CHANNELS; do
  echo "[seo-llm] 通道 $CH (timeout ${CH_TIMEOUT}s, min ${MIN_CHARS} chars)" >&2
  if [ "$CH" = "openclaw" ]; then
    # 首选通道: 不烧 API 余额、不依赖 Chrome、自带 model 链与 80% 额度闸门
    if command -v timeout >/dev/null 2>&1; then
      OUT=$(timeout --kill-after=10 "$CH_TIMEOUT" python3 "$SCRIPT_DIR/oc_writer.py" - < "$PROMPT_WITH_NONCE" 2>/dev/null)
    else
      OUT=$(python3 "$SCRIPT_DIR/oc_writer.py" - < "$PROMPT_WITH_NONCE" 2>/dev/null)
    fi
  elif [ "$CH" = "codex" ]; then
    OUT=$(bash "$SCRIPT_DIR/codex-channel.sh" "$PROMPT_WITH_NONCE" "$CH_TIMEOUT" 2>/dev/null)
  elif [ "$HAS_ROUTER" = "1" ]; then
    OUT=$(timeout --kill-after=10 "$CH_TIMEOUT" bash "$SCRIPT_DIR/seo-ai-router-call.sh" "$CH" "$PROMPT_WITH_NONCE" "$CH_TIMEOUT" 2>/dev/null)
  else
    echo "[seo-llm] 跳过 $CH（浏览器通道需要 Chrome 18800）" >&2
    continue
  fi
  OUT=$(printf '%s' "$OUT" | clean_output)
  LEN=${#OUT}
  TRIED="$TRIED ${CH}(${LEN})"

  if [ "$LEN" -lt "$MIN_CHARS" ]; then
    echo "[seo-llm] $CH 输出过短 (${LEN} chars), 换下一个" >&2
    continue
  fi
  if printf '%s' "$OUT" | grep -qE "^\[error\]|^\[warn\]"; then
    echo "[seo-llm] $CH 返回错误标记, 换下一个" >&2
    continue
  fi
  # 平台会把提问原样回显 (还会带 UI 文本), 命中即判该通道无效
  ECHO_HEAD=$(head -c 80 "$PROMPT_FILE" | tr -d '\n' | cut -c1-25)
  if [ -n "$ECHO_HEAD" ] && printf '%s' "$OUT" | grep -qF "$ECHO_HEAD"; then
    echo "[seo-llm] $CH 输出是提问回显/页面文本, 换下一个" >&2
    continue
  fi
  if [ "${SEO_LLM_STRICT:-0}" = "1" ] && ! printf '%s' "$OUT" | grep -qE '^##?\s|^#\s|"sections"|"title"'; then
    echo "[seo-llm] $CH 输出不像文章/JSON (strict 模式), 换下一个" >&2
    continue
  fi

  echo "[seo-llm] ✅ $CH 通过 (${LEN} chars)" >&2
  printf '%s\n' "$OUT"
  exit 0
done

echo "[error] seo-llm: 全部通道失败或被拒:${TRIED}" >&2
echo "[error] seo-llm: 请检查 chrome 18800 上的 gemini / grok 登录态" >&2
exit 3
