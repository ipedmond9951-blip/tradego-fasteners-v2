#!/bin/bash
# minimax-quick-json.sh - 兼容层 (2026-11-22 起)
#
# MiniMax API 402 停用后, 保留原参数签名, 内部转 scripts/minimax-quick.sh
# (该脚本已改成走 scripts/seo-llm.sh → codex / gemini / grok / chatgpt).
# 调用方 (i18n-fix-placeholders-batch.sh) 拿到的是纯文本, JSON 由它自己解析.
#
# 原 MiniMax JSON 直连实现见 git 提交 d45c4a9.

PROMPT="$1"
MODEL="${2:-MiniMax-M2.7}"
MAX_TOKENS="${3:-4000}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

bash "$SCRIPT_DIR/minimax-quick.sh" "$PROMPT" "$MODEL" "$MAX_TOKENS"
