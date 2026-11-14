import React, { useEffect } from "react";
import {
  FaNewspaper,
  FaFilePdf,
  FaBroadcastTower,
  FaEnvelope,
  FaAward,
  FaCheckCircle,
} from "react-icons/fa";
import AboutPageHeader from "../components/AboutShared/AboutPageHeader";
import AboutSplitSection from "../components/AboutShared/AboutSplitSection";
import AboutMediaObject from "../components/AboutShared/AboutMediaObject";

/**
 * Media Relations Page (/about/relations) — Broadbeach Academy
 * Standardized using Split-Screen and Media Object UI patterns.
 */
const Media = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const pressItems = [
    {
      icon: <FaNewspaper />,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Academy Expands Lead Auditor Program",
      subtitle: "Press Release • 2026",
      description:
        "Broadbeach Online Academy launches new interactive simulated audit modules for ISO 9001 and ISO 14001 certification tracks.",
    },
    {
      icon: <FaBroadcastTower />,
      iconColor: "text-[#F97316]",
      iconBg: "bg-orange-50 border-orange-100",
      title: "Global Alumni Milestone Surpasses 50,000",
      subtitle: "Corporate Announcement",
      description:
        "International milestone highlights growing demand for accessible digital e-learning across quality, environmental, and occupational safety disciplines.",
    },
    {
      icon: <FaFilePdf />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Download Official Press Kit & Brand Guide",
      subtitle: "Media Resources",
      description:
        "Access official Broadbeach Academy vector logos, executive headshots, institutional fact sheets, and brand color specifications.",
    },
    {
      icon: <FaEnvelope />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Media & Editorial Contact",
      subtitle: "press@broadbeach.in",
      description:
        "Our communications desk responds promptly to press inquiries, interview requests with lead faculty, and educational partnership proposals.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#121C46]">
      {/* 1. PAGE HEADER */}
      <AboutPageHeader
        title="Press & Media:"
        highlight="Academy News & Announcements"
        description="Official press releases, media kits, and institutional publications from Broadbeach Online Academy."
        breadcrumbs={[{ label: "Media Relations" }]}
      />

      {/* 2. SPLIT-SCREEN MEDIA OVERVIEW (50/50: Text Left, Image Right) */}
      <AboutSplitSection
        eyebrow="NEWS & COMMUNICATIONS"
        eyebrowColor="blue"
        eyebrowIcon={<FaNewspaper className="text-xs text-[#2563EB]" />}
        title="Sharing Our Vision For"
        highlightText="Modern Professional Standards"
        paragraphs={[
          "Broadbeach Online Academy regularly shares research, case studies, and insights on the future of compliance training, digital proctoring, and international ISO certification.",
          "Journalists, academic researchers, and industry editors are welcome to connect with our media relations team for commentary on auditing trends, workplace safety regulations, and quality management innovations.",
        ]}
        bullets={[
          { text: "Verified news and corporate updates" },
          { text: "High-resolution digital press kit and executive bios" },
          { text: "Expert commentary on emerging ISO standard developments" },
        ]}
        imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80"
        imageAlt="Broadbeach Academy Media and Communications"
        imagePosition="right"
        floatingBadge={{
          title: "MEDIA DESK",
          subtitle: "Official Press Inquiries",
          icon: <FaBroadcastTower />,
        }}
        bgColor="white"
      />

      {/* 3. MEDIA OBJECT: PRESS RELEASES & RESOURCES */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-y border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#121C46] leading-tight">
              Press Announcements &amp; Media Assets
            </h2>
            <p className="mt-2.5 text-[#475569] text-sm sm:text-base leading-relaxed">
              Explore recent announcements and download media resources below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {pressItems.map((item, index) => (
              <AboutMediaObject
                key={index}
                icon={item.icon}
                iconColor={item.iconColor}
                iconBg={item.iconBg}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Media;
