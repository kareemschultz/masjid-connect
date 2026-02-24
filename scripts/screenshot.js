const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 12 Pro dimensions
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  
  await page.goto('https://masjidconnectgy.com');
  
  // Set theme to light via localStorage
  await page.evaluate(() => {
    localStorage.setItem('app_theme', '"light"');
    document.documentElement.setAttribute('data-theme', 'light');
    // Skip onboarding
    localStorage.setItem('onboarding_complete', '"true"');
    localStorage.setItem('ramadan_start', '"2026-02-19"');
    localStorage.setItem('ramadan_start_prompted', '"true"');
  });
  
  await page.reload();
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/tmp/light_home.png', fullPage: true });
  
  await page.goto('https://masjidconnectgy.com/explore');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/light_explore.png', fullPage: true });

  await page.goto('https://masjidconnectgy.com/tracker');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/light_tracker.png', fullPage: true });

  await browser.close();
})();