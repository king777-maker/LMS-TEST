# BROADBEACH ONLINE LMS — USER FLOW TEST MATRIX
**Audit Date:** November 07, 2026  
**Auditor:** Principal QA Engineer & User Journey Analyst  
**Automated Run Logs:** [scripts/functional_flow_results.json](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/functional_flow_results.json)

---

## 1. Master Journey Matrix Overview

| Flow # | User Journey Flow | Preconditions | Steps Executed | Pass/Fail | Observations & Bottlenecks |
|---|---|---|---|---|---|
| **FLOW-01** | Visitor Discovery & Search | Public user on Homepage | Type query in header search, inspect dropdown, click course | **PASS** | 99 matches found for "ISO 9001"; Enter key requires click |
| **FLOW-02** | Free Course Onboarding & Player | User on Course Detail | Click "Start Course" CTA, mount `/learning/322` | **PASS** | Video loads correctly in preview iframe; 5 chapters visible |
| **FLOW-03** | Assessment Taking & Grading | Complete video | Navigate to `/assignment/322`, answer 10 questions | **PASS** | Score calculated; >= 70% threshold unlocks result certificate |
| **FLOW-04** | Certificate Generation & Verification | Pass assessment | Generate canvas certificate, copy serial, test verification | **WARN** | Canvas renders properly; `/verify-certificate` fails on sample serial |
| **FLOW-05** | Learner Auth & Profile Portal | Guest visitor | Register new account, log in, view `/my-courses` | **PASS** (Local) / **FAIL** (Prod) | Fails in prod due to CADAC CORS block |
| **FLOW-06** | Support Ticket Lifecycle | Learner has issue | Open `/raise-a-ticket`, fill 8 inputs, click submit | **PASS** (Local) / **FAIL** (Prod) | CADAC remote backend returns 404 Route Not Found |
| **FLOW-07** | Paid Category Enquiry | Visitor on Lead Auditor | Click "Enroll Now", fill enquiry modal, submit | **PASS** (Local) / **FAIL** (Prod) | CADAC remote returns 404 for `/api/course-enquiry` |
| **FLOW-08** | Admin Governance & Moderation | Admin credentials | Access `/admin/login`, review Online Cert Master & Tickets | **PASS** | Secret admin path functions; local middleware serves records |

---

## 2. Granular Step-by-Step Flow Execution Logs

---

### FLOW-01: Visitor Discovery & Search
- **Actor:** Prospective Learner / Auditor
- **Starting Point:** `http://localhost:3000/`
- **Execution Steps:**
  1. Locate the header search input field.
  2. Input keyword: `"ISO 9001"`.
  3. Observe suggestion popover dropdown.
  4. Press keyboard Enter.
  5. Click on the first dropdown item (*"ISO 9001:2026 QMS"*).
- **Test Findings:**
  - Dropdown populated with 99 relevant matching results across free courses, lead auditor modules, and internal auditor courses.
  - Clicking an item successfully pushes `/courses/iso-9001-2026-qms-awareness` to React Router history.
  - Minor improvement needed: hitting Enter directly should navigate to the top result automatically.

---

### FLOW-02: Free Course Onboarding & Video Curriculum Player
- **Actor:** Enrolled Student
- **Starting Point:** `http://localhost:3000/courses/iso-9001-2026-qms-awareness`
- **Execution Steps:**
  1. Validate course hero displays Title, Rating, Level, Language, Access Badge.
  2. Confirm Clock Icon / Duration chip is completely absent.
  3. Click `#FFB800` "Start Course" button.
  4. Verify transition to `/learning/322`.
  5. Inspect embedded video iframe (`https://drive.google.com/file/d/1pUO72EJ_DekcT4rEnCZ0239G7s8cQ9g0/preview`).
  6. Verify chapters 1 through 5 in curriculum sidebar.
- **Test Findings:**
  - Transition executes smoothly (< 300ms).
  - Video player initializes with authentic Google Drive video asset.
  - Chapters 1, 2, and 3 render lesson syllabus; Chapter 4 displays Assessment link; Chapter 5 displays Certificate download link.

---

### FLOW-03: Assessment Taking & Passing Threshold (70%)
- **Actor:** Student Completing Course
- **Starting Point:** `http://localhost:3000/assignment/322`
- **Execution Steps:**
  1. Assessment engine loads 10 authentic MCQs extracted from course syllabus.
  2. Select radio button answer for each question.
  3. Click "Submit Assessment".
  4. Validate scoring engine:
     - If score < 7 (70%): User directed to `/result/322` with "Failed — Try Again" and Retake button.
     - If score >= 7: User directed to `/result/322` with "Passed with Distinction" and "Proceed to Certificate" CTA.
- **Test Findings:**
  - 10 MCQs render cleanly with radio button options and accessible labels.
  - Score calculations correctly enforce the 70% passing threshold.

---

### FLOW-04: Certificate Issuance & Public Credential Verification
- **Actor:** Certified Graduate / Verifying Employer
- **Starting Point:** `http://localhost:3000/certificate/322`
- **Execution Steps:**
  1. Mount `/certificate/322` after passing score.
  2. Inspect dynamic HTML5 Canvas certificate generator:
     - Student Name (e.g. "Rajesh Kumar Sharma")
     - Course Title ("ISO 9001:2026 QMS Certified Professional")
     - Issue Date and Expiry Date
     - Unique Certificate ID (e.g. `BOA-9001-2026-XXXX`)
     - Dynamic QR code pointing to `https://broadbeachonline.com/verify-certificate?serial=...`
  3. Navigate to `/verify-certificate` and paste the generated certificate ID.
- **Test Findings:**
  - Canvas certificate draws accurately with anti-aliased typography and official seals.
  - QR code resolves correctly.
  - Warning: If verifying sample certificate serial `BB-ISO-9001-2026`, `/verify-certificate` returns 404 because `sampleCertificates` is missing from `VerifyCertificate.jsx`'s fallback list.

---

### FLOW-05: Support Ticket Lifecycle
- **Actor:** Learner Needing Technical Assistance
- **Starting Point:** `http://localhost:3000/raise-a-ticket`
- **Execution Steps:**
  1. Fill form:
     - Name: `"Michael Chen"`
     - Email: `"michael.chen@example.com"`
     - Category: `"Technical Support"`
     - Priority: `"Medium"`
     - Subject: `"Assessment quiz question 4 clarity"`
     - Message: `"Please explain question 4 regarding clause 9.2 internal audit."`
  2. Click "Submit Ticket to Ticket Master".
  3. Validate API response.
  4. Verify ticket appearance in Admin Panel (`/admin/tickets`).
- **Test Findings:**
  - Localhost (Dev Proxy): HTTP 201 Created. Ticket appears in `TicketMaster.jsx` immediately.
  - Production (`broadbeachonline.com` -> `cadac.in`): Fails with HTTP 404 / CORS error because `cadac.in` has not deployed the ticket endpoints.
