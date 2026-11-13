import React from "react";
import {
  FaCertificate,
  FaLaptopCode,
  FaProjectDiagram,
  FaClipboardCheck,
  FaHeadset,
  FaAward,
} from "react-icons/fa";

/**
 * AboutFeatures Component (Why Choose Broadbeach Academy)
 * 3x2 grid of rounded editorial feature cards on a soft neutral background.
 */
const features = [
  {
    icon: FaCertificate,
    accent: "bg-blue-50 text-[#2563EB] border-blue-100",
    iconColor: "text-[#2563EB]",
    title: "Industry-Focused Learning",
    description:
      "Curriculum aligned with current international standards (ISO 9001, 14001, 45001, 27001) and practical compliance requirements.",
  },
  {
    icon: FaLaptopCode,
    accent: "bg-orange-50 text-[#F97316] border-orange-100",
    iconColor: "text-[#F97316]",
    title: "Flexible Online Access",
    description:
      "Study at your own rhythm with 24/7 self-paced modules accessible seamlessly across laptop, tablet, and mobile devices.",
  },
  {
    icon: FaProjectDiagram,
    accent: "bg-amber-50 text-[#D97706] border-amber-100",
    iconColor: "text-[#D97706]",
    title: "Structured Learning Paths",
    description:
      "A logical, milestone-based curriculum guiding learners progressively from core awareness to specialized Lead Auditor competencies.",
  },
  {
    icon: FaClipboardCheck,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconColor: "text-emerald-600",
    title: "Practical Course Content",
    description:
      "Equipped with realistic case studies, audit simulation scenarios, non-conformity exercises, and ready-to-use checklist templates.",
  },
  {
    icon: FaHeadset,
    accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
    iconColor: "text-indigo-600",
    title: "Dedicated Learner Support",
    description:
      "Responsive guidance from our academic counseling team to assist with curriculum questions, enrollment, and platform navigation.",
  },
  {
    icon: FaAward,
    accent: "bg-purple-50 text-purple-600 border-purple-100",
    iconColor: "text-purple-600",
    title: "Progress & Verified Outcomes",
    description:
      "Interactive knowledge checks, real-time progress monitoring, and verifiable digital completion credentials for every qualified track.",
  },
];

const AboutFeatures = () => {
  return (
    <section className="relative bg-[#F6F8FC] py-20 lg:py-24 xl:py-28 border-y border-[#E2E8F0]/80">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>The Broadbeach Advantage</span>
          </div>

          <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
            Why Choose Broadbeach Academy
          </h2>

          <p className="mt-4 text-[#475569] text-base sm:text-[17px] leading-[1.7]">
            Built specifically to deliver measurable career results, our programs combine
            academic rigor with actionable real-world auditing and management expertise.
          </p>
        </div>

        {/* 3x2 Grid of Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-7 sm:p-8 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Duotone Icon Tile */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 ${feat.accent} group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="text-xl" />
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-[19px] font-bold text-[#121C46] leading-snug mb-3">
                  {feat.title}
                </h3>

                {/* Card Description */}
                <p className="text-[#475569] text-sm sm:text-[15px] leading-[1.65] flex-1">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AboutFeatures;
