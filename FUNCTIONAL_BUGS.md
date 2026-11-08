# BROADBEACH ONLINE LMS — FUNCTIONAL BUGS REPORT
**Audit Date:** November 07, 2026  
**Auditor:** Principal QA Engineer & Senior Full-Stack Developer  
**Automated Flow Results:** [scripts/functional_flow_results.json](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/functional_flow_results.json)  
**Deep-Dive API Results:** [scripts/api_deep_dive_results.json](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/api_deep_dive_results.json)

---

## 1. Summary of Functional Findings

| Bug ID | Severity | Feature / Module | Title | Production Impact |
|---|---|---|---|---|
| **[BUG-P0-01](#bug-p0-01)** | **P0 Critical** | Routing / Host | GitHub Pages SPA Deep Linking 404 on Refresh | Critical (Breaks 100% direct visits) |
| **[BUG-P0-02](#bug-p0-02)** | **P0 Critical** | Support Tickets | Ticket Submission API Route Not Found (404) | Critical (Learner tickets blocked) |
| **[BUG-P1-01](#bug-p1-01)** | **P1 High** | Verification | Sample Certificate Serial Fails on `/verify-certificate` | High (Sample certs unverified) |
| **[BUG-P1-02](#bug-p1-02)** | **P1 High** | Authentication | Unauthenticated Profile 401 Desync with `localStorage` | High (Ghost active sessions) |
| **[BUG-P2-01](#bug-p2-01)** | **P2 Medium** | Search Engine | Enter Key on Header Search Does Not Route to Results | Medium (Search UX degradation) |
| **[BUG-P2-02](#bug-p2-02)** | **P2 Medium** | LMS Player | Chapter Locking Client-Side State Vulnerability | Medium (Bypass chapter guard) |

---

## 2. Granular Defect Reports

---

### BUG-P0-01: GitHub Pages SPA Deep Linking 404 on Direct Navigation
- **Severity:** P0 Critical
- **Module:** Deployment & Web Server
- **Exact URL:** Any client-side route, e.g.:
  - `https://broadbeachonline.com/free-courses`
  - `https://broadbeachonline.com/courses/iso-9001-2026-qms-awareness`
  - `https://broadbeachonline.com/verify-certificate`
- **Reproduction Steps:**
  1. Open a new incognito browser tab.
  2. Paste `https://broadbeachonline.com/verify-certificate` and press Enter.
  3. Or navigate to `https://broadbeachonline.com/`, click on "Free Courses", then press F5 (refresh).
- **Expected Result:** The page should load the React Single Page Application and render the requested view.
- **Actual Result:** The browser displays a raw GitHub 404 page ("404 There isn't a GitHub Pages site here").
- **Root Cause Analysis:**
  GitHub Pages is a static HTTP web server. When a request for `/verify-certificate` arrives, it looks for `/verify-certificate/index.html` or `/verify-certificate.html`. Since Vite outputs a single `index.html` in the build root, GitHub Pages returns HTTP 404. Without a fallback `public/404.html` containing an SPA redirect script (such as `rafgraph/spa-github-pages`), direct navigation fails completely.
- **Recommended Fix:**
  1. Create [`public/404.html`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/public/404.html) copying the SPA router handler that transforms the path into query parameters (e.g. `/?p=/verify-certificate`) and loads `index.html`.
  2. Add path recovery script in [`index.html`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/index.html).

---

### BUG-P0-02: Support Ticket Submission & Retrieval API Route Not Found (404)
- **Severity:** P0 Critical
- **Module:** Support Tickets Portal
- **Exact URL:** `/raise-a-ticket` and `/my-profile` (Support Tickets Tab)
- **API Endpoint:**
  - `POST https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/tickets`
  - `GET https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/tickets/my?email=...`
- **Reproduction Steps:**
  1. Navigate to `https://broadbeachonline.com/raise-a-ticket`.
  2. Fill out Name, Email, Category, Subject, and Message.
  3. Click "Submit Ticket to Ticket Master".
- **Expected Result:** Ticket is persisted in database with HTTP 201 Created and ticket reference ID returned.
- **Actual Result:** Form displays red error banner: `"API route not found."` Console logs HTTP 404 from CADAC.
- **Network Trace Evidence:**
  ```http
  POST https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/tickets HTTP/1.1
  Host: cadac.in
  Origin: https://broadbeachonline.com
  Accept: application/json
  Content-Type: application/json

  HTTP/1.1 404 Not Found
  Content-Type: application/json; charset=UTF-8

  {
    "success": false,
    "message": "API route not found.",
    "method": "POST",
    "path": "/api/tickets"
  }
  ```
- **Root Cause Analysis:**
  The frontend was correctly implemented to call `/api/tickets` and `/api/tickets/my`. However, the Apache PHP backend hosted on `cadac.in` has not yet had the updated router script and ticket tables deployed. The deployment package is assembled in [`scripts/build_cadac_sync_package.mjs`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/build_cadac_sync_package.mjs) but requires deployment onto the production server.
- **Recommended Fix:**
  Upload the generated CADAC synchronization package containing `routes.php`, `TicketController.php`, `cors.php`, and database migration `tickets_table.sql` to the production server.

---

### BUG-P1-01: Sample Certificate Serial Fails on Official Verification Page
- **Severity:** P1 High
- **Module:** Certificate Verification
- **Exact URL:** [`http://localhost:3000/verify-certificate`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx)
- **Reproduction Steps:**
  1. Note the sample certificate advertised on the website: `BB-ISO-9001-2026` (Rajesh Kumar Sharma).
  2. Navigate to `/verify-certificate`.
  3. Enter `BB-ISO-9001-2026` into the verification input and click "Verify Certificate".
- **Expected Result:**
  The credential details (Student Name: Rajesh Kumar Sharma, Course: ISO 9001 Lead Auditor, Status: Active & Verified) should display with an official verification badge.
- **Actual Result:**
  The page displays: `"Certificate not found. Please check the certificate ID and try again."`
- **Root Cause Analysis:**
  In [`src/data/coursesData.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/data/coursesData.js#L820), `sampleCertificates` contains `BB-ISO-9001-2026`. This object is used in [`CertificateAccess.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/CertificateAccess.jsx) (`/certificate-access/:id`), but is **completely omitted** from [`src/pages/categories/VerifyCertificate.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx#L148) in `findLocalCertificate()`. Because the remote DB also lacks this sample record, the verification API returns 404.
- **Recommended Fix:**
  Import `sampleCertificates` into `VerifyCertificate.jsx` and include it as an authoritative fallback in `findLocalCertificate()`.

---

### BUG-P1-02: Unauthenticated Profile Check 401 Desynchronization with `localStorage`
- **Severity:** P1 High
- **Module:** Authentication & Session Management
- **Exact URL:** `/my-profile`, `/my-courses`
- **Reproduction Steps:**
  1. Open a browser where a previous login created an item in `localStorage.getItem("bb_user")` but the backend session/token expired or was revoked.
  2. Refresh `/my-profile`.
  3. Check console logs.
- **Expected Result:** The app should clear the expired token from `localStorage` and gracefully redirect the user to `/login`.
- **Actual Result:**
  Console throws: `Backend profile check unauthenticated or unreachable; retaining active local session: Request failed with status code 401`.
  The UI displays the learner dashboard as if logged in, but any authenticated API call fails.
- **Recommended Fix:**
  In [`src/context/AuthContext.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/context/AuthContext.jsx), when `/api/profile` returns a definitive 401 Unauthorized (as opposed to network timeout 503), clear the invalid local session (`localStorage.removeItem("bb_user_token")`) and prompt the user to re-authenticate.

---

### BUG-P2-01: Enter Key on Header Search Does Not Route to Results
- **Severity:** P2 Medium
- **Module:** Header Search Engine
- **Exact URL:** [`http://localhost:3000/`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/Header.jsx#L250)
- **Reproduction Steps:**
  1. Click the header search input.
  2. Type `"Quality Management"`.
  3. Hit Enter without clicking a dropdown item.
- **Expected Result:** User is navigated to a search results listing page or the best-matched course.
- **Actual Result:** The page URL remains unchanged (`http://localhost:3000/`) and the dropdown stays open.
- **Recommended Fix:**
  Attach an `onKeyDown` handler to the search input: on `e.key === 'Enter'`, navigate to the top matched course slug or `/courses?search=...`.

---

### BUG-P2-02: LMS Video Chapter Locking Client-Side State Vulnerability
- **Severity:** P2 Medium
- **Module:** LMS Video Curriculum Player
- **Exact URL:** [`http://localhost:3000/learning/322`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Learning.jsx)
- **Reproduction Steps:**
  1. Open Course 1 player.
  2. In browser devtools console, run: `localStorage.setItem("unlocked_chapter_322_5", "true")`.
  3. Refresh the page.
- **Expected Result:** Chapter 5 (Certificate) remains locked until backend confirms video completion and assessment passing score (>= 70%).
- **Actual Result:** The client-side UI immediately enables the Chapter 5 download button.
- **Recommended Fix:**
  Ensure certificate generation always validates the assessment passing record against the backend database before delivering signed certificate credentials.
