import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";
import { formatDropdownCourseTitle } from "../../utils/courseTitleFormatter";

/**
 * CourseDropdown Component — Broadbeach Academy LMS
 * Premium, No-Scroll Navigation Dropdown across all LMS categories.
 *
 * Requirements:
 * 1. Centered beneath the navigation item with dynamic viewport boundary clamping.
 * 2. Width: 820–850px on standard desktop/laptop screens (w-[830px] 2xl:w-[850px] max-w-[calc(100vw-32px)]).
 * 3. Compact Course Rows: exactly 44px height, vertically centered, 15–16px font, font-weight 500-600.
 * 4. Header: compact 50px height, category title on left, course count badge on right.
 * 5. Footer: compact 48-50px height, "Explore All [Category] Programs →", permanently visible.
 * 6. NO INTERNAL SCROLLBAR: When displayCourses <= 11 (Free Courses), overflow-y: auto is completely
 *    removed in favor of natural content flow (overflow-visible), ensuring all 11 courses are 100% visible
 *    simultaneously without scrolling.
 * 7. Visual Design: Rounded corners (20px), soft subtle shadow, white background, navy text, thin separators.
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

  // Centering & Viewport boundary clamp:
  // Starts centered beneath the navbar (left: 50%, translate: -50%),
  // and dynamically clamps with 20px margin if viewport edges are exceeded.
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

  // Does content fit without scrolling?
  const isNoScrollMode = displayCourses.length <= 11;

  return (
    <div
      ref={dropdownRef}
      id={`dropdown-menu-${category?.id || "courses"}`}
      role="menu"
      aria-label={`${category?.title || "Course"} options`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      style={{
        width: "780px",
        maxWidth: "calc(100vw - 32px)",
        left: "50%",
        transform: shiftX ? `translateX(calc(-50% + ${shiftX}px))` : "translateX(-50%)",
      }}
      className="hidden xl:flex absolute top-full left-1/2 w-[780px] max-w-[calc(100vw-32px)] mt-0.5 bg-white text-slate-800 rounded-[16px] shadow-[0_16px_40px_rgba(10,25,47,0.12)] border border-slate-200/80 z-50 animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex-col transition-transform duration-150 select-none"
    >
      {/* =========================================================
          1. COMPACT FIXED HEADER SECTION (44px height)
          Category Title (Left, 15px bold) | Accurate Count (Right, 12px)
      ========================================================= */}
      <div className="shrink-0 h-[44px] px-[18px] border-b border-slate-100 flex items-center justify-between bg-white rounded-t-[16px] select-none">
        <h3 className="text-[15px] font-bold uppercase tracking-wider text-[#0A192F]">
          {categoryTitle}
        </h3>
        <span className="text-[12px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80 shrink-0">
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
      </div>

      {/* Optional Track Filter Bar for categories with multiple tracks (e.g. Professional Certifications) */}
      {hasSubcategories && (
        <div className="shrink-0 px-[18px] py-1 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-dropdown-scroll select-none">
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
          2. COMPACT COURSE LIST (40px row height, all 11 fit in 1 screen)
          - For <= 11 items: overflow-visible, NO internal vertical scrollbar!
          - For > 11 items: overflow-y-auto custom-dropdown-scroll max-h-[calc(100vh-140px)]
          - Single-line title, 14.5px font, font-weight 500-600, navy text, 1.3 line-height
      ========================================================= */}
      <div
        className={
          isNoScrollMode
            ? "flex flex-col overflow-visible divide-y divide-slate-100/80"
            : "flex flex-col overflow-y-auto custom-dropdown-scroll max-h-[calc(100vh-140px)] divide-y divide-slate-100/80 overscroll-contain"
        }
      >
        {displayCourses.map((course) => {
          const formattedTitle = formatDropdownCourseTitle(course);

          return (
            <Link
              key={course.id}
              role="menuitem"
              to={getCourseUrl(course)}
              onClick={onClose}
              className="flex items-center justify-between h-[40px] min-h-[40px] px-[18px] py-1.5 text-slate-800 hover:text-[#0052CC] hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100 border-b border-slate-100/80 last:border-b-0"
            >
              {/* Single-line Course Name (Zero Icons, Zero Extra Metadata, 14.5px, 500-600 weight, Navy text, 1.3 line-height) */}
              <span
                className="flex-1 min-w-0 pr-2.5 text-[14.5px] font-medium sm:font-semibold leading-[1.3] text-[#0A192F] group-hover:text-[#0052CC] transition-colors truncate whitespace-nowrap text-left"
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
          3. COMPACT FIXED FOOTER SECTION (44px height, permanently visible)
          Footer Text: 14px bold, right-aligned arrow, subtle divider
      ========================================================= */}
      <div className="shrink-0 h-[44px] px-[18px] border-t border-slate-100 bg-slate-50/80 rounded-b-[16px] flex items-center justify-between select-none">
        <Link
          role="menuitem"
          to={categoryUrl}
          onClick={onClose}
          className="w-full flex items-center justify-between text-[14px] font-bold text-[#0052CC] hover:text-blue-700 transition-colors cursor-pointer"
        >
          <span>Explore All {category?.title} Programs</span>
          <FaChevronRight className="text-[11px] shrink-0 ml-auto" />
        </Link>
      </div>
    </div>
  );
};

export default CourseDropdown;
