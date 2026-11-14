import React from "react";

/**
 * GlobalReachIllustration — Animated Cartoon Illustration for Global Reach page
 * Features:
 * - 3D vector world globe with connected international learning nodes across 45+ nations
 * - Traveling connection arcs, radiating beacon pins, and diverse global learner avatar bubbles
 * - Broadbeach brand palette (navy #121C46, orange #F97316, yellow #FFDB58, blue #2563EB)
 * - Accessible: Respects prefers-reduced-motion
 */
const GlobalReachIllustration = ({ className = "w-full h-auto max-w-[560px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-cyan-100/30 to-amber-100/30 rounded-3xl filter blur-2xl pointer-events-none transform rotate-1 scale-95"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-auto drop-shadow-sm"
        aria-label="Illustration representing Broadbeach Academy's global learning footprint across 45+ nations"
        role="img"
      >
        <defs>
          <linearGradient id="globalOcean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="60%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>

          <linearGradient id="flightArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <filter id="globalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="cardShadowG" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.1" />
          </filter>

          <style>{`
            @keyframes pulseBeacon {
              0% { r: 4px; opacity: 1; }
              100% { r: 16px; opacity: 0; }
            }
            @keyframes arcDash {
              0% { stroke-dashoffset: 200; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes floatAvatarA {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes floatAvatarB {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-11px); }
            }
            @keyframes planeFly {
              0%, 100% { transform: translateY(0px) rotate(15deg); }
              50% { transform: translateY(-4px) rotate(18deg); }
            }
            .anim-beacon-ring {
              animation: pulseBeacon 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }
            .anim-arc {
              stroke-dasharray: 8 6;
              animation: arcDash 12s linear infinite;
            }
            .anim-avatar-1 {
              animation: floatAvatarA 3.6s ease-in-out infinite;
            }
            .anim-avatar-2 {
              animation: floatAvatarB 4.2s ease-in-out infinite;
            }
            .anim-avatar-3 {
              animation: floatAvatarA 3s ease-in-out infinite;
            }
            .anim-plane {
              animation: planeFly 3s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .anim-beacon-ring, .anim-arc, .anim-avatar-1, .anim-avatar-2, .anim-avatar-3, .anim-plane {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* 1. Base Platform */}
        <ellipse cx="300" cy="415" rx="270" ry="24" fill="#CBD5E1" opacity="0.5" />
        <ellipse cx="300" cy="412" rx="220" ry="16" fill="#F1F5F9" />

        {/* ========================================================= */}
        {/* 2. THE CENTRAL WORLD GLOBE                                */}
        {/* ========================================================= */}
        <g id="world-globe" transform="translate(300, 205)">
          {/* Atmosphere Glow */}
          <circle cx="0" cy="0" r="145" fill="#38BDF8" opacity="0.15" filter="url(#globalGlow)" />
          {/* Globe Sphere */}
          <circle cx="0" cy="0" r="135" fill="url(#globalOcean)" stroke="#38BDF8" strokeWidth="2.5" />

          {/* Latitude / Longitude Curved Grids */}
          <ellipse cx="0" cy="0" rx="135" ry="45" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
          <ellipse cx="0" cy="0" rx="135" ry="90" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
          <ellipse cx="0" cy="0" rx="45" ry="135" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
          <ellipse cx="0" cy="0" rx="90" ry="135" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
          <line x1="-135" y1="0" x2="135" y2="0" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />
          <line x1="0" y1="-135" x2="0" y2="135" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />

          {/* Stylized Continents */}
          {/* Europe & North Africa */}
          <path
            d="M-30 -90 Q-10 -105 20 -95 Q40 -80 35 -50 Q10 -35 -10 -40 Q-35 -45 -45 -70 Z"
            fill="#10B981"
            opacity="0.85"
          />
          {/* Sub-Saharan Africa */}
          <path
            d="M-20 -35 Q5 -30 25 -20 Q30 25 15 55 Q-5 60 -15 35 Q-25 10 -20 -35 Z"
            fill="#059669"
            opacity="0.8"
          />
          {/* Middle East & Central/South Asia */}
          <path
            d="M25 -55 Q55 -70 85 -55 Q100 -20 85 10 Q65 25 45 15 Q30 -5 25 -55 Z"
            fill="#34D399"
            opacity="0.85"
          />
          {/* Americas (Visible West Edge) */}
          <path
            d="M-115 -60 Q-95 -80 -80 -55 Q-75 -20 -90 15 Q-105 50 -120 75 Q-130 40 -125 -10 Z"
            fill="#10B981"
            opacity="0.75"
          />
          {/* Australia & Oceania */}
          <path
            d="M75 55 Q100 45 115 65 Q110 90 90 95 Q70 90 75 55 Z"
            fill="#10B981"
            opacity="0.85"
          />

          {/* ========================================================= */}
          {/* 3. BEACONS & REGIONAL CONNECTIVITY HUBS                   */}
          {/* ========================================================= */}
          {/* Hub 1: Europe (London/Frankfurt) */}
          <g transform="translate(-10, -75)">
            <circle cx="0" cy="0" r="4" fill="#38BDF8" className="anim-beacon-ring" />
            <circle cx="0" cy="0" r="4.5" fill="#FFC400" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Hub 2: Middle East (Dubai) */}
          <g transform="translate(32, -35)">
            <circle cx="0" cy="0" r="4" fill="#F97316" className="anim-beacon-ring" />
            <circle cx="0" cy="0" r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Hub 3: Asia-Pacific (India/Singapore) */}
          <g transform="translate(65, -15)">
            <circle cx="0" cy="0" r="4" fill="#34D399" className="anim-beacon-ring" />
            <circle cx="0" cy="0" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Hub 4: Australia (Sydney) */}
          <g transform="translate(95, 75)">
            <circle cx="0" cy="0" r="4" fill="#FFDB58" className="anim-beacon-ring" />
            <circle cx="0" cy="0" r="4.5" fill="#FFC400" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Hub 5: Americas (New York Corridor) */}
          <g transform="translate(-95, -45)">
            <circle cx="0" cy="0" r="4" fill="#60A5FA" className="anim-beacon-ring" />
            <circle cx="0" cy="0" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Connecting Curved Flight Arcs Across Continents */}
          <path d="M-95 -45 Q-50 -90 -10 -75" stroke="url(#flightArcGrad)" strokeWidth="2.5" fill="none" className="anim-arc" />
          <path d="M-10 -75 Q15 -65 32 -35" stroke="url(#flightArcGrad)" strokeWidth="2.5" fill="none" className="anim-arc" />
          <path d="M32 -35 Q50 -30 65 -15" stroke="url(#flightArcGrad)" strokeWidth="2.5" fill="none" className="anim-arc" />
          <path d="M65 -15 Q85 30 95 75" stroke="url(#flightArcGrad)" strokeWidth="2.5" fill="none" className="anim-arc" />

          {/* Little Airplane Traveling along Arc */}
          <g transform="translate(18, -58)" className="anim-plane">
            <polygon points="0,-5 8,0 0,5 2,0" fill="#FFFFFF" />
            <polygon points="1,-2 4,-7 5,-2" fill="#F97316" />
          </g>
        </g>

        {/* ========================================================= */}
        {/* 4. DIVERSE GLOBAL LEARNER AVATAR BUBBLES                   */}
        {/* ========================================================= */}

        {/* Avatar Bubble 1: European Learner with Headset (Top Left) */}
        <g className="anim-avatar-1" style={{ transformOrigin: "115px 110px" }}>
          <g transform="translate(85, 75)" filter="url(#cardShadowG)">
            <circle cx="35" cy="35" r="32" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            {/* Avatar inside */}
            <circle cx="35" cy="28" r="14" fill="#FCD34D" />
            <path d="M22 26 C22 12, 48 12, 48 26 Z" fill="#92400E" />
            <rect x="23" y="38" width="24" height="20" rx="8" fill="#2563EB" />
            {/* Headset */}
            <path d="M20 28 Q35 15 50 28" stroke="#121C46" strokeWidth="2.5" fill="none" />
            <circle cx="20" cy="28" r="3.5" fill="#121C46" />
            <circle cx="50" cy="28" r="3.5" fill="#121C46" />
            {/* National/Region Pin */}
            <circle cx="58" cy="54" r="9" fill="#121C46" />
            <text x="58" y="57" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">UK</text>
          </g>
        </g>

        {/* Avatar Bubble 2: Asian Lead Auditor with Tablet (Bottom Left) */}
        <g className="anim-avatar-2" style={{ transformOrigin: "115px 300px" }}>
          <g transform="translate(80, 265)" filter="url(#cardShadowG)">
            <circle cx="35" cy="35" r="32" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
            {/* Avatar */}
            <circle cx="35" cy="28" r="14" fill="#FCD34D" />
            <path d="M22 24 C22 12, 48 12, 48 24 Z" fill="#1E293B" />
            <rect x="23" y="38" width="24" height="20" rx="8" fill="#10B981" />
            {/* Eyeglasses */}
            <rect x="28" y="25" width="5" height="4" rx="1" fill="none" stroke="#1E293B" strokeWidth="1" />
            <rect x="37" y="25" width="5" height="4" rx="1" fill="none" stroke="#1E293B" strokeWidth="1" />
            <line x1="33" y1="27" x2="37" y2="27" stroke="#1E293B" strokeWidth="1" />
            {/* Region Pin */}
            <circle cx="58" cy="54" r="9" fill="#F97316" />
            <text x="58" y="57" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">IN</text>
          </g>
        </g>

        {/* Avatar Bubble 3: Middle East/Gulf Professional (Top Right) */}
        <g className="anim-avatar-3" style={{ transformOrigin: "485px 115px" }}>
          <g transform="translate(450, 80)" filter="url(#cardShadowG)">
            <circle cx="35" cy="35" r="32" fill="#FFFFFF" stroke="#F97316" strokeWidth="2.5" />
            {/* Avatar */}
            <circle cx="35" cy="28" r="14" fill="#FCD34D" />
            <path d="M22 23 C22 12, 48 12, 48 23 Z" fill="#0F172A" />
            <rect x="23" y="38" width="24" height="20" rx="8" fill="#F97316" />
            {/* Region Pin */}
            <circle cx="58" cy="54" r="9" fill="#059669" />
            <text x="58" y="57" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">UAE</text>
          </g>
        </g>

        {/* ========================================================= */}
        {/* 5. FLOATING METRIC CARDS                                  */}
        {/* ========================================================= */}
        {/* Pill 1: 45+ Countries Active (Bottom Right) */}
        <g className="anim-avatar-1" style={{ transformOrigin: "480px 290px" }}>
          <g transform="translate(425, 275)" filter="url(#cardShadowG)">
            <rect x="0" y="0" width="125" height="36" rx="18" fill="#121C46" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="18" cy="18" r="9" fill="#2563EB" />
            <text x="18" y="21" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">★</text>
            <text x="70" y="16" fill="#FFC400" fontSize="11" fontWeight="extrabold" textAnchor="middle">
              45+ COUNTRIES
            </text>
            <text x="70" y="27" fill="#93C5FD" fontSize="7.5" textAnchor="middle">
              Active Learner Network
            </text>
          </g>
        </g>

        {/* Pill 2: 24/7 Global Access (Top Center) */}
        <g className="anim-avatar-3" style={{ transformOrigin: "300px 45px" }}>
          <g transform="translate(235, 25)" filter="url(#cardShadowG)">
            <rect x="0" y="0" width="130" height="32" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.8" />
            <circle cx="16" cy="16" r="6" fill="#10B981" />
            <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
            <text x="72" y="15" fill="#121C46" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              24/7 CLOUD LMS
            </text>
            <text x="72" y="25" fill="#64748B" fontSize="7" textAnchor="middle">
              Worldwide Availability
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default GlobalReachIllustration;
