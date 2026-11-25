#!/usr/bin/env python3
"""把"没有 <p> 的整块正文"补成真正的段落（只加标签，不改文字）。

2026-11-25 GEO 体检: 130 篇文章的 699 个英文章节、以及同构的中文章节，正文是一个
没有段落标签的纯文本块，其中 861 段连空行都没有，整个 1000+ 词的章节渲染成一坨。
后果两层: SEO 可读性、GEO 切块（回答引擎按段落取语义单元，一坨正文里切不出答案）。

分段策略（先认形态，再决定切法）:
  1. 条目式（≥4 块且过半是 "标签: 说明"）→ 一条一段，标签加粗，让每段自带实体名
  2. 有空行 → 按空行分段；只有单换行 → 按换行分段
  3. 全无换行 → 按句末切，再合并到目标段长
  含 <ul>/<li>/<table> 的正文跳过（留给人工）

安全约束（2026-11-25 事故后加）:
  - 切句前先把所有 HTML 标签用占位符遮住。`<a href="https://…/x.html">` 里的 `.` `/`
    会被句末正则命中，标签被从中间劈开，`<[^>]+>` 失配，URL 文本就漏进正文
    （实测 197 个章节凭空长出 100–350 字符）。遮住 → 切 → 还原，标签永不被切开。
  - 每个章节写回前做一次「去空白后逐字相等」自检，不相等就跳过并报告，绝不写入。

语种切法:
  en/zh/es/fr/pt/de/ru/ar/hi 按词（55–110），zh 按字（80–160），ja 按字（100–200，句间不加空格）

用法:
  python3 scripts/paragrapher.py                          # 全语种 dry-run
  python3 scripts/paragrapher.py --locale es --apply      # 单语种写入
  python3 scripts/paragrapher.py --slug X --apply --locale en
  python3 scripts/paragrapher.py --dedupe --apply --locale en
"""
import json, re, glob, os, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
# 只认形态正确的标签；正文里的「<6.5 MPa」「pH < 6,5」这类真内容不能被当标签吃掉
TAG = re.compile(r"</?[a-zA-Z][a-zA-Z0-9]*[^<>]*>")
WORDS = re.compile(r"[A-Za-z0-9'’\-]+")
UNIWORDS = re.compile(r"[\w\u0600-\u06ff\u0900-\u097f]+")
HAN = re.compile(r"[\u4e00-\u9fff]")
SENT_MULTI = re.compile(r'(?<=[.!?。！？；؛।؟])\s*')
LABEL = re.compile(r"^([^\n:：]{1,60})([:：])\s*(.*)$", re.S)

# locale -> (计数方式, 下限, 上限, 合并分隔符)
PROFILE = {
    "en": ("word", 55, 110, " "),
    "zh": ("han", 80, 160, ""),
    "es": ("word", 55, 110, " "),
    "fr": ("word", 55, 110, " "),
    "pt": ("word", 55, 110, " "),
    "de": ("word", 55, 110, " "),
    "ru": ("word", 55, 110, " "),
    "ar": ("word", 55, 110, " "),
    "hi": ("word", 55, 110, " "),
    "ja": ("char", 100, 200, ""),
}
ALL = list(PROFILE)


def mask(text):
    """把 HTML 标签换成占位符，返回 (遮罩文本, [(占位符, 原标签)])"""
    store = []

    def rep(m):
        store.append(m.group(0))
        return f"\x00{len(store) - 1}\x00"

    return TAG.sub(rep, text), store


def unmask(text, store):
    def rep(m):
        i = int(m.group(1))
        return store[i] if i < len(store) else m.group(0)

    return re.sub(r"\x00(\d+)\x00", rep, text)


def count(text, mode):
    plain = TAG.sub(" ", text)
    if mode == "han":
        return len(HAN.findall(plain))
    if mode == "char":
        return len(re.findall(r"[^\s　]", TAG.sub("", text)))
    if mode == "word":
        return len(UNIWORDS.findall(plain))
    return len(WORDS.findall(plain))


def split_units(text, mode, sep):
    if "\n\n" in text:
        raw = [x.strip() for x in text.split("\n\n") if x.strip()]
    elif "\n" in text:
        raw = [x.strip() for x in text.split("\n") if x.strip()]
    else:
        raw = [s.strip() for s in SENT_MULTI.split(text.strip()) if s.strip()]
    return raw


def is_list_style(units):
    if len(units) < 4:
        return False
    hit = sum(1 for u in units if LABEL.match(u))
    return hit / len(units) >= 0.5


def regroup(units, mode, lo, hi, sep, depth=0):
    paras, buf, bw = [], [], 0
    for u in units:
        uw = count(u, mode)
        if uw > hi * 2 and depth < 3:
            sub = split_units(u, mode, sep)
            if len(sub) > 1 and sub[0] != u:
                paras.extend(regroup(sub, mode, lo, hi, sep, depth + 1))
                continue
            if buf:
                paras.append(sep.join(buf))
                buf, bw = [], 0
            paras.append(u)
            continue
        buf.append(u)
        bw += uw
        if bw >= lo:
            paras.append(sep.join(buf))
            buf, bw = [], 0
    if buf:
        joined = sep.join(buf)
        if paras and count(paras[-1], mode) < lo:
            paras[-1] += sep + joined if sep else joined
        else:
            paras.append(joined)
    return [x.strip() for x in paras if x.strip()]


