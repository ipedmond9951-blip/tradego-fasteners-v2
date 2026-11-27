#!/usr/bin/env python3
"""check-i18n-leakage.py —— 多语种串入检测尺子（加固版）。

旧版只扫 faqItems.q/a 与 cta，且 ja 只要命中任一 CJK 字符就算"通过"，
导致 `ジンバブエ aloneは`、`コンテナvolume`、`马拉维輸入業者` 这类混入全部逃过（假绿）。

本版覆盖所有逐语种文本字段：
  顶层：title / metaDescription / description / imageAlt
  章节：sections[].heading / sections[].body
  问答：sections[].faqItems[].q / .a
  号召：cta.text / cta.buttonText
（keywords 是 en-only 元数据字符串/列表，不参与逐语种串入判定。）

四类命中：
  (a) en_function_word  非 en 语种里出现独立英文虚词（the/and/of/for/with…），按整词匹配，
                        不命中词中片段；
  (b) latin_run         非拉丁语种（zh/ja/ar/hi/ru）里出现连续 >=3 个非白名单拉丁词，
                        或 >=20 个拉丁字符的英文片段；
  (c) cjk_in_latin      拉丁语种（es/fr/de/pt）里出现 CJK 字符；
  (d) zh_char_in_ja     ja 里出现简体中文专用字形（认/严/证/这/个/们/说/时/发/现/贸/输…）
                        或中文词组。

白名单：标准号/机构名/品牌与产地专名（ISO 898-1、DIN 931/933/125、SABS 1195、
EN 14399、ASTM A325/A490、NACE MR0175、HS 7318、EAC、RSB、MININFRA、EPDM、HDG、
SADC、ZIMRA、TTO、TEU、40HQ、20GP、LCL、PSI、MTC、CMA CGM、Maersk、TradeGo、
各地名与机构全称）不计泄漏；产品类普通名词（screw/bolt/nut…）降级为 need_review。

用法：
  python3 scripts/check-i18n-leakage.py                 # 人类可读汇总
  python3 scripts/check-i18n-leakage.py --csv docs/x.csv
  python3 scripts/check-i18n-leakage.py --slug <slug>
  python3 scripts/check-i18n-leakage.py --min 3         # 片段内非白名单词 >=N 才报
  python3 scripts/check-i18n-leakage.py --self-test    # 内置合成样本自测（一键复跑）
  python3 scripts/check-i18n-leakage.py --strict --quiet [--paths a.json,b.json]
"""
import argparse
import csv
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")
LOCALES = ["zh", "es", "fr", "pt", "ar", "ru", "ja", "de", "hi"]
NONLAT = {"zh", "ja", "ar", "hi", "ru"}
LATIN_LOCALES = {"es", "fr", "de", "pt"}

TAG = re.compile(r"<[^>]+>")
WORD = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’\-\.]*")
CJK = re.compile(r"[ぁ-んァ-ヶ一-龠]")
HIRAGANA_KATAKANA = re.compile(r"[ぁ-んァ-ヶ]")

# (a) 英文虚词：只按整词匹配，不含产品/行业实词。
# FN_CORE 高精度子集：不会与 es/fr/pt/de 本土常用词同形（排除 was/you/in/on/to/as/no/or/so 等
# 与罗曼语/德语同形的短词），拉丁语种只跑这一档；FN_EXT 仅用于非拉丁语种（本土文字为主，
# 夹进来的拉丁片段基本就是英文）。
FN_CORE = {
    "the", "and", "of", "for", "with", "from", "that", "this", "which",
    "when", "there", "than", "then", "also", "only", "most", "into",
    "onto", "between", "through", "during", "their", "your", "been",
    "does", "should", "shall", "could", "must", "have", "has", "had",
    "are", "were", "our", "his", "her", "its", "they", "she", "but",
    "about", "under", "over", "each", "both", "any", "not", "before",
    "without", "within", "such",
}
FN_EXT = {
    "is", "was", "by", "to", "in", "on", "as", "or", "will", "would",
    "can", "may", "might", "more", "after", "it", "we", "you", "he",
    "do", "did", "at", "if", "so", "up", "out", "all", "no", "be",
    "per", "via", "use", "used", "using",
}
FUNCTION_WORDS = FN_CORE | FN_EXT

