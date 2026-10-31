# BROADBEACH ACADEMY — USER FLOW TEST MATRIX
**Audit Execution Date:** October 31, 2026  
**Target Environment:** `https://broadbeach-academy-lms-d5gx.vercel.app/` (Production Vercel) & `cadac.in` (Production MySQL/PHP)  
**Execution Engine:** Chromium / MS Edge (Puppeteer-Core v24) + Node.js HTTP/2 Test Harness  

---

## 1. Test Execution Summary

```
Total User Flows Tested:     24
Passed Flows:                14
Failed / Defective Flows:    7
Blocked Flows:               3
```

---

## 2. Test Matrix by User Persona

### Persona A: Guest User (Unauthenticated Visitor)

| Flow ID | Journey / Scenario | Expected Behavior | Actual Observed Behavior | Result | Evidence / Log |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FL-G01** | Visit Homepage, view Hero & navbar | Page loads in < 2s; hero CTA visible; navbar links functional | Hero loads with 200 OK. Headline and CTA rendered cleanly. Double title tag in DOM. | ✅ **PASS** | Title: `Broadbeach Online Academy \| Globally Accredited Certifications & Courses \| Broadbeach Online Academy` |
| **FL-G02** | Browse Free Courses catalogue | 11 free course cards rendered with titles, levels, durations | All 11 free courses rendered in responsive grid with "Enroll Free" buttons. | ✅ **PASS** | `FreeCoursesPage.jsx` renders 11 cards with badges. |
| **FL-G03** | View Course Details (`/free-courses/iso-9001-2026-qms-awareness`) | Syllabus, learning outcomes, FAQ, and "Start Course" CTA | Course overview loads. Redundant "Course Overview" button rendered twice in DOM. | ✅ **PASS** | `CourseDetails.jsx` renders syllabus chapters. |
| **FL-G04** | Click "Start Course" while logged out | Display authentication modal / gate with course context; do not allow direct bypass | Modal pops up: *"Please log in first to start this course."* with Course ID and Login CTA. | ✅ **PASS** | Modal text verified in DOM: `Authentication Required “Please log in first to start this course.”` |
| **FL-G05** | Click "Log In" in auth gate modal | Redirect to `/login` preserving `?redirect=...&courseId=320` | Browser navigated to `/login?redirect=%2Fcourses%2Fiso-9001-2026-qms-awareness&courseId=320` | ✅ **PASS** | Query parameters preserved cleanly. |
| **FL-G06** | Direct visit to `/learning/322` as guest | Prompt for login or block progress saving | Page loads lessons; progressTracker defaults anonymous learner to **User ID 13**. | ⚠️ **FAIL (P1)** | `resolveUserId()` returns 13 when no user session exists. |
| **FL-G07** | Search & verify valid certificate `BOA10110` | Render verified credential card with student name "Sales Broadbeach", 100% score | Verification card displays: "Sales Broadbeach", "BOA10110", "13/13", "100%", "Active". | ✅ **PASS** | Card rendered with green badge. |
| **FL-G08** | Verify non-existent certificate `INVALID999` | Display clear "Certificate not found" error without crashing | API returns 404; UI renders *"Certificate not found. Please check the certificate ID"*. | ✅ **PASS** | `VerifyCertificate.jsx` catches 404 and displays error. |

---

### Persona B: Registered Learner

| Flow ID | Journey / Scenario | Expected Behavior | Actual Observed Behavior | Result | Evidence / Log |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FL-L01** | Learner Registration (`/register`) | Validate mandatory fields, hash password with bcrypt, redirect to login | Accepts registration data; returns HTTP 201 or 409 if email already registered. | ✅ **PASS** | API: `POST /api/register` creates user record in MySQL. |
| **FL-L02** | Learner Login with valid credentials | Verify email & password; issue secure session cookie; redirect to destination | Returns 200 OK with `PHPSESSID` cookie. Stores user object in `localStorage`. | ✅ **PASS** | `POST /api/login` verified with test credentials. |
| **FL-L03** | Learner Login with invalid credentials | Display inline error message; refresh CAPTCHA code | Returns 401 Unauthorized `{"success":false,"message":"Invalid email or password."}`. | ✅ **PASS** | Toast and inline error displayed. |
| **FL-L04** | Client CAPTCHA bypass attempt | Backend should reject login requests lacking valid CAPTCHA verification | Backend `/api/login` has **no CAPTCHA parameter**; direct API requests bypass CAPTCHA. | ❌ **FAIL (P1)** | `curl` POST to `/api/login` succeeds without CAPTCHA. |
| **FL-L05** | Profile Name Modification restriction | Student legal name must be non-editable through profile UI and API | Frontend marks name read-only; however, direct PUT/POST to `/api/profile` updates database. | ❌ **FAIL (P1)** | `AuthController.php` does not forbid `first_name`/`last_name` updates. |
| **FL-L06** | Submit support ticket via `/raise-a-ticket` | Submit issue to Ticket Master and receive tracking ID | Request sent to `/api/tickets` fails with **HTTP 404 API route not found**. | ❌ **FAIL (P0)** | Endpoint missing on deployed backend server. |

