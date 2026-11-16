import React from "react";
import { FaCheckCircle } from "react-icons/fa";

/**
 * PartnerMarquee4Rows — 4-Row Continuous Alternating Horizontal Scroll
 * Displays actual company logo images moving across 4 rows in alternating directions.
 * All client and partner logos are combined with zero duplicates.
 * Features smooth infinite marquee, pause-on-hover, and gradient fade masks.
 */

const row1 = [
  { name: "Safran Aerospace", logo: "/assets/customers/logos/safran.png" },
  { name: "Adani Defence & Aerospace", logo: "/assets/customers/logos/adani-defence.png" },
  { name: "Elbit Systems", logo: "/assets/customers/logos/elbit-systems.png" },
  { name: "Mahindra Rise", logo: "/assets/customers/logos/mahindra-rise.png" },
  { name: "Asteria Aerospace", logo: "/assets/customers/logos/asteria-aerospace.png" },
  { name: "Alpha-Elsec Defence", logo: "/assets/customers/logos/alpha-elsec.png" },
  { name: "Ardonan", logo: "/assets/customers/logos/ardonan.png" },
  { name: "Senvion Wind Energy", logo: "/assets/customers/logos/senvion.png" },
  { name: "Acer Petroleum", logo: "/assets/customers/logos/acer-petroleum.png" },
  { name: "GNA Gears", logo: "/assets/customers/logos/gna-gears.png" },
  { name: "Verga", logo: "/assets/customers/logos/verga.png" },
  { name: "CW Industries", logo: "/assets/customers/logos/cw-industries.png" },
  { name: "SVAE Automotive", logo: "/assets/customers/logos/svae.png" },
  { name: "Enviro Facility", logo: "/assets/customers/logos/enviro.png" },
  { name: "Bisen Aerospace", logo: "/assets/customers/logos/bisen-aerospace.png" },
  { name: "B&R Machine", logo: "/assets/customers/logos/b-and-r-machine.png" },
  { name: "Sieger Engineering", logo: "/assets/customers/logos/sieger.png" },
  { name: "Safe Pharma", logo: "/assets/customers/logos/safe-pharma.png" },
  { name: "Esslibra", logo: "/assets/customers/logos/esslibra.png" },
];

const row2 = [
  { name: "MechArrow", logo: "/assets/customers/logos/mecharrow.png" },
  { name: "Obeya Workplaces", logo: "/assets/customers/logos/obeya.png" },
  { name: "Synergy Engineering", logo: "/assets/customers/logos/synergy-mark.png" },
  { name: "Shree Vasu Logistics", logo: "/assets/customers/logos/shree-vasu-logistics.png" },
  { name: "Logix Maritime", logo: "/assets/customers/logos/logix-maritime.png" },
  { name: "Succinnova", logo: "/assets/customers/logos/succinnova.png" },
  { name: "Ibhaan", logo: "/assets/customers/logos/ibhaan.png" },
  { name: "Accurate Engineering", logo: "/assets/customers/logos/accurate.png" },
  { name: "Ace Carbo Nitriders", logo: "/assets/customers/logos/ace-carbo.png" },
  { name: "Maruthi Industries", logo: "/assets/customers/logos/maruthi-industries.png" },
  { name: "Bilva Technologies", logo: "/assets/customers/logos/bilva-technologies.png" },
  { name: "Al-Nab'a Contracting", logo: "/assets/customers/logos/al-naba.png" },
  { name: "Smits Engineering", logo: "/assets/customers/logos/smits-engineering.png" },
  { name: "CMR Group", logo: "/assets/customers/logos/cmr.png" },
  { name: "Rishi Institute", logo: "/assets/customers/logos/rishi.png" },
  { name: "African American University", logo: "/assets/customers/logos/african-american-uni.png" },
  { name: "Sree Rama Engineering", logo: "/assets/customers/logos/sree-rama.png" },
  { name: "Academic Partner", logo: "/assets/customers/logos/academic-crest-1.png" },
  { name: "Institutional Partner", logo: "/assets/customers/logos/academic-crest-2.png" },
];

