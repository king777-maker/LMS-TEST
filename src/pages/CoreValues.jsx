import React, { useEffect } from "react";
import {
  FaHeart,
  FaShieldAlt,
  FaAward,
  FaGlobe,
  FaUsers,
  FaSyncAlt,
  FaCheckCircle,
  FaHandshake,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Core Values Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for Values Foundation and Institutional Culture.
 * 2. Media Object Layout for Core Values Grid and Code of Conduct Commitments.
 */
const CoreValues = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const valuesList = [
    {
      icon: <FaShieldAlt />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Uncompromising Integrity",
      subtitle: "Honest Assessments",
      description:
        "We uphold strict academic ethics. Assessments are thoroughly validated, and certificates represent real demonstrated competence, never rubber-stamping.",
    },
    {
      icon: <FaAward />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Practical & Academic Rigor",
      subtitle: "Real-World Focus",
      description:
        "Every lesson pairs formal ISO clause specifications with realistic audit checklists, evidence logs, and non-conformity reporting exercises.",
    },
    {
      icon: <FaGlobe />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Universal Inclusivity",
      subtitle: "Global Access",
      description:
        "We believe quality education belongs to everyone. Our platform removes geographical and scheduling barriers for learners across 45+ countries.",
    },
    {
      icon: <FaUsers />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Learner-First Support",
      subtitle: "Dedicated Mentorship",
      description:
        "Students are treated as future compliance leaders. Our advisors and instructors provide responsive guidance throughout every course module.",
    },
    {
      icon: <FaSyncAlt />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Continuous Improvement",
      subtitle: "The Kaizen Mindset",
      description:
        "True to the ISO spirit of continual improvement, we constantly revise our learning materials to reflect new statutory regulations and student feedback.",
    },
    {
      icon: <FaHandshake />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Transparency & Trust",
      subtitle: "Open Credentialing",
      description:
        "We provide transparent course outcomes and an instant digital certificate verification system that builds lasting trust with employers.",
    },
  ];

  const commitments = [
    {
      icon: <FaCheckCircle />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "100% Verifiable Credentials",
      subtitle: "Employer Confidence",
      description:
        "Every issued certificate contains a distinct verification key that can be authenticated globally 24/7.",
    },
    {
      icon: <FaCheckCircle />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Up-to-Date Course Material",
      subtitle: "Current Regulatory Clauses",
      description:
        "Our academic board reviews content quarterly to integrate recent ISO revisions and international standard amendments.",
    },
    {
      icon: <FaCheckCircle />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Ethical Exam Standards",
      subtitle: "Academic Honesty",
      description:
        "Comprehensive knowledge checks and scenario evaluations protect the high reputational value of our graduates' credentials.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Our Core Values:"
        highlight="The Compass Guiding Every Standard"
        description="The foundational principles that shape our curriculum design, student relationships, and accreditation standards."
        breadcrumbs={[{ label: "Core Values" }]}
      />

      {/* 2. SPLIT-SCREEN VALUES INTRODUCTION (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="INSTITUTIONAL VALUES"
        eyebrowColor="blue"
        eyebrowIcon={<FaHeart className="text-xs text-[#2563EB]" />}
        title="Principles That Define Our"
        highlightText="Educational Standards"
        paragraphs={[
          "At Broadbeach Online Academy, our values are not generic slogans on a wall—they are the operational benchmarks that govern how our courses are authored, how student assessments are evaluated, and how certificates are issued.",
          "Because our graduates go on to lead internal audits, manage environmental compliance, and oversee workplace occupational safety, we hold ourselves to the highest ethical and pedagogical standards.",
        ]}
        bullets={[
          { text: "Integrity in assessment and credential issuance" },
          { text: "Practical curriculum designed for immediate career utility" },
          { text: "Respectful, responsive support for every learner" },
        ]}
        imageSrc="/assets/about/values.jpg"
        imageAlt="Broadbeach Academy Core Values"
        imagePosition="right"
        floatingBadge={{
          title: "CORE INTEGRITY",
          subtitle: "Ethical Standards in Every Module",
          icon: <FaShieldAlt />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: CORE VALUES GRID */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Ethical Benchmarks</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              The Six Values We Live By
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              These six core tenets guide every instructor, student mentor, and institutional decision at Broadbeach Academy.
            </p>
          </div>

          {/* 3-Column Grid of Media Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {valuesList.map((val, index) => (
              <AboutMediaObject
                key={index}
                icon={val.icon}
                iconColor={val.iconColor}
                iconBg={val.iconBg}
                title={val.title}
                subtitle={val.subtitle}
                description={val.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN VALUES IN ACTION (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="ACADEMIC RIGOR"
        eyebrowColor="orange"
        title="Protecting The Reputation"
        highlightText="Of Your Certificate"
        paragraphs={[
          "When you add a Broadbeach Lead Auditor certificate to your resume, employers know you earned it through rigorous evaluation.",
          "We never compromise on grading standards or skip essential modules. By preserving genuine academic difficulty, we ensure that every Broadbeach certificate is respected by hiring managers, quality directors, and certification auditors.",
        ]}
        bullets={[
          { text: "Rigorous scenario-based module knowledge checks" },
          { text: "Authentic compliance case studies and checklists" },
          { text: "Verifiable credentials that withstand employer scrutiny" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Academic Rigor and Credential Integrity"
        imagePosition="left"
        floatingBadge={{
          title: "STANDARDS FIRST",
          subtitle: "Recognized Credential Quality",
          icon: <FaAward />,
        }}
        bgColor="white"
      />

      {/* 5. MEDIA OBJECT: ETHICAL COMMITMENTS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Our Institutional Commitments
            </h2>
            <p className="mt-2 text-[#475569] text-sm sm:text-base leading-relaxed">
              How our ethical foundation translates into genuine value for every student.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {commitments.map((c, idx) => (
              <AboutMediaObject
                key={idx}
                icon={c.icon}
                iconColor={c.iconColor}
                iconBg={c.iconBg}
                title={c.title}
                subtitle={c.subtitle}
                description={c.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CoreValues;
