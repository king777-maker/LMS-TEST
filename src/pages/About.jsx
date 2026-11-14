import { Link } from "react-router-dom";
import { FaAward, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import AboutMission from "../components/AboutMission/AboutMission";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";

const About = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-[1400px] mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Image */}
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
                            alt="About"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                            }}
                            className="w-full h-[630px] object-cover rounded-[28px]"
                        />
                    </div>

                    {/* Right Content */}
                    <div>

                        <span className="text-[#2563EB] uppercase font-bold tracking-[2px] text-lg">
                            About Us
                        </span>

                        <h2 className="mt-6  !text-[15px]
                            md:!text-[16px]
                            lg:!text-[20px]
                        leading-[58px] font-bold text-[#1E3A66]">
                            Empowering Future Leaders Through Quality Education
                        </h2>

                        <p className="mt-8  !text-[15px] md:!text-[16px] lg:!text-[14px] leading-5 text-[#667085]">
                            Broadbeach Online Academy provides internationally
                            recognized certification and professional training
                            programs designed to help learners, professionals and
                            organizations achieve career growth, compliance and
                            continuous improvement.
                        </p>

                        <p className="mt-6 !text-[15px] md:!text-[16px] lg:!text-[14px] leading-5 text-[#667085]">
                            Our industry-leading instructors, globally accepted
                            certifications and practical learning approach make us
                            one of the trusted online education platforms worldwide.
                        </p>

                        {/* Statistics */}

                        <div className="grid grid-cols-3 gap-10 mt-14">

                            <div>
                                <div className="flex items-center gap-3">

                                    <FaAward className="text-[#2563EB] text-3xl" />

                                    <h3 className="!text-[15px] md:!text-[20px] lg:!text-[25px] font-bold text-[#2563EB]">
                                        15+
                                    </h3>

                                </div>

                                <p className="mt-3 text-[#1E3A66] !text-[15px] md:!text-[16px] lg:!text-[14px]">
                                    Years Experience
                                </p>

                            </div>

                            <div>

                                <div className="flex items-center gap-3">

                                    <FaChalkboardTeacher className="text-[#2563EB] !text-[15px] md:!text-[20px] lg:!text-[25px]" />

                                    <h3 className="!text-[15px] md:!text-[20px] lg:!text-[25px] font-bold text-[#2563EB]">
                                        200+
                                    </h3>

                                </div>

                                <p className="mt-3 text-[#1E3A66] !text-[15px] md:!text-[16px] lg:!text-[14px]">
                                    Expert Instructors
                                </p>

                            </div>

                            <div>

                                <div className="flex items-center gap-3">

                                    <FaUserGraduate className="text-[#2563EB] text-3xl" />

                                    <h3 className="!text-[15px] md:!text-[20px] lg:!text-[25px] font-bold text-[#2563EB]">
                                        50K+
                                    </h3>

                                </div>

                                <p className="mt-3 text-[#1E3A66] !text-[15px] md:!text-[16px] lg:!text-[14px]">
                                    Students
                                </p>

                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="flex gap-5 mt-16">

                            <button className="bg-[#2563EB] hover:bg-[#1E3A66] transition text-white rounded-full px-8 py-4 font-semibold text-lg">
                                Explore Courses
                            </button>

                            <button className="border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition rounded-full px-10 py-4 font-semibold text-lg">
                                Contact Us
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            
                <AboutMission />
                <WhyChooseUs/>
            
        </section>


    );
};

export default About;