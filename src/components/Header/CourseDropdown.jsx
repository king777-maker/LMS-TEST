import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";
import { formatDropdownCourseTitle } from "../../utils/courseTitleFormatter";

/**
 * CourseDropdown Component — Broadbeach Academy LMS
 * Standardized, compact, premium course-list navigation dropdown across all LMS categories.
 *
 * Primary Objectives:
 * - Displays ALL 11 Free Courses simultaneously on standard desktop/laptop screens without an internal scrollbar.
 * - Width: 820–850px (w-[820px] 2xl:w-[840px] max-w-[calc(100vw-32px)])
 * - Compact Header: ~50px height, Category title left, count badge right
 * - Compact Course Rows: exactly 42px height, vertically centered, continuous single-line titles, right badges
 * - Compact Footer: ~50px height, "Explore All [Category] Programs →", permanently visible
 * - Total height for 11 courses: ~562px (50px header + 11 * 42px rows + 50px footer), fitting within 768p/800p/900p/1080p viewports
 * - Automatic boundary clamp preventing viewport clipping.
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
  const dropdownRef = useRef(null);
  const [shiftX, setShiftX] = useState(0);

  const hasSubcategories = Array.isArray(category?.subcategories) && category.subcategories.length > 0;

  // Gather courses: either flat or gathered from subcategories
  const allCourses = useMemo(() => {
    if (Array.isArray(courses) && courses.length > 0) return courses;
    if (Array.isArray(category?.courses) && category.courses.length > 0) return category.courses;
    if (hasSubcategories) {
      return category.subcategories.flatMap((sc) => sc.courses || []);
    }
    return [];
  }, [courses, category, hasSubcategories]);

  // Filtered courses based on selected track (if subcategories exist)
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

  // Viewport boundary clamp: automatically shifts the dropdown if it touches or overflows viewport edges
  useEffect(() => {
    const handleReposition = () => {
      if (!dropdownRef.current) return;
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const margin = 16;

      let shift = 0;
      if (rect.right > viewportWidth - margin) {
        shift = viewportWidth - margin - rect.right;
      } else if (rect.left < margin) {
        shift = margin - rect.left;
      }
      setShiftX(shift);
    };

    handleReposition();
    window.addEventListener("resize", handleReposition);
    return () => window.removeEventListener("resize", handleReposition);
  }, [category, selectedSubcatId]);

  return (
    <div
      ref={dropdownRef}
      id={`dropdown-menu-${category?.id || "courses"}`}
      role="menu"
      aria-label={`${category?.title || "Course"} options`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      style={shiftX ? { transform: `translateX(${shiftX}px)` } : undefined}
      className={`absolute top-full ${
        isRightAligned ? "right-0" : "left-0"
      } w-[820px] 2xl:w-[840px] max-w-[calc(100vw-32px)] mt-1.5 bg-white text-slate-800 rounded-[18px] shadow-[0_20px_50px_rgba(10,25,47,0.16)] border border-slate-200/90 z-50 overflow-hidden animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col max-h-[calc(100vh-96px)] transition-transform duration-150`}
    >
      {/* =========================================================
          1. COMPACT FIXED HEADER SECTION (~50px height)
          Category Name (Left)  |  Accurate Course Count (Right)
      ========================================================= */}
      <div className="shrink-0 h-[50px] px-5 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white select-none">
        <h3 className="text-[13px] 2xl:text-[14px] font-black uppercase tracking-wider text-[#0A192F]">
          {categoryTitle}
        </h3>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80 shrink-0">
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
      </div>

      {/* Optional Track Filter Bar for categories with multiple tracks (e.g. Professional Certifications) */}
      {hasSubcategories && (
        <div className="shrink-0 px-5 sm:px-6 py-1.5 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-dropdown-scroll select-none">
          <button
            type="button"
            onClick={() => setSelectedSubcatId("all")}
            className={`shrink-0 px-3 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
              className={`shrink-0 px-3 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
          2. COMPACT COURSE LIST (42px row height, all 11 fit in 1 screen)
          Height: exactly 42px per row, no vertical scrollbar for 11 items
          Vertically centered, continuous title text, right promo badge
      ========================================================= */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto ${
          displayCourses.length <= 11 ? "scrollbar-none" : "custom-dropdown-scroll"
        } divide-y divide-slate-100/70 overscroll-contain`}
      >
        {displayCourses.map((course) => {
          const formattedTitle = formatDropdownCourseTitle(course);

          return (
            <Link
              key={course.id}
              role="menuitem"
              to={getCourseUrl(course)}
              onClick={onClose}
              className="flex items-center justify-between h-[42px] min-h-[42px] px-5 sm:px-6 text-slate-800 hover:text-blue-600 hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100 border-b border-slate-100/70 last:border-b-0"
            >
              {/* Single Continuous Title Text Element (Zero Icons, Zero Pipes, Zero Secondary Columns) */}
              <span
                className="flex-1 min-w-0 pr-3 text-[14px] sm:text-[14.5px] font-semibold text-[#0A192F] group-hover:text-blue-600 transition-colors leading-none truncate text-left"
                title={formattedTitle}
              >
                {formattedTitle}
              </span>

              {/* Optional Right-Aligned Promotional Badge */}
              {course.badge && <PromoBadge badge={course.badge} />}
            </Link>
          );
        })}

        {displayCourses.length === 0 && (
          <div className="px-6 py-6 text-center text-xs text-slate-400">
            No courses available in this category.
          </div>
        )}
      </div>

      {/* =========================================================
          3. COMPACT FIXED FOOTER SECTION (~50px height, permanently visible)
      ========================================================= */}
      <div className="shrink-0 h-[50px] px-5 sm:px-6 border-t border-slate-100 bg-slate-50/80 rounded-b-[18px] flex items-center justify-between select-none">
        <Link
          role="menuitem"
          to={categoryUrl}
          onClick={onClose}
          className="w-full flex items-center justify-between text-xs sm:text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <span>Explore All {category?.title} Programs</span>
          <FaChevronRight className="text-[11px]" />
        </Link>
      </div>
    </div>
  );
};

export default CourseDropdown;
