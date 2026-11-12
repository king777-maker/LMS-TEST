import { useState, useEffect } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import {
    Mail,
    Phone,
    PhoneCall,
    MapPin,
    Check,
    ExternalLink,
    Send,
    Globe,
    Award
} from "lucide-react";
import toast from "react-hot-toast";
import { PRIMARY_CONTACT } from "../constants/contactInfo";
import { createTicket } from "../api/adminApi";

const COUNTRIES = [
    { name: "India", code: "IN", dial: "+91" },
    { name: "Saudi Arabia", code: "SA", dial: "+966" },
    { name: "United Arab Emirates", code: "AE", dial: "+971" },
    { name: "United Kingdom", code: "GB", dial: "+44" },
    { name: "United States", code: "US", dial: "+1" },
    { name: "Canada", code: "CA", dial: "+1" },
    { name: "Australia", code: "AU", dial: "+61" },
    { name: "Singapore", code: "SG", dial: "+65" },
    { name: "Qatar", code: "QA", dial: "+974" },
    { name: "Kuwait", code: "KW", dial: "+965" },
    { name: "Oman", code: "OM", dial: "+968" },
    { name: "Bahrain", code: "BH", dial: "+973" },
    { name: "Philippines", code: "PH", dial: "+63" },
    { name: "Nigeria", code: "NG", dial: "+234" },
    { name: "South Africa", code: "ZA", dial: "+27" },
    { name: "Malaysia", code: "MY", dial: "+60" },
    { name: "Germany", code: "DE", dial: "+49" },
    { name: "France", code: "FR", dial: "+33" },
    { name: "Netherlands", code: "NL", dial: "+31" },
    { name: "Ireland", code: "IE", dial: "+353" },
    { name: "New Zealand", code: "NZ", dial: "+64" },
    { name: "Switzerland", code: "CH", dial: "+41" },
    { name: "Sweden", code: "SE", dial: "+46" },
    { name: "Norway", code: "NO", dial: "+47" },
    { name: "Denmark", code: "DK", dial: "+45" },
    { name: "Italy", code: "IT", dial: "+39" },
    { name: "Spain", code: "ES", dial: "+34" },
    { name: "Japan", code: "JP", dial: "+81" },
    { name: "South Korea", code: "KR", dial: "+82" },
    { name: "Brazil", code: "BR", dial: "+55" },
    { name: "Mexico", code: "MX", dial: "+52" },
    { name: "Egypt", code: "EG", dial: "+20" },
    { name: "Kenya", code: "KE", dial: "+254" },
    { name: "Ghana", code: "GH", dial: "+233" },
    { name: "Bangladesh", code: "BD", dial: "+880" },
    { name: "Pakistan", code: "PK", dial: "+92" },
    { name: "Sri Lanka", code: "LK", dial: "+94" },
    { name: "Nepal", code: "NP", dial: "+977" },
    { name: "Indonesia", code: "ID", dial: "+62" },
    { name: "Vietnam", code: "VN", dial: "+84" },
    { name: "Thailand", code: "TH", dial: "+66" },
    { name: "Turkey", code: "TR", dial: "+90" },
    { name: "Poland", code: "PL", dial: "+48" },
    { name: "Belgium", code: "BE", dial: "+32" },
    { name: "Austria", code: "AT", dial: "+43" }
];

