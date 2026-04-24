'use client'

import { type Locale } from '@/i18n'

interface FAQSchemaProps {
  locale: Locale
}

const faqSchemaData: Record<string, Array<{ question: string; answer: string }>> = {
  en: [
    { question: "What is your minimum order quantity?", answer: "Our MOQ is 500 pieces for standard fasteners. For custom/OEM orders, MOQ is typically 1,000-5,000 pieces. We've supplied 500+ clients across 20+ African countries since 2012, with orders ranging from 500 to 500,000 pieces per shipment." },
    { question: "What payment methods do you accept?", answer: "We accept T/T (30% deposit, 70% before shipment), L/C at sight, PayPal (for samples under $500), and Western Union. We also offer Trade Assurance via Alibaba for orders up to $100,000." },
    { question: "Can I get free samples?", answer: "Yes, we provide 5-10 free samples per product for quality inspection. Samples ship within 3 business days via DHL/FedEx. Clients in Zimbabwe, South Africa, and Kenya have received samples within 7-14 days." },
    { question: "What is your delivery time?", answer: "Standard orders (500-10,000 pcs): 15-25 days. Large orders (10,000+ pcs): 25-40 days. Express production available for urgent orders (7-10 days, 15% surcharge). 98% of orders ship on time." },
    { question: "Do you offer custom packaging?", answer: "Yes, OEM packaging available with your logo. Custom packaging MOQ is 5,000 pieces. We offer: color boxes, poly bags, pallet packaging, and bag-with-hanger options. All packaging complies with ISO 9001 standards." },
    { question: "What certifications do your fasteners have?", answer: "Our products hold ISO 9001:2015, CE (EN standard), and SABS certifications. We test tensile strength, torque, and corrosion resistance per DIN, ISO, and ASTM standards. Test reports available upon request." },
    { question: "How do you ensure quality control?", answer: "We implement 3-stage QC: 1) Incoming material inspection, 2) In-process sampling (every 500kg), 3) Pre-shipment inspection. Our defect rate is under 0.5% (industry average: 2-3%)." },
    { question: "Which countries do you export to?", answer: "We export to 20+ African countries (Zimbabwe, South Africa, Kenya, Nigeria, Ghana, Tanzania, Zambia, Uganda) plus Middle East and Southeast Asia. Africa accounts for 65% of our exports, with sea freight to Durban, Lagos, and Mombasa." },
    { question: "What are your most popular fastener products?", answer: "Our best-selling products are: 1) Drywall screws (3.5x25mm bugle head, fine thread) - 25% of orders, 2) Self-drilling TEK screws (#8x1/2 inch) - 20% of orders, 3) IBR roofing nails (3.05x75mm) - 18% of orders, 4) Hex bolts M10x50 Grade 8.8 - 15% of orders. We ship 50+ containers monthly, with 65% to African ports including Durban, Lagos, and Mombasa." },
    { question: "Do you provide technical specifications and datasheets?", answer: "Yes, we provide full technical datasheets for all products including: tensile strength (MPa), yield strength (MPa), torque values, hardness (HRC), and coating thickness (μm). Datasheets comply with DIN, ISO, and ASTM standards. Request via email or WhatsApp." },
  ],
  zh: [
    { question: "最小起订量是多少？", answer: "标准紧固件MOQ为500件。定制/OEM订单MOQ通常为1000-5000件。自2012年以来，我们已为500+全球客户提供服务，每批订单量从500件到500,000件不等。" },
    { question: "你们接受哪些付款方式？", answer: "我们接受T/T（30%定金，70%发货前付清）、L/C即期、PayPal（500美元以下的样品订单）和西联汇款。100,000美元以下的订单也可通过阿里巴巴信用保障服务。" },
    { question: "可以提供免费样品吗？", answer: "是的，每款产品提供5-10个免费样品供质量检验。样品在3个工作日内发货。津巴布韦、南非和肯尼亚的客户通常在7-14天内收到样品。" },
    { question: "交货时间是多少？", answer: "标准订单（500-10,000件）：15-25天。大订单（10,000+件）：25-40天。紧急订单可加急生产（7-10天，加收15%加急费）。98%的订单准时发货。" },
    { question: "你们提供定制包装吗？", answer: "是的，可提供带您logo的OEM包装。定制包装MOQ为5,000件。我们提供：彩盒、塑料袋、托盘包装和挂袋包装。所有包装符合ISO 9001标准。" },
    { question: "你们的产品有哪些认证？", answer: "我们的产品持有ISO 9001:2015、CE（EN标准）和SABS认证。我们按照DIN、ISO和ASTM标准测试抗拉强度、扭矩和耐腐蚀性。可提供测试报告。" },
    { question: "你们如何确保质量控制？", answer: "我们实施三阶段QC：1）来料检验，2）过程抽样（每500kg），3）发货前检验。我们的缺陷率低于0.5%（行业平均：2-3%）。" },
    { question: "你们出口到哪些国家？", answer: "我们出口到47个国家，包括非洲（津巴布韦、南非、肯尼亚、尼日利亚、加纳）、中东（阿联酋、沙特阿拉伯）和东南亚（越南、泰国）。非洲占我们出口的65%。" },
    { question: "你们最受欢迎的紧固件产品是什么？", answer: "我们最畅销的产品是：1）干墙螺丝（3.5x25mm自攻型，细牙）占订单的25%，2）自钻TEK螺丝（#8x1/2英寸）占20%，3）IBR屋顶钉（3.05x75mm）占18%，4）六角螺栓M10x50 Grade 8.8占15%。我们每月向全球客户发运50+集装箱。" },
    { question: "你们提供技术规格和产品说明书吗？", answer: "是的，我们为所有产品提供完整的技术数据表，包括：抗拉强度（MPa）、屈服强度（MPa）、扭矩值、硬度（HRC）和涂层厚度（μm）。数据表符合DIN、ISO和ASTM标准。可通过电子邮件或WhatsApp获取。" },
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
