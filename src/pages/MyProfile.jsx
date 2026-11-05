import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaUserGraduate,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaAward,
  FaEdit,
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaShareAlt,
  FaTicketAlt,
  FaPaperPlane,
  FaComments,
  FaQuestionCircle,
  FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getMyCourses, raiseStudentTicket, getMyTickets } from "../api/api";
import { getCourseProgress, resolveUserId } from "../utils/progressTracker";
import { getCategoryImage } from "../data/coursesResolver";
import TabButton from "../components/common/TabButton";

const MyProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, currentUser, updateProfile, loading: authLoading, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      return tabParam && ["overview", "courses", "certificates", "details", "tickets"].includes(tabParam.toLowerCase())
        ? tabParam.toLowerCase()
        : "overview";
    } catch {
      return "overview";
    }
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "courses", "certificates", "details", "tickets"].includes(tabParam.toLowerCase())) {
      setActiveTab(tabParam.toLowerCase());
    }
  }, [searchParams]);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState("");

  // Requirement 1: Name Immutable Modal State
  const [showNameImmutableModal, setShowNameImmutableModal] = useState(false);

  // Requirement 3: Support Tickets State & Modals
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "General Support",
    description: "",
    course_name: "",
    certificate_id: "",
    priority: "medium",
  });
  const [ticketErrors, setTicketErrors] = useState({});

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    highest_qualification: "",
    designation: "",
    current_organization: "",
    total_experience: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Sync edit form with current user data
  useEffect(() => {
    if (user) {
      setEditForm({
        first_name: user.first_name || (user.name ? user.name.split(" ")[0] : ""),
        last_name: user.last_name || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zip_code: user.zip_code || "",
        highest_qualification: user.highest_qualification || "",
        designation: user.designation || "",
        current_organization: user.current_organization || "",
        total_experience: user.total_experience || "",
      });
    }
  }, [user]);

  // Load user courses from API & reactive storage
  const loadUserCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      setCoursesError("");

      const response = await getMyCourses();
      const list = response?.data?.data || response?.data?.courses || response?.data || [];
      const safeArray = Array.isArray(list) ? list : [];

      setCourses(safeArray);
    } catch (err) {
      console.warn("MyCourses API load note:", err?.message);
      // Fallback: check localStorage for any enrolled courses
      try {
        const local = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
        if (Array.isArray(local) && local.length > 0) {
          setCourses(local);
        } else {
          setCourses([]);
        }
      } catch {
        setCourses([]);
      }
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    loadUserCourses();

    // Listen to real-time progress update events
    const handleProgressUpdate = () => {
      loadUserCourses();
    };

    window.addEventListener("bb_progress_updated", handleProgressUpdate);
    return () => window.removeEventListener("bb_progress_updated", handleProgressUpdate);
  }, [loadUserCourses]);

  // Enrich courses with calculated progress
  const enrichedCourses = useMemo(() => {
    const userId = resolveUserId(user?.id);
    return courses.map((course) => {
      const courseId = course.certification_id || course.course_id || course.id;
      const progress = getCourseProgress(userId, courseId);
      const category = course.category || "Professional Certification";
      const thumbnail =
        course.image ||
        course.thumbnail ||
        getCategoryImage(category, course.course_name || course.name || "");

      return {
        ...course,
        courseId,
        title: course.course_name || course.name || "Professional Certification",
        thumbnail,
        progress: progress.percentage,
        completedLessons: progress.completedCount,
        totalLessons: progress.totalCount,
        isCompleted: progress.isCompleted,
        status: progress.status,
        enrollmentDate: course.enrolled_at || course.created_at || new Date().toISOString(),
        certificateNumber:
          course.certificate_number ||
          progress.certificateRecord?.certificate_number ||
          null,
      };
    });
  }, [courses, user]);

  // Metric counts
  const stats = useMemo(() => {
    const totalEnrolled = enrichedCourses.length;
    const completed = enrichedCourses.filter((c) => c.status === "Completed" || c.isCompleted).length;
    const inProgress = enrichedCourses.filter((c) => c.status === "In Progress").length;
    const certificatesAvailable = enrichedCourses.filter(
      (c) => c.status === "Completed" || c.certificateNumber
    ).length;

    return {
      totalEnrolled,
      completed,
      inProgress,
      certificatesAvailable,
    };
  }, [enrichedCourses]);

  // Completed courses that qualify for certificate
  const certificateCourses = useMemo(() => {
    return enrichedCourses.filter(
      (c) => c.status === "Completed" || c.isCompleted || c.certificateNumber
    );
  }, [enrichedCourses]);

  // Initials Avatar
  const userInitials = useMemo(() => {
    const name = user?.name || user?.full_name || "Student User";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || "ST").toUpperCase();
  }, [user]);

  // Format creation / joined date
  const memberSince = useMemo(() => {
    const raw = user?.created_at || user?.registered_at;
    if (!raw) return "Active Student";
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return "Active Student";
      return `Member since ${d.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    } catch {
      return "Active Student";
    }
  }, [user]);

  // Load learner support tickets (Requirement 3)
  const loadMyTickets = useCallback(async () => {
    try {
      setLoadingTickets(true);
      const res = await getMyTickets({ email: user?.email });
      const list = res?.data?.data || res?.data || [];
      setTickets(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Tickets load error:", err?.message);
    } finally {
      setLoadingTickets(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      loadMyTickets();
    }
  }, [user?.email, loadMyTickets]);

  // Handle learner ticket submission
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!ticketForm.subject.trim()) {
      errors.subject = "Subject is required.";
    }
    if (!ticketForm.category) {
      errors.category = "Category is required.";
    }
    if (!ticketForm.description.trim()) {
      errors.description = "Description is required.";
    }
    setTicketErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmittingTicket(true);
      const payload = {
        subject: ticketForm.subject.trim(),
        category: ticketForm.category,
        description: ticketForm.description.trim(),
        message: ticketForm.description.trim(),
        course_name: ticketForm.course_name ? ticketForm.course_name.trim() : null,
        certificate_id: ticketForm.certificate_id ? ticketForm.certificate_id.trim() : null,
        priority: ticketForm.priority || "medium",
        requester_name: user?.name || user?.full_name || "Learner",
        requester_email: user?.email || "learner@broadbeach.in",
      };

      const res = await raiseStudentTicket(payload);
      if (res?.data?.success && res.data.data) {
        toast.success(`Support ticket #${res.data.data.id} created successfully!`);
        setIsTicketModalOpen(false);
        setTicketForm({
          subject: "",
          category: "General Support",
          description: "",
          course_name: "",
          certificate_id: "",
          priority: "medium",
        });
        await loadMyTickets();
        setActiveTab("tickets");
      } else {
        toast.error(res?.data?.message || "Failed to submit support ticket.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to submit ticket.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Validate form (registered name is immutable, phone format checked if provided)
  const validateForm = () => {
    const errors = {};
    if (editForm.phone && !/^[+0-9\s-]{6,20}$/.test(editForm.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSavingProfile(true);
      // Ensure we preserve the registered name strictly
      const payload = {
        ...editForm,
        name: user?.name || user?.full_name,
        full_name: user?.full_name || user?.name,
        email: user?.email,
      };
      const res = await updateProfile(payload);
      if (res?.success) {
        toast.success("Profile updated successfully!");
        setIsEditModalOpen(false);
        refreshUser();
      } else {
        if (res?.error === "NAME_IMMUTABLE" || res?.message?.includes("registered name cannot be changed")) {
          setShowNameImmutableModal(true);
        } else {
          toast.error(res?.message || "Failed to update profile.");
        }
      }
    } catch (err) {
      if (err?.response?.data?.error === "NAME_IMMUTABLE" || err?.response?.data?.message?.includes("registered name cannot be changed")) {
        setShowNameImmutableModal(true);
      } else {
        toast.error(err?.response?.data?.message || err?.message || "Unable to save profile.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // Unauthenticated fallback view
  if (!user && !authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl shadow-xs">
            <FaLock />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Student Authentication Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please log in with your Broadbeach Academy credentials to view your profile, manage enrolled courses, and download certificates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/courses"
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Browse Courses
            </Link>
            <button
              type="button"
              onClick={() => {
                const ev = new CustomEvent("open-auth-modal", { detail: { tab: "login" } });
                window.dispatchEvent(ev);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] py-8 sm:py-12">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            TIER 1: HERO PROFILE BANNER
        ========================================================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#07162c] via-[#0b254a] to-[#0f3468] text-white shadow-xl border border-white/10 mb-8 p-6 sm:p-8 lg:p-10">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* User Identity */}
            <div className="flex items-center gap-5 sm:gap-6 min-w-0">
              
              {/* Initials Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-[#07162c] flex items-center justify-center text-amber-300 font-extrabold text-2xl sm:text-3xl tracking-wider select-none border border-amber-400/30">
                    {userInitials}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#07162c] flex items-center justify-center text-white text-[10px]" title="Active Account">
                  <FaCheckCircle />
                </span>
              </div>

              {/* User Details */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight truncate">
                    {user?.name || user?.full_name || "Student"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <FaShieldAlt className="text-[10px]" />
                    Candidate
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300">
                  <span className="flex items-center gap-1.5 truncate">
                    <FaEnvelope className="text-amber-400/80 text-xs shrink-0" />
                    {user?.email || "student@broadbeach.in"}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1.5">
                      <FaPhone className="text-blue-400 text-xs shrink-0" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <FaCalendarAlt className="text-slate-400 text-xs shrink-0" />
                    {memberSince}
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Actions (Raise Ticket, Edit Profile, My Courses) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#07162c] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md"
              >
                <FaTicketAlt />
                <span>Raise a Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <FaEdit className="text-amber-300" />
                <span>Edit Profile</span>
              </button>

              <Link
                to="/my-courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all duration-200"
              >
                <FaBookOpen />
                <span>My Courses</span>
              </Link>
            </div>

          </div>

        </div>

        {/* =========================================================
            TIER 2: SUMMARY METRIC CARDS
        ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* 1. Enrolled Courses */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                <FaBookOpen />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{stats.totalEnrolled}</div>
            <p className="text-xs text-slate-500">Active learning paths</p>
          </div>

          {/* 2. In Progress */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                <FaClock />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{stats.inProgress}</div>
            <p className="text-xs text-slate-500">Ongoing modules</p>
          </div>

          {/* 3. Completed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                <FaCheckCircle />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{stats.completed}</div>
            <p className="text-xs text-slate-500">Finished courses</p>
          </div>

          {/* 4. Certificates */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                <FaAward />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{stats.certificatesAvailable}</div>
            <p className="text-xs text-slate-500">Eligible & earned</p>
          </div>

        </div>

        {/* =========================================================
            TIER 3: INTERACTIVE NAVIGATION TABS
        ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
          
          {/* Tab Headers */}
          <div
            role="tablist"
            aria-label="Student profile tabs"
            className="p-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto custom-dropdown-scroll"
          >
            {[
              { id: "overview", label: "Overview", icon: FaGraduationCap },
              { id: "courses", label: "My Enrolled Courses", icon: FaBookOpen, badge: stats.totalEnrolled },
              { id: "certificates", label: "Certificates & Credentials", icon: FaAward, badge: stats.certificatesAvailable },
              { id: "details", label: "Personal Details", icon: FaUserGraduate },
              { id: "tickets", label: "Support Tickets", icon: FaTicketAlt, badge: tickets.length },
            ].map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                badge={tab.badge}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap shrink-0"
              />
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8">
            
            {/* -----------------------------------------------------
                TAB 1: OVERVIEW
            ----------------------------------------------------- */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                
                {/* Recent In-Progress Course */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Continue Learning</h2>
                    <Link to="/my-courses" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      View all courses &rarr;
                    </Link>
                  </div>

                  {enrichedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {enrichedCourses.slice(0, 2).map((course) => (
                        <div
                          key={course.courseId}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full sm:w-28 h-28 object-cover rounded-lg shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0 w-full">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 mb-1">
                              {course.status}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 truncate mb-2">
                              {course.title}
                            </h3>

                            {/* Progress bar */}
                            <div className="w-full mb-3">
                              <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
                                <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                                <span className="font-bold text-slate-700">{course.progress}%</span>
                              </div>
                              <div
                                role="progressbar"
                                aria-valuenow={course.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Course progress for ${course.title}`}
                                className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
                              >
                                <div
                                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>

                            <Link
                              to={`/learning/${course.courseId}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                            >
                              <span>{course.progress === 100 ? "Review Course" : "Continue"}</span>
                              <FaArrowRight className="text-[10px]" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <FaBookOpen className="text-3xl text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700 mb-1">No Courses Enrolled Yet</p>
                      <p className="text-xs text-slate-500 mb-4">Explore our internationally recognized certification programs to begin learning.</p>
                      <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                      >
                        Explore Course Catalog
                      </Link>
                    </div>
                  )}
                </div>

                {/* Certificates Section in Overview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Latest Credentials</h2>
                    {certificateCourses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("certificates")}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View all certificates &rarr;
                      </button>
                    )}
                  </div>

                  {certificateCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificateCourses.slice(0, 2).map((cert) => (
                        <div
                          key={cert.courseId}
                          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/40 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-amber-400 text-[#07162c] flex items-center justify-center text-xl shrink-0 shadow-xs">
                              <FaAward />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Verified Certificate</span>
                              <h3 className="text-sm font-bold text-slate-900 truncate">{cert.title}</h3>
                              <p className="text-xs text-slate-500">ID: {cert.certificateNumber || `BB-${cert.courseId}-2026`}</p>
                            </div>
                          </div>

                          <Link
                            to={`/certificate/${cert.courseId}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#07162c] font-bold text-xs shadow-xs hover:shadow-md transition-all shrink-0"
                          >
                            <FaDownload className="text-[11px]" />
                            <span>Download</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-500">
                        Complete 100% of your course modules and pass the assessment to unlock your official Broadbeach Academy certificate.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* -----------------------------------------------------
                TAB 2: MY ENROLLED COURSES
            ----------------------------------------------------- */}
            {activeTab === "courses" && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Enrolled Curriculums</h2>
                    <p className="text-xs text-slate-500">Monitor your active course progress and certification milestones</p>
                  </div>
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
                  >
                    <FaBookOpen />
                    <span>Explore More Courses</span>
                  </Link>
                </div>

                {loadingCourses ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="p-4 rounded-xl border border-slate-200 bg-white animate-pulse flex gap-4">
                        <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                          <div className="h-2 bg-slate-200 rounded w-full mt-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : enrichedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {enrichedCourses.map((course) => (
                      <div
                        key={course.courseId}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full sm:w-28 h-28 object-cover rounded-lg shrink-0 border border-slate-100"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 truncate">
                              {course.category || "Certification"}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                              course.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : course.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {course.status}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 truncate mb-2">{course.title}</h3>

                          {/* Progress bar */}
                          <div className="w-full mb-3">
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>{course.completedLessons} / {course.totalLessons} lessons completed</span>
                              <span className="font-bold text-slate-700">{course.progress}%</span>
                            </div>
                            <div
                              role="progressbar"
                              aria-valuenow={course.progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Progress for ${course.title}`}
                              className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
                            >
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/learning/${course.courseId}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                            >
                              <span>{course.progress === 100 ? "Review Course" : "Continue Learning"}</span>
                              <FaArrowRight className="text-[10px]" />
                            </Link>

                            {course.status === "Completed" && (
                              <Link
                                to={`/certificate/${course.courseId}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#07162c] font-bold text-xs transition-colors"
                              >
                                <FaAward />
                                <span>Certificate</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FaBookOpen className="text-4xl text-slate-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800 mb-1">You Have Not Enrolled in Any Courses</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                      Explore our catalog of ISO, Lead Auditor, and Environmental Health & Safety courses to start your journey.
                    </p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
                    >
                      Browse Course Catalog
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* -----------------------------------------------------
                TAB 3: CERTIFICATES & CREDENTIALS
            ----------------------------------------------------- */}
            {activeTab === "certificates" && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Official Certificates & Verifications</h2>
                    <p className="text-xs text-slate-500">Download and verify your accredited completion credentials</p>
                  </div>
                  <Link
                    to="/verify-certificate"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shrink-0"
                  >
                    <FaShieldAlt className="text-amber-500" />
                    <span>Public Verification Tool</span>
                  </Link>
                </div>

                {certificateCourses.length > 0 ? (
                  <div className="space-y-4">
                    {certificateCourses.map((course) => {
                      const certNumber =
                        course.certificateNumber ||
                        `BOA${course.courseId}0${Math.floor(100 + Math.random() * 900)}`;

                      return (
                        <div
                          key={course.courseId}
                          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#07162c] flex items-center justify-center text-2xl shrink-0 shadow-sm">
                              <FaAward />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Verified
                                </span>
                                <span className="text-xs font-mono text-slate-500">ID: {certNumber}</span>
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                {course.title}
                              </h3>
                              <p className="text-xs text-slate-500">
                                Completed: {new Date(course.enrollmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <Link
                              to={`/verify-certificate?cert_no=${encodeURIComponent(certNumber)}`}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                            >
                              <FaShieldAlt className="text-amber-500 text-xs" />
                              <span>Verify Certificate</span>
                            </Link>

                            <Link
                              to={`/certificate/${course.courseId}`}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#07162c] font-bold text-xs shadow-xs hover:shadow-md transition-all"
                            >
                              <FaDownload className="text-xs" />
                              <span>Download PDF</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                      <FaAward />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">No Certificates Available Yet</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                      To qualify for your official certificate, complete all course modules and pass the final assessment. Certificates become instantly available for high-resolution PDF download once earned.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("courses")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                    >
                      <FaBookOpen />
                      <span>Go to Enrolled Courses</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* -----------------------------------------------------
                TAB 4: PERSONAL & PROFESSIONAL DETAILS
            ----------------------------------------------------- */}
            {activeTab === "details" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Profile Information</h2>
                    <p className="text-xs text-slate-500">Your registered details for certification records and verification</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <FaEdit />
                    <span>Edit Information</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Identity Box */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Contact & Account</h3>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Full Name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{user?.name || user?.full_name || "—"}</span>
                        <button
                          type="button"
                          onClick={() => setShowNameImmutableModal(true)}
                          className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-md bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition cursor-pointer font-medium"
                          title="Registered name is locked. Click for policy explanation."
                        >
                          <FaLock className="text-[9px]" />
                          <span>Locked</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Registered Email</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {user?.email || "—"}
                        <FaLock className="text-[10px] text-slate-400" title="Primary email is locked" />
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Phone Number</span>
                      <span className="font-semibold text-slate-900">{user?.phone || "—"}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Date of Birth</span>
                      <span className="font-semibold text-slate-900">{user?.date_of_birth || "—"}</span>
                    </div>
                  </div>

                  {/* Professional Background */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Professional Background</h3>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Designation</span>
                      <span className="font-semibold text-slate-900">{user?.designation || "Student / Candidate"}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Current Organization</span>
                      <span className="font-semibold text-slate-900">{user?.current_organization || "—"}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Highest Qualification</span>
                      <span className="font-semibold text-slate-900">{user?.highest_qualification || "—"}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-semibold text-slate-900">{user?.total_experience || "—"}</span>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3.5 md:col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Residential & Postal Details</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="block text-slate-500 mb-1">Address</span>
                        <span className="font-semibold text-slate-900">{user?.address || "—"}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 mb-1">City / State</span>
                        <span className="font-semibold text-slate-900">
                          {user?.city ? `${user.city}, ${user.state || ""}` : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-500 mb-1">Country / Postal Code</span>
                        <span className="font-semibold text-slate-900">
                          {user?.country ? `${user.country} ${user.zip_code ? `(${user.zip_code})` : ""}` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* -----------------------------------------------------
                TAB 5: SUPPORT TICKETS & GRIEVANCES (REQ 3)
            ----------------------------------------------------- */}
            {activeTab === "tickets" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">My Support Tickets</h2>
                    <p className="text-xs text-slate-500">Track inquiries directly dispatched to the Broadbeach Academy Ticket Master administration team</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <FaTicketAlt />
                    <span>Raise a Ticket</span>
                  </button>
                </div>

                {loadingTickets ? (
                  <div className="py-16 text-center">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl mx-auto mb-3" />
                    <p className="text-xs text-slate-500 font-medium">Loading your support tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl">
                      <FaTicketAlt />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">No Support Tickets Raised Yet</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                      Have questions about course access, certificates, exams, or need a profile correction? Submit a ticket and our administrative team will respond promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsTicketModalOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <FaTicketAlt />
                      <span>Raise Your First Ticket</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-center">
                        <span className="text-[11px] text-slate-500 block">Total Tickets</span>
                        <span className="text-base font-extrabold text-slate-900">{tickets.length}</span>
                      </div>
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center">
                        <span className="text-[11px] text-blue-600 block">New / Open</span>
                        <span className="text-base font-extrabold text-blue-700">
                          {tickets.filter((t) => t.status === "New" || t.status === "open" || t.status === "Open").length}
                        </span>
                      </div>
                      <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-center">
                        <span className="text-[11px] text-purple-600 block">In Progress</span>
                        <span className="text-base font-extrabold text-purple-700">
                          {tickets.filter((t) => t.status === "In Progress" || t.status === "in_progress").length}
                        </span>
                      </div>
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center">
                        <span className="text-[11px] text-emerald-600 block">Resolved</span>
                        <span className="text-base font-extrabold text-emerald-700">
                          {tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length}
                        </span>
                      </div>
                    </div>

                    {/* Tickets Table */}
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px]">
                            <th className="py-3 px-4">Ticket Ref</th>
                            <th className="py-3 px-4">Subject</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4">Created Date</th>
                            <th className="py-3 px-4">Last Updated</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tickets.map((t) => {
                            const getStatusBadge = (st) => {
                              switch (String(st).toLowerCase()) {
                                case "new":
                                  return "bg-blue-50 text-blue-700 border-blue-200";
                                case "open":
                                  return "bg-amber-50 text-amber-700 border-amber-200";
                                case "in progress":
                                case "in_progress":
                                  return "bg-purple-50 text-purple-700 border-purple-200";
                                case "waiting for user":
                                  return "bg-sky-50 text-sky-700 border-sky-200";
                                case "resolved":
                                  return "bg-emerald-50 text-emerald-700 border-emerald-200";
                                case "closed":
                                  return "bg-slate-100 text-slate-600 border-slate-200";
                                default:
                                  return "bg-slate-100 text-slate-700 border-slate-200";
                              }
                            };

                            const createdDate = t.created_at
                              ? new Date(t.created_at).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—";
                            const updatedDate = t.updated_at
                              ? new Date(t.updated_at).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : createdDate;

                            return (
                              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                                  #{t.id}
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate" title={t.subject}>
                                  {t.subject}
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10.5px]">
                                    {t.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${getStatusBadge(t.status)}`}>
                                    {t.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                                  {createdDate}
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                                  {updatedDate}
                                </td>
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setViewingTicket(t)}
                                    className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* =========================================================
          TIER 4: EDIT PROFILE MODAL
      ========================================================= */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeInSlideDown"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#08182b] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                  <FaEdit />
                </div>
                <div>
                  <h3 id="edit-profile-title" className="text-base font-bold text-white">Edit Profile Details</h3>
                  <p className="text-[11px] text-slate-300">Keep your personal and professional profile details up to date</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close edit profile modal"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-5 custom-dropdown-scroll">
              
              {/* Registered Name (Non-Editable / Immutable) - Requirement 1 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="edit_registered_name" className="block text-xs font-semibold text-slate-700">
                    Registered Full Name <span className="text-slate-400 font-normal">(Non-editable)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNameImmutableModal(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FaInfoCircle className="text-[10px]" />
                    <span>Why is this locked?</span>
                  </button>
                </div>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setShowNameImmutableModal(true)}
                >
                  <input
                    id="edit_registered_name"
                    type="text"
                    readOnly
                    value={user?.name || user?.full_name || "Siddarth GVH"}
                    onClick={() => setShowNameImmutableModal(true)}
                    onFocus={() => setShowNameImmutableModal(true)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs sm:text-sm cursor-pointer select-none font-semibold pr-20"
                    aria-label="Registered Name (Read Only). Click to view explanation."
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 pointer-events-none">
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-semibold uppercase tracking-wider">Locked</span>
                    <FaLock className="text-xs" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Registered name is permanently anchored to course completion records and accredited certificates.
                </p>
              </div>

              {/* Email (Read-Only) + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email <span className="text-slate-400 font-normal">(Non-editable)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="edit_email"
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs sm:text-sm cursor-not-allowed"
                    />
                    <FaLock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit_phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="edit_phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={editForm.phone}
                    onChange={(e) => {
                      setEditForm((prev) => ({ ...prev, phone: e.target.value }));
                      if (formErrors.phone) {
                        setFormErrors((prev) => ({ ...prev, phone: null }));
                      }
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-300 bg-white"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* DOB & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_dob" className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="edit_dob"
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit_qualification" className="block text-xs font-semibold text-slate-700 mb-1">
                    Highest Qualification
                  </label>
                  <input
                    id="edit_qualification"
                    type="text"
                    placeholder="e.g. Master of Science / Bachelor of Engineering"
                    value={editForm.highest_qualification}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, highest_qualification: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Professional (Org & Designation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_org" className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Organization
                  </label>
                  <input
                    id="edit_org"
                    type="text"
                    placeholder="e.g. ABC Technologies / Freelance"
                    value={editForm.current_organization}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, current_organization: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit_designation" className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Role
                  </label>
                  <input
                    id="edit_designation"
                    type="text"
                    placeholder="e.g. Quality Assurance Manager"
                    value={editForm.designation}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, designation: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="edit_address" className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  id="edit_address"
                  type="text"
                  placeholder="Apartment, suite, unit, building, floor"
                  value={editForm.address}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                />
              </div>

              {/* City, State, Country, Zip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="edit_city" className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    id="edit_city"
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit_state" className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    id="edit_state"
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit_country" className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    id="edit_country"
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit_zip" className="block text-xs font-semibold text-slate-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    id="edit_zip"
                    type="text"
                    value={editForm.zip_code}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, zip_code: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================
          REQUIREMENT 1: NAME IMMUTABLE POPUP MODAL
      ========================================================= */}
      {showNameImmutableModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="name-modal-title"
          aria-describedby="name-modal-desc"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeInSlideDown"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-[#08182b] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                  <FaLock />
                </div>
                <div>
                  <h3 id="name-modal-title" className="text-base font-extrabold text-white">
                    Name Cannot Be Changed
                  </h3>
                  <p className="text-[11px] text-amber-300 font-medium">Security &amp; Certification Integrity Notice</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNameImmutableModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close message"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p id="name-modal-desc" className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Your registered name cannot be changed through your profile. If your name needs correction, please contact Broadbeach Academy support.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] space-y-1">
                <span className="font-bold text-slate-800 block">Registered Credential Holder:</span>
                <span className="font-mono text-slate-900 font-bold text-xs">{user?.name || user?.full_name || "Siddarth GVH"}</span>
                <p className="text-slate-500 pt-1">
                  All official diplomas, ISO certificates, and global QR verifications are permanently bound to this registered legal name.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowNameImmutableModal(false);
                    setTicketForm((prev) => ({
                      ...prev,
                      category: "Profile and Name Correction",
                      subject: "Request for Registered Name Correction",
                      description: `Requesting legal name correction for registered account ${user?.email || "learner@broadbeach.in"}. Current registered name: ${user?.name || user?.full_name || "Siddarth GVH"}. Reason for correction: `,
                    }));
                    setIsTicketModalOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs transition cursor-pointer"
                >
                  <FaTicketAlt className="text-amber-600" />
                  <span>Raise Support Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameImmutableModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#08182b] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          REQUIREMENT 3: RAISE SUPPORT TICKET MODAL
      ========================================================= */}
      {isTicketModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="raise-ticket-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeInSlideDown"
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-[#08182b] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center text-lg shrink-0">
                  <FaTicketAlt />
                </div>
                <div>
                  <h3 id="raise-ticket-title" className="text-base font-extrabold text-white">
                    Raise a Support Ticket
                  </h3>
                  <p className="text-[11px] text-slate-300">Direct dispatch to Ticket Master administration</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close ticket modal"
                onClick={() => setIsTicketModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitTicket} className="flex-1 overflow-y-auto p-6 space-y-4 custom-dropdown-scroll">
              
              {/* Subject */}
              <div>
                <label htmlFor="ticket_subject" className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  id="ticket_subject"
                  type="text"
                  required
                  placeholder="Brief summary of your query or issue"
                  value={ticketForm.subject}
                  onChange={(e) => {
                    setTicketForm((prev) => ({ ...prev, subject: e.target.value }));
                    if (ticketErrors.subject) setTicketErrors((prev) => ({ ...prev, subject: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    ticketErrors.subject ? "border-rose-400 bg-rose-50/30" : "border-slate-300 bg-white"
                  }`}
                />
                {ticketErrors.subject && (
                  <p className="text-[11px] text-rose-500 mt-1">{ticketErrors.subject}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="ticket_category" className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="ticket_category"
                  required
                  value={ticketForm.category}
                  onChange={(e) => {
                    setTicketForm((prev) => ({ ...prev, category: e.target.value }));
                    if (ticketErrors.category) setTicketErrors((prev) => ({ ...prev, category: null }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                  <option value="Login & Account Issues">Login &amp; Account Issues</option>
                  <option value="Course Access">Course Access</option>
                  <option value="Assessment & Progress">Assessment &amp; Progress</option>
                  <option value="Certificate Generation">Certificate Generation</option>
                  <option value="Certificate Verification">Certificate Verification</option>
                  <option value="Profile and Name Correction">Profile and Name Correction</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              {/* Related Course (Optional) & Certificate ID (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ticket_course" className="block text-xs font-semibold text-slate-700 mb-1">
                    Related Course <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    id="ticket_course"
                    value={ticketForm.course_name}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, course_name: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- None / General Inquiry --</option>
                    {courses.map((c) => {
                      const cName = c.course_name || c.name || c.title || "Course";
                      return (
                        <option key={c.certification_id || c.id || cName} value={cName}>
                          {cName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="ticket_cert_id" className="block text-xs font-semibold text-slate-700 mb-1">
                    Certificate ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="ticket_cert_id"
                    type="text"
                    placeholder="e.g. BOA10113241"
                    value={ticketForm.certificate_id}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, certificate_id: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="ticket_description" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="ticket_description"
                  required
                  rows={4}
                  placeholder="Provide comprehensive details about your inquiry or requested profile update..."
                  value={ticketForm.description}
                  onChange={(e) => {
                    setTicketForm((prev) => ({ ...prev, description: e.target.value }));
                    if (ticketErrors.description) setTicketErrors((prev) => ({ ...prev, description: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    ticketErrors.description ? "border-rose-400 bg-rose-50/30" : "border-slate-300 bg-white"
                  }`}
                />
                {ticketErrors.description && (
                  <p className="text-[11px] text-rose-500 mt-1">{ticketErrors.description}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-[11px] text-blue-800 flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Tickets are routed directly into the Broadbeach Academy Admin Ticket Master. You will receive real-time updates and replies here on your dashboard.
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {submittingTicket ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          REQUIREMENT 3: TICKET DETAILS & REPLIES MODAL
      ========================================================= */}
      {viewingTicket && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-ticket-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeInSlideDown"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-[#08182b] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-400 text-[#07162c] font-bold">
                  #{viewingTicket.id}
                </span>
                <div>
                  <h3 id="view-ticket-title" className="text-base font-extrabold text-white truncate max-w-sm sm:max-w-md">
                    {viewingTicket.subject}
                  </h3>
                  <p className="text-[11px] text-slate-300">{viewingTicket.category} &bull; Status: {viewingTicket.status}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Conversation Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-dropdown-scroll">
              {/* Original Message */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800">You ({viewingTicket.requester_name || "Learner"})</span>
                  <span className="font-mono text-[11px]">
                    {viewingTicket.created_at ? new Date(viewingTicket.created_at).toLocaleString("en-GB") : "—"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {viewingTicket.description || viewingTicket.message}
                </p>
                {(viewingTicket.course_name || viewingTicket.certificate_id) && (
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px]">
                    {viewingTicket.course_name && (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                        Course: {viewingTicket.course_name}
                      </span>
                    )}
                    {viewingTicket.certificate_id && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-medium">
                        Cert: {viewingTicket.certificate_id}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Administrative Replies */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Administrative Responses ({viewingTicket.replies?.length || 0})
                </h4>

                {!viewingTicket.replies || viewingTicket.replies.length === 0 ? (
                  <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/60 text-xs text-blue-800">
                    Your inquiry is currently in queue with our administration support team. Official replies from ticket managers will be posted directly here.
                  </div>
                ) : (
                  viewingTicket.replies.map((r, rIdx) => (
                    <div key={r.id || rIdx} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5 ml-4">
                      <div className="flex items-center justify-between text-xs text-blue-900">
                        <span className="font-bold flex items-center gap-1.5">
                          <FaShieldAlt className="text-blue-600 text-[10px]" />
                          {r.sender_name || "Support Officer"} (Broadbeach Staff)
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {r.timestamp ? new Date(r.timestamp).toLocaleString("en-GB") : "Recently"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {r.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyProfile;
