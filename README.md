# LMS-test — Independent Testing Environment

`LMS-test` is an isolated, independent testing clone of the Broadbeach Academy Learning Management System (LMS). It is configured to run tests, assessments, course interactions, and administrative verification safely without any risk of affecting or mutating the production website or database.

---

## 1. Key Characteristics & Independence

- **Independent Git Repository:** This project is initialized with its own Git history. The original remote repository association has been removed. No commits or tags will be pushed to the production repository.
- **Production Database Safeguard:** All API endpoints default to safe local paths (`/api`) or configurable test endpoints via `.env`. Live production database endpoints (`cadac.in`) are not targeted.
- **Full LMS Functionality Enabled:** Maintenance mode is disabled by default (`IS_MAINTENANCE_MODE = false`), allowing unrestricted testing of all 340+ courses, assessment workflows, learning player components, and certificate generation.
- **Domain Independence:** Production `CNAME` (`broadbeachonline.com`) is removed to prevent domain collision or accidental hijacking during test deployments.

---

## 2. Quick Start

### Installation
```bash
npm install
```

### Development Server
Run the local development server (defaults to port 3000):
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build & Preview
Build the production bundle and preview it locally:
```bash
npm run build
npm run preview
```

---

## 3. Environment Configuration

Copy `.env.example` to `.env` to configure your test environment:

```bash
cp .env.example .env
```

### Configurable Variables:
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_APP_URL` | Application root URL for testing | `http://localhost:3000` |
| `VITE_SITE_URL` | Canonical site URL for SEO and QR codes | `http://localhost:3000` |
| `VITE_BASENAME` | Router base path | `/` |
| `VITE_API_URL` | Backend API endpoint (safe proxy) | `/api` |
| `VITE_API_URL_ASSETS` | Uploaded assets endpoint | `/uploads` |
| `VITE_MAINTENANCE_MODE` | Set `false` for full LMS testing | `false` |
| `VITE_ADMIN_BASE_PATH` | Admin dashboard base path | `/admin` |
| `VITE_ADMIN_LOGIN_PATH`| Obscured admin URL path | `/secure-console/...` |
| `VITE_CUSTOM_DOMAIN` | Optional custom domain for deployment | *(empty)* |

---

## 4. Git Remote Setup (When Ready to Push to a New Remote)

To connect this testing clone to a new independent remote repository:

```bash
# Example: Add your new testing repository remote
git remote add origin https://github.com/your-username/LMS-test.git
git branch -M main
git push -u origin main
```

---

## 5. Verification Checklist

- [x] All 340+ courses and route manifests intact
- [x] Assessment MCQ questions and answer validation schemas active
- [x] Dynamic certificate QR code generator configured for configurable test domains
- [x] Production remote completely disconnected (`git remote -v` is empty)
- [x] Production database isolated from testing operations

