import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaUndo,
  FaTimes,
  FaAward,
  FaGlobeAmericas,
  FaCheckCircle,
  FaMapMarkerAlt
} from "react-icons/fa";
import {
  GLOBAL_CERTIFICATIONS,
  CERTIFICATIONS_BY_ISO,
  TOTAL_COUNTRIES,
  TOTAL_CERTIFICATIONS
} from "../../data/globalCertificationsData";
import { WORLD_MAP_FEATURES } from "../../data/worldMapFeatures";

// Top featured hubs for quick filter pills
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

// Base SVG ViewBox dimensions
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

  // Tooltip dynamic screen coordinates
  const [tooltipPos, setTooltipPos] = useState(null);

  // Active display country
  const displayCountry = activeCountry || hoveredCountry;

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

  // Hover-intent and leave timer refs to ensure smooth, flicker-free transitions
  const hoverIntentTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Dynamic smart tooltip calculation (anchored to pin with edge clamping & boundary flip)
  const calculateTooltipPosition = useCallback((country) => {
    if (!country || !containerRef.current) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pinEl = document.getElementById(`pin-${country.iso}`);

    let pinX = 0;
    let pinY = 0;

    if (pinEl) {
      const pinRect = pinEl.getBoundingClientRect();
      pinX = pinRect.left - containerRect.left + pinRect.width / 2;
      pinY = pinRect.top - containerRect.top + pinRect.height / 2;
    } else if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const relX = (country.cx - SVG_VIEWBOX.minX) / SVG_VIEWBOX.width;
      const relY = (country.cy - SVG_VIEWBOX.minY) / SVG_VIEWBOX.height;
      pinX = svgRect.left - containerRect.left + relX * svgRect.width;
      pinY = svgRect.top - containerRect.top + relY * svgRect.height;
    } else {
      return null;
    }

    const tooltipWidth = 256;
    const halfWidth = tooltipWidth / 2;
    const sideMargin = halfWidth + 14; // 142px

    // Clamped X within container bounds so tooltip never overflows left/right
    const clampedX = Math.min(Math.max(pinX, sideMargin), containerRect.width - sideMargin);

    // Arrow offset points precisely at pin center even if tooltip is clamped near map edge
    const arrowOffset = Math.max(-halfWidth + 20, Math.min(pinX - clampedX, halfWidth - 20));

    // Vertical placement: prefer above the pin (14px gap)
    // Flip below if pin is near container top (< 185px) or near viewport top (< 95px, avoiding navbar)
    const distanceToViewportTop = containerRect.top + pinY;
    const isNearTop = pinY < 185 || distanceToViewportTop < 95;

    return {
      x: clampedX,
      y: pinY,
      placement: isNearTop ? "bottom" : "top",
      arrowOffset,
    };
  }, []);

  // Hover-intent entry handler (120ms debounce to prevent skittering jitter)
  const handleMouseEnter = useCallback(
    (country) => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
      if (!country) return;

      // Fast-path switch if tooltip is already active or open
      if (hoveredCountry || activeCountry) {
        if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
        setHoveredCountry(country);
        const pos = calculateTooltipPosition(country);
        if (pos) setTooltipPos(pos);
        return;
      }

      // 120ms hover intent delay
      if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
      hoverIntentTimerRef.current = setTimeout(() => {
        setHoveredCountry(country);
        const pos = calculateTooltipPosition(country);
        if (pos) setTooltipPos(pos);
      }, 120);
    },
    [calculateTooltipPosition, hoveredCountry, activeCountry]
  );

  // Leave handler with 120ms grace period so moving between pin and tooltip is smooth
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

  // Keep tooltip updated during select, zoom, pan, or window resize
  useEffect(() => {
    if (displayCountry) {
      const pos = calculateTooltipPosition(displayCountry);
      if (pos) setTooltipPos(pos);
    } else {
      setTooltipPos(null);
    }
  }, [displayCountry, calculateTooltipPosition, zoom, pan]);

  useEffect(() => {
    const handleResize = () => {
      if (displayCountry) {
        const pos = calculateTooltipPosition(displayCountry);
        if (pos) setTooltipPos(pos);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [displayCountry, calculateTooltipPosition]);

  // Handle Zoom In
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3.5));
  };

  // Handle Zoom Out
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
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
    if (e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const maxPanX = (zoom - 1) * 350;
    const maxPanY = (zoom - 1) * 200;

    const newX = Math.min(Math.max(panStartRef.current.x + dx, -maxPanX), maxPanX);
    const newY = Math.min(Math.max(panStartRef.current.y + dy, -maxPanY), maxPanY);

    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Select a country from search or quick pill
  const handleSelectCountry = (country) => {
    setActiveCountry(country);
    setSearchQuery("");
    setIsSearchOpen(false);

    // Smoothly focus on country
    const cx0 = SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2;
    const cy0 = SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2;

    const targetZoom = 2.2;
    const dx = (cx0 - country.cx) * 1.1;
    const dy = (cy0 - country.cy) * 1.1;

    setZoom(targetZoom);
    setPan({ x: dx, y: dy });
  };

  // Close tooltip or dropdown on Escape key
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
    <section className="w-full bg-white py-5 sm:py-6 lg:py-7 border-b border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[#121C46] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>Interactive World Map</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#121C46] tracking-tight leading-tight">
            Our Global Reach
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-[#475569] leading-relaxed max-w-xl mx-auto">
            Explore our worldwide certification footprint and discover the number of certifications issued across different countries.
          </p>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#121C46] text-[#FFDB58] flex items-center justify-center text-sm sm:text-base shrink-0">
              <FaGlobeAmericas />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#121C46] leading-none">
                {TOTAL_COUNTRIES}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] mt-0.5">
                Active Countries
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-sm sm:text-base shrink-0">
              <FaAward />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#121C46] leading-none">
                {TOTAL_CERTIFICATIONS.toLocaleString()}+
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] mt-0.5">
                Certifications Issued
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm sm:text-base shrink-0">
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#121C46] leading-none">
                100%
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] mt-0.5">
                Verifiable Credentials
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center text-sm sm:text-base shrink-0">
              <FaMapMarkerAlt />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-[#121C46] leading-none">
                93
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] mt-0.5">
                Interactive Pin Hubs
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & QUICK HUBS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-2.5 sm:mb-3">
          
          {/* Quick Hub Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs w-full md:w-auto">
            <span className="text-[#64748B] font-bold uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1 shrink-0 text-[11px]">
              Top Hubs:
            </span>
            {TOP_HUBS.map((hub) => (
              <button
                key={hub.iso}
                type="button"
                onClick={() => {
                  const target = CERTIFICATIONS_BY_ISO[hub.iso];
                  if (target) handleSelectCountry(target);
                }}
                className={`shrink-0 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all border text-xs ${
                  activeCountry?.iso === hub.iso
                    ? "bg-[#121C46] text-[#FFDB58] border-[#121C46] shadow-sm font-semibold"
                    : "bg-[#F1F5F9] text-[#334155] border-[#E2E8F0] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                }`}
              >
                {hub.name} <span className="text-[11px] font-bold opacity-80">({hub.count})</span>
              </button>
            ))}
          </div>

          {/* Search Input with dropdown */}
          <div className="relative w-full md:w-80 shrink-0">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country (e.g. India, UAE, UK)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#121C46] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#121C46] focus:border-transparent transition-all shadow-2xs"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-0.5"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-lg shadow-xl max-h-60 overflow-y-auto z-40">
                {searchResults.map((c) => (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className="w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-[#F8FAFC] flex items-center justify-between border-b border-[#F1F5F9] last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center uppercase">
                        {c.iso}
                      </span>
                      <span className="font-semibold text-[#121C46]">{c.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {c.formattedCount}+ certificates Issued
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KEYFRAME ANIMATIONS FOR PREMIUM TOOLTIP & PREFERS-REDUCED-MOTION */}
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

        {/* MAP CONTAINER */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-full rounded-2xl bg-white border border-[#CBD5E1] shadow-lg overflow-hidden select-none transition-colors h-[400px] sm:h-[440px] lg:h-[460px] max-h-[55vh] flex items-center justify-center ${
            zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
        >
          {/* FLOATING ZOOM & RESET CONTROLS */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-[#CBD5E1] shadow-md">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-[#F1F5F9] text-[#121C46] border border-[#E2E8F0] transition-colors shadow-2xs font-bold"
            >
              <FaPlus className="text-[11px]" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="Zoom Out"
              aria-label="Zoom Out"
              className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors shadow-2xs font-bold ${
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
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-[#F1F5F9] text-[#121C46] border border-[#E2E8F0] transition-colors shadow-2xs font-bold"
            >
              <FaUndo className="text-[11px]" />
            </button>
          </div>

          {/* ACTIVE TOOLTIP POPUP OVERLAY (Soft Navy #111C3E, #31436A border, 30px #FBBF24 count) */}
          {displayCountry && tooltipPos && (
            <div
              role="tooltip"
              aria-hidden="false"
              onMouseEnter={() => {
                if (leaveTimerRef.current) {
                  clearTimeout(leaveTimerRef.current);
                  leaveTimerRef.current = null;
                }
              }}
              onMouseLeave={() => handleMouseLeave(displayCountry.iso)}
              className={`absolute z-30 pointer-events-auto bg-[#111C3E] text-white p-[18px] rounded-[16px] border border-[#31436A] shadow-[0_12px_32px_rgba(15,23,42,0.18)] ${
                tooltipPos.placement === "top"
                  ? "animate-premium-tooltip-top"
                  : "animate-premium-tooltip-bottom"
              }`}
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y + (tooltipPos.placement === "top" ? -14 : 14)}px`,
                transform: tooltipPos.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                width: "256px",
                maxWidth: "calc(100vw - 32px)"
              }}
            >
              {/* Header: Location icon, Country name, subtle ISO code badge */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#31436A]/60">
                <div className="flex items-center gap-2 min-w-0">
                  <FaMapMarkerAlt className="text-[#FBBF24] text-xs shrink-0" />
                  <span className="font-bold text-sm text-white truncate tracking-wide">
                    {displayCountry.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-white/10 text-slate-300 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {displayCountry.iso}
                  </span>
                  {activeCountry && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCountry(null);
                      }}
                      title="Close"
                      aria-label="Close tooltip"
                      className="text-slate-400 hover:text-white p-0.5 rounded transition-colors ml-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body: Total Certifications label and 30px #FBBF24 count */}
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Certifications
                </div>
                <div className="text-[28px] sm:text-[30px] font-black text-[#FBBF24] leading-tight flex items-baseline gap-1.5">
                  {displayCountry.formattedCount}+
                  <span className="text-xs font-semibold text-slate-300">certificates Issued</span>
                </div>
              </div>

              {/* Footer: Small teal verification indicator */}
              <div className="flex items-center gap-1.5 pt-2.5 mt-2.5 border-t border-[#31436A]/60 text-teal-400 text-[11px] font-medium">
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

          {/* SVG WORLD MAP */}
          <div className="w-full h-full p-2 sm:p-3 flex items-center justify-center overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={`${SVG_VIEWBOX.minX} ${SVG_VIEWBOX.minY} ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
              className="w-full h-full max-h-[380px] sm:max-h-[420px] lg:max-h-[440px] object-contain transition-transform duration-75 ease-out"
              preserveAspectRatio="xMidYMid meet"
              style={{
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.03))"
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

                    // Fill color based on user specification:
                    // - Countries with certification data: Royal Blue #2563EB
                    // - Countries without reported data: Light Gray #E2E8F0
                    // - Country hover color: Darker Royal Blue #1D4ED8
                    // - Selected country color: Deep Blue #1E40AF
                    let fillColor = isHighlighted ? "#2563EB" : "#E2E8F0";
                    if (isHighlighted) {
                      if (isSelected) {
                        fillColor = "#1E40AF";
                      } else if (isHovered) {
                        fillColor = "#1D4ED8";
                      }
                    }

                    // Country borders: Subtle white or light-gray strokes
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
                        setActiveCountry(certData);
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
                            transition: "fill 200ms ease, stroke 200ms ease, stroke-width 200ms ease"
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
                          transition: "fill 200ms ease, stroke 200ms ease, stroke-width 200ms ease"
                        }}
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                        onClick={handleClick}
                      />
                    );
                  })}
                </g>

                {/* 2. PINS LAYER (Navy pins with gold center, 1.15 scale & subtle yellow halo on hover) */}
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
                          setActiveCountry(country);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveCountry(country);
                          }
                        }}
                        style={{
                          transform: isActive ? "scale(1.15)" : "scale(1)",
                          transformOrigin: `${country.cx}px ${country.cy}px`,
                          transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                      >
                        {/* Subtle yellow halo (only visible on active/hover, no continuous pinging) */}
                        <circle
                          cx={country.cx}
                          cy={country.cy}
                          r={isActive ? 8.5 : 0}
                          fill="#FBBF24"
                          opacity={isActive ? 0.35 : 0}
                          className="pin-halo pointer-events-none"
                          style={{
                            transition: "r 180ms ease, opacity 180ms ease"
                          }}
                        />

                        {/* Navy Blue Outer Pin Ring */}
                        <circle
                          cx={country.cx}
                          cy={country.cy}
                          r={isActive ? 4.8 : 3.5}
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

                        {/* Yellow / Gold Center Core */}
                        <circle
                          cx={country.cx}
                          cy={country.cy}
                          r={isActive ? 2.2 : 1.4}
                          fill="#FBBF24"
                          className="pin-core"
                          style={{
                            transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                        />
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>

          {/* COMPACT BOTTOM LEGEND */}
          <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-20 flex flex-wrap items-center gap-2 sm:gap-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CBD5E1] shadow-xs text-[11px] font-semibold text-[#121C46]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2563EB] border border-white shrink-0" />
              <span>Certified Footprint (93 Countries)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#E2E8F0] border border-[#CBD5E1] shrink-0" />
              <span>Emerging Regions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#121C46] border border-[#FFDB58] shrink-0" />
              <span>Active Pin (Hover to View)</span>
            </div>
          </div>
        </div>

        {/* BOTTOM HINT */}
        <div className="mt-2 text-center text-[11px] text-[#64748B]">
          Hover or tap any location pin or certified country to view verified certification records. Use zoom controls to explore dense regions.
        </div>
      </div>
    </section>
  );
}
