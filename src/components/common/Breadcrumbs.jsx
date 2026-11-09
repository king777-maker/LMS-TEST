import { Link } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

/**
 * Accessible Breadcrumb Navigation Component.
 * @param {Array} items - Array of { name: string, url?: string }
 */
export const Breadcrumbs = ({ items = [] }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className="w-full py-3 px-4 sm:px-6 bg-slate-50/80 border-b border-slate-200/80 text-xs sm:text-sm text-slate-500 overflow-x-auto"
        >
            <ol
                itemScope
                itemType="https://schema.org/BreadcrumbList"
                className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap max-w-7xl mx-auto"
            >
                {/* Home crumb */}
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                    className="flex items-center"
                >
                    <Link
                        to="/"
                        itemProp="item"
                        className="flex items-center gap-1 text-slate-600 hover:text-[#131E4A] font-medium transition-colors"
                    >
                        <FaHome className="w-3.5 h-3.5 text-[#F7C600]" aria-hidden="true" />
                        <span itemProp="name">Home</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                    <FaChevronRight className="w-2.5 h-2.5 text-slate-400 mx-1.5" aria-hidden="true" />
                </li>

                {/* Dynamic crumbs */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const position = index + 2;

                    return (
                        <li
                            key={item.name + index}
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                            className="flex items-center"
                        >
                            {!isLast && item.url ? (
                                <>
                                    <Link
                                        to={item.url}
                                        itemProp="item"
                                        className="text-slate-600 hover:text-[#131E4A] font-medium transition-colors max-w-[150px] sm:max-w-xs truncate"
                                    >
                                        <span itemProp="name">{item.name}</span>
                                    </Link>
                                    <meta itemProp="position" content={String(position)} />
                                    <FaChevronRight className="w-2.5 h-2.5 text-slate-400 mx-1.5" aria-hidden="true" />
                                </>
                            ) : (
                                <span
                                    itemProp="name"
                                    aria-current="page"
                                    className="font-semibold text-[#131E4A] max-w-[200px] sm:max-w-md truncate"
                                >
                                    {item.name}
                                    <meta itemProp="position" content={String(position)} />
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
