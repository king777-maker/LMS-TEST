# Broadbeach Academy — cPanel Backend Synchronization & Deployment Runbook
**Document ID:** `BB-DEPLOY-RUNBOOK-2026-002`  
**Date:** November 1, 2026  
**Target Host:** GoDaddy Linux Shared Hosting (cPanel Server `p3plzcpnl508532`)  
**Production URL:** `https://cadac.in/broadbeachlearning.com/broadbeach-backend`  

---

## 1. Document Root & Directory Hierarchy

The remote Apache server maps the backend webroot to:
```
public_html/
└── broadbeachlearning.com/
    └── broadbeach-backend/       <-- BACKEND ROOT DIRECTORY
        ├── .htaccess
        ├── index.php
        ├── cadac_admin_sync.php  <-- UPLOAD LOCATION (STANDALONE RUNNER)
        ├── app/
        │   ├── Controllers/
        │   │   └── AdminModulesController.php
        │   ├── Middleware/
        │   │   └── AdminAuthMiddleware.php
        │   └── routes/
        │       └── admin.php
        └── database/
            └── 2026_10_24_admin_panel_schema.sql
```

---

## 2. Deployment Manifest

All modified and newly required backend files have been staged and verified locally. A single deployment zip archive has been generated and placed in the project root:
`C:\Users\ADMIN\Desktop\BB_course\cadac_admin_sync_bundle.zip`  
(also mirrored to `C:\Users\ADMIN\Desktop\bb_exp-2.0\cadac_admin_sync_bundle.zip`)

| File Relative Path | Size | SHA-1 Hash | Purpose |
|---|---|---|---|
| `cadac_admin_sync.php` | 116 KB | `6f9872be...` | Standalone runner; embeds self-extracting PHP updater & runs migrations |
| `app/routes/admin.php` | 33.6 KB | `c2a8491d...` | Centralized router for all 5 admin modules under `/api/admin` |
| `app/Controllers/AdminModulesController.php` | 35.3 KB | `9d73b8e4...` | Complete CRUD controller methods for Manual Certs, Tickets, Trash, Users |
| `app/Middleware/AdminAuthMiddleware.php` | 9.8 KB | `4f38a9bc...` | Role-based authorization and session/bearer token verification |
| `database/2026_10_24_admin_panel_schema.sql` | 6.7 KB | `3e82d1a0...` | Versioned schema migration for 5 new tables & column extensions |

---

## 3. Server Administrator Deployment Instructions

### Method 1: One-Click cPanel File Manager Deployment (Recommended)
1. Log into your **GoDaddy cPanel** dashboard (`cadac.in`).
2. Open **File Manager** and navigate to:  
   `public_html/broadbeachlearning.com/broadbeach-backend/`
3. Click **Upload** in the top toolbar.
4. Select `cadac_admin_sync_bundle.zip`.
5. Once uploaded, right-click `cadac_admin_sync_bundle.zip` in File Manager and select **Extract**.
6. When prompted for the extraction directory, keep the default:  
   `public_html/broadbeachlearning.com/broadbeach-backend/`
7. Click **Extract Files**. Confirm that `cadac_admin_sync.php`, `app/routes/admin.php`, `app/Controllers/AdminModulesController.php`, and `app/Middleware/AdminAuthMiddleware.php` are placed in their respective folders.
8. Delete `cadac_admin_sync_bundle.zip` from the server.

### Method 2: Single-File Self-Extracting Deployment
If you prefer to upload only a single file without unzipping:
1. In cPanel File Manager, navigate to `public_html/broadbeachlearning.com/broadbeach-backend/`.
2. Upload ONLY `cadac_admin_sync.php`.
3. Open in your browser:  
   `https://cadac.in/broadbeachlearning.com/broadbeach-backend/cadac_admin_sync.php?token=BroadbeachSync2026_SecureAdminDeploy&deploy_files=1`
4. The script will automatically unpack and write the updated controller, router, and middleware to disk, and execute all database migrations.

---

## 4. Execution & Verification Step

Once uploaded, execute the synchronization runner by navigating to this exact URL in your browser:
```
https://cadac.in/broadbeachlearning.com/broadbeach-backend/cadac_admin_sync.php?token=BroadbeachSync2026_SecureAdminDeploy
```

### Expected JSON Output:
```json
{
  "success": true,
  "timestamp": "2026-11-01T...",
  "files_deployed": {
    "app/routes/admin.php": { "status": "SUCCESS" },
    "app/Controllers/AdminModulesController.php": { "status": "SUCCESS" },
    "app/Middleware/AdminAuthMiddleware.php": { "status": "SUCCESS" }
  },
  "database": {
    "connection": "SUCCESS",
    "database_name": "broad_beach_online",
    "tables": {
      "manual_certificates": "VERIFIED_OR_CREATED",
      "support_tickets": "VERIFIED_OR_CREATED",
      "ticket_messages": "VERIFIED_OR_CREATED",
      "trash_records": "VERIFIED_OR_CREATED",
      "admin_audit_logs": "VERIFIED_OR_CREATED"
    },
    "verified_certificates_count": 12
  }
}
```

Once this output is confirmed, all 26 admin endpoints are instantly live, and the Admin Panel modules will load live database data immediately upon clicking **Retry Connection**.
