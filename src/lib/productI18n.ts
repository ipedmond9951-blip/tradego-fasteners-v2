// 产品详情页的多语言文案（名称 / 简述 / 页面小标签）
// 2026-11-22 新增：产品详情页体系
import { type Locale } from '@/i18n'

type Dict = Record<string, string>

export const productNames: Record<string, Dict> = {
  'drywall-screws': {
    en: 'Drywall Screws', zh: '干墙钉', es: 'Tornillos para yeso', ar: 'مسامير الجبس',
    fr: 'Vis à cloison sèche', pt: 'Parafusos para drywall', ru: 'Саморезы для гипсокартона',
    ja: '石膏ボードねじ', de: 'Trockenbau-Schrauben', hi: 'ड्राईवॉल स्क्रू',
  },
  'self-drilling-screws': {
    en: 'Self-Drilling Screws', zh: '自钻自攻钉', es: 'Tornillos autotaladrantes', ar: 'مسامير ذاتية الحفر',
    fr: 'Vis autoperceuses', pt: 'Parafusos autoatarraventantes', ru: 'Саморезы с буром',
    ja: 'セルフドリリングねじ', de: 'Selbstbohrschrauben', hi: 'स्व-ड्रिलिंग स्क्रू',
  },
  'bolts-nuts': {
    en: 'Bolts & Nuts', zh: '螺栓与螺母', es: 'Pernos y tuercas', ar: 'براغي وصواميل',
    fr: 'Boulons et écrous', pt: 'Parafusos e porcas', ru: 'Болты и гайки',
    ja: 'ボルト・ナット', de: 'Schrauben und Muttern', hi: 'बोल्ट और नट्स',
  },
  'ibr-nails': {
    en: 'IBR Nails', zh: 'IBR 屋面钉', es: 'Clavos IBR', ar: 'مسامير IBR',
    fr: 'Clous IBR', pt: 'Pregos IBR', ru: 'Гвозди IBR',
    ja: 'IBR釘', de: 'IBR-Nägel', hi: 'IBR नेल',
  },
  'anchor-bolts': {
    en: 'Anchor Bolts', zh: '地脚螺栓', es: 'Pernos de anclaje', ar: 'براغي التثبيت',
    fr: 'Boulons d’ancrage', pt: 'Parafusos de ancoragem', ru: 'Анкерные болты',
    ja: 'アンカーボルト', de: 'Ankerbolzen', hi: 'एंकर बोल्ट',
  },
  'washers': {
    en: 'Washers', zh: '垫圈', es: 'Arandelas', ar: 'حلقات التثبيت',
    fr: 'Rondelles', pt: 'Arruelas', ru: 'Шайбы',
    ja: 'ワッシャー', de: 'Unterlegscheiben', hi: 'वॉशर',
  },
  'coach-screws': {
    en: 'Coach Screws', zh: '木螺丝', es: 'Tirafondos para madera', ar: 'مسامير خشب',
    fr: 'Tirefonds', pt: 'Parafusos para madeira', ru: 'Глухари для дерева',
    ja: 'コーチねじ', de: 'Holzschrauben', hi: 'कोच स्क्रू',
  },
  'threaded-rods': {
    en: 'Threaded Rods', zh: '螺纹杆（牙条）', es: 'Varillas roscadas', ar: 'قضبان ملولبة',
    fr: 'Tiges filetées', pt: 'Barras roscadas', ru: 'Резьбовые стержни',
    ja: '全ねじボルト', de: 'Gewindestangen', hi: 'थ्रेडेड रॉड',
  },
  'chipboard-screws': {
    en: 'Chipboard Screws', zh: '刨花板螺丝', es: 'Tornillos para aglomerado', ar: 'براغي ألواح الخشب',
    fr: 'Vis pour aggloméré', pt: 'Parafusos para aglomerado', ru: 'Шурупы для ДСП',
    ja: 'パーティクルボードねじ', de: 'Spanplattenschrauben', hi: 'चिपबोर्ड स्क्रू',
  },
  'concrete-screws': {
    en: 'Concrete Screws', zh: '混凝土螺钉', es: 'Tornillos para hormigón', ar: 'براغي خرسانة',
    fr: 'Vis béton', pt: 'Parafusos para concreto', ru: 'Бетонные винты',
    ja: 'コンクリートねじ', de: 'Beton-Schrauben', hi: 'कंक्रीट स्क्रू',
  },
  'self-tapping-screws': {
    en: 'Self-Tapping Screws', zh: '自攻螺钉', es: 'Tornillos autorroscantes', ar: 'براغي ذاتية اللولبة',
    fr: 'Vis taraudeuses', pt: 'Parafusos autoatarraxantes', ru: 'Самонарезающие винты',
    ja: 'タッピングねじ', de: 'Blechschrauben', hi: 'सेल्फ-टैपिंग स्क्रू',
  },
  'blind-rivets': {
    en: 'Blind Rivets', zh: '抽芯铆钉', es: 'Remaches ciegos', ar: 'مسامير برشام',
    fr: 'Rivets aveugles', pt: 'Rebites cegos', ru: 'Заклёпки',
    ja: 'ブラインドリベット', de: 'Blindnieten', hi: 'ब्लाइंड रिवेट',
  },
  'coil-nails': {
    en: 'Coil Nails', zh: '卷钉', es: 'Clavos en rollo', ar: 'مسامير ملفوفة',
    fr: 'Clous en rouleau', pt: 'Pregos em rolo', ru: 'Гвозди в кассете',
    ja: 'コイル釘', de: 'Magazinnägel', hi: 'कॉइल नेल',
  },
  'common-nails': {
    en: 'Common Nails', zh: '普通圆钉', es: 'Clavos comunes', ar: 'مسامير عادية',
    fr: 'Clous ordinaires', pt: 'Pregos comuns', ru: 'Строительные гвозди',
    ja: '普通釘', de: 'Drahtnägel', hi: 'कॉमन नेल',
  },
  'sleeve-anchors': {
    en: 'Sleeve Anchors', zh: '套管锚栓', es: 'Anclajes de manguito', ar: 'مراسي كمّية',
    fr: 'Chevilles à douille', pt: 'Chumbadores de luva', ru: 'Гильзовые анкеры',
    ja: 'スリーブアンカー', de: 'Hülsendübel', hi: 'स्लीव एंकर',
  },
  'expansion-bolts': {
    en: 'Expansion Bolts', zh: '膨胀螺栓', es: 'Pernos de expansión', ar: 'براغي تمدد',
    fr: 'Boulons à expansion', pt: 'Parafusos de expansão', ru: 'Распорные анкерные болты',
    ja: 'エキスパンションボルト', de: 'Spreizanker', hi: 'एक्सपैंशन बोल्ट',
  },
  'concrete-nails': {
    en: 'Concrete Nails', zh: '混凝土钢钉', es: 'Clavos para hormigón', ar: 'مسامير خرسانية',
    fr: 'Clous pour béton', pt: 'Pregos para concreto', ru: 'Гвозди по бетону',
    ja: 'コンクリート釘', de: 'Betonnägel', hi: 'कंक्रीट कीलें',
  },
  'shooting-nails': {
    en: 'Shooting Nails', zh: '射钉', es: 'Clavos de fijación por pólvora', ar: 'مسامير طلقات',
    fr: 'Clous de scellement à poudre', pt: 'Pregos de fixação a pólvora', ru: 'Дюбель-гвозди для монтажного пистолета',
    ja: '射钉（パウダー打ち込み）', de: 'Schussnägel', hi: 'पाउडर एक्ट्यूएटेड कील',
  },
  'clout-nails': {
    en: 'Clout Nails', zh: '油毡钉（大帽钉）', es: 'Clavos de cabeza ancha', ar: 'مسامير عريضة الرأس',
    fr: 'Clous à large tête', pt: 'Pregos de cabeça larga', ru: 'Гвозди с широкой головкой',
    ja: 'クルート釘', de: 'Breitkopf-Nägel', hi: 'क्लाउट कीलें',
  },
  'duplex-nails': {
    en: 'Duplex Nails', zh: '双头钉', es: 'Clavos dúplex', ar: 'مسامير مزدوجة الرأس',
    fr: 'Clous duplex', pt: 'Pregos de cabeça dupla', ru: 'Гвозди с двойной головкой',
    ja: 'ダブルヘッド釘', de: 'Doppelkopf-Nägel', hi: 'डुप्लेक्स कीलें',
  },
  'wedge-anchors': {
    en: 'Wedge Anchors', zh: '楔形锚栓', es: 'Anclajes de cuña', ar: 'مراسي وتدية',
    fr: 'Chevilles à coin', pt: 'Chumbadores de cunha', ru: 'Клиновые анкеры',
    ja: 'ウェッジアンカー', de: 'Keilanker', hi: 'वेज एंकर',
  },
  'drop-in-anchors': {
    en: 'Drop-in Anchors', zh: '内迫式锚栓', es: 'Anclajes drop-in', ar: 'مراسي داخلية',
    fr: 'Chevilles à frapper', pt: 'Chumbadores drop-in', ru: 'Анкеры с внутренней резьбой',
    ja: 'ドロップインアンカー', de: 'Drop-in-Anker', hi: 'ड्रॉप-इन एंकर',
  },
  'set-anchors': {
    en: 'Set Anchors', zh: '顶爆锚栓', es: 'Anclajes set', ar: 'مراسي برغي آلية',
    fr: 'Chevilles set', pt: 'Chumbadores set', ru: 'Анкеры set',
    ja: 'セットアンカー', de: 'Set-Anker', hi: 'सेट एंकर',
  },
  'bolt-anchors': {
    en: 'Bolt Anchors', zh: '穿墙螺栓锚栓', es: 'Anclajes tipo perno', ar: 'مراسي برغية',
    fr: 'Chevilles boulons', pt: 'Chumbadores tipo parafuso', ru: 'Болт-анкеры',
    ja: 'ボルトアンカー', de: 'Bolzenanker', hi: 'बोल्ट एंकर',
  },
  'butyl-tape': {
    en: 'Butyl Tape', zh: '丁基防水胶带', es: 'Cinta de butilo', ar: 'شريط بوتيل',
    fr: 'Bande butyle', pt: 'Fita de butil', ru: 'Бутиловая лента',
    ja: 'ブチルテープ', de: 'Butylband', hi: 'ब्यूटाइल टेप',
  },
  'asphalt-flash-band': {
    en: 'Asphalt Flash Band', zh: '沥青自粘泛水带', es: 'Banda asfáltica autoadhesiva', ar: 'شريط أسفلتي لاصق',
    fr: 'Bande bitumineuse autocollante', pt: 'Fita asfáltica autoadesiva', ru: 'Битумная самоклеящаяся лента',
    ja: 'アスファルト防水テープ', de: 'Bitumen-Klebeband', hi: 'एस्फाल्ट फ्लैश बैंड',
  },
  'non-woven-fabric': {
    en: 'Non-woven Fabric', zh: '无纺布', es: 'Tela no tejida', ar: 'قماش غير منسوج',
    fr: 'Tissu non tissé', pt: 'Tecido não tecido', ru: 'Нетканое полотно',
    ja: '不織布', de: 'Vliesstoff', hi: 'नॉन-वुवेन फ़ैब्रिक',
  },
  'waterproof-coating': {
    en: 'Waterproof Coating', zh: '防水涂料', es: 'Recubrimiento impermeable', ar: 'طلاء عازل للماء',
    fr: 'Revêtement imperméable', pt: 'Revestimento impermeável', ru: 'Гидроизоляционная мастика',
    ja: '防水塗料', de: 'Dichtungsbeschichtung', hi: 'वॉटरप्रूफ़ कोटिंग',
  },
  'waterproof-membrane': {
    en: 'Waterproof Membrane', zh: '防水卷材', es: 'Membrana impermeable', ar: 'غشاء عازل للماء',
    fr: 'Membrane imperméable', pt: 'Membrana impermeável', ru: 'Гидроизоляционная мембрана',
    ja: '防水シート', de: 'Abdichtungsbahn', hi: 'वॉटरप्रूफ़ झिल्ली',
  },

  'u-bolts': { en: 'U-Bolts', zh: 'U 型螺栓', es: 'Pernos en U', ar: 'براغي على شكل U', fr: 'Boulons en U', pt: 'Parafusos em U', ru: 'U-образные болты', ja: 'Uボルト', de: 'U-Bügel', hi: 'यू बोल्ट' },
  'eye-bolts': { en: 'Eye Bolts', zh: '吊环螺栓', es: 'Pernos con ojo', ar: 'براغي حلقية', fr: 'Boulons à œil', pt: 'Parafusos com olhal', ru: 'Рымы-болты', ja: 'アイボルト', de: 'Augenschrauben', hi: 'आई बोल्ट' },
  'foundation-bolts': { en: 'Foundation Bolts', zh: '地脚螺栓', es: 'Pernos de cimentación', ar: 'براغي أساسات', fr: 'Boulons de fondation', pt: 'Parafusos de fundação', ru: 'Фундаментные болты', ja: '基礎ボルト', de: 'Fundamentbolzen', hi: 'फाउंडेशन बोल्ट' },
  'carriage-bolts': { en: 'Carriage Bolts', zh: '马车螺栓', es: 'Pernos de carro', ar: 'براغي عربة', fr: 'Boulons de charrette', pt: 'Parafusos de carro', ru: 'Вагонные болты', ja: 'キャリッジボルト', de: 'Schlossschrauben', hi: 'कैरिज बोल्ट' },
  'allen-bolts': { en: 'Allen Bolts', zh: '内六角螺栓', es: 'Pernos Allen', ar: 'براغي ألن', fr: 'Vis à six pans creux', pt: 'Parafusos Allen', ru: 'Болты с внутренним шестигранником', ja: '六角穴付ボルト', de: 'Innensechskantschrauben', hi: 'एलन बोल्ट' },
  'hanger-bolts': { en: 'Hanger Bolts', zh: '双头牙螺栓', es: 'Pernos colgantes', ar: 'براغي تعليق', fr: 'Boulons de suspension', pt: 'Parafusos de suspensão', ru: 'Болты-подвесы', ja: 'ハンガーボルト', de: 'Hängebolzen', hi: 'हैंगर बोल्ट' },
  'hex-nuts': { en: 'Hex Nuts', zh: '六角螺母', es: 'Tuercas hexagonales', ar: 'صواميل سداسية', fr: 'Écrous hexagonaux', pt: 'Porcas sextavadas', ru: 'Гайки шестигранные', ja: '六角ナット', de: 'Sechskantmuttern', hi: 'हेक्स नट' },
  'nylon-lock-nuts': { en: 'Nylon Lock Nuts', zh: '尼龙锁紧螺母', es: 'Tuercas autoblocantes', ar: 'صواميل قفل النايلون', fr: 'Écrous à freinage interne', pt: 'Porcas de trava', ru: 'Гайки с нейлоновой вставкой', ja: 'ナイロンロックナット', de: 'Seckskantmuttern mit Klemmteil', hi: 'नायलॉक नट' },
  'spring-washers': { en: 'Spring Washers', zh: '弹簧垫圈', es: 'Arandelas elásticas', ar: 'حلقات نابضية', fr: 'Rondelles ressorts', pt: 'Arruelas de mola', ru: 'Пружинные шайбы', ja: 'バネ座金', de: 'Federringe', hi: 'स्प्रिंग वॉशर' },
  'solar-brackets': { en: 'Solar Brackets', zh: '光伏支架', es: 'Soportes solares', ar: 'حوامل شمسية', fr: 'Supports solaires', pt: 'Suportes solares', ru: 'Солнечные кронштейны', ja: 'ソーラー架台', de: 'Solarhalterungen', hi: 'सोलर ब्रैकेट' },
  'flange-bolts': { en: 'Flange Bolts', zh: '法兰面螺栓', es: 'Pernos con brida', ar: 'براغي ذات فلنجة', fr: 'Boulons à bride', pt: 'Parafusos com flanges', ru: 'Болты с фланцем', ja: 'フランジボルト', de: 'Flanschschrauben', hi: 'फ्लैंज बोल्ट' },
  'stud-bolts': { en: 'Stud Bolts', zh: '双头螺柱', es: 'Espárragos', ar: 'براغي مزدوجة', fr: 'Goujons', pt: 'Parafusos prisioneiros', ru: 'Шпильки', ja: 'スタッドボルト', de: 'Stehbolzen', hi: 'स्टड बोल्ट' },
  'machine-screws': { en: 'Machine Screws', zh: '机螺钉', es: 'Tornillos mecánicos', ar: 'براغي آلية', fr: 'Vis de machine', pt: 'Parafusos de máquina', ru: 'Машинные винты', ja: '機械ねじ', de: 'Maschinenschrauben', hi: 'मशीन स्क्रू' },
  'rivet-nuts': { en: 'Rivet Nuts', zh: '拉铆螺母', es: 'Tuercas remachables', ar: 'صواميل برشام', fr: 'Écrous rivets', pt: 'Porcas rebitadas', ru: 'Заклёпочные гайки', ja: 'リベットナット', de: 'Blindnietmuttern', hi: 'रिवेट नट' },
  'flange-nuts': { en: 'Flange Nuts', zh: '法兰螺母', es: 'Tuercas con brida', ar: 'صواميل بفلنجة', fr: 'Écrous à bride', pt: 'Porcas com flange', ru: 'Гайки с фланцем', ja: 'フランジナット', de: 'Flanschmuttern', hi: 'फ्लैंज नट' },
  'cap-nuts': { en: 'Cap Nuts', zh: '盖形螺母', es: 'Tuercas de tapa', ar: 'صواميل مقببة', fr: 'Écrous borgnes', pt: 'Porcas cegas', ru: 'Колпачковые гайки', ja: 'キャップナット', de: 'Hutmuttern', hi: 'कैप नट' },
  'wing-nuts': { en: 'Wing Nuts', zh: '蝶形螺母', es: 'Tuercas de mariposa', ar: 'صواميل فراشية', fr: 'Écrous papillon', pt: 'Porcas borboleta', ru: 'Барашковые гайки', ja: '蝶ナット', de: 'Flügelmuttern', hi: 'विंग नट' },
  'coupling-nuts': { en: 'Coupling Nuts', zh: '加长连接螺母', es: 'Tuercas de unión', ar: 'صواميل وصل', fr: 'Manchons filetés', pt: 'Porcas de união', ru: 'Соединительные гайки', ja: 'カップリングナット', de: 'Gewindemuffen', hi: 'कपलिंग नट' },
  'ground-screws': { en: 'Ground Screws', zh: '螺旋地桩', es: 'Tornillos de tierra', ar: 'براغي أرضية', fr: 'Vis de sol', pt: 'Estacas helicoidais', ru: 'Винтовые сваи', ja: 'グラウンドスクリュー', de: 'Erdschrauben', hi: 'ग्राउंड स्क्रू' },
  'lock-washers': { en: 'Lock Washers', zh: '锁紧垫圈', es: 'Arandelas de seguridad', ar: 'حلقات قفل', fr: 'Rondelles de blocage', pt: 'Arruelas de trava', ru: 'Стопорные шайбы', ja: 'ロックワッシャー', de: 'Sicherungsscheiben', hi: 'लॉक वॉशर' },
  'ptfe-nuts': { en: 'PTFE Insert Nuts', zh: 'PTFE 镶嵌螺母', es: 'Tuercas con inserto de PTFE', ar: 'صواميل بإدخال PTFE', fr: 'Écrous à insert PTFE', pt: 'Porcas com inserto PTFE', ru: 'Гайки с вкладышем PTFE', ja: 'PTFEインサートナット', de: 'Muttern mit PTFE-Einsatz', hi: 'PTFE इंसर्ट नट' },
  'wood-screws': { en: 'Wood Screws', zh: '木螺钉', es: 'Tornillos para madera', ar: 'مسامير خشب', fr: 'Vis à bois', pt: 'Parafusos para madeira', ru: 'Шурупы по дереву', ja: '木ねじ', de: 'Holzschrauben', hi: 'वुड स्क्रू' },
  'set-screws': { en: 'Set Screws', zh: '紧定螺钉', es: 'Tornillos de ajuste', ar: 'براغي تثبيت', fr: 'Vis de pression', pt: 'Parafusos de fixação', ru: 'Установочные винты', ja: '止めねじ', de: 'Gewindestifte', hi: 'सेट स्क्रू' },
  'eye-screws': { en: 'Eye Screws', zh: '羊眼螺钉', es: 'Tornillos de ojal', ar: 'براغي عينية', fr: 'Vis à oeil', pt: 'Parafusos com olhal', ru: 'Винты с кольцом', ja: 'アイスクリュー', de: 'Ösenhaken', hi: 'आई स्क्रू' },
  'semi-tubular-rivets': { en: 'Semi-Tubular Rivets', zh: '半空心铆钉', es: 'Remaches semitubulares', ar: 'مسامير برشام نصف أنبوبية', fr: 'Rivets semi-tubulaires', pt: 'Rebites semi-tubulares', ru: 'Полупустотные заклёпки', ja: '半管状リベット', de: 'Halbrohr-Nieten', hi: 'सेमी-ट्यूबुलर रिवेट' },
  'metal-brackets': { en: 'Metal Brackets', zh: '金属冲压支架', es: 'Soportes metálicos', ar: 'حوامل معدنية', fr: 'Supports métalliques', pt: 'Suportes metálicos', ru: 'Металлические кронштейны', ja: '金属ブラケット', de: 'Metallhalterungen', hi: 'मेटल ब्रैकेट' },
  'solar-hooks': { en: 'Solar Roof Hooks', zh: '光伏屋顶挂钩', es: 'Ganchos solares', ar: 'خطافات شمسية', fr: 'Crochets solaires', pt: 'Ganchos solares', ru: 'Солнечные крюки', ja: 'ソーラーフック', de: 'Solarhaken', hi: 'सोलर हुक' },
  'aluminum-profiles': { en: 'Aluminium Profiles', zh: '铝型材', es: 'Perfiles de aluminio', ar: 'مقاطع ألمنيوم', fr: 'Profilés aluminium', pt: 'Perfis de alumínio', ru: 'Алюминиевые профили', ja: 'アルミ形材', de: 'Aluminiumprofile', hi: 'एल्युमिनियम प्रोफाइल' },
  'solar-clamps': { en: 'Solar Clamps', zh: '光伏压块', es: 'Abrazaderas solares', ar: 'مشابك شمسية', fr: 'Pinces solaires', pt: 'Grampos solares', ru: 'Солнечные зажимы', ja: 'ソーラークランプ', de: 'Solarklemmen', hi: 'सोलर क्लैंप' },
  'steel-channels': { en: 'Steel Channels', zh: 'C 型钢', es: 'Perfiles C de acero', ar: 'مقاطع فولاذية C', fr: 'Profilés C en acier', pt: 'Perfis C de aço', ru: 'Стальные швеллеры', ja: 'C形鋼', de: 'Stahlprofile C', hi: 'स्टील चैनल' },
}

