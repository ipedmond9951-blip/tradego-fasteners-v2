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
    for tok in re.split(r"[^A-Za-z'\u2019-]+", text or ""):
        if tok and len(tok) >= 2 and tok.isascii() and tok.isalpha():
            cur += 1
            best = max(best, cur)
        else:
            cur = 0
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
    ap.add_argument("target", choices=["meta", "extract", "date", "image", "zh-strip"])
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only")
    args = ap.parse_args()
    if not args.apply:
        print("（dry-run：不写文件，加 --apply 生效）\n")
    {"meta": fix_meta, "extract": fix_extract, "date": fix_date, "image": fix_image,
     "zh-strip": fix_zh_strip}[args.target](args.apply, args.only)


if __name__ == "__main__":
    sys.exit(main())
