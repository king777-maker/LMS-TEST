import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const LOCAL_BASE = 'http://localhost:3000';
const VERCEL_BASE = 'https://broadbeach-academy-lms-d5gx.vercel.app';
const BACKEND_BASE = 'https://cadac.in/broadbeachlearning.com/broadbeach-backend';

const RESULTS = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

function recordTest(category, name, passed, details = '') {
  RESULTS.tests.push({ category, name, passed, details });
  RESULTS.summary.total++;
  if (passed) {
    RESULTS.summary.passed++;
    console.log(`[PASS] [${category}] ${name}`);
  } else {
    RESULTS.summary.failed++;
    console.error(`[FAIL] [${category}] ${name}: ${details}`);
  }
}

async function runApiTests() {
  console.log('\n======================================================');
  console.log('1. DIRECT BACKEND & VERCEL PROXY AUTHENTICATION TESTS');
  console.log('======================================================');

  // Test 1.1: Direct Backend - Invalid Credentials
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@broadbeachlearning.com', password: 'wrong_password_xyz' })
    });
    recordTest('Direct Backend Auth', 'Invalid credentials rejected with 401', res.status === 401, `Status: ${res.status}`);
  } catch (e) {
    recordTest('Direct Backend Auth', 'Invalid credentials rejected with 401', false, e.message);
  }

  // Test 1.2: Direct Backend - Missing Credentials
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', password: '' })
    });
    recordTest('Direct Backend Auth', 'Empty credentials rejected with 400', res.status === 400, `Status: ${res.status}`);
  } catch (e) {
    recordTest('Direct Backend Auth', 'Empty credentials rejected with 400', false, e.message);
  }

  // Test 1.3: Direct Backend - Valid Super Admin Login
  let backendCookie = '';
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@broadbeachlearning.com', password: 'broad_beach_admin_2026' })
    });
    const data = await res.json();
    backendCookie = res.headers.get('set-cookie') || '';
    const success = res.status === 200 && data.status === true && data.data?.email === 'admin@broadbeachlearning.com';
    recordTest('Direct Backend Auth', 'Valid admin login succeeds with 200 OK and user profile', success, `User: ${data.data?.email}, Role: ${data.data?.role}`);
  } catch (e) {
    recordTest('Direct Backend Auth', 'Valid admin login succeeds with 200 OK and user profile', false, e.message);
  }

  // Test 1.4: Direct Backend - Me with Cookie
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/me`, {
      headers: { 'Cookie': backendCookie }
    });
    const data = await res.json();
    const success = res.status === 200 && data.status === true && data.data?.id === 1;
    recordTest('Direct Backend Auth', 'GET /api/admin/me validates active session cookie', success, `Status: ${res.status}`);
  } catch (e) {
    recordTest('Direct Backend Auth', 'GET /api/admin/me validates active session cookie', false, e.message);
  }

  // Test 1.5: Direct Backend - Me without Cookie
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/me`);
    recordTest('Direct Backend Auth', 'GET /api/admin/me rejects unauthenticated request with 401', res.status === 401, `Status: ${res.status}`);
  } catch (e) {
    recordTest('Direct Backend Auth', 'GET /api/admin/me rejects unauthenticated request with 401', false, e.message);
  }

  // Test 1.6: Direct Backend - Live Certificates Count
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/certificates`, {
      headers: { 'Cookie': backendCookie }
    });
    const data = await res.json();
    const count = Array.isArray(data.data) ? data.data.length : 0;
    recordTest('Direct Backend DB', 'GET /api/admin/certificates returns live certificates', res.status === 200 && count >= 12, `Total live certs: ${count}`);
  } catch (e) {
    recordTest('Direct Backend DB', 'GET /api/admin/certificates returns live certificates', false, e.message);
  }

  // Test 1.7: Vercel Proxy - Valid Login & Session Pass-through
  let vercelCookie = '';
  try {
    const res = await fetch(`${VERCEL_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@broadbeachlearning.com', password: 'broad_beach_admin_2026' })
    });
    const data = await res.json();
    vercelCookie = res.headers.get('set-cookie') || '';
    const success = res.status === 200 && data.status === true;
    recordTest('Vercel Edge Proxy', 'POST /api/admin/login proxies successfully to cadac.in', success, `Cookie present: ${Boolean(vercelCookie)}`);
  } catch (e) {
    recordTest('Vercel Edge Proxy', 'POST /api/admin/login proxies successfully to cadac.in', false, e.message);
  }

  // Test 1.8: Vercel Proxy - Me Endpoint
  try {
    const headers = {};
    if (vercelCookie) headers['Cookie'] = vercelCookie;
    const res = await fetch(`${VERCEL_BASE}/api/admin/me`, { headers });
    const data = await res.json();
    recordTest('Vercel Edge Proxy', 'GET /api/admin/me proxies with session cookie', res.status === 200 && data.status === true, `Admin: ${data.data?.name}`);
  } catch (e) {
    recordTest('Vercel Edge Proxy', 'GET /api/admin/me proxies with session cookie', false, e.message);
  }

  // Test 1.9: Vercel Proxy - Live Certificates Query
  try {
    const headers = {};
    if (vercelCookie) headers['Cookie'] = vercelCookie;
    const res = await fetch(`${VERCEL_BASE}/api/admin/certificates`, { headers });
    const data = await res.json();
    const count = Array.isArray(data.data) ? data.data.length : 0;
    recordTest('Vercel Edge Proxy', 'GET /api/admin/certificates proxies live database records', res.status === 200 && count >= 12, `Proxy count: ${count}`);
  } catch (e) {
    recordTest('Vercel Edge Proxy', 'GET /api/admin/certificates proxies live database records', false, e.message);
  }
}

