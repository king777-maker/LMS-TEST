import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
    const number =
        category.number ||
        String(category.id || 1).padStart(2, "0");

    return (
        <div
            className="
                group relative w-full h-[260px] sm:h-[280px]
                bg-white cursor-pointer overflow-hidden
                rounded-2xl border border-gray-100
                shadow-[0_4px_20px_rgba(16,47,83,0.06)]
                transition-all duration-300 ease-out
                hover:-translate-y-1.5
                hover:shadow-[0_12px_30px_rgba(16,47,83,0.14)]
                z-0 hover:z-30
            "
        >

            {/* Background Image */}
            <div
                className="
                    absolute inset-0 z-10
                    bg-cover bg-center
                    transition-transform duration-700 ease-out
                    group-hover:scale-110
                "
                style={{
                    backgroundImage: `url(${category.image})`,
                }}
            />

            {/* Overlay Gradient */}
            <div
                className="
                    absolute inset-0 z-20
                    bg-gradient-to-t
                    from-[#131E4A]/95
                    via-[#131E4A]/45
                    to-transparent
                "
            />

            {/* Default Content */}
            <div
                className="
                    absolute inset-0 z-30
                    p-5 flex flex-col justify-end
                    text-white
                    transition-all duration-300
                    group-hover:opacity-0
                    group-hover:translate-y-3
                "
            >
                <div className="text-2xl font-bold leading-none mb-2 text-[#F8D85A]">
                    {number}.
                </div>

                <h3 className="text-base sm:text-lg font-bold leading-snug text-white">
                    {category.title}
                </h3>

                <p className="mt-1 text-xs text-white/80">
                    {category.courses} Courses
                </p>
            </div>

            {/* Hover Content */}
            <div
                className="
                    absolute inset-0 z-40
                    p-5 flex flex-col justify-between
                    text-white
                    bg-[#131E4A]/92
                    backdrop-blur-md
                    opacity-0 scale-95
                    group-hover:opacity-100
                    group-hover:scale-100
                    transition-all duration-300 ease-out
                "
            >

                {/* Top */}
                <div>
                    <div className="text-2xl font-bold leading-none mb-3 text-[#F8D85A]">
                        {number}.
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                        {category.title}
                    </h3>

                    {category.description && (
                        <p className="mt-2 text-xs text-white/85 leading-relaxed line-clamp-3">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* Bottom */}
                <div>
                    <p className="text-xs text-white/75 mb-3 font-medium">
                        {category.courses} Available Courses
                    </p>

                    {/* VIEW LINK */}
                    <Link
                        to={category.link || "#"}
                        onClick={(e) => {
                            if (!category.link) {
                                e.preventDefault();
                            }
                        }}
                        className="
                            inline-flex items-center gap-2
                            text-xs font-bold
                            text-[#F8D85A] hover:text-white
                            transition-all duration-200
                        "
                    >
                        <span>VIEW CATEGORY</span>
                        <span className="text-sm">→</span>
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default CategoryCard;