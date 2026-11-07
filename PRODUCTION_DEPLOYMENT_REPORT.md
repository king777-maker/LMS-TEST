# Broadbeach Academy LMS — Production Deployment Guide & Status Report

**Hosting Provider:** GoDaddy cPanel  
**Server Domain:** `cadac.in`  
**Backend Directory:** `public_html/broadbeachlearning.com/broadbeach-backend/`  
**Database:** MySQL (`broad_beach_online`)  
**Deployment Packages Generated:**
1. `cadac_admin_sync.php` (Self-extracting automated deployment and database migration runner)
2. `cadac_production_update.zip` (Pre-packaged update archive containing all 12 patched files)
3. `broadbeach_backend_full.zip` (Complete backend distribution package)
**Date:** November 2026  
**Status:** Staged & Packaged for Production Deployment

---

## 1. Deployment Overview & Package Contents

All backend controllers, routing tables, authentication helpers, and database migrations have been compiled into self-extracting and direct-archive packages.

### Files Updated & Included in Package:
1. `app/config/auth_helper.php` — Centralized learner Bearer token & session auth engine.
2. `app/config/cors.php` — Updated CORS headers with `X-User-Token` & `Authorization`.
3. `app/Controllers/AuthController.php` — Issues 64-char Bearer tokens on login/register, authenticates `currentUser()` and `updateProfile()`.
4. `app/Controllers/EnrollmentController.php` — Authenticates `getMyCourses()`, `enrollCourse()`, `getMyEnrollments()` via token.
5. `app/Controllers/TicketController.php` — Handles `submit()`, `getMyTickets()`, `getTicket()`, `reply()` with IDOR protection.
6. `app/Controllers/AssessmentController.php` — Chapter guard and submission authenticated via token.
7. `app/Controllers/CourseProgressController.php` — Lesson progress tracking authenticated via token.
8. `app/routes/api.php` — Registered `/api/tickets`, `/api/tickets/my`, `/api/profile`, `/api/my-courses`.
9. `app/routes/admin.php` — Admin endpoints (tickets, certificates, audit logs).
10. `app/Controllers/AdminModulesController.php` — Ticket master, certificate management.
11. `app/Controllers/AdminAuthController.php` — Admin token authentication.
12. `app/Middleware/AdminAuthMiddleware.php` — Admin permission enforcement.

---

## 2. Deployment Instructions (Choose Method A or Method B)

### Method A: Automated One-Click Sync Runner (Recommended)

1. **Upload Single File to cPanel:**
   - Log into GoDaddy cPanel -> File Manager.
   - Navigate to: `public_html/broadbeachlearning.com/broadbeach-backend/`.
   - Upload the single file: `cadac_admin_sync.php` (located in your project root or `C:/Users/ADMIN/Desktop/BB_course/broadbeach-backend/`).
2. **Trigger the Deployment Runner in Browser:**
   - Open the following URL in your web browser:
     ```
     https://cadac.in/broadbeachlearning.com/broadbeach-backend/cadac_admin_sync.php?token=BroadbeachSync2026_SecureAdminDeploy
     ```
3. **Automated Actions Performed by the Runner:**
   - Authenticates the request using the secret deployment token.
   - Automatically writes and validates all 12 PHP files to their exact directory locations.
   - Runs zero-destruction MySQL schema migrations on `broad_beach_online` (adds `auth_token` and `token_expires_at` to `users`, creates `support_tickets` and `ticket_messages`).
   - Returns a structured JSON report showing file write statuses, sha1 checksums, and table row counts.

---

### Method B: cPanel File Manager Zip Extraction

