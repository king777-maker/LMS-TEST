# BROADBEACH ACADEMY — FORENSIC AUDIT EVIDENCE LOG
**Audit Date:** October 31, 2026  
**Auditor Engine:** Edge / Puppeteer Automation & Node.js Native HTTP Client  
**Scope of Evidence:** Raw network transcripts, console logs, HTTP headers, and DOM extracts from `https://broadbeach-academy-lms-d5gx.vercel.app/` and `https://cadac.in/`  

---

## 1. Raw HTTP Evidence: Outdated Backend Deployment (Admin API 404s)

### Evidence E-01: Admin Overview Endpoint 404
```http
GET /api/admin/overview HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app
Accept: application/json

HTTP/1.1 404 Not Found
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Content-Type: application/json; charset=UTF-8
Date: Sat, 31 Oct 2026 03:14:27 GMT
Server: Vercel
Set-Cookie: PHPSESSID=so81o4o4l4krf70oaqu407ae1r; path=/; secure; HttpOnly; SameSite=Lax
X-Powered-By: PHP/8.2.35
X-Vercel-Cache: MISS

{"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"\/api\/admin\/overview"}
```

### Evidence E-02: Online Cert Master Endpoint 404
```http
GET /api/admin/online-certificates HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=UTF-8
Server: Vercel

{"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"\/api\/admin\/online-certificates"}
```

### Evidence E-03: Manual Cert Master Endpoint 404
```http
GET /api/admin/manual-certificates HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=UTF-8

{"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"\/api\/admin\/manual-certificates"}
```

### Evidence E-04: Ticket Master Endpoint 404
```http
GET /api/admin/tickets HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=UTF-8

{"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"\/api\/admin\/tickets"}
```

### Evidence E-05: Trash Bin Endpoint 404
```http
GET /api/admin/trash HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=UTF-8

{"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"\/api\/admin\/trash"}
```

### Evidence E-06: Admin Users Endpoint 404
```http
GET /api/admin/users HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=UTF-8

{"success":false,"status":false,"message":"Admin API route not found.","method":"GET","path":"\/api\/admin\/users"}
```

---

## 2. Raw HTTP Evidence: Hardcoded Admin Credential Authentication

### Evidence E-07: Successful Super Admin Authentication with Leaked Credentials
```http
POST /api/admin/login HTTP/1.1
Host: cadac.in
Content-Type: application/json

{"email":"admin@broadbeachlearning.com","password":"broad_beach_admin_2026"}

HTTP/1.1 200 OK
Date: Sat, 31 Oct 2026 03:34:43 GMT
Server: Apache
X-Powered-By: PHP/8.2.35
Set-Cookie: PHPSESSID=5sfqsdet570vevg0u2rl3pdtve; path=/; secure; HttpOnly; SameSite=Lax
Content-Type: application/json; charset=UTF-8

{
  "status": true,
  "message": "Admin login successful.",
  "data": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@broadbeachlearning.com",
    "role": "admin"
  }
}
```

### Evidence E-08: Admin Session Validation (`/api/admin/me`)
```http
GET /api/admin/me HTTP/1.1
Host: cadac.in
Cookie: PHPSESSID=ki2cemo8qfa623uoplkkosgodc

HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8

{
  "status": true,
  "message": "Admin authenticated.",
  "data": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@broadbeachlearning.com",
    "role": "admin"
  }
}
```

---

## 3. Raw Evidence: Public Certificate Verification

### Evidence E-09: Valid Credential Verification (`BOA10110`)
```http
GET /api/certificates/verify?certificate_number=BOA10110 HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8

{
  "success": true,
  "status": true,
  "message": "Certificate verified successfully.",
  "data": {
    "certificate_number": "BOA10110",
    "student_name": "Sales Broadbeach",
    "course_name": "ISO 9001:2026 QMS Awareness",
    "score": 13,
    "total_questions": 13,
    "percentage": 100,
    "pdf_path": null,
    "issued_at": "2026-09-16 10:10:22",
    "certificate_number_status": 1,
    "verification_status": "Verified",
    "verified_from_both_tables": true
  }
}
```

