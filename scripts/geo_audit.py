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
  faq      FAQ 条数与答案平均词数（≥3 条、答案 ≥80 词）
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
    r"\b(?:M\d{1,2}(?:\.\d)?|#\d{1,2}|\d+(?:\.\d+)?\s?(?:mm|cm|m|MPa|kN|N·m|Nm|°C|%|pcs|kg|days?)\b)"
    r"|\b(?:DIN|ISO|EN|ANSI|ASTM|JIS|GB|SANS|SABS|IS|BS)\s?[\d\-]{2,}",
    re.I,
)
DEF_EN = re.compile(r"\b(is|are|refers to|means|describes)\b[^.]{10,120}\.", re.I)
DEF_ZH = re.compile(r"(指的是|是指|是指那种|意思是)[^。]{5,60}。")

WEIGHTS = {"p1": 20, "echo": 15, "qh": 15, "ent": 20, "faq": 20, "def": 10}


def pick_field(v, locale):
    """FAQ 的 q/a 在不同文章里既可能是字符串，也可能是 {locale: text} 字典。"""
    if isinstance(v, dict):
        return v.get(locale) or v.get("en") or next(iter(v.values()), "") or ""
    return v or ""


def words(t, locale):
    """按书写系统切词：拉丁按词、CJK 按字折算、西里尔/阿拉伯/天城文按空白切。

    旧实现只用 [A-Za-z0-9] 计词，俄语/阿拉伯语/印地语正文里只剩 ISO 898 这类拉丁串，
    分母被压到几十，实体密度被放大到 100–185/千词（实测 ru 155.6）。这里按脚本分开算。
    """
    t = pick_field(t, locale)
    plain = TAG.sub(" ", t)
    if locale in ("zh", "ja"):
        cjk = len(re.findall(r"[\u4e00-\u9fff\u3040-\u30ff]", plain))
        if cjk:
            return int(round(cjk * 0.6))
    if locale in ("ru", "ar", "hi", "fa", "ur", "th", "ko"):
        toks = [w for w in re.split(r"\s+", re.sub(r"[^\w\u0600-\u06ff\u0900-\u097f]+", " ", plain)) if w]
        if toks:
            return len(toks)
    return len(WORDS.findall(plain))


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
            qh += 1 if (h.strip().endswith("?") or Q_EN.match(h.strip()) or Q_ZH.search(h)) else 0
    qh_ratio = qh / len(heads) if heads else 0

    wc = words(full, locale) or 1
    ent = len(ENT.findall(TAG.sub(" ", full))) * 1000 / wc

    fq = len(faqs)
    fa = round(sum(words(x.get("a", ""), locale) for x in faqs) / fq) if fq else 0

    txt = TAG.sub("", full)
    deff = 1 if (DEF_ZH.search(txt) if locale == "zh" else DEF_EN.search(txt)) else 0

    s = 0
    s += WEIGHTS["p1"] * (1 if 40 <= p1 <= 130 else 0.5 if 15 <= p1 < 40 or 130 < p1 <= 200 else 0)
    s += WEIGHTS["echo"] * (0 if echo else 1)
    s += WEIGHTS["qh"] * min(qh_ratio / 0.25, 1)
    s += WEIGHTS["ent"] * min(ent / 6, 1)
    s += WEIGHTS["faq"] * (1 if fq >= 3 and fa >= 80 else 0.5 if fq >= 3 else 0)
    s += WEIGHTS["def"] * deff
    return {
        "slug": slug, "score": round(s), "words": wc,
        "p1": p1, "echo": echo, "qh": round(qh_ratio, 2), "ent": round(ent, 1),
        "faq": fq, "fa": fa, "def": deff,
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
        print(f"{r['score']:>3}  p1={r['p1']:<3} echo={r['echo']} qh={r['qh']:<4} ent={r['ent']:<4} faq={r['faq']}/{r['fa']}  {r['slug']}")


if __name__ == "__main__":
    main()
