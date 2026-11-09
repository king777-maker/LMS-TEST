import React from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  CreditCard,
  AlertTriangle,
  Mail,
  ChevronRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import CookieStorageDisclosure from "../components/common/CookieStorageDisclosure";

const CancellationRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <RotateCcw size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Cancellation & Refund Policy
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Clear, transparent guidelines regarding digital course access,
            enrollment cancellations, fee refunds, and duplicate transaction handling.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Consumer Protection (E-Commerce) Rules Aligned</span>
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
            Cancellation & Refund Policy
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        {/* Cookie Preference Storage Disclosure */}
        <CookieStorageDisclosure />

        {/* Core Principles Summary */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#131E4A] flex items-center gap-2">
            <ShieldCheck size={22} className="text-[#183B73]" />
            <span>Digital Educational Services & Fair Refund Policy</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            At Broadbeach Academy, we provide instant access to high-quality
            professional training curricula, interactive slide decks, and verifiable
            certification examinations. Because digital products and learning
            materials are made accessible immediately upon enrollment, our
            cancellation and refund terms balance learner flexibility with the
            immutable nature of digital intellectual property delivery.
          </p>
        </div>

        {/* Section 1: Free vs Paid Courses */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            1. Program Categories: Free vs. Paid Certifications
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>1.1 Free Foundational Programs:</strong> All courses listed
              under our "Free Courses" catalog (including introductory ISO awareness
              modules) are 100% grant-sponsored and free of charge. No payment is
              required, and therefore no refund claims apply to these programs.
            </p>
            <p>
              <strong>1.2 Paid Professional Programs:</strong> Advanced Lead Auditor,
              Internal Auditor, and Aerospace certifications that require enrollment
              fees or corporate vouchers are subject to the terms below.
            </p>
            <p>
              <strong>1.3 Platform Payment Architecture:</strong> Our web frontend does
              not directly capture, store, or process debit/credit card numbers or
              bank login credentials. Paid enrollments are activated via authorized
              corporate voucher codes or external institutional invoicing.
            </p>
          </div>
        </section>

        {/* Section 2: Eligibility for Refunds */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            2. Refund Eligibility Criteria
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              You may be eligible for a refund of paid course fees strictly under the
              following conditions:
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Within 7 Calendar Days:</strong> A written refund request is received at <code className="bg-slate-200 px-1 rounded">certification@broadbeach.in</code> within seven (7) calendar days from the date of enrollment.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Minimal Content Consumption:</strong> The learner has accessed less than 25% of the total course video lectures or slide modules.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>No Assessment Attempted:</strong> The learner has NOT started, attempted, or completed the final assessment or received a digital certificate.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Duplicate or Erroneous Payments:</strong> If an external payment channel charged you more than once for the same course enrollment, the duplicate charge will be refunded in full upon verification.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Ineligibility for Refunds */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={22} className="text-amber-600" />
            <span>3. Non-Refundable Circumstances</span>
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>Refunds will NOT be granted under the following circumstances:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
              <li>More than seven (7) calendar days have elapsed since the date of enrollment.</li>
              <li>The learner has accessed 25% or more of the course syllabus modules.</li>
              <li>The final assessment has been accessed, attempted, passed, or failed.</li>
              <li>A digital certificate of achievement has already been generated or verified.</li>
              <li>The enrollment was sponsored through an institutional grant, scholarship, or third-party employer voucher.</li>
              <li>Account termination resulting from violation of our Terms of Service (such as cheating, certificate tampering, or unauthorized redistribution of course materials).</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Refund Request Procedure */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            4. How to Submit a Refund Request
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To submit a cancellation and refund request, email our support desk with the following details:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700 font-mono">
            <div><strong>To:</strong> certification@broadbeach.in</div>
            <div><strong>Subject:</strong> Course Refund Request - [Your Full Name] - [Course Title]</div>
            <div><strong>Required Information:</strong></div>
            <ul className="list-disc list-inside pl-4 text-slate-600 font-sans text-xs">
              <li>Registered account email address.</li>
              <li>Full name as registered on the profile.</li>
              <li>Course title and Course ID / Enrollment ID.</li>
              <li>Proof of transaction (Invoice / Receipt / Voucher copy).</li>
              <li>Clear description of the reason for cancellation.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Processing Timelines */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            5. Processing & Disbursal Timelines
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>5.1 Verification Period:</strong> Once your refund request is
              received, our admissions desk will review your course access logs and
              eligibility within three (3) to five (5) business days.
            </p>
            <p>
              <strong>5.2 Refund Disbursal:</strong> If approved, the refund will be
              credited back to your original source of payment (bank account or card)
              within <strong>seven (7) to ten (10) business days</strong>, subject to
              the standard settlement timelines of banking and payment networks.
            </p>
            <p>
              <strong>5.3 Statutory Rights:</strong> Nothing in this policy is intended
              to restrict or waive your statutory rights under the <strong>Consumer Protection Act, 2019</strong> and applicable consumer dispute regulations.
            </p>
          </div>
        </section>

        {/* Contact and Help */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-blue-200/60 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            6. Support & Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If you have questions regarding the status of a refund or require
            assistance with course cancellation, please contact our support desk:
          </p>
          <div className="text-xs sm:text-sm text-slate-800 space-y-1 font-mono pt-1">
            <div><strong>Email:</strong> certification@broadbeach.in (CC: info@broadbeach.in)</div>
            <div><strong>Helpline:</strong> +91 7338 649 737 (Mon–Fri, 9:00 AM – 6:00 PM IST)</div>
            <div><strong>Entity:</strong> Broadbeach Innovations / Broadbeach Academy, 22nd Floor, World Trade Center, Malleshwaram, Bengaluru, India</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CancellationRefundPolicy;