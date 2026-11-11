import fs from 'fs';
import path from 'path';

const repoPath = 'C:/Users/ADMIN/Desktop/bb_exp-2.0';

// 1. Update admin_store.json
const adminStorePath = path.join(repoPath, 'src/data/admin_store.json');
const adminStore = JSON.parse(fs.readFileSync(adminStorePath, 'utf8'));

const newAdminItems = [
  {
    id: 5463,
    certificate_number: '25BB234410',
    student_name: 'SUPRIYA.J',
    candidate_email: '',
    course_name: 'IECQ HSPM QC 080000',
    training_type: 'Corporate Training',
    issuing_organization: 'Broadbeach Academy',
    authorized_signatory: 'Dr. K. R. Sharma, Academic Director',
    issue_date: '2025-07-30',
    completion_date: '2025-07-30',
    status: 'valid',
    verification_status: 'Valid',
    validity: 'Lifetime',
    notes: 'Country: INDIA. Sl No: 1, Month: JULY 2025. Date of Entry: 11-11-2026',
    history: [
      {
        action: 'imported',
        timestamp: '2026-11-11T00:00:00Z',
        performed_by: 'System Administrator',
        details: 'Batch imported into Master Certificate Registry.'
      }
    ]
  },
  {
    id: 5464,
    certificate_number: '25BB234411',
    student_name: 'ASHOK JONNA',
    candidate_email: '',
    course_name: 'IECQ HSPM QC 080000',
    training_type: 'Corporate Training',
    issuing_organization: 'Broadbeach Academy',
    authorized_signatory: 'Dr. K. R. Sharma, Academic Director',
    issue_date: '2025-07-30',
    completion_date: '2025-07-30',
    status: 'valid',
    verification_status: 'Valid',
    validity: 'Lifetime',
    notes: 'Country: INDIA. Sl No: 2, Month: JULY 2025. Date of Entry: 11-11-2026',
    history: [
      {
        action: 'imported',
        timestamp: '2026-11-11T00:00:00Z',
        performed_by: 'System Administrator',
        details: 'Batch imported into Master Certificate Registry.'
      }
    ]
  },
  {
    id: 5465,
    certificate_number: '25BB234412',
    student_name: 'NANDHAKUMAR B',
    candidate_email: '',
    course_name: 'IECQ HSPM QC 080000',
    training_type: 'Corporate Training',
    issuing_organization: 'Broadbeach Academy',
    authorized_signatory: 'Dr. K. R. Sharma, Academic Director',
    issue_date: '2025-07-30',
    completion_date: '2025-07-30',
    status: 'valid',
    verification_status: 'Valid',
    validity: 'Lifetime',
    notes: 'Country: INDIA. Sl No: 3, Month: AUGUST 2025. Date of Entry: 11-11-2026',
    history: [
      {
        action: 'imported',
        timestamp: '2026-11-11T00:00:00Z',
        performed_by: 'System Administrator',
        details: 'Batch imported into Master Certificate Registry.'
      }
    ]
  },
  {
    id: 5466,
    certificate_number: '26BB03768',
    student_name: 'Eric Siaw nartey',
    candidate_email: '',
    course_name: 'LEAN SIX SIGMA BLACK BELT',
    training_type: 'Corporate Training',
    issuing_organization: 'Broadbeach Academy',
    authorized_signatory: 'Dr. K. R. Sharma, Academic Director',
    issue_date: '2026-10-27',
    completion_date: '2026-10-27',
    status: 'valid',
    verification_status: 'Valid',
    validity: 'Lifetime',
    notes: 'Country: GHANA. Sl No: 2497, Month: OCTOBER 2026.',
    history: [
      {
        action: 'imported',
        timestamp: '2026-11-11T00:00:00Z',
        performed_by: 'System Administrator',
        details: 'Batch imported into Master Certificate Registry.'
      }
    ]
  }
];

// Append to adminStore
for (const item of newAdminItems) {
  if (!adminStore.manual_certificates.some(c => c.certificate_number === item.certificate_number)) {
    adminStore.manual_certificates.push(item);
  }
}

fs.writeFileSync(adminStorePath, JSON.stringify(adminStore, null, 2), 'utf8');
console.log('admin_store.json updated. Total count:', adminStore.manual_certificates.length);

// 2. Update manualCertificatesData.js
const mCertDataPath = path.join(repoPath, 'src/data/manualCertificatesData.js');
let mCertCode = fs.readFileSync(mCertDataPath, 'utf8');

mCertCode = mCertCode.replace(/Total Records: \d+/, 'Total Records: ' + adminStore.manual_certificates.length);

