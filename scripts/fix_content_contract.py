#!/usr/bin/env python3
"""内容契约的一次性修复器：只做「可确定性生成、不编造内容」的修复。

用法：
  python3 scripts/fix_content_contract.py meta   --dry-run   # 重组被英文污染的 metaDescription
  python3 scripts/fix_content_contract.py meta   --apply
  python3 scripts/fix_content_contract.py date   --apply     # updated 早于 date → 对齐
  python3 scripts/fix_content_contract.py image  --apply     # 配图缺失 → 找同 slug / 同分类的现成图

原则：
  - 只用文章里**已有的本地化 title + description** 重组元描述，不新造事实、不翻译。
  - 只处理非 en 语种；en 永远不动。
  - 每个改动都打印 before → after 摘要，--apply 才落盘。
"""
import argparse
import json
import os
import re
import sys

LANGS = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]
ART = "content/articles"
PUB = "public/images/articles"
META_MIN, META_MAX = 110, 165

EN_STOP = re.compile(r"\b(the|and|with|your|this|that|these|those|about|which|should|from)\b")
SCRIPTS = {
    "zh": r"[\u4e00-\u9fff]",
    "ar": r"[\u0600-\u06ff]",
    "ru": r"[\u0400-\u04ff]",
    "hi": r"[\u0900-\u097f]",
    "ja": r"[\u3040-\u30ff\u4e00-\u9fff]",
}


def english_run(text, min_words=4):
    best = cur = 0
    prev_end = -1
    for m in re.finditer(r"[A-Za-z][A-Za-z'\u2019-]*", text or ""):
        gap = text[prev_end:m.start()] if prev_end >= 0 else ""
        if prev_end >= 0 and gap.strip() == "" and len(gap) <= 3:
            cur += 1
        else:
            cur = 1
        best = max(best, cur)
        prev_end = m.end()
    return best


def looks_englishish(text, lg):
    """这段本地化字段是否被英文污染"""
    if not text:
        return False
    if lg in ("zh", "ar", "ru", "hi", "ja"):
        if english_run(text) >= 4:
            return True
        # 该语种字符几乎为零、但有成段英文
        rx = SCRIPTS.get(lg)
        if rx and len(re.findall(rx, text)) < 6 and english_run(text) >= 3:
            return True
        return False
    return len(EN_STOP.findall(text.lower())) >= 3


def localize_ok(text, lg):
    """素材本身是不是真的本地化内容"""
    if not text:
        return False
    rx = SCRIPTS.get(lg)
    if rx:
        return len(re.findall(rx, text)) >= 6 and english_run(text) < 4
    return not looks_englishish(text, lg)


def deenglish(text):
    """剥掉句子里残留的英文整段（≥4 连词）与引用角标，只留本语种表达"""
    t = re.sub(r"\[\d+\]", "", text or "")
    t = re.sub(r"(?:[A-Za-z][A-Za-z'\u2019-]{1,}\s+){3,}[A-Za-z][A-Za-z'\u2019-]{1,}", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"^[，。、：:；;\-\s]+", "", t)
    t = re.sub(r"([，。：])\s*\1+", r"\1", t)
    t = re.sub(r"：\s*：", "：", t)
    return t.strip()



def residual_latin(text):
    """数一数仍像"英文单词"的残留，标准号/型号/缩写不算"""
    bad = 0
    for tok in re.findall(r"[A-Za-z][A-Za-z0-9\-/.]*", text or ""):
        if re.fullmatch(r"[A-Z]{2,}[0-9A-Z\-/]*", tok):        # ISO ASTM SGR HDG
            continue
        if re.fullmatch(r"[A-Za-z]+[0-9][0-9A-Za-z\-/]*", tok):  # A325 M16 ISO4014
            continue
        if re.fullmatch(r"[0-9A-Za-z]*[.][0-9A-Za-z]+", tok):     # 8.8 10.9
            continue
        if len(tok) >= 3 and tok.lower() == tok:
            bad += 1
    return bad

def clip(text, limit):
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    cut = text[: limit - 1]
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut.rstrip(" ,.;:-") + "…"


def build_meta(d, lg):
    title = (d.get("title") or {}).get(lg) or ""
    desc = (d.get("description") or {}).get(lg) or ""
    if not localize_ok(title, lg) or not localize_ok(desc, lg):
        return None
    if len(desc) >= META_MIN:
        out = clip(desc, META_MAX)
        return deenglish(out) if lg not in ("es", "fr", "pt", "de") else out
    combo = f"{title.rstrip(' 。.')}：{desc}" if lg in ("zh", "ja") else f"{title.rstrip(' .')}. {desc}"
    combo = deenglish(combo) if lg not in ("es", "fr", "pt", "de") else combo
    if lg in SCRIPTS and residual_latin(combo) >= 2:
        return None
    if len(combo) < META_MIN:
        return None
    return clip(combo, META_MAX)


