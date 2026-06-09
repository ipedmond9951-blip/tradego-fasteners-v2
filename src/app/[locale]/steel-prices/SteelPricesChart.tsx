'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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

interface SteelPricesMessages {
  title: string
  subtitle: string
  priceTrends: string
  trendsDesc: string
  detailedList: string
  dataSources: string
  dataSourcesDesc: string
  lme: string
  lmeDesc: string
  shfe: string
  shfeDesc: string
  lmeSteel: string
  lmeSteelDesc: string
  note: string
  hrc: string
  crc: string
  rebar: string
  lastUpdated: string
  error: string
  loadFailed: string
  localMarket: string
}

interface Props {
  locale: string
  messages: SteelPricesMessages
}

export default function SteelPricesChart({ locale, messages: m }: Props) {
  const [data, setData] = useState<CommodityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/steel-prices')
      .then((res) => res.json())
      .then((data: CommodityData) => {
        setData(data)
        setLoading(false)
      })
      .catch(() => {
        setError(m.loadFailed)
        setLoading(false)
      })
  }, [m.loadFailed])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h2 className="text-red-800 font-semibold">{m.error}</h2>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Last updated */}
      <p className="text-sm text-gray-500 mb-4">
        {m.lastUpdated}: {new Date(data.timestamp).toLocaleString(locale)}
      </p>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.steel.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">{item.symbol}</span>
              <span
                className={`text-sm font-medium ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${item.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-2">{item.name}</div>
            <div className="text-xs text-gray-400">{item.unit}</div>
          </div>
        ))}
      </div>

      {/* Price Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{m.priceTrends}</h2>
        <p className="text-gray-600 mb-6">{m.trendsDesc}</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { day: 'Day 1', hrc: 670, crc: 780, rebar: 570 },
                { day: 'Day 5', hrc: 675, crc: 785, rebar: 565 },
                { day: 'Day 10', hrc: 680, crc: 790, rebar: 560 },
                { day: 'Day 15', hrc: 678, crc: 788, rebar: 558 },
                { day: 'Day 20', hrc: 682, crc: 792, rebar: 562 },
                { day: 'Day 25', hrc: 685, crc: 795, rebar: 562 },
                { day: 'Today', hrc: data.steel[0].price, crc: data.steel[1].price, rebar: data.steel[2].price },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hrc" stroke="#3b82f6" strokeWidth={2} name={m.hrc} />
              <Line type="monotone" dataKey="crc" stroke="#22c55e" strokeWidth={2} name={m.crc} />
              <Line type="monotone" dataKey="rebar" stroke="#f59e0b" strokeWidth={2} name={m.rebar} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{m.detailedList}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-right">Change</th>
                <th className="pb-3 font-medium text-right">Change %</th>
                <th className="pb-3 font-medium text-right">Unit</th>
              </tr>
            </thead>
            <tbody>
              {data.steel.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 text-gray-900 font-medium">{item.name}</td>
                  <td className="py-4 text-gray-500">{item.symbol}</td>
                  <td className="py-4 text-gray-900 text-right font-semibold">
                    ${item.price.toLocaleString()}
                  </td>
                  <td
                    className={`py-4 text-right ${
                      item.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.change >= 0 ? '+' : ''}{item.change}
                  </td>
                  <td
                    className={`py-4 text-right ${
                      item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                  </td>
                  <td className="py-4 text-gray-500 text-right">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">📊 {m.dataSources}</h2>
        <p className="text-blue-800 mb-4">{m.dataSourcesDesc}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="font-semibold text-gray-900 mb-1">{m.lme}</div>
            <div className="text-sm text-gray-600">{m.lmeDesc}</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="font-semibold text-gray-900 mb-1">{m.shfe}</div>
            <div className="text-sm text-gray-600">{m.shfeDesc}</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="font-semibold text-gray-900 mb-1">{m.lmeSteel}</div>
            <div className="text-sm text-gray-600">{m.lmeSteelDesc}</div>
          </div>
        </div>
        <p className="text-sm text-blue-700 mt-4">{m.note}</p>
      </div>
    </div>
  )
}
