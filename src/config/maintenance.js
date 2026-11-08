/**
 * Broadbeach Online — Centralized Maintenance Mode Controller
 * 
 * Set `MAINTENANCE_MODE` to true to route all public traffic to the custom Under Maintenance page.
 * Set `MAINTENANCE_MODE` to false to immediately restore full public operations.
 * 
 * Controlled by VITE_MAINTENANCE_MODE environment flag or direct toggle below.
 */

// Testing Clone Maintenance Flag:
// Defaults to false so that the entire testing LMS (all courses, player, assessments,
// student/admin dashboards) is fully functional and testable out of the box.
// Can be toggled to true for testing maintenance behavior by setting VITE_MAINTENANCE_MODE=true.
export const IS_MAINTENANCE_MODE = 
  import.meta.env.VITE_MAINTENANCE_MODE === "true" ||
  import.meta.env.VITE_MAINTENANCE_MODE === true ||
  false;

export default IS_MAINTENANCE_MODE;
