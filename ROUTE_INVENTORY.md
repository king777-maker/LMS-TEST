# BROADBEACH ONLINE LMS — ROUTE INVENTORY
**Audit Date:** November 07, 2026  
**Total Routes Cataloged:** 340 Unique Testable Routes  
**Source Code:** [src/App.jsx](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/App.jsx), [src/data/coursesData.js](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/data/coursesData.js), [src/data/freeCoursesData.js](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/data/freeCoursesData.js)

---

## 1. Route Architecture Overview

Broadbeach Online LMS utilizes a hybrid single-page routing architecture powered by `react-router-dom` v6. Routes are grouped into:
1. **Core Navigation & Static Content** (Homepage, Search, Verification, Contact)
2. **Authoritative Free Courses** (11 Courses with canonical `/courses/:slug` and legacy `/courses/free-courses/:slug` aliases)
3. **Primary Dynamic Course Categories** (Lead Auditor, Internal Auditor, Health & Safety, Professional Certifications)
4. **Secondary / Launching Categories** (Lean Six Sigma, Aerospace, Environment, Food Safety, Information Security)
5. **Learner Authentication & Portal** (Login, Register, My Courses, Profile)
6. **LMS Interactive Engine** (Learning Player, Quiz Assessment, Results, Certificate Issuance)
7. **Legal & Compliance Policies** (Terms, Privacy, Refund, Accessibility, Cookie Policy)
8. **Administrative Governance Panel** (Dashboard, Online Cert Master, Manual Cert Master, Ticket Master, Trash, Access Control)

---

## 2. Complete Categorized Route Matrix

### A. Core Navigation & Global Pages
| Path | Component | Auth Required | Title / Header | Production HTTP Status |
|---|---|---|---|---|
| `/` | [`Home`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Home.jsx) | Public | Broadbeach Academy — ISO Standards LMS | 200 OK |
| `/courses` | [`Course`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Course.jsx) | Public | Explore Our Accredited Courses | 404 (SPA Refresh) |
| `/free-courses` | [`FreeCoursesPage`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/FreeCoursesPage.jsx) | Public | Free Online ISO Certification Courses | 404 (SPA Refresh) |
| `/contact` | [`Contact`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Contact.jsx) | Public | Contact Us — Broadbeach Academy | 404 (SPA Refresh) |
| `/raise-a-ticket` | [`RaiseATicket`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/RaiseATicket.jsx) | Public | Raise a Support Ticket | 404 (SPA Refresh) |
| `/verify-certificate` | [`VerifyCertificate`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx) | Public | Verify Certificate Authenticity | 404 (SPA Refresh) |
| `/certificate-access` | [`VerifyCertificate`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx) | Public | Verify Certificate Authenticity | 404 (SPA Refresh) |

---

### B. Authoritative Free Courses (All 11 Courses)
Each Free Course is accessible via two distinct routes: canonical `/courses/:slug` and legacy alias `/courses/free-courses/:slug`. Both mount [`CourseDetails`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/courses/CourseDetails.jsx) and link to the LMS video player.

| # | Course Title | Canonical Route | Code | Database ID | LMS Player Target |
|---|---|---|---|---|---|
| 1 | ISO 9001:2026 QMS | `/courses/iso-9001-2026-qms-awareness` | ISO 9001 QMS | 322 | `/learning/322` |
| 2 | ISO14001: 2026 EMS | `/courses/iso-14001-2026-ems-awareness` | ISO 14001 EMS | 332 | `/learning/332` |
| 3 | ISO 45001:2018 OHSMS | `/courses/iso-45001-2018-ohsms-awareness` | ISO 45001 OHSMS | 323 | `/learning/323` |
| 4 | ISO 22000:2018 FSMS | `/courses/iso-22000-2018-fsms-awareness` | ISO 22000 FSMS | 324 | `/learning/324` |
| 5 | ISO 19011:2026 | `/courses/iso-19011-2026-awareness` | ISO 19011 AUD | 325 | `/learning/325` |
| 6 | ISO 27001:2022 ISMS | `/courses/iso-27001-2022-isms-awareness` | ISO 27001 ISMS | 333 | `/learning/333` |
| 7 | Lean Manufacturing Champion | `/courses/lean-manufacturing-champion` | LEAN-MFG | 326 | `/learning/326` |
| 8 | 5S Workplace Organization | `/courses/5s-workplace-organization` | 5S-ORG | 327 | `/learning/327` |
| 9 | Project Management Level-1 | `/courses/project-management-level-1` | PM-LVL1 | 328 | `/learning/328` |
| 10 | Lean Six Sigma White belt | `/courses/lean-six-sigma-white-belt` | LSS-WB | 329 | `/learning/329` |
| 11 | Root Cause Analysis | `/courses/root-cause-analysis` | RCA-FND | 330 | `/learning/330` |

