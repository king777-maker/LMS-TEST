import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaUndo,
  FaTimes,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaChevronRight
} from "react-icons/fa";
import {
  GLOBAL_CERTIFICATIONS,
  CERTIFICATIONS_BY_ISO,
  TOTAL_COUNTRIES,
  TOTAL_CERTIFICATIONS
} from "../../data/globalCertificationsData";
import { WORLD_MAP_FEATURES } from "../../data/worldMapFeatures";

// Top featured hubs for quick filter toolbar pills
const TOP_HUBS = [
  { name: "India", count: "5,000+", iso: "in" },
  { name: "Nigeria", count: "2,000+", iso: "ng" },
  { name: "Saudi Arabia", count: "1,000+", iso: "sa" },
  { name: "Philippines", count: "1,000+", iso: "ph" },
  { name: "United Arab Emirates", count: "800+", iso: "ae" },
  { name: "United States", count: "800+", iso: "us" },
  { name: "United Kingdom", count: "750+", iso: "gb" },
  { name: "Canada", count: "300+", iso: "ca" }
];

// Base SVG ViewBox dimensions from verified geometry
const SVG_VIEWBOX = {
  minX: 30.767,
  minY: 241.591,
  width: 784.077,
  height: 458.627
};

export default function GlobalWorldMap() {
  const [activeCountry, setActiveCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const searchInputRef = useRef(null);

  // Tooltip & Popover dynamic screen coordinates
  const [tooltipPos, setTooltipPos] = useState(null);
  const [popoverPos, setPopoverPos] = useState(null);

  // Active display country for hover tooltip (only visible on hover, avoiding duplicate overlay when popover is active)
  const displayCountry = hoveredCountry;

  // Filter countries for search dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return GLOBAL_CERTIFICATIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase() === q
    ).slice(0, 8);
  }, [searchQuery]);

  // Timers for flicker-free hover
  const hoverIntentTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Dynamic smart positioning calculation (anchored to pin with edge clamping & boundary flip)
  const calculatePosition = useCallback((target, isPopover = false) => {
    if (!target || !containerRef.current) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pinEl = target.iso ? document.getElementById(`pin-${target.iso}`) : null;

    let pinX = 0;
    let pinY = 0;

    if (pinEl) {
      const pinRect = pinEl.getBoundingClientRect();
      pinX = pinRect.left - containerRect.left + pinRect.width / 2;
      pinY = pinRect.top - containerRect.top + pinRect.height / 2;
    } else if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const relX = (target.cx - SVG_VIEWBOX.minX) / SVG_VIEWBOX.width;
      const relY = (target.cy - SVG_VIEWBOX.minY) / SVG_VIEWBOX.height;
      pinX = svgRect.left - containerRect.left + relX * svgRect.width;
      pinY = svgRect.top - containerRect.top + relY * svgRect.height;
    } else {
      return null;
    }

    const cardWidth = isPopover ? 310 : 260;
    const halfWidth = cardWidth / 2;
    const sideMargin = halfWidth + 14;

    const clampedX = Math.min(Math.max(pinX, sideMargin), containerRect.width - sideMargin);
    const arrowOffset = Math.max(-halfWidth + 24, Math.min(pinX - clampedX, halfWidth - 24));

    const thresholdTop = isPopover ? 220 : 160;
    const isNearTop = pinY < thresholdTop;

    return {
      x: clampedX,
      y: pinY,
      placement: isNearTop ? "bottom" : "top",
      arrowOffset,
    };
  }, []);

  // Hover entry handler
  const handleMouseEnter = useCallback(
    (country) => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
      if (!country || activeCountry?.iso === country.iso) return;

      if (hoveredCountry) {
        if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
        setHoveredCountry(country);
        const pos = calculatePosition(country, false);
        if (pos) setTooltipPos(pos);
        return;
      }

      if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
      hoverIntentTimerRef.current = setTimeout(() => {
        setHoveredCountry(country);
        const pos = calculatePosition(country, false);
        if (pos) setTooltipPos(pos);
      }, 100);
    },
    [calculatePosition, hoveredCountry, activeCountry]
  );

  // Leave handler
  const handleMouseLeave = useCallback((countryIso) => {
    if (hoverIntentTimerRef.current) {
      clearTimeout(hoverIntentTimerRef.current);
      hoverIntentTimerRef.current = null;
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCountry((prev) => (countryIso && prev?.iso !== countryIso ? prev : null));
    }, 120);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  // Update hover tooltip position on zoom, pan, or resize
  useEffect(() => {
    if (hoveredCountry) {
      const pos = calculatePosition(hoveredCountry, false);
      if (pos) setTooltipPos(pos);
    } else {
      setTooltipPos(null);
    }
  }, [hoveredCountry, calculatePosition, zoom, pan]);

  // Update click popover position on zoom, pan, or resize
  useEffect(() => {
    if (activeCountry) {
      const pos = calculatePosition(activeCountry, true);
      if (pos) setPopoverPos(pos);
    } else {
      setPopoverPos(null);
    }
  }, [activeCountry, calculatePosition, zoom, pan]);

  // Zoom In
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.4).toFixed(2)), 3.5));
  };

  // Zoom Out
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.4).toFixed(2)), 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // Reset Zoom & Pan
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveCountry(null);
  };

  // Pan dragging via pointer events
  const handlePointerDown = (e) => {
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a") || e.target.closest('[role="dialog"]')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const maxPanX = (zoom - 1) * 360;
    const maxPanY = (zoom - 1) * 210;

    const newX = Math.min(Math.max(panStartRef.current.x + dx, -maxPanX), maxPanX);
    const newY = Math.min(Math.max(panStartRef.current.y + dy, -maxPanY), maxPanY);

    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Select a country (from search, quick pill, or pin click)
  const handleSelectCountry = (country) => {
    setActiveCountry(country);
    setHoveredCountry(null);
    setSearchQuery("");
    setIsSearchOpen(false);

    // Smoothly focus on country coordinates
    const cx0 = SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2;
    const cy0 = SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2;

    const targetZoom = 2.4;
    const dx = (cx0 - country.cx) * 1.15;
    const dy = (cy0 - country.cy) * 1.15;

    setZoom(targetZoom);
    setPan({ x: dx, y: dy });
  };

  // Close popover / modals on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveCountry(null);
        setHoveredCountry(null);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="geographic-dashboard" className="w-full h-full flex-1 flex flex-col bg-white px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 overflow-hidden">
      
      {/* 1. COMPACT TOOLBAR & HEADER (Clean, single-row height, zero-waste) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 mb-2 shrink-0">
        
        {/* Title, Badges & Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
            <h1 className="text-lg sm:text-xl font-black text-[#121C46] tracking-tight leading-none">
              Our Global Reach
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748B] font-medium border-l border-slate-200 pl-3">
            <span className="font-bold text-[#2563EB]">93 Nations</span>
            <span>•</span>
            <span className="font-bold text-[#121C46]">27,200+ Certifications</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <FaCheckCircle className="text-[10px]" /> 100% Verifiable
            </span>
          </div>
        </div>

        {/* Quick Hub Filter Pills & Search */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 lg:pb-0 scrollbar-none">
          {/* Top Hub Quick Pills */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            <span className="text-[#64748B] font-bold uppercase tracking-wider text-[10px] mr-1 hidden xl:inline">
              Top Hubs:
            </span>
            {TOP_HUBS.slice(0, 6).map((hub) => (
              <button
                key={hub.iso}
                type="button"
                onClick={() => {
                  const target = CERTIFICATIONS_BY_ISO[hub.iso];
                  if (target) handleSelectCountry(target);
                }}
                className={`shrink-0 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all border text-xs ${
                  activeCountry?.iso === hub.iso
                    ? "bg-[#121C46] text-[#FFDB58] border-[#121C46] shadow-xs font-semibold"
                    : "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                {hub.name} <span className="text-[10px] font-bold opacity-80">({hub.count})</span>
              </button>
            ))}
          </div>

          {/* Search Input with Autocomplete */}
          <div className="relative w-44 sm:w-56 md:w-64 shrink-0">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-8 pr-7 py-1 text-xs sm:text-[13px] bg-white border border-[#CBD5E1] rounded-lg text-[#121C46] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#121C46] focus:border-transparent transition-all shadow-2xs"
              />
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[11px] pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-0.5"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-xl max-h-56 overflow-y-auto z-40">
                {searchResults.map((c) => (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] flex items-center justify-between border-b border-[#F1F5F9] last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center uppercase">
                        {c.iso}
                      </span>
                      <span className="font-semibold text-[#121C46]">{c.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
                      {c.formattedCount}+ certificates Issued
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KEYFRAME ANIMATIONS FOR TOOLTIP & MOTION */}
      <style>{`
        @keyframes premiumTooltipInTop {
          0% {
            opacity: 0;
            transform: translate(-50%, calc(-100% + 6px));
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -100%);
          }
        }
        @keyframes premiumTooltipInBottom {
          0% {
            opacity: 0;
            transform: translate(-50%, -6px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-premium-tooltip-top {
          animation: premiumTooltipInTop 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-premium-tooltip-bottom {
          animation: premiumTooltipInBottom 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-premium-tooltip-top,
          .animate-premium-tooltip-bottom {
            animation: none !important;
            opacity: 1 !important;
          }
          .pin-group,
          .pin-halo,
          .pin-circle,
          .pin-core {
            transition: none !important;
          }
        }
      `}</style>

      {/* 2. FULL-WIDTH STRETCHED MAP FRAME (Occupies remaining screen height, zero scroll) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative flex-1 w-full min-h-0 rounded-2xl bg-white border border-[#CBD5E1] shadow-lg overflow-hidden select-none flex items-center justify-center transition-colors ${
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
      >
        {/* FLOATING ZOOM & RESET CONTROLS (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1.2 rounded-xl border border-[#CBD5E1] shadow-md">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white hover:bg-[#F1F5F9] text-[#121C46] border border-[#E2E8F0] transition-colors shadow-2xs font-bold"
          >
            <FaPlus className="text-[11px]" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            title="Zoom Out"
            aria-label="Zoom Out"
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-colors shadow-2xs font-bold ${
              zoom <= 1
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white hover:bg-[#F1F5F9] text-[#121C46] border-[#E2E8F0]"
            }`}
          >
            <FaMinus className="text-[11px]" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Map View"
            aria-label="Reset Map View"
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white hover:bg-[#F1F5F9] text-[#121C46] border border-[#E2E8F0] transition-colors shadow-2xs font-bold"
          >
            <FaUndo className="text-[11px]" />
          </button>
          <div className="text-[9.5px] font-bold text-center text-[#64748B] pt-0.5 border-t border-slate-100">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* HOVER TOOLTIP POPUP OVERLAY */}
        {!activeCountry && displayCountry && tooltipPos && (
          <div
            role="tooltip"
            aria-hidden="false"
            onMouseEnter={() => {
              if (leaveTimerRef.current) {
                clearTimeout(leaveTimerRef.current);
                leaveTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              if (displayCountry) handleMouseLeave(displayCountry.iso);
            }}
            className={`absolute z-30 pointer-events-auto bg-[#111C3E] text-white p-3.5 sm:p-4 rounded-2xl border border-[#31436A] shadow-[0_12px_32px_rgba(15,23,42,0.25)] ${
              tooltipPos.placement === "top"
                ? "animate-premium-tooltip-top"
                : "animate-premium-tooltip-bottom"
            }`}
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y + (tooltipPos.placement === "top" ? -14 : 14)}px`,
              transform: tooltipPos.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
              width: "250px",
              maxWidth: "calc(100vw - 32px)"
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#31436A]/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <FaMapMarkerAlt className="text-[#FBBF24] text-xs shrink-0" />
                <span className="font-bold text-sm text-white truncate tracking-wide">
                  {displayCountry.name}
                </span>
              </div>
              <span className="bg-white/10 text-slate-300 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                {displayCountry.iso}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Certifications
              </div>
              <div className="text-2xl font-black text-[#FBBF24] leading-tight flex items-baseline gap-1.5">
                {displayCountry.formattedCount}+
                <span className="text-[11px] font-semibold text-slate-300">certificates Issued</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-[#31436A]/60 text-teal-400 text-[11px] font-medium">
              <FaCheckCircle className="text-teal-400 shrink-0 text-xs" />
              <span>Verified Certification Records</span>
            </div>

            {/* Smart Arrow Caret */}
            <div
              className={`absolute w-2.5 h-2.5 bg-[#111C3E] rotate-45 pointer-events-none ${
                tooltipPos.placement === "top"
                  ? "border-r border-b border-[#31436A] -bottom-[6px]"
                  : "border-l border-t border-[#31436A] -top-[6px]"
              }`}
              style={{
                left: `calc(50% + ${tooltipPos.arrowOffset}px)`,
                transform: "translateX(-50%) rotate(45deg)"
              }}
            />
          </div>
        )}

        {/* CLICK POPOVER (DESKTOP & TABLET): Compact Floating Details Card Anchored to Pin */}
        {activeCountry && popoverPos && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="popover-country-name"
            className={`hidden md:block absolute z-30 pointer-events-auto bg-[#0F1738] text-white p-4.5 rounded-2xl border border-[#31436A] shadow-[0_16px_40px_rgba(15,23,42,0.35)] ${
              popoverPos.placement === "top"
                ? "animate-premium-tooltip-top"
                : "animate-premium-tooltip-bottom"
            }`}
            style={{
              left: `${popoverPos.x}px`,
              top: `${popoverPos.y + (popoverPos.placement === "top" ? -16 : 16)}px`,
              transform: popoverPos.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
              width: "300px",
              maxWidth: "calc(100vw - 32px)"
            }}
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <FaMapMarkerAlt className="text-[#FBBF24] text-sm shrink-0" />
                <div>
                  <h3 id="popover-country-name" className="text-base font-black text-white leading-tight truncate">
                    {activeCountry.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">
                    Code: {activeCountry.iso} • Rank #{activeCountry.no || 1}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCountry(null);
                }}
                title="Close details"
                aria-label="Close country details"
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 ml-1"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Total Certifications Body */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-2.5">
              <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Total Certifications
              </div>
              <div className="text-2xl font-black text-[#FBBF24] leading-tight flex items-baseline gap-1 mt-0.5">
                {activeCountry.formattedCount}+
                <span className="text-[11px] font-semibold text-slate-300">certificates Issued</span>
              </div>
              <div className="text-[10px] text-teal-400 font-medium flex items-center gap-1 mt-1.5">
                <FaCheckCircle className="text-xs shrink-0" />
                <span>100% Online Verifiable Academic Credentials</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5 pt-0.5">
              <Link
                to="/verify-certificate"
                className="w-full py-1.5 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <FaShieldAlt className="text-xs" />
                <span>Verify Certificate Registry</span>
              </Link>
              <Link
                to="/courses"
                className="w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Explore Courses</span>
                <FaChevronRight className="text-[9px]" />
              </Link>
            </div>

            {/* Popover Arrow Caret */}
            <div
              className={`absolute w-3 h-3 bg-[#0F1738] rotate-45 pointer-events-none ${
                popoverPos.placement === "top"
                  ? "border-r border-b border-[#31436A] -bottom-[7px]"
                  : "border-l border-t border-[#31436A] -top-[7px]"
              }`}
              style={{
                left: `calc(50% + ${popoverPos.arrowOffset}px)`,
                transform: "translateX(-50%) rotate(45deg)"
              }}
            />
          </div>
        )}

        {/* SVG WORLD MAP (Responsive & Full-Width) */}
        <div className="w-full h-full p-1 sm:p-2 flex items-center justify-center overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`${SVG_VIEWBOX.minX} ${SVG_VIEWBOX.minY} ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
            className="w-full h-full object-contain transition-transform duration-75 ease-out"
            preserveAspectRatio="xMidYMid meet"
            style={{
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.03))"
            }}
            onClick={(e) => {
              if (e.target.tagName === "svg" || e.target.id === "country-boundaries") {
                setActiveCountry(null);
              }
            }}
          >
            {/* Scalable & Pannable Group */}
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
              style={{
                transformOrigin: `${SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2}px ${
                  SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2
                }px`,
                transition: isDragging ? "none" : "transform 0.25s ease-out"
              }}
            >
              {/* 1. COUNTRY BOUNDARIES LAYER */}
              <g id="country-boundaries">
                {WORLD_MAP_FEATURES.map((feature) => {
                  const certData = CERTIFICATIONS_BY_ISO[feature.id];
                  const isHighlighted = !!certData;
                  const isSelected = activeCountry?.iso === feature.id;
                  const isHovered = hoveredCountry?.iso === feature.id;

                  let fillColor = isHighlighted ? "#2563EB" : "#E2E8F0";
                  if (isHighlighted) {
                    if (isSelected) {
                      fillColor = "#1E40AF";
                    } else if (isHovered) {
                      fillColor = "#1D4ED8";
                    }
                  }

                  const strokeColor = isHighlighted ? "#FFFFFF" : "#CBD5E1";
                  const strokeWidth = isSelected || isHovered ? 0.85 : 0.45;

                  const handleEnter = () => {
                    if (isHighlighted && certData) {
                      handleMouseEnter(certData);
                    }
                  };
                  const handleLeave = () => {
                    if (isHighlighted) {
                      handleMouseLeave(feature.id);
                    }
                  };
                  const handleClick = (e) => {
                    e.stopPropagation();
                    if (isHighlighted && certData) {
                      handleSelectCountry(certData);
                    }
                  };

                  if (feature.type === "group") {
                    return (
                      <g
                        key={feature.id}
                        id={feature.id}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        className={isHighlighted ? "cursor-pointer" : "cursor-default"}
                        style={{
                          transition: "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease"
                        }}
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                        onClick={handleClick}
                      >
                        {feature.paths.map((p, idx) => (
                          <path key={idx} d={p.d} />
                        ))}
                      </g>
                    );
                  }

                  return (
                    <path
                      key={feature.id}
                      id={feature.id}
                      d={feature.d}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className={isHighlighted ? "cursor-pointer" : "cursor-default"}
                      style={{
                        transition: "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease"
                      }}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
                      onClick={handleClick}
                    />
                  );
                })}
              </g>

              {/* 2. PINS LAYER (ALL 93 COUNTRIES INDIVIDUAL — NO CLUSTERS, NO NUMBERING) */}
              <g id="country-pins">
                {GLOBAL_CERTIFICATIONS.map((country) => {
                  const isSelected = activeCountry?.iso === country.iso;
                  const isHovered = hoveredCountry?.iso === country.iso;
                  const isActive = isSelected || isHovered;

                  return (
                    <g
                      key={country.iso}
                      id={`pin-${country.iso}`}
                      className="cursor-pointer group pin-group focus:outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${country.name}: ${country.formattedCount}+ certificates issued`}
                      onMouseEnter={() => handleMouseEnter(country)}
                      onMouseLeave={() => handleMouseLeave(country.iso)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCountry(country);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectCountry(country);
                        }
                      }}
                      style={{
                        transform: isActive ? "scale(1.2)" : "scale(1)",
                        transformOrigin: `${country.cx}px ${country.cy}px`,
                        transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    >
                      {/* Subtle Yellow Halo on Hover/Active */}
                      <circle
                        cx={country.cx}
                        cy={country.cy}
                        r={isActive ? 8 : 0}
                        fill="#FBBF24"
                        opacity={isActive ? 0.35 : 0}
                        className="pin-halo pointer-events-none"
                        style={{ transition: "r 180ms ease, opacity 180ms ease" }}
                      />

                      {/* Clean Navy Pin Circle with Crisp Stroke (NO NUMBERING) */}
                      <circle
                        cx={country.cx}
                        cy={country.cy}
                        r={isActive ? 4.5 : 3.2}
                        fill="#111C3E"
                        stroke="#FFFFFF"
                        strokeWidth={isActive ? 1.2 : 0.8}
                        className="pin-circle"
                        style={{
                          transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
                          filter: isActive
                            ? "drop-shadow(0 2px 5px rgba(17, 28, 62, 0.6))"
                            : "drop-shadow(0 1px 2px rgba(17, 28, 62, 0.3))"
                        }}
                      />

                      {/* Yellow Gold Center Core */}
                      <circle
                        cx={country.cx}
                        cy={country.cy}
                        r={isActive ? 2.0 : 1.3}
                        fill="#FBBF24"
                        className="pin-core"
                        style={{ transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        </div>

        {/* COMPACT BOTTOM FLOATING LEGEND (Bottom-Left) */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-20 flex flex-wrap items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] shadow-xs text-[10.5px] font-semibold text-[#121C46]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB] border border-white shrink-0" />
            <span>Certified (93 Nations)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#E2E8F0] border border-[#CBD5E1] shrink-0" />
            <span>Emerging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111C3E] border border-[#FFDB58] shrink-0" />
            <span>Location Pin</span>
          </div>
        </div>

        {/* BOTTOM RIGHT HINT */}
        <div className="hidden sm:block absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-[#64748B] font-medium border border-slate-200 shadow-2xs select-none">
          Hover or tap any pin or certified country
        </div>
      </div>

      {/* 3. MOBILE ACCESSIBLE BOTTOM SHEET (< 768px) */}
      {activeCountry && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveCountry(null)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-country-title"
            className="relative z-10 w-full max-w-lg bg-[#0F1738] text-white rounded-t-2xl border-t-2 border-[#FBBF24]/40 p-4.5 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-2.5" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#FBBF24] text-base" />
                <div>
                  <h3 id="mobile-country-title" className="text-base font-black text-white">
                    {activeCountry.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">
                    Country Code: {activeCountry.iso} • Global Rank #{activeCountry.no || 1}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCountry(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="Close"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Certification Count Card */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-2.5">
              <div className="text-[10.5px] font-semibold uppercase text-slate-400">Total Certifications</div>
              <div className="text-2xl font-black text-[#FBBF24] leading-tight mt-0.5">
                {activeCountry.formattedCount}+ <span className="text-[11px] text-slate-300 font-semibold">certificates Issued</span>
              </div>
              <div className="text-[10.5px] text-teal-400 font-medium flex items-center gap-1.5 mt-1.5">
                <FaCheckCircle className="text-xs shrink-0" />
                <span>100% Online Verifiable Academic Credentials</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <Link
                to="/verify-certificate"
                onClick={() => setActiveCountry(null)}
                className="w-full py-2 px-3 rounded-lg bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <FaShieldAlt className="text-xs" />
                <span>Verify Certificate Registry</span>
              </Link>
              <Link
                to="/courses"
                onClick={() => setActiveCountry(null)}
                className="w-full py-1.5 px-3 rounded-lg bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Explore Available Courses</span>
                <FaChevronRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
