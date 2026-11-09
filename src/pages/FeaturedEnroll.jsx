import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaPlayCircle,
    FaProjectDiagram,
    FaChalkboardTeacher,
    FaLaptop,
    FaClipboardCheck,
    FaExclamationTriangle,
    FaClock,
    FaUsers,
    FaStar,
} from "react-icons/fa";

import {
    getFeaturedCourse,
} from "../api/api";
import { resolveCourse } from "../data/coursesResolver";
import { isCourseOnlineAvailable, LAUNCH_STATUS_CONFIG } from "../constants/courseAvailability";


const FeaturedEnroll = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [course, setCourse] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [termsAccepted, setTermsAccepted] =
        useState(false);

    const [enrolling, setEnrolling] =
        useState(false);


    // =====================================================
    // FETCH FEATURED COURSE
    // =====================================================

    useEffect(() => {

        const fetchCourse = async () => {

            try {

                setLoading(true);

                setError("");


                console.log(
                    "FEATURED COURSE ID:",
                    id
                );


                const response =
                    await getFeaturedCourse(id);


                console.log(
                    "FEATURED COURSE RESPONSE:",
                    response
                );


                // =================================================
                // AXIOS RESPONSE
                // =================================================

                const responseData =
                    response?.data;


                if (
                    responseData?.success &&
                    responseData?.data
                ) {

                    setCourse(
                        responseData.data
                    );

                } else {
                    const fallback = resolveCourse(id);
                    if (fallback) {
                        setCourse(fallback);
                        setError("");
                    } else {
                        setCourse(null);
                        setError(
                            responseData?.message ||
                            "Featured course not found."
                        );
                    }

                }

            } catch (error) {

                console.warn(
                    "Featured course API offline. Resolving local data:",
                    error?.message
                );

                const fallback = resolveCourse(id);
                if (fallback) {
                    setCourse(fallback);
                    setError("");
                } else {
                    setCourse(null);
                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load featured course."
                    );
                }

            } finally {

                setLoading(false);

            }

        };


        if (id) {

            fetchCourse();

        } else {

            setError(
                "Course ID is missing."
            );

            setLoading(false);

        }

    }, [id]);


    // =====================================================
    // START COURSE
    // =====================================================

    const handleStartCourse = () => {

        if (!termsAccepted) {
            return;
        }

        if (!course?.id) {
            console.error(
                "Featured course ID missing."
            );
            return;
        }

        if (enrolling) {
            return;
        }

        setEnrolling(true);

        try {
            const enrolled = JSON.parse(
                localStorage.getItem("bb_enrolled_courses") || "[]"
            );
            if (!enrolled.some((c) => String(c.id) === String(course.id))) {
                enrolled.push({
                    id: course.id,
                    name: course.name,
                    category: course.category,
                    enrolledAt: new Date().toISOString(),
                    progress: 0,
                });
                localStorage.setItem(
                    "bb_enrolled_courses",
                    JSON.stringify(enrolled)
                );
            }
        } catch (e) {
            console.error("Enrollment local save error:", e);
        }

        navigate(
            `/learning/${course.id}`
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    
    // Guard against direct URL enrollment bypass in Phase 1
    if (!loading && course && !isCourseOnlineAvailable(id, course)) {
        return (
            <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 px-4 py-16">
                <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl">
                        🚀
                    </div>
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 mb-3">
                        {LAUNCH_STATUS_CONFIG.label}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131E4A] mb-3">
                        {course.name || course.title}
                    </h1>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 mb-6 leading-relaxed">
                        {LAUNCH_STATUS_CONFIG.notice}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => navigate(`/courses/${course.id || id}#offline-enquiry-section`)}
                            className="py-3 px-6 rounded-xl font-bold text-sm bg-[#131E4A] text-white hover:bg-[#164C82] transition shadow cursor-pointer"
                        >
                            {LAUNCH_STATUS_CONFIG.cta}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/free-courses")}
                            className="py-3 px-6 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                            Browse Free Online Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {

        return (

            <section
                className="
                    min-h-[700px]
                    bg-[#F5F8FD]
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        text-[#131E4A]
                        text-xl
                        font-semibold
                    "
                >
                    Loading course...
                </div>

            </section>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !course) {

        return (

            <section
                className="
                    min-h-[700px]
                    bg-[#F5F8FD]
                    flex
                    items-center
                    justify-center
                    px-6
                "
            >

                <div
                    className="
                        bg-white
                        rounded-2xl
                        shadow-lg
                        p-10
                        text-center
                        max-w-[600px]
                        w-full
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-[#131E4A]
                            mb-4
                        "
                    >
                        Course Not Found
                    </h2>


                    <p
                        className="
                            text-red-500
                            mb-6
                        "
                    >
                        {error ||
                            "Unable to load this course."
                        }
                    </p>


                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            bg-[#131E4A]
                            text-[#FFDB58]
                            px-6
                            py-3
                            rounded-md
                            font-bold
                            hover:bg-[#F7C600]
                            hover:text-[#131E4A]
                            transition-all
                        "
                    >
                        Go Back
                    </button>

                </div>

            </section>

        );

    }


    return (

        <section
            className="
                bg-[#F5F8FD]
                min-h-screen
                py-10
                lg:py-12
            "
        >

            <div
                className="
                    max-w-[1350px]
                    mx-auto
                    px-5
                    lg:px-8
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1fr_370px]
                        gap-6
                        items-start
                    "
                >

                    {/* =================================================
                        LEFT COURSE SECTION
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            rounded-[22px]
                            overflow-hidden
                            shadow-[0_10px_30px_rgba(15,23,42,0.10)]
                        "
                    >

                        {/* COURSE IMAGE */}

                        <div
                            className="
                                w-full
                                h-[300px]
                                lg:h-[360px]
                                overflow-hidden
                            "
                        >

                            <img
                                src={
                                    course.image
                                }
                                alt={
                                    course.title
                                }
                                className="
                                    w-full
                                    h-full
                                    object-cover
                                "
                            />

                        </div>


                        {/* CONTENT */}

                        <div
                            className="
                                p-7
                                lg:p-8
                            "
                        >

                            {/* BADGES */}

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                    mb-5
                                "
                            >

                                {course.category && (

                                    <span
                                        className="
                                            bg-[#2868D8]
                                            text-white
                                            px-4
                                            py-2
                                            rounded-full
                                            text-[12px]
                                            font-bold
                                        "
                                    >
                                        {course.category}
                                    </span>

                                )}


                                <span
                                    className="
                                        bg-[#D9FBE7]
                                        text-[#16A34A]
                                        px-4
                                        py-2
                                        rounded-full
                                        text-[12px]
                                        font-bold
                                    "
                                >
                                    FEATURED
                                </span>

                            </div>


                            {/* TITLE */}

                            <h1
                                className="
                                    text-[32px]
                                    lg:text-[38px]
                                    font-bold
                                    text-[#131E4A]
                                    leading-[1.25]
                                "
                            >
                                {course.title}
                            </h1>


                            {/* DESCRIPTION */}

                            <p
                                className="
                                    mt-5
                                    text-[16px]
                                    text-[#52627A]
                                    leading-[1.8]
                                "
                            >
                                {course.description}
                            </p>


                            {/* TERMS */}

                            <div
                                className="
                                    mt-7
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={
                                        termsAccepted
                                    }
                                    onChange={(e) =>
                                        setTermsAccepted(
                                            e.target.checked
                                        )
                                    }
                                    className="
                                        mt-1
                                        w-4
                                        h-4
                                        cursor-pointer
                                    "
                                />


                                <label
                                    htmlFor="terms"
                                    className="
                                        text-[14px]
                                        text-[#52627A]
                                        cursor-pointer
                                    "
                                >
                                    I have read and agree
                                    to all{" "}

                                    <span
                                        className="
                                            text-[#2168D8]
                                            font-semibold
                                        "
                                    >
                                        Terms & Conditions
                                    </span>
                                </label>

                            </div>


                            {/* START BUTTON */}

                            <button
                                type="button"
                                onClick={
                                    handleStartCourse
                                }
                                disabled={
                                    !termsAccepted || enrolling
                                }
                                className={`
                                    mt-5
                                    px-8
                                    py-3
                                    rounded-md
                                    font-bold
                                    text-[15px]
                                    transition-all
                                    duration-300
                                    flex
                                    items-center
                                    gap-2
                                    ${
                                        termsAccepted && !enrolling
                                            ? `
                                                bg-[#131E4A]
                                                text-[#FFDB58]
                                                hover:bg-[#F7C600]
                                                hover:text-[#131E4A]
                                                cursor-pointer
                                            `
                                            : `
                                                bg-gray-300
                                                text-gray-500
                                                cursor-not-allowed
                                            `
                                    }
                                `}
                            >
                                {enrolling ? "Starting Course..." : "Start Course"}
                            </button>


                            {/* =================================================
                                COURSE STATS
                            ================================================= */}

                            <div
                                className="
                                    mt-8
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-3
                                    gap-4
                                "
                            >

                                {/* DURATION */}

                                <div
                                    className="
                                        bg-[#EEF5FF]
                                        rounded-xl
                                        px-5
                                        py-5
                                        text-center
                                    "
                                >

                                    <FaClock
                                        className="
                                            mx-auto
                                            text-[#2868D8]
                                            text-xl
                                            mb-3
                                        "
                                    />

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            text-[#111827]
                                        "
                                    >
                                        {course.duration ||
                                            "Self Paced"
                                        }
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Duration
                                    </p>

                                </div>


                                {/* STUDENTS */}

                                <div
                                    className="
                                        bg-[#EEF5FF]
                                        rounded-xl
                                        px-5
                                        py-5
                                        text-center
                                    "
                                >

                                    <FaUsers
                                        className="
                                            mx-auto
                                            text-[#2868D8]
                                            text-xl
                                            mb-3
                                        "
                                    />

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            text-[#111827]
                                        "
                                    >
                                        {course.students || 0}
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Students
                                    </p>

                                </div>


                                {/* RATING */}

                                <div
                                    className="
                                        bg-[#EEF5FF]
                                        rounded-xl
                                        px-5
                                        py-5
                                        text-center
                                    "
                                >

                                    <FaStar
                                        className="
                                            mx-auto
                                            text-[#F7C600]
                                            text-xl
                                            mb-3
                                        "
                                    />

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            text-[#111827]
                                        "
                                    >
                                        {course.rating || 0}
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Rating
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT COURSE INFORMATION
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            rounded-[22px]
                            shadow-[0_10px_30px_rgba(15,23,42,0.10)]
                            p-6
                        "
                    >

                        <h2
                            className="
                                text-[24px]
                                font-bold
                                text-[#233F70]
                                mb-6
                            "
                        >
                            Course Information
                        </h2>


                        {/* COURSE MATERIALS */}

                        <div
                            className="
                                bg-[#EEF5FF]
                                rounded-xl
                                p-4
                                mb-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-4
                                "
                            >

                                <FaPlayCircle
                                    className="
                                        text-[#2868D8]
                                        text-xl
                                        mt-1
                                    "
                                />

                                <div>

                                    <h3
                                        className="
                                            font-bold
                                            text-[#233F70]
                                        "
                                    >
                                        Course Materials
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-[12px]
                                            text-gray-500
                                        "
                                    >
                                        Video lectures, PDFs,
                                        quizzes and downloadable
                                        resources.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* PRACTICAL PROJECTS */}

                        <div
                            className="
                                bg-[#EEF5FF]
                                rounded-xl
                                p-4
                                mb-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-4
                                "
                            >

                                <FaProjectDiagram
                                    className="
                                        text-[#2868D8]
                                        text-xl
                                        mt-1
                                    "
                                />

                                <div>

                                    <h3
                                        className="
                                            font-bold
                                            text-[#233F70]
                                        "
                                    >
                                        Practical Projects
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-[12px]
                                            text-gray-500
                                        "
                                    >
                                        Real-world projects
                                        for portfolio building.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* INSTRUCTOR */}

                        <div
                            className="
                                bg-[#EEF5FF]
                                rounded-xl
                                p-4
                                mb-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-4
                                "
                            >

                                <FaChalkboardTeacher
                                    className="
                                        text-[#2868D8]
                                        text-xl
                                        mt-1
                                    "
                                />

                                <div>

                                    <h3
                                        className="
                                            font-bold
                                            text-[#233F70]
                                        "
                                    >
                                        Instructor Support
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-[12px]
                                            text-gray-500
                                        "
                                    >
                                        Dedicated instructor
                                        guidance throughout
                                        the course.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* DEVICE ACCESS */}

                        <div
                            className="
                                bg-[#EEF5FF]
                                rounded-xl
                                p-4
                                mb-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-4
                                "
                            >

                                <FaLaptop
                                    className="
                                        text-[#2868D8]
                                        text-xl
                                        mt-1
                                    "
                                />

                                <div>

                                    <h3
                                        className="
                                            font-bold
                                            text-[#233F70]
                                        "
                                    >
                                        Multi Device Access
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-[12px]
                                            text-gray-500
                                        "
                                    >
                                        Learn on desktop,
                                        tablet and mobile.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ASSESSMENTS */}

                        <div
                            className="
                                bg-[#EEF5FF]
                                rounded-xl
                                p-4
                                mb-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-4
                                "
                            >

                                <FaClipboardCheck
                                    className="
                                        text-[#2868D8]
                                        text-xl
                                        mt-1
                                    "
                                />

                                <div>

                                    <h3
                                        className="
                                            font-bold
                                            text-[#233F70]
                                        "
                                    >
                                        Assessments
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-[12px]
                                            text-gray-500
                                        "
                                    >
                                        Assignments and quizzes
                                        are included.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* TERMS */}

                        <div
                            className="
                                bg-[#EEF5FF]
                                rounded-xl
                                p-4
                                mt-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-3
                                "
                            >

                                <FaExclamationTriangle
                                    className="
                                        text-[#F2B900]
                                        mt-1
                                    "
                                />

                                <h3
                                    className="
                                        font-bold
                                        text-[#233F70]
                                    "
                                >
                                    Terms & Conditions
                                </h3>

                            </div>


                            <ul
                                className="
                                    mt-3
                                    ml-5
                                    list-disc
                                    space-y-2
                                    text-[12px]
                                    text-gray-600
                                "
                            >

                                <li>
                                    Course access is
                                    personal and
                                    non-transferable.
                                </li>

                                <li>
                                    Sharing login
                                    credentials is
                                    prohibited.
                                </li>

                                <li>
                                    Certificate available
                                    after successful
                                    completion.
                                </li>

                                <li>
                                    Assignments must be
                                    submitted before
                                    certification.
                                </li>

                                <li>
                                    Course enrollment is
                                    subject to the
                                    applicable terms.
                                </li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};


export default FeaturedEnroll;