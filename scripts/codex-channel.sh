#!/bin/bash
# codex-channel.sh - 用本机 Codex CLI (ChatGPT 订阅登录态) 做 LLM 通道
#
# 2026-11-22 新增: DeepSeek/MiniMax 两条 API 下线后, 需要一条不依赖余额的写作通道.
# 本机 codex CLI 已登录 ChatGPT 账号, 可用模型里目前只有 codex-auto-review 能出字
# (gpt-5.5 / gpt-5.4 等会被拒: "model is not supported when using Codex with a ChatGPT account").
#
# 用法: codex-channel.sh <prompt_file> [timeout_sec=400]
# 输出: 去掉 Codex 会话头尾的纯回复 (stdout); 失败时 stdout 空, exit 1
#
# 注意: 每次调用有约 25k tokens 的固定开销 (Codex 系统提示), 只适合做兜底通道.

set +e
PROMPT_FILE="$1"
TIMEOUT="${2:-400}"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "[error] codex-channel: prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

if ! command -v codex >/dev/null 2>&1; then
  echo "[error] codex-channel: 未安装 codex CLI" >&2
  exit 1
fi

WORK_DIR="$(mktemp -d -t codex-channel)"
RAW_LOG="$WORK_DIR/out.log"
if [ "${CODEX_CHANNEL_DEBUG:-0}" = "1" ]; then cp "$RAW_LOG" /tmp/codex-channel-last.log 2>/dev/null; fi
trap 'rm -rf "$WORK_DIR"' EXIT

# 放到空目录里跑, 避免 Codex 读到仓库文件后擅自改代码
( cd "$WORK_DIR" && timeout --kill-after=15 "$TIMEOUT" codex exec \
    -m "${CODEX_CHANNEL_MODEL:-codex-auto-review}" \
    --skip-git-repo-check \
    "$(cat "$PROMPT_FILE")" < /dev/null > "$RAW_LOG" 2>&1 )

python3 - "$RAW_LOG" <<'PY'
import re
import sys

path = sys.argv[1]
lines = open(path, encoding="utf-8", errors="replace").read().splitlines()

# 丢掉模型目录刷新失败等超长日志行
lines = [ln for ln in lines if len(ln) < 2000 and "codex_models_manager" not in ln]

start = None
for i, ln in enumerate(lines):
    if ln.strip() == "codex":
        start = i + 1
if start is None:
    sys.exit(1)

end = len(lines)
for i in range(start, len(lines)):
    if lines[i].strip() in {"tokens used", "user"}:
        end = i
        break

body = "\n".join(lines[start:end]).strip()
# tokens used 后面的数字行
body = re.sub(r"\n\d{1,3},\d{3}\s*$", "", body)
print(body)
PY
