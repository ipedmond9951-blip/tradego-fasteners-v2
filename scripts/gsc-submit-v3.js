/**
 * GSC Sitemap Submit v3 - Handles collapsed "添加新的站点地图" section
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
  
  // First, try to find and expand the "添加新的站点地图" section
  // Look for any element with this text or similar
  const expandButtons = await page.$$('button, div[role="button"]');
  for (const btn of expandButtons) {
    const text = await btn.innerText().catch(() => '');
    if (text.includes('添加') || text.includes('Add') || text.includes('sitemap') || text.includes('站点地图')) {
      console.log('Found expandable element:', text);
      await btn.click();
      await page.waitForTimeout(1000);
    }
  }
  
  // Look for the "添加新的站点地图" heading or link and click it
  const addNewSection = await page.$('text=添加新的站点地图');
  if (addNewSection) {
    console.log('Found "添加新的站点地图", clicking...');
    await addNewSection.click();
    await page.waitForTimeout(1500);
  } else {
    console.log('Did not find explicit "添加新的站点地图" text, looking for input anyway...');
  }
  
  // Take screenshot before submission
  await page.screenshot({ path: '/tmp/gsc-before-submit.png', fullPage: true });
  console.log('Screenshot before: /tmp/gsc-before-submit.png');
  
  // Now look for the input field with aria-label
  const inputSelector = 'input[aria-label="输入站点地图网址"], input[aria-label*="sitemap" i], input[placeholder*="sitemap" i]';
  let input = await page.$(inputSelector);
  
  if (!input) {
    // Try more generic selectors
    const allInputs = await page.$$('input[type="text"]');
    console.log(`Found ${allInputs.length} text inputs on page`);
    
    // Try clicking on any input that might be for sitemap
    for (const inp of allInputs) {
      const label = await inp.getAttribute('aria-label').catch(() => '');
      const placeholder = await inp.getAttribute('placeholder').catch(() => '');
      console.log(`Input: aria-label="${label}" placeholder="${placeholder}"`);
      
      if (label.toLowerCase().includes('sitemap') || placeholder.toLowerCase().includes('sitemap')) {
        input = inp;
        break;
      }
    }
  }
  
  if (input) {
    console.log('Found sitemap input field!');
    await input.click();
    await input.fill('');
    await page.waitForTimeout(300);
    await input.type(sitemapUrl, { delay: 30 });
    await page.waitForTimeout(500);
    
    // Find and click submit button
    const submitBtn = await page.$('button:has-text("提交"), button:has-text("Submit"), button[type="submit"]');
    if (submitBtn) {
      console.log('Found submit button, clicking...');
      await submitBtn.click();
    } else {
      console.log('Pressing Enter to submit...');
      await page.keyboard.press('Enter');
    }
    
    await page.waitForTimeout(3000);
    
    console.log('URL after submit:', page.url());
    await page.screenshot({ path: '/tmp/gsc-after-submit-v3.png', fullPage: true });
    console.log('Screenshot after: /tmp/gsc-after-submit-v3.png');
    
    // Check page content for success indicators
    const pageText = await page.evaluate(() => document.body.innerText);
    if (pageText.includes('已提交') || pageText.includes('Submitted') || pageText.includes('Added') || pageText.includes('已添加')) {
      console.log('✅ SUCCESS! Sitemap submitted!');
    } else if (pageText.includes(sitemapUrl)) {
      console.log('✅ SUCCESS! Sitemap URL appears on page!');
    } else {
      console.log('⚠️ Could not confirm submission - please check screenshot manually');
    }
  } else {
    console.log('❌ Could not find sitemap input field');
    console.log('Page HTML snippet:', (await page.content()).substring(0, 2000));
  }
  
  await browser.close();
  console.log('Done!');
}

submitSitemap().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
