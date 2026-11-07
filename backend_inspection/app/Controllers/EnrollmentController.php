<?php

require_once __DIR__ . "/../config/auth_helper.php";

require_once __DIR__ . "/../Models/EnrollmentModel.php";


class EnrollmentController
{
    private EnrollmentModel $enrollmentModel;


    public function __construct(mysqli $db)
    {
        $this->enrollmentModel =
            new EnrollmentModel($db);
    }


    // =========================================================
    // POST /api/enroll-course
    // =========================================================

    public function enrollCourse(): void
    {
        header(
            "Content-Type: application/json; charset=UTF-8"
        );


        // -----------------------------------------------------
        // METHOD
        // -----------------------------------------------------

        if (
            $_SERVER["REQUEST_METHOD"] !== "POST"
        ) {

            http_response_code(405);

            echo json_encode([
                "success" => false,
                "message" =>
                    "Only POST method is allowed."
            ]);

            exit;
        }


        // -----------------------------------------------------
        // SESSION
        // -----------------------------------------------------
        //
        // IMPORTANT:
        // Session configuration should already have been loaded
        // by the main API router.
        //
        // Do NOT create a second/different session configuration
        // here.
        //

        if (
            session_status() === PHP_SESSION_NONE
        ) {

            session_start();
        }


        // -----------------------------------------------------
        // DEBUG SESSION
        // -----------------------------------------------------

        $sessionUserId =
            $_SESSION["user_id"] ?? null;

        $sessionLoggedIn =
            $_SESSION["logged_in"] ?? null;

        $sessionEmail =
            $_SESSION["email"] ?? null;


        // -----------------------------------------------------
        // GET LOGGED-IN USER
        // -----------------------------------------------------

        $userId = 0;


        if (
            isset($_SESSION["user_id"])
        ) {

            $userId =
                (int) $_SESSION["user_id"];
        }


        // -----------------------------------------------------
        // CHECK LOGIN
        // -----------------------------------------------------

        if ($userId <= 0) {

            http_response_code(401);

            echo json_encode([

                "success" => false,

                "message" =>
                    "User session not found. Please login again.",

                "session_debug" => [

                    "session_id" =>
                        session_id(),

                    "user_id" =>
                        $sessionUserId,

                    "logged_in" =>
                        $sessionLoggedIn,

                    "email" =>
                        $sessionEmail,

                    "session_keys" =>
                        array_keys($_SESSION)

                ]

            ]);

            exit;
        }


        // -----------------------------------------------------
        // READ JSON
        // -----------------------------------------------------

        $raw =
            file_get_contents(
                "php://input"
            );


        $input =
            json_decode(
                $raw,
                true
            );


        if (!is_array($input)) {

            http_response_code(422);

            echo json_encode([

                "success" => false,

                "message" =>
                    "Invalid JSON request.",

                "raw_body" =>
                    $raw

            ]);

            exit;
        }


        // -----------------------------------------------------
        // GET CERTIFICATION ID
        // -----------------------------------------------------

        $certificationId =
            isset(
            $input["certification_id"]
        )
            ? (int) 
            $input["certification_id"]
            : 0;


        if ($certificationId <= 0) {

            http_response_code(422);

            echo json_encode([

                "success" => false,

                "message" =>
                    "Certification ID is required.",

                "received_data" =>
                    $input

            ]);

            exit;
        }


        // -----------------------------------------------------
        // ENROLL
        // -----------------------------------------------------

        try {

            $result =
                $this->enrollmentModel
                    ->enrollUser(
                        $userId,
                        $certificationId
                    );


            if (
                !isset($result["success"]) ||
                !$result["success"]
            ) {

                http_response_code(400);

                echo json_encode(
                    $result
                );

                exit;
            }


            http_response_code(200);

            echo json_encode(
                $result
            );

            exit;


        } catch (
            Throwable $e
        ) {

            error_log(
                "ENROLL COURSE ERROR: " .
                $e->getMessage()
            );


            http_response_code(500);

            echo json_encode([

                "success" => false,

                "message" =>
                    "Course enrollment failed.",

                "error" =>
                    $e->getMessage(),

                "user_id" =>
                    $userId,

                "certification_id" =>
                    $certificationId

            ]);

            exit;
        }
    }

    // =========================================================
// GET /api/my-courses
// =========================================================

