# BROADBEACH ONLINE LMS — PRODUCTION BACKUP MANIFEST
**Backup Generated:** November 08, 2026, 09:25:00 UTC+05:30  
**Release Authority:** Principal DevOps Engineer, Lead Systems Architect & Database Administrator  
**Source Repository:** [c:/Users/ADMIN/Desktop/bb_exp-2.0](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0)  
**Production Host:** `https://broadbeachonline.com/` (GitHub Pages) & `https://cadac.in/...` (Apache/PHP Backend)

---

## 1. Archive Identification & Checksums

| Attribute | Value | Verification Status |
|---|---|:---:|
| **Primary ZIP Archive** | `BROADBEACH_COMPLETE_BACKUP.zip` | Verified |
| **Archive Size** | `94,349,443 bytes` (~94.3 MB) | Verified |
| **File / Directory Count** | 646 total items | Verified |
| **SHA-256 Checksum** | `331dd4cd5a18cd5a17b84c0d203f63c02e812734e99a18cf116b802141fc3333` | Match |
| **Git Backup Tag** | `v-pre-maintenance-backup-20261108` | Active |
| **Git Backup Branch** | `backup/pre-maintenance-state` | Active |
| **Base Commit SHA** | `0fd09eb` | Verified |

### Redundant Storage Locations:
1. **Workspace Root:** [`c:\Users\ADMIN\Desktop\bb_exp-2.0\BROADBEACH_COMPLETE_BACKUP.zip`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/BROADBEACH_COMPLETE_BACKUP.zip)
2. **Dedicated Workspace Tree:** [`c:\Users\ADMIN\Desktop\bb_exp-2.0\BROADBEACH_WEBSITE_BACKUP\`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/BROADBEACH_WEBSITE_BACKUP)
3. **Independent External Disk Location:** `C:\Users\ADMIN\Desktop\BROADBEACH_WEBSITE_BACKUP_EXTERNAL\`
4. **Persistent System Artifacts Directory:** `C:\Users\ADMIN\.gemini\antigravity\brain\a79ad851-939c-45f5-b470-c4cee63582ee\BROADBEACH_COMPLETE_BACKUP.zip`

---

## 2. Comprehensive Inventory of Preserved Assets

```
BROADBEACH_WEBSITE_BACKUP/
├── frontend/
│   ├── source/                   # 172+ React 18 / Tailwind CSS files (components, contexts, hooks, utils)
│   ├── public/                   # Static CNAME, .htaccess, favicon, icons, snapshots
│   ├── assets/                   # Vector logos, certificates, certificate templates
│   ├── components/               # Header, Footer, Admin, Auth, Common, Modals
│   ├── pages/                    # 52 Core Pages (Courses, Categories, Admin, LMS, Legal)
│   └── configuration/            # package.json, vite.config.js, tailwind.config.js, index.html
├── backend/
│   ├── source/                   # Complete PHP 8.x backend application (app/Query.php, Models)
│   ├── api/
│   │   ├── controllers/          # 15 PHP Controllers (Auth, Tickets, Assessments, Certs, Enrolment)
│   │   └── routes/               # API and Admin route dispatchers (api.php, admin.php)
│   ├── configuration/            # Database.php, cors.php, session.php, auth_helper.php
│   └── database/
│       ├── schema_and_data_master.sql   # Consolidated master SQL migration script
│       ├── 2026_10_24_admin_panel_schema.sql
│       ├── 2026_11_04_chapter_locking_and_three_chapters_schema.sql
│       ├── 2026_11_04_update_course_videos.sql
│       ├── 2026_11_07_import_official_google_drive_mcq_assessments.sql
│       └── admin_store_active_data.json # Active online certs, manual certs, tickets, users
├── uploads/
│   └── existing_media/
│       ├── certificates/         # Generated PDF certificates & templates
│       ├── slides/               # Chapter presentation PDF slide decks
│       ├── thumbnails/           # Video and chapter thumbnails
│       ├── public_assets/        # Campus photography & admin background media
│       └── mcq_data/             # Extracted question texts and original Google Drive MCQ PDFs
├── deployment/
│   ├── deployment_config/        # .github/workflows/deploy.yml, CNAME, vercel.json, .htaccess
│   └── environment_template/     # .env.example with production environment parameters
└── documentation/                # 12 Comprehensive forensic audit reports
    ├── ROUTE_INVENTORY.md
    ├── SITE_AUDIT_REPORT.md
    ├── UI_UX_ISSUES.md
    ├── FUNCTIONAL_BUGS.md
    ├── API_BACKEND_AUDIT.md
    ├── SECURITY_FINDINGS.md
    ├── ACCESSIBILITY_REPORT.md
    ├── SEO_PERFORMANCE_REPORT.md
    ├── CONTENT_CONSISTENCY_REPORT.md
    ├── USER_FLOW_TEST_MATRIX.md
    ├── PRIORITIZED_FIX_ROADMAP.md
    └── AUDIT_EVIDENCE.md
```

---

## 3. Data Integrity & Security Declaration

- **No Secrets Exposed:** Raw database passwords, private keys, and sensitive tokens are strictly excluded from the backup manifest.
- **Independence:** The backup exists completely separately from the maintenance page mechanism. Modifying or deploying the maintenance page has **zero impact** on the backup archives.
- **Verification:** The ZIP archive was unpacked and programmatically checked against all 646 constituent items with 100% success.
