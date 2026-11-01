import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  getTickets,
  getTicket,
  replyTicket,
  addTicketInternalNote,
  updateTicket,
  deleteTicket,
  createTicket,
} from "../../api/adminApi";
import toast from "react-hot-toast";
import {
  FaTicketAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaUserCheck,
  FaReply,
  FaStickyNote,
  FaTrashAlt,
  FaRedo,
  FaSyncAlt,
  FaTimes,
  FaPaperPlane,
  FaLock,
  FaEnvelope,
  FaBuilding,
  FaBookOpen,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const CATEGORIES = [
  "Login & Account Issues",
  "Course Access",
  "Assessment & Progress",
  "Certificate Generation",
  "Certificate Verification",
  "Offline Certification Enquiries",
  "General Support",
];

const STATUSES = [
  "New",
  "Open",
  "In Progress",
  "Waiting for User",
  "Resolved",
  "Closed",
];

const PRIORITIES = ["Urgent", "High", "Medium", "Low"];

const ADMINS_LIST = [
  "admin@broadbeachlearning.com",
  "support.agent@broadbeach.in",
  "cert.manager@broadbeach.in",
  "unassigned",
];

const TicketMaster = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentAdmin, canManageTickets } = useAdmin();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeNotFound, setRouteNotFound] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status")
      ? searchParams.get("status").toLowerCase() === "open"
        ? "Open"
        : searchParams.get("status")
      : "all"
  );
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");

  // Selected Ticket & Drawer State
  const [activeTicket, setActiveTicket] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);

  // Create Ticket Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    subject: "",
    requester_name: "",
    requester_email: "",
    related_course: "",
    category: CATEGORIES[0],
    priority: "Medium",
    message: "",
  });

  // Fetch Tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setRouteNotFound(false);
      const res = await getTickets({
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        assigned_admin: adminFilter,
      });
      if (res?.data) {
        setTickets(res.data);
      }
    } catch (err) {
      if (err.isNotFound || err.status === 404 || String(err.message).includes("not found")) {
        setRouteNotFound(true);
        toast.dismiss("tickets-fetch-error");
      } else {
        toast.error(err.message || "Failed to load support tickets.", { id: "tickets-fetch-error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, categoryFilter, adminFilter]);

  // Open ticket from URL param ?ticket=TCK-2026-0101
  useEffect(() => {
    const ticketParam = searchParams.get("ticket");
    if (ticketParam && tickets.length > 0) {
      const found = tickets.find((t) => t.id === ticketParam);
      if (found) {
        setActiveTicket(found);
        setDrawerOpen(true);
      }
    }
  }, [searchParams, tickets]);

  // Client filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = search.toLowerCase().trim();
      const matchQuery =
        !q ||
        String(t.id || "").toLowerCase().includes(q) ||
        String(t.subject || "").toLowerCase().includes(q) ||
        String(t.requester_name || "").toLowerCase().includes(q) ||
        String(t.requester_email || "").toLowerCase().includes(q) ||
        String(t.related_course || "").toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        String(t.status).toLowerCase() === statusFilter.toLowerCase();

      const matchPriority =
        priorityFilter === "all" ||
        String(t.priority).toLowerCase() === priorityFilter.toLowerCase();

      const matchCategory =
        categoryFilter === "all" ||
        String(t.category).toLowerCase() === categoryFilter.toLowerCase();

      const matchAdmin =
        adminFilter === "all" ||
        String(t.assigned_admin).toLowerCase() === adminFilter.toLowerCase();

      return matchQuery && matchStatus && matchPriority && matchCategory && matchAdmin;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter, adminFilter]);

  // Select Ticket for Details View
  const handleOpenTicket = (ticket) => {
    setActiveTicket(ticket);
    setDrawerOpen(true);
    setSearchParams({ ticket: ticket.id });
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setActiveTicket(null);
    setSearchParams({});
  };

  // Submit Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      setSubmittingReply(true);
      const res = await replyTicket(activeTicket.id, {
        message: replyText.trim(),
        status: "Waiting for User",
      });
      toast.success("Reply dispatched to requester.");
      setReplyText("");
      if (res?.data) {
        setActiveTicket(res.data);
      }
      fetchTickets();
    } catch (err) {
      toast.error(err.message || "Failed to send reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Submit Internal Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !activeTicket) return;

    try {
      setSubmittingNote(true);
      const res = await addTicketInternalNote(activeTicket.id, noteText.trim());
      toast.success("Confidential internal note saved.");
      setNoteText("");
      if (res?.data) {
        setActiveTicket(res.data);
      }
      fetchTickets();
    } catch (err) {
      toast.error(err.message || "Failed to save internal note.");
    } finally {
      setSubmittingNote(false);
    }
  };

  // Update Status / Priority / Assignee
  const handleUpdateField = async (field, value) => {
    if (!activeTicket) return;
    try {
      const payload = { [field]: value };
      const res = await updateTicket(activeTicket.id, payload);
      toast.success(`Ticket ${field.replace("_", " ")} updated to: ${value}`);
      if (res?.data) {
        setActiveTicket(res.data);
      }
      fetchTickets();
    } catch (err) {
      toast.error(err.message || `Failed to update ${field}.`);
    }
  };

  // Move Ticket to Trash
  const handleDeleteTicket = async (ticket) => {
    if (!canManageTickets) {
      toast.error("Permission Denied: You cannot move tickets to Trash.");
      return;
    }

    if (!window.confirm(`Move ticket ${ticket.id} (${ticket.subject}) to the Trash Bin?`)) {
      return;
    }

    try {
      await deleteTicket(ticket.id);
      toast.success(`Ticket ${ticket.id} moved to Trash Bin.`);
      if (activeTicket?.id === ticket.id) {
        handleCloseDrawer();
      }
      fetchTickets();
    } catch (err) {
      toast.error(err.message || "Failed to move ticket to Trash.");
    }
  };

  // Create Ticket
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.subject || !createForm.requester_name || !createForm.requester_email || !createForm.message) {
      toast.error("Please fill in all required ticket details.");
      return;
    }

    try {
      await createTicket(createForm);
      toast.success("Support ticket created successfully.");
      setCreateModalOpen(false);
      setCreateForm({
        subject: "",
        requester_name: "",
        requester_email: "",
        related_course: "",
        category: CATEGORIES[0],
        priority: "Medium",
        message: "",
      });
      fetchTickets();
    } catch (err) {
      toast.error(err.message || "Failed to create ticket.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Open":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Waiting for User":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Closed":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 font-black";
      case "High":
        return "bg-rose-50 text-rose-700 font-bold";
      case "Medium":
        return "bg-amber-50 text-amber-700 font-semibold";
      case "Low":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <FaTicketAlt />
            <span>Module 3 — Centralized Helpdesk & Inquiries</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B315B] tracking-tight">
            Ticket Master
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage learner issues, certificate generation requests, and offline-certification enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageTickets && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2.5 bg-[#0B315B] hover:bg-[#183B73] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <FaPlus size={11} />
              <span>New Ticket</span>
            </button>
          )}
          <button
            type="button"
            onClick={fetchTickets}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh"
          >
            <FaSyncAlt className={`text-xs ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket ID, requester, course, or subject..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#0B315B] focus:ring-1 focus:ring-[#0B315B] outline-hidden transition"
            />
          </div>

          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="font-semibold text-slate-400">Status:</span>
              <select
                aria-label="Filter tickets by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-[#0B315B] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="font-semibold text-slate-400">Priority:</span>
              <select
                aria-label="Filter tickets by priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent font-bold text-[#0B315B] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 max-w-[200px]">
              <span className="font-semibold text-slate-400 shrink-0">Category:</span>
              <select
                aria-label="Filter tickets by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent font-bold text-[#0B315B] truncate focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Admin</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading centralized tickets...</span>
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => handleOpenTicket(ticket)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-[#0B315B] font-mono group-hover:text-amber-600 transition">
                        {ticket.id}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {ticket.created_at
                          ? new Date(ticket.created_at).toLocaleDateString("en-GB")
                          : "—"}
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="font-bold text-slate-900 truncate" title={ticket.subject}>
                        {ticket.subject}
                      </div>
                      {ticket.related_course && (
                        <div className="text-[10px] text-slate-400 truncate" title={ticket.related_course}>
                          Course: {ticket.related_course}
                        </div>
                      )}
                    </td>

                    {/* Requester */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {ticket.requester_name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {ticket.requester_email}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {ticket.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Assigned Admin */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {ticket.assigned_admin === "unassigned" ? (
                        <span className="text-amber-600 italic">Unassigned</span>
                      ) : (
                        <span className="font-semibold text-slate-700 truncate max-w-[120px] block">
                          {ticket.assigned_admin}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenTicket(ticket)}
                          className="px-2.5 py-1 bg-blue-50 text-[#0B315B] hover:bg-blue-100 font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          View / Reply
                        </button>

                        {canManageTickets && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(ticket)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Move to Trash Bin"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : routeNotFound ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center">
                    <div className="max-w-md mx-auto p-6 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                        <FaClock />
                      </div>
                      <h3 className="font-extrabold text-sm text-[#0B315B] mb-1">
                        Support Ticket Master — Awaiting Server Deployment
                      </h3>
                      <p className="text-amber-800/90 leading-relaxed mb-4">
                        The backend route <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">GET /api/admin/tickets</code> and the <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">support_tickets</code> table are staged. Deploy <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">cadac_admin_sync.php</code> to activate real-time learner ticket processing.
                      </p>
                      <button
                        type="button"
                        onClick={fetchTickets}
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
                    No tickets found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          TICKET DETAIL & CONVERSATION DRAWER / MODAL
      ========================================================================= */}
      {drawerOpen && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono font-black text-base text-[#0B315B]">
                    {activeTicket.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(activeTicket.status)}`}>
                    {activeTicket.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getPriorityBadge(activeTicket.priority)}`}>
                    {activeTicket.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {activeTicket.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {activeTicket.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer shrink-0"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Content Body: Scrollable */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs pr-1">
              {/* Requester Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Requester</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">{activeTicket.requester_name}</div>
                  <div className="text-slate-500">{activeTicket.requester_email}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Related Course</div>
                  <div className="font-bold text-[#0B315B] mt-0.5 truncate" title={activeTicket.related_course}>
                    {activeTicket.related_course || "General Platform Inquiry"}
                  </div>
                  {activeTicket.enquiry_ref && (
                    <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                      Ref: {activeTicket.enquiry_ref}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Assignment</div>
                  <div className="font-bold text-slate-800 mt-0.5 truncate">
                    {activeTicket.assigned_admin}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Created: {activeTicket.created_at ? new Date(activeTicket.created_at).toLocaleString() : ""}
                  </div>
                </div>
              </div>

              {/* Status & Assignment Quick Toggles */}
              {canManageTickets && (
                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#0B315B]">Quick Status:</span>
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateField("status", st)}
                        className={`px-2 py-0.8 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          activeTicket.status === st
                            ? "bg-[#0B315B] text-white border-[#0B315B]"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0B315B]">Assign:</span>
                    <select
                      aria-label="Assign ticket to admin"
                      value={activeTicket.assigned_admin}
                      onChange={(e) => handleUpdateField("assigned_admin", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-[11px] font-semibold cursor-pointer"
                    >
                      {ADMINS_LIST.map((adm) => (
                        <option key={adm} value={adm}>{adm}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Conversation History */}
              <div>
                <h4 className="font-extrabold text-[#0B315B] text-sm uppercase tracking-wider mb-3">
                  Conversation History
                </h4>
                <div className="space-y-3">
                  {activeTicket.messages && activeTicket.messages.length > 0 ? (
                    activeTicket.messages.map((msg) => {
                      const isAdmin = msg.sender_type === "admin";
                      return (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-2xl border ${
                            isAdmin
                              ? "bg-blue-50/70 border-blue-200 ml-4 sm:ml-8"
                              : "bg-white border-slate-200 mr-4 sm:mr-8 shadow-2xs"
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/50">
                            <span className={`font-extrabold ${isAdmin ? "text-[#0B315B]" : "text-slate-800"}`}>
                              {msg.sender}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      No messages recorded in ticket.
                    </div>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {canManageTickets && (
                <form onSubmit={handleSendReply} className="pt-2">
                  <label className="block font-extrabold text-[#0B315B] uppercase tracking-wider mb-1">
                    Send Reply to Requester
                  </label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official response to the learner here..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden transition"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReply || !replyText.trim()}
                      className="px-5 py-2 bg-[#0B315B] hover:bg-[#183B73] disabled:bg-slate-300 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <FaPaperPlane size={11} />
                      <span>{submittingReply ? "Dispatching..." : "Send Reply to Learner"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Confidential Internal Notes Section */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold uppercase tracking-wider text-xs mb-3">
                  <FaLock />
                  <span>Confidential Internal Notes (Visible Only to Admins)</span>
                </div>

                <div className="space-y-2 mb-3">
                  {activeTicket.internal_notes && activeTicket.internal_notes.length > 0 ? (
                    activeTicket.internal_notes.map((note) => (
                      <div key={note.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950">
                        <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                          <span>{note.author} ({note.author_email || "Admin"})</span>
                          <span>{note.timestamp ? new Date(note.timestamp).toLocaleString() : ""}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      No internal notes recorded. Internal notes are strictly protected from public requester views.
                    </div>
                  )}
                </div>

                {canManageTickets && (
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add private staff note (e.g. verified invoice / rescheduled offline slot)..."
                      className="flex-1 px-3 py-2 bg-amber-50/40 border border-amber-300 rounded-xl font-medium focus:bg-white focus:border-amber-500 outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={submittingNote || !noteText.trim()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <FaStickyNote size={11} />
                      <span>{submittingNote ? "Saving..." : "Add Note"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteTicket(activeTicket)}
                className="text-slate-400 hover:text-rose-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FaTrashAlt />
                <span>Move to Trash Bin</span>
              </button>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CREATE TICKET MODAL
      ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 rounded-lg p-1 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
                <FaPlus />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0B315B]">
                  Create Support Ticket
                </h3>
                <p className="text-xs text-slate-400">
                  Open an administrative support ticket on behalf of a learner.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.subject}
                  onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                  placeholder="e.g. Assessment score review request"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Requester Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.requester_name}
                    onChange={(e) => setCreateForm({ ...createForm, requester_name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Requester Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.requester_email}
                    onChange={(e) => setCreateForm({ ...createForm, requester_email: e.target.value })}
                    placeholder="learner@broadbeach.in"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[#0B315B] focus:bg-white outline-hidden cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority *
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[#0B315B] focus:bg-white outline-hidden cursor-pointer"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Related Course (Optional)
                </label>
                <input
                  type="text"
                  value={createForm.related_course}
                  onChange={(e) => setCreateForm({ ...createForm, related_course: e.target.value })}
                  placeholder="e.g. ISO 9001:2015 Lead Auditor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Issue Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={createForm.message}
                  onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                  placeholder="Detailed description of support request..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0B315B] outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B315B] hover:bg-[#183B73] text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketMaster;
