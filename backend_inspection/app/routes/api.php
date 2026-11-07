<?php

require_once __DIR__ .
    "/../config/session.php";

header("Content-Type: application/json; charset=UTF-8");


// ==========================================
// SESSION
// ==========================================

if (session_status() === PHP_SESSION_NONE) {

    session_start();

}



// ==========================================
// DATABASE
// ==========================================

require_once __DIR__ . "/../config/Database.php";

require_once __DIR__ . "/../Controllers/CertificateCouponController.php";

require_once __DIR__ . "/../Controllers/CouponController.php";
// ==========================================
// CONTROLLERS
// ==========================================

require_once __DIR__
    . "/../Controllers/VerifyCertificateController.php";
require_once __DIR__ . "/../Controllers/AuthController.php";

require_once __DIR__ . "/../Controllers/CertificateController.php";

require_once __DIR__ . "/../Controllers/LessonController.php";

require_once __DIR__ . "/../Controllers/AssessmentController.php";
require_once __DIR__ . "/../Controllers/CourseProgressController.php";


require_once __DIR__ . "/../Controllers/MenuController.php";

require_once __DIR__ . "/../Controllers/CourseController.php";

require_once __DIR__ . "/../Controllers/EnrollmentController.php";

require_once __DIR__ .
    "/../Controllers/FeaturedCourseController.php";
require_once __DIR__ .
    "/../Controllers/ContactController.php";
require_once __DIR__ .
    "/../Controllers/EnrollmentEnquiryController.php";
require_once __DIR__ . "/../Controllers/TicketController.php";
// ==========================================
// DATABASE CONNECTION
// ==========================================



// Admin


require_once __DIR__
    . "/../Controllers/AdminAuthController.php";
require_once __DIR__
    . "/../Controllers/AdminFreeCertificationController.php";

// require_once __DIR__ . "/../Controllers/EnrollmentController.php";
// Admin
$database =
    new Database();

$db =
    $database->connect();


// ==========================================
// CONTROLLER OBJECTS
// ==========================================

$authController =
    new AuthController(
        $db
    );

$certificateCouponController =
    new CertificateCouponController(
        $db
    );

$featuredCourseController =
    new FeaturedCourseController($db);
$enrollmentController =
    new EnrollmentController($db);



$verifyCertificateController =
    new VerifyCertificateController(
        $db
    );

$couponController =
    new CouponController(
        $db
    );
$certificateController =
    new CertificateController(
        $db
    );

$lessonController =
    new LessonController(
        $db
    );

$courseProgressController = new CourseProgressController($db);

$assessmentController =
    new AssessmentController(
        $db
    );




// ==========================================
// IMPORTANT: MENU CONTROLLER
// ==========================================

$menuController =
    new MenuController(
        $db
    );


$courseController =
    new CourseController(
        $db
    );

$contactController =
    new ContactController();

$ticketController = new TicketController($db);

$enrollmentEnquiryController =
    new EnrollmentEnquiryController($db);

// Admin

// $enrollmentController =
//     new EnrollmentController(
//         $db
//     );

$adminAuthController =
    new AdminAuthController(
        $db
    );

$adminFreeCertificationController =
    new AdminFreeCertificationController(
        $db
    );
// Admin
// ==========================================
// REQUEST METHOD
// ==========================================

$method =
    $_SERVER["REQUEST_METHOD"];


// ==========================================
// REQUEST URL
// ==========================================

$path =
    parse_url(
        $_SERVER["REQUEST_URI"],
        PHP_URL_PATH
    );
// =====================================================
// ADMIN API ROUTES
// =====================================================
//
// IMPORTANT:
// All /api/admin/* requests are handled by routes/admin.php.
//
// This check MUST happen before removing /broadbeach-backend
// from the request path, because admin.php performs its own
// path normalization.
//
// Examples:
// POST   /broadbeach-backend/api/admin/login
// GET    /broadbeach-backend/api/admin/menu-categories
// POST   /broadbeach-backend/api/admin/menu-categories
// PUT    /broadbeach-backend/api/admin/menu-categories
// DELETE /broadbeach-backend/api/admin/menu-categories
// GET    /broadbeach-backend/api/admin/menu-subcategories
// =====================================================

if (
    preg_match(
        "#/api/admin(?:/|$)#",
        $path
    )
) {

    require_once __DIR__ . "/admin.php";

    exit;
}


// ==========================================
// REMOVE PROJECT FOLDER
// ==========================================

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


// new

// =====================================================
// CONTACT INQUIRY
// =====================================================
// POST /api/contact
// =====================================================

if (
    $method === "POST" &&
    $path === "/api/contact"
) {
    $contactController->submit();
    exit;
}

