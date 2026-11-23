import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "..",
  },
  experimental: {
    // Vercel 构建机自报 2 核，Next 于是只用 1 个 worker 生成 2784 个静态页（6.9 分钟）。
    // 强制多开 worker，页面生成是 IO/JSON 解析为主，超配也能明显加速。
    cpus: 4,
  },
  trailingSlash: true,
  // Edge redirects — handled at Vercel edge (~50ms) instead of server-side (~200ms)
  // PageSpeed Insights flagged redirect chain (/) → (/en) costing ~200ms.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true, // 308
      },
      // 2026-07-16 23:30 修复 GSC 索引问题: 移除 8 语言 301 重定向
      // 原 5b0badf 把 8 语言重定向到 /en, 造成 GSC 1,485 重定向 + 366 重复
      // 正确做法: 保留 10 语言 URL, 加完整 hreflang 让 Google 识别
      // (旧的 8-lang redirect rule 已删, 下次 build 自动生效)
      // 2026-06-19: 修复文件名 bug - 旧 slug 含空格, 用 %20 URL 访问需重定向到正确 slug
      // Vercel router URL-decodes %20 BEFORE matching redirect source
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/south%20africa-fasteners-china-import-guide/',
        destination: '/:locale/industry/south-africa-fasteners-china-import-guide/',
        permanent: true,
      },
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/south%20africa-fasteners-china-import-guide',
        destination: '/:locale/industry/south-africa-fasteners-china-import-guide/',
        permanent: true,
      },
      // 2026-07-16 23:30 修复 404 URLs (GSC 43 个 "未找到")
      // 旧版: 8 langs 重定向到 /en, 导致 /fr/en, /es/en/, /hiundefined 等 BUG URL
      // 现在 10 langs 都 200 OK, 这些 BUG URL 自然消失
      // 但保留以下软 404 修复 (GSC "软 404" 27 个)
      // 注: trailingSlash: true 会先做 no-/→-/ 308, 所以 redirect 源要带 /
      {
        // /products/hex-nuts (没 /en/ 前缀的 BUG URL) → /en/products/ (产品列表)
        // 原目标 /en/products/hex-nuts 不存在, 改为产品列表页
        source: '/products/:slug/',
        destination: '/en/products/',
        permanent: true,
      },
      {
        // /en/quote/, /es/quote/, 等 → /en/contact/
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/quote/',
        destination: '/en/contact/',
        permanent: true,
      },
      // 2026-11-23: 同日两次管道重跑导致尼日利亚港口题材重复，合并到内容更完整的一篇
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/nigeria-port-upgrades-raise-fastener-procurement-risks/',
        destination: '/:locale/industry/nigeria-port-upgrades-and-fastener-import-lead-times/',
        permanent: true,
      },
      // 2026-11-22: 旧产品 slug 已改名但旧 URL 仍在被访问/索引
      // 旧 URL 返回 200 + "Product Not Found"（软 404），既无内链也伤索引
      // 统一 301 到当前 slug
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/products/ibr-roofing-nails/',
        destination: '/:locale/products/ibr-nails/',
        permanent: true,
      },
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/products/flat-washers/',
        destination: '/:locale/products/washers/',
        permanent: true,
      },
      // 2026-11-23 索引治理: 处理 GSC「未找到 (404)」85 条中的可修复模式
      // 1) 重复语种前缀: /es/en/contact/ → /es/contact/（旧 8 语言重定向时代的 BUG 链接）
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/en/:path*',
        destination: '/:locale/:path*/',
        permanent: true,
      },
      // 2) BUG URL /ruundefined/ /esundefined 等 → 对应语言首页
      ...['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi'].map((l) => ({
        source: `/${l}undefined`,
        destination: `/${l}/`,
        permanent: true,
      })),
      // 3) 旧目录 /articles/<slug>/ → 现文章路径
      {
        source: '/articles/:slug*',
        destination: '/en/industry/:slug*/',
        permanent: true,
      },
      // 4) 旧扁平文章路径（无 /industry/ 前缀或已改名）→ 现文章，根级和带语种两种写法都收
      ...[
        ['china-fasteners-zimbabwe-procurement-guide', 'china-fasteners-zimbabwe-procurement-guide'],
        ['anchor-bolts-foundation-guide', 'anchor-bolts-foundation-guide'],
        ['africa-fastener-market-opportunities-2026', 'africa-fastener-market-opportunities-2026'],
        ['southern-africa-fastener-market-southafrica-botswana', 'southern-africa-fastener-market-southafrica-botswana'],
        ['southern-africa-fastener-market', 'southern-africa-fastener-market-southafrica-botswana'],
        ['high-tensile-bolts-grade-8-8-10-9', 'high-tensile-bolts-grade-guide'],
        ['high-tensile-bolts', 'high-tensile-bolts-grade-guide'],
        ['structural-bolts', 'high-tensile-structural-bolts-guide'],
        ['concrete-anchors', 'concrete-anchors-selection-guide'],
        ['durban-port-import-procedures', 'south-africa-fasteners-china-import-guide'],
        ['quality-control-fasteners', 'fastener-quality-control-inspection-procedures'],
        ['sabs-standards-fasteners', 'south-africa-sabs-fastener-import-requirements'],
        ['water-infrastructure-fasteners', 'agrifastener-water-infrastructure'],
        ['china-fastener-export-guide', 'fastener-export-china-to-africa-guide'],
        ['afcfta-trade-benefits', 'african-ftz-fastener-import-procedures'],
        // 2026-11-23 GA4「Article Not Found」177 次 / GSC 404 复核后补的映射
        ['anchor-bolt-selection-guide', 'anchor-bolts-selection-guide'],
        ['drywall-screws-selection-guide', 'drywall-screws-complete-guide'],
        ['drc-copper-belt-fastener-market', 'dr-congo-drc-mining-fastener-market'],
        ['zimbabwe-mining-sector-fastener-guide', 'zimbabwe-mining-fastener-grade-selection'],
        ['china-fastener-manufacturer-guide', 'china-iso-9001-fastener-manufacturer-directory'],
        ['africa-port-logistics-fastener-export', 'fastener-export-china-to-africa-guide'],
        ['zim-construction-industry-overview', 'zimbabwe-construction-fastener-market'],
        ['zimbabwe-fastener-import', 'zimbabwe-import-duty-fastener-tariff-2026'],
        ['zimbabwe-construction-fastener-guide', 'zimbabwe-construction-fastener-market'],
        ['africa-construction-infrastructure-fastener-demand', 'africa-fastener-market-opportunities-2026'],
        ['afcfta-landed-cost-guide', 'african-ftz-fastener-import-procedures'],
      ].flatMap(([from, to]) => [
        { source: `/${from}/`, destination: `/en/industry/${to}/`, permanent: true },
        {
          // 2026-11-23 修复：GSC 里的旧链接都是 /<locale>/industry/<old-slug>/，
          // 早先生成时漏了 industry/ 段，导致 10 语种版本的 404 一直没被修掉。
          source: `/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/${from}/`,
          destination: `/:locale/industry/${to}/`,
          permanent: true,
        },
      ]),
    ];
  },
  // 静态资源长缓存：优化衍生图与字体内容不变，可 immutable
  async headers() {
    return [
      {
        source: '/images/opt/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
    ];
  },
  images: {
    // 2026-07-15 fix: Vercel Next.js image optimization 走 Pro plan (402 Payment Required)
    // 禁掉优化器, 所有 <Image> 自动用原始 /images/...jpg 路径, 跟 5 美元 VPS 哲学一致
    unoptimized: true,
    qualities: [75, 80],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-insights.com',
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
