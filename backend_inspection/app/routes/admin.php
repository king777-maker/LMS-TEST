<?php

require_once __DIR__ . "/../config/session.php";
header("Content-Type: application/json; charset=UTF-8");



// =====================================================
// DATABASE
// =====================================================

require_once __DIR__
    . "/../config/Database.php";


// =====================================================
// CONTROLLERS
// =====================================================


// =====================================================
// ADMIN AUTH
// =====================================================

require_once __DIR__
    . "/../Controllers/AdminAuthController.php";


// =====================================================
// FREE CERTIFICATIONS
// =====================================================

require_once __DIR__
    . "/../Controllers/AdminFreeCertificationController.php";


// =====================================================
// PUBLIC LESSON CONTROLLER
// =====================================================

require_once __DIR__
    . "/../Controllers/LessonController.php";

require_once __DIR__
    . "/../Controllers/AdminCertificateController.php";
// =====================================================
// ADMIN LESSON CONTROLLER
// =====================================================

require_once __DIR__
    . "/../Controllers/AdminLessonController.php";


// =====================================================
// ADMIN ASSESSMENT CONTROLLER
// =====================================================

require_once __DIR__
    . "/../Controllers/AdminAssessmentController.php";


// =====================================================
// ADMIN ASSESSMENT QUESTION CONTROLLER
// =====================================================

require_once __DIR__
    . "/../Controllers/AdminAssessmentQuestionController.php";

// =====================================================
// ADMIN COURSE DETAILS CONTROLLER
// =====================================================

require_once __DIR__
    . "/../Controllers/AdminCourseDetailsController.php";

// =====================================================
// ADMIN MENU CONTROLLER
// =====================================================

require_once __DIR__
    . "/../Controllers/MenuController.php";


// =====================================================
// DATABASE CONNECTION
// =====================================================

$database =
    new Database();

$db =
    $database->connect();


// =====================================================
// CONTROLLER OBJECTS
// =====================================================


// =====================================================
// ADMIN AUTH
// =====================================================

$adminAuthController =
    new AdminAuthController(
        $db
    );

require_once __DIR__
    . "/../Controllers/AdminModulesController.php";

$adminModulesController =
    new AdminModulesController(
        $db
    );

require_once __DIR__
    . "/../Middleware/AdminAuthMiddleware.php";

$adminAuthMiddleware =
    new AdminAuthMiddleware(
        $db
    );

$adminCertificateController =
    new AdminCertificateController(
        $db
    );
// =====================================================
// FREE CERTIFICATION
// =====================================================

$adminFreeCertificationController =
    new AdminFreeCertificationController(
        $db
    );


// =====================================================
// PUBLIC LESSON
// =====================================================

$lessonController =
    new LessonController(
        $db
    );


// =====================================================
// ADMIN LESSON
// =====================================================

$adminLessonController =
    new AdminLessonController(
        $db
    );


// =====================================================
// ADMIN ASSESSMENT
// =====================================================

$adminAssessmentController =
    new AdminAssessmentController(
        $db
    );


// =====================================================
// ADMIN ASSESSMENT QUESTIONS
// =====================================================

$adminAssessmentQuestionController =
    new AdminAssessmentQuestionController(
        $db
    );

// =====================================================
// ADMIN COURSE DETAILS
// =====================================================

$adminCourseDetailsController =
    new AdminCourseDetailsController(
        $db
    );


// =====================================================
// ADMIN MENU
// =====================================================

$menuController =
    new MenuController(
        $db
    );


// =====================================================
// REQUEST METHOD
// =====================================================

$method =
    $_SERVER["REQUEST_METHOD"];


// =====================================================
// REQUEST URL
// =====================================================

$path =
    parse_url(
        $_SERVER["REQUEST_URI"],
        PHP_URL_PATH
    );


// =====================================================
// REMOVE PROJECT FOLDER
// =====================================================

$prefixes = [
    "/broadbeachlearning.com/broadbeach-backend",
    "/broadbeach-backend",
];

foreach ($prefixes as $prefix) {
    if (str_starts_with($path, $prefix)) {
        $path = substr($path, strlen($prefix));
        break;
    }
}



