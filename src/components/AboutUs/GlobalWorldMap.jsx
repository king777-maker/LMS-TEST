import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaUndo,
  FaTimes,
  FaAward,
  FaGlobeAmericas,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaArrowRight,
  FaShieldAlt,
  FaChevronRight,
  FaInfoCircle
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
  const [hoveredCluster, setHoveredCluster] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);

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

  // Active display country for hover tooltip (only visible on hover, avoiding duplicate overlay when panel or mobile sheet is active)
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

  // Clustering calculation:
  // When zoom < 1.6, group nearby overlapping pins within distance threshold 13 into smart clusters.
  // When zoom >= 1.6, unpack all clusters into individual country pins.
  const pinNodes = useMemo(() => {
    if (zoom >= 1.6) {
      return GLOBAL_CERTIFICATIONS.map((country) => ({
        isCluster: false,
        countries: [country],
        cx: country.cx,
        cy: country.cy,
        iso: country.iso,
        name: country.name,
        count: country.count,
        formattedCount: country.formattedCount,
      }));
    }

    const threshold = 13;
    const result = [];
    const visited = new Set();

    for (let i = 0; i < GLOBAL_CERTIFICATIONS.length; i++) {
      const c = GLOBAL_CERTIFICATIONS[i];
      if (visited.has(c.iso)) continue;

      const clusterMembers = [c];
      visited.add(c.iso);

      for (let j = i + 1; j < GLOBAL_CERTIFICATIONS.length; j++) {
        const other = GLOBAL_CERTIFICATIONS[j];
        if (visited.has(other.iso)) continue;

        const dx = c.cx - other.cx;
        const dy = c.cy - other.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold) {
          clusterMembers.push(other);
          visited.add(other.iso);
        }
      }

      if (clusterMembers.length === 1) {
        result.push({
          isCluster: false,
          countries: clusterMembers,
          cx: c.cx,
          cy: c.cy,
          iso: c.iso,
          name: c.name,
          count: c.count,
          formattedCount: c.formattedCount,
        });
      } else {
        const avgX = clusterMembers.reduce((sum, item) => sum + item.cx, 0) / clusterMembers.length;
        const avgY = clusterMembers.reduce((sum, item) => sum + item.cy, 0) / clusterMembers.length;
        const totalCount = clusterMembers.reduce((sum, item) => sum + item.count, 0);

        result.push({
          isCluster: true,
          id: `cluster-${clusterMembers.map((m) => m.iso).join("-")}`,
          countries: clusterMembers,
          cx: avgX,
          cy: avgY,
          count: clusterMembers.length,
          totalCerts: totalCount,
          formattedTotalCerts: totalCount.toLocaleString(),
        });
      }
    }
    return result;
  }, [zoom]);

  // Timers for flicker-free hover
  const hoverIntentTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Dynamic smart tooltip calculation (anchored to pin or cluster with edge clamping & boundary flip)
  const calculateTooltipPosition = useCallback((target) => {
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

    const tooltipWidth = 260;
    const halfWidth = tooltipWidth / 2;
    const sideMargin = halfWidth + 14;

    const clampedX = Math.min(Math.max(pinX, sideMargin), containerRect.width - sideMargin);
    const arrowOffset = Math.max(-halfWidth + 20, Math.min(pinX - clampedX, halfWidth - 20));

    const distanceToViewportTop = containerRect.top + pinY;
    const isNearTop = pinY < 180 || distanceToViewportTop < 90;

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
      setHoveredCluster(null);
      if (!country || activeCountry?.iso === country.iso) return;

      if (hoveredCountry) {
        if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
        setHoveredCountry(country);
        const pos = calculateTooltipPosition(country);
        if (pos) setTooltipPos(pos);
        return;
      }

      if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
      hoverIntentTimerRef.current = setTimeout(() => {
        setHoveredCountry(country);
        const pos = calculateTooltipPosition(country);
        if (pos) setTooltipPos(pos);
      }, 100);
    },
    [calculateTooltipPosition, hoveredCountry, activeCountry]
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

  // Cluster hover handlers
  const handleClusterEnter = useCallback(
    (cluster) => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
      setHoveredCountry(null);
      setHoveredCluster(cluster);
      const pos = calculateTooltipPosition(cluster);
      if (pos) setTooltipPos(pos);
    },
    [calculateTooltipPosition]
  );

  const handleClusterLeave = useCallback(() => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCluster(null);
    }, 120);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hoverIntentTimerRef.current) clearTimeout(hoverIntentTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  // Update tooltip position on zoom, pan, or resize
  useEffect(() => {
    const target = hoveredCountry || hoveredCluster;
    if (target) {
      const pos = calculateTooltipPosition(target);
      if (pos) setTooltipPos(pos);
    } else {
      setTooltipPos(null);
    }
  }, [hoveredCountry, hoveredCluster, calculateTooltipPosition, zoom, pan]);

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
    setSelectedCluster(null);
  };

  // Pan dragging via pointer events
  const handlePointerDown = (e) => {
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a")) return;
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

  // Select a country (from search, quick pill, map path, or cluster member)
  const handleSelectCountry = (country) => {
    setActiveCountry(country);
    setHoveredCountry(null);
    setHoveredCluster(null);
    setSelectedCluster(null);
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

  // Click on a cluster to unpack it and zoom into its center
  const handleClusterClick = (cluster) => {
    setHoveredCountry(null);
    setHoveredCluster(null);

    const cx0 = SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2;
    const cy0 = SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2;

    const targetZoom = 2.3;
    const dx = (cx0 - cluster.cx) * 1.15;
    const dy = (cy0 - cluster.cy) * 1.15;

    setZoom(targetZoom);
    setPan({ x: dx, y: dy });
    setSelectedCluster(cluster);
  };

  // Close modals/tooltips on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveCountry(null);
        setSelectedCluster(null);
        setHoveredCountry(null);
        setHoveredCluster(null);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="geographic-dashboard" className="w-full bg-[#F8FAFC]/50 py-6 sm:py-8 lg:py-10 border-b border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. CLEAN SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[#121C46] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>Global Certification Directory • 93 Nations</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#121C46] tracking-tight leading-tight">
            Our Global Reach
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-[#475569] leading-relaxed max-w-xl mx-auto">
            Explore our worldwide certification footprint and discover the verified number of certifications issued across 93 countries.
          </p>
        </div>

        {/* 2. COMPACT STATISTICS STRIP (4 Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3.5">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-2xs">
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

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-2xs">
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

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-2xs">
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

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 transition-all hover:border-[#CBD5E1] shadow-2xs">
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

        {/* 3. INTEGRATED TOOLBAR: SEARCH & TOP HUBS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-3">
          
          {/* Quick Hub Filter Pills */}
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
                    : "bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                {hub.name} <span className="text-[11px] font-bold opacity-80">({hub.count})</span>
              </button>
            ))}
          </div>

          {/* Search Input with Autocomplete */}
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

        {/* 4. MAIN GEOGRAPHIC DASHBOARD CARD */}
        <div className="relative w-full rounded-2xl bg-white border border-[#CBD5E1] shadow-lg overflow-hidden select-none">
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* LEFT / MAIN COLUMN: INTERACTIVE WORLD MAP CANVAS */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`lg:col-span-8 xl:col-span-8 2xl:col-span-9 relative bg-white flex items-center justify-center overflow-hidden h-[420px] sm:h-[470px] lg:h-[530px] ${
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
                <div className="text-[9px] font-bold text-center text-[#64748B] pt-0.5 border-t border-slate-100">
                  {Math.round(zoom * 100)}%
                </div>
              </div>

              {/* ACTIVE HOVER TOOLTIP POPUP OVERLAY */}
              {(displayCountry || hoveredCluster) && tooltipPos && (
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
                    if (hoveredCluster) handleClusterLeave();
                  }}
                  className={`absolute z-30 pointer-events-auto bg-[#111C3E] text-white p-[16px] rounded-[16px] border border-[#31436A] shadow-[0_12px_32px_rgba(15,23,42,0.22)] ${
                    tooltipPos.placement === "top"
                      ? "animate-premium-tooltip-top"
                      : "animate-premium-tooltip-bottom"
                  }`}
                  style={{
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y + (tooltipPos.placement === "top" ? -14 : 14)}px`,
                    transform: tooltipPos.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                    width: "260px",
                    maxWidth: "calc(100vw - 32px)"
                  }}
                >
                  {displayCountry ? (
                    <>
                      {/* Country Tooltip Header */}
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#31436A]/60">
                        <div className="flex items-center gap-2 min-w-0">
                          <FaMapMarkerAlt className="text-[#FBBF24] text-xs shrink-0" />
                          <span className="font-bold text-sm text-white truncate tracking-wide">
                            {displayCountry.name}
                          </span>
                        </div>
                        <span className="bg-white/10 text-slate-300 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                          {displayCountry.iso}
                        </span>
                      </div>

                      {/* Tooltip Count */}
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Total Certifications
                        </div>
                        <div className="text-[26px] font-black text-[#FBBF24] leading-tight flex items-baseline gap-1.5">
                          {displayCountry.formattedCount}+
                          <span className="text-xs font-semibold text-slate-300">certificates Issued</span>
                        </div>
                      </div>

                      {/* Tooltip Verification Footer */}
                      <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-[#31436A]/60 text-teal-400 text-[11px] font-medium">
                        <FaCheckCircle className="text-teal-400 shrink-0 text-xs" />
                        <span>Verified Certification Records</span>
                      </div>
                    </>
                  ) : hoveredCluster ? (
                    <>
                      {/* Cluster Tooltip Header */}
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#31436A]/60">
                        <div className="flex items-center gap-2 min-w-0">
                          <FaLayerGroup className="text-[#FBBF24] text-xs shrink-0" />
                          <span className="font-bold text-sm text-white truncate tracking-wide">
                            Regional Hub ({hoveredCluster.count} Nations)
                          </span>
                        </div>
                      </div>

                      {/* Cluster Count */}
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Combined Certifications
                        </div>
                        <div className="text-[24px] font-black text-[#FBBF24] leading-tight flex items-baseline gap-1.5">
                          {hoveredCluster.formattedTotalCerts}+
                          <span className="text-xs font-semibold text-slate-300">certificates Issued</span>
                        </div>
                      </div>

                      {/* Member list preview */}
                      <div className="text-[11px] text-slate-300 pt-1.5 truncate">
                        {hoveredCluster.countries.map((c) => c.name).join(", ")}
                      </div>

                      <div className="text-[10px] text-amber-300/80 pt-1 flex items-center gap-1 font-medium">
                        <span>Click to zoom in and expand pins</span>
                      </div>
                    </>
                  ) : null}

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
                  className="w-full h-full object-contain transition-transform duration-75 ease-out"
                  preserveAspectRatio="xMidYMid meet"
                  style={{
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.03))"
                  }}
                  onClick={(e) => {
                    // Click on map ocean/background clears active selection
                    if (e.target.tagName === "svg" || e.target.id === "country-boundaries") {
                      setActiveCountry(null);
                      setSelectedCluster(null);
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

                    {/* 2. PINS & CLUSTERS LAYER */}
                    <g id="country-pins">
                      {pinNodes.map((node) => {
                        if (node.isCluster) {
                          // Render Cluster Pin
                          const isClusterHovered = hoveredCluster?.id === node.id;
                          const isClusterSelected = selectedCluster?.id === node.id;
                          const isActive = isClusterHovered || isClusterSelected;

                          return (
                            <g
                              key={node.id}
                              id={node.id}
                              className="cursor-pointer group focus:outline-none"
                              tabIndex={0}
                              role="button"
                              aria-label={`Cluster of ${node.count} nations: ${node.countries
                                .map((c) => c.name)
                                .join(", ")}. ${node.formattedTotalCerts}+ certificates issued. Click to zoom in.`}
                              onMouseEnter={() => handleClusterEnter(node)}
                              onMouseLeave={handleClusterLeave}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClusterClick(node);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleClusterClick(node);
                                }
                              }}
                              style={{
                                transform: isActive ? "scale(1.2)" : "scale(1)",
                                transformOrigin: `${node.cx}px ${node.cy}px`,
                                transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)"
                              }}
                            >
                              {/* Cluster Outer Pulse Ring */}
                              <circle
                                cx={node.cx}
                                cy={node.cy}
                                r={isActive ? 11 : 8.5}
                                fill="#FBBF24"
                                opacity={isActive ? 0.35 : 0.22}
                                className="pointer-events-none"
                                style={{ transition: "r 180ms ease, opacity 180ms ease" }}
                              />

                              {/* Cluster Center Circle */}
                              <circle
                                cx={node.cx}
                                cy={node.cy}
                                r={6.5}
                                fill="#111C3E"
                                stroke="#FBBF24"
                                strokeWidth={1.3}
                                style={{
                                  filter: "drop-shadow(0 2px 4px rgba(17, 28, 62, 0.5))"
                                }}
                              />

                              {/* Cluster Count Text */}
                              <text
                                x={node.cx}
                                y={node.cy + 2.5}
                                textAnchor="middle"
                                fontSize="6.5"
                                fontWeight="bold"
                                fill="#FBBF24"
                                className="select-none pointer-events-none"
                              >
                                {node.count}
                              </text>
                            </g>
                          );
                        }

                        // Render Individual Country Pin
                        const country = node.countries[0];
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
                              transform: isActive ? "scale(1.15)" : "scale(1)",
                              transformOrigin: `${country.cx}px ${country.cy}px`,
                              transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)"
                            }}
                          >
                            {/* Halo */}
                            <circle
                              cx={country.cx}
                              cy={country.cy}
                              r={isActive ? 8.5 : 0}
                              fill="#FBBF24"
                              opacity={isActive ? 0.35 : 0}
                              className="pin-halo pointer-events-none"
                              style={{ transition: "r 180ms ease, opacity 180ms ease" }}
                            />

                            {/* Navy Pin Ring */}
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

                            {/* Gold Center */}
                            <circle
                              cx={country.cx}
                              cy={country.cy}
                              r={isActive ? 2.2 : 1.4}
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

              {/* COMPACT BOTTOM FLOATING LEGEND */}
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-20 flex flex-wrap items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CBD5E1] shadow-xs text-[11px] font-semibold text-[#121C46]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#2563EB] border border-white shrink-0" />
                  <span>Certified (93 Nations)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#E2E8F0] border border-[#CBD5E1] shrink-0" />
                  <span>Emerging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#121C46] border border-[#FFDB58] shrink-0" />
                  <span>Pin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#111C3E] text-[#FBBF24] text-[8px] font-bold flex items-center justify-center border border-[#FBBF24] shrink-0">
                    3
                  </span>
                  <span>Cluster</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DOCKED INTELLIGENCE DETAILS PANEL (DESKTOP) */}
            <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 2xl:col-span-3 flex-col bg-[#0F1738] text-white border-l border-[#1E293B] p-5 justify-between min-h-[530px]">
              
              {/* STATE A: A COUNTRY IS SELECTED */}
              {activeCountry ? (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Header: Title, ISO badge, close */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active National Record</span>
                        </div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#FBBF24] text-base shrink-0" />
                          <span>{activeCountry.name}</span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-xs font-mono font-bold uppercase text-amber-300">
                          {activeCountry.iso}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveCountry(null)}
                          title="Close details"
                          aria-label="Close country details"
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Total Certifications Card */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Total Certifications
                      </div>
                      <div className="text-[34px] font-black text-[#FBBF24] leading-none mb-1 flex items-baseline gap-1.5">
                        {activeCountry.formattedCount}+
                        <span className="text-xs font-medium text-slate-300">Issued</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                        <FaCheckCircle className="text-xs shrink-0" />
                        <span>100% Online Verifiable Academic Credentials</span>
                      </div>
                    </div>

                    {/* Regional & National Statistics */}
                    <div className="space-y-2.5 mb-4 text-xs">
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-slate-400">Global Registry Rank</span>
                        <span className="font-bold text-white">Rank #{activeCountry.no} of 93 Nations</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-slate-400">Accredited Standard Modules</span>
                        <span className="font-bold text-white">ISO 9001, 14001, 45001, 27001</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-slate-400">Instant Registry Verification</span>
                        <span className="font-bold text-teal-400">24/7 QR & Key Lookup</span>
                      </div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <Link
                      to="/verify-certificate"
                      className="w-full py-2.5 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <FaShieldAlt className="text-xs" />
                      <span>Verify Certificate Registry</span>
                    </Link>
                    <Link
                      to="/courses"
                      className="w-full py-2 px-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Explore International Courses</span>
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveCountry(null)}
                      className="w-full text-center text-[11px] text-slate-400 hover:text-white pt-1 transition-colors"
                    >
                      ← Return to Global Overview
                    </button>
                  </div>
                </div>
              ) : selectedCluster ? (
                /* STATE B: A REGIONAL CLUSTER IS SELECTED */
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center gap-1.5 mb-1">
                          <FaLayerGroup className="text-xs" />
                          <span>Regional Hub Cluster</span>
                        </div>
                        <h3 className="text-lg font-black text-white">
                          {selectedCluster.count} Clustered Nations
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCluster(null)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 mb-3.5">
                      <div className="text-xs text-slate-400 uppercase font-semibold">Combined Certifications</div>
                      <div className="text-2xl font-black text-[#FBBF24] mt-0.5">
                        {selectedCluster.formattedTotalCerts}+ <span className="text-xs text-slate-300 font-medium">Issued</span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Countries in this cluster:
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                      {selectedCluster.countries.map((c) => (
                        <button
                          key={c.iso}
                          type="button"
                          onClick={() => handleSelectCountry(c)}
                          className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors border border-transparent hover:border-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center uppercase">
                              {c.iso}
                            </span>
                            <span className="text-xs font-semibold text-white">{c.name}</span>
                          </div>
                          <span className="text-[11px] font-bold text-[#FBBF24]">{c.formattedCount}+</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleReset()}
                      className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                    >
                      ← Reset Zoom & Map View
                    </button>
                  </div>
                </div>
              ) : (
                /* STATE C: GLOBAL OVERVIEW (DEFAULT) */
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="pb-3 mb-3.5 border-b border-white/10">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400 mb-1">
                        Worldwide Intelligence
                      </div>
                      <h3 className="text-lg font-black text-white">
                        Global Footprint
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Select any country or location pin on the map to inspect regional statistics and verified credentials.
                      </p>
                    </div>

                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Top Certification Hubs</span>
                      <span className="text-[10px] text-slate-400 font-normal">Excel Verified</span>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-none">
                      {TOP_HUBS.map((hub, idx) => (
                        <button
                          key={hub.iso}
                          type="button"
                          onClick={() => {
                            const target = CERTIFICATIONS_BY_ISO[hub.iso];
                            if (target) handleSelectCountry(target);
                          }}
                          className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors border border-transparent hover:border-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 w-4 text-center">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-white">{hub.name}</span>
                          </div>
                          <span className="text-[11px] font-bold text-[#FBBF24]">
                            {hub.count} <span className="text-[10px] text-slate-400 font-normal">certs</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <FaInfoCircle className="text-amber-400 text-xs shrink-0" />
                      <span>Pins in dense regions group into cluster badges at standard zoom.</span>
                    </div>
                    <Link
                      to="/verify-certificate"
                      className="w-full py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <FaShieldAlt className="text-xs" />
                      <span>Verify Certificate Registry</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. MOBILE ACCESSIBLE BOTTOM SHEET (< 1024px) */}
        {activeCountry && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
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
              className="relative z-10 w-full max-w-lg bg-[#0F1738] text-white rounded-t-2xl border-t-2 border-[#FBBF24]/40 p-5 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-3" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#FBBF24] text-base" />
                  <div>
                    <h3 id="mobile-country-title" className="text-lg font-black text-white">
                      {activeCountry.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono uppercase">
                      Country Code: {activeCountry.iso} • Global Rank #{activeCountry.no}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCountry(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                  aria-label="Close"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              {/* Certification Count Card */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3">
                <div className="text-xs font-semibold uppercase text-slate-400">Total Certifications</div>
                <div className="text-3xl font-black text-[#FBBF24] leading-tight mt-0.5">
                  {activeCountry.formattedCount}+ <span className="text-xs text-slate-300 font-semibold">certificates Issued</span>
                </div>
                <div className="text-xs text-teal-400 font-medium flex items-center gap-1.5 mt-2">
                  <FaCheckCircle className="text-xs shrink-0" />
                  <span>100% Online Verifiable Academic Credentials</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/verify-certificate"
                  onClick={() => setActiveCountry(null)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <FaShieldAlt className="text-xs" />
                  <span>Verify Certificate Registry</span>
                </Link>
                <Link
                  to="/courses"
                  onClick={() => setActiveCountry(null)}
                  className="w-full py-2 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Explore Available Courses</span>
                  <FaChevronRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM HINT */}
        <div className="mt-3 text-center text-xs text-[#64748B]">
          Hover or tap any location pin or certified country to view verified certification records. Clusters automatically expand on zoom.
        </div>
      </div>
    </section>
  );
}
