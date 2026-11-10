import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes, FaAward } from "react-icons/fa";
import { navigationCategories } from "../../data/coursesData";
import BrandLogo from "./BrandLogo";
import SearchBar from "./SearchBar";
import CourseDropdown from "./CourseDropdown";

const MainNavbar = ({ onToggleMobile, isMobileOpen }) => {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const closeTimeoutRef = useRef(null);
  const navContainerRef = useRef(null);

  // Cancel any scheduled dropdown close
  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Grace window prevents flicker during diagonal pointer movement
  const scheduleClose = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 180);
  };

  const handleMouseEnter = (categoryId) => {
    cancelClose();
    setOpenDropdownId(categoryId);
  };

  const handleMouseLeave = () => {
    scheduleClose();
  };

  const handleCloseDropdown = () => {
    cancelClose();
    setOpenDropdownId(null);
  };

  const getCategoryUrl = (cat) =>
    cat.id === "free-courses" ? "/free-courses" : `/${cat.slug || cat.id}`;

  const handleTriggerClick = (category) => {
    cancelClose();
    setOpenDropdownId((prev) => (prev === category.id ? null : category.id));
  };

  const handleKeyDown = (e, category) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTriggerClick(category);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cancelClose();
      setOpenDropdownId(category.id);
    } else if (e.key === "Escape") {
      cancelClose();
      handleCloseDropdown();
    }
  };

  // Close when clicking outside of the navbar or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        cancelClose();
        setOpenDropdownId(null);
      }
    };

    const handleWindowKeyDown = (e) => {
      if (e.key === "Escape") {
        cancelClose();
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      cancelClose();
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, []);

  const activeCategory = navigationCategories.find(
    (cat) => cat.id === openDropdownId
  );

  return (
    <div
      ref={navContainerRef}
      className="w-full bg-[#131E4A] text-white relative shadow-md select-none z-40 border-t border-white/10"
    >
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 2xl:px-8 flex items-center justify-between gap-2 xl:gap-3 w-full h-[52px] sm:h-[54px]">
        
        {/* =======================================================
            LEFT: BRAND LOGO + HORIZONTAL NAVIGATION LINKS
        ======================================================= */}
        <div className="flex items-center gap-2 lg:gap-3 2xl:gap-5 min-w-0 shrink">
          {/* Anchored Brand Logo on Far Left Corner */}
          <BrandLogo className="shrink-0" />

          {/* Desktop Navigation Links */}
          <nav
            className="hidden xl:flex items-center gap-1 xl:gap-1.5 2xl:gap-3 min-w-0 shrink"
            aria-label="Main Navigation Categories"
          >
            {navigationCategories.map((category) => {
              const isOpen = openDropdownId === category.id;

              return (
                <div
                  key={category.id}
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                  className="flex items-center shrink-0"
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={`dropdown-menu-${category.id}`}
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleTriggerClick(category)}
                    onKeyDown={(e) => handleKeyDown(e, category)}
                    className={`flex items-center gap-1 px-2 py-1 xl:px-2.5 2xl:px-3 rounded-md text-[11.5px] xl:text-xs 2xl:text-[13px] font-bold text-white whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 leading-none ${
                      isOpen
                        ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                        : "text-white/95 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{category.title}</span>
                    <FaChevronDown
                      className={`text-[7.5px] 2xl:text-[8px] ml-0.5 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-amber-300" : "text-white/70"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* =======================================================
            TABLET / MOBILE HAMBURGER BUTTON
        ======================================================= */}
        <div className="flex xl:hidden items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-label={
              isMobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={onToggleMobile}
            className="flex items-center gap-1.5 px-2.5 h-7.5 sm:h-8 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer border border-white/20 transition-all leading-none"
          >
            {isMobileOpen ? (
              <FaTimes className="text-xs" />
            ) : (
              <FaBars className="text-xs" />
            )}
            <span className="hidden sm:inline">Browse Categories</span>
          </button>
        </div>

        {/* =======================================================
            RIGHT CONTROLS CONTAINER: SEARCH BAR & VERIFY CERTIFICATE
        ======================================================= */}
        <div className="flex items-center gap-1.5 xl:gap-2.5 shrink-0">
          <SearchBar />
          <Link
            to="/verify-certificate"
            className="shrink-0 whitespace-nowrap h-7.5 xl:h-8 px-2.5 xl:px-3 text-[11px] xl:text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-[#07162c] shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:shadow-md cursor-pointer leading-none"
            aria-label="Verify Certificate"
          >
            <FaAward className="text-[11px] text-[#07162c] group-hover:rotate-12 transition-transform duration-200 shrink-0" />
            <span>Verify Certificate</span>
          </Link>
        </div>

      </div>

      {/* =========================================================
          CENTERED COURSE DROPDOWN (Directly below Main Navbar)
          Horizontally centered relative to the viewport:
          left: 50%, transform: translateX(-50%), width: ~840px
      ========================================================= */}
      {activeCategory && (
        <CourseDropdown
          category={activeCategory}
          courses={activeCategory.courses}
          onClose={handleCloseDropdown}
          cancelClose={cancelClose}
          scheduleClose={scheduleClose}
        />
      )}
    </div>
  );
};

export default MainNavbar;
