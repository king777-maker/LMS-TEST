import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";
import toast from "react-hot-toast";
import {
  FaAward,
  FaBookOpen,
  FaClock,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaSearch,
  FaArrowRight,
  FaGraduationCap,
  FaShieldAlt,
  FaDownload,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  freeCoursesData,
  getAuthoritativeCourseName,
  STATIC_FREE_CERT_METADATA,
  deriveFreeCourseCategory,
} from "../data/freeCoursesData";
import EnrollButton from "../components/common/EnrollButton";
import { getFreeCertifications, enrollCourse } from "../api/api";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability";

const ITEMS_PER_PAGE = 6;

const FreeCoursesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { requireAuth } = useAuthPrompt();

  const handleStartCourse = async (courseId, courseSlug) => {
    const matched = courses.find((c) => String(c.id) === String(courseId));
    const targetDbId = FREE_COURSE_DB_MAP[courseId] || FREE_COURSE_DB_MAP[courseSlug] || Number(courseId) || 322;
    const dest = `/learning/${targetDbId}`;

    // When NOT logged in: show clear notification with Log In & Cancel actions
    if (!requireAuth({
      courseId: targetDbId,
      slug: courseSlug || courseId,
      title: matched?.title || matched?.name || `Course #${courseId}`,
      destination: dest,
    })) {
      return; // Stops here, preserves current page
    }

    // Auto-enroll in backend if needed
    try {
      if (targetDbId > 0) {
        enrollCourse(targetDbId).catch(() => {});
      }
    } catch (e) {}

    // When logged in: proceed directly to course player
    navigate(dest);
  };

  // State
  const [courses, setCourses] = useState(freeCoursesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Fetch free courses from API with multi-tier fallback
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFreeCertifications();

      if (
        response?.data?.success &&
        Array.isArray(response.data?.data) &&
        response.data.data.length > 0
      ) {
        // Map backend objects into unified course shapes
        const mapped = response.data.data.map((item, idx) => {
          const matchedStatic = freeCoursesData.find(
            (s) =>
              String(s.id) === String(item.id) ||
              s.title.toLowerCase() === (item.name || item.title || "").toLowerCase()
          );

          const title = getAuthoritativeCourseName(item.id, item.name || item.title || matchedStatic?.title) || `Certification Track ${idx + 1}`;
          const slug =
            item.slug ||
            matchedStatic?.slug ||
            title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

          const staticMeta = STATIC_FREE_CERT_METADATA[String(item.id)] || {};
          const category = staticMeta.category || deriveFreeCourseCategory(item);
          const fallbackCount = 2100 + ((Number(item.id || idx) * 137) % 2800);
          const students_count = Number(
            item.students_count ||
            (Number(item.students) > 0 ? Number(item.students) : 0) ||
            staticMeta.students_count ||
            matchedStatic?.students_count ||
            fallbackCount
          );
          const rating = Number(
            (Number(item.rating) > 0 ? Number(item.rating) : 0) ||
            staticMeta.rating ||
            matchedStatic?.rating ||
            4.9
          );
          const hasGenericImage = !item.image || item.image.includes("photo-1509062522246");
          const image = (!hasGenericImage ? item.image : null) ||
            staticMeta.image ||
            matchedStatic?.image ||
            item.image ||
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900";

          return {
            id: String(item.id || matchedStatic?.id || idx + 1),
            slug: slug,
            code: item.code || matchedStatic?.code || `ISO-FND-${idx + 1}`,
            name: title,
            title: title,
            category: category,
            level: item.level || matchedStatic?.level || "Beginner",
            duration: item.duration || matchedStatic?.duration || "12 Hours",
            price: 0,
            students: `${students_count.toLocaleString()}+`,
            students_count: students_count,
            rating: rating,
            reviews: Number(item.reviews || matchedStatic?.reviews || 210),
            badge: item.badge || matchedStatic?.badge || "Free Certification",
            tag: item.tag || matchedStatic?.tag || "High Demand",
            image: image,
            short_description:
              item.short_description ||
              item.description ||
              matchedStatic?.short_description ||
              "Master the foundational concepts and international compliance frameworks.",
            description: item.description || matchedStatic?.description || item.short_description,
            outcomes: item.outcomes || matchedStatic?.outcomes || [
              "Master foundational principles and international frameworks.",
              "Apply risk-based thinking and continuous improvement methods.",
              "Prepare for accredited certification examination.",
            ],
            curriculum: item.curriculum || matchedStatic?.curriculum || [],
          };
        });

        setCourses(mapped);
      } else {
        // Fallback to rich bundled freeCoursesData
        setCourses(freeCoursesData);
      }
    } catch (err) {
      console.warn("Backend free-certifications endpoint offline. Using verified static course catalog:", err?.message || err);
      // Fallback gracefully without throwing
      setCourses(freeCoursesData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    window.scrollTo(0, 0);
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filtered & sorted courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesCategory =
          selectedCategory === "All" ||
          course.category?.toLowerCase() === selectedCategory.toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          course.title.toLowerCase().includes(q) ||
          course.code.toLowerCase().includes(q) ||
          course.short_description.toLowerCase().includes(q) ||
          course.category.toLowerCase().includes(q) ||
          (course.outcomes && course.outcomes.some((o) => o.toLowerCase().includes(q)));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return b.students_count - a.students_count;
      });
  }, [courses, searchQuery, selectedCategory, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const toggleFaq = (index) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("popular");
    setCurrentPage(1);
  };

  const faqs = [
    {
      q: "Are these certification courses genuinely 100% free?",
      a: "Yes. All foundational certification courses in this catalog provide complete access to HD video lectures, downloadable PDF slide decks, study guides, timed exam attempts, and official verifiable digital certificates at absolutely zero cost.",
    },
    {
      q: "How can employers or auditors verify my certificate?",
      a: "Every certificate issued contains an official unique alphanumeric Serial ID and QR code. Employers and auditors can instantly validate authenticity by typing the serial ID into our public Certificate Verification Portal.",
    },
    {
      q: "Can I add the certificate and digital badge to my LinkedIn profile?",
      a: "Yes! Upon passing the final assessment with 70% or higher, you can immediately export your print-ready high-resolution certificate and add the verified credential directly to your LinkedIn Licenses & Certifications section.",
    },
    {
      q: "What happens if I don't pass the quiz on my first attempt?",
      a: "You can review your answer breakdown, revisit the relevant course modules, and re-attempt the quiz whenever you are ready. There are no penalty fees or attempt limits.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#08182b] via-[#0e2746] to-[#12365f] text-white py-16 sm:py-20 lg:py-24">
        {/* Subtle Background Glow & Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-500/15 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-[#F8D85A] backdrop-blur-md shadow-xs">
            <FaAward className="text-amber-400" />
            <span>100% Free Certified Training Programs</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Globally Recognized <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#F8D85A] via-amber-200 to-white bg-clip-text text-transparent">
              Free Certifications
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Advance your career in ISO Standards, Auditing, and Lean Six Sigma without financial barriers. Master foundational principles, pass the assessment, and earn verifiable credentials.
          </p>

          {/* Value Props Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 text-xs sm:text-sm font-medium text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <FaCheckCircle className="text-emerald-400" /> Zero Tuition or Hidden Fees
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <FaShieldAlt className="text-blue-400" /> ISO/IEC 17024 Aligned
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <FaDownload className="text-amber-400" /> Instant PDF Certificate Download
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================
          FILTER, SEARCH & CATALOG CONTAINER (Standardized Design Tokens)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Unified Search & Category Filter Toolbar */}
        <div className="bg-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-200/90 p-3.5 sm:p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            
            {/* Left: Standardized Filter Category Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none min-w-0 flex-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`h-[42px] px-4 rounded-[10px] text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0 border select-none active:scale-[0.98] ${
                      isActive
                        ? "bg-[#10365D] text-white border-[#10365D] shadow-xs font-semibold"
                        : "bg-white text-[#1E293B] border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300 hover:text-[#10365D]"
                    }`}
                  >
                    <span className={isActive ? "!text-white" : "!text-[#1E293B]"}>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search Field & Sorting Dropdown (Matched 42px Height & Alignment) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
              
              {/* Search Field */}
              <div className="relative w-full sm:w-64 md:w-72">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search Free Courses..."
                  className="w-full h-[42px] pl-10 pr-8 rounded-[10px] border border-[#E2E8F0] bg-white text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-bold p-1"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sorting Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort courses by"
                  className="w-full sm:w-auto h-[42px] pl-3.5 pr-8 bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-[10px] text-xs sm:text-sm font-semibold text-[#1E293B] outline-none cursor-pointer focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100 transition-colors"
                >
                  <option value="popular">Most Enrolled</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* =========================================================
          COURSES GRID & PAGINATION
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Loading State Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 p-4 space-y-4 animate-pulse shadow-xs"
              >
                <div className="aspect-[16/9] bg-slate-200 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-4/5" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Clickable Course Thumbnail Area */}
                  <Link
                    to={`/free-courses/${course.slug}`}
                    className="relative aspect-[16/9] overflow-hidden bg-slate-100 block cursor-pointer"
                    aria-label={`View syllabus for ${course.title}`}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900";
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Badges Overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-[#F8D85A] text-[#08182b] font-bold text-[10.5px] shadow-xs">
                        {course.code}
                      </span>
                      {course.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-blue-900 font-semibold text-[10px]">
                          {course.tag}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                      <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                        <FaClock className="text-amber-300 text-[10px]" />
                        {course.duration}
                      </span>
                      <span className="font-extrabold text-emerald-400 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs text-[11px] uppercase tracking-wider">
                        Free Course
                      </span>
                    </div>
                  </Link>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <FaStar className="text-[11px]" />
                          <span>{course.rating.toFixed(1)}</span>
                          <span className="text-slate-400 font-normal">({course.reviews})</span>
                        </span>
                      </div>

                      {/* Title: Direct Link to Syllabus */}
                      <Link to={`/free-courses/${course.slug}`}>
                        <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug cursor-pointer">
                          {course.title}
                        </h3>
                      </Link>

                      {/* Short Description */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {course.short_description}
                      </p>

                      {/* Key Outcomes */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                        {course.outcomes?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <FaCheckCircle className="text-emerald-500 text-[10px] mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enroll & Details CTA Buttons */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-slate-400" />
                          <span>{course.students} enrolled</span>
                        </span>
                        <span className="text-emerald-600 font-bold">
                          Certificate Included
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Syllabus Link */}
                        <Link
                          to={`/free-courses/${course.slug}`}
                          className="h-[58px] px-3 rounded-[14px] border border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-[15px] font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Syllabus</span>
                          <FaExternalLinkAlt className="text-xs text-slate-400" />
                        </Link>

                        {/* Direct Free Enrollment */}
                        <EnrollButton
                          label="Enroll Now"
                          onClick={() => handleStartCourse(course.id, course.slug)}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Page <strong className="text-slate-800">{currentPage}</strong> of{" "}
                  <strong className="text-slate-800">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                  >
                    <FaChevronLeft className="text-[10px]" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pg
                            ? "bg-[#102B4E] text-white shadow-xs"
                            : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Next</span>
                    <FaChevronRight className="text-[10px]" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-xs p-6 space-y-3">
            <FaBookOpen className="text-4xl text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No free certifications matched your filter</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search keywords, clearing your filter criteria, or exploring all available categories.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all"
            >
              <FaRedo className="text-[10px]" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </section>

      {/* =========================================================
          HOW FREE CERTIFICATION WORKS (3 STEPS)
      ========================================================= */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Straightforward 3-Step Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] mt-1">
              How You Earn Your Free Credential
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Our self-paced platform enables you to gain practical compliance skills and certified accreditation in hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xl">
                1
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Enroll with 1-Click
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose any foundation certification from our catalog and enroll instantly. No credit card, deposit, or coupon code is required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-xl">
                2
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Self-Paced Learning
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Study curriculum modules with comprehensive video lectures, interactive PDF slide decks, case studies, and reference notes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xl">
                3
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Pass Quiz & Get Certified
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take the timed multiple-choice exam. Score 70% or more to instantly unlock and download your tamper-proof credential with serial ID.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          FAQ ACCORDION SECTION
      ========================================================= */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Everything you need to know about Broadbeach Academy free certifications.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-700 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <FaChevronUp className="text-blue-600 text-xs shrink-0 ml-2" />
                  ) : (
                    <FaChevronDown className="text-slate-400 text-xs shrink-0 ml-2" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          CALL TO ACTION BANNER
      ========================================================= */}
      <section className="py-12 bg-gradient-to-r from-[#08182b] via-[#102B4E] to-[#1560bd] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Ready to Upgrade Your Professional Credentials?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Join over 25,000+ engineers, safety officers, and quality auditors certified worldwide.
            </p>
          </div>

          <Link
            to={`/enroll/${courses[0]?.id || 1}`}
            className="px-6 py-3 rounded-xl bg-[#F8D85A] hover:bg-[#eac745] active:scale-95 text-[#08182b] font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Start Free Certification Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default FreeCoursesPage;
