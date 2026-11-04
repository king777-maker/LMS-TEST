import fs from "fs";
import path from "path";

const learningPath = path.resolve("src/pages/Learning.jsx");

const newLearningContent = `import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp,
    FaDownload,
    FaPlay,
    FaClipboardCheck,
    FaAward,
    FaLock,
    FaBars,
    FaTimes,
    FaBookOpen,
    FaArrowRight,
    FaArrowLeft,
    FaExternalLinkAlt,
    FaFilePdf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { useAuth } from "../context/AuthContext";
import {
    getFreeCertification,
    getCourseLessons,
    getLessonResources,
    redeemCertificateCoupon,
} from "../api/api";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability";
import { getCourseVideo, resolveVideoEmbedUrl } from "../constants/courseVideoCatalog";
import { getAuthoritativeCourseName, freeCoursesData } from "../data/freeCoursesData";
import {
    getCourseProgress,
    toggleLessonCompleted,
    markCourseCompleted,
    resolveUserId,
    normalizeCourseId,
    recordExamBypass,
    isChapterUnlocked,
    getChapterLockReason,
} from "../utils/progressTracker";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DEFAULT_SLIDES = [
    {
        id: "slides-intro",
        title: "Course Introduction & Foundation Deck",
        fileName: "introduction.pdf",
        url: "https://cadac.in/broadbeachlearning.com/broadbeach-backend/uploads/slides/introduction.pdf",
        size: "553 KB",
    },
    {
        id: "slides-ch2",
        title: "Core Requirements & Methodology Manual",
        fileName: "Chapter2.pdf",
        url: "https://cadac.in/broadbeachlearning.com/broadbeach-backend/uploads/slides/Chapter2.pdf",
        size: "11.5 MB",
    },
    {
        id: "slides-ch3",
        title: "Operational Control & Continual Improvement Handbook",
        fileName: "Chapter3.pdf",
        url: "https://cadac.in/broadbeachlearning.com/broadbeach-backend/uploads/slides/Chapter3.pdf",
        size: "320 KB",
    },
];

const Learning = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    // Canonical Course ID Resolution
    const rawCourseKey = String(id || "").toLowerCase().trim();
    const canonicalId = Number(
        FREE_COURSE_DB_MAP[rawCourseKey] ||
        normalizeCourseId(rawCourseKey) ||
        (isNaN(Number(id)) ? 0 : Number(id)) ||
        322
    );

    // User Resolution
    const user = authUser || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bb_user") || localStorage.getItem("user") || "{}") : {});
    const userId = resolveUserId(user?.id);

    // Course Metadata
    const staticCourse = freeCoursesData.find(
        (c) =>
            String(c.id) === String(canonicalId) ||
            String(c.altId) === String(canonicalId) ||
            String(c.id) === String(id) ||
            String(c.slug).toLowerCase() === rawCourseKey ||
            String(c.altSlug || "").toLowerCase() === rawCourseKey
    );
    const authoritativeName = getAuthoritativeCourseName(canonicalId) || staticCourse?.title || "Professional Certification";

    // State
    const [course, setCourse] = useState(staticCourse || { id: canonicalId, name: authoritativeName, title: authoritativeName });
    const [loading, setLoading] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    // Active Chapter (1 = Course Module, 2 = Assessment, 3 = Training Material, 4 = Download Certificate)
    const [activeChapter, setActiveChapter] = useState(1);
    const [activeSubLesson, setActiveSubLesson] = useState(0);

    // Progress
    const [progress, setProgress] = useState(() => getCourseProgress(userId, canonicalId, 4));

    // Video Resolution
    const courseVideoMeta = getCourseVideo(canonicalId);
    const videoEmbedUrl = courseVideoMeta?.embedUrl || resolveVideoEmbedUrl("", canonicalId);

    // Slides & PDF Viewer State
    const [showSlidesViewer, setShowSlidesViewer] = useState(false);
    const [activeSlideDoc, setActiveSlideDoc] = useState(DEFAULT_SLIDES[0]);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState("");
    const canvasRef = useRef(null);

    // Certificate Access Code State
    const [accessCode, setAccessCode] = useState("");
    const [accessCodeLoading, setAccessCodeLoading] = useState(false);
    const [accessCodeError, setAccessCodeError] = useState("");
    const [accessCodeSuccess, setAccessCodeSuccess] = useState("");

    // Refresh progress helper
    const refreshProgress = useCallback(() => {
        const p = getCourseProgress(userId, canonicalId, 4);
        setProgress(p);
    }, [userId, canonicalId]);

    // Listen to real-time progress updates
    useEffect(() => {
        refreshProgress();
        const handleUpdate = (e) => {
            if (!e.detail?.courseId || String(e.detail.courseId) === String(canonicalId)) {
                refreshProgress();
            }
        };
        window.addEventListener("bb_course_progress_updated", handleUpdate);
        return () => window.removeEventListener("bb_course_progress_updated", handleUpdate);
    }, [canonicalId, refreshProgress]);

    // Initial course load
    useEffect(() => {
        let isMounted = true;
        const loadCourseData = async () => {
            try {
                setLoading(true);
                const res = await getFreeCertification(canonicalId);
                if (isMounted && res?.data) {
                    const cData = res.data;
                    setCourse({
                        ...cData,
                        id: canonicalId,
                        name: authoritativeName,
                        title: authoritativeName,
                    });
                }
            } catch (err) {
                // Silently fallback to authoritative catalog
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadCourseData();
        return () => {
            isMounted = false;
        };
    }, [canonicalId, authoritativeName]);

    // Chapter 1 Sub-Lessons Definition (In-Workspace Navigation Only)
    const ch1Lessons = [
        {
            id: 1,
            lesson_id: "lsn-1",
            title: \`Foundations & Strategic Scope of \${authoritativeName}\`,
            duration: "45 Mins",
            topics: staticCourse?.curriculum?.[0]?.lessons || [
                "Harmonized High-Level Structure (HLS) & Global Scope",
                "Context of the Organization, Interested Parties & Scope Definition",
                "Leadership Commitment, Quality Policy & Organizational Roles"
            ],
            videoUrl: videoEmbedUrl,
        },
        {
            id: 2,
            lesson_id: "lsn-2",
            title: "Core Requirements, Operational Planning & Risk Alignment",
            duration: "1 Hour 15 Mins",
            topics: staticCourse?.curriculum?.[1]?.lessons || [
                "Actions to Address Risks & Opportunities (Risk-Based Thinking)",
                "Resource Management, Competence, Awareness & Documented Information",
                "Operational Planning, Execution Control & Process Performance Monitoring"
            ],
            videoUrl: videoEmbedUrl,
        },
        {
            id: 3,
            lesson_id: "lsn-3",
            title: "Performance Evaluation, Continual Improvement & Audit Readiness",
            duration: "45 Mins",
            topics: staticCourse?.curriculum?.[2]?.lessons || [
                "Monitoring, Measurement, Analysis & Comprehensive Evaluation",
                "Internal Audit Program, Audit Evidence & Non-Conformity Management",
                "Management Review Inputs/Outputs & Continual Improvement Methodologies"
            ],
            videoUrl: videoEmbedUrl,
        },
    ];

    // Toggle sub-lesson completion
    const handleToggleSubLesson = (lessonId) => {
        toggleLessonCompleted(userId, canonicalId, lessonId, 4);
        refreshProgress();
    };

    // Check unlocking conditions
    const isCh2Unlocked = isChapterUnlocked(2, progress);
    const isCh3Unlocked = isChapterUnlocked(3, progress);
    const isCh4Unlocked = isChapterUnlocked(4, progress);

    const ch2LockReason = getChapterLockReason(2, progress);
    const ch3LockReason = getChapterLockReason(3, progress);
    const ch4LockReason = getChapterLockReason(4, progress);

    // PDF Slides rendering logic
    const renderPdfPage = useCallback(async (doc, pNum) => {
        if (!doc || !canvasRef.current) return;
        try {
            setPdfLoading(true);
            const page = await doc.getPage(pNum);
            const viewport = page.getViewport({ scale: 1.25 });
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            setPdfLoading(false);
        } catch (err) {
            console.error("PDF render error:", err);
            setPdfError("Unable to render presentation slide.");
            setPdfLoading(false);
        }
    }, []);

    const openSlidesViewer = async (doc) => {
        setActiveSlideDoc(doc);
        setShowSlidesViewer(true);
        setPdfLoading(true);
        setPdfError("");
        try {
            const loaded = await pdfjsLib.getDocument(doc.url).promise;
            setPdfDoc(loaded);
            setNumPages(loaded.numPages);
            setPageNum(1);
            await renderPdfPage(loaded, 1);
        } catch (e) {
            console.error("Failed to load PDF:", e);
            setPdfError("Direct PDF viewer unavailable. Please use the direct download button.");
            setPdfLoading(false);
        }
    };

    const handleNextSlide = () => {
        if (pdfDoc && pageNum < numPages) {
            const next = pageNum + 1;
            setPageNum(next);
            renderPdfPage(pdfDoc, next);
        }
    };

    const handlePrevSlide = () => {
        if (pdfDoc && pageNum > 1) {
            const prev = pageNum - 1;
            setPageNum(prev);
            renderPdfPage(pdfDoc, prev);
        }
    };

    // Certificate Access Code verification handler
    const handleAccessCode = async (e) => {
        e.preventDefault();
        setAccessCodeError("");
        setAccessCodeSuccess("");

        const code = accessCode.trim().toUpperCase();
        if (!code) {
            setAccessCodeError("Please enter valid Access code for corporate and Classroom Exams.");
            return;
        }

        if (!userId) {
            setAccessCodeError("Please login before verifying your access code.");
            return;
        }

        try {
            setAccessCodeLoading(true);
            const response = await redeemCertificateCoupon({
                code,
                user_id: userId,
                certification_id: canonicalId,
            });

            if (!response?.data?.success) {
                setAccessCodeError(response?.data?.message || "Invalid access code. Please verify corporate or classroom credentials.");
                return;
            }

            setAccessCodeSuccess("Access code verified! Unlocking credential...");
            recordExamBypass(userId, canonicalId, response?.data || {});
            refreshProgress();

            setTimeout(() => {
                navigate(\`/certificate/\${canonicalId}\`);
            }, 600);
        } catch (err) {
            setAccessCodeError(err?.response?.data?.message || "Invalid access code. Please verify corporate or classroom credentials.");
        } finally {
            setAccessCodeLoading(false);
        }
    };

    // Navigation between chapters
    const handleSelectChapter = (chNum) => {
        if (chNum === 1) {
            setActiveChapter(1);
            setMobileDrawerOpen(false);
        } else if (chNum === 2) {
            if (isCh2Unlocked) {
                setActiveChapter(2);
                setMobileDrawerOpen(false);
            } else {
                toast.error(ch2LockReason || "Complete Chapter 1 to unlock the Assessment.");
            }
        } else if (chNum === 3) {
            if (isCh3Unlocked) {
                setActiveChapter(3);
                setMobileDrawerOpen(false);
            } else {
                toast.error(ch3LockReason || "Pass the Assessment to unlock Training Materials.");
            }
        } else if (chNum === 4) {
            if (isCh4Unlocked) {
                setActiveChapter(4);
                setMobileDrawerOpen(false);
            } else {
                toast.error(ch4LockReason || "Pass the Assessment to unlock Certificate Download.");
            }
        }
    };

    // Sub-lesson navigation strictly inside main workspace
    const handleNextSubLesson = () => {
        if (activeSubLesson < ch1Lessons.length - 1) {
            setActiveSubLesson(activeSubLesson + 1);
        } else {
            // Reached last lesson in Chapter 1
            if (!isCurrentSubLessonDone) {
                handleToggleSubLesson(currentSubLesson.id);
            }
            if (isCh2Unlocked || progress.isChapter1Complete) {
                setActiveChapter(2);
            } else {
                toast.success("Lesson marked complete! Chapter 2 Assessment is now unlocked.");
                setActiveChapter(2);
            }
        }
    };

    const handlePrevSubLesson = () => {
        if (activeSubLesson > 0) {
            setActiveSubLesson(activeSubLesson - 1);
        }
    };

    const currentSubLesson = ch1Lessons[activeSubLesson];
    const isCurrentSubLessonDone = progress.completedLessonIds?.includes(currentSubLesson.id) || progress.completedLessonIds?.includes(String(currentSubLesson.id));

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden select-none">
            {/* =========================================================================
                1. NAVY LMS HEADER (#0B1B3D) WITH YELLOW BRANDING & PROGRESS CAPSULE
            ========================================================================= */}
            <header className="h-14 bg-[#0B1B3D] text-white flex items-center justify-between px-4 sm:px-8 shrink-0 z-30 shadow-xs border-b border-slate-800">
                {/* Left: Back & Broadbeach Academy Yellow Shield Branding */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/free-courses")}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                        title="Return to Free Courses Catalogue"
                    >
                        <FaArrowLeft className="text-xs" />
                        <span>All Courses</span>
                    </button>

                    <div className="h-4 w-px bg-white/20" />

                    <div className="flex items-center gap-2.5">
                        {/* Broadbeach Yellow Shield Logo Icon */}
                        <svg width="22" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                            <path d="M12 1L2 4.5V12C2 18.5 6.3 24.5 12 26C17.7 24.5 22 18.5 22 12V4.5L12 1Z" fill="#F7C600" />
                            <path d="M12 6L16.5 15.5L12 13.5L7.5 15.5L12 6Z" fill="#0B1B3D" />
                        </svg>
                        <span className="font-extrabold text-sm sm:text-base text-[#F7C600] tracking-tight">
                            Broadbeach Academy
                        </span>
                    </div>
                </div>

                {/* Right: Progress Capsule & Mobile Drawer Toggle */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-24 sm:w-36 h-2 bg-slate-600/70 rounded-full overflow-hidden">
                            <div
                                className="bg-[#F7C600] h-full rounded-full transition-all duration-300"
                                style={{ width: \`\${progress.percentage || 0}%\` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-[#F7C600]">
                            {progress.percentage || 0}% Complete
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileDrawerOpen(true)}
                        className="p-1.5 text-slate-300 hover:text-white rounded-lg lg:hidden transition"
                        aria-label="Open Course Navigation Drawer"
                    >
                        <FaBars size={16} />
                    </button>
                </div>
            </header>

            {/* =========================================================================
                2. MAIN VIEWPORT LEARNING WORKSPACE
            ========================================================================= */}
            <div className="flex-1 h-[calc(100vh-56px)] flex overflow-hidden min-h-0 relative">
                {/* Mobile Drawer Backdrop */}
                {mobileDrawerOpen && (
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
                        onClick={() => setMobileDrawerOpen(false)}
                    />
                )}

                {/* =====================================================================
                    LEFT SIDEBAR: EXACT REFERENCE DESIGN (~22-23% WIDTH)
                    CRITICAL: ONLY FOUR CHAPTER CARDS. ZERO SUB-LESSONS IN SIDEBAR.
                ===================================================================== */}
                <aside
                    className={\`
                        w-[280px] lg:w-[23%] lg:min-w-[270px] lg:max-w-[340px] shrink-0 h-full bg-white border-r border-slate-200 flex flex-col p-5 sm:p-6 overflow-y-auto z-40
                        \${mobileDrawerOpen
                            ? "fixed inset-y-0 left-0 max-w-[85vw] shadow-2xl block"
                            : "hidden lg:flex"
                        }
                    \`}
                >
                    {/* Course Content Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 tracking-tight block truncate max-w-[240px]" title={authoritativeName}>
                                {authoritativeName}
                            </span>
                            {mobileDrawerOpen && (
                                <button
                                    type="button"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className="p-1 text-slate-500 hover:text-slate-800 rounded-lg lg:hidden"
                                >
                                    <FaTimes size={14} />
                                </button>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight mt-0.5">
                            Course Content
                        </h2>
                    </div>

                    {/* EXACT FOUR CHAPTER NAVIGATION CARDS */}
                    <div className="space-y-3">
                        {/* -------------------------------------------------------------
                            CARD 1: 1. Course Module (Chapter 1 — Course Module)
                        ------------------------------------------------------------- */}
                        <div
                            onClick={() => handleSelectChapter(1)}
                            className={\`cursor-pointer rounded-xl p-3.5 flex items-center justify-between transition shadow-2xs \${
                                activeChapter === 1
                                    ? "bg-blue-50/70 border border-blue-200 border-l-4 border-l-[#0052CC]"
                                    : "bg-white hover:bg-slate-50 border border-slate-200"
                            }\`}
                            title="Chapter 1 — Course Module"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${
                                    progress.isChapter1Complete
                                        ? "bg-emerald-500 text-white"
                                        : activeChapter === 1
                                        ? "bg-[#0052CC] text-white"
                                        : "bg-slate-100 text-slate-500"
                                }\`}>
                                    {progress.isChapter1Complete ? (
                                        <FaCheckCircle size={14} />
                                    ) : (
                                        <FaPlay size={10} className="ml-0.5" />
                                    )}
                                </div>
                                <span className={\`text-xs sm:text-sm truncate \${
                                    activeChapter === 1 ? "font-bold text-[#0B1B3D]" : "font-semibold text-slate-700"
                                }\`}>
                                    1. Course Module
                                </span>
                            </div>
                            <FaChevronRight size={12} className={activeChapter === 1 ? "text-slate-600 shrink-0 ml-2" : "text-slate-400 shrink-0 ml-2"} />
                        </div>

                        {/* -------------------------------------------------------------
                            CARD 2: 2. Assessment (Chapter 2 — Assessment)
                        ------------------------------------------------------------- */}
                        <div
                            onClick={() => handleSelectChapter(2)}
                            className={\`cursor-pointer rounded-xl p-3.5 flex items-center justify-between transition shadow-2xs \${
                                activeChapter === 2
                                    ? "bg-blue-50/70 border border-blue-200 border-l-4 border-l-[#0052CC]"
                                    : !isCh2Unlocked
                                    ? "bg-white hover:bg-slate-50 border border-slate-200 opacity-80"
                                    : "bg-white hover:bg-slate-50 border border-slate-200"
                            }\`}
                            title="Chapter 2 — Assessment"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${
                                    progress.isChapter2Complete
                                        ? "bg-emerald-500 text-white"
                                        : activeChapter === 2
                                        ? "bg-[#0052CC] text-white"
                                        : !isCh2Unlocked
                                        ? "bg-slate-100 text-slate-400"
                                        : "bg-blue-100 text-[#0052CC]"
                                }\`}>
                                    {progress.isChapter2Complete ? (
                                        <FaCheckCircle size={14} />
                                    ) : !isCh2Unlocked ? (
                                        <FaLock size={12} />
                                    ) : (
                                        <FaClipboardCheck size={13} />
                                    )}
                                </div>
                                <span className={\`text-xs sm:text-sm truncate \${
                                    activeChapter === 2 ? "font-bold text-[#0B1B3D]" : "font-semibold text-slate-700"
                                }\`}>
                                    2. Assessment
                                </span>
                            </div>
                            <FaChevronRight size={12} className={activeChapter === 2 ? "text-slate-600 shrink-0 ml-2" : "text-slate-400 shrink-0 ml-2"} />
                        </div>

                        {/* -------------------------------------------------------------
                            CARD 3: 3. Training Course Material (Chapter 3 — Training Course Material)
                        ------------------------------------------------------------- */}
                        <div
                            onClick={() => handleSelectChapter(3)}
                            className={\`cursor-pointer rounded-xl p-3.5 flex items-center justify-between transition shadow-2xs \${
                                activeChapter === 3
                                    ? "bg-blue-50/70 border border-blue-200 border-l-4 border-l-[#0052CC]"
                                    : !isCh3Unlocked
                                    ? "bg-white hover:bg-slate-50 border border-slate-200 opacity-80"
                                    : "bg-white hover:bg-slate-50 border border-slate-200"
                            }\`}
                            title="Chapter 3 — Training Course Material"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${
                                    progress.isChapter3Complete
                                        ? "bg-emerald-500 text-white"
                                        : activeChapter === 3
                                        ? "bg-[#0052CC] text-white"
                                        : !isCh3Unlocked
                                        ? "bg-slate-100 text-slate-400"
                                        : "bg-amber-100 text-amber-700"
                                }\`}>
                                    {progress.isChapter3Complete ? (
                                        <FaCheckCircle size={14} />
                                    ) : !isCh3Unlocked ? (
                                        <FaLock size={12} />
                                    ) : (
                                        <FaBookOpen size={12} />
                                    )}
                                </div>
                                <span className={\`text-xs sm:text-sm truncate \${
                                    activeChapter === 3 ? "font-bold text-[#0B1B3D]" : "font-semibold text-slate-700"
                                }\`}>
                                    3. Training Course Material
                                </span>
                            </div>
                            <FaChevronRight size={12} className={activeChapter === 3 ? "text-slate-600 shrink-0 ml-2" : "text-slate-400 shrink-0 ml-2"} />
                        </div>

                        {/* -------------------------------------------------------------
                            CARD 4: 4. Download Certificate (Chapter 4 — Download Certificate)
                        ------------------------------------------------------------- */}
                        <div
                            onClick={() => handleSelectChapter(4)}
                            className={\`cursor-pointer rounded-xl p-3.5 flex items-center justify-between transition shadow-2xs \${
                                activeChapter === 4
                                    ? "bg-blue-50/70 border border-blue-200 border-l-4 border-l-[#0052CC]"
                                    : !isCh4Unlocked
                                    ? "bg-white hover:bg-slate-50 border border-slate-200 opacity-80"
                                    : "bg-white hover:bg-slate-50 border border-slate-200"
                            }\`}
                            title="Chapter 4 — Download Certificate"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${
                                    progress.isCompleted
                                        ? "bg-emerald-500 text-white"
                                        : activeChapter === 4
                                        ? "bg-[#0052CC] text-white"
                                        : !isCh4Unlocked
                                        ? "bg-slate-100 text-slate-400"
                                        : "bg-amber-100 text-amber-700"
                                }\`}>
                                    {progress.isCompleted ? (
                                        <FaCheckCircle size={14} />
                                    ) : !isCh4Unlocked ? (
                                        <FaLock size={12} />
                                    ) : (
                                        <FaAward size={13} />
                                    )}
                                </div>
                                <span className={\`text-xs sm:text-sm truncate \${
                                    activeChapter === 4 ? "font-bold text-[#0B1B3D]" : "font-semibold text-slate-700"
                                }\`}>
                                    4. Download Certificate
                                </span>
                            </div>
                            <FaChevronRight size={12} className={activeChapter === 4 ? "text-slate-600 shrink-0 ml-2" : "text-slate-400 shrink-0 ml-2"} />
                        </div>
                    </div>
                </aside>

                {/* =====================================================================
                    RIGHT MAIN LEARNING WORKSPACE (~77% WIDTH, VIEWPORT FITTED)
                ===================================================================== */}
                <main className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-7 min-h-0">
                    <div className="max-w-5xl mx-auto space-y-4">
                        {/* =============================================================
                            CHAPTER 1: COURSE MODULE (VIDEO LECTURE & IN-WORKSPACE NAV)
                        ============================================================= */}
                        {activeChapter === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Large Video Player Card */}
                                <div className="bg-black rounded-2xl overflow-hidden shadow-md border border-slate-800 aspect-video max-h-[58vh] w-full relative">
                                    {videoEmbedUrl ? (
                                        <iframe
                                            key={videoEmbedUrl}
                                            src={videoEmbedUrl}
                                            title={\`\${authoritativeName} - \${currentSubLesson.title}\`}
                                            className="absolute inset-0 w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                                            <span>Connecting to authentic course video stream...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Lesson Details & Navigation Card */}
                                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                                    {/* Top Row: Tag, Title, and Mark Complete */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="space-y-1">
                                            <span className="bg-[#E8F1FC] text-[#0052CC] font-bold text-xs px-3 py-1 rounded-full inline-block">
                                                Chapter 1 - Course Module
                                            </span>
                                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                                                {currentSubLesson.title}
                                            </h1>
                                            <p className="text-xs text-slate-500">
                                                Lesson {activeSubLesson + 1} of {ch1Lessons.length} • Duration: {currentSubLesson.duration}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-2">
                                            {courseVideoMeta?.viewUrl && (
                                                <a
                                                    href={courseVideoMeta.viewUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50/50 transition shadow-2xs"
                                                    title="Open Google Drive stream in new tab"
                                                >
                                                    <FaExternalLinkAlt size={10} className="text-blue-600" />
                                                    <span className="hidden sm:inline">Drive Stream</span>
                                                </a>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSubLesson(currentSubLesson.id)}
                                                className={\`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer \${
                                                    isCurrentSubLessonDone
                                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        : "bg-[#059669] hover:bg-[#047857] text-white"
                                                }\`}
                                            >
                                                <FaCheckCircle size={14} />
                                                <span>{isCurrentSubLessonDone ? "Completed" : "Mark as Complete"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom In-Workspace Navigation Row */}
                                    <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={handlePrevSubLesson}
                                            disabled={activeSubLesson === 0}
                                            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <FaArrowLeft size={11} />
                                            <span>Previous</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleNextSubLesson}
                                            className="px-6 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#102B4E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
                                        >
                                            <span>Next</span>
                                            <FaArrowRight size={11} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =============================================================
                            CHAPTER 2: ASSESSMENT (PROMINENT START EXAM BUTTON)
                        ============================================================= */}
                        {activeChapter === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {!isCh2Unlocked ? (
                                    <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center max-w-lg mx-auto shadow-md">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                                            <FaLock />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
                                            Chapter 2 Locked
                                        </span>
                                        <h3 className="text-lg font-black text-slate-900 mb-2">
                                            Assessment Prerequisites Incomplete
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                                            {ch2LockReason}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveChapter(1);
                                                setActiveSubLesson(0);
                                            }}
                                            className="px-5 py-2.5 bg-[#183B73] hover:bg-[#102B4E] text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                                        >
                                            <FaArrowLeft size={11} />
                                            <span>Return to Chapter 1 Lessons</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Assessment Banner Card */}
                                        <div className="bg-gradient-to-br from-[#0B1B3D] to-[#1E5FA8] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                                            <div className="relative z-10 max-w-2xl">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3 border border-white/10">
                                                    <FaAward />
                                                    <span>Official Certification Examination</span>
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                                                    {authoritativeName} — Official Assessment
                                                </h2>
                                                <p className="mt-2 text-blue-100 text-xs sm:text-sm leading-relaxed">
                                                    Evaluate your comprehensive competence in {authoritativeName}. 10 targeted questions to verify regulatory standards and audit methodologies.
                                                </p>

                                                <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15 text-center">
                                                    <div className="bg-white/10 rounded-2xl p-2.5">
                                                        <span className="text-blue-200 block text-[10px] font-semibold uppercase">Questions</span>
                                                        <span className="text-base font-black text-white">10 Questions</span>
                                                    </div>
                                                    <div className="bg-white/10 rounded-2xl p-2.5">
                                                        <span className="text-blue-200 block text-[10px] font-semibold uppercase">Time Limit</span>
                                                        <span className="text-base font-black text-white">30 Mins</span>
                                                    </div>
                                                    <div className="bg-white/10 rounded-2xl p-2.5">
                                                        <span className="text-blue-200 block text-[10px] font-semibold uppercase">Passing Threshold</span>
                                                        <span className="text-base font-black text-amber-300">70% to Pass</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assessment Action Section (Prominent START EXAM) */}
                                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                                            {progress.isChapter2Complete ? (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xl font-black">
                                                            <FaCheckCircle />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-emerald-950 text-base">Assessment Passed!</h4>
                                                            <p className="text-xs text-emerald-700 mt-0.5">
                                                                You have successfully met the 70% passing threshold for {authoritativeName}.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(\`/assignment/\${canonicalId}\`)}
                                                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                                                        >
                                                            Retake Exam
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveChapter(3)}
                                                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B1B3D] hover:bg-[#102B4E] text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                                        >
                                                            <span>Go to Chapter 3</span>
                                                            <FaArrowRight size={11} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 space-y-4">
                                                    <div className="max-w-md mx-auto">
                                                        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                                                            Ready to begin your certification exam?
                                                        </h3>
                                                        <p className="text-xs text-slate-600 leading-relaxed">
                                                            Click below to launch the official timed multiple-choice exam. A score of 70% or higher unlocks Chapters 3 and 4.
                                                        </p>
                                                    </div>

                                                    {/* Primary START EXAM Button */}
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(\`/assignment/\${canonicalId}\`)}
                                                            className="px-8 py-4 bg-[#F7C600] hover:bg-amber-400 active:scale-95 text-[#0B1B3D] rounded-2xl font-black text-sm tracking-wide shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2.5 cursor-pointer"
                                                        >
                                                            <span>START EXAM</span>
                                                            <FaArrowRight size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* In-Workspace Navigation Row */}
                                            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveChapter(1);
                                                        setActiveSubLesson(ch1Lessons.length - 1);
                                                    }}
                                                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
                                                >
                                                    <FaArrowLeft size={11} />
                                                    <span>Previous: Course Module</span>
                                                </button>

                                                {progress.isChapter2Complete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveChapter(3)}
                                                        className="px-6 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-[#102B4E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
                                                    >
                                                        <span>Next: Training Materials</span>
                                                        <FaArrowRight size={11} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* =============================================================
                            CHAPTER 3: TRAINING COURSE MATERIAL (PDF SLIDES & MANUALS)
                        ============================================================= */}
                        {activeChapter === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {!isCh3Unlocked ? (
                                    <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center max-w-lg mx-auto shadow-md">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                                            <FaLock />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
                                            Chapter 3 Locked
                                        </span>
                                        <h3 className="text-lg font-black text-slate-900 mb-2">
                                            Assessment Pass Required
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                                            {ch3LockReason}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveChapter(2)}
                                            className="px-5 py-2.5 bg-[#0B1B3D] hover:bg-[#102B4E] text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                                        >
                                            <span>Go to Chapter 2 Assessment</span>
                                            <FaArrowRight size={11} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                                                    Chapter 3
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Unlocked
                                                </span>
                                            </div>
                                            <h2 className="text-lg sm:text-xl font-black text-[#0B1B3D]">
                                                Training Course Material — {authoritativeName}
                                            </h2>
                                            <p className="text-xs text-slate-600 mt-1">
                                                Comprehensive audit slides, operational manuals, and guidelines. View interactive slides or download reference PDFs below.
                                            </p>
                                        </div>

                                        {/* Slide / PDF Viewer (if toggled) */}
                                        {showSlidesViewer && (
                                            <div className="bg-white rounded-3xl border border-slate-300 p-5 shadow-lg space-y-4">
                                                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-blue-600 uppercase">Slide Presentation</span>
                                                        <h4 className="text-xs font-black text-slate-800">{activeSlideDoc.title}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                                            <button type="button" onClick={handlePrevSlide} disabled={pageNum <= 1} className="hover:text-blue-600 disabled:opacity-40 cursor-pointer p-0.5">
                                                                <FaChevronLeft size={10} />
                                                            </button>
                                                            <span>{pageNum} / {numPages || 1}</span>
                                                            <button type="button" onClick={handleNextSlide} disabled={pageNum >= numPages} className="hover:text-blue-600 disabled:opacity-40 cursor-pointer p-0.5">
                                                                <FaChevronRight size={10} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSlidesViewer(false)}
                                                            className="text-xs font-bold text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center bg-slate-900 rounded-2xl p-2 min-h-[350px] relative items-center">
                                                    {pdfLoading && (
                                                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                                                            <span>Loading presentation...</span>
                                                        </div>
                                                    )}
                                                    {pdfError && (
                                                        <div className="text-center p-6 text-slate-300 text-xs">
                                                            <p>{pdfError}</p>
                                                            <a href={activeSlideDoc.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">
                                                                Download PDF Directly
                                                            </a>
                                                        </div>
                                                    )}
                                                    <canvas ref={canvasRef} className="max-w-full max-h-[50vh] object-contain rounded-lg" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Downloadable Materials Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                            {DEFAULT_SLIDES.map((item, idx) => (
                                                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                                                    <div>
                                                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5 text-base font-bold">
                                                            <FaFilePdf />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                            Material Deck {idx + 1}
                                                        </span>
                                                        <h4 className="text-xs font-black text-slate-900 mt-0.5 leading-snug">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-500 mt-1">
                                                            {item.fileName} • {item.size}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                                                        <button
                                                            type="button"
                                                            onClick={() => openSlidesViewer(item)}
                                                            className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition text-center cursor-pointer"
                                                        >
                                                            View
                                                        </button>
                                                        <a
                                                            href={item.url}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 py-1.5 px-2 bg-[#0B1B3D] hover:bg-[#102B4E] text-white rounded-lg font-bold text-[11px] transition text-center cursor-pointer flex items-center justify-center gap-1"
                                                        >
                                                            <FaDownload size={10} />
                                                            <span>PDF</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bottom In-Workspace Navigation */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setActiveChapter(2)}
                                                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
                                            >
                                                <FaArrowLeft size={11} />
                                                <span>Previous: Assessment</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setActiveChapter(4)}
                                                className="px-6 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-[#102B4E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
                                            >
                                                <span>Next: Download Certificate</span>
                                                <FaArrowRight size={11} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* =============================================================
                            CHAPTER 4: DOWNLOAD CERTIFICATE & CERTIFICATE ACCESS
                        ============================================================= */}
                        {activeChapter === 4 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {!isCh4Unlocked ? (
                                    <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center max-w-lg mx-auto shadow-md">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                                            <FaLock />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
                                            Chapter 4 Locked
                                        </span>
                                        <h3 className="text-lg font-black text-slate-900 mb-2">
                                            Certificate Access Locked
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                                            {ch4LockReason}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveChapter(2)}
                                            className="px-5 py-2.5 bg-[#0B1B3D] hover:bg-[#102B4E] text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                                        >
                                            <span>Go to Chapter 2 Assessment</span>
                                            <FaArrowRight size={11} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Digital Credential Ready Card */}
                                        {progress.isChapter2Complete && (
                                            <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-7 shadow-xs">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xl font-black">
                                                            <FaAward />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                                                                Examination Passed
                                                            </span>
                                                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                                                                Your Certificate of Achievement is Available
                                                            </h3>
                                                            <p className="text-xs text-slate-600 mt-0.5">
                                                                Earned for {authoritativeName} with verifiable accreditation ID.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(\`/certificate/\${canonicalId}\`)}
                                                        className="w-full sm:w-auto px-6 py-3 bg-[#0B1B3D] hover:bg-[#102B4E] text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
                                                    >
                                                        <FaDownload size={12} />
                                                        <span>Download Certificate</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* CERTIFICATE ACCESS (EXACT REQUIREMENT - REPLACING SLIDES UNAVAILABLE) */}
                                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                                            <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] mb-1">
                                                Certificate Access
                                            </h3>
                                            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                                                Please enter valid Access code for corporate and Classroom Exams.
                                            </p>

                                            <form onSubmit={handleAccessCode} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg">
                                                <input
                                                    type="text"
                                                    value={accessCode}
                                                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter access code"
                                                    maxLength={50}
                                                    className="w-full sm:flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={accessCodeLoading}
                                                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#0052CC] hover:bg-blue-700 text-white text-xs font-black transition disabled:opacity-60 cursor-pointer shadow-xs shrink-0"
                                                >
                                                    {accessCodeLoading ? "Verifying..." : "Verify / Continue"}
                                                </button>
                                            </form>

                                            {accessCodeError && (
                                                <p className="mt-2.5 text-xs font-bold text-rose-600">
                                                    {accessCodeError}
                                                </p>
                                            )}

                                            {accessCodeSuccess && (
                                                <p className="mt-2.5 text-xs font-bold text-emerald-600">
                                                    {accessCodeSuccess}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bottom In-Workspace Navigation */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setActiveChapter(3)}
                                                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
                                            >
                                                <FaArrowLeft size={11} />
                                                <span>Previous: Training Materials</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => navigate("/free-courses")}
                                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
                                            >
                                                <FaCheckCircle size={12} />
                                                <span>All Courses Finished</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Learning;
`;

fs.writeFileSync(learningPath, newLearningContent, "utf8");
console.log("Successfully wrote modernized reference design to src/pages/Learning.jsx");
