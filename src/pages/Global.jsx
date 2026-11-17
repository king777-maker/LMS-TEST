import React, { useEffect } from "react";
import SEO from "../components/common/SEO";
import GlobalWorldMap from "../components/AboutUs/GlobalWorldMap";

/**
 * Global (Global Reach) Page — Broadbeach Academy
 * Framed, single-screen interactive world map without vertical scrolling.
 */
const Global = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Ensure footer is hidden on this specific route so the whole map fits in screen without scroll
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }
    return () => {
      if (footer) {
        footer.style.display = "";
      }
    };
  }, []);

  return (
    <main className="h-[calc(100vh-86px)] max-h-[calc(100vh-86px)] overflow-hidden bg-white text-[#121C46] flex flex-col">
      <SEO
        title="Global Reach — Worldwide Certification Footprint"
        description="Explore Broadbeach Online Academy's worldwide certification footprint across 93 nations with over 27,200 verified credentials issued."
        breadcrumbs={[{ name: "Global Reach", url: "/about/global-foot-print" }]}
      />
      <GlobalWorldMap />
    </main>
  );
};

export default Global;
