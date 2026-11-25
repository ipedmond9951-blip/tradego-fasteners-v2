#!/usr/bin/env python3
"""清理非中文语种正文里残留的中文专名/术语（词级）。

只处理"专名与术语"这一类：国名、metier 词（采购）、行业词（扁冲铆钉、南海镀锌）、术语注释（母材）。
句子级中文残片不在这里硬替换（逐词替换会造出病句），由 fix-cjk-pseudo-tail.py 报告后人工处理。

fail-closed：每条规则替换的次数必须 >= 期望值，未达预期直接退出非 0。

用法：python3 scripts/fix-cjk-tokens.py [--apply]
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
NON_CJK = {"en", "es", "fr", "pt", "de", "ru", "ar", "hi"}

# 国名（含中文名残留在本地语正文里的情况）
COUNTRIES = {
    "塞内加尔": {"en": "Senegal", "es": "Senegal", "fr": "Sénégal", "pt": "Senegal", "de": "Senegal",
              "ru": "Сенегал", "ar": "السنغال", "hi": "सेनेगल"},
    "坦桑尼亚": {"en": "Tanzania", "es": "Tanzania", "fr": "Tanzanie", "pt": "Tanzânia", "de": "Tansania",
              "ru": "Танзания", "ar": "تنزانيا", "hi": "तंज़ानिया"},
    "阿尔及利亚": {"en": "Algeria", "es": "Argelia", "fr": "Algérie", "pt": "Argélia", "de": "Algerien",
               "ru": "Алжир", "ar": "الجزائر", "hi": "अल्जीरिया"},
    "埃及": {"en": "Egypt", "es": "Egipto", "fr": "Égypte", "pt": "Egito", "de": "Ägypten",
            "ru": "Египет", "ar": "مصر", "hi": "मिस्र"},
    "科特迪瓦": {"en": "Côte d'Ivoire", "es": "Costa de Marfil", "fr": "Côte d'Ivoire", "pt": "Costa do Marfim",
             "de": "Elfenbeinküste", "ru": "Кот-д'Ивуар", "ar": "ساحل العاج", "hi": "कोट द'इवोयर"},
    "喀麦隆": {"en": "Cameroon", "es": "Camerún", "fr": "Cameroun", "pt": "Camarões", "de": "Kamerun",
            "ru": "Камерун", "ar": "الكاميرون", "hi": "कैमरून"},
    "埃塞俄比亚": {"en": "Ethiopia", "es": "Etiopía", "fr": "Éthiopie", "pt": "Etiópia", "de": "Äthiopien",
              "ru": "Эфиопия", "ar": "إثيوبيا", "hi": "इथियोपिया"},
    "摩洛哥": {"en": "Morocco", "es": "Marruecos", "fr": "Maroc", "pt": "Marrocos", "de": "Marokko",
            "ru": "Марокко", "ar": "المغرب", "hi": "मोरक्को"},
}

# 术语（母材 = base material）：本地语里常见"正确译文 + 中文注释"的重复，按上下文成对替换
TERMS = [
    # 各语种 母材 注释（括号形式）直接删掉注释
    (re.compile(r" ?（母材）| ?\(母材\)"), "", None),
    # 词形合并（先处理会与后一条冲突的）
    (re.compile(r"materiales母材"), "materiales base", {"es"}),
    (re.compile(r"materiales母材"), "materiais base", {"pt"}),
    (re.compile(r"no母材"), "no material base", {"pt"}),
    (re.compile(r"no母材"), "no material base", {"es"}),
    (re.compile(r"del母材"), "del material base", {"es", "pt"}),
    (re.compile(r"du母材"), "du matériau de base", {"fr"}),
    (re.compile(r"le母材"), "le matériau de base", {"fr"}),
    (re.compile(r"im母材"), "im Grundwerkstoff", {"de"}),
    (re.compile(r"den母材"), "den Grundwerkstoff", {"de"}),
    (re.compile(r"母材"), "material base", {"es", "pt"}),
    (re.compile(r"母材"), "matériau de base", {"fr"}),
    (re.compile(r"母材"), "Grundwerkstoff", {"de"}),
    (re.compile(r"母材"), "base material", {"en"}),
    (re.compile(r"母材"), "основной материал", {"ru"}),
    (re.compile(r"母材"), "المادة الأساسية", {"ar"}),
    (re.compile(r"母材"), "आधार सामग्री", {"hi"}),
    # 采购
    (re.compile(r"Para采购"), "Para compras", {"es", "pt"}),
    (re.compile(r"ao采购"), "ao compras", {"pt"}),
    (re.compile(r"que采购"), "que compran", {"es", "pt"}),
    (re.compile(r"采购"), {"en": "procurement", "es": "compras", "fr": "achats", "pt": "compras",
                        "de": "Beschaffung", "ru": "закупки", "ar": "المشتريات", "hi": "खरीद"}),
    # 模板标签「相关资源：」
    (re.compile(r"相关资源："), {"en": "Related resources:", "es": "Recursos relacionados:",
                             "fr": "Ressources associées :", "pt": "Recursos relacionados:",
                              "de": "Verwandte Ressourcen:", "ru": "Связанные ресурсы:",
                              "ar": "موارد ذات صلة:", "hi": "संबंधित संसाधन:"}),
    # 第三方（检验/审计）
    (re.compile(r"第三方"), {"en": "third-party", "es": "terceros", "fr": "tiers",
                          "pt": "terceiros", "de": "Drittanbieter", "ru": "третьих сторон",
                          "ar": "أطراف ثالثة", "hi": "तृतीय-पक्ष"}),
    # 扁冲铆钉
    (re.compile(r"扁冲铆钉"), {"en": "flat-head rivets", "es": "remaches de cabeza plana",
                          "fr": "rivets à tête plate", "pt": "rebites de cabeça chata",
                          "de": "Flachkopfnieten", "ru": "заклёпки с плоской головкой",
                          "ar": "مسامير برشام مسطحة الرأس", "hi": "फ्लैट-हेड रिवेट"}),
    # 南海镀锌 = 热镀锌涂层（按语种改写前后搭配）
    (re.compile(r"revestimento 南海镀锌"), "revestimento galvanizado a quente", {"pt"}),
    (re.compile(r"revêtement ?南海镀锌"), "revêtement galvanisé à chaud", {"fr"}),
    (re.compile(r"recubrimiento 南海镀锌"), "recubrimiento galvanizado en caliente", {"es"}),
    (re.compile(r"南海镀锌 Beschichtung"), "feuerverzinkte Beschichtung", {"de"}),
    (re.compile(r"покрытием 南海镀锌"), "покрытием горячего цинкования", {"ru"}),
    (re.compile(r"南海镀锌"), {"en": "hot-dip galvanized", "es": "galvanizado en caliente",
                          "fr": "galvanisé à chaud", "pt": "galvanizado a quente",
                          "de": "feuerverzinkt", "ru": "горячего цинкования",
                          "ar": "مجلفن بالغمس الساخن", "hi": "हॉट-डिप जस्ती"}),
]

# 句子级残片（逐词替换会造病句，必须整句改写）：只列出、不自动改
FRAGMENT_HINT = re.compile(r"(基于标准的采购|订阅标准更新|建立包含至少|验证清单适用于|供应商评估应该是|"
                           r"对于在多个|同时|因为|通常|平均|买家|结构|抽查|来自|滞留|第三方|嵌入|牺牲|和)")


def tokenmap(table):
    """把 dict 形式的替换表统一成 {lang: str}。"""
    if isinstance(table, dict):
        return table
    return None


def norm_punct(text):
    """本地语正文里残留的中文标点：夹在拉丁字母之间时改成西文标点（阿拉伯语保留 ，→،）。"""
    text = re.sub(r"(?<=[A-Za-z0-9])，(?=[A-Za-z0-9一-龥])", ",", text)
    text = re.sub(r"(?<=[A-Za-z0-9])。", ".", text)
    text = re.sub(r"([A-Za-z])(?=(B2B|ISO|ASTM|DIN|GB|SABS|KEBS)\b)", r"\1 ", text)
    return text


def apply_rules(text, lang, stats):
    for rule in TERMS:
        pat, rep = rule[0], rule[1]
        langs = rule[2] if len(rule) > 2 else None
        if langs is not None and lang not in langs:
            continue
        if isinstance(rep, dict):
            r = rep.get(lang)
            if r is None:
                continue
        else:
            r = rep
        n = len(pat.findall(text))
        if n:
            text = pat.sub(r, text)
            stats[pat.pattern] = stats.get(pat.pattern, 0) + n
    return text


def main():
    do_apply = "--apply" in sys.argv
    stats, docs, touched = {}, {}, 0
    for f in sorted(glob.glob(os.path.join(ART, "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        docs[f] = d
        changed = False
        for sec in d.get("sections", []):
            for field in ("heading", "body"):
                v = sec.get(field)
                if not isinstance(v, dict):
                    continue
                for lang, txt in list(v.items()):
                    if lang not in NON_CJK or not isinstance(txt, str):
                        continue
                    new = norm_punct(apply_rules(txt, lang, stats))
                    for cn, table in COUNTRIES.items():
                        if cn in new:
                            new = new.replace(cn, table[lang])
                            stats["country:" + cn] = stats.get("country:" + cn, 0) + 1
                    if new != txt:
                        v[lang] = new
                        changed = True
        if changed:
            touched += 1
            if do_apply:
                open(f, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")

    print("替换统计：")
    for k, v in sorted(stats.items(), key=lambda x: -x[1]):
        print(f"  {v:4d}  {k}")
    print(f"改动文章 {touched} 篇{'（已落盘）' if do_apply else '（报告模式）'}")

    # 剩余句子级中文残片：只报告
    left = 0
    for f, d in docs.items():
        for i, sec in enumerate(d.get("sections", [])):
            for field in ("heading", "body"):
                v = sec.get(field) or {}
                if not isinstance(v, dict):
                    continue
                for lang, txt in v.items():
                    if lang in NON_CJK and isinstance(txt, str) and re.search(r"[\u4e00-\u9fff]", txt):
                        left += 1
    print(f"仍含中文的字段 {left} 个（句子级残片，需人工改写；见 check 报告）")


if __name__ == "__main__":
    main()
