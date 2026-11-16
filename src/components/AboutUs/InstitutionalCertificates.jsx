import React, { useState, useEffect } from "react";
import {
  FaAward,
  FaShieldAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaSearchPlus,
  FaTimes,
  FaFileAlt,
  FaBuilding,
  FaCalendarAlt,
  FaPassport,
  FaGlobe
} from "react-icons/fa";

export const INSTITUTIONAL_CERTIFICATES = [
  {
    id: "iso-9001",
    title: "ISO 9001:2015",
    subtitle: "Quality Management System (QMS)",
    category: "International Standard",
    badge: "IAF MLA & KAB Accredited",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    entity: "BROADBEACH INNOVATIONS",
    certNumber: "QSR/QB/2510189731",
    accreditationCode: "KAB-QC-88",
    issuer: "QSR Assessment Private Limited",
    accreditationBoard: "Korea Accreditation Board (KAB) — Member of IAF MLA",
    issuedDate: "31-10-2025",
    expiryDate: "30-10-2028",
    verifyUrl: "https://www.qsrcerti.com",
    verifyDomain: "qsrcerti.com",
    image: "/certificates/iso_9001_certificate.png",
    summary:
      "Certified Quality Management System covering professional training and certification in Quality, Business, ISO Internal & Lead Auditing, Lean Six Sigma, Food Safety, Energy, Information Security, Aerospace, and Educational Management.",
    scopeBullets: [
      "Professional ISO Internal & Lead Auditor Training",
      "Lean Six Sigma (Yellow, Green, Black & Master Black Belt)",
      "Food Safety, Energy, IT, Information Security & FOD",
      "Aerospace, Aviation, Automotive, and Educational Management",
      "Business Consulting and Professional Contracting"
    ]
  },
  {
    id: "iso-21001",
    title: "ISO 21001:2018",
    subtitle: "Educational Organizations Management System (EOMS)",
    category: "Educational Standard",
    badge: "DAAS (London, UK) & QVR Registered",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    entity: "BROADBEACH INNOVATIONS",
    certNumber: "DAAS-BRI-001368",
    accreditationCode: "CAB # 36064",
    issuer: "Quality Verification Registrar (QVR)",
    accreditationBoard: "Directorate of Akkreditering Assessment Services Limited (London, UK)",
    issuedDate: "07-Nov-2026",
    expiryDate: "06-Nov-2029",
    registeredOffice: "#2201A, 22nd Floor, World Trade Center, Bengaluru 560055",
    verifyUrl: "https://www.daasaccreditation.org",
    verifyDomain: "daasaccreditation.org",
    image: "/certificates/iso_21001_certificate.png",
    summary:
      "Specifically engineered for Educational Organizations, certifying the highest standards of instructional design, learner assessment, curriculum governance, and academic consulting.",
    scopeBullets: [
      "Professional Training & Certification in Quality & Business Management",
      "ISO Auditing Protocols conforming to ISO 19011 specifications",
      "Certified Construction, IT, Information Security & FOD Programs",
      "Industry-Specific Aerospace & Automotive Curriculum",
      "Consulting & Counselling Services for Educational Organizations"
    ]
  },
  {
    id: "cage",
    title: "CAGE Program Registration",
    subtitle: "Commercial and Government Entity (U.S. DoD)",
    category: "Defense & Government",
    badge: "U.S. Department of Defense / DLA",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    entity: "BROADBEACH INNOVATIONS",
    certNumber: "4378Y",
    accreditationCode: "SSN05A-HQ0339",
    issuer: "Defense Logistics Agency (DLA) Logistics Information Services",
    accreditationBoard: "U.S. Commercial and Government Entity Program",
    issuedDate: "10/09/2021",
    expiryDate: "Active Service Provider",
    registeredOffice: "005 Lakven Homes, Whitefield, Bangalore, Karnataka 560036",
    verifyUrl: "https://www.broadbeach.in",
    verifyDomain: "dla.mil / cage",
    image: "/certificates/cage_certificate.png",
    summary:
      "Officially assigned Commercial and Government Entity (CAGE) Code 4378Y for Broadbeach Innovations, facilitating corporate compliance, international trade, and bilateral contracting.",
    scopeBullets: [
      "Commercial and Government Entity Code: 4378Y",
      "Verified Active Service Provider Status",
      "Defense Logistics Agency (DLA) Catalogued",
      "Facilitates international corporate partnerships & institutional vendor status"
    ]
  },
  {
    id: "dgft-iec",
    title: "Government of India — IEC",
    subtitle: "Directorate General of Foreign Trade (DGFT)",
    category: "Statutory License",
    badge: "Ministry of Commerce & Industry, GoI",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    entity: "BROADBEACH INNOVATIONS",
    certNumber: "AERPL5690L",
    accreditationCode: "PAN: AERPL5690L",
    issuer: "Office of the Additional Director General of Foreign Trade, Bengaluru",
    accreditationBoard: "Directorate General of Foreign Trade (DGFT)",
    issuedDate: "10/02/2020",
    expiryDate: "Perpetual / Active",
    registeredOffice: "Flat No 005, Lakven Homes, Bengaluru 560036, Karnataka",
    verifyUrl: "https://dgft.gov.in",
    verifyDomain: "dgft.gov.in",
    image: "/certificates/dgft_iec_certificate.png",
    summary:
      "Statutory Importer-Exporter Code (IEC) issued by the Directorate General of Foreign Trade, Government of India, enabling global export of educational programs and digital certifications.",
    scopeBullets: [
      "Importer-Exporter Code (IEC): AERPL5690L",
      "Ministry of Commerce and Industry, Government of India Authorized",
      "File Reference: BNGIECPAMEND00001975AM23",
      "Official QR Code & Online Verification via dgft.gov.in"
    ]
  }
];

