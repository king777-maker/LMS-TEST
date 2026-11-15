import React from "react";
import { Link } from "react-router-dom";
import { FaBullseye, FaLightbulb, FaCheck, FaArrowRight } from "react-icons/fa";

/**
 * AboutMissionVision Component
 * Alternating 50/50 Split-Screen layout with Media Object strategic pillars
 * for Our Vision (text-left / image-right) and Our Mission (image-left / text-right).
 */
const AboutMissionVision = () => {
  return (
    <div className="bg-[#F8FAFC] border-y border-[#E2E8F0]/80">
      {/* =========================================================
          1. OUR VISION (Split-Screen: Text Left, Image Right)
      ========================================================= */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
            
            {/* Left: Text & Strategic Pillars */}
            <div className="flex flex-col items-start text-left order-1">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3 select-none">
                <FaLightbulb className="text-xs text-[#2563EB]" />
                <span>Future Horizon</span>
              </div>

              {/* Title */}
              <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-extrabold text-[#121C46] leading-[1.25] tracking-tight">
                Our Vision:{" "}
                <span className="text-[#2563EB]">Leading Global Standards</span>
              </h2>

              {/* Narrative Statement */}
              <p className="mt-3 text-[#475569] text-xs sm:text-[13.5px] lg:text-[14px] leading-[1.65]">
                To be the most trusted and recognized online academy for international standards
                training, ISO lead auditor education, and professional development—setting the
                benchmark for modern, learner-centric certification pathways across global industries.
              </p>

              {/* Media Object Strategic Pillars */}
              <div className="mt-6 space-y-3.5 w-full">
                {[
                  {
                    title: "Universal Global Access",
                    desc: "Eliminating geographic barriers to internationally recognized auditing credentials.",
                  },
                  {
                    title: "Innovative Simulation EdTech",
                    desc: "Pioneering realistic audit scenario simulations and digital knowledge checks.",
                  },
                  {
                    title: "Standards Champion Community",
                    desc: "Cultivating a connected network of qualified compliance and quality leaders.",
                  },
                ].map((pillar, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheck className="text-[10px]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#121C46] leading-snug">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Link to Dedicated Vision Page */}
              <div className="mt-6">
                <Link
                  to="/about/vision"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2563EB] hover:text-[#121C46] transition-colors group cursor-pointer"
                >
                  <span>Explore Our Vision in Depth</span>
                  <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: Vision Image */}
            <div className="relative order-2">
              <div className="absolute -inset-3 bg-blue-100/60 rounded-3xl rotate-1 -z-0" />
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80"
                  alt="Broadbeach Academy Vision: Leading Global Standards"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                  }}
                  className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-4 -left-4 sm:left-6 p-4 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8F0] shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#121C46] text-amber-300 flex items-center justify-center font-bold text-lg">
                  ISO
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#121C46] uppercase tracking-wider">
                    GLOBAL RECOGNITION
                  </div>
                  <div className="text-xs text-[#475569]">
                    Excellence across 45+ Countries
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
        <hr className="border-[#E2E8F0]" />
      </div>

      {/* =========================================================
          2. OUR MISSION (Split-Screen: Image Left, Text Right)
      ========================================================= */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
            
            {/* Left: Mission Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-3 bg-orange-100/60 rounded-3xl -rotate-1 -z-0" />
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&auto=format&fit=crop&q=80"
                  alt="Broadbeach Academy Mission: Empowering Practical Mastery"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                  }}
                  className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 right-4 sm:right-6 p-4 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8F0] shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F97316] text-white flex items-center justify-center text-lg">
                  <FaBullseye />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#121C46] uppercase tracking-wider">
                    ACCREDITED STANDARDS
                  </div>
                  <div className="text-xs text-[#475569]">
                    100% Practical Workplace Focus
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text & Core Objectives */}
            <div className="flex flex-col items-start text-left order-1 lg:order-2">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-xs font-bold uppercase tracking-wider text-[#F97316] mb-3 select-none">
                <FaBullseye className="text-xs text-[#F97316]" />
                <span>Core Purpose</span>
              </div>

              {/* Title */}
              <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-extrabold text-[#121C46] leading-[1.25] tracking-tight">
                Our Mission:{" "}
                <span className="text-[#F97316]">Empowering Practical Mastery</span>
              </h2>

              {/* Narrative Statement */}
              <p className="mt-3 text-[#475569] text-xs sm:text-[13.5px] lg:text-[14px] leading-[1.65]">
                To empower learners and organizations globally by delivering accessible,
                practical, and rigorous professional standards training. We make complex
                compliance frameworks actionable—enabling professionals to lead audits,
                protect workplace health, and advance their careers with verified credentials.
              </p>

              {/* Media Object Objectives */}
              <div className="mt-6 space-y-3.5 w-full">
                {[
                  {
                    title: "Job-Ready Auditing Capabilities",
                    desc: "Curriculum tailored around real audit checklists, non-conformity reporting, and evidence review.",
                  },
                  {
                    title: "Flexible Digital Self-Paced Access",
                    desc: "Learning modules available anytime, anywhere, across mobile, tablet, and desktop devices.",
                  },
                  {
                    title: "Uncompromising Academic Rigor",
                    desc: "Strict adherence to ISO standard specifications with verifiable digital completion certificates.",
                  },
                ].map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheck className="text-[10px]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#121C46] leading-snug">
                        {obj.title}
                      </h4>
                      <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                        {obj.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Link to Dedicated Mission Page */}
              <div className="mt-6">
                <Link
                  to="/about/mission"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#121C46] transition-colors group cursor-pointer"
                >
                  <span>Explore Our Mission in Depth</span>
                  <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMissionVision;
