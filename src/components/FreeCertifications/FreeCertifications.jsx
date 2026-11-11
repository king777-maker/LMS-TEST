import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiSliders, FiBookOpen, FiAward, FiX, FiRotateCcw } from "react-icons/fi";
import CertificateCard from "./CertificateCard";
import { getFreeCertifications } from "../../api/api";
import freeCoursesData, {
    getAuthoritativeCourseName,
    STATIC_FREE_CERT_METADATA,
    deriveFreeCourseCategory,
} from "../../data/freeCoursesData";

const fallbackFreeCerts = [
    {
        id: "322",
        name: "ISO 9001:2026 QMS Awareness",
        category: "Quality Management",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
        students_count: 2850,
        students: 2850,
        rating: 4.9,
        duration: "12 Hours",
        description: "Master the foundational concepts of quality management systems with official certification.",
    },
    {
        id: "332",
        name: "ISO14001: 2026 EMS Awareness",
        category: "Environmental Management",
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900",
        students_count: 1960,
        students: 1960,
        rating: 4.8,
        duration: "12 Hours",
        description: "Understand environmental impact analysis, sustainability, and compliance obligations.",
    },
    {
        id: "323",
        name: "ISO 45001:2018 OHSMS Awareness",
        category: "Health & Safety",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900",
        students_count: 3240,
        students: 3240,
        rating: 4.9,
        duration: "14 Hours",
        description: "Key principles for mitigating workplace risks, occupational health, and safety protocols.",
    },
    {
        id: "333",
        name: "ISO 27001:2022 ISMS Awareness",
        category: "Information Security",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
        students_count: 4500,
        students: 4500,
        rating: 5.0,
        duration: "16 Hours",
        description: "Introduction to ISMS, security controls, and cyber risk management frameworks.",
    },
    {
        id: "329",
        name: "Lean Six Sigma White belt",
        category: "Quality Management",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900",
        students_count: 5120,
        students: 5120,
        rating: 4.9,
        duration: "10 Hours",
        description: "Master DMAIC fundamentals to participate effectively in process improvement initiatives.",
    },
    {
        id: "324",
        name: "ISO 22000:2018 FSMS Awareness",
        category: "Food Safety",
        image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=900",
        students_count: 1720,
        students: 1720,
        rating: 4.8,
        duration: "10 Hours",
        description: "Critical control points, hazard analysis, and hygienic practices in food handling.",
    },
];

const normalizeCertification = (item, idx = 0) => {
    const idStr = String(item.id || idx + 1);
    const matchedStatic = freeCoursesData.find(
        (s) => String(s.id) === idStr ||
               s.title?.toLowerCase() === (item.name || item.title || "").toLowerCase()
    );
    const staticMeta = STATIC_FREE_CERT_METADATA[idStr] || {};
    const category = staticMeta.category || deriveFreeCourseCategory(item);
    
    // Fallback pseudo-unique student enrollment counts for authentic sorting
    const fallbackCount = 2100 + ((Number(item.id || idx) * 137) % 2800);
    const students_count = Number(
        item.students_count ||
        (Number(item.students) > 0 ? Number(item.students) : 0) ||
        staticMeta.students_count ||
        matchedStatic?.students_count ||
        fallbackCount
    );

    const fallbackRating = 4.8 + (((Number(item.id || idx) * 7) % 3) * 0.1);
    const rating = Number(
        (Number(item.rating) > 0 ? Number(item.rating) : 0) ||
        staticMeta.rating ||
        matchedStatic?.rating ||
        fallbackRating
    );

    const hasGenericImage = !item.image || item.image.includes("photo-1509062522246");
    const image = (!hasGenericImage ? item.image : null) ||
        staticMeta.image ||
        matchedStatic?.image ||
        item.image ||
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900";

    const name = getAuthoritativeCourseName(item.id, item.name || item.title || matchedStatic?.title || `Certification ${idx + 1}`);

    return {
        ...item,
        id: idStr,
        name: name,
        title: name,
        category: category,
        students_count: students_count,
        students: students_count,
        rating: rating,
        image: image,
        description: item.description || matchedStatic?.description || staticMeta.description || "Master foundational concepts and earn an accredited certificate.",
    };
};