// =====================================================
// REMOVE TRAILING SLASH
// =====================================================

if ($path !== "/") {

    $path =
        rtrim(
            $path,
            "/"
        );
}


// =====================================================
// DEBUG
// =====================================================

// Uncomment temporarily if required:
//
// error_log(
//     "ADMIN API: " .
//     $method .
//     " " .
//     $path
// );


// =====================================================
// =====================================================
// ADMIN AUTH ROUTES
// =====================================================
// =====================================================


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/login"
) {

    $adminAuthController
        ->login();

    exit;
}


// =====================================================
// CURRENT ADMIN
// GET /api/admin/me
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/me"
) {

    $adminAuthController
        ->me();

    exit;
}


// =====================================================
// ADMIN LOGOUT
// POST /api/admin/logout
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/logout"
) {

    $adminAuthController
        ->logout();

    exit;
}


// =====================================================
// =====================================================
// FREE CERTIFICATIONS
// =====================================================
// =====================================================


// =====================================================
// GET ALL FREE CERTIFICATIONS
// GET /api/admin/free-certifications
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->getAll();

    exit;
}


// =====================================================
// GET SINGLE FREE CERTIFICATION
// GET /api/admin/free-certification?id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/free-certification"
) {

    $adminFreeCertificationController
        ->getById();

    exit;
}


// =====================================================
// CREATE FREE CERTIFICATION
// POST /api/admin/free-certifications
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->create();

    exit;
}


// =====================================================
// UPDATE FREE CERTIFICATION
// PUT /api/admin/free-certifications
// =====================================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->update();

    exit;
}


// =====================================================
// DELETE FREE CERTIFICATION
// DELETE /api/admin/free-certifications
// =====================================================

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->delete();

    exit;
}


// =====================================================
// =====================================================
// ADMIN COURSE LESSON ROUTES
// =====================================================
// =====================================================


// =====================================================
// GET LESSONS BY CERTIFICATION
//
// GET
// /api/admin/course-lessons?certification_id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-lessons"
) {

    $adminLessonController
        ->getAll();

    exit;
}


// =====================================================
// GET SINGLE LESSON
//
// GET
// /api/admin/course-lesson?id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-lesson"
) {

    $adminLessonController
        ->getById();

    exit;
}


// =====================================================
// CREATE LESSON
//
// POST
// /api/admin/course-lessons
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/course-lessons"
) {

    $adminLessonController
        ->create();

    exit;
}


// =====================================================
// UPDATE LESSON
//
// PUT
// /api/admin/course-lessons
// =====================================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/course-lessons"
) {

    $adminLessonController
        ->update();

    exit;
}


// =====================================================
// DELETE LESSON
//
// DELETE
// /api/admin/course-lessons
// =====================================================

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/course-lessons"
) {

    $adminLessonController
        ->delete();

    exit;
}


// =====================================================
// =====================================================
// ADMIN COURSE ASSESSMENTS
// =====================================================
// =====================================================


// =====================================================
// GET ALL ASSESSMENTS
//
// GET
// /api/admin/course-assessments
//
// Used by:
// AdminAssessments.jsx
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-assessments"
) {

    $adminAssessmentController
        ->getAll();

    exit;
}


// =====================================================
// GET ALL ASSESSMENTS - ALIAS
//
// GET
// /api/admin/assessments
//
// This is kept as an additional route so either
// frontend URL can work.
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/assessments"
) {

    $adminAssessmentController
        ->getAll();

    exit;
}


// =====================================================
// GET SINGLE ASSESSMENT
//
// GET
// /api/admin/course-assessment?id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-assessment"
) {

    $adminAssessmentController
        ->getById();

    exit;
}


// =====================================================
// GET SINGLE ASSESSMENT - ALIAS
//
// GET
// /api/admin/assessment?id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/assessment"
) {

    $adminAssessmentController
        ->getById();

    exit;
}


// =====================================================
// CREATE ASSESSMENT
//
// POST
// /api/admin/course-assessments
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/course-assessments"
) {

    $adminAssessmentController
        ->create();

    exit;
}