def iter_articles(only=None):
    for fn in sorted(os.listdir(ART)):
        if not fn.endswith(".json"):
            continue
        slug = fn[:-5]
        if only and slug != only:
            continue
        path = os.path.join(ART, fn)
        with open(path, encoding="utf-8") as f:
            yield slug, path, json.load(f)


def fix_meta(apply, only=None):
    changed = 0
    skipped = 0
    for slug, path, d in iter_articles(only):
        if d.get("redirectTo"):
            continue
        meta = d.get("metaDescription")
        if not isinstance(meta, dict):
            continue
        dirty = False
        for lg in LANGS:
            cur = meta.get(lg) or ""
            if looks_englishish(cur, lg):
                new = build_meta(d, lg)
                if new:
                    print(f"[{slug}] meta.{lg}\n   - {cur[:110]}\n   + {new[:110]}")
                    meta[lg] = new
                    dirty = True
                else:
                    skipped += 1
                    print(f"[{slug}] meta.{lg} 素材不足，留待人工：{cur[:80]}")
        if dirty:
            changed += 1
            if apply:
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(d, f, ensure_ascii=False, indent=2)
                    f.write("\n")
    print(f"\nmeta: 处理 {changed} 篇，跳过 {skipped} 个字段")


def strip_html(t):
    t = re.sub(r"<[^>]+>", " ", t or "")
    t = (t.replace("&nbsp;", " ").replace("&amp;", "&").replace("&#8217;", "’")
         .replace("&quot;", '"').replace("&mdash;", "—").replace("&#8212;", "—"))
    return re.sub(r"\s+", " ", t).strip()


def lead_text(d, lg, limit, need_min=110):
    """用该语种已有正文的首句拼出摘要，不新造内容"""
    parts = [strip_html((sec.get("body") or {}).get(lg) or "") for sec in d.get("sections", []) or []]
    body = " ".join(p for p in parts if p)
    if not body:
        return None
    sent = re.split(r"(?<=[.!?。！？؟])\s*", body)
    out = ""
    for c in sent:
        if not c.strip():
            continue
        if len(out) + len(c) > limit:
            break
        c = deenglish(c.strip()) if lg not in ("es", "fr", "pt", "de") else c.strip()
        if not c:
            continue
        out += (" " if out and lg not in ("zh", "ja") else "") + c
        if len(out) >= need_min:
            break
    out = out.strip()
    if len(out) < need_min:
        title = (d.get("title") or {}).get(lg) or ""
        joined = f"{title.rstrip(' 。.')}：{out}" if lg in ("zh", "ja") else f"{title.rstrip(' .')}. {out}"
        out = joined if len(joined) >= need_min else None
    if not out:
        return None
    if lg in SCRIPTS and residual_latin(out) >= 2:
        return None
    return clip(out, limit)


def fix_extract(apply, only=None):
    """metaDescription / description 被英文污染时，改用本语种正文首句重建"""
    changed = 0
    miss = 0
    for slug, path, d in iter_articles(only):
        if d.get("redirectTo"):
            continue
        dirty = False
        for key, limit, lo in (("metaDescription", META_MAX, META_MIN), ("description", 190, 110)):
            field = d.get(key)
            if not isinstance(field, dict):
                continue
            for lg in LANGS:
                cur = field.get(lg) or ""
                if not looks_englishish(cur, lg):
                    continue
                if key == "metaDescription":
                    new = build_meta(d, lg) or lead_text(d, lg, limit, lo)
                else:
                    new = lead_text(d, lg, limit, lo)
                if new:
                    print(f"[{slug}] {key}.{lg}\n   - {cur[:100]}\n   + {new[:100]}")
                    field[lg] = new
                    dirty = True
                else:
                    miss += 1
                    print(f"[{slug}] {key}.{lg} 正文素材不足，留待人工")
        if dirty:
            changed += 1
            if apply:
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(d, f, ensure_ascii=False, indent=2)
                    f.write("\n")
    print(f"\nextract: 处理 {changed} 篇，{miss} 个字段仍缺素材")


PH = ("内容即将发布", "内容即将上线", "content coming soon", "coming soon", "敬请期待")


