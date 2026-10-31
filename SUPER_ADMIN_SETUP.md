# BROADBEACH ACADEMY — SUPER ADMIN PROVISIONING & CREDENTIAL RUNBOOK
## Authoritative Server-Side Setup, Password Security & Recovery Guide

**Document Version:** 2.0  
**Target Environment:** Broadbeach Academy LMS (Production & Staging)  
**Security Classification:** Confidential / Internal DevOps & Administration  

---

## 1. Executive Summary

Broadbeach Academy implements a hardened, authoritative administrative model with strict 3-tier Role-Based Access Control (RBAC). The highest authorized role is **Super Administrator** (`super_admin`), which possesses unrestricted privileges across all administrative subsystems including Certificate Masters, Support Tickets, System Trash Bin, Administrative User Management, and Security Audit Logs.

To eliminate credential leakage and unauthorized account creation:
1. **Zero Public Registration:** No public API endpoints or frontend routes exist to register administrative users.
2. **Server-Side CLI Bootstrapping:** Initial Super Admin accounts are provisioned strictly via server command-line utilities protected by SAPI execution checks.
3. **Cryptographic Password Standards:** All administrative credentials are encrypted using `bcrypt` (Blowfish) with an algorithmic work factor of **12** (`PASSWORD_BCRYPT, ['cost' => 12]`). Plaintext passwords are never logged, stored in databases, or returned in API responses.
4. **Immediate Session Invalidation upon Reset:** Password resets and revocations immediately flush stored session tokens and terminate active sessions.

---

## 2. Server-Side Bootstrap Utility

The provisioning utility is located on the backend server at:
```
broadbeach-backend/bin/bootstrap_super_admin.php
```

### 2.1 Security Guards
- **CLI-Only SAPI Guard:**
  ```php
  if (php_sapi_name() !== 'cli') {
      http_response_code(403);
      echo json_encode(["success" => false, "message" => "Access Forbidden: CLI execution only."]);
      exit(1);
  }
  ```
  Any attempt to invoke this script via HTTP/HTTPS through Apache, Nginx, or a web proxy is terminated immediately with HTTP 403 Forbidden.
- **Duplicate Prevention:**
  The utility verifies whether an active Super Administrator already exists. If an account is found, provisioning aborts immediately with a warning to prevent accidental overwrites, unless invoked with the `--force` flag.

### 2.2 Provisioning via Environment Variables (Recommended)

In CI/CD automation or secure containerized deployments, credentials should be injected via protected environment variables:

```bash
# Set secure environment variables in your server session
export SUPER_ADMIN_EMAIL="admin@broadbeachlearning.com"
export SUPER_ADMIN_PASSWORD="StrongSuperAdminSecret2026!#"
export SUPER_ADMIN_NAME="Broadbeach Super Administrator"

# Execute bootstrap utility
php broadbeach-backend/bin/bootstrap_super_admin.php
```

### 2.3 Interactive Server CLI Execution

For direct terminal execution by an authorized DevOps Engineer:

```bash
cd /path/to/broadbeach-backend
php bin/bootstrap_super_admin.php "admin@broadbeachlearning.com" "YourStrongPassword!2026" "Broadbeach Executive"
```

If no password argument is supplied, the script generates a cryptographically secure 16-character alphanumeric temporary password using `random_bytes()` and flags the account for forced rotation on first login.

---

## 3. Credential Reset & Recovery Runbook

If a Super Administrator forgets their password, loses multi-factor device access, or in the event of an employee offboarding:

### 3.1 Server-Side Recovery Utility

The recovery script is located at:
```
broadbeach-backend/bin/reset_super_admin.php
```

### 3.2 Recovery Syntax

```bash
cd /path/to/broadbeach-backend

# Syntax: php bin/reset_super_admin.php [admin_email] [new_secure_password]
php bin/reset_super_admin.php "admin@broadbeachlearning.com" "NewUltraSecurePass2026!"
```

### 3.3 What the Reset Utility Executes:
1. Re-hashes the new password with `PASSWORD_BCRYPT` (cost factor 12).
2. Updates `admin_users.password`.
3. Revokes all active sessions by clearing `auth_token = NULL` and setting `token_expires_at = NOW()`.
4. Sets `must_change_password = 1` requiring the admin to choose a fresh password upon logging in.
5. Injects an immutable audit entry into `admin_audit_logs` recording the administrative password reset event with timestamp and server IP.

---

## 4. Environment Variables Reference

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `SUPER_ADMIN_EMAIL` | Yes | `admin@broadbeachlearning.com` | Authoritative root administrative email address. |
| `SUPER_ADMIN_PASSWORD` | Recommended | *(Auto-generated if absent)* | Initial password (min 12 chars, mixed case, numbers, symbols). |
| `SUPER_ADMIN_NAME` | No | `Broadbeach Super Administrator` | Full display name for audit logging and header display. |
| `BCRYPT_COST` | No | `12` | Cryptographic work factor for password hashing. |

---

## 5. Security Architecture & Threat Mitigation

| Threat Vector | Defense Mechanism | Verified Status |
|---|---|---|
| **Public Super Admin Registration** | Zero public registration endpoints. Route requests to `/api/admin/register` return 404/405. | Passed |
| **Credential Infiltration via API** | Passwords stripped from all controller responses (`unset($row['password'])`). | Passed |
| **Privilege Escalation / Self-Promotion** | Middleware `AdminAuthMiddleware.php` validates that only `super_admin` can manage roles. | Passed |
| **Brute-Force Attack** | Constant-time password verification (`password_verify`), rate-limiting, and 2-step TOTP challenge. | Passed |
| **Stale Session Takeover** | Active sessions revoked on password reset; tokens expire after 24 hours of inactivity. | Passed |

