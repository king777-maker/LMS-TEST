import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  resetAdminMfa,
  getAuditLogs,
} from "../../api/adminApi";
import PinVerificationModal from "../../components/Admin/PinVerificationModal";
import toast from "react-hot-toast";
import {
  FaUserShield,
  FaSearch,
  FaPlus,
  FaEdit,
  FaHistory,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaKey,
  FaUserCheck,
  FaUserTimes,
  FaListAlt,
  FaRedo,
  FaSyncAlt,
  FaFilter,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";

const ROLE_DEFINITIONS = [
  {
    role: "super_admin",
    label: "Super Admin",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    description:
      "Full administrative access to all 5 modules, administrator user provisioning, role assignments, and permanent record purge in Trash Bin.",
    permissions: {
      online_certs: "Full (View, Inspect, Download, Reissue, Revoke, Trash)",
      manual_certs: "Full (Create, Edit, Audited Correction, Download, Revoke, Trash)",
      tickets: "Full (View, Reply, Internal Notes, Assign, Status, Trash)",
      trash: "Full (View, Restore, Permanent Purge)",
      admin_access: "Full (Create/Edit Admins, Change Roles, View All Audit Logs)",
    },
  },
  {
    role: "cert_manager",
    label: "Certificate Manager",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    description:
      "Specialized in credential lifecycle: manages both Online and Manual Certificate Masters, downloads verification PDFs, corrects manual records, and moves records to Trash.",
    permissions: {
      online_certs: "Full (View, Inspect, Download, Reissue, Revoke, Trash)",
      manual_certs: "Full (Create, Edit, Audited Correction, Download, Revoke, Trash)",
      tickets: "Read-Only (View related certificate tickets)",
      trash: "Partial (View & Restore own deleted credentials; No Purge)",
      admin_access: "Restricted (No access to Admin Access module)",
    },
  },
  {
    role: "support_agent",
    label: "Support Agent",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    description:
      "Customer success & learner enquiry resolution: manages support tickets, communicates with learners, logs internal notes, and changes ticket lifecycles.",
    permissions: {
      online_certs: "Read-Only (Verify certificate status for tickets)",
      manual_certs: "Read-Only (Check manual issuance references)",
      tickets: "Full (View, Reply, Internal Notes, Assignment, Status)",
      trash: "Partial (View & Restore trashed tickets; No Purge)",
      admin_access: "Restricted (No access to Admin Access module)",
    },
  },
  {
    role: "read_only",
    label: "Read-Only Admin",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    description:
      "Auditor / Stakeholder role: can view all records and audit histories across modules without ability to mutate, issue, revoke, or delete any data.",
    permissions: {
      online_certs: "Read-Only (View & Inspect records; No Revoke/Reissue)",
      manual_certs: "Read-Only (View issued credentials; No Creation/Edit)",
      tickets: "Read-Only (View ticket history; No replies or notes)",
      trash: "Read-Only (View trashed items; No restore/purge)",
      admin_access: "Restricted (No access)",
    },
  },
];

const AdminAccess = () => {
  const { currentAdmin, isSuperAdmin } = useAdmin();
  const [searchParams] = useSearchParams();

  // Active view tab: 'admins', 'matrix', 'audit'
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "admins");

  // Admin users state
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [searchUser, setSearchUser] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [logCategory, setLogCategory] = useState("all");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetAdmin, setTargetAdmin] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "support_agent",
    password: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Load Admin Users
  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await getAdminUsers();
      if (res && res.success) {
        setAdmins(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load admins:", err);
      if (err.isNotFound || err.status === 404 || String(err.message).includes("not found")) {
        // Fallback to active authenticated super admin
        if (currentAdmin) {
          setAdmins([
            {
              id: currentAdmin.id || 1,
              name: currentAdmin.name || "Academic Super Admin",
              email: currentAdmin.email || "admin@broadbeachlearning.com",
              role: currentAdmin.role || "super_admin",
              status: "active",
              last_login: new Date().toISOString(),
              is_active_session: true,
            },
          ]);
        }
      }
      if (!err.isNotFound && err.status !== 404 && !String(err.message).includes("not found")) {
        toast.error(err.message || "Failed to load administrative personnel.", { id: "admin-users-fetch-error" });
      }
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Load Audit Logs
  const fetchLogs = async (category = logCategory, search = logSearch) => {
    setLoadingLogs(true);
    try {
      const params = {};
      if (category !== "all") params.category = category;
      if (search.trim()) params.search = search.trim();
      const res = await getAuditLogs(params);
      if (res && res.success) {
        setAuditLogs(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      toast.error("Failed to load audit logs.");
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (activeTab === "audit") {
      fetchLogs(logCategory, logSearch);
    }
  }, [activeTab, logCategory]);

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const q = searchUser.toLowerCase().trim();
      const matchSearch =
        !q ||
        admin.name?.toLowerCase().includes(q) ||
        admin.email?.toLowerCase().includes(q);

      const matchRole = roleFilter === "all" || admin.role === roleFilter;
      const matchStatus = statusFilter === "all" || admin.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [admins, searchUser, roleFilter, statusFilter]);

  // 4-Digit Security PIN Step-Up Verification Modal
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState(null);

  // Step 1: Handle Create Admin -> validate then prompt PIN
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setPendingPinAction({
      type: "create",
      payload: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password || "BBAdmin@2026!",
      },
    });
    setPinModalOpen(true);
  };

  // Step 1: Handle Edit Admin (Role & Status) -> validate then prompt PIN
  const handleUpdateAdmin = (e) => {
    e.preventDefault();
    if (!targetAdmin) return;

    // Prevent self-lockout
    if (targetAdmin.id === currentAdmin?.id && targetAdmin.status === "suspended") {
      toast.error("Security Protection: You cannot suspend your own account!");
      return;
    }

    setPendingPinAction({
      type: "update",
      id: targetAdmin.id,
      payload: {
        name: targetAdmin.name,
        role: targetAdmin.role,
        status: targetAdmin.status,
      },
    });
    setPinModalOpen(true);
  };

  // Step 1: Handle Reset MFA -> prompt PIN
  const handleResetMfa = (admin) => {
    setPendingPinAction({
      type: "reset_mfa",
      id: admin.id,
      name: admin.name,
    });
    setPinModalOpen(true);
  };

  // Step 2: Execute sensitive administrative action with verified PIN
  const handleExecuteWithPin = async (pin) => {
    if (!pendingPinAction) return;

    setActionLoading(true);
    try {
      if (pendingPinAction.type === "create") {
        const res = await createAdminUser(pendingPinAction.payload, pin);
        if (res && res.success) {
          toast.success(`Administrator '${pendingPinAction.payload.name}' created successfully!`);
          setCreateModalOpen(false);
          setFormData({ name: "", email: "", role: "support_agent", password: "" });
        }
      } else if (pendingPinAction.type === "update") {
        const res = await updateAdminUser(pendingPinAction.id, pendingPinAction.payload, pin);
        if (res && res.success) {
          toast.success(`Admin account '${pendingPinAction.payload.name}' updated successfully.`);
          setEditModalOpen(false);
          setTargetAdmin(null);
        }
      } else if (pendingPinAction.type === "reset_mfa") {
        const res = await resetAdminMfa(pendingPinAction.id, pin);
        if (res && res.success) {
          toast.success(`MFA credentials reset successfully for ${pendingPinAction.name}.`);
        }
      }
      setPinModalOpen(false);
      setPendingPinAction(null);
      fetchAdmins();
    } catch (err) {
      toast.error(err.message || "Security PIN verification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper badge for role
  const getRoleBadge = (role) => {
    const def = ROLE_DEFINITIONS.find((r) => r.role === role);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          def ? def.badgeClass : "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {def ? def.label : role}
      </span>
    );
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#131E4A] text-gold flex items-center justify-center font-bold text-xl shadow-sm">
              <FaUserShield />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#131E4A]">
                Admin Access &amp; Security
              </h1>
              <p className="text-sm text-slate-500">
                Manage administrative personnel, role-based access permissions, and system audit logs.
              </p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-center border border-slate-200">
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "admins"
                ? "bg-[#131E4A] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FaUserShield className="text-xs" />
            Personnel ({admins.length})
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "matrix"
                ? "bg-[#131E4A] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FaShieldAlt className="text-xs" />
            Permissions Matrix
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "audit"
                ? "bg-[#131E4A] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FaHistory className="text-xs" />
            Audit Logs
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ADMINISTRATORS TABLE
         ========================================================================= */}
      {activeTab === "admins" && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search admin by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                />
              </div>

              {/* Role filter */}
              <div className="relative sm:w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="cert_manager">Certificate Manager</option>
                  <option value="support_agent">Support Agent</option>
                  <option value="read_only">Read-Only Admin</option>
                </select>
              </div>

              {/* Status filter */}
              <div className="relative sm:w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Create Administrator Button */}
            {isSuperAdmin && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 bg-[#131E4A] hover:bg-[#183B73] text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <FaPlus className="text-xs text-gold" />
                Create Administrator
              </button>
            )}
          </div>

          {/* Admins Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loadingAdmins ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-8 h-8 border-4 border-[#131E4A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading administrative personnel...
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FaUserShield className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No administrators found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your search query or filter options.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Administrator</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Account Created</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmins.map((admin) => {
                      const isSelf = admin.email === currentAdmin?.email;
                      return (
                        <tr
                          key={admin.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelf ? "bg-amber-50/20" : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#131E4A] text-gold font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                                {admin.name
                                  ?.split(" ")
                                  .map((p) => p[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-[#131E4A] flex items-center gap-1.5">
                                  {admin.name}
                                  {isSelf && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gold text-[#131E4A] font-bold">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                  {admin.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getRoleBadge(admin.role)}
                          </td>
                          <td className="py-3 px-4">
                            {admin.status === "active" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Suspended
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {admin.created_at
                              ? new Date(admin.created_at).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Pre-configured"}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {admin.last_login
                              ? new Date(admin.last_login).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Pending first login"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit Admin Button */}
                              {isSuperAdmin && (
                                <button
                                  onClick={() => {
                                    setTargetAdmin({ ...admin });
                                    setEditModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-[#131E4A] hover:bg-slate-100 rounded-lg transition-all"
                                  title="Edit Role or Status"
                                >
                                  <FaEdit className="text-sm" />
                                </button>
                              )}

                              {/* Reset MFA Button */}
                              {isSuperAdmin && (
                                <button
                                  onClick={() => handleResetMfa(admin)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Reset MFA & Emergency Tokens (Requires PIN)"
                                >
                                  <FaKey className="text-sm" />
                                </button>
                              )}

                              {/* View Audit Activity */}
                              <button
                                onClick={() => {
                                  setLogSearch(admin.email);
                                  setActiveTab("audit");
                                }}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                title="View User Activity Logs"
                              >
                                <FaHistory className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ROLE-BASED ACCESS CONTROL (RBAC) PERMISSIONS MATRIX
         ========================================================================= */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xl flex-shrink-0">
                <FaShieldAlt />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#131E4A]">
                  Role-Based Access Control (RBAC) Architecture
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Permissions are strictly enforced on the server-side for every single API endpoint. Client interface elements mirror backend authorization policies according to least-privilege security principles.
                </p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <th className="py-3 px-4 w-1/4">Module &amp; Action Scope</th>
                    <th className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        Super Admin
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Certificate Manager
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Support Agent
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        Read-Only Admin
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Module 1: Online Cert Master */}
                  <tr className="bg-slate-50/50">
                    <td colSpan="5" className="py-2.5 px-4 font-bold text-[#131E4A] text-xs uppercase tracking-wider">
                      Module 1: Online Cert Master
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">View &amp; Inspect Online Certificates</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Generate / Download PDF &amp; QR Verification</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Revoke Credential / Reissue Certificate</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Move Online Certificate to Trash Bin</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>

                  {/* Module 2: Manual Cert Master */}
                  <tr className="bg-slate-50/50">
                    <td colSpan="5" className="py-2.5 px-4 font-bold text-[#131E4A] text-xs uppercase tracking-wider">
                      Module 2: Manual Cert Master
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">View &amp; Inspect Manual Certificates</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Create New Manual Credential (Auto/Custom ID)</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Audited Correction &amp; Revision Log</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Move Manual Certificate to Trash Bin</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>

                  {/* Module 3: Ticket Master */}
                  <tr className="bg-slate-50/50">
                    <td colSpan="5" className="py-2.5 px-4 font-bold text-[#131E4A] text-xs uppercase tracking-wider">
                      Module 3: Ticket Master
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">View Support Tickets &amp; Learner Enquiries</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Reply to Requester &amp; Log Confidential Notes</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Assign Admin, Update Status &amp; Priority</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>

                  {/* Module 4: Trash Bin */}
                  <tr className="bg-slate-50/50">
                    <td colSpan="5" className="py-2.5 px-4 font-bold text-[#131E4A] text-xs uppercase tracking-wider">
                      Module 4: Trash Bin
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">View Soft-Deleted Records</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Restore Record to Active Module</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr className="bg-rose-50/30">
                    <td className="py-2.5 px-4 font-semibold text-rose-800">
                      Permanent Purge (Irreversible Database Deletion)
                    </td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>

                  {/* Module 5: Admin Access */}
                  <tr className="bg-slate-50/50">
                    <td colSpan="5" className="py-2.5 px-4 font-bold text-[#131E4A] text-xs uppercase tracking-wider">
                      Module 5: Admin Access
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">View Personnel Directory</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Create Administrators &amp; Assign Roles</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Suspend Accounts / Update Roles</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Inspect Full System Audit Trail</td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-bold"><FaCheck className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                    <td className="py-2.5 px-4 text-center text-rose-500 font-bold"><FaTimes className="mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Profiles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_DEFINITIONS.map((r) => (
              <div
                key={r.role}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${r.badgeClass}`}
                  >
                    {r.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{r.role}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">Scope summary:</div>
                  <div className="text-slate-600">
                    <span className="font-medium text-[#131E4A]">Certs:</span> {r.permissions.online_certs}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-[#131E4A]">Tickets:</span> {r.permissions.tickets}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-[#131E4A]">Trash:</span> {r.permissions.trash}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: AUDIT LOGS
         ========================================================================= */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          {/* Audit Action Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search audit trail by actor, action, target or details..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchLogs(logCategory, logSearch)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                />
              </div>

              {/* Category Filter */}
              <div className="relative sm:w-48">
                <select
                  value={logCategory}
                  onChange={(e) => setLogCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                >
                  <option value="all">All Categories</option>
                  <option value="CERTIFICATE">Certificate Actions</option>
                  <option value="TICKET">Ticket Actions</option>
                  <option value="TRASH">Trash Bin Actions</option>
                  <option value="ADMIN_ACCESS">Admin &amp; Security</option>
                  <option value="AUTH">Authentication Events</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => fetchLogs(logCategory, logSearch)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <FaSyncAlt className={`text-xs ${loadingLogs ? "animate-spin" : ""}`} />
              Refresh Logs
            </button>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loadingLogs ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-8 h-8 border-4 border-[#131E4A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Querying immutable audit logs...
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FaHistory className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No audit events found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your search criteria or category filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-44">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {auditLogs.map((log) => {
                      const getCatBadge = (cat) => {
                        switch (cat) {
                          case "CERTIFICATE":
                            return "bg-amber-50 text-amber-800 border-amber-200";
                          case "TICKET":
                            return "bg-blue-50 text-blue-800 border-blue-200";
                          case "TRASH":
                            return "bg-rose-50 text-rose-800 border-rose-200";
                          case "ADMIN_ACCESS":
                            return "bg-purple-50 text-purple-800 border-purple-200";
                          default:
                            return "bg-slate-50 text-slate-700 border-slate-200";
                        }
                      };

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{log.actor_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{log.actor_email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getCatBadge(
                                log.action_category
                              )}`}
                            >
                              {log.action_category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-800">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono">
                            <span className="text-slate-400">{log.target_type}:</span>{" "}
                            <span className="font-semibold text-[#131E4A]">{log.target_id || "N/A"}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.details}>
                            {log.details}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE ADMINISTRATOR (SUPER ADMIN ONLY)
         ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#131E4A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FaUserShield className="text-gold" />
                <h3 className="font-bold text-base">Provision New Administrator</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4 text-sm">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-start gap-3 text-xs text-blue-900">
                <FaInfoCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Least-Privilege Principle:</strong> Administrators cannot register publicly. Only active Super Admins can issue credentials and designate authorized roles.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rachel@broadbeachlearning.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Administrative Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                >
                  <option value="support_agent">Support Agent (Tickets &amp; Learner Inquiries)</option>
                  <option value="cert_manager">Certificate Manager (Online &amp; Manual Cert Masters)</option>
                  <option value="read_only">Read-Only Admin (Inspection &amp; Verification)</option>
                  <option value="super_admin">Super Admin (All 5 Modules &amp; Deletion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.password}
                    placeholder="Defaults to: BBAdmin@2026!"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                  />
                  <FaKey className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Admin will be prompted to reset upon initial secure authentication.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#131E4A] hover:bg-[#183B73] text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Provisioning...
                    </>
                  ) : (
                    <>
                      <FaUserCheck className="text-gold" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT ADMINISTRATOR (ROLE & STATUS)
         ========================================================================= */}
      {editModalOpen && targetAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#131E4A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FaEdit className="text-gold" />
                <h3 className="font-bold text-base">Modify Admin Account</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Name
                </label>
                <input
                  type="text"
                  required
                  value={targetAdmin.name}
                  onChange={(e) => setTargetAdmin({ ...targetAdmin, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={targetAdmin.email}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designated Role
                </label>
                <select
                  value={targetAdmin.role}
                  onChange={(e) => setTargetAdmin({ ...targetAdmin, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#131E4A]/20 focus:border-[#131E4A]"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="cert_manager">Certificate Manager</option>
                  <option value="support_agent">Support Agent</option>
                  <option value="read_only">Read-Only Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Access Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetAdmin({ ...targetAdmin, status: "active" })}
                    className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      targetAdmin.status === "active"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <FaUserCheck className="text-emerald-600" />
                    Active Access
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (targetAdmin.id === currentAdmin?.id) {
                        toast.error("You cannot suspend your own admin account!");
                        return;
                      }
                      setTargetAdmin({ ...targetAdmin, status: "suspended" });
                    }}
                    className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      targetAdmin.status === "suspended"
                        ? "bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-500/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <FaUserTimes className="text-rose-600" />
                    Suspended
                  </button>
                </div>
                {targetAdmin.id === currentAdmin?.id && (
                  <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" />
                    Self-suspension is disabled to prevent lockout.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#131E4A] hover:bg-[#183B73] text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-gold" />
                      Update Account
                    </>
                  )}
                </button>
              </div>
            </form>
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
            ? "Authorize Administrator Provisioning"
            : pendingPinAction?.type === "update"
            ? "Authorize Role / Status Modification"
            : "Authorize Multi-Factor Auth Reset"
        }
        description={
          pendingPinAction?.type === "create"
            ? `Please enter your 4-digit security PIN to authorize creating a new administrative user for ${pendingPinAction?.payload?.name}.`
            : pendingPinAction?.type === "update"
            ? `Please enter your 4-digit security PIN to authorize updating access permissions for ${pendingPinAction?.payload?.name}.`
            : `Please enter your 4-digit security PIN to reset MFA credentials for ${pendingPinAction?.name}.`
        }
        targetDetails={
          pendingPinAction?.payload?.name || pendingPinAction?.name || ""
        }
        actionLabel="Authorize & Execute"
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminAccess;
