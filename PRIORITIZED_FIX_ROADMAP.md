# BROADBEACH ONLINE LMS — PRIORITIZED FIX ROADMAP
**Roadmap Date:** November 07, 2026  
**Auditor & Architect:** Principal Full-Stack Engineer & Release Manager  
**Scope:** Actionable, Phased Engineering Implementation Plan for All Identified Audit Findings

---

## 1. Roadmap Phasing Strategy

```
┌──────────────────────────────────────────────────────────┬──────────────┬───────────────┐
│ Milestone Phase                                          │ Priority     │ Target Window │
├──────────────────────────────────────────────────────────┼──────────────┼───────────────┤
│ Phase 1: Production Infrastructure & API Blockers        │ P0 Critical  │ Immediate     │
│ Phase 2: High-Impact Functional & Accessibility Fixes    │ P1 High      │ Sprint 1      │
│ Phase 3: Content Consistency & Security Hardening        │ P2 Medium    │ Sprint 2      │
│ Phase 4: SEO Rich Data & UX Polish                       │ P3 Low       │ Sprint 3      │
└──────────────────────────────────────────────────────────┴──────────────┴───────────────┘
```

---

## 2. Phase 1: Production Infrastructure & API Blockers (P0 Critical)

### Task 1.1: Deploy SPA Fallback `404.html` for GitHub Pages
- **Issue:** [BUG-P0-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/FUNCTIONAL_BUGS.md#bug-p0-01)
- **Target File:** [`public/404.html`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/public/404.html)
- **Action:** Create `public/404.html` with GitHub Pages SPA routing script. When a user requests `/free-courses` or `/verify-certificate`, the 404 handler converts the URL to a query parameter and redirects to `index.html`, where React Router takes over.
- **Estimated Effort:** 1 Hour
- **Verification:** Run `curl -I https://broadbeachonline.com/free-courses` — must return 200 via SPA redirect.

### Task 1.2: Whitelist `broadbeachonline.com` in CADAC Backend CORS
- **Issue:** [API-P0-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/API_BACKEND_AUDIT.md#api-p0-01)
- **Target File:** `cors.php` on `https://cadac.in`
- **Action:** Add `https://broadbeachonline.com` and `https://www.broadbeachonline.com` to `$allowedOrigins` in `cors.php` and emit `Access-Control-Allow-Origin: $origin` and `Access-Control-Allow-Credentials: true`.
- **Estimated Effort:** 1 Hour
- **Verification:** Run `OPTIONS` probe from origin `https://broadbeachonline.com` and confirm 204 response with matching `Access-Control-Allow-Origin`.

### Task 1.3: Deploy Support Ticket & Course Enquiry Handlers to CADAC
- **Issue:** [API-P0-02](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/API_BACKEND_AUDIT.md#api-p0-02)
- **Target Package:** Assembled in [`scripts/build_cadac_sync_package.mjs`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/build_cadac_sync_package.mjs)
- **Action:** Upload `routes.php`, `TicketController.php`, and database migration `tickets_table.sql` to CADAC server.
- **Estimated Effort:** 2 Hours
- **Verification:** Execute `POST /api/tickets` and verify HTTP 201 Created with persisted ticket ID.

### Task 1.4: Generate & Publish `robots.txt` and `sitemap.xml`
- **Issue:** [SEO-P0-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/SEO_PERFORMANCE_REPORT.md#seo-p0-01)
- **Target Files:** [`public/robots.txt`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/public/robots.txt) & [`public/sitemap.xml`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/public/sitemap.xml)
- **Action:** Run `node scripts/generate-sitemap.cjs` to emit `public/sitemap.xml` containing all 340 testable routes; create `public/robots.txt` pointing to sitemap.
- **Estimated Effort:** 1 Hour
- **Verification:** Verify `https://broadbeachonline.com/robots.txt` and `/sitemap.xml` return 200 OK with valid XML.

---

## 3. Phase 2: High-Impact Functional & Accessibility Fixes (P1 High)

### Task 2.1: Integrate `sampleCertificates` into `/verify-certificate`
- **Issue:** [BUG-P1-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/FUNCTIONAL_BUGS.md#bug-p1-01)
- **Target File:** [`src/pages/categories/VerifyCertificate.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx#L148)
- **Action:** Import `sampleCertificates` from `coursesData.js` and add lookup in `findLocalCertificate()`.
- **Estimated Effort:** 1.5 Hours
- **Verification:** Verify `BB-ISO-9001-2026` returns "Active & Verified" for student "Rajesh Kumar Sharma".

### Task 2.2: Add Missing `aria-label` Attributes to Form Inputs & Icon Buttons
- **Issue:** [A11Y-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/ACCESSIBILITY_REPORT.md#a11y-01) & [A11Y-03](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/ACCESSIBILITY_REPORT.md#a11y-03)
- **Target Files:** [`Header.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/Header.jsx), [`TopBar.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/TopBar.jsx), [`CookieConsent.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/common/CookieConsent.jsx)
- **Action:** Add descriptive `aria-label` attributes to global search input, social links, mobile hamburger button, and floating cookie shield widget.
- **Estimated Effort:** 2 Hours
- **Verification:** Run `node scripts/run_forensic_audit_suite.mjs` — confirm unlabeled button and input violations drop to 0.

### Task 2.3: Add Missing Image `alt` Attributes Across Course Catalogs
- **Issue:** [A11Y-02](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/ACCESSIBILITY_REPORT.md#a11y-02)
- **Target File:** [`CourseDetails.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/courses/CourseDetails.jsx), [`MainCategoryPage.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/MainCategoryPage.jsx)
- **Action:** Ensure every `<img />` tag has a descriptive `alt` attribute.
- **Estimated Effort:** 2 Hours
- **Verification:** Automated audit suite confirms 0 broken or alt-missing images.

### Task 2.4: Enforce Canonical `<link rel="canonical">` Tags
- **Issue:** [SEO-P1-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/SEO_PERFORMANCE_REPORT.md#seo-p1-01)
- **Target File:** [`src/components/common/SEO.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/common/SEO.jsx)
- **Action:** Auto-generate canonical URL on all routes matching canonical path.
- **Estimated Effort:** 1.5 Hours
- **Verification:** Automated audit suite confirms canonical tags present on all 52 test routes.

---

## 4. Phase 3: Content Consistency & Security Hardening (P2 Medium)

### Task 3.1: Clarify ISO Standard Years (2015 vs 2026) in Course Descriptions
- **Issue:** [CONTENT-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/CONTENT_CONSISTENCY_REPORT.md#2-iso-standard-revision-year-analysis)
- **Target File:** [`src/data/freeCoursesData.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/data/freeCoursesData.js)
- **Action:** Add explanatory subtitle: *"Aligned with the upcoming ISO 9001:2026 revision draft & active ISO 9001:2015 principles."*
- **Estimated Effort:** 3 Hours

### Task 3.2: Implement Enter Key Navigation on Header Search
- **Issue:** [BUG-P2-01](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/FUNCTIONAL_BUGS.md#bug-p2-01)
- **Target File:** [`Header.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/Header.jsx)
- **Action:** Attach `onKeyDown` to search input to automatically navigate to the first matching course on Enter.
- **Estimated Effort:** 1 Hour

### Task 3.3: Protect Admin Fallback `/admin/login` Route in Production
- **Issue:** [SEC-03](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/SECURITY_FINDINGS.md#sec-03-fallback-public-adminlogin-route-bypasses-secret-admin-path-p2-medium)
- **Target File:** [`src/App.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/App.jsx#L527)
- **Action:** Only mount public `/admin/login` during development (`import.meta.env.DEV`). Require secret path in production.
- **Estimated Effort:** 1 Hour

### Task 3.4: Increase Footer Subtext Contrast
- **Issue:** [A11Y-04](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/ACCESSIBILITY_REPORT.md#a11y-04)
- **Target File:** [`Footer.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Footer/Footer.jsx)
- **Action:** Upgrade text color from `#64748B` to `#94A3B8` (slate-400), lifting contrast to 5.8:1.
- **Estimated Effort:** 0.5 Hours

---

## 5. Phase 4: SEO Rich Data & UX Polish (P3 Low)

### Task 4.1: Inject Schema.org Course Structured Data
- **Target File:** [`SEO.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/common/SEO.jsx)
- **Action:** Inject Course Schema JSON-LD for rich snippets in Google SERPs.
- **Estimated Effort:** 2 Hours

### Task 4.2: Enforce Card Image Aspect Ratios in Large Catalogs
- **Target File:** [`MainCategoryPage.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/MainCategoryPage.jsx)
- **Action:** Apply `aspect-video w-full object-cover` on card images to ensure uniform card heights.
- **Estimated Effort:** 1 Hour

---

## 6. Regression Testing & Verification Strategy

After each phase, execute the automated regression test suite:
```powershell
# 1. Run route extraction & inventory check
node scripts/audit_extract_routes.mjs

# 2. Run multi-viewport layout, accessibility, and SEO audit
node scripts/run_forensic_audit_suite.mjs

# 3. Run functional user journey tests
node scripts/audit_functional_flows.mjs

# 4. Run API deep-dive test against localhost and CADAC
node scripts/audit_api_deep_dive.mjs
```
Ensuring all tests return **0 horizontal overflows**, **0 accessibility regressions**, and **valid HTTP 200/201 responses**.

