# BROADBEACH ONLINE LMS — API & BACKEND AUDIT REPORT
**Audit Date:** November 07, 2026  
**Auditor:** Principal Backend Architect, PHP API Developer & Security Engineer  
**Environments Tested:**
- Local Proxy: `http://localhost:3000/api` (Node/Express Vite Middleware)
- Production Backend: `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api` (Apache/PHP 8.x)  
**Deep-Dive Test Dataset:** [scripts/api_deep_dive_results.json](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/api_deep_dive_results.json)

---

## 1. Backend Architecture & Dual Environment Model

The Broadbeach Academy platform operates on a split frontend-backend architecture:
1. **Frontend Hosting:** Static bundle hosted on GitHub Pages with custom domain `https://broadbeachonline.com`.
2. **Backend API Hosting:** Traditional Apache/PHP server with MySQL database hosted at `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api`.
3. **Local Dev Environment:** Vite dev server with in-memory admin middleware (`src/server/adminMiddleware.js`) providing local API mocks and proxying.

---

## 2. API Endpoint Inventory & Comparison Matrix

| # | Endpoint Route | HTTP Method | Expected Purpose | Local Proxy Status | CADAC Remote Status | Remote CORS Header |
|---|---|---|---|---|---|---|
| 1 | `/profile` | GET | Current learner session profile | 401 Unauthorized | 401 Unauthorized | `undefined` (Blocked) |
| 2 | `/my-courses` | GET | Enrolled courses for active user | 200 OK | 401 Unauthorized | `undefined` (Blocked) |
| 3 | `/tickets` | POST | Submit support ticket | 422 (Validation) | **404 Not Found** | `undefined` (Blocked) |
| 4 | `/tickets/my` | GET | Fetch learner tickets by email | 200 OK | **404 Not Found** | `undefined` (Blocked) |
| 5 | `/certificates/verify` | GET | Public certificate verification | 404 (Not Found) | 404 (Not Found) | `undefined` (Blocked) |
| 6 | `/login` | POST | Learner login authentication | 401 (Bad Creds) | 401 (Bad Creds) | `undefined` (Blocked) |
| 7 | `/register` | POST | Student account registration | 201 Created | 200 OK | `undefined` (Blocked) |
| 8 | `/course-enquiry` | POST | Register paid course enquiry | 201 Created | **404 Not Found** | `undefined` (Blocked) |
| 9 | `/course-progress` | GET | Chapter lock/unlock status | 200 OK | 200 OK | `undefined` (Blocked) |
| 10 | `/tickets` | OPTIONS | CORS preflight check | 204 No Content | 204 No Content | `undefined` (Blocked) |

---

## 3. Critical Findings & Forensic Analysis

---

### API-P0-01: Production CORS Block for `https://broadbeachonline.com`
- **Severity:** P0 Critical
- **Component:** `cors.php` / `.htaccess` on `https://cadac.in`
- **Network Request Trace:**
  ```http
  OPTIONS /broadbeachlearning.com/broadbeach-backend/api/tickets HTTP/1.1
  Host: cadac.in
  Origin: https://broadbeachonline.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: content-type, accept

  HTTP/1.1 204 No Content
  Date: Fri, 07 Nov 2026 16:34:29 GMT
  Server: Apache
  Connection: keep-alive
  ```
- **Finding:**
  The response is completely **missing** `Access-Control-Allow-Origin: https://broadbeachonline.com` and `Access-Control-Allow-Credentials: true`.
- **Impact:**
  Modern browsers (Chrome, Edge, Safari, Firefox) immediately block all asynchronous `fetch()` and `axios` calls originating from `https://broadbeachonline.com` to `https://cadac.in`, throwing a `CORS error (Cross-Origin Request Blocked)`.
- **Root Cause:**
  The Apache PHP configuration on `cadac.in` only whitelist origins explicitly configured in PHP. While `localhost:3000` and `broadbeachlearning.com` were whitelisted historically, the new production domain `broadbeachonline.com` was not added to `$allowedOrigins` in `cors.php`.
- **Remediation Code Fix (PHP):**
  ```php
  <?php
  // cors.php on cadac.in
  $allowedOrigins = [
      'https://broadbeachonline.com',
      'https://www.broadbeachonline.com',
      'http://localhost:3000',
      'http://localhost:5173'
  ];

  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if (in_array($origin, $allowedOrigins, true)) {
      header("Access-Control-Allow-Origin: $origin");
      header("Access-Control-Allow-Credentials: true");
      header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
      header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-Token, Accept");
  }

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(204);
      exit(0);
  }
  ```

---

### API-P0-02: Missing Ticket & Enquiry API Routes on Remote Server
- **Severity:** P0 Critical
- **Endpoints:**
  - `POST /api/tickets`
  - `GET /api/tickets/my`
  - `POST /api/course-enquiry`
- **Finding:**
  When requested on `cadac.in`, the server returns HTTP 404:
  ```json
  {
    "success": false,
    "message": "API route not found.",
    "method": "POST",
    "path": "/api/tickets"
  }
  ```
- **Root Cause:**
  The centralized router (`routes.php` / `index.php`) on `cadac.in` does not register the ticket routes or course enquiry handler. In the local repository, these routes are fully defined in [`src/server/adminMiddleware.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/server/adminMiddleware.js#L703-L820), and export scripts exist in [`scripts/build_cadac_sync_package.mjs`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/build_cadac_sync_package.mjs).
- **Remediation:**
  Deploy the pre-built synchronization files to CADAC production Apache directory.

---

### API-P1-01: Parameter Inconsistency in Certificate Verification
- **Severity:** P1 High
- **Endpoint:** `GET /api/certificates/verify`
- **Issue:**
  - Backend expectation: Query parameter MUST be `certificate_number` (`?certificate_number=...`).
  - If a client passes `?serial=...` or `?id=...`, the backend throws HTTP 400 Bad Request:
    ```json
    {
      "success": false,
      "status": false,
      "message": "Please enter a certificate number."
    }
    ```
- **Remediation:**
  Update the backend controller to accept any of `certificate_number`, `serial`, `serial_number`, or `id`, providing backwards and cross-client compatibility:
  ```php
  $certNumber = $_GET['certificate_number'] ?? $_GET['serial'] ?? $_GET['serial_number'] ?? $_GET['id'] ?? '';
  ```

---

## 4. Authentication & Security Header Audit

- **Bearer Token Support:** Supported via `Authorization: Bearer <token>` and `X-User-Token`.
- **Content-Type Enforcement:** Local and remote endpoints correctly enforce `Content-Type: application/json`.
- **Password Masking:** Passwords in `/api/login` and `/api/register` are excluded from API response JSON bodies.
- **Payload Validation:** Validation on `/tickets` returns HTTP 422 Unprocessable Entity when required fields (`name`, `email`, `category`, `message`) are missing.

