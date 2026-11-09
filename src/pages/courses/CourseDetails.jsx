import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAuthPrompt } from "../../context/AuthPromptContext";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock3,
  GraduationCap,
  Languages,
  CheckCircle2,
  Users,
  Star,
  ShieldCheck,
  FileText,
  PlayCircle,
  Play,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  Bookmark,
  Compass,
  ArrowRight,
  BadgeCheck,
  Globe,
  Check,
} from "lucide-react";

import { getCourseDetails, getFreeCertifications, enrollCourse } from "../../api/api";
import { resolveCourse, getAllPortalCourses } from "../../data/coursesResolver";
import { isCourseOnlineAvailable, LAUNCH_STATUS_CONFIG, FREE_COURSE_DB_MAP } from "../../constants/courseAvailability";
import { AUTHORITATIVE_FREE_COURSE_NAMES } from "../../data/freeCoursesData";
import EnrollmentEnquiryForm from "../../components/course/EnrollmentEnquiryForm";

// Subcomponents
import HeroMeta from "../../components/course/HeroMeta";
import CourseInfoRow from "../../components/course/CourseInfoRow";
import ContentCard from "../../components/course/ContentCard";
import SectionHeading from "../../components/course/SectionHeading";
import CheckItem from "../../components/course/CheckItem";
import SideCard from "../../components/course/SideCard";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { slug, id, courseId } = useParams();
  const courseSlugParam = slug || id || courseId || "";
  const { user, isAuthenticated } = useAuth();
  const { requireAuth } = useAuthPrompt();

  // State: instantly initialize from resolver so authoritative free courses render on first paint
  const initialCourse = resolveCourse(courseSlugParam);
  const [course, setCourse] = useState(initialCourse || null);
  const [loading, setLoading] = useState(!initialCourse);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("course-overview");
  const [expandedModules, setExpandedModules] = useState(new Set([1])); // Module 1 open by default
  const [copiedLink, setCopiedLink] = useState(false);

  // Phase 1 Online Availability
  const isOnlineCourse = isCourseOnlineAvailable(courseSlugParam, course || initialCourse);

  // Fetch course details with multi-tier fallback
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const resolved = resolveCourse(courseSlugParam);
        if (resolved) {
          setCourse(resolved);
          setLoading(false);
        } else {
          setLoading(true);
        }
        setError("");

        // 1. Try remote backend API first
        try {
          const response = await getCourseDetails(courseSlugParam);
          if (response?.data?.success && response?.data?.data) {
            const apiData = response.data.data;
            const resolverData = resolveCourse(courseSlugParam);
            // Merge with local rich resolver data so modules, outcomes, images are complete
            setCourse({
              ...resolverData,
              ...apiData,
              name: apiData.name || resolverData.name,
              title: apiData.title || apiData.name || resolverData.title,
              category: apiData.category || resolverData.category,
              course_image: apiData.course_image || apiData.image || resolverData.course_image,
              image: apiData.image || apiData.course_image || resolverData.image,
              duration: apiData.duration || resolverData.duration,
              level: apiData.level || resolverData.level,
              language: apiData.language || "English",
              certification: resolverData.certification,
              certification_id: apiData.certification_id || apiData.id || resolverData.certification_id,
              enrollId: apiData.id || resolverData.enrollId,
              modules:
                apiData.modules && apiData.modules.length > 0
                  ? apiData.modules
                  : resolverData.modules,
              outcomes:
                apiData.outcomes && apiData.outcomes.length > 0
                  ? apiData.outcomes
                  : resolverData.outcomes,
            });
            setLoading(false);
            return;
          }
        } catch (apiErr) {
          console.warn("Backend API unavailable or course slug not found on backend. Falling back to static resolver.", apiErr?.message);
        }

        // 2. Comprehensive resolver fallback (Never fails, guarantees rich course object)
        const fallbackResolved = resolveCourse(courseSlugParam);
        if (fallbackResolved) {
          setCourse(fallbackResolved);
          setError("");
        } else {
          setError("Course not found.");
        }
      } catch (err) {
        console.error("Course load error:", err);
        const resolved = resolveCourse(courseSlugParam);
        if (resolved) {
          setCourse(resolved);
          setError("");
        } else {
          setError("Unable to load course details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseSlugParam) {
      fetchCourse();
      window.scrollTo(0, 0);
    }
  }, [courseSlugParam]);

  // Dynamic Page Title
  useEffect(() => {
    if (!course) return;
    const oldTitle = document.title;
    document.title = `${course.name || course.title} | Broadbeach Academy`;
    return () => {
      document.title = oldTitle;
    };
  }, [course]);

  // Toggle Module accordion
  const toggleModule = (modId) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) {
        next.delete(modId);
      } else {
        next.add(modId);
      }
      return next;
    });
  };

  // Smooth in-page section navigation with sticky header offset
  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      });
    }
  };

  // Safe Enrollment Navigation with Direct Course Access & Authentication Gate
  const handleStartCourse = async () => {
    if (!course) return;
    if (!isOnlineCourse) {
      toast(LAUNCH_STATUS_CONFIG.notice, { icon: "ℹ️" });
      const el = document.getElementById("offline-enquiry-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const courseIdentifier = courseSlugParam || course.slug || course.id || "free-1";
    const targetCourseId = course.certification_id || course.enrollId || course.altId || course.id || 322;
    const isFreeCourse =
      Number(course.price) === 0 ||
      String(courseIdentifier).startsWith("free-") ||
      (course.category && course.category.toLowerCase().includes("free"));

    // 1. When NOT logged in: show clear notification with Log In & Cancel actions
    // Preserves destination so user returns to this exact course after login
    if (!isAuthenticated || !user) {
      requireAuth({
        courseId: targetCourseId,
        slug: courseIdentifier,
        title: course.title || course.name,
        destination: `/courses/${courseIdentifier}`,
      });
      return; // Stops here, does not start course or navigate
    }

    // 2. When logged in and authorized:
    // If it's a free course or already enrolled, directly launch the course player!
    if (isFreeCourse) {
      // Auto-enroll in backend if needed
      try {
        const numId = Number(targetCourseId);
        if (!isNaN(numId) && numId > 0) {
          enrollCourse(numId).catch(() => {});
        }
      } catch (e) {}

      // Add to local enrollment registry
      try {
        const enrolled = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
        if (!enrolled.some((c) => String(c.id) === String(targetCourseId))) {
          enrolled.push({
            id: targetCourseId,
            name: course.name || course.title,
            category: course.category,
            enrolledAt: new Date().toISOString(),
            progress: 0,
          });
          localStorage.setItem("bb_enrolled_courses", JSON.stringify(enrolled));
        }
      } catch (e) {}

      // Launch course player directly!
      navigate(`/learning/${targetCourseId}`);
      return;
    }

    // For paid courses:
    try {
      const enrolled = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
      if (enrolled.some((c) => String(c.id) === String(targetCourseId))) {
        navigate(`/learning/${targetCourseId}`);
        return;
      }
    } catch (e) {}

    // Not enrolled in paid course -> open checkout / enrollment
    navigate(`/enroll/${targetCourseId}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="course-page min-h-[70vh] bg-[#F8FAFD] py-12 md:py-16">
        <div className="course-page__container">
          <div className="course-page__layout">
            <div className="space-y-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-48" />
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="h-24 bg-slate-200 rounded-2xl w-full" />
              <div className="h-64 bg-slate-200 rounded-2xl w-full" />
              <div className="h-64 bg-slate-200 rounded-2xl w-full" />
            </div>
            <div className="animate-pulse space-y-6">
              <div className="h-[440px] bg-slate-200 rounded-2xl" />
              <div className="h-44 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback safe error view (should never trigger with our resolver)
  if (error || !course) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFD] px-4 py-16">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xs border border-slate-200/80 p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-[#FFF7D6] text-[#131E4A]">
            <BookOpen size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131E4A] mb-3">
            Course Not Available
          </h1>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            {error || "The requested course could not be found."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/free-courses"
              className="px-5 py-2.5 rounded-xl bg-[#1E5FA8] text-white text-sm font-semibold hover:bg-[#164C82] transition"
            >
              Browse Free Courses
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Related courses for bottom recommendation
  const allCourses = getAllPortalCourses();
  const relatedCourses = allCourses
    .filter((c) => String(c.id) !== String(course.id) && c.title !== course.title)
    .slice(0, 3);

  const courseImage = course.course_image || course.image;
  const isFree =
    course.price === 0 ||
    course.price === "0" ||
    String(course.id).includes("free") ||
    Boolean(FREE_COURSE_DB_MAP[String(course.id).toLowerCase()]) ||
    Boolean(FREE_COURSE_DB_MAP[String(courseSlugParam).toLowerCase()]) ||
    Boolean(AUTHORITATIVE_FREE_COURSE_NAMES[String(course.id)]) ||
    Boolean(AUTHORITATIVE_FREE_COURSE_NAMES[String(courseSlugParam).toLowerCase()]) ||
    (course.category && course.category.toLowerCase().includes("free"));

  const courseTabs = [
    { id: "course-overview", label: "Course Overview", icon: Compass },
    { id: "course-syllabus", label: "Syllabus", icon: BookOpen },
    { id: "certification-verification", label: "Certification & Verification", icon: Award },
    { id: "course-faqs", label: "Frequently Asked Questions", icon: HelpCircle },
  ];

  return (
    <div className="course-page bg-[#F8FAFD] min-h-screen">
      {/* =========================================================================
          HERO BANNER SECTION (Full Width Responsive Header with Integrated Start Course,
          Aligned Section Navigation, and Preview Play Button Overlay)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#08203E] via-[#131E4A] to-[#124275] text-white py-8 sm:py-10 lg:py-12 border-b border-white/10">
        {/* Subtle decorative background blur */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <img
            src={courseImage}
            alt=""
            className="w-full h-full object-cover blur-md scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-[#131E4A]/85 pointer-events-none" />

        <div className="relative z-10 course-page__container">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 mb-4 sm:mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <Link to="/courses" className="hover:text-white transition">Courses</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-300">{course.category || "Certifications"}</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-[#F8D85A] font-semibold truncate max-w-xs sm:max-w-md">
              {course.name || course.title}
            </span>
          </nav>

          {/* Hero 2-Column Responsive Layout */}
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-10 items-center">
            
            {/* LEFT COLUMN: Title, Meta, Start Course CTA & Aligned Navigation Controls */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start gap-4">
              
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8D85A] text-[#08203E] shadow-xs">
                  <Sparkles size={13} />
                  {isFree ? "100% Free Foundation Course" : "Professional Certification"}
                </span>

                {course.code && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                    {course.code}
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck size={13} /> ISO Standards Aligned
                </span>
              </div>

              {/* Course Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-extrabold text-white tracking-tight leading-tight">
                {course.name || course.title}
              </h1>

              {/* Short Description */}
              <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                {course.description || course.short_description}
              </p>

              {/* Meta stats row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                {!isFree && course.duration && (
                  <div className="flex items-center gap-1.5 bg-[#24496D] text-white px-3.5 py-1.5 rounded-xl border border-white/[0.12] shadow-xs">
                    <Clock3 size={15} className="text-[#FFD95A] shrink-0" />
                    <span>Duration: <strong className="font-semibold text-white">{course.duration}</strong></span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-[#24496D] text-white px-3.5 py-1.5 rounded-xl border border-white/[0.12] shadow-xs">
                  <GraduationCap size={15} className="text-[#FFD95A] shrink-0" />
                  <span>Level: <strong className="font-semibold text-white">{course.level || "Beginner"}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#24496D] text-white px-3.5 py-1.5 rounded-xl border border-white/[0.12] shadow-xs">
                  <Languages size={15} className="text-[#FFD95A] shrink-0" />
                  <span>Language: <strong className="font-semibold text-white">{course.language || "English"}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#344B50] px-3.5 py-1.5 rounded-xl border border-white/[0.12] shadow-xs">
                  <Star size={14} className="fill-[#FFD95A] text-[#FFD95A] shrink-0" />
                  <span className="text-[#FFD95A] font-bold">4.9</span>
                  <span className="text-white font-normal">({course.reviews || 240}+)</span>
                </div>
              </div>

              {/* Working Start Course CTA (Own row, ~60px height, aligned left, gold & dark navy) */}
              <div className="w-full flex items-center justify-start my-1 sm:my-1.5">
                {isOnlineCourse ? (
                  <button
                    type="button"
                    onClick={handleStartCourse}
                    className="h-[60px] min-h-[60px] px-8 rounded-[14px] font-bold text-base sm:text-[17px] bg-[#FFB800] hover:bg-[#F5A900] active:bg-[#E6A600] active:scale-[0.98] text-[#0B1F3A] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 outline-none whitespace-nowrap select-none self-start focus-visible:ring-2 focus-visible:ring-[#FFB800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08203E]"
                  >
                    <GraduationCap size={22} className="text-[#0B1F3A] shrink-0" />
                    <span>Start Course</span>
                    <ArrowRight size={20} className="text-[#0B1F3A] shrink-0" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => scrollToSection("offline-enquiry-section")}
                    className="h-[60px] min-h-[60px] px-8 rounded-[14px] font-bold text-base sm:text-[17px] bg-[#FFB800] hover:bg-[#F5A900] active:bg-[#E6A600] active:scale-[0.98] text-[#0B1F3A] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 outline-none whitespace-nowrap select-none self-start focus-visible:ring-2 focus-visible:ring-[#FFB800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08203E]"
                  >
                    <FileText size={22} className="text-[#0B1F3A] shrink-0" />
                    <span>{LAUNCH_STATUS_CONFIG.cta}</span>
                    <ArrowRight size={20} className="text-[#0B1F3A] shrink-0" />
                  </button>
                )}
              </div>

              {/* Standardized Course Section Navigation Controls (Equal Height, Consistent Gaps & Responsive Grid) */}
              <div
                className="w-full grid grid-cols-2 min-[1200px]:grid-cols-4 gap-2.5 sm:gap-3 xl:gap-3.5 pt-1.5 pb-1"
                role="tablist"
                aria-label="Course section navigation"
              >
                {courseTabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      data-active-theme={isActive ? "gold" : undefined}
                      style={isActive ? { color: "#0B1F3A" } : undefined}
                      onClick={() => scrollToSection(tab.id)}
                      className={`h-[48px] min-h-[48px] px-2 xl:px-2.5 rounded-[12px] font-semibold text-[11px] sm:text-[11.5px] xl:text-[12px] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border outline-none active:scale-[0.98] select-none focus-visible:ring-2 focus-visible:ring-[#FFD95A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08203E] ${
                        isActive
                          ? "bg-[#FFD95A] text-[#0B1F3A] border-[#FFD95A] font-bold shadow-none"
                          : "bg-[#193E63] text-white hover:text-white border-white/20 hover:bg-[#204E7C]"
                      }`}
                    >
                      <IconComp
                        size={15}
                        className={`shrink-0 ${isActive ? "text-[#0B1F3A]" : "text-[#FFB800]"}`}
                      />
                      <span
                        className="tracking-tight leading-tight text-center sm:text-left sm:tracking-normal whitespace-normal sm:whitespace-nowrap"
                        style={isActive ? { color: "#0B1F3A" } : undefined}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Course Preview Image & Centered Circular Play Button */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-center">
              <div className="relative w-full max-w-md">
                <div
                  onClick={handleStartCourse}
                  className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/25 shadow-2xl group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStartCourse();
                    }
                  }}
                  aria-label={`Start or preview course: ${course.name || course.title}`}
                >
                  <img
                    src={courseImage}
                    alt={course.name || course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-[#131E4A]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-xs">
                    {course.category || "Free Course"}
                  </span>

                  {/* Free Sponsored Badge */}
                  <span className="absolute top-3 right-3 bg-[#F8D85A] text-[#07162c] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                    FREE
                  </span>

                  {/* Centered Circular White Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full bg-white text-[#1E5FA8] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <Play size={24} className="fill-[#1E5FA8] text-[#1E5FA8] translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom Preview Tag */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white/95">
                    <span className="flex items-center gap-1.5 font-medium">
                      <PlayCircle size={14} className="text-[#F8D85A]" /> Start Course Preview
                    </span>
                    <span className="font-semibold text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[11px]">
                      {isFree ? "Self-Paced" : (course.duration || "Self-Paced")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN COURSE LAYOUT: 68% Content / 32% Sticky Sidebar (Consistent Grid)
      ========================================================================= */}
      <div className="course-page__container py-8 sm:py-10 md:py-12">
        <div className="course-page__layout">
          {/* =====================================================================
              MAIN CONTENT COLUMN (Order 2 on mobile, Order 1 on desktop)
          ===================================================================== */}
          <main className="course-page__content order-2 lg:order-1">
            {!isOnlineCourse && (
              <div id="offline-enquiry-section" className="scroll-mt-28">
                <EnrollmentEnquiryForm course={course} />
              </div>
            )}

            {/* Standardized Sticky In-Page Navigation Bar */}
            <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 gap-2.5 sm:gap-3 xl:gap-3.5 border-b border-slate-200/80 pb-3 max-w-full sticky top-20 bg-[#F8FAFD]/95 backdrop-blur-md z-20 pt-1.5 select-none">
              {courseTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-active-theme={isActive ? "gold" : undefined}
                    style={isActive ? { color: "#0B1F3A" } : undefined}
                    onClick={() => scrollToSection(tab.id)}
                    className={`h-[48px] min-h-[48px] px-2 xl:px-2.5 rounded-[12px] text-[11px] sm:text-[11.5px] xl:text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border outline-none active:scale-[0.98] select-none focus-visible:ring-2 focus-visible:ring-[#FFD95A] focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-[#FFD95A] text-[#0B1F3A] border-[#FFD95A] font-bold shadow-none"
                        : "bg-[#193E63] text-white border-white/20 hover:bg-[#204E7C] hover:text-white"
                    }`}
                  >
                    <IconComponent
                      size={15}
                      className={`shrink-0 ${isActive ? "text-[#0B1F3A]" : "text-[#FFB800]"}`}
                    />
                    <span
                      className="tracking-tight leading-tight text-center sm:text-left sm:tracking-normal whitespace-normal sm:whitespace-nowrap"
                      style={isActive ? { color: "#0B1F3A" } : undefined}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SECTION 1: COURSE OVERVIEW */}
            <section id="course-overview" className="scroll-mt-28 space-y-6">
              {/* About Section */}
              <ContentCard>
                <SectionHeading
                  icon={BookOpen}
                  title="About This Certification"
                  description={`Comprehensive professional overview and industrial relevance of ${course.name || course.title}.`}
                />
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3.5">
                  <p>
                    {course.description ||
                      `This rigorous program provides in-depth comprehension of ${course.name || course.title}, equipping participants with the critical frameworks, statutory protocols, and auditing benchmarks required in high-compliance sectors.`}
                  </p>
                  <p>
                    Through real-world case studies, process mapping scenarios, and structured clause-by-clause walkthroughs, you will master the strategic principles that allow enterprises to minimize risks, ensure statutory conformity, and foster continual improvement.
                  </p>
                </div>
              </ContentCard>

              {/* Key Learning Outcomes */}
              <ContentCard>
                <SectionHeading
                  icon={CheckCircle2}
                  title="What You Will Learn"
                  description="Concrete operational skills and competencies verified upon course completion."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
                  {course.outcomes?.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200/70 hover:border-blue-200 transition-colors"
                    >
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug break-words">
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </ContentCard>

              {/* Target Audience & Prerequisites (Equal-Width 2-Column Responsive Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <ContentCard className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E5FA8] flex items-center justify-center shrink-0 shadow-xs">
                      <Users size={19} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                      Who Should Enroll
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 list-disc list-inside flex-1">
                    <li>Quality, EHS, IT, and Compliance professionals</li>
                    <li>Internal Auditors and Process Optimization teams</li>
                    <li>Consultants, managers, and project leaders</li>
                    <li>Professionals seeking verified accredited credentials</li>
                  </ul>
                </ContentCard>

                <ContentCard className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck size={19} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                      Prerequisites
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                    No strict academic prerequisites required. General familiarity with organizational operations, quality concepts, or basic standard regulatory frameworks is recommended for an accelerated learning experience.
                  </p>
                </ContentCard>
              </div>
            </section>

            {/* SECTION 2: COURSE SYLLABUS */}
            <section id="course-syllabus" className="scroll-mt-28">
              <ContentCard className="space-y-5">
                {/* Rebuilt, Aligned Curriculum Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#FFF7D6] flex items-center justify-center text-[#131E4A] shadow-xs">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-[#131E4A] text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                          Curriculum & Syllabus
                        </h2>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E5FA8] border border-blue-200">
                          {course.modules?.length || 4} Modules
                        </span>
                      </div>
                      <p className="mt-1 text-slate-500 text-xs sm:text-sm leading-normal">
                        Structured step-by-step curriculum with interactive quizzes and lessons.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={handleStartCourse}
                      className="h-[38px] px-4 rounded-xl font-bold text-xs bg-[#1E5FA8] hover:bg-[#164C82] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <GraduationCap size={15} />
                      <span>Start Learning</span>
                    </button>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = new Set(course.modules?.map((m) => m.id) || [1, 2, 3, 4, 5]);
                          setExpandedModules(allIds);
                        }}
                        className="font-bold text-[#1E5FA8] hover:underline cursor-pointer"
                      >
                        Expand All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setExpandedModules(new Set())}
                        className="font-bold text-slate-500 hover:underline cursor-pointer"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordion Modules */}
                <div className="space-y-3 sm:space-y-3.5">
                  {course.modules?.map((module, modIdx) => {
                    const isOpen = expandedModules.has(module.id);
                    return (
                      <div
                        key={module.id || modIdx}
                        className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-xs transition-colors"
                      >
                        {/* Module Header Button */}
                        <button
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 text-left bg-slate-50/80 hover:bg-slate-100/90 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-[#1E5FA8] text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {modIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                                {module.title}
                              </h4>
                              <span className="text-[11px] sm:text-xs text-slate-500 block mt-0.5">
                                {module.lessons?.length || 3} Lessons • Verified Syllabus
                              </span>
                            </div>
                          </div>

                          <div className="text-slate-400 shrink-0">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </button>

                        {/* Lessons List */}
                        {isOpen && (
                          <div className="divide-y divide-slate-100 px-3 sm:px-5 py-1.5 bg-white">
                            {module.lessons?.map((lesson, lesIdx) => (
                              <div
                                key={lesson.id || lesIdx}
                                onClick={handleStartCourse}
                                className="py-2.5 sm:py-3 px-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-700 min-w-0 cursor-pointer hover:bg-slate-50 rounded-lg transition"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <PlayCircle size={16} className="text-blue-600 shrink-0" />
                                  <span className="break-words font-medium">{typeof lesson === "string" ? lesson : lesson.title}</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    {lesson.duration || "35 Mins"}
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Start Lesson
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ContentCard>
            </section>

            {/* SECTION 3: CERTIFICATION & VERIFICATION */}
            <section id="certification-verification" className="scroll-mt-28">
              <ContentCard>
                <SectionHeading
                  icon={Award}
                  title="Tamper-Proof Accredited Certification"
                  description="Global recognition, QR verification, and ISO/IEC 17024 quality alignment."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
                  <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    <p>
                      Upon successfully passing the final assessment with a score of 70% or higher, your official credential is instantly generated with a permanent cryptographic serial number.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span><strong>Instant Download:</strong> High-resolution PDF with official digital seal.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span><strong>Global QR Verification:</strong> Instant validation through our public verification portal.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span><strong>LinkedIn Shareable:</strong> Easily add official credential to your professional profile.</span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Mockup Preview */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#131E4A] text-white border-4 border-[#F8D85A]/40 shadow-xl space-y-3.5 text-center">
                    <BadgeCheck size={38} className="text-[#F8D85A] mx-auto" />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#F8D85A] font-bold block">
                        Broadbeach Academy
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-white mt-1">
                        Certificate of Achievement
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 italic border-y border-white/10 py-2">
                      Awarded for successful completion of {course.name || course.title}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Accredited Portal</span>
                      <span className="text-[#F8D85A] font-mono font-bold">BB-VERIFIED-2026</span>
                    </div>
                  </div>
                </div>
              </ContentCard>
            </section>

            {/* SECTION 4: FAQS */}
            <section id="course-faqs" className="scroll-mt-28">
              <ContentCard className="space-y-4">
                <SectionHeading
                  icon={HelpCircle}
                  title="Frequently Asked Questions"
                  description="Got questions about enrollment, examinations, and certificates? Find answers here."
                />

                <div className="space-y-3 sm:space-y-3.5 pt-1">
                  {[
                    {
                      q: "Is this certification really 100% free?",
                      a: "Yes! Our foundational programs and grant-sponsored certifications provide full access to study materials, quizzes, and instant verifiable PDF certificates at zero cost.",
                    },
                    {
                      q: "How does the final examination work?",
                      a: "The assessment is completed online directly in your browser. It consists of multiple-choice questions reflecting the course modules. A minimum score of 70% is required to pass, and you can reattempt if necessary.",
                    },
                    {
                      q: "Is the certificate recognized globally by employers?",
                      a: "Yes. Broadbeach Academy certifications align with ISO 19011 and ISO/IEC 17024 auditing and certification competencies, respected by compliance departments, OEM suppliers, and audit firms worldwide.",
                    },
                    {
                      q: "How long do I have to complete the course?",
                      a: "You have 1 year access from enrollment. You can study completely at your own pace, pausing and resuming whenever your schedule permits.",
                    },
                  ].map((faq, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">{faq.q}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </ContentCard>
            </section>
          </main>

          {/* =====================================================================
              SIDEBAR COLUMN: Pricing & Details (Order 1 on mobile, Order 2 on desktop)
          ===================================================================== */}
          <aside className="course-page__sidebar order-1 lg:order-2 space-y-6 lg:sticky lg:top-24 self-start">
            {/* Card 1: Primary Pricing, Thumbnail & Enrollment Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden text-slate-800">
              {/* Course Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 group">
                <img
                  src={courseImage}
                  alt={course.name || course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#1E5FA8] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {course.category || "Accredited"}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-white/95 text-[#1E5FA8] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle size={32} />
                  </div>
                </div>
              </div>

              {/* Price & CTA Box */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-150">
                  {isOnlineCourse ? (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                        Certification Fee
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#131E4A]">
                          FREE
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          100% Grant Sponsored
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                        Batch Enrolment
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl sm:text-2xl font-black text-[#131E4A]">
                          Offline Batches
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          {LAUNCH_STATUS_CONFIG.label}
                        </span>
                      </div>
                    </div>
                  )}

                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    1 Year Access
                  </span>
                </div>

                {/* Primary Action Button */}
                {isOnlineCourse ? (
                  <button
                    type="button"
                    onClick={handleStartCourse}
                    className="w-full h-[50px] px-6 rounded-[14px] font-bold text-sm sm:text-base bg-[#FFB800] hover:bg-[#F5A900] active:scale-[0.98] text-[#0B1F3A] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 outline-none whitespace-nowrap select-none focus-visible:ring-2 focus-visible:ring-[#FFB800] focus-visible:ring-offset-2"
                  >
                    <GraduationCap size={20} className="text-[#0B1F3A] shrink-0" />
                    <span>Start Course Now</span>
                    <ArrowRight size={18} className="text-[#0B1F3A] shrink-0" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => scrollToSection("offline-enquiry-section")}
                    className="w-full h-[50px] px-6 rounded-[14px] font-bold text-sm sm:text-base bg-[#FFB800] hover:bg-[#F5A900] active:scale-[0.98] text-[#0B1F3A] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 outline-none whitespace-nowrap select-none focus-visible:ring-2 focus-visible:ring-[#FFB800] focus-visible:ring-offset-2"
                  >
                    <FileText size={19} className="text-[#0B1F3A] shrink-0" />
                    <span>Enquire Now</span>
                    <ArrowRight size={17} className="text-[#0B1F3A] shrink-0" />
                  </button>
                )}

                {/* In-page quick navigation controls */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    In-Page Quick Navigation
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => scrollToSection("course-overview")}
                      className="py-2 px-2 rounded-xl text-center font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer truncate"
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("course-syllabus")}
                      className="py-2 px-2 rounded-xl text-center font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer truncate"
                    >
                      Syllabus
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("certification-verification")}
                      className="py-2 px-2 rounded-xl text-center font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer truncate"
                    >
                      Certificate
                    </button>
                  </div>
                </div>

                {/* Course Details Specs */}
                <div className="space-y-2.5 pt-2 text-xs sm:text-[13px] text-slate-600">
                  {!isFree && course.duration && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Clock3 size={15} className="text-[#1E5FA8]" /> Duration
                      </span>
                      <span className="font-semibold text-slate-800">{course.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center gap-2 text-slate-500">
                      <BookOpen size={15} className="text-[#1E5FA8]" /> Modules
                    </span>
                    <span className="font-semibold text-slate-800">{course.modules?.length || 4} Modules</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Globe size={15} className="text-[#1E5FA8]" /> Delivery Format
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {isOnlineCourse ? "100% Online (Self-Paced)" : "Offline Batches Only"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Award size={15} className="text-[#1E5FA8]" /> Credential
                    </span>
                    <span className="font-semibold text-emerald-700">Accredited Certificate</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <ShieldCheck size={15} className="text-[#1E5FA8]" /> Verification
                    </span>
                    <span className="font-semibold text-slate-800">QR Code / Instant ID</span>
                  </div>
                </div>

                {/* Share & Bookmark Controls */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 h-[38px] px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>{copiedLink ? "Link Copied!" : "Share Course"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Added to your wishlist!")}
                    className="h-[38px] px-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center transition cursor-pointer"
                    title="Bookmark Course"
                  >
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Certificate Scope & Verification Notice */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E5FA8] flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Verifiable Digital Certificate</h4>
                  <span className="text-xs text-slate-500">Issued by Broadbeach Academy</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All certificates issued by Broadbeach Academy feature a unique serial number and cryptographic verification code that can be authenticated by employers and compliance officers in real-time.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
                <strong>Credential Scope:</strong> Broadbeach Academy certificates attest to curriculum completion and examination competence in ISO management standards.
              </div>
            </div>

            {/* Card 3: Assessment & Credential Highlights */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3.5">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award size={16} className="text-[#1E5FA8]" />
                <span>Certification Assessment</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Comprehensive module-by-module curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>70% passing grade requirement for rigorous evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Instant digital badge and printable certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verifiable anytime via our public portal</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================================================
          RELATED COURSES RECOMMENDATION (Full Width Responsive Section)
      ========================================================================= */}
      <section className="bg-white py-10 sm:py-12 border-t border-slate-200/80">
        <div className="course-page__container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#131E4A]">
                Explore Related Certifications
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Advance your expertise across complementary ISO and auditing standards.
              </p>
            </div>
            <Link
              to="/courses"
              className="text-xs sm:text-sm font-bold text-[#1E5FA8] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Catalog</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {relatedCourses.map((rel) => (
              <Link
                key={rel.id}
                to={`/courses/${rel.id}`}
                className="group bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden bg-slate-200 relative">
                    <img
                      src={rel.course_image || rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {rel.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      {rel.code || "CERTIFIED"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {rel.title || rel.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {rel.description || rel.short_description}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock3 size={13} className="text-slate-400" />
                    {rel.duration}
                  </span>
                  <span className="font-bold text-[#1E5FA8] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Details <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;