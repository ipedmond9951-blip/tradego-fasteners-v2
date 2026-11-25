#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide 价格段落去数字化（en / es / fr）。
依据 docs/CONTENT-CONTRACT.md 第 15/24 条：没有可核来源的金额一律换成报价结构说明。
- tractor-fasteners：删掉 6 行按吨计价的价格清单，改为「报价构成」段落
- procurement：删掉 MOQ/阶梯价/FOB 金额句，改为结构性描述，保留尾部产品链接
幂等：没有金额时直接跳过。
"""
import json, re

SLUG = 'agricultural-machinery-fastener-guide'
MONEY = re.compile(r'(USD|\$|€|\bRMB\b|\bMAD\b)')

STRUCT = {
 'en': ("Price for an agricultural fastener is built from a structure, not from a list. A quotation per lot combines the base price for material and forming, the surcharge for surface treatment and coating class, the supply of matching nuts, washers and packaging, freight and export documents, and adjustments for order quantity and payment terms. The three inputs that move the price most are steel, zinc and energy, and they are re-priced per lot. Comparisons hold only at the same specification, the same Incoterm and the same packaging. Give us the size, property class, coating class, quantity, packaging and Incoterm, and we will build a verifiable quotation."),
 'es': ("El precio de una fijación agrícola se construye a partir de una estructura, no de una lista. Una cotización por lote combina el precio base de material y conformado, el recargo por tratamiento superficial y clase de recubrimiento, el suministro de tuercas, arandelas y embalaje, el flete y los documentos de exportación, y los ajustes por cantidad de pedido y condiciones de pago. Los tres insumos que más mueven el precio son acero, zinc y energía, y se recalculan por lote. Las comparaciones solo valen a igual especificación, igual Incoterm e igual embalaje. Indíquenos medida, clase de propiedades, clase de recubrimiento, cantidad, embalaje e Incoterm y preparamos una cotización verificable."),
 'pt': ("O preço de um fixador agrícola é construído a partir de uma estrutura, não de uma lista. Uma cotação por lote combina o preço base de material e conformação, o acréscimo de tratamento superficial e classe de revestimento, o fornecimento de porcas, arruelas e embalagem, o frete e os documentos de exportação, além dos ajustes por quantidade e condição de pagamento. Os três insumos que mais movem o preço são aço, zinco e energia, e são recalculados a cada lote. Comparações só valem com a mesma especificação, o mesmo Incoterm e a mesma embalagem. Informe medida, classe de propriedades, classe de revestimento, quantidade, embalagem e Incoterm e preparamos uma cotação verificável."),
 'hi': ("कृषि फास्टनर की कीमत सूची से नहीं, संरचना से बनती है। प्रति लॉट कोटेशन में सामग्री और फोर्जिंग का आधार मूल्य, सतह उपचार और कोटिंग श्रेणी का अधिभार, मैचिंग नट, वॉशर और पैकेजिंग की आपूर्ति, फ्रेट और निर्यात दस्तावेज़, तथा ऑर्डर मात्रा और भुगतान शर्तों के समायोजन शामिल होते हैं। कीमत को सबसे अधिक प्रभावित करने वाले तीन इनपुट स्टील, ज़िंक और ऊर्जा हैं, और इन्हें प्रत्येक लॉट पर नए सिरे से आँका जाता है। तुलना केवल समान स्पेसिफिकेशन, समान Incoterm और समान पैकेजिंग पर मान्य होती है। आकार, प्रॉपर्टी क्लास, कोटिंग श्रेणी, मात्रा, पैकेजिंग और Incoterm बताइए, हम सत्यापन-योग्य कोटेशन बना देंगे।"),
 'fr': ("Le prix d'une fixation agricole se construit à partir d'une structure, pas d'une liste. Un devis par lot combine le prix de base de la matière et du formage, la surprime de traitement de surface et de classe de revêtement, la fourniture des écrous, rondelles et emballage, le fret et les documents d'exportation, ainsi que les ajustements liés à la quantité commandée et aux conditions de paiement. Les trois intrants qui font le plus varier le prix sont l'acier, le zinc et l'énergie, et ils sont réévalués à chaque lot. Les comparaisons ne tiennent qu'à spécification, Incoterm et emballage identiques. Indiquez-nous dimension, classe de propriétés, classe de revêtement, quantité, emballage et Incoterm, et nous établirons un devis vérifiable."),
}

STRUCT2 = {
 'en': "Minimum order quantities follow tooling occupancy and lot size per dimension and are agreed per order with the supplier. Price steps follow lot size and process cost rather than a fixed table, and an FOB price per lot is recalculated from current steel, zinc and energy prices.",
 'es': "Las cantidades mínimas siguen la ocupación de utillaje y el tamaño de lote por medida y se acuerdan por pedido con el proveedor. Los escalones de precio siguen el tamaño de lote y el coste de proceso, no una tabla fija, y el precio FOB por lote se recalcula con los precios corrientes de acero, zinc y energía.",
 'pt': "Quantidades mínimas seguem a ocupação de ferramental e o tamanho de lote por medida e são acordadas por pedido com o fornecedor. Os degraus de preço seguem o tamanho de lote e o custo de processo, não uma tabela fixa, e o preço FOB por lote é recalculado com os preços correntes de aço, zinco e energia.",
 'hi': "न्यूनतम मात्रा प्रति माप फोर्जिंग/टूलिंग की उपलब्धता और लॉट आकार पर निर्भर करती है और आपूर्तिकर्ता के साथ प्रति ऑर्डर तय होती है। मूल्य चरण लॉट आकार और प्रोसेस लागत का अनुसरण करते हैं, किसी स्थिर तालिका का नहीं, और प्रति लॉट FOB मूल्य मौजूदा स्टील, ज़िंक और ऊर्जा दरों से पुनर्गणित किया जाता है।",
 'fr': "Les quantités minimales dépendent de l'occupation des outillages et de la taille de lot par dimension et sont convenues par commande avec le fournisseur. Les paliers de prix suivent la taille de lot et le coût de process, non une table figée, et le prix FOB par lot est recalculé à partir des prix courants de l'acier, du zinc et de l'énergie.",
}


def fix_tractor(text, lang):
    lines = text.split('\n')
    money_bullets = [i for i, l in enumerate(lines) if l.strip().startswith('-') and MONEY.search(l)]
    if not money_bullets:
        return text, 0
    first = money_bullets[0]
    intro_idx = first - 1 if first > 0 else None
    keep = [l for i, l in enumerate(lines) if i not in money_bullets]
    # 用结构段替换「价格清单引导句」，位置按删除后的列表重算
    removed_before = len([i for i in money_bullets if i < (intro_idx if intro_idx is not None else first)])
    new_idx = (intro_idx - removed_before) if intro_idx is not None else (first - removed_before)
    if intro_idx is not None:
        keep[new_idx] = STRUCT[lang]
    else:
        keep.insert(new_idx, STRUCT[lang])
    return '\n'.join(keep), len(money_bullets)


def fix_procurement(text, lang):
    if not MONEY.search(text):
        return text, 0
    sents = re.split(r'(?<=\.)\s', text)
    out = []
    inserted = False
    for sent in sents:
        if MONEY.search(sent):
            if not inserted:
                out.append(STRUCT2[lang])
                inserted = True
            continue
        out.append(sent)
    if not inserted:
        out.insert(0, STRUCT2[lang])
    return ' '.join(out), 1


def main():
    path = 'content/articles/%s.json' % SLUG
    a = json.load(open(path))
    total = 0
    for s in a['sections']:
        sid = s.get('id')
        for lang in ('en', 'es', 'fr', 'pt', 'hi'):
            v = s.get('body', {}).get(lang) if 'body' in s else None
            if not isinstance(v, str) or not MONEY.search(v):
                continue
            if sid == 'tractor-fasteners':
                new, n = fix_tractor(v, lang)
            elif sid == 'procurement':
                new, n = fix_procurement(v, lang)
            else:
                continue
            if n:
                assert '<p><p>' not in new
                s['body'][lang] = new
                total += n
                print('去数字化', sid, lang, n)
    if total:
        open(path, 'w').write(json.dumps(a, ensure_ascii=False, indent=2) + '\n')
    print('共 %d 处' % total)


if __name__ == '__main__':
    main()