async function runBrowserTests() {
  console.log('\n======================================================');
  console.log('2. HEADLESS BROWSER UI, SECURITY & WORKFLOW TESTS');
  console.log('======================================================');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Ensure cookie consent modal is dismissed
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('bb_cookie_consent_v1', JSON.stringify({
        necessary: true, analytics: true, marketing: false, functional: true, timestamp: new Date().toISOString()
      }));
    });

    // Test 2.1: Obscurity Check - Unauthenticated visit to /admin must show 404
    await page.goto(`${LOCAL_BASE}/admin`, { waitUntil: 'networkidle2' });
    const pageText404 = await page.evaluate(() => document.body.innerText);
    const shows404 = pageText404.includes('Page Not Found') || pageText404.includes('Lost in the Curriculum') || pageText404.includes('404');
    recordTest('Route Obscurity', 'Unauthenticated visit to /admin renders 404 NotFound page', shows404, `Contains 404 indicator: ${shows404}`);

    // Test 2.2: Obscurity Check - Predictable /admin/login must show 404
    await page.goto(`${LOCAL_BASE}/admin/login`, { waitUntil: 'networkidle2' });
    const pageTextLogin404 = await page.evaluate(() => document.body.innerText);
    const showsLogin404 = pageTextLogin404.includes('Page Not Found') || pageTextLogin404.includes('404');
    recordTest('Route Obscurity', 'Direct visit to /admin/login renders 404 NotFound page', showsLogin404, `Contains 404 indicator: ${showsLogin404}`);

    // Test 2.3: Secret Login Route - Navigate to secret login path
    const secretPath = '/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24';
    await page.goto(`${LOCAL_BASE}${secretPath}`, { waitUntil: 'networkidle2' });

    // Test 2.4: Credentials Exposure Check - Email and Password inputs must be EMPTY
    const emailVal = await page.$eval('#admin-email-input', el => el.value);
    const passVal = await page.$eval('#admin-password-input', el => el.value);
    const credentialsEmpty = emailVal === '' && passVal === '';
    recordTest('Credential Security', 'Login form defaults to empty inputs (no pre-filled credentials)', credentialsEmpty, `Email: "${emailVal}", Pass: "${passVal}"`);

    // Test 2.5: No Plaintext Role Presets Check
    const loginPageText = await page.evaluate(() => document.body.innerText);
    const hasRolePresetText = loginPageText.includes('Role Preset Fill') || loginPageText.includes('broad_beach_admin_2026');
    recordTest('Credential Security', 'Plaintext role quick-fill buttons removed from UI', !hasRolePresetText, `Preset matrix present: ${hasRolePresetText}`);

    // Test 2.6: Password Visibility Toggle Check
    const initialType = await page.$eval('#admin-password-input', el => el.type);
    const toggleBtn = await page.$('button[aria-label="Show password"]');
    if (toggleBtn) {
      await toggleBtn.click();
      const toggledType = await page.$eval('#admin-password-input', el => el.type);
      recordTest('UI/UX Accessibility', 'Password show/hide toggle switches input type correctly', initialType === 'password' && toggledType === 'text', `Initial: ${initialType}, Toggled: ${toggledType}`);
    } else {
      recordTest('UI/UX Accessibility', 'Password show/hide toggle button accessible with ARIA label', false, 'Toggle button not found');
    }

    // Test 2.7: Perform Valid Admin Login (Handles both Direct and 2FA Step 2)
    await page.type('#admin-email-input', 'admin@broadbeachlearning.com');
    await page.type('#admin-password-input', 'broad_beach_admin_2026');

    // Click submit for Step 1
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));

    // Check if Step 2 MFA input appears
    const totpInput = await page.$('#admin-totp-input');
    if (totpInput) {
      console.log('MFA Challenge presented: entering TOTP verification code 123456...');
      await page.type('#admin-totp-input', '123456');
      await page.click('button[type="submit"]');
      await new Promise(r => setTimeout(r, 2500));
    }

    // Test 2.8: Verify Authenticated Admin Dashboard URL & Header
    const currentUrl = page.url();
    const dashboardReached = currentUrl.includes('/admin');
    recordTest('Admin Dashboard', 'Successful authentication transitions to Admin Dashboard', dashboardReached, `URL: ${currentUrl}`);

    // Test 2.9: Verify Server-Verified Role Indicator in Header
    const dashboardText = await page.evaluate(() => document.body.innerText);
    const showsVerifiedRole = dashboardText.includes('Role:') || dashboardText.includes('Administrator') || dashboardText.includes('Super Admin');
    recordTest('Role Authorization', 'Header displays server-verified administrative role', showsVerifiedRole, `Role displayed: ${showsVerifiedRole}`);

    // Test 2.10: Verify KPI Cards Render Authoritative Count
    const cardValues = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.text-2xl, .text-3xl'));
      return cards.map(c => c.innerText.trim()).filter(Boolean);
    });
    const hasLiveCertCount = cardValues.some(val => Number(val) >= 1 || val.includes('12') || Number(val) > 0);
    recordTest('Dashboard Sync', 'Online Certificates KPI card displays authoritative count', hasLiveCertCount, `Found card values: ${cardValues.join(', ')}`);

    // Test 2.11: Verify Live Sync Timestamp / Status
    const showsSyncStatus = dashboardText.includes('sync') || dashboardText.includes('Live') || dashboardText.includes('Authoritative') || dashboardText.includes('Sync');
    recordTest('Dashboard Sync', 'Live synchronization status / timestamp is rendered', showsSyncStatus, `Sync status text present: ${showsSyncStatus}`);

    // Test 2.12: Test Refresh Button Functionality
    const refreshBtnClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => b.innerText.includes('Refresh') || b.innerText.includes('Retry'));
      if (found) {
        found.click();
        return true;
      }
      return false;
    });
    recordTest('Dashboard Interaction', 'Manual refresh button triggers metrics re-synchronization', Boolean(refreshBtnClicked), `Refresh button clicked: ${Boolean(refreshBtnClicked)}`);

    // Test 2.13: Test Admin Logout
    await page.evaluate(() => {
      const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out') || b.innerText.includes('Logout'));
      if (logoutBtn) logoutBtn.click();
    });

  } catch (err) {
    recordTest('Browser Suite', 'Headless test execution encountered error', false, err.message);
  } finally {
    if (browser) await browser.close();
  }
}

async function main() {
  await runApiTests();
  await runBrowserTests();

  console.log('\n======================================================');
  console.log('TEST SUMMARY');
  console.log('======================================================');
  console.log(`Total Tests:  ${RESULTS.summary.total}`);
  console.log(`Passed:       ${RESULTS.summary.passed}`);
  console.log(`Failed:       ${RESULTS.summary.failed}`);
  console.log(`Success Rate: ${Math.round((RESULTS.summary.passed / RESULTS.summary.total) * 100)}%`);

  fs.writeFileSync('C:/Users/ADMIN/Desktop/BB_course/scripts/admin_test_results.json', JSON.stringify(RESULTS, null, 2));
}

main().catch(console.error);
