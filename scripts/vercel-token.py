#!/usr/bin/env python3
"""vercel-token.py — 输出一个当前可用的 Vercel token（供脚本取数用）。

坑（2026-11-26 实测）：`~/Library/Application Support/com.vercel.cli/auth.json` 里的 token
会过期（`expiresAt`，秒级）。它只在 CLI 有联网动作时才自动续期，所以后台脚本直接读文件
常常读到过期 token，API 返回 `invalidToken` → 预算脚本只能回退本地台账、审计读不到数。

做法：读文件前先看 expiresAt，快过期或收到 401/403 时跑一次 `vercel whoami`（CLI 会自己续期），
再重读文件。不落盘、不打印其它字段，只输出 token 本身。

用法：
  python3 scripts/vercel-token.py            # 需要时自动续期
  python3 scripts/vercel-token.py --force    # 强制续期（API 报 invalidToken 后用）
"""
import json
import os
import subprocess
import sys
import time

AUTH = os.path.expanduser("~/Library/Application Support/com.vercel.cli/auth.json")
SKEW = 300  # 提前 5 分钟算过期，避免刚好卡在边界


def _load():
    try:
        return json.load(open(AUTH))
    except Exception:
        return {}


def _fresh(d):
    exp = d.get("expiresAt")
    if not exp:
        return False
    return time.time() < float(exp) - SKEW


def _refresh():
    # whoami 是最轻的联网动作，CLI 会在需要时用 refreshToken 换新 token 写回 auth.json
    subprocess.run(["vercel", "whoami"], capture_output=True, timeout=60)


def main():
    force = "--force" in sys.argv
    d = _load()
    if force or not d.get("token") or not _fresh(d):
        _refresh()
        d = _load()
    tok = d.get("token")
    if not tok:
        print("ERR: 没有可用的 Vercel token（在终端里跑一次 vercel login）", file=sys.stderr)
        return 2
    print(tok)
    return 0


if __name__ == "__main__":
    sys.exit(main())
