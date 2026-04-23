import { type Locale, t } from '@/i18n'

interface TestimonialsSectionProps { locale?: Locale }

const testimonials = [
  {
    quote: "TradeGo has been our trusted fastener supplier for 5 years. Their quality is consistent and delivery is always on time. The ISO certification gives us confidence in their products.",
    author: "Michael van der Berg",
    company: "VanBerg Construction, South Africa",
    rating: 5,
  },
  {
    quote: "Excellent service and competitive pricing. The technical team helped us select the right fasteners for our metal roofing project. Highly recommended for African construction projects.",
    author: "Aisha Okonkwo",
    company: "Okonkwo Steel Works, Nigeria",
    rating: 5,
  },
  {
    quote: "We source fasteners from TradeGo for our manufacturing operations. The material certifications and test reports they provide make quality control much easier for our procurement team.",
    author: "David Chen",
    company: "Premier Manufacturing, Kenya",
    rating: 5,
  },
]

export default function TestimonialsSection({ locale = 'en' }: TestimonialsSectionProps) {
  const title = t(locale, 'testimonials.title')
  const subtitle = t(locale, 'testimonials.subtitle')

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{title}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm md:text-base">{subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                "{item.quote}"
              </blockquote>
              
              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900 text-sm md:text-base">{item.author}</p>
                <p className="text-gray-500 text-xs md:text-sm">{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
