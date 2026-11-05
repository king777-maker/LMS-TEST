import React from "react";

/**
 * PromoBadge Component
 * Renders consistent, compact promotional badges for course rows.
 * Supported: NEW, HOT, POPULAR, TRENDING, BEST SELLER
 */
const PromoBadge = ({ badge, className = "" }) => {
  if (!badge) return null;
  const normalized = String(badge).trim().toUpperCase();

  // 1. NEW — Red background with white text
  if (normalized === "NEW") {
    return (
      <span
        className={`shrink-0 ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#DC2626] text-white shadow-xs select-none ${className}`}
      >
        NEW
      </span>
    );
  }

  // 2. HOT — Yellow/orange background with flame indicator
  if (normalized === "HOT" || normalized.includes("HOT")) {
    return (
      <span
        className={`shrink-0 ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 select-none shadow-xs ${className}`}
      >
        <span aria-hidden="true" className="text-[11px] leading-none">🔥</span>
        <span>HOT</span>
      </span>
    );
  }

  // 3. POPULAR — Yellow background with star indicator
  if (normalized === "POPULAR" || normalized.includes("POPULAR")) {
    return (
      <span
        className={`shrink-0 ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 select-none shadow-xs ${className}`}
      >
        <span aria-hidden="true" className="text-[10px] leading-none">★</span>
        <span>POPULAR</span>
      </span>
    );
  }

  // 4. TRENDING — Orange/red background
  if (normalized === "TRENDING" || normalized.includes("TRENDING")) {
    return (
      <span
        className={`shrink-0 ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#EA580C] text-white shadow-xs select-none ${className}`}
      >
        TRENDING
      </span>
    );
  }

  // 5. BEST SELLER — Dark blue background with gold text and border
  if (normalized === "BEST SELLER" || normalized === "BESTSELLER") {
    return (
      <span
        className={`shrink-0 ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#0A192F] text-amber-300 border border-amber-400/40 shadow-xs select-none ${className}`}
      >
        BEST SELLER
      </span>
    );
  }

  // Generic fallback if any custom badge is passed
  return (
    <span
      className={`shrink-0 ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 ${className}`}
    >
      {badge}
    </span>
  );
};

export default PromoBadge;
