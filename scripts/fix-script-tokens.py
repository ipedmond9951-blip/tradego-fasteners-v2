#!/usr/bin/env python3
"""清理非中文语种正文里的「外语词侵入」：某个词被错语言顶替，留下一个外语 token。

与 fix-cjk-words.py 同思路：逐条词表，不做通用替换。表里的 key 是 (语种, 原文片段)，
未命中只告警不阻断。默认报告，--apply 才落盘。
"""
import argparse
import glob
import json
import re

CYR = re.compile(r"[а-яА-ЯёЁ]+")
HAN = re.compile(r"[\uac00-\ud7af]+")

# (lang, bad) -> good
TABLE = {
    # ---- ja：俄语/韩语词侵入（多为名词槽位，替换成同义日文词）----
    ("ja", "документация"): "文書",
    ("ja", "редко"): "まれに",
    ("ja", "альтернативы"): "代替案",
    ("ja", "приложения"): "用途",
    ("ja", "требования"): "要件",
    ("ja", "критических"): "重要な",
    ("ja", "также"): "また",
    ("ja", "время"): "時間",
    ("ja", "стандарт"): "規格",
    ("ja", "запрос"): "見積依頼",
    ("ja", "часто"): "しばしば",
    ("ja", "тонны"): "トン",
    ("ja", "большинства"): "大半",
    ("ja", "высокопрочная"): "高強度",
    ("ja", "обозначение"): "表記",
    ("ja", "температур"): "温度",
    ("ja", "анкор"): "アンカー",
    ("ja", "гордж"): "",  # 乱码残留
    ("ja", "би"): "",     # 乱码残留
    ("ja", "механическая"): "機械的",
    ("ja", "расширяющийся"): "拡大する",
    ("ja", "объяснение"): "説明",
    ("ja", "периодический"): "定期的",
    ("ja", "установленной"): "設定された",
    ("ja", "некоторым"): "一部の",
    ("ja", "популярны"): "人気がある",
    ("ja", "строительные"): "建設",
    ("ja", "сезон"): "季節",
    ("ja", "критические"): "重要な",
    ("ja", "соединения"): "接合部",
    ("ja", "безопасность"): "安全性",
    ("ja", "водоснабжения"): "給水",
    ("ja", "специализирующиеся"): "専門とする",
    ("ja", "готовности"): "準備",
    ("ja", "короткосрочная"): "短期的な",
    ("ja", "допустимых"): "許容",
    ("ja", "экономичный"): "低コストの",
    ("ja", "обязательно"): "必須",
    ("ja", "монитовщик"): "設置業者",
    ("ja", "убедительная"): "説得力のある",
    ("ja", "законодательство"): "法令",
    ("ja", "содовая"): "ソーダ",
    ("ja", "зола"): "灰",
    ("ja", "требует"): "必要とする",
    ("ja", "толщиной"): "厚さ",
    ("ja", "различных"): "各種の",
    ("ja", "микрометров"): "マイクロメートル",
    ("ja", "инфраструктуры"): "インフラ",
    ("ja", "развития"): "発展",
    ("ja", "покрытия"): "コーティング",
    ("ja", "лет"): "年",
    ("ja", "класс"): "クラス",
    ("ja", "квадратный"): "平方",
    ("ja", "дюйм"): "インチ",
    ("ja", "фунтов"): "ポンド",
    ("ja", "крепежа"): "ファスナー",
    ("ja", "برای"): "",
    ("ja", "당"): "あたり",
    ("ja", "별로"): "ほとんど",
    ("ja", "상당"): "相当",
    ("ja", "고려"): "考慮",
    ("ja", "노출"): "暴露",
    ("ja", "금은"): "金",
    ("ja", "운영하는"): "運営する",
    ("ja", "선호"): "好む",
    ("ja", "더라도"): "ても",
    ("ja", "취급"): "取扱",
    ("ja", "빠른"): "迅速な",
    ("ja", "기반으로"): "に基づいて",
    ("ja", "포함한"): "含む",
    ("ja", "통한"): "を通じた",
    # ---- 其他语种 ----
    ("fr", "требует"): "exige",
    ("fr", "требования"): "exigences",
    ("fr", "безопасность"): "sécurité",
    ("fr", "водоснабжения"): "d'approvisionnement en eau",
    ("fr", "толщиной"): "d'épaisseur",
    ("fr", "микрометров"): "micromètres",
    ("fr", "покрытия"): "revêtements",
    ("fr", "различных"): "différents",
    ("fr", "инфраструктуры"): "infrastructure",
    ("fr", "развития"): "développement",
    ("fr", "механизмы"): "mécanismes",
    ("fr", "ценообразования"): "de formation des prix",
    ("pt", "захламления"): "entupimento",
    ("pt", "соединение"): "junta",
    ("pt", "соединения"): "das juntas",
    ("pt", "критические"): "críticos",
    ("pt", "крепежа"): "fixadores",
    ("pt", "фунтов"): "libras",
    ("pt", "квадратный"): "quadrado",
    ("pt", "дюйм"): "polegada",
    ("pt", "класс"): "classe",
    ("pt", "этих"): "destes",
    ("pt", "документов"): "documentos",
    ("pt", "популярны"): "populares",
    ("pt", "оборудования"): "equipamentos",
    ("ar", "экономически"): "اقتصاديًا",
    ("ar", "целесообразным"): "مجديًا",
    ("ar", "контроль"): "الرقابة",
    ("de", "некоторным"): "gewissem",
    ("de", "допустимых"): "admissíveis",
    ("hi", "экономичный"): "किफ़ायती",
    ("hi", "убедительная"): "आकर्षक",
    ("hi", "законодательство"): "कानून",
    ("hi", "коридор"): "कॉरिडोर",
}


def apply_table(text, lang):
    changed = 0
    for (lg, bad), good in TABLE.items():
        if lg != lang or bad not in text:
            continue
        n = text.count(bad)
        # 前后紧贴拉丁字母时不动（避免把别的词切坏）
        text = re.sub(r"(?<![A-Za-zÀ-ÿ\u0400-\u04FF])" + re.escape(bad) + r"(?![A-Za-zÀ-ÿ\u0400-\u04FF])", good, text)
        changed += n
    return text, changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    total = 0
    files = set()
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        dirty = False
        for s in art.get("sections", []):
            for key in ("heading", "body"):
                d = s.get(key)
                if not isinstance(d, dict):
                    continue
                for lang, txt in d.items():
                    if not txt or lang in ("zh", "ru", "ko"):
                        continue
                    new, n = apply_table(txt, lang)
                    if n:
                        d[lang] = new
                        total += n
                        dirty = True
        if dirty:
            files.add(path)
            if args.apply:
                open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
    print("替换 %d 处，涉及 %d 篇" % (total, len(files)))
    if not args.apply:
        print("（只报告，加 --apply 落盘）")

    # 复检：还剩多少外语 token
    left = 0
    by_lang = {}
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        for s in art.get("sections", []):
            for key in ("heading", "body"):
                d = s.get(key)
                if not isinstance(d, dict):
                    continue
                for lang, txt in d.items():
                    if not txt or lang == "ru":
                        continue
                    n = len(CYR.findall(txt))
                    if lang != "ko":
                        n += len(HAN.findall(txt))
                    if n:
                        left += n
                        by_lang[lang] = by_lang.get(lang, 0) + n
    print("剩余外语 token %d：%s" % (left, by_lang))


if __name__ == "__main__":
    main()
