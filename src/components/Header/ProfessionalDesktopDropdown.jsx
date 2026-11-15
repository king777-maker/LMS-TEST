import {
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";


const ProfessionalDesktopDropdown = ({
    title,
    subcategories = [],
}) => {


    const getChildPosition = (index) => {

        if (index === 4)
            return "-top-[120px]";

        if (index === 5)
            return "-top-[200px]";

        if (index === 6)
            return "-top-[280px]";

        if (index >= 7)
            return "-top-[350px]";

        return "top-0";

    };


    return (

        <div className="relative group/professional">


            {/* MAIN TITLE */}

            <button
                type="button"
                className="
                    flex
                    items-center
                    gap-1.5

                    text-[14px]
                    2xl:text-[15px]

                    text-slate-100

                    font-medium

                    whitespace-nowrap

                    hover:text-[#F8D85A]

                    transition-colors
                    duration-200
                "
            >

                {title}

                <FaChevronDown
                    className="
                        text-[9px]
                        text-slate-300

                        transition-transform
                        duration-200

                        group-hover/professional:rotate-180
                        group-hover/professional:text-[#F8D85A]
                    "
                />

            </button>


            {/* MAIN DROPDOWN */}

            <div
                className="
                    absolute
                    right-0
                    top-full
                    pt-2
                    w-[380px]
                    z-[1000]
                    origin-top-right
                    opacity-0
                    invisible
                    scale-95
                    translate-y-1
                    group-hover/professional:opacity-100
                    group-hover/professional:visible
                    group-hover/professional:scale-100
                    group-hover/professional:translate-y-0
                    transition-all
                    duration-[180ms]
                    ease-out
                "
            >

                <div
                    className="
                        bg-white

                        border
                        border-gray-100

                        shadow-[0_12px_32px_rgba(0,0,0,0.18)]

                        rounded-xl

                        overflow-visible
                        py-1.5
                    "
                >


                    {subcategories.length > 0 ? (

                        subcategories.map(
                            (category, categoryIndex) => (

                                <div
                                    key={
                                        category.id ||
                                        categoryIndex
                                    }
                                    className="
                                        relative

                                        group/category

                                        border-b
                                        border-gray-100/70

                                        last:border-b-0
                                    "
                                >


                                    {/* SUBCATEGORY */}

                                    <div
                                        className="
                                            flex

                                            items-center
                                            justify-between

                                            gap-4

                                            px-4
                                            py-3

                                            cursor-pointer

                                            text-[13.5px]

                                            leading-[1.4]

                                            text-gray-700

                                            font-semibold

                                            hover:bg-slate-50
                                            hover:text-[#102F53]

                                            transition-all
                                            duration-200
                                        "
                                    >

                                        <span>
                                            {category.name}
                                        </span>


                                        <FaChevronRight
                                            className="
                                                flex-shrink-0

                                                text-[10px]

                                                text-[#102F53]

                                                rotate-180

                                                transition-all
                                                duration-200

                                                group-hover/category:-translate-x-1

                                                group-hover/category:text-[#102F53]
                                            "
                                        />

                                    </div>


                                    {/* CHILD ITEMS */}

                                    <div
                                        className={`
                                            absolute

                                            right-full

                                            ${getChildPosition(
                                                categoryIndex
                                            )}

                                            pr-[6px]

                                            w-[450px]

                                            opacity-0
                                            invisible

                                            translate-x-2

                                            group-hover/category:opacity-100
                                            group-hover/category:visible
                                            group-hover/category:translate-x-0

                                            transition-all
                                            duration-200

                                            z-[1100]
                                        `}
                                    >

                                        <div
                                            className="
                                                bg-white

                                                border
                                                border-gray-100

                                                shadow-[0_12px_32px_rgba(0,0,0,0.20)]

                                                rounded-xl

                                                overflow-hidden
                                            "
                                        >


                                            {/* HEADER */}

                                            <div
                                                className="
                                                    px-4
                                                    py-3

                                                    bg-[#102F53]

                                                    text-[#F8D85A]

                                                    text-[13.5px]

                                                    font-bold

                                                    sticky
                                                    top-0

                                                    z-20
                                                "
                                            >

                                                {category.name}

                                            </div>


                                            {/* ITEMS */}

                                            <div
                                                className="
                                                    max-h-[380px]

                                                    overflow-y-auto

                                                    professional-child-scroll
                                                "
                                            >

                                                {category.items?.length > 0 ? (

                                                    category.items.map(
                                                        (item, index) => (

                                                            <Link
                                                                key={
                                                                    item.id ||
                                                                    index
                                                                }
                                                                to={
                                                                    item.path ||
                                                                    "#"
                                                                }
                                                                className="
                                                                    block

                                                                    px-4
                                                                    py-2.5

                                                                    text-[13px]

                                                                    leading-[1.45]

                                                                    text-gray-700

                                                                    font-medium

                                                                    border-b
                                                                    border-gray-100

                                                                    last:border-b-0

                                                                    hover:bg-slate-50
                                                                    hover:text-[#102F53]
                                                                    hover:pl-5

                                                                    transition-all
                                                                    duration-200
                                                                "
                                                            >

                                                                {item.name}

                                                            </Link>

                                                        )
                                                    )

                                                ) : (

                                                    <div
                                                        className="
                                                            px-4
                                                            py-3

                                                            text-[13px]
                                                            text-gray-400
                                                        "
                                                    >
                                                        No courses available
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        )

                    ) : (

                        <div
                            className="
                                px-4
                                py-3

                                text-[13.5px]
                                text-gray-400
                            "
                        >
                            No categories available
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


export default ProfessionalDesktopDropdown;