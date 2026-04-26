'use client'

import Script from 'next/script'

// Google Analytics 4 component — GA4 tracking enabled
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel project settings (Production)
// Example: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6RE8PBNLC6

// Google-recommended GA4 implementation:
// 1. Load gtag.js asynchronously
// 2. gtag.js auto-sets up window.gtag and window.dataLayer
// 3. We call gtag('config') after gtag.js loads

export default function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Load gtag.js - Google auto-sets up window.gtag and window.dataLayer */}
      <Script
        id="gtag-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          // After gtag.js loads, configure with page_path
          window.gtag('config', GA_MEASUREMENT_ID!, {
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
