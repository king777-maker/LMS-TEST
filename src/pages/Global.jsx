import React, { useEffect } from "react";
import {
  FaGlobe,
  FaMapMarkedAlt,
  FaBuilding,
  FaShieldAlt,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import AboutBranchHero from "../components/AboutShared/AboutBranchHero";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Global (Global Reach) Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for Worldwide Reach and Enterprise Compliance Standardization.
 * 2. Media Object Layout for Regional Learning Corridors and International Metrics.
 */
const Global = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const regionalHubs = [
    {
      icon: <FaGlobe />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Europe & United Kingdom",
      subtitle: "ISO 9001, 14001 & ESG Focus",
      description:
        "Serving professionals across the UK, Germany, France, and Scandinavia seeking accredited Lead Auditor and environmental sustainability credentials.",
    },
    {
      icon: <FaBuilding />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Asia-Pacific Manufacturing Hub",
      subtitle: "Lean & Aerospace Quality",
      description:
        "Extensive corporate adoption across Singapore, India, Japan, and Australia for industrial quality management and aerospace supplier compliance.",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Middle East & Gulf Region",
      subtitle: "Occupational Safety (ISO 45001)",
      description:
        "Rapid adoption across the UAE, Saudi Arabia, and Qatar within energy, infrastructure, logistics, and heavy construction safety management.",
    },
    {
      icon: <FaAward />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "North America",
      subtitle: "Information Security (ISO 27001)",
      description:
        "Supporting compliance directors, IT auditors, and quality managers across the US and Canada in cybersecurity and quality integration.",
    },
    {
      icon: <FaUsers />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Africa & Emerging Markets",
      subtitle: "Vocational & Professional Access",
      description:
        "Eliminating high travel expenses by providing direct online access to international Lead Auditor tracks for ambitious African professionals.",
    },
    {
      icon: <FaMapMarkedAlt />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Latin America & Global Logistics",
      subtitle: "Export & Supply Chain Standards",
      description:
        "Training agricultural, automotive, and logistics quality personnel to meet strict global trade and import-export audit requirements.",
    },
  ];

  const globalHighlights = [
    {
      icon: <FaGlobe />,
      number: "45+",
      label: "Countries With Active Learners",
    },
    {
      icon: <FaClock />,
      number: "24/7",
      label: "Global Cloud Learning Availability",
    },
    {
      icon: <FaUsers />,
      number: "50,000+",
      label: "Worldwide Community of Graduates",
    },
    {
      icon: <FaCheckCircle />,
      number: "100%",
      label: "Online Verifiable Credentials",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. BRANCH HERO (Split-Screen with Animated Cartoon Illustration) */}
      <AboutBranchHero
        type="global"
        eyebrow="Worldwide Footprint"
        eyebrowColor="blue"
        title="Global Reach:"
        highlight="Education Across 45+ Nations."
        description="Empowering compliance professionals, internal auditors, and corporate teams with borderless standards education and verifiable international credentials."
        breadcrumbs={[{ label: "Global Reach" }]}
        chips={[
          { text: "45+ Active Countries" },
          { text: "24/7 Cloud Learning" },
          { text: "50,000+ Alumni Network" },
        ]}
        primaryCta={{ label: "Explore International Courses", to: "/courses" }}
        secondaryCta={{ label: "Enterprise Partnerships", to: "/about/our-customers" }}
      />

      {/* 2. SPLIT-SCREEN GLOBAL OVERVIEW (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="INTERNATIONAL FOOTPRINT"
        eyebrowColor="blue"
        eyebrowIcon={<FaGlobe className="text-xs text-[#2563EB]" />}
        title="Connecting Compliance Leaders"
        highlightText="Across The World."
        paragraphs={[
          "International standards are inherently global. Quality management, environmental protection, and occupational safety do not change at national borders—they unite organizations under shared principles of excellence.",
          "Broadbeach Online Academy was designed from day one to serve this international reality. Today, our students study across Europe, the Middle East, Asia-Pacific, Africa, and the Americas, sharing knowledge and earning credentials recognized across the globe.",
        ]}
        bullets={[
          { text: "Curriculum fully harmonized with international ISO/IEC specifications" },
          { text: "Self-paced study adapted to every global timezone" },
          { text: "Multi-jurisdiction case studies reflecting diverse regulatory frameworks" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Global Footprint"
        imagePosition="right"
        floatingBadge={{
          title: "WORLDWIDE NETWORK",
          subtitle: "Active Learners in 45+ Countries",
          icon: <FaGlobe />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: REGIONAL CORRIDORS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Worldwide Presence</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              Our Regional Learning Corridors
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Explore how professionals and enterprises across different continents leverage Broadbeach credentials.
            </p>
          </div>

          {/* 3-Column Grid of Media Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {regionalHubs.map((hub, index) => (
              <AboutMediaObject
                key={index}
                icon={hub.icon}
                iconColor={hub.iconColor}
                iconBg={hub.iconBg}
                title={hub.title}
                subtitle={hub.subtitle}
                description={hub.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN ENTERPRISE STANDARDIZATION (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="ENTERPRISE AUDIT CONSISTENCY"
        eyebrowColor="orange"
        title="Standardizing Compliance"
        highlightText="Across Multi-Site Organizations"
        paragraphs={[
          "For multinational enterprises with operations spread across continents, maintaining consistent internal audit standards is a persistent challenge.",
          "Broadbeach Online Academy provides corporations with a unified curriculum framework. When quality managers across factories in Germany, India, and Mexico complete the same Lead Auditor curriculum, internal audit reporting becomes consistent, comparable, and reliable.",
        ]}
        bullets={[
          { text: "Standardized audit checklist formats and grading criteria" },
          { text: "Centralized verification of employee credentials" },
          { text: "Scalable corporate cohort training with dedicated dashboards" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Global Enterprise Compliance Standardization"
        imagePosition="left"
        floatingBadge={{
          title: "ENTERPRISE CONSISTENCY",
          subtitle: "Harmonized Audit Protocols",
          icon: <FaBuilding />,
        }}
        bgColor="white"
      />

      {/* 5. MEDIA OBJECT: GLOBAL STATS */}
      <section className="bg-[#131E4A] py-12 sm:py-14 text-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {globalHighlights.map((gh, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FFDB58] flex items-center justify-center text-2xl shrink-0">
                  {gh.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {gh.number}
                  </div>
                  <div className="text-xs text-slate-300 font-medium leading-snug mt-0.5">
                    {gh.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Global;
