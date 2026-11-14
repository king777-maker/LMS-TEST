import React from "react";

/**
 * AboutMediaObject — Standard Media Object UI Pattern
 * Places an icon, badge, image, or avatar beside structured descriptive content.
 * Delivers clean, easily scannable information across desktop, tablet, and mobile.
 */
const AboutMediaObject = ({
  icon,
  imageSrc,
  imageAlt = "Icon",
  avatarSize = "md", // "sm" (40px) | "md" (48px) | "lg" (64px) | "xl" (80px)
  iconColor = "text-[#2563EB]",
  iconBg = "bg-blue-50 border-blue-100",
  title,
  subtitle,
  description,
  badge,
  badgeColor = "blue",
  meta,
  variant = "card", // "card" | "flat" | "elevated"
  className = "",
  onClick,
}) => {
  // Avatar / Icon size classes
  const sizeMap = {
    sm: "w-10 h-10 min-w-[40px] text-base",
    md: "w-12 h-12 min-w-[48px] text-xl",
    lg: "w-16 h-16 min-w-[64px] text-2xl",
    xl: "w-20 h-20 min-w-[80px] text-3xl",
  };

  // Badge colors
  const badgeMap = {
    blue: "bg-blue-50 text-[#2563EB] border-blue-100",
    orange: "bg-orange-50 text-[#F97316] border-orange-100",
    amber: "bg-amber-50 text-[#D97706] border-amber-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    navy: "bg-[#121C46]/5 text-[#121C46] border-[#121C46]/10",
  };

  // Card wrapper variants
  const variantMap = {
    card: "bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all duration-200",
    elevated:
      "bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
    flat: "bg-transparent p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors",
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 sm:gap-5 ${
        variantMap[variant] || variantMap.card
      } ${className}`}
    >
      {/* MEDIA OBJECT (LEFT): Icon, Avatar, or Image */}
      <div className="shrink-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/broadbeach_campus.jpg";
            }}
            className={`${sizeMap[avatarSize]} rounded-xl object-cover border border-[#E2E8F0] shadow-xs`}
          />
        ) : (
          <div
            className={`${sizeMap[avatarSize]} rounded-xl border flex items-center justify-center ${iconBg} ${iconColor} shadow-xs shrink-0`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* MEDIA BODY (RIGHT): Descriptive content */}
      <div className="flex-1 min-w-0">
        {/* Header row: Title + optional badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && (
            <h3 className="text-base sm:text-lg font-bold text-[#121C46] leading-snug">
              {title}
            </h3>
          )}
          {badge && (
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                badgeMap[badgeColor] || badgeMap.blue
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Subtitle / Role */}
        {subtitle && (
          <p className="text-xs sm:text-sm font-semibold text-[#2563EB] mt-0.5">
            {subtitle}
          </p>
        )}

        {/* Description body */}
        {description && (
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mt-1.5">
            {description}
          </p>
        )}

        {/* Optional Metadata / Action row */}
        {meta && <div className="mt-3 pt-2 border-t border-[#F1F5F9]">{meta}</div>}
      </div>
    </div>
  );
};

export default AboutMediaObject;
