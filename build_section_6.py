#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build section 6 (FAQ) and assemble full article."""
import json
from pathlib import Path

def t(en, zh, es, ar, fr, pt, ru, ja, de, hi):
    return {
        'en': en, 'zh': zh, 'es': es, 'ar': ar, 'fr': fr,
        'pt': pt, 'ru': ru, 'ja': ja, 'de': de, 'hi': hi
    }


# Section 6: FAQ
s6_heading = t(
    "Frequently Asked Questions: Railway Track Fastener Specifications",
    "常见问题解答：铁路轨道紧固件规格",
    "Preguntas Frecuentes: Especificaciones de Sujetadores de Vía Férrea",
    "الأسئلة الشائعة: مواصفات مثبتات مسارات السكك الحديدية",
    "Questions Fréquemment Posées : Spécifications des Attaches Ferroviaires",
    "Perguntas Frequentes: Especificações de Fixadores de Trilhos Ferroviários",
    "Часто задаваемые вопросы: Спецификации крепежа железнодорожных путей",
    "よくある質問：鉄道軌道締結装置仕様",
    "Häufig gestellte Fragen: Eisenbahnschienen-Befestigungsspezifikationen",
    "अक्सर पूछे जाने वाले प्रश्न: रेलवे ट्रैक फास्टनर विशिष्टताएं"
)

s6_body_en = (
    "The following frequently asked questions cover the most common technical, commercial, and procurement questions received from railway fastener buyers, project engineers, and traders sourcing from China, India, and Türkiye for African, Middle Eastern, and Latin American tenders. For project-specific questions or technical clarifications, contact a TradeGo senior engineer for a same-day response."
)

s6_body_zh = (
    "以下常见问题解答涵盖了从中国、印度和土耳其采购的铁路紧固件买家、项目工程师和贸易商在非洲、中东和拉丁美洲招标中最常见的技术、商业和采购问题。针对项目特定问题或技术澄清，请联系 TradeGo 高级工程师获得当日回复。"
)

s6_body_es = (
    "Las siguientes preguntas frecuentes cubren las preguntas técnicas, comerciales y de adquisición más comunes recibidas de compradores de sujetadores ferroviarios, ingenieros de proyectos y comerciantes que se abastecen desde China, India y Turquía para licitaciones africanas, de Oriente Medio y latinoamericanas. Para preguntas específicas del proyecto o aclaraciones técnicas, contacte a un ingeniero senior de TradeGo para una respuesta el mismo día."
)

s6_body_ar = (
    "تغطي الأسئلة الشائعة التالية الأسئلة الفنية والتجارية والمشتريات الأكثر شيوعًا التي يتلقاها مشترو المثبتات السككية ومهندسو المشاريع والتجار الذين يحصلون على الإمدادات من الصين والهند وتركيا للمناقصات الأفريقية والشرق أوسطية وأمريكا اللاتينية. للحصول على أسئلة خاصة بالمشروع أو توضيحات فنية، اتصل بمهندس كبير في TradeGo للحصول على رد في نفس اليوم."
)

s6_body_fr = (
    "Les questions fréquemment posées suivantes couvrent les questions techniques, commerciales et d'approvisionnement les plus courantes reçues des acheteurs d'attaches ferroviaires, des ingénieurs de projet et des commerçants s'approvisionnant en Chine, en Inde et en Turquie pour les appels d'offres africains, du Moyen-Orient et latino-américains. Pour des questions spécifiques au projet ou des clarifications techniques, contactez un ingénieur senior TradeGo pour une réponse le jour même."
)

s6_body_pt = (
    "As seguintes perguntas frequentes cobrem as perguntas técnicas, comerciais e de aquisição mais comuns recebidas de compradores de fixadores ferroviários, engenheiros de projeto e comerciantes que se abastecem na China, Índia e Turquia para licitações africanas, do Oriente Médio e latino-americanas. Para perguntas específicas do projeto ou esclarecimentos técnicos, entre em contato com um engenheiro sênior da TradeGo para uma resposta no mesmo dia."
)

s6_body_ru = (
    "Следующие часто задаваемые вопросы охватывают наиболее распространенные технические, коммерческие и закупочные вопросы, получаемые от покупателей железнодорожных крепежей, проектных инженеров и трейдеров, закупающих продукцию в Китае, Индии и Турции для африканских, ближневосточных и латиноамериканских тендеров. По конкретным вопросам проекта или техническим разъяснениям обращайтесь к старшему инженеру TradeGo для ответа в тот же день."
)

s6_body_ja = (
    "以下のよくある質問は、中国、インド、トルコからアフリカ、中東、ラテンアメリカの入札向けに調達している鉄道締結具のバイヤー、プロジェクトエンジニア、トレーダーから受け取る最も一般的な技術的、商業的、調達に関する質問をカバーしています。プロジェクト固有の質問または技術的な明確化については、TradeGo のシニアエンジニアに連絡して、当日中の回答を得てください。"
)

s6_body_de = (
    "Die folgenden häufig gestellten Fragen decken die häufigsten technischen, kommerziellen und beschaffungstechnischen Fragen ab, die von Käufern von Eisenbahnbefestigungen, Projektingenieuren und Händlern erhalten werden, die aus China, Indien und der Türkei für afrikanische, nahöstliche und lateinamerikanische Ausschreibungen beschaffen. Für projektspezifische Fragen oder technische Klärungen wenden Sie sich an einen Senior-Ingenieur von TradeGo für eine Antwort am selben Tag."
)

s6_body_hi = (
    "निम्नलिखित अक्सर पूछे जाने वाले प्रश्न अफ्रीकी, मध्य पूर्व और लैटिन अमेरिकी निविदाओं के लिए चीन, भारत और तुर्की से सोर्सिंग करने वाले रेलवे फास्टनर खरीदारों, प्रोजेक्ट इंजीनियरों और व्यापारियों से प्राप्त सबसे सामान्य तकनीकी, वाणिज्यिक और खरीद प्रश्नों को कवर करते हैं। परियोजना-विशिष्ट प्रश्नों या तकनीकी स्पष्टीकरण के लिए, उसी दिन की प्रतिक्रिया के लिए TradeGo के सीनियर इंजीनियर से संपर्क करें।"
)