def to_html(text, locale):
    mode, lo, hi, sep = PROFILE[locale]
    masked, store = mask(text)
    units = split_units(masked, mode, sep)
    if is_list_style(units):
        out = []
        for u in units:
            m = LABEL.match(u)
            if m and m.group(2):
                out.append(f"<p><strong>{m.group(1).strip()}</strong>{m.group(2)} {m.group(3).strip()}</p>")
            else:
                out.append(f"<p>{u}</p>")
        return unmask("\n".join(out), store)
    paras = regroup(units, mode, lo, hi, sep)
    return unmask("\n".join(f"<p>{p}</p>" for p in paras), store)


def same_text(a, b):
    """去空白后逐字相等——唯一的写回准入条件"""
    ta = re.sub(r"\s+", "", TAG.sub("", a))
    tb = re.sub(r"\s+", "", TAG.sub("", b))
    return ta == tb


def dedupe(text):
    """删掉同段内逐字重复的段落（>80 字符），保留首次出现。"""
    paras = [p for p in re.split(r"</p>", text) if "<p>" in p]
    if not paras:
        return text, 0
    keep, seen, drops = [], set(), 0
    for p in paras:
        key = re.sub(r"\s+", " ", TAG.sub("", p)).strip().lower()
        if len(key) > 80 and key in seen:
            drops += 1
            continue
        seen.add(key)
        keep.append(p.strip())
    return "\n".join(x + "</p>" if not x.endswith("</p>") else x for x in keep), drops


def run(slug=None, locales=None, apply=False, dedupe_mode=False, show=False):
    files = [os.path.join(ART, f"{slug}.json")] if slug else sorted(glob.glob(os.path.join(ART, "*.json")))
    stats = {lg: [0, 0, 0, 0] for lg in locales}  # 处理, 段数, 跳过, 自检失败
    drops_all = 0
    changed_files = []

    for f in files:
        with open(f, encoding="utf-8") as fh:
            data = json.load(fh)
        if data.get("redirectTo"):
            continue
        slate = data["slug"]
        dirty = False
        for s in data.get("sections") or []:
            body = s.get("body") or {}
            for lg in locales:
                b = body.get(lg)
                if not isinstance(b, str) or not b.strip():
                    continue
                if dedupe_mode:
                    if "<p>" in b:
                        new, drops = dedupe(b)
                        if drops:
                            drops_all += drops
                            body[lg] = new
                            dirty = True
                            if show:
                                print(f"  dedupe {slate}/{lg}: -{drops} 段")
                    continue
                if "<p>" in b or "<ul" in b or "<table" in b:
                    continue
                if len(TAG.sub("", b)) < 300:
                    stats[lg][2] += 1
                    continue
                out = to_html(b, lg)
                if not same_text(b, out):
                    stats[lg][3] += 1
                    print(f"  !! 自检失败，跳过 {slate}/{lg}")
                    continue
                stats[lg][0] += 1
                stats[lg][1] += out.count("<p>")
                if show:
                    print(f"  {slate}/{lg}: {out.count('<p>')} 段 | {out[:70]}…")
                body[lg] = out
                dirty = True
        if dirty:
            changed_files.append(f)
            if apply:
                with open(f, "w", encoding="utf-8") as fh:
                    json.dump(data, fh, ensure_ascii=False, indent=2)
                    fh.write("\n")

    for lg in locales:
        p, n, skip, bad = stats[lg]
        if dedupe_mode:
            continue
        print(f"{lg:>3}: 处理 {p} 节 → {n} 段（平均 {n / max(p, 1):.1f}）；跳过 {skip} 节（短于 300 字）；自检失败 {bad}")
    if dedupe_mode:
        print(f"去重删除段落 {drops_all} 处，涉及文件 {len(changed_files)}")
    else:
        print(f"{'已写入' if apply else 'dry-run，未写入'}：{len(changed_files)} 个文件")
    return stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dedupe", action="store_true")
    ap.add_argument("--show", action="store_true")
    ap.add_argument("--locale", default="all",
                    help="all / both(=en,zh) / 单语种，或逗号分隔如 es,fr")
    a = ap.parse_args()
    if a.locale == "all":
        locales = ALL
    elif a.locale == "both":
        locales = ["en", "zh"]
    else:
        locales = [x.strip() for x in a.locale.split(",") if x.strip()]
        bad = [x for x in locales if x not in PROFILE]
        if bad:
            raise SystemExit(f"未知语种: {bad}；可选 {ALL}")
    run(a.slug, locales, a.apply, a.dedupe, a.show)


if __name__ == "__main__":
    main()
