import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SNAPSHOTS_DIR = path.resolve('public/snapshots');

async function captureDropdownSnapshots() {
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  const categories = [
    { name: 'dropdown_free_courses', text: 'Free Courses' },
    { name: 'dropdown_lead_auditor', text: 'Lead Auditor' },
    { name: 'dropdown_internal_auditor', text: 'Internal Auditor' },
    { name: 'dropdown_hse', text: 'Health&Safety(HSE)' },
    { name: 'dropdown_professional', text: 'Professional Certifications' }
  ];

  for (const cat of categories) {
    try {
      // Find the nav button with text
      const buttons = await page.$$('nav button');
      let targetButton = null;
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes(cat.text)) {
          targetButton = btn;
          break;
        }
      }

      if (targetButton) {
        await targetButton.hover();
        await new Promise(r => setTimeout(r, 600)); // wait for dropdown animation

        const filePath = path.join(SNAPSHOTS_DIR, `${cat.name}.png`);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`[SNAPSHOT] Captured ${cat.name}.png`);
      } else {
        console.warn(`[WARN] Button not found for: ${cat.text}`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to capture ${cat.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished capturing all dropdown visual snapshots!');
}

captureDropdownSnapshots();
