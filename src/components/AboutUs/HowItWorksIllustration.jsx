import React from "react";

/**
 * Scalloped Gear Badge Frame
 * Recreates the clean mechanical gear / scalloped badge ring from the reference
 * symbolizing engineering standards, ISO accreditation, and structured quality.
 */
const GearFrame = ({ className = "", children }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer 12-tooth scalloped gear shape */}
      <path
        d="M 174.0 100.0 L 180.2 119.8 L 175.7 127.6 L 157.0 134.9 L 156.4 155.3 L 148.2 160.0 L 128.5 153.8 L 120.7 172.5 L 111.4 174.0 L 100.0 159.0 L 88.6 174.0 L 79.3 172.5 L 71.5 153.8 L 51.8 160.0 L 43.6 155.3 L 43.0 134.9 L 24.3 127.6 L 19.8 119.8 L 26.0 100.0 L 19.8 80.2 L 24.3 72.4 L 43.0 65.1 L 43.6 44.7 L 51.8 40.0 L 71.5 46.2 L 79.3 27.5 L 88.6 26.0 L 100.0 41.0 L 111.4 26.0 L 120.7 27.5 L 128.5 46.2 L 148.2 40.0 L 156.4 44.7 L 157.0 65.1 L 175.7 72.4 L 180.2 80.2 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner concentric subtle circle */}
      <circle
        cx="100"
        cy="100"
        r="68"
        fill="#F8FAFC"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
    </svg>

    {/* Content / Illustration rendered inside the badge */}
    <div className="absolute inset-0 flex items-center justify-center p-6">
      {children}
    </div>
  </div>
);

/**
 * Step 01 Illustration: Sign Up
 * Minimal editorial line-art figure in Broadbeach Orange welcoming the user,
 * creating an account / signing up on a digital profile.
 */
export const StepOneIllustration = () => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center group">
      {/* Floating Confetti Accents */}
      <span className="absolute -top-2 left-6 w-3 h-3 rounded-full bg-[#FFC400] opacity-80 animate-pulse select-none" />
      <span className="absolute top-10 -right-2 w-2.5 h-2.5 rounded-full border-2 border-[#2563EB] opacity-75 select-none" />
      <span className="absolute -bottom-1 left-12 w-2 h-2 rounded-full bg-[#F97316] opacity-70 select-none" />
      <span className="absolute bottom-8 right-2 text-xs font-bold text-slate-300 select-none">+</span>

      <GearFrame className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background glow */}
          <circle cx="70" cy="70" r="50" fill="#FFF7ED" opacity="0.6" />

          {/* Welcoming Arms & Orange Shirt */}
          <path
            d="M 38 120 C 38 98, 48 84, 70 84 C 92 84, 102 98, 102 120 Z"
            fill="#F97316"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Left Outstretched Welcoming Arm */}
          <path
            d="M 45 92 Q 26 95, 18 85 Q 24 80, 42 86"
            fill="#F97316"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Hand */}
          <circle cx="18" cy="83" r="4.5" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Right Arm Holding Signup ID Card / Pen */}
          <path
            d="M 95 92 Q 114 96, 122 84 Q 116 80, 98 86"
            fill="#F97316"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Hand */}
          <circle cx="122" cy="84" r="4.5" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Floating Modern ID / Account Badge */}
          <g transform="translate(108, 62) rotate(-8)">
            <rect
              x="0"
              y="0"
              width="24"
              height="18"
              rx="3"
              fill="#FFFFFF"
              stroke="#121C46"
              strokeWidth="1.8"
            />
            <rect x="3.5" y="4" width="7" height="7" rx="1.5" fill="#2563EB" />
            <line x1="13" y1="5.5" x2="20" y2="5.5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="9" x2="19" y2="9" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="18" cy="13.5" r="2" fill="#10B981" />
          </g>

          {/* Neck */}
          <rect x="64.5" y="72" width="11" height="15" rx="3" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Head & Face */}
          <circle cx="70" cy="58" r="16" fill="#FED7AA" stroke="#121C46" strokeWidth="2.5" />
          
          {/* Hair (Editorial Minimalist Dark Hair) */}
          <path
            d="M 54 55 C 54 41, 62 38, 70 38 C 80 38, 86 42, 86 54 C 84 52, 80 50, 75 52 C 68 54, 62 48, 54 55 Z"
            fill="#121C46"
          />

          {/* Facial Features (Minimalist Eyes & Smile) */}
          <circle cx="66" cy="58" r="1.5" fill="#121C46" />
          <circle cx="74" cy="58" r="1.5" fill="#121C46" />
          <path d="M 67 64 Q 70 67, 73 64" stroke="#121C46" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Shirt Collar Accent */}
          <path d="M 64 85 L 70 94 L 76 85" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </GearFrame>
    </div>
  );
};

