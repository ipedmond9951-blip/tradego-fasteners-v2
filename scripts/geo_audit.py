#!/usr/bin/env python3
"""GEO/SEO 体检：回答引擎能不能从这一页里直接取走一句可引用的话。

只报告，不阻塞。用法:
  python3 scripts/geo_audit.py                 # 汇总 + 最差 20 篇
  python3 scripts/geo_audit.py --slug X        # 单篇详情
  python3 scripts/geo_audit.py --top 40 --json # 机器可读
  python3 scripts/geo_audit.py --locale zh     # 只看中文

量什么（都针对 en，除非 --locale）：
  p1       首段词数（回答引擎取摘要的地方；40–130 词最佳）
  echo     首段是否逐字复述标题（模板指纹，等于没给答案）
  qh       小标题里问句占比（GEO 靠问题-答案对齐；≥25% 好）
  ent      正文里可核实体密度：尺寸/性能/温度/标准号（每千词命中数）
  faq      FAQ 可渲染条数、答案平均词数、问句本语种合规率 q_ok（≥3 条、答案 ≥80 词、q_ok ≥0.8）
  def      正文是否有一句"X 是/指的是…"式定义句
评分 0-100，权重见 WEIGHTS。
"""
import json, re, sys, glob, argparse, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
TAG = re.compile(r"<[^>]+>")
WORDS = re.compile(r"[A-Za-z0-9'’\-]+")
HAN = re.compile(r"[\u4e00-\u9fff]")

Q_EN = re.compile(r"^(how|why|what|when|where|which|who|should|does|do|can|is|are|was|will|would)\b", re.I)
Q_ZH = re.compile(r"(怎么|如何|为什么|为何|是否|哪些|多少|能不能|要不要|多久|多大)")
ENT = re.compile(
    r"\b(?:M\d{1,2}(?:\.\d)?|#\d{1,2}|\d+(?:\.\d+)?\s?(?:mm|cm|m|MPa|kN|N·m|Nm|°C|%|pcs|kg|days?)(?![A-Za-z0-9]))"
    r"|\b(?:DIN|ISO|EN|ANSI|ASTM|JIS|GB|SANS|SABS|IS|BS)\s?[\d\-]{2,}",
    re.I,
)
DEF_EN = re.compile(r"\b(is|are|refers to|means|describes)\b[^.]{10,120}\.", re.I)
DEF_ZH = re.compile(r"(指的是|是指|是指那种|意思是)[^。]{5,60}。")
# 非英语的定义句与问句标记：原先只认英文，导致 es/fr/pt/de/ru/ar/hi/ja 的 def 恒为 0，
# 那是量具问题不是内容问题。这里只收"强定义动词/疑问词"，避免 any sentence 误命中。
DEF_MULTI = {
    "es": re.compile(r"(se refiere a|se define como|significa|consiste en|es un tipo de|son un tipo de)", re.I),
    "fr": re.compile(r"(désigne|se réfère à|signifie|consiste à|est un type de|sont un type de)", re.I),
    "pt": re.compile(r"(refere-se a|significa|consiste em|é um tipo de|são um tipo de)", re.I),
    "de": re.compile(r"(bezeichnet|bedeutet|besteht aus|ist eine Art|sind eine Art)", re.I),
    "ru": re.compile(r"(означает|относится к|представляет собой)", re.I),
    "ar": re.compile(r"(يعني|يشير إلى|عبارة عن)"),
    "hi": re.compile(r"(का अर्थ|को दर्शाता|का मतलब)"),
    "ja": re.compile(r"(とは|を指す|のことです)"),
}
Q_MULTI = {
    "es": re.compile(r"^(qué|cómo|cuál|cuáles|por qué|cuándo|dónde|quién)\b", re.I),
    "fr": re.compile(r"^(quel|quelle|quels|quelles|comment|pourquoi|quand|où|qui)\b", re.I),
    "pt": re.compile(r"^(qual|quais|como|por que|porque|quando|onde|quem)\b", re.I),
    "de": re.compile(r"^(was|wie|warum|wann|wo|wer|welche|welcher)\b", re.I),
    "ru": re.compile(r"^(что|как|почему|когда|где|кто|какой)\b", re.I),
    "ar": re.compile(r"^(ما|كيف|لماذا|متى|أين|من)"),
    "hi": re.compile(r"^(क्या|कैसे|क्यों|कब|कहाँ)"),
    "ja": re.compile(r"(とは|なぜ|どう|どの|いつ)"),
}


WEIGHTS = {"p1": 20, "echo": 15, "qh": 15, "ent": 20, "faq": 20, "def": 10}


def pick_field(v, locale):
    """FAQ 的 q/a 在不同文章里既可能是字符串，也可能是 {locale: text} 字典。"""
    if isinstance(v, dict):
        return v.get(locale) or v.get("en") or next(iter(v.values()), "") or ""
    return v or ""


