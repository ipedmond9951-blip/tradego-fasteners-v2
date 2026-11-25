#!/usr/bin/env python3
"""把"没有 <p> 的整块正文"补成真正的段落（只加标签，不改文字）。

2026-11-25 GEO 体检发现: 130 篇文章的 699 个英文章节、以及同构的中文章节，正文是
一个没有段落标签的纯文本块，其中 861 段连空行都没有，整个 1000+ 词的章节被渲染成
一坨。后果两层:
  - SEO: 没有小段落结构，可读性和停留时间吃亏；
  - GEO: 回答引擎/LLM 切块器按段落取语义单元，一坨正文里切不出"一句话答案"。

分段策略（先认形态，再决定切法）:
  1. 条目式（≥4 块且过半是 "标签: 说明"）→ 一条一段，并把标签加粗，让每段自带实体名
  2. 有空行 → 按空行分段；只有单换行 → 按换行分段
  3. 全无换行 → 按句子边界切，合并成英文 55-110 词 / 中文 80-160 字一段
  含 <ul>/<li>/<table> 的正文跳过（只有 1 段，留给人工）

用法:
  python3 scripts/paragrapher.py                 # dry-run
  python3 scripts/paragrapher.py --apply         # 写入
  python3 scripts/paragrapher.py --slug X --apply --locale en
"""
import json, re, glob, os, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
TAG = re.compile(r"<[^>]+>")
HAN = re.compile(r"[\u4e00-\u9fff]")
WORDS = re.compile(r"[A-Za-z0-9'’\-]+")
SENT_EN = re.compile(r'(?<=[.!?])\s+(?=[A-Z0-9"“\(\u4e00-\u9fff])')
SENT_ZH = re.compile(r"(?<=[。！？；])")
LABEL = re.compile(r"^([A-Z0-9\u4e00-\u9fff][^:：\n]{1,50})[:：]\s*(.*)$", re.S)


def wc(t, lang):
    return len(HAN.findall(TAG.sub("", t))) if lang == "zh" else len(WORDS.findall(TAG.sub(" ", t)))


def split_units(text, lang):
    if "\n\n" in text:
        return [x.strip() for x in text.split("\n\n") if x.strip()]
    if "\n" in text:
        return [x.strip() for x in text.split("\n") if x.strip()]
    sents = (SENT_ZH if lang == "zh" else SENT_EN).split(text.strip())
    return [s.strip() for s in sents if s.strip()]


def is_list_style(units):
    if len(units) < 4:
        return False
    hit = sum(1 for u in units if LABEL.match(u))
    return hit / len(units) >= 0.5


def regroup(units, lang):
    lo, hi = (80, 160) if lang == "zh" else (55, 110)
    paras, buf, bw = [], [], 0
    for u in units:
        uw = wc(u, lang)
        if uw > hi * 2:
            paras.extend(regroup(split_units(u, lang), lang))
            continue
        buf.append(u)
        bw += uw
        if bw >= lo:
            paras.append("".join(buf) if lang == "zh" else " ".join(buf))
            buf, bw = [], 0
    if buf:
        joined = "".join(buf) if lang == "zh" else " ".join(buf)
        if paras and wc(paras[-1], lang) < lo:
            paras[-1] += joined
        else:
            paras.append(joined)
    return [x.strip() for x in paras if x.strip()]


def to_html(text, lang):
    units = split_units(text, lang)
    if is_list_style(units):
        out = []
        for u in units:
            m = LABEL.match(u)
            if m and m.group(2):
                out.append(f"<p><strong>{m.group(1).strip()}</strong>: {m.group(2).strip()}</p>")
            else:
                out.append(f"<p>{u}</p>")
        return "\n".join(out)
    paras = regroup(units, lang)
    return "\n".join(f"<p>{p}</p>" for p in paras)


def dedupe(text):
    """删掉同段内逐字重复的段落（>80 字符），保留首次出现。"""
    paras = [p for p in re.split(r"</p>", text) if "<p>" in p]
    if not paras:
        return text, 0
    keep, seen, drops = [], {}, 0
    for p in paras:
        key = re.sub(r"\s+", " ", TAG.sub("", p)).strip().lower()
        if len(key) > 80 and key in seen:
            drops += 1
            continue
        seen[key] = True
        keep.append(p.strip())
    return "\n".join(x + "</p>" if not x.endswith("</p>") else x for x in keep), drops


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dedupe", action="store_true", help="只做同篇重复段清理，不补段落")
    ap.add_argument("--locale", default="both", choices=["en", "zh", "both"])
    ap.add_argument("--show", type=int, default=3)
    a = ap.parse_args()

    langs = ["en", "zh"] if a.locale == "both" else [a.locale]
    files = [os.path.join(ART, f"{a.slug}.json")] if a.slug else sorted(glob.glob(os.path.join(ART, "*.json")))
    n_files = n_sec = 0
    samples = []
    for f in files:
        d = json.load(open(f, encoding="utf-8"))
        if d.get("redirectTo"):
            continue
        changed = False
        for s in d.get("sections") or []:
            b = s.get("body")
            if not isinstance(b, dict):
                continue
            for lang in langs:
                t = b.get(lang, "") or ""
                if a.dedupe:
                    fixed, drops = dedupe(t)
                    if drops:
                        b[lang] = fixed
                        n_sec += 1
                        changed = True
                        if len(samples) < a.show:
                            samples.append((d["slug"], lang, t, fixed))
                    continue
                if "<p>" in t or "<li" in t or "<ul" in t or "<table" in t:
                    continue
                if len(TAG.sub("", t)) < 300:
                    continue
                new = to_html(t, lang)
                if new.count("<p>") < 2:
                    continue
                b[lang] = new
                n_sec += 1
                changed = True
                if len(samples) < a.show:
                    samples.append((d["slug"], lang, t, new))
        if changed:
            n_files += 1
            if a.apply:
                json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    print(f"{'已写入' if a.apply else 'dry-run'}：文件 {n_files}，章节 {n_sec}")
    for slug, lang, old, new in samples:
        print(f"\n— {slug} [{lang}] 段数 {new.count('<p>')}（原 {len(split_units(old, lang))} 块）")
        print("  首段: " + TAG.sub(" ", new.split("</p>")[0])[:170])


if __name__ == "__main__":
    main()
