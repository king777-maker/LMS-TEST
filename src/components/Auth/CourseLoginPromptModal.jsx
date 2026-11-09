import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaTimes, FaSignInAlt, FaGraduationCap } from "react-icons/fa";

/**
 * CourseLoginPromptModal
 * Displays the required authentication notification:
 * "Please log in first to start this course."
 * Offers two explicit actions:
 * 1. Log In -> Redirects to /login preserving target course destination & ID
 * 2. Cancel -> Closes notification, preserving user's current page & position
 */
const CourseLoginPromptModal = ({ isOpen, onClose, courseData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const courseId = courseData?.courseId || courseData?.id || "";
  const courseSlug = courseData?.slug || "";
  const courseTitle = courseData?.title || courseData?.name || "";
  const destination = courseData?.destination || (courseId ? `/enroll/${courseId}` : "/courses");

  const handleProceedLogin = () => {
    onClose();
    const targetUrl = `/login?redirect=${encodeURIComponent(destination)}&courseId=${encodeURIComponent(courseId)}&slug=${encodeURIComponent(courseSlug)}&message=${encodeURIComponent("Please log in first to start this course.")}`;
    navigate(targetUrl, {
      state: {
        from: { pathname: destination },
        message: "Please log in first to start this course.",
        courseId,
        slug: courseSlug,
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-login-prompt-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#131E4A] to-[#15467e] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <FaLock className="text-base" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                Broadbeach Academy
              </span>
              <h3 id="course-login-prompt-title" className="text-base font-bold text-white leading-tight">
                Authentication Required
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Main Required Message */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 text-center">
            <p className="text-base sm:text-[17px] font-extrabold text-[#131E4A]">
              “Please log in first to start this course.”
            </p>
          </div>

          {/* Optional Course Target Preview */}
          {courseTitle && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <FaGraduationCap className="text-blue-600 text-sm shrink-0" />
              <div className="flex-1 truncate">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Course</span>
                <span className="font-semibold text-slate-800 truncate block">{courseTitle}</span>
              </div>
              {courseId && (
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                  #{courseId}
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-slate-500 leading-relaxed text-center">
            To register your progress, access video lectures, and earn verifiable accreditation, please log in with your account.
          </p>

          {/* Action Buttons: Cancel and Log In */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-98 text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProceedLogin}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#131E4A] hover:bg-[#15467e] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-98 flex items-center justify-center gap-2 text-center"
            >
              <FaSignInAlt className="text-xs" />
              <span>Log In</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CourseLoginPromptModal;
