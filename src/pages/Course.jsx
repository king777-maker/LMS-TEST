import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CourseSidebar from "../components/CourseSidebar/CourseSidebar";
import CourseCard from "../components/CourseCard/CourseCard";
import Pagination from "../components/Pagination/Pagination";
import { courseData } from "../data/courseData";
import { freeCoursesData } from "../data/freeCoursesData";
import { FiSearch, FiGift, FiAward, FiLayers, FiX } from "react-icons/fi";
import SEO from "../components/common/SEO";
import Breadcrumbs from "../components/common/Breadcrumbs";
import EmptyState from "../components/common/EmptyState";
import analytics from "../utils/analytics";

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params with defaults
  const typeFilter = searchParams.get("type") || "all";
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const selectedLevel = searchParams.get("level") || "All";

  // Unified course collection combining free certifications and paid courses
  const allCourses = useMemo(() => {
    const free = freeCoursesData.map((c) => ({
      id: String(c.id),
      title: c.name || c.title,
      description: c.short_description || c.description,
      category: c.category || "Quality Management",
      level: c.level || "Beginner",
      hours: c.duration || "12 Hours",
      students: c.students || "2,850",
      badge: "Free Certification",
      price: 0,
      isFree: true,
      image: c.image,
      slug: c.slug,
    }));

    const paid = courseData.map((c) => ({
      ...c,
      price: Number(c.price || 99),
      isFree: false,
    }));

    return [...free, ...paid];
  }, []);

  // Update query params helper
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all" || value === "All") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    }, { replace: true });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    updateParam("search", query);
    if (query.trim().length > 2) {
      analytics.courseSearch(query, filteredCourses.length);
    }
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Filtered courses calculation
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // 1. Type Filter (Free vs Paid)
      if (typeFilter === "free" && course.price !== 0) return false;
      if (typeFilter === "paid" && course.price === 0) return false;

      // 2. Search Query Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          course.title.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q) ||
          course.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== "All") {
        const cat = selectedCategory.toLowerCase();
        const matchesCategory =
          course.category.toLowerCase().includes(cat) ||
          course.title.toLowerCase().includes(cat);
        if (!matchesCategory) return false;
      }

      // 4. Level Filter
      if (selectedLevel !== "All") {
        const lvl = selectedLevel.toLowerCase();
        if (course.level.toLowerCase() !== lvl) return false;
      }

      return true;
    });
  }, [allCourses, typeFilter, searchQuery, selectedCategory, selectedLevel]);

  // Counts for sidebar badges
  const freeCount = allCourses.filter((c) => c.price === 0).length;
  const paidCount = allCourses.filter((c) => c.price > 0).length;

  const hasActiveFilters =
    typeFilter !== "all" ||
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedLevel !== "All";

  return (
    <div className="bg-[#F7FAFF] min-h-screen">
      <SEO
        title="All Courses & Accredited Certifications"
        description="Explore globally accredited online certifications in ISO 9001, ISO 14001, ISO 45001, ISO 27001, Lean Six Sigma, and Food Safety."
        breadcrumbs={[{ name: "Courses", url: "/course" }]}
      />
      <Breadcrumbs items={[{ name: "All Courses" }]} />

      <section className="py-10 sm:py-14">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Quick-Switcher Filter Hierarchy (Free / Paid / All) */}
          <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1.5">
                <FiLayers className="text-blue-600" /> Filter:
              </span>

              {/* All Courses Button */}
              <button
                type="button"
                onClick={() => updateParam("type", "all")}
                className={`h-[42px] px-4 rounded-[10px] text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-2 cursor-pointer border select-none active:scale-[0.98] ${
                  typeFilter === "all"
                    ? "bg-[#10365D] text-white border-[#10365D] shadow-xs font-semibold"
                    : "bg-white text-[#1E293B] border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>All Certifications</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${typeFilter === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                  {allCourses.length}
                </span>
              </button>

              {/* Free Certified Programs Button */}
              <button
                type="button"
                onClick={() => updateParam("type", "free")}
                className={`h-[42px] px-4 rounded-[10px] text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-2 cursor-pointer border select-none active:scale-[0.98] ${
                  typeFilter === "free"
                    ? "bg-[#10365D] text-white border-[#10365D] shadow-xs font-semibold"
                    : "bg-white text-[#1E293B] border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <FiGift className={typeFilter === "free" ? "text-[#FFD43B]" : "text-emerald-600"} />
                <span>Free Programs (100% Free)</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${typeFilter === "free" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                  {freeCount}
                </span>
              </button>

              {/* Paid Courses Button */}
              <button
                type="button"
                onClick={() => updateParam("type", "paid")}
                className={`h-[42px] px-4 rounded-[10px] text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-2 cursor-pointer border select-none active:scale-[0.98] ${
                  typeFilter === "paid"
                    ? "bg-[#10365D] text-white border-[#10365D] shadow-xs font-semibold"
                    : "bg-white text-[#1E293B] border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <FiAward className={typeFilter === "paid" ? "text-[#FFD43B]" : "text-amber-500"} />
                <span>Paid Professional</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${typeFilter === "paid" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                  {paidCount}
                </span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <FiX className="text-sm" /> Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar with interactive filters */}
            <div className="col-span-12 lg:col-span-3 xl:col-span-2">
              <CourseSidebar
                typeFilter={typeFilter}
                selectedCategory={selectedCategory}
                selectedLevel={selectedLevel}
                onTypeFilterChange={(val) => updateParam("type", val)}
                onCategoryChange={(val) => updateParam("category", val)}
                onLevelChange={(val) => updateParam("level", val)}
                onResetFilters={handleResetFilters}
                totalCount={allCourses.length}
                freeCount={freeCount}
                paidCount={paidCount}
              />
            </div>

            {/* Right Side Content */}
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              {/* Search & Secondary Filter Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 mb-6">
                <div className="relative w-full max-w-[650px]">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by course title, standard (e.g. ISO 9001), or topic..."
                    className="w-full h-[46px] rounded-[10px] border border-[#E2E8F0] bg-white pl-11 pr-8 outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100 transition-all text-sm text-[#1E293B]"
                    aria-label="Search courses"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => updateParam("search", "")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Clear search"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => updateParam("category", e.target.value)}
                    className="w-full sm:w-[240px] h-[46px] rounded-[10px] border border-[#E2E8F0] px-3.5 bg-white font-medium text-xs sm:text-sm text-[#1E293B] outline-none cursor-pointer focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
                    aria-label="Filter by specialization track"
                  >
                    <option value="All">All Categories</option>
                    <option value="Quality">Quality (ISO 9001)</option>
                    <option value="Safety">Safety & EHS (ISO 45001)</option>
                    <option value="Environment">Environment (ISO 14001)</option>
                    <option value="Security">Security (ISO 27001)</option>
                    <option value="Food">Food Safety (ISO 22000)</option>
                    <option value="Lean">Lean Six Sigma</option>
                    <option value="Auditing">Auditing (ISO 19011)</option>
                    <option value="Lead Auditor">Lead Auditor</option>
                    <option value="Internal Auditor">Internal Auditor</option>
                  </select>
                </div>
              </div>

              {/* Active Results Summary & Active Filter Tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs sm:text-sm text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <p>
                    Showing <span className="font-bold text-[#131E4A]">{filteredCourses.length}</span> published certification{filteredCourses.length !== 1 ? "s" : ""}
                  </p>

                  {typeFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-200">
                      Type: {typeFilter === "free" ? "Free Only" : "Paid Only"}
                      <button type="button" onClick={() => updateParam("type", "all")} className="hover:text-blue-900"><FiX /></button>
                    </span>
                  )}

                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-200">
                      Category: {selectedCategory}
                      <button type="button" onClick={() => updateParam("category", "All")} className="hover:text-amber-950"><FiX /></button>
                    </span>
                  )}

                  {selectedLevel !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200">
                      Level: {selectedLevel}
                      <button type="button" onClick={() => updateParam("level", "All")} className="hover:text-emerald-950"><FiX /></button>
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-[#131E4A] hover:text-[#F7C600] underline cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Course Cards Grid or Empty State */}
              {filteredCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                  <div className="mt-10">
                    <Pagination />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
                  <EmptyState
                    title="No matching courses found"
                    description={`We couldn't find any courses matching your current filter criteria${searchQuery ? ` ("${searchQuery}")` : ""}. Try adjusting or resetting your filters.`}
                    actionText="Reset All Filters"
                    onAction={handleResetFilters}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;