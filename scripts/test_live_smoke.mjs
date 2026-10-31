import puppeteer from 'puppeteer-core';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TARGET_URL = "https://broadbeach-academy-lms-d5gx.vercel.app/";

async function run() {
  console.log(`Connecting to ${TARGET_URL} using Edge...`);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  
  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log(`HTTP Status: ${response.status()}`);
  console.log(`Page Title: ${await page.title()}`);
  console.log(`Console Logs (${consoleMessages.length}):`, consoleMessages.slice(0, 10));
  console.log(`Failed Requests (${failedRequests.length}):`, failedRequests);

  await browser.close();
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});

