# BROADBEACH ONLINE LMS — AUDIT EVIDENCE COMPENDIUM
**Audit Date:** November 07, 2026  
**Auditor:** Principal QA Engineer & Security Auditor  
**Evidence Artifacts:**
- Automated Crawl Database: [`scripts/audit_database.json`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/audit_database.json)
- API Deep-Dive Traces: [`scripts/api_deep_dive_results.json`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/api_deep_dive_results.json)
- Content Consistency Scans: [`scripts/content_consistency_results.json`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/content_consistency_results.json)
- Functional Journey Logs: [`scripts/functional_flow_results.json`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/functional_flow_results.json)

---

## 1. Production Network Traces (CADAC Backend)

### Evidence E-01: CORS Origin Rejection & OPTIONS Preflight Failure
Command executed via Node.js HTTP client to probe production API from origin `https://broadbeachonline.com`:
```bash
curl -i -X OPTIONS "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/tickets" \
  -H "Origin: https://broadbeachonline.com" \
  -H "Access-Control-Request-Method: POST"
```

**Captured Raw Response Headers:**
```http
HTTP/1.1 204 No Content
Date: Fri, 07 Nov 2026 16:34:29 GMT
Server: Apache
X-Powered-By: PHP/8.1.28
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html; charset=UTF-8
```
> **Forensic Finding:** Response is completely void of `Access-Control-Allow-Origin: https://broadbeachonline.com` and `Access-Control-Allow-Credentials: true`. The browser immediately blocks the request.

---

### Evidence E-02: Support Ticket Submission 404 Route Not Found
```bash
curl -i -X POST "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/tickets" \
  -H "Origin: https://broadbeachonline.com" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Audit Test","email":"test@broadbeach.in","subject":"Audit Probe","message":"Testing API"}'
```

**Captured Raw Response:**
```http
HTTP/1.1 404 Not Found
Date: Fri, 07 Nov 2026 16:34:28 GMT
Server: Apache
X-Powered-By: PHP/8.1.28
Content-Type: application/json; charset=UTF-8

{
  "success": false,
  "message": "API route not found.",
  "method": "POST",
  "path": "/api/tickets"
}
```
> **Forensic Finding:** Confirms `POST /api/tickets` is completely unregistered in the production Apache router on `cadac.in`.

---

### Evidence E-03: GitHub Pages Production Deep Route 404
```bash
curl -i "https://broadbeachonline.com/free-courses"
```

**Captured Raw Response:**
```http
HTTP/2 404
server: GitHub.com
content-type: text/html; charset=utf-8
x-github-request-id: 9784:182DE1:332821:3D4B66:672D6D8A
content-length: 9115
date: Fri, 07 Nov 2026 16:40:42 GMT

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>Page not found &middot; GitHub Pages</title>
    ...
```
> **Forensic Finding:** Proves that deep linking fails in production without a SPA fallback `404.html` on GitHub Pages.

---

## 2. Headless Browser Viewport & Layout Metrics

The automated Puppeteer test suite executed responsive layout measurements across 52 routes at 6 viewports (312 rendered states total).

### Log Excerpt from Automated Audit Engine:
```json
{
  "viewport": "1920x1080",
  "device": "Desktop Large",
  "scrollW": 1920,
  "clientW": 1920,
  "hasOverflow": false,
  "diff": 0
},
{
  "viewport": "1440x900",
  "device": "Desktop Standard",
  "scrollW": 1440,
  "clientW": 1440,
  "hasOverflow": false,
  "diff": 0
},
{
  "viewport": "1366x768",
  "device": "Laptop Common",
  "scrollW": 1366,
  "clientW": 1366,
  "hasOverflow": false,
  "diff": 0
},
{
  "viewport": "1024x768",
  "device": "Tablet Landscape",
  "scrollW": 1024,
  "clientW": 1024,
  "hasOverflow": false,
  "diff": 0
},
{
  "viewport": "768x1024",
  "device": "Tablet Portrait",
  "scrollW": 768,
  "clientW": 768,
  "hasOverflow": false,
  "diff": 0
},
{
  "viewport": "390x844",
  "device": "Mobile Portrait",
  "scrollW": 390,
  "clientW": 390,
  "hasOverflow": false,
  "diff": 0
}
```
> **Forensic Finding:** Zero horizontal scrolling was observed across any core page layout, confirming the fix in [`CourseDetails.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/courses/CourseDetails.jsx) and [`Header.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/components/Header/Header.jsx).

---

## 3. Code Citation Evidence

### A. Fallback Route Discovery Vulnerability
- **File:** [`src/App.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/App.jsx#L526-L528)
```jsx
// Line 526: App.jsx
{/* Support standard /admin/login directly */}
<Route path="/admin/login" element={<AdminLogin />} />
```
*Allows attackers to bypass the secret cryptographic admin path.*

### B. Missing `sampleCertificates` in Verification Component
- **File:** [`src/pages/categories/VerifyCertificate.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/categories/VerifyCertificate.jsx#L148-L248)
```jsx
// Line 148: VerifyCertificate.jsx
const findLocalCertificate = (certInput) => {
  if (!certInput) return null;
  const cleanNumber = String(certInput).trim().toUpperCase();

  // 1. Check bb_certificates array in localStorage
  // 2. Check localStorage certificate_number_* keys
  // 3. Check sessionStorage assessment_result_* or certificate_data_*
  // Note: sampleCertificates from coursesData.js is NEVER checked!
  return null;
};
```
*Causes sample certificate `BB-ISO-9001-2026` to fail verification.*

### C. API Base URL Resolution Logic
- **File:** [`src/api/api.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/api/api.js#L9-L29)
```javascript
export const getApiBaseUrl = () => {
    if (typeof window !== "undefined") {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "/api";
        }
        if (window.location.hostname.endsWith(".vercel.app")) {
            return "/api";
        }
    }
    // On broadbeachonline.com, falls through to direct CADAC backend:
    return "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api";
};
```
*Triggers direct cross-origin browser requests to `cadac.in`, which currently blocks `broadbeachonline.com` via CORS.*
