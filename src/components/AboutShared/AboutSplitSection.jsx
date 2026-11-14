import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

/**
 * AboutSplitSection — 50/50 Split-Screen Layout Pattern
 * Consistent layout for heroes, stories, mission/vision highlights, and major features.
 * Alternates between image-right and image-left, stacking cleanly on mobile.
 */
const AboutSplitSection = ({
  id,
  eyebrow,
  eyebrowIcon,
  eyebrowColor = "blue",
  title,
  highlightText,
  subtitle,
  paragraphs = [],
  bullets = [],
  ctaPrimary,
  ctaSecondary,
  imageSrc,
  imageAlt = "Broadbeach Online Academy",
  imagePosition = "right",
  floatingBadge,
  illustration,
  bgColor = "white",
  className = "",
  reverseOnMobile = false,
}) => {
  const isImageLeft = imagePosition === "left";

  // Eyebrow styling variants
  const eyebrowStyles = {
    blue: "bg-blue-50 text-[#2563EB] border-blue-100",
    orange: "bg-orange-50 text-[#F97316] border-orange-100",
    amber: "bg-amber-50 text-[#D97706] border-amber-100",
    navy: "bg-[#F6F8FC] text-[#121C46] border-[#E2E8F0]",
  };

  // Background styling variants
  const bgStyles = {
    white: "bg-white",
    neutral: "bg-[#F8FAFC] border-y border-[#E2E8F0]/70",
    slate: "bg-[#F1F5F9] border-y border-[#E2E8F0]",
    navy: "bg-[#0F1E36] text-white",
  };

  const isNavyBg = bgColor === "navy";

  return (
    <section
      id={id}
      className={`relative py-12 sm:py-16 lg:py-20 overflow-hidden ${bgStyles[bgColor] || bgStyles.white} ${className}`}
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center`}
        >
          {/* TEXT COLUMN */}
          <div
            className={`flex flex-col items-start text-left ${
              isImageLeft
                ? "lg:order-2"
                : "lg:order-1"
            } ${reverseOnMobile ? "order-2" : "order-1"}`}
          >
            {/* Eyebrow Badge */}
            {eyebrow && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 select-none ${
                  eyebrowStyles[eyebrowColor] || eyebrowStyles.blue
                }`}
              >
                {eyebrowIcon || (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      eyebrowColor === "orange"
                        ? "bg-[#F97316]"
                        : eyebrowColor === "amber"
                        ? "bg-[#D97706]"
                        : "bg-[#2563EB]"
                    }`}
                  />
                )}
                <span>{eyebrow}</span>
              </div>
            )}

            {/* Title / Heading */}
            <h2
              className={`text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.2] tracking-tight ${
                isNavyBg ? "text-white" : "text-[#121C46]"
              }`}
            >
              {title}{" "}
              {highlightText && (
                <span className="text-[#F97316]">{highlightText}</span>
              )}
            </h2>

            {/* Subtitle / Tagline */}
            {subtitle && (
              <p
                className={`mt-2.5 text-base sm:text-lg font-medium leading-relaxed ${
                  isNavyBg ? "text-blue-200" : "text-[#2563EB]"
                }`}
              >
                {subtitle}
              </p>
            )}

            {/* Paragraphs */}
            {paragraphs.length > 0 && (
              <div className="mt-4 space-y-3.5">
                {paragraphs.map((p, index) => (
                  <p
                    key={index}
                    className={`text-sm sm:text-base lg:text-[16.5px] leading-[1.7] ${
                      isNavyBg ? "text-slate-300" : "text-[#475569]"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Bullets / Checklist */}
            {bullets.length > 0 && (
              <div className="mt-5 space-y-2.5 w-full">
                {bullets.map((b, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-[#F97316] text-base shrink-0 mt-0.5">
                      {b.icon || <FaCheckCircle className="text-[#F97316]" />}
                    </span>
                    <span
                      className={`text-sm sm:text-[15px] font-medium leading-relaxed ${
                        isNavyBg ? "text-slate-200" : "text-[#121C46]"
                      }`}
                    >
                      {typeof b === "string" ? b : b.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            {(ctaPrimary || ctaSecondary) && (
              <div className="flex flex-wrap items-center gap-3.5 mt-6 sm:mt-7 w-full sm:w-auto">
                {ctaPrimary &&
                  (ctaPrimary.to ? (
                    <Link
                      to={ctaPrimary.to}
                      className="h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl bg-[#121C46] hover:bg-[#1b2a64] active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <span>{ctaPrimary.label}</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  ) : (
                    <a
                      href={ctaPrimary.href || "#"}
                      className="h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl bg-[#121C46] hover:bg-[#1b2a64] active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <span>{ctaPrimary.label}</span>
                      <FaArrowRight className="text-xs" />
                    </a>
                  ))}

                {ctaSecondary &&
                  (ctaSecondary.to ? (
                    <Link
                      to={ctaSecondary.to}
                      className="h-[46px] sm:h-[48px] px-5 sm:px-6 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-[#121C46] font-bold text-sm sm:text-base border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer"
                    >
                      <span>{ctaSecondary.label}</span>
                    </Link>
                  ) : (
                    <a
                      href={ctaSecondary.href || "#"}
                      className="h-[46px] sm:h-[48px] px-5 sm:px-6 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-[#121C46] font-bold text-sm sm:text-base border border-[#E2E8F0] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer"
                    >
                      <span>{ctaSecondary.label}</span>
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* VISUAL COLUMN */}
          <div
            className={`relative flex items-center justify-center ${
              isImageLeft
                ? "lg:order-1"
                : "lg:order-2"
            } ${reverseOnMobile ? "order-1" : "order-2"}`}
          >
            {illustration ? (
              <div className="w-full flex justify-center">{illustration}</div>
            ) : (
              <div className="relative w-full">
                {/* Decorative subtle backdrop accent */}
                <div
                  className={`absolute -inset-3 rounded-3xl -z-0 ${
                    isImageLeft
                      ? "-rotate-1 bg-blue-50/70"
                      : "rotate-1 bg-orange-50/70"
                  }`}
                />

                {/* Primary Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
                  <img
                    src={imageSrc || "/assets/broadbeach_campus.jpg"}
                    alt={imageAlt}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                    }}
                    className="w-full h-[280px] sm:h-[350px] lg:h-[400px] xl:h-[430px] object-cover"
                  />

                  {/* Gradient Overlay for Text Legibility if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Optional Floating Badge / Highlight Card */}
                {floatingBadge && (
                  <div
                    className={`absolute ${
                      floatingBadge.position === "top-right"
                        ? "-top-4 -right-4"
                        : "bottom-4 left-4 right-4 sm:right-auto sm:max-w-[320px]"
                    } p-3.5 sm:p-4 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8F0] shadow-lg flex items-center gap-3.5 select-none`}
                  >
                    {floatingBadge.icon && (
                      <div className="w-10 h-10 rounded-xl bg-[#121C46] text-[#FFDB58] flex items-center justify-center shrink-0 text-lg">
                        {floatingBadge.icon}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#121C46] uppercase tracking-wider">
                        {floatingBadge.title}
                      </div>
                      {floatingBadge.subtitle && (
                        <div className="text-xs font-medium text-[#475569] mt-0.5">
                          {floatingBadge.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSplitSection;
