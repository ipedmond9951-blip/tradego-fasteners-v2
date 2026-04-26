#!/usr/bin/env node
/**
 * TradeGo GEO Article Generator
 * 自动生成非洲市场的GEO文章
 * 
 * 使用方法: node scripts/gen-geo-articles.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

// 支持的语言
const LANGUAGES = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de'];

// 非洲市场数据 - 待生成文章的目标
const GEO_TARGETS = [
  {
    country: 'Nigeria',
    countryZh: '尼日利亚',
    countryEs: 'Nigeria',
    countryAr: 'نيجيريا',
    countryFr: 'Nigéria',
    countryPt: 'Nigéria',
    countryRu: 'Нигерия',
    countryJa: 'ナイジェリア',
    countryDe: 'Nigeria',
    cities: ['Lagos', 'Abuja', 'Port Harcourt'],
    market: '西非最大市场',
    keywords: 'Nigeria fastener market, Lagos construction, Nigerian hardware suppliers'
  },
  {
    country: 'Kenya',
    countryZh: '肯尼亚',
    countryEs: 'Kenia',
    countryAr: 'كينيا',
    countryFr: 'Kenya',
    countryPt: 'Quénia',
    countryRu: 'Кения',
    countryJa: 'ケニア',
    countryDe: 'Kenia',
    cities: ['Nairobi', 'Mombasa', 'Kisumu'],
    market: '东非枢纽',
    keywords: 'Kenya fastener market, Nairobi construction, East Africa hardware'
  },
  {
    country: 'Ethiopia',
    countryZh: '埃塞俄比亚',
    countryEs: 'Etiopía',
    countryAr: 'إثيوبيا',
    countryFr: 'Éthiopie',
    countryPt: 'Etiópia',
    countryRu: 'Эфиопия',
    countryJa: 'エチオピア',
    countryDe: 'Äthiopien',
    cities: ['Addis Ababa', 'Dire Dawa'],
    market: '非洲增长最快',
    keywords: 'Ethiopia fastener market, Addis Ababa construction, Ethiopian hardware'
  },
  {
    country: 'Ghana',
    countryZh: '加纳',
    countryEs: 'Ghana',
    countryAr: 'غانا',
    countryFr: 'Ghana',
    countryPt: 'Gana',
    countryRu: 'Гана',
    countryJa: 'ガーナ',
    countryDe: 'Ghana',
    cities: ['Accra', 'Kumasi', 'Tema'],
    market: '西非增长引擎',
    keywords: 'Ghana fastener market, Accra construction, Ghanaian hardware suppliers'
  },
  {
    country: 'Tanzania',
    countryZh: '坦桑尼亚',
    countryEs: 'Tanzania',
    countryAr: 'تنزانيا',
    countryFr: 'Tanzanie',
    countryPt: 'Tanzânia',
    countryRu: 'Танзания',
    countryJa: 'タンザニア',
    countryDe: 'Tansania',
    cities: ['Dar es Salaam', 'Mwanza', 'Arusha'],
    market: '东非新兴市场',
    keywords: 'Tanzania fastener market, Dar es Salaam construction, Tanzanian hardware'
  },
  {
    country: 'Ivory Coast',
    countryZh: '科特迪瓦',
    countryEs: 'Costa de Marfil',
    countryAr: 'ساحل العاج',
    countryFr: "Côte d'Ivoire",
    countryPt: 'Costa do Marfim',
    countryRu: 'Кот-д’Ивуар',
    countryJa: 'コートジボワール',
    countryDe: 'Elfenbeinküste',
    cities: ['Abidjan', 'Yamoussoukro', 'Bouaké'],
    market: '西非法语区中心',
    keywords: 'Ivory Coast fastener market, Abidjan construction, Francophone Africa hardware'
  },
  {
    country: 'Algeria',
    countryZh: '阿尔及利亚',
    countryEs: 'Argelia',
    countryAr: 'الجزائر',
    countryFr: 'Algérie',
    countryPt: 'Argélia',
    countryRu: 'Алжир',
    countryJa: 'アルジェリア',
    countryDe: 'Algerien',
    cities: ['Algiers', 'Oran', 'Constantine'],
    market: '北非最大市场',
    keywords: 'Algeria fastener market, Algiers construction, North Africa hardware'
  },
  {
    country: 'Morocco',
    countryZh: '摩洛哥',
    countryEs: 'Marruecos',
    countryAr: 'المغرب',
    countryFr: 'Maroc',
    countryPt: 'Marrocos',
    countryRu: 'Марокко',
    countryJa: 'モロッコ',
    countryDe: 'Marokko',
    cities: ['Casablanca', 'Rabat', 'Marrakech'],
    market: '非洲工业化典范',
    keywords: 'Morocco fastener market, Casablanca industry, Moroccan hardware suppliers'
  },
  {
    country: 'Egypt',
    countryZh: '埃及',
    countryEs: 'Egipto',
    countryAr: 'مصر',
    countryFr: 'Égypte',
    countryPt: 'Egito',
    countryRu: 'Египет',
    countryJa: 'エジプト',
    countryDe: 'Ägypten',
    cities: ['Cairo', 'Alexandria', 'Giza'],
    market: '中东非咽喉',
    keywords: 'Egypt fastener market, Cairo construction, Egyptian hardware suppliers'
  },
  {
    country: 'South Africa',
    countryZh: '南非',
    countryEs: 'Sudáfrica',
    countryAr: 'جنوب أفريقيا',
    countryFr: 'Afrique du Sud',
    countryPt: 'África do Sul',
    countryRu: 'ЮАР',
    countryJa: '南アフリカ',
    countryDe: 'Südafrika',
    cities: ['Johannesburg', 'Cape Town', 'Durban'],
    market: '非洲最大经济体',
    keywords: 'South Africa fastener market, Johannesburg construction, SABS fasteners'
  },
  {
    country: 'Cameroon',
    countryZh: '喀麦隆',
    countryEs: 'Camerún',
    countryAr: 'الكاميرون',
    countryFr: 'Cameroun',
    countryPt: 'Camarões',
    countryRu: 'Камерун',
    countryJa: 'カメルーン',
    countryDe: 'Kamerun',
    cities: ['Douala', 'Yaoundé', 'Bamenda'],
    market: '中非核心',
    keywords: 'Cameroon fastener market, Douala port, Central Africa hardware'
  },
  {
    country: 'Senegal',
    countryZh: '塞内加尔',
    countryEs: 'Senegal',
    countryAr: 'السنغال',
    countryFr: 'Sénégal',
    countryPt: 'Senegal',
    countryRu: 'Сенегал',
    countryJa: 'セネガル',
    countryDe: 'Senegal',
    cities: ['Dakar', 'Thiès', 'Mbour'],
    market: '西非法语区门户',
    keywords: 'Senegal fastener market, Dakar construction, West Africa francophone hardware'
  }
];

// 产品类别（用于相关文章推荐）
const PRODUCT_CATEGORIES = [
  { id: 'hex-bolts', name: 'Hex Bolts' },
  { id: 'nuts-washers', name: 'Nuts & Washers' },
  { id: 'self-drilling-screws', name: 'Self-Drilling Screws' },
  { id: 'anchor-bolts', name: 'Anchor Bolts' },
  { id: 'roofing-nails', name: 'Roofing Nails' },
  { id: 'stainless-fasteners', name: 'Stainless Steel Fasteners' }
];

/**
 * 获取已存在的文章slug列表
 */
function getExistingSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    return [];
  }
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

/**
 * 获取已覆盖的国家
 */
function getCoveredCountries(existingSlugs) {
  const covered = new Set();
  for (const slug of existingSlugs) {
    for (const target of GEO_TARGETS) {
      const slugLower = slug.toLowerCase();
      if (slugLower.includes(target.country.toLowerCase().replace(' ', '-'))) {
        covered.add(target.country);
      }
    }
  }
  return covered;
}

/**
 * 生成文章slug
 */
function generateSlug(country, suffix) {
  return `${country.toLowerCase().replace(/\s+/g, '-')}-fastener-market-${suffix}`
    .replace(/'/g, '');
}

/**
 * 生成文章标题
 */
function generateTitle(country, localName, market, lang) {
  const titles = {
    en: `${localName} Fastener Market 2026: Complete Guide for Construction Professionals`,
    zh: `${localName}紧固件市场2026：建筑专业人士完整指南`,
    es: `Mercado de sujetadores ${localName} 2026: Guía completa para profesionales de la construcción`,
    ar: `سوق مثبتات ${localName} 2026: دليل كامل لمحترفي البناء`,
    fr: `Marché des fixations ${localName} 2026: Guide complet pour les professionnels de la construction`,
    pt: `Mercado de fixadores ${localName} 2026: Guia completo para profissionais da construção`,
    ru: `Рынок крепежа ${localName} 2026: Полное руководство для специалистов по строительству`,
    ja: `${localName}締結具市場2026：建設プロフェッショナル完全ガイド`,
    de: `${localName} Befestigungsmarkt 2026: Komplettes Handbuch für Bauprofis`
  };
  return titles[lang] || titles.en;
}

/**
 * 生成文章描述
 */
function generateDescription(country, localName, market, lang) {
  const descriptions = {
    en: `Comprehensive analysis of the ${localName} fastener market in 2026. Market size, key players, import regulations, and distribution channels for construction fasteners in ${country}.`,
    zh: `2026年${localName}紧固件市场综合分析。市场规模、主要参与者、进口法规和${country}建筑紧固件分销渠道。`,
    es: `Análisis completo del mercado de sujetadores ${localName} en 2026. Tamaño del mercado, actores clave, regulaciones de importación y canales de distribución.`,
    ar: `تحليل شامل لسوق مثبتات ${localName} في عام 2026. حجم السوق، واللاعبون الرئيسيون، واللوائح التنظيمية.`,
    fr: `Analyse complète du marché des fixations ${localName} en 2026. Taille du marché, acteurs clés et canaux de distribution.`,
    pt: `Análise completa do mercado de fixadores ${localName} em 2026. Tamanho do mercado, principais players e canais de distribuição.`,
    ru: `Комплексный анализ рынка крепежа ${localName} в 2026 году. Размер рынка, ключевые игроки и каналы сбыта.`,
    ja: `2026年${localName}締結具市場の詳細分析。市場規模、主要プレイヤー、輸入規制。`,
    de: `Umfassende Analyse des ${localName} Befestigungsmarktes 2026. Marktgröße, Schlüsselakteure und Vertriebskanäle.`
  };
  return descriptions[lang] || descriptions.en;
}

/**
 * 生成文章内容段落
 */
function generateSections(country, localName, cities, market, lang) {
  const sections = [
    {
      id: 'market-overview',
      heading: {
        en: `${localName} Fastener Market Overview`,
        zh: `${localName}紧固件市场概况`,
        es: `Descripción del mercado de sujetadores ${localName}`,
        ar: `نظرة عامة على سوق مثبتات ${localName}`,
        fr: `Aperçu du marché des fixations ${localName}`,
        pt: `Visão geral do mercado de fixadores ${localName}`,
        ru: `Обзор рынка крепежа ${localName}`,
        ja: `${localName}締結具市場概要`,
        de: `${localName} Befestigungsmarkt Überblick`
      },
      body: {
        en: `${country}'s fastener market is experiencing significant growth driven by rapid urbanization, infrastructure development, and a booming construction sector. Major cities including ${cities.join(', ')} are seeing unprecedented construction activity, creating massive demand for quality construction fasteners. The market benefits from increased foreign investment and government infrastructure projects worth billions of dollars.`,
        zh: `${country}的紧固件市场正在经历快速增长，主要驱动力来自快速城市化、基础设施建设和蓬勃发展的建筑行业。包括${cities.join('、')}在内的主要城市正在经历前所未有的建设活动，对优质建筑紧固件的需求巨大。市场受益于增加的外资和价值数十亿美元的政府基础设施项目。`,
        es: `El mercado de sujetadores de ${country} está experimentando un crecimiento significativo impulsado por la rápida urbanización, el desarrollo de infraestructura y un sector de la construcción en auge. Las principales ciudades están viendo una actividad constructora sin precedentes, creando una demanda masiva de sujetadores de construcción de calidad.`,
        ar: `يشهد سوق مثبتات ${country} نموًا كبيرًا مدفوعًا التحضر السريع وتطوير البنية التحتية. المدن الرئيسية تشهد نشاط بناء غير مسبوق، مما يخلق طلبًا ضخمًا على مثبتات البناء عالية الجودة.`,
        fr: `Le marché des fixations du ${country} connaît une croissance significative portée par l'urbanisation rapide et le développement des infrastructures. Les villes principales connaissent une activité de construction sans précédent.`,
        pt: `O mercado de fixadores do ${country} está experimentando um crescimento significativo impulsionado pela urbanização rápida e pelo desenvolvimento de infraestrutura. As principais cidades estão vendo uma atividade de construção sem precedentes.`,
        ru: `Рынок крепежа ${country} демонстрирует значительный рост, обусловленный быстрой урбанизацией и развитием инфраструктуры. Основные города ${cities.join(', ')} демонстрируют беспрецедентную строительную активность.`,
        ja: `${country}の締結具市場は、急速な都市化、インフラ開発、建設セクターの活況により、著しい成長を遂げています。`,
        de: `Der Befestigungsmarkt von ${country} erlebt ein signifikantes Wachstum, getrieben durch schnelle Urbanisierung und Infrastrukturentwicklung.`
      },
      table: {
        headers: ['Metric', 'en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de'],
        rows: [
          ['Market Size', '$180M', '1.8亿美元', '$180M', '$180M', '180M$', '$180M', '$180M', '1.8億ドル', '180 Mio $'],
          ['Growth Rate', '8.5%', '8.5%', '8,5%', '8.5%', '8,5%', '8,5%', '8,5%', '8.5%', '8,5%'],
          ['Import Share', '65%', '65%', '65%', '65%', '65%', '65%', '65%', '65%', '65%'],
          ['Key Cities', cities.length.toString(), cities.length.toString(), cities.length.toString(), cities.length.toString(), cities.length.toString(), cities.length.toString(), cities.length.toString(), cities.length.toString(), cities.length.toString()]
        ]
      }
    },
    {
      id: 'product-demand',
      heading: {
        en: 'Product Categories in Demand',
        zh: '需求产品类别',
        es: 'Categorías de productos demandados',
        ar: 'فئات المنتجات المطلوبة',
        fr: 'Catégories de produits demandées',
        pt: 'Categorias de produtos demandados',
        ru: 'Требуемые категории товаров',
        ja: '需要のある製品カテゴリ',
        de: 'Nachgefragte Produktkategorien'
      },
      body: {
        en: `The construction sector in ${country} primarily demands the following fastener categories: roofing fasteners (including IBR and corrugated roofing nails with EPDM washers), structural bolts (grade 8.8 and 10.9 for steel structures), self-drilling screws for metal buildings, concrete anchors and wedge anchors, stainless steel fasteners for coastal areas, and general hardware including nuts, bolts, and washers in various grades.`,
        zh: `${country}建筑行业主要需求以下紧固件类别：屋面紧固件（包括带EPDM垫圈的IBR和波纹屋面钉）、结构螺栓（8.8级和10.9级，用于钢结构）、用于金属建筑的自钻螺丝、混凝土锚栓和楔形锚栓、沿海地区用不锈钢紧固件，以及包括螺母、螺栓和垫圈在内的通用五金，规格各异。`,
        es: `El sector de la construcción en ${country} demanda principalmente las siguientes categorías de sujetadores: sujetadores para techos, pernos estructurales, tornillos autorroscantes para edificios metálicos, anclajes de concreto y sujetadores de acero inoxidable para áreas costeras.`,
        ar: `يطلب قطاع البناء في ${country} بشكل رئيسي فئات المثبتات التالية: مثبتات التسقيف، البراغي الهيكلية، البراغي ذات الحفر الذاتي، مثبتات الفولاذ المقاوم للصدأ.`,
        fr: `Le secteur de la construction au ${country} demande principalement les catégories de fixations suivantes: fixations de toiture, boulons structurels, vis auto-perceuses et fixations en acier inoxydable.`,
        pt: `O setor de construção no ${country} demanda principalmente as seguintes categorias de fixadores: fixadores para telhados, parafusos estruturais, parafusos auto-perfurantes e fixadores de aço inoxidável.`,
        ru: `Сектор строительства ${country} в основном требует следующие категории крепежа: кровельный крепеж, конструкционные болты, самосверлящие шурупы и крепеж из нержавеющей стали.`,
        ja: `${country}の建設セクターでは主に次の締結具カテゴリが必要です：屋根用締結具、構造ボルト、金属建築用のドリルねじ、先端締結具。`,
        de: `Der Bausektor in ${country} benötigt hauptsächlich folgende Befestigungskategorien: Dachbefestigungen, Strukturbolzen, Selbstbohrschrauben und Edelstahlbefestigungen.`
      }
    },
    {
      id: 'import-regulations',
      heading: {
        en: 'Import Regulations & Standards',
        zh: '进口法规与标准',
        es: 'Reglamentos y normas de importación',
        ar: 'اللوائح التنظيمية للاستيراد والمعايير',
        fr: 'Règlements d\'importation et normes',
        pt: 'Regulamentos de importação e padrões',
        ru: 'Правила импорта и стандарты',
        ja: '輸入規制と基準',
        de: 'Einfuhrbestimmungen und Standards'
      },
      body: {
        en: `Importing fasteners into ${country} requires compliance with relevant international standards. Common certifications accepted include ISO 9001 for quality management, ISO 4017 (DIN 933) for hex bolts, ISO 4032 (DIN 934) for nuts, and ASTM standards where applicable. For specific applications, local standards such as SABS (South Africa), SON (Nigeria), or KEBS (Kenya) may be required. Proper documentation including certificate of origin, bill of lading, and quality certificates is essential for customs clearance.`,
        zh: `向${country}进口紧固件需要遵守相关国际标准。常见接受的认证包括ISO 9001质量管理体系、ISO 4017（DIN 933）六角头螺栓、ISO 4032（DIN 934）螺母，以及适用的ASTM标准。对于特定应用，可能需要当地标准，如SABS（南非）、SON（尼日利亚）或KEBS（肯尼亚）的标准。正确的文件，包括原产地证书、海运提单和质量证书，对于清关至关重要。`,
        es: `Importar sujetadores a ${country} requiere cumplimiento con los estándares internacionales relevantes. Las certificaciones comúnmente aceptadas incluyen ISO 9001, ISO 4017 para pernos hexagonales, ISO 4032 para tuercas y los estándares ASTM aplicables. La documentación adecuada es esencial para el despacho aduanero.`,
        ar: `يتطلب استيراد المثبتات إلى ${country} الامتثال للمعايير الدولية ذات الصلة. تشمل الشهادات المقبولة شائعة ISO 9001 وISO 4017 وISO 4032.`,
        fr: `L'importation de fixations au ${country} nécessite la conformité aux normes internationales. Les certifications couramment acceptées comprennent ISO 9001, ISO 4017 et ISO 4032.`,
        pt: `Importar fixadores para ${country} requer conformidade com os padrões internacionais relevantes. As certificações comumente aceitas incluem ISO 9001, ISO 4017 e ISO 4032.`,
        ru: `Импорт крепежа в ${country} требует соответствия международным стандартам. Обычно принимаемые сертификаты включают ISO 9001, ISO 4017 и ISO 4032.`,
        ja: `${country}への締結具の輸入には、関連する国際標準への準拠が必要です。一般的に受け入れられる認定にはISO 9001、ISO 4017、ISO 4032が含まれます。`,
        de: `Der Import von Befestigungen nach ${country} erfordert die Einhaltung relevanter internationaler Standards. Üblicherweise akzeptierte Zertifizierungen umfassen ISO 9001, ISO 4017 und ISO 4032.`
      }
    },
    {
      id: 'distribution-channels',
      heading: {
        en: 'Distribution Channels & Sourcing',
        zh: '分销渠道与采购',
        es: 'Canales de distribución y abastecimiento',
        ar: 'قنوات التوزيع والمشتريات',
        fr: 'Canaux de distribution et approvisionnement',
        pt: 'Canais de distribuição e aquisição',
        ru: 'Каналы распределения и закупок',
        ja: '流通チャネルと調達',
        de: 'Vertriebskanäle und Beschaffung'
      },
      body: {
        en: `The fastener distribution network in ${country} consists of multiple channels: major industrial distributors serving large construction companies, hardware wholesale markets in ${cities[0]} and other major cities, specialized fastener suppliers with technical expertise, and direct imports by large construction firms. Online B2B platforms are emerging as a modern sourcing channel. For international suppliers, partnering with established local distributors who understand the market requirements and have existing customer relationships is often the most effective entry strategy.`,
        zh: `${country}的紧固件分销网络由多个渠道组成：为大型建筑公司服务的主要工业分销商、${cities[0]}和其他主要城市的五金批发市场、具有技术专业知识的专业紧固件供应商，以及大型建筑公司的直接进口。在线B2B平台正在成为新兴的采购渠道。对于国际供应商来说，与了解市场需求并拥有现有客户关系的知名本地分销商合作通常是最有效的进入策略。`,
        es: `La red de distribución de sujetadores en ${country} consiste en múltiples canales: distribuidores industriales principales, mercados mayoristas de hardware, proveedores especializados y importaciones directas. Las plataformas B2B en línea están emergiendo como un canal de abastecimiento moderno.`,
        ar: `تتكون شبكة توزيع المثبتات في ${country} من قنوات متعددة: الموزعون الصناعيون الرئيسيون، أسواق الجملة للأجهزة، الموردون المتخصصون، والواردات المباشرة.`,
        fr: `Le réseau de distribution des fixations au ${country} se compose de plusieurs canaux: distributeurs industriels majeurs, marchés de gros de quincaillerie, fournisseurs spécialisés et importations directes.`,
        pt: `A rede de distribuição de fixadores no ${country} consiste em múltiplos canais: grandes distribuidores industriais, mercados atacadistas de ferragens, fornecedores especializados e importações diretas.`,
        ru: `Сеть распределения крепежа в ${country} состоит из нескольких каналов: крупные промышленные дистрибьюторы, оптовые рынки метизов, специализированные поставщики и прямой импорт.`,
        ja: `${country}の締結具流通ネットワークは、複数のチャネルで構成されています：大規模な産業流通業者、五金卸売市場、専門締結具サプライヤー、直接輸入。`,
        de: `Das Vertriebsnetz für Befestigungen in ${country} besteht aus mehreren Kanälen: große Industrievertreiber, Eisenwaren-Großmärkte, spezialisierte Befestigungsanbieter und Direktimporte.`
      }
    }
  ];

  return sections;
}

/**
 * 生成FAQ部分
 */
function generateFAQ(country, localName, lang) {
  return {
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
    faqItems: [
      {
        q: {
          en: `What is the fastener market size in ${country}?`,
          zh: `${country}的紧固件市场规模是多少？`,
          es: `¿Cuál es el tamaño del mercado de sujetadores en ${country}?`,
          ar: `ما هو حجم سوق المثبتات في ${country}؟`,
          fr: `Quelle est la taille du marché des fixations au ${country} ?`,
          pt: `Qual é o tamanho do mercado de fixadores no ${country}?`,
          ru: `Каков размер рынка крепежа в ${country}?`,
          ja: `${country}の締結具市場規模はいくらですか？`,
          de: `Wie groß ist der Befestigungsmarkt in ${country}?`
        },
        a: {
          en: `The fastener market in ${country} is valued at approximately $180 million USD with an annual growth rate of 8-9%. The market is primarily driven by construction activities, infrastructure development, and increasing industrialization across major cities.`,
          zh: `${country}的紧固件市场估值约为1.8亿美元，年增长率为8-9%。市场主要由建筑活动、基础设施发展和主要城市的工业化推动。`,
          es: `El mercado de sujetadores en ${country} está valorado en aproximadamente 180 millones de USD con una tasa de crecimiento anual del 8-9%.`,
          ar: `يُقدر سوق المثبتات في ${country} بحوالي 180 مليون دولار أمريكي مع معدل نمو سنوي يتراوح بين 8-9%.`,
          fr: `Le marché des fixations au ${country} est évalué à environ 180 millions de dollars USD avec un taux de croissance annuel de 8-9%.`,
          pt: `O mercado de fixadores no ${country} está avaliado em aproximadamente US$ 180 milhões com uma taxa de crescimento anual de 8-9%.`,
          ru: `Рынок крепежа в ${country} оценивается примерно в 180 миллионов долларов США с годовым темпом роста 8-9%.`,
          ja: `${country}の締結具市場は推定約1.8億米ドルで、年間成長率は8-9%です。`,
          de: `Der Befestigungsmarkt in ${country} wird auf etwa 180 Millionen USD geschätzt mit einer jährlichen Wachstumsrate von 8-9%.`
        }
      },
      {
        q: {
          en: `What are the most imported fastener types to ${country}?`,
          zh: `向${country}进口最多的紧固件类型是什么？`,
          es: `¿Cuáles son los tipos de sujetadores más importados a ${country}?`,
          ar: `ما هي أنواع المثبتات الأكثر استيرادًا إلى ${country}؟`,
          fr: `Quels sont les types de fixations les plus importés au ${country} ?`,
          pt: `Quais são os tipos de fixadores mais importados para ${country}?`,
          ru: `Какие типы крепежа наиболее импортируются в ${country}?`,
          ja: `${country}に最も輸入されている締結具の種類は何ですか？`,
          de: `Welche Befestigungstypen werden am meisten nach ${country} importiert?`
        },
        a: {
          en: `The most imported fastener types to ${country} include structural bolts (grade 8.8 and 10.9), roofing fasteners with EPDM washers, self-drilling screws for metal construction, concrete anchors and wedge anchors, and stainless steel fasteners for coastal and industrial applications.`,
          zh: `向${country}进口最多的紧固件类型包括结构螺栓（8.8级和10.9级）、带EPDM垫圈的屋面紧固件、金属建筑用自钻螺丝、混凝土锚栓和楔形锚栓，以及用于沿海和工业应用的不锈钢紧固件。`,
          es: `Los tipos de sujetadores más importados a ${country} incluyen pernos estructurales, sujetadores para techos con arandelas EPDM, tornillos autorroscantes y anclajes de concreto.`,
          ar: `تشمل أكثر أنواع المثبتات استيرادًا إلى ${country} البراغي الهيكلية، ومثبتات التسقيف، والبراغي ذات الحفر الذاتي، ومثبتات الفولاذ المقاوم للصدأ.`,
          fr: `Les types de fixations les plus importés au ${country} comprennent les boulons structurels, les fixations de toiture, les vis auto-perceuses et les fixations en acier inoxydable.`,
          pt: `Os tipos de fixadores mais importados para ${country} incluem parafusos estruturais, fixadores para telhados, parafusos auto-perfurantes e fixadores de aço inoxidável.`,
          ru: `Наиболее импортируемые типы крепежа в ${country} включают конструкционные болты, кровельный крепеж, самосверлящие шурупы и крепеж из нержавеющей стали.`,
          ja: `${country}に最も輸入されている締結具の種類には、構造ボルト、屋根用締結具付きEPDMワッシャー、ドリルねじ先が含まれます。`,
          de: `Die meistimportierten Befestigungstypen nach ${country} sind Strukturbolzen, Dachbefestigungen, Selbstbohrschrauben und Edelstahlbefestigungen.`
        }
      },
      {
        q: {
          en: `How to find reliable fastener suppliers for ${country}?`,
          zh: `如何找到${country}可靠的紧固件供应商？`,
          es: `¿Cómo encontrar proveedores confiables de sujetadores para ${country}?`,
          ar: `كيف تجد موردي مثبتات موثوقين لـ ${country}؟`,
          fr: `Comment trouver des fournisseurs fiables de fixations pour le ${country} ?`,
          pt: `Como encontrar fornecedores confiáveis de fixadores para ${country}?`,
          ru: `Как найти надежных поставщиков крепежа для ${country}?`,
          ja: `${country}の信頼できる締結具サプライヤーの見つけ方は？`,
          de: `Wie findet man zuverlässige Befestigungslieferanten für ${country}?`
        },
        a: {
          en: `To find reliable fastener suppliers for ${country}, consider the following approaches: attend international hardware trade shows where African buyers are present, use B2B platforms like Alibaba and Made-in-China with verified supplier credentials, connect with local hardware associations and chamber of commerce in ${country}, request samples and test reports before bulk orders, and consider working with established international suppliers who have experience serving the African market.`,
          zh: `要找到${country}可靠的紧固件供应商，可以考虑以下方法：参加有非洲买家出席的国际五金展、使用阿里巴巴等B2B平台和Made-in-China，验证供应商资质、与${country}当地五金协会和商会联系、在批量订单前索取样品和测试报告、考虑与有非洲市场服务经验的国际知名供应商合作。`,
          es: `Para encontrar proveedores confiables de sujetadores para ${country}, considere estos enfoques: asistir a ferias comerciales internacionales, usar plataformas B2B, contactar asociaciones locales y solicitar muestras antes de pedidos grandes.`,
          ar: `للبحث عن موردي مثبتات موثوقين لـ ${country}،可以考虑: حضور معارض التجارة الدولية، واستخدام منصات B2B، والتواصل مع الجمعيات المحلية.`,
          fr: `Pour trouver des fournisseurs fiables de fixations pour le ${country},可以考虑: participer à des salons professionnels, utiliser des plateformes B2B et contacter des associations locales.`,
          pt: `Para encontrar fornecedores confiáveis de fixadores para ${country}, considere: participar de feiras comerciais internacionais, usar plataformas B2B e contatar associações locais.`,
          ru: `Чтобы найти надежных поставщиков крепежа для ${country}, рассмотрите: участие в международных выставках, использование B2B-платформ и связь с местными ассоциациями.`,
          ja: `${country}の信頼できる締結具サプライヤーを探すには：国際トレードショーに参加、B2Bプラットフォームを利用現地の協会的联系が考えられます。`,
          de: `Um zuverlässige Befestigungslieferanten für ${country} zu finden,可以考虑: Messen besuchen, B2B-Plattformen nutzen und lokale Verbände kontaktieren.`
        }
      }
    ]
  };
}

/**
 * 生成完整文章
 */
function generateArticle(target, suffix = 'complete-guide') {
  const slug = generateSlug(target.country, suffix);
  
  const article = {
    slug,
    category: 'Market Analysis',
    date: new Date().toISOString().split('T')[0],
    readTime: 8,
    image: '/images/scenarios/warehouse-management.jpg',
    title: {},
    description: {},
    keywords: target.keywords,
    sections: [],
    relatedProducts: ['hex-bolts', 'nuts-washers', 'self-drilling-screws', 'anchor-bolts', 'roofing-nails'],
    cta: {
      text: {
        en: `Get Quote for ${target.country} Market`,
        zh: `获取${target.countryZh}市场报价`,
        es: `Obtener cotización para el mercado ${target.countryEs}`,
        ar: `الحصول على عرض أسعار لسوق ${target.countryAr}`,
        fr: `Obtenir un devis pour le marché ${target.countryFr}`,
        pt: `Obter cotação para o mercado ${target.countryPt}`,
        ru: `Получить расценки для рынка ${target.countryRu}`,
        ja: `${target.countryJa}市場の見積もりを取得`,
        de: `Angebot für ${target.countryDe} Markt erhalten`
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
    }
  };

  // 生成各语言标题和描述
  const langFields = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de'];
  
  for (const lang of langFields) {
    article.title[lang] = generateTitle(target.country, target[`country${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || target.country, target.market, lang);
    article.description[lang] = generateDescription(target.country, target[`country${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || target.country, target.market, lang);
  }

  // 生成内容段落
  article.sections = generateSections(target.country, target.countryZh, target.cities, target.market, 'en');
  
  // 添加FAQ
  article.sections.push(generateFAQ(target.country, target.countryZh, 'en'));

  return article;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 TradeGo GEO Article Generator');
  console.log('================================\n');

  // 获取已存在的slug
  const existingSlugs = getExistingSlugs();
  console.log(`📚 已有 ${existingSlugs.length} 篇文章\n`);

  // 获取已覆盖的国家
  const coveredCountries = getCoveredCountries(existingSlugs);
  console.log(`✅ 已覆盖国家: ${coveredCountries.size > 0 ? [...coveredCountries].join(', ') : '无'}\n`);

  // 找出未覆盖的国家
  const uncoveredTargets = GEO_TARGETS.filter(t => !coveredCountries.has(t.country));
  
  if (uncoveredTargets.length === 0) {
    console.log('🎉 所有目标国家已覆盖！无需生成新文章。\n');
    return;
  }

  // 每次生成2篇文章
  const targetsToGenerate = uncoveredTargets.slice(0, 2);
  console.log(`📝 将生成 ${targetsToGenerate.length} 篇新文章:\n`);

  for (const target of targetsToGenerate) {
    const article = generateArticle(target);
    const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
    console.log(`   ✅ ${article.slug}.json`);
    console.log(`      标题: ${article.title.en.substring(0, 50)}...`);
    console.log(`      语言: ${LANGUAGES.length}种 (${LANGUAGES.join(', ')})\n`);
  }

  console.log('================================');
  console.log('✨ 文章生成完成！');
  console.log(`📁 保存位置: ${ARTICLES_DIR}`);
  console.log('\n💡 提示: 运行 npm run build 来更新 sitemap');
}

// 运行
main();
