#!/usr/bin/env python3
"""FAQ 体检：问答错位 + 语种覆盖。

用法：
  python3 scripts/faq_audit.py                # 全库汇总
  python3 scripts/faq_audit.py --slug X       # 单篇明细
  python3 scripts/faq_audit.py --csv out.csv  # 落 CSV（slug,faq_items,missing_locales,q_anomalies）
  python3 scripts/faq_audit.py --brief        # 只打一行总数

判据：
  - 问句异常：英文 q 长度 > 160 字符，或不以 "?" 结尾（FAQ 里 "问句位" 装了陈述/整段答案）
  - 语种覆盖：某语种在 faqItems 里 0 条，该语种页面整节 FAQ 不输出（page.tsx native-only）
"""
import argparse
import csv
import glob
import json
import re
import sys

LOCALES = ["en", "zh", "ru", "ar", "es", "fr", "de", "pt", "ja", "hi"]
FAQ_HEADING = re.compile(
    r"faq|frequently asked|常见问题|常問問題|preguntas frecuentes|questions fr|"
    r"häufige|часто задав|الأسئلة|सामान्य प्रश्न|perguntas frequentes",
    re.I,
)


def faq_sections(doc):
    for sec in doc.get("sections", []):
        head = (sec.get("heading") or {}).get("en", "") + " " + str(sec.get("id", ""))
        if FAQ_HEADING.search(head) and sec.get("faqItems"):
            yield sec


def audit(path):
    doc = json.load(open(path, encoding="utf-8"))
    slug = doc.get("slug") or path.split("/")[-1][:-5]
    items = 0
    missing = set()
    anomalies = []
    for sec in faq_sections(doc):
        for idx, it in enumerate(sec["faqItems"]):
            if not isinstance(it, dict):
                continue
            q = it.get("q")
            if not isinstance(q, dict):
                anomalies.append((idx, "q 不是多语种字典"))
                continue
            items += 1
            en = (q.get("en") or "").strip()
            if len(en) > 160 or not en.endswith("?"):
                anomalies.append((idx, en[:60]))
            for loc in LOCALES:
                if not (q.get(loc) or "").strip():
                    missing.add(loc)
    return {
        "slug": slug,
        "faq_items": items,
        "missing_locales": [l for l in LOCALES if l in missing],
        "q_anomalies": anomalies,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--csv")
    ap.add_argument("--brief", action="store_true")
    args = ap.parse_args()

    files = sorted(glob.glob("content/articles/*.json"))
    if args.slug:
        files = [f for f in files if f.endswith(f"/{args.slug}.json")]
        if not files:
            sys.exit(f"未找到 {args.slug}")

    rows = [audit(f) for f in files]
    rows = [r for r in rows if r["faq_items"]]

    if args.csv:
        with open(args.csv, "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh)
            w.writerow(["slug", "faq_items", "missing_locales", "q_anomalies"])
            for r in rows:
                w.writerow([r["slug"], r["faq_items"], "|".join(r["missing_locales"]),
                            len(r["q_anomalies"])])

    loc_gap = {l: sum(1 for r in rows if l in r["missing_locales"]) for l in LOCALES}
    bad = [r for r in rows if r["q_anomalies"]]
    gap_articles = sum(1 for r in rows if r["missing_locales"])

    if args.brief:
        print(f"FAQ 文章 {len(rows)} / 缺口文章 {gap_articles} / 问句异常 {sum(len(r['q_anomalies']) for r in bad)}")
        return

    print(f"含 FAQ 文章 {len(rows)} 篇，问答 {sum(r['faq_items'] for r in rows)} 条")
    print("语种缺口（篇数）：", {l: n for l, n in loc_gap.items() if n})
    print(f"问句异常 {sum(len(r['q_anomalies']) for r in bad)} 条，涉及 {len(bad)} 篇")
    for r in bad[:20]:
        print("  -", r["slug"], r["q_anomalies"])
    if args.slug:
        for r in rows:
            print(json.dumps(r, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
