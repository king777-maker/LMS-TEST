import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaDownload,
    FaPlay,
    FaClipboardCheck,
    FaAward,
    FaLock,
    FaChevronDown,
    FaChevronUp,
    FaBars,
    FaTimes,
    FaBookOpen,
    FaArrowRight,
    FaExternalLinkAlt,
    FaFilePdf,
    FaShieldAlt,
    FaArrowLeft,
    FaRedo,
} from "react-icons/fa";
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
import backendUrl from "../utils/backendUrl";
import { getAuthoritativeCourseName, freeCoursesData, AUTHORITATIVE_FREE_COURSE_NAMES } from "../data/freeCoursesData";
import { getAssessmentForCourse } from "../data/assessmentCatalog";
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
    const [topicsExpanded, setTopicsExpanded] = useState(false);

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

    // Chapter 1 Sub-Lessons Definition
    const ch1Lessons = [
        {
            id: 1,
            lesson_id: "lsn-1",
            title: `Foundations & Strategic Scope of ${authoritativeName}`,
            duration: "45 Mins",
            topics: staticCourse?.curriculum?.[0]?.lessons || [
                `Harmonized High-Level Structure (HLS) & Global Scope`,
                `Context of the Organization, Interested Parties & Scope Definition`,
                `Leadership Commitment, Quality Policy & Organizational Roles`
            ],
            videoUrl: videoEmbedUrl,
        },
        {
            id: 2,
            lesson_id: "lsn-2",
            title: `Core Requirements, Operational Planning & Risk Alignment`,
            duration: "1 Hour 15 Mins",
            topics: staticCourse?.curriculum?.[1]?.lessons || [
                `Actions to Address Risks & Opportunities (Risk-Based Thinking)`,
                `Resource Management, Competence, Awareness & Documented Information`,
                `Operational Planning, Execution Control & Process Performance Monitoring`
            ],
            videoUrl: videoEmbedUrl,
        },
        {
            id: 3,
            lesson_id: "lsn-3",
            title: `Performance Evaluation, Continual Improvement & Audit Readiness`,
            duration: "45 Mins",
            topics: staticCourse?.curriculum?.[2]?.lessons || [
                `Monitoring, Measurement, Analysis & Comprehensive Evaluation`,
                `Internal Audit Program, Audit Evidence & Non-Conformity Management`,
                `Management Review Inputs/Outputs & Continual Improvement Methodologies`
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
                navigate(`/certificate/${canonicalId}`);
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
            }
        } else if (chNum === 3) {
            if (isCh3Unlocked) {
                setActiveChapter(3);
                setMobileDrawerOpen(false);
            }
        } else if (chNum === 4) {
            if (isCh4Unlocked) {
                setActiveChapter(4);
                setMobileDrawerOpen(false);
            }
        }
    };

    // Sub-lesson navigation
    const handleNextSubLesson = () => {
        if (activeSubLesson < ch1Lessons.length - 1) {
            setActiveSubLesson(activeSubLesson + 1);
        } else if (isCh2Unlocked) {
            setActiveChapter(2);
        }
    };

    const handlePrevSubLesson = () => {
        if (activeSubLesson > 0) {
            setActiveSubLesson(activeSubLesson - 1);
        }
    };

    const currentSubLesson = ch1Lessons[activeSubLesson];
    const isCurrentSubLessonDone = progress.completedLessonIds?.includes(currentSubLesson.id) || progress.completedLessonIds?.includes(String(currentSubLesson.id));
    const ch1CompletedCount = ch1Lessons.filter(l => progress.completedLessonIds?.includes(l.id) || progress.completedLessonIds?.includes(String(l.id))).length;

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden select-none">
            {/* =========================================================================
                1. COMPACT LMS TOP BAR (56px) - ZERO UNNECESSARY SCROLL
            ========================================================================= */}
            <header className="h-14 bg-[#0B1B3D] text-white border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-xs">
                {/* Left: Back & Branding */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/free-courses")}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition cursor-pointer"
                        title="Return to Free Courses Catalogue"
                    >
                        <FaArrowLeft className="text-[11px]" />
                        <span className="hidden sm:inline">All Courses</span>
                    </button>
                    <div className="h-4 w-px bg-white/20 hidden sm:block" />
                    <span className="font-extrabold text-xs sm:text-sm text-amber-400 tracking-wide hidden md:inline">
                        Broadbeach Academy
                    </span>
                </div>

                {/* Center: Dynamic Course Name Header */}
                <div className="text-center px-2 flex-1 max-w-xl truncate">
                    <h1 className="text-xs sm:text-sm font-bold text-white truncate" title={`${authoritativeName} — Course Content`}>
                        {authoritativeName} — Course Content
                    </h1>
                </div>

                {/* Right: Compact Progress Indicator & Mobile Trigger */}
                <div className="flex items-center gap-2.5">
                    <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        <div className="w-16 bg-white/20 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress.percentage || 0}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-bold text-amber-300">{progress.percentage || 0}% Complete</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileDrawerOpen(true)}
                        className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg lg:hidden transition"
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
                    LEFT SIDEBAR: STANDARDIZED FOUR CHAPTERS
                ===================================================================== */}
                <aside
                    className={`
                        w-80 xl:w-96 shrink-0 h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden z-40
                        ${mobileDrawerOpen
                            ? "fixed inset-y-0 left-0 max-w-[85vw] shadow-2xl block"
                            : "hidden lg:flex"
                        }
                    `}
                >
                    {/* Compact Sidebar Header */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-[#1E5FA8] uppercase tracking-wider block">
                                    Curriculum Overview
                                </span>
                                <h2 className="text-xs font-black text-slate-800 truncate max-w-[220px]" title={authoritativeName}>
                                    {authoritativeName}
                                </h2>
                            </div>
                            {mobileDrawerOpen && (
                                <button
                                    type="button"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 lg:hidden"
                                >
                                    <FaTimes size={14} />
                                </button>
                            )}
                        </div>

                        {/* 4-Chapter Step Pills */}
                        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-200 text-center">
                            {[1, 2, 3, 4].map((ch) => {
                                const isAct = activeChapter === ch;
                                const isDone =
                                    ch === 1 ? progress.isChapter1Complete :
                                    ch === 2 ? progress.isChapter2Complete :
                                    ch === 3 ? progress.isChapter3Complete :
                                    progress.isCompleted;
                                const isUnl = isChapterUnlocked(ch, progress);

                                return (
                                    <button
                                        key={ch}
                                        type="button"
                                        onClick={() => handleSelectChapter(ch)}
                                        disabled={!isUnl}
                                        className={`py-1 rounded-md text-[10px] font-black transition flex flex-col items-center justify-center ${
                                            isAct
                                                ? "bg-[#183B73] text-white shadow-xs"
                                                : isDone
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                : isUnl
                                                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                : "bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed"
                                        }`}
                                    >
                                        <span>CH {ch}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chapter List - Scrollable within sidebar */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
                        {/* CHAPTER 1: COURSE MODULE */}
                        <div className={`p-3.5 transition ${activeChapter === 1 ? "bg-blue-50/70 border-l-4 border-[#1E5FA8]" : "hover:bg-slate-50"}`}>
                            <div
                                onClick={() => handleSelectChapter(1)}
                                className="cursor-pointer flex items-start justify-between gap-2"
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                        progress.isChapter1Complete
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-[#1E5FA8] text-white"
                                    }`}>
                                        {progress.isChapter1Complete ? <FaCheckCircle /> : "1"}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                            Chapter 1 — Course Module
                                        </h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            {ch1CompletedCount}/3 Lessons Completed
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    progress.isChapter1Complete ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                                }`}>
                                    {progress.isChapter1Complete ? "Completed" : "Active"}
                                </span>
                            </div>

                            {/* Sub-Lessons List */}
                            <div className="mt-2.5 space-y-1.5 pl-9">
                                {ch1Lessons.map((sub, sIdx) => {
                                    const isSubDone = progress.completedLessonIds?.includes(sub.id) || progress.completedLessonIds?.includes(String(sub.id));
                                    const isSubActive = activeChapter === 1 && activeSubLesson === sIdx;

                                    return (
                                        <div
                                            key={sub.id}
                                            onClick={() => {
                                                setActiveChapter(1);
                                                setActiveSubLesson(sIdx);
                                                setMobileDrawerOpen(false);
                                            }}
                                            className={`p-2 rounded-lg text-[11px] cursor-pointer flex items-center justify-between gap-2 transition ${
                                                isSubActive
                                                    ? "bg-white text-[#183B73] font-bold border border-blue-200 shadow-xs"
                                                    : "text-slate-600 hover:bg-white/80"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <FaPlay size={8} className={isSubActive ? "text-[#1E5FA8]" : "text-slate-400"} />
                                                <span className="truncate">Lesson {sIdx + 1}: {sub.duration}</span>
                                            </div>
                                            {isSubDone ? (
                                                <FaCheckCircle className="text-emerald-500 shrink-0 text-xs" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CHAPTER 2: ASSESSMENT */}
                        <div
                            onClick={() => handleSelectChapter(2)}
                            className={`p-3.5 transition cursor-pointer flex items-start justify-between gap-2 ${
                                activeChapter === 2
                                    ? "bg-blue-50/70 border-l-4 border-[#1E5FA8]"
                                    : !isCh2Unlocked
                                    ? "opacity-60 bg-slate-50/50 cursor-not-allowed"
                                    : "hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                    progress.isChapter2Complete
                                        ? "bg-emerald-100 text-emerald-700"
                                        : isCh2Unlocked
                                        ? "bg-purple-600 text-white"
                                        : "bg-slate-200 text-slate-500"
                                }`}>
                                    {!isCh2Unlocked ? <FaLock size={11} /> : progress.isChapter2Complete ? <FaCheckCircle /> : <FaClipboardCheck />}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                        Chapter 2 — Assessment
                                    </h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        10 Questions • 30 Mins • 70% to Pass
                                    </p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                progress.isChapter2Complete
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isCh2Unlocked
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-slate-200 text-slate-600"
                            }`}>
                                {progress.isChapter2Complete ? "Passed" : isCh2Unlocked ? "Ready" : "Locked"}
                            </span>
                        </div>

                        {/* CHAPTER 3: TRAINING COURSE MATERIAL */}
                        <div
                            onClick={() => handleSelectChapter(3)}
                            className={`p-3.5 transition cursor-pointer flex items-start justify-between gap-2 ${
                                activeChapter === 3
                                    ? "bg-blue-50/70 border-l-4 border-[#1E5FA8]"
                                    : !isCh3Unlocked
                                    ? "opacity-60 bg-slate-50/50 cursor-not-allowed"
                                    : "hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                    progress.isChapter3Complete
                                        ? "bg-emerald-100 text-emerald-700"
                                        : isCh3Unlocked
                                        ? "bg-amber-600 text-white"
                                        : "bg-slate-200 text-slate-500"
                                }`}>
                                    {!isCh3Unlocked ? <FaLock size={11} /> : <FaBookOpen size={11} />}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                        Chapter 3 — Training Course Material
                                    </h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        3 Downloadable PDF Slide Decks
                                    </p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                progress.isChapter3Complete
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isCh3Unlocked
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-200 text-slate-600"
                            }`}>
                                {isCh3Unlocked ? "Available" : "Locked"}
                            </span>
                        </div>

                        {/* CHAPTER 4: DOWNLOAD CERTIFICATE */}
                        <div
                            onClick={() => handleSelectChapter(4)}
                            className={`p-3.5 transition cursor-pointer flex items-start justify-between gap-2 ${
                                activeChapter === 4
                                    ? "bg-blue-50/70 border-l-4 border-[#1E5FA8]"
                                    : !isCh4Unlocked
                                    ? "opacity-60 bg-slate-50/50 cursor-not-allowed"
                                    : "hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                    progress.isCompleted
                                        ? "bg-emerald-100 text-emerald-700"
                                        : isCh4Unlocked
                                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900"
                                        : "bg-slate-200 text-slate-500"
                                }`}>
                                    {!isCh4Unlocked ? <FaLock size={11} /> : <FaAward size={13} />}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                        Chapter 4 — Download Certificate
                                    </h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Verifiable Credential & Access Code
                                    </p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                progress.isCompleted
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isCh4Unlocked
                                    ? "bg-amber-100 text-amber-900"
                                    : "bg-slate-200 text-slate-600"
                            }`}>
                                {progress.isCompleted ? "Issued" : isCh4Unlocked ? "Eligible" : "Locked"}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Status Pill */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
                        <span>LMS Runtime 2.0</span>
                        <span className="font-bold text-[#1E5FA8]">Strict Sequential Lock</span>
                    </div>
                </aside>

                {/* =====================================================================
                    RIGHT WORKSPACE: DYNAMIC CONTENT PANEL (CONTAINED SCROLL)
                ===================================================================== */}
                <main className="flex-1 h-full flex flex-col overflow-hidden bg-slate-50 min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 min-h-0">
                        <div className="max-w-4xl mx-auto space-y-5">
                            {/* =========================================================
                                CHAPTER 1 WORKSPACE: COURSE MODULE (VIDEO LECTURE)
                            ========================================================= */}
                            {activeChapter === 1 && (
                                <div className="space-y-4 animate-in fade-in duration-200">
                                    {/* Video Player Card - Max Height Controlled for Zero Scroll */}
                                    <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800 aspect-video max-h-[56vh] w-full relative">
                                        {videoEmbedUrl ? (
                                            <iframe
                                                key={videoEmbedUrl}
                                                src={videoEmbedUrl}
                                                title={`${authoritativeName} - ${currentSubLesson.title}`}
                                                className="absolute inset-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                                                <span>Connecting to authenticated video stream...</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Video Meta & Action Bar */}
                                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[11px] font-bold text-[#1E5FA8] uppercase tracking-wider">
                                                    Chapter 1 • Lesson {activeSubLesson + 1} of 3
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                    Official Stream
                                                </span>
                                            </div>
                                            <h2 className="text-base sm:text-lg font-extrabold text-[#183B73] leading-snug">
                                                {currentSubLesson.title}
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Duration: {currentSubLesson.duration} • Watch lecture before proceeding.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {courseVideoMeta?.viewUrl && (
                                                <a
                                                    href={courseVideoMeta.viewUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50/50 transition shadow-xs"
                                                    title="Open full Google Drive stream viewer in new tab"
                                                >
                                                    <FaExternalLinkAlt size={10} className="text-blue-600" />
                                                    <span className="hidden sm:inline">Drive Stream</span>
                                                </a>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSubLesson(currentSubLesson.id)}
                                                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer ${
                                                    isCurrentSubLessonDone
                                                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                }`}
                                            >
                                                <FaCheckCircle size={12} />
                                                <span>{isCurrentSubLessonDone ? "Lesson Completed" : "Mark Complete"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Topics Covered Accordion (Compact) */}
                                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setTopicsExpanded(!topicsExpanded)}
                                            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                        >
                                            <span className="uppercase tracking-wider text-[11px] text-slate-500">
                                                Key Topics Covered ({currentSubLesson.topics.length})
                                            </span>
                                            {topicsExpanded ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                                        </button>
                                        {topicsExpanded && (
                                            <div className="px-4 pb-3.5 pt-1 border-t border-slate-100 divide-y divide-slate-50">
                                                {currentSubLesson.topics.map((t, idx) => (
                                                    <div key={idx} className="py-1.5 text-xs text-slate-600 flex items-start gap-2">
                                                        <span className="text-blue-500 font-bold">•</span>
                                                        <span>{typeof t === "string" ? t : t.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* =========================================================
                                CHAPTER 2 WORKSPACE: ASSESSMENT (REPLACED TIMED TEXT WITH START EXAM)
                            ========================================================= */}
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
                                            {/* Exam Banner Card */}
                                            <div className="bg-gradient-to-br from-[#102B4E] to-[#1E5FA8] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                                                <div className="relative z-10 max-w-2xl">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3 border border-white/10">
                                                        <FaAward />
                                                        <span>Official Certification Examination</span>
                                                    </div>
                                                    <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                                                        {authoritativeName} — Official Assessment
                                                    </h2>
                                                    <p className="mt-2 text-blue-100 text-xs sm:text-sm leading-relaxed">
                                                        Test your comprehensive mastery of {authoritativeName}. 10 targeted questions to evaluate audit competence, regulatory structure, and operational methodology.
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
                                                                onClick={() => navigate(`/assignment/${canonicalId}`)}
                                                                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                                                            >
                                                                Retake Exam
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveChapter(3)}
                                                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#183B73] hover:bg-[#102B4E] text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                                                                onClick={() => navigate(`/assignment/${canonicalId}`)}
                                                                className="px-8 py-4 bg-[#F7C600] hover:bg-amber-400 active:scale-95 text-[#0B1B3D] rounded-2xl font-black text-sm tracking-wide shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2.5 cursor-pointer"
                                                            >
                                                                <span>START EXAM</span>
                                                                <FaArrowRight size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================================
                                CHAPTER 3 WORKSPACE: TRAINING COURSE MATERIAL
                            ========================================================= */}
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
                                                className="px-5 py-2.5 bg-[#183B73] hover:bg-[#102B4E] text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                                            >
                                                <span>Go to Chapter 2 Assessment</span>
                                                <FaArrowRight size={11} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Chapter 3 Header */}
                                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                                                        Chapter 3
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        Unlocked
                                                    </span>
                                                </div>
                                                <h2 className="text-lg sm:text-xl font-black text-[#183B73]">
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
                                                                className="text-xs font-bold text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100"
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
                                                                className="flex-1 py-1.5 px-2 bg-[#183B73] hover:bg-[#102B4E] text-white rounded-lg font-bold text-[11px] transition text-center cursor-pointer flex items-center justify-center gap-1"
                                                            >
                                                                <FaDownload size={10} />
                                                                <span>PDF</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Next Step Banner */}
                                            <div className="bg-gradient-to-r from-slate-900 to-[#102B4E] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-bold">Ready to access your official credential?</h4>
                                                    <p className="text-[11px] text-slate-300">Proceed to Chapter 4 to verify your access code and download your certificate.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveChapter(4)}
                                                    className="px-5 py-2.5 bg-[#F7C600] hover:bg-amber-400 text-slate-900 rounded-xl font-black text-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
                                                >
                                                    <span>Continue to Chapter 4</span>
                                                    <FaArrowRight size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================================
                                CHAPTER 4 WORKSPACE: DOWNLOAD CERTIFICATE & ACCESS CODE
                            ========================================================= */}
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
                                                className="px-5 py-2.5 bg-[#183B73] hover:bg-[#102B4E] text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
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
                                                            onClick={() => navigate(`/certificate/${canonicalId}`)}
                                                            className="w-full sm:w-auto px-6 py-3 bg-[#183B73] hover:bg-[#102B4E] text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
                                                        >
                                                            <FaDownload size={12} />
                                                            <span>Download Certificate</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CERTIFICATE ACCESS (EXACT REQUIREMENT - REPLACING SLIDES UNAVAILABLE) */}
                                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                                                <h3 className="text-base sm:text-lg font-black text-[#183B73] mb-1">
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
                                                        className="w-full sm:flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#1E5FA8] focus:ring-2 focus:ring-blue-100"
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={accessCodeLoading}
                                                        className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#1E5FA8] hover:bg-[#164C82] text-white text-xs font-black transition disabled:opacity-60 cursor-pointer shadow-xs shrink-0"
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
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =====================================================================
                        COMPACT BOTTOM ACTION BAR (56px) - ZERO UNNECESSARY SCROLL
                    ===================================================================== */}
                    <footer className="h-14 bg-white border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
                        {/* Prev Action */}
                        <div>
                            {activeChapter === 1 && activeSubLesson > 0 ? (
                                <button
                                    type="button"
                                    onClick={handlePrevSubLesson}
                                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <FaChevronLeft size={10} />
                                    <span>Previous Lesson</span>
                                </button>
                            ) : activeChapter > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setActiveChapter(activeChapter - 1)}
                                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <FaChevronLeft size={10} />
                                    <span>Chapter {activeChapter - 1}</span>
                                </button>
                            ) : (
                                <div className="text-[11px] font-bold text-slate-400">
                                    Start of Curriculum
                                </div>
                            )}
                        </div>

                        {/* Current Position Pill */}
                        <div className="text-center hidden sm:block">
                            <span className="text-xs font-bold text-slate-500">
                                Chapter {activeChapter} of 4 • {
                                    activeChapter === 1 ? "Course Module" :
                                    activeChapter === 2 ? "Assessment" :
                                    activeChapter === 3 ? "Training Material" :
                                    "Download Certificate"
                                }
                            </span>
                        </div>

                        {/* Next Action */}
                        <div>
                            {activeChapter === 1 && activeSubLesson < ch1Lessons.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={handleNextSubLesson}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#183B73] hover:bg-[#102B4E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <span>Next Lesson</span>
                                    <FaChevronRight size={10} />
                                </button>
                            ) : activeChapter < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => handleSelectChapter(activeChapter + 1)}
                                    disabled={
                                        (activeChapter === 1 && !isCh2Unlocked) ||
                                        (activeChapter === 2 && !isCh3Unlocked) ||
                                        (activeChapter === 3 && !isCh4Unlocked)
                                    }
                                    className="px-3.5 py-1.5 rounded-xl bg-[#183B73] hover:bg-[#102B4E] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <span>Chapter {activeChapter + 1}</span>
                                    <FaChevronRight size={10} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => navigate("/free-courses")}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <FaCheckCircle size={11} />
                                    <span>Finished</span>
                                </button>
                            )}
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Learning;
