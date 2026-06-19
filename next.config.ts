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
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/south africa-fasteners-china-import-guide',
        destination: '/:locale/industry/south-africa-fasteners-china-import-guide',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
