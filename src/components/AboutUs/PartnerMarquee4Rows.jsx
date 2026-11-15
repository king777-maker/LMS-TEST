import React from "react";
import {
  FaPlane,
  FaIndustry,
  FaLaptopCode,
  FaUniversity,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

/**
 * PartnerMarquee4Rows — 4-Row Continuous Alternating Horizontal Scroll
 * Combines all official client and partner organizations without duplicates.
 * Rows scroll in alternating directions (Row 1 Left, Row 2 Right, Row 3 Left, Row 4 Right).
 * Features pause-on-hover and seamless infinite looping.
 */

const row1 = [
  { name: "Safran Aerospace", sector: "Aerospace & Defence", category: "aerospace" },
  { name: "Adani Defence & Aerospace", sector: "Defence Systems", category: "defence" },
  { name: "Elbit Systems", sector: "Defence Technologies", category: "defence" },
  { name: "Mahindra Rise", sector: "Automotive & Heavy Industry", category: "automotive" },
  { name: "Asteria Aerospace", sector: "Drone Technologies", category: "aerospace" },
  { name: "Alpha-Elsec", sector: "Defence & Avionics", category: "defence" },
  { name: "Alpha Design Technologies", sector: "Aerospace Systems", category: "defence" },
  { name: "Ardonan", sector: "Engineering Solutions", category: "engineering" },
  { name: "Senvion", sector: "Wind Energy Solutions", category: "energy" },
  { name: "Bisen Aerospace", sector: "Precision Aerospace", category: "aerospace" },
  { name: "EHA Aviation", sector: "Aviation Logistics", category: "aerospace" },
  { name: "Aviation Services", sector: "Aviation Auditing", category: "aerospace" },
  { name: "MechArrow", sector: "Aerospace Engineering", category: "aerospace" },
  { name: "Acer Petroleum", sector: "Petroleum & Energy", category: "energy" },
  { name: "GNA Gears", sector: "Automotive Transmission", category: "automotive" },
  { name: "Verga Attachments", sector: "Industrial Attachments", category: "manufacturing" },
  { name: "CW Industries", sector: "Precision Engineering", category: "manufacturing" },
];

const row2 = [
  { name: "SVAE", sector: "Automotive Engineering", category: "automotive" },
  { name: "Enviro", sector: "Facility & ESG Management", category: "energy" },
  { name: "B&R Machine", sector: "Precision Machining", category: "manufacturing" },
  { name: "Sieger Engineering", sector: "Automated Systems", category: "engineering" },
  { name: "Safe Pharma", sector: "Pharma Compliance", category: "pharma" },
  { name: "Esslibra", sector: "Quality Management", category: "quality" },
  { name: "Accurate Engineering", sector: "Calibration & Metrology", category: "engineering" },
  { name: "Ace Carbo Nitriders", sector: "Heat Treatment & Metallurgy", category: "manufacturing" },
  { name: "Maruthi Industries", sector: "Manufacturing Systems", category: "manufacturing" },
  { name: "Smits Engineering", sector: "Industrial Contracting", category: "engineering" },
  { name: "Omtec Solutions", sector: "Engineering & Automation", category: "technology" },
  { name: "Central", sector: "Industrial Services", category: "manufacturing" },
  { name: "Neepuna Solutions", sector: "Manufacturing Solutions", category: "manufacturing" },
  { name: "Fulcrum Engineering", sector: "Engineering Consultancy", category: "engineering" },
  { name: "Avtronix", sector: "Avionics Electronics", category: "aerospace" },
  { name: "Netalient", sector: "Enterprise Network Tech", category: "technology" },
  { name: "GM Industries", sector: "Precision Components", category: "manufacturing" },
];

const row3 = [
  { name: "Scanio Tech", sector: "Industrial Technology", category: "technology" },
  { name: "Creative Technologies", sector: "Digital Enterprise", category: "technology" },
  { name: "Enlivening Technologies", sector: "Cloud Systems", category: "technology" },
  { name: "Reach SMS", sector: "Enterprise Telecom", category: "technology" },
  { name: "Bolt Technologies", sector: "Inspection & Testing", category: "technology" },
  { name: "MV Technologies", sector: "Smart Enterprise Tech", category: "technology" },
  { name: "Shree Vasu Logistics", sector: "Supply Chain & Warehousing", category: "logistics" },
  { name: "Logix Maritime", sector: "Port & Maritime Logistics", category: "logistics" },
  { name: "Obeya", sector: "Workplace Solutions", category: "corporate" },
  { name: "Succinnova", sector: "Business Innovation", category: "technology" },
  { name: "Ibhaan", sector: "Technology Systems", category: "technology" },
  { name: "Bilva Technologies", sector: "Automation Systems", category: "technology" },
  { name: "Al-Nab'a", sector: "Contracting & Supplies", category: "corporate" },
  { name: "ECET", sector: "Technical Education Group", category: "academic" },
  { name: "Manthragiri Textiles", sector: "Textile Compliance", category: "manufacturing" },
  { name: "Varashakti Housing", sector: "Financial Services", category: "finance" },
  { name: "Aitoo Group", sector: "Commercial Group", category: "corporate" },
];

const row4 = [
  { name: "RKN Heat Treatment", sector: "Industrial Heat Processing", category: "manufacturing" },
  { name: "Dhruv Global Trading", sector: "International Commerce", category: "corporate" },
  { name: "I-Touch Technologies", sector: "Smart Automation", category: "technology" },
  { name: "Matrix Home", sector: "Modular Engineering", category: "corporate" },
  { name: "RKN Flexibles", sector: "Industrial Flexibles", category: "manufacturing" },
  { name: "Sun Hotels & Properties", sector: "Hospitality Compliance", category: "corporate" },
  { name: "Christ University", sector: "Academic Institution", category: "academic" },
  { name: "CMR Group of Institutions", sector: "University Group", category: "academic" },
  { name: "Rishi Knowledge Institute", sector: "Higher Education", category: "academic" },
  { name: "African American University", sector: "International University", category: "academic" },
  { name: "Sree Rama Engineering", sector: "Engineering College", category: "academic" },
  { name: "DFH Auditing", sector: "Assessment & Audits", category: "quality" },
  { name: "CADAC", sector: "CAD/CAM Solutions", category: "engineering" },
  { name: "Q Trainer", sector: "Quality Assurance Systems", category: "quality" },
  { name: "MomentuX", sector: "Digital Enterprise", category: "technology" },
  { name: "JRP Interiors", sector: "Facility & Architecture", category: "corporate" },
];

// Category badges helper
const getCategoryStyle = (cat) => {
  switch (cat) {
    case "aerospace":
    case "defence":
      return { bg: "bg-blue-50 text-[#2563EB] border-blue-200/80", icon: <FaPlane className="text-xs" /> };
    case "automotive":
    case "manufacturing":
    case "engineering":
      return { bg: "bg-orange-50 text-[#F97316] border-orange-200/80", icon: <FaIndustry className="text-xs" /> };
    case "technology":
      return { bg: "bg-indigo-50 text-indigo-600 border-indigo-200/80", icon: <FaLaptopCode className="text-xs" /> };
    case "academic":
      return { bg: "bg-amber-50 text-amber-700 border-amber-200/80", icon: <FaUniversity className="text-xs" /> };
    default:
      return { bg: "bg-slate-50 text-slate-700 border-slate-200/80", icon: <FaShieldAlt className="text-xs" /> };
  }
};

const ClientCard = ({ client }) => {
  const badge = getCategoryStyle(client.category);
  return (
    <div
      className="
        flex items-center gap-3 px-4 py-3 rounded-2xl
        bg-white border border-[#E2E8F0] shadow-2xs
        hover:border-[#2563EB] hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 shrink-0
        w-[240px] sm:w-[260px] h-[64px]
        select-none cursor-pointer group/card
      "
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badge.bg}`}
      >
        {badge.icon}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[13.5px] font-bold text-[#121C46] truncate group-hover/card:text-[#2563EB] transition-colors leading-snug">
          {client.name}
        </h4>
        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider truncate mt-0.5">
          {client.sector}
        </p>
      </div>
    </div>
  );
};

const MarqueeRow = ({ items, direction = "left", speed = "42s" }) => {
  // Duplicate for seamless 100% infinite marquee
  const doubleList = [...items, ...items];
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative w-full overflow-hidden py-1.5 group">
      <div
        className={`flex gap-4 w-max ${animClass} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: speed }}
      >
        {doubleList.map((client, idx) => (
          <ClientCard key={`${client.name}-${idx}`} client={client} />
        ))}
      </div>
    </div>
  );
};

const PartnerMarquee4Rows = () => {
  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marqueeLeft linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left, .animate-marquee-right {
            animation-duration: 120s !important;
          }
        }
      `}</style>

      {/* Left and Right Fade Gradients */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20"
        aria-hidden="true"
      />

      {/* 4 Rows in Alternating Directions */}
      <div className="flex flex-col gap-3.5 relative z-10">
        {/* Row 1: Left */}
        <MarqueeRow items={row1} direction="left" speed="44s" />
        {/* Row 2: Right */}
        <MarqueeRow items={row2} direction="right" speed="48s" />
        {/* Row 3: Left */}
        <MarqueeRow items={row3} direction="left" speed="42s" />
        {/* Row 4: Right */}
        <MarqueeRow items={row4} direction="right" speed="46s" />
      </div>

      {/* Verified Client Network Footer Pill */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
          <FaCheckCircle className="text-emerald-500 text-xs" />
          <span>65+ Verified Corporate &amp; Institutional Clients</span>
        </span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>Aerospace, Automotive, Heavy Engineering &amp; Technology Sectors</span>
      </div>
    </div>
  );
};

export default PartnerMarquee4Rows;
