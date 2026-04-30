import { Metadata } from 'next'
import { locales, type Locale } from '@/i18n'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'
  
  const titles: Record<string, string> = {
    en: 'Terms of Service',
    zh: '服务条款',
    es: 'Términos de Servicio',
    fr: 'Conditions d\'Utilisation',
    ar: 'شروط الخدمة',
    pt: 'Termos de Serviço',
    ru: 'Условия Обслуживания',
    ja: '利用規約',
    de: 'Nutzungsbedingungen',
    hi: 'सेवा की शर्तें',
  }

  return {
    title: titles[loc] || titles.en,
    description: 'TradeGo Fasteners Terms of Service - Read our terms and conditions for using our website and services.',
    alternates: {
      canonical: `https://www.tradego-fasteners.com/${loc}/terms`,
      languages: Object.fromEntries([
        ['x-default', 'https://www.tradego-fasteners.com/en/terms'],
        ...locales.map(l => [l, `https://www.tradego-fasteners.com/${l}/terms`]),
      ]),
    },
  }
}

const content: Record<string, { title: string; sections: { heading: string; text: string }[] }> = {
  en: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Agreement to Terms',
        text: 'By accessing and using the TradeGo Fasteners website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.'
      },
      {
        heading: 'Products and Services',
        text: 'TradeGo Fasteners sells industrial fasteners including but not limited to: drywall screws, self-drilling screws, bolts, nuts, washers, and related hardware. All products are sold in accordance with applicable industry standards.'
      },
      {
        heading: 'Pricing and Payment',
        text: 'Prices are subject to change without notice. Payment terms are as agreed upon in writing between TradeGo and the customer. We accept various payment methods including wire transfer, PayPal, and major credit cards.'
      },
      {
        heading: 'Shipping and Delivery',
        text: 'Shipping costs are calculated based on weight, dimensions, and destination. Delivery times are estimates and may vary based on location and shipping method chosen. TradeGo is not responsible for delays caused by shipping carriers.'
      },
      {
        heading: 'Returns and Refunds',
        text: 'Returns must be authorized in advance. Products must be in original condition for returns. Custom or special-order items are non-returnable. Refunds are processed within 14 business days of receiving returned goods.'
      },
      {
        heading: 'Warranty',
        text: 'Products are warranted to be free from defects in material and workmanship under normal use for a period of 12 months from date of invoice. This warranty does not cover damage caused by misuse, abuse, or improper installation.'
      },
      {
        heading: 'Limitation of Liability',
        text: 'TradeGo Fasteners shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use of our products or services. Our liability is limited to the purchase price of the products.'
      },
      {
        heading: 'Intellectual Property',
        text: 'All content on this website, including text, graphics, logos, and images, is the property of TradeGo Fasteners and is protected by copyright laws.'
      },
      {
        heading: 'Contact Information',
        text: 'For questions about these Terms of Service, please contact us at info@tradego-fasteners.com.'
      }
    ]
  },
  zh: {
    title: '服务条款',
    sections: [
      {
        heading: '条款同意',
        text: '通过访问和使用TradeGo紧固件网站，您同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的网站。'
      },
      {
        heading: '产品和服务',
        text: 'TradeGo紧固件销售工业紧固件，包括但不限于：干墙螺丝、自钻螺丝、螺栓、螺母、垫圈及相关五金件。所有产品均按照适用的行业标准销售。'
      },
      {
        heading: '价格和支付',
        text: '价格如有变动，恕不另行通知。付款条款根据TradeGo与客户之间的书面协议确定。我们接受各种付款方式，包括电汇、PayPal和主要信用卡。'
      },
      {
        heading: '运输和交付',
        text: '运费根据重量、尺寸和目的地计算。交货时间仅为估计值，可能因地点和选择的运输方式而有所不同。TradeGo对承运商造成的延误不承担责任。'
      },
      {
        heading: '退货和退款',
        text: '退货必须提前获得授权。产品必须保持原状才能退货。定制或特殊订货项目不可退货。退款将在收到退回商品后14个工作日内处理。'
      },
      {
        heading: '保修',
        text: '产品在正常使用条件下，自发票日期起12个月内保证无材料和工艺缺陷。本保修不涵盖因误用、滥用或安装不当造成的损坏。'
      },
      {
        heading: '责任限制',
        text: 'TradeGo紧固件对因使用我们的产品或服务而产生的任何间接、偶然、特殊或后果性损害不承担责任。我们的责任仅限于产品的购买价格。'
      },
      {
        heading: '知识产权',
        text: '本网站上的所有内容，包括文本、图形、徽标和图像，均为TradeGo Fasteners的财产，受版权法保护。'
      },
      {
        heading: '联系信息',
        text: '如对这些服务条款有疑问，请通过info@tradego-fasteners.com与我们联系。'
      }
    ]
  }
}

const fallbackContent = {
  title: 'Terms of Service',
  sections: [
    {
      heading: 'Agreement to Terms',
      text: 'By accessing and using the TradeGo Fasteners website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.'
    },
    {
      heading: 'Products and Services',
      text: 'TradeGo Fasteners sells industrial fasteners including but not limited to: drywall screws, self-drilling screws, bolts, nuts, washers, and related hardware. All products are sold in accordance with applicable industry standards.'
    },
    {
      heading: 'Pricing and Payment',
      text: 'Prices are subject to change without notice. Payment terms are as agreed upon in writing between TradeGo and the customer. We accept various payment methods including wire transfer, PayPal, and major credit cards.'
    },
    {
      heading: 'Shipping and Delivery',
      text: 'Shipping costs are calculated based on weight, dimensions, and destination. Delivery times are estimates and may vary based on location and shipping method chosen. TradeGo is not responsible for delays caused by shipping carriers.'
    },
    {
      heading: 'Returns and Refunds',
      text: 'Returns must be authorized in advance. Products must be in original condition for returns. Custom or special-order items are non-returnable. Refunds are processed within 14 business days of receiving returned goods.'
    },
    {
      heading: 'Warranty',
      text: 'Products are warranted to be free from defects in material and workmanship under normal use for a period of 12 months from date of invoice. This warranty does not cover damage caused by misuse, abuse, or improper installation.'
    },
    {
      heading: 'Limitation of Liability',
      text: 'TradeGo Fasteners shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use of our products or services. Our liability is limited to the purchase price of the products.'
    },
    {
      heading: 'Intellectual Property',
      text: 'All content on this website, including text, graphics, logos, and images, is the property of TradeGo Fasteners and is protected by copyright laws.'
    },
    {
      heading: 'Contact Information',
      text: 'For questions about these Terms of Service, please contact us at info@tradego-fasteners.com.'
    }
  ]
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'
  const pageContent = content[loc] || fallbackContent

  return (
    <>
      <Header locale={loc} />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{pageContent.title}</h1>
              <p className="text-slate-300">Last updated: January 15, 2026</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              {pageContent.sections.map((section, index) => (
                <div key={index} className="mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={loc} />
    </>
  )
}
