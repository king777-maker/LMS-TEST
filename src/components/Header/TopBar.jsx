import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaUserCircle,
  FaSignOutAlt,
  FaAward,
  FaGraduationCap,
  FaChevronDown,
  FaUser,
  FaTicketAlt,
} from "react-icons/fa";

const TopBar = ({
  onRequestCertificate,
  onOpenLogin,
  onOpenRegister,
  currentUser,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Compute initials avatar
  const userInitials = useMemo(() => {
    if (!currentUser) return "ST";
    const name = currentUser.name || currentUser.full_name || "Student User";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || "ST").toUpperCase();
  }, [currentUser]);

  return (
    <div className="w-full bg-[#0C1433] text-slate-300 border-b border-white/10 text-xs select-none relative z-50">
      <div className="max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between h-[30px] gap-1 sm:gap-3 min-w-0">
        
        {/* =========================================================
            LEFT: CONTACT EMAIL
        ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-xs shrink-0">
              <FaEnvelope className="text-[8px] sm:text-[9px]" />
            </span>
            <a
              href="mailto:certification@broadbeach.in"
              aria-label="Send email to certification@broadbeach.in"
              className="text-slate-300 hover:text-white font-medium text-[10.5px] sm:text-[11.5px] transition-colors tracking-tight truncate max-w-[130px] min-[400px]:max-w-[160px] sm:max-w-none"
            >
              <span>certification@broadbeach.in</span>
            </a>
          </div>
        </div>

        {/* =========================================================
            RIGHT: SOCIALS + BLOG + CONTACT + CTAs
        ========================================================= */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          
          {/* Social Icons (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-1 text-slate-300 shrink-0">
            <a
              href="https://wa.me/917338649737?text=Hello%20Broadbeach%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20courses%20and%20certifications."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-white/10 hover:text-[#25D366] hover:border-[#25D366]/40 flex items-center justify-center transition-all duration-200"
            >
              <FaWhatsapp className="text-[9.5px] sm:text-[10px]" />
            </a>
            <a
              href="https://www.facebook.com/broadbeach.innovations.71/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <FaFacebookF className="text-[9.5px] sm:text-[10px]" />
            </a>
            <a
              href="https://www.linkedin.com/company/37528405/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/5 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <FaLinkedinIn className="text-[9.5px] sm:text-[10px]" />
            </a>
            <a
              href="https://www.instagram.com/broadbeachinnovations"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/5 hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <FaInstagram className="text-[9.5px] sm:text-[10px]" />
            </a>
          </div>

          {/* Subtle Vertical Divider between Socials and Text Links */}
          <div className="hidden md:block h-3 w-px bg-white/20 mx-2 shrink-0" />

          {/* Informational Links */}
          <div className="hidden lg:flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-[11.5px] shrink-0">
            <a
              href="https://medium.com/@broadbeach.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Blogs
            </a>
            <Link
              to="/contact"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* User Logged In State or Auth Buttons */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                ref={triggerRef}
                id="profile-dropdown-button"
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsDropdownOpen((prev) => !prev);
                  }
                }}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls="profile-dropdown-menu"
                aria-label="User profile, courses and certificates menu"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 h-[22px] sm:h-[23px] bg-white/10 hover:bg-white/20 active:scale-95 rounded-full text-slate-100 text-[10.5px] sm:text-[11px] font-semibold border border-white/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 leading-none"
              >
                {/* Initials Avatar */}
                <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-[#07162c] font-extrabold text-[8.5px] sm:text-[9px] flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                  {userInitials}
                </div>
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
                <FaChevronDown className={`text-[8px] text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Accessible Dropdown Panel */}
              {isDropdownOpen && (
                <div
                  id="profile-dropdown-menu"
                  role="menu"
                  aria-labelledby="profile-dropdown-button"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-20px)] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-[9999] animate-fadeInSlideDown overflow-hidden"
                >
                  {/* User Profile Header */}
                  <div className="px-3.5 py-2.5 border-b border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#07162c] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {userInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-[10.5px] text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <Link
                      to="/my-profile"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaUser className="text-amber-400 text-xs shrink-0" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/my-courses"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaGraduationCap className="text-blue-400 text-xs shrink-0" />
                      <span>My Courses</span>
                    </Link>

                    <Link
                      to="/my-profile?tab=certificates"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaAward className="text-emerald-400 text-xs shrink-0" />
                      <span>My Certificates</span>
                    </Link>

                    <Link
                      to="/verify-certificate"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaAward className="text-amber-400 text-xs shrink-0" />
                      <span>Verify Certificate</span>
                    </Link>

                    <Link
                      to="/my-profile?tab=tickets"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaTicketAlt className="text-blue-400 text-xs shrink-0" />
                      <span>Support Tickets</span>
                    </Link>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <FaSignOutAlt className="text-xs shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-slate-300 hover:text-white font-semibold text-[10.5px] sm:text-[11.5px] px-1.5 sm:px-2 py-0.5 transition-colors cursor-pointer leading-none"
              >
                Log In
              </button>

              <div className="h-3 w-px bg-white/15" />

              <button
                type="button"
                onClick={onOpenRegister}
                className="text-slate-300 hover:text-white font-semibold text-[10.5px] sm:text-[11.5px] px-1.5 sm:px-2 py-0.5 transition-colors cursor-pointer leading-none"
              >
                Register
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TopBar;
