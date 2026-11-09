import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  Award,
  AlertCircle,
  Scale,
  Ban,
  CheckCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import CookieStorageDisclosure from "../components/common/CookieStorageDisclosure";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <FileText size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Terms & Conditions of Service
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            The legal agreement governing your enrollment, access to study materials,
            examinations, and digital certification issued by Broadbeach Academy.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Governing Law: Republic of India</span>
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
          <span className="text-[#183B73] font-semibold">Terms & Conditions</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        {/* Cookie Preference Storage Disclosure */}
        <CookieStorageDisclosure />

        {/* Core Agreement Card */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#0B315B] flex items-center gap-2">
            <Scale size={22} className="text-[#183B73]" />
            <span>Binding Agreement</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By creating an account, selecting a course, clicking "Start Course" or
            "Enroll Free", or viewing any course materials on broadbeachlearning.com,
            you enter into a legally binding contract with <strong>Broadbeach Innovations</strong> ("Broadbeach Academy", "we", "us", or "our").
            If you do not agree to these Terms and Conditions, do not access or use our services.
          </p>
        </div>

        {/* Section 1: Eligibility and Account Responsibilities */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            1. Eligibility & Learner Accounts
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>1.1 Age of Majority:</strong> You must be at least 18 years
              of age to create an account or enroll in any course independently.
              Minors aged 16 to 17 may access courses solely with the active
              involvement and verified consent of a parent or legal guardian.
            </p>
            <p>
              <strong>1.2 Accurate Information:</strong> You agree to provide true,
              accurate, and complete personal registration details (including legal
              name for certificate generation). Impersonation, falsification of
              prerequisites, or fraudulent profile creation is strictly prohibited.
            </p>
            <p>
              <strong>1.3 Account Security:</strong> Your student account is strictly
              individual and non-transferable. You are solely responsible for maintaining
              the confidentiality of your password and credentials. You must immediately
              notify us at{" "}
              <a href="mailto:certification@broadbeach.in" className="text-blue-600 underline">
                certification@broadbeach.in
              </a>{" "}
              if you suspect unauthorized access.
            </p>
          </div>
        </section>

        {/* Section 2: Course Access and Intellectual Property */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            2. Intellectual Property & Limited Educational License
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>2.1 Proprietary Materials:</strong> All training videos,
              downloadable slide decks (PDFs), curriculum outlines, assessment questions,
              diagrams, software code, and graphics are the exclusive intellectual
              property of Broadbeach Innovations or its licensors and are protected
              under the <strong>Indian Copyright Act, 1957</strong> and international copyright treaties.
            </p>
            <p>
              <strong>2.2 Limited License:</strong> Broadbeach Academy grants you a
              limited, personal, non-exclusive, non-transferable, revocable license to
              view and stream course content for your individual professional education.
            </p>
            <p>
              <strong>2.3 Strict Prohibitions:</strong> You may not:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Copy, reproduce, distribute, republish, sell, rent, or publicly display any course materials.</li>
              <li>Use our materials to conduct your own commercial training sessions or develop competing courses.</li>
              <li>Scrape, extract, reverse engineer, or download videos via automated tools, bots, or browser extensions.</li>
              <li>Share assessment questions, answer keys, or exam solutions with third parties or online platforms.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Certificate Issuance and Accreditation Clarification */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2">
            <Award size={24} className="text-[#183B73]" />
            <span>3. Certificate Recognition, Scope & Integrity</span>
          </h2>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed space-y-2">
            <strong className="block text-amber-950 font-bold">
              IMPORTANT DISCLOSURE REGARDING CERTIFICATE RECOGNITION:
            </strong>
            <p>
              Certificates awarded by Broadbeach Academy attest to course completion
              and verified knowledge acquisition through our assessment framework.
              While our curriculum aligns with international standards (such as ISO 19011
              and ISO/IEC 17024 competency guidelines), a certificate of achievement
              issued by Broadbeach Academy does <strong>not</strong> by itself constitute:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>A statutory government license or formal license to practice.</li>
              <li>Formal lead auditor registration with external bodies (such as IRCA/CQI) unless explicitly certified through a designated accredited partnership scheme.</li>
              <li>An authorization or accreditation to certify other commercial enterprises or issue third-party ISO conformity certificates.</li>
            </ul>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
            <p>
              <strong>3.1 Assessment Requirements:</strong> Certificates are issued
              only upon meeting the passing score (typically 70% or higher) in the
              corresponding final assessment. Enrollment alone does not guarantee a certificate.
            </p>
            <p>
              <strong>3.2 Anti-Fraud & Authenticity:</strong> Each digital certificate
              carries a unique verification identifier accessible via our verification portal (<code className="bg-slate-100 px-1 rounded">/verify-certificate</code>). Altering, forging, modifying, or misrepresenting certificate credentials is a criminal offense and grounds for immediate credential revocation and legal action.
            </p>
          </div>
        </section>

        {/* Section 4: Fees, Coupons, and Refunds */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            4. Course Pricing, Vouchers & Payment Model
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>4.1 Free Foundation Courses:</strong> Foundational awareness
              certifications are provided at zero cost under grant-sponsored and educational
              initiatives. No credit card is required.
            </p>
            <p>
              <strong>4.2 Paid Certifications & Corporate Vouchers:</strong> Paid
              professional programs utilize coupon/voucher code verification or external
              corporate invoicing. Our web frontend does not directly capture or store
              payment card data.
            </p>
            <p>
              <strong>4.3 Cancellation & Refunds:</strong> For full details regarding
              cancellations and refund procedures, refer to our{" "}
              <Link to="/cancellation-refund-policy" className="text-blue-600 font-bold underline">
                Cancellation & Refund Policy
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            5. Limitation of Liability & Disclaimers
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>5.1 "As Is" Basis:</strong> To the maximum extent permitted
              by the <strong>Consumer Protection Act, 2019</strong>, all educational
              services, course materials, and learning portals are provided "as is"
              and "as available" without warranties of any kind, whether express or implied.
            </p>
            <p>
              <strong>5.2 Consequential Damages:</strong> Broadbeach Innovations shall
              not be liable for indirect, incidental, special, consequential, or punitive
              damages, including loss of profits, employment opportunities, business
              reputation, or data loss arising from your participation in courses.
            </p>
            <p>
              <strong>5.3 Aggregate Liability Cap:</strong> In any event, our total
              aggregate liability to you for all claims arising out of your use of the
              platform shall not exceed the amount actually paid by you for the specific
              course in dispute, or INR 1,000 (one thousand Indian Rupees), whichever is greater.
            </p>
            <p className="text-xs text-slate-500 italic">
              * Nothing in these Terms shall limit or exclude any liability that cannot
              be legally limited or excluded under applicable consumer protection legislation.
            </p>
          </div>
        </section>

        {/* Section 6: Termination and Governing Law */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            6. Governing Law & Dispute Resolution
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>6.1 Applicable Law:</strong> These Terms and any dispute or
              claim arising out of or in connection with them shall be governed by
              and construed in accordance with the substantive laws of the{" "}
              <strong>Republic of India</strong>.
            </p>
            <p>
              <strong>6.2 Exclusive Jurisdiction:</strong> Subject to mandatory
              consumer grievance provisions under the Consumer Protection Act, 2019,
              the competent courts located in <strong>Bengaluru, Karnataka, India</strong> shall have exclusive jurisdiction over all disputes.
            </p>
            <p>
              <strong>6.3 Modifications to Terms:</strong> We reserve the right to
              modify these Terms at any time. Changes will be posted to this page
              with an updated version and effective date. Continued use of the platform
              constitutes your acceptance of the revised terms.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-blue-200/60 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            7. Contact & Official Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For questions regarding these Terms, contact our compliance team:
          </p>
          <div className="text-xs sm:text-sm text-slate-800 space-y-1 pt-1 font-mono">
            <div><strong>Entity:</strong> Broadbeach Innovations / Broadbeach Academy</div>
            <div><strong>Email:</strong> info@broadbeach.in</div>
            <div><strong>Helpline:</strong> +91 7338 649 737</div>
            <div><strong>Location:</strong> 22nd Floor, World Trade Center, 26/1, Dr Rajkumar Rd, Malleshwaram, Bengaluru, Karnataka 560055, India</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsAndConditions;