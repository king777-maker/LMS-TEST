# Broadbeach Academy — Production Database Migration & Schema Audit Report
**Document ID:** `BB-DB-MIGRATE-2026-004`  
**Date:** November 1, 2026  
**Auditor:** Principal Database Administrator & Backend Architect  
**Target Database:** MySQL `broad_beach_online` on `cadac.in`  

---

## 1. Executive Summary

This report establishes the database migration plan and schema integrity safeguards for the Broadbeach Academy production MySQL instance (`broad_beach_online`).

### Fundamental Safety Guarantees:
* **ZERO DROPS:** No table, index, or column is dropped.
* **ZERO TRUNCATES:** No table is truncated.
* **DATA PRESERVATION:** The **12 live verified course completion certificates** in table `certificates` are guaranteed 100% intact and untouched.
* **IDEMPOTENT EXECUTION:** All schema statements utilize `CREATE TABLE IF NOT EXISTS` and conditional column existence checks.

---

## 2. Live Production State Audit

The live production database `broad_beach_online` currently contains:
1. **`certificates`**: 12 active production rows:
   * Latest certificate: `BOA10118` (ID 12, created 2026-10-22 21:32:14)
   * Earliest certificate: `rsdtfguhjkl;` (ID 1, created 2026-08-12 22:38:37)
   * Verification status: All 12 records return valid and verified status.
2. **`admin_users`**: Contains the root administrative account:
   * Email: `admin@broadbeachlearning.com`
   * Password Hash: standard bcrypt hash (cost 10/12)
   * Role: `admin` / `super_admin`
   * Status: `1` (`active`)

---

## 3. Schema Extensions & New Entities

The versioned SQL migration file is codified in:
`broadbeach-backend/database/2026_10_24_admin_panel_schema.sql`

### 3.1 Extensions to Existing Tables
1. **`admin_users`**:
   * `ADD COLUMN IF NOT EXISTS auth_token VARCHAR(255) NULL`
   * `ADD COLUMN IF NOT EXISTS token_expires_at DATETIME NULL`
   * Role compatibility: supports `'super_admin'`, `'admin'`, `'cert_manager'`, `'support_agent'`, `'read_only'`.

2. **`certificates`**:
   * `ADD COLUMN IF NOT EXISTS status ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid'`
   * `ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) NOT NULL DEFAULT 'Valid'`
   * `ADD COLUMN IF NOT EXISTS revoked_at DATETIME NULL`
   * `ADD COLUMN IF NOT EXISTS revoked_by VARCHAR(191) NULL`
   * `ADD COLUMN IF NOT EXISTS revocation_reason TEXT NULL`
   * `ADD COLUMN IF NOT EXISTS reissued_at DATETIME NULL`

### 3.2 Five New Production Tables

```sql
-- 1. MANUAL CERTIFICATES (Module 2: Offline & Manual Credential Issuance)
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
  `created_by` VARCHAR(191) NOT NULL DEFAULT 'System Admin',
  `correction_history` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_mcert_num` (`certificate_number`),
  INDEX `idx_mcert_student` (`student_name`),
  INDEX `idx_mcert_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SUPPORT TICKETS (Module 3: Support Ticket Queue)
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
  INDEX `idx_ticket_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TICKET MESSAGES (Thread Replies & Internal Staff Notes)
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

-- 4. TRASH RECORDS (Module 4: Soft-Deleted Item Containment)
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

-- 5. ADMIN AUDIT LOGS (Immutable Security Audit Trail)
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
```

---

## 4. Execution Mechanisms

1. **Automated via Runner:** Executed automatically when visiting:  
   `https://cadac.in/broadbeachlearning.com/broadbeach-backend/cadac_admin_sync.php?token=BroadbeachSync2026_SecureAdminDeploy`
2. **Manual via phpMyAdmin:** Can be imported directly into `broad_beach_online` via cPanel phpMyAdmin by selecting `2026_10_24_admin_panel_schema.sql`.
