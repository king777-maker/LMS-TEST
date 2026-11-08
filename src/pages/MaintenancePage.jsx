import React, { useState } from "react";
import { 
  FaShieldAlt, 
  FaEnvelope, 
  FaWhatsapp, 
  FaTools, 
  FaCog, 
  FaCheckCircle, 
  FaLock, 
  FaChevronRight,
  FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";
import BrandLogo from "../components/Header/BrandLogo";

/**
 * Broadbeach Online — Premium Corporate Maintenance Experience
 * 
 * Brand Compliance:
 * - Deep navy background: #0B192C / #071322 / #0D223A
 * - Golden yellow accents: #FFB800 / #FFC72C
 * - Authentic vector Broadbeach Academy logo
 * - Responsive 390px to 1920px+
 * - Accessible, motion-reduced aware
 */
const MaintenancePage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const contactEmail = "certification@broadbeach.in";
  const whatsappUrl = "https://wa.me/917338649737?text=Hello%20Broadbeach%20Academy%20Support%2C%20I%20have%20an%20enquiry%20regarding%20the%20scheduled%20maintenance.";

  return (
    <div className="min-h-screen bg-[#070F1E] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      
      {/* Background Decorative Ambient Glows */}
      <div 
        className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FFB800]/10 blur-[160px] pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[800px] h-[800px] rounded-full bg-gradient-to-b from-blue-900/15 via-transparent to-transparent blur-[140px] pointer-events-none"
        aria-hidden="true" 
      />

      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      {/* =========================================================
          1. HEADER
      ========================================================= */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#0B192C]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Authentic Broadbeach Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo />
          </div>

          {/* Institutional Credential Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Portal</span>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. MAIN HERO SECTION & STATUS
      ========================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center max-w-4xl mx-auto">
        
        {/* Animated Technical Maintenance Visual */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <div 
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-slate-900/60 shadow-2xl flex items-center justify-center relative backdrop-blur-sm"
          >
            {/* Spinning Technical Outer Gear */}
            <FaCog 
              className="absolute -top-1 -right-1 text-slate-600/40 text-xl sm:text-2xl animate-[spin_12s_linear_infinite]" 
              aria-hidden="true"
            />
            <FaCog 
              className="absolute -bottom-2 -left-2 text-[#FFB800]/30 text-2xl sm:text-3xl animate-[spin_18s_linear_infinite_reverse]" 
              aria-hidden="true"
            />

            {/* Central Gold Shield Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#174b85] to-[#0B192C] border border-[#FFB800]/40 flex items-center justify-center shadow-inner relative group">
              <FaShieldAlt className="text-2xl sm:text-3xl text-[#FFB800] drop-shadow-[0_2px_10px_rgba(255,184,0,0.5)] transition-transform duration-300 group-hover:scale-110" />
              
              {/* Tool Accent Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFB800] text-[#0B192C] flex items-center justify-center text-xs shadow-md">
                <FaTools className="text-[10px]" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Maintenance Status Indicator Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <span>Website Under Maintenance</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
          WE'LL BE BACK SOON!
        </h1>

        <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-amber-200 mb-5">
          We're Currently Improving Our Website
        </p>

        {/* Required Master Description */}
        <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          Broadbeach Online is undergoing scheduled maintenance as we work to improve your experience. 
          We're making important improvements to deliver a better, faster and more reliable platform.
        </p>

        {/* Supporting Status Notice */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 max-w-xl mx-auto mb-9 text-xs sm:text-sm text-slate-400">
          Our team is working on improvements. Thank you for your patience and understanding.
        </div>

        {/* =========================================================
            4. CONTACT ACTIONS (EMAIL & WHATSAPP)
        ========================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Primary Action: Direct Contact Trigger */}
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FFB800] hover:bg-[#E5A700] text-[#0B192C] font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-[#FFB800]/20 hover:shadow-[#FFB800]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Contact Us</span>
            <FaChevronRight className="text-xs" />
          </button>

          {/* Email Action */}
          <a
            href={`mailto:${contactEmail}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <FaEnvelope className="text-[#FFB800]" />
            <span>{contactEmail}</span>
          </a>

          {/* WhatsApp Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] hover:text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <FaWhatsapp className="text-lg" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </main>

      {/* =========================================================
          5. FOOTER
      ========================================================= */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#0B192C]/90 backdrop-blur-md py-6 sm:py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Broadbeach Academy</span>
            <span className="text-slate-600">•</span>
            <span>Accredited ISO Certification Portal</span>
          </div>

          <div className="text-slate-400 text-center">
            &copy; {new Date().getFullYear()} Broadbeach Academy. All rights reserved. Thank you for visiting.
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>System Status: Upgrade in Progress</span>
          </div>
        </div>
      </footer>

      {/* =========================================================
          CONTACT MODAL POPUP
      ========================================================= */}
      {isContactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div 
            className="w-full max-w-md bg-[#0D223A] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-left"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800]/20 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
                <FaEnvelope className="text-lg" />
              </div>
              <div>
                <h3 id="contact-modal-title" className="text-lg font-bold text-white">Contact Broadbeach Support</h3>
                <p className="text-xs text-slate-400">We respond promptly to student and client enquiries</p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Official Email</div>
                  <a href={`mailto:${contactEmail}`} className="text-sm sm:text-base font-bold text-white hover:text-[#FFB800] transition-colors">
                    {contactEmail}
                  </a>
                </div>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Send Email
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#25D366] font-semibold uppercase tracking-wider">Instant WhatsApp</div>
                  <div className="text-sm sm:text-base font-bold text-white">+91 7338 649 737</div>
                </div>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-slate-900 text-xs font-bold transition-colors"
                >
                  Chat Now
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenancePage;