def fix_zh_strip(apply, only=None):
    """中文段落里带占位开头/重复段落时，剥掉占位句并去重；修完仍不足 120 汉字的留给人工"""
    touched = 0
    still = 0
    for slug, path, d in iter_articles(only):
        if d.get("redirectTo"):
            continue
        dirty = False
        for sec in d.get("sections", []) or []:
            zh = (sec.get("body") or {}).get("zh")
            if not isinstance(zh, str) or not zh:
                continue
            low = zh.lower()
            if not any(p_ in low for p_ in PH):
                continue
            cleaned = zh
            # 剥掉开头的占位句
            for p_ in PH:
                m = re.search(r"\s*" + re.escape(p_) + r"\s*[。.：:]?\s*", cleaned, re.I)
                if m and m.start() < 40:
                    cleaned = cleaned[: m.start()] + cleaned[m.end():]
            # 去重：按空行切块，保留首次出现
            blocks = [b.strip() for b in re.split(r"\n\s*\n", cleaned) if b.strip()]
            uniq, seen = [], set()
            for b in blocks:
                key = re.sub(r"\s+", "", b)[:80]
                if key in seen:
                    continue
                seen.add(key)
                uniq.append(b)
            cleaned = "\n\n".join(uniq).strip()
            han = len(re.findall(r"[\u4e00-\u9fff]", re.sub(r"<[^>]+>", "", cleaned)))
            if han < 120:
                still += 1
                print(f"[{slug}] sections[{sec.get('id')}] 剥占位后仅 {han} 汉字，留待人工")
                continue
            sec["body"]["zh"] = cleaned
            touched += 1
            dirty = True
            print(f"[{slug}] {sec.get('id')} 剥占位+去重，剩 {han} 汉字")
        if dirty and apply:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(d, f, ensure_ascii=False, indent=2)
                f.write("\n")
    print(f"\nzh-strip: 处理 {touched} 段，{still} 段仍不足")



def fix_date(apply, only=None):
    for slug, path, d in iter_articles(only):
        dt, up = d.get("date"), d.get("updated")
        if not dt or not up or up >= dt:
            continue
        print(f"[{slug}] updated {up} < date {dt} → updated={dt}")
        d["updated"] = dt
        if apply:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(d, f, ensure_ascii=False, indent=2)
                f.write("\n")


SEP = {"zh": "：", "ja": "：", "ar": " — ", "ru": " — ", "hi": " — "}


def strip_english(t):
    """去掉成串英文（≥3 个空格相连的词），保留标准号/型号等短代号"""
    groups, cur = [], []
    prev_end = -1
    for m in re.finditer(r"[A-Za-z][A-Za-z0-9'\u2019/&.\-]*", t or ""):
        gap = t[prev_end:m.start()] if prev_end >= 0 else ""
        if prev_end >= 0 and gap.strip() == "" and len(gap) <= 3:
            cur.append(m)
        else:
            if cur:
                groups.append(cur)
            cur = [m]
        prev_end = m.end()
    if cur:
        groups.append(cur)
    drop = []
    for grp in groups:
        if len(grp) < 3:
            continue
        # 全是全大写代号（DIN/ISO/ASTM/SABS…）就不算英文句子
        if all(g.group().isupper() and len(g.group()) <= 6 for g in grp):
            continue
        drop.append((grp[0].start(), grp[-1].end()))
    out, last = [], 0
    for a, b in drop:
        out.append(t[last:a])
        last = b
    out.append(t[last:])
    txt = "".join(out)
    txt = re.sub(r"[ \t]{2,}", " ", txt)
    txt = re.sub(r"^[\s，,、：:；;·—\-]+", "", txt)
    txt = re.sub(r"[\s，,、：:；;·—\-]+$", "", txt)
    return txt.strip()


STANDARD_RX = re.compile(r"\b(ISO|DIN|EN|ASTM|GB|JIS|ANSI|SABS|API|AISC|SAE)\s*[- ]?\d{2,5}")
KEEP_TOKENS = {"LEED", "BREEAM", "TCO", "FAQ", "B2B", "OEM", "SGR", "XT", "CIF", "FOB",
               "MOQ", "QEHS", "ISO", "DIN", "ASTM", "GB", "JIS", "ANSI", "SABS", "HDG", "UV", "PVD"}


