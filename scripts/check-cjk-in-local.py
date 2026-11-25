#!/usr/bin/env python3
"""体检：非中文语种正文（es/fr/pt/de/ru/ar/hi/en）里残留的中文。

只报告，不改文件——定位到"哪篇、哪节、哪个语种、多大一段"就够，改写必须是逐段翻译
（整段删除会丢内容、还会让小节编号断档，2026-11-25 踩过）。

判定：一段内中文字符 >=10 且中文占非空白字符 >=50% → 成段污染；否则 → 词级残留。

用法：python3 scripts/check-cjk-in-local.py [--json]
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
NON_CJK = {"en", "es", "fr", "pt", "de", "ru", "ar", "hi"}
CJK = re.compile(r"[\u4e00-\u9fff]")
TAG = re.compile(r"<[^>]+>")


def chunks(text):
    return re.split(r"(?=<p>)", text)


def classify(p):
    plain = re.sub(r"\s+", "", TAG.sub("", p))
    cjk = len(CJK.findall(plain))
    if cjk < 1:
        return None, 0
    if cjk >= 10 and cjk / max(1, len(plain)) >= 0.5:
        return "block", cjk
    return "word", cjk


def main():
    as_json = "--json" in sys.argv
    block_rows, word_rows = [], []
    for f in sorted(glob.glob(os.path.join(ART, "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        for i, sec in enumerate(d.get("sections", [])):
            for field in ("heading", "body"):
                v = sec.get(field) or {}
                if not isinstance(v, dict):
                    continue
                for lang, txt in v.items():
                    if lang not in NON_CJK or not isinstance(txt, str):
                        continue
                    cnt = len(CJK.findall(TAG.sub("", txt)))
                    if not cnt:
                        continue
                    blocks = 0
                    for p in chunks(txt):
                        kind, n = classify(p)
                        if kind == "block":
                            blocks += 1
                    row = {"slug": d["slug"], "section": i, "field": field, "lang": lang,
                           "cjk": cnt, "blocks": blocks}
                    (block_rows if blocks else word_rows).append(row)

    if as_json:
        print(json.dumps({"block_fields": block_rows, "word_fields": word_rows}, ensure_ascii=False))
        return

    print(f"成段中文污染：{len(block_rows)} 个字段 / {len({r['slug'] for r in block_rows})} 篇")
    for r in block_rows:
        print(f"  {r['slug']} §{r['section']} {r['field']}.{r['lang']} 中文{r['cjk']}字 成段{r['blocks']}")
    print(f"词级残留：{len(word_rows)} 个字段（先跑 scripts/fix-cjk-tokens.py 处理专名/术语，剩余按语种逐条改）")


if __name__ == "__main__":
    main()
