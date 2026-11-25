#!/usr/bin/env python3
"""把顶层 faq（历史字段，站点不渲染）迁移到 section.faqItems（真正渲染并生成 FAQPage schema）。

背景：文章页只读 sections[].faqItems；顶层 faq 从未被渲染，也没有 schema。
用法：
  python3 scripts/faq_migrate.py            # dry-run
  python3 scripts/faq_migrate.py --apply
"""
import argparse, glob, json, re
from pathlib import Path

ART = Path("content/articles")
MIN_FAQ = 3
HDR = {
    "en": "Frequently Asked Questions",
    "zh": "常见问题解答",
    "es": "Preguntas frecuentes",
    "fr": "Questions fréquemment posées",
    "pt": "Perguntas frequentes",
    "ar": "الأسئلة الشائعة",
    "ru": "Часто задаваемые вопросы",
    "ja": "よくある質問",
    "de": "Häufig gestellte Fragen",
    "hi": "अक्सर पूछे जाने वाले प्रश्न",
}


def faq_section(d):
    for s in d.get("sections", []):
        if s.get("id") == "faq" or "frequently asked question" in ((s.get("heading") or {}).get("en", "") or "").lower():
            return s
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    moved = 0
    for p in sorted(glob.glob(str(ART / "*.json"))):
        d = json.load(open(p, encoding="utf-8"))
        if d.get("redirectTo"):
            continue
        top = d.get("faq")
        if not isinstance(top, list) or len(top) < MIN_FAQ:
            continue
        items = []
        def val(x):
            if isinstance(x, dict):
                return (x.get("en") or next(iter(x.values()), "") or "").strip()
            return (x or "").strip() if isinstance(x, str) else ""

        for it in top:
            q, ans = val(it.get("q")), val(it.get("a"))
            if q and ans:
                items.append({"q": {"en": q}, "a": {"en": ans}})
        if len(items) < MIN_FAQ:
            continue
        sec = faq_section(d)
        if sec and sec.get("faqItems"):
            continue
        if not sec:
            sec = {"id": "faq", "heading": HDR}
            d["sections"].append(sec)
        sec["faqItems"] = items
        d.pop("faq", None)
        moved += 1
        print(f"{'✓' if a.apply else '·'} {d['slug']}: {len(items)} 条 -> faqItems")
        if a.apply:
            json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
            open(p, "a", encoding="utf-8").write("\n")
    print(f"\n[faq-migrate] {moved} 篇" + ("（已写入）" if a.apply else "（dry-run）"))


if __name__ == "__main__":
    main()