s6_body = t(s6_body_en, s6_body_zh, s6_body_es, s6_body_ar, s6_body_fr, s6_body_pt, s6_body_ru, s6_body_ja, s6_body_de, s6_body_hi)


# FAQ items (5 questions)
faq_items = []

# FAQ 1
faq_items.append({
    'q': t(
        "What is the difference between Pandrol e-clip and Vossloh Skl clip systems?",
        "Pandrol e-clip 和 Vossloh Skl 扣件系统有什么区别？",
        "¿Cuál es la diferencia entre los sistemas Pandrol e-clip y Vossloh Skl?",
        "ما الفرق بين أنظمة Pandrol e-clip وVossloh Skl؟",
        "Quelle est la différence entre les systèmes Pandrol e-clip et Vossloh Skl ?",
        "Qual é a diferença entre os sistemas Pandrol e-clip e Vossloh Skl?",
        "В чем разница между системами Pandrol e-clip и Vossloh Skl?",
        "Pandrol e-clip システムと Vossloh Skl クリップシステムの違いは何ですか？",
        "Was ist der Unterschied zwischen Pandrol e-clip- und Vossloh Skl-Clip-Systemen?",
        "Pandrol e-clip और Vossloh Skl क्लिप सिस्टम में क्या अंतर है?"
    ),
    'a': t(
        "Pandrol e-clip and Vossloh Skl are both elastic rail clips, but they use different anchorage and installation methods. Pandrol e-clip requires a cast shoulder embedded in the concrete sleeper, while the Vossloh Skl uses a screw spike anchored in epoxy mortar or a plastic dowel. The Pandrol system has a larger global installed base (80+ countries), while Vossloh dominates European high-speed applications. Both deliver 8-11 kN toe load and are functionally interchangeable on most tenders when properly tested to EN 13146.",
        "Pandrol e-clip 和 Vossloh Skl 都是弹性轨道扣件，但它们使用不同的锚固和安装方法。Pandrol e-clip 需要嵌入混凝土轨枕中的铸造肩部，而 Vossloh Skl 使用锚固在环氧砂浆或塑料套筒中的螺纹道钉。Pandrol 系统在全球拥有更大的装机量（80 多个国家），而 Vossloh 在欧洲高速应用中占主导地位。两者在正确按 EN 13146 测试后，在大多数招标中功能上可互换，并提供 8-11 kN 的扣压力。",
        "Pandrol e-clip y Vossloh Skl son ambos clips elásticos de riel, pero utilizan diferentes métodos de anclaje e instalación. El Pandrol e-clip requiere un hombro fundido incrustado en la traviesa de hormigón, mientras que el Vossloh Skl usa un tirafondo anclado en mortero epoxi o un taco de plástico. El sistema Pandrol tiene una base instalada global mayor (80+ países), mientras que Vossloh domina las aplicaciones europeas de alta velocidad. Ambos entregan 8-11 kN de carga de punta y son funcionalmente intercambiables en la mayoría de las licitaciones cuando se prueban correctamente según EN 13146.",
        "Pandrol e-clip وVossloh Skl كلاهما مشبكات سكة مرنة، لكنهما يستخدمان طرق تثبيت وتركيب مختلفة. يتطلب Pandrol e-clip كتفًا مصبوبًا مضمنًا في النائمة الخرسانية، بينما يستخدم Vossloh Skl مسمارًا لولبيًا مثبتًا في ملاط إيبوكسي أو وتد بلاستيكي. يتمتع نظام Pandrol بقاعدة مثبتة عالمية أكبر (80+ دولة)، بينما يهيمن Vossloh على تطبيقات السرعة العالية الأوروبية. يقدم كلاهما 8-11 kN من حمل النقطة وقابلين للتبادل وظيفيًا في معظم المناقصات عند اختبارهما بشكل صحيح وفقًا لـ EN 13146.",
        "Pandrol e-clip et Vossloh Skl sont tous deux des clips élastiques de rail, mais ils utilisent différentes méthodes d'ancrage et d'installation. Le Pandrol e-clip nécessite une épaule moulée encastrée dans la traverse en béton, tandis que le Vossloh Skl utilise un tirefond ancré dans du mortier époxy ou une cheville plastique. Le système Pandrol a une base installée mondiale plus grande (80+ pays), tandis que Vossloh domine les applications européennes à grande vitesse. Les deux fournissent 8-11 kN de charge de pointe et sont fonctionnellement interchangeables sur la plupart des appels d'offres lorsqu'ils sont correctement testés selon EN 13146.",
        "Pandrol e-clip e Vossloh Skl são ambos clipes elásticos de trilho, mas usam diferentes métodos de ancoragem e instalação. O Pandrol e-clip requer um ombro fundido embutido no dormente de concreto, enquanto o Vossloh Skl usa um parafuso ancorado em argamassa epóxi ou bucha plástica. O sistema Pandrol tem uma base instalada global maior (80+ países), enquanto a Vossloh domina as aplicações europeias de alta velocidade. Ambos entregam 8-11 kN de carga de ponta e são funcionalmente intercambiáveis na maioria das licitações quando testados adequadamente conforme EN 13146.",
        "Pandrol e-clip и Vossloh Skl являются упругими рельсовыми зажимами, но используют различные методы анкеровки и установки. Pandrol e-clip требует литого бурта, встроенного в бетонную шпалу, тогда как Vossloh Skl использует шуруп-костыль, закрепленный в эпоксидном растворе или пластиковом дюбеле. Система Pandrol имеет более широкую мировую установленную базу (80+ стран), тогда как Vossloh доминирует в европейских высокоскоростных применениях. Оба обеспечивают нагрузку на носке 8-11 кН и функционально взаимозаменяемы на большинстве тендеров при правильных испытаниях по EN 13146.",
        "Pandrol e-clip と Vossloh Skl はどちらも弾性レールクリップですが、固定方法と設置方法が異なります。Pandrol e-clip はコンクリート枕木に埋め込まれた鋳造ショルダーが必要ですが、Vossloh Skl はエポキシモルタルまたはプラスチックダウエルに固定されたネジスパイクを使用します。Pandrol システムはより大きな世界的設置ベース（80 か国以上）を持ち、Vossloh は欧州の高速用途を支配しています。両方とも 8-11 kN の爪先荷重を提供し、EN 13146 に基づいて適切にテストされた場合、ほとんどの入札で機能的に交換可能です。",
        "Pandrol e-clip und Vossloh Skl sind beide elastische Schienenclips, verwenden jedoch unterschiedliche Verankerungs- und Installationsmethoden. Der Pandrol e-clip erfordert eine in die Betonschwelle eingegossene Schulter, während der Vossloh Skl eine Schraubenspitze verwendet, die in Epoxidmörtel oder einem Kunststoffdübel verankert ist. Das Pandrol-System hat eine größere globale installierte Basis (80+ Länder), während Vossloh europäische Hochgeschwindigkeitsanwendungen dominiert. Beide liefern 8-11 kN Spitzenlast und sind bei den meisten Ausschreibungen funktional austauschbar, wenn sie ordnungsgemäß nach EN 13146 geprüft werden.",
        "Pandrol e-clip और Vossloh Skl दोनों लोचदार रेल क्लिप हैं, लेकिन वे अलग-अलग एंकरिंग और स्थापना विधियों का उपयोग करते हैं। Pandrol e-clip को कंक्रीट स्लीपर में डाले गए कास्ट शोल्डर की आवश्यकता होती है, जबकि Vossloh Skl एपॉक्सी मोर्टार या प्लास्टिक डोवेल में एंकर किए गए स्क्रू स्पाइक का उपयोग करता है। Pandrol सिस्टम का वैश्विक स्तर पर बड़ा स्थापित आधार (80+ देश) है, जबकि Vossloh यूरोपीय हाई-स्पीड अनुप्रयोगों पर हावी है। दोनों 8-11 kN पैर की उंगली भार प्रदान करते हैं और EN 13146 के अनुसार ठीक से परीक्षण किए जाने पर अधिकांश निविदाओं पर कार्यात्मक रूप से विनिमेय हैं।"
    )
})

