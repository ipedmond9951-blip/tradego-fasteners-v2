#!/bin/bash
# _vercel-deploy-error.sh - 取某条部署的失败原因(errorCode/readyState)，供 vercel-audit.sh 调用
# 用法: bash scripts/_vercel-deploy-error.sh dpl_xxx
set -u
UID_ARG="${1:-}"
[ -z "$UID_ARG" ] && exit 0
TOKEN="${VERCEL_TOKEN:-$(python3 "$(dirname "$0")/vercel-token.py" 2>/dev/null || true)}"
[ -z "$TOKEN" ] && exit 0
python3 - "$TOKEN" "$UID_ARG" <<'PY'
import json, sys, urllib.request
tok, uid = sys.argv[1], sys.argv[2]
req = urllib.request.Request("https://api.vercel.com/v13/deployments/" + uid,
                             headers={"Authorization": "Bearer " + tok})
d = json.load(urllib.request.urlopen(req))
print(d.get("errorCode") or d.get("readyState") or "")
PY
