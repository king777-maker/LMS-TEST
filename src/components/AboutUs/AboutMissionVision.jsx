import React from "react";
import { FaBullseye, FaLightbulb, FaCheck } from "react-icons/fa";

/**
 * AboutMissionVision Component
 * Two large, balanced editorial cards showcasing the Academy's Mission and Vision.
 */
const AboutMissionVision = () => {
  return (
    <section className="relative bg-[#F6F8FC] py-10 sm:py-12 lg:py-16 border-y border-[#E2E8F0]/80">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
            <span>Guiding Principles</span>
          </div>

          <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
            Our Mission &amp; Vision
          </h2>

          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-[1.6]">
            The strategic foundations driving our curriculum, academic support, and dedication
            to learner achievement.
          </p>
        </div>

        {/* Two Balanced Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <FaBullseye className="text-xl" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-50/80 px-3 py-1 rounded-full border border-orange-100">
                  Core Purpose
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-[22px] font-extrabold text-[#121C46] leading-tight mb-3">
                Our Mission
              </h3>

              {/* Statement */}
              <p className="text-[#475569] text-sm sm:text-[15px] leading-[1.7]">
                To empower learners and organizations globally by delivering accessible,
                practical, and rigorous professional standards training. We strive to make
                complex compliance frameworks actionable, enabling professionals to lead audits,
                protect workplace health and safety, and advance their careers with verified credentials.
              </p>
            </div>

            {/* Key Pillars */}
            <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-2.5">
              {[
                "Delivering practical, job-ready auditing and compliance knowledge",
                "Fostering continuous learning through accessible digital delivery",
                "Maintaining uncompromised academic integrity and course quality",
              ].map((pillar, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheck className="text-[9px]" />
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#121C46] leading-relaxed">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <FaLightbulb className="text-xl" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100">
                  Future Horizon
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-[22px] font-extrabold text-[#121C46] leading-tight mb-3">
                Our Vision
              </h3>

              {/* Statement */}
              <p className="text-[#475569] text-sm sm:text-[15px] leading-[1.7]">
                To be the most trusted and recognized online academy for international standards
                training, ISO lead auditor education, and professional development—setting the
                benchmark for modern, learner-centric certification pathways across global industries.
              </p>
            </div>

            {/* Key Pillars */}
            <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-2.5">
              {[
                "Expanding global access to internationally recognized qualifications",
                "Innovating interactive learning platforms and simulation methodologies",
                "Building a worldwide community of certified standards champions",
              ].map((pillar, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-4.5 h-4.5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheck className="text-[9px]" />
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#121C46] leading-relaxed">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutMissionVision;