# FAQ 2
faq_items.append({
    'q': t(
        "What toe load should I specify for heavy-haul railway elastic clips?",
        "重载铁路弹性扣件应规定多少扣压力？",
        "¿Qué carga de punta debo especificar para clips elásticos de ferrocarril de carga pesada?",
        "ما حمل النقطة الذي يجب أن أحدده لمشبكات السكك الحديدية للخدمة الشاقة؟",
        "Quelle charge de pointe dois-je spécifier pour les clips élastiques ferroviaires à fort tonnage ?",
        "Qual carga de ponta devo especificar para clipes elásticos ferroviários de carga pesada?",
        "Какую нагрузку на носке следует указывать для упругих зажимов для тяжеловесных железных дорог?",
        "重荷重鉄道用弾性クリップにはどの爪先荷重を指定すべきですか？",
        "Welche Spitzenlast sollte ich für elastische Clips für Schwerlast-Eisenbahnen spezifizieren?",
        "भारी-भार रेलवे लोचदार क्लिप के लिए मुझे कौन सी पैर की उंगली भार निर्दिष्ट करनी चाहिए?"
    ),
    'a': t(
        "For heavy-haul freight (axle loads 30-40 tonnes), specify a minimum toe load of 11-14 kN per clip. Standard Pandrol e-2055 and Vossloh Skl 14 deliver 8.8-10.5 kN and are suitable for mixed-traffic up to 25-tonne axle load. For 32.5-tonne axle-load mining railways (Pilbara, Richards Bay, Carajás), specify the Pandrol e-2009, Vossloh Skl 21, or Pandrol HD variants with toe load 11-14 kN. Always reference EN 13146-7 for the longitudinal restraint test procedure.",
        "对于重载货运（轴重 30-40 吨），请规定单扣件最小扣压力 11-14 kN。标准 Pandrol e-2055 和 Vossloh Skl 14 提供 8.8-10.5 kN，适用于最大 25 吨轴重的混合交通。对于 32.5 吨轴重的矿山铁路（Pilbara、Richards Bay、Carajás），请规定 Pandrol e-2009、Vossloh Skl 21 或扣压力为 11-14 kN 的 Pandrol HD 变体。始终参考 EN 13146-7 的纵向约束测试程序。",
        "Para carga pesada (carga por eje 30-40 toneladas), especifique una carga de punta mínima de 11-14 kN por clip. El Pandrol e-2055 y Vossloh Skl 14 estándar entregan 8.8-10.5 kN y son adecuados para tráfico mixto hasta 25 toneladas de carga por eje. Para ferrocarriles mineros de 32,5 toneladas por eje (Pilbara, Richards Bay, Carajás), especifique el Pandrol e-2009, Vossloh Skl 21 o variantes Pandrol HD con carga de punta 11-14 kN. Siempre haga referencia a EN 13146-7 para el procedimiento de prueba de restricción longitudinal.",
        "للشحن الثقيل (أحمال المحاور 30-40 طنًا)، حدد حمل نقطة أدنى يبلغ 11-14 kN لكل مشبك. يقدم Pandrol e-2055 وVossloh Skl 14 القياسي 8.8-10.5 kN وهما مناسبتان لحركة المرور المختلطة حتى حمولة محور 25 طنًا. لخطوط السكك الحديدية للتعدين بحمولة محور 32.5 طنًا (بيلبارا، خليج ريتشاردز، كاراجاس)، حدد متغيرات Pandrol e-2009 أو Vossloh Skl 21 أو Pandrol HD بحمل نقطة 11-14 kN.",
        "Pour le fret lourd (charges par essieu 30-40 tonnes), spécifiez une charge de pointe minimale de 11-14 kN par clip. Les Pandrol e-2055 et Vossloh Skl 14 standard fournissent 8,8-10,5 kN et conviennent au trafic mixte jusqu'à 25 tonnes de charge par essieu. Pour les chemins de fer miniers de 32,5 tonnes par essieu (Pilbara, Richards Bay, Carajás), spécifiez les variantes Pandrol e-2009, Vossloh Skl 21 ou Pandrol HD avec une charge de pointe de 11-14 kN.",
        "Para carga pesada (carga por eixo 30-40 toneladas), especifique uma carga de ponta mínima de 11-14 kN por clipe. O Pandrol e-2055 e Vossloh Skl 14 padrão entregam 8,8-10,5 kN e são adequados para tráfego misto até 25 toneladas de carga por eixo. Para ferrovias de mineração de 32,5 toneladas por eixo (Pilbara, Richards Bay, Carajás), especifique as variantes Pandrol e-2009, Vossloh Skl 21 ou Pandrol HD com carga de ponta 11-14 kN.",
        "Для тяжеловесных грузов (нагрузка на ось 30-40 тонн) укажите минимальную нагрузку на носке 11-14 кН на зажим. Стандартные Pandrol e-2055 и Vossloh Skl 14 обеспечивают 8,8-10,5 кН и подходят для смешанного движения с нагрузкой на ось до 25 тонн. Для горнодобывающих железных дорог с нагрузкой на ось 32,5 тонны (Пилбара, Ричардс-Бей, Каражас) укажите варианты Pandrol e-2009, Vossloh Skl 21 или Pandrol HD с нагрузкой на носке 11-14 кН.",
        "重荷重貨物（軸重 30〜40 トン）の場合は、クリップあたり最小 11〜14 kN の爪先荷重を指定してください。標準の Pandrol e-2055 および Vossloh Skl 14 は 8.8-10.5 kN を提供し、25 トン軸重までの混合交通に適しています。32.5 トン軸重の鉱山鉄道（Pilbara、Richards Bay、Carajás）の場合は、Pandrol e-2009、Vossloh Skl 21、または爪先荷重 11-14 kN の Pandrol HD バリアントを指定してください。",
        "Für Schwerlast-Güterverkehr (Achslasten 30-40 Tonnen) geben Sie eine Mindestspitzenlast von 11-14 kN pro Clip an. Standard-Pandrol e-2055 und Vossloh Skl 14 liefern 8,8-10,5 kN und sind für Mischverkehr bis 25 Tonnen Achslast geeignet. Für 32,5-Tonnen-Achslast-Bergbahnen (Pilbara, Richards Bay, Carajás) geben Sie die Pandrol e-2009, Vossloh Skl 21 oder Pandrol HD-Varianten mit 11-14 kN Spitzenlast an.",
        "भारी-भार माल (एक्सल लोड 30-40 टन) के लिए, प्रति क्लिप न्यूनतम 11-14 kN पैर की उंगली भार निर्दिष्ट करें। मानक Pandrol e-2055 और Vossloh Skl 14 8.8-10.5 kN प्रदान करते हैं और 25 टन एक्सल लोड तक मिश्रित ट्रैफिक के लिए उपयुक्त हैं। 32.5-टन एक्सल लोड खनन रेलवे (Pilbara, Richards Bay, Carajás) के लिए, 11-14 kN पैर की उंगली भार के साथ Pandrol e-2009, Vossloh Skl 21, या Pandrol HD वेरिएंट निर्दिष्ट करें।"
    )
})