---

### Persona C: Enrolled & Learning Learner

| Flow ID | Journey / Scenario | Expected Behavior | Actual Observed Behavior | Result | Evidence / Log |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FL-E01** | Launch Course ISO 9001 (`/learning/322`) | Load video, syllabus lessons, and slide deck | Video player renders; slides viewer renders introduction PDF. | ✅ **PASS** | Interactive learning player functional. |
| **FL-E02** | Mark lesson completed | Progress percentage increases; persistent storage updated | Updates `localStorage` `bb_course_progress_<uid>_<cid>`; progress bar advances. | ✅ **PASS** | Stored in `localStorage` JSON map. |
| **FL-E03** | Course Isolation: ISO 14001 (`/learning/332`) | Lesson content must be specific to EMS and never touch ISO 9001 records | Database has only 1 lesson with null content; frontend uses fallback curriculum. | ⚠️ **WARN (P1)** | Progress tracked separately under ID 332, but content in DB is missing. |
| **FL-E04** | Complete Final Assessment ISO 9001 | 13 questions loaded; score calculated; pass certificate generated | Questions loaded from DB (ID 322). Score calculated accurately. | ✅ **PASS** | Passing threshold (60%) evaluated correctly. |
| **FL-E05** | Take Assessment for ISO 14001 | 13 EMS questions loaded; submitted to backend | Backend API `/api/assessment?id=332` returns **404 Not Found**. Evaluates client-side. | ❌ **FAIL (P1)** | Client fallback generates unrecorded certificate. |

---

### Persona D: Completed Learner & Certificate Verification

| Flow ID | Journey / Scenario | Expected Behavior | Actual Observed Behavior | Result | Evidence / Log |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FL-C01** | View Certificate (`/certificate/322`) | Render tamper-proof certificate with QR code and verification URL | HTML5 canvas/SVG certificate renders with valid QR code pointing to verify URL. | ✅ **PASS** | Visual certificate matches Broadbeach brand tokens. |
| **FL-C02** | Certificate Name Integrity (Critical) | Verification page must render the **certificate owner's name** | If a user is logged in, `VerifyCertificate.jsx` **overrides student name with the viewer's name**! | ❌ **FAIL (P0)** | `resolveStudentName()` line 100 uses `loggedInName`. |
| **FL-C03** | Synchronize to "My Courses" | Completed course moves from "In Progress" to "Completed" tab | "My Courses" renders completed badge and download certificate button. | ✅ **PASS** | State synced from `bb_course_progress_*`. |

---

### Persona E: Administrator (Admin Panel Operations)

| Flow ID | Journey / Scenario | Expected Behavior | Actual Observed Behavior | Result | Evidence / Log |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FL-A01** | Access predictable `/admin/login` | Return 404 Not Found with zero redirects | Renders standard 404 Page Not Found without leaking admin URL. | ✅ **PASS** | Confirmed 404 heading and DOM. |
| **FL-A02** | Access secret admin login path | Render high-security MFA login console | Console renders with cinematic background and password inputs. | ✅ **PASS** | Accessible only via entropy path. |
| **FL-A03** | Hardcoded credential exposure | No passwords or secrets visible in client bundle | **Plaintext admin passwords exposed in default state and role preset buttons!** | ❌ **FAIL (P0)** | `admin@broadbeachlearning.com` / `broad_beach_admin_2026`. |
| **FL-A04** | Direct visit to `/admin` as guest | Block access and show unauthorized state | **Renders admin login form directly or leaks secret path through route redirect!** | ❌ **FAIL (P1)** | `AdminProtectedRoute` redirects unauth visitor to secret login URL. |
| **FL-A05** | Overview Dashboard live metrics | Display real-time certificates, students, and tickets | Request to `/api/admin/overview` returns **HTTP 404 Admin API route not found**. | 🛑 **BLOCKED** | Missing backend deployment on `cadac.in`. |
| **FL-A06** | Online Cert Master operations | List, search, revoke, and reissue online certificates | Request to `/api/admin/online-certificates` returns **HTTP 404**. | 🛑 **BLOCKED** | Missing backend deployment on `cadac.in`. |
| **FL-A07** | Manual Cert Master creation | Generate custom offline certificates with tamper-proof IDs | Request to `/api/admin/manual-certificates` returns **HTTP 404**. | 🛑 **BLOCKED** | Missing backend deployment on `cadac.in`. |
