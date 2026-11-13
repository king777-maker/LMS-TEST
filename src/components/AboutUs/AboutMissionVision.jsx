import React from "react";
import { FaBullseye, FaLightbulb, FaCheck } from "react-icons/fa";

/**
 * AboutMissionVision Component
 * Two large, balanced editorial cards showcasing the Academy's Mission and Vision.
 */
const AboutMissionVision = () => {
  return (
    <section className="relative bg-[#F6F8FC] py-20 lg:py-24 xl:py-28 border-y border-[#E2E8F0]/80">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
            <span>Guiding Principles</span>
          </div>

          <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
            Our Mission &amp; Vision
          </h2>

          <p className="mt-4 text-[#475569] text-base sm:text-[17px] leading-[1.7]">
            The strategic foundations driving our curriculum, academic support, and dedication
            to learner achievement.
          </p>
        </div>

        {/* Two Balanced Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <FaBullseye className="text-2xl" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-50/80 px-3 py-1 rounded-full border border-orange-100">
                  Core Purpose
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#121C46] leading-tight mb-4">
                Our Mission
              </h3>

              {/* Statement */}
              <p className="text-[#475569] text-base sm:text-[17px] leading-[1.75]">
                To empower learners and organizations globally by delivering accessible,
                practical, and rigorous professional standards training. We strive to make
                complex compliance frameworks actionable, enabling professionals to lead audits,
                protect workplace health and safety, and advance their careers with verified credentials.
              </p>
            </div>

            {/* Key Pillars */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] space-y-3">
              {[
                "Delivering practical, job-ready auditing and compliance knowledge",
                "Fostering continuous learning through accessible digital delivery",
                "Maintaining uncompromised academic integrity and course quality",
              ].map((pillar, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheck className="text-[10px]" />
                  </span>
                  <span className="text-sm font-medium text-[#121C46] leading-relaxed">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <FaLightbulb className="text-2xl" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100">
                  Future Horizon
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#121C46] leading-tight mb-4">
                Our Vision
              </h3>

              {/* Statement */}
              <p className="text-[#475569] text-base sm:text-[17px] leading-[1.75]">
                To be the most trusted and recognized online academy for international standards
                training, ISO lead auditor education, and professional development—setting the
                benchmark for modern, learner-centric certification pathways across global industries.
              </p>
            </div>

            {/* Key Pillars */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] space-y-3">
              {[
                "Expanding global access to internationally recognized qualifications",
                "Innovating interactive learning platforms and simulation methodologies",
                "Building a worldwide community of certified standards champions",
              ].map((pillar, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheck className="text-[10px]" />
                  </span>
                  <span className="text-sm font-medium text-[#121C46] leading-relaxed">
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
