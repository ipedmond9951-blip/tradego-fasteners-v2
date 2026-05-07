'use client'

import { type Locale, t } from '@/i18n'

interface ProductsContentSectionProps {
  locale: Locale
}

const content = {
  en: {
    title: 'How to Select the Right Fastener',
    selectionGuide: `Choosing the correct fastener for your construction project is critical for structural integrity and long-term durability. In African building projects, factors like coastal humidity, tropical conditions, and specific regulatory requirements must be considered.

For roofing applications in Southern Africa, IBR nails with hot-dip galvanization are recommended due to their superior corrosion resistance. For steel structure connections, self-drilling TEK screws eliminate the need for pre-drilling and provide secure fastening in single operation.

When selecting anchor bolts for foundation work, ensure the bolt grade matches your load requirements. Grade 8.8 bolts are suitable for medium-duty applications, while Grade 10.9 or ASTM F1554 bolts are required for heavy structural loads. Always verify that the concrete has fully cured before applying full load to anchor bolts - typically 28 days for standard concrete mixes.`,
    qualityTitle: 'Quality Assurance & Certifications',
    qualityText: `Every batch of TradeGo fasteners undergoes rigorous quality control before shipment. We provide Mill Test Certificates (MTC) and SGS inspection reports with each order, certifying material composition, tensile strength, and dimensional accuracy.

Our manufacturing facilities are ISO 9001:2015 certified, and our products meet relevant African standards including SABS (South Africa), SSA/BS (Zimbabwe), and KEBS (Kenya). For projects requiring specific grade bolts, we can provide third-party testing certificates from Bureau Veritas or Intertek.

Common quality issues to avoid: bolts with irregular thread spacing (indicates worn threading dies), rust spots appearing within weeks of installation (poor galvanization), and inconsistent head dimensions (sign of substandard manufacturing).`,
    shippingTitle: 'Shipping to Africa',
    shippingText: `TradeGo ships fasteners from our manufacturing facilities in China to major African ports including Durban (South Africa), Beira (Mozambique), and Harare (Zimbabwe) via established sea freight routes.

Standard lead time is 15-25 days from order confirmation to port arrival. For urgent requirements, air freight options are available with 7-10 day delivery to major airports. We handle all export documentation including Bill of Lading, Commercial Invoice, and Certificate of Origin.

Our packaging is designed for African logistics: inner waterproof bags, outer reinforced cartons with reinforced corners, and palletized loading for efficient container utilization. Minimum order quantity is 500kg for sea freight shipments, with mixed product orders welcome.`,
    applicationsTitle: 'Applications by Industry',
    constructionText: `Construction: Structural steel connections, concrete formwork, roofing systems, and wall framing. High-rise buildings in Nairobi and Johannesburg typically specify Grade 8.8 hex bolts with hot-dip galvanization for exposed structural elements.`,
    miningText: `Mining: Conveyor belt systems, crusher installations, and structural support in underground and open-pit operations. Mining operations in Zambia and South Africa require corrosion-resistant fasteners due to humid underground conditions and chemical exposure.`,
    solarText: `Solar Panel Mounting: Ground-mounted and rooftop solar installations require specialized anchor bolts for concrete foundations and clamp-type fasteners for module mounting. Our HDG anchor bolts and stainless steel clamp sets are specifically designed for solar applications in African climates.`,
  },
  zh: {
    title: '如何选择合适的紧固件',
    selectionGuide: `为您的建筑项目选择正确的紧固件对结构完整性和长期耐久性至关重要。在非洲建设项目中，必须考虑沿海湿度、热带条件和特定法规要求等因素。

对于南非地区的屋顶应用，推荐使用热镀锌IBR钉，因其卓越的耐腐蚀性。对于钢结构连接，自钻TEK螺丝无需预钻孔，单次操作即可完成牢固连接。

选择地基锚栓时，请确保螺栓等级与您的负载要求相匹配。8.8级螺栓适用于中等负荷应用，而10.9级或ASTM F1554螺栓则用于重型结构负载。在将完全负载施加到锚栓之前，请始终验证混凝土已完全固化——标准混凝土混合料通常需要28天。`,
    qualityTitle: '质量保证与认证',
    qualityText: `每批次TradeGo紧固件在装运前都经过严格的质量控制。我们为每个订单提供材料试验证书（MTC）和SGS检验报告，证明材料成分、抗拉强度和尺寸精度。

我们的制造设施已获得ISO 9001:2015认证，我们的产品符合相关非洲标准，包括SABS（南非）、SSA/BS（津巴布韦）和KEBS（肯尼亚）。对于需要特定等级螺栓的项目，我们可以提供来自必维国际检验集团或天祥集团的第三方测试证书。

避免常见质量问题：螺纹间距不规则的螺栓（表示螺纹模具磨损），安装后几周内出现锈斑（镀锌不良），以及头部尺寸不一致（表明制造质量差）。`,
    shippingTitle: '非洲航运',
    shippingText: `TradeGo从中国制造工厂向主要非洲港口发货，包括德班（南非）、贝拉（莫桑比克）和哈拉雷（津巴布韦），通过成熟海运路线。

从订单确认到港口到达的标准交货期为15-25天。对于紧急需求，可提供7-10天到达主要机场的空运选项。我们处理所有出口文件，包括提单、商业发票和原产地证书。

我们的包装专为非洲物流设计：内部防水袋，外层加固纸箱带加固角，以及托盘化装载以提高集装箱利用率。海运最小起订量为500公斤，欢迎混合产品订单。`,
    applicationsTitle: '行业应用',
    constructionText: `建筑：钢结构连接、混凝土模板、屋顶系统和墙壁框架。内罗毕和约翰内斯堡的超高层建筑通常指定使用热镀锌的8.8级六角螺栓用于暴露的结构元件。`,
    miningText: `采矿：输送带系统、破碎机安装以及地下和露天作业中的结构支撑。赞比亚和南非的采矿作业由于地下潮湿条件和化学暴露，需要耐腐蚀紧固件。`,
    solarText: `太阳能电池板安装：地面安装和屋顶太阳能装置需要专门的锚栓用于混凝土基础，以及夹式紧固件用于模块安装。我们的热镀锌锚栓和不锈钢夹套件专为非洲气候的太阳能应用设计。`,
  },
}

export default function ProductsContentSection({ locale }: ProductsContentSectionProps) {
  // Fallback to English for unsupported locales
  const texts = content[locale as keyof typeof content] || content.en

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Selection Guide */}
      <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">{texts.title}</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{texts.selectionGuide}</p>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Assurance */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">{texts.qualityTitle}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{texts.qualityText}</p>
          </div>
        </section>

        {/* Shipping */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">{texts.shippingTitle}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{texts.shippingText}</p>
          </div>
        </section>
      </div>

      {/* Industry Applications */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-6">{texts.applicationsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-primary-800 mb-2">🏗️ {locale === 'zh' ? '建筑' : 'Construction'}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{texts.constructionText}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-primary-800 mb-2">⛏️ {locale === 'zh' ? '采矿' : 'Mining'}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{texts.miningText}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-primary-800 mb-2">☀️ {locale === 'zh' ? '太阳能' : 'Solar Energy'}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{texts.solarText}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
