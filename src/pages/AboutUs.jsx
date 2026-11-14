import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AboutHero from "../components/AboutUs/AboutHero";
import AboutStory from "../components/AboutUs/AboutStory";
import AboutHowItWorks from "../components/AboutUs/AboutHowItWorks";
import AboutFeatures from "../components/AboutUs/AboutFeatures";
import AboutProcess from "../components/AboutUs/AboutProcess";
import AboutMissionVision from "../components/AboutUs/AboutMissionVision";
import AboutCategories from "../components/AboutUs/AboutCategories";
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
          1. ABOUT HERO
      ========================================================= */}
      <AboutHero />

      {/* =========================================================
          2. WHO WE ARE (Editorial Story Introduction)
      ========================================================= */}
      <AboutStory />

      {/* =========================================================
          3. HOW IT WORKS (Interactive Zigzag Vertical Timeline)
      ========================================================= */}
      <AboutHowItWorks />

      {/* =========================================================
          4. WHY CHOOSE BROADBEACH ACADEMY (3x2 Feature Grid)
      ========================================================= */}
      <AboutFeatures />

      {/* =========================================================
          5. OUR METHODOLOGY (4-Step Quality Framework)
      ========================================================= */}
      <AboutProcess />

      {/* =========================================================
          6. OUR VISION & MISSION (Two Editorial Cards)
      ========================================================= */}
      <AboutMissionVision />

      {/* =========================================================
          7. SKILL CATEGORIES (High-Level Overview of What We Teach)
      ========================================================= */}
      <AboutCategories />

      {/* =========================================================
          8. WHO WE SERVE (Audience Cards)
      ========================================================= */}
      <AboutAudience />

      {/* =========================================================
          9. CLOSING CTA BANNER
      ========================================================= */}
      <AboutCTA />
    </div>
  );
};

export default AboutUs;