// =====================================================
// CREATE ASSESSMENT - ALIAS
//
// POST
// /api/admin/assessments
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/assessments"
) {

    $adminAssessmentController
        ->create();

    exit;
}


// =====================================================
// UPDATE ASSESSMENT
//
// PUT
// /api/admin/course-assessments
// =====================================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/course-assessments"
) {

    $adminAssessmentController
        ->update();

    exit;
}


// =====================================================
// UPDATE ASSESSMENT - ALIAS
//
// PUT
// /api/admin/assessments
// =====================================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/assessments"
) {

    $adminAssessmentController
        ->update();

    exit;
}


// =====================================================
// DELETE ASSESSMENT
//
// DELETE
// /api/admin/course-assessments
// =====================================================

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/course-assessments"
) {

    $adminAssessmentController
        ->delete();

    exit;
}


// =====================================================
// DELETE ASSESSMENT - ALIAS
//
// DELETE
// /api/admin/assessments
// =====================================================

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/assessments"
) {

    $adminAssessmentController
        ->delete();

    exit;
}


// =====================================================
// =====================================================
// ADMIN ASSESSMENT QUESTIONS
// =====================================================
// =====================================================


// =====================================================
// GET QUESTIONS
//
// GET
// /api/admin/assessment-questions?assessment_id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/assessment-questions"
) {

    $adminAssessmentQuestionController
        ->getAll();

    exit;
}


// =====================================================
// GET SINGLE QUESTION
//
// GET
// /api/admin/assessment-question?id=1
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/assessment-question"
) {

    $adminAssessmentQuestionController
        ->getById();

    exit;
}


// =====================================================
// CREATE QUESTION
//
// POST
// /api/admin/assessment-questions
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/assessment-questions"
) {

    $adminAssessmentQuestionController
        ->create();

    exit;
}


// =====================================================
// UPDATE QUESTION
//
// PUT
// /api/admin/assessment-questions
// =====================================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/assessment-questions"
) {

    $adminAssessmentQuestionController
        ->update();

    exit;
}


// =====================================================
// DELETE QUESTION
//
// DELETE
// /api/admin/assessment-questions
// =====================================================

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/assessment-questions"
) {

    $adminAssessmentQuestionController
        ->delete();

    exit;
}


// =====================================================
// =====================================================
// ADMIN MENU / CATEGORIES
// =====================================================
// =====================================================


// =====================================================
// GET ALL CATEGORIES
//
// GET
// /api/admin/course-menu-categories
// =====================================================

if (
    $method === "GET"
    &&
    (
        $path === "/api/admin/course-menu-categories"
        ||
        $path === "/api/admin/menu-categories"
    )
) {

    $menuController
        ->getCategories();

    exit;
}


// =====================================================
// GET SINGLE CATEGORY
//
// GET
// /api/admin/course-menu-category?id=24
// =====================================================

if (
    $method === "GET"
    &&
    (
        $path === "/api/admin/course-menu-category"
        ||
        $path === "/api/admin/menu-category"
    )
) {

    $menuController
        ->getCategory();

    exit;
}


// =====================================================
// CREATE CATEGORY
//
// POST
// /api/admin/course-menu-categories
// =====================================================

if (
    $method === "POST"
    &&
    (
        $path === "/api/admin/course-menu-categories"
        ||
        $path === "/api/admin/menu-categories"
    )
) {

    $menuController
        ->createCategory();

    exit;
}


// =====================================================
// UPDATE CATEGORY
//
// PUT
// /api/admin/course-menu-categories
// =====================================================

if (
    $method === "PUT"
    &&
    (
        $path === "/api/admin/course-menu-categories"
        ||
        $path === "/api/admin/menu-categories"
    )
) {

    $menuController
        ->updateCategory();

    exit;
}


// =====================================================
// DELETE CATEGORY
//
// DELETE
// /api/admin/course-menu-categories
// =====================================================

if (
    $method === "DELETE"
    &&
    (
        $path === "/api/admin/course-menu-categories"
        ||
        $path === "/api/admin/menu-categories"
    )
) {

    $menuController
        ->deleteCategory();

    exit;
}



