const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Login Page
  await page.goto('http://localhost:5173/SwiftPermit-Deca/#/login', {waitUntil: 'networkidle2'});
  await page.screenshot({path: 'final_login.png'});
  
  // Features (Dark Mode)
  await page.goto('http://localhost:5173/SwiftPermit-Deca/#/features', {waitUntil: 'networkidle2'});
  await page.screenshot({path: 'final_features.png'});
  
  await browser.close();
})();
