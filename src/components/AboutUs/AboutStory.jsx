import React from "react";
import { FaGraduationCap, FaCheckCircle, FaUsers, FaBookOpen } from "react-icons/fa";

/**
 * AboutStory Component (Who We Are)
 * Two-column split editorial section with rich visual storytelling on the left
 * and academy narrative, mission, and principle tags on the right.
 */
const AboutStory = () => {
  return (
    <section id="who-we-are" className="relative bg-white py-10 sm:py-12 lg:py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
          
          {/* Left Column (5 Cols): Editorial Photo & Decorative Elements */}
          <div className="lg:col-span-5 relative">
            {/* Soft Ambient Backdrop */}
            <div className="absolute -inset-3 bg-[#F6F8FC] rounded-3xl -rotate-2 -z-0" />
            
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
                alt="Broadbeach Academy professional instructors and learners collaborating on curriculum development"
                className="w-full h-[300px] sm:h-[340px] lg:h-[360px] object-cover"
                loading="lazy"
              />
              
              {/* Floating Feature Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8F0] shadow-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#121C46] text-amber-300 flex items-center justify-center shrink-0">
                  <FaGraduationCap className="text-base" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#121C46] uppercase tracking-wider">
                    BROADBEACH ACADEMY
                  </div>
                  <div className="text-xs font-medium text-[#475569]">
                    Excellence in ISO Standards &amp; Auditing
                  </div>
                </div>
              </div>
            </div>

            {/* Small Floating Pill Badge */}
            <div className="absolute -top-3 -right-2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-sm select-none">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="text-xs font-bold text-[#121C46]">Established Credibility</span>
            </div>
          </div>

          {/* Right Column (7 Cols): Narrative & Principles */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
              <FaBookOpen className="text-[11px]" />
              <span>Our Story</span>
            </div>

            {/* Section Heading */}
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
              Who We Are
            </h2>

            {/* Concise Editorial Paragraphs */}
            <p className="mt-3.5 text-[#475569] text-sm sm:text-base lg:text-[16.5px] leading-[1.7]">
              Broadbeach Online Academy is an independent professional learning platform
              dedicated to delivering industry-focused compliance management training, ISO auditing
              qualifications, and workplace safety certifications.
            </p>

            <p className="mt-3 text-[#475569] text-sm sm:text-base lg:text-[16.5px] leading-[1.7]">
              We bridge the gap between complex regulatory clauses and practical workplace execution—empowering
              learners, certified auditors, and enterprise teams worldwide to advance their careers and lead with verified credentials.
            </p>

            {/* 3 Compact Principle Tags */}
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] w-full">
              <div className="text-[11px] font-bold text-[#121C46] uppercase tracking-wider mb-2.5">
                Core Educational Principles
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F8FC] border border-[#E2E8F0] text-xs font-bold text-[#121C46]">
                  <FaCheckCircle className="text-[#F97316] text-xs" />
                  Practical Learning
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F8FC] border border-[#E2E8F0] text-xs font-bold text-[#121C46]">
                  <FaCheckCircle className="text-[#2563EB] text-xs" />
                  Professional Growth
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F8FC] border border-[#E2E8F0] text-xs font-bold text-[#121C46]">
                  <FaCheckCircle className="text-[#10B981] text-xs" />
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
