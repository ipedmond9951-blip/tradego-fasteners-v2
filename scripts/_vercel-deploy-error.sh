#!/bin/bash
# _vercel-deploy-error.sh - 取某条部署的失败原因(errorCode/readyState)，供 vercel-audit.sh 调用
# 用法: bash scripts/_vercel-deploy-error.sh dpl_xxx
set -u
UID_ARG="${1:-}"
[ -z "$UID_ARG" ] && exit 0
AUTH="$HOME/Library/Application Support/com.vercel.cli/auth.json"
python3 - "$AUTH" "$UID_ARG" <<'PY'
import json, sys, urllib.request
auth, uid = sys.argv[1], sys.argv[2]
tok = json.load(open(auth))["token"]
req = urllib.request.Request("https://api.vercel.com/v13/deployments/" + uid,
                             headers={"Authorization": "Bearer " + tok})
d = json.load(urllib.request.urlopen(req))
print(d.get("errorCode") or d.get("readyState") or "")
PY