// 详情页简述（en / zh 为主，其它语言回落到 en）
export const productDescriptions: Record<string, Dict> = {
  'drywall-screws': {
    en: 'Bugle-head drywall screws for gypsum board and wood or metal studs. Coarse thread grips timber, fine thread grips steel studs. Phosphate or zinc plated, 3.5–4.8 mm × 25–100 mm.',
    zh: '喇叭头干墙钉，适用于石膏板与木龙骨/轻钢龙骨。粗牙咬木、细牙咬钢，磷化或镀锌处理，规格 3.5–4.8mm × 25–100mm。',
  },
  'self-drilling-screws': {
    en: 'TEK screws with a built-in drill point that drills, taps and fastens metal in one pass — no pre-drilling. DIN 7504 compliant, with EPDM washer options for waterproof roofing.',
    zh: '自钻自攻钉（TEK 钉）自带钻头，一次完成钻孔、攻丝、锁紧，无需预钻孔。符合 DIN 7504，可配 EPDM 防水垫用于屋面。',
  },
  'bolts-nuts': {
    en: 'Hex bolts and nuts in Grade 4.8 / 8.8 / 10.9, carbon steel or stainless 304/316, M5–M30 with lengths 20–300 mm. Full thread DIN 933 and partial thread DIN 931.',
    zh: '六角螺栓与螺母，4.8 / 8.8 / 10.9 级，碳钢或不锈钢 304/316，规格 M5–M30、长度 20–300mm。全牙 DIN 933 与半牙 DIN 931。',
  },
  'ibr-nails': {
    en: 'Umbrella-head roofing nails for IBR and corrugated sheeting, SABS 1195 compliant. Smooth or ring shank, electro-galvanized, 2.5–4.0 mm × 30–100 mm.',
    zh: '伞形头屋面钉，专用于 IBR 与波纹屋面板，符合 SABS 1195。光杆或环纹杆，电镀锌，规格 2.5–4.0mm × 30–100mm。',
  },
  'anchor-bolts': {
    en: 'Heavy-duty foundation and anchor bolts, M10–M30 with lengths 75–600 mm, hot-dip galvanized. DIN 529, ASTM F1554 and SABS 153 grades available.',
    zh: '重型地脚/锚固螺栓，M10–M30、长度 75–600mm，热镀锌。可提供 DIN 529、ASTM F1554 与 SABS 153 等级。',
  },
  'washers': {
    en: 'Flat, spring and lock washers M6–M36 to DIN 125 / ISO 7089 / DIN 127, in zinc plated carbon steel, hot-dip galvanized or stainless 304/316.',
    zh: '平垫、弹垫与锁紧垫圈，M6–M36，符合 DIN 125 / ISO 7089 / DIN 127，材质含镀锌碳钢、热镀锌与不锈钢 304/316。',
  },
  'coach-screws': {
    en: 'Hex-head coach screws (lag screws) for structural timber connections, M6–M12 × 30–200 mm, hot-dip galvanized for outdoor and coastal jobs.',
    zh: '六角头木螺丝（马车螺栓），用于木结构承重连接，M6–M12 × 30–200mm，热镀锌适用于户外与沿海环境。',
  },
  'threaded-rods': {
    en: 'Fully threaded rods M6–M24 in 1 m / 2 m / 3 m lengths, Grade 4.8 / 8.8 / 10.9, zinc plated, HDG or stainless 304/316, cut-to-size available.',
    zh: '全牙螺纹杆，M6–M24，1m/2m/3m 定尺，4.8/8.8/10.9 级，可镀锌、热镀锌或不锈钢 304/316，支持定尺切割。',
  },
  'chipboard-screws': {
    en: 'Countersunk particle-board screws with coarse or fine thread, 3.5–5.0 mm × 16–120 mm. Yellow zinc, white zinc or black phosphate; Pozi, Phillips or Torx drive.',
    zh: '喇叭头刨花板螺丝，粗牙或细牙，规格 3.5–5.0mm × 16–120mm。黄锌、白锌或黑磷化，十字、米字或梅花槽。',
  },
  'concrete-screws': {
    en: 'Concrete anchor screws that cut their own thread — no pre-drilling, no resin, removable. 6.0 / 7.5 mm × 40–200 mm, hex or Torx head, yellow or white zinc.',
    zh: '混凝土锚固螺钉，自行切螺纹，无需预钻孔、无胶管、可拆卸。6.0 / 7.5mm × 40–200mm，六角或梅花头，黄锌或白锌。',
  },
  'self-tapping-screws': {
    en: 'Self-tapping screws for sheet metal, plastics and wood, 3.5–6.5 mm × 9.5–200 mm. Pan, wafer, countersunk or oval head; zinc, black oxide or ruspert.',
    zh: '自攻螺钉，适用于薄板金属、塑料与木材，3.5–6.5mm × 9.5–200mm。盘头、大帽头、沉头或半沉头，镀锌、发黑或 ruspert。',
  },
  'blind-rivets': {
    en: 'Blind rivets 3.2 / 4.0 / 4.8 / 6.4 mm in aluminium, steel or stainless — large flange, countersunk and structural multi-grip versions. DIN 7337.',
    zh: '抽芯铆钉 3.2 / 4.0 / 4.8 / 6.4mm，铝、钢或不锈钢材质，可选大帽沿、沉头与结构型多档铆钉。符合 DIN 7337。',
  },
  'coil-nails': {
    en: 'Collated coil nails 2.5–3.3 mm × 50–90 mm at 15° / 21° / 28°, smooth or ring shank, bright, electro-galvanized or HDG. For framing nailers.',
    zh: '卷钉 2.5–3.3mm × 50–90mm，15°/21°/28° 排角，光杆或环纹杆，光亮、电镀锌或热镀锌，适配气动打钉枪。',
  },
  'common-nails': {
    en: 'Flat-head common nails 1″–8″ (2.0–6.0 mm × 25–200 mm), bright, electro-galvanized or hot-dip galvanized, in 25 kg cartons.',
    zh: '普通圆钉 1″–8″（2.0–6.0mm × 25–200mm），光亮、电镀锌或热镀锌，25kg 纸箱装。',
  },
  'sleeve-anchors': {
    en: 'Sleeve anchors M6–M20 in stainless 304/316 or zinc-plated steel, with hex nut and washer. Sleeve, drop-in and wedge versions for concrete and brick.',
    zh: '套管锚栓 M6–M20，不锈钢 304/316 或镀锌碳钢，配六角螺母与垫圈。含套管型、内迫型与楔形型，适用混凝土与砖砌体。',
  },
  'expansion-bolts': {
    en: 'Wedge-type expansion bolts M6–M24 × 50–300 mm, zinc-plated, hot-dip galvanized or stainless, for structural and equipment anchoring.',
    zh: '楔形膨胀螺栓 M6–M24 × 50–300mm，镀锌、热镀锌或不锈钢，用于结构件与设备锚固。',
  },
  'concrete-nails': {
    en: 'Hardened concrete nails 1″-5″ (2.0-5.0 mm × 25-125 mm) for fixing timber battens, frames and formwork straight into concrete, mortar or block. Blue-black or zinc plated, 25 kg cartons.',
    zh: '混凝土钢钉 1″–5″（2.0–5.0mm × 25–125mm），经淬火处理，可直接钉入混凝土、砂浆或砌块，用于固定木龙骨、门窗框与模板。发蓝或镀锌，25kg 纸箱装。',
  },
  'shooting-nails': {
    en: 'Powder-actuated shooting nails 3.0-4.5 mm × 19-72 mm with red plastic collar, for fastening into Q235 steel plate 0.8-1.2 mm and concrete C20 and above. Fasteners only — tool and cartridges not included.',
    zh: '射钉 3.0–4.5mm × 19–72mm，配红色塑料定位垫圈，用于射入 Q235 钢板（0.8–1.2mm）及 C20 以上混凝土。仅供应钉体，不含射钉枪与弹药。',
  },
  'clout-nails': {
    en: 'Wide-head clout nails 2.0-3.5 mm × 19-75 mm for roofing felt, waterproof membrane and insulation board. Electro-galvanized or hot-dip galvanized, smooth or ring shank, 25 kg cartons.',
    zh: '大帽油毡钉 2.0–3.5mm × 19–75mm，用于固定油毡、防水卷材与保温板。电镀锌或热镀锌，光杆或环纹，25kg 纸箱装。',
  },
  'duplex-nails': {
    en: 'Double-head duplex nails 2.8-4.0 mm × 50-100 mm for scaffold boards, formwork and temporary bracing — the upper head lets them be pulled out and re-used.',
    zh: '双头钉 2.8–4.0mm × 50–100mm，用于脚手架板、模板与临时支撑，上端第二个钉头便于拔出重复使用。',
  },
  'wedge-anchors': {
    en: 'Wedge anchors M6-M20 × 40-160 mm in SS304/316 or zinc-plated steel, with nut and washer. High load capacity in uncracked concrete for base plates and heavy equipment.',
    zh: '楔形锚栓 M6–M20 × 40–160mm，不锈钢 304/316 或镀锌碳钢，配螺母与垫圈。适用于未开裂混凝土中的高承载固定，如设备底座与钢结构。',
  },
  'drop-in-anchors': {
    en: 'Drop-in anchors M6-M20, internally threaded and set flush, for hanging conduit, cable tray, pipe and duct supports in concrete ceilings.',
    zh: '内迫式锚栓 M6–M20，内螺纹、安装后与基面齐平，用于混凝土顶板吊挂线管、桥架、管道与风管支架。',
  },
  'set-anchors': {
    en: 'Set anchors (machine screw anchors) M6-M16 × 25-65 mm in SS201/304 or zinc-plated steel, supplied with the screw, for quick fixing of light fixtures and brackets.',
    zh: '顶爆锚栓（机螺丝锚栓）M6–M16 × 25–65mm，不锈钢 201/304 或镀锌碳钢，自带螺栓，用于灯具、支架等轻型固定。',
  },
  'bolt-anchors': {
    en: 'Bolt anchors M6-M20 × 50-200 mm with hex bolt, expansion sleeve, nut and washer, for through-fixing base plates, racking and pipe supports.',
    zh: '穿墙螺栓锚栓 M6–M20 × 50–200mm，配六角螺栓、膨胀套筒、螺母与垫圈，用于设备底座、货架与管道支架的穿透式固定。',
  },
  'butyl-tape': {
    en: 'Butyl waterproofing tape with aluminium foil facing, 50-300 mm wide × 5-20 m rolls, permanently flexible for roof laps, gutters, flashings and wall junctions.',
    zh: '丁基防水胶带，铝箔覆面，宽 50–300mm、长 5–20m/卷，长期保持柔韧，用于屋面搭接、天沟、泛水与墙体接缝密封。',
  },
  'asphalt-flash-band': {
    en: 'Self-adhesive asphalt flash band, aluminium faced, 50-500 mm wide × 5-15 m rolls, for patching flashings, gutters, roof laps and pipe penetrations.',
    zh: '沥青自粘泛水带，铝箔覆面，宽 50–500mm、长 5–15m/卷，用于修补泛水、天沟、屋面搭接与穿管部位。',
  },
  'non-woven-fabric': {
    en: 'PP spunbond non-woven fabric, 30-150 gsm, in rolls 1.0-3.0 m wide × 50-100 m, used as waterproofing carrier, separation and filtration layer, and for covers and packaging.',
    zh: '聚丙烯纺粘无纺布，30–150 g/㎡，幅宽 1.0–3.0m、长 50–100m/卷，用作防水层胎基、隔离过滤层，以及包装与遮盖材料。',
  },
  'waterproof-coating': {
    en: 'Liquid waterproof coating — polyurethane, rubber asphalt or acrylic — in 5-20 kg pails, brushed or rolled to a seamless membrane on roofs, basements and wet areas.',
    zh: '防水涂料（聚氨酯、橡胶沥青或丙烯酸），5–20kg/桶，刷涂或滚涂形成无缝防水层，用于屋面、地下室与湿区。',
  },
  'waterproof-membrane': {
    en: 'Waterproof membrane — SBS modified bitumen, PVC or TPO — 3-4 mm, rolls 1.0-2.0 m × 10-20 m, for flat roofs, podium decks and basement tanking.',
    zh: '防水卷材（SBS 改性沥青、PVC 或 TPO），厚 3–4mm，幅宽 1.0–2.0m、长 10–20m/卷，用于平屋面、裙楼平台与地下室防水。',
  },

  'u-bolts': { en: 'DIN 3570 U-bolts in carbon steel, HDG and SS304/316, M6-M30, with nuts and plates, for pipe, pole and axle clamping.', zh: 'DIN3570 U 型螺栓，碳钢/热镀锌/不锈钢 304-316，M6-M30，配螺母与压板，用于管道、电杆、车桥固定。' },
  'eye-bolts': { en: 'DIN 580 lifting eye bolts M8-M24 in forged carbon steel and stainless, for slinging, rigging and tie-down points.', zh: 'DIN580 吊环螺栓 M8-M24，锻造碳钢与不锈钢，用于吊装、索具与绑扎固定点。' },
  'foundation-bolts': { en: 'Embedded foundation bolts M12-M36 in Q235B and grade 8.8, straight, L-bend and anchor-plate types for steel structures.', zh: '预埋地脚螺栓 M12-M36，Q235B 与 8.8 级，直杆、L 型与带锚板型，用于钢结构基础。' },
  'carriage-bolts': { en: 'DIN 603 carriage bolts M6-M20 with square neck and cup head, in carbon steel and stainless, for timber and steel connections.', zh: 'DIN603 马车螺栓 M6-M20，方颈圆头，碳钢与不锈钢，用于木结构及钢木连接。' },
  'allen-bolts': { en: 'DIN 912 socket head cap screws M6-M24, grade 8.8/10.9/12.9 and stainless, with full or part thread for machine building.', zh: 'DIN912 内六角圆柱头螺钉 M6-M24，8.8/10.9/12.9 级与不锈钢，全牙或半牙，用于机械装配。' },
  'hanger-bolts': { en: 'Hanger bolts with machine thread one end and wood thread the other, M6-M12, in zinc, HDG and stainless, for wood-to-metal fixing.', zh: '双头牙螺栓，一端机牙一端木牙，M6-M12，镀锌/热镀锌/不锈钢，用于木与金属连接。' },
  'hex-nuts': { en: 'DIN 934 hex nuts M6-M24 in grade 8 and 10, zinc, HDG and stainless, packed by weight or by box for site issue.', zh: 'DIN934 六角螺母 M6-M24，8 级与 10 级，镀锌/热镀锌/不锈钢，可按重量或盒装发货。' },
  'nylon-lock-nuts': { en: 'DIN 985 nylon insert lock nuts M6-M24 in zinc, HDG and stainless, for vibration-resistant joints without a second nut.', zh: 'DIN985 尼龙圈锁紧螺母 M6-M24，镀锌/热镀锌/不锈钢，用于免双螺母的防松连接。' },
  'spring-washers': { en: 'DIN 127 spring washers M6-M24 in spring steel, zinc and stainless, for keeping tension on vibrating joints.', zh: 'DIN127 弹簧垫圈 M6-M24，弹簧钢，镀锌与不锈钢，用于振动连接保持预紧。' },
  'solar-brackets': { en: 'Galvanized and aluminium solar mounting brackets - rails, hooks and clamps - for rooftop and ground arrays, packed for container export.', zh: '镀锌与铝制光伏支架——导轨、挂钩与压块，屋顶与地面阵列用，按集装箱包装出口。' },
  'flange-bolts': { en: 'Hex flange bolts M8-M20 to DIN 6921 in grade 8.8 and 10.9 - the flange spreads load so no separate washer is needed on steel frames.', zh: 'DIN6921 六角法兰面螺栓 M8-M20，8.8/10.9 级；法兰面自带垫片功能，钢构架固定可省一只平垫。' },
  'stud-bolts': { en: 'Fully threaded stud bolts M12-M30 in ASTM A193 B7 and grade 8.8, cut to length with two nuts, for flanges and heavy steel joints.', zh: '全螺纹双头螺柱 M12-M30，ASTM A193 B7 与 8.8 级，按长度切割配双螺母，用于法兰与重型钢节点。' },
  'machine-screws': { en: 'Pan, countersunk and hex head machine screws M4-M12 in zinc and stainless, for metal, plastics and electrical assemblies.', zh: '盘头、沉头、六角头机螺钉 M4-M12，镀锌与不锈钢，用于金属、塑料与电气装配。' },
  'rivet-nuts': { en: 'Blind rivet nuts M4-M10 in steel, aluminium and stainless for putting a machine thread into thin sheet without access to the back.', zh: '盲孔拉铆螺母 M4-M10，钢/铝/不锈钢，可在单面薄板上做出机牙螺纹，无需背面操作。' },
  'flange-nuts': { en: 'DIN 6923 hex flange nuts M6-M20 in grade 8 and 10, serrated or smooth flange, replacing a nut plus washer on steel joints.', zh: 'DIN6923 六角法兰螺母 M6-M20，8/10 级，齿面或光面法兰，钢节点上可替代螺母加平垫。' },
  'cap-nuts': { en: 'Dome cap nuts M6-M16 in zinc and stainless - they close the thread end so no water sits on the bolt and nothing snags on the protrusion.', zh: '球头盖形螺母 M6-M16，镀锌与不锈钢；封住螺纹端，避免积水积尘、避免外露螺尾刮碰。' },
  'wing-nuts': { en: 'Wing nuts M6-M12 in zinc and stainless for clamps, formwork and equipment that is tightened and released by hand.', zh: '蝶形螺母 M6-M12，镀锌与不锈钢，用于卡具、模板与需手工反复拆装的设备。' },
  'coupling-nuts': { en: 'Long coupling nuts M8-M20 for joining two threaded rods end to end, supplied with a hex body for wrench access.', zh: '加长连接螺母 M8-M20，用于把两根螺纹杆对接，六角外形便于扳手施力。' },
  'ground-screws': { en: 'Hot-dip galvanized helical ground screws 550-1200 mm for solar arrays, fences and light structures - no concrete, installed by machine.', zh: '热镀锌螺旋地桩 550-1200mm，用于光伏阵列、围栏与轻型结构；免混凝土，机械旋入安装。' },
  'lock-washers': { en: 'Toothed external and internal lock washers in spring steel and stainless, for joints where vibration rather than load is the problem.', zh: '外齿/内齿锁紧垫圈，弹簧钢与不锈钢，适用于以振动而非载荷为主的连接。' },
  'ptfe-nuts': { en: 'DIN 934 hex body with a PTFE insert that seals and locks - for chemical lines, water systems and joints that must stay leak-free.', zh: 'DIN934 六角基体加 PTFE 镶嵌层，兼具密封与防松，用于化工管路、水系统与不可渗漏的连接。' },
  'wood-screws': { en: 'Countersunk wood screws 3.0-6.0 mm in zinc and stainless, full or part thread, for joinery, decking and light timber framing.', zh: '沉头木螺钉 3.0-6.0mm，镀锌与不锈钢，全牙或半牙，用于细木工、铺板与轻型木结构。' },
  'set-screws': { en: 'Grub screws to DIN 913/914/916 in hex socket, slotted and cone point styles, for locking shafts, collars and pulleys.', zh: 'DIN913/914/916 紧定螺钉，内六角/一字，锥端与平端，用于锁紧轴、套环与皮带轮。' },
  'eye-screws': { en: 'Lag-style eye screws 4-12 mm in zinc and stainless, for rope, cable and light tie-down work in timber and posts.', zh: '木牙羊眼螺钉 4-12mm，镀锌与不锈钢，用于木料与立柱上的绳索、缆线及轻型绑扎。' },
  'semi-tubular-rivets': { en: 'Semi-tubular rivets 2.4-6.4 mm in steel, aluminium and copper, rolled with a simple press for light sheet and hardware assembly.', zh: '半空心铆钉 2.4-6.4mm，钢/铝/铜，配简易压铆工具滚压成形，用于薄板与五金装配。' },
  'metal-brackets': { en: 'Custom stamped and laser-cut brackets in Q235 and SS304, made to drawing with holes, folds and powder coating.', zh: 'Q235 与 SS304 定制冲压/激光切割支架，按图加工孔位与折弯，可做喷粉。' },
  'solar-hooks': { en: 'HDG and stainless roof hooks for tile, IBR and corrugated sheet, sized to the purlin spacing and supplied with fixing bolts.', zh: '热镀锌与不锈钢屋顶挂钩，适配瓦屋面、IBR 与波纹板，按檩条间距选型，配固定螺栓。' },
  'aluminum-profiles': { en: '6005-T5 solar rails and angle profiles, mill finish or anodized, cut to length with drilled fixing holes on request.', zh: '6005-T5 光伏导轨与角铝型材，本色或阳极氧化，可按长度切割并预钻孔。' },
  'solar-clamps': { en: 'Aluminium mid and end clamps for 30-40 mm framed modules, with the bolt, nut and washer packed as a set.', zh: '铝制中压块与边压块，适配 30-40mm 边框组件，螺栓螺母垫圈成套包装。' },
  'steel-channels': { en: 'Cold-formed C and U channels in 1.5-3 mm galvanized steel, cut to length for purlins, frames and solar ballast.', zh: '冷弯 C 型/U 型钢，1.5-3mm 镀锌板，按长度切割，用于檩条、框架与光伏配重支架。' },
}