def strip_chunks(t, lg):
    """按"块"剥离英文：含本语种文字的块留下，纯 ASCII 且较长的块丢掉（保留标准号/常用缩写）"""
    rx = SCRIPTS.get(lg, r"[A-Za-z]")
    out = []
    for chunk in re.split("(" + rx + "+)", t or ""):
        if not chunk:
            continue
        if re.search(rx, chunk):
            out.append(chunk)
            continue
        words = re.findall(r"[A-Za-z][A-Za-z0-9'&./-]*", chunk)
        n_ascii = len(re.findall(r"[A-Za-z0-9]", chunk))
        if not words:
            out.append(chunk if n_ascii <= 6 else " ")
            continue
        if n_ascii < 8 or STANDARD_RX.search(chunk) or (len(words) == 1 and words[0].upper() in KEEP_TOKENS):
            out.append(chunk)
            continue
        out.append(" ")
    txt = "".join(out)
    txt = re.sub(r"\s+", " ", txt)
    comma = "，" if lg in ("zh", "ja") else ("، " if lg == "ar" else ", ")
    colon = "：" if lg in ("zh", "ja") else (": " if lg == "hi" else " — ")
    txt = re.sub(r"[，,、：:；;·\-\s]{2,}", lambda m: comma if ("，" in m.group() or "," in m.group()) else "", txt)
    txt = txt.replace("，", comma.strip()).replace("、", comma.strip()).replace("：", colon.strip()).replace("；", comma.strip())
    txt = re.sub(r"^[\s，,、：:；;·—\-]+", "", txt)
    txt = re.sub(r"[\s，,、：:；;·—\-]+$", "", txt)
    return txt.strip()


def native_len(t, lg):
    rx = SCRIPTS.get(lg)
    return len(re.findall(rx, t or "")) if rx else len(t or "")


def compose_from_headings(d, lg, limit=META_MAX):
    """用本地化标题 + 本地化小标题拼一句原生描述，不翻译、不编造"""
    title = strip_english((d.get("title") or {}).get(lg) or "")
    head = []
    for sec in d.get("sections", []) or []:
        h = strip_english((sec.get("heading") or {}).get(lg) or "")
        if len(h) >= 4 and english_run(h) < 3 and h != title:
            head.append(h.rstrip("。.：:"))
    if native_len(title, lg) < 6 or not head:
        return None
    out = title.rstrip("。.：: ") + SEP[lg] + SEP[lg].join(head[:2])
    while len(out) < META_MIN and len(head) > 2:
        head = head[1:] + [head[0]]
        out = title.rstrip("。.：: ") + SEP[lg] + SEP[lg].join(head[:3])
        break
    if lg in ("zh", "ja") and len(out) > limit - 20:
        out = out[: limit - 1].rstrip("、，·—") + "…"
    elif len(out) > limit:
        out = clip(out, limit)
    return out


def fix_compose(apply, only=None):
    """本地化描述/元描述里的英文块剥掉；剥完太薄就用同语种标题或同语种 description 补足"""
    changed = 0
    manual = 0
    for slug, path, d in iter_articles(only):
        if d.get("redirectTo"):
            continue
        t_box = d.get("title") or {}
        dirty = False
        for lg in ("zh", "ja", "hi", "ar", "ru"):
            nat_title = strip_chunks(t_box.get(lg) or "", lg)
            # 1) description：剥英文块，不够就标题+尾巴
            desc_box = d.get("description")
            if isinstance(desc_box, dict) and isinstance(desc_box.get(lg), str):
                cur = desc_box[lg]
                if english_run(cur) >= 4:
                    t = strip_chunks(cur, lg)
                    if native_len(t, lg) < 40 and native_len(nat_title, lg) >= 6 and native_len(t, lg) >= 8:
                        t = f"{nat_title.rstrip('。.：: ')}{SEP[lg]}{t}"
                    if english_run(t) < 4 and native_len(t, lg) >= 30:
                        print(f"[{slug}] description.{lg}\n   - {cur[:88]}\n   + {t[:88]}")
                        desc_box[lg] = t
                        dirty = True
                        changed += 1
                    else:
                        manual += 1
                        print(f"[{slug}] description.{lg} 素材不足，留人工：{cur[:70]}")
            # 2) metaDescription：优先用干净的 description，其次标题+剥过的尾巴
            meta_box = d.get("metaDescription")
            if isinstance(meta_box, dict) and isinstance(meta_box.get(lg), str):
                cur = meta_box[lg]
                if english_run(cur) >= 4:
                    src = (desc_box or {}).get(lg) if isinstance(desc_box, dict) else ""
                    new = None
                    if src and english_run(src) < 4 and native_len(src, lg) >= 60:
                        new = clip(src, META_MAX)
                    if new is None:
                        t = strip_chunks(cur, lg)
                        if native_len(t, lg) < 60 and native_len(nat_title, lg) >= 6 and native_len(t, lg) >= 8:
                            t = f"{nat_title.rstrip('。.：: ')}{SEP[lg]}{t}"
                        if english_run(t) < 4 and native_len(t, lg) >= 30:
                            new = clip(t, META_MAX)
                    if new is None:
                        manual += 1
                        print(f"[{slug}] metaDescription.{lg} 素材不足，留人工：{cur[:70]}")
                    else:
                        print(f"[{slug}] metaDescription.{lg}\n   - {cur[:88]}\n   + {new[:88]}")
                        meta_box[lg] = new
                        dirty = True
                        changed += 1
        if dirty and apply:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(d, f, ensure_ascii=False, indent=2)
                f.write("\n")
    print(f"\ncompose: 改写 {changed} 个字段，留人工 {manual} 个")


