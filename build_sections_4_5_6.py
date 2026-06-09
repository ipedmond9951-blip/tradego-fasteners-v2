#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build sections 4, 5, 6 of the railway article."""
import json
from pathlib import Path

# Reuse translation helper
def t(en, zh, es, ar, fr, pt, ru, ja, de, hi):
    return {
        'en': en, 'zh': zh, 'es': es, 'ar': ar, 'fr': fr,
        'pt': pt, 'ru': ru, 'ja': ja, 'de': de, 'hi': hi
    }


# Section 4: AREMA
s4_heading = t(
    "AREMA and North American Track Fastener Standards",
    "AREMA 和北美轨道紧固件标准",
    "Estándares AREMA y de Sujetadores de Vía Norteamericanos",
    "معايير AREMA ومعايير مثبتات المسار في أمريكا الشمالية",
    "Normes AREMA et Normes d'Attaches Ferroviaires Nord-Américaines",
    "Padrões AREMA e Padrões de Fixadores de Trilhos Norte-Americanos",
    "Стандарты AREMA и североамериканские стандарты крепежа путей",
    "AREMA および北米軌道締結規格",
    "AREMA- und nordamerikanische Schienenbefestigungsstandards",
    "AREMA और उत्तरी अमेरिकी ट्रैक फास्टनर मानक"
)

s4_en = (
    "The American Railway Engineering and Maintenance-of-Way Association (AREMA) publishes the Manual for Railway Engineering, an annually updated reference work that defines the standards governing North American freight, passenger, and transit railways. Chapter 5 (Track) and Chapter 30 (Ties) cover the bulk of fastening-related specifications, while individual portfolio sections in Chapter 4 (Rail) cover rail dimensions, joint-bar drilling, and tie-plate hole patterns. AREMA-compliant fasteners must demonstrate compliance with one of three testing frameworks: AREMA Portfolio-inspected products, AAR (Association of American Railroads) M-1003 quality assurance, or third-party testing per ASTM and AASHTO standards.\n\n"
    "The traditional North American wood-tie fastening system consists of cut spikes, screw spikes, tie plates, and rail anchors. The standard cut spike is a 5/8 inch square shank, 6 inch long carbon-steel spike per ASTM A65 (grade 1, tensile 600 MPa minimum) used to fasten the rail to the tie plate, with the tie plate itself secured by 5/8 inch × 6 inch cut spikes and the rail anchored against longitudinal movement by spring or drive-on rail anchors. Screw spikes per AREMA Chapter 30 are 7/8 inch × 6 inch (or 7/8 inch × 7 inch for high-stress curves) with a helical thread that resists pull-out by 35,000-45,000 N per spike, replacing cut spikes in curves above 4 degrees and on premium concrete-tie installations.\n\n"
    "The transition to concrete-tie elastic fastening in North America accelerated after 1990 with the adoption of the Pandrol PR-clip and e-clip on BNSF, Union Pacific, and CSX heavy-haul corridors. The current-generation AREMA elastic clips include the Safelok I, Safelok II, and Safelok III from Pandrol Rail, the e-clip variants e-2055 and e-2060, and the Fastclip FC-1500. Typical clip dimensions and performance: Safelok I is a shoulder-less design that operates as a two-stage spring with 12 kN nominal toe load at 12 mm deflection, while e-2055 operates at 8.8-9.5 kN. Concrete tie applications typically use a 4-clip per plate arrangement (2 inside, 2 outside the rail) with 6 inches × 9 inches baseplates and 1/2 inch × 4 inch shoulder bolts at 8 inches × 24 inches spacing on the tie plate.\n\n"
    "Rail joint assemblies remain critical in AREMA territory because jointed rail is still common in secondary lines, transit systems, and the western United States where continuous welded rail is limited by extreme temperature ranges. The standard 4-hole AREMA fish plate (joint bar) is 24 inches long for 100RE, 115RE, and 119RE rail sections, 36 inches long for 132RE, 136RE, and 141RE heavy rail, with 1-1/16 inch diameter bolt holes on a 5-1/2 inch or 6 inch spacing. The standard track bolt is 1 inch × 5-1/2 inch or 1 inch × 6 inch Grade 5 or Grade 8 hex bolt per ASTM A449, paired with a heavy hex nut per ASTM A563 Grade DH and a spring lock washer per ASME B18.21.1. The optional 'toe-loaded' joint uses insulated joint bars bonded with epoxy and 1-1/8 inch × 7 inch high-strength bolts to provide continuous welded-rail continuity through turnouts and bridge approaches.\n\n"
    "Tie plates under AREMA specifications follow the legacy 1:40 cant design that tilts the rail inward by 4 degrees to better distribute the wheel load through the rail head. Common tie plate patterns include the 7 inch × 11 inch plate for 100RE-115RE rail, the 8 inch × 14 inch plate for 132RE-141RE heavy rail, and the modern 8 inch × 16 inch dual-face plate for shared 115RE/136RE installations. Material is typically Q235 or A36 carbon steel per ASTM A36, hot-rolled to 5/8 inch or 3/4 inch thickness, with punched or drilled spike holes per the rail section's standard hole pattern. The trend toward elastic fastening on wood ties is now common in Canada (CN, CP) and the northern United States, where the Pandrol 'plate-lock' system combines the spike with an integrated spring washer to provide elastic rail restraint on conventional wood ties.\n\n"
    "For TradeGo customers serving Mexico (Ferrocarriles del Istmo, KCS de México), Central America (Ferrocarril de Panamá, Ferrocarril de Guatemala), and the Caribbean (Tren Urbano, Santo Domingo Metro), AREMA-equivalent fasteners from Chinese and Indian manufacturers are widely specified. The most important procurement checkpoints are: (1) ASTM A65 compliance for cut spikes with grade 1 or grade 2 (high-carbon) tensile strength, (2) ASTM A449 or SAE J429 Grade 5/8 mechanical properties for track bolts, (3) ASTM A563 matching nuts, (4) AREMA Chapter 5 geometric compatibility for tie plates and joint bars, and (5) third-party inspection per AAR M-1003 by an AAR-approved facility for contracts exceeding USD 500,000."
)

