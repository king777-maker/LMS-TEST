import React from "react";
import { Link } from "react-router-dom";
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  HardDrive,
  RefreshCw,
  Mail,
  ChevronRight,
  Info
} from "lucide-react";
import CookieStorageDisclosure from "../components/common/CookieStorageDisclosure";

const ConsentManagementPolicy = () => {
  const triggerCookieModal = () => {
    window.dispatchEvent(new CustomEvent("openCookiePreferences"));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <Sliders size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Consent Management Policy
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Our framework for capturing, honoring, and managing user privacy choices
            and browser storage consent under the Digital Personal Data Protection Act, 2023 (India)
            and international privacy standards.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>Version: 2.0</span>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <Link to="/" className="hover:text-[#183B73] transition">
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#183B73] font-semibold">Consent Management Policy</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        
        {/* MANDATORY COOKIE PREFERENCE STORAGE DISCLOSURE */}
        <CookieStorageDisclosure />

        {/* Section 1: Objective & Scope */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-emerald-600" />
            <span>1. Purpose and Legal Framework</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Broadbeach Online Academy is committed to transparency and granular user control regarding
            personal data and local browser storage. Under <strong>Section 6 of the Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>,
            consent must be free, specific, informed, unconditional, and unambiguous with clear affirmative action.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This Consent Management Policy explains how your preferences are established, stored locally on your device,
            and how you can adjust or withdraw consent at any point during your learning journey.
          </p>
        </section>

        {/* Section 2: Consent Architecture & Categories */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <Layers size={24} className="text-[#183B73]" />
            <span>2. Categories of Consent</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We categorize website cookies and browser storage technologies into three distinct tiers:
          </p>

          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm sm:text-base">A. Strictly Necessary (Always Active)</span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full">Exempt from Opt-in</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Essential for core LMS operations: user authentication sessions, course enrollment state, exam progress preservation,
                and digital certificate validation. These cannot be disabled as the learning platform cannot function without them.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm sm:text-base">B. Analytics & Learning Optimization</span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">Optional • Opt-In Required</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Helps us analyze aggregate, privacy-conscious usage metrics (e.g., lecture completion rates, drop-off points)
                to improve our curriculum and system performance. No cross-site or advertising tracking is deployed.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm sm:text-base">C. Functional & UI Preferences</span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">Optional • Opt-In Required</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Retains your interface customizations across visits, including video playback volume, sidebar collapse state,
                and accessibility preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Local Storage Architecture */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <HardDrive size={24} className="text-[#183B73]" />
            <span>3. How Your Consent Preferences Are Stored</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In strict adherence to the data minimization principle:
          </p>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>Your cookie and privacy selections are stored locally in your browser’s <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">localStorage</code> under the key <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">bb_cookie_consent_v1</code>.</li>
            <li>Broadbeach Online Academy does <strong>not</strong> transmit, record, or track your preference selections on backend server databases.</li>
            <li>Your browser evaluates this local state client-side prior to activating optional analytics or functional features.</li>
            <li>If you clear your browser cookies or cache, your stored preference key will be removed, and the preference banner will prompt you again upon your next visit.</li>
          </ul>
        </section>

        {/* Section 4: Right to Withdraw Consent */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <RefreshCw size={24} className="text-blue-600" />
            <span>4. Modifying or Withdrawing Your Consent</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Under Section 6(4) of the DPDP Act, you have the statutory right to withdraw previously granted consent with the same ease
            as giving it.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You can customize your privacy preferences or withdraw your consent at any time by clicking the <strong>Manage Preferences icon</strong> in the bottom-right corner of your screen, or by using the quick button below:
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={triggerCookieModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#131E4A] hover:bg-[#183B73] text-amber-300 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Sliders size={16} />
              <span>Open Cookie & Privacy Preferences</span>
            </button>
          </div>
        </section>

        {/* Section 5: Contact & Inquiries */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-blue-200/60 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2">
            <Mail size={22} className="text-[#183B73]" />
            <span>5. Privacy Desk & Inquiries</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For questions concerning your consent records or our privacy architecture:
          </p>
          <div className="text-xs sm:text-sm text-slate-800 space-y-1 font-mono pt-1">
            <div><strong>Email:</strong> <a href="mailto:info@broadbeach.in" className="text-blue-600 font-bold hover:underline">info@broadbeach.in</a> / <a href="mailto:certification@broadbeach.in" className="text-blue-600 font-bold hover:underline">certification@broadbeach.in</a></div>
            <div><strong>Phone / Helpline:</strong> +91 7338 649 737</div>
            <div><strong>Address:</strong> 22nd Floor, World Trade Center, 26/1, Dr Rajkumar Rd, Malleshwaram, Bengaluru, Karnataka 560055, India</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ConsentManagementPolicy;

