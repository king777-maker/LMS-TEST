/**
 * Centralized Contact Information for Broadbeach Academy
 * Standardized across the entire platform.
 */

export const PRIMARY_CONTACT = {
  name: "Broadbeach Academy",
  legalEntity: "Broadbeach Innovations Private Limited",
  email: "certification@broadbeach.in",
  emailHref: "mailto:certification@broadbeach.in",
  headerEmail: "certification@broadbeach.in",
  headerEmailHref: "mailto:certification@broadbeach.in",
  certificationEmail: "certification@broadbeach.in",
  certificationEmailHref: "mailto:certification@broadbeach.in",
  phone: "+91 7338649737",
  phoneDisplay: "+91 7338 649 737",
  phoneHref: "tel:+917338649737",
  officeAddress: "#2201A, 22nd Floor, World Trade Center, Bengaluru- 56055 ,India",
  officeAddressShort: "#2201A, 22nd Floor, World Trade Center, Bengaluru",
  mapsUrl: "https://maps.google.com/?q=World+Trade+Center,+Bengaluru,+Karnataka+560055",
  website: "https://broadbeach.in",
  workingHours: "Monday – Friday: 9:00 AM – 6:00 PM IST",
  whatsapp: "+91 7338 649 737",
  whatsappNumber: "917338649737",
  whatsappMessage: "Hello Broadbeach Academy, I would like to inquire about courses and certifications.",
  whatsappHref: "https://wa.me/917338649737?text=Hello%20Broadbeach%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20courses%20and%20certifications."
};

/**
 * Verified Additional & Regional Contact Directory
 * Note: London & Canada share +1 2092978363 in source records (flagged for confirmation).
 */
export const REGIONAL_CONTACTS = [
  {
    id: "training-cert",
    region: "Training & Certification Desk",
    role: "Verification & Academic Support",
    type: "email",
    value: "certification@broadbeach.in",
    display: "certification@broadbeach.in",
    href: "mailto:certification@broadbeach.in",
    badge: "Global",
    description: "Official certificate issuance, exam administration, and syllabus inquiries."
  },
  {
    id: "saudi-arabia",
    region: "Saudi Arabia",
    role: "QC Trainer & Regional Liaison",
    type: "phone",
    value: "+966 599807084",
    display: "+966 599 807 084",
    href: "tel:+966599807084",
    badge: "Middle East",
    description: "Riyadh & KSA corporate quality management and auditor programs."
  },
  {
    id: "philippines",
    region: "Philippines",
    role: "Manila Desk",
    type: "phone",
    value: "+63 9061718210",
    display: "+63 906 171 8210",
    href: "tel:+639061718210",
    badge: "Southeast Asia",
    description: "Manila representative for regional enrollment and enterprise certifications."
  },
  {
    id: "nigeria-juedconsult",
    region: "Nigeria",
    role: "JUEDCONSULT Partner",
    type: "phone",
    value: "+234 8032648339",
    display: "+234 803 264 8339",
    href: "tel:+2348032648339",
    badge: "West Africa",
    description: "Authorized regional representative for executive and continuous improvement courses."
  },
  {
    id: "nigeria-citadel",
    region: "Nigeria",
    role: "CITADEL Partner",
    type: "phone",
    value: "+234 8034813085",
    display: "+234 803 481 3085",
    href: "tel:+2348034813085",
    badge: "West Africa",
    description: "Authorized regional partner for certification exams and corporate training."
  },
  {
    id: "mena-africa-asia",
    region: "MENA, Africa & Asia",
    role: "International Desk",
    type: "phone",
    value: "+91 7338649737",
    display: "+91 7338 649 737",
    href: "tel:+917338649737",
    badge: "Multi-Region",
    description: "Multi-region coordination hub for admissions, corporate tenders, and academic support."
  },
  {
    id: "canada-office",
    region: "Canada Office",
    role: "North America Liaison",
    type: "phone",
    value: "+1 2092978363",
    display: "+1 209 297 8363",
    href: "tel:+12092978363",
    badge: "North America",
    description: "Vancouver liaison for North American learner support and institutional inquiries.",
    flagged: true,
    flagNote: "Listed with identical phone number as London office; flagged for administrative confirmation."
  },
  {
    id: "london-office",
    region: "London Office",
    role: "UK & Europe Liaison",
    type: "phone",
    value: "+1 2092978363",
    display: "+1 209 297 8363",
    href: "tel:+12092978363",
    badge: "UK & Europe",
    description: "UK & European learner inquiries and representative desk.",
    flagged: true,
    flagNote: "Listed with identical phone number as Canada office; flagged for administrative confirmation."
  }
];

/**
 * Universal clipboard copy helper with fallback
 */
export async function copyToClipboard(text, label = "Item") {
  if (!text) return { success: false, error: new Error("No text provided") };
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }
  } catch (e) {
    // Fall back to execCommand
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) {
      return { success: true };
    }
    throw new Error("Fallback execCommand failed");
  } catch (err) {
    console.error(`Failed to copy ${label}:`, err);
    return { success: false, error: err };
  }
}


export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com"
};
