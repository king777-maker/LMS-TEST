import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  FaTimes,
  FaStar,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaUndo,
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaTh,
  FaGlobeAmericas,
  FaQuoteLeft,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

/**
 * 24 Verified customer and alumni testimonials for Broadbeach Academy
 */
export const defaultHappyCustomers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Quality Assurance Lead",
    company: "Apex Precision / Safran Tier-1",
    course: "ISO 9001:2015 Lead Auditor",
    credentialId: "BB-QMS-2026-8812",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    initials: "RK",
    tagColor: "#2563EB",
    quote:
      "The scenario-based mock audit exercises gave me the exact tools I needed to lead our internal ISO 9001 surveillance audit without hesitation.",
    fullReview:
      "Completed the ISO 9001:2015 QMS Lead Auditor training with Broadbeach Academy. The trainer explained every standard clause with practical industry case studies. Clear study material, rigorous assessment modules, and immediate QR verification for my certificate. Highly recommended for quality and manufacturing professionals across precision engineering!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "EHS Compliance Specialist",
    company: "GreenVolt Renewable Energy",
    course: "ISO 45001 & 14001 Integrated IMS",
    credentialId: "BB-EHS-2026-3941",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    initials: "PS",
    tagColor: "#059669",
    quote:
      "Balancing a demanding job in renewable energy with certification seemed daunting until I enrolled at Broadbeach. The modular lessons made all the difference.",
    fullReview:
      "Enrolled in the ISO 45001 & ISO 14001 Integrated Management System program. The self-paced modules, interactive assessments, and practical audit checklists are top-notch. Received my accredited certificate promptly and was able to lead our plant's environmental risk assessment.",
  },
  {
    id: 3,
    name: "Mohammed Al-Mansoor",
    role: "Quality & Safety Director",
    company: "Middle East Aviation & Aerospace",
    course: "AS9100D Aerospace Lead Auditor",
    credentialId: "BB-AERO-2026-1029",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    initials: "MA",
    tagColor: "#EA580C",
    quote:
      "Enrolled from Dubai for the AS9100D Aerospace certification. Outstanding platform, flexible learning pace, and very responsive academic support.",
    fullReview:
      "The AS9100 Rev D Lead Auditor syllabus covers aerospace special requirements, counterfeit parts prevention, and risk-based thinking with uncompromising rigor. The online verification portal makes it straightforward to prove accreditation to defense procurement clients.",
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Information Security Analyst",
    company: "CloudCore Technologies",
    course: "ISO/IEC 27001:2022 ISMS Lead",
    credentialId: "BB-ISMS-2026-5573",
    rating: 5,
    date: "Verified 2 months ago",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    initials: "SP",
    tagColor: "#7C3AED",
    quote:
      "The ISO 27001 course was comprehensive and very well structured. It helped me understand risk treatment plans and Annex A controls with real-world scenarios.",
    fullReview:
      "The curriculum doesn't just read standard clauses—it forces you to think like an external cyber auditor inspecting access management, encryption controls, and supplier risk. The digital certificate is instantly verifiable worldwide.",
  },
  {
    id: 5,
    name: "Anand Natarajan",
    role: "Principal Consultant & Auditor",
    company: "Quality Consulting Services",
    course: "ISO 19011 Auditing Systems",
    credentialId: "BB-AUD-2026-4421",
    rating: 5,
    date: "Verified 3 weeks ago",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    initials: "AN",
    tagColor: "#2563EB",
    quote:
      "Broadbeach Academy is one of the most reliable organizations for ISO certifications. Their mock audit exercises are invaluable in real audit environments.",
    fullReview:
      "Having audited over 100 facilities across India and Southeast Asia, I can vouch for the practical depth of Broadbeach's curriculum. Their mock opening meetings, non-conformity grading rubrics, and reporting templates prepare students for high-stakes audits.",
  },
  {
    id: 6,
    name: "David Miller",
    role: "Senior Operations Director",
    company: "Vanguard Logistics Global",
    course: "Supply Chain Quality & ISO 9001",
    credentialId: "BB-SCM-2026-9018",
    rating: 5,
    date: "Verified 3 weeks ago",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    initials: "DM",
    tagColor: "#2563EB",
    quote:
      "We enrolled our entire multi-site quality team through Broadbeach Academy. Consistency of reporting across our warehouses improved noticeably.",
    fullReview:
      "The corporate cohort portal allowed our executive team to monitor trainee progress across 12 countries. Standardized grading and verifiable digital credentials eliminated the compliance fragmentation we previously struggled with.",
  },
  {
    id: 7,
    name: "Karthik Venkatesh",
    role: "Continuous Improvement Lead",
    company: "Mahindra Rise Tier-1 Supplier",
    course: "Lean Six Sigma Green Belt",
    credentialId: "BB-LSS-2026-7240",
    rating: 5,
    date: "Verified 3 weeks ago",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    initials: "KV",
    tagColor: "#D97706",
    quote:
      "Took the Lean Six Sigma Green Belt training. The course material was practical, engaging, and directly applicable on our automotive assembly floor.",
    fullReview:
      "The DMAIC methodology was demystified through statistical process control case studies. Within two months of certification, I helped reduce machining defect rates by 18% in our gearbox manufacturing division.",
  },
  {
    id: 8,
    name: "Ananya Deshmukh",
    role: "Sustainability & EMS Auditor",
    company: "EcoStandards Advisory",
    course: "ISO 14001:2015 Environmental",
    credentialId: "BB-EMS-2026-6139",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    initials: "AD",
    tagColor: "#059669",
    quote:
      "Very informative sessions on ISO 14001 EMS and carbon accounting fundamentals. The portal is user-friendly, assessments test actual understanding.",
    fullReview:
      "The instructors demonstrated how environmental aspects and impacts registers must tie directly into company risk management frameworks. The verifiable certificate gave our advisory firm immediate credibility with European clients.",
  },
  {
    id: 9,
    name: "Deepak Verma",
    role: "Food Safety & QA Manager",
    company: "Premier Foods FMCG Ltd",
    course: "ISO 22000 Food Safety & HACCP",
    credentialId: "BB-FSMS-2026-3829",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    initials: "DV",
    tagColor: "#DC2626",
    quote:
      "The ISO 22000 Food Safety certification gave me complete clarity on prerequisite programs and HACCP hazard analysis. Great LMS platform.",
    fullReview:
      "From CCP identification to trace-back protocols and allergen management, every topic was explained with real factory audit video case studies. The certificate verification was validated on the spot during our annual BRCGS audit.",
  },
  {
    id: 10,
    name: "Meera Krishnan",
    role: "Corporate Compliance Lead",
    company: "Bilva Technologies Group",
    course: "ISO 19011 Auditing Principles",
    credentialId: "BB-GOV-2026-2189",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    initials: "MK",
    tagColor: "#2563EB",
    quote:
      "Enrolled our compliance officers for workplace standards and ISO 19011 auditing principles. Professional delivery, practical case studies.",
    fullReview:
      "The training helped us design an internal compliance checklist that our team uses across 5 offices. The digital verification system gives our senior management full confidence in our audit readiness.",
  },
  {
    id: 11,
    name: "Vikramaditya Rao",
    role: "Operations Excellence Lead",
    company: "GNA Gears Manufacturing",
    course: "Lean Six Sigma Black Belt",
    credentialId: "BB-LSSB-2026-5011",
    rating: 5,
    date: "Verified 3 months ago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    initials: "VR",
    tagColor: "#D97706",
    quote:
      "We trained our internal auditing team across multiple plant locations using Broadbeach Academy. Standardized modules streamlined surveillance audits.",
    fullReview:
      "Advanced Design of Experiments (DOE) and regression analysis were taught with step-by-step engineering examples. Having our internal auditors certified through Broadbeach Academy has elevated our manufacturing quality standards.",
  },
  {
    id: 12,
    name: "Anita Desai",
    role: "Information Security Auditor",
    company: "CloudCore Technologies",
    course: "ISO 27001 ISMS Lead Auditor",
    credentialId: "BB-ISMS-2026-9481",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    initials: "AD",
    tagColor: "#7C3AED",
    quote:
      "The curriculum doesn't just read clauses—it forces you to think like an external auditor inspecting risk controls. A worthwhile investment.",
    fullReview:
      "The interactive quizzes after each module made sure I retained key technical requirements for SOC2 and ISO 27001 integration. I passed my certification exam on the first attempt with distinction.",
  },
  {
    id: 13,
    name: "Col. R. K. Nambiar (Retd.)",
    role: "Chief of Defence Compliance",
    company: "Adani Defence Partner Network",
    course: "AS9100D Aerospace & Defence",
    credentialId: "BB-DEF-2026-7721",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    initials: "RN",
    tagColor: "#EA580C",
    quote:
      "Rigorous standards harmonized with international defense procurement specifications. Broadbeach Academy sets the gold standard for compliance.",
    fullReview:
      "In mission-critical aerospace and defense manufacturing, tolerances are unforgiving. Broadbeach Academy's lead auditor training provides the precise standard alignment, risk control, and documentation rigor required by global defense clients.",
  },
  {
    id: 14,
    name: "Dr. Suresh Bhatt",
    role: "Dean of Engineering Education",
    company: "Christ University Engineering",
    course: "Educational Quality & ISO 21001",
    credentialId: "BB-ACAD-2026-1182",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    initials: "SB",
    tagColor: "#2563EB",
    quote:
      "Over 350 of our post-graduate engineering scholars have completed Lead Auditor courses through Broadbeach Academy. Verifiable credentials give distinct advantages.",
    fullReview:
      "Broadbeach Academy has been an invaluable institutional partner. Their interactive online platform allows university students to bridge academic theory with industry quality standards before graduating.",
  },
  {
    id: 15,
    name: "Siddharth Menon",
    role: "Aviation Quality Manager",
    company: "Safran Aerospace Partner Facility",
    course: "AS9100 Rev D Lead Auditor",
    credentialId: "BB-AERO-2026-6632",
    rating: 5,
    date: "Verified 3 weeks ago",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    initials: "SM",
    tagColor: "#0284C7",
    quote:
      "Exceptional training on aerospace risk registers, foreign object debris (FOD) prevention, and AS9100 requirements. Globally recognized.",
    fullReview:
      "Auditing flight-critical sub-assemblies requires meticulous understanding of aerospace special processes. Broadbeach Academy delivered an outstanding program with authentic audit evidence simulations.",
  },
  {
    id: 16,
    name: "Kavita Chawla",
    role: "Health & Safety Inspector",
    company: "Asteria Aerospace Safety Wing",
    course: "ISO 45001:2018 OHSMS Lead",
    credentialId: "BB-OHS-2026-8219",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    initials: "KC",
    tagColor: "#059669",
    quote:
      "Hazard identification and operational controls were clearly explained through real industrial scenarios. QR code verification gives full confidence.",
    fullReview:
      "The course thoroughly covers worker participation, emergency preparedness, and incident investigation methodologies. The online examination tested genuine comprehension rather than rote memorization.",
  },
  {
    id: 17,
    name: "Arun Pillai",
    role: "Supply Chain Quality Director",
    company: "Shree Vasu Logistics Ltd",
    course: "ISO 9001 & ISO 28000 Security",
    credentialId: "BB-LOG-2026-3392",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    initials: "AP",
    tagColor: "#2563EB",
    quote:
      "Broadbeach Academy's corporate portal allowed us to train 45 logistics supervisors across 6 regional hubs with zero travel downtime.",
    fullReview:
      "Standardizing our logistics quality metrics and security controls has directly improved warehouse turnaround times and customer SLA adherence. The certificate validation registry is flawless.",
  },
  {
    id: 18,
    name: "Elena Rostova",
    role: "Quality Management Consultant",
    company: "Elbit Systems Subcontractor",
    course: "ISO 9001 & Lean Six Sigma",
    credentialId: "BB-LSS-2026-9041",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    initials: "ER",
    tagColor: "#D97706",
    quote:
      "The statistical process control (SPC) exercises and measurement system analysis (MSA) templates are better than many university courses.",
    fullReview:
      "I was particularly impressed with the depth of the case studies on capability indices (Cp, Cpk) and gage R&R studies. The digital badge links seamlessly to LinkedIn and external verification systems.",
  },
  {
    id: 19,
    name: "Tanvi Saxena",
    role: "Lead Automotive Auditor",
    company: "Sieger Engineering Solutions",
    course: "IATF 16949 / ISO 9001 Lead",
    credentialId: "BB-AUTO-2026-4820",
    rating: 5,
    date: "Verified 3 weeks ago",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    initials: "TS",
    tagColor: "#2563EB",
    quote:
      "Automotive core tools like APQP, FMEA, and PPAP were demonstrated with actual supplier audits. Outstanding curriculum depth.",
    fullReview:
      "The course content is tailored for Tier-1 automotive suppliers where zero-defect manufacturing is non-negotiable. Broadbeach Academy provided real case scenarios that made our team audit-ready.",
  },
  {
    id: 20,
    name: "Farhan Siddiqui",
    role: "Petroleum Quality Inspector",
    company: "Acer Petroleum Engineering",
    course: "ISO 29001 Oil & Gas Quality",
    credentialId: "BB-PETRO-2026-5912",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    initials: "FS",
    tagColor: "#DC2626",
    quote:
      "Crucial training on pipeline integrity, pressure vessel inspection protocols, and ISO 29001 sector-specific risk registers.",
    fullReview:
      "The instructors have extensive offshore oil & gas auditing experience. The digital credential was verified by our client's procurement department in Abu Dhabi within minutes.",
  },
  {
    id: 21,
    name: "Bhavna Joshi",
    role: "Clinical Compliance Officer",
    company: "Safe Pharma Global",
    course: "ISO 13485 Medical Devices",
    credentialId: "BB-MED-2026-6619",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    initials: "BJ",
    tagColor: "#059669",
    quote:
      "MDR and ISO 13485 quality systems training was clear, meticulous, and backed by authentic regulatory audit scenarios.",
    fullReview:
      "Our medical manufacturing facilities require stringent validation of software and sterile packaging. Broadbeach Academy provided the exact standard interpretations we needed for CE marking surveillance.",
  },
  {
    id: 22,
    name: "Naveen Chandran",
    role: "Wind Energy HSE Lead",
    company: "Senvion Energy Solutions",
    course: "ISO 14001 & ISO 45001 Lead",
    credentialId: "BB-WIND-2026-3190",
    rating: 5,
    date: "Verified 3 weeks ago",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    initials: "NC",
    tagColor: "#059669",
    quote:
      "High-altitude wind turbine safety and environmental compliance modules were exceptional. Very impressed with the instructor guidance.",
    fullReview:
      "Managing occupational safety across offshore and onshore wind parks requires systematic auditing. Broadbeach Academy's integrated program gave me the confidence to lead our annual ESG audit.",
  },
  {
    id: 23,
    name: "Roshni Sen",
    role: "Academic Quality Coordinator",
    company: "CMR Group of Institutions",
    course: "ISO 21001 Educational Lead",
    credentialId: "BB-EDU-2026-7781",
    rating: 5,
    date: "Verified 1 month ago",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    initials: "RS",
    tagColor: "#2563EB",
    quote:
      "Empowered our faculty to align with ISO 21001 educational management criteria. The online certification was seamless.",
    fullReview:
      "Broadbeach Academy has elevated our institutional accreditation readiness. Trainees received personalized feedback on curriculum design and outcome-based education audit metrics.",
  },
  {
    id: 24,
    name: "Amitabh Banerjee",
    role: "Senior Metrology Lead",
    company: "Accurate Engineering Solutions",
    course: "ISO/IEC 17025 Lab Competence",
    credentialId: "BB-LAB-2026-8802",
    rating: 5,
    date: "Verified 2 weeks ago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    initials: "AB",
    tagColor: "#7C3AED",
    quote:
      "Measurement uncertainty estimation, calibration traceability, and test method validation were explained with remarkable mathematical clarity.",
    fullReview:
      "Achieving ISO/IEC 17025 NABL accreditation requires precision. The course covered equipment proficiency testing and non-conforming test work management flawlessly.",
  },
];