if (
    $method === "POST" &&
    $path === "/api/course-enquiry"
) {
    $enrollmentEnquiryController->submit();
    exit;
}

// =====================================================
// LEARNER SUPPORT TICKETS
// =====================================================
// POST /api/tickets -> Submit ticket
// GET  /api/tickets/my -> Retrieve learner tickets
// GET  /api/tickets/{id} -> Single ticket details
// POST /api/tickets/{id}/reply -> Reply to ticket
// =====================================================

if ($method === "POST" && $path === "/api/tickets") {
    $ticketController->submit();
    exit;
}

if ($method === "GET" && $path === "/api/tickets/my") {
    $ticketController->getMyTickets();
    exit;
}

if ($method === "GET" && preg_match("#^/api/tickets/([^/]+)$#", $path, $matches)) {
    $ticketController->getTicket($matches[1]);
    exit;
}

if ($method === "POST" && preg_match("#^/api/tickets/([^/]+)/reply$#", $path, $matches)) {
    $ticketController->reply($matches[1]);
    exit;
}


if (
    $method === "POST" &&
    $path === "/api/enroll-course"
) {

    $enrollmentController
        ->enrollCourse();

    exit;
}

// =====================================================
// MY COURSES
// =====================================================
// GET /api/my-courses
// =====================================================

if (
    $method === "GET" &&
    $path === "/api/my-courses"
) {

    $enrollmentController
        ->getMyCourses();

    exit;
}

// new

// =====================================================
// FEATURED COURSES
// =====================================================

// GET /api/featured-courses

if (
    $method === "GET"
    &&
    $path === "/api/featured-courses"
) {

    $featuredCourseController
        ->getAll();

    exit;
}

// =====================================================
// SINGLE FEATURED COURSE
// =====================================================

// GET /api/featured-course?id=1

if (
    $method === "GET"
    &&
    $path === "/api/featured-course"
) {

    $featuredCourseController
        ->getById();

    exit;
}

// =====================================================
// FEATURED COURSE BY SLUG
// =====================================================

// GET /api/featured-course-by-slug?slug=...

if (
    $method === "GET"
    &&
    $path === "/api/featured-course-by-slug"
) {

    $featuredCourseController
        ->getBySlug();

    exit;
}
// =====================================================
// COURSE ENROLLMENT
// =====================================================

// POST /api/enroll-course

if (
    $method === "POST"
    &&
    $path === "/api/enroll-course"
) {

    $enrollmentController
        ->enrollCourse();

    exit;
}

// =====================================================
// SESSION TEST
// =====================================================

// GET /api/session-test

if (
    $method === "GET"
    &&
    $path === "/api/session-test"
) {

    if (
        session_status() !==
        PHP_SESSION_ACTIVE
    ) {
        session_start();
    }

    echo json_encode([
        "success" => true,
        "message" => "Session information.",
        "data" => [
            "session_id" =>
                session_id(),

            "user_id" =>
                isset($_SESSION["user_id"])
                ? (int) $_SESSION["user_id"]
                : 0,

            "email" =>
                $_SESSION["email"] ?? null,

            "logged_in" =>
                $_SESSION["logged_in"] ?? false,

            "login_time" =>
                $_SESSION["login_time"] ?? null
        ]
    ]);

    exit;
}

// ==========================================
// REMOVE TRAILING SLASH
// ==========================================

if ($path !== "/") {

    $path =
        rtrim(
            $path,
            "/"
        );
}

// =====================================================
// ENROLL COURSE
// =====================================================

if (
    $method === "POST" &&
    $path === "/api/enroll-course"
) {

    $enrollmentController
        ->enrollCourse();

    exit;
}

// =====================================================
// AUTH ROUTES
// =====================================================


// ==========================================
// REGISTER
// ==========================================

if (
    $method === "POST"
    &&
    $path === "/api/register"
) {

    $authController
        ->register();

    exit;
}


// =====================================================
// PUBLIC VERIFY CERTIFICATE
// =====================================================

if (
    $_SERVER["REQUEST_METHOD"] === "GET"
    &&
    $path === "/api/certificates/verify"
) {

    $verifyCertificateController
        ->verify();

    exit;
}
// ==========================================
// LOGIN
// ==========================================

if (
    $method === "POST"
    &&
    $path === "/api/login"
) {

    $authController
        ->login();

    exit;
}


// ==========================================
// LOGOUT
// ==========================================

if (
    $method === "POST"
    &&
    $path === "/api/logout"
) {

    $authController
        ->logout();

    exit;
}

// =====================================================
// REDEEM CERTIFICATE COUPON
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/redeem-certificate-coupon"
) {

    $certificateCouponController
        ->redeem();

    exit;
}

// ==========================================
// PROFILE
// ==========================================

