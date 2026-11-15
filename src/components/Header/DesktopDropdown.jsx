import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const DesktopDropdown = ({
    title,
    items = [],
    width = "w-[360px]",
    categorySlug,
}) => {
    return (
        <div className="relative group py-2">

            {/* =====================================================
                MENU TITLE LINK & ARROW
            ===================================================== */}
            <div className="relative flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full group-hover:bg-white/10 transition-all duration-200">
                <Link
                    to={`/category/${categorySlug}`}
                    className="
                        text-[14px] 2xl:text-[14.5px]
                        text-slate-100 font-medium
                        whitespace-nowrap
                        group-hover:text-white
                        transition-colors duration-200
                    "
                >
                    {title}
                </Link>

                <span className="flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                    <FaChevronDown
                        className="
                            text-[9px]
                            transition-transform duration-200
                            group-hover:rotate-180
                        "
                    />
                </span>

                {/* Glowing indicator line on hover */}
                <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            </div>

            {/* =====================================================
                DROPDOWN MENU CARD
            ===================================================== */}
            <div
                className={`
                    absolute
                    top-full
                    left-0
                    ${width}
                    z-[1000]
                    pt-2
                    max-h-[calc(100vh-140px)]
                    overflow-y-auto
                    origin-top
                    opacity-0
                    invisible
                    scale-95
                    translate-y-1
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:scale-100
                    group-hover:translate-y-0
                    transition-all duration-[180ms] ease-out
                `}
            >
                <div
                    className="
                        bg-white
                        border border-gray-100
                        shadow-[0_12px_32px_rgba(0,0,0,0.18)]
                        rounded-xl
                        overflow-hidden
                        py-1.5
                    "
                >
                    {items.length > 0 ? (
                        items.map((item, index) => {
                            const name =
                                typeof item === "string"
                                    ? item
                                    : item?.name || "Unnamed Course";

                            const path =
                                typeof item === "string"
                                    ? "#"
                                    : item?.path || "#";

                            return (
                                <Link
                                    key={
                                        typeof item === "object"
                                            ? item?.id || index
                                            : index
                                    }
                                    to={path}
                                    className="
                                        block
                                        px-4 py-2.5
                                        text-[13.5px]
                                        text-gray-700
                                        font-medium
                                        border-b border-gray-100/70
                                        last:border-b-0
                                        hover:bg-slate-50
                                        hover:text-[#102F53]
                                        hover:pl-5
                                        transition-all duration-200
                                    "
                                >
                                    {name}
                                </Link>
                            );
                        })
                    ) : (
                        <div className="px-4 py-3 text-[13px] text-gray-400">
                            No courses available
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default DesktopDropdown;