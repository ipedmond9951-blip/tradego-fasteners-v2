#!/bin/bash
# deepseek-quick.sh - Direct DeepSeek API (NO thinking, fast & reliable)
# Usage: deepseek-quick.sh "prompt" [model] [max_tokens]
# Output: AI reply text via stdout, errors via stderr
#
# 2026-07-07 21:00 创建 - boss 7/6 07:46 永禁 minimax 兜底, ai-router CDP 7/6 18:51 起挂
# 解决: 走 DeepSeek 官方 API, 不依赖 Chrome/Playwright
# 环境变量: DEEPSEEK_API_KEY
#
# 静默期: 2026-06-20 → 2026-07-04 (已结束, 7/5 起可用)
# 模型选择:
#   - deepseek-chat (V3 fast) - 默认
#   - deepseek-reasoner (R1 thinking) - 复杂推理

PROMPT="$1"
MODEL="${2:-deepseek-chat}"
MAX_TOKENS="${3:-4000}"

if [ -z "$PROMPT" ]; then
  echo "usage: deepseek-quick.sh \"prompt\" [model] [max_tokens]" >&2
  exit 1
fi

PROMPT_FILE=$(mktemp -t ds-prompt.XXXXXX)
printf '%s' "$PROMPT" > "$PROMPT_FILE"
trap "rm -f $PROMPT_FILE" EXIT

python3 - "$PROMPT_FILE" "$MODEL" "$MAX_TOKENS" <<'PYEOF'
import os, json, sys, urllib.request, urllib.error

prompt_file = sys.argv[1]
model = sys.argv[2]
max_tokens = int(sys.argv[3])

with open(prompt_file, 'r', encoding='utf-8') as f:
    prompt = f.read()

api_key = os.environ.get('DEEPSEEK_API_KEY', '')

if not api_key:
    print("DEEPSEEK_API_KEY not set", file=sys.stderr)
    sys.exit(2)

data = {
    "model": model,
    "max_tokens": max_tokens,
    "messages": [{"role": "user", "content": prompt}],
    "temperature": 0.7,
    "stream": False
}

req = urllib.request.Request(
    "https://api.deepseek.com/v1/chat/completions",
    data=json.dumps(data).encode('utf-8'),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
)

try:
    with urllib.request.urlopen(req, timeout=180) as resp:
        body = resp.read().decode('utf-8')
        d = json.loads(body)
        if 'choices' in d and d['choices']:
            content = d['choices'][0].get('message', {}).get('content', '')
            if content:
                print(content)
                sys.exit(0)
            else:
                print(f"Empty content in response: {body[:500]}", file=sys.stderr)
                sys.exit(1)
        elif 'error' in d:
            print(f"API error: {d['error']}", file=sys.stderr)
            sys.exit(1)
        else:
            print(f"Unexpected response: {body[:500]}", file=sys.stderr)
            sys.exit(1)
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8', errors='replace')
    print(f"HTTP {e.code}: {body[:500]}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"API error: {e}", file=sys.stderr)
    sys.exit(1)
PYEOF
