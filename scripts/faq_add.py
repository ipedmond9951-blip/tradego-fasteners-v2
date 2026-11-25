#!/usr/bin/env python3
"""把写好的英文问答批量写入 section.faqItems（真正渲染 + 生成 FAQPage schema 的字段）。

用法：python3 scripts/faq_add.py patch.json [--apply]
patch.json 结构：{"slug": [["question", "answer"], ...], ...}
已有不足 3 条的补到 3 条，按问句去重；已有 ≥3 条的不动。
"""
import json, re, sys
from pathlib import Path

ART = Path("content/articles")
HDR = {
    "en": "Frequently Asked Questions", "zh": "常见问题解答", "es": "Preguntas frecuentes",
    "fr": "Questions fréquemment posées", "pt": "Perguntas frequentes", "ar": "الأسئلة الشائعة",
    "ru": "Часто задаваемые вопросы", "ja": "よくある質問", "de": "Häufig gestellte Fragen",
    "hi": "अक्सर पूछे जाने वाले प्रश्न",
}


def faq_sec(d):
    for s in d.get("sections", []):
        h = (s.get("heading") or {}).get("en", "") or ""
        if s.get("id") == "faq" or "frequently asked question" in h.lower():
            return s
    s = {"id": "faq", "heading": dict(HDR)}
    d["sections"].append(s)
    return s


def main():
    patch = json.load(open(sys.argv[1], encoding="utf-8"))
    apply = "--apply" in sys.argv
    done = 0
    for slug, pairs in patch.items():
        p = ART / f"{slug}.json"
        d = json.load(open(p, encoding="utf-8"))
        sec = faq_sec(d)
        cur = sec.get("faqItems") or []
        have = {(i.get("q") or {}).get("en", "") for i in cur}
        added = 0
        for q, a in pairs:
            if q in have or len(cur) >= 3:
                continue
            cur.append({"q": {"en": q}, "a": {"en": a}})
            have.add(q)
            added += 1
        sec["faqItems"] = cur
        if added:
            done += 1
            print(f"{'✓' if apply else '·'} {slug}: +{added}（共 {len(cur)}）")
            if apply:
                json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
                open(p, "a", encoding="utf-8").write("\n")
    print(f"\n[faq-add] {done} 篇" + ("（已写入）" if apply else "（dry-run，加 --apply）"))


if __name__ == "__main__":
    main()
