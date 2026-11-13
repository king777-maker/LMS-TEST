import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaLaptopCode, FaAward, FaArrowRight } from "react-icons/fa";
import {
  StepOneIllustration,
  StepTwoIllustration,
  StepThreeIllustration,
} from "./HowItWorksIllustration";

/**
 * AboutHowItWorks Component
 * Vertical zigzag timeline inspired by the clean editorial e-learning landing page.
 * Recreates the centered vertical line with 3 milestone dots, large watermark numbers,
 * alternating content and vector illustrations, and scroll-triggered animations.
 */
const timelineSteps = [
  {
    number: "01",
    watermark: "01",
    title: "Sign Up",
    subtitle: "Quick & Seamless Onboarding",
    description: "Create your account and explore our professional courses.",
    ctaText: "Create Free Account",
    ctaLink: "/free-courses",
    dotColor: "bg-[#F97316]",
    ringColor: "ring-[#F97316]/30",
    badgeColor: "bg-orange-50 text-[#F97316] border-orange-100",
    icon: FaUserPlus,
    illustration: StepOneIllustration,
    align: "left", // Content on left, illustration on right
  },
  {
    number: "02",
    watermark: "02",
    title: "Start Learning",
    subtitle: "Self-Paced Flexible Modules",
    description: "Enroll in a course and learn at your own pace through structured lessons.",
    ctaText: "Browse Course Catalog",
    ctaLink: "/course",
    dotColor: "bg-[#2563EB]",
    ringColor: "ring-[#2563EB]/30",
    badgeColor: "bg-blue-50 text-[#2563EB] border-blue-100",
    icon: FaLaptopCode,
    illustration: StepTwoIllustration,
    align: "right", // Illustration on left, content on right
  },
  {
    number: "03",
    watermark: "03",
    title: "Get Certified",
    subtitle: "Global Verifiable Credential",
    description: "Complete the required assessments and earn your certificate.",
    ctaText: "Verify Sample Certificate",
    ctaLink: "/verify-certificate",
    dotColor: "bg-[#10B981]",
    ringColor: "ring-[#10B981]/30",
    badgeColor: "bg-emerald-50 text-[#10B981] border-emerald-100",
    icon: FaAward,
    illustration: StepThreeIllustration,
    align: "left", // Content on left, illustration on right
  },
];

