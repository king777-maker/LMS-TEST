<?php

/**
 * ============================================================================
 * BROADBEACH ACADEMY — STUDENT / LEARNER SUPPORT TICKET CONTROLLER
 * ============================================================================
 * 
 * Handles support ticket operations for students & learners:
 * - Submitting new support tickets (POST /api/tickets)
 * - Fetching tickets for logged-in learner (GET /api/tickets/my)
 * - Fetching single ticket details with replies (GET /api/tickets/{id})
 * - Adding replies to tickets (POST /api/tickets/{id}/reply)
 * 
 * Fully synchronized with Admin Ticket Master (AdminModulesController.php).
 */

class TicketController
{
    private $db = null;

    public function __construct($db = null)
    {
        $this->db = $db;
        $this->ensureTablesExist();
    }

    /**
     * Auto-heals schema if tables do not exist on the database
     */
    private function ensureTablesExist(): void
    {
        if (!$this->db) return;

        $ticketsTableSql = "
            CREATE TABLE IF NOT EXISTS `support_tickets` (
              `id` VARCHAR(64) NOT NULL PRIMARY KEY,
              `subject` VARCHAR(255) NOT NULL,
              `requester_name` VARCHAR(255) NOT NULL,
              `requester_email` VARCHAR(191) NOT NULL,
              `course_name` VARCHAR(255) NULL,
              `certificate_id` VARCHAR(64) NULL,
              `category` VARCHAR(100) NOT NULL,
              `priority` VARCHAR(32) NOT NULL DEFAULT 'Normal',
              `status` VARCHAR(32) NOT NULL DEFAULT 'New',
              `assigned_admin` VARCHAR(191) NULL,
              `assigned_agent` VARCHAR(191) NULL,
              `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
              `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_ticket_status` (`status`),
              INDEX `idx_ticket_email` (`requester_email`),
              INDEX `idx_ticket_category` (`category`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        @$this->db->query($ticketsTableSql);

        $messagesTableSql = "
            CREATE TABLE IF NOT EXISTS `ticket_messages` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `ticket_id` VARCHAR(64) NOT NULL,
              `sender_type` ENUM('requester', 'admin', 'system', 'agent') NOT NULL DEFAULT 'requester',
              `sender_name` VARCHAR(191) NOT NULL,
              `sender_email` VARCHAR(191) NOT NULL,
              `message` TEXT NOT NULL,
              `is_internal` TINYINT(1) NOT NULL DEFAULT 0,
              `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
              INDEX `idx_msg_ticket` (`ticket_id`),
              INDEX `idx_msg_internal` (`is_internal`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        @$this->db->query($messagesTableSql);
    }

    /**
     * Sends structured JSON response
     */
    private function jsonResponse(bool $success, string $message, $data = null, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=UTF-8");
        $payload = [
            "success" => $success,
            "status" => $success,
            "message" => $message
        ];
        if ($data !== null) {
            $payload["data"] = $data;
        }
        echo json_encode($payload);
        exit;
    }

    /**
     * Extracts JSON or POST input safely
     */
    private function getInput(): array
    {
        $raw = file_get_contents("php://input");
        $json = json_decode($raw, true);
        if (is_array($json)) {
            return $json;
        }
        return $_POST ?? [];
    }

    /**
     * Resolves authenticated or provided learner identity
     */
    private function getLearnerIdentity(): array
    {
        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }

        $sessionUser = $_SESSION["user"] ?? $_SESSION["student"] ?? null;
        $sessionEmail = $sessionUser["email"] ?? null;
        $sessionName = $sessionUser["name"] ?? $sessionUser["full_name"] ?? null;

        // Check Bearer token or custom headers if available
        $headers = function_exists("getallheaders") ? getallheaders() : [];
        $headerEmail = $headers["X-User-Email"] ?? $headers["x-user-email"] ?? null;

        return [
            "email" => $sessionEmail ?: $headerEmail,
            "name" => $sessionName
        ];
    }

    /**
     * POST /api/tickets
     * Submits a new support ticket from learner
     */
    public function submit(): void
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            $this->jsonResponse(false, "Method not allowed. Only POST accepted.", null, 405);
        }

        $input = $this->getInput();
        $auth = $this->getLearnerIdentity();

        // Honeypot check
        if (!empty($input["website"])) {
            $this->jsonResponse(true, "Thank you! Your ticket has been received.", [
                "id" => "TICK-2026-BOT",
                "status" => "New"
            ], 200);
        }

        // Validate Subject
        $subject = trim($input["subject"] ?? "");
        if (empty($subject) || mb_strlen($subject) < 3) {
            $this->jsonResponse(false, "Subject is required (minimum 3 characters).", null, 422);
        }

