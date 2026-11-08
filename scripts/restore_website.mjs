import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, 'BROADBEACH_WEBSITE_BACKUP');
const EXTERNAL_DIR = 'C:\\Users\\ADMIN\\Desktop\\BROADBEACH_WEBSITE_BACKUP_EXTERNAL';

console.log('====================================================');
console.log('BROADBEACH ONLINE — AUTOMATED RESTORATION PROCEDURE');
console.log('====================================================');

// 1. Locate Source Backup
let sourceBackup = null;
if (fs.existsSync(BACKUP_DIR)) {
  sourceBackup = BACKUP_DIR;
  console.log(`[1/5] Using primary backup directory: ${BACKUP_DIR}`);
} else if (fs.existsSync(EXTERNAL_DIR)) {
  sourceBackup = EXTERNAL_DIR;
  console.log(`[1/5] Primary missing; using external mirror: ${EXTERNAL_DIR}`);
} else if (fs.existsSync(path.join(ROOT_DIR, 'BROADBEACH_COMPLETE_BACKUP.zip'))) {
  console.log('[1/5] Extracting from BROADBEACH_COMPLETE_BACKUP.zip...');
  execSync(`tar -xf BROADBEACH_COMPLETE_BACKUP.zip`);
  sourceBackup = BACKUP_DIR;
} else {
  console.error('[!] FATAL: No valid backup directory or archive found!');
  process.exit(1);
}

// 2. Disable Maintenance Flag in .env and config
console.log('[2/5] Disabling Maintenance Mode flag...');
const envPath = path.join(ROOT_DIR, '.env');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/VITE_MAINTENANCE_MODE\s*=\s*true/g, 'VITE_MAINTENANCE_MODE=false');
} else {
  envContent = 'VITE_MAINTENANCE_MODE=false\n';
}
fs.writeFileSync(envPath, envContent);

// 3. Restore frontend source files from backup
console.log('[3/5] Restoring original frontend source and configuration...');
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyRecursive(path.join(sourceBackup, 'frontend', 'source'), path.join(ROOT_DIR, 'src'));
copyRecursive(path.join(sourceBackup, 'frontend', 'public'), path.join(ROOT_DIR, 'public'));

// Restore active data store
if (fs.existsSync(path.join(sourceBackup, 'backend', 'database', 'admin_store_active_data.json'))) {
  fs.copyFileSync(
    path.join(sourceBackup, 'backend', 'database', 'admin_store_active_data.json'),
    path.join(ROOT_DIR, 'src', 'data', 'admin_store.json')
  );
}

// 4. Verify Build
console.log('[4/5] Testing production compile (npm run build)...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('[✓] Build succeeded!');
} catch (e) {
  console.error('[!] Build verification failed:', e.message);
}

console.log('[5/5] Restoration complete! You may now run "git push origin main" to update production.');
