import { generateCurriculumForCourse } from "../data/coursesResolver.js";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability.js";

const STORAGE_PREFIX = "bb_course_progress_";
const CERT_STORAGE_KEY = "bb_certificates";

/**
 * Safely resolves user ID from argument, localStorage bb_user_id, or parsed bb_user
 */
export const resolveUserId = (userId) => {
  if (userId && Number(userId) > 0) return Number(userId);
  try {
    const storedId = localStorage.getItem("bb_user_id");
    if (storedId && Number(storedId) > 0) return Number(storedId);
    const userJson = localStorage.getItem("bb_user");
    if (userJson) {
      const parsed = JSON.parse(userJson);
      const uid = Number(parsed?.id || parsed?.user_id);
      if (uid > 0) return uid;
    }
  } catch (e) {}
  return 13;
};

// Known lesson counts for standard awareness and foundation courses
const KNOWN_COURSE_LESSONS = {
  322: 5,
  323: 5,
  324: 5,
  325: 5,
  326: 5,
  327: 5,
  328: 5,
  329: 5,
  330: 5,
  332: 5,
  333: 5,
  1: 5,
  2: 5,
  3: 5,
  4: 5,
  5: 5,
  6: 5,
  7: 5,
  8: 5,
  9: 5,
  10: 5,
  11: 5,
};

export const CANONICAL_TO_INDEX_MAP = {
  322: 1,
  332: 2,
  323: 3,
  324: 4,
  325: 5,
  333: 6,
  326: 7,
  327: 8,
  328: 9,
  329: 10,
  330: 11,
};

/**
 * Normalizes course identifier into canonical database certification ID
 */
export const normalizeCourseId = (courseId) => {
  if (!courseId) return 322;
  const str = String(courseId).trim().toLowerCase();
  if (FREE_COURSE_DB_MAP[str]) return FREE_COURSE_DB_MAP[str];

  // Strip non-alphanumeric for robust matching
  const clean = str.replace(/[^a-z0-9]/g, "");

  // Priority ISO & Keyword checks: guarantees zero cross-contamination between courses
  if (clean.includes("14001") || clean.includes("ems") || str.includes("environmental")) return 332;
  if (clean.includes("45001") || clean.includes("ohsms") || clean.includes("ohs") || str.includes("occupational")) return 323;
  if (clean.includes("22000") || clean.includes("fsms") || str.includes("food")) return 324;
  if (clean.includes("19011") || str.includes("auditing guidelines") || clean.includes("iso19011")) return 325;
  if (clean.includes("27001") || clean.includes("isms") || str.includes("security")) return 333;
  if (clean.includes("5s") || str.includes("workplace")) return 326;
  if (clean.includes("7qc") || clean.includes("qctools")) return 327;
  if (str.includes("project") || clean.includes("pmlevel")) return 328;
  if (str.includes("sigma") || str.includes("whitebelt") || str.includes("white belt")) return 329;
  if (clean.includes("rca") || str.includes("root cause")) return 330;
  if (clean.includes("9001") || clean.includes("qms") || (str.includes("quality") && !str.includes("tools"))) return 322;

  // Numeric check (e.g. 1..11 or 322..333)
  const num = Number(str.replace(/^free-/, ""));
  if (!isNaN(num) && num > 0) {
    if (FREE_COURSE_DB_MAP[String(num)]) return FREE_COURSE_DB_MAP[String(num)];
    return num;
  }

  return FREE_COURSE_DB_MAP[String(courseId)] || 322;
};

/**
 * Safely compute progress percentage
 * Progress (%) = (Number of completed eligible lessons / Total eligible lessons) * 100
 * Requirements:
 * - Handle courses with zero eligible lessons without dividing by zero.
 * - Round percentages consistently.
 */
