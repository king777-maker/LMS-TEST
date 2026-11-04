# BROADBEACH ACADEMY — COURSE STRUCTURE MIGRATION RUNBOOK
## Migration from Legacy 5-Chapter Architecture to Standardized 4-Chapter LMS Model

**Document ID:** `BB-MIG-4CH-2026-001`  
**Date:** November 4, 2026  
**Status:** Executed & Verified in Production  

---

## 1. Migration Overview

The Broadbeach Academy LMS curriculum structure was previously defined across 5 fragmented chapters. This created redundant steps and navigation friction. The curriculum has been restructured into **exactly FOUR chapters** across all 11 Free Courses:

### Structural Transformation Mapping

```
LEGACY 5-CHAPTER MODEL                        STANDARDIZED 4-CHAPTER MODEL
--------------------------------------        -----------------------------------------
Chapter 1: Introduction (Video)        \
Chapter 2: Core Concepts (Video)        } ──> Chapter 1: Course Module (3 Video Lessons)
Chapter 3: Course Summary (Video)      /
Chapter 4: Assessment                         ──> Chapter 2: Assessment (with START EXAM)
Chapter 5: Download Certificate               ──> Chapter 3: Training Course Material
[Access Code scattered / Slides Unavail]      ──> Chapter 4: Download Certificate & Access
```

---

## 2. Chapter Breakdown & Content Alignment

### Chapter 1: Course Module
- **Sub-Lesson 1:** Purpose, Scope & Foundations of [Course Name] (45 Mins)
- **Sub-Lesson 2:** Core Concepts, Framework Operations & Risk Alignment (1 Hour 15 Mins)
- **Sub-Lesson 3:** Performance Evaluation, Continual Improvement & Audit Readiness (45 Mins)
- **Video Source:** Course-specific Google Drive stream (`drive.google.com/file/d/.../preview`).
- **Completion Criteria:** All 3 sub-lessons marked complete by learner.

### Chapter 2: Assessment
- **Component:** Course-specific 10-Question Certification Exam.
- **Duration:** 30 Minutes.
- **Passing Threshold:** 70% or higher.
- **Action Button:** Prominent **START EXAM** button navigating to `/assignment/:id`.
- **Completion Criteria:** Score $\ge 70\%$ recorded in `assessment_submissions`.

### Chapter 3: Training Course Material
- **Component:** Downloadable and interactive reference resources.
- **Materials Included:**
  1. Introduction & Foundation Deck (`introduction.pdf`, 553 KB)
  2. Core Requirements & Methodology Manual (`Chapter2.pdf`, 11.5 MB)
  3. Operational Control & Continual Improvement Handbook (`Chapter3.pdf`, 320 KB)
- **Actions:** In-browser Slides Viewer and direct PDF downloads.

### Chapter 4: Download Certificate
- **Components:**
  1. **Certificate Access Section:** Mandated text *"Please enter valid Access code for corporate and Classroom Exams."* with input field and `[ Verify / Continue ]` action.
  2. **Accredited Digital Credential Card:** Verifiable certificate download button leading to `/certificate/:id`.

---

## 3. Database Schema & Migration SQL

The database schema preserves existing enrollments and scores while tracking lesson completions in `learner_lesson_progress`:

```sql
CREATE TABLE IF NOT EXISTS `learner_lesson_progress` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `certification_id` INT NOT NULL,
    `lesson_id` VARCHAR(64) NOT NULL,
    `completed` TINYINT(1) NOT NULL DEFAULT 1,
    `completed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uniq_user_cert_lesson` (`user_id`, `certification_id`, `lesson_id`),
    INDEX `idx_user_cert` (`user_id`, `certification_id`),
    INDEX `idx_completed` (`completed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Backward Compatibility Guarantee

1. **Existing Completions Preserved:** Learners who previously completed assessments retain their passing scores and certified status.
2. **Dynamic Name Standardization:** Titles are rendered dynamically using `getAuthoritativeCourseName()`, preventing ISO 9001 labels from appearing on other courses.
3. **No Schema Reset:** Zero table drops or data purges were executed.
