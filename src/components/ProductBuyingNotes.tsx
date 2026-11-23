interface Props {
  specs: Record<string, string | undefined>
  locale: string
}

// 产品页"采购决策"深化段：标准、材质、包装装载、质检、海运单证、报价要素
// 文案只陈述可核实的工艺与流程事实，不对未确认的交期/装载量编造数字
const copy: Record<string, { title: string; sections: { h: string; p: (specs: Record<string, string | undefined>) => string }[] }> = {
  en: {
    title: 'Buying notes for importers',
    sections: [
      {
        h: 'Standards and size range',
        p: s => `Production follows the standard named in the specification table above — ${s.standard || 'the standard stated in the table'}. The size range we quote is ${s.size || 'as listed above'}. If your project calls for a different clause (DIN, ISO, ANSI/ASME, SABS or GB), send us the standard number and we quote against that clause instead of substituting a near-equivalent.`,
      },
      {
        h: 'Material and finish selection',
        p: s => `Base material is ${s.material || 'as listed above'}; finish options are ${s.finish || 'as listed above'}. For parts that stay exposed outdoors, and anywhere within roughly 10 km of the coast (Beira, Durban, Mozambican and Kenyan ports), specify hot-dip galvanized or stainless instead of plain zinc — thin electro-zinc starts red rusting within a season in salt air.`,
      },
      {
        h: 'Packing, container loading and lead time',
        p: () => 'Standard export packing is cartons on pallets; nails and wire goods ship in 25 kg bags. Carton quantity, pallet count and container loading are confirmed per size at quotation, and mixed sizes can be loaded in one 20GP. Normal production runs 15–25 days after deposit, plus 20–30 days sea freight to Beira or Durban.',
      },
      {
        h: 'Quality control and inspection',
        p: () => 'Each lot is checked on dimensional tolerance, thread gauge, coating thickness and visual finish; structural lines additionally get tensile and hardness tests. Mill certificates come with the shipment, and third-party pre-shipment inspection (SGS, BV or your nominated agent) can be arranged — request it when placing the order, not after production finishes.',
      },
      {
        h: 'Shipping terms, documents and clearance',
        p: () => 'We quote FOB Qingdao / Tianjin as standard and CIF Beira or Durban on request. The document set is commercial invoice, packing list, bill of lading, certificate of origin and mill certificates; SABS-related test reports for roofing nails are available on request. If you clear through Beira for Zimbabwe, allow for the transit leg to Harare or Bulawayo when you plan the order.',
      },
      {
        h: 'What to send for a same-day quote',
        p: () => 'Five items are enough: size, standard, material and finish, quantity per size, and destination port. With those we return price, MOQ, packing and lead time the same working day, and can add a loading plan for a mixed container.',
      },
    ],
  },
  zh: {
    title: '采购要点（给进口商）',
    sections: [
      {
        h: '执行标准与尺寸范围',
        p: s => `生产依据即上方规格表所列标准 —— ${s.standard || '见规格表'}；报价尺寸范围为 ${s.size || '见上方'}。若项目要求 DIN、ISO、ANSI/ASME、SABS 或 GB 的其他条款，请提供标准号，我们按该条款报盘，不用近似规格替代。`,
      },
      {
        h: '材质与表面处理怎么选',
        p: s => `基材为 ${s.material || '见规格表'}，可选表面处理 ${s.finish || '见规格表'}。长期暴露户外、以及距海岸约 10 公里内的项目（贝拉、德班、莫桑比克与肯尼亚港口），建议热镀锌或不锈钢，不要用普通电镀锌 —— 海盐环境下薄锌层一个季度就会泛红锈。`,
      },
      {
        h: '包装、柜型装载与交期',
        p: () => '标准出口包装为纸箱托盘，钉类与线材按 25kg 编织袋。每箱数量、托盘数与柜型装载在报盘时按规格确认，不同规格可同柜混装。正常生产为收定金后 15–25 天，加上海运至贝拉或德班 20–30 天。',
      },
      {
        h: '质量控制与验货',
        p: () => '每批按尺寸公差、螺纹规、镀层厚度与外观检验；结构件另做拉伸与硬度测试。材质书随货，出厂前可安排第三方验货（SGS、BV 或客户指定机构）—— 请在订单阶段提出，不要等生产结束再安排。',
      },
      {
        h: '海运条款、单证与清关',
        p: () => '默认 FOB 青岛/天津，可按需报 CIF 贝拉/德班。单证包含发票、装箱单、提单、原产地证与材质书；IBR 屋面钉的 SABS 相关检测报告可按需提供。经贝拉清关进津巴布韦的，排单时要把到哈拉雷/布拉瓦约的内陆段一并算进去。',
      },
      {
        h: '当天出价需要提供什么',
        p: () => '五项即可：规格尺寸、执行标准、材质与镀层、每个规格的数量、目的港。五项齐全当天可回价格、MOQ、包装与交期，并可附一份混柜装载方案。',
      },
    ],
  },
}

export default function ProductBuyingNotes({ specs, locale }: Props) {
  const c = copy[locale] || copy.en
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{c.title}</h2>
      <div className="space-y-5">
        {c.sections.map(sec => (
          <div key={sec.h}>
            <h3 className="font-semibold text-primary-900 mb-1">{sec.h}</h3>
            <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed">{sec.p(specs)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