---

### C. Main Categories & Category Course Landing Routes
Mounts [`MainCategoryPage`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/MainCategoryPage.jsx) for category view, and [`CourseDetails`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/courses/CourseDetails.jsx) for course view.

| Category Name | Category Route | Course URL Pattern | Total Courses | Enrolment Action |
|---|---|---|---|---|
| Lead Auditor | `/lead-auditor` | `/lead-auditor/:slug` | 14 Courses | Modal Course Enquiry |
| Internal Auditor | `/internal-auditor` | `/internal-auditor/:slug` | 10 Courses | Modal Course Enquiry |
| Health & Safety (HSE) | `/health-safety-hse` | `/health-safety-hse/:slug` | 9 Courses | Modal Course Enquiry |
| Professional Certifications | `/professional-certifications`| `/professional-certifications/:slug` | 179 Courses | Modal Course Enquiry |
| Lean Six Sigma | `/lean-six-sigma` | `/lean-six-sigma/:slug` | In Catalog | Modal Course Enquiry |
| Aerospace | `/aerospace` | `/aerospace/:slug` | In Catalog | Modal Course Enquiry |
| Environment | `/environment` | `/environment/:slug` | In Catalog | Modal Course Enquiry |
| Food Safety | `/food-safety` | `/food-safety/:slug` | In Catalog | Modal Course Enquiry |
| Information Security | `/information-security` | `/information-security/:slug` | In Catalog | Modal Course Enquiry |
| Management Certifications | `/management-certifications` | `/management-certifications/:slug` | In Catalog | Modal Course Enquiry |

---

### D. Learner Authentication & Dashboard Routes
| Path | Component | Protected | Description |
|---|---|---|---|
| `/login` | [`LoginPage`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/LoginPage.jsx) | No | Student / Learner Authentication |
| `/register` | [`RegisterPage`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/RegisterPage.jsx) | No | New Student Registration |
| `/my-courses` | [`MyCourses`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/MyCourses.jsx) | Conditional | Learner's Enrolled Courses & Progress |
| `/my-profile` | [`MyProfile`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/MyProfile.jsx) | Conditional | Student Profile & Support Tickets Portal |
| `/profile` | Redirect to `/my-profile` | No | Legacy Alias |

---

### E. Interactive LMS Execution Engine
| Route Pattern | Component | Function |
|---|---|---|
| `/learning/:id` | [`Learning`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Learning.jsx) | Video curriculum player with 5-chapter tracking |
| `/assignment/:id` | [`Assignment`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Assignment.jsx) | 10-question MCQ assessment with 70% passing threshold |
| `/result/:id` | [`Result`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Result.jsx) | Exam grade, score calculation, pass/fail decision |
| `/certificate/:id` | [`Certificate`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Certificate.jsx) | Dynamic canvas certificate rendering & PDF generation |
| `/certificate-access/:id` | [`CertificateAccess`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/CertificateAccess.jsx) | Public verification view of verified certificates |

---

