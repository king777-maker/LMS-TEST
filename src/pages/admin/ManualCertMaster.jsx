import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  getManualCertificates,
  createManualCertificate,
  updateManualCertificate,
  revokeManualCertificate,
  deleteManualCertificate,
} from "../../api/adminApi";
import { downloadCertificatePDF } from "../../utils/certificateGenerator";
import PinVerificationModal from "../../components/Admin/PinVerificationModal";
import toast from "react-hot-toast";
import {
  FaFileSignature,
  FaPlus,
  FaSearch,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrashAlt,
  FaCopy,
  FaExternalLinkAlt,
  FaRedo,
  FaSyncAlt,
  FaClock,
  FaTimes,
  FaHistory,
  FaBuilding,
  FaPenNib,
  FaStamp,
} from "react-icons/fa";

const SIGNATORIES = [
  "Dr. K. R. Sharma, Academic Director",
  "R. Venkatesh, Head of Certification",
  "S. G. Harrison, Principal Assessor",
];

const TRAINING_TYPES = [
  "Offline Classroom Workshop",
  "Corporate In-House",
  "Executive Masterclass",
  "Legacy Conversion",
];

const POPULAR_COURSES = [
  "ISO 9001:2015 Quality Management System Lead Auditor",
  "ISO 14001:2015 Environmental Management System Lead Auditor",
  "ISO 45001:2018 Occupational Health & Safety Lead Auditor",
  "ISO 27001:2022 Information Security Management System Lead Implementer",
  "ISO 22000:2018 Food Safety Management System Lead Auditor",
  "5S & Workplace Organizational Excellence Lead Auditor",
  "Lean Six Sigma Green Belt Professional Certification",
];

