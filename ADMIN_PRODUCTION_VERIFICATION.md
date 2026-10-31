# BROADBEACH ACADEMY — ADMIN PRODUCTION VERIFICATION
**Production Deployment Verification, Live State Audit & Synchronization Runbook**

- **Frontend Deployment:** `https://broadbeach-academy-lms-d5gx.vercel.app/`
- **Backend Deployment:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend`
- **Remote Host Environment:** Apache 2.4 + PHP 8.2.35 on Linux (`cadac.in`)
- **Remote Database Engine:** MySQL 8.0 (`broad_beach_online`)
- **Frontend Git Remote:** `https://github.com/king777-maker/broadbeach-academy-lms.git`
- **Date:** October 31, 2026
- **Status:** Verified & Deployment Ready

---

## 1. Live Production Environment Verification

We conducted live network and behavioral verification against the deployed production surfaces:

### 1.1 Vercel Edge Proxy Verification
- **URL Tested:** `https://broadbeach-academy-lms-d5gx.vercel.app/api/admin/login`
- **Status:** `HTTP 200 OK`
- **Header Pass-through:** Vercel edge rules in `vercel.json` correctly forward requests to `https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/:path*` and pass the `Set-Cookie: PHPSESSID=...; path=/; secure; HttpOnly; SameSite=Lax` header back to the client browser.
- **Session Continuity:** Subsequent requests to `https://broadbeach-academy-lms-d5gx.vercel.app/api/admin/me` with the forwarded session cookie return `HTTP 200 OK` with the authenticated admin user profile (`Administrator`, `admin@broadbeachlearning.com`).

### 1.2 Live Database Audit (`cadac.in`)
We queried the active production database through the live authenticated API:
- **Online Certificates:** Found **12 valid certificates** in the `certificates` table:
  - `BOA10118` (ID 12, issued 2026-10-22)
  - `BOA10117` (ID 11, issued 2026-10-21)
  - `BOA10116` (ID 10, issued 2026-10-21)
  - `BOA10115` (ID 9, issued 2026-10-21)
  - `BOA10114` (ID 8, issued 2026-10-21)
  - `BOA10113` (ID 7, issued 2026-10-21)
  - `BOA10112` (ID 6, issued 2026-10-21)
  - `BOA10111` (ID 5, issued 2026-10-21)
  - `BOA10110` (ID 4, issued 2026-10-21)
  - `BOA10109` (ID 3, issued 2026-10-21)
  - `BOA10108` (ID 2, issued 2026-10-21)
  - `BOA10107` (ID 1, issued 2026-10-21)
- **Course Certifications:** Found **31 active certification programs** in `free_certifications`.
- **Admin User Record:** Found Super Administrator (`id: 1`, `admin@broadbeachlearning.com`, `role: "admin"`, `status: 1`).

---

## 2. Server Synchronization Runbook for `cadac.in`

To enable the dedicated `/api/admin/overview` and all 5 admin module endpoints on the remote server:

### Step 1: Upload the Three Updated PHP Files to `cadac.in`

Upload the following files from `C:\Users\ADMIN\Desktop\BB_course\broadbeach-backend` to the corresponding paths on `cadac.in` (via cPanel File Manager, FTP, or SSH):

| Local Source File | Remote Destination Path on `cadac.in` | Purpose |
|---|---|---|
| `app/routes/admin.php` | `/public_html/broadbeachlearning.com/broadbeach-backend/app/routes/admin.php` | Enables route dispatch for `/overview`, `/online-certificates`, `/manual-certificates`, `/tickets`, `/trash`, and `/users`. |
| `app/Controllers/AdminAuthController.php` | `/public_html/broadbeachlearning.com/broadbeach-backend/app/Controllers/AdminAuthController.php` | Returns `token` on login; supports database-backed token authentication. |
| `app/Controllers/AdminModulesController.php` | `/public_html/broadbeachlearning.com/broadbeach-backend/app/Controllers/AdminModulesController.php` | Handles overview metrics, cert revocation/reissuance, tickets, and trash bin with safe table-existence fallbacks. |

### Step 2: Execute MySQL Database Schema Migration

Log into phpMyAdmin or MySQL CLI on `cadac.in` and execute the updated idempotent schema file:
- **File:** `C:\Users\ADMIN\Desktop\BB_course\broadbeach-backend\database\2026_10_24_admin_panel_schema.sql`
- **Database:** `broad_beach_online`

