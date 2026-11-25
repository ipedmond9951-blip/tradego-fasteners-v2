#!/usr/bin/env python3
"""逐条改写：本地语正文里"中文词顶替了本地语词"造成的粘连（如 pt `se嵌入式`、ru `часто指定ывается`）。

数据形态：本地化管线把一个中文词塞进本地语句子、替换掉原词，留下半截词干。
修法只能是按上下文补回本地语词——所以这里是一张逐条��工表（lang + 原片段 + 改正片段），
不做通用词表：粘连位置千奇百怪，通用替换会造病句。

未命中的条目只报警告、不阻断（同一条规则可能已被别的轮次改掉）。
用法：python3 scripts/fix-cjk-words.py [--apply]
"""
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")

# (语种, 原文片段, 改正片段)
RULES = [
    # ── 西班牙语 ──
    ("es", "se嵌入式 en el concreto", "se embuten en el concreto"),
    ("es", "se嵌入 en el concreto", "se embuten en el concreto"),
    ("es", "cargado de sal来自 operaciones", "cargado de sal procedente de operaciones"),
    ("es", "con基础设施 deficientes", "con infraestructura deficiente"),
    ("es", "condiciones del suelo本地", "condiciones del suelo local"),
    ("es", "países内陆anos", "países sin litoral"),
    ("es", "la eficiencia del供应链", "la eficiencia de la cadena de suministro"),
    ("es", "de 20 pies容纳18-22 toneladas", "de 20 pies alberga 18-22 toneladas"),
    ("es", "use绝缘 arandelas", "use arandelas aislantes"),
    ("es", "elegante al无需 penetración", "elegante sin necesidad de penetración"),
    ("es", "organismos认可ados", "organismos acreditados"),
    ("es", "tornillos de插座", "tornillos de cabeza hueca"),
    ("es", "movimientos微小 que de otro modo", "movimientos mínimos que de otro modo"),
    ("es", "localizada en金属薄板 aplicaciones", "localizadas en aplicaciones de chapa fina"),
    ("es", "para顺利完成 importaciones", "para completar sin contratiempos las importaciones"),
    ("es", "minimiza los tiempos de滞留 en puerto", "minimiza los tiempos de permanencia en puerto"),
    ("es", "resistencia a la corrosión添加 de molibdeno",
     "resistencia a la corrosión aportada por el molibdeno"),
    ("es", "de aire cargado de sal", "de aire cargado de sal"),
    # ── 葡萄牙语 ──
    ("pt", "requeridas para o ambiente服役", "requeridas para o ambiente em serviço"),
    ("pt", "historicamente平均 5–12 dias", "historicamente uma média de 5–12 dias"),
    ("pt", "proteção牺牲ária", "proteção sacrificial"),
    ("pt", "proteção牺牲ria", "proteção sacrificial"),
    ("pt", "requisitos regulatórios复杂", "requisitos regulatórios complexos"),
    ("pt", "mantenham熟悉 com requisitos", "mantenham familiaridade com os requisitos"),
    ("pt", "Para导入商 que operam", "Para importadores que operam"),
    ("pt", "aplicações estruturais中等", "aplicações estruturais médias"),
    ("pt", "conformidade com os版本 mais recentes", "conformidade com as versões mais recentes"),
    ("pt", "muitos compradores忽略了", "muitos compradores ignoram"),
    ("pt", "para嵌入式 sinkamento limpo", "para um embutimento limpo"),
    ("pt", "quando压缩contra a superfície", "quando comprimida contra a superfície"),
    ("pt", "folhas de金属 precisam serfixados", "folhas de metal precisam ser fixadas"),
    ("pt", "que来处理65% do tráfego", "que movimenta 65% do tráfego"),
    ("pt", "que捕捉 variações de fabricação", "que capta variações de fabricação"),
    ("pt", "e抽查 aleatórias de amostras", "e amostragens aleatórias de amostras"),
    ("pt", ",抽查 aleatórias em fábrica", ", amostragens aleatórias em fábrica"),
    ("pt", "conseguemfixar termos contratuais", "conseguem fixar termos contratuais"),
    ("pt", "garantir優先位 de atendimento", "garantir prioridade de atendimento"),
    ("pt", "Recomenda-se预留充足的备货时间 (reservar tempo adequado para preparação)",
     "Recomenda-se reservar tempo adequado para preparação"),
    ("pt", "que compran来自全球供应商", "que compram de fornecedores globais"),
    ("pt", "<strong>Infraestrutura-chave需要的", "<strong>Infraestrutura-chave necessária"),
    ("pt", "profundidades de嵌入式 de 150-200mm", "profundidades de embutimento de 150-200 mm"),
    ("pt", "em construção分段", "em construção por segmentos"),
    ("pt", "em Apapa平均 $457", "em Apapa uma média de $457"),
    ("pt", "As细分 específicas incluem", "As subcategorias específicas incluem"),
    ("pt", "de detenção平均 75 EUR", "de detenção uma média de 75 EUR"),
    ("pt", "para我的我的 parafusos estruturais", "para os meus parafusos estruturais"),
    ("pt", "padronização德国的严谨性", "padronização do rigor alemão"),
    ("pt", "de fornecedores替代 que garantam", "de fornecedores alternativos que garantam"),
    ("pt", "participação在这些 mercados", "participação nesses mercados"),
    ("pt", "de proteção牺牲ria que continua", "de proteção sacrificial que continua"),
    ("pt", "com o benefício adicional de proteção牺牲ria",
     "com o benefício adicional de proteção sacrificial"),
    # ── 法语 ──
    ("fr", "sécurité结构iques", "sécurité structurelle"),
    ("fr", "cadres结构ls en acier", "cadres structurels en acier"),
    ("fr", "assemblages结构uraux", "assemblages structurels"),
    ("fr", "de boulons en L et J de尺寸 M16", "de boulons en L et J de dimension M16"),
    ("fr", "un lot de production样品", "un lot de production échantillon"),
    ("fr", "rondelles plates专为 les goupilles", "rondelles plates conçues pour les goupilles"),
    ("fr", "typiquement程序ent la maintenance", "programment la maintenance"),
    ("fr", "une protection牺牲 contre les éléments", "une protection sacrificielle contre les éléments"),
    ("fr", "les.见[projets de magnétite Kunene] et", "les projets de magnétite de Kunene et"),
    ("fr", "avec des exigences严格 en matière", "avec des exigences strictes en matière"),
    ("fr", "surcharges portuaires添加 500 à 1 000", "surcharges portuaires de 500 à 1 000"),
    ("fr", "de commerces,随着经济信心回升.", "de commerces, à mesure que la confiance économique remonte."),
    ("fr", "la nécessité de建立健全 des relations", "la nécessité d'établir des relations"),
    ("fr", "les risques的品质 et de conformité", "les risques de qualité et de conformité"),
    ("fr", "pour les fixations用在 la construction", "pour les fixations utilisées dans la construction"),
    ("fr", "les projets石油 et de construction", "les projets pétroliers et de construction"),
    ("fr", "applications的特殊 exigences", "applications à exigences particulières"),
    ("fr", "Forte demande来自l'expansion", "Forte demande liée à l'expansion"),
    ("fr", "conteneurs滞留10 jours", "conteneurs immobilisés 10 jours"),
    # ── 德语 ──
    ("de", "Drehmomentschlüssel按规定 Drehmoment", "mit dem vorgeschriebenen Drehmoment"),
    ("de", "Die具体细则 umfassen", "Die Detailkategorien umfassen"),
    ("de", "hinaus滞留, erreichen", "hinaus im Lager verbleiben, erreichen"),
    ("de", "was最后一-Minute-Papierkram-Stresses", "was Papierkram in letzter Minute vermeidet"),
    ("de", "20–35% Kosten的优势 gegenüber", "20–35% Kostenvorteil gegenüber"),
    # ── 俄语 ──
    ("ru", "проведение третьих сторон检查服务", "проведение инспекции третьими сторонами"),
    ("ru", "запасы специальных规格", "запасы специальных изделий"),
    ("ru", "Для冷链基础设施项目的 крепёжные", "Для проектов холодовой цепи крепёжные"),
    ("ru", "наиболее часто指定ывается", "чаще всего указывается"),
    ("ru", "отчёты третьих сторон检测报告", "отчёты об инспекции третьих сторон"),
    ("ru", "Производство сельскохозяйственного оборудования依赖于 среднепрочных",
     "Производство сельскохозяйственного оборудования опирается на среднепрочные"),
    ("ru", "должны включать条款", "должны включать условия"),
    # ── 阿拉伯语 ──
    ("ar", "حيث指定 المشاريع التجارية", "حيث تتطلب المشاريع التجارية"),
    ("ar", "بوصة约占 80%", "بوصة نحو 80%"),
    ("ar", "تضم至少 20 معياراً", "تضم 20 معياراً على الأقل"),
    ("ar", "للش买家 الصناعيين", "للمشترين الصناعيين"),
    ("ar", "由中国 построен", "بُنيت من قبل شركات صينية"),
    ("ar", "تقبل许多 المناجم", "تقبل مناجم كثيرة"),
    ("ar", "الدرجة 8.8及以上", "الدرجة 8.8 وما فوق"),
    ("ar", "إلى消除 الجزء الأكبر", "إلى إزالة الجزء الأكبر"),
    ("ar", "بتكاليف下游ية", "بتكاليف لاحقة"),
    ("ar", "،通常 تتراوح رسومها", "، إذ تتراوح رسومها"),
    ("ar", "للبيئات，高度腐蚀性环境 становится предпочтательным выбором.",
     "للبيئات شديدة التآكل، تصبح الخيار المفضل."),
    ("ar", "للبيئات，高度腐蚀性环境 становится предпочтительным выбором.",
     "للبيئات شديدة التآكل، تصبح الخيار المفضل."),
    ("ar", "يجب أن考虑 التخطيط", "يجب مراعاة التخطيط"),
    ("ar", "غسالات نجمة القفل الخارجية锁定垫圈 الخارجي",
     "غسالات نجمة القفل الخارجية"),
    ("ar", "لتكاليف到达. يمكن", "لتكاليف عند الوصول. يمكن"),
    ("ar", "加快了وزارة النقل", "سرّعت وزارة النقل"),
    ("ar", "(否则 تبدأ رسوم التوقف", "(وإلا تبدأ رسوم التوقف"),
    ("ar", "应用于 الآلات الثقيلة", "تُستخدم في الآلات الثقيلة"),
    # ── 印地语 ──
    ("hi", "कंक्रीट और मश鲁मरी", "कंक्रीट और मशीनरी"),
    ("hi", "—掰कॉर्निस फिक्सिंग", "— कॉर्निस फिक्सिंग"),
    ("hi", "न्यूनतम तन्यता閾 1220", "न्यूनतम तन्यता सीमा 1220"),
    ("hi", "同一-दिन रिलीज", "उसी दिन रिलीज"),
    # ── 第二轮补充（复核后剩余的粘连）──
    ("ru", "проведение третьих сторон检查服务", "проведение инспекции третьими сторонами"),
    ("ru", "проведения третьих сторон检查服务", "проведения инспекции третьими сторонами"),
    ("ru", "отчётытретьих сторон检测报告", "отчёты об инспекции третьих сторон"),
    ("ru", "подтверждение実績 поставок", "подтверждение опыта поставок"),
    ("es", "profundidad de嵌入 adecuada", "profundidad de embutimento adecuada"),
    ("es", "y la profundidad de嵌入", "y la profundidad de embutimento"),
    ("es", "seinstalan", "se instalan"),
    ("es", "uso de润滑antes", "uso de lubricantes"),
    ("es", "importando y供应ando", "importando y suministrando"),
    ("es", "temperatura de trabajo通常 de -29°C", "temperatura de trabajo habitual de -29°C"),
    ("es", "<strong>吞吐量 del Puerto de Mombasa", "<strong>Tráfico del Puerto de Mombasa"),
    ("es", "<strong>吞吐量 del Puerto de Durban", "<strong>Tráfico del Puerto de Durban"),
    ("pt", "quando嵌入 em fundações", "quando embutidos em fundações"),
    ("pt", "fabricadas严格按照规格要求制造，用于：", "fabricadas estritamente conforme a especificação e usadas em:"),
    ("pt", "Subsaariana)来处理65%", "Subsaariana) movimenta 65%"),
    ("pt", "Recomenda-se预留充足的备货时间 (reservar tempo adequado para preparação)",
     "Recomenda-se reservar tempo adequado para preparação"),
    ("fr", "de尺寸 M16 x 300mm", "de dimension M16 x 300 mm"),
    ("fr", "de尺寸 M20 x 600mm", "de dimension M20 x 600 mm"),
    ("fr", "les joints入金 (lens)", "les joints à lentille (lens)"),
    ("fr", "Cette资源优势 est complété", "Cet avantage en ressources est complété"),
    ("fr", "fret maritime,要考虑 les droits", "fret maritime, il faut considérer les droits"),
    ("fr", "lors du premier安装 et créent", "lors du premier montage et créent"),
    ("fr", "de commerces,随着经济信心回升。", "de commerces, à mesure que la confiance économique remonte."),
    ("ar", "将使 احتجاز شحنتك", "ستؤدي إلى احتجاز شحنتك"),
    ("ar", "اقتصاديات التكلفة到达. يمكن", "اقتصاديات التكلفة عند الوصول. يمكن"),
    ("ar", "تكاليف下游ية كبيرة", "تكاليف لاحقة كبيرة"),
]


