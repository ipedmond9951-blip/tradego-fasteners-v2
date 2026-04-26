'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics 4 component — Direct Measurement Protocol Implementation
// This implementation bypasses gtag.js and sends events directly to GA4
// to work around GTM interference issues.
//
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel project settings (Production)
//
// GA4 Measurement Protocol endpoint: https://www.google-analytics.com/g/collect
// Required parameters: v=1, tid=MEASUREMENT_ID, cid=CLIENT_ID, en=EVENT_NAME

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Generate a unique client ID for this browser session
function getClientId(): string {
  if (typeof window === 'undefined') return ''
  
  let clientId = localStorage.getItem('_ga_client_id')
  if (!clientId) {
    clientId = 'GA1.1.' + Date.now() + '.' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('_ga_client_id', clientId)
  }
  return clientId
}

// Send event to GA4 using Measurement Protocol
function sendGA4Event(eventName: string, eventParams: Record<string, any> = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  
  const clientId = getClientId()
  
  // Build the URL with required parameters
  const baseUrl = 'https://www.google-analytics.com/g/collect'
  const params = new URLSearchParams({
    v: '1',
    tid: GA_MEASUREMENT_ID,
    cid: clientId,
    en: eventName,
    ul: navigator.language || 'en-us',
    dl: window.location.href,
    dt: document.title,
    dr: document.referrer,
  })
  
  // Add event parameters
  Object.entries(eventParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(`ep.${key}`, String(value))
    }
  })
  
  const url = `${baseUrl}?${params.toString()}`
  
  // Use sendBeacon for reliable delivery
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url)
  } else {
    // Fallback to fetch
    fetch(url, { method: 'POST', keepalive: true, mode: 'no-cors' })
  }
}

// Track page views
function trackPageView() {
  const pathname = window.location.pathname
  sendGA4Event('page_view', {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  })
}

// Analytics component
export default function Analytics() {
  const pathname = usePathname()

  // Track page views on route changes
  useEffect(() => {
    // Small delay to ensure page is fully loaded
    const timer = setTimeout(trackPageView, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  // Track page view on initial load
  useEffect(() => {
    const timer = setTimeout(trackPageView, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Load gtag.js as a fallback but it won't interfere with our direct implementation */}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          // gtag.js loaded, but we're using direct Measurement Protocol
          // This ensures gtag is available for any legacy code that might use it
          if (typeof window.gtag === 'function') {
            window.gtag('config', GA_MEASUREMENT_ID, {
              send_page_view: false, // We handle page views ourselves
            })
          }
        }}
      />
    </>
  )
}

// Declare global types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
