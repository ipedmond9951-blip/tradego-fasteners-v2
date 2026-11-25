#!/usr/bin/env python3
"""列出本项目 deployments，输出与 Vercel API 同形的 {"deployments": [...]}。

为什么不用带 projectId 的接口：项目挂在团队下，CLI token 读 `?projectId=` 会 403；
`?limit=100` 拉全量再本地按 projectId/name 过滤是当前唯一稳定的取数方式。

用法：python3 scripts/vercel_deployments.py [--limit N] [--target production]
"""
import argparse, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vercel_auth import api_get  # 唯一取 token 入口（auth.json 会过期，见 vercel_auth.py）

PROJECT_ID = "prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
PROJECT_NAME = "tradego-fasteners"


def list_deployments(limit=100, target=None):
    data = api_get("https://api.vercel.com/v6/deployments?limit=100")
    items = [
        d for d in data.get("deployments", [])
        if d.get("projectId") == PROJECT_ID or d.get("name") == PROJECT_NAME
    ]
    items.sort(key=lambda x: x.get("createdAt", 0), reverse=True)
    if target:
        items = [d for d in items if (d.get("target") or "production") == target]
    return {"deployments": items[:limit]}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=20)
    ap.add_argument("--target", default=None)
    a = ap.parse_args()
    print(json.dumps(list_deployments(a.limit, a.target), ensure_ascii=False))
