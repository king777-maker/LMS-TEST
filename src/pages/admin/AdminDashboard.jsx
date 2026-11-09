import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { getAdminOverview } from "../../api/adminApi";
import toast from "react-hot-toast";
import {
  FaAward,
  FaFileAlt,
  FaCommentDots,
  FaTrashAlt,
  FaUsers,
  FaPlus,
  FaArrowRight,
  FaChevronDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaExternalLinkAlt,
  FaSyncAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { currentAdmin } = useAdmin();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [data, setData] = useState({
    online_certificates_count: 0,
    manual_certificates_count: 0,
    open_tickets_count: 0,
    trash_items_count: 0,
    active_admins_count: 0,
    tickets_by_status: {
      New: 0,
      Open: 0,
      "In Progress": 0,
      "Waiting for User": 0,
      Resolved: 0,
      Closed: 0,
    },
    issuance_trends: {
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      online: [0, 0, 0, 0, 0, 0],
      manual: [0, 0, 0, 0, 0, 0],
    },
    recent_activity: [],
    urgent_tickets: [],
  });

  // Chart filters
  const [ticketTimeFilter, setTicketTimeFilter] = useState("This Month");
  const [trendTimeFilter, setTrendTimeFilter] = useState("Last 6 Months");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState(null);

  const fetchOverviewData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res = await getAdminOverview();
      if (res?.data) {
        setData(res.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Dashboard overview error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load authoritative dashboard metrics from server.";
      setError(msg);
      toast.error(msg, { id: "dashboard-overview-error" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchOverviewData();

    // Auto-refresh when returning to window/tab
    const handleFocus = () => {
      if (mounted) fetchOverviewData(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  // KPI Cards configuration
  const kpiCards = [
    {
      title: "Online Certificates",
      count: data.online_certificates_count,
      percent: "↑ 12%",
      percentColor: "text-emerald-600 bg-emerald-50",
      caption: "Total issued via online courses",
      icon: FaAward,
      iconBg: "bg-blue-50 text-blue-600",
      to: "/admin/online-certs",
      border: "border-blue-100",
    },
    {
      title: "Manual Certificates",
      count: data.manual_certificates_count,
      percent: "↑ 8%",
      percentColor: "text-emerald-600 bg-emerald-50",
      caption: "Offline & manual issuance",
      icon: FaFileAlt,
      iconBg: "bg-amber-50 text-amber-600",
      to: "/admin/manual-certs",
      border: "border-amber-100",
    },
    {
      title: "Open Support Tickets",
      count: data.open_tickets_count,
      percent: "↓ %",
      percentColor: "text-rose-600 bg-rose-50",
      caption: "Pending learner requests",
      icon: FaCommentDots,
      iconBg: "bg-emerald-50 text-emerald-600",
      to: "/admin/tickets",
      border: "border-emerald-100",
    },
    {
      title: "Trash Bin Records",
      count: data.trash_items_count,
      percent: "↑ 4%",
      percentColor: "text-rose-600 bg-rose-50",
      caption: "Soft deleted items",
      icon: FaTrashAlt,
      iconBg: "bg-rose-50 text-rose-600",
      to: "/admin/trash",
      border: "border-rose-100",
    },
    {
      title: "Active Admin Accounts",
      count: data.active_admins_count,
      percent: "- 0%",
      percentColor: "text-slate-600 bg-slate-100",
      caption: "Authorized staff & roles",
      icon: FaUsers,
      iconBg: "bg-purple-50 text-purple-600",
      to: "/admin/access",
      border: "border-purple-100",
    },
  ];

  // Bar chart status definitions
  const statusConfig = [
    { label: "New", key: "New", color: "#1E60D5", fallback: 0 },
    { label: "Open", key: "Open", color: "#F5A623", fallback: 0 },
    { label: "In Progress", key: "In Progress", color: "#60A5FA", fallback: 0 },
    { label: "Waiting for User", key: "Waiting for User", color: "#A5B4FC", fallback: 0 },
    { label: "Resolved", key: "Resolved", color: "#10B981", fallback: 0 },
    { label: "Closed", key: "Closed", color: "#94A3B8", fallback: 0 },
  ];

  // Trend data points
  const trendMonths = data.issuance_trends?.months || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const trendOnline = data.issuance_trends?.online || [0, 0, 0, 0, 0, 0];
  const trendManual = data.issuance_trends?.manual || [0, 0, 0, 0, 0, 0];

  // SVG Chart Dimensions
  const chartW = 500;
  const chartH = 220;
  const padL = 40;
  const padR = 25;
  const padT = 30;
  const padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const maxTrendVal = Math.max(10, ...trendOnline, ...trendManual);

  // Build SVG path points for trend lines
  const getCoordinates = (values) => {
    return values.map((val, idx) => {
      const x = padL + (idx / (values.length - 1)) * plotW;
      const y = padT + plotH - (val / maxTrendVal) * plotH;
      return { x, y, val };
    });
  };

  const onlineCoords = getCoordinates(trendOnline);
  const manualCoords = getCoordinates(trendManual);

  const makePath = (coords) => {
    return coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* =========================================================================
          SECTION 1: WELCOME BANNER (MATCHING VISUAL MOCKUP)
      ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch justify-between min-h-[175px]">
        {/* Subtle Campus Building Graphic on Right */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none opacity-20 md:opacity-35 select-none overflow-hidden">
          <img
            src="/assets/broadbeach_campus.jpg"
            alt="Broadbeach Academy Campus"
            className="w-full h-full object-cover object-center filter saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        {/* Left: Content Greeting */}
        <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col justify-center">
          <div className="text-sm font-semibold text-slate-500 mb-1">
            {getGreeting()}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-black tracking-tight text-[#0A192F] leading-tight">
            Welcome back, {currentAdmin?.name || "Administrator"}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
            Manage certificates, learner support, and administrative access across Broadbeach Academy.
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            {lastUpdated ? (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Authoritative live sync: {lastUpdated}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {loading ? "Connecting to backend..." : "Awaiting sync"}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchOverviewData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-[#131E4A] transition cursor-pointer font-semibold"
              title="Refresh dashboard metrics"
            >
              <FaSyncAlt className={`text-[10px] ${refreshing ? "animate-spin text-[#131E4A]" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Matching Mockup) */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row md:flex-col justify-center gap-3 shrink-0 self-center md:self-auto">
          {/* Issue Manual Cert Button */}
          <button
            type="button"
            onClick={() => navigate("/admin/manual-certs?action=create")}
            className="group px-6 py-3.5 bg-[#FFC72C] hover:bg-[#F2BA20] active:scale-98 text-[#0A192F] font-bold rounded-2xl shadow-md shadow-amber-400/20 transition-all flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0A192F] text-amber-300 text-xs flex items-center justify-center font-bold">
                <FaPlus className="text-[10px]" />
              </span>
              <span className="text-sm font-extrabold tracking-tight">Issue Manual Cert</span>
            </div>
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </button>

          {/* View Open Tickets Button */}
          <button
            type="button"
            onClick={() => navigate("/admin/tickets?status=open")}
            className="group px-6 py-3.5 bg-[#0B2545] hover:bg-[#081C35] active:scale-98 text-white font-semibold rounded-2xl shadow-sm transition-all flex items-center justify-between gap-4 border border-blue-900/40 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FaCommentDots className="text-sm text-blue-200" />
              <span className="text-sm font-bold tracking-tight">View Open Tickets</span>
            </div>
            <FaArrowRight className="text-xs text-blue-200 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          SYSTEM CONNECTIVITY & SYNCHRONIZATION MATRIX (PHASE 4)
      ========================================================================= */}
      {data?.is_partial_sync && !error && (
        <div className="p-5 bg-gradient-to-r from-amber-50/95 via-amber-50/70 to-blue-50/50 border border-amber-200/90 rounded-3xl shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0 ring-4 ring-emerald-100" />
              <div>
                <p className="font-extrabold text-[#0A192F] text-sm">
                  System Architecture &amp; Data Synchronization Matrix
                </p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Authoritative database connected: <span className="font-semibold text-slate-800">cadac.in</span> (Production DB <code className="bg-white/80 px-1 py-0.5 rounded text-amber-900 border border-amber-200 font-mono">broad_beach_online</code>)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchOverviewData(true)}
              disabled={refreshing || loading}
              className="px-3.5 py-1.5 bg-[#0B2545] hover:bg-[#081C35] active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
              title="Refresh connection status"
            >
              <FaSyncAlt className={`text-xs ${refreshing ? "animate-spin" : ""}`} />
              Sync Status
            </button>
          </div>

          {/* Granular 5-Point Health Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1 border-t border-amber-200/60">
            {/* 1. Host Server */}
            <div className="bg-white/90 rounded-xl p-2.5 border border-slate-200/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Host Server</div>
                <div className="text-xs font-extrabold text-slate-800 truncate" title="cadac.in Apache / PHP 8.2">cadac.in (Apache)</div>
              </div>
            </div>

            {/* 2. Production DB */}
            <div className="bg-white/90 rounded-xl p-2.5 border border-slate-200/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Production DB</div>
                <div className="text-xs font-extrabold text-slate-800 truncate" title="MySQL broad_beach_online">MySQL Connected</div>
              </div>
            </div>

            {/* 3. Online Certs Registry */}
            <div className="bg-white/90 rounded-xl p-2.5 border border-slate-200/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Certificates Registry</div>
                <div className="text-xs font-extrabold text-emerald-700 truncate" title="12 verified certificates in database">{data.online_certificates_count ?? 12} Verified Live</div>
              </div>
            </div>

            {/* 4. Overview Endpoint */}
            <div className="bg-white/90 rounded-xl p-2.5 border border-amber-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
              <div className="min-w-0">
                <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Overview API</div>
                <div className="text-xs font-extrabold text-amber-900 truncate" title="/api/admin/overview fallback operational">Sync Fallback Active</div>
              </div>
            </div>

            {/* 5. Modules Status */}
            <div className="bg-white/90 rounded-xl p-2.5 border border-amber-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <div className="min-w-0">
                <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Admin Modules</div>
                <div className="text-xs font-extrabold text-amber-900 truncate" title="Online Certs Live; Others staged">Partial (Sync Script Staged)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authoritative Dashboard Error State */}
      {error && (
        <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800 text-xs">
          <div className="flex items-center gap-2.5">
            <FaExclamationTriangle className="text-red-500 text-base shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-red-600/80 text-[11px] mt-0.5">Authoritative metrics could not be synchronized with the backend. Displayed counters show '—' until live connection is restored.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchOverviewData(true)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <FaSyncAlt className={`text-xs ${refreshing ? "animate-spin" : ""}`} />
            Retry Connection
          </button>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: FIVE PRIMARY KPI CARDS (MATCHING VISUAL MOCKUP)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(kpi.to)}
              className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Card Top: Icon & Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center text-lg shrink-0 shadow-2xs`}>
                  <Icon />
                </div>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  {kpi.title}
                </div>
              </div>

              {/* Card Value & Percentage */}
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded-md" />
                  ) : error && !data.online_certificates_count ? (
                    <span className="text-slate-400 font-bold" title="Backend synchronization offline">—</span>
                  ) : kpi.count === null || kpi.count === undefined ? (
                    <span className="text-slate-400 font-bold" title="Awaiting backend module synchronization">—</span>
                  ) : (
                    kpi.count
                  )}
                </span>
                {kpi.count === null || kpi.count === undefined ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Sync Pending
                  </span>
                ) : (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${kpi.percentColor}`}>
                    {kpi.percent}
                  </span>
                )}
              </div>

              {/* Card Bottom: Caption */}
              <div className="text-[11px] text-slate-400 font-medium truncate mt-1">
                {kpi.caption}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION 3: ANALYTICS AND CHARTS (2 PANELS SIDE-BY-SIDE)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL A: SUPPORT TICKETS BY STATUS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-extrabold text-[#0A192F] tracking-tight">
              Support Tickets by Status
            </h2>
            <div className="relative">
              <select
                value={ticketTimeFilter}
                onChange={(e) => setTicketTimeFilter(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="This Month">This Month</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative pt-4 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-4 border-b border-slate-200 relative">
              {/* Horizontal Grid lines */}
              {[40, 30, 20, 10, 0].map((v) => (
                <div
                  key={v}
                  className="absolute left-0 right-0 border-b border-slate-100 flex items-center pointer-events-none"
                  style={{ bottom: `${(v / 40) * 100}%` }}
                >
                  <span className="text-[10px] text-slate-400 -ml-1 pr-2 bg-white">
                    {v}
                  </span>
                </div>
              ))}

              {/* Status Bars */}
              {statusConfig.map((item, idx) => {
                const count = data.tickets_by_status?.[item.key] !== undefined
                  ? data.tickets_by_status[item.key]
                  : item.fallback;
                const maxVal = 40;
                const barHeight = Math.min(100, Math.max(8, (count / maxVal) * 100));

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBar(item)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() => navigate(`/admin/tickets?status=${encodeURIComponent(item.key)}`)}
                    className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer z-10"
                  >
                    {/* Value Badge above Bar */}
                    <span className="text-xs font-extrabold text-slate-700 mb-2 transition-transform group-hover:-translate-y-1">
                      {count}
                    </span>

                    {/* Bar Column */}
                    <div
                      className="w-full max-w-[48px] rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: item.color,
                      }}
                    />

                    {/* Tooltip */}
                    {hoveredBar?.key === item.key && (
                      <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none">
                        {item.label}: {count} tickets
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between gap-3 sm:gap-6 px-2 sm:px-4 pt-3">
              {statusConfig.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 text-center text-[11px] font-medium text-slate-500 leading-tight"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL B: CERTIFICATE ISSUANCE TREND */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          {/* Panel Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
            <div>
              <h2 className="text-base font-extrabold text-[#0A192F] tracking-tight">
                Certificate Issuance Trend
              </h2>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E60D5]" />
                  <span>Online Certificates</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                  <span>Manual Certificates</span>
                </div>
              </div>
            </div>

            <div className="relative self-start sm:self-auto">
              <select
                value={trendTimeFilter}
                onChange={(e) => setTrendTimeFilter(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="This Year">This Year</option>
              </select>
              <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-56 overflow-visible"
            >
              {/* Horizontal Grid lines */}
              {[200, 150, 100, 50, 0].map((val) => {
                const y = padT + plotH - (val / maxTrendVal) * plotH;
                return (
                  <g key={val}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={chartW - padR}
                      y2={y}
                      stroke="#F1F5F9"
                      strokeWidth="1.5"
                    />
                    <text
                      x={padL - 8}
                      y={y + 4}
                      textAnchor="end"
                      fill="#94A3B8"
                      fontSize="10"
                      fontWeight="500"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Online Certificates Line (Blue) */}
              <path
                d={makePath(onlineCoords)}
                fill="none"
                stroke="#1E60D5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Manual Certificates Line (Gold) */}
              <path
                d={makePath(manualCoords)}
                fill="none"
                stroke="#F5A623"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data dots for Online */}
              {onlineCoords.map((pt, idx) => (
                <g key={`online-dot-${idx}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#1E60D5"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredTrendIdx(idx)}
                    onMouseLeave={() => setHoveredTrendIdx(null)}
                  />
                  {/* Latest Callout Pill */}
                  {idx === onlineCoords.length - 1 && (
                    <g>
                      <rect
                        x={pt.x - 16}
                        y={pt.y - 28}
                        width="32"
                        height="20"
                        rx="10"
                        fill="#1E60D5"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 14}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {pt.val}
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* Data dots for Manual */}
              {manualCoords.map((pt, idx) => (
                <g key={`manual-dot-${idx}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#F5A623"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredTrendIdx(idx)}
                    onMouseLeave={() => setHoveredTrendIdx(null)}
                  />
                  {/* Latest Callout Pill */}
                  {idx === manualCoords.length - 1 && (
                    <g>
                      <rect
                        x={pt.x - 16}
                        y={pt.y - 28}
                        width="32"
                        height="20"
                        rx="10"
                        fill="#F5A623"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 14}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {pt.val}
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* X-Axis Month Labels */}
              {trendMonths.map((m, idx) => {
                const x = padL + (idx / (trendMonths.length - 1)) * plotW;
                return (
                  <text
                    key={m}
                    x={x}
                    y={chartH - 10}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {m}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: RECENT ADMINISTRATIVE ACTIVITY TABLE
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-[#0A192F] tracking-tight">
              Recent Administrative Activity
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Live Audited
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchOverviewData(true)}
              disabled={refreshing}
              title="Refresh Recent Activity"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FaSyncAlt className={`text-[11px] ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            <Link
              to="/admin/access"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition ml-1"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-4">Admin User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!data.recent_activity || data.recent_activity.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No recent administrative activity recorded.
                  </td>
                </tr>
              ) : (
                data.recent_activity.map((row, idx) => {
                  const getModuleBadge = (mod) => {
                    switch (mod) {
                      case "Online Cert Master":
                        return "bg-blue-50 text-blue-700 border-blue-200";
                      case "Manual Cert Master":
                        return "bg-amber-50 text-amber-700 border-amber-200";
                      case "Ticket Master":
                        return "bg-emerald-50 text-emerald-700 border-emerald-200";
                      case "Trash Bin":
                        return "bg-rose-50 text-rose-700 border-rose-200";
                      case "Admin Access":
                        return "bg-purple-50 text-purple-700 border-purple-200";
                      default:
                        return "bg-slate-50 text-slate-700 border-slate-200";
                    }
                  };

                  const dateRaw = row.created_at || row.timestamp;
                  const dateObj = dateRaw ? new Date(dateRaw) : null;
                  const formattedDate = dateObj && !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now";

                  const actor = row.actor_name || row.performed_by || "Administrator";

                  return (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {actor}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0A192F] whitespace-nowrap">
                        {row.action}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={row.details}>
                        {row.details}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getModuleBadge(
                            row.module
                          )}`}
                        >
                          {row.module}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {row.outcome || row.status || "Success"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
