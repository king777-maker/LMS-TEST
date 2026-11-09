import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBuilding,
  FaIdBadge,
  FaBriefcase,
  FaUserFriends,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaAward,
  FaCommentDots,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
  FaLock,
  FaShieldAlt,
  FaGraduationCap
} from "react-icons/fa";
import { submitCourseEnquiry } from "../../api/api";
import { LAUNCH_TEXT } from "../../constants/courseAvailability";

const TRAINING_LOCATIONS = [
  "Bengaluru — World Trade Center (Malleshwaram)",
  "Mumbai — Corporate Center",
  "Delhi NCR — Regional Center",
  "Chennai — Liaison Center",
  "Hyderabad — Tech Hub",
  "Pune — Industrial Center",
  "Kolkata — Regional Center",
  "Client Corporate Onsite (Custom Location)",
  "International / Overseas Center"
];

const BATCH_TIMINGS = [
  "Weekend Executive Batch (Saturday & Sunday)",
  "Weekday Intensive Batch (Monday – Friday)",
  "Evening Corporate Batch (6:00 PM – 9:00 PM)",
  "Flexible / Next Available Batch"
];

const EXPERIENCE_LEVELS = [
  "0 - 2 Years (Entry / Associate)",
  "3 - 5 Years (Mid-Level Professional)",
  "6 - 10 Years (Senior Engineer / Lead)",
  "10+ Years (Manager / Executive)"
];

const PRIOR_KNOWLEDGE_LEVELS = [
  "Beginner (No Prior ISO / Audit Experience)",
  "Foundational Awareness (Familiar with Standard)",
  "Internal Auditor Practitioner",
  "Experienced Lead Auditor / Implementation Team"
];

const PARTICIPANT_OPTIONS = [
  "1 Candidate (Individual Enrollment)",
  "2 - 5 Candidates (Small Corporate Team)",
  "6 - 15 Candidates (Departmental Batch)",
  "16+ Candidates (Enterprise-Wide Training)"
];

const TIMEFRAME_OPTIONS = [
  "Immediate (Next Upcoming Batch)",
  "Within 30 Days",
  "Next Month",
  "Within 3 Months",
  "Exploring Annual Training Calendar"
];

