#!/usr/bin/env python3
"""vercel-token.py — 输出一个当前可用的 Vercel token（CLI 形态，供 shell 脚本取用）。

逻辑全部在 scripts/vercel_auth.py（唯一取 token 入口，会按需让 CLI 续期）。
任何脚本都不许自己 open(auth.json) 拿 token —— auth.json 里的 token 会过期，只在 CLI
有联网动作时才续期，直接读文件十有八九拿到过期的（2026-11-26 实测踩过）。

用法：
  python3 scripts/vercel-token.py            # 需要时自动续期
  python3 scripts/vercel-token.py --force    # 强制续期（API 报 invalidToken 后用）

shell 里的标准写法：
  TOKEN="${VERCEL_TOKEN:-$(python3 "$(dirname "$0")/vercel-token.py")}"
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vercel_auth import get_token  # noqa: E402


def main():
    force = "--force" in sys.argv
    try:
        print(get_token(force=force))
    except RuntimeError as e:
        print(f"ERR: {e}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
