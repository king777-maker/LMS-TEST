import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "https://broadbeach-academy-lms-d5gx.vercel.app";

async function runInteractiveAudit() {
  console.log("==================================================================");
  console.log("🚀 BROADBEACH ACADEMY — INTERACTIVE FLOW & COMPONENT AUDIT");
  console.log("==================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const flowResults = [];

  // -------------------------------------------------------------
  // FLOW 1: CERTIFICATE VERIFICATION (VALID & INVALID)
  // -------------------------------------------------------------
  console.log("--- 1. Testing Certificate Verification Flow ---");
  await page.goto(`${BASE_URL}/verify-certificate`, { waitUntil: 'networkidle2' });

  // Test Valid BOA10110
  const inputEl = await page.$('input');
  if (inputEl) {
    await inputEl.click({ clickCount: 3 });
    await inputEl.type('BOA10110');
    
    // Find and click submit button
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Verify'));
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 3000));

    const verifySuccessText = await page.evaluate(() => document.body.innerText);
    const hasStudentName = verifySuccessText.includes('Sales Broadbeach');
    const hasCertNum = verifySuccessText.includes('BOA10110');
    const hasStatus = verifySuccessText.includes('Verified') || verifySuccessText.includes('Active');

    console.log(`  Valid Certificate (BOA10110): ${hasStudentName && hasCertNum ? "✅ PASSED" : "❌ FAILED"}`);
    flowResults.push({
      flow: "Certificate Verification (Valid)",
      status: hasStudentName && hasCertNum ? "PASS" : "FAIL",
      evidence: `Found Sales Broadbeach: ${hasStudentName}, Found BOA10110: ${hasCertNum}, Status: ${hasStatus}`
    });

    // Test Invalid Certificate (INVALID999)
    await inputEl.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await inputEl.type('INVALID999');
    
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Verify'));
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 2500));
    const verifyFailText = await page.evaluate(() => document.body.innerText);
    const hasNotFoundError = verifyFailText.includes('not found') || verifyFailText.includes('Invalid') || verifyFailText.includes('No certificate');

    console.log(`  Invalid Certificate (INVALID999): ${hasNotFoundError ? "✅ PASSED (Error displayed)" : "❌ FAILED"}`);
    flowResults.push({
      flow: "Certificate Verification (Invalid)",
      status: hasNotFoundError ? "PASS" : "FAIL",
      evidence: `Error message detected: ${hasNotFoundError}`
    });
  }

  // -------------------------------------------------------------
  // FLOW 2: GUEST LEARNING GATE (ISO 9001 vs ISO 14001)
  // -------------------------------------------------------------
  console.log("\n--- 2. Testing Guest Learning Gate on /learning/322 vs /learning/332 ---");
  
  // Visit 322 (ISO 9001)
  await page.goto(`${BASE_URL}/learning/322`, { waitUntil: 'networkidle2' });
  const url322 = page.url();
  const heading322 = await page.evaluate(() => document.querySelector('h1')?.innerText || document.body.innerText.substring(0, 80));
  const hasVideo322 = await page.evaluate(() => Boolean(document.querySelector('iframe, video')));
  const lessonCount322 = await page.evaluate(() => document.querySelectorAll('button, [class*="lesson"]').length);

  console.log(`  Course 322: Final URL=${url322}, Heading="${heading322.replace(/\n/g, ' ')}", HasVideo=${hasVideo322}, LessonsInDom=${lessonCount322}`);

  // Visit 332 (ISO 14001)
  await page.goto(`${BASE_URL}/learning/332`, { waitUntil: 'networkidle2' });
  const url332 = page.url();
  const heading332 = await page.evaluate(() => document.querySelector('h1')?.innerText || document.body.innerText.substring(0, 80));
  const hasVideo332 = await page.evaluate(() => Boolean(document.querySelector('iframe, video')));

  console.log(`  Course 332: Final URL=${url332}, Heading="${heading332.replace(/\n/g, ' ')}", HasVideo=${hasVideo332}`);

  flowResults.push({
    flow: "Course Learning Isolation (322 vs 332)",
    status: (heading322 !== heading332 || url322 !== url332) ? "PASS" : "FAIL",
    evidence: `322: "${heading322.substring(0, 40)}" vs 332: "${heading332.substring(0, 40)}"`
  });

  // -------------------------------------------------------------
  // FLOW 3: ADMIN SECURITY (Predictable 404 vs Secret Login)
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing Admin Security Layer ---");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
  const is404Page = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes("404") || text.includes("Page Not Found") || text.includes("Lost");
  });
  console.log(`  Predictable /admin/login strictly 404: ${is404Page ? "✅ PASSED (404 Not Found)" : "❌ FAILED (Exposed)"}`);

  const secretPath = "/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24";
  await page.goto(`${BASE_URL}${secretPath}`, { waitUntil: 'networkidle2' });
  const secretAdminAudit = await page.evaluate(() => {
    const email = document.querySelector('input[type="email"]');
    const pwd = document.querySelector('input[type="password"]');
    const btn = document.querySelector('button[type="submit"]');
    return {
      hasEmail: Boolean(email),
      hasPwd: Boolean(pwd),
      hasBtn: Boolean(btn),
      pageText: document.body.innerText.substring(0, 100)
    };
  });
  console.log(`  Secret Admin Login Form: Email=${secretAdminAudit.hasEmail}, Password=${secretAdminAudit.hasPwd}, Submit=${secretAdminAudit.hasBtn}`);

  flowResults.push({
    flow: "Admin Login Route Security",
    status: (is404Page && secretAdminAudit.hasEmail) ? "PASS" : "FAIL",
    evidence: `/admin/login is 404: ${is404Page}, Secret URL renders login: ${secretAdminAudit.hasEmail}`
  });

  // -------------------------------------------------------------
  // FLOW 4: CONTACT & COURSE ENQUIRY FORMS
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing Contact & Course Enquiry Form UX ---");
  await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle2' });
  const contactFormFields = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
      name: el.name || el.placeholder || el.id,
      type: el.type,
      required: el.required
    }));
    return inputs;
  });
  console.log(`  Contact Page Form Fields (${contactFormFields.length}):`, contactFormFields.map(f => f.name).slice(0, 6));

  // -------------------------------------------------------------
  // FLOW 5: COOKIE CONSENT BANNER & ACCESSIBILITY
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing Cookie Consent & Modals ---");
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  const cookieBanner = await page.evaluate(() => {
    const banner = document.querySelector('[class*="cookie"], [class*="Cookie"], [id*="cookie"]');
    return {
      exists: Boolean(banner),
      text: banner ? banner.innerText.substring(0, 80) : ""
    };
  });
  console.log(`  Cookie Consent Banner present: ${cookieBanner.exists}`);

  await browser.close();

  fs.writeFileSync("C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\scripts\\interactive_flow_results.json", JSON.stringify(flowResults, null, 2));
  console.log("\nSaved interactive flow results to scripts/interactive_flow_results.json");
}

runInteractiveAudit().catch(console.error);

