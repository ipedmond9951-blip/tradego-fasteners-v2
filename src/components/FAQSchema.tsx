'use client'

import { type Locale } from '@/i18n'

interface FAQSchemaProps {
  locale: Locale
}

// Expanded FAQ with 5W1H coverage
const faqSchemaData: Record<string, Array<{ question: string; answer: string }>> = {
  en: [
    // WHAT questions
    { question: "What is your minimum order quantity?", answer: "Our MOQ is 500 pieces for standard fasteners. For custom/OEM orders, MOQ is typically 1,000-5,000 pieces. We've supplied 500+ clients across 20+ African countries since 2012, with orders ranging from 500 to 500,000 pieces per shipment." },
    { question: "What payment methods do you accept?", answer: "We accept T/T (30% deposit, 70% before shipment), L/C at sight, PayPal (for samples under $500), and Western Union. We also offer Trade Assurance via Alibaba for orders up to $100,000." },
    { question: "What are your most popular fastener products?", answer: "Our best-selling products are: 1) Drywall screws (3.5x25mm bugle head, fine thread) - 25% of orders, 2) Self-drilling TEK screws (#8x1/2 inch) - 20% of orders, 3) IBR roofing nails (3.05x75mm) - 18% of orders, 4) Hex bolts M10x50 Grade 8.8 - 15% of orders. We ship 50+ containers monthly, with 65% to African ports including Durban, Lagos, and Mombasa." },
    { question: "What certifications do your fasteners have?", answer: "Our products hold ISO 9001:2015, CE (EN standard), and SABS certifications. We test tensile strength, torque, and corrosion resistance per DIN, ISO, and ASTM standards. Test reports available upon request." },
    { question: "What is your production capacity?", answer: "Our factory operates 3 production lines with a monthly capacity of 500 tons. We can produce up to 50 tons of fasteners per day, enabling us to fulfill large orders within 15-25 days for standard products." },
    
    // HOW questions
    { question: "How do you ensure quality control?", answer: "We implement 3-stage QC: 1) Incoming material inspection, 2) In-process sampling (every 500kg), 3) Pre-shipment inspection. Our defect rate is under 0.5% (industry average: 2-3%)." },
    { question: "How can I get free samples?", answer: "Yes, we provide 5-10 free samples per product for quality inspection. Samples ship within 3 business days via DHL/FedEx. Clients in Zimbabwe, South Africa, and Kenya have received samples within 7-14 days." },
    { question: "How do I track my order?", answer: "We provide tracking numbers for all shipments via DHL, FedEx, or sea freight. You can track your order online or contact your dedicated sales manager via WhatsApp for real-time updates on production and shipping status." },
    { question: "How do I place a custom OEM order?", answer: "Send your specifications (dimensions, material, coating, packaging) via email or WhatsApp. Our engineering team will provide a quote within 24 hours. After approval, we create samples (7-10 days) and proceed with bulk production upon sample confirmation." },
    { question: "How do you handle quality disputes?", answer: "We have a 100% quality guarantee policy. If any defect rate exceeds 1%, we offer full refund or replacement. Our claim resolution time is typically 48 hours, and we maintain a 98% customer satisfaction rate." },
    
    // WHY questions
    { question: "Why choose TradeGo as your fastener supplier?", answer: "1) 12+ years Africa-focused experience, 2) ISO 9001 & SABS certified factory, 3) 65% of exports go to Africa with optimized logistics, 4) Defect rate 0.5% vs industry average 2-3%, 5) 50+ containers shipped monthly, 6) 500+ clients across 20+ African countries." },
    { question: "Why are your prices competitive?", answer: "We are a direct manufacturer with 3 production lines, eliminating middlemen. Our factory-direct pricing saves you 15-30% compared to traders. We offer price matching for equivalent products and volume discounts starting at 10,000 pieces." },
    { question: "Why do African construction companies choose TradeGo?", answer: "1) SABS certification meets African import standards, 2) Optimized sea freight routes to Durban, Lagos, Mombasa (15-35 days), 3) Special packaging for tropical climate conditions, 4) Technical support for correct fastener selection, 5) 98% on-time delivery rate." },
    
    // WHERE questions
    { question: "Where are your products used?", answer: "Our fasteners are widely used in: 1) Residential and commercial construction, 2) IBR and corrugated roofing installations, 3) Steel structure projects, 4) Solar panel mounting systems, 5) HVAC installations, 6) Wood frame construction, 7) Interior decoration and drywall partitioning." },
    { question: "Where do you ship from?", answer: "We ship from Shenzhen Port, China. Our main shipping routes: 1) To Durban (South Africa): 20-25 days, 2) To Lagos (Nigeria): 25-30 days, 3) To Mombasa (Kenya): 20-25 days, 4) To Beira (Mozambique): 15-20 days. Air freight available for urgent samples." },
    { question: "Where can I see your product catalog?", answer: "Our full product catalog is available on our website at tradego-fasteners.com. You can browse products by category (screws, bolts, nails, anchors), filter by specifications, and request quotes directly. Physical samples can be shipped within 3 business days." },
    
    // WHEN questions
    { question: "When can I expect delivery?", answer: "Standard orders (500-10,000 pcs): 15-25 days. Large orders (10,000+ pcs): 25-40 days. Express production available for urgent orders (7-10 days, 15% surcharge). 98% of orders ship on time." },
    { question: "When should I use drywall screws vs self-drilling screws?", answer: "Use drywall screws for drywall-to-wood or drywall-to-metal studs (under 0.75mm). Use self-drilling TEK screws for metal-to-metal fastening (0.75-2.5mm steel). For steel thicker than 2.5mm, pre-drilling is required. Contact us for free technical consultation." },
    { question: "When were you established?", answer: "TradeGo was established in 2012, specializing in fastener manufacturing and export. Since then, we have grown to become one of the leading China-Africa fastener suppliers, serving 500+ clients across 20+ African countries with a monthly export volume of 50+ containers." },
    
    // WHO questions
    { question: "Who should I contact for a quote?", answer: "Contact our sales team via: Email: info@tradego-fasteners.com | WhatsApp: +86 159 6340 9951. Our team responds to inquiries within 2 hours during business hours (Monday-Friday, 9AM-6PM China Standard Time)." },
    { question: "Who are your main customers in Africa?", answer: "Our African customers include: 1) Hardware distributors and retailers, 2) Construction companies and contractors, 3) Roofing specialists and sheet metal workers, 4) Solar panel installers, 5) Manufacturing facilities. Major markets: South Africa (35%), Kenya (20%), Nigeria (15%), Zimbabwe (10%), other African countries (20%)." },
  ],
  zh: [
    // WHAT questions
    { question: "最小起订量是多少？", answer: "标准紧固件MOQ为500件。定制/OEM订单MOQ通常为1000-5000件。自2012年以来，我们已为500+全球客户提供服务，每批订单量从500件到500,000件不等。" },
    { question: "你们接受哪些付款方式？", answer: "我们接受T/T（30%定金，70%发货前付清）、L/C即期、PayPal（500美元以下的样品订单）和西联汇款。100,000美元以下的订单也可通过阿里巴巴信用保障服务。" },
    { question: "你们最受欢迎的紧固件产品是什么？", answer: "我们最畅销的产品是：1）干墙螺丝（3.5x25mm自攻型，细牙）占订单的25%，2）自钻TEK螺丝（#8x1/2英寸）占20%，3）IBR屋顶钉（3.05x75mm）占18%，4）六角螺栓M10x50 Grade 8.8占15%。我们每月发运50+集装箱，其中65%运往非洲港口，包括德班、拉各斯和蒙巴萨。" },
    { question: "你们的产品有哪些认证？", answer: "我们的产品持有ISO 9001:2015、CE（EN标准）和SABS认证。我们按照DIN、ISO和ASTM标准测试抗拉强度、扭矩和耐腐蚀性。可提供测试报告。" },
    { question: "你们的产能是多少？", answer: "我们拥有3条生产线，月产能500吨。每天可生产50多吨紧固件，使我们能够在15-25天内完成大额订单的标准产品生产。" },
    
    // HOW questions
    { question: "你们如何确保质量控制？", answer: "我们实施三阶段QC：1）来料检验，2）过程抽样（每500kg），3）发货前检验。我们的缺陷率低于0.5%（行业平均：2-3%）。" },
    { question: "如何获取免费样品？", answer: "是的，每款产品提供5-10个免费样品供质量检验。样品在3个工作日内发货。津巴布韦、南非和肯尼亚的客户通常在7-14天内收到样品。" },
    { question: "如何追踪我的订单？", answer: "我们为所有通过DHL、FedEx或海运的货物提供追踪号码。您可以在线追踪您的订单，或通过WhatsApp联系您的专属销售经理获取生产和发货状态的实时更新。" },
    { question: "如何下定制OEM订单？", answer: "通过电子邮件或WhatsApp发送您的规格（尺寸、材料、涂层、包装）。我们的工程团队将在24小时内提供报价。批准后，我们创建样品（7-10天），并在样品确认后进行批量生产。" },
    { question: "如何处理质量争议？", answer: "我们提供100%质量保证政策。如果任何缺陷率超过1%，我们提供全额退款或更换。我们的争议解决时间通常为48小时，客户满意度保持在98%。" },
    
    // WHY questions
    { question: "为什么选择TradeGo作为紧固件供应商？", answer: "1）12年非洲专注经验，2）ISO 9001和SABS认证工厂，3）65%出口到非洲，物流优化，4）缺陷率0.5%对比行业平均2-3%，5）每月发运50+集装箱，6）500+客户遍布20+非洲国家。" },
    { question: "为什么你们的价格有竞争力？", answer: "我们是直接制造商，拥有3条生产线，消除了中间商。我们的工厂直销价格比贸易商节省15-30%。我们为同等产品提供价格匹配，10,000件起即可享受批量折扣。" },
    { question: "为什么非洲建筑公司选择TradeGo？", answer: "1）SABS认证符合非洲进口标准，2）优化的海运路线至德班、拉各斯、蒙巴萨（15-35天），3）专为热带气候条件设计的特殊包装，4）正确的紧固件选择技术支持，5）98%准时交货率。" },
    
    // WHERE questions
    { question: "你们的产品用在哪里？", answer: "我们的紧固件广泛用于：1）住宅和商业建筑，2）IBR和波纹屋顶安装，3）钢结构项目，4）太阳能板安装系统，5）暖通空调安装，6）木框架施工，7）室内装修和干墙隔断。" },
    { question: "你们从哪里发货？", answer: "我们从中国深圳港发货。主要运输路线：1）至德班（南非）：20-25天，2）至拉各斯（尼日利亚）：25-30天，3）至蒙巴萨（肯尼亚）：20-25天，4）至贝拉（莫桑比克）：15-20天。紧急样品可空运。" },
    { question: "在哪里可以查看你们的产品目录？", answer: "我们完整的产品目录可在我们的网站tradego-fasteners.com上查看。您可以按类别（螺丝、螺栓、钉子、锚栓）浏览产品，按规格筛选，并直接请求报价。实物样品可在3个工作日内发货。" },
    
    // WHEN questions
    { question: "什么时候可以交货？", answer: "标准订单（500-10,000件）：15-25天。大订单（10,000+件）：25-40天。紧急订单可加急生产（7-10天，加收15%加急费）。98%的订单准时发货。" },
    { question: "什么时候应该使用干墙螺丝而不是自钻螺丝？", answer: "干墙螺丝用于干墙与木材或干墙与金属龙骨连接（小于0.75毫米）。自钻TEK螺丝用于金属与金属连接（0.75-2.5毫米钢材）。对于大于2.5毫米的钢材，需要预钻孔。通过电子邮件或WhatsApp联系我们获取免费技术支持。" },
    { question: "你们是什么时候成立的？", answer: "TradeGo成立于2012年，专业从事紧固件制造和出口。从那时起，我们已发展成为领先的中国-非洲紧固件供应商之一，每月出口量超过50个集装箱，为20多个非洲国家的500多家客户提供服务。" },
    
    // WHO questions
    { question: "我应该联系谁获取报价？", answer: "通过以下方式联系我们的销售团队：电子邮件：info@tradego-fasteners.com | WhatsApp：+86 159 6340 9951。我们的团队在工作时间（周一至周五，中国标准时间上午9点至下午6点）2小时内回复查询。" },
    { question: "你们在非洲的主要客户是谁？", answer: "我们的非洲客户包括：1）五金分销商和零售商，2）建筑公司和承包商，3）屋顶专业人员和金属板工人，4）太阳能板安装商，5）制造工厂。主要市场：南非（35%）、肯尼亚（20%）、尼日利亚（15%）、津巴布韦（10%）、其他非洲国家（20%）。" },
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
