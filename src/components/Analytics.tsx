'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics 4 component — Pure Direct Measurement Protocol Implementation
// This implementation:
// 1. Does NOT load gtag.js or gtm.js at all
// 2. Sends events directly to GA4 using Measurement Protocol
// 3. Completely bypasses GTM and any other Google scripts
//
// GA4 Measurement Protocol endpoint: https://www.google-analytics.com/g/collect
// Required: Measurement ID (NEXT_PUBLIC_GA_MEASUREMENT_ID)

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
  
  // Build URL with required parameters
  const baseUrl = 'https://www.google-analytics.com/g/collect'
  const params = new URLSearchParams({
    v: '1',
    tid: GA_MEASUREMENT_ID,
    cid: clientId,
    en: eventName,
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
    const sent = navigator.sendBeacon(url)
    console.log('[GA4] Event sent via sendBeacon:', eventName, 'sent:', sent)
  } else {
    console.log('[GA4] sendBeacon not available, using fetch')
    fetch(url, { method: 'POST', keepalive: true, mode: 'no-cors' })
  }
}

// Track page views
function trackPageView() {
  if (typeof window === 'undefined') return
  
  const pathname = window.location.pathname
  sendGA4Event('page_view', {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  })
}

// Prevent any Google scripts from loading
function blockGoogleScripts() {
  if (typeof window === 'undefined') return
  
  // Block gtm.js from loading
  const originalQuerySelector = document.querySelector.bind(document)
  
  // Intercept new script elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'SCRIPT') {
          const script = node as HTMLScriptElement
          const src = script.src || ''
          if (src.includes('googletagmanager.com') || src.includes('google-analytics.com')) {
            console.log('[GA4] Blocking script:', src)
            script.remove()
          }
        }
      })
    })
  })
  
  observer.observe(document.documentElement, { childList: true, subtree: true })
  console.log('[GA4] Google script blocker activated')
}

// Analytics component
export default function Analytics() {
  const pathname = usePathname()

  // Initialize on mount - block Google scripts and set up tracking
  useEffect(() => {
    // Block any Google scripts that might try to load
    blockGoogleScripts()
    
    // Track initial page view
    const timer = setTimeout(trackPageView, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Track page views on route changes
  useEffect(() => {
    const timer = setTimeout(trackPageView, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!GA_MEASUREMENT_ID) {
    console.log('[GA4] No Measurement ID configured')
    return null
  }

  console.log('[GA4] Analytics component mounted with ID:', GA_MEASUREMENT_ID)
  
  // Don't render anything - this is a silent tracker
  return null
}

// Expose for manual event tracking if needed
if (typeof window !== 'undefined') {
  (window as any).trackGA4Event = sendGA4Event
}

// Declare global types for gtag (for backward compatibility with other components)
declare global {
  interface Window {
    gtag: ((...args: any[]) => void) & { q?: any[] }
    dataLayer: any[]
  }
}
