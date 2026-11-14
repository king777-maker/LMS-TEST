import React, { useEffect } from "react";
import {
  FaLightbulb,
  FaBullseye,
  FaCheck,
  FaGlobe,
  FaLaptopCode,
  FaCertificate,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaAward,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Our Vision Page — Broadbeach Academy
 * Includes:
 * 1. The exact "Our Vision & Mission" section from the About Us home page.
 * 2. Split-Screen 50/50 Layout for Vision Statement and Educational Philosophy.
 * 3. Media Object Layout for Strategic Pillars and Long-Term Horizon Milestones.
 */
const Vision = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const strategicPillars = [
    {
      icon: <FaGlobe />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Universal Global Access",
      subtitle: "Borderless Learning",
      description:
        "Removing geographic and financial obstacles so professionals in any nation can earn internationally recognized auditing credentials.",
    },
    {
      icon: <FaLaptopCode />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Pedagogical Innovation",
      subtitle: "Simulated Audit Scenarios",
      description:
        "Moving beyond static slides into interactive audit simulations, live checklist reviews, and real non-conformity investigations.",
    },
    {
      icon: <FaCertificate />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Accreditation & Integrity",
      subtitle: "Verifiable Certifications",
      description:
        "Upholding rigorous examination standards so every issued certificate carries verifiable weight with employers and third-party registrars.",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Industry Compliance Alignment",
      subtitle: "Up-to-Date Curricula",
      description:
        "Continuous curriculum revision ensuring complete synchronization with new ISO editions, Annex SL updates, and statutory rules.",
    },
    {
      icon: <FaRocket />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Career Acceleration",
      subtitle: "Measurable Impact",
      description:
        "Equipping learners with executive reporting tools, interview confidence, and lead auditor leadership traits for swift advancement.",
    },
    {
      icon: <FaUsers />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Global Auditor Community",
      subtitle: "Collaborative Network",
      description:
        "Connecting thousands of quality, environmental, and safety professionals across continents to exchange best practices.",
    },
  ];

  const horizonMilestones = [
    {
      icon: <FaAward />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "50,000+ Certified Professionals",
      subtitle: "Global Milestone",
      description:
        "Expanding our graduate network to empower over fifty thousand professionals with verifiable credentials by 2030.",
    },
    {
      icon: <FaGlobe />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Presence in 75+ Countries",
      subtitle: "International Footprint",
      description:
        "Broadening regional corporate compliance partnerships across Europe, Asia-Pacific, the Americas, and the Middle East.",
    },
    {
      icon: <FaLaptopCode />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Next-Gen Virtual Auditing Labs",
      subtitle: "Technological Frontier",
      description:
        "Deploying AI-assisted audit roleplay scenarios and automated evidence analysis tools into every Lead Auditor track.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Our Vision:"
        highlight="Transforming Professional Learning"
        description="Setting the global benchmark for practical, learner-centric ISO standards training and credentialing."
        breadcrumbs={[{ label: "Our Vision" }]}
      />

      {/* 2. OUR VISION & MISSION SECTION (Exact Section from About Us Home Page) */}
      <section className="relative bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
              <span>Guiding Principles</span>
            </div>

            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-[1.2] tracking-tight">
              Our Vision &amp; Mission
            </h2>

            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-[1.6]">
              The strategic foundations driving our curriculum, academic support, and dedication to learner achievement.
            </p>
          </div>

          {/* Two Balanced Editorial Cards (Vision First, Mission Second) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                    <FaLightbulb className="text-xl" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100">
                    Future Horizon
                  </span>
                </div>

                <h3 className="text-xl sm:text-[24px] font-extrabold text-[#121C46] leading-tight mb-3">
                  Our Vision
                </h3>

                <p className="text-[#475569] text-sm sm:text-[15.5px] leading-[1.7]">
                  To be the most trusted and recognized online academy for international standards
                  training, ISO lead auditor education, and professional development—setting the
                  benchmark for modern, learner-centric certification pathways across global industries.
                </p>
              </div>

              {/* Key Pillars */}
              <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-3">
                {[
                  "Expanding global access to internationally recognized qualifications",
                  "Innovating interactive learning platforms and simulation methodologies",
                  "Building a worldwide community of certified standards champions",
                ].map((pillar, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheck className="text-[10px]" />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#121C46] leading-relaxed">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                    <FaBullseye className="text-xl" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-50/80 px-3 py-1 rounded-full border border-orange-100">
                    Core Purpose
                  </span>
                </div>

                <h3 className="text-xl sm:text-[24px] font-extrabold text-[#121C46] leading-tight mb-3">
                  Our Mission
                </h3>

                <p className="text-[#475569] text-sm sm:text-[15.5px] leading-[1.7]">
                  To empower learners and organizations globally by delivering accessible,
                  practical, and rigorous professional standards training. We strive to make
                  complex compliance frameworks actionable, enabling professionals to lead audits,
                  protect workplace health and safety, and advance their careers with verified credentials.
                </p>
              </div>

              {/* Key Pillars */}
              <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-3">
                {[
                  "Delivering practical, job-ready auditing and compliance knowledge",
                  "Fostering continuous learning through accessible digital delivery",
                  "Maintaining uncompromised academic integrity and course quality",
                ].map((pillar, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheck className="text-[10px]" />
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

      {/* 3. SPLIT-SCREEN VISION STATEMENT (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="ACADEMY VISION"
        eyebrowColor="blue"
        eyebrowIcon={<FaLightbulb className="text-xs text-[#2563EB]" />}
        title="A Future Where Standards Education"
        highlightText="Is Accessible to Everyone."
        paragraphs={[
          "Broadbeach Online Academy was founded on a forward-looking premise: that understanding international standards should not be confined to elite physical auditor conferences or dense, expensive seminars.",
          "Our vision is to build the world's most trusted, accessible online learning ecosystem for ISO standards, auditing methodologies, and workplace safety certifications. We aspire to empower every dedicated professional to lead audits, uphold quality, and protect lives.",
        ]}
        bullets={[
          { text: "Universal access regardless of location or career stage" },
          { text: "Practical curriculum designed for immediate workplace application" },
          { text: "Verifiable credentials that build genuine employer confidence" },
        ]}
        imageSrc="/assets/about/vision-mission.jpg"
        imageAlt="Broadbeach Academy Vision and Mission"
        imagePosition="right"
        floatingBadge={{
          title: "GLOBAL VISION",
          subtitle: "Standardized Excellence Worldwide",
          icon: <FaGlobe />,
        }}
        ctaPrimary={{ label: "Explore Our Courses", to: "/course" }}
        ctaSecondary={{ label: "Read Our Story", to: "/about/history" }}
        bgColor="white"
      />

      {/* 4. MEDIA OBJECT: STRATEGIC PILLARS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>Core Foundations</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              The Strategic Pillars Driving Our Vision
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Every course, interactive assessment, and platform feature is anchored in these six educational pillars.
            </p>
          </div>

          {/* 3-Column Grid of Media Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {strategicPillars.map((pillar, index) => (
              <AboutMediaObject
                key={index}
                icon={pillar.icon}
                iconColor={pillar.iconColor}
                iconBg={pillar.iconBg}
                title={pillar.title}
                subtitle={pillar.subtitle}
                description={pillar.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPLIT-SCREEN PHILOSOPHY (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="EDUCATIONAL PHILOSOPHY"
        eyebrowColor="orange"
        title="Bridging Theoretical Clauses"
        highlightText="With Operational Execution"
        paragraphs={[
          "Memorizing standard clauses does not make an effective auditor; understanding how real organizations operate does. Our learning model combines ISO specifications with actual operational case studies.",
          "Learners evaluate realistic non-conformity reports, draft audit plans, interview department leaders in simulation exercises, and present closing meeting conclusions. This methodology bridges the chasm between textbook knowledge and boardroom credibility.",
        ]}
        bullets={[
          { text: "Hands-on audit scenarios and evidence verification" },
          { text: "Formulating actionable corrective action requests (CARs)" },
          { text: "Developing confident audit leadership and communication" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Interactive Professional Learning"
        imagePosition="left"
        floatingBadge={{
          title: "PRAGMATIC RIGOR",
          subtitle: "Beyond Rote Memorization",
          icon: <FaCertificate />,
        }}
        bgColor="white"
      />

      {/* 6. MEDIA OBJECT: HORIZON MILESTONES */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Looking Ahead: Strategic Milestones
            </h2>
            <p className="mt-2 text-[#475569] text-sm sm:text-base leading-relaxed">
              Our roadmap for technological innovation and educational expansion over the next decade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {horizonMilestones.map((ms, idx) => (
              <AboutMediaObject
                key={idx}
                icon={ms.icon}
                iconColor={ms.iconColor}
                iconBg={ms.iconBg}
                title={ms.title}
                subtitle={ms.subtitle}
                description={ms.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Vision;
