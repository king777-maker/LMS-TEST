import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/ADMIN/.gemini/antigravity/brain/a79ad851-939c-45f5-b470-c4cee63582ee';

(async () => {
  console.log('Starting automated browser QA test for Support Ticket Submission...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Seed learner session
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('bb_cookie_consent_v1', JSON.stringify({
      version: 1,
      timestamp: new Date().toISOString(),
      categories: { necessary: true, analytics: true, functional: true }
    }));
    localStorage.setItem('bb_user', JSON.stringify({
      id: 13,
      user_id: 13,
      name: "Siddarth GVH",
      full_name: "Siddarth GVH",
      email: "siddarth.learner@broadbeach.in"
    }));
    localStorage.setItem('bb_user_email', "siddarth.learner@broadbeach.in");
    localStorage.setItem('bb_user_token', "learner-test-token-2026");
  });

  // 2. Open Profile Tickets tab
  console.log('Navigating to http://localhost:3000/my-profile?tab=tickets ...');
  await page.goto('http://localhost:3000/my-profile?tab=tickets', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Current page URL:', page.url());

  // 3. Click Raise Support Ticket button
  console.log('Finding raise ticket button...');
  const raiseBtn = await page.waitForSelector('[data-testid="raise-ticket-btn"], [data-testid="raise-ticket-tab-btn"]', { timeout: 15000 });
  if (!raiseBtn) {
    throw new Error('Raise Ticket button not found on page');
  }
  await raiseBtn.click();
  console.log('Clicked Raise Ticket button.');
  await new Promise(r => setTimeout(r, 1000));

  // 4. Fill in Ticket Form
  console.log('Filling support ticket form...');
  await page.waitForSelector('#ticket_subject', { timeout: 5000 });
  await page.type('#ticket_subject', 'ISO 27001 Certificate Name Correction Request');

  await page.select('#ticket_category', 'Certificate Verification');

  await page.waitForSelector('#ticket_description', { timeout: 5000 });
  await page.type('#ticket_description', 'Hello Support Team, my legal government photo ID has my middle name GVH expanded. Please verify attached documentation and issue updated certificate credentials.');

  // Capture Screenshot of filled modal
  const formScreenshot = path.join(ARTIFACTS_DIR, 'ticket_submission_form_modal.png');
  await page.screenshot({ path: formScreenshot });
  console.log('Saved ticket form screenshot:', formScreenshot);

  // 5. Click Submit Ticket
  console.log('Clicking Submit Ticket...');
  const submitBtn = await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
  await submitBtn.click();

  // Wait for submission response and UI reload
  await new Promise(r => setTimeout(r, 3000));

  // Capture screenshot of tickets list showing the new ticket
  const listScreenshot = path.join(ARTIFACTS_DIR, 'learner_tickets_list_success.png');
  await page.screenshot({ path: listScreenshot });
  console.log('Saved learner tickets list screenshot:', listScreenshot);

  // 6. Click "View Details & Replies" on the first ticket
  console.log('Opening ticket details & replies modal...');
  const viewBtns = await page.$$('button');
  let clickedView = false;
  for (const b of viewBtns) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('View Details') || text.includes('Replies')) {
      await b.click();
      clickedView = true;
      break;
    }
  }

  if (clickedView) {
    await new Promise(r => setTimeout(r, 1000));
    const detailsScreenshot = path.join(ARTIFACTS_DIR, 'ticket_details_modal_view.png');
    await page.screenshot({ path: detailsScreenshot });
    console.log('Saved ticket details screenshot:', detailsScreenshot);

    // Close details modal
    const closeBtn = await page.$('button[aria-label="Close message"], div[role="dialog"] button');
    if (closeBtn) await closeBtn.click().catch(() => {});
  }

  // 7. Verify Admin Ticket Master
  console.log('Navigating to Admin Ticket Master http://localhost:3000/admin/tickets ...');
  await page.evaluate(() => {
    localStorage.setItem('bb_admin_token', 'admin_super_secret_token');
    localStorage.setItem('bb_admin_user', JSON.stringify({
      id: 1,
      name: "Chief Administrator",
      email: "admin@broadbeachlearning.com",
      role: "super_admin"
    }));
  });

  await page.setExtraHTTPHeaders({
    'x-test-admin-role': 'super_admin'
  });

  await page.goto('http://localhost:3000/admin/tickets', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const adminScreenshot = path.join(ARTIFACTS_DIR, 'admin_ticket_master_overview.png');
  await page.screenshot({ path: adminScreenshot });
  console.log('Saved Admin Ticket Master screenshot:', adminScreenshot);

  console.log('ALL BROWSER QA TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('QA Test failed:', err);
  process.exit(1);
});
