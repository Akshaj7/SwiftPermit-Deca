const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Login first to reach dashboard
  await page.goto('http://localhost:5173/SwiftPermit-Deca/#/login', {waitUntil: 'networkidle2'});
  await page.type('input[type="email"]', 'alex@buildco.com');
  await page.type('input[type="password"]', 'demo1234');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({waitUntil: 'networkidle2'})
  ]);
  
  // Navigate to Compliance/Permit Checker
  await page.goto('http://localhost:5173/SwiftPermit-Deca/#/compliance', {waitUntil: 'networkidle2'});
  await page.screenshot({path: 'final_checker.png'});
  
  await browser.close();
})();