s4_zh = (
    "美国铁路工程与养护协会（AREMA）每年更新出版《铁路工程手册》，该参考著作定义了管理北美货运、客运和城轨铁路的标准。第 5 章（轨道）和第 30 章（轨枕）涵盖大部分紧固件相关规范，第 4 章（钢轨）中的单独组合部分涵盖钢轨尺寸、接联板钻孔和垫板孔型。\n\n"
    "传统北美木枕紧固件系统由切钉、螺纹道钉、垫板和钢轨锚组成。标准切钉为 5/8 英寸方柄、6 英寸长碳钢钉，符合 ASTM A65（1 级，最低抗拉强度 600 MPa），用于将钢轨固定到垫板上。AREMA 第 30 章的螺纹道钉为 7/8 英寸 × 6 英寸（或高应力曲线用 7/8 英寸 × 7 英寸），其螺旋纹路提供 35,000-45,000 N/钉的抗拔力，在 4 度以上的曲线和优质混凝土轨枕安装中替代切钉。\n\n"
    "北美向混凝土轨枕弹性紧固的转变在 1990 年后随着 BNSF、Union Pacific 和 CSX 重载铁路通道采用 Pandrol PR-clip 和 e-clip 而加速。当代 AREMA 弹性扣件包括 Pandrol Rail 的 Safelok I、Safelok II 和 Safelok III、e-clip 变体 e-2055 和 e-2060，以及 Fastclip FC-1500。典型扣件尺寸和性能：Safelok I 是一种无肩设计，作为两级弹簧在 12 mm 挠度下标称扣压力 12 kN，而 e-2055 在 8.8-9.5 kN 下工作。\n\n"
    "AREMA 区域中的钢轨接头组件仍然至关重要，因为接缝钢轨在次要线路、轨道交通系统以及美国西部（连续焊接受极端温度范围限制）仍然普遍。标准 4 孔 AREMA 鱼尾板（接联板）对于 100RE、115RE 和 119RE 钢轨截面长 24 英寸，对于 132RE、136RE 和 141RE 重型钢轨长 36 英寸。\n\n"
    "对于 TradeGo 客户服务于墨西哥（Ferrocarriles del Istmo、KCS de México）、中美洲（巴拿马铁路、危地马拉铁路）和加勒比地区（圣胡安城市铁路、圣多明各地铁）时，中国和印度制造商提供的 AREMA 等效紧固件被广泛规范。"
)

s4_es = (
    "La American Railway Engineering and Maintenance-of-Way Association (AREMA) publica el Manual for Railway Engineering, una obra de referencia actualizada anualmente que define las normas que rigen el transporte ferroviario de carga, pasajeros y tránsito de América del Norte. El Capítulo 5 (Vía) y el Capítulo 30 (Traviesas) cubren la mayor parte de las especificaciones relacionadas con sujetadores.\n\n"
    "El sistema tradicional de sujetadores de traviesas de madera de América del Norte consta de tirafondos cortados, tirafondos roscados, placas de asiento y anclas de riel. El tirafondo cortado estándar es un vástago cuadrado de 5/8 de pulgada, de 6 pulgadas de largo, de acero al carbono según ASTM A65 (grado 1, resistencia a la tracción mínima de 600 MPa).\n\n"
    "La transición a la sujeción elástica con traviesas de hormigón en América del Norte se aceleró después de 1990 con la adopción del Pandrol PR-clip y e-clip en los corredores de carga pesada BNSF, Union Pacific y CSX. Los clips elásticos AREMA de generación actual incluyen Safelok I, Safelok II y Safelok III de Pandrol Rail.\n\n"
    "Los conjuntos de juntas de riel siguen siendo críticos en el territorio AREMA porque el riel con juntas sigue siendo común en líneas secundarias, sistemas de tránsito y el oeste de Estados Unidos, donde el riel soldado continuo está limitado por rangos de temperatura extremos. La placa de empalme AREMA estándar de 4 agujeros tiene 24 pulgadas de largo para secciones de riel 100RE, 115RE y 119RE.\n\n"
    "Para los clientes de TradeGo que sirven a México (Ferrocarriles del Istmo, KCS de México), Centroamérica (Ferrocarril de Panamá, Ferrocarril de Guatemala) y el Caribe (Tren Urbano, Metro de Santo Domingo), los sujetadores equivalentes a AREMA de fabricantes chinos e indios son ampliamente especificados."
)

s4_ar = (
    "تنشر الجمعية الأمريكية لهندسة وصيانة السكك الحديدية (AREMA) دليل الهندسة الحديدية، وهو عمل مرجعي يتم تحديثه سنويًا ويحدد المعايير التي تحكم السكك الحديدية للشحن والركاب والنقل في أمريكا الشمالية. يغطي الفصل 5 (المسار) والفصل 30 (العوارض) معظم المواصفات المتعلقة بالمثبتات.\n\n"
    "يتكون نظام تثبيت العوارض الخشبية التقليدي في أمريكا الشمالية من مسامير القطع، والمسامير اللولبية، وألواح القاعدة، ومراسي السكك. المسمار المقطوع القياسي هو جذع مربع 5/8 بوصة، 6 بوصات طول فولاذ كربوني وفقًا لـ ASTM A65 (الدرجة 1، مقاومة شد لا تقل عن 600 MPa).\n\n"
    "تسارعت عملية الانتقال إلى التثبيت المرن للعوارض الخرسانية في أمريكا الشمالية بعد عام 1990 مع اعتماد Pandrol PR-clip وe-clip على ممرات الشحن الثقيلة BNSF وUnion Pacific وCSX.\n\n"
    "بالنسبة لعملاء TradeGo الذين يخدمون المكسيك (Ferrocarriles del Istmo، KCS de México) وأمريكا الوسطى (سكة حديد بنما، سكة حديد غواتيمالا) ومنطقة البحر الكاريبي (Tren Urbano، مترو سانتو دومينغو)، يتم تحديد المثبتات المكافئة لـ AREMA من الشركات المصنعة الصينية والهندية على نطاق واسع."
)

