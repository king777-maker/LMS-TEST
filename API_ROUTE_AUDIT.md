# Broadbeach Academy LMS — Comprehensive API Route & Architecture Audit

**Target Backend:** PHP REST API on Apache / MySQL (`broad_beach_online`)  
**Base Path:** `/api` (`/broadbeachlearning.com/broadbeach-backend/api`)  
**Audit Date:** November 2026  
**Auditor:** Principal Full-Stack & Security Engineering

---

## 1. Route Inventory & Authorization Matrix

| Endpoint | Method | Controller File | Controller Method | Auth Method | Required Headers | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/login` | POST | `AuthController.php` | `login()` | None (Public) | `Content-Type: application/json` | Verified (Issues Token) |
| `/api/register` | POST | `AuthController.php` | `register()` | None (Public) | `Content-Type: application/json` | Verified (Issues Token) |
| `/api/logout` | POST | `AuthController.php` | `logout()` | Bearer / Session | `Authorization: Bearer <token>` | Verified |
| `/api/profile` | GET | `AuthController.php` | `currentUser()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** (Returns 401 unauth / 200 auth) |
| `/api/profile` | PUT | `AuthController.php` | `updateProfile()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** (Name Immutable) |
| `/api/update-profile` | POST | `AuthController.php` | `updateProfile()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/my-courses` | GET | `EnrollmentController.php` | `getMyCourses()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** (Returns real enrollments) |
| `/api/enroll-course` | POST | `EnrollmentController.php` | `enrollCourse()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/my-enrollments` | GET | `EnrollmentController.php` | `getMyEnrollments()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/tickets` | POST | `TicketController.php` | `submit()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** (Fixed 404 & Token Auth) |
| `/api/tickets/my` | GET | `TicketController.php` | `getMyTickets()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** (Fixed 404 & IDOR Protected) |
| `/api/tickets/{id}` | GET | `TicketController.php` | `getTicket($id)` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/tickets/{id}/reply`| POST | `TicketController.php` | `reply($id)` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/assessment` | GET | `AssessmentController.php` | `show()` | Bearer / Session | `Authorization` or `X-User-Token` | Verified (Chapter Guard) |
| `/api/submit-assessment`| POST | `AssessmentController.php` | `submitAssessment()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** (Token Supported) |
| `/api/course-progress` | GET | `CourseProgressController.php`| `show()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/complete-lesson` | POST | `CourseProgressController.php`| `store()` | Bearer / Session | `Authorization` or `X-User-Token` | **REPAIRED** |
| `/api/free-certifications` | GET | `CourseController.php` | `index()` | Public | None | Verified |
| `/api/course-enquiry` | POST | `EnrollmentEnquiryController.php`| `submit()` | Public | Bot Honeypot | Verified |
| `/api/certificates/verify`| GET | `VerifyCertificateController.php`| `verify()` | Public | None | Verified |
| `/api/admin/login` | POST | `AdminAuthController.php` | `login()` | None (Admin Auth) | `Content-Type: application/json` | Verified |
| `/api/admin/me` | GET | `AdminAuthController.php` | `currentUser()` | Admin Bearer Token | `Authorization: Bearer <adm_token>`| Verified |
| `/api/admin/tickets` | GET | `AdminModulesController.php` | `getTickets()` | Admin Bearer Token | `Authorization: Bearer <adm_token>`| Verified |
| `/api/admin/overview` | GET | `AdminModulesController.php` | `getOverview()` | Admin Bearer Token | `Authorization: Bearer <adm_token>`| Verified |

---

## 2. CORS & Header Normalization Audit

In `app/config/cors.php`, the Allowed Headers list was updated to permit cross-origin custom headers used across Vercel and direct API calls:
```php
$allowedHeaders = [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Requested-With",
    "X-User-Email",
    "X-User-Token",
    "X-Admin-Token"
];
header("Access-Control-Allow-Headers: " . implode(", ", $allowedHeaders));
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
```

---

## 3. Discrepancies Fixed in `app/routes/api.php`

1. **Ticket Route Registration (The 404 Fix):**
   Prior to this repair, `app/routes/api.php` did not register endpoints for learner support tickets, causing `POST /api/tickets` and `GET /api/tickets/my` to fall through to 404:
   ```php
   // ADDED TO app/routes/api.php:
   if ($method === "POST" && $path === "/api/tickets") {
       $ticketController->submit();
   }
   if ($method === "GET" && $path === "/api/tickets/my") {
       $ticketController->getMyTickets();
   }
   if ($method === "GET" && preg_match("#^/api/tickets/([^/]+)$#", $path, $matches)) {
       $ticketController->getTicket($matches[1]);
   }
   if ($method === "POST" && preg_match("#^/api/tickets/([^/]+)/reply$#", $path, $matches)) {
       $ticketController->reply($matches[1]);
   }
   ```
2. **Profile Route Methods:**
   Normalized routes for both `GET /api/profile`, `PUT /api/profile`, `POST /api/profile`, and `POST /api/update-profile` to ensure full HTTP method compatibility across browsers and Axios versions.
