'use client'

import Script from 'next/script'

// Google Analytics 4 component — GA4 tracking enabled
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel project settings (Production)
// Example: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6RE8PBNLC6

// Standard Google GA4 implementation - gtag function defined before gtag.js loads
// gtag.js will find window.gtag already defined and use it

export default function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Prepare gtag function - Google expects this before gtag.js loads */}
      <Script id="gtag-prepare" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
        `}
      </Script>
      {/* Load gtag.js - will use existing window.gtag */}
      <Script
        id="gtag-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* Configure GA4 with page_path */}
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          window.gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
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
