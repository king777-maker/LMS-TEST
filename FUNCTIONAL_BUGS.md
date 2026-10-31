# BROADBEACH ACADEMY — FUNCTIONAL DEFECTS & BUGS REPORT
**Audit Date:** October 31, 2026  
**Auditor:** QA Automation & Full-Stack Systems Engineer  
**Classification System:** Defect ID, Route, Component, Severity, Observed Behavior, Expected Behavior, Steps to Reproduce, Recommended Fix  

---

## 1. Summary of Functional Defects

```
Critical (P0):    2
High (P1):        5
Medium (P2):      4
Low (P3):         2
TOTAL DEFECTS:   13
```

---

## 2. High & Critical Functional Defects

### BUG-01: Admin Panel 5 Modules Completely Unrouted on Production Backend
- **Issue ID:** `BUG-ADM-01`
- **Page / Route:** `/admin/*` (`/api/admin/overview`, `/api/admin/online-certificates`, etc.)
- **Severity:** 🔴 **CRITICAL (P0)**
- **Category:** Backend Architecture & Routing Outage
- **Observed Behavior:**
  When loading the Admin Overview, Online Cert Master, Manual Cert Master, Ticket Master, Trash Bin, or Admin Access, every API call fails with:
  ```json
  HTTP/1.1 404 Not Found
  {"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"/api/admin/overview"}
  ```
- **Expected Behavior:**
  Endpoints should return live database metrics, certificate rosters, support tickets, and audit logs.
- **Reproduction Steps:**
  1. Open terminal and run: `curl -i "https://broadbeach-academy-lms-d5gx.vercel.app/api/admin/overview"`
  2. Observe HTTP 404 with body `"Admin API route not found."`
- **Root Cause:**
  `broadbeach-backend/app/routes/admin.php` lines 1414–1480 were written locally but never deployed to `cadac.in`. The deployed server runs an older revision of `admin.php`.
- **Recommended Fix:**
  Deploy the updated `admin.php` and `AdminModulesController.php` to `cadac.in` and execute the schema migration `2026_10_24_admin_panel_schema.sql`.

---

### BUG-02: Public Contact & Course Enquiry Form Submissions Return 404
- **Issue ID:** `BUG-PUB-01`
- **Page / Route:** `/contact`, `/lead-auditor`, `/internal-auditor` (`/api/contact`, `/api/course-enquiry`)
- **Severity:** 🔴 **CRITICAL (P0)**
- **Category:** Public Lead Generation & Business Operations
- **Observed Behavior:**
  When a prospective student submits a message on `/contact` or fills out a course enquiry form on Lead Auditor / Internal Auditor pages, the request fails with:
  ```json
  HTTP/1.1 404 Not Found
  {"success":false,"message":"API route not found.","method":"POST","path":"/api/contact"}
  ```
- **Expected Behavior:**
  Contact messages and enrollment inquiries should be saved to the database and trigger administrative notification emails.
- **Reproduction Steps:**
  1. Navigate to `https://broadbeach-academy-lms-d5gx.vercel.app/contact`
  2. Fill out Name, Email, Phone, and Message.
  3. Click "Send Message". Form encounters network error.
- **Root Cause:**
  The routes `POST /api/contact` and `POST /api/course-enquiry` defined in local `api.php` lines 240–253 were not uploaded to `cadac.in`.
- **Recommended Fix:**
  Upload updated `api.php`, `ContactController.php`, and `EnrollmentEnquiryController.php` to `cadac.in`.

---

### BUG-03: Missing Assessments for ISO 14001 and All Non-ISO 9001 Courses in Database
- **Issue ID:** `BUG-LRN-01`
- **Page / Route:** `/assignment/:id` (`/api/assessment?id=332`)
- **Severity:** 🟠 **HIGH (P1)**
- **Category:** Learning Experience & Examination Integrity
- **Observed Behavior:**
  In the production MySQL database, only course 322 (ISO 9001) has an assessment record. For course 332 (ISO 14001) or any other course:
  ```json
  GET /api/assessment?id=332 -> {"success":false,"message":"Assessment not found."}
  ```
  The frontend catches this error and falls back to client-side catalog evaluation.
