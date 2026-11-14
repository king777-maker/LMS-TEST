import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaAward,
  FaShieldAlt,
  FaCertificate,
  FaCheckCircle,
  FaSearch,
  FaFileContract,
  FaLaptopCode,
  FaGlobe,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Accreditations & Approvals Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for Standards Overview and Credential Authenticity.
 * 2. Media Object Layout for Approved Standards Frameworks and Verification Safeguards.
 */
const AccreditationsApprovals = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const standardsFrameworks = [
    {
      icon: <FaAward />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "ISO 9001:2015 Quality Management",
      subtitle: "Lead Auditor & Internal Auditor Tracks",
      description:
        "Full curriculum coverage of the Plan-Do-Check-Act (PDCA) cycle, risk-based thinking, non-conformity documentation, and third-party audit protocols.",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "ISO 14001:2015 Environmental Systems",
      subtitle: "EMS Compliance & Sustainability",
      description:
        "Practical environmental aspect evaluation, lifecycle perspective, legal compliance registers, and environmental performance audits.",
    },
    {
      icon: <FaCertificate />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "ISO 45001:2018 Occupational Health & Safety",
      subtitle: "OH&S Management Systems",
      description:
        "Hazard identification, risk assessment methodologies, worker participation frameworks, and proactive occupational incident prevention.",
    },
    {
      icon: <FaLaptopCode />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "ISO 27001:2022 Information Security",
      subtitle: "ISMS & Cyber Governance",
      description:
        "Annex A security controls, threat risk assessment models, incident response auditing, and data privacy governance verification.",
    },
    {
      icon: <FaFileContract />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "ISO 19011:2018 Auditing Guidelines",
      subtitle: "Core Auditor Competency",
      description:
        "The international benchmark governing audit principles, managing audit programs, conducting on-site investigations, and leading closing meetings.",
    },
    {
      icon: <FaGlobe />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Lean Six Sigma Frameworks",
      subtitle: "Continuous Improvement",
      description:
        "Yellow, Green, and Black Belt methodologies focusing on DMAIC, root cause analysis, statistical process control, and waste reduction.",
    },
  ];

  const verificationSteps = [
    {
      icon: <FaCertificate />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "1. Unique Serial Identifier",
      subtitle: "Tamper-Proof Code",
      description:
        "Each completion certificate receives an immutable registration number tied to the graduate's official academic record.",
    },
    {
      icon: <FaSearch />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "2. Instant Employer Verification",
      subtitle: "Real-Time Authentication",
      description:
        "Hiring managers, registrars, and corporate employers can verify credential validity in seconds via our public portal.",
    },
    {
      icon: <FaCheckCircle />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "3. Direct Accreditation Alignment",
      subtitle: "Standardized Rubric",
      description:
        "Confirms course syllabus completion, exam passing grade, issue date, and authorized academic signatory.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Accreditations & Approvals:"
        highlight="Rigorous Quality Benchmarks"
        description="Every Broadbeach Academy program is developed in strict alignment with international quality, safety, and auditing specifications."
        breadcrumbs={[{ label: "Accreditations & Approvals" }]}
      />

      {/* 2. SPLIT-SCREEN STANDARDS OVERVIEW (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="QUALITY & COMPLIANCE"
        eyebrowColor="blue"
        eyebrowIcon={<FaShieldAlt className="text-xs text-[#2563EB]" />}
        title="Designed In Strict Alignment"
        highlightText="With International Standards."
        paragraphs={[
          "Broadbeach Online Academy is committed to academic integrity and recognized qualification frameworks. Rather than inventing arbitrary courses, our curriculum authors adhere strictly to published ISO standard clauses and international audit methodologies.",
          "Whether you are enrolling in an ISO 9001 Lead Auditor course, an ISO 45001 safety track, or a Lean Six Sigma certification, you can be confident that your study materials conform to the exact guidelines used by third-party certification registrars.",
        ]}
        bullets={[
          { text: "Strict adherence to ISO/IEC qualification criteria" },
          { text: "Curriculum authored by certified Lead Auditor practitioners" },
          { text: "Verifiable digital credentials that employers authenticate instantly" },
        ]}
        imageSrc="/assets/certificate/certificate-template.png"
        imageAlt="Broadbeach Academy Official Certificate Template"
        imagePosition="right"
        floatingBadge={{
          title: "AUTHENTIC CERTIFICATES",
          subtitle: "Digital Verification Supported",
          icon: <FaAward />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: APPROVED STANDARDS FRAMEWORKS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Standard Specifications</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              Curriculum Aligned With Leading ISO Standards
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Explore the primary standard frameworks covered across our Lead Auditor, Internal Auditor, and Practitioner courses.
            </p>
          </div>

          {/* 3-Column Grid of Media Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {standardsFrameworks.map((std, index) => (
              <AboutMediaObject
                key={index}
                icon={std.icon}
                iconColor={std.iconColor}
                iconBg={std.iconBg}
                title={std.title}
                subtitle={std.subtitle}
                description={std.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN VERIFICATION INTEGRITY (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="CREDENTIAL SECURITY"
        eyebrowColor="orange"
        title="Guaranteed Authenticity Through"
        highlightText="Instant Digital Verification"
        paragraphs={[
          "In today's global job market, employers need assurance that an applicant's certification is genuine. Broadbeach Academy provides an online credential verification portal that confirms certificate authenticity immediately.",
          "Every credential issued includes a unique serial identifier and direct verification link. Hiring directors can verify your name, course title, completion date, and accredited competencies without delays.",
        ]}
        bullets={[
          { text: "Unique encrypted serial registration for every certificate" },
          { text: "Public 24/7 online verification tool accessible worldwide" },
          { text: "Full protection against credential falsification or tampering" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Verification Integrity and Examination Standards"
        imagePosition="left"
        floatingBadge={{
          title: "ONLINE VERIFICATION",
          subtitle: "Instant Employer Authentication",
          icon: <FaSearch />,
        }}
        ctaPrimary={{ label: "Verify a Certificate", to: "/categories/verify-certificate" }}
        bgColor="white"
      />

      {/* 5. MEDIA OBJECT: VERIFICATION SAFEGUARDS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Three Steps To Credential Verification
            </h2>
            <p className="mt-2 text-[#475569] text-sm sm:text-base leading-relaxed">
              How our system protects your reputation and makes your certification easy for employers to confirm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {verificationSteps.map((step, idx) => (
              <AboutMediaObject
                key={idx}
                icon={step.icon}
                iconColor={step.iconColor}
                iconBg={step.iconBg}
                title={step.title}
                subtitle={step.subtitle}
                description={step.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccreditationsApprovals;
