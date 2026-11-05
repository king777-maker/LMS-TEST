import React from "react";

/**
 * Standardized High-Contrast Tab Button Component
 * Follows Broadbeach Academy UI/UX Design System:
 * - Active:
 *   - Background: #10365D (Dark navy)
 *   - Text: #FFFFFF (Pure white)
 *   - Icon: #FFD43B (Brand yellow)
 *   - Font weight: 600 (font-semibold)
 *   - Border: #10365D
 * - Inactive:
 *   - Background: #FFFFFF (Pure white)
 *   - Text: #1E293B (Dark navy)
 *   - Icon: #1E293B (Dark navy)
 *   - Border: #E2E8F0 (Subtle light grey)
 *   - Font weight: 500 (font-medium)
 * - Hover / Focus:
 *   - Inactive hover: bg-slate-50, text-[#10365D], border-slate-300
 *   - Active hover: bg-[#0c2a49]
 *   - Focus ring: visible focus-visible:ring-2 focus-visible:ring-[#10365D] focus-visible:ring-offset-2
 */
const TabButton = ({
  id,
  label,
  icon: Icon,
  isActive = false,
  onClick,
  className = "",
  badge = null,
  disabled = false,
  ariaControls = undefined,
}) => {
  return (
    <button
      id={`tab-${id}`}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={ariaControls || `tabpanel-${id}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={onClick}
      className={`group relative min-h-[44px] h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border outline-none active:scale-[0.98] select-none text-center ${
        isActive
          ? "lms-tab-active bg-[#10365D] !text-white border-[#10365D] font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-[#10365D] focus-visible:ring-offset-2 hover:bg-[#0c2a49]"
          : "lms-tab-inactive bg-white text-[#1E293B] border-[#E2E8F0] font-medium shadow-2xs hover:bg-slate-50 hover:text-[#10365D] hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#10365D] focus-visible:ring-offset-2"
      } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`}
    >
      {Icon && (
        <Icon
          className={`shrink-0 transition-colors duration-200 ${
            isActive ? "!text-[#FFD43B]" : "text-[#1E293B] group-hover:text-[#10365D]"
          }`}
          size={16}
          aria-hidden="true"
        />
      )}
      <span
        className={`leading-tight font-inherit text-center ${
          isActive ? "!text-white font-semibold" : "text-[#1E293B] font-medium group-hover:text-[#10365D]"
        }`}
      >
        {label}
      </span>
      {badge && (
        <span
          className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
            isActive ? "bg-white/20 !text-[#FFD43B]" : "bg-slate-100 text-slate-700"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export default TabButton;
