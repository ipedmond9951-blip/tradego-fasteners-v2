#!/usr/bin/env python3
"""把正文里已成文的问答（Q/A 散文）抽成顶层结构化 faq 字段。

只做"搬运"，不改写、不生成：原文里没有 Q/A 的文章不会被凭空造出问答。
用法：
  python3 scripts/faq_extract.py            # dry-run，报告可抽取篇数与条数
  python3 scripts/faq_extract.py --apply    # 写入 content/articles/*.json
  python3 scripts/faq_extract.py --slug <slug> --show  # 打印抽取结果供核对
"""
import argparse, glob, json, re
from pathlib import Path

ART = Path("content/articles")
MIN_FAQ = 3
Q_RX = re.compile(r"(?:^|\n|\s)(?:Q\s*\d*\s*[:：.]|Question\s*\d*\s*[:：.])\s*", re.I)
A_RX = re.compile(r"\s*(?:A\s*\d*\s*[:：.]|Answer\s*\d*\s*[:：.])\s*", re.I)


def plain(html):
    t = re.sub(r"<br\s*/?>", "\n", html or "")
    t = re.sub(r"</p>", "\n\n", t)
    t = re.sub(r"<[^>]+>", "", t)
    return re.sub(r"[ \t]+", " ", t)


def faq_sections(d):
    out = []
    for s in d.get("sections", []):
        h = (s.get("heading") or {}).get("en", "") or ""
        if s.get("id") == "faq" or "frequently asked question" in h.lower():
            out.append(s)
    return out


def parse_paragraphs(text):
    """问答未加 Q:/A: 前缀时的兜底：问句段落 + 紧随其后的答案段落。"""
    items = []
    paras = [re.sub(r"\s+", " ", x).strip() for x in re.split(r"\n{2,}", text) if x.strip()]
    i = 0
    while i < len(paras) - 1:
        q, a = paras[i], paras[i + 1]
        if q.endswith("?") and 12 <= len(q) <= 240 and len(a) >= 60 and not a.endswith("?"):
            items.append({"q": q, "a": a})
            i += 2
        else:
            i += 1
    return items


def parse(text):
    items = []
    chunks = Q_RX.split(text)
    for ch in chunks[1:]:
        parts = A_RX.split(ch, maxsplit=1)
        if len(parts) != 2:
            continue
        q, a = parts[0].strip(" \n\t-:："), parts[1].strip()
        q = re.sub(r"\s+", " ", q)
        q = re.sub(r"\s*[QA]\d*\s*[:：.]?\s*$", "", q).strip()
        a = re.sub(r"\s+", " ", a)
        if len(q) < 8 or len(a) < 60:
            continue
        items.append({"q": q.rstrip("?") + "?", "a": a})
    return items


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--slug", default=None)
    ap.add_argument("--show", action="store_true")
    a = ap.parse_args()
    done = skipped = 0
    for p in sorted(glob.glob(str(ART / "*.json"))):
        d = json.load(open(p, encoding="utf-8"))
        if d.get("redirectTo") or (a.slug and d.get("slug") != a.slug):
            continue
        if isinstance(d.get("faq"), list) and len(d["faq"]) >= MIN_FAQ:
            continue
        best = []
        for s in faq_sections(d):
            got = parse(plain((s.get("body") or {}).get("en", "")))
            if len(got) > len(best):
                best = got
        if len(best) < MIN_FAQ:
            for s in faq_sections(d):
                got = parse_paragraphs(plain((s.get("body") or {}).get("en", "")))
                if len(got) > len(best):
                    best = got
        if len(best) < MIN_FAQ:
            skipped += 1
            continue
        done += 1
        print(f"{'✓' if a.apply else '·'} {d['slug']}: {len(best)} 条")
        if a.show:
            for it in best[:3]:
                print("   Q:", it["q"][:90], "\n   A:", it["a"][:110], "...")
        if a.apply:
            d["faq"] = best[:6]
            json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
            open(p, "a", encoding="utf-8").write("\n")
    print(f"\n[faq-extract] 可抽取 {done} 篇，仍需手写 {skipped} 篇" + ("（已写入）" if a.apply else "（dry-run）"))


if __name__ == "__main__":
    main()
