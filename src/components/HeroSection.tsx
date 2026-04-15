import Image from 'next/image';
import Link from 'next/link';
import { type Locale, type Messages } from '@/i18n';

interface HeroSectionProps {
  locale: Locale;
  messages: Messages;
}

export default function HeroSection({ locale, messages }: HeroSectionProps) {
  const hero = messages.hero || {
    title: 'Leading Fastener Manufacturer',
    subtitle: '20+ years experience, ISO 9001 certified, global delivery',
    cta: 'Get a Quote',
    ctaSecondary: 'View Products',
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 id="hero-title" className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {locale === 'zh' ? (
                <>
                  <span className="text-yellow-400">专业紧固件</span>制造商
                </>
              ) : (
                <>
                  Leading <span className="text-yellow-400">Fastener</span> Manufacturer
                </>
              )}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">ISO 9001 {locale === 'zh' ? '认证' : 'Certified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{locale === 'zh' ? '全球发货' : 'Global Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{locale === 'zh' ? '20年经验' : '20+ Years Experience'}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href={`/${locale}/contact`} className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                {hero.cta}
              </Link>
              <Link href={`/${locale}#products`} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors">
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">
                {locale === 'zh' ? '热门产品' : 'Featured Products'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/products/drywall-screws-1.jpg"
                      alt="Drywall Screws"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{locale === 'zh' ? '干壁钉' : 'Drywall Screws'}</h4>
                    <p className="text-sm text-blue-200">{locale === 'zh' ? '建筑专用' : 'Premium quality for construction'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/products/self-drilling-screws-1.jpg"
                      alt="Self-Drilling Screws"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{locale === 'zh' ? '自钻螺丝' : 'Self-Drilling Screws'}</h4>
                    <p className="text-sm text-blue-200">{locale === 'zh' ? '高效钻探' : 'High performance drilling'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/products/bolts-nuts-1.jpg"
                      alt="Bolts & Nuts"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{locale === 'zh' ? '螺栓螺母' : 'Bolts & Nuts'}</h4>
                    <p className="text-sm text-blue-200">{locale === 'zh' ? '工业级' : 'Industrial grade fasteners'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
