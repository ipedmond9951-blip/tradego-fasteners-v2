#!/bin/bash
# doubao-quick.sh - Direct Volcano Ark API for 豆包 (NO thinking, fast & reliable)
# Usage: doubao-quick.sh "prompt" [model] [max_tokens]
# Output: AI reply text via stdout, errors via stderr
#
# 2026-07-07 21:00 创建 - boss 7/6 07:46 永禁 minimax 兜底, ai-router CDP 7/6 18:51 起挂
# 解决: 走 Volcano Ark 官方 API (volcengine-agent-plan), 不依赖 Chrome/Playwright
# 环境变量: VOLCANO_ENGINE_API_KEY (用户已配, minimax-quick.sh 同一 key set)
#
# 模型选择:
#   - doubao-seed-1-6-250615 (lite, fast ~5-15s) - 默认
#   - doubao-seed-1-6-thinking-250615 (深度思考, 慢但精) - 写文用
#   - doubao-1-5-pro-32k-250115 (备选)

PROMPT="$1"
MODEL="${2:-doubao-seed-1-6-250615}"
MAX_TOKENS="${3:-4000}"

if [ -z "$PROMPT" ]; then
  echo "usage: doubao-quick.sh \"prompt\" [model] [max_tokens]" >&2
  exit 1
fi

PROMPT_FILE=$(mktemp -t doubao-prompt.XXXXXX)
printf '%s' "$PROMPT" > "$PROMPT_FILE"
trap "rm -f $PROMPT_FILE" EXIT

python3 - "$PROMPT_FILE" "$MODEL" "$MAX_TOKENS" <<'PYEOF'
import os, json, sys, urllib.request, urllib.error

prompt_file = sys.argv[1]
model = sys.argv[2]
max_tokens = int(sys.argv[3])

with open(prompt_file, 'r', encoding='utf-8') as f:
    prompt = f.read()

api_key = os.environ.get('VOLCANO_ENGINE_API_KEY', '')

if not api_key:
    print("VOLCANO_ENGINE_API_KEY not set", file=sys.stderr)
    sys.exit(2)

# Volcano Ark OpenAI-compatible endpoint (Doubao)
data = {
    "model": model,
    "max_tokens": max_tokens,
    "messages": [{"role": "user", "content": prompt}],
    "temperature": 0.7,
    "stream": False
}

req = urllib.request.Request(
    "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
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