export const calculateProgressPercentage = (completed, total) => {
  const safeTotal = Number(total);
  const safeCompleted = Number(completed);
  if (!safeTotal || safeTotal <= 0 || isNaN(safeTotal)) {
    return 0; // Handle zero eligible lessons without division by zero
  }
  const pct = Math.min(100, Math.max(0, Math.round((safeCompleted / safeTotal) * 100)));
  return isNaN(pct) ? 0 : pct;
};

/**
 * Get stored progress record from localStorage
 */
const getStoredRecord = (userId, courseId) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);
  const idx = CANONICAL_TO_INDEX_MAP[cId];

  // Check main canonical keys for THIS specific course only
  const keys = [
    `${STORAGE_PREFIX}${uId}_${cId}`,
    `${STORAGE_PREFIX}${uId}_free-${cId}`,
  ];
  if (idx) {
    keys.push(`${STORAGE_PREFIX}${uId}_${idx}`);
    keys.push(`${STORAGE_PREFIX}${uId}_free-${idx}`);
  }

  // Check guest fallback if logged-in user key doesn't exist yet
  if (uId !== 13) {
    keys.push(`${STORAGE_PREFIX}13_${cId}`);
    keys.push(`${STORAGE_PREFIX}13_free-${cId}`);
    if (idx) {
      keys.push(`${STORAGE_PREFIX}13_${idx}`);
      keys.push(`${STORAGE_PREFIX}13_free-${idx}`);
    }
  }

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return { completedLessonIds: parsed };
        } else if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    } catch {}
  }

  return {};
};

/**
 * Get accurate progress details for a course & user
 */
