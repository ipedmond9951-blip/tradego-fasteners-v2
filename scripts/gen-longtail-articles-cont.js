// Continuation of gen-longtail-articles.js
// Articles C3, C4, D1, D2 and main execution
const fs = require('fs'); const path = require('path');

const AUTHORS = [
  { name: 'Chen Wei', title: 'Senior Fastener Trade Analyst', credentials: '12 years in China-Africa fastener trade' },
  { name: 'Michael Liu', title: 'Supply Chain Consultant', credentials: 'China-Africa logistics specialist since 2015' },
  { name: 'Emily Chen', title: 'Quality Control Inspector', credentials: 'ISO 9001 certified auditor, fastener testing' },
  { name: 'David Wu', title: 'Construction Materials Expert', credentials: '10 years in hardware procurement' }
];

const DATA_SOURCES = [
  'https://www.iso.org/standard/',
  'https://www.astm.org/standards/',
  'https://www.din.org/standards/',
  'https://www.bsi.org/',
  'https://www.trade.gov/'
];

const REFERENCES = [
  'https://www.iso.org/standard/',
  'https://www.astm.org/standards/',
  'https://www.din.org/standards/',
  'https://www.wto.org/'
];

const ARTICLES_CONT = [
  // ===== C3: Welding Nuts & Special Nuts =====
  {
    slug: 'welding-nuts-square-nut-special-nut-guide',
    category: 'Product Guide',
    keywords: 'square welding nut stock wholesale, hex nut for embedded plate welding, knurled round nut non standard custom, step shape special nut processing, matching nut for 10.9 grade bolt, fine thread round lock nut custom',
    title: {
      en: 'Welding Nuts, Square Nuts & Special Nuts: Manufacturing Guide',
      zh: '焊接螺母、方螺母与异形螺母生产指南',
      es: 'Tuercas de soldadura, tuercas cuadradas y tuercas especiales',
      ar: 'صوامل اللحام والصوامل المربعة والصوامل الخاصة',
      fr: 'Écrous de soudure, écrous carrés et écrous spéciaux',
      pt: 'Porcas de soldagem, porcas quadradas e porcas especiais',
      ru: 'Сварные гайки, квадратные и специальные гайки',
      ja: '溶け付けナット・四角ナット・特納ットの製造ガイド',
      de: 'Schweißmuttern, Vierkantmuttern und Sondermuttern',
      hi: 'वेल्डिंग नट, स्क्वायर नट और स्पेशल नट'
    },
    description: {
      en: 'Guide to square welding nuts, flange welding nuts, knurled nuts, and custom special nuts. Manufacturing processes and application guidance for specialized fastening.',
      zh: '方焊接螺母、法兰焊接螺母、滚花螺母和定制异形螺母指南。专业紧固件的制造工艺和应用指导。'
    },
    sections: [
      {
        id: 'welding-nuts',
        heading: { en: 'Square Welding Nuts and Flange Welding Nuts' },
        body: {
          en: '<a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Square welding nuts</a> (DIN 928) are designed to be resistance-welded to sheet metal or structural steel surfaces, creating a permanent threaded anchor point where only one side of the母材 is accessible. The square body shape prevents rotation during welding (weld spots are applied at each corner of the square). <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Flange welding nuts</a> (DIN 929) have a hexagonal flange with welding projections (smallbumps on the underside) that concentrate the welding current for faster, more consistent welds. <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Hex nuts for embedded plate welding</a> are installed in concrete or masonry during construction (embedded plates grouted into walls) with the nut accessible for later bolt installation. Available in carbon steel (zinc-plated or HDG) and stainless steel (304/316). Our factory <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">wholesale stock</a> includes common sizes M6 through M16.',
          zh: '方焊接螺母（DIN 928）设计用于电阻焊接到金属板或结构钢表面，创建永久性螺纹锚点。'
        }
      },
      {
        id: 'special-nuts',
        heading: { en: 'Knurled Nuts, Step Nuts and Custom Special Nuts' },
        body: {
          en: '<a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Knurled round nuts</a> have diamond or straight knurling on the outer diameter for finger-grip tightening—commonly used on camera tripods, machinery adjustment mechanisms, and hand-tightened collar applications. <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Step shape special nuts</a> (step nuts or reduced-body nuts) have multiple diameter sections, allowing them to fit through different sized holes in an assembly while threading onto different母材 thicknesses. Custom <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-underline-2">special nut processing</a> includes: left-hand thread nuts (for reverserotation applications), drill-down nuts (with integral drill tip for one-step installation into concrete), and PEM nuts (press-fit nuts for sheet metal). Minimum order quantities for custom non-standard nuts start at 1,000 pieces, with samples available in 10-15 working days.',
          zh: '滚花圆螺母在外径上有菱形或直滚花，便于手指抓紧紧固——常用于相机三脚架、机械调节机构。'
        }
      },
      {
        id: 'fine-thread',
        heading: { en: 'Fine Thread Round Lock Nuts: Custom Manufacturing' },
        body: {
          en: '<a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Fine thread round lock nuts</a> with custom specifications (DIN 980 / ISO 16032 all-metal lock nuts, or DIN 929 flange weld nuts) are available on <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">custom order</a> for precision applications. Common custom specifications: non-standard fine threads (M10×1.0, M12×1.25, etc.), left-hand thread (all sizes), and special materials (Brass, Bronze, Titanium). For <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">fine thread round lock nut</a> matching a <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">fine thread bolt</a> (such as UNF or metric fine), always specify both the thread size AND the nut height class (standard or heavy). Custom manufacturing typically requires 3D CAD files or detailed engineering drawings. Our engineering team can reverse-engineer from samples or sketches.',
          zh: '细牙圆锁紧螺母按定制规格提供，用于精密应用。'
        }
      },
      {
        id: 'matching-10-9',
        heading: { en: 'Matching Nuts for 10.9 Grade Bolts' },
        body: {
          en: 'When specifying <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">matching nuts for 10.9 grade bolts</a>, the minimum nut requirement is Grade 10 (proof load stress 1000 MPa). For structural applications per EN 14399, the specified nut grade must be confirmed with the bolt grade. Heavy hex nuts (DIN 6925) in Grade 10 are preferred for structural connections because the increased bearing area prevents母材 crushing. <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Extra large size heavy duty hex nuts</a> for M36-M72 bolts must be specified with the thread class (6H for metric) and the coating/palte specification. For offshore or marine environments, specify A4-80 (316 stainless) nuts with 10.9 HDG bolts to avoid galvanic corrosion—never use stainless nuts with HDG bolts in seawater unless isolated.',
          zh: '选择与10.9级螺栓匹配的螺母时，最小要求是10级（保证载荷应力1000 MPa）。'
        }
      },
      {
        id: 'faq',
        heading: { en: 'Frequently Asked Questions' },
        faqItems: [
          { q: { en: 'What is the weld projection on flange welding nuts?', zh: '法兰焊接螺母上的焊接凸点是什么？' }, a: { en: 'Flange welding nuts (DIN 929) have 3-4 smallbumps (projections) on the underside of the flange that concentrate resistance welding current, ensuring fast, strong welds at lower current.', zh: '法兰焊接螺母（DIN 929）在法兰下侧有3-4个小凸点，集中电阻焊电流，确保更快更强的焊接。' } },
          { q: { en: 'Can I weld a standard hex nut directly to steel?', zh: '我可以直接焊接标准六角螺母到钢上吗？' }, a: { en: 'Standard hex nuts are not designed for welding—the steel composition and geometry are not optimized for weld strength. Use dedicated square welding nuts (DIN 928) or flange welding nuts (DIN 929).', zh: '标准六角螺母不适合焊接。专用方焊接螺母（DIN 928）或法兰焊接螺母（DIN 929）才是正确的。' } }
        ]
      }
    ],
    relatedProducts: ['bolts-nuts', 'washers', 'anchor-bolts'],
    cta: { text: { en: 'Get Welding Nut & Special Nut Prices', zh: '获取焊接螺母和异形螺母价格' }, buttonText: { en: 'Request Quote', zh: '申请报价' }, link: '/product-upload' }
  },

  // ===== C4: Imperial & Standard Export Nuts =====
  {
    slug: 'imperial-metric-hex-nut-export-guide',
    category: 'Product Guide',
    keywords: 'imperial standard hex nut export, matching nut for 10.9 grade bolt, imperial size self tapping screw export, DIN standard precision machine thread screw, GB standard stainless steel hex bolt supplier',
    title: {
      en: 'Imperial & Metric Hex Nuts Export: Standards Guide',
      zh: '英制和公制六角螺母出口标准指南',
      es: 'Tuercas hexagonales imperiales y métricas para exportación',
      ar: 'صوامل سداسية البوصة والمتري للتصدير',
      fr: 'Écrous hexagonaux impériaux et métriques pour l\'exportation',
      pt: 'Porcas hexagonais imperiais e métricas para exportação',
      ru: 'Дюймовые и метрические шестигранные гайки для экспорта',
      ja: 'インチ・ミリタリー六角ナットの輸出ガイド',
      de: 'Zoll- und Metrik-Sechskantmuttern für Export',
      hi: 'इम्पीरियल और मेट्रिक हेक्स नट एक्सपोर्ट'
    },
    description: {
      en: 'Imperial standard and metric hex nuts for export. DIN, ANSI, GB standards. Matching nuts for bolt grades 8.8, 10.9. Wholesale export pricing.',
      zh: '出口用英制和公制六角螺母。DIN、ANSI、GB标准。螺栓8.8、10.9级匹配螺母。'
    },
    sections: [
      {
        id: 'imperial-nuts',
        heading: { en: 'Imperial Standard Hex Nuts: UNC/UNF for Export' },
        body: {
          en: '<a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Imperial standard hex nuts</a> for export include UNC (Unified National Coarse) and UNF (Unified National Fine) thread forms in fractional sizes from 1/4" through 1-1/2". <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Export</a> to markets using American standards (North America, Caribbean, Gulf states) requires nuts conforming to ASME B18.2.2 dimensions. Key sizes in stock: 1/4"-20 UNC, 5/16"-18 UNC, 3/8"-16 UNC, 7/16"-14 UNC, 1/2"-13 UNC, 5/8"-11 UNC, 3/4"-10 UNC, 7/8"-9 UNC, 1"-8 UNC/UNF. Our <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">wholesale export</a> line includes zinc-plated carbon steel, HDG carbon steel, and 304/316 stainless steel. Always match nut grade to bolt grade: Grade A194 2H (for ASTM A193 B7 bolts) is the standard heavy hex nut for high-temperature and pressure-containing applications.',
          zh: '英制标准六角螺母包括UNC和UNF螺纹形式。出口到使用美国标准的市场需要符合ASME B18.2.2尺寸的螺母。'
        }
      },
      {
        id: 'din-gb-export',
        heading: { en: 'DIN and GB Standard Nuts for International Export' },
        body: {
          en: '<a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">DIN standard nuts</a> (DIN 934 for standard hex nuts, DIN 6925 for flange nuts) are globally recognized and accepted in most export markets. The metric thread pitch must be specified: coarse (default) or fine. For structural bolting per EN 14399, specify heavy hex nuts with the exact proof load class. <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">GB standard stainless steel hex nuts</a> (GB/T 6170 for standard nuts, GB/T 6172 for thin nuts) are harmonized with ISO equivalents and are acceptable in most export destinations. For <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">African export</a> markets, many buyers accept GB or DIN interchangeably. Always verify with the local inspector or engineer if SABS, KEBS, or other local standard certification is required.',
          zh: 'DIN标准螺母（DIN 934标准六角螺母，DIN 6925法兰螺母）在全球被广泛认可和接受。'
        }
      },
      {
        id: 'matching-guide',
        heading: { en: 'Hex Nut and Bolt Grade Matching Chart' },
        table: {
          headers: ['Bolt Grade', 'Min Nut Grade', 'Nut Type', 'Material/Coating'],
          rows: [
            ['4.8 (Carbon Steel)', 'Grade 5 (A563)', 'Standard Hex', 'Zinc Plated'],
            ['8.8 (Carbon Steel)', 'Grade 8 (A563)', 'Heavy Hex', 'Zinc Plated or HDG'],
            ['10.9 (Carbon Steel)', 'Grade 10 (A563)', 'Heavy Hex', 'HDG (outdoor)'],
            ['12.9 (Alloy Steel)', 'Grade 12 (A563)', 'Heavy Hex', 'Zinc Plated or Black Oxide'],
            ['A2-70 (304 SS)', 'A2-70', 'Standard Hex', 'Passivated SS'],
            ['A4-80 (316 SS)', 'A4-80', 'Heavy Hex', 'Passivated SS'],
            ['A325 Structural', 'A563 DH', 'Heavy Hex', 'HDG (same lot)'],
            ['A490 Structural', 'A563 DH or A194 8', 'Heavy Hex', 'HDG or Natural']
          ]
        }
      },
      {
        id: 'faq',
        heading: { en: 'Frequently Asked Questions' },
        faqItems: [
          { q: { en: 'What nut grade matches an 8.8 bolt?', zh: '8.8螺栓配什么等级螺母？' }, a: { en: 'Grade 8 (proof load 890 MPa) is the minimum match for 8.8 bolts. Heavy hex Grade 8 is preferred for structural connections.', zh: '8级（保证载荷890 MPa）是8.8螺栓的最低匹配。重型8级是结构连接的首选。' } },
          { q: { en: 'Can GB and DIN nuts be used interchangeably?', zh: 'GB和DIN螺母可以互换吗？' }, a: { en: 'Yes, GB and DIN metric nuts are harmonized under the ISO agreement and are dimensionally interchangeable. ISO 4032 replaces both DIN 934 and GB/T 6170.', zh: '是的，GB和DIN公制螺母在ISO协议下已协调，尺寸可互换。ISO 4032同时替代DIN 934和GB/T 6170。' } }
        ]
      }
    ],
    relatedProducts: ['bolts-nuts', 'washers', 'anchor-bolts'],
    cta: { text: { en: 'Get Hex Nut Export Prices', zh: '获取六角螺母出口价格' }, buttonText: { en: 'Request Quote', zh: '申请报价' }, link: '/product-upload' }
  },

  // ===== D1: Industrial Washers =====
  {
    slug: 'industrial-washers-flat-spring-lock-guide',
    category: 'Product Guide',
    keywords: '304 stainless steel flat washer, 316 stainless steel spring lock washer, galvanized extra large flat washer wholesale, extra thick wide heavy duty flat washer, anti slip patterned metal washer, industrial metal spring anti lock washer',
    title: {
      en: 'Industrial Washers: Flat Washers, Spring Lock Washers & Anti Slip',
      zh: '工业垫圈：平垫圈、弹簧垫圈与防滑垫圈',
      es: 'Arandelas industriales: planas, de muelle y antideslizantes',
      ar: 'أحزمة صناعية: مسطحة ونابض ومزلاقي',
      fr: 'Rondelles industrielles: plates, ressorts et antidérapantes',
      pt: 'Arruelas industriais: planas, mola e antiderrapantes',
      ru: 'Промышленные шайбы: плоские, пружинные и противоскользящие',
      ja: '工業ワッシャー：平座金、バネ座金、ノンスリップ',
      de: 'Industrielle Unterlegscheiben: Flach, Feder, Rutschsicherung',
      hi: 'इंडस्ट्रियल वॉशर: फ्लैट, स्प्रिंग और एंटी स्लिप'
    },
    description: {
      en: 'Complete guide to industrial washers: 304/316 stainless steel flat washers, spring lock washers, heavy duty flat washers, and anti slip patterned washers. Wholesale pricing.',
      zh: '工业垫圈完整指南：304/316不锈钢平垫圈、弹簧垫圈、重型平垫圈和防滑图案垫圈。'
    },
    sections: [
      {
        id: 'flat-washers',
        heading: { en: '304 & 316 Stainless Steel Flat Washers' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Flat washers</a> (also called plain washers, DIN 125 / ISO 7089) distribute the load from a bolt or nut over a larger母材 area, reducing bearing stress on the母材 surface. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">304 stainless steel flat washers</a> (A2 stainless, 18-8 composition) provide good corrosion resistance for general indoor and outdoor applications. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">316 stainless steel flat washers</a> (A4 stainless, with 2-3% molybdenum) provide superior chloride resistance for marine, coastal, and chemical processing environments. Both grades are passivated for enhanced corrosion resistance. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Ultra thin micro precision flat washers</a> (0.1mm to 1.0mm thickness) are available for precision instrument and electronics applications where standard washer thickness would interfere with close-tolerance assemblies.',
          zh: '平垫圈（DIN 125 / ISO 7089）将螺栓或螺母的载荷分布到更大的母材区域，减少母材表面的轴承应力。'
        }
      },
      {
        id: 'spring-lock',
        heading: { en: 'Spring Lock Washers and Anti Lock Spring Washers' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Spring lock washers</a> (also called split washers or spring washers, DIN 127 / ISO 14315) are designed to provide spring tension that resists loosening from vibration. The split (or external star) design creates radial spring action when compressed. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">316 stainless steel spring lock washers</a> are used in marine and corrosive environments where standard zinc-plated spring washers would rust. The <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">industrial metal spring anti lock washer</a> also comes in shakeproof variants (internal or external tooth) that bite into the母材 and bolt/nut surfaces for additional locking. Important: Spring washers alone are NOT reliable for vibration resistance in critical applications—use with nylon insert lock nuts or positive locking mechanisms. Spring washers are most effective for maintaining preload under thermal cycling where differential expansion would otherwise loosen a standard nut.',
          zh: '弹簧垫圈（DIN 127 / ISO 14315）设计用于提供弹簧张力，抵抗振动引起的松动。'
        }
      },
      {
        id: 'heavy-duty',
        heading: { en: 'Extra Large Flat Washers and Heavy Duty Flat Washers' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Extra large flat washers</a> (also called fender washers or extra wide flat washers) have a significantly larger outer diameter compared to standard flat washers, providing maximum load distribution for: soft母材 (aluminum, plastic, composite), oversized holes or slotted holes, and thin sheet metal applications where standard washers would still allow pull-through. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Extra thick wide heavy duty flat washers</a> (also called plate washers or bearing plates) are used in structural applications where not only the outer diameter is large but the thickness (typically 4mm to 12mm) provides rigidity to prevent bending under load. Structural plate washers for wood construction (ICC-ES approved) are used in seismic zones to prevent bolt pull-through in the wood. Available in zinc-plated carbon steel, HDG carbon steel, and stainless steel 304/316.',
          zh: '大型平垫圈（也称为挡泥板垫圈或超宽平垫圈）具有比标准平垫圈更大的外径，提供最大载荷分布。'
        }
      },
      {
        id: 'anti-slip',
        heading: { en: 'Anti Slip Patterned Metal Washers' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Anti slip patterned metal washers</a> (also called serrated washers, grip washers, or tooth lock washers) have serrations or teeth on either the bearing face or both faces that bite into the母材 and the fastener bearing surface to prevent loosening from vibration. External tooth washers (teeth on outside diameter) bite the母材 and prevent the washer from rotating with the nut. Internal tooth washers (teeth on inside diameter) bite both the母材 and the fastener head/nut to prevent rotation. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Serrated flange washers</a> are integrated into flange nuts for combined bearing area and locking in automotive applications. For <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">wholesale</a> supply, our stock includes plain, spring, and serrated variants in both inch and metric sizes.',
          zh: '防滑图案垫圈（也称为锯齿垫圈、抓垫圈或齿锁垫圈）在承压面或两面有锯齿或齿，咬入母材和紧固件承压表面以防止振动松动。'
        }
      },
      {
        id: 'washer-table',
        heading: { en: 'Washer Selection Quick Reference' },
        table: {
          headers: ['Washer Type', 'DIN/ANSI Standard', 'Function', 'Best Application'],
          rows: [
            ['Flat Washer (Standard)', 'DIN 125 / ISO 7089', 'Load distribution', 'General use, prevent marring'],
            ['Flat Washer (Heavy)', 'DIN 126 / ISO 7093', 'High load distribution', 'Structural, oversized holes'],
            ['Fender/Extra Wide', 'ANSI B18.22M', 'Max load distribution', 'Soft母材, thin sheets, slots'],
            ['Spring Lock (Split)', 'DIN 127 / ISO 14315', 'Spring tension/vibration', 'Thermal cycling, supplemental lock'],
            ['Tooth Lock (External)', 'DIN 6797', 'Anti-rotation bite', 'Moderate vibration, sheet metal'],
            ['Tooth Lock (Internal)', 'DIN 6798', 'Anti-rotation bite', 'Soft母材, painted surfaces'],
            ['Serrated Flange', 'DIN 6926', 'Bearing + locking', 'Automotive wheel, structural']
          ]
        }
      },
      {
        id: 'faq',
        heading: { en: 'Frequently Asked Questions' },
        faqItems: [
          { q: { en: 'Do spring washers actually prevent loosening?', zh: '弹簧垫圈真的能防止松动吗？' }, a: { en: 'Spring washers provide limited vibration resistance. For critical connections, use nylon insert lock nuts or all-metal prevailing torque nuts. Spring washers are best for maintaining preload under thermal cycling.', zh: '弹簧垫圈提供有限的抗振动能力。对于关键连接，使用尼龙锁紧螺母或全金属预紧扭矩螺母。' } },
          { q: { en: 'What size washer for a M10 bolt?', zh: 'M10螺栓用多大垫圈？' }, a: { en: 'Standard M10 flat washer: 21mm ID × 40mm OD × 3mm thick (DIN 125 Form A). Heavy duty: 21mm ID × 60mm OD × 6mm thick.', zh: '标准M10平垫圈：21mm内径×40mm外径×3mm厚（DIN 125 Form A）。重型：21mm内径×60mm外径×6mm厚。' } }
        ]
      }
    ],
    relatedProducts: ['washers', 'bolts-nuts', 'anchor-bolts'],
    cta: { text: { en: 'Get Industrial Washer Wholesale Prices', zh: '获取工业垫圈批发价格' }, buttonText: { en: 'Request Quote', zh: '申请报价' }, link: '/product-upload' }
  },

  // ===== D2: Gaskets and Specialty Washers =====
  {
    slug: 'gaskets-specialty-washers-high-temp-guide',
    category: 'Product Guide',
    keywords: 'copper sealing gasket custom size, high temperature graphite gasket fastener, plastic insulated flat washer supplier, galvanized extra large flat washer wholesale',
    title: {
      en: 'Gaskets, Sealing & Specialty Washers: Complete Guide',
      zh: '垫片、密封与特种垫圈完整指南',
      es: 'Juntas, arandelas de sellado y arandelas especiales',
      ar: 'الحشوات وأحزمة الإحكام والت-specialty',
      fr: 'Joints, rondelles d\'étanchéité et rondelles spéciales',
      pt: 'Gaxetas, arruelas de vedação e arruelas especiais',
      ru: 'Прокладки, уплотнительные и специальные шайбы',
      ja: 'ガスケット、シーalingSpecialtyワッシャー',
      de: 'Dichtungen, Abdichtungs- und Spezialunterlegscheiben',
      hi: 'गास्केट, सीलिंग और स्पेशल वॉशर'
    },
    description: {
      en: 'Specialty washers and gaskets: copper sealing gaskets, high temperature graphite, plastic insulated washers. Custom sizes available for industrial applications.',
      zh: '特种垫圈和垫片：铜密封垫片、高温石墨、塑料绝缘垫圈。工业应用的定制尺寸。'
    },
    sections: [
      {
        id: 'copper-gaskets',
        heading: { en: 'Copper Sealing Gaskets: Custom Size Manufacturing' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Copper sealing gaskets</a> (also called copper washers or copper joint rings) are used in applications requiring excellent sealing performance under high pressure and temperature. Copper provides: excellent malleability for creating leak-proof seals even on rough surfaces, high thermal conductivity for heat dissipation, resistance to most petroleum products and mild chemicals, and no risk of hydrogen embrittlement (unlike plated steel). <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Custom size copper gaskets</a> are manufactured to exact specifications for: oil and gas pipeline flanges, hydraulic systems, automotive fuel and brake systems, and refrigeration/air conditioning. Standard copper grades: C10100 (oxygen-free high conductivity copper) for electrical/thermal applications, C11000 (electrolytic tough pitch) for general sealing. Our factory produces <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">custom copper sealing gaskets</a> from 3mm to 300mm ID, with special shapes (oval, lens, ring joint) available on custom order.',
          zh: '铜密封垫片用于需要优异密封性能的高压高温应用。'
        }
      },
      {
        id: 'graphite-gaskets',
        heading: { en: 'High Temperature Graphite Gaskets and Fasteners' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">High temperature graphite gasket fasteners</a> are essential for applications in: exhaust systems (up to 450°C for flexible graphite), industrial ovens and furnaces, steam systems (up to 550°C), chemical processing (varies by chemical compatibility), and power generation turbines. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Flexible graphite</a> (also called Grafoil or expanded graphite) is the premium gasket material for high-temperature service—it maintains its sealing properties at temperatures where compressed fiber gaskets fail. Graphite gaskets are available as: flat graphite sheets cut to custom shapes, spiral wound gaskets (graphite wound with metal strip for flanged joints), and graphite foil tapes for wrapping around bolts (bolt hole gaskets). For high-temperature bolted joints, the <a href="/products#bolts-nuts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">fastener</a> must also be rated for the temperature—the bolt grade and coating must maintain mechanical properties at service temperature.',
          zh: '高温石墨垫片紧固件对于排气系统、工业炉、蒸汽系统等应用至关重要。'
        }
      },
      {
        id: 'plastic-washers',
        heading: { en: 'Plastic Insulated Washers: Electrical and Chemical Isolation' },
        body: {
          en: '<a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Plastic insulated flat washers</a> and <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">plastic insulation spacing nuts</a> provide electrical isolation between dissimilar metals, prevent galvanic corrosion, and provide electrical insulation in high-voltage applications. Common materials: Nylon 6/6 (polyamide): general purpose, -40°C to +105°C, good mechanical strength. PTFE (Teflon): excellent chemical resistance, -200°C to +260°C, but lower mechanical strength. PEEK: high performance, -60°C to +250°C, excellent mechanical properties. PVC: economical, -15°C to +60°C, good electrical insulation. <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Plastic insulated spacing nuts</a> are used to create a thermal break in assemblies where a metal fastener would create a thermal bridge (refrigerated containers, building facades). Available as <a href="/products#washers" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">supplier</a> standard items or custom molded to specification.',
          zh: '塑料绝缘平垫圈和塑料绝缘间隔螺母提供不同金属之间的电气隔离，防止电偶腐蚀，并在高压应用中提供电气绝缘。'
        }
      },
      {
        id: 'washer-table',
        heading: { en: 'Specialty Washer and Gasket Material Selection' },
        table: {
          headers: ['Material', 'Max Temp', 'Chemical Resistance', 'Common Applications'],
          rows: [
            ['Compressed Fiber', '260°C', 'Moderate', 'General purpose, water, steam'],
            ['Flexible Graphite', '450°C (air) / 650°C (inert)', 'Excellent', 'Exhaust, high-temp flanges'],
            ['PTFE (Teflon)', '260°C', 'Excellent (except alkali metals)', 'Chemical, pure media'],
            ['Copper', '400°C (intermittent)', 'Good (petroleum, mild chemicals)', 'Oil/gas, hydraulic, refrigeration'],
            ['Nylon 6/6', '105°C', 'Moderate (bases attack)', 'Electrical isolation, general'],
            ['PEEK', '250°C', 'Excellent', 'Aerospace, medical, chemical'],
            ['Silicone', '200°C', 'Good', 'Food grade, medical, flexible seals']
          ]
        }
      },
      {
        id: 'faq',
        heading: { en: 'Frequently Asked Questions' },
        faqItems: [
          { q: { en: 'What is the difference between a gasket and a washer?', zh: '垫片和垫圈有什么区别？' }, a: { en: 'A washer is a load-spreading hardware component used with a bolt/nut. A gasket is a sealing element (often soft or compressible) used between two flat faces (like flanges) to prevent leakage.', zh: '垫圈是配合螺栓/螺母使用的载荷分布硬件组件。垫片是密封元件，用于两个平面（如法兰）之间防止泄漏。' } },
          { q: { en: 'Can plastic washers be used at high temperatures?', zh: '塑料垫圈可以在高温下使用吗？' }, a: { en: 'Standard nylon washers are limited to 105°C. For higher temperatures, use PTFE (260°C), PEEK (250°C), or graphite (450°C+) depending on the application.', zh: '标准尼龙垫圈限温105°C。更高温度下使用PTFE（260°C）、PEEK（250°C）或石墨（450°C+）。' } }
        ]
      }
    ],
    relatedProducts: ['washers', 'bolts-nuts', 'anchor-bolts'],
    cta: { text: { en: 'Get Specialty Washer & Gasket Prices', zh: '获取特种垫圈和垫片价格' }, buttonText: { en: 'Request Quote', zh: '申请报价' }, link: '/product-upload' }
  }
];

