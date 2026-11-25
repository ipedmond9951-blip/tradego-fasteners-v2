#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
content_contract.py — 文章 JSON 的「输出契约」校验器

定位：比 check-article-schema.sh 更深一层。schema 只查"字段在不在"，
这里查"字段里的东西对不对"——多语言是否原生、SEO 长度是否合规、
正文体量够不够、有没有占位文案漏出去。

用法：
  python3 scripts/content_contract.py                  # 全量，人类可读汇总
  python3 scripts/content_contract.py --slug xxx       # 单篇详细
  python3 scripts/content_contract.py --json out.json  # 机器可读报告
  python3 scripts/content_contract.py --quiet          # 只输出汇总结论

规则分两级：
  BLOCK  —— 会让页面露出假内容 / 假翻译 / 空壳，必须修
  WARN   —— SEO 或质量瑕疵，不必阻塞发布，但要记账

退出码：0 全通过；1 有 BLOCK；2 运行错误
"""

import argparse
import json
import os
import re
import sys

LANGS = ["en", "zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]

PLACEHOLDERS = [
    "content coming soon",
    "coming soon",
    "lorem ipsum",
    "[internal-ref",
    "todo:",
    "placeholder text",
]

# 拉丁语系语言，用于"是否等于英文原文"的判定
LATIN_LANGS = ["es", "fr", "pt", "de"]

STOPWORDS = {
    "de": ["der", "die", "und", "für", "mit", "den"],
    "es": ["para", "los", "las", "con", "del", "una"],
    "fr": ["pour", "les", "des", "avec", "une", "dans"],
    "pt": ["para", "com", "das", "dos", "uma", "não"],
}

WORD_RE = re.compile(r"[A-Za-zÀ-ÿ0-9'’\-]+")
TAG_RE = re.compile(r"<[^>]+>")
HAN_RE = re.compile(r"[\u4e00-\u9fff]")
KANA_RE = re.compile(r"[\u3040-\u30ff]")
ARABIC_RE = re.compile(r"[\u0600-\u06ff]")
CYRILLIC_RE = re.compile(r"[\u0400-\u04ff]")
DEVA_RE = re.compile(r"[\u0900-\u097f]")

# 字段长度区间（按 en 字符数）
LIMITS = {
    "title": (30, 65),
    "metaDescription": (120, 165),
    "description": (110, 190),
}
MIN_EN_BODY_WORDS = 1600
MIN_FAQ = 3
MIN_FAQ_ANSWER = 80

# 认证断言（2026-11-25 口径）：TradeGo 目前不持有 ISO 9001 / CE / SABS。
# 文案只能写"按 X 尺寸标准生产""认证可按订单申请办理"，不得写成已有资质。
# 这里拦两类：①第一人称自称已认证 ②把"认证 + 工厂/供应商"当成自有资质讲。
CERT_CLAIM_PATTERNS = [
    re.compile(r"\b(?:we|our\s+(?:factory|plant|company|mill|production)|TradeGo)\b[^.]{0,40}(?:ISO\s?9001|SABS|CE)\s*(?:-|\s|:)?\s*(?:certified|approved|認証|认证|認證|certificat[oe]s?|zertifiziert|प्रमाणित|معتمد|сертифиц\w*)", re.I),
    re.compile(r"(?:ISO\s?9001|SABS|CE)[^.]{0,20}(?:certified|认证|認証)\s*(?:factory|manufacturer|supplier|plant|厂家|工厂|供应商|工場|usine|fábrica|завод|مصنع)", re.I),
]
CERT_ALLOW_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "content", "cert-claim-allowlist.json")
_CERT_ALLOW_CACHE = None


def cert_allow_slugs():
    """存量已命中的文章先记进 allowlist（降级 WARN），新出现的断言一律 BLOCK。"""
    global _CERT_ALLOW_CACHE
    if _CERT_ALLOW_CACHE is None:
        try:
            with open(os.path.abspath(CERT_ALLOW_FILE), encoding="utf-8") as f:
                _CERT_ALLOW_CACHE = set(json.load(f).get("slugs", []))
        except Exception:
            _CERT_ALLOW_CACHE = set()
    return _CERT_ALLOW_CACHE

STRICT = False  # --strict 时把 body 体量等"历史资产容忍项"升级为 BLOCK


def strip_html(s):
    return TAG_RE.sub(" ", s or "")


def words(s):
    return WORD_RE.findall(strip_html(s).lower())


def word_count(s):
    return len(words(s))




def walk_leaves(obj, prefix=""):
    """遍历 JSON 里所有字符串叶子，产出 (字段路径, 文本)"""
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk_leaves(v, f"{prefix}.{k}" if prefix else str(k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_leaves(v, f"{prefix}[{i}]")
    elif isinstance(obj, str):
        yield prefix, obj

def english_run(text, min_words=4):
    """最长连续英文单词串长度（只把空格/标点相连的英文词算作连续，避免把并列的标准号算成一串英文）"""
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


def norm(s):
    """宽容取文本：字段可能是 str、per-lang dict、list"""
    if isinstance(s, dict):
        s = s.get("en") or next((v for v in s.values() if isinstance(v, str)), "")
    if isinstance(s, list):
        s = " ".join(x if isinstance(x, str) else json.dumps(x, ensure_ascii=False) for x in s)
    if not isinstance(s, str):
        s = "" if s is None else str(s)
    return re.sub(r"\s+", " ", s).strip()


class Issues:
    def __init__(self):
        self.block = []
        self.warn = []

    def b(self, check, msg):
        self.block.append({"check": check, "msg": msg})

    def w(self, check, msg):
        self.warn.append({"check": check, "msg": msg})


def lang_map(d, key, issues, slug, required_langs=True, severity="block"):
    """校验 dict-per-lang 字段：类型、10 语齐全、原生性"""

    def _bad(check, msg):
        (issues.b if severity == "block" else issues.w)(check, msg)

    v = d.get(key)
    if not isinstance(v, dict):
        issues.b("schema", f"'{key}' 不是 per-lang 字典（实际 {type(v).__name__}）")
        return {}
    if not norm(v.get("en", "")):
        issues.b("schema", f"'{key}' 缺 en")
    missing = [lg for lg in LANGS if not norm(v.get(lg, ""))]
    if missing and required_langs:
        issues.b("i18n-missing", f"'{key}' 缺语言: {','.join(missing)}")
    elif missing:
        issues.w("i18n-missing", f"'{key}' 缺语言: {','.join(missing)}")

    en = norm(v.get("en", ""))
    for lg in LANGS:
        if lg == "en":
            continue
        t = norm(v.get(lg, ""))
        if not t:
            continue
        if t == en:
            _bad("i18n-copy", f"'{key}.{lg}' 与英文完全相同 — 英文原文混入")
            continue
        if lg in LATIN_LANGS:
            inter = set(words(en)) & set(words(t))
            ratio = len(inter) / max(1, len(set(words(t))))
            # 标题/短描述里型号与标准号本就与英文同形，只在长文本高度重合时才提示
            if ratio > 0.85 and len(words(t)) >= 12:
                issues.w("i18n-copy", f"'{key}.{lg}' 与英文词重合 {ratio:.0%}，疑似机翻/英文混入")
            sw = STOPWORDS.get(lg, [])
            if sw and len(words(t)) >= 25 and not any(w in sw for w in words(t)):
                issues.w("i18n-native", f"'{key}.{lg}' 未见该语言虚词，可能是英文原文")
        min_script = {"ar": (ARABIC_RE, 5), "ru": (CYRILLIC_RE, 5), "hi": (DEVA_RE, 5)}
        if lg in min_script:
            reg, need = min_script[lg]
            if len(reg.findall(t)) < need:
                _bad("i18n-script", f"'{key}.{lg}' 几乎没有该语言文字，疑似非 {lg}")
        if lg in ("zh", "ar", "ru", "hi", "ja") and english_run(t) >= 4:
            _bad("i18n-mixed", f"'{key}.{lg}' 夹着 {english_run(t)} 个连续英文单词 — 英文原文混入")
        if lg in ("es", "fr", "pt", "de"):
            hits = sum(1 for w in re.findall(r"\b(the|and|with|your|this|that|these|those|about|which|should|from)\b", t.lower()))
            if hits >= 3:
                _bad("i18n-mixed", f"'{key}.{lg}' 出现 {hits} 个英文虚词 — 英文原文混入")
        if lg == "ja" and len(KANA_RE.findall(t)) < 2:
            issues.w("i18n-script", f"'{key}.ja' 几乎无假名，疑似中文直译")
        if lg == "zh" and len(HAN_RE.findall(t)) < 4:
            _bad("i18n-script", f"'{key}.zh' 汉字过少")
        if lg != "zh" and len(HAN_RE.findall(t)) > max(6, len(t) * 0.3) and lg != "ja":
            _bad("i18n-script", f"'{key}.{lg}' 含大量汉字 — 中文原文混入")
    return v


def check_article(path, project_dir):
    issues = Issues()
    slug_file = os.path.basename(path)[:-5]
    try:
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
    except Exception as e:
        issues.b("json", f"JSON 解析失败: {e}")
        return slug_file, issues, False

    # 0. 重定向存根：只剩跳转信息，不参与内容契约
    if norm(d.get("redirectTo", "")):
        return slug_file, issues, True

    # 0.1 编码完整性：U+FFFD 是批量写入丢字的物证，json 合法但页面显示乱码
    try:
        with open(path, encoding="utf-8") as f:
            raw = f.read()
    except Exception:
        raw = ""
    if "\ufffd" in raw:
        issues.b("encoding", f"U+FFFD 乱码字符 {raw.count(chr(0xFFFD))} 处（批量写坏，需按上下文修回）")

    # 0.2 认证断言：不得写成"已有资质"；存量记 allowlist 降级 WARN
    allow = cert_allow_slugs()
    cert_hit = False
    for leaf, text in walk_leaves(d):
        if not isinstance(text, str):
            continue
        for pat in CERT_CLAIM_PATTERNS:
            m = pat.search(text)
            if not m:
                continue
            msg = f"{leaf} 出现已持有认证的断言: '{m.group(0)[:60]}'"
            if slug_file in allow:
                issues.w("cert-claim", "[存量] " + msg)
            else:
                issues.b("cert-claim", msg)
            cert_hit = True
            break
        if cert_hit:
            break

    # 0.3 地域口径：对外只写 China；具体省市（含非拉丁写法）不得与公司/工厂绑定
    GEO_TERMS = ("潍坊", "濰坊", "Weifang", "WEIFANG", "Shandong", "山东",
                 "Вэйфан", "وييفانغ", "शानदोंग")
    DUP_PHRASES = ("中国中国", "China (China)", "China China", "China, China", "中国（中国）")
    for leaf, text in walk_leaves(d):
        if not isinstance(text, str):
            continue
        for bad in DUP_PHRASES:
            if bad in text:
                issues.b("geo-dup", f"{leaf} 出现批量替换残留：'{bad}'")
                break
        low = text.lower()
        for term in GEO_TERMS:
            if term.lower() not in low:
                continue
            idx = low.find(term.lower())
            win = low[max(0, idx - 80): idx + 80]
            if any(k in win for k in ("tradego", "our factory", "our plant", "our company",
                                      "本司", "我们", "工厂", "我厂")):
                issues.b("geo-leak", f"{leaf} 把公司/工厂绑定到具体地域：'{term}'")
            break

    # 1. 结构 & slug
    if norm(d.get("slug", "")) != slug_file:
        issues.b("schema", f"slug 字段 '{d.get('slug')}' 与文件名不一致")
    for k in ["category", "date", "readTime", "image", "sections"]:
        if not d.get(k):
            issues.b("schema", f"缺字段 '{k}'")

    # 2. 日期
    for k in ["date", "updated"]:
        v = d.get(k)
        if v and not re.match(r"^\d{4}-\d{2}-\d{2}$", str(v)):
            issues.w("date", f"'{k}' 不是 YYYY-MM-DD：{v}")
    if d.get("date") and d.get("updated") and str(d["updated"]) < str(d["date"]):
        issues.b("date", f"updated({d['updated']}) 早于 date({d['date']})")

    # 3. 多语言字段
    title = lang_map(d, "title", issues, slug_file)
    desc = lang_map(d, "description", issues, slug_file)
    meta = lang_map(d, "metaDescription", issues, slug_file, required_langs=False)
    lang_map(d, "imageAlt", issues, slug_file, required_langs=False, severity="warn")

    # 4. SEO 长度
    for key, m in (("title", title), ("description", desc), ("metaDescription", meta)):
        en = norm(m.get("en", "")) if isinstance(m, dict) else ""
        if not en:
            continue
        lo, hi = LIMITS[key]
        if not (lo <= len(en) <= hi):
            issues.w("seo-length", f"'{key}.en' 长度 {len(en)} 超出 [{lo},{hi}]")

    # 5. keywords
    kw = d.get("keywords")
    if isinstance(kw, str):
        n_kw = len([x for x in kw.split(",") if x.strip()])
        if n_kw < 5:
            issues.w("seo-keywords", f"keywords 仅 {n_kw} 个（建议 ≥5）")
    elif isinstance(kw, list) and len(kw) < 5:
        issues.w("seo-keywords", f"keywords 仅 {len(kw)} 个（建议 ≥5）")

    # 6. 正文
    sections = d.get("sections") or []
    if not isinstance(sections, list) or not sections:
        issues.b("schema", "sections 为空")
        sections = []
    en_body_words = 0
    zh_body_chars = 0
    for i, s in enumerate(sections):
        if not isinstance(s, dict):
            issues.b("schema", f"sections[{i}] 不是对象")
            continue
        head = s.get("heading") or {}
        body = s.get("body") or {}
        if not isinstance(head, dict) or not isinstance(body, dict):
            issues.b("schema", f"sections[{i}] heading/body 不是 per-lang 字典")
            continue
        miss_h = [lg for lg in LANGS if not norm(head.get(lg, ""))]
        if miss_h:
            issues.w("i18n-missing", f"sections[{i}].heading 缺 {','.join(miss_h)}")
        en_text = body.get("en", "") or ""
        en_body_words += word_count(en_text)
        zh_body_chars += len(HAN_RE.findall(body.get("zh", "") or ""))
        has_items = isinstance(s.get("faqItems"), list) and bool(s["faqItems"])
        # FAQ 小节的正文由模板按语种生成（FAQ_INTRO + 问答列表），不要求手写 body；
        # 否则补完问答却被判"缺中文正文"。
        head_en = (head.get("en") or "").lower()
        is_faq = s.get("id") == "faq" or "frequently asked question" in head_en or "常见问题" in (head.get("zh") or "")
        if not norm(en_text) and not has_items and not is_faq:
            issues.b("body", f"sections[{i}] 缺英文正文")
        if not norm(body.get("zh", "") or "") and not has_items and not is_faq:
            issues.b("body", f"sections[{i}] 缺中文正文")

    # 6.1 同段重复：同一语言里整段出现两次以上，说明模板拼接把同一块粘了两遍
    #     （全库清扫时一次性去掉 425 处，规则在此兜住不再复发）
    for i, s in enumerate(sections):
        if not isinstance(s, dict):
            continue
        body = s.get("body") or {}
        for lg, text in body.items():
            if not isinstance(text, str) or "</p>" not in text:
                continue
            plain = [re.sub(r"\s+", " ", TAG_RE.sub("", chunk)).strip() for chunk in text.split("</p>")]
            plain = [p for p in plain if len(p) > 80]
            counts = {}
            for p in plain:
                counts[p] = counts.get(p, 0) + 1
            for p, n in counts.items():
                if n > 1:
                    issues.b("dup-para", f"sections[{i}].body.{lg} 同一段出现 {n} 次: '{p[:60]}'")
                    break

    if en_body_words and en_body_words < MIN_EN_BODY_WORDS:
        if STRICT:
            issues.b("body-size", f"英文正文 {en_body_words} 词 < 门槛 {MIN_EN_BODY_WORDS}")
        else:
            issues.w("body-size", f"英文正文 {en_body_words} 词 < 门槛 {MIN_EN_BODY_WORDS}（历史资产，按 WARN 计）")
    if zh_body_chars and zh_body_chars < 800:
        issues.w("body-size", f"中文正文 {zh_body_chars} 汉字，偏薄")

    # 7. FAQ
    # FAQ 的真实来源是 sections[].faqItems（页面与 FAQPage schema 只读它）；
    # 顶层 faq 是历史字段，已迁移，仅作兜底计数。
    sec_items = []
    for s in d.get("sections", []):
        if isinstance(s.get("faqItems"), list):
            sec_items.extend(s["faqItems"])
    legacy = d.get("faq") if isinstance(d.get("faq"), list) else []
    n_faq = max(len(sec_items), len(legacy))
    has_faq_section = any(
        s.get("id") == "faq" or "frequently asked question" in ((s.get("heading") or {}).get("en", "") or "").lower()
        for s in d.get("sections", [])
    )
    if n_faq < MIN_FAQ:
        issues.w("faq", f"FAQ 仅 {n_faq} 条（建议 ≥{MIN_FAQ}）")
    elif has_faq_section and not sec_items:
        issues.w("faq", "FAQ 小节没有 faqItems（页面渲染不出问答，schema 也不生成）")
    for i, item in enumerate(sec_items or legacy):
        if not isinstance(item, dict):
            continue
        q = item.get("q")
        a = item.get("a")
        q_txt = q.get("en") if isinstance(q, dict) else q
        a_txt = a.get("en") if isinstance(a, dict) else a
        if not norm(q_txt or "") or not norm(a_txt or ""):
            issues.b("faq", f"faq[{i}] q/a 为空")
        elif len(norm(a_txt or "")) < MIN_FAQ_ANSWER:
            issues.w("faq", f"faq[{i}] 答案仅 {len(norm(a_txt))} 字符，偏短")

    # 8. 占位 / 脏文本（按字段定位，同一字段同一问题只报一次）
    for path, text in walk_leaves(d):
        low = text.lower()
        hit = [p for p in PLACEHOLDERS if p in low]
        if hit:
            issues.b("placeholder", f"{path} 含占位文案 '{hit[0]}'")
        for bad in ["undefined", "not found"]:
            if re.search(r"(?<![a-z])" + re.escape(bad) + r"(?![a-z])", low):
                issues.w("dirty-text", f"{path} 含脏文本 '{bad}'")
        # 批量拼接把标签写坏（"<<p>"），渲染时可见但不影响 JSON 合法性
        if "<<p>" in text or "<p><p>" in text:
            issues.b("dirty-text", f"{path} 段落标签重复/写坏（'<<p>'）")
        # 断句：段落以单个字母收尾（"... coatings c</p>"），说明写到一半被打断
        # 只看正文：标题、表头、单个单元格里以单字母结尾多为正常缩写
        if ".body." in path and len(text) > 80:
            if re.search(r"\s[a-zA-Z]</p>", text) or re.search(r"\s[a-zA-Z]$", text):
                issues.b("truncated", f"{path} 段落以单个字母收尾，疑似断句")

    en_all = " ".join(
        [json.dumps(title.get("en", ""), ensure_ascii=False), json.dumps(desc.get("en", ""), ensure_ascii=False)]
        + [str((s.get("body") or {}).get("en", "")) for s in sections if isinstance(s, dict)]
        + [str((s.get("heading") or {}).get("en", "")) for s in sections if isinstance(s, dict)]
    )
    if len(HAN_RE.findall(en_all)) > 20:
        issues.b("lang-leak", f"英文正文含 {len(HAN_RE.findall(en_all))} 个汉字 — 中文回吐进 en")

    # 9. 配图存在性
    img = d.get("image")
    if isinstance(img, str) and img.startswith("/"):
        img_path = os.path.join(project_dir, "public", img.lstrip("/"))
        if not os.path.exists(img_path):
            issues.b("image-missing", f"配图不存在: public{img}")

    return slug_file, issues, False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", help="只检查某篇")
    ap.add_argument("--json", dest="json_out", help="输出机器可读报告到文件")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--strict", action="store_true", help="把历史资产容忍项（正文体量偏薄）升级为 BLOCK")
    ap.add_argument("--baseline", help="存量基线文件：基线内的已知问题降级为 WARN，只拦新增问题")
    ap.add_argument("--write-baseline", help="把当前 BLOCK 结果写成基线文件")
    args = ap.parse_args()

    global STRICT
    STRICT = args.strict

    project_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    art_dir = os.path.join(project_dir, "content", "articles")
    if not os.path.isdir(art_dir):
        print(f"找不到 {art_dir}", file=sys.stderr)
        return 2

    files = sorted(os.listdir(art_dir))
    if args.slug:
        files = [f for f in files if f.startswith(args.slug)]
    files = [os.path.join(art_dir, f) for f in files if f.endswith(".json")]

    results = []
    redirects = 0
    check_counts = {"block": {}, "warn": {}}
    for p in files:
        slug, isx, is_redirect = check_article(p, project_dir)
        if is_redirect:
            redirects += 1
            continue
        results.append(
            {
                "slug": slug,
                "block": isx.block,
                "warn": isx.warn,
            }
        )
        for i in isx.block:
            check_counts["block"][i["check"]] = check_counts["block"].get(i["check"], 0) + 1
        for i in isx.warn:
            check_counts["warn"][i["check"]] = check_counts["warn"].get(i["check"], 0) + 1

    # 存量基线：已知问题不算新增阻断
    if args.baseline and os.path.exists(args.baseline):
        with open(args.baseline, encoding="utf-8") as f:
            base = json.load(f)
        known = base.get("known", base)
        for r in results:
            keep = []
            for i in r["block"]:
                sig = f"{i['check']}|{i['msg']}"
                if sig in known.get(r["slug"], []):
                    r["warn"].append({"check": i["check"], "msg": "[存量] " + i["msg"], "severity": "warn"})
                else:
                    keep.append(i)
            r["block"] = keep

    total = len(results)
    clean = [r for r in results if not r["block"] and not r["warn"]]
    blocked = [r for r in results if r["block"]]
    warned = [r for r in results if r["warn"] and not r["block"]]

    print(f"\n文章总数: {total + redirects}（重定向存根 {redirects}，不参与校验）")
    print(f"  完全干净: {len(clean)} ({len(clean)/max(1,total):.0%})")
    print(f"  只 WARN : {len(warned)} ({len(warned)/max(1,total):.0%})")
    print(f"  有 BLOCK: {len(blocked)} ({len(blocked)/max(1,total):.0%})")

    print("\nBLOCK 分类:")
    for k, v in sorted(check_counts["block"].items(), key=lambda x: -x[1]):
        print(f"  {k:18s} {v}")
    if check_counts["warn"]:
        print("\nWARN 分类:")
        for k, v in sorted(check_counts["warn"].items(), key=lambda x: -x[1]):
            print(f"  {k:18s} {v}")

    if args.baseline:
        print(f"\n新增 BLOCK: {len(blocked)} 篇（存量问题已按 {args.baseline} 放过）")
        for r in blocked:
            first = r["block"][0]
            print(f"  {r['slug']}: [{first['check']}] {first['msg']}  (共 {len(r['block'])} 项)")

    if args.slug:
        for r in results:
            print(f"\n== {r['slug']}")
            for i in r["block"]:
                print(f"  BLOCK [{i['check']}] {i['msg']}")
            for i in r["warn"]:
                print(f"  WARN  [{i['check']}] {i['msg']}")
    elif not args.quiet:
        print("\nBLOCK 明细（前 15 篇）:")
        for r in blocked[:15]:
            first = r["block"][0]
            print(f"  {r['slug']}: [{first['check']}] {first['msg']}  (共 {len(r['block'])} 项)")

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "total": total,
                    "redirects": redirects,
                    "clean": len(clean),
                    "blocked": len(blocked),
                    "warned": len(warned),
                    "counts": check_counts,
                    "articles": results,
                },
                f,
                ensure_ascii=False,
                indent=1,
            )
        print(f"\nJSON 报告: {args.json_out}")

    if args.write_baseline:
        snapshot = {"generated": __import__("datetime").date.today().isoformat(),
                    "known": {r["slug"]: [f"{i['check']}|{i['msg']}" for i in r["block"]] for r in results if r["block"]}}
        with open(args.write_baseline, "w", encoding="utf-8") as f:
            json.dump(snapshot, f, ensure_ascii=False, indent=1)
        print(f"\n基线已写入: {args.write_baseline}（{len(snapshot['known'])} 篇存量问题被冻结）")

    return 1 if blocked else 0


if __name__ == "__main__":
    sys.exit(main())
