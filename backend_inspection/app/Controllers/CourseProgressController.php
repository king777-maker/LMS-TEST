<?php

require_once __DIR__ . "/../config/auth_helper.php";


require_once __DIR__ . "/../Models/Assessment.php";
require_once __DIR__ . "/../Models/EnrollmentModel.php";

class CourseProgressController
{
    private mysqli $db;
    private Assessment $assessmentModel;
    private EnrollmentModel $enrollmentModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->assessmentModel = new Assessment($db);
        $this->enrollmentModel = new EnrollmentModel($db);
        $this->ensureTableExists();
    }

    private function ensureTableExists(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `learner_lesson_progress` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `certification_id` INT NOT NULL,
            `lesson_id` VARCHAR(64) NOT NULL,
            `completed` TINYINT(1) NOT NULL DEFAULT 1,
            `completed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY `uniq_user_cert_lesson` (`user_id`, `certification_id`, `lesson_id`),
            INDEX `idx_user_cert` (`user_id`, `certification_id`),
            INDEX `idx_completed` (`completed`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        $this->db->query($sql);
    }

    private function resolveUserId(): int
    {
        $user = getAuthenticatedUser($this->db);
        if ($user && !empty($user["id"])) {
            return (int) $user["id"];
        }
        if (isset($_SESSION["user_id"]) && (int)$_SESSION["user_id"] > 0) {
            return (int) $_SESSION["user_id"];
        }
        return 0;
    }

    /**
     * GET /api/course-progress?certification_id=322
     */
    public function getProgress(): void
    {
        $certId = isset($_GET['certification_id']) ? (int)$_GET['certification_id'] : 0;
        $userId = $this->resolveUserId();

        if ($certId <= 0) {
            $this->jsonResponse(false, "Invalid certification ID.", null, 422);
            return;
        }

        // 1. Determine total lessons for Chapter 1 (Course Module)
        // Standard single-video course module architecture
        $requiredLessonCount = 1;

        // 2. Query completed lessons for this user
        $completedLessonIds = [];
        if ($userId > 0) {
            $compStmt = $this->db->prepare("SELECT lesson_id FROM learner_lesson_progress WHERE user_id = ? AND certification_id = ? AND completed = 1");
            if ($compStmt) {
                $compStmt->bind_param("ii", $userId, $certId);
                $compStmt->execute();
                $compRes = $compStmt->get_result();
                while ($r = $compRes->fetch_assoc()) {
                    $completedLessonIds[] = (string)$r['lesson_id'];
                }
                $compStmt->close();
            }
        }

        // Calculate Chapter 1 status (Single Video per course)
        $completedLessonCount = count($completedLessonIds) > 0 ? 1 : 0;
        $ch1Completed = (count($completedLessonIds) >= 1);
        $ch1Progress = $ch1Completed ? 100 : 0;

        // 3. Query assessment status for Chapter 2
        $ch2Unlocked = $ch1Completed;
        $ch2Completed = false;
        $assessmentScore = null;
        $assessmentPercentage = 0;

        if ($userId > 0) {
            $subStmt = $this->db->prepare("SELECT score, percentage, result FROM assessment_submissions WHERE user_id = ? AND certification_id = ? AND result = 'pass' ORDER BY id DESC LIMIT 1");
            if ($subStmt) {
                $subStmt->bind_param("ii", $userId, $certId);
                $subStmt->execute();
                $subRes = $subStmt->get_result();
                if ($subRow = $subRes->fetch_assoc()) {
                    $ch2Completed = true;
                    $assessmentScore = (int)$subRow['score'];
                    $assessmentPercentage = (float)$subRow['percentage'];
                }
                $subStmt->close();
            }
        }

        // 4. Chapter 3 status
        $ch3Unlocked = $ch2Completed;
        $ch3Completed = $ch2Completed;

        // Overall progress
        // Ch1 = 40%, Ch2 = 40%, Ch3 = 20%
        $overallProgress = 0;
        if ($ch2Completed) {
            $overallProgress = 100;
        } elseif ($ch1Completed) {
            $overallProgress = 60;
        } else {
            $overallProgress = round(($completedLessonCount / max(1, $requiredLessonCount)) * 40);
        }

        $this->jsonResponse(true, "Course progress fetched successfully.", [
            "certification_id" => $certId,
            "user_id" => $userId,
            "chapter1" => [
                "chapter_number" => 1,
                "title" => "Course Module",
                "unlocked" => true,
                "completed" => $ch1Completed,
                "progress" => $ch1Progress,
                "required_lessons" => $requiredLessonCount,
                "completed_lessons" => $completedLessonCount,
                "completed_lesson_ids" => $completedLessonIds,
            ],
            "chapter2" => [
                "chapter_number" => 2,
                "title" => "Assessment",
                "unlocked" => $ch2Unlocked,
                "completed" => $ch2Completed,
                "passing_percentage" => 70,
                "score" => $assessmentScore,
                "percentage" => $assessmentPercentage,
                "lock_reason" => $ch2Unlocked ? null : "Complete the Course Module video in Chapter 1 to unlock the Assessment."
            ],
            "chapter3" => [
                "chapter_number" => 3,
                "title" => "Training Course Material",
                "unlocked" => $ch3Unlocked,
                "completed" => $ch3Completed,
                "lock_reason" => $ch3Unlocked ? null : "Pass the Chapter 2 Assessment (70% or higher) to unlock Training Course Materials."
            ],
            "chapter4" => [
                "chapter_number" => 4,
                "title" => "Download Certificate",
                "unlocked" => $ch3Unlocked,
                "completed" => $ch3Completed,
                "certificate_unlocked" => $ch3Unlocked,
                "lock_reason" => $ch3Unlocked ? null : "Pass the Chapter 2 Assessment to access your Certificate."
            ],
            "overall_progress" => $overallProgress,
            "is_fully_completed" => $ch3Completed
        ]);
    }

    /**
     * POST /api/complete-lesson
     */
    public function completeLesson(): void
    {
        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $certId = (int)($input['certification_id'] ?? 0);
        $lessonId = (string)($input['lesson_id'] ?? '');
        $completed = isset($input['completed']) ? (bool)$input['completed'] : true;
        $userId = $this->resolveUserId();

        if ($userId <= 0 && isset($input['user_id'])) {
            $userId = (int)$input['user_id'];
        }

        if ($userId <= 0) {
            $this->jsonResponse(false, "Authentication required to record lesson progress.", null, 401);
            return;
        }

        if (empty($lessonId)) {
            $lessonId = 'module';
        }

        if ($certId <= 0) {
            $this->jsonResponse(false, "Invalid certification_id.", null, 422);
            return;
        }

        if ($completed) {
            $stmt = $this->db->prepare("INSERT INTO learner_lesson_progress (user_id, certification_id, lesson_id, completed, completed_at) VALUES (?, ?, ?, 1, NOW()) ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()");
            if ($stmt) {
                $stmt->bind_param("iis", $userId, $certId, $lessonId);
                $stmt->execute();
                $stmt->close();
            }
        } else {
            $stmt = $this->db->prepare("DELETE FROM learner_lesson_progress WHERE user_id = ? AND certification_id = ? AND lesson_id = ?");
            if ($stmt) {
                $stmt->bind_param("iis", $userId, $certId, $lessonId);
                $stmt->execute();
                $stmt->close();
            }
        }

        // Return updated progress
        $_GET['certification_id'] = $certId;
        $_GET['user_id'] = $userId;
        $this->getProgress();
    }

    /**
     * GET /api/course-materials?certification_id=322
     * Secure endpoint: Strictly enforces that Chapter 2 (Assessment) is passed before returning materials
     */
    public function getCourseMaterials(): void
    {
        $certId = isset($_GET['certification_id']) ? (int)$_GET['certification_id'] : 0;
        $userId = $this->resolveUserId();

        if ($certId <= 0) {
            $this->jsonResponse(false, "Invalid certification ID.", null, 422);
            return;
        }

        // Check assessment completion
        $hasPassed = false;
        if ($userId > 0) {
            $stmt = $this->db->prepare("SELECT id FROM assessment_submissions WHERE user_id = ? AND certification_id = ? AND result = 'pass' LIMIT 1");
            if ($stmt) {
                $stmt->bind_param("ii", $userId, $certId);
                $stmt->execute();
                $res = $stmt->get_result();
                if ($res->fetch_assoc()) {
                    $hasPassed = true;
                }
                $stmt->close();
            }
        }

        // Strict Server-Side Chapter Locking Enforcement
        if (!$hasPassed) {
            $this->jsonResponse(false, "Chapter 3 Training Course Material is locked. You must pass the Chapter 2 Assessment (70% or higher) before accessing training materials.", [
                "locked" => true,
                "required_chapter" => 2,
                "unlocked" => false
            ], 403);
            return;
        }

        // Verified training materials for this course
        $materials = [
            [
                "id" => "slides-intro",
                "title" => "Course Introduction & Foundation Deck",
                "file_name" => "introduction.pdf",
                "url" => "https://cadac.in/broadbeachlearning.com/broadbeach-backend/uploads/slides/introduction.pdf",
                "type" => "pdf",
                "size" => "553 KB"
            ],
            [
                "id" => "slides-ch2",
                "title" => "Core Requirements & Methodology Manual",
                "file_name" => "Chapter2.pdf",
                "url" => "https://cadac.in/broadbeachlearning.com/broadbeach-backend/uploads/slides/Chapter2.pdf",
                "type" => "pdf",
                "size" => "11.5 MB"
            ],
            [
                "id" => "slides-ch3",
                "title" => "Operational Control & Continual Improvement Handbook",
                "file_name" => "Chapter3.pdf",
                "url" => "https://cadac.in/broadbeachlearning.com/broadbeach-backend/uploads/slides/Chapter3.pdf",
                "type" => "pdf",
                "size" => "320 KB"
            ]
        ];

        $this->jsonResponse(true, "Training course materials retrieved successfully.", [
            "certification_id" => $certId,
            "unlocked" => true,
            "materials" => $materials
        ]);
    }

    private function jsonResponse(bool $success, string $message, $data = null, int $code = 200): void
    {
        http_response_code($code);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

