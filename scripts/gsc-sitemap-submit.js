/**
 * GSC Sitemap Submit via Chrome CDP
 * Connects to Chrome at localhost:18800 and submits sitemap
 */

const { chromium } = require('playwright');

async function submitSitemap() {
  console.log('Connecting to Chrome CDP at localhost:18800...');
  
  // Connect to Chrome via CDP
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  
  // Get the default context
  const context = browser.contexts()[0] || await browser.newContext();
  
  // Create a new page
  const page = await context.newPage();
  
  console.log('Navigating to Google Search Console...');
  
  // Navigate to GSC
  await page.goto('https://search.google.com/search-console', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Check if we're logged in
  const url = page.url();
  console.log('Current URL:', url);
  
  if (url.includes('accounts.google.com') || url.includes('signin')) {
    console.log('❌ NOT LOGGED IN - Please login to Google account first');
    console.log('URL:', url);
    await browser.close();
    return;
  }
  
  console.log('✅ Logged into Google!');
  
  // Navigate to Sitemaps
  console.log('Navigating to Sitemaps...');
  await page.goto('https://search.google.com/search-console/sitemaps', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  console.log('Current URL:', page.url());
  
  // Take a screenshot to see the state
  await page.screenshot({ path: '/tmp/gsc-sitemap.png', fullPage: true });
  console.log('Screenshot saved to /tmp/gsc-sitemap.png');
  
  // Look for the Add Sitemap button or input
  // Try to find the sitemap submission form
  const addSitemapButton = await page.$('button:has-text("Add Sitemap")') || 
                           await page.$('a:has-text("Add Sitemap")') ||
                           await page.$('[aria-label*="sitemap" i]');
  
  if (addSitemapButton) {
    console.log('Found Add Sitemap button, clicking...');
    await addSitemapButton.click();
    await page.waitForTimeout(1000);
  }
  
  // Look for input field
  const input = await page.$('input[type="text"]') || await page.$('input[aria-label*="sitemap" i]');
  
  if (input) {
    console.log('Found input field, entering sitemap URL...');
    await input.fill('https://www.tradego-fasteners.com/sitemap.xml');
    await page.waitForTimeout(500);
    
    // Try to submit
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    console.log('Sitemap submitted!');
  } else {
    console.log('Could not find sitemap input field');
  }
  
  // Take final screenshot
  await page.screenshot({ path: '/tmp/gsc-sitemap-submit.png', fullPage: true });
  console.log('Final screenshot saved');
  
  await browser.close();
  console.log('Done!');
}

submitSitemap().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
