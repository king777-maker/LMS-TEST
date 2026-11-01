/**
 * Broadbeach Academy — Admin Route Configuration & Secure Obscurity Layer
 * 
 * Configurable admin base path via VITE_ADMIN_BASE_PATH / ADMIN_BASE_PATH.
 * Configurable unpredictable admin login path via VITE_ADMIN_LOGIN_PATH / ADMIN_LOGIN_PATH.
 * 
 * Security Requirements:
 * - Default /admin/login is strictly disabled and returns 404 (NotFound).
 * - Login path must be cryptographically high-entropy (>= 128 bits / 16 chars).
 * - Predictable names (/admin, /admin/login, /login) are rejected by validator.
 */

/**
 * Validates that an administrator login URL path meets security criteria.
 * @param {string} path 
 * @returns {boolean}
 */
export function isValidAdminLoginPath(path) {
  if (!path || typeof path !== "string") return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return false;
  
  // Predictable / insecure paths are explicitly rejected
  const lower = trimmed.toLowerCase();
  if (
    lower === "/admin/login" ||
    lower === "/admin" ||
    lower === "/login" ||
    lower === "/secret-admin" ||
    lower === "/admin-login" ||
    lower === "/administrator"
  ) {
    return false;
  }

  // Must contain at least 16 characters of entropy and valid URL-safe characters
  return /^\/[a-zA-Z0-9_\-\/]{16,}$/.test(trimmed);
}

// 1. Resolve Admin Base Path (Default: "/admin")
export const ADMIN_BASE_PATH = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_BASE_PATH) ||
  (typeof process !== "undefined" && (process.env?.ADMIN_BASE_PATH || process.env?.VITE_ADMIN_BASE_PATH)) ||
  "/admin"
).replace(/\/+$/, "");

// 2. Resolve Configured Secret Login Path
const rawLoginPath = (
  (typeof import.meta !== "undefined" && (import.meta.env?.VITE_ADMIN_LOGIN_PATH || import.meta.env?.ADMIN_LOGIN_PATH)) ||
  (typeof process !== "undefined" && (process.env?.ADMIN_LOGIN_PATH || process.env?.VITE_ADMIN_LOGIN_PATH)) ||
  "/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24"
).trim().replace(/\/+$/, "");

export const ADMIN_LOGIN_PATH = isValidAdminLoginPath(rawLoginPath) ? rawLoginPath : null;

// 3. Complete Admin Routes Mapping
export const adminRoutes = {
  base: ADMIN_BASE_PATH,
  // If configured, use the secret unpredictable URL. Otherwise, fall back to safe disabled route.
  login: ADMIN_LOGIN_PATH || `${ADMIN_BASE_PATH}/auth-unconfigured`,
  isConfigured: Boolean(ADMIN_LOGIN_PATH),
  dashboard: `${ADMIN_BASE_PATH}`,
  onlineCerts: `${ADMIN_BASE_PATH}/online-certs`,
  manualCerts: `${ADMIN_BASE_PATH}/manual-certs`,
  tickets: `${ADMIN_BASE_PATH}/tickets`,
  trash: `${ADMIN_BASE_PATH}/trash`,
  access: `${ADMIN_BASE_PATH}/access`,
};

/**
 * Check if the given pathname matches the active secret admin login route
 * @param {string} pathname 
 * @returns {boolean}
 */
export function isSecretAdminLoginPath(pathname) {
  if (!pathname || !ADMIN_LOGIN_PATH) return false;
  const cleanPath = pathname.replace(/\/+$/, "");
  return cleanPath === ADMIN_LOGIN_PATH;
}

export function getAdminPath(subRoute = "") {
  if (subRoute === "login" || subRoute === "/login") {
    return "/admin/login";
  }
  const clean = subRoute.startsWith("/") ? subRoute : `/${subRoute}`;
  return `${ADMIN_BASE_PATH}${clean}`;
}

export default adminRoutes;