const GLOBAL_REPRESENTATIVES = [
    {
        name: "SAUDI ARABIA, QC Trainer",
        whatsappUrl: "https://wa.me/966599807084",
        phone: "(+966)599807084"
    },
    {
        name: "PHILIPPINES, MANILA",
        whatsappUrl: "https://wa.me/639061718210",
        phone: "(+63)9061718210"
    },
    {
        name: "NIGERIA, JUEDCONSULT",
        whatsappUrl: "https://wa.me/2348032648339",
        phone: "(+234)8032648339"
    },
    {
        name: "MENA, AFRICA, ASIA",
        whatsappUrl: "https://wa.me/917338649737",
        phone: "(+91)7338649737"
    },
    {
        name: "Canada Office",
        whatsappUrl: "https://wa.me/917338649737",
        phone: "(+91)7338649737"
    },
    {
        name: "London Office",
        whatsappUrl: "https://wa.me/917338649737",
        phone: "(+91)7338649737"
    }
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        country: "India",
        country_code: "+91",
        phone: "",
        inquiryType: "Individual Certification",
        programInterest: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    // =====================================================
    // AUTO-FETCH COUNTRY CODE ON MOUNT
    // =====================================================
    useEffect(() => {
        // Fast instant timezone detection
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
            if (tz.includes("Kolkata") || tz.includes("Calcutta")) {
                setFormData(prev => ({ ...prev, country: "India", country_code: "+91" }));
            } else if (tz.includes("Riyadh")) {
                setFormData(prev => ({ ...prev, country: "Saudi Arabia", country_code: "+966" }));
            } else if (tz.includes("Dubai")) {
                setFormData(prev => ({ ...prev, country: "United Arab Emirates", country_code: "+971" }));
            } else if (tz.includes("London")) {
                setFormData(prev => ({ ...prev, country: "United Kingdom", country_code: "+44" }));
            } else if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles") || tz.includes("Denver")) {
                setFormData(prev => ({ ...prev, country: "United States", country_code: "+1" }));
            }
        } catch {
            // ignore timezone error
        }

        // Direct geolocation fetch to accurately populate country and country code
        fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
                if (data && (data.country_name || data.country_code)) {
                    const match = COUNTRIES.find(
                        (c) =>
                            c.name.toLowerCase() === (data.country_name || "").toLowerCase() ||
                            c.code === data.country_code
                    );
                    const dial = data.country_calling_code || (match ? match.dial : "+91");
                    const countryName = match ? match.name : data.country_name || "India";
                    setFormData((prev) => ({
                        ...prev,
                        country: countryName,
                        country_code: dial.startsWith("+") ? dial : `+${dial}`,
                    }));
                }
            })
            .catch(() => {
                // Keep default India (+91) if offline
            });
    }, []);

    // =====================================================
    // HANDLE INPUT
    // =====================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // HANDLE COUNTRY SELECT
    // =====================================================
    const handleCountryChange = (e) => {
        const selectedCountryName = e.target.value;
        const found = COUNTRIES.find((c) => c.name === selectedCountryName);
        setFormData((prev) => ({
            ...prev,
            country: selectedCountryName,
            country_code: found ? found.dial : prev.country_code,
        }));
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({
                subject: formData.programInterest
                    ? `Course Inquiry: ${formData.programInterest} (${formData.country || "General"})`
                    : `Contact Inquiry from ${formData.name || "Website Visitor"} (${formData.country || "General"})`,
                requester_name: formData.name,
                requester_email: formData.email,
                category: formData.programInterest?.includes("Corporate") ? "Corporate Inquiry" : "General Support",
                priority: "Normal",
                message: `Program of Interest: ${formData.programInterest || "General Inquiry"}\nCountry: ${formData.country || "Not specified"} (${formData.country_code || ""})\nPhone: ${formData.country_code || ""} ${formData.phone || "Not provided"}\n\nMessage:\n${formData.message}`,
            });
        } catch (err) {
            console.warn("Contact form ticket sync fallback:", err);
        }

        setSubmitted(true);
        toast.success("Thank you! Your message has been sent to our admissions and support team.", {
            duration: 4000,
        });

        setFormData((prev) => ({
            name: "",
            email: "",
            country: prev.country || "India",
            country_code: prev.country_code || "+91",
            phone: "",
            inquiryType: "Individual Certification",
            programInterest: "",
            message: "",
        }));

        setTimeout(() => {
            setSubmitted(false);
        }, 6000);
    };

    return (
        <main className="bg-[#F8FAFC] min-h-screen text-slate-800">

            {/* =====================================================
                PRIMARY CONTACT DETAILS + FORM SECTION
            ===================================================== */}
            <section className="pt-10 sm:pt-12 lg:pt-14 pb-16 lg:pb-24">
                <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-8 lg:gap-10 items-stretch">

                        {/* =================================================
                            LEFT COLUMN: THEME-MATCHED NAVY BLUE SIDEBAR
                        ================================================= */}
                        <div className="bg-[#131E4A] text-white rounded-3xl p-7 sm:p-8 lg:p-9 border border-white/10 shadow-[0_12px_40px_rgba(19,30,74,0.18)] flex flex-col justify-between h-full">
                            <div>
                                {/* Header */}
                                <div className="border-b border-white/15 pb-5 mb-6">
                                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                        Let's Connect
                                    </h2>
                                    <p className="text-slate-300 text-sm leading-relaxed mt-1.5">
                                        Reach out directly for admissions, enterprise training, exam registration, or global credential verification.
                                    </p>
                                </div>

                                <div className="space-y-6">

                                    {/* 1. PRIMARY EMAIL */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-white/15 transition-colors">
                                            <Mail className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase">
                                                Primary Email
                                            </p>
                                            <div className="mt-1">
                                                <a
                                                    href={PRIMARY_CONTACT.emailHref}
                                                    aria-label={`Send email to ${PRIMARY_CONTACT.email}`}
                                                    className="text-white text-sm sm:text-base font-medium hover:text-amber-300 transition-colors break-all"
                                                >
                                                    {PRIMARY_CONTACT.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. INDIA PHONE */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-white/15 transition-colors">
                                            <Phone className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase">
                                                Phone
                                            </p>
                                            <div className="mt-1 flex items-center gap-2.5 flex-wrap">
                                                <a
                                                    href={PRIMARY_CONTACT.phoneHref}
                                                    aria-label={`Call Broadbeach Academy at ${PRIMARY_CONTACT.phoneDisplay}`}
                                                    className="text-white text-sm sm:text-base font-medium hover:text-amber-300 transition-colors"
                                                >
                                                    {PRIMARY_CONTACT.phoneDisplay}
                                                </a>
                                                <a
                                                    href={PRIMARY_CONTACT.whatsappHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label="Chat on WhatsApp (+91 7338 649 737)"
                                                    title="Chat on WhatsApp (+91 7338 649 737)"
                                                    className="inline-flex items-center justify-center text-[#25D366] hover:text-emerald-300 transition-all duration-200 hover:scale-110 cursor-pointer shrink-0 p-0.5"
                                                >
                                                    <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. OFFICE ADDRESS */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-white/15 transition-colors">
                                            <MapPin className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase">
                                                Office Address
                                            </p>
                                            <p className="mt-1 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                                                #2201A, 22nd Floor,{"\n"}
                                                World Trade Center,{"\n"}
                                                Bengaluru- 56055 ,India
                                            </p>
                                            <a
                                                href={PRIMARY_CONTACT.mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="View Broadbeach Academy location on Google Maps (opens in new tab)"
                                                className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-300 hover:text-amber-200 hover:underline transition-colors"
                                            >
                                                <span>Open in Google Maps</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* 4. GLOBAL REPRESENTATIVES */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group pt-4 border-t border-white/15">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-white/15 transition-colors">
                                            <Globe className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase mb-3">
                                                Global Representatives
                                            </p>
                                            <div className="space-y-2">
                                                {GLOBAL_REPRESENTATIVES.map((rep) => (
                                                    <div
                                                        key={rep.name}
                                                        className="flex items-center justify-between gap-3 py-1 border-b border-white/10 last:border-b-0"
                                                    >
                                                        <span className="text-xs sm:text-[13px] text-slate-200 font-medium leading-snug">
                                                            {rep.name}
                                                        </span>
                                                        <a
                                                            href={rep.whatsappUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`Chat on WhatsApp with ${rep.name}`}
                                                            title={`Chat on WhatsApp with ${rep.name} (${rep.phone})`}
                                                            className="inline-flex items-center justify-center text-[#25D366] hover:text-emerald-300 transition-all duration-200 hover:scale-125 cursor-pointer shrink-0 p-1"
                                                        >
                                                            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* SOCIAL MEDIA / OFFICIAL CHANNELS */}
                            <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between flex-wrap gap-4">
                                <span className="text-xs font-semibold tracking-wider text-slate-300/80 uppercase">
                                    Official Channels
                                </span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href="https://www.facebook.com/broadbeach.innovations.71/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Follow Broadbeach Academy on Facebook"
                                        className="w-9 h-9 rounded-full bg-white/10 text-slate-200 flex items-center justify-center hover:bg-[#F7C600] hover:text-[#0D0D20] transition-all border border-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/30"
                                    >
                                        <FaFacebookF className="text-xs" />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/broadbeachinnovations"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Follow Broadbeach Academy on Instagram"
                                        className="w-9 h-9 rounded-full bg-white/10 text-slate-200 flex items-center justify-center hover:bg-[#F7C600] hover:text-[#0D0D20] transition-all border border-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/30"
                                    >
                                        <FaInstagram className="text-xs" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/37528405/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Connect with Broadbeach Academy on LinkedIn"
                                        className="w-9 h-9 rounded-full bg-white/10 text-slate-200 flex items-center justify-center hover:bg-[#F7C600] hover:text-[#0D0D20] transition-all border border-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/30"
                                    >
                                        <FaLinkedinIn className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            RIGHT COLUMN: CONTACT & INQUIRY FORM
                        ================================================= */}
                        <div className="bg-white rounded-3xl p-7 sm:p-8 lg:p-9 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col h-full">
                            
                            {/* Header */}
                            <div className="border-b border-slate-100 pb-5 mb-5">
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                    Send Us a Message
                                </h2>
                                <p className="mt-1 text-slate-500 text-sm leading-relaxed">
                                    Fill out your details below and our academic counseling team will respond to your inquiry promptly.
                                </p>
                            </div>

                            {/* SUCCESS MESSAGE */}
                            {submitted && (
                                <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-5 py-4 text-sm font-medium flex items-center gap-3">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Thank you! Your message has been submitted. Our team will contact you shortly.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-5">

                                    {/* ROW 1: NAME + EMAIL */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contact-name" className="block text-xs font-semibold tracking-wider text-slate-700 uppercase mb-1.5">
                                                Your Full Name <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. John Doe"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="contact-email" className="block text-xs font-semibold tracking-wider text-slate-700 uppercase mb-1.5">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@company.com"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* ROW 2: COUNTRY + PHONE / WHATSAPP */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contact-country" className="block text-xs font-semibold tracking-wider text-slate-700 uppercase mb-1.5">
                                                Country <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="contact-country"
                                                    name="country"
                                                    required
                                                    value={formData.country}
                                                    onChange={handleCountryChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Select Country</option>
                                                    {COUNTRIES.map((c) => (
                                                        <option key={c.name} value={c.name}>
                                                            {c.name} ({c.dial})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="contact-phone" className="block text-xs font-semibold tracking-wider text-slate-700 uppercase mb-1.5">
                                                Phone / WhatsApp
                                            </label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-3.5 text-xs font-semibold text-slate-500 select-none">
                                                    {formData.country_code || "+91"}
                                                </span>
                                                <input
                                                    id="contact-phone"
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="98765 43210"
                                                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ROW 3: COURSE / PROGRAM OF INTEREST */}
                                    <div>
                                        <label htmlFor="contact-program" className="block text-xs font-semibold tracking-wider text-slate-700 uppercase mb-1.5">
                                            Course / Program of Interest <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="contact-program"
                                                name="programInterest"
                                                value={formData.programInterest}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden appearance-none cursor-pointer"
                                            >
                                                <option value="">Select a course or program domain...</option>
                                                <option value="ISO 9001:2015 Quality Management (QMS) Lead Auditor">ISO 9001:2015 Quality Management (QMS) Lead Auditor</option>
                                                <option value="ISO 14001:2015 Environmental Management (EMS) Lead Auditor">ISO 14001:2015 Environmental Management (EMS) Lead Auditor</option>
                                                <option value="ISO 45001:2018 Occupational Health & Safety (OH&S) Lead Auditor">ISO 45001:2018 Occupational Health & Safety (OH&S) Lead Auditor</option>
                                                <option value="ISO 27001:2022 Information Security Management (ISMS)">ISO 27001:2022 Information Security Management (ISMS)</option>
                                                <option value="Lean Six Sigma (Green Belt / Black Belt)">Lean Six Sigma (Green Belt / Black Belt)</option>
                                                <option value="ISO 22000 / HACCP Food Safety Management">ISO 22000 / HACCP Food Safety Management</option>
                                                <option value="Corporate / Custom Enterprise Batch Training">Corporate / Custom Enterprise Batch Training</option>
                                                <option value="Other Certification / Verification Inquiry">Other Certification / Verification Inquiry</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ROW 4: MESSAGE / REQUIREMENTS CONTEXT BOX */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="contact-message" className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
                                                Your Message / Requirements <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                Detailed inquiry context
                                            </span>
                                        </div>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            rows="8"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Please provide details about your course interest, corporate batch size, training mode (online/offline), preferred schedule, or certification verification questions..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden resize-y min-h-[190px]"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON & FOOTER */}
                                <div className="pt-4 border-t border-slate-100 mt-2">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto h-[48px] inline-flex items-center justify-center gap-2.5 px-9 rounded-xl bg-[#131E4A] hover:bg-[#15467e] active:scale-[0.98] text-white font-semibold text-sm tracking-wide transition-all duration-150 cursor-pointer shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#131E4A] focus:ring-offset-2 select-none"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Send Inquiry Message</span>
                                        </button>
                                        <span className="text-xs text-slate-400 text-center sm:text-right font-medium">
                                            ISO 27001 data compliance &amp; privacy assured
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-400 leading-relaxed pt-4 mt-3 border-t border-slate-100/80">
                                        By submitting this form, you acknowledge that Broadbeach Academy processes your contact details solely to respond to your inquiry in accordance with our{" "}
                                        <a
                                            href="/privacy-policy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-[#131E4A] font-medium"
                                        >
                                            Privacy Policy
                                        </a>.
                                    </p>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* =====================================================
                REAL-TIME GOOGLE MAP SECTION
            ===================================================== */}
            <section className="w-full bg-slate-100 border-t border-slate-200/80">
                <div className="w-full h-[400px] sm:h-[460px] lg:h-[500px]">
                    <iframe
                        title="Broadbeach Academy Location - World Trade Center Bengaluru"
                        src="https://maps.google.com/maps?q=World+Trade+Center,+22nd+Floor,+Dr+Rajkumar+Rd,+Malleshwaram,+Bengaluru,+Karnataka+560055&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full border-0 block"
                        loading="lazy"
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>

            {/* =====================================================
                BOTTOM CTA SECTION: LETS GET IN TOUCH (NAVY BANNER)
            ===================================================== */}
            <section className="bg-[#111A3A] py-14 lg:py-16 text-white border-t border-white/10">
                <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                        {/* Left Column */}
                        <div className="max-w-xl">
                            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight">
                                Lets Get in Touch!
                            </h2>
                            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                                Reach out to us at Broadbeach . We're here to help. Connect with our team today and let's explore new opportunities together.
                            </p>
                        </div>

                        {/* Right Column: Contact Cards */}
                        <div className="flex flex-wrap items-center gap-8 sm:gap-12 lg:gap-16">
                            {/* Call Us */}
                            <div className="flex items-center gap-4">
                                <div className="text-[#FF7700] shrink-0">
                                    <PhoneCall className="w-8 h-8 sm:w-9 sm:h-9 text-[#FF7700]" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-base sm:text-lg">
                                        Call us
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <a
                                            href="tel:+917338649737"
                                            className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
                                        >
                                            +91 7338649737
                                        </a>
                                        <a
                                            href="https://wa.me/917338649737"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Chat on WhatsApp (+91 7338 649 737)"
                                            title="Chat on WhatsApp (+91 7338 649 737)"
                                            className="inline-flex items-center justify-center text-[#25D366] hover:text-emerald-300 transition-all duration-200 hover:scale-110 cursor-pointer p-0.5"
                                        >
                                            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Email Us */}
                            <div className="flex items-center gap-4">
                                <div className="text-[#FF7700] shrink-0">
                                    <Mail className="w-8 h-8 sm:w-9 sm:h-9 text-[#FF7700]" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-base sm:text-lg">
                                        Email us
                                    </p>
                                    <a
                                        href="mailto:certification@broadbeach.in"
                                        className="block text-slate-300 hover:text-white transition-colors text-sm sm:text-base mt-0.5 break-all"
                                    >
                                        certification@broadbeach.in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Contact;
