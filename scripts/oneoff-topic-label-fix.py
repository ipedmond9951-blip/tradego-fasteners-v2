#!/usr/bin/env python3
"""一次性：把 4 篇"英文主题标签"文章里的标签换成各语种本地化表达。"""
import json, os

ART = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content", "articles")

ITEMS = [
    {"slug": "fastener-lubrication-thread-locking-guide",
     "label": "Thread Locking and Lubrication: Choosing the Right Method for Your Application",
     "heading": {"es": "lubricación y bloqueo de roscas", "fr": "lubrification et freinage des filetages",
                 "pt": "lubrificação e trava-roscas", "de": "Schraubensicherung und Schmierung",
                 "ja": "ファスナーの潤滑とねじロック", "ru": "смазки и фиксации резьбы крепежа",
                 "ar": "تزييت المثبتات وقفل اللولب", "hi": "फास्टनर थ्रेड लॉकिंग और स्नेहन",
                 "zh": "紧固件润滑与螺纹锁固"},
     "body": {"es": "La lubricación y el bloqueo de roscas", "fr": "La lubrification et le freinage des filetages",
              "pt": "A lubrificação e o trava-roscas", "de": "Die Schraubensicherung und Schmierung",
              "ja": "ファスナーの潤滑とねじロック", "ru": "Смазка и фиксация резьбы крепежа",
              "ar": "تزييت المثبتات وقفل اللولب", "hi": "फास्टनर थ्रेड लॉकिंग और स्नेहन",
              "zh": "紧固件润滑与螺纹锁固"}},
    {"slug": "fastener-packaging-export-requirements",
     "label": "Fastener Packaging for Export: Container Loading, Labeling, and Preservation",
     "heading": {"es": "embalaje de fijaciones para exportación", "fr": "emballage des fixations à l'export",
                 "pt": "embalagem de fixadores para exportação", "de": "Verpackung von Verbindungselementen für den Export",
                 "ja": "ファスナー輸出の包装要件", "ru": "упаковки крепежа на экспорт",
                 "ar": "تغليف المثبتات للتصدير", "hi": "निर्यात फास्टनर पैकेजिंग",
                 "zh": "紧固件出口包装"},
     "body": {"es": "El embalaje de fijaciones para exportación", "fr": "L'emballage des fixations à l'export",
              "pt": "A embalagem de fixadores para exportação", "de": "Die Verpackung von Verbindungselementen für den Export",
              "ja": "ファスナー輸出の包装", "ru": "Упаковка крепежа на экспорт",
              "ar": "تغليف المثبتات للتصدير", "hi": "निर्यात फास्टनर पैकेजिंग",
              "zh": "紧固件出口包装"}},
    {"slug": "fastener-preload-torque-calculation-methods",
     "label": "Preload and Torque Calculation Methods for Critical Bolted Joints",
     "heading": {"es": "cálculo de precarga y par en uniones atornilladas", "fr": "calcul de la précharge et du couple",
                 "pt": "cálculo de pré-carga e torque", "de": "Berechnung von Vorspannkraft und Anziehdrehmoment",
                 "ja": "軸力とトルクの計算", "ru": "расчета предварительной затяжки и момента",
                 "ar": "حساب الشد المسبق والعزم", "hi": "प्रीलोड और टॉर्क गणना",
                 "zh": "预紧力与扭矩计算"},
     "body": {"es": "El cálculo de la precarga y del par", "fr": "Le calcul de la précharge et du couple",
              "pt": "O cálculo da pré-carga e do torque", "de": "Die Berechnung von Vorspannkraft und Anziehdrehmoment",
              "ja": "軸力とトルクの計算", "ru": "Расчет предварительной затяжки и момента",
              "ar": "حساب الشد المسبق والعزم", "hi": "प्रीलोड और टॉर्क की गणना",
              "zh": "预紧力与扭矩计算"}},
    {"slug": "high-strength-bolting-structural-steel",
     "label": "High-Strength Bolting for Structural Steel: AISC and Eurocode 3 Methods",
     "heading": {"es": "uniones de alta resistencia en acero estructural", "fr": "boulonnage haute résistance des charpentes",
                 "pt": "parafusos de alta resistência em aço estrutural", "de": "hochfeste Schrauben für Stahlbau",
                 "ja": "構造用鋼材の高力ボルト締結", "ru": "высокопрочных болтовых соединений стальных конструкций",
                 "ar": "الربط عالي المتانة للفولاذ الإنشائي", "hi": "संरचनात्मक स्टील में उच्च शक्ति बोल्ट",
                 "zh": "钢结构高强度螺栓连接"},
     "body": {"es": "El uso de uniones de alta resistencia en acero estructural",
              "fr": "Le boulonnage haute résistance des charpentes",
              "pt": "O uso de parafusos de alta resistência em aço estrutural",
              "de": "Der Einsatz hochfester Schrauben im Stahlbau",
              "ja": "構造用鋼材の高力ボルト締結",
              "ru": "Высокопрочные болтовые соединения стальных конструкций",
              "ar": "الربط عالي المتانة للفولاذ الإنشائي",
              "hi": "संरचनात्मक स्टील में उच्च शक्ति बोल्ट का उपयोग",
              "zh": "钢结构高强度螺栓连接"}},
]

total = 0
for it in ITEMS:
    p = os.path.join(ART, it["slug"] + ".json")
    d = json.load(open(p, encoding="utf-8"))
    for s in d.get("sections", []):
        for fld in ("heading", "body"):
            for lang, v in (s.get(fld) or {}).items():
                if lang == "en" or not isinstance(v, str) or it["label"] not in v:
                    continue
                repl = it[fld].get(lang)
                if not repl:
                    continue
                s[fld][lang] = v.replace(it["label"], repl)
                total += 1
    json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(p, "a").write("\n")
    print("替换完成", it["slug"])
print("共替换字段", total)
