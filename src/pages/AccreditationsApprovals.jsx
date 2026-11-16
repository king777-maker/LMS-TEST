import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCertificate,
  FaCheckCircle,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
} from "react-icons/fa";
import AboutBranchHero from "../components/AboutShared/AboutBranchHero";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";
import InstitutionalCertificates from "../components/AboutUs/InstitutionalCertificates";

/**
 * Accreditations & Approvals Page — Broadbeach Academy
 * Features:
 * 1. Branch Hero & Trust Statistics Ribbon
 * 2. Official Institutional Certifications (ISO 9001:2015, ISO 21001:2018, CAGE Code, DGFT IEC)
 * 3. Three-Step Credential Verification Process
 * 4. Accreditation & Recognition FAQ
 */
const AccreditationsApprovals = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const verificationSteps = [
    {
      icon: <FaCertificate />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "1. Unique Serial Identifier",
      subtitle: "Encrypted Certificate ID",
      description:
        "Upon successful completion and exam clearance, an immutable registration key is generated and permanently embedded on the official certificate.",
    },
    {
      icon: <FaSearch />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "2. Instant Online Lookup",
      subtitle: "Available 24/7 Worldwide",
      description:
        "Employers, clients, or registrars visit our public verification registry and input the certificate key or scan the official verification QR code.",
    },
    {
      icon: <FaCheckCircle />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "3. Direct Record Confirmation",
      subtitle: "Complete Academic Record",
      description:
        "The system immediately returns the graduate's full name, verified course track, completion date, and academic accreditation status.",
    },
  ];

  const faqs = [
    {
      q: "Are Broadbeach Academy certifications recognized internationally?",
      a: "Yes. Broadbeach Innovations holds ISO 9001:2015 (Quality Management System) accredited via KAB / IAF MLA, ISO 21001:2018 (Educational Organizations Management System) registered with DAAS London, U.S. DoD CAGE Code 4378Y, and Government of India DGFT IEC AERPL5690L. Our curriculum strictly aligns with ISO 19011 auditing protocols, and our graduates work across 93+ countries.",
    },
    {
      q: "How can an employer or registrar verify my certification?",
      a: "Every certificate issued by Broadbeach Online Academy carries an encrypted unique serial number. Employers can verify certificate authenticity in seconds by entering the ID into our public verification portal at broadbeach.in or by scanning the certificate verification QR code.",
    },
    {
      q: "What credentials and qualifications do course instructors hold?",
      a: "All course curriculum authors and academic mentors are certified ISO Lead Auditors with active third-party field auditing experience. They possess over a decade of hands-on compliance leadership in manufacturing, aerospace, healthcare, energy, and information technology.",
    },
    {
      q: "Does this certification qualify me to participate in or lead audits?",
      a: "Our Lead Auditor and Internal Auditor tracks cover complete auditing protocols as defined by ISO 19011:2018. Learners gain practical proficiency in opening meetings, gathering evidence, classifying non-conformities, writing audit reports, and presenting closing findings.",
    },
    {
      q: "Do Broadbeach Academy certificates expire?",
      a: "Our certificates of completion confirm your mastery of the specific edition of the standard studied (e.g., ISO 9001:2015). They do not expire; however, when international bodies release major new revisions of a standard, we offer streamlined transition refresher modules.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. BRANCH HERO */}
      <AboutBranchHero
        type="approvals"
        eyebrow="International Compliance"
        eyebrowColor="emerald"
        title="Accreditations &"
        highlight="Approved Standards."
        description="Broadbeach Innovations is officially certified under ISO 9001:2015 (QMS), ISO 21001:2018 (Educational Organizations), U.S. DoD CAGE Program, and Government of India DGFT."
        breadcrumbs={[{ label: "Our Approvals" }]}
        chips={[
          { text: "ISO 9001:2015 & ISO 21001:2018" },
          { text: "U.S. DoD CAGE Code: 4378Y" },
          { text: "24/7 QR Verification Registry" },
        ]}
        primaryCta={{ label: "Verify a Certificate", to: "/verify-certificate" }}
        secondaryCta={{ label: "Explore ISO Tracks", to: "/courses" }}
      />

      {/* 2. TRUST STATS RIBBON */}
      <section className="bg-[#131E4A] py-10 text-white border-b border-white/10">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FFDB58]">
                100%
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                ISO Standard Harmonization
              </div>
            </div>

            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                93+
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                Countries Accepting Credentials
              </div>
            </div>

            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FFDB58]">
                24/7
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                Instant Online Verification
              </div>
            </div>

            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                10+ Yrs
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                Academic &amp; Industry Excellence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL INSTITUTIONAL CERTIFICATIONS (Replaces the 4 removed theoretical sections) */}
      <InstitutionalCertificates />

      {/* 4. THREE-STEP CREDENTIAL VERIFICATION PROCEDURE */}
      <section className="bg-white py-14 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Three-Step Credential Verification Process
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              How employers, third-party audit registrars, and government institutions verify student certificate authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {verificationSteps.map((step, idx) => (
              <AboutMediaObject
                key={idx}
                icon={step.icon}
                iconColor={step.iconColor}
                iconBg={step.iconBg}
                title={step.title}
                subtitle={step.subtitle}
                description={step.description}
                variant="card"
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (ACCREDITATION FAQ) */}
      <section className="bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Learner Answers</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#121C46] leading-tight">
              Accreditation &amp; Recognition FAQ
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              Common questions answered regarding course recognition, verification, and audit qualifications.
            </p>
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-[#121C46] text-base sm:text-lg hover:text-[#2563EB] transition-colors cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#2563EB] shrink-0 text-sm">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed border-t border-[#F1F5F9]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Support Note */}
          <div className="mt-10 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-center">
            <p className="text-xs sm:text-sm text-[#475569]">
              Have specific corporate compliance or institutional accreditation questions?{" "}
              <Link
                to="/contact-us"
                className="text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Contact Academic Admissions</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
};

export default AccreditationsApprovals;
