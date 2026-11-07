<?php

require_once __DIR__
    . "/../Models/AssessmentQuestion.php";


class AdminAssessmentQuestionController
{
    private AssessmentQuestion $question;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public function __construct(
        mysqli $db
    ) {

        $this->question =
            new AssessmentQuestion($db);
    }


    // =====================================================
    // GET QUESTIONS
    // =====================================================

    public function getAll(): void
    {
        $assessmentId =
            isset($_GET["assessment_id"])
                ? (int) $_GET["assessment_id"]
                : 0;


        if ($assessmentId <= 0) {

            $this->response(
                false,
                "Assessment ID is required.",
                [],
                422
            );

            return;
        }


        try {

            $questions =
                $this->question->getAll(
                    $assessmentId
                );


            $this->response(
                true,
                "Questions fetched successfully.",
                $questions
            );

        } catch (Throwable $error) {

            $this->response(
                false,
                $error->getMessage(),
                [],
                500
            );
        }
    }


    // =====================================================
    // GET SINGLE
    // =====================================================

    public function getById(): void
    {
        $id =
            isset($_GET["id"])
                ? (int) $_GET["id"]
                : 0;


        if ($id <= 0) {

            $this->response(
                false,
                "Question ID is required.",
                null,
                422
            );

            return;
        }


        try {

            $question =
                $this->question->getById(
                    $id
                );


            if (!$question) {

                $this->response(
                    false,
                    "Question not found.",
                    null,
                    404
                );

                return;
            }


            $this->response(
                true,
                "Question fetched successfully.",
                $question
            );

        } catch (Throwable $error) {

            $this->response(
                false,
                $error->getMessage(),
                null,
                500
            );
        }
    }


    // =====================================================
    // CREATE
    // =====================================================

    public function create(): void
    {
        $input =
            json_decode(
                file_get_contents(
                    "php://input"
                ),
                true
            );


        if (!is_array($input)) {
            $input = [];
        }


        try {

            $question =
                $this->question->create(
                    $input
                );


            $this->response(
                true,
                "Question created successfully.",
                $question,
                201
            );

        } catch (Throwable $error) {

            $this->response(
                false,
                $error->getMessage(),
                null,
                400
            );
        }
    }


    // =====================================================
    // UPDATE
    // =====================================================

    public function update(): void
    {
        $input =
            json_decode(
                file_get_contents(
                    "php://input"
                ),
                true
            );


        if (!is_array($input)) {
            $input = [];
        }


        try {

            $question =
                $this->question->update(
                    $input
                );


            $this->response(
                true,
                "Question updated successfully.",
                $question
            );

        } catch (Throwable $error) {

            $this->response(
                false,
                $error->getMessage(),
                null,
                400
            );
        }
    }


    // =====================================================
    // DELETE
    // =====================================================

    public function delete(): void
    {
        $input =
            json_decode(
                file_get_contents(
                    "php://input"
                ),
                true
            );


        $id =
            (int) (
                $input["id"] ?? 0
            );


        if ($id <= 0) {

            $this->response(
                false,
                "Question ID is required.",
                null,
                422
            );

            return;
        }


        try {

            $deleted =
                $this->question->delete(
                    $id
                );


            if (!$deleted) {

                $this->response(
                    false,
                    "Question not found.",
                    null,
                    404
                );

                return;
            }


            $this->response(
                true,
                "Question deleted successfully."
            );

        } catch (Throwable $error) {

            $this->response(
                false,
                $error->getMessage(),
                null,
                400
            );
        }
    }


    // =====================================================
    // RESPONSE
    // =====================================================

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


        if ($data !== null) {

            $response["data"] =
                $data;
        }


        echo json_encode(
            $response
        );


        exit;
    }
}