- **Expected Behavior:**
  Every accredited course must have a corresponding assessment record in the backend `assessments` and `assessment_questions` tables.
- **Reproduction Steps:**
  1. Navigate to `https://broadbeach-academy-lms-d5gx.vercel.app/assignment/332`
  2. Inspect browser network console; observe failed 404 API request for assessment 332.
- **Recommended Fix:**
  Seed all 11 course assessment questions from `assessmentCatalog.js` into MySQL tables `assessments` and `assessment_questions`.

---

### BUG-04: Client-Side Certificate Generation Bypass (Unrecorded Credentials)
- **Issue ID:** `BUG-CRT-01`
- **Page / Route:** `/assignment/:id` -> `evaluateLocalGrading()`
- **Severity:** 🟠 **HIGH (P1)**
- **Category:** Accreditation & Credential Integrity
- **Observed Behavior:**
  When taking an assessment where the API is unavailable or returns 404 (e.g. ISO 14001), the frontend generates an arbitrary certificate number (`BBA-332-M12X...`) and stores it exclusively in the browser's `localStorage`. This certificate is **never written to the backend MySQL database**. If an employer attempts to verify this certificate on `/verify-certificate`, it returns 404 "Certificate not found".
- **Expected Behavior:**
  Certificates must only be issued by the backend server after verifying that the student achieved the passing threshold.
- **Recommended Fix:**
  Remove client-side certificate generation. Ensure all assessment submissions are posted to `/api/submit-assessment` and recorded in `certificates` table.

---

### BUG-05: Zero Lesson Content in MySQL Database for All Courses
- **Issue ID:** `BUG-LRN-02`
- **Page / Route:** `/learning/:id` (`/api/course-lessons?certification_id=...`)
- **Severity:** 🟠 **HIGH (P1)**
- **Category:** Content Delivery & Database Completeness
- **Observed Behavior:**
  Across all courses in the database, lessons contain `null` for `video_url`, `lesson_content`, `slides_url`, `pdf_url`, and `thumbnail_url`. The frontend works around this by hardcoding sample video URLs in `Learning.jsx` and static PDF paths.
- **Expected Behavior:**
  Lesson videos, slide deck URLs, and reading content should be populated in `course_lessons` table in the database.
- **Recommended Fix:**
  Populate lesson content, slide links, and video URLs into the database table `course_lessons`.

---

### BUG-06: Project Management Level-1 Course Has 0 Lessons in Database
- **Issue ID:** `BUG-LRN-03`
- **Page / Route:** `/learning/328` (`/free-courses/project-management-level-1-foundation`)
- **Severity:** 🟠 **HIGH (P1)**
- **Category:** Course Availability
- **Observed Behavior:**
  Querying `/api/course-lessons?certification_id=328` returns `{"success":true,"message":"Lessons fetched successfully.","data":[]}` (empty array). The course has zero syllabus items in the database.
- **Expected Behavior:**
  Should have 5 structured lesson modules.
- **Recommended Fix:**
  Insert the curriculum lessons for Certification ID 328 into `course_lessons`.

---

### BUG-07: Course Lessons Parameter Name Discrepancy (`course_id` vs `certification_id`)
- **Issue ID:** `BUG-API-01`
- **Page / Route:** `/api/course-lessons`
- **Severity:** 🟠 **HIGH (P1)**
- **Category:** API Contract & Parameter Validation
- **Observed Behavior:**
  If an API client sends `GET /api/course-lessons?course_id=322`, the backend responds:
  ```json
  HTTP/1.1 422 Unprocessable Entity
  {"success":false,"message":"Certification ID is required.","data":[]}
  ```
  The endpoint strictly requires `certification_id`.
