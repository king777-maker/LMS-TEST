import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import AboutHeroIllustration from "./AboutHeroIllustration";

/**
 * AboutHero Component
 * Welcoming, modern, editorial hero section with generous whitespace,
 * confident typography, and original vector-style learning illustration.
 */
const AboutHero = () => {
  return (
    <section className="relative bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 overflow-hidden border-b border-[#E2E8F0]/60">
      {/* Background Soft Ambient Light */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[420px] h-[420px] rounded-full bg-orange-50/40 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 z-10 w-full">
        {/* Two-Column Editorial Grid: 48% copy / 52% illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Narrative & CTAs */}
          <div className="flex flex-col items-start text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F8FC] border border-[#E2E8F0] shadow-xs mb-5 select-none">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#121C46] uppercase">
                ABOUT BROADBEACH ACADEMY
              </span>
            </div>

            {/* Headline: Confident Editorial Typography */}
            <h1 className="text-[34px] sm:text-[44px] md:text-[50px] lg:text-[54px] font-extrabold text-[#121C46] leading-[1.12] tracking-tight">
              Empowering Learners.{" "}
              <span className="text-[#F97316] block sm:inline">
                Building Better Futures.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 sm:mt-6 text-[#475569] text-base sm:text-lg lg:text-[18px] leading-[1.7] max-w-[540px]">
              Discover our approach to practical, accessible professional learning,
              standards-focused curriculum, and career-moving education designed for
              the modern global workforce.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8 w-full sm:w-auto">
              <Link
                to="/course"
                className="h-[52px] sm:h-[54px] px-7 sm:px-8 rounded-xl bg-[#121C46] hover:bg-[#1a2861] active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <span>Explore Our Courses</span>
                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href="#who-we-are"
                className="h-[52px] sm:h-[54px] px-6 sm:px-7 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-[#121C46] font-bold text-sm sm:text-base border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                <span>Discover Our Story</span>
              </a>
            </div>

            {/* Subtle Credibility Indicator */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#E2E8F0]/80 w-full text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span className="font-semibold text-[#121C46]">ISO Standards Training</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                <span className="font-semibold text-[#121C46]">Verifiable Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
                <span className="font-semibold text-[#121C46]">Self-Paced Access</span>
              </div>
            </div>

          </div>

          {/* Right Column: Original Collaborative Learning Illustration */}
          <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0 w-full">
            <AboutHeroIllustration />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
