import axios from "axios";

/**
 * Resolves the authoritative API Base URL:
 * - Trims whitespace & trailing slashes from VITE_API_URL if configured
 * - In testing clone (LMS-test), defaults to local dev/test proxy ("/api") to prevent accidental production mutations
 * - If running in browser on a Vercel deployment (*.vercel.app), uses "/api" to route via Vercel Edge Proxy
 */
export const getApiBaseUrl = () => {
    // 1. Explicit environment variable takes highest precedence
    const rawEnv = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
    if (rawEnv) return rawEnv;

    if (typeof window !== "undefined") {
        // Local development: use Vite dev server middleware (/api)
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "/api";
        }
        // Vercel deployment: use Vercel edge reverse proxy rewrites configured in vercel.json
        if (window.location.hostname.endsWith(".vercel.app")) {
            return "/api";
        }
    }

    if (import.meta.env.DEV) {
        return "/api";
    }

    // Testing clone safe fallback: route via proxy to prevent accidental production DB writes
    return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const userToken = localStorage.getItem("bb_user_token");
        if (userToken) {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${userToken}`;
            }
            if (!config.headers["X-User-Token"]) {
                config.headers["X-User-Token"] = userToken;
            }
        }
    }
    return config;
});

/* =========================================
   ENROLL IN COURSE
========================================= */

export const enrollCourse = (certificationId) => {
    return api.post(
        "/enroll-course",
        {
            certification_id: Number(certificationId),
        }
    );
};

export const testSession = () => {
    return api.get("/session-test");
};

/* =========================================
   GET MY COURSES
========================================= */

export const getMyCourses = () => {
    return api.get(
        "/my-courses"
    );
};

/* =========================================
   REGISTER USER
========================================= */

export const registerUser = (data) => {
    return api.post(
        "/register",
        data
    );
};

/* =========================================
   GET LESSON RESOURCES
========================================= */

export const getLessonResources = (lessonId) => {
    return api.get(
        "/lesson-resources",
        {
            params: {
                lesson_id: lessonId,
            },
        }
    );
};

/* =========================================
   LOGIN USER
========================================= */

export const loginUser = (data) => {
    return api.post(
        "/login",
        data
    );
};

/* =========================================
   LOGOUT USER
========================================= */

export const logoutUser = () => {
    return api.post(
        "/logout"
    );
};

/* =========================================
   GET USER PROFILE
========================================= */

export const getUserProfile = () => {
    return api.get(
        "/profile"
    );
};

/* =========================================
   UPDATE USER PROFILE
========================================= */

export const updateUserProfile = (data) => {
    return api.post(
        "/update-profile",
        data
    );
};

/* =========================================
   STUDENT SUPPORT TICKETS (REQ 3)
========================================= */

export const raiseStudentTicket = (data) => {
    return api.post(
        "/tickets",
        data
    );
};

export const getMyTickets = (params = {}) => {
    return api.get(
        "/tickets/my",
        { params }
    );
};

/* =========================================
   GET ALL FREE CERTIFICATIONS
========================================= */

export const getFreeCertifications = () => {
    return api.get(
        "/free-certifications"
    );
};

/* =========================================
   GET SINGLE FREE CERTIFICATION
========================================= */

export const getFreeCertification = (id) => {
    return api.get(
        "/free-certification",
        {
            params: {
                id: id,
            },
        }
    );
};

/* =========================================
   GET COURSE LESSONS
========================================= */

export const getCourseLessons = (certificationId) => {
    return api.get(
        "/course-lessons",
        {
            params: {
                certification_id: certificationId,
            },
        }
    );
};

/* =========================================
   GET ASSESSMENT
========================================= */

export const getAssessment = (id) => {
    return api.get(
        "/assessment",
        {
            params: {
                id: id,
            },
        }
    );
};

/* =========================================
   SUBMIT ASSESSMENT
========================================= */

export const submitAssessment = (data) => {
    return api.post(
        "/submit-assessment",
        data
    );
};

/* =========================================
   CREATE CERTIFICATE
========================================= */

export const createCertificate = (data) => {
    return api.post(
        "/create-certificate",
        data
    );
};

// =====================================================
// PUBLIC PROFESSIONAL CERTIFICATIONS MENU
// =====================================================

export const getProfessionalCertificationMenu = async () => {
    try {
        const response = await api.get(
            "/professional-certifications-menu"
        );
        return response.data;
    } catch (error) {
        console.error(
            "PUBLIC PROFESSIONAL CERTIFICATIONS ERROR:",
            error?.response?.data || error
        );
        throw error;
    }
};

// =========================================
// HEADER MENU
// =========================================

export const getHeaderMenu = () => {
    return api.get(
        "/header-menu"
    );
};

export const getCourseDetails = (slug) => {
    return api.get(
        `/courses/${encodeURIComponent(slug)}`
    );
};

export const redeemCourseCoupon = (data) => {
    return api.post(
        "/redeem-course-coupon",
        data
    );
};

// =====================================================
// REDEEM CERTIFICATE COUPON
// =====================================================

export const redeemCertificateCoupon = (data) => {
    return api.post(
        "/redeem-certificate-coupon",
        data
    );
};

/* =========================================
   GET ALL FEATURED COURSES
========================================= */

export const getFeaturedCourses = () => {
    return api.get(
        "/featured-courses"
    );
};

/* =========================================
   GET SINGLE FEATURED COURSE
========================================= */

export const getFeaturedCourse = (id) => {
    return api.get(
        "/featured-course",
        {
            params: {
                id: id,
            },
        }
    );
};

/* =========================================
   SUBMIT COURSE OFFLINE ENQUIRY
========================================= */

export const submitCourseEnquiry = (data) => {
    return api.post(
        "/course-enquiry",
        data
    );
};

/* =========================================
   VERIFY CERTIFICATE
========================================= */

export const verifyCertificate = (certificateNumber) => {
    return api.get("/certificates/verify", {
        params: {
            certificate_number: certificateNumber,
        },
    });
};

/* =========================================
   COURSE PROGRESS & CHAPTER UNLOCKING
========================================= */

export const getCourseProgressApi = (certificationId, userId = null) => {
    const params = { certification_id: certificationId };
    if (userId) params.user_id = userId;
    return api.get("/course-progress", { params });
};

export const completeLessonApi = (data) => {
    return api.post("/complete-lesson", data);
};

export const getCourseMaterialsApi = (certificationId, userId = null) => {
    const params = { certification_id: certificationId };
    if (userId) params.user_id = userId;
    return api.get("/course-materials", { params });
};

export default api;