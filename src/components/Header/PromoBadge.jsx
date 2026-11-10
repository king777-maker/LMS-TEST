import React from "react";

/**
 * PromoBadge Component
 * Standardized, pixel-perfect promotional badge for course navigation dropdown rows.
 *
 * Requirements:
 * - NEW: Red background (#DC2626), white text, compact pill shape (rounded-full).
 * - HOT: Light orange background (#FFEDD5), orange/red text (#EA580C), flame indicator (🔥).
 * - POPULAR: Yellow background (#FEF08A), dark navy text (#0A192F), star indicator (★).
 * - TRENDING: Orange background (#EA580C), white text.
 * - BEST SELLER: Dark navy background (#0A192F) with amber text and gold border.
 *
 * Rules:
 * - Vertically centered (inline-flex items-center justify-center).
 * - Far-right alignment with shrink-0.
 * - Prevents overlapping course titles.
 */
const PromoBadge = ({ badge, className = "" }) => {
  if (!badge) return null;
  const normalized = String(badge).trim().toUpperCase();

  // Shared base dimensions
  const baseClass =
    "shrink-0 ml-2 inline-flex items-center justify-center h-[18px] px-1.5 text-[10px] font-bold uppercase tracking-wider leading-none select-none shadow-xs";

  // 1. NEW — Red background, white text, compact pill shape
  if (normalized === "NEW") {
    return (
      <span className={`${baseClass} rounded-full bg-[#DC2626] text-white ${className}`}>
        NEW
      </span>
    );
  }

  // 2. HOT — Light orange background, orange/red text, flame indicator
  if (normalized === "HOT" || normalized.includes("HOT")) {
    return (
      <span className={`${baseClass} rounded-[6px] gap-1 bg-[#FFEDD5] text-[#EA580C] border border-[#FDBA74]/70 ${className}`}>
        <span aria-hidden="true" className="text-[10px] leading-none">🔥</span>
        <span>HOT</span>
      </span>
    );
  }

  // 3. POPULAR — Yellow background, dark navy text, star indicator
  if (normalized === "POPULAR" || normalized.includes("POPULAR")) {
    return (
      <span className={`${baseClass} rounded-[6px] gap-1 bg-[#FEF08A] text-[#0A192F] border border-amber-300 ${className}`}>
        <span aria-hidden="true" className="text-[10px] leading-none">★</span>
        <span>POPULAR</span>
      </span>
    );
  }

  // 4. TRENDING — Orange background, white text
  if (normalized === "TRENDING" || normalized.includes("TRENDING")) {
    return (
      <span className={`${baseClass} rounded-[6px] bg-[#EA580C] text-white ${className}`}>
        TRENDING
      </span>
    );
  }

  // 5. BEST SELLER — Blue/Navy background with gold text
  if (normalized === "BEST SELLER" || normalized === "BESTSELLER") {
    return (
      <span className={`${baseClass} rounded-[6px] bg-[#0A192F] text-amber-300 border border-amber-400/40 ${className}`}>
        BEST SELLER
      </span>
    );
  }

  // Generic fallback
  return (
    <span className={`${baseClass} rounded-[6px] bg-slate-100 text-slate-800 border border-slate-200 ${className}`}>
      {badge}
    </span>
  );
};

export default PromoBadge;
