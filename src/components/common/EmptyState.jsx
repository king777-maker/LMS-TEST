import { Link } from "react-router-dom";
import { FaInbox, FaRedo, FaSearch } from "react-icons/fa";

/**
 * Reusable Empty State Component.
 * @param {React.ReactNode} icon - Optional custom icon
 * @param {string} title - Main heading
 * @param {string} description - Explanation / guidance
 * @param {string} actionText - Optional button label
 * @param {string} actionLink - Optional route destination
 * @param {Function} onAction - Optional click handler (e.g. reset filter or retry)
 */
export const EmptyState = ({
    icon,
    title = "No results found",
    description = "We couldn't find anything matching your request. Try adjusting your filters or search terms.",
    actionText,
    actionLink,
    onAction,
}) => {
    return (
        <div className="py-14 sm:py-20 px-6 text-center max-w-md mx-auto flex flex-col items-center justify-center">
            {/* Visual Icon Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-[#131E4A] mb-5 border border-slate-200 shadow-inner">
                {icon ? (
                    icon
                ) : (
                    <FaSearch className="w-8 h-8 text-[#131E4A]/60" />
                )}
            </div>

            {/* Typography */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {description}
            </p>

            {/* Actions */}
            {actionLink ? (
                <Link
                    to={actionLink}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#131E4A] hover:bg-[#183B73] text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                    {actionText || "Browse All Courses"}
                </Link>
            ) : onAction ? (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F7C600] hover:bg-[#e5b700] text-[#131E4A] text-sm font-bold rounded-xl shadow-sm transition-all"
                >
                    <FaRedo className="w-3.5 h-3.5" />
                    {actionText || "Reset Filters"}
                </button>
            ) : null}
        </div>
    );
};

export default EmptyState;