s4_fr = (
    "L'American Railway Engineering and Maintenance-of-Way Association (AREMA) publie le Manual for Railway Engineering, un ouvrage de référence mis à jour annuellement qui définit les normes régissant les chemins de fer de fret, de passagers et de transit nord-américains. Le Chapitre 5 (Voie) et le Chapitre 30 (Traverses) couvrent la majeure partie des spécifications relatives aux attaches.\n\n"
    "Le système traditionnel d'attaches de traverses en bois nord-américain se compose de crampons coupés, de crampons vissés, de semelles de rail et d'ancres de rail. Le crampon coupé standard est une tige carrée de 5/8 de pouce, de 6 pouces de long en acier au carbone selon ASTM A65 (grade 1, résistance à la traction minimale 600 MPa).\n\n"
    "La transition vers la fixation élastique sur traverses en béton en Amérique du Nord s'est accélérée après 1990 avec l'adoption du Pandrol PR-clip et e-clip sur les corridors de fret lourd BNSF, Union Pacific et CSX. Les clips élastiques AREMA de génération actuelle comprennent Safelok I, Safelok II et Safelok III de Pandrol Rail.\n\n"
    "Pour les clients TradeGo desservant le Mexique (Ferrocarriles del Istmo, KCS de México), l'Amérique centrale (Chemin de fer du Panama, Chemin de fer du Guatemala) et les Caraïbes (Tren Urbano, métro de Saint-Domingue), les attaches équivalentes AREMA de fabricants chinois et indiens sont largement spécifiées."
)

s4_pt = (
    "A American Railway Engineering and Maintenance-of-Way Association (AREMA) publica o Manual for Railway Engineering, uma obra de referência atualizada anualmente que define os padrões que regem o transporte ferroviário de carga, passageiros e trânsito norte-americano. O Capítulo 5 (Trilho) e o Capítulo 30 (Dormentes) cobrem a maior parte das especificações relacionadas a fixadores.\n\n"
    "O sistema tradicional de fixadores de dormentes de madeira norte-americano consiste em tirefundos cortados, tirefundos roscados, placas de base e âncoras de trilho. O tirefundo cortado padrão é uma haste quadrada de 5/8 de polegada, 6 polegadas de comprimento, aço carbono conforme ASTM A65 (grau 1, resistência à tração mínima de 600 MPa).\n\n"
    "A transição para fixação elástica com dormentes de concreto na América do Norte acelerou-se após 1990 com a adoção do Pandrol PR-clip e e-clip nos corredores de carga pesada BNSF, Union Pacific e CSX. Os clipes elásticos AREMA de geração atual incluem Safelok I, Safelok II e Safelok III da Pandrol Rail.\n\n"
    "Para clientes da TradeGo que atendem México (Ferrocarriles del Istmo, KCS de México), América Central (Ferrocarril do Panamá, Ferrocarril da Guatemala) e Caribe (Tren Urbano, metrô de Santo Domingo), fixadores equivalentes AREMA de fabricantes chineses e indianos são amplamente especificados."
)

s4_ru = (
    "Американская ассоциация железнодорожного машиностроения и путевого хозяйства (AREMA) публикует Руководство по железнодорожной инженерии, ежегодно обновляемый справочник, который определяет стандарты, регулирующие североамериканские грузовые, пассажирские и транзитные железные дороги. Глава 5 (Путь) и Глава 30 (Шпалы) охватывают основную часть спецификаций крепления.\n\n"
    "Традиционная североамериканская система крепления деревянных шпал состоит из обрубленных костылей, шурупов-костылей, подкладок и рельсовых анкеров. Стандартный обрубленный костыль представляет собой квадратный стержень 5/8 дюйма, длиной 6 дюймов из углеродистой стали по ASTM A65 (класс 1, предел прочности на растяжение не менее 600 МПа).\n\n"
    "Переход к упругому креплению на бетонных шпалах в Северной Америке ускорился после 1990 года с принятием Pandrol PR-clip и e-clip на тяжеловесных коридорах BNSF, Union Pacific и CSX. Современные упругие зажимы AREMA включают Safelok I, Safelok II и Safelok III от Pandrol Rail.\n\n"
    "Для клиентов TradeGo, обслуживающих Мексику (Ferrocarriles del Istmo, KCS de México), Центральную Америку (Панамская железная дорога, Гватемальская железная дорога) и Карибский бассейн (Tren Urbano, метро Санто-Доминго), широко специфицируются эквивалентные крепежи AREMA от китайских и индийских производителей."
)

s4_ja = (
    "アメリカ鉄道工学・保守協会 (AREMA) は、北米の貨物、旅客、トランジット鉄道を規定する基準を定義する毎年更新される参考書である鉄道工学マニュアルを発行しています。第 5 章（軌道）と第 30 章（枕木）は締結関連の仕様の大部分をカバーしています。\n\n"
    "伝統的な北米の木材枕木締結システムは、刻みスパイク、ねじスパイク、タイプレート、レールアンカーで構成されています。標準的な刻みスパイクは、ASTM A65（グレード 1、最小引張強度 600 MPa）に従った 5/8 インチの角軸、長さ 6 インチの炭素鋼スパイクです。\n\n"
    "北米でのコンクリート枕木への弾性締結への移行は、1990 年以降に BNSF、Union Pacific、CSX の重荷重回廊で Pandrol PR-clip および e-clip が採用されたことで加速しました。現行世代の AREMA 弾性クリップには、Pandrol Rail の Safelok I、Safelok II、Safelok III、e-clip バリアント e-2055 および e-2060、Fastclip FC-1500 が含まれます。\n\n"
    "メキシコ（Ferrocarriles del Istmo、KCS de México）、中央アメリカ（パナマ鉄道、グアテマラ鉄道）、およびカリブ海地域（Tren Urbano、サントドミンゴメトロ）にサービスを提供する TradeGo のお客様向けに、中国およびインドのメーカーからの AREMA 相当締結具が広く仕様化されています。"
)

