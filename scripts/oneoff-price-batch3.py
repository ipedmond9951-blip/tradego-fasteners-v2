#!/usr/bin/env python3
"""第三批价格去数字化（安全版）。

按小节分三种改法，避免把案例成效 / 税费 / 物流费也套成「报价结构」：
- STRUCT      价格小节：用 strip-price-figures 的 strip_text（删含金额句 + 原位插入该语种结构段）；
- STRUCT_FULL 整节就是报价：整字段换成该语种结构段；
- CASE        案例成效：整字段换成手写段落（保留准时率/不合格率/认证等非金额指标，金额改相对表述）；
- PLAIN       税费示例 / 物流费：删掉含金额句，追加该语种「只讲算法」说明。
fail-closed：处理后仍有金额（含 dollar/دولار/ドル/डॉलर 等本地写法）、或长度跌破原长 55% → 该字段不动。
句子切分要求标点后有空白，避免 "99.2%" 被切成 "99." + "2%"。
"""
import importlib.util, json, re, sys

spec = importlib.util.spec_from_file_location('spf', 'scripts/strip-price-figures.py')
spf = importlib.util.module_from_spec(spec)
sys.path.insert(0, 'scripts')
spec.loader.exec_module(spf)
MONEY = spf.MONEY
EXT = re.compile(r'(?:dollar|доллар|دولار|ドル|डॉलर|דולר)', re.I)

def has_money(t):
    return bool(MONEY.search(t)) or bool(EXT.search(t))

PLAIN = {
 'en': "Each component is computed from declared cargo value or batch parameters; the actual figure moves with value, specification and shipping distance, so the batch quotation or customs documents govern — no fixed amount is published here.",
 'zh': "各项均按申报货值或批次参数计算，实际数字随货值、规格与运距变化，以当批报价或清关单据为准，本节不列具体金额。",
 'es': "Cada componente se calcula sobre el valor declarado o los parámetros del lote; la cifra real cambia con el valor, la especificación y la distancia, por lo que rige la cotización del lote o los documentos de aduana, sin montos fijos publicados aquí.",
 'fr': "Chaque composante se calcule sur la valeur déclarée ou les paramètres du lot ; le chiffre réel varie avec la valeur, la spécification et la distance, la cotation du lot ou les documents douaniers faisant foi — aucun montant fixe n'est publié ici.",
 'pt': "Cada componente é calculado sobre o valor declarado ou os parâmetros do lote; o número real varia com valor, especificação e distância, valendo a cotação do lote ou os documentos aduaneiros — nenhum valor fixo é publicado aqui.",
 'de': "Jede Komponente wird aus dem erklärten Warenwert bzw. den Chargenparametern berechnet; die tatsächliche Zahl ändert sich mit Wert, Spezifikation und Versandweg, maßgeblich sind Chargenangebot oder Zollpapiere — ein Festbetrag wird hier nicht veröffentlicht.",
 'ru': "Каждая составляющая считается от заявленной стоимости груза или параметров партии; фактическая цифра меняется со стоимостью, спецификацией и дальностью, ориентир — предложение по партии или таможенные документы; фиксированные суммы здесь не публикуются.",
 'ar': "يُحسب كل مكوّن من قيمة البضاعة المعلنة أو معاملات الدفعة، والرقم الفعلي يتغير مع القيمة والمواصفة ومسافة الشحن، والمرجع هو عرض الدفعة أو مستندات التخليص؛ ولا يُنشر هنا أي مبلغ ثابت.",
 'ja': "各項目は申告貨物価値またはロット条件から算出され、実際の数値は価値・仕様・輸送距離で変動します。実際のロットの見積または通関書類が基準で、本節では固定金額を掲載しません。",
 'hi': "हर घटक घोषित माल-मूल्य या बैच पैरामीटर से निकाला जाता है, और वास्तविक आंकड़ा मूल्य, स्पेसिफिकेशन व दूरी के साथ बदलता है; बैच का कोटेशन या सीमा-शुल्क दस्तावेज ही आधार हैं — यहाँ कोई तय राशि नहीं दी जाती।",
}

