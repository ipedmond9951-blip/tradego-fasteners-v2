import { NextResponse } from 'next/server'

// Steel and commodity prices from free sources
// Using demo data that simulates realistic market prices
// In production, integrate with LME, Shanghai Futures, or commodity APIs

interface SteelPrice {
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
  unit: string
  updated: string
}

interface CommodityData {
  steel: SteelPrice[]
  timestamp: string
}

export async function GET() {
  // Simulated steel and commodity prices
  // Real data would come from LME, Shanghai Futures, etc.
  const steelData: CommodityData = {
    steel: [
      {
        name: 'Hot Rolled Coil (HRC)',
        symbol: 'HRC',
        price: 685.50,
        change: 12.30,
        changePercent: 1.83,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Cold Rolled Coil (CRC)',
        symbol: 'CRC',
        price: 795.00,
        change: 8.75,
        changePercent: 1.11,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Rebar (Construction)',
        symbol: 'REBAR',
        price: 562.30,
        change: -5.20,
        changePercent: -0.92,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Galvanized Coil',
        symbol: 'GI',
        price: 825.00,
        change: 15.40,
        changePercent: 1.90,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Steel Scrap',
        symbol: 'HMS1/2',
        price: 385.00,
        change: 3.50,
        changePercent: 0.92,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Iron Ore (62% Fe)',
        symbol: 'FE62',
        price: 118.50,
        change: -1.25,
        changePercent: -1.04,
        unit: 'USD/dry metric ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Coking Coal',
        symbol: 'COKING',
        price: 215.80,
        change: 4.30,
        changePercent: 2.03,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
      {
        name: 'Nickel',
        symbol: 'NI',
        price: 16245.00,
        change: 125.50,
        changePercent: 0.78,
        unit: 'USD/ton',
        updated: new Date().toISOString(),
      },
    ],
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(steelData, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
