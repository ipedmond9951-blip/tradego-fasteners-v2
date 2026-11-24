#!/bin/bash
# oc_openrouter_enable.sh —— 一步把 OpenRouter 免费额度接进 OpenClaw（2026-11-24）
#
# 前置：openclaw.json 里已写好 provider "openrouter"（baseUrl https://openrouter.ai/api/v1，
#       api=openai-completions，模型含 openrouter/free 与几个 :free slug）。
# 本脚本做三件事：存 key → 把 openrouter/free 挂进 fallback 链 → 真实调用验证。
#
# 用法：bash scripts/oc_openrouter_enable.sh sk-or-v1-xxxx
set +e
KEY="${1:-}"
if [ -z "$KEY" ]; then
  echo "用法: bash $0 <sk-or-v1-...>" >&2
  exit 1
fi

OC_NODE="$HOME/.nvm/versions/node/v24.22.3/bin/node"
OC_ENTRY="$HOME/.nvm/versions/node/v24.22.3/lib/node_modules/openclaw/dist/index.js"
if [ ! -f "$OC_ENTRY" ]; then
  OC_ENTRY="$(ls -d "$HOME"/.nvm/versions/node/*/lib/node_modules/openclaw/dist/index.js 2>/dev/null | sort -V | tail -1)"
fi
oc() { "$OC_NODE" "$OC_ENTRY" "$@"; }

echo "== 1/3 保存 key 到 main agent =="
# 多 agent 环境必须指定 owner，否则报 AGENT_SELECTION_REQUIRED
AGENT_ID="${OPENCLAW_AGENT:-main}"
printf '%s\n' "$KEY" | oc models auth paste-api-key --provider openrouter --agent "$AGENT_ID" 2>&1 | tail -3

echo "== 2/3 挂进 fallback 链（幂等）=="
oc models fallbacks list 2>/dev/null | grep -q "openrouter/free" \
  || oc models fallbacks add openrouter/free 2>&1 | tail -2

echo "== 3/3 真实调用验证 =="
oc infer model run --model openrouter/free --prompt "只回复两个字：在线" --json 2>&1 \
  | python3 -c "
import sys, json, re
raw = sys.stdin.read()
m = re.search(r'\{[\s\S]*\}', raw)
try:
    d = json.loads(m.group(0)) if m else {}
except Exception:
    d = {}
if d.get('ok'):
    print('✅ openrouter/free 通了：', (d['outputs'][0]['text'] if d.get('outputs') else '')[:60],
          '| model=', d.get('model'), '| cost=', (d.get('usage') or {}).get('cost'))
else:
    print('❌ 未通：', str((d.get('error') or {}).get('message') or raw[-160:])[:160])
    sys.exit(1)
"