- **Expected Behavior:**
  Backend should accept either `certification_id` or `course_id` for backwards compatibility.
- **Recommended Fix:**
  In `broadbeach-backend/app/Controllers/LessonController.php`, check:
  `$id = (int) ($_GET["certification_id"] ?? $_GET["course_id"] ?? $_GET["id"] ?? 0);`

---

## 3. Medium & Low Severity Functional Defects

### BUG-08: Cookie Consent Dialog Intercepts User Clicks on "Start Course Now"
- **Issue ID:** `BUG-UI-01`
- **Page / Route:** All public course pages
- **Severity:** 🟡 **MEDIUM (P2)**
- **Category:** User Experience & Interaction Blockers
- **Observed Behavior:**
  `CookieConsent.jsx` sets a 1200ms timer before popping up. If a visitor clicks "Start Course Now" within this window, the banner pops up and intercepts focus/clicks, making the button appear broken.
- **Recommended Fix:**
  Render cookie consent as an inline non-blocking bottom banner (`pointer-events-none` container with `pointer-events-auto` card), or initialize immediately without delay.

### BUG-09: Redundant Duplicate "Course Overview" Tab on Course Details Page
- **Issue ID:** `BUG-UI-02`
- **Page / Route:** `/free-courses/:slug` (`CourseDetails.jsx`)
- **Severity:** 🟡 **MEDIUM (P2)**
- **Category:** UI Inconsistency
- **Observed Behavior:**
  Two identical "Course Overview" tab buttons are rendered adjacent to each other in the DOM.
- **Recommended Fix:**
  Deduplicate tab navigation array in `CourseDetails.jsx`.

### BUG-10: Broken External Unsplash Asset (ORB / 404 Blocked)
- **Issue ID:** `BUG-AST-01`
- **Page / Route:** `/` (Hero / Featured Courses)
- **Severity:** 🟡 **MEDIUM (P2)**
- **Category:** Asset Loading Failure
- **Observed Behavior:**
  Browser console logs network failure:
  `GET https://images.unsplash.com/photo-1542204625-de293a2f8ff2?w=300 - net::ERR_BLOCKED_BY_ORB`
- **Recommended Fix:**
  Replace dead Unsplash URL with a local optimized webp image in `public/assets/`.

### BUG-11: Support Ticket Submission Endpoint 404
- **Issue ID:** `BUG-TCK-01`
- **Page / Route:** `/raise-a-ticket` (`/api/tickets`)
- **Severity:** 🟡 **MEDIUM (P2)**
- **Category:** Learner Support System
- **Observed Behavior:**
  Submitting a support ticket fails with 404 because `TicketMaster` endpoints are missing from production backend.
- **Recommended Fix:**
  Deploy `TicketController` and route `POST /api/tickets` to `cadac.in`.

### BUG-12: Double Title Branding Suffix on Homepage
- **Issue ID:** `BUG-SEO-01`
- **Page / Route:** `/` (`Home.jsx` & `index.html`)
- **Severity:** 🟢 **LOW (P3)**
- **Category:** SEO & Document Title
- **Observed Behavior:**
  DOM Title: `Broadbeach Online Academy | Globally Accredited Certifications & Courses | Broadbeach Online Academy`
- **Recommended Fix:**
  Remove duplicate suffix in `index.html` or `SEO.jsx`.

### BUG-13: Incomplete Course ID Mapping in `progressTracker.js`
- **Issue ID:** `BUG-MAP-01`
- **Page / Route:** `src/utils/progressTracker.js`
- **Severity:** 🟢 **LOW (P3)**
- **Category:** Code Maintainability
- **Observed Behavior:**
  `CANONICAL_TO_INDEX_MAP` uses custom numeric indices (1..11) that do not match the database primary keys (320..330).
- **Recommended Fix:**
  Standardize on official database `certification_id` primary keys across all modules.
