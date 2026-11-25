#!/usr/bin/env python3
"""concrete-screws-anchors-guide §5 整节重写：es/fr/pt/de 原来放的是英文原文 + 中文尾巴。

一次性脚本，可重跑覆盖。只动 sections[5].body.{es,fr,pt,de}。
"""
import json

A = ('class="text-primary-600 hover:text-primary-800 underline '
     'underline-offset-2"')

TABLES = {
    'es': """| Tipo de anclaje | Diámetro | Resistencia a tracción (kN) | Resistencia al corte (kN) | Mejor aplicación |
|-------------|----------|----------------------|---------------------|------------------|
| Anclaje de cuña | M12 | 25-35 | 30-40 | Estructura pesada |
| Anclaje de manguito | M10 | 12-18 | 15-22 | Carga media |
| Tornillo para hormigón | 8 mm | 8-12 | 10-15 | Ligera a media |
| Anclaje de inserción | M8 | 6-10 | 8-12 | Techos suspendidos |""",
    'fr': """| Type de cheville | Diamètre | Résistance à la traction (kN) | Résistance au cisaillement (kN) | Meilleure application |
|-------------|----------|----------------------|---------------------|------------------|
| Cheville à coin | M12 | 25-35 | 30-40 | Structure lourde |
| Cheville à manchon | M10 | 12-18 | 15-22 | Charge moyenne |
| Vis à béton | 8 mm | 8-12 | 10-15 | Légère à moyenne |
| Cheville à frapper | M8 | 6-10 | 8-12 | Plafonds suspendus |""",
    'pt': """| Tipo de chumbador | Diâmetro | Resistência à tração (kN) | Resistência ao cisalhamento (kN) | Melhor aplicação |
|-------------|----------|----------------------|---------------------|------------------|
| Chumbador cunha | M12 | 25-35 | 30-40 | Estrutura pesada |
| Chumbador luva | M10 | 12-18 | 15-22 | Carga média |
| Parafuso para concreto | 8 mm | 8-12 | 10-15 | Leve a média |
| Chumbador de inserção | M8 | 6-10 | 8-12 | Forros suspensos |""",
    'de': """| Dübeltyp | Durchmesser | Zugfestigkeit (kN) | Scherfestigkeit (kN) | Beste Anwendung |
|-------------|----------|----------------------|---------------------|------------------|
| Keildübel | M12 | 25-35 | 30-40 | Schwere Tragstruktur |
| Hülsendübel | M10 | 12-18 | 15-22 | Mittlere Last |
| Betonschraube | 8 mm | 8-12 | 10-15 | Leicht bis mittel |
| Einschlagdübel | M8 | 6-10 | 8-12 | Abgehängte Decken |""",
}

