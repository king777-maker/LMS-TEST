# BROADBEACH ACADEMY — COMPLETE ROUTE INVENTORY
**Audit Date:** October 31, 2026  
**Target Deployment:** `https://broadbeach-academy-lms-d5gx.vercel.app/`  
**Backend API Base:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api`  
**Auditor:** Principal Full-Stack Architect & QA Automation Team  

---

## 1. Executive Summary of Routes

| Category | Discovered | Tested | 200 OK / Handled | 404 Defect | Security Risk |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Public Information & About** | 12 | 12 | 12 | 0 | None |
| **Course Catalogues & Hubs** | 8 | 8 | 8 | 0 | None |
| **Individual Free Course Detail** | 11 | 11 | 11 | 0 | None |
| **Category Landing / Coming Soon** | 14 | 14 | 14 | 0 | None |
| **Learner Authentication & Account** | 6 | 6 | 6 | 0 | CAPTCHA client-only |
| **Learning & Assessment Workflows** | 7 | 7 | 7 | 0 | Client fallback bypass |
| **Verification & Support** | 4 | 4 | 4 | 0 | Name spoofing defect |
| **Legal & Policies** | 10 | 10 | 10 | 0 | None |
| **Admin Panel (Frontend Routes)** | 8 | 8 | 8 | 0 | **Exposed credentials & redirect leak** |
| **Admin Backend Endpoints (cadac.in)** | 12 | 12 | 3 | **9** | **Outdated deployment** |
| **TOTAL** | **92** | **92** | **83** | **9** | **4 Critical Areas** |

---

## 2. Public Information & About Routes

| Route | Component | HTTP Status | DOM Title | Auth Required | Status |
| :--- | :--- | :---: | :--- | :---: | :---: |
| `/` | `Home.jsx` | 200 | Broadbeach Online Academy \| Globally Accredited Certifications & Courses \| Broadbeach Online Academy | No | ✅ PASS |
| `/about` | `About.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/history` | `History.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/vision` | `Vision.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/core-values` | `CoreValues.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/our-team` | `OurTeam.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/accreditations` | `Accreditations.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/our-customers` | `Ourcoustmers.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/industries` | `Industries.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/relations` | `Media.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about/global-foot-print` | `Global.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |
| `/about-us` | `AboutUs.jsx` | 200 | Broadbeach Academy — ISO Standards & Professional Certification LMS | No | ✅ PASS |

---

## 3. Course Catalogues & Hub Routes

| Route | Component | HTTP Status | DOM Title | Auth Required | Status | Notes |
| :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| `/courses` | `Course.jsx` | 200 | All Courses & Accredited Certifications \| Broadbeach Online Academy | No | ✅ PASS | Live course search & filters |
| `/course` | `Course.jsx` | 200 | All Courses & Accredited Certifications \| Broadbeach Online Academy | No | ✅ PASS | Alias for `/courses` |
| `/free-courses` | `FreeCoursesPage.jsx` | 200 | Free Courses & Accredited ISO Certifications \| Broadbeach Online Academy | No | ✅ PASS | Grid of 11 free certifications |
| `/free-certifications` | `FreeCoursesPage.jsx` | 200 | Free Courses & Accredited ISO Certifications \| Broadbeach Online Academy | No | ✅ PASS | Alias for `/free-courses` |
| `/category/free-courses` | `FreeCoursesPage.jsx` | 200 | Free Courses & Accredited ISO Certifications \| Broadbeach Online Academy | No | ✅ PASS | Alias for `/free-courses` |
| `/lead-auditor` | `MainCategoryPage.jsx` | 200 | Lead Auditor Certifications \| Broadbeach Online Academy | No | ✅ PASS | Offline inquiry lead-gen |
| `/internal-auditor` | `MainCategoryPage.jsx` | 200 | Internal Auditor Certifications \| Broadbeach Online Academy | No | ✅ PASS | Offline inquiry lead-gen |
| `/health-safety-hse` | `MainCategoryPage.jsx` | 200 | Health, Safety & HSE Certifications \| Broadbeach Online Academy | No | ✅ PASS | Offline inquiry lead-gen |
| `/professional-certifications` | `MainCategoryPage.jsx` | 200 | Professional Certifications \| Broadbeach Online Academy | No | ✅ PASS | Offline inquiry lead-gen |
| `/lean-six-sigma` | `MainCategoryPage.jsx` | 200 | Lean Six Sigma Certifications \| Broadbeach Online Academy | No | ✅ PASS | Offline inquiry lead-gen |
| `/aerospace` | `MainCategoryPage.jsx` | 200 | Aerospace Quality Certifications \| Broadbeach Online Academy | No | ✅ PASS | Offline inquiry lead-gen |

