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
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-2 xl:gap-4 w-full h-16 xl:h-18">
        
        {/* =======================================================
            LEFT: BRAND LOGO + HORIZONTAL NAVIGATION LINKS
        ======================================================= */}
        <div className="flex items-center gap-3 lg:gap-4 xl:gap-6 shrink min-w-0">
          {/* Anchored Brand Logo on Far Left Corner */}
          <BrandLogo className="shrink-0" />

          {/* Desktop Navigation Links */}
          <nav
            className="hidden xl:flex items-center gap-3 lg:gap-4 xl:gap-6 shrink min-w-0"
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
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs lg:text-[13px] xl:text-sm font-bold text-white whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 leading-none ${
                      isOpen
                        ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{category.title}</span>
                    <FaChevronDown
                      className={`text-[8px] ml-1 transition-transform duration-200 shrink-0 ${
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
            className="flex items-center gap-1.5 px-3 h-8 xl:h-9 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer border border-white/20 transition-all leading-none"
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
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          <SearchBar />
          <Link
            to="/verify-certificate"
            className="shrink-0 whitespace-nowrap h-8 xl:h-9 px-3 xl:px-4 text-xs font-bold rounded-full bg-amber-400 hover:bg-amber-300 text-[#07162c] shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:shadow-md cursor-pointer leading-none"
            aria-label="Verify Certificate"
          >
            <FaAward className="text-xs text-[#07162c] group-hover:rotate-12 transition-transform duration-200 shrink-0" />
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
