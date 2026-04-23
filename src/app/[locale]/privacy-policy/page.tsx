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
    en: 'Privacy Policy',
    zh: '隐私政策',
    es: 'Política de Privacidad',
    fr: 'Politique de Confidentialité',
    ar: 'سياسة الخصوصية',
    pt: 'Política de Privacidade',
    ru: 'Политика Конфиденциальности',
    ja: 'プライバシーポリシー',
    de: 'Datenschutzrichtlinie',
    hi: 'गोपनीयता नीति',
  }

  return {
    title: titles[loc] || titles.en,
    description: 'TradeGo Fasteners Privacy Policy - Learn how we collect, use, and protect your personal information.',
  }
}

const content: Record<string, { title: string; sections: { heading: string; text: string }[] }> = {
  en: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information We Collect',
        text: 'We collect information you provide directly to us, including: name, email address, phone number, company name, address, and any other information you choose to provide when contacting us or making inquiries through our website.'
      },
      {
        heading: 'How We Use Your Information',
        text: 'We use the information we collect to: respond to your inquiries, process your requests, send you product information, improve our website and services, and communicate with you about our products and promotions.'
      },
      {
        heading: 'Information Sharing',
        text: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.'
      },
      {
        heading: 'Data Security',
        text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
      },
      {
        heading: 'Cookies',
        text: 'Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect website functionality.'
      },
      {
        heading: 'Your Rights',
        text: 'You have the right to access, correct, or delete your personal information. Contact us at info@tradego-fasteners.com to exercise these rights.'
      },
      {
        heading: 'Contact Us',
        text: 'If you have any questions about this Privacy Policy, please contact us at info@tradego-fasteners.com.'
      }
    ]
  },
  zh: {
    title: '隐私政策',
    sections: [
      {
        heading: '我们收集的信息',
        text: '我们直接收集您向我们提供的信息，包括：姓名、电子邮件地址、电话号码、公司名称、地址，以及您在与我们联系或通过网站进行询价时选择提供的任何其他信息。'
      },
      {
        heading: '我们如何使用您的信息',
        text: '我们使用收集的信息来：回复您的询问、处理您的请求、向您发送产品信息、改进我们的网站和服务，以及就我们的产品和促销与您沟通。'
      },
      {
        heading: '信息共享',
        text: '除非本政策描述或法律要求，否则未经您同意，我们不会向第三方出售、交易或以其他方式转让您的个人信息。'
      },
      {
        heading: '数据安全',
        text: '我们实施适当的技术和组织措施，保护您的个人信息免受未经授权的访问、更改、披露或销毁。'
      },
      {
        heading: 'Cookie',
        text: '我们的网站使用cookie来增强您的浏览体验。您可以通过浏览器设置选择禁用cookie，但这可能会影响网站功能。'
      },
      {
        heading: '您的权利',
        text: '您有权访问、更正或删除您的个人信息。请通过info@tradego-fasteners.com联系我们来行使这些权利。'
      },
      {
        heading: '联系我们',
        text: '如果您对本隐私政策有任何疑问，请通过info@tradego-fasteners.com与我们联系。'
      }
    ]
  }
}

// Fallback for other locales
const fallbackContent = {
  title: 'Privacy Policy',
  sections: [
    {
      heading: 'Information We Collect',
      text: 'We collect information you provide directly to us, including: name, email address, phone number, company name, address, and any other information you choose to provide when contacting us or making inquiries through our website.'
    },
    {
      heading: 'How We Use Your Information',
      text: 'We use the information we collect to: respond to your inquiries, process your requests, send you product information, improve our website and services, and communicate with you about our products and promotions.'
    },
    {
      heading: 'Information Sharing',
      text: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.'
    },
    {
      heading: 'Data Security',
      text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      heading: 'Cookies',
      text: 'Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect website functionality.'
    },
    {
      heading: 'Your Rights',
      text: 'You have the right to access, correct, or delete your personal information. Contact us at info@tradego-fasteners.com to exercise these rights.'
    },
    {
      heading: 'Contact Us',
      text: 'If you have any questions about this Privacy Policy, please contact us at info@tradego-fasteners.com.'
    }
  ]
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
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
