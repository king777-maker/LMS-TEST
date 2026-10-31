import fs from 'fs';

const PROD_URL = "https://broadbeach-academy-lms-d5gx.vercel.app";
const BACKEND_DIRECT = "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api";

async function auditApis() {
  console.log("=================================================");
  console.log("   BROADBEACH ACADEMY — API AUDIT SUITE");
  console.log("=================================================");

  const testCases = [
    // Previously reported failures
    { name: "Admin Me (Vercel Proxy)", url: `${PROD_URL}/api/admin/me`, method: "GET" },
    { name: "Learner Profile (Vercel Proxy)", url: `${PROD_URL}/api/profile`, method: "GET" },
    { name: "Admin Login (Empty)", url: `${PROD_URL}/api/admin/login`, method: "POST", body: {} },
    { name: "Admin Overview", url: `${PROD_URL}/api/admin/overview`, method: "GET" },
    { name: "Admin Online Certs", url: `${PROD_URL}/api/admin/online-certificates`, method: "GET" },
    { name: "Admin Manual Certs", url: `${PROD_URL}/api/admin/manual-certificates`, method: "GET" },
    { name: "Admin Tickets", url: `${PROD_URL}/api/admin/tickets`, method: "GET" },
    { name: "Admin Trash", url: `${PROD_URL}/api/admin/trash`, method: "GET" },
    { name: "Admin Users", url: `${PROD_URL}/api/admin/users`, method: "GET" },
    { name: "Admin Users Alternative (/admin-users)", url: `${PROD_URL}/api/admin/admin-users`, method: "GET" },

    // Public Course APIs
    { name: "Featured Courses", url: `${PROD_URL}/api/featured-courses`, method: "GET" },
    { name: "Course Menu Items", url: `${PROD_URL}/api/course-menu-items`, method: "GET" },
    { name: "Course Lessons (Missing course_id)", url: `${PROD_URL}/api/course-lessons`, method: "GET" },
    { name: "Course Lessons (course_id=322)", url: `${PROD_URL}/api/course-lessons?course_id=322`, method: "GET" },
    { name: "Single Course Slug (iso-9001-2026-qms-awareness)", url: `${PROD_URL}/api/courses/iso-9001-2026-qms-awareness`, method: "GET" },
    { name: "Non-existent /api/courses", url: `${PROD_URL}/api/courses`, method: "GET" },

    // Certificate Verification APIs
    { name: "Verify Cert (Valid BOA10110)", url: `${PROD_URL}/api/certificates/verify?certificate_number=BOA10110`, method: "GET" },
    { name: "Verify Cert (Valid BOA10118)", url: `${PROD_URL}/api/certificates/verify?certificate_number=BOA10118`, method: "GET" },
    { name: "Verify Cert (Invalid)", url: `${PROD_URL}/api/certificates/verify?certificate_number=INVALID123`, method: "GET" },
    { name: "Verify Cert (Empty)", url: `${PROD_URL}/api/certificates/verify?certificate_number=`, method: "GET" },

    // Assessment & Enrolment
    { name: "Get Assessment 322 (ISO 9001)", url: `${PROD_URL}/api/assessments?certification_id=322`, method: "GET" },
    { name: "Get Assessment 332 (ISO 14001)", url: `${PROD_URL}/api/assessments?certification_id=332`, method: "GET" },
    { name: "Submit Assessment (Unauthenticated)", url: `${PROD_URL}/api/submit-assessment`, method: "POST", body: { certification_id: 322, answers: {} } },
    { name: "Enroll Course (Unauthenticated)", url: `${PROD_URL}/api/enroll-course`, method: "POST", body: { certification_id: 322 } },
    { name: "My Courses (Unauthenticated)", url: `${PROD_URL}/api/my-courses`, method: "GET" },

    // Enquiry & Contact
    { name: "Contact Submission (Empty)", url: `${PROD_URL}/api/contact`, method: "POST", body: {} },
    { name: "Course Enquiry (Empty)", url: `${PROD_URL}/api/course-enquiry`, method: "POST", body: {} },

    // Authentication Checks
    { name: "Learner Login (Invalid)", url: `${PROD_URL}/api/login`, method: "POST", body: { email: "wrong@test.com", password: "wrong" } },
    { name: "Learner Register (Empty)", url: `${PROD_URL}/api/register`, method: "POST", body: {} },
    { name: "Learner Logout", url: `${PROD_URL}/api/logout`, method: "POST" }
  ];

  const results = [];

  for (const tc of testCases) {
    try {
      const headers = {
        "Accept": "application/json",
        "Origin": PROD_URL
      };
      if (tc.body) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(tc.url, {
        method: tc.method,
        headers,
        body: tc.body ? JSON.stringify(tc.body) : undefined
      });

      const setCookie = res.headers.get("set-cookie") || "none";
      const corsOrigin = res.headers.get("access-control-allow-origin") || "none";
      const corsCreds = res.headers.get("access-control-allow-credentials") || "none";
      const contentType = res.headers.get("content-type") || "none";
      let bodyText = await res.text();
      let json = null;
      try {
        json = JSON.parse(bodyText);
      } catch (e) {
        bodyText = bodyText.substring(0, 150);
      }

      const outcome = {
        name: tc.name,
        url: tc.url,
        method: tc.method,
        status: res.status,
        statusText: res.statusText,
        corsOrigin,
        corsCreds,
        contentType,
        setCookie: setCookie !== "none",
        responseSummary: json ? JSON.stringify(json).substring(0, 200) : bodyText.substring(0, 200)
      };
      results.push(outcome);
      console.log(`[${res.status}] ${tc.method} ${tc.name} — ${outcome.responseSummary.substring(0, 80)}`);
    } catch (err) {
      console.error(`FAIL: ${tc.name} - ${err.message}`);
      results.push({
        name: tc.name,
        url: tc.url,
        method: tc.method,
        status: 0,
        error: err.message
      });
    }
  }

  // Also test OPTIONS preflight on /api/admin/me and /api/profile
  for (const preflightPath of ["/api/admin/me", "/api/profile", "/api/contact"]) {
    try {
      const res = await fetch(`${PROD_URL}${preflightPath}`, {
        method: "OPTIONS",
        headers: {
          "Origin": PROD_URL,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization, X-Admin-Token, X-Admin-PIN"
        }
      });
      const outcome = {
        name: `OPTIONS Preflight (${preflightPath})`,
        url: `${PROD_URL}${preflightPath}`,
        method: "OPTIONS",
        status: res.status,
        corsOrigin: res.headers.get("access-control-allow-origin") || "none",
        corsMethods: res.headers.get("access-control-allow-methods") || "none",
        corsHeaders: res.headers.get("access-control-allow-headers") || "none",
        corsCreds: res.headers.get("access-control-allow-credentials") || "none"
      };
      results.push(outcome);
      console.log(`[${res.status}] OPTIONS ${preflightPath} -> Origin: ${outcome.corsOrigin}, Methods: ${outcome.corsMethods}`);
    } catch (err) {
      console.error(`OPTIONS FAIL: ${preflightPath} - ${err.message}`);
    }
  }

  fs.writeFileSync("C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0\\scripts\\api_audit_results.json", JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} API audit results to scripts/api_audit_results.json`);
}

auditApis().catch(console.error);