def count_words(t, locale):
    """按书写系统切词：拉丁按词、CJK 按字折算、西里尔/阿拉伯/天城文按空白切。

    旧实现只用 [A-Za-z0-9] 计词，俄语/阿拉伯语/印地语正文里只剩 ISO 898 这类拉丁串，
    分母被压到几十，实体密度被放大到 100–185/千词（实测 ru 155.6）。这里按脚本分开算。
    """
    plain = TAG.sub(" ", t or "")
    if locale in ("zh", "ja"):
        cjk = len(re.findall(r"[\u4e00-\u9fff\u3040-\u30ff]", plain))
        if cjk:
            return int(round(cjk * 0.6))
    if locale in ("ru", "ar", "hi", "fa", "ur", "th", "ko"):
        toks = [w for w in re.split(r"\s+", re.sub(r"[^\w\u0600-\u06ff\u0900-\u097f]+", " ", plain)) if w]
        if toks:
            return len(toks)
    return len(WORDS.findall(plain))


def words(t, locale):
    """正文取字段：历史沿用 pick_field（缺键回退 en），正文口径不变。"""
    return count_words(pick_field(t, locale), locale)


def faq_answer_words(a, locale):
    """FAQ 答案按语种 fail-closed：`a` 为 dict 时只取本语种键；该语种缺键或值空 → 该条计 0 词。
    `a` 为纯字符串则视为语种无关照常计词。不向 en 回退，避免非英语种拿英文答案词数计分虚高。"""
    if isinstance(a, dict):
        v = a.get(locale)
        if not v:
            return 0
        return count_words(v, locale)
    return count_words(a or "", locale)


def faq_text(v, locale):
    """FAQ 条目字段按语种 fail-closed 取本语种纯文本（去空白）；缺键/空值返回空串，不回退 en。"""
    if isinstance(v, dict):
        return str(v.get(locale) or "").strip()
    return str(v or "").strip()


def faq_en_text(v):
    """问句对照基线：dict 取 en，纯字符串原样返回。"""
    if isinstance(v, dict):
        return str(v.get("en") or "").strip()
    return str(v or "").strip()


NON_LATIN_LOCS = ("zh", "ja", "ru", "ar", "hi", "ko", "th")
STD_PREFIX = {"ISO", "DIN", "EN", "ANSI", "ASTM", "JIS", "GB", "SANS", "SABS", "IS", "BS", "ASME"}
UNIT_TOKENS = {"mm", "cm", "m", "mpa", "kn", "n", "nm", "n·m", "kg", "pcs", "°c", "%"}
LATIN_TOKEN = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’.\-]*")
GRADE_TOKEN = re.compile(r"^\d+(?:\.\d+)?$")
SPEC_TOKEN = re.compile(r"^[Mm]\d")


def _latin_prose_words(qtext):
    """抽出问句里的拉丁词，并豁免标准号（ISO 898-1）、牌号（8.8）、规格（M10）、单位（N·m）。"""
    toks = LATIN_TOKEN.findall(qtext)
    prose, i = [], 0
    while i < len(toks):
        t = toks[i]
        tl = t.lower()
        if GRADE_TOKEN.match(t) or tl in UNIT_TOKENS or SPEC_TOKEN.match(t):
            i += 1
            continue
        if t.upper() in STD_PREFIX and i + 1 < len(toks) and re.match(r"^\d", toks[i + 1]):
            i += 2  # ISO 898-1 / DIN 931 整条标准号豁免
            continue
        prose.append(tl)
        i += 1
    return prose


def q_native_ok(q, locale):
    """问句是否为本地语言原生表达（未拿英文冒充）。

    - en：天然合规，直接 True。
    - 非拉丁语种（zh/ja/ru/ar/hi/ko/th）：问句里出现连续 ≥3 个未豁免拉丁词即不合规。
    - 拉丁语种（es/fr/pt/de）：与同条 q.en 逐字相同，或词集 Jaccard > 0.75 即不合规。
    """
    if locale == "en":
        return True
    qt = faq_text(q, locale)
    if not qt:
        return False
    if locale in NON_LATIN_LOCS:
        run = 0
        for w in _latin_prose_words(qt):
            run = run + 1 if re.search(r"[a-z]", w) else 0
            if run >= 3:
                return False
        return True
    qen = faq_en_text(q)
    if not qen:
        return True
    if TAG.sub(" ", qt).strip().lower() == TAG.sub(" ", qen).strip().lower():
        return False
    ws = lambda s: set(WORDS.findall(s.lower()))
    a, b = ws(qt), ws(qen)
    if a and b and len(a & b) / len(a | b) > 0.75:
        return False
    return True


def paras(body):
    return [p for p in re.split(r"</p>", body) if "<p>" in p]


