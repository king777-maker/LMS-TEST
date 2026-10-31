import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "https://broadbeach-academy-lms-d5gx.vercel.app";

const VIEWPORTS = [
  { name: "Mobile Compact", width: 360, height: 800 },
  { name: "Mobile Modern", width: 390, height: 844 },
  { name: "Tablet Portrait", width: 768, height: 1024 },
  { name: "Tablet Landscape", width: 1024, height: 768 },
  { name: "Laptop", width: 1366, height: 768 },
  { name: "Desktop Standard", width: 1440, height: 900 },
  { name: "FHD Large", width: 1920, height: 1080 },
];

const ROUTES_TO_AUDIT = [
  // Core Public
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/about/history", name: "About History" },
  { path: "/about/vision", name: "About Vision" },
  { path: "/about/core-values", name: "About Core Values" },
  { path: "/about/our-team", name: "About Our Team" },
  { path: "/about/accreditations", name: "About Accreditations" },
  { path: "/about/our-customers", name: "About Our Customers" },
  { path: "/about/industries", name: "About Industries" },
  { path: "/about/relations", name: "About Media Relations" },
  { path: "/about/global-foot-print", name: "About Global Footprint" },

  // Catalogues & Course Pages
  { path: "/free-courses", name: "Free Courses Catalogue" },
  { path: "/courses", name: "All Courses Catalogue" },
  { path: "/free-courses/iso-9001-2026-qms-awareness", name: "Free Course: ISO 9001" },
  { path: "/free-courses/iso-14001-2026-ems-awareness", name: "Free Course: ISO 14001" },
  { path: "/free-courses/iso-45001-2018-ohsms-awareness", name: "Free Course: ISO 45001" },
  { path: "/free-courses/iso-22000-2018-fsms-awareness", name: "Free Course: ISO 22000" },
  { path: "/free-courses/iso-27001-2022-isms-awareness", name: "Free Course: ISO 27001" },
  { path: "/free-courses/iso-19011-2018-auditing-guidelines", name: "Free Course: ISO 19011" },
  { path: "/free-courses/5s-workplace-organization-foundation", name: "Free Course: 5S" },
  { path: "/free-courses/7-qc-tools-foundation", name: "Free Course: 7QC" },
  { path: "/free-courses/project-management-level-1-foundation", name: "Free Course: Project Mgmt" },
  { path: "/free-courses/lean-six-sigma-white-belt", name: "Free Course: Lean Six Sigma" },
  { path: "/free-courses/root-cause-analysis-foundation", name: "Free Course: RCA" },

  // Categories & Enquiry / Coming Soon
  { path: "/lead-auditor", name: "Lead Auditor Hub" },
  { path: "/internal-auditor", name: "Internal Auditor Hub" },
  { path: "/health-safety-hse", name: "Health & Safety Hub" },
  { path: "/professional-certifications", name: "Professional Certs Hub" },
  { path: "/lean-six-sigma", name: "Lean Six Sigma Hub" },
  { path: "/aerospace", name: "Aerospace Hub" },

  // Learner Auth & Verification
  { path: "/login", name: "Learner Login" },
  { path: "/register", name: "Learner Registration" },
  { path: "/verify-certificate", name: "Verify Certificate" },
  { path: "/contact", name: "Contact Us" },
  { path: "/raise-a-ticket", name: "Raise A Ticket" },

  // Legal & Compliance
  { path: "/terms-conditions", name: "Terms & Conditions" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/cancellation-refund-policy", name: "Cancellation & Refund" },
  { path: "/cookie-policy", name: "Cookie Policy" },
  { path: "/accessibility-statement", name: "Accessibility Statement" },
  { path: "/terms-of-use", name: "Terms of Use" },
  { path: "/return-policy", name: "Return Policy" },
  { path: "/data-compliance-policy", name: "Data Compliance Policy" },

  // Learning Workflows (Unauthenticated state check)
  { path: "/learning/322", name: "Learning ISO 9001" },
  { path: "/learning/332", name: "Learning ISO 14001" },
  { path: "/assignment/322", name: "Assignment ISO 9001" },
  { path: "/assignment/332", name: "Assignment ISO 14001" },

  // Admin Security Testing
  { path: "/admin/login", name: "Predictable Admin Login (Should be 404)" },
  { path: "/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24", name: "Secret Admin Login URL" },
  { path: "/admin", name: "Admin Dashboard Gate (Unauth)" },
  { path: "/admin/online-certs", name: "Admin Online Certs Gate (Unauth)" },
  { path: "/admin/manual-certs", name: "Admin Manual Certs Gate (Unauth)" },
  { path: "/admin/tickets", name: "Admin Tickets Gate (Unauth)" },
  { path: "/admin/trash", name: "Admin Trash Gate (Unauth)" },
  { path: "/admin/access", name: "Admin Access Gate (Unauth)" },

  // Fallback
  { path: "/non-existent-page-forensic-test", name: "404 Catch-All Page" }
];

async function runAudit() {
  console.log("==================================================================");
  console.log("🚀 STARTING BROADBEACH ACADEMY LIVE FORENSIC AUDIT");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Browser: ${EDGE_PATH}`);
  console.log("==================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const auditReport = {
    timestamp: new Date().toISOString(),
    targetUrl: BASE_URL,
    totalRoutesAudited: 0,
    passedRoutes: 0,
    failedRoutes: 0,
    routes: [],
    responsiveResults: [],
    uxIssues: [],
    securityFindings: [],
    functionalBugs: []
  };

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. AUDIT ALL ROUTES (STATUS, TITLE, SEO, CONSOLE ERRORS, NETWORK FAILURES)
  console.log("--- PHASE A: AUDITING ROUTE INVENTORY ---");

  for (const route of ROUTES_TO_AUDIT) {
    const fullUrl = `${BASE_URL}${route.path}`;
    const consoleLogs = [];
    const failedReqs = [];

    const consoleHandler = msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
      }
    };
    const reqFailHandler = req => {
      failedReqs.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    };

    page.on('console', consoleHandler);
    page.on('requestfailed', reqFailHandler);

    let status = 0;
    let title = "";
    let metaDescription = "";
    let h1Text = "";
    let hasRootContent = false;
    let horizontalScroll = false;
    let finalUrl = "";

    try {
      const response = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 25000 });
      status = response?.status() || 0;
      finalUrl = page.url();
      title = await page.title();

      metaDescription = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.getAttribute('content') : "";
      });

      h1Text = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText.trim().replace(/\n/g, ' ') : "";
      });

      hasRootContent = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root && root.children.length > 0 && root.innerText.trim().length > 10;
      });

      horizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

    } catch (err) {
      status = 0;
      consoleLogs.push(`Navigation failed: ${err.message}`);
    } finally {
      page.off('console', consoleHandler);
      page.off('requestfailed', reqFailHandler);
    }

    const routeResult = {
      path: route.path,
      name: route.name,
      finalUrl,
      status,
      title,
      metaDescription,
      h1Text: h1Text.substring(0, 100),
      hasRootContent,
      horizontalScroll,
      consoleErrors: consoleLogs.length,
      failedRequests: failedReqs.length,
      consoleDetails: consoleLogs.slice(0, 5),
      failedRequestDetails: failedReqs.slice(0, 5)
    };

    auditReport.routes.push(routeResult);
    auditReport.totalRoutesAudited++;

    // Classify
    const isSpecial404 = route.path === "/admin/login" || route.path.includes("non-existent");
    const isPassing = hasRootContent && (isSpecial404 ? (h1Text.includes("404") || title.includes("404") || h1Text.includes("Page Not Found") || h1Text.includes("Lost")) : !h1Text.includes("404"));

    if (isPassing) {
      auditReport.passedRoutes++;
      console.log(`  ✓ [PASS] ${route.path} (${route.name}) — "${title.substring(0, 50)}"`);
    } else {
      auditReport.failedRoutes++;
      console.log(`  ✗ [FAIL/WARN] ${route.path} (${route.name}) — H1: "${h1Text}", Title: "${title}"`);
    }
  }

  // 2. RESPONSIVE AUDIT AT 7 VIEWPORTS FOR 5 CORE SURFACES
  console.log("\n--- PHASE B: AUDITING 7 VIEWPORTS ACROSS CORE SURFACES ---");
  const testSurfaces = [
    { path: "/", name: "Homepage" },
    { path: "/free-courses", name: "Free Courses" },
    { path: "/lead-auditor", name: "Lead Auditor" },
    { path: "/verify-certificate", name: "Verify Certificate" },
    { path: "/contact", name: "Contact Us" },
    { path: "/login", name: "Login" }
  ];

  for (const surface of testSurfaces) {
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}${surface.path}`, { waitUntil: 'networkidle2', timeout: 20000 });

      const metrics = await page.evaluate(() => {
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const docWidth = document.documentElement.scrollWidth;
        const hasOverflow = docWidth > winWidth || bodyWidth > winWidth;
        const overflowDelta = Math.max(docWidth - winWidth, bodyWidth - winWidth);

        // Check for clipped elements or missing buttons
        const primaryButtons = Array.from(document.querySelectorAll('button, a.btn, a[class*="button"]'))
          .map(b => {
            const rect = b.getBoundingClientRect();
            return {
              text: b.innerText.trim(),
              width: rect.width,
              height: rect.height,
              visible: rect.width > 0 && rect.height > 0 && rect.top >= 0
            };
          }).filter(b => b.text.length > 0).slice(0, 5);

        return {
          winWidth,
          docWidth,
          hasOverflow,
          overflowDelta,
          buttonCount: primaryButtons.length
        };
      });

      const resItem = {
        surface: surface.name,
        path: surface.path,
        viewport: vp.name,
        resolution: `${vp.width}x${vp.height}`,
        hasOverflow: metrics.hasOverflow,
        overflowDelta: metrics.overflowDelta,
        buttonCount: metrics.buttonCount
      };

      auditReport.responsiveResults.push(resItem);
      if (metrics.hasOverflow) {
        console.log(`  ⚠️ OVERFLOW DETECTED: ${surface.name} @ ${vp.name} (${vp.width}px) — Exceeds viewport by ${metrics.overflowDelta}px`);
        auditReport.uxIssues.push({
          id: `RESP-OVF-${surface.name.replace(/\s+/g, '')}-${vp.width}`,
          route: surface.path,
          component: "Layout / Container",
          issue: `Horizontal page overflow on ${vp.name} (${vp.width}x${vp.height})`,
          actual: `Document width is ${metrics.docWidth}px, overflowing screen width (${metrics.winWidth}px) by ${metrics.overflowDelta}px`,
          expected: "Zero horizontal scrolling; content fits viewport width cleanly",
          severity: metrics.overflowDelta > 15 ? "High" : "Medium"
        });
      } else {
        console.log(`  ✓ Responsive OK: ${surface.name} @ ${vp.name} (${vp.width}x${vp.height})`);
      }
    }
  }

  // 3. FORENSIC FLOW TESTS: CERTIFICATE VERIFICATION, GUEST GATE, LOGIN
  console.log("\n--- PHASE C: INTERACTIVE FLOW TESTING ---");

  // Flow A: Certificate Verification (Valid BOA10110)
  console.log("Testing Certificate Verification Flow...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/verify-certificate`, { waitUntil: 'networkidle2' });

  // Input certificate number
  const inputSelector = 'input[type="text"], input[placeholder*="Certificate"], input[placeholder*="BOA"]';
  await page.waitForSelector(inputSelector, { timeout: 10000 });
  await page.type(inputSelector, 'BOA10110');
  
  // Click verify button
  const submitBtn = await page.$('button[type="submit"], button:has-text("Verify")');
  if (submitBtn) {
    await submitBtn.click();
    await new Promise(r => setTimeout(r, 2500));
    const cardContent = await page.evaluate(() => {
      const card = document.querySelector('.certificate-result, [class*="verified"], [class*="CertificateCard"], div[class*="border-green"]');
      return card ? card.innerText : document.body.innerText;
    });

    const isVerified = cardContent.includes('BOA10110') && (cardContent.includes('Sales Broadbeach') || cardContent.includes('Verified') || cardContent.includes('ISO 9001'));
    console.log(`  Certificate Verification Flow (BOA10110): ${isVerified ? "✅ PASSED" : "❌ FAILED"}`);
    auditReport.functionalBugs.push({
      feature: "Certificate Verification",
      testCase: "Public verification of valid credential BOA10110",
      status: isVerified ? "PASS" : "FAIL",
      observed: isVerified ? "Successfully rendered certificate verification card with student name and status" : "Failed to display verification card",
      cardSnippet: cardContent.substring(0, 150)
    });
  }

  // Flow B: Guest Learning Gate
  console.log("Testing Guest Learning Gate on /learning/322...");
  await page.goto(`${BASE_URL}/learning/322`, { waitUntil: 'networkidle2' });
  const learningUrl = page.url();
  const learningH1 = await page.evaluate(() => document.querySelector('h1')?.innerText || "");
  console.log(`  Guest visit to /learning/322 — URL: ${learningUrl}, H1: "${learningH1}"`);

  // Flow C: Predictable Admin Route Access
  console.log("Testing Strict Inaccessibility of /admin/login...");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
  const adminLoginUrl = page.url();
  const notFoundHeading = await page.evaluate(() => {
    const h1 = document.querySelector('h1, h2');
    return h1 ? h1.innerText : "";
  });
  const is404 = notFoundHeading.includes("404") || notFoundHeading.includes("Page Not Found") || notFoundHeading.includes("Lost") || document.title.includes("404");
  console.log(`  /admin/login accessibility: ${is404 ? "✅ PASS (Strictly 404)" : "❌ FAIL (Exposed or Redirected)"}`);
  auditReport.securityFindings.push({
    feature: "Admin Obscurity & Route Protection",
    endpoint: "/admin/login",
    status: is404 ? "SECURE" : "VULNERABLE",
    details: `Predictable route /admin/login rendered heading: "${notFoundHeading}" with URL: ${adminLoginUrl}`
  });

  // Flow D: Secret Admin Login Page
  console.log("Testing Configured Secret Admin Login URL...");
  await page.goto(`${BASE_URL}/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24`, { waitUntil: 'networkidle2' });
  const secretAdminTitle = await page.title();
  const secretAdminForm = await page.evaluate(() => {
    const form = document.querySelector('form');
    const email = document.querySelector('input[type="email"]');
    const pwd = document.querySelector('input[type="password"]');
    return {
      hasForm: Boolean(form),
      hasEmail: Boolean(email),
      hasPassword: Boolean(pwd)
    };
  });
  console.log(`  Secret Admin Login Form: hasForm=${secretAdminForm.hasForm}, hasEmail=${secretAdminForm.hasEmail}, hasPassword=${secretAdminForm.hasPassword}`);

  await browser.close();

  // Save complete report
  const outputPath = "C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\scripts\\puppeteer_audit_report.json";
  fs.writeFileSync(outputPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit complete! Saved detailed findings to ${outputPath}`);
}

runAudit().catch(err => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});

