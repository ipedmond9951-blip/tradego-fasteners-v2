#!/usr/bin/env python3
"""把补写好的正文段落追加到文章最后一个已有正文的 section，并回显计数。

为什么要有这个脚本：批量补正文时人工按"字数感"写，实际汉字/词数常比目标少
30%~40%，写完必须立刻回读计数才能判断要不要补第二轮。此脚本因此做成
"幂等 + 回显"，同一个人可以把同一批反复追加，直到计数过线。

用法:
    python3 scripts/append_body.py patch.json            # 中文
    python3 scripts/append_body.py patch.json --lang en  # 英文
patch.json 形如 {"slug": "<p>段落</p><p>段落</p>"}。
"""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
TAG = re.compile(r"<[^>]+>")
WORD = re.compile(r"[A-Za-z0-9'\u2019\-]+")


def count_zh(text):
    return len([c for c in TAG.sub("", text) if "\u4e00" <= c <= "\u9fff"])


def count_en(text):
    return len(WORD.findall(TAG.sub(" ", text)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("patch")
    ap.add_argument("--lang", default="zh", choices=["zh", "en"])
    ap.add_argument("--target", type=int, default=0, help="达到该计数即视为过线，仅用于回显提示")
    args = ap.parse_args()

    patch = json.load(open(args.patch, encoding="utf-8"))
    counter = count_zh if args.lang == "zh" else count_en
    unit = "汉字" if args.lang == "zh" else "词"
    for slug, add in patch.items():
        path = os.path.join(ART, f"{slug}.json")
        if not os.path.exists(path):
            print(f"{slug} 不存在", file=sys.stderr)
            continue
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        sections = d.get("sections") or []
        joined = "\n".join((s.get("body") or {}).get(args.lang, "") for s in sections)
        # 幂等：同段落写第二次就跳过，避免重复堆叠
        if add[:30] in joined:
            print(f"{slug} skip")
            continue
        idx = [i for i, s in enumerate(sections) if (s.get("body") or {}).get(args.lang)]
        if not idx:
            print(f"{slug} 没有可追加的 section", file=sys.stderr)
            continue
        sections[idx[-1]]["body"][args.lang] += add
        with open(path, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=2)
        total = counter("\n".join((s.get("body") or {}).get(args.lang, "") for s in sections))
        flag = ""
        if args.target and total < args.target:
            flag = f"  ↓还差 {args.target - total}"
        print(f"{slug} {total}{unit}{flag}")


if __name__ == "__main__":
    main()