# 多词专名（小写后整段抹除；顺序按长度降序，避免子串先吃）
WHITE_PHRASES = [
    "grand ethiopian renaissance dam",
    "african construction standards institute",
    "lesotho highlands water authority",
    "portos e caminhos de ferro de mocambique",
    "south african bureau of standards",
    "kenya bureau of standards",
    "botswana bureau of standards",
    "standards organization of nigeria",
    "american society of agricultural engineers",
    "american society of mechanical engineers",
    "american national standards institute",
    "deutsches institut für normung",
    "international organization for standardization",
    "federal ministry of works",
    "procurement regulatory authority",
    "zimbabwe investment and development agency",
    "commercial bank of ethiopia",
    "builders warehouse",
    "bill of lading",
    "tile and bath",
    "bolt and engineering",
    "cma cgm",
    "port of maputo", "port of beira", "port of durban", "port of dakar",
    "port said", "most favoured nation",
    "forbes border post", "asycuda world", "dp world", "bureau veritas",
    "failure analysis report", "hot-dip galvanized coating standard",
    "julius nyerere hydropower station", "kafue gorge lower",
    "south african bureau", "allen key bolts", "allen bolts",
    "coarse thread", "fine thread", "coach screws", "regional standards",
]

# 单词白名单：标准前缀/牌号/缩写/机构/品牌/产地
WHITE_TOKENS = {
    # 标准与机构
    "iso", "din", "ansi", "asme", "astm", "gb", "jis", "sans", "sabs",
    "en", "gost", "bs", "api", "nps", "uns", "sa", "smo", "ptfe",
    "cnc", "lng", "lpg", "hs", "usd", "eur", "exw", "fob", "cif", "cfr",
    "dap", "ddp", "sla", "epc", "cad", "mtc", "pvoc", "coc", "sgs",
    "bv", "bis", "kebs", "tbs", "zimra", "son", "afcfta", "etls", "burs",
    "gsa", "minpet", "apa", "sigi", "ago", "sonangol", "pcc", "ispm",
    "hrc", "hv", "mpa", "ksi", "nace", "mr0175", "sczone", "goeic",
    "tier", "oem", "eac", "rsb", "mininfra", "sadc", "tto", "teu",
    "40hq", "20gp", "lcl", "psi", "epdm", "hdg", "hdpe", "dwt", "bew",
    "cfm", "tradego", "maersk", "zar", "kes", "ghs", "ngn", "gbp",
    "unc", "unf", "unef", "od", "id", "dn", "nm", "kn", "µm", "um",
    "mm", "tpi", "oc", "ip", "fep", "pfa", "ptfe", "ss", "aisi",
    "incoterms", "incoterm", "dacromet", "geomet", "whatsapp", "email",
    "iatf", "ibr", "a2", "a4", "70", "80", "304", "316", "3506", "4032",
    "4033", "14399", "10.9", "8.8", "12.9", "4.6", "5.8",
    "com", "www", "http", "https", "href", "class", "strong", "target",
    "rel", "noopener", "afdb", "world", "bank", "imf", "un", "unido",
    "soncap", "nicis", "paar", "qmc", "sku", "oem", "b2b", "b2c", "rfq",
    "fcl", "eta", "etd", "leed", "breeam", "sgr", "ibr", "vc", "rironi",
    "naivasha", "pandrol", "massmart", "makro", "cashbuild", "game",
    "builders", "africa", "african", "sae", "iso9001", "304", "316",
    "uns", "uv", "abs", "pp", "ldpe", "pvc", "frp", "grp", "cfrp",
    "t1", "t2", "t3", "no", "go", "no-go",
    "batoka", "asycuda", "dp", "wealthbag", "bureau", "veritas", "msc",
    "pto", "tco", "fbe", "mdpe", "knbs", "nis", "fifo", "rfi", "denso",
    "gerd", "shcs", "technopolis", "konza", "nyerere", "kafue", "gorge",
    "az150", "nsf", "allen", "coach", "reference", "limit", "pricing",
    "conclusion", "regional", "coarse", "sleepers", "seat", "distributor",
    "wholesaler", "tier", "mill", "3.1", "ss316", "ss304",
    # 产地/国别/城市专名
    "zimbabwe", "malawi", "zambia", "mozambique", "namibia", "botswana",
    "kenya", "tanzania", "uganda", "nigeria", "ghana", "senegal",
    "tunisia", "morocco", "egypt", "ethiopia", "rwanda", "burundi",
    "eswatini", "lesotho", "angola", "cameroon", "chad", "mali", "niger",
    "benin", "togo", "gabon", "sudan", "somalia", "djibouti", "eritrea",
    "algeria", "libya", "mauritania", "gambia", "guinea", "liberia",
    "harare", "bulawayo", "lilongwe", "blantyre", "lusaka", "beira",
    "durban", "maputo", "machipanda", "bikita", "arcadia", "zvishavane",
    "kunzvi", "gwayi", "shangani", "mashonaland", "manicaland", "nairobi",
    "gaborone", "luanda", "abidjan", "casablanca", "tunis", "kigali",
    "mombasa", "douala", "lagos", "abuja", "lome", "cotonou", "accra",
    "ouagadougou", "mutare", "gweru", "kadoma", "chinoyi", "chinhoyi",
    "masvingo", "matola", "pemba", "suez", "jebel", "ali", "dubai",
    "singapore", "colombo", "chittagong", "tangier", "drc", "congo",
    "zimbabwean", "malawian", "zambian", "mozambican",
}

