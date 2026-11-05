import React, { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation, Navigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaShieldAlt,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, register } = useAuth();

  const redirectUrl =
    searchParams.get("redirect") ||
    location.state?.from?.pathname ||
    "/my-courses";

  const courseId = searchParams.get("courseId");
  const slug = searchParams.get("slug");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_code: "+91",
    password: "",
    confirm_password: "",
    agreeTerms: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthenticated && user) {
    return <Navigate to={redirectUrl} replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage("Please complete all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Password and confirm password do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to proceed.");
      toast.error("Please accept the Terms of Service.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await register(formData);

      if (res?.success) {
        toast.success("Account created successfully! Welcome to Broadbeach Academy.", {
          duration: 4000,
        });
        navigate(redirectUrl, { replace: true });
      } else {
        setErrorMessage(res?.message || "Registration could not be completed.");
        toast.error(res?.message || "Registration failed.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Email may already be in use.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_15px_40px_rgba(11,49,91,0.06)] p-7 sm:p-9">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0B315B] text-[#FFDB58] flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-md">
              <FaShieldAlt />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B315B] tracking-tight">
              Create Student Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Enroll in foundation & lead auditor courses with verifiable certificates
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <FaExclamationCircle className="shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms-conditions" className="text-blue-600 underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-blue-600 underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[48px] px-6 rounded-[12px] bg-[#0052CC] hover:bg-[#0747A6] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 disabled:opacity-70 select-none"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Start Course</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirectUrl)}${courseId ? `&courseId=${courseId}` : ""}${slug ? `&slug=${slug}` : ""}`}
                className="font-bold text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                Sign In Here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
