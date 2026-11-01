# BROADBEACH ACADEMY — ADMIN API ROUTE AUDIT
## Comprehensive Mapping of Frontend Services to Backend Routes & Production Status

**Audit Date:** November 1, 2026  
**Auditor:** Principal Full-Stack Engineer & Backend Architect  
**Frontend Deployment:** `https://broadbeach-academy-lms-d5gx.vercel.app/`  
**Backend Production Host:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend`  
**Database Engine:** MySQL (`broad_beach_online`) on `cadac.in`  

---

## 1. Architectural Overview & Request Lifecycle

```
[ Learner / Admin Browser ]
             │
             ▼
  [ Vercel Edge Proxy ] ─── (Rewrites: /api/:path* ─► https://cadac.in/.../api/:path*)
             │
             ▼
[ Apache on cadac.in ] ─── (.htaccess ─► broadbeach-backend/index.php)
             │
             ▼
 [ app/routes/api.php ] ─── (Regex: #/api/admin(?:/|$)# ─► app/routes/admin.php)
             │
             ▼
 [ app/routes/admin.php ] ─── (AdminAuthMiddleware ─► AdminModulesController)
             │
             ▼
 [ MySQL Database: broad_beach_online ]
```

---

## 2. Complete Route Inventory & Production Gap Analysis

| # | Frontend Service / Function | HTTP Method | Expected API Path | Actual Registered Backend Path | Auth Required | Allowed Roles | Current cadac.in Status | Root Cause & Required Correction |
|---|---|:---:|---|---|:---:|---|:---:|---|
| **01** | `adminLogin` | `POST` | `/api/admin/login` | `/api/admin/login` | None | Public | **200 OK** | Working. Standardize role return (`super_admin` for primary account). |
| **02** | `getAdminMe` | `GET` | `/api/admin/me` | `/api/admin/me` | Yes | All Admins | **200 OK** | Working. Enforce Bearer token fallback. |
| **03** | `adminLogout` | `POST` | `/api/admin/logout` | `/api/admin/logout` | Yes | All Admins | **200 OK** | Working. Revoke active session on server. |
| **04** | `getAdminOverview` | `GET` | `/api/admin/overview` | `/api/admin/overview` | Yes | All Admins | **404 Not Found** | Missing from deployed `admin.php` on `cadac.in`. Upload updated `admin.php` and `AdminModulesController.php`. |
| **05** | `getOnlineCertificates` | `GET` | `/api/admin/online-certificates` | `/api/admin/online-certificates` | Yes | All Admins | **404 Not Found** | Missing from deployed `admin.php` on `cadac.in`. Fallback to working `/api/admin/certificates` returns 12 live records. |
| **06** | `revokeOnlineCertificate` | `POST` | `/api/admin/online-certificates/{id}/revoke` | `/api/admin/online-certificates/{id}/revoke` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Missing from deployed `admin.php`. Needs remote server file synchronization. |
| **07** | `reissueOnlineCertificate` | `POST` | `/api/admin/online-certificates/{id}/reissue` | `/api/admin/online-certificates/{id}/reissue` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Missing from deployed `admin.php`. Needs remote server file synchronization. |
| **08** | `deleteOnlineCertificate` | `DELETE` | `/api/admin/online-certificates/{id}` | `/api/admin/online-certificates/{id}` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Missing from deployed `admin.php`. Needs remote server file synchronization. |
| **09** | `getManualCertificates` | `GET` | `/api/admin/manual-certificates` | `/api/admin/manual-certificates` | Yes | Super Admin, Admin, Read-Only | **404 Not Found** | Missing from deployed `admin.php` AND table `manual_certificates` pending schema migration on `cadac.in`. |
| **10** | `createManualCertificate` | `POST` | `/api/admin/manual-certificates` | `/api/admin/manual-certificates` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Route and controller missing from server deployment; database table pending. |
| **11** | `updateManualCertificate` | `PUT` | `/api/admin/manual-certificates/{id}` | `/api/admin/manual-certificates/{id}` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Route and controller missing from server deployment; database table pending. |
| **12** | `deleteManualCertificate` | `DELETE` | `/api/admin/manual-certificates/{id}` | `/api/admin/manual-certificates/{id}` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Route and controller missing from server deployment; database table pending. |
| **13** | `getTickets` | `GET` | `/api/admin/tickets` | `/api/admin/tickets` | Yes | Super Admin, Admin, Support | **404 Not Found** | Route missing from server deployment; table `support_tickets` pending schema migration. |
| **14** | `getTicket` | `GET` | `/api/admin/tickets/{id}` | `/api/admin/tickets/{id}` | Yes | Super Admin, Admin, Support | **404 Not Found** | Route missing from server deployment; table `support_tickets` pending schema migration. |
| **15** | `createTicket` | `POST` | `/api/admin/tickets` | `/api/admin/tickets` | Yes | Super Admin, Admin, Support | **404 Not Found** | Route missing from server deployment; table `support_tickets` pending schema migration. |
| **16** | `updateTicket` | `PUT` | `/api/admin/tickets/{id}` | `/api/admin/tickets/{id}` | Yes | Super Admin, Admin, Support | **404 Not Found** | Route missing from server deployment; table `support_tickets` pending schema migration. |
| **17** | `deleteTicket` | `DELETE` | `/api/admin/tickets/{id}` | `/api/admin/tickets/{id}` | Yes + PIN | Super Admin, Admin | **404 Not Found** | Route missing from server deployment; table `support_tickets` pending schema migration. |
| **18** | `getTrashItems` | `GET` | `/api/admin/trash` | `/api/admin/trash` | Yes | Super Admin, Admin | **404 Not Found** | Route missing from server deployment; table `trash_records` pending schema migration. |
| **19** | `restoreTrashItem` | `POST` | `/api/admin/trash/{id}/restore` | `/api/admin/trash/{id}/restore` | Yes | Super Admin, Admin | **404 Not Found** | Route missing from server deployment; table `trash_records` pending schema migration. |
| **20** | `purgeTrashItem` | `DELETE` | `/api/admin/trash/{id}` | `/api/admin/trash/{id}` | Yes + PIN | Super Admin Only | **404 Not Found** | Route missing from server deployment; table `trash_records` pending schema migration. |
| **21** | `getAdminUsers` | `GET` | `/api/admin/users` | `/api/admin/users` | Yes | Super Admin Only | **404 Not Found** | Route missing from deployed `admin.php` on `cadac.in`. Table `admin_users` exists. |
| **22** | `createAdminUser` | `POST` | `/api/admin/users` | `/api/admin/users` | Yes + PIN | Super Admin Only | **404 Not Found** | Route missing from deployed `admin.php` on `cadac.in`. |
| **23** | `updateAdminUser` | `PUT` | `/api/admin/users/{id}` | `/api/admin/users/{id}` | Yes + PIN | Super Admin Only | **404 Not Found** | Route missing from deployed `admin.php` on `cadac.in`. |
| **24** | `getAuditLogs` | `GET` | `/api/admin/audit-logs` | `/api/admin/audit-logs` | Yes | Super Admin Only | **404 Not Found** | Route missing from server deployment; table `admin_audit_logs` pending schema migration. |

---

## 3. Key Findings

1. **Working Backend Subsystems:**
   - Database connection is healthy and responsive.
   - Authentication endpoint `POST /api/admin/login` operates with HTTP 200.
   - Session validation `GET /api/admin/me` operates with HTTP 200.
   - Legacy certificate endpoint `GET /api/admin/certificates` operates with HTTP 200 and serves **12 live verified records**.
2. **Missing Backend Subsystems (404s):**
   - The remote Apache host (`cadac.in`) has an older deployment of `app/routes/admin.php` that routes only `/login`, `/me`, `/logout`, and `/certificates`.
   - The newer route handlers added in `broadbeach-backend/app/routes/admin.php` (lines 1414-1481) and controller `AdminModulesController.php` were authored in the local workspace repository but were **never transferred to `cadac.in`**.
   - Database tables `manual_certificates`, `support_tickets`, `trash_records`, and `admin_audit_logs` are defined in `database/2026_10_24_admin_panel_schema.sql` but have not been executed against the remote MySQL database.
3. **Frontend Impact:**
   - Modules (Manual Certs, Tickets, Trash, Admin Access) receive HTTP 404 from the server and display "Admin API route not found".
   - The Overview Dashboard falls back to `/certificates` (12 certificates) and displays an informative banner indicating that `/api/admin/overview` is pending server file synchronization.
