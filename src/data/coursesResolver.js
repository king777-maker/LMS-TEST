import { freeCoursesData, AUTHORITATIVE_FREE_COURSE_NAMES, getAuthoritativeCourseName } from "./freeCoursesData.js";
export { AUTHORITATIVE_FREE_COURSE_NAMES, getAuthoritativeCourseName };
import { navigationCategories } from "./coursesData";
import { courseData } from "./courseData";

// Fallback images tailored to categories
const CATEGORY_IMAGES = {
  quality: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  environmental: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80",
  safety: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
  aerospace: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200&q=80",
  lean: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  food: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=1200&q=80",
  automotive: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&q=80",
  medical: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
  continuity: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  default: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
};

export const getCategoryImage = (category = "", title = "") => {
  const combined = `${category} ${title}`.toLowerCase();
  if (combined.includes("5s") || combined.includes("workplace org")) return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80";
  if (combined.includes("fire") || combined.includes("cfso")) return "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1200&q=80";
  if (combined.includes("first aid") || combined.includes("cfap") || combined.includes("emergency") || combined.includes("cerp")) return "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1200&q=80";
  if (combined.includes("occupational") || combined.includes("cohp") || combined.includes("hygiene")) return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80";
  if (combined.includes("safety officer") || combined.includes("safety engineer") || combined.includes("hse manager") || combined.includes("chsem")) return "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80";
  if (combined.includes("50001") || combined.includes("energy")) return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80";
  if (combined.includes("31000") || combined.includes("risk")) return "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=80";
  if (combined.includes("20000") || combined.includes("it service") || combined.includes("itsms")) return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80";
  if (combined.includes("17025") || combined.includes("lab") || combined.includes("testing & cal")) return "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80";
  if (combined.includes("inspector") || combined.includes("qc-") || combined.includes("welding") || combined.includes("coating") || combined.includes("ndt") || combined.includes("cmm") || combined.includes("vmm")) return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80";
  if (combined.includes("diploma") || combined.includes("othm") || combined.includes("eduqual") || combined.includes("qualifi")) return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80";
  if (combined.includes("train the trainer") || combined.includes("ttt-")) return "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80";
  if (combined.includes("hr") || combined.includes("human resource") || combined.includes("posh")) return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80";
  if (combined.includes("aosh") || combined.includes("iosh") || combined.includes("nasp") || combined.includes("iadc") || combined.includes("scaffold") || combined.includes("confined")) return "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80";
  if (combined.includes("project") || combined.includes("program") || combined.includes("construction") || combined.includes("kaizen") || combined.includes("tpm") || combined.includes("tqm")) return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80";
  if (combined.includes("aero") || combined.includes("as9100") || combined.includes("aviation")) return CATEGORY_IMAGES.aerospace;
  if (combined.includes("cyber") || combined.includes("27001") || combined.includes("security")) return CATEGORY_IMAGES.cybersecurity;
  if (combined.includes("safety") || combined.includes("45001") || combined.includes("oh&s") || combined.includes("ehs")) return CATEGORY_IMAGES.safety;
  if (combined.includes("environ") || combined.includes("14001") || combined.includes("esg") || combined.includes("carbon")) return CATEGORY_IMAGES.environmental;
  if (combined.includes("six sigma") || combined.includes("lean") || combined.includes("lss") || combined.includes("belt")) return CATEGORY_IMAGES.lean;
  if (combined.includes("food") || combined.includes("22000") || combined.includes("haccp")) return CATEGORY_IMAGES.food;
  if (combined.includes("medical") || combined.includes("13485")) return CATEGORY_IMAGES.medical;
  if (combined.includes("auto") || combined.includes("16949")) return CATEGORY_IMAGES.automotive;
  if (combined.includes("continuity") || combined.includes("22301")) return CATEGORY_IMAGES.continuity;
  if (combined.includes("9001") || combined.includes("quality")) return CATEGORY_IMAGES.quality;
  return CATEGORY_IMAGES.default;
};

