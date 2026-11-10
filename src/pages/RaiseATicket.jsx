import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { createTicket } from "../api/adminApi";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa6";
import {
  FaTicketAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaPaperPlane,
} from "react-icons/fa";

const TICKET_CATEGORIES = [
  "Login & Account Issues",
  "Course Access",
  "Assessment & Progress",
  "Certificate Generation",
  "Certificate Verification",
  "Offline Certification Enquiries",
  "General Support",
];

const RaiseATicket = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Certificate Generation",
    priority: "Normal",
    course_name: "",
    certificate_id: "",
    subject: "",
    message: "",
  });

  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTicket({
        subject: formData.subject.trim(),
        requester_name: formData.name.trim(),
        requester_email: formData.email.trim().toLowerCase(),
        course_name: formData.course_name.trim() || null,
        certificate_id: formData.certificate_id.trim() || null,
        category: formData.category,
        priority: formData.priority,
        message: formData.message.trim(),
      });

      if (res && res.success) {
        setSubmittedTicket(res.data);
        toast.success(`Support Ticket #${res.data.id} created successfully!`);
      } else {
        throw new Error(res?.message || "Failed to create support ticket.");
      }
    } catch (err) {
      console.error("Ticket submission error:", err);
      toast.error(err.message || "Failed to submit support ticket. Please check your network connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const resetForm = () => {
    setSubmittedTicket(null);
    setFormData({
      name: "",
      email: "",
      category: "Certificate Generation",
      priority: "Normal",
      course_name: "",
      certificate_id: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <SEO
        title="Submit Support Ticket | Broadbeach Academy"
        description="Get technical and academic assistance. Submit a support ticket for course enrollment, exam questions, or certificate verification issues."
        breadcrumbs={[{ name: "Raise a Ticket", url: "/raise-ticket" }]}
      />
      <Breadcrumbs items={[{ name: "Raise a Ticket", url: "/raise-ticket" }]} />

      <section className="relative overflow-hidden bg-[#131E4A] text-white py-16 sm:py-20 lg:py-24 text-center">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#FFDB58]/10" />

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 text-gold flex items-center justify-center text-2xl backdrop-blur-sm">
            <FaTicketAlt />
          </div>

          <h1 className="!text-[34px] sm:!text-[44px] md:!text-[52px] font-bold">
            Raise a Support Ticket
          </h1>

          <p className="mt-4 text-white/80 text-[16px] sm:text-[18px] max-w-2xl mx-auto">
            Direct dispatch to the Broadbeach Academy Ticket Master administration team. All enquiries are tracked with real-time status updates.
          </p>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-4 flex gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#131E4A]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#131E4A] font-semibold">Raise a Ticket</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-4">📧</div>
            <h2 className="!text-[18px] font-bold text-[#131E4A] mb-2">Email Support</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              info@broadbeach.in<br />certification@broadbeach.in
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-4">📱</div>
            <h2 className="!text-[18px] font-bold text-[#131E4A] mb-2">Phone &amp; WhatsApp</h2>
            <div className="text-gray-600 text-sm leading-relaxed">
              <div className="flex items-center gap-2 mb-1">
                <a
                  href="tel:+917338649737"
                  className="font-semibold text-slate-800 hover:text-amber-500 transition-colors"
                >
                  +91 7338 649 737
                </a>
                <a
                  href="https://wa.me/917338649737?text=Hello%20Broadbeach%20Academy%2C%20I%20need%20help%20with%20a%20support%20ticket."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp (+91 7338 649 737)"
                  title="Chat on WhatsApp (+91 7338 649 737)"
                  className="inline-flex items-center justify-center text-[#25D366] hover:text-[#20ba5a] transition-all duration-200 hover:scale-110 shrink-0 p-0.5"
                >
                  <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                </a>
              </div>
              <p className="text-xs text-gray-500">Mon–Fri: 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-4">⚡</div>
            <h2 className="!text-[18px] font-bold text-[#131E4A] mb-2">SLA Response Time</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Within 2–4 hours for critical credential &amp; exam issues.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
          {submittedTicket ? (
            <div className="text-center py-10 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
                <FaCheckCircle />
              </div>

              <h2 className="text-2xl font-bold text-[#131E4A]">
                Support Ticket Logged!
              </h2>

              <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Ticket Reference ID:</span>
                  <span className="font-mono font-bold text-[#131E4A] text-base">
                    {submittedTicket.id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-semibold text-slate-800">{submittedTicket.subject}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{submittedTicket.category}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Requester Email:</span>
                  <span className="font-semibold text-slate-800">{submittedTicket.requester_email}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Our support desk has received your submission. An administrative agent will review and update you via email.
              </p>

              <button
                type="button"
                onClick={resetForm}
                className="mt-6 px-6 py-3 rounded-xl bg-[#131E4A] hover:bg-[#183B73] text-white font-bold transition-all shadow-sm"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Michael Chen"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. michael.chen@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                    Issue Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm bg-white"
                  >
                    {TICKET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Impacting deadlines)</option>
                    <option value="Urgent">Urgent (Credential/Audit blocked)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                    Course Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    placeholder="e.g. ISO 9001:2015 Quality Management Systems"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                    Certificate ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="certificate_id"
                    value={formData.certificate_id}
                    onChange={handleChange}
                    placeholder="e.g. BOA10110"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                  Subject Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Unable to generate certificate after 100% chapter completion"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-xs text-[#131E4A] uppercase tracking-wider">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your enquiry, exact steps taken, or specific questions in detail..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#131E4A] focus:ring-2 focus:ring-[#131E4A]/20 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="h-[48px] px-7 rounded-[12px] bg-[#0052CC] hover:bg-[#0747A6] active:scale-[0.98] text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 select-none cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Ticket...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-gold" />
                    Submit Ticket to Ticket Master
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default RaiseATicket;