const row3 = [
  { name: "Omtec Solutions", logo: "/assets/customers/logos/omtec.png" },
  { name: "Central", logo: "/assets/customers/logos/central.png" },
  { name: "Neepuna Solutions", logo: "/assets/customers/logos/neepuna.png" },
  { name: "Educational Crest", logo: "/assets/customers/logos/academic-crest-5.png" },
  { name: "Fulcrum Engineering", logo: "/assets/customers/logos/fulcrum.png" },
  { name: "Avtronix", logo: "/assets/customers/logos/avtronix.png" },
  { name: "Netalient", logo: "/assets/customers/logos/netalient.png" },
  { name: "EHA Aviation", logo: "/assets/customers/logos/eha-aviation.png" },
  { name: "ECET Group", logo: "/assets/customers/logos/ecet.png" },
  { name: "GM Industries", logo: "/assets/customers/logos/gm-industries.png" },
  { name: "Scanio Tech", logo: "/assets/customers/logos/scanio.png" },
  { name: "Creative Technologies", logo: "/assets/customers/logos/creative-technologies.png" },
  { name: "Enlivening Technologies", logo: "/assets/customers/logos/enlivening-technologies.png" },
  { name: "Reach SMS", logo: "/assets/customers/logos/reach-sms.png" },
  { name: "Bolt Inspection", logo: "/assets/customers/logos/bolt.png" },
  { name: "MV Technologies", logo: "/assets/customers/logos/mv-technologies.png" },
  { name: "Academic Council", logo: "/assets/customers/logos/academic-crest-3.png" },
  { name: "University Partner", logo: "/assets/customers/logos/academic-crest-4.png" },
];

const row4 = [
  { name: "Manthragiri Textiles", logo: "/assets/customers/logos/manthragiri-textiles.png" },
  { name: "Varashakti Housing", logo: "/assets/customers/logos/varashakti.png" },
  { name: "Corporate Partner", logo: "/assets/customers/logos/emblem-1974.png" },
  { name: "Aitoo Group", logo: "/assets/customers/logos/aitoo-group.png" },
  { name: "RKN Heat Treatment", logo: "/assets/customers/logos/rkn-heat-treatment.png" },
  { name: "Dhruv Global Trading", logo: "/assets/customers/logos/dhruv.png" },
  { name: "I-Touch Technologies", logo: "/assets/customers/logos/i-touch-technologies.png" },
  { name: "Matrix Home", logo: "/assets/customers/logos/matrix-home.png" },
  { name: "RKN Flexibles", logo: "/assets/customers/logos/rkn-flexibles.png" },
  { name: "Sun Hotels & Properties", logo: "/assets/customers/logos/sun.png" },
  { name: "Christ University", logo: "/assets/customers/logos/christ-university.png" },
  { name: "DFH Auditing", logo: "/assets/customers/logos/dfh.png" },
  { name: "CADAC", logo: "/assets/customers/logos/cadac.png" },
  { name: "Aviation Services", logo: "/assets/customers/logos/aviation-services.png" },
  { name: "Q Trainer", logo: "/assets/customers/logos/q-trainer.png" },
  { name: "Alpha Design Technologies", logo: "/assets/customers/logos/alpha-design.png" },
  { name: "MomentuX", logo: "/assets/customers/logos/momentux.png" },
  { name: "JRP Interiors", logo: "/assets/customers/logos/jrp-interiors.png" },
];

const LogoCard = ({ client }) => {
  return (
    <div
      className="
        flex items-center justify-center px-4 py-2 shrink-0
        w-[170px] sm:w-[210px] h-[72px] sm:h-[84px]
        select-none cursor-pointer group/logo
        rounded-xl hover:bg-slate-50/70
        transition-all duration-200 hover:scale-108
      "
      title={client.name}
    >
      <img
        src={client.logo}
        alt={client.name}
        className="max-h-[50px] sm:max-h-[58px] max-w-[150px] sm:max-w-[185px] w-auto h-auto object-contain transition-all duration-200 group-hover/logo:brightness-105"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          if (e.currentTarget.nextSibling) {
            e.currentTarget.nextSibling.style.display = "block";
          }
        }}
      />
      <span className="hidden text-xs font-bold text-[#121C46] truncate text-center">
        {client.name}
      </span>
    </div>
  );
};

const MarqueeRow = ({ items, direction = "left", speed = "42s" }) => {
  // Duplicate list to achieve 100% seamless infinite scroll
  const doubleList = [...items, ...items];
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative w-full overflow-hidden py-1 group">
      <div
        className={`flex gap-8 sm:gap-12 w-max ${animClass} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: speed }}
      >
        {doubleList.map((client, idx) => (
          <LogoCard key={`${client.name}-${idx}`} client={client} />
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
      <div className="flex flex-col gap-3.5 sm:gap-4 relative z-10">
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
          <span>70+ Verified Corporate, Aerospace &amp; Institutional Logos</span>
        </span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>Aerospace, Automotive, Heavy Engineering &amp; Technology Sectors</span>
      </div>
    </div>
  );
};

export default PartnerMarquee4Rows;
