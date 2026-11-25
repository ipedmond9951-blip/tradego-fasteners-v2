import glob
import json

PAIRS = [
    ("フランジボロ팅", "フランジボルト締結"),
    ("リロング웨", "リロングウェ"),
]

files = 0
hits = 0
for path in sorted(glob.glob("content/articles/*.json")):
    art = json.load(open(path))
    dirty = False
    fields = []
    for s in art.get("sections", []):
        for k in ("heading", "body"):
            if isinstance(s.get(k), dict) and s[k].get("ja"):
                fields.append(s[k])
        for q in s.get("faqItems", []) or []:
            for f in ("q", "a"):
                if isinstance(q.get(f), dict) and q[f].get("ja"):
                    fields.append(q[f])
    for d in fields:
        t = d["ja"]
        for bad, good in PAIRS:
            if bad in t:
                hits += t.count(bad)
                t = t.replace(bad, good)
                dirty = True
        d["ja"] = t
    if dirty:
        files += 1
        open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
print("修正 %d 处 / %d 篇" % (hits, files))