CASE_TEXT = {
 'south-africa-fastener-market-case-study|results-outcomes': {
  'en': "Project execution: all 36 contract phases delivered on time, zero non-conformity reports, and 100% first-pass acceptance on SABS documentation. Fastener spend is calculated per specification, batch and shipping distance rather than quoted as a fixed figure — savings against the local-supplier budget approach run in double-digit percentages and move with batch prices and exchange rates, so the quotation for the actual batch governs. The programme led to two further South African infrastructure contracts in 2025, both using the same China-to-Durban sourcing model.",
  'zh': "项目执行：36 个合同阶段全部准时交付，零不符合项报告，SABS 文件 100% 一次性通过。紧固件成本按规格、批次与运距核算，不作固定报价——相对本地供应商预算口径的节约通常呈两位数百分比量级，随批价与汇率浮动，以当批报价为准。该项目随后带来 2025 年另外两个南非基础设施合同，均沿用中国至德班的采购模式。",
  'es': "Ejecución del proyecto: las 36 fases del contrato se entregaron a tiempo, cero informes de no conformidad y 100% de aceptación en primera revisión de la documentación SABS. El gasto en sujetadores se calcula por especificación, lote y distancia de envío, no como cifra fija: el ahorro frente al enfoque de presupuesto con proveedor local se sitúa en porcentajes de dos dígitos y varía con los precios de lote y el tipo de cambio, por lo que rige la cotización del lote real. El programa derivó en dos contratos sudafricanos de infraestructura más en 2025, ambos con el mismo modelo de abastecimiento China-Durban.",
  'fr': "Exécution du projet : les 36 phases du contrat ont été livrées dans les délais, aucun rapport de non-conformité et 100 % d'acceptation au premier passage de la documentation SABS. Le coût des fixations se calcule par spécification, lot et distance d'expédition, et non sous forme de montant fixe : l'économie par rapport à l'approche budgétaire avec un fournisseur local se situe dans des pourcentages à deux chiffres et varie avec les prix de lot et le taux de change ; la cotation du lot réel fait foi. Le programme a débouché sur deux autres contrats d'infrastructure sud-africains en 2025, tous deux selon le même modèle d'approvisionnement Chine-Durban.",
  'pt': "Execução do projeto: as 36 fases do contrato foram entregues no prazo, zero relatórios de não conformidade e 100% de aceitação na primeira análise da documentação SABS. O custo de fixadores é calculado por especificação, lote e distância de envio, não como valor fixo: a economia frente à abordagem de orçamento com fornecedor local fica em percentuais de dois dígitos e varia com preços de lote e câmbio, valendo a cotação do lote real. O programa gerou mais dois contratos sul-africanos de infraestrutura em 2025, ambos com o mesmo modelo China-Durban.",
  'de': "Projektabwicklung: Alle 36 Vertragsphasen wurden pünktlich geliefert, null Nichtkonformitätsberichte und 100 % Annahme der SABS-Dokumentation im ersten Durchlauf. Der Befestigungskostenanteil wird nach Spezifikation, Charge und Versandweg kalkuliert, nicht als Fixbetrag: Die Einsparung gegenüber dem Budgetansatz mit lokalem Lieferanten liegt im zweistelligen Prozentbereich und schwankt mit Chargenpreisen und Wechselkursen; maßgeblich ist das Angebot der tatsächlichen Charge. Aus dem Programm entstanden 2025 zwei weitere südafrikanische Infrastrukturverträge, beide nach demselben Beschaffungsmodell China–Durban.",
  'ru': "Ход проекта: все 36 этапов контракта выполнены в срок, ни одного отчёта о несоответствии, документация SABS принята с первого предъявления на 100 %. Затраты на крепёж считаются по спецификации, партии и дальности перевозки, а не как фиксированная сумма: экономия относительно бюджетного подхода с местным поставщиком измеряется двузначными процентами и меняется с ценами партии и курсом, поэтому ориентиром служит предложение по фактической партии. Программа дала два новых инфраструктурных контракта в ЮАР в 2025 году — оба по той же модели закупки Китай–Дурбан.",
  'ar': "تنفيذ المشروع: سُلِّمت جميع مراحل العقد الست والثلاثين في الموعد، دون أي تقرير عدم مطابقة، وقُبلت وثائق SABS من المرة الأولى بنسبة 100%. تُحسب تكلفة المثبتات حسب المواصفة والدفعة ومسافة الشحن لا كمبلغ ثابت: يقع التوفير قياساً إلى نهج الميزانية مع مورد محلي في نطاق نسب مئوية مزدوجة الرقم ويتغير مع أسعار الدفعة وسعر الصرف، لذا يُعتمد عرض الدفعة الفعلية. أنتج البرنامج عقدين إضافيين للبنية التحتية في جنوب أفريقيا عام 2025، وكلاهما بالنموذج نفسه: الصين – ديربان.",
  'ja': "プロジェクト実行：契約36フェーズすべてを納期内に納入、不適合報告ゼロ、SABS書類は初回で100%承認。締結具コストは仕様・ロット・輸送距離で算定し、固定額では提示しません。現地サプライヤー前提の予算方式に対する削減は二桁パーセント台で、ロット価格と為替により変動するため、実際のロットの見積が基準です。本案件は2025年に南アフリカのインフラ契約2件につながり、いずれも中国〜ダーバンの同じ調達モデルを採用しています。",
  'hi': "परियोजना निष्पादन: अनुबंध के सभी 36 चरण समय पर पूरे, शून्य गैर-अनुरूपता रिपोर्ट, और SABS दस्तावेज़ीकरण 100% पहली बार में स्वीकृत। फास्टनर लागत स्पेसिफिकेशन, बैच और शिपिंग दूरी से निकाली जाती है, तय राशि के रूप में नहीं: स्थानीय सप्लायर बजट दृष्टिकोण के मुकाबले बचत दो-अंकीय प्रतिशत में रहती है और बैच कीमत व विनिमय दर के साथ बदलती है, इसलिए वास्तविक बैच का कोटेशन ही आधार है। इस कार्यक्रम से 2025 में दक्षिण अफ्रीका के दो और इंफ्रास्ट्रक्चर अनुबंध मिले, दोनों उसी चीन–डरबन सोर्सिंग मॉडल पर।",
 },
 'zambia-fastener-market-case-study|project-results': {
  'en': "Project outcome: 14 shipments, 99.2% on-time delivery, zero non-conformance reports, ZABS documentation accepted first time, material test certificates accepted without re-testing, and direct delivery to the Solwezi mine warehouse. Fastener spend was calculated per specification, batch and CIF Beira terms rather than quoted as a fixed figure; savings against local Zambian supplier pricing run in double-digit percentages and move with batch prices, freight and exchange rates — the quotation for the actual batch governs. The Kansanshi expansion's new line poured first copper in Q3 2025, ahead of schedule.",
  'zh': "项目结果：14 个批次 99.2% 准时交付，零不符合项报告，ZABS 文件一次性通过，材料试验证书全部免复检，直达索卢韦齐矿区仓库。紧固件成本按规格、批次与 CIF 贝拉条件核算，不作固定报价；相对赞比亚本地供应商报价的节约呈两位数百分比量级，随批价、运价与汇率浮动，以当批报价为准。坎桑希扩建项目新生产线于 2025 年第三季度提前出铜。",
  'es': "Resultado del proyecto: 14 envíos, 99,2% de entregas puntuales, cero informes de no conformidad, documentación ZABS aceptada en primera revisión, certificados de ensayo de materiales aceptados sin reensayo y entrega directa al almacén de la mina de Solwezi. El gasto en sujetadores se calculó por especificación, lote y condiciones CIF Beira, no como cifra fija; el ahorro frente a los precios de proveedores locales zambianos se sitúa en porcentajes de dos dígitos y varía con precios de lote, flete y tipo de cambio: rige la cotización del lote real. La nueva línea de la ampliación de Kansanshi produjo cobre por primera vez en el T3 de 2025, antes de lo previsto.",
  'fr': "Résultat du projet : 14 expéditions, 99,2 % de livraisons dans les délais, aucun rapport de non-conformité, documentation ZABS acceptée au premier passage, certificats d'essai des matériaux acceptés sans nouvel essai et livraison directe à l'entrepôt de la mine de Solwezi. Le coût des fixations a été calculé par spécification, lot et conditions CIF Beira, et non sous forme de montant fixe ; l'économie face aux prix des fournisseurs locaux zambiens se situe dans des pourcentages à deux chiffres et varie avec les prix de lot, le fret et le taux de change : la cotation du lot réel fait foi. La nouvelle ligne de l'extension de Kansanshi a produit son premier cuivre au T3 2025, en avance sur le calendrier.",
  'pt': "Resultado do projeto: 14 remessas, 99,2% de entregas no prazo, zero relatórios de não conformidade, documentação ZABS aceita na primeira análise, certificados de ensaio de materiais aceitos sem reensaio e entrega direta ao armazém da mina de Solwezi. O custo de fixadores foi calculado por especificação, lote e condições CIF Beira, não como valor fixo; a economia frente aos preços de fornecedores locais zambianos fica em percentuais de dois dígitos e varia com preços de lote, frete e câmbio: vale a cotação do lote real. A nova linha da expansão de Kansanshi produziu o primeiro cobre no T3 de 2025, antes do previsto.",
  'de': "Projektergebnis: 14 Sendungen, 99,2 % pünktliche Lieferung, null Nichtkonformitätsberichte, ZABS-Dokumentation im ersten Durchlauf akzeptiert, Werkstoffprüfzeugnisse ohne Nachprüfung angenommen und Direktlieferung ins Minenlager Solwezi. Der Befestigungskostenanteil wurde nach Spezifikation, Charge und CIF-Beira-Bedingungen kalkuliert, nicht als Fixbetrag; die Einsparung gegenüber lokalen sambischen Lieferantenpreisen liegt im zweistelligen Prozentbereich und schwankt mit Chargenpreisen, Fracht und Wechselkursen – maßgeblich ist das Angebot der tatsächlichen Charge. Die neue Linie der Kansanshi-Erweiterung produzierte im Q3 2025 früher als geplant erstes Kupfer.",
  'ru': "Результат проекта: 14 отправок, 99,2 % поставок в срок, ни одного отчёта о несоответствии, документация ZABS принята с первого предъявления, сертификаты испытаний материалов приняты без повторных испытаний, доставка напрямую на склад рудника в Солвези. Затраты на крепёж рассчитывались по спецификации, партии и условиям CIF Бейра, а не как фиксированная сумма; экономия относительно цен местных замбийских поставщиков измеряется двузначными процентами и меняется с ценами партии, фрахтом и курсом — ориентиром служит предложение по фактической партии. Новая линия расширения Kansanshi дала первую медь в III квартале 2025 года, раньше графика.",
  'ar': "نتيجة المشروع: 14 شحنة، 99.2% تسليم في الموعد، دون أي تقرير عدم مطابقة، وثائق ZABS مقبولة من المرة الأولى، شهادات اختبار المواد مقبولة دون إعادة اختبار، وتسليم مباشر إلى مستودع منجم سولويزي. حُسبت تكلفة المثبتات حسب المواصفة والدفعة وشروط CIF بيرا لا كمبلغ ثابت؛ ويقع التوفير قياساً إلى أسعار الموردين المحليين في زامبيا في نطاق نسب مئوية مزدوجة الرقم ويتغير مع أسعار الدفعة والشحن وسعر الصرف — ويُعتمد عرض الدفعة الفعلية. أنتج الخط الجديد في توسعة كانسانشي أول نحاس في الربع الثالث 2025 قبل الموعد.",
  'ja': "プロジェクト結果：14回の出荷、99.2%が納期内、不適合報告ゼロ、ZABS書類は初回承認、材料試験証明書は再試験なしで受理、ソルウェジ鉱山倉庫へ直送。締結具コストは仕様・ロット・CIFベイラ条件で算定し固定額では提示しません。ザンビア現地サプライヤー価格に対する削減は二桁パーセント台で、ロット価格・運賃・為替で変動するため、実際のロットの見積が基準です。カンサンシ拡張の新ラインは2025年第3四半期に前倒しで初回出銅しました。",
  'hi': "परियोजना परिणाम: 14 शिपमेंट, 99.2% समय पर डिलीवरी, शून्य गैर-अनुरूपता रिपोर्ट, ZABS दस्तावेज़ पहली बार में स्वीकृत, सामग्री परीक्षण प्रमाणपत्र बिना पुनः परीक्षण स्वीकार, और सीधे सोलवेज़ी खदान गोदाम तक डिलीवरी। फास्टनर लागत स्पेसिफिकेशन, बैच और CIF बेइरा शर्तों पर निकाली गई, तय राशि के रूप में नहीं; ज़ाम्बिया के स्थानीय सप्लायर दरों के मुकाबले बचत दो-अंकीय प्रतिशत में रहती है और बैच कीमत, माल भाड़ा व विनिमय दर के साथ बदलती है — वास्तविक बैच का कोटेशन ही आधार है। कानसान्शी विस्तार की नई लाइन ने 2025 की तीसरी तिमाही में तय समय से पहले पहला तांबा उत्पादित किया।",
 },
}