// =====================================================
// =====================================================
// ADMIN MENU / SUBCATEGORIES
// =====================================================
// =====================================================


// =====================================================
// GET ALL SUBCATEGORIES
//
// GET
// /api/admin/course-menu-subcategories
//
// Optional:
// ?category_id=24
// =====================================================

if (
    $method === "GET"
    &&
    (
        $path === "/api/admin/course-menu-subcategories"
        ||
        $path === "/api/admin/menu-subcategories"
    )
) {

    $menuController
        ->getSubcategories();

    exit;
}


// =====================================================
// GET SINGLE SUBCATEGORY
//
// GET
// /api/admin/course-menu-subcategory?id=28
// =====================================================

if (
    $method === "GET"
    &&
    (
        $path === "/api/admin/course-menu-subcategory"
        ||
        $path === "/api/admin/menu-subcategory"
    )
) {

    $menuController
        ->getSubcategory();

    exit;
}


// =====================================================
// CREATE SUBCATEGORY
//
// POST
// /api/admin/course-menu-subcategories
// =====================================================

if (
    $method === "POST"
    &&
    (
        $path === "/api/admin/course-menu-subcategories"
        ||
        $path === "/api/admin/menu-subcategories"
    )
) {

    $menuController
        ->createSubcategory();

    exit;
}


// =====================================================
// UPDATE SUBCATEGORY
//
// PUT
// /api/admin/course-menu-subcategories
// =====================================================

if (
    $method === "PUT"
    &&
    (
        $path === "/api/admin/course-menu-subcategories"
        ||
        $path === "/api/admin/menu-subcategories"
    )
) {

    $menuController
        ->updateSubcategory();

    exit;
}


// =====================================================
// DELETE SUBCATEGORY
//
// DELETE
// /api/admin/course-menu-subcategories
// =====================================================

if (
    $method === "DELETE"
    &&
    (
        $path === "/api/admin/course-menu-subcategories"
        ||
        $path === "/api/admin/menu-subcategories"
    )
) {

    $menuController
        ->deleteSubcategory();

    exit;
}





// ============================================================
// ADMIN ROUTES
// ============================================================


// ============================================================
// COURSE MENU ITEMS
// GET
//
// /api/admin/course-menu-items
//
// Example:
// /api/admin/course-menu-items?category_id=19
// ============================================================

if (
    $method === "GET" &&
    $path === "/api/admin/course-menu-items"
) {
    $menuController->getCourseMenuItems();
    exit;
}




// ============================================================
// COURSE MENU ITEM - SINGLE
// GET
//
// /api/admin/course-menu-item?id=453
// ============================================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-menu-item"
) {

    $menuController->getCourseMenuItem();

    exit;
}


// ============================================================
// COURSE MENU ITEM - CREATE
// POST /api/admin/course-menu-items
// ============================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/course-menu-items"
) {
    $menuController->createCourseMenuItem();
    exit;
}


// ============================================================
// COURSE MENU ITEM - UPDATE
// PUT /api/admin/course-menu-items
// ============================================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/course-menu-items"
) {
    $menuController->updateCourseMenuItem();
    exit;
}


// ============================================================
// COURSE MENU ITEM - DELETE
// DELETE /api/admin/course-menu-items
// ============================================================

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/course-menu-items"
) {
    $menuController->deleteCourseMenuItem();
    exit;
}
// =====================================================
// =====================================================
// =====================================================
// ADMIN COURSE DETAILS
// =====================================================
// =====================================================

// GET ALL COURSE DETAILS
// GET /api/admin/course-details
// Optional: ?course_item_id=1

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-details"
) {
    $adminCourseDetailsController->getAll();
    exit;
}


// GET SINGLE COURSE DETAILS
// GET /api/admin/course-detail?id=1

if (
    $method === "GET"
    &&
    $path === "/api/admin/course-detail"
) {
    $adminCourseDetailsController->getById();
    exit;
}


// GET SINGLE COURSE DETAILS
// GET /api/admin/course-details/1

if (
    $method === "GET"
    &&
    preg_match("#^/api/admin/course-details/([0-9]+)$#", $path, $matches)
) {
    $adminCourseDetailsController->getById((int) $matches[1]);
    exit;
}


