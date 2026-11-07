<?php

require_once __DIR__ . "/../Models/User.php";
require_once __DIR__ . "/../config/auth_helper.php";


class AuthController
{
    private User $user;
    private mysqli $db;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public function __construct(mysqli $db)
    {
        /*
         * Make absolutely sure the PHP session is active
         * before any authentication operation.
         */

        if (
            session_status() === PHP_SESSION_NONE
        ) {
            session_start();
        }


        $this->user =
            new User($db);
    }


    // ============================================================
    // REGISTER USER
    // ============================================================

    public function register(): void
    {
        $data =
            $this->getRequestData();


        // ========================================================
        // FORM VALUES
        // ========================================================

        $firstName =
            trim(
                $data["first_name"] ?? ""
            );

        $lastName =
            trim(
                $data["last_name"] ?? ""
            );

        $dateOfBirth =
            trim(
                $data["date_of_birth"] ?? ""
            );

        $email =
            strtolower(
                trim(
                    $data["email"] ?? ""
                )
            );

        $countryCode =
            trim(
                $data["country_code"] ?? ""
            );

        $phone =
            trim(
                $data["phone"] ?? ""
            );

        $address =
            trim(
                $data["address"] ?? ""
            );

        $city =
            trim(
                $data["city"] ?? ""
            );

        $zipCode =
            trim(
                $data["zip_code"] ?? ""
            );

        $state =
            trim(
                $data["state"] ?? ""
            );

        $country =
            trim(
                $data["country"] ?? ""
            );

        $totalExperience =
            trim(
                $data["total_experience"] ?? ""
            );

        $highestQualification =
            trim(
                $data["highest_qualification"] ?? ""
            );

        $designation =
            trim(
                $data["designation"] ?? ""
            );

        $nationality =
            trim(
                $data["nationality"] ?? ""
            );

        $currentOrganization =
            trim(
                $data["current_organization"] ?? ""
            );

        $password =
            $data["password"] ?? "";

        $confirmPassword =
            $data["confirm_password"] ?? "";


        // ========================================================
        // REQUIRED VALIDATION
        // ========================================================

        if (
            $firstName === "" ||
            $lastName === "" ||
            $email === "" ||
            $password === ""
        ) {

            $this->response(
                false,
                "First name, last name, email and password are required.",
                null,
                422
            );

            return;
        }


        // ========================================================
        // EMAIL VALIDATION
        // ========================================================

        if (
            !filter_var(
                $email,
                FILTER_VALIDATE_EMAIL
            )
        ) {

            $this->response(
                false,
                "Please enter a valid email address.",
                null,
                422
            );

            return;
        }


        // ========================================================
        // PASSWORD VALIDATION
        // ========================================================

        if (
            strlen($password) < 6
        ) {

            $this->response(
                false,
                "Password must be at least 6 characters.",
                null,
                422
            );

            return;
        }


        if (
            $password !== $confirmPassword
        ) {

            $this->response(
                false,
                "Password and confirm password do not match.",
                null,
                422
            );

            return;
        }


        // ========================================================
        // EMAIL EXISTS
        // ========================================================

        if (
            $this->user->emailExists(
                $email
            )
        ) {

            $this->response(
                false,
                "Email already registered.",
                null,
                409
            );

            return;
        }


        // ========================================================
        // PHONE EXISTS
        // ========================================================

        if (
            $phone !== "" &&
            $this->user->phoneExists(
                $phone
            )
        ) {

            $this->response(
                false,
                "Phone number already registered.",
                null,
                409
            );

            return;
        }


        // ========================================================
        // HASH PASSWORD
        // ========================================================

        $hashedPassword =
            password_hash(
                $password,
                PASSWORD_DEFAULT
            );


        // ========================================================
        // INSERT USER
        // ========================================================

        try {

            $userId =
                $this->user->register([

                    "first_name" =>
                        $firstName,

                    "last_name" =>
                        $lastName,

                    "date_of_birth" =>
                        $dateOfBirth,

                    "email" =>
                        $email,

                    "country_code" =>
                        $countryCode,

                    "phone" =>
                        $phone,

                    "address" =>
                        $address,

                    "city" =>
                        $city,

                    "zip_code" =>
                        $zipCode,

                    "state" =>
                        $state,

                    "country" =>
                        $country,

                    "total_experience" =>
                        $totalExperience,

                    "highest_qualification" =>
                        $highestQualification,

                    "designation" =>
                        $designation,

                    "nationality" =>
                        $nationality,

                    "current_organization" =>
                        $currentOrganization,

                    "password" =>
                        $hashedPassword

                ]);


            if (!$userId) {

                $this->response(
                    false,
                    "Registration failed.",
                    null,
                    500
                );

                return;
            }


            // ====================================================
            // GET CREATED USER
            // ====================================================

            $user =
                $this->user->getById(
                    (int) $userId
                );


            if ($user) {

                unset(
                    $user["password"]
                );
            }


            // ====================================================
            // RESPONSE
            // ====================================================

            // Generate and persist 64-char high-entropy Bearer token
            $token = bin2hex(random_bytes(32));
            ensureUserTokenColumns($this->db);
            $userIdInt = (int)$userId;
            $saveStmt = $this->db->prepare("UPDATE users SET auth_token = ?, token_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?");
            if ($saveStmt) {
                $saveStmt->bind_param("si", $token, $userIdInt);
                $saveStmt->execute();
                $saveStmt->close();
            }
            if ($user) {
                $user["token"] = $token;
                $user["auth_token"] = $token;
            }

            // Generate and persist 64-char high-entropy Bearer token
            $token = bin2hex(random_bytes(32));
            ensureUserTokenColumns($this->db);
            $userIdInt = (int)$userId;
            $saveStmt = $this->db->prepare("UPDATE users SET auth_token = ?, token_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?");
            if ($saveStmt) {
                $saveStmt->bind_param("si", $token, $userIdInt);
                $saveStmt->execute();
                $saveStmt->close();
            }
            if ($user) {
                $user["token"] = $token;
                $user["auth_token"] = $token;
            }

            $this->response(
                true,
                "Registration successful.",
                $user,
                201
            );

        } catch (
            Throwable $error
        ) {

            $this->response(
                false,
                $error->getMessage(),
                null,
                500
            );
        }
    }


