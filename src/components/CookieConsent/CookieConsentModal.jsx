import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Cookie,
  Sliders,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

export const CONSENT_STORAGE_KEY = "bb_cookie_consent";

export const DEFAULT_PREFERENCES = {
  essential: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: null,
  version: "1.0",
};

export const getStoredPreferences = () => {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed, essential: true };
  } catch {
    return null;
  }
};

export const savePreferences = (prefs) => {
  const payload = {
    ...prefs,
    essential: true,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to persist cookie consent choices:", err);
  }
  window.dispatchEvent(
    new CustomEvent("cookieConsentUpdated", { detail: payload })
  );
  return payload;
};

const CookieConsentModal = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    const existing = getStoredPreferences();
    if (!existing) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setPreferences(existing);
    }

    // Global listener so Footer or Cookie Policy page can reopen preferences
    const handleOpenModal = () => {
      setPreferences(getStoredPreferences() || DEFAULT_PREFERENCES);
      setShowModal(true);
      setShowBanner(false);
    };

    window.addEventListener("openCookiePreferences", handleOpenModal);
    return () =>
      window.removeEventListener("openCookiePreferences", handleOpenModal);
  }, []);

  const handleAcceptAll = () => {
    const allOn = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allOn);
    setPreferences(allOn);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectOptional = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(essentialOnly);
    setPreferences(essentialOnly);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowModal(false);
  };

  const toggleCategory = (key) => {
    if (key === "essential") return; // cannot toggle essential
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* =========================================================================
          1. BOTTOM CONSENT BANNER (Shown on first visit)
      ========================================================================= */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label="Cookie and Privacy Consent Banner"
          className="fixed bottom-0 inset-x-0 z-[9990] p-2 sm:p-5 max-w-full pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="w-full max-w-5xl mx-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl p-3 sm:p-6 pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="space-y-1.5 flex-1 pr-0 sm:pr-2 min-w-0">
              <div className="flex items-center gap-2">
                <Cookie size={19} className="text-[#FFDB58]" />
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Privacy & Cookie Preferences
                </h2>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                We use strictly essential local storage and session identifiers
                to maintain your secure course enrollment and learning progress.
                You can choose whether to enable optional performance and
                third-party media tools. Read our{" "}
                <Link
                  to="/cookie-policy"
                  className="text-[#FFDB58] underline hover:text-amber-300 font-medium"
                >
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="text-[#FFDB58] underline hover:text-amber-300 font-medium"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0 min-w-0">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer flex-1 md:flex-initial text-center min-w-0"
              >
                Essential Only
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowBanner(false);
                  setShowModal(true);
                }}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-[#FFDB58] border border-slate-600 transition cursor-pointer flex items-center justify-center gap-1.5 flex-1 md:flex-initial min-w-0"
              >
                <Sliders size={14} />
                <span>Preferences</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FFDB58] hover:bg-amber-300 text-[#131E4A] transition shadow-md cursor-pointer flex-1 md:flex-initial text-center min-w-0"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================================
          2. GRANULAR PREFERENCES MODAL (Accessible dialog)
      ========================================================================= */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
        >
          {/* Backdrop click */}
          <div
            className="absolute inset-0"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#183B73] flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3
                    id="cookie-modal-title"
                    className="text-base sm:text-lg font-bold text-[#131E4A]"
                  >
                    Manage Consent & Storage Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    Broadbeach Academy Privacy Controls
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                We believe in transparency and data minimization. Below you can
                review how we use browser storage (cookies, local storage, and
                session storage) and configure your personal preferences in
                accordance with the <strong>Digital Personal Data Protection Act, 2023 (India)</strong> and international privacy standards.
              </p>

              {/* CATEGORY 1: Strictly Necessary */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">
                      1. Strictly Necessary Storage
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Always Active
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    aria-label="Strictly Necessary Storage (Always Active)"
                    className="w-4 h-4 accent-blue-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Essential for website security, user login, CSRF defense,
                  course enrollment records (<code className="bg-slate-200/80 px-1 rounded">bb_user</code>, <code className="bg-slate-200/80 px-1 rounded">bb_enrolled_courses</code>), and in-progress assessment milestones. These cannot be disabled as the learning platform cannot function without them.
                </p>
              </div>

              {/* CATEGORY 2: Functional */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    2. Functional Preferences
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => toggleCategory("functional")}
                      aria-label="Toggle Functional Preferences"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Enables the system to remember your study player settings,
                  sidebar collapsed/expanded states, and language selections
                  across sessions.
                </p>
              </div>

              {/* CATEGORY 3: Analytics */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    3. Performance & Usage Analytics
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => toggleCategory("analytics")}
                      aria-label="Toggle Performance and Analytics"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Helps us understand aggregated page views, broken course links,
                  and download speeds to improve LMS performance. No invasive cross-site profiling is conducted.
                </p>
              </div>

              {/* CATEGORY 4: Media & Third-Party Embeds */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    4. External Media Embeds (YouTube No-Cookie)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => toggleCategory("marketing")}
                      aria-label="Toggle External Media Embeds"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Allows interactive lecture streaming from privacy-enhanced YouTube player endpoints. When disabled, lecture videos will request explicit on-demand play authorization before contacting third-party servers.
                </p>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>
                  Consent Version 1.0 • You may update your choices at any time from the website footer.
                </span>
                <Link
                  to="/cookie-policy"
                  onClick={() => setShowModal(false)}
                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2"
                >
                  Full Cookie Policy
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer"
              >
                Reject All Optional
              </button>

              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#183B73] hover:bg-[#122e5a] text-white transition shadow-sm cursor-pointer"
              >
                Save Preferences
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#FFDB58] hover:bg-amber-300 text-[#131E4A] transition shadow-md cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentModal;
