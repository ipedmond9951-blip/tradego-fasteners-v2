'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics 4 - Direct Measurement Protocol Implementation
// This is a simplified approach that sends events directly to GA4
// without relying on gtag.js or GTM

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function getClientId(): string {
  if (typeof window === 'undefined') return ''
  let clientId = localStorage.getItem('_ga_client_id')
  if (!clientId) {
    clientId = 'GA1.1.' + Date.now() + '.' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('_ga_client_id', clientId)
  }
  return clientId
}

function sendGA4Event(eventName: string, params: Record<string, any> = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  
  const clientId = getClientId()
  
  const searchParams = new URLSearchParams({
    v: '1',
    tid: GA_MEASUREMENT_ID,
    cid: clientId,
    en: eventName,
    ul: navigator.language || 'en-US',
    dl: window.location.href,
    dt: document.title || '',
    dr: document.referrer || '',
  })
  
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      searchParams.append(`ep.${k}`, String(v))
    }
  })
  
  const url = `https://www.google-analytics.com/g/collect?${searchParams.toString()}`
  
  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url)
    console.log('[GA4] Event sent:', eventName, Object.keys(params))
  } else {
    // Fallback to fetch
    fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true })
      .catch(err => console.error('[GA4] Send error:', err))
  }
}

// Track page views
function trackPageView(path: string) {
  sendGA4Event('page_view', {
    page_path: path,
  })
}

// Track custom events
export function trackGA4Event(eventName: string, params: Record<string, any> = {}) {
  sendGA4Event(eventName, params)
}

export default function Analytics() {
  const pathname = usePathname()
  const initialized = useRef(false)
  
  // Initial page view
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const timer = setTimeout(() => {
        trackPageView(pathname)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])
  
  // Track route changes
  useEffect(() => {
    if (initialized.current && pathname) {
      const timer = setTimeout(() => {
        trackPageView(pathname)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname])
  
  return null // Silent tracker - no UI
}

// Global type declaration for components that reference window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}