export default function InstitutionalCertificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [expandedScope, setExpandedScope] = useState({});

  const toggleScope = (id) => {
    setExpandedScope((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard navigation to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CBD5E1] text-[#121C46] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Official Institutional Credentials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121C46] tracking-tight leading-tight">
            Accreditations &amp; Institutional Certifications
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-[#475569] leading-relaxed">
            Broadbeach Innovations is officially certified and recognized by premier international accreditation bodies, the U.S. Department of Defense, and the Government of India.
          </p>
        </div>

        {/* 4 CERTIFICATES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {INSTITUTIONAL_CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-[#CBD5E1] hover:border-[#94A3B8] shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* TOP: CERTIFICATE PREVIEW & METADATA */}
              <div className="p-5 sm:p-6 lg:p-7">
                {/* Header Badge & Category */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cert.badgeColor}`}
                  >
                    <FaCheckCircle className="text-xs" />
                    <span>{cert.badge}</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    {cert.category}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-[#121C46] leading-tight">
                  {cert.title}
                </h3>
                <p className="text-sm font-semibold text-[#2563EB] mt-0.5">
                  {cert.subtitle}
                </p>

                {/* Split Content: Preview Thumbnail & Credential Details */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-5 items-start">
                  
                  {/* Thumbnail with Hover Zoom */}
                  <div
                    onClick={() => setSelectedCert(cert)}
                    className="sm:col-span-5 relative group rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-100 cursor-pointer shadow-xs aspect-[1/1.4] flex items-center justify-center"
                  >
                    <img
                      src={cert.image}
                      alt={`${cert.title} Certificate`}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#121C46]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white p-2 text-center">
                      <FaSearchPlus className="text-2xl text-[#FFDB58]" />
                      <span className="text-xs font-bold tracking-wide">
                        Click to Inspect
                      </span>
                    </div>
                  </div>

                  {/* Metadata Specs */}
                  <div className="sm:col-span-7 space-y-2.5 text-xs text-[#334155]">
                    <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                        Certificate Number
                      </div>
                      <div className="font-mono font-black text-sm text-[#121C46] break-all">
                        {cert.certNumber}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-[#121C46]">Certified Entity: </span>
                      <span className="font-semibold text-[#0F172A]">{cert.entity}</span>
                    </div>

                    <div>
                      <span className="font-bold text-[#121C46]">Issuing Body: </span>
                      <span>{cert.issuer}</span>
                    </div>

                    <div>
                      <span className="font-bold text-[#121C46]">Accreditation Board: </span>
                      <span className="font-medium text-[#475569]">{cert.accreditationBoard}</span>
                    </div>

                    <div className="flex items-center gap-4 pt-1 border-t border-[#F1F5F9] text-[11px] font-medium text-[#64748B]">
                      <span>Issued: <strong className="text-[#121C46]">{cert.issuedDate}</strong></span>
                      <span>Expires: <strong className="text-[#121C46]">{cert.expiryDate}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="mt-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {cert.summary}
                </p>

                {/* Expandable Certified Scope */}
                {expandedScope[cert.id] && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] animate-fadeIn">
                    <div className="text-[11px] font-bold text-[#121C46] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FaFileAlt className="text-[#2563EB]" />
                      <span>Certified Scope of Registration:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#475569]">
                      {cert.scopeBullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#2563EB] font-bold mt-0.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* BOTTOM ACTIONS BAR */}
              <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => toggleScope(cert.id)}
                  className="text-[#2563EB] hover:text-[#1D4ED8] font-bold transition-colors cursor-pointer"
                >
                  {expandedScope[cert.id] ? "Hide Full Scope ▲" : "View Certified Scope ▼"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#121C46] text-[#121C46] font-bold transition-all shadow-2xs hover:bg-[#F1F5F9] flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaSearchPlus className="text-[11px]" />
                    <span>View Certificate</span>
                  </button>

                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#121C46] hover:bg-[#1E293B] text-[#FFDB58] font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <span>Verify Online</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST BANNER */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-2xl shrink-0 border border-blue-100">
              <FaShieldAlt />
            </div>
            <div>
              <div className="font-extrabold text-[#121C46] text-base sm:text-lg">
                Direct Third-Party Authenticity &amp; Audit Trail
              </div>
              <div className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Every certificate displayed above is actively registered and can be verified directly on official accreditation databases.
              </div>
            </div>
          </div>

          <a
            href="/verify-certificate"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>Search Student Certificate Registry</span>
            <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>

      {/* FULL-SCREEN CERTIFICATE MODAL */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#121C46] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FaAward className="text-[#FFDB58] text-lg" />
                <div>
                  <div className="font-bold text-sm sm:text-base leading-tight">
                    {selectedCert.title} — {selectedCert.subtitle}
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    ID: {selectedCert.certNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedCert.image}
                  download
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Download Image
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable image */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 flex items-center justify-center">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md border border-[#CBD5E1]"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2 text-[#475569]">
                <FaCheckCircle className="text-emerald-600" />
                <span>Issued to <strong>{selectedCert.entity}</strong> by {selectedCert.issuer}</span>
              </div>
              <a
                href={selectedCert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-bold flex items-center gap-1"
              >
                <span>Verify on {selectedCert.verifyDomain}</span>
                <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
