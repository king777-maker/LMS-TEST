import React from "react";

/**
 * VisionIllustration — Animated Cartoon Illustration for Our Vision page
 * Features:
 * - Forward-looking professionals viewing a global digital learning network
 * - 3D-styled globe with glowing orbital rings, connected ISO nodes, rocket launch, and holographic cap
 * - Broadbeach brand palette (navy #121C46, orange #F97316, yellow #FFDB58, blue #2563EB)
 * - Accessible: Respects prefers-reduced-motion
 */
const VisionIllustration = ({ className = "w-full h-auto max-w-[560px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-amber-100/30 rounded-3xl filter blur-2xl pointer-events-none transform rotate-1 scale-95"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-auto drop-shadow-sm"
        aria-label="Illustration representing Broadbeach Academy's vision for global learning and innovation"
        role="img"
      >
        <defs>
          <linearGradient id="globeOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="globeGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>

          <filter id="visionGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="visionCardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.1" />
          </filter>

          <style>{`
            @keyframes orbitSpin {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 400; }
            }
            @keyframes rocketHover {
              0%, 100% { transform: translateY(0px) rotate(-35deg); }
              50% { transform: translateY(-8px) rotate(-33deg); }
            }
            @keyframes flameFlicker {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.18, 1.25); opacity: 1; }
            }
            @keyframes nodePulse {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.15); opacity: 1; }
            }
            @keyframes beamPulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 0.85; }
            }
            @keyframes floatVision {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-7px); }
            }
            .anim-orbit-line {
              animation: orbitSpin 20s linear infinite;
            }
            .anim-rocket {
              transform-origin: 430px 110px;
              animation: rocketHover 3.5s ease-in-out infinite;
            }
            .anim-flame {
              transform-origin: 418px 125px;
              animation: flameFlicker 0.4s ease-in-out infinite alternate;
            }
            .anim-node {
              animation: nodePulse 2.8s ease-in-out infinite;
            }
            .anim-beam {
              animation: beamPulse 3s ease-in-out infinite;
            }
            .anim-float-v {
              animation: floatVision 3.8s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .anim-orbit-line, .anim-rocket, .anim-flame, .anim-node, .anim-beam, .anim-float-v {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* 1. Observation Balcony Platform */}
        <ellipse cx="300" cy="415" rx="270" ry="24" fill="#CBD5E1" opacity="0.5" />
        <path d="M40 375 L560 375 L530 425 L70 425 Z" fill="#F1F5F9" />
        <line x1="40" y1="375" x2="560" y2="375" stroke="#94A3B8" strokeWidth="3" />
        
        {/* Balcony Railing Glass Panels */}
        <rect x="70" y="335" width="90" height="40" rx="3" fill="#FFFFFF" fillOpacity="0.7" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="180" y="335" width="90" height="40" rx="3" fill="#FFFFFF" fillOpacity="0.7" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="330" y="335" width="90" height="40" rx="3" fill="#FFFFFF" fillOpacity="0.7" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="440" y="335" width="90" height="40" rx="3" fill="#FFFFFF" fillOpacity="0.7" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="40" y1="335" x2="560" y2="335" stroke="#64748B" strokeWidth="3" />

        {/* ========================================================= */}
        {/* 2. CENTRAL 3D VECTOR GLOBE (Global Learning Horizon)       */}
        {/* ========================================================= */}
        <g id="central-globe" transform="translate(320, 180)">
          {/* Globe Atmosphere Glow */}
          <circle cx="0" cy="0" r="115" fill="#3B82F6" opacity="0.12" filter="url(#visionGlow)" />
          {/* Globe Sphere */}
          <circle cx="0" cy="0" r="105" fill="url(#globeOceanGrad)" stroke="#60A5FA" strokeWidth="2.5" />

          {/* Graticule / Latitude & Longitude Wireframe */}
          <ellipse cx="0" cy="0" rx="105" ry="35" fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />
          <ellipse cx="0" cy="0" rx="105" ry="70" fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />
          <ellipse cx="0" cy="0" rx="35" ry="105" fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />
          <ellipse cx="0" cy="0" rx="70" ry="105" fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />
          <line x1="-105" y1="0" x2="105" y2="0" stroke="#38BDF8" strokeWidth="1.5" opacity="0.5" />
          <line x1="0" y1="-105" x2="0" y2="105" stroke="#38BDF8" strokeWidth="1.5" opacity="0.5" />

          {/* Stylized Continents */}
          {/* Eurasia & Africa */}
          <path
            d="M-40 -60 Q-25 -75 5 -65 Q35 -50 40 -20 Q25 15 10 30 Q-5 45 -15 20 Q-30 0 -50 -10 Q-60 -35 -40 -60 Z"
            fill="#10B981"
            opacity="0.85"
          />
          {/* Americas */}
          <path
            d="M-85 -45 Q-70 -60 -55 -40 Q-50 -10 -65 15 Q-75 40 -80 60 Q-90 35 -85 -45 Z"
            fill="#34D399"
            opacity="0.75"
          />
          {/* Asia-Pacific Islands */}
          <circle cx="55" cy="-10" r="5" fill="#34D399" />
          <circle cx="70" cy="15" r="7" fill="#34D399" />
          <ellipse cx="65" cy="45" rx="16" ry="10" fill="#10B981" opacity="0.8" />

          {/* Pulsing City Hubs */}
          <circle cx="0" cy="-35" r="4" fill="#FFC400" className="anim-node" />
          <circle cx="35" cy="-15" r="4" fill="#FFC400" className="anim-node" />
          <circle cx="-65" cy="-20" r="4" fill="#FFC400" className="anim-node" />
          <circle cx="20" cy="25" r="4" fill="#FFC400" className="anim-node" />

          {/* Connection Arc Beams */}
          <path d="M0 -35 Q20 -50 35 -15" stroke="#FDE047" strokeWidth="1.8" strokeDasharray="3 3" fill="none" className="anim-beam" />
          <path d="M-65 -20 Q-30 -45 0 -35" stroke="#FDE047" strokeWidth="1.8" strokeDasharray="3 3" fill="none" className="anim-beam" />
          <path d="M35 -15 Q40 10 20 25" stroke="#FDE047" strokeWidth="1.8" strokeDasharray="3 3" fill="none" className="anim-beam" />

          {/* Inner Light Reflection */}
          <path d="M-80 -60 Q-30 -100 40 -70" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>

        {/* ========================================================= */}
        {/* 3. 3D ORBITAL RINGS & FLOATING ISO NODES                  */}
        {/* ========================================================= */}
        {/* Orbit Ring 1 (Tilted Ellipse) */}
        <ellipse
          cx="320"
          cy="180"
          rx="170"
          ry="65"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="8 6"
          transform="rotate(-20 320 180)"
          className="anim-orbit-line"
          opacity="0.75"
        />

        {/* Orbit Ring 2 (Counter-Tilted Ellipse) */}
        <ellipse
          cx="320"
          cy="180"
          rx="185"
          ry="55"
          fill="none"
          stroke="#F97316"
          strokeWidth="1.8"
          strokeDasharray="6 6"
          transform="rotate(25 320 180)"
          className="anim-orbit-line"
          opacity="0.65"
        />

        {/* Node A: ISO 9001 (Quality) Pill Badge */}
        <g className="anim-float-v" style={{ transformOrigin: "175px 125px" }}>
          <g transform="translate(135, 110)" filter="url(#visionCardShadow)">
            <rect x="0" y="0" width="82" height="28" rx="14" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="14" cy="14" r="6" fill="#2563EB" />
            <path d="M11 14 L13 16 L17 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="48" y="18" fill="#121C46" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              ISO 9001
            </text>
          </g>
        </g>

        {/* Node B: ISO 27001 (Cybersecurity) Badge */}
        <g className="anim-float-v" style={{ transformOrigin: "475px 230px" }}>
          <g transform="translate(435, 215)" filter="url(#visionCardShadow)">
            <rect x="0" y="0" width="88" height="28" rx="14" fill="#121C46" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="15" cy="14" r="6" fill="#38BDF8" />
            <path d="M13 12 H17 V16 H13 Z" fill="white" />
            <text x="52" y="18" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              ISO 27001
            </text>
          </g>
        </g>

        {/* Node C: ISO 14001 (Sustainability) Badge */}
        <g className="anim-float-v" style={{ transformOrigin: "240px 65px" }}>
          <g transform="translate(200, 50)" filter="url(#visionCardShadow)">
            <rect x="0" y="0" width="84" height="28" rx="14" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
            <circle cx="14" cy="14" r="6" fill="#10B981" />
            <circle cx="14" cy="14" r="3" fill="#D1FAE5" />
            <text x="49" y="18" fill="#065F46" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              ISO 14001
            </text>
          </g>
        </g>

        {/* ========================================================= */}
        {/* 4. ROCKET LAUNCH (Career Acceleration)                    */}
        {/* ========================================================= */}
        <g className="anim-rocket">
          {/* Flame Trail */}
          <g className="anim-flame">
            <polygon points="418,125 408,155 428,155" fill="url(#flameGrad)" />
            <polygon points="418,125 413,145 423,145" fill="#FEF08A" />
          </g>

          {/* Rocket Fuselage */}
          <path d="M418 80 Q435 95 435 125 L401 125 Q401 95 418 80 Z" fill="url(#rocketBodyGrad)" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Rocket Nose Cone (Navy) */}
          <path d="M418 80 Q426 88 430 96 L406 96 Q410 88 418 80 Z" fill="#121C46" />
          {/* Porthole Window */}
          <circle cx="418" cy="108" r="6" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="416" cy="106" r="2" fill="#FFFFFF" />
          {/* Fins (Orange) */}
          <polygon points="401,115 390,130 401,128" fill="#F97316" />
          <polygon points="435,115 446,130 435,128" fill="#F97316" />
        </g>

        {/* ========================================================= */}
        {/* 5. FOREGROUND CHARACTERS (Left Balcony)                    */}
        {/* ========================================================= */}
        {/* Character A (Female Visionary with Holographic Tablet) */}
        <g id="char-vision-female">
          {/* Shadow */}
          <ellipse cx="105" cy="400" rx="30" ry="7" fill="#94A3B8" opacity="0.6" />

          {/* Legs */}
          <rect x="94" y="300" width="11" height="95" rx="5" fill="#1E293B" />
          <rect x="108" y="300" width="11" height="95" rx="5" fill="#0F172A" />
          <ellipse cx="98" cy="392" rx="9" ry="4" fill="#0F172A" />
          <ellipse cx="114" cy="392" rx="9" ry="4" fill="#0F172A" />

          {/* Torso: Modern Teal Blazer & Navy Slacks */}
          <path d="M85 220 C85 200, 125 200, 125 220 L128 305 L82 305 Z" fill="#0D9488" />
          <polygon points="98,215 105,245 112,215" fill="#F97316" />

          {/* Arms holding Holo-Tablet */}
          <path d="M85 225 Q70 250 88 268" stroke="#0D9488" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M125 225 Q135 250 115 268" stroke="#0D9488" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="90" cy="270" r="5" fill="#FCD34D" />
          <circle cx="114" cy="270" r="5" fill="#FCD34D" />

          {/* Glowing Holographic Screen from Tablet */}
          <polygon points="85,265 120,265 135,210 75,210" fill="#38BDF8" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="105" cy="235" r="8" fill="#60A5FA" fillOpacity="0.6" />
          <line x1="90" y1="248" x2="120" y2="248" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Neck & Head */}
          <rect x="101" y="196" width="8" height="15" fill="#FCD34D" rx="3" />
          <circle cx="105" cy="180" r="20" fill="#FCD34D" />
          {/* Hair: High bun */}
          <path d="M89 180 C86 155, 124 155, 121 180 C118 168, 92 168, 89 180 Z" fill="#312E81" />
          <circle cx="105" cy="155" r="9" fill="#312E81" />
          {/* Face: Profile gazing right towards the globe */}
          <circle cx="113" cy="178" r="2" fill="#1E293B" />
          <path d="M112 187 Q117 190 120 186" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* Character B (Male Professional Pointing Toward Horizon) */}
        <g id="char-vision-male">
          {/* Shadow */}
          <ellipse cx="170" cy="395" rx="30" ry="7" fill="#94A3B8" opacity="0.6" />

          {/* Legs */}
          <rect x="158" y="295" width="12" height="95" rx="5" fill="#0F172A" />
          <rect x="174" y="295" width="12" height="95" rx="5" fill="#1E293B" />
          <ellipse cx="162" cy="388" rx="9" ry="4" fill="#0F172A" />
          <ellipse cx="180" cy="388" rx="9" ry="4" fill="#0F172A" />

          {/* Torso: Navy Blue Suit with Gold Tie */}
          <path d="M150 215 C150 195, 195 195, 195 215 L198 300 L148 300 Z" fill="#121C46" />
          {/* White Shirt & Tie */}
          <polygon points="167,212 173,240 178,212" fill="#FFFFFF" />
          <polygon points="171,215 174,248 172,248" fill="#FFC400" />

          {/* Right Arm Pointing Toward the Central Globe */}
          <path d="M192 220 Q225 195 250 175" stroke="#121C46" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="252" cy="174" r="6" fill="#FCD34D" />
          <line x1="252" y1="174" x2="265" y2="166" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Arm Resting on Balcony Rail */}
          <path d="M152 220 Q140 250 148 280" stroke="#121C46" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="148" cy="282" r="5.5" fill="#FCD34D" />

          {/* Neck & Head */}
          <rect x="168" y="192" width="9" height="15" fill="#FCD34D" rx="3" />
          <circle cx="172" cy="176" r="20" fill="#FCD34D" />
          {/* Short Dark Hair */}
          <path d="M155 174 C155 152, 190 152, 190 174 C185 160, 160 160, 155 174 Z" fill="#1E293B" />
          {/* Confident Smile */}
          <circle cx="179" cy="174" r="2" fill="#1E293B" />
          <path d="M178 184 Q183 188 187 184" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* 6. Holographic Floating Graduation Cap (Top Horizon) */}
        <g className="anim-float-v" style={{ transformOrigin: "320px 45px" }}>
          <g transform="translate(300, 25)">
            <polygon points="20,0 42,9 20,18 0,9" fill="#38BDF8" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1.2" />
            <path d="M9 14 L9 22 Q20 28 31 22 L31 14 Z" fill="#0284C7" fillOpacity="0.7" />
            <circle cx="20" cy="9" r="2" fill="#FDE047" />
            <path d="M20 9 Q30 12 32 20" stroke="#FDE047" strokeWidth="1.5" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default VisionIllustration;
