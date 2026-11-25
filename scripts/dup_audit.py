#!/usr/bin/env python3
"""跨篇重复内容体检：统计每篇英文正文里“与全库共用”的整句占比。

判定：句子（去标签、长度 >60 字符）在 >= --min-docs 篇文章中逐字出现，即计为共用句。
输出按共用句占比排序，用于挑出模板化最重的页面。
仅作报告，不进入阻塞闸门（并行窗口改动不受影响）。
"""
import argparse, glob, json, os, re, sys

TAG = re.compile(r"<[^>]+>")
SPLIT = re.compile(r"(?<=[.!?])\s+")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_articles(path):
    arts = {}
    for f in glob.glob(os.path.join(path, "*.json")):
        d = json.load(open(f, encoding="utf-8"))
        if d.get("redirectTo"):
            continue
        t = " ".join(s.get("body", {}).get("en", "") for s in d["sections"])
        sents = [x.strip().lower() for x in SPLIT.split(TAG.sub(" ", t)) if len(x.strip()) > 60]
        arts[os.path.splitext(os.path.basename(f))[0]] = sents
    return arts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default=os.path.join(ROOT, "content/articles"))
    ap.add_argument("--min-docs", type=int, default=50)
    ap.add_argument("--top", type=int, default=15)
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    arts = load_articles(a.dir)
    df = {}
    for sents in arts.values():
        for s in set(sents):
            df[s] = df.get(s, 0) + 1
    rows = []
    for slug, sents in arts.items():
        if not sents:
            continue
        shared = sum(1 for s in set(sents) if df.get(s, 0) >= a.min_docs)
        rows.append((round(shared / len(set(sents)), 3), shared, len(set(sents)), slug))
    rows.sort(reverse=True)
    if a.json:
        print(json.dumps([{"share": r[0], "shared": r[1], "total": r[2], "slug": r[3]} for r in rows], ensure_ascii=False, indent=2))
        return 0
    print(f"文章数 {len(arts)}；共用句判定阈值 >= {a.min_docs} 篇")
    print("占比 共用/总句  slug")
    for r in rows[: a.top]:
        print(f"{r[0]:.3f}  {r[1]}/{r[2]}  {r[3]}")
    over = [r for r in rows if r[0] > 0.15]
    print(f"\n共用句占比 >15% 的文章: {len(over)} 篇")
    return 0


if __name__ == "__main__":
    sys.exit(main())
