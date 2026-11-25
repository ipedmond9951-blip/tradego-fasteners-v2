#!/usr/bin/env python3
"""批次 2 作业包生成器（只读，不写 content/articles）：给 paragrapher 的 8 个非英语语种算出「能安全处理多少、会产生多少重复」。

只读，不写 content。输出两份清单:
  docs/geo-locale-para-plan-2026-1125.csv   每语种一行：节数/预计段数/新增 dup 节数/命令
  docs/geo-para-manual-2026-1125.csv        自检失败、必须人工处理的章节

用法: python3 scripts/geo_locale_plan.py
"""
import json, glob, os, sys, csv, re

ROOT = os.path.expanduser("~/workspace/tradego-fasteners-v2")
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import paragrapher as P

ART = os.path.join(ROOT, "content", "articles")

agg = {lg: {"sec": 0, "paras": 0, "short": 0, "fail": 0, "dup": 0} for lg in P.PROFILE}
manual = []
dups = []

for f in sorted(glob.glob(os.path.join(ART, "*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    if d.get("redirectTo"):
        continue
    for i, s in enumerate(d.get("sections") or []):
        for lg, b in (s.get("body") or {}).items():
            if lg not in P.PROFILE or not isinstance(b, str) or not b.strip():
                continue
            if "<p>" in b or "<ul" in b or "<table" in b:
                continue
            if len(P.TAG.sub("", b)) < 300:
                agg[lg]["short"] += 1
                continue
            out = P.to_html(b, lg)
            if not P.same_text(b, out):
                agg[lg]["fail"] += 1
                manual.append([d["slug"], i, lg, len(P.TAG.sub("", b)), s.get("heading", {}).get(lg, "")[:40]])
                continue
            n = out.count("<p")
            agg[lg]["sec"] += 1
            agg[lg]["paras"] += n
            chunks = [re.sub(r"\s+", " ", P.TAG.sub("", c)).strip() for c in out.split("</p>")]
            chunks = [c for c in chunks if len(c) > 80]
            seen = {}
            hit = 0
            for c in chunks:
                seen[c] = seen.get(c, 0) + 1
                if seen[c] == 2:
                    hit += 1
            if hit:
                agg[lg]["dup"] += 1
                dups.append([d["slug"], i, lg, hit])

plan = os.path.join(ROOT, "docs", "geo-locale-para-plan-2026-1125.csv")
with open(plan, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["locale", "sections_todo", "est_paras", "avg_paras", "short_skipped", "selfcheck_failed", "dup_sections_after", "order", "command"])
    order = ["es", "pt", "fr", "de", "ru", "ar", "hi", "ja"]
    for lg in order:
        a = agg[lg]
        w.writerow([lg, a["sec"], a["paras"], f"{a['paras']/max(a['sec'],1):.1f}", a["short"], a["fail"], a["dup"],
                    order.index(lg) + 1,
                    f"python3 scripts/paragrapher.py --locale {lg} --apply"])

man = os.path.join(ROOT, "docs", "geo-para-manual-2026-1125.csv")
with open(man, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["slug", "section_index", "locale", "chars", "heading"])
    for r in manual:
        w.writerow(r)

dpath = os.path.join(ROOT, "docs", "geo-para-dup-2026-1125.csv")
with open(dpath, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["slug", "section_index", "locale", "dup_paragraphs"])
    for r in dups:
        w.writerow(r)

for lg in order:
    a = agg[lg]
    print(f"{lg:>3}: 待处理 {a['sec']:>5} 节 → 约 {a['paras']:>5} 段 | 太短跳过 {a['short']:>3} | 自检失败 {a['fail']:>2} | 段落化后需去重 {a['dup']:>3} 节")
print(f"\n清单: {plan}\n      {man}（{len(manual)} 行）\n      {dpath}（{len(dups)} 行）")
tot = sum(agg[lg]["sec"] for lg in order)
print("非英语合计待处理章节:", tot)
