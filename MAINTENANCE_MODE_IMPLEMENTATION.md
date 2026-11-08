# BROADBEACH ONLINE LMS — MAINTENANCE MODE IMPLEMENTATION
**Implementation Date:** November 08, 2026  
**Architect:** Principal Full-Stack Engineer & UI/UX Designer  
**Scope:** Architecture, Interception Logic, Design Tokens, Admin Preservation, and Reversibility

---

## 1. Technical Architecture & Centralized Controller

Rather than altering or deleting individual route files, maintenance mode is implemented as a **centralized interception gateway** at the top of the React application tree with static HTML fallback redundancy.

```
Incoming Request (e.g. /courses/iso-9001-2026-qms-awareness)
  │
  ├──► 1. Static Web Server Layer (GitHub Pages)
  │     └─► public/404.html (Stand-alone Maintenance Page with vector logo & contacts)
  │
  └──► 2. Single Page Application Router (React / Vite)
        └─► src/App.jsx
              │
              ├── Is Admin Route? (/admin/login or secret token)
              │     └─► YES: Render Secure Admin Portal
              │
              └── Is Maintenance Mode Active? (IS_MAINTENANCE_MODE = true)
                    ├─► YES: Render <MaintenancePage /> (Global Interception)
                    └─► NO: Render normal 340 LMS routes & public components
```

---

## 2. Configuration & Flag Controller

### File: [`src/config/maintenance.js`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/config/maintenance.js)
```javascript
export const IS_MAINTENANCE_MODE = 
  import.meta.env.VITE_MAINTENANCE_MODE === "true" ||
  import.meta.env.VITE_MAINTENANCE_MODE === true ||
  true; // Currently ACTIVE for scheduled maintenance

export default IS_MAINTENANCE_MODE;
```

### Gateway Logic: [`src/App.jsx`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/App.jsx#L123-L138)
```jsx
function App() {
  const location = useLocation();
  const isLearningPlayer = location.pathname.startsWith("/learning");
  const isAdminRoute =
    location.pathname.startsWith(ADMIN_BASE_PATH) ||
    location.pathname.startsWith("/admin") ||
    isSecretAdminLoginPath(location.pathname);

  // Centralized Maintenance Mode Interception:
  if (IS_MAINTENANCE_MODE && !isAdminRoute) {
    return (
      <AuthProvider>
        <AdminProvider>
          <AuthPromptProvider>
            <MaintenancePage />
          </AuthPromptProvider>
        </AdminProvider>
      </AuthProvider>
    );
  }
  ...
```

---

## 3. Design System & Corporate Brand Identity

The maintenance page strictly mirrors Broadbeach Academy's corporate visual language:

| Design Token | Specification | Application |
|---|---|---|
| **Base Background** | `#070F1E` (Ultra-Deep Midnight Navy) | Body and main viewport container |
| **Header / Container Navy**| `#0B192C` (Deep Brand Navy) | Header banner, card surfaces, modal backdrop |
| **Accent Gold** | `#FFB800` & `#FFC72C` (Academy Gold) | Shield strokes, CTA button, tool accent |
| **Primary Typography** | `#FFFFFF` & `#F8FAFC` | Main headings and high-emphasis copy |
| **Secondary Typography** | `#93C5FD` & `#CBD5E1` | Subtitles, supporting copy, status notices |
| **Status Indicator** | `#F59E0B` (Amber Live Radar) | "Website Under Maintenance" pulsing badge |
| **WhatsApp Brand** | `#25D366` | Direct WhatsApp support action button |

### Required Content Fidelity:
- **Main Heading:** `WE'LL BE BACK SOON!`
- **Supporting Heading:** `We're Currently Improving Our Website`
- **Description:** *"Broadbeach Online is undergoing scheduled maintenance as we work to improve your experience. We're making important improvements to deliver a better, faster and more reliable platform."*
- **Status Indicator:** `Website Under Maintenance` with pulsating amber radar beacon.
- **Supporting Notice:** *"Our team is working on improvements. Thank you for your patience and understanding."*
- **Contact Details:** `certification@broadbeach.in` & WhatsApp `+91 7338 649 737`.

---

## 4. Administrative Access Preservation

- **Zero Backdoors:** No insecure URL parameters (e.g. `?bypass=secret`) or hardcoded bypasses were created.
- **Admin Authentication:** Administrative access is preserved exclusively for staff possessing valid cryptographic credentials via [`/admin/login`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/src/pages/admin/AdminLogin.jsx) or the secret admin path.
- **RBAC Enforcement:** Normal unauthenticated visitors visiting `/admin/dashboard` are redirected to `/admin/login`, preserving administrative security boundaries.

---

## 5. Instant Reversibility

When instructed with `"RESTORE BROADBEACH WEBSITE"`:
1. Setting `IS_MAINTENANCE_MODE = false` in `src/config/maintenance.js` immediately reinstates the entire 340-route platform.
2. No page files, course models, or database tables were overwritten.
