'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface SEOStats {
  overview: {
    totalPageViews: number
    totalVisitors: number
    avgBounceRate: number
    avgSessionDuration: string
  }
  trafficSources: {
    name: string
    value: number
    color: string
  }[]
  pagesData: {
    page: string
    views: number
    visitors: number
    avgTime: string
    bounceRate: string
  }[]
  geoDistribution: {
    country: string
    countryCode: string
    visitors: number
    flag: string
  }[]
  searchPerformance: {
    impressions: number
    clicks: number
    ctr: number
    avgPosition: number
  }
  indexingStatus: {
    indexed: number
    submitted: number
    errors: number
  }
  topQueries: {
    query: string
    clicks: number
    impressions: number
    position: number
  }[]
  timestamp: string
  technicalSeo: {
    score: number
    issues: {
      critical: number
      warnings: number
      passed: number
    }
  }
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<SEOStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/seo-stats')
      .then((res) => res.json())
      .then((data: SEOStats) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load analytics data')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold">Error Loading Analytics</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const seoScoreColor = data.technicalSeo.score >= 80 ? 'text-green-600' : data.technicalSeo.score >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO & Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your website performance, search visibility, and geographic distribution</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: {new Date(data.timestamp).toLocaleString()}</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Page Views</div>
            <div className="text-3xl font-bold text-gray-900">{data.overview.totalPageViews.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">↑ 12.5% from last month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Unique Visitors</div>
            <div className="text-3xl font-bold text-gray-900">{data.overview.totalVisitors.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">↑ 8.3% from last month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Bounce Rate</div>
            <div className="text-3xl font-bold text-gray-900">{data.overview.avgBounceRate}%</div>
            <div className="text-sm text-green-600 mt-1">↓ 3.2% from last month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Avg. Session</div>
            <div className="text-3xl font-bold text-gray-900">{data.overview.avgSessionDuration}</div>
            <div className="text-sm text-green-600 mt-1">↑ 15s from last month</div>
          </div>
        </div>

        {/* Search Performance & Technical SEO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Search Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Performance (Google)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.searchPerformance.impressions.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Impressions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.searchPerformance.clicks.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Clicks</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.searchPerformance.ctr}%</div>
                <div className="text-sm text-gray-600">CTR</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.searchPerformance.avgPosition}</div>
                <div className="text-sm text-gray-600">Avg. Position</div>
              </div>
            </div>
          </div>

          {/* Technical SEO Score */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical SEO Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className={`text-6xl font-bold ${seoScoreColor}`}>{data.technicalSeo.score}</div>
              <div className="text-2xl text-gray-400 ml-2">/100</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.technicalSeo.issues.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{data.technicalSeo.issues.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.technicalSeo.issues.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Traffic Sources</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {data.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Geographic Distribution (Top Markets)</h2>
            <div className="space-y-3">
              {data.geoDistribution.map((item, index) => (
                <div key={item.countryCode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">{item.country}</div>
                      <div className="text-sm text-gray-500">{item.countryCode}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.visitors.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">visitors</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages & Top Queries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Pages</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Page</th>
                    <th className="pb-3 font-medium text-right">Views</th>
                    <th className="pb-3 font-medium text-right">Visitors</th>
                    <th className="pb-3 font-medium text-right">Avg Time</th>
                    <th className="pb-3 font-medium text-right">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pagesData.map((page, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{page.page}</td>
                      <td className="py-3 text-gray-600 text-right">{page.views.toLocaleString()}</td>
                      <td className="py-3 text-gray-600 text-right">{page.visitors.toLocaleString()}</td>
                      <td className="py-3 text-gray-600 text-right">{page.avgTime}</td>
                      <td className="py-3 text-gray-600 text-right">{page.bounceRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Search Queries */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Search Queries</h2>
            <div className="space-y-3">
              {data.topQueries.map((query, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">{query.query}</div>
                    <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">#{index + 1}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Clicks:</span>
                      <span className="ml-1 font-medium text-gray-700">{query.clicks}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Impr:</span>
                      <span className="ml-1 font-medium text-gray-700">{query.impressions}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Pos:</span>
                      <span className="ml-1 font-medium text-gray-700">{query.position}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indexing Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Google Indexing Status</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{data.indexingStatus.indexed}</div>
              <div className="text-sm text-gray-600">Indexed Pages</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{data.indexingStatus.submitted}</div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{data.indexingStatus.errors}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">🔗 Connect Real Data Sources</h2>
          <p className="text-blue-800 mb-4">
            To get real SEO and analytics data, integrate with:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition">
              <div className="font-semibold text-gray-900 mb-1">Google Analytics 4</div>
              <div className="text-sm text-gray-600">Track visitors, behavior, conversions</div>
            </a>
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition">
              <div className="font-semibold text-gray-900 mb-1">Google Search Console</div>
              <div className="text-sm text-gray-600">Monitor indexing, rankings, clicks</div>
            </a>
            <a href="https://developers.google.com/webmaster-tools/search_volume_data" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition">
              <div className="font-semibold text-gray-900 mb-1">SEO APIs</div>
              <div className="text-sm text-gray-600">Ahrefs, SEMrush, Moz integration</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
