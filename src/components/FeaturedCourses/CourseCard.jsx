import { useNavigate } from "react-router-dom";
import EnrollButton from "../common/EnrollButton";
import { useAuthPrompt } from "../../context/AuthPromptContext";
import { isCourseOnlineAvailable } from "../../constants/courseAvailability";


const CourseCard = ({ course }) => {

    const navigate = useNavigate();
    const { requireAuth } = useAuthPrompt();
    const isOnline = isCourseOnlineAvailable(course?.id, course);


    // =====================================================
    // ENROLL
    // =====================================================

    const handleEnroll = () => {

        if (!course?.id) {

            console.error(
                "Featured course ID is missing:",
                course
            );

            return;

        }


        console.log(
            "Opening featured course:",
            course.id
        );


        navigate(
            `/featured-enroll/${course.id}`
        );

    };


    return (
        <div
            className="
                bg-white
                rounded-2xl
                overflow-hidden
                border border-gray-100
                shadow-[0_4px_20px_rgba(16,47,83,0.06)]
                hover:shadow-[0_12px_30px_rgba(16,47,83,0.12)]
                hover:-translate-y-1
                transition-all duration-300
                w-full h-full
                flex flex-col
            "
        >

            {/* IMAGE & PRICE */}
            <div className="relative overflow-hidden aspect-[16/10]">
                <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="250"
                    className="
                        w-full h-full
                        object-cover
                        transition-transform duration-500
                        hover:scale-105
                    "
                />
            </div>

            {/* CONTENT */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">

                {/* TITLE */}
                <h3 className="text-base font-bold text-[#102F53] leading-snug line-clamp-2 min-h-[44px]">
                    {course.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-2 text-xs sm:text-sm text-[#52647A] leading-relaxed line-clamp-2 min-h-[38px]">
                    {course.description}
                </p>

                {/* BOTTOM METRICS & ACTION */}
                <div className="mt-auto pt-4">

                    <div className="bg-slate-50 rounded-xl p-2.5 grid grid-cols-2 items-center gap-2 mb-3 border border-gray-100">

                        {/* STUDENTS */}
                        <div className="text-center border-r border-gray-200 pr-1">
                            <span className="text-base sm:text-lg font-extrabold text-[#102F53] block leading-none">
                                {course.students || 0}+
                            </span>
                            <span className="text-[10px] text-[#52647A] uppercase font-semibold tracking-wider mt-1 block">
                                Students
                            </span>
                        </div>

                        {/* RATING */}
                        <div className="text-center pl-1">
                            <span className="text-base sm:text-lg font-extrabold text-[#102F53] block leading-none">
                                ⭐ {course.rating || 0}
                            </span>
                            <span className="text-[10px] text-[#52647A] uppercase font-semibold tracking-wider mt-1 block">
                                Rating
                            </span>
                        </div>

                    </div>

                    {/* ENROLL BUTTON */}
                    <EnrollButton
                        label="Enroll Now"
                        onClick={handleEnroll}
                    />

                </div>

            </div>

        </div>
    );
};


export default CourseCard;