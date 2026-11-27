/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
  siteUrl: 'https://www.tradego-fasteners.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    // 站内搜索结果页（noindex 过滤型薄页面）与 public/search/*.json 索引产物，不进 sitemap
    '/search/*',
    '/search/**',
    '/*/search/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        // 2026-11-26: 去掉 /_next/ —— CSS/JS chunk 在 /_next/static 下，不能挡
        // /search/ 同时覆盖结果页与 /search/*.json 索引产物，省抓取预算
        disallow: ['/api/', '/search/'],
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
