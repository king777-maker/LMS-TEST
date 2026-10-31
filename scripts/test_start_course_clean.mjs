import puppeteer from 'puppeteer-core';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "https://broadbeach-academy-lms-d5gx.vercel.app";

async function testStartCourse() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Pre-set consent in localStorage
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem("bb_cookie_consent_v1", JSON.stringify({
      version: 1,
      timestamp: new Date().toISOString(),
      categories: { necessary: true, analytics: false, functional: false }
    }));
  });

  console.log("Navigating to Free Course ISO 9001 with consent pre-stored...");
  await page.goto(`${BASE_URL}/free-courses/iso-9001-2026-qms-awareness`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  console.log("Clicking Start Course button...");
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const start = btns.find(b => b.innerText.trim() === 'Start Course Now' || b.innerText.trim() === 'Start Course' || b.innerText.trim() === 'Start Learning');
    if (start) {
      start.click();
      return start.innerText.trim();
    }
    return null;
  });

  console.log("Clicked button:", clicked);
  await new Promise(r => setTimeout(r, 3000));
  console.log("Final URL:", page.url());

  const state = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"], [class*="Modal"], [class*="AuthPrompt"]');
    const toast = document.querySelector('[role="status"], [class*="toast"]');
    return {
      modalText: modal ? modal.innerText.replace(/\n+/g, ' ') : null,
      toastText: toast ? toast.innerText : null,
      h1: document.querySelector('h1')?.innerText
    };
  });

  console.log("State after click:", JSON.stringify(state, null, 2));

  await browser.close();
}

testStartCourse().catch(console.error);

