import { chromium } from 'playwright';

const SITE = 'https://www.tradego-fasteners.com';

async function audit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });

  const page = await context.newPage();
  const results = { issues: [] };

  function addIssue(priority, category, message) {
    results.issues.push({ priority, category, message });
  }

  // 1. Core Web Vitals
  console.log('=== 1. Core Web Vitals ===');
  await page.goto(SITE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const lcpCandidate = await page.evaluate(() => {
    return new Promise(resolve => {
      let lcp = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.startTime > lcp) lcp = entry.startTime;
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      const clsObserver = new PerformanceObserver((list) => {
        // CLS calculation
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      setTimeout(() => {
        observer.disconnect();
        clsObserver.disconnect();

        const entries = performance.getEntriesByType('layout-shift');
        let cls = 0;
        for (const e of entries) {
          if (!e.hadRecentInput) cls += e.value;
        }

        resolve({ lcp, cls });
      }, 3000);
    });
  });

  const lcpMs = lcpCandidate.lcp;
  const cls = lcpCandidate.cls;

  if (lcpMs && lcpMs > 2500) {
    addIssue('P1', 'Core Web Vitals', `LCP = ${lcpMs.toFixed(0)}ms (target < 2500ms) - NEEDS IMPROVEMENT`);
  } else if (lcpMs) {
    console.log(`✅ LCP = ${lcpMs.toFixed(0)}ms (target < 2500ms)`);
  }

  if (cls && cls > 0.1) {
    addIssue('P1', 'Core Web Vitals', `CLS = ${cls.toFixed(3)} (target < 0.1) - NEEDS IMPROVEMENT`);
  } else if (cls !== undefined) {
    console.log(`✅ CLS = ${cls.toFixed(3)} (target < 0.1)`);
  }

  // 2. hreflang tags
  console.log('\n=== 2. hreflang Tags ===');
  const hreflangs = await page.evaluate(() => {
    const links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    return Array.from(links).map(l => ({
      hreflang: l.getAttribute('hreflang'),
      href: l.getAttribute('href'),
    }));
  });

  const expectedLangs = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi', 'x-default'];
  const foundLangs = hreflangs.map(h => h.hreflang);

  console.log('Found hreflangs:', foundLangs);

  for (const lang of expectedLangs) {
    if (!foundLangs.includes(lang)) {
      addIssue('P1', 'hreflang', `Missing hreflang="${lang}"`);
    }
  }

  const xDefault = hreflangs.find(h => h.hreflang === 'x-default');
  if (!xDefault) {
    addIssue('P1', 'hreflang', 'Missing x-default hreflang');
  }

  const selfRef = hreflangs.find(h => h.hreflang === 'en' && h.href.includes('/en/'));
  if (!selfRef) {
    addIssue('P2', 'hreflang', 'English page may be missing self-referential hreflang');
  }

  // Print hreflang details
  console.log('\nhreflang details:');
  hreflangs.forEach(h => console.log(`  ${h.hreflang}: ${h.href.substring(0, 80)}`));

  // 3. sitemap.xml
  console.log('\n=== 3. sitemap.xml ===');
  const sitemapStatus = await page.goto(`${SITE}/sitemap.xml`, { timeout: 15000 }).catch(() => null);
  if (sitemapStatus) {
    console.log(`✅ sitemap.xml accessible, status: ${sitemapStatus.status()}`);
    const sitemapContent = await page.content();
    if (sitemapContent.includes('<urlset') || sitemapContent.includes('<sitemapindex')) {
      console.log('✅ Valid XML sitemap structure');
    } else {
      addIssue('P0', 'sitemap', 'sitemap.xml does not contain valid XML structure');
    }
  } else {
    addIssue('P0', 'sitemap', 'sitemap.xml not accessible');
  }

  // 4. robots.txt
  console.log('\n=== 4. robots.txt ===');
  const robotsStatus = await page.goto(`${SITE}/robots.txt`, { timeout: 15000 }).catch(() => null);
  if (robotsStatus) {
    console.log(`✅ robots.txt accessible, status: ${robotsStatus.status()}`);
    const robotsContent = await page.evaluate(() => document.body.textContent);
    console.log('robots.txt content:', robotsContent.substring(0, 500));
  } else {
    addIssue('P0', 'robots.txt', 'robots.txt not accessible');
  }

  // 5. Schema.org structured data
  console.log('\n=== 5. Schema.org Structured Data ===');
  await page.goto(SITE, { waitUntil: 'networkidle', timeout: 20000 });
  const schemas = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).map(s => {
      try {
        return JSON.parse(s.textContent);
      } catch {
        return { error: 'invalid JSON', raw: s.textContent.substring(0, 200) };
      }
    });
  });

  console.log(`Found ${schemas.length} JSON-LD blocks`);
  const schemaTypes = schemas.map(s => s['@type']).filter(Boolean);
  console.log('Schema types found:', schemaTypes);

  if (!schemaTypes.includes('Organization')) {
    addIssue('P1', 'Schema', 'Missing Organization Schema');
  }
  if (!schemaTypes.includes('WebSite')) {
    addIssue('P2', 'Schema', 'Missing WebSite Schema');
  }

  // 6. Homepage title and meta description
  console.log('\n=== 6. Meta Tags ===');
  const metaTags = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
  }));

  console.log('Title:', metaTags.title);
  console.log('Description:', metaTags.description?.substring(0, 100));
  console.log('Canonical:', metaTags.canonical);

  if (!metaTags.description || metaTags.description.length < 120) {
    addIssue('P1', 'Meta Tags', 'Meta description may be too short or missing');
  }

  // 7. Check product page for Product Schema
  console.log('\n=== 7. Product Page Schema ===');
  try {
    const productPage = await page.goto(`${SITE}/en/products/hex-bolts`, { waitUntil: 'networkidle', timeout: 20000 });
    console.log(`Product page status: ${productPage?.status()}`);

    const productSchema = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const s of scripts) {
        try {
          const data = JSON.parse(s.textContent);
          if (data['@type'] === 'Product') return data;
          if (Array.isArray(data)) {
            const p = data.find(item => item['@type'] === 'Product');
            if (p) return p;
          }
        } catch {}
      }
      return null;
    });

    if (productSchema) {
      console.log('✅ Product Schema found:', productSchema.name);
    } else {
      addIssue('P1', 'Schema', 'Product page missing Product Schema');
    }

    // Check for breadcrumb on product page
    const breadcrumb = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="breadcrumb"]') ||
                  document.querySelector('.breadcrumb') ||
                  document.querySelector('[class*="breadcrumb"]');
      return !!nav;
    });
    if (!breadcrumb) {
      addIssue('P2', 'UX', 'Product page missing breadcrumb navigation');
    }

  } catch(e) {
    console.log('Product page check failed:', e.message);
    addIssue('P2', 'Schema', 'Product page could not be checked');
  }

  // 8. Check blog page for Article schema
  console.log('\n=== 8. Blog Article Schema ===');
  try {
    const blogPage = await page.goto(`${SITE}/en/blog`, { waitUntil: 'networkidle', timeout: 20000 });
    if (blogPage && blogPage.status() === 200) {
      const articleLinks = await page.evaluate(() => {
        const as = document.querySelectorAll('a[href*="/blog/"]');
        return Array.from(as).filter(a => a.href.match(/\/blog\/.+/)).slice(0, 3).map(a => a.href);
      });

      console.log(`Found ${articleLinks.length} blog article links`);

      if (articleLinks.length > 0) {
        const firstArticle = await page.goto(articleLinks[0], { waitUntil: 'networkidle', timeout: 15000 });
        if (firstArticle && firstArticle.status() === 200) {
          const articleSchema = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (const s of scripts) {
              try {
                const data = JSON.parse(s.textContent);
                if (data['@type'] === 'Article' || data['@type'] === 'BlogPosting') return data['@type'];
                if (Array.isArray(data)) {
                  const a = data.find(item => item['@type'] === 'Article' || item['@type'] === 'BlogPosting');
                  if (a) return a['@type'];
                }
              } catch {}
            }
            return null;
          });

          if (articleSchema) {
            console.log(`✅ Article Schema found: ${articleSchema}`);
          } else {
            addIssue('P2', 'Schema', 'Blog article page missing Article/BlogPosting Schema');
          }
        }
      }
    }
  } catch(e) {
    console.log('Blog check failed:', e.message);
  }

  // 9. Check Zimbabwe LocalBusiness schema if applicable
  console.log('\n=== 9. LocalBusiness Schema (Zimbabwe) ===');
  try {
    const zimbabwePage = await page.goto(`${SITE}/en/zimbabwe`, { waitUntil: 'networkidle', timeout: 15000 });
    if (zimbabwePage && zimbabwePage.status() === 200) {
      const localSchema = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const s of scripts) {
          try {
            const data = JSON.parse(s.textContent);
            if (data['@type'] === 'LocalBusiness' || data.address?.addressCountry === 'ZW') return data['@type'];
          } catch {}
        }
        return null;
      });

      if (localSchema) {
        console.log(`✅ LocalBusiness Schema found: ${localSchema}`);
      } else {
        addIssue('P2', 'Schema', 'Zimbabwe page may be missing LocalBusiness Schema');
      }
    }
  } catch(e) {
    console.log('Zimbabwe page check failed:', e.message);
  }

  // 10. Mobile responsiveness check
  console.log('\n=== 10. Mobile Responsiveness ===');
  await context.close();
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });
  const mobilePage = await mobileContext.newPage();

  try {
    await mobilePage.goto(SITE, { waitUntil: 'networkidle', timeout: 20000 });
    const hasHorizontalScroll = await mobilePage.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });

    if (hasHorizontalScroll) {
      addIssue('P1', 'Mobile UX', 'Page has horizontal scroll on mobile (375px viewport)');
    } else {
      console.log('✅ No horizontal scroll on mobile');
    }

    // Check if hamburger menu is present
    const hasHamburger = await mobilePage.evaluate(() => {
      const hamburger = document.querySelector('[class*="hamburger"]') ||
                       document.querySelector('[class*="menu-toggle"]') ||
                       document.querySelector('button[aria-label*="menu" i]') ||
                       document.querySelector('svg[class*="menu"]');
      return !!hamburger;
    });

    if (hasHamburger) {
      console.log('✅ Mobile hamburger menu detected');
    } else {
      console.log('⚠️ No obvious hamburger menu found on mobile');
    }

  } catch(e) {
    console.log('Mobile check failed:', e.message);
  }

  await browser.close();

  // Print summary
  console.log('\n\n========== SEO AUDIT SUMMARY (AI-1: Technical SEO) ==========\n');

  const p0 = results.issues.filter(i => i.priority === 'P0');
  const p1 = results.issues.filter(i => i.priority === 'P1');
  const p2 = results.issues.filter(i => i.priority === 'P2');

  if (p0.length > 0) {
    console.log('🚨 P0 CRITICAL ISSUES:');
    p0.forEach(i => console.log(`  [${i.category}] ${i.message}`));
  }

  if (p1.length > 0) {
    console.log('\n🔴 P1 HIGH PRIORITY:');
    p1.forEach(i => console.log(`  [${i.category}] ${i.message}`));
  }

  if (p2.length > 0) {
    console.log('\n🟡 P2 MEDIUM PRIORITY:');
    p2.forEach(i => console.log(`  [${i.category}] ${i.message}`));
  }

  if (p0.length === 0 && p1.length === 0) {
    console.log('\n✅ No P0/P1 issues found!');
  }

  console.log(`\nTotal issues: ${results.issues.length} (P0: ${p0.length}, P1: ${p1.length}, P2: ${p2.length})`);
  console.log('\n====================================');
}

audit().catch(err => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});