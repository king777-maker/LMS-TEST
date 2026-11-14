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
import AboutTeamProfile from "../components/AboutShared/AboutTeamProfile";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * OurTeam Page — Broadbeach Academy
 * Standardized using:
 * 1. Split-Screen 50/50 Layout for introduction and academic culture.
 * 2. Media Object Layout for educator profiles and key statistics.
 */
const OurTeam = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "John Anderson",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      experience: "18+ Yrs",
      bio: "Executive leader in higher education and professional certification frameworks with over 18 years of experience guiding international training institutions.",
      credentials: [
        "Executive Leadership",
        "International Compliance",
        "EdTech Strategy",
      ],
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Head of Training & Lead Auditor Instructor",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      experience: "14+ Yrs",
      bio: "Certified ISO Lead Auditor trainer specializing in Quality Management (ISO 9001), Environmental Systems (ISO 14001), and Occupational Health & Safety (ISO 45001).",
      credentials: [
        "ISO 9001 / 14001 / 45001",
        "Lead Auditor Trainer",
        "Curriculum Design",
      ],
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Director of Academic Operations",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      experience: "15+ Yrs",
      bio: "Operational strategist managing digital exam proctoring, global learner support networks, and enterprise compliance partnerships worldwide.",
      credentials: [
        "Operations Management",
        "Enterprise Solutions",
        "Quality Assurance",
      ],
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "Learning & Development Head",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80",
      linkedin: "https://linkedin.com",
      experience: "12+ Yrs",
      bio: "Instructional designer dedicated to adult e-learning pedagogies, microlearning architectures, and practical compliance audit simulation methodologies.",
      credentials: [
        "Instructional Design",
        "Simulation Learning",
        "Assessment Standards",
      ],
    },
  ];

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
        eyebrow="FACULTY & LEADERSHIP"
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
        imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Team Collaboration"
        imagePosition="right"
        floatingBadge={{
          title: "ONE TEAM",
          subtitle: "One Vision. Global Impact.",
          icon: <FaUsers />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: TEAM PROFILES */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>Academic Leadership</span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#121C46] leading-tight">
              Meet Our Senior Faculty &amp; Directors
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
              Scan individual profiles below to explore our team's academic background, industry credentials, and specialized disciplines.
            </p>
          </div>

          {/* 2-Column Grid of Media Object Profiles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {teamMembers.map((member) => (
              <AboutTeamProfile
                key={member.id}
                name={member.name}
                role={member.role}
                image={member.image}
                bio={member.bio}
                credentials={member.credentials}
                linkedin={member.linkedin}
                experience={member.experience}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN CULTURE & STANDARDS (50/50: Image Left, Text Right) */}
      <AboutSplitSection
        eyebrow="ACADEMIC STANDARDS"
        eyebrowColor="orange"
        title="How We Maintain"
        highlightText="World-Class Instruction"
        paragraphs={[
          "Education at Broadbeach Online Academy is not passive video streaming—it is an interactive mentorship experience led by qualified practitioners who understand real audits.",
          "Our faculty undergoes periodic peer reviews, continuous professional development, and alignment checks with evolving ISO standards to guarantee that your credential remains respected by employers worldwide.",
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

      {/* 5. MEDIA OBJECT: FACULTY PILLARS */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-t border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
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

      {/* 6. MEDIA OBJECT STATS BAR */}
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