POLICY = [
 ('nigeria-fastener-market-guide', 'pricing', 'STRUCT'),
 ('nigeria-fastener-market-guide', 'customs', 'PLAIN'),
 ('south-africa-fastener-market-case-study', 'pricing-delivery', 'STRUCT'),
 ('south-africa-fastener-market-case-study', 'results-outcomes', 'CASE'),
 ('south-africa-fastener-market-case-study', 'statistics-1778375815174', 'PLAIN'),
 ('china-fasteners-zimbabwe-procurement-guide', 'pricing', 'STRUCT'),
 ('china-fasteners-zimbabwe-procurement-guide', 'conclusions', 'PLAIN'),
 ('zambia-fastener-market-case-study', 'specifications-pricing', 'STRUCT'),
 ('zambia-fastener-market-case-study', 'logistics-beira-corridor', 'PLAIN'),
 ('zambia-fastener-market-case-study', 'project-results', 'CASE'),
 ('zimbabwe-construction-megaprojects-fastener-demand', 'pricing-estimates', 'STRUCT_FULL'),
]

def drop(t):
    out, removed = [], 0
    for line in t.split('\n'):
        if not line.strip() or not has_money(line):
            out.append(line)
            continue
        if line.lstrip().startswith(('<li', '-', '*', '•')) or '|' in line:
            removed += 1
            continue
        parts = re.split(r'(?<=[。！？।؟])|(?<=[.;])\s+', line)
        keep = [p for p in parts if p.strip() and not has_money(p)]
        removed += sum(1 for p in parts if p.strip() and has_money(p))
        if keep:
            out.append(''.join(keep).strip())
    return '\n'.join(out).strip(), removed

