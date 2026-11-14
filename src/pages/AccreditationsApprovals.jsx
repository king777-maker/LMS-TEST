import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaAward,
  FaShieldAlt,
  FaCertificate,
  FaCheckCircle,
  FaSearch,
  FaFileContract,
  FaLaptopCode,
  FaGlobe,
  FaUniversity,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaUserCheck,
  FaSyncAlt,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Accreditations & Approvals Page — Broadbeach Academy
 * Completely Redesigned to provide an authoritative, institutional, and transparent
 * overview of our quality benchmarks, recognized ISO standards, online verification,
 * academic governance, and accreditation FAQ.
 */
const AccreditationsApprovals = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const keyStandards = [
    {
      icon: <FaAward />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "ISO 9001:2015 Quality Management Systems (QMS)",
      subtitle: "Lead Auditor & Internal Auditor Tracks",
      description:
        "Comprehensive training on the Plan-Do-Check-Act (PDCA) cycle, risk-based thinking, non-conformity documentation, and third-party audit execution according to ISO 19011 specifications.",
      badge: "ISO 9001",
      badgeColor: "blue",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "ISO 14001:2015 Environmental Management (EMS)",
      subtitle: "Sustainability & Compliance Auditing",
      description:
        "Environmental aspect and impact evaluation, lifecycle perspective, statutory compliance registers, and industrial environmental performance audit methodologies.",
      badge: "ISO 14001",
      badgeColor: "green",
    },
    {
      icon: <FaCertificate />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "ISO 45001:2018 Occupational Health & Safety (OH&S)",
      subtitle: "Workplace Hazard & Safety Governance",
      description:
        "Hazard identification, risk control hierarchies, worker consultation frameworks, incident root-cause investigation, and proactive legal safety audit compliance.",
      badge: "ISO 45001",
      badgeColor: "orange",
    },
    {
      icon: <FaLaptopCode />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "ISO 27001:2022 Information Security Management (ISMS)",
      subtitle: "Cybersecurity & Data Privacy Governance",
      description:
        "Annex A information security controls, threat risk assessment models, incident response auditing, cloud privacy protection, and GDPR compliance verification.",
      badge: "ISO 27001",
      badgeColor: "navy",
    },
    {
      icon: <FaFileContract />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "ISO 19011:2018 Guidelines for Auditing",
      subtitle: "The Global Auditor Gold Standard",
      description:
        "The definitive international standard establishing principles of auditing, managing comprehensive audit programs, gathering objective evidence, and leading closing meetings.",
      badge: "ISO 19011",
      badgeColor: "amber",
    },
    {
      icon: <FaGlobe />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Lean Six Sigma (Yellow, Green & Black Belt)",
      subtitle: "Statistical Process & Quality Control",
      description:
        "DMAIC methodologies, root cause failure analysis, statistical quality tools, variance reduction, and continuous organizational Kaizen improvement frameworks.",
      badge: "Six Sigma",
      badgeColor: "blue",
    },
  ];

  const qualityPillars = [
    {
      icon: <FaUserCheck />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Certified Lead Auditor Instructors",
      subtitle: "Verified Faculty Expertise",
      description:
        "Every course is authored and overseen by senior Lead Auditors possessing at least a decade of active, third-party field auditing experience across global industries.",
    },
    {
      icon: <FaLock />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Tamper-Proof Credential Security",
      subtitle: "Anti-Fraud Architecture",
      description:
        "Each certificate features an encrypted unique serial number, tamper-proof digital styling, and real-time database validation accessible to prospective employers worldwide.",
    },
    {
      icon: <FaSyncAlt />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Annual Regulatory Synchronization",
      subtitle: "Continuous Curriculum Updates",
      description:
        "Our academic board performs quarterly reviews to synchronize all instructional materials with newly published ISO revisions, guidance clauses, and statutory mandates.",
    },
    {
      icon: <FaUniversity />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Global Employer Acceptance",
      subtitle: "International Reciprocity",
      description:
        "Structured in accordance with international qualification frameworks, our certifications are trusted by corporate hiring directors and registrars across 45+ nations.",
    },
  ];

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
      a: "Yes. Our courses are structured strictly in alignment with international standard specifications (ISO 9001, ISO 14001, ISO 45001, ISO 27001, and ISO 19011 guidelines). Our graduates work across 45+ countries, and our credentials are respected by corporate employers, third-party audit teams, and industrial certification bodies.",
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
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Accreditations & Approvals:"
        highlight="Rigorous Quality Benchmarks"
        description="Every Broadbeach Academy program is engineered in strict alignment with international ISO quality, environmental, safety, and auditing specifications."
        breadcrumbs={[{ label: "Accreditations & Approvals" }]}
      />

      {/* 2. TRUST STATS RIBBON */}
      <section className="bg-[#0F1E36] py-10 text-white border-b border-white/10">
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
                45+
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

      {/* 3. SPLIT-SCREEN 50/50: ACCREDITATION FRAMEWORK (Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="ACADEMIC RIGOR & GOVERNANCE"
        eyebrowColor="blue"
        eyebrowIcon={<FaShieldAlt className="text-xs text-[#2563EB]" />}
        title="Engineered In Strict Conformance"
        highlightText="With International Standards."
        paragraphs={[
          "Broadbeach Online Academy does not invent hypothetical curriculum models. Our programs are engineered in direct accordance with published ISO directives and international audit methodologies.",
          "Whether enrolling in ISO 9001 Quality Management, ISO 14001 Environmental Protection, ISO 45001 Occupational Safety, or ISO 27001 Information Security, learners acquire the exact competencies required by certifying bodies, accredited registrars, and corporate employers.",
        ]}
        bullets={[
          { text: "Curricula mapped clause-by-clause to official standard requirements" },
          { text: "Practical audit simulation scenarios guided by ISO 19011:2018" },
          { text: "Verifiable credentials that withstand third-party employer scrutiny" },
        ]}
        imageSrc="/assets/certificate/certificate-template.png"
        imageAlt="Broadbeach Academy Official Accredited Certificate"
        imagePosition="right"
        floatingBadge={{
          title: "ACCREDITED RIGOR",
          subtitle: "Standardized Certificate Protocol",
          icon: <FaAward />,
        }}
        ctaPrimary={{ label: "Verify a Certificate", to: "/categories/verify-certificate" }}
        ctaSecondary={{ label: "Explore Courses", to: "/course" }}
        bgColor="white"
      />

      {/* 4. APPROVED STANDARDS FRAMEWORKS (Media Object Cards Grid) */}
      <section className="bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Standard Specifications</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-[#121C46] leading-tight">
              Primary Accreditations &amp; Standards Covered
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base lg:text-[16.5px] leading-relaxed">
              Explore the core international standard frameworks integrated across our Lead Auditor, Internal Auditor, and Continuous Improvement pathways.
            </p>
          </div>

          {/* 3-Column Grid of Standards Media Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {keyStandards.map((std, index) => (
              <AboutMediaObject
                key={index}
                icon={std.icon}
                iconColor={std.iconColor}
                iconBg={std.iconBg}
                title={std.title}
                subtitle={std.subtitle}
                description={std.description}
                badge={std.badge}
                badgeColor={std.badgeColor}
                variant="card"
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. SPLIT-SCREEN 50/50: INSTANT VERIFICATION INTEGRITY (Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="CREDENTIAL PROTECTION"
        eyebrowColor="orange"
        title="Guaranteed Authenticity Via"
        highlightText="Instant Digital Verification"
        paragraphs={[
          "In today's competitive employment market, corporate recruiters and audit directors demand immediate proof that an applicant's credentials are genuine and uncompromised.",
          "Broadbeach Online Academy maintains an authoritative public registry. Every completion certificate is assigned an encrypted registration key that can be validated globally within seconds, providing employers with 100% confidence.",
        ]}
        bullets={[
          { text: "Encrypted registration identifier permanently issued per graduate" },
          { text: "Public 24/7 web validation tool accessible from any device" },
          { text: "Full protection against credential counterfeiting or alteration" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Online Credential Authentication"
        imagePosition="left"
        floatingBadge={{
          title: "ONLINE VERIFICATION",
          subtitle: "Instant Employer Authentication",
          icon: <FaSearch />,
        }}
        ctaPrimary={{ label: "Launch Verification Tool", to: "/categories/verify-certificate" }}
        bgColor="white"
      />

      {/* 6. MEDIA OBJECT: 3-STEP VERIFICATION PROCEDURE */}
      <section className="bg-[#F8FAFC] py-14 sm:py-16 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Three-Step Credential Verification Process
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              How employers, third-party audit registrars, and government institutions verify certificate authenticity.
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

      {/* 7. ACADEMIC GOVERNANCE & ETHICAL CHARTER */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>Institutional Policy</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#121C46] leading-tight">
              Academic Governance &amp; Quality Charter
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              The four foundational pillars ensuring our credentials retain premier status worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {qualityPillars.map((qp, idx) => (
              <AboutMediaObject
                key={idx}
                icon={qp.icon}
                iconColor={qp.iconColor}
                iconBg={qp.iconBg}
                title={qp.title}
                subtitle={qp.subtitle}
                description={qp.description}
                variant="card"
              />
            ))}
          </div>

        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (ACCREDITATION FAQ) */}
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
