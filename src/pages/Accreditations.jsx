import {
    FaGlobeAmericas,
    FaUsers,
    FaGraduationCap,
    FaAward,
    FaArrowRight,
    FaCheckCircle,
} from "react-icons/fa";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";

import {
    Navigation,
    Pagination,
    Autoplay,
} from "swiper/modules";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const Accreditations  = () => {

    const assets = import.meta.env.VITE_ASSETS_URL;


    // =====================================================
    // CERTIFICATES
    // 6 CERTIFICATES
    // =====================================================

    const certificates = [

        {
            id: 1,
            title: "ISO 9001 Certification",
            subtitle: "Quality Management System",
            image: `${assets}/about/global-footprints/certificate-1.jpg`,
        },

        {
            id: 2,
            title: "ISO 14001 Certification",
            subtitle: "Environmental Management",
            image: `${assets}/about/global-footprints/certificate-2.jpg`,
        },

        {
            id: 3,
            title: "ISO 45001 Certification",
            subtitle: "Occupational Health & Safety",
            image: `${assets}/about/global-footprints/certificate-3.jpg`,
        },

        {
            id: 4,
            title: "International Accreditation",
            subtitle: "Globally Recognized Standards",
            image: `${assets}/about/global-footprints/certificate-4.jpg`,
        },

        {
            id: 5,
            title: "Training Accreditation",
            subtitle: "Professional Training Standards",
            image: `${assets}/about/global-footprints/certificate-5.jpg`,
        },

        {
            id: 6,
            title: "Global Certification",
            subtitle: "International Recognition",
            image: `${assets}/about/global-footprints/certificate-6.jpg`,
        },

    ];


    // =====================================================
    // STATS
    // =====================================================

    const stats = [

        {
            id: 1,
            icon: <FaGlobeAmericas />,
            number: "45+",
            label: "Countries Reached",
        },

        {
            id: 2,
            icon: <FaUsers />,
            number: "10,000+",
            label: "Students Enrolled",
        },

        {
            id: 3,
            icon: <FaGraduationCap />,
            number: "150+",
            label: "Professional Courses",
        },

        {
            id: 4,
            icon: <FaAward />,
            number: "6+",
            label: "Global Accreditations",
        },

    ];


    return (

        <main className="bg-white overflow-hidden">


            {/* =================================================
                PAGE INTRO
            ================================================== */}

            <section
                className="
                    relative

                    pt-14
                    md:pt-20

                    pb-12
                    md:pb-16

                    bg-[#F5F8FC]
                "
            >

                {/* DECORATIVE CIRCLE */}

                <div
                    className="
                        absolute

                        w-[350px]
                        h-[350px]

                        rounded-full

                        bg-[#2168D8]/5

                        -top-[180px]
                        -right-[100px]

                        pointer-events-none
                    "
                />


                <div
                    className="
                        max-w-[1100px]
                        mx-auto

                        px-5
                        md:px-8

                        text-center

                        relative
                        z-10
                    "
                >

                    <span
                        className="
                            inline-block

                            text-[#2168D8]

                            text-[12px]
                            md:text-[13px]

                            font-bold

                            uppercase
                            tracking-[2.5px]
                        "
                    >
                        Worldwide Presence
                    </span>


                    <h1
                        className="
                            text-[#131E4A]

                            text-[30px]
                            sm:text-[36px]
                            md:text-[44px]

                            font-bold

                            leading-[1.2]

                            mt-3
                        "
                    >
                        Our Accerediations

                        <span className="text-[#2168D8]">
                            {" "}Footprints
                        </span>
                    </h1>


                    <div
                        className="
                            w-[65px]
                            h-[3px]

                            bg-[#FFDB58]

                            mx-auto

                            mt-4
                        "
                    />


                    <p
                        className="
                            max-w-[780px]

                            mx-auto

                            mt-6

                            text-[#64748B]

                            text-[15px]
                            md:text-[17px]

                            leading-[1.9]
                        "
                    >
                        Empowering professionals across borders through
                        globally recognized training, internationally
                        aligned certifications and a commitment to
                        excellence in professional education.
                    </p>

                </div>

            </section>



            {/* =================================================
                GLOBAL PRESENCE
            ================================================== */}

            <section className="py-14 md:py-20">

                <div
                    className="
                        max-w-[1200px]
                        mx-auto

                        px-5
                        md:px-8

                        grid
                        lg:grid-cols-2

                        gap-10
                        lg:gap-16

                        items-center
                    "
                >


                    {/* ================= IMAGE ================= */}

                    <div className="relative">

                        <div
                            className="
                                relative

                                h-[320px]
                                sm:h-[400px]
                                md:h-[470px]

                                overflow-hidden

                                rounded-[12px]
                            "
                        >

                            <img
                                src={`${assets}/about/global-footprints/global-presence.jpg`}
                                alt="Broadbeach Global Presence"
                                className="
                                    w-full
                                    h-full

                                    object-cover
                                "
                            />


                            <div
                                className="
                                    absolute
                                    inset-0

                                    bg-gradient-to-t

                                    from-[#131E4A]/50
                                    to-transparent
                                "
                            />

                        </div>


                        {/* FLOATING BOX */}

                        <div
                            className="
                                absolute

                                -bottom-6

                                right-4
                                md:-right-6

                                bg-[#FFDB58]

                                px-6
                                py-5

                                rounded-lg

                                shadow-xl
                            "
                        >

                            <div className="flex items-center gap-3">

                                <FaGlobeAmericas
                                    className="
                                        text-[#131E4A]
                                        text-[30px]
                                    "
                                />


                                <div>

                                    <h3
                                        className="
                                            text-[#131E4A]

                                            text-[24px]

                                            font-bold

                                            leading-none
                                        "
                                    >
                                        45+
                                    </h3>

                                    <p
                                        className="
                                            text-[#131E4A]/70

                                            text-[12px]

                                            font-semibold

                                            mt-1
                                        "
                                    >
                                        Countries Reached
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* ================= CONTENT ================= */}

                    <div className="lg:pl-3">

                        <span
                            className="
                                text-[#2168D8]

                                text-[12px]

                                font-bold

                                uppercase
                                tracking-[2px]
                            "
                        >
                            Global Learning Network
                        </span>


                        <h2
                            className="
                                text-[#131E4A]

                                text-[28px]
                                md:text-[36px]

                                font-bold

                                leading-[1.3]

                                mt-3
                            "
                        >
                            Connecting Learners

                            <span className="text-[#2168D8]">
                                {" "}Across The World
                            </span>

                        </h2>


                        <div
                            className="
                                w-[55px]
                                h-[3px]

                                bg-[#FFDB58]

                                mt-5
                            "
                        />


                        <p
                            className="
                                text-[#64748B]

                                text-[15px]
                                md:text-[16px]

                                leading-[1.9]

                                mt-6
                            "
                        >
                            Broadbeach Online Academy has built a growing
                            international learning community by providing
                            professional training programs designed around
                            globally accepted standards and modern
                            industry requirements.
                        </p>


                        <p
                            className="
                                text-[#64748B]

                                text-[15px]
                                md:text-[16px]

                                leading-[1.9]

                                mt-4
                            "
                        >
                            Our digital learning environment allows
                            professionals from different countries,
                            industries and backgrounds to access
                            high-quality training wherever they are.
                        </p>



                        {/* FEATURES */}

                        <div className="mt-7 space-y-4">

                            <Feature
                                text="Internationally aligned professional courses"
                            />

                            <Feature
                                text="Industry experienced trainers and auditors"
                            />

                            <Feature
                                text="Accessible online learning across multiple countries"
                            />

                            <Feature
                                text="Globally recognized certification standards"
                            />

                        </div>

                    </div>

                </div>

            </section>



            {/* =================================================
                GLOBAL STATISTICS
            ================================================== */}

            <section
                className="
                    bg-[#131E4A]

                    py-12
                    md:py-16
                "
            >

                <div
                    className="
                        max-w-[1200px]
                        mx-auto

                        px-5
                        md:px-8
                    "
                >

                    <div
                        className="
                            grid

                            grid-cols-2
                            lg:grid-cols-4

                            gap-y-9
                        "
                    >

                        {stats.map((stat, index) => (

                            <div
                                key={stat.id}
                                className={`
                                    text-center

                                    px-4

                                    ${
                                        index !== stats.length - 1
                                            ? "lg:border-r lg:border-white/15"
                                            : ""
                                    }
                                `}
                            >

                                <div
                                    className="
                                        text-[#FFDB58]

                                        text-[28px]

                                        flex
                                        justify-center

                                        mb-3
                                    "
                                >
                                    {stat.icon}
                                </div>


                                <h3
                                    className="
                                        text-white

                                        text-[26px]
                                        md:text-[32px]

                                        font-bold
                                    "
                                >
                                    {stat.number}
                                </h3>


                                <p
                                    className="
                                        text-white/60

                                        text-[12px]
                                        md:text-[14px]

                                        mt-1
                                    "
                                >
                                    {stat.label}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>



            {/* =================================================
                CERTIFICATE CAROUSEL
            ================================================== */}

            <section
                className="
                    bg-[#F5F8FC]

                    py-14
                    md:py-20
                "
            >

                <div
                    className="
                        max-w-[1300px]
                        mx-auto

                        px-5
                        md:px-8
                    "
                >


                    {/* ================= HEADING ================= */}

                    <div className="text-center">

                        <span
                            className="
                                text-[#2168D8]

                                text-[12px]

                                font-bold

                                uppercase
                                tracking-[2px]
                            "
                        >
                            Recognition & Standards
                        </span>


                        <h2
                            className="
                                text-[#131E4A]

                                text-[28px]
                                md:text-[36px]

                                font-bold

                                mt-2
                            "
                        >
                            Our

                            <span className="text-[#2168D8]">
                                {" "}Certifications
                            </span>
                        </h2>


                        <div
                            className="
                                w-[65px]
                                h-[3px]

                                bg-[#FFDB58]

                                mx-auto

                                mt-4
                            "
                        />


                        <p
                            className="
                                max-w-[720px]

                                mx-auto

                                text-[#64748B]

                                text-[14px]
                                md:text-[16px]

                                leading-[1.8]

                                mt-5
                            "
                        >
                            Our certifications and accreditations
                            demonstrate our commitment to maintaining
                            internationally recognized standards of
                            quality, training and professional excellence.
                        </p>

                    </div>



                    {/* ================= CAROUSEL ================= */}

                    <div
                        className="
                            relative

                            mt-10
                            md:mt-12

                            px-0
                            md:px-12
                        "
                    >


                        <Swiper

                            modules={[
                                Navigation,
                                Pagination,
                                Autoplay,
                            ]}

                            spaceBetween={24}

                            slidesPerView={1}

                            loop={true}

                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}

                            navigation={{
                                prevEl: ".certificate-prev",
                                nextEl: ".certificate-next",
                            }}

                            pagination={{
                                clickable: true,
                                el: ".certificate-pagination",
                            }}

                            breakpoints={{

                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },

                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 25,
                                },

                            }}

                            className="certificateSwiper"
                        >

                            {certificates.map((certificate) => (

                                <SwiperSlide
                                    key={certificate.id}
                                    className="h-auto"
                                >

                                    <CertificateCard
                                        certificate={certificate}
                                    />

                                </SwiperSlide>

                            ))}

                        </Swiper>



                        {/* ================= PREVIOUS ================= */}

                        <button
                            type="button"
                            aria-label="Previous certificate"
                            className="
                                certificate-prev

                                hidden
                                md:flex

                                absolute

                                left-0
                                top-[42%]

                                -translate-y-1/2

                                z-20

                                w-10
                                h-10

                                rounded-full

                                bg-[#131E4A]
                                text-white

                                items-center
                                justify-center

                                shadow-lg

                                hover:bg-[#FFDB58]
                                hover:text-[#131E4A]

                                transition-all
                                duration-300
                            "
                        >
                            <ChevronLeft size={20} />
                        </button>



                        {/* ================= NEXT ================= */}

                        <button
                            type="button"
                            aria-label="Next certificate"
                            className="
                                certificate-next

                                hidden
                                md:flex

                                absolute

                                right-0
                                top-[42%]

                                -translate-y-1/2

                                z-20

                                w-10
                                h-10

                                rounded-full

                                bg-[#131E4A]
                                text-white

                                items-center
                                justify-center

                                shadow-lg

                                hover:bg-[#FFDB58]
                                hover:text-[#131E4A]

                                transition-all
                                duration-300
                            "
                        >
                            <ChevronRight size={20} />
                        </button>



                        {/* ================= PAGINATION ================= */}

                        <div
                            className="
                                certificate-pagination

                                flex
                                justify-center

                                mt-8
                            "
                        />

                    </div>

                </div>

            </section>



            {/* =================================================
                GLOBAL EDUCATION
            ================================================== */}

            <section className="py-14 md:py-20">

                <div
                    className="
                        max-w-[1200px]
                        mx-auto

                        px-5
                        md:px-8

                        grid
                        lg:grid-cols-[1.05fr_0.95fr]

                        gap-10
                        lg:gap-16

                        items-center
                    "
                >


                    {/* ================= CONTENT ================= */}

                    <div>

                        <span
                            className="
                                text-[#2168D8]

                                text-[12px]

                                uppercase
                                tracking-[2px]

                                font-bold
                            "
                        >
                            Education Without Borders
                        </span>


                        <h2
                            className="
                                text-[#131E4A]

                                text-[28px]
                                md:text-[36px]

                                leading-[1.3]

                                font-bold

                                mt-3
                            "
                        >
                            One Academy.

                            <span className="text-[#2168D8]">
                                {" "}Global Opportunities.
                            </span>
                        </h2>


                        <div
                            className="
                                w-[55px]
                                h-[3px]

                                bg-[#FFDB58]

                                mt-5
                            "
                        />


                        <p
                            className="
                                text-[#64748B]

                                text-[15px]
                                md:text-[16px]

                                leading-[1.9]

                                mt-6
                            "
                        >
                            Geography should never limit professional
                            growth. Our online learning ecosystem brings
                            high-quality certification training directly
                            to professionals regardless of their
                            location.
                        </p>


                        <p
                            className="
                                text-[#64748B]

                                text-[15px]
                                md:text-[16px]

                                leading-[1.9]

                                mt-4
                            "
                        >
                            By combining expert instructors, structured
                            learning programs and internationally aligned
                            standards, we help learners strengthen their
                            skills and prepare for opportunities in the
                            global marketplace.
                        </p>


                        <button
                            type="button"
                            className="
                                mt-7

                                inline-flex
                                items-center
                                gap-3

                                bg-[#131E4A]
                                text-white

                                px-6
                                py-3

                                rounded-md

                                text-[14px]

                                font-semibold

                                hover:bg-[#FFDB58]
                                hover:text-[#131E4A]

                                transition-all
                                duration-300
                            "
                        >
                            Explore Our Courses

                            <FaArrowRight
                                className="text-[12px]"
                            />

                        </button>

                    </div>



                    {/* ================= IMAGE ================= */}

                    <div
                        className="
                            relative

                            h-[320px]
                            md:h-[430px]

                            rounded-xl

                            overflow-hidden
                        "
                    >

                        <img
                            src={`${assets}/about/global-footprints/global-learning.jpg`}
                            alt="Global Online Learning"
                            className="
                                w-full
                                h-full

                                object-cover
                            "
                        />


                        <div
                            className="
                                absolute
                                inset-0

                                bg-gradient-to-t

                                from-[#131E4A]/50
                                to-transparent
                            "
                        />

                    </div>

                </div>

            </section>



            {/* =================================================
                CTA
            ================================================== */}

            <section className="bg-[#131E4A]">

                <div
                    className="
                        max-w-[1200px]
                        mx-auto

                        px-5
                        md:px-8

                        py-12
                        md:py-16

                        flex
                        flex-col
                        md:flex-row

                        items-center
                        justify-between

                        gap-7
                    "
                >

                    <div className="text-center md:text-left">

                        <span
                            className="
                                text-[#FFDB58]

                                text-[12px]

                                uppercase
                                tracking-[2px]

                                font-bold
                            "
                        >
                            Join Our Global Community
                        </span>


                        <h2
                            className="
                                text-white

                                text-[25px]
                                md:text-[32px]

                                font-bold

                                mt-2
                            "
                        >
                            Learn Today. Lead Anywhere.
                        </h2>


                        <p
                            className="
                                text-white/65

                                text-[14px]

                                mt-2
                            "
                        >
                            Join professionals around the world building
                            their careers with Broadbeach Online Academy.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="
                            shrink-0

                            bg-[#FFDB58]
                            text-[#131E4A]

                            px-7
                            py-3.5

                            rounded-md

                            text-[14px]

                            font-bold

                            hover:bg-white

                            transition-colors
                            duration-300
                        "
                    >
                        Enroll Now
                    </button>

                </div>

            </section>

        </main>

    );

};



/* ==========================================================
   CERTIFICATE CARD
========================================================== */

const CertificateCard = ({ certificate }) => {

    return (

        <div
            className="
                group

                bg-white

                rounded-[8px]

                overflow-hidden

                border
                border-[#E5EAF0]

                shadow-[0_5px_25px_rgba(11,49,91,0.06)]

                hover:-translate-y-1
                hover:shadow-[0_15px_35px_rgba(11,49,91,0.12)]

                transition-all
                duration-300

                h-full
            "
        >


            {/* CERTIFICATE IMAGE */}

            <div
                className="
                    h-[360px]
                    md:h-[390px]

                    p-5

                    bg-[#FAFBFC]

                    flex
                    items-center
                    justify-center

                    overflow-hidden
                "
            >

                <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="
                        max-w-full
                        max-h-full

                        object-contain

                        group-hover:scale-[1.02]

                        transition-transform
                        duration-500
                    "
                />

            </div>



            {/* CONTENT */}

            <div
                className="
                    border-t
                    border-[#EDF0F4]

                    p-5

                    text-center
                "
            >

                <h3
                    className="
                        text-[#131E4A]

                        text-[16px]

                        font-bold
                    "
                >
                    {certificate.title}
                </h3>


                <p
                    className="
                        text-[#64748B]

                        text-[12px]

                        mt-1
                    "
                >
                    {certificate.subtitle}
                </p>

            </div>

        </div>

    );

};



/* ==========================================================
   FEATURE
========================================================== */

const Feature = ({ text }) => {

    return (

        <div className="flex items-start gap-3">

            <FaCheckCircle
                className="
                    text-[#2168D8]

                    text-[17px]

                    mt-[4px]

                    shrink-0
                "
            />


            <p
                className="
                    text-[#334155]

                    text-[14px]
                    md:text-[15px]

                    leading-[1.7]
                "
            >
                {text}
            </p>

        </div>

    );

};


export default Accreditations ;