If you prefer direct file replacement via cPanel:
1. Log into GoDaddy cPanel -> File Manager.
2. Navigate to: `public_html/broadbeachlearning.com/broadbeach-backend/`.
3. Upload `cadac_production_update.zip` (located at `C:/Users/ADMIN/Desktop/BB_course/cadac_production_update.zip`).
4. Right-click `cadac_production_update.zip` and select **Extract**.
5. Confirm destination: `public_html/broadbeachlearning.com/broadbeach-backend/`.
6. Once extracted, run the schema migration by visiting:
   ```
   https://cadac.in/broadbeachlearning.com/broadbeach-backend/cadac_admin_sync.php?token=BroadbeachSync2026_SecureAdminDeploy&deploy_files=0
   ```
   *(This executes the database schema migration without re-writing files).*

---

## 3. Database Schema Verification

The runner executes the following non-destructive migrations:
```sql
-- 1. Enable Bearer Token Authentication for Learners
ALTER TABLE `users` 
  ADD COLUMN `auth_token` VARCHAR(255) NULL, 
  ADD COLUMN `token_expires_at` DATETIME NULL, 
  ADD INDEX `idx_users_auth_token` (`auth_token`);

-- 2. Create Support Ticket System Tables
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `subject` VARCHAR(255) NOT NULL,
  `requester_name` VARCHAR(255) NOT NULL,
  `requester_email` VARCHAR(191) NOT NULL,
  `course_name` VARCHAR(255) NULL,
  `certificate_id` VARCHAR(64) NULL,
  `category` VARCHAR(100) NOT NULL,
  `priority` ENUM('Normal', 'High', 'Urgent') NOT NULL DEFAULT 'Normal',
  `status` ENUM('New', 'Open', 'In Progress', 'Waiting for User', 'Resolved', 'Closed') NOT NULL DEFAULT 'New',
  `assigned_admin` VARCHAR(191) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ticket_status` (`status`),
  INDEX `idx_ticket_priority` (`priority`),
  INDEX `idx_ticket_category` (`category`),
  INDEX `idx_ticket_requester` (`requester_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ticket_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` VARCHAR(64) NOT NULL,
  `sender_type` ENUM('requester', 'admin', 'system') NOT NULL,
  `sender_name` VARCHAR(191) NOT NULL,
  `sender_email` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `is_internal` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_msg_ticket` (`ticket_id`),
  INDEX `idx_msg_internal` (`is_internal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Post-Deployment Smoke Test Checklist

Once `cadac_admin_sync.php` has executed on CADAC, verify each of the following endpoints:

| Action | URL | Method | Expected Result |
| :--- | :--- | :--- | :--- |
| **Check Unauth Profile** | `https://cadac.in/.../api/profile` | GET | `401 Unauthorized {"success":false,"message":"User not logged in."}` |
| **Check Ticket Submission** | `https://cadac.in/.../api/tickets` | POST | `201 Created` with valid payload (or `422` with empty body, confirming route exists) |
| **Check Ticket List** | `https://cadac.in/.../api/tickets/my` | GET | `200 OK` (no longer returns 404!) |
| **Check Learner Login** | `https://cadac.in/.../api/login` | POST | `200 OK` returning `token: "..."` in user data |
| **Check Profile with Token** | `https://cadac.in/.../api/profile` | GET with `Authorization: Bearer <token>` | `200 OK` returning learner profile |
| **Check My Courses with Token** | `https://cadac.in/.../api/my-courses` | GET with `Authorization: Bearer <token>` | `200 OK` returning enrolled courses |

---

## 5. Deployment Status Statement
- **Local Development Environment (`bb_exp-2.0` on `http://localhost:3000/`):** Fully tested, verified, and operational with 0 errors.
- **Frontend Build (`npm run build`):** Verified clean build with 0 TypeScript/ESLint/Vite bundling errors.
- **Production Server (CADAC cPanel):** All 12 files and self-extracting synchronization runner have been built and staged in `cadac_admin_sync.php`, `cadac_production_update.zip`, and `broadbeach_backend_full.zip`. Uploading and triggering `cadac_admin_sync.php` executes the physical file overwrite and MySQL schema update on the remote GoDaddy server.
