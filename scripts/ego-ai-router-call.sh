#!/bin/bash
# ego-ai-router-call.sh - 用 ego lite 浏览器调用 gemini / grok / chatgpt 网页版
# 用法: bash scripts/ego-ai-router-call.sh <ai> <prompt_file> [timeout_sec]
# 输出: AI 回复 (stdout)；失败时 stdout 为空、stderr 带 [ego-router] 原因、exit 3
#
# 2026-11-24 新建：把原 ai-router（Chrome 18800 + playwright connectOverCDP）搬到 ego lite。
# ego 不对外暴露 CDP 端口，所以改成"生成脚本 + ego-browser nodejs"执行，登录态复用 ego profile。

set +e
AI="$1"
PROMPT_FILE="$2"
TIMEOUT="${3:-180}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -z "$AI" ] || [ -z "$PROMPT_FILE" ]; then
  echo "[error] 用法: $0 <ai> <prompt_file> [timeout_sec]" >&2
  exit 1
fi
[ -f "$PROMPT_FILE" ] || { echo "[error] prompt file not found: $PROMPT_FILE" >&2; exit 1; }

# launchd/cron 的 PATH 很干净，ego 在 ~/.local/bin
EGO_BIN=""
for c in "$(command -v ego-browser 2>/dev/null)" "$HOME/.local/bin/ego-browser"; do
  [ -n "$c" ] && [ -x "$c" ] && { EGO_BIN="$c"; break; }
done
if [ -z "$EGO_BIN" ]; then
  echo "[ego-router] ego-browser 未安装，跳过 $AI" >&2
  exit 3
fi

GEN="$(mktemp -t ego-router-js)"
trap 'rm -f "$GEN"' EXIT

python3 - "$AI" "$PROMPT_FILE" "$TIMEOUT" "$SCRIPT_DIR/ego-ai-router.js" "$GEN" <<'PY'
import json, sys
ai, pf, timeout, tpl_path, out_path = sys.argv[1:6]
CFG = {
    'gemini': dict(url='https://gemini.google.com/app', host='gemini.google.com',
                   composer=['div.ql-editor', "rich-textarea div[contenteditable='true']", "div[contenteditable='true']"],
                   answer=['.model-response-text', '.markdown'], send='enter'),
    'chatgpt': dict(url='https://chatgpt.com/', host='chatgpt.com',
                    composer=['#prompt-textarea', "div[contenteditable='true']", 'textarea'],
                    answer=["[data-message-author-role='assistant'] .markdown",
                            "[data-message-author-role='assistant']", '.markdown'], send='enter'),
    'grok': dict(url='https://grok.com/', host='grok.com',
                 composer=['textarea', "div[contenteditable='true']", '[role="textbox"]'],
                 answer=['.message-bubble', '[class*="response"]', '[data-testid="response"]'], send='enter'),
}[ai]
prompt = open(pf, encoding='utf-8').read().strip()
CFG.update(ai=ai, prompt=prompt, timeoutMs=int(timeout) * 1000)
tpl = open(tpl_path, encoding='utf-8').read()
open(out_path, 'w', encoding='utf-8').write(tpl.replace('__CFG__', json.dumps(CFG, ensure_ascii=False)))
PY

echo "[ego-router] $AI 走 ego lite (timeout ${TIMEOUT}s)" >&2
if command -v timeout >/dev/null 2>&1; then
  RAW=$(timeout --kill-after=10 "$((TIMEOUT + 30))" "$EGO_BIN" nodejs < "$GEN" 2>&1)
else
  RAW=$("$EGO_BIN" nodejs < "$GEN" 2>&1)
fi

if printf '%s' "$RAW" | grep -q '\[\[EGO_REPLY\]\]'; then
  printf '%s' "$RAW" | python3 -c "
import sys, re
t = sys.stdin.read()
m = re.search(r'\[\[EGO_REPLY\]\]([\s\S]*?)\[\[/EGO_REPLY\]\]', t)
print(m.group(1).strip() if m else '')
"
  exit 0
fi

REASON=$(printf '%s' "$RAW" | python3 -c "
import sys, re
t = sys.stdin.read()
m = re.search(r'\[\[EGO_ERROR\]\]([\s\S]*?)\[\[/EGO_ERROR\]\]', t)
print((m.group(1) if m else t.strip().replace('\n',' '))[:160])
")
echo "[ego-router] $AI 失败: $REASON" >&2
exit 3
