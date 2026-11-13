import React from "react";
import { FaCompass, FaUserCheck, FaGraduationCap, FaAward, FaArrowRight } from "react-icons/fa";

/**
 * AboutProcess Component (How Learning Works)
 * Four-step horizontal/vertical process timeline on a crisp white surface.
 */
const steps = [
  {
    step: "01",
    title: "Discover",
    subtitle: "Explore Tracks",
    description:
      "Browse our comprehensive catalog of ISO standards, auditing certifications, and specialized quality & safety tracks.",
    icon: FaCompass,
    badgeColor: "bg-blue-50 text-[#2563EB] border-blue-100",
  },
  {
    step: "02",
    title: "Enroll",
    subtitle: "Get Instant Access",
    description:
      "Select your program, complete instant self-registration, and immediately unlock your personal learning dashboard.",
    icon: FaUserCheck,
    badgeColor: "bg-orange-50 text-[#F97316] border-orange-100",
  },
  {
    step: "03",
    title: "Learn",
    subtitle: "Apply Practical Knowledge",
    description:
      "Work through interactive lessons, real-world case simulations, and audit checklists at your own pace.",
    icon: FaGraduationCap,
    badgeColor: "bg-amber-50 text-[#D97706] border-amber-100",
  },
  {
    step: "04",
    title: "Complete",
    subtitle: "Verify Your Achievement",
    description:
      "Pass the final module assessments and obtain your verifiable digital completion credential to advance your career.",
    icon: FaAward,
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];

const AboutProcess = () => {
  return (
    <section className="relative bg-white py-20 lg:py-24 xl:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FC] border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Academic Methodology</span>
          </div>

          <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
            Our 4-Phase Quality Framework
          </h2>

          <p className="mt-4 text-[#475569] text-base sm:text-[17px] leading-[1.7]">
            A transparent, streamlined journey from your initial course selection
            to verified completion and professional mastery.
          </p>
        </div>

        {/* 4-Step Process Timeline */}
        <div className="relative">
          
          {/* Desktop Connecting Horizontal Line */}
          <div
            className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#CBD5E1] -z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((st, index) => {
              const Icon = st.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Icon Badge */}
                  <div className="relative mb-6">
                    <div
                      className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center border shadow-xs bg-white ${st.badgeColor} group-hover:scale-105 group-hover:shadow-md transition-all duration-200`}
                    >
                      <Icon className="text-2xl" />
                    </div>

                    {/* Step Number Tag */}
                    <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-[#121C46] text-white text-[10px] font-extrabold tracking-wider border-2 border-white shadow-xs">
                      {st.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg sm:text-[20px] font-bold text-[#121C46] leading-snug">
                    {st.title}
                  </h3>

                  {/* Subtitle */}
                  <div className="text-xs font-bold text-[#F97316] uppercase tracking-wider mt-1 mb-2.5">
                    {st.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-[#475569] text-sm leading-[1.65] max-w-[260px]">
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutProcess;

