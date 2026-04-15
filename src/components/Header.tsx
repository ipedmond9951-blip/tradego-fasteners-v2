import Link from 'next/link';
import { t, type Locale } from '@/i18n';

export default function Header({ locale = 'en' }: { locale?: Locale }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">TradeGo</span>
            <span className="ml-2 text-lg text-gray-600">Fasteners</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-blue-600 font-medium">{t(locale, 'nav.home')}</Link>
            <Link href={`/${locale}#products`} className="text-gray-600 hover:text-blue-600 font-medium">{t(locale, 'nav.products')}</Link>
            <Link href={`/${locale}#faq`} className="text-gray-600 hover:text-blue-600 font-medium">{t(locale, 'nav.faq')}</Link>
            <Link href={`/${locale}#about`} className="text-gray-600 hover:text-blue-600 font-medium">{t(locale, 'nav.about')}</Link>
            <Link href={`/${locale}#inquiry`} className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              {t(locale, 'nav.contact')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
