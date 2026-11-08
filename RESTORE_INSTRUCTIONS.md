# BROADBEACH ONLINE LMS — RESTORATION INSTRUCTIONS
**Document Version:** 1.0.0 (Production Authoritative)  
**Associated Backup:** [`BROADBEACH_COMPLETE_BACKUP.zip`](file:///c:/Users/ADMIN/Desktop/bb_exp-2.0/BROADBEACH_COMPLETE_BACKUP.zip)  
**Backup Tag:** `v-pre-maintenance-backup-20261108` | **Backup Branch:** `backup/pre-maintenance-state`  
**Trigger Command:** Whenever requested with **`"RESTORE BROADBEACH WEBSITE"`**

---

## 1. Quick Restoration (Automated)

When the instruction `"RESTORE BROADBEACH WEBSITE"` is given, run:

```powershell
# In workspace directory C:\Users\ADMIN\Desktop\bb_exp-2.0
node scripts/restore_website.mjs
```

This automated restore script performs:
1. Disables maintenance mode flag (`VITE_MAINTENANCE_MODE=false`).
2. Restores the original routing configuration.
3. Restores all original frontend and backend components from `BROADBEACH_WEBSITE_BACKUP`.
4. Re-runs `npm run build` to verify the compiled bundle.
5. Deploys to GitHub Pages (`origin main`), restoring the live site on `https://broadbeachonline.com/`.

---

## 2. Step-by-Step Manual Restoration Procedures

### Method A: Git Restoration (Fastest & Cleanest)
Since the complete working state before maintenance mode was tagged as `v-pre-maintenance-backup-20261108` and branched as `backup/pre-maintenance-state`:

```powershell
# 1. Switch back to the backup branch or tag
git checkout backup/pre-maintenance-state

# 2. Or merge back into main
git checkout main
git merge backup/pre-maintenance-state

# 3. Verify clean build
npm run build

# 4. Push to deploy
git push origin main
```

---

### Method B: Archive Restoration from `BROADBEACH_COMPLETE_BACKUP.zip`
If local workspace files have been altered, restore directly from the verified ZIP archive:

```powershell
# 1. Ensure target directory is clean
cd C:\Users\ADMIN\Desktop\bb_exp-2.0

# 2. Unpack frontend source from archive
tar -xf BROADBEACH_COMPLETE_BACKUP.zip BROADBEACH_WEBSITE_BACKUP/frontend/source
Copy-Item -Path BROADBEACH_WEBSITE_BACKUP\frontend\source\* -Destination src -Recurse -Force

# 3. Unpack public assets
tar -xf BROADBEACH_COMPLETE_BACKUP.zip BROADBEACH_WEBSITE_BACKUP/frontend/public
Copy-Item -Path BROADBEACH_WEBSITE_BACKUP\frontend\public\* -Destination public -Recurse -Force

# 4. Unpack root configuration
tar -xf BROADBEACH_COMPLETE_BACKUP.zip BROADBEACH_WEBSITE_BACKUP/frontend/configuration
Copy-Item -Path BROADBEACH_WEBSITE_BACKUP\frontend\configuration\* -Destination . -Force

# 5. Restore database and active data stores
tar -xf BROADBEACH_COMPLETE_BACKUP.zip BROADBEACH_WEBSITE_BACKUP/backend/database
Copy-Item -Path BROADBEACH_WEBSITE_BACKUP\backend\database\admin_store_active_data.json -Destination src\data\admin_store.json -Force

# 6. Reinstall and build
npm ci
npm run build
```

---

### Method C: Secondary Mirror Restoration (If Local Archive Missing)
If `BROADBEACH_COMPLETE_BACKUP.zip` in the project root is ever deleted, restore immediately from the external mirror:

```powershell
# Mirror directory:
C:\Users\ADMIN\Desktop\BROADBEACH_WEBSITE_BACKUP_EXTERNAL\

# Copy entire tree back to workspace:
Copy-Item -Path C:\Users\ADMIN\Desktop\BROADBEACH_WEBSITE_BACKUP_EXTERNAL\frontend\source\* -Destination C:\Users\ADMIN\Desktop\bb_exp-2.0\src -Recurse -Force
```

---

## 3. Post-Restoration Verification Checklist

After executing restoration, execute the following smoke tests to confirm 100% operational integrity:

1. **Homepage:** Visit `https://broadbeachonline.com/` — confirm full navbar, hero, free courses section, and footer render. Confirm maintenance page is no longer shown.
2. **Direct Course URL:** Visit `https://broadbeachonline.com/courses/iso-9001-2026-qms-awareness` — confirm Course Details page mounts with 60px Start Course CTA and 4-tab curriculum.
3. **LMS Player:** Test `/learning/322` — confirm embedded Google Drive video loads with 5 chapters.
4. **Certificate Verification:** Test `/verify-certificate` — confirm search input and official validation badges render.
5. **Support Ticket:** Test `/raise-a-ticket` — confirm form fields are editable.
6. **Admin Panel:** Test `/admin/login` — confirm administrative authentication panel is accessible.