def main():
    do_apply = "--apply" in sys.argv
    stats = {}
    files = {}
    for f in sorted(glob.glob(os.path.join(ART, "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        changed = False
        for sec in d.get("sections", []):
            for field in ("heading", "body"):
                v = sec.get(field)
                if not isinstance(v, dict):
                    continue
                for lang, txt in list(v.items()):
                    if not isinstance(txt, str):
                        continue
                    new = txt
                    for lg, old, rep in RULES:
                        if lg != lang:
                            continue
                        if old in new:
                            new = new.replace(old, rep)
                            key = f"{lg}: {old[:34]}"
                            stats[key] = stats.get(key, 0) + 1
                    if new != txt:
                        v[lang] = new
                        changed = True
        if changed:
            files[f] = d

    for k, v in sorted(stats.items(), key=lambda x: -x[1]):
        print(f"  {v}  {k}")
    print(f"命中 {sum(stats.values())} 处 / {len(files)} 篇")
    unmatched = [f"{lg}: {old[:40]}" for lg, old, rep in RULES
                 if not any(f"{lg}: {old[:34]}" == k for k in stats)]
    if unmatched:
        print("未命中（可能已被别的轮次改掉，需复核）：")
        for u in unmatched[:20]:
            print("   -", u)
    if do_apply:
        for f, d in files.items():
            open(f, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
        print(f"已写回 {len(files)} 篇")
    else:
        print("（报告模式，加 --apply 落盘）")


if __name__ == "__main__":
    main()
