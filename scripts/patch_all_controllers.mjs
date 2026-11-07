import fs from "fs";
import path from "path";

const basePath = "C:/Users/ADMIN/Desktop/BB_course/broadbeach-backend";

// 1. AuthController.php - updateProfile()
const authPath = path.join(basePath, "app/Controllers/AuthController.php");
let authContent = fs.readFileSync(authPath, "utf8");

const authRegex = /public function updateProfile\(\): void\s*\{[\s\S]*?if \(\$userId <= 0\) \{/;
if (authRegex.test(authContent)) {
    authContent = authContent.replace(authRegex, `public function updateProfile(): void
    {
        $user = getAuthenticatedUser($this->db);
        $userId = $user ? (int) $user["id"] : 0;

        if ($userId <= 0) {`);
    fs.writeFileSync(authPath, authContent, "utf8");
    console.log("Updated AuthController.php updateProfile()");
} else {
    console.log("Could not find regex match for AuthController.php updateProfile()");
}

// 2. EnrollmentController.php - getMyEnrollments()
const enrollPath = path.join(basePath, "app/Controllers/EnrollmentController.php");
let enrollContent = fs.readFileSync(enrollPath, "utf8");
const targetEnrollOld = `        $userId =
            isset($_SESSION["user_id"])
            ? (int) 
            $_SESSION["user_id"]
            : 0;


        // -----------------------------------------------------
        // CHECK LOGIN
        // -----------------------------------------------------

        if ($userId <= 0) {`;

const targetEnrollOldCRLF = targetEnrollOld.replace(/\n/g, "\r\n");
const targetEnrollNew = `        $user = getAuthenticatedUser($this->conn);
        $userId = $user ? (int) $user["id"] : 0;

        if ($userId <= 0) {`;

if (enrollContent.includes(targetEnrollOldCRLF)) {
    enrollContent = enrollContent.replace(targetEnrollOldCRLF, targetEnrollNew.replace(/\n/g, "\r\n"));
    fs.writeFileSync(enrollPath, enrollContent, "utf8");
    console.log("Updated EnrollmentController.php getMyEnrollments() [CRLF]");
} else if (enrollContent.includes(targetEnrollOld)) {
    enrollContent = enrollContent.replace(targetEnrollOld, targetEnrollNew);
    fs.writeFileSync(enrollPath, enrollContent, "utf8");
    console.log("Updated EnrollmentController.php getMyEnrollments() [LF]");
} else {
    console.log("targetEnrollOld string not matched directly, using loose match...");
    const idx = enrollContent.indexOf("public function getMyEnrollments(): void");
    if (idx !== -1) {
        const after = enrollContent.substring(idx);
        const userIdx = after.indexOf("$userId =");
        const ifIdx = after.indexOf("if ($userId <= 0) {");
        if (userIdx !== -1 && ifIdx !== -1) {
            const beforePart = enrollContent.substring(0, idx + userIdx);
            const afterPart = enrollContent.substring(idx + ifIdx + "if ($userId <= 0) {".length);
            enrollContent = beforePart + targetEnrollNew + afterPart;
            fs.writeFileSync(enrollPath, enrollContent, "utf8");
            console.log("Updated EnrollmentController.php via substring replacement");
        }
    }
}

// 3. AssessmentController.php
const assessPath = path.join(basePath, "app/Controllers/AssessmentController.php");
let assessContent = fs.readFileSync(assessPath, "utf8");
if (!assessContent.includes("auth_helper.php")) {
    assessContent = assessContent.replace("<?php", "<?php\n\nrequire_once __DIR__ . \"/../config/auth_helper.php\";\n");
}
// Guard line 50
assessContent = assessContent.replace(
    /\$userId\s*=\s*\(int\)\(\$_SESSION\["user_id"\]\s*\?\?\s*\$_GET\["user_id"\]\s*\?\?\s*0\);/,
    `$authUser = getAuthenticatedUser($this->db);\n        $userId = $authUser ? (int)$authUser["id"] : (int)($_SESSION["user_id"] ?? $_GET["user_id"] ?? 0);`
);
// submitAssessment login check
const assessLoginRegex = /public function submitAssessment\(\): void\s*\{[\s\S]*?\$userId\s*=\s*\(int\)\s*\$_SESSION\["user_id"\];/;
if (assessLoginRegex.test(assessContent)) {
    assessContent = assessContent.replace(assessLoginRegex, `public function submitAssessment(): void
    {
        $user = getAuthenticatedUser($this->db);
        $userId = $user ? (int) ($user["id"] ?? 0) : 0;

        if ($userId <= 0) {
            $this->response(
                false,
                "Please login before submitting assessment.",
                null,
                401
            );
            return;
        }`);
    console.log("Updated AssessmentController.php submitAssessment()");
} else {
    console.log("assessLoginRegex not matched in AssessmentController.php");
}
fs.writeFileSync(assessPath, assessContent, "utf8");

// 4. CourseProgressController.php
const progPath = path.join(basePath, "app/Controllers/CourseProgressController.php");
let progContent = fs.readFileSync(progPath, "utf8");
if (!progContent.includes("auth_helper.php")) {
    progContent = progContent.replace("<?php", "<?php\n\nrequire_once __DIR__ . \"/../config/auth_helper.php\";\n");
}
const progRegex = /private function resolveUserId\(\): int\s*\{[\s\S]*?return 0;\s*\}/;
if (progRegex.test(progContent)) {
    progContent = progContent.replace(progRegex, `private function resolveUserId(): int
    {
        $user = getAuthenticatedUser($this->db);
        if ($user && !empty($user["id"])) {
            return (int) $user["id"];
        }
        if (isset($_SESSION["user_id"]) && (int)$_SESSION["user_id"] > 0) {
            return (int) $_SESSION["user_id"];
        }
        return 0;
    }`);
    fs.writeFileSync(progPath, progContent, "utf8");
    console.log("Updated CourseProgressController.php resolveUserId()");
}

// 5. Mirror updated files to backend_inspection/
const inspectionBase = path.join(process.cwd(), "backend_inspection");
function copyToInspection(rel) {
    const src = path.join(basePath, rel);
    const dest = path.join(inspectionBase, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`Mirrored ${rel} to backend_inspection`);
}

copyToInspection("app/Controllers/AuthController.php");
copyToInspection("app/Controllers/EnrollmentController.php");
copyToInspection("app/Controllers/AssessmentController.php");
copyToInspection("app/Controllers/CourseProgressController.php");
copyToInspection("app/Controllers/TicketController.php");
copyToInspection("app/config/auth_helper.php");
copyToInspection("app/config/cors.php");
copyToInspection("app/routes/api.php");

console.log("Backend controllers successfully patched and mirrored.");
