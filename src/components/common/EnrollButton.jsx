import React from "react";
import { FaArrowRight } from "react-icons/fa";

/**
 * Standardized EnrollButton Component — Broadbeach Academy LMS
 *
 * Design Tokens:
 * - Default background: #2563EB
 * - Text: #FFFFFF
 * - Hover background: #1D4ED8
 * - Active background: #1E40AF
 * - Focus ring: #93C5FD
 * - Disabled background: #CBD5E1
 * - Disabled text: #475569
 *
 * Appearance:
 * - Font size: 16px
 * - Font weight: 600
 * - Border radius: 14px
 * - Height: 58–64px (h-[58px])
 * - Centered label and arrow
 * - Transition: 180–200ms (duration-200)
 * - Hover elevation effect: shadow-md hover:shadow-lg hover:-translate-y-0.5
 */
const EnrollButton = ({
  label = "Enroll Now",
  onClick,
  disabled = false,
  loading = false,
  showArrow = true,
  className = "",
  type = "button",
  fullWidth = true,
  ariaLabel,
  style = {},
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof label === "string" ? label : "Enroll Now")}
      style={{
        color: disabled ? "#475569" : "#FFFFFF",
        fontWeight: 600,
        ...(disabled ? { backgroundColor: "#CBD5E1" } : {}),
        ...style,
      }}
      className={`
        btn-enroll
        group
        ${fullWidth ? "w-full" : ""}
        h-[58px] min-h-[58px]
        px-5 py-3
        bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF]
        !text-white !font-semibold
        text-[16px] leading-normal
        rounded-[14px]
        shadow-md hover:shadow-lg
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
        focus:outline-none focus:ring-4 focus:ring-[#93C5FD]/60
        disabled:bg-[#CBD5E1] disabled:!text-[#475569] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        transition-all duration-200
        cursor-pointer
        flex items-center justify-center gap-2.5
        select-none
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      <span
        style={{ color: "inherit", fontWeight: "inherit" }}
        className="!text-inherit !font-semibold leading-normal"
      >
        {loading ? "Enrolling..." : label}
      </span>
      {showArrow && !loading && (
        <FaArrowRight
          style={{ color: "inherit" }}
          className="text-[13px] shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </button>
  );
};

export default EnrollButton;
