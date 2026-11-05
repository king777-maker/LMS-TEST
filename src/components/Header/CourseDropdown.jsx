import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";

/**
 * CourseDropdown Component
 * Standardized, compact, premium course-list dropdown for all LMS navigation categories.
 * Enforces:
 * - Desktop width: ~500px, max-width: calc(100vw - 32px)
 * - Max-height: dynamically bounded to viewport height (max-h-[calc(100vh-120px)])
 * - Border radius: 16px (rounded-[16px])
 * - Three independent structural sections:
 *     1. HEADER (fixed, shrink-0, compact height, category name + accurate course count)
 *     2. COURSE LIST (scrollable, flex-1, min-height: 0, overflow-y: auto)
 *     3. FOOTER (fixed, shrink-0, "Explore All [Category] Programs" + arrow)
 * - Compact course rows:
 *     - Height: ~50px (min-h-[50px])
 *     - Horizontal padding: 24–28px (px-6)
 *     - Title aligned left, zero icons, zero metadata
 *     - Optional promotional badge aligned right
 *     - Subtle horizontal divider between courses
 */
const CourseDropdown = ({
  category,
  courses = [],
  isRightAligned = false,
  onClose,
  cancelClose,
  scheduleClose,
}) => {
  const [selectedSubcatId, setSelectedSubcatId] = useState("all");

  const hasSubcategories = Array.isArray(category?.subcategories) && category.subcategories.length > 0;
  
  // Normalize course list: if category has flat courses array, use it; otherwise gather from subcategories
  const allCourses = useMemo(() => {
    if (Array.isArray(courses) && courses.length > 0) return courses;
    if (Array.isArray(category?.courses) && category.courses.length > 0) return category.courses;
    if (hasSubcategories) {
      return category.subcategories.flatMap((sc) => sc.courses || []);
    }
    return [];
  }, [courses, category, hasSubcategories]);

  // Filtered courses based on selected subcategory track (if subcategories exist)
  const displayCourses = useMemo(() => {
    if (!hasSubcategories || selectedSubcatId === "all") {
      return allCourses;
    }
    const targetSubcat = category.subcategories.find((sc) => sc.id === selectedSubcatId);
    return targetSubcat?.courses || allCourses;
  }, [hasSubcategories, selectedSubcatId, allCourses, category]);

  const courseCount = displayCourses.length;
  const categoryTitle = (category?.title || "COURSES").toUpperCase();

  const categoryUrl =
    category?.id === "free-courses"
      ? "/free-courses"
      : `/${category?.slug || category?.id || "courses"}`;

  const getCourseUrl = (course) => {
    return `/courses/${course.id || course.slug}`;
  };

  return (
    <div
      id={`dropdown-menu-${category?.id || "courses"}`}
      role="menu"
      aria-label={`${category?.title || "Course"} options`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      className={`absolute top-full ${
        isRightAligned ? "right-0" : "left-0"
      } w-[500px] max-w-[calc(100vw-32px)] mt-2.5 bg-white text-slate-800 rounded-[16px] shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col max-h-[calc(100vh-120px)] sm:max-h-[min(540px,calc(100vh-120px))]`}
    >
      {/* =========================================================
          1. FIXED HEADER SECTION (Never scrolls away)
          Category Name (Left)  |  Accurate Course Count (Right)
      ========================================================= */}
      <div className="shrink-0 px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white select-none">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
          {categoryTitle}
        </h3>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80">
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
      </div>

      {/* Optional Track Filter Bar for categories with multiple tracks (e.g. Professional Certifications) */}
      {hasSubcategories && (
        <div className="shrink-0 px-6 py-2 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-dropdown-scroll select-none">
          <button
            type="button"
            onClick={() => setSelectedSubcatId("all")}
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer ${
              selectedSubcatId === "all"
                ? "bg-[#0A192F] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80"
            }`}
          >
            All Tracks ({allCourses.length})
          </button>
          {category.subcategories.map((subcat) => (
            <button
              key={subcat.id}
              type="button"
              onClick={() => setSelectedSubcatId(subcat.id)}
              className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer ${
                selectedSubcatId === subcat.id
                  ? "bg-[#0A192F] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80"
              }`}
            >
              {subcat.shortTitle || subcat.title} ({subcat.courses?.length || 0})
            </button>
          ))}
        </div>
      )}

      {/* =========================================================
          2. SCROLLABLE COURSE LIST
          Height ~50px per row, Horizontal padding 24–28px (px-6)
          Course title left, Promo badge right, subtle divider
          Zero icons, zero secondary metadata
      ========================================================= */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll divide-y divide-slate-100 overscroll-contain">
        {displayCourses.map((course) => (
          <Link
            key={course.id}
            role="menuitem"
            to={getCourseUrl(course)}
            onClick={onClose}
            className="flex items-center justify-between min-h-[50px] px-6 py-2.5 text-slate-800 hover:text-blue-600 hover:bg-slate-50/80 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100"
          >
            {/* Course Title Only (No Icons, No Descriptions, No Subtitles, No Metadata) */}
            <span className="text-[13px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug pr-3 text-left line-clamp-2">
              {course.title}
            </span>

            {/* Optional Right-Aligned Promotional Badge */}
            {course.badge && <PromoBadge badge={course.badge} />}
          </Link>
        ))}

        {displayCourses.length === 0 && (
          <div className="px-6 py-8 text-center text-xs text-slate-400">
            No courses available in this category.
          </div>
        )}
      </div>

      {/* =========================================================
          3. FIXED FOOTER SECTION (Never scrolls away)
          Permanently visible, subtle top divider, brand blue link
      ========================================================= */}
      <div className="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50/80 rounded-b-[16px] flex items-center justify-between select-none">
        <Link
          role="menuitem"
          to={categoryUrl}
          onClick={onClose}
          className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <span>Explore All {category?.title} Programs</span>
          <FaChevronRight className="text-[10px]" />
        </Link>
      </div>
    </div>
  );
};

export default CourseDropdown;