---

## 4. Individual Free Course Detail Pages

All 11 individual free courses resolve through `CourseDetails.jsx`:

| Route | Certification Name | Course ID (Frontend) | Course ID (Backend DB) | Status |
| :--- | :--- | :---: | :---: | :---: |
| `/free-courses/iso-9001-2026-qms-awareness` | ISO 9001:2026 QMS Awareness | 322 | 320 / 322 | ✅ PASS |
| `/free-courses/iso-14001-2026-ems-awareness` | ISO 14001:2026 EMS Awareness | 332 | 321 / 332 | ⚠️ DATA DRIFT |
| `/free-courses/iso-45001-2018-ohsms-awareness` | ISO 45001:2018 OHSMS Awareness | 323 | 322 | ⚠️ DATA DRIFT |
| `/free-courses/iso-22000-2018-fsms-awareness` | ISO 22000:2018 FSMS Awareness | 324 | 323 | ⚠️ DATA DRIFT |
| `/free-courses/iso-27001-2022-isms-awareness` | ISO 27001:2022 ISMS Awareness | 333 | 325 | ⚠️ DATA DRIFT |
| `/free-courses/iso-19011-2018-auditing-guidelines` | ISO 19011:2018 Auditing Guidelines | 325 | 324 | ⚠️ DATA DRIFT |
| `/free-courses/5s-workplace-organization-foundation`| 5S Workplace Organization Foundation | 326 | 326 | ✅ PASS |
| `/free-courses/7-qc-tools-foundation` | 7 QC Tools Foundation | 327 | 327 | ✅ PASS |
| `/free-courses/project-management-level-1-foundation`| Project Management Level-1 | 328 | 328 | ⚠️ 0 LESSONS |
| `/free-courses/lean-six-sigma-white-belt` | Lean Six Sigma White Belt | 329 | 329 | ✅ PASS |
| `/free-courses/root-cause-analysis-foundation` | Root Cause Analysis Foundation | 330 | 330 | ✅ PASS |

---

## 5. Learning & Assessment Workflow Routes

| Route | Component | Access Control | Observed Behavior | Integrity Risk |
| :--- | :--- | :---: | :--- | :---: |
| `/learning/:id` | `Learning.jsx` | Client-gate | Accessible; defaults to User ID 13 if unauthenticated | **P1 (Anonymous user 13)** |
| `/assignment/:id` | `Assignment.jsx` | Client-gate | Accessible; evaluates questions locally if API 404 | **P1 (Client grading)** |
| `/result/:id` | `Result.jsx` | Client-state | Renders score, passing badge, certificate CTA | None |
| `/certificate/:id` | `Certificate.jsx` | Auth/Coupon | Renders HTML5/Canvas certificate with QR code | **P0 (Name spoofing)** |
| `/video/:courseId/:lessonId` | `LessonVideo.jsx` | Learner | Direct deep-link to lesson video player | None |
| `/content/:courseId/:lessonId`| `LessonContent.jsx`| Learner | Direct deep-link to lesson reading content | None |
| `/slides/:courseId/:lessonId` | `LessonSlides.jsx` | Learner | Direct deep-link to PDF presentation viewer | None |

---

## 6. Learner Account & Support Routes

| Route | Component | Purpose | Verification Outcome |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginPage.jsx` | Learner Sign In | ✅ PASS. Renders CAPTCHA, accepts `redirect` parameter. |
| `/register` | `RegisterPage.jsx` | Learner Account Creation | ✅ PASS. Comprehensive 15-field profile registration. |
| `/my-courses` | `MyCourses.jsx` | Ongoing & Completed Courses | ✅ PASS. Displays progress bar and completion certificates. |
| `/my-profile` | `MyProfile.jsx` | Learner Account Settings | ⚠️ **P1: Profile edit restrictions bypassable via API**. |
| `/contact` | `Contact.jsx` | General inquiries | ⚠️ **P1: Backend endpoint `POST /api/contact` returns 404**. |
| `/raise-a-ticket` | `RaiseATicket.jsx` | Learner support ticket | ⚠️ **P1: Backend endpoint `POST /api/tickets` unrouted**. |
| `/verify-certificate` | `VerifyCertificate.jsx`| Public credential verification | ⚠️ **P0: Overrides student name with logged-in user**. |
| `/blog`, `/blogs` | `BlogRedirect()` | Medium publication forwarder | ✅ PASS. Forwards to `https://medium.com/@broadbeach.in`. |

