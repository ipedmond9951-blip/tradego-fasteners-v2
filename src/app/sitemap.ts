import { locales } from '@/i18n'

export default function sitemap() {
  const baseUrl = 'https://tradego-fasteners.com'
  
  const staticPages = ['', '/products', '/industry', '/product-upload']
  
  const articleSlugs = [
    'drywall-screws-complete-guide',
    'self-drilling-screws-selection-guide',
    'ibr-roofing-nails-installation-guide',
    'bolt-grade-markings-guide',
    'africa-fastener-market-opportunities-2026',
    'galvanized-vs-stainless-steel-fasteners',
    'fastener-quality-control-iso9001',
    'hex-bolt-dimensions-chart',
    'concrete-anchors-fasteners-guide',
    'carriage-bolts-specifications',
    'zinc-plated-vs-black-phosphate-screws',
    'roofing-screws-epdm-washer-guide',
    'fastener-packaging-shipping-guide',
    'construction-fastener-standards-comparison',
    'thread-types-guide-metric-imperial',
    'flat-washers-vs-spring-washers',
    'nylon-nuts-bolts-guide',
    'fastener-corrosion-resistance-guide',
  ]

  const entries = []
  
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date().toISOString(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.7,
      })
    }
    
    for (const slug of articleSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/industry/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }
  
  return entries
}
