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
                const timer = setTimeout(() => setIsOpen(true), 1000);
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
                Reduced proportional size (36px mobile, 40px desktop) to sit elegantly
                in the bottom-right corner without looking oversized or odd.
            ========================================================================= */}
            <button
                type="button"
                onClick={() => {
                    setShowPreferences(true);
                    setIsOpen(true);
                }}
                className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-40 p-0 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-3 focus:ring-[#F7C600]/60 focus:ring-offset-2 select-none cursor-pointer group bg-transparent border-0 overflow-hidden"
                title="Manage Privacy Preferences"
                aria-label="Manage Privacy Preferences"
            >
                <img
                    src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                    alt="Manage Privacy Preferences"
                    className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-sm transition-all group-hover:brightness-105"
                    width={40}
                    height={40}
                    loading="eager"
                />
            </button>

            {/* =========================================================================
                COOKIE & PRIVACY PREFERENCES POPUP
                Streamlined compact card (max-w-lg) that fits effortlessly on all
                screen heights with ZERO vertical scrolling.
            ========================================================================= */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition-all animate-fade-in">
                        
                        {/* ----------------- 1. COMPACT NAVY BLUE HEADER ----------------- */}
                        <div className="bg-[#0B315B] text-white px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span className="p-0.5 rounded-lg bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                        alt="Broadbeach Emblem"
                                        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-md object-contain"
                                        width={30}
                                        height={30}
                                    />
                                </span>
                                <div>
                                    <h2 id="cookie-consent-title" className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                                        Cookie &amp; Privacy Preferences
                                    </h2>
                                    <p className="text-[10px] sm:text-[11px] text-slate-300 font-normal leading-tight">
                                        Compliant with India DPDP Act &amp; Global Privacy Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-slate-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 cursor-pointer shrink-0"
                                aria-label="Close dialog"
                                title="Close dialog"
                            >
                                <FaTimes className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* ----------------- 2. COMPACT CONTENT AREA (NO SCROLLBAR) ----------------- */}
                        <div className="px-4 sm:px-5 py-3 sm:py-3.5 text-slate-700 leading-relaxed space-y-2.5">
                            {!showPreferences ? (
                                <div className="space-y-2">
                                    {/* Brand identity line */}
                                    <p className="text-xs sm:text-sm font-bold text-[#0B315B] leading-tight">
                                        Broadbeach&copy; Online Academy
                                    </p>

                                    {/* Privacy description paragraph 1 */}
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        We respect your privacy. Broadbeach&copy; Online Academy uses essential cookies and browser storage technologies to support secure user authentication, course progress tracking, and certificate generation.
                                    </p>

                                    {/* Privacy description paragraph 2 */}
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        With your consent, we may also use privacy-conscious analytics to understand website usage and improve curriculum performance.
                                    </p>

                                    {/* Privacy description paragraph 3 with visual representation */}
                                    <p className="text-[11.5px] text-slate-500 leading-relaxed flex flex-wrap items-center gap-1 pt-0.5">
                                        <span>You can customize your privacy preferences or withdraw your consent at any time by clicking the Manage Preferences icon</span>
                                        <img
                                            src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                            alt="Manage Preferences icon"
                                            className="w-3.5 h-3.5 rounded-xs object-contain shadow-2xs inline-block align-middle shrink-0"
                                            width={14}
                                            height={14}
                                        />
                                        <span>in the bottom-right corner of your screen.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-150">
                                        <p className="text-xs sm:text-sm font-bold text-[#0B315B]">
                                            Broadbeach&copy; Online Academy — Preferences
                                        </p>
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                            Local Storage
                                        </span>
                                    </div>

                                    {/* 1. Necessary */}
                                    <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <div className="pr-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-xs">Strictly Necessary</span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Always Active</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                                Required for authentication, session integrity, and certificate verification.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            disabled
                                            className="mt-0.5 w-3.5 h-3.5 text-[#0B315B] rounded cursor-not-allowed opacity-70 shrink-0"
                                            aria-label="Strictly necessary storage always active"
                                        />
                                    </div>

                                    {/* 2. Analytics */}
                                    <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <div className="pr-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-xs">Analytics &amp; Optimization</span>
                                                <span className="text-[9px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                                Helps us understand curriculum engagement without collecting personal data.
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
                                            className="mt-0.5 w-3.5 h-3.5 text-[#0B315B] rounded focus:ring-[#F7C600] cursor-pointer shrink-0"
                                            aria-label="Toggle analytics cookies"
                                        />
                                    </div>

                                    {/* 3. Functional */}
                                    <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <div className="pr-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-xs">Functional &amp; UI</span>
                                                <span className="text-[9px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                                Remembers player audio volume, sidebar state, and UI preferences.
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
                                            className="mt-0.5 w-3.5 h-3.5 text-[#0B315B] rounded focus:ring-[#F7C600] cursor-pointer shrink-0"
                                            aria-label="Toggle functional cookies"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ----------------- 3. COMPACT DOT-SEPARATED POLICY NAVIGATION ----------------- */}
                            <div className="pt-2 border-t border-slate-150 text-center">
                                <nav
                                    aria-label="Privacy policies navigation"
                                    className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-500"
                                >
                                    <Link
                                        to="/privacy-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        PRIVACY POLICY
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/cookie-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        COOKIE POLICY
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/terms-and-conditions"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        TERMS &amp; CONDITIONS
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/data-protection-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        DATA PROTECTION POLICY
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">·</span>
                                    <Link
                                        to="/consent-management-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        CONSENT MANAGEMENT POLICY
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* ----------------- 4. COMPACT LIGHT GREY FOOTER ----------------- */}
                        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-5 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="text-xs font-semibold text-[#0B315B] hover:text-[#b89000] flex items-center gap-1.5 transition-colors order-2 sm:order-1 cursor-pointer"
                                    >
                                        <FaCog className="w-3 h-3 text-slate-500" />
                                        <span>Manage Preferences</span>
                                    </button>
                                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors order-2 sm:order-1 cursor-pointer"
                                    >
                                        &larr; Back to Summary
                                    </button>
                                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-lg shadow-xs transition-colors cursor-pointer"
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
