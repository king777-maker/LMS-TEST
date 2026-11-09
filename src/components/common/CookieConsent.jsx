import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaCog, FaCheck } from "react-icons/fa";
import cookieIcon from "../../assets/cookie-preferences-icon.png";

const CONSENT_STORAGE_KEY = "bb_cookie_consent_v1";

export const CookieConsent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always required
        analytics: false,
        functional: false,
    });

    useEffect(() => {
        try {
            const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
            if (!saved) {
                // Initial gentle delay to prevent layout jump on load
                const timer = setTimeout(() => setIsOpen(true), 1200);
                return () => clearTimeout(timer);
            } else {
                const parsed = JSON.parse(saved);
                if (parsed?.categories) {
                    setPreferences({
                        necessary: true,
                        analytics: Boolean(parsed.categories.analytics),
                        functional: Boolean(parsed.categories.functional),
                    });
                }
            }
        } catch {
            setIsOpen(true);
        }
    }, []);

    // Listen to custom event fired from policy pages (e.g., "Manage Preferences" buttons)
    useEffect(() => {
        const handleOpenPreferences = () => {
            setShowPreferences(true);
            setIsOpen(true);
        };
        window.addEventListener("openCookiePreferences", handleOpenPreferences);
        return () => window.removeEventListener("openCookiePreferences", handleOpenPreferences);
    }, []);

    const saveConsent = (categories) => {
        const payload = {
            version: 1,
            timestamp: new Date().toISOString(),
            categories: {
                necessary: true,
                analytics: Boolean(categories.analytics),
                functional: Boolean(categories.functional),
            },
        };

        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn("Could not save cookie consent preference", e);
        }

        setPreferences(payload.categories);
        setIsOpen(false);
        setShowPreferences(false);

        // Notify runtime modules (e.g., analytics tracker) of updated consent
        window.dispatchEvent(
            new CustomEvent("bb_cookie_consent_changed", { detail: payload.categories })
        );
    };

    const handleAcceptAll = () => {
        saveConsent({ necessary: true, analytics: true, functional: true });
    };

    const handleRejectOptional = () => {
        saveConsent({ necessary: true, analytics: false, functional: false });
    };

    const handleSavePreferences = () => {
        saveConsent(preferences);
    };

    // Close without altering or silently granting consent
    const handleClose = () => {
        setIsOpen(false);
        setShowPreferences(false);
    };

    return (
        <>
            {/* =========================================================================
                PERSISTENT FLOATING PRIVACY MANAGEMENT BUTTON
                Exact uploaded yellow-and-blue emblem. 48px mobile, 56px desktop.
            ========================================================================= */}
            <button
                type="button"
                onClick={() => {
                    setShowPreferences(true);
                    setIsOpen(true);
                }}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-0 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#F7C600]/60 focus:ring-offset-2 select-none cursor-pointer group bg-transparent border-0 overflow-hidden"
                title="Manage Privacy Preferences"
                aria-label="Manage Privacy Preferences"
            >
                <img
                    src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                    alt="Manage Privacy Preferences"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-2xl shadow-md transition-all group-hover:brightness-105"
                    width={56}
                    height={56}
                    loading="eager"
                />
            </button>

            {/* =========================================================================
                COOKIE & PRIVACY PREFERENCES POPUP
                Natural content-based height with zero unwanted inner scrollbars.
            ========================================================================= */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto transition-all animate-fade-in">
                        
                        {/* ----------------- 1. DEEP NAVY BLUE HEADER ----------------- */}
                        <div className="bg-[#0B315B] text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="p-1 rounded-xl bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                        alt="Broadbeach Emblem"
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain"
                                        width={36}
                                        height={36}
                                    />
                                </span>
                                <div>
                                    <h2 id="cookie-consent-title" className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                                        Cookie &amp; Privacy Preferences
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-slate-300 font-normal leading-tight">
                                        Compliant with India DPDP Act &amp; Global Privacy Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer shrink-0"
                                aria-label="Close dialog"
                                title="Close dialog"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ----------------- 2. CLEAN WHITE BODY (NATURAL HEIGHT) ----------------- */}
                        <div className="p-5 sm:p-6 text-slate-700 leading-relaxed space-y-4">
                            {!showPreferences ? (
                                <div className="space-y-3">
                                    {/* Brand identity line */}
                                    <p className="text-sm sm:text-base font-bold text-[#0B315B]">
                                        Broadbeach&copy; Online Academy
                                    </p>

                                    {/* Privacy description paragraph 1 */}
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        We respect your privacy. Broadbeach&copy; Online Academy uses essential cookies and browser storage technologies to support secure user authentication, course progress tracking, and certificate generation.
                                    </p>

                                    {/* Privacy description paragraph 2 */}
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        With your consent, we may also use privacy-conscious analytics to understand website usage and improve curriculum performance.
                                    </p>

                                    {/* Privacy description paragraph 3 with visual representation */}
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex flex-wrap items-center gap-1.5 pt-0.5">
                                        <span>You can customize your privacy preferences or withdraw your consent at any time by clicking the Manage Preferences icon</span>
                                        <img
                                            src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                            alt="Manage Preferences icon"
                                            className="w-4 h-4 rounded-sm object-contain shadow-xs inline-block align-middle shrink-0"
                                            width={16}
                                            height={16}
                                        />
                                        <span>in the bottom-right corner of your screen.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                                        <p className="text-sm sm:text-base font-bold text-[#0B315B]">
                                            Broadbeach&copy; Online Academy — Privacy Preferences
                                        </p>
                                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            Local Storage
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Choose which categories of cookies and browser storage technologies you permit. Strictly necessary storage cannot be disabled as it is required for core educational functionality.
                                    </p>

                                    {/* 1. Necessary */}
                                    <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-xs sm:text-sm">Strictly Necessary</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Always Active</span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                                                Required for student authentication, session persistence, exam security, and certificate verification.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            disabled
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded cursor-not-allowed opacity-70 shrink-0"
                                            aria-label="Strictly necessary storage always active"
                                        />
                                    </div>

                                    {/* 2. Analytics */}
                                    <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-xs sm:text-sm">Analytics &amp; Learning Optimization</span>
                                                <span className="text-[10px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                                                Helps us understand course engagement and optimize LMS delivery without collecting personal identifiers.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            id="cookie-analytics-toggle"
                                            checked={preferences.analytics}
                                            onChange={(e) =>
                                                setPreferences((prev) => ({
                                                    ...prev,
                                                    analytics: e.target.checked,
                                                }))
                                            }
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded focus:ring-[#F7C600] cursor-pointer shrink-0"
                                            aria-label="Toggle analytics cookies"
                                        />
                                    </div>

                                    {/* 3. Functional */}
                                    <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-xs sm:text-sm">Functional &amp; UI Preferences</span>
                                                <span className="text-[10px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                                                Remembers player audio volume, sidebar collapse state, and accessibility preferences across visits.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            id="cookie-functional-toggle"
                                            checked={preferences.functional}
                                            onChange={(e) =>
                                                setPreferences((prev) => ({
                                                    ...prev,
                                                    functional: e.target.checked,
                                                }))
                                            }
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded focus:ring-[#F7C600] cursor-pointer shrink-0"
                                            aria-label="Toggle functional cookies"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ----------------- 3. COMPACT UPPERCASE DOT-SEPARATED POLICY NAVIGATION ----------------- */}
                            <div className="pt-3 border-t border-slate-200 text-center">
                                <nav
                                    aria-label="Privacy policies navigation"
                                    className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500"
                                >
                                    <Link
                                        to="/privacy-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-4 transition-colors cursor-pointer"
                                    >
                                        PRIVACY POLICY
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/cookie-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-4 transition-colors cursor-pointer"
                                    >
                                        COOKIE POLICY
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/terms-and-conditions"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-4 transition-colors cursor-pointer"
                                    >
                                        TERMS &amp; CONDITIONS
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/data-protection-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-4 transition-colors cursor-pointer"
                                    >
                                        DATA PROTECTION POLICY
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/consent-management-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-4 transition-colors cursor-pointer"
                                    >
                                        CONSENT MANAGEMENT POLICY
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* ----------------- 4. LIGHT GREY FOOTER & ACTIONS ----------------- */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="text-xs sm:text-sm font-semibold text-[#0B315B] hover:text-[#b89000] flex items-center gap-1.5 transition-colors order-2 sm:order-1 cursor-pointer"
                                    >
                                        <FaCog className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Manage Preferences</span>
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <FaCheck className="w-3 h-3" />
                                            <span>Accept All</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(false)}
                                        className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors order-2 sm:order-1 cursor-pointer"
                                    >
                                        &larr; Back to Summary
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-xl shadow-sm transition-colors cursor-pointer"
                                        >
                                            Save My Preferences
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
