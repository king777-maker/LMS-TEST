import React from "react";
import { FaGraduationCap, FaCheckCircle, FaUsers, FaBookOpen } from "react-icons/fa";

/**
 * AboutStory Component (Who We Are)
 * Two-column split editorial section with rich visual storytelling on the left
 * and academy narrative, mission, and principle tags on the right.
 */
const AboutStory = () => {
  return (
    <section id="who-we-are" className="relative bg-white py-20 lg:py-24 xl:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column (5 Cols): Editorial Photo & Decorative Elements */}
          <div className="lg:col-span-5 relative">
            {/* Soft Ambient Backdrop */}
            <div className="absolute -inset-4 bg-[#F6F8FC] rounded-3xl -rotate-2 -z-0" />
            
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
                alt="Broadbeach Academy professional instructors and learners collaborating on curriculum development"
                className="w-full h-[420px] sm:h-[460px] object-cover"
                loading="lazy"
              />
              
              {/* Floating Feature Overlay Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8F0] shadow-md flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#121C46] text-amber-300 flex items-center justify-center shrink-0">
                  <FaGraduationCap className="text-lg" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#121C46] uppercase tracking-wider">
                    BROADBEACH ACADEMY
                  </div>
                  <div className="text-[13px] font-medium text-[#475569]">
                    Excellence in ISO Standards &amp; Auditing
                  </div>
                </div>
              </div>
            </div>

            {/* Small Floating Pill Badge */}
            <div className="absolute -top-4 -right-3 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span className="text-xs font-bold text-[#121C46]">Established Credibility</span>
            </div>
          </div>

          {/* Right Column (7 Cols): Narrative & Principles */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-4">
              <FaBookOpen className="text-[11px]" />
              <span>Our Story</span>
            </div>

            {/* Section Heading */}
            <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
              Who We Are
            </h2>

            {/* Editorial Paragraphs based on verified Broadbeach Academy information */}
            <p className="mt-5 text-[#475569] text-base sm:text-[17px] leading-[1.75]">
              Broadbeach Online Academy is an independent professional learning platform
              dedicated to delivering industry-focused education, compliance management
              systems training, and accredited qualification pathways for career advancement.
            </p>

            <p className="mt-4 text-[#475569] text-base sm:text-[17px] leading-[1.75]">
              Founded with the belief that international management standards should be
              approachable and directly actionable, we bridge the gap between complex regulatory
              clauses and practical workplace implementation. From foundational principles
              to rigorous Lead Auditor competencies, our curriculum is engineered to build
              confidence and career resilience.
            </p>

            <p className="mt-4 text-[#475569] text-base sm:text-[17px] leading-[1.75]">
              Today, we serve learners, working auditors, safety officers, and enterprise
              teams who depend on accurate, structured training to uphold compliance,
              drive quality excellence, and lead organizations with integrity.
            </p>

            {/* 3 Compact Principle Tags */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] w-full">
              <div className="text-xs font-bold text-[#121C46] uppercase tracking-wider mb-3">
                Core Educational Principles
              </div>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6F8FC] border border-[#E2E8F0] text-xs sm:text-sm font-bold text-[#121C46]">
                  <FaCheckCircle className="text-[#F97316]" />
                  Practical Learning
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6F8FC] border border-[#E2E8F0] text-xs sm:text-sm font-bold text-[#121C46]">
                  <FaCheckCircle className="text-[#2563EB]" />
                  Professional Growth
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6F8FC] border border-[#E2E8F0] text-xs sm:text-sm font-bold text-[#121C46]">
                  <FaCheckCircle className="text-[#10B981]" />
                  Accessible Education
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutStory;
