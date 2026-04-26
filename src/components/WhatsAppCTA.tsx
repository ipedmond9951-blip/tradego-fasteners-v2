'use client'

import { useState, useEffect } from 'react'

interface WhatsAppCTAProps {
  locale: string
}

// WhatsApp number from TradeGo
const WHATSAPP_NUMBER = '8615963409951'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`

const translations: Record<string, {
  title: string
  subtitle: string
  button: string
  tooltip: string
}> = {
  en: {
    title: 'Chat with TradeGo',
    subtitle: 'Get instant quotes, product support, and personalized assistance on WhatsApp.',
    button: 'Message Us on WhatsApp',
    tooltip: 'Chat with us directly!'
  },
  zh: {
    title: '与 TradeGo 在线沟通',
    subtitle: '通过 WhatsApp 获取即时报价、产品支持和个性化服务。',
    button: 'WhatsApp 在线咨询',
    tooltip: '直接聊天咨询！'
  }
}

const otherLocales: Record<string, typeof translations.en> = {
  es: { title: 'Chatea con TradeGo', subtitle: 'Obtén cotizaciones instantáneas y soporte personalizado en WhatsApp.', button: 'Escríbenos en WhatsApp', tooltip: '¡Chatea con nosotros directamente!' },
  fr: { title: 'Discutez avec TradeGo', subtitle: 'Obtenez des devis instantanés et un support personnalisé sur WhatsApp.', button: 'Contactez-nous sur WhatsApp', tooltip: 'Discutez directement avec nous!' },
  ar: { title: 'تحدث مع TradeGo', subtitle: 'احصل على عروض أسعار فورية ودعم مخصص على WhatsApp.', button: 'راسلنا على WhatsApp', tooltip: 'تحدث معنا مباشرة!' },
  pt: { title: 'Converse com TradeGo', subtitle: 'Obtenha orçamentos instantâneos e suporte personalizado no WhatsApp.', button: 'Envie uma mensagem no WhatsApp', tooltip: 'Converse conosco diretamente!' },
  ru: { title: 'Чат с TradeGo', subtitle: 'Получите мгновенные предложения и персонализированную поддержку в WhatsApp.', button: 'Напишите в WhatsApp', tooltip: 'Общайтесь с нами напрямую!' },
  ja: { title: 'TradeGoとチャット', subtitle: 'WhatsAppで即座に見積もり，取得とサポートを受ける。', button: 'WhatsAppでメッセージ', tooltip: '今すぐチャット！' },
  de: { title: 'Chatten Sie mit TradeGo', subtitle: 'Erhalten Sie sofortige Angebote und personalisierte Unterstützung auf WhatsApp.', button: 'Nachricht auf WhatsApp', tooltip: 'Chatten Sie direkt mit uns!' },
  hi: { title: 'TradeGo के साथ चैट करें', subtitle: 'WhatsApp पर तुरंत कोटेशन और व्यक्तिगत सहायता प्राप्त करें।', button: 'WhatsApp पर संदेश भेजें', tooltip: 'हमसे सीधे चैट करें!' },
}

export default function WhatsAppCTA({ locale }: WhatsAppCTAProps) {
  const [isMinimized, setIsMinimized] = useState(true)
  
  const content = translations[locale] || translations.en

  // Pre-filled message based on locale
  const getPreFilledMessage = () => {
    const messages: Record<string, string> = {
      en: 'Hello TradeGo, I\'m interested in your fastener products. Can you provide a quote?',
      zh: '你好 TradeGo，我想咨询紧固件产品，请问可以提供报价吗？',
      es: 'Hola TradeGo, estoy interesado en sus productos de sujetadores. ¿Puede darme una cotización?',
      fr: 'Bonjour TradeGo, je suis intéressé par vos produits de fixation. Pouvez-vous me faire un devis?',
      ar: 'مرحبا TradeGo، أنا مهتم منتجات التثبيت الخاصة بك. هل يمكنك تقديم عرض أسعار؟',
      pt: 'Olá TradeGo, estou interessado nos seus produtos de fixadores. Pode me dar um orçamento?',
      ru: 'Привет TradeGo, меня интересуют ваши крепёжные изделия. Можете предоставить расценки?',
      ja: 'こんにちはTradeGo、ファスナー製品に興味があります。見積もりいただけますか？',
      de: 'Hallo TradeGo, ich interessiere mich für Ihre Befestigungsprodukte. Können Sie mir ein Angebot machen?',
      hi: 'नमस्ते TradeGo, मैं आपके फास्टनर उत्पादों में रुचि रखता हूं। क्या आप कोटेशन दे सकते हैं?',
    }
    return encodeURIComponent(messages[locale] || messages.en)
  }

  const whatsappLink = `${WHATSAPP_LINK}?text=${getPreFilledMessage()}`

  // Track WhatsApp click
  const trackWhatsAppClick = (source: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_whatsapp', {
        event_category: 'engagement',
        event_label: source,
        locale: locale,
      })
    }
  }

  // If minimized, show a small floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('floating_button')}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label={content.tooltip}
        >
          {/* WhatsApp Icon */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="font-semibold text-sm">{content.tooltip}</span>
        </a>
      </div>
    )
  }

  // Expanded view
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
        {/* Close/Minimize button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-2"
          aria-label="Minimize"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* WhatsApp Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{content.title}</h3>
            <p className="text-sm text-gray-600">{content.subtitle}</p>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('expanded_card')}
          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {content.button}
        </a>
      </div>
    </div>
  )
}