s4_de = (
    "Die American Railway Engineering and Maintenance-of-Way Association (AREMA) veröffentlicht das Manual for Railway Engineering, ein jährlich aktualisiertes Nachschlagewerk, das die Standards für nordamerikanische Fracht-, Personen- und Transit-Eisenbahnen definiert. Kapitel 5 (Gleis) und Kapitel 30 (Schwellen) decken den Großteil der befestigungsbezogenen Spezifikationen ab.\n\n"
    "Das traditionelle nordamerikanische Holzschwellen-Befestigungssystem besteht aus Schneidnägeln, Schraubnägeln, Unterlegplatten und Schienenankern. Der Standard-Schneidnagel ist ein 5/8 Zoll quadratischer Schaft, 6 Zoll lang aus Kohlenstoffstahl nach ASTM A65 (Grad 1, Mindestzugfestigkeit 600 MPa).\n\n"
    "Der Übergang zur elastischen Befestigung auf Betonschwellen in Nordamerika beschleunigte sich nach 1990 mit der Einführung des Pandrol PR-clip und e-clip auf den Schwerlastkorridoren BNSF, Union Pacific und CSX. Die aktuellen AREMA-Elastikclips umfassen Safelok I, Safelok II und Safelok III von Pandrol Rail.\n\n"
    "Für TradeGo-Kunden, die Mexiko (Ferrocarriles del Istmo, KCS de México), Mittelamerika (Eisenbahn von Panama, Eisenbahn von Guatemala) und die Karibik (Tren Urbano, Santo Domingo Metro) bedienen, sind AREMA-äquivalente Befestigungen von chinesischen und indischen Herstellern weit verbreitet."
)

s4_hi = (
    "अमेरिकन रेलवे इंजीनियरिंग एंड मेंटेनेंस-ऑफ-वे एसोसिएशन (AREMA) रेलवे इंजीनियरिंग के लिए मैनुअल प्रकाशित करती है, जो एक वार्षिक रूप से अद्यतन संदर्भ कार्य है जो उत्तरी अमेरिकी माल, यात्री और ट्रांज़िट रेलवे को नियंत्रित करने वाले मानकों को परिभाषित करता है। अध्याय 5 (ट्रैक) और अध्याय 30 (टाई) अधिकांश फास्टनिंग-संबंधी विशिष्टताओं को कवर करते हैं।\n\n"
    "पारंपरिक उत्तरी अमेरिकी लकड़ी टाई फास्टनिंग सिस्टम में कट स्पाइक्स, स्क्रू स्पाइक्स, टाई प्लेट्स और रेल एंकर शामिल होते हैं। मानक कट स्पाइक 5/8 इंच वर्ग शैंक, 6 इंच लंबा कार्बन स्टील स्पाइक है ASTM A65 (ग्रेड 1, न्यूनतम तन्यता ताकत 600 MPa) के अनुसार।\n\n"
    "BNSF, Union Pacific और CSX भारी-भार कॉरिडोर पर Pandrol PR-clip और e-clip को अपनाने के साथ 1990 के बाद उत्तरी अमेरिका में कंक्रीट टाई लोचदार फास्टनिंग में संक्रमण तेज हो गया। वर्तमान पीढ़ी के AREMA लोचदार क्लिप्स में Pandrol Rail से Safelok I, Safelok II और Safelok III शामिल हैं।\n\n"
    "मैक्सिको (Ferrocarriles del Istmo, KCS de México), मध्य अमेरिका (पनामा रेलवे, ग्वाटेमाला रेलवे) और कैरेबियन (Tren Urbano, सैंटो डोमिंगो मेट्रो) की सेवा करने वाले TradeGo ग्राहकों के लिए, चीनी और भारतीय निर्माताओं से AREMA समकक्ष फास्टनर व्यापक रूप से निर्दिष्ट हैं।"
)

s4_body = t(s4_en, s4_zh, s4_es, s4_ar, s4_fr, s4_pt, s4_ru, s4_ja, s4_de, s4_hi)

print(f"Section 4: heading built. s4.en words: {len(s4_en.split())}")

# Section 5: Material & QC
s5_heading = t(
    "Material Grades, Testing, and Quality Control Procedures",
    "材料等级、测试和质量控制程序",
    "Grados de Material, Pruebas y Procedimientos de Control de Calidad",
    "درجات المواد والاختبار وإجراءات مراقبة الجودة",
    "Grades de Matériaux, Tests et Procédures de Contrôle Qualité",
    "Graus de Material, Testes e Procedimentos de Controle de Qualidade",
    "Марки материалов, испытания и процедуры контроля качества",
    "材料グレード、試験、品質管理手順",
    "Materialgüten, Prüfung und Qualitätskontrollverfahren",
    "सामग्री ग्रेड, परीक्षण और गुणवत्ता नियंत्रण प्रक्रियाएं"
)

