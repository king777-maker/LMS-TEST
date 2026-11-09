import { useState } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";
import {
    Mail,
    Phone,
    MapPin,
    Building2,
    Award,
    Check,
    Copy,
    ExternalLink,
    Send,
    Globe
} from "lucide-react";
import toast from "react-hot-toast";
import { PRIMARY_CONTACT, REGIONAL_CONTACTS, copyToClipboard } from "../constants/contactInfo";
import { createTicket } from "../api/adminApi";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

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
    // HANDLE SUBMIT
    // =====================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({
                subject: formData.subject ? `Contact Enquiry: ${formData.subject}` : "General Website Enquiry",
                requester_name: formData.name,
                requester_email: formData.email,
                category: formData.subject?.toLowerCase().includes("offline") ? "Offline Certification Enquiries" : "General Support",
                priority: "Normal",
                message: `Phone: ${formData.phone || "Not provided"}\n\n${formData.message}`,
            });
        } catch (err) {
            console.warn("Contact form ticket sync fallback:", err);
        }

        setSubmitted(true);
        toast.success("Thank you! Your message has been sent to our admissions and support team.", {
            duration: 4000,
        });

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });

        setTimeout(() => {
            setSubmitted(false);
        }, 6000);
    };

    return (
        <main className="bg-[#F8FAFC] min-h-screen text-slate-800">

            {/* =====================================================
                PRIMARY CONTACT DETAILS + FORM SECTION
                (Begins cleanly below navbar with balanced pt-10 to pt-14)
            ===================================================== */}
            <section className="pt-10 sm:pt-12 lg:pt-14 pb-16 lg:pb-24">
                <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-8 lg:gap-10 items-start">

                        {/* =================================================
                            LEFT COLUMN: APPLE-INSPIRED MINIMALIST SIDEBAR
                        ================================================= */}
                        <div className="bg-white rounded-3xl p-7 sm:p-8 lg:p-9 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                            <div>
                                {/* Header */}
                                <div className="border-b border-slate-100 pb-5 mb-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider mb-2.5">
                                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Headquarters &amp; Admissions</span>
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                        Let's Connect
                                    </h2>
                                    <p className="text-slate-500 text-sm leading-relaxed mt-1.5">
                                        Reach out directly for admissions, enterprise training, exam registration, or global credential verification.
                                    </p>
                                </div>

                                <div className="space-y-6">

                                    {/* 1. PRIMARY EMAIL */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-200/80 transition-colors">
                                            <Mail className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                Primary Email
                                            </p>
                                            <div className="mt-0.5 flex items-center justify-between gap-2 flex-wrap">
                                                <a
                                                    href={PRIMARY_CONTACT.emailHref}
                                                    aria-label={`Send email to ${PRIMARY_CONTACT.email}`}
                                                    className="text-slate-900 text-sm sm:text-base font-medium hover:text-blue-600 transition-colors break-all"
                                                >
                                                    {PRIMARY_CONTACT.email}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(PRIMARY_CONTACT.email, "Primary Email", "prim-email")}
                                                    aria-label="Copy primary email address"
                                                    title="Copy primary email address"
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {copiedKey === "prim-email" ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                            <span className="text-emerald-600 font-semibold text-[11px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span className="text-[11px]">Copy email</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <span className="block text-xs text-slate-400 mt-0.5 leading-normal">
                                                General inquiries, course syllabus &amp; corporate quotes
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. INDIA PHONE */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-200/80 transition-colors">
                                            <Phone className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                India Phone / Helpline
                                            </p>
                                            <div className="mt-0.5 flex items-center justify-between gap-2 flex-wrap">
                                                <a
                                                    href={PRIMARY_CONTACT.phoneHref}
                                                    aria-label={`Call Broadbeach Academy at ${PRIMARY_CONTACT.phoneDisplay}`}
                                                    className="text-slate-900 text-sm sm:text-base font-medium hover:text-blue-600 transition-colors"
                                                >
                                                    {PRIMARY_CONTACT.phoneDisplay}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(PRIMARY_CONTACT.phone, "Phone Number", "prim-phone")}
                                                    aria-label="Copy phone number"
                                                    title="Copy phone number"
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {copiedKey === "prim-phone" ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                            <span className="text-emerald-600 font-semibold text-[11px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span className="text-[11px]">Copy number</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <span className="block text-xs text-slate-400 mt-0.5 leading-normal">
                                                Admissions helpline &amp; WhatsApp assistance
                                            </span>
                                        </div>
                                    </div>

                                    {/* 3. TRAINING & CERTIFICATION DESK */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-200/80 transition-colors">
                                            <Award className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                Training &amp; Certification Desk
                                            </p>
                                            <div className="mt-0.5 flex items-center justify-between gap-2 flex-wrap">
                                                <a
                                                    href={PRIMARY_CONTACT.certificationEmailHref}
                                                    aria-label={`Send email to ${PRIMARY_CONTACT.certificationEmail}`}
                                                    className="text-slate-900 text-sm sm:text-base font-medium hover:text-blue-600 transition-colors break-all"
                                                >
                                                    {PRIMARY_CONTACT.certificationEmail}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(PRIMARY_CONTACT.certificationEmail, "Certification Email", "cert-email")}
                                                    aria-label="Copy certification email"
                                                    title="Copy certification email"
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                                                >
                                                    {copiedKey === "cert-email" ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                            <span className="text-emerald-600 font-semibold text-[11px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span className="text-[11px]">Copy email</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <span className="block text-xs text-slate-400 mt-0.5 leading-normal">
                                                Exam eligibility, credential audits &amp; certificate verification
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4. OFFICE ADDRESS */}
                                    <div className="flex gap-3.5 sm:gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-200/80 transition-colors">
                                            <MapPin className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                Office Address
                                            </p>
                                            <p className="mt-1 text-slate-800 text-xs sm:text-sm leading-relaxed">
                                                {PRIMARY_CONTACT.officeAddress}
                                            </p>
                                            <a
                                                href={PRIMARY_CONTACT.mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="View Broadbeach Academy location on Google Maps (opens in new tab)"
                                                className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                            >
                                                <span>Open in Google Maps</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* SOCIAL MEDIA / OFFICIAL CHANNELS */}
                            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                    Official Channels
                                </span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href="https://www.facebook.com/broadbeach.innovations.71/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Follow Broadbeach Academy on Facebook"
                                        className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-300"
                                    >
                                        <FaFacebookF className="text-xs" />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/broadbeachinnovations"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Follow Broadbeach Academy on Instagram"
                                        className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-300"
                                    >
                                        <FaInstagram className="text-xs" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/37528405/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Connect with Broadbeach Academy on LinkedIn"
                                        className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-300"
                                    >
                                        <FaLinkedinIn className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            RIGHT COLUMN: CONTACT & INQUIRY FORM
                        ================================================= */}
                        <div className="bg-white rounded-3xl p-7 sm:p-8 lg:p-9 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                            <div className="border-b border-slate-100 pb-5 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider mb-2.5">
                                    <Send className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Direct Inquiries</span>
                                </span>
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
                                {/* NAME + EMAIL */}
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
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all outline-hidden"
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
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all outline-hidden"
                                        />
                                    </div>
                                </div>

                                {/* PHONE + SUBJECT */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-phone" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
                                            Phone / WhatsApp
                                        </label>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contact-subject" className="block text-xs font-semibold tracking-wider text-slate-600 uppercase mb-1.5">
                                            Inquiry Purpose <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="contact-subject"
                                            type="text"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="e.g. ISO 9001 Lead Auditor Training"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all outline-hidden"
                                        />
                                    </div>
                                </div>

                                {/* MESSAGE */}
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
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#0B315B] focus:ring-2 focus:ring-[#0B315B]/15 transition-all outline-hidden resize-y"
                                    ></textarea>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto h-[48px] inline-flex items-center justify-center gap-2 px-8 rounded-xl bg-[#0B315B] hover:bg-[#15467e] active:scale-[0.98] text-white font-semibold text-sm tracking-wide transition-all duration-150 cursor-pointer shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#0B315B] focus:ring-offset-2 select-none"
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
                                        className="text-blue-600 underline hover:text-[#0B315B] font-medium"
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B315B]/10 text-[#0B315B] text-xs font-bold uppercase tracking-wider mb-3">
                            <Globe className="w-3.5 h-3.5 text-[#0B315B]" />
                            <span>International Academic Network</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B315B] tracking-tight">
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

                                    <h3 className="text-base font-bold text-[#0B315B] group-hover:text-blue-600 transition-colors">
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
                                            className="text-xs sm:text-sm font-bold text-[#0B315B] hover:text-blue-600 transition-colors break-all focus:outline-hidden focus:underline"
                                        >
                                            {item.display}
                                        </a>

                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item.value, item.region, item.id)}
                                            aria-label={`Copy contact detail for ${item.region}`}
                                            title={`Copy ${item.display}`}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0B315B] shrink-0"
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
                        <span className="font-bold text-[#0B315B]">Note for Learners &amp; Corporate Clients:</span> Regional liaison desks coordinate remote admissions, virtual examinations, and regional corporate schedules. Official institutional contracts and certificate verifications are issued directly through our verified headquarters at Bengaluru, India.
                    </div>

                </div>
            </section>

            {/* =====================================================
                BOTTOM CTA SECTION
            ===================================================== */}
            <section className="bg-[#FFDB58] py-14 lg:py-16">
                <div className="max-w-[1100px] mx-auto px-6 text-center">
                    <h2 className="text-[#0B315B] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                        Ready to Advance Your Professional Career?
                    </h2>
                    <p className="mt-3 text-[#334B69] text-sm sm:text-base lg:text-lg max-w-[700px] mx-auto">
                        Explore our world-class ISO Lead Auditor courses, Foundation certifications, and Continuous Improvement programs.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="/lead-auditor"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0B315B] hover:bg-[#15467e] text-white font-bold text-sm transition-all shadow-md"
                        >
                            Explore Lead Auditor Courses
                        </a>
                        <a
                            href={PRIMARY_CONTACT.phoneHref}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#0B315B] font-bold text-sm transition-all shadow-md"
                        >
                            Call Support: {PRIMARY_CONTACT.phoneDisplay}
                        </a>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Contact;
