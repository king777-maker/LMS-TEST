<?php

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

            $this->response(
                false,
                "Invalid certification ID.",
                null,
                422
            );

            return;
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
        // ======================================
        // CHECK LOGIN
        // ======================================

        if (
            !isset($_SESSION["user_id"]) ||
            empty($_SESSION["user_id"])
        ) {

            $this->response(
                false,
                "Please login before submitting assessment.",
                null,
                401
            );

            return;
        }


        $userId =
            (int) $_SESSION["user_id"];


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
                    ["id" => 1, "assessment_id" => 322, "question" => "What is the primary purpose of ISO 9001:2026?", "option_a" => "To establish environmental management requirements", "option_b" => "To establish requirements for a Quality Management System", "option_c" => "To establish occupational health and safety requirements", "option_d" => "To establish financial management requirements"],
                    ["id" => 2, "assessment_id" => 322, "question" => "Which organization publishes the ISO 9001 standard?", "option_a" => "International Labour Organization (ILO)", "option_b" => "World Trade Organization (WTO)", "option_c" => "International Organization for Standardization (ISO)", "option_d" => "World Health Organization (WHO)"],
                    ["id" => 3, "assessment_id" => 322, "question" => "Which of the following is emphasized more strongly in ISO 9001:2026?", "option_a" => "Financial auditing", "option_b" => "Quality culture and ethical behaviour", "option_c" => "Employee salary management", "option_d" => "Marketing strategies"],
                    ["id" => 4, "assessment_id" => 322, "question" => "What is the main responsibility of top management in a Quality Management System?", "option_a" => "Delegate all quality responsibilities to the quality department", "option_b" => "Demonstrate leadership and commitment to the QMS", "option_c" => "Perform all internal audits personally", "option_d" => "Approve every purchase order"],
                    ["id" => 5, "assessment_id" => 322, "question" => "What is the main objective of customer focus in ISO 9001:2026?", "option_a" => "Increasing employee working hours", "option_b" => "Reducing product variety", "option_c" => "Enhancing customer satisfaction and meeting customer requirements", "option_d" => "Reducing communication with customers"],
                    ["id" => 6, "assessment_id" => 322, "question" => "How does ISO 9001:2026 address risks and opportunities?", "option_a" => "By ignoring potential risks", "option_b" => "By addressing only financial risks", "option_c" => "By providing a clearer distinction between actions to address risks and opportunities", "option_d" => "By eliminating the need for risk assessment"],
                    ["id" => 7, "assessment_id" => 322, "question" => "Which of the following is important for employee awareness?", "option_a" => "Understanding the quality policy and their contribution to QMS effectiveness", "option_b" => "Knowing only their salary details", "option_c" => "Avoiding participation in quality activities", "option_d" => "Performing duties without following procedures"],
                    ["id" => 8, "assessment_id" => 322, "question" => "What is the purpose of an internal audit?", "option_a" => "To identify employees for termination", "option_b" => "To evaluate whether the QMS conforms to requirements and is effectively implemented", "option_c" => "To increase production costs", "option_d" => "To replace management reviews"],
                    ["id" => 9, "assessment_id" => 322, "question" => "What is the purpose of continual improvement in a QMS?", "option_a" => "To maintain existing processes without changes", "option_b" => "To reduce customer interaction", "option_c" => "To improve the suitability, adequacy and effectiveness of the QMS", "option_d" => "To eliminate the need for performance evaluation"],
                    ["id" => 10, "assessment_id" => 322, "question" => "What is the purpose of Annex A in ISO 9001:2026?", "option_a" => "To provide financial reporting formats", "option_b" => "To clarify key concepts, terminology and the intent of requirements", "option_c" => "To establish employee attendance rules", "option_d" => "To provide product pricing guidelines"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "To establish requirements for a Quality Management System"],
                    ["id" => 2, "correct_answer" => "International Organization for Standardization (ISO)"],
                    ["id" => 3, "correct_answer" => "Quality culture and ethical behaviour"],
                    ["id" => 4, "correct_answer" => "Demonstrate leadership and commitment to the QMS"],
                    ["id" => 5, "correct_answer" => "Enhancing customer satisfaction and meeting customer requirements"],
                    ["id" => 6, "correct_answer" => "By providing a clearer distinction between actions to address risks and opportunities"],
                    ["id" => 7, "correct_answer" => "Understanding the quality policy and their contribution to QMS effectiveness"],
                    ["id" => 8, "correct_answer" => "To evaluate whether the QMS conforms to requirements and is effectively implemented"],
                    ["id" => 9, "correct_answer" => "To improve the suitability, adequacy and effectiveness of the QMS"],
                    ["id" => 10, "correct_answer" => "To clarify key concepts, terminology and the intent of requirements"]
                ]
            ],
            332 => [
                "id" => 332,
                "certification_id" => 332,
                "title" => "ISO14001: 2026 EMS Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 332, "question" => "What is the main objective of ISO 14001?", "option_a" => "Improve financial performance", "option_b" => "Environmental management system implementation", "option_c" => "Employee satisfaction", "option_d" => "Product design"],
                    ["id" => 2, "assessment_id" => 332, "question" => "ISO 14001 is based on which cycle?", "option_a" => "SWOT", "option_b" => "PDCA (Plan-Do-Check-Act)", "option_c" => "Six Sigma", "option_d" => "Kaizen"],
                    ["id" => 3, "assessment_id" => 332, "question" => "What does EMS stand for?", "option_a" => "Environmental Monitoring System", "option_b" => "Environmental Management System", "option_c" => "Energy Management System", "option_d" => "Engineering Management System"],
                    ["id" => 4, "assessment_id" => 332, "question" => "Which clause deals with Leadership?", "option_a" => "Clause 4", "option_b" => "Clause 5", "option_c" => "Clause 6", "option_d" => "Clause 7"],
                    ["id" => 5, "assessment_id" => 332, "question" => "What is an environmental aspect?", "option_a" => "Legal requirement", "option_b" => "Element of activities that interacts with environment", "option_c" => "Audit finding", "option_d" => "Policy statement"],
                    ["id" => 6, "assessment_id" => 332, "question" => "What is an environmental impact?", "option_a" => "Change to the environment", "option_b" => "Company profit", "option_c" => "Employee training", "option_d" => "Internal audit"],
                    ["id" => 7, "assessment_id" => 332, "question" => "Which clause covers planning?", "option_a" => "Clause 6", "option_b" => "Clause 7", "option_c" => "Clause 8", "option_d" => "Clause 9"],
                    ["id" => 8, "assessment_id" => 332, "question" => "Compliance obligations refer to:", "option_a" => "Internal rules only", "option_b" => "Legal and other requirements", "option_c" => "Financial obligations", "option_d" => "Customer complaints"],
                    ["id" => 9, "assessment_id" => 332, "question" => "What is the purpose of Environmental Policy?", "option_a" => "Marketing tool", "option_b" => "Commitment to environmental protection", "option_c" => "Financial planning", "option_d" => "HR guideline"],
                    ["id" => 10, "assessment_id" => 332, "question" => "Which clause relates to Support?", "option_a" => "Clause 6", "option_b" => "Clause 7", "option_c" => "Clause 8", "option_d" => "Clause 10"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Environmental management system implementation"],
                    ["id" => 2, "correct_answer" => "PDCA (Plan-Do-Check-Act)"],
                    ["id" => 3, "correct_answer" => "Environmental Management System"],
                    ["id" => 4, "correct_answer" => "Clause 5"],
                    ["id" => 5, "correct_answer" => "Element of activities that interacts with environment"],
                    ["id" => 6, "correct_answer" => "Change to the environment"],
                    ["id" => 7, "correct_answer" => "Clause 6"],
                    ["id" => 8, "correct_answer" => "Legal and other requirements"],
                    ["id" => 9, "correct_answer" => "Commitment to environmental protection"],
                    ["id" => 10, "correct_answer" => "Clause 7"]
                ]
            ],
            323 => [
                "id" => 323,
                "certification_id" => 323,
                "title" => "ISO 45001:2018 OHSMS Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 323, "question" => "What is the primary focus of the ISO 45001:2018 standard?", "option_a" => "Quality management systems", "option_b" => "Occupational health and safety (OH&S)", "option_c" => "Environmental management systems", "option_d" => "Energy management systems"],
                    ["id" => 2, "assessment_id" => 323, "question" => "Which standard did ISO 45001:2018 replace?", "option_a" => "OHSAS 18001", "option_b" => "ISO 9001", "option_c" => "ISO 14001", "option_d" => "ISO 31000"],
                    ["id" => 3, "assessment_id" => 323, "question" => "Which clause of ISO 45001:2018 specifically addresses consultation and participation of workers?", "option_a" => "Clause 4.1", "option_b" => "Clause 5.4", "option_c" => "Clause 7.2", "option_d" => "Clause 9.1"],
                    ["id" => 4, "assessment_id" => 323, "question" => "What is the top level in the Hierarchy of Controls according to ISO 45001?", "option_a" => "Substitution", "option_b" => "Personal Protective Equipment (PPE)", "option_c" => "Elimination", "option_d" => "Engineering controls"],
                    ["id" => 5, "assessment_id" => 323, "question" => "In ISO 45001 terminology, what is defined as a source with a potential to cause injury and ill health?", "option_a" => "Risk", "option_b" => "Incident", "option_c" => "Hazard", "option_d" => "Nonconformity"],
                    ["id" => 6, "assessment_id" => 323, "question" => "Which high-level structure (HLS) structure is ISO 45001:2018 based on?", "option_a" => "Annex SL", "option_b" => "Annex A", "option_c" => "ISO Guide 73", "option_d" => "PAS 99"],
                    ["id" => 7, "assessment_id" => 323, "question" => "What is an occurrence arising out of, or in the course of, work that could or does result in injury and ill health called?", "option_a" => "Audit finding", "option_b" => "Incident", "option_c" => "Correction", "option_d" => "Emergency situation"],
                    ["id" => 8, "assessment_id" => 323, "question" => "Which clause requires the organization to plan, establish, implement, and maintain an internal audit program?", "option_a" => "Clause 6.1", "option_b" => "Clause 8.2", "option_c" => "Clause 9.2", "option_d" => "Clause 10.1"],
                    ["id" => 9, "assessment_id" => 323, "question" => "According to ISO 45001, who holds the ultimate responsibility for the OH&S management system?", "option_a" => "External Auditors", "option_b" => "Top Management", "option_c" => "Safety Officers", "option_d" => "Frontline Workers"],
                    ["id" => 10, "assessment_id" => 323, "question" => "What action must be taken first when a nonconformity or incident occurs under Clause 10.2?", "option_a" => "React to the incident and take action to control/correct it", "option_b" => "Change the OH&S policy", "option_c" => "Conduct a management review", "option_d" => "Terminate involved personnel"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Occupational health and safety (OH&S)"],
                    ["id" => 2, "correct_answer" => "OHSAS 18001"],
                    ["id" => 3, "correct_answer" => "Clause 5.4"],
                    ["id" => 4, "correct_answer" => "Elimination"],
                    ["id" => 5, "correct_answer" => "Hazard"],
                    ["id" => 6, "correct_answer" => "Annex SL"],
                    ["id" => 7, "correct_answer" => "Incident"],
                    ["id" => 8, "correct_answer" => "Clause 9.2"],
                    ["id" => 9, "correct_answer" => "Top Management"],
                    ["id" => 10, "correct_answer" => "React to the incident and take action to control/correct it"]
                ]
            ],
            324 => [
                "id" => 324,
                "certification_id" => 324,
                "title" => "ISO 22000:2018 FSMS Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 324, "question" => "What is the main purpose of ISO 22000:2018?", "option_a" => "To establish requirements for an environmental management system", "option_b" => "To provide requirements for a Food Safety Management System (FSMS)", "option_c" => "To establish requirements for occupational health and safety", "option_d" => "To define financial management procedures"],
                    ["id" => 2, "assessment_id" => 324, "question" => "Which organizations can use ISO 22000:2018?", "option_a" => "Only food manufacturing companies", "option_b" => "Only restaurants and hotels", "option_c" => "Any organization directly or indirectly involved in the food chain", "option_d" => "Only government food inspection agencies"],
                    ["id" => 3, "assessment_id" => 324, "question" => "What does HACCP stand for?", "option_a" => "Hazard Analysis and Critical Control Points", "option_b" => "Health Assessment and Control Compliance Programme", "option_c" => "Hazard Audit and Certification Control Process", "option_d" => "Hygiene Analysis and Critical Cleaning Procedures"],
                    ["id" => 4, "assessment_id" => 324, "question" => "What is the purpose of prerequisite programmes (PRPs)?", "option_a" => "To establish basic conditions and activities needed to maintain a hygienic environment", "option_b" => "To replace the HACCP plan", "option_c" => "To determine product selling prices", "option_d" => "To conduct employee performance reviews"],
                    ["id" => 5, "assessment_id" => 324, "question" => "Which of the following is an example of a biological food safety hazard?", "option_a" => "Glass fragments", "option_b" => "Cleaning chemical residue", "option_c" => "Salmonella bacteria", "option_d" => "Metal particles"],
                    ["id" => 6, "assessment_id" => 324, "question" => "What is a Critical Control Point (CCP)?", "option_a" => "A step where control can be applied and is essential to prevent, eliminate or reduce a significant food safety hazard to an acceptable level", "option_b" => "Any routine office activity", "option_c" => "A point used only for product packaging design", "option_d" => "A stage where food safety monitoring is unnecessary"],
                    ["id" => 7, "assessment_id" => 324, "question" => "What is the purpose of establishing critical limits at a CCP?", "option_a" => "To define measurable or observable criteria that separate acceptable from unacceptable control", "option_b" => "To set employee working hours", "option_c" => "To determine the product's market price", "option_d" => "To eliminate the need for monitoring"],
                    ["id" => 8, "assessment_id" => 324, "question" => "What should an organization do when monitoring shows that a CCP is not under control?", "option_a" => "Ignore the result if the product looks acceptable", "option_b" => "Take appropriate corrections and corrective actions according to the established procedures", "option_c" => "Continue production without recording the issue", "option_d" => "Delete the monitoring records"],
                    ["id" => 9, "assessment_id" => 324, "question" => "Why is traceability important in a Food Safety Management System?", "option_a" => "It helps identify and trace food, ingredients and relevant information through the food chain", "option_b" => "It replaces supplier evaluation", "option_c" => "It removes the need for product identification", "option_d" => "It is used only for financial reporting"],
                    ["id" => 10, "assessment_id" => 324, "question" => "What is the purpose of verification in ISO 22000:2018?", "option_a" => "To confirm that planned arrangements are implemented and effective", "option_b" => "To advertise food products", "option_c" => "To replace validation of control measures", "option_d" => "To avoid reviewing FSMS performance"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "To provide requirements for a Food Safety Management System (FSMS)"],
                    ["id" => 2, "correct_answer" => "Any organization directly or indirectly involved in the food chain"],
                    ["id" => 3, "correct_answer" => "Hazard Analysis and Critical Control Points"],
                    ["id" => 4, "correct_answer" => "To establish basic conditions and activities needed to maintain a hygienic environment"],
                    ["id" => 5, "correct_answer" => "Salmonella bacteria"],
                    ["id" => 6, "correct_answer" => "A step where control can be applied and is essential to prevent, eliminate or reduce a significant food safety hazard to an acceptable level"],
                    ["id" => 7, "correct_answer" => "To define measurable or observable criteria that separate acceptable from unacceptable control"],
                    ["id" => 8, "correct_answer" => "Take appropriate corrections and corrective actions according to the established procedures"],
                    ["id" => 9, "correct_answer" => "It helps identify and trace food, ingredients and relevant information through the food chain"],
                    ["id" => 10, "correct_answer" => "To confirm that planned arrangements are implemented and effective"]
                ]
            ],
            325 => [
                "id" => 325,
                "certification_id" => 325,
                "title" => "ISO 19011:2026 Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 325, "question" => "What is the main purpose of ISO 19011:2026?", "option_a" => "To specify product quality requirements", "option_b" => "To provide guidelines for auditing management systems", "option_c" => "To establish environmental performance limits", "option_d" => "To certify individual auditors"],
                    ["id" => 2, "assessment_id" => 325, "question" => "Which of the following is an auditing principle in ISO 19011:2026?", "option_a" => "Profitability", "option_b" => "Confidentiality", "option_c" => "Production efficiency", "option_d" => "Product design"],
                    ["id" => 3, "assessment_id" => 325, "question" => "What does the principle of integrity require from an auditor?", "option_a" => "To report findings honestly and ethically", "option_b" => "To change evidence to support the audit conclusion", "option_c" => "To avoid documenting nonconformities", "option_d" => "To guarantee that no problems will be found"],
                    ["id" => 4, "assessment_id" => 325, "question" => "What is the purpose of an audit programme?", "option_a" => "To manage one employee's daily tasks", "option_b" => "To organize one or more audits over a defined period and toward specific objectives", "option_c" => "To replace management review", "option_d" => "To approve all operational purchases"],
                    ["id" => 5, "assessment_id" => 325, "question" => "Which factor should be considered when determining audit programme risks and opportunities?", "option_a" => "The auditor's personal preferences", "option_b" => "The context of the organization and factors that may affect the audit programme", "option_c" => "The colour of audit documents", "option_d" => "The number of office visitors"],
                    ["id" => 6, "assessment_id" => 325, "question" => "What should be defined before conducting an individual audit?", "option_a" => "Audit objectives, scope and criteria", "option_b" => "Employee salary levels", "option_c" => "Product selling prices", "option_d" => "The organization's advertising plan"],
                    ["id" => 7, "assessment_id" => 325, "question" => "What is the purpose of evaluating auditor competence?", "option_a" => "To ensure auditors have the necessary knowledge and skills for their assigned audit activities", "option_b" => "To determine an auditor's sales target", "option_c" => "To eliminate the need for audit evidence", "option_d" => "To guarantee identical audit findings"],
                    ["id" => 8, "assessment_id" => 325, "question" => "Which approach requires audit conclusions to be based on verifiable information?", "option_a" => "Personal-opinion approach", "option_b" => "Evidence-based approach", "option_c" => "Informal approach", "option_d" => "Promotional approach"],
                    ["id" => 9, "assessment_id" => 325, "question" => "What is an important consideration when conducting a remote audit?", "option_a" => "Ignore information security", "option_b" => "Confirm that technology, access, communication and evidence arrangements are suitable", "option_c" => "Avoid planning the audit", "option_d" => "Accept all information without verification"],
                    ["id" => 10, "assessment_id" => 325, "question" => "What is a notable focus expanded in ISO 19011:2026 compared with the 2018 edition?", "option_a" => "Guidance on remote auditing methods and virtual locations", "option_b" => "Requirements for product certification", "option_c" => "Financial accounting procedures", "option_d" => "Mandatory certification of auditors"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "To provide guidelines for auditing management systems"],
                    ["id" => 2, "correct_answer" => "Confidentiality"],
                    ["id" => 3, "correct_answer" => "To report findings honestly and ethically"],
                    ["id" => 4, "correct_answer" => "To organize one or more audits over a defined period and toward specific objectives"],
                    ["id" => 5, "correct_answer" => "The context of the organization and factors that may affect the audit programme"],
                    ["id" => 6, "correct_answer" => "Audit objectives, scope and criteria"],
                    ["id" => 7, "correct_answer" => "To ensure auditors have the necessary knowledge and skills for their assigned audit activities"],
                    ["id" => 8, "correct_answer" => "Evidence-based approach"],
                    ["id" => 9, "correct_answer" => "Confirm that technology, access, communication and evidence arrangements are suitable"],
                    ["id" => 10, "correct_answer" => "Guidance on remote auditing methods and virtual locations"]
                ]
            ],
            333 => [
                "id" => 333,
                "certification_id" => 333,
                "title" => "ISO 27001:2022 ISMS Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 333, "question" => "What does ISO/IEC 27001:2022 primarily specify?", "option_a" => "Software development guidelines", "option_b" => "Requirements for an ISMS", "option_c" => "Personal data protection rights", "option_d" => "Network cable standards"],
                    ["id" => 2, "assessment_id" => 333, "question" => "How many controls are listed in Annex A of ISO/IEC 27001:2022?", "option_a" => "114 controls", "option_b" => "93 controls", "option_c" => "150 controls", "option_d" => "82 controls"],
                    ["id" => 3, "assessment_id" => 333, "question" => "Annex A controls in ISO/IEC 27001:2022 are categorized into how many themes?", "option_a" => "4 themes", "option_b" => "14 themes", "option_c" => "10 themes", "option_d" => "6 themes"],
                    ["id" => 4, "assessment_id" => 333, "question" => "Which of the following is NOT one of the four main themes in Annex A (2022 edition)?", "option_a" => "Organizational controls", "option_b" => "Financial controls", "option_c" => "Physical controls", "option_d" => "Technological controls"],
                    ["id" => 5, "assessment_id" => 333, "question" => "What does \"ISMS\" stand for in the context of ISO 27001?", "option_a" => "Information Security Management System", "option_b" => "Integrated System Management System", "option_c" => "Internet Security and Monitoring System", "option_d" => "Information Storage Model standard"],
                    ["id" => 6, "assessment_id" => 333, "question" => "Which clause of ISO/IEC 27001 focuses on \"Operation\" and risk treatment execution?", "option_a" => "Clause 4", "option_b" => "Clause 6", "option_c" => "Clause 8", "option_d" => "Clause 10"],
                    ["id" => 7, "assessment_id" => 333, "question" => "What document must an organization produce to declare which Annex A controls apply to their ISMS?", "option_a" => "Statement of Applicability (SoA)", "option_b" => "Service Level Agreement (SLA)", "option_c" => "Non-Disclosure Agreement (NDA)", "option_d" => "Business Impact Analysis (BIA)"],
                    ["id" => 8, "assessment_id" => 333, "question" => "Which methodology is typically referenced for continuous improvement in ISO standards?", "option_a" => "Agile / Scrum", "option_b" => "Plan-Do-Check-Act (PDCA)", "option_c" => "Waterfall", "option_d" => "Six Sigma DMAIC"],
                    ["id" => 9, "assessment_id" => 333, "question" => "Under ISO/IEC 27001:2022, which title refers to the theme containing human resources security controls?", "option_a" => "Organizational controls", "option_b" => "People controls", "option_c" => "Physical controls", "option_d" => "Technological controls"],
                    ["id" => 10, "assessment_id" => 333, "question" => "What is the primary purpose of an internal ISMS audit (Clause 9.2)?", "option_a" => "To penalize non-compliant employees", "option_b" => "To verify conformance with standard requirements", "option_c" => "To replace external certification audits", "option_d" => "To design network architecture"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Requirements for an ISMS"],
                    ["id" => 2, "correct_answer" => "93 controls"],
                    ["id" => 3, "correct_answer" => "4 themes"],
                    ["id" => 4, "correct_answer" => "Financial controls"],
                    ["id" => 5, "correct_answer" => "Information Security Management System"],
                    ["id" => 6, "correct_answer" => "Clause 8"],
                    ["id" => 7, "correct_answer" => "Statement of Applicability (SoA)"],
                    ["id" => 8, "correct_answer" => "Plan-Do-Check-Act (PDCA)"],
                    ["id" => 9, "correct_answer" => "People controls"],
                    ["id" => 10, "correct_answer" => "To verify conformance with standard requirements"]
                ]
            ],
            326 => [
                "id" => 326,
                "certification_id" => 326,
                "title" => "5S Workplace Management Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 326, "question" => "What is the primary purpose of the 5S methodology?", "option_a" => "To increase employee working hours", "option_b" => "To create a clean, organized, safe and efficient workplace", "option_c" => "To reduce employee responsibilities", "option_d" => "To increase paperwork"],
                    ["id" => 2, "assessment_id" => 326, "question" => "What does the first S – Seiri – mean?", "option_a" => "Sort", "option_b" => "Set in Order", "option_c" => "Shine", "option_d" => "Sustain"],
                    ["id" => 3, "assessment_id" => 326, "question" => "What is the main objective of Seiton (Set in Order)?", "option_a" => "Remove unnecessary items", "option_b" => "Clean the workplace", "option_c" => "Arrange necessary items so they are easy to find and use", "option_d" => "Conduct employee training"],
                    ["id" => 4, "assessment_id" => 326, "question" => "What does Seiso (Shine) focus on?", "option_a" => "Cleaning and inspecting the workplace regularly", "option_b" => "Increasing production targets", "option_c" => "Removing all workplace documents", "option_d" => "Changing employee responsibilities"],
                    ["id" => 5, "assessment_id" => 326, "question" => "What is the purpose of Seiketsu (Standardize)?", "option_a" => "To introduce new machines", "option_b" => "To establish standards to maintain the first three S activities", "option_c" => "To reduce employee participation", "option_d" => "To eliminate workplace inspections"],
                    ["id" => 6, "assessment_id" => 326, "question" => "What does Shitsuke (Sustain) mean?", "option_a" => "Organizing tools", "option_b" => "Removing unwanted materials", "option_c" => "Developing discipline and maintaining 5S practices continuously", "option_d" => "Cleaning machines once a year"],
                    ["id" => 7, "assessment_id" => 326, "question" => "Which of the following is an example of Sort (Seiri)?", "option_a" => "Keeping unnecessary materials at the workstation", "option_b" => "Removing unused tools and materials from the workplace", "option_c" => "Cleaning the production floor", "option_d" => "Labelling storage locations"],
                    ["id" => 8, "assessment_id" => 326, "question" => "What is the purpose of visual management in 5S?", "option_a" => "To decorate the workplace", "option_b" => "To make workplace conditions, locations and abnormalities easy to identify", "option_c" => "To increase the number of reports", "option_d" => "To replace employee training"],
                    ["id" => 9, "assessment_id" => 326, "question" => "Which of the following is a major benefit of implementing 5S?", "option_a" => "Increased workplace waste", "option_b" => "Reduced workplace efficiency", "option_c" => "Improved productivity, safety and quality", "option_d" => "Increased searching time"],
                    ["id" => 10, "assessment_id" => 326, "question" => "Who is responsible for maintaining 5S in an organization?", "option_a" => "Only the housekeeping department", "option_b" => "Only the quality manager", "option_c" => "Only top management", "option_d" => "All employees, with management support"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "To create a clean, organized, safe and efficient workplace"],
                    ["id" => 2, "correct_answer" => "Sort"],
                    ["id" => 3, "correct_answer" => "Arrange necessary items so they are easy to find and use"],
                    ["id" => 4, "correct_answer" => "Cleaning and inspecting the workplace regularly"],
                    ["id" => 5, "correct_answer" => "To establish standards to maintain the first three S activities"],
                    ["id" => 6, "correct_answer" => "Developing discipline and maintaining 5S practices continuously"],
                    ["id" => 7, "correct_answer" => "Removing unused tools and materials from the workplace"],
                    ["id" => 8, "correct_answer" => "To make workplace conditions, locations and abnormalities easy to identify"],
                    ["id" => 9, "correct_answer" => "Improved productivity, safety and quality"],
                    ["id" => 10, "correct_answer" => "All employees, with management support"]
                ]
            ],
            327 => [
                "id" => 327,
                "certification_id" => 327,
                "title" => "7QC Tools Certification Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 327, "question" => "What is the primary purpose of the 7 QC Tools?", "option_a" => "To increase production costs", "option_b" => "To identify, analyze and solve quality problems", "option_c" => "To replace quality inspections", "option_d" => "To reduce employee training"],
                    ["id" => 2, "assessment_id" => 327, "question" => "Which 7 QC Tool is used to identify and prioritize the most significant problems?", "option_a" => "Histogram", "option_b" => "Scatter Diagram", "option_c" => "Pareto Chart", "option_d" => "Control Chart"],
                    ["id" => 3, "assessment_id" => 327, "question" => "Which tool is commonly used to identify possible causes of a problem?", "option_a" => "Cause-and-Effect Diagram", "option_b" => "Check Sheet", "option_c" => "Histogram", "option_d" => "Control Chart"],
                    ["id" => 4, "assessment_id" => 327, "question" => "What is the main purpose of a Check Sheet?", "option_a" => "To display process stability", "option_b" => "To collect and record data systematically", "option_c" => "To show relationships between two variables", "option_d" => "To rank suppliers"],
                    ["id" => 5, "assessment_id" => 327, "question" => "Which tool displays the frequency distribution of numerical data?", "option_a" => "Histogram", "option_b" => "Flowchart", "option_c" => "Pareto Chart", "option_d" => "Scatter Diagram"],
                    ["id" => 6, "assessment_id" => 327, "question" => "What does a Scatter Diagram help determine?", "option_a" => "The sequence of process steps", "option_b" => "The relationship between two variables", "option_c" => "The frequency of defects only", "option_d" => "The root cause with certainty"],
                    ["id" => 7, "assessment_id" => 327, "question" => "Which tool is used to monitor process performance over time and identify variation?", "option_a" => "Check Sheet", "option_b" => "Histogram", "option_c" => "Control Chart", "option_d" => "Cause-and-Effect Diagram"],
                    ["id" => 8, "assessment_id" => 327, "question" => "What is the main purpose of a Flowchart?", "option_a" => "To show the steps and sequence of a process", "option_b" => "To calculate process capability", "option_c" => "To rank defects by frequency", "option_d" => "To measure customer satisfaction"],
                    ["id" => 9, "assessment_id" => 327, "question" => "In a Pareto Chart, what does the 80/20 principle generally suggest?", "option_a" => "All causes contribute equally", "option_b" => "A small number of causes often account for a large proportion of problems", "option_c" => "80% of data must be rejected", "option_d" => "Every problem has exactly two causes"],
                    ["id" => 10, "assessment_id" => 327, "question" => "Which of the following is the correct set of seven basic QC tools?", "option_a" => "5S, Kaizen, FMEA, SPC, TPM, TQM and 8D", "option_b" => "Check Sheet, Histogram, Pareto Chart, Cause-and-Effect Diagram, Scatter Diagram, Control Chart and Stratification/Graph", "option_c" => "SWOT, PESTLE, SIPOC, DMAIC, 5 Whys, FMEA and Gantt Chart", "option_d" => "Audit, Inspection, Calibration, Sampling, Benchmarking, Training and Reporting"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "To identify, analyze and solve quality problems"],
                    ["id" => 2, "correct_answer" => "Pareto Chart"],
                    ["id" => 3, "correct_answer" => "Cause-and-Effect Diagram"],
                    ["id" => 4, "correct_answer" => "To collect and record data systematically"],
                    ["id" => 5, "correct_answer" => "Histogram"],
                    ["id" => 6, "correct_answer" => "The relationship between two variables"],
                    ["id" => 7, "correct_answer" => "Control Chart"],
                    ["id" => 8, "correct_answer" => "To show the steps and sequence of a process"],
                    ["id" => 9, "correct_answer" => "A small number of causes often account for a large proportion of problems"],
                    ["id" => 10, "correct_answer" => "Check Sheet, Histogram, Pareto Chart, Cause-and-Effect Diagram, Scatter Diagram, Control Chart and Stratification/Graph"]
                ]
            ],
            328 => [
                "id" => 328,
                "certification_id" => 328,
                "title" => "Project Management Level-1 Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 328, "question" => "What are the three elements of the traditional Triple Constraint in project management?", "option_a" => "Scope, Time, Cost", "option_b" => "Quality, Risk, People", "option_c" => "Planning, Execution, Monitoring", "option_d" => "Resources, Tech, Budget"],
                    ["id" => 2, "assessment_id" => 328, "question" => "Which document formally authorizes the existence of a project and grants the project manager authority?", "option_a" => "Project Management Plan", "option_b" => "Project Charter", "option_c" => "Business Case", "option_d" => "Scope Statement"],
                    ["id" => 3, "assessment_id" => 328, "question" => "What does WBS stand for in project management?", "option_a" => "Work Breakdown Structure", "option_b" => "Weekly Business Schedule", "option_c" => "Workflow System", "option_d" => "Work Budget System"],
                    ["id" => 4, "assessment_id" => 328, "question" => "In CPM (Critical Path Method), what characterizes the critical path?", "option_a" => "Path with the highest risk", "option_b" => "Longest path with zero total float", "option_c" => "Shortest path to completion", "option_d" => "Path with the most activities"],
                    ["id" => 5, "assessment_id" => 328, "question" => "What is uncontrolled expansion to product or project scope without adjustments to time, cost, and resources called?", "option_a" => "Scope Creep", "option_b" => "Gold Plating", "option_c" => "Fast Tracking", "option_d" => "Crashing"],
                    ["id" => 6, "assessment_id" => 328, "question" => "Which chart visually represents a project schedule with activities along a timeline?", "option_a" => "Pareto Chart", "option_b" => "Gantt Chart", "option_c" => "Control Chart", "option_d" => "Fishbone Chart"],
                    ["id" => 7, "assessment_id" => 328, "question" => "What technique involves overlapping project phases or tasks that are normally done in sequence to compress schedule?", "option_a" => "Crashing", "option_b" => "Resource Leveling", "option_c" => "Fast Tracking", "option_d" => "Scope Reduction"],
                    ["id" => 8, "assessment_id" => 328, "question" => "In Earned Value Management (EVM), what does a Cost Performance Index (CPI) greater than 1.0 indicate?", "option_a" => "Over budget", "option_b" => "Under budget", "option_c" => "Behind schedule", "option_d" => "Ahead of schedule"],
                    ["id" => 9, "assessment_id" => 328, "question" => "Who is an individual, group, or organization that may affect, be affected by, or perceive itself to be affected by a decision or outcome of a project?", "option_a" => "Stakeholder", "option_b" => "Sponsor", "option_c" => "Project Manager", "option_d" => "Client"],
                    ["id" => 10, "assessment_id" => 328, "question" => "What is the primary purpose of the Project Closing Phase?", "option_a" => "To define project scope", "option_b" => "To execute remaining deliverables", "option_c" => "Formally transfer deliverables & document lessons learned", "option_d" => "To allocate initial budget"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Scope, Time, Cost"],
                    ["id" => 2, "correct_answer" => "Project Charter"],
                    ["id" => 3, "correct_answer" => "Work Breakdown Structure"],
                    ["id" => 4, "correct_answer" => "Longest path with zero total float"],
                    ["id" => 5, "correct_answer" => "Scope Creep"],
                    ["id" => 6, "correct_answer" => "Gantt Chart"],
                    ["id" => 7, "correct_answer" => "Fast Tracking"],
                    ["id" => 8, "correct_answer" => "Under budget"],
                    ["id" => 9, "correct_answer" => "Stakeholder"],
                    ["id" => 10, "correct_answer" => "Formally transfer deliverables & document lessons learned"]
                ]
            ],
            329 => [
                "id" => 329,
                "certification_id" => 329,
                "title" => "Lean Six Sigma White belt Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 329, "question" => "What is the primary focus of the Lean methodology?", "option_a" => "Reducing variation", "option_b" => "Eliminating waste and improving flow", "option_c" => "Increasing inspection frequency", "option_d" => "Implementing software tools"],
                    ["id" => 2, "assessment_id" => 329, "question" => "What does DMAIC stand for in Six Sigma?", "option_a" => "Define, Measure, Analyze, Improve, Control", "option_b" => "Design, Model, Assess, Implement, Check", "option_c" => "Develop, Manage, Analyze, Inspect, Control", "option_d" => "Define, Monitor, Adjust, Integrate, Calculate"],
                    ["id" => 3, "assessment_id" => 329, "question" => "How many Defects Per Million Opportunities (DPMO) corresponds to a 6 Sigma performance level?", "option_a" => "66,807", "option_b" => "6,210", "option_c" => "233", "option_d" => "3.4"],
                    ["id" => 4, "assessment_id" => 329, "question" => "Which of the following is NOT one of the traditional 8 Wastes (TIMWOODS) in Lean?", "option_a" => "Transportation", "option_b" => "Overproduction", "option_c" => "Profitability", "option_d" => "Defects"],
                    ["id" => 5, "assessment_id" => 329, "question" => "What tool is used to map high-level processes showing Suppliers, Inputs, Process, Outputs, and Customers?", "option_a" => "SIPOC Diagram", "option_b" => "Pareto Chart", "option_c" => "Fishbone Diagram", "option_d" => "Control Chart"],
                    ["id" => 6, "assessment_id" => 329, "question" => "What is the main purpose of a Fishbone (Ishikawa) Diagram?", "option_a" => "Tracking project schedules", "option_b" => "Identifying potential root causes of a problem", "option_c" => "Calculating statistical standard deviation", "option_d" => "Setting product pricing"],
                    ["id" => 7, "assessment_id" => 329, "question" => "The 80/20 rule is associated with which Quality tool?", "option_a" => "Scatter Plot", "option_b" => "Histogram", "option_c" => "Pareto Chart", "option_d" => "Value Stream Map"],
                    ["id" => 8, "assessment_id" => 329, "question" => "What does the Japanese term \"Poka-Yoke\" mean in Lean manufacturing?", "option_a" => "Continuous improvement", "option_b" => "Mistake-proofing / Error-proofing", "option_c" => "Visual workplace", "option_d" => "Just-in-Time scheduling"],
                    ["id" => 9, "assessment_id" => 329, "question" => "In 5S methodology, what are the 5 steps in order?", "option_a" => "Sort, Set in order, Shine, Standardize, Sustain", "option_b" => "Select, Systematize, Sweep, Sanitize, Supervise", "option_c" => "Start, Shape, Scrub, Simplify, Support", "option_d" => "Sort, Secure, Shine, Solve, Sustain"],
                    ["id" => 10, "assessment_id" => 329, "question" => "During which phase of DMAIC are solutions implemented to address root causes?", "option_a" => "Measure", "option_b" => "Analyze", "option_c" => "Improve", "option_d" => "Control"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Eliminating waste and improving flow"],
                    ["id" => 2, "correct_answer" => "Define, Measure, Analyze, Improve, Control"],
                    ["id" => 3, "correct_answer" => "3.4"],
                    ["id" => 4, "correct_answer" => "Profitability"],
                    ["id" => 5, "correct_answer" => "SIPOC Diagram"],
                    ["id" => 6, "correct_answer" => "Identifying potential root causes of a problem"],
                    ["id" => 7, "correct_answer" => "Pareto Chart"],
                    ["id" => 8, "correct_answer" => "Mistake-proofing / Error-proofing"],
                    ["id" => 9, "correct_answer" => "Sort, Set in order, Shine, Standardize, Sustain"],
                    ["id" => 10, "correct_answer" => "Improve"]
                ]
            ],
            330 => [
                "id" => 330,
                "certification_id" => 330,
                "title" => "Root Cause Analysis Final Assessment",
                "duration_minutes" => 30,
                "passing_percentage" => 70,
                "questions" => [
                    ["id" => 1, "assessment_id" => 330, "question" => "What is the main objective of conducting a Root Cause Analysis (RCA)?", "option_a" => "Assigning blame to individuals", "option_b" => "Identifying underlying causes to prevent recurrence", "option_c" => "Fixing symptoms as quickly as possible", "option_d" => "Documenting financial losses"],
                    ["id" => 2, "assessment_id" => 330, "question" => "Which problem-solving technique repeatedly asks a core question to drill down to the fundamental cause?", "option_a" => "5 Whys", "option_b" => "5S Framework", "option_c" => "Brainstorming 360", "option_d" => "Gantt Analysis"],
                    ["id" => 3, "assessment_id" => 330, "question" => "What is another common name for the Fishbone Diagram used in Root Cause Analysis?", "option_a" => "Pareto Chart", "option_b" => "Ishikawa Diagram", "option_c" => "Control Chart", "option_d" => "Scatter Diagram"],
                    ["id" => 4, "assessment_id" => 330, "question" => "In a Fishbone Diagram, what is represented at the \"head\" of the fish?", "option_a" => "Root cause", "option_b" => "Proposed solution", "option_c" => "Problem statement (effect)", "option_d" => "Team leader's name"],
                    ["id" => 5, "assessment_id" => 330, "question" => "What is a symptom in contrast to a root cause?", "option_a" => "The fundamental systemic failure", "option_b" => "An observable sign or outcome of a problem", "option_c" => "The final corrective action plan", "option_d" => "An unintended positive result"],
                    ["id" => 6, "assessment_id" => 330, "question" => "What does FTA stand for in advanced root cause investigation methodologies?", "option_a" => "Fast Task Assignment", "option_b" => "Fault Tree Analysis", "option_c" => "Final Failure Tracking", "option_d" => "First Time Audit"],
                    ["id" => 7, "assessment_id" => 330, "question" => "Which category is typically included in the 6Ms framework for manufacturing RCA?", "option_a" => "Manpower / Mindset", "option_b" => "Money", "option_c" => "Marketing", "option_d" => "Milestones"],
                    ["id" => 8, "assessment_id" => 330, "question" => "What is the difference between a Corrective Action and a Preventive Action?", "option_a" => "Corrective eliminates identified causes; Preventive eliminates potential causes", "option_b" => "Preventive is done after an incident; Corrective is done before", "option_c" => "Corrective applies only to machines; Preventive applies to people", "option_d" => "There is no functional difference between them"],
                    ["id" => 9, "assessment_id" => 330, "question" => "What visual quality tool helps prioritize causes based on the 80/20 rule?", "option_a" => "Histogram", "option_b" => "Flowchart", "option_c" => "Pareto Chart", "option_d" => "Check Sheet"],
                    ["id" => 10, "assessment_id" => 330, "question" => "What step should follow immediately after identifying the root cause of an issue?", "option_a" => "Close the project file", "option_b" => "Develop and implement corrective action plans", "option_c" => "Conduct employee performance reviews", "option_d" => "Restart the 5 Whys process"]
                ],
                "submission_questions" => [
                    ["id" => 1, "correct_answer" => "Identifying underlying causes to prevent recurrence"],
                    ["id" => 2, "correct_answer" => "5 Whys"],
                    ["id" => 3, "correct_answer" => "Ishikawa Diagram"],
                    ["id" => 4, "correct_answer" => "Problem statement (effect)"],
                    ["id" => 5, "correct_answer" => "An observable sign or outcome of a problem"],
                    ["id" => 6, "correct_answer" => "Fault Tree Analysis"],
                    ["id" => 7, "correct_answer" => "Manpower / Mindset"],
                    ["id" => 8, "correct_answer" => "Corrective eliminates identified causes; Preventive eliminates potential causes"],
                    ["id" => 9, "correct_answer" => "Pareto Chart"],
                    ["id" => 10, "correct_answer" => "Develop and implement corrective action plans"]
                ]
            ],
        ];

        return $catalog[$certificationId] ?? null;
    }
}
