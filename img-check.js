const { chromium } = require('playwright');
(async () => {
  let browser;
  for (const url of ['http://localhost:18800', 'http://localhost:9222']) {
    try {
      browser = await chromium.connectOverCDP(url);
      break;
    } catch(e) {}
  }
  if (!browser) { process.exit(1); }

  const page = await browser.newPage();
  const errors = [];
  const notFounds = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().substring(0, 200)); });
  page.on('response', resp => { if (resp.status() === 404) notFounds.push(resp.url().substring(0, 150)); });

  // Test 5 different articles
  const testArticles = [
    'stainless-steel-hex-nuts-304-316-heavy-guide',
    'bolt-grade-markings-guide',
    'self-tapping-screws-complete-classification-guide',
    'rivets-blind-rivets-guide',
    'bulk-fastener-ordering-strategies'
  ];

  for (const slug of testArticles) {
    errors.length = 0; notFounds.length = 0;
    await page.goto(`https://www.tradego-fasteners.com/en/industry/${slug}`, {waitUntil: 'networkidle', timeout: 30000});
    const result = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return {
        count: imgs.length,
        broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).length,
        ok: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
        title: document.querySelector('h1')?.textContent
      };
    });
    console.log(`[${slug}] ${JSON.stringify(result)} 404s:${notFounds.length} errs:${errors.length}`);
    if (notFounds.length > 0) notFounds.forEach(u => console.log('  404:', u.substring(0, 120)));
  }

  await browser.close();
})().catch(e => console.error('ERR:', e.message));
