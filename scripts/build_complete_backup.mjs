import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, 'BROADBEACH_WEBSITE_BACKUP');
const EXTERNAL_BACKUP_DIR = 'C:\\Users\\ADMIN\\Desktop\\BROADBEACH_WEBSITE_BACKUP_EXTERNAL';

console.log('====================================================');
console.log('BROADBEACH ONLINE — COMPLETE PRODUCTION BACKUP ENGINE');
console.log('====================================================');

// Helper to recursively copy directory
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== 'BROADBEACH_WEBSITE_BACKUP') {
        copyDirSync(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ensure clean backup directory
if (fs.existsSync(BACKUP_DIR)) {
  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// 1. FRONTEND BACKUP
console.log('-> Backing up Frontend Source, Public, Components, Pages & Config...');
const feDir = path.join(BACKUP_DIR, 'frontend');
copyDirSync(path.join(ROOT_DIR, 'src'), path.join(feDir, 'source'));
copyDirSync(path.join(ROOT_DIR, 'public'), path.join(feDir, 'public'));
copyDirSync(path.join(ROOT_DIR, 'src', 'assets'), path.join(feDir, 'assets'));
copyDirSync(path.join(ROOT_DIR, 'src', 'components'), path.join(feDir, 'components'));
copyDirSync(path.join(ROOT_DIR, 'src', 'pages'), path.join(feDir, 'pages'));

const configDir = path.join(feDir, 'configuration');
fs.mkdirSync(configDir, { recursive: true });
const configFiles = ['package.json', 'package-lock.json', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js', 'index.html'];
for (const cf of configFiles) {
  if (fs.existsSync(path.join(ROOT_DIR, cf))) {
    fs.copyFileSync(path.join(ROOT_DIR, cf), path.join(configDir, cf));
  }
}

// 2. BACKEND BACKUP (Extract from broadbeach_backend_full.zip)
console.log('-> Extracting and Backing up Backend Architecture & APIs...');
const beDir = path.join(BACKUP_DIR, 'backend');
fs.mkdirSync(beDir, { recursive: true });

const tempBackendExtract = path.join(ROOT_DIR, 'temp_backend_extract');
if (fs.existsSync(tempBackendExtract)) fs.rmSync(tempBackendExtract, { recursive: true, force: true });
fs.mkdirSync(tempBackendExtract, { recursive: true });

try {
  execSync(`tar -xf broadbeach_backend_full.zip -C "${tempBackendExtract}"`);
  console.log('   Successfully extracted broadbeach_backend_full.zip');
} catch (e) {
  console.error('   Error extracting broadbeach_backend_full.zip:', e.message);
}

// Copy extracted backend files to structured destination
copyDirSync(path.join(tempBackendExtract, 'app'), path.join(beDir, 'source'));
copyDirSync(path.join(tempBackendExtract, 'app', 'Controllers'), path.join(beDir, 'api', 'controllers'));
copyDirSync(path.join(tempBackendExtract, 'app', 'routes'), path.join(beDir, 'api', 'routes'));
copyDirSync(path.join(tempBackendExtract, 'app', 'config'), path.join(beDir, 'configuration'));

// Also copy root php files
const rootPhpFiles = ['index.php', '.htaccess', 'cadac_admin_sync.php', 'pdf.php'];
for (const rf of rootPhpFiles) {
  const p = path.join(tempBackendExtract, rf);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(beDir, rf));
  }
}

// 3. DATABASE BACKUP
console.log('-> Consolidating Complete Database Schemas, Data Dumps & Manifests...');
const dbDir = path.join(BACKUP_DIR, 'backend', 'database');
fs.mkdirSync(dbDir, { recursive: true });

// Copy all SQL files from database/ directory and extracted backend
copyDirSync(path.join(ROOT_DIR, 'database'), dbDir);
if (fs.existsSync(path.join(tempBackendExtract, 'database'))) {
  copyDirSync(path.join(tempBackendExtract, 'database'), dbDir);
}

// Copy admin store JSON (active credentials, certs, tickets)
if (fs.existsSync(path.join(ROOT_DIR, 'src', 'data', 'admin_store.json'))) {
  fs.copyFileSync(
    path.join(ROOT_DIR, 'src', 'data', 'admin_store.json'),
    path.join(dbDir, 'admin_store_active_data.json')
  );
}

// Consolidate complete master SQL schema and data export
let masterSql = `-- BROADBEACH ACADEMY LMS — MASTER DATABASE CONSOLIDATED BACKUP
-- Generated: ${new Date().toISOString()}
-- Database Engine: MySQL 8.0+ / InnoDB
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci

SET FOREIGN_KEY_CHECKS = 0;

`;

const sqlFiles = fs.readdirSync(dbDir).filter(f => f.endsWith('.sql'));
for (const sf of sqlFiles) {
  const content = fs.readFileSync(path.join(dbDir, sf), 'utf8');
  masterSql += `\n-- ====================================================\n-- SOURCE SCRIPT: ${sf}\n-- ====================================================\n` + content + '\n';
}
masterSql += '\nSET FOREIGN_KEY_CHECKS = 1;\n';

fs.writeFileSync(path.join(dbDir, 'schema_and_data_master.sql'), masterSql);

// 4. UPLOADS & MEDIA
console.log('-> Preserving Uploads, Templates, Slides & Media Assets...');
const uploadsDir = path.join(BACKUP_DIR, 'uploads', 'existing_media');
fs.mkdirSync(uploadsDir, { recursive: true });

if (fs.existsSync(path.join(tempBackendExtract, 'uploads'))) {
  copyDirSync(path.join(tempBackendExtract, 'uploads'), uploadsDir);
}
copyDirSync(path.join(ROOT_DIR, 'public', 'assets'), path.join(uploadsDir, 'public_assets'));
if (fs.existsSync(path.join(ROOT_DIR, 'data'))) {
  copyDirSync(path.join(ROOT_DIR, 'data'), path.join(uploadsDir, 'mcq_data'));
}

// Clean up temp extract
fs.rmSync(tempBackendExtract, { recursive: true, force: true });

// 5. DEPLOYMENT CONFIG
console.log('-> Backing up Deployment Configurations & Environment Templates...');
const deployDir = path.join(BACKUP_DIR, 'deployment', 'deployment_config');
fs.mkdirSync(deployDir, { recursive: true });

copyDirSync(path.join(ROOT_DIR, '.github'), path.join(deployDir, '.github'));
if (fs.existsSync(path.join(ROOT_DIR, 'public', 'CNAME'))) {
  fs.copyFileSync(path.join(ROOT_DIR, 'public', 'CNAME'), path.join(deployDir, 'CNAME'));
}
if (fs.existsSync(path.join(ROOT_DIR, 'public', '.htaccess'))) {
  fs.copyFileSync(path.join(ROOT_DIR, 'public', '.htaccess'), path.join(deployDir, '.htaccess'));
}
if (fs.existsSync(path.join(ROOT_DIR, 'vercel.json'))) {
  fs.copyFileSync(path.join(ROOT_DIR, 'vercel.json'), path.join(deployDir, 'vercel.json'));
}

const envDir = path.join(BACKUP_DIR, 'deployment', 'environment_template');
fs.mkdirSync(envDir, { recursive: true });
const envExampleContent = `# BROADBEACH ACADEMY LMS — PRODUCTION ENVIRONMENT TEMPLATE
VITE_API_URL=https://cadac.in/broadbeachlearning.com/broadbeach-backend/api
VITE_MAINTENANCE_MODE=false
VITE_APP_ENV=production
`;
fs.writeFileSync(path.join(envDir, '.env.example'), envExampleContent);

// 6. DOCUMENTATION
console.log('-> Gathering Forensic Documentation & Manifests...');
const docDir = path.join(BACKUP_DIR, 'documentation');
fs.mkdirSync(docDir, { recursive: true });

const docFiles = [
  'ROUTE_INVENTORY.md',
  'SITE_AUDIT_REPORT.md',
  'UI_UX_ISSUES.md',
  'FUNCTIONAL_BUGS.md',
  'API_BACKEND_AUDIT.md',
  'SECURITY_FINDINGS.md',
  'ACCESSIBILITY_REPORT.md',
  'SEO_PERFORMANCE_REPORT.md',
  'CONTENT_CONSISTENCY_REPORT.md',
  'USER_FLOW_TEST_MATRIX.md',
  'PRIORITIZED_FIX_ROADMAP.md',
  'AUDIT_EVIDENCE.md'
];

for (const df of docFiles) {
  if (fs.existsSync(path.join(ROOT_DIR, df))) {
    fs.copyFileSync(path.join(ROOT_DIR, df), path.join(docDir, df));
  }
}

// 7. EXTERNAL COPY
console.log(`-> Mirroring complete backup outside active repository to ${EXTERNAL_BACKUP_DIR}...`);
if (fs.existsSync(EXTERNAL_BACKUP_DIR)) {
  fs.rmSync(EXTERNAL_BACKUP_DIR, { recursive: true, force: true });
}
copyDirSync(BACKUP_DIR, EXTERNAL_BACKUP_DIR);

console.log('Backup Directory Construction Complete.');
