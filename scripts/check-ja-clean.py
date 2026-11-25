#!/usr/bin/env python3
"""日语正文洁净度体体检：四类残留一次报清（只读，不修）。

1. 简体字形（fix-ja-simplified.py 的字表反向命中）
2. 中文词（fix-ja-chinese-words.py 的词表反向命中）
3. 中文虚词/搭配（这些/有什么区别/请求/过程中/可靠性…）
4. 非日语文字（西里尔、谚文、西文整句）

输出按「篇 + 节」聚合，便于逐条改。--json 给审计脚本用。退出码恒为 0（只报数，不阻断部署）。
"""
import argparse
import glob
import importlib.util
import json
import os
import re

CYR = re.compile(r"[а-яА-ЯёЁ]+")
HAN = re.compile(r"[\uac00-\ud7af]+")
PARTICLES = ["这些", "这个", "区别", "请求", "过程", "可靠性", "我们的", "您", "并且", "却下されない", "个"]
PARTICLES = ["这些", "这个", "有什么区别", "请求", "过程中", "可靠性", "我们的", "无论", "无论", "団隊", "团队"]


def load_table(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--top", type=int, default=20)
    args = ap.parse_args()

    here = os.path.dirname(os.path.abspath(__file__))
    simp = load_table(os.path.join(here, "fix-ja-simplified.py"), "simp").MAP
    words = load_table(os.path.join(here, "fix-ja-chinese-words.py"), "words").WORDS

    rows = []
    tot = {"simplified": 0, "chinese_word": 0, "particle": 0, "foreign": 0}
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        for i, s in enumerate(art.get("sections", [])):
            for fld in ("heading", "body"):
                d = s.get(fld)
                if not isinstance(d, dict) or not d.get("ja"):
                    continue
                t = d["ja"]
                simp_hit = [ch for ch in t if ch in simp]
                word_hit = [w for w in words if w in t]
                part_hit = [p for p in PARTICLES if p in t]
                foreign = CYR.findall(t) + HAN.findall(t)
                if not (simp_hit or word_hit or part_hit or foreign):
                    continue
                rows.append({
                    "slug": art.get("slug"), "section": i, "field": fld,
                    "simplified": len(simp_hit), "simp_chars": "".join(sorted(set(simp_hit)))[:10],
                    "chinese_word": len(word_hit), "words": word_hit[:6],
                    "particle": len(part_hit), "particles": part_hit[:4],
                    "foreign": len(foreign), "foreign_sample": "".join(foreign[:3]),
                    "len": len(t),
                })
                tot["simplified"] += len(simp_hit)
                tot["chinese_word"] += len(word_hit)
                tot["particle"] += len(part_hit)
                tot["foreign"] += len(foreign)

    rows.sort(key=lambda r: -(r["simplified"] + r["chinese_word"] * 2 + r["foreign"] * 3 + r["particle"]))
    if args.json:
        print(json.dumps({"totals": tot, "fields": len(rows), "rows": rows}, ensure_ascii=False, indent=1))
        return
    print("简体字形 %d 处 / 中文词 %d 处 / 中文虚词 %d 处 / 外文 token %d 处，共 %d 个字段"
          % (tot["simplified"], tot["chinese_word"], tot["particle"], tot["foreign"], len(rows)))
    for r in rows[: args.top]:
        print("  %-46s §%-2d %-7s 简%d(%s) 词%d 虚%d 外%d"
              % (r["slug"][:46], r["section"], r["field"], r["simplified"], r["simp_chars"],
                 r["chinese_word"], r["particle"], r["foreign"]))


if __name__ == "__main__":
    main()