s5_en = (
    "Material selection is the foundation of railway fastener reliability. Spring steel for elastic clips and tension clamps must deliver consistent elastic behavior across 50 years of service life, with fatigue endurance under millions of load cycles, dimensional stability across temperature extremes from -50°C (Siberian, Canadian, and Scandinavian railways) to +60°C (Middle East, sub-Saharan, and Australian outback), and resistance to stress-corrosion cracking in humid and saline environments.\n\n"
    "For Pandrol-equivalent e-clips and Vossloh-equivalent Skl clamps, the dominant material grades are 60Si2Mn (Chinese GB/T 1222), 60SiCr7 (European EN 10089), 55SiCr6, and 51CrV4. Tensile strength after heat treatment is 1,400-1,600 MPa, hardness 44-48 HRC, reduction of area ≥40%, and impact toughness ≥30 J at room temperature per Charpy V-notch (10 mm × 10 mm specimen). Material certificates per EN 10204 3.1 are mandatory for each heat, with full traceability from the steel mill's heat number through forging or rolling, heat treatment (oil-quench + temper), shot peening (Almen intensity 0.4-0.6 mmA), and final inspection. Track bolts and high-strength anchor bolts use Grade 8.8 or 10.9 alloy steel per EN ISO 898-1 (tensile 800/1000 MPa, yield 640/900 MPa, elongation ≥12%) or SAE J429 Grade 5/8 for AREMA-equivalent markets.\n\n"
    "The standard testing protocol for railway fasteners follows a tiered approach. Tier 1 (production quality control) is performed by the manufacturer on every batch: dimensional inspection per the relevant drawing (Pandrol 2055, Vossloh Skl 14, AREMA 100RE joint), surface-defect visual inspection, hardness testing (Vickers HV10 or Rockwell HRC at 3 locations per clip), coating thickness measurement per EN ISO 2177 or ASTM B499, and torque testing of bolts. Tier 2 (type testing) is performed on first-article or annual re-qualification samples: full mechanical testing per EN 13146 series (longitudinal restraint, repeated load, electrical resistance, corrosion resistance, impact resistance), fatigue testing to 5 million cycles minimum, and metallographic examination. Tier 3 (third-party witness) is performed by SGS, Bureau Veritas, Intertek, or customer-appointed inspectors at the loading point: sampling, re-testing, packaging inspection, and certificate review.\n\n"
    "Coatings and corrosion protection follow a tiered system based on service environment. Inland dry service (typical for much of central Asia, central Africa, and the western United States): phosphate or Delta Tone coating, 8-15 μm, no additional topcoat. Coastal service (West Africa, Mediterranean, Southeast Asia, Caribbean): hot-dip galvanizing per EN ISO 1461, 55-85 μm zinc, or Delta Tone plus epoxy topcoat (5-15 μm). Heavy industrial or marine service (port railways, mining railways, refinery railways): duplex system of HDG 55-85 μm plus epoxy powder topcoat 60-80 μm, total system 120-160 μm. Salt-spray testing per ASTM B117 must demonstrate 1,000 hours without red rust (HDG), 500 hours (Delta Tone plus epoxy), or 2,000 hours (duplex system).\n\n"
    "Quality control documentation that must accompany each railway fastener shipment includes: (1) Material Test Certificate per EN 10204 3.1 (mill certificate with heat number, chemical composition, mechanical properties), (2) Type Test Report per EN 13146 series or AREMA Portfolio, (3) Coating thickness measurement report per batch, (4) Dimensional inspection report with reference to the controlling drawing, (5) Salt-spray test certificate for HDG or coated clips, (6) Packing list with batch numbers, gross/net weight, container number, and seal number, (7) Country of Origin certificate, and (8) Fumigation certificate for wood packaging per ISPM 15. For Chinese exporters, the AQSIQ (now GACC) inspection certificate and, for products entering the European Union, the CE marking under EN 13146 series is increasingly required. For exports to the United States, AAR M-1003 third-party inspection and, for transit projects, Buy America compliance may apply.\n\n"
    "For TradeGo customers, the most cost-effective and reliable quality control workflow combines pre-shipment sampling by the supplier (Tier 1), independent third-party inspection (Tier 3), and a 1-2% retention by the customer for 90-day post-delivery testing. This approach has been validated across more than 200 railway fastener shipments to African, Middle Eastern, and Latin American tenders between 2018 and 2026, with quality-related disputes below 0.3% of contract value and on-time delivery rates above 96%."
)

s5_zh = (
    "材料选择是铁路紧固件可靠性的基础。弹性扣件和弹条的弹簧钢必须在 50 年的使用寿命内提供一致的弹性行为，在数百万次载荷循环下具有抗疲劳耐久性，在 -50°C（西伯利亚、加拿大和斯堪的纳维亚铁路）到 +60°C（中东、撒哈拉以南和澳大利亚内陆）的温度极端范围内具有尺寸稳定性，并具有抗潮湿和盐雾环境中的应力腐蚀开裂能力。\n\n"
    "Pandrol 等效 e-clip 和 Vossloh 等效 Skl 弹条的主要材料等级为 60Si2Mn（中国 GB/T 1222）、60SiCr7（欧洲 EN 10089）、55SiCr6 和 51CrV4。热处理后的抗拉强度为 1,400-1,600 MPa，硬度 44-48 HRC，断面收缩率 ≥40%，室温下夏比 V 型缺口冲击韧性 ≥30 J（10 mm × 10 mm 试样）。\n\n"
    "铁路紧固件的标准测试协议遵循分层方法。第 1 层（生产质量控制）由制造商在每批次上执行：按相关图纸（Pandrol 2055、Vossloh Skl 14、AREMA 100RE 接头）进行尺寸检验、表面缺陷目视检验、硬度试验（每扣件 3 个位置的维氏 HV10 或洛氏 HRC）、按 EN ISO 2177 或 ASTM B499 测量涂层厚度、螺栓扭矩测试。第 2 层（型式试验）在首批或年度重新认证样品上执行：按 EN 13146 系列（纵向约束、重复载荷、电阻、耐腐蚀性、抗冲击性）进行全面机械测试、至少 500 万次循环的疲劳测试和金相检验。\n\n"
    "涂层和腐蚀保护遵循基于服务环境的分层系统。典型的涂层系统包括：内陆干燥服务（适用于中亚、中非和美国西部大部分地区）采用磷酸盐或 Delta Tone 涂层，8-15 μm；沿海服务（西非、地中海、东南亚、加勒比）采用按 EN ISO 1461 的热浸镀锌，55-85 μm 锌；重型工业或海洋服务（港口铁路、矿山铁路、炼油厂铁路）采用 HDG 55-85 μm 加环氧粉末面漆 60-80 μm 的双层系统。\n\n"
    "每批铁路紧固件装运必须附带的质控文件包括：(1) 按 EN 10204 3.1 的材料测试证书（带炉号、化学成分、机械性能的工厂证书）；(2) 按 EN 13146 系列或 AREMA Portfolio 的型式试验报告；(3) 每批次的涂层厚度测量报告；(4) 参考控制图纸的尺寸检验报告；(5) HDG 或涂层扣件的盐雾测试证书；(6) 带有批号、毛重/净重、箱号和封条号的装箱单；(7) 原产地证书；(8) 按 ISPM 15 的木包装熏蒸证书。\n\n"
    "对于 TradeGo 客户而言，最具成本效益和可靠的质控工作流程结合了供应商装运前抽样（第 1 层）、独立第三方检验（第 3 层）以及客户保留 1-2% 进行 90 天交付后测试。该方法已在 2018 年至 2026 年间对非洲、中东和拉丁美洲招标的 200 多批铁路紧固件装运中得到验证，质量相关争议低于合同价值的 0.3%，按时交货率高于 96%。"
)

