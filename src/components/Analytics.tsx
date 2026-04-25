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
      {/* Load GA4 script */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* Initialize GA4 */}
      <Script strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
