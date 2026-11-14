import React, { useEffect } from "react";
import {
  FaHistory,
  FaCalendarAlt,
  FaGlobe,
  FaGraduationCap,
  FaAward,
  FaLaptopCode,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * History (Our Story) Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for Founding Heritage and Digital Evolution.
 * 2. Media Object Layout for Timeline Milestones and Heritage Metrics.
 */
const History = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const timelineMilestones = [
    {
      year: "2014",
      icon: <FaBuilding />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Foundational Seminars & Quality Roots",
      subtitle: "Academy Inception",
      description:
        "Established by senior auditors to provide structured quality management and compliance workshops to manufacturing and engineering enterprises.",
    },
    {
      icon: <FaAward />,
      year: "2017",
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Expansion Across Multi-Standards",
      subtitle: "Curriculum Broadening",
      description:
        "Expanded our training scope to include comprehensive Lead Auditor tracks across ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Health & Safety).",
    },
    {
      year: "2019",
      icon: <FaLaptopCode />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Digital Campus Launch",
      subtitle: "Transition to E-Learning",
      description:
        "Launched Broadbeach Online Academy's cloud-based learning management system, opening 24/7 self-paced certification to international learners.",
    },
    {
      year: "2021",
      icon: <FaGlobe />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Crossing Global Borders",
      subtitle: "25,000+ Alumni Milestone",
      description:
        "Welcomed students from over 40 countries, establishing a recognized digital credential verification portal trusted by corporate hiring directors.",
    },
    {
      year: "2024",
      icon: <FaGraduationCap />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Next-Gen Audit Simulation Labs",
      subtitle: "Modern Interactive Learning",
      description:
        "Integrated interactive non-conformity exercises, audit mock interviews, and scenario simulations to ensure day-one workplace readiness.",
    },
  ];

  const heritageStats = [
    {
      icon: <FaCalendarAlt />,
      number: "10+",
      label: "Years of Educational Excellence",
    },
    {
      icon: <FaUsers />,
      number: "50,000+",
      label: "Learners & Certified Auditors",
    },
    {
      icon: <FaGlobe />,
      number: "45+",
      label: "Countries With Active Alumni",
    },
    {
      icon: <FaAward />,
      number: "98.4%",
      label: "Course Completion & Success Rate",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Our Story:"
        highlight="A Decade of Educational Heritage"
        description="From specialized classroom auditor workshops to a premier international digital academy empowering professionals worldwide."
        breadcrumbs={[{ label: "Our Story" }]}
      />

      {/* 2. SPLIT-SCREEN FOUNDING STORY (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="OUR HERITAGE"
        eyebrowColor="blue"
        eyebrowIcon={<FaHistory className="text-xs text-[#2563EB]" />}
        title="Built on Genuine Auditing Rigor,"
        highlightText="Grown on Student Trust."
        paragraphs={[
          "Over a decade ago, Broadbeach Online Academy began with a straightforward conviction: that compliance and standards education should be delivered by experienced practitioners who actually conduct third-party audits.",
          "Our founders recognized that traditional auditing seminars were often inconvenient, costly, and excessively theoretical. By coupling rigorous standards interpretation with practical workplace exercises, we developed a learning approach that quickly gained the trust of students and employers alike.",
        ]}
        bullets={[
          { text: "Founded by accredited ISO Lead Auditors and industrial educators" },
          { text: "Committed to practical, career-advancing competency" },
          { text: "Unbroken track record of academic compliance and student achievement" },
        ]}
        imageSrc="/assets/about/bb_history.jpeg"
        imageAlt="Broadbeach Academy Founding Heritage"
        imagePosition="right"
        floatingBadge={{
          title: "ESTABLISHED 2014",
          subtitle: "Over a Decade of Excellence",
          icon: <FaAward />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: TIMELINE MILESTONES */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Milestone Roadmap</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              A Decade of Continuous Innovation
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Explore the key milestones that transformed our vision into a premier global online academy.
            </p>
          </div>

          {/* Vertical Stack of Timeline Media Objects */}
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
            {timelineMilestones.map((item, index) => (
              <AboutMediaObject
                key={index}
                icon={item.icon}
                iconColor={item.iconColor}
                iconBg={item.iconBg}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                badge={item.year}
                badgeColor={index % 2 === 0 ? "blue" : "orange"}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN EVOLUTION (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="DIGITAL EXPANSION"
        eyebrowColor="orange"
        title="Modernizing Standards Education"
        highlightText="For The Global Workforce"
        paragraphs={[
          "As industrial manufacturing, aerospace, software, and healthcare sectors globalized, the demand for certified auditors surged. In response, Broadbeach invested heavily in intuitive cloud-based learning infrastructure.",
          "Today, our self-paced learning portal enables learners to access courseware across any timezone and device—empowering thousands to gain Lead Auditor and compliance credentials without interrupting their professional careers.",
        ]}
        bullets={[
          { text: "Fully responsive platform compatible with laptop, tablet, and mobile" },
          { text: "Verifiable digital certificates recognized internationally" },
          { text: "Dedicated counseling team supporting enrollment and graduation" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Modern Digital Learning Transformation"
        imagePosition="left"
        floatingBadge={{
          title: "GLOBAL E-LEARNING",
          subtitle: "Serving Professionals in 45+ Nations",
          icon: <FaGlobe />,
        }}
        bgColor="white"
      />

      {/* 5. MEDIA OBJECT: STATS METRICS */}
      <section className="bg-[#0F1E36] py-12 sm:py-14 text-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {heritageStats.map((st, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FFDB58] flex items-center justify-center text-2xl shrink-0">
                  {st.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {st.number}
                  </div>
                  <div className="text-xs text-slate-300 font-medium leading-snug mt-0.5">
                    {st.label}
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

export default History;
