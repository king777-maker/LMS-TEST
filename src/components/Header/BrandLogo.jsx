import React from "react";
import { Link } from "react-router-dom";
import brandLogoSvg from "../../assets/brand-logo.svg";

const BrandLogo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      aria-label="Broadbeach Online Academy Home"
      className={`inline-flex items-center transition-all duration-200 hover:opacity-95 select-none shrink-0 ${className}`}
    >
      <img
        src={brandLogoSvg || "/brand-logo.svg"}
        alt="Broadbeach Online Academy"
        className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm select-none transition-transform duration-200 hover:scale-[1.02] shrink-0"
      />
    </Link>
  );
};

export default BrandLogo;
