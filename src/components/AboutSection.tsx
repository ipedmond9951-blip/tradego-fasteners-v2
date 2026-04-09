export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Why Choose TradeGo Fasteners?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">ISO 9001 Certified</h3>
              <p className="text-gray-600">
                Our quality management system meets international standards for consistent, high-quality products.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Global Delivery</h3>
              <p className="text-gray-600">
                We ship to 50+ countries worldwide with reliable logistics partners and competitive shipping rates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">20+ Years Experience</h3>
              <p className="text-gray-600">
                Two decades of expertise in fastener manufacturing, serving construction and industrial sectors.
              </p>
            </div>
          </div>
          
          {/* 作者资质信息 - E-A-T信号 */}
          <div className="bg-white rounded-lg shadow-lg p-8" itemScope itemType="https://schema.org/Organization">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-400">TG</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" itemProp="name">TradeGo Engineering Team</h3>
                <p className="text-gray-600 mb-3" itemProp="description">
                  Expert fastener specialists with deep knowledge in construction materials and industrial applications
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span itemProp="foundingDate">Founded: 2004</span>
                  <span>•</span>
                  <span>ISO 9001:2015 Certified</span>
                  <span>•</span>
                  <span itemProp="numberOfEmployees">150+ Employees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}