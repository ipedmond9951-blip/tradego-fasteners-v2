import Script from 'next/script';
import { type Locale } from '@/i18n';

interface FAQSectionProps {
  locale: Locale;
  messages?: Record<string, unknown>;
}

// FAQ data with translations
const faqData: Record<Locale, Array<{ question: string; answer: string }>> = {
  en: [
    {
      question: "What is a drywall screw and what is it used for?",
      answer: "Drywall screws are specialized fasteners designed for attaching gypsum boards (drywall) to wood or metal studs. They feature a bugle-shaped head that prevents damage to the drywall surface and a sharp point that allows for easy penetration without pre-drilling."
    },
    {
      question: "What types of screws does TradeGo Fasteners manufacture?",
      answer: "TradeGo Fasteners manufactures a wide range of fasteners including drywall screws, self-drilling screws, self-tapping screws, wood screws, machine screws, chipboard screws, IBR nails, and various types of bolts and nuts."
    },
    {
      question: "What is the difference between self-drilling and self-tapping screws?",
      answer: "Self-drilling screws have a drill bit-like point that can create its own hole in thin metal, eliminating the need for pre-drilling. Self-tapping screws require a pre-drilled hole and create threads as they're driven into the material."
    },
    {
      question: "Does TradeGo Fasteners offer custom fastener solutions?",
      answer: "Yes, we provide custom fastener manufacturing services. We can produce fasteners according to your specific requirements including custom sizes, materials, coatings, head types, and thread patterns."
    },
    {
      question: "What certifications does TradeGo Fasteners have?",
      answer: "TradeGo Fasteners is ISO 9001:2015 certified. We also comply with international standards such as DIN, ANSI, JIS, and GB. Our products undergo rigorous quality control and testing."
    },
    {
      question: "What is the minimum order quantity (MOQ)?",
      answer: "MOQ varies by product type and customization. For standard fasteners, MOQ is typically 100kg or 10,000 pieces. For custom orders, MOQ may be higher. Contact our sales team for specific requirements."
    },
    {
      question: "What countries does TradeGo Fasteners ship to?",
      answer: "We ship to over 50 countries worldwide, including the United States, Canada, European Union, Australia, New Zealand, Southeast Asia, Middle East, and African nations."
    },
    {
      question: "What is the typical lead time for orders?",
      answer: "Lead times depend on order size and product availability. For standard products in stock, orders typically ship within 5-7 business days. For custom orders or large quantities, lead times range from 15-30 days."
    }
  ],
  zh: [
    {
      question: "什么是干壁钉？有什么用途？",
      answer: "干壁钉是专门用于将石膏板（干墙）固定到木龙骨或金属龙骨上的紧固件。它们具有喇叭形头部，可防止损坏石膏板表面，尖锐点可轻松穿透无需预钻孔。"
    },
    {
      question: "TradeGo Fasteners生产哪些类型的螺丝？",
      answer: "TradeGo Fasteners生产多种紧固件，包括干壁钉、自钻螺丝、自攻螺丝、木螺丝、机螺丝、刨花板螺丝、IBR钉以及各种螺栓和螺母。"
    },
    {
      question: "自钻螺丝和自攻螺丝有什么区别？",
      answer: "自钻螺丝具有钻尖状头部，可在薄金属上自行钻孔，无需预钻孔。自攻螺丝需要预钻孔，在拧入材料时创建螺纹。"
    },
    {
      question: "TradeGo Fasteners提供定制紧固件服务吗？",
      answer: "是的，我们提供定制紧固件制造服务。我们可以根据您的具体要求生产，包括定制尺寸、材料、涂层、头型和螺纹规格。"
    },
    {
      question: "TradeGo Fasteners有哪些认证？",
      answer: "TradeGo Fasteners通过ISO 9001:2015认证。我们同时也符合DIN、ANSI、JIS和GB等国际标准。产品经过严格的质量控制和检测。"
    },
    {
      question: "最小起订量是多少？",
      answer: "最小起订量因产品类型和定制要求而异。标准紧固件通常为100公斤或10,000件起订。定制订单可能需要更高起订量。请联系我们的销售团队了解具体要求。"
    },
    {
      question: "TradeGo Fasteners发货到哪些国家？",
      answer: "我们发货到全球50多个国家，包括美国、加拿大、欧盟国家、澳大利亚、新西兰、东南亚国家、中东国家和非洲国家。"
    },
    {
      question: "订单的交货期是多长？",
      answer: "交货期取决于订单大小和产品库存。现货标准产品通常5-7个工作日发货。定制订单或大批量订单交货期为15-30天。"
    }
  ]
};

// Generate FAQ Schema
const generateFAQSchema = (faqs: typeof faqData.en) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export default function FAQSection({ locale }: FAQSectionProps) {
  const faqs = faqData[locale] || faqData.en;
  const title = locale === 'zh' ? '常见问题' : 'Frequently Asked Questions';
  const subtitle = locale === 'zh' 
    ? '查找关于我们紧固件和服务的常见问题解答' 
    : 'Find answers to common questions about our fasteners and services';
  const contactText = locale === 'zh' ? '还有其他问题？我们的专家团队随时为您解答。' : 'Have more questions? Our expert team is here to help.';
  const contactCta = locale === 'zh' ? '联系我们' : 'Contact Us';

  return (
    <>
      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqs))
        }}
      />
      
      <section id="faq-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
              {title}
            </h2>
            <p className="text-gray-600 text-center mb-12">
              {subtitle}
            </p>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details 
                  key={index}
                  className="group bg-gray-50 rounded-lg overflow-hidden"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-lg pr-4" itemProp="name">
                      {faq.question}
                    </h3>
                    <svg 
                      className="w-6 h-6 text-blue-900 transform group-open:rotate-180 transition-transform flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div 
                    className="px-6 pb-6 text-gray-600"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                {contactText}
              </p>
              <a 
                href="#inquiry" 
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                {contactCta}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
