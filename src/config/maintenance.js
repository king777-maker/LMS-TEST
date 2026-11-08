/**
 * Broadbeach Online — Centralized Maintenance Mode Controller
 * 
 * Set `MAINTENANCE_MODE` to true to route all public traffic to the custom Under Maintenance page.
 * Set `MAINTENANCE_MODE` to false to immediately restore full public operations.
 * 
 * Controlled by VITE_MAINTENANCE_MODE environment flag or direct toggle below.
 */

// Production Maintenance Flag
export const IS_MAINTENANCE_MODE = 
  import.meta.env.VITE_MAINTENANCE_MODE === "true" ||
  import.meta.env.VITE_MAINTENANCE_MODE === true ||
  true; // Currently ACTIVE for scheduled maintenance

export default IS_MAINTENANCE_MODE;