    public function getMyCourses(): void
    {
        header(
            "Content-Type: application/json; charset=UTF-8"
        );

        try {

            // -----------------------------------------------------
            // AUTHENTICATION (SESSION & BEARER TOKEN)
            // -----------------------------------------------------
            $authUser = getAuthenticatedUser($this->conn);
            $userId = $authUser ? (int)$authUser["id"] : 0;

            if ($userId <= 0) {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "User not logged in.",
                    "data" => []
                ]);
                return;
            }

                http_response_code(401);

                echo json_encode([
                    "success" => false,
                    "message" =>
                        "User not logged in.",
                    "data" => []
                ]);

                return;
            }


            // -----------------------------------------------------
            // GET USER COURSES
            // -----------------------------------------------------

            $data =
                $this->enrollmentModel
                    ->getUserEnrollments(
                        $userId
                    );


            // -----------------------------------------------------
            // RESPONSE
            // -----------------------------------------------------

            echo json_encode([
                "success" => true,
                "message" =>
                    "Courses fetched successfully.",
                "data" => $data
            ]);

        } catch (Throwable $e) {

            error_log(
                "GET MY COURSES ERROR: " .
                $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" =>
                    "Unable to fetch your courses.",
                "error" =>
                    $e->getMessage(),
                "data" => []
            ]);
        }
    }
    // =========================================================
    // GET /api/my-enrollments
    // =========================================================

    public function getMyEnrollments(): void
    {
        header(
            "Content-Type: application/json; charset=UTF-8"
        );


        // -----------------------------------------------------
        // AUTHENTICATION (SESSION & BEARER TOKEN)
            // -----------------------------------------------------
            $authUser = getAuthenticatedUser($this->conn);
            $userId = $authUser ? (int)$authUser["id"] : 0;

            if ($userId <= 0) {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "User not logged in.",
                    "data" => []
                ]);
                return;
            }
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "User not logged in.",
                    "data" => []
                ]);
                return;
            }

                http_response_code(401);

                echo json_encode([
                    "success" => false,
                    "message" =>
                        "User not logged in.",
                    "data" => []
                ]);

                return;
            }


            // -----------------------------------------------------
            // GET USER COURSES
            // -----------------------------------------------------

            $data =
                $this->enrollmentModel
                    ->getUserEnrollments(
                        $userId
                    );


            // -----------------------------------------------------
            // RESPONSE
            // -----------------------------------------------------

            echo json_encode([
                "success" => true,
                "message" =>
                    "Courses fetched successfully.",
                "data" => $data
            ]);

        } catch (Throwable $e) {

            error_log(
                "GET MY COURSES ERROR: " .
                $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" =>
                    "Unable to fetch your courses.",
                "error" =>
                    $e->getMessage(),
                "data" => []
            ]);
        }
    }
    // =========================================================
    // GET /api/my-enrollments
    // =========================================================

    public function getMyEnrollments(): void
    {
        header(
            "Content-Type: application/json; charset=UTF-8"
        );


        // -----------------------------------------------------
        // SESSION
        // -----------------------------------------------------

        if (
            session_status() === PHP_SESSION_NONE
        ) {

            session_start();
        }


        // -----------------------------------------------------
        // USER
        // -----------------------------------------------------

        $user = getAuthenticatedUser($this->conn);
        $userId = $user ? (int) $user["id"] : 0;

        if ($userId <= 0) {

            http_response_code(401);

            echo json_encode([

                "success" => false,

                "message" =>
                    "User not logged in.",

                "session_debug" => [

                    "session_id" =>
                        session_id(),

                    "user_id" =>
                        $_SESSION["user_id"] ?? null,

                    "logged_in" =>
                        $_SESSION["logged_in"] ?? null,

                    "email" =>
                        $_SESSION["email"] ?? null,

                    "session_keys" =>
                        array_keys($_SESSION)

                ]

            ]);

            exit;
        }


        // -----------------------------------------------------
        // GET ENROLLMENTS
        // -----------------------------------------------------

        try {

            $data =
                $this->enrollmentModel
                    ->getUserEnrollments(
                        $userId
                    );


            echo json_encode([

                "success" => true,

                "message" =>
                    "Enrollments fetched successfully.",

                "data" =>
                    $data

            ]);

            exit;


        } catch (
            Throwable $e
        ) {

            error_log(
                "GET MY ENROLLMENTS ERROR: " .
                $e->getMessage()
            );


            http_response_code(500);

            echo json_encode([

                "success" => false,

                "message" =>
                    "Unable to fetch enrollments.",

                "error" =>
                    $e->getMessage()

            ]);

            exit;
        }
    }
}