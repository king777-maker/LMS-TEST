# BROADBEACH ACADEMY — FORENSIC APPLICATION SECURITY FINDINGS
**Audit Date:** October 31, 2026  
**Auditor Classification:** Application Security Auditor & Principal Architect  
**Scope:** Deployed Vercel Web Application (`broadbeach-academy-lms-d5gx.vercel.app`), PHP Backend (`cadac.in`), and Local Source Codebase  
**Target Compliance Standards:** OWASP Top 10 (2021/2026), ISO/IEC 27001 ISMS, ISO 19011 Auditing Integrity, India DPDP Act 2023  

---

## 1. Security Findings Overview

```
Critical (P0):    3
High (P1):        4
Medium (P2):      3
Low (P3):         2
TOTAL:           12
```

---

## 2. Critical Severity Findings (P0)

### SEC-01: Hardcoded Live Production Admin Credentials in Client-Side JavaScript
- **Severity:** 🔴 **CRITICAL (P0)**
- **OWASP Category:** A07:2021 — Identification and Authentication Failures / Hardcoded Credentials
- **File / Location:** `src/pages/admin/AdminLogin.jsx` (Lines 29–30, Lines 294–325)
- **Vulnerable Code:**
  ```javascript
  // Default React State (Lines 29-30):
  const [email, setEmail] = useState("admin@broadbeachlearning.com");
  const [password, setPassword] = useState("broad_beach_admin_2026");

  // Role Preset Buttons (Lines 294-325):
  <button onClick={() => handleRoleQuickFill("admin@broadbeachlearning.com", "broad_beach_admin_2026")}>
    Super Admin
  </button>
  <button onClick={() => handleRoleQuickFill("cert.manager@broadbeach.in", "CertManager@2026!")}>
    Cert Manager
  </button>
  <button onClick={() => handleRoleQuickFill("support.agent@broadbeach.in", "SupportAgent@2026!")}>
    Support Agent
  </button>
  <button onClick={() => handleRoleQuickFill("auditor@broadbeach.in", "AuditorView@2026!")}>
    Auditor View
  </button>
  ```
- **Observed Behavior:**
  When compiling and deploying the application, Vite packages these strings directly into the public `dist/assets/*.js` chunk. Anyone inspecting network payloads or clicking the role buttons on `/admin` can read and submit the real administrative credentials of the production database.
- **Empirical Proof:**
  We sent a direct `curl` request to `https://cadac.in/.../api/admin/login` using these exact credentials:
  ```json
  {"status":true,"message":"Admin login successful.","data":{"id":1,"name":"Administrator","email":"admin@broadbeachlearning.com","role":"admin"}}
  ```
  The production server immediately authenticated the request and established a Super Administrator session!
- **Impact:**
  Complete administrative takeover of the LMS, unauthorized certificate issuance, deletion of learner records, and full access to private database tables.
- **Remediation:**
  1. Remove all hardcoded default state and role quick-fill buttons from `AdminLogin.jsx`.
  2. Immediately rotate the production administrator password on the MySQL database (`set-admin-password.php`).
  3. Enforce mandatory multi-factor authentication (MFA/TOTP) in `AdminAuthController.php` so passwords alone cannot authenticate.

---

### SEC-02: Certificate Recipient Name Spoofing in Public Verification Portal
- **Severity:** 🔴 **CRITICAL (P0)**
- **OWASP Category:** A01:2021 — Broken Access Control / Data Integrity & Impersonation
- **File / Location:** `src/pages/categories/VerifyCertificate.jsx` (Lines 98–103)
- **Vulnerable Code:**
  ```javascript
  const resolveStudentName = (certRecord, candidateNumber) => {
    // ...
    // 1. Direct logged-in user name (ensures verification page matches the active user identity)
    const loggedInName = getLoggedInUserName();
    if (loggedInName && !isPlaceholder(loggedInName)) {
      return loggedInName;
    }

    // 2. Direct record name if valid non-placeholder
    const recordName = certRecord?.student_name || certRecord?.studentName;
    // ...
  };
  ```
- **Observed Behavior:**
  When any authenticated user (e.g., "John Doe") visits the public verification page `/verify-certificate?certificate_number=BOA10110`, the page overrides the authentic recipient's name ("Sales Broadbeach") and displays "John Doe" on the verified credential card!
- **Impact:**
  A malicious user can log in with their own name, search for any legitimately issued ISO certificate number, and generate a live, verified certificate card claiming they earned the accreditation. This completely invalidates Broadbeach Academy's ISO 17024 certification accreditation and public trust.
- **Remediation:**
  Remove `loggedInName` from `resolveStudentName()`. The public verification portal must **strictly and exclusively display the `student_name` returned from the authoritative database record (`certRecord.student_name`)**.

---

### SEC-03: Production Backend Code & Database Drift (Admin API 404 Outage)
- **Severity:** 🔴 **CRITICAL (P0)**
- **OWASP Category:** A05:2021 — Security Misconfiguration / Outdated Deployment
- **Target:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/admin/*`
- **Observed Behavior:**
  The production server `cadac.in` is running an obsolete version of `broadbeach-backend` that lacks the 5 admin modules. Every administrative mutation and query to:
  - `/api/admin/overview`
  - `/api/admin/online-certificates`
  - `/api/admin/manual-certificates`
  - `/api/admin/tickets`
  - `/api/admin/trash`
  - `/api/admin/users`
  returns `HTTP 404 Not Found {"success":false,"status":false,"message":"Admin API route not found."}`.
- **Impact:**
  The entire Admin Panel is functionally broken in production. No certificates can be audited, revoked, or issued; no tickets can be resolved; and no administrative activity logs are being recorded.
- **Remediation:**
  1. Synchronize the local `broadbeach-backend` repository files to the production Apache directory on `cadac.in`.
  2. Execute `database/2026_10_24_admin_panel_schema.sql` on the production MySQL database to provision tables `manual_certificates`, `support_tickets`, `ticket_messages`, `trash_items`, and `audit_logs`.

---

## 3. High Severity Findings (P1)

### SEC-04: Anonymous Learner Progress Assigned to Hardcoded User ID 13
- **Severity:** 🟠 **HIGH (P1)**
- **OWASP Category:** A01:2021 — Broken Object Level Authorization / State Pollution
- **File / Location:** `src/utils/progressTracker.js` (Lines 10–23)
- **Vulnerable Code:**
  ```javascript
  export const resolveUserId = (userId) => {
    if (userId && Number(userId) > 0) return Number(userId);
    try {
      const storedId = localStorage.getItem("bb_user_id");
      if (storedId && Number(storedId) > 0) return Number(storedId);
      // ...
    } catch (e) {}
    return 13; // Hardcoded fallback user!
  };
  ```
- **Observed Behavior:**
  Any unauthenticated guest exploring a course or taking an assessment has their progress, lesson marks, and examination answers saved under User ID 13.
- **Impact:**
  If User ID 13 is a real registered student in the database, anonymous visitors contaminate User 13's course history. Furthermore, multiple guest visitors on shared machines overwrite each other's progress.
- **Remediation:**
  Do not default to a fixed database user ID. If no user is logged in, return `null` or a temporary anonymous UUID (e.g. `guest_${crypto.randomUUID()}`) scoped strictly to session storage.

---

### SEC-05: Client-Side Only CAPTCHA on Learner Login
- **Severity:** 🟠 **HIGH (P1)**
- **OWASP Category:** A07:2021 — Identification and Authentication Failures / Automated Attacks
- **File / Location:** `src/pages/LoginPage.jsx` (Lines 91–96) vs `broadbeach-backend/app/Controllers/AuthController.php`
- **Observed Behavior:**
  `LoginPage.jsx` generates a random 5-character alphanumeric string in React state and compares it with user input on form submit. However, the backend endpoint `POST /api/login` only checks `email` and `password`. It never receives, validates, or checks a CAPTCHA token.
- **Impact:**
  Attackers can run automated brute-force and credential stuffing scripts directly against `https://broadbeach-academy-lms-d5gx.vercel.app/api/login`, bypassing the CAPTCHA entirely.
- **Remediation:**
  Implement server-side CAPTCHA (e.g., Cloudflare Turnstile or session-based server CAPTCHA) or implement IP-based exponential backoff rate limiting in `AuthController.php`.

---

### SEC-06: Profile Name Mutability at Backend API Layer
- **Severity:** 🟠 **HIGH (P1)**
- **OWASP Category:** A01:2021 — Broken Access Control / Immutable Identity Violation
- **File / Location:** `broadbeach-backend/app/Controllers/AuthController.php` (`updateProfile()`)
- **Observed Behavior:**
  While `MyProfile.jsx` in the frontend disables the `first_name` and `last_name` input fields, the backend endpoint `POST /api/profile` and `PUT /api/profile` does not restrict these fields. An authenticated learner can send a direct API request modifying their first and last name at will.
- **Impact:**
  Learners can alter their registered legal name after passing an assessment to generate certificates under different individuals' names, violating ISO 17024 identity permanence.
- **Remediation:**
  In `AuthController.php` line 740, explicitly strip `first_name`, `last_name`, and `email` from any incoming profile update payload. Legal name updates must require administrative ticket review.

---

### SEC-07: Secret Admin URL Leaked via `/admin` Redirect
- **Severity:** 🟠 **HIGH (P1)**
- **OWASP Category:** A05:2021 — Security Through Obscurity Failure
- **File / Location:** `src/components/Admin/AdminProtectedRoute.jsx` (Line 23)
- **Vulnerable Code:**
  ```javascript
  if (!isAuthenticated || !currentAdmin) {
    return <Navigate to={adminRoutes.login} state={{ from: location }} replace />;
  }
  ```
- **Observed Behavior:**
  Although the application disabled `/admin/login` by routing it to 404, when an unauthorized user visits `/admin` or `/admin/dashboard`, `AdminProtectedRoute` automatically redirects the user's browser to `adminRoutes.login` (`/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24`), immediately exposing the secret path.
- **Impact:**
  The cryptographically generated secret admin login path is revealed to any unauthenticated visitor who navigates to `/admin`.
- **Remediation:**
  Unauthenticated visits to `/admin` or any `/admin/*` sub-route must render `NotFound.jsx` (HTTP 404) directly without redirecting.

---

## 4. Medium & Low Severity Findings (P2 & P3)

### SEC-08: Stateless Bearer Token Desynchronization with PHP Sessions
- **Severity:** 🟡 **MEDIUM (P2)**
- **Location:** `src/api/adminApi.js` vs `broadbeach-backend/app/Controllers/AdminAuthController.php`
- **Observed Behavior:**
  `adminApi.js` stores `bb_admin_token` in `localStorage` and sends it as `Authorization: Bearer <token>`. In `AdminAuthController.php`, the token is only validated against `$_SESSION["admin_token"]`. When the PHP session expires on the server (default 24 min), `$_SESSION` is destroyed. The frontend continues sending the token, but the backend rejects it with 401.
- **Remediation:**
  Store issued tokens in the `admin_users` table with an explicit expiry timestamp, or implement signed JWT tokens.

### SEC-09: Missing CORS Allow-Origin on Direct Backend Responses
- **Severity:** 🟡 **MEDIUM (P2)**
- **Location:** `broadbeach-backend/app/config/cors.php`
- **Observed Behavior:**
  When querying `https://cadac.in/.../api/profile` or admin endpoints directly, `Access-Control-Allow-Origin` is omitted unless the exact `Origin` header matches static strings. While the Vercel proxy mitigates this for production web users, mobile apps or external integrations will fail with CORS errors.

### SEC-10: Lack of Server-Side Rate Limiting on Login Endpoints
- **Severity:** 🟡 **MEDIUM (P2)**
- **Location:** `broadbeach-backend/app/routes/api.php` & `admin.php`
- **Observed Behavior:**
  No `X-RateLimit-*` headers or IP tracking exist for `/api/login` or `/api/admin/login`. Attackers can send hundreds of login attempts per minute without IP throttling.

### SEC-11: Unhandled Session Expiry in Client State
- **Severity:** 🟢 **LOW (P3)**
- **Location:** `src/context/AuthContext.jsx` (Lines 91–95)
- **Observed Behavior:**
  When `getUserProfile()` fails with 401, `AuthContext` catches the error and retains the user object in `localStorage` to avoid disrupting offline viewing. This causes UI state to appear logged in even when all subsequent backend mutations fail.

### SEC-12: Plaintext Exception Message Exposure in Backend Responses
- **Severity:** 🟢 **LOW (P3)**
- **Location:** `broadbeach-backend/app/Controllers/AssessmentController.php`
- **Observed Behavior:**
  Several endpoints return raw PHP exception strings in `{"message": $e->getMessage()}`, revealing internal database errors and table structure to clients.
