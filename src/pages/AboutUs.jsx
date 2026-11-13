import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AboutHero from "../components/AboutUs/AboutHero";
import AboutStory from "../components/AboutUs/AboutStory";
import AboutFeatures from "../components/AboutUs/AboutFeatures";
import AboutProcess from "../components/AboutUs/AboutProcess";
import AboutMissionVision from "../components/AboutUs/AboutMissionVision";
import AboutAudience from "../components/AboutUs/AboutAudience";
import AboutCTA from "../components/AboutUs/AboutCTA";

/**
 * AboutUs Page Component — Broadbeach Academy
 * Modern, welcoming, editorial About Us page inspired by clean e-learning
 * landing-page design with generous whitespace, confident typography,
 * original vector-style learning illustration, and clear narrative flow.
 */
const AboutUs = () => {
  // Ensure view starts at the top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#121C46]">
      {/* =========================================================
          BREADCRUMB BAR (Clean & Subtle)
      ========================================================= */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-3 select-none">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center gap-2 text-xs font-semibold text-[#475569]">
          <Link
            to="/"
            className="hover:text-[#121C46] transition-colors"
            aria-label="Navigate to Home"
          >
            Home
          </Link>
          <span className="text-[#CBD5E1]" aria-hidden="true">/</span>
          <span className="text-[#121C46] font-bold">About Us</span>
        </div>
      </div>

      {/* =========================================================
          1. ABOUT HERO
      ========================================================= */}
      <AboutHero />

      {/* =========================================================
          2. WHO WE ARE (Editorial Story)
      ========================================================= */}
      <AboutStory />

      {/* =========================================================
          3. WHY CHOOSE BROADBEACH ACADEMY (3x2 Feature Grid)
      ========================================================= */}
      <AboutFeatures />

      {/* =========================================================
          4. HOW LEARNING WORKS (4-Step Illustrated Process)
      ========================================================= */}
      <AboutProcess />

      {/* =========================================================
          5. OUR MISSION & VISION (Two Editorial Cards)
      ========================================================= */}
      <AboutMissionVision />

      {/* =========================================================
          6. WHO WE SERVE (Audience Cards)
      ========================================================= */}
      <AboutAudience />

      {/* =========================================================
          7. CLOSING CTA BANNER
      ========================================================= */}
      <AboutCTA />
    </div>
  );
};

export default AboutUs;
