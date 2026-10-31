import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaKey,
  FaArrowLeft,
  FaCheckCircle,
  FaMobileAlt,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { adminRoutes } from "../../utils/adminRoutes";
import MoonWalkBackground from "../../components/Admin/MoonWalkBackground";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyLogin2FA } = useAdmin();

  // Step 1: Credentials | Step 2: 2FA MFA Code
  const [step, setStep] = useState(1);
  const [challengeId, setChallengeId] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || adminRoutes.dashboard;

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res?.mfa_required) {
        setChallengeId(res.challenge_id);
        setStep(2);
        toast.success("Password verified. Enter your 6-digit authenticator code.", {
          id: "mfa-step-toast",
        });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials or unauthorized role.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanCode = totpCode.trim();
    if (!cleanCode) {
      setErrorMsg("Please enter your 6-digit verification code or recovery code.");
      return;
    }

    setLoading(true);
    try {
      await verifyLogin2FA({ challenge_id: challengeId, code: cleanCode });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Invalid or expired authenticator code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden flex flex-col justify-center items-center py-3 px-3 sm:py-5 sm:px-4 text-white selection:bg-amber-400 selection:text-[#0B315B]">
      {/* Cinematic 4K Moon Walk Video Background with 2K Poster Fallback */}
      <MoonWalkBackground />

      {/* Top Navigation & Restricted Portal Indicator */}
      <div className="w-full max-w-[420px] mb-2 sm:mb-2.5 flex justify-between items-center text-xs font-semibold text-blue-200 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 hover:text-amber-300 transition group focus:outline-hidden focus:ring-1 focus:ring-amber-300 rounded-md px-1 py-0.5 text-[11px] sm:text-xs"
        >
          <FaArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Learner Portal</span>
        </Link>
        <span className="bg-[#0B1E38]/85 px-2.5 py-0.5 rounded-full border border-blue-400/30 text-[10px] sm:text-[11px] text-amber-300 font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Restricted Portal
        </span>
      </div>

      {/* Main Login Card with Responsive Compact Sizing */}
      <div className="w-full max-w-[420px] bg-[#071328]/88 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(11,30,56,0.6)] p-4 sm:p-6 text-slate-100 border border-blue-400/25 relative overflow-hidden z-10">
        {/* Decorative Top Accent: Broadbeach Navy to Gold Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B315B] via-[#F7C600] to-[#0B315B]" />

        {/* Brand Header */}
        <div className="text-center mb-3 sm:mb-4 pt-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0B315B] via-[#0F274B] to-[#07192F] text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-md border border-amber-400/40">
            <FaShieldAlt className="text-lg sm:text-xl drop-shadow-md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Administrator Login
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold text-blue-200/90 mt-0.5 leading-snug">
            Secure access to the Broadbeach Academy administration portal
          </p>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400/90 mt-1">
            {step === 1 ? "Official Administration Console" : "Two-Step Authentication (MFA)"}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-medium flex items-center gap-2 backdrop-blur-sm">
            <FaExclamationTriangle className="text-red-400 shrink-0 text-sm" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: PASSWORD LOGIN */}
        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="space-y-2.5 sm:space-y-3">
            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-[11px] sm:text-xs font-bold text-blue-100/90 uppercase tracking-wider mb-1"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/60 text-xs sm:text-sm" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@broadbeachlearning.com"
                  className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-[#030914]/90 border border-blue-900/60 rounded-xl text-xs sm:text-sm font-medium text-white placeholder-slate-500 focus:bg-[#050E1D] focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-[11px] sm:text-xs font-bold text-blue-100/90 uppercase tracking-wider mb-1"
              >
                Secure Password
              </label>
              <div className="relative">
                <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/60 text-xs sm:text-sm" />
                <input
                  id="admin-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 sm:py-2.5 bg-[#030914]/90 border border-blue-900/60 rounded-xl text-xs sm:text-sm font-medium text-white placeholder-slate-500 focus:bg-[#050E1D] focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 bg-[#0B315B] hover:bg-[#143D6D] disabled:bg-slate-700 text-amber-300 hover:text-amber-200 font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 shadow-md shadow-blue-950/60 transition flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-amber-400/40"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  <span>Validating Credentials...</span>
                </>
              ) : (
                <>
                  <FaLock size={12} className="text-amber-400" />
                  <span>Sign In &amp; Proceed to MFA</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: 2-STEP TOTP MFA CHALLENGE */
          <form onSubmit={handleStep2Submit} className="space-y-3 sm:space-y-3.5 animate-fade-in">
            <div className="bg-[#0B1E38]/70 border border-blue-400/30 rounded-xl p-3 text-center backdrop-blur-sm">
              <FaMobileAlt className="text-xl text-amber-400 mx-auto mb-1.5" />
              <p className="text-[11px] sm:text-xs text-blue-100 font-semibold leading-relaxed">
                Enter the 6-digit code from your authenticator app for <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-totp-input"
                className="block text-[11px] sm:text-xs font-bold text-blue-100/90 uppercase tracking-wider mb-1.5 text-center"
              >
                6-Digit Authenticator Code
              </label>
              <input
                id="admin-totp-input"
                type="text"
                autoFocus
                required
                autoComplete="one-time-code"
                maxLength={18}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[6px] sm:tracking-[8px] font-mono font-black text-xl sm:text-2xl py-2 sm:py-2.5 bg-[#030914]/90 border-2 border-amber-400/70 rounded-xl text-white focus:bg-[#050E1D] focus:ring-2 focus:ring-amber-400/30 outline-hidden shadow-inner"
              />
            </div>

            {/* Quick Demo Evaluation Code */}
            <div className="bg-[#0B1E38]/50 border border-blue-400/20 rounded-xl p-2 text-center text-xs flex items-center justify-between text-blue-200">
              <span className="font-semibold text-[10px] sm:text-[11px]">Evaluation 2FA Code:</span>
              <button
                type="button"
                onClick={() => setTotpCode("123456")}
                className="font-mono font-extrabold text-amber-300 bg-[#07192F] px-2 py-0.5 rounded-lg border border-amber-400/40 hover:bg-[#0B315B] transition cursor-pointer text-[10px] sm:text-[11px]"
              >
                Use Demo Code: 123456
              </button>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <button
                type="submit"
                disabled={loading || !totpCode.trim()}
                className="w-full py-2.5 bg-[#0B315B] hover:bg-[#143D6D] disabled:bg-slate-700 text-amber-300 hover:text-amber-200 font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 shadow-md shadow-blue-950/60 transition flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-amber-400/40"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Authenticator Code...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={13} className="text-amber-400" />
                    <span>Verify &amp; Establish Session</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setTotpCode("");
                  setErrorMsg("");
                }}
                className="w-full py-1 text-[11px] font-semibold text-blue-300/70 hover:text-white transition cursor-pointer text-center"
              >
                ← Back to Password Login
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] text-blue-200/60 text-center font-medium z-10">
        Broadbeach Academy — ISO Standards &amp; Professional Certification LMS © 2026
      </p>
    </div>
  );
};

export default AdminLogin;
