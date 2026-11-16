import React, { useEffect } from "react";
import {
  FaGlobe,
  FaAward,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import AboutBranchHero from "../components/AboutShared/AboutBranchHero";
import GlobalWorldMap from "../components/AboutUs/GlobalWorldMap";

/**
 * Global (Global Reach) Page — Broadbeach Academy
 * Features:
 * 1. Branch Hero with navigation and breadcrumbs
 * 2. Interactive World Map based on Excel certification source of truth (93 Countries, 27,200 Certifications)
 * 3. Verified Global Impact & Metrics Bar
 */
const Global = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const globalHighlights = [
    {
      icon: <FaGlobe />,
      number: "93+",
      label: "Countries With Active Certifications",
    },
    {
      icon: <FaClock />,
      number: "24/7",
      label: "Global Cloud Learning Availability",
    },
    {
      icon: <FaAward />,
      number: "27,200+",
      label: "Verified Certifications Issued",
    },
    {
      icon: <FaCheckCircle />,
      number: "100%",
      label: "Online Verifiable Credentials",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. BRANCH HERO */}
      <AboutBranchHero
        type="global"
        eyebrow="Worldwide Footprint"
        eyebrowColor="blue"
        title="Global Reach:"
        highlight="Certifications Across 93 Nations."
        description="Empowering compliance professionals, internal auditors, and corporate teams with borderless standards education and verifiable international credentials."
        breadcrumbs={[{ label: "Global Reach" }]}
        chips={[
          { text: "93 Active Countries" },
          { text: "27,200+ Certifications" },
          { text: "Verifiable ISO Credentials" },
        ]}
        primaryCta={{ label: "Explore International Courses", to: "/courses" }}
        secondaryCta={{ label: "Enterprise Partnerships", to: "/about/our-customers" }}
      />

      {/* 2. INTERACTIVE WORLD MAP (93 Countries, 27,200 Certifications) */}
      <GlobalWorldMap />

      {/* 3. VERIFIED GLOBAL METRICS BAR */}
      <section className="bg-[#131E4A] py-12 sm:py-14 text-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {globalHighlights.map((gh, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
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
