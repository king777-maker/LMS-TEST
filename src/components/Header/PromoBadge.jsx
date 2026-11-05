import React from "react";

/**
 * PromoBadge Component
 * Standardized, pixel-perfect promotional badge for course rows.
 * Enforces:
 * - Consistent height (20px)
 * - Consistent padding (px-2)
 * - Consistent font size (10px font-bold uppercase)
 * - Consistent border radius (4px)
 * - Proper vertical alignment (inline-flex items-center justify-center)
 *
 * Supported variants:
 * - NEW: Red background, white text
 * - HOT: Soft yellow background, orange/red text
 * - POPULAR: Yellow background, dark text
 * - TRENDING: Orange background, white text
 * - BEST SELLER: Blue or gold background
 */
const PromoBadge = ({ badge, className = "" }) => {
  if (!badge) return null;
  const normalized = String(badge).trim().toUpperCase();

  // Shared base dimensions ensuring 100% visual consistency
  const baseClass = "shrink-0 ml-3 inline-flex items-center justify-center h-[20px] px-2 rounded-[4px] text-[10px] font-bold uppercase tracking-wider leading-none select-none shadow-xs";

  // 1. NEW — Red background, white text
  if (normalized === "NEW") {
    return (
      <span className={`${baseClass} bg-[#DC2626] text-white ${className}`}>
        NEW
      </span>
    );
  }

  // 2. HOT — Soft yellow background, orange/red text
  if (normalized === "HOT" || normalized.includes("HOT")) {
    return (
      <span className={`${baseClass} gap-1 bg-amber-100 text-[#EA580C] border border-amber-300/80 ${className}`}>
        <span aria-hidden="true" className="text-[10px] leading-none">🔥</span>
        <span>HOT</span>
      </span>
    );
  }

  // 3. POPULAR — Yellow background, dark text
  if (normalized === "POPULAR" || normalized.includes("POPULAR")) {
    return (
      <span className={`${baseClass} gap-1 bg-[#FEF08A] text-slate-900 border border-amber-300 ${className}`}>
        <span aria-hidden="true" className="text-[10px] leading-none">★</span>
        <span>POPULAR</span>
      </span>
    );
  }

  // 4. TRENDING — Orange background, white text
  if (normalized === "TRENDING" || normalized.includes("TRENDING")) {
    return (
      <span className={`${baseClass} bg-[#EA580C] text-white ${className}`}>
        TRENDING
      </span>
    );
  }

  // 5. BEST SELLER — Blue or gold background
  if (normalized === "BEST SELLER" || normalized === "BESTSELLER") {
    return (
      <span className={`${baseClass} bg-[#0A192F] text-amber-300 border border-amber-400/40 ${className}`}>
        BEST SELLER
      </span>
    );
  }

  // Generic fallback if any custom badge is passed
  return (
    <span className={`${baseClass} bg-slate-100 text-slate-800 border border-slate-200 ${className}`}>
      {badge}
    </span>
  );
};

export default PromoBadge;


