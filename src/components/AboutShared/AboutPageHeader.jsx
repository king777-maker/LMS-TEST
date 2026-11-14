import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

/**
 * AboutPageHeader — Consistent, elegant banner for About Us child pages
 * Contains breadcrumbs, page title, supportive narrative, and optional tab navigation.
 */
const AboutPageHeader = ({
  title,
  highlight,
  description,
  breadcrumbs = [],
  showTabs = true,
}) => {
  return (
    <>
      {/* Top Banner Section */}
      <section className="relative bg-[#0F1E36] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Ambient subtle glow background */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10 text-center">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 mb-4 select-none"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <FaChevronRight className="text-[10px] text-slate-400" />
            <Link to="/about-us" className="hover:text-white transition-colors">
              About Us
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <FaChevronRight className="text-[10px] text-slate-400" />
                <span className="text-[#FFDB58] font-medium">{crumb.label}</span>
              </React.Fragment>
            ))}
          </nav>

          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>Broadbeach Online Academy</span>
          </div>

          {/* Heading */}
          <h1 className="text-[32px] sm:text-[42px] md:text-[48px] font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {title}{" "}
            {highlight && <span className="text-[#F97316]">{highlight}</span>}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-4 text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default AboutPageHeader;
