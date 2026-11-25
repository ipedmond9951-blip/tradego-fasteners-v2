#!/usr/bin/env python3
"""校验器自检：用几份"故意写坏"的文章，确认该报的问题真的报出来。

来历：2026-11-25 有一次并线把认证检查插进了 `except` 分支，后面紧跟一个
`return`，其余检查全成了死代码——脚本照常运行、全库显示"完全干净"，
实际什么都没查。这种"假通过"靠读输出看不出来，只能靠反向用例兜住。

用法:
    python3 scripts/contract_selftest.py        # 全部用例通过 exit 0
"""
import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import content_contract as cc  # noqa: E402

BASE = {
    "slug": "selftest",
    "category": "guide",
    "date": "2026-11-25",
    "updated": "2026-11-25",
    "readTime": "8",
    "image": "/images/test.jpg",
    "title": {lg: "x" for lg in cc.LANGS},
    "description": {lg: "x" for lg in cc.LANGS},
    "metaDescription": {lg: "x" for lg in cc.LANGS},
    "keywords": "a, b, c, d, e",
    "sections": [
        {"id": "s1", "heading": {lg: "head" for lg in cc.LANGS}, "body": {lg: "" for lg in cc.LANGS}}
    ],
}


def run(payload):
    d = json.loads(json.dumps(BASE))
    payload(d)
    tmp = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8")
    json.dump(d, tmp, ensure_ascii=False)
    tmp.close()
    try:
        _, issues, _ = cc.check_article(tmp.name, "")
        rows = issues.block + issues.warn
        return {row["check"] for row in rows}
    finally:
        os.unlink(tmp.name)



CASES = []


def case(name, expect, mutate):
    CASES.append((name, expect, mutate))


def placeholder(d):
    d["sections"][0]["body"]["en"] = "<p>Content coming soon</p>"


def dirty(d):
    d["sections"][0]["body"] = {lg: "<p>undefined</p>" for lg in cc.LANGS}


def bad_date(d):
    d["updated"] = "2026-01-01"


def broken_json_text(d):
    d["sections"][0]["body"]["zh"] = "<p>第三\ufffd年</p>"


case("占位句要被抓", "placeholder", placeholder)
case("undefined 要被抓", "dirty-text", dirty)
case("updated 早于 date 要被抓", "date", bad_date)
case("乱码要被抓", "encoding", broken_json_text)


def main():
    quiet = "--quiet" in sys.argv
    fails = 0
    for name, expect, mutate in CASES:
        got = run(mutate)
        if expect in got:
            if not quiet:
                print(f"✓ {name}（命中 {expect}）")
        else:
            fails += 1
            print(f"✗ {name}：期望 {expect}，实际 {sorted(got) or '无问题'}")
    if fails:
        print(f"\n{fails} 个用例失败 —— 校验器可能已经假通过，先修脚本再谈内容。")
        return 1
    print(f"\n全部 {len(CASES)} 个用例通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
