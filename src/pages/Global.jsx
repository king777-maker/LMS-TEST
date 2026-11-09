import GallerySection from "./GallerySection";
import ImageCard from "./ImageCard";
import SectionTitle from "./SectionTitle";
import SeeMoreButton from "./SeeMoreButton";

const Global = () => {
    const assets = import.meta.env.VITE_ASSETS_URL;

    const designImages = [
        `${assets}/about/design-1.jpg`,
        `${assets}/about/design-2.jpg`,
        `${assets}/about/design-3.jpg`,
        `${assets}/about/design-4.jpg`,
    ];

    const capabilityImages = [
        `${assets}/about/capability-1.jpg`,
        `${assets}/about/capability-2.jpg`,
        `${assets}/about/capability-3.jpg`,
        `${assets}/about/capability-4.jpg`,
    ];

    const qualityImages = [
        `${assets}/about/quality-1.jpg`,
        `${assets}/about/quality-2.jpg`,
        `${assets}/about/quality-3.jpg`,
        `${assets}/about/quality-4.jpg`,
    ];

    const logisticsImages = [
        `${assets}/about/logistics-1.jpg`,
        `${assets}/about/logistics-2.jpg`,
        `${assets}/about/logistics-3.jpg`,
        `${assets}/about/logistics-4.jpg`,
    ];

    return (
        <main className="bg-white text-[#252525]">

            {/* =====================================
                PAGE TITLE
            ====================================== */}
            <section className="pt-14 md:pt-16 pb-8">
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <SectionTitle title="ABOUT US" center />

                </div>
            </section>


            {/* =====================================
                HISTORY
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            grid
                            lg:grid-cols-2
                            gap-8 lg:gap-12
                            items-center
                            pb-12
                            border-b border-gray-300
                        "
                    >
                        <div>


                            <p className="text-[#0062A8] text-[18px] md:text-[20px] leading-[1.55] mt-5">
                                Over the last 11 years Verga has evolved to be the
                                leading custom built manufacturer of the excavator
                                attachments in the global Markets.
                            </p>

                            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.9]">
                                Today, Verga is a premier, global leader in design,
                                engineering and manufacturing of excavator attachments
                                for construction, Agriculture, Forestry, Landscaping
                                and Mining industries. Verga has over 400 associates
                                operating at 2 facilities to support our customers on
                                global platforms with a focus on quality, and
                                operational excellence.
                            </p>

                        </div>


                        <ImageCard
                            src={`${assets}/about/history.jpg`}
                            alt="Company History"
                            className="h-[280px] md:h-[330px]"
                        />

                    </div>

                </div>
            </section>


            {/* =====================================
                VISION / MISSION / VALUES
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            grid
                            md:grid-cols-2
                            gap-8
                            py-10
                            border-b border-gray-300
                        "
                    >

                        <ImageCard
                            src={`${assets}/about/vision-mission.jpg`}
                            alt="Our Vision and Mission"
                            className="h-[350px] lg:h-[430px]"
                        />

                        <ImageCard
                            src={`${assets}/about/values.jpg`}
                            alt="Our Values"
                            className="h-[350px] lg:h-[430px]"
                        />

                    </div>

                </div>
            </section>


            {/* =====================================
                GOVERNANCE POLICY
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            grid
                            lg:grid-cols-2
                            gap-8 lg:gap-12
                            items-center
                            py-10
                            border-b border-gray-300
                        "
                    >

                        <div>

                            <SectionTitle title="GOVERNANCE POLICY" />

                            <p className="mt-5 text-[16px] md:text-[17px] leading-[1.9]">
                                We at Verga are committed to highest standards of
                                corporate governance in all the activities we
                                undertake. Verga looks at corporate governance as the
                                cornerstone for all performance sustained superior for
                                serving all the Employees.
                            </p>

                            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.9]">
                                Apart from drawing from the various legal provisions,
                                the Verga practices are continuously benchmarked with
                                industry practices. The entire process begins with the
                                functioning of the Board of Directors, with leading
                                professionals and experts serving as independent
                                Consultant. Key elements in corporate governance, we
                                believe are integrity, transparency, internal controls,
                                risk management, internal/external communications and
                                good standards of safety and health.
                            </p>

                        </div>


                        <ImageCard
                            src={`${assets}/about/governance.jpg`}
                            alt="Governance Policy"
                            className="h-[350px] md:h-[430px]"
                        />

                    </div>

                </div>
            </section>


            {/* =====================================
                DESIGN
            ====================================== */}
            <GallerySection
                title="DESIGN"
                description="Our highly experienced product design team is responsible for turning special requirements of our customers into innovative and cost-effective products."
                paragraph="The committed design team is equipped to conduct reverse engineering (RE) and value engineering (VE) in addition to New Part Development (NPD) as required. They leverage full-fledged 2D and 3D design facilities as they execute the design."
                images={designImages}
            />


            {/* =====================================
                CERTIFICATIONS
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div className="py-10 border-b border-gray-300">

                        <SectionTitle
                            title="CERTIFICATIONS"
                            center
                        />

                        <p
                            className="
                                max-w-[1200px]
                                mx-auto
                                mt-5
                                text-center
                                text-[16px] md:text-[17px]
                                leading-[1.8]
                            "
                        >
                            Verga use management systems as a driver for continual
                            improvement & sustainable growth. Our certified systems
                            ensure our products and services meet our customers’
                            needs and expectations.
                        </p>


                        <div
                            className="
                                grid
                                md:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                                mt-10
                            "
                        >

                            <ImageCard
                                src={`${assets}/about/certificate-1.jpg`}
                                alt="ISO 9001 Certificate"
                                className="h-[480px]"
                                contain
                            />

                            <ImageCard
                                src={`${assets}/about/certificate-2.jpg`}
                                alt="ISO 14001 Certificate"
                                className="h-[480px]"
                                contain
                            />

                            <ImageCard
                                src={`${assets}/about/certificate-3.jpg`}
                                alt="Hardox Certificate"
                                className="h-[480px]"
                                contain
                            />

                        </div>

                    </div>

                </div>
            </section>


            {/* =====================================
                NEW PRODUCT DEVELOPMENT
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            grid
                            lg:grid-cols-2
                            gap-8 lg:gap-12
                            items-center
                            py-10
                            border-b border-gray-300
                        "
                    >

                        <ImageCard
                            src={`${assets}/about/product-development.jpg`}
                            alt="New Product Development"
                            className="h-[340px]"
                            contain
                        />


                        <div>

                            <SectionTitle title="NEW PRODUCT DEVELOPMENT" />

                            <p className="mt-5 text-[#0062A8] text-[18px] md:text-[20px] leading-[1.55]">
                                We owe our success to deep innovation in our
                                approach. Continuous innovation is made possible by
                                our talented and resourceful workforce. Our Prototype
                                Development process executes the products the right
                                first time and every time.
                            </p>

                            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.9]">
                                Our NPD (New Part Development) team is united by a
                                wealth of experience and technical knowledge built
                                over the years of serving more than 245 customers
                                worldwide. They work closely with our customers from
                                Design, Development through Production stages to
                                ensure flawless final product through smooth
                                execution.
                            </p>

                        </div>

                    </div>

                </div>
            </section>


            {/* =====================================
                STEELS WE USE
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            grid
                            lg:grid-cols-2
                            gap-8 lg:gap-12
                            items-center
                            py-10
                            border-b border-gray-300
                        "
                    >

                        <div>

                            <SectionTitle title="STEELS WE USE" />

                            <p className="mt-5 text-[#0062A8] text-[18px] md:text-[20px] leading-[1.55]">
                                We use wear and abrasion resistant, high strength
                                steel plates that make sturdy attachments suited for
                                long service in extreme field conditions.
                            </p>

                            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.8]">
                                We use a wide variety of high grade steel alloys and
                                castings based on customer requirements. The
                                materials we use range from:
                            </p>


                            <ul className="mt-4 space-y-3">

                                {[
                                    "E350, S235, S355 EN grade Structural Steels",
                                    "Weldox S690QL",
                                    "Hardox HB400®, HB450®, HB 500®",
                                    "Bars : EN8D, 25MnCr5, 20CrMo4, 20MnV6",
                                    "Imported High grade Casted GETs",
                                ].map((item) => (

                                    <li
                                        key={item}
                                        className="
                                            flex
                                            items-start
                                            gap-4
                                            text-[16px]
                                        "
                                    >
                                        <span className="text-[#0062A8] text-2xl leading-none">
                                            ›
                                        </span>

                                        {item}

                                    </li>

                                ))}

                            </ul>

                        </div>


                        <ImageCard
                            src={`${assets}/about/steels.jpg`}
                            alt="Steels We Use"
                            className="h-[370px]"
                            contain
                        />

                    </div>

                </div>
            </section>


            {/* =====================================
                WELDING STANDARDS
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div
                        className="
                            grid
                            lg:grid-cols-2
                            gap-8 lg:gap-12
                            items-center
                            py-10
                            border-b border-gray-300
                        "
                    >

                        <ImageCard
                            src={`${assets}/about/welding.jpg`}
                            alt="Welding Standards"
                            className="h-[350px]"
                        />


                        <div>

                            <SectionTitle title="WELDING STANDARDS" />

                            <p className="mt-5 text-[#0062A8] text-[18px] md:text-[20px] leading-[1.55]">
                                Welding is both an art and a science for us here at
                                Verga. Our certified welders don’t just ‘pass code’,
                                but, their welds must be both structurally sound and
                                aesthetically pleasing.
                            </p>

                            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.9]">
                                Our welding experts are certified in high quality
                                structural welding as per AWS D1.1 and EN 1090-1 as
                                well as EN/ISO 9606, EN/ISO 14732 and EN/ISO
                                15611-15614. They are also trained in various
                                specific processes such as material selection and
                                defect detection in order to meet the highest
                                standards.
                            </p>

                            <p className="mt-3 text-[16px] md:text-[17px] leading-[1.9]">
                                Our welding inspections are done in accordance with
                                ASNT E1417 and the inspectors are certified as per
                                SNT-TC-1A.
                            </p>

                        </div>

                    </div>

                </div>
            </section>


            {/* =====================================
                CAPABILITIES
            ====================================== */}
            <GallerySection
                title="CAPABILITIES"
                description="The crux of our manufacturing operations is our plants established in the industrial area of Malur, Kolar District near the city of Bangalore, India."
                paragraph="We have an installed capacity of 1000 tons/month. Our 400-strong team of designers and manufacturing professionals look forward to addressing your specific business requirements. We had additional space of 30000 square feet that can be used to expand our capacity even further."
                images={capabilityImages}
            />


            {/* =====================================
                QUALITY
            ====================================== */}
            <GallerySection
                title="QUALITY"
                description="We abide by the highest international standards for quality. Our workforce is trained and certified in the quality practices and we have streamlined and standardized our production facilities."
                paragraph="We practice inspection techniques certified by the world’s leading certification bodies. The 5-gate inspection process ensures high quality and yield. Our welders are certified on AWS D1.1, EN/ISO 9606, EN/ISO 14732 and EN/ISO 15611-15614. Welding Inspections are done in accordance with ASNT E1417 and inspectors are certified per SNT-TC-1A. With these extensive standardized techniques and processes, quality is assured with Verga."
                images={qualityImages}
            />


            {/* =====================================
                LOGISTICS
            ====================================== */}
            <section>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8">

                    <div className="py-10">

                        <SectionTitle
                            title="LOGISTICS"
                            center
                        />

                        <p
                            className="
                                max-w-[1250px]
                                mx-auto
                                mt-5
                                text-center
                                text-[#0062A8]
                                text-[18px] md:text-[20px]
                                leading-[1.55]
                            "
                        >
                            Our exclusive international logistics network is
                            selected very cautiously through a carefully screened
                            selection process in order to ensure superior quality
                            and reliability of freight transport.
                        </p>

                        <p
                            className="
                                max-w-[1200px]
                                mx-auto
                                mt-4
                                text-center
                                text-[16px] md:text-[17px]
                                leading-[1.8]
                            "
                        >
                            We consider logistics to be an important and integrated
                            business capability in order to move right things at the
                            right speed and the right time. We enjoy easy
                            connectivity to air and sea transportation and is
                            time-tested and extremely reliable.
                        </p>


                        {/* WORLD MAP */}

                        <div className="mt-10">

                            <img
                                src={`${assets}/about/world-map.png`}
                                alt="Global Logistics Network"
                                className="
                                    w-full
                                    max-w-[1000px]
                                    mx-auto
                                    object-contain
                                "
                            />

                        </div>


                        {/* LOGISTICS IMAGES */}

                        <div
                            className="
                                grid
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4
                                mt-10
                            "
                        >

                            {logisticsImages.map((image, index) => (

                                <ImageCard
                                    key={index}
                                    src={image}
                                    alt={`Logistics ${index + 1}`}
                                    className="h-[190px]"
                                />

                            ))}

                        </div>


                        <div className="flex justify-center mt-5">

                            <SeeMoreButton />

                        </div>

                    </div>

                </div>
            </section>
            {/* =====================================================
    GLOBAL REACH MAP SECTION
===================================================== */}

            <section className="bg-white py-12 md:py-16">

                <div className="max-w-[1200px] mx-auto px-5 md:px-8">

                    {/* HEADING */}
                    <div className="text-center max-w-[850px] mx-auto">

                        <span
                            className="
                    text-[#2168D8]
                    text-[12px]
                    md:text-[13px]
                    font-bold
                    uppercase
                    tracking-[2px]
                "
                        >
                            Our Worldwide Presence
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
                            Connecting Learners{" "}
                            <span className="text-[#2168D8]">
                                Across the Globe
                            </span>
                        </h2>

                        {/* LINE */}
                        <div
                            className="
                    w-[60px]
                    h-[3px]
                    bg-[#FFDB58]
                    mx-auto
                    mt-4
                "
                        />

                        <p
                            className="
                    text-[#64748B]
                    text-[14px]
                    md:text-[16px]
                    leading-[1.8]
                    mt-5
                "
                        >
                            Broadbeach Online Academy connects professionals
                            across countries through internationally recognized
                            certification programs and industry-focused learning.
                        </p>

                    </div>


                    {/* ================= MAP ================= */}

                    <div
                        className="
                max-w-[950px]
                mx-auto

                mt-8
                md:mt-10

                flex
                justify-center
            "
                    >

                        <img
                            src="https://www.verga.biz/images/logistics.jpg"
                            alt="Broadbeach Online Academy Global Presence"
                            className="
                    w-full
                    max-h-[430px]
                    object-contain
                "
                        />

                    </div>


                    {/* ================= STATS ================= */}

                    <div
                        className="
                max-w-[800px]
                mx-auto

                mt-8

                grid
                grid-cols-3

                border-t
                border-[#E2E8F0]

                pt-6
            "
                    >

                        {/* COUNTRIES */}
                        <div
                            className="
                    text-center
                    border-r
                    border-[#E2E8F0]
                    px-2
                "
                        >
                            <h3
                                className="
                        text-[#2168D8]
                        text-[22px]
                        md:text-[28px]
                        font-bold
                    "
                            >
                                45+
                            </h3>

                            <p
                                className="
                        text-[#64748B]
                        text-[11px]
                        md:text-[13px]
                        mt-1
                    "
                            >
                                Countries Reached
                            </p>
                        </div>


                        {/* STUDENTS */}
                        <div
                            className="
                    text-center
                    border-r
                    border-[#E2E8F0]
                    px-2
                "
                        >
                            <h3
                                className="
                        text-[#2168D8]
                        text-[22px]
                        md:text-[28px]
                        font-bold
                    "
                            >
                                10K+
                            </h3>

                            <p
                                className="
                        text-[#64748B]
                        text-[11px]
                        md:text-[13px]
                        mt-1
                    "
                            >
                                Global Learners
                            </p>
                        </div>


                        {/* COURSES */}
                        <div className="text-center px-2">

                            <h3
                                className="
                        text-[#2168D8]
                        text-[22px]
                        md:text-[28px]
                        font-bold
                    "
                            >
                                150+
                            </h3>

                            <p
                                className="
                        text-[#64748B]
                        text-[11px]
                        md:text-[13px]
                        mt-1
                    "
                            >
                                Professional Courses
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            <GallerySection />
            <ImageCard />
        </main>
    );


};


export default Global;