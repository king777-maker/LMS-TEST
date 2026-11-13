import React from "react";

/**
 * AboutHeroIllustration
 * Bespoke, lightweight SVG illustration matching Broadbeach Academy's
 * editorial design system: navy linework (#121C46), warm orange (#F97316),
 * bright yellow (#FFC400), and vibrant blue (#2563EB).
 */
const AboutHeroIllustration = ({ className = "" }) => {
  return (
    <div className={`relative w-full max-w-[560px] mx-auto ${className}`}>
      {/* Background Soft Aura */}
      <div
        className="absolute -top-6 -left-6 w-72 h-72 rounded-full bg-blue-100/40 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-orange-100/35 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm select-none"
        aria-labelledby="hero-illustration-title hero-illustration-desc"
        role="img"
      >
        <title id="hero-illustration-title">Broadbeach Academy Collaborative Learning</title>
        <desc id="hero-illustration-desc">
          Professionals collaborating around digital learning tools, ISO frameworks, and certification milestones.
        </desc>

        <defs>
          {/* Subtle Gradients */}
          <linearGradient id="deskGrad" x1="50" y1="360" x2="550" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="cardGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#121C46" />
            <stop offset="1" stopColor="#1E2E6E" />
          </linearGradient>

          <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#121C46" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* 1. Backdrop Studio Base & Architectural Arch */}
        <path
          d="M120 420 C120 220 480 220 480 420 Z"
          fill="#F6F8FC"
          stroke="#E2E8F0"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* Geometric Decorative Rings */}
        <circle cx="300" cy="220" r="160" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="300" cy="220" r="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

        {/* Floating Abstract Element 1: ISO Standards Badge (Top Left) */}
        <g transform="translate(42, 90)" filter="url(#cardShadow)">
          <rect width="168" height="62" rx="15" fill="url(#cardGrad1)" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="30" cy="31" r="16" fill="#EFF6FF" />
          <path
            d="M30 21 L35.5 23.5 L35.5 31 C35.5 35.5 30 39 30 39 C30 39 24.5 35.5 24.5 31 L24.5 23.5 Z"
            fill="#2563EB"
          />
          <path d="M28.5 30.5 L30 32 L33 28.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="54" y="28" fill="#121C46" fontSize="10.5" fontWeight="700" fontFamily="sans-serif">ISO STANDARDS</text>
          <text x="54" y="42" fill="#475569" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Audited &amp; Verified</text>
        </g>

        {/* Floating Abstract Element 2: Completion Rate Card (Top Right) */}
        <g transform="translate(410, 80)" filter="url(#cardShadow)">
          <rect width="135" height="74" rx="16" fill="url(#cardGrad1)" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="35" cy="37" r="18" fill="#FFF7ED" />
          {/* Mini Chart Arc */}
          <circle cx="35" cy="37" r="12" stroke="#FED7AA" strokeWidth="3" fill="none" />
          <path
            d="M 35 25 A 12 12 0 1 1 23.3 40"
            fill="none"
            stroke="#F97316"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <text x="63" y="33" fill="#121C46" fontSize="13" fontWeight="800" fontFamily="sans-serif">98.4%</text>
          <text x="63" y="47" fill="#475569" fontSize="9" fontWeight="500" fontFamily="sans-serif">Course Success</text>
        </g>

        {/* Floating Abstract Element 3: Verified Certificate Icon Tile (Right Mid) */}
        <g transform="translate(470, 240)" filter="url(#cardShadow)">
          <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="20" fill="#FEF3C7" />
          <path
            d="M32 20 L35 27 L42 28 L37 33 L38 40 L32 36 L26 40 L27 33 L22 28 L29 27 Z"
            fill="#FFC400"
            stroke="#D97706"
            strokeWidth="1"
          />
        </g>

        {/* Floating Abstract Element 4: Digital Tablet / Skill Module (Left Mid) */}
        <g transform="translate(40, 260)" filter="url(#cardShadow)">
          <rect width="120" height="70" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="14" y="16" width="30" height="4" rx="2" fill="#2563EB" />
          <rect x="14" y="26" width="80" height="4" rx="2" fill="#E2E8F0" />
          <rect x="14" y="36" width="60" height="4" rx="2" fill="#E2E8F0" />
          <rect x="14" y="48" width="45" height="12" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <text x="24" y="57" fill="#121C46" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">TRACK 01</text>
        </g>

        {/* 2. Central Desk / Collaborative Pod Base */}
        <ellipse cx="300" cy="420" rx="230" ry="24" fill="#E2E8F0" opacity="0.6" />
        <path
          d="M90 420 C90 410 110 405 300 405 C490 405 510 410 510 420 L480 436 L120 436 Z"
          fill="url(#deskGrad)"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Laptop & Learning Screen */}
        <g transform="translate(225, 275)">
          {/* Laptop Screen */}
          <rect x="20" y="20" width="110" height="76" rx="8" fill="url(#screenGrad)" stroke="#121C46" strokeWidth="2.5" />
          <rect x="25" y="25" width="100" height="66" rx="4" fill="#1E2E6E" />
          {/* Screen Code/Modules UI */}
          <rect x="32" y="34" width="40" height="4" rx="2" fill="#60A5FA" />
          <rect x="32" y="42" width="65" height="3" rx="1.5" fill="#93C5FD" opacity="0.7" />
          <rect x="32" y="48" width="50" height="3" rx="1.5" fill="#93C5FD" opacity="0.7" />
          <rect x="32" y="54" width="75" height="3" rx="1.5" fill="#93C5FD" opacity="0.7" />
          {/* Screen Mini Badge */}
          <circle cx="98" cy="40" r="10" fill="#F97316" />
          <path d="M95 40 L97 42 L101 38" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Laptop Base */}
          <path d="M10 96 L140 96 L150 102 L0 102 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <rect x="62" y="97" width="26" height="2" rx="1" fill="#475569" />
        </g>

        {/* 3. Character 1 (Left): Professional Instructor / Learner in Navy/Orange */}
        <g transform="translate(130, 210)">
          {/* Body / Torso */}
          <path
            d="M30 150 C30 110 50 100 85 100 C120 100 140 110 140 150 Z"
            fill="#121C46"
            stroke="#121C46"
            strokeWidth="2"
          />
          {/* Collar / Tie Accent */}
          <path d="M80 100 L85 125 L90 100" fill="#FFFFFF" />
          <path d="M84 110 L86 110 L88 135 L82 135 Z" fill="#F97316" />
          {/* Head & Neck */}
          <rect x="76" y="80" width="18" height="22" rx="4" fill="#FDBA74" />
          <ellipse cx="85" cy="62" rx="24" ry="28" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />
          {/* Hair */}
          <path
            d="M62 55 C60 30 85 24 105 32 C115 37 110 58 108 60 C100 50 75 48 62 55 Z"
            fill="#1E293B"
          />
          {/* Glasses */}
          <rect x="68" y="56" width="14" height="10" rx="3" fill="none" stroke="#121C46" strokeWidth="1.8" />
          <rect x="88" y="56" width="14" height="10" rx="3" fill="none" stroke="#121C46" strokeWidth="1.8" />
          <line x1="82" y1="61" x2="88" y2="61" stroke="#121C46" strokeWidth="1.8" />
          {/* Smile */}
          <path d="M80 74 Q85 78 90 74" stroke="#121C46" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Arm pointing towards laptop */}
          <path
            d="M125 120 C145 130 160 140 175 130"
            fill="none"
            stroke="#121C46"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx="178" cy="129" r="6" fill="#FED7AA" />
        </g>

        {/* 4. Character 2 (Right): Professional Auditor / Female Learner */}
        <g transform="translate(340, 205)">
          {/* Body / Blazer in Blue */}
          <path
            d="M35 155 C35 115 55 105 85 105 C115 105 135 115 135 155 Z"
            fill="#2563EB"
            stroke="#1E40AF"
            strokeWidth="2"
          />
          {/* Inner Shirt in Yellow */}
          <path d="M75 105 Q85 125 95 105 Z" fill="#FFC400" />
          {/* Head & Neck */}
          <rect x="76" y="85" width="18" height="22" rx="4" fill="#FDBA74" />
          <ellipse cx="85" cy="65" rx="23" ry="27" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />
          {/* Hair (Bun Style with Pen) */}
          <path
            d="M60 62 C58 35 80 25 108 32 C118 42 112 68 110 72 C98 52 70 52 60 62 Z"
            fill="#0F172A"
          />
          <circle cx="85" cy="24" r="14" fill="#0F172A" />
          {/* Hairpin / Accent */}
          <line x1="72" y1="20" x2="98" y2="16" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          {/* Smile & Eyes */}
          <circle cx="77" cy="62" r="2.2" fill="#121C46" />
          <circle cx="93" cy="62" r="2.2" fill="#121C46" />
          <path d="M80 73 Q85 77 90 73" stroke="#121C46" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Notepad / Clipboard in Hand */}
          <g transform="translate(18, 125) rotate(-10)">
            <rect width="36" height="46" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="11" y="2" width="14" height="5" rx="2" fill="#94A3B8" />
            <line x1="8" y1="16" x2="28" y2="16" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="23" x2="24" y2="23" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="30" x2="26" y2="30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="37" x2="18" y2="37" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Small Floating Sparkles & Dots */}
        <circle cx="210" cy="150" r="3" fill="#FFC400" />
        <circle cx="380" cy="170" r="2.5" fill="#F97316" />
        <circle cx="160" cy="380" r="3.5" fill="#2563EB" opacity="0.6" />
        <circle cx="460" cy="390" r="4" fill="#FFC400" opacity="0.7" />

        <path
          d="M280 120 L283 128 L291 131 L283 134 L280 142 L277 134 L269 131 L277 128 Z"
          fill="#FFC400"
          opacity="0.9"
        />
        <path
          d="M335 105 L337 111 L343 113 L337 115 L335 121 L333 115 L327 113 L333 111 Z"
          fill="#F97316"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export default AboutHeroIllustration;
