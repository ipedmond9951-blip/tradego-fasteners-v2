#!/usr/bin/env python3
"""check-alias-redirects.py — 合并文章的旧 slug 必须是“永久跳转直达”

背景（2026-11-25）：sitemap 从 4332 降到 4092，差值正好是 15 篇合并文章 × 16 个 locale URL。
本该是无害的 301 收口，但实测 `senegal-fastener-market-complete-guide` 走的是
307（临时）→ 308（补斜杠）→ 200，两跳且第一跳不是永久跳转。
原因是它没登记进 next.config 的手工 redirects，落到了页面级 redirect()。

本脚本对每篇 redirectTo 文章做线上校验：
  - 首跳必须是 301/308（永久）
  - Location 必须直接指向 canonical 且带尾斜杠（不允许中间再跳一次）
  - 最终必须 200

退出码：0 全部 OK；1 有坏跳转
用法：python3 scripts/check-alias-redirects.py [--base https://www.tradego-fasteners.com]
"""

import glob
import json
import sys
import urllib.error
import urllib.request

BASE = "https://www.tradego-fasteners.com"
if "--base" in sys.argv:
    BASE = sys.argv[sys.argv.index("--base") + 1]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: D401
        return None


opener = urllib.request.build_opener(NoRedirect)


def head_status(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "tradego-alias-check"})
    try:
        resp = opener.open(req, timeout=15)
        return resp.status, resp.headers.get("location", "") or ""
    except urllib.error.HTTPError as exc:
        return exc.code, exc.headers.get("location", "") or ""


def main() -> int:
    bad = []
    rows = []
    for p in sorted(glob.glob("content/articles/*.json")):
        with open(p, encoding="utf-8") as fh:
            data = json.load(fh)
        slug, target = data.get("slug"), data.get("redirectTo")
        if not slug or not target:
            continue
        url = f"{BASE}/en/industry/{slug}/"
        code, loc = head_status(url)
        direct = loc.endswith(f"/industry/{target}/") or f"/industry/{target}/" in loc
        final_code = 0
        if code in (301, 308) and direct:
            final_code, _ = head_status(f"{BASE}/en/industry/{target}/")
        status = "OK" if (code in (301, 308) and direct and final_code == 200) else "BAD"
        if status == "BAD":
            bad.append((slug, target, code, loc, final_code))
        rows.append(f"  {status} {code:>3} {slug} -> {target}{'' if direct else f' (Location={loc})'}")

    print("\n".join(rows))
    if bad:
        print(f"\n❌ {len(bad)} 条旧 slug 跳转不合格（应为首跳 301/308 直达 canonical 且带尾斜杠）")
        for slug, target, code, loc, final in bad:
            print(f"   - {slug}: code={code} location={loc or '-'} canonical={final or '-'} -> {target}")
        return 1
    print(f"✅ {len(rows)} 条旧 slug 全部 301/308 直达 canonical")
    return 0


if __name__ == "__main__":
    sys.exit(main())
