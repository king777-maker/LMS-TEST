# BROADBEACH ACADEMY LMS — COURSE PLAYER UI/UX REDESIGN & FOUR-CHAPTER STRUCTURE
## Comprehensive Architectural Implementation & Viewport Scroll Control Report

**Document ID:** `BB-LMS-PLAYER-2026-004`  
**Date:** November 4, 2026  
**Author:** Principal Full-Stack Developer, LMS Architect, Senior UI/UX Designer & QA Automation Engineer  
**Classification:** Core LMS Runtime Architecture  
**Target Applications:**
- Frontend LMS: `http://localhost:3000/learning/:id` & `https://broadbeach-academy-lms-d5gx.vercel.app/learning/:id`
- Assessment Interface: `/assignment/:id`
- Certificate Gateway: `/certificate/:id`
- Remote Backend: GoDaddy cPanel Linux Host (`cadac.in/broadbeachlearning.com/broadbeach-backend`)

---

## 1. Executive Summary

In accordance with the Master Prompt instructions, Broadbeach Academy's learning interface underwent a comprehensive architectural redesign focused on two core objectives:
1. **Strict Viewport Scroll Control (Highest Priority):** Eliminated unnecessary outer page and nested scrollbars by transforming the learner experience into a modern `100dvh` viewport-fitted application layout. Suppressed bulky marketing navigation and footer on course player routes.
2. **Standardized Four-Chapter Architecture:** Converted all 11 Free Courses to exactly **FOUR top-level chapters** with standardized Course Content headers, unified sub-lesson navigation, authenticated Google Drive video streams, an official **START EXAM** button (eradicating the old "Format: Timed Multiple Choice" text), authentic training slide materials (eradicating the old "Slides Unavailable" button), and an authenticated **Certificate Access** access-code portal displaying the exact mandated statement.

---

## 2. Strict Scroll Control Architecture

### 2.1 Viewport Container Layout
- **Root Shell:** `h-screen w-full flex flex-col bg-slate-100 overflow-hidden select-none` (100dvh viewport locking).
- **Suppression of Marketing Navigation:**
  - In `src/App.jsx`, detected `isLearningPlayer = location.pathname.startsWith("/learning")`.
  - Suppressed `<Header />`, `<Footer />` (which previously added ~480px of vertical height forcing scrolling), and `<CookieConsent />` on learning routes.
  - Implemented `<main className={isLearningPlayer ? "h-screen overflow-hidden" : ""}>`.
- **Compact LMS Top Bar (56px):**
  - Left: Back to catalogue button (`<FaArrowLeft />`), academy brand identifier.
  - Center: Dynamic course title `{Course Name} — Course Content` with ellipsis truncation protection.
  - Right: Real-time progress bar pill (`XX% Complete`) and mobile outline drawer trigger (`FaBars`).
- **Main Workspace (`h-[calc(100vh-56px)] flex overflow-hidden min-h-0`):**
  - Left Sidebar (`w-80 xl:w-96` on desktop; slide-out drawer on mobile): Dedicated `flex-1 overflow-y-auto min-h-0` container.
  - Right Workspace: `flex-1 h-full flex flex-col bg-slate-50 overflow-hidden min-h-0`.
  - Video Player: Aspect-ratio locked with `max-h-[56vh]`, guaranteeing that lecture titles, duration, completion checkboxes, and controls fit comfortably without forcing learners to scroll.
  - Bottom Action Bar: Pinned 56px bottom bar with Previous/Next controls and current chapter status.

---

## 3. The Standardized Four-Chapter Model

Every Free Course adheres strictly to this four-chapter sequence:

| Chapter | Title | Sub-Components / Content | Unlock Condition |
|---|---|---|---|
| **Chapter 1** | **Course Module** | 3 Structured Video Lectures (Foundations, Core Concepts, Continual Improvement) powered by authentic Google Drive streams. | Unlocked by default |
| **Chapter 2** | **Assessment** | Course-specific 10-question timed exam (30 mins, 70% passing threshold). Features high-contrast **START EXAM** action button. | 100% of Chapter 1 video lessons marked complete |
| **Chapter 3** | **Training Course Material** | 3 Authentic Downloadable Slide Decks (`introduction.pdf`, `Chapter2.pdf`, `Chapter3.pdf`) with embedded slide viewer and PDF downloads. | Chapter 2 Assessment passed (score $\ge 70\%$) |
| **Chapter 4** | **Download Certificate** | Verifiable digital certificate download card + **Certificate Access** access-code redemption portal. | Chapter 2 Assessment passed / Certificate code validated |

---

## 4. Specific Feature Replacements

### 4.1 Assessment Format Replacement
- **Previous Interface:** Displayed static card with text: `Format: Timed Multiple Choice`.
- **New Interface:** Replaced with a prominent, high-contrast gold and navy **START EXAM** button that opens `/assignment/:id`, preserving full question navigation, countdown timers, backend scoring, and pass/fail rules.

### 4.2 Eradication of "Slides Unavailable" & Certificate Access Deployment
- **Previous Interface:** Displayed a disabled blue button stating `"Slides Unavailable"`.
- **New Interface:** Completely removed this button. Deployed the dedicated **Certificate Access** section in Chapter 4 featuring the exact mandated statement:
  > **Please enter valid Access code for corporate and Classroom Exams.**
- Provides working access-code input (`[ Access Code Input ]`) and submit action (`[ Verify / Continue ]`), securely validating credentials through backend endpoint `/api/check-access-code`.

### 4.3 Standardized Dynamic Course Content Header
- Across all 11 courses, the curriculum header dynamically displays:
  - `ISO 9001:2026 QMS — Course Content`
  - `ISO 14001:2026 EMS — Course Content`
  - `ISO 45001:2018 OHSMS — Course Content`
  - `ISO 22000:2018 FSMS — Course Content`
  - `ISO 27001:2022 ISMS — Course Content`
  - `ISO 19011:2026 — Course Content`
  - `5S Workplace Management — Course Content`
  - `7QC Tools Certification — Course Content`
  - `Project Management Level-1 — Course Content`
  - `Lean Six Sigma White belt — Course Content`
  - `Root Cause Analysis — Course Content`

---

## 5. Sequential Unlocking & Security Enforcement

1. **Frontend State & Navigation Guards:**
   - In `src/pages/Learning.jsx`, locked chapters display dedicated explanatory cards with lock icons, specific lock reasons, and one-click return buttons.
   - In `src/pages/Assignment.jsx`, added a strict prerequisite guard. Direct URL navigation to `/assignment/:id` checks Chapter 1 completion and immediately halts unauthorized exam attempts with an *"Assessment Prerequisites Incomplete"* screen.
2. **Progress Tracker Runtime:**
   - Updated `src/utils/progressTracker.js` to model all 4 chapters, calculating percentage completions (`Ch1 = 40%`, `Ch2 = 70%`, `Ch3 = 85%`, `Ch4 = 100%`).
3. **Backend Access Control:**
   - Updated `CourseProgressController.php` to calculate and return `chapter1`, `chapter2`, `chapter3`, and `chapter4` unlocking status and reasons.
   - Enforced HTTP 403 Forbidden on `/api/assessment` if Chapter 1 is incomplete, and HTTP 403 on `/api/course-materials` if Chapter 2 is not passed.

