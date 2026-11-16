/**
 * Centralized Storage Keys — Broadbeach Online Academy
 * Typed constants for all localStorage and sessionStorage access.
 * Prevents hidden links, namespace drift, and key fragmentation.
 */

export const STORAGE_KEYS = {
  // Learner Auth
  USER: "bb_user",
  USER_LEGACY: "user",
  USER_TOKEN: "bb_user_token",
  USER_ID: "bb_user_id",
  USER_EMAIL: "bb_user_email",

  // Admin Auth
  ADMIN_TOKEN: "bb_admin_token",
  ADMIN_USER: "bb_admin_user",
  ADMIN_STORE: "bb_admin_store",

  // LMS Learner State
  ENROLLED_COURSES: "bb_enrolled_courses",
  CERTIFICATES: "bb_certificates",
  LAST_PROGRESS_UPDATE: "bb_last_progress_update",

  // Manual Certification Master State
  MANUAL_CERTIFICATES: "broadbeach_manual_certificates",
  MANUAL_CERT_OVERRIDES: "broadbeach_manual_cert_overrides",

  // Preferences & Compliance
  COOKIE_CONSENT: "bb_cookie_consent_v1",
  CART: "broadbeach_cart",
};

export default STORAGE_KEYS;
