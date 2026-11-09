import {
    FaLinkedinIn,
    FaUsers,
    FaGlobe,
    FaAward,
    FaGraduationCap,
} from "react-icons/fa";


const Ourcoustmers = () => {

    const assets = import.meta.env.VITE_ASSETS_URL;


    // ==========================================
    // TEAM MEMBERS
    // Replace with API data later if required
    // ==========================================

    const teamMembers = [
        {
            id: 1,
            name: "John Anderson",
            designation: "Chief Executive Officer",
            image: `${assets}/about/team/member-1.jpg`,
            linkedin: "#",
        },
        {
            id: 2,
            name: "Sarah Williams",
            designation: "Head of Training",
            image: `${assets}/about/team/member-2.jpg`,
            linkedin: "#",
        },
        {
            id: 3,
            name: "Michael Brown",
            designation: "Director of Operations",
            image: `${assets}/about/team/member-3.jpg`,
            linkedin: "#",
        },
        {
            id: 4,
            name: "Emma Wilson",
            designation: "Learning & Development Head",
            image: `${assets}/about/team/member-4.jpg`,
            linkedin: "#",
        },
    ];


    const stats = [
        {
            id: 1,
            icon: <FaUsers />,
            number: "25+",
            label: "Industry Experts",
        },
        {
            id: 2,
            icon: <FaGraduationCap />,
            number: "150+",
            label: "Professional Courses",
        },
        {
            id: 3,
            icon: <FaGlobe />,
            number: "45+",
            label: "Countries Reached",
        },
        {
            id: 4,
            icon: <FaAward />,
            number: "10+",
            label: "Years of Excellence",
        },
    ];


    return (

        <main className="bg-white">


            {/* =================================================
                PAGE HEADING
            ================================================== */}

            <section className="pt-14 md:pt-16 pb-8">

                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <SectionTitle
                        title="Our coustmers"
                        center
                    />

                    <p
                        className="
                            max-w-[780px]
                            mx-auto
                            mt-5

                            text-center

                            text-[#64748B]
                            text-[15px]
                            md:text-[17px]

                            leading-[1.8]
                        "
                    >
                        Meet the passionate professionals behind
                        Broadbeach Online Academy who are committed to
                        delivering exceptional learning experiences
                        across the globe.
                    </p>

                </div>

            </section>



            {/* =================================================
                WIDE TEAM IMAGE
                COMPULSORY SECTION
            ================================================== */}

            <section>

                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            relative

                            w-full

                            h-[260px]
                            sm:h-[350px]
                            md:h-[450px]
                            lg:h-[520px]

                            overflow-hidden

                            rounded-[6px]
                        "
                    >

                        <img
                            src={`${assets}/about/team/team-wide.jpg`}
                            alt="Broadbeach Online Academy Team"
                            className="
                                absolute
                                inset-0

                                w-full
                                h-full

                                object-cover
                            "
                        />


                        {/* DARK GRADIENT */}

                        <div
                            className="
                                absolute
                                inset-0

                                bg-gradient-to-t
                                from-[#071F3A]/80
                                via-[#071F3A]/15
                                to-transparent
                            "
                        />


                        {/* IMAGE CONTENT */}

                        <div
                            className="
                                absolute

                                bottom-0
                                left-0

                                p-5
                                sm:p-7
                                md:p-10

                                max-w-[720px]
                            "
                        >

                            <span
                                className="
                                    inline-block

                                    bg-[#FFDB58]
                                    text-[#131E4A]

                                    px-4
                                    py-1.5

                                    rounded

                                    text-[12px]
                                    md:text-[13px]

                                    font-bold

                                    uppercase
                                    tracking-[1px]
                                "
                            >
                                The People Behind Our Success
                            </span>


                            <h2
                                className="
                                    mt-4

                                    text-white

                                    text-[24px]
                                    sm:text-[30px]
                                    md:text-[38px]

                                    font-bold

                                    leading-[1.2]
                                "
                            >
                                Expertise That Inspires.
                                <br />

                                <span className="text-[#FFDB58]">
                                    Leadership That Delivers.
                                </span>

                            </h2>

                        </div>

                    </div>

                </div>

            </section>



            {/* =================================================
                INTRODUCTION
            ================================================== */}

            <section className="py-14 md:py-20">

                <div
                    className="
                        max-w-[1200px]
                        mx-auto

                        px-5
                        md:px-8

                        grid
                        lg:grid-cols-[0.75fr_1.25fr]

                        gap-8
                        lg:gap-16
                    "
                >


                    {/* LEFT */}

                    <div>

                        <span
                            className="
                                text-[#2168D8]

                                text-[13px]

                                uppercase

                                tracking-[2px]

                                font-bold
                            "
                        >
                            Who We Are
                        </span>


                        <h2
                            className="
                                mt-3

                                text-[#131E4A]

                                text-[28px]
                                md:text-[36px]

                                font-bold

                                leading-[1.25]
                            "
                        >
                            A Team Driven By

                            <span className="text-[#2168D8]">
                                {" "}Knowledge & Excellence
                            </span>

                        </h2>


                        <div
                            className="
                                w-[60px]
                                h-[3px]

                                bg-[#FFDB58]

                                mt-5
                            "
                        />

                    </div>


                    {/* RIGHT */}

                    <div
                        className="
                            text-[#64748B]

                            text-[15px]
                            md:text-[16px]

                            leading-[1.9]
                        "
                    >

                        <p>
                            At Broadbeach Online Academy, our strength
                            lies in our people. Our coustmers brings together
                            experienced educators, industry professionals,
                            certification specialists, and learning
                            experts who share one common goal — helping
                            professionals build skills that create real
                            career opportunities.
                        </p>


                        <p className="mt-5">
                            With extensive experience across professional
                            certifications, auditing, quality management,
                            Lean Six Sigma, aerospace, and other
                            specialized disciplines, our experts ensure
                            every learner receives practical,
                            industry-relevant and globally recognized
                            training.
                        </p>

                    </div>

                </div>

            </section>



            {/* =================================================
                LEADERSHIP
            ================================================== */}

            <section className="bg-[#F5F8FC] py-14 md:py-20">

                <div className="max-w-[1440px] mx-auto px-5 md:px-8">


                    <SectionTitle
                        title="MEET OUR LEADERSHIP"
                        center
                    />


                    <p
                        className="
                            max-w-[700px]

                            mx-auto

                            mt-5

                            text-center

                            text-[#64748B]

                            text-[15px]
                            md:text-[16px]

                            leading-[1.8]
                        "
                    >
                        Experienced professionals committed to building
                        a world-class learning environment for our
                        students.
                    </p>



                    {/* TEAM GRID */}

                    <div
                        className="
                            grid

                            sm:grid-cols-2
                            lg:grid-cols-4

                            gap-6

                            mt-10
                        "
                    >

                        {teamMembers.map((member) => (

                            <TeamCard
                                key={member.id}
                                member={member}
                            />

                        ))}

                    </div>

                </div>

            </section>



            {/* =================================================
                STATS
            ================================================== */}

            <section className="py-14 md:py-20">

                <div className="max-w-[1200px] mx-auto px-5 md:px-8">


                    <div
                        className="
                            bg-[#131E4A]

                            rounded-xl

                            grid
                            grid-cols-2
                            lg:grid-cols-4

                            overflow-hidden
                        "
                    >

                        {stats.map((stat, index) => (

                            <div
                                key={stat.id}
                                className={`
                                    text-center

                                    px-4
                                    py-8
                                    md:py-10

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

                                        text-[27px]

                                        flex
                                        justify-center
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

                                        mt-3
                                    "
                                >
                                    {stat.number}
                                </h3>


                                <p
                                    className="
                                        text-white/70

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
                OUR CULTURE
            ================================================== */}

            <section className="pb-16 md:pb-20">

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


                    {/* IMAGE */}

                    <div
                        className="
                            relative

                            h-[320px]
                            md:h-[430px]
                        "
                    >

                        <img
                            src={`${assets}/about/team/team-culture.jpg`}
                            alt="Ourcoustmers Culture"
                            className="
                                w-full
                                h-full

                                object-cover

                                rounded-lg
                            "
                        />


                        <div
                            className="
                                absolute

                                -bottom-5
                                -right-3
                                md:-right-5

                                bg-[#FFDB58]

                                px-6
                                py-5

                                rounded-lg

                                shadow-lg
                            "
                        >

                            <p
                                className="
                                    text-[#131E4A]

                                    text-[24px]

                                    font-bold
                                "
                            >
                               Our coustmers
                            </p>

                            <p
                                className="
                                    text-[#131E4A]/70

                                    text-[13px]

                                    font-semibold
                                "
                            >
                                One Vision. Global Impact.
                            </p>

                        </div>

                    </div>



                    {/* CONTENT */}

                    <div>

                        <span
                            className="
                                text-[#2168D8]

                                text-[13px]

                                uppercase

                                tracking-[2px]

                                font-bold
                            "
                        >
                            Our Culture
                        </span>


                        <h2
                            className="
                                mt-3

                                text-[#131E4A]

                                text-[28px]
                                md:text-[36px]

                                font-bold

                                leading-[1.25]
                            "
                        >
                            Growing Together,
                            <span className="text-[#2168D8]">
                                {" "}Achieving More
                            </span>
                        </h2>


                        <p
                            className="
                                mt-5

                                text-[#64748B]

                                text-[15px]
                                md:text-[16px]

                                leading-[1.9]
                            "
                        >
                            We believe great learning experiences begin
                            with a great team. Collaboration, continuous
                            improvement and a passion for education shape
                            the way we work every day.
                        </p>


                        <div className="mt-7 space-y-5">

                            <CultureItem
                                number="01"
                                title="Expertise"
                                text="Industry knowledge backed by practical experience."
                            />

                            <CultureItem
                                number="02"
                                title="Collaboration"
                                text="Working together to create better learning outcomes."
                            />

                            <CultureItem
                                number="03"
                                title="Innovation"
                                text="Continuously improving how professional education is delivered."
                            />

                        </div>

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

                        <p
                            className="
                                text-[#FFDB58]

                                text-[12px]

                                uppercase
                                tracking-[2px]

                                font-bold
                            "
                        >
                            Learn From Industry Experts
                        </p>


                        <h2
                            className="
                                text-white

                                text-[25px]
                                md:text-[32px]

                                font-bold

                                mt-2
                            "
                        >
                            Ready to Start Your Learning Journey?
                        </h2>


                        <p
                            className="
                                text-white/65

                                text-[14px]

                                mt-2
                            "
                        >
                            Explore our professional courses and learn
                            from experienced industry professionals.
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
                        Explore Courses
                    </button>

                </div>

            </section>

        </main>
    );
};



/* =====================================================
   TEAM CARD
===================================================== */

const TeamCard = ({ member }) => {

    return (

        <div
            className="
                group

                bg-white

                rounded-lg

                overflow-hidden

                shadow-[0_5px_25px_rgba(0,0,0,0.07)]

                hover:-translate-y-2
                hover:shadow-[0_15px_35px_rgba(11,49,91,0.15)]

                transition-all
                duration-300
            "
        >


            <div className="relative h-[310px] overflow-hidden">

                <img
                    src={member.image}
                    alt={member.name}
                    className="
                        w-full
                        h-full

                        object-cover

                        group-hover:scale-105

                        transition-transform
                        duration-500
                    "
                />


                {/* LINKEDIN */}

                <a
                    href={member.linkedin}
                    className="
                        absolute

                        bottom-4
                        right-4

                        w-10
                        h-10

                        bg-[#FFDB58]
                        text-[#131E4A]

                        rounded-full

                        flex
                        items-center
                        justify-center

                        opacity-0
                        translate-y-3

                        group-hover:opacity-100
                        group-hover:translate-y-0

                        transition-all
                        duration-300
                    "
                >
                    <FaLinkedinIn />
                </a>

            </div>


            <div className="p-5 text-center">

                <h3
                    className="
                        text-[#131E4A]

                        text-[18px]

                        font-bold
                    "
                >
                    {member.name}
                </h3>


                <p
                    className="
                        text-[#2168D8]

                        text-[13px]

                        font-medium

                        mt-1
                    "
                >
                    {member.designation}
                </p>

            </div>

        </div>

    );
};



/* =====================================================
   CULTURE ITEM
===================================================== */

const CultureItem = ({
    number,
    title,
    text,
}) => {

    return (

        <div className="flex gap-4">

            <div
                className="
                    shrink-0

                    w-11
                    h-11

                    rounded-full

                    bg-[#FFF5C4]

                    text-[#131E4A]

                    flex
                    items-center
                    justify-center

                    text-[12px]

                    font-bold
                "
            >
                {number}
            </div>


            <div>

                <h3
                    className="
                        text-[#131E4A]

                        text-[16px]

                        font-bold
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                        text-[#64748B]

                        text-[14px]

                        leading-[1.7]

                        mt-1
                    "
                >
                    {text}
                </p>

            </div>

        </div>

    );
};



/* =====================================================
   SECTION TITLE
===================================================== */

const SectionTitle = ({
    title,
    center = false,
}) => {

    const words = title.split(" ");

    return (

        <div className={center ? "text-center" : ""}>

            <h2
                className="
                    text-[#131E4A]

                    text-[27px]
                    md:text-[34px]

                    font-bold
                "
            >

                {words.map((word, index) => (

                    <span
                        key={index}
                        className={
                            index === words.length - 1
                                ? "text-[#2168D8]"
                                : ""
                        }
                    >
                        {word}{" "}
                    </span>

                ))}

            </h2>


            <div
                className={`
                    w-[65px]
                    h-[3px]

                    bg-[#FFDB58]

                    mt-3

                    ${
                        center
                            ? "mx-auto"
                            : ""
                    }
                `}
            />

        </div>

    );
};


export default Ourcoustmers;