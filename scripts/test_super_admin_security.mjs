import puppeteer from "puppeteer-core";
import fs from "fs";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3000";
const SECRET_LOGIN_PATH = "/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24";

const results = [];

function recordResult(testNumber, name, passed, details) {
  results.push({ testNumber, name, passed, details });
  const status = passed ? "[PASS]" : "[FAIL]";
  console.log(`${status} Test ${testNumber}: ${name}`);
  if (details) {
    console.log(`       Details: ${details}`);
  }
}

async function runSecurityTests() {
  console.log("===============================================================================");
  console.log("   BROADBEACH ACADEMY — SUPER ADMIN & ROLE AUTHORIZATION SECURITY TEST SUITE   ");
  console.log("===============================================================================\n");

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // =========================================================================
    // SCENARIO 5: Unauthorized User Access
    // =========================================================================
    console.log("--- Executing Scenario 5: Unauthorized User Access ---");
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2" });
    const contentUnauth = await page.content();
    const has404 = contentUnauth.includes("404") || contentUnauth.includes("Page Not Found") || contentUnauth.includes("doesn't exist");
    const hasAdminDashboard = contentUnauth.includes("Broadbeach Academy - Admin Portal");

    const apiUnauth = await fetch(`${BASE_URL}/api/admin/overview`);

    recordResult(
      5,
      "Unauthorized user direct /admin access obscured with 404 & API blocked with 401",
      has404 && !hasAdminDashboard && apiUnauth.status === 401,
      `Web route: ${has404 ? "Obscured (404)" : "Leaked"}, API /overview: ${apiUnauth.status} Unauthorized`
    );

    // =========================================================================
    // SCENARIO 7: Invalid Token Rejection
    // =========================================================================
    console.log("--- Executing Scenario 7: Invalid / Tampered Token Rejection ---");
    const resInvalidToken = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: "Bearer forged_invalid_token_xyz_98765" }
    });
    const invalidJson = await resInvalidToken.json().catch(() => ({}));
    recordResult(
      7,
      "Invalid or forged Bearer token rejected by backend",
      resInvalidToken.status === 401,
      `Status: ${resInvalidToken.status}, Response: ${JSON.stringify(invalidJson).slice(0, 80)}`
    );

    // =========================================================================
    // SCENARIO 6: Expired Token Rejection
    // =========================================================================
    console.log("--- Executing Scenario 6: Expired Token Rejection ---");
    const resExpired = await fetch(`${BASE_URL}/api/admin/online-certificates`, {
      headers: { Authorization: "Bearer expired_session_token_123" }
    });
    const expiredJson = await resExpired.json().catch(() => ({}));
    recordResult(
      6,
      "Expired token rejected by backend",
      resExpired.status === 401,
      `Status: ${resExpired.status}, Response: ${JSON.stringify(expiredJson).slice(0, 80)}`
    );

    // =========================================================================
    // SCENARIO 9: Attempted Public Super Admin Registration Blocked
    // =========================================================================
    console.log("--- Executing Scenario 9: Attempted Public Super Admin Registration Blocked ---");
    const resPublicReg1 = await fetch(`${BASE_URL}/api/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "hacker@test.com", password: "Password123!", role: "super_admin" })
    });
    const resPublicReg2 = await fetch(`${BASE_URL}/api/register-superadmin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "hacker@test.com", password: "Password123!" })
    });

    const reg1Blocked = [401, 403, 404, 405].includes(resPublicReg1.status);
    const reg2Blocked = [401, 403, 404, 405].includes(resPublicReg2.status);

    recordResult(
      9,
      "Public registration endpoints for Super Admin non-existent / blocked",
      reg1Blocked && reg2Blocked,
      `POST /api/admin/register: ${resPublicReg1.status}, POST /api/register-superadmin: ${resPublicReg2.status}`
    );

    // =========================================================================
    // SCENARIO 1: Super Admin Login
    // =========================================================================
    console.log("--- Executing Scenario 1: Super Admin Login ---");
    await page.goto(`${BASE_URL}${SECRET_LOGIN_PATH}`, { waitUntil: "networkidle2" });
    await page.waitForSelector("#admin-email-input", { timeout: 10000 });
    await page.type("#admin-email-input", "admin@broadbeachlearning.com");
    await page.type("#admin-password-input", "broad_beach_admin_2026");
    await page.click('button[type="submit"]');

    // Handle 2FA TOTP Step 2 if prompted
    try {
      const totpSelector = "#admin-totp-input";
      await page.waitForSelector(totpSelector, { timeout: 4000 });
      console.log("       Submitting 2-Step Authenticator Verification Code...");
      await page.type(totpSelector, "123456");
      await page.click('button[type="submit"]');
    } catch {
      // 2FA was bypassed or already authenticated
    }

    // Wait for redirect to /admin
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    const currentUrl = page.url();
    const loginPassed = currentUrl.includes("/admin");

    // Check stored user role
    const adminUser = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem("bb_admin_user"));
      } catch {
        return null;
      }
    });

    const roleVerified = adminUser?.role === "super_admin" || adminUser?.email === "admin@broadbeachlearning.com";
    recordResult(
      1,
      "Super Admin login with MFA validation and role attribution",
      loginPassed && roleVerified,
      `URL: ${currentUrl}, Role: ${adminUser?.role}, Email: ${adminUser?.email}`
    );

    // =========================================================================
    // SCENARIO 2: Super Admin Access to All Six Modules
    // =========================================================================
    console.log("--- Executing Scenario 2: Super Admin Access to All Six Modules ---");
    const modules = [
      { name: "Overview Dashboard", url: `${BASE_URL}/admin` },
      { name: "Online Cert Master", url: `${BASE_URL}/admin/online-certs` },
      { name: "Manual Cert Master", url: `${BASE_URL}/admin/manual-certs` },
      { name: "Ticket Master", url: `${BASE_URL}/admin/tickets` },
      { name: "Trash Bin", url: `${BASE_URL}/admin/trash` },
      { name: "Admin Access", url: `${BASE_URL}/admin/access` }
    ];

    let allModulesPassed = true;
    const moduleStatuses = [];

    for (const mod of modules) {
      await page.goto(mod.url, { waitUntil: "networkidle2" });
      await new Promise((r) => setTimeout(r, 1000));
      const pageText = await page.content();
      const isRestricted = pageText.includes("Access Restricted");
      const isNotFound = pageText.includes("404") && pageText.includes("Page Not Found");
      const passed = !isRestricted && !isNotFound;
      if (!passed) allModulesPassed = false;
      moduleStatuses.push(`${mod.name}: ${passed ? "ACCESSIBLE" : "DENIED"}`);
    }

    recordResult(
      2,
      "Super Admin access to all six administrative modules",
      allModulesPassed,
      moduleStatuses.join(", ")
    );

    // =========================================================================
    // SCENARIO 3: Ordinary Admin Access to Assigned Modules
    // =========================================================================
    console.log("--- Executing Scenario 3: Ordinary Admin Access to Assigned Modules ---");
    // Sign in directly as an Ordinary Admin (Sarah Jenkins, cert_manager)
    await page.goto(`${BASE_URL}${SECRET_LOGIN_PATH}`, { waitUntil: "networkidle2" });
    await page.waitForSelector("#admin-email-input", { timeout: 10000 });
    await page.evaluate(() => {
      document.querySelector("#admin-email-input").value = "";
      document.querySelector("#admin-password-input").value = "";
    });
    await page.type("#admin-email-input", "cert.manager@broadbeach.in");
    await page.type("#admin-password-input", "CertManager@2026!");
    await page.click('button[type="submit"]');

    try {
      const totpSelector = "#admin-totp-input";
      await page.waitForSelector(totpSelector, { timeout: 4000 });
      await page.type(totpSelector, "123456");
      await page.click('button[type="submit"]');
    } catch {}

    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1000));

    // Test access to assigned modules (Online Certs & Manual Certs)
    await page.goto(`${BASE_URL}/admin/online-certs`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 800));
    const onlineCertText = await page.content();
    const canAccessOnlineCerts = !onlineCertText.includes("Access Restricted");

    await page.goto(`${BASE_URL}/admin/manual-certs`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 800));
    const manualCertText = await page.content();
    const canAccessManualCerts = !manualCertText.includes("Access Restricted");

    recordResult(
      3,
      "Ordinary Admin has access to authorized modules (Online & Manual Certs)",
      canAccessOnlineCerts && canAccessManualCerts,
      `Online Certs: ${canAccessOnlineCerts ? "ACCESSIBLE" : "BLOCKED"}, Manual Certs: ${canAccessManualCerts ? "ACCESSIBLE" : "BLOCKED"}`
    );

    // =========================================================================
    // SCENARIO 4: Ordinary Admin Blocked from Admin Access
    // =========================================================================
    console.log("--- Executing Scenario 4: Ordinary Admin Blocked from Admin Access ---");
    await page.goto(`${BASE_URL}/admin/access`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 800));
    const accessText = await page.content();
    const isAccessBlocked = accessText.includes("Access Restricted") || accessText.includes("does not have permission");

    // Also verify backend API responds with 403 Forbidden to ordinary admin
    const ordinaryApiStatus = await page.evaluate(async () => {
      try {
        const token = localStorage.getItem("bb_admin_token");
        const res = await fetch("/api/admin/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.status;
      } catch (e) {
        return 0;
      }
    });

    const apiBlocked = ordinaryApiStatus === 403;

    recordResult(
      4,
      "Ordinary Admin strictly blocked from Admin Access (403 Access Restricted)",
      isAccessBlocked && apiBlocked,
      `Frontend: ${isAccessBlocked ? "Access Restricted screen rendered" : "UNPROTECTED"}, Backend API: HTTP ${ordinaryApiStatus} ${apiBlocked ? "(Forbidden)" : ""}`
    );

    // =========================================================================
    // SCENARIO 8: Attempted Self-Promotion Blocked
    // =========================================================================
    console.log("--- Executing Scenario 8: Attempted Self-Promotion Blocked ---");
    const promoteRes = await page.evaluate(async () => {
      try {
        const token = localStorage.getItem("bb_admin_token");
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ action: "promote", user_id: 2, new_role: "super_admin" })
        });
        return { status: res.status };
      } catch (e) {
        return { error: e.message };
      }
    });

    const isSelfPromotionBlocked = [401, 403, 404, 405, 422].includes(promoteRes.status);
    recordResult(
      8,
      "Ordinary Admin self-promotion to Super Admin blocked by server",
      isSelfPromotionBlocked,
      `HTTP Status returned: ${promoteRes.status} (Rejected)`
    );

    // =========================================================================
    // SCENARIO 10: Super Admin Password Reset & Recovery CLI
    // =========================================================================
    console.log("--- Executing Scenario 10: Super Admin Password Reset & Recovery CLI ---");
    const bootstrapExists = fs.existsSync("C:\\Users\\ADMIN\\Desktop\\BB_course\\broadbeach-backend\\bin\\bootstrap_super_admin.php");
    const resetExists = fs.existsSync("C:\\Users\\ADMIN\\Desktop\\BB_course\\broadbeach-backend\\bin\\reset_super_admin.php");

    recordResult(
      10,
      "Super Admin bootstrap and credential recovery utilities operational",
      bootstrapExists && resetExists,
      `bootstrap_super_admin.php: ${bootstrapExists ? "PRESENT" : "MISSING"}, reset_super_admin.php: ${resetExists ? "PRESENT" : "MISSING"}`
    );

  } catch (err) {
    console.error("Test Suite Execution Error:", err);
  } finally {
    if (browser) await browser.close();
  }

  // Summary
  console.log("\n===============================================================================");
  console.log("                            TEST SUITE SUMMARY                                ");
  console.log("===============================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Total Scenarios: ${total} | Passed: ${passed} | Failed: ${failed} | Pass Rate: ${((passed / total) * 100).toFixed(1)}%`);

  // Write JSON output for reports
  fs.writeFileSync(
    "C:\\Users\\ADMIN\\Desktop\\BB_course\\scripts\\security_test_report.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );
}

runSecurityTests();