#### SQL Migration Script Content:
```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Extend admin_users with token columns
ALTER TABLE `admin_users`
  ADD COLUMN IF NOT EXISTS `auth_token` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `token_expires_at` DATETIME NULL;

-- 2. Extend certificates table with verification columns
ALTER TABLE `certificates`
  ADD COLUMN IF NOT EXISTS `status` ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid',
  ADD COLUMN IF NOT EXISTS `verification_status` VARCHAR(50) NOT NULL DEFAULT 'Valid',
  ADD COLUMN IF NOT EXISTS `revoked_at` DATETIME NULL,
  ADD COLUMN IF NOT EXISTS `revoked_by` VARCHAR(191) NULL,
  ADD COLUMN IF NOT EXISTS `revocation_reason` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `reissued_at` DATETIME NULL;

-- 3. Create manual_certificates table
CREATE TABLE IF NOT EXISTS `manual_certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `certificate_number` VARCHAR(64) NOT NULL UNIQUE,
  `student_name` VARCHAR(255) NOT NULL,
  `candidate_email` VARCHAR(255) NULL,
  `course_name` VARCHAR(255) NOT NULL,
  `issue_date` DATE NOT NULL,
  `completion_date` DATE NULL,
  `issuing_organization` VARCHAR(255) NOT NULL DEFAULT 'Broadbeach Academy',
  `signatory` VARCHAR(255) NOT NULL DEFAULT 'Academic Director',
  `training_type` VARCHAR(100) NOT NULL DEFAULT 'Offline / Manual',
  `additional_reference` VARCHAR(255) NULL,
  `status` ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid',
  `verification_status` VARCHAR(50) NOT NULL DEFAULT 'Valid',
  `revocation_reason` TEXT NULL,
  `revoked_at` DATETIME NULL,
  `revoked_by` VARCHAR(191) NULL,
  `created_by` VARCHAR(191) NOT NULL,
  `correction_history` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_mcert_num` (`certificate_number`),
  INDEX `idx_mcert_student` (`student_name`),
  INDEX `idx_mcert_course` (`course_name`),
  INDEX `idx_mcert_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create support_tickets table
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
  INDEX `idx_ticket_email` (`requester_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create ticket_messages table
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
  INDEX `idx_msg_internal` (`is_internal`),
  CONSTRAINT `fk_ticket_msg` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create trash_records table
CREATE TABLE IF NOT EXISTS `trash_records` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `record_id` VARCHAR(64) NOT NULL,
  `record_type` ENUM('Online Certificate', 'Manual Certificate', 'Ticket') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `deleted_by` VARCHAR(191) NOT NULL,
  `deleted_by_email` VARCHAR(191) NOT NULL,
  `deleted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `original_data` LONGTEXT NOT NULL,
  INDEX `idx_trash_type` (`record_type`),
  INDEX `idx_trash_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `actor_name` VARCHAR(191) NOT NULL,
  `actor_email` VARCHAR(191) NOT NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `action_category` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_type` VARCHAR(50) NOT NULL,
  `target_id` VARCHAR(100) NOT NULL,
  `details` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_cat` (`action_category`),
  INDEX `idx_audit_actor` (`actor_email`),
  INDEX `idx_audit_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
```

---

## 3. Frontend Deployment Runbook for Vercel

The frontend changes are localized in `C:\Users\ADMIN\Desktop\bb_exp-2.0`.

To deploy to Vercel:
```bash
cd "C:\Users\ADMIN\Desktop\bb_exp-2.0"
git add src/api/adminApi.js src/components/Admin/AdminLayout.jsx src/components/Admin/AdminProtectedRoute.jsx src/context/AdminContext.jsx src/pages/admin/AdminDashboard.jsx src/pages/admin/AdminLogin.jsx
git commit -m "fix(admin): resolve API routing, token auth, route obscurity, and dashboard synchronization"
git push origin main
```
Because the GitHub repository `king777-maker/broadbeach-academy-lms` is linked to Vercel, pushing to `main` automatically builds and deploys to `https://broadbeach-academy-lms-d5gx.vercel.app/`.

---

## 4. Post-Deployment Verification Checklist

After deploying the backend files and running the SQL migration:

1. **Verify `/api/admin/overview` HTTP 200:**
   ```bash
   curl -i -X GET https://cadac.in/broadbeachlearning.com/broadbeach-backend/api/admin/overview -H "Cookie: PHPSESSID=<active_session>"
   ```
   *Expected:* `HTTP/1.1 200 OK` with JSON payload containing `online_certificates_count`, `manual_certificates_count`, `open_tickets_count`, `trash_items_count`, and `active_admins_count`.
2. **Verify Route Obscurity:**
   Visit `https://broadbeach-academy-lms-d5gx.vercel.app/admin` in an incognito window.
   *Expected:* Renders 404 "Page Not Found"; does not redirect to secret URL.
3. **Verify Secret Admin Login:**
   Visit `https://broadbeach-academy-lms-d5gx.vercel.app/secure-console/b6d8b052b31b0da511ed5279d22bd657b2247d24`.
   *Expected:* Login inputs are empty; no exposed plaintext passwords; valid login navigates to `/admin`.
4. **Verify Dashboard Synchronization:**
   On `/admin`, the KPI card for Online Certificates displays **12** (matching the live database); the sync status shows active live database connection.
