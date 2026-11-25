import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// 2026-11-25: 合并文章的旧 slug（content/articles/*.json 的 redirectTo）统一在这里出 308。
// 之前只有手工登记的那几条是 permanent:true；漏登记的会落到页面级 redirect()，那是 307
// 临时跳转、还会多一跳 no-slash→slash（实测 senegal 那条是 307→308→200）。
// 这里从内容文件直接生成，以后再做 301 合并不用记得回来改配置。
const LOCALE_PATTERN = ":locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)";
const aliasRedirects = (() => {
  const dir = path.join(process.cwd(), "content", "articles");
  if (!fs.existsSync(dir)) return [];
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (!data?.slug || !data?.redirectTo) continue;
      out.push({
        source: `/${LOCALE_PATTERN}/industry/${data.slug}/`,
        destination: `/${LOCALE_PATTERN}/industry/${data.redirectTo}/`,
        permanent: true,
      });
    } catch {
      // 坏文件交给 content_gate 报，不在这里阻断构建
    }
  }
  return out;
})();

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
  // 2026-11-25 额度整改: 页面函数原先各自打包 public/images(119MB) + content(56MB),
  // 单函数 trace 186MB、Vercel 侧 136MB, 每次部署重复一份 → Deployment/Function Storage 爆表。
  // 这些资源只在构建期读取, 运行时由 CDN 直接出 public 静态文件, 无需进函数包。
  outputFileTracingExcludes: {
    '*': ['public/images/**', 'public/videos/**', 'content/**'],
  },
  // Edge redirects — handled at Vercel edge (~50ms) instead of server-side (~200ms)
  // PageSpeed Insights flagged redirect chain (/) → (/en) costing ~200ms.
  async redirects() {
    return [
      // 合并旧 slug 的永久跳转（从 content/articles/*.json 的 redirectTo 生成，见文件顶部）
      ...aliasRedirects,
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
      // 2026-11-24: 该 slug 已改写为正式《非洲市场紧固件采购指南》，改为 200 服务，与 sitemap 保持一致
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
      ].flatMap(([from, to]) => {
        const rules = [
          { source: `/${from}/`, destination: `/en/industry/${to}/`, permanent: true },
        ];
        // 2026-11-23 修复：GSC 里的旧链接都是 /<locale>/industry/<old-slug>/，
        // 早先生成时漏了 industry/ 段，导致 10 语种版本的 404 一直没被修掉。
        // 另外 from === to 的旧路径只做「根级 → /en/industry/」搬迁，
        // 不能再生成语种版规则，否则会 308 重定向到自己形成死循环。
        if (from !== to) {
          rules.push({
            source: `/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/industry/${from}/`,
            destination: `/:locale/industry/${to}/`,
            permanent: true,
          } as (typeof rules)[number]);
        }
        return rules;
      }),
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
      // 2026-11-24 额度治理: 语种页面全部预渲染, 且已去掉 middleware 的 Set-Cookie,
      // 这里让 CDN 缓存一天、过期后 7 天内先返回旧版本再后台刷新,
      // 把 Fast Origin Transfer 从"每次访问都回源"压成"每天最多回源一次".
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/:locale(en|zh|es|ar|fr|pt|ru|ja|de|hi)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      // sitemap 已改由 next-sitemap 构建时生成静态文件, 给它一小时 CDN 缓存
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=600, s-maxage=3600' }],
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
