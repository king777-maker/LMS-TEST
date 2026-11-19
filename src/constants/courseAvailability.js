/**
 * Broadbeach Academy — Phase 1 Launch Strategy & Course Availability Configuration
 * 
 * Business Rule:
 * Phase 1 launches free online courses only.
 * Professional certification courses (Internal Auditor, Lead Auditor, Health&Safety (HSE),
 * Professional Certifications, etc.) are available through offline batches only.
 */

export const LAUNCH_PHASE = 1;

export const COURSE_STATUS = {
  AVAILABLE: 'available',
  LAUNCHING_SOON: 'launching_soon'
};

export const LAUNCH_TEXT = {
  STATUS_LABEL: 'Coming soon, Enroll now',
  AVAILABILITY_NOTICE: 'Online enrollment for this program is not available yet. We are currently offering selected training through offline batches. Submit an enquiry to receive availability and enrollment information.',
  CTA_LABEL: 'Coming soon, Enroll now',
  SUCCESS_MESSAGE: (courseTitle = 'this course') =>
    `Thank you for your enquiry regarding ${courseTitle}. We have received your request and our admissions team will contact you shortly with offline batch schedules and enrollment details.`
};

export const LAUNCH_STATUS_CONFIG = {
  label: 'Coming soon, Enroll now',
  notice: 'Online enrollment for this program is not available yet. We are currently offering selected training through offline batches. Submit an enquiry to receive availability and enrollment information.',
  cta: 'Coming soon, Enroll now',
  successMessage: (courseTitle = 'this course') =>
    `Thank you for your enquiry regarding ${courseTitle}. We have received your request and our admissions team will contact you shortly with offline batch schedules and enrollment details.`
};

const FREE_ONLINE_IDENTIFIERS = new Set([
  'free-courses',
  'free-1', 'free-2', 'free-3', 'free-4', 'free-5', 'free-6', 'free-7', 'free-8', 'free-9', 'free-10', 'free-11',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
  '322', '332', '323', '324', '325', '333', '326', '327', '328', '329', '330',
  'iso-9001-2015-quality-management-foundation',
  'iso-9001-2026-qms-awareness',
  'iso9001-2026-qms-awareness',
  'iso-14001-2015-environmental-foundation',
  'iso14001-2026-ems-awareness',
  'iso-14001-2026-ems-awareness',
  'iso-45001-2018-ohs-awareness-course',
  'iso-45001-2018-ohsms-awareness',
  'iso45001-2018-ohsms-awareness',
  'iso-22000-2018-food-safety-foundation',
  'iso-22000-2018-fsms-awareness',
  'iso22000-2018-fsms-awareness',
  'iso-19011-2026-awareness',
  'iso19011-2026-awareness',
  'iso-19011-2018-auditing-guidelines-overview',
  'iso-27001-2022-information-security-foundation',
  'iso-27001-2022-isms-awareness',
  'iso27001-2022-isms-awareness',
  '5s-workplace-management',
  '5s-wm',
  '7qc-tools-certification',
  'project-management-level-1',
  'project-management-level-i',
  'lean-six-sigma-whitebelt',
  'lean-six-sigma-white-belt',
  'lean-six-sigma-white-belt-foundation',
  'root-cause-analysis',
]);

