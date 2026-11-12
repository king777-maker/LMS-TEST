import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUserTie,
  FaGraduationCap,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#F8FAFC] via-[#F4F7FB] to-white pt-6 pb-4 sm:pt-7 sm:pb-5 lg:pt-8 lg:pb-5 lg:min-h-[calc(100vh-84px)] lg:max-h-[calc(100vh-84px)] flex flex-col justify-between overflow-hidden">
      {/* Subtle Ambient Background Blurs (Complementing Illustration's Blue & Orange Accents) */}
      <div
        className="absolute top-0 right-1/4 w-[480px] h-[480px] rounded-full bg-blue-100/35 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-6 right-10 w-[380px] h-[380px] rounded-full bg-amber-100/30 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-0 w-[320px] h-[320px] rounded-full bg-slate-100/60 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 z-10 w-full flex-1 flex flex-col justify-between">
        
        {/* =========================================================
            TOP ROW: TWO-COLUMN MAIN VIEWPORT HERO
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center my-auto w-full py-1 lg:py-0">

          {/* LEFT COLUMN: Content Hierarchy (Executive SaaS Typography) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
            
            {/* Eyebrow Label */}
            <div className="hero-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-xs mb-3 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-700 uppercase">
                PROFESSIONAL LEARNING PLATFORM
              </span>
            </div>

            {/* Main Heading: Balanced Line Breaks & Warm High-Contrast Accent */}
            <h1 className="hero-fade-up text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] 2xl:text-[48px] font-extrabold text-[#0C1433] leading-[1.2] tracking-tight mb-3">
              Build Your Expertise. <br />
              Advance Your Career &amp;{" "}
              <span className="text-amber-500 font-extrabold inline-block">
                Get Certified.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="hero-fade-up-delay-1 text-slate-600 text-xs sm:text-sm lg:text-[15px] xl:text-[16px] leading-relaxed max-w-[500px] mb-5 sm:mb-6">
              Advance your career with industry-focused ISO standards training, practical learning, and professional development.
            </p>

            {/* Action Buttons: Unified Height & Distinct Visual Hierarchy */}
            <div className="hero-fade-up-delay-2 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Primary Action: Solid Deep Navy */}
              <Link
                to="/course"
                className="group h-11 sm:h-[44px] px-6 sm:px-7 rounded-xl bg-[#131E4A] hover:bg-[#1c2b66] active:scale-98 text-white font-semibold text-sm shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Explore Courses</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Secondary Action: Clean Subtle Outline */}
              <Link
                to="/about-us"
                className="h-11 sm:h-[44px] px-5 sm:px-6 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-98 text-slate-700 hover:text-[#131E4A] font-semibold text-sm border border-slate-300/90 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>How It Works</span>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Dominant Large Integrated Illustration */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end mt-3 lg:mt-0 relative">
            <div className="relative w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[680px] xl:max-w-[760px] 2xl:max-w-[800px]">
              
              {/* Enlarged Natural Integrated Illustration */}
              <div className="hero-illustration-float w-full flex items-center justify-center lg:justify-end">
                <img
                  src="/assets/hero-illustration.png"
                  alt="Broadbeach Academy professional learning and certification platform"
                  width={1024}
                  height={768}
                  fetchPriority="high"
                  loading="eager"
                  className="w-full h-auto object-contain select-none"
                  style={{
                    maxHeight: "min(540px, calc(100vh - 220px))",
                  }}
                />
              </div>

            </div>
          </div>

        </div>

        {/* =========================================================
            BOTTOM ROW: 4 STREAMLINED PASTEL STAT CARDS
        ========================================================= */}
        <div className="hero-fade-up-delay-3 pt-2 lg:pt-3 pb-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Card 1: 10k+ Students Trained (Warm Cream) */}
            <div className="flex items-center gap-3.5 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#FFFBF0] border border-amber-200/60 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
              <div className="shrink-0 flex items-center justify-center text-[#D97706] w-8 h-8">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2.5" ry="2.5" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-[#0C1433] leading-none tracking-tight">
                  10k+
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-600 mt-1 leading-tight">
                  Students Trained
                </div>
              </div>
            </div>

            {/* Card 2: 150+ Accredited Courses (Cool Slate) */}
            <div className="flex items-center gap-3.5 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#F1F5F9] border border-slate-200/80 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
              <div className="shrink-0 flex items-center justify-center text-[#1E293B] w-8 h-8">
                <FaUserTie className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-[#0C1433] leading-none tracking-tight">
                  150+
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-600 mt-1 leading-tight">
                  Accredited Courses
                </div>
              </div>
            </div>

            {/* Card 3: 45+ Countries Worldwide (Soft Lavender) */}
            <div className="flex items-center gap-3.5 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#F5F3FF] border border-purple-200/60 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
              <div className="shrink-0 flex items-center justify-center text-[#7C3AED] w-8 h-8">
                <FaGraduationCap className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-[#0C1433] leading-none tracking-tight">
                  45+
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-600 mt-1 leading-tight">
                  Countries Worldwide
                </div>
              </div>
            </div>

            {/* Card 4: 95% Positive Reviews (Soft Teal / Mint) */}
            <div className="flex items-center gap-3.5 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#ECFDF5] border border-teal-200/60 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
              <div className="shrink-0 flex items-center justify-center text-[#0D9488] w-8 h-8">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 2.4 3.4-.6 1.3 3.1 3.2 1.2-.4 3.4 2.2 2.6-1.8 2.9.9 3.3-3.2 1.3-1.2 3.2-3.4-.4-2.4 2.4-2.4-2.4-3.4.4-1.2-3.2-3.2-1.3.9-3.3-1.8-2.9 2.2-2.6-.4-3.4 3.2-1.2 1.3-3.1 3.4.6L12 2z" />
                  <polyline points="9 12 11 14 15 10" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-[#0C1433] leading-none tracking-tight">
                  95%
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-600 mt-1 leading-tight">
                  Positive Reviews
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
