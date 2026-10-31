import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));
  page.on('response', async res => {
    if (res.url().includes('/api/admin') || res.url().includes('login')) {
      console.log('API RESPONSE:', res.url(), res.status());
      try {
        const text = await res.text();
        console.log('API RESPONSE BODY:', text.substring(0, 200));
      } catch {}
    }
  });

  const secretPath = '/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24';
  await page.goto('http://localhost:3000' + secretPath, { waitUntil: 'networkidle2' });
  await page.type('#admin-email-input', 'admin@broadbeachlearning.com');
  await page.type('#admin-password-input', 'broad_beach_admin_2026');
  console.log('Submitting login form...');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 4000));
  console.log('Final URL:', page.url());
  const errorText = await page.evaluate(() => {
    const errEl = document.querySelector('.text-red-300, .bg-red-500, [role="alert"]');
    return errEl ? errEl.innerText : null;
  });
  console.log('Error banner in DOM:', errorText);
  await browser.close();
}

main().catch(console.error);