T = {
'es': {
 'intro': 'Los tornillos y anclajes para hormigón deben cumplir requisitos específicos de resistencia portante en aplicaciones estructurales de la construcción africana. Las normas más habituales son:',
 'iso': 'Propiedades mecánicas de los sujetadores de acero inoxidable resistentes a la corrosión',
 'astm': 'Métodos de ensayo normalizados para la resistencia de anclajes en hormigón',
 'code': 'EN 1992-4 (Eurocódigo 2)',
 'euro': 'Diseño de fijaciones para su uso en hormigón',
 'coast': 'En las regiones costeras de África (Senegal, Nigeria, Ghana), utilice acero inoxidable grado 316 (A4) por su resistencia a la niebla salina. En aplicaciones del interior, el grado 304 (A2) o el acero al carbono cincado resultan rentables.',
 'torque': ['Anclaje M8: 20-25 Nm', 'Anclaje M10: 40-50 Nm', 'Anclaje M12: 70-85 Nm', 'Anclaje M16: 150-180 Nm'],
 'drill': 'Perfore siempre previamente con la broca del diámetro correcto (normalmente 0,95 × el diámetro del anclaje para anclajes de cuña y 0,85 × para anclajes de manguito).',
 'link1': '/es/industry/south-africa-fasteners-china-import-guide',
 'l1': 'importación de sujetadores de China a Sudáfrica',
 'link2': '/es/products',
 'l2': 'nuestro catálogo de productos',
 'tail': 'Los compradores B2B que operan en varios países deben armonizar las especificaciones con las normas regionales y los requisitos aduaneros locales. Marcos regionales habituales: SABS (Sudáfrica), KEBS (Kenia), TBS (Tanzania), ZIMRA (Zimbabue), SON (Nigeria) y las normas de la AfCFTA para el comercio panafricano. El cumplimiento de las normas locales suele ser obligatorio en proyectos de infraestructura pública, operaciones mineras y licitaciones gubernamentales.',
},
'fr': {
 'intro': 'Les vis de béton et les chevilles doivent répondre à des exigences de charge portante précises pour les applications structurelles dans la construction africaine. Les normes les plus courantes sont :',
 'iso': "Propriétés mécaniques des fixations en acier inoxydable résistant à la corrosion",
 'astm': "Méthodes d'essai normalisées pour la résistance des chevilles dans le béton",
 'code': 'EN 1992-4 (Eurocode 2)',
 'euro': 'Conception des fixations pour le béton',
 'coast': "Dans les régions côtières africaines (Sénégal, Nigeria, Ghana), utilisez de l'acier inoxydable de nuance 316 (A4) pour résister aux embruns. À l'intérieur des terres, la nuance 304 (A2) ou l'acier au carbone zingué est le plus rentable.",
 'torque': ['Cheville M8 : 20-25 Nm', 'Cheville M10 : 40-50 Nm', 'Cheville M12 : 70-85 Nm', 'Cheville M16 : 150-180 Nm'],
 'drill': "Percez toujours au préalable avec le foret du bon diamètre (en général 0,95 × le diamètre de la cheville pour les chevilles à coin, 0,85 × pour les chevilles à manchon).",
 'link1': '/fr/industry/south-africa-fasteners-china-import-guide',
 'l1': "l'importation de fixations de Chine vers l'Afrique du Sud",
 'link2': '/fr/products',
 'l2': 'notre catalogue produits',
 'tail': "Les acheteurs B2B présents dans plusieurs pays doivent harmoniser leurs spécifications avec les normes régionales et les exigences douanières locales. Cadres régionaux courants : SABS (Afrique du Sud), KEBS (Kenya), TBS (Tanzanie), ZIMRA (Zimbabwe), SON (Nigéria) et les normes de la ZLECAf pour le commerce panafricain. Le respect des normes locales est souvent obligatoire pour les projets d'infrastructure publique, les opérations minières et les appels d'offres publics.",
},
'pt': {
 'intro': 'Parafusos e chumbadores para concreto devem atender a requisitos específicos de capacidade de carga em aplicações estruturais na construção africana. As normas mais comuns são:',
 'iso': 'Propriedades mecânicas de fixadores de aço inoxidável resistentes à corrosão',
 'astm': 'Métodos de ensaio normalizados para resistência de chumbadores em concreto',
 'code': 'EN 1992-4 (Eurocódigo 2)',
 'euro': 'Projeto de fixações para uso em concreto',
 'coast': 'Nas regiões costeiras da África (Senegal, Nigéria, Gana), use aço inoxidável grau 316 (A4) pela resistência à névoa salina. No interior, o grau 304 (A2) ou o aço carbono zincado têm melhor custo-benefício.',
 'torque': ['Chumbador M8: 20-25 Nm', 'Chumbador M10: 40-50 Nm', 'Chumbador M12: 70-85 Nm', 'Chumbador M16: 150-180 Nm'],
 'drill': 'Sempre pré-fure com a broca do diâmetro correto (normalmente 0,95 × o diâmetro do chumbador para chumbadores cunha e 0,85 × para chumbadores luva).',
 'link1': '/pt/industry/south-africa-fasteners-china-import-guide',
 'l1': 'importação de fixadores da China para a África do Sul',
 'link2': '/pt/products',
 'l2': 'nosso catálogo de produtos',
 'tail': 'Compradores B2B que atuam em vários países devem harmonizar as especificações com as normas regionais e as exigências aduaneiras locais. Estruturas regionais comuns: SABS (África do Sul), KEBS (Quênia), TBS (Tanzânia), ZIMRA (Zimbábue), SON (Nigéria) e as normas da AfCFTA para o comércio pan-africano. O cumprimento das normas locais costuma ser obrigatório em projetos de infraestrutura pública, operações de mineração e licitações governamentais.',
},
'de': {
 'intro': 'Betonschrauben und Dübel müssen für strukturelle Anwendungen im afrikanischen Bauwesen bestimmte Tragfähigkeitsanforderungen erfüllen. Die gängigsten Normen sind:',
 'iso': 'Mechanische Eigenschaften korrosionsbeständiger Befestigungselemente aus Edelstahl',
 'astm': 'Normprüfverfahren für die Tragfähigkeit von Dübeln in Beton',
 'code': 'EN 1992-4 (Eurocode 2)',
 'euro': 'Bemessung von Befestigungen für Beton',
 'coast': 'In den Küstenregionen Afrikas (Senegal, Nigeria, Ghana) Edelstahl der Güte 316 (A4) wegen der Salznebelbeständigkeit verwenden. Im Landesinneren sind Güte 304 (A2) oder verzinkter Kohlenstoffstahl wirtschaftlich.',
 'torque': ['Dübel M8: 20-25 Nm', 'Dübel M10: 40-50 Nm', 'Dübel M12: 70-85 Nm', 'Dübel M16: 150-180 Nm'],
 'drill': 'Immer mit dem Bohrer des richtigen Durchmessers vorbohren (üblicherweise 0,95 × Dübeldurchmesser bei Keildübeln, 0,85 × bei Hülsendübeln).',
 'link1': '/de/industry/south-africa-fasteners-china-import-guide',
 'l1': 'Einfuhr von Befestigungselementen aus China nach Südafrika',
 'link2': '/de/products',
 'l2': 'unserem Produktkatalog',
 'tail': 'B2B-Einkäufer, die in mehreren Ländern tätig sind, sollten die Spezifikationen mit regionalen Normen und lokalen Zollvorschriften abstimmen. Gängige regionale Rahmenwerke: SABS (Südafrika), KEBS (Kenia), TBS (Tansania), ZIMRA (Simbabwe), SON (Nigeria) sowie die AfCFTA-Normen für den panafrikanischen Handel. Die Einhaltung lokaler Normen ist bei öffentlichen Infrastrukturprojekten, im Bergbau und bei staatlichen Ausschreibungen oft verbindlich.',
},
}


