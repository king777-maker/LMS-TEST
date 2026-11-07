<?php

class AssessmentQuestion
{
    private mysqli $db;

    private string $table = "assessment_questions";


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }


    // =====================================================
    // GET ALL QUESTIONS FOR ADMIN
    // =====================================================

    public function getAll(int $assessmentId): array
    {
        if ($assessmentId <= 0) {
            throw new Exception(
                "Assessment ID is required."
            );
        }


        $sql = "
            SELECT
                id,
                assessment_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                sort_order,
                status,
                created_at,
                updated_at
            FROM {$this->table}
            WHERE assessment_id = ?
            ORDER BY
                sort_order ASC,
                id ASC
        ";


        $stmt = $this->db->prepare($sql);


        if (!$stmt) {
            throw new Exception(
                "Failed to prepare questions query: " .
                $this->db->error
            );
        }


        $stmt->bind_param(
            "i",
            $assessmentId
        );


        if (!$stmt->execute()) {

            $error = $stmt->error;

            $stmt->close();

            throw new Exception(
                "Failed to fetch questions: " .
                $error
            );
        }


        $result = $stmt->get_result();

        $questions = [];


        while ($row = $result->fetch_assoc()) {

            $questionId =
                isset($row["id"])
                    ? (int) $row["id"]
                    : 0;


            /*
             * Never send an invalid database ID
             * to React.
             */
            if ($questionId <= 0) {

                error_log(
                    "AssessmentQuestion::getAll() - " .
                    "Invalid question ID returned. " .
                    "Assessment ID: " .
                    $assessmentId
                );

                continue;
            }


            $questions[] = [

                "id" =>
                    $questionId,

                "assessment_id" =>
                    (int) (
                        $row["assessment_id"] ?? 0
                    ),

                "question" =>
                    (string) (
                        $row["question"] ?? ""
                    ),

                "option_a" =>
                    (string) (
                        $row["option_a"] ?? ""
                    ),

                "option_b" =>
                    (string) (
                        $row["option_b"] ?? ""
                    ),

                "option_c" =>
                    (string) (
                        $row["option_c"] ?? ""
                    ),

                "option_d" =>
                    (string) (
                        $row["option_d"] ?? ""
                    ),

                /*
                 * IMPORTANT:
                 *
                 * Do NOT strtoupper().
                 *
                 * correct_answer now stores
                 * the actual answer text.
                 */
                "correct_answer" =>
                    trim(
                        (string) (
                            $row["correct_answer"] ?? ""
                        )
                    ),

                "sort_order" =>
                    (int) (
                        $row["sort_order"] ?? 0
                    ),

                "status" =>
                    (string) (
                        $row["status"] ?? "active"
                    ),

                "created_at" =>
                    $row["created_at"] ?? null,

                "updated_at" =>
                    $row["updated_at"] ?? null,
            ];
        }


        $stmt->close();


        return $questions;
    }


    // =====================================================
    // GET SINGLE QUESTION
    // =====================================================

    public function getById(int $id): ?array
    {
        $id = (int) $id;


        if ($id <= 0) {
            return null;
        }


        $sql = "
            SELECT
                id,
                assessment_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                sort_order,
                status,
                created_at,
                updated_at
            FROM {$this->table}
            WHERE id = ?
            LIMIT 1
        ";


        $stmt = $this->db->prepare($sql);


        if (!$stmt) {
            throw new Exception(
                "Failed to prepare question query: " .
                $this->db->error
            );
        }


        $stmt->bind_param(
            "i",
            $id
        );


        if (!$stmt->execute()) {

            $error = $stmt->error;

            $stmt->close();

            throw new Exception(
                "Failed to fetch question: " .
                $error
            );
        }


        $result = $stmt->get_result();

        $row = $result->fetch_assoc();


        $stmt->close();


        if (!$row) {
            return null;
        }


        $questionId =
            (int) (
                $row["id"] ?? 0
            );


        if ($questionId <= 0) {
            return null;
        }


        return [

            "id" =>
                $questionId,

            "assessment_id" =>
                (int) (
                    $row["assessment_id"] ?? 0
                ),

            "question" =>
                (string) (
                    $row["question"] ?? ""
                ),

            "option_a" =>
                (string) (
                    $row["option_a"] ?? ""
                ),

            "option_b" =>
                (string) (
                    $row["option_b"] ?? ""
                ),

            "option_c" =>
                (string) (
                    $row["option_c"] ?? ""
                ),

            "option_d" =>
                (string) (
                    $row["option_d"] ?? ""
                ),

            /*
             * STORE ACTUAL ANSWER TEXT
             */
            "correct_answer" =>
                trim(
                    (string) (
                        $row["correct_answer"] ?? ""
                    )
                ),

            "sort_order" =>
                (int) (
                    $row["sort_order"] ?? 0
                ),

            "status" =>
                (string) (
                    $row["status"] ?? "active"
                ),

            "created_at" =>
                $row["created_at"] ?? null,

            "updated_at" =>
                $row["updated_at"] ?? null,
        ];
    }


    // =====================================================
    // CREATE QUESTION
    // =====================================================

    public function create(array $data): array
    {
        $assessmentId =
            (int) (
                $data["assessment_id"] ?? 0
            );


        $question =
            trim(
                (string) (
                    $data["question"] ?? ""
                )
            );


        $optionA =
            trim(
                (string) (
                    $data["option_a"] ?? ""
                )
            );


        $optionB =
            trim(
                (string) (
                    $data["option_b"] ?? ""
                )
            );


        $optionC =
            trim(
                (string) (
                    $data["option_c"] ?? ""
                )
            );


        $optionD =
            trim(
                (string) (
                    $data["option_d"] ?? ""
                )
            );


        /*
         * IMPORTANT:
         *
         * Do NOT convert this to A/B/C/D.
         *
         * We store the actual answer.
         *
         * Example:
         *
         * option_a = test-1
         * option_b = test-2
         * option_c = test-3
         * option_d = test-4
         *
         * correct_answer = test-3
         */
        $correctAnswer =
            trim(
                (string) (
                    $data["correct_answer"] ?? ""
                )
            );


        $sortOrder =
            isset($data["sort_order"])
                ? (int) $data["sort_order"]
                : 1;


        $status =
            trim(
                (string) (
                    $data["status"] ?? "active"
                )
            );


        // =================================================
        // VALIDATE
        // =================================================

        $this->validate(
            $assessmentId,
            $question,
            $optionA,
            $optionB,
            $optionC,
            $optionD,
            $correctAnswer
        );


        // =================================================
        // INSERT
        //
        // IMPORTANT:
        // DO NOT INSERT id MANUALLY.
        //
        // MySQL generates the ID.
        // =================================================

        $sql = "
            INSERT INTO {$this->table}
            (
                assessment_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                sort_order,
                status
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
                ?,
                ?
            )
        ";


        $stmt =
            $this->db->prepare($sql);


        if (!$stmt) {

            throw new Exception(
                "Failed to prepare create question query: " .
                $this->db->error
            );
        }


        /*
         * assessment_id = i
         * question      = s
         * option_a      = s
         * option_b      = s
         * option_c      = s
         * option_d      = s
         * correct       = s
         * sort_order    = i
         * status        = s
         *
         * i + 6 strings + i + string
         *
         * "issssssis"
         */

        $stmt->bind_param(
            "issssssis",
            $assessmentId,
            $question,
            $optionA,
            $optionB,
            $optionC,
            $optionD,
            $correctAnswer,
            $sortOrder,
            $status
        );


        if (!$stmt->execute()) {

            $error =
                $stmt->error;

            $stmt->close();

            throw new Exception(
                "Unable to create question: " .
                $error
            );
        }


        // =================================================
        // GET MYSQL INSERT ID
        // =================================================

        $id =
            (int) $this->db->insert_id;


        $stmt->close();


        /*
         * MySQL MUST return a valid ID.
         */

        if ($id <= 0) {

            throw new Exception(
                "Question was inserted but MySQL did not return " .
                "a valid question ID."
            );
        }


        // =================================================
        // FETCH CREATED QUESTION
        // =================================================

        $created =
            $this->getById($id);


        if (!$created) {

            throw new Exception(
                "Question was created but could not be fetched."
            );
        }


        return $created;
    }


    // =====================================================
    // UPDATE QUESTION
    // =====================================================

    public function update(array $data): array
    {
        // =================================================
        // GET QUESTION ID
        // =================================================

        $id = 0;


        if (isset($data["id"])) {

            $id =
                (int) $data["id"];
        }


        if (
            $id <= 0 &&
            isset($data["question_id"])
        ) {

            $id =
                (int) $data["question_id"];
        }


        if (
            $id <= 0 &&
            isset($data["questionId"])
        ) {

            $id =
                (int) $data["questionId"];
        }


        if ($id <= 0) {

            throw new Exception(
                "Question ID is required."
            );
        }


        // =================================================
        // GET EXISTING QUESTION
        // =================================================

        $existing =
            $this->getById($id);


        if (!$existing) {

            throw new Exception(
                "Question not found."
            );
        }


        // =================================================
        // DATA
        // =================================================

        $assessmentId =
            (int) (
                $data["assessment_id"]
                ?? $existing["assessment_id"]
            );


        $question =
            trim(
                (string) (
                    $data["question"]
                    ?? $existing["question"]
                    ?? ""
                )
            );


        $optionA =
            trim(
                (string) (
                    $data["option_a"]
                    ?? $existing["option_a"]
                    ?? ""
                )
            );


        $optionB =
            trim(
                (string) (
                    $data["option_b"]
                    ?? $existing["option_b"]
                    ?? ""
                )
            );


        $optionC =
            trim(
                (string) (
                    $data["option_c"]
                    ?? $existing["option_c"]
                    ?? ""
                )
            );


        $optionD =
            trim(
                (string) (
                    $data["option_d"]
                    ?? $existing["option_d"]
                    ?? ""
                )
            );


        /*
         * ACTUAL ANSWER TEXT
         *
         * No strtoupper().
         */

        $correctAnswer =
            trim(
                (string) (
                    $data["correct_answer"]
                    ?? $existing["correct_answer"]
                    ?? ""
                )
            );


        $sortOrder =
            isset($data["sort_order"])
                ? (int) $data["sort_order"]
                : (int) (
                    $existing["sort_order"] ?? 1
                );


        $status =
            trim(
                (string) (
                    $data["status"]
                    ?? $existing["status"]
                    ?? "active"
                )
            );


        // =================================================
        // VALIDATE
        // =================================================

        $this->validate(
            $assessmentId,
            $question,
            $optionA,
            $optionB,
            $optionC,
            $optionD,
            $correctAnswer
        );


        // =================================================
        // UPDATE
        // =================================================

        $sql = "
            UPDATE {$this->table}
            SET
                assessment_id = ?,
                question = ?,
                option_a = ?,
                option_b = ?,
                option_c = ?,
                option_d = ?,
                correct_answer = ?,
                sort_order = ?,
                status = ?
            WHERE id = ?
            LIMIT 1
        ";


        $stmt =
            $this->db->prepare($sql);


        if (!$stmt) {

            throw new Exception(
                "Failed to prepare update question query: " .
                $this->db->error
            );
        }


        /*
         * i = assessment_id
         * s = question
         * s = option_a
         * s = option_b
         * s = option_c
         * s = option_d
         * s = correct_answer
         * i = sort_order
         * s = status
         * i = id
         *
         * "issssssisi"
         */

        $stmt->bind_param(
            "issssssisi",
            $assessmentId,
            $question,
            $optionA,
            $optionB,
            $optionC,
            $optionD,
            $correctAnswer,
            $sortOrder,
            $status,
            $id
        );


        if (!$stmt->execute()) {

            $error =
                $stmt->error;

            $stmt->close();

            throw new Exception(
                "Unable to update question: " .
                $error
            );
        }


        $stmt->close();


        // =================================================
        // FETCH UPDATED QUESTION
        // =================================================

        $updated =
            $this->getById($id);


        if (!$updated) {

            throw new Exception(
                "Question updated but could not be fetched."
            );
        }


        return $updated;
    }


    // =====================================================
    // DELETE QUESTION
    // =====================================================

    public function delete(int $id): bool
    {
        $id = (int) $id;


        if ($id <= 0) {

            throw new Exception(
                "Question ID is required."
            );
        }


        // =================================================
        // CHECK QUESTION EXISTS
        // =================================================

        $existing =
            $this->getById($id);


        if (!$existing) {

            return false;
        }


        // =================================================
        // DELETE
        // =================================================

        $sql = "
            DELETE FROM {$this->table}
            WHERE id = ?
            LIMIT 1
        ";


        $stmt =
            $this->db->prepare($sql);


        if (!$stmt) {

            throw new Exception(
                "Failed to prepare delete question query: " .
                $this->db->error
            );
        }


        $stmt->bind_param(
            "i",
            $id
        );


        if (!$stmt->execute()) {

            $error =
                $stmt->error;

            $stmt->close();

            throw new Exception(
                "Unable to delete question: " .
                $error
            );
        }


        $deleted =
            $stmt->affected_rows > 0;


        $stmt->close();


        return $deleted;
    }


    // =====================================================
    // VALIDATE QUESTION
    // =====================================================

    private function validate(
        int $assessmentId,
        string $question,
        string $optionA,
        string $optionB,
        string $optionC,
        string $optionD,
        string $correctAnswer
    ): void {

        if ($assessmentId <= 0) {

            throw new Exception(
                "Assessment ID is required."
            );
        }


        if ($question === "") {

            throw new Exception(
                "Question is required."
            );
        }


        if ($optionA === "") {

            throw new Exception(
                "Option A is required."
            );
        }


        if ($optionB === "") {

            throw new Exception(
                "Option B is required."
            );
        }


        if ($optionC === "") {

            throw new Exception(
                "Option C is required."
            );
        }


        if ($optionD === "") {

            throw new Exception(
                "Option D is required."
            );
        }


        if ($correctAnswer === "") {

            throw new Exception(
                "Correct answer is required."
            );
        }


        // =================================================
        // IMPORTANT
        //
        // CORRECT ANSWER MUST BE ONE OF THE
        // ACTUAL OPTION VALUES.
        // =================================================

        $validAnswers = [

            trim($optionA),

            trim($optionB),

            trim($optionC),

            trim($optionD),

        ];


        $answerExists = false;


        foreach (
            $validAnswers
            as $answer
        ) {

            if (
                strcasecmp(
                    trim($correctAnswer),
                    trim($answer)
                ) === 0
            ) {

                $answerExists = true;

                break;
            }
        }


        if (!$answerExists) {

            throw new Exception(
                "Correct answer must match one of the available options."
            );
        }
    }
}