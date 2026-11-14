import React from "react";

/**
 * HappyCustomersIllustration — Animated Cartoon Illustration for Happy Customers page
 * Features:
 * - Joyful graduate and quality manager celebrating certification achievement and career milestones
 * - 5 golden glowing rating stars, celebratory confetti sparkles, verified review badges
 * - Broadbeach brand palette (navy #121C46, orange #F97316, yellow #FFDB58, blue #2563EB)
 * - Accessible: Respects prefers-reduced-motion
 */
const HappyCustomersIllustration = ({ className = "w-full h-auto max-w-[560px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-orange-100/30 to-blue-100/30 rounded-3xl filter blur-2xl pointer-events-none transform -rotate-1 scale-95"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-auto drop-shadow-sm"
        aria-label="Illustration of happy Broadbeach Academy graduates and enterprise customers celebrating career milestones"
        role="img"
      >
        <defs>
          <linearGradient id="goldStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="podiumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="cardShadowH" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.1" />
          </filter>

          <style>{`
            @keyframes starTwinkle {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.18); opacity: 1; filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.8)); }
            }
            @keyframes confettiDrift {
              0% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
              50% { transform: translateY(-8px) rotate(15deg); opacity: 1; }
              100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
            }
            @keyframes celebrateBob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes floatReview {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-9px); }
            }
            .anim-star-1 {
              transform-origin: 220px 45px;
              animation: starTwinkle 2.2s ease-in-out infinite;
            }
            .anim-star-2 {
              transform-origin: 260px 35px;
              animation: starTwinkle 2.4s ease-in-out infinite 0.2s;
            }
            .anim-star-3 {
              transform-origin: 300px 30px;
              animation: starTwinkle 2.1s ease-in-out infinite 0.4s;
            }
            .anim-star-4 {
              transform-origin: 340px 35px;
              animation: starTwinkle 2.5s ease-in-out infinite 0.6s;
            }
            .anim-star-5 {
              transform-origin: 380px 45px;
              animation: starTwinkle 2.3s ease-in-out infinite 0.8s;
            }
            .anim-confetti {
              animation: confettiDrift 3.5s ease-in-out infinite;
            }
            .anim-grad-bob {
              animation: celebrateBob 3.2s ease-in-out infinite;
            }
            .anim-review-float {
              animation: floatReview 3.8s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .anim-star-1, .anim-star-2, .anim-star-3, .anim-star-4, .anim-star-5,
              .anim-confetti, .anim-grad-bob, .anim-review-float {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* 1. Base Platform */}
        <ellipse cx="300" cy="415" rx="270" ry="24" fill="#CBD5E1" opacity="0.5" />
        <ellipse cx="300" cy="412" rx="220" ry="16" fill="#F1F5F9" />

        {/* Podium Backdrop Ring */}
        <ellipse cx="300" cy="385" rx="160" ry="30" fill="url(#podiumGrad)" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M140 385 L140 405 Q300 435 460 405 L460 385 Z" fill="#E2E8F0" />

        {/* ========================================================= */}
        {/* 2. FIVE GOLDEN RATING STARS ARCH (Top Center)             */}
        {/* ========================================================= */}
        <g id="rating-stars">
          {/* Star 1 */}
          <g className="anim-star-1">
            <polygon points="220,35 223,43 231,43 225,48 227,56 220,51 213,56 215,48 209,43 217,43" fill="url(#goldStarGrad)" filter="url(#starGlow)" />
          </g>
          {/* Star 2 */}
          <g className="anim-star-2">
            <polygon points="260,25 263,33 271,33 265,38 267,46 260,41 253,46 255,38 249,33 257,33" fill="url(#goldStarGrad)" filter="url(#starGlow)" />
          </g>
          {/* Star 3 (Center Apex) */}
          <g className="anim-star-3">
            <polygon points="300,18 304,28 314,28 306,34 309,44 300,38 291,44 294,34 286,28 296,28" fill="url(#goldStarGrad)" filter="url(#starGlow)" />
          </g>
          {/* Star 4 */}
          <g className="anim-star-4">
            <polygon points="340,25 343,33 351,33 345,38 347,46 340,41 333,46 335,38 329,33 337,33" fill="url(#goldStarGrad)" filter="url(#starGlow)" />
          </g>
          {/* Star 5 */}
          <g className="anim-star-5">
            <polygon points="380,35 383,43 391,43 385,48 387,56 380,51 373,56 375,48 369,43 377,43" fill="url(#goldStarGrad)" filter="url(#starGlow)" />
          </g>
        </g>

        {/* Rating Score Banner */}
        <g transform="translate(230, 68)" filter="url(#cardShadowH)">
          <rect x="0" y="0" width="140" height="26" rx="13" fill="#121C46" />
          <text x="70" y="17" fill="#FFC400" fontSize="10.5" fontWeight="extrabold" textAnchor="middle" letterSpacing="0.8">
            98.4% SATISFACTION
          </text>
        </g>

        {/* ========================================================= */}
        {/* 3. CONFETTI & CELEBRATION SPARKLES                        */}
        {/* ========================================================= */}
        <g id="confetti" className="anim-confetti">
          {/* Orange ribbons */}
          <rect x="160" y="100" width="8" height="4" rx="1" fill="#F97316" transform="rotate(25 160 100)" />
          <rect x="420" y="110" width="8" height="4" rx="1" fill="#F97316" transform="rotate(-35 420 110)" />
          <rect x="180" y="170" width="10" height="4" rx="1" fill="#F97316" transform="rotate(45 180 170)" />
          {/* Yellow sparkles */}
          <circle cx="210" cy="130" r="3" fill="#FFC400" />
          <circle cx="395" cy="140" r="3" fill="#FFC400" />
          <polygon points="150,140 153,145 158,145 154,148 156,153 150,150 144,153 146,148 142,145 147,145" fill="#FFC400" />
          {/* Blue & Navy circles */}
          <circle cx="170" cy="85" r="3.5" fill="#2563EB" />
          <circle cx="435" cy="80" r="3.5" fill="#2563EB" />
          <rect x="400" y="175" width="8" height="4" rx="1" fill="#2563EB" transform="rotate(15 400 175)" />
          {/* Green diamonds */}
          <polygon points="190,60 193,65 190,70 187,65" fill="#10B981" />
          <polygon points="410,65 413,70 410,75 407,70" fill="#10B981" />
        </g>

        {/* ========================================================= */}
        {/* 4. CHARACTER 1 (FEMALE GRADUATE CELEBRATING - Left)       */}
        {/* ========================================================= */}
        <g id="char-graduate" className="anim-grad-bob">
          {/* Shadow */}
          <ellipse cx="230" cy="395" rx="32" ry="7" fill="#CBD5E1" opacity="0.6" />

          {/* Legs & Shoes */}
          <rect x="220" y="310" width="10" height="82" rx="5" fill="#1E293B" />
          <rect x="234" y="310" width="10" height="82" rx="5" fill="#0F172A" />
          <ellipse cx="224" cy="390" rx="8" ry="4" fill="#0F172A" />
          <ellipse cx="240" cy="390" rx="8" ry="4" fill="#0F172A" />

          {/* Navy Graduation Gown */}
          <path d="M208 215 C208 190, 256 190, 256 215 L260 315 L204 315 Z" fill="#121C46" />
          {/* Gold Honor Stole / Scarf */}
          <path d="M220 205 L224 265 L228 205" stroke="#FFC400" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M244 205 L240 265 L236 205" stroke="#FFC400" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Right Arm Raised Holding Diploma Roll */}
          <path d="M255 215 Q275 180 270 150" stroke="#121C46" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="270" cy="148" r="6" fill="#FCD34D" />
          {/* Diploma Scroll */}
          <rect x="256" y="132" width="28" height="12" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" transform="rotate(-20 256 132)" />
          {/* Red Ribbon on Diploma */}
          <rect x="268" y="134" width="5" height="12" fill="#EF4444" transform="rotate(-20 256 132)" />

          {/* Left Arm Raised Celebrating */}
          <path d="M208 215 Q185 185 188 155" stroke="#121C46" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="188" cy="153" r="6" fill="#FCD34D" />

          {/* Neck */}
          <rect x="227" y="188" width="9" height="15" fill="#FCD34D" rx="3" />

          {/* Head & Joyful Face */}
          <circle cx="232" cy="170" r="21" fill="#FCD34D" />
          {/* Dark Hair with curls */}
          <path d="M214 172 C210 146, 254 146, 250 172 C246 158, 218 158, 214 172 Z" fill="#451A03" />
          <path d="M212 172 Q202 190 212 208" stroke="#451A03" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M252 172 Q262 190 252 208" stroke="#451A03" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Big Joyful Smile */}
          <circle cx="225" cy="168" r="2" fill="#1E293B" />
          <circle cx="239" cy="168" r="2" fill="#1E293B" />
          <path d="M224 178 Q232 187 240 178" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <circle cx="220" cy="175" r="3" fill="#F87171" opacity="0.5" />
          <circle cx="244" cy="175" r="3" fill="#F87171" opacity="0.5" />

          {/* Graduation Mortarboard Cap */}
          <polygon points="232,130 258,142 232,154 206,142" fill="#0F172A" />
          <path d="M218 148 L218 158 Q232 165 246 158 L246 148 Z" fill="#1E293B" />
          <circle cx="232" cy="142" r="3" fill="#FFC400" />
          {/* Gold Tassel dangling */}
          <path d="M232 142 Q250 148 252 162" stroke="#FFC400" strokeWidth="2" fill="none" />
          <rect x="250" y="162" width="4" height="6" rx="1" fill="#F59E0B" />
        </g>

        {/* ========================================================= */}
        {/* 5. CHARACTER 2 (MALE OPERATIONS LEADER - Right)           */}
        {/* ========================================================= */}
        <g id="char-client" className="anim-grad-bob">
          {/* Shadow */}
          <ellipse cx="370" cy="395" rx="32" ry="7" fill="#CBD5E1" opacity="0.6" />

          {/* Legs & Navy Slacks */}
          <rect x="358" y="305" width="12" height="88" rx="6" fill="#0F172A" />
          <rect x="374" y="305" width="12" height="88" rx="6" fill="#1E293B" />
          <ellipse cx="362" cy="390" rx="9" ry="4" fill="#0F172A" />
          <ellipse cx="380" cy="390" rx="9" ry="4" fill="#0F172A" />

          {/* Torso: Orange Polo Sweater over Collared Shirt */}
          <path d="M348 215 C348 195, 396 195, 396 215 L398 310 L346 310 Z" fill="#F97316" />
          <polygon points="368,212 374,232 380,212" fill="#FFFFFF" />

          {/* Left Arm: Thumbs up gesture */}
          <path d="M348 220 Q325 240 332 265" stroke="#EA580C" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="334" cy="268" r="6" fill="#FCD34D" />
          <path d="M334 268 L334 260" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

          {/* Right Arm: Holding 5-Star Feedback Placard */}
          <path d="M394 220 Q415 245 408 275" stroke="#EA580C" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="406" cy="277" r="6" fill="#FCD34D" />

          {/* Customer Review Placard */}
          <g transform="translate(405, 240)" filter="url(#cardShadowH)">
            <rect x="0" y="0" width="85" height="48" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="8" y="8" width="69" height="12" rx="6" fill="#ECFDF5" />
            <text x="42" y="17" fill="#059669" fontSize="7" fontWeight="bold" textAnchor="middle">
              VERIFIED REVIEW
            </text>
            <text x="12" y="31" fill="#F59E0B" fontSize="9">★★★★★</text>
            <text x="12" y="41" fill="#64748B" fontSize="6.5">Lead Auditor Pass</text>
          </g>

          {/* Neck */}
          <rect x="367" y="190" width="9" height="15" fill="#FCD34D" rx="3" />

          {/* Head & Face */}
          <circle cx="372" cy="172" r="21" fill="#FCD34D" />
          {/* Short neat styled hair */}
          <path d="M354 170 C354 148, 390 148, 390 170 C386 156, 358 156, 354 170 Z" fill="#1E293B" />
          {/* Eyes & Smile */}
          <circle cx="365" cy="170" r="2" fill="#1E293B" />
          <circle cx="379" cy="170" r="2" fill="#1E293B" />
          <path d="M366 180 Q372 186 378 180" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* ========================================================= */}
        {/* 6. FLOATING ENTERPRISE CLIENT BADGE (Top Right)           */}
        {/* ========================================================= */}
        <g className="anim-review-float" style={{ transformOrigin: "475px 110px" }}>
          <g transform="translate(420, 75)" filter="url(#cardShadowH)">
            <rect x="0" y="0" width="145" height="42" rx="12" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.8" />
            <circle cx="22" cy="21" r="12" fill="#EFF6FF" />
            {/* Building Icon */}
            <path d="M16 27 L16 16 L22 13 L28 16 L28 27 Z" fill="#2563EB" />
            <rect x="20" y="22" width="4" height="5" fill="#FFFFFF" />
            <text x="80" y="18" fill="#121C46" fontSize="10" fontWeight="extrabold" textAnchor="middle">
              70+ CLIENTS
            </text>
            <text x="80" y="30" fill="#64748B" fontSize="7.5" textAnchor="middle">
              Aerospace &amp; Industry
            </text>
          </g>
        </g>

        {/* ========================================================= */}
        {/* 7. FLOATING CAREER PROMOTION BADGE (Bottom Left)          */}
        {/* ========================================================= */}
        <g className="anim-review-float" style={{ transformOrigin: "110px 290px" }}>
          <g transform="translate(35, 255)" filter="url(#cardShadowH)">
            <rect x="0" y="0" width="135" height="40" rx="10" fill="#121C46" stroke="#60A5FA" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="10" fill="#10B981" />
            {/* Growth arrow */}
            <path d="M16 23 L20 17 L24 23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="20" y1="18" x2="20" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <text x="76" y="17" fill="#FFC400" fontSize="9" fontWeight="bold" textAnchor="middle">
              CAREER IMPACT
            </text>
            <text x="76" y="29" fill="#93C5FD" fontSize="7.5" textAnchor="middle">
              87% Reported Growth
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default HappyCustomersIllustration;