/**
 * Step 02 Illustration: Start Learning
 * Minimal editorial line-art figure in Royal Navy/Blue, learning with an open laptop,
 * watching course video modules at their own pace.
 */
export const StepTwoIllustration = () => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center group">
      {/* Floating Confetti Accents */}
      <span className="absolute top-2 -left-2 w-2.5 h-2.5 rounded-full border-2 border-[#10B981] opacity-75 select-none" />
      <span className="absolute -top-3 right-8 w-3 h-3 rounded-full bg-[#2563EB] opacity-70 select-none" />
      <span className="absolute bottom-4 -left-3 text-xs font-bold text-slate-300 select-none">{"</>"}</span>
      <span className="absolute -bottom-2 right-10 w-2 h-2 rounded-full bg-[#FFC400] opacity-80 animate-ping select-none" />

      <GearFrame className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background glow */}
          <circle cx="70" cy="70" r="50" fill="#EFF6FF" opacity="0.6" />

          {/* Character Torso in Royal Navy/Blue Shirt */}
          <path
            d="M 36 122 C 36 98, 48 86, 70 86 C 92 86, 104 98, 104 122 Z"
            fill="#2563EB"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Neck */}
          <rect x="65" y="73" width="10" height="15" rx="3" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Head */}
          <circle cx="70" cy="60" r="15" fill="#FED7AA" stroke="#121C46" strokeWidth="2.5" />

          {/* Hair (Sleek side part) */}
          <path
            d="M 55 58 C 55 44, 64 40, 72 40 C 83 40, 85 46, 85 58 C 82 54, 76 52, 70 54 C 64 56, 58 52, 55 58 Z"
            fill="#121C46"
          />

          {/* Smart Glasses / Facial Profile */}
          <rect x="62" y="56" width="6.5" height="5" rx="1.5" stroke="#121C46" strokeWidth="1.8" fill="none" />
          <rect x="71.5" y="56" width="6.5" height="5" rx="1.5" stroke="#121C46" strokeWidth="1.8" fill="none" />
          <line x1="68.5" y1="58.5" x2="71.5" y2="58.5" stroke="#121C46" strokeWidth="1.5" />
          <path d="M 68 65 Q 70 67.5, 72 65" stroke="#121C46" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Laptop Base & Screen (Positioned in foreground) */}
          {/* Laptop Screen */}
          <path
            d="M 46 88 L 94 88 L 91 112 L 49 112 Z"
            fill="#121C46"
            stroke="#121C46"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Screen Display Glass */}
          <rect x="52" y="91" width="36" height="18" rx="1.5" fill="#0F172A" />
          {/* Video Lesson / Course Play Icon on screen */}
          <polygon points="68,96 68,104 75,100" fill="#FFC400" />
          {/* Progress bar on laptop display */}
          <rect x="55" y="106" width="30" height="1.8" rx="0.9" fill="#334155" />
          <rect x="55" y="106" width="20" height="1.8" rx="0.9" fill="#10B981" />

          {/* Laptop Keyboard Base */}
          <path
            d="M 40 112 L 100 112 L 96 118 L 44 118 Z"
            fill="#E2E8F0"
            stroke="#121C46"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Hands on Keyboard */}
          <circle cx="50" cy="113" r="3.5" fill="#FED7AA" stroke="#121C46" strokeWidth="1.8" />
          <circle cx="90" cy="113" r="3.5" fill="#FED7AA" stroke="#121C46" strokeWidth="1.8" />
        </svg>
      </GearFrame>
    </div>
  );
};

