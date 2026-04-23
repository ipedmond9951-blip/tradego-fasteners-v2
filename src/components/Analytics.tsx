'use client'

import { useEffect } from 'react'

interface AnalyticsProps {
  GA_MEASUREMENT_ID?: string
}

// Google Analytics 4 component
// To enable analytics, set your GA_MEASUREMENT_ID in environment variables
// NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

export default function Analytics({ GA_MEASUREMENT_ID }: AnalyticsProps) {
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
