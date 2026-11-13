import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaUserTie, FaBuilding, FaArrowRight } from "react-icons/fa";

/**
 * AboutAudience Component (Who We Serve)
 * Three editorial audience cards highlighting who benefits from Broadbeach Academy.
 */
const audiences = [
  {
    icon: FaGraduationCap,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    badge: "FOUNDATIONAL SKILLS",
    title: "Students & New Learners",
    description:
      "Start your professional journey with foundational management concepts, introductory compliance tracks, and resume-enhancing certifications.",
    ctaText: "Explore Free Courses",
    ctaLink: "/free-courses",
  },
  {
    icon: FaUserTie,
    accent: "bg-blue-50 text-[#2563EB] border-blue-100",
    badge: "CAREER ADVANCEMENT",
    title: "Working Professionals",
    description:
      "Upskill with recognized Lead Auditor, Internal Auditor, and Health & Safety qualifications designed to accelerate your seniority and earning potential.",
    ctaText: "Browse Professional Courses",
    ctaLink: "/course",
  },
  {
    icon: FaBuilding,
    accent: "bg-orange-50 text-[#F97316] border-orange-100",
    badge: "ORGANIZATIONAL EXCELLENCE",
    title: "Teams & Organizations",
    description:
      "Equip your department or workforce with standardized compliance competencies, internal audit readiness, and continuous improvement training.",
    ctaText: "Inquire for Teams",
    ctaLink: "/contact",
  },
];

const AboutAudience = () => {
  return (
    <section className="relative bg-white py-20 lg:py-24 xl:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FC] border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Target Audiences</span>
          </div>

          <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
            Who We Serve
          </h2>

          <p className="mt-4 text-[#475569] text-base sm:text-[17px] leading-[1.7]">
            Tailored learning pathways engineered for individuals at every career stage
            as well as corporate compliance teams.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((aud, index) => {
            const Icon = aud.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center border ${aud.accent} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="text-2xl" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-[#475569] uppercase bg-[#F6F8FC] px-3 py-1 rounded-full border border-[#E2E8F0]">
                      {aud.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#121C46] leading-snug mb-3">
                    {aud.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#475569] text-sm sm:text-[15px] leading-[1.7] mb-8">
                    {aud.description}
                  </p>
                </div>

                {/* Card CTA Link */}
                <Link
                  to={aud.ctaLink}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#121C46] group-hover:text-[#2563EB] transition-colors"
                >
                  <span>{aud.ctaText}</span>
                  <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AboutAudience;