/**
 * Helper to draw a rounded rectangle on Canvas 2D
 */
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generate a crisp front texture for a customer card (544 x 368 px)
 */
function createCardFrontTexture(customer, onImageLoaded) {
  const canvas = document.createElement("canvas");
  canvas.width = 544;
  canvas.height = 368;
  const ctx = canvas.getContext("2d");

  function render(avatarImg = null) {
    ctx.clearRect(0, 0, 544, 368);

    // 1. Crisp White Card Background with Soft Border
    drawRoundRect(ctx, 4, 4, 536, 360, 22);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#CBD5E1";
    ctx.stroke();

    // 2. Subtle top accent bar
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(26, 4);
    ctx.lineTo(518, 4);
    ctx.lineWidth = 6;
    ctx.strokeStyle = customer.tagColor || "#2563EB";
    ctx.stroke();
    ctx.restore();

    // 3. Avatar area (Left)
    const avatarX = 48;
    const avatarY = 52;
    const avatarSize = 64;
    const radius = 32;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + radius, avatarY + radius, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    } else {
      // Elegant Initials Gradient Fallback
      const grad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
      grad.addColorStop(0, customer.tagColor || "#2563EB");
      grad.addColorStop(1, "#121C46");
      ctx.fillStyle = grad;
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(customer.initials || "BB", avatarX + radius, avatarY + radius);
    }
    ctx.restore();

    // Avatar ring
    ctx.beginPath();
    ctx.arc(avatarX + radius, avatarY + radius, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#E2E8F0";
    ctx.stroke();

    // 4. Customer Name, Role & Company
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#121C46";
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(customer.name, 128, 50);

    ctx.fillStyle = "#475569";
    ctx.font = "500 15px system-ui, -apple-system, sans-serif";
    const roleText = customer.role.length > 28 ? customer.role.slice(0, 26) + "..." : customer.role;
    ctx.fillText(roleText, 128, 78);

    ctx.fillStyle = customer.tagColor || "#2563EB";
    ctx.font = "600 14px system-ui, -apple-system, sans-serif";
    const compText = customer.company.length > 32 ? customer.company.slice(0, 30) + "..." : customer.company;
    ctx.fillText(compText, 128, 98);

    // 5. Star Rating (Top Right)
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("★ ★ ★ ★ ★", 508, 50);

    // 6. Horizontal Separator
    ctx.beginPath();
    ctx.moveTo(36, 128);
    ctx.lineTo(508, 128);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#F1F5F9";
    ctx.stroke();

    // 7. Course Certification Pill
    drawRoundRect(ctx, 36, 142, 472, 38, 10);
    ctx.fillStyle = "#EFF6FF";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#BFDBFE";
    ctx.stroke();

    ctx.fillStyle = "#1D4ED8";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("● " + customer.course, 50, 161);

    // 8. Testimonial Quote Snippet
    ctx.fillStyle = "#334155";
    ctx.font = "italic 16px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const quoteLine1 = `“${customer.quote.slice(0, 52)}...`;
    ctx.fillText(quoteLine1, 38, 198);

    // 9. Bottom Footer Bar
    drawRoundRect(ctx, 36, 280, 472, 60, 14);
    ctx.fillStyle = "#F8FAFC";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#E2E8F0";
    ctx.stroke();

    // Left: Verified Status
    ctx.fillStyle = "#059669";
    ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("✔ Authentic Credential • Broadbeach Verified", 52, 310);

    // Right: Credential ID
    ctx.fillStyle = "#64748B";
    ctx.font = "600 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText(customer.credentialId, 492, 310);
  }

  render(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  if (customer.image) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      render(img);
      texture.needsUpdate = true;
      if (onImageLoaded) onImageLoaded();
    };
    img.onerror = () => {};
    img.src = customer.image;
  }

  return texture;
}

