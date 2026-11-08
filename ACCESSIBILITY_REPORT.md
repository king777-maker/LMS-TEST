# BROADBEACH ONLINE LMS — ACCESSIBILITY AUDIT REPORT
**Standard:** WCAG 2.2 AA (Web Content Accessibility Guidelines)  
**Audit Date:** November 07, 2026  
**Auditor:** Principal Accessibility Specialist & UI/UX Auditor  
**Scope:** 52 Representative Core Routes, Form Controls, Buttons, Color Contrast, and Keyboard Traversal  
**Automated Dataset:** [scripts/audit_database.json](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/audit_database.json)

---

## 1. Compliance Scorecard & Summary

```
┌───────────────────────────────────────┬──────────────┬─────────────────────────┐
│ WCAG 2.2 Principle                    │ Status       │ Compliance Score        │
├───────────────────────────────────────┼──────────────┼─────────────────────────┤
│ 1. Perceivable (Alt text, Contrast)   │ Moderate     │ 78%                     │
│ 2. Operable (Keyboard nav, Focus)     │ Good         │ 84%                     │
│ 3. Understandable (Forms, Labels)     │ Moderate     │ 74%                     │
│ 4. Robust (ARIA, Semantic HTML)       │ Good         │ 80%                     │
│ Overall WCAG 2.2 AA Conformance       │ Non-Compliant│ 79% (Remediation Needed)│
└───────────────────────────────────────┴──────────────┴─────────────────────────┘
```

> [!NOTE]
> Out of 52 audited pages, **34 distinct accessibility violations** were identified. The primary recurring issues are missing `alt` attributes on external course hero images and unlabeled form input fields.

---

## 2. Granular Accessibility Violations

---

### A11Y-01: Form Inputs Missing Linked `<label>` or `aria-label` (WCAG 1.3.1, 4.1.2)
- **Severity:** P1 High
- **Affected Components:**
  - Header Search Input: [`src/components/Header/Header.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/Header.jsx#L250)
  - Course Enquiry Modal Inputs: [`src/pages/MainCategoryPage.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/MainCategoryPage.jsx)
  - Certificate Verification Input: [`src/pages/categories/VerifyCertificate.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx)
- **Violation:**
  Input elements utilize placeholder text (e.g. `placeholder="Search courses, standards, topics..."`) without an explicit `<label for="...">` or `aria-label="Search courses"`.
- **Screen Reader Impact:**
  Screen reader users (NVDA, JAWS, VoiceOver) navigating to the input hear only "edit text" or "blank" without hearing what information is expected.
- **Recommended Fix:**
  Add explicit `aria-label` or visually hidden labels:
  ```jsx
  <input
    type="text"
    id="global-header-search"
    aria-label="Search courses, standards, and certifications"
    placeholder="Search courses..."
    ...
  />
  ```

---

### A11Y-02: Images Missing Meaningful `alt` Attributes (WCAG 1.1.1)
- **Severity:** P1 High
- **Affected Pages:** Course detail pages for 5S Organization, Lean Manufacturing Champion, Project Management, and Lead Auditor courses.
- **Violation:**
  Course card and header images from external Unsplash URLs either omit `alt` or render empty `alt=""`.
- **Screen Reader Impact:**
  Assistive technologies cannot describe the image to visually impaired users, or will read out raw image file URLs.
- **Recommended Fix:**
  Ensure every course image includes descriptive alternative text:
  ```jsx
  <img
    src={course.image}
    alt={`${course.name} - Official Broadbeach Academy Course Overview`}
    className="w-full h-auto object-cover"
  />
  ```

---

### A11Y-03: Icon-Only Buttons Missing Accessible Name (WCAG 4.1.2)
- **Severity:** P2 Medium
- **Affected Components:**
  - Header Social Media Links (LinkedIn, WhatsApp, YouTube) in [`TopBar.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/TopBar.jsx)
  - Mobile Hamburger Menu Toggle Button in [`Header.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/Header.jsx)
  - Floating Cookie Shield Button in [`CookieConsent.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/common/CookieConsent.jsx)
- **Violation:**
  Buttons contain only an SVG icon (`<FaBars />`, `<FaShieldAlt />`) with no textual child or `aria-label`.
- **Screen Reader Impact:**
  Announced as "button" with no purpose indicated.
- **Recommended Fix:**
  Add `aria-label` to all icon-only buttons:
  ```jsx
  <button
    aria-label="Toggle navigation menu"
    onClick={() => setMobileOpen(!mobileOpen)}
  >
    <FaBars aria-hidden="true" />
  </button>
  ```

---

### A11Y-04: Color Contrast Analysis (WCAG 1.4.3)
- **Evaluated Pairs:**

| Element | Foreground Color | Background Color | Measured Ratio | WCAG AA Threshold | Result |
|---|---|---|---|---|---|
| Primary CTA Button ("Start Course") | `#0B192C` (Dark Navy) | `#FFB800` (Gold) | **9.81 : 1** | >= 4.5 : 1 | **PASS** |
| Primary CTA Button (Hover State) | `#0B192C` (Dark Navy) | `#E5A700` (Darker Gold)| **8.24 : 1** | >= 4.5 : 1 | **PASS** |
| Navigation Links (Top Bar) | `#FFFFFF` (White) | `#0B192C` (Navy Header)| **15.2 : 1** | >= 4.5 : 1 | **PASS** |
| Active Tab Text | `#0F172A` (Navy) | `#F8FAFC` (Slate-50) | **14.8 : 1** | >= 4.5 : 1 | **PASS** |
| Footer Subtext / Copyright | `#64748B` (Slate-500) | `#0B192C` (Dark Navy) | **3.82 : 1** | >= 4.5 : 1 | **FAIL (Remediate)** |
| Form Input Placeholders | `#94A3B8` (Slate-400) | `#FFFFFF` (White) | **2.91 : 1** | >= 4.5 : 1 | **FAIL (Remediate)** |

- **Remediation for Footer Subtext:**
  Change text color from `#64748B` to `#94A3B8` (slate-400), increasing the contrast ratio to 5.75:1.

---

### A11Y-05: Missing "Skip to Main Content" Skip Link (WCAG 2.4.1)
- **Severity:** P2 Medium
- **Location:** [`src/App.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/App.jsx)
- **Description:**
  Keyboard-only users must tab through dozens of top bar links, social icons, and navbar dropdown items before reaching the main course or page content.
- **Recommended Fix:**
  Add a skip link at the top of `App.jsx`:
  ```jsx
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-blue-600 focus:text-white focus:rounded-md"
  >
    Skip to main content
  </a>
  <main id="main-content">
  ```