# FAQ 3
faq_items.append({
    'q': t(
        "Are Pandrol or Vossloh third-party equivalents from China acceptable for African tenders?",
        "来自中国的 Pandrol 或 Vossloh 第三方等效产品对非洲招标是否可接受？",
        "¿Son aceptables los equivalentes de terceros de Pandrol o Vossloh de China para licitaciones africanas?",
        "هل مقاطع Pandrol أو Vossloh المكافئة من طرف ثالث من الصين مقبولة للمناقصات الأفريقية؟",
        "Les équivalents tiers Pandrol ou Vossloh de Chine sont-ils acceptables pour les appels d'offres africains ?",
        "Equivalentes de terceiros de Pandrol ou Vossloh da China são aceitáveis para licitações africanas?",
        "Допустимы ли сторонние эквиваленты Pandrol или Vossloh из Китая для африканских тендеров?",
        "中国からの Pandrol または Vossloh 第三者相当品はアフリカの入札で受け入れ可能ですか？",
        "Sind Pandrol- oder Vossloh-Drittanbieter-Äquivalente aus China für afrikanische Ausschreibungen akzeptabel?",
        "क्या चीन से Pandrol या Vossloh तीसरे पक्ष के समकक्ष अफ्रीकी निविदाओं के लिए स्वीकार्य हैं?"
    ),
    'a': t(
        "Yes, in most African railway tenders, third-party Pandrol or Vossloh equivalents from China, India, and Türkiye are accepted provided they pass third-party testing per EN 13146 series. The most common acceptance criteria are: (1) toe load within ±10% of nominal at 12-13 mm deflection, (2) fatigue life exceeding 3-5 million cycles, (3) salt-spray resistance over 1,000 hours per ASTM B117, (4) electrical resistance over 5 kΩ with nylon insulator, and (5) full material traceability with EN 10204 3.1 certificates. Pre-shipment inspection by SGS, Bureau Veritas, or Intertek is typically required. Major African rail authorities (PRASA, Transnet, Kenyan Railways, Ethiopian Railways, Tanzanian Railways) have issued specifications accepting equivalent clips provided they meet the test criteria. TradeGo maintains a database of country-specific acceptance requirements for 28 African nations.",
        "是的，在大多数非洲铁路招标中，只要通过 EN 13146 系列的第三方测试，来自中国、印度和土耳其的第三方 Pandrol 或 Vossloh 等效产品即可被接受。最常见的验收标准是：(1) 12-13 mm 挠度时扣压力在标称值的 ±10% 范围内；(2) 疲劳寿命超过 300-500 万次循环；(3) 按 ASTM B117 盐雾耐腐蚀性超过 1,000 小时；(4) 与尼龙绝缘体一起使用时的电阻超过 5 kΩ；(5) 完整的材料可追溯性和 EN 10204 3.1 证书。通常需要 SGS、Bureau Veritas 或 Intertek 的装运前检验。非洲主要铁路当局（PRASA、Transnet、肯尼亚铁路、埃塞俄比亚铁路、坦桑尼亚铁路）已发布规格，接受符合测试标准的等效扣件。TradeGo 维护了一个 28 个非洲国家的特定国家验收要求数据库。",
        "Sí, en la mayoría de las licitaciones ferroviarias africanas, los equivalentes de terceros de Pandrol o Vossloh de China, India y Turquía son aceptados siempre que pasen las pruebas de terceros según la serie EN 13146. Los criterios de aceptación más comunes son: (1) carga de punta dentro de ±10% del nominal a 12-13 mm de deflexión, (2) vida de fatiga superior a 3-5 millones de ciclos, (3) resistencia a niebla salina superior a 1,000 horas según ASTM B117, (4) resistencia eléctrica superior a 5 kΩ con aislante de nailon, y (5) trazabilidad total del material con certificados EN 10204 3.1. Las principales autoridades ferroviarias africanas (PRASA, Transnet, Kenyan Railways, Ethiopian Railways, Tanzanian Railways) han emitido especificaciones que aceptan clips equivalentes siempre que cumplan los criterios de prueba.",
        "نعم، في معظم مناقصات السكك الحديدية الأفريقية، يتم قبول مكافئات Pandrol أو Vossloh من طرف ثالث من الصين والهند وتركيا بشرط أن تجتاز الاختبارات من طرف ثالث وفقًا لسلسلة EN 13146. معايير القبول الأكثر شيوعًا هي: (1) حمل نقطة في حدود ±10% من الاسمي عند انحراف 12-13 mm، (2) عمر تعب يتجاوز 3-5 مليون دورة، (3) مقاومة رذاذ الملح أكثر من 1,000 ساعة وفقًا لـ ASTM B117، (4) مقاومة كهربائية أكثر من 5 kΩ مع عازل نايلون، و (5) تتبع كامل للمواد مع شهادات EN 10204 3.1.",
        "Oui, dans la plupart des appels d'offres ferroviaires africains, les équivalents tiers Pandrol ou Vossloh de Chine, d'Inde et de Turquie sont acceptés à condition qu'ils passent les tests tiers selon la série EN 13146. Les critères d'acceptation les plus courants sont : (1) charge de pointe dans les ±10% du nominal à 12-13 mm de déflexion, (2) durée de vie en fatigue dépassant 3-5 millions de cycles, (3) résistance au brouillard salin supérieure à 1 000 heures selon ASTM B117, (4) résistance électrique supérieure à 5 kΩ avec isolant en nylon, et (5) traçabilité complète des matériaux avec certificats EN 10204 3.1.",
        "Sim, na maioria das licitações ferroviárias africanas, equivalentes Pandrol ou Vossloh de terceiros da China, Índia e Turquia são aceitos desde que passem nos testes de terceiros conforme a série EN 13146. Os critérios de aceitação mais comuns são: (1) carga de ponta dentro de ±10% do nominal a 12-13 mm de deflexão, (2) vida de fadiga excedendo 3-5 milhões de ciclos, (3) resistência à névoa salina superior a 1.000 horas conforme ASTM B117, (4) resistência elétrica superior a 5 kΩ com isolante de nylon, e (5) rastreabilidade total do material com certificados EN 10204 3.1.",
        "Да, в большинстве африканских железнодорожных тендеров сторонние эквиваленты Pandrol или Vossloh из Китая, Индии и Турции принимаются при условии прохождения сторонних испытаний по серии EN 13146. Наиболее распространенные критерии приемки: (1) нагрузка на носке в пределах ±10% от номинала при прогибе 12-13 мм, (2) усталостная долговечность более 3-5 миллионов циклов, (3) стойкость к солевому туману более 1 000 часов по ASTM B117, (4) электрическое сопротивление более 5 кОм с нейлоновым изолятором и (5) полная прослеживаемость материалов с сертификатами EN 10204 3.1.",
        "はい、ほとんどのアフリカの鉄道入札では、EN 13146 シリーズに基づく第三者試験に合格することを条件に、中国、インド、トルコからの第三者 Pandrol または Vossloh 相当品が受け入れられます。一般的な受け入れ基準は次のとおりです：(1) 12-13 mm 撓み時の公称値の ±10% 以内の爪先荷重、(2) 300〜500 万サイクルを超える疲労寿命、(3) ASTM B117 に基づく 1,000 時間を超える塩水噴霧耐性、(4) ナイロンインシュレーター付きで 5 kΩ を超える電気抵抗、(5) EN 10204 3.1 証明書による完全な材料トレーサビリティ。主要なアフリカの鉄道当局（PRASA、Transnet、Kenyan Railways、Ethiopian Railways、Tanzanian Railways）は、試験基準を満たす同等クリップを受け入れる仕様を発行しています。",
        "Ja, bei den meisten afrikanischen Eisenbahnausschreibungen werden Pandrol- oder Vossloh-Äquivalente von Drittanbietern aus China, Indien und der Türkei akzeptiert, vorausgesetzt, sie bestehen die Drittrüferprüfung nach EN 13146-Serie. Die häufigsten Akzeptanzkriterien sind: (1) Spitzenlast innerhalb von ±10% des Nennwerts bei 12-13 mm Durchbiegung, (2) Ermüdungslebensdauer über 3-5 Millionen Zyklen, (3) Salzsprühbeständigkeit über 1.000 Stunden nach ASTM B117, (4) elektrischer Widerstand über 5 kΩ mit Nylon-Isolator und (5) vollständige Materialrückverfolgbarkeit mit EN 10204 3.1-Zertifikaten.",
        "हाँ, अधिकांश अफ्रीकी रेलवे निविदाओं में, EN 13146 श्रृंखला के अनुसार तीसरे पक्ष के परीक्षण को पास करने की शर्त पर, चीन, भारत और तुर्की से तीसरे पक्ष के Pandrol या Vossloh समकक्ष स्वीकार किए जाते हैं। सबसे सामान्य स्वीकृति मानदंड हैं: (1) 12-13 mm विक्षेपण पर नाममात्र के ±10% के भीतर पैर की उंगली भार, (2) 3-5 मिलियन चक्र से अधिक थकान जीवन, (3) ASTM B117 के अनुसार 1,000 घंटे से अधिक नमक-स्प्रे प्रतिरोध, (4) नायलॉन इन्सुलेटर के साथ 5 kΩ से अधिक विद्युत प्रतिरोध, और (5) EN 10204 3.1 प्रमाणपत्र के साथ पूर्ण सामग्री पता लगाने की क्षमता।"
    )
})

