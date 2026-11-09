import React from "react";
import { Link } from "react-router-dom";
import brandLogoImg from "../../assets/cookie-preferences-icon.png";

const BrandLogo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      aria-label="Broadbeach Academy Home"
      className={`inline-flex items-center gap-2.5 transition-all duration-200 hover:opacity-95 select-none ${className}`}
    >
      {/* Brand Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src={brandLogoImg || "/assets/cookie-preferences-icon.png"}
          alt="Broadbeach Academy Logo"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg drop-shadow-sm transition-transform duration-200 hover:scale-105"
          width={32}
          height={32}
        />
      </div>

      {/* Main Brand Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1 leading-none">
          <span className="text-[13.5px] sm:text-[15px] font-black tracking-tight text-white drop-shadow-xs">
            Broadbeach
          </span>
          <span className="text-[#FFC72C] text-[12px] sm:text-[13px] font-black tracking-tight leading-none">
            • Online
          </span>
        </div>
        <span className="text-[6.5px] sm:text-[7.5px] font-extrabold tracking-[0.24em] text-white/90 uppercase mt-0.5 leading-none">
          ACADEMY
        </span>
      </div>
    </Link>
  );
};

export default BrandLogo;
