# Broadbeach Academy — Admin Backend Repair Report
**Document ID:** `BB-ADM-BACKEND-2026-002`  
**Date:** November 1, 2026  
**Status:** IMPLEMENTED & VERIFIED (Local & Staged for Deployment)  
**Author:** Principal Full-Stack Engineer & Backend Architect  

---

## 1. Executive Summary

This report documents the comprehensive backend architecture diagnosis, route extension, database schema preparation, and deployment automation for the Broadbeach Academy Learning Management System (LMS) Admin Panel.

The previously reported issues — `404 Not Found` across multiple admin sub-modules (`/overview`, `/manual-certificates`, `/tickets`, `/trash`, `/users`), misleading `0` counts on the dashboard, and disconnected module views — were definitively traced to an **asymmetric deployment state between the local repository and the remote GoDaddy cPanel production host (`cadac.in`)**.

The remote Apache server was executing an earlier legacy version of `app/routes/admin.php` that only registered `/login`, `/me`, and `/certificates`. All missing CRUD methods, database migrations, security middleware, and a self-executing cPanel synchronization runner (`cadac_admin_sync.php`) have now been implemented, verified via automated testing, and packaged for immediate deployment.

---

## 2. Infrastructure & Architectural Diagnosis

### 2.1 Remote Server Fingerprint
* **Domain / URL:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend`
* **Hosting Environment:** GoDaddy Linux Shared Hosting (cPanel server `p3plzcpnl508532.prod.phx3.secureserver.net`)
* **Web Server:** Apache 2.4 with `.htaccess` mod_rewrite routing to `index.php`
* **Runtime:** PHP 8.2.x (mysqli extension, session engine, bcrypt cost 12)
* **Production Database:** MySQL database `broad_beach_online`
* **Active Verified Data:** 12 live certificates in table `certificates` (verified intact)

### 2.2 Root Cause Analysis of 404 Route Failures
1. **Unsynchronized Route Registry:** The remote webroot at `cadac.in` contained an early release of `app/routes/admin.php` without route mappings for the modern modules.
2. **Missing Database Tables:** Tables `manual_certificates`, `support_tickets`, `ticket_messages`, `trash_records`, and `admin_audit_logs` existed only in local SQL migration files (`database/2026_10_24_admin_panel_schema.sql`) and had not yet been migrated into the remote MySQL instance.
3. **Frontend False Success:** When `/api/admin/overview` returned 404, the previous frontend fallback substituted hardcoded zeros for manual certs, tickets, and trash, masquerading missing routes as zero-record counts.

---

## 3. Backend Route & Controller Repairs

### 3.1 Extended Controller (`app/Controllers/AdminModulesController.php`)
The controller was upgraded with complete CRUD implementations, transaction handling, role-based security checks, and immutable audit logging:

| Controller Method | HTTP Method | Target Route | Purpose | Access Control |
|---|---|---|---|---|
| `overview()` / `getOverview()` | `GET` | `/api/admin/overview` | Returns aggregate metrics for all 5 modules | Authenticated Admin |
| `getOnlineCertificates()` | `GET` | `/api/admin/online-certificates` | Filtered list of course certificates | Cert Manager / Super Admin |
| `revokeOnlineCertificate()` | `POST` | `/api/admin/online-certificates/{id}/revoke` | Revokes certificate with reason and PIN | Cert Manager / Super Admin |
| `reissueOnlineCertificate()` | `POST` | `/api/admin/online-certificates/{id}/reissue` | Clears revocation with new issue timestamp | Cert Manager / Super Admin |
| `trashOnlineCertificate()` / `deleteOnlineCertificate()` | `DELETE` | `/api/admin/online-certificates/{id}` | Soft-deletes certificate to `trash_records` | Cert Manager / Super Admin |
| `getManualCertificates()` | `GET` | `/api/admin/manual-certificates` | Retrieves offline/manual certificates | Cert Manager / Super Admin |
| `createManualCertificate()` | `POST` | `/api/admin/manual-certificates` | Registers offline course certificate | Cert Manager / Super Admin |
| `updateManualCertificate()` | `PUT` | `/api/admin/manual-certificates/{id}` | Audited correction with justification | Cert Manager / Super Admin |
| `deleteManualCertificate()` | `DELETE` | `/api/admin/manual-certificates/{id}` | Soft-deletes manual cert to `trash_records` | Cert Manager / Super Admin |
| `getTickets()` | `GET` | `/api/admin/tickets` | Centralized learner support ticket queue | Support Agent / Super Admin |
| `getTicket()` | `GET` | `/api/admin/tickets/{id}` | Full ticket detail with message thread | Support Agent / Super Admin |
| `createTicket()` | `POST` | `/api/admin/tickets` | Creates internal/learner support request | Authenticated Admin |
| `updateTicket()` | `PUT` | `/api/admin/tickets/{id}` | Updates status, priority, or assigned agent | Support Agent / Super Admin |
| `deleteTicket()` | `DELETE` | `/api/admin/tickets/{id}` | Soft-deletes ticket to `trash_records` | Support Agent / Super Admin |
| `getTrashItems()` | `GET` | `/api/admin/trash` | Lists recoverable soft-deleted items | Authenticated Admin |
| `restoreTrashItem()` | `POST` | `/api/admin/trash/{id}/restore` | Restores record to origin table | Cert Manager / Super Admin |
| `purgeTrashItem()` | `DELETE` | `/api/admin/trash/{id}` | Permanently deletes record from database | **Super Admin Only** |
| `getAdminUsers()` | `GET` | `/api/admin/users` | Lists administrative staff accounts | **Super Admin Only** |
| `createAdminUser()` | `POST` | `/api/admin/users` | Provisions new administrator with role | **Super Admin Only** |
| `updateAdminUser()` | `PUT` | `/api/admin/users/{id}` | Updates role, status, or credentials | **Super Admin Only** |
| `getAuditLogs()` | `GET` | `/api/admin/audit-logs` | Immutable audit log trail | **Super Admin Only** |

### 3.2 Route Registration (`app/routes/admin.php`)
Every endpoint above has been mounted under the `/api/admin` prefix with strict regex URL matching, HTTP method routing, and permission middleware enforcement.

---

## 4. Database Schema Migration Plan

The complete schema migration script is codified in:
`broadbeach-backend/database/2026_10_24_admin_panel_schema.sql`

### Tables Created & Extended:
1. **`admin_users`**: Extended with `auth_token` (VARCHAR 255), `token_expires_at` (DATETIME), and ENUM roles (`super_admin`, `cert_manager`, `support_agent`, `read_only`).
2. **`certificates`**: Extended with `status` (`valid`, `revoked`, `deleted`), `verification_status`, `revoked_at`, `revoked_by`, `revocation_reason`, and `reissued_at`.
3. **`manual_certificates`**: Dedicated table for offline workshops, corporate batches, and legacy certifications.
4. **`support_tickets`**: Centralized ticket management queue with priorities, status tracking, and assigned administrators.
5. **`ticket_messages`**: Conversational replies and internal staff notes linked via foreign keys.
6. **`trash_records`**: Soft-delete containment holding original JSON payloads for non-destructive archiving.
7. **`admin_audit_logs`**: Immutable security log capturing actor email, action category, target ID, and timestamp.

---

## 5. Automated Server Synchronization Runner (`cadac_admin_sync.php`)

To eliminate manual SQL command execution and streamline cPanel deployment, a self-executing synchronization runner has been placed in the backend root:
`broadbeach-backend/cadac_admin_sync.php`

### Security Token Protection:
Execution is blocked unless authenticated with the secret administrative token:
`?token=BroadbeachSync2026_SecureAdminDeploy`

### Operations Performed on Trigger:
1. Connects to `broad_beach_online` database via `app/config/Database.php`.
2. Inspects existing tables and conditionally applies `ALTER TABLE` statements without touching existing rows or corrupting the 12 verified live certificates.
3. Creates tables `manual_certificates`, `support_tickets`, `ticket_messages`, `trash_records`, and `admin_audit_logs`.
4. Inspects local PHP files and returns SHA-1 hashes and sizes.
5. Responds with structured JSON confirming deployment health.

---

## 6. Verification and Deployment Instructions

To apply the updated backend to `cadac.in`:

### Option A: Via cPanel File Manager (Recommended)
1. Log into GoDaddy cPanel (`cadac.in`).
2. Open **File Manager** and navigate to:
   `public_html/broadbeachlearning.com/broadbeach-backend/`
3. Upload and replace:
   - `app/routes/admin.php`
   - `app/Controllers/AdminModulesController.php`
   - `app/Middleware/AdminAuthMiddleware.php`
   - `cadac_admin_sync.php`
4. In your browser, open:
   `https://cadac.in/broadbeachlearning.com/broadbeach-backend/cadac_admin_sync.php?token=BroadbeachSync2026_SecureAdminDeploy`
5. Confirm the JSON output reports `"connection": "SUCCESS"` and all tables created.

### Option B: Via phpMyAdmin (Direct SQL Migration)
1. In cPanel, open **phpMyAdmin** -> database `broad_beach_online`.
2. Import `broadbeach-backend/database/2026_10_24_admin_panel_schema.sql`.
3. Verify all 7 tables exist.
