import React from "react";
import { Link } from "react-router-dom";
import {
  Cookie,
  ShieldCheck,
  Sliders,
  Database,
  Lock,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import CookieStorageDisclosure from "../components/common/CookieStorageDisclosure";

const CookiePolicy = () => {
  const triggerCookieModal = () => {
    window.dispatchEvent(new CustomEvent("openCookiePreferences"));
  };

  const cookieInventory = [
    {
      name: "PHPSESSID",
      category: "Essential / Strictly Necessary",
      type: "First-Party HTTP Cookie",
      provider: "cadac.in (Broadbeach Learning API)",
      expiry: "Session (Removed when browser closes)",
      purpose:
        "Maintains secure PHP session state, user authentication tokens, and prevents CSRF attacks during course enrollment and exam submissions.",
    },
    {
      name: "bb_user / user",
      category: "Essential / Functional",
      type: "Local Storage Key",
      provider: "Broadbeach Academy Platform",
      expiry: "Persistent until logout or storage cleared",
      purpose:
        "Stores the learner's display name, email, and user identifier to personalize the navigation bar, student dashboard, and course player.",
    },
    {
      name: "bb_enrolled_courses",
      category: "Essential / Functional",
      type: "Local Storage Key",
      provider: "Broadbeach Academy Platform",
      expiry: "Persistent until storage cleared",
      purpose:
        "Caches active course enrollments and progress milestones to ensure instant lesson loading and prevent redundant enrollment requests.",
    },
    {
      name: "bb_certificates",
      category: "Functional",
      type: "Local Storage Key",
      provider: "Broadbeach Academy Platform",
      expiry: "Persistent until storage cleared",
      purpose:
        "Stores verified digital achievement certificates and verification codes for quick retrieval in the student profile.",
    },
    {
      name: "sessionStorage (assessment answers)",
      category: "Essential",
      type: "Session Storage",
      provider: "Broadbeach Academy Platform",
      expiry: "Duration of exam session",
      purpose:
        "Temporarily preserves multiple-choice answers during the final certification assessment to prevent accidental progress loss.",
    },
    {
      name: "bb_cookie_consent",
      category: "Essential / Compliance",
      type: "Local Storage Key",
      provider: "Broadbeach Academy Platform",
      expiry: "Persistent (1 Year recommended refresh)",
      purpose:
        "Records your explicit consent choices, timestamp, and policy version to honor your data privacy preferences.",
    },
    {
      name: "YouTube (youtube-nocookie.com)",
      category: "Media / External Content",
      type: "Third-Party Privacy-Enhanced Embed",
      provider: "Google LLC / YouTube",
      expiry: "Dependent on Google privacy policies",
      purpose:
        "Serves lecture video streams via YouTube's privacy-enhanced domain, which prevents non-consented tracking cookies from being set before playback.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <Cookie size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Cookie & Storage Policy
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Comprehensive disclosure of all cookies, local storage keys, and
            browser tracking mechanisms utilized across the Broadbeach Academy platform.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Version: 1.0 (DPDP Act 2023 Aligned)</span>
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
          <span className="text-[#183B73] font-semibold">Cookie Policy</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        {/* Cookie Preference Storage Disclosure */}
        <CookieStorageDisclosure />

        {/* Quick Consent Management Action Box */}
        <div className="bg-gradient-to-r from-blue-900 to-[#183B73] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#FFDB58]">
              <Sliders size={20} />
              <h2 className="text-lg sm:text-xl font-bold">
                Your Privacy Choices & Consent Controls
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              You are in control of your data. You can inspect or modify your
              granular cookie and storage preferences at any time.
            </p>
          </div>

          <button
            type="button"
            onClick={triggerCookieModal}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#FFDB58] hover:bg-amber-300 text-[#131E4A] transition shadow-md cursor-pointer shrink-0 flex items-center gap-2"
          >
            <Sliders size={16} />
            <span>Customize Cookie Settings</span>
          </button>
        </div>

        {/* Section 1: Introduction */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-[#183B73]" />
            <span>1. What Are Cookies and Web Storage?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Cookies are small text files stored on your device by your web
            browser when you visit websites. Along with cookies, modern web
            applications utilize <strong>Local Storage</strong> and <strong>Session Storage</strong> (HTML5 Web Storage). These allow websites to retain vital application state—such as your active login session, enrolled course curriculum, and quiz responses—without continually transferring redundant data over the network.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Broadbeach Academy adheres strictly to the principle of <strong>data minimization</strong>. We do not sell your personal data or utilize invasive cross-site advertising trackers.
          </p>
        </section>

        {/* Section 2: Complete Storage Inventory Table */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
              <Database size={24} className="text-[#183B73]" />
              <span>2. Detailed Inventory of Cookies and Storage Technologies</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every technology currently deployed across broadbeachlearning.com is cataloged below with its specific operational purpose and lifecycle.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-800 font-bold">
                  <th className="p-3.5">Key / Cookie Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Type & Provider</th>
                  <th className="p-3.5">Retention Period</th>
                  <th className="p-3.5">Operational Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {cookieInventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5 font-mono font-bold text-[#183B73]">
                      {item.name}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.category.includes("Essential")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5">{item.type} ({item.provider})</td>
                    <td className="p-3.5 text-slate-500">{item.expiry}</td>
                    <td className="p-3.5 leading-relaxed">{item.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Categories Explained */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#183B73] flex items-center justify-center font-bold">
              <Lock size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Strictly Necessary Technologies
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              These are required for basic technical operations, learner
              authentication, session continuity, and security verification. You
              cannot opt out of these items because disabling them prevents the
              learning management system and credential verification from functioning.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Functional & Media Technologies
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              These allow us to save your video playback preferences and deliver
              interactive training videos via YouTube's privacy-enhanced embed
              mode. You can toggle these permissions at any time through the
              preferences panel.
            </p>
          </div>
        </section>

        {/* Section 4: Browser Management */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <HelpCircle size={24} className="text-[#183B73]" />
            <span>3. How to Manage Cookies Through Your Browser</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In addition to our on-site Cookie Preferences Manager, most web
            browsers allow you to view, delete, and block cookies globally or on
            a per-domain basis through their settings:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 list-disc list-inside">
            <li>
              <strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies.
            </li>
            <li>
              <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Enhanced Tracking Protection.
            </li>
            <li>
              <strong>Apple Safari:</strong> Preferences → Privacy → Prevent cross-site tracking.
            </li>
            <li>
              <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies.
            </li>
          </ul>
          <p className="text-xs text-slate-500 italic pt-2">
            * Note: Disabling strictly necessary local storage may prevent you
            from logging in or accessing your course materials.
          </p>
        </section>

        {/* Section 5: Legal & Contact */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            4. Policy Updates & Grievance Contact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We review our storage usage periodically to ensure adherence to the
            <strong> Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, Information Technology Act, 2000, and international guidelines.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If you have questions regarding our use of cookies or wish to submit
            a privacy inquiry, please contact our Compliance and Grievance Desk at{" "}
            <a
              href="mailto:info@broadbeach.in"
              className="text-[#183B73] font-bold underline"
            >
              info@broadbeach.in
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
};

export default CookiePolicy;
