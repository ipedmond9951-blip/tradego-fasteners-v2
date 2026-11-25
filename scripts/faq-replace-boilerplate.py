#!/usr/bin/env python3
"""faq-replace-boilerplate.py —— 用本篇真实问答替换跨文章复用的模板 FAQ。

模板判据与 check-faq-boilerplate.py 一致（同一英文问句全站 ≥3 次）。
patch 格式：
{"slug": {"items": [{"q":{"en":..,"zh":..,"ja":..}, "a":{...}}]}}
行为：删掉该篇里所有判为模板的条目，再把 items 追加到第一个含 FAQ 的 section。
若删除后该 section 为空，则把新条目放进原 section（保留结构）。
用法：python3 scripts/faq-replace-boilerplate.py /tmp/faq_rewrite.json [--dry-run]
"""
import glob, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def boilerplate_set(n=3):
    cnt, qs = {}, {}
    for f in glob.glob(os.path.join(ROOT, "content/articles/*.json")):
        d = json.load(open(f, encoding="utf-8"))
        for sec in d.get("sections", []):
            for it in (sec.get("faqItems") or []):
                q = ((it.get("q") or {}).get("en") or "").strip()
                if q:
                    qs[q] = qs.get(q, 0) + 1
    return {q for q, c in qs.items() if c >= n}


def main(path, dry=False):
    boil = boilerplate_set()
    patch = json.load(open(path, encoding="utf-8"))
    for slug, p in patch.items():
        f = os.path.join(ROOT, "content/articles", f"{slug}.json")
        if not os.path.exists(f):
            print(f"✗ {slug}: 文件不存在"); continue
        d = json.load(open(f, encoding="utf-8"))
        removed, target = 0, None
        for sec in d.get("sections", []):
            items = sec.get("faqItems") or []
            if not items:
                continue
            keep = []
            for it in items:
                q = ((it.get("q") or {}).get("en") or "").strip()
                if q in boil:
                    removed += 1
                    continue
                keep.append(it)
            if target is None:
                target = sec
            sec["faqItems"] = keep
        if target is None:
            last = d["sections"][-1]
            last["faqItems"] = []
            target = last
        for t in p["items"]:
            target["faqItems"].append({"q": t["q"], "a": t["a"]})
        if dry:
            print(f"[dry] {slug}: 删 {removed} 条模板，加 {len(p['items'])} 条真实问答")
            continue
        json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        open(f, "a").write("\n")
        print(f"✅ {slug}: 删 {removed} 条模板，加 {len(p['items'])} 条真实问答")


if __name__ == "__main__":
    main(sys.argv[1], "--dry-run" in sys.argv)