# FAQ 4
faq_items.append({
    'q': t(
        "What are the standard rail sections and corresponding fish plate sizes?",
        "标准钢轨截面和相应的鱼尾板尺寸是多少？",
        "¿Cuáles son las secciones de riel estándar y los tamaños de placas de empalme correspondientes?",
        "ما هي مقاطع السكك القياسية وأحجام صفائح السمك المقابلة؟",
        "Quelles sont les sections de rail standard et les tailles d'éclisses correspondantes ?",
        "Quais são as seções de trilho padrão e os tamanhos de talas de junção correspondentes?",
        "Каковы стандартные сечения рельсов и соответствующие размеры стыковых накладок?",
        "標準的なレール断面と対応する継目板のサイズは何ですか？",
        "Was sind die Standardschienenabschnitte und entsprechenden Laschengrößen?",
        "मानक रेल सेक्शन और संगत फिश प्लेट आकार क्या हैं?"
    ),
    'a': t(
        "The five most common rail sections globally are UIC 54 (54 kg/m, light rail and secondary lines), UIC 60 (60 kg/m, the dominant European and Asian high-speed and heavy-haul standard), AREMA 115RE (115 lb/yd, North American freight mainline), AREMA 136RE (136 lb/yd, North American heavy-haul and high-tonnage corridors), and BS 113A (113 lb/yd, British legacy and former colonies). For fish plates, the standard 4-hole pattern is 24 inches (610 mm) long for rail up to 115RE, 28 inches for UIC 60, and 36 inches (914 mm) for heavy rail 132RE-141RE. Bolt holes are 1-1/16 inch (27 mm) diameter for 1 inch bolts or 1-1/8 inch (29 mm) for 1-1/8 inch bolts, spaced 5-1/2 inches to 6 inches (140-152 mm) center-to-center. Track bolt Grade 5 (SAE J429) or Grade 8.8 (EN ISO 898-1) is the standard, with heavy hex nuts per ASTM A563 Grade DH or EN 14399-4.",
        "全球五种最常见的钢轨截面是 UIC 54（54 kg/m，轻轨和次要线路）、UIC 60（60 kg/m，欧洲和亚洲高速和重载铁路的主导标准）、AREMA 115RE（115 lb/yd，北美货运干线）、AREMA 136RE（136 lb/yd，北美重载和高吨位走廊）和 BS 113A（113 lb/yd，英国传统和前殖民地）。对于鱼尾板，标准 4 孔图案：115RE 以下钢轨为 24 英寸（610 mm）长，UIC 60 为 28 英寸，重型钢轨 132RE-141RE 为 36 英寸（914 mm）。螺栓孔直径为 1-1/16 英寸（27 mm）用于 1 英寸螺栓或 1-1/8 英寸（29 mm）用于 1-1/8 英寸螺栓，间距 5-1/2 至 6 英寸（140-152 mm）中心到中心。轨道螺栓标准为 5 级（SAE J429）或 8.8 级（EN ISO 898-1），配以 ASTM A563 DH 级或 EN 14399-4 重型六角螺母。",
        "Las cinco secciones de riel más comunes a nivel mundial son UIC 54 (54 kg/m), UIC 60 (60 kg/m, el estándar europeo y asiático dominante), AREMA 115RE (115 lb/yd, línea principal de carga norteamericana), AREMA 136RE (136 lb/yd, carga pesada norteamericana) y BS 113A (113 lb/yd, legado británico). Para placas de empalme, el patrón estándar de 4 agujeros es 24 pulgadas (610 mm) de largo para rieles hasta 115RE, 28 pulgadas para UIC 60, y 36 pulgadas (914 mm) para riel pesado 132RE-141RE. Los agujeros de perno son de 1-1/16 pulgada (27 mm) de diámetro para pernos de 1 pulgada o 1-1/8 pulgada (29 mm) para pernos de 1-1/8 pulgada, espaciados 5-1/2 a 6 pulgadas (140-152 mm) de centro a centro.",
        "الخمسة مقاطع سكة الأكثر شيوعًا على مستوى العالم هي UIC 54 (54 كجم/م)، UIC 60 (60 كجم/م، المعيار الأوروبي والآسيوي المهيمن)، AREMA 115RE (115 رطل/ياردة)، AREMA 136RE (136 رطل/ياردة)، وBS 113A (113 رطل/ياردة). بالنسبة لصفائح السمك، فإن نمط 4 ثقوب القياسي هو 24 بوصة (610 mm) طول للسكك حتى 115RE، 28 بوصة لـ UIC 60، و36 بوصة (914 mm) للسكك الثقيلة 132RE-141RE.",
        "Les cinq sections de rail les plus courantes au monde sont UIC 54 (54 kg/m), UIC 60 (60 kg/m, la norme européenne et asiatique dominante), AREMA 115RE (115 lb/yd), AREMA 136RE (136 lb/yd) et BS 113A (113 lb/yd). Pour les éclisses, le motif standard à 4 trous est de 24 pouces (610 mm) de long pour les rails jusqu'à 115RE, 28 pouces pour UIC 60 et 36 pouces (914 mm) pour les rails lourds 132RE-141RE. Les trous de boulon ont un diamètre de 1-1/16 pouce (27 mm) pour les boulons de 1 pouce ou 1-1/8 pouce (29 mm) pour les boulons de 1-1/8 pouce.",
        "As cinco seções de trilho mais comuns globalmente são UIC 54 (54 kg/m), UIC 60 (60 kg/m, o padrão europeu e asiático dominante), AREMA 115RE (115 lb/yd, linha principal de carga norte-americana), AREMA 136RE (136 lb/yd, carga pesada norte-americana) e BS 113A (113 lb/yd, legado britânico). Para talas de junção, o padrão de 4 furos é 24 polegadas (610 mm) de comprimento para trilhos até 115RE, 28 polegadas para UIC 60 e 36 polegadas (914 mm) para trilho pesado 132RE-141RE.",
        "Пять наиболее распространенных сечений рельсов в мире: UIC 54 (54 кг/м), UIC 60 (60 кг/м, доминирующий европейский и азиатский стандарт), AREMA 115RE (115 фунтов/ярд), AREMA 136RE (136 фунтов/ярд) и BS 113A (113 фунтов/ярд). Для стыковых накладок стандартный 4-дырочный шаблон составляет 24 дюйма (610 мм) в длину для рельсов до 115RE, 28 дюймов для UIC 60 и 36 дюймов (914 мм) для тяжелых рельсов 132RE-141RE.",
        "世界的に最も一般的な 5 つのレール断面は、UIC 54（54 kg/m）、UIC 60（60 kg/m、欧州およびアジアの支配的標準）、AREMA 115RE（115 ポンド/ヤード）、AREMA 136RE（136 ポンド/ヤード）、BS 113A（113 ポンド/ヤード）です。継目板の場合、標準的な 4 穴パターンは、115RE までのレールで長さ 24 インチ（610 mm）、UIC 60 で 28 インチ、132RE-141RE の重量レールで 36 インチ（914 mm）です。",
        "Die fünf weltweit häufigsten Schienenabschnitte sind UIC 54 (54 kg/m), UIC 60 (60 kg/m, der dominierende europäische und asiatische Standard), AREMA 115RE (115 lb/yd), AREMA 136RE (136 lb/yd) und BS 113A (113 lb/yd). Für Laschen ist das Standard-4-Loch-Muster 24 Zoll (610 mm) lang für Schienen bis 115RE, 28 Zoll für UIC 60 und 36 Zoll (914 mm) für schwere Schienen 132RE-141RE.",
        "विश्व स्तर पर पाँच सबसे सामान्य रेल सेक्शन हैं UIC 54 (54 किग्रा/मी), UIC 60 (60 किग्रा/मी, प्रमुख यूरोपीय और एशियाई मानक), AREMA 115RE (115 पाउंड/यार्ड), AREMA 136RE (136 पाउंड/यार्ड), और BS 113A (113 पाउंड/यार्ड)। फिश प्लेट के लिए, मानक 4-छिद्र पैटर्न 115RE तक की रेल के लिए 24 इंच (610 मिमी) लंबा, UIC 60 के लिए 28 इंच, और भारी रेल 132RE-141RE के लिए 36 इंच (914 मिमी) है।"
    )
})

