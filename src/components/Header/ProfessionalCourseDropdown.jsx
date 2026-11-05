import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import PromoBadge from "./PromoBadge";

/**
 * ProfessionalCourseDropdown Component
 * Two-panel categorized course directory for Professional Certifications.
 * Left panel: Specialized tracks/categories.
 * Right panel: Clean course rows (Course Name only + Optional Right-Aligned Promo Badge).
 * Zero icons, zero subtitles, zero metadata.
 */
const ProfessionalCourseDropdown = ({
  category,
  activeSubcategoryId,
  setActiveSubcategoryId,
  onClose,
  cancelClose,
  scheduleClose,
}) => {
  const categoryListRef = useRef(null);

  const subcategories = Array.isArray(category?.subcategories)
    ? category.subcategories
    : [];

  const activeSubcat =
    subcategories.find((sc) => sc.id === activeSubcategoryId) ||
    subcategories[0];

  const courses = Array.isArray(activeSubcat?.courses)
    ? activeSubcat.courses
    : [];

  // Keyboard navigation inside category tabs
  const handleCategoryNavKeyDown = (e) => {
    if (!subcategories || subcategories.length === 0) return;
    const currentIndex = subcategories.findIndex(
      (sc) => sc.id === activeSubcategoryId
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % subcategories.length;
      setActiveSubcategoryId(subcategories[nextIndex].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + subcategories.length) % subcategories.length;
      setActiveSubcategoryId(subcategories[prevIndex].id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelClose();
      onClose();
    }
  };

  // Keep active category in view inside the scrollable left panel
  useEffect(() => {
    if (activeSubcategoryId && categoryListRef.current) {
      const activeBtn = categoryListRef.current.querySelector(
        `[data-subcat-id="${activeSubcategoryId}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeSubcategoryId]);

  return (
    <div
      id={`dropdown-menu-${category.id}`}
      role="menu"
      aria-label={`${category.title} options`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      className="absolute top-full right-0 w-[840px] max-w-[calc(100vw-32px)] mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col h-[520px] max-h-[620px]"
    >
      {/* =========================================================
          TOP CATEGORY DIRECTORY HEADER
      ========================================================= */}
      <div className="shrink-0 px-6 py-3.5 bg-[#0A192F] text-white flex items-center justify-between border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="text-[12px] font-black uppercase tracking-wider text-white">
            {category.title} Directory
          </h3>
          <span className="text-[10px] font-bold text-[#0A192F] bg-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
            {subcategories.length} Specialized Tracks • {category.courses?.length || 0} Credentials
          </span>
        </div>
        <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
          Accredited & ISO Aligned Qualifications
        </span>
      </div>

      {/* =========================================================
          TWO-PANEL BODY (Left: Category Tabs | Right: Clean Course Rows)
      ========================================================= */}
      <div className="flex-1 min-h-0 flex divide-x divide-slate-100 overflow-hidden">
        
        {/* LEFT PANEL: VERTICAL CATEGORY TABS */}
        <div
          className="w-[280px] shrink-0 h-full min-h-0 bg-slate-50/90 flex flex-col border-r border-slate-200/70 overflow-hidden select-none"
          role="tablist"
          aria-label="Certification Categories"
        >
          <div className="shrink-0 px-4 py-2.5 border-b border-slate-200/60 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between bg-slate-100/70">
            <span>Specialized Tracks</span>
            <span>Courses</span>
          </div>

          <div
            ref={categoryListRef}
            onKeyDown={handleCategoryNavKeyDown}
            className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll p-2 space-y-1 focus:outline-none"
            tabIndex={0}
            aria-label="Category list navigation (Use Up and Down arrow keys to switch)"
          >
            {subcategories.map((subcat) => {
              const isActive = activeSubcat?.id === subcat.id;
              return (
                <button
                  key={subcat.id}
                  data-subcat-id={subcat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveSubcategoryId(subcat.id)}
                  onClick={() => setActiveSubcategoryId(subcat.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive
                      ? "bg-[#0A192F] text-white shadow-md font-bold"
                      : "text-slate-700 hover:bg-white hover:text-[#0A192F]"
                  }`}
                >
                  <span className="truncate leading-tight pr-2">
                    {subcat.shortTitle || subcat.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                      isActive
                        ? "bg-amber-400 text-[#0A192F]"
                        : "bg-slate-200/80 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700"
                    }`}
                  >
                    {subcat.courses.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: CLEAN COURSE LIST */}
        <div className="flex-1 h-full min-h-0 flex flex-col justify-between bg-white min-w-0 overflow-hidden">
          
          {/* Active Track Header Section */}
          <div className="shrink-0 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white select-none">
            <h4 className="text-[12px] font-black uppercase tracking-wider text-[#0A192F] truncate pr-2">
              {activeSubcat?.title?.toUpperCase() || "PROGRAMS"}
            </h4>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80 shrink-0">
              {courses.length} {courses.length === 1 ? "Course" : "Courses"}
            </span>
          </div>

          {/* Clean Course List (Course Name Only + Optional Right-Aligned Promo Badge) */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll divide-y divide-slate-100 overscroll-contain">
            {courses.map((course) => (
              <Link
                key={course.id}
                role="menuitem"
                to={`/courses/${course.id}`}
                onClick={onClose}
                className="flex items-center justify-between px-6 py-3 text-slate-800 hover:text-blue-600 hover:bg-slate-50/80 transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100"
              >
                {/* Course Title Only */}
                <span className="text-[13.5px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug pr-3">
                  {course.title}
                </span>

                {/* Optional Right-Aligned Promotional Badge */}
                {course.badge && <PromoBadge badge={course.badge} />}
              </Link>
            ))}

            {courses.length === 0 && (
              <div className="px-6 py-8 text-center text-xs text-slate-400">
                No courses listed for this track.
              </div>
            )}
          </div>

          {/* Fixed Footer Link */}
          <div className="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between select-none">
            <Link
              to={activeSubcat?.courses[0] ? `/courses/${activeSubcat.courses[0].id}` : `/category/${category.slug || category.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-between text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>Explore all {activeSubcat?.title} certifications</span>
              <FaChevronRight className="text-[9.5px]" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfessionalCourseDropdown;
