'use client'

import { useState, useEffect } from 'react'

interface EmailSubscribeProps {
  locale: string
}

const translations: Record<string, {
  title: string
  subtitle: string
  placeholder: string
  button: string
  privacy: string
  success: string
  error: string
  loading: string
}> = {
  en: {
    title: 'Stay Updated with TradeGo',
    subtitle: 'Get the latest fastener industry insights, price updates, and exclusive offers delivered to your inbox.',
    placeholder: 'Enter your email address',
    button: 'Subscribe',
    privacy: 'We respect your privacy. Unsubscribe anytime.',
    success: 'Thank you for subscribing!',
    error: 'Please enter a valid email address.',
    loading: 'Subscribing...'
  },
  zh: {
    title: '订阅 TradeGo 最新资讯',
    subtitle: '获取最新紧固件行业洞察、价格更新和独家优惠，直接发送到您的邮箱。',
    placeholder: '输入您的邮箱地址',
    button: '订阅',
    privacy: '我们尊重您的隐私，可随时取消订阅。',
    success: '感谢您的订阅！',
    error: '请输入有效的邮箱地址。',
    loading: '订阅中...'
  }
}

const otherLocales: Record<string, typeof translations.en> = {
  es: { title: 'Mantente Actualizado con TradeGo', subtitle: 'Recibe las últimas novedades del sector de sujetadores, actualizaciones de precios y ofertas exclusivas.', placeholder: 'Ingresa tu correo electrónico', button: 'Suscribirse', privacy: 'Respetamos tu privacidad. Cancela cuando quieras.', success: '¡Gracias por suscribirte!', error: 'Por favor ingresa un correo válido.', loading: 'Suscribiendo...' },
  fr: { title: 'Restez Informé avec TradeGo', subtitle: 'Recevez les dernières actualités du secteur de la visserie, les mises à jour de prix et les offres exclusives.', placeholder: 'Entrez votre adresse email', button: "S'abonner", privacy: 'Nous respectons votre vie privée. Désabonnez-vous à tout moment.', success: 'Merci de votre inscription!', error: 'Veuillez entrer un email valide.', loading: 'Inscription...' },
  ar: { title: 'تابع آخر الأخبار مع TradeGo', subtitle: 'احصل على آخر رؤى صناعة مثبتات التثبيت وتحديثات الأسعار والعروض الحصرية.', placeholder: 'أدخل بريدك الإلكتروني', button: 'اشترك', privacy: 'نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.', success: 'شكرا لاشتراكك!', error: 'الرجاء إدخال بريد إلكتروني صالح.', loading: 'جاري الاشتراك...' },
  pt: { title: 'Fique Atualizado com TradeGo', subtitle: 'Receba as últimas novidades do setor de fixadores, atualizações de preços e ofertas exclusivas.', placeholder: 'Digite seu endereço de email', button: 'Inscrever-se', privacy: 'Respeitamos sua privacidade. Cancele a qualquer momento.', success: 'Obrigado por se inscrever!', error: 'Por favor, insira um email válido.', loading: 'Inscrevendo...' },
  ru: { title: 'Оставайтесь в курсе с TradeGo', subtitle: 'Получайте последние новости отрасли крепежа, обновления цен и эксклюзивные предложения.', placeholder: 'Введите ваш email', button: 'Подписаться', privacy: 'Мы уважаем вашу конфиденциальность. Отпишитесь в любое время.', success: 'Спасибо за подписку!', error: 'Пожалуйста, введите корректный email.', loading: 'Подписка...' },
  ja: { title: 'TradeGoで最新情報を入手', subtitle: '最新のファスナー業界の洞察、価格更新、限定オファーを受け取る。', placeholder: 'メールアドレスを入力', button: '購読', privacy: '私たちはあなたのプライバシーを尊重します。いつでも購読を解除できます。', success: '購読셔서ありがとうございます！', error: '有効なメールアドレスを入力してください。', loading: '購読中...' },
  de: { title: 'Bleiben Sie informiert mit TradeGo', subtitle: 'Erhalten Sie die neuesten Einblicke in die Befestigungsindustrie, Preisaktualisierungen und exklusive Angebote.', placeholder: 'Geben Sie Ihre E-Mail-Adresse ein', button: 'Abonnieren', privacy: 'Wir respektieren Ihre Privatsphäre. Jederzeit abmelden.', success: 'Vielen Dank für Ihre Anmeldung!', error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', loading: 'Anmeldung...' },
  hi: { title: 'TradeGo के साथ अपडेट रहें', subtitle: 'नवीनतम फास्टनर उद्योग अंतर्दृष्टि, मूल्य अपडेट और विशेष ऑफर प्राप्त करें।', placeholder: 'अपना ईमेल पता दर्ज करें', button: 'सदस्यता लें', privacy: 'हम आपकी गोपनीयता का सम्मान करते हैं। कभी भी सदस्यता रद्द करें।', success: 'सदस्यता के लिए धन्यवाद!', error: 'कृपया एक वैध ईमेल पता दर्ज करें।', loading: 'सदस्यता ली जा रही है...' },
}

export default function EmailSubscribe({ locale }: EmailSubscribeProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isVisible, setIsVisible] = useState(false)
  
  const content = translations[locale] || translations.en

  useEffect(() => {
    // Show popup after 5 seconds or when user scrolls 50%
    const timer = setTimeout(() => setIsVisible(true), 5000)
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      if (scrollHeight > 0 && scrollTop / scrollHeight > 0.5) {
        setIsVisible(true)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      return
    }
    
    setStatus('loading')
    
    // Simulate API call - in production, integrate with Mailchimp/ConvertKit
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setEmail('')
      // Hide after 3 seconds
      setTimeout(() => setIsVisible(false), 3000)
    } catch {
      setStatus('error')
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-2"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content.success}</h3>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{content.subtitle}</p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content.placeholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    status === 'error' ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  disabled={status === 'loading'}
                />
                {status === 'error' && (
                  <p className="text-red-500 text-xs mt-1">{content.error}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? content.loading : content.button}
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-3 text-center">{content.privacy}</p>
          </>
        )}
      </div>
    </div>
  )
}
