#!/usr/bin/env python3
"""按 GSC 高曝光低点击词重写某篇文章的英文标题/描述，再生成 9 语种原生版本。

用法:
  python3 scripts/seo_rewrite_meta.py <slug> --title "..." --description "..." --keyword "..."

规则沿用 seo_meta_i18n.py：母语表达、标题 ≤60、描述 ≤155、失败保留英文回退。
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from seo_meta_i18n import LANGS, build_prompt, call_llm, english_residue, extract_json  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--title", required=True)
    ap.add_argument("--description", required=True)
    ap.add_argument("--keyword", default="")
    args = ap.parse_args()

    path = os.path.join(ROOT, "content/articles", args.slug + ".json")
    art = json.load(open(path, encoding="utf-8"))
    keyword = args.keyword or (art.get("keywords") or "").split(",")[0].strip()

    result = {"en": {"title": args.title.strip(), "description": args.description.strip()}}

    def accept(lang, item):
        title = (item.get("title") or "").strip()
        desc = (item.get("description") or "").strip()
        if not title or not desc:
            return False
        if english_residue(title, lang) or english_residue(desc, lang):
            return False
        result[lang] = {"title": title.rstrip(".…").rstrip(), "description": desc.rstrip(".…").rstrip()}
        return True

    for batch in (["zh", "es", "fr", "ar", "hi"], ["pt", "ru", "ja", "de"]):
        raw = call_llm(build_prompt(args.title, args.description, keyword, batch), timeout=150)
        data = extract_json(raw) or {}
        for lang in batch:
            if not accept(lang, data.get(lang) or {}):
                print(f"⚠️ {lang}: batch rejected, retry")
                raw2 = call_llm(build_prompt(args.title, args.description, keyword, [lang]), timeout=90)
                accept(lang, (extract_json(raw2) or {}).get(lang) or {})

    for lang, item in result.items():
        if isinstance(art["title"], dict) and lang in art["title"]:
            art["title"][lang] = item["title"]
            art["description"][lang] = item["description"]
            if isinstance(art.get("metaDescription"), dict):
                art["metaDescription"][lang] = item["description"]

    art["metaOptimized"] = {"date": "2026-11-22", "reason": "GSC high impressions low CTR", "keyword": keyword}
    json.dump(art, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(json.dumps({"slug": args.slug, "updated": len(result), "missing": [l for l in LANGS if l not in result]}))


if __name__ == "__main__":
    sys.exit(main())
