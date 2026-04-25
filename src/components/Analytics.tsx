'use client'

import { useEffect } from 'react'

// Google Analytics 4 component — GA4 tracking enabled
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel project settings (Production)
// Example: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6RE8PBNLC6

export default function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // Load GA4 script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    // Initialize GA4
    const inlineScript = document.createElement('script')
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
      });
    `
    document.head.appendChild(inlineScript)

    // Track page views on navigation
    const handleClick = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: window.location.pathname,
        })
      }
    }

    // Listen for navigation
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [GA_MEASUREMENT_ID])

  return null
}

// Type declaration for window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
