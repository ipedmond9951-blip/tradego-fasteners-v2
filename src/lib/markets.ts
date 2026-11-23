// 地域落地页数据：按目的国组织港口、单证、热销品类与交期
// 只写可核实的物流与单证事实，不对客户名单或本地库存做宣称
export interface MarketPage {
  slug: string
  name: Record<string, string>
  hero: Record<string, string>
  ports: Record<string, string>
  docs: Record<string, string>
  lines: Record<string, string>
  topSlugs: string[]
  faq: Record<string, [string, string][]>
}

export const markets: MarketPage[] = [
  {
    slug: 'zimbabwe',
    name: { en: 'Zimbabwe', zh: '津巴布韦' },
    hero: {
      en: 'Harare and Bulawayo buyers usually clear through Beira or Durban, then truck inland. We quote FOB or CIF Beira, with the transit leg planned into the delivery date.',
      zh: '哈拉雷与布拉瓦约的客户多经贝拉或德班清关后再陆运进境。我们报 FOB 或 CIF 贝拉，并把内陆段时效算进交期。',
    },
    ports: {
      en: 'Beira (Mozambique) is the shortest sea leg for Harare; Durban (South Africa) is longer by sea but has more sailing frequency. Both need a road leg of roughly 1–3 days depending on border queues at Forbes/Mutare or Beitbridge.',
      zh: '贝拉（莫桑比克）到哈拉雷海运段最短；德班（南非）船期更密但海上更远。两港都要陆运，视 Forbes/Mutare 或 Beitbridge 口岸排队，约 1–3 天。',
    },
    docs: {
      en: 'Commercial invoice, packing list, bill of lading, certificate of origin and mill certificates. SABS-related test reports are useful for roofing lines; confirm with your clearing agent before shipment.',
      zh: '发票、装箱单、提单、原产地证与材质书。屋面类产品附 SABS 相关检测报告更好用；出货前与清关代理确认一遍。',
    },
    lines: {
      en: 'Roofing (IBR nails, self-drilling screws with washers), drywall screws, hex bolts and nuts, anchors, waterproofing — the mix that matches IBR roof and block-work construction.',
      zh: '屋面（IBR 钉、带垫自钻螺丝）、干墙钉、六角螺栓螺母、锚栓、防水材料 —— 对应 IBR 屋面与砌体施工的组合。',
    },
    topSlugs: ['ibr-nails', 'self-drilling-screws', 'drywall-screws', 'bolts-nuts', 'anchor-bolts', 'butyl-tape'],
    faq: {
      en: [
        ['Which port is cheaper for Harare?', 'Beira is usually cheaper on sea freight and inland distance; Durban has more sailings and steadier schedules. We quote both so you can compare landed cost.'],
        ['Can you mix sizes in one container?', 'Yes — mixed sizes and mixed product lines can be loaded in one 20GP, with a loading plan issued before shipment.'],
        ['What is the usual lead time?', '15–25 days production after deposit, then 20–30 days sea to Beira or Durban, plus the inland leg.'],
      ],
      zh: [
        ['到哈拉雷走哪个港更便宜？', '贝拉海运与内陆距离都更短，通常更省；德班船期更密、更稳。两港都报，便于比到岸成本。'],
        ['能否一个柜混装多个规格？', '可以，不同规格与不同品类可同柜，装柜前出装载方案。'],
        ['常规交期多久？', '收定金后生产 15–25 天，海运至贝拉或德班 20–30 天，再加内陆段。'],
      ],
    },
  },
  {
    slug: 'zambia',
    name: { en: 'Zambia', zh: '赞比亚' },
    hero: {
      en: 'Zambia is landlocked: Lusaka and the Copperbelt are served through Beira, Dar es Salaam or Walvis Bay. Mining and construction drive demand for high-tensile bolts and anchoring.',
      zh: '赞比亚是内陆国：卢萨卡与铜矿带通常经贝拉、达累斯萨拉姆或沃尔维斯湾。矿山与基建决定高强度螺栓与锚固件的需求。',
    },
    ports: {
      en: 'Beira via Zimbabwe is the shortest for Lusaka; Dar es Salaam suits the northern Copperbelt; Walvis Bay is the longest but has stable schedules. All routes need a road leg and border transit.',
      zh: '经津巴布韦走贝拉对卢萨卡最短；达累斯萨拉姆适合北部铜矿带；沃尔维斯湾距离最长但船期稳定。三条路线都需陆运与口岸过境。',
    },
    docs: {
      en: 'Invoice, packing list, B/L, certificate of origin and mill certificates. For mining buyers, add material test reports and, where specified, third-party inspection before shipment.',
      zh: '发票、装箱单、提单、原产地证与材质书。矿山客户另需材质检测报告，指定时加做装运前第三方验货。',
    },
    lines: {
      en: 'Grade 8.8 and 10.9 structural bolts, anchor bolts, threaded rods, mining anchors, plus standard screws and nails for site work.',
      zh: '8.8 与 10.9 级结构螺栓、地脚螺栓、螺杆、矿山锚固件，以及工地常用的螺丝与钉类。',
    },
    topSlugs: ['bolts-nuts', 'anchor-bolts', 'threaded-rods', 'expansion-bolts', 'sleeve-anchors', 'common-nails'],
    faq: {
      en: [
        ['Do you supply Grade 10.9 bolts for mining?', 'Yes, with mill certificates stating grade and heat number; third-party inspection can be arranged.'],
        ['Which route is fastest to Lusaka?', 'Beira through Zimbabwe is usually the shortest; Dar es Salaam is better for the northern Copperbelt.'],
        ['Can you handle mixed containers?', 'Yes, mixed sizes and lines in one 20GP with a loading plan.'],
      ],
      zh: [
        ['矿山用 10.9 级螺栓能做吗？', '可以，材质书注明等级与炉号，可安排第三方验货。'],
        ['到卢萨卡哪条路线最快？', '经津巴布韦走贝拉通常最短；北部铜矿带走达累斯萨拉姆更合适。'],
        ['能混柜吗？', '可以，不同规格与品类同柜，附装载方案。'],
      ],
    },
  },
  {
    slug: 'south-africa',
    name: { en: 'South Africa', zh: '南非' },
    hero: {
      en: 'Durban and Cape Town are the main gates. SANS/SABS standards dominate specifications, so roofing and structural lines are usually quoted against a SABS clause.',
      zh: '德班与开普敦是主要门户。当地以 SANS/SABS 标准为主，屋面与结构件通常按 SABS 条款报盘。',
    },
    ports: {
      en: 'Durban handles most container traffic from China; Cape Town suits Western Cape projects. Transit is typically 25–30 days from Qingdao or Tianjin.',
      zh: '德班承接中国来的大部分集装箱；西开普项目走开普敦。青岛/天津出发通常 25–30 天。',
    },
    docs: {
      en: 'Invoice, packing list, B/L, certificate of origin and mill certificates. SABS test reports are commonly asked for on roofing nails and structural bolts — confirm the exact clause with the buyer.',
      zh: '发票、装箱单、提单、原产地证与材质书。屋面钉与结构螺栓常被要求 SABS 检测报告，条款需与买方确认到具体号。',
    },
    lines: {
      en: 'IBR roofing nails, self-drilling screws with EPDM washers, structural bolts and nuts, anchors, washers and waterproofing.',
      zh: 'IBR 屋面钉、带 EPDM 垫自钻螺丝、结构螺栓螺母、锚栓、垫圈与防水材料。',
    },
    topSlugs: ['ibr-nails', 'self-drilling-screws', 'bolts-nuts', 'washers', 'wedge-anchors', 'waterproof-membrane'],
    faq: {
      en: [
        ['Are your IBR nails SABS compliant?', 'Roofing nails are produced to SABS 1195 requirements; test reports are available on request.'],
        ['Do you quote CIF Durban?', 'Yes — FOB Qingdao/Tianjin as standard, CIF Durban or Cape Town on request.'],
        ['Can you supply small trial orders?', 'Yes — trial quantities are accepted before a full container, with samples available.'],
      ],
      zh: [
        ['IBR 钉符合 SABS 吗？', '屋面钉按 SABS 1195 要求生产，检测报告可按需提供。'],
        ['能报 CIF 德班吗？', '可以，默认 FOB 青岛/天津，按需报 CIF 德班或开普敦。'],
        ['能做小批量试单吗？', '可以，整柜前可先试单，样品可提供。'],
      ],
    },
  },
  {
    slug: 'mozambique',
    name: { en: 'Mozambique', zh: '莫桑比克' },
    hero: {
      en: 'Beira, Maputo and Nacala serve both local projects and transit cargo to Zimbabwe, Zambia and Malawi. Beira is the workhorse for central Mozambique.',
      zh: '贝拉、马普托与纳卡拉既服务本地项目，也承担发往津巴布韦、赞比亚、马拉维的转口货。贝拉是中部莫桑比克主力港。',
    },
    ports: {
      en: 'Beira for central Mozambique and Zimbabwe transit; Maputo for the south and South African border trade; Nacala for the north. Sea transit is typically 20–28 days.',
      zh: '贝拉服务中部与津巴布韦转口；马普托服务南部与南非边境贸易；纳卡拉服务北部。海运通常 20–28 天。',
    },
    docs: {
      en: 'Invoice, packing list, B/L, certificate of origin and mill certificates. Transit cargo needs the destination country named on the documents; check with your agent for the current transit regime.',
      zh: '发票、装箱单、提单、原产地证与材质书。转口货需在单证上标明最终目的国，具体转口规则请与代理核对当期要求。',
    },
    lines: {
      en: 'Roofing fasteners, concrete screws, anchors and waterproofing for coastal humidity, plus nails and general site hardware.',
      zh: '屋面紧固件、混凝土螺丝、锚栓与适应沿海高湿的防水材料，及钉类与通用工地五金。',
    },
    topSlugs: ['ibr-nails', 'concrete-screws', 'sleeve-anchors', 'butyl-tape', 'common-nails', 'asphalt-flash-band'],
    faq: {
      en: [
        ['Which port for transit to Zimbabwe?', 'Beira — it is the shortest sea leg, then road through Mutare.'],
        ['Coastal corrosion — what finish?', 'Hot-dip galvanized or stainless 304/316; plain zinc rusts quickly in Beira salt air.'],
        ['Do you quote CIF Beira?', 'Yes, on request, alongside FOB.'],
      ],
      zh: [
        ['转口津巴布韦走哪个港？', '贝拉，海运段最短，再经 Mutare 陆运。'],
        ['沿海防腐怎么选？', '热镀锌或不锈钢 304/316；普通镀锌在贝拉海风环境很快泛锈。'],
        ['能报 CIF 贝拉吗？', '可以按需报，与 FOB 并行。'],
      ],
    },
  },
  {
    slug: 'botswana',
    name: { en: 'Botswana', zh: '博茨瓦纳' },
    hero: {
      en: 'Landlocked, served mainly through Durban with a road leg via South Africa; Walvis Bay is the alternative. Mining and construction are the two demand centres.',
      zh: '内陆国，主要经德班清关后陆运过南非；沃尔维斯湾为替代路线。需求集中在矿山与建筑。',
    },
    ports: { en: 'Durban (South Africa) with a road leg to Gaborone and Francistown; Walvis Bay (Namibia) as a second option.', zh: '德班（南非）陆运至哈博罗内与弗朗西斯敦；沃尔维斯湾（纳米比亚）作为第二选择。' },
    docs: { en: 'Invoice, packing list, B/L, certificate of origin and mill certificates; transit documents name Botswana as final destination.', zh: '发票、装箱单、提单、原产地证与材质书；转口单证需标明最终目的国为博茨瓦纳。' },
    lines: { en: 'Structural bolts, anchors, roofing fasteners, waterproofing and general site hardware.', zh: '结构螺栓、锚栓、屋面紧固件、防水材料与通用工地五金。' },
    topSlugs: ['bolts-nuts', 'anchor-bolts', 'ibr-nails', 'waterproof-membrane', 'washers', 'coach-screws'],
    faq: {
      en: [
        ['How is freight arranged?', 'Sea to Durban, then road to Gaborone or Francistown; we quote FOB and CIF Durban.'],
        ['Do you supply mining-grade bolts?', 'Yes — Grade 8.8 and 10.9 with mill certificates.'],
        ['What is typical lead time?', '15–25 days production, 25–30 days sea to Durban, plus the road leg.'],
      ],
      zh: [
        ['物流怎么安排？', '海运到德班，再陆运至哈博罗内或弗朗西斯敦；我们报 FOB 与 CIF 德班。'],
        ['有矿山级螺栓吗？', '有，8.8 与 10.9 级，附材质书。'],
        ['常规交期？', '生产 15–25 天，海运至德班 25–30 天，加陆运。'],
      ],
    },
  },
  {
    slug: 'kenya',
    name: { en: 'Kenya', zh: '肯尼亚' },
    hero: {
      en: 'Mombasa serves Kenya, Uganda, Rwanda and South Sudan transit. Pre-shipment conformity (PVoC) is normally required, so certification is planned into the schedule.',
      zh: '蒙巴萨服务肯尼亚、乌干达、卢旺达与南苏丹转口。通常需装运前合格认证（PVoC），认证时间要算进排期。',
    },
    ports: { en: 'Mombasa for Kenya and the East African transit market; sea transit typically 28–32 days.', zh: '蒙巴萨服务肯尼亚与东非转口市场，海运通常 28–32 天。' },
    docs: { en: 'Invoice, packing list, B/L, certificate of origin, mill certificates and the PVoC certificate of conformity where the destination requires it.', zh: '发票、装箱单、提单、原产地证、材质书，以及目的国要求的 PVoC 合格证书。' },
    lines: { en: 'Roofing screws and nails, structural bolts, anchors, concrete screws and waterproofing.', zh: '屋面螺丝与钉类、结构螺栓、锚栓、混凝土螺丝与防水材料。' },
    topSlugs: ['self-drilling-screws', 'ibr-nails', 'bolts-nuts', 'concrete-screws', 'sleeve-anchors', 'butyl-tape'],
    faq: {
      en: [
        ['Is PVoC required?', 'Normally yes for regulated products; we arrange inspection through an accredited body and include the certificate with the shipping documents.'],
        ['Do you ship to Uganda via Mombasa?', 'Yes — transit cargo is documented to the final destination.'],
        ['What finish for coastal Kenya?', 'Hot-dip galvanized or stainless; Mombasa salt air is hard on thin zinc.'],
      ],
      zh: [
        ['需要 PVoC 吗？', '受监管产品通常需要，我们通过认可机构安排检验，证书随装运单证。'],
        ['能经蒙巴萨发乌干达吗？', '可以，转口单证按最终目的国出具。'],
        ['肯尼亚沿海选什么表面处理？', '热镀锌或不锈钢，蒙巴萨海风对薄锌层很不友好。'],
      ],
    },
  },
  {
    slug: 'nigeria',
    name: { en: 'Nigeria', zh: '尼日利亚' },
    hero: {
      en: 'Lagos (Apapa / Tin Can) and Onne are the main gates. SONCAP is normally required for regulated fasteners, so certification runs in parallel with production.',
      zh: '拉各斯（Apapa / Tin Can）与 Onne 是主要门户。受监管紧固件通常需 SONCAP，认证与生产并行推进。',
    },
    ports: { en: 'Lagos for the southwest and Onne for the southeast; sea transit typically 30–35 days.', zh: '拉各斯服务西南部，Onne 服务东南部，海运通常 30–35 天。' },
    docs: { en: 'Invoice, packing list, B/L, certificate of origin, mill certificates and the SONCAP certificate where applicable.', zh: '发票、装箱单、提单、原产地证、材质书，以及适用的 SONCAP 证书。' },
    lines: { en: 'Roofing fasteners, structural bolts, anchors, nails and waterproofing for humid coastal sites.', zh: '屋面紧固件、结构螺栓、锚栓、钉类与适应高湿沿海环境的防水材料。' },
    topSlugs: ['bolts-nuts', 'ibr-nails', 'anchor-bolts', 'common-nails', 'waterproof-coating', 'sleeve-anchors'],
    faq: {
      en: [
        ['Is SONCAP mandatory?', 'For regulated products under the SONCAP list, yes — we arrange the certificate through an accredited inspection body.'],
        ['Which port do you recommend?', 'Lagos for most buyers; Onne if your site is in the southeast.'],
        ['Can you supply mixed containers?', 'Yes, with a loading plan before shipment.'],
      ],
      zh: [
        ['SONCAP 是必须的吗？', '属于 SONCAP 目录的受监管产品必须，我们通过认可检验机构办证。'],
        ['推荐哪个港？', '多数客户走拉各斯；东南部项目走 Onne。'],
        ['能混柜吗？', '可以，装柜前出装载方案。'],
      ],
    },
  },
]

export function getMarket(slug: string): MarketPage | undefined {
  return markets.find(m => m.slug === slug)
}
