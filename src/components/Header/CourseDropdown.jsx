import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";
import { formatDropdownCourseTitle } from "../../utils/courseTitleFormatter";

/**
 * CourseDropdown Component — Broadbeach Academy LMS
 * Standardized, premium course-list navigation dropdown across all LMS categories.
 *
 * Requirements:
 * - Desktop width: ~780–840px (w-[780px] 2xl:w-[820px] max-w-[calc(100vw-32px)])
 * - Max height: ~620px (max-h-[min(620px,calc(100vh-120px))])
 * - Border radius: 18px (rounded-[18px])
 * - Three independent structural sections:
 *     1. FIXED HEADER (White bg, category name left, accurate course count badge right)
 *     2. SCROLLABLE COURSE LIST (Independent scroll, ~48px row height, continuous title, right-aligned badge, no icons, no vertical separators)
 *     3. FIXED FOOTER (Subtly tinted bg, "Explore All [Category] Programs" + arrow, correct destination)
 * - Self-adjusting viewport boundary clamp preventing clipping on all viewports.
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
      const margin = 20;

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
      } w-[780px] 2xl:w-[820px] max-w-[calc(100vw-32px)] mt-2.5 bg-white text-slate-800 rounded-[18px] shadow-[0_20px_50px_rgba(10,25,47,0.16)] border border-slate-200/90 z-50 overflow-hidden animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col max-h-[min(620px,calc(100vh-120px))] transition-transform duration-150`}
    >
      {/* =========================================================
          1. FIXED HEADER SECTION (White, category title left, count badge right)
      ========================================================= */}
      <div className="shrink-0 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white select-none">
        <h3 className="text-[13px] 2xl:text-[14px] font-black uppercase tracking-wider text-[#0A192F]">
          {categoryTitle}
        </h3>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80 shrink-0">
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
      </div>

      {/* Optional Track Filter Bar for categories with multiple tracks (e.g. Professional Certifications) */}
      {hasSubcategories && (
        <div className="shrink-0 px-6 py-2 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-dropdown-scroll select-none">
          <button
            type="button"
            onClick={() => setSelectedSubcatId("all")}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
          2. INDEPENDENTLY SCROLLABLE COURSE LIST
          Height ~48px per row, Horizontal padding 20-24px
          Single continuous text element, Optional right badge, No icons, No vertical separators
      ========================================================= */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll divide-y divide-slate-100 overscroll-contain">
        {displayCourses.map((course) => {
          const formattedTitle = formatDropdownCourseTitle(course);

          return (
            <Link
              key={course.id}
              role="menuitem"
              to={getCourseUrl(course)}
              onClick={onClose}
              className="flex items-center justify-between min-h-[48px] h-[48px] px-5 sm:px-6 py-2 text-slate-800 hover:text-blue-600 hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100 border-b border-slate-100/70 last:border-b-0"
            >
              {/* Single Continuous Title Text Element (Zero Icons, Zero Pipes, Zero Secondary Columns) */}
              <span
                className="flex-1 min-w-0 pr-3 text-[14px] sm:text-[14.5px] font-semibold text-[#0A192F] group-hover:text-blue-600 transition-colors leading-snug truncate text-left"
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
          <div className="px-6 py-8 text-center text-xs text-slate-400">
            No courses available in this category.
          </div>
        )}
      </div>

      {/* =========================================================
          3. FIXED FOOTER SECTION (Subtle tint, blue link, right arrow, permanently visible)
      ========================================================= */}
      <div className="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50/80 rounded-b-[18px] flex items-center justify-between select-none">
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
