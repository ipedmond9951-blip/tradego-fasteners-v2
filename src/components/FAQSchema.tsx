'use client'

import { type Locale } from '@/i18n'

interface FAQSchemaProps {
  locale: Locale
}

const faqSchemaData: Record<string, Array<{ question: string; answer: string }>> = {
  en: [
    { question: "What is your minimum order quantity?", answer: "Our MOQ varies by product. Generally, MOQ is 500-1000 pieces per order. Contact us for specific product requirements." },
    { question: "What payment methods do you accept?", answer: "We accept T/T, L/C, PayPal, and Western Union. For first-time buyers, we recommend T/T 30% deposit." },
    { question: "Can I get free samples?", answer: "Yes, we provide free samples for quality inspection. Shipping cost will be paid by buyer." },
    { question: "What is your delivery time?", answer: "Standard delivery is 15-25 days after order confirmation. For large orders, please contact us in advance." },
    { question: "Do you offer custom packaging?", answer: "Yes, we offer OEM packaging with your logo. MOQ for custom packaging is 10,000 pieces." },
  ],
  zh: [
    { question: "最小起订量是多少？", answer: "我们的MOQ因产品而异。一般每单500-1000件。请联系我们了解具体产品要求。" },
    { question: "你们接受哪些付款方式？", answer: "我们接受T/T、L/C、PayPal和西联汇款。对于首次买家，推荐T/T 30%定金。" },
    { question: "可以提供免费样品吗？", answer: "是的，我们提供免费样品供质量检验。运费由买方承担。" },
    { question: "交货时间是多少？", answer: "标准交货时间为订单确认后15-25天。大订单请提前联系我们。" },
    { question: "你们提供定制包装吗？", answer: "是的，我们提供带您logo的OEM包装。定制包装MOQ为10,000件。" },
  ],
}

export default function FAQSchema({ locale }: FAQSchemaProps) {
  const faqs = faqSchemaData[locale] || faqSchemaData.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
