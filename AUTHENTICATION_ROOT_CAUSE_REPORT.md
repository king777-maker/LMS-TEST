# Broadbeach Academy LMS — Authentication Root-Cause Investigation & Resolution Report

**System:** Broadbeach Academy LMS  
**Environments:**
- **Frontend:** Vercel Edge (`https://broadbeach-academy-lms-d5gx.vercel.app/`) & Local Development (`http://localhost:3000/`)
- **Backend:** GoDaddy cPanel hosting for CADAC (`https://cadac.in/broadbeachlearning.com/broadbeach-backend`)
- **Database:** MySQL (`broad_beach_online`)
**Date:** November 2026  
**Status:** Completed & Staged for Production

---

## 1. Executive Summary

During production operations, learners logging into the Broadbeach Academy LMS encountered continuous authentication failures across multiple pages:
- Browser Console: `Failed to load resource: the server responded with a status of 401 ()`
- `api/profile: Failed to load resource: the server responded with a status of 401`
- `MyCourses API load note: Request failed with status code 401`
- `Backend profile check unauthenticated or unreachable; retaining active local session: Request failed with status code 401`
- `Node cannot be found in the current page`

A deep-dive investigation was performed into the PHP backend architecture, Vercel edge reverse proxy, browser cookie policies, and client-side authentication handlers.

The root cause was isolated to an **architectural mismatch between cookie-based session state and modern cross-origin/proxy environments**. The PHP backend exclusively verified identity via `$_SESSION["user_id"]`, while modern browsers blocked cross-origin third-party cookies between `*.vercel.app` and `cadac.in`. 

This issue has been resolved by implementing a **centralized Bearer token and Session dual-resolution authentication engine** (`auth_helper.php`), issuing 64-character cryptographically secure tokens upon login/registration, auto-provisioning `auth_token` and `token_expires_at` on the `users` table, and transmitting Bearer tokens via `Authorization` and `X-User-Token` headers.

---

## 2. Exhaustive Root-Cause Breakdown

### 2.1 The Cross-Origin Cookie Barrier & Vercel Edge Proxy
The LMS frontend is hosted on Vercel Edge Network (`broadbeach-academy-lms-d5gx.vercel.app`). The authoritative backend is hosted on GoDaddy cPanel (`cadac.in`).

1. **Cookie-Based Sessions:** The PHP backend relied on PHP session cookies (`PHPSESSID`). When a user submitted credentials to `/api/login`, PHP generated a session ID and sent `Set-Cookie: PHPSESSID=...; Path=/; SameSite=Lax`.
2. **Third-Party Cookie Partitioning:** Modern browsers (Google Chrome, Apple Safari, Mozilla Firefox) enforce strict privacy sandboxes (CHIPS and Third-Party Cookie Deprecation). Cookies set by `cadac.in` are treated as third-party when requested from `vercel.app` and are omitted from outbound XMLHttpRequests/fetch calls.
3. **Vercel Reverse Proxy Rewriting:** When requests route via Vercel rewrites (`/api/*` -> `https://cadac.in/...`), Edge serverless instances do not persist or forward client session cookies across decoupled stateless invocations.
4. **Backend Rejection:** When the frontend subsequently requested `/api/profile` or `/api/my-courses`, the PHP backend received **zero session state** (`$_SESSION` was empty). `AuthController` and `EnrollmentController` checked:
   ```php
   // PREVIOUS DEFECTIVE CODE:
   if (!isset($_SESSION["user_id"]) || (int)$_SESSION["user_id"] <= 0) {
       http_response_code(401);
       echo json_encode(["success" => false, "message" => "User not logged in."]);
       exit;
   }
   ```
   This triggered immediate `401 Unauthorized` responses on every authenticated screen.

### 2.2 Lack of Bearer Token Issuance in Learner Controllers
While the LMS Admin panel had previously been modernized to issue and accept Bearer tokens in `admin_users.auth_token`, learner authentication in `AuthController.php` was never updated to generate or check tokens:
- `AuthController::login()` never generated a token.
- `AuthController::register()` never generated a token.
- `AuthController::currentUser()` only checked `$_SESSION["user_id"]`.
- `EnrollmentController::getMyCourses()` only checked `$_SESSION["user_id"]`.
- `EnrollmentController::enrollCourse()` only checked `$_SESSION["user_id"]`.

