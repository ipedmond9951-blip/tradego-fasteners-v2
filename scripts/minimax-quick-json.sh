#!/bin/bash
# minimax-quick-json.sh - minimax 强制 JSON 输出 (无 thinking)
# Usage: minimax-quick-json.sh "prompt" [model] [max_tokens]
PROMPT="$1"
MODEL="${2:-MiniMax-M2.7}"
MAX_TOKENS="${3:-4000}"

PROMPT_FILE=$(mktemp -t minimax-json-prompt.XXXXXX)
printf '%s' "$PROMPT" > "$PROMPT_FILE"
trap "rm -f $PROMPT_FILE" EXIT

python3 - "$PROMPT_FILE" "$MODEL" "$MAX_TOKENS" <<'PYEOF'
import os, json, sys, urllib.request
prompt_file = sys.argv[1]
model = sys.argv[2]
max_tokens = int(sys.argv[3])
with open(prompt_file, 'r', encoding='utf-8') as f: prompt = f.read()
api_key = os.environ.get('MINIMAX_API_KEY', '')
if not api_key:
    print("MINIMAX_API_KEY not set", file=sys.stderr)
    sys.exit(2)

# 2026-07-22 19:55 修复: 加 system message 强制 JSON-only
data = {
    "model": model,
    "max_tokens": max_tokens,
    "system": "You are a strict JSON API. You MUST output ONLY a valid JSON object. No thinking, no analysis, no preamble, no markdown. Your response must start with { and end with }.",
    "messages": [{"role": "user", "content": prompt}]
}
req = urllib.request.Request(
    "https://api.minimaxi.com/anthropic/v1/messages",
    data=json.dumps(data).encode('utf-8'),
    headers={"Content-Type": "application/json", "x-api-key": api_key, "anthropic-version": "2023-06-01"}
)
try:
    with urllib.request.urlopen(req, timeout=180) as resp:
        d = json.loads(resp.read().decode('utf-8'))
        if 'content' in d and d['content']:
            for c in d['content']:
                if c.get('type') == 'text':
                    print(c['text'])
                    sys.exit(0)
            # If only thinking, error
            print(f"Only thinking response, no text", file=sys.stderr)
            sys.exit(1)
        else:
            print(json.dumps(d)[:500], file=sys.stderr)
            sys.exit(1)
except Exception as e:
    print(f"API error: {e}", file=sys.stderr)
    sys.exit(1)
PYEOF
