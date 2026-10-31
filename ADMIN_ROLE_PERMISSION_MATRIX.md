# BROADBEACH ACADEMY — ADMIN ROLE PERMISSION MATRIX
## Comprehensive 3-Tier Administrative Access Control Specification

**Document Version:** 2.0  
**Target Environment:** Broadbeach Academy LMS  
**Architecture:** Standardized 3-Tier RBAC + Server-Side Enforcement  

---

## 1. Architectural Role Hierarchy

Broadbeach Academy defines a rigorous 3-tier administrative hierarchy with role alias mapping to support both legacy database records and modernized security policies.

```
       ┌────────────────────────────────────────────────┐
       │             TIER 1: SUPER ADMIN                │
       │       (super_admin, authoritative root)        │
       │  • Full Unrestricted Control Over All Modules  │
       │  • User Provisioning & Privilege Management    │
       │  • Irreversible Data Operations (Purge Trash)  │
       └───────────────────────┬────────────────────────┘
                               │
       ┌───────────────────────▼────────────────────────┐
       │               TIER 2: ADMIN                    │
       │           (admin, cert_manager)                │
       │  • Certificate Lifecycle Management            │
       │  • Support Ticket Oversight                    │
       │  • Trash Bin Soft-Delete & Restore             │
       │  ✗ NO User Management or Audit Log Access      │
       └───────────────────────┬────────────────────────┘
                               │
       ┌───────────────────────▼────────────────────────┐
       │             TIER 3: SUPPORT / STAFF            │
       │            (support_agent, support)            │
       │  • Candidate Support Ticket Resolution         │
       │  • Read-Only Certificate Verification          │
       │  ✗ NO Deletions, Reissues, or Trash Management │
       └───────────────────────┬────────────────────────┘
                               │
       ┌───────────────────────▼────────────────────────┐
       │                   READ-ONLY                    │
       │                  (read_only)                   │
       │  • Read-Only Auditing & Compliance Inspection  │
       │  ✗ All Mutations, Writes & Deletions Blocked   │
       └────────────────────────────────────────────────┘
```

---

## 2. Granular Module & Action Permission Matrix

| Module | Action / Endpoint | Super Admin | Admin (`admin` / `cert_manager`) | Support Agent (`support_agent`) | Read-Only (`read_only`) |
|---|---|:---:|:---:|:---:|:---:|
| **1. Overview Dashboard** | View KPI Metrics (`GET /api/admin/overview`) | **FULL** | **FULL** | **FULL** | **FULL** |
| | View Real-Time System Status | **FULL** | **FULL** | **FULL** | **FULL** |
| | View Quick Action Links | **FULL** | **FULL** | Restricted | Restricted |
| **2. Online Cert Master** | View Certificate Records (`GET /api/admin/online-certificates`) | **FULL** | **FULL** | **FULL** (View Only) | **FULL** (View Only) |
| | Revoke Certificate (`POST /api/admin/online-certificates/{id}/revoke`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Reissue Certificate (`POST /api/admin/online-certificates/{id}/reissue`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Move to Trash (`DELETE /api/admin/online-certificates/{id}`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Export CSV Data | **FULL** | **FULL** | Denied (403) | Denied (403) |
| **3. Manual Cert Master** | View Manual Records (`GET /api/admin/manual-certificates`) | **FULL** | **FULL** | **FULL** (View Only) | **FULL** (View Only) |
| | Issue New Manual Cert (`POST /api/admin/manual-certificates`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Move to Trash (`DELETE /api/admin/manual-certificates/{id}`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Print / Preview Certificate Template | **FULL** | **FULL** | **FULL** | **FULL** |
| **4. Ticket Master** | View Support Tickets (`GET /api/admin/tickets`) | **FULL** | **FULL** | **FULL** | **FULL** (View Only) |
| | Create New Ticket (`POST /api/admin/tickets`) | **FULL** | **FULL** | **FULL** | Denied (403) |
| | Update Ticket Status / Reply | **FULL** | **FULL** | **FULL** | Denied (403) |
| | Assign Ticket Agent | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Move Ticket to Trash | **FULL** | **FULL** | Denied (403) | Denied (403) |
| **5. Trash Bin** | View Trashed Records (`GET /api/admin/trash`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | Restore Trashed Record (`POST /api/admin/trash/{id}/restore`) | **FULL** | **FULL** | Denied (403) | Denied (403) |
| | **Permanently Purge Record** (`DELETE /api/admin/trash/{id}`) | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| **6. Admin Access** | View Administrator Accounts (`GET /api/admin/users`) | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| | Provision New Administrator (`POST /api/admin/users`) | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| | Modify Admin Roles / Status (`PUT /api/admin/users/{id}`) | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| | Deactivate Admin Account (`DELETE /api/admin/users/{id}`) | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| **7. Activity Logs** | View Immutable Audit Logs (`GET /api/admin/audit-logs`) | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| | Filter by Actor, Action Category, Timestamp | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |
| | Export Security Audit Log | **FULL** | **DENIED (403)** | Denied (403) | Denied (403) |

---

## 3. Enforcement Mechanisms

### 3.1 Backend Middleware Enforcement (`AdminAuthMiddleware.php`)
Every request targeting an `/api/admin/*` endpoint is evaluated before reaching controller logic:
1. **Authentication Gate:** Requests without a valid PHP session or authorized `Bearer` token immediately fail with HTTP 401 Unauthorized (`UNAUTHORIZED`).
2. **Super Admin Exemption:** If the authenticated administrator possesses role `super_admin`, access is immediately authorized without restriction.
3. **Role Validation:** If the module requires specific roles (e.g. `['super_admin']` for Admin Access or Trash Purge), callers with lesser roles receive HTTP 403 Forbidden (`FORBIDDEN_ROLE`).

### 3.2 Frontend Route Protection (`AdminProtectedRoute.jsx`)
1. **Route Obscurity:** Unauthenticated visitors accessing `/admin` are returned a 404 Page Not Found component to conceal the existence of administrative interfaces.
2. **Super Admin Bypass:** If `isSuperAdmin` is `true`, all route guards immediately return `children`.
3. **Access Restricted Screen:** If a logged-in user with `role: "cert_manager"` attempts to navigate directly to `/admin/access`, the component intercepts the navigation and renders the official Broadbeach Access Restricted UI.
