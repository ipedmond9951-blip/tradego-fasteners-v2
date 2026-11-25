#!/usr/bin/env python3
"""检查正文里混进来的"半截模板"——可见乱码，不是样式问题。

模板批量替换时，`<a href=... class="text-primary-600 hover:text-primary-800 ...">`
的片段会被截断成 `lass="text-primary-600…"`、`ass="…"`、`s="…"` 落在正文纯文本里，
渲染成页面上肉眼可见的一串垃圾字符（"washers lass="text-primary-600 hover:…"）。

判定：先剥掉合法的标签，再看剩下的文本里还有没有样式串或引号残片。
用法：python3 scripts/check-stray-markup.py [--slug X] [--show N]
"""
import argparse
import glob
import json
import re

TAGS = re.compile(r"<a [^>]*>|</a>|<p>|</p>|<strong>|</strong>|<em>|</em>|<ul>|</ul>|<li>|</li>"
                  r"|<ol>|</ol>|<table[^>]*>|</table>|<tr[^>]*>|</tr>|<td[^>]*>|</td>|<th[^>]*>|</th>"
                  r"|<h[1-6][^>]*>|</h[1-6]>|<br\s*/?>|<span[^>]*>|</span>")
GARBAGE = re.compile(r"(text-primary-\d|hover:text-|underline-offset|lass=\x22|ss=\x22|ass=\x22|=\"text-|>\s*washers\s+lass)")
LOCALES = ["en", "zh", "es", "fr", "pt", "ru", "ja", "de", "hi", "ar"]


def scan(path, slug_filter):
    d = json.load(open(path, encoding="utf-8"))
    if d.get("redirectTo"):
        return []
    if slug_filter and d.get("slug") != slug_filter:
        return []
    rows = []
    for i, s in enumerate(d.get("sections") or []):
        for loc in LOCALES:
            body = (s.get("body") or {}).get(loc) or ""
            if not body:
                continue
            plain = TAGS.sub(" ", body)
            n = len(GARBAGE.findall(plain))
            if n:
                rows.append((d["slug"], i, loc, n))
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--show", type=int, default=20)
    a = ap.parse_args()
    rows = []
    for p in sorted(glob.glob("content/articles/*.json")):
        rows += scan(p, a.slug)
    if not rows:
        print("✅ 正文无半截模板残留")
        return 0
    by_article = {}
    for slug, i, loc, n in rows:
        by_article.setdefault(slug, []).append((i, loc, n))
    print(f"❌ {len(by_article)} 篇正文含半截模板残留（共 {sum(r[3] for r in rows)} 处）")
    for slug, items in list(by_article.items())[: a.show]:
        total = sum(x[2] for x in items)
        locs = "/".join(sorted({x[1] for x in items}))
        print(f"  {total:>4} 处  {locs:<5} {slug}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
