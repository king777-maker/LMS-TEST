import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaMedium,
    FaWhatsapp,
    FaXTwitter,
} from "react-icons/fa6";

import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#0D0D20] text-white pt-10">

            <div className="max-w-[1450px] mx-auto px-6">

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-16">

                    {/* ===========================
                        LOGO + ABOUT
                    ============================ */}

                    <div>

                        <Link to="/" className="inline-flex items-center select-none group mb-2" aria-label="Broadbeach Online Academy Home">
                            <img
                                src="/assets/brand-logo.svg"
                                alt="Broadbeach Online Academy"
                                className="h-10 sm:h-12 w-auto object-contain shadow-sm select-none transition-transform group-hover:scale-105 shrink-0"
                            />
                        </Link>

                        <p
                            className="
                                mt-8
                                !text-[15px]
                                md:!text-[16px]
                                lg:!text-[16px]
                                leading-7
                                text-white/80
                            "
                        >
                            Globally recognized professional certifications from an ISO 9001, 17012, and 21001 certified academy.
                        </p>


                        {/* Social Icons */}

                        <div className="flex gap-4 mt-10">



                            <a
                                href="https://www.facebook.com/broadbeach.innovations.71/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="
                                    w-12 h-12
                                    rounded-full
                                    bg-white
                                    text-[#0D0D20]
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-[#F7C600]
                                    hover:text-[#0D0D20]
                                    hover:-translate-y-1
                                    transition-all
                                    duration-300
                                "
                            >
                                <FaFacebookF size={18} />
                            </a>

                            <a
                                href="https://www.instagram.com/broadbeachinnovations"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="
                                    w-12 h-12
                                    rounded-full
                                    bg-white
                                    text-[#0D0D20]
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-[#F7C600]
                                    hover:text-[#0D0D20]
                                    hover:-translate-y-1
                                    transition-all
                                    duration-300
                                "
                            >
                                <FaInstagram size={18} />
                            </a>

                            <a
                                href="https://www.linkedin.com/company/37528405/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="
                                    w-12 h-12
                                    rounded-full
                                    bg-white
                                    text-[#0D0D20]
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-[#F7C600]
                                    hover:text-[#0D0D20]
                                    hover:-translate-y-1
                                    transition-all
                                    duration-300
                                "
                            >
                                <FaLinkedinIn size={18} />
                            </a>

                            <a
                                href="https://medium.com/@broadbeach.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Blogs on Medium"
                                title="Blogs"
                                className="
                                    w-12 h-12
                                    rounded-full
                                    bg-white
                                    text-[#0D0D20]
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-[#F7C600]
                                    hover:text-[#0D0D20]
                                    hover:-translate-y-1
                                    transition-all
                                    duration-300
                                "
                            >
                                <FaMedium size={18} />
                            </a>

                        </div>

                    </div>


                    {/* ===========================
                        USEFUL LINKS
                    ============================ */}

                    <div>

                        <h3
                            className="
            !text-[20px]
            md:!text-[21px]
            lg:!text-[22px]
            font-bold
            mb-2
            text-[#F7C600]
        "
                        >
                            Useful Links
                        </h3>

                        <ul
                            className="
            space-y-2
            !text-[15px]
            md:!text-[16px]
            lg:!text-[16px]
        "
                        >

                            {/* About Us */}
                            <li>
                                <Link
                                    to="/about-us"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    About Us
                                </Link>
                            </li>

                            {/* Terms & Conditions */}
                            <li>
                                <Link
                                    to="/terms-conditions"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Terms & Conditions
                                </Link>
                            </li>

                            {/* Privacy Policy */}
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                            {/* Cancellation & Refund Policy */}
                            <li>
                                <Link
                                    to="/cancellation-refund-policy"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Cancellation & Refund Policy
                                </Link>
                            </li>

                            {/* Raise a Ticket */}
                            <li>
                                <Link
                                    to="/raise-a-ticket"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Raise a Ticket
                                </Link>
                            </li>

                            {/* Cookie Policy */}
                            <li>
                                <Link
                                    to="/cookie-policy"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Cookie Policy
                                </Link>
                            </li>

                            {/* Data Protection Policy */}
                            <li>
                                <Link
                                    to="/data-protection-policy"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Data Protection Policy
                                </Link>
                            </li>

                            {/* Consent Mgmt policy */}
                            <li>
                                <Link
                                    to="/consent-management-policy"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                "
                                >
                                    Consent Mgmt policy
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* ===========================
                        COURSE CATEGORY
                    ============================ */}

                    <div>

                        <h3
                            className="
            !text-[20px]
            md:!text-[21px]
            lg:!text-[22px]
            font-bold
            mb-2
            text-[#F7C600]
        "
                        >
                            Course Category
                        </h3>

                        <ul
                            className="
            space-y-2
            !text-[15px]
            md:!text-[16px]
            lg:!text-[16px]
        "
                        >

                            {/* Lead Auditor */}
                            <li>
                                <a
                                    href="/category/lead-auditor"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Lead Auditor
                                </a>
                            </li>

                            {/* Internal Auditor */}
                            <li>
                                <a
                                    href="/category/internal-auditor"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Internal Auditor
                                </a>
                            </li>

                            {/* Lean Six Sigma */}
                            <li>
                                <a
                                    href="/category/lean-six-sigma"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Lean Six Sigma
                                </a>
                            </li>

                            {/* Aerospace Certifications */}
                            <li>
                                <a
                                    href="/category/aerospace"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Aerospace Certifications
                                </a>
                            </li>

                            {/* EHS Certifications */}
                            <li>
                                <a
                                    href="/category/health-safety-environment"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    EHS Certifications
                                </a>
                            </li>

                            {/* Management Certifications */}
                            <li>
                                <a
                                    href="/category/management-certifications"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Management Certifications
                                </a>
                            </li>

                            {/* Information Security */}
                            <li>
                                <a
                                    href="/category/information-security-business-continuity"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Information Security
                                </a>
                            </li>

                            {/* Environment */}
                            <li>
                                <a
                                    href="/category/environment"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Environment
                                </a>
                            </li>

                            {/* Food Safety */}
                            <li>
                                <a
                                    href="/category/food-safety"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Food Safety
                                </a>
                            </li>

                            {/* Verify Certificate */}
                            <li>
                                <a
                                    href="/broadbeachlearning.com/certificate-access"
                                    className="
                    text-white/80
                    hover:text-[#F7C600]
                    transition-colors
                    duration-300
                    no-underline
                "
                                >
                                    Verify Certificate
                                </a>
                            </li>

                        </ul>

                    </div>


                    {/* ===========================
                        CONTACT US
                    ============================ */}

                    <div>

                        <h3
                            className="
                                !text-[20px]
                                md:!text-[21px]
                                lg:!text-[22px]
                                font-bold
                                mb-2
                                text-[#F7C600]
                            "
                        >
                            Contact Us
                        </h3>

                        <div
                            className="
                                space-y-3
                                !text-[15px]
                                md:!text-[16px]
                                lg:!text-[16px]
                                leading-5
                                text-white/80
                            "
                        >

                            <div>
                                <p className="leading-relaxed">
                                    <span className="font-bold text-white">India HQ : </span>
                                    2201, 22nd Floor<br />
                                    World Trade Center Bengaluru
                                </p>
                            </div>

                            <div className="pt-1">
                                <span className="block font-bold text-white mb-1">
                                    International Offices
                                </span>
                                <p className="leading-relaxed">
                                    Canada, UK, Sweden, USA, Philippines<br />
                                    Qatar, UAE, Saudi Arabia, Singapore<br />
                                    USA
                                </p>
                            </div>


                            <div className="pt-4">

                                <div className="mb-4">
                                    <span className="block font-bold text-white mb-1">
                                        Phone:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href="tel:+917338649737"
                                            className="hover:text-[#F7C600] transition-colors duration-300 font-medium"
                                        >
                                            +91 7338 649 737
                                        </a>
                                        <a
                                            href="https://wa.me/917338649737?text=Hello%20Broadbeach%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20courses%20and%20certifications."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Chat on WhatsApp (+91 7338 649 737)"
                                            title="Chat on WhatsApp (+91 7338 649 737)"
                                            className="inline-flex items-center justify-center text-[#25D366] hover:text-emerald-300 transition-all duration-200 hover:scale-110 shrink-0 p-0.5"
                                        >
                                            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <span className="block font-bold text-white mb-1">
                                        Email:
                                    </span>
                                    <a
                                        href="mailto:certification@broadbeach.in"
                                        className="hover:text-[#F7C600] transition-colors duration-300 break-all"
                                    >
                                        certification@broadbeach.in
                                    </a>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ===========================
                COPYRIGHT
            ============================ */}

            <div
                className="
                    mt-20
                    border-t
                    border-white/10
                    bg-[#0A0A19]
                "
            >

                <div
                    className="
                        max-w-[1450px]
                        mx-auto
                        px-6
                        py-7
                        text-center
                    "
                >

                    <p
                        className="
                            text-white/80
                            !text-[15px]
                            md:!text-[16px]
                            lg:!text-[16px]
                        "
                    >
                        © Broadbeach 2026. All right reserved.


                    </p>

                </div>

            </div>

        </footer>
    );
};

export default Footer;