        // Validate Category
        $category = trim($input["category"] ?? "");
        if (empty($category)) {
            $this->jsonResponse(false, "Category is required.", null, 422);
        }

        // Validate Description / Message
        $description = trim($input["description"] ?? $input["message"] ?? "");
        if (empty($description) || mb_strlen($description) < 5) {
            $this->jsonResponse(false, "Please provide a detailed description (minimum 5 characters).", null, 422);
        }

        // Requester details
        $requesterName = trim($input["requester_name"] ?? $input["name"] ?? $auth["name"] ?? "Learner");
        if (empty($requesterName)) $requesterName = "Learner";

        $requesterEmail = trim($input["requester_email"] ?? $input["email"] ?? $auth["email"] ?? "");
        if (empty($requesterEmail) || !filter_var($requesterEmail, FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse(false, "A valid email address is required for ticket updates.", null, 422);
        }

        $courseName = !empty($input["course_name"]) ? trim($input["course_name"]) : null;
        $certificateId = !empty($input["certificate_id"]) ? trim($input["certificate_id"]) : null;

        // Normalize priority
        $rawPriority = strtolower(trim($input["priority"] ?? "medium"));
        $priorityMap = [
            "low" => "Normal",
            "normal" => "Normal",
            "medium" => "Normal",
            "high" => "High",
            "urgent" => "Urgent",
            "critical" => "Urgent"
        ];
        $priority = $priorityMap[$rawPriority] ?? "Normal";

        // Generate Ticket ID: TICK-2026-XXXX
        $ticketId = "TICK-" . date("Y") . "-" . rand(1000, 9999);

        // Check DB availability
        if (!$this->db) {
            $this->jsonResponse(false, "Database connection unavailable.", null, 503);
        }

        // 1. Insert into support_tickets
        $stmt = $this->db->prepare("
            INSERT INTO support_tickets 
            (id, subject, requester_name, requester_email, course_name, certificate_id, category, priority, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', NOW(), NOW())
        ");

        if (!$stmt) {
            $this->jsonResponse(false, "Failed to prepare ticket creation statement: " . $this->db->error, null, 500);
        }

        $stmt->bind_param(
            "ssssssss",
            $ticketId,
            $subject,
            $requesterName,
            $requesterEmail,
            $courseName,
            $certificateId,
            $category,
            $priority
        );

        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            $this->jsonResponse(false, "Failed to create ticket: " . $err, null, 500);
        }
        $stmt->close();

        // 2. Insert initial message into ticket_messages
        $mStmt = $this->db->prepare("
            INSERT INTO ticket_messages 
            (ticket_id, sender_type, sender_name, sender_email, message, is_internal, created_at) 
            VALUES (?, 'requester', ?, ?, ?, 0, NOW())
        ");
        if ($mStmt) {
            $mStmt->bind_param("ssss", $ticketId, $requesterName, $requesterEmail, $description);
            $mStmt->execute();
            $mStmt->close();
        }

        // 3. Optional Audit Log
        $this->addAuditLog($ticketId, $requesterName, $requesterEmail, $subject, $category);

        $responseTicket = [
            "id" => $ticketId,
            "subject" => $subject,
            "category" => $category,
            "description" => $description,
            "course_name" => $courseName,
            "certificate_id" => $certificateId,
            "priority" => $priority,
            "status" => "New",
            "requester_name" => $requesterName,
            "requester_email" => $requesterEmail,
            "created_at" => date("Y-m-d H:i:s"),
            "updated_at" => date("Y-m-d H:i:s")
        ];

        $this->jsonResponse(true, "Support ticket #{$ticketId} created successfully.", $responseTicket, 201);
    }

    /**
     * GET /api/tickets/my
     * Fetches all tickets belonging to the authenticated learner
     */
    public function getMyTickets(): void
    {
        if ($_SERVER["REQUEST_METHOD"] !== "GET") {
            $this->jsonResponse(false, "Method not allowed. Only GET accepted.", null, 405);
        }

        $auth = $this->getLearnerIdentity();
        $email = trim($_GET["email"] ?? $auth["email"] ?? "");

        if (empty($email)) {
            $this->jsonResponse(true, "No learner email provided.", [], 200);
        }

        if (!$this->db) {
            $this->jsonResponse(false, "Database connection unavailable.", null, 503);
        }

        $emailEsc = $this->db->real_escape_string($email);
        $sql = "SELECT * FROM support_tickets WHERE requester_email = '$emailEsc' ORDER BY created_at DESC";
        $res = $this->db->query($sql);

        $tickets = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $ticketIdEsc = $this->db->real_escape_string($row["id"]);

                // Load messages/replies excluding internal staff notes
                $messages = [];
                $mRes = $this->db->query("
                    SELECT id, ticket_id, sender_type, sender_name, sender_email, message, created_at 
                    FROM ticket_messages 
                    WHERE ticket_id = '$ticketIdEsc' AND is_internal = 0 
                    ORDER BY created_at ASC
                ");
                if ($mRes) {
                    while ($mRow = $mRes->fetch_assoc()) {
                        $messages[] = $mRow;
                    }
                }

                $row["messages"] = $messages;
                $row["replies"] = $messages; // Alias for UI compatibility
                $tickets[] = $row;
            }
        }

        $this->jsonResponse(true, "Learner tickets retrieved successfully.", $tickets, 200);
    }

    /**
     * GET /api/tickets/{id}
     * Fetches a single ticket with its public message history
     */
    public function getTicket(string $ticketId): void
    {
        if (!$this->db) {
            $this->jsonResponse(false, "Database connection unavailable.", null, 503);
        }

        $idEsc = $this->db->real_escape_string($ticketId);
        $res = $this->db->query("SELECT * FROM support_tickets WHERE id = '$idEsc' LIMIT 1");
        if (!$res || $res->num_rows === 0) {
            $this->jsonResponse(false, "Ticket #{$ticketId} not found.", null, 404);
        }

        $ticket = $res->fetch_assoc();
        $messages = [];
        $mRes = $this->db->query("
            SELECT id, ticket_id, sender_type, sender_name, sender_email, message, created_at 
            FROM ticket_messages 
            WHERE ticket_id = '$idEsc' AND is_internal = 0 
            ORDER BY created_at ASC
        ");
        if ($mRes) {
            while ($mRow = $mRes->fetch_assoc()) {
                $messages[] = $mRow;
            }
        }
        $ticket["messages"] = $messages;
        $ticket["replies"] = $messages;

        $this->jsonResponse(true, "Ticket details retrieved.", $ticket, 200);
    }

    /**
     * POST /api/tickets/{id}/reply
     * Allows learner to submit a follow-up reply
     */
    public function reply(string $ticketId): void
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            $this->jsonResponse(false, "Method not allowed. Only POST accepted.", null, 405);
        }

        $input = $this->getInput();
        $auth = $this->getLearnerIdentity();

        $message = trim($input["message"] ?? $input["reply"] ?? "");
        if (empty($message)) {
            $this->jsonResponse(false, "Reply message cannot be empty.", null, 422);
        }

        $senderName = trim($input["sender_name"] ?? $input["name"] ?? $auth["name"] ?? "Learner");
        $senderEmail = trim($input["sender_email"] ?? $input["email"] ?? $auth["email"] ?? "learner@broadbeach.in");

        if (!$this->db) {
            $this->jsonResponse(false, "Database connection unavailable.", null, 503);
        }

        $idEsc = $this->db->real_escape_string($ticketId);
        $check = $this->db->query("SELECT id, status FROM support_tickets WHERE id = '$idEsc' LIMIT 1");
        if (!$check || $check->num_rows === 0) {
            $this->jsonResponse(false, "Ticket #{$ticketId} not found.", null, 404);
        }

        $mStmt = $this->db->prepare("
            INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, sender_email, message, is_internal, created_at) 
            VALUES (?, 'requester', ?, ?, ?, 0, NOW())
        ");
        if ($mStmt) {
            $mStmt->bind_param("ssss", $ticketId, $senderName, $senderEmail, $message);
            $mStmt->execute();
            $mStmt->close();
        }

        // Update ticket status to 'Open' if resolved or new
        $this->db->query("UPDATE support_tickets SET status = 'Open', updated_at = NOW() WHERE id = '$idEsc'");

        $this->jsonResponse(true, "Reply posted successfully.", [
            "ticket_id" => $ticketId,
            "sender_name" => $senderName,
            "message" => $message,
            "created_at" => date("Y-m-d H:i:s")
        ], 200);
    }

    /**
     * Audit logger helper
     */
    private function addAuditLog(string $ticketId, string $actorName, string $actorEmail, string $subject, string $category): void
    {
        if (!$this->db) return;
        $checkTable = @$this->db->query("SHOW TABLES LIKE 'admin_audit_logs'");
        if ($checkTable && $checkTable->num_rows > 0) {
            $stmt = @$this->db->prepare("
                INSERT INTO admin_audit_logs 
                (actor_name, actor_email, actor_role, action_category, action, target_type, target_id, details, outcome, created_at)
                VALUES (?, ?, 'learner', 'TICKET', 'TICKET_CREATED', 'ticket', ?, ?, 'Success', NOW())
            ");
            if ($stmt) {
                $details = "Support ticket [{$category}] raised by {$actorName} ({$actorEmail}): '{$subject}'.";
                $stmt->bind_param("ssss", $actorName, $actorEmail, $ticketId, $details);
                @$stmt->execute();
                @$stmt->close();
            }
        }
    }
}
