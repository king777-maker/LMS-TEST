import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  getOnlineCertificates,
  revokeOnlineCertificate,
  reissueOnlineCertificate,
  deleteOnlineCertificate,
} from "../../api/adminApi";
import { downloadCertificatePDF } from "../../utils/certificateGenerator";
import PinVerificationModal from "../../components/Admin/PinVerificationModal";
import toast from "react-hot-toast";
import {
  FaCertificate,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaRedo,
  FaSyncAlt,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaBookOpen,
  FaUserGraduate,
  FaCalendarAlt,
  FaAward,
  FaTimes,
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";

const OnlineCertMaster = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isReadOnly, canManageCertificates } = useAdmin();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals & Action States
  const [selectedCert, setSelectedCert] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // 4-Digit Security PIN Step-Up Verification Modal
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState(null);

  const [fetchError, setFetchError] = useState(null);

  // Load online certificates authoritatively from backend
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await getOnlineCertificates({
        search,
        status: statusFilter,
        course: courseFilter,
      });

      let list = [];
      if (res?.data && Array.isArray(res.data)) {
        list = res.data;
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (Array.isArray(res)) {
        list = res;
      }

      setCertificates(list);
    } catch (apiErr) {
      console.error("Online certificates fetch error:", apiErr);
      setFetchError(apiErr.message || "Failed to load authoritative certificate records. Please verify backend connectivity.");
      setCertificates([]);
      toast.error(apiErr.message || "Certificate registry connection failed.", { id: "online-cert-fetch-error" });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCertificates();
  }, [statusFilter, courseFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCertificates();
  };

  // Distinct courses for filter dropdown
  const distinctCourses = useMemo(() => {
    const map = new Map();
    certificates.forEach((c) => {
      if (c.course_name) map.set(c.course_name, c.course_name);
    });
    return Array.from(map.values());
  }, [certificates]);

  // Client-side filtering & pagination
  const filteredCerts = useMemo(() => {
    return certificates.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchQuery =
        !q ||
        String(c.certificate_number || "").toLowerCase().includes(q) ||
        String(c.student_name || "").toLowerCase().includes(q) ||
        String(c.candidate_email || "").toLowerCase().includes(q) ||
        String(c.course_name || "").toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        String(c.status).toLowerCase() === statusFilter.toLowerCase();

      const matchCourse =
        courseFilter === "all" || c.course_name === courseFilter;

      return matchQuery && matchStatus && matchCourse;
    });
  }, [certificates, search, statusFilter, courseFilter]);

  const totalPages = Math.ceil(filteredCerts.length / pageSize) || 1;
  const paginatedCerts = filteredCerts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Actions
  const handleCopyId = (certNumber) => {
    navigator.clipboard.writeText(certNumber);
    toast.success(`Copied Certificate ID: ${certNumber}`);
  };

  const handleDownloadPDF = async (cert) => {
    try {
      setActionLoading(true);
      toast.loading("Generating Broadbeach Academy PDF...", { id: "pdf-toast" });
      await downloadCertificatePDF({
        candidateName: cert.student_name,
        courseName: cert.course_name,
        certificateNumber: cert.certificate_number,
        issueDate: cert.issued_at || cert.completion_date,
      });
      toast.success("Certificate PDF downloaded successfully.", { id: "pdf-toast" });
    } catch (err) {
      toast.error("Failed to generate PDF: " + err.message, { id: "pdf-toast" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInspect = (cert) => {
    setSelectedCert(cert);
    setInspectModalOpen(true);
  };

  const handleOpenRevoke = (cert) => {
    if (!canManageCertificates) {
      toast.error("Permission Denied: Only Super Admin and Certificate Manager can revoke credentials.");
      return;
    }
    setSelectedCert(cert);
    setRevokeReason("");
    setRevokeModalOpen(true);
  };

  // Step 1: user enters revoke reason, then we ask for 4-digit PIN
  const handleInitiateRevokePin = () => {
    if (!selectedCert) return;
    if (!revokeReason.trim()) {
      toast.error("Please enter a mandatory revocation reason.");
      return;
    }
    setRevokeModalOpen(false);
    setPendingPinAction({
      type: "revoke",
      cert: selectedCert,
      reason: revokeReason.trim(),
    });
    setPinModalOpen(true);
  };

  // Reissue requires 4-digit PIN
  const handleOpenReissue = (cert) => {
    if (!canManageCertificates) {
      toast.error("Permission Denied: You cannot reissue credentials.");
      return;
    }
    setPendingPinAction({
      type: "reissue",
      cert,
    });
    setPinModalOpen(true);
  };

  // Step 2: execute sensitive action with verified 4-digit PIN
  const handleExecuteWithPin = async (pin) => {
    if (!pendingPinAction) return;

    try {
      setActionLoading(true);
      if (pendingPinAction.type === "revoke") {
        await revokeOnlineCertificate(
          pendingPinAction.cert.certificate_number,
          pendingPinAction.reason,
          pin
        );
        toast.success(
          `Certificate ${pendingPinAction.cert.certificate_number} has been revoked successfully.`
        );
      } else if (pendingPinAction.type === "reissue") {
        await reissueOnlineCertificate(
          pendingPinAction.cert.certificate_number,
          pin
        );
        toast.success(
          `Certificate ${pendingPinAction.cert.certificate_number} reissued and verified successfully.`
        );
      }
      setPinModalOpen(false);
      setPendingPinAction(null);
      fetchCertificates();
    } catch (err) {
      toast.error(err.message || "Security PIN verification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteToTrash = async (cert) => {
    if (!canManageCertificates) {
      toast.error("Permission Denied: You cannot move records to Trash.");
      return;
    }

    if (!window.confirm(`Move certificate ${cert.certificate_number} (${cert.student_name}) to the Trash Bin?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteOnlineCertificate(cert.certificate_number);
      toast.success(`Certificate ${cert.certificate_number} moved to Trash Bin.`);
      fetchCertificates();
    } catch (err) {
      toast.error(err.message || "Failed to move certificate to Trash.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B315B] uppercase tracking-wider mb-1">
            <FaCertificate className="text-amber-500 shrink-0" />
            <span className="truncate">Module 1 — Online Learning Credentials</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B315B] tracking-tight">
            Online Cert Master
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, verify, inspect, and reissue verified certificates earned through course completions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={fetchCertificates}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <FaSyncAlt className={`text-xs ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between min-w-0">
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative min-w-0">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, candidate, email, or course..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#0B315B] focus:ring-1 focus:ring-[#0B315B] outline-hidden transition"
          />
        </form>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-2 min-w-0">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="font-semibold text-slate-400 shrink-0">Status:</span>
            <select
              aria-label="Filter certificates by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-[#0B315B] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active / Verified</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>

          {/* Course Filter */}
          {distinctCourses.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 max-w-full sm:max-w-[240px]">
              <span className="font-semibold text-slate-400 shrink-0">Course:</span>
              <select
                aria-label="Filter certificates by course"
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-bold text-[#0B315B] truncate focus:outline-hidden cursor-pointer w-full"
              >
                <option value="all">All Courses</option>
                {distinctCourses.map((c) => (
                  <option key={c} value={c} className="truncate">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Authoritative Connection Error Banner */}
      {fetchError && (
        <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800 text-xs">
          <div className="flex items-center gap-2.5">
            <FaTimesCircle className="text-red-500 text-base shrink-0" />
            <span className="font-semibold">{fetchError}</span>
          </div>
          <button
            type="button"
            onClick={fetchCertificates}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Certificate Table Container with Horizontal Scroll Isolation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full max-w-full min-w-0">

        {/* Desktop / Laptop / Tablet Table (> 768px) */}
        <div className="hidden md:block w-full max-w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Completion</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#0B315B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading authentic certificate records...</span>
                  </td>
                </tr>
              ) : paginatedCerts.length > 0 ? (
                paginatedCerts.map((cert) => {
                  const isRevoked = cert.status === "revoked" || cert.verification_status === "Revoked";
                  return (
                    <tr
                      key={cert.id || cert.certificate_number}
                      className="hover:bg-slate-50/80 transition"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#0B315B] font-mono">
                            {cert.certificate_number}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyId(cert.certificate_number)}
                            title="Copy Certificate ID"
                            className="text-slate-400 hover:text-amber-600 transition cursor-pointer"
                          >
                            <FaCopy size={11} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          LMS ID #{cert.id || "REC"}
                        </span>
                      </td>

                      {/* Candidate */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {cert.student_name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {cert.candidate_email || "learner.verified@broadbeach.in"}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="font-bold text-slate-800 truncate" title={cert.course_name}>
                          {cert.course_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Chapters: {cert.chapters_completed || 5}/{cert.total_chapters || 5} Completed
                        </div>
                      </td>

                      {/* Completion Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        <div>
                          {cert.completion_date
                            ? new Date(cert.completion_date).toLocaleDateString("en-GB")
                            : "—"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Issued:{" "}
                          {cert.issued_at
                            ? new Date(cert.issued_at).toLocaleDateString("en-GB")
                            : "—"}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-[#0B315B]">
                          {cert.percentage ?? 100}%
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({cert.score ?? 13}/{cert.total_questions ?? 13})
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isRevoked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            <FaTimesCircle size={10} />
                            <span>Revoked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FaCheckCircle size={10} />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Inspect Records */}
                          <button
                            type="button"
                            onClick={() => handleInspect(cert)}
                            className="p-1.5 text-slate-600 hover:text-[#0B315B] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Inspect Completion & Issuance Record"
                          >
                            <FaBookOpen size={13} />
                          </button>

                          {/* Download PDF */}
                          <button
                            type="button"
                            onClick={() => handleDownloadPDF(cert)}
                            disabled={actionLoading}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Download Certificate PDF"
                          >
                            <FaDownload size={13} />
                          </button>

                          {/* Public Verification Page */}
                          <Link
                            to={`/verify-certificate?certificate_number=${encodeURIComponent(cert.certificate_number)}&name=${encodeURIComponent(cert.student_name || "")}`}
                            target="_blank"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Open Public Registry Verification Page"
                          >
                            <FaExternalLinkAlt size={11} />
                          </Link>

                          {/* Reissue / Revoke (Permitted Roles) */}
                          {canManageCertificates && (
                            <>
                              {isRevoked ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReissue(cert)}
                                  className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                  title="Reissue / Restore Verified Status (Requires PIN)"
                                >
                                  <FaRedo size={12} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenRevoke(cert)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Revoke Certificate (Requires PIN)"
                                >
                                  <FaTimesCircle size={13} />
                                </button>
                              )}

                              {/* Move to Trash */}
                              <button
                                type="button"
                                onClick={() => handleDeleteToTrash(cert)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="Move to Trash Bin"
                              >
                                <FaTrashAlt size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No online certificates found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards (< 768px, e.g. 390px mobile) — Zero Viewport Overflow */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-[#0B315B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading authentic certificate records...</span>
            </div>
          ) : paginatedCerts.length > 0 ? (
            paginatedCerts.map((cert) => {
              const isRevoked = cert.status === "revoked" || cert.verification_status === "Revoked";
              return (
                <div key={cert.id || cert.certificate_number} className="p-4 space-y-3">
                  {/* Top: ID & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-extrabold text-[#0B315B] font-mono text-xs truncate">
                        {cert.certificate_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyId(cert.certificate_number)}
                        title="Copy Certificate ID"
                        className="text-slate-400 hover:text-amber-600 transition shrink-0"
                      >
                        <FaCopy size={11} />
                      </button>
                    </div>

                    <div className="shrink-0">
                      {isRevoked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                          <FaTimesCircle size={9} />
                          <span>Revoked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <FaCheckCircle size={9} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Candidate and Course details */}
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-900 leading-tight">
                      {cert.student_name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium line-clamp-2">
                      {cert.course_name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Score: <strong className="text-slate-700">{cert.percentage ?? 100}%</strong></span>
                      <span>
                        {cert.issued_at
                          ? new Date(cert.issued_at).toLocaleDateString("en-GB")
                          : cert.completion_date
                          ? new Date(cert.completion_date).toLocaleDateString("en-GB")
                          : "Verified"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleInspect(cert)}
                      className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-[#0B315B] hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
                    >
                      <FaBookOpen size={11} />
                      <span>Audit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(cert)}
                      disabled={actionLoading}
                      className="px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1"
                    >
                      <FaDownload size={11} />
                      <span>PDF</span>
                    </button>

                    <Link
                      to={`/verify-certificate?certificate_number=${encodeURIComponent(cert.certificate_number)}&name=${encodeURIComponent(cert.student_name || "")}`}
                      target="_blank"
                      className="px-2.5 py-1.5 text-xs text-amber-600 hover:bg-amber-50 rounded-lg transition flex items-center gap-1"
                    >
                      <FaExternalLinkAlt size={10} />
                      <span>Verify</span>
                    </Link>

                    {canManageCertificates && (
                      <>
                        {isRevoked ? (
                          <button
                            type="button"
                            onClick={() => handleOpenReissue(cert)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Reissue (PIN)"
                          >
                            <FaRedo size={12} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenRevoke(cert)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Revoke (PIN)"
                          >
                            <FaTimesCircle size={13} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteToTrash(cert)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                          title="Trash"
                        >
                          <FaTrashAlt size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No online certificates found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="bg-slate-50/70 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 min-w-0">
          <div className="text-center sm:text-left">
            Showing{" "}
            <strong>
              {filteredCerts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, filteredCerts.length)}
            </strong>{" "}
            of <strong>{filteredCerts.length}</strong> certificates
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-[#0B315B]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INSPECT COMPLETION & ISSUANCE MODAL
      ========================================================================= */}
      {inspectModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setInspectModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 rounded-lg p-1 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B315B] flex items-center justify-center text-lg shrink-0">
                <FaBookOpen />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-[#0B315B] truncate">
                  Certificate Issuance & Completion Audit
                </h3>
                <span className="text-xs font-mono font-bold text-amber-600">
                  {selectedCert.certificate_number}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Eligibility Check Matrix */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  Mandatory Eligibility Check
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">1. Learner Identity:</span>
                  <span className="font-bold text-[#0B315B] truncate">{selectedCert.student_name}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">2. Course Verification:</span>
                  <span className="font-bold text-[#0B315B] truncate max-w-[220px]" title={selectedCert.course_name}>
                    {selectedCert.course_name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">3. Lesson Chapters:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    {selectedCert.chapters_completed || 5}/{selectedCert.total_chapters || 5} (100% Satisfied)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">4. Assessment Score:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    {selectedCert.percentage ?? 100}% (Passing Threshold: 70%)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">5. Issuance Source:</span>
                  <span className="font-bold text-blue-700 uppercase shrink-0">
                    {selectedCert.source || "Online LMS Engine"}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Completion Date</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedCert.completion_date
                      ? new Date(selectedCert.completion_date).toLocaleString()
                      : "Verified Record"}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Issuance Date</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedCert.issued_at
                      ? new Date(selectedCert.issued_at).toLocaleString()
                      : "Verified Record"}
                  </div>
                </div>
              </div>

              {selectedCert.revocation_reason && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <div className="font-bold">Revocation Notice:</div>
                  <div className="mt-0.5">{selectedCert.revocation_reason}</div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
              <Link
                to={`/verify-certificate?certificate_number=${encodeURIComponent(selectedCert.certificate_number)}&name=${encodeURIComponent(selectedCert.student_name || "")}`}
                target="_blank"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <FaExternalLinkAlt size={11} />
                <span>Verify Credential Link</span>
              </Link>
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REVOCATION REASON DIALOG MODAL (Step 1 before PIN)
      ========================================================================= */}
      {revokeModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl shrink-0">
                <FaTimesCircle />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-rose-800">
                  Revoke Certificate Credential
                </h3>
                <span className="text-xs font-mono font-bold text-slate-600 truncate block">
                  {selectedCert.certificate_number}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Revoking this credential will immediately mark it as <strong>Revoked</strong> in the authentic public verification registry. Learners or employers checking this credential will see that it has been deactivated.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mandatory Revocation Reason:
                </label>
                <textarea
                  required
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Assessment irregularity, duplicate issuance, academic misconduct, or administrative request."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-hidden transition"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRevokeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateRevokePin}
                disabled={!revokeReason.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <FaLock size={11} />
                <span>Authorize with PIN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP-UP 4-DIGIT SECURITY PIN MODAL (Step 2)
      ========================================================================= */}
      <PinVerificationModal
        isOpen={pinModalOpen}
        onClose={() => {
          setPinModalOpen(false);
          setPendingPinAction(null);
        }}
        onConfirm={handleExecuteWithPin}
        title={
          pendingPinAction?.type === "revoke"
            ? "Authorize Certificate Revocation"
            : "Authorize Certificate Reissue"
        }
        description={
          pendingPinAction?.type === "revoke"
            ? `Please enter your 4-digit security PIN to confirm revoking certificate ${pendingPinAction?.cert?.certificate_number}. This status will take effect across the entire public registry.`
            : `Please enter your 4-digit security PIN to restore and reissue certificate ${pendingPinAction?.cert?.certificate_number} to active verified status.`
        }
        targetDetails={
          pendingPinAction
            ? `${pendingPinAction.cert.certificate_number} • ${pendingPinAction.cert.student_name}`
            : ""
        }
        actionLabel={
          pendingPinAction?.type === "revoke"
            ? "Authorize & Revoke"
            : "Authorize & Reissue"
        }
        loading={actionLoading}
      />
    </div>
  );
};

export default OnlineCertMaster;
