# BROADBEACH ONLINE LMS — SECURITY AUDIT REPORT
**Audit Date:** November 07, 2026  
**Auditor:** Principal Security Engineer & Full-Stack Security Auditor  
**Scope:** Authentication Flow, Admin Route Governance, Token Security, Storage Posture, HTTP Security Headers, and Input Sanitization

---

## 1. Executive Security Evaluation

```
┌───────────────────────────────────────┬──────────────┬───────────────┐
│ Security Domain                       │ Risk Level   │ Status        │
├───────────────────────────────────────┼──────────────┼───────────────┤
│ CORS Policy Configuration             │ High         │ Misconfigured │
│ Authentication & Token Storage        │ Medium       │ Acceptable    │
│ Administrative Surface Protection     │ Medium       │ Good/Fallback │
│ Cross-Site Scripting (XSS) Posture    │ Low          │ Protected     │
│ HTTP Security Headers (Static Host)   │ Medium       │ Missing       │
│ SQL / Command Injection               │ Low          │ Parameterized │
└───────────────────────────────────────┴──────────────┴───────────────┘
```

---

## 2. Granular Security Findings

---

### SEC-01: Cross-Origin Resource Sharing (CORS) Configuration Gap (P0 Critical)
- **Vulnerability:** Absence of `Access-Control-Allow-Origin: https://broadbeachonline.com` on `cadac.in` API responses.
- **Security Impact:** While strict CORS protects servers from unauthorized domains, the omission of the primary production domain renders legitimate client-side API requests broken. Furthermore, using wildcard `Access-Control-Allow-Origin: *` in conjunction with `Access-Control-Allow-Credentials: true` is strictly prohibited by browser security specifications.
- **Recommendation:** Implement an explicit origin whitelist in `cors.php` validating `$_SERVER['HTTP_ORIGIN']` against approved domains (`https://broadbeachonline.com`, `https://www.broadbeachonline.com`, `http://localhost:3000`).

---

### SEC-02: JWT & Session Token Storage in `localStorage` (P1 High)
- **Vulnerability:**
  Authentication tokens (`bb_user_token`, `bb_user`, `bb_admin_token`) are persisted in browser `localStorage`.
- **Location:** [`src/context/AuthContext.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/context/AuthContext.jsx), [`src/api/api.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/api/api.js#L44)
- **Security Impact:**
  Any script running on the domain (including third-party scripts, analytics libraries, or an injected script via an XSS flaw) has unrestricted access to `localStorage.getItem("bb_user_token")`.
- **Recommendation:**
  1. Migrate session tokens to `HttpOnly`, `Secure`, `SameSite=Lax` cookies set by the backend server.
  2. If `localStorage` must be retained during this transitional architecture, ensure Content Security Policy (CSP) restricts external script execution.

---

### SEC-03: Fallback Public `/admin/login` Route Bypasses Secret Admin Path (P2 Medium)
- **Vulnerability:**
  The system implements a configurable cryptographically random secret admin login path via [`src/utils/adminRoutes.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/utils/adminRoutes.js) (e.g. `/admin-a9f81b3...`). However, [`src/App.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/App.jsx#L527) still registers the standard fallback route:
  ```jsx
  {/* Support standard /admin/login directly */}
  <Route path="/admin/login" element={<AdminLogin />} />
  ```
- **Security Impact:**
  Automated crawlers, scanners, and brute-force bots can locate the administrative login interface at standard `/admin/login`, nullifying the obscurity benefit of the secret route.
- **Recommendation:**
  In production builds (`import.meta.env.PROD`), disable the `/admin/login` alias and require knowledge of the configured secret route, or enforce IP whitelisting / multi-factor authentication (MFA) on `/admin/login`.

---

### SEC-04: Missing Modern HTTP Security Headers on GitHub Pages (P2 Medium)
- **Vulnerability:**
  Probing `https://broadbeachonline.com/` indicates GitHub Pages does not emit customized HTTP security response headers:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- **Security Impact:**
  Leaves the frontend vulnerable to clickjacking (`X-Frame-Options`), MIME-sniffing attacks (`X-Content-Type-Options: nosniff`), and unrestricted asset loading.
- **Recommendation:**
  1. Inject `<meta http-equiv="Content-Security-Policy" content="...">` and `<meta http-equiv="X-Content-Type-Options" content="nosniff">` in [`index.html`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/index.html).
  2. When migrating production routing to Cloudflare / Vercel proxy, configure standard edge security headers.

---

### SEC-05: Client-Side Input Sanitization on Support Ticket & Enquiry Forms (P2 Medium)
- **Evaluation:**
  Support ticket messages and enquiry notes accept rich text and multi-line strings.
- **Current State:**
  Input values are bound directly via React state (`value={message}`) which escapes standard HTML output when rendered. However, backend storage must sanitize SQL entities and prevent stored XSS when tickets are viewed by administrators in [`TicketMaster.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/TicketMaster.jsx).
- **Recommendation:**
  Enforce `htmlspecialchars()` or `strip_tags()` on the PHP backend controller before database persistence, and verify DOMPurify is used if rendering formatted ticket replies.

---

### SEC-06: Brute-Force Rate Limiting on Login & Certificate Search (P2 Medium)
- **Evaluation:**
  - Neither `/api/login` nor `/api/certificates/verify` currently implements rate limiting.
  - A malicious actor can execute thousands of sequential certificate verification queries (`BB-ISO-0001`, `BB-ISO-0002`...) to harvest valid student credentials.
- **Recommendation:**
  Implement IP-based rate limiting on `cadac.in` (e.g. max 30 verification queries per minute per IP, max 5 failed login attempts per 15 minutes).
