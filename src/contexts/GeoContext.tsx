'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface GeoContextType {
  country: string
  lang: string
  currency: string
}

const GeoContext = createContext<GeoContextType>({
  country: 'default',
  lang: 'en',
  currency: 'USD',
})

export function useGeo() {
  return useContext(GeoContext)
}

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoContextType>({
    country: 'default',
    lang: 'en',
    currency: 'USD',
  })

  useEffect(() => {
    const country = document.cookie
      .split('; ')
      .find((r) => r.startsWith('geo-country='))
      ?.split('=')[1] || 'default'
    const currency = document.cookie
      .split('; ')
      .find((r) => r.startsWith('geo-currency='))
      ?.split('=')[1] || 'USD'
    const lang = document.cookie
      .split('; ')
      .find((r) => r.startsWith('geo-lang='))
      ?.split('=')[1] || 'en'
    setGeo({ country, lang, currency })
  }, [])

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>
}