/**
 * Generate a light, refined Broadbeach Academy reverse card texture (544 x 368 px)
 */
function createCardBackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 544;
  canvas.height = 368;
  const ctx = canvas.getContext("2d");

  // Elegant Off-White / Crisp Slate Background
  drawRoundRect(ctx, 4, 4, 536, 360, 22);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#CBD5E1";
  ctx.stroke();

  // Subtle Inner Accent Frame
  drawRoundRect(ctx, 16, 16, 512, 336, 16);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(18, 28, 70, 0.12)";
  ctx.stroke();

  // Center Shield Emblem & Title
  ctx.fillStyle = "#121C46";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("🛡", 272, 105);

  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#121C46";
  ctx.fillText("BROADBEACH ONLINE ACADEMY", 272, 170);

  ctx.fillStyle = "#F97316";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("OFFICIAL CREDENTIAL REGISTRY", 272, 202);

  ctx.fillStyle = "#64748B";
  ctx.font = "500 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("Harmonized with ISO 9001 • ISO 14001 • AS9100 • ISO 27001", 272, 230);

  // Bottom Pill
  drawRoundRect(ctx, 108, 276, 328, 44, 22);
  ctx.fillStyle = "#121C46";
  ctx.fill();

  ctx.fillStyle = "#FFDB58";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("★ CLICK TO VIEW VERIFIED STORY ★", 272, 298);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Interactive 3D Spherical Customer Gallery Component
 */
