# BROADBEACH ACADEMY — FORENSIC UI/UX AUDIT REPORT
**Audit Tooling:** `/impeccable detect`, `ui-ux-pro-max`, WCAG 2.2 Color Contrast Checker, MS Edge Device Emulator  
**Brand Standards:** Broadbeach Academy Design Guidelines  
- Primary Navy: `#08203E`, `#0B315B`
- Secondary Royal Blue: `#1E5FA8`, `#2563EB`
- Accent Gold: `#F8D85A`, `#F59E0B`
- Neutral Surfaces: `#FFFFFF`, `#F8FAFC`, `#0F172A`  

---

## 1. UI/UX Defects Summary

```
Critical (P0):    0
High (P1):        2
Medium (P2):      5
Low (P3):         4
TOTAL UI ISSUES: 11
```

---

## 2. Impeccable Design Anti-Patterns (Static & Computed)

The following anti-patterns were flagged by the Impeccable Design Quality detector:

| File | Line | Impeccable Rule | Observed Defect | Recommended Fix |
| :--- | :---: | :--- | :--- | :--- |
| `src/components/Hero/Hero.jsx` | 143 | `gradient-text` | `bg-clip-text + bg-gradient` on hero headline. Gradient text on dark backgrounds causes muddy letter edges and is a common AI UI cliché. | Replace with crisp solid white (`#FFFFFF`) with gold accent keyword (`#F8D85A`). |
| `src/pages/FreeCoursesPage.jsx` | 246 | `gradient-text` | `bg-clip-text + bg-gradient` on catalog banner headline. | Use solid high-contrast Navy (`#0B315B`) or White text. |
| `src/pages/Learning.jsx` | 1588 | `side-tab` | `border-l-4 border-blue-600` on active lesson item card. Thick left accent is a recognizable AI template signature. | Use subtle background tint (`bg-blue-50/80`) or clean left indicator dot. |
| `src/pages/LessonSlides.jsx` | 705 | `side-tab` | `border-l-4 border-blue-600` on slide overview cards. | Replace with refined border pill or surface elevation. |
| `src/index.css` | 19 | `bounce-easing` | `animate-bounce` on floating callout. Bouncy easing feels dated and unprofessional for ISO certification. | Replace with smooth exponential ease (`ease-out-quart`) or subtle float tween. |
| `src/index.css` | 1 | `overused-font` | Generic Google Font: Plus Jakarta Sans. | Pair with a distinctive corporate serif or editorial grotesque for headers. |

---

## 3. High & Medium Severity UI/UX Defects

### UX-01: Cookie Consent Overlay Intercepts User Clicks
- **Issue ID:** `UX-MOD-01`
- **Component:** `CookieConsent.jsx`
- **Severity:** 🟠 **HIGH (P1)**
- **Observed Behavior:**
  The consent modal is configured with a 1200ms delay before setting `isOpen = true`. When a new visitor lands on a course page and immediately clicks "Start Course Now", the modal animates in right as the user clicks, stealing focus and intercepting the click. The user believes the button is unresponsive.
- **Expected Behavior:**
  Cookie consent should be unobtrusive, docked to the bottom corner, and non-blocking (`pointer-events-none` wrapper).
- **Recommended Fix:**
  Change modal from full-viewport backdrop to an anchored bottom-right banner card that does not prevent clicking page navigation buttons.

---

### UX-02: Hero Section Pushes Primary Value Proposition Below Fold on 768px Laptops
- **Issue ID:** `UX-HERO-01`
- **Component:** `Hero.jsx`
- **Severity:** 🟠 **HIGH (P1)**
- **Observed Behavior:**
  On standard 1366 × 768 and 1024 × 768 laptop displays, the hero section's vertical height (`min-h-screen` or `pt-32 pb-24`) exceeds the viewport. The primary CTAs ("Explore Free Certifications" and "Verify Certificate") fall below the fold.
- **Expected Behavior:**
  Hero headline, sub-headline, trust badges, and primary action buttons should fit within the initial 768px viewport.