/**
 * Step 03 Illustration: Get Certified
 * Minimal editorial line-art professional in Emerald Green & Gold,
 * triumphantly holding up an accredited completion certificate.
 */
export const StepThreeIllustration = () => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center group">
      {/* Floating Confetti Accents */}
      <span className="absolute -top-3 left-8 w-3 h-3 rounded-full bg-[#10B981] opacity-75 select-none" />
      <span className="absolute top-10 -right-2 w-2.5 h-2.5 rounded-full border-2 border-[#FFC400] opacity-80 select-none" />
      <span className="absolute -bottom-1 left-8 text-xs font-bold text-amber-400 select-none">★</span>
      <span className="absolute bottom-6 right-2 w-2 h-2 rounded-full bg-[#2563EB] opacity-70 select-none" />

      <GearFrame className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background glow */}
          <circle cx="70" cy="70" r="50" fill="#ECFDF5" opacity="0.6" />

          {/* Torso in Emerald Green Blazer */}
          <path
            d="M 38 120 C 38 98, 48 84, 70 84 C 92 84, 102 98, 102 120 Z"
            fill="#10B981"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Left Arm Raised Celebrating */}
          <path
            d="M 44 90 Q 28 80, 24 64 Q 30 60, 42 78"
            fill="#10B981"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Fist / Celebration Hand */}
          <circle cx="24" cy="62" r="4.5" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Right Arm Holding Accredited Certificate */}
          <path
            d="M 96 90 Q 112 85, 116 72 Q 110 68, 98 78"
            fill="#10B981"
            stroke="#121C46"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Hand clasping certificate */}
          <circle cx="116" cy="70" r="4.5" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Accredited Certificate Document */}
          <g transform="translate(100, 40) rotate(12)">
            {/* Certificate Paper */}
            <rect
              x="0"
              y="0"
              width="26"
              height="34"
              rx="2"
              fill="#FFFFFF"
              stroke="#121C46"
              strokeWidth="2"
            />
            {/* Header ornament */}
            <rect x="5" y="4" width="16" height="2" rx="1" fill="#121C46" />
            {/* Certificate text lines */}
            <line x1="5" y1="9" x2="21" y2="9" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="13" x2="18" y2="13" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5" y1="16.5" x2="19" y2="16.5" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5" y1="20" x2="16" y2="20" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Gold Seal Badge with Ribbon */}
            <circle cx="13" cy="26" r="4" fill="#FFC400" stroke="#121C46" strokeWidth="1.2" />
            <path d="M 11.5 28.5 L 10 32 L 12 31 L 13 32 L 13 28.5" fill="#F97316" />
            <path d="M 14.5 28.5 L 16 32 L 14 31 L 13 32 L 13 28.5" fill="#F97316" />
          </g>

          {/* Neck */}
          <rect x="64.5" y="72" width="11" height="15" rx="3" fill="#FED7AA" stroke="#121C46" strokeWidth="2" />

          {/* Head & Smiling Face */}
          <circle cx="70" cy="58" r="16" fill="#FED7AA" stroke="#121C46" strokeWidth="2.5" />

          {/* Hair (Professional Styled Hair) */}
          <path
            d="M 54 54 C 54 40, 62 36, 70 36 C 80 36, 86 40, 86 52 C 84 50, 78 48, 74 50 C 66 52, 60 48, 54 54 Z"
            fill="#121C46"
          />

          {/* Facial Features (Joyful Eyes & Broad Smile) */}
          <path d="M 64 56 Q 66 54, 68 56" stroke="#121C46" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 72 56 Q 74 54, 76 56" stroke="#121C46" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 66 63 Q 70 68, 74 63 Z" fill="#EF4444" stroke="#121C46" strokeWidth="1.5" />

          {/* Inner Shirt & Tie / Lapel */}
          <polygon points="70,84 65,96 75,96" fill="#FFFFFF" />
          <polygon points="69,87 71,87 72,98 70,101 68,98" fill="#FFC400" stroke="#121C46" strokeWidth="1" />
        </svg>
      </GearFrame>
    </div>
  );
};