if (
    $method === "GET"
    &&
    $path === "/api/profile"
) {

    $authController
        ->currentUser();

    exit;
}

if (
    ($method === "PUT" && $path === "/api/profile")
    ||
    ($method === "POST" && ($path === "/api/profile" || $path === "/api/update-profile"))
) {

    $authController
        ->updateProfile();

    exit;
}



// =====================================================
// HEADER MENU
// =====================================================


// =====================================================
// GET HEADER MENU
// GET /api/header-menu
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/header-menu"
) {

    $menuController
        ->headerMenu();

    exit;
}


// =====================================================
// PUBLIC PROFESSIONAL CERTIFICATIONS MENU
// =====================================================

if (
    $method === "GET" &&
    $path === "/api/professional-certifications-menu"
) {

    $menuController
        ->professionalCertificationMenu();

    exit;
}


// =====================================================
// COURSE MENU ITEMS
// =====================================================
//
// GET /api/course-menu-items
//
// Optional:
// ?category_id=20
// ?subcategory_id=28
//
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/course-menu-items"
) {

    $categoryId =
        isset($_GET["category_id"])
        ? (int) $_GET["category_id"]
        : null;

    $subcategoryId =
        isset($_GET["subcategory_id"])
        ? (int) $_GET["subcategory_id"]
        : null;


    $data =
        $menuController->getCourseMenuItems(
            $categoryId,
            $subcategoryId
        );


    echo json_encode([
        "success" => true,
        "status" => true,
        "message" =>
            "Course menu items fetched successfully.",
        "data" => $data
    ]);

    exit;
}
// =====================================================
// FREE CERTIFICATIONS
// =====================================================


// ==========================================
// GET ALL
// ==========================================

if (
    $method === "GET"
    &&
    $path === "/api/free-certifications"
) {

    $certificateController
        ->getAll();

    exit;
}


// ==========================================
// GET SINGLE
// ==========================================

if (
    $method === "GET"
    &&
    $path === "/api/free-certification"
) {

    $certificateController
        ->getById();

    exit;
}


// =====================================================
// COURSE LESSONS
// =====================================================

if (
    $method === "GET"
    &&
    $path === "/api/course-lessons"
) {

    $lessonController
        ->getByCertification();

    exit;
}


// =====================================================
// ASSESSMENT
// =====================================================


// ==========================================
// GET ASSESSMENT
// ==========================================

if (
    $method === "GET"
    &&
    $path === "/api/assessment"
) {

    $assessmentController
        ->getAssessment();

    exit;
}


// ==========================================
// SUBMIT ASSESSMENT
// ==========================================

if (
    $method === "POST"
    &&
    $path === "/api/submit-assessment"
) {

    $assessmentController
        ->submitAssessment();

    exit;
}


// =====================================================
// CREATE CERTIFICATE
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/create-certificate"
) {

    $certificateController
        ->createCertificate();

    exit;
}

if (
    $method === "GET"
    &&
    preg_match(
        "#^/api/courses/([^/]+)$#",
        $path,
        $matches
    )
) {

    $slug =
        urldecode(
            $matches[1]
        );


    $courseController
        ->getCourseBySlug(
            $slug
        );

    exit;
}

// =====================================================
// REDEEM COURSE COUPON
// =====================================================

if (
    $method === "POST"
    &&
    $path === "/api/redeem-course-coupon"
) {

    $couponController
        ->redeem();

    exit;
}


// ADMIN



// =====================================================
// ADMIN FREE CERTIFICATIONS
// =====================================================


// ==========================================
// GET ALL
// GET /api/admin/free-certifications
// ==========================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->getAll();

    exit;
}


// ==========================================
// GET SINGLE
// GET /api/admin/free-certifications?id=1
// ==========================================

if (
    $method === "GET"
    &&
    $path === "/api/admin/free-certification"
) {

    $adminFreeCertificationController
        ->getById();

    exit;
}


// ==========================================
// CREATE
// POST /api/admin/free-certifications
// ==========================================

if (
    $method === "POST"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->create();

    exit;
}


// ==========================================
// UPDATE
// PUT /api/admin/free-certifications
// ==========================================

if (
    $method === "PUT"
    &&
    $path === "/api/admin/free-certifications"
) {

    $adminFreeCertificationController
        ->update();

    exit;
}


// ==========================================
// DELETE
// DELETE /api/admin/free-certifications
// ==========================================

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
// ROUTE NOT FOUND
// =====================================================


// ADMIN

http_response_code(404);

header(
    "Content-Type: application/json; charset=UTF-8"
);

echo json_encode([
    "success" => false,

    "message" =>
        "API route not found.",

    "method" =>
        $method,

    "path" =>
        $path
]);

exit;