### F. Company, About & Institutional Pages
| Path | Component | Description |
|---|---|---|
| `/about-us` | [`AboutUs`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/AboutUs.jsx) | Overview of Broadbeach Academy |
| `/about/vision` | [`Vision`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Vision.jsx) | Mission, Vision and Quality Objectives |
| `/about/core-values` | [`CoreValues`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/CoreValues.jsx) | Organizational Ethics & Values |
| `/about/team` | [`OurTeam`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/OurTeam.jsx) | Faculty, Lead Auditors & Advisory Board |
| `/about/history` | [`History`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/History.jsx) | Institutional Milestones |
| `/about/industries` | [`Industries`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Industries.jsx) | Sectors Served (Oil & Gas, Healthcare, Aerospace) |
| `/about/relations` | [`Media`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Media.jsx) | Press Releases & Media Kit |
| `/about/global-foot-print` | [`Global`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/Global.jsx) | International Presence & Accreditations |
| `/accreditations-approvals` | [`AccreditationsApprovals`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/AccreditationsApprovals.jsx) | Accreditation Body Information |

---

### G. Legal & Compliance Policies
| Path | Component | Content Focus |
|---|---|---|
| `/terms-conditions` | [`TermsAndConditions`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/TermsAndConditions.jsx) | Learner Terms of Service |
| `/privacy-policy` | [`PrivacyPolicy`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/PrivacyPolicy.jsx) | GDPR, DPDP & Personal Data Handling |
| `/cancellation-refund-policy` | [`CancellationRefundPolicy`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/CancellationRefundPolicy.jsx) | Refund Conditions for Paid Certifications |
| `/terms-of-use` | [`TermsOfUse`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/TermsOfUse.jsx) | Website Usage Rules |
| `/return-policy` | [`ReturnPolicy`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/ReturnPolicy.jsx) | Materials & Exam Retake Policies |
| `/data-compliance-policy` | [`DataCompliancePolicy`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/DataCompliancePolicy.jsx) | Information Security & Compliance Framework |
| `/accessibility-statement` | [`AccessibilityStatement`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/AccessibilityStatement.jsx) | WCAG 2.2 AA Conformance Statement |
| `/cookie-policy` | [`CookiePolicy`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/CookiePolicy.jsx) | Cookie Types, Consent & Management |

---

### H. Administrative Panel (RBAC Protected)
| Route Path | Component | Permitted Roles | Function |
|---|---|---|---|
| `/admin/login` | [`AdminLogin`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/AdminLogin.jsx) | All | Administrator Authentication |
| `/admin/dashboard` | [`AdminDashboard`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/AdminDashboard.jsx) | super_admin, admin | Platform Analytics & Metrics |
| `/admin/online-certs` | [`OnlineCertMaster`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/OnlineCertMaster.jsx) | super_admin, admin, cert_manager, read_only | Online Certificate Registry |
| `/admin/manual-certs` | [`ManualCertMaster`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/ManualCertMaster.jsx) | super_admin, admin, cert_manager | Manually Issued Institutional Certs |
| `/admin/tickets` | [`TicketMaster`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/TicketMaster.jsx) | super_admin, admin, support_agent | Support Ticket Management & Reply |
| `/admin/trash` | [`TrashBin`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/TrashBin.jsx) | super_admin, admin | Soft-deleted Records & Recovery |
| `/admin/access` | [`AdminAccess`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/AdminAccess.jsx) | super_admin | Role Management & Security Logs |

---

## 3. Routing Findings & Defect Analysis

### Finding RI-01: GitHub Pages Direct Navigation 404 (P0 Critical)
- **Reproduction:** Open browser and visit `https://broadbeachonline.com/courses/iso-9001-2026-qms-awareness` directly or press F5 on that page.
- **Result:** GitHub Pages 404 page ("File not found").
- **Root Cause:** GitHub Pages is a static file host. Without a fallback `public/404.html` reproducing the SPA bundle or redirect script, all client-side routes fail when requested directly from the web server.

### Finding RI-02: Hard Medium Redirection for `/blog` and `/blogs` (P2 Medium)
- **Observed Behavior:** Direct navigation to `/blog` mounts `BlogRedirect` component in `App.jsx`, triggering `window.location.replace("https://medium.com/@broadbeach.in")`.
- **Recommendation:** Provide an internal blog hub or open Medium in an external tab (`target="_blank" rel="noopener noreferrer"`), avoiding an unexpected full redirect that loses LMS context.
