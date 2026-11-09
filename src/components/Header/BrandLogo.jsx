import React from "react";
import { Link } from "react-router-dom";
import brandLogoImg from "../../assets/brand-logo.png";

const BrandLogo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      aria-label="Broadbeach Online Academy Home"
      className={`inline-flex items-center transition-all duration-200 hover:opacity-95 select-none shrink-0 ${className}`}
    >
      <img
        src={brandLogoImg || "/brand-logo.png"}
        alt="Broadbeach Online Academy"
        className="h-10 sm:h-11 md:h-12 w-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-[1.02]"
        height={48}
      />
    </Link>
  );
};

export default BrandLogo;