const rawAppend = [
  '{"id":5463,"certificate_number":"25BB234410","student_name":"SUPRIYA.J","course_name":"IECQ HSPM QC 080000","issue_date":"2025-07-30","status":"valid","validity":"Lifetime","notes":"Country: INDIA. Sl No: 1, Month: JULY 2025. Date of Entry: 11-11-2026"}',
  '{"id":5464,"certificate_number":"25BB234411","student_name":"ASHOK JONNA","course_name":"IECQ HSPM QC 080000","issue_date":"2025-07-30","status":"valid","validity":"Lifetime","notes":"Country: INDIA. Sl No: 2, Month: JULY 2025. Date of Entry: 11-11-2026"}',
  '{"id":5465,"certificate_number":"25BB234412","student_name":"NANDHAKUMAR B","course_name":"IECQ HSPM QC 080000","issue_date":"2025-07-30","status":"valid","validity":"Lifetime","notes":"Country: INDIA. Sl No: 3, Month: AUGUST 2025. Date of Entry: 11-11-2026"}',
  '{"id":5466,"certificate_number":"26BB03768","student_name":"Eric Siaw nartey","course_name":"LEAN SIX SIGMA BLACK BELT","issue_date":"2026-10-27","status":"valid","validity":"Lifetime","notes":"Country: GHANA. Sl No: 2497, Month: OCTOBER 2026."}'
].join(',');

const targetOldEnd = '{"id":5462,"certificate_number":"23BB02090","student_name":"ROBINSON UCHE NWACHUKWU","course_name":"ISO 9001:2015 Certified Internal Auditor","issue_date":"2023-12-10","status":"valid","validity":"Lifetime"}';

if (!mCertCode.includes('25BB234410')) {
  mCertCode = mCertCode.replace(targetOldEnd, targetOldEnd + ',' + rawAppend);
  fs.writeFileSync(mCertDataPath, mCertCode, 'utf8');
  console.log('manualCertificatesData.js updated successfully!');
} else {
  console.log('manualCertificatesData.js already contains new items.');
}

// 3. Create incremental SQL file
const incrementalSqlPath = path.join(repoPath, 'database/2026_11_11_import_additional_4_certificates.sql');
const incrementalSql = [
  '-- Broadbeach Academy — Incremental 4 Manual Certificates Import Migration',
  '-- Generated: 2026-11-11',
  '-- Records: 25BB234410, 25BB234411, 25BB234412, 26BB03768',
  '',
  'INSERT INTO `manual_certificates` (`certificate_number`, `student_name`, `candidate_email`, `course_name`, `issue_date`, `completion_date`, `issuing_organization`, `signatory`, `training_type`, `status`, `verification_status`) VALUES',
  "('25BB234410', 'SUPRIYA.J', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),",
  "('25BB234411', 'ASHOK JONNA', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),",
  "('25BB234412', 'NANDHAKUMAR B', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),",
  "('26BB03768', 'Eric Siaw nartey', '', 'LEAN SIX SIGMA BLACK BELT', '2026-10-27', '2026-10-27', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')",
  'ON DUPLICATE KEY UPDATE',
  '  `student_name` = VALUES(`student_name`),',
  '  `course_name` = VALUES(`course_name`),',
  '  `issue_date` = VALUES(`issue_date`),',
  '  `completion_date` = VALUES(`completion_date`),',
  '  `status` = VALUES(`status`),',
  '  `verification_status` = VALUES(`verification_status`);',
  ''
].join('\n');

fs.writeFileSync(incrementalSqlPath, incrementalSql, 'utf8');
console.log('Incremental SQL migration written:', incrementalSqlPath);

// 4. Update master SQL file if needed
const masterSqlPath = path.join(repoPath, 'database/2026_11_09_import_manual_certificates.sql');
let masterSql = fs.readFileSync(masterSqlPath, 'utf8');
masterSql = masterSql.replace(/Total Records: \d+/, 'Total Records: ' + adminStore.manual_certificates.length);

const oldSqlTarget = "('23BB02090', 'ROBINSON UCHE NWACHUKWU', '', 'ISO 9001:2015 Certified Internal Auditor', '2023-12-10', '2023-12-10', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')";
if (!masterSql.includes('25BB234410')) {
  masterSql = masterSql.replace(
    oldSqlTarget,
    oldSqlTarget + ',\n' +
    "('25BB234410', 'SUPRIYA.J', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),\n" +
    "('25BB234411', 'ASHOK JONNA', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),\n" +
    "('25BB234412', 'NANDHAKUMAR B', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),\n" +
    "('26BB03768', 'Eric Siaw nartey', '', 'LEAN SIX SIGMA BLACK BELT', '2026-10-27', '2026-10-27', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')"
  );
  fs.writeFileSync(masterSqlPath, masterSql, 'utf8');
  console.log('Master SQL file updated successfully!');
}