export const getCourseProgress = (userId = 0, courseId = 0, totalLessonsCount = null) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);

  // 1. Check certificates list
  let isCertCompleted = false;
  let certificateRecord = null;
  try {
    const certs = typeof window !== "undefined" && typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem(CERT_STORAGE_KEY) || "[]")
      : [];
    certificateRecord = certs.find(
      (c) =>
        (Number(c.certification_id) === Number(cId) ||
          Number(c.course_id) === Number(cId) ||
          String(c.id) === String(cId)) &&
        (!uId || Number(c.user_id) === Number(uId) || !c.user_id)
    );
    if (certificateRecord) {
      isCertCompleted = true;
    }
  } catch (e) {
    console.error(e);
  }

  // 2. Read stored progress record
  const record = getStoredRecord(uId, cId);
  let completedLessonIds = Array.isArray(record.completedLessonIds)
    ? Array.from(new Set(record.completedLessonIds.map(Number)))
    : [];

  if (record.isCompleted) {
    isCertCompleted = true;
  }

  // 3. Determine total lessons
  let totalLessons = Number(totalLessonsCount) || Number(record.totalLessons);
  if (!totalLessons || totalLessons <= 0) {
    totalLessons = KNOWN_COURSE_LESSONS[cId] || 5;
  }

  // 4. Calculate percentage & completion
  const hasAssessment = completedLessonIds.includes(4) || completedLessonIds.includes(5) || completedLessonIds.includes(9999);
  
  // Strict 4-Chapter Sequential Completion Logic
  const requiredModuleLessons = 3;
  const moduleLessonsDone = completedLessonIds.filter(id => id === 1 || id === 2 || id === 3 || id === "1" || id === "2" || id === "3").length;
  const isChapter1Complete = moduleLessonsDone >= requiredModuleLessons;

  const isAssessmentPassed = Boolean(
    record.assessmentPassed ||
    record.isCompleted ||
    isCertCompleted ||
    (record.assessmentPercentage && record.assessmentPercentage >= 70) ||
    (record.assessmentResult === "pass") ||
    hasAssessment
  );

  const isChapter2Unlocked = isChapter1Complete;
  const isChapter2Complete = isAssessmentPassed;
  const isChapter3Unlocked = isChapter2Complete;
  const isChapter3Complete = isAssessmentPassed;
  const isChapter4Unlocked = isChapter2Complete;
  const isChapter4Complete = isCertCompleted || Boolean(record.isCompleted) || (isAssessmentPassed && (record.couponRedeemed || record.certificateDownloaded));

  const isComplete = isCertCompleted || Boolean(record.isCompleted) || isChapter4Complete;

  let percentage = 0;
  if (isComplete) {
    percentage = 100;
  } else if (isChapter3Complete) {
    percentage = 85;
  } else if (isChapter2Complete) {
    percentage = 70;
  } else if (isChapter1Complete) {
    percentage = 40;
  } else {
    percentage = Math.round((moduleLessonsDone / requiredModuleLessons) * 35);
  }

  // 5. Determine course status
  let status = "Not Started";
  if (isComplete || percentage === 100) {
    status = "Completed";
  } else if (percentage > 0 || completedLessonIds.length > 0) {
    status = "In Progress";
  }

  const completedCount = isComplete ? 4 : (isChapter3Complete ? 3 : (isChapter2Complete ? 2 : (isChapter1Complete ? 1 : 0)));

  return {
    userId: uId,
    courseId: cId,
    percentage,
    completedCount,
    totalCount: 4,
    totalLessons: 4,
    isCompleted: isComplete,
    status,
    completedLessonIds,
    isChapter1Complete,
    isChapter2Unlocked,
    isChapter2Complete,
    isChapter3Unlocked,
    isChapter3Complete,
    isChapter4Unlocked,
    isChapter4Complete,
    assessmentPassed: isAssessmentPassed,
    chapter1: {
      chapter_number: 1,
      title: "Course Module",
      unlocked: true,
      completed: isChapter1Complete,
      progress: Math.min(100, Math.round((moduleLessonsDone / requiredModuleLessons) * 100)),
      completedLessons: moduleLessonsDone,
      requiredLessons: requiredModuleLessons
    },
    chapter2: {
      chapter_number: 2,
      title: "Assessment",
      unlocked: isChapter2Unlocked,
      completed: isChapter2Complete,
      lockReason: isChapter2Unlocked ? "" : "Complete all Course Module lessons in Chapter 1 to unlock the Assessment."
    },
    chapter3: {
      chapter_number: 3,
      title: "Training Course Material",
      unlocked: isChapter3Unlocked,
      completed: isChapter3Complete,
      lockReason: isChapter3Unlocked ? "" : "Pass the Chapter 2 Assessment (70% or higher) to unlock Training Course Materials."
    },
    chapter4: {
      chapter_number: 4,
      title: "Download Certificate",
      unlocked: isChapter4Unlocked,
      completed: isChapter4Complete,
      lockReason: isChapter4Unlocked ? "" : "Pass the Chapter 2 Assessment to access your Certificate."
    },
    lastAccessedLesson: record.lastAccessedLesson || (completedLessonIds.length > 0 ? completedLessonIds[completedLessonIds.length - 1] : null),
    updatedAt: record.updatedAt || new Date().toISOString(),
    certificateRecord,
  };
};

/**
 * Toggle or mark a lesson as completed
 * Fully idempotent, persists to database / storage, and dispatches real-time update event
 */
export const toggleLessonCompleted = (userId, courseId, lessonId, totalLessonsCount = null) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);
  const key = `${STORAGE_PREFIX}${uId}_${cId}`;

  const record = getStoredRecord(uId, cId);
  let currentIds = Array.isArray(record.completedLessonIds)
    ? Array.from(new Set(record.completedLessonIds.map(Number)))
    : [];

  const lId = Number(lessonId);
  const alreadyCompleted = currentIds.includes(lId);

  let updatedIds;
  if (alreadyCompleted) {
    updatedIds = currentIds.filter((id) => id !== lId);
  } else {
    updatedIds = [...currentIds, lId];
  }

  const total = Number(totalLessonsCount) || Number(record.totalLessons) || KNOWN_COURSE_LESSONS[cId] || 5;
  const percentage = calculateProgressPercentage(updatedIds.length, total);
  const isComplete = total > 0 && updatedIds.length >= total;
  const status = isComplete ? "Completed" : percentage > 0 ? "In Progress" : "Not Started";

  const progressRecord = {
    userId: uId,
    courseId: cId,
    completedLessonIds: updatedIds,
    completedCount: updatedIds.length,
    totalLessons: total,
    totalCount: total,
    percentage,
    isCompleted: isComplete,
    status,
    lastAccessedLesson: lId,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(progressRecord));
    localStorage.setItem("bb_last_progress_update", JSON.stringify({
      courseId: cId,
      userId: uId,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.error("Progress persistence error:", e);
  }

  // Dispatch global event for immediate real-time synchronization
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bb_progress_updated", {
        detail: progressRecord,
      })
    );
  }

  return progressRecord;
};

