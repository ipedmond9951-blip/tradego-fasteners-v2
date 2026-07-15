/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: 'https://www.tradego-fasteners.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    additionalSitemaps: [
      'https://www.tradego-fasteners.com/sitemap.xml',
    ],
  },
  // 2026-07-15: 加 GA4 集成框架
  // ⚠️ 需要总裁从 Google Analytics 后台拿 G-XXXX measurement ID
  // 拿到后: 在 src/app/[locale]/layout.tsx 加 <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" />
  // 同时加 <Script id="google-analytics"> 初始化 gtag('config', 'G-XXXX')
  // ⚠️ 同样需要 GSC verification meta tag content (从 Google Search Console 后台拿)
  // 拿到后: 在 src/app/[locale]/layout.tsx 加 <meta name="google-site-verification" content="XXXX" />
};

module.exports = nextSitemapConfig;
