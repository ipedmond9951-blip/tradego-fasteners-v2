#!/usr/bin/env python3
# _prev-prod-sha.py - 打印线上最近一次 READY 生产部署的 commit sha（供 deploy-flush/audit 判定构建必要性）
import json, os, urllib.request

PROJECT_ID = "prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
AUTH = os.path.expanduser("~/Library/Application Support/com.vercel.cli/auth.json")

try:
    token = json.load(open(AUTH))["token"]
    req = urllib.request.Request(
        "https://api.vercel.com/v6/deployments?projectId=%s&limit=10" % PROJECT_ID,
        headers={"Authorization": "Bearer " + token},
    )
    for d in json.load(urllib.request.urlopen(req, timeout=15)).get("deployments", []):
        if d.get("state") == "READY" and d.get("target") == "production":
            print((d.get("meta") or {}).get("githubCommitSha", ""))
            break
except Exception:
    print("")
