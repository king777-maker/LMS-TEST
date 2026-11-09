import {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    FaBookOpen,
    FaPlay,
    FaCheckCircle,
    FaCalendarAlt,
    FaAward,
} from "react-icons/fa";

import {
    getMyCourses,
} from "../api/api";

import SEO from "../components/common/SEO";
import Breadcrumbs from "../components/common/Breadcrumbs";
import CourseCardSkeleton from "../components/common/CourseCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getCourseProgress } from "../utils/progressTracker";
import { getAuthoritativeCourseName } from "../data/freeCoursesData";


const MyCourses = () => {
    const { user } = useAuth();

    // =========================================================
    // STATE
    // =========================================================

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // LOAD COURSES
    // =========================================================

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError("");

            let apiCourses = [];
            try {
                const response = await getMyCourses();
                const result = response?.data;
                if (result?.success && Array.isArray(result?.data)) {
                    apiCourses = result.data;
                }
            } catch (apiError) {
                console.warn("MyCourses: Remote course API unavailable. Using local enrolled courses:", apiError?.message);
            }

            // 1. Read local enrollments
            let localEnrolled = [];
            try {
                localEnrolled = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
            } catch (e) {}

            // 2. Read earned certificates
            let certCourses = [];
            try {
                const certs = JSON.parse(localStorage.getItem("bb_certificates") || "[]");
                certCourses = certs.map((c) => {
                    const cId = Number(c.certification_id || c.course_id || c.id || 322);
                    return {
                        id: cId,
                        certification_id: cId,
                        course_name: getAuthoritativeCourseName(cId, c.course_name),
                        status: "Completed",
                        completed: true,
                        enrolled_at: c.completed_at || c.issued_at || c.created_at || new Date().toISOString(),
                    };
                });
            } catch (e) {}

            // 3. Scan active progress records
            const progressCourses = [];
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith("bb_course_progress_")) {
                        const raw = localStorage.getItem(key);
                        if (raw) {
                            const parsed = JSON.parse(raw);
                            const cId = Number(parsed.courseId || 0);
                            if (cId > 0 && (parsed.completedCount > 0 || parsed.percentage > 0 || parsed.isCompleted)) {
                                progressCourses.push({
                                    id: cId,
                                    certification_id: cId,
                                    course_name: getAuthoritativeCourseName(cId),
                                    status: parsed.isCompleted ? "Completed" : "In Progress",
                                    completed: Boolean(parsed.isCompleted),
                                    enrolled_at: parsed.updatedAt || new Date().toISOString(),
                                });
                            }
                        }
                    }
                }
            } catch (e) {}

            // 4. Merge and deduplicate by canonical course ID
            const courseMap = new Map();
            [...apiCourses, ...localEnrolled, ...certCourses, ...progressCourses].forEach((c) => {
                const rawId = c?.certification_id ?? c?.course_id ?? c?.id;
                const cId = Number(rawId || 0);
                if (cId > 0 && !courseMap.has(cId)) {
                    courseMap.set(cId, {
                        ...c,
                        id: cId,
                        certification_id: cId,
                        course_name: getAuthoritativeCourseName(cId, c.course_name || c.name || c.title),
                    });
                }
            });

            const mergedCourses = Array.from(courseMap.values());
            setCourses(mergedCourses);
        } catch (error) {
            console.error("My Courses Error:", error);
            setError("Unable to load courses. Please refresh the page.");
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();

        // Listen for real-time progress & completion updates
        const handleProgressUpdate = () => {
            loadCourses();
        };

        window.addEventListener("bb_progress_updated", handleProgressUpdate);
        return () => {
            window.removeEventListener("bb_progress_updated", handleProgressUpdate);
        };
    }, []);


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "N/A";
        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section
                className="
                    min-h-screen
                    bg-[#F4F7FC]
                    py-12
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >
                <div className="max-w-[1250px] mx-auto">
                    <div className="h-8 w-48 bg-slate-200 rounded mb-8 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CourseCardSkeleton />
                        <CourseCardSkeleton />
                        <CourseCardSkeleton />
                    </div>
                </div>

            </section>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <section
            className="
                min-h-screen
                bg-[#F4F7FC]
                py-8
                sm:py-10
            "
        >
            <SEO
                title="My Enrolled Courses & Certifications"
                description="Access your active enrollments, resume lecture modules, and track certificate progress."
                noIndex={true}
            />
            <Breadcrumbs items={[{ name: "My Profile", url: "/my-profile" }, { name: "My Courses" }]} />

            <div
                className="
                    max-w-[1250px]
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#2563EB]
                                text-white
                                flex
                                items-center
                                justify-center
                                shadow-sm
                            "
                        >

                            <FaBookOpen />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-2xl
                                    sm:text-3xl
                                    font-bold
                                    text-[#183B73]
                                "
                            >
                                My Courses
                            </h1>


                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-1
                                "
                            >
                                Continue your learning journey
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="
                            mb-6
                            p-4
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            text-red-600
                            text-sm
                        "
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!error &&
                    courses.length === 0 && (

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <EmptyState
                                icon={<FaBookOpen className="text-2xl text-[#131E4A]" />}
                                title="No Enrolled Courses Yet"
                                description="You have not enrolled in any professional certification courses. Explore our accredited catalog to get certified."
                                actionText="Explore Certification Catalog"
                                actionLink="/course"
                            />
                        </div>

                    )}


                {/* =================================================
                    COURSES
                ================================================= */}

                {courses.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            lg:grid-cols-2
                            gap-6
                        "
                    >

                        {courses.map((course, index) => {

                            const courseId =
                                course?.certification_id ??
                                course?.course_id ??
                                course?.id;


                            return (

                                <div
                                    key={
                                        course?.id ??
                                        courseId ??
                                        index
                                    }
                                    className="
                                        bg-white
                                        rounded-2xl
                                        overflow-hidden
                                        border
                                        border-gray-100
                                        shadow-[0_8px_30px_rgba(15,23,42,0.08)]
                                        hover:shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                                        transition-all
                                        duration-300
                                    "
                                >


                                    {/* =========================================
                                        COURSE HEADER
                                    ========================================== */}

                                    <div
                                        className="
                                            relative
                                            h-[190px]
                                            overflow-hidden
                                            bg-gradient-to-br
                                            from-[#131E4A]
                                            to-[#2563EB]
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >

                                        {/* BACKGROUND DECORATION */}

                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                opacity-10
                                                pointer-events-none
                                            "
                                        >

                                            <div
                                                className="
                                                    absolute
                                                    -top-10
                                                    -right-10
                                                    w-48
                                                    h-48
                                                    rounded-full
                                                    bg-white
                                                "
                                            />

                                            <div
                                                className="
                                                    absolute
                                                    -bottom-20
                                                    -left-16
                                                    w-56
                                                    h-56
                                                    rounded-full
                                                    bg-white
                                                "
                                            />

                                        </div>


                                        {/* COURSE ICON */}

                                        <FaBookOpen
                                            className="
                                                relative
                                                z-10
                                                text-[85px]
                                                text-white/20
                                            "
                                        />


                                        {/* COURSE LABEL */}

                                        <span
                                            className="
                                                absolute
                                                bottom-4
                                                left-5
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-white/15
                                                text-white
                                                text-xs
                                                font-semibold
                                                backdrop-blur-sm
                                            "
                                        >
                                            My Course
                                        </span>

                                    </div>


                                    {/* =========================================
                                        CONTENT
                                    ========================================== */}

                                    <div
                                        className="
                                            p-5
                                            sm:p-6
                                        "
                                    >

                                        {/* COURSE NAME */}

                                        <h2
                                            className="
                                                text-lg
                                                sm:text-xl
                                                font-bold
                                                text-[#183B73]
                                                leading-snug
                                            "
                                        >
                                            {getAuthoritativeCourseName(
                                                courseId,
                                                course?.course_name ||
                                                course?.courseName ||
                                                course?.certification_name ||
                                                course?.name ||
                                                course?.title ||
                                                "Course"
                                            )}
                                        </h2>


                                        {/* =====================================
                                            DETAILS
                                        ====================================== */}

                                        <div
                                            className="
                                                mt-5
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-5
                                                text-sm
                                                text-gray-500
                                            "
                                        >

                                            {/* ENROLLED DATE */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <FaCalendarAlt
                                                    className="
                                                        text-[#2563EB]
                                                    "
                                                />

                                                <span>
                                                    Enrolled{" "}
                                                    {formatDate(
                                                        course?.enrolled_at ||
                                                        course?.enrollment_date ||
                                                        course?.enrolledAt
                                                    )}
                                                </span>

                                            </div>


                                            {/* STATUS */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <FaCheckCircle
                                                    className="
                                                        text-green-500
                                                    "
                                                />

                                                {(() => {
                                                    const currentUserId = user?.id || 13;
                                                    const prog = getCourseProgress(currentUserId, courseId);
                                                    const isDone = Boolean(
                                                        course?.status?.toLowerCase() === "completed" ||
                                                        course?.completed ||
                                                        prog?.isCompleted ||
                                                        prog?.percentage === 100
                                                    );
                                                    return (
                                                        <span
                                                            className={`capitalize font-medium ${isDone ? "text-emerald-700 font-semibold" : "text-gray-700"}`}
                                                        >
                                                            {isDone ? "Completed" : (course?.status || "In Progress")}
                                                        </span>
                                                    );
                                                })()}

                                            </div>

                                        </div>


                                        {/* =====================================
                                            COURSE ID & PROGRESS
                                        ====================================== */}
                                        {(() => {
                                            const currentUserId = user?.id || 13;
                                            const prog = getCourseProgress(currentUserId, courseId);
                                            // Unified source of truth: backend course completion flag OR local progressTracker completion
                                            const isDone = Boolean(
                                                course?.completed ||
                                                course?.status?.toLowerCase() === "completed" ||
                                                prog?.isCompleted ||
                                                prog?.percentage === 100 ||
                                                Boolean(course?.certificate_id || course?.certificate_number)
                                            );
                                            const completedChapters = isDone ? (prog?.totalCount || 5) : (prog?.completedCount || 0);
                                            const totalChapters = prog?.totalCount || 5;
                                            const percent = isDone ? 100 : (prog?.percentage || 0);

                                            return (
                                                <div className="mt-4 space-y-3">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-500 font-medium">Chapters: {completedChapters} / {totalChapters}</span>
                                                        <span className={`font-semibold ${isDone ? "text-emerald-600" : "text-blue-600"}`}>
                                                            {isDone ? "100% (5/5 chapters)" : `${percent}% (${completedChapters}/${totalChapters} chapters)`}
                                                        </span>
                                                    </div>

                                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 ${isDone ? "bg-emerald-500" : "bg-blue-600"}`}
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>

                                                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                                                        <Link
                                                            to={`/learning/${courseId}`}
                                                            className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded-[10px] bg-[#0052CC] hover:bg-[#0747A6] px-4 text-xs sm:text-[13px] font-semibold text-white transition-all shadow-xs active:scale-[0.98] select-none"
                                                        >
                                                            <FaPlay className="text-[10px]" />
                                                            <span>{isDone ? "Review Course" : "Continue Learning"}</span>
                                                        </Link>

                                                        {isDone && (
                                                            <Link
                                                                to={`/certificate/${courseId}`}
                                                                className="h-[42px] flex items-center justify-center gap-2 rounded-[10px] bg-amber-400 hover:bg-amber-300 px-4 text-xs sm:text-[13px] font-bold text-[#07162C] transition-all shadow-xs active:scale-[0.98] select-none shrink-0"
                                                            >
                                                                <FaAward className="text-sm" />
                                                                <span>Certificate</span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </section>

    );

};


export default MyCourses;