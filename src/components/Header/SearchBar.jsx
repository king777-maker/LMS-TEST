import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes, FaGraduationCap, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { navigationCategories } from "../../data/coursesData";

const SearchBar = ({ onSelectCourse }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);
  const containerRef = useRef(null);

  // Flatten all courses for search
  const allCourses = React.useMemo(() => {
    return navigationCategories.flatMap((cat) =>
      cat.courses.map((course) => ({
        ...course,
        categoryTitle: cat.title,
      }))
    );
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = allCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.categoryTitle.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 6));
  }, [query, allCourses]);

  // Click outside and Esc key listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative z-40 shrink-0">
      <div
        className={`relative flex items-center w-28 sm:w-32 xl:w-32 2xl:w-36 h-8 text-xs px-2.5 bg-white/10 border border-white/15 rounded-xl text-white transition-all duration-200 shrink-0 ${
          isFocused ? "border-white/40 ring-1 ring-white/30 bg-white/20" : "hover:bg-white/15"
        }`}
      >
        <FaSearch className="text-slate-300 text-[11px] shrink-0 mr-1.5" />
        <input
          type="text"
          value={query}
          aria-label="Search certifications and courses"
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-full min-w-0 bg-transparent text-white placeholder-slate-300 text-xs outline-none focus:outline-none font-medium leading-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search input"
            onClick={handleClear}
            className="text-slate-400 hover:text-white p-0.5 ml-1 shrink-0 cursor-pointer"
          >
            <FaTimes className="text-[9px]" />
          </button>
        )}
      </div>

      {/* Autocomplete / Live Search Results Dropdown */}
      {isFocused && query.trim() && (
        <div className="absolute right-0 top-full mt-2 w-[min(calc(100vw-24px),380px)] bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fadeInSlideDown">
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>Search Results ({results.length})</span>
            {results.length > 0 && <span className="text-blue-600">Press Esc to close</span>}
          </div>

          <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 custom-dropdown-scroll">
            {results.length > 0 ? (
              results.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  onClick={() => {
                    setIsFocused(false);
                    if (onSelectCourse) onSelectCourse(course);
                  }}
                  className="p-3 flex items-start gap-3 hover:bg-blue-50/70 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaGraduationCap className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {course.code}
                      </span>
                      <span className="text-[10.5px] text-slate-400 truncate">
                        {course.categoryTitle}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                      {course.title}
                    </h5>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Duration: {course.duration} • Level: {course.level}
                    </p>
                  </div>
                  <FaChevronRight className="text-slate-300 group-hover:text-blue-600 text-[10px] self-center ml-1" />
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching certifications found for "{query}".
                <div className="mt-2 text-[11px] text-blue-600">
                  Try searching for "ISO", "Defense", "Auditor", or "Lead".
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
