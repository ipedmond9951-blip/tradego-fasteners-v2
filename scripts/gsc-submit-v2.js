/**
 * GSC Sitemap Submit via Chrome CDP - Direct Approach
 */

const { chromium } = require('playwright');

async function submitSitemap() {
  console.log('Connecting to Chrome CDP...');
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  const sitemapUrl = 'https://www.tradego-fasteners.com/sitemap.xml';
  const propertyUrl = 'https://www.tradego-fasteners.com';
  
  console.log('Navigating directly to GSC Sitemaps...');
  
  // Go directly to the sitemaps page for this property
  const sitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(propertyUrl)}`;
  await page.goto(sitemapsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  console.log('URL after navigation:', page.url());
  await page.waitForTimeout(2000);
  
  // Check if we're on the right page
  if (page.url().includes('not-verified') || page.url().includes('signin')) {
    console.log('❌ Not logged in or no access to this GSC property');
    console.log('Current URL:', page.url());
    await page.screenshot({ path: '/tmp/gsc-state.png' });
    console.log('Screenshot: /tmp/gsc-state.png');
    await browser.close();
    return;
  }
  
  console.log('✅ On GSC Sitemaps page');
  await page.screenshot({ path: '/tmp/gsc-sitemaps-page.png', fullPage: true });
  
  // Look for "Add Sitemap" button
  const addButton = await page.$('button:has-text("Add Sitemap")');
  if (addButton) {
    console.log('Found "Add Sitemap" button, clicking...');
    await addButton.click();
    await page.waitForTimeout(1500);
  }
  
  // Now look for the input field
  const inputSelector = 'input[type="text"], input[aria-label*="sitemap" i], input[placeholder*="sitemap" i]';
  const input = await page.$(inputSelector);
  
  if (input) {
    console.log('Found sitemap input, typing URL...');
    await input.click();
    await input.fill('');
    await page.waitForTimeout(300);
    await input.type(sitemapUrl, { delay: 50 });
    await page.waitForTimeout(500);
    
    // Press Enter to submit
    console.log('Pressing Enter to submit...');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    
    console.log('URL after submit:', page.url());
    await page.screenshot({ path: '/tmp/gsc-after-submit.png', fullPage: true });
    console.log('Screenshot: /tmp/gsc-after-submit.png');
    
    // Check if it worked
    const pageContent = await page.content();
    if (pageContent.includes('submitted') || pageContent.includes('Added') || pageContent.includes('sitemap')) {
      console.log('✅ Sitemap may have been submitted!');
    } else {
      console.log('⚠️ Could not confirm submission');
    }
  } else {
    console.log('Could not find sitemap input field');
    await page.screenshot({ path: '/tmp/gsc-no-input.png', fullPage: true });
  }
  
  await browser.close();
  console.log('Done!');
}

submitSitemap().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