ZH = {
 'intro': '混凝土螺钉与锚栓必须满足非洲建筑结构应用的承载要求。最常见的标准包括：',
 'list': ['ISO 898：耐腐蚀不锈钢紧固件的机械性能',
          'ASTM E488：混凝土中锚栓承载力的标准试验方法',
          'EN 1992-4（欧洲规范 2）：混凝土用紧固件的设计'],
 'table': """| 锚栓类型 | 直径 | 抗拉承载力（kN） | 抗剪承载力（kN） | 最佳应用 |
|-------------|----------|----------------------|---------------------|------------------|
| 楔形锚栓 | M12 | 25-35 | 30-40 | 重型结构 |
| 套管锚栓 | M10 | 12-18 | 15-22 | 中等载荷 |
| 混凝土螺钉 | 8 mm | 8-12 | 10-15 | 轻至中等载荷 |
| 内胀锚栓 | M8 | 6-10 | 8-12 | 吊顶 |""",
 'coast': '非洲沿海地区（塞内加尔、尼日利亚、加纳）建议使用 316（A4）不锈钢以抵抗盐雾；内陆应用使用 304（A2）不锈钢或镀锌碳钢更具性价比。',
 'torque': ['M8 锚栓：20-25 Nm', 'M10 锚栓：40-50 Nm', 'M12 锚栓：70-85 Nm', 'M16 锚栓：150-180 Nm'],
 'drill': '务必使用正确直径的钻头预钻孔（楔形锚栓通常为锚栓直径的 0.95 倍，套管锚栓为 0.85 倍）。',
 'tail': '如需了解更多，请参阅我们的<a href="/zh/industry/south-africa-fasteners-china-import-guide" {A}>南非紧固件自中国进口指南</a>，或<a href="/zh/products" {A}>浏览产品目录</a>。在多个国家运营的 B2B 买家应把规格与区域标准及当地海关要求对齐。常见区域框架：SABS（南非）、KEBS（肯尼亚）、TBS（坦桑尼亚）、ZIMRA（津巴布韦）、SON（尼日利亚）以及 AfCFTA 的非洲大陆贸易标准。公共基础设施项目、采矿作业和政府招标通常强制要求符合本地标准。',
}

