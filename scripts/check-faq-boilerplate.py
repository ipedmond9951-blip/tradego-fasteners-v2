#!/usr/bin/env python3
"""check-faq-boilerplate.py —— 揪出跨文章复用的模板 FAQ（翻译了也没 SEO 价值的空话）。

判据：同一英文问句在全站出现 ≥ N 次（默认 3）。这类问题通常是"你们提供定制吗/怎么选供应商"，
应换成本篇真实问题。用法：
  python3 scripts/check-faq-boilerplate.py            # 统计
  python3 scripts/check-faq-boilerplate.py --slugs   # 只列文章名
"""
import glob, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = 3
for a in sys.argv[1:]:
    if a.startswith("--min="):
        N = int(a.split("=")[1])

cnt, per_art = {}, {}
for f in sorted(glob.glob(os.path.join(ROOT, "content/articles/*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    qs = []
    for sec in d.get("sections", []):
        for it in (sec.get("faqItems") or []):
            q = ((it.get("q") or {}).get("en") or "").strip()
            if q:
                qs.append(q); cnt[q] = cnt.get(q, 0) + 1
    per_art[os.path.basename(f)[:-5]] = qs

boil = {q for q, c in cnt.items() if c >= N}
rows = []
for slug, qs in per_art.items():
    b = [q for q in qs if q in boil]
    if b:
        rows.append((len(b), slug, b))

rows.sort(reverse=True)
print(f"模板 FAQ 判定阈值：同一问句出现 ≥{N} 次")
print(f"受影响文章 {len(rows)} 篇，待替换条目 {sum(r[0] for r in rows)} 条")
for n, slug, b in rows:
    if "--slugs" in sys.argv:
        print(slug)
    else:
        print(f"  {n}  {slug}")
        for q in b:
            print(f"      - {q}")
