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
    <section className="relative bg-white pt-5 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12 xl:pt-10 xl:pb-14 overflow-hidden border-b border-[#E2E8F0]/60">
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
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Narrative & CTAs */}
          <div className="flex flex-col items-start text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F8FC] border border-[#E2E8F0] shadow-xs mb-3 sm:mb-3.5 select-none">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#121C46] uppercase">
                ABOUT BROADBEACH ACADEMY
              </span>
            </div>

            {/* Headline: Confident Editorial Typography */}
            <h1 className="text-[30px] sm:text-[38px] md:text-[42px] lg:text-[46px] xl:text-[48px] font-extrabold text-[#121C46] leading-[1.12] tracking-tight">
              Empowering Learners.{" "}
              <span className="text-[#F97316] block sm:inline">
                Building Better Futures.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-3.5 sm:mt-4 text-[#475569] text-sm sm:text-base lg:text-[16.5px] leading-[1.6] max-w-[520px]">
              Discover our approach to practical, accessible professional learning,
              standards-focused curriculum, and career-moving education designed for
              the modern global workforce.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-5 sm:mt-6 w-full sm:w-auto">
              <Link
                to="/course"
                className="h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl bg-[#121C46] hover:bg-[#1a2861] active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <span>Explore Our Courses</span>
                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href="#who-we-are"
                className="h-[46px] sm:h-[48px] px-5 sm:px-6 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-[#121C46] font-bold text-sm sm:text-base border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                <span>Discover Our Story</span>
              </a>
            </div>

            {/* Subtle Credibility Indicator */}
            <div className="flex items-center gap-5 sm:gap-6 mt-5 pt-4 border-t border-[#E2E8F0]/80 w-full text-xs text-[#475569]">
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
          <div className="flex items-center justify-center lg:justify-end mt-4 lg:mt-0 w-full">
            <AboutHeroIllustration />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
