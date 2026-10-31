import puppeteer from 'puppeteer-core';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "https://broadbeach-academy-lms-d5gx.vercel.app";

async function testCourseFlow() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to Free Course: ISO 9001...");
  await page.goto(`${BASE_URL}/free-courses/iso-9001-2026-qms-awareness`, { waitUntil: 'networkidle2' });

  // Dismiss Cookie banner if present
  await page.evaluate(() => {
    const acceptBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Accept All') || b.innerText.includes('Accept'));
    if (acceptBtn) acceptBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Find and click "Start Course Now"
  console.log("Clicking Start Course button after dismissing cookie banner...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const start = btns.find(b => b.innerText.trim() === 'Start Course Now' || b.innerText.includes('Start Course'));
    if (start) {
      console.log("Found start button:", start.innerText);
      start.click();
    }
  });

  await new Promise(r => setTimeout(r, 2500));
  console.log("URL after clicking Start Course:", page.url());

  const promptStatus = await page.evaluate(() => {
    const authModal = document.querySelector('[class*="AuthPrompt"], [class*="auth-prompt"], [role="dialog"]');
    const toast = document.querySelector('[role="status"], [class*="toast"]');
    return {
      modalHeading: authModal ? authModal.querySelector('h2, h3, h4')?.innerText : null,
      modalBody: authModal ? authModal.innerText.replace(/\n+/g, ' ') : null,
      toastText: toast ? toast.innerText : null
    };
  });

  console.log("Prompt Status:", JSON.stringify(promptStatus, null, 2));

  await browser.close();
}

testCourseFlow().catch(console.error);
