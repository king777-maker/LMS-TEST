import { Link } from "react-router-dom";
import { FaHome, FaGraduationCap, FaCertificate, FaHeadset, FaSearch } from "react-icons/fa";
import SEO from "../components/common/SEO";

export const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#F5F8FD] flex flex-col justify-center items-center py-16 px-4 sm:px-6">
            <SEO
                title="Page Not Found (404)"
                description="The page you requested could not be found on Broadbeach Online Academy. Browse our certified courses or contact support."
                noIndex={true}
            />

            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 text-center relative overflow-hidden">
                {/* Background Accent Graphics */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#131E4A]/5" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#F7C600]/10" />

                {/* 404 Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131E4A]/10 text-[#131E4A] font-bold text-sm mb-4">
                    <span>Error 404</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7C600]" />
                    <span>Page Not Found</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#131E4A] tracking-tight mb-4">
                    Lost in the Curriculum?
                </h1>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                    The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let’s get you back to certified learning.
                </p>

                {/* Primary Action Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#131E4A] hover:bg-[#183B73] text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                        <FaHome className="w-4 h-4 text-[#F7C600]" />
                        Back to Homepage
                    </Link>
                    <Link
                        to="/course"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F7C600] hover:bg-[#e5b700] text-[#131E4A] font-extrabold rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
                    >
                        <FaGraduationCap className="w-4 h-4" />
                        Explore All Courses
                    </Link>
                </div>

                {/* Helpful Quick Navigation Links */}
                <div className="pt-8 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Popular Certification Tracks & Free Courses
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        <Link
                            to="/free-courses"
                            className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/60 text-blue-900 transition-colors flex items-center justify-between text-xs font-bold"
                        >
                            <span>11 Free Courses</span>
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">Online</span>
                        </Link>
                        <Link
                            to="/category/lead-auditor"
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold"
                        >
                            <span>Lead Auditor</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Enquire</span>
                        </Link>
                        <Link
                            to="/category/internal-auditor"
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold"
                        >
                            <span>Internal Auditor</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Enquire</span>
                        </Link>
                        <Link
                            to="/category/health-safety-hse"
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold"
                        >
                            <span>Health & Safety (HSE)</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Enquire</span>
                        </Link>
                        <Link
                            to="/category/professional-certifications"
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold"
                        >
                            <span>Professional Certifications</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">11 Tracks</span>
                        </Link>
                        <Link
                            to="/verify-certificate"
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold"
                        >
                            <span className="flex items-center gap-1.5"><FaCertificate className="text-amber-500" /> Verify Certificate</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">Public</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
