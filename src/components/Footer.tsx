import Link from 'next/link';
import { type Locale } from '@/i18n';

export default function Footer({ locale = 'en' }: { locale?: Locale }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TradeGo Fasteners</h3>
            <p className="text-gray-400 text-sm mb-4">
              {locale === 'zh'
                ? '专业紧固件制造商和供应商，专注全球市场高品质紧固件。'
                : 'Professional fastener manufacturer and supplier specializing in quality fasteners for global markets.'}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 aimingtrade@hotmail.com</p>
              <p>📞 +86-135-6265-9951 | +86-159-6340-9951</p>
              <p>📍 {locale === 'zh' ? '中国潍坊' : 'Weifang, China'}</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-4">{locale === 'zh' ? '产品中心' : 'Products'}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/products/drywall-screws`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '干壁钉' : 'Drywall Screws'}</Link></li>
              <li><Link href={`/${locale}/products/self-drilling-screws`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '自钻螺丝' : 'Self-Drilling Screws'}</Link></li>
              <li><Link href={`/${locale}/products/bolts-nuts`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '螺栓与螺母' : 'Bolts & Nuts'}</Link></li>
              <li><Link href={`/${locale}/products/ibr-nails`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? 'IBR钉' : 'IBR Nails'}</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{locale === 'zh' ? '快捷链接' : 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}#about`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '关于我们' : 'About Us'}</Link></li>
              <li><Link href={`/${locale}#products`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '全部产品' : 'All Products'}</Link></li>
              <li><Link href={`/${locale}#faq`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '常见问题' : 'FAQ'}</Link></li>
              <li><Link href={`/${locale}#inquiry`} className="text-gray-400 hover:text-white transition-colors text-sm">{locale === 'zh' ? '联系我们' : 'Contact'}</Link></li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-bold mb-4">{locale === 'zh' ? '资质认证' : 'Certifications'}</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-yellow-400 font-bold text-sm">ISO 9001:2015</p>
                <p className="text-gray-500 text-xs">{locale === 'zh' ? '质量管理体系' : 'Quality Management'}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-green-400 font-bold text-sm">SGS Certified</p>
                <p className="text-gray-500 text-xs">{locale === 'zh' ? '产品检测' : 'Product Testing'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} TradeGo Fasteners. {locale === 'zh' ? '版权所有' : 'All rights reserved.'}</p>
          <div className="mt-2 space-x-4">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{locale === 'zh' ? '隐私政策' : 'Privacy Policy'}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{locale === 'zh' ? '服务条款' : 'Terms of Service'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
