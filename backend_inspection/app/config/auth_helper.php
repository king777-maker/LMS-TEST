<?php

/**
 * ============================================================================
 * BROADBEACH ACADEMY — CENTRALIZED LEARNER & USER AUTHENTICATION RESOLVER
 * ============================================================================
 * 
 * Provides unified, secure identity verification for all learner-facing endpoints:
 * - Checks Authorization: Bearer <token>
 * - Checks X-User-Token header
 * - Checks active PHP session ($_SESSION["user_id"])
 * - Queries users table with token expiry validation
 * - Auto-provisions auth_token and token_expires_at columns if missing
 */

if (!function_exists("getBearerTokenFromHeaders")) {
    function getBearerTokenFromHeaders(): ?string
    {
        $headers = [];
        if (function_exists("getallheaders")) {
            $headers = getallheaders();
        }

        // Normalize header keys to lowercase
        $normalized = [];
        foreach ($headers as $k => $v) {
            $normalized[strtolower($k)] = $v;
        }

        $authHeader = $normalized["authorization"] ?? 
                      $_SERVER["HTTP_AUTHORIZATION"] ?? 
                      $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ?? 
                      "";

        if ($authHeader && preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            return trim($matches[1]);
        }

        $userTokenHeader = $normalized["x-user-token"] ?? 
                           $_SERVER["HTTP_X_USER_TOKEN"] ?? 
                           "";

        if ($userTokenHeader) {
            return trim($userTokenHeader);
        }

        return null;
    }
}

if (!function_exists("getAuthenticatedUser")) {
    function getAuthenticatedUser(mysqli $db): ?array
    {
        // 1. Check Bearer Token
        $token = getBearerTokenFromHeaders();
        if ($token && strlen($token) >= 16) {
            // Ensure token columns exist on users table
            ensureUserTokenColumns($db);

            $tokenEsc = $db->real_escape_string($token);
            $query = "
                SELECT 
                    id, first_name, last_name, name, email, phone, date_of_birth,
                    address, city, state, country, zip_code, total_experience,
                    highest_qualification, designation, current_organization, nationality,
                    auth_token, token_expires_at, created_at, updated_at
                FROM users 
                WHERE auth_token = '$tokenEsc' 
                  AND (token_expires_at IS NULL OR token_expires_at > NOW())
                LIMIT 1
            ";

            $res = @$db->query($query);
            if ($res && $res->num_rows > 0) {
                $user = $res->fetch_assoc();
                // Normalize full name
                $firstName = trim($user["first_name"] ?? "");
                $lastName = trim($user["last_name"] ?? "");
                if (empty($user["name"])) {
                    $user["name"] = trim("$firstName $lastName") ?: "Student";
                }
                $user["full_name"] = $user["name"];

                // Sync session for any subsequent same-request operations
                if (session_status() === PHP_SESSION_ACTIVE) {
                    $_SESSION["user_id"] = (int)$user["id"];
                    $_SESSION["email"] = $user["email"];
                    $_SESSION["logged_in"] = true;
                }

                return $user;
            }
        }

        // 2. Check PHP Session
        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }

        $sessionUserId = isset($_SESSION["user_id"]) ? (int)$_SESSION["user_id"] : 0;
        if ($sessionUserId > 0) {
            $userEsc = (int)$sessionUserId;
            $res = @$db->query("
                SELECT 
                    id, first_name, last_name, name, email, phone, date_of_birth,
                    address, city, state, country, zip_code, total_experience,
                    highest_qualification, designation, current_organization, nationality,
                    created_at, updated_at
                FROM users 
                WHERE id = $userEsc 
                LIMIT 1
            ");
            if ($res && $res->num_rows > 0) {
                $user = $res->fetch_assoc();
                $firstName = trim($user["first_name"] ?? "");
                $lastName = trim($user["last_name"] ?? "");
                if (empty($user["name"])) {
                    $user["name"] = trim("$firstName $lastName") ?: "Student";
                }
                $user["full_name"] = $user["name"];
                return $user;
            }
        }

        return null;
    }
}

if (!function_exists("ensureUserTokenColumns")) {
    function ensureUserTokenColumns(mysqli $db): void
    {
        static $checked = false;
        if ($checked) return;
        $checked = true;

        $checkCol = @$db->query("SHOW COLUMNS FROM users LIKE 'auth_token'");
        if (!$checkCol || $checkCol->num_rows === 0) {
            @$db->query("ALTER TABLE users ADD COLUMN `auth_token` VARCHAR(255) NULL");
            @$db->query("ALTER TABLE users ADD COLUMN `token_expires_at` DATETIME NULL");
            @$db->query("ALTER TABLE users ADD INDEX `idx_users_auth_token` (`auth_token`)");
        }
    }
}
