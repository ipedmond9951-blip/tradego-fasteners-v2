#!/bin/bash
# 护栏自检：证明预算闸门真的「拦得住」，而不是任何情况下都打印"放行"。
# 背景：2026-11-25 一天真实构建推到 10 次，闸门因为 fail-open（API 读不到就跳过拦截）全程没拦。
# 用法：bash scripts/vercel-gate-selftest.sh   （0=护栏正常，1=护栏坏了）
set -u
FAIL=0
ok()  { echo "  ✅ $1"; }
bad() { echo "  ❌ $1"; FAIL=1; }

# 1) 预算压到 0 → 必须拦（不依赖 API 是否可读/当日是否已有部署）
DEPLOY_DAILY_LIMIT=0 DEPLOY_BUDGET_READONLY=1 bash scripts/deploy-budget.sh >/dev/null 2>&1
rc=$?; [ "$rc" -eq 1 ] && ok "预算=0 时拦下（fail-closed）" || bad "预算=0 时没拦（rc=$rc，护栏 fail-open）"

# 2) 预算放大 → 必须放行（防止修成"永远拦"）
DEPLOY_DAILY_LIMIT=9999 DEPLOY_BUDGET_READONLY=1 bash scripts/deploy-budget.sh >/dev/null 2>&1
rc=$?; [ "$rc" -eq 0 ] && ok "预算充足时放行" || bad "预算充足仍被拦（rc=$rc，闸门写死）"

# 3) 逃生口有效
DEPLOY_FORCE=1 bash scripts/deploy-budget.sh >/dev/null 2>&1
rc=$?; [ "$rc" -eq 0 ] && ok "DEPLOY_FORCE=1 可放行" || bad "DEPLOY_FORCE=1 失效（rc=$rc）"

# 4) 统一取数脚本可用（promote/prune/audit/ledger 都依赖它）
tmp="$(mktemp)"
python3 scripts/vercel_deployments.py --limit 5 > "$tmp" 2>/dev/null
if python3 - "$tmp" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert isinstance(d.get("deployments"), list) and len(d["deployments"]) > 0, "无部署记录"
PY
then ok "vercel_deployments.py 取数正常"; else bad "vercel_deployments.py 取数失败（403/空结果）"; fi
rm -f "$tmp"

# 5) 预推送钩子存在且可用
if [ -x .githooks/pre-push ] && [ "$(git config core.hooksPath)" = ".githooks" ]; then
  ok "pre-push 钩子已挂载"
else
  bad "pre-push 未挂载（git config core.hooksPath .githooks）"
fi

[ "$FAIL" -eq 0 ] && echo "✅ 护栏自检通过" || echo "❌ 护栏自检失败"
exit "$FAIL"
