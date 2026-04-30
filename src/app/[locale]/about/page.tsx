import { Metadata } from 'next'
import { locales, type Locale } from '@/i18n'
import { t } from '@/i18n'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'
  
  const titles: Record<string, string> = {
    en: 'About TradeGo Fasteners - China Manufacturer for Africa',
    zh: '关于TradeGo紧固件 - 中国对非制造商',
    es: 'Sobre TradeGo Fasteners - Fabricante de China para África',
    fr: 'À Propos de TradeGo Fasteners - Fabricant Chinois pour l\'Afrique',
    ar: 'حول TradeGo Fasteners - شركة تصنيع صينية لأفريقيا',
    pt: 'Sobre TradeGo Fasteners - Fabricante da China para África',
    ru: 'О TradeGo Fasteners - Китайский Производитель для Африки',
    ja: 'TradeGo Fastenersについて - 中国 manufacturer アフリカ向け',
    de: 'Über TradeGo Fasteners - Chinesischer Hersteller für Afrika',
    hi: 'TradeGo Fasteners के बारे में - अफ्रीका के लिए चीनी निर्माता',
  }
  const descriptions: Record<string, string> = {
    en: 'TradeGo Fasteners: ISO 9001 & SABS certified China fastener manufacturer with 12+ years exporting to Africa. Factory in Shenzhen, shipping to Zimbabwe, South Africa, and 20+ African countries.',
    zh: 'TradeGo紧固件：ISO 9001和SABS认证的中国紧固件制造商，12+年非洲出口经验。深圳工厂，海运至津巴布韦、南非和20+个非洲国家。',
    es: 'TradeGo Fasteners: Fabricante de sujetadores de China certificado ISO 9001 & SABS con más de 12 años exportando a África.',
    fr: 'TradeGo Fasteners: Fabricant chinois de fixation certifié ISO 9001 & SABS avec plus de 12 ans d\'exportation vers l\'Afrique.',
    ar: 'TradeGo Fasteners: مصنع أدوات تثبيت صيني معتمد من ISO 9001 و SABS مع أكثر من 12 عامًا من التصدير إلى أفريقيا.',
    pt: 'TradeGo Fasteners: Fabricante chinês de fixadores certificado ISO 9001 & SABS com mais de 12 anos exportando para África.',
    ru: 'TradeGo Fasteners: Китайский производитель крепежа, сертифицированный по ISO 9001 и SABS, с более чем 12-летним опытом экспорта в Африку.',
    ja: 'TradeGo Fasteners：ISO 9001およびSABS認定的中国緊固件メーカー。12年以上アフリカ輸出経験あり。',
    de: 'TradeGo Fasteners: ISO 9001 & SABS zertifizierter chinesischer Schraubenhersteller mit über 12 Jahren Export nach Afrika.',
    hi: 'TradeGo Fasteners: ISO 9001 और SABS प्रमाणित चीनी फास्टनर निर्माता जिसके 12+ वर्षों का अफ्रीका निर्यात अनुभव है।',
  }

  return {
    title: titles[loc] || titles.en,
    description: descriptions[loc] || descriptions.en,
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(loc, 'about.title')}</h1>
          <p className="text-primary-200 text-base md:text-lg max-w-2xl">{t(loc, 'about.subtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Company Story */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{t(loc, 'about.ourStory')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {t(loc, 'about.storyP1')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t(loc, 'about.storyP2')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t(loc, 'about.storyP3')}
              </p>
            </div>
          </div>

          {/* Key Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">12+</div>
              <div className="text-gray-600 text-sm">{t(loc, 'about.yearsExp')}</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">500+</div>
              <div className="text-gray-600 text-sm">{t(loc, 'about.clients')}</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">20+</div>
              <div className="text-gray-600 text-sm">{t(loc, 'about.countries')}</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">50+</div>
              <div className="text-gray-600 text-sm">{t(loc, 'about.containers')}</div>
            </div>
          </div>

          {/* Factory & Certifications */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">{t(loc, 'about.certifications')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-3">🏭</div>
                <h3 className="font-bold mb-2">ISO 9001:2015</h3>
                <p className="text-sm text-gray-600">{t(loc, 'about.isoDesc')}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-bold mb-2">SABS Approved</h3>
                <p className="text-sm text-gray-600">{t(loc, 'about.sabsDesc')}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-bold mb-2">CE Certified</h3>
                <p className="text-sm text-gray-600">{t(loc, 'about.ceDesc')}</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">{t(loc, 'about.whyUs')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '🏭', title: 'about.w1Title', desc: 'about.w1Desc' },
                { icon: '📦', title: 'about.w2Title', desc: 'about.w2Desc' },
                { icon: '✅', title: 'about.w3Title', desc: 'about.w3Desc' },
                { icon: '🚢', title: 'about.w4Title', desc: 'about.w4Desc' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{t(loc, item.title)}</h3>
                    <p className="text-gray-600 text-sm">{t(loc, item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-50 rounded-xl p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{t(loc, 'about.ctaTitle')}</h2>
            <p className="text-gray-600 mb-6">{t(loc, 'about.ctaDesc')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`/${loc}/#inquiry`} className="bg-primary-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-900 transition-colors">
                {t(loc, 'about.getQuote')}
              </a>
              <a href={`/${loc}/products`} className="border-2 border-primary-700 text-primary-700 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors">
                {t(loc, 'about.viewProducts')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}