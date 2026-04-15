import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TradeGo Fasteners</h3>
            <p className="text-gray-400 text-sm mb-4">
              Professional fastener manufacturer and supplier specializing in quality fasteners for global markets.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 aimingtrade@hotmail.com</p>
              <p>📞 +86-135-6265-9951 | +86-159-6340-9951</p>
              <p>📍 Weifang, China</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link href="/products/drywall-screws" className="text-gray-400 hover:text-white transition-colors text-sm">Drywall Screws</Link></li>
              <li><Link href="/products/self-drilling-screws" className="text-gray-400 hover:text-white transition-colors text-sm">Self-Drilling Screws</Link></li>
              <li><Link href="/products/bolts-nuts" className="text-gray-400 hover:text-white transition-colors text-sm">Bolts & Nuts</Link></li>
              <li><Link href="/products/ibr-nails" className="text-gray-400 hover:text-white transition-colors text-sm">IBR Nails</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-bold mb-4">Certifications</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-yellow-400 font-bold text-sm">ISO 9001:2015</p>
                <p className="text-gray-500 text-xs">Quality Management</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-green-400 font-bold text-sm">SGS Certified</p>
                <p className="text-gray-500 text-xs">Product Testing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} TradeGo Fasteners. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