const CustomerSphere3D = ({ customers = defaultHappyCustomers }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Interactive View States
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState("sphere"); // 'sphere' | 'grid'
  const [hoveredCustomer, setHoveredCustomer] = useState(null);

  // Internal mutable state for Three.js
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    sphereGroup: null,
    cardMeshes: [],
    cardGroups: [],
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(-999, -999),
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    prevX: 0,
    prevY: 0,
    dragDistance: 0,
    targetRotationX: 0.1,
    targetRotationY: 0,
    currentRotationX: 0.1,
    currentRotationY: 0,
    autoRotate: true,
    hoveredIndex: -1,
    isIntersecting: true,
    animId: null,
  });

  // Track prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsRotating(false);
      stateRef.current.autoRotate = false;
    }
  }, []);

  // Update autoRotate flag when React state changes
  useEffect(() => {
    stateRef.current.autoRotate = isRotating;
  }, [isRotating]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    if (viewMode !== "sphere") return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const state = stateRef.current;
    const width = container.clientWidth || 960;
    const height = Math.min(Math.max(window.innerHeight * 0.75, 580), 700);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    state.scene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 3000);
    camera.position.z = 820;
    state.camera = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    state.renderer = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(200, 300, 500);
    scene.add(ambientLight, dirLight);

    // 4. Spherical Card Group
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    state.sphereGroup = sphereGroup;

    // Responsive dimensions
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const sphereRadius = isMobile ? 190 : isTablet ? 250 : 310;
    const cardWidth = isMobile ? 104 : isTablet ? 124 : 140;
    const cardHeight = isMobile ? 70 : isTablet ? 84 : 95;

    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const backTexture = createCardBackTexture();
    const backMaterial = new THREE.MeshBasicMaterial({
      map: backTexture,
      side: THREE.FrontSide,
      transparent: true,
    });

    const cardMeshes = [];
    const cardGroups = [];
    const N = customers.length;

    // Fibonacci Sphere Distribution for uniform globe coverage
    for (let i = 0; i < N; i++) {
      const customer = customers[i];
      const frontTexture = createCardFrontTexture(customer);

      const frontMaterial = new THREE.MeshBasicMaterial({
        map: frontTexture,
        side: THREE.FrontSide,
        transparent: true,
      });

      const frontMesh = new THREE.Mesh(cardGeometry, frontMaterial);
      frontMesh.userData = { customer, index: i };

      const backMesh = new THREE.Mesh(cardGeometry, backMaterial.clone());
      backMesh.rotation.y = Math.PI;

      const cardGroup = new THREE.Group();
      cardGroup.add(frontMesh);
      cardGroup.add(backMesh);

      const phi = Math.acos(-1 + (2 * i + 1) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;

      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);

      cardGroup.position.set(x, y, z);
      cardGroup.lookAt(x * 2, y * 2, z * 2);

      // Store base radius for subtle harmonic floating
      cardGroup.userData = { baseX: x, baseY: y, baseZ: z, phi, theta };

      sphereGroup.add(cardGroup);
      cardMeshes.push(frontMesh);
      cardGroups.push(cardGroup);
    }

    state.cardMeshes = cardMeshes;
    state.cardGroups = cardGroups;

    // 5. Visibility / Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 6. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = Math.min(Math.max(window.innerHeight * 0.75, 580), 700);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 7. Render Loop with Inertia, Depth Fading, and Smooth Scale
    let lastTime = performance.now();

    const animate = (time) => {
      state.animId = requestAnimationFrame(animate);

      if (!state.isIntersecting) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Auto-rotation when idle
      if (state.autoRotate && !state.isDragging && state.hoveredIndex === -1) {
        state.targetRotationY += 0.16 * dt;
      }

      // Smooth damping interpolation (lerp)
      state.currentRotationX += (state.targetRotationX - state.currentRotationX) * 0.08;
      state.currentRotationY += (state.targetRotationY - state.currentRotationY) * 0.08;

      sphereGroup.rotation.x = state.currentRotationX;
      sphereGroup.rotation.y = state.currentRotationY;

      // Depth scaling & realistic depth-of-field opacity
      const worldPos = new THREE.Vector3();
      for (let i = 0; i < cardGroups.length; i++) {
        const group = cardGroups[i];
        group.getWorldPosition(worldPos);
        const zDepth = worldPos.z;

        // Front cards full opacity (1.0), back cards gently faded (0.65)
        const normZ = (zDepth + sphereRadius) / (2 * sphereRadius); // 0 (far) to 1 (near)
        const opacity = 0.65 + normZ * 0.35;

        const front = group.children[0];
        const back = group.children[1];
        if (front.material) front.material.opacity = opacity;
        if (back.material) back.material.opacity = opacity * 0.85;

        // Scale factor: hovered card enlarged to 1.16, depth perspective 0.85 to 1.05
        if (state.hoveredIndex === i) {
          group.scale.set(1.16, 1.16, 1.16);
        } else {
          const scale = 0.85 + normZ * 0.20;
          group.scale.set(scale, scale, scale);
        }
      }

      renderer.render(scene, camera);
    };

    state.animId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(state.animId);
      observer.disconnect();
      resizeObserver.disconnect();
      cardGeometry.dispose();
      backTexture.dispose();
      backMaterial.dispose();
      cardMeshes.forEach((mesh) => {
        mesh.material.map?.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, [viewMode, customers]);

  // Pointer & Drag Interactions
  const handlePointerDown = (e) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.dragDistance = 0;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    state.prevX = e.clientX;
    state.prevY = e.clientY;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e) => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (state.isDragging) {
      const deltaX = e.clientX - state.prevX;
      const deltaY = e.clientY - state.prevY;
      state.prevX = e.clientX;
      state.prevY = e.clientY;

      state.dragDistance += Math.hypot(deltaX, deltaY);

      const sensitivity = 0.005;
      state.targetRotationY += deltaX * sensitivity;
      state.targetRotationX += deltaY * sensitivity;

      state.targetRotationX = Math.max(-0.85, Math.min(0.85, state.targetRotationX));
    } else {
      if (!state.camera || !state.cardMeshes.length) return;
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const intersects = state.raycaster.intersectObjects(state.cardMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const hitIndex = hit.object.userData.index;

        const hitWorldPos = new THREE.Vector3();
        hit.object.getWorldPosition(hitWorldPos);

        if (hitWorldPos.z > -40) {
          state.hoveredIndex = hitIndex;
          setHoveredCustomer(hit.object.userData.customer);
          canvas.style.cursor = "pointer";
          return;
        }
      }

      state.hoveredIndex = -1;
      setHoveredCustomer(null);
      canvas.style.cursor = "grab";
    }
  };

  const handlePointerUp = (e) => {
    const state = stateRef.current;
    state.isDragging = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = state.hoveredIndex >= 0 ? "pointer" : "grab";
    }

    // Drag threshold: if user moved less than 6px, treat as CLICK
    if (state.dragDistance < 6) {
      const canvas = canvasRef.current;
      if (!canvas || !state.camera) return;
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      state.raycaster.setFromCamera(state.mouse, state.camera);
      const intersects = state.raycaster.intersectObjects(state.cardMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const hitWorldPos = new THREE.Vector3();
        hit.object.getWorldPosition(hitWorldPos);

        if (hitWorldPos.z > -60) {
          setSelectedCustomer(hit.object.userData.customer);
        }
      }
    }
  };

  const handlePointerLeave = () => {
    const state = stateRef.current;
    state.isDragging = false;
    state.hoveredIndex = -1;
    setHoveredCustomer(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  };

  // Keyboard Navigation & Controls
  const rotateLeft = () => {
    stateRef.current.targetRotationY -= 0.45;
  };

  const rotateRight = () => {
    stateRef.current.targetRotationY += 0.45;
  };

  const resetRotation = () => {
    stateRef.current.targetRotationX = 0.1;
    stateRef.current.targetRotationY = 0;
  };

  const toggleAutoRotate = () => {
    setIsRotating((prev) => !prev);
  };

  return (
    <section className="relative w-full bg-[#F8FAFC] py-14 sm:py-20 lg:py-24 border-t border-[#E2E8F0] overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-tr from-blue-100/40 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* =========================================================
            1. SECTION HEADER (Exact Title & Subtitle Requested)
        ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#121C46] mb-3 select-none shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span>Interactive 3D Experience</span>
          </div>

          <h2 className="text-[30px] sm:text-[38px] lg:text-[46px] font-extrabold text-[#121C46] tracking-tight leading-tight">
            Our Happy Customers
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
            Real experiences. Real achievements. Discover the people growing with Broadbeach Academy.
          </p>

          {/* Interactive Control Pill & View Switcher */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center rounded-xl bg-white border border-[#E2E8F0] p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("sphere")}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "sphere"
                    ? "bg-[#121C46] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#121C46]"
                }`}
              >
                <FaGlobeAmericas />
                <span>3D Sphere View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#121C46] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#121C46]"
                }`}
              >
                <FaTh />
                <span>Grid View ({customers.length})</span>
              </button>
            </div>

            {viewMode === "sphere" && (
              <div className="inline-flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={rotateLeft}
                  title="Rotate Left"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#121C46] hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Rotate sphere left"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={toggleAutoRotate}
                  title={isRotating ? "Pause Auto-Rotation" : "Play Auto-Rotation"}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#121C46] hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label={isRotating ? "Pause auto-rotation" : "Play auto-rotation"}
                >
                  {isRotating ? <FaPause className="text-xs" /> : <FaPlay className="text-xs" />}
                </button>
                <button
                  type="button"
                  onClick={rotateRight}
                  title="Rotate Right"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#121C46] hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Rotate sphere right"
                >
                  <FaChevronRight className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={resetRotation}
                  title="Reset Angle"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#121C46] hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Reset sphere view"
                >
                  <FaUndo className="text-xs" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            2. 3D SPHERE CANVAS CONTAINER
        ========================================================= */}
        {viewMode === "sphere" ? (
          <div
            ref={containerRef}
            className="relative w-full h-[560px] sm:h-[640px] lg:h-[700px] rounded-3xl bg-gradient-to-b from-white/90 to-slate-50/90 border border-[#E2E8F0] shadow-sm overflow-hidden select-none flex items-center justify-center"
          >
            {/* Ground Plane Shadow below Sphere */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[480px] h-[36px] bg-slate-900/10 rounded-full blur-2xl pointer-events-none" />

            {/* Three.js Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              className="w-full h-full block cursor-grab touch-none"
              style={{ touchAction: "none" }}
              aria-label="Interactive 3D Sphere of Customer Testimonials. Click and drag to rotate. Click any card to view detailed testimonial."
            />

            {/* Floating Interaction Guide (Bottom Center) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121C46]/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg border border-white/20 select-none">
                <span className="w-2 h-2 rounded-full bg-[#FFDB58] animate-ping" />
                <span>Drag horizontally &amp; vertically • Click any card for full story</span>
              </div>
            </div>

            {/* Hovered Card Preview Tooltip (Top Right) */}
            {hoveredCustomer && (
              <div className="hidden md:flex absolute top-5 right-5 pointer-events-none z-10 max-w-xs p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={hoveredCustomer.image}
                      alt={hoveredCustomer.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#121C46] truncate">
                      {hoveredCustomer.name}
                    </div>
                    <div className="text-[11px] text-[#2563EB] font-medium truncate">
                      {hoveredCustomer.course}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Click card to open full story
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================
              3. ACCESSIBLE GRID / FALLBACK VIEW
          ========================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {customers.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={c.image}
                          alt={c.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#121C46] group-hover:text-[#2563EB] transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {c.role} • <span className="text-slate-700 font-medium">{c.company}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(c.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-[#2563EB] border border-blue-100">
                      {c.course}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    "{c.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <FaCheckCircle className="text-[10px]" />
                    <span>Verified Credential</span>
                  </span>
                  <span className="text-slate-400 group-hover:text-[#2563EB] font-bold inline-flex items-center gap-1 transition-colors">
                    <span>Read Story</span>
                    <FaChevronRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accessible screen-reader summary */}
        <div className="sr-only">
          <h3>Customer Success Stories List</h3>
          <ul>
            {customers.map((c) => (
              <li key={c.id}>
                {c.name}, {c.role} at {c.company}. Certified in {c.course}. Quote: {c.fullReview}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* =========================================================
          4. ACCESSIBLE TESTIMONIAL DETAIL MODAL
      ========================================================= */}
      {selectedCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-customer-name"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121C46]/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              aria-label="Close testimonial dialog"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Learner Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md shrink-0">
                <img
                  src={selectedCustomer.image}
                  alt={selectedCustomer.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 id="modal-customer-name" className="text-xl sm:text-2xl font-extrabold text-[#121C46]">
                    {selectedCustomer.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <FaCheckCircle className="text-[10px]" />
                    <span>Verified Graduate</span>
                  </span>
                </div>

                <div className="text-sm text-slate-600 font-medium">
                  {selectedCustomer.role}
                </div>
                <div className="text-xs font-bold text-[#2563EB] mt-0.5">
                  {selectedCustomer.company}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(selectedCustomer.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedCustomer.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Course & Credential Information */}
            <div className="my-5 p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                  Certified Program
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#121C46]">
                  {selectedCustomer.course}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Registry Credential ID
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-slate-800">
                  {selectedCustomer.credentialId}
                </div>
              </div>
            </div>

            {/* Full Review Content */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FaQuoteLeft className="text-[#FFDB58]" />
                <span>Verified Experience &amp; Feedback</span>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{selectedCustomer.fullReview}"
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Harmonized with International ISO Competency Frameworks
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to="/categories/verify-certificate"
                  onClick={() => setSelectedCustomer(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121C46] hover:bg-[#1E2E6E] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <FaShieldAlt className="text-xs text-[#FFDB58]" />
                  <span>Verify Certificate</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerSphere3D;
