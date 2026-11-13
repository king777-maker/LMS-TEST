import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaUserCheck } from "react-icons/fa";

/**
 * AboutCTA Component
 * High-impact closing banner in deep navy (#121C46) with warm yellow/orange accents
 * and clear, motivating action buttons.
 */
const AboutCTA = () => {
  return (
    <section className="relative bg-white pb-10 sm:pb-12 lg:pb-14">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Navy Rounded Panel */}
        <div className="relative rounded-3xl bg-[#121C46] text-white p-6 sm:p-8 lg:p-10 overflow-hidden shadow-xl border border-white/10">
          
          {/* Subtle Geometric Background Elements */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div
            className="hidden sm:block absolute right-12 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/10 -z-0 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="hidden sm:block absolute right-24 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-white/10 -z-0 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-amber-300 mb-5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>START YOUR JOURNEY TODAY</span>
            </div>

            {/* Headline */}
            <h2 className="text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold text-white leading-[1.15] tracking-tight">
              Take the Next Step in Your Learning Journey.
            </h2>

            {/* Supporting Copy */}
            <p className="mt-4 sm:mt-5 text-slate-300 text-base sm:text-lg leading-[1.7]">
              Join thousands of learners and working professionals mastering ISO management
              standards, auditing frameworks, and safety protocols with Broadbeach Academy.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
              {/* Primary Yellow Button */}
              <Link
                to="/course"
                className="h-[52px] sm:h-[54px] px-8 rounded-xl bg-[#FFC400] hover:bg-[#F59E0B] text-[#07162C] font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <span>Explore Courses</span>
                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {/* Secondary Enrollment Button */}
              <Link
                to="/register"
                className="h-[52px] sm:h-[54px] px-7 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 shadow-xs hover:shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer uppercase tracking-wider"
              >
                <FaUserCheck className="text-xs text-amber-300" />
                <span>ENROLL NOW</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutCTA;