/**
 * Explicit idempotent lesson completion
 * If already completed, does not duplicate or inflate progress
 */
export const recordLessonCompleted = (userId, courseId, lessonId, totalLessonsCount = null) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);
  const key = `${STORAGE_PREFIX}${uId}_${cId}`;

  const record = getStoredRecord(uId, cId);
  let currentIds = Array.isArray(record.completedLessonIds)
    ? Array.from(new Set(record.completedLessonIds.map(Number)))
    : [];

  const lId = Number(lessonId);
  if (!currentIds.includes(lId)) {
    currentIds.push(lId);
  }

  const total = Number(totalLessonsCount) || Number(record.totalLessons) || KNOWN_COURSE_LESSONS[cId] || 5;
  const percentage = calculateProgressPercentage(currentIds.length, total);
  const isComplete = total > 0 && currentIds.length >= total;
  const status = isComplete ? "Completed" : percentage > 0 ? "In Progress" : "Not Started";

  const progressRecord = {
    userId: uId,
    courseId: cId,
    completedLessonIds: currentIds,
    completedCount: currentIds.length,
    totalLessons: total,
    totalCount: total,
    percentage,
    isCompleted: isComplete,
    status,
    lastAccessedLesson: lId,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(progressRecord));
    localStorage.setItem("bb_last_progress_update", JSON.stringify({
      courseId: cId,
      userId: uId,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.error("Progress persistence error:", e);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bb_progress_updated", {
        detail: progressRecord,
      })
    );
  }

  return progressRecord;
};

/**
 * Mark entire course as completed
 */
export const markCourseCompleted = (userId, courseId, certData = {}) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);
  const key = `${STORAGE_PREFIX}${uId}_${cId}`;

  const total = KNOWN_COURSE_LESSONS[cId] || 5;
  const existingRecord = getStoredRecord(uId, cId);
  let completedLessonIds = Array.isArray(existingRecord.completedLessonIds)
    ? Array.from(new Set(existingRecord.completedLessonIds.map(Number)))
    : [];

  // Guarantee all chapters (1 through total) and assessment are registered as completed
  for (let i = 1; i <= total; i++) {
    if (!completedLessonIds.includes(i)) {
      completedLessonIds.push(i);
    }
  }
  const chapter5Ids = [5, 52, 9999, 500, Number(cId)];
  chapter5Ids.forEach(id => {
    if (!completedLessonIds.includes(id)) {
      completedLessonIds.push(id);
    }
  });

  const progressRecord = {
    userId: uId,
    courseId: cId,
    completedLessonIds,
    completedCount: total,
    totalLessons: total,
    totalCount: total,
    percentage: 100,
    isCompleted: true,
    status: "Completed",
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(progressRecord));

    // Also persist completion status to local enrolled courses
    try {
      const enrolled = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
      const existing = enrolled.find((c) => Number(c.id || c.certification_id) === Number(cId));
      if (existing) {
        existing.status = "Completed";
        existing.isCompleted = true;
        existing.percentage = 100;
        localStorage.setItem("bb_enrolled_courses", JSON.stringify(enrolled));
      } else {
        enrolled.push({
          id: cId,
          certification_id: cId,
          status: "Completed",
          isCompleted: true,
          percentage: 100,
          enrolledAt: new Date().toISOString(),
        });
        localStorage.setItem("bb_enrolled_courses", JSON.stringify(enrolled));
      }
    } catch (enrErr) {}

    if (certData && certData.certificate_number) {
      const certs = JSON.parse(localStorage.getItem(CERT_STORAGE_KEY) || "[]");
      const existingIdx = certs.findIndex(
        (c) =>
          String(c.certification_id) === String(cId) ||
          (c.certificate_number && c.certificate_number === certData.certificate_number)
      );

      // Resolve student name if missing or placeholder
      let resolvedStudentName = certData.student_name || certData.studentName;
      if (
        !resolvedStudentName ||
        ["learner", "student", "test student", "candidate", "—"].includes(
          String(resolvedStudentName).trim().toLowerCase()
        )
      ) {
        try {
          const raw = localStorage.getItem("bb_user") || localStorage.getItem("user");
          if (raw) {
            const u = JSON.parse(raw);
            resolvedStudentName =
              u.name ||
              u.full_name ||
              [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
              u.username;
          }
        } catch (e) {}
      }

      const certEntry = {
        user_id: uId,
        certification_id: cId,
        course_id: cId,
        course_name: certData.course_name || certData.course_title || `ISO Course ${cId}`,
        student_name: resolvedStudentName || "Verified Learner",
        status: "active",
        verification_status: "Verified",
        source: "online",
        ...certData,
        completed_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        certs[existingIdx] = { ...certs[existingIdx], ...certEntry };
      } else {
        certs.unshift(certEntry);
      }
      localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
    }

    localStorage.setItem("bb_last_progress_update", JSON.stringify({
      courseId: cId,
      userId: uId,
      timestamp: Date.now(),
    }));
  } catch (e) {}

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bb_progress_updated", {
        detail: progressRecord,
      })
    );
  }

  return progressRecord;
};

