#!/bin/bash
# minimax-quick.sh - Direct MiniMax API for short prompts (10-30s vs 60-180s for CDP)
# Usage: minimax-quick.sh "prompt" [model] [max_tokens]
# Output: AI reply text via stdout, errors via stderr

PROMPT="$1"
MODEL="${2:-MiniMax-M2.7-highspeed}"
MAX_TOKENS="${3:-1500}"  # 2026-06-20: M2.7 eats 200+ tokens on thinking, default to 1500 for short prompts

if [ -z "$PROMPT" ]; then
  echo "usage: minimax-quick.sh \"prompt\" [model] [max_tokens]" >&2
  exit 1
fi

# Write prompt to file to avoid shell escape hell, then python reads from file
PROMPT_FILE=$(mktemp -t minimax-prompt.XXXXXX)
printf '%s' "$PROMPT" > "$PROMPT_FILE"
trap "rm -f $PROMPT_FILE" EXIT

python3 - "$PROMPT_FILE" "$MODEL" "$MAX_TOKENS" <<'PYEOF'
import os, json, sys, urllib.request

prompt_file = sys.argv[1]
model = sys.argv[2]
max_tokens = int(sys.argv[3])

with open(prompt_file, 'r', encoding='utf-8') as f:
    prompt = f.read()

api_key = os.environ.get('MINIMAX_API_KEY', '')

if not api_key:
    print("MINIMAX_API_KEY not set", file=sys.stderr)
    sys.exit(2)

data = {
    "model": model,
    "max_tokens": max_tokens,
    "messages": [{"role": "user", "content": prompt}]
}

req = urllib.request.Request(
    "https://api.minimaxi.com/anthropic/v1/messages",
    data=json.dumps(data).encode('utf-8'),
    headers={
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01"
    }
)

try:
    with urllib.request.urlopen(req, timeout=180) as resp:
        d = json.loads(resp.read().decode('utf-8'))
        if 'content' in d and d['content']:
            for c in d['content']:
                if c.get('type') == 'text':
                    print(c['text'])
                elif c.get('type') == 'thinking' and len(d['content']) == 1:
                    # 2026-06-20 fix: thinking-only response, still print thinking
                    print(c.get('thinking', ''))
        else:
            print(json.dumps(d)[:500], file=sys.stderr)
            sys.exit(1)
except Exception as e:
    print(f"API error: {e}", file=sys.stderr)
    sys.exit(1)
PYEOF
