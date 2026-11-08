import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exePath = fs.existsSync(edgePath) ? edgePath : chromePath;

const BASE_URL = 'http://localhost:3000';
const artifactDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\a79ad851-939c-45f5-b470-c4cee63582ee';

const testCases = [
  { name: 'Homepage (Desktop)', url: `${BASE_URL}/`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'Course Deep URL (Desktop)', url: `${BASE_URL}/courses/iso-9001-2026-qms-awareness`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'About Page', url: `${BASE_URL}/about-us`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'Contact Page', url: `${BASE_URL}/contact`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'Certificate Verification Page', url: `${BASE_URL}/verify-certificate`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'Blog Page', url: `${BASE_URL}/blog`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'Mobile Homepage (390x844)', url: `${BASE_URL}/`, width: 390, height: 844, expectMaintenance: true },
  { name: 'Unknown / 404 Route', url: `${BASE_URL}/some-unknown-random-route-999`, width: 1440, height: 900, expectMaintenance: true },
  { name: 'Admin Login Access', url: `${BASE_URL}/admin/login`, width: 1440, height: 900, expectMaintenance: false }
];

async function runVerification() {
  console.log('Testing Maintenance Mode across routes and viewports...');
  const browser = await puppeteer.launch({
    executablePath: exePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const page = await browser.newPage();
    await page.setViewport({ width: tc.width, height: tc.height });

    try {
      await page.goto(tc.url, { waitUntil: 'networkidle2', timeout: 10000 });
      await new Promise(r => setTimeout(r, 400));

      const evaluation = await page.evaluate(() => {
        const text = document.body.innerText;
        const hasMainHeading = text.toUpperCase().includes("WE'LL BE BACK SOON!");
        const hasSubHeading = text.toUpperCase().includes("WE'RE CURRENTLY IMPROVING OUR WEBSITE");
        const hasStatusPill = text.toUpperCase().includes("WEBSITE UNDER MAINTENANCE");
        const hasEmail = text.includes("certification@broadbeach.in");
        const hasContactBtn = Array.from(document.querySelectorAll('button, a')).some(el => el.innerText && el.innerText.includes("Contact Us"));
        const hasWhatsapp = Array.from(document.querySelectorAll('a')).some(el => el.href && el.href.includes("wa.me"));
        const isAdminLogin = text.includes("Admin Portal") || text.includes("Administrator") || text.includes("Password") || text.includes("Broadbeach Academy Admin");

        return {
          hasMainHeading,
          hasSubHeading,
          hasStatusPill,
          hasEmail,
          hasContactBtn,
          hasWhatsapp,
          isAdminLogin,
          textSample: text.slice(0, 200).replace(/\n+/g, ' ')
        };
      });

      const pass = tc.expectMaintenance ? 
        (evaluation.hasMainHeading && evaluation.hasSubHeading && evaluation.hasStatusPill && evaluation.hasEmail) : 
        evaluation.isAdminLogin;

      // Capture screenshot for key tests
      if (i === 0 || i === 1 || i === 6 || i === 8) {
        const screenshotFileName = `maintenance_${tc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
        const screenshotPath = path.join(artifactDir, screenshotFileName);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`   Captured screenshot: ${screenshotFileName}`);
      }

      results.push({
        testCase: tc.name,
        url: tc.url,
        viewport: `${tc.width}x${tc.height}`,
        pass,
        evaluation
      });

      console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.name} -> Maintenance Displayed: ${evaluation.hasMainHeading}`);

    } catch (err) {
      console.error(`[ERROR] ${tc.name}:`, err.message);
      results.push({ testCase: tc.name, pass: false, error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  fs.writeFileSync('scripts/maintenance_qa_results.json', JSON.stringify(results, null, 2));
  console.log('Maintenance QA verification complete! Results saved to scripts/maintenance_qa_results.json');
}

runVerification().catch(console.error);
