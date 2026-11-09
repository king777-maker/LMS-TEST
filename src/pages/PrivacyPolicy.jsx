import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Database,
  FileText,
  AlertTriangle,
  Mail,
  ChevronRight,
  HelpCircle,
  Clock,
  Globe
} from "lucide-react";
import CookieStorageDisclosure from "../components/common/CookieStorageDisclosure";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <Lock size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            How Broadbeach Academy collects, processes, protects, and respects your
            personal data under the Digital Personal Data Protection Act, 2023 (India)
            and international privacy standards.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: October 16, 2026</span>
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
          <span className="text-[#183B73] font-semibold">Privacy Policy</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        {/* Cookie and Privacy Preference Storage Disclosure */}
        <CookieStorageDisclosure />

        {/* Executive Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#131E4A] flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-600" />
            <span>Executive Privacy Summary</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Broadbeach Academy operates as an online learning and certification
            platform. We only collect the personal data necessary to register your
            student account, deliver self-paced course modules, administer knowledge
            assessments, and issue verifiable digital credentials. We do not sell
            your personal information, do not deploy behavioral ad trackers, and
            provide straightforward mechanisms for data access, correction, and
            deletion.
          </p>
        </div>

        {/* Section 1: Legal Identity & Scope */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            1. Identity of the Data Fiduciary
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This website (<code className="bg-slate-100 px-1 rounded">broadbeach.in</code>) is operated by:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1.5 font-mono">
            <div><strong>Entity Brand:</strong> Broadbeach Academy / Broadbeach Innovations</div>
            <div><strong>Principal Location:</strong> 22nd Floor, World Trade Center, 26/1, Dr Rajkumar Rd, Malleshwaram, Bengaluru, Karnataka 560055, India</div>
            <div><strong>Support & Privacy Desk:</strong> info@broadbeach.in (Certification: certification@broadbeach.in)</div>
            <div><strong>Telephone / WhatsApp:</strong> +91 7338 649 737</div>
            <div className="text-slate-500 text-[11px] pt-1">
              Registered Office: 22nd Floor, World Trade Center, 26/1, Dr Rajkumar Rd, Malleshwaram, Bengaluru, Karnataka 560055, India
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For the purposes of the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, Broadbeach Innovations acts as the <strong>Data Fiduciary</strong> responsible for determining the purposes and means of processing your personal data.
          </p>
        </section>

        {/* Section 2: Categories of Personal Data Collected */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            2. Personal Data We Collect and How We Collect It
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We collect personal data directly from you when you register, enroll in
            courses, interact with training material, and contact support:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-xs sm:text-sm space-y-1">
              <strong className="text-slate-800">A. Account & Profile Data:</strong>
              <p className="text-slate-600">
                Full name (first and last name), date of birth, email address, contact
                phone number, physical/postal address, city, state, postal code, and
                nationality submitted during student registration.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-xs sm:text-sm space-y-1">
              <strong className="text-slate-800">B. Professional Background (Optional):</strong>
              <p className="text-slate-600">
                Total professional experience, highest educational qualification, current job
                designation, and employer/organization name to tailor advanced lead auditor and aerospace programs.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-xs sm:text-sm space-y-1">
              <strong className="text-slate-800">C. Learning Progress & Certification Data:</strong>
              <p className="text-slate-600">
                Course enrollment history, lesson completion timestamps, quiz and assessment
                scores, certificate generation records, and unique QR verification identifiers (e.g. <code className="bg-slate-200 px-1 rounded">BB-VERIFIED-2026</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-xs sm:text-sm space-y-1">
              <strong className="text-slate-800">D. Technical & Session Data:</strong>
              <p className="text-slate-600">
                Authentication session cookies (<code className="bg-slate-200 px-1 rounded">PHPSESSID</code>), IP address transmitted to our web server, browser user-agent, and local storage state (<code className="bg-slate-200 px-1 rounded">bb_user</code>, <code className="bg-slate-200 px-1 rounded">bb_enrolled_courses</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-xs sm:text-sm space-y-1">
              <strong className="text-slate-800">E. Payment Information:</strong>
              <p className="text-slate-600">
                <strong>No direct credit or debit card data is stored or processed on this website.</strong> Foundation programs are 100% grant-sponsored, and paid certifications utilize corporate voucher codes (<code className="bg-slate-200 px-1 rounded">redeem-course-coupon</code>) or external invoicing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Purposes and Legal Grounds */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            3. Purposes of Processing and Legal Grounds
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-800 font-bold">
                  <th className="p-3">Processing Activity</th>
                  <th className="p-3">Data Used</th>
                  <th className="p-3">Lawful Basis (DPDP Act & Applicable Law)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-medium text-slate-800">Account creation & LMS login</td>
                  <td className="p-3">Name, email, password hash</td>
                  <td className="p-3">Contractual necessity to provide LMS services</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">Course enrollment & lesson delivery</td>
                  <td className="p-3">Course IDs, enrollment date</td>
                  <td className="p-3">Performance of educational service</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">Exam evaluation & certificate issuance</td>
                  <td className="p-3">Quiz answers, score, learner name</td>
                  <td className="p-3">Legitimate educational accreditation & learner consent</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">Certificate public verification</td>
                  <td className="p-3">Certificate ID, issue date, credential title</td>
                  <td className="p-3">Legitimate interest in fraud prevention and credential authenticity</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">Customer support & ticket handling</td>
                  <td className="p-3">Email, phone, inquiry text</td>
                  <td className="p-3">Legitimate customer service communication</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Data Principal Rights under DPDP Act */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            4. Your Rights under the Digital Personal Data Protection Act, 2023
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            As a Data Principal in India, you are endowed with statutory rights:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-800">A. Right to Access Information</h3>
              <p className="text-slate-600">
                You have the right to request a summary of the personal data we hold about you and identities of third parties with whom it has been shared.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-800">B. Right to Correction & Erasure</h3>
              <p className="text-slate-600">
                You can correct inaccurate details or request complete erasure of your account and learning records, subject to statutory retention limits.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-800">C. Right of Grievance Redressal</h3>
              <p className="text-slate-600">
                You have the right to submit a formal grievance to our designated Grievance Officer and receive an expeditious response.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-800">D. Right to Nominate</h3>
              <p className="text-slate-600">
                You have the right to nominate an individual who will exercise your privacy rights in the event of death or incapacity.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:certification@broadbeach.in" className="text-[#183B73] font-bold underline">
              certification@broadbeach.in
            </a>
            . We will verify your identity and respond within the statutory timeframe (typically within 30 days).
          </p>
        </section>

        {/* Section 5: Children's Personal Data */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2">
            <AlertTriangle size={22} className="text-amber-600" />
            <span>5. Protection of Children’s Personal Data</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In compliance with <strong>Section 9 of the DPDP Act, 2023</strong>, Broadbeach Academy does not knowingly process personal data belonging to individuals under the age of 18 without verifiable consent from their parent or lawful guardian.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We do not engage in behavioral monitoring, targeted advertising, or profiling of minors, nor do we deploy any processing likely to cause a detrimental effect on the well-being of a child. If we discover that a user under 18 has registered without parental authorization, we will promptly delete the account.
          </p>
        </section>

        {/* Section 6: Third-Party Processors & Data Sharing */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            6. Third-Party Service Providers and Cross-Border Transfers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We only share minimal personal data with vetted service providers who assist in operating the platform:
          </p>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>
              <strong>Hosting & API Infrastructure:</strong> Remote Linux/PHP hosting infrastructure managed through CADAC (<code className="bg-slate-100 px-1 rounded">cadac.in</code>).
            </li>
            <li>
              <strong>Video Delivery:</strong> Google LLC / YouTube via privacy-enhanced embedding (<code className="bg-slate-100 px-1 rounded">youtube-nocookie.com</code>).
            </li>
            <li>
              <strong>Web Typography:</strong> Google Fonts CDN for system typography.
            </li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Any international transmission of data complies with the provisions of Section 16 of the DPDP Act and relevant regulatory cross-border transfer frameworks.
          </p>
        </section>

        {/* Section 7: Data Retention and Security Measures */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            7. Data Security and Retention Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We implement reasonable organizational and technical security measures in line with Rule 8 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011:
          </p>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>Secure Socket Layer (SSL/TLS) encryption for all web communication.</li>
            <li>Cryptographic password hashing.</li>
            <li>Session isolation and restricted API database access.</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            <strong>Retention:</strong> Student enrollment records and certificate records are retained for as long as your account remains active or as required by educational auditing standards to substantiate verifiable certificate inquiries. You may request account deletion at any time.
          </p>
        </section>

        {/* Section 8: Grievance Officer and Contact */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-blue-200/60 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            8. Grievance Redressal Officer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In compliance with Section 8(9) of the DPDP Act, 2023, and Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021, the designated Grievance Officer is:
          </p>
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1">
            <div><strong>Department:</strong> Compliance & Data Protection Grievance Desk</div>
            <div><strong>Organization:</strong> Broadbeach Innovations / Broadbeach Academy</div>
            <div><strong>Email:</strong> <a href="mailto:info@broadbeach.in" className="text-blue-600 font-bold hover:underline">info@broadbeach.in</a> / <a href="mailto:certification@broadbeach.in" className="text-blue-600 font-bold hover:underline">certification@broadbeach.in</a></div>
            <div><strong>Phone / Helpline:</strong> +91 7338 649 737</div>
            <div><strong>Address:</strong> 22nd Floor, World Trade Center, 26/1, Dr Rajkumar Rd, Malleshwaram, Bengaluru, Karnataka 560055, India</div>
            <div className="text-slate-500 text-[11px] pt-1">
              [Requires Business Confirmation: Exact Name and Designation of Designated Individual Grievance Officer].
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Complaints will be acknowledged within 48 hours and disposed of within thirty (30) days from the date of receipt.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;