const AboutHowItWorks = () => {
  const [activeSteps, setActiveSteps] = useState([true, false, false]);
  const [progressHeight, setProgressHeight] = useState(33);
  const stepRefs = useRef([]);

  // Progressive scroll-linked animation and viewport detection
  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setActiveSteps([true, true, true]);
      setProgressHeight(100);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-step-index"));
          if (entry.isIntersecting) {
            setActiveSteps((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });

            // Update progressive timeline fill height
            setProgressHeight((prev) => Math.max(prev, ((index + 1) / 3) * 100));
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative bg-white py-10 sm:py-12 lg:py-16 overflow-hidden border-t border-slate-100 select-none"
      aria-label="How Broadbeach Academy Works"
    >
      {/* Subtle organic background wave contours matching the reference */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 -z-0"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M -100 200 C 300 150, 400 450, 800 350 C 1200 250, 1300 550, 1600 450 L 1600 1100 L -100 1100 Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        
        {/* =======================================================
            SECTION HEADER
        ======================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FC] border border-[#E2E8F0] shadow-2xs text-xs font-bold uppercase tracking-wider text-[#121C46] mb-2.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            <span>Structured Learning Pathway</span>
          </div>

          <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-[#121C46] tracking-tight leading-[1.2]">
            How It Works
          </h2>

          <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-[1.6] max-w-xl mx-auto">
            Your Journey from Enrollment to Certification
          </p>
        </div>

        {/* =======================================================
            VERTICAL ZIGZAG TIMELINE CONTAINER
        ======================================================= */}
        <div className="relative">
          
          {/* Desktop & Tablet Centered Vertical Connecting Line */}
          <div
            className="hidden md:block absolute left-1/2 top-8 bottom-12 -translate-x-1/2 w-[2px] bg-slate-200 -z-0"
            aria-hidden="true"
          >
            {/* Animated Progressive Fill Line */}
            <div
              className="w-full bg-gradient-to-b from-[#F97316] via-[#2563EB] to-[#10B981] transition-all duration-700 ease-out"
              style={{ height: `${progressHeight}%` }}
            />
          </div>

          {/* Mobile Vertical Connecting Line (Anchored Left at 24px) */}
          <div
            className="md:hidden absolute left-[23px] top-6 bottom-10 w-[2px] bg-slate-200 -z-0"
            aria-hidden="true"
          >
            <div
              className="w-full bg-gradient-to-b from-[#F97316] via-[#2563EB] to-[#10B981] transition-all duration-700 ease-out"
              style={{ height: `${progressHeight}%` }}
            />
          </div>

          {/* =====================================================
              TIMELINE STEPS (Alternating on Desktop)
          ===================================================== */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {timelineSteps.map((step, index) => {
              const isActive = activeSteps[index];
              const IllustrationComponent = step.illustration;
              const StepIcon = step.icon;

              return (
                <div
                  key={step.number}
                  ref={(el) => (stepRefs.current[index] = el)}
                  data-step-index={index}
                  className={`relative transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-40 translate-y-6"
                  }`}
                >
                  {/* =================================================
                      CENTER MILESTONE DOT (Desktop & Tablet)
                  ================================================= */}
                  <div
                    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <div
                      className={`w-5 h-5 rounded-full ${step.dotColor} border-3 border-white shadow-md transition-all duration-500 ${
                        isActive
                          ? `scale-125 ring-4 ${step.ringColor}`
                          : "scale-100 opacity-60"
                      }`}
                    />
                  </div>

                  {/* =================================================
                      MOBILE MILESTONE DOT (Anchored on Left Line)
                  ================================================= */}
                  <div
                    className="md:hidden absolute left-[15px] top-6 z-20 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${step.dotColor} border-2 border-white shadow-sm transition-all duration-500 ${
                        isActive
                          ? `scale-110 ring-3 ${step.ringColor}`
                          : "scale-90 opacity-60"
                      }`}
                    />
                  </div>

                  {/* =================================================
                      STEP GRID (Desktop 2-Column Split, Mobile Stacked)
                  ================================================= */}
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-16 pl-12 md:pl-0 ${
                      step.align === "right"
                        ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
                        : ""
                    }`}
                  >
                    
                    {/* Content Column */}
                    <div
                      className={`relative flex flex-col justify-center ${
                        step.align === "left"
                          ? "md:items-end md:text-right md:pr-14 lg:pr-20"
                          : "md:items-start md:text-left md:pl-14 lg:pl-20"
                      }`}
                    >
                      {/* Large Subtle Watermark Number */}
                      <span
                        className={`absolute -top-5 sm:-top-6 select-none font-black text-6xl sm:text-7xl lg:text-8xl text-slate-100/90 tracking-tighter -z-0 pointer-events-none transition-transform duration-700 ${
                          step.align === "left"
                            ? "md:right-10 lg:right-16 translate-x-4"
                            : "md:left-10 lg:left-16 -translate-x-4"
                        } ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-50"}`}
                        aria-hidden="true"
                      >
                        {step.watermark}
                      </span>

                      {/* Content Card Body */}
                      <div className="relative z-10 max-w-md">
                        {/* Compact Step Tag */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-extrabold tracking-wider uppercase mb-3 ${step.badgeColor}`}
                        >
                          <StepIcon className="text-xs" />
                          <span>Step {step.number}</span>
                        </div>

                        {/* Step Title */}
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#121C46] tracking-tight leading-snug">
                          {step.title}
                        </h3>

                        {/* Step Description */}
                        <p className="mt-2.5 text-[#475569] text-base leading-relaxed font-normal">
                          {step.description}
                        </p>

                        {/* Action Link */}
                        <div
                          className={`mt-4 flex ${
                            step.align === "left"
                              ? "md:justify-end"
                              : "md:justify-start"
                          }`}
                        >
                          <Link
                            to={step.ctaLink}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#121C46] hover:text-[#F97316] transition-colors group cursor-pointer"
                          >
                            <span>{step.ctaText}</span>
                            <FaArrowRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Illustration Column */}
                    <div
                      className={`flex items-center ${
                        step.align === "left"
                          ? "md:justify-start md:pl-14 lg:pl-20"
                          : "md:justify-end md:pr-14 lg:pr-20"
                      }`}
                    >
                      <div className="transform transition-transform duration-500 hover:scale-105">
                        <IllustrationComponent />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutHowItWorks;
