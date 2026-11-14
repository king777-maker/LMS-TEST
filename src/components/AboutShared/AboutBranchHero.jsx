import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaArrowRight } from "react-icons/fa";
import TeamIllustration from "./illustrations/TeamIllustration";
import VisionIllustration from "./illustrations/VisionIllustration";
import ApprovalsIllustration from "./illustrations/ApprovalsIllustration";
import GlobalReachIllustration from "./illustrations/GlobalReachIllustration";
import HappyCustomersIllustration from "./illustrations/HappyCustomersIllustration";

/**
 * AboutBranchHero — Reusable Split-Screen Hero for About Us Branch Pages
 * Features:
 * - Left 45–50%: Breadcrumbs, Eyebrow, High-contrast Title, Short Description, Feature Chips, Action Buttons
 * - Right 50–55%: Custom Animated 2D/3D-style Cartoon Illustration
 * - White / light blue-gray background with subtle border
 * - Mobile-first responsive grid collapsing cleanly on small screens
 */
const AboutBranchHero = ({
  type = "team",
  title,
  highlight,
  description,
  breadcrumbs = [],
  eyebrow = "Broadbeach Online Academy",
  eyebrowIcon,
  eyebrowColor = "blue",
  chips = [],
  primaryCta,
  secondaryCta,
  illustration,
}) => {
  // Render the matching cartoon illustration
  const renderIllustration = () => {
    if (illustration) return illustration;
    switch (type) {
      case "team":
        return <TeamIllustration />;
      case "vision":
        return <VisionIllustration />;
      case "approvals":
        return <ApprovalsIllustration />;
      case "global":
        return <GlobalReachIllustration />;
      case "customers":
        return <HappyCustomersIllustration />;
      default:
        return <TeamIllustration />;
    }
  };

  // Eyebrow color styling presets
  const eyebrowStyles = {
    blue: {
      bg: "bg-blue-50/90 border-blue-200/80 text-[#2563EB]",
      dot: "bg-[#2563EB]",
    },
    orange: {
      bg: "bg-orange-50/90 border-orange-200/80 text-[#F97316]",
      dot: "bg-[#F97316]",
    },
    yellow: {
      bg: "bg-amber-50/90 border-amber-200/80 text-amber-800",
      dot: "bg-amber-500",
    },
    emerald: {
      bg: "bg-emerald-50/90 border-emerald-200/80 text-emerald-700",
      dot: "bg-emerald-600",
    },
    navy: {
      bg: "bg-slate-100/90 border-slate-200/80 text-[#121C46]",
      dot: "bg-[#121C46]",
    },
  };

  const activeEyebrow = eyebrowStyles[eyebrowColor] || eyebrowStyles.blue;

  return (
    <section className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]/50 text-[#121C46] pt-7 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-[#E2E8F0] overflow-hidden">
      {/* Subtle ambient gradient highlights in background */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-orange-100/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN (45-50%): Text & Navigation Content           */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
            
            {/* Breadcrumb Navigation */}
            <nav
              className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] text-slate-500 mb-4 select-none font-medium"
              aria-label="Breadcrumb"
            >
              <Link
                to="/"
                className="hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1"
              >
                Home
              </Link>
              <FaChevronRight className="text-[9px] text-slate-400 shrink-0" />
              <Link
                to="/about-us"
                className="hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1"
              >
                About Us
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <FaChevronRight className="text-[9px] text-slate-400 shrink-0" />
                  {crumb.path ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-[#2563EB] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#121C46] font-semibold">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Eyebrow Pill */}
            {eyebrow && (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 select-none shadow-xs ${activeEyebrow.bg}`}
              >
                {eyebrowIcon ? (
                  <span className="shrink-0">{eyebrowIcon}</span>
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeEyebrow.dot}`} />
                )}
                <span>{eyebrow}</span>
              </div>
            )}

            {/* Main Page Title */}
            <h1 className="text-[32px] sm:text-[40px] lg:text-[44px] xl:text-[48px] font-extrabold tracking-tight leading-[1.15] text-[#121C46]">
              {title}{" "}
              {highlight && (
                <span className="text-[#F97316] relative inline-block">
                  {highlight}
                </span>
              )}
            </h1>

            {/* Short Narrative Description */}
            {description && (
              <p className="mt-4 text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl">
                {description}
              </p>
            )}

            {/* Optional Feature / Stat Chips */}
            {chips && chips.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-5">
                {chips.map((chip, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs text-xs font-semibold text-[#121C46]"
                  >
                    {chip.icon && <span className="text-[#2563EB] text-xs">{chip.icon}</span>}
                    <span>{chip.text || chip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Call To Action Buttons (Optional) */}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3.5 mt-7 sm:mt-8">
                {primaryCta && (
                  <Link
                    to={primaryCta.to}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121C46] text-white text-sm sm:text-base font-bold shadow-md hover:bg-[#1E293B] hover:shadow-lg transition-all duration-200 group"
                  >
                    <span>{primaryCta.label}</span>
                    {primaryCta.icon ? (
                      primaryCta.icon
                    ) : (
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    )}
                  </Link>
                )}

                {secondaryCta && (
                  <Link
                    to={secondaryCta.to}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#121C46] text-sm sm:text-base font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    <span>{secondaryCta.label}</span>
                  </Link>
                )}
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (50-55%): Animated Cartoon Illustration      */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center w-full">
            <div className="w-full max-w-[560px] p-2 sm:p-4">
              {renderIllustration()}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBranchHero;
