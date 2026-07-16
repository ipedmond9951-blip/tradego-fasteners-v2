import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "..",
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
        source: '/:locale(en|zh)/industry/south%20africa-fasteners-china-import-guide',
        destination: '/:locale/industry/south-africa-fasteners-china-import-guide',
        permanent: true,
      },
      // 2026-07-16 23:30 修复 404 URLs (GSC 43 个 "未找到")
      // 旧版: 8 langs 重定向到 /en, 导致 /fr/en, /es/en/, /hiundefined 等 BUG URL
      // 现在 10 langs 都 200 OK, 这些 BUG URL 自然消失
      // 但保留以下软 404 修复 (GSC "软 404" 27 个)
      // 注: trailingSlash: true 会先做 no-/→-/ 308, 所以 redirect 源要带 /
      {
        // /products/hex-nuts (没 /en/ 前缀) → /en/products/hex-nuts
        source: '/products/:slug/',
        destination: '/en/products/:slug/',
        permanent: true,
      },
      {
        // /en/quote/, /es/quote/, 等 → /en/contact/
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/quote/',
        destination: '/en/contact/',
        permanent: true,
      },
    ];
  },
  images: {
    // 2026-07-15 fix: Vercel Next.js image optimization 走 Pro plan (402 Payment Required)
    // 禁掉优化器, 所有 <Image> 自动用原始 /images/...jpg 路径, 跟 5 美元 VPS 哲学一致
    unoptimized: true,
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