# 产品/行业普通名词：单独出现不算整段英文，降级 need_review，不直接判 true_leak
PRODUCT_TOKENS = {
    "screw", "screws", "bolt", "bolts", "nut", "nuts", "washer", "washers",
    "anchor", "anchors", "rivet", "rivets", "stud", "studs", "thread",
    "threads", "fastener", "fasteners", "head", "heads", "cap", "shoulder",
    "socket", "button", "flat", "set", "shank", "pitch", "diameter",
    "length", "material", "finish", "coating", "galvanized", "stainless",
    "steel", "iron", "brass", "aluminum", "alloy", "grade", "class", "size",
    "type", "standard", "standards", "spec", "specification", "specifications",
    "dimensions", "chart", "guide", "catalogue", "catalog", "price",
    "prices", "quote", "quotes", "order", "orders", "supplier", "suppliers",
    "manufacturer", "manufacturers", "factory", "factories", "export",
    "import", "imports", "importer", "importers", "shipping", "logistics",
    "container", "containers", "port", "ports", "customs", "tariff",
    "taxes", "tax", "duty", "payment", "delivery", "packaging", "quality",
    "certification", "certificate", "test", "report", "surface", "capacity",
    "strength", "lifespan", "clamp", "engagement", "construction", "industry",
    "industrial", "automotive", "building", "hardware", "fitting", "fittings",
    "guide", "hub", "warehouse", "management", "requirement", "requirements",
    "application", "applications", "solution", "solutions", "service",
    "services", "market", "selection", "comparison", "inspection", "storage",
    "handling", "rail", "railway", "solar", "wind", "mining", "marine",
    "corrosion", "failure", "analysis", "case", "wood", "metal", "concrete",
    "plastic", "machine", "rod", "rods", "locking", "lubrication", "torque",
    "preload", "structural", "bulk", "discount", "discounts", "list",
    "organization", "bureau", "ministry", "regulation", "grid", "grids",
    "pole", "poles", "track", "demand", "opportunity", "opportunities",
    "engineering", "engineered", "equipment", "machinery", "assembly",
    "component", "components", "surface", "finish", "export", "import",
    "quality", "control", "price", "prices", "supplier", "suppliers",
}