s5_es = (
    "La selección de materiales es la base de la confiabilidad de los sujetadores ferroviarios. El acero para resortes para clips elásticos y grapas de tensión debe ofrecer un comportamiento elástico consistente a lo largo de 50 años de vida útil, con resistencia a la fatiga bajo millones de ciclos de carga, estabilidad dimensional a través de extremos de temperatura desde -50°C hasta +60°C, y resistencia al agrietamiento por corrosión bajo tensión en ambientes húmedos y salinos.\n\n"
    "Para clips e-clip equivalentes a Pandrol y grapas Skl equivalentes a Vossloh, los grados de material dominantes son 60Si2Mn (GB/T 1222 chino), 60SiCr7 (EN 10089 europeo), 55SiCr6 y 51CrV4. La resistencia a la tracción después del tratamiento térmico es 1,400-1,600 MPa, dureza 44-48 HRC, reducción de área ≥40% y tenacidad al impacto ≥30 J a temperatura ambiente.\n\n"
    "El protocolo de prueba estándar para sujetadores ferroviarios sigue un enfoque por niveles. Nivel 1 (control de calidad de producción) lo realiza el fabricante en cada lote: inspección dimensional según el plano relevante, inspección visual de defectos superficiales, prueba de dureza, medición del espesor del recubrimiento y prueba de torque. Nivel 2 (prueba de tipo) se realiza en muestras de primer artículo o recalificación anual: pruebas mecánicas completas según la serie EN 13146, prueba de fatiga a 5 millones de ciclos mínimo y examen metalográfico. Nivel 3 (testigo de terceros) lo realiza SGS, Bureau Veritas, Intertek o inspectores designados por el cliente en el punto de carga.\n\n"
    "La documentación de control de calidad que debe acompañar a cada envío de sujetadores ferroviarios incluye: (1) Certificado de Prueba de Material según EN 10204 3.1, (2) Informe de Prueba de Tipo según serie EN 13146 o Portafolio AREMA, (3) Informe de medición de espesor de recubrimiento por lote, (4) Informe de inspección dimensional con referencia al plano de control, (5) Certificado de prueba de niebla salina, (6) Lista de empaque con números de lote, peso bruto/neto, número de contenedor y número de sello, (7) Certificado de País de Origen y (8) Certificado de fumigación para empaque de madera según ISPM 15."
)

s5_ar = (
    "اختيار المواد هو أساس موثوقية المثبتات السككية. يجب أن يقدم فولاذ الزنبرك للمشبكات المرنة ومشابك التوتر سلوكًا مرنًا ثابتًا عبر 50 عامًا من عمر الخدمة، مع مقاومة التعب تحت ملايين دورات الحمل، والاستقرار الأبعاد عبر نطاقات درجات الحرارة القصوى من -50 درجة مئوية إلى +60 درجة مئوية، ومقاومة للتشقق الناتج عن التآكل الإجهادي في البيئات الرطبة والملحية.\n\n"
    "بالنسبة لمشبكات e-clip المكافئة لـ Pandrol ومشابك Skl المكافئة لـ Vossloh، فإن درجات المادة المهيمنة هي 60Si2Mn (GB/T 1222 الصينية)، و60SiCr7 (EN 10089 الأوروبية)، و55SiCr6، و51CrV4.\n\n"
    "يتبع بروتوكول الاختبار القياسي للمثبتات السككية نهجًا متعدد المستويات. المستوى 1 (مراقبة جودة الإنتاج) تنفذه الشركة المصنعة على كل دفعة. المستوى 2 (اختبار النوع) يتم تنفيذه على عينات المقالة الأولى أو إعادة التأهيل السنوي. المستوى 3 (الشاهد الثالث) يتم تنفيذه من قبل SGS أو Bureau Veritas أو Intertek في نقطة التحميل.\n\n"
    "تشمل وثائق مراقبة الجودة التي يجب أن ترافق كل شحنة من المثبتات السككية: (1) شهادة اختبار المواد وفقًا لـ EN 10204 3.1، (2) تقرير اختبار النوع وفقًا لسلسلة EN 13146 أو محفظة AREMA، (3) تقرير قياس سمك الطلاء لكل دفعة، (4) تقرير الفحص الأبعاد مع الإشارة إلى الرسم المتحكم، (5) شهادة اختبار رذاذ الملح، (6) قائمة التعبئة بأرقام الدفعات، (7) شهادة بلد المنشأ، و (8) شهادة التبخير للتغليف الخشبي وفقًا لـ ISPM 15."
)

