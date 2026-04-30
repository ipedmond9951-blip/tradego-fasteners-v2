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
    en: 'Contact TradeGo Fasteners - Get a Quote',
    zh: '联系TradeGo紧固件 - 获取报价',
    es: 'Contactar TradeGo Fasteners - Obtener Cotización',
    fr: 'Contacter TradeGo Fasteners - Obtenir un Devis',
    ar: 'التواصل مع TradeGo Fasteners - الحصول على عرض أسعار',
    pt: 'Contato TradeGo Fasteners - Obter Cotação',
    ru: 'Контакт TradeGo Fasteners - Получить Котировку',
    ja: 'TradeGo Fastenersへのお問い合わせ',
    de: 'TradeGo Fasteners Kontaktieren - Angebot Erhalten',
    hi: 'TradeGo Fasteners से सं tact करें',
  }
  const descriptions: Record<string, string> = {
    en: 'Contact TradeGo Fasteners for bulk fastener orders. ISO 9001 & SABS certified manufacturer. Sea freight to Africa. Get a quote in 24 hours.',
    zh: '联系TradeGo紧固件获取批量紧固件订单报价。ISO 9001和SABS认证制造商。海运至非洲。24小时内获得报价。',
    es: 'Contacte a TradeGo Fasteners para pedidos de sujetadores al por mayor. Fabricante certificado ISO 9001 & SABS. Flete marítimo a África.',
    fr: 'Contactez TradeGo Fasteners pour les commandes de fixation en gros. Fabricant certifié ISO 9001 & SABS. Fret maritime vers l\'Afrique.',
    ar: 'تواصل مع TradeGo Fasteners لطلبات التثبيت بالجملة. مصنع معتمد ISO 9001 و SABS. الشحن البحري إلى أفريقيا.',
    pt: 'Contate TradeGo Fasteners para pedidos de fixadores em atacado. Fabricante certificado ISO 9001 & SABS. Frete marítimo para África.',
    ru: 'Свяжитесь с TradeGo Fasteners для оптовых заказов крепежа. Производитель сертифицирован по ISO 9001 и SABS. Морская доставка в Африку.',
    ja: 'TradeGo Fastenersへの大口注文お問い合わせ。ISO 9001およびSABS認定メーカー。海上輸送アフリカ向け。',
    de: 'Kontaktieren Sie TradeGo Fasteners für Schrauben-Großbestellungen. ISO 9001 & SABS zertifizierter Hersteller. Seefracht nach Afrika.',
    hi: 'TradeGo Fasteners से बल्क फास्टनर ऑर्डर के लिए सं tact करें। ISO 9001 और SABS प्रमाणित निर्माता। अफ्रीका को समुद्री माल।',
  }

  return {
    title: titles[loc] || titles.en,
    description: descriptions[loc] || descriptions.en,
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(loc, 'contact.title')}</h1>
          <p className="text-primary-200 text-base md:text-lg max-w-2xl">{t(loc, 'contact.subtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{t(loc, 'contact.email')}</h3>
              <p className="text-gray-600">info@tradegofasteners.com</p>
              <p className="text-gray-600">sales@tradegofasteners.com</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
              <p className="text-gray-600">+86 159 6340 9951</p>
              <p className="text-sm text-gray-500 mt-1">{t(loc, 'contact.whatsappNote')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{t(loc, 'contact.response')}</h3>
              <p className="text-gray-600">{t(loc, 'contact.responseTime')}</p>
            </div>
          </div>

          {/* Main Form Section - anchor to #inquiry */}
          <div id="inquiry" className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-center">{t(loc, 'contact.formTitle')}</h2>
            <p className="text-gray-600 text-center mb-8">{t(loc, 'contact.formSubtitle')}</p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t(loc, 'form.name')} *</label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder={t(loc, 'form.namePlaceholder')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t(loc, 'form.email')} *</label>
                  <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="you@company.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t(loc, 'form.phone')}</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="+263 77 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t(loc, 'form.company')}</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder={t(loc, 'form.companyPlaceholder')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t(loc, 'form.products')}</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder={t(loc, 'form.productsPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t(loc, 'form.message')} *</label>
                <textarea required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder={t(loc, 'form.messagePlaceholder')}></textarea>
              </div>
              <button type="submit" className="w-full bg-primary-700 text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-900 transition-colors">
                {t(loc, 'form.submit')}
              </button>
            </form>
          </div>

          {/* Factory Info */}
          <div className="mt-12 bg-primary-50 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">{t(loc, 'contact.factoryInfo')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">{t(loc, 'contact.officeAddress')}</h3>
                <p className="text-gray-700">TradeGo Fasteners Co., Ltd.</p>
                <p className="text-gray-600">Baoan District, Hangcheng Avenue</p>
                <p className="text-gray-600">Shenzhen, Guangdong, China</p>
                <p className="text-gray-600">Postal: 518102</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">{t(loc, 'contact.shipping')}</h3>
                <p className="text-gray-600">🚢 {t(loc, 'contact.shippingNote')}</p>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• Durban (South Africa): 20-25 days</li>
                  <li>• Beira (Mozambique): 15-20 days</li>
                  <li>• Mombasa (Kenya): 20-25 days</li>
                  <li>• Harare (Zimbabwe): 25-30 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}