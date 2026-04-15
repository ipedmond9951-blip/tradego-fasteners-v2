import Script from 'next/script'
import { locales, type Locale, getMessages, t } from '@/i18n'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ProductGrid from '@/components/ProductGrid'
import FAQSection from '@/components/FAQSection'
import InquiryForm from '@/components/InquiryForm'
import { GeoPromotion } from '@/components/GeoContent'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const msgs = getMessages(locale)
  const BASE_URL = 'https://tradego-fasteners-v2.vercel.app'

  return (
    <>
      <Script
        id="seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TradeGo Fasteners',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            description: msgs.hero.subtitle,
            foundingDate: '2004',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Weifang',
              addressCountry: 'CN',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+86-135-6265-9951',
              contactType: 'sales',
              email: 'aimingtrade@hotmail.com',
              availableLanguage: ['English', 'Chinese'],
            },
          }),
        }}
      />

      <HeroSection locale={locale} messages={msgs} />

      <div className="container mx-auto px-4">
        <GeoPromotion />
      </div>

      <AboutSection locale={locale} messages={msgs} />
      <ProductGrid locale={locale} messages={msgs} />
      <FAQSection locale={locale} messages={msgs} />

      {/* Inquiry Section */}
      <div id="inquiry">
        <InquiryForm locale={locale} />
      </div>
    </>
  )
}