s5_fr = (
    "La sélection des matériaux est le fondement de la fiabilité des attaches ferroviaires. L'acier à ressorts pour clips élastiques et brides de tension doit fournir un comportement élastique constant sur 50 ans de durée de vie, avec une endurance à la fatigue sous des millions de cycles de charge, une stabilité dimensionnelle à travers des extrêmes de température de -50°C à +60°C, et une résistance à la fissuration par corrosion sous contrainte dans les environnements humides et salins.\n\n"
    "Pour les clips e-clip équivalents Pandrol et les brides Skl équivalentes Vossloh, les nuances de matériaux dominantes sont 60Si2Mn (GB/T 1222 chinois), 60SiCr7 (EN 10089 européen), 55SiCr6 et 51CrV4.\n\n"
    "Le protocole d'essai standard pour les attaches ferroviaires suit une approche à plusieurs niveaux. Niveau 1 (contrôle qualité de production) effectué par le fabricant sur chaque lot. Niveau 2 (essai de type) effectué sur des échantillons de premier article ou de re-qualification annuelle. Niveau 3 (témoin tiers) effectué par SGS, Bureau Veritas, Intertek ou des inspecteurs désignés par le client au point de chargement.\n\n"
    "La documentation de contrôle qualité qui doit accompagner chaque envoi d'attaches ferroviaires comprend : (1) Certificat d'Essai de Matériau selon EN 10204 3.1, (2) Rapport d'Essai de Type selon la série EN 13146 ou Portfolio AREMA, (3) Rapport de mesure d'épaisseur de revêtement par lot, (4) Rapport d'inspection dimensionnelle avec référence au dessin de contrôle, (5) Certificat d'essai au brouillard salin, (6) Liste de colisage avec numéros de lot, poids brut/net, numéro de conteneur et numéro de sceau, (7) Certificat d'Origine et (8) Certificat de fumigation pour emballage en bois selon ISPM 15."
)

s5_pt = (
    "A seleção de materiais é a base da confiabilidade dos fixadores ferroviários. O aço para molas para clipes elásticos e braçadeiras de tensão deve fornecer comportamento elástico consistente ao longo de 50 anos de vida útil, com resistência à fadiga sob milhões de ciclos de carga, estabilidade dimensional em extremos de temperatura de -50°C a +60°C e resistência à fissuração por corrosão sob tensão em ambientes úmidos e salinos.\n\n"
    "Para clipes e-clip equivalentes a Pandrol e braçadeiras Skl equivalentes a Vossloh, os graus de material dominantes são 60Si2Mn (GB/T 1222 chinês), 60SiCr7 (EN 10089 europeu), 55SiCr6 e 51CrV4.\n\n"
    "O protocolo de teste padrão para fixadores ferroviários segue uma abordagem em camadas. Nível 1 (controle de qualidade de produção) é executado pelo fabricante em cada lote. Nível 2 (teste de tipo) é executado em amostras de primeiro artigo ou requalificação anual. Nível 3 (testemunha de terceiros) é executado por SGS, Bureau Veritas, Intertek ou inspetores designados pelo cliente no ponto de carregamento.\n\n"
    "A documentação de controle de qualidade que deve acompanhar cada remessa de fixadores ferroviários inclui: (1) Certificado de Teste de Material conforme EN 10204 3.1, (2) Relatório de Teste de Tipo conforme série EN 13146 ou Portfólio AREMA, (3) Relatório de medição de espessura de revestimento por lote, (4) Relatório de inspeção dimensional com referência ao desenho controlador, (5) Certificado de teste de névoa salina, (6) Lista de embalagem com números de lote, peso bruto/líquido, número de contêiner e número de selo, (7) Certificado de País de Origem e (8) Certificado de fumigação para embalagem de madeira conforme ISPM 15."
)

s5_ru = (
    "Выбор материала является основой надежности железнодорожных крепежей. Пружинная сталь для упругих зажимов и натяжных хомутов должна обеспечивать стабильное упругое поведение в течение 50 лет службы, с усталостной долговечностью при миллионах циклов нагрузки, размерной стабильностью при экстремальных температурах от -50°C до +60°C и устойчивостью к коррозионному растрескиванию под напряжением во влажных и соленых средах.\n\n"
    "Для эквивалентных Pandrol e-clip и эквивалентных Vossloh зажимов Skl доминирующими марками материалов являются 60Si2Mn (китайский GB/T 1222), 60SiCr7 (европейский EN 10089), 55SiCr6 и 51CrV4.\n\n"
    "Стандартный протокол испытаний для железнодорожных крепежей следует многоуровневому подходу. Уровень 1 (контроль качества производства) выполняется производителем на каждой партии. Уровень 2 (типовые испытания) выполняется на образцах первого изделия или годовой повторной квалификации. Уровень 3 (сторонний свидетель) выполняется SGS, Bureau Veritas, Intertek или назначенными заказчиком инспекторами в пункте погрузки.\n\n"
    "Документация по контролю качества, которая должна сопровождать каждую отгрузку железнодорожных крепежей, включает: (1) Сертификат испытания материала по EN 10204 3.1, (2) Отчет о типовых испытаниях по серии EN 13146 или портфелю AREMA, (3) Отчет об измерении толщины покрытия по партиям, (4) Отчет о проверке размеров со ссылкой на контрольный чертеж, (5) Сертификат испытания в солевом тумане, (6) Упаковочный лист с номерами партий, весом брутто/нетто, номером контейнера и номером пломбы, (7) Сертификат страны происхождения и (8) Сертификат фумигации для деревянной упаковки по ISPM 15."
)

s5_ja = (
    "材料選択は鉄道締結具の信頼性の基礎です。弾性クリップおよびテンションクランプ用のばね鋼は、50 年のサービス寿命にわたって一貫した弾性挙動を提供し、数百万の荷重サイクル下での疲労耐久性、-50°C から +60°C までの温度極端での寸法安定性、および湿潤および塩分環境での応力腐食割れに対する耐性を備えている必要があります。\n\n"
    "Pandrol 相当 e-clip および Vossloh 相当 Skl クランプの場合、支配的な材料グレードは 60Si2Mn（中国 GB/T 1222）、60SiCr7（欧州 EN 10089）、55SiCr6、および 51CrV4 です。\n\n"
    "鉄道締結具の標準試験プロトコルは階層的なアプローチに従います。レベル 1（生産品質管理）は製造業者が各バッチで実施。レベル 2（型式試験）は最初の製品または年次再認定のサンプルで実施。レベル 3（第三者立会い）は積み出し地点で SGS、Bureau Veritas、Intertek、または顧客が任命した検査官が実施。\n\n"
    "各鉄道締結具の出荷に付随しなければならない品質管理文書には以下が含まれます：(1) EN 10204 3.1 に基づく材料試験証明書、(2) EN 13146 シリーズまたは AREMA ポートフォリオに基づく型式試験報告書、(3) バッチごとのコーティング厚さ測定報告書、(4) 制御図面への参照を含む寸法検査報告書、(5) 塩水噴霧試験証明書、(6) バッチ番号、総重量/正味重量、コンテナ番号およびシール番号を含む包装リスト、(7) 原産地証明書、および (8) ISPM 15 に基づく木製包装の燻蒸証明書。"
)