def _eng_variants(eng):
    """英文标题的若干变体：整句、冒号前部分、以及按词截断的前缀（≥5 词）"""
    eng = (eng or "").strip()
    if not eng:
        return []
    out = [eng]
    if ":" in eng:
        out.append(eng.split(":", 1)[0])
    words = eng.split()
    for n in range(len(words) - 1, 4, -1):
        out.append(" ".join(words[:n]))
    return [v for v in dict.fromkeys(out) if len(v.split()) >= 4]


def _replace_ci(text, phrase, repl):
    pat = re.compile(r"\s+".join(re.escape(w) for w in phrase.split()), re.IGNORECASE)
    return pat.sub(repl, text)


def fix_detitle(apply, only=None):
    """正文/描述里嵌着的英文标题，换成同语种标题（不翻译、不新造内容）"""
    changed = 0
    for slug, path, d in iter_articles(only):
        if d.get("redirectTo"):
            continue
        eng = (d.get("title") or {}).get("en") or ""
        variants = _eng_variants(eng)
        if not variants:
            continue
        dirty = False
        for lg in LANGS:
            nat = (d.get("title") or {}).get(lg) or ""
            if not nat or nat.strip().lower() == eng.strip().lower():
                continue
            fields = []
            for key in ("title", "description", "metaDescription"):
                box = d.get(key)
                if isinstance(box, dict) and isinstance(box.get(lg), str):
                    fields.append((f"{key}.{lg}", box, lg))
            for idx, sec in enumerate(d.get("sections", []) or []):
                hb = sec.get("heading")
                if isinstance(hb, dict) and isinstance(hb.get(lg), str):
                    fields.append((f"sections[{idx}].heading.{lg}", hb, lg))
                bb = sec.get("body")
                if isinstance(bb, dict) and isinstance(bb.get(lg), str):
                    fields.append((f"sections[{idx}].body.{lg}", bb, lg))
            for name, box, key in fields:
                t0 = box[key]
                t = t0
                for v in variants:
                    if v.lower() in t.lower():
                        t = _replace_ci(t, v, nat)
                if t != t0:
                    before = english_run(t0)
                    after = english_run(t)
                    if after < before:
                        print(f"[{slug}] {name} 英文串 {before}→{after}")
                        box[key] = t
                        dirty = True
                        changed += 1
        if dirty and apply:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(d, f, ensure_ascii=False, indent=2)
                f.write("\n")
    print(f"\ndetitle: 改了 {changed} 个字段")


def fix_image(apply, only=None):
    for slug, path, d in iter_articles(only):
        img = d.get("image")
        if not isinstance(img, str) or not img.startswith("/"):
            continue
        if os.path.exists(os.path.join("public", img.lstrip("/"))):
            continue
        cands = []
        for ext in (".jpg", ".webp", ".png", ".jpeg"):
            cands.append(os.path.join(PUB, slug + ext))
        found = next((c for c in cands if os.path.exists(c)), None)
        if not found:
            near = [f for f in os.listdir(PUB) if f.startswith(slug[:12])] if os.path.isdir(PUB) else []
            found = os.path.join(PUB, near[0]) if near else None
        if not found:
            print(f"[{slug}] 配图缺失且找不到替代：{img}（需人工出图）")
            continue
        new = "/images/articles/" + os.path.basename(found)
        print(f"[{slug}] image {img} → {new}")
        d["image"] = new
        if apply:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(d, f, ensure_ascii=False, indent=2)
                f.write("\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("target", choices=["meta", "extract", "date", "image", "zh-strip", "compose", "detitle"])
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only")
    args = ap.parse_args()
    if not args.apply:
        print("（dry-run：不写文件，加 --apply 生效）\n")
    {"meta": fix_meta, "extract": fix_extract, "date": fix_date, "image": fix_image,
     "zh-strip": fix_zh_strip, "compose": fix_compose, "detitle": fix_detitle}[args.target](args.apply, args.only)


if __name__ == "__main__":
    sys.exit(main())
