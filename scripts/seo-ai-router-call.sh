#!/bin/bash
# seo-ai-router-call.sh - 调用 ai-assistant-router 单一 AI
# 用法: bash scripts/seo-ai-router-call.sh <ai> <prompt_file> [timeout_sec]
# 输出: AI 回复 (stdout), 失败时返回 [error] 标记
#
# 2026-07-03 v1 创建: 集成 ai-assistant-router 到 SEO pipeline

set -e

AI="$1"   # doubao | gemini | grok | chatgpt (deepseek 静默中)
PROMPT_FILE="$2"
TIMEOUT="${3:-180}"

if [ -z "$AI" ] || [ -z "$PROMPT_FILE" ]; then
  echo "[error] 用法: $0 <ai> <prompt_file> [timeout_sec]" >&2
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "[error] prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

# 加载 env (cron 环境下)
if [ -f "$HOME/.openclaw/service-env/ai.openclaw.gateway.env" ]; then
  set -a
  source "$HOME/.openclaw/service-env/ai.openclaw.gateway.env"
  set +a
fi

# 检查 Chrome debug (ai-router 默认 18800)
if ! curl -sf http://localhost:18800/json/version > /dev/null 2>&1; then
  echo "[error] Chrome debug 未在 18800 端口, ai-router 不能用"
  exit 2
fi

# 调用 ai-router
AI_ROUTER="$HOME/.agents/skills/ai-assistant-router/ai-router.js"
PROMPT=$(cat "$PROMPT_FILE")

# timeout + kill-after 防止 node event loop 卡死
# 2026-07-15 fix: 加 retry - 偶发失败 (Chrome tab 状态异常) 时重试 2 次
RESULT=""
ATTEMPT=0
MAX_ATTEMPTS=3
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  RESULT=$(timeout --kill-after=15 "$TIMEOUT" node "$AI_ROUTER" "$AI" "$PROMPT" 2>&1) && break
  EXITCODE=$?
  if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
    echo "[ai-router-call] attempt $ATTEMPT failed (exit $EXITCODE), retrying in 5s..." >&2
    sleep 5
  else
    if [ $EXITCODE -eq 124 ]; then
      echo "[error] ai-router timeout after ${TIMEOUT}s (AI=$AI, tried $MAX_ATTEMPTS times)"
    else
      echo "[error] ai-router exit $EXITCODE (AI=$AI, tried $MAX_ATTEMPTS times)"
    fi
    exit $EXITCODE
  fi
done

# 输出 AI 回复
echo "$RESULT"
