/**
 * Broadbeach Academy — Authoritative Free Courses Master Catalog
 * 
 * Standardized across the entire platform with:
 * - Exact required display names for all 11 courses
 * - Unified 5-chapter course curriculum
 * - Consistent 1 Year Access duration badge
 * - Strict course isolation & canonical DB IDs
 */

export const AUTHORITATIVE_FREE_COURSE_NAMES = {
  // Course 1
  322: "ISO 9001:2026 QMS",
  1: "ISO 9001:2026 QMS",
  "free-1": "ISO 9001:2026 QMS",
  "iso-9001-2026-qms-awareness": "ISO 9001:2026 QMS",
  "iso-9001-2015-quality-management-foundation": "ISO 9001:2026 QMS",

  // Course 2
  332: "ISO14001: 2026 EMS",
  2: "ISO14001: 2026 EMS",
  "free-2": "ISO14001: 2026 EMS",
  "iso-14001-2026-ems-awareness": "ISO14001: 2026 EMS",
  "iso-14001-2015-environmental-foundation": "ISO14001: 2026 EMS",

  // Course 3
  323: "ISO 45001:2018 OHSMS",
  3: "ISO 45001:2018 OHSMS",
  "free-3": "ISO 45001:2018 OHSMS",
  "iso-45001-2018-ohsms-awareness": "ISO 45001:2018 OHSMS",
  "iso-45001-2018-ohs-awareness-course": "ISO 45001:2018 OHSMS",

  // Course 4
  324: "ISO 22000:2018 FSMS",
  4: "ISO 22000:2018 FSMS",
  "free-4": "ISO 22000:2018 FSMS",
  "iso-22000-2018-fsms-awareness": "ISO 22000:2018 FSMS",
  "iso-22000-2018-food-safety-foundation": "ISO 22000:2018 FSMS",

  // Course 5
  325: "ISO 19011:2026",
  5: "ISO 19011:2026",
  "free-5": "ISO 19011:2026",
  "iso-19011-2026-awareness": "ISO 19011:2026",
  "iso-19011-2018-auditing-guidelines-overview": "ISO 19011:2026",

  // Course 6
  333: "ISO 27001:2022 ISMS",
  6: "ISO 27001:2022 ISMS",
  "free-6": "ISO 27001:2022 ISMS",
  "iso-27001-2022-isms-awareness": "ISO 27001:2022 ISMS",
  "iso-27001-2022-information-security-foundation": "ISO 27001:2022 ISMS",

  // Course 7
  326: "5S Workplace Management",
  7: "5S Workplace Management",
  "free-7": "5S Workplace Management",
  "5s-workplace-management": "5S Workplace Management",
  "5s-wm": "5S Workplace Management",

  // Course 8
  327: "7QC Tools Certification",
  8: "7QC Tools Certification",
  "free-8": "7QC Tools Certification",
  "7qc-tools-certification": "7QC Tools Certification",
  "7-qc-tools": "7QC Tools Certification",

  // Course 9
  328: "Project Management Level-1",
  9: "Project Management Level-1",
  "free-9": "Project Management Level-1",
  "project-management-level-1": "Project Management Level-1",
  "project-management-level-i": "Project Management Level-1",

  // Course 10
  329: "Lean Six Sigma White belt",
  10: "Lean Six Sigma White belt",
  "free-10": "Lean Six Sigma White belt",
  "lean-six-sigma-whitebelt": "Lean Six Sigma White belt",
  "lean-six-sigma-white-belt": "Lean Six Sigma White belt",

  // Course 11
  330: "Root Cause Analysis",
  11: "Root Cause Analysis",
  "free-11": "Root Cause Analysis",
  "root-cause-analysis": "Root Cause Analysis",
  "rca-certification": "Root Cause Analysis",
};

export const getAuthoritativeCourseName = (idOrSlug, fallback = "") => {
  if (!idOrSlug) return fallback;
  const str = String(idOrSlug).toLowerCase().trim();
  if (AUTHORITATIVE_FREE_COURSE_NAMES[str]) return AUTHORITATIVE_FREE_COURSE_NAMES[str];
  if (AUTHORITATIVE_FREE_COURSE_NAMES[String(idOrSlug)]) return AUTHORITATIVE_FREE_COURSE_NAMES[String(idOrSlug)];
  return fallback || idOrSlug;
};

