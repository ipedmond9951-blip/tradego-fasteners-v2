import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';

// 产品数据
const products = [
  {
    id: 'drywall-screws',
    name: 'Drywall Screws',
    description: 'Premium quality drywall screws for gypsum board installation. Features bugle head design and sharp point for easy penetration.',
    material: 'Carbon Steel',
    coating: 'Phosphate, Zinc Plated',
    sizeRange: '3.5mm - 4.8mm diameter, 25mm - 100mm length',
    applications: ['Interior walls', 'Ceiling installation', 'Drywall to wood studs', 'Drywall to metal studs'],
    image: '/images/products/drywall-screws-1.jpg',
    priceRange: '$0.50 - $2.00 per kg'
  },
  {
    id: 'self-drilling-screws',
    name: 'Self-Drilling Screws',
    description: 'High-performance self-drilling screws with drill point for metal applications. No pre-drilling required for thin metal sheets.',
    material: 'Carbon Steel, Stainless Steel',
    coating: 'Zinc Plated, Ruspert, Dacromet',
    sizeRange: '3.5mm - 6.3mm diameter, 19mm - 150mm length',
    applications: ['Metal roofing', 'Steel frame construction', 'HVAC ductwork', 'Automotive panels'],
    image: '/images/products/self-drilling-screws-1.jpg',
    priceRange: '$1.00 - $3.50 per kg'
  },
  {
    id: 'bolts-nuts',
    name: 'Bolts & Nuts',
    description: 'Industrial grade bolts and nuts for heavy-duty applications. Available in various grades and thread types.',
    material: 'Carbon Steel, Alloy Steel, Stainless Steel',
    coating: 'Zinc Plated, Hot Dipped Galvanized, Black Oxide',
    sizeRange: 'M6 - M30 diameter, various lengths',
    applications: ['Construction', 'Machinery assembly', 'Automotive', 'Infrastructure projects'],
    image: '/images/products/bolts-nuts-1.jpg',
    priceRange: '$1.50 - $8.00 per kg'
  },
  {
    id: 'ibr-nails',
    name: 'IBR Nails',
    description: 'Specialized IBR (Inverted Box Rib) nails for roofing applications. Designed for securing IBR roof sheets to purlins.',
    material: 'Carbon Steel',
    coating: 'Galvanized',
    sizeRange: 'Various sizes available',
    applications: ['IBR roof sheeting', 'Corrugated roofing', 'Industrial roofing', 'Agricultural structures'],
    image: '/images/products/ibr-nails-placeholder.jpg',
    priceRange: '$0.80 - $2.50 per kg'
  }
];

// 生成Product Schema
const generateProductSchema = (product: typeof products[0]) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": `https://tradego-fasteners.vercel.app${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": "TradeGo Fasteners"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "TradeGo Fasteners",
      "url": "https://tradego-fasteners.vercel.app"
    },
    "material": product.material,
    "category": "Fasteners",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": product.priceRange.split(' - ')[0].replace('$', ''),
      "highPrice": product.priceRange.split(' - ')[1].replace(' per kg', '').replace('$', ''),
      "offerCount": "100",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "TradeGo Fasteners"
      }
    }
  };
};

export default function ProductGrid() {
  return (
    <>
      {/* 为每个产品注入Schema标记 */}
      {products.map(product => (
        <Script
          key={product.id}
          id={`product-schema-${product.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema(product))
          }}
        />
      ))}
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              High-quality fasteners manufactured to international standards. 
              ISO 9001 certified for consistent quality and reliability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                itemScope
                itemType="https://schema.org/Product"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" itemProp="name">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3" itemProp="description">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Material:</span>
                      <span>{product.material}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Size:</span>
                      <span className="text-xs">{product.sizeRange}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-lg font-bold text-blue-900">
                      {product.priceRange}
                    </span>
                    <Link 
                      href={`/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}