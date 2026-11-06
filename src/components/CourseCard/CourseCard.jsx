import { FaUsers, FaClock, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EnrollButton from "../common/EnrollButton";
const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    return (
        <div
            className="
        bg-white
        rounded-[24px]
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
      "
        >
            {/* ================= Image ================= */}

            <div className="relative">

                <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    decoding="async"
                    width="320"
                    height="220"
                    className="w-full h-[220px] object-cover"
                />

                {/* Badge */}
                {course.badge && (
                    <div className="absolute right-4 top-4 bg-[#2563EB] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                        {course.badge}
                    </div>
                )}
            </div>


            {/* ================= Body ================= */}

            <div className="p-6">

                {/* Tags */}

                <div className="flex gap-3 mb-5">

                    <span className="bg-[#EAF2FF] text-[#2563EB] px-4 py-2 rounded-full text-xs font-semibold uppercase">
                        {course.category}
                    </span>

                    <span className="bg-[#EAF2FF] text-[#2563EB] px-4 py-2 rounded-full text-xs font-semibold uppercase">
                        {course.level}
                    </span>

                </div>

                {/* Title */}

                <h3 className="!text-[15px] md:!text-[15px] lg:!text-[15px] leading-9 font-bold text-[#1E3A66] min-h-[10px]">
                    {course.title}
                </h3>

                {/* Description */}

                <p className="mt-5 text-[#667085] leading-5  !text-[15px] md:!text-[12px] lg:!text-[12px] min-h-[90px]">
                    {course.description}
                </p>

                {/* Hours + Students */}

                <div className="flex items-center justify-between text-[#667085]">

                    <div className="flex items-center gap-2">

                        <FaClock className="text-[#2563EB]" />

                        <span>{course.hours}</span>

                    </div>

                    <div className="flex items-center gap-2">

                        <FaUsers className="text-[#2563EB]" />

                        <span>{course.students}</span>

                    </div>

                </div>

                {/* Button */}

                <div className="mt-4">
                    <EnrollButton
                        label="Enroll Now"
                        onClick={() => navigate(`/enroll/${course.id}`)}
                    />
                </div>

                {/* Divider */}

                <div className="border-t mt-8 pt-6 flex items-center justify-between">

                    <div className="flex items-center gap-1 text-yellow-400">

                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />

                        <span className="ml-2 text-[#1E3A66] font-semibold">
                            ({course.rating})
                        </span>

                    </div>

                    {/* <span className="text-[#667085] font-medium">
            {course.reviews} Reviews
          </span> */}

                </div>

            </div>

        </div>
    );
};

export default CourseCard;