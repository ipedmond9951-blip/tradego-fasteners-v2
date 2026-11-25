#!/usr/bin/env python3
"""check-body-lang.py —— 正文体的"语种污染"体检（不只是 FAQ）

为什么要单独一支：FAQ 的泄漏已经由 check-i18n-leakage.py 盯着，但 `sections[].body`
一直没有硬指标。实际抽样发现的形态有三种：

  1. english  —— 非英文语种的正文里整句还是英文（"Concrete screws and anchors must meet
                 specific load requirements..."），渲染出来就是英文段落，最伤信任。
  2. script   —— 非英文语种正文里夹着另一种书写系统（日文页夹中文/韩文、葡语页夹中文、
                 德语页夹阿语），多半是机器翻译串了语种。
  3. noise    —— 只夹 1–9 个外文字符，多为术语残留，不影响阅读，只做提示。

用法：
  python3 scripts/check-body-lang.py                 # 汇总 + 最严重 15 篇
  python3 scripts/check-body-lang.py --json          # 机器可读
  python3 scripts/check-body-lang.py --slug <slug>   # 单篇明细
  python3 scripts/check-body-lang.py --strict        # 有 english/script 级问题则 exit 1
"""
import argparse, glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")

LANGS = ["zh", "es", "fr", "pt", "de", "ja", "ru", "ar", "hi"]
ALLOWED = {"zh": {"cjk"}, "ja": {"cjk", "kana"}, "ru": {"cyr"}, "ar": {"ar"}, "hi": {"dev"},
           "es": set(), "fr": set(), "pt": set(), "de": set()}
OSCRIPT = {
    "cjk": re.compile(r"[\u4e00-\u9fff]"),
    "kana": re.compile(r"[\u3040-\u30ff]"),
    "hangul": re.compile(r"[\uac00-\ud7af]"),
    "cyr": re.compile(r"[\u0400-\u04ff]"),
    "ar": re.compile(r"[\u0600-\u06ff]"),
    "dev": re.compile(r"[\u0900-\u097f]"),
}
TAG = re.compile(r"<[^>]+>")
SENT = re.compile(r"[^.!?。！？\n]+")
WORD = re.compile(r"[A-Za-z][A-Za-z'\-]+")


def en_text(s):
    """判断一句是不是英文：>=6 个词，且 85% 以上是纯粹拉丁词、长度像英文单词。"""
    toks = s.split()
    if len(toks) < 6:
        return False
    latin = [t for t in toks if WORD.fullmatch(t.strip(".,;:()\"'")) ]
    if len(latin) / len(toks) < 0.85:
        return False
    # 纯拉丁语种的句子也长这样，用常见英文功能词兜一层
    low = {w.lower() for w in latin}
    stop = {"the", "and", "for", "with", "must", "are", "is", "of", "to", "in", "that", "a", "an", "be", "by"}
    return len(low & stop) >= 2


def scan_field(lang, value):
    if not value:
        return None
    plain = TAG.sub(" ", value)
    allow = ALLOWED.get(lang, set())
    eng = []
    for s in SENT.findall(plain):
        if en_text(s) and not any(rx.search(s) for n, rx in OSCRIPT.items() if n not in allow):
            # 拉丁语种本身是拉丁字母，只靠英文功能词判定；有其它文字的直接归 script
            eng.append(s.strip()[:90])
    frag = []
    for name, rx in OSCRIPT.items():
        if name in allow:
            continue
        frag += rx.findall(plain)
    if not eng and len(frag) < 10:
        return None
    return {"english": eng[:3], "script": "".join(frag)[:40],
            "level": "english" if eng else ("script" if len(frag) >= 10 else "noise")}


def scan_article(path):
    d = json.load(open(path, encoding="utf-8"))
    rows = []
    for i, s in enumerate(d.get("sections", [])):
        for fld in ("heading", "body"):
            for lang in LANGS:
                r = scan_field(lang, ((s.get(fld) or {}).get(lang) or ""))
                if r:
                    rows.append({"section": i, "field": fld, "lang": lang, **r})
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--slug")
    ap.add_argument("--strict", action="store_true")
    a = ap.parse_args()

    files = ([os.path.join(ART, a.slug + ".json")] if a.slug
             else sorted(glob.glob(os.path.join(ART, "*.json"))))
    total = {"english": 0, "script": 0, "noise": 0}
    per_art = []
    for f in files:
        rows = scan_article(f)
        if not rows:
            continue
        for r in rows:
            total[r["level"]] = total.get(r["level"], 0) + 1
        per_art.append({"slug": os.path.basename(f)[:-5], "rows": rows})
    per_art.sort(key=lambda x: (-sum(1 for r in x["rows"] if r["level"] == "english"),
                                -sum(1 for r in x["rows"] if r["level"] == "script")))

    if a.json:
        print(json.dumps({"summary": total, "articles": per_art}, ensure_ascii=False, indent=1))
        return 0

    print(f"正文语种污染：english {total['english']} 处 / script {total['script']} 处 / noise {total['noise']} 处")
    print(f"涉及文章 {len(per_art)} 篇")
    if a.slug:
        for r in per_art[0]["rows"]:
            print(f"  §{r['section']} {r['field']}.{r['lang']} [{r['level']}] {r['english'][0] if r['english'] else r['script']}")
    else:
        for art in per_art[:15]:
            e = sum(1 for r in art["rows"] if r["level"] == "english")
            s = sum(1 for r in art["rows"] if r["level"] == "script")
            print(f"  {art['slug'][:52]:<52} english {e:>2} script {s:>2}")
    if a.strict and (total["english"] or total["script"]):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
