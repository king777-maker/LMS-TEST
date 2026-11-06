import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";
import toast from "react-hot-toast";
import {
  FaAward,
  FaBookOpen,
  FaClock,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaSearch,
  FaArrowRight,
  FaGraduationCap,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaChevronRight,
  FaCertificate,
  FaGlobe,
  FaPaperPlane,
  FaChartBar,
  FaEnvelope,
} from "react-icons/fa";
import { navigationCategories } from "../data/coursesData";
import { getCategoryImage } from "../data/coursesResolver";
import { getHeaderMenu, enrollCourse, submitCourseEnquiry } from "../api/api";
import EnrollmentEnquiryForm from "../components/course/EnrollmentEnquiryForm";
import EnrollButton from "../components/common/EnrollButton";
import { isCourseOnlineAvailable, LAUNCH_STATUS_CONFIG, FREE_COURSE_DB_MAP } from "../constants/courseAvailability";

const MainCategoryPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { requireAuth } = useAuthPrompt();

  const handleStartCourse = async (courseId, courseSlug) => {
    const matched = (courses || []).find((c) => String(c.id) === String(courseId));
    if (!isCourseOnlineAvailable(courseId, matched)) {
      navigate(`/courses/${courseSlug || courseId}#offline-enquiry-section`);
      return;
    }
    const targetDbId = FREE_COURSE_DB_MAP[courseId] || FREE_COURSE_DB_MAP[courseSlug] || Number(courseId) || 322;
    const dest = `/learning/${targetDbId}`;

    if (!requireAuth({
      courseId: targetDbId,
      slug: courseSlug || courseId,
      title: matched?.title || matched?.name || `Course #${courseId}`,
      destination: dest,
    })) {
      return;
    }

    try {
      if (targetDbId > 0) {
        enrollCourse(targetDbId).catch(() => {});
      }
    } catch (e) {}

    navigate(dest);
  };
  const location = useLocation();
  const { slug: paramSlug } = useParams();

  // Robust slug extraction & comprehensive alias mapping
  const pathSegments = location.pathname.split("/").filter(Boolean);
  let rawSlug = paramSlug;
  if (!rawSlug) {
    const catIdx = pathSegments.indexOf("category");
    if (catIdx !== -1 && pathSegments[catIdx + 1]) {
      rawSlug = pathSegments[catIdx + 1];
    } else {
      rawSlug = pathSegments[pathSegments.length - 1] || "courses";
    }
  }

  const SLUG_ALIASES = {
    "lead-auditor": "lead-auditor",
    "lead-auditors": "lead-auditor",
    "lead-auditor-training": "lead-auditor",
    "internal-auditor": "internal-auditor",
    "internal-auditors": "internal-auditor",
    "internal-auditor-training": "internal-auditor",
    "health-safety-hse": "health-safety-hse",
    "health-safety": "health-safety-hse",
    "health-and-safety": "health-safety-hse",
    "h-and-s": "health-safety-hse",
    "hse": "health-safety-hse",
    "health-safety-environment": "health-safety-hse",
    "professional-certifications": "professional-certifications",
    "professional-cert": "professional-certifications",
    "professional-certs": "professional-certifications",
    "professional-certification": "professional-certifications",
    "lean-six-sigma": "lean-six-sigma",
    "lean-six-sigma-certification": "lean-six-sigma",
    "aerospace": "aerospace",
    "aerospace-defence": "aerospace",
    "aerospace-industrial": "aerospace",
    "management-certifications": "management-certifications",
    "information-security": "information-security",
    "information-security-business-continuity": "information-security",
    "environment": "environment",
    "food-safety": "food-safety",
  };

  const activeSlug = SLUG_ALIASES[rawSlug?.toLowerCase()] || rawSlug || "lead-auditor";

  // Redirect to dedicated FreeCoursesPage if navigating to free-courses
  if (activeSlug === "free-courses") {
    return <Navigate to="/free-courses" replace />;
  }

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedTrack, setSelectedTrack] = useState("All Tracks");
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState(null);
  const [heroEmail, setHeroEmail] = useState("");
  const [heroConsent, setHeroConsent] = useState(true);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  const formatCategoryHeading = (title) => {
    if (!title) return "Professional Certification Programs";
    let clean = title.trim();
    if (clean === "Health&Safety(HSE)" || clean === "Health&Safety") {
      clean = "Health & Safety (HSE)";
    }
    if (/programs?$/i.test(clean)) return clean;
    if (/certifications?$/i.test(clean)) return `${clean} & Programs`;
    return `${clean} Programs`;
  };

  const handleHeroSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!heroEmail || !heroEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!heroConsent) {
      toast.error("Please confirm your consent to receive updates.");
      return;
    }
    try {
      setHeroSubmitting(true);
      await submitCourseEnquiry({
        candidate_name: "Pre-Enquiry Subscriber",
        candidate_email: heroEmail,
        course_title: `${categoryData?.title || "Professional"} Certification Programs`,
        enquiry_type: "launch_pre_enquiry",
        comments: "Subscriber requested Phase 1 launch updates and offline batch schedules.",
      }).catch(() => {});
      setHeroSubmitted(true);
      toast.success("Thank you! We will notify you when enrollment opens.");
    } catch (err) {
      setHeroSubmitted(true);
      toast.success("Thank you! We will notify you when enrollment opens.");
    } finally {
      setHeroSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategory = async () => {
      try {
        setLoading(true);

        // 1. Check local rich static navigation category first
        let staticCat = navigationCategories.find(
          (c) =>
            c.slug === activeSlug ||
            c.id === activeSlug ||
            c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === activeSlug
        );

        // 2. Synthesize rich curriculum for specialized standalone categories if not directly in navigationCategories top-level
        if (!staticCat) {
          if (activeSlug === "lean-six-sigma") {
            staticCat = {
              id: "lean-six-sigma",
              slug: "lean-six-sigma",
              title: "Lean Six Sigma",
              badge: "Continuous Improvement & DMAIC",
              description: "Master DMAIC methodologies, process variance reduction, Kaizen, statistical quality control, and operational excellence from Yellow Belt to Master Black Belt.",
              courses: [
                { id: "lss-1", code: "LSS-YB", title: "Lean Six Sigma Yellow Belt Certification", category: "Continuous Improvement", duration: "16 Hours", level: "Beginner", tag: "DMAIC Foundation", description: "Foundational concepts of Lean Six Sigma, DMAIC process stages, and basic continuous improvement toolkits." },
                { id: "lss-2", code: "LSS-GB", title: "Lean Six Sigma Green Belt Certification", category: "Operational Excellence", duration: "36 Hours", level: "Intermediate", tag: "Project Leader", description: "Lead departmental improvement projects, conduct hypothesis testing, measurement systems analysis (MSA), and process capability (Cp/Cpk)." },
                { id: "lss-3", code: "LSS-BB", title: "Lean Six Sigma Black Belt Certification", category: "Enterprise Quality", duration: "60 Hours", level: "Advanced", tag: "Strategic Lead", description: "Master advanced statistics, Design of Experiments (DOE), regression models, cross-functional project management, and organizational transformation." },
                { id: "lss-4", code: "5S-WM", title: "5S Workplace Management & Visual Factory", category: "Lean Manufacturing", duration: "20 Hours", level: "Intermediate", tag: "Shopfloor Excellence", description: "Implement Seiri, Seiton, Seiso, Seiketsu, and Shitsuke to eliminate waste, improve safety, and optimize workflow." },
                { id: "lss-5", code: "RCA-7QC", title: "Root Cause Analysis & 7 QC Tools Mastery", category: "Problem Solving", duration: "24 Hours", level: "Intermediate", tag: "Problem Solving", description: "Pareto charts, Ishikawa fishbone diagrams, scatter plots, control charts, and 5-Why analysis for definitive defect eradication." },
                { id: "lss-6", code: "KAIZEN-P", title: "Kaizen Facilitator & Continuous Flow Practitioner", category: "Lean Tools", duration: "20 Hours", level: "Intermediate", tag: "Kaizen Events", description: "Facilitate rapid improvement Kaizen events, value stream mapping (VSM), line balancing, and SMED changeover reduction." },
              ],
            };
          } else if (activeSlug === "aerospace") {
            staticCat = {
              id: "aerospace",
              slug: "aerospace",
              title: "Aerospace & Defence Certifications",
              badge: "AS9100 Rev D Aligned",
              description: "Rigorous aerospace quality management, aviation supply chain auditing, and technical defence manufacturing standards.",
              courses: [
                { id: "aero-1", code: "AS9100-D", title: "AS9100 Rev D Aerospace & Defense Lead Auditor", category: "Aerospace Quality", duration: "40 Hours", level: "Master", tag: "AS9100 Rev D", description: "Comprehensive aviation, space, and defense quality management auditing covering risk management, counterfeit parts prevention, and configuration management." },
                { id: "aero-2", code: "AS9110", title: "AS9110 Maintenance, Repair & Overhaul (MRO) Auditor", category: "Aviation Maintenance", duration: "36 Hours", level: "Advanced", tag: "Aviation MRO", description: "Auditing aircraft maintenance operations, airworthiness directives, technician certifications, and FAA/EASA regulatory compliance." },
                { id: "aero-3", code: "AS9120", title: "AS9120 Aerospace Stockist & Distributor Quality Auditor", category: "Aerospace Logistics", duration: "32 Hours", level: "Intermediate", tag: "Distributor Quality", description: "Traceability, shelf-life controls, certified test reports, and flow-down compliance for aviation hardware and components." },
                { id: "aero-4", code: "AERO-FMEA", title: "Aerospace Design & Process FMEA (AS13004 Aligned)", category: "Risk Engineering", duration: "24 Hours", level: "Advanced", tag: "AS13004", description: "Aviation-grade failure mode and effects analysis adhering to SAE AS13004 and customer-specific defect prevention standards." },
              ],
            };
          } else if (activeSlug === "management-certifications") {
            staticCat = {
              id: "management-certifications",
              slug: "management-certifications",
              title: "Management Certifications",
              badge: "Global ISO Standards",
              description: "International standard accreditations spanning ISO 9001 (Quality), ISO 14001 (Environment), ISO 45001 (Safety), ISO 27001 (Information Security), and ISO 50001 (Energy).",
              courses: [
                { id: "mgmt-1", code: "ISO 9001 LA", title: "ISO 9001:2015 Quality Management System Lead Auditor", category: "Quality Management", duration: "40 Hours", level: "Master", tag: "CQI-IRCA", description: "Third-party audit methodology, audit team leadership, non-conformance reporting, and certification audits." },
                { id: "mgmt-2", code: "ISO 14001 LA", title: "ISO 14001:2015 Environmental Management System Lead Auditor", category: "Environmental", duration: "40 Hours", level: "Master", tag: "Exemplar Global", description: "Environmental aspects, compliance obligations, life-cycle perspective, and sustainability auditing." },
                { id: "mgmt-3", code: "ISO 45001 LA", title: "ISO 45001:2018 Occupational Health & Safety Lead Auditor", category: "Health & Safety", duration: "40 Hours", level: "Master", tag: "CQI-IRCA", description: "Hazard identification, occupational risk mitigation, legal compliance, and worker consultation auditing." },
                { id: "mgmt-4", code: "ISO 27001 LA", title: "ISO/IEC 27001:2022 Information Security Management Lead Auditor", category: "Cybersecurity", duration: "40 Hours", level: "Master", tag: "ISMS Aligned", description: "Audit corporate information security management systems, Annex A controls, and cyber resilience." },
                { id: "mgmt-5", code: "ISO 50001 LA", title: "ISO 50001:2018 Energy Management System Lead Auditor", category: "Energy Management", duration: "40 Hours", level: "Master", tag: "EnMS Track", description: "Energy performance indicators (EnPIs), carbon footprint accounting, energy baselines, and industrial audits." },
              ],
            };
          } else if (activeSlug === "information-security") {
            staticCat = {
              id: "information-security",
              slug: "information-security",
              title: "Information Security & Business Continuity",
              badge: "ISO/IEC 27001 & ISO 22301",
              description: "Cyber governance, enterprise threat modeling, ISO/IEC 27001:2022 ISMS implementation, and ISO 22301 business resilience certifications.",
              courses: [
                { id: "is-1", code: "ISO 27001 LA", title: "ISO/IEC 27001:2022 ISMS Lead Auditor", category: "Cybersecurity", duration: "40 Hours", level: "Master", tag: "ISMS 2022", description: "Lead authoritative audits of organizational cybersecurity posture, cloud security, and Annex A control sets." },
                { id: "is-2", code: "ISO 27001 IA", title: "ISO/IEC 27001:2022 ISMS Internal Auditor", category: "Cybersecurity", duration: "28 Hours", level: "Intermediate", tag: "Auditor Track", description: "Execute internal information security audits, evaluate access permissions, encryption standards, and incident response readiness." },
                { id: "is-3", code: "ISO 22301 LA", title: "ISO 22301:2019 Business Continuity Management Lead Auditor", category: "Resilience", duration: "40 Hours", level: "Master", tag: "Resilience", description: "Evaluate disaster recovery plans, business impact analyses (BIA), supply chain continuity, and crisis management frameworks." },
                { id: "is-4", code: "CYBER-LEAD", title: "Cyber Risk Management & SOC Governance Lead", category: "Threat Defense", duration: "36 Hours", level: "Advanced", tag: "SOC Defense", description: "Threat intelligence, SIEM architecture, penetration test remediation, and corporate cyber risk registers." },
              ],
            };
          } else if (activeSlug === "environment") {
            staticCat = {
              id: "environment",
              slug: "environment",
              title: "Environmental & Sustainability Management",
              badge: "ISO 14001 & ESG Compliance",
              description: "Comprehensive certifications across environmental management systems, carbon accounting, circular economy, and ESG disclosure frameworks.",
              courses: [
                { id: "env-1", code: "ISO 14001 LA", title: "ISO 14001:2015 Environmental Management Lead Auditor", category: "Environmental", duration: "40 Hours", level: "Master", tag: "Exemplar Global", description: "Third-party auditing of environmental aspects, legal compliance, waste containment, and pollution abatement." },
                { id: "env-2", code: "ISO 14001 IA", title: "ISO 14001:2015 Environmental Management Internal Auditor", category: "Environmental", duration: "24 Hours", level: "Intermediate", tag: "Auditor Track", description: "Internal auditing of corporate environmental procedures, chemical storage, effluent treatment, and resource conservation." },
                { id: "env-3", code: "ESG-COMP", title: "ESG Compliance & Corporate BRSR Sustainability Specialist", category: "Sustainability", duration: "32 Hours", level: "Advanced", tag: "BRSR / ESG", description: "Scope 1, 2, and 3 carbon accounting, BRSR disclosures, GRI reporting, and corporate sustainability leadership." },
                { id: "env-4", code: "CEM", title: "Certified Environmental Manager", category: "Environmental", duration: "40 Hours", level: "Executive", tag: "Executive", description: "Corporate environmental compliance, hazardous waste handling, air and water pollution abatement, and environmental clearances." },
              ],
            };
          } else if (activeSlug === "food-safety") {
            staticCat = {
              id: "food-safety",
              slug: "food-safety",
              title: "Food Safety & HACCP Management",
              badge: "ISO 22000 & Codex Alimentarius",
              description: "Accredited food safety credentials covering prerequisite programs, HACCP hazard analysis, allergen controls, and global supply chain integrity.",
              courses: [
                { id: "fs-1", code: "ISO 22000 LA", title: "ISO 22000:2018 Food Safety Management System Lead Auditor", category: "Food Safety", duration: "40 Hours", level: "Master", tag: "FSMS Master", description: "Authoritative third-party auditing across the farm-to-fork food chain, prerequisite programs (PRPs), and critical control points." },
                { id: "fs-2", code: "ISO 22000 IA", title: "ISO 22000:2018 Food Safety Management System Internal Auditor", category: "Food Safety", duration: "24 Hours", level: "Intermediate", tag: "FSMS Auditor", description: "Plan and execute internal food safety audits, verify traceability protocols, and inspect hygiene and cold-chain integrity." },
                { id: "fs-3", code: "HACCP LA", title: "HACCP (Hazard Analysis Critical Control Points) Lead Auditor", category: "Food Safety", duration: "40 Hours", level: "Master", tag: "Codex Aligned", description: "Authoritative audits of food hazard analysis, CCP limits, continuous monitoring systems, corrective actions, and validation." },
                { id: "fs-4", code: "HACCP IA", title: "HACCP Principles & Prerequisite Program Internal Auditor", category: "Food Safety", duration: "24 Hours", level: "Intermediate", tag: "Codex Aligned", description: "Internal inspection of sanitation standard operating procedures (SSOP), pest control, personal hygiene, and supplier auditing." },
              ],
            };
          }
        }

        // 3. Attempt backend menu data only if not resolved locally
        let apiCat = null;
        if (!staticCat) {
          try {
            const res = await getHeaderMenu();
            if (res?.data?.success && Array.isArray(res.data.data)) {
              apiCat = res.data.data.find(
                (item) =>
                  item.slug === activeSlug ||
                  item.id === activeSlug ||
                  (item.title && item.title.toLowerCase().includes(activeSlug.replace("-", " ")))
              );
            }
          } catch (apiErr) {
            // Backend offline or endpoint unavailable
          }
        }

        if (isMounted) {
          if (staticCat) {
            setCategoryData({
              id: staticCat.id,
              slug: staticCat.slug,
              title: staticCat.title,
              badge: staticCat.badge || "Accredited Certification",
              description: staticCat.description,
              courses: staticCat.courses.map((c) => ({
                id: c.id,
                code: c.code,
                title: c.title,
                name: c.title,
                category: c.category || staticCat.title,
                duration: c.duration || "32 Hours",
                level: c.level || "Intermediate",
                tag: c.tag || "Accredited",
                rating: 4.9,
                reviews: 180,
                students: "2,450+",
                description: c.description,
                image: getCategoryImage(c.category || staticCat.title, c.title),
                slug: c.id,
              })),
            });
          } else if (apiCat) {
            setCategoryData({
              id: apiCat.id,
              slug: apiCat.slug || activeSlug,
              title: apiCat.title || apiCat.name,
              badge: apiCat.badge || "Global Standard",
              description: apiCat.description || `Explore our comprehensive certification programs in ${apiCat.title || apiCat.name}.`,
              courses: (apiCat.courses || apiCat.items || []).map((c, idx) => ({
                id: c.id || `${activeSlug}-${idx + 1}`,
                code: c.code || "CERT",
                title: c.title || c.name,
                name: c.title || c.name,
                category: c.category || apiCat.title,
                duration: c.duration || "30 Hours",
                level: c.level || "Intermediate",
                tag: c.tag || "Certified",
                rating: 4.9,
                reviews: 140,
                students: "1,800+",
                description: c.description || "Structured compliance curriculum and verified credential.",
                image: getCategoryImage(apiCat.title, c.title || c.name),
                slug: c.id || `${activeSlug}-${idx + 1}`,
              })),
            });
          } else {
            // General Fallback for custom or direct slugs
            const formattedTitle = activeSlug
              .replace(/[-_]+/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            setCategoryData({
              id: activeSlug,
              slug: activeSlug,
              title: formattedTitle,
              badge: "Accredited Programs",
              description: `Master international standards and operational excellence frameworks with certified training in ${formattedTitle}.`,
              courses: [],
            });
          }
        }
      } catch (err) {
        console.error("Category load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategory();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [activeSlug]);

  // Extract distinct tracks / subcategories
  const tracks = useMemo(() => {
    if (!categoryData?.courses) return ["All Tracks"];
    const set = new Set();
    categoryData.courses.forEach((c) => {
      if (c.category && c.category !== categoryData.title) set.add(c.category);
    });
    if (set.size <= 1) return [];
    return ["All Tracks", ...Array.from(set)];
  }, [categoryData]);

  // Extract distinct levels
  const levels = useMemo(() => {
    if (!categoryData?.courses) return ["All"];
    const set = new Set();
    categoryData.courses.forEach((c) => {
      if (c.level) set.add(c.level);
    });
    return ["All", ...Array.from(set)];
  }, [categoryData]);

  // Filter courses by search and level
  const filteredCourses = useMemo(() => {
    if (!categoryData?.courses) return [];
    return categoryData.courses.filter((course) => {
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
      const matchesTrack = selectedTrack === "All Tracks" || course.category === selectedTrack;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q);
      return matchesLevel && matchesTrack && matchesSearch;
    });
  }, [categoryData, searchQuery, selectedLevel, selectedTrack]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex flex-col justify-center items-center py-24">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-600 font-semibold text-sm">Loading category curriculum...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* =========================================================
          HERO BANNER — STANDARDIZED VIEWPORT-AWARE HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06182E] via-[#092244] to-[#0D2E57] text-white pt-5 pb-7 sm:py-8 lg:py-9">
        
        {/* Ambient Golden & Azure Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-gradient-to-b from-amber-400/10 via-blue-500/10 to-transparent rounded-[100%] blur-3xl opacity-50" />
          <div className="absolute top-1/4 -left-40 w-[500px] h-[300px] rounded-full border border-amber-400/15 blur-xs opacity-30 pointer-events-none" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[350px] rounded-full border border-blue-400/15 blur-xs opacity-25 pointer-events-none" />
        </div>

        <div className="relative page-container">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3 sm:mb-4">
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <FaChevronRight className="text-[9px] text-slate-500" />
            <Link to="/course" className="hover:text-amber-300 transition-colors">
              Courses
            </Link>
            <FaChevronRight className="text-[9px] text-slate-500" />
            <span className="text-amber-300 font-semibold truncate max-w-[240px]">
              {categoryData?.title || "Certifications"}
            </span>
          </nav>

          {/* Main Hero Content Grid: Left Column Info & CTA, Right Column Batch Announcement Card */}
          <div className="page-hero-layout">
            
            {/* Left Column: Heading, Status Pill, Description, CTAs, and Value Chips */}
            <div className="page-content space-y-3.5 sm:space-y-4">
              
              {/* Coming Soon Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Phase 1 — Coming soon, Enroll now • Offline Batches</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight leading-tight text-white">
                {formatCategoryHeading(categoryData?.title)}
              </h1>

              {/* Concise Description */}
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                Advance your expertise with internationally recognized certification programs. Online enrollment is launching soon. Reserve your seat for upcoming offline batches or submit your pre-enrollment enquiry today.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("offline-enquiry-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-[42px] sm:h-[46px] px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#FFC72C] to-[#E0A708] hover:from-amber-300 hover:to-amber-400 active:scale-95 text-[#08182D] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>Coming soon, Enroll now</span>
                  <FaArrowRight className="text-[10px]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("curriculum-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-[42px] sm:h-[46px] px-5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Explore Programs ({filteredCourses.length})</span>
                </button>
              </div>

              {/* Four Value Chips in a Compact Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-3 border-t border-white/10">
                {[
                  { icon: FaGraduationCap, text: "Global Recognition" },
                  { icon: FaUsers, text: "Expert Trainers" },
                  { icon: FaChartBar, text: "Industry Aligned" },
                  { icon: FaGlobe, text: "Verifiable Certs" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.07] border border-white/10 text-slate-200 min-w-0"
                  >
                    <item.icon className="text-amber-400 text-xs shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">{item.text}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: High-end Batch Announcements & Enquiry Card */}
            <div className="hero-right-card">
              <div className="bg-white/[0.08] border border-white/15 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                      <FaPaperPlane className="text-xs" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">Batch Announcements</h3>
                      <p className="text-[11px] text-slate-300">Offline & Classroom Cohorts</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]">
                    Phase 1
                  </span>
                </div>

                {/* Key metadata pills */}
                <div className="grid grid-cols-2 gap-2 mb-3.5 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/20 border border-white/10 text-slate-300">
                    <span className="text-[10px] text-slate-400 block font-medium">Delivery Mode</span>
                    <span className="font-semibold text-white">Classroom & Offline</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/20 border border-white/10 text-slate-300">
                    <span className="text-[10px] text-slate-400 block font-medium">Accreditation</span>
                    <span className="font-semibold text-amber-300">ISO / CQI Aligned</span>
                  </div>
                </div>

                <form onSubmit={handleHeroSubmit} className="space-y-2.5">
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/15 focus-within:border-amber-400/80 transition-all">
                    <FaEnvelope className="text-slate-400 text-xs shrink-0" />
                    <input
                      type="email"
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="Enter your professional email"
                      required
                      disabled={heroSubmitting || heroSubmitted}
                      className="bg-transparent text-white placeholder-slate-400 text-xs outline-none w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={heroSubmitting || heroSubmitted}
                    className="w-full py-2.5 rounded-xl bg-[#FFC72C] hover:bg-[#E0A708] active:scale-95 text-[#08182D] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 shadow-md"
                  >
                    {heroSubmitting ? (
                      <span>SENDING...</span>
                    ) : heroSubmitted ? (
                      <span className="flex items-center gap-1.5 text-emerald-950 font-bold">
                        <FaCheckCircle className="text-emerald-700" /> SUBSCRIBED
                      </span>
                    ) : (
                      <>
                        <span>RECEIVE BATCH ALERTS</span>
                        <FaArrowRight className="text-[9px]" />
                      </>
                    )}
                  </button>

                  <label className="flex items-start gap-2 text-[10px] text-slate-300 cursor-pointer select-none pt-0.5 leading-tight">
                    <input
                      type="checkbox"
                      checked={heroConsent}
                      onChange={(e) => setHeroConsent(e.target.checked)}
                      className="mt-0.5 rounded accent-[#FFC72C] cursor-pointer shrink-0"
                    />
                    <span>Notify me with verified schedule dates & cohort intake alerts.</span>
                  </label>
                </form>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          COURSES LISTING & FILTERS
      ========================================================= */}
      <section id="curriculum-section" className="page-container py-8 sm:py-12 scroll-mt-20">
        
        {/* Search & Level Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this category..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs sm:text-sm">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{filteredCourses.length}</strong> {filteredCourses.length === 1 ? "Program" : "Programs"}
            </span>

            {tracks.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Track:</span>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="max-w-[220px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none cursor-pointer focus:border-blue-500 truncate"
                >
                  {tracks.map((trk) => (
                    <option key={trk} value={trk}>
                      {trk}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {levels.length > 2 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none cursor-pointer focus:border-blue-500"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* 16:9 Thumbnail Image */}
                <Link
                  to={`/courses/${course.id}`}
                  className="relative aspect-[16/9] overflow-hidden bg-slate-100 block cursor-pointer"
                  aria-label={`View syllabus for ${course.title}`}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-[#F8D85A] text-[#08182b] font-bold text-[10.5px] shadow-xs">
                      {course.code}
                    </span>
                    {!isCourseOnlineAvailable(course.id, course) && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-[10px] shadow-xs">
                        {LAUNCH_STATUS_CONFIG.label}
                      </span>
                    )}
                    {course.tag && (
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-blue-900 font-semibold text-[10px]">
                        {course.tag}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                    <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      <FaClock className="text-amber-300 text-[10px]" />
                      {course.duration}
                    </span>
                    <span className="font-semibold bg-blue-600/90 px-2 py-0.5 rounded backdrop-blur-xs text-[10.5px]">
                      {course.level}
                    </span>
                  </div>
                </Link>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <FaStar className="text-[11px]" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({course.reviews})</span>
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/courses/${course.id}`}>
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug cursor-pointer">
                        {course.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-slate-400" />
                        <span>{course.students} enrolled</span>
                      </span>
                      <span className="text-emerald-600 font-bold">
                        Verifiable Certificate
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        to={`/courses/${course.id}`}
                        className="h-[58px] px-3 rounded-[14px] border border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-[15px] font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Syllabus</span>
                        <FaExternalLinkAlt className="text-xs text-slate-400" />
                      </Link>

                      {!isCourseOnlineAvailable(course.id, course) ? (
                        <EnrollButton
                          label="Enroll Now"
                          onClick={() => {
                            setSelectedCourseForEnquiry(course);
                            const el = document.getElementById("offline-enquiry-section");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                        />
                      ) : (
                        <EnrollButton
                          label="Enroll Now"
                          onClick={() => handleStartCourse(course.id, course.slug)}
                        />
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-xs p-6 space-y-3">
            <FaBookOpen className="text-4xl text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No programs matched your filter</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search keywords or resetting your level selection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("All");
                setSelectedTrack("All Tracks");
              }}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* =========================================================
          OFFLINE BATCH ENQUIRY SECTION (Direct Form)
      ========================================================= */}
      <section id="offline-enquiry-section" className="py-12 sm:py-16 bg-slate-50/70 border-t border-slate-200 scroll-mt-20">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/90 border border-amber-300 px-3.5 py-1 rounded-full">
              Phase 1 — Coming soon, Enroll now • Offline Batches
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] mt-3">
              Enquiry & Pre-Enrollment Form
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Interested in our {categoryData?.title || "Professional Certification"} programs? Submit your details below to reserve your seat for the upcoming offline classroom batch, request corporate group pricing, or receive launch alerts for the online portal.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <EnrollmentEnquiryForm
              course={selectedCourseForEnquiry || (categoryData?.courses && categoryData.courses[0])}
              availableCourses={categoryData?.courses || []}
              onCourseChange={(c) => setSelectedCourseForEnquiry(c)}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY BROADBEACH ACADEMY VALUE PROPS
      ========================================================= */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="page-container">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              International Accreditation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] mt-1">
              Why Learn with Broadbeach Academy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Our certification tracks adhere strictly to ISO 19011, ISO/IEC 17024, and relevant industry schemes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                <FaShieldAlt />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Verifiable Accreditation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every certificate issued features a unique alphanumeric serial number and instant QR validation on our public verification portal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                <FaClock />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Self-Paced Flexibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access HD video lectures, downloadable slides, and audit toolkits 24/7 on desktop, tablet, and mobile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                <FaGraduationCap />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Industry-Recognized Curriculum
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Developed and reviewed by certified lead auditors with real-world case studies and mock audit simulations.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          CALL TO ACTION BANNER
      ========================================================= */}
      <section className="py-10 sm:py-12 bg-gradient-to-r from-[#08182b] via-[#102B4E] to-[#1560bd] text-white">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Need Guidance on {categoryData?.title}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Speak with our academic advisors to select the right certification track for your career.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-[#F8D85A] hover:bg-[#eac745] active:scale-95 text-[#08182b] font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Speak to an Advisor
          </Link>
        </div>
      </section>

    </div>
  );
};

export default MainCategoryPage;