def audit(path, locale="en"):
    d = json.load(open(path, encoding="utf-8"))
    if d.get("redirectTo"):
        return None
    slug, title = d.get("slug"), (d.get("title") or {}).get(locale, "")
    secs = d.get("sections") or []
    body_all, heads, faqs = [], [], []
    for s in secs:
        b = (s.get("body") or {}).get(locale, "")
        body_all.append(b)
        h = (s.get("heading") or {}).get(locale, "")
        if h:
            heads.append(h)
        faqs += s.get("faqItems") or []
    full = "".join(body_all)
    ps = paras(full)
    first = TAG.sub(" ", ps[0]).strip() if ps else ""
    p1 = words(first, locale)

    echo = 0
    tkey = re.sub(r"[^a-z0-9\u4e00-\u9fff ]", " ", (title or "").lower())
    fkey = re.sub(r"[^a-z0-9\u4e00-\u9fff ]", " ", first.lower())
    ttoks = [w for w in tkey.split() if len(w) > 3]
    if ttoks:
        hit = sum(1 for w in ttoks if w in fkey)
        echo = 1 if hit / len(ttoks) >= 0.6 else 0

    qh = 0
    if heads:
        for h in heads:
            hs = h.strip()
            if hs.endswith(("?", "？", "؟")) or Q_EN.match(hs) or Q_ZH.search(hs) or Q_MULTI.get(locale, Q_EN).match(hs):
                qh += 1
    qh_ratio = qh / len(heads) if heads else 0

    wc = words(full, locale) or 1
    ent = len(ENT.findall(TAG.sub(" ", full))) * 1000 / wc

    # fq 只计本语种可渲染条目：q 与 a 都有本语种非空文本（与页面 nativeText 过滤同口径）；
    # 渲染不出来的条目不进 fa 均值分母，也不进 q_ok 分子。
    renderable = []
    for x in faqs:
        if faq_text(x.get("q", ""), locale) and faq_text(x.get("a", ""), locale):
            renderable.append(x)
    fq = len(renderable)
    fa = round(sum(faq_answer_words(x.get("a", ""), locale) for x in renderable) / fq) if fq else 0

    if fq:
        ok = sum(1 for x in renderable if q_native_ok(x.get("q", ""), locale))
        q_ok = round(ok / fq, 2)
    else:
        q_ok = 0.0

    txt = TAG.sub("", full)
    if locale == "zh":
        deff = 1 if DEF_ZH.search(txt) else 0
    elif locale == "en":
        deff = 1 if DEF_EN.search(txt) else 0
    else:
        deff = 1 if (DEF_EN.search(txt) or DEF_MULTI.get(locale, DEF_EN).search(txt)) else 0

    s = 0
    s += WEIGHTS["p1"] * (1 if 40 <= p1 <= 130 else 0.5 if 15 <= p1 < 40 or 130 < p1 <= 200 else 0)
    s += WEIGHTS["echo"] * (0 if echo else 1)
    s += WEIGHTS["qh"] * min(qh_ratio / 0.25, 1)
    s += WEIGHTS["ent"] * min(ent / 6, 1)
    faq_full = fq >= 3 and fa >= 80 and q_ok >= 0.8
    faq_half = fq >= 3 and not faq_full
    s += WEIGHTS["faq"] * (1 if faq_full else 0.5 if faq_half else 0)
    s += WEIGHTS["def"] * deff
    return {
        "slug": slug, "score": round(s), "words": wc,
        "p1": p1, "echo": echo, "qh": round(qh_ratio, 2), "ent": round(ent, 1),
        "faq": fq, "fa": fa, "q_ok": q_ok, "def": deff,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--top", type=int, default=20)
    ap.add_argument("--locale", default="en")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    rows = []
    for f in sorted(glob.glob(os.path.join(ART, "*.json"))):
        r = audit(f, a.locale)
        if r:
            rows.append(r)
    if a.slug:
        for r in rows:
            if r["slug"] == a.slug:
                print(json.dumps(r, ensure_ascii=False, indent=2))
                return
        print("not found:", a.slug); return
    if not rows:
        print("no articles"); return

    if a.json:
        print(json.dumps(rows, ensure_ascii=False)); return

    n = len(rows)
    avg = round(sum(r["score"] for r in rows) / n, 1)
    band = {"A 90+": 0, "B 80-89": 0, "C 70-79": 0, "D 60-69": 0, "E <60": 0}
    for r in rows:
        s = r["score"]
        k = "A 90+" if s >= 90 else "B 80-89" if s >= 80 else "C 70-79" if s >= 70 else "D 60-69" if s >= 60 else "E <60"
        band[k] += 1
    print(f"篇数 {n} | 平均 {avg} | " + " ".join(f"{k}:{v}" for k, v in band.items()))
    print(f"首段复述标题(echo): {sum(r['echo'] for r in rows)} 篇 | FAQ 不足 3 条: {sum(1 for r in rows if r['faq'] < 3)} 篇 | 实体密度<2/千词: {sum(1 for r in rows if r['ent'] < 2)} 篇")
    print(f"\n最差 {a.top} 篇:")
    for r in sorted(rows, key=lambda x: x["score"])[:a.top]:
        print(f"{r['score']:>3}  p1={r['p1']:<3} echo={r['echo']} qh={r['qh']:<4} ent={r['ent']:<4} faq={r['faq']}/{r['fa']}/q{r['q_ok']}  {r['slug']}")


if __name__ == "__main__":
    main()
