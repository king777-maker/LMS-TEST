# Broadbeach Academy LMS — Security & Identity Protection Report

**Scope:** Authentication Tokens, Profile Protection, Support Tickets, Course Enrollment  
**Test Standard:** OWASP Top 10 API Security Risks (Broken Object Level Authorization, Broken User Authentication, Data Exposure)  
**Date:** November 2026  
**Status:** All Security Controls Verified & Passing

---

## 1. Security Vulnerabilities Assessed & Mitigated

| Security Area | Risk Description | Previous Status | Current Mitigation | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **API1:2023 - BOLA / IDOR** | Manipulating `?email=` in ticket endpoints to view other learners' confidential issues. | High Risk | Server forces email from verified Bearer token (`$user['email']`). Query params are disregarded. | **PASS** |
| **API2:2023 - Broken Authentication** | Unauthenticated requests accessing user profile or course data. | Medium | Endpoints strictly enforce Bearer token verification with 30-day expiration; returns 401 if missing/invalid. | **PASS** |
| **API3:2023 - Broken Object Property Level Auth** | Learners altering their certified first or last name to falsify ISO certificates. | Critical | Server enforces registered name immutability. Rejects name modification with 400 Bad Request (`NAME_IMMUTABLE`). | **PASS** |
| **API4:2023 - Unrestricted Resource Consumption** | Rapid ticket spamming or brute forcing. | Medium | Server validates payload length (min 10 chars) and enforces rate limiting in admin middleware. | **PASS** |
| **CORS Misconfiguration** | Inability to exchange authorization headers across origins. | Medium | `cors.php` explicitly whitelists `Authorization` and `X-User-Token`, while requiring specific origin match. | **PASS** |

---

## 2. Test Execution Details

### Test Case 1: Unauthenticated Profile Access
- **Target:** `GET /api/profile`
- **Request Headers:** None (No Bearer token, no session cookie)
- **Expected Status:** `401 Unauthorized`
- **Actual Status:** `401 Unauthorized`
- **Response Payload:** `{"success": false, "message": "User not logged in."}`
- **Evaluation:** PASS. Zero learner data is leaked to unauthenticated requesters.

### Test Case 2: Forged / Invalid Bearer Token
- **Target:** `GET /api/profile`
- **Request Headers:** `Authorization: Bearer invalid_forged_token_0123456789abcdef`
- **Expected Status:** `401 Unauthorized`
- **Actual Status:** `401 Unauthorized`
- **Response Payload:** `{"success": false, "message": "User not logged in."}`
- **Evaluation:** PASS. Random or forged tokens are safely rejected against MySQL token lookup.

### Test Case 3: IDOR Attack Prevention on Ticket System
- **Target:** `GET /api/tickets/my?email=victim.student@broadbeach.in`
- **Request Headers:** `Authorization: Bearer <valid_token_for_qa_tester>`
- **Behavior:** The server extracts the authenticated identity (`qa.tester@broadbeach.in`) and queries tickets matching only the authenticated user.
- **Evaluation:** PASS. Tickets belonging to `victim.student@broadbeach.in` are NOT returned.

### Test Case 4: Registered Name Immutability Tampering
- **Target:** `PUT /api/profile`
- **Payload:** `{ "name": "Dr. Hacker Person", "phone": "+91 99999 88888" }`
- **Behavior:** The server detects an attempt to modify the certified name and returns `400 Bad Request` with `NAME_IMMUTABLE`.
- **Evaluation:** PASS. Certificate authenticity integrity is preserved.

---

## 3. Cryptographic Token Specifications

- **Token Generation:** 64-character hexadecimal string generated using CSPRNG (`bin2hex(random_bytes(32))`).
- **Entropy:** 256 bits of cryptographic entropy, rendering brute-force attacks mathematically impossible.
- **Lifetime:** 30 days (`NOW() + INTERVAL 30 DAY`).
- **Storage:** Stored in indexed column `users.auth_token` on MySQL `broad_beach_online`.
- **Revocation:** Invalidation occurs automatically on `/api/logout` by clearing `auth_token` in the database.