    // ============================================================
    // LOGIN USER
    // ============================================================

    public function login(): void
    {
        // ========================================================
        // ENSURE SESSION IS ACTIVE
        // ========================================================

        if (
            session_status() !==
            PHP_SESSION_ACTIVE
        ) {

            session_start();
        }


        // ========================================================
        // REQUEST DATA
        // ========================================================

        $data =
            $this->getRequestData();


        $email =
            strtolower(
                trim(
                    $data["email"] ?? ""
                )
            );


        $password =
            $data["password"] ?? "";


        // ========================================================
        // VALIDATION
        // ========================================================

        if (
            $email === "" ||
            $password === ""
        ) {

            $this->response(
                false,
                "Email and password are required.",
                null,
                422
            );

            return;
        }


        // ========================================================
        // GET USER
        // ========================================================

        $user =
            $this->user->getByEmail(
                $email
            );


        if (!$user) {

            $this->response(
                false,
                "Invalid email or password.",
                null,
                401
            );

            return;
        }


        // ========================================================
        // VERIFY PASSWORD
        // ========================================================

        if (
            !password_verify(
                $password,
                $user["password"]
            )
        ) {

            $this->response(
                false,
                "Invalid email or password.",
                null,
                401
            );

            return;
        }


        // ========================================================
        // REGENERATE SESSION
        // ========================================================

        session_regenerate_id(
            true
        );


        // ========================================================
        // SAVE AUTHENTICATION DATA
        // ========================================================

        $_SESSION["user_id"] =
            (int) $user["id"];


        $_SESSION["email"] =
            $user["email"];


        $_SESSION["logged_in"] =
            true;


        // Optional timestamp
        $_SESSION["login_time"] =
            time();


        // ========================================================
        // REMOVE PASSWORD
        // ========================================================

        unset(
            $user["password"]
        );


        // ========================================================
        // SAVE SESSION
        // ========================================================

        /*
         * Explicitly write the session before returning.
         */

        session_write_close();


        // ========================================================
        // RESPONSE
        // ========================================================

        // Generate and persist 64-char high-entropy Bearer token
        $token = bin2hex(random_bytes(32));
        ensureUserTokenColumns($this->db);

        $userIdInt = (int)$user["id"];
        $saveStmt = $this->db->prepare("UPDATE users SET auth_token = ?, token_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?");
        if ($saveStmt) {
            $saveStmt->bind_param("si", $token, $userIdInt);
            $saveStmt->execute();
            $saveStmt->close();
        }

        $_SESSION["user_token"] = $token;
        $user["token"] = $token;
        $user["auth_token"] = $token;

        $this->response(
            true,
            "Login successful.",
            $user
        );
    }


