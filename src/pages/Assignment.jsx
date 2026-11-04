import { markCourseCompleted, normalizeCourseId, resolveUserId, recordExamBypass, getCourseProgress, isChapterUnlocked } from "../utils/progressTracker";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability";
import { COURSE_ASSESSMENT_CATALOG, getAssessmentForCourse } from "../data/assessmentCatalog";
import { getAuthoritativeCourseName } from "../data/freeCoursesData";
import { useAuth } from "../context/AuthContext";
import {
    useEffect,
    useState,
    useCallback,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getAssessment,
    submitAssessment,
    redeemCertificateCoupon,
} from "../api/api";

import Timer
    from "../components/Assignment/Timer";

import QuestionCard
    from "../components/Assignment/QuestionCard";

import QuestionPalette
    from "../components/Assignment/QuestionPalette";

import NavigationButtons
    from "../components/Assignment/NavigationButtons";


// =====================================================
// ASSIGNMENT
// =====================================================

const Assignment = () => {

    const { id } = useParams();

    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    const rawCourseKey = String(id || "").toLowerCase().trim();
    const resolvedCertId = Number(
        FREE_COURSE_DB_MAP[rawCourseKey] ||
        normalizeCourseId(rawCourseKey) ||
        (isNaN(Number(id)) ? 0 : Number(id))
    );
    const assessmentId = resolvedCertId > 0 ? resolvedCertId : 322;


    // =====================================================
    // STATE
    // =====================================================

    const [assessment, setAssessment] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [answers, setAnswers] =
        useState({});

    const [timeLeft, setTimeLeft] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // CERTIFICATE COUPON
    // =====================================================

    const [certificateCoupon, setCertificateCoupon] =
        useState("");

    const [
        certificateCouponLoading,
        setCertificateCouponLoading,
    ] = useState(false);

    const [
        certificateCouponError,
        setCertificateCouponError,
    ] = useState("");

    const [
        certificateCouponSuccess,
        setCertificateCouponSuccess,
    ] = useState("");


    // =====================================================
    // STORAGE KEY
    // =====================================================

    const answersStorageKey =
        `assignment_answers_${assessmentId}`;


    // =====================================================
    // GET QUESTION ID
    // =====================================================

    const getQuestionId = (
        question,
        index
    ) => {

        if (!question) {
            return index + 1;
        }

        return (
            question.id ??
            question.question_id ??
            question.questionId ??
            index + 1
        );
    };


    // =====================================================
    // GET LOGGED IN USER
    // =====================================================

    const getLoggedInUser = () => {
        if (authUser && (authUser.id || authUser.user_id)) {
            return authUser;
        }

        try {
            const bbUser = localStorage.getItem("bb_user");
            if (bbUser) {
                const parsed = JSON.parse(bbUser);
                if (parsed && (parsed.id || parsed.user_id)) {
                    return parsed;
                }
            }

            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                if (parsed && (parsed.id || parsed.user_id)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Invalid user data:", error);
        }

        const fallbackUid = resolveUserId();
        return {
            id: fallbackUid,
            user_id: fallbackUid,
            name: "Learner",
            full_name: "Learner",
            email: "learner@broadbeach.in",
        };
    };


    // =====================================================
    // RESTORE ANSWERS
    // =====================================================

    useEffect(() => {

        if (!assessmentId) {
            return;
        }

        try {

            const savedAnswers =
                sessionStorage.getItem(
                    answersStorageKey
                );

            if (!savedAnswers) {
                return;
            }

            const parsedAnswers =
                JSON.parse(savedAnswers);

            if (
                parsedAnswers &&
                typeof parsedAnswers === "object" &&
                !Array.isArray(parsedAnswers)
            ) {

                console.log(
                    "RESTORED ANSWERS:",
                    parsedAnswers
                );

                setAnswers(
                    parsedAnswers
                );
            }

        } catch (error) {

            console.error(
                "Unable to restore answers:",
                error
            );

            sessionStorage.removeItem(
                answersStorageKey
            );
        }

    }, [
        assessmentId,
        answersStorageKey,
    ]);


    // =====================================================
    // SAVE ANSWERS
    // =====================================================

    useEffect(() => {

        if (!assessmentId) {
            return;
        }

        try {

            sessionStorage.setItem(
                answersStorageKey,
                JSON.stringify(answers)
            );

        } catch (error) {

            console.error(
                "Unable to save answers:",
                error
            );
        }

    }, [
        answers,
        assessmentId,
        answersStorageKey,
    ]);


    // =====================================================
    // FETCH ASSESSMENT
    // =====================================================

    useEffect(() => {

        const fetchAssessment =
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    const response =
                        await getAssessment(
                            assessmentId
                        );

                    console.log(
                        "ASSESSMENT API RESPONSE:",
                        response?.data
                    );

                    if (
                        response?.data?.success &&
                        response?.data?.data
                    ) {
                        const data = response.data.data;
                        setAssessment(data);
                        const questionList = Array.isArray(data?.questions) ? data.questions : [];
                        setQuestions(questionList);
                        const duration = Number(data?.duration_minutes || 30);
                        setTimeLeft(duration * 60);
                    } else {
                        const catalogItem = COURSE_ASSESSMENT_CATALOG[assessmentId] || getAssessmentForCourse(assessmentId);
                        if (catalogItem) {
                            setAssessment(catalogItem);
                            setQuestions(catalogItem.questions.map(q => ({
                                id: q.id,
                                assessment_id: catalogItem.id,
                                question: q.question,
                                options: q.options
                            })));
                            setTimeLeft(Number(catalogItem.duration_minutes || 30) * 60);
                        } else {
                            throw new Error(response?.data?.message || "Failed to load assessment.");
                        }
                    }

                } catch (error) {
                    console.warn(
                        "Assessment API call failed or offline, falling back to authoritative course assessment catalog:",
                        error?.message || error
                    );

                    const catalogItem =
                        COURSE_ASSESSMENT_CATALOG[assessmentId] ||
                        getAssessmentForCourse(assessmentId) ||
                        getAssessmentForCourse(rawCourseKey) ||
                        COURSE_ASSESSMENT_CATALOG[322];

                    if (catalogItem) {
                        setAssessment(catalogItem);
                        const questionList = Array.isArray(catalogItem?.questions) ? catalogItem.questions : [];
                        setQuestions(questionList.map(q => ({
                            id: q.id,
                            assessment_id: catalogItem.id || assessmentId,
                            question: q.question,
                            options: q.options
                        })));
                        const duration = Number(catalogItem?.duration_minutes || 30);
                        setTimeLeft(duration * 60);
                        setError("");
                    } else {
                        setError(
                            error?.response?.data?.message ||
                            error?.message ||
                            "Unable to load assessment."
                        );
                    }

                } finally {

                    setLoading(false);
                }
            };


        if (assessmentId) {

            fetchAssessment();

        }

    }, [
        assessmentId,
    ]);


    // =====================================================
    // HANDLE ANSWER
    // =====================================================
    //
    // QuestionCard sends:
    // onSelectAnswer(questionNumber, optionValue)
    //
    // Store answers by question number:
    // {
    //     1: "answer 1",
    //     2: "answer 2",
    //     ...
    // }
    // =====================================================

    const handleAnswer = useCallback(
        (questionNumber, answer) => {
            const number = Number(questionNumber);

            if (
                !Number.isInteger(number) ||
                number < 1 ||
                number > questions.length
            ) {
                console.error("Invalid question number:", questionNumber);
                return;
            }

            let answerValue = answer;

            if (
                answerValue &&
                typeof answerValue === "object"
            ) {
                answerValue =
                    answerValue.answer ??
                    answerValue.value ??
                    answerValue.option ??
                    answerValue.text ??
                    "";
            }

            if (
                answerValue === null ||
                answerValue === undefined
            ) {
                answerValue = "";
            }

            setAnswers((previousAnswers) => ({
                ...previousAnswers,
                [number]: answerValue,
            }));

            console.log("ANSWER SAVED:", {
                questionNumber: number,
                answer: answerValue,
            });
        },
        [questions.length]
    );


    // =====================================================
    // ANSWERED COUNT
    // =====================================================

    const answeredCount =
        questions.filter(
            (_, index) =>
                Object.prototype.hasOwnProperty.call(
                    answers,
                    index + 1
                )
        ).length;


    // =====================================================
    // PREPARE SUBMISSION
    // =====================================================

    const prepareSubmissionAnswers =
        () => {

            const submissionAnswers = {};


            questions.forEach(
                (
                    question,
                    index
                ) => {

                    const questionNumber =
                        index + 1;


                    if (
                        !Object.prototype.hasOwnProperty.call(
                            answers,
                            questionNumber
                        )
                    ) {

                        return;
                    }


                    const questionId =
                        getQuestionId(
                            question,
                            index
                        );


                    submissionAnswers[
                        String(questionId)
                    ] =
                        answers[
                            questionNumber
                        ];
                }
            );


            return submissionAnswers;
        };


    // =====================================================
    // CERTIFICATE COUPON
    // =====================================================

    const handleCertificateCoupon =
        async (event) => {

            event.preventDefault();


            setCertificateCouponError("");

            setCertificateCouponSuccess("");


            const code =
                certificateCoupon
                    .trim()
                    .toUpperCase();


            if (!code) {

                setCertificateCouponError(
                    "Please enter your certificate access code."
                );

                return;
            }


            const loggedInUser =
                getLoggedInUser();


            if (!loggedInUser) {

                setCertificateCouponError(
                    "Please login before using the certificate access code."
                );

                return;
            }


            const userId =
                Number(
                    loggedInUser.id ||
                    loggedInUser.user_id ||
                    loggedInUser.userId ||
                    0
                );


            if (!userId) {

                setCertificateCouponError(
                    "Unable to identify the logged-in user."
                );

                return;
            }


            if (!assessmentId) {

                setCertificateCouponError(
                    "Certification ID is missing."
                );

                return;
            }


            try {

                setCertificateCouponLoading(
                    true
                );


                const response =
                    await redeemCertificateCoupon({

                        code,

                        user_id:
                            userId,

                        certification_id:
                            assessmentId,

                    });


                console.log(
                    "CERTIFICATE COUPON RESPONSE:",
                    response?.data
                );


                if (
                    !response?.data?.success
                ) {

                    setCertificateCouponError(
                        response?.data?.message ||
                        "Invalid or expired certificate access code."
                    );

                    return;
                }


                setCertificateCouponSuccess(
                    "Certificate access code verified successfully. Redirecting..."
                );


                localStorage.setItem(
                    `certificate_access_${assessmentId}`,
                    "true"
                );


                if (
                    response?.data?.certificate_number
                ) {

                    localStorage.setItem(
                        `certificate_number_${assessmentId}`,
                        response.data.certificate_number
                    );
                }


                if (
                    response?.data?.certificate_id
                ) {

                    localStorage.setItem(
                        `certificate_id_${assessmentId}`,
                        String(
                            response.data.certificate_id
                        )
                    );
                }

                recordExamBypass(userId, assessmentId, response?.data || {});

                setTimeout(
                    () => {

                        navigate(
                            `/certificate/${assessmentId}`
                        );

                    },
                    700
                );

            } catch (error) {

                console.error(
                    "Certificate Coupon Error:",
                    error
                );


                setCertificateCouponError(
                    error?.response?.data?.message ||
                    "Unable to verify certificate access code."
                );

            } finally {

                setCertificateCouponLoading(
                    false
                );
            }
        };


    // =====================================================
    // LOCAL GRADING EVALUATION HELPER
    // =====================================================

    const evaluateLocalGrading = useCallback(
        (targetUserId, targetStudentName) => {
            const catalogItem =
                COURSE_ASSESSMENT_CATALOG[assessmentId] ||
                getAssessmentForCourse(assessmentId) ||
                getAssessmentForCourse(rawCourseKey) ||
                COURSE_ASSESSMENT_CATALOG[322] ||
                assessment;

            if (catalogItem && Array.isArray(catalogItem.questions)) {
                let score = 0;
                const total = catalogItem.questions.length;
                catalogItem.questions.forEach((q, idx) => {
                    const qNum = idx + 1;
                    const userAns = answers[qNum] || answers[q.id];
                    if (
                        userAns &&
                        String(userAns).trim().toLowerCase() ===
                        String(q.correct_answer || "").trim().toLowerCase()
                    ) {
                        score++;
                    }
                });

                const percentage =
                    total > 0 ? Math.round((score / total) * 100) : 0;
                const passed =
                    percentage >= (catalogItem.passing_percentage || 70);
                const certificateNumber = `BBA-${assessmentId}-${Date.now().toString(36).toUpperCase()}`;

                if (passed) {
                    try {
                        const uId = targetUserId || resolveUserId();
                        const authoritativeCourse = getAuthoritativeCourseName(
                            assessmentId,
                            catalogItem.course_title ||
                                catalogItem.title ||
                                "ISO Course"
                        );
                        markCourseCompleted(uId, assessmentId, {
                            certificate_number: certificateNumber,
                            student_name: targetStudentName || "Verified Learner",
                            course_name: authoritativeCourse,
                            score,
                            total,
                            percentage,
                        });
                    } catch (err) {
                        console.error("Auto complete error:", err);
                    }
                }

                try {
                    sessionStorage.removeItem(answersStorageKey);
                } catch (e) {
                    // Ignore storage error
                }

                navigate(`/result/${assessmentId}`, {
                    state: {
                        userId: targetUserId,
                        score: score,
                        total: total,
                        percentage: percentage,
                        passingPercentage: catalogItem.passing_percentage || 70,
                        passed: passed,
                        certificate: passed,
                        certificate_number: passed ? certificateNumber : null,
                        courseName: getAuthoritativeCourseName(
                            assessmentId,
                            catalogItem.course_title ||
                                catalogItem.title ||
                                "ISO Course"
                        ),
                        studentName: targetStudentName || "Learner",
                        certificationId: assessmentId,
                    },
                });
                return true;
            }

            return false;
        },
        [
            answers,
            assessmentId,
            rawCourseKey,
            assessment,
            answersStorageKey,
            navigate,
        ]
    );

    // =====================================================
    // SUBMIT ASSESSMENT
    // =====================================================

    const submitExam =
        useCallback(
            async () => {

                if (submitting) {
                    return;
                }

                const loggedInUser =
                    getLoggedInUser();

                const userId =
                    Number(
                        loggedInUser?.id ||
                        loggedInUser?.user_id ||
                        loggedInUser?.userId ||
                        resolveUserId() ||
                        13
                    );

                const studentName =
                    loggedInUser?.name ||
                    loggedInUser?.full_name ||
                    loggedInUser?.fullName ||
                    loggedInUser?.username ||
                    loggedInUser?.email ||
                    "Learner";

                try {

                    setSubmitting(
                        true
                    );

                    const submissionAnswers =
                        prepareSubmissionAnswers();

                    console.log(
                        "================================="
                    );

                    console.log(
                        "FINAL ANSWERS:",
                        answers
                    );

                    console.log(
                        "FINAL ANSWER COUNT:",
                        answeredCount
                    );

                    console.log(
                        "TOTAL QUESTIONS:",
                        questions.length
                    );

                    console.log(
                        "SUBMISSION ANSWERS:",
                        submissionAnswers
                    );

                    console.log(
                        "================================="
                    );

                    const submissionData = {
                        user_id:
                            userId,

                        student_name:
                            studentName,

                        certification_id:
                            assessmentId,

                        answers:
                            submissionAnswers,
                    };

                    let response = null;
                    try {
                        response =
                            await submitAssessment(
                                submissionData
                            );

                        console.log(
                            "ASSESSMENT RESPONSE:",
                            response?.data
                        );
                    } catch (apiErr) {
                        console.warn(
                            "Submit Assessment API/Network Error, evaluating with local catalog:",
                            apiErr
                        );
                    }

                    if (
                        response?.data?.success
                    ) {
                        try {
                            sessionStorage.removeItem(
                                answersStorageKey
                            );
                        } catch (e) {
                            // Ignore storage cleanup error
                        }

                        const result =
                            response?.data?.data;

                        // BB_AUTO_COMPLETE_ON_PASS
                        const isPassed = Boolean(response?.data?.passed || result?.result === "pass" || result?.status === "pass" || result?.status === "passed" || result?.passed || result?.certificate || (result?.score !== undefined && result?.total && (Number(result.score) / Number(result.total)) >= 0.7));
                        if (isPassed) {
                            try {
                                const uId = userId || resolveUserId();
                                const authoritativeCourse = getAuthoritativeCourseName(
                                    assessmentId,
                                    result?.course_title || assessment?.course_title || assessment?.title || "ISO Course"
                                );
                                markCourseCompleted(uId, assessmentId, {
                                    certificate_number: result?.certificate_number,
                                    student_name: studentName || "Verified Learner",
                                    course_name: authoritativeCourse,
                                    score: result?.score,
                                    total: result?.total,
                                    percentage: result?.percentage
                                });
                            } catch (err) {
                                console.error("Auto complete error:", err);
                            }
                        }

                        navigate(
                            `/result/${assessmentId}`,
                            {
                                state: {
                                    userId: userId,
                                    score: result?.score,
                                    total: result?.total,
                                    percentage: result?.percentage,
                                    passingPercentage: result?.passing_percentage || 70,
                                    passed: isPassed,
                                    certificate: result?.certificate,
                                    certificate_number: result?.certificate_number,
                                    courseName: getAuthoritativeCourseName(assessmentId, result?.course_title || assessment?.course_title || assessment?.title || "ISO Course"),
                                    studentName: studentName || "Learner",
                                    certificationId: assessmentId,
                                },
                            }
                        );
                        return;
                    }

                    // Fallback to local catalog grading
                    const handledLocally = evaluateLocalGrading(userId, studentName);
                    if (!handledLocally) {
                        alert(
                            response?.data?.message ||
                            "Unable to submit assessment."
                        );
                    }

                } catch (error) {
                    console.warn(
                        "Submit Assessment Error, evaluating with local catalog:",
                        error
                    );

                    const handledLocally = evaluateLocalGrading(userId, studentName);
                    if (!handledLocally) {
                        alert(
                            error?.response?.data?.message ||
                            error?.message ||
                            "Unable to submit assessment."
                        );
                    }

                } finally {

                    setSubmitting(
                        false
                    );
                }

            },
            [
                submitting,
                answers,
                answeredCount,
                questions.length,
                assessmentId,
                assessment,
                answersStorageKey,
                navigate,
                evaluateLocalGrading,
            ]
        );


    // =====================================================
    // TIMER
    // =====================================================

    useEffect(() => {

        if (
            loading ||
            timeLeft === null
        ) {

            return;
        }


        if (timeLeft <= 0) {

            submitExam();

            return;
        }


        const timer =
            setTimeout(
                () => {

                    setTimeLeft(
                        (previousTime) => {

                            if (
                                previousTime === null
                            ) {

                                return previousTime;
                            }


                            return Math.max(
                                previousTime - 1,
                                0
                            );
                        }
                    );

                },
                1000
            );


        return () => {

            clearTimeout(
                timer
            );

        };

    }, [
        timeLeft,
        loading,
        submitExam,
    ]);


    // =====================================================
    // STRICT SEQUENTIAL CHAPTER LOCKING GUARD
    // =====================================================
    const courseProgressRecord = getCourseProgress(resolveUserId(authUser?.id), assessmentId, 4);
    if (!isChapterUnlocked(2, courseProgressRecord)) {
        return (
            <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200 p-8 shadow-xl text-center animate-in fade-in duration-200">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        🔒
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
                        Chapter 2 Locked
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Assessment Prerequisites Incomplete
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                        You must complete the course video in <strong>Chapter 1 — Course Module</strong> before attempting this examination.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate(`/learning/${id}`)}
                        className="w-full py-3.5 bg-[#183B73] hover:bg-[#102B4E] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md"
                    >
                        <span>Return to Chapter 1 Course Module</span>
                    </button>
                </div>
            </div>
        );
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="
                min-h-screen
                bg-[#F4F7FC]
                flex
                items-center
                justify-center
            ">

                <div className="text-center">

                    <div className="
                        w-12
                        h-12
                        border-4
                        border-blue-200
                        border-t-[#2563EB]
                        rounded-full
                        animate-spin
                        mx-auto
                    " />

                    <p className="
                        mt-4
                        text-[#183B73]
                        font-semibold
                    ">
                        Loading Assessment...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="
                min-h-screen
                flex
                flex-col
                items-center
                justify-center
                px-5
            ">

                <h2 className="
                    text-xl
                    font-bold
                    text-red-500
                    text-center
                ">
                    {error}
                </h2>


                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        mt-5
                        bg-[#2563EB]
                        text-white
                        px-6
                        py-3
                        rounded-lg
                        hover:bg-[#183B73]
                        transition
                    "
                >
                    Go Back
                </button>

            </div>
        );
    }


    // =====================================================
    // NO ASSESSMENT
    // =====================================================

    if (!assessment) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                px-5
            ">

                <p className="text-gray-500">
                    Assessment Not Found
                </p>

            </div>
        );
    }


    // =====================================================
    // NO QUESTIONS
    // =====================================================

    if (!questions.length) {

        return (
            <div className="
                min-h-screen
                flex
                flex-col
                items-center
                justify-center
                px-5
            ">

                <h2 className="
                    text-2xl
                    font-bold
                    text-[#183B73]
                ">
                    No Questions Available
                </h2>


                <p className="
                    text-gray-500
                    mt-2
                    text-center
                ">
                    Questions have not been added
                    for this assessment.
                </p>


                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        mt-5
                        bg-[#2563EB]
                        text-white
                        px-6
                        py-3
                        rounded-lg
                        hover:bg-[#183B73]
                        transition
                    "
                >
                    Go Back
                </button>

            </div>
        );
    }


    // =====================================================
    // CURRENT QUESTION
    // =====================================================

    const safeCurrentQuestion =
        Math.min(
            Math.max(
                currentQuestion,
                0
            ),
            questions.length - 1
        );


    const activeQuestion =
        questions[
            safeCurrentQuestion
        ];


    const currentAnswer =
        answers[
            safeCurrentQuestion + 1
        ] ?? "";


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section className="
            bg-[#F4F7FC]
            min-h-screen
            py-8
            md:py-10
        ">

            <div className="
                max-w-7xl
                mx-auto
                px-4
                sm:px-5
                lg:px-6
            ">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    border
                    border-gray-100
                    p-5
                    sm:p-6
                    mb-6
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                ">

                    <div className="min-w-0">

                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-[#183B73]
                            break-words
                        ">
                            {
                                assessment.certification_name
                            }
                        </h1>


                        <p className="
                            text-gray-500
                            mt-2
                            text-sm
                            sm:text-base
                        ">
                            {
                                getAuthoritativeCourseName(assessmentId, assessment.title)
                            }
                        </p>


                        <div className="
                            flex
                            flex-wrap
                            gap-2
                            sm:gap-4
                            mt-4
                            text-sm
                        ">

                            <span className="
                                bg-blue-50
                                text-[#2563EB]
                                px-3
                                py-1.5
                                rounded-lg
                                font-medium
                            ">
                                {questions.length} Questions
                            </span>


                            <span className="
                                bg-blue-50
                                text-[#2563EB]
                                px-3
                                py-1.5
                                rounded-lg
                                font-medium
                            ">
                                {
                                    assessment.duration_minutes
                                } Minutes
                            </span>


                            <span className="
                                bg-green-50
                                text-green-600
                                px-3
                                py-1.5
                                rounded-lg
                                font-medium
                            ">
                                Pass:{" "}
                                {
                                    assessment.passing_percentage
                                }%
                            </span>


                            <span className="
                                bg-gray-50
                                text-gray-600
                                px-3
                                py-1.5
                                rounded-lg
                                font-medium
                            ">
                                Answered:{" "}
                                {answeredCount}
                                /
                                {questions.length}
                            </span>

                        </div>

                    </div>


                    <div className="shrink-0">

                        <Timer
                            timeLeft={
                                timeLeft ?? 0
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    CERTIFICATE ACCESS CODE
                ================================================= */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    border
                    border-gray-100
                    p-5
                    sm:p-6
                    mb-6
                ">

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-6
                    ">

                        <div className="
                            flex
                            items-start
                            gap-4
                            min-w-0
                        ">

                            <div className="
                                w-12
                                h-12
                                shrink-0
                                rounded-xl
                                bg-[#FFF7D6]
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">
                                🎓
                            </div>


                            <div>

                                <h2 className="
                                    text-lg
                                    sm:text-xl
                                    font-bold
                                    text-[#183B73]
                                ">
                                    Have a Certificate
                                    Access Code?
                                </h2>


                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                    leading-6
                                    max-w-xl
                                ">
                                    If you have a valid
                                    certificate access code,
                                    enter it below to skip
                                    the assessment and go
                                    directly to your certificate.
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={
                                handleCertificateCoupon
                            }
                            className="
                                w-full
                                lg:w-[500px]
                                shrink-0
                            "
                        >

                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-2
                            ">

                                <input
                                    type="text"
                                    value={
                                        certificateCoupon
                                    }
                                    onChange={(e) => {

                                        setCertificateCoupon(
                                            e.target.value.toUpperCase()
                                        );

                                        setCertificateCouponError(
                                            ""
                                        );

                                        setCertificateCouponSuccess(
                                            ""
                                        );
                                    }}
                                    placeholder="ENTER CERTIFICATE CODE"
                                    autoComplete="off"
                                    disabled={
                                        certificateCouponLoading
                                    }
                                    className="
                                        flex-1
                                        min-w-0
                                        h-12
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-xl
                                        px-4
                                        text-sm
                                        text-[#183B73]
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        outline-none
                                        focus:border-[#2563EB]
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:bg-gray-100
                                        disabled:cursor-not-allowed
                                    "
                                />


                                <button
                                    type="submit"
                                    disabled={
                                        certificateCouponLoading
                                    }
                                    className="
                                        h-12
                                        px-6
                                        rounded-xl
                                        bg-[#2563EB]
                                        hover:bg-[#183B73]
                                        text-white
                                        text-sm
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        transition
                                        whitespace-nowrap
                                        disabled:opacity-60
                                        disabled:cursor-not-allowed
                                    "
                                >

                                    {certificateCouponLoading ? (

                                        <>
                                            <span className="
                                                w-4
                                                h-4
                                                border-2
                                                border-white/30
                                                border-t-white
                                                rounded-full
                                                animate-spin
                                            " />

                                            Verifying...
                                        </>

                                    ) : (
                                        "Verify Code"
                                    )}

                                </button>

                            </div>


                            {certificateCouponError && (

                                <div className="
                                    mt-3
                                    px-3
                                    py-2.5
                                    rounded-lg
                                    bg-red-50
                                    border
                                    border-red-100
                                    text-red-600
                                    text-xs
                                    sm:text-sm
                                    font-medium
                                ">
                                    {certificateCouponError}
                                </div>

                            )}


                            {certificateCouponSuccess && (

                                <div className="
                                    mt-3
                                    px-3
                                    py-2.5
                                    rounded-lg
                                    bg-green-50
                                    border
                                    border-green-100
                                    text-green-600
                                    text-xs
                                    sm:text-sm
                                    font-semibold
                                ">
                                    {certificateCouponSuccess}
                                </div>

                            )}

                        </form>

                    </div>


                    <div className="
                        mt-5
                        pt-4
                        border-t
                        border-gray-100
                    ">

                        <p className="
                            text-xs
                            text-gray-400
                            leading-5
                        ">
                            Don't have a certificate
                            access code? You can complete
                            the assessment below and receive
                            your certificate after successfully
                            passing the test.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    QUESTIONS + PALETTE
                ================================================= */}

                <div className="
                    grid
                    lg:grid-cols-4
                    gap-6
                ">


                    {/* QUESTION */}

                    <div className="
                        lg:col-span-3
                    ">

                        <QuestionCard
                            question={
                                activeQuestion
                            }

                            questionNumber={
                                safeCurrentQuestion + 1
                            }

                            selectedAnswer={
                                currentAnswer
                            }

                            onSelectAnswer={
                                handleAnswer
                            }
                        />


                        {/* NAVIGATION */}

                        <NavigationButtons
                            currentQuestion={
                                safeCurrentQuestion
                            }

                            totalQuestions={
                                questions.length
                            }

                            onPrevious={() => {

                                setCurrentQuestion(
                                    (previous) =>
                                        Math.max(
                                            previous - 1,
                                            0
                                        )
                                );

                            }}

                            onNext={() => {

                                setCurrentQuestion(
                                    (previous) =>
                                        Math.min(
                                            previous + 1,
                                            questions.length - 1
                                        )
                                );

                            }}

                            onSubmit={
                                submitExam
                            }

                            submitting={
                                submitting
                            }
                        />

                    </div>


                    {/* PALETTE */}

                    <div>

                        <QuestionPalette
                            totalQuestions={
                                questions.length
                            }

                            currentQuestion={
                                safeCurrentQuestion
                            }

                            answers={
                                answers
                            }

                            onQuestionSelect={
                                (index) => {

                                    if (
                                        index >= 0 &&
                                        index < questions.length
                                    ) {

                                        setCurrentQuestion(
                                            index
                                        );

                                    }

                                }
                            }
                        />

                    </div>

                </div>

            </div>

        </section>
    );
};


export default Assignment;