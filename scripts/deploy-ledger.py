#!/usr/bin/env python3
"""deploy-ledger.py — 真实部署台账（按北京时间计日）

背景（2026-11-25）：
`vercel-audit.sh` 原先用 API 列表里"现存"的部署数当"当日部署次数"。
剪枝删掉旧部署后，5 次真实构建会显示成 3 次，闸门被自己的清理动作洗白。
台账把每条部署 uid 落盘持久化，删除部署也不影响计数。

用法：
  python3 scripts/deploy-ledger.py sync                 # 从 Vercel API 补账（幂等，按 uid 去重）
  python3 scripts/deploy-ledger.py count [--date DATE]  # 打印当日构建数（默认今天，北京时间）
  python3 scripts/deploy-ledger.py record --sha SHA --kind build|pushless
  python3 scripts/deploy-ledger.py list --date DATE

退出码：0 正常；1 参数/网络错误。
"""
import argparse
import datetime as dt
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER = os.path.join(ROOT, "logs", "deploy-history.jsonl")
AUTH = os.path.expanduser("~/Library/Application Support/com.vercel.cli/auth.json")
PROJECT_ID = "prj_3D7E2O74NPWtxH9vQM5zWkGy9lVZ"
TEAM_ID = "team_zpNihQv4m6nG8EPZqu079v8k"
CST = dt.timezone(dt.timedelta(hours=8))


def today():
    return dt.datetime.now(CST).strftime("%Y-%m-%d")


def token():
    with open(AUTH) as f:
        return json.load(f)["token"]


def load():
    rows = []
    if os.path.exists(LEDGER):
        with open(LEDGER) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return rows


def append(rows):
    with open(LEDGER, "a") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


def api(path_qs):
    req = urllib.request.Request(
        f"https://api.vercel.com{path_qs}",
        headers={"Authorization": f"Bearer {token()}"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def sync():
    """把 API 里能看到的部署 uid 补进台账（不覆盖已有记录）。"""
    seen = {r.get("uid") for r in load()}
    added = []
    for page in range(1, 4):  # 最近 300 条足够覆盖一个月
        data = api(
            f"/v6/deployments?projectId={PROJECT_ID}&teamId={TEAM_ID}&limit=100&page={page}"
        )
        deployments = data.get("deployments", [])
        if not deployments:
            break
        for d in deployments:
            uid = d.get("uid")
            if not uid or uid in seen:
                continue
            ts = dt.datetime.fromtimestamp(d["createdAt"] / 1000, CST)
            rec = {
                "uid": uid,
                "sha": (d.get("meta") or {}).get("githubCommitSha", "")[:12],
                "target": d.get("target"),
                "state": d.get("state"),
                "ts": ts.isoformat(timespec="seconds"),
                "date": ts.strftime("%Y-%m-%d"),
                "kind": "build",
                "source": "api",
            }
            added.append(rec)
            seen.add(uid)
    if added:
        append(added)
    print(f"ledger: +{len(added)} 条，共 {len(seen)} 条")


def count(date):
    rows = load()
    uids = {
        r.get("uid")
        for r in rows
        if r.get("date") == date and r.get("kind") == "build" and r.get("state") != "CANCELED"
    }
    print(len(uids))


def record(sha, kind):
    now = dt.datetime.now(CST)
    rec = {
        "uid": f"local-{now.strftime('%Y%m%d%H%M%S')}-{sha}",
        "sha": sha,
        "target": "production",
        "state": "PUSHED",
        "ts": now.isoformat(timespec="seconds"),
        "date": now.strftime("%Y-%m-%d"),
        "kind": kind,
        "source": "flush",
    }
    append([rec])
    print(f"ledger: 记 {kind} {sha}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("cmd", choices=["sync", "count", "record", "list"])
    p.add_argument("--date", default=today())
    p.add_argument("--sha", default="")
    p.add_argument("--kind", default="build", choices=["build", "pushless"])
    a = p.parse_args()
    if a.cmd == "sync":
        sync()
    elif a.cmd == "count":
        count(a.date)
    elif a.cmd == "record":
        record(a.sha, a.kind)
    elif a.cmd == "list":
        for r in load():
            if r.get("date") == a.date:
                print(r["ts"], r.get("kind"), r.get("sha"), r.get("state"))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # 网络/凭据问题不静默
        print(f"deploy-ledger error: {e}", file=sys.stderr)
        sys.exit(1)
