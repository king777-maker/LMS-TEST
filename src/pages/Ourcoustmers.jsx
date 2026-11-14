import React, { useEffect, useState } from "react";
import {
  FaSmile,
  FaStar,
  FaCheckCircle,
  FaBuilding,
  FaUserGraduate,
  FaAward,
  FaShieldAlt,
  FaQuoteLeft,
  FaPlane,
  FaIndustry,
  FaLaptopCode,
  FaUniversity,
  FaGlobe,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Our Customers (Happy Customers & Corporate Partners) — Broadbeach Academy
 * Includes:
 * 1. Prominent Corporate Clients & Partners Logo Grid from official client portfolio.
 * 2. Split-Screen 50/50 Layout for Student Success Stories and Enterprise Partnerships.
 * 3. Media Object Layout for Verified Learner Reviews and Satisfaction Metrics.
 */
const Ourcoustmers = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");

  // Highlighted client partners across sectors
  const sectorPartners = [
    {
      category: "aerospace",
      name: "Aerospace & Defence",
      icon: <FaPlane />,
      clients: [
        "Safran Aerospace Defence Security",
        "Adani Defence and Aerospace",
        "Elbit Systems",
        "Asteria Aerospace",
        "Alpha-Elsec Defence Systems",
        "Bisen Aerospace",
        "EHA Aviation",
        "Alpha Design Technologies",
        "Aviation Services",
      ],
    },
    {
      category: "automotive",
      name: "Automotive & Heavy Engineering",
      icon: <FaIndustry />,
      clients: [
        "Mahindra Rise",
        "GNA Gears",
        "Sieger Engineering",
        "B&R Machine",
        "Verga Attachments",
        "Fulcrum Engineering",
        "Smits Engineering",
        "GM Industries",
        "Omtec Solutions",
        "Accurate Engineering",
        "RKN Heat Treatment Solutions",
      ],
    },
    {
      category: "tech",
      name: "Technology & Logistics",
      icon: <FaLaptopCode />,
      clients: [
        "Shree Vasu Logistics",
        "Succinnova",
        "Bilva Technologies",
        "Creative Technologies",
        "Bolt Technologies",
        "MV Technologies",
        "I-Touch Technologies",
        "CADAC",
        "Reach SMS",
        "Enlivening Technologies",
        "Scanio Tech",
      ],
    },
    {
      category: "academic",
      name: "Universities & Academic Institutions",
      icon: <FaUniversity />,
      clients: [
        "Christ University",
        "CMR Group of Institutions",
        "African American University",
        "Sree Rama Engineering College",
        "ECET Group",
        "Rishi Knowledge Institute",
      ],
    },
  ];

  const customerReviews = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Quality Assurance Lead",
      company: "Apex Precision Engineering",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      certificate: "ISO 9001 Lead Auditor",
      quote:
        "The scenario-based mock audit exercises gave me the exact tools I needed to lead our internal ISO 9001 surveillance audit without hesitation. The certificate verification was validated by our registrar instantly.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "EHS Manager",
      company: "GreenVolt Renewable Energy",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
      certificate: "ISO 14001 & 45001 Integrated",
      quote:
        "Balancing a demanding job in the energy sector with certification seemed daunting until I enrolled at Broadbeach. The 24/7 modular lessons and practical non-conformity checklists made all the difference.",
    },
    {
      id: 3,
      name: "David Miller",
      role: "Senior Operations Director",
      company: "Vanguard Logistics Global",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      certificate: "Supply Chain & Quality Lead",
      quote:
        "We enrolled our entire multi-site quality team through Broadbeach Academy. The consistency of reporting across our international warehouses improved noticeably within two months.",
    },
    {
      id: 4,
      name: "Anita Desai",
      role: "Information Security Auditor",
      company: "CloudCore Technologies",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      certificate: "ISO 27001 ISMS Lead Implementer",
      quote:
        "The curriculum doesn't just read clauses—it forces you to think like an external auditor inspecting risk controls and access management. A genuinely worthwhile investment in my career.",
    },
  ];

  const satisfactionMetrics = [
    {
      icon: <FaSmile />,
      number: "98.4%",
      label: "Positive Learner Satisfaction Score",
    },
    {
      icon: <FaAward />,
      number: "87%",
      label: "Reported Career or Promotion Impact",
    },
    {
      icon: <FaBuilding />,
      number: "250+",
      label: "Corporate & Enterprise Client Teams",
    },
    {
      icon: <FaCheckCircle />,
      number: "100%",
      label: "Authentic Certificate Verification",
    },
  ];

  const enterpriseHighlights = [
    {
      icon: <FaBuilding />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Custom Corporate Cohorts",
      subtitle: "Tailored Training",
      description:
        "Dedicated learning portals for corporate cohorts, enabling managers to track employee module progression and exam completions in real time.",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Harmonized Audit Reports",
      subtitle: "Unified Quality Criteria",
      description:
        "Standardizing internal audit findings across global branch locations through identical grading rubrics and non-conformity classifications.",
    },
    {
      icon: <FaUserGraduate />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Cost-Effective Scalability",
      subtitle: "Eliminating Travel Costs",
      description:
        "Eliminate expensive hotel and travel costs associated with physical training seminars while providing identical or superior instructional quality.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Happy Customers:"
        highlight="Trusted by 70+ Leading Global Organizations"
        description="From premier aerospace and defense giants to multinational engineering enterprises and universities, explore the organizations that trust Broadbeach Academy."
        breadcrumbs={[{ label: "Happy Customers" }]}
      />

      {/* 2. SPLIT-SCREEN CUSTOMER INTRO (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="ENTERPRISE & LEARNER TRUST"
        eyebrowColor="blue"
        eyebrowIcon={<FaSmile className="text-xs text-[#2563EB]" />}
        title="Trusted by Professionals,"
        highlightText="Respected by Industry Giants."
        paragraphs={[
          "Nothing speaks louder than the confidence of our corporate clients and the accomplishments of our alumni. Broadbeach Online Academy delivers compliance training, Lead Auditor certifications, and quality education to over 70 premier industrial corporations, defense suppliers, and academic institutions.",
          "Our clients include globally recognized leaders such as Safran Aerospace, Adani Defence, Mahindra Rise, and Elbit Systems, who rely on our curriculum to ensure their engineering and quality personnel meet exacting international standards.",
        ]}
        bullets={[
          { text: "70+ Corporate, Defense & Industrial Clients Trained" },
          { text: "98.4% student satisfaction rating across all courses" },
          { text: "Verifiable credentials that build credibility during audits and interviews" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Happy Customers and Learners"
        imagePosition="right"
        floatingBadge={{
          title: "ENTERPRISE TRUST",
          subtitle: "70+ Client Organizations",
          icon: <FaBuilding className="text-[#FFDB58]" />,
        }}
        bgColor="white"
      />

      {/* 3. OFFICIAL CLIENT LOGOS SHOWCASE (From User Provided Image Assets) */}
      <section className="bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Our Esteemed Clients</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-[#121C46] leading-tight">
              Our Happy Customers &amp; Client Organizations
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base lg:text-[16.5px] leading-relaxed">
              We take immense pride in training and certifying the teams of premier aerospace contractors, industrial manufacturers, logistics networks, and universities worldwide.
            </p>
          </div>

          {/* Client Logo Gallery Cards (Full Resolution Display) */}
          <div className="space-y-8">
            
            {/* Sheet 1: Major Corporate & Aerospace Clients */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#121C46]">
                    Aerospace, Defence &amp; Industrial Engineering Partners
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                    Safran, Adani Defence, Mahindra Rise, Elbit Systems, Asteria Aerospace, Senvion, Sieger, and associated leaders.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-bold uppercase tracking-wider">
                  <FaCheckCircle className="text-xs" />
                  <span>Verified Corporate Clients</span>
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-white border border-slate-100 p-2 sm:p-4 flex items-center justify-center">
                <img
                  src="/assets/customers/customer-logos-1.jpg"
                  alt="Our Happy Customers - Aerospace, Defense, and Industrial Engineering Clients"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                  }}
                  className="w-full h-auto object-contain max-h-[550px] rounded-lg"
                />
              </div>
            </div>

            {/* Sheet 2: Technology, Manufacturing & Institutional Partners */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#121C46]">
                    Technology, Supply Chain &amp; Academic Partners
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                    Christ University, CADAC, Creative Tech, Bolt, MV Technologies, Aviation Services, Alpha Design, and partners.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#F97316] border border-orange-100 text-xs font-bold uppercase tracking-wider">
                  <FaCheckCircle className="text-xs" />
                  <span>Institutional Partners</span>
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-white border border-slate-100 p-2 sm:p-4 flex items-center justify-center">
                <img
                  src="/assets/customers/customer-logos-2.jpg"
                  alt="Our Happy Customers - Technology, Universities, and Corporate Partners"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                  }}
                  className="w-full h-auto object-contain max-h-[500px] rounded-lg"
                />
              </div>
            </div>

          </div>

          {/* Sector Badges Pill Showcase */}
          <div className="mt-12">
            <div className="text-center mb-6">
              <h4 className="text-base sm:text-lg font-bold text-[#121C46]">
                Explore Clients by Industry Domain
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {sectorPartners.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-lg shrink-0">
                        {sec.icon}
                      </div>
                      <h5 className="text-sm font-bold text-[#121C46] leading-snug">
                        {sec.name}
                      </h5>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      {sec.clients.map((client, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center gap-2 text-xs text-[#475569] py-0.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                          <span className="font-medium truncate">{client}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. MEDIA OBJECT: VERIFIED LEARNER REVIEWS */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Verified Alumni Feedback</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              What Our Graduates Say
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Read authentic feedback from working quality directors, health & safety leads, and compliance specialists.
            </p>
          </div>

          {/* 2-Column Grid of Media Object Testimonials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
              >
                {/* Media Left: Student Photo */}
                <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs bg-slate-100">
                  <img
                    src={rev.image}
                    alt={rev.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-[#121C46] text-[#FFDB58] p-1 rounded-md text-[10px]">
                    <FaQuoteLeft />
                  </div>
                </div>

                {/* Media Body: Review Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {rev.certificate}
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] italic leading-relaxed mt-2">
                    "{rev.quote}"
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
                    <div className="text-sm font-bold text-[#121C46]">
                      {rev.name}
                    </div>
                    <div className="text-xs text-[#2563EB] font-medium">
                      {rev.role} • <span className="text-slate-500">{rev.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPLIT-SCREEN ENTERPRISE PARTNERSHIPS (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="ENTERPRISE AUDIT SOLUTIONS"
        eyebrowColor="orange"
        title="Why Corporations Partner With Us"
        highlightText="For Workforce Quality & Safety"
        paragraphs={[
          "Beyond individual learners, Broadbeach Online Academy partners directly with industrial corporations, aerospace suppliers, and logistics providers to build accredited internal auditing teams.",
          "Our enterprise training programs allow companies to systematically certify new compliance officers, refresh senior auditors on revised standards, and maintain an audit-ready operational posture across multi-site facilities.",
        ]}
        bullets={[
          { text: "Centralized employee enrollment and progress tracking dashboards" },
          { text: "Tailored multi-course pathways across ISO 9001, 14001, 45001, and 27001" },
          { text: "Measurable ROI with verifiable digital credential verification" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Corporate Team Learning and Graduation"
        imagePosition="left"
        floatingBadge={{
          title: "ENTERPRISE TRUST",
          subtitle: "250+ Corporate Teams Certified",
          icon: <FaBuilding />,
        }}
        bgColor="white"
      />

      {/* 6. MEDIA OBJECT: ENTERPRISE HIGHLIGHTS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Corporate Partnership Benefits
            </h2>
            <p className="mt-2 text-[#475569] text-sm sm:text-base leading-relaxed">
              How our online platform solves enterprise compliance and audit training challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {enterpriseHighlights.map((eh, idx) => (
              <AboutMediaObject
                key={idx}
                icon={eh.icon}
                iconColor={eh.iconColor}
                iconBg={eh.iconBg}
                title={eh.title}
                subtitle={eh.subtitle}
                description={eh.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEDIA OBJECT: SATISFACTION METRICS */}
      <section className="bg-[#0F1E36] py-12 sm:py-14 text-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {satisfactionMetrics.map((sm, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FFDB58] flex items-center justify-center text-2xl shrink-0">
                  {sm.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {sm.number}
                  </div>
                  <div className="text-xs text-slate-300 font-medium leading-snug mt-0.5">
                    {sm.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Ourcoustmers;
