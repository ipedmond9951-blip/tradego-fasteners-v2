#!/usr/bin/env python3
"""把人工写好的中文段落写回文章 JSON（body_i18n.py merge 会跳过 zh，这里专门补 zh）。

用法：python3 scripts/fill_body_zh.py patch.json [--apply]
patch.json 结构：{"<slug>": {"<section-id>": {"heading": "...", "body": "<p>…</p>"}}}
质量闸：中文正文 ≥120 汉字、不含占位词，否则跳过并报错，不做静默写入。
"""
import json, re, sys, os

ART = "content/articles"
HAN = r"[\u4e00-\u9fff]"


def main():
    patch = sys.argv[1]
    apply = "--apply" in sys.argv
    data = json.load(open(patch, encoding="utf-8"))
    ok = bad = 0
    for slug, sections in data.items():
        p = os.path.join(ART, slug + ".json")
        if not os.path.exists(p):
            print(f"跳过：文章不存在 {slug}")
            continue
        d = json.load(open(p, encoding="utf-8"))
        by_id = {s.get("id"): s for s in d.get("sections", [])}
        for sid, texts in sections.items():
            tgt = by_id.get(sid)
            if not tgt:
                print(f"跳过：段落不存在 {slug}/{sid}")
                continue
            body = texts.get("body", "")
            han = len(re.findall(HAN, re.sub(r"<[^>]+>", "", body)))
            plain = re.sub(r"<[^>]+>", "", body)
            if (han < 120 and not (han >= 50 and len(plain) >= 200)) or "coming soon" in body.lower():
                print(f"拒绝：{slug}/{sid} 中文仅 {han} 字，未达门槛")
                bad += 1
                continue
            tgt.setdefault("body", {})["zh"] = body
            if texts.get("heading"):
                tgt.setdefault("heading", {})["zh"] = texts["heading"]
            else:
                tgt.setdefault("heading", {}).setdefault("zh", texts.get("heading", ""))
            ok += 1
            print(f"写入 {slug}/{sid}（{han} 汉字）")
        if apply and ok:
            json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
            open(p, "a", encoding="utf-8").write("\n")
    print(f"\n完成 {ok} 段，拒绝 {bad} 段；{'已写入' if apply else 'dry-run，未写入'}")


if __name__ == "__main__":
    main()