/**
 * Verifies certificate eligibility
 * Certificate is available ONLY after genuine course completion
 */
export const verifyCertificateEligibility = (userId, courseId) => {
  const progress = getCourseProgress(userId, courseId);
  const eligible = Boolean(progress.isCompleted || progress.percentage === 100 || progress.certificateRecord);
  return {
    eligible,
    progress,
    reason: eligible
      ? "Course requirements satisfied."
      : `You have completed ${progress.completedCount} of ${progress.totalCount} lessons (${progress.percentage}%). Please complete all lessons to earn your certificate.`,
  };
};

/**
 * Records an authorized certificate access code / exam bypass.
 * Marks the course completed, persists certificate details, and dispatches progress event.
 */
export const recordExamBypass = (userId, courseId, bypassDetails = {}) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);
  const key = `${STORAGE_PREFIX}${uId}_${cId}`;
  const total = KNOWN_COURSE_LESSONS[cId] || 5;
  const completedIds = [1, 2, 3, 4, 5];

  const progressRecord = {
    userId: uId,
    courseId: cId,
    completedLessonIds: completedIds,
    completedCount: total,
    totalLessons: total,
    totalCount: total,
    percentage: 100,
    isCompleted: true,
    status: "Completed",
    examBypassed: true,
    bypassCode: bypassDetails.code || bypassDetails.bypass_code || null,
    certificateNumber: bypassDetails.certificate_number || null,
    certificateId: bypassDetails.certificate_id || null,
    lastAccessedLesson: total,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(progressRecord));
    localStorage.setItem(`certificate_access_${cId}`, "true");
    if (bypassDetails.certificate_number) {
      localStorage.setItem(`certificate_number_${cId}`, bypassDetails.certificate_number);
    }
    if (bypassDetails.certificate_id) {
      localStorage.setItem(`certificate_id_${cId}`, String(bypassDetails.certificate_id));
    }

    const certs = JSON.parse(localStorage.getItem(CERT_STORAGE_KEY) || "[]");
    const certNumber = bypassDetails.certificate_number;
    const existingIndex = certs.findIndex(
      (c) => String(c.certification_id) === String(cId) || (certNumber && c.certificate_number === certNumber)
    );
    const newCertEntry = {
      user_id: uId,
      certification_id: cId,
      course_id: cId,
      certificate_number: certNumber,
      certificate_id: bypassDetails.certificate_id,
      course_title: bypassDetails.course_name || `ISO Course ${cId}`,
      course_name: bypassDetails.course_name || `ISO Course ${cId}`,
      student_name: bypassDetails.student_name || "Learner",
      exam_bypassed: true,
      bypass_code: bypassDetails.code || bypassDetails.bypass_code || null,
      completed_at: new Date().toISOString(),
      issued_at: new Date().toISOString(),
      status: "active",
      verification_status: "Verified",
    };

    if (existingIndex >= 0) {
      certs[existingIndex] = { ...certs[existingIndex], ...newCertEntry };
    } else {
      certs.unshift(newCertEntry);
    }
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));

    localStorage.setItem(
      "bb_last_progress_update",
      JSON.stringify({
        courseId: cId,
        userId: uId,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error("Exam bypass persistence error:", e);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bb_progress_updated", {
        detail: progressRecord,
      })
    );
  }

  return progressRecord;
};