export const normalizeKey = (val) =>
  String(val || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

// Generate modular curriculum if not explicitly defined
export const generateCurriculumForCourse = (title = "", category = "") => {
  const t = title.toLowerCase();
  const isLead = t.includes("lead auditor") || t.includes("la");
  const isInternal = t.includes("internal auditor") || t.includes("ia");
  const isAerospace = t.includes("as9100") || t.includes("aerospace") || t.includes("defense");
  const isSixSigma = t.includes("six sigma") || t.includes("lean") || t.includes("belt");
  const isHSE = t.includes("health") || t.includes("safety") || t.includes("45001") || t.includes("hse") || t.includes("nebosh") || t.includes("hazop");

    if (isHSE && !isLead && !isInternal) {
    return [
      {
        id: 1,
        title: "Module 1: Principles of Occupational Health & Safety (ISO 45001 & OSHA)",
        lessons: [
          { id: 101, title: "Overview of Global HSE Frameworks & Statutory Obligations", duration: "45 Mins" },
          { id: 102, title: "Understanding Hazard vs. Risk & Annex SL High-Level Structure", duration: "50 Mins" },
          { id: 103, title: "Leadership Commitment, Worker Participation & Safety Policies", duration: "40 Mins" },
        ],
      },
      {
        id: 2,
        title: "Module 2: Hazard Identification, Risk Assessment (HIRA) & Control Hierarchy",
        lessons: [
          { id: 201, title: "Workplace Hazard Identification Methodologies & HIRA Matrix", duration: "55 Mins" },
          { id: 202, title: "Hierarchy of Controls: Elimination, Engineering & PPE Protocols", duration: "45 Mins" },
          { id: 203, title: "Job Safety Analysis (JSA) & Safe Operating Procedures (SOP)", duration: "50 Mins" },
        ],
      },
      {
        id: 3,
        title: "Module 3: Operational Controls, Emergency Response & Fire Safety",
        lessons: [
          { id: 301, title: "Emergency Preparedness, Evacuation Drills & Crisis Management", duration: "45 Mins" },
          { id: 302, title: "Incident Investigation, Root Cause Analysis & CAPA Reporting", duration: "50 Mins" },
          { id: 303, title: "Contractor Safety Management & Permit-to-Work (PTW) Systems", duration: "40 Mins" },
        ],
      },
      {
        id: 4,
        title: "Module 4: Performance Evaluation, Safety Auditing & Zero Harm Culture",
        lessons: [
          { id: 401, title: "Leading vs. Lagging HSE Key Performance Indicators (KPIs)", duration: "45 Mins" },
          { id: 402, title: "Internal HSE Audits & Regulatory Compliance Verification", duration: "50 Mins" },
          { id: 403, title: "Behavior-Based Safety (BBS) & Final Assessment Certification", duration: "60 Mins" },
        ],
      },
    ];
  }

  if (isSixSigma) {
    return [
      {
        id: 1,
        title: "Module 1: Define Phase & Process Mapping",
        lessons: [
          { id: 101, title: "Six Sigma Philosophy & Business Alignment", duration: "35 Mins" },
          { id: 102, title: "Developing Project Charters & Problem Statements", duration: "40 Mins" },
          { id: 103, title: "SIPOC Diagrams & Voice of Customer (VOC)", duration: "45 Mins" },
        ],
      },
      {
        id: 2,
        title: "Module 2: Measure Phase & Baseline Metrics",
        lessons: [
          { id: 201, title: "Data Collection Plans & Sampling Techniques", duration: "50 Mins" },
          { id: 202, title: "Measurement System Analysis (Gage R&R)", duration: "55 Mins" },
          { id: 203, title: "Process Capability (Cp, Cpk, Pp, Ppk)", duration: "45 Mins" },
        ],
      },
      {
        id: 3,
        title: "Module 3: Analyze Phase & Root Cause Identification",
        lessons: [
          { id: 301, title: "Fishbone Diagrams & 5 Whys Deep-Dive", duration: "40 Mins" },
          { id: 302, title: "Hypothesis Testing (t-tests, ANOVA, Chi-Square)", duration: "60 Mins" },
          { id: 303, title: "Value Stream Mapping & Non-Value-Add Elimination", duration: "45 Mins" },
        ],
      },
      {
        id: 4,
        title: "Module 4: Improve & Control Phases",
        lessons: [
          { id: 401, title: "Solution Generation, FMEA & Pilot Run", duration: "50 Mins" },
          { id: 402, title: "Statistical Process Control (SPC) Charts", duration: "55 Mins" },
          { id: 403, title: "Standard Operating Procedures & Final Project Sign-Off", duration: "40 Mins" },
        ],
      },
    ];
  }

  if (isLead) {
    return [
      {
        id: 1,
        title: "Module 1: Principles of Third-Party Auditing & Standards Framework",
        lessons: [
          { id: 101, title: "International Certification Schemes & ISO 19011 Guidelines", duration: "45 Mins" },
          { id: 102, title: "High-Level Structure (Annex SL) & Clause Interpretations", duration: "50 Mins" },
          { id: 103, title: "Lead Auditor Roles, Responsibilities & Code of Ethics", duration: "40 Mins" },
        ],
      },
      {
        id: 2,
        title: "Module 2: Stage 1 Document Review & Audit Preparation",
        lessons: [
          { id: 201, title: "Evaluating Organizational Context & Scope Documents", duration: "55 Mins" },
          { id: 202, title: "Formulating Detailed Stage 2 Audit Plans & Time Allocations", duration: "45 Mins" },
          { id: 203, title: "Drafting Comprehensive Process Audit Checklists", duration: "50 Mins" },
        ],
      },
      {
        id: 3,
        title: "Module 3: Stage 2 On-Site Auditing & Evidence Verification",
        lessons: [
          { id: 301, title: "Leading Opening & Closing Meetings with Management", duration: "45 Mins" },
          { id: 302, title: "Interviewing Executives & Operational Sampling Techniques", duration: "60 Mins" },
          { id: 303, title: "Evaluating Risk Treatments, KPIs & Legal Compliance", duration: "55 Mins" },
        ],
      },
      {
        id: 4,
        title: "Module 4: Non-Conformance Grading & Audit Reporting",
        lessons: [
          { id: 401, title: "Distinguishing Major vs. Minor Non-Conformances & OFIs", duration: "50 Mins" },
          { id: 402, title: "Writing Clear, Objective-Evidence Non-Conformance Reports", duration: "50 Mins" },
          { id: 403, title: "Surveillance Audits, Recertification & Final IRCA Examination", duration: "60 Mins" },
        ],
      },
    ];
  }

  if (isInternal) {
    return [
      {
        id: 1,
        title: "Module 1: Fundamentals of Internal Auditing (ISO 19011)",
        lessons: [
          { id: 101, title: "Purpose of Internal Audits & Management Commitment", duration: "35 Mins" },
          { id: 102, title: "Auditing Clauses & High-Level Structure (Annex SL)", duration: "45 Mins" },
          { id: 103, title: "Internal Auditor Competence & Objectivity", duration: "30 Mins" },
        ],
      },
      {
        id: 2,
        title: "Module 2: Audit Planning & Checklist Preparation",
        lessons: [
          { id: 201, title: "Annual Audit Scheduling & Risk-Based Prioritization", duration: "40 Mins" },
          { id: 202, title: "Process-Based Audit Checklists & Working Documents", duration: "45 Mins" },
        ],
      },
      {
        id: 3,
        title: "Module 3: Audit Execution & Evidence Gathering",
        lessons: [
          { id: 301, title: "Conducting Process Audits & Objective Evidence Verification", duration: "50 Mins" },
          { id: 302, title: "Evaluating Conformance vs. Opportunity for Improvement", duration: "40 Mins" },
        ],
      },
      {
        id: 4,
        title: "Module 4: Corrective Actions & Reporting",
        lessons: [
          { id: 401, title: "Root Cause Analysis (5-Whys, Fishbone) & CAPA", duration: "45 Mins" },
          { id: 402, title: "Reporting to Management & Follow-up Verification", duration: "35 Mins" },
        ],
      },
    ];
  }

  // Default Standard Curriculum (Foundation / General Awareness)
  return [
    {
      id: 1,
      title: "Module 1: Introduction to Framework & High-Level Structure",
      lessons: [
        { id: 101, title: "Overview of Standard Principles & Historical Evolution", duration: "35 Mins" },
        { id: 102, title: "Annex SL High-Level Structure & Core Terminology", duration: "40 Mins" },
        { id: 103, title: "Understanding the Plan-Do-Check-Act (PDCA) Methodology", duration: "30 Mins" },
      ],
    },
    {
      id: 2,
      title: "Module 2: Context of the Organization & Leadership",
      lessons: [
        { id: 201, title: "Analyzing Internal & External Context Factors", duration: "45 Mins" },
        { id: 202, title: "Determining Needs of Interested Parties & System Scope", duration: "40 Mins" },
        { id: 203, title: "Management Commitment, Organizational Roles & Policy Formulation", duration: "35 Mins" },
      ],
    },
    {
      id: 3,
      title: "Module 3: Risk-Based Thinking & Operational Implementation",
      lessons: [
        { id: 301, title: "Identifying Risks, Opportunities & Measurable Objectives", duration: "50 Mins" },
        { id: 302, title: "Operational Planning, Control & Competence Management", duration: "45 Mins" },
        { id: 303, title: "Documented Information Controls & Change Management", duration: "40 Mins" },
      ],
    },
    {
      id: 4,
      title: "Module 4: Performance Evaluation & Continual Improvement",
      lessons: [
        { id: 401, title: "Monitoring, Measurement, Analysis & Internal Audit Basics", duration: "45 Mins" },
        { id: 402, title: "Management Review Inputs & Continual Improvement Initiatives", duration: "40 Mins" },
        { id: 403, title: "Comprehensive Final Assessment & Verifiable Credential Issuance", duration: "45 Mins" },
      ],
    },
  ];
};

export const generateOutcomesForCourse = (title = "", category = "") => {
  return [
    `Master the comprehensive framework, statutory requirements, and clause structures of ${title}.`,
    `Apply risk-based thinking, the Plan-Do-Check-Act (PDCA) model, and process controls effectively.`,
    `Identify organizational context, stakeholder requirements, and compliance obligations.`,
    `Formulate measurable performance objectives and conduct rigorous continual improvement reviews.`,
    `Gain globally recognized credentials aligned with ISO/IEC 17024 and industry benchmark standards.`,
  ];
};

// Authoritative mapping from frontend free course identifiers to database certification IDs
export const FREE_COURSE_DB_MAP = {
  // Course 1: ISO 9001:2026 QMS Awareness (322)
  "free-1": 322,
  "1": 322,
  "322": 322,
  "iso-9001-2015-quality-management-foundation": 322,
  "iso-9001-2026-qms-awareness": 322,
  "iso9001-2026-qms-awareness": 322,

  // Course 2: ISO 14001:2026 EMS Awareness (332)
  "free-2": 332,
  "2": 332,
  "332": 332,
  "iso-14001-2015-environmental-foundation": 332,
  "iso-14001-2026-ems-awareness": 332,
  "iso14001-2026-ems-awareness": 332,

  // Course 3: ISO 45001:2018 OHSMS Awareness (323)
  "free-3": 323,
  "3": 323,
  "323": 323,
  "iso-45001-2018-ohs-awareness-course": 323,
  "iso-45001-2018-ohsms-awareness": 323,
  "iso45001-2018-ohsms-awareness": 323,

  // Course 4: ISO 22000:2018 FSMS Awareness (324)
  "free-4": 324,
  "4": 324,
  "324": 324,
  "iso-22000-2018-food-safety-foundation": 324,
  "iso-22000-2018-fsms-awareness": 324,
  "iso22000-2018-fsms-awareness": 324,

  // Course 5: ISO 19011:2026 Awareness (325)
  "free-5": 325,
  "5": 325,
  "325": 325,
  "iso-19011-2026-awareness": 325,
  "iso19011-2026-awareness": 325,
  "iso-19011-2018-auditing-guidelines-overview": 325,

  // Course 6: ISO 27001:2022 ISMS Awareness (333)
  "free-6": 333,
  "6": 333,
  "333": 333,
  "iso-27001-2022-information-security-foundation": 333,
  "iso-27001-2022-isms-awareness": 333,
  "iso27001-2022-isms-awareness": 333,

  // Course 7: 5S Workplace Management (326)
  "free-7": 326,
  "7": 326,
  "326": 326,
  "5s-workplace-management": 326,
  "5s-wm": 326,

  // Course 8: 7QC Tools Certification (327)
  "free-8": 327,
  "8": 327,
  "327": 327,
  "7qc-tools-certification": 327,

  // Course 9: Project Management Level-1 (328)
  "free-9": 328,
  "9": 328,
  "328": 328,
  "project-management-level-1": 328,
  "project-management-level-i": 328,

  // Course 10: Lean Six Sigma White Belt (329)
  "free-10": 329,
  "10": 329,
  "329": 329,
  "lean-six-sigma-whitebelt": 329,
  "lean-six-sigma-white-belt": 329,
  "lean-six-sigma-white-belt-foundation": 329,

  // Course 11: Root Cause Analysis (330)
  "free-11": 330,
  "11": 330,
  "330": 330,
  "root-cause-analysis": 330,
};

// Master collection of all normalized courses across the portal
export const getAllPortalCourses = () => {
  const masterList = [];
  const seenIds = new Set();

  // 1. Add all Free Courses
  freeCoursesData.forEach((fc) => {
    const dbId = FREE_COURSE_DB_MAP[fc.id] || Number(fc.id) || 322;
    const item = {
      ...fc,
      name: fc.name || fc.title,
      title: fc.title || fc.name,
      slug: fc.slug,
      id: fc.id,
      altId: dbId,
      altSlug: `free-${fc.id}`,
      course_id: dbId,
      certification_id: dbId,
      enrollId: dbId,
      source: "freeCoursesData",
      course_image: fc.image || getCategoryImage(fc.category, fc.title),
      image: fc.image || getCategoryImage(fc.category, fc.title),
      learning_mode: "Online (Self-Paced)",
      language: "English",
      certification: "Accredited Certificate of Achievement & Verifiable Digital Credential",
      price: 0,
      offer_price: 0,
      modules: fc.curriculum?.map((mod, i) => ({
        id: i + 1,
        title: mod.module || mod.title,
        lessons: mod.lessons.map((les, j) => ({
          id: (i + 1) * 100 + (j + 1),
          title: typeof les === "string" ? les : les.title,
          duration: les.duration || "35 Mins",
        })),
      })) || generateCurriculumForCourse(fc.title, fc.category),
      outcomes: fc.outcomes || generateOutcomesForCourse(fc.title, fc.category),
    };
    masterList.push(item);
    seenIds.add(String(fc.id));
    if (fc.slug) seenIds.add(fc.slug.toLowerCase());
  });

  // 2. Add all Navigation Categories Courses
  navigationCategories.forEach((cat) => {
    cat.courses?.forEach((c, idx) => {
      const slugKey = c.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const isFree = cat.id === "free-courses";
      const price = isFree ? 0 : 149;
      const hours = c.duration || "32 Hours";
      const freeNum = isFree ? c.id.replace("free-", "") : "";
      const dbId = isFree ? (FREE_COURSE_DB_MAP[c.id] || FREE_COURSE_DB_MAP[freeNum] || 322) : c.id;

      const item = {
        id: c.id,
        altId: dbId,
        code: c.code,
        name: c.title,
        title: c.title,
        slug: slugKey,
        altSlug: c.id,
        category: c.category || cat.title,
        duration: hours,
        level: c.level || "Intermediate",
        tag: c.tag || "Accredited",
        badge: c.tag || "Certified",
        description: c.description,
        short_description: c.description,
        course_image: getCategoryImage(c.category || cat.title, c.title),
        image: getCategoryImage(c.category || cat.title, c.title),
        price: price,
        offer_price: price,
        rating: 4.9,
        reviews: 140 + idx * 37,
        students: `${(2100 + idx * 340).toLocaleString()}`,
        students_count: 2100 + idx * 340,
        learning_mode: "Online (Self-Paced)",
        language: "English",
        certification: "Accredited Certificate of Achievement & Verifiable Digital Credential",
        certification_id: dbId,
        enrollId: dbId,
        source: "navigationCategories",
        modules: generateCurriculumForCourse(c.title, c.category || cat.title),
        outcomes: generateOutcomesForCourse(c.title, c.category || cat.title),
      };

      masterList.push(item);
    });
  });

  // 3. Add Catalog Courses from courseData
  courseData.forEach((cd) => {
    const slugKey = cd.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const item = {
      ...cd,
      id: String(cd.id),
      name: cd.title,
      title: cd.title,
      slug: slugKey,
      course_id: String(cd.id),
      duration: cd.hours || "32 Hours",
      course_image: cd.image || getCategoryImage(cd.category, cd.title),
      image: cd.image || getCategoryImage(cd.category, cd.title),
      learning_mode: "Online (Self-Paced)",
      language: "English",
      certification: "Accredited Certificate of Achievement & Verifiable Digital Credential",
      certification_id: String(cd.id),
      enrollId: String(cd.id),
      source: "courseData",
      modules: generateCurriculumForCourse(cd.title, cd.category),
      outcomes: generateOutcomesForCourse(cd.title, cd.category),
    };
    masterList.push(item);
  });

  return masterList;
};

// Unified course finder: Matches by slug, id, code, or mapped free identifier
export const resolveCourse = (identifier) => {
  if (!identifier) return null;

  const raw = String(identifier).trim();
  const normalized = normalizeKey(raw);
  const master = getAllPortalCourses();

  const finalizeCourse = (c) => {
    if (!c) return null;
    const authName = getAuthoritativeCourseName(c.certification_id || c.id || c.slug, c.title || c.name);
    if (authName) {
      return {
        ...c,
        name: authName,
        title: authName,
      };
    }
    return c;
  };

  // 1. Direct ID / AltId / AltSlug match
  let found = master.find(
    (c) =>
      String(c.id).toLowerCase() === raw.toLowerCase() ||
      String(c.altId || "").toLowerCase() === raw.toLowerCase() ||
      String(c.altSlug || "").toLowerCase() === raw.toLowerCase() ||
      String(c.certification_id || "").toLowerCase() === raw.toLowerCase()
  );
  if (found) return finalizeCourse(found);

  // 2. Direct Slug match
  found = master.find(
    (c) =>
      String(c.slug || "").toLowerCase() === raw.toLowerCase() ||
      normalizeKey(c.slug) === normalized
  );
  if (found) return finalizeCourse(found);

  // 3. Special free course map (e.g. "free-1", "1", "322", or slug aliases)
  if (FREE_COURSE_DB_MAP[raw.toLowerCase()]) {
    const mappedDbId = FREE_COURSE_DB_MAP[raw.toLowerCase()];
    found = master.find(
      (c) =>
        Number(c.certification_id) === mappedDbId ||
        Number(c.altId) === mappedDbId ||
        String(c.id) === String(mappedDbId)
    );
    if (found) return finalizeCourse(found);
  }

  // 4. Code match (e.g. "ISO 9001 FND", "ISO 9001 IA", "LSS-YB")
  found = master.find(
    (c) =>
      c.code &&
      (c.code.toLowerCase() === raw.toLowerCase() ||
        normalizeKey(c.code) === normalized)
  );
  if (found) return finalizeCourse(found);

  // 5. Normalized Title exact match
  found = master.find((c) => normalizeKey(c.title) === normalized);
  if (found) return finalizeCourse(found);

  // 6. Substring / Fuzzy match for known titles in master list (minimum length to prevent accidental broad matches)
  if (normalized.length >= 6) {
    found = master.find((c) => {
      const cNorm = normalizeKey(c.title);
      return cNorm === normalized || cNorm.includes(normalized) || normalized.includes(cNorm);
    });
    if (found) return finalizeCourse(found);
  }

  // Invalid or unrecognized course slug -> return null for proper not-found state
  return null;
};
