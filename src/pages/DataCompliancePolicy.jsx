import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Database,
  Layers,
  Scale,
  FileCheck,
  Mail,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import CookieStorageDisclosure from "../components/common/CookieStorageDisclosure";

const DataCompliancePolicy = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <ShieldCheck size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Data Protection & Regulatory Compliance
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Our governance framework for information security, statutory compliance,
            and data privacy under Indian and international regulations.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Statutory Framework: DPDP Act 2023 • IT Act 2000 • CPA 2019</span>
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
          <span className="text-[#183B73] font-semibold">
            Data & Compliance Policy
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        {/* Cookie Preference Storage Disclosure */}
        <CookieStorageDisclosure />

        {/* Compliance Architecture Overview */}
        <section className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#131E4A] flex items-center gap-2">
            <Scale size={22} className="text-[#183B73]" />
            <span>Governance Principles</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Broadbeach Academy integrates data protection, consumer transparency,
            and information security by design. As a professional education provider
            specializing in ISO management systems, we maintain compliance with
            applicable Indian legal standards while adopting global best practices for
            educational credential integrity.
          </p>
        </section>

        {/* Regulatory Framework Matrix */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            1. Applicable Legal & Regulatory Matrix
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-800 text-sm">
                A. Digital Personal Data Protection Act, 2023 (DPDP Act, India):
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Applies to the digital processing of personal data within India.
                Broadbeach Innovations functions as a Data Fiduciary, enforcing purpose
                limitation, data minimization, consent transparency, and fulfilling
                Data Principal rights.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-800 text-sm">
                B. Information Technology Act, 2000 & SPDI Rules, 2011:
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Mandates reasonable security practices and procedures (RSPP), secure
                session handling, protection against electronic tampering, and the
                appointment of a dedicated Grievance Officer.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-800 text-sm">
                C. Consumer Protection Act, 2019 & E-Commerce Rules, 2020:
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Requires honest disclosures regarding course pricing, refund timelines,
                grievance redressal mechanisms, and strict prohibition of unfair trade
                practices, fake reviews, and misleading accreditation claims.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-800 text-sm">
                D. International Privacy Principles (GDPR / UK GDPR Alignment):
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Where international learners access our portal, we apply core GDPR
                principles: lawful processing basis, privacy by default, data portability,
                and zero third-party cross-site behavioral tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Data Integrity Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#183B73] flex items-center justify-center font-bold">
              <Lock size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Technical Security Measures
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li>End-to-end SSL/TLS 1.3 encryption across all client-server communications.</li>
              <li>Strict server-side input validation and SQL injection / XSS prevention.</li>
              <li>Cryptographic password hashing (Bcrypt / Argon2 standard).</li>
              <li>Same-origin HTTP session proxying to prevent CORS vulnerabilities.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FileCheck size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Credential & Examination Integrity
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li>Randomized question banks to ensure independent examination rigor.</li>
              <li>Unique anti-counterfeiting verification identifiers (<code className="bg-slate-100 px-1 rounded">BB-VERIFIED</code>).</li>
              <li>Public QR verification portal accessible worldwide 24/7.</li>
              <li>Immediate revocation protocols for fraudulent or tampered credentials.</li>
            </ul>
          </div>
        </section>

        {/* Breach Notification & Incident Response */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            2. Personal Data Breach Protocol
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In compliance with Section 8(6) of the DPDP Act, 2023, Broadbeach Innovations
            maintains a documented incident response protocol. In the unlikely event
            of a confirmed personal data breach:
          </p>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>We will notify the <strong>Data Protection Board of India</strong> in the mandated form and manner.</li>
            <li>We will inform affected Data Principals without undue delay, outlining the nature of the breach, potential consequences, and remedial measures taken.</li>
            <li>We will execute immediate containment, forensic remediation, and password reset protocols.</li>
          </ul>
        </section>

        {/* Contact and Compliance Inquiries */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-blue-200/60 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            3. Regulatory Inquiries & Compliance Desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For audit documentation requests, institutional data processing agreements
            (DPAs), or regulatory notices:
          </p>
          <div className="text-xs sm:text-sm text-slate-800 space-y-1 font-mono pt-1">
            <div><strong>Compliance Desk:</strong> info@broadbeach.in / certification@broadbeach.in</div>
            <div><strong>Telephone:</strong> +91 7338 649 737</div>
            <div><strong>Headquarters:</strong> 22nd Floor, World Trade Center, 26/1, Dr Rajkumar Rd, Malleshwaram, Bengaluru, Karnataka 560055, India</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DataCompliancePolicy;