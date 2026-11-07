# Broadbeach Academy — Assessment QA & Verification Report

## 1. Overview & Verification Scope
Every single Free Course assessment was subjected to automated verification:
1. Live API endpoint validation (`GET /api/assessment?id={course_id}`)
2. Live submission endpoint scoring validation (`POST /api/submit-assessment`)
3. Live end-to-end user browser execution (`http://localhost:3000/assignment/{id}`)
4. Text comparison against source PDF documents
5. Visual regression and UI preservation confirmation

---

## 2. Ten-Question & Format Verification Results

| Course ID | Course Name | PDF Source File | Palette Question Count | 30-Min Countdown Timer | Passing Threshold | Question 1 Source Match | QA Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **322** | ISO 9001:2026 QMS | `ISO_9001_2026_MCQs_Answers_n_Question.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **332** | ISO14001: 2026 EMS | `ISO 14001_2026 FREE COURCE MCQ QUESTION.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **323** | ISO 45001:2018 OHSMS | `ISO 45001 MCQ Assessment.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **324** | ISO 22000:2018 FSMS | `ISO_22000_2018_10_MCQs_with_Answers.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **325** | ISO 19011:2026 | `ISO_19011_2026_10_MCQs_with_Answers.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **333** | ISO 27001:2022 ISMS | `ISO 27001 MCQ Assessment.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **326** | 5S Workplace Management | `5S_Workplace_Management_LMS_Assessment_MCQs_Answers.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **327** | 7QC Tools Certification | `7QC_Tools_10_MCQs_with_Answers.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **328** | Project Management Level-1 | `Project Management MCQ Assessment.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **329** | Lean Six Sigma White belt | `Lean Six Sigma MCQ Assessment.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |
| **330** | Root Cause Analysis | `Root Cause Analysis MCQ Assessment.pdf` | **10 / 10** | **30:00 (Active)** | **70% (7/10)** | **100% Exact** | **PASSED** |

---

## 3. Exam Submission & Result Engine Verification

Automated scoring tests on `POST /api/submit-assessment`:

1. **Passing Learner Flow:**
   - **Test Input:** 8 correct answers, 2 incorrect answers.
   - **Calculated Score:** 8 / 10 marks (80%).
   - **Evaluation:** 80% ≥ 70% threshold.
   - **Response Payload:** `passed: true`, `result: "pass"`.
   - **Certificate Generation:** Unique serial ID generated (e.g., `BOA32299596`) and synchronized to `admin_store.json` and `assessment_submissions.json`.
   - **Eligibility:** Learner marked eligible for certificate download and LinkedIn credential sharing.

2. **Failing Learner Flow:**
   - **Test Input:** 3 correct answers, 7 incorrect answers.
   - **Calculated Score:** 3 / 10 marks (30%).
   - **Evaluation:** 30% < 70% threshold.
   - **Response Payload:** `passed: false`, `result: "fail"`.
   - **Certificate Generation:** `certificate_number: null` (no certificate issued).
   - **Guidance:** Failure message presented to learner with recommendation to revisit course modules and re-attempt.

---

## 4. Security & Question Leakage Audit

- **API GET Inspection:** `GET /api/assessment?id={id}` returns only `{ id, question, options }` for each item.
- **Leakage Check:** `correct_answer` field is strictly omitted from the API response.
- **Integrity Status:** Passed. Students cannot inspect Network devtools or page DOM to reveal answers prior to submission.

---

## 5. UI & Exam Interface Preservation

The following UI components and layouts were verified completely intact:
- Clean 10-button Question Palette (numbered 1 through 10)
- Real-time question status indicators (Current, Answered, Unanswered)
- Circular / badge 30-minute countdown timer
- Standard radio button option selection
- Previous / Next question navigation buttons
- Direct Question Palette jumping
- Confirmation modal on Submit Exam
- Clean result page transition with certificate rendering logic
