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
      // 2026-06-19: 修复文件名 bug - 旧 slug 含空格, 用 %20 URL 访问需重定向到正确 slug
      // Vercel router URL-decodes %20 BEFORE matching redirect source
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/south%20africa-fasteners-china-import-guide',
        destination: '/:locale/industry/south-africa-fasteners-china-import-guide',
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
