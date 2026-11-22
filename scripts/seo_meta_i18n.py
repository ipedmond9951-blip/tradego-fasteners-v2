#!/usr/bin/env python3
"""为文章生成 10 种语言的原生标题 / 描述 / meta description。

用法: python3 scripts/seo_meta_i18n.py content/articles/<slug>.json
依赖: scripts/seo-llm.sh（codex / gemini / grok / chatgpt 通道）

规则（和站点口径一致）：
- 每种语言必须是母语表达，不接受英文原文混入（品牌名、标准号除外）
- 标题 ≤ 60 字符，description ≤ 155 字符，结尾不能是省略号
- 标题里保留核心关键词的当地说法
- 任意语言生成失败时保留英文回退，不阻塞流水线
"""
import json
import os
import re
import subprocess
import sys
import tempfile

LANGS = ["en", "zh", "es", "ar", "fr", "pt", "ru", "ja", "de", "hi"]
LANG_NAMES = {
    "zh": "Simplified Chinese", "es": "Spanish", "ar": "Arabic", "fr": "French",
    "pt": "Portuguese", "ru": "Russian", "ja": "Japanese", "de": "German",
    "hi": "Hindi", "en": "English",
}
# 允许保留的拉丁字母专名 / 标准号
ALLOW = re.compile(
    r"(TradeGo|Fasteners?|ASTM|ISO|SABS|EN|HS|SADC|AfCFTA|DIN|ANSI|Grade|"
    r"HDG|B2B|OEM|FAQ|WhatsApp|LinkedIn|mm|MPa|M\d+|G\d+)"
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEO_LLM = os.path.join(ROOT, "scripts", "seo-llm.sh")


def extract_json(text):
    start = text.find("{")
    if start < 0:
        return None
    depth, in_str, esc = 0, False, False
    for i in range(start, len(text)):
        c = text[i]
        if esc:
            esc = False
            continue
        if c == "\\":
            esc = True
            continue
        if c == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(text[start:i + 1])
                except Exception:
                    return None
    return None


def english_residue(value, lang):
    """检查是否混入英文原文（去掉允许的专名后仍有 ≥4 个连续英文单词即判失败）。"""
    if lang == "en" or not isinstance(value, str) or not value.strip():
        return False
    cleaned = ALLOW.sub(" ", value)
    words = re.findall(r"[A-Za-z]{3,}", cleaned)
    return len(words) >= 2


def call_llm(prompt, timeout=180):
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as f:
        f.write(prompt)
        path = f.name
    try:
        out = subprocess.run(
            ["bash", SEO_LLM, path, str(timeout), "200"],
            capture_output=True, text=True, timeout=timeout + 60,
        ).stdout
        return out
    finally:
        os.unlink(path)


def build_prompt(title, description, keyword, langs):
    lines = [
        "You write native-language SEO metadata for a B2B fastener manufacturer (TradeGo Fasteners).",
        f"English source title: {title}",
        f"English source description: {description}",
        f"Primary keyword: {keyword}",
        "",
        "For each language below, write a NATIVE title and description that match local search intent.",
        "Do NOT translate word by word. Do NOT leave English sentences. Keep brand names and standards as-is.",
        "Title <= 60 characters, description <= 155 characters, no trailing ellipsis, no markdown.",
        "Localize the primary keyword into the local industry term (e.g. Spanish: tornillos estructurales).",
        "",
        "Languages: " + ", ".join(f"{l} ({LANG_NAMES[l]})" for l in langs),
        "",
        'Output strict JSON only: {"<lang>": {"title": "...", "description": "..."}, ...}',
        "No commentary, no code fences.",
    ]
    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("usage: seo_meta_i18n.py <article.json>")
        return 2
    path = sys.argv[1]
    if not os.path.isabs(path):
        path = os.path.join(ROOT, path)
    art = json.load(open(path, encoding="utf-8"))
    en_title = art["title"]["en"] if isinstance(art["title"], dict) else art["title"]
    en_desc = art["description"]["en"] if isinstance(art["description"], dict) else art["description"]
    keyword = art.get("keywords", "").split(",")[0].strip() or en_title

    result = {}
    for batch in (["zh", "es", "fr", "ar", "hi"], ["pt", "ru", "ja", "de"]):
        prompt = build_prompt(en_title, en_desc, keyword, batch)
        raw = call_llm(prompt)
        data = extract_json(raw) or {}
        for lang in batch:
            item = data.get(lang) or {}
            title = (item.get("title") or "").strip()
            desc = (item.get("description") or "").strip()
            if not title or not desc:
                print(f"⚠️ {lang}: missing output")
                continue
            if english_residue(title, lang) or english_residue(desc, lang):
                print(f"⚠️ {lang}: english residue, keep fallback")
                continue
            if title.endswith("...") or title.endswith("…"):
                title = title.rstrip(".…").rstrip()
            if len(title) > 75 or len(desc) > 165:
                print(f"⚠️ {lang}: length overflow ({len(title)}/{len(desc)})")
            result[lang] = {"title": title, "description": desc}

    applied = 0
    for lang, item in result.items():
        if isinstance(art["title"], dict) and lang in art["title"]:
            art["title"][lang] = item["title"]
            art["description"][lang] = item["description"]
            if isinstance(art.get("metaDescription"), dict):
                art["metaDescription"][lang] = item["description"]
            if isinstance(art.get("imageAlt"), dict) and lang in art["imageAlt"]:
                art["imageAlt"][lang] = item["title"]
            applied += 1

    if applied:
        json.dump(art, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(json.dumps({"slug": art.get("slug"), "languages_updated": applied,
                      "languages_total": len(LANGS)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
