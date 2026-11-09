import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { getAdminOverview, globalSearch } from "../../api/adminApi";
import { adminRoutes } from "../../utils/adminRoutes";
import {
  FaHome,
  FaAward,
  FaFileAlt,
  FaCommentDots,
  FaTrashAlt,
  FaUserShield,
  FaBars,
  FaSearch,
  FaExternalLinkAlt,
  FaHeadset,
  FaEnvelope,
  FaSignOutAlt,
  FaTimes,
  FaBell,
  FaChevronDown,
  FaShieldAlt,
  FaCertificate,
  FaTicketAlt,
  FaUser,
  FaExclamationCircle,
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const { currentAdmin, isSuperAdmin, logout, switchDemoRole } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar collapse states
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Stats for count badges
  const [stats, setStats] = useState({
    online_certificates_count: 0,
    manual_certificates_count: 0,
    open_tickets_count: 0,
    trash_items_count: 0,
    active_admins_count: 0,
    urgent_tickets: [],
  });

  // Global search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Profile / Notification dropdowns
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Fetch real counts for sidebar badges
  const fetchStats = async () => {
    try {
      const res = await getAdminOverview();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.warn("Sidebar metrics fetch:", e.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle === "hidden" ? "" : originalStyle;
      };
    }
  }, [mobileOpen]);

  // Ensure scroll position cleanly resets to top on module navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced global search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await globalSearch(searchQuery.trim());
        if (res?.data) {
          setSearchResults(res.data);
          setSearchOpen(true);
        }
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = [
    {
      to: adminRoutes.base,
      label: "Overview Dashboard",
      icon: FaHome,
      end: true,
      badge: null,
    },
    {
      to: adminRoutes.onlineCerts,
      label: "Online Cert Master",
      icon: FaAward,
      badge: stats.online_certificates_count > 0 ? stats.online_certificates_count : null,
      badgeColor: "bg-[#0E2746] text-blue-200 border border-blue-400/20",
    },
    {
      to: adminRoutes.manualCerts,
      label: "Manual Cert Master",
      icon: FaFileAlt,
      badge: stats.manual_certificates_count > 0 ? stats.manual_certificates_count : null,
      badgeColor: "bg-[#1F2937] text-amber-200 border border-amber-400/20",
    },
    {
      to: adminRoutes.tickets,
      label: "Ticket Master",
      icon: FaCommentDots,
      badge: stats.open_tickets_count > 0 ? stats.open_tickets_count : null,
      badgeColor: "bg-[#10B981] text-white font-bold",
    },
    {
      to: adminRoutes.trash,
      label: "Trash Bin",
      icon: FaTrashAlt,
      badge: stats.trash_items_count > 0 ? stats.trash_items_count : null,
      badgeColor: "bg-[#EF4444] text-white font-bold",
    },
    {
      to: adminRoutes.access,
      label: "Admin Access",
      icon: FaUserShield,
      badge: stats.active_admins_count > 0 ? stats.active_admins_count : null,
      badgeColor: "bg-[#1E293B] text-slate-300 border border-slate-700",
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F4F7FC] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#FFC72C] selection:text-[#0B1E36] w-full min-w-0">
      {/* =========================================================================
          1. LEFT SIDEBAR (DESKTOP) - Stationary Fixed Left Sidebar
      ========================================================================= */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 h-screen h-[100dvh] flex-col justify-between bg-[#08182D] text-slate-300 transition-all duration-300 border-r border-blue-950/60 overflow-hidden select-none ${
          collapsed ? "w-20" : "w-64"
        }`}
        aria-label="Admin Sidebar Navigation"
      >
        {/* --- Top Section: Stationary Brand Logo Header (Never scrolls) --- */}
        <div className="shrink-0 p-5 pb-3">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-1"}`}>
            <img
              src="/assets/cookie-preferences-icon.png"
              alt="Broadbeach Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-lg shrink-0"
              width={40}
              height={40}
            />

            {!collapsed && (
              <div className="flex flex-col leading-tight select-none">
                <span className="font-extrabold text-[15px] tracking-tight text-white flex items-center gap-1">
                  Broadbeach
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-300 font-semibold">Academy</span>
                  <span className="font-bold text-[#FFC72C] uppercase tracking-wider text-[11px]">
                    Admin
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Middle Section: Navigation List (Only scrolls internally if viewport is too short) --- */}
        <nav
          className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-1.5 admin-sidebar-nav"
          style={{ overscrollBehavior: "contain" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 select-none ${
                    isActive
                      ? "bg-[#FFC72C] text-[#0A192F] font-bold shadow-md shadow-amber-400/20"
                      : "text-slate-300 hover:text-white hover:bg-white/6 font-medium"
                  } ${collapsed ? "justify-center px-0" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`text-lg shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? "text-[#0A192F]" : "text-slate-400 group-hover:text-[#FFC72C]"
                        }`}
                      />
                      {!collapsed && (
                        <span className="text-[13px] truncate tracking-normal">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!collapsed && item.badge !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                          isActive
                            ? "bg-[#0A192F] text-amber-300"
                            : item.badgeColor || "bg-blue-900/60 text-blue-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* --- Bottom Section: Stationary Actions & Support (Never scrolls) --- */}
        <div className="shrink-0 p-3 pt-2 border-t border-white/8 space-y-2">
          {/* Live Site Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/6 text-[13px] font-medium transition-all ${
              collapsed ? "justify-center px-0" : ""
            }`}
            title="Go to Live Site"
          >
            <FaExternalLinkAlt className="text-sm shrink-0 text-slate-400" />
            {!collapsed && <span>Go to Live Site</span>}
          </a>

          {/* Bottom Support Card */}
          {!collapsed && (
            <div className="bg-[#051121]/90 rounded-2xl p-3 border border-white/8 shadow-inner flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <FaHeadset className="text-xs" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Need Help?</div>
                  <div className="text-[11px] text-slate-400">Contact Support</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors pt-1 border-t border-white/5 truncate font-mono">
                <FaEnvelope className="text-[10px] shrink-0" />
                <span className="truncate">admin@broadbeachlearning.com</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE DRAWER (TABLET / SMARTPHONE)
      ========================================================================= */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-[#08182D] text-slate-300 flex flex-col justify-between p-5 z-10 shadow-2xl h-full h-[100dvh] overflow-hidden">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between pb-4 border-b border-white/10 mb-2">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/cookie-preferences-icon.png"
                  alt="Broadbeach Logo"
                  className="w-9 h-9 rounded-xl object-contain shadow-md shrink-0"
                  width={36}
                  height={36}
                />
                <div>
                  <span className="font-extrabold text-white text-base">Broadbeach</span>
                  <span className="text-[#FFC72C] font-bold text-xs ml-1.5 uppercase">Admin</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/5 cursor-pointer"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* Navigation list */}
            <nav className="flex-1 min-h-0 overflow-y-auto py-2 flex flex-col gap-1.5 admin-sidebar-nav" style={{ overscrollBehavior: 'contain' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#FFC72C] text-[#0A192F] font-bold shadow-md"
                          : "text-slate-300 hover:text-white hover:bg-white/6 font-medium"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-base shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          item.badgeColor || "bg-blue-900/60 text-blue-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}

              <div className="my-3 border-t border-white/8" />

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/6 text-sm font-medium"
              >
                <FaExternalLinkAlt className="text-xs" />
                <span>Go to Live Site</span>
              </a>
            </nav>

            {/* Bottom Admin User & Logout */}
            <div className="shrink-0 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFC72C] text-[#0B1E36] font-bold text-xs flex items-center justify-center">
                  {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="text-xs">
                  <div className="text-white font-semibold truncate max-w-[130px]">
                    {currentAdmin?.name || "Admin"}
                  </div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono">
                    {isSuperAdmin ? "super_admin" : (currentAdmin?.role || "admin")}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-2 text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                title="Sign Out"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN COLUMN (TOP BAR + CONTENT)
      ========================================================================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full min-h-screen min-h-[100dvh] transition-[padding] duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Left: Sidebar Toggle & Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setCollapsed(!collapsed);
                } else {
                  setMobileOpen(true);
                }
              }}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0B1E36] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shrink-0"
              aria-label="Toggle sidebar navigation"
            >
              <FaBars className="text-base" />
            </button>

            {/* Global Search Bar */}
            <div ref={searchRef} className="relative flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setSearchOpen(true);
                  }}
                  placeholder="Search certificates, tickets, learners or admin..."
                  className="w-full pl-11 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B1E36]/15 focus:border-[#0B1E36] transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setSearchOpen(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>

              {/* Live Search Dropdown */}
              {searchOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto animate-fade-in">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <span>Search Results ({searchResults.length})</span>
                    {searching && <span className="text-blue-600 normal-case font-normal">Searching...</span>}
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No matching records found for "{searchQuery}".
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {searchResults.map((item, idx) => {
                        const getIcon = () => {
                          if (item.type === "Online Certificate") return <FaCertificate className="text-blue-500" />;
                          if (item.type === "Manual Certificate") return <FaFileAlt className="text-amber-500" />;
                          if (item.type === "Support Ticket") return <FaTicketAlt className="text-emerald-500" />;
                          return <FaUser className="text-purple-500" />;
                        };

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              navigate(item.url);
                              setSearchOpen(false);
                            }}
                            className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                {getIcon()}
                              </div>
                              <div className="truncate">
                                <div className="text-sm font-bold text-slate-900 truncate">
                                  {item.title}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                  {item.subtitle}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 capitalize">
                              {item.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Notifications & Administrator Profile */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0B1E36] hover:bg-slate-50 transition cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <FaBell className="text-base" />
                {stats.urgent_tickets?.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notifications Popup */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0B1E36] uppercase tracking-wider">
                      Operational Alerts
                    </span>
                    <span className="text-xs text-rose-600 font-semibold">
                      {stats.urgent_tickets?.length || 0} Urgent
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {stats.urgent_tickets?.length === 0 ? (
                      <div className="p-5 text-center text-slate-400">
                        No critical alerts requiring immediate action.
                      </div>
                    ) : (
                      stats.urgent_tickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            navigate(`/admin/tickets?search=${encodeURIComponent(t.id)}`);
                            setNotifOpen(false);
                          }}
                          className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-start gap-2.5"
                        >
                          <FaExclamationCircle className="text-rose-500 text-sm shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-slate-900">{t.id}: {t.subject}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {t.requester_name} • <span className="text-rose-600 font-semibold">{t.priority}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      to="/admin/tickets"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-bold text-[#0B1E36] hover:underline"
                    >
                      View All Tickets in Ticket Master →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Server-Verified Role Indicator */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-slate-400 font-medium">Role:</span>
              <span className={`font-extrabold capitalize ${isSuperAdmin ? "text-amber-600 font-black" : "text-[#0B1E36]"}`}>
                {isSuperAdmin ? "Super Admin" : (currentAdmin?.role || "Administrator").replace("_", " ")}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Server-Verified Session" />
            </div>

            {/* Administrator Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer"
                aria-label="Open user profile menu"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFC72C] to-[#E0A708] text-[#0B1E36] font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {currentAdmin?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {isSuperAdmin
                      ? "Super Admin"
                      : currentAdmin?.role === "cert_manager" || currentAdmin?.role === "admin"
                      ? "Admin"
                      : currentAdmin?.role === "support_agent" || currentAdmin?.role === "support"
                      ? "Support Agent"
                      : "Read-Only"}
                  </span>
                </div>
                <FaChevronDown className="text-[10px] text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in text-xs">
                  <div className="p-3 border-b border-slate-100">
                    <div className="font-bold text-slate-900 text-sm">{currentAdmin?.name}</div>
                    <div className="text-slate-400 text-[11px] font-mono truncate">{currentAdmin?.email}</div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/admin/access"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0B1E36] rounded-xl transition"
                    >
                      <FaUserShield className="text-slate-400" />
                      <span>Admin Personnel &amp; RBAC</span>
                    </Link>
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0B1E36] rounded-xl transition"
                    >
                      <FaExternalLinkAlt className="text-slate-400 text-xs" />
                      <span>Open Learner Website</span>
                    </a>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition cursor-pointer"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