# 代码号形态：ISO 898-1 / ASTM A325 / DIN 931 / 8.8 / M16 / 40HQ …
CODE_RE = re.compile(
    r"^(?:ISO|DIN|ANSI|ASME|ASTM|GB|JIS|SANS|SABS|EN|GOST|BS|API|UNS|SA|SMO|"
    r"NACE|HS|MR|ASTM|A\d{3,4}|F\d{2,4}|B\d{2,4}|SI)[\w\-\./]*$", re.I)
SPEC_RE = re.compile(
    r"^([A-Z]{1,3}\d+(?:\.\d+)?[A-Z]{0,2}|\d+(?:\.\d+)?(?:HQ|GP|mm|MPa|HV|HRC|kN|Nm)?|"
    r"[A-Z]\d-\d+|\d{1,2}\.\d{1,2}|No\.?\d+|MR0175|A325|A490|A2-70|A4-80|"
    r"4014|4017|931|933|125|1195|14399|7318)$",
    re.I)

# 简体中文专用字形（日文新字体/常用汉字里不出现的简化形）；括号内为日文对应形
# 仅收"简体专用、日文新字体/常用汉字不使用"的字形；日中同形/新字体同形汉字
# （条/径/争/号/互/与/万/来/双/乱/千/准/决/专/为/书/买/双/变/听/员/围/团/来/机/权…）不收。
ZH_SIMPLIFIED = set(
    "认严证这个们说时发现规贸输钢铁铁锈头钉钻铆链垫环连产业门问关线压热镀锌"
    "应厂价订单货运码吨择验报图级宽纹圆动紧银铜铝铅锰镍铬硅钛镁铸锻马维见观"
    "况东丝两丰丽举义乐乔习乡云广庄庆庐库庙弃张录怀态坏扰拦拥挂挠挡桥桩档"
    "舰舱续绪继缆综缓罗罢罚离历厅县块坚坛坝垄垒垦响杂杨枫柜构楼椭层购"
)
# 中文词组（在 ja 文本里出现即判中文串入；日文对应：ステンレス/ボルト/ナット…）
ZH_PHRASES = [
    "不锈钢", "螺栓", "螺母", "螺钉", "垫圈", "镀锌", "热镀锌", "厂家", "工厂",
    "价格", "订单", "货物", "运输", "关税", "港口", "集装箱", "批发", "采购",
    "供应商", "检验报告", "尺寸图", "图表", "多长时间", "螺丝", "型材", "质量",
    "标准件", "紧固件", "连接件", "表面处理", "发货", "报价", "目录", "规格",
]

NONLAT_SCRIPTS = {
    "ar": re.compile(r"[؀-ۿ]"),
    "ru": re.compile(r"[Ѐ-ӿ]"),
    "hi": re.compile(r"[ऀ-ॿ]"),
    "ja": re.compile(r"[ぁ-んァ-ヶ一-龠]"),
    "zh": re.compile(r"[一-龠]"),
}


def strip_tags(text):
    return TAG.sub(" ", text or "")


def _whitephrase_lower(text_lower):
    """抹除多词专名，返回剩余文本。"""
    out = text_lower
    for ph in WHITE_PHRASES:
        out = out.replace(ph, " ")
    return out


def _token_class(tok):
    """返回 white / product / code / other。"""
    low = tok.lower().strip(".-’'")
    if low in WHITE_TOKENS or low in FUNCTION_WORDS:
        return "white"
    if CODE_RE.match(tok) or SPEC_RE.match(tok):
        return "code"
    if low in PRODUCT_TOKENS:
        return "product"
    if re.fullmatch(r"[\d\s\.\,\-/°%]+", tok):
        return "code"
    if tok.isupper() and len(tok) <= 6:
        return "code"
    return "other"