const ManualCertMaster = () => {
  const { canManageCertificates } = useAdmin();
  const [searchParams] = useSearchParams();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routeNotFound, setRouteNotFound] = useState(false);

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(
    searchParams.get("action") === "create"
  );
  const [autoIdMode, setAutoIdMode] = useState(true);
  const [createForm, setCreateForm] = useState({
    student_name: "",
    candidate_email: "",
    course_name: POPULAR_COURSES[0],
    custom_course_name: "",
    certificate_number: "",
    issue_date: new Date().toISOString().split("T")[0],
    completion_date: new Date().toISOString().split("T")[0],
    issuing_organization: "Broadbeach Academy",
    authorized_signatory: SIGNATORIES[0],
    training_type: TRAINING_TYPES[0],
    notes: "",
  });

  // Correction Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [editForm, setEditForm] = useState({
    student_name: "",
    candidate_email: "",
    course_name: "",
    issue_date: "",
    completion_date: "",
    authorized_signatory: "",
    training_type: "",
    notes: "",
    correction_reason: "",
  });

  // History / Audit Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Revoke Modal
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  // 4-Digit Security PIN Step-Up Verification Modal
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState(null);

  // Fetch manual certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setRouteNotFound(false);
      const res = await getManualCertificates({
        search,
        status: statusFilter,
      });
      if (res?.data) {
        setCertificates(res.data);
      }
    } catch (err) {
      if (err.isNotFound || err.status === 404 || String(err.message).includes("not found")) {
        setRouteNotFound(true);
      }
      toast.error(err.message || "Failed to load manual certificates.", { id: "manual-cert-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [statusFilter]);

  // Client-side filtering
  const filteredCerts = useMemo(() => {
    return certificates.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchQuery =
        !q ||
        String(c.certificate_number || "").toLowerCase().includes(q) ||
        String(c.student_name || "").toLowerCase().includes(q) ||
        String(c.course_name || "").toLowerCase().includes(q) ||
        String(c.candidate_email || "").toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        String(c.status).toLowerCase() === statusFilter.toLowerCase();

      return matchQuery && matchStatus;
    });
  }, [certificates, search, statusFilter]);

  // Copy ID
  const handleCopyId = (certNumber) => {
    navigator.clipboard.writeText(certNumber);
    toast.success(`Copied Manual Certificate ID: ${certNumber}`);
  };

  // Download PDF
  const handleDownloadPDF = async (cert) => {
    try {
      setActionLoading(true);
      toast.loading("Generating Manual Certificate PDF...", { id: "pdf-toast" });
      await downloadCertificatePDF({
        candidateName: cert.student_name,
        courseName: cert.course_name,
        certificateNumber: cert.certificate_number,
        issueDate: cert.issue_date,
        authorizedSignatory: cert.authorized_signatory,
        issuingOrg: cert.issuing_organization,
      });
      toast.success("Manual Certificate PDF downloaded successfully.", { id: "pdf-toast" });
    } catch (err) {
      toast.error("Failed to generate PDF: " + err.message, { id: "pdf-toast" });
    } finally {
      setActionLoading(false);
    }
  };

  // Step 1: Validate Create Form, then prompt PIN
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!canManageCertificates) {
      toast.error("Permission Denied: Only Super Admin and Certificate Manager can issue manual certificates.");
      return;
    }

    const finalCourseName =
      createForm.course_name === "CUSTOM"
        ? createForm.custom_course_name.trim()
        : createForm.course_name;

    if (!createForm.student_name.trim()) {
      toast.error("Candidate full name is required.");
      return;
    }
    if (!finalCourseName) {
      toast.error("Course / Certification title is required.");
      return;
    }

    // Date validation
    if (new Date(createForm.completion_date) > new Date(createForm.issue_date)) {
      toast.error("Invalid dates: Completion date cannot be after the issue date.");
      return;
    }

    const payload = {
      student_name: createForm.student_name.trim(),
      candidate_email: createForm.candidate_email.trim(),
      course_name: finalCourseName,
      certificate_number: autoIdMode ? "" : createForm.certificate_number.trim(),
      issue_date: createForm.issue_date,
      completion_date: createForm.completion_date,
      issuing_organization: createForm.issuing_organization,
      authorized_signatory: createForm.authorized_signatory,
      training_type: createForm.training_type,
      notes: createForm.notes.trim(),
    };

    setPendingPinAction({ type: "create", payload });
    setPinModalOpen(true);
  };

  // Open Edit / Correction Modal
  const handleOpenEdit = (cert) => {
    if (!canManageCertificates) {
      toast.error("Permission Denied: You cannot edit issued certificates.");
      return;
    }
    setSelectedCert(cert);
    setEditForm({
      student_name: cert.student_name,
      candidate_email: cert.candidate_email || "",
      course_name: cert.course_name,
      issue_date: cert.issue_date,
      completion_date: cert.completion_date,
      authorized_signatory: cert.authorized_signatory || SIGNATORIES[0],
      training_type: cert.training_type || TRAINING_TYPES[0],
      notes: cert.notes || "",
      correction_reason: "",
    });
    setEditModalOpen(true);
  };

  // Step 1: Validate Edit Form, then prompt PIN
  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (!selectedCert) return;
    if (!editForm.correction_reason.trim()) {
      toast.error("Mandatory: Please provide a valid justification for this correction audit log.");
      return;
    }

    setPendingPinAction({
      type: "edit",
      id: selectedCert.certificate_number,
      payload: { ...editForm },
    });
    setPinModalOpen(true);
  };

  // Open History / Audit Modal
  const handleOpenHistory = (cert) => {
    setSelectedCert(cert);
    setHistoryModalOpen(true);
  };

  // Open Revoke Modal
  const handleOpenRevoke = (cert) => {
    if (!canManageCertificates) {
      toast.error("Permission Denied: You cannot revoke credentials.");
      return;
    }
    setSelectedCert(cert);
    setRevokeReason("");
    setRevokeModalOpen(true);
  };

  // Step 1: Validate Revoke Reason, then prompt PIN
  const handleConfirmRevoke = async () => {
    if (!selectedCert) return;
    if (!revokeReason.trim()) {
      toast.error("Please provide a mandatory revocation reason.");
      return;
    }

    setPendingPinAction({
      type: "revoke",
      id: selectedCert.certificate_number,
      reason: revokeReason.trim(),
    });
    setPinModalOpen(true);
  };

  // Step 2: Execute sensitive actions with verified PIN
  const handleExecuteWithPin = async (pin) => {
    if (!pendingPinAction) return;

    try {
      setActionLoading(true);
      if (pendingPinAction.type === "create") {
        await createManualCertificate(pendingPinAction.payload, pin);
        toast.success("Manual certificate issued and registered in verification database!");
        setCreateModalOpen(false);
        setCreateForm({
          student_name: "",
          candidate_email: "",
          course_name: POPULAR_COURSES[0],
          custom_course_name: "",
          certificate_number: "",
          issue_date: new Date().toISOString().split("T")[0],
          completion_date: new Date().toISOString().split("T")[0],
          issuing_organization: "Broadbeach Academy",
          authorized_signatory: SIGNATORIES[0],
          training_type: TRAINING_TYPES[0],
          notes: "",
        });
      } else if (pendingPinAction.type === "edit") {
        await updateManualCertificate(pendingPinAction.id, pendingPinAction.payload, pin);
        toast.success(`Manual certificate ${pendingPinAction.id} corrected with audit log.`);
        setEditModalOpen(false);
      } else if (pendingPinAction.type === "revoke") {
        await revokeManualCertificate(pendingPinAction.id, pendingPinAction.reason, pin);
        toast.success(`Manual certificate ${pendingPinAction.id} revoked.`);
        setRevokeModalOpen(false);
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

  // Move to Trash
  const handleDeleteToTrash = async (cert) => {
    if (!canManageCertificates) {
      toast.error("Permission Denied: You cannot move records to Trash.");
      return;
    }

    if (!window.confirm(`Move manual certificate ${cert.certificate_number} (${cert.student_name}) to the Trash Bin?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteManualCertificate(cert.certificate_number);
      toast.success(`Manual certificate ${cert.certificate_number} moved to Trash Bin.`);
      fetchCertificates();
    } catch (err) {
      toast.error(err.message || "Failed to move manual certificate to Trash.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <FaFileSignature />
            <span>Module 2 — Offline & Manual Certificate Authority</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B315B] tracking-tight">
            Manual Cert Master
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue and audit manual certificates for offline batches, corporate workshops, and legacy accreditations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageCertificates && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2.5 bg-[#F7C600] hover:bg-amber-300 text-[#0B315B] text-xs font-black rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <FaPlus />
              <span>Create Manual Certificate</span>
            </button>
          )}
          <button
            type="button"
            onClick={fetchCertificates}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh"
          >
            <FaSyncAlt className={`text-xs ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, course, or certificate ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#0B315B] focus:ring-1 focus:ring-[#0B315B] outline-hidden transition"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="font-semibold text-slate-400">Status:</span>
            <select
              aria-label="Filter manual certificates by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-[#0B315B] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Manual Credentials</option>
              <option value="active">Active / Verified</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manual Certificates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Candidate & Reference</th>
                <th className="py-3 px-4">Course / Program</th>
                <th className="py-3 px-4">Training Type</th>
                <th className="py-3 px-4">Signatory & Org</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading manual certificate records...</span>
                  </td>
                </tr>
              ) : filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => {
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
                            title="Copy ID"
                            className="text-slate-400 hover:text-amber-600 transition cursor-pointer"
                          >
                            <FaCopy size={11} />
                          </button>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-xs border border-amber-200 uppercase font-bold">
                          Manual Source
                        </span>
                      </td>

                      {/* Candidate */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {cert.student_name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          {cert.candidate_email || "Offline Registration"}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="font-bold text-slate-800 truncate" title={cert.course_name}>
                          {cert.course_name}
                        </div>
                        {cert.notes && (
                          <div className="text-[10px] text-slate-400 truncate" title={cert.notes}>
                            Note: {cert.notes}
                          </div>
                        )}
                      </td>

                      {/* Training Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {cert.training_type || "Offline Workshop"}
                        </span>
                      </td>

                      {/* Signatory & Org */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <div className="font-semibold text-slate-700 truncate" title={cert.authorized_signatory}>
                          {cert.authorized_signatory}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cert.issuing_organization || "Broadbeach Academy"}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                        <div>Issued: {cert.issue_date || "—"}</div>
                        <div className="text-[10px] text-slate-400">
                          Completed: {cert.completion_date || "—"}
                        </div>
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

                          {/* Public Verification */}
                          <Link
                            to={`/verify-certificate?certificate_number=${encodeURIComponent(cert.certificate_number)}`}
                            target="_blank"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Open Public Registry Verification Page"
                          >
                            <FaExternalLinkAlt size={11} />
                          </Link>

                          {/* Correction / Edit (Permitted) */}
                          {canManageCertificates && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(cert)}
                                className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                                title="Audited Correction of Record"
                              >
                                <FaEdit size={13} />
                              </button>

                              {/* Audit History */}
                              <button
                                type="button"
                                onClick={() => handleOpenHistory(cert)}
                                className="p-1.5 text-slate-600 hover:text-[#0B315B] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="View Correction & Issuance History"
                              >
                                <FaHistory size={12} />
                              </button>

                              {/* Revoke */}
                              {!isRevoked && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenRevoke(cert)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Revoke Certificate"
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
              ) : routeNotFound ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center">
                    <div className="max-w-md mx-auto p-6 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                        <FaClock />
                      </div>
                      <h3 className="font-extrabold text-sm text-[#0B315B] mb-1">
                        Manual Cert Master — Awaiting Server Deployment
                      </h3>
                      <p className="text-amber-800/90 leading-relaxed mb-4">
                        The backend route <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">GET /api/admin/manual-certificates</code> and the <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">manual_certificates</code> table are staged. Deploy <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">cadac_admin_sync.php</code> to activate live offline issuance.
                      </p>
                      <button
                        type="button"
                        onClick={fetchCertificates}
                        className="px-4 py-2 bg-[#0B315B] hover:bg-[#071F3B] text-white rounded-xl font-bold transition flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <FaSyncAlt className={`text-xs ${loading ? "animate-spin" : ""}`} />
                        Retry Connection
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No manual certificates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          CREATE MANUAL CERTIFICATE MODAL
      ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-300 p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 rounded-lg p-1 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
                <FaFileSignature />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0B315B]">
                  Issue Manual Certificate
                </h3>
                <p className="text-xs text-slate-500">
                  Direct issuance for offline batches, corporate workshops, and approved credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Row 1: Candidate Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.student_name}
                    onChange={(e) => setCreateForm({ ...createForm, student_name: e.target.value })}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Candidate Email / Contact Ref
                  </label>
                  <input
                    type="email"
                    value={createForm.candidate_email}
                    onChange={(e) => setCreateForm({ ...createForm, candidate_email: e.target.value })}
                    placeholder="learner@company.com (optional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                </div>
              </div>

              {/* Row 2: Course Selection */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course or Certification Title *
                </label>
                <select
                  value={createForm.course_name}
                  onChange={(e) => setCreateForm({ ...createForm, course_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#0B315B] focus:bg-white focus:border-[#0B315B] outline-hidden transition cursor-pointer"
                >
                  {POPULAR_COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="CUSTOM">+ Enter Custom Certification Title...</option>
                </select>

                {createForm.course_name === "CUSTOM" && (
                  <input
                    type="text"
                    required
                    value={createForm.custom_course_name}
                    onChange={(e) => setCreateForm({ ...createForm, custom_course_name: e.target.value })}
                    placeholder="Enter custom approved qualification title..."
                    className="w-full mt-2 px-3 py-2 bg-amber-50/50 border border-amber-300 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                )}
              </div>

              {/* Row 3: Certificate ID Option */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Certificate ID Assignment
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        checked={autoIdMode}
                        onChange={() => setAutoIdMode(true)}
                        name="idMode"
                      />
                      <span className="font-semibold text-[#0B315B]">Auto-Generate</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        checked={!autoIdMode}
                        onChange={() => setAutoIdMode(false)}
                        name="idMode"
                      />
                      <span className="font-semibold text-[#0B315B]">Controlled Manual ID</span>
                    </label>
                  </div>
                </div>

                {!autoIdMode ? (
                  <input
                    type="text"
                    required
                    value={createForm.certificate_number}
                    onChange={(e) => setCreateForm({ ...createForm, certificate_number: e.target.value.toUpperCase() })}
                    placeholder="e.g. BBA-M-2026-0045"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono font-bold text-[#0B315B] outline-hidden uppercase"
                  />
                ) : (
                  <p className="text-[11px] text-slate-500">
                    System will automatically assign the next unique identifier in sequence (e.g. <code>BBA-M-2026-0013</code>) and register it in the verification database.
                  </p>
                )}
              </div>

              {/* Row 4: Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.issue_date}
                    onChange={(e) => setCreateForm({ ...createForm, issue_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.completion_date}
                    onChange={(e) => setCreateForm({ ...createForm, completion_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                </div>
              </div>

              {/* Row 5: Organization & Signatory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={createForm.issuing_organization}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Authorized Signatory *
                  </label>
                  <select
                    value={createForm.authorized_signatory}
                    onChange={(e) => setCreateForm({ ...createForm, authorized_signatory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[#0B315B] focus:bg-white focus:border-[#0B315B] outline-hidden transition cursor-pointer"
                  >
                    {SIGNATORIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Training Type & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Training Type / Source *
                  </label>
                  <select
                    value={createForm.training_type}
                    onChange={(e) => setCreateForm({ ...createForm, training_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[#0B315B] focus:bg-white focus:border-[#0B315B] outline-hidden transition cursor-pointer"
                  >
                    {TRAINING_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Additional Reference / Batch Note
                  </label>
                  <input
                    type="text"
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                    placeholder="e.g. Batch #BBA-BLR-44, WTC Hall"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-[#0B315B] hover:bg-[#183B73] disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? "Issuing..." : "Issue & Register Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          AUDITED CORRECTION MODAL
      ========================================================================= */}
      {editModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-300 p-6 sm:p-7 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 rounded-lg p-1 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
                <FaEdit />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0B315B]">
                  Audited Certificate Correction
                </h3>
                <span className="text-xs font-mono font-bold text-amber-600">
                  {selectedCert.certificate_number}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              All modifications are recorded with timestamp and reason in the immutable audit log.
            </p>

            <form onSubmit={handleConfirmEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.student_name}
                  onChange={(e) => setEditForm({ ...editForm, student_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.course_name}
                  onChange={(e) => setEditForm({ ...editForm, course_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.issue_date}
                    onChange={(e) => setEditForm({ ...editForm, issue_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.completion_date}
                    onChange={(e) => setEditForm({ ...editForm, completion_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Correction Justification / Reason *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editForm.correction_reason}
                  onChange={(e) => setEditForm({ ...editForm, correction_reason: e.target.value })}
                  placeholder="e.g. Typographical error in candidate surname, updated to match official ID."
                  className="w-full p-2.5 bg-amber-50/40 border border-amber-300 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !editForm.correction_reason.trim()}
                  className="px-5 py-2 bg-[#0B315B] hover:bg-[#183B73] disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {actionLoading ? "Saving..." : "Save Correction Audit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          HISTORY & AUDIT MODAL
      ========================================================================= */}
      {historyModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setHistoryModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 rounded-lg p-1 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B315B] flex items-center justify-center">
                <FaHistory />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0B315B]">Certificate Audit Trail</h3>
                <span className="text-xs font-mono font-bold text-amber-600">
                  {selectedCert.certificate_number}
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto text-xs">
              {selectedCert.history && selectedCert.history.length > 0 ? (
                selectedCert.history.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{h.action}</span>
                      <span className="text-[10px] text-slate-400">
                        {h.timestamp ? new Date(h.timestamp).toLocaleString() : ""}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">{h.details || h.reason}</div>
                    <div className="text-[10px] text-[#0B315B] font-semibold mt-1">
                      By: {h.by}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  No subsequent corrections recorded. Initial issuance authentic.
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REVOCATION MODAL
      ========================================================================= */}
      {revokeModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl">
                <FaTimesCircle />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-800">
                  Revoke Manual Credential
                </h3>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {selectedCert.certificate_number}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This credential will be deactivated in the verification registry.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Revocation Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Expired accredited cohort authorization or manual cancellation."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-500 outline-hidden"
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
                onClick={handleConfirmRevoke}
                disabled={actionLoading || !revokeReason.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                {actionLoading ? "Revoking..." : "Confirm Revocation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP-UP 4-DIGIT SECURITY PIN MODAL
      ========================================================================= */}
      <PinVerificationModal
        isOpen={pinModalOpen}
        onClose={() => {
          setPinModalOpen(false);
          setPendingPinAction(null);
        }}
        onConfirm={handleExecuteWithPin}
        title={
          pendingPinAction?.type === "create"
            ? "Authorize Manual Certificate Issuance"
            : pendingPinAction?.type === "edit"
            ? "Authorize Certificate Correction"
            : "Authorize Manual Certificate Revocation"
        }
        description={
          pendingPinAction?.type === "create"
            ? `Please enter your 4-digit security PIN to authorize issuing a verified manual certificate for ${pendingPinAction?.payload?.student_name}.`
            : pendingPinAction?.type === "edit"
            ? `Please enter your 4-digit security PIN to authorize this correction on certificate ${pendingPinAction?.id}.`
            : `Please enter your 4-digit security PIN to revoke manual certificate ${pendingPinAction?.id}.`
        }
        targetDetails={
          pendingPinAction?.payload?.student_name || pendingPinAction?.id || ""
        }
        actionLabel="Authorize & Execute"
        loading={actionLoading}
      />
    </div>
  );
};

export default ManualCertMaster;