export const freeCoursesData = [
  {
    id: "322",
    video_url: "https://drive.google.com/file/d/1pUO72EJ_DekcT4rEnCZ0239G7s8cQ9g0/preview",
    drive_file_id: "1pUO72EJ_DekcT4rEnCZ0239G7s8cQ9g0",
    altId: "1",
    slug: "iso-9001-2026-qms-awareness",
    altSlug: "iso-9001-2015-quality-management-foundation",
    code: "ISO 9001 QMS",
    name: "ISO 9001:2026 QMS",
    title: "ISO 9001:2026 QMS",
    category: "Quality Management",
    level: "Beginner",
    duration: "12 Hours",
    access: "1 Year Access",
    price: 0,
    students: "2,850",
    students_count: 2850,
    rating: 4.9,
    reviews: 245,
    badge: "Free Certification",
    tag: "High Demand",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
    short_description: "Master the foundational concepts, principles, and high-level structure of ISO 9001:2026 Quality Management Systems.",
    description: "This complimentary certification course introduces learners to the fundamental principles of Quality Management Systems (QMS) based on ISO 9001:2026. You will explore the 7 Quality Management Principles, the Annex SL framework, PDCA cycle, and risk-based thinking, equipping you to contribute actively to quality assurance initiatives in your organization.",
    outcomes: [
      "Understand the 7 core Quality Management Principles governing ISO 9001:2026.",
      "Navigate the Annex SL structure (Clauses 4 through 10) with ease.",
      "Apply the Plan-Do-Check-Act (PDCA) cycle and process approach in business.",
      "Identify internal and external context factors and interested parties.",
      "Understand risk-based thinking and leadership commitments."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to ISO 9001:2026 QMS",
        title: "Chapter 1 — Introduction to ISO 9001:2026 QMS",
        lessons: [
          "Purpose, Scope & Evolution of ISO 9001:2026 QMS",
          "Harmonized High-Level Structure (Annex SL) Overview",
          "Understanding the Quality Management System Purpose & Objectives"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "The 7 Core Quality Management Principles (QMPs)",
          "Plan-Do-Check-Act (PDCA) Cycle & Process Approach",
          "Risk-Based Thinking & Opportunity Identification",
          "Organizational Context, Interested Parties & Quality Policy"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Operational Planning, Support & Process Control Synthesis",
          "Performance Evaluation, Internal Auditing & Management Review",
          "Continual Improvement & Key Learning Synthesis"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "ISO 9001:2026 QMS Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "332",
    video_url: "https://drive.google.com/file/d/1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF/preview",
    drive_file_id: "1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF",
    altId: "2",
    slug: "iso-14001-2026-ems-awareness",
    altSlug: "iso-14001-2015-environmental-foundation",
    code: "ISO 14001 EMS",
    name: "ISO14001: 2026 EMS",
    title: "ISO14001: 2026 EMS",
    category: "Environmental Management",
    level: "Beginner",
    duration: "12 Hours",
    access: "1 Year Access",
    price: 0,
    students: "1,960",
    students_count: 1960,
    rating: 4.8,
    reviews: 182,
    badge: "Free Certification",
    tag: "Corporate ESG",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900",
    short_description: "Understand environmental aspects, compliance obligations, sustainability goals, and EMS implementation foundations.",
    description: "The ISO14001: 2026 Environmental Management Foundation course helps professionals understand how organizations can reduce their environmental footprint, maintain regulatory compliance, and drive sustainable operational practices.",
    outcomes: [
      "Define environmental aspects and evaluate their associated impacts.",
      "Interpret regulatory environmental compliance obligations.",
      "Learn emergency preparedness and environmental response planning.",
      "Adopt a life cycle perspective in procurement and product design."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to ISO14001: 2026 EMS",
        title: "Chapter 1 — Introduction to ISO14001: 2026 EMS",
        lessons: [
          "Purpose, Scope & Relevance of ISO14001: 2026 EMS",
          "Global Environmental Challenges & Corporate Sustainability",
          "The Structure of Environmental Management Systems"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "Environmental Aspects vs. Impacts Analysis",
          "Compliance Obligations & Statutory Legal Benchmarks",
          "Life Cycle Perspective in Operations & Procurement",
          "Environmental Policy, Objectives & Leadership Commitment"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Operational Controls & Emergency Response Planning Review",
          "Monitoring, Measurement, Analysis & Internal EMS Auditing",
          "Continual Improvement & Environmental Performance Synthesis"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "ISO14001: 2026 EMS Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "323",
    video_url: "https://drive.google.com/file/d/1d8fXlmI7RynuPhO_sgCtsQM1Bd7WQ0Qn/preview",
    drive_file_id: "1d8fXlmI7RynuPhO_sgCtsQM1Bd7WQ0Qn",
    altId: "3",
    slug: "iso-45001-2018-ohsms-awareness",
    altSlug: "iso-45001-2018-ohs-awareness-course",
    code: "ISO 45001 OHSMS",
    name: "ISO 45001:2018 OHSMS",
    title: "ISO 45001:2018 OHSMS",
    category: "Health & Safety",
    level: "Beginner",
    duration: "14 Hours",
    access: "1 Year Access",
    price: 0,
    students: "3,240",
    students_count: 3240,
    rating: 4.9,
    reviews: 310,
    badge: "Free Certification",
    tag: "Safety Standard",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900",
    short_description: "Identify workplace hazards, mitigate occupational risks, and foster an organizational culture of safety excellence.",
    description: "ISO 45001:2018 is the premier benchmark for Occupational Health and Safety Management Systems. This course delivers deep insights into hazard identification, risk assessment (HIRA), legal compliance, and worker consultation mechanisms.",
    outcomes: [
      "Implement the hierarchy of risk controls across high-hazard environments.",
      "Conduct Hazard Identification and Risk Assessments (HIRA) effectively.",
      "Drive active employee participation in safety management.",
      "Structure incident investigation and root cause CAPA programs."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to ISO 45001:2018 OHSMS",
        title: "Chapter 1 — Introduction to ISO 45001:2018 OHSMS",
        lessons: [
          "Purpose, History & Global Importance of ISO 45001:2018 OHSMS",
          "The Business & Humanitarian Case for Zero-Harm Workplaces",
          "High-Level Structure & Alignment with International Labor Standards"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "Hazard vs. Risk & Hazard Identification Methodologies (HIRA)",
          "The Hierarchy of Controls: Elimination, Engineering & PPE",
          "Worker Consultation, Participation & Leadership Responsibility",
          "Legal Requirements, Statutory Compliance & Emergency Planning"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Incident Investigation, Nonconformity & Corrective Action (CAPA)",
          "Safety Performance Indicators: Leading vs. Lagging KPIs",
          "Continual Improvement in OH&S Culture & Takeaways"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "ISO 45001:2018 OHSMS Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "324",
    video_url: "https://drive.google.com/file/d/1ata4Mu3Fq-US5W1LR3Sz0nbw1RbecBMv/preview",
    drive_file_id: "1ata4Mu3Fq-US5W1LR3Sz0nbw1RbecBMv",
    altId: "4",
    slug: "iso-22000-2018-fsms-awareness",
    altSlug: "iso-22000-2018-food-safety-foundation",
    code: "ISO 22000 FSMS",
    name: "ISO 22000:2018 FSMS",
    title: "ISO 22000:2018 FSMS",
    category: "Food Safety",
    level: "Beginner",
    duration: "10 Hours",
    access: "1 Year Access",
    price: 0,
    students: "1,720",
    students_count: 1720,
    rating: 4.8,
    reviews: 145,
    badge: "Food Safety",
    tag: "HACCP Integrated",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=900",
    short_description: "Master interactive communication, prerequisite programmes (PRPs), and HACCP principles for farm-to-fork safety.",
    description: "Learn how ISO 22000:2018 harmonizes global food safety standards, integrating HACCP principles with prerequisite programmes to prevent foodborne hazards throughout the supply chain.",
    outcomes: [
      "Differentiate biological, chemical, physical, and allergen food hazards.",
      "Design and maintain Prerequisite Programmes (PRPs) and Operational PRPs (OPRPs).",
      "Establish Critical Control Points (CCPs) and critical limits.",
      "Implement traceability and withdrawal/recall simulation procedures."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to ISO 22000:2018 FSMS",
        title: "Chapter 1 — Introduction to ISO 22000:2018 FSMS",
        lessons: [
          "Purpose, Global Scope & Need for Food Safety Management",
          "Farm-to-Fork Supply Chain Security & Consumer Health",
          "Dual Plan-Do-Check-Act Architecture in ISO 22000:2018"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "Food Safety Hazard Categories: Biological, Chemical, Physical & Allergenic",
          "Prerequisite Programmes (PRPs) & ISO/TS 22002 Guidelines",
          "The 7 Principles of HACCP & Hazard Analysis Methodology",
          "Critical Control Points (CCPs) vs. Operational PRPs (OPRPs)"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Traceability Systems, Lot Tracking & Withdrawal / Recall Drills",
          "FSMS Verification, Validation & Internal Audit Requirements",
          "Food Safety Continual Improvement & Compliance Summary"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "ISO 22000:2018 FSMS Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "325",
    video_url: "https://drive.google.com/file/d/1B0lAdFBcJjpCpYRFjGzpQF_rUPv5KMen/preview",
    drive_file_id: "1B0lAdFBcJjpCpYRFjGzpQF_rUPv5KMen",
    altId: "5",
    slug: "iso-19011-2026-awareness",
    altSlug: "iso-19011-2018-auditing-guidelines-overview",
    code: "ISO 19011 AUD",
    name: "ISO 19011:2026",
    title: "ISO 19011:2026",
    category: "Auditing Principles",
    level: "Beginner",
    duration: "10 Hours",
    access: "1 Year Access",
    price: 0,
    students: "2,150",
    students_count: 2150,
    rating: 4.9,
    reviews: 190,
    badge: "Essential Toolkit",
    tag: "Auditor Core",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=900",
    short_description: "Master the principles of auditing, managing an audit programme, and conducting management system assessments.",
    description: "ISO 19011 is the universal guideline used across all ISO standards for internal and external audits. Gain clarity on auditor ethics, evidence evaluation, audit reporting, and managing auditor teams.",
    outcomes: [
      "Understand the 7 core principles of auditing (Integrity, Fair Presentation, Due Professional Care).",
      "Plan and manage an organizational annual audit programme.",
      "Conduct opening meetings, interviews, and objective evidence sampling.",
      "Draft clear, non-conformance reports (NCRs) and evaluate corrective actions."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to ISO 19011:2026",
        title: "Chapter 1 — Introduction to ISO 19011:2026",
        lessons: [
          "Scope, Principles & Universal Applicability of ISO 19011:2026",
          "Types of Audits: First-Party, Second-Party & Third-Party Audits",
          "The Strategic Role of Auditing in Governance & Compliance"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "The 7 Core Principles of Auditing (Integrity, Due Professional Care, Confidentiality)",
          "Managing the Audit Programme: Objectives, Scope & Risk Assessment",
          "Auditor Competence, Personal Behaviors & Code of Conduct",
          "Gathering Objective Evidence, Sampling Methods & Verification"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Opening Meetings, Interviews & Closing Meeting Best Practices",
          "Drafting Non-Conformance Reports (NCRs) & Corrective Action Verification",
          "Audit Reporting, Follow-Up & Continuous Improvement Summary"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "ISO 19011:2026 Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "333",
    video_url: "https://drive.google.com/file/d/1nBU1umbTslqdgl7Lt1JfUhV1MhnwhCu1/preview",
    drive_file_id: "1nBU1umbTslqdgl7Lt1JfUhV1MhnwhCu1",
    altId: "6",
    slug: "iso-27001-2022-isms-awareness",
    altSlug: "iso-27001-2022-information-security-foundation",
    code: "ISO 27001 ISMS",
    name: "ISO 27001:2022 ISMS",
    title: "ISO 27001:2022 ISMS",
    category: "Information Security",
    level: "Beginner",
    duration: "12 Hours",
    access: "1 Year Access",
    price: 0,
    students: "4,110",
    students_count: 4110,
    rating: 4.9,
    reviews: 420,
    badge: "Top Rated",
    tag: "Cyber Resilience",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
    short_description: "Protect critical enterprise data assets, manage cyber threats, and navigate the refreshed 93 Annex A security controls.",
    description: "Information security is an executive boardroom priority. This foundation program breaks down ISO/IEC 27001:2022, detailing risk treatment methodologies, access controls, incident response, and the updated Annex A controls.",
    outcomes: [
      "Understand Confidentiality, Integrity, and Availability (CIA triad).",
      "Draft an authoritative Statement of Applicability (SoA).",
      "Categorize the 93 Annex A controls across People, Physical, Technological, and Organizational domains.",
      "Handle data breaches, threat vulnerability assessments, and continuity protocols."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to ISO 27001:2022 ISMS",
        title: "Chapter 1 — Introduction to ISO 27001:2022 ISMS",
        lessons: [
          "Purpose, Scope & Relevance of ISO 27001:2022 in Modern Cyberspace",
          "Information as a Critical Asset & Global Threat Landscape",
          "High-Level Structure of ISO/IEC 27001:2022 Management System"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "The CIA Triad: Confidentiality, Integrity & Availability Explained",
          "Risk Assessment & Risk Treatment Methodologies",
          "Drafting the Statement of Applicability (SoA)",
          "The 93 Annex A Controls: Organizational, People, Physical & Technological"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Information Security Incident Management & Breach Response",
          "Business Continuity, Redundancy & Disaster Recovery Standards",
          "ISMS Internal Audits, Metrics & Continual Improvement Synthesis"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "ISO 27001:2022 ISMS Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "326",
    video_url: "https://drive.google.com/file/d/1f3IPJVBmxft4RFWT_1tNP0fcLVmqFgEH/preview",
    drive_file_id: "1f3IPJVBmxft4RFWT_1tNP0fcLVmqFgEH",
    altId: "7",
    slug: "5s-workplace-management",
    altSlug: "5s-wm",
    code: "5S-WM",
    name: "5S Workplace Management",
    title: "5S Workplace Management",
    category: "Operational Excellence",
    level: "Beginner",
    duration: "10 Hours",
    access: "1 Year Access",
    price: 0,
    students: "1,890",
    students_count: 1890,
    rating: 4.8,
    reviews: 160,
    badge: "Free Certification",
    tag: "Lean Workplace",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900",
    short_description: "Master workplace organization, visual management, and waste elimination through the 5S methodology.",
    description: "5S is the cornerstone of Lean manufacturing and efficient office operations. Learn how to implement Sort, Set in Order, Shine, Standardize, and Sustain to enhance safety, reduce downtime, and drive daily discipline.",
    outcomes: [
      "Execute workplace audits and red-tag sorting exercises.",
      "Design visual control systems and shadow boards for tooling.",
      "Establish routine cleaning inspections that uncover hidden defects.",
      "Standardize procedures and embed a sustainable continuous improvement culture."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to 5S Workplace Management",
        title: "Chapter 1 — Introduction to 5S Workplace Management",
        lessons: [
          "Origins & Evolution of 5S in the Toyota Production System",
          "The 8 Types of Waste (Muda) & Costs of Workplace Disorder",
          "Strategic Benefits: Safety, Quality, Morale & Productivity"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "Seiri (Sort): Red-Tag Strategy & Disposition Guidelines",
          "Seiton (Set in Order): Signboards, Color-Coding & Shadow Boards",
          "Seiso (Shine): Cleaning with Meaning as an Inspection Tool",
          "Visual Control Systems & Point-of-Use Storage Principles"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Seiketsu (Standardize): Visual Standards, SOPs & Checklists",
          "Shitsuke (Sustain): Audit Protocols, Habits & Cultural Discipline",
          "5S Continuous Improvement Journey & Operational Summary"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "5S Workplace Management Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "327",
    video_url: "https://drive.google.com/file/d/1N6W0gecj1oY2keSxzWDX_ZMLB0ctH-eZ/preview",
    drive_file_id: "1N6W0gecj1oY2keSxzWDX_ZMLB0ctH-eZ",
    altId: "8",
    slug: "7qc-tools-certification",
    altSlug: "7-qc-tools",
    code: "7QC-TOOLS",
    name: "7QC Tools Certification",
    title: "7QC Tools Certification",
    category: "Quality Engineering",
    level: "Beginner",
    duration: "12 Hours",
    access: "1 Year Access",
    price: 0,
    students: "2,340",
    students_count: 2340,
    rating: 4.9,
    reviews: 215,
    badge: "Free Certification",
    tag: "Quality Core",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900",
    short_description: "Master the 7 fundamental quality control graphical tools to analyze data, resolve shopfloor defects, and drive process capability.",
    description: "The 7 Quality Control Tools (Check Sheet, Histogram, Pareto Chart, Fishbone Diagram, Stratification, Scatter Plot, and Control Chart) empower engineers and operational staff to solve 95% of workplace quality issues systematically.",
    outcomes: [
      "Construct and interpret Pareto charts applying the 80/20 rule.",
      "Facilitate Fishbone (Ishikawa) brainstorming using 6M categories.",
      "Build statistical process Control Charts with upper/lower control limits.",
      "Analyze process capability and correlation using Scatter Plots and Histograms."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to 7QC Tools Certification",
        title: "Chapter 1 — Introduction to 7QC Tools Certification",
        lessons: [
          "Philosophy of Dr. Kaoru Ishikawa & Data-Driven Quality",
          "The Power of Visual & Graphical Quality Tools",
          "Data Collection Protocols, Stratification & Integrity"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "Check Sheets & Histograms: Frequency Distribution & Shape",
          "Pareto Charts: The 80/20 Rule for Defect Prioritization",
          "Cause-and-Effect (Fishbone / Ishikawa) Diagram & 6M Brainstorming",
          "Scatter Plots & Shewhart Statistical Control Charts (UCL/LCL)"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Integrated Shopfloor Problem-Solving Methodology",
          "Statistical Process Capability & Variation Reduction",
          "Sustaining Quality Standards & 7QC Synthesis"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "7QC Tools Certification Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "328",
    video_url: "https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview",
    drive_file_id: "16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ",
    altId: "9",
    slug: "project-management-level-1",
    altSlug: "project-management-fnd",
    code: "PM-L1",
    name: "Project Management Level-1",
    title: "Project Management Level-1",
    category: "Management",
    level: "Beginner",
    duration: "12 Hours",
    access: "1 Year Access",
    price: 0,
    students: "1,650",
    students_count: 1650,
    rating: 4.8,
    reviews: 135,
    badge: "Free Certification",
    tag: "Career Accelerator",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900",
    short_description: "Master foundational project management concepts: scoping, scheduling, budgeting, risk tracking, and stakeholder communication.",
    description: "Gain comprehensive foundational skills in project management. Understand the project lifecycle from initiation to closure, learn how to build Work Breakdown Structures (WBS), track critical path schedules, and manage risk registers.",
    outcomes: [
      "Draft a professional Project Charter and define measurable success criteria.",
      "Decompose project scope into a 100% rule Work Breakdown Structure (WBS).",
      "Determine Critical Path schedules and manage activity float.",
      "Establish Risk Registers and stakeholder communication plans."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to Project Management Level-1",
        title: "Chapter 1 — Introduction to Project Management Level-1",
        lessons: [
          "What is a Project? Temporary Endeavors vs. Ongoing Operations",
          "The Project Management Lifecycle (Initiation to Closure)",
          "Drafting the Project Charter & Identifying Key Stakeholders"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "The Triple Constraint: Scope, Time, and Budget Balance",
          "Work Breakdown Structure (WBS) Architecture & 100% Rule",
          "Network Diagrams & Critical Path Method (CPM) Scheduling",
          "Qualitative Risk Management, Risk Registers & Mitigation Plans"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Project Execution, Baseline Tracking & Formal Change Control",
          "Earned Value Management (EVM) Basics & Cost Performance",
          "Project Closeout, Debriefs, Lessons Learned & Delivery Takeaways"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "Project Management Level-1 Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "329",
    video_url: "https://drive.google.com/file/d/1fxp0MwEy6hEvw5jKbnEeoX-7eadJUZR_/preview",
    drive_file_id: "1fxp0MwEy6hEvw5jKbnEeoX-7eadJUZR_",
    altId: "10",
    slug: "lean-six-sigma-whitebelt",
    altSlug: "lean-six-sigma-white-belt",
    code: "LSS-WB",
    name: "Lean Six Sigma White belt",
    title: "Lean Six Sigma White belt",
    category: "Process Improvement",
    level: "Beginner",
    duration: "10 Hours",
    access: "1 Year Access",
    price: 0,
    students: "3,890",
    students_count: 3890,
    rating: 4.9,
    reviews: 380,
    badge: "Popular Certification",
    tag: "Six Sigma",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900",
    short_description: "Understand the DMAIC roadmap, Lean waste reduction principles, and how to support organizational improvement teams.",
    description: "Lean Six Sigma White Belt certification provides the foundational awareness needed to understand defect reduction, process variation, and the DMAIC (Define, Measure, Analyze, Improve, Control) problem-solving methodology.",
    outcomes: [
      "Understand the DMAIC lifecycle and project governance.",
      "Identify the 8 Lean wastes (TIMWOODS) in transaction and shopfloor environments.",
      "Apply Voice of the Customer (VOC) and SIPOC mapping.",
      "Support Green and Black Belts on continuous improvement projects."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to Lean Six Sigma White belt",
        title: "Chapter 1 — Introduction to Lean Six Sigma White belt",
        lessons: [
          "Origins & Evolution of Lean & Six Sigma Methodologies",
          "Cost of Poor Quality (COPQ) & Process Variation Impact",
          "White Belt Belt Hierarchy, Roles & Improvement Team Support"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "The 8 Forms of Waste (TIMWOODS) in Production & Office",
          "Voice of the Customer (VOC) & Critical to Quality (CTQ) Metrics",
          "The DMAIC Roadmap: Define, Measure, Analyze, Improve, Control",
          "SIPOC High-Level Process Mapping & Mistake Proofing (Poka-Yoke)"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Defect Rates, DPMO & Baseline Sigma Level Concepts",
          "Control Plans, Standard Work & Sustaining Operational Gains",
          "White Belt Project Participation & Continuous Improvement Summary"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "Lean Six Sigma White belt Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  },
  {
    id: "330",
    video_url: "https://drive.google.com/file/d/10H6QOlqWd_IJdASNAJyyZ5Q3z9the8xu/preview",
    drive_file_id: "10H6QOlqWd_IJdASNAJyyZ5Q3z9the8xu",
    altId: "11",
    slug: "root-cause-analysis",
    altSlug: "rca-certification",
    code: "RCA-FND",
    name: "Root Cause Analysis",
    title: "Root Cause Analysis",
    category: "Problem Solving",
    level: "Beginner",
    duration: "10 Hours",
    access: "1 Year Access",
    price: 0,
    students: "2,050",
    students_count: 2050,
    rating: 4.8,
    reviews: 175,
    badge: "Free Certification",
    tag: "CAPA Excellence",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
    short_description: "Master structured problem solving using 5-Whys, Fishbone, Fault Tree, and robust CAPA verification protocols.",
    description: "Recurring operational failures cost businesses billions. This course provides rigorous, systematic Root Cause Analysis (RCA) techniques to drill past superficial symptoms, identify true underlying drivers, and implement lasting preventive actions.",
    outcomes: [
      "Structure problem statements using 5W2H (Who, What, Where, When, Why, How, How Many).",
      "Conduct deep-dive 5-Whys iterations avoiding superficial stop conditions.",
      "Build Fishbone diagrams incorporating 6M system perspectives.",
      "Design and validate Corrective and Preventive Actions (CAPA) to eliminate recurrence."
    ],
    curriculum: [
      {
        id: 1,
        module: "Chapter 1 — Introduction to Root Cause Analysis",
        title: "Chapter 1 — Introduction to Root Cause Analysis",
        lessons: [
          "The Critical Business Impact of Recurring Operational Failures",
          "Symptoms vs. Root Causes: Avoiding Premature Problem Closure",
          "Immediate Containment Actions vs. Long-Term Permanent Solutions"
        ]
      },
      {
        id: 2,
        module: "Chapter 2 — Understands Core Concepts",
        title: "Chapter 2 — Understands Core Concepts",
        lessons: [
          "5W2H Problem Definition Framework (Who, What, Where, When, Why, How)",
          "The 5-Whys Iteration Technique: Golden Rules & Common Pitfalls",
          "Cause-and-Effect Fishbone Mapping Using 6M System Perspective",
          "Fault Tree Analysis (FTA) & Barrier Analysis Fundamentals"
        ]
      },
      {
        id: 3,
        module: "Chapter 3 — Course Summary",
        title: "Chapter 3 — Course Summary",
        lessons: [
          "Developing Foolproof Corrective & Preventive Actions (CAPA)",
          "Action Effectiveness Verification Over Time to Prevent Recurrence",
          "Building a Just Root-Cause Problem Solving Culture & Summary"
        ]
      },
      {
        id: 4,
        module: "Chapter 4 — Assessment",
        title: "Chapter 4 — Assessment",
        lessons: [
          "Root Cause Analysis Knowledge Assessment (70% to Pass)"
        ]
      },
      {
        id: 5,
        module: "Chapter 5 — Download Certificate",
        title: "Chapter 5 — Download Certificate",
        lessons: [
          "Accredited Digital Certificate Issuance & QR Verification"
        ]
      }
    ]
  }
];

export const STATIC_FREE_CERT_METADATA = {
  322: {
    category: "Quality Management",
    students_count: 2850,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
  },
  323: {
    category: "Health & Safety",
    students_count: 3240,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900",
  },
  324: {
    category: "Food Safety",
    students_count: 1720,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=900",
  },
  325: {
    category: "Auditing & Governance",
    students_count: 2150,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=900",
  },
  326: {
    category: "Quality Management",
    students_count: 1890,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900",
  },
  327: {
    category: "Quality Management",
    students_count: 2340,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900",
  },
  328: {
    category: "Auditing & Governance",
    students_count: 1650,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900",
  },
  329: {
    category: "Quality Management",
    students_count: 3890,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900",
  },
  330: {
    category: "Quality Management",
    students_count: 2050,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
  },
  332: {
    category: "Environmental Management",
    students_count: 1960,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900",
  },
  333: {
    category: "Information Security",
    students_count: 4110,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
  },
  335: {
    category: "Environmental Management",
    students_count: 3120,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900",
  },
  336: {
    category: "Health & Safety",
    students_count: 3450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900",
  },
  337: {
    category: "Food Safety",
    students_count: 2280,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=900",
  },
  338: {
    category: "Quality Management",
    students_count: 2670,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900",
  },
  339: {
    category: "Quality Management",
    students_count: 2190,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517976487504-59a1a349c214?w=900",
  },
  340: {
    category: "Environmental Management",
    students_count: 1840,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900",
  },
  341: {
    category: "Information Security",
    students_count: 4520,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
  },
  342: {
    category: "Information Security",
    students_count: 3760,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900",
  },
  343: {
    category: "Information Security",
    students_count: 1950,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900",
  },
  344: {
    category: "Auditing & Governance",
    students_count: 2040,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900",
  },
  345: {
    category: "Quality Management",
    students_count: 4890,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
  },
  346: {
    category: "Auditing & Governance",
    students_count: 2980,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900",
  },
  347: {
    category: "Auditing & Governance",
    students_count: 1540,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900",
  },
  348: {
    category: "Quality Management",
    students_count: 2350,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900",
  },
  349: {
    category: "Auditing & Governance",
    students_count: 1780,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=900",
  },
  350: {
    category: "Auditing & Governance",
    students_count: 1620,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900",
  },
  351: {
    category: "Information Security",
    students_count: 2890,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900",
  },
  352: {
    category: "Food Safety",
    students_count: 2450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=900",
  },
  353: {
    category: "Food Safety",
    students_count: 1670,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900",
  },
  354: {
    category: "Food Safety",
    students_count: 1590,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
  },
  355: {
    category: "Quality Management",
    students_count: 2110,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900",
  },
};

export const deriveFreeCourseCategory = (cert) => {
  if (!cert) return "Quality Management";
  const idStr = String(cert.id || "");
  if (STATIC_FREE_CERT_METADATA[idStr]?.category) {
    return STATIC_FREE_CERT_METADATA[idStr].category;
  }
  const text = `${cert.name || ""} ${cert.title || ""} ${cert.description || ""}`.toLowerCase();
  if (text.includes("45001") || text.includes("ohsms") || text.includes("health & safety") || text.includes("occupational health")) {
    return "Health & Safety";
  }
  if (text.includes("14001") || text.includes("ems") || text.includes("50001") || text.includes("energy") || text.includes("environment")) {
    return "Environmental Management";
  }
  if (text.includes("27001") || text.includes("27701") || text.includes("42001") || text.includes("20000") || text.includes("isms") || text.includes("security") || text.includes("privacy") || text.includes("artificial intelligence") || text.includes("cyber")) {
    return "Information Security";
  }
  if (text.includes("22000") || text.includes("fsms") || text.includes("haccp") || text.includes("vaccp") || text.includes("taccp") || text.includes("food")) {
    return "Food Safety";
  }
  if (text.includes("19011") || text.includes("22301") || text.includes("31000") || text.includes("37001") || text.includes("41001") || text.includes("55001") || text.includes("project management") || text.includes("risk") || text.includes("governance") || text.includes("audit")) {
    return "Auditing & Governance";
  }
  return "Quality Management";
};

export default freeCoursesData;
