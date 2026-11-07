import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const backendDir = "C:/Users/ADMIN/Desktop/BB_course/broadbeach-backend";

const filesToPackage = [
  "app/config/auth_helper.php",
  "app/config/cors.php",
  "app/Controllers/AuthController.php",
  "app/Controllers/EnrollmentController.php",
  "app/Controllers/TicketController.php",
  "app/Controllers/AssessmentController.php",
  "app/Controllers/CourseProgressController.php",
  "app/routes/api.php",
  "app/routes/admin.php",
  "app/Controllers/AdminModulesController.php",
  "app/Controllers/AdminAuthController.php",
  "app/Middleware/AdminAuthMiddleware.php",
];

const encodedFiles = {};
for (const relPath of filesToPackage) {
  const fullPath = path.join(backendDir, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Required file not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath, "utf8");
  encodedFiles[relPath] = Buffer.from(content).toString("base64");
  console.log(`Packaged ${relPath} (${content.length} chars)`);
}

const filesPhpArrayEntries = Object.entries(encodedFiles)
  .map(([rel, b64]) => `        '${rel}' => '${b64}',`)
  .join("\n");

const syncScriptContent = `<?php
/**
 * ============================================================================
 * BROADBEACH ACADEMY — CADAC.IN SERVER & DATABASE SYNCHRONIZATION RUNNER
 * Host: GoDaddy cPanel (cadac.in)
 * Database: broad_beach_online
 * 
 * Features:
 * 1. Secret Token Authentication
 * 2. Self-Extracting PHP File Deployment (12 Core Authentication, Route, and Controller Files)
 * 3. Non-Destructive MySQL Database Schema Migration (Zero-Destruction)
 * 4. Comprehensive Production Diagnostic Report (JSON)
 * ============================================================================
 */

header('Content-Type: application/json; charset=utf-8');

$EXPECTED_TOKEN = 'BroadbeachSync2026_SecureAdminDeploy';
$receivedToken = $_GET['token'] ?? $_POST['token'] ?? '';

if (!hash_equals($EXPECTED_TOKEN, $receivedToken)) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Forbidden: Invalid or missing administrative deployment token.',
        'hint' => 'Pass ?token=BroadbeachSync2026_SecureAdminDeploy to authorize execution.'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

require_once __DIR__ . '/app/config/Database.php';

$response = [
    'success' => true,
    'timestamp' => date('c'),
    'environment' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? __DIR__,
    ],
    'files_deployed' => [],
    'database' => [],
    'endpoints_activated' => [
        'POST /api/login (Returns Bearer token)',
        'POST /api/register (Returns Bearer token)',
        'GET /api/profile (Bearer token & session auth)',
        'PUT /api/profile (Bearer token & session auth)',
        'GET /api/my-courses (Bearer token & session auth)',
        'POST /api/enroll-course (Bearer token & session auth)',
        'POST /api/tickets (Learner ticket submission)',
        'GET /api/tickets/my (Learner ticket list with IDOR protection)',
        'GET /api/tickets/{id} (Single ticket details)',
        'POST /api/tickets/{id}/reply (Ticket reply)',
        'POST /api/admin/login (Admin Bearer token login)',
        'GET /api/admin/me (Admin profile)',
        'GET /api/admin/tickets (Admin ticket management)',
        'GET /api/admin/overview (System KPIs)',
    ]
];

// ============================================================================
// 1. SELF-DEPLOY FILE SYNC (OVERWRITE/CREATE UPDATED CONTROLLERS & ROUTES)
// ============================================================================
$deployFiles = $_GET['deploy_files'] ?? '1';

if ($deployFiles === '1') {
    $filesToSync = [
${filesPhpArrayEntries}
    ];

    foreach ($filesToSync as $relPath => $b64Data) {
        $targetFile = __DIR__ . '/' . $relPath;
        $targetDir = dirname($targetFile);

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $decoded = base64_decode($b64Data);
        $written = file_put_contents($targetFile, $decoded);

        $response['files_deployed'][$relPath] = [
            'status' => ($written !== false) ? 'SUCCESS' : 'FAILED',
            'bytes_written' => $written,
            'sha1' => ($written !== false) ? sha1_file($targetFile) : null,
        ];
    }
}

// ============================================================================
// 2. DATABASE SCHEMA MIGRATION (NON-DESTRUCTIVE EXECUTION)
// ============================================================================
try {
    $database = new Database();
    $db = $database->connect();

    $response['database']['connection'] = 'SUCCESS';
    $response['database']['database_name'] = DB_NAME;

    $executedQueries = [];
    $tableStatus = [];

    // 1. ALTER users (add auth_token and token_expires_at for learner token auth)
    $userColCheck = $db->query("SHOW COLUMNS FROM \`users\` LIKE 'auth_token'");
    if ($userColCheck && $userColCheck->num_rows === 0) {
        $db->query("ALTER TABLE \`users\` ADD COLUMN \`auth_token\` VARCHAR(255) NULL, ADD COLUMN \`token_expires_at\` DATETIME NULL, ADD INDEX \`idx_users_auth_token\` (\`auth_token\`)");
        $executedQueries[] = "ALTER TABLE users ADD COLUMN auth_token, token_expires_at, INDEX idx_users_auth_token";
    }

    // 2. ALTER admin_users (add auth_token and token_expires_at if missing)
    $adminColCheck = $db->query("SHOW COLUMNS FROM \`admin_users\` LIKE 'auth_token'");
    if ($adminColCheck && $adminColCheck->num_rows === 0) {
        $db->query("ALTER TABLE \`admin_users\` ADD COLUMN \`auth_token\` VARCHAR(255) NULL, ADD COLUMN \`token_expires_at\` DATETIME NULL");
        $executedQueries[] = "ALTER TABLE admin_users ADD COLUMN auth_token, token_expires_at";
    }

    // 3. CREATE TABLE support_tickets
    $sqlTickets = "CREATE TABLE IF NOT EXISTS \`support_tickets\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`subject\` VARCHAR(255) NOT NULL,
      \`requester_name\` VARCHAR(255) NOT NULL,
      \`requester_email\` VARCHAR(191) NOT NULL,
      \`course_name\` VARCHAR(255) NULL,
      \`certificate_id\` VARCHAR(64) NULL,
      \`category\` VARCHAR(100) NOT NULL,
      \`priority\` ENUM('Normal', 'High', 'Urgent') NOT NULL DEFAULT 'Normal',
      \`status\` ENUM('New', 'Open', 'In Progress', 'Waiting for User', 'Resolved', 'Closed') NOT NULL DEFAULT 'New',
      \`assigned_admin\` VARCHAR(191) NULL,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_ticket_status\` (\`status\`),
      INDEX \`idx_ticket_priority\` (\`priority\`),
      INDEX \`idx_ticket_category\` (\`category\`),
      INDEX \`idx_ticket_requester\` (\`requester_email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->query($sqlTickets);
    $tableStatus['support_tickets'] = 'VERIFIED_OR_CREATED';

    // 4. CREATE TABLE ticket_messages
    $sqlMessages = "CREATE TABLE IF NOT EXISTS \`ticket_messages\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`ticket_id\` VARCHAR(64) NOT NULL,
      \`sender_type\` ENUM('requester', 'admin', 'system') NOT NULL,
      \`sender_name\` VARCHAR(191) NOT NULL,
      \`sender_email\` VARCHAR(191) NOT NULL,
      \`message\` TEXT NOT NULL,
      \`is_internal\` TINYINT(1) NOT NULL DEFAULT 0,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_msg_ticket\` (\`ticket_id\`),
      INDEX \`idx_msg_internal\` (\`is_internal\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->query($sqlMessages);
    $tableStatus['ticket_messages'] = 'VERIFIED_OR_CREATED';

    // 5. CREATE TABLE manual_certificates
    $sqlManualCert = "CREATE TABLE IF NOT EXISTS \`manual_certificates\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`certificate_number\` VARCHAR(64) NOT NULL UNIQUE,
      \`student_name\` VARCHAR(255) NOT NULL,
      \`candidate_email\` VARCHAR(255) NULL,
      \`course_name\` VARCHAR(255) NOT NULL,
      \`issue_date\` DATE NOT NULL,
      \`completion_date\` DATE NULL,
      \`issuing_organization\` VARCHAR(255) NOT NULL DEFAULT 'Broadbeach Academy',
      \`signatory\` VARCHAR(255) NOT NULL DEFAULT 'Academic Director',
      \`training_type\` VARCHAR(100) NOT NULL DEFAULT 'Offline / Manual',
      \`additional_reference\` VARCHAR(255) NULL,
      \`status\` ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid',
      \`verification_status\` VARCHAR(50) NOT NULL DEFAULT 'Valid',
      \`revocation_reason\` TEXT NULL,
      \`revoked_at\` DATETIME NULL,
      \`revoked_by\` VARCHAR(191) NULL,
      \`created_by\` VARCHAR(191) NOT NULL DEFAULT 'System Admin',
      \`correction_history\` JSON NULL,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_mcert_num\` (\`certificate_number\`),
      INDEX \`idx_mcert_student\` (\`student_name\`),
      INDEX \`idx_mcert_status\` (\`status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->query($sqlManualCert);
    $tableStatus['manual_certificates'] = 'VERIFIED_OR_CREATED';

    // 6. CREATE TABLE trash_records
    $sqlTrash = "CREATE TABLE IF NOT EXISTS \`trash_records\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`record_id\` VARCHAR(64) NOT NULL,
      \`record_type\` ENUM('Online Certificate', 'Manual Certificate', 'Ticket') NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`deleted_by\` VARCHAR(191) NOT NULL,
      \`deleted_by_email\` VARCHAR(191) NOT NULL,
      \`deleted_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      \`original_data\` LONGTEXT NOT NULL,
      INDEX \`idx_trash_type\` (\`record_type\`),
      INDEX \`idx_trash_deleted_at\` (\`deleted_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->query($sqlTrash);
    $tableStatus['trash_records'] = 'VERIFIED_OR_CREATED';

    // 7. CREATE TABLE admin_audit_logs
    $sqlAudit = "CREATE TABLE IF NOT EXISTS \`admin_audit_logs\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`actor_name\` VARCHAR(191) NOT NULL,
      \`actor_email\` VARCHAR(191) NOT NULL,
      \`actor_role\` VARCHAR(50) NOT NULL,
      \`action_category\` VARCHAR(50) NOT NULL,
      \`action\` VARCHAR(100) NOT NULL,
      \`target_type\` VARCHAR(50) NOT NULL,
      \`target_id\` VARCHAR(100) NOT NULL,
      \`details\` TEXT NOT NULL,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_audit_cat\` (\`action_category\`),
      INDEX \`idx_audit_actor\` (\`actor_email\`),
      INDEX \`idx_audit_date\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->query($sqlAudit);
    $tableStatus['admin_audit_logs'] = 'VERIFIED_OR_CREATED';

    $response['database']['executed_queries'] = $executedQueries;
    $response['database']['tables'] = $tableStatus;

    // Counts
    $userCountRes = $db->query("SELECT COUNT(*) as count FROM \`users\`");
    $response['database']['users_count'] = $userCountRes ? (int)$userCountRes->fetch_assoc()['count'] : 0;

    $certCountRes = $db->query("SELECT COUNT(*) as count FROM \`certificates\`");
    $response['database']['certificates_count'] = $certCountRes ? (int)$certCountRes->fetch_assoc()['count'] : 0;

    $ticketCountRes = $db->query("SELECT COUNT(*) as count FROM \`support_tickets\`");
    $response['database']['tickets_count'] = $ticketCountRes ? (int)$ticketCountRes->fetch_assoc()['count'] : 0;

} catch (Throwable $e) {
    http_response_code(500);
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
`;

