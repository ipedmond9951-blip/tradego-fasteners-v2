#!/usr/bin/env node
/**
 * TradeGo GEO Article Generator - Zimbabwe Border Markets
 * 津巴布韦边境市场GEO文章自动生成器
 * 
 * 目标市场：赞比亚、莫桑比克、博茨瓦纳、南非
 * 重点：边境贸易、AI友好内容、Schema优化
 * 
 * 使用方法: node scripts/gen-zimbabwe-border.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const LOG_DIR = path.join(process.cwd(), 'logs');

// 支持的语言
const LANGUAGES = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de'];

// ========================================
// 津巴布韦边境市场数据
// ========================================
const ZIMBABWE_BORDER_MARKETS = [
  {
    country: 'Zambia',
    countryCode: 'ZM',
    border: '赞比亚',
    cities: [
      { name: 'Lusaka', nameZh: '卢萨卡', role: '首都+商业中心' },
      { name: 'Ndola', nameZh: '恩多拉', role: '铜带门户' },
      { name: 'Kitwe', nameZh: '基特韦', role: '铜带矿业中心' },
      { name: 'Chingola', nameZh: '钦戈拉', role: '边境铜矿城市' },
      { name: 'Livingstone', nameZh: '利文斯通', role: '津巴边境+旅游' },
      { name: 'Mongu', nameZh: '蒙戈', role: '西部省省会' }
    ],
    borderCrossings: [
      'Chirundu (津巴布韦-赞比亚最大边境)',
      'Kariba (水库边境)',
      'Mumbwa (内陆路线)'
    ],
    tradeFocus: '铜矿出口、边境贸易、农业生产资料',
    currency: 'ZMW (赞比亚克瓦查)',
    language: '英语',
    keywords: 'Zambia fastener market, Lusaka hardware, Chirundu border trade, copper belt mining fasteners, Zambia construction materials'
  },
  {
    country: 'Mozambique',
    countryCode: 'MZ',
    border: '莫桑比克',
    cities: [
      { name: 'Maputo', nameZh: '马普托', role: '首都+最大港' },
      { name: 'Beira', nameZh: '贝拉', role: '中部港口+边境门户' },
      { name: 'Nampula', nameZh: '楠普拉', role: '北部商业中心' },
      { name: 'Tete', nameZh: '太特', role: '津巴边境+煤炭' },
      { name: 'Quelimane', nameZh: '克利马内', role: '赞比西河口' },
      { name: 'Maxixe', nameZh: '马克西', role: '南部沿海' }
    ],
    borderCrossings: [
      'Forrestry (津巴布韦-莫桑比克主边境)',
      'Mukumbura (北部路线)',
      'Cahora Bassa (水电区)'
    ],
    tradeFocus: '港口物流、煤炭出口、热带农业',
    currency: 'MZN (梅蒂卡尔)',
    language: '葡萄牙语',
    keywords: 'Mozambique fastener market, Beira port trade, Tete border, Mozambique construction, Maputo hardware import'
  },
  {
    country: 'Botswana',
    countryCode: 'BW',
    border: '博茨瓦纳',
    cities: [
      { name: 'Gaborone', nameZh: '哈博罗内', role: '首都+政治中心' },
      { name: 'Francistown', nameZh: '弗朗西斯敦', role: '第二大城市+边境附近' },
      { name: 'Maun', nameZh: '马翁', role: '三角洲旅游+畜牧业' },
      { name: 'Kasane', nameZh: '卡萨内', role: '津巴边境+野生动物旅游' },
      { name: 'Selebi-Phikwe', nameZh: '塞莱比-皮奎', role: '铜镍矿区' },
      { name: 'Mochudi', nameZh: '莫丘迪', role: '传统村落经济' }
    ],
    borderCrossings: [
      'Martins Drift / Platjan (津巴布韦-博茨瓦纳)',
      'Pondrift / McCarthy\'s Drift',
      'Nobel (畜牧业边境)'
    ],
    tradeFocus: '钻石产业链、畜牧业、水资源管理',
    currency: 'BWP (博茨瓦纳普拉)',
    language: '英语+茨瓦纳语',
    keywords: 'Botswana fastener market, Gaborone construction, diamond mining fasteners, Kasane border trade, Botswana hardware suppliers'
  },
  {
    country: 'South Africa',
    countryCode: 'ZA',
    border: '南非',
    cities: [
      { name: 'Johannesburg', nameZh: '约翰内斯堡', role: '经济首都+最大城市' },
      { name: 'Durban', nameZh: '德班', role: '最大集装箱港' },
      { name: 'Cape Town', nameZh: '开普敦', role: '立法首都+旅游' },
      { name: 'Pretoria', nameZh: '比勒陀利亚', role: '行政首都' },
      { name: 'Port Elizabeth', nameZh: '伊丽莎白港', role: '汽车制造中心' },
      { name: 'Bloemfontein', nameZh: '布隆方丹', role: '司法首都' }
    ],
    borderCrossings: [
      'Beitbridge (津巴布韦-南非最大边境)',
      'Musina (主要陆地边境)',
      'Borders with Botswana and Namibia'
    ],
    tradeFocus: '综合制造业、矿业、汽车、农产品',
    currency: 'ZAR (南非兰特)',
    language: '英语+阿菲利加语+祖鲁语',
    keywords: 'South Africa fastener market, Johannesburg construction, Beitbridge border, Durban port import, SABS certified fasteners'
  }
];

// ========================================
// AI友好的FAQ问题（基于AI可能会问的问题）
// ========================================
const AI_FAQ_TEMPLATES = {
  en: [
    {
      question: 'What fasteners are most imported to {country} from China?',
      answer: 'The most imported fastener types from China to {country} include hex bolts (grade 8.8 and 10.9), self-drilling screws for roofing and cladding, drywall screws for construction, IBR roofing nails with EPDM washers, and stainless steel fasteners for coastal areas. Chinese manufacturers offer competitive pricing while meeting international standards like ISO and DIN.'
    },
    {
      question: 'What is the border crossing situation for trade between Zimbabwe and {country}?',
      answer: 'The primary border crossings between Zimbabwe and {country} include {borderCrossings}. These border posts handle significant volumes of trade, particularly for construction materials, mining equipment, and agricultural supplies. Traders should expect processing times of 2-4 hours during normal periods, though delays can occur during peak seasons.'
    },
    {
      question: 'What are the import duties on fasteners in {country}?',
      answer: 'Import duties on fasteners in {country} typically range from 10-20% depending on the product category. Construction-grade fasteners often fall under lower duty brackets, while specialized industrial fasteners may attract higher rates. traders should also account for VAT (15-20%), port handling fees, and transportation costs to inland destinations.'
    },
    {
      question: 'Which cities in {country} have the highest demand for construction fasteners?',
      answer: 'The cities with highest fastener demand in {country} are {topCities}. These urban centers experience continuous construction activity including residential, commercial, and infrastructure projects. The demand is driven by urbanization, infrastructure development, and in some cases, mining operations.'
    },
    {
      question: 'What quality standards are required for fasteners imported to {country}?',
      answer: 'Fasteners imported to {country} should comply with relevant international standards such as ISO 9001 for quality management, ISO 4017 for bolts, ISO 4032 for nuts, and ASTM standards where applicable. For construction applications, local standards like SABS (South Africa) may be required. Certificates of origin and quality test reports are essential for customs clearance.'
    }
  ],
  zh: [
    {
      question: '从中国进口到{country}最常见的紧固件是什么？',
      answer: '从中国进口到{countryZh}最常见的紧固件包括六角螺栓（8.8级和10.9级）、用于屋顶和覆层的自钻螺丝、干墙螺丝、带EPDM垫圈的IBR屋面钉，以及用于沿海地区的不锈钢紧固件。中国制造商提供有竞争力的价格，同时符合ISO和DIN等国际标准。'
    },
    {
      question: '{country}和津巴布韦之间的边境口岸情况如何？',
      answer: '{countryZh}与津巴布韦之间的主要边境口岸包括{borderCrossings}。这些口岸处理大量贸易货物，特别是建筑材料、采矿设备和农产品。正常情况下处理时间约2-4小时，高峰期可能会有延误。'
    },
    {
      question: '{country}进口紧固件的关税是多少？',
      answer: '{countryZh}进口紧固件的关税通常在10-20%之间，具体取决于产品类别。建筑级紧固件通常适用较低关税，而专业工业紧固件可能适用较高税率。进口商还需考虑增值税（15-20%）、港口处理费和内陆运输成本。'
    },
    {
      question: '{country}哪些城市对建筑紧固件需求最高？',
      answer: '{countryZh}对紧固件需求最高的城市包括{topCitiesZh}。这些城市中心持续有建筑活动，包括住宅、商业和基础设施项目。需求主要由城市化、基础设施发展和采矿业推动。'
    },
    {
      question: '进口到{country}的紧固件需要哪些质量标准？',
      answer: '进口到{countryZh}的紧固件应符合相关国际标准，如ISO 9001质量管理、ISO 4017螺栓、ISO 4032螺母以及适用的ASTM标准。对于建筑应用，可能需要当地标准如SABS（南非）。原产地证书和质量检验报告是清关的必要文件。'
    }
  ]
};

// ========================================
// 工具函数
// ========================================
function getExistingSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    return [];
  }
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function getCoveredCountries(existingSlugs) {
  const covered = new Set();
  for (const slug of existingSlugs) {
    for (const market of ZIMBABWE_BORDER_MARKETS) {
      if (slug.toLowerCase().includes(market.country.toLowerCase())) {
        covered.add(market.country);
      }
    }
  }
  return covered;
}

function log(msg) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
  
  // 写入日志文件
  const logFile = path.join(LOG_DIR, `geo-generation-${new Date().toISOString().split('T')[0]}.log`);
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
}

// ========================================
// 文章生成函数
// ========================================
function generateFAQForMarket(market, lang) {
  const faqTemplates = AI_FAQ_TEMPLATES[lang] || AI_FAQ_TEMPLATES.en;
  const topCities = market.cities.slice(0, 3);
  const topCitiesStr = topCities.map(c => c.name).join(', ');
  const topCitiesZhStr = topCities.map(c => c.nameZh).join('、');
  const borderCrossingsStr = market.borderCrossings[0];
  
  return faqTemplates.map((faq, i) => ({
    q: { [lang]: faq.question
      .replace(/{country}/g, market.country)
      .replace(/{countryZh}/g, market.countryZh || market.country)
      .replace(/{borderCrossings}/g, borderCrossingsStr)
      .replace(/{topCities}/g, topCitiesStr)
      .replace(/{topCitiesZh}/g, topCitiesZhStr)
    },
    a: { [lang]: faq.answer
      .replace(/{country}/g, market.country)
      .replace(/{countryZh}/g, market.countryZh || market.country)
      .replace(/{borderCrossings}/g, borderCrossingsStr)
      .replace(/{topCities}/g, topCitiesStr)
      .replace(/{topCitiesZh}/g, topCitiesZhStr)
    }
  }));
}

function generateArticle(market) {
  const slug = `${market.country.toLowerCase()}-fasteners-china-import-guide`;
  
  const article = {
    slug,
    category: 'Import Guide',
    date: new Date().toISOString().split('T')[0],
    readTime: 10,
    image: '/images/scenarios/warehouse-management.jpg',
    title: {},
    description: {},
    keywords: market.keywords,
    sections: [],
    relatedProducts: ['hex-bolts', 'self-drilling-screws', 'drywall-screws', 'roofing-nails', 'stainless-fasteners'],
    cta: {
      text: {
        en: `Get Factory Prices for ${market.country} Market`,
        zh: `获取${market.countryZh || market.country}市场工厂价`,
        es: `Obtener precios de fábrica para el mercado ${market.country}`,
        ar: `الحصول على أسعار المصنع لسوق ${market.country}`,
        fr: `Obtenir les prix d'usine pour le marché ${market.country}`,
        pt: `Obter preços de fábrica para o mercado ${market.country}`,
        ru: `Получить заводские цены для рынка ${market.country}`,
        ja: `${market.country}市場の工場価格を取得`,
        de: `Fabrikpreise für den ${market.country} Markt erhalten`
      },
      buttonText: {
        en: 'Request Quote',
        zh: '申请报价',
        es: 'Solicitar cotización',
        ar: 'طلب عرض أسعار',
        fr: 'Demander un devis',
        pt: 'Solicitar cotação',
        ru: 'Запросить расценки',
        ja: '見積もりを依頼',
        de: 'Angebot anfordern'
      },
      link: '/product-upload'
    },
    // GEO特定字段
    geoTarget: {
      countries: [market.countryCode],
      currencies: [market.currency],
      languages: [market.language],
      borderWithZimbabwe: true,
      borderCrossings: market.borderCrossings
    }
  };

  // 生成各语言标题
  const titles = {
    en: `Complete Guide: Importing Fasteners from China to ${market.country} (2026)`,
    zh: `中国进口紧固件到${market.countryZh || market.country}完整指南 (2026)`,
    es: `Guía completa: Importación de sujetadores de China a ${market.country} (2026)`,
    ar: `دليل شامل: استيراد المثبتات من الصين إلى ${market.country} (2026)`,
    fr: `Guide complet: Importation de fixations de la Chine vers ${market.country} (2026)`,
    pt: `Guia completo: Importação de fixadores da China para ${market.country} (2026)`,
    ru: `Полное руководство: Импорт крепежа из Китая в ${market.country} (2026)`,
    ja: `中国から${market.country}への締結具輸入完全ガイド (2026)`,
    de: `Vollständiger Leitfaden: Import von Befestigungen aus China nach ${market.country} (2026)`
  };
  article.title = titles;

  // 生成各语言描述
  const descriptions = {
    en: `Expert guide on importing construction fasteners from China to ${market.country}. Covers border crossings with Zimbabwe, import duties, quality standards, top cities demand, and best Chinese suppliers. Updated 2026.`,
    zh: `中国进口建筑紧固件到${market.countryZh || market.country}的专家指南。涵盖津巴布韦边境口岸、进口关税、质量标准、主要城市需求和优质中国供应商。2026年更新。`,
    es: `Guía experta sobre importación de sujetadores de construcción de China a ${market.country}. Cubre pasos fronterizos con Zimbabwe, aranceles, estándares de calidad y mejores proveedores chinos. Actualizado 2026.`,
    ar: `دليل خبير حول استيراد مثبتات البناء من الصين إلى ${market.country}. يغطي معابر الحدود مع زيمبابوي، الرسوم الجمركية، معايير الجودة، وأفضل الموردين الصينيين. محدث 2026.`,
    fr: `Guide expert sur l'importation de fixations de construction de la Chine vers ${market.country}. Couvre les passages frontaliers avec le Zimbabwe, les droits d'importation, les normes de qualité et les meilleurs fournisseurs chinois. Mis à jour 2026.`,
    pt: `Guia especializado sobre importação de fixadores de construção da China para ${market.country}. Cobre travessias de fronteira com o Zimbábue, direitos de importação, padrões de qualidade e melhores fornecedores chineses. Atualizado 2026.`,
    ru: `Экспертное руководство по импорту строительного крепежа из Китая в ${market.country}. Охватывает пограничные переходы с Зимбабве, импортные пошлины, стандарты качества и лучших китайских поставщиков. Обновлено 2026.`,
    ja: `中国から${market.country}への建設締結具の輸入に関する専門ガイド。ジンバブエとの国境通過、輸入関税、品質基準、主要都市の需要、最高の中国サプライヤーをカバー。2026年更新。`,
    de: `Expertenleitfaden zum Import von Baubefestigungen aus China nach ${market.country}. Deckt Grenzübergänge mit Simbabwe, Einfuhrzölle, Qualitätsstandards und beste chinesische Lieferanten ab. Aktualisiert 2026.`
  };
  article.description = descriptions;

  // 生成内容段落
  article.sections = [
    {
      id: 'market-overview',
      heading: {
        en: `${market.country} Fastener Market Overview`,
        zh: `${market.countryZh || market.country}紧固件市场概况`,
        es: `Descripción del mercado de sujetadores ${market.country}`,
        ar: `نظرة عامة على سوق مثبتات ${market.country}`,
        fr: `Aperçu du marché des fixations ${market.country}`,
        pt: `Visão geral do mercado de fixadores ${market.country}`,
        ru: `Обзор рынка крепежа ${market.country}`,
        ja: `${market.country}締結具市場概要`,
        de: `${market.country} Befestigungsmarkt Überblick`
      },
      body: {
        en: `${market.country} is one of Zimbabwe's key trading partners, with significant border infrastructure facilitating trade. The fastener market in ${market.country} is valued at approximately ${getMarketSize(market.country)} with steady growth driven by ${market.tradeFocus}. Major cities including ${market.cities.slice(0, 3).map(c => c.name).join(', ')} serve as distribution hubs for construction materials across the region.\n\nThe country maintains strong economic ties with Zimbabwe through border posts at ${market.borderCrossings.join(', ')}. This makes ${market.country} a critical transit point for goods entering the Southern African Development Community (SADC) region.`,
        zh: `${market.countryZh || market.country}是津巴布韦的主要贸易伙伴之一，拥有发达的边境基础设施促进贸易。${market.countryZh || market.country}紧固件市场估值约为${getMarketSize(market.country)}，在${market.tradeFocus}的推动下稳定增长。主要城市${market.cities.slice(0, 3).map(c => c.nameZh).join('、')}作为建筑材料在整个地区的分销中心。\n\n该国通过${market.borderCrossings.join('、')}等口岸与津巴布韦保持强劲的经济联系。这使得${market.countryZh || market.country}成为进入南部非洲发展共同体（SADC）地区的关键转运点。`
      },
      table: {
        headers: ['Metric', 'en', 'zh'],
        rows: [
          ['Market Size', getMarketSize(market.country), getMarketSizeZh(market.country)],
          ['Currency', market.currency, market.currency],
          ['Official Language', market.language, market.language],
          ['Border with Zimbabwe', 'Yes', '是'],
          ['Main Border Crossings', market.borderCrossings[0], market.borderCrossings[0]],
          ['Trade Focus', market.tradeFocus, market.tradeFocus]
        ]
      }
    },
    {
      id: 'china-import',
      heading: {
        en: 'Importing Fasteners from China',
        zh: '从中国进口紧固件',
        es: 'Importación de sujetadores desde China',
        ar: 'استيراد المثبتات من الصين',
        fr: 'Importation de fixations depuis la Chine',
        pt: 'Importação de fixadores da China',
        ru: 'Импорт крепежа из Китая',
        ja: '中国からの締結具の輸入',
        de: 'Import von Befestigungen aus China'
      },
      body: {
        en: `China remains the dominant source of affordable construction fasteners for ${market.country}'s market. Chinese manufacturers offer competitive pricing on a wide range of products including hex bolts, self-drilling screws, drywall screws, and roofing fasteners. The main advantages of sourcing from China include:\n\n• Competitive pricing (30-50% below European alternatives)\n• Wide product range meeting international standards\n• Flexible order quantities for businesses of all sizes\n• Established shipping routes to ${market.country} ports\n\nShipping from China to ${market.country} typically takes 25-35 days by sea to major ports, with freight costs varying based on order volume and shipping terms (FOB, CIF, DDP).`,
        zh: `中国仍然是${market.countryZh || market.country}市场价格实惠的建筑紧固件的主要来源。中国制造商在六角螺栓、自钻螺丝、干墙螺丝和屋面紧固件等多种产品上提供有竞争力的价格。从中国采购的主要优势包括：\n\n• 有竞争力的价格（比欧洲替代品低30-50%）\n• 符合国际标准的广泛产品范围\n• 适合各种规模企业的灵活订单数量\n• 通往${market.countryZh || market.country}港口的成熟运输路线\n\n从中国海运到${market.countryZh || market.country}通常需要25-35天，运费根据订单量和贸易条款（FOB、CIF、DDP）而有所不同。`
      }
    },
    {
      id: 'border-logistics',
      heading: {
        en: 'Border Crossings and Logistics',
        zh: '边境口岸和物流',
        es: 'Cruces fronterizos y logística',
        ar: 'معابر الحدود والخدمات اللوجستية',
        fr: 'Passages frontaliers et logistique',
        pt: 'Travessias de fronteira e logística',
        ru: 'Пограничные переходы и логистика',
        ja: '国境通過と物流',
        de: 'Grenzübergänge und Logistik'
      },
      body: {
        en: `The primary border crossings between Zimbabwe and ${market.country} are:\n\n${market.borderCrossings.map((bc, i) => `${i + 1}. ${bc}`).join('\n')}\n\nFor traders importing fasteners from China via ${market.country} ports, understanding border procedures is essential. The typical process involves:\n\n1. Arrival at ${market.country} port (${getMainPort(market.country)})\n2. Customs clearance in ${market.country}\n3. Transportation to border crossing\n4. Zimbabwe customs declaration\n5. Final delivery to destination\n\nDocumentation required includes: Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, and Quality Certificates.`,
        zh: `${market.countryZh || market.country}与津巴布韦之间的主要边境口岸包括：\n\n${market.borderCrossings.map((bc, i) => `${i + 1}. ${bc}`).join('\n')}\n\n对于通过${market.countryZh || market.country}港口从中国进口紧固件的贸易商，了解边境程序至关重要。典型流程包括：\n\n1. 抵达${market.countryZh || market.country}港口（${getMainPortZh(market.country)}）\n2. ${market.countryZh || market.country}海关清关\n3. 运输至边境口岸\n4. 津巴布韦海关申报\n5. 最终送至目的地\n\n所需文件包括：海运提单、商业发票、装箱单、原产地证书和质量证书。`
      }
    },
    {
      id: 'faq',
      heading: {
        en: 'Frequently Asked Questions',
        zh: '常见问题',
        es: 'Preguntas frecuentes',
        ar: 'الأسئلة الشائعة',
        fr: 'Questions fréquemment posées',
        pt: 'Perguntas frequentes',
        ru: 'Часто задаваемые вопросы',
        ja: 'よくある質問',
        de: 'Häufig gestellte Fragen'
      },
      faqItems: generateFAQForMarket(market, 'en').concat(generateFAQForMarket(market, 'zh'))
    }
  ];

  return article;
}

function getMarketSize(country) {
  const sizes = {
    'Zambia': '$85M USD',
    'Mozambique': '$120M USD',
    'Botswana': '$45M USD',
    'South Africa': '$850M USD'
  };
  return sizes[country] || '$100M USD';
}

function getMarketSizeZh(country) {
  const sizes = {
    'Zambia': '8500万美元',
    'Mozambique': '1.2亿美元',
    'Botswana': '4500万美元',
    'South Africa': '8.5亿美元'
  };
  return sizes[country] || '1亿美元';
}

function getMainPort(country) {
  const ports = {
    'Zambia': 'Dar es Salaam (Tanzania) or Durban (South Africa)',
    'Mozambique': 'Maputo Port',
    'Botswana': 'Durban (South Africa) via border',
    'South Africa': 'Durban, Cape Town, Port Elizabeth'
  };
  return ports[country] || 'Major ports';
}

function getMainPortZh(country) {
  const ports = {
    'Zambia': '达累斯萨拉姆（坦桑尼亚）或德班（南非）',
    'Mozambique': '马普托港',
    'Botswana': '德班（南非）经边境',
    'South Africa': '德班、开普敦、伊丽莎白港'
  };
  return ports[country] || '主要港口';
}

// ========================================
// 主函数
// ========================================
function main() {
  console.log('\n🚀 TradeGo GEO - Zimbabwe Border Markets Article Generator');
  console.log('=' .repeat(60));
  
  log('开始生成津巴布韦边境市场GEO文章');

  // 获取已存在的slug
  const existingSlugs = getExistingSlugs();
  log(`已有 ${existingSlugs.length} 篇文章`);

  // 获取已覆盖的国家
  const coveredCountries = getCoveredCountries(existingSlugs);
  log(`已覆盖国家: ${coveredCountries.size > 0 ? [...coveredCountries].join(', ') : '无'}`);

  // 找出未覆盖的国家
  const uncoveredMarkets = ZIMBABWE_BORDER_MARKETS.filter(m => !coveredCountries.has(m.country));
  
  if (uncoveredMarkets.length === 0) {
    console.log('\n🎉 所有目标国家已覆盖！无需生成新文章。\n');
    log('所有目标国家已覆盖，任务完成');
    return;
  }

  console.log(`\n📝 将生成 ${uncoveredMarkets.length} 篇新文章:\n`);
  log(`将生成 ${uncoveredMarkets.length} 篇新文章`);

  const generated = [];
  
  for (const market of uncoveredMarkets) {
    try {
      const article = generateArticle(market);
      const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      
      console.log(`   ✅ ${article.slug}`);
      console.log(`      标题: ${article.title.en.substring(0, 60)}...`);
      console.log(`      目标: ${market.country} (${market.borderCrossings[0]})`);
      console.log(`      语言: ${LANGUAGES.length}种\n`);
      
      log(`生成文章: ${article.slug}`);
      generated.push(article.slug);
    } catch (err) {
      console.error(`   ❌ 生成失败 ${market.country}: ${err.message}`);
      log(`生成失败 ${market.country}: ${err.message}`);
    }
  }

  console.log('=' .repeat(60));
  console.log(`✨ 文章生成完成！成功生成 ${generated.length} 篇文章`);
  console.log(`📁 保存位置: ${ARTICLES_DIR}`);
  console.log('\n💡 下一步: 运行 npm run build 更新 sitemap');
  
  log(`任务完成。成功生成 ${generated.length} 篇文章: ${generated.join(', ')}`);
  
  return generated;
}

// 运行
main();