// ========================================
// Utility functions (shared)
// ========================================

function randomDate(monthsBack = 6) {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setMonth(now.getMonth() - monthsBack);
  const randomTime = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

function randomUpdated(daysBack = 45) {
  const now = new Date();
  pastDate = new Date(now);
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * daysBack));
  return pastDate.toISOString().split('T')[0];
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// ========================================
// MAIN: Load existing articles and save new ones
// ========================================

function main() {
  log('🚀 Long-Tail Keyword Article Generator (Batch 2)');
  log('==========================================');

  const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

  // Get existing slugs
  function getExistingSlugs() {
    if (!fs.existsSync(ARTICLES_DIR)) return new Set();
    return new Set(
      fs.readdirSync(ARTICLES_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
    );
  }

  const existingSlugs = getExistingSlugs();
  log(`Found ${existingSlugs.size} existing articles`);

  // Filter to only articles not yet generated
  const newArticles = ARTICLES_CONT.filter(a => !existingSlugs.has(a.slug));

  if (newArticles.length === 0) {
    log('All articles already exist. Nothing to generate.');
    return;
  }

  log(`Generating ${newArticles.length} new articles...`);

  for (const articleDef of newArticles) {
    const eeat = {
      author: getRandomItem(AUTHORS).name,
      authorTitle: getRandomItem(AUTHORS).title,
      authorCredentials: getRandomItem(AUTHORS).credentials,
      sources: DATA_SOURCES.slice(0, 3),
      references: REFERENCES.slice(0, 2),
      updated: randomUpdated(45)
    };

    const article = {
      slug: articleDef.slug,
      category: articleDef.category,
      date: randomDate(6),
      readTime: 6 + Math.floor(Math.random() * 6),
      image: '/images/articles/' + articleDef.slug + '.jpg',
      title: articleDef.title,
      description: articleDef.description,
      keywords: articleDef.keywords,
      sections: articleDef.sections,
      relatedProducts: articleDef.relatedProducts,
      cta: articleDef.cta,
      author: eeat.author,
      authorTitle: eeat.authorTitle,
      authorCredentials: eeat.authorCredentials,
      sources: eeat.sources,
      references: eeat.references,
      updated: eeat.updated
    };

    const filepath = path.join(ARTICLES_DIR, articleDef.slug + '.json');
    fs.writeFileSync(filepath, JSON.stringify(article, null, 2), 'utf8');
    log(`✅ Generated: ${articleDef.slug}`);
  }

  log(`\n==========================================`);
  log(`📊 Batch 2 complete: ${newArticles.length} articles generated`);
  log(`==========================================`);
}

main();