# FAQ 5
faq_items.append({
    'q': t(
        "What is the minimum order quantity and lead time for railway fasteners from China?",
        "中国铁路紧固件的最小订货量和交货期是多少？",
        "¿Cuál es la cantidad mínima de pedido y el plazo de entrega para sujetadores ferroviarios de China?",
        "ما هي الحد الأدنى لكمية الطلب والمهلة الزمنية للمثبتات السككية من الصين؟",
        "Quelle est la quantité minimum de commande et le délai de livraison pour les attaches ferroviaires de Chine ?",
        "Qual é a quantidade mínima de pedido e o prazo de entrega para fixadores ferroviários da China?",
        "Каков минимальный объем заказа и срок поставки железнодорожных крепежей из Китая?",
        "中国からの鉄道締結具の最小注文数量とリードタイムは何ですか？",
        "Was ist die Mindestbestellmenge und Lieferzeit für Eisenbahnbefestigungen aus China?",
        "चीन से रेलवे फास्टनर के लिए न्यूनतम आदेश मात्रा और लीड टाइम क्या है?"
    ),
    'a': t(
        "MOQ for railway fasteners from China varies by product: elastic clips and tension clamps typically 50,000-100,000 pieces per size (one 20-foot FCL for e-2055 clips; one 40-foot FCL for Vossloh Skl 14); track bolts in M22 or M24 sizes 25,000-50,000 pieces per size; fish plates 5,000-10,000 sets per size; tie plates 1,000-3,000 pieces per size; and screw spikes or cut spikes 10-20 tonnes per size. Lead time: production 25-40 days after PO confirmation, pre-shipment inspection 3-5 days, ocean freight to African ports (Dar es Salaam, Durban, Lagos, Mombasa) 25-35 days, total door-to-door 60-90 days. For urgent requirements, air freight can reduce the ocean leg to 5-7 days at 4-6x the cost. TradeGo maintains safety stock of 200,000 Pandrol e-2055 equivalents and 80,000 Vossloh Skl 14 equivalents at the Shanghai free-trade zone for emergency orders above USD 100,000.",
        "中国铁路紧固件的最小订货量因产品而异：弹性扣件和弹条通常每种规格 50,000-100,000 件（e-2055 扣件一个 20 英尺整柜；Vossloh Skl 14 一个 40 英尺整柜）；M22 或 M24 规格的轨道螺栓每种规格 25,000-50,000 件；鱼尾板每种规格 5,000-10,000 套；垫板每种规格 1,000-3,000 件；螺纹道钉或切钉每种规格 10-20 吨。交货期：订单确认后生产 25-40 天，装运前检验 3-5 天，到非洲港口（达累斯萨拉姆、德班、拉各斯、蒙巴萨）的海运 25-35 天，全程门到门 60-90 天。对于紧急需求，空运可将海运段缩短至 5-7 天，费用为海运的 4-6 倍。TradeGo 在上海自由贸易区保持 200,000 个 Pandrol e-2055 等效产品和 80,000 个 Vossloh Skl 14 等效产品的安全库存，以满足 100,000 美元以上的紧急订单。",
        "La cantidad mínima de pedido para sujetadores ferroviarios de China varía según el producto: clips elásticos y grapas de tensión típicamente 50,000-100,000 piezas por tamaño; pernos de vía en tamaños M22 o M24 25,000-50,000 piezas por tamaño; placas de empalme 5,000-10,000 conjuntos por tamaño; placas de asiento 1,000-3,000 piezas por tamaño; y tirafondos o tirafondos cortados 10-20 toneladas por tamaño. Plazo de entrega: producción 25-40 días después de la confirmación del pedido, inspección previa al envío 3-5 días, flete marítimo a puertos africanos 25-35 días, total puerta a puerta 60-90 días. TradeGo mantiene stock de seguridad de 200,000 Pandrol e-2055 equivalentes y 80,000 Vossloh Skl 14 equivalentes en la zona de libre comercio de Shanghai para pedidos urgentes superiores a USD 100,000.",
        "تختلف الحد الأدنى لكمية الطلب للمثبتات السككية من الصين حسب المنتج: المشبكات المرنة ومشابك التوتر عادة 50,000-100,000 قطعة لكل حجم؛ مسامير المسار بأحجام M22 أو M24 من 25,000 إلى 50,000 قطعة لكل حجم؛ صفائح السمك 5,000-10,000 مجموعة لكل حجم؛ ألواح القاعدة 1,000-3,000 قطعة لكل حجم؛ والمسامير اللولبية أو مسامير القطع 10-20 طن لكل حجم. المهلة الزمنية: الإنتاج 25-40 يومًا بعد تأكيد الطلب، الفحص قبل الشحن 3-5 أيام، الشحن البحري إلى الموانئ الأفريقية 25-35 يومًا، الإجمالي من الباب إلى الباب 60-90 يومًا.",
        "La quantité minimum de commande pour les attaches ferroviaires de Chine varie selon le produit : clips élastiques et brides de tension typiquement 50 000-100 000 pièces par taille ; boulons de voie en tailles M22 ou M24 25 000-50 000 pièces par taille ; éclisses 5 000-10 000 ensembles par taille ; semelles 1 000-3 000 pièces par taille ; et crampons vissés ou coupés 10-20 tonnes par taille. Délai de livraison : production 25-40 jours après confirmation de commande, inspection avant expédition 3-5 jours, fret maritime vers les ports africains 25-35 jours, total porte-à-porte 60-90 jours. TradeGo maintient un stock de sécurité de 200 000 Pandrol e-2055 équivalents et 80 000 Vossloh Skl 14 équivalents dans la zone franche de Shanghai pour les commandes urgentes supérieures à 100 000 USD.",
        "A quantidade mínima de pedido para fixadores ferroviários da China varia de acordo com o produto: clipes elásticos e braçadeiras de tensão tipicamente 50.000-100.000 peças por tamanho; parafusos de via em tamanhos M22 ou M24 25.000-50.000 peças por tamanho; talas de junção 5.000-10.000 conjuntos por tamanho; placas de base 1.000-3.000 peças por tamanho; e parafusos ou tirefundos cortados 10-20 toneladas por tamanho. Prazo de entrega: produção 25-40 dias após confirmação do pedido, inspeção pré-embarque 3-5 dias, frete marítimo para portos africanos 25-35 dias, total porta a porta 60-90 dias. A TradeGo mantém estoque de segurança de 200.000 Pandrol e-2055 equivalentes e 80.000 Vossloh Skl 14 equivalentes na zona de livre comércio de Xangai para pedidos urgentes acima de USD 100.000.",
        "Минимальный объем заказа на железнодорожные крепежи из Китая варьируется в зависимости от продукта: упругие зажимы и натяжные хомуты обычно 50 000-100 000 штук каждого размера; путевые болты размеров M22 или M24 25 000-50 000 штук каждого размера; стыковые накладки 5 000-10 000 комплектов каждого размера; подкладки 1 000-3 000 штук каждого размера; и шурупы-костыли или обрубленные костыли 10-20 тонн каждого размера. Срок поставки: производство 25-40 дней после подтверждения заказа, предотгрузочный контроль 3-5 дней, морская перевозка в африканские порты 25-35 дней, итого от двери до двери 60-90 дней. TradeGo поддерживает страховой запас 200 000 Pandrol e-2055 эквивалентов и 80 000 Vossloh Skl 14 эквивалентов в шанхайской зоне свободной торговли для срочных заказов на сумму свыше 100 000 долларов США.",
        "中国からの鉄道締結具の最小注文数量は製品によって異なります：弾性クリップとテンションクランプは通常、サイズあたり 50,000〜100,000 個；M22 または M24 サイズの軌道ボルトはサイズあたり 25,000〜50,000 個；継目板はサイズあたり 5,000〜10,000 セット；タイプレートはサイズあたり 1,000〜3,000 個；ネジスパイクまたは刻みスパイクはサイズあたり 10〜20 トン。リードタイム：注文確認後 25〜40 日の生産、出荷前検査 3〜5 日、アフリカ諸港への海上貨物 25〜35 日、玄関から玄関まで合計 60〜90 日。緊急時には、航空貨物により海上区間を 5〜7 日に短縮でき、コストは 4〜6 倍になります。TradeGo は、100,000 米ドル以上の緊急注文に対応するため、上海自由貿易区に 200,000 個の Pandrol e-2055 相当品と 80,000 個の Vossloh Skl 14 相当品の安全在庫を維持しています。",
        "Die Mindestbestellmenge für Eisenbahnbefestigungen aus China variiert je nach Produkt: elastische Clips und Spannklemmen typischerweise 50.000-100.000 Stück pro Größe; Schienenschrauben in Größen M22 oder M24 25.000-50.000 Stück pro Größe; Laschen 5.000-10.000 Sätze pro Größe; Unterlegplatten 1.000-3.000 Stück pro Größe; und Schrauben- oder Schneidnägel 10-20 Tonnen pro Größe. Lieferzeit: Produktion 25-40 Tage nach Bestätigung der Bestellung, Vorversandkontrolle 3-5 Tage, Seefracht nach Afrika 25-35 Tage, insgesamt Tür zu Tür 60-90 Tage. TradeGo unterhält einen Sicherheitsbestand von 200.000 Pandrol e-2055-Äquivalenten und 80.000 Vossloh Skl 14-Äquivalenten in der Shanghaier Freihandelszone für dringende Bestellungen über 100.000 USD.",
        "चीन से रेलवे फास्टनर के लिए न्यूनतम आदेश मात्रा उत्पाद के अनुसार भिन्न होती है: लोचदार क्लिप और टेंशन क्लैम्प आमतौर पर 50,000-100,000 टुकड़े प्रति आकार; M22 या M24 आकार में ट्रैक बोल्ट 25,000-50,000 टुकड़े प्रति आकार; फिश प्लेट 5,000-10,000 सेट प्रति आकार; टाई प्लेट 1,000-3,000 टुकड़े प्रति आकार; और स्क्रू स्पाइक या कट स्पाइक 10-20 टन प्रति आकार। लीड टाइम: पुष्टि के बाद उत्पादन 25-40 दिन, शिपमेंट से पहले निरीक्षण 3-5 दिन, अफ्रीकी बंदरगाहों के लिए महासागरीय माल 25-35 दिन, कुल दरवाजे से दरवाजे तक 60-90 दिन।"
    )
})


# Save section 6 data
output = {
    's6_heading': s6_heading,
    's6_body': s6_body,
    'faq_items': faq_items,
}
with open('/tmp/railway_s6.json', 'w') as f:
    json.dump(output, f, ensure_ascii=False)
print(f"Section 6: {len(s6_body['en'].split())} words body.en, {len(faq_items)} FAQ items")
