import React from "react";

/**
 * ApprovalsIllustration — Animated Cartoon Illustration for Our Approvals page
 * Features:
 * - Professional quality evaluator with audit portfolio and certification documents
 * - International standard certificate with gold wax seal, security watermark, and QR scanner
 * - Animated drawing checkmark, laser QR scanner beam, floating ISO compliance dossiers
 * - Broadbeach brand palette (navy #121C46, orange #F97316, yellow #FFDB58, blue #2563EB)
 * - Accessible: Respects prefers-reduced-motion
 */
const ApprovalsIllustration = ({ className = "w-full h-auto max-w-[560px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 via-blue-100/30 to-amber-100/30 rounded-3xl filter blur-2xl pointer-events-none transform -rotate-1 scale-95"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-auto drop-shadow-sm"
        aria-label="Illustration representing Broadbeach Academy's accredited standards, audit approvals, and verifiable certification"
        role="img"
      >
        <defs>
          <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id="certBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>

          <filter id="certShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>

          <filter id="badgeShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.1" />
          </filter>

          <style>{`
            @keyframes checkDraw {
              0% { stroke-dashoffset: 40; }
              45%, 100% { stroke-dashoffset: 0; }
            }
            @keyframes laserSweep {
              0%, 100% { transform: translateY(0px); opacity: 0.2; }
              50% { transform: translateY(54px); opacity: 0.9; }
            }
            @keyframes floatCert {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-7px); }
            }
            @keyframes sealShimmer {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(245, 158, 11, 0)); }
              50% { transform: scale(1.05); filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); }
            }
            .anim-check {
              stroke-dasharray: 40;
              animation: checkDraw 3s ease-in-out infinite;
            }
            .anim-laser {
              animation: laserSweep 2.5s ease-in-out infinite;
            }
            .anim-float-c {
              animation: floatCert 4s ease-in-out infinite;
            }
            .anim-seal {
              transform-origin: 395px 285px;
              animation: sealShimmer 3s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .anim-check, .anim-laser, .anim-float-c, .anim-seal {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* 1. Ground Platform */}
        <ellipse cx="300" cy="415" rx="270" ry="24" fill="#CBD5E1" opacity="0.5" />
        <ellipse cx="300" cy="412" rx="230" ry="16" fill="#F1F5F9" />

        {/* ========================================================= */}
        {/* 2. STACK OF ISO STANDARDS DOSSIERS (Left Background)       */}
        {/* ========================================================= */}
        <g id="iso-books" transform="translate(185, 305)">
          {/* Bottom Book: ISO 27001 (Navy) */}
          <rect x="0" y="45" width="105" height="18" rx="3" fill="#121C46" />
          <rect x="0" y="48" width="8" height="12" rx="1" fill="#FFC400" />
          <line x1="16" y1="54" x2="90" y2="54" stroke="#94A3B8" strokeWidth="2" />
          <text x="50" y="58" fill="#FFFFFF" fontSize="8" fontWeight="bold">ISO 27001</text>

          {/* Middle Book: ISO 14001 (Emerald) */}
          <rect x="5" y="26" width="100" height="18" rx="3" fill="#059669" />
          <rect x="5" y="29" width="8" height="12" rx="1" fill="#FFFFFF" />
          <line x1="20" y1="35" x2="85" y2="35" stroke="#A7F3D0" strokeWidth="2" />
          <text x="52" y="39" fill="#FFFFFF" fontSize="8" fontWeight="bold">ISO 14001</text>

          {/* Top Book: ISO 9001 (Royal Blue) */}
          <rect x="10" y="7" width="95" height="18" rx="3" fill="#2563EB" />
          <rect x="10" y="10" width="8" height="12" rx="1" fill="#FFDB58" />
          <line x1="25" y1="16" x2="85" y2="16" stroke="#93C5FD" strokeWidth="2" />
          <text x="54" y="20" fill="#FFFFFF" fontSize="8" fontWeight="bold">ISO 9001:2015</text>
        </g>

        {/* ========================================================= */}
        {/* 3. OFFICIAL STANDARDS CERTIFICATE (Center Feature)        */}
        {/* ========================================================= */}
        <g id="certificate-doc" className="anim-float-c" style={{ transformOrigin: "350px 200px" }}>
          {/* Certificate Container */}
          <rect
            x="245"
            y="70"
            width="250"
            height="270"
            rx="14"
            fill="url(#certGrad)"
            stroke="#E2E8F0"
            strokeWidth="2"
            filter="url(#certShadow)"
          />

          {/* Gold Decorative Inner Border */}
          <rect
            x="257"
            y="82"
            width="226"
            height="246"
            rx="10"
            fill="none"
            stroke="url(#certBorderGrad)"
            strokeWidth="2"
            strokeDasharray="16 2"
          />

          {/* Certificate Header Banner */}
          <rect x="285" y="96" width="170" height="24" rx="4" fill="#121C46" />
          <text x="370" y="112" fill="#FFC400" fontSize="9.5" fontWeight="extrabold" textAnchor="middle" letterSpacing="1">
            STANDARDS CONFORMANCE
          </text>

          {/* Certificate Body Lines */}
          <line x1="285" y1="135" x2="455" y2="135" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="305" y1="148" x2="435" y2="148" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="295" y1="160" x2="445" y2="160" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

          {/* ISO Badge Matrix on Certificate */}
          <g transform="translate(275, 175)">
            <rect x="0" y="0" width="85" height="34" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
            <circle cx="14" cy="17" r="8" fill="#EFF6FF" />
            <path d="M11 17 L13 19 L17 14" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <text x="28" y="16" fill="#121C46" fontSize="8" fontWeight="bold">ISO 19011:2018</text>
            <text x="28" y="25" fill="#64748B" fontSize="6.5">Auditing Standard</text>

            <rect x="95" y="0" width="85" height="34" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
            <circle cx="109" cy="17" r="8" fill="#ECFDF5" />
            <path d="M106 17 L108 19 L112 14" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <text x="123" y="16" fill="#121C46" fontSize="8" fontWeight="bold">ISO 9001 / 14001</text>
            <text x="123" y="25" fill="#64748B" fontSize="6.5">Lead Auditor Specs</text>
          </g>

          {/* Signatures & Serial Number */}
          <line x1="280" y1="242" x2="340" y2="242" stroke="#475569" strokeWidth="1.5" />
          <path d="M285 238 Q295 230 305 239 Q315 245 325 236 Q335 232 338 240" stroke="#2563EB" strokeWidth="1.5" fill="none" />
          <text x="310" y="252" fill="#94A3B8" fontSize="7" textAnchor="middle">Academic Director</text>

          {/* Unique Serial & Verifiable ID */}
          <rect x="275" y="265" width="100" height="18" rx="4" fill="#F1F5F9" />
          <text x="325" y="277" fill="#475569" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.8">
            ID: BB-ISO-9824-VERIFIED
          </text>

          {/* Official Gold Embossed Wax Seal */}
          <g className="anim-seal">
            <g transform="translate(395, 275)">
              {/* Ribbon Tails */}
              <polygon points="-8,10 -16,40 -4,34 0,42 -2,10" fill="#DC2626" />
              <polygon points="8,10 16,40 4,34 0,42 2,10" fill="#B91C1C" />
              {/* Gold Seal Medallion */}
              <circle cx="0" cy="0" r="24" fill="url(#certBorderGrad)" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="0" cy="0" r="19" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Seal Star */}
              <polygon points="0,-10 3,-3 10,-3 5,2 7,9 0,5 -7,9 -5,2 -10,-3 -3,-3" fill="#FFFFFF" />
            </g>
          </g>
        </g>

        {/* ========================================================= */}
        {/* 4. DIGITAL QR VERIFICATION SCANNER PHONE (Right)          */}
        {/* ========================================================= */}
        <g id="verification-scanner" transform="translate(450, 160)" filter="url(#badgeShadow)">
          {/* Smartphone Frame */}
          <rect x="0" y="0" width="95" height="170" rx="16" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          {/* Screen */}
          <rect x="5" y="10" width="85" height="150" rx="10" fill="#FFFFFF" />
          <rect x="35" y="4" width="25" height="4" rx="2" fill="#334155" />

          {/* Screen Content: Instant Online Verification */}
          <rect x="15" y="20" width="65" height="14" rx="3" fill="#EFF6FF" />
          <text x="47" y="30" fill="#2563EB" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            VERIFICATION
          </text>

          {/* QR Code Container */}
          <rect x="17" y="42" width="61" height="61" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          {/* QR Markers */}
          <rect x="23" y="48" width="16" height="16" fill="#121C46" />
          <rect x="25" y="50" width="12" height="12" fill="#FFFFFF" />
          <rect x="28" y="53" width="6" height="6" fill="#121C46" />

          <rect x="56" y="48" width="16" height="16" fill="#121C46" />
          <rect x="58" y="50" width="12" height="12" fill="#FFFFFF" />
          <rect x="61" y="53" width="6" height="6" fill="#121C46" />

          <rect x="23" y="81" width="16" height="16" fill="#121C46" />
          <rect x="25" y="83" width="12" height="12" fill="#FFFFFF" />
          <rect x="28" y="86" width="6" height="6" fill="#121C46" />

          {/* Random QR Pixels */}
          <rect x="45" y="50" width="5" height="5" fill="#121C46" />
          <rect x="43" y="62" width="8" height="5" fill="#121C46" />
          <rect x="55" y="70" width="5" height="5" fill="#121C46" />
          <rect x="65" y="75" width="5" height="5" fill="#121C46" />
          <rect x="44" y="85" width="6" height="6" fill="#121C46" />

          {/* Laser Scanning Beam Sweep */}
          <g transform="translate(17, 44)">
            <rect x="0" y="0" width="61" height="5" rx="2" fill="url(#laserGrad)" className="anim-laser" />
          </g>

          {/* Verified Status Pill */}
          <rect x="14" y="115" width="67" height="20" rx="10" fill="#10B981" />
          <path d="M25 125 L29 128 L35 121" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="49" y="129" fill="#FFFFFF" fontSize="8" fontWeight="bold">
            VALIDATED
          </text>
          <text x="47" y="146" fill="#64748B" fontSize="6.5" textAnchor="middle">
            Registry 100% Match
          </text>
        </g>

        {/* ========================================================= */}
        {/* 5. CHARACTER (LEFT): Professional Compliance Auditor       */}
        {/* ========================================================= */}
        <g id="char-auditor">
          {/* Shadow */}
          <ellipse cx="120" cy="405" rx="35" ry="8" fill="#CBD5E1" opacity="0.6" />

          {/* Legs & Navy Tailored Trousers */}
          <rect x="106" y="295" width="13" height="103" rx="6" fill="#0F172A" />
          <rect x="122" y="295" width="13" height="103" rx="6" fill="#1E293B" />
          <ellipse cx="110" cy="398" rx="10" ry="5" fill="#0F172A" />
          <ellipse cx="130" cy="398" rx="10" ry="5" fill="#0F172A" />

          {/* Torso: Fitted Navy Audit Blazer */}
          <path d="M98 215 C98 195, 142 195, 142 215 L145 300 L95 300 Z" fill="#121C46" />
          {/* Crisp White Shirt & Gold Lanyard */}
          <polygon points="112,210 120,245 128,210" fill="#FFFFFF" />
          <path d="M116 210 L120 250 L124 210" stroke="#F59E0B" strokeWidth="2" fill="none" />
          {/* Auditor ID Badge dangling */}
          <rect x="114" y="250" width="12" height="16" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="116" y="252" width="8" height="4" fill="#2563EB" />

          {/* Right Arm: Thumbs-up / Pointing proudly */}
          <path d="M140 220 Q165 200 178 185" stroke="#121C46" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="180" cy="182" r="6" fill="#FCD34D" />
          {/* Thumbs-up gesture */}
          <path d="M180 182 L182 173" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="182" cy="172" r="2.5" fill="#FCD34D" />

          {/* Left Arm: Holding Audit Clipboard */}
          <path d="M98 220 Q82 250 95 272" stroke="#121C46" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="97" cy="274" r="6" fill="#FCD34D" />

          {/* Clipboard */}
          <rect x="76" y="250" width="34" height="48" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
          <rect x="88" y="246" width="10" height="6" rx="1" fill="#CBD5E1" />
          <rect x="80" y="256" width="26" height="38" rx="2" fill="#FFFFFF" />
          {/* Clipboard checkmarks */}
          <path d="M83 264 L85 266 L89 262" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="91" y1="264" x2="103" y2="264" stroke="#475569" strokeWidth="1.2" />
          <path d="M83 273 L85 275 L89 271" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="91" y1="273" x2="103" y2="273" stroke="#475569" strokeWidth="1.2" />
          <path d="M83 282 L85 284 L89 280" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="91" y1="282" x2="100" y2="282" stroke="#475569" strokeWidth="1.2" />

          {/* Neck */}
          <rect x="116" y="192" width="9" height="15" fill="#FCD34D" rx="3" />

          {/* Head & Face */}
          <circle cx="120" cy="174" r="22" fill="#FCD34D" />
          {/* Professional Bob Hairstyle */}
          <path d="M100 174 C96 148, 144 148, 140 174 C136 160, 104 160, 100 174 Z" fill="#1E293B" />
          <path d="M98 174 L98 192 L105 180 Z" fill="#1E293B" />
          <path d="M142 174 L142 192 L135 180 Z" fill="#1E293B" />
          {/* Confident, approachable eyes & smile */}
          <circle cx="113" cy="173" r="2" fill="#1E293B" />
          <circle cx="127" cy="173" r="2" fill="#1E293B" />
          <path d="M116 183 Q120 188 125 183" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="108" cy="180" r="2.5" fill="#F87171" opacity="0.4" />
          <circle cx="132" cy="180" r="2.5" fill="#F87171" opacity="0.4" />
        </g>

        {/* ========================================================= */}
        {/* 6. FLOATING TRUST SHIELD WITH ANIMATED CHECKMARK          */}
        {/* ========================================================= */}
        <g className="anim-float-c" style={{ transformOrigin: "215px 105px" }}>
          <g transform="translate(180, 70)" filter="url(#certShadow)">
            {/* Green Shield */}
            <path
              d="M35 10 Q55 10 65 24 Q65 52 35 68 Q5 52 5 24 Q15 10 35 10 Z"
              fill="url(#shieldGrad)"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            {/* Inner Shield Rim */}
            <path
              d="M35 15 Q50 15 58 26 Q58 48 35 61 Q12 48 12 26 Q20 15 35 15 Z"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth="1.2"
              opacity="0.6"
            />
            {/* Drawing Checkmark Animation */}
            <path
              d="M22 36 L31 45 L48 27"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="anim-check"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ApprovalsIllustration;
