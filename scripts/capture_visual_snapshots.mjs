import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SNAPSHOTS_DIR = path.resolve('public/snapshots');

const PAGES_TO_CAPTURE = [
  { name: '01_homepage_desktop', url: 'http://localhost:3000/', width: 1440, height: 900 },
  { name: '01_homepage_mobile', url: 'http://localhost:3000/', width: 390, height: 844 },
  { name: '02_free_courses_desktop', url: 'http://localhost:3000/free-courses', width: 1440, height: 900 },
  { name: '02_free_courses_mobile', url: 'http://localhost:3000/free-courses', width: 390, height: 844 },
  { name: '03_course_details_desktop', url: 'http://localhost:3000/free-courses/iso-9001-2015-quality-management-foundation', width: 1440, height: 900 },
  { name: '03_course_details_mobile', url: 'http://localhost:3000/free-courses/iso-9001-2015-quality-management-foundation', width: 390, height: 844 },
  { name: '04_verify_certificate_desktop', url: 'http://localhost:3000/verify-certificate', width: 1440, height: 900 },
  { name: '04_verify_certificate_mobile', url: 'http://localhost:3000/verify-certificate', width: 390, height: 844 },
  { name: '05_learning_player_desktop', url: 'http://localhost:3000/learning/332', width: 1440, height: 900 },
  { name: '06_result_page_desktop', url: 'http://localhost:3000/result/332', width: 1440, height: 900 }
];

async function captureSnapshots() {
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const item of PAGES_TO_CAPTURE) {
    try {
      await page.setViewport({ width: item.width, height: item.height });
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise(r => setTimeout(r, 600)); // wait for transitions

      const filePath = path.join(SNAPSHOTS_DIR, `${item.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`[SNAPSHOT] Saved: ${item.name}.png (${item.width}x${item.height})`);
    } catch (e) {
      console.error(`[ERROR] Failed to capture ${item.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('All visual snapshots captured successfully in', SNAPSHOTS_DIR);
}

captureSnapshots();
