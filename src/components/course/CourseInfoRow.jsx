const CourseInfoRow = ({
    icon: Icon,
    label,
    value,
}) => {

    if (!value) return null;

    return (
        <div
            className="
                flex
                items-center
                justify-between

                gap-4

                pb-4

                border-b
                border-gray-100

                last:border-0
                last:pb-0
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-3

                    text-gray-500
                "
            >
                <Icon
                    size={18}
                    className="
                        shrink-0
                        text-[#131E4A]
                    "
                />

                <span className="text-sm">
                    {label}
                </span>
            </div>

            <span
                className="
                    text-[#131E4A]

                    text-sm
                    font-semibold

                    text-right
                "
            >
                {value}
            </span>
        </div>
    );
};

export default CourseInfoRow;