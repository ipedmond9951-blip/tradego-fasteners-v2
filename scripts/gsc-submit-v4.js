/**
 * GSC Sitemap Submit v4 - Properly clicks the Submit button
 */

const { chromium } = require('playwright');

async function submitSitemap() {
  console.log('Connecting to Chrome CDP...');
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  const sitemapUrl = 'https://www.tradego-fasteners.com/sitemap.xml';
  
  console.log('Navigating to GSC Sitemaps page...');
  await page.goto('https://search.google.com/search-console/sitemaps?resource_id=https://www.tradego-fasteners.com', { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  console.log('Current URL:', page.url());
  await page.waitForTimeout(3000);
  
  // Check if we're on the right page
  if (page.url().includes('not-verified') || page.url().includes('signin')) {
    console.log('❌ Not logged in or no access');
    console.log('URL:', page.url());
    await browser.close();
    return;
  }
  
  console.log('✅ On GSC Sitemaps page');
  
  // Find and expand "添加新的站点地图" section
  const addNewSection = await page.$('text=添加新的站点地图');
  if (addNewSection) {
    console.log('Found "添加新的站点地图", clicking to expand...');
    await addNewSection.click();
    await page.waitForTimeout(1500);
  }
  
  await page.screenshot({ path: '/tmp/gsc-v4-before.png', fullPage: true });
  console.log('Screenshot before: /tmp/gsc-v4-before.png');
  
  // Find the input field
  const input = await page.$('input[aria-label="输入站点地图网址"]');
  
  if (input) {
    console.log('Found sitemap input field!');
    await input.click();
    await input.fill('');
    await page.waitForTimeout(300);
    await input.type(sitemapUrl, { delay: 50 });
    await page.waitForTimeout(500);
    console.log('Entered sitemap URL:', sitemapUrl);
    
    // Now find and click the "提交" (Submit) button
    // Try multiple selectors
    let submitBtn = await page.$('button:has-text("提交")');
    
    if (!submitBtn) {
      submitBtn = await page.$('button[type="submit"]');
    }
    
    if (!submitBtn) {
      // Try to find any button near the input
      const allButtons = await page.$$('button');
      for (const btn of allButtons) {
        const text = await btn.innerText().catch(() => '');
        const disabled = await btn.getAttribute('disabled').catch(() => null);
        console.log(`Button: "${text}" disabled=${disabled}`);
        if (text.trim() === '提交' && !disabled) {
          submitBtn = btn;
          break;
        }
      }
    }
    
    if (submitBtn) {
      console.log('Found submit button, clicking NOW...');
      await submitBtn.click();
      console.log('✅ CLICKED SUBMIT BUTTON!');
    } else {
      console.log('❌ Could not find submit button, trying Enter instead...');
      await page.keyboard.press('Enter');
    }
    
    await page.waitForTimeout(4000);
    
    console.log('URL after submit:', page.url());
    await page.screenshot({ path: '/tmp/gsc-v4-after.png', fullPage: true });
    console.log('Screenshot after: /tmp/gsc-v4-after.png');
    
    // Check page content for success
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('\n--- Page text snippet ---');
    console.log(pageText.substring(0, 1000));
    console.log('--- End snippet ---\n');
    
    if (pageText.includes('已提交') || pageText.includes('Submitted') || pageText.includes('已添加') || pageText.includes('Added')) {
      console.log('✅ SUCCESS! Sitemap submitted!');
    } else if (pageText.includes(sitemapUrl)) {
      console.log('✅ SUCCESS! Sitemap URL appears on page!');
    } else {
      console.log('⚠️ Please check screenshot manually');
    }
  } else {
    console.log('❌ Could not find sitemap input field');
    const html = await page.content();
    console.log('Page HTML (first 1500 chars):', html.substring(0, 1500));
  }
  
  await browser.close();
  console.log('Done!');
}

submitSitemap().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
