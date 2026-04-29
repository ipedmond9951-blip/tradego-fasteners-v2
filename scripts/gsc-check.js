/**
 * GSC Check & Submit - Simplified
 */

const { chromium } = require('playwright');

async function gscCheck() {
  console.log('🔍 Connecting to Chrome...\n');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  console.log(`Found ${pages.length} pages\n`);

  // Use existing first page (DeepSeek) or create new
  let page = pages.find(p => p.url().includes('deepseek'));
  if (!page) {
    page = await context.newPage();
  }
  
  console.log('🌐 Navigating to GSC...');
  await page.goto('https://search.google.com/search-console', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log(`URL: ${page.url()}\n`);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/gsc-check.png', fullPage: true });
  console.log('📸 Screenshot: /tmp/gsc-check.png\n');
  
  // If on not-verified page, show what we see
  if (page.url().includes('not-verified')) {
    console.log('⚠️ This Google account does NOT have GSC access to tradego-fasteners.com');
    console.log('\n📝 Options:');
    console.log('1. Use a different Google account that has GSC access');
    console.log('2. Manually add this account to GSC property');
    console.log('3. Verify ownership with this account (takes time)');
    
    // Try to see what's on the page
    const content = await page.content();
    if (content.includes('not-verified') || content.includes('Not verified')) {
      console.log('\n🔍 Page content suggests: Account not verified for this property');
    }
  } else {
    console.log('✅ Logged in to GSC!');
    // Try to navigate to sitemaps
    await page.goto('https://search.google.com/search-console/sitemaps', { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/gsc-sitemap-list.png', fullPage: true });
    console.log('📸 Sitemap list: /tmp/gsc-sitemap-list.png\n');
  }
  
  console.log('\n📋 Current pages in browser:');
  for (const p of context.pages()) {
    console.log(`  - ${p.url()}`);
  }
  
  await browser.disconnect();
  console.log('\n✅ Done. Screenshots saved to /tmp/');
}

gscCheck().catch(e => { console.error('Error:', e.message); process.exit(1); });