def detect_text(text, locale, min_words=1):
    """对单条逐语种文本做四类检测，返回命中列表。

    每条命中：{hit_type, snippet, words, other, verdict}
    verdict ∈ true_leak / proper_noun / need_review
    """
    hits = []
    if locale == "en" or not isinstance(text, str) or not text.strip():
        return hits
    plain = strip_tags(text)
    plain_low = _whitephrase_lower(plain.lower())

    # (c) 拉丁语种出现 CJK
    if locale in LATIN_LOCALES and CJK.search(plain):
        cjk_chars = "".join(CJK.findall(plain))
        hits.append({
            "hit_type": "cjk_in_latin",
            "snippet": _snippet(plain, CJK.search(plain).start()),
            "words": [], "other": [],
            "verdict": "true_leak",
        })
        return hits

    # (d) ja 串入简体中文专用字 / 中文词组
    if locale == "ja":
        zh_found = sorted({ch for ch in plain if ch in ZH_SIMPLIFIED})
        zh_phrase = [ph for ph in ZH_PHRASES if ph in plain]
        if zh_found or zh_phrase:
            anchor = (zh_phrase[0] if zh_phrase
                      else next((ch for ch in plain if ch in ZH_SIMPLIFIED), ""))
            hits.append({
                "hit_type": "zh_char_in_ja",
                "snippet": _snippet(plain, plain.find(anchor)),
                "words": [], "other": zh_found + zh_phrase,
                "verdict": "true_leak",
            })

    # 按非 ASCII 切段，取连续拉丁片段
    latin_segments = []
    for piece in re.split(r"([^\x00-\x7F]+)", plain_low):
        if piece and re.match(r"^[^\x00-\x7F]", piece):
            continue
        latin_segments.append(piece)

    fn_set = FN_CORE if locale in LATIN_LOCALES else FUNCTION_WORDS
    for seg in latin_segments:
        tokens = WORD.findall(seg)
        if not tokens:
            continue
        classes = [_token_class(t) for t in tokens]
        words = [t for t, c in zip(tokens, classes) if c != "white"]
        other = [t.lower() for t, c in zip(tokens, classes) if c == "other"]
        fn = [t.lower() for t, c in zip(tokens, classes)
              if c == "white" and t.lower() in fn_set]
        other_real = [w for w in other if w not in FUNCTION_WORDS]

        # (a) 英文虚词整词命中
        if fn:
            verdict = "true_leak" if other_real else "need_review"
            hits.append({
                "hit_type": "en_function_word",
                "snippet": _snippet(plain, plain_low.find(seg.strip()[:20])),
                "words": words, "other": other_real,
                "verdict": verdict,
            })

        # (b) 非拉丁语种拉丁串入：>=3 个非白名单词判 true_leak；1–2 个降级 need_review；
        # 整段只剩白名单/代码/产品词记 proper_noun（专名 telemetry，不进闸门）。
        if locale in NONLAT:
            if not other_real:
                if len(words) >= 2:
                    hits.append({
                        "hit_type": "latin_run",
                        "snippet": _snippet(plain, plain_low.find(seg.strip()[:20])),
                        "words": words, "other": [],
                        "verdict": "proper_noun",
                    })
                continue
            if len(other_real) >= min_words:
                verdict = "true_leak" if len(other_real) >= 3 else "need_review"
                hits.append({
                    "hit_type": "latin_run",
                    "snippet": _snippet(plain, plain_low.find(seg.strip()[:20])),
                    "words": words, "other": other_real,
                    "verdict": verdict,
                })
    return hits


