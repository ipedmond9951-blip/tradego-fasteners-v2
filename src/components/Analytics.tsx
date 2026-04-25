'use client'

import Script from 'next/script'

// Google Analytics 4 component — GA4 tracking enabled
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel project settings (Production)
// Example: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6RE8PBNLC6

export default function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Load GA4 script with beforeInteractive strategy */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          // Initialize dataLayer if not exists
          window.dataLayer = window.dataLayer || []
          
          // Initialize GA4 - call window.gtag directly (provided by gtag.js)
          // @ts-ignore - gtag is added by the gtag.js script
          window.gtag('js', new Date())
          // @ts-ignore
          window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: window.location.pathname,
          })
        }}
      />
    </>
  )
}

// Type declaration for window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