    // ============================================================
    // LOGOUT USER
    // ============================================================

    // ============================================================
// LOGOUT USER
// ============================================================

    public function logout(): void
    {
        $token = getBearerTokenFromHeaders();
        if ($token) {
            $tokenEsc = $this->db->real_escape_string($token);
            @$this->db->query("UPDATE users SET auth_token = NULL, token_expires_at = NULL WHERE auth_token = '$tokenEsc'");
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(
                    session_name(),
                    "",
                    time() - 42000,
                    $params["path"] ?? "/",
                    $params["domain"] ?? "",
                    $params["secure"] ?? false,
                    $params["httponly"] ?? true
                );
            }
            @session_destroy();
        }

        $this->response(
            true,
            "Logout successful."
        );
    }

    public function currentUser(): void
    {
        $user = getAuthenticatedUser($this->db);

        if (!$user) {
            $this->response(
                false,
                "User not logged in.",
                null,
                401
            );
            return;
        }

        unset($user["password"]);

        $this->response(
            true,
            "User profile fetched successfully.",
            $user
        );
    }

    public function updateProfile(): void
    {
        $user = getAuthenticatedUser($this->db);
        $userId = $user ? (int) $user["id"] : 0;

        if ($userId <= 0) {
            $this->response(
                false,
                "User not logged in.",
                null,
                401
            );
            return;
        }

        $data = $this->getRequestData();

        $allowedFields = [
            "first_name",
            "last_name",
            "phone",
            "date_of_birth",
            "country_code",
            "address",
            "city",
            "zip_code",
            "state",
            "country",
            "total_experience",
            "highest_qualification",
            "designation",
            "nationality",
            "current_organization",
        ];

        $updateData = [];
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = trim((string) $data[$field]);
            }
        }

        if (isset($updateData["first_name"]) && $updateData["first_name"] === "") {
            $this->response(
                false,
                "First name cannot be empty.",
                null,
                422
            );
            return;
        }

        if (empty($updateData)) {
            $this->response(
                false,
                "No valid profile fields provided for update.",
                null,
                422
            );
            return;
        }

        try {
            $updated = $this->user->update($userId, $updateData);
            if (!$updated) {
                $this->response(
                    false,
                    "Failed to update profile. Please try again.",
                    null,
                    500
                );
                return;
            }

            $user = $this->user->getById($userId);
            if ($user) {
                unset($user["password"]);
            }

            $this->response(
                true,
                "Profile updated successfully.",
                $user
            );
        } catch (Throwable $e) {
            $this->response(
                false,
                "Error updating profile: " . $e->getMessage(),
                null,
                500
            );
        }
    }



    // ============================================================
    // SESSION TEST
    // ============================================================

    public function sessionTest(): void
    {
        // ========================================================
        // ENSURE SESSION
        // ========================================================

        if (
            session_status() !==
            PHP_SESSION_ACTIVE
        ) {

            session_start();
        }


        $userId =
            isset(
            $_SESSION["user_id"]
        )
            ? (int) 
            $_SESSION["user_id"]
            : 0;


        $this->response(
            true,
            "Session information.",
            [

                "session_id" =>
                    session_id(),

                "user_id" =>
                    $userId,

                "email" =>
                    $_SESSION["email"] ?? null,

                "logged_in" =>
                    $_SESSION["logged_in"] ?? false,

                "login_time" =>
                    $_SESSION["login_time"] ?? null

            ]
        );
    }


    // ============================================================
    // GET JSON REQUEST DATA
    // ============================================================

    private function getRequestData(): array
    {
        $raw =
            file_get_contents(
                "php://input"
            );


        $data =
            json_decode(
                $raw,
                true
            );


        if (
            !is_array($data)
        ) {

            return [];
        }


        return $data;
    }


    // ============================================================
    // JSON RESPONSE
    // ============================================================

    private function response(
        bool $success,
        string $message,
        mixed $data = null,
        int $status = 200
    ): void {

        http_response_code(
            $status
        );


        header(
            "Content-Type: application/json; charset=UTF-8"
        );


        $response = [

            "success" =>
                $success,

            "message" =>
                $message

        ];


        if (
            $data !== null
        ) {

            $response["data"] =
                $data;
        }


        echo json_encode(
            $response
        );


        exit;
    }
}