JA = {
 'intro': 'コンクリート用スクリューとアンカーは、アフリカの建設における構造用途で求められる耐荷重要件を満たす必要があります。代表的な規格は次のとおりです。',
 'list': ['ISO 898：耐食ステンレス鋼製締結具の機械的性質',
          'ASTM E488：コンクリート中のアンカー強度に関する標準試験方法',
          'EN 1992-4（ユーロコード2）：コンクリート用固定具の設計'],
 'table': """| アンカー種類 | 径 | 引張強度（kN） | せん断強度（kN） | 最適用途 |
|-------------|----------|----------------------|---------------------|------------------|
| ウェッジアンカー | M12 | 25-35 | 30-40 | 重量構造 |
| スリーブアンカー | M10 | 12-18 | 15-22 | 中荷重 |
| コンクリートスクリュー | 8 mm | 8-12 | 10-15 | 軽〜中荷重 |
| ドロップインアンカー | M8 | 6-10 | 8-12 | 吊り天井 |""",
 'coast': 'アフリカの沿海地域（セネガル、ナイジェリア、ガーナ）では塩害に強い316（A4）ステンレスを使用してください。内陸用途では304（A2）または亜鉛めっき炭素鋼が費用対効果に優れます。',
 'torque': ['M8アンカー：20-25 Nm', 'M10アンカー：40-50 Nm', 'M12アンカー：70-85 Nm', 'M16アンカー：150-180 Nm'],
 'drill': '必ず正しい径のドリルで下穴を開けてください（ウェッジアンカーは通常アンカー径の0.95倍、スリーブアンカーは0.85倍）。',
 'tail': '詳細は<a href="/ja/industry/south-africa-fasteners-china-import-guide" {A}>南アフリカ向け中国産ファスナー輸入ガイド</a>、または<a href="/ja/products" {A}>製品カタログ</a>をご覧ください。複数国で事業を行うB2Bバイヤーは、仕様を地域規格と現地通関要件に整合させる必要があります。主な地域枠組み：SABS（南アフリカ）、KEBS（ケニア）、TBS（タンザニア）、ZIMRA（ジンバブエ）、SON（ナイジェリア）、およびAfCFTA（アフリカ大陸自由貿易圏）標準。公共インフラ案件、鉱山操業、政府入札では現地規格への適合が義務付けられることが多くあります。',
}


def build_cjk(lg):
    s = {'zh': ZH, 'ja': JA}[lg]
    lines = ['', s['intro'], '']
    lines += [f'- {x}' for x in s['list']]
    lines += ['', s['table'], '', s['coast'], '']
    lines += [f'- {t}' for t in s['torque']]
    lines += ['', s['drill'], '', s['tail'].replace('{A}', A)]
    return '\n'.join(lines)


def build(lg):
    s = T[lg]
    more = {'es': 'Para más información, consulte', 'fr': 'Pour en savoir plus, consultez',
            'pt': 'Para mais informações, consulte', 'de': 'Weitere Informationen finden Sie in'}[lg]
    lines = [
        '',
        s['intro'],
        '',
        f"- ISO 898: {s['iso']}",
        f"- ASTM E488: {s['astm']}",
        f"- {s['code']}: {s['euro']}",
        '',
        TABLES[lg],
        '',
        s['coast'],
        '',
    ]
    lines += [f'- {t}' for t in s['torque']]
    conj = {'es': 'y', 'fr': 'et', 'pt': 'e', 'de': 'und'}[lg]
    tail_link = (f'{more} <a href="{s["link1"]}" {A}>{s["l1"]}</a> {conj} '
                 f'<a href="{s["link2"]}" {A}>{s["l2"]}</a>. {s["tail"]}')
    lines += ['', s['drill'], '', tail_link]
    return '\n'.join(lines)


def main():
    p = 'content/articles/concrete-screws-anchors-guide.json'
    d = json.load(open(p))
    for lg in ('es', 'fr', 'pt', 'de'):
        d['sections'][5]['body'][lg] = build(lg)
    for lg in ('zh', 'ja'):
        d['sections'][5]['body'][lg] = build_cjk(lg)
    if True:
        pass
    for lg in ():
        d['sections'][5]['body'][lg] = build(lg)
    json.dump(d, open(p, 'w'), ensure_ascii=False, indent=2)
    open(p, 'a').write('\n')
    print('concrete §5 重写完成：es/fr/pt/de')


if __name__ == '__main__':
    main()