### Evidence E-10: Invalid Credential Verification (`INVALID123`)
```http
GET /api/certificates/verify?certificate_number=INVALID123 HTTP/1.1
Host: broadbeach-academy-lms-d5gx.vercel.app

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=UTF-8

{
  "success": false,
  "status": false,
  "message": "Certificate number was not found.",
  "data": {
    "certificate_number": "INVALID123"
  }
}
```

---

## 4. Raw Evidence: Browser DOM Extracts

### Evidence E-11: Public Certificate Verification Card Rendered in DOM
```text
OFFICIAL CREDENTIAL REGISTRY
Verify Certificate Authenticity

Certificate Serial Number: BOA10110
Status: Valid Certificate (Active)

CERTIFICATE HOLDER:   Sales Broadbeach
COURSE NAME:          ISO 9001:2026 QMS Awareness
CERTIFICATE NUMBER:   BOA10110
SCORE:                13 / 13
PERCENTAGE:           100%
DATE OF ISSUE:        16 September 2026
```

### Evidence E-12: Unauthenticated Start Course Modal Gate Rendered in DOM
```text
BROADBEACH ACADEMY
Authentication Required
“Please log in first to start this course.”

SELECTED COURSE:
ISO 9001:2026 QMS Awareness #320

To register your progress, access video lectures, and earn verifiable accreditation, 
please log in with your account.

[Cancel]   [Log In]
```

### Evidence E-13: Preserved Redirect on Login
```text
URL: https://broadbeach-academy-lms-d5gx.vercel.app/login?redirect=%2Fcourses%2Fiso-9001-2026-qms-awareness&courseId=320&slug=iso-9001-2026-qms-awareness&message=Please%20log%20in%20first%20to%20start%20this%20course.
```

---

## 5. Responsive Testing Metrics: All 7 Viewports

| Page / Surface | Viewport Name | Screen Resolution | Document Width | Window Width | Overflow Delta | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| Homepage | Mobile Compact | 360 × 800 | 360px | 360px | 0px | ✅ PASS |
| Homepage | Mobile Modern | 390 × 844 | 390px | 390px | 0px | ✅ PASS |
| Homepage | Tablet Portrait | 768 × 1024 | 768px | 768px | 0px | ✅ PASS |
| Homepage | Tablet Landscape | 1024 × 768 | 1024px | 1024px | 0px | ✅ PASS |
| Homepage | Laptop Standard | 1366 × 768 | 1366px | 1366px | 0px | ✅ PASS |
| Homepage | Desktop Large | 1440 × 900 | 1440px | 1440px | 0px | ✅ PASS |
| Homepage | Full HD Desktop | 1920 × 1080 | 1920px | 1920px | 0px | ✅ PASS |
| Free Courses | Mobile Compact | 360 × 800 | 360px | 360px | 0px | ✅ PASS |
| Free Courses | Mobile Modern | 390 × 844 | 390px | 390px | 0px | ✅ PASS |
| Free Courses | Tablet Portrait | 768 × 1024 | 768px | 768px | 0px | ✅ PASS |
| Free Courses | Tablet Landscape | 1024 × 768 | 1024px | 1024px | 0px | ✅ PASS |
| Free Courses | Laptop Standard | 1366 × 768 | 1366px | 1366px | 0px | ✅ PASS |
| Free Courses | Desktop Large | 1440 × 900 | 1440px | 1440px | 0px | ✅ PASS |
| Free Courses | Full HD Desktop | 1920 × 1080 | 1920px | 1920px | 0px | ✅ PASS |
| Verify Certificate | Mobile Compact | 360 × 800 | 360px | 360px | 0px | ✅ PASS |
| Verify Certificate | Mobile Modern | 390 × 844 | 390px | 390px | 0px | ✅ PASS |
| Verify Certificate | Tablet Portrait | 768 × 1024 | 768px | 768px | 0px | ✅ PASS |
| Verify Certificate | Tablet Landscape | 1024 × 768 | 1024px | 1024px | 0px | ✅ PASS |
| Verify Certificate | Laptop Standard | 1366 × 768 | 1366px | 1366px | 0px | ✅ PASS |
| Verify Certificate | Desktop Large | 1440 × 900 | 1440px | 1440px | 0px | ✅ PASS |
| Verify Certificate | Full HD Desktop | 1920 × 1080 | 1920px | 1920px | 0px | ✅ PASS |
