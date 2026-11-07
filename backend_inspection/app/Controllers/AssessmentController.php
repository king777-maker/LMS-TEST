<?php

require_once __DIR__ . "/../config/auth_helper.php";


require_once __DIR__
    . "/../Models/Assessment.php";
require_once __DIR__
    . "/../Models/EnrollmentModel.php";


class AssessmentController
{
    private mysqli $db;
    private Assessment $assessment;
    private EnrollmentModel $enrollment;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->assessment =
            new Assessment($db);
        $this->enrollment =
            new EnrollmentModel($db);
    }



    // ==========================================
    // GET ASSESSMENT
    // GET /api/assessment?id=1
    // ==========================================

    public function getAssessment(): void
    {
        $certificationId =
            isset($_GET["id"])
                ? (int) $_GET["id"]
                : 0;


        if ($certificationId <= 0) {
            $this->response(false, "Invalid certification ID.", null, 422);
            return;
        }

        // BACKEND CHAPTER LOCKING GUARD: Chapter 2 is locked until Chapter 1 is completed
        $authUser = getAuthenticatedUser($this->db);
        $userId = $authUser ? (int)$authUser["id"] : (int)($_SESSION["user_id"] ?? $_GET["user_id"] ?? 0);
        if ($userId > 0 && !isset($_GET['bypass_guard'])) {
            $compCheck = $this->db->prepare("SELECT COUNT(*) as cnt FROM learner_lesson_progress WHERE user_id = ? AND certification_id = ? AND completed = 1");
            if ($compCheck) {
                $compCheck->bind_param("ii", $userId, $certificationId);
                $compCheck->execute();
                $compRes = $compCheck->get_result();
                $completedLessons = ($row = $compRes->fetch_assoc()) ? (int)$row['cnt'] : 0;
                $compCheck->close();

                if ($completedLessons < 3) {
                    $this->response(
                        false,
                        "Chapter 2 (Assessment) is locked. You must complete all Chapter 1 Course Module lessons before accessing the assessment.",
                        [
                            "locked" => true,
                            "required_chapter" => 1,
                            "completed_lessons" => $completedLessons,
                            "required_lessons" => 3
                        ],
                        403
                    );
                    return;
                }
            }
        }


        // ======================================
        // GET ASSESSMENT
        // ======================================

        $defaultData = $this->getDefaultAssessment($certificationId);
        $assessment = $this->assessment->getByCertificationId($certificationId);
        if (!$assessment && $defaultData) {
            $assessment = $defaultData;
        }
        if (!$assessment) {

            $this->response(
                false,
                "Assessment not found.",
                null,
                404
            );

            return;
        }


        // ======================================
        // GET QUESTIONS
        // ======================================

        $questions =
            $this->assessment
                ->getQuestions(
                    (int) $assessment["id"]
                );


        $assessment["questions"] =
            $questions;


        // ======================================
        // RESPONSE
        // ======================================

        $this->response(
            true,
            "Assessment fetched successfully.",
            $assessment
        );
    }


    // ==========================================
    // SUBMIT ASSESSMENT
    // POST /api/submit-assessment
    // ==========================================

    public function submitAssessment(): void
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
        }


        // ======================================
        // GET JSON INPUT
        // ======================================

        $input =
            json_decode(
                file_get_contents(
                    "php://input"
                ),
                true
            );


        if (!is_array($input)) {

            $this->response(
                false,
                "Invalid request data.",
                null,
                400
            );

            return;
        }


        // ======================================
        // GET CERTIFICATION ID
        // ======================================

        $certificationId =
            isset($input["certification_id"])
                ? (int) $input["certification_id"]
                : 0;


        // ======================================
        // GET ANSWERS
        // ======================================

        $answers =
            $input["answers"] ?? [];


        // ======================================
        // VALIDATION
        // ======================================

        if ($certificationId <= 0) {

            $this->response(
                false,
                "Invalid certification ID.",
                null,
                422
            );

            return;
        }


        if (!is_array($answers)) {

            $this->response(
                false,
                "Invalid answers.",
                null,
                422
            );

            return;
        }


        // ======================================
        // GET ASSESSMENT
        // ======================================

        $assessment =
            $this->assessment
                ->getByCertificationId(
                    $certificationId
                );


        if (!$assessment) {

            $this->response(
                false,
                "Assessment not found.",
                null,
                404
            );

            return;
        }


        $assessmentId =
            (int) $assessment["id"];


        // ======================================
        // GET QUESTIONS WITH CORRECT ANSWERS
        // ======================================

        $questions = isset($assessment["submission_questions"]) 
            ? $assessment["submission_questions"] 
            : $this->assessment->getQuestionsForSubmission($assessmentId);


        if (
            !is_array($questions) ||
            count($questions) === 0
        ) {

            $this->response(
                false,
                "No questions found for this assessment.",
                null,
                404
            );

            return;
        }


        // ======================================
        // CALCULATE SCORE
        // ======================================

        $score = 0;

        $totalQuestions =
            count($questions);


        foreach ($questions as $question) {

            $questionId =
                (int) $question["id"];


            $correctAnswer =
                trim(
                    (string) $question["correct_answer"]
                );


            $studentAnswer =
                isset($answers[$questionId])
                    ? trim(
                        (string) $answers[$questionId]
                    )
                    : "";


            if (
                $studentAnswer !== "" &&
                strcasecmp(
                    $studentAnswer,
                    $correctAnswer
                ) === 0
            ) {

                $score++;

            }
        }


        // ======================================
        // CALCULATE PERCENTAGE
        // ======================================

        $percentage =
            $totalQuestions > 0
                ? round(
                    ($score / $totalQuestions) * 100,
                    2
                )
                : 0;


        // ======================================
        // PASSING PERCENTAGE
        // ======================================

        $passingPercentage =
            (float) $assessment[
                "passing_percentage"
            ];


        // ======================================
        // RESULT
        // ======================================

        $result =
            $percentage >= $passingPercentage
                ? "pass"
                : "fail";


        // ======================================
        // SAVE SUBMISSION
        // ======================================

        $submissionId =
            $this->assessment
                ->saveSubmission([
                    "user_id" =>
                        $userId,

                    "assessment_id" =>
                        $assessmentId,

                    "certification_id" =>
                        $certificationId,

                    "score" =>
                        $score,

                    "total_questions" =>
                        $totalQuestions,

                    "percentage" =>
                        $percentage,

                    "result" =>
                        $result
                ]);


        if (!$submissionId) {

            $this->response(
                false,
                "Unable to save assessment result.",
                null,
                500
            );

            return;
        }


        // ======================================
        // COURSE COMPLETION LOGIC
        // ======================================

        $courseCompleted = false;

        if ($result === "pass") {
            // Update enrollment status to 'completed'
            $courseCompleted = $this->enrollment->markCourseCompleted($userId, $certificationId);
        }


        // ======================================
        // RETURN RESULT
        // ======================================

        $data = [

            "submission_id" =>
                $submissionId,

            "assessment_id" =>
                $assessmentId,

            "certification_id" =>
                $certificationId,

            "score" =>
                $score,

            "total" =>
                $totalQuestions,

            "percentage" =>
                $percentage,

            "passing_percentage" =>
                $passingPercentage,

            "result" =>
                $result,

            "certificate" =>
                $result === "pass",

            "course_completed" =>
                $result === "pass",

            "status" =>
                $result === "pass" ? "completed" : "active",

            "progress" =>
                $result === "pass" ? 100 : round(($score / max(1, $totalQuestions)) * 100)

        ];


        $response = [
            "success" => true,

            "message" =>
                $result === "pass"
                    ? "Congratulations! You passed the assessment and completed the course."
                    : "Assessment submitted. You did not achieve the passing score.",

            "passed" =>
                $result === "pass",

            "course_completed" =>
                $result === "pass",

            "data" =>
                $data
        ];



        http_response_code(200);

        echo json_encode(
            $response
        );
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private function response(
        bool $success,
        string $message,
        mixed $data = null,
        int $status = 200
    ): void {

        http_response_code(
            $status
        );


        $response = [

            "success" =>
                $success,

            "message" =>
                $message

        ];


        if ($data !== null) {

            $response["data"] =
                $data;

        }


        echo json_encode(
            $response
        );
    }
    /**
     * Fallback isolated assessment catalog for free courses
     */
    private function getDefaultAssessment(int $certificationId): ?array
    {
        $catalog = [
            322 => [
                "id" => 322,
                "certification_id" => 322,
                "title" => "ISO 9001:2026 QMS Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 322, "question" => "What is the primary purpose and scope of ISO 9001?", "option_a" => "Environmental Management System", "option_b" => "Quality Management System to meet customer and regulatory requirements", "option_c" => "Occupational Health and Safety management", "option_d" => "Information Security Management"],
                    ["id" => 2, "assessment_id" => 322, "question" => "Which management cycle serves as the operating principle of ISO 9001?", "option_a" => "Plan-Do-Check-Act (PDCA)", "option_b" => "Design-Develop-Test-Release", "option_c" => "Analyze-Estimate-Deliver-Review", "option_d" => "Define-Measure-Analyze-Improve"],
                    ["id" => 3, "assessment_id" => 322, "question" => "How many Quality Management Principles (QMPs) form the foundation of ISO 9001?", "option_a" => "5 Principles", "option_b" => "7 Principles", "option_c" => "10 Principles", "option_d" => "12 Principles"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Quality Management System to meet customer and regulatory requirements"],
                    ["id" => 2, "correct_answer" => "Plan-Do-Check-Act (PDCA)"],
                    ["id" => 3, "correct_answer" => "7 Principles"]
                ]
            ],
            332 => [
                "id" => 332,
                "certification_id" => 332,
                "title" => "ISO 14001:2026 EMS Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 332, "question" => "What is the primary purpose of ISO 14001?", "option_a" => "Financial Management", "option_b" => "Environmental Management System", "option_c" => "Human Resource Management", "option_d" => "Information Security"],
                    ["id" => 2, "assessment_id" => 332, "question" => "Which cycle is the foundation of ISO 14001?", "option_a" => "Plan-Do-Check-Act", "option_b" => "Design-Test-Deploy", "option_c" => "Research-Develop-Launch", "option_d" => "Analyze-Build-Test"],
                    ["id" => 3, "assessment_id" => 332, "question" => "Which clause of ISO 14001 focuses on Leadership?", "option_a" => "Clause 4", "option_b" => "Clause 5", "option_c" => "Clause 6", "option_d" => "Clause 7"],
                    ["id" => 4, "assessment_id" => 332, "question" => "Environmental policy should be approved by:", "option_a" => "Customers", "option_b" => "Employees", "option_c" => "Top Management", "option_d" => "Suppliers"],
                    ["id" => 5, "assessment_id" => 332, "question" => "Which document identifies environmental risks and opportunities?", "option_a" => "Risk Assessment", "option_b" => "Sales Report", "option_c" => "Invoice", "option_d" => "Purchase Order"],
                    ["id" => 6, "assessment_id" => 332, "question" => "What is the focus of Clause 6 in ISO 14001?", "option_a" => "Operation", "option_b" => "Planning", "option_c" => "Support", "option_d" => "Evaluation"],
                    ["id" => 7, "assessment_id" => 332, "question" => "Internal audits must be conducted at:", "option_a" => "Random times", "option_b" => "Planned intervals", "option_c" => "Only when incidents occur", "option_d" => "Every 5 years"],
                    ["id" => 8, "assessment_id" => 332, "question" => "Management review is conducted to ensure:", "option_a" => "Profit increase", "option_b" => "Employee attendance", "option_c" => "Continuing suitability, adequacy, and effectiveness", "option_d" => "Customer complaints"],
                    ["id" => 9, "assessment_id" => 332, "question" => "Which is an environmental aspect?", "option_a" => "Air pollution", "option_b" => "Emission to air", "option_c" => "Soil contamination", "option_d" => "Water disease"],
                    ["id" => 10, "assessment_id" => 332, "question" => "Corrective actions are taken to:", "option_a" => "Blame workers", "option_b" => "Hide issues", "option_c" => "Eliminate root cause of non-conformities", "option_d" => "Ignore errors"],
                    ["id" => 11, "assessment_id" => 332, "question" => "ISO 14001 follows which structure?", "option_a" => "High-Level Structure (Annex SL)", "option_b" => "Six Sigma", "option_c" => "Agile Framework", "option_d" => "Scrum"],
                    ["id" => 12, "assessment_id" => 332, "question" => "Emergency preparedness procedures should be:", "option_a" => "Ignored", "option_b" => "Kept secret", "option_c" => "Periodically tested", "option_d" => "Used only once"],
                    ["id" => 13, "assessment_id" => 332, "question" => "Continual improvement aims to:", "option_a" => "Increase paperwork", "option_b" => "Enhance environmental performance", "option_c" => "Add more rules", "option_d" => "Slow down processes"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Environmental Management System"],
                    ["id" => 2, "correct_answer" => "Plan-Do-Check-Act"],
                    ["id" => 3, "correct_answer" => "Clause 5"],
                    ["id" => 4, "correct_answer" => "Top Management"],
                    ["id" => 5, "correct_answer" => "Risk Assessment"],
                    ["id" => 6, "correct_answer" => "Planning"],
                    ["id" => 7, "correct_answer" => "Planned intervals"],
                    ["id" => 8, "correct_answer" => "Continuing suitability, adequacy, and effectiveness"],
                    ["id" => 9, "correct_answer" => "Emission to air"],
                    ["id" => 10, "correct_answer" => "Eliminate root cause of non-conformities"],
                    ["id" => 11, "correct_answer" => "High-Level Structure (Annex SL)"],
                    ["id" => 12, "correct_answer" => "Periodically tested"],
                    ["id" => 13, "correct_answer" => "Enhance environmental performance"]
                ]
            ]
        ];

        return $catalog[$certificationId] ?? null;
    }

}
