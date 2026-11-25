#!/usr/bin/env python3
"""存量内容的后处理修复：alt-fill / fit-meta / kw-pad。

设计原则：只做"字段层面的可判定修复"，不生成正文；默认 dry-run，加 --apply 才落盘。
所有子命令都可重复执行（幂等）。

用法:
  python3 scripts/polish_content_contract.py alt-fill [--apply]
  python3 scripts/polish_content_contract.py fit-meta [--apply]
  python3 scripts/polish_content_contract.py kw-pad  [--apply]
"""
import argparse, glob, json, re, sys
from pathlib import Path

LANGS = ["en", "zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]
ART = Path("content/articles")
STOP = {
    "es": ["para", "con", "los", "las", "de", "del", "en", "cómo", "fijaciones", "pernos", "guía"],
    "fr": ["pour", "des", "les", "et", "guide", "fixations", "vis", "la", "le", "avec"],
    "pt": ["para", "com", "os", "as", "e", "guia", "parafusos", "fixadores", "de"],
    "de": ["für", "und", "mit", "der", "die", "das", "schrauben", "gewinde", "befestigung"],
}


def is_native(text, lg):
    if not text:
        return False
    if lg in ("zh", "ja", "ru", "ar", "hi"):
        return any(ord(c) > 127 for c in text)
    words = re.findall(r"[A-Za-zÀ-ÿ]+", text.lower())
    hits = sum(1 for w in words if w in STOP.get(lg, []))
    accent = any(ord(c) > 127 for c in text)
    return hits >= 2 or (accent and hits >= 1)


def han_count(text):
    return len(re.findall(r"[\u4e00-\u9fff]", text or ""))


def files():
    return sorted(glob.glob(str(ART / "*.json")))


def load(p):
    return json.load(open(p, encoding="utf-8"))


def save(p, d):
    json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(p, "a", encoding="utf-8").write("\n")


def make_alt(title, lg):
    t = (title or "").strip()[:118].rstrip(" ,;，；:：-")
    if not t:
        return None
    return f"{t}｜TradeGo 紧固件" if lg == "zh" else f"{t} - TradeGo Fasteners"


# ---------- alt-fill ----------
def alt_fill(d):
    alt, title = d.get("imageAlt"), d.get("title") or {}
    if not isinstance(alt, dict):
        return 0
    n = 0
    for lg in LANGS:
        v = alt.get(lg)
        cand_src = title.get(lg)
        if lg != "en" and (not v or not is_native(v, lg) or (lg == "zh" and han_count(v) < 6)):
            if is_native(cand_src or "", lg) or lg in ("zh",):
                new = make_alt(cand_src, lg)
                if new and new != v:
                    alt[lg] = new
                    n += 1
    return n


# ---------- fit-meta ----------
TAIL = [
    "Contact TradeGo for specifications, MOQ and CIF pricing.",
    "TradeGo quotes CIF prices with mill test reports included.",
    "Request a specification-matched quote from TradeGo.",
]


def trim(text, hi):
    if len(text) <= hi:
        return text
    cut = text[: hi - 1]
    cut = cut[: cut.rfind(" ")] if cut.rfind(" ") > 30 else cut
    return cut.rstrip(" ,;:-") + "."


def fit_one(text, lo, hi, slug):
    if not text:
        return text
    if len(text) > hi:
        return trim(text, hi)
    if len(text) < lo:
        tail = TAIL[sum(map(ord, slug)) % len(TAIL)]
        cand = text.rstrip()
        if not cand.endswith("."):
            cand += "."
        cand = f"{cand} {tail}"
        if len(cand) > hi:
            return trim(cand, hi)
        return cand
    return text


def fit_meta(d):
    n = 0
    for key, lo, hi in (("description", 110, 190), ("metaDescription", 120, 165)):
        field = d.get(key)
        if not isinstance(field, dict):
            continue
        cur = field.get("en")
        new = fit_one(cur, lo, hi, d.get("slug", ""))
        if new and new != cur:
            field["en"] = new
            n += 1
    return n


# ---------- kw-pad ----------
POOL = [
    "fastener supplier China",
    "OEM fastener manufacturer",
    "mill test certificate fastener",
    "CIF Africa fastener pricing",
    "bulk fastener export",
    "hot dip galvanized fasteners",
]


def kw_list(v):
    if isinstance(v, list):
        return [x.strip() for x in v if x.strip()]
    if isinstance(v, str):
        return [x.strip() for x in v.split(",") if x.strip()]
    return []


def kw_pad(d):
    kws = kw_list(d.get("keywords"))
    if len(kws) >= 5:
        return 0
    low = {k.lower() for k in kws}
    for c in POOL:
        if len(kws) >= 5:
            break
        if c.lower() not in low:
            kws.append(c)
            low.add(c.lower())
    if isinstance(d.get("keywords"), list):
        d["keywords"] = kws
    else:
        d["keywords"] = ", ".join(kws)
    return 1


CMDS = {"alt-fill": alt_fill, "fit-meta": fit_meta, "kw-pad": kw_pad}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=CMDS)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--slug", default=None)
    a = ap.parse_args()
    fn = CMDS[a.cmd]
    touched = fields = 0
    for p in files():
        d = load(p)
        if a.slug and d.get("slug") != a.slug:
            continue
        n = fn(d)
        if n:
            touched += 1
            fields += n
            if a.apply:
                save(p, d)
            print(f"{'✓' if a.apply else '·'} {d.get('slug')}: {n}")
    print(f"\n[{a.cmd}] 命中 {touched} 篇 / {fields} 处" + ("（已写入）" if a.apply else "（dry-run，加 --apply 落盘）"))


if __name__ == "__main__":
    sys.exit(main())