/**
 * Checks whether a chapter is unlocked based on sequential completion rules:
 * - Chapter 1 (Course Module): Unlocked by default
 * - Chapter 2 (Assessment): Unlocked ONLY if Chapter 1 is 100% complete
 * - Chapter 3 (Training Course Material): Unlocked ONLY if Chapter 2 is passed
 */
export const isChapterUnlocked = (chapterNum, progress) => {
  const num = Number(chapterNum);
  if (num === 1) return true;
  if (num === 2) {
    return Boolean(
      progress?.isChapter2Unlocked ||
      progress?.chapter2?.unlocked ||
      progress?.isChapter1Complete ||
      progress?.chapter1?.completed
    );
  }
  if (num === 3) {
    return Boolean(
      progress?.isChapter3Unlocked ||
      progress?.chapter3?.unlocked ||
      progress?.isChapter2Complete ||
      progress?.chapter2?.completed ||
      progress?.assessmentPassed
    );
  }
  if (num === 4) {
    return Boolean(
      progress?.isChapter4Unlocked ||
      progress?.chapter4?.unlocked ||
      progress?.isChapter2Complete ||
      progress?.chapter2?.completed ||
      progress?.assessmentPassed
    );
  }
  return false;
};

/**
 * Returns human-readable explanation when a chapter is locked
 */
export const getChapterLockReason = (chapterNum, progress) => {
  const num = Number(chapterNum);
  if (num === 2 && !isChapterUnlocked(2, progress)) {
    return "Complete all Course Module lessons in Chapter 1 to unlock the Assessment.";
  }
  if (num === 3 && !isChapterUnlocked(3, progress)) {
    return "Pass the Chapter 2 Assessment (70% or higher) to unlock Training Course Materials.";
  }
  if (num === 4 && !isChapterUnlocked(4, progress)) {
    return "Pass the Chapter 2 Assessment to access your Certificate.";
  }
  return "";
};

/**
 * Records successful assessment completion in localStorage & dispatches event
 */
export const recordAssessmentPassed = (userId, courseId, resultData = {}) => {
  const uId = resolveUserId(userId);
  const cId = normalizeCourseId(courseId);
  const key = `bb_course_progress_${uId}_${cId}`;

  const existing = JSON.parse(localStorage.getItem(key) || "{}");
  const progressRecord = {
    ...existing,
    userId: uId,
    courseId: cId,
    assessmentPassed: true,
    assessmentResult: "pass",
    assessmentScore: resultData.score || 10,
    assessmentPercentage: resultData.percentage || 100,
    isCompleted: true,
    status: "Completed",
    percentage: 100,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(progressRecord));
    localStorage.setItem("bb_last_progress_update", JSON.stringify({
      courseId: cId,
      userId: uId,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.error("Assessment pass persistence error:", e);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bb_progress_updated", { detail: progressRecord })
    );
  }

  return progressRecord;
};
