import React from "react";
import { FaLinkedinIn, FaCheckCircle } from "react-icons/fa";

/**
 * AboutTeamProfile — Media Object Team Member Card
 * Displays an educator/executive portrait beside their name, designation,
 * biography, credentials, and professional links.
 * Responsive: stacks cleanly on extra-small mobile screens while keeping side-by-side on sm+.
 */
const AboutTeamProfile = ({
  name,
  role,
  image,
  bio,
  credentials = [],
  linkedin,
  experience,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      {/* LEFT: Portrait Image */}
      <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs bg-slate-100">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/broadbeach_campus.jpg";
          }}
          className="w-full h-full object-cover"
        />
        {experience && (
          <div className="absolute bottom-1 right-1 bg-[#121C46] text-[#FFDB58] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            {experience}
          </div>
        )}
      </div>

      {/* RIGHT: Descriptive Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#121C46] leading-tight">
                {name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#2563EB] mt-0.5">
                {role}
              </p>
            </div>

            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077B5] hover:bg-[#0077B5] hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0 cursor-pointer"
                aria-label={`${name} LinkedIn profile`}
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            )}
          </div>

          {bio && (
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mt-2.5 line-clamp-3">
              {bio}
            </p>
          )}

          {credentials.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-[#F1F5F9]">
              {credentials.map((cred, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#121C46] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-md"
                >
                  <FaCheckCircle className="text-[#F97316] text-[10px]" />
                  <span>{cred}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutTeamProfile;
