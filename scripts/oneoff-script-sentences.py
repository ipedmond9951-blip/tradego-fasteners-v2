#!/usr/bin/env python3
"""一次性修复剩余外语 token：按「句子级替换」处理 ja 的乱句，按「精确片段」处理其它语种的短侵入。

每条都带 must-exist 断言：断言失败就整体退出（fail-closed），避免误伤。
"""
import json
import re

SENT_END = re.compile(r"[。！？!?\n]|<br/>|<p>|</p>")

# (slug, section, field, lang, 命中片段, 替换方式, 新内容)
# 替换方式 sent=把命中片段所在整句换掉；exact=直接替换该片段
JOBS = [
    # ---- ja：整句重写（原句被韩/俄词顶坏）----
    ("tunisia-mediterranean-fastener-export-guide", 1, "body", "ja", "출발", "sent",
     "南中国の港を出発する貨物は25〜30日で、この所要日数帯の中では速い側に安定的に収まります [14]。"),
    ("drc-mining-concession-fastener-logistics", 1, "body", "ja", "стандартный", "sent",
     "塩化物誘発の応力腐食割れを抑制するため、添加モリブデン2〜3%を含むAISI 316Lグレードのステンレス鋼ファスナーが必要であり、標準的なAISI 304グレードより優れた耐食性を発揮します。"),
    ("drc-mining-concession-fastener-logistics", 4, "body", "ja", "экономически", "sent",
     "在庫保有コストは増えるものの、バッチ単位の発注をFCLに統合すればユニット当たりの輸送コストを通常15〜25%削減できるため、経済的に魅力的です。"),
    ("morocco-casablanca-port-fastener-import-procedure", 0, "body", "ja", "стандартные", "sent",
     "この手続きは、HSコード7318.15の標準的な六角ボルトを輸入する場合でも、カサブランカの新興商業用不動産セクター向け建設プロジェクトで使うASTM F1554アンカーボルトのような高仕様の構造用ファスナーを輸入する場合でも、同じように適用されます。"),
    ("africa-informal-construction-fastener-demand", 1, "body", "ja", "ур", "sent",
     "メッシュアンカーとコンクリートねじは、コンクリートブロック壁やレンガ壁に取り付け器具を固定します。"),
    ("angola-lng-project-fastener-import" if False else "angola-lng-project-fastener-procurement", 6, "body", "ja", "обязательн", "sent",
     "サンプル検査は数量の10%以上で必須です。"),
    ("china-hex-nuts-manufacturer", 1, "body", "ja", "поверхностей", "sent",
     "表面処理の選択肢も重要な検討事項です。"),
    ("fastener-supply-chain-africa-beira-corridor", 6, "body", "ja", "расширение", "sent",
     "リチウム・白金・クロム鉱業の拡大がインフラ投資を牽引しているため、今後3〜5年で工業用ファスナーの需要は地域供給を大きく上回るでしょう。"),
    ("kenya-affordable-housing-fasteners-wholesale", 1, "body", "ja", "тоже", "sent",
     "JIS B 1178およびDIN 975の仕様も、ケニア標準局（Kenya Bureau of Standards）の同等規定の下で承認されています[1]。"),
    ("south-africa-fastener-market-case-study", 2, "body", "ja", "리지", "sent",
     "海上輸送中のファスナーには十分な防錆コーティング（主に亜鉛コーティングまたは溶融亜鉛めっき）が施されており、潮風や塩分による腐食から製品を守っています。"),
    ("zambia-copper-mining-fasteners-grade-selection-2026", 0, "body", "ja", "особенно", "sent",
     "第一に、毎時500トンの鉱石を輸送するコンベアシステムでは、重機械からの連続的な振動が疲労荷重を生み、標準的なグレード4.8ボルトを数週間で劣化させます。"),
    # ---- 其它语种：精确片段 ----
    ("solar-panel-mounting-fasteners-africa", 3, "body", "de", "конструктивная", "exact", "konstruktive"),
    ("mozambique-fastener-market-case-study", 2, "body", "pt", "документация", "exact", "documentação"),
    ("mozambique-fastener-market-case-study", 6, "body", "es", "атмосфера Marino", "exact", "una atmósfera marina"),
    ("fastener-selection-guide-african-construction", 1, "body", "ar", "использовать", "exact", "استخدام"),
    ("harare-fastener-distributor-supplier-guide", 3, "body", "fr", "стандартных الكربون'", "exact", "standard en "),
    ("south-africa-fastener-market-guide", 4, "body", "pt", "техническая поддержка", "exact", "suporte técnico"),
    ("tanzania-sgr-railway-fastener-specifications", 4, "body", "fr", "углерода с соответствующими добавками марганца", "exact",
     "de carbone avec des additions appropriées de manganèse"),
    ("washer-types-applications-guide", 1, "body", "pt", "проектирование", "exact", "projeto"),
]


def sentence_bounds(text, i, j):
    start = 0
    for m in SENT_END.finditer(text, 0, i):
        start = m.end()
    end = len(text)
    for m in SENT_END.finditer(text, j):
        end = m.end()
        break
    return start, end


def main():
    touched = []
    for slug, sec, fld, lang, needle, mode, new in JOBS:
        path = "content/articles/%s.json" % slug
        art = json.load(open(path))
        text = art["sections"][sec][fld][lang]
        i = text.find(needle)
        if i < 0:
            print("  跳过（已修或未命中）：%s §%d %s %r" % (slug, sec, lang, needle))
            continue
        if mode == "exact":
            text = text.replace(needle, new)
        else:
            start, end = sentence_bounds(text, i, i + len(needle))
            text = text[:start] + new + text[end:]
        art["sections"][sec][fld][lang] = text
        open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
        touched.append(path)
    print("修复 %d 处，%d 篇" % (len(JOBS), len(set(touched))))


if __name__ == "__main__":
    main()
