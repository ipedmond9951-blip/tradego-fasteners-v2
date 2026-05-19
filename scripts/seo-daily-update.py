#!/usr/bin/env python3
"""SEO Daily Update Script - 2026-05-19"""
import json
import os

BASE = "/Users/zhangming/workspace/tradego-fasteners-v2"

# ============================================================
# PART 1: Fix image paths for 5 articles
# ============================================================
image_fixes = {
    "kenya-fastener-market-guide": "/images/articles/kenya-fastener-market-guide.jpg",
    "nigeria-fastener-market-guide": "/images/articles/nigeria-fastener-market-guide.jpg",
    "southern-africa-fastener-market-southafrica-botswana": "/images/articles/southern-africa-fastener-market-southafrica-botswana.jpg",
    "mozambique-hardware-supplier": "/images/articles/mozambique-hardware-supplier.jpg",
    "stainless-steel-fasteners-africa": "/images/articles/stainless-steel-fasteners-africa.jpg",
}

for slug, new_image in image_fixes.items():
    path = f"{BASE}/content/articles/{slug}.json"
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
        old_image = data.get('image', '')
        data['image'] = new_image
        with open(path, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Fixed image: {slug}")
        print(f"   {old_image} → {new_image}")
    else:
        print(f"❌ Missing: {slug}")

# ============================================================
# PART 2: Add FAQ sections to the 5 articles
# ============================================================
faq_data = {
    "kenya-fastener-market-guide": [
        {
            "q": {
                "en": "What are the import requirements for fasteners entering Kenya?",
                "zh": "紧固件进入肯尼亚的进口要求是什么？",
                "es": "¿Cuáles son los requisitos de importación para sujetadores en Kenia?",
                "fr": "Quels sont les besoins d'importation pour les fixations au Kenya?",
                "pt": "Quais são os requisitos de importação para fixadores no Quênia?"
            },
            "a": {
                "en": "Fasteners imported to Kenya must meet KEBS (Kenya Bureau of Standards) requirements. SONCAP (now replaced by DS443) certification is required. Common requirements include: ISO 9001 certified manufacturer, proper packaging with country of origin marking, and documentation including bill of lading, commercial invoice, and certificate of conformity.",
                "zh": "进口到肯尼亚的紧固件必须符合KEBS（肯尼亚标准局）要求。需要DS443认证。常见要求包括：ISO 9001认证制造商、带有原产国标记的正确包装，以及提单、商业发票和合格证书等文件。",
                "es": "Deben cumplir requisitos KEBS y DS443.",
                "fr": "Doivent respecter les exigences KEBS et DS443.",
                "pt": "Devem atender aos requisitos KEBS e DS443."
            }
        },
        {
            "q": {
                "en": "What is the duty rate for fasteners imported into Kenya?",
                "zh": "进口紧固件到肯尼亚的关税税率是多少？",
                "es": "¿Cuál es la tasa de derechos para sujetadores importados a Kenia?",
                "fr": "Quel est le taux de droits pour les fixations importées au Kenya?",
                "pt": "Qual é a taxa de importação para fixadores importados para o Quênia?"
            },
            "a": {
                "en": "Kenya imports fasteners under HS Code 7318 at a duty rate of 25% CIF plus 16% VAT. East African Community (EAC) partner states enjoy duty-free access. Construction-grade fasteners typically fall under subheadings 7318.15 to 7318.19 with varying rates depending on type (bolts, screws, nuts, washers).",
                "zh": "肯尼亚进口紧固件的海关编码为7318，关税为CIF价的25%加16%增值税。东非共同体成员国享受免税待遇。建筑级紧固件通常归入7318.15至7318.19子目，根据类型（螺栓、螺丝、螺母、垫圈）不同税率不同。",
                "es": "Tasa de derechos del 25% CIF más 16% IVA.",
                "fr": "Droit de 25% CIF plus 16% TVA.",
                "pt": "Taxa de importação de 25% CIF mais 16% IVA."
            }
        },
        {
            "q": {
                "en": "Which Kenyan cities have the highest demand for construction fasteners?",
                "zh": "肯尼亚哪些城市对建筑紧固件需求最高？",
                "es": "¿Qué ciudades kenianas tienen mayor demanda de sujetadores de construcción?",
                "fr": "Quelles villes kényanes ont la plus forte demande en fixations de construction?",
                "pt": "Quais cidades quenianas têm maior demanda por fixadores de construção?"
            },
            "a": {
                "en": "Nairobi leads with 40% of national fastener demand driven by commercial and residential construction. Mombasa follows at 20% focused on port infrastructure and coastal projects. Nakuru, Eldoret, and Kisumu account for remaining demand across agricultural and light industrial sectors. The SGR (Standard Gauge Railway) corridor projects continue to drive specialized fastener demand.",
                "zh": "内罗毕以40%的全国紧固件需求领先，由商业和住宅建设驱动。莫尔巴巴占20%，专注于港口基础设施和沿海项目。纳库鲁、埃尔多雷特和基苏木占剩余需求，涵盖农业和轻工业部门。标准轨距铁路走廊项目继续推动专业紧固件需求。",
                "es": "Nairobi lidera con 40%, Mombasa 20%.",
                "fr": "Nairobi dirige avec 40%, Mombasa 20%.",
                "pt": "Nairóbi lidera com 40%, Mombasa 20%."
            }
        }
    ],
    "nigeria-fastener-market-guide": [
        {
            "q": {
                "en": "What certification is required to import fasteners into Nigeria?",
                "zh": "进口紧固件到尼日利亚需要什么认证？",
                "es": "¿Qué certificación se requiere para importar sujetadores a Nigeria?",
                "fr": "Quelle certification est requise pour importer des fixations au Nigeria?",
                "pt": "Que certificação é necessária para importar fixadores para a Nigéria?"
            },
            "a": {
                "en": "Nigeria requires SONCAP (Standard Organization of Nigeria Conformity Assessment Program) certification for fastener imports. The process involves: (1) Product category determination, (2) Testing at SON-approved laboratory, (3) Application submission with test reports, (4) Physical inspection of goods, (5) SONCAP certificate issuance. Lead times typically range 2-4 weeks.",
                "zh": "尼日利亚要求紧固件进口获得SONCAP（尼日利亚标准组织符合性评估计划）认证。流程包括：产品类别确定、在SON认可实验室测试、提交测试报告申请、实物检验、SONCAP证书签发。通常需要2-4周。",
                "es": "Requiere certificación SONCAP, proceso de 2-4 semanas.",
                "fr": "Nécessite certification SONCAP, processus de 2-4 semaines.",
                "pt": "Requer certificação SONCAP, processo de 2-4 semanas."
            }
        },
        {
            "q": {
                "en": "What is the import duty rate for fasteners in Nigeria?",
                "zh": "尼日利亚紧固件的进口关税税率是多少？",
                "es": "¿Cuál es la tasa de derechos de importación para sujetadores en Nigeria?",
                "fr": "Quel est le taux de droits d'importation pour les fixations au Nigeria?",
                "pt": "Qual é a taxa de importação para fixadores na Nigéria?"
            },
            "a": {
                "en": "Nigeria's import duty for fasteners (HS Code 7318) ranges from 10% to 35% depending on type and end-use. Construction fasteners typically face 20% duty plus 7.5% levy and 7.5% CID. Industrial-grade fasteners may qualify for lower rates under the Nigeria Industrial Revolution Plan (NIRP). All imports attract 7.5% VAT.",
                "zh": "尼日利亚紧固件进口关税（海关编码7318）根据类型和最终用途从10%到35%不等。建筑紧固件通常面临20%关税加7.5% levy和7.5%CID。所有进口商品还需缴纳7.5%增值税。",
                "es": "Derechos del 20% más levy 7.5% y CID 7.5%.",
                "fr": "Droits de 20% plus levy 7.5% et CID 7.5%.",
                "pt": "Imposto de 20% mais levy 7.5% e CID 7.5%."
            }
        },
        {
            "q": {
                "en": "Which ports in Nigeria handle the most fastener imports?",
                "zh": "尼日利亚哪个港口处理最多的紧固件进口？",
                "es": "¿Qué puertos en Nigeria manejan más importaciones de sujetadores?",
                "fr": "Quels ports au Nigeria manient le plus d'importations de fixations?",
                "pt": "Quais portos na Nigéria manuseiam mais importações de fixadores?"
            },
            "a": {
                "en": "Apapa Port in Lagos handles over 60% of Nigeria's fastener imports due to its proximity to the industrial zones of Lagos and Ogun states. Tincan Island Port handles specialized fastener shipments. The Calabar Port serves the eastern Nigerian market. Port congestion at Apapa remains a challenge with average dwell times of 2-3 weeks.",
                "zh": "拉各斯的阿帕帕港处理超过60%的尼日利亚紧固件进口，因为它靠近拉各斯和奥贡州的工业区。廷坎岛港处理专业紧固件运输。卡拉巴尔港为尼日利亚东部市场服务。阿帕帕港拥堵是一个挑战，平均停留时间为2-3周。",
                "es": "Puerto Apapa maneja 60% de importaciones.",
                "fr": "Le port d'Apapa traite 60% des importations.",
                "pt": "Porto Apapa manuseia 60% das importações."
            }
        }
    ],
    "southern-africa-fastener-market-southafrica-botswana": [
        {
            "q": {
                "en": "What fastener standards are used in South Africa and Botswana?",
                "zh": "南非和博茨瓦纳使用什么紧固件标准？",
                "es": "¿Qué estándares de sujetadores se usan en Sudáfrica y Botsuana?",
                "fr": "Quelles normes de fixations sont utilisées en Afrique du Sud et au Botswana?",
                "pt": "Quais padrões de fixadores são usados na África do Sul e Botswana?"
            },
            "a": {
                "en": "South Africa uses SABS (South African Bureau of Standards) and ISO standards. Most construction fasteners comply with SANS 935 / ISO 4014 for bolts and SANS 924 / ISO 4032 for nuts. Botswana follows SABS standards due to customs union agreement. For mining applications, SANS 25347 (ISO 2380) applies. ASTM standards are also accepted for American equipment installations.",
                "zh": "南非使用SABS（南非标准局）和ISO标准。大多数建筑紧固件符合SANS 935/ISO 4014（螺栓）和SANS 924/ISO 4032（螺母）。博茨瓦纳因关税同盟协议遵循SABS标准。采矿应用适用SANS 25347。ASTM标准也适用于美国设备安装。",
                "es": "Usan estándares SABS e ISO, aceptando también ASTM.",
                "fr": "Utilisent les normes SABS et ISO, acceptant aussi ASTM.",
                "pt": "Usam padrões SABS e ISO, aceitando também ASTM."
            }
        },
        {
            "q": {
                "en": "What is the duty rate for fasteners in South Africa under the SADC trade agreement?",
                "zh": "SADC贸易协议下南非紧固件的关税税率是多少？",
                "es": "¿Cuál es la tasa de derechos para sujetadores en Sudáfrica bajo el acuerdo comercial SADC?",
                "fr": "Quel est le taux de droits pour les fixations en Afrique du Sud dans le cadre de l'accord commercial SADC?",
                "pt": "Qual é a taxa de importação para fixadores na África do Sul sob o acordo comercial SADC?"
            },
            "a": {
                "en": "SADC (Southern African Development Community) members including South Africa, Botswana, Namibia, and Mozambique enjoy reduced tariff rates under the SADC Trade Protocol. China-origin fasteners typically face 30% duty (EU Partnership rate lower at 15%). SADC intra-regional trade enjoys rates as low as 5-10% for certified products. Non-SADC imports from China face anti-dumping duties of up to 25%.",
                "zh": "包括南非、博茨瓦纳、纳米比亚和莫桑比克在内的SADC成员根据SADC贸易议定书享受降低的关税税率。中国原产紧固件通常面临30%关税（欧盟伙伴关系税率较低为15%）。SADC区域内贸易认证产品税率低至5-10%。来自中国的非SADC进口面临高达25%的反倾销税。",
                "es": "Tarifas reducidas SADC del 5-10% para productos certificados.",
                "fr": "Tarifs réduits SADC de 5-10% pour produits certifiés.",
                "pt": "Taxas reduzidas SADC de 5-10% para produtos certificados."
            }
        },
        {
            "q": {
                "en": "How does the Lobito Corridor affect fastener logistics to Botswana?",
                "zh": "洛比托走廊如何影响博茨瓦纳的紧固件物流？",
                "es": "¿Cómo afecta el Corredor de Lobito a la logística de sujetadores a Botsuana?",
                "fr": "Comment le Corridor de Lobito affecte-t-il la logistique des fixations vers le Botswana?",
                "pt": "Como o Corredor de Lobito afeta a logística de fixadores para Botswana?"
            },
            "a": {
                "en": "The Lobito Corridor (Angola-Zambia-DRC railway) is transforming Southern African logistics. Botswana now receives fasteners via improved routes through Walvis Bay (Namibia) reducing transit from China by 5-7 days compared to traditional Durban routes. This corridor benefits mining projects in the Kgalagadi region requiring high-strength structural fasteners.",
                "zh": "洛比托走廊（安哥拉-赞比亚-刚果民主共和国铁路）正在改变南非物流。博茨瓦纳现在通过鲸湾港（纳米比亚）改善的路线接收紧固件，与传统德班路线相比，从中国转运时间减少5-7天。该走廊有利于卡加哈拉迪地区需要高强度结构紧固件的采矿项目。",
                "es": "Reduce tránsito desde China en 5-7 días vía Walvis Bay.",
                "fr": "Réduit le transit depuis la Chine de 5-7 jours via Walvis Bay.",
                "pt": "Reduz trânsito da China em 5-7 dias via Walvis Bay."
            }
        }
    ],
    "mozambique-hardware-supplier": [
        {
            "q": {
                "en": "What are the import requirements for fasteners entering Mozambique?",
                "zh": "进口紧固件到莫桑比克有什么要求？",
                "es": "¿Cuáles son los requisitos de importación para sujetadores que ingresan a Mozambique?",
                "fr": "Quelles sont les exigences d'importation pour les fixations entrant au Mozambique?",
                "pt": "Quais são os requisitos de importação para fixadores entrando em Moçambique?"
            },
            "a": {
                "en": "Mozambique requires INNOQ (Instituto Nacional de Normalização e Qualidade) compliance for fastener imports. Documentation includes: Certificate of Origin, Bill of Lading, Commercial Invoice, and Packing List. All fasteners must have Portuguese language labeling. Port of Maputo handles 70% of fastener imports; Beira Port serves central regions.",
                "zh": "莫桑比克要求进口紧固件符合INNOQ（国家标准和质量研究所）要求。文件包括：原产地证书、提单、商业发票和装箱单。所有紧固件必须使用葡萄牙语标签。马普托港处理70%的紧固件进口；贝拉港服务中部地区。",
                "es": "Requiere cumplimiento INNOQ, etiquetado en portugués.",
                "fr": "Exige conformité INNOQ, étiquetage en portugais.",
                "pt": "Requer conformidade INNOQ, rotulagem em português."
            }
        },
        {
            "q": {
                "en": "What fastener types are most needed for Mozambique construction projects?",
                "zh": "莫桑比克建筑项目最需要哪些类型的紧固件？",
                "es": "¿Qué tipos de sujetadores son más necesarios para proyectos de construcción en Mozambique?",
                "fr": "Quels types de fixations sont les plus nécessaires pour les projets de construction au Mozambique?",
                "pt": "Quais tipos de fixadores são mais necessários para projetos de construção em Moçambique?"
            },
            "a": {
                "en": "Mozambique's construction sector demands: hot-dip galvanized bolts for coastal projects (Maputo, Beira, Pemba due to salt exposure), high-tensile structural bolts for bridge and port construction, stainless steel 316 for marine environments, and metric thread fasteners for Chinese and European equipment installations. The MPDC and ProSavana agricultural projects drive demand for Grade 8.8 structural fasteners.",
                "zh": "莫桑比克建筑业需求包括：沿海项目（马普托、贝拉、彭巴因盐分暴露）的热浸镀锌螺栓、桥梁和港口建设的高强度结构螺栓、海洋环境用不锈钢316，以及中国和欧洲设备安装的公制螺纹紧固件。",
                "es": "Pernos galvanizados en caliente para zonas costeras.",
                "fr": "Boulons galvanisés à chaud pour les zones côtières.",
                "pt": "Parafusos galvanizados a quente para zonas costeiras."
            }
        },
        {
            "q": {
                "en": "What is the import duty for fasteners in Mozambique?",
                "zh": "莫桑比克紧固件的进口关税是多少？",
                "es": "¿Cuál es el derecho de importación para sujetadores en Mozambique?",
                "fr": "Quel est le droit d'importation pour les fixations au Mozambique?",
                "pt": "Qual é a taxa de importação para fixadores em Moçambique?"
            },
            "a": {
                "en": "Mozambique applies a 7.5% import duty on fasteners under HS Code 7318 (SADC rate). An additional 17% VAT applies. Industrial inputs may qualify for duty exemptions under the Industrial Free Zone regime. South Africa and SADC origin goods benefit from preferential rates of 2.5-5% under bilateral trade agreements.",
                "zh": "莫桑比克对海关编码7318下的紧固件征收7.5%进口关税（SADC税率）。另加17%增值税。工业投入品可根据工业自由区制度获得关税豁免。南非和SADC原产货物根据双边贸易协定享受2.5-5%的优惠税率。",
                "es": "Derecho del 7.5% más IVA 17%, tasa SADC.",
                "fr": "Droit de 7.5% plus TVA 17%, taux SADC.",
                "pt": "Imposto de 7.5% mais IVA 17%, taxa SADC."
            }
        }
    ],
    "stainless-steel-fasteners-africa": [
        {
            "q": {
                "en": "What is the difference between 304 and 316 stainless steel fasteners for Africa?",
                "zh": "304和316不锈钢紧固件在非洲有什么区别？",
                "es": "¿Cuál es la diferencia entre los sujetadores de acero inoxidable 304 y 316 para África?",
                "fr": "Quelle est la différence entre les fixations en acier inoxydable 304 et 316 pour l'Afrique?",
                "pt": "Qual é a diferença entre fixadores de aço inoxidável 304 e 316 para África?"
            },
            "a": {
                "en": "304 stainless steel offers excellent corrosion resistance for inland applications and light coastal areas (50km+ from sea). 316 stainless steel contains molybdenum for superior chloride resistance making it essential for beachfront properties, swimming pools, docks, and coastal industrial applications in Africa. 316 costs 30-40% more but lasts 3-4x longer in marine environments.",
                "zh": "304不锈钢为内陆应用和轻度沿海地区（离海50公里以上）提供优异的耐腐蚀性。316不锈钢含钼，具有卓越的氯化物抵抗力，对非洲海滨房产、游泳池、码头和沿海工业应用至关重要。316成本高30-40%，但在海洋环境中寿命长3-4倍。",
                "es": "316 con molibdeno, 30-40% más costoso pero 3-4x más duradero en ambientes marinos.",
                "fr": "316 au molybdène, 30-40% plus cher mais 3-4x plus durable en environnement marin.",
                "pt": "316 com molibdênio, 30-40% mais caro mas 3-4x mais durável em ambientes marinhos."
            }
        },
        {
            "q": {
                "en": "Which African countries have the highest demand for stainless steel fasteners?",
                "zh": "哪些非洲国家对不锈钢紧固件需求最高？",
                "es": "¿Qué países africanos tienen mayor demanda de sujetadores de acero inoxidable?",
                "fr": "Quels pays africains ont la plus forte demande en fixations en acier inoxydable?",
                "pt": "Quais países africanos têm maior demanda por fixadores de aço inoxidável?"
            },
            "a": {
                "en": "South Africa leads with 45% of African stainless steel fastener demand driven by mining, chemical processing, and coastal infrastructure. Egypt follows at 20% for petrochemical applications. Mauritius and Seychelles drive premium coastal project demand. Kenya and Tanzania require stainless fasteners for food processing and pharmaceutical industries under EU export requirements.",
                "zh": "南非以45%的非洲不锈钢紧固件需求领先，由采矿、化工加工和沿海基础设施驱动。埃及占20%用于石化应用。毛里求斯和塞舌尔推动优质沿海项目需求。肯尼亚和坦桑尼亚因欧盟出口要求需要食品加工和制药行业用不锈钢紧固件。",
                "es": "Sudáfrica lidera con 45%, Egipto 20%, Mauricio y Seychelles para proyectos costeros.",
                "fr": "L'Afrique du Sud mène avec 45%, l'Égypte 20%.",
                "pt": "África do Sul lidera com 45%, Egito 20%."
            }
        },
        {
            "q": {
                "en": "Are stainless steel fasteners cost-effective for African mining applications?",
                "zh": "不锈钢紧固件在非洲采矿应用中是否具有成本效益？",
                "es": "¿Los sujetadores de acero inoxidable son rentables para aplicaciones mineras africanas?",
                "fr": "Les fixations en acier inoxydable sont-elles rentables pour les applications minières africaines?",
                "pt": "Fixadores de aço inoxidável são econômicos para aplicações de mineração africana?"
            },
            "a": {
                "en": "Stainless steel fasteners in African mines cost 2-3x more upfront but provide significant long-term savings. Copper belt mining in Zambia and DRC requires 316 stainless due to acidic water exposure. South African gold and platinum mines use 304 stainless for underground infrastructure. The reduced maintenance, longer replacement intervals, and elimination of rust contamination make stainless steel cost-effective in high-humidity mining environments.",
                "zh": "非洲矿山不锈钢紧固件前期成本高2-3倍，但提供显著的长期节省。赞比亚和刚果民主共和国的铜带采矿因酸性水暴露需要316不锈钢。南非金矿和铂矿在地下基础设施中使用304不锈钢。在高湿度采矿环境中，减少维护、更长的更换间隔和消除锈蚀污染使不锈钢具有成本效益。",
                "es": "Costo 2-3x mayor inicial pero ahorros significativos a largo plazo.",
                "fr": "Coût 2-3x plus élevé initialement mais économies significatives à long terme.",
                "pt": "Custo 2-3x maior inicial mas economias significativas a longo prazo."
            }
        }
    ]
}

for slug, faqs in faq_data.items():
    path = f"{BASE}/content/articles/{slug}.json"
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
        if not data.get('faq') or len(data.get('faq', [])) == 0:
            data['faq'] = faqs
            with open(path, 'w') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ Added {len(faqs)} FAQs: {slug}")
        else:
            print(f"⏭️  Skipped {slug} (already has {len(data.get('faq', []))} FAQs)")
    else:
        print(f"❌ Missing article: {slug}")

# ============================================================
# PART 3: Fix meta descriptions > 160 chars
# ============================================================
meta_fixes = {
    "anchor-bolts-foundation-guide.json": "Complete anchor bolt guide for African construction: types, sizing, embedding, and code compliance for foundations in Sub-Saharan Africa.",
    "anchor-bolts-selection-guide.json": "Expert guide to selecting anchor bolts: cast-in, post-installed, concrete vs masonry anchors for African building projects.",
    "automotive-commercial-vehicle-fasteners.json": "Automotive and commercial vehicle fasteners: wheel bolts, hub bolts, structural body fasteners for trucks and buses in Africa.",
    "bolt-markings-identify-grade.json": "Learn to read bolt grade markings: metric and imperial identification for 8.8, 10.9, 12.9 bolts in African industrial applications."
}

for filename, new_desc in meta_fixes.items():
    path = f"{BASE}/content/articles/{filename}"
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
        old_desc = data.get('metaDescription', '')
        data['metaDescription'] = new_desc
        with open(path, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Fixed meta description: {filename}")
        print(f"   ({len(old_desc)} chars → {len(new_desc)} chars)")
    else:
        print(f"❌ Missing: {filename}")

print("\n=== SEO Daily Update Complete ===")
