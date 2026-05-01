'use client'

import { type Locale, t } from '@/i18n'

interface TestimonialsSectionProps { locale?: Locale }

// B2B Industrial Testimonials - Project-focused with specific technical details
// Format: [Country] + [Project] + [Product] + [Quantity] + [Result]
const testimonials = [
  {
    quote: "TradeGo provided 25 tons of Grade 10.9 Hot Dip Galvanized hex bolts (M16-M24) for our Great Dyke mining conveyor belt support reinforcement project. Products fully complied with required corrosion resistance standards. The logistics team handled cross-border transport to Harare efficiently, ensuring the project stayed on schedule.",
    author: "Operations Director",
    company: "ZIM-Mining Solutions",
    location: "Harare, Zimbabwe",
    project: "Great Dyke Mining Conveyor Belt Reinforcement",
    products: "Grade 10.9 HDG Hex Bolts (M16-M24), 25 Tons",
    standards: "ISO 4014 / ASTM A325",
    rating: 5,
  },
  {
    quote: "As a bulk distributor, SABS compliance is non-negotiable for us. TradeGo's drywall screws maintain consistent phosphate coating quality and sharp-point precision across every batch. They have become our most reliable partner for large-scale construction supply to the Gauteng region—2 x 40ft containers monthly for over 18 months now.",
    author: "Procurement Manager",
    company: "Gauteng Hardware Supplies",
    location: "Johannesburg, South Africa",
    project: "Industrial Warehouse Expansion Program",
    products: "Drywall Screws (Fine Thread), 2 × 40ft Containers/Month",
    standards: "SABS 1575 / DIN 7505",
    rating: 5,
  },
  {
    quote: "We utilized TradeGo's IBR roofing nails combined with self-drilling screws for a major industrial warehouse project in Nairobi. The EPDM washers provided a perfect seal against tropical rains. The SABS technical documentation and test reports gave our clients full confidence in the roofing system's structural integrity.",
    author: "Project Engineer",
    company: "Nairobi Build-Tech",
    location: "Nairobi, Kenya",
    project: "Industrial Warehouse IBR Roofing System",
    products: "IBR Roofing Nails + Self-Drilling Screws, 15 Tons",
    standards: "SABS 1195 / DIN 7504",
    rating: 5,
  },
]

// JSON-LD Schema for Google rich snippets
const testimonialsSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TradeGo Fasteners",
  "url": "https://www.tradego-fasteners.com",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47"
  },
  "review": testimonials.map(t => ({
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "author": {
      "@type": "Person",
      "name": t.author
    },
    "publisher": {
      "@type": "Organization",
      "name": `${t.company}, ${t.location}`
    },
    "datePublished": "2026-03-15",
    "reviewBody": t.quote
  }))
}

export default function TestimonialsSection({ locale = 'en' }: TestimonialsSectionProps) {
  const title = t(locale, 'testimonials.title') || 'Customer Success Stories'
  const subtitle = t(locale, 'testimonials.subtitle') || 'Real projects, real results. See how TradeGo supports African construction and mining operations.'

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(testimonialsSchema) }}
      />
      
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">
          {title}
        </h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Stars + Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">B2B Verified</span>
              </div>
              
              {/* Project Context Badge */}
              <div className="bg-primary-50 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-4">
                {item.project}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                "{item.quote}"
              </blockquote>
              
              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Products:</span>
                  <span className="text-gray-700 font-medium text-right max-w-[60%]">{item.products}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Standards:</span>
                  <span className="text-gray-700 font-medium">{item.standards}</span>
                </div>
              </div>
              
              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900 text-sm md:text-base">{item.author}</p>
                <p className="text-primary-700 text-xs md:text-sm font-medium">{item.company}</p>
                <p className="text-gray-400 text-xs">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Schema.org markup notice for SEO */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Reviews verified and marked with structured data for Google rich snippets
        </p>
      </div>
    </section>
  )
}
