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
                    className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-30 p-0 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-3 focus:ring-[#F7C600]/60 focus:ring-offset-2 select-none cursor-pointer group bg-transparent border-0 overflow-hidden"
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
            )}

            {/* =========================================================================
                COOKIE & PRIVACY PREFERENCES POPUP
                Polished modal dialog with proper header alignment, modern toggle switches,
                enhanced category block spacing, sentence-case legal links, and 40px buttons.
            ========================================================================= */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto transition-all animate-fade-in">
                        
                        {/* ----------------- 1. HEADER (VERTICALLY CENTER-ALIGNED) ----------------- */}
                        <div className="bg-[#0B315B] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shrink-0">
                                    <img
                                        src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                        alt="Broadbeach Emblem"
                                        className="w-full h-full object-contain rounded-lg"
                                        width={36}
                                        height={36}
                                    />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <h2 id="cookie-consent-title" className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                                        Cookie &amp; Privacy Preferences
                                    </h2>
                                    <p className="text-xs text-slate-300 font-normal leading-tight mt-0.5 truncate">
                                        Compliant with India DPDP Act &amp; Global Privacy Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-white/40"
                                aria-label="Close dialog"
                                title="Close dialog"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ----------------- 2. CONTENT AREA ----------------- */}
                        <div className="p-5 sm:p-6 text-slate-700 leading-relaxed space-y-4">
                            {!showPreferences ? (
                                <div className="space-y-3">
                                    {/* Brand identity line */}
                                    <p className="text-sm sm:text-base font-bold text-[#0B315B] leading-tight">
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
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex flex-wrap items-center gap-1.5 pt-0.5">
                                        <span>You can customize your privacy preferences or withdraw your consent at any time by clicking the Manage Preferences icon</span>
                                        <img
                                            src={cookieIcon || "/assets/cookie-preferences-icon.png"}
                                            alt="Manage Preferences icon"
                                            className="w-4 h-4 rounded-xs object-contain shadow-2xs inline-block align-middle shrink-0"
                                            width={16}
                                            height={16}
                                        />
                                        <span>in the bottom-right corner of your screen.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-150">
                                        <p className="text-xs sm:text-sm font-bold text-[#0B315B]">
                                            Broadbeach&copy; Online Academy — Preferences
                                        </p>
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            Local Storage
                                        </span>
                                    </div>

                                    {/* 1. Strictly Necessary */}
                                    <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 transition-all">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                                    Strictly Necessary
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-200 text-slate-700">
                                                    ALWAYS ACTIVE
                                                </span>
                                            </div>
                                            {/* Modern Toggle Switch (Disabled / Always Active) */}
                                            <div
                                                role="switch"
                                                aria-checked="true"
                                                aria-disabled="true"
                                                className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-[#0B315B]/50 cursor-not-allowed opacity-75"
                                            >
                                                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md translate-x-5.5 transition-transform" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                            Required for student authentication, session integrity, exam progress preservation, and certificate validation.
                                        </p>
                                    </div>

                                    {/* 2. Analytics & Optimization */}
                                    <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 transition-all hover:border-slate-300">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                                    Analytics &amp; Optimization
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-500 border border-slate-200/90">
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
                                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0B315B]/40 focus:ring-offset-1 cursor-pointer ${
                                                    preferences.analytics ? "bg-[#0B315B]" : "bg-slate-300 hover:bg-slate-400"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                                        preferences.analytics ? "translate-x-5.5" : "translate-x-0.5"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                            Helps us understand curriculum engagement and improve platform performance without collecting personal identifiers.
                                        </p>
                                    </div>

                                    {/* 3. Functional & UI */}
                                    <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 transition-all hover:border-slate-300">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                                    Functional &amp; UI
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-500 border border-slate-200/90">
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
                                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0B315B]/40 focus:ring-offset-1 cursor-pointer ${
                                                    preferences.functional ? "bg-[#0B315B]" : "bg-slate-300 hover:bg-slate-400"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                                        preferences.functional ? "translate-x-5.5" : "translate-x-0.5"
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                            Remembers player volume, lesson sidebar collapse states, and user interface preferences across visits.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ----------------- 3. REFACTORED LEGAL LINKS (SENTENCE CASE WITH DOT SEPARATORS) ----------------- */}
                            <div className="pt-3.5 pb-0.5 border-t border-slate-200 text-center">
                                <nav
                                    aria-label="Privacy policies navigation"
                                    className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs font-semibold text-slate-600 leading-normal"
                                >
                                    <Link
                                        to="/privacy-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">•</span>
                                    <Link
                                        to="/cookie-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        Cookie Policy
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">•</span>
                                    <Link
                                        to="/terms-and-conditions"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">•</span>
                                    <Link
                                        to="/data-protection-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        Data Protection Policy
                                    </Link>
                                    <span className="text-slate-300 font-normal select-none">•</span>
                                    <Link
                                        to="/consent-management-policy"
                                        onClick={handleClose}
                                        className="text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-3 transition-colors cursor-pointer"
                                    >
                                        Consent Management Policy
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* ----------------- 4. POLISHED FOOTER CONTROLS ----------------- */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="text-xs sm:text-sm font-semibold text-[#0B315B] hover:text-[#b89000] flex items-center gap-1.5 transition-colors order-2 sm:order-1 cursor-pointer py-1.5"
                                    >
                                        <FaCog className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Manage Preferences</span>
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none h-10 px-5 sm:px-6 text-xs sm:text-sm font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0B315B] transition-colors order-2 sm:order-1 cursor-pointer py-1.5 group"
                                    >
                                        <FaArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5 text-slate-500 group-hover:text-[#0B315B]" />
                                        <span>Back to Summary</span>
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none h-10 px-5 sm:px-6 text-xs sm:text-sm font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center"
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
