#!/usr/bin/env python3
"""半译体检：非拉丁语种正文（ar/ru/hi/ja/zh）里夹的英文词量。

check-body-lang.py 只抓"整句英文"，而真实库里大量是"本地语里夹英文谓语/短语"的半译文本，
单句级检查会漏。这里按语种数英文 token（排除标准号/牌号/产品名白名单），给出排序清单。

用法：
  python3 scripts/lang_mix_audit.py                 # 打到 stdout
  python3 scripts/lang_mix_audit.py --csv docs/x.csv
  python3 scripts/lang_mix_audit.py --min 30        # 只看 >=30 词的节
"""
import argparse
import csv
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
NONLAT = {"ar", "ru", "hi", "ja", "zh"}
WORD = re.compile(r"[A-Za-z][A-Za-z'’\-]{2,}")
CODE = re.compile(r"^(ISO|DIN|ANSI|ASME|ASTM|GB|JIS|SANS|EN|GOST|BS|API|NPS|UNS|SA|SMO|"
                  r"PTFE|CNC|LNG|LPG|HS|USD|EUR|EXW|FOB|CIF|CFR|DAP|DDP|SLA|EPC|CAD|"
                  r"MTC|PVoC|CoC|SGS|BV|BIS|KEBS|TBS|ZIMRA|SON|AfCFTA|ETLS|BURS|GSA|"
                  r"MINPET|APA|SIGI|AGO|SONANGOL|PCC|ISPM|HRC|HV|MPa|ksi|NACE|SCZONE|"
                  r"GOEIC|Incoterm|Incoterms|Tier|OEM|PVoC)$", re.I)
TAG = re.compile(r"<[^>]+>")
# 标准号、牌号、产品名、站点域名等白名单：不算"夹英文"
WHITE = {
    "ISO", "DIN", "ANSI", "ASME", "GB", "JIS", "SANS", "ASTM", "EN", "GOST", "BS", "IS",
    "MPa", "HRC", "HV", "HDG", "PVoC", "CoC", "MTC", "SGS", "BV", "BIS", "KEBS", "TBS",
    "ZIMRA", "SON", "AfCFTA", "ETLS", "BURS", "GSA", "HS", "USD", "EUR", "EXW", "FOB",
    "CIF", "CFR", "DDP", "DAP", "SLA", "EPC", "CAD", "UNC", "UNF", "UNEF", "Type", "Gr",
    "Grade", "Class", "BWP", "KES", "GHS", "NGN", "ZAR", "TradeGo", "Fasteners", "com",
    "www", "http", "https", "href", "class", "strong", "target", "rel", "noopener",
    "whatsapp", "WhatsApp", "email", "Dacromet", "Nairobi", "Durban", "Gaborone",
}


def english_run_words(body):
    """只数"真被当成英文句子夹进去"的词：先剥 HTML 标签，再按非 ASCII 字符切段，
    每段里连续 >=4 个非代码拉丁词才算一次泄漏（Bureau Veritas / Porto de Luanda
    这类 2-3 词专名、ASTM/ISO 代码、ТН ВЭД 之类不算）。"""
    text = TAG.sub(" ", body)
    runs, cur = [], []
    for piece in re.split(r"([^\x00-\x7F]+)", text):
        if piece and re.match(r"^[^\x00-\x7F]", piece):
            if cur:
                runs.append(cur)
                cur = []
            continue
        for w in WORD.findall(piece):
            cur.append(w)
    if cur:
        runs.append(cur)
    out = []
    for r in runs:
        real = [w for w in r if not (w in WHITE or CODE.match(w) or w.isupper() and len(w) <= 5)]
        if len(real) >= 4:
            out += real
    return out


def scan(path, min_words):
    rows = []
    d = json.load(open(path, encoding="utf-8"))
    slug = d.get("slug") or os.path.basename(path)[:-5]
    for i, s in enumerate(d.get("sections", [])):
        for lang, body in (s.get("body") or {}).items():
            if lang not in NONLAT or not isinstance(body, str):
                continue
            words = english_run_words(body)
            if len(words) >= min_words:
                rows.append({
                    "slug": slug, "section": i, "lang": lang,
                    "latin_words": len(words), "chars": len(body),
                    "sample": " ".join(words[:6]),
                })
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv")
    ap.add_argument("--min", type=int, default=8)
    a = ap.parse_args()

    rows = []
    for f in sorted(glob.glob(os.path.join(ART, "*.json"))):
        rows += scan(f, a.min)
    rows.sort(key=lambda r: (-r["latin_words"], r["slug"], r["section"]))
    arts = len({r["slug"] for r in rows})
    total = sum(r["latin_words"] for r in rows)
    by_lang = {}
    for r in rows:
        by_lang[r["lang"]] = by_lang.get(r["lang"], 0) + r["latin_words"]
    print(f"半译节 {len(rows)} 处 / 文章 {arts} 篇 / 英文词总量 {total}")
    print("按语种：" + " / ".join(f"{k} {v}" for k, v in sorted(by_lang.items())))
    for r in rows[:12]:
        print(f"  {r['latin_words']:>4} §{r['section']:<2} {r['lang']} {r['slug'][:44]} | {r['sample']}")

    if a.csv:
        out = os.path.join(ROOT, a.csv) if not os.path.isabs(a.csv) else a.csv
        with open(out, "w", newline="", encoding="utf-8") as h:
            w = csv.DictWriter(h, fieldnames=["slug", "section", "lang", "latin_words",
                                              "chars", "sample"])
            w.writeheader()
            w.writerows(rows)
        print(f"已写 {out}（{len(rows)} 行）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
