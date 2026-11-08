import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const getCanonicalOrigin = () => {
    if (typeof import.meta !== "undefined" && (import.meta.env?.VITE_APP_URL || import.meta.env?.VITE_SITE_URL)) {
        return (import.meta.env.VITE_APP_URL || import.meta.env.VITE_SITE_URL).replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "http://localhost:3000";
};

const CANONICAL_ORIGIN = getCanonicalOrigin();
const DEFAULT_TITLE = "Broadbeach Online Academy | Globally Accredited Certifications & Courses";
const DEFAULT_DESCRIPTION =
    "Master ISO, EHS, Quality, Information Security & Industrial Management standards with globally recognized self-paced online certifications, exams, and verified credentials.";
const DEFAULT_IMAGE = `${CANONICAL_ORIGIN}/og-image.png`;

/**
 * Reusable SEO & Meta Manager component.
 * Injects/updates document title, meta descriptions, canonical link, Open Graph, Twitter cards, and JSON-LD structured data.
 */
export const SEO = ({
    title,
    description,
    canonicalUrl,
    image,
    imageAlt,
    type = "website",
    noIndex = false,
    course = null,
    breadcrumbs = null,
}) => {
    const location = useLocation();

    useEffect(() => {
        // 1. Title
        const finalTitle = title ? `${title} | Broadbeach Online Academy` : DEFAULT_TITLE;
        document.title = finalTitle;

        // Helper to set or create meta tags
        const setMetaTag = (attribute, name, content) => {
            if (!content) return;
            let el = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attribute, name);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        // 2. Standard Meta
        const finalDescription = description || DEFAULT_DESCRIPTION;
        setMetaTag("name", "description", finalDescription);
        setMetaTag("name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large");

        // 3. Canonical Link
        const path = location.pathname.replace(/^\/broadbeachlearning\.com/, "") || "/";
        const finalCanonical = canonicalUrl || `${CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
        let canonicalEl = document.querySelector('link[rel="canonical"]');
        if (!canonicalEl) {
            canonicalEl = document.createElement("link");
            canonicalEl.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalEl);
        }
        canonicalEl.setAttribute("href", finalCanonical);

        // 4. Open Graph Tags
        const finalImage = image || DEFAULT_IMAGE;
        setMetaTag("property", "og:title", finalTitle);
        setMetaTag("property", "og:description", finalDescription);
        setMetaTag("property", "og:type", type);
        setMetaTag("property", "og:url", finalCanonical);
        setMetaTag("property", "og:image", finalImage);
        setMetaTag("property", "og:image:alt", imageAlt || "Broadbeach Online Academy");
        setMetaTag("property", "og:site_name", "Broadbeach Online Academy");

        // 5. Twitter Card Tags
        setMetaTag("name", "twitter:card", "summary_large_image");
        setMetaTag("name", "twitter:title", finalTitle);
        setMetaTag("name", "twitter:description", finalDescription);
        setMetaTag("name", "twitter:image", finalImage);

        // 6. JSON-LD Structured Data
        const scriptId = "bb-seo-jsonld";
        let scriptEl = document.getElementById(scriptId);
        if (!scriptEl) {
            scriptEl = document.createElement("script");
            scriptEl.id = scriptId;
            scriptEl.type = "application/ld+json";
            document.head.appendChild(scriptEl);
        }

        const schemas = [];

        // Organization Schema
        schemas.push({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Broadbeach Online Academy",
            "url": CANONICAL_ORIGIN,
            "logo": `${CANONICAL_ORIGIN}/logo.png`,
            "description": "Accredited provider of online ISO Lead Auditor, Internal Auditor, and Lean Six Sigma professional certifications.",
            "email": "certification@broadbeach.in",
            "telephone": "+91 99400 99400",
            "sameAs": [
                "https://facebook.com",
                "https://linkedin.com",
                "https://instagram.com"
            ],
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
            }
        });

        // WebSite Schema with SearchAction
        schemas.push({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Broadbeach Online Academy",
            "url": CANONICAL_ORIGIN,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${CANONICAL_ORIGIN}/course?search={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        });

        // Course Schema (if course prop is supplied)
        if (course) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "Course",
                "name": course.title || course.course_name,
                "description": course.description || finalDescription,
                "provider": {
                    "@type": "Organization",
                    "name": "Broadbeach Online Academy",
                    "sameAs": CANONICAL_ORIGIN
                },
                "hasCourseInstance": {
                    "@type": "CourseInstance",
                    "courseMode": "Online",
                    "courseWorkload": course.hours || course.duration || "Self-Paced"
                },
                "educationalCredentialAwarded": "Accredited Certificate of Competence"
            });
        }

        // Breadcrumbs Schema (if breadcrumbs prop is supplied)
        if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map((crumb, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": crumb.name,
                    "item": crumb.url.startsWith("http") ? crumb.url : `${CANONICAL_ORIGIN}${crumb.url}`
                }))
            });
        }

        scriptEl.textContent = JSON.stringify(schemas);

    }, [title, description, canonicalUrl, image, imageAlt, type, noIndex, course, breadcrumbs, location.pathname]);

    return null;
};

export default SEO;
