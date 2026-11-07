<?php

class Assessment
{
    private mysqli $db;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }


    // ==========================================
    // GET ASSESSMENT BY CERTIFICATION ID
    // ==========================================

    public function getByCertificationId(
        int $certificationId
    ): ?array
    {
        $sql = "
            SELECT
                ca.*,
                fc.name AS certification_name
            FROM course_assessments ca

            LEFT JOIN free_certifications fc
                ON fc.id = ca.certification_id

            WHERE ca.certification_id = ?
            AND ca.status = 'active'

            LIMIT 1
        ";


        $stmt =
            $this->db->prepare(
                $sql
            );


        $stmt->bind_param(
            "i",
            $certificationId
        );


        $stmt->execute();


        $result =
            $stmt->get_result();


        $assessment =
            $result->fetch_assoc();


        return $assessment ?: null;
    }


    // ==========================================
    // GET QUESTIONS FOR FRONTEND
    // IMPORTANT:
    // correct_answer IS NOT RETURNED
    // ==========================================

    public function getQuestions(
        int $assessmentId
    ): array
    {
        $sql = "
            SELECT
                id,
                assessment_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d
            FROM assessment_questions

            WHERE assessment_id = ?
            AND status = 'active'

            ORDER BY
                sort_order ASC,
                id ASC
        ";


        $stmt =
            $this->db->prepare(
                $sql
            );


        $stmt->bind_param(
            "i",
            $assessmentId
        );


        $stmt->execute();


        $result =
            $stmt->get_result();


        $questions = [];


        while (
            $row =
                $result->fetch_assoc()
        ) {

            // Convert database options
            // into an array for React

            $row["options"] = [

                $row["option_a"],
                $row["option_b"],
                $row["option_c"],
                $row["option_d"]

            ];


            // We don't need these individually
            // on React after creating options

            unset(
                $row["option_a"],
                $row["option_b"],
                $row["option_c"],
                $row["option_d"]
            );


            $questions[] =
                $row;
        }


        return $questions;
    }


    // ==========================================
    // GET QUESTIONS FOR SUBMISSION
    //
    // This method is ONLY used by PHP.
    // correct_answer must NEVER be sent
    // to the frontend.
    // ==========================================

    public function getQuestionsForSubmission(
        int $assessmentId
    ): array
    {
        $sql = "
            SELECT
                id,
                assessment_id,
                correct_answer
            FROM assessment_questions

            WHERE assessment_id = ?
            AND status = 'active'

            ORDER BY
                sort_order ASC,
                id ASC
        ";


        $stmt =
            $this->db->prepare(
                $sql
            );


        $stmt->bind_param(
            "i",
            $assessmentId
        );


        $stmt->execute();


        $result =
            $stmt->get_result();


        $questions = [];


        while (
            $row =
                $result->fetch_assoc()
        ) {

            $questions[] =
                $row;

        }


        return $questions;
    }


    // ==========================================
    // SAVE ASSESSMENT SUBMISSION
    // ==========================================

    public function saveSubmission(
        array $data
    ): int
    {
        $sql = "
            INSERT INTO assessment_submissions
            (
                user_id,
                assessment_id,
                certification_id,
                score,
                total_questions,
                percentage,
                result,
                created_at,
                updated_at
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                NOW(),
                NOW()
            )
        ";


        $stmt =
            $this->db->prepare(
                $sql
            );


        $userId =
            (int) $data["user_id"];

        $assessmentId =
            (int) $data["assessment_id"];

        $certificationId =
            (int) $data["certification_id"];

        $score =
            (int) $data["score"];

        $totalQuestions =
            (int) $data["total_questions"];

        $percentage =
            (float) $data["percentage"];

        $result =
            (string) $data["result"];


        $stmt->bind_param(
            "iiiiids",
            $userId,
            $assessmentId,
            $certificationId,
            $score,
            $totalQuestions,
            $percentage,
            $result
        );


        if (!$stmt->execute()) {

            return 0;

        }


        return (int)
            $this->db->insert_id;
    }
}