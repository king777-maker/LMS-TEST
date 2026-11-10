import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";
import { formatDropdownCourseTitle } from "../../utils/courseTitleFormatter";

/**
 * CourseDropdown Component — Broadbeach Academy LMS
 * Compact, viewport-bounded Navigation Dropdown across all LMS categories.
 *
 * Requirements:
 * 1. Centered beneath the navbar with dynamic viewport boundary clamping.
 * 2. Width: 680–700px (w-[700px] max-w-[calc(100vw-32px)]) for a clean, proportional look.
 * 3. Max Height: strictly bounded to `max-h-[min(470px,calc(100vh-110px))]` so the dropdown
 *    and its footer NEVER extend below the browser viewport frame.
 * 4. Free Courses: Dropdown header completely removed. Starts directly with the first course row.
 * 5. Compact Course Rows: exactly 34px height, vertically centered, 13px font, font-weight 500,
 *    single-line truncate, right-aligned badges (NEW, HOT, POPULAR), subtle row separators.
 * 6. Footer: compact 35px height, "Explore All [Category] Programs →", permanently visible.
 * 7. Smooth internal scrolling via custom-dropdown-scroll whenever courses exceed max height.
 * 8. Visual Design: Rounded corners (14px), soft subtle shadow, white background, navy text, thin separators.
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

  const isFreeCourses = category?.id === "free-courses" || category?.id === "free";
  const shouldShowHeader = !isFreeCourses && !category?.hideHeader;

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
  // and dynamically clamps with 16px margin if viewport edges are exceeded.
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
      setShiftX((prev) => prev + shift);
    };

    setShiftX(0);
    const raf = requestAnimationFrame(handleReposition);
    window.addEventListener("resize", handleReposition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleReposition);
    };
  }, [category, selectedSubcatId]);

  return (
    <div
      ref={dropdownRef}
      id={`dropdown-menu-${category?.id || "courses"}`}
      role="menu"
      aria-label={`${category?.title || "Course"} options`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      style={{
        width: "700px",
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "min(470px, calc(100vh - 110px))",
        left: "50%",
        transform: shiftX ? `translateX(calc(-50% + ${shiftX}px))` : "translateX(-50%)",
      }}
      className="hidden xl:flex absolute top-full left-1/2 w-[700px] max-w-[calc(100vw-32px)] max-h-[min(470px,calc(100vh-110px))] mt-0.5 bg-white text-slate-800 rounded-[14px] shadow-[0_12px_36px_rgba(10,25,47,0.14)] border border-slate-200/90 z-50 animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex-col transition-transform duration-150 select-none"
    >
      {/* =========================================================
          1. CATEGORY HEADER (Completely removed for Free Courses:
          No "FREE COURSES" heading, No "11 Courses" badge, No separator)
      ========================================================= */}
      {shouldShowHeader && (
        <div className="shrink-0 h-[34px] px-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-[14px] select-none">
          <h3 className="text-[12.5px] font-bold uppercase tracking-wider text-[#0A192F]">
            {categoryTitle}
          </h3>
          <span className="text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/80 shrink-0 leading-none">
            {courseCount} {courseCount === 1 ? "Course" : "Courses"}
          </span>
        </div>
      )}

      {/* Optional Track Filter Bar for categories with multiple tracks (e.g. Professional Certifications) */}
      {hasSubcategories && (
        <div className="shrink-0 px-4 py-1 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-dropdown-scroll select-none">
          <button
            type="button"
            onClick={() => setSelectedSubcatId("all")}
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer leading-tight ${
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
              className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer leading-tight ${
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
          2. COMPACT COURSE LIST (34px row height, fits cleanly in frame)
          - Single-line title, 13px font, font-weight 500, navy text
          - Flex-1 min-h-0 with internal scrollbar ensures footer is ALWAYS visible
            and dropdown NEVER goes below the viewport frame
      ========================================================= */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll divide-y divide-slate-100/80 overscroll-contain">
        {displayCourses.map((course, index) => {
          const formattedTitle = formatDropdownCourseTitle(course);
          const isFirstItem = index === 0;

          return (
            <Link
              key={course.id}
              role="menuitem"
              to={getCourseUrl(course)}
              onClick={onClose}
              className={`flex items-center justify-between h-[34px] min-h-[34px] px-4 py-1 text-slate-800 hover:text-[#0052CC] hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100 border-b border-slate-100/80 last:border-b-0 ${
                isFirstItem && !shouldShowHeader && !hasSubcategories
                  ? "rounded-t-[14px]"
                  : ""
              }`}
            >
              {/* Single-line Course Name */}
              <span
                className="flex-1 min-w-0 pr-2.5 text-[13px] font-medium leading-normal text-[#0A192F] group-hover:text-[#0052CC] transition-colors truncate whitespace-nowrap text-left"
                title={formattedTitle}
              >
                {formattedTitle}
              </span>

              {/* Right-Aligned Promotional Badges (NEW, HOT, POPULAR) */}
              {course.badge && <PromoBadge badge={course.badge} />}
            </Link>
          );
        })}

        {displayCourses.length === 0 && (
          <div className="px-4 py-5 text-center text-xs text-slate-400">
            No courses available in this category.
          </div>
        )}
      </div>

      {/* =========================================================
          3. COMPACT FIXED FOOTER SECTION (35px height, permanently visible)
          Footer Text: 12.5px bold, right-aligned arrow, subtle divider
      ========================================================= */}
      <div className="shrink-0 h-[35px] px-4 border-t border-slate-100 bg-slate-50/90 rounded-b-[14px] flex items-center justify-between select-none">
        <Link
          role="menuitem"
          to={categoryUrl}
          onClick={onClose}
          className="w-full flex items-center justify-between text-[12.5px] font-bold text-[#0052CC] hover:text-blue-700 transition-colors cursor-pointer leading-none"
        >
          <span>Explore All {category?.title} Programs</span>
          <FaChevronRight className="text-[10px] shrink-0 ml-auto" />
        </Link>
      </div>
    </div>
  );
};

export default CourseDropdown;