// CREATE COURSE DETAILS
// POST /api/admin/course-details

if (
    $method === "POST"
    &&
    $path === "/api/admin/course-details"
) {
    $adminCourseDetailsController->create();
    exit;
}


// UPDATE COURSE DETAILS
// PUT /api/admin/course-details?id=1

if (
    $method === "PUT"
    &&
    $path === "/api/admin/course-details"
    &&
    isset($_GET["id"])
) {
    $adminCourseDetailsController->update((int) $_GET["id"]);
    exit;
}


// UPDATE COURSE DETAILS
// PUT /api/admin/course-details/1

if (
    $method === "PUT"
    &&
    preg_match("#^/api/admin/course-details/([0-9]+)$#", $path, $matches)
) {
    $adminCourseDetailsController->update((int) $matches[1]);
    exit;
}

if (
    $method === "GET"
    &&
    $path === "/api/admin/certificates"
) {

    $adminCertificateController
        ->getAll();

    exit;
}


// =====================================================
// GET SINGLE CERTIFICATE
//
// GET /api/admin/certificates/1
// =====================================================

if (
    $method === "GET"
    &&
    preg_match(
        "#^/api/admin/certificates/([0-9]+)$#",
        $path,
        $matches
    )
) {

    $adminCertificateController
        ->getById(
            (int) $matches[1]
        );

    exit;
}


// =====================================================
// CREATE CERTIFICATE
//
// POST /api/admin/certificates
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/certificates"
) {

    $adminCertificateController
        ->create();

    exit;
}


// =====================================================
// UPDATE CERTIFICATE
//
// PUT /api/admin/certificates/1
// =====================================================

if (
    $method === "PUT"
    &&
    preg_match(
        "#^/api/admin/certificates/([0-9]+)$#",
        $path,
        $matches
    )
) {

    $adminCertificateController
        ->update(
            (int) $matches[1]
        );

    exit;
}


// =====================================================
// DELETE CERTIFICATE
//
// DELETE /api/admin/certificates/1
// =====================================================

if (
    $method === "DELETE"
    &&
    preg_match(
        "#^/api/admin/certificates/([0-9]+)$#",
        $path,
        $matches
    )
) {

    $adminCertificateController
        ->delete(
            (int) $matches[1]
        );

    exit;
}

// DELETE COURSE DETAILS
// DELETE /api/admin/course-details?id=1

if (
    $method === "DELETE"
    &&
    $path === "/api/admin/course-details"
    &&
    isset($_GET["id"])
) {
    $adminCourseDetailsController->delete((int) $_GET["id"]);
    exit;
}


// DELETE COURSE DETAILS
// DELETE /api/admin/course-details/1

if (
    $method === "DELETE"
    &&
    preg_match("#^/api/admin/course-details/([0-9]+)$#", $path, $matches)
) {
    $adminCourseDetailsController->delete((int) $matches[1]);
    exit;
}


// =====================================================
// BROADBEACH ACADEMY 5 ADMIN MODULES ROUTING
// =====================================================

// OVERVIEW
if ($method === "GET" && $path === "/api/admin/overview") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "support_agent", "support", "read_only"], "Overview");
    $adminModulesController->overview();
    exit;
}

// MODULE 1: ONLINE CERT MASTER
if ($method === "GET" && $path === "/api/admin/online-certificates") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "support_agent", "support", "read_only"], "Online Certificates");
    $adminModulesController->getOnlineCertificates();
    exit;
}
if ($method === "POST" && preg_match("#^/api/admin/online-certificates/([^/]+)/revoke$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Online Certificates Revoke");
    $adminModulesController->revokeOnlineCertificate($m[1]);
    exit;
}
if ($method === "POST" && preg_match("#^/api/admin/online-certificates/([^/]+)/reissue$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Online Certificates Reissue");
    $adminModulesController->reissueOnlineCertificate($m[1]);
    exit;
}
if ($method === "DELETE" && preg_match("#^/api/admin/online-certificates/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Online Certificates Trash");
    $adminModulesController->trashOnlineCertificate($m[1]);
    exit;
}

