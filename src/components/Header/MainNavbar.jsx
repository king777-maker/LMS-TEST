import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes, FaAward, FaChevronRight } from "react-icons/fa";
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
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between xl:justify-start w-full h-[54px]">
        
        {/* =======================================================
            1. BRAND LOGO (Left Corner)
        ======================================================= */}
        <BrandLogo className="shrink-0" />

        {/* =======================================================
            2. DESKTOP NAVIGATION LINKS (Follows Logo)
        ======================================================= */}
        <nav
          className="hidden xl:flex items-center gap-1 2xl:gap-1.5 shrink-0 ml-4 xl:ml-5 2xl:ml-6"
          aria-label="Main Navigation Categories"
        >
            {/* ===================================================
                ABOUT US DROPDOWN (Matches CourseDropdown Visual System)
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
                className={`flex items-center gap-1 px-2 xl:px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs xl:text-[12px] 2xl:text-[12.5px] font-semibold text-white whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 leading-none ${
                  openDropdownId === "about-us"
                    ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                    : "text-white/95 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>About Us</span>
                <FaChevronDown
                  className={`text-[7px] ml-0.5 transition-transform duration-200 shrink-0 ${
                    openDropdownId === "about-us" ? "rotate-180 text-amber-300" : "text-white/70"
                  }`}
                />
              </Link>

              {/* About Us Dropdown Menu — Standardized to CourseDropdown Style */}
              {openDropdownId === "about-us" && (
                <div
                  onMouseEnter={cancelClose}
                  onMouseLeave={handleMouseLeave}
                  className="hidden xl:flex absolute top-full left-0 mt-0.5 w-[300px] bg-white text-slate-800 rounded-[14px] shadow-[0_12px_36px_rgba(10,25,47,0.14)] border border-slate-200/90 z-50 animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex-col select-none overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="shrink-0 h-[34px] px-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-[14px] select-none">
                    <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#0A192F]">
                      ABOUT BROADBEACH
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/80 shrink-0 leading-none">
                      5 Sections
                    </span>
                  </div>

                  {/* Section Rows */}
                  <div className="flex flex-col flex-1 divide-y divide-slate-100/80">
                    {[
                      { to: "/about/our-team", label: "Our Team" },
                      { to: "/about/vision", label: "Our Vision" },
                      { to: "/accreditations-approvals", label: "Our Approvals" },
                      { to: "/about/global-foot-print", label: "Global Reach" },
                      { to: "/about/our-customers", label: "Happy Customers" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdownId(null)}
                        className="flex items-center justify-between h-[36px] min-h-[36px] px-4 text-slate-800 hover:text-[#0052CC] hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer border-b border-slate-100/80 last:border-b-0"
                      >
                        <span className="text-[13px] font-medium leading-normal text-[#0A192F] group-hover:text-[#0052CC] transition-colors">
                          {item.label}
                        </span>
                        <FaChevronRight className="text-[9px] text-slate-400 group-hover:text-[#0052CC] transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="shrink-0 h-[35px] px-4 border-t border-slate-100 bg-slate-50/90 rounded-b-[14px] flex items-center justify-between select-none">
                    <Link
                      to="/about-us"
                      onClick={() => setOpenDropdownId(null)}
                      className="w-full flex items-center justify-between text-[12.5px] font-bold text-[#0052CC] hover:text-blue-700 transition-colors cursor-pointer leading-none"
                    >
                      <span>Explore About Us</span>
                      <FaChevronRight className="text-[10px] shrink-0 ml-auto" />
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
                    className={`flex items-center gap-1 px-2 xl:px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs xl:text-[12px] 2xl:text-[12.5px] font-semibold text-white whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 leading-none ${
                      isOpen
                        ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                        : "text-white/95 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>
                      {category.id === "professional-certifications"
                        ? "Certifications"
                        : category.id === "health-safety-hse"
                        ? "Health & Safety"
                        : category.title}
                    </span>
                    <FaChevronDown
                      className={`text-[7px] ml-0.5 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-amber-300" : "text-white/70"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </nav>

        {/* =======================================================
            3. DESKTOP CONTROLS: SEARCH BAR & VERIFY CERTIFICATE
            Positioned immediately after navigation links with controlled 24–32px gap
        ======================================================= */}
        <div className="hidden xl:flex items-center gap-3 xl:gap-3.5 shrink-0 ml-6 xl:ml-7 2xl:ml-8">
          <SearchBar />
          <Link
            to="/verify-certificate"
            className="shrink-0 whitespace-nowrap h-8 px-3 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07162c] shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:shadow-md cursor-pointer leading-none"
            aria-label="Verify Certificate"
          >
            <FaAward className="text-xs text-[#07162c] group-hover:rotate-12 transition-transform duration-200 shrink-0" />
            <span>Verify Certificate</span>
          </Link>
        </div>

        {/* =======================================================
            4. TABLET / MOBILE CONTROLS (Viewport < 1280px)
        ======================================================= */}
        <div className="flex xl:hidden items-center gap-2 shrink-0">
          <SearchBar />
          <Link
            to="/verify-certificate"
            className="shrink-0 whitespace-nowrap h-8 px-2.5 text-[11px] font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07162c] shadow-xs hidden sm:flex items-center gap-1"
            aria-label="Verify Certificate"
          >
            <FaAward className="text-xs" />
            <span className="hidden md:inline">Verify</span>
          </Link>
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
