'use client'

import Script from 'next/script'

// Google Analytics 4 component — GA4 tracking enabled
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel project settings (Production)
// Example: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6RE8PBNLC6
//
// Key insight: gtag.js uses 'async' attribute, so it doesn't block rendering.
// The gtag function must be defined BEFORE gtag.js loads.
// We use beforeInteractive to ensure our gtag function is ready first.

export default function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Step 1: CRITICAL - Define gtag function BEFORE gtag.js loads */}
      {/* This MUST be beforeInteractive to ensure it runs before gtag.js */}
      <Script id="gtag-prepare" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
      `}</Script>

      {/* Step 2: Load gtag.js - finds window.gtag already defined */}
      {/* Using afterInteractive to ensure page is interactive first */}
      <Script
        id="gtag-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          // Verify gtag is available after gtag.js loads
          if (typeof window.gtag === 'function') {
            window.gtag('config', GA_MEASUREMENT_ID!, {
              page_path: window.location.pathname,
            });
          }
        }}
        onError={() => {
          console.error('GA4: gtag.js failed to load');
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
