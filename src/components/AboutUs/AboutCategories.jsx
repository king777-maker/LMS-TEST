import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlane,
  FaMicroscope,
  FaShieldAlt,
  FaAward,
  FaLock,
  FaCogs,
  FaArrowRight,
  FaBookOpen,
  FaCheckCircle,
} from "react-icons/fa";

/**
 * AboutCategories Component
 * Strategic overview of the core skill domains and industry sectors taught at Broadbeach Academy.
 * Designed to provide a high-level educational bridge to the catalog with clear pillar cards,
 * 1-sentence outcomes, key stats, target audience alignment, and direct catalog actions.
 */
const skillCategories = [
  {
    id: "aerospace-industrial",
    title: "Aerospace & Industrial Operations",
    badge: "AEROSPACE & DEFENSE",
    target: "For Aerospace & Systems Engineers",
    accent: "bg-sky-50 text-sky-600 border-sky-100",
    icon: FaPlane,
    description:
      "Master AS9100 Rev D quality systems, aviation compliance, flight-critical quality assurance, and high-reliability industrial supply chain governance.",
    stats: "6+ Specialized Courses • AS9100 Standards",
    ctaLink: "/course",
  },
  {
    id: "quality-management",
    title: "Quality Management & Metrology",
    badge: "QUALITY & METROLOGY",
    target: "For QA/QC Engineers & Inspectors",
    accent: "bg-blue-50 text-[#2563EB] border-blue-100",
    icon: FaMicroscope,
    description:
      "Hands-on training in geometric dimensioning (GD&T ASME Y14.5), CMM/VMM optical inspection, NDT non-destructive testing, and supplier quality engineering.",
    stats: "15+ Technical Courses • GD&T & NDT",
    ctaLink: "/course",
  },
  {
    id: "health-safety-hse",
    title: "Health, Safety & Environment (HSE)",
    badge: "SAFETY & ENVIRONMENT",
    target: "For Safety Officers & HSE Managers",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: FaShieldAlt,
    description:
      "Accredited AOSH, IOSH (UK), and OSHA certifications covering process safety, hazard identification, emergency rescue, and Level 6/7 international diplomas.",
    stats: "80+ Certifications • AOSH, IOSH & OSHA",
    ctaLink: "/health-safety",
  },
  {
    id: "lead-auditor-standards",
    title: "ISO Lead & Internal Auditor",
    badge: "ACCREDITED AUDITING",
    target: "For Auditors & Compliance Leads",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
    icon: FaAward,
    description:
      "CQI-IRCA and Exemplar Global aligned auditor qualifications across ISO 9001 (Quality), 14001 (Environment), 45001 (Safety), 22000 (Food), and 50001 (Energy).",
    stats: "24+ ISO Frameworks • Global Accreditation",
    ctaLink: "/lead-auditor",
  },
  {
    id: "infosec-cyber",
    title: "Information Security & Cyber Risk",
    badge: "INFOSEC & CYBER RISK",
    target: "For IT Security & Risk Specialists",
    accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
    icon: FaLock,
    description:
      "ISO/IEC 27001:2022 management frameworks, IT governance, vulnerability management, and organizational data privacy compliance protocols.",
    stats: "10+ InfoSec Programs • ISO 27001 Aligned",
    ctaLink: "/certifications",
  },
  {
    id: "operational-excellence",
    title: "Operational Excellence & Lean",
    badge: "LEAN & EXCELLENCE",
    target: "For Operations Directors & Plant Heads",
    accent: "bg-orange-50 text-[#F97316] border-orange-100",
    icon: FaCogs,
    description:
      "Proven operational acceleration frameworks including Six Sigma, Total Productive Maintenance (TPM), Kaizen shopfloor optimization, 5S visual order, and ESG compliance.",
    stats: "20+ Lean Disciplines • Six Sigma & ESG",
    ctaLink: "/course",
  },
];

const AboutCategories = () => {
  return (
    <section
      id="skill-categories"
      className="relative bg-white py-10 sm:py-12 lg:py-16 overflow-hidden border-t border-[#E2E8F0]/80"
      aria-label="Skill Categories and Academic Domains"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* =======================================================
            SECTION HEADER
        ======================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FC] border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Curriculum Domains</span>
          </div>

          <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
            Skill Categories We Teach
          </h2>

          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-[1.6]">
            We organize our curriculum into six industry-aligned pillars designed to bridge
            the gap between regulatory standards and real-world execution.
          </p>
        </div>

        {/* =======================================================
            6 HIGH-LEVEL PILLAR CARDS (3x2 Grid)
        ======================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skillCategories.map((category) => {
            const IconComponent = category.icon;

            return (
              <div
                key={category.id}
                className="group bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${category.accent} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <IconComponent className="text-xl" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase bg-[#F6F8FC] text-[#475569] px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                      {category.badge}
                    </span>
                  </div>

                  {/* Target Audience Pill */}
                  <div className="mb-2.5">
                    <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50/70 px-2.5 py-0.5 rounded-md inline-block">
                      {category.target}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-[19px] font-bold text-[#121C46] leading-snug mb-2 group-hover:text-[#2563EB] transition-colors">
                    {category.title}
                  </h3>

                  {/* 1-Sentence Summary Description */}
                  <p className="text-[#475569] text-sm leading-[1.65] mb-5">
                    {category.description}
                  </p>
                </div>

                {/* Card Footer: Scale Stats & Catalog Link */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
                    <FaCheckCircle className="text-[11px] text-emerald-500 shrink-0" />
                    <span>{category.stats}</span>
                  </span>

                  <Link
                    to={category.ctaLink}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#121C46] group-hover:text-[#2563EB] transition-colors shrink-0"
                    aria-label={`Explore ${category.title}`}
                  >
                    <span>Explore</span>
                    <FaArrowRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* =======================================================
            BOTTOM CATALOG BRIDGE CTA
        ======================================================= */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-7 rounded-2xl bg-[#F6F8FC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 hidden sm:flex">
              <FaBookOpen className="text-lg" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#121C46]">
                Looking for a custom curriculum or corporate team training?
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Explore our full catalog of over 200+ certified courses and accredited credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/free-courses"
              className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#121C46] font-bold text-xs sm:text-sm border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer"
            >
              Free Courses
            </Link>
            <Link
              to="/course"
              className="h-10 px-5 rounded-xl bg-[#121C46] hover:bg-[#1a2861] text-white font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Browse Catalog</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutCategories;
