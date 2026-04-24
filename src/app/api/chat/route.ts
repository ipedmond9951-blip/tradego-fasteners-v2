import { NextRequest, NextResponse } from 'next/server';

// Simple knowledge base for chat responses
const knowledgeBase: Record<string, string[]> = {
  products: ['product', 'products', 'screw', 'screws', 'bolt', 'bolts', 'nut', 'nuts', 'fastener', 'fasteners', 'drywall', 'ibr', 'nail'],
  moq: ['moq', 'minimum', 'order', 'quantity'],
  shipping: ['shipping', 'delivery', 'ship', 'deliver', 'time', 'days'],
  contact: ['contact', 'email', 'phone', 'whatsapp', 'reach'],
  company: ['company', 'about', 'who', 'trade', 'go'],
  price: ['price', 'cost', 'quote', 'pricing', 'cheap', 'expensive'],
  certification: ['certified', 'certification', 'iso', 'quality', 'sgs'],
};

const responses: Record<string, Record<string, string>> = {
  products: {
    en: 'We manufacture drywall screws, self-drilling screws, bolts, nuts, and IBR nails. All products are ISO 9001 certified. Would you like a quote for a specific product?',
    zh: '我们生产干壁钉、自钻螺丝、螺栓、螺母和IBR钉。所有产品均通过ISO 9001认证。您需要哪种产品的报价？',
  },
  moq: {
    en: 'Our minimum order quantity varies by product. For standard items, MOQ is typically 100kg or 10,000 pieces. Custom orders may require higher MOQ. What products are you interested in?',
    zh: '我们的最小起订量因产品而异。标准产品通常为100公斤或10,000件起订。定制订单可能需要更高起订量。您对哪些产品感兴趣？',
  },
  shipping: {
    en: 'We specialize in shipping to 20+ African countries plus global destinations. Sea freight to Africa: Durban 25-30 days, Lagos 30-35 days, Mombasa 28-32 days. Air freight available. Where are you located?',
    zh: '我们专注向20多个非洲国家及全球目的地发货。海运至非洲：德班25-30天，拉各斯30-35天，蒙巴萨28-32天。支持空运。您在哪个国家？',
  },
  contact: {
    en: 'You can reach us at:\n📧 aimingtrade@hotmail.com\n📞 +86-135-6265-9951 / +86-159-6340-9951\n💬 WhatsApp: +86-159-6340-9951\nWe respond within 24 hours!',
    zh: '联系方式：\n📧 aimingtrade@hotmail.com\n📞 +86-135-6265-9951 / +86-159-6340-9951\n💬 WhatsApp: +86-159-6340-9951\n我们会在24小时内回复！',
  },
  company: {
    en: 'TradeGo Fasteners has 12+ years of Africa-focused experience. We\'re SABS & ISO 9001:2015 certified and SGS tested. Based in Weifang, China, serving 20+ African countries with sea freight to Durban, Lagos, Mombasa.',
    zh: 'TradeGo Fasteners拥有12年非洲专注经验。通过SABS和ISO 9001:2015认证及SGS检测。位于中国潍坊，海运至德班、拉各斯、蒙巴萨等服务20多个非洲国家。',
  },
  price: {
    en: 'Our prices are competitive for wholesale quantities. Prices vary by material, coating, and order size. Please tell us what products and quantities you need for an accurate quote.',
    zh: '我们的批发价格具有竞争力。价格因材质、涂层和订单量而异。请告诉我们您需要的产品和数量，以便提供准确报价。',
  },
  certification: {
    en: 'We are ISO 9001:2015 certified and products are SGS tested. We comply with DIN, ANSI, JIS, and GB standards.',
    zh: '我们通过ISO 9001:2015认证，产品经过SGS检测。符合DIN、ANSI、JIS和GB标准。',
  },
};

function findResponse(message: string, locale: string): string | null {
  const lowerMsg = message.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(knowledgeBase)) {
    if (keywords.some(kw => lowerMsg.includes(kw))) {
      return responses[topic]?.[locale] || responses[topic]?.en || null;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, locale = 'en' } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Find matching response
    const response = findResponse(message, locale);
    
    if (response) {
      return NextResponse.json({ response });
    }

    // Default fallback
    const fallback = locale === 'zh'
      ? '感谢您的咨询！请留下您的联系方式，我们的销售团队会尽快联系您。您也可以直接发邮件至 aimingtrade@hotmail.com 或 WhatsApp: +86-159-6340-9951'
      : 'Thanks for your inquiry! Please leave your contact info and our sales team will reach out shortly. You can also email us at aimingtrade@hotmail.com or WhatsApp: +86-159-6340-9951';

    return NextResponse.json({ response: fallback });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
