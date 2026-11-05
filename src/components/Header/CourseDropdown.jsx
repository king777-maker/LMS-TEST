import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";

/**
 * CourseDropdown Component
 * Standardized, premium, minimal course-list dropdown for all LMS navigation categories.
 * Enforces:
 * - Fixed Header: Category Name (uppercase) + Course Count
 * - Clean Course List: Course Name Only on left, Optional Promo Badge on right, Subtle Divider
 * - Zero Icons before course names
 * - Zero Metadata (no descriptions, no durations, no access labels, no subtitles)
 * - Fixed Footer: Explore all category programs link
 */
const CourseDropdown = ({
  category,
  courses = [],
  activeSubcategory = null,
  isRightAligned = false,
  onClose,
  cancelClose,
  scheduleClose,
}) => {
  const categoryTitle = (activeSubcategory?.title || category?.title || "COURSES").toUpperCase();
  const courseList = Array.isArray(courses) ? courses : [];
  const courseCount = courseList.length;

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
      } w-[520px] max-w-[calc(100vw-32px)] mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col max-h-[620px]`}
    >
      {/* =========================================================
          FIXED HEADER SECTION
          Category Name (Left)  |  Total Course Count (Right)
      ========================================================= */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white select-none">
        <h3 className="text-[12px] font-black uppercase tracking-wider text-[#0A192F]">
          {categoryTitle}
        </h3>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80">
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </span>
      </div>

      {/* =========================================================
          CLEAN COURSE LIST (Internally Scrollable, Fixed Height)
          Course Name Only  |  Optional Right-Aligned Promo Badge
          Subtle horizontal dividers between items
      ========================================================= */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll divide-y divide-slate-100/90 overscroll-contain">
        {courseList.map((course) => (
          <Link
            key={course.id}
            role="menuitem"
            to={getCourseUrl(course)}
            onClick={onClose}
            className="flex items-center justify-between px-6 py-3 text-slate-800 hover:text-blue-600 hover:bg-slate-50/80 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100"
          >
            {/* Course Title Only (No Icons, No Descriptions, No Subtitles) */}
            <span className="text-[13.5px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug pr-3">
              {course.title}
            </span>

            {/* Optional Right-Aligned Promotional Badge */}
            {course.badge && <PromoBadge badge={course.badge} />}
          </Link>
        ))}

        {courseList.length === 0 && (
          <div className="px-6 py-8 text-center text-xs text-slate-400">
            No courses available in this category.
          </div>
        )}
      </div>

      {/* =========================================================
          FIXED FOOTER SECTION
      ========================================================= */}
      <div className="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl flex items-center justify-between select-none">
        <Link
          role="menuitem"
          to={categoryUrl}
          onClick={onClose}
          className="w-full flex items-center justify-between text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <span>Explore all {category?.title} programs</span>
          <FaChevronRight className="text-[9.5px]" />
        </Link>
      </div>
    </div>
  );
};

export default CourseDropdown;
