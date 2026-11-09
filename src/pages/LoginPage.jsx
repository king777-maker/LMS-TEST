import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaSyncAlt,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserCheck,
  FaBookOpen,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let str = "";
  for (let i = 0; i < 5; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, login } = useAuth();

  const redirectUrl =
    searchParams.get("redirect") ||
    location.state?.from?.pathname ||
    "/my-courses";

  const gateMessage =
    searchParams.get("message") ||
    location.state?.message;

  const courseId = searchParams.get("courseId") || location.state?.courseId;
  const slug = searchParams.get("slug") || location.state?.slug;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // If user is already logged in, redirect directly to intended destination
  if (isAuthenticated && user) {
    return <Navigate to={redirectUrl} replace />;
  }

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setUserCaptcha("");
  };

  const handleFillTestAccount = () => {
    setEmail("qa.tester@broadbeach.in");
    setPassword("BBTest@2026!");
    setUserCaptcha(captchaCode);
    setErrorMessage("");
    toast.success("Loaded verified QA Tester credentials!", {
      id: "qa-fill-toast",
      icon: "🧪",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email address and password.");
      toast.error("Email and password are required.");
      return;
    }

    if (!userCaptcha.trim()) {
      setErrorMessage("Please enter the security verification code.");
      toast.error("Please enter the CAPTCHA code.");
      return;
    }

    if (userCaptcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage("Invalid security code. Please try again.");
      toast.error("Verification code does not match.");
      handleRefreshCaptcha();
      return;
    }

    try {
      setSubmitting(true);
      const res = await login({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (res?.success) {
        const studentName = res.data?.first_name || res.data?.name || "Student";
        toast.success(`Welcome back, ${studentName}! Continuing to your course...`, {
          duration: 3500,
        });

        // Safely navigate to the intended course or dashboard
        navigate(redirectUrl, { replace: true });
        return;
      } else {
        setErrorMessage(res?.message || "Invalid email or password.");
        toast.error(res?.message || "Login failed.");
        handleRefreshCaptcha();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Invalid email or password. Please verify your credentials.";
      setErrorMessage(msg);
      toast.error(msg);
      handleRefreshCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">

        {/* AUTH GATE MESSAGE BANNER */}
        {gateMessage && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs text-amber-950 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-amber-400 text-[#0B315B] flex items-center justify-center text-lg shrink-0 shadow-xs">
                <FaLock />
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-[#0B315B]">
                  {gateMessage}
                </h2>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Log in below to start or continue your coursework, track lesson progress, and record your verifiable certificate.
                </p>
                {courseId && (
                  <div className="mt-2 text-[11px] font-semibold text-slate-600 bg-white/70 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border border-amber-200">
                    <FaBookOpen className="text-blue-600" />
                    <span>Intended Course ID: {courseId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN LOGIN CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_15px_40px_rgba(11,49,91,0.06)] p-7 sm:p-9">
          <div className="text-center mb-8">
            <img
              src="/logo.jpg"
              alt="Broadbeach Logo"
              className="w-14 h-14 rounded-2xl object-contain mx-auto mb-3.5 shadow-md"
              width={56}
              height={56}
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B315B] tracking-tight">
              Student Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Access your accredited certifications & learning portal
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <FaExclamationCircle className="shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@broadbeach.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all bg-slate-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Captcha Verification */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Security Verification
              </label>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-base font-extrabold tracking-[4px] text-slate-800 select-none line-through decoration-slate-400">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  aria-label="Refresh verification code"
                  title="Refresh code"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <FaSyncAlt className="text-xs" />
                </button>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 uppercase font-mono tracking-wider bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[48px] px-6 rounded-[12px] bg-[#0052CC] hover:bg-[#0747A6] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 disabled:opacity-70 select-none"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>{gateMessage ? "Log In & Continue Course" : "Sign In to Academy"}</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirectUrl)}${courseId ? `&courseId=${courseId}` : ""}${slug ? `&slug=${slug}` : ""}`}
                className="font-bold text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                Create Free Student Account
              </Link>
            </p>
          </div>
        </div>

        {/* QA TESTING ACCOUNT HELPER CARD */}
        <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-xs text-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2 font-bold text-[#0B315B]">
              <FaUserCheck className="text-sm text-blue-600" />
              <span>Dedicated Website Testing Account</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
              Dev/Staging Only
            </span>
          </div>

          <p className="text-slate-600 text-[11px] mb-3">
            Use these verified credentials to test authenticated course player, quizzes, progress tracking, and certificate issuance:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] mb-3 bg-white p-2.5 rounded-xl border border-blue-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Email:</span>
              <span className="font-semibold text-slate-800">qa.tester@broadbeach.in</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Password:</span>
              <span className="font-semibold text-slate-800">BBTest@2026!</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillTestAccount}
            className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Fill QA Tester Credentials</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