export const FREE_COURSE_DB_MAP = {
  // Course 1: ISO 9001:2026 QMS Awareness (322)
  "free-1": 322,
  "1": 322,
  "322": 322,
  "iso-9001-2015-quality-management-foundation": 322,
  "iso-9001-2026-qms-awareness": 322,
  "iso9001-2026-qms-awareness": 322,
  "iso-9001": 322,
  "iso9001": 322,
  "qms": 322,
  "qms-awareness": 322,

  // Course 2: ISO 14001:2026 EMS Awareness (332)
  "free-2": 332,
  "2": 332,
  "332": 332,
  "iso-14001-2015-environmental-foundation": 332,
  "iso-14001-2026-ems-awareness": 332,
  "iso14001-2026-ems-awareness": 332,
  "iso-14001": 332,
  "iso14001": 332,
  "ems": 332,
  "ems-awareness": 332,
  "environmental-foundation": 332,

  // Course 3: ISO 45001:2018 OHSMS Awareness (323)
  "free-3": 323,
  "3": 323,
  "323": 323,
  "iso-45001-2018-ohs-awareness-course": 323,
  "iso-45001-2018-ohsms-awareness": 323,
  "iso45001-2018-ohsms-awareness": 323,
  "iso-45001": 323,
  "iso45001": 323,
  "ohsms": 323,
  "ohsms-awareness": 323,

  // Course 4: ISO 22000:2018 FSMS Awareness (324)
  "free-4": 324,
  "4": 324,
  "324": 324,
  "iso-22000-2018-food-safety-foundation": 324,
  "iso-22000-2018-fsms-awareness": 324,
  "iso22000-2018-fsms-awareness": 324,
  "iso-22000": 324,
  "iso22000": 324,
  "fsms": 324,
  "fsms-awareness": 324,

  // Course 5: ISO 19011:2026 Awareness (325)
  "free-5": 325,
  "5": 325,
  "325": 325,
  "iso-19011-2026-awareness": 325,
  "iso19011-2026-awareness": 325,
  "iso-19011-2018-auditing-guidelines-overview": 325,
  "iso-19011": 325,
  "iso19011": 325,

  // Course 6: ISO 27001:2022 ISMS Awareness (333)
  "free-6": 333,
  "6": 333,
  "333": 333,
  "iso-27001-2022-information-security-foundation": 333,
  "iso-27001-2022-isms-awareness": 333,
  "iso27001-2022-isms-awareness": 333,
  "iso-27001": 333,
  "iso27001": 333,
  "isms": 333,
  "isms-awareness": 333,

  // Course 7: 5S Workplace Management (326)
  "free-7": 326,
  "7": 326,
  "326": 326,
  "5s-workplace-management": 326,
  "5s-wm": 326,
  "5s": 326,

  // Course 8: 7QC Tools Certification (327)
  "free-8": 327,
  "8": 327,
  "327": 327,
  "7qc-tools-certification": 327,
  "7-qc-tools": 327,
  "7qc": 327,
  "7-qc": 327,

  // Course 9: Project Management Level-1 (328)
  "free-9": 328,
  "9": 328,
  "328": 328,
  "project-management-level-1": 328,
  "project-management-level-i": 328,
  "project-management-fnd": 328,
  "project-management": 328,

  // Course 10: Lean Six Sigma White Belt (329)
  "free-10": 329,
  "10": 329,
  "329": 329,
  "lean-six-sigma-whitebelt": 329,
  "lean-six-sigma-white-belt": 329,
  "lean-six-sigma-white-belt-foundation": 329,
  "lean-six-sigma": 329,
  "white-belt": 329,

  // Course 11: Root Cause Analysis (330)
  "free-11": 330,
  "11": 330,
  "330": 330,
  "root-cause-analysis": 330,
  "rca-certification": 330,
  "rca-fnd": 330,
  "rca": 330,
  "root-cause": 330,
};

/**
 * Validates whether a course is available for self-paced online learning in Phase 1.
 * Free courses (e.g. ID starting with 'free-', category 'free-courses', or price === 0)
 * are available online now.
 * Professional certification courses are available for offline batches only.
 */
export function isCourseOnlineAvailable(courseOrId, optionalCourseObj) {
  if (!courseOrId && !optionalCourseObj) return false;

  const checkObj = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.is_free === true || obj.isFree === true) return true;
    const cat = String(obj.category || '').toLowerCase();
    const idStr = String(obj.id || '').toLowerCase();
    const slugStr = String(obj.slug || '').toLowerCase();
    const tagStr = String(obj.tag || obj.badge || '').toLowerCase();

    if (
      cat.includes('free') ||
      tagStr.includes('free') ||
      idStr.startsWith('free-') ||
      slugStr.startsWith('free-') ||
      FREE_ONLINE_IDENTIFIERS.has(idStr) ||
      FREE_ONLINE_IDENTIFIERS.has(slugStr)
    ) {
      return true;
    }

    if (Number(obj.price) === 0 && obj.price !== undefined && obj.price !== null) {
      return true;
    }
    return false;
  };

  if (optionalCourseObj && checkObj(optionalCourseObj)) {
    return true;
  }

  if (typeof courseOrId === 'object') {
    return checkObj(courseOrId);
  }

  const str = String(courseOrId).toLowerCase().trim();
  if (str.startsWith('free-') || FREE_ONLINE_IDENTIFIERS.has(str)) {
    return true;
  }
  return false;
}

export default {
  LAUNCH_PHASE,
  COURSE_STATUS,
  LAUNCH_TEXT,
  LAUNCH_STATUS_CONFIG,
  isCourseOnlineAvailable,
};
