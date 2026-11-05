import { useState, useEffect, useCallback, useMemo } from "react";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaAward,
    FaRedo,
    FaDownload,
    FaSpinner,
    FaArrowLeft,
    FaCertificate,
    FaCheck,
    FaExternalLinkAlt,
    FaShieldAlt,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getAuthoritativeCourseName } from "../data/freeCoursesData";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability";
import {
    markCourseCompleted,
    getCourseProgress,
    resolveUserId,
    normalizeCourseId,
} from "../utils/progressTracker";
import { useAuth } from "../context/AuthContext";
import { downloadCertificatePDF } from "../utils/certificateGenerator";

const Result = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { user: authUser } = useAuth();

    // Canonical Course ID Resolution
    const rawCourseKey = String(id || "").toLowerCase().trim();
    const canonicalId = Number(
        FREE_COURSE_DB_MAP[rawCourseKey] ||
        normalizeCourseId(rawCourseKey) ||
        (isNaN(Number(id)) ? 0 : Number(id)) ||
        332
    );

    const authoritativeCourseName = getAuthoritativeCourseName(canonicalId);

    // Initial state from location.state or sessionStorage
    const [state, setState] = useState(() => {
        if (location.state && typeof location.state === "object") {
            try {
                sessionStorage.setItem(`assessment_result_${id}`, JSON.stringify(location.state));
                sessionStorage.setItem(`assessment_result_${canonicalId}`, JSON.stringify(location.state));
            } catch (e) {}
            return location.state;
        }
        try {
            const cached =
                sessionStorage.getItem(`assessment_result_${id}`) ||
                sessionStorage.getItem(`assessment_result_${canonicalId}`);
            if (cached) return JSON.parse(cached);
        } catch (e) {}
        return null;
    });

    const [loadingResult, setLoadingResult] = useState(!state);
    const [downloading, setDownloading] = useState(false);
    const [availableCertificates, setAvailableCertificates] = useState([]);
    const [selectedCertIndex, setSelectedCertIndex] = useState(0);

    // User Resolution helper
    const getResolvedStudentName = useCallback(() => {
        if (
            state?.studentName &&
            typeof state.studentName === "string" &&
            state.studentName.trim() &&
            !["learner", "student", "test student", "candidate", "—"].includes(state.studentName.trim().toLowerCase())
        ) {
            return state.studentName.trim();
        }
        if (authUser) {
            const authName =
                authUser.name ||
                authUser.full_name ||
                [authUser.first_name, authUser.last_name].filter(Boolean).join(" ").trim();
            if (authName && authName.trim()) return authName.trim();
        }
        try {
            const raw = localStorage.getItem("bb_user") || localStorage.getItem("user");
            if (raw) {
                const u = JSON.parse(raw);
                const n =
                    u.name ||
                    u.full_name ||
                    [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
                    u.username;
                if (n && n.trim()) return n.trim();
            }
        } catch (e) {}
        return state?.studentName?.trim() || "Verified Learner";
    }, [state?.studentName, authUser]);

    const resolvedStudentName = getResolvedStudentName();

    // =========================================================
    // INTELIGENT RESULT & CERTIFICATE HYDRATION
    // Ensures navigating directly to /result/:id never dead-ends
    // =========================================================
    useEffect(() => {
        const hydrateResultAndCertificates = async () => {
            const u = authUser || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bb_user") || localStorage.getItem("user") || "{}") : {});
            const uId = resolveUserId(u?.id);
            const courseProg = getCourseProgress(uId, canonicalId, 4);

            // 1. Gather all certificate records for this course & learner
            const matchingCerts = [];

            // A. Check localStorage bb_certificates
            try {
                const storedCerts = JSON.parse(localStorage.getItem("bb_certificates") || "[]");
                storedCerts.forEach((c) => {
                    if (
                        Number(c.course_id || c.certification_id) === Number(canonicalId) ||
                        String(c.course_id) === String(id) ||
                        String(c.course_name).toLowerCase().includes(authoritativeCourseName.toLowerCase())
                    ) {
                        matchingCerts.push(c);
                    }
                });
            } catch (e) {}

            // B. Check state / local certificate_number key
            const directCertNo =
                state?.certificate_number ||
                state?.certificate?.certificate_number ||
                localStorage.getItem(`certificate_number_${canonicalId}`) ||
                sessionStorage.getItem(`certificate_number_${canonicalId}`);

            if (directCertNo && !matchingCerts.some((c) => c.certificate_number === directCertNo)) {
                matchingCerts.unshift({
                    certificate_number: directCertNo,
                    student_name: resolvedStudentName,
                    course_name: authoritativeCourseName,
                    score: state?.score || 10,
                    total: state?.total || 10,
                    percentage: state?.percentage || 100,
                    issued_at: new Date().toISOString(),
                    status: "active",
                    verification_status: "Verified",
                    source: "online",
                });
            }

            // C. In mock/dev mode, check admin_store online certificates for course 332 or current user
            try {
                const adminStore = JSON.parse(localStorage.getItem("bb_admin_store") || "{}");
                if (Array.isArray(adminStore?.online_certificates)) {
                    adminStore.online_certificates.forEach((c) => {
                        if (
                            Number(c.course_id) === Number(canonicalId) &&
                            !matchingCerts.some((mc) => mc.certificate_number === c.certificate_number)
                        ) {
                            matchingCerts.push(c);
                        }
                    });
                }
            } catch (e) {}

            setAvailableCertificates(matchingCerts);

            // 2. If state was not provided via router navigation, hydrate from progress or certificates
            if (!state) {
                const hasPassedProgress = Boolean(
                    courseProg?.isCompleted ||
                    courseProg?.assessmentPassed ||
                    (courseProg?.percentage && Number(courseProg.percentage) >= 70) ||
                    matchingCerts.length > 0
                );

                if (hasPassedProgress) {
                    const primaryCert = matchingCerts[0] || {};
                    const hydrated = {
                        score: courseProg?.assessmentScore || primaryCert.score || 10,
                        total: courseProg?.assessmentTotal || primaryCert.total || primaryCert.total_questions || 10,
                        percentage: courseProg?.percentage || primaryCert.percentage || 100,
                        passed: true,
                        certificate_number: primaryCert.certificate_number || directCertNo || `BOA${canonicalId}${uId}101`,
                        studentName: primaryCert.student_name || resolvedStudentName,
                        courseName: authoritativeCourseName,
                        certificationId: canonicalId,
                        userId: uId,
                    };
                    setState(hydrated);
                    try {
                        sessionStorage.setItem(`assessment_result_${id}`, JSON.stringify(hydrated));
                        sessionStorage.setItem(`assessment_result_${canonicalId}`, JSON.stringify(hydrated));
                    } catch (e) {}
                } else {
                    // Learner has not yet passed this course
                    setState({
                        score: 0,
                        total: 10,
                        percentage: 0,
                        passed: false,
                        notAttempted: true,
                        courseName: authoritativeCourseName,
                        certificationId: canonicalId,
                        userId: uId,
                    });
                }
            }

            setLoadingResult(false);
        };

        hydrateResultAndCertificates();
    }, [id, canonicalId, state, authUser, authoritativeCourseName, resolvedStudentName]);

    // Active Certificate selection
    const activeCert = useMemo(() => {
        if (availableCertificates.length > 0) {
            return availableCertificates[selectedCertIndex] || availableCertificates[0];
        }
        return null;
    }, [availableCertificates, selectedCertIndex]);

    // Performance Calculations
    const score = Number(state?.score || 0);
    const total = Number(state?.total || 10);
    const percentage =
        total > 0
            ? Math.round((Number(score) / Number(total)) * 100)
            : Number(state?.percentage || 0);

    const isPassed = Boolean(
        state?.passed !== undefined
            ? state.passed
            : (percentage >= (state?.passingPercentage || 70))
    );

    const wrongAnswers = Math.max(0, total - score);

    // Guaranteed authoritative certificate number
    const finalCertificateNumber =
        activeCert?.certificate_number ||
        state?.certificate_number ||
        state?.certificate?.certificate_number ||
        localStorage.getItem(`certificate_number_${canonicalId}`) ||
        sessionStorage.getItem(`certificate_number_${canonicalId}`) ||
        `BOA${canonicalId}${resolveUserId(authUser?.id)}101`;

    // Automatically synchronize course completion when passing
    useEffect(() => {
        if (isPassed && canonicalId) {
            try {
                const uId = state?.userId || resolveUserId(authUser?.id);
                markCourseCompleted(uId, canonicalId, {
                    certificate_number: finalCertificateNumber,
                    student_name: resolvedStudentName,
                    course_name: authoritativeCourseName,
                    score,
                    total,
                    percentage,
                });
            } catch (e) {
                console.warn("Auto completion sync notice:", e);
            }
        }
    }, [isPassed, canonicalId, state?.userId, authUser?.id, finalCertificateNumber, resolvedStudentName, authoritativeCourseName, score, total, percentage]);

    // =========================================================
    // ACTION 1: VIEW CERTIFICATES
    // Opens certificate viewer (/certificate/:id) with state
    // =========================================================
    const handleViewCertificates = (certToView = null) => {
        if (!isPassed) {
            toast.error("You must pass the assessment with 70% or higher to view the certificate.", {
                icon: "🔒",
            });
            return;
        }

        const targetCert = certToView || activeCert || {};
        const certNumber = targetCert.certificate_number || finalCertificateNumber;

        // Persist certificate details to guarantee uninterrupted rendering on refresh
        try {
            localStorage.setItem(`certificate_number_${canonicalId}`, certNumber);
            sessionStorage.setItem(`certificate_number_${canonicalId}`, certNumber);

            const stored = JSON.parse(localStorage.getItem("bb_certificates") || "[]");
            const existingIdx = stored.findIndex(
                (c) =>
                    c.certificate_number === certNumber ||
                    Number(c.course_id || c.certification_id) === Number(canonicalId)
            );

            const certRecord = {
                certificate_number: certNumber,
                student_name: targetCert.student_name || resolvedStudentName,
                course_name: targetCert.course_name || authoritativeCourseName,
                score: Number(score),
                total: Number(total),
                percentage: Number(percentage),
                issued_at: targetCert.issued_at || new Date().toISOString(),
                course_id: canonicalId,
                certification_id: canonicalId,
                status: "active",
                verification_status: "Verified",
                source: targetCert.source || "online",
            };

            if (existingIdx >= 0) {
                stored[existingIdx] = { ...stored[existingIdx], ...certRecord };
            } else {
                stored.unshift(certRecord);
            }
            localStorage.setItem("bb_certificates", JSON.stringify(stored));
        } catch (e) {}

        const certificatePayload = {
            score: Number(score),
            total: Number(total),
            percentage: Number(percentage),
            studentName: targetCert.student_name || resolvedStudentName,
            courseName: targetCert.course_name || authoritativeCourseName,
            certificate_number: certNumber,
            passed: true,
            certificationId: canonicalId,
        };

        navigate(`/certificate/${canonicalId}`, {
            state: certificatePayload,
        });
    };

    // =========================================================
    // ACTION 2: DOWNLOAD CERTIFICATE (DIRECT HIGH-RES PDF)
    // Downloads official landscape certificate PDF without redirect
    // =========================================================
    const handleDownloadCertificate = async (certToDownload = null) => {
        if (!isPassed) {
            toast.error("Certificate is only available after passing the assessment with 70% or higher.", {
                icon: "⚠️",
            });
            return;
        }

        if (downloading) return;

        try {
            setDownloading(true);
            const toastId = toast.loading("Generating official certificate PDF...");

            const targetCert = certToDownload || activeCert || {};
            const certNumber = targetCert.certificate_number || finalCertificateNumber;
            const candidateName = targetCert.student_name || resolvedStudentName || "Verified Learner";
            const certCourseName = targetCert.course_name || authoritativeCourseName || "Professional Certification";
            const issueDate =
                targetCert.issued_at ||
                targetCert.issue_date ||
                new Date()
                    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                    .toUpperCase();

            // Direct client-side landscape vector PDF download using official template
            const downloadedFileName = await downloadCertificatePDF({
                candidateName,
                courseName: certCourseName,
                certificateNumber: certNumber,
                issueDate,
            });

            // Mark certificate downloaded in course progress
            try {
                const uId = state?.userId || resolveUserId(authUser?.id);
                markCourseCompleted(uId, canonicalId, {
                    certificate_number: certNumber,
                    student_name: candidateName,
                    course_name: certCourseName,
                    certificateDownloaded: true,
                });
            } catch (e) {}

            toast.success(`Certificate downloaded: ${downloadedFileName}`, { id: toastId });
        } catch (err) {
            console.error("Direct Certificate Download Error:", err);
            toast.error("Unable to generate certificate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    // =========================================================
    // ACTION 3: BACK TO COURSE
    // Returns to the exact course learning room
    // =========================================================
    const handleBackToCourse = () => {
        const courseTarget = state?.certificationId || state?.courseId || canonicalId || id || 322;
        navigate(`/learning/${courseTarget}`);
    };

    // Retake assessment handler
    const handleRetakeAssessment = () => {
        navigate(`/assignment/${canonicalId}`);
    };

    // =========================================================
    // LOADING STATE
    // =========================================================
    if (loadingResult) {
        return (
            <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-700">Loading assessment evaluation & certificates...</p>
                </div>
            </div>
        );
    }

    // =========================================================
    // NOT ATTEMPTED STATE (Graceful handling for fresh navigation)
    // =========================================================
    if (state?.notAttempted) {
        return (
            <section className="min-h-screen bg-[#F4F7FC] py-8 sm:py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mx-auto mb-4 text-[#0052CC]">
                            📋
                        </div>
                        <span className="inline-block bg-blue-100 text-[#0052CC] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                            Assessment Status
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] tracking-tight">
                            {authoritativeCourseName}
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-lg mx-auto leading-relaxed">
                            You have not yet completed the examination for this course. Complete the 10-question assessment with a score of 70% or higher to unlock and download your official credential.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={handleRetakeAssessment}
                                className="w-full sm:w-auto px-7 py-3.5 h-12 rounded-xl bg-[#0B1B3D] hover:bg-[#102B4E] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                            >
                                <FaAward className="text-amber-400" />
                                <span>Start Assessment</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleBackToCourse}
                                className="w-full sm:w-auto px-7 py-3.5 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition border border-slate-200 cursor-pointer"
                            >
                                <FaArrowLeft className="text-xs text-slate-500" />
                                <span>Back to Course</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // =========================================================
    // MAIN RESULT VIEW
    // =========================================================
    return (
        <section className="min-h-screen bg-[#F4F7FC] py-6 sm:py-8 lg:py-10 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* =================================================
                    RESULT CARD
                ================================================= */}
                <div id="result-pdf" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header Banner */}
                    <div className={`p-6 sm:p-8 text-center text-white ${isPassed ? "bg-emerald-600" : "bg-rose-600"}`}>
                        {isPassed ? (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-inner">
                                <FaCheckCircle className="text-4xl sm:text-5xl text-white" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-inner">
                                <FaTimesCircle className="text-4xl sm:text-5xl text-white" />
                            </div>
                        )}

                        <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                            {isPassed ? "Examination Verified" : "Assessment Evaluation"}
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-1">
                            {isPassed ? "Congratulations! You Passed" : "Assessment Not Cleared"}
                        </h1>

                        <p className="mt-2 text-sm sm:text-base font-semibold text-white/95 max-w-xl mx-auto">
                            {authoritativeCourseName}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-2 bg-black/20 px-3.5 py-1 rounded-full text-xs text-white/90">
                            <span>Candidate:</span>
                            <span className="font-bold">{resolvedStudentName}</span>
                        </div>
                    </div>

                    {/* Performance Score Grid */}
                    <div className="p-5 sm:p-8 lg:p-10 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                            {/* Score */}
                            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 sm:p-5 text-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                    Final Score
                                </span>
                                <p className="text-3xl sm:text-4xl font-black text-[#0052CC] mt-1">
                                    {score} <span className="text-lg font-semibold text-slate-400">/ {total}</span>
                                </p>
                            </div>

                            {/* Percentage */}
                            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 sm:p-5 text-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                    Percentage
                                </span>
                                <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1">
                                    {percentage}%
                                </p>
                            </div>

                            {/* Result */}
                            <div className={`rounded-2xl p-4 sm:p-5 text-center border ${
                                isPassed ? "bg-emerald-50/70 border-emerald-100" : "bg-rose-50/70 border-rose-100"
                            }`}>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                    Status
                                </span>
                                <p className={`text-2xl sm:text-3xl font-black mt-1.5 ${
                                    isPassed ? "text-emerald-700" : "text-rose-600"
                                }`}>
                                    {isPassed ? "PASSED" : "FAILED"}
                                </p>
                            </div>
                        </div>

                        {/* Performance Details Breakdown */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 sm:p-6">
                            <h2 className="text-base sm:text-lg font-black text-[#0B1B3D] mb-4">
                                Performance Summary
                            </h2>
                            <ul className="divide-y divide-slate-200/80 text-xs sm:text-sm text-slate-700 font-medium">
                                <li className="flex justify-between py-2.5">
                                    <span>Total Exam Questions</span>
                                    <strong className="text-slate-900">{total}</strong>
                                </li>
                                <li className="flex justify-between py-2.5">
                                    <span>Correct Answers</span>
                                    <strong className="text-emerald-600">{score}</strong>
                                </li>
                                <li className="flex justify-between py-2.5">
                                    <span>Incorrect Answers</span>
                                    <strong className="text-rose-600">{wrongAnswers}</strong>
                                </li>
                                <li className="flex justify-between py-2.5">
                                    <span>Passing Threshold</span>
                                    <strong className="text-[#0052CC]">{state?.passingPercentage || 70}%</strong>
                                </li>
                                <li className="flex justify-between py-2.5">
                                    <span>Credential ID</span>
                                    <strong className="font-mono text-[11px] sm:text-xs text-[#0B1B3D] bg-white px-2 py-0.5 rounded border border-slate-200">
                                        {finalCertificateNumber}
                                    </strong>
                                </li>
                            </ul>
                        </div>

                        {/* Status Alert Banner */}
                        {isPassed ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                    <FaAward className="text-xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold text-emerald-900">
                                        Official Credential Issued & Verified
                                    </h3>
                                    <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                                        Your certificate has been registered in the Broadbeach Academy credential registry. You can view or download the high-resolution certificate PDF below.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                                    <FaTimesCircle className="text-xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold text-rose-900">
                                        Passing Score Not Reached
                                    </h3>
                                    <p className="text-xs text-rose-800/90 mt-0.5 leading-relaxed">
                                        A passing score of 70% is required to earn certification. Review the course lecture materials and retake the examination.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* =================================================
                    MULTIPLE CERTIFICATES SELECTOR (IF MULTIPLE EXIST)
                ================================================= */}
                {availableCertificates.length > 1 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs sm:text-sm font-bold text-[#0B1B3D] flex items-center gap-2">
                                <FaCertificate className="text-[#0052CC]" />
                                <span>Available Certificates for this Course ({availableCertificates.length})</span>
                            </h3>
                            <span className="text-[11px] text-slate-500 font-medium">Select a certificate below</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {availableCertificates.map((cert, idx) => (
                                <div
                                    key={cert.certificate_number || idx}
                                    onClick={() => setSelectedCertIndex(idx)}
                                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                                        selectedCertIndex === idx
                                            ? "border-[#0052CC] bg-blue-50/60 shadow-2xs"
                                            : "border-slate-200 hover:border-blue-200 bg-white"
                                    }`}
                                >
                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-[#0B1B3D]">
                                                {cert.certificate_number}
                                            </span>
                                            {selectedCertIndex === idx && (
                                                <span className="bg-[#0052CC] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                                            {cert.student_name} • {cert.training_type || "Online Exam"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewCertificates(cert);
                                            }}
                                            className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                                            title="View Certificate"
                                        >
                                            <FaAward size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadCertificate(cert);
                                            }}
                                            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                                            title="Download Certificate"
                                        >
                                            <FaDownload size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* =================================================
                    THREE CORE ACTION BUTTONS (EXACT LABELS & ORDER)
                    1. View Certificates
                    2. Download Certificate
                    3. Back to Course
                ================================================= */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
                    {isPassed ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            {/* 1. View Certificates */}
                            <button
                                type="button"
                                onClick={() => handleViewCertificates()}
                                className="w-full sm:w-auto px-7 py-3.5 h-12 rounded-xl border-2 border-[#0B1B3D] bg-white hover:bg-[#0B1B3D] text-[#0B1B3D] hover:text-white font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer group"
                            >
                                <FaAward className="text-base text-amber-500 group-hover:text-amber-400" />
                                <span>View Certificates</span>
                            </button>

                            {/* 2. Download Certificate */}
                            <button
                                type="button"
                                onClick={() => handleDownloadCertificate()}
                                disabled={downloading}
                                className="w-full sm:w-auto px-8 py-3.5 h-12 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {downloading ? (
                                    <>
                                        <FaSpinner className="animate-spin text-base" />
                                        <span>Generating Certificate...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaDownload className="text-sm" />
                                        <span>Download Certificate</span>
                                    </>
                                )}
                            </button>

                            {/* 3. Back to Course */}
                            <button
                                type="button"
                                onClick={handleBackToCourse}
                                className="w-full sm:w-auto px-7 py-3.5 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2.5 transition border border-slate-200 cursor-pointer"
                            >
                                <FaArrowLeft className="text-xs text-slate-500" />
                                <span>Back to Course</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            {/* Retake option when failed */}
                            <button
                                type="button"
                                onClick={handleRetakeAssessment}
                                className="w-full sm:w-auto px-7 py-3.5 h-12 rounded-xl bg-[#0052CC] hover:bg-[#0747A6] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer"
                            >
                                <FaRedo className="text-xs" />
                                <span>Retake Assessment</span>
                            </button>

                            {/* Back to Course */}
                            <button
                                type="button"
                                onClick={handleBackToCourse}
                                className="w-full sm:w-auto px-7 py-3.5 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2.5 transition border border-slate-200 cursor-pointer"
                            >
                                <FaArrowLeft className="text-xs text-slate-500" />
                                <span>Back to Course</span>
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Result;
