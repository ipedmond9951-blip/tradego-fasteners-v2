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
