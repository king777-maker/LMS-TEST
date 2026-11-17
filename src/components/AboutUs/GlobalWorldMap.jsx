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
  { name: "India", count: "5,000", iso: "in" },
  { name: "Nigeria", count: "2,000", iso: "ng" },
  { name: "Saudi Arabia", count: "1,000", iso: "sa" },
  { name: "Philippines", count: "1,000", iso: "ph" },
  { name: "United Arab Emirates", count: "800", iso: "ae" },
  { name: "United States", count: "800", iso: "us" },
  { name: "United Kingdom", count: "750", iso: "gb" },
  { name: "Canada", count: "300", iso: "ca" }
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

  // Dynamic tooltip calculation (anchored to pin's live position or SVG coordinates)
  const calculateTooltipPosition = useCallback((country) => {
    if (!country || !containerRef.current) return null;
    const pinEl = document.getElementById(`pin-${country.iso}`);
    const containerRect = containerRef.current.getBoundingClientRect();

    if (pinEl) {
      const pinRect = pinEl.getBoundingClientRect();
      const x = pinRect.left - containerRect.left + pinRect.width / 2;
      const y = pinRect.top - containerRect.top + pinRect.height / 2;
      const isNearTop = y < 165;
      const margin = Math.min(135, containerRect.width / 2);
      const clampedX = Math.min(Math.max(x, margin), containerRect.width - margin);
      return { x: clampedX, y, isNearTop };
    }

    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const relX = (country.cx - SVG_VIEWBOX.minX) / SVG_VIEWBOX.width;
      const relY = (country.cy - SVG_VIEWBOX.minY) / SVG_VIEWBOX.height;
      const x = svgRect.left - containerRect.left + relX * svgRect.width;
      const y = svgRect.top - containerRect.top + relY * svgRect.height;
      const isNearTop = y < 165;
      const margin = Math.min(135, containerRect.width / 2);
      const clampedX = Math.min(Math.max(x, margin), containerRect.width - margin);
      return { x: clampedX, y, isNearTop };
    }
    return null;
  }, []);

  const handleCountryHover = useCallback((country) => {
    if (!country) {
      setHoveredCountry(null);
      return;
    }
    setHoveredCountry(country);
    const pos = calculateTooltipPosition(country);
    if (pos) setTooltipPos(pos);
  }, [calculateTooltipPosition]);

  // Keep tooltip updated during hover, select, zoom, or pan
  useEffect(() => {
    if (displayCountry) {
      const pos = calculateTooltipPosition(displayCountry);
      if (pos) setTooltipPos(pos);
    } else {
      setTooltipPos(null);
    }
  }, [displayCountry, calculateTooltipPosition, zoom, pan]);

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
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[#121C46] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>Interactive World Map</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121C46] tracking-tight leading-tight">
            Our Global Reach
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-[#475569] leading-relaxed">
            Explore our worldwide certification footprint and discover the number of certifications issued across different countries.
          </p>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3.5 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-11 h-11 rounded-lg bg-[#121C46] text-[#FFDB58] flex items-center justify-center text-xl shrink-0">
              <FaGlobeAmericas />
            </div>
            <div>
              <div className="text-2xl font-black text-[#121C46] leading-none">
                {TOTAL_COUNTRIES}
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">
                Active Countries
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3.5 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-11 h-11 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-xl shrink-0">
              <FaAward />
            </div>
            <div>
              <div className="text-2xl font-black text-[#121C46] leading-none">
                {TOTAL_CERTIFICATIONS.toLocaleString()}+
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">
                Certifications Issued
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3.5 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-11 h-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-2xl font-black text-[#121C46] leading-none">
                100%
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">
                Verifiable Credentials
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3.5 transition-all hover:border-[#CBD5E1] shadow-xs">
            <div className="w-11 h-11 rounded-lg bg-[#F97316] text-white flex items-center justify-center text-xl shrink-0">
              <FaMapMarkerAlt />
            </div>
            <div>
              <div className="text-2xl font-black text-[#121C46] leading-none">
                93
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">
                Interactive Pin Hubs
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & QUICK HUBS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
          
          {/* Quick Hub Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none text-xs w-full md:w-auto">
            <span className="text-[#64748B] font-bold uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1 shrink-0">
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
                className={`shrink-0 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all border ${
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
                className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#121C46] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#121C46] focus:border-transparent transition-all shadow-2xs"
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
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-lg shadow-xl max-h-64 overflow-y-auto z-40">
                {searchResults.map((c) => (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className="w-full px-3.5 py-2.5 text-left text-sm hover:bg-[#F8FAFC] flex items-center justify-between border-b border-[#F1F5F9] last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center uppercase">
                        {c.iso}
                      </span>
                      <span className="font-semibold text-[#121C46]">{c.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {c.formattedCount} certs
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-full rounded-2xl bg-white border border-[#CBD5E1] shadow-lg overflow-hidden select-none transition-colors ${
            zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
          style={{ minHeight: "440px" }}
        >
          {/* FLOATING ZOOM & RESET CONTROLS */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-[#CBD5E1] shadow-md">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-[#F1F5F9] text-[#121C46] border border-[#E2E8F0] transition-colors shadow-2xs font-bold"
            >
              <FaPlus className="text-xs" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="Zoom Out"
              aria-label="Zoom Out"
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors shadow-2xs font-bold ${
                zoom <= 1
                  ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  : "bg-white hover:bg-[#F1F5F9] text-[#121C46] border-[#E2E8F0]"
              }`}
            >
              <FaMinus className="text-xs" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset Map View"
              aria-label="Reset Map View"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-[#F1F5F9] text-[#121C46] border border-[#E2E8F0] transition-colors shadow-2xs font-bold"
            >
              <FaUndo className="text-xs" />
            </button>
          </div>

          {/* ACTIVE TOOLTIP POPUP OVERLAY (Dynamically anchored to live pin position) */}
          {displayCountry && tooltipPos && (
            <div
              className={`absolute z-30 ${
                activeCountry ? "pointer-events-auto" : "pointer-events-none"
              } bg-[#121C46] text-white p-3.5 rounded-xl shadow-2xl border border-white/20 transition-all duration-150 animate-fadeIn`}
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y + (tooltipPos.isNearTop ? 14 : -14)}px`,
                transform: tooltipPos.isNearTop ? "translate(-50%, 0)" : "translate(-50%, -100%)",
                minWidth: "190px",
                maxWidth: "260px"
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/15 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#FFDB58] text-[#121C46] text-[10px] font-black flex items-center justify-center uppercase">
                    {displayCountry.iso}
                  </span>
                  <span className="font-extrabold text-sm text-white tracking-wide">
                    {displayCountry.name}
                  </span>
                </div>
                {activeCountry && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCountry(null);
                    }}
                    className="text-slate-300 hover:text-white p-0.5 rounded transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-300">
                  Total Certifications:
                </div>
                <div className="text-2xl font-black text-[#FFDB58] flex items-baseline gap-1">
                  {displayCountry.formattedCount}
                  <span className="text-xs font-semibold text-slate-300">issued</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1 pt-1 border-t border-white/10">
                  <FaCheckCircle className="text-[10px]" />
                  <span>Verified ISO Certification Data</span>
                </div>
              </div>

              {/* Little arrow indicator */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent ${
                  tooltipPos.isNearTop
                    ? "-top-2 border-b-6 border-b-[#121C46]"
                    : "-bottom-2 border-t-6 border-t-[#121C46]"
                }`}
                style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))" }}
              />
            </div>
          )}

          {/* SVG WORLD MAP */}
          <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox={`${SVG_VIEWBOX.minX} ${SVG_VIEWBOX.minY} ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
              className="w-full h-auto max-h-[750px] transition-transform duration-75 ease-out"
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
                        handleCountryHover(certData);
                      }
                    };
                    const handleLeave = () => {
                      if (isHighlighted) {
                        setHoveredCountry((prev) => (prev?.iso === feature.id ? null : prev));
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

                {/* 2. PINS LAYER (Navy pins with yellow center & gentle pulse) */}
                <g id="country-pins">
                  {GLOBAL_CERTIFICATIONS.map((country) => {
                    const isSelected = activeCountry?.iso === country.iso;
                    const isHovered = hoveredCountry?.iso === country.iso;
                    const isActive = isSelected || isHovered;

                    return (
                      <g
                        key={country.iso}
                        id={`pin-${country.iso}`}
                        className="cursor-pointer group"
                        tabIndex={0}
                        role="button"
                        aria-label={`${country.name}: ${country.formattedCount} certifications`}
                        onMouseEnter={() => handleCountryHover(country)}
                        onMouseLeave={() => {
                          setHoveredCountry((prev) => (prev?.iso === country.iso ? null : prev));
                        }}
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
                      >
                        {/* Gentle outer pulse animation ring */}
                        <circle
                          cx={country.cx}
                          cy={country.cy}
                          r={isActive ? 8 : 4.5}
                          fill="#FFDB58"
                          opacity={isActive ? 0.7 : 0.3}
                          className={`pointer-events-none ${isActive ? "animate-ping" : ""}`}
                        />

                        {/* Navy Blue Outer Pin Ring */}
                        <circle
                          cx={country.cx}
                          cy={country.cy}
                          r={isActive ? 4.8 : 3.4}
                          fill="#121C46"
                          stroke="#FFFFFF"
                          strokeWidth={isActive ? 1.2 : 0.75}
                          style={{
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            filter: isActive
                              ? "drop-shadow(0 2px 4px rgba(18, 28, 70, 0.6))"
                              : "drop-shadow(0 1px 2px rgba(18, 28, 70, 0.3))"
                          }}
                        />

                        {/* Yellow / Gold Center Core */}
                        <circle
                          cx={country.cx}
                          cy={country.cy}
                          r={isActive ? 2.2 : 1.4}
                          fill="#FFDB58"
                          style={{
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
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
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex flex-wrap items-center gap-2 sm:gap-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#CBD5E1] shadow-sm text-xs font-semibold text-[#121C46]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#2563EB] border border-white shrink-0" />
              <span>Certified Footprint (93 Countries)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#E2E8F0] border border-[#CBD5E1] shrink-0" />
              <span>Emerging Regions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#121C46] border border-[#FFDB58] shrink-0" />
              <span>Active Pin (Hover to View)</span>
            </div>
          </div>
        </div>

        {/* BOTTOM HINT */}
        <div className="mt-3 text-center text-xs text-[#64748B]">
          Hover or tap any location pin or certified country to view verified certification records. Use zoom controls to explore dense regions.
        </div>
      </div>
    </section>
  );
}