s5_de = (
    "Die Materialauswahl ist die Grundlage der Zuverlässigkeit von Eisenbahnbefestigungen. Federstahl für elastische Clips und Spannklemmen muss über 50 Jahre Lebensdauer ein konstantes elastisches Verhalten bieten, mit Ermüdungsbeständigkeit unter Millionen von Lastzyklen, Dimensionsstabilität über Temperaturextreme von -50°C bis +60°C und Beständigkeit gegen Spannungsrisskorrosion in feuchten und salzhaltigen Umgebungen.\n\n"
    "Für Pandrol-äquivalente e-clips und Vossloh-äquivalente Skl-Klemmen sind die dominanten Materialgüten 60Si2Mn (chinesisch GB/T 1222), 60SiCr7 (europäisch EN 10089), 55SiCr6 und 51CrV4.\n\n"
    "Das Standardprüfprotokoll für Eisenbahnbefestigungen folgt einem mehrstufigen Ansatz. Stufe 1 (Produktionsqualitätskontrolle) wird vom Hersteller an jeder Charge durchgeführt. Stufe 2 (Typprüfung) wird an Erstmustern oder jährlichen Requalifizierungsproben durchgeführt. Stufe 3 (Drittrüferzeugung) wird von SGS, Bureau Veritas, Intertek oder vom Kunden benannten Inspektoren am Verladeort durchgeführt.\n\n"
    "Die Qualitätskontrolldokumentation, die jeder Eisenbahnbefestigungssendung beiliegen muss, umfasst: (1) Materialprüfzeugnis gemäß EN 10204 3.1, (2) Typprüfbericht gemäß EN 13146-Serie oder AREMA-Portfolio, (3) Schichtdickenmessbericht pro Charge, (4) Maßprüfbericht mit Verweis auf die Kontrollzeichnung, (5) Salzsprühtest-Zertifikat, (6) Packliste mit Chargennummern, Brutto-/Nettogewicht, Containernummer und Siegelsnummer, (7) Ursprungszeugnis und (8) Begasungszertifikat für Holzverpackung gemäß ISPM 15."
)

s5_hi = (
    "सामग्री चयन रेलवे फास्टनर विश्वसनीयता का आधार है। लोचदार क्लिप और टेंशन क्लैम्प के लिए स्प्रिंग स्टील को 50 साल की सेवा जीवन के दौरान सुसंगत लोचदार व्यवहार प्रदान करना चाहिए, लाखों लोड चक्रों के तहत थकान सहनशीलता, -50°C से +60°C तक के तापमान चरम पर आयामी स्थिरता, और नम और खारे वातावरण में तनाव-जंग दरार के प्रतिरोध के साथ।\n\n"
    "Pandrol समकक्ष e-clips और Vossloh समकक्ष Skl क्लैम्प के लिए, प्रमुख सामग्री ग्रेड 60Si2Mn (चीनी GB/T 1222), 60SiCr7 (यूरोपीय EN 10089), 55SiCr6 और 51CrV4 हैं।\n\n"
    "रेलवे फास्टनर के लिए मानक परीक्षण प्रोटोकॉल एक स्तरीकृत दृष्टिकोण का पालन करता है। स्तर 1 (उत्पादन गुणवत्ता नियंत्रण) निर्माता द्वारा प्रत्येक बैच पर किया जाता है। स्तर 2 (प्रकार परीक्षण) पहले लेख या वार्षिक पुनः योग्यता नमूनों पर किया जाता है। स्तर 3 (तृतीय पक्ष साक्षी) SGS, Bureau Veritas, Intertek या ग्राहक द्वारा नियुक्त निरीक्षकों द्वारा लोडिंग बिंदु पर किया जाता है।\n\n"
    "गुणवत्ता नियंत्रण दस्तावेज जो प्रत्येक रेलवे फास्टनर शिपमेंट के साथ होना चाहिए: (1) EN 10204 3.1 के अनुसार सामग्री परीक्षण प्रमाणपत्र, (2) EN 13146 श्रृंखला या AREMA पोर्टफोलियो के अनुसार प्रकार परीक्षण रिपोर्ट, (3) प्रति बैच कोटिंग मोटाई माप रिपोर्ट, (4) नियंत्रण ड्राइंग के संदर्भ के साथ आयामी निरीक्षण रिपोर्ट, (5) साल्ट-स्प्रे परीक्षण प्रमाणपत्र, (6) बैच नंबर, सकल/शुद्ध वजन, कंटेनर नंबर और सील नंबर के साथ पैकिंग सूची, (7) मूल देश प्रमाणपत्र, और (8) ISPM 15 के अनुसार लकड़ी की पैकेजिंग के लिए धूमन प्रमाणपत्र।"
)

s5_body = t(s5_en, s5_zh, s5_es, s5_ar, s5_fr, s5_pt, s5_ru, s5_ja, s5_de, s5_hi)

print(f"Section 5: s5.en words: {len(s5_en.split())}")

# Save sections 4 and 5
output = {
    's4_heading': s4_heading,
    's4_body': s4_body,
    's5_heading': s5_heading,
    's5_body': s5_body,
}
with open('/tmp/railway_s45.json', 'w') as f:
    json.dump(output, f)
print("Saved sections 4-5")