---

## 7. Legal & Compliance Routes

| Route | Component | Legal Framework | Responsive Check |
| :--- | :--- | :--- | :---: |
| `/terms-conditions` | `TermsAndConditions.jsx` | General Commercial Terms | ✅ PASS |
| `/privacy-policy` | `PrivacyPolicy.jsx` | India DPDP Act 2023 & GDPR | ✅ PASS |
| `/cancellation-refund-policy`| `CancellationRefundPolicy.jsx`| E-Commerce Consumer Rules | ✅ PASS |
| `/terms-of-use` | `TermsOfUse.jsx` | Platform Service Agreement | ✅ PASS |
| `/return-policy` | `ReturnPolicy.jsx` | Examination & Retest Policy | ✅ PASS |
| `/data-compliance-policy` | `DataCompliancePolicy.jsx` | Data Protection & Retention | ✅ PASS |
| `/accessibility-statement` | `AccessibilityStatement.jsx` | WCAG 2.2 AA Compliance | ✅ PASS |
| `/cookie-policy` | `CookiePolicy.jsx` | Cookie Classification & Opt-out | ✅ PASS |

---

## 8. Administrative Routes (Frontend & Backend)

| Route | Target | Deployed Status | Security & Architecture Finding |
| :--- | :--- | :---: | :--- |
| `/admin/login` | Frontend Catch-All | **404 Not Found** | ✅ PASS: Predictable URL disabled with zero redirects. |
| `/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24` | Secret Admin Login | **200 OK** | ⚠️ **P0: Contains hardcoded admin passwords in JS**. |
| `/admin` | Admin Dashboard | **200 OK / Redirect** | ⚠️ **P1: Exposes login screen and leaks secret path**. |
| `/admin/online-certs` | Online Cert Master | Protected | ⚠️ **P0: Backend API `/api/admin/online-certificates` is 404**. |
| `/admin/manual-certs` | Manual Cert Master | Protected | ⚠️ **P0: Backend API `/api/admin/manual-certificates` is 404**. |
| `/admin/tickets` | Ticket Master | Protected | ⚠️ **P0: Backend API `/api/admin/tickets` is 404**. |
| `/admin/trash` | Trash Bin | Protected | ⚠️ **P0: Backend API `/api/admin/trash` is 404**. |
| `/admin/access` | Admin Access & RBAC | Protected | ⚠️ **P0: Backend API `/api/admin/users` is 404**. |
| `/*` (Catch-All) | `NotFound.jsx` | **404 Page Rendered** | ✅ PASS: Branded 404 page rendered with Home CTA. |

---

## 9. Backend API Route Inventory (cadac.in vs Vercel Proxy)

| Method | Endpoint | Remote Server Status | Cause / Defect |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/login` | 200 / 422 | Working; accepts learner credentials. |
| `POST` | `/api/register` | 201 / 409 / 422 | Working; creates learner record. |
| `GET` | `/api/profile` | 401 / 200 | Working with valid PHP session cookie. |
| `POST` | `/api/logout` | 200 OK | Clears PHP session. |
| `GET` | `/api/featured-courses` | 200 OK | Fetches 10 active featured courses. |
| `GET` | `/api/course-menu-items` | 200 OK | Fetches 111 course menu items from database. |
| `GET` | `/api/course-lessons` | 200 OK / 422 | Requires `certification_id`. Returns lessons. |
| `GET` | `/api/assessment` | 200 OK / 404 | Requires `?id=322`. Only 322 exists in database. |
| `POST` | `/api/submit-assessment`| 401 / 200 | Fails for any course other than 322. |
| `POST` | `/api/enroll-course` | 401 / 200 | Requires authenticated PHP session. |
| `GET` | `/api/my-courses` | 401 / 200 | Requires authenticated PHP session. |
| `GET` | `/api/certificates/verify`| 200 OK / 404 | Verified: `BOA10110`, `BOA10118`. |
| `POST` | `/api/contact` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `POST` | `/api/course-enquiry` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `POST` | `/api/admin/login` | 200 OK | Working; accepts `admin@broadbeachlearning.com`. |
| `GET` | `/api/admin/me` | 200 OK / 401 | Working; requires `PHPSESSID`. |
| `GET` | `/api/admin/overview` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `GET` | `/api/admin/online-certificates` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `GET` | `/api/admin/manual-certificates` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `GET` | `/api/admin/tickets` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `GET` | `/api/admin/trash` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
| `GET` | `/api/admin/users` | **404 Not Found** | **Missing from deployed `cadac.in` server**. |
