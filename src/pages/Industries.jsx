import React, { useEffect } from "react";
import {
  FaIndustry,
  FaPlane,
  FaHeartbeat,
  FaServer,
  FaHardHat,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Industries Page (/about/industries) — Broadbeach Academy
 * Standardized using Split-Screen and Media Object UI patterns.
 */
const Industries = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const sectors = [
    {
      icon: <FaIndustry />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Manufacturing & Precision Engineering",
      subtitle: "ISO 9001 & Lean Six Sigma",
      description:
        "Equipping plant managers and quality auditors with statistical process control, root cause analysis, and calibration compliance procedures.",
    },
    {
      icon: <FaPlane />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Aerospace & Defense Suppliers",
      subtitle: "AS9100 Quality Frameworks",
      description:
        "High-reliability quality standards, foreign object damage (FOD) prevention, traceability, and rigorous supplier auditing protocols.",
    },
    {
      icon: <FaHeartbeat />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Healthcare, Biotech & Medical Devices",
      subtitle: "ISO 13485 & Biosafety Standards",
      description:
        "Patient safety compliance, cleanroom validation, medical device regulatory auditing, and clinical risk mitigation frameworks.",
    },
    {
      icon: <FaServer />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Information Technology & Cybersecurity",
      subtitle: "ISO 27001 & Data Governance",
      description:
        "Protecting cloud data centers, conducting vendor security risk audits, and enforcing GDPR and data privacy compliance controls.",
    },
    {
      icon: <FaHardHat />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Construction, Energy & Infrastructure",
      subtitle: "ISO 45001 & Zero-Harm Culture",
      description:
        "Hazardous jobsite risk assessments, contractor safety oversight, incident investigation, and environmental impact management.",
    },
    {
      icon: <FaTruck />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Logistics, Supply Chain & Maritime",
      subtitle: "ISO 14001 & Cold-Chain Auditing",
      description:
        "Cross-border shipping compliance, carbon emission monitoring, warehouse temperature validation, and customs security auditing.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Industries We Serve:"
        highlight="Cross-Sector Compliance Expertise"
        description="Broadbeach Online Academy equips professionals across 6 major global industrial sectors with tailored auditing competencies."
        breadcrumbs={[{ label: "Industries" }]}
      />

      {/* 2. SPLIT-SCREEN INDUSTRY OVERVIEW (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="MULTI-SECTOR RIGOR"
        eyebrowColor="blue"
        eyebrowIcon={<FaIndustry className="text-xs text-[#2563EB]" />}
        title="Harmonized Standards Across"
        highlightText="Diverse Industrial Landscapes"
        paragraphs={[
          "While fundamental quality and auditing principles are universal, specific operational risks vary widely between a sterile medical lab, a high-precision aerospace facility, and a cloud computing center.",
          "Broadbeach Academy structures courses so that learners practice with scenario case studies drawn directly from their own professional sector—ensuring maximum day-one relevance and leadership readiness.",
        ]}
        bullets={[
          { text: "Sector-specific audit checklists and non-conformity examples" },
          { text: "Taught by faculty with direct operational experience in these industries" },
          { text: "Harmonized with current ISO and statutory compliance directives" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Industrial Training"
        imagePosition="right"
        floatingBadge={{
          title: "INDUSTRY ALIGNED",
          subtitle: "6 Core Global Sectors",
          icon: <FaIndustry />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: SECTOR BREAKDOWN */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#121C46] leading-tight">
              Specialized Industry Curriculum
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              Explore how our course tracks adapt standard clauses to solve sector-specific compliance challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {sectors.map((sec, index) => (
              <AboutMediaObject
                key={index}
                icon={sec.icon}
                iconColor={sec.iconColor}
                iconBg={sec.iconBg}
                title={sec.title}
                subtitle={sec.subtitle}
                description={sec.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN SPECIALIZED SIMULATIONS (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="AUDIT SCENARIO PRACTICE"
        eyebrowColor="orange"
        title="Simulated Audit Scenarios"
        highlightText="Tailored To Your Sector"
        paragraphs={[
          "When taking a Lead Auditor exam at Broadbeach, you won't encounter generic hypothetical questions. An aerospace engineer will audit a simulated titanium supplier certificate of analysis; an IT auditor will inspect access control logs against ISO 27001 Annex A.",
          "This granular focus gives our alumni the practical instinct required to spot discrepancies, interview process owners respectfully, and write actionable audit findings.",
        ]}
        bullets={[
          { text: "Realistic evidence verification exercises" },
          { text: "Standardized audit report writing practice" },
          { text: "Immediate applicability to internal audits upon course completion" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Specialized Industry Audit Simulations"
        imagePosition="left"
        floatingBadge={{
          title: "REAL EVIDENCE AUDITS",
          subtitle: "Domain-Specific Exercises",
          icon: <FaShieldAlt />,
        }}
        bgColor="white"
      />
    </main>
  );
};

export default Industries;
