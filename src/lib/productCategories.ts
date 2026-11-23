// 产品分类分组：首页分区展示、详情页同族推荐、聚合页共用同一数据源
// 2026-11-24 首页"全品类上首页 + 重点推荐"改造新增

export interface ProductCategory {
  key: string
  label: Record<string, string>
  blurb: Record<string, string>
  slugs: string[]
}

export const productCategories: ProductCategory[] = [
  {
    key: 'screws',
    label: {
      en: 'Screws', zh: '螺丝', es: 'Tornillos', fr: 'Vis', pt: 'Parafusos',
      ar: 'براغي', ru: 'Винты', ja: 'ビス・ねじ', de: 'Schrauben', hi: 'स्क्रू',
    },
    blurb: {
      en: 'Drywall, self-drilling, chipboard, concrete and machine screws for board, metal, timber and concrete.',
      zh: '干墙、自钻、刨花板、混凝土与机丝螺丝，覆盖板材、金属、木材与混凝土。',
      es: 'Tornillos para placas de yeso, autotaladrantes, aglomerado, hormigón y máquina.',
      fr: 'Vis plaque de plâtre, autoforeuses, aggloméré, béton et machine.',
      pt: 'Parafusos para drywall, autoatarraxantes, aglomerado, concreto e máquina.',
      ar: 'براغي الجبس، ذاتية الحفر، الألواح، الخرسانة والآلات.',
      ru: 'Винты для гипсокартона, саморезы, для ДСП, бетона и машиностроения.',
      ja: '石膏ボード用、自穿孔、パーティクルボード、コンクリート、機械用ねじ。',
      de: 'Trockenbau-, Bohr-, Spanplatten-, Beton- und Maschinenschrauben.',
      hi: 'ड्राईवॉल, सेल्फ-ड्रिलिंग, चिपबोर्ड, कंक्रीट और मशीन स्क्रू।',
    },
    slugs: [
      'drywall-screws', 'self-drilling-screws', 'self-tapping-screws', 'chipboard-screws',
      'concrete-screws', 'machine-screws', 'coach-screws', 'wood-screws', 'set-screws', 'eye-screws',
    ],
  },
  {
    key: 'bolts',
    label: {
      en: 'Bolts & Rods', zh: '螺栓与螺杆', es: 'Pernos y varillas', fr: 'Boulons et tiges', pt: 'Pernos e hastes',
      ar: 'براغي الربط والقضبان', ru: 'Болты и шпильки', ja: 'ボルト・ロッド', de: 'Bolzen und Stangen', hi: 'बोल्ट और रॉड',
    },
    blurb: {
      en: 'Hex, flange, stud, carriage, U, eye and foundation bolts plus threaded rods, DIN and ASTM grades.',
      zh: '六角、法兰、双头、马车、U 型、羊眼、地脚螺栓及螺杆，DIN 与 ASTM 等级齐全。',
      es: 'Pernos hexagonales, brida, espárragos, coche, U, cáncamo y cimentación, con varillas roscadas.',
      fr: 'Boulons hexagonaux, à bride, goujons, charron, en U, à œil et d’ancrage, avec tiges filetées.',
      pt: 'Pernos sextavados, flange, prisioneiros, carroceria, U, olhal e chumbadores com hastes roscadas.',
      ar: 'براغي سداسية، بفلانشة، مزدوجة، عربة، حرف U، عينية وأساسات مع قضبان ملولبة.',
      ru: 'Болты шестигранные, фланцевые, шпильки, вагонные, U-образные, рым-болты и фундаментные со шпильками.',
      ja: '六角、フランジ、スタッド、キャリッジ、U字、アイ、基礎ボルトと全ねじロッド。',
      de: 'Sechskant-, Flansch-, Steh-, Wagen-, U-, Ring- und Ankerbolzen sowie Gewindestangen.',
      hi: 'हेक्स, फ्लैंज, स्टड, कैरिज, U, आई और फाउंडेशन बोल्ट तथा थ्रेडेड रॉड।',
    },
    slugs: [
      'bolts-nuts', 'anchor-bolts', 'u-bolts', 'eye-bolts', 'foundation-bolts', 'carriage-bolts',
      'allen-bolts', 'hanger-bolts', 'flange-bolts', 'stud-bolts', 'threaded-rods',
    ],
  },
  {
    key: 'nuts',
    label: {
      en: 'Nuts', zh: '螺母', es: 'Tuercas', fr: 'Écrous', pt: 'Porcas',
      ar: 'صواميل', ru: 'Гайки', ja: 'ナット', de: 'Muttern', hi: 'नट',
    },
    blurb: {
      en: 'Hex, nylon-lock, flange, cap, wing, coupling and PTFE nuts, matched to bolt grades.',
      zh: '六角、尼龙锁紧、法兰、盖形、蝶形、联接与 PTFE 螺母，与螺栓等级配套。',
      es: 'Tuercas hexagonales, autoblocantes, brida, ciega, mariposa, de unión y PTFE.',
      fr: 'Écrous hexagonaux, autofreinés, à bride, borgnes, papillon, de raccord et PTFE.',
      pt: 'Porcas sextavadas, travantes, flange, cega, borboleta, de união e PTFE.',
      ar: 'صواميل سداسية، قفل نايلون، بفلانشة، مغلقة، فراشة، وصل وPTFE.',
      ru: 'Гайки шестигранные, самоконтрящиеся, фланцевые, колпачковые, барашковые, соединительные и PTFE.',
      ja: '六角、ナイロンロック、フランジ、キャップ、ウィング、カップリング、PTFEナット。',
      de: 'Sechskant-, Sicherungs-, Flansch-, Hut-, Flügel-, Verbindungs- und PTFE-Muttern.',
      hi: 'हेक्स, नायलॉक, फ्लैंज, कैप, विंग, कपलिंग और PTFE नट।',
    },
    slugs: ['hex-nuts', 'nylon-lock-nuts', 'flange-nuts', 'cap-nuts', 'wing-nuts', 'coupling-nuts', 'ptfe-nuts'],
  },
  {
    key: 'washers',
    label: {
      en: 'Washers', zh: '垫圈', es: 'Arandelas', fr: 'Rondelles', pt: 'Arruelas',
      ar: 'حلقات', ru: 'Шайбы', ja: 'ワッシャー', de: 'Unterlegscheiben', hi: 'वॉशर',
    },
    blurb: {
      en: 'Flat, spring and lock washers, zinc-plated, HDG and stainless, M6–M36.',
      zh: '平垫、弹垫与锁紧垫圈，镀锌、热镀锌与不锈钢，M6–M36。',
      es: 'Arandelas planas, elásticas y de bloqueo, zincadas, HDG e inoxidable.',
      fr: 'Rondelles plates, élastiques et freinées, zinguées, HDG et inox.',
      pt: 'Arruelas planas, mola e de trava, zincadas, HDG e inox.',
      ar: 'حلقات مسطحة وياي وقفل، مجلفنة وساخنة الغمس وستانلس.',
      ru: 'Шайбы плоские, пружинные и стопорные, цинк, HDG и нержавеющая сталь.',
      ja: '平ワッシャー、スプリング、ロックワッシャー、亜鉛・HDG・ステンレス。',
      de: 'Flache, Feder- und Sicherungsscheiben, verzinkt, feuerverzinkt, Edelstahl.',
      hi: 'फ्लैट, स्प्रिंग और लॉक वॉशर, जिंक, HDG और स्टेनलेस।',
    },
    slugs: ['washers', 'spring-washers', 'lock-washers'],
  },
  {
    key: 'nails',
    label: {
      en: 'Nails', zh: '钉类', es: 'Clavos', fr: 'Clous', pt: 'Pregos',
      ar: 'مسامير', ru: 'Гвозди', ja: '釘', de: 'Nägel', hi: 'कील',
    },
    blurb: {
      en: 'IBR roofing, coil, common, concrete, clout, duplex and powder-actuated nails, SABS 1195 available.',
      zh: 'IBR 屋面钉、卷钉、普通钉、水泥钉、油毡钉、双头钉与射钉，可提供 SABS 1195。',
      es: 'Clavos para tejado IBR, en rollo, comunes, de hormigón, para fieltro, de doble cabeza y de pistola.',
      fr: 'Clous toiture IBR, en rouleau, ordinaires, béton, pour feutre, à double tête et à poudre.',
      pt: 'Pregos para telha IBR, em rolo, comuns, de concreto, para feltro, de cabeça dupla e a pólvora.',
      ar: 'مسامير أسقف IBR، ملفوفة، عادية، خرسانية، للعزل، مزدوجة الرأس ومدفوعة بالبارود.',
      ru: 'Гвозди для кровли IBR, в блоках, обычные, бетонные, толевые, двусторонние и пороховые.',
      ja: 'IBR屋根用、コイル、普通、コンクリート、クラウト、ダブルヘッド、火薬式釘。',
      de: 'IBR-Dach-, Rollen-, Draht-, Beton-, Dachpappen-, Doppelkopf- und Schussnägel.',
      hi: 'IBR रूफिंग, कॉइल, कॉमन, कंक्रीट, क्लाउट, ड्यूप्लेक्स और शूटिंग कील।',
    },
    slugs: ['ibr-nails', 'coil-nails', 'common-nails', 'concrete-nails', 'clout-nails', 'duplex-nails', 'shooting-nails'],
  },
  {
    key: 'anchors',
    label: {
      en: 'Anchors', zh: '锚固件', es: 'Anclajes', fr: 'Ancrages', pt: 'Chumbadores',
      ar: 'مثبتات تثبيت', ru: 'Анкеры', ja: 'アンカー', de: 'Dübel & Anker', hi: 'एंकर',
    },
    blurb: {
      en: 'Sleeve, wedge, drop-in, set and bolt anchors plus expansion bolts and ground screws for concrete and masonry.',
      zh: '套管、楔形、内螺纹、钉胀与螺栓锚，配膨胀螺栓与地螺丝，用于混凝土与砌体。',
      es: 'Anclajes de manguito, cuña, embutidos, de fijación y pernos, con bulones y tornillos de suelo.',
      fr: 'Ancrages à douille, à coin, noyés, de fixation et à boulon, avec chevilles et vis de sol.',
      pt: 'Chumbadores de luva, cunha, embutido, fixação e perno, com parafusos de expansão e de solo.',
      ar: 'مثبتات كمّية، إسفينية، داخلية، تثبيت ومسامير تثبيت مع براغي تمدد ومسامير أرضية.',
      ru: 'Анкеры гильзовые, клиновые, закладные, с винтом и болтовые, а также распорные болты и винтовые сваи.',
      ja: 'スリーブ、ウェッジ、ドロップイン、セット、ボルトアンカーと拡張ボルト、グランドスクリュー。',
      de: 'Hülsen-, Keil-, Einlass-, Setz- und Bolzenanker sowie Spreizbolzen und Erdschrauben.',
      hi: 'स्लीव, वेज, ड्रॉप-इन, सेट और बोल्ट एंकर तथा एक्सपैंशन बोल्ट और ग्राउंड स्क्रू।',
    },
    slugs: ['bolt-anchors', 'sleeve-anchors', 'expansion-bolts', 'wedge-anchors', 'drop-in-anchors', 'set-anchors', 'ground-screws'],
  },
  {
    key: 'rivets',
    label: {
      en: 'Rivets', zh: '铆接件', es: 'Remaches', fr: 'Rivets', pt: 'Rebites',
      ar: 'برشام', ru: 'Заклёпки', ja: 'リベット', de: 'Nieten', hi: 'रिवेट',
    },
    blurb: {
      en: 'Blind, semi-tubular and rivet nuts for roofing, truck bodies, signage and one-side fastening.',
      zh: '拉铆钉、半空心铆钉与拉铆螺母，用于屋面、车厢、标牌与单面紧固。',
      es: 'Remaches ciegos, semitubulares y tuercas remache para tejados, carrocerías y rótulos.',
      fr: 'Rivets aveugles, semi-tubulaires et écrous à rivet pour toiture, carrosserie et enseigne.',
      pt: 'Rebites cegos, semi-tubulares e porcas rebite para telhados, carrocerias e sinalização.',
      ar: 'برشام كفيف، نصف أنبوبي وصواميل برشام للأسقف والمركبات واللوحات.',
      ru: 'Заклёпки вытяжные, полупустотелые и резьбовые для кровли, кузовов и вывесок.',
      ja: 'ブラインド、セミチューブラーリベット、リベットナット。',
      de: 'Blind-, Halbhohl- und Blindnietmuttern für Dach, Fahrzeugbau und Beschilderung.',
      hi: 'ब्लाइंड, सेमी-ट्यूबुलर रिवेट और रिवेट नट।',
    },
    slugs: ['blind-rivets', 'semi-tubular-rivets', 'rivet-nuts'],
  },
  {
    key: 'solar',
    label: {
      en: 'Solar & Mounting', zh: '光伏支架与型材', es: 'Montaje solar', fr: 'Montage solaire', pt: 'Estruturas solares',
      ar: 'تركيبات شمسية', ru: 'Солнечный монтаж', ja: '太陽光架台', de: 'Solarmontage', hi: 'सोलर माउंटिंग',
    },
    blurb: {
      en: 'Solar hooks, clamps, brackets, aluminium profiles, steel channels and metal brackets for PV and steel framing.',
      zh: '光伏挂钩、压块、支架、铝型材、钢槽与金属支架，用于光伏与钢构。',
      es: 'Ganchos, abrazaderas, soportes solares, perfiles de aluminio, canales de acero y ménsulas.',
      fr: 'Crochets, pinces, supports solaires, profilés aluminium, profilés acier et équerres.',
      pt: 'Ganchos, grampos, suportes solares, perfis de alumínio, canais de aço e cantoneiras.',
      ar: 'خطافات ومشابك وحوامل شمسية، مقاطع ألمنيوم، مجاري فولاذية وحوامل معدنية.',
      ru: 'Солнечные крюки, зажимы, кронштейны, алюминиевые профили, стальные швеллеры и уголки.',
      ja: 'ソーラーフック、クランプ、架台、アルミ形材、鋼チャンネル、金具。',
      de: 'Solarhaken, Klemmen, Halterungen, Aluminiumprofile, Stahlkanäle und Metallwinkel.',
      hi: 'सोलर हुक, क्लैंप, ब्रैकेट, एल्युमिनियम प्रोफाइल, स्टील चैनल और मेटल ब्रैकेट।',
    },
    slugs: ['solar-brackets', 'solar-hooks', 'solar-clamps', 'aluminum-profiles', 'steel-channels', 'metal-brackets'],
  },
  {
    key: 'waterproofing',
    label: {
      en: 'Waterproofing', zh: '防水材料', es: 'Impermeabilización', fr: 'Étanchéité', pt: 'Impermeabilização',
      ar: 'مواد عزل', ru: 'Гидроизоляция', ja: '防水材', de: 'Abdichtung', hi: 'वॉटरप्रूफिंग',
    },
    blurb: {
      en: 'Butyl tape, flash band, non-woven fabric, waterproof coating and membrane for roofs, basements and walls.',
      zh: '丁基胶带、防水胶带、无纺布、防水涂料与防水卷材，用于屋面、地下室与墙体。',
      es: 'Cinta de butilo, banda flash, tela no tejida, recubrimiento y membrana impermeables.',
      fr: 'Bande butyle, bande flash, non-tissé, revêtement et membrane d’étanchéité.',
      pt: 'Fita butílica, fita flash, não tecido, revestimento e membrana impermeáveis.',
      ar: 'شريط بوتيل، شريط وميض، قماش غير منسوج، طلاء وعازل أغشية.',
      ru: 'Бутиловая лента, флеш-лента, нетканое полотно, гидроизоляционная краска и мембрана.',
      ja: 'ブチルテープ、フラッシュバンド、不織布、防水塗料、防水シート。',
      de: 'Butylband, Flashband, Vlies, Dichtungsbeschichtung und -bahn.',
      hi: 'ब्यूटिल टेप, फ्लैश बैंड, नॉन-वोवन, वॉटरप्रूफ कोटिंग और मेंब्रेन।',
    },
    slugs: ['butyl-tape', 'asphalt-flash-band', 'non-woven-fabric', 'waterproof-coating', 'waterproof-membrane'],
  },
]

// 首页"重点推荐"位：高询盘率主推品类，顺序即展示顺序
export const featuredSlugs = [
  'drywall-screws',
  'self-drilling-screws',
  'bolts-nuts',
  'ibr-nails',
  'anchor-bolts',
  'solar-brackets',
  'butyl-tape',
  'washers',
]

export function categoryOf(slug: string): ProductCategory | undefined {
  return productCategories.find(c => c.slugs.includes(slug))
}

// 同族推荐：同分类内优先，不足时用后续分类补齐
export function siblingsOf(slug: string, limit = 6): string[] {
  const cat = categoryOf(slug)
  const siblings = cat ? cat.slugs.filter(s => s !== slug) : []
  if (siblings.length >= limit) return siblings.slice(0, limit)
  const rest = productCategories
    .filter(c => c.key !== (cat?.key ?? ''))
    .flatMap(c => c.slugs)
    .filter(s => s !== slug)
  return [...siblings, ...rest].slice(0, limit)
}
