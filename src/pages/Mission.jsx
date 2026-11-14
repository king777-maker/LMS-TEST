import React, { useEffect } from "react";
import {
  FaBullseye,
  FaCheckCircle,
  FaAward,
  FaShieldAlt,
  FaLaptopCode,
  FaClock,
  FaUsers,
  FaFileContract,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Our Mission Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for Mission Statement and Inclusivity Commitment.
 * 2. Media Object Layout for Strategic Academic Objectives and Values in Action.
 */
const Mission = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const coreObjectives = [
    {
      icon: <FaCheckCircle />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Practical Competency Over Theory",
      subtitle: "Job-Ready Skills",
      description:
        "Every lesson directly equips learners with audit checklists, non-conformity classification techniques, and management review templates.",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Rigorous International Quality",
      subtitle: "Accreditation Adherence",
      description:
        "Courses strictly align with ISO/IEC directives, ensuring that completions are recognized by certifying bodies and corporate employers.",
    },
    {
      icon: <FaClock />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Flexible Digital Self-Paced Access",
      subtitle: "Built for Working Adults",
      description:
        "Study at your own schedule without disrupting your full-time job. 24/7 access across laptop, tablet, and mobile devices.",
    },
    {
      icon: <FaLaptopCode />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Continuous Curriculum Modernization",
      subtitle: "Evolving Frameworks",
      description:
        "Regular content updates tracking the latest ISO amendment clauses, safety regulations, and cyber compliance standards.",
    },
    {
      icon: <FaFileContract />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Verifiable Credential Integrity",
      subtitle: "Tamper-Proof Verification",
      description:
        "Every certificate is issued with a unique verification code that can be authenticated instantly via our online verification portal.",
    },
    {
      icon: <FaUsers />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Responsive Student Support",
      subtitle: "Counselor & Mentor Guidance",
      description:
        "Dedicated academic support to assist learners with module clarifications, exam guidelines, and graduation documentation.",
    },
  ];

  const missionValues = [
    {
      icon: <FaShieldAlt />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Uncompromising Integrity",
      subtitle: "Honest Assessments",
      description:
        "We maintain ethical assessment standards so your certificate represents true competence, not just attendance.",
    },
    {
      icon: <FaAward />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Commitment to Excellence",
      subtitle: "High Standards",
      description:
        "We continuously review student outcomes and course feedback to refine our instructional design and clarity.",
    },
    {
      icon: <FaUsers />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Learner-Centric Pedagogy",
      subtitle: "Supportive Environment",
      description:
        "We treat every student as an emerging compliance leader, providing practical guidance tailored to career growth.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Our Mission:"
        highlight="Empowering Practical Mastery"
        description="Equipping professionals and organizations worldwide to master compliance, lead audits, and protect workplace excellence."
        breadcrumbs={[{ label: "Our Mission" }]}
      />

      {/* 2. SPLIT-SCREEN MISSION STATEMENT (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="CORE PURPOSE"
        eyebrowColor="orange"
        eyebrowIcon={<FaBullseye className="text-xs text-[#F97316]" />}
        title="Making International Standards"
        highlightText="Actionable, Accessible, and Impactful."
        paragraphs={[
          "Broadbeach Online Academy exists to bridge the persistent gap between complicated regulatory clauses and realistic workplace operations. We believe that when quality and safety managers are properly trained, entire organizations become safer, more reliable, and more productive.",
          "Our mission is to deliver rigorous, interactive, and universally accessible online training across ISO management systems, Lean Six Sigma, aerospace quality, and auditing methodologies. We empower professionals to protect workplace health, guarantee quality, and earn verified credentials that open career doors.",
        ]}
        bullets={[
          { text: "100% online self-paced study designed for busy professionals" },
          { text: "Hands-on audit exercises, mock interviews, and case simulations" },
          { text: "Instant online credential verification for prospective employers" },
        ]}
        imageSrc="/assets/about/values.jpg"
        imageAlt="Broadbeach Academy Mission"
        imagePosition="right"
        floatingBadge={{
          title: "PRACTICAL MISSION",
          subtitle: "Measurable Workplace Competency",
          icon: <FaBullseye />,
        }}
        ctaPrimary={{ label: "Browse Courses", to: "/course" }}
        ctaSecondary={{ label: "View Our Team", to: "/about/our-team" }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: CORE OBJECTIVES */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Measurable Goals</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              Key Objectives That Drive Our Daily Work
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Our educational programs are measured against six core objectives to guarantee learner achievement.
            </p>
          </div>

          {/* 3-Column Grid of Media Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {coreObjectives.map((obj, index) => (
              <AboutMediaObject
                key={index}
                icon={obj.icon}
                iconColor={obj.iconColor}
                iconBg={obj.iconBg}
                title={obj.title}
                subtitle={obj.subtitle}
                description={obj.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN COMMITMENT (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="STUDENT SUCCESS"
        eyebrowColor="blue"
        title="A Lasting Commitment To"
        highlightText="Every Learner's Journey"
        paragraphs={[
          "From your first lesson to your final certification exam, Broadbeach Online Academy provides a supportive, clear, and organized path forward.",
          "We measure our success not by course registrations, but by student mastery—the confidence our graduates show when leading their first real audit, identifying non-conformities, and presenting audit reports to executive management.",
        ]}
        bullets={[
          { text: "Constructive feedback from seasoned ISO auditors" },
          { text: "Career-advancing credentials respected across 45+ countries" },
          { text: "Lifetime access to completed course reference notes" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Student Mentorship and Learning Success"
        imagePosition="left"
        floatingBadge={{
          title: "LEARNER SUCCESS",
          subtitle: "Guidance At Every Step",
          icon: <FaAward />,
        }}
        bgColor="white"
      />

      {/* 5. MEDIA OBJECT: VALUES IN ACTION */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Our Values In Action
            </h2>
            <p className="mt-2 text-[#475569] text-sm sm:text-base leading-relaxed">
              How our core mission translates into everyday classroom and customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {missionValues.map((val, idx) => (
              <AboutMediaObject
                key={idx}
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
    </main>
  );
};

export default Mission;