export const uiLabels: Record<string, Dict> = {
  overview: {
    en: 'Overview', zh: '产品概述', es: 'Descripción', ar: 'نظرة عامة', fr: 'Présentation',
    pt: 'Visão geral', ru: 'Обзор', ja: '概要', de: 'Überblick', hi: 'अवलोकन',
  },
  specifications: {
    en: 'Specifications', zh: '技术规格', es: 'Especificaciones', ar: 'المواصفات', fr: 'Spécifications',
    pt: 'Especificações', ru: 'Характеристики', ja: '仕様', de: 'Technische Daten', hi: 'विनिर्देश',
  },
  features: {
    en: 'Key features', zh: '核心特点', es: 'Características', ar: 'الميزات الرئيسية', fr: 'Caractéristiques',
    pt: 'Características', ru: 'Особенности', ja: '特長', de: 'Merkmale', hi: 'मुख्य विशेषताएँ',
  },
  applications: {
    en: 'Applications', zh: '应用场景', es: 'Aplicaciones', ar: 'التطبيقات', fr: 'Applications',
    pt: 'Aplicações', ru: 'Применение', ja: '用途', de: 'Anwendungen', hi: 'अनुप्रयोग',
  },
  faq: {
    en: 'FAQ', zh: '常见问题', es: 'Preguntas frecuentes', ar: 'الأسئلة الشائعة', fr: 'FAQ',
    pt: 'Perguntas frequentes', ru: 'Вопросы и ответы', ja: 'よくある質問', de: 'FAQ', hi: 'सामान्य प्रश्न',
  },
  related: {
    en: 'Related products', zh: '相关产品', es: 'Productos relacionados', ar: 'منتجات ذات صلة', fr: 'Produits associés',
    pt: 'Produtos relacionados', ru: 'Похожие товары', ja: '関連製品', de: 'Ähnliche Produkte', hi: 'संबंधित उत्पाद',
  },
  quote: {
    en: 'Request a quote', zh: '获取报价', es: 'Solicitar cotización', ar: 'اطلب عرض سعر', fr: 'Demander un devis',
    pt: 'Solicitar cotação', ru: 'Запросить цену', ja: '見積もりを依頼', de: 'Angebot anfordern', hi: 'कोटेशन मांगें',
  },
  allProducts: {
    en: 'All products', zh: '全部产品', es: 'Todos los productos', ar: 'جميع المنتجات', fr: 'Tous les produits',
    pt: 'Todos os produtos', ru: 'Все товары', ja: 'すべての製品', de: 'Alle Produkte', hi: 'सभी उत्पाद',
  },
  from: {
    en: 'From', zh: '起订价', es: 'Desde', ar: 'ابتداءً من', fr: 'À partir de',
    pt: 'A partir de', ru: 'От', ja: '参考単価', de: 'Ab', hi: 'से शुरू',
  },
  moq: {
    en: 'MOQ', zh: '最小起订量', es: 'Pedido mínimo', ar: 'الحد الأدنى للطلب', fr: 'Quantité minimum',
    pt: 'Pedido mínimo', ru: 'Минимальный заказ', ja: '最小注文数', de: 'Mindestbestellmenge', hi: 'न्यूनतम ऑर्डर',
  },
  guide: {
    en: 'Technical guide', zh: '技术指南', es: 'Guía técnica', ar: 'دليل فني', fr: 'Guide technique',
    pt: 'Guia técnico', ru: 'Техническое руководство', ja: '技術ガイド', de: 'Technischer Leitfaden', hi: 'तकनीकी गाइड',
  },
}

