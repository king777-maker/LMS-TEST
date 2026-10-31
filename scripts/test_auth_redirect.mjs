import puppeteer from 'puppeteer-core';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "https://broadbeach-academy-lms-d5gx.vercel.app";

async function testAuthRedirect() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem("bb_cookie_consent_v1", JSON.stringify({
      version: 1,
      timestamp: new Date().toISOString(),
      categories: { necessary: true, analytics: false, functional: false }
    }));
  });

  await page.goto(`${BASE_URL}/free-courses/iso-9001-2026-qms-awareness`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Trigger modal
  await page.evaluate(() => {
    const start = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.trim() === 'Start Course');
    if (start) start.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click "Log In" button inside the modal
  const loginClicked = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"], [class*="Modal"], [class*="AuthPrompt"]');
    if (modal) {
      const loginBtn = Array.from(modal.querySelectorAll('button, a')).find(b => b.innerText.trim() === 'Log In' || b.innerText.includes('Log In'));
      if (loginBtn) {
        loginBtn.click();
        return true;
      }
    }
    return false;
  });

  console.log("Clicked Log In button in modal:", loginClicked);
  await new Promise(r => setTimeout(r, 2000));
  console.log("URL after clicking Log In:", page.url());

  await browser.close();
}

testAuthRedirect().catch(console.error);