const FreeCertifications = () => {
    const [certificates, setCertificates] = useState(() => fallbackFreeCerts.map((c, i) => normalizeCertification(c, i)));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        let isMounted = true;
        const fetchCertifications = async () => {
            setLoading(true);
            try {
                const response = await getFreeCertifications();
                if (!isMounted) return;

                if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
                    const normalized = response.data.data.map((c, idx) => normalizeCertification(c, idx));
                    setCertificates(normalized);
                } else {
                    setCertificates(fallbackFreeCerts.map((c, i) => normalizeCertification(c, i)));
                }
            } catch (err) {
                if (isMounted) {
                    setCertificates(fallbackFreeCerts.map((c, i) => normalizeCertification(c, i)));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchCertifications();

        return () => {
            isMounted = false;
        };
    }, []);

    // Unique Categories List with deliberate logical ordering
    const categories = useMemo(() => {
        const preferredOrder = [
            "All",
            "Quality Management",
            "Environmental Management",
            "Health & Safety",
            "Information Security",
            "Food Safety",
            "Auditing & Governance",
        ];
        const set = new Set();
        certificates.forEach((c) => {
            if (c.category) set.add(c.category);
        });

        const ordered = preferredOrder.filter((cat) => cat === "All" || set.has(cat));
        set.forEach((cat) => {
            if (!ordered.includes(cat)) ordered.push(cat);
        });
        return ordered;
    }, [certificates]);

    // Filter & Sort Logic
    const filteredCertificates = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const qNoSpace = q.replace(/[\s\-_:]+/g, "");
        const terms = q ? q.split(/\s+/).filter(Boolean) : [];

        return certificates
            .filter((c) => {
                // Category match (case-insensitive)
                const matchesCategory =
                    selectedCategory === "All" ||
                    (c.category && c.category.toLowerCase() === selectedCategory.toLowerCase());

                // Search match
                let matchesSearch = true;
                if (q) {
                    const nameStr = (c.name || "").toLowerCase();
                    const titleStr = (c.title || "").toLowerCase();
                    const descStr = (c.description || "").toLowerCase();
                    const catStr = (c.category || "").toLowerCase();
                    const codeStr = (c.code || "").toLowerCase();

                    const combinedText = `${nameStr} ${titleStr} ${descStr} ${catStr} ${codeStr}`;
                    const normalizedTarget = combinedText.replace(/[\s\-_:]+/g, "");

                    const directMatch = combinedText.includes(q);
                    const spaceInsensitiveMatch = qNoSpace ? normalizedTarget.includes(qNoSpace) : true;
                    const allTermsMatch = terms.every(
                        (t) =>
                            combinedText.includes(t) ||
                            normalizedTarget.includes(t.replace(/[\s\-_:]+/g, ""))
                    );

                    matchesSearch = directMatch || spaceInsensitiveMatch || allTermsMatch;
                }

                return matchesCategory && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === "rating") {
                    const diff = Number(b.rating || 0) - Number(a.rating || 0);
                    if (diff !== 0) return diff;
                    return Number(b.students_count || b.students || 0) - Number(a.students_count || a.students || 0);
                }
                if (sortBy === "name") {
                    return (a.name || "").localeCompare(b.name || "");
                }
                // Default: "popular" / Most Enrolled
                const diff = Number(b.students_count || b.students || 0) - Number(a.students_count || a.students || 0);
                if (diff !== 0) return diff;
                return Number(b.rating || 0) - Number(a.rating || 0);
            });
    }, [certificates, searchQuery, selectedCategory, sortBy]);

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSortBy("popular");
    };

    const isFilterActive = searchQuery.trim() !== "" || selectedCategory !== "All" || sortBy !== "popular";

    return (
        <section className="py-16 bg-white relative overflow-hidden" id="free-certifications">
            {/* Background Subtle Gradient */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

            <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 text-xs font-semibold mb-3">
                            <FiAward className="text-amber-500" />
                            <span>100% Free Certifications</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
                            Explore Free Certified Programs
                        </h2>
                        <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                            Start building verified credentials at zero cost. Complete the course, pass the assessment, and download your globally recognized certificate instantly.
                        </p>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:px-5 shrink-0 shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                                <FiBookOpen />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-medium">Free Access</div>
                                <div className="text-sm font-bold text-[#0a1e38]">{certificates.length}+ Tracks</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
                                <FiAward />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-medium">Accreditation</div>
                                <div className="text-sm font-bold text-[#0a1e38]">Verified</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3 sm:p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xs">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 sm:pb-0 scrollbar-none min-w-0">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`h-10 px-4 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer inline-flex items-center justify-center shrink-0 border select-none active:scale-[0.98] ${
                                        isSelected
                                            ? "bg-[#0a1e38] text-white border-[#0a1e38] shadow-xs"
                                            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                                    }`}
                                >
                                    <span>{cat}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search & Sort */}
                    <div className="flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
                        <div className="relative flex-1 sm:w-64 md:w-72">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search free courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                                >
                                    <FiX className="text-sm" />
                                </button>
                            )}
                        </div>

                        <div className="relative shrink-0">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                aria-label="Sort certifications"
                                className="h-10 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
                            >
                                <option value="popular">Most Enrolled</option>
                                <option value="rating">Top Rated</option>
                                <option value="name">Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Status & Quick Reset Bar */}
                {isFilterActive && (
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <span>
                                Showing <strong className="text-[#0a1e38] font-bold">{filteredCertificates.length}</strong> of {certificates.length} courses
                            </span>
                            {selectedCategory !== "All" && (
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold border border-blue-200/60">
                                    Category: {selectedCategory}
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className="hover:text-blue-900 cursor-pointer"
                                        aria-label="Remove category filter"
                                    >
                                        <FiX className="text-xs" />
                                    </button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-semibold border border-amber-200/60">
                                    Search: &ldquo;{searchQuery}&rdquo;
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="hover:text-amber-950 cursor-pointer"
                                        aria-label="Remove search filter"
                                    >
                                        <FiX className="text-xs" />
                                    </button>
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer underline-offset-2 hover:underline"
                        >
                            <FiRotateCcw className="text-xs" />
                            <span>Reset Filters</span>
                        </button>
                    </div>
                )}

                {/* Cards Grid */}
                {filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                        {filteredCertificates.map((cert) => (
                            <CertificateCard key={cert.id} certificate={cert} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <FiBookOpen className="text-3xl text-slate-400 mx-auto mb-2" />
                        <h4 className="text-base font-bold text-slate-700">No free certifications found</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            {searchQuery ? `No courses matching "${searchQuery}".` : "No courses found for this category."} Try adjusting your search query or reset your filters.
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-[#0a1e38] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
                        >
                            <FiRotateCcw className="text-xs" />
                            <span>Reset All Filters</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FreeCertifications;
