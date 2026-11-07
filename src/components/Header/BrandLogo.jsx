import React from "react";
import { Link } from "react-router-dom";

const BrandLogo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      aria-label="Broadbeach Academy Home"
      className={`inline-flex items-center gap-2 transition-all duration-200 hover:opacity-95 select-none ${className}`}
    >
      {/* Gold Shield Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          viewBox="0 0 28 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Shield Outer Path */}
          <path
            d="M14 2L3 6.5V15.5C3 22.8 7.7 29.2 14 31C20.3 29.2 25 22.8 25 15.5V6.5L14 2Z"
            fill="url(#brand-shield-bg)"
            stroke="#FFC72C"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Inner Golden Wing/Accent */}
          <path
            d="M14 5V27.5C18.5 25.8 22 20.8 22 15.5V8.5L14 5Z"
            fill="#FFC72C"
            fillOpacity="0.25"
          />
          <path
            d="M14 8L8 11V15.5C8 19.8 10.5 23.8 14 25.2V8Z"
            fill="#FFC72C"
            fillOpacity="0.8"
          />
          <defs>
            <linearGradient id="brand-shield-bg" x1="3" y1="2" x2="25" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d2e56" />
              <stop offset="1" stopColor="#06182e" />
            </linearGradient>
          </defs>
        </svg>
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
