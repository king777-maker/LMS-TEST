import React, { useState } from "react";
import {
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaAward,
  FaShieldAlt,
  FaCalendarAlt,
  FaUserCheck,
  FaFileDownload,
  FaPaperPlane
} from "react-icons/fa";
import { sampleCertificates } from "../../data/coursesData";
import toast from "react-hot-toast";

const RequestCertificateModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("verify"); // "verify" or "request"
  const [serialInput, setSerialInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state for Request tab
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "ISO 9001:2015 Lead Auditor",
    examScore: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    const query = serialInput.trim().toUpperCase();
    if (!query) {
      toast.error("Please enter a certificate serial number.");
      return;
    }

    setLoading(true);
    setHasSearched(false);

    setTimeout(() => {
      setLoading(false);
      setHasSearched(true);
      if (sampleCertificates[query]) {
        setSearchResult(sampleCertificates[query]);
        toast.success("Certificate record verified successfully!");
      } else {
        // Fallback simulated valid certificate for arbitrary valid-looking serials
        if (query.startsWith("BB-") && query.length >= 6) {
          setSearchResult({
            serial: query,
            studentName: "Registered Candidate",
            courseTitle: "ISO 45001:2018 Lead Implementer",
            issueDate: "October 14, 2026",
            expiryDate: "October 13, 2029",
            grade: "Pass (91%)",
            status: "Active & Verified",
            accreditationBody: "Global Board of Quality & Compliance (GBQC)",
          });
          toast.success("Certificate validated!");
        } else {
          setSearchResult(null);
          toast.error("Certificate not found in registry. Check the ID.");
        }
      }
    }, 400);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requestForm.name || !requestForm.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Certificate request submitted! Our accreditation desk will review within 24 hours.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-modal-enter origin-center">
        
        {/* Header */}
        <div className="settle-header bg-[#08182b] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5A623] text-[#08182b] flex items-center justify-center font-bold text-lg shadow-xs">
              <FaAward />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Certificate Verification & Issuance
              </h3>
              <p className="text-[11.5px] text-slate-300">
                Official Broadbeach Academy Public Credential Registry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("verify")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "verify"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Verify Credential by Serial ID
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("request")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "request"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Request Official Certificate Copy
          </button>
        </div>

        {/* Modal Body */}
        <div className="settle-body p-5 sm:p-6 max-h-[75vh] overflow-y-auto custom-dropdown-scroll">
          
          {/* ===================================================
              TAB 1: VERIFY CREDENTIAL
          =================================================== */}
          {activeTab === "verify" && (
            <div className="space-y-4">
              <form onSubmit={handleVerify} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Enter Certificate Serial Number:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="e.g. BB-ISO-9001-2026"
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold uppercase tracking-wider focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-[#1560bd] hover:bg-[#124f9c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </div>

                {/* Quick Sample Links */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                  <span>Try sample serials:</span>
                  {Object.keys(sampleCertificates).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSerialInput(key);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-blue-700 font-mono text-[10.5px] border border-slate-200 transition-colors cursor-pointer"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </form>

              {/* Result Display */}
              {hasSearched && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {searchResult ? (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border border-emerald-200 shadow-xs space-y-3 pulse-success">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-2xs">
                          <FaCheckCircle className="text-[10px]" />
                          {searchResult.status}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {searchResult.serial}
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Awarded To
                        </p>
                        <h4 className="text-base font-extrabold text-slate-800">
                          {searchResult.studentName}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60 text-xs">
                        <div>
                          <p className="text-[11px] text-slate-500">Qualification</p>
                          <p className="font-bold text-slate-800">{searchResult.courseTitle}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500">Grade / Result</p>
                          <p className="font-bold text-emerald-700">{searchResult.grade}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500">Issue Date</p>
                          <p className="font-semibold text-slate-700">{searchResult.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500">Valid Until</p>
                          <p className="font-semibold text-slate-700">{searchResult.expiryDate}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <FaShieldAlt className="text-emerald-600" />
                          {searchResult.accreditationBody}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                      <p className="text-xs font-semibold text-rose-800">
                        No active certificate was found for serial number "{serialInput}".
                      </p>
                      <p className="text-[11px] text-rose-600 mt-1">
                        Please check for typographical errors or request manual verification.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              TAB 2: REQUEST CERTIFICATE
          =================================================== */}
          {activeTab === "request" && (
            <form onSubmit={handleRequestSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <FaAward className="text-amber-600 text-base flex-shrink-0 mt-0.5" />
                <span>
                  Students who have successfully passed assessments with 70%+ score can request their official embossed credentials or digital tamper-proof copy.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="As it should appear on certificate"
                  value={requestForm.name}
                  onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Completed Course Track
                </label>
                <select
                  value={requestForm.course}
                  onChange={(e) => setRequestForm({ ...requestForm, course: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
                >
                  <option>ISO 9001:2015 Lead Auditor</option>
                  <option>ISO 45001:2018 Lead Implementer</option>
                  <option>ISO/IEC 27001:2022 Lead Auditor (ISMS)</option>
                  <option>AS9100 Rev D Aerospace & Defense Auditor</option>
                  <option>Lean Six Sigma Green Belt</option>
                  <option>Integrated Management Systems (IMS) Auditor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F5A623] hover:bg-[#f39c12] text-[#08182b] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <FaPaperPlane />
                Submit Certificate Request
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default RequestCertificateModal;