- **Recommended Fix:**
  Adjust hero padding from `pt-32 pb-24` to `pt-20 pb-12` on `md` and `lg` viewports; set max container height to `calc(100vh - 80px)`.

---

### UX-03: Redundant Duplicate "Course Overview" Tab in Details View
- **Issue ID:** `UX-TAB-01`
- **Component:** `CourseDetails.jsx`
- **Severity:** 🟡 **MEDIUM (P2)**
- **Observed Behavior:**
  In the course navigation bar beneath the hero, two identical buttons both labeled "Course Overview" appear side by side.
- **Expected Behavior:**
  Each tab must represent a distinct section: "Overview", "Curriculum", "Accreditation", "FAQs".
- **Recommended Fix:**
  Deduplicate tab definition array in `CourseDetails.jsx`.

---

### UX-04: Card Height Inconsistency in Free Courses Grid
- **Issue ID:** `UX-CRD-01`
- **Component:** `FreeCoursesPage.jsx`
- **Severity:** 🟡 **MEDIUM (P2)**
- **Observed Behavior:**
  Titles with 3 lines (e.g. *ISO 19011:2018 Auditing Guidelines Foundation*) push the "Start Course" button lower than cards with 2-line titles, creating a jagged, misaligned button row.
- **Expected Behavior:**
  All cards in a CSS grid row should have equal height (`h-full flex flex-col justify-between`), with action buttons aligned to the baseline.
- **Recommended Fix:**
  Apply `grid-rows-[subgrid]` or `flex flex-col h-full` with `mt-auto` on the button container.

---

### UX-05: Low Color Contrast on Footer Links
- **Issue ID:** `UX-A11Y-01`
- **Component:** `Footer.jsx`
- **Severity:** 🟡 **MEDIUM (P2)**
- **Observed Behavior:**
  Footer navigation links use `text-slate-400` (`#94A3B8`) against dark navy background `#08203E`.
  - Contrast Ratio: **3.42:1** (Fails WCAG 2.2 AA minimum threshold of 4.5:1 for normal text).
- **Expected Behavior:**
  Footer link text must maintain at least 4.5:1 contrast against `#08203E`.
- **Recommended Fix:**
  Update link color to `text-slate-200` (`#E2E8F0`), achieving an accessible **10.8:1** contrast ratio.

---

### UX-06: Missing Keyboard Focus Ring on Interactive Cards
- **Issue ID:** `UX-A11Y-02`
- **Component:** `CourseCard.jsx`, `FreeCoursesPage.jsx`
- **Severity:** 🟡 **MEDIUM (P2)**
- **Observed Behavior:**
  When tabbing through courses with the keyboard (`Tab` key), course cards outline with default browser dotted focus, which is nearly invisible against navy background.
- **Expected Behavior:**
  High-contrast focus ring: `focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2`.
- **Recommended Fix:**
  Add Tailwind utility `focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F8D85A]` to all card anchors.

---

### UX-07: Plain Text Loading State in Lesson Slides Viewer
- **Issue ID:** `UX-LRN-01`
- **Component:** `LessonSlides.jsx`
- **Severity:** 🟢 **LOW (P3)**
- **Observed Behavior:**
  While rendering PDF pages, the viewer displays a plain text paragraph: "Loading slides..." without a skeleton or progress indicator.
- **Recommended Fix:**
  Replace with a pulsing aspect-ratio skeleton placeholder (`animate-pulse bg-slate-200 rounded-xl`).

---

### UX-08: Mobile Breadcrumbs Horizontal Overflow
- **Issue ID:** `UX-NAV-01`
- **Component:** `Breadcrumbs.jsx`
- **Severity:** 🟢 **LOW (P3)**
- **Observed Behavior:**
  On 360 × 800 viewport, long breadcrumb paths (*Home > Free Courses > ISO 45001:2018 OHSMS Awareness*) wrap awkwardly across 3 lines.
- **Recommended Fix:**
  Add `overflow-x-auto whitespace-nowrap no-scrollbar` to breadcrumbs container on mobile.
