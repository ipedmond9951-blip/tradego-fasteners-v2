#!/usr/bin/env python3
"""为文章填充站内关联链接：relatedArticles（出链）+ 反写 3 篇旧文（入链）。

用法: python3 scripts/seo_internal_links.py content/articles/<slug>.json [--top 5]
"""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART_DIR = os.path.join(ROOT, "content", "articles")

SYNONYMS = {"agricultural": "agri farm farming implement irrigation shed", "agri": "agricultural farm farming"}
STOP = {"fastener", "fasteners", "bolt", "bolts", "screw", "screws", "nut", "nuts", "supplier",
        "procurement", "market", "guide", "africa", "african", "china", "import", "importing",
        "the", "and", "for", "with", "from", "that", "this", "after", "into", "your",
        "guide", "2026", "how", "what", "why", "new", "vs", "per", "using"}


def tokens(text):
    return {w for w in re.findall(r"[a-z0-9\-]{3,}", (text or "").lower()) if w not in STOP}


def en_title(art):
    t = art.get("title")
    return (t.get("en") if isinstance(t, dict) else t) or art.get("slug", "")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--top", type=int, default=5)
    args = ap.parse_args()

    path = args.path if os.path.isabs(args.path) else os.path.join(ROOT, args.path)
    art = json.load(open(path, encoding="utf-8"))
    me = art["slug"]
    my_tokens = tokens(en_title(art) + " " + str(art.get("keywords", "")) + " " + str(art.get("region", "")))
    my_region = (art.get("region") or "").lower()

    cands = []
    for fn in os.listdir(ART_DIR):
        if not fn.endswith(".json") or fn[:-5] == me:
            continue
        try:
            other = json.load(open(os.path.join(ART_DIR, fn), encoding="utf-8"))
        except Exception:
            continue
        overlap = len(my_tokens & tokens(en_title(other) + " " + str(other.get("keywords", ""))))
        score = overlap * 2
        if (other.get("region") or "").lower() == my_region and my_region:
            score += 1
        # 必须有真实词面重合，只有同区域不算相关
        if overlap >= 1 and score >= 2:
            cands.append((score, other["slug"], en_title(other)))
    cands.sort(reverse=True)

    top = cands[: args.top]
    art["relatedArticles"] = [{"slug": s, "title": t} for _, s, t in top]

    # 反向链接：最相关的 3 篇旧文里加一条指向新文
    backfilled = []
    for _, slug, _t in cands[:3]:
        p = os.path.join(ART_DIR, slug + ".json")
        try:
            other = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        rel = other.get("relatedArticles") or []
        norm = [r.get("slug") if isinstance(r, dict) else r for r in rel]
        if me in norm or len(rel) >= 8:
            continue
        rel.append({"slug": me, "title": en_title(art)})
        other["relatedArticles"] = rel
        json.dump(other, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        backfilled.append(slug)

    json.dump(art, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(json.dumps({"slug": me, "outbound": [s for _, s, _ in top], "inbound": backfilled}, ensure_ascii=False))


if __name__ == "__main__":
    sys.exit(main())
