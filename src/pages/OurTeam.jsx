import React, { useEffect } from "react";
import {
  FaUsers,
  FaGraduationCap,
  FaGlobe,
  FaAward,
  FaChalkboardTeacher,
  FaCertificate,
  FaBookReader,
  FaShieldAlt,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * OurTeam Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for introduction and academic culture.
 * 2. Media Object Layout for faculty standards and key statistics.
 */
const OurTeam = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const facultyStandards = [
    {
      icon: <FaCertificate />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Certified Lead Auditors",
      subtitle: "Verified Industry Credentials",
      description:
        "Every instructor possesses active international audit credentials and hands-on third-party auditing experience.",
    },
    {
      icon: <FaShieldAlt />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Real-World Practice",
      subtitle: "Industry Experience",
      description:
        "Faculty members have practical background managing ISO deployments across manufacturing, aerospace, healthcare, and IT.",
    },
    {
      icon: <FaBookReader />,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Dedicated Mentorship",
      subtitle: "Learner Support",
      description:
        "Direct guidance throughout your coursework, reviewing assessment submissions and providing actionable feedback.",
    },
    {
      icon: <FaChalkboardTeacher />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Continual Professional Updates",
      subtitle: "Current Standards",
      description:
        "Curriculum is continuously updated as ISO and global regulatory bodies release new standards and amendment clauses.",
    },
  ];

  const stats = [
    {
      icon: <FaUsers />,
      number: "25+",
      label: "Industry Experts & Educators",
    },
    {
      icon: <FaGraduationCap />,
      number: "150+",
      label: "Professional Online Courses",
    },
    {
      icon: <FaGlobe />,
      number: "45+",
      label: "Countries With Certified Alumni",
    },
    {
      icon: <FaAward />,
      number: "10+",
      label: "Years of Educational Excellence",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Our Team:"
        highlight="The Minds Behind Broadbeach"
        description="Meet the experienced educators, industry practitioners, and certification leaders dedicated to empowering professionals across the globe."
        breadcrumbs={[{ label: "Our Team" }]}
      />

      {/* 2. SPLIT-SCREEN INTRODUCTION (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="FACULTY & PRACTITIONERS"
        eyebrowColor="blue"
        title="Expertise That Inspires."
        highlightText="Leadership That Delivers."
        paragraphs={[
          "At Broadbeach Online Academy, our strength lies in our people. Our team brings together seasoned auditors, educators, curriculum designers, and student advisors who share a single mission: helping professionals master standards and advance their careers.",
          "With practical background across ISO management systems, Lean Six Sigma, aerospace compliance, and workplace safety, our experts translate intricate regulations into clear, actionable knowledge.",
        ]}
        bullets={[
          { text: "Active Lead Auditors with real-world auditing tenure" },
          { text: "Dedicated academic support and continuous learner guidance" },
          { text: "Curricula structured according to international quality frameworks" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Team Collaboration"
        imagePosition="right"
        floatingBadge={{
          title: "ONE TEAM",
          subtitle: "One Vision. Global Impact.",
          icon: <FaUsers />,
        }}
        bgColor="white"
      />

      {/* 3. SPLIT-SCREEN CULTURE & STANDARDS (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="ACADEMIC STANDARDS"
        eyebrowColor="orange"
        title="How We Maintain"
        highlightText="World-Class Instruction"
        paragraphs={[
          "Education at Broadbeach Online Academy is not passive video streaming—it is an interactive mentorship experience led by qualified practitioners who understand real audits.",
          "Our faculty undergoes periodic peer reviews, continuous professional development, and alignment checks with evolving ISO standards to guarantee that your credential remains respected by employers worldwide.",
        ]}
        bullets={[
          { text: "Hands-on audit scenarios and evidence verification" },
          { text: "Continuous professional development for all course instructors" },
          { text: "Strict adherence to international examination and evaluation standards" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academic Culture"
        imagePosition="left"
        floatingBadge={{
          title: "EXCELLENCE IN TEACHING",
          subtitle: "Standardized Across All Modules",
          icon: <FaAward />,
        }}
        bgColor="white"
      />

      {/* 4. MEDIA OBJECT: FACULTY PILLARS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>Instructional Excellence</span>
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#121C46] leading-tight">
              Our Core Educational Pillars
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              The fundamental principles adhered to by every trainer, mentor, and curriculum author.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {facultyStandards.map((std, i) => (
              <AboutMediaObject
                key={i}
                icon={std.icon}
                iconColor={std.iconColor}
                iconBg={std.iconBg}
                title={std.title}
                subtitle={std.subtitle}
                description={std.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. MEDIA OBJECT STATS BAR */}
      <section className="bg-[#0F1E36] py-12 sm:py-14 text-white">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((st, index) => (
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

export default OurTeam;
