import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaGraduationCap,
  FaGlobeAmericas,
  FaArrowRight,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#F8FAFC] via-[#F4F7FB] to-white py-10 sm:py-14 lg:py-16 xl:py-20 overflow-hidden">
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

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">

          {/* =========================================================
              LEFT COLUMN: 45% - 50% Content Hierarchy
          ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
            
            {/* Eyebrow Label */}
            <div className="hero-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs mb-4 sm:mb-5 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                PROFESSIONAL LEARNING PLATFORM
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] 2xl:text-[60px] font-black text-[#0C1433] leading-[1.12] tracking-tight">
              Build Your Expertise. <br />
              Advance Your Career. <br />
              <span className="text-[#F7C600] inline-block drop-shadow-xs">
                Get Certified.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="hero-fade-up-delay-1 mt-4 sm:mt-5 text-slate-600 text-sm sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed max-w-[560px]">
              Advance your career with industry-focused ISO standards training, practical learning, and professional development.
            </p>

            {/* Statistics Row: High-Scannability Trust Metrics */}
            <div className="hero-fade-up-delay-2 grid grid-cols-3 gap-2 sm:gap-4 py-3 px-3 sm:px-5 my-5 sm:my-6 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs w-full max-w-[520px]">
              {/* Stat 1: Students */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                    <FaUsers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-base sm:text-xl font-black text-[#0C1433] tracking-tight">
                    10k+
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 pl-0.5">
                  Students Trained
                </span>
              </div>

              {/* Stat 2: Courses */}
              <div className="flex flex-col border-l border-slate-150 pl-2.5 sm:pl-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <FaGraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-base sm:text-xl font-black text-[#0C1433] tracking-tight">
                    150+
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 pl-0.5">
                  Accredited Courses
                </span>
              </div>

              {/* Stat 3: Global Reach */}
              <div className="flex flex-col border-l border-slate-150 pl-2.5 sm:pl-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <FaGlobeAmericas className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-base sm:text-xl font-black text-[#0C1433] tracking-tight">
                    45+
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 pl-0.5">
                  Countries Worldwide
                </span>
              </div>
            </div>

            {/* Action Buttons: Unified Height & Clear Hierarchy */}
            <div className="hero-fade-up-delay-3 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              {/* Primary Action */}
              <Link
                to="/course"
                className="group h-[48px] sm:h-[50px] px-7 sm:px-8 rounded-xl bg-[#131E4A] hover:bg-[#1c2b66] active:scale-98 text-white font-bold text-sm sm:text-[15px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <span>Explore Courses</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Secondary Action */}
              <Link
                to="/about-us"
                className="h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-98 text-[#0C1433] font-bold text-sm sm:text-[15px] border border-slate-200/90 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>How It Works</span>
              </Link>
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: 50% - 55% Integrated Illustration
          ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end mt-4 lg:mt-0 relative">
            <div className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[620px] xl:max-w-[680px]">
              
              {/* Natural Integrated Illustration without Box or Heavy Border */}
              <div className="hero-illustration-float w-full flex items-center justify-center">
                <img
                  src="/assets/hero-illustration.png"
                  alt="Broadbeach Academy professional learning and certification platform"
                  width={1024}
                  height={768}
                  fetchPriority="high"
                  loading="eager"
                  className="w-full h-auto object-contain select-none drop-shadow-xl"
                  style={{
                    maxHeight: "min(620px, calc(100vh - 180px))",
                  }}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
