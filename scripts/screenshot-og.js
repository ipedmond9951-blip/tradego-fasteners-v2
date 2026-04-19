const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const htmlPath = path.join(__dirname, 'og-template.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  const outPath = path.join(__dirname, '..', 'public', 'images', 'og-image.jpg');
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
  console.log('OG image saved to', outPath);
  await browser.close();
})();
