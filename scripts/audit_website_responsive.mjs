import puppeteer from 'puppeteer-core';

const VIEWPORTS = [
  { name: 'Large Desktop', width: 1920, height: 1080 },
  { name: 'Desktop', width: 1600, height: 900 },
  { name: 'Laptop Standard', width: 1440, height: 900 },
  { name: 'Laptop Windows Typical', width: 1366, height: 768 },
  { name: 'Small Laptop', width: 1280, height: 800 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile Large', width: 430, height: 932 },
  { name: 'Mobile Standard', width: 390, height: 844 },
  { name: 'Small Mobile', width: 360, height: 780 }
];

const ROUTES = [
  '/',
  '/free-courses',
  '/courses',
  '/free-courses/iso-9001-2015-quality-management-foundation',
  '/lead-auditor',
  '/internal-auditor',
  '/health-safety-hse',
  '/professional-certifications',
  '/contact',
  '/verify-certificate',
  '/login',
  '/register',
  '/my-courses',
  '/my-profile',
  '/learning/332',
  '/result/332',
  '/admin/login',
  '/about',
  '/privacy-policy'
];

async function runAudit() {
  console.log('================================================================');
  console.log('   BROADBEACH ACADEMY CROSS-PLATFORM & RESPONSIVE AUDIT RUNNER   ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const issues = [];
  const summary = {
    totalChecked: 0,
    overflowCount: 0,
    consoleErrors: 0,
    routesAudited: 0
  };

  page.on('console', msg => {
    if (msg.type() === 'error') {
      summary.consoleErrors++;
    }
  });

  for (const route of ROUTES) {
    const url = `http://localhost:3000${route}`;
    process.stdout.write(`Auditing route: ${route.padEnd(45)} `);

    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await new Promise(r => setTimeout(r, 250));

      let routeOverflows = 0;

      for (const vp of VIEWPORTS) {
        summary.totalChecked++;
        await page.setViewport({ width: vp.width, height: vp.height });
        await new Promise(r => setTimeout(r, 60)); // allow resize repaint

        const metrics = await page.evaluate((vpWidth) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasOverflow = scrollWidth > (vpWidth + 1);
          const overflowDiff = scrollWidth - vpWidth;

          let offenders = [];
          if (hasOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > vpWidth + 2 && rect.width > 0 && rect.height > 0) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 2).join('.') : '';
                offenders.push(`${tag}.${cls} (+${Math.round(rect.right - vpWidth)}px)`);
                if (offenders.length >= 2) break;
              }
            }
          }

          return { hasOverflow, overflowDiff, offenders };
        }, vp.width);

        if (metrics.hasOverflow) {
          summary.overflowCount++;
          routeOverflows++;
          issues.push({
            route,
            viewport: `${vp.name} (${vp.width}px)`,
            overflowBy: `${metrics.overflowDiff}px`,
            offenders: metrics.offenders
          });
        }
      }

      summary.routesAudited++;
      if (routeOverflows > 0) {
        console.log(`❌ [${routeOverflows} viewports overflowed]`);
      } else {
        console.log(`✅ [All 10 viewports clean]`);
      }
    } catch (err) {
      console.log(`⚠️ [Failed: ${err.message}]`);
    }
  }

  await browser.close();

  console.log('\n================================================================');
  console.log(`AUDIT COMPLETE: ${summary.routesAudited}/${ROUTES.length} routes audited.`);
  console.log(`Total Viewport Configurations Checked: ${summary.totalChecked}`);
  console.log(`Total Horizontal Overflows Detected: ${summary.overflowCount}`);
  console.log('================================================================');

  if (issues.length > 0) {
    console.log('\nOVERFLOW DETAILS:');
    issues.forEach((iss, i) => {
      console.log(`${i + 1}. ${iss.route} @ ${iss.viewport}: +${iss.overflowBy} (${iss.offenders.join(', ')})`);
    });
  }

  return { summary, issues };
}

runAudit();
