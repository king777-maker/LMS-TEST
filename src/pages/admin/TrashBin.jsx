import React, { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import { getTrashItems, restoreTrashItem, purgeTrashItem } from "../../api/adminApi";
import PinVerificationModal from "../../components/Admin/PinVerificationModal";
import toast from "react-hot-toast";
import {
  FaTrashAlt,
  FaSearch,
  FaFilter,
  FaUndo,
  FaExclamationTriangle,
  FaTimes,
  FaShieldAlt,
  FaEye,
  FaRedo,
  FaClock,
  FaSyncAlt,
  FaCheckCircle,
} from "react-icons/fa";

const RECORD_TYPES = ["All Types", "Online Certificate", "Manual Certificate", "Ticket"];

const TrashBin = () => {
  const { currentAdmin, isSuperAdmin } = useAdmin();

  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeNotFound, setRouteNotFound] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  // Inspection & Purge Modals
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [purgeModalOpen, setPurgeModalOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch trash items
  const fetchTrash = async () => {
    try {
      setLoading(true);
      setRouteNotFound(false);
      const res = await getTrashItems({
        search,
        type: typeFilter === "All Types" ? "all" : typeFilter,
      });
      if (res?.data) {
        setTrashItems(res.data);
      }
    } catch (err) {
      if (err.isNotFound || err.status === 404 || String(err.message).includes("not found")) {
        setRouteNotFound(true);
        toast.dismiss("trash-fetch-error");
      } else {
        toast.error(err.message || "Failed to load Trash Bin records.", { id: "trash-fetch-error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, [typeFilter]);

  // Client filtering
  const filteredItems = useMemo(() => {
    return trashItems.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchQuery =
        !q ||
        String(item.id || "").toLowerCase().includes(q) ||
        String(item.record_id || "").toLowerCase().includes(q) ||
        String(item.title || "").toLowerCase().includes(q) ||
        String(item.deleted_by || "").toLowerCase().includes(q);

      const matchType =
        typeFilter === "All Types" || item.record_type === typeFilter;

      return matchQuery && matchType;
    });
  }, [trashItems, search, typeFilter]);

  // Restore Record
  const handleRestore = async (item) => {
    if (!window.confirm(`Restore ${item.record_type} (${item.record_id}) back to its active location?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await restoreTrashItem(item.id);
      toast.success(`${item.record_type} ${item.record_id} restored successfully.`);
      fetchTrash();
    } catch (err) {
      toast.error(err.message || "Failed to restore record.");
    } finally {
      setActionLoading(false);
    }
  };

  // Open Permanent Purge Modal
  const handleOpenPurge = (item) => {
    if (!isSuperAdmin) {
      toast.error("Permission Denied: Permanent record deletion requires Super Admin privileges.");
      return;
    }
    setSelectedItem(item);
    setPurgeConfirmText("");
    setPurgeModalOpen(true);
  };

  const [pinModalOpen, setPinModalOpen] = useState(false);

  // Step 1: Confirm text 'DELETE', then prompt 4-digit PIN
  const handleConfirmPurge = async () => {
    if (!selectedItem || !isSuperAdmin) return;
    if (purgeConfirmText.trim().toUpperCase() !== "DELETE") {
      toast.error("Please type DELETE to confirm permanent purge.");
      return;
    }

    setPurgeModalOpen(false);
    setPinModalOpen(true);
  };

  // Step 2: Execute permanent purge with authorized PIN
  const handleExecutePurgeWithPin = async (pin) => {
    if (!selectedItem || !isSuperAdmin) return;

    try {
      setActionLoading(true);
      await purgeTrashItem(selectedItem.id, pin);
      toast.success(`Record ${selectedItem.record_id} permanently purged.`);
      setPinModalOpen(false);
      setSelectedItem(null);
      fetchTrash();
    } catch (err) {
      toast.error(err.message || "Security PIN verification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Inspect Raw Snapshot
  const handleInspect = (item) => {
    setSelectedItem(item);
    setInspectModalOpen(true);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <FaTrashAlt />
            <span>Module 4 — Recovery & Retention Policy</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B315B] tracking-tight">
            Trash Bin
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Recover soft-deleted certificates and tickets, or permanently purge obsolete records (Super Admin only).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchTrash}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh Trash"
          >
            <FaSyncAlt className={`text-xs ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <FaExclamationTriangle className="text-amber-600 text-base shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold">Data Safety & Audited Retention: </span>
          <span>
            Moving a record to the Trash Bin does not corrupt certificate verification registries or wipe historical audit logs. Restoring a certificate returns it to its previous module with its authentic identifier and verification state intact.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trash by ID, title, or admin..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#0B315B] focus:ring-1 focus:ring-[#0B315B] outline-hidden transition"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="font-semibold text-slate-400">Record Type:</span>
            <select
              aria-label="Filter trash records by type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-bold text-[#0B315B] focus:outline-hidden cursor-pointer"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trash Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Record Type</th>
                <th className="py-3 px-4">Title / Descriptive Label</th>
                <th className="py-3 px-4">Deleted By</th>
                <th className="py-3 px-4">Deletion Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading Trash records...</span>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    {/* Record ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-[#0B315B] font-mono">
                        {item.record_id}
                      </span>
                      <div className="text-[10px] text-slate-400">{item.id}</div>
                    </td>

                    {/* Record Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          item.record_type === "Online Certificate"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.record_type === "Manual Certificate"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {item.record_type}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-bold text-slate-800 truncate" title={item.title}>
                        {item.title}
                      </div>
                    </td>

                    {/* Deleted By */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{item.deleted_by}</div>
                      <div className="text-[10px] text-slate-400">{item.deleted_by_email}</div>
                    </td>

                    {/* Deletion Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {/* Inspect Snapshot */}
                        <button
                          type="button"
                          onClick={() => handleInspect(item)}
                          className="p-1.5 text-slate-500 hover:text-[#0B315B] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Inspect Record Snapshot"
                        >
                          <FaEye size={12} />
                        </button>

                        {/* Restore Action */}
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-xs border border-emerald-200 transition cursor-pointer"
                        >
                          <FaUndo size={10} />
                          <span>Restore</span>
                        </button>

                        {/* Permanent Delete Action (Super Admin Only) */}
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleOpenPurge(item)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg text-xs border border-rose-200 transition cursor-pointer"
                            title="Permanently Delete (Super Admin)"
                          >
                            <FaTrashAlt size={10} />
                            <span>Purge</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : routeNotFound ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center">
                    <div className="max-w-md mx-auto p-6 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                        <FaClock />
                      </div>
                      <h3 className="font-extrabold text-sm text-[#0B315B] mb-1">
                        Trash Bin — Awaiting Server Deployment
                      </h3>
                      <p className="text-amber-800/90 leading-relaxed mb-4">
                        The backend route <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">GET /api/admin/trash</code> and the <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">trash_records</code> table are staged. Deploy <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">cadac_admin_sync.php</code> to activate cross-module recovery and purging.
                      </p>
                      <button
                        type="button"
                        onClick={fetchTrash}
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
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Trash Bin is empty. No recoverable records present.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          INSPECT SNAPSHOT MODAL
      ========================================================================= */}
      {inspectModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setInspectModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 rounded-lg p-1 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B315B] flex items-center justify-center text-lg">
                <FaEye />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0B315B]">
                  Trash Snapshot Inspection
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {selectedItem.record_id} ({selectedItem.record_type})
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-700 mb-1">Title / Description:</div>
                <div className="text-slate-900">{selectedItem.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Deleted By</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.deleted_by}</div>
                  <div className="text-[10px] text-slate-400">{selectedItem.deleted_by_email}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Deletion Date</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedItem.deleted_at ? new Date(selectedItem.deleted_at).toLocaleString() : ""}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Serialized Raw Snapshot Data
                </div>
                <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedItem.original_data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PERMANENT PURGE MODAL (SUPER ADMIN ONLY)
      ========================================================================= */}
      {purgeModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-300 p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-xl">
                <FaExclamationTriangle />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-800">
                  Permanent Record Purge
                </h3>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {selectedItem.record_id}
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 mb-4 leading-relaxed">
              <strong>CRITICAL WARNING:</strong> This action cannot be undone. The record will be permanently eradicated from the system and cannot be restored.
            </div>

            <div className="space-y-3 text-xs mb-5">
              <p className="text-slate-600">
                To confirm permanent deletion of <strong>{selectedItem.title}</strong>, please type <code className="bg-slate-100 px-1 py-0.5 rounded font-black text-rose-600">DELETE</code> below:
              </p>
              <input
                type="text"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center text-rose-700 uppercase tracking-widest focus:bg-white focus:border-rose-600 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPurgeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurge}
                disabled={actionLoading || purgeConfirmText.trim().toUpperCase() !== "DELETE"}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                {actionLoading ? "Purging..." : "Permanently Purge Record"}
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
        }}
        onConfirm={handleExecutePurgeWithPin}
        title="Authorize Permanent Record Purge"
        description={`This action permanently destroys record ${selectedItem?.record_id} (${selectedItem?.record_type}) from the database. It cannot be recovered.`}
        targetDetails={selectedItem ? `${selectedItem.record_id} • ${selectedItem.record_type}` : ""}
        actionLabel="Authorize & Permanently Purge"
        loading={actionLoading}
      />
    </div>
  );
};

export default TrashBin;