### 2.3 The "Node cannot be found in the current page" Error
The console note `Node cannot be found in the current page` was traced to transient DOM node reconciliation in React:
- When a page load triggered a 401 error, React components switched state between `loading`, `error`, and fallback view simultaneously while DevTools or extensions (such as password managers or accessibility inspectors) held a reference to an element that was unmounted during the render cycle.
- Eliminating abrupt unauthenticated state bouncing and standardizing request flows resolves this notice.

---

## 3. The Permanent Architecture Resolution

### 3.1 Centralized Token & Session Resolver (`app/config/auth_helper.php`)
A new centralized authentication library was introduced and imported across all controllers:
```php
function getAuthenticatedUser(mysqli $db): ?array {
    // 1. Resolve Bearer Token from headers
    $token = getBearerTokenFromHeaders(); // Checks 'Authorization: Bearer <token>' and 'X-User-Token'
    if ($token && strlen($token) >= 16) {
        ensureUserTokenColumns($db);
        $tokenEsc = $db->real_escape_string($token);
        $query = "SELECT * FROM users WHERE auth_token = '$tokenEsc' AND (token_expires_at IS NULL OR token_expires_at > NOW()) LIMIT 1";
        $res = @$db->query($query);
        if ($res && $res->num_rows > 0) {
            $user = $res->fetch_assoc();
            // Sync session if active
            if (session_status() === PHP_SESSION_ACTIVE) {
                $_SESSION["user_id"] = (int)$user["id"];
                $_SESSION["email"] = $user["email"];
                $_SESSION["logged_in"] = true;
            }
            return $user;
        }
    }
    // 2. Fallback to PHP Session
    if (session_status() === PHP_SESSION_NONE) { @session_start(); }
    $sessionUserId = isset($_SESSION["user_id"]) ? (int)$_SESSION["user_id"] : 0;
    if ($sessionUserId > 0) {
        $res = @$db->query("SELECT * FROM users WHERE id = $sessionUserId LIMIT 1");
        if ($res && $res->num_rows > 0) { return $res->fetch_assoc(); }
    }
    return null;
}
```

### 3.2 Non-Destructive Database Schema Extension
To support stateless Bearer tokens on MySQL `broad_beach_online`, the `users` table is automatically extended:
```sql
ALTER TABLE `users` 
  ADD COLUMN `auth_token` VARCHAR(255) NULL, 
  ADD COLUMN `token_expires_at` DATETIME NULL, 
  ADD INDEX `idx_users_auth_token` (`auth_token`);
```
This migration is non-destructive: zero rows are removed, existing learner data is preserved, and backwards compatibility with existing passwords and profiles is guaranteed.

### 3.3 Controller Updates
1. **`AuthController::login()`**:
   - Generates a 64-character hex token (`bin2hex(random_bytes(32))`).
   - Sets `auth_token` and `token_expires_at = NOW() + INTERVAL 30 DAY`.
   - Returns token in response body: `data: { id, email, token: "...", ... }`.
2. **`AuthController::currentUser()` (`GET /api/profile`)**:
   - Authenticates via `getAuthenticatedUser($this->db)`.
   - Returns 200 OK with learner profile if valid, 401 if unauthenticated.
3. **`AuthController::updateProfile()` (`PUT/POST /api/profile`)**:
   - Enforces user identity via `getAuthenticatedUser($this->db)`.
   - Maintains registered name immutability.
4. **`EnrollmentController::getMyCourses()` (`GET /api/my-courses`)**:
   - Resolves user via `getAuthenticatedUser($this->conn)`.
   - Returns list of enrolled certifications.
5. **`TicketController::submit()` & `getMyTickets()` (`POST /api/tickets`, `GET /api/tickets/my`)**:
   - Enforces genuine learner identity from token, preventing identity spoofing.

### 3.4 Client-Side Integration
1. **`src/context/AuthContext.jsx`**:
   - Stores `response.data.data.token` into `localStorage.setItem("bb_user_token", token)`.
   - Preserves token across navigation and re-auth checks.
   - Clears `bb_user_token` upon explicit logout.
2. **`src/api/api.js`**:
   - Axios request interceptor automatically injects:
     - `Authorization: Bearer <bb_user_token>`
     - `X-User-Token: <bb_user_token>`
   - Bypasses cookie stripping across all network boundaries.
