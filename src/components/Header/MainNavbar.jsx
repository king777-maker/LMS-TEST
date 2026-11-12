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
            className="hidden xl:flex items-center gap-0.5 xl:gap-1 2xl:gap-2 min-w-0 shrink"
            aria-label="Main Navigation Categories"
          >
            {/* ===================================================
                ABOUT US DROPDOWN
            =================================================== */}
            <div
              className="relative flex items-center shrink-0"
              onMouseEnter={() => handleMouseEnter("about-us")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/about-us"
                onClick={() => setOpenDropdownId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setOpenDropdownId((prev) => (prev === "about-us" ? null : "about-us"));
                  } else if (e.key === "Escape") {
                    setOpenDropdownId(null);
                  }
                }}
                className={`flex items-center gap-1 px-1.5 xl:px-2 2xl:px-2.5 py-1 rounded-lg text-[11px] xl:text-[11.5px] 2xl:text-xs font-semibold text-white whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 leading-none ${
                  openDropdownId === "about-us"
                    ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                    : "text-white/95 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>About Us</span>
                <FaChevronDown
                  className={`text-[7px] 2xl:text-[7.5px] ml-0.5 transition-transform duration-200 shrink-0 ${
                    openDropdownId === "about-us" ? "rotate-180 text-amber-300" : "text-white/70"
                  }`}
                />
              </Link>

              {/* About Us Dropdown Menu */}
              {openDropdownId === "about-us" && (
                <div
                  onMouseEnter={cancelClose}
                  onMouseLeave={handleMouseLeave}
                  className="absolute top-full left-0 mt-2.5 w-56 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 px-2 z-[9999] animate-fadeInSlideDown"
                >
                  <div className="space-y-1">
                    <Link
                      to="/about/our-team"
                      onClick={() => setOpenDropdownId(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#131E4A] hover:bg-slate-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>Our Team</span>
                    </Link>
                    <Link
                      to="/about/vision"
                      onClick={() => setOpenDropdownId(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#131E4A] hover:bg-slate-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>Our vision</span>
                    </Link>
                    <Link
                      to="/accreditations-approvals"
                      onClick={() => setOpenDropdownId(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#131E4A] hover:bg-slate-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Our Approvals</span>
                    </Link>
                    <Link
                      to="/about/global-foot-print"
                      onClick={() => setOpenDropdownId(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#131E4A] hover:bg-slate-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span>Global Reach</span>
                    </Link>
                    <Link
                      to="/about/our-customers"
                      onClick={() => setOpenDropdownId(null)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#131E4A] hover:bg-slate-100 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Happy Customers</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
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
                    className={`flex items-center gap-1 px-1.5 xl:px-2 2xl:px-2.5 py-1 rounded-lg text-[11px] xl:text-[11.5px] 2xl:text-xs font-semibold text-white whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 leading-none ${
                      isOpen
                        ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                        : "text-white/95 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{category.title}</span>
                    <FaChevronDown
                      className={`text-[7px] 2xl:text-[7.5px] ml-0.5 transition-transform duration-200 shrink-0 ${
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
            className="shrink-0 whitespace-nowrap h-8 xl:h-8.5 px-3 text-[11px] xl:text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07162c] shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:shadow-md cursor-pointer leading-none"
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
