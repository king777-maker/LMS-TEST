import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaChevronDown,
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaAward,
  FaUserCircle,
  FaHome,
  FaBook,
  FaGift,
  FaInfoCircle,
  FaHeadset,
  FaGraduationCap
} from "react-icons/fa";
import { navigationCategories } from "../../data/coursesData";
import BrandLogo from "./BrandLogo";
import PromoBadge from "./PromoBadge";
import { formatDropdownCourseTitle } from "../../utils/courseTitleFormatter";

const corporateLinks = [
  { label: "About Us", path: "/about-us" },
  { label: "Our Team", path: "/about/our-team" },
  { label: "Our vision", path: "/about/vision" },
  { label: "Our Approvals", path: "/accreditations-approvals" },
  { label: "Global Reach", path: "/about/global-foot-print" },
  { label: "Happy Customers", path: "/about/our-customers" }
];

const MobileNavbar = ({
  isOpen,
  onClose,
  onRequestCertificate,
  onOpenLogin,
  onOpenRegister,
  currentUser,
  onLogout,
}) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedSubcategoryId, setExpandedSubcategoryId] = useState(null);

  const toggleSubcategory = (subcatId) => {
    setExpandedSubcategoryId((prev) => (prev === subcatId ? null : subcatId));
  };
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (id) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 xl:hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 w-[88vw] max-w-[340px] bg-[#131E4A] text-white shadow-2xl flex flex-col z-50 overflow-hidden animate-fadeInSlideDown border-r border-white/10">
        
        {/* Drawer Header */}
        <div className="p-3.5 bg-[#0E1638] border-b border-white/10 flex items-center justify-between">
          <BrandLogo />
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-dropdown-scroll">
          
          {/* Quick Actions (Verify Certificate + Auth) */}
          <div className="space-y-2">
            <Link
              to="/verify-certificate"
              onClick={onClose}
              className="w-full min-h-[44px] py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#07162c] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
            >
              <FaAward className="text-xs text-[#07162c]" />
              <span>Verify Certificate</span>
            </Link>

            {currentUser ? (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaUserCircle className="text-amber-400 text-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1 shrink-0"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10 text-center">
                  <Link
                    to="/my-profile"
                    onClick={onClose}
                    className="text-[11px] text-blue-300 hover:text-white flex flex-col items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FaUserCircle className="text-amber-400 text-sm" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/my-courses"
                    onClick={onClose}
                    className="text-[11px] text-blue-300 hover:text-white flex flex-col items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FaGraduationCap className="text-blue-400 text-sm" />
                    <span>Courses</span>
                  </Link>
                  <Link
                    to="/my-profile?tab=certificates"
                    onClick={onClose}
                    className="text-[11px] text-emerald-300 hover:text-white flex flex-col items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FaAward className="text-emerald-400 text-sm" />
                    <span>Certificates</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="w-full min-h-[42px] py-2 px-3 border border-white/20 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="w-full min-h-[42px] py-2 px-3 bg-[#F7C600] hover:bg-[#ffd83b] text-[#0C1433] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  REGISTER
                </button>
              </div>
            )}
          </div>

          {/* Primary Navigation Shortcuts */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FaHome className="text-amber-400 text-sm" />
              <span>Home</span>
            </Link>

            <Link
              to="/courses"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FaBook className="text-blue-400 text-sm" />
              <span>All Courses Catalog</span>
            </Link>

            <Link
              to="/free-courses"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <FaGift className="text-emerald-400 text-sm" />
                <span>Free Courses</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                100% Free
              </span>
            </Link>

            <a
              href="https://medium.com/@broadbeach.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <FaExternalLinkAlt className="text-amber-400 text-xs" />
                <span>Blogs</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-amber-300">
                Medium ↗
              </span>
            </a>
          </div>

          {/* Collapsible About Broadbeach Academy */}
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              type="button"
              aria-expanded={isAboutExpanded}
              aria-controls="mobile-about-menu"
              onClick={() => setIsAboutExpanded((prev) => !prev)}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FaInfoCircle className="text-amber-400" />
                <span>About Us</span>
              </span>
              <FaChevronDown
                className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                  isAboutExpanded ? "rotate-180 text-amber-400" : ""
                }`}
              />
            </button>

            {isAboutExpanded && (
              <div id="mobile-about-menu" className="p-2 pt-0 space-y-1 bg-black/20 border-t border-white/5">
                {corporateLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className="block px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Accordion: Course Categories */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Course Categories
            </p>

            <div className="space-y-1">
              {navigationCategories.map((category) => {
                const isExpanded = expandedCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="rounded-xl border border-white/5 bg-white/5 overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-category-${category.id}`}
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-3 flex items-center justify-between text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.title}</span>
                        {category.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                            {category.badge}
                          </span>
                        )}
                      </span>
                      <FaChevronDown
                        className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-amber-400" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div
                        id={`mobile-category-${category.id}`}
                        className="px-3 py-2 space-y-1 bg-black/25 border-t border-white/10"
                      >
                        {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                          /* Nested subcategory accordion for mega menus (Professional Certifications) */
                          <div className="space-y-1.5 py-1">
                            {category.subcategories.map((subcat) => {
                              const isSubExpanded = expandedSubcategoryId === subcat.id;
                              return (
                                <div
                                  key={subcat.id}
                                  className="rounded-lg border border-white/10 bg-white/5 overflow-hidden"
                                >
                                  <button
                                    type="button"
                                    onClick={() => toggleSubcategory(subcat.id)}
                                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-[11.5px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <span className="flex items-center gap-2 pr-2 min-w-0">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                      <span className="truncate">{subcat.title}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 shrink-0">
                                      <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-white/10 text-amber-300">
                                        {subcat.courses.length}
                                      </span>
                                      <FaChevronDown
                                        className={`text-[9px] text-slate-400 transition-transform duration-200 ${
                                          isSubExpanded ? "rotate-180 text-amber-400" : ""
                                        }`}
                                      />
                                    </span>
                                  </button>

                                  {isSubExpanded && (
                                    <div className="px-3 py-2 bg-black/35 border-t border-white/5 max-h-[280px] overflow-y-auto custom-dropdown-scroll overscroll-contain">
                                      <ul className="divide-y divide-white/5 space-y-0.5">
                                        {subcat.courses.map((course) => (
                                          <li key={course.id}>
                                            <Link
                                              to={`/courses/${course.id}`}
                                              onClick={onClose}
                                              className="flex items-center justify-between py-2 text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
                                            >
                                              <span className="text-xs font-medium text-slate-100 group-hover:text-amber-300 transition-colors leading-snug pr-2">
                                                {formatDropdownCourseTitle(course)}
                                              </span>
                                              {course.badge && <PromoBadge badge={course.badge} />}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Standard single-level list */
                          <ul className="divide-y divide-white/5">
                            {category.courses?.map((course) => (
                              <li key={course.id}>
                                <Link
                                  to={`/courses/${course.id}`}
                                  onClick={onClose}
                                  className="flex items-center justify-between py-2 text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
                                >
                                  <span className="text-xs font-medium text-slate-100 group-hover:text-amber-300 transition-colors leading-snug pr-2">
                                    {formatDropdownCourseTitle(course)}
                                  </span>
                                  {course.badge && <PromoBadge badge={course.badge} />}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="pt-2 border-t border-white/5 mt-1">
                          <Link
                            to={category.id === "free-courses" ? "/free-courses" : `/${category.slug || category.id}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors py-1"
                          >
                            <span>Explore all {category.title} programs</span>
                            <FaChevronRight className="text-[8px]" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Support & Helpdesk */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Support & Helpdesk
            </p>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaHeadset className="text-amber-400" />
              <span>Contact Admissions & Support</span>
            </Link>

            <Link
              to="/raise-a-ticket"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaAward className="text-blue-400" />
              <span>Raise Support Ticket / Grievance</span>
            </Link>
          </div>

          {/* Direct Email Link */}
          <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-slate-400">
            <a
              href="mailto:certification@broadbeach.in"
              aria-label="Send email to certification@broadbeach.in"
              className="flex items-center gap-2 text-slate-300 hover:text-[#F8D85A] transition-colors"
            >
              <FaEnvelope className="text-amber-400 text-[11px]" />
              <span>certification@broadbeach.in</span>
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://www.facebook.com/broadbeach.innovations.71/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] transition-colors"
              >
                <FaFacebookF className="text-[10px]" />
              </a>
              <a
                href="https://www.linkedin.com/company/37528405/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0A66C2] transition-colors"
              >
                <FaLinkedinIn className="text-[10px]" />
              </a>
              <a
                href="https://www.instagram.com/broadbeachinnovations"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#E4405F] transition-colors"
              >
                <FaInstagram className="text-[10px]" />
              </a>
            </div>

            {/* Legal Links row */}
            <div className="pt-2 text-[10px] text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
              <Link to="/privacy-policy" onClick={onClose} className="hover:underline">Privacy</Link>
              <span>•</span>
              <Link to="/terms-conditions" onClick={onClose} className="hover:underline">Terms</Link>
              <span>•</span>
              <Link to="/cookie-policy" onClick={onClose} className="hover:underline">Cookies</Link>
              <span>•</span>
              <Link to="/cancellation-refund-policy" onClick={onClose} className="hover:underline">Refunds</Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MobileNavbar;