// MODULE 2: MANUAL CERT MASTER
if ($method === "GET" && $path === "/api/admin/manual-certificates") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "read_only"], "Manual Certificates");
    $adminModulesController->getManualCertificates();
    exit;
}
if ($method === "POST" && $path === "/api/admin/manual-certificates") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Manual Certificates Create");
    $adminModulesController->createManualCertificate();
    exit;
}
if ($method === "PUT" && preg_match("#^/api/admin/manual-certificates/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Manual Certificates Update");
    $adminModulesController->updateManualCertificate($m[1]);
    exit;
}
if ($method === "DELETE" && preg_match("#^/api/admin/manual-certificates/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Manual Certificates Trash");
    $adminModulesController->deleteManualCertificate($m[1]);
    exit;
}

// MODULE 3: TICKET MASTER
if ($method === "GET" && $path === "/api/admin/tickets") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "support_agent", "support", "read_only"], "Ticket Master");
    $adminModulesController->getTickets();
    exit;
}
if ($method === "POST" && $path === "/api/admin/tickets") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "support_agent", "support"], "Ticket Master Create");
    $adminModulesController->createTicket();
    exit;
}
if ($method === "GET" && preg_match("#^/api/admin/tickets/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "support_agent", "support", "read_only"], "Ticket Master View");
    $adminModulesController->getTicket($m[1]);
    exit;
}
if ($method === "PUT" && preg_match("#^/api/admin/tickets/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager", "support_agent", "support"], "Ticket Master Update");
    $adminModulesController->updateTicket($m[1]);
    exit;
}
if ($method === "DELETE" && preg_match("#^/api/admin/tickets/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Ticket Master Trash");
    $adminModulesController->deleteTicket($m[1]);
    exit;
}

// MODULE 4: TRASH BIN
if ($method === "GET" && $path === "/api/admin/trash") {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Trash Bin");
    $adminModulesController->getTrashItems();
    exit;
}
if ($method === "POST" && preg_match("#^/api/admin/trash/([^/]+)/restore$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin", "admin", "cert_manager"], "Trash Restore");
    $adminModulesController->restoreTrashItem($m[1]);
    exit;
}
if ($method === "DELETE" && preg_match("#^/api/admin/trash/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin"], "Trash Purge");
    $adminModulesController->purgeTrashItem($m[1]);
    exit;
}

// MODULE 5: ADMIN ACCESS & AUDIT LOGS
if ($method === "GET" && ($path === "/api/admin/users" || $path === "/api/admin/admin-users")) {
    $adminAuthMiddleware->authorize(["super_admin"], "Admin Users");
    $adminModulesController->getAdminUsers();
    exit;
}
if ($method === "POST" && ($path === "/api/admin/users" || $path === "/api/admin/admin-users")) {
    $adminAuthMiddleware->authorize(["super_admin"], "Admin Users Create");
    $adminModulesController->createAdminUser();
    exit;
}
if ($method === "PUT" && preg_match("#^/api/admin/(?:users|admin-users)/([^/]+)$#", $path, $m)) {
    $adminAuthMiddleware->authorize(["super_admin"], "Admin Users Update");
    $adminModulesController->updateAdminUser($m[1]);
    exit;
}
if ($method === "GET" && $path === "/api/admin/audit-logs") {
    $adminAuthMiddleware->authorize(["super_admin"], "Audit Logs");
    $adminModulesController->getAuditLogs();
    exit;
}

// PASSWORD ROTATION / CHANGE
if ($method === "POST" && $path === "/api/admin/change-password") {
    $adminAuthMiddleware->handlePasswordChange();
    exit;
}

// =====================================================
// ADMIN ROUTE NOT FOUND
// =====================================================
// =====================================================

http_response_code(404);

echo json_encode([
    "success" => false,
    "status" => false,
    "message" => "Admin API route not found.",
    "method" => $method,
    "path" => $path
]);

exit;

http_response_code(404);

echo json_encode([
    "success" => false,

    "status" => false,

    "message" =>
        "Admin API route not found.",

    "method" =>
        $method,

    "path" =>
        $path
]);

exit;