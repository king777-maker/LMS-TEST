import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaCog, FaCheck, FaArrowLeft } from "react-icons/fa";
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
                Positioned at z-30 and conditionally hidden while the modal is open
                so the dark backdrop cleanly dims the page without the widget peeking through.
            ========================================================================= */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => {
                        setShowPreferences(true);
                        setIsOpen(true);
                    }}
                    className="fixed bottom-5 right-5 z-30 p-0 rounded-xl shadow-md opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 select-none cursor-pointer group bg-transparent border-0 overflow-hidden"
                    title="Manage Privacy Preferences"
                    aria-label="Manage Privacy Preferences"
                >
                    <img
                        src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                        alt="Manage Privacy Preferences"
                        className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-xl shadow-xs transition-all group-hover:brightness-105"
                        width={36}
                        height={36}
                        loading="eager"
                    />
                </button>
            )}

            {/* =========================================================================
                COOKIE & PRIVACY PREFERENCES POPUP
                Natural height modal (max-w-2xl w-full) without any internal vertical scrollbar.
            ========================================================================= */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition-all animate-fade-in flex flex-col">
                        
                        {/* ----------------- 1. NAVY HEADER (ATTACHED TO TOP, ROUNDED-T-2XL) ----------------- */}
                        <div className="bg-[#131E4A] text-white px-5 py-3 rounded-t-2xl flex items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 p-0.5 flex items-center justify-center shrink-0">
                                    <img
                                        src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                        alt="Broadbeach Emblem"
                                        className="w-full h-full object-contain rounded-md"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <h2 id="cookie-consent-title" className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                                        Preferences - Cookies, Data Privacy &amp; Protection
                                    </h2>
                                    <p className="text-[11px] text-slate-300 font-normal leading-tight mt-0.5 truncate">
                                        Compliant with Indian DPDP Act &amp; Global Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-white/40"
                                aria-label="Close dialog"
                                title="Close dialog"
                            >
                                <FaTimes className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* ----------------- 2. CONTENT AREA (NATURAL AUTO HEIGHT, NO SCROLLBAR) ----------------- */}
                        <div className="px-5 py-3.5 text-slate-700 leading-relaxed">
                            {!showPreferences ? (
                                <div className="space-y-2.5">
                                    {/* Privacy description paragraph 1 in light gray with bold brand */}
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                        We respect your privacy. <strong className="font-bold text-slate-700">Broadbeach&copy; Online Academy</strong> uses essential cookies and browser storage technologies to support secure user authentication, course progress tracking, and certificate generation.
                                    </p>

                                    {/* Merged paragraph 2 in matching light gray */}
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                        With your consent, we may also use privacy-conscious analytics to understand website usage and improve curriculum performance. You can customize your privacy preferences or withdraw your consent at any time by clicking the Manage Preferences icon in the bottom-right corner of your screen.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between pb-1 border-b border-slate-150">
                                        <p className="text-xs sm:text-sm font-bold text-[#131E4A]">
                                            Broadbeach&copy; Online Academy — Preferences
                                        </p>
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            Local Storage
                                        </span>
                                    </div>

                                    {/* 1. Strictly Necessary */}
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 transition-all">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    Strictly Necessary
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-200 text-slate-700">
                                                    ALWAYS ACTIVE
                                                </span>
                                            </div>
                                            {/* Modern Toggle Switch (Disabled / Always Active) */}
                                            <div
                                                role="switch"
                                                aria-checked="true"
                                                aria-disabled="true"
                                                className="relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full bg-[#131E4A]/50 cursor-not-allowed opacity-75"
                                            >
                                                <span className="inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md translate-x-5 transition-transform" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                            Required for student authentication, session integrity, exam progress preservation, and certificate validation.
                                        </p>
                                    </div>

                                    {/* 2. Analytics & Optimization */}
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 transition-all hover:border-slate-300">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    Analytics &amp; Optimization
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide bg-slate-100 text-slate-500 border border-slate-200/90">
                                                    Optional
                                                </span>
                                            </div>
                                            {/* Modern Toggle Switch (Interactive) */}
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={preferences.analytics}
                                                onClick={() =>
                                                    setPreferences((prev) => ({
                                                        ...prev,
                                                        analytics: !prev.analytics,
                                                    }))
                                                }
                                                className={`relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#131E4A]/40 focus:ring-offset-1 cursor-pointer ${
                                                    preferences.analytics ? "bg-[#131E4A]" : "bg-slate-300 hover:bg-slate-400"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                                        preferences.analytics ? "translate-x-5" : "translate-x-0.5"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                            Helps us understand curriculum engagement and improve platform performance without collecting personal identifiers.
                                        </p>
                                    </div>

                                    {/* 3. Functional & UI */}
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 transition-all hover:border-slate-300">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    Functional &amp; UI
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide bg-slate-100 text-slate-500 border border-slate-200/90">
                                                    Optional
                                                </span>
                                            </div>
                                            {/* Modern Toggle Switch (Interactive) */}
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={preferences.functional}
                                                onClick={() =>
                                                    setPreferences((prev) => ({
                                                        ...prev,
                                                        functional: !prev.functional,
                                                    }))
                                                }
                                                className={`relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#131E4A]/40 focus:ring-offset-1 cursor-pointer ${
                                                    preferences.functional ? "bg-[#131E4A]" : "bg-slate-300 hover:bg-slate-400"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                                        preferences.functional ? "translate-x-5" : "translate-x-0.5"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                            Remembers player volume, lesson sidebar collapse states, and user interface preferences across visits.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ----------------- 3. COMPACT SENTENCE-CASE LEGAL LINKS (LEFT-ALIGNED BLUE HYPERLINKS) ----------------- */}
                            <div className="mt-3 mb-1 pt-2.5 border-t border-slate-150 text-left">
                                <nav
                                    aria-label="Privacy policies navigation"
                                    className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-[11px] sm:text-xs leading-normal"
                                >
                                    <Link
                                        to="/privacy-policy"
                                        onClick={handleClose}
                                        className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors cursor-pointer font-medium"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/cookie-policy"
                                        onClick={handleClose}
                                        className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors cursor-pointer font-medium"
                                    >
                                        Cookie Policy
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/terms-and-conditions"
                                        onClick={handleClose}
                                        className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors cursor-pointer font-medium"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/data-protection-policy"
                                        onClick={handleClose}
                                        className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors cursor-pointer font-medium"
                                    >
                                        Data Protection Policy
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/consent-management-policy"
                                        onClick={handleClose}
                                        className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors cursor-pointer font-medium"
                                    >
                                        Consent Mgmt policy
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* ----------------- 4. COMPACT FOOTER (PY-3 PX-5, ROUNDED-B-2XL) ----------------- */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#131E4A] hover:text-[#b89000] transition-colors order-2 sm:order-1 cursor-pointer py-1"
                                    >
                                        <FaCog className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Manage Preferences</span>
                                    </button>
                                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none h-9 px-4 sm:px-5 text-sm font-bold text-[#131E4A] bg-[#F7C600] hover:bg-[#e5b700] rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#131E4A] transition-colors order-2 sm:order-1 cursor-pointer py-1 group"
                                    >
                                        <FaArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5 text-slate-400 group-hover:text-[#131E4A]" />
                                        <span>Back to Summary</span>
                                    </button>
                                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none h-9 px-4 sm:px-5 text-sm font-bold text-[#131E4A] bg-[#F7C600] hover:bg-[#e5b700] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
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
