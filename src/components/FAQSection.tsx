import Script from 'next/script';

// FAQ数据
const faqData = [
  {
    question: "What is a drywall screw and what is it used for?",
    answer: "Drywall screws are specialized fasteners designed for attaching gypsum boards (drywall) to wood or metal studs. They feature a bugle-shaped head that prevents damage to the drywall surface and a sharp point that allows for easy penetration without pre-drilling. They're commonly used in interior construction, renovation projects, and wall installations."
  },
  {
    question: "What types of screws does TradeGo Fasteners manufacture?",
    answer: "TradeGo Fasteners manufactures a wide range of fasteners including drywall screws, self-drilling screws, self-tapping screws, wood screws, machine screws, chipboard screws, IBR nails, and various types of bolts and nuts. We offer different materials, coatings, and sizes to meet diverse industrial and construction needs."
  },
  {
    question: "What is the difference between self-drilling and self-tapping screws?",
    answer: "Self-drilling screws have a drill bit-like point that can create its own hole in thin metal, eliminating the need for pre-drilling. Self-tapping screws, on the other hand, require a pre-drilled hole and create threads as they're driven into the material. Self-drilling screws are ideal for metal-to-metal applications, while self-tapping screws work well in wood, plastic, and metal with pilot holes."
  },
  {
    question: "Does TradeGo Fasteners offer custom fastener solutions?",
    answer: "Yes, TradeGo Fasteners provides custom fastener manufacturing services. We can produce fasteners according to your specific requirements including custom sizes, materials, coatings, head types, and thread patterns. Our engineering team works closely with clients to develop tailored solutions for unique applications."
  },
  {
    question: "What certifications does TradeGo Fasteners have?",
    answer: "TradeGo Fasteners is ISO 9001:2015 certified, demonstrating our commitment to quality management systems. We also comply with international standards such as DIN, ANSI, JIS, and GB. Our products undergo rigorous quality control processes and testing to ensure they meet or exceed industry specifications."
  },
  {
    question: "What is the minimum order quantity (MOQ) for TradeGo Fasteners?",
    answer: "Our minimum order quantity varies depending on the product type and customization requirements. For standard fasteners, our MOQ is typically 100kg or 10,000 pieces. For custom orders, the MOQ may be higher due to setup costs. Contact our sales team for specific MOQ information for your requirements."
  },
  {
    question: "What countries does TradeGo Fasteners ship to?",
    answer: "TradeGo Fasteners ships to over 50 countries worldwide, including the United States, Canada, European Union countries, Australia, New Zealand, Southeast Asian countries, Middle Eastern countries, and African nations. We work with reliable international logistics partners to ensure timely and cost-effective delivery."
  },
  {
    question: "What is the typical lead time for orders?",
    answer: "Lead times depend on order size and product availability. For standard products in stock, orders typically ship within 5-7 business days. For custom orders or large quantities, lead times range from 15-30 days. We work closely with customers to meet their project timelines and can arrange expedited production when needed."
  }
];

// 生成FAQ Schema
const generateFAQSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export default function FAQSection() {
  return (
    <>
      {/* FAQ Schema标记 - 最关键的GEO元素 */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema())
        }}
      />
      
      <section id="faq-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Find answers to common questions about our fasteners and services
            </p>
            
            <div className="space-y-4">
              {faqData.map((faq, index) => (
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
                Have more questions? Our expert team is here to help.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Contact Us
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