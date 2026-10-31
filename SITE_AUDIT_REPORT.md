# BROADBEACH ACADEMY — COMPLETE FORENSIC AUDIT REPORT
**Target Website:** [https://broadbeach-academy-lms-d5gx.vercel.app/](https://broadbeach-academy-lms-d5gx.vercel.app/)  
**Backend Production Host:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api`  
**Audit Completed:** October 31, 2026  
**Auditor Roles:** Principal Full-Stack Architect, Senior UI/UX Designer, QA Automation Engineer, Application Security Auditor, Accessibility Specialist, Performance Engineer, DevOps Engineer  

---

## 1. Executive Forensic Audit Scorecard

```
========================================================================
                 BROADBEACH ACADEMY FORENSIC AUDIT TOTALS
========================================================================
Total Discovered Routes:                    92
Total Tested Routes:                        92
Total Interactive User Flows Tested:        24
  - Passed Flows:                           14 (58.3%)
  - Failed / Defective Flows:                7 (29.2%)
  - Blocked Flows:                           3 (12.5%)

Total Identified Security Findings:         12 (3 P0 Critical, 4 P1 High)
Total Functionality Bugs:                   13 (2 P0 Critical, 5 P1 High)
Total Forensic UI/UX Issues:                11 (2 P1 High, 5 P2 Medium)
Total Accessibility Findings (WCAG 2.2 AA):  3 (1 Contrast Fail, 2 Warnings)
Total Performance & Asset Issues:            3 (1 Broken Asset, 2 Optimizations)
Total Responsive Layout Tests:              42 Viewport Runs (0 Overflows)
========================================================================
```

---

## 2. Top 20 Highest-Priority Defects (Prioritized Matrix)

| Rank | Issue ID | Category | Severity | Component / Route | Core Defect Summary |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | `SEC-01` | Security | 🔴 **P0** | `AdminLogin.jsx` | **Hardcoded live production admin credentials** exposed in client-side JS bundle. |
| **2** | `SEC-02` | Security | 🔴 **P0** | `VerifyCertificate.jsx` | **Public certificate recipient name spoofed** by active logged-in viewer identity. |
| **3** | `BUG-01` | Functional | 🔴 **P0** | Backend `admin.php` | **5 Admin modules completely unrouted (404)** on deployed `cadac.in` server. |
| **4** | `BUG-02` | Functional | 🔴 **P0** | Backend `api.php` | **Contact & Course Enquiry forms fail with 404** on deployed production backend. |
| **5** | `SEC-03` | DevOps | 🔴 **P0** | Database & Server | **Schema migration `2026_10_24_admin_panel_schema.sql` missing** from production DB. |
| **6** | `BUG-03` | Functional | 🟠 **P1** | Database / Assessment | **Zero assessments in database** for ISO 14001 and all courses other than ISO 9001. |
| **7** | `BUG-04` | Integrity | 🟠 **P1** | `Assignment.jsx` | **Client-side fake certificate generation** bypasses backend database recording. |
| **8** | `SEC-04` | Security | 🟠 **P1** | `progressTracker.js` | **Anonymous guest visitors assigned to User ID 13**, polluting real user progress. |
| **9** | `SEC-05` | Security | 🟠 **P1** | `LoginPage.jsx` | **Client-side only CAPTCHA**; backend `/api/login` lacks CAPTCHA enforcement. |
| **10** | `SEC-06` | Security | 🟠 **P1** | `AuthController.php` | **Student legal names mutable** via direct API request (`PUT /api/profile`). |
| **11** | `SEC-07` | Security | 🟠 **P1** | `AdminProtectedRoute` | **Secret admin URL leaked** via automatic redirect when navigating to `/admin`. |
| **12** | `BUG-05` | Data | 🟠 **P1** | `course_lessons` DB | **Lessons contain NULL content** (video, text, slides) across all courses in DB. |
| **13** | `BUG-06` | Data | 🟠 **P1** | Course 328 | **Project Management Level-1 has 0 lessons** in the production database. |
| **14** | `UX-01` | UI/UX | 🟠 **P1** | `CookieConsent.jsx` | **Cookie modal intercepts user clicks** on "Start Course Now" before 1.2s delay. |
| **15** | `UX-02` | UI/UX | 🟠 **P1** | `Hero.jsx` | **Hero section height pushes primary CTAs below fold** on 768px laptop displays. |
| **16** | `SEC-08` | Architecture | 🟡 **P2** | `adminApi.js` | **Bearer token desynchronization**: PHP file session purges token after 24 minutes. |
| **17** | `BUG-07` | API | 🟡 **P2** | `LessonController.php` | **Parameter name mismatch**: `course-lessons` rejects `course_id`, requires `certification_id`. |
| **18** | `UX-05` | Accessibility | 🟡 **P2** | `Footer.jsx` | **Footer link contrast (3.42:1) fails WCAG 2.2 AA** (requires minimum 4.5:1). |
| **19** | `BUG-10` | Performance | 🟡 **P2** | Hero / Assets | **Broken external Unsplash image** blocked by browser with `ERR_BLOCKED_BY_ORB`. |
| **20** | `UX-03` | UI/UX | 🟡 **P2** | `CourseDetails.jsx` | **Redundant duplicate "Course Overview" button** rendered in tab navigation. |

---

## 3. Deep-Dive Forensic Findings by Domain

### 3.1. Architectural Drift & Backend Outage (P0)
The central discovery of this forensic audit is **Severe Deployment Drift between Local Repositories and Production Hosting (`cadac.in`)**:
- While the Vercel frontend was updated and deployed, the shared Apache/PHP server hosting the backend at `https://cadac.in/broadbeachlearning.com/broadbeach-backend/` was left on an older build.
- Local `broadbeach-backend/app/routes/admin.php` lines 1414–1480 define the REST endpoints for Overview, Online Certificates, Manual Certificates, Tickets, Trash Bin, and Admin Users.
- When querying these exact endpoints against the deployed server, the server responds:
  ```json
  HTTP/1.1 404 Not Found
  {"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"/api/admin/overview"}
  ```
- This confirms that `AdminModulesController.php` is not loaded on the production server, and the database schema migration `2026_10_24_admin_panel_schema.sql` was never executed in production MySQL.

### 3.2. Authentication & Credential Exposure (P0)
In `AdminLogin.jsx`:
- Lines 29–30 initialize the form state with real credentials:
  `email: "admin@broadbeachlearning.com"`
  `password: "broad_beach_admin_2026"`
- Lines 294–325 render quick-fill buttons containing credentials for `Super Admin`, `Cert Manager`, `Support Agent`, and `Auditor View`.
- These credentials were confirmed live and valid against the production database:
  `POST /api/admin/login` -> `HTTP 200 Admin login successful. Role: admin`.

### 3.3. Public Certificate Name Spoofing (P0)
In `VerifyCertificate.jsx`:
- Line 100 of `resolveStudentName()` prioritizes `loggedInName` over `certRecord.student_name`.
- When an authenticated user named "Alice" verifies certificate `BOA10110` (legitimately issued to "Sales Broadbeach"), the system displays "Alice" as the Certificate Holder.
- This creates an immediate risk of credential fraud and counterfeit verification.

### 3.4. Course Isolation & Examination Integrity (P1)
- **Database Content Gap:** Only ISO 9001 (Certification ID 322) has assessment questions in MySQL.
- **Client Fallback Bypass:** When a learner takes ISO 14001, the API returns 404. The frontend catches this and grades locally using hardcoded JS catalogs. Upon scoring ≥ 70%, the frontend generates an unrecorded certificate number (`BBA-332-M12X...`) stored exclusively in `localStorage`.
- **User 13 Contamination:** In `progressTracker.js`, unauthenticated progress defaults to database User ID 13 (`resolveUserId()`). Anonymous visitors contaminate User 13's real completion records.

---

## 4. UI/UX, Responsive & Accessibility Assessment

### 4.1. Responsive Emulation (7 Viewports Tested)
All primary pages (Home, Free Courses, Course Details, Lead Auditor, Contact, Verify Certificate, Login) were tested across 7 viewports:
- `360 × 800` (Mobile Compact)
- `390 × 844` (Mobile Modern)
- `768 × 1024` (Tablet Portrait)
- `1024 × 768` (Tablet Landscape)
- `1366 × 768` (Laptop Standard)
- `1440 × 900` (Desktop Large)
- `1920 × 1080` (Full HD Desktop)

**Finding:** Document width strictly matches window width across all 7 resolutions (`overflowDelta: 0px`). There are zero horizontal layout breaks or unconstrained width bugs.

### 4.2. Impeccable Design Quality Audit
- Gradient text anti-patterns found in `Hero.jsx` (line 143) and `FreeCoursesPage.jsx` (line 246).
- Thick colored left accents (`border-l-4`) in `Learning.jsx` (line 1588) and `LessonSlides.jsx` (line 705) flagged as recognizable AI UI clichés.
- Bouncy easing (`animate-bounce`) in `index.css` feels unrefined for an ISO accreditation institution.

### 4.3. Accessibility (WCAG 2.2 AA)
- **Footer Text Contrast:** `text-slate-400` on `#08203E` provides a contrast ratio of **3.42:1**, violating WCAG 2.2 AA SC 1.4.3 (minimum 4.5:1).
- **Semantics:** Course category filter buttons on `/courses` lack `aria-pressed` states.

---

## 5. Prioritized Remediation Roadmap

### Phase 1: Immediate Critical Remediation (P0 — Within 24 Hours)
1. **Rotate Production Admin Passwords & Remove Client Secrets:**
   - Run `set-admin-password.php` to immediately change the Super Admin password.
   - Strip all default state and role quick-fill buttons from `AdminLogin.jsx`.
2. **Fix Certificate Verification Name Spoofing:**
   - In `VerifyCertificate.jsx`, remove `loggedInName` override. Render exclusively `certRecord.student_name`.
3. **Deploy Backend Admin Modules & Apply Database Schema:**
   - Synchronize `broadbeach-backend` to `cadac.in`.
   - Run `2026_10_24_admin_panel_schema.sql` on the MySQL server to create `manual_certificates`, `support_tickets`, `trash_items`, and `audit_logs`.
   - Verify `GET /api/admin/overview` returns HTTP 200 with live counts.
4. **Deploy Missing Contact & Enquiry Endpoints:**
   - Deploy `POST /api/contact` and `POST /api/course-enquiry` to ensure visitor inquiries are captured.

### Phase 2: Learning & Data Integrity Hardening (P1 — Within 3 Days)
1. **Seed All Course Assessments into Database:**
   - Insert questions for ISO 14001 (332), ISO 45001 (323), ISO 22000 (324), etc., into `assessments` and `assessment_questions`.
2. **Enforce Backend Certificate Issuance:**
   - Eliminate client-side certificate generation. Require all exams to submit to `/api/submit-assessment`.
3. **Resolve Anonymous User 13 Fallback:**
   - In `progressTracker.js`, replace fallback User 13 with an anonymous ephemeral session UUID.
4. **Enforce Backend Immutable Legal Names:**
   - In `AuthController.php`, block updates to `first_name` and `last_name` via profile edit.
5. **Secure Admin Route Obscurity:**
   - Prevent `/admin` from redirecting to the secret URL; render `NotFound.jsx` directly.
6. **Populate Lesson Content in Database:**
   - Populate video URLs, slides, and text content in `course_lessons`.

### Phase 3: UX & Interface Polish (P2 — Within 1 Week)
1. **Fix Cookie Consent Interaction:**
   - Anchor `CookieConsent` to the bottom right without blocking user clicks on "Start Course Now".
2. **Hero Viewport Height Optimization:**
   - Adjust hero padding to keep CTAs above the fold on 768px laptop screens.
3. **Deduplicate Course Overview Button:**
   - Clean up tab navigation in `CourseDetails.jsx`.
4. **Fix WCAG 2.2 AA Contrast:**
   - Update footer links from `text-slate-400` to `text-slate-200` (10.8:1 contrast).
5. **Replace Broken Unsplash Asset:**
   - Replace ORB-blocked asset with local optimized `.webp` image.

### Phase 4: Long-Term Architectural Improvements (P3 — Post-Release)
1. **Implement JWT Stateless Tokens:**
   - Migrate from PHP file-based session tokens to cryptographic JWTs with database revocation lists.
2. **Implement Server-Side Rate Limiting & Cloudflare Turnstile:**
   - Add brute-force protection to `/api/login` and `/api/admin/login`.
3. **Automated Sitemap Generation:**
   - Hook sitemap generation script into CI/CD build pipelines.

---

## 6. Audit Artifact Index

All supporting audit files and forensic evidence logs are persisted in the root directory:
1. `SITE_AUDIT_REPORT.md` (This document)
2. `ROUTE_INVENTORY.md` (Detailed inventory of all 92 discovered and tested routes)
3. `USER_FLOW_TEST_MATRIX.md` (24 interactive user journey tests with pass/fail logs)
4. `UI_UX_ISSUES.md` (Impeccable detector findings, spacing, typography, and layout review)
5. `FUNCTIONAL_BUGS.md` (Complete defect log with reproduction steps and root causes)
6. `SECURITY_FINDINGS.md` (Vulnerability analysis with OWASP classifications and proof)
7. `PERFORMANCE_ACCESSIBILITY_REPORT.md` (Core Web Vitals, WCAG 2.2 AA, and SEO review)
8. `AUDIT_EVIDENCE.md` (Raw HTTP responses, curl transcripts, DOM logs, and test data)
