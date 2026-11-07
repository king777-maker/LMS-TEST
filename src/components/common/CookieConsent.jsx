import { useState, useEffect } from "react";
import { FaShieldAlt, FaTimes, FaCog, FaCheck } from "react-icons/fa";

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
            {/* PERSISTENT FLOATING TRIGGER (Allows users to re-open and change preferences anytime) */}
            <button
                type="button"
                onClick={() => {
                    setShowPreferences(true);
                    setIsOpen(true);
                }}
                className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-30 bg-[#0B2E53] hover:bg-[#193E63] text-white hover:text-[#FFB800] border border-white/20 p-2 sm:p-2.5 rounded-full shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFB800] select-none cursor-pointer"
                title="Manage Cookie & Privacy Preferences"
                aria-label="Manage Cookie & Privacy Preferences"
            >
                <FaShieldAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
            </button>

            {/* CONSENT BANNER & MODAL */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookie-consent-title"
                >
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition-all">
                        
                        {/* Header */}
                        <div className="bg-[#0B315B] text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-[#F7C600]/20 rounded-lg text-[#F7C600]">
                                    <FaShieldAlt className="w-5 h-5 text-[#F7C600]" />
                                </span>
                                <div>
                                    <h2 id="cookie-consent-title" className="text-base sm:text-lg font-bold text-white">
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
                                className="text-slate-400 hover:text-white transition-colors p-1"
                                aria-label="Close dialog"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto text-sm text-slate-600 leading-relaxed">
                            {!showPreferences ? (
                                <div className="space-y-3">
                                    <p>
                                        We respect your privacy. Broadbeach Online Academy uses essential cookies to ensure secure user authentication, course progress tracking, and certificate generation. With your consent, we also use privacy-conscious analytics to optimize curriculum performance.
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        You can customize your preferences or withdraw consent at any time using the persistent shield icon in the lower corner of the screen.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-xs text-slate-500 mb-2">
                                        Choose which categories of cookies you permit. Strictly necessary cookies cannot be disabled as they are required for core educational functionality.
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
                                            aria-label="Strictly necessary cookies always active"
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
                                                Helps us understand popular course topics and improve the LMS without collecting personal identifiers.
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
                        </div>

                        {/* Footer Controls */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {!showPreferences ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(true)}
                                        className="text-xs font-semibold text-[#0B315B] hover:text-[#F7C600] flex items-center gap-1.5 transition-colors order-2 sm:order-1"
                                    >
                                        <FaCog className="w-3.5 h-3.5" />
                                        Manage Preferences
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
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
                                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors order-2 sm:order-1"
                                    >
                                        ← Back
                                    </button>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                                        <button
                                            type="button"
                                            onClick={handleRejectOptional}
                                            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            Reject Optional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-[#0B315B] bg-[#F7C600] hover:bg-[#e5b700] rounded-lg shadow-sm transition-colors"
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
