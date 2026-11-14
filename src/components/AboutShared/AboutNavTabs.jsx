import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * AboutNavTabs — Sub-navigation for the About Us page family
 * Enables learners to easily navigate between all child/branch pages.
 * Features an active pill indicator and responsive horizontal scroll.
 */
const navItems = [
  { label: "Overview", to: "/about-us" },
  { label: "Our Team", to: "/about/our-team" },
  { label: "Our Vision", to: "/about/vision" },
  { label: "Our Mission", to: "/about/mission" },
  { label: "Our Story", to: "/about/history" },
  { label: "Core Values", to: "/about/core-values" },
  { label: "Global Reach", to: "/about/global-foot-print" },
  { label: "Happy Customers", to: "/about/our-customers" },
  { label: "Accreditations", to: "/accreditations-approvals" },
];

const AboutNavTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-full bg-white border-b border-[#E2E8F0] sticky top-[64px] z-30 shadow-xs">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <nav
          className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth"
          aria-label="About Us navigation tabs"
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#121C46] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#121C46] hover:bg-slate-100/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AboutNavTabs;
