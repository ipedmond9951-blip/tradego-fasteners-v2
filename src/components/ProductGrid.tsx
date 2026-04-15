'use client';

import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import { type Locale, type Messages } from '@/i18n';

interface ProductGridProps {
  locale: Locale;
  messages: Messages;
}

// 产品数据 - USD价格为基准
const products = [
  {
    id: 'drywall-screws',
    name: { en: 'Drywall Screws', zh: '干壁钉' },
    description: { 
      en: 'Premium quality drywall screws for gypsum board installation. Features bugle head design and sharp point for easy penetration.',
      zh: '优质干壁钉，用于石膏板安装。喇叭头设计，尖锐点易于穿透。'
    },
    material: { en: 'Carbon Steel', zh: '碳钢' },
    coating: { en: 'Phosphate, Zinc Plated', zh: '磷化、镀锌' },
    sizeRange: '3.5mm - 4.8mm diameter, 25mm - 100mm length',
    applications: { en: ['Interior walls', 'Ceiling installation', 'Drywall to wood studs'], zh: ['内墙', '天花板安装', '干墙到木龙骨'] },
    image: '/images/products/drywall-screws-1.jpg',
    usdPrice: 1.25, // per kg
  },
  {
    id: 'self-drilling-screws',
    name: { en: 'Self-Drilling Screws', zh: '自钻螺丝' },
    description: { 
      en: 'High-performance self-drilling screws with drill point for metal applications. No pre-drilling required for thin metal sheets.',
      zh: '高性能自钻螺丝，带有钻尖，适用于金属应用。薄金属板无需预钻孔。'
    },
    material: { en: 'Carbon Steel, Stainless Steel', zh: '碳钢、不锈钢' },
    coating: { en: 'Zinc Plated, Ruspert, Dacromet', zh: '镀锌、Ruspert、达克罗' },
    sizeRange: '3.5mm - 6.3mm diameter, 19mm - 150mm length',
    applications: { en: ['Metal roofing', 'Steel frame construction', 'HVAC ductwork'], zh: ['金属屋面', '钢架结构', '暖通管道'] },
    image: '/images/products/self-drilling-screws-1.jpg',
    usdPrice: 2.25,
  },
  {
    id: 'bolts-nuts',
    name: { en: 'Bolts & Nuts', zh: '螺栓螺母' },
    description: { 
      en: 'Industrial grade bolts and nuts for heavy-duty applications. Available in various grades and thread types.',
      zh: '工业级螺栓螺母，适用于重型应用。多种等级和螺纹类型可选。'
    },
    material: { en: 'Carbon Steel, Alloy Steel, Stainless Steel', zh: '碳钢、合金钢、不锈钢' },
    coating: { en: 'Zinc Plated, Hot Dipped Galvanized', zh: '镀锌、热镀锌' },
    sizeRange: 'M6 - M30 diameter, various lengths',
    applications: { en: ['Construction', 'Machinery assembly', 'Automotive'], zh: ['建筑', '机械组装', '汽车'] },
    image: '/images/products/bolts-nuts-1.jpg',
    usdPrice: 4.75,
  },
  {
    id: 'ibr-nails',
    name: { en: 'IBR Nails', zh: 'IBR钉' },
    description: { 
      en: 'Specialized IBR nails for roofing applications. Designed for securing IBR roof sheets to purlins.',
      zh: '专用IBR钉，用于屋面应用。设计用于将IBR屋面板固定到檩条上。'
    },
    material: { en: 'Carbon Steel', zh: '碳钢' },
    coating: { en: 'Galvanized', zh: '镀锌' },
    sizeRange: 'Various sizes available',
    applications: { en: ['IBR roof sheeting', 'Corrugated roofing', 'Industrial roofing'], zh: ['IBR屋面板', '波纹屋面', '工业屋面'] },
    image: '/images/products/ibr-nails-placeholder.jpg',
    usdPrice: 1.65,
  }
];

// 生成Product Schema
const generateProductSchema = (product: typeof products[0], locale: Locale) => {
  const BASE_URL = 'https://tradego-fasteners-v2.vercel.app';
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": (product.name as Record<string,string>)[locale] || product.name.en,
    "description": (product.description as Record<string,string>)[locale] || product.description.en,
    "image": `${BASE_URL}${product.image}`,
    "brand": { "@type": "Brand", "name": "TradeGo Fasteners" },
    "manufacturer": { "@type": "Organization", "name": "TradeGo Fasteners" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.usdPrice.toFixed(2),
      "availability": "https://schema.org/InStock",
    }
  };
};

export default function ProductGrid({ locale, messages }: ProductGridProps) {
  const { formatPrice } = useCurrency();
  const productsTitle = messages.products?.title || 'Our Products';
  const productsSubtitle = messages.products?.subtitle || 'High-quality fasteners for construction and industrial applications';
  const inquireText = locale === 'zh' ? '立即询价' : 'Inquire Now';

  return (
    <>
      {/* Schema for each product */}
      {products.map(product => (
        <Script
          key={product.id}
          id={`product-schema-${product.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema(product, locale))
          }}
        />
      ))}
      
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{productsTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{productsSubtitle}</p>
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
                    alt={(product.name as Record<string,string>)[locale] || product.name.en}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" itemProp="name">
                    {(product.name as Record<string,string>)[locale] || product.name.en}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3" itemProp="description">
                    {(product.description as Record<string,string>)[locale] || product.description.en}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">{locale === 'zh' ? '材质:' : 'Material:'}</span>
                      <span>{(product.material as Record<string,string>)[locale] || product.material.en}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">{locale === 'zh' ? '规格:' : 'Size:'}</span>
                      <span className="text-xs">{product.sizeRange}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-lg font-bold text-blue-900">
                      {formatPrice(product.usdPrice)}/{locale === 'zh' ? '公斤' : 'kg'}
                    </span>
                    <Link 
                      href={`/${locale}/products/${product.id}#inquiry`}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      {inquireText}
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
              href={`/${locale}/products`} 
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              {locale === 'zh' ? '查看所有产品' : 'View All Products'}
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