export const specLabels: Record<string, Dict> = {
  size: { en: 'Size range', zh: '规格范围', es: 'Rango de tamaño', ar: 'نطاق المقاسات', fr: 'Plage de dimensions', pt: 'Faixa de tamanho', ru: 'Диапазон размеров', ja: 'サイズ範囲', de: 'Größenbereich', hi: 'आकार सीमा' },
  standard: { en: 'Standard', zh: '执行标准', es: 'Norma', ar: 'المعيار', fr: 'Norme', pt: 'Norma', ru: 'Стандарт', ja: '規格', de: 'Norm', hi: 'मानक' },
  material: { en: 'Material', zh: '材质', es: 'Material', ar: 'المادة', fr: 'Matériau', pt: 'Material', ru: 'Материал', ja: '材質', de: 'Werkstoff', hi: 'सामग्री' },
  finish: { en: 'Finish', zh: '表面处理', es: 'Acabado', ar: 'التشطيب', fr: 'Finition', pt: 'Acabamento', ru: 'Покрытие', ja: '表面処理', de: 'Oberfläche', hi: 'फिनिश' },
  grade: { en: 'Grade', zh: '强度等级', es: 'Grado', ar: 'الدرجة', fr: 'Grade', pt: 'Grau', ru: 'Класс прочности', ja: '強度等級', de: 'Festigkeitsklasse', hi: 'ग्रेड' },
  minOrder: { en: 'MOQ', zh: '最小起订量', es: 'Pedido mínimo', ar: 'الحد الأدنى للطلب', fr: 'Quantité minimum', pt: 'Pedido mínimo', ru: 'Минимальный заказ', ja: '最小注文数', de: 'Mindestbestellmenge', hi: 'न्यूनतम ऑर्डर' },
}

export function pick(map: Dict | undefined, locale: Locale): string {
  if (!map) return ''
  return map[locale] || map.en || ''
}
