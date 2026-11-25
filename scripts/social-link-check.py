#!/usr/bin/env python3
"""六平台主页可达性巡检。

站首页把 IG / FB / X / YouTube / Quora / Reddit 六个按钮挂出去了，任何一个主页被
平台下线、改名或封禁，首页就会挂一个死链。这个脚本每天跑一次，只判断"账号主页
还在不在"：

- 404 / 410 / DNS 解析失败  -> FAIL（真死了，必须换链接）
- 400 / 403 / 429 / 5xx      -> WARN（反爬或平台抽风，curl 拿不到真状态，不是死链）
- 200 / 3xx                  -> OK

FB 400、IG 429、Quora 403、Reddit 403 是这些平台对无 cookie 请求的稳定反应，
所以不能把 4xx 一律当失败；判死只看 404/410 和域名消失。要确认某平台到底活着，
用真浏览器打开（见 `browser-use` / ego-browser）。

用法：
  python3 scripts/social-link-check.py            # 打印结果
  python3 scripts/social-link-check.py --json     # 机器可读
  python3 scripts/social-link-check.py --quiet    # 只在非 OK 时输出
退出码：有 FAIL 时 1，否则 0（上游读不到数据即失败，fail-closed）。
"""

from __future__ import annotations

import argparse
import json
import socket
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta

URLS = {
    "instagram": "https://www.instagram.com/tradegofasteners/",
    "facebook": "https://www.facebook.com/profile.php?id=61596617862433",
    "x": "https://x.com/tradego_fast",
    "youtube": "https://www.youtube.com/@TradeGoFasteners",
    "quora": "https://www.quora.com/profile/Edmond-Zhang-18",
    "reddit": "https://www.reddit.com/user/TradeGoFasteners/",
}

DEAD_CODES = {404, 410}
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}
TIMEOUT = 15
CST = timezone(timedelta(hours=8))


def probe(url: str) -> dict:
    host = url.split("//")[-1].split("/")[0]
    try:
        socket.getaddrinfo(host, 443)
    except socket.gaierror as exc:
        return {"status": "FAIL", "code": None, "note": f"DNS 解析失败: {exc}"}

    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            code = resp.status
    except urllib.error.HTTPError as exc:
        code = exc.code
    except Exception as exc:  # 连接被重置、超时等
        return {"status": "FAIL", "code": None, "note": f"请求失败: {type(exc).__name__}"}

    if code in DEAD_CODES:
        return {"status": "FAIL", "code": code, "note": "页面不存在/已删除"}
    if code >= 500 or code in (400, 403, 429):
        return {"status": "WARN", "code": code, "note": "反爬或平台抖动，非死链"}
    return {"status": "OK", "code": code, "note": ""}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    results = {name: dict(url=url, **probe(url)) for name, url in URLS.items()}
    fails = [n for n, r in results.items() if r["status"] == "FAIL"]

    if args.json:
        print(json.dumps({"checked_at": datetime.now(CST).isoformat(timespec="seconds"),
                          "results": results, "fail": fails}, ensure_ascii=False, indent=2))
    elif not args.quiet or fails:
        for name, r in results.items():
            line = f"{r['status']:4} {name:9} {r['code'] or '-':>4}  {r['url']}"
            if r["note"]:
                line += f"  ({r['note']})"
            print(line)
        print(("FAIL: " + ", ".join(fails)) if fails else "全部可达（4xx 已在 WARN 中标注）")

    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
