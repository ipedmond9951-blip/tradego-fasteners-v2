import Link from 'next/link'
import { type Locale, t } from '@/i18n'

interface FooterProps { locale?: Locale }

export default function Footer({ locale = 'en' }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TradeGo Fasteners</h3>
            <p className="text-gray-400 text-sm mb-4">{t(locale, 'footer.companyDesc')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t(locale, 'footer.quickLinks')}</h4>
            <div className="space-y-2 text-sm">
              <Link href={`/${locale}`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.home')}</Link>
              <Link href={`/${locale}#products`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.products')}</Link>
              <Link href={`/${locale}#about`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.about')}</Link>
              <Link href={`/${locale}#inquiry`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.contact')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t(locale, 'footer.contactUs')}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📍 {t(locale, 'footer.address')}</p>
              <p>📧 {t(locale, 'footer.email')}</p>
              <p>📱 WhatsApp: +86 159 6340 9951</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t(locale, 'nav.products')}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Drywall Screws</p>
              <p>Self-Drilling Screws</p>
              <p>Bolts & Nuts</p>
              <p>IBR Nails</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} TradeGo Fasteners. {t(locale, 'footer.rights')}
        </div>
      </div>
    </footer>
  )
}
