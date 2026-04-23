'use client'

import { useEffect } from 'react'

// Auto social sharing component
// Shares new content on social media when articles are published

interface AutoShareProps {
  title: string
  url: string
  locale: string
}

const translations: Record<string, string> = {
  en: 'Share on LinkedIn',
  zh: '分享到领英',
  es: 'Compartir en LinkedIn',
  fr: 'Partager sur LinkedIn',
  ar: 'مشاركة على لينكد إن',
  pt: 'Compartilhar no LinkedIn',
  ru: 'Поделиться в LinkedIn',
  ja: 'LinkedInでシェア',
  de: 'Auf LinkedIn teilen',
  hi: 'LinkedIn पर शेयर करें',
}

export default function AutoShare({ title, url, locale }: AutoShareProps) {
  useEffect(() => {
    // Only share on article pages
    if (!url.includes('/industry/')) return

    // LinkedIn sharing
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    
    // Store for later use or manual sharing
    if (typeof window !== 'undefined') {
      (window as any).tradeGoShareUrl = linkedInUrl
    }
  }, [title, url, locale])

  return null // Invisible component
}

// Manual share trigger function
export function triggerLinkedInShare(title: string, url: string) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedInUrl, '_blank', 'width=600,height=400')
}

export function triggerTwitterShare(title: string, url: string) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

export function triggerFacebookShare(url: string) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}
