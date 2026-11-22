#!/bin/bash
# minimax-quick.sh - 兼容层 (2026-11-22 起)
#
# MiniMax API 已 402 停用, 但仓库里仍有 20+ 个脚本按老签名调用本脚本
# (i18n 翻译、guardian 保底等). 为不破坏这些调用方, 这里保留原参数签名,
# 内部改走 scripts/seo-llm.sh (Chrome 18800 → gemini → grok → chatgpt).
#
# 原 MiniMax 直连实现见 git 提交 d45c4a9, 需要时可从历史里取回.
#
# 用法(不变): minimax-quick.sh "prompt" [model] [max_tokens]
# 环境变量:
#   SEO_MINIMAX_SHIM=0            关闭兼容层 (直接报错, 便于排查)
#   SEO_MINIMAX_SHIM_TIMEOUT=200  单通道超时秒

PROMPT="$1"
MODEL="${2:-MiniMax-M2.7-highspeed}"   # 保留参数, 兼容层不再使用
MAX_TOKENS="${3:-1500}"                # 只用来推断最小有效字数

if [ -z "$PROMPT" ]; then
  echo "usage: minimax-quick.sh \"prompt\" [model] [max_tokens]" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "${SEO_MINIMAX_SHIM:-1}" = "0" ]; then
  echo "[error] MiniMax 已停用且兼容层被关闭 (SEO_MINIMAX_SHIM=0), $MODEL 不可用" >&2
  exit 4
fi

# 短提示(健康检查)只要几个字就算通过, 长提示按 200 字起步
if [ "$MAX_TOKENS" -le 100 ]; then
  MIN_CHARS=2
else
  MIN_CHARS=200
fi

PROMPT_FILE=$(mktemp -t minimax-shim-prompt)
printf '%s' "$PROMPT" > "$PROMPT_FILE"
trap 'rm -f "$PROMPT_FILE"' EXIT

bash "$SCRIPT_DIR/seo-llm.sh" "$PROMPT_FILE" "${SEO_MINIMAX_SHIM_TIMEOUT:-200}" "$MIN_CHARS"
EXIT_CODE=$?
exit $EXIT_CODE
