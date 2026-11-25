#!/usr/bin/env python3
# _prev-prod-sha.py - 打印线上最近一次 READY 生产部署的 commit sha（供 deploy-flush/audit 判定构建必要性）
import json, os, subprocess, sys

PROJECT_ID = "prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
AUTH = os.path.expanduser("~/Library/Application Support/com.vercel.cli/auth.json")

HELPER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vercel_deployments.py")
try:
    # 2026-11-25: 带 projectId 的接口对 CLI token 返回 403，统一走本地过滤的取数脚本
    out = subprocess.check_output([sys.executable, HELPER, "--limit", "20", "--target", "production"], timeout=25)
    for d in json.loads(out).get("deployments", []):
        if d.get("state") == "READY" and d.get("target") == "production":
            print((d.get("meta") or {}).get("githubCommitSha", ""))
            break
except Exception:
    print("")
