import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";
import toast from "react-hot-toast";

import {
    FaClock,
    FaUsers,
    FaStar,
    FaPlayCircle,
    FaCheckCircle,
    FaProjectDiagram,
    FaChalkboardTeacher,
    FaLaptop,
    FaClipboardList,
    FaExclamationTriangle,
    FaArrowRight,
    FaAward,
    FaBookOpen,
} from "react-icons/fa";

import { getFreeCertification, enrollCourse } from "../api/api";
import { resolveCourse } from "../data/coursesResolver";
import { getAuthoritativeCourseName } from "../data/freeCoursesData";
import { isCourseOnlineAvailable, LAUNCH_STATUS_CONFIG } from "../constants/courseAvailability";

const Enroll = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { requireAuth } = useAuthPrompt();

    // States
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(true); // Pre-checked by default
    const [enrolling, setEnrolling] = useState(false);
    const [enrollError, setEnrollError] = useState("");

    // Fetch Course Details
    useEffect(() => {
        if (!id) {
            setError("Certification ID is missing.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        getFreeCertification(id)
            .then((response) => {
                if (response.data?.success && response.data?.data) {
                    const raw = response.data.data;
                    setCourse({
                        ...raw,
                        name: getAuthoritativeCourseName(raw.id || id, raw.name || raw.title)
                    });
                } else {
                    const found = resolveCourse(id);
                    if (found) {
                        setCourse({
                            id: found.id,
                            name: found.name || found.title,
                            category: found.category,
                            description: found.description || found.short_description,
                            duration: found.duration || "12 Hours",
                            image: found.course_image || found.image,
                            price: found.price || 0,
                            rating: found.rating || 4.9,
                            students: found.students_count || found.students || "2,500+",
                        });
                        setError("");
                    } else {
                        setError(response.data?.message || "Course not found.");
                    }
                }
            })
            .catch(() => {
                const found = resolveCourse(id);
                if (found) {
                    setCourse({
                        id: found.id,
                        name: found.name || found.title,
                        category: found.category,
                        description: found.description || found.short_description,
                        duration: found.duration || "12 Hours",
                        image: found.course_image || found.image,
                        price: found.price || 0,
                        rating: found.rating || 4.9,
                        students: found.students_count || found.students || "2,500+",
                    });
                    setError("");
                } else {
                    setError("Unable to connect to course server.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // Handle Start Course Action
    const handleStartCourse = async () => {
        // Auto-accept terms if clicked
        if (!termsAccepted) {
            setTermsAccepted(true);
        }

        if (!course?.id) {
            toast.error("Course details are loading. Please wait a moment.");
            return;
        }

        if (enrolling) return;

        // Check authentication with Course Login Prompt Modal
        const dest = `/enroll/${course.id}`;
        if (!requireAuth({
            courseId: course.id,
            title: course.name || course.title,
            destination: dest,
        })) {
            return;
        }

        setEnrollError("");

        try {
            setEnrolling(true);
            const numericId = Number(course.id);
            let enrollSuccess = false;

            if (!isNaN(numericId) && numericId > 0) {
                try {
                    const response = await enrollCourse(numericId);
                    const data = response.data;
                    if (data?.success || (data?.message && data.message.toLowerCase().includes("already enrolled"))) {
                        enrollSuccess = true;
                    } else {
                        enrollSuccess = true;
                    }
                } catch (apiErr) {
                    const status = apiErr?.response?.status;
                    if (status === 401) {
                        toast.error("Session expired. Please log in again to continue.");
                        navigate(`/login?redirect=${encodeURIComponent(`/enroll/${course.id}`)}`);
                        setEnrolling(false);
                        return;
                    }
                    enrollSuccess = true;
                }
            } else {
                enrollSuccess = true;
            }

            if (enrollSuccess) {
                try {
                    const enrolled = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
                    if (!enrolled.some((c) => String(c.id) === String(course.id))) {
                        enrolled.push({
                            id: course.id,
                            name: course.name || course.title,
                            category: course.category,
                            enrolledAt: new Date().toISOString(),
                            progress: 0,
                        });
                        localStorage.setItem("bb_enrolled_courses", JSON.stringify(enrolled));
                    }
                } catch (e) {
                    console.error("Local enrollment storage notice:", e);
                }

                toast.success("Course access granted! Launching course player...", {
                    id: "enroll-success-toast",
                    duration: 3000,
                });

                navigate(`/learning/${course.id}`);
            }
        } catch (error) {
            console.error("Enrollment process error:", error);
            setEnrollError(error?.message || "An unexpected error occurred while starting the course.");
        } finally {
            setEnrolling(false);
        }
    };

    
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
            <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center px-5">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#2563EB] rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-[#1E3A66] font-semibold">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center px-5">
                <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-md border border-slate-200">
                    <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        {error || "The requested certification course could not be located."}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/free-courses")}
                        className="mt-6 bg-[#2563EB] hover:bg-[#1E3A66] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer shadow-sm"
                    >
                        Browse Free Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 bg-[#F4F8FF] min-h-screen">
            <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Course Overview & Start */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Course Hero Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
                            
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-[#102B4E] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                    {course.category || "Professional Certification"}
                                </span>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                                    100% Free Access
                                </span>
                                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 flex items-center gap-1">
                                    <FaAward className="text-xs" />
                                    <span>Certificate Included</span>
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A66] leading-tight mb-4">
                                {course.name || course.title}
                            </h1>

                            {/* Description */}
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                {course.description || "Master essential international compliance frameworks, high-level structural requirements, and continuous quality improvement methodologies."}
                            </p>

                            {/* Error notification if any */}
                            {enrollError && (
                                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-start gap-2.5">
                                    <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                                    <span>{enrollError}</span>
                                </div>
                            )}

                            {/* Terms & Conditions Acceptance */}
                            <label className="flex items-start gap-2.5 text-xs text-slate-600 mb-5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    disabled={enrolling}
                                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span>
                                    I agree to the{" "}
                                    <span className="text-[#2563EB] font-semibold underline">
                                        Broadbeach Academy Terms & Conditions
                                    </span>{" "}
                                    and honor code for complimentary accreditation.
                                </span>
                            </label>

                            {/* Action CTA Button */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleStartCourse}
                                    disabled={enrolling}
                                    className="
                                        w-full sm:w-auto sm:min-w-[220px]
                                        h-12 px-6
                                        rounded-xl
                                        font-bold
                                        transition-all duration-200
                                        flex items-center justify-center gap-2.5
                                        bg-[#2563EB] hover:bg-[#1E3A66]
                                        text-white
                                        cursor-pointer
                                        shadow-md hover:shadow-lg
                                        active:scale-98
                                        text-sm
                                    "
                                >
                                    {enrolling ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Starting Course...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Start Course Now</span>
                                            <FaArrowRight className="text-xs" />
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>

                        {/* Course Statistics Pill Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            
                            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-2xs">
                                <FaClock className="mx-auto text-[#2563EB] text-xl mb-2" />
                                <h3 className="font-bold text-lg text-slate-800">
                                    {course.duration || "Self-Paced"}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Course Duration</p>
                            </div>

                            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-2xs">
                                <FaUsers className="mx-auto text-[#2563EB] text-xl mb-2" />
                                <h3 className="font-bold text-lg text-slate-800">
                                    {course.students || "2,500+"}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Enrolled Learners</p>
                            </div>

                            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200/80 shadow-2xs">
                                <FaStar className="mx-auto text-amber-400 text-xl mb-2" />
                                <h3 className="font-bold text-lg text-slate-800">
                                    {course.rating || "4.9"} / 5.0
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Accreditation Rating</p>
                            </div>

                        </div>

                        {/* What You Will Learn Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-2">
                                <FaBookOpen className="text-blue-600 text-lg" />
                                <h3 className="text-lg font-bold text-[#1E3A66]">Learning Outcomes</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {[
                                    "Master international standards and high-level structure (Annex SL).",
                                    "Implement risk-based thinking and process-oriented compliance.",
                                    "Prepare for accredited examination and verifiable digital certification.",
                                    "Practical insights for corporate audits and operational improvements.",
                                ].map((outcome, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="leading-relaxed">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR: Course Card & Terms */}
                    <div className="space-y-6">
                        
                        {/* Course Image Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 lg:sticky lg:top-24 space-y-5">
                            
                            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative">
                                <img
                                    src={course.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"}
                                    alt={course.name || course.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800";
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-[#131E4A]/90 backdrop-blur-xs text-[#FFDB58] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#FFDB58]/30">
                                    Complimentary
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Access Type</span>
                                    <span className="font-bold text-slate-800">1 Year Access</span>
                                </div>
                                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Certificate</span>
                                    <span className="font-bold text-emerald-600">Verifiable Digital PDF</span>
                                </div>
                                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Prerequisites</span>
                                    <span className="font-bold text-slate-800">None (Foundational)</span>
                                </div>
                                <div className="flex items-center justify-between text-xs py-2">
                                    <span className="text-slate-500">Examination</span>
                                    <span className="font-bold text-slate-800">Multiple Choice (70% Pass)</span>
                                </div>
                            </div>

                            {/* Terms Summary Accordion */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-slate-800">
                                    <FaExclamationTriangle className="text-amber-500" />
                                    <span>Program Guidelines</span>
                                </div>
                                <p className="leading-relaxed text-[11px] text-slate-500">
                                    Certificates are issued following course completion and successful passing of the quiz. Enrolment is individual and non-transferable.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default Enroll;
