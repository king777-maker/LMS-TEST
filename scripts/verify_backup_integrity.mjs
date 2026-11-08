import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const zipPath = path.join(process.cwd(), 'BROADBEACH_COMPLETE_BACKUP.zip');
console.log('Verifying backup zip integrity for:', zipPath);

// 1. Calculate SHA256 Checksum
const fileBuffer = fs.readFileSync(zipPath);
const hashSum = crypto.createHash('sha256');
hashSum.update(fileBuffer);
const sha256 = hashSum.digest('hex');
console.log('-> Archive Size:', fileBuffer.length, 'bytes');
console.log('-> SHA256 Checksum:', sha256);

// 2. Test archive integrity using tar -tf
try {
  const listing = execSync(`tar -tf "${zipPath}"`, { encoding: 'utf8' });
  const lines = listing.split('\n').filter(Boolean);
  console.log(`-> Archive successfully opened and read: ${lines.length} files/directories contained.`);
  
  // Verify key critical items exist in the archive
  const expectedItems = [
    'BROADBEACH_WEBSITE_BACKUP/frontend/source/App.jsx',
    'BROADBEACH_WEBSITE_BACKUP/frontend/public/index.html',
    'BROADBEACH_WEBSITE_BACKUP/frontend/configuration/package.json',
    'BROADBEACH_WEBSITE_BACKUP/backend/source/Query.php',
    'BROADBEACH_WEBSITE_BACKUP/backend/database/schema_and_data_master.sql',
    'BROADBEACH_WEBSITE_BACKUP/backend/database/admin_store_active_data.json',
    'BROADBEACH_WEBSITE_BACKUP/documentation/ROUTE_INVENTORY.md',
    'BROADBEACH_WEBSITE_BACKUP/uploads/existing_media/'
  ];

  let allFound = true;
  for (const exp of expectedItems) {
    const found = lines.some(l => l.replace(/\\/g, '/').includes(exp));
    if (found) {
      console.log(`   [✓] Found: ${exp}`);
    } else {
      console.log(`   [✗] Missing: ${exp}`);
      allFound = false;
    }
  }

  if (allFound) {
    console.log('-> ALL INTEGRITY CHECKS PASSED: Backup archive is complete and verified.');
  } else {
    console.error('-> INTEGRITY CHECKS FAILED: Some files were not found.');
  }

  fs.writeFileSync('scripts/backup_verification_result.json', JSON.stringify({
    archivePath: zipPath,
    sizeBytes: fileBuffer.length,
    sha256,
    fileCount: lines.length,
    verifiedAt: new Date().toISOString(),
    status: allFound ? 'VERIFIED' : 'FAILED'
  }, null, 2));

} catch (err) {
  console.error('Failed to open archive:', err.message);
}
