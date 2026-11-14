import React from "react";

/**
 * TeamIllustration — Animated Cartoon Illustration for Our Team page
 * Features:
 * - Diverse team of educators & lead auditors collaborating around laptops and desks
 * - Subtle animations: waving hand, floating graduation cap, floating ISO lead auditor badge, glowing lightbulb
 * - Broadbeach brand palette (navy #121C46, orange #F97316, yellow #FFDB58, blue #2563EB)
 * - Accessible: Respects prefers-reduced-motion
 */
const TeamIllustration = ({ className = "w-full h-auto max-w-[560px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background aura */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-orange-100/30 to-yellow-100/30 rounded-3xl filter blur-2xl pointer-events-none transform -rotate-1 scale-95"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-auto drop-shadow-sm"
        aria-label="Illustration of Broadbeach Academy team members collaborating with educational technology"
        role="img"
      >
        <defs>
          <linearGradient id="teamBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>

          <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="goldSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="teamShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.08" />
          </filter>

          <style>{`
            @keyframes floatSlow {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes floatFast {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-12px) rotate(2deg); }
            }
            @keyframes waveHand {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(14deg); }
              75% { transform: rotate(-8deg); }
            }
            @keyframes pulseIdea {
              0%, 100% { opacity: 0.9; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.08); }
            }
            @keyframes blinkLight {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
            .anim-float-slow {
              animation: floatSlow 4s ease-in-out infinite;
            }
            .anim-float-fast {
              animation: floatFast 3.2s ease-in-out infinite;
            }
            .anim-wave {
              transform-origin: 155px 230px;
              animation: waveHand 2.4s ease-in-out infinite;
            }
            .anim-pulse-idea {
              transform-origin: 300px 95px;
              animation: pulseIdea 2.8s ease-in-out infinite;
            }
            .anim-blink {
              animation: blinkLight 1.8s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .anim-float-slow, .anim-float-fast, .anim-wave, .anim-pulse-idea, .anim-blink {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* 1. Backdrop Backdrop Arc & Platform */}
        <ellipse cx="300" cy="415" rx="270" ry="24" fill="#E2E8F0" opacity="0.6" />
        <ellipse cx="300" cy="412" rx="230" ry="16" fill="#F1F5F9" />

        {/* Modern Window/Board in Background */}
        <rect x="180" y="55" width="240" height="150" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" filter="url(#teamShadow)" />
        <line x1="200" y1="85" x2="260" y2="85" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
        <line x1="200" y1="100" x2="380" y2="100" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="115" x2="340" y2="115" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        
        {/* Board Analytics / Audit Checklist Matrix */}
        <rect x="200" y="130" width="18" height="14" rx="3" fill="#10B981" />
        <path d="M204 137 L207 140 L214 133" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="225" y1="137" x2="280" y2="137" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        <rect x="200" y="152" width="18" height="14" rx="3" fill="#2563EB" />
        <path d="M204 159 L207 162 L214 155" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="225" y1="159" x2="270" y2="159" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        {/* Board Mini Bar Chart */}
        <rect x="330" y="160" width="12" height="24" rx="2" fill="#93C5FD" />
        <rect x="348" y="145" width="12" height="39" rx="2" fill="#F97316" />
        <rect x="366" y="130" width="12" height="54" rx="2" fill="#121C46" />
        <rect x="384" y="120" width="12" height="64" rx="2" fill="#FFC400" />

        {/* 2. Potted Plant (Left Background) */}
        <g transform="translate(45, 270)">
          <path d="M25 70 L15 125 L45 125 L35 70 Z" fill="#94A3B8" />
          <path d="M12 70 L48 70 L46 76 L14 76 Z" fill="#64748B" />
          {/* Leaves */}
          <path d="M30 70 Q10 40 -15 45 Q-10 70 30 70 Z" fill="#10B981" />
          <path d="M30 65 Q45 25 25 -5 Q15 35 30 65 Z" fill="#059669" />
          <path d="M30 65 Q60 40 75 55 Q50 80 30 65 Z" fill="#34D399" />
        </g>

        {/* 3. Desk (Center Workspace) */}
        <rect x="150" y="295" width="300" height="14" rx="7" fill="url(#deskGrad)" filter="url(#teamShadow)" />
        {/* Desk Legs */}
        <rect x="180" y="309" width="10" height="95" rx="3" fill="#94A3B8" />
        <rect x="410" y="309" width="10" height="95" rx="3" fill="#94A3B8" />

        {/* Coffee Mug on Desk */}
        <rect x="195" y="278" width="14" height="17" rx="3" fill="#F97316" />
        <path d="M209 282 Q215 282 215 287 Q215 292 209 292" stroke="#F97316" strokeWidth="2.5" fill="none" />
        <path d="M200 274 Q202 268 200 264" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" fill="none" className="anim-blink" />

        {/* Laptop on Desk */}
        <rect x="260" y="235" width="80" height="54" rx="5" fill="url(#screenGrad)" />
        <rect x="264" y="239" width="72" height="46" rx="3" fill="#1E293B" />
        {/* Laptop Screen Content: Code & Checkmarks */}
        <circle cx="272" cy="246" r="2.5" fill="#EF4444" />
        <circle cx="279" cy="246" r="2.5" fill="#F59E0B" />
        <circle cx="286" cy="246" r="2.5" fill="#10B981" />
        <line x1="272" y1="256" x2="305" y2="256" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
        <line x1="272" y1="263" x2="325" y2="263" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="272" y1="270" x2="295" y2="270" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
        {/* Laptop Base */}
        <path d="M245 289 L355 289 L350 295 L250 295 Z" fill="#94A3B8" />

        {/* ========================================================= */}
        {/* 4. CHARACTER 1 (LEFT): Female Academic Director Standing  */}
        {/* ========================================================= */}
        <g id="char-left">
          {/* Shadow */}
          <ellipse cx="120" cy="405" rx="35" ry="8" fill="#CBD5E1" opacity="0.6" />
          
          {/* Legs & Navy Slacks */}
          <rect x="106" y="300" width="13" height="98" rx="6" fill="#0F172A" />
          <rect x="122" y="300" width="13" height="98" rx="6" fill="#1E293B" />
          {/* Shoes */}
          <ellipse cx="110" cy="398" rx="10" ry="5" fill="#0F172A" />
          <ellipse cx="130" cy="398" rx="10" ry="5" fill="#0F172A" />

          {/* Torso & Navy Blazer */}
          <path d="M98 220 C98 200, 142 200, 142 220 L145 305 L95 305 Z" fill="#121C46" />
          {/* Blouse (Teal / Emerald) */}
          <path d="M110 215 L120 250 L130 215 Z" fill="#10B981" />
          <polygon points="110,215 120,250 120,305 110,305" fill="#0D9488" />

          {/* Left Arm holding Tablet */}
          <path d="M98 225 Q82 255 92 275" stroke="#121C46" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Hand holding tablet */}
          <circle cx="95" cy="275" r="7" fill="#FBBF24" />
          {/* Tablet */}
          <rect x="75" y="258" width="30" height="42" rx="4" fill="#0F172A" transform="rotate(-12 75 258)" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="78" y="262" width="24" height="34" rx="2" fill="#2563EB" transform="rotate(-12 75 258)" />
          <circle cx="89" cy="278" r="4" fill="#FFDB58" />

          {/* Right Arm: Animated Waving Hand */}
          <g className="anim-wave">
            <path d="M140 225 Q158 205 165 175" stroke="#121C46" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="166" cy="170" r="7" fill="#FBBF24" />
            {/* Waving fingers */}
            <path d="M164 167 L168 160" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M168 168 L173 162" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M170 171 L176 166" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Neck */}
          <rect x="116" y="196" width="9" height="16" fill="#FBBF24" rx="3" />

          {/* Head & Face */}
          <circle cx="120" cy="178" r="22" fill="#FCD34D" />
          {/* Hair: Dark Brown Ponytail */}
          <path d="M102 178 C98 152, 142 152, 138 178 C135 165, 105 165, 102 178 Z" fill="#3B2516" />
          <path d="M100 172 Q86 185 84 205 Q92 208 96 190 Z" fill="#3B2516" />
          {/* Eyeglasses */}
          <rect x="110" y="172" width="8" height="6" rx="2" fill="none" stroke="#121C46" strokeWidth="1.8" />
          <rect x="122" y="172" width="8" height="6" rx="2" fill="none" stroke="#121C46" strokeWidth="1.8" />
          <line x1="118" y1="175" x2="122" y2="175" stroke="#121C46" strokeWidth="1.8" />
          {/* Friendly Smile */}
          <path d="M116 188 Q120 193 125 188" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Blushing Cheeks */}
          <circle cx="109" cy="184" r="3" fill="#F87171" opacity="0.5" />
          <circle cx="131" cy="184" r="3" fill="#F87171" opacity="0.5" />
        </g>

        {/* ========================================================= */}
        {/* 5. CHARACTER 2 (CENTER): Male Lead Auditor Working        */}
        {/* ========================================================= */}
        <g id="char-center">
          {/* Chair */}
          <rect x="282" y="270" width="36" height="50" rx="8" fill="#334155" />
          <line x1="300" y1="320" x2="300" y2="390" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
          <line x1="275" y1="390" x2="325" y2="390" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

          {/* Torso: Orange Crewneck Sweater */}
          <path d="M276 250 C276 225, 324 225, 324 250 L320 320 L280 320 Z" fill="#F97316" />
          {/* White Shirt Collar Peeking Out */}
          <polygon points="295,225 300,234 305,225" fill="#FFFFFF" />

          {/* Arms reaching to laptop keyboard */}
          <path d="M276 250 Q265 272 278 288" stroke="#EA580C" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M324 250 Q335 272 322 288" stroke="#EA580C" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="280" cy="289" r="6" fill="#FCD34D" />
          <circle cx="320" cy="289" r="6" fill="#FCD34D" />

          {/* Neck */}
          <rect x="295" y="215" width="10" height="15" fill="#FCD34D" rx="3" />

          {/* Head */}
          <circle cx="300" cy="200" r="21" fill="#FCD34D" />
          {/* Hair: Short cropped dark hair */}
          <path d="M282 198 C282 176, 318 176, 318 198 C314 185, 286 185, 282 198 Z" fill="#1E293B" />
          {/* Eyes & Smile */}
          <circle cx="294" cy="198" r="2" fill="#1E293B" />
          <circle cx="306" cy="198" r="2" fill="#1E293B" />
          <path d="M296 207 Q300 211 304 207" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* ========================================================= */}
        {/* 6. CHARACTER 3 (RIGHT): Senior Quality Advisor Pointing   */}
        {/* ========================================================= */}
        <g id="char-right">
          {/* Shadow */}
          <ellipse cx="480" cy="405" rx="35" ry="8" fill="#CBD5E1" opacity="0.6" />

          {/* Legs & Dark Navy Trousers */}
          <rect x="466" y="300" width="13" height="98" rx="6" fill="#1E293B" />
          <rect x="482" y="300" width="13" height="98" rx="6" fill="#0F172A" />
          {/* Shoes */}
          <ellipse cx="470" cy="398" rx="10" ry="5" fill="#1E293B" />
          <ellipse cx="490" cy="398" rx="10" ry="5" fill="#1E293B" />

          {/* Torso: Bright Yellow Cardigan over Blue Shirt */}
          <path d="M458 220 C458 200, 502 200, 502 220 L505 305 L455 305 Z" fill="#FFC400" />
          <path d="M472 215 L480 250 L488 215 Z" fill="#2563EB" />
          <line x1="480" y1="250" x2="480" y2="305" stroke="#EAB308" strokeWidth="2" />

          {/* Left Arm: Pointing toward Center Board */}
          <path d="M460 225 Q435 210 415 195" stroke="#EAB308" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="413" cy="194" r="6" fill="#FBBF24" />
          <line x1="413" y1="194" x2="405" y2="190" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Arm: Resting by Hip with Notepad */}
          <path d="M500 225 Q515 255 506 280" stroke="#EAB308" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="504" cy="282" r="6" fill="#FBBF24" />
          <rect x="502" y="270" width="20" height="26" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="506" y1="276" x2="518" y2="276" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="506" y1="281" x2="516" y2="281" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Neck */}
          <rect x="476" y="196" width="9" height="16" fill="#FBBF24" rx="3" />

          {/* Head & Hair */}
          <circle cx="480" cy="178" r="22" fill="#FCD34D" />
          {/* Bun hairstyle */}
          <circle cx="480" cy="150" r="11" fill="#475569" />
          <path d="M462 178 C458 152, 502 152, 498 178 C495 165, 465 165, 462 178 Z" fill="#475569" />
          {/* Face details */}
          <circle cx="473" cy="178" r="2" fill="#1E293B" />
          <circle cx="485" cy="178" r="2" fill="#1E293B" />
          <path d="M475 188 Q480 193 485 188" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* ========================================================= */}
        {/* 7. FLOATING ANIMATED BADGES & ICONS                       */}
        {/* ========================================================= */}

        {/* A. Floating Graduation Cap (Top Left) */}
        <g className="anim-float-slow" style={{ transformOrigin: "85px 90px" }}>
          <g transform="translate(65, 65)">
            <ellipse cx="25" cy="30" rx="20" ry="6" fill="#CBD5E1" opacity="0.4" />
            <polygon points="25,5 50,16 25,27 0,16" fill="#121C46" />
            <path d="M12 22 L12 32 Q25 40 38 32 L38 22 Z" fill="#1E3A8A" />
            <circle cx="25" cy="16" r="3" fill="#FFC400" />
            {/* Golden Tassel */}
            <path d="M25 16 Q36 20 38 30" stroke="#FFC400" strokeWidth="2" fill="none" />
            <rect x="36" y="30" width="4" height="6" rx="1" fill="#F59E0B" />
          </g>
        </g>

        {/* B. Floating Idea Lightbulb (Center Top) */}
        <g className="anim-pulse-idea" style={{ transformOrigin: "300px 48px" }}>
          <g transform="translate(285, 25)">
            {/* Glowing rays */}
            <line x1="15" y1="-5" x2="15" y2="-12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="2" x2="34" y2="-3" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="2" y1="2" x2="-4" y2="-3" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bulb */}
            <circle cx="15" cy="15" r="14" fill="#FFDB58" />
            <path d="M10 24 L20 24 L18 29 L12 29 Z" fill="#CBD5E1" />
            <path d="M13 14 Q15 11 17 14 Q15 17 13 14" stroke="#D97706" strokeWidth="1.5" fill="none" />
          </g>
        </g>

        {/* C. Floating Lead Auditor Certificate Badge (Top Right) */}
        <g className="anim-float-fast" style={{ transformOrigin: "515px 90px" }}>
          <g transform="translate(470, 50)" filter="url(#teamShadow)">
            {/* Badge Ribbon */}
            <path d="M35 50 L25 75 L38 70 L48 78 L43 50 Z" fill="#F97316" />
            <path d="M50 50 L42 78 L53 70 L65 75 L55 50 Z" fill="#EA580C" />
            {/* Round Medallion */}
            <circle cx="45" cy="35" r="26" fill="url(#goldSealGrad)" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="45" cy="35" r="21" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Checkmark in Seal */}
            <path d="M37 35 L43 41 L54 29" stroke="#121C46" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pill Label */}
            <rect x="12" y="66" width="66" height="18" rx="9" fill="#121C46" />
            <text x="45" y="78" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              LEAD AUDITOR
            </text>
          </g>
        </g>

        {/* D. Floating Chat / Code Bubble */}
        <g className="anim-float-slow" style={{ transformOrigin: "160px 140px" }}>
          <g transform="translate(135, 120)">
            <rect x="0" y="0" width="46" height="26" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#teamShadow)" />
            <polygon points="12,26 18,26 14,31" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="23" y="17" fill="#2563EB" fontSize="11" fontWeight="bold" textAnchor="middle">
              &lt;/&gt; ISO
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default TeamIllustration;