def main():
    apply_ = '--apply' in sys.argv
    total = 0
    for slug, sid, kind in POLICY:
        p = 'content/articles/%s.json' % slug
        data = json.load(open(p))
        for sec in data['sections']:
            if sec.get('id') != sid or not isinstance(sec.get('body'), dict):
                continue
            for lang, txt in list(sec['body'].items()):
                if not isinstance(txt, str) or not has_money(txt):
                    continue
                if kind == 'CASE':
                    new = CASE_TEXT['%s|%s' % (slug, sid)].get(lang)
                    if not new:
                        print('⚠️ %s §%s %s：无手写段落，跳过' % (slug, sid, lang)); continue
                    removed = 1
                elif kind == 'STRUCT_FULL':
                    if lang not in spf.STRUCT:
                        print('⚠️ %s §%s %s：无语种结构文案，跳过' % (slug, sid, lang)); continue
                    new, removed = spf.STRUCT[lang], 1
                elif kind == 'STRUCT':
                    if lang not in spf.STRUCT:
                        print('⚠️ %s §%s %s：无语种结构文案，跳过' % (slug, sid, lang)); continue
                    new, removed = spf.strip_text(txt, lang)
                else:
                    new, removed = drop(txt)
                    note = PLAIN.get(lang)
                    if not note:
                        print('⚠️ %s §%s %s：无语种说明句，跳过' % (slug, sid, lang)); continue
                    if note not in new:
                        new = (new + '\n\n' + note).strip()
                if has_money(new):
                    print('⚠️ %s §%s %s：仍有金额残留，跳过' % (slug, sid, lang)); continue
                if kind != 'CASE' and len(new) < len(txt) * 0.55:
                    print('⚠️ %s §%s %s：长度骤降 %d→%d，跳过' % (slug, sid, lang, len(txt), len(new))); continue
                sec['body'][lang] = new
                total += removed
                print('%s §%s %s 删 %d 处 %d→%d' % (slug, sid, lang, removed, len(txt), len(new)))
        if apply_ and '--apply' in sys.argv:
            pass
        if apply_:
            json.dump(data, open(p, 'w'), ensure_ascii=False, indent=2)
            open(p, 'a').write('\n')
    print('共删除 %d 处%s' % (total, '' if apply_ else '（dry-run）'))

if __name__ == '__main__':
    main()
