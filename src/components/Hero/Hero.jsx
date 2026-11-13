import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUserTie,
  FaGraduationCap,
} from "react-icons/fa";

const Hero = () => {
  return (
    <>
      {/* =========================================================
          FRAME 1: HERO SECTION (Balanced Spacing & Proportions)
      ========================================================= */}
      <section className="relative bg-gradient-to-b from-[#F8FAFC] via-[#F4F7FB] to-white pt-3 pb-3 sm:pt-4 sm:pb-4 lg:pt-5 lg:pb-5 xl:pt-6 xl:pb-6 overflow-hidden flex items-center">
        {/* Subtle Ambient Background Blurs */}
        <div
          className="absolute top-0 right-1/4 w-[480px] h-[480px] rounded-full bg-blue-100/35 blur-3xl pointer-events-none -z-0"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-4 right-10 w-[380px] h-[380px] rounded-full bg-orange-100/30 blur-3xl pointer-events-none -z-0"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 left-0 w-[320px] h-[320px] rounded-full bg-slate-100/60 blur-3xl pointer-events-none -z-0"
          aria-hidden="true"
        />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 z-10 w-full">
          {/* TWO-COLUMN HERO (48% / 52% Ratio, Vertically Aligned) */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] gap-6 lg:gap-8 xl:gap-10 items-center w-full">

            {/* LEFT COLUMN: 48% Target Layout */}
            <div className="flex flex-col items-start text-left">
              
              {/* Eyebrow Label: Highlighting Core Certification Offering */}
              <div className="hero-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-xs mb-3.5 select-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#121C46] uppercase">
                  ACCREDITED CERTIFICATIONS &amp; LEARNING
                </span>
              </div>

              {/* Main Heading: 2 Lines, Refined Size (~6% reduction), Only "Career." in Orange */}
              <h1 className="hero-fade-up text-[32px] sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] 2xl:text-[54px] font-extrabold text-[#121C46] leading-[1.15] tracking-tight">
                <span className="block sm:whitespace-nowrap">Build Your Expertise.</span>
                <span className="block sm:whitespace-nowrap">
                  Advance Your <span className="text-[#F97316]">Career.</span>
                </span>
              </h1>

              {/* Supporting Description: Explicit Certification Focus */}
              <p className="hero-fade-up-delay-1 mt-5 sm:mt-6 text-[#475569] text-base sm:text-lg lg:text-[18px] xl:text-[19px] leading-relaxed max-w-[520px]">
                Get certified and advance your career with industry-focused ISO standards training, practical learning, and accredited qualifications.
              </p>

              {/* Action Buttons: 52–54px Height, 24–28px Padding */}
              <div className="hero-fade-up-delay-2 flex flex-wrap items-center gap-3.5 mt-6 sm:mt-7 w-full sm:w-auto">
                {/* Primary Action */}
                <Link
                  to="/course"
                  className="group h-[52px] sm:h-[54px] px-6 sm:px-7 rounded-xl bg-[#121C46] hover:bg-[#1a2861] active:scale-98 text-white font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Courses</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                {/* Secondary Action */}
                <Link
                  to="/register"
                  className="h-[52px] sm:h-[54px] px-6 sm:px-7 rounded-xl bg-white hover:bg-slate-50 text-[#121C46] font-bold text-base border border-[#CBD5E1] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer uppercase tracking-wide"
                >
                  <span>ENROLL NOW</span>
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: 52% Target Layout (Naturally Aligned Visual Center) */}
            <div className="flex items-center justify-center lg:justify-end mt-3 lg:mt-0 relative overflow-visible -translate-y-1 lg:-translate-y-2">
              <div className="relative w-full max-w-[560px] sm:max-w-[620px] lg:max-w-[660px] xl:max-w-[720px] 2xl:max-w-[760px]">
                
                {/* Natural Integrated Illustration without artificial harsh bottom fade */}
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
                      maxHeight: "min(480px, calc(100vh - 220px))",
                    }}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FRAME 2: 4 UNIFIED NEUTRAL STATISTICS CARDS (Closer to Fold)
      ========================================================= */}
      <section className="relative bg-white border-y border-slate-200/80 py-5 sm:py-6 lg:py-7 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            
            {/* Card 1: 10k+ Students Trained */}
            <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              <div className="shrink-0 w-9 h-9 flex items-center justify-center text-[#F97316]">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2.5" ry="2.5" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-extrabold text-[#121C46] leading-none tracking-tight">
                  10k+
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#475569] mt-1.5 leading-tight">
                  Students Trained
                </div>
              </div>
            </div>

            {/* Card 2: 150+ Accredited Courses */}
            <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              <div className="shrink-0 w-9 h-9 flex items-center justify-center text-[#121C46]">
                <FaUserTie className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-extrabold text-[#121C46] leading-none tracking-tight">
                  150+
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#475569] mt-1.5 leading-tight">
                  Accredited Courses
                </div>
              </div>
            </div>

            {/* Card 3: 45+ Countries Worldwide */}
            <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              <div className="shrink-0 w-9 h-9 flex items-center justify-center text-[#7C3AED]">
                <FaGraduationCap className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-extrabold text-[#121C46] leading-none tracking-tight">
                  45+
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#475569] mt-1.5 leading-tight">
                  Countries Worldwide
                </div>
              </div>
            </div>

            {/* Card 4: 95% Positive Reviews */}
            <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-4.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              <div className="shrink-0 w-9 h-9 flex items-center justify-center text-[#0D9488]">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 2.4 3.4-.6 1.3 3.1 3.2 1.2-.4 3.4 2.2 2.6-1.8 2.9.9 3.3-3.2 1.3-1.2 3.2-3.4-.4-2.4 2.4-2.4-2.4-3.4.4-1.2-3.2-3.2-1.3.9-3.3-1.8-2.9 2.2-2.6-.4-3.4 3.2-1.2 1.3-3.1 3.4.6L12 2z" />
                  <polyline points="9 12 11 14 15 10" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-extrabold text-[#121C46] leading-none tracking-tight">
                  95%
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#475569] mt-1.5 leading-tight">
                  Positive Reviews
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
