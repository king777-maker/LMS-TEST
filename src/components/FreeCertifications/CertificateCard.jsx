import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthPrompt } from "../../context/AuthPromptContext";
import toast from "react-hot-toast";
import { FaUserFriends, FaStar, FaArrowRight } from "react-icons/fa";
import { getAuthoritativeCourseName } from "../../data/freeCoursesData";
import EnrollButton from "../common/EnrollButton";

const CertificateCard = ({ certificate }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { requireAuth } = useAuthPrompt();

    const handleEnroll = () => {
        const dest = `/enroll/${certificate.id}`;
        if (!requireAuth({
            courseId: certificate.id,
            title: certificate.name,
            destination: dest,
        })) {
            return;
        }
        navigate(dest);
    };

    const formatStudents = (value) => {
        const students = parseInt(value, 10);
        if (Number.isNaN(students)) return "0";
        if (students >= 1000000) return `${(students / 1000000).toFixed(1).replace(".0", "")}M`;
        if (students >= 1000) return `${(students / 1000).toFixed(1).replace(".0", "")}k`;
        return students.toString();
    };

    const formatRating = (value) => {
        const rating = Number(value || 0);
        return rating.toFixed(1);
    };

    const promoBadge = (() => {
        const id = String(certificate.id || certificate.altId || "");
        if (id === "322" || id === "1" || id === "333" || id === "6" || id === "323" || id === "3" || id === "329" || id === "10") {
            return {
                type: "HOT",
                label: "HOT",
                icon: "🔥",
                style: "bg-orange-50 text-[#EA580C] border-orange-200/90",
            };
        }
        if (id === "325" || id === "5" || id === "328" || id === "9" || id === "330" || id === "11") {
            return {
                type: "NEW",
                label: "NEW",
                icon: "⚡",
                style: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
            };
        }
        return {
            type: "POPULAR",
            label: "POPULAR",
            icon: "★",
            style: "bg-amber-50 text-amber-800 border-amber-200/90",
        };
    })();

    return (
        <div
            onClick={handleEnroll}
            className="
                group
                bg-white
                rounded-2xl
                overflow-hidden
                border border-slate-200/80
                shadow-[0_2px_10px_rgba(16,43,78,0.04)]
                hover:shadow-[0_12px_28px_rgba(16,43,78,0.10)]
                hover:-translate-y-1
                transition-all duration-300
                w-full
                flex flex-col
                cursor-pointer
                h-full
            "
        >
            {/* 16:9 THUMBNAIL CONTAINER */}
            <div className="relative overflow-hidden aspect-[16/9] bg-slate-100">
                <img
                    src={certificate.image}
                    alt={certificate.name}
                    className="
                        w-full h-full
                        object-cover
                        transition-transform duration-500
                        group-hover:scale-105
                    "
                />
                
                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102B4E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* THEME BRAND BADGE: Deep Navy #131E4A & Theme Gold #F7C600 */}
                <div
                    className="
                        absolute top-3 right-3
                        bg-[#131E4A]/95 backdrop-blur-md text-[#F7C600]
                        text-[10px] font-extrabold
                        uppercase tracking-wider
                        px-2.5 py-1 rounded-md
                        border border-[#F7C600]/40
                        shadow-sm select-none
                    "
                >
                    Free Certification
                </div>
            </div>

            {/* CONTENT BODY */}
            <div className="p-5 flex flex-col flex-1 bg-white">
                
                {/* CATEGORY TAG */}
                <div className="mb-2">
                    <span className="text-[10px] font-bold text-[#102B4E] bg-[#F7F5F0] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block border border-slate-200/60">
                        {certificate.category || "Online Certification"}
                    </span>
                </div>

                {/* TITLE WITH BADGE */}
                <h3 className="text-base font-bold text-[#102B4E] leading-snug min-h-[44px] line-clamp-2 group-hover:text-[#0052CC] transition-colors flex flex-wrap items-center gap-1.5">
                    <span>{getAuthoritativeCourseName(certificate.id, certificate.name)}</span>
                    {promoBadge && (
                        <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider ${promoBadge.style} border shadow-2xs shrink-0 select-none`}
                        >
                            <span className="text-[10px] leading-none">{promoBadge.icon}</span>
                            <span>{promoBadge.label}</span>
                        </span>
                    )}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[36px]">
                    {certificate.description}
                </p>

                {/* STATS & ENROLL BUTTON */}
                <div className="mt-auto pt-4">
                    {/* STATS BAR */}
                    <div className="bg-[#F7F5F0] rounded-xl p-2.5 flex items-center justify-between gap-2 mb-3.5 border border-slate-200/60">
                        {/* STUDENTS */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold px-2">
                            <FaUserFriends className="text-slate-400 text-xs" />
                            <span>{formatStudents(certificate.students_count || certificate.students)} Learners</span>
                        </div>

                        {/* RATING */}
                        <div className="flex items-center gap-1 text-xs text-slate-700 font-semibold px-2 border-l border-slate-200">
                            <FaStar className="text-[#E8B95D] text-xs" />
                            <span>{formatRating(certificate.rating)}</span>
                        </div>
                    </div>

                    {/* ENROLL BUTTON */}
                    <EnrollButton
                        label="Enroll Now"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleEnroll();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;
