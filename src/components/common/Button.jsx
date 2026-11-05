import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

/**
 * Standardized Global Button Component — Broadbeach Academy LMS
 *
 * Sizing Tokens:
 * - Small  (sm): Height 36px, Horizontal padding 12px, Font 13px, Radius 8px
 * - Medium (md): Height 42px, Horizontal padding 16px, Font 14px, Radius 10px
 * - Large  (lg): Height 48px, Horizontal padding 22px, Font 16px, Radius 12px
 *
 * Active State (Centralized):
 * - Background: #10365D
 * - Text: #FFFFFF (strictly never dark text on dark background!)
 * - Icon: #FFD43B
 * - Font Weight: 600
 *
 * Inactive State:
 * - Background: #FFFFFF
 * - Text: #1E293B
 * - Border: #E2E8F0
 * - Icon: #1E293B
 */

const SIZES = {
  sm: "h-[36px] px-3 text-[13px] rounded-[8px]",
  md: "h-[42px] px-4 text-[14px] rounded-[10px]",
  lg: "h-[48px] px-5.5 text-[16px] rounded-[12px]",
};

const ICON_SIZES = {
  sm: 14,
  md: 16,
  lg: 18,
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      active = false,
      icon: Icon,
      iconPosition = "left",
      iconClassName = "",
      className = "",
      disabled = false,
      loading = false,
      to,
      href,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeClasses = SIZES[size] || SIZES.md;
    const iconSize = ICON_SIZES[size] || 16;

    // Base structural styling
    const baseClasses =
      "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD43B] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

    // Variant calculation
    let variantClasses = "";
    let defaultIconColor = "";

    switch (variant) {
      case "filter":
      case "nav-tab":
        if (active) {
          variantClasses =
            "bg-[#10365D] text-white border border-[#10365D] shadow-xs font-semibold";
          defaultIconColor = "text-[#FFD43B]";
        } else {
          variantClasses =
            "bg-white text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300 hover:text-[#10365D] font-medium";
          defaultIconColor = "text-[#1E293B]";
        }
        break;

      case "primary":
        variantClasses =
          "bg-[#0052CC] hover:bg-[#0747A6] text-white border border-transparent shadow-xs";
        defaultIconColor = "text-white";
        break;

      case "navy":
        variantClasses =
          "bg-[#0A192F] hover:bg-[#07162C] text-white border border-transparent shadow-xs";
        defaultIconColor = "text-[#FFD43B]";
        break;

      case "gold":
      case "accent":
        variantClasses =
          "bg-[#F7C600] hover:bg-[#E5B700] text-[#07162C] border border-transparent font-bold shadow-xs";
        defaultIconColor = "text-[#07162C]";
        break;

      case "secondary":
        variantClasses =
          "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] border border-[#E2E8F0]";
        defaultIconColor = "text-[#1E293B]";
        break;

      case "outline":
        variantClasses =
          "bg-white hover:bg-slate-50 text-[#1E293B] hover:text-[#0052CC] border border-[#E2E8F0] hover:border-[#0052CC]/40";
        defaultIconColor = "text-[#1E293B]";
        break;

      case "ghost":
        variantClasses =
          "bg-transparent hover:bg-slate-100 text-[#1E293B] hover:text-[#0052CC] border border-transparent";
        defaultIconColor = "text-[#1E293B]";
        break;

      case "danger":
        variantClasses =
          "bg-[#DC2626] hover:bg-[#B91C1C] text-white border border-transparent shadow-xs";
        defaultIconColor = "text-white";
        break;

      case "icon":
        variantClasses =
          "bg-white hover:bg-slate-50 text-[#1E293B] border border-[#E2E8F0] !px-0 flex-shrink-0 aspect-square";
        defaultIconColor = "text-[#1E293B]";
        break;

      default:
        variantClasses =
          "bg-[#0052CC] hover:bg-[#0747A6] text-white border border-transparent shadow-xs";
        defaultIconColor = "text-white";
        break;
    }

    const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

    // Render Icon element if provided
    const renderIcon = () => {
      if (!Icon) return null;
      if (React.isValidElement(Icon)) {
        return <span className={`shrink-0 ${defaultIconColor} ${iconClassName}`}>{Icon}</span>;
      }
      const IconComponent = Icon;
      return (
        <IconComponent
          size={iconSize}
          className={`shrink-0 ${defaultIconColor} ${iconClassName}`}
          aria-hidden="true"
        />
      );
    };

    const content = (
      <>
        {Icon && iconPosition === "left" && renderIcon()}
        {children && (
          <span className={Icon && iconPosition === "left" ? "ml-2" : Icon && iconPosition === "right" ? "mr-2" : ""}>
            {children}
          </span>
        )}
        {Icon && iconPosition === "right" && renderIcon()}
      </>
    );

    // Render as React Router Link if 'to' is provided
    if (to) {
      return (
        <Link ref={ref} to={to} className={combinedClasses} onClick={onClick} {...props}>
          {content}
        </Link>
      );
    }

    // Render as regular anchor if 'href' is provided
    if (href) {
      return (
        <a ref={ref} href={href} className={combinedClasses} onClick={onClick} {...props}>
          {content}
        </a>
      );
    }

    // Default button element
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={combinedClasses}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

