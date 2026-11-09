import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaCog, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import cookieIcon from "../../assets/logo.jpg";

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
                    src={cookieIcon || "/logo.jpg"}
                    alt="Manage Privacy Preferences"
                    className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-2xl shadow-md transition-all group-hover:brightness-105 shrink-0"
                    width={48}
                    height={48}
                    loading="eager"
                />
            </button>

            {/* CONSENT BANNER & PREFERENCES MODAL */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800 transition-all my-auto">
                        
                        {/* =======================================================
                            HEADER: Deep navy blue banner with gold logo emblem,
                            title, compliance subtitle, and styled close button
                        ======================================================= */}
                        <div className="bg-[#0B315B] text-white px-6 py-4.5 sm:px-7 sm:py-5 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-3.5">
                                <span className="p-0.5 rounded-xl flex items-center justify-center shrink-0">
                                    <img
                                        src={cookieIcon || "/logo.jpg"}
                                        alt="Broadbeach Academy Emblem"
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-xs shrink-0"
                                        width={40}
                                        height={40}
                                    />
                                </span>
                                <div>
                                    <h2 id="cookie-consent-title" className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                                        Cookie & Privacy Preferences
                                    </h2>
                                    <p className="text-xs text-slate-300 font-normal mt-0.5">
                                        Compliant with India DPDP Act & Global Privacy Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-slate-300 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
                                aria-label="Close dialog"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* =======================================================
                            BODY: Natural container sizing without fixed vertical
                            height clipping or scrollbars
                        ======================================================= */}
                        <div className="p-6 sm:p-7 space-y-4">
                            {!showPreferences ? (
                                <div className="space-y-3.5">
                                    {/* Line 1: Academic Blue Title */}
                                    <h3 className="text-base sm:text-lg font-bold text-[#0B315B] tracking-tight">
                                        Broadbeach&copy; Online Academy
                                    </h3>

                                    {/* Paragraph 1 */}
                                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                                        We respect your privacy. Broadbeach&copy; Online Academy uses essential cookies and browser storage technologies to support secure user authentication, course progress tracking, and certificate generation.
                                    </p>

                                    {/* Paragraph 2 */}
                                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                                        With your consent, we may also use privacy-conscious analytics to understand website usage and improve curriculum performance.
                                    </p>

                                    {/* Paragraph 3 with Embedded Badge representation */}
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal flex flex-wrap items-center gap-1.5 pt-0.5">
                                        <span>You can customize your privacy preferences or withdraw your consent at any time by clicking the Manage Preferences icon</span>
                                        <span className="inline-flex items-center align-middle mx-1 p-0.5 rounded-md bg-amber-50 border border-amber-200 shadow-2xs shrink-0">
                                            <img
                                                src={cookieIcon || "/logo.jpg"}
                                                alt="Manage Preferences Icon"
                                                className="w-4 h-4 rounded object-contain shrink-0"
                                                width={16}
                                                height={16}
                                            />
                                        </span>
                                        <span>in the bottom-right corner of your screen.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                                        <h3 className="text-sm sm:text-base font-bold text-[#0B315B] tracking-tight">
                                            Broadbeach&copy; Online Academy — Privacy Preferences
                                        </h3>
                                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            Local Device Storage
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-normal">
                                        Choose which categories of cookies and browser storage technologies you permit. Strictly necessary storage cannot be disabled as it is required for core educational functionality.
                                    </p>

                                    {/* 1. Necessary */}
                                    <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-sm">Strictly Necessary</span>
                                                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Always Active</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-normal">
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
                                                <span className="font-semibold text-slate-900 text-sm">Analytics & Learning Optimization</span>
                                                <span className="text-[11px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-normal">
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
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded focus:ring-[#FFC72C] cursor-pointer"
                                            aria-label="Toggle analytics cookies"
                                        />
                                    </div>

                                    {/* 3. Functional */}
                                    <div className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900 text-sm">Functional & UI Preferences</span>
                                                <span className="text-[11px] font-medium text-slate-500">Optional</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-normal">
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
                                            className="mt-1 w-4 h-4 text-[#0B315B] rounded focus:ring-[#FFC72C] cursor-pointer"
                                            aria-label="Toggle functional cookies"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* =======================================================
                                SUBTLE SEPARATOR & CLEAN UPPERCASE POLICY HEADER
                                WITH DOT-SEPARATED LINKS
                            ======================================================= */}
                            <div className="pt-3 border-t border-slate-200/90 space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Official Policies & Regulatory Compliance
                                </p>
                                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-slate-600">
                                    <Link
                                        to="/privacy-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-semibold text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/cookie-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-semibold text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Cookie Policy
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/terms-and-conditions"
                                        onClick={() => setIsOpen(false)}
                                        className="font-semibold text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Terms & Conditions
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/data-protection-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-semibold text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Data Protection Policy
                                    </Link>
                                    <span className="text-slate-300 select-none">•</span>
                                    <Link
                                        to="/consent-management-policy"
                                        onClick={() => setIsOpen(false)}
                                        className="font-semibold text-[#0B315B] hover:text-[#183B73] hover:underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Consent Management Policy
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* =======================================================
                            FOOTER: Light grey bar with left-aligned Manage Preferences
                            and styled Reject Optional & bold amber Accept All
                        ======================================================= */}
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 sm:px-7 sm:py-4.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="text-xs sm:text-sm font-semibold text-[#0B315B] hover:text-[#b88e00] flex items-center gap-2 transition-colors order-2 sm:order-1 cursor-pointer select-none"
                                    >
                                        <FaCog className="w-3.5 h-3.5 text-[#0B315B]" />
                                        <span>Manage Preferences</span>
                                    </button>
                                    <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-[#0B315B] bg-[#FFC72C] hover:bg-[#e5b700] rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            Accept All
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(false)}
                                        className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors order-2 sm:order-1 cursor-pointer select-none"
                                    >
                                        ← Back to Summary
                                    </button>
                                    <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-[#0B315B] bg-[#FFC72C] hover:bg-[#e5b700] rounded-xl shadow-sm transition-all cursor-pointer"
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