const syncFilePath = path.join(backendDir, "cadac_admin_sync.php");
fs.writeFileSync(syncFilePath, syncScriptContent, "utf8");
console.log(`Generated self-extracting ${syncFilePath} (${syncScriptContent.length} bytes)`);

// Also copy to BB_course/scripts and bb_exp-2.0
const localSyncPath = path.join(process.cwd(), "cadac_admin_sync.php");
fs.writeFileSync(localSyncPath, syncScriptContent, "utf8");
console.log(`Copied ${localSyncPath}`);

// Also copy to C:/Users/ADMIN/Desktop/BB_course/scripts/build_cadac_sync_package.mjs
fs.writeFileSync("C:/Users/ADMIN/Desktop/BB_course/scripts/build_cadac_sync_package.mjs", fs.readFileSync("c:/Users/ADMIN/Desktop/bb_exp-2.0/scripts/build_cadac_sync_package.mjs", "utf8"), "utf8");

// Create a staging folder for the zip archive
const stagingDir = path.join(process.cwd(), "cadac_deployment_staging");
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

for (const relPath of filesToPackage) {
  const src = path.join(backendDir, relPath);
  const dest = path.join(stagingDir, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
fs.copyFileSync(syncFilePath, path.join(stagingDir, "cadac_admin_sync.php"));

console.log("Staged all deployment files in cadac_deployment_staging.");