const EnrollmentEnquiryForm = ({ course, availableCourses = [], onCourseChange }) => {
  const [selectedCourseId, setSelectedCourseId] = useState(course?.id || course?.code || "ia-1");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState(
    course?.name || course?.title || "Internal Auditor Certification"
  );

  useEffect(() => {
    if (course) {
      setSelectedCourseId(course.id || course.code || "ia-1");
      setSelectedCourseTitle(course.name || course.title || "Internal Auditor Certification");
    }
  }, [course]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    designation: "",
    experience: EXPERIENCE_LEVELS[1],
    priorKnowledge: PRIOR_KNOWLEDGE_LEVELS[1],
    participants: PARTICIPANT_OPTIONS[0],
    preferredLocation: TRAINING_LOCATIONS[0],
    preferredTiming: BATCH_TIMINGS[0],
    timeframe: TIMEFRAME_OPTIONS[0],
    message: "",
    consent: false,
    website: "", // Honeypot field
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [responseDetails, setResponseDetails] = useState(null);

  // Phone validation: Accepts Indian (+91, 0, or 10-digit) and valid international numbers
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    const phoneRegex = /^\+?[0-9]{8,16}$/;
    return phoneRegex.test(cleaned);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (minimum 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid business or personal email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your contact phone number.";
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (e.g. +91 98765 43210).";
    }

    if (!formData.company.trim() || formData.company.trim().length < 2) {
      newErrors.company = "Company / Organization name is required (or 'Independent').";
    }

    if (!formData.designation.trim() || formData.designation.trim().length < 2) {
      newErrors.designation = "Job role or designation is required.";
    }

    if (!formData.experience) {
      newErrors.experience = "Please select your years of experience.";
    }

    if (!formData.priorKnowledge) {
      newErrors.priorKnowledge = "Please select your prior ISO knowledge level.";
    }

    if (!formData.participants) {
      newErrors.participants = "Please select the number of participants.";
    }

    if (!formData.preferredLocation) {
      newErrors.preferredLocation = "Please select your preferred training location.";
    }

    if (!formData.preferredTiming) {
      newErrors.preferredTiming = "Please select your preferred batch timing.";
    }

    if (!formData.timeframe) {
      newErrors.timeframe = "Please select your target training timeframe.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please describe your specific requirements or objectives (minimum 10 characters).";
    }

    if (!formData.consent) {
      newErrors.consent = "Please check the consent box to proceed with your enquiry.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleCourseSelect = (e) => {
    const id = e.target.value;
    setSelectedCourseId(id);
    const found = (availableCourses || []).find((c) => String(c.id) === String(id));
    if (found) {
      setSelectedCourseTitle(found.title || found.name);
      if (onCourseChange) onCourseChange(found);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Bot honeypot check
    if (formData.website) {
      setSubmitSuccess(true);
      setResponseDetails({
        reference_id: `ENQ-BOT-${Date.now()}`,
      });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const payload = {
      course_id: selectedCourseId,
      course_title: selectedCourseTitle,
      full_name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      designation: formData.designation.trim(),
      experience: formData.experience,
      prior_knowledge: formData.priorKnowledge,
      participants: formData.participants,
      training_location: formData.preferredLocation,
      preferred_timing: formData.preferredTiming,
      timeframe: formData.timeframe,
      message: formData.message.trim(),
      consent: formData.consent,
      website: formData.website,
    };

    try {
      const response = await submitCourseEnquiry(payload);
      if (response?.data?.success) {
        setSubmitSuccess(true);
        setResponseDetails(response.data.data || {
          reference_id: `ENQ-${selectedCourseId}-${Date.now().toString(36).toUpperCase()}`,
        });
      } else {
        setSubmitError(
          response?.data?.message ||
          "Failed to record your enquiry. Please check your details and try again."
        );
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while communicating with the server. Please retry or contact us directly at info@broadbeach.in.";
      setSubmitError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="offline-enquiry-section" className="scroll-mt-24">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
        {/* Card Header with Deep Navy & Amber Accents */}
        <div className="bg-gradient-to-r from-[#07162c] via-[#131E4A] to-[#124275] p-6 sm:p-8 text-white relative">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-[#07162c] shadow-xs">
              <FaClock className="text-xs" />
              {LAUNCH_TEXT.STATUS_LABEL} • Phase 1 Offline Batches
            </span>

            <span className="text-xs text-slate-300 font-medium">
              Official Admissions & Corporate Desk
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {LAUNCH_TEXT.CTA_LABEL}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            {LAUNCH_TEXT.AVAILABILITY_NOTICE} Please fill out all required details below to receive the detailed offline training syllabus, schedule dates, fee structure, and seat confirmation.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 lg:p-10">
          {submitSuccess ? (
            /* Success Confirmation State */
            <div className="text-center py-8 sm:py-12 space-y-5 animate-fadeInSlideDown">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <FaCheckCircle className="text-3xl sm:text-4xl" />
              </div>

              <div className="max-w-xl mx-auto space-y-3">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Enquiry Submitted Successfully
                </h4>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
                  {LAUNCH_TEXT.SUCCESS_MESSAGE(selectedCourseTitle)}
                </p>

                <div className="text-xs text-slate-500 pt-2 space-y-1">
                  <p>
                    Reference Identifier:{" "}
                    <strong className="text-slate-800 font-mono">
                      {responseDetails?.reference_id || `ENQ-${selectedCourseId}-${Date.now().toString(36).toUpperCase()}`}
                    </strong>
                  </p>
                  <p>
                    Our counselor team will contact you at{" "}
                    <strong className="text-slate-800">{formData.email}</strong> and{" "}
                    <strong className="text-slate-800">{formData.phone}</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      company: "",
                      designation: "",
                      experience: EXPERIENCE_LEVELS[1],
                      priorKnowledge: PRIOR_KNOWLEDGE_LEVELS[1],
                      participants: PARTICIPANT_OPTIONS[0],
                      preferredLocation: TRAINING_LOCATIONS[0],
                      preferredTiming: BATCH_TIMINGS[0],
                      timeframe: TIMEFRAME_OPTIONS[0],
                      message: "",
                      consent: false,
                      website: "",
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>

                <Link
                  to="/courses"
                  className="px-5 py-2.5 rounded-xl bg-[#131E4A] text-white text-xs sm:text-sm font-bold hover:bg-[#124275] transition-colors shadow-xs"
                >
                  Explore Other Courses
                </Link>
              </div>
            </div>
          ) : (
            /* Interactive Enquiry Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs sm:text-sm">
                  <FaExclamationCircle className="text-rose-500 shrink-0 mt-0.5 text-base" />
                  <div className="flex-1">
                    <p className="font-semibold">Unable to submit enquiry</p>
                    <p className="mt-0.5 text-rose-700">{submitError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Bot Honeypot field (hidden) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* SECTION 1: COURSE SELECTION */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FaAward className="text-amber-500 text-xs" />
                    <span>Course of Interest <span className="text-rose-500">*</span></span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-normal">
                    Target Program
                  </span>
                </label>

                {availableCourses && availableCourses.length > 0 ? (
                  <select
                    value={selectedCourseId}
                    onChange={handleCourseSelect}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title || c.name} ({c.code || c.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm sm:text-base">
                      {selectedCourseTitle}
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md shrink-0">
                      ID: {selectedCourseId}
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION 2: CANDIDATE CONTACT DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#131E4A] flex items-center gap-2 border-b border-slate-150 pb-2">
                  <FaUser className="text-amber-500" />
                  <span>1. Contact Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                          errors.fullName
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Work / Personal Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ramesh@company.com"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                          errors.email
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                          errors.phone
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: PROFESSIONAL PROFILE (ALL REQUIRED) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#131E4A] flex items-center gap-2 border-b border-slate-150 pb-2">
                  <FaBriefcase className="text-amber-500" />
                  <span>2. Professional Background (Required)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Company / Organization */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Organization <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Tata Motors / Independent"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                          errors.company
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.company && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.company}</p>
                    )}
                  </div>

                  {/* Designation / Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Job Role / Designation <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaIdBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Quality Assurance Lead"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                          errors.designation
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.designation && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.designation}</p>
                    )}
                  </div>

                  {/* Work Experience */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Years of Experience <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {EXPERIENCE_LEVELS.map((exp, idx) => (
                        <option key={idx} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Prior Knowledge */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prior ISO Knowledge <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="priorKnowledge"
                      value={formData.priorKnowledge}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {PRIOR_KNOWLEDGE_LEVELS.map((lvl, idx) => (
                        <option key={idx} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: OFFLINE BATCH PREFERENCES (ALL REQUIRED) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#131E4A] flex items-center gap-2 border-b border-slate-150 pb-2">
                  <FaMapMarkerAlt className="text-amber-500" />
                  <span>3. Offline Batch Preferences & Logistics (Required)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Training Center <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {TRAINING_LOCATIONS.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Timing */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Batch Timing <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="preferredTiming"
                      value={formData.preferredTiming}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {BATCH_TIMINGS.map((tim, idx) => (
                        <option key={idx} value={tim}>{tim}</option>
                      ))}
                    </select>
                  </div>

                  {/* Participants */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Number of Participants <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {PARTICIPANT_OPTIONS.map((part, idx) => (
                        <option key={idx} value={part}>{part}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Timeframe */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Timeframe <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {TIMEFRAME_OPTIONS.map((tf, idx) => (
                        <option key={idx} value={tf}>{tf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: SPECIFIC TRAINING OBJECTIVES & CONSENT */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#131E4A] flex items-center gap-2 border-b border-slate-150 pb-2">
                  <FaCommentDots className="text-amber-500" />
                  <span>4. Training Objectives & Consent (Required)</span>
                </h4>

                {/* Message / Scope */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>
                      Specific Training Requirements / Objectives <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Min 10 characters
                    </span>
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please mention your industry sector, compliance goals, or any specific ISO standard requirements..."
                    className={`w-full p-3 rounded-xl border text-xs sm:text-sm outline-none transition-all resize-none ${
                      errors.message
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.message}</p>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I consent to Broadbeach Academy contacting me by phone, WhatsApp, or email regarding offline batch schedules, venues, and admissions assistance. View our{" "}
                      <Link to="/privacy-policy" className="text-blue-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>
                      . <span className="text-rose-500 font-bold">*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.consent}</p>
                  )}
                </div>
              </div>

              {/* SECTION 6: SUBMIT BUTTON */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-150">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FaShieldAlt className="text-emerald-600 text-sm" />
                  <span>Zero Spam Guaranteed • Strictly for Offline Batch Advising</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#131E4A] to-[#1E5FA8] hover:from-[#08203E] hover:to-[#164C82] active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>{submitting ? "Submitting Enquiry..." : "Submit Enquiry & Pre-Enrollment"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default EnrollmentEnquiryForm;
