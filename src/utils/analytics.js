/**
 * ============================================================================
 * BROADBEACH ACADEMY — PRIVACY-CONSCIOUS CONVERSION & EVENT ANALYTICS
 * ============================================================================
 * 
 * Rules:
 * 1. Checks user cookie consent ('analytics') before transmitting events.
 * 2. NEVER collects or transmits PII (passwords, emails, phone numbers, tokens).
 * 3. Distinguishes attempts from confirmed successes.
 * 4. Deduplicates identical events within 1.5s to prevent React strict-mode double firing.
 * 5. Uses environment variable VITE_GA_ID when available; logs to console in dev mode.
 */

const DEDUPE_WINDOW_MS = 1500;
const recentEvents = new Map();

/**
 * Check whether analytics tracking has been consented by the user.
 */
export const hasAnalyticsConsent = () => {
    try {
        const stored = localStorage.getItem("bb_cookie_consent_v1");
        if (!stored) return false;
        const parsed = JSON.parse(stored);
        return Boolean(parsed?.categories?.analytics);
    } catch {
        return false;
    }
};

/**
 * Cleanse any potentially sensitive values from the payload before dispatching.
 */
const sanitizePayload = (payload = {}) => {
    const sanitized = { ...payload };
    const forbiddenKeys = [
        "password",
        "email",
        "phone",
        "token",
        "credential",
        "secret",
        "name",
        "message",
        "fullName",
    ];

    for (const key of Object.keys(sanitized)) {
        if (forbiddenKeys.some((f) => key.toLowerCase().includes(f))) {
            delete sanitized[key];
        }
    }

    return sanitized;
};

/**
 * Core event tracking dispatcher.
 * @param {string} eventName - Standardized event name (e.g., 'course_view', 'enrollment_attempt')
 * @param {object} eventParams - Non-sensitive event metadata
 */
export const trackEvent = (eventName, eventParams = {}) => {
    if (!eventName || typeof eventName !== "string") return;

    // Deduplication check
    const serialized = `${eventName}:${JSON.stringify(eventParams)}`;
    const now = Date.now();
    const lastTimestamp = recentEvents.get(serialized) || 0;
    if (now - lastTimestamp < DEDUPE_WINDOW_MS) {
        return; // Suppress duplicate burst
    }
    recentEvents.set(serialized, now);

    const safeParams = sanitizePayload(eventParams);
    safeParams.timestamp = new Date().toISOString();

    // Check user consent
    const consentGranted = hasAnalyticsConsent();

    // Always log in development for local verification
    if (import.meta.env.DEV || import.meta.env.MODE === "development") {
        console.groupCollapsed(
            `%c[Analytics Event]%c ${eventName} %c${consentGranted ? "(Consent Granted)" : "(Consent Pending/Blocked)"}`,
            "background: #131E4A; color: #F7C600; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
            "font-weight: bold;",
            consentGranted ? "color: green;" : "color: orange;"
        );
        console.log("Payload:", safeParams);
        console.groupEnd();
    }

    // If no consent has been granted, suppress external transmission
    if (!consentGranted) {
        return;
    }

    // Google Analytics (gtag.js) integration if present
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, safeParams);
    }

    // Custom browser event for internal subscribers
    window.dispatchEvent(
        new CustomEvent("bb_analytics_event", {
            detail: { event: eventName, params: safeParams },
        })
    );
};

// ============================================================================
// CONVENIENCE EVENT EMITTERS
// ============================================================================

export const analytics = {
    // Course viewing
    courseView: (courseId, courseTitle, category) => {
        trackEvent("course_view", {
            course_id: String(courseId),
            course_title: courseTitle,
            category: category || "general",
        });
    },

    // Search query interaction
    courseSearch: (query, resultCount) => {
        if (!query || query.trim().length === 0) return;
        trackEvent("course_search", {
            search_query: query.trim().substring(0, 50),
            result_count: Number(resultCount) || 0,
        });
    },

    // Enrollment flow
    enrollmentAttempt: (courseId, courseTitle, isFree = true) => {
        trackEvent("enrollment_attempt", {
            course_id: String(courseId),
            course_title: courseTitle,
            is_free: Boolean(isFree),
        });
    },

    enrollmentConfirmed: (courseId, courseTitle, enrollmentId) => {
        trackEvent("enrollment_confirmed", {
            course_id: String(courseId),
            course_title: courseTitle,
            enrollment_id: String(enrollmentId || "confirmed"),
        });
    },

    // Authentication events (strictly no credentials)
    loginSuccess: () => {
        trackEvent("login_success", { method: "session_auth" });
    },

    registrationSuccess: () => {
        trackEvent("registration_success", { method: "standard" });
    },

    // Contact form events
    contactAttempt: (subject) => {
        trackEvent("contact_form_attempt", {
            subject: subject || "general_inquiry",
        });
    },

    contactSuccess: (subject) => {
        trackEvent("contact_form_success", {
            subject: subject || "general_inquiry",
        });
    },

    // Certificate verification & download
    certificateVerifyAttempt: (certificateNumberLength) => {
        trackEvent("certificate_verification_attempt", {
            input_length: certificateNumberLength,
        });
    },

    certificateDownload: (certificateId, courseTitle) => {
        trackEvent("certificate_download", {
            certificate_id: String(certificateId),
            course_title: courseTitle,
        });
    },
};

export default analytics;
