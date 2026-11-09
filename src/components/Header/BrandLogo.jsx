import React from "react";
import { Link } from "react-router-dom";
import brandLogoSvg from "../../assets/brand-logo.svg";
import brandLogoPng from "../../assets/brand-logo.png";

const BrandLogo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      aria-label="Broadbeach Online Academy Home"
      className={`inline-flex items-center transition-all duration-200 hover:opacity-95 select-none shrink-0 ${className}`}
    >
      <img
        src={brandLogoSvg || brandLogoPng || "/brand-logo.svg"}
        alt="Broadbeach Online Academy"
        className="h-10 sm:h-11 w-auto object-contain shrink-0"
      />
    </Link>
  );
};

export default BrandLogo;