def _snippet(plain, idx, width=60):
    if idx < 0:
        idx = 0
    start = max(0, idx - width // 2)
    end = min(len(plain), idx + width)
    snip = re.sub(r"\s+", " ", plain[start:end]).strip()
    return snip[:120]


# ---------- 文章结构遍历 ----------

def _per_locale_texts(d):
    """产出 (field, locale, value) 三元组。"""
    for top in ("title", "metaDescription", "description", "imageAlt"):
        v = d.get(top)
        if isinstance(v, dict):
            for loc, val in v.items():
                yield top, loc, val
    for si, sec in enumerate(d.get("sections") or []):
        h = sec.get("heading")
        if isinstance(h, dict):
            for loc, val in h.items():
                yield f"sections[{si}].heading", loc, val
        b = sec.get("body")
        if isinstance(b, dict):
            for loc, val in b.items():
                yield f"sections[{si}].body", loc, val
        for fi, it in enumerate(sec.get("faqItems") or []):
            for fld in ("q", "a"):
                val = it.get(fld)
                if isinstance(val, dict):
                    for loc, v2 in val.items():
                        yield f"faqItems[{fi}].{fld}", loc, v2
    cta = d.get("cta") or {}
    for key in ("text", "buttonText"):
        val = cta.get(key)
        if isinstance(val, dict):
            for loc, v2 in val.items():
                yield f"cta.{key}", loc, v2


def scan_article(path, min_words=1):
    try:
        d = json.load(open(path, encoding="utf-8"))
    except Exception:
        return os.path.basename(path)[:-5], []
    slug = d.get("slug") or os.path.basename(path)[:-5]
    rows = []
    for field, loc, val in _per_locale_texts(d):
        if not isinstance(val, str) or not val.strip():
            continue
        for hit in detect_text(val, loc, min_words=min_words):
            rows.append({
                "slug": slug, "locale": loc, "field": field,
                "hit_type": hit["hit_type"], "snippet": hit["snippet"],
                "verdict": hit["verdict"], "other": hit["other"],
            })
    return slug, rows


# ---------- 自测 ----------

SELFTEST_POSITIVE = [
    # (locale, text, 期望命中类型子集)
    ("ja", "ジンバブエ aloneはアフリカ南部の内陸国です。", {"en_function_word", "latin_run"}),
    ("ja", "コンテナvolumeの35%をチャーターします。", {"latin_run"}),
    ("ja", "马拉维輸入業者向けの見積もりを提出します。", {"zh_char_in_ja"}),
    ("ar", "the carrier's current port-congestion and peak-season schedule affects routing.",
     {"en_function_word", "latin_run"}),
    ("ru", "the carrier's current port-congestion and peak-season schedule affects routing.",
     {"en_function_word", "latin_run"}),
    ("es", "tornillos de cabeza cilíndrica 螺栓 y tuercas para construcción.", {"cjk_in_latin"}),
    ("hi", "steel bolts and fasteners for construction projects across East Africa.",
     {"en_function_word", "latin_run"}),
    ("de", "Schrauben and Muttern für den Maschinenbau.", {"en_function_word"}),
]

SELFTEST_NEGATIVE = [
    ("zh", "按 ISO 898-1 与 ISO 4014 / ISO 4017 标准生产外六角螺栓。"),
    ("ru", "соответствие DIN 931, DIN 933 и DIN 125 по классу 8.8."),
    ("fr", "rondelles EPDM étanches aux intempéries, galvanisées HDG."),
    ("ja", "TradeGo は SABS 1195 と SADC 向けの輸出ファスナーを供給します。"),
    ("ar", "الشحنة 40HQ و 20GP عبر TEU و LCL، والرسوم وفق ZIMRA."),
    ("pt", "contentores CMA CGM e Maersk com MTC e PSI verificados."),
    ("zh", "barragem Grand Ethiopian Renaissance Dam 项目的供水管道法兰。"),
    ("hi", "EAC, RSB और MININFRA द्वारा अनुमोदित मानक।"),
    ("ja", "African Construction Standards Institute の仕様に準拠します。"),
    ("es", "pernos M16 a M24, clase 8.8 y 10.9 con recubrimiento HDG."),
]


def _self_test():
    fails = []
    print("== 正例必报 ==")
    for i, (loc, text, expect) in enumerate(SELFTEST_POSITIVE, 1):
        hits = detect_text(text, loc, min_words=1)
        types = {h["hit_type"] for h in hits}
        ok = bool(hits) and bool(types & expect)
        status = "PASS" if ok else "FAIL"
        print(f"  [{status}] +{i} {loc}: {sorted(types) or '无命中'} | {text[:48]}")
        if not ok:
            fails.append(f"positive #{i} {loc}")
    print("== 反例必不报（白名单/专名）==")
    for i, (loc, text) in enumerate(SELFTEST_NEGATIVE, 1):
        hits = detect_text(text, loc, min_words=1)
        leaks = [h for h in hits if h["verdict"] == "true_leak"]
        ok = not leaks
        status = "PASS" if ok else "FAIL"
        print(f"  [{status}] -{i} {loc}: {[h['hit_type']+':'+h['verdict'] for h in hits] or '干净'} | {text[:48]}")
        if not ok:
            fails.append(f"negative #{i} {loc}")
    print(f"\n自测：正例 {len(SELFTEST_POSITIVE)} 条，反例 {len(SELFTEST_NEGATIVE)} 条；"
          f"{'全部通过 ✅' if not fails else '失败：' + ', '.join(fails)}")
    return 1 if fails else 0


# ---------- CLI ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv")
    ap.add_argument("--slug")
    ap.add_argument("--min", type=int, default=1)
    ap.add_argument("--self-test", action="store_true")
    ap.add_argument("--strict", action="store_true")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--fix-list", action="store_true")
    ap.add_argument("--paths")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    if args.paths:
        files = [p.strip() for p in args.paths.split(",") if p.strip()]
    else:
        files = sorted(glob.glob(os.path.join(ART, "*.json")))
    if args.slug:
        files = [f for f in files if os.path.basename(f)[:-5] == args.slug]

    rows = []
    for f in files:
        _, art_rows = scan_article(f, min_words=args.min)
        rows += art_rows

    by_locale, by_field, by_article = {}, {}, {}
    verdicts = {"true_leak": 0, "proper_noun": 0, "need_review": 0}
    for r in rows:
        by_locale[r["locale"]] = by_locale.get(r["locale"], 0) + 1
        by_field[r["field"]] = by_field.get(r["field"], 0) + 1
        by_article[r["slug"]] = by_article.get(r["slug"], 0) + 1
        verdicts[r["verdict"]] = verdicts.get(r["verdict"], 0) + 1

    if not args.quiet:
        print(f"扫描文章: {len(files)}")
        if rows:
            print(f"命中 {len(rows)} 条（true_leak {verdicts['true_leak']} / "
                  f"proper_noun {verdicts['proper_noun']} / need_review {verdicts['need_review']}）")
            print("按语种: " + " / ".join(f"{k} {v}" for k, v in
                  sorted(by_locale.items(), key=lambda x: -x[1])))
            print("受影响文章: " + str(len(by_article)))
            if args.fix_list:
                for n, c in sorted(by_article.items(), key=lambda x: -x[1])[:20]:
                    print(f"  {c:4} {n}")
        else:
            print("✅ 未发现串入泄漏")

    if args.csv:
        out = os.path.join(ROOT, args.csv) if not os.path.isabs(args.csv) else args.csv
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", newline="", encoding="utf-8") as h:
            w = csv.DictWriter(h, fieldnames=["slug", "locale", "field", "hit_type",
                                              "snippet", "verdict"])
            w.writeheader()
            for r in rows:
                w.writerow({k: r[k] for k in w.fieldnames})
        if not args.quiet:
            print(f"已写 {out}（{len(rows)} 行）")

    strict_block = [r for r in rows if r["verdict"] == "true_leak"]
    if args.strict and strict_block:
        if not args.quiet:
            for r in strict_block[:10]:
                print(f"⛔ {r['slug']} [{r['locale']}] {r['field']} {r['hit_type']}: {r['snippet']}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
