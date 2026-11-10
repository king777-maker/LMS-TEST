import { useState, useEffect } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";
import {
    Mail,
    Phone,
    MapPin,
    Check,
    Copy,
    ExternalLink,
    Send,
    Globe
} from "lucide-react";
import toast from "react-hot-toast";
import { PRIMARY_CONTACT, REGIONAL_CONTACTS, copyToClipboard } from "../constants/contactInfo";
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

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        country: "India",
        country_code: "+91",
        phone: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

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
    // HANDLE COPY TO CLIPBOARD
    // =====================================================
    const handleCopy = async (text, label, key) => {
        const result = await copyToClipboard(text, label);
        if (result.success) {
            setCopiedKey(key);
            toast.success(`Copied ${label} to clipboard: ${text}`, {
                id: `copy-${key}`,
                duration: 2500,
                style: {
                    borderRadius: "12px",
                    background: "#0F172A",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "500",
                },
                iconTheme: {
                    primary: "#10B981",
                    secondary: "#ffffff",
                },
            });
            setTimeout(() => {
                setCopiedKey((curr) => (curr === key ? null : curr));
            }, 2000);
        } else {
            toast.error(`Failed to copy ${label}. Please copy manually.`, {
                id: `copy-err-${key}`,
                duration: 3500,
            });
        }
    };

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
                subject: formData.country ? `Contact Enquiry (${formData.country})` : "General Website Enquiry",
                requester_name: formData.name,
                requester_email: formData.email,
                category: "General Support",
                priority: "Normal",
                message: `Country: ${formData.country} (${formData.country_code || ""})\nPhone: ${formData.country_code || ""} ${formData.phone || "Not provided"}\n\n${formData.message}`,
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
                                {/* Header (Headquarters & Admissions block removed) */}
                                <div className="border-b border-white/15 pb-5 mb-6">
                                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                        Let's Connect
                                    </h2>
                                    <p className="text-slate-300 text-sm leading-relaxed mt-1.5">
                                        Reach out directly for admissions, enterprise training, exam registration, or global credential verification.
                                    </p>
                                </div>

                                <div className="space-y-7">

                                    {/* 1. PRIMARY EMAIL */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-white/15 transition-colors">
                                            <Mail className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase">
                                                Primary Email
                                            </p>
                                            <div className="mt-0.5 flex items-center justify-between gap-2 flex-wrap">
                                                <a
                                                    href={PRIMARY_CONTACT.emailHref}
                                                    aria-label={`Send email to ${PRIMARY_CONTACT.email}`}
                                                    className="text-white text-sm sm:text-base font-medium hover:text-amber-300 transition-colors break-all"
                                                >
                                                    {PRIMARY_CONTACT.email}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(PRIMARY_CONTACT.email, "Primary Email", "prim-email")}
                                                    aria-label="Copy primary email address"
                                                    title="Copy primary email address"
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {copiedKey === "prim-email" ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-400" />
                                                            <span className="text-emerald-400 font-semibold text-[11px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span className="text-[11px]">Copy email</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <span className="block text-xs text-slate-300/80 mt-0.5 leading-normal">
                                                General inquiries, course syllabus &amp; corporate quotes
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. INDIA PHONE */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-white/15 transition-colors">
                                            <Phone className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-amber-300/90 uppercase">
                                                India Phone / Helpline
                                            </p>
                                            <div className="mt-0.5 flex items-center justify-between gap-2 flex-wrap">
                                                <a
                                                    href={PRIMARY_CONTACT.phoneHref}
                                                    aria-label={`Call Broadbeach Academy at ${PRIMARY_CONTACT.phoneDisplay}`}
                                                    className="text-white text-sm sm:text-base font-medium hover:text-amber-300 transition-colors"
                                                >
                                                    {PRIMARY_CONTACT.phoneDisplay}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(PRIMARY_CONTACT.phone, "Phone Number", "prim-phone")}
                                                    aria-label="Copy phone number"
                                                    title="Copy phone number"
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {copiedKey === "prim-phone" ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-400" />
                                                            <span className="text-emerald-400 font-semibold text-[11px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span className="text-[11px]">Copy number</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <span className="block text-xs text-slate-300/80 mt-0.5 leading-normal">
                                                Admissions helpline &amp; WhatsApp assistance
                                            </span>
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
                                            <p className="mt-1 text-slate-200 text-xs sm:text-sm leading-relaxed">
                                                {PRIMARY_CONTACT.officeAddress}
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
                        <div className="bg-white rounded-3xl p-7 sm:p-8 lg:p-9 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full">
                            {/* Header (Direct Inquiries block removed) */}
                            <div className="border-b border-slate-100 pb-5 mb-6">
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                    Send Us a Message
                                </h2>
                                <p className="mt-1.5 text-slate-500 text-sm leading-relaxed">
                                    Fill out your details below and our academic counseling team will respond within 24 business hours.
                                </p>
                            </div>

                            {/* SUCCESS MESSAGE */}
                            {submitted && (
                                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-5 py-4 text-sm font-medium flex items-center gap-3">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Thank you! Your message has been submitted. Our team will contact you shortly.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* ROW 1: NAME + EMAIL */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
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
                                        <label htmlFor="contact-email" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
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

                                {/* ROW 2: SWAPPED: COUNTRY (MANDATORY WITH DIRECT COUNTRY CODE FETCH) + PHONE / WHATSAPP */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-country" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
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
                                        <label htmlFor="contact-phone" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
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

                                {/* ROW 3: MESSAGE */}
                                <div>
                                    <label htmlFor="contact-message" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
                                        Your Message / Requirements <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        rows="5"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Please provide details about your course interest, corporate batch size, or certification questions..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/15 transition-all outline-hidden resize-y"
                                    ></textarea>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto h-[48px] inline-flex items-center justify-center gap-2 px-8 rounded-xl bg-[#131E4A] hover:bg-[#15467e] active:scale-[0.98] text-white font-semibold text-sm tracking-wide transition-all duration-150 cursor-pointer shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#131E4A] focus:ring-offset-2 select-none"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Send Inquiry Message</span>
                                    </button>
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                                    By submitting this form, you acknowledge that Broadbeach Academy processes your contact details solely to respond to your inquiry in accordance with our{" "}
                                    <a
                                        href="/privacy-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-[#131E4A] font-medium"
                                    >
                                        Privacy Policy
                                    </a>.
                                    We never share your personal information with third parties for promotional spam.
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* =====================================================
                REGIONAL CONTACT DIRECTORY & GLOBAL REPRESENTATIVES
            ===================================================== */}
            <section className="py-14 lg:py-20 bg-slate-100 border-t border-slate-200/80">
                <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">

                    <div className="text-center max-w-[850px] mx-auto mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#131E4A] tracking-tight">
                            Global Representatives &amp; Regional Contact Directory
                        </h2>
                        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                            Broadbeach Academy coordinates executive certifications, lead auditor training programs, and ISO assessments globally through certified regional desks and authorized partners.
                        </p>
                    </div>

                    {/* DIRECTORY CARDS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {REGIONAL_CONTACTS.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(11,49,91,0.08)] transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                            {item.badge}
                                        </span>
                                        {item.flagged && (
                                            <span
                                                title="Phone number shared across regions; under administrative verification"
                                                className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                                            >
                                                Liaison Desk
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-bold text-[#131E4A] group-hover:text-blue-600 transition-colors">
                                        {item.region}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mb-3">
                                        {item.role}
                                    </p>

                                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <a
                                            href={item.href}
                                            aria-label={`Contact ${item.region}: ${item.display}`}
                                            className="text-xs sm:text-sm font-bold text-[#131E4A] hover:text-blue-600 transition-colors break-all focus:outline-hidden focus:underline"
                                        >
                                            {item.display}
                                        </a>

                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item.value, item.region, item.id)}
                                            aria-label={`Copy contact detail for ${item.region}`}
                                            title={`Copy ${item.display}`}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#131E4A] shrink-0"
                                        >
                                            {copiedKey === item.id ? (
                                                <>
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-emerald-600 text-[11px] font-bold">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span className="text-[11px]">Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 max-w-3xl mx-auto text-center leading-relaxed">
                        <span className="font-bold text-[#131E4A]">Note for Learners &amp; Corporate Clients:</span> Regional liaison desks coordinate remote admissions, virtual examinations, and regional corporate schedules. Official institutional contracts and certificate verifications are issued directly through our verified headquarters at Bengaluru, India.
                    </div>

                </div>
            </section>

            {/* =====================================================
                BOTTOM CTA SECTION
            ===================================================== */}
            <section className="bg-[#FFDB58] py-14 lg:py-16">
                <div className="max-w-[1100px] mx-auto px-6 text-center">
                    <h2 className="text-[#131E4A] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                        Lets Get in Touch!
                    </h2>
                    <p className="mt-3 text-[#131E4A]/85 text-sm sm:text-base lg:text-lg max-w-[700px] mx-auto leading-relaxed">
                        Reach out to us at Broadbeach . We’re here to help. Connect with our team today and let’s explore new opportunities together.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <span className="text-xs uppercase font-bold tracking-wider text-[#131E4A]/80">
                                Call us
                            </span>
                            <a
                                href="tel:+917338649737"
                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#131E4A] hover:bg-[#1c2c6b] text-white font-bold text-sm transition-all shadow-md"
                            >
                                +91 7338649737
                            </a>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <span className="text-xs uppercase font-bold tracking-wider text-[#131E4A]/80">
                                Email us
                            </span>
                            <a
                                href="mailto:certification@broadbeach.in"
                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#131E4A] font-bold text-sm transition-all shadow-md"
                            >
                                certification@broadbeach.in
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Contact;
