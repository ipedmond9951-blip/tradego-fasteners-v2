// 2026-11-24 额度治理: 原来每次请求都跑一次函数重新拼 XML, 且 lastmod 用请求时刻。
// 内容是一份写死的单条 sitemap 索引, 没有任何动态成分 —— 改为构建期静态生成, 由 CDN 直接返回。
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = false

const sitemapXml = 'https://www.tradego-fasteners.com/sitemap.xml'
// 构建时刻固定, 不再每次请求变化
const lastmod = new Date().toISOString()

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapXml}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`

export async function GET() {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
