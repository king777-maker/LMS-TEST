import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaCog, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import cookieIcon from "../../assets/cookie-preferences-icon.jpg";

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
                // Initial delay to avoid layout jump
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

    return (
        <>
            {/* PERSISTENT FLOATING TRIGGER (Permanent visual identity for preference management) */}
            <button
                type="button"
                onClick={() => {
                    setShowPreferences(true);
                    setIsOpen(true);
                }}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-0 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-400/50 select-none cursor-pointer group bg-transparent border-0 overflow-hidden"
                title="Manage Privacy Preferences"
                aria-label="Manage Privacy Preferences"
            >
                <img
                    src={cookieIcon || "/assets/cookie-preferences-icon.jpg"}
                    alt="Manage Privacy Preferences"
                    className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-2xl shadow-md transition-all group-hover:brightness-105"
                    width={48}
                    height={48}
                    loading="eager"
                />
            </button>

            {/* CONSENT BANNER & PREFERENCES MODAL */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-sm animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition-all">
                        
                        {/* Header */}
                        <div className="bg-[#0B315B] text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="p-1 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={cookieIcon || "/assets/cookie-preferences-icon.jpg"}
                                        alt="Broadbeach Privacy Preferences"
                                        className="w-8 h-8 rounded-lg object-contain"
                                        width={32}
                                        height={32}
                                    />
                                </span>
                                <div>
                                    <h2 id="cookie-consent-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                                        Cookie & Privacy Preferences
                                    </h2>
                                    <p className="text-xs text-slate-300">
                                        Compliant with India DPDP Act & Global Privacy Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                                aria-label="Close dialog"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-4">
                            {!showPreferences ? (
                                <div className="space-y-3.5">
                                    {/* Line 1 */}
                                    <p className="text-base font-bold text-[#0B315B]">
                                        Broadbeach&copy; Online Academy
                                    </p>

                                    {/* Paragraph 1 */}
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        We respect your privacy. Broadbeach&copy; Online Academy uses essential cookies and browser storage technologies to support secure user authentication, course progress tracking, and certificate generation.
                                    </p>

                                    {/* Paragraph 2 */}
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        With your consent, we may also use privacy-conscious analytics to understand website usage and improve curriculum performance.
                                    </p>

                                    {/* Paragraph 3 */}
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex flex-wrap items-center gap-1.5 pt-1">
                                        <span>You can customize your privacy preferences or withdraw your consent at any time by clicking the Manage Preferences icon</span>
                                        <img
                                            src={cookieIcon || "/assets/cookie-preferences-icon.jpg"}
                                            alt="Manage Preferences icon"
                                            className="w-4 h-4 rounded-sm object-contain shadow-xs inline-block align-middle"
                                            width={16}
                                            height={16}
                                        />
                                        <span>in the bottom-right corner of your screen.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                                        <p className="text-sm sm:text-base font-bold text-[#0B315B]">
                                            Broadbeach&copy; Online Academy — Privacy Preferences
                                        </p>
                                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            Local Device Storage
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Choose which categories of cookies and browser storage technologies you permit. Strictly necessary storage cannot be disabled as it is required for core educational functionality.
                                    </p>

                                    {/* 1. Necessary */}
                                    <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">Strictly Necessary</span>
                                                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Always Active</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Required for student login, secure session maintenance, exam integrity, and certificate validation.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            disabled
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded cursor-not-allowed opacity-70"
                                            aria-label="Strictly necessary storage always active"
                                        />
                                    </div>

                                    {/* 2. Analytics */}
                                    <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">Analytics & Learning Optimization</span>
                                                <span className="text-[11px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Helps us understand popular course topics and improve the LMS curriculum without collecting personal identifiers.
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
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded focus:ring-[#F7C600] cursor-pointer"
                                            aria-label="Toggle analytics cookies"
                                        />
                                    </div>

                                    {/* 3. Functional */}
                                    <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">Functional & UI Preferences</span>
                                                <span className="text-[11px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Remembers your audio volume, lecture view settings, and accessibility preferences across visits.
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
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded focus:ring-[#F7C600] cursor-pointer"
                                            aria-label="Toggle functional cookies"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Governing Policy Navigation Links */}
                            <div className="pt-4 border-t border-slate-200/90 space-y-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <FaExternalLinkAlt className="w-2.5 h-2.5 text-[#0B315B]" />
                                    <span>Governing Policies & Legal Documentation</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs">
                                    <Link
                                        to="/privacy-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-medium text-[#183B73] hover:text-[#0B2E53] hover:underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#183B73] rounded"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="text-slate-300">•</span>
                                    <Link
                                        to="/cookie-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-medium text-[#183B73] hover:text-[#0B2E53] hover:underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#183B73] rounded"
                                    >
                                        Cookie Policy
                                    </Link>
                                    <span className="text-slate-300">•</span>
                                    <Link
                                        to="/terms-and-conditions"
                                        onClick={() => setIsOpen(false)}
                                        className="font-medium text-[#183B73] hover:text-[#0B2E53] hover:underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#183B73] rounded"
                                    >
                                        Terms & Conditions
                                    </Link>
                                    <span className="text-slate-300">•</span>
                                    <Link
                                        to="/data-protection-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-medium text-[#183B73] hover:text-[#0B2E53] hover:underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#183B73] rounded"
                                    >
                                        Data Protection Policy
                                    </Link>
                                    <span className="text-slate-300">•</span>
                                    <Link
                                        to="/consent-management-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-medium text-[#183B73] hover:text-[#0B2E53] hover:underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#183B73] rounded"
                                    >
                                        Consent Management Policy
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="text-xs sm:text-sm font-semibold text-[#0B315B] hover:text-[#e5b700] flex items-center gap-1.5 transition-colors order-2 sm:order-1 cursor-pointer"
                                    >
                                        <FaCog className="w-3.5 h-3.5" />
                                        Manage Preferences
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <FaCheck className="w-3 h-3" />
                                            Accept All
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
                                        ← Back to Summary
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-xl shadow-sm transition-colors cursor-pointer"
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
