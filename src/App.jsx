import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthPromptProvider } from "./context/AuthPromptContext";
import { AdminProvider } from "./context/AdminContext";

/* =========================================================
   BROADBEACH ACADEMY ADMIN PANEL (5 MODULES)
========================================================= */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OnlineCertMaster from "./pages/admin/OnlineCertMaster";
import ManualCertMaster from "./pages/admin/ManualCertMaster";
import TicketMaster from "./pages/admin/TicketMaster";
import TrashBin from "./pages/admin/TrashBin";
import AdminAccess from "./pages/admin/AdminAccess";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import { adminRoutes, ADMIN_BASE_PATH, isSecretAdminLoginPath } from "./utils/adminRoutes";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Course from "./pages/Course";
import Enroll from "./pages/Enroll";
import Learning from "./pages/Learning";
import Assignment from "./pages/Assignment";
import Result from "./pages/Result";
import Certificate from "./pages/Certificate";
import LessonVideo from "./pages/LessonVideo";
import LessonContent from "./pages/LessonContent";
import LessonSlides from "./pages/LessonSlides";

import { Toaster } from "react-hot-toast";

import History from "./pages/History";
import Vision from "./pages/Vision";
import CoreValues from "./pages/CoreValues";
import OurTeam from "./pages/OurTeam";
import Accreditations from "./pages/Accreditations";
import Ourcoustmers from "./pages/Ourcoustmers";
import Industries from "./pages/Industries";
import Media from "./pages/Media";
import Global from "./pages/Global";

import CourseDetails from "./pages/courses/CourseDetails";
import FreeCoursesPage from "./pages/FreeCoursesPage";
import CertificateAccess from "./pages/CertificateAccess";
import MainCategoryPage from "./pages/MainCategoryPage";
import ScrollToTop from "./components/ScrollToTop";

import FeaturedEnroll from "./pages/FeaturedEnroll";
import Contact from "./pages/Contact";

/* =========================================================
   CATEGORY PAGES
========================================================= */
import Environment from "./pages/categories/Environment";
import FoodSafety from "./pages/categories/FoodSafety";
import VerifyCertificate from "./pages/categories/VerifyCertificate";
import InformationSecurity from "./pages/categories/InformationSecurity";
import EHSCertifications from "./pages/categories/EHSCertifications";
import ManagementCertifications from "./pages/categories/ManagementCertifications";
import MyCourses from "./pages/MyCourses";
import MyProfile from "./pages/MyProfile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AboutUs from "./pages/AboutUs";
import AccreditationsApprovals from "./pages/AccreditationsApprovals";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import ReturnPolicy from "./pages/ReturnPolicy";
import DataCompliancePolicy from "./pages/DataCompliancePolicy";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import CookiePolicy from "./pages/CookiePolicy";
import RaiseATicket from "./pages/RaiseATicket";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/common/CookieConsent";
import MaintenancePage from "./pages/MaintenancePage";
import { IS_MAINTENANCE_MODE } from "./config/maintenance";



/**
 * BlogRedirect
 * Forwards any direct visits to /blog or /blogs to the official Broadbeach Medium publication.
 */
function BlogRedirect() {
  React.useEffect(() => {
    window.location.replace("https://medium.com/@broadbeach.in");
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-slate-800 font-extrabold text-lg sm:text-xl">Redirecting to Broadbeach Academy on Medium...</h2>
      <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
        Taking you to our official Medium publication. If you are not redirected within 3 seconds,{" "}
        <a
          href="https://medium.com/@broadbeach.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-bold"
        >
          click here
        </a>.
      </p>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isLearningPlayer = location.pathname.startsWith("/learning");
  const isAdminRoute =
    location.pathname.startsWith(ADMIN_BASE_PATH) ||
    location.pathname.startsWith("/admin") ||
    isSecretAdminLoginPath(location.pathname);

  // Centralized Maintenance Mode Interception:
  // All public website and deep course routes render the custom Under Maintenance page.
  // Secure administrative routes remain accessible for authorized personnel.
  if (IS_MAINTENANCE_MODE && !isAdminRoute) {
    return (
      <AuthProvider>
        <AdminProvider>
          <AuthPromptProvider>
            <MaintenancePage />
          </AuthPromptProvider>
        </AdminProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AdminProvider>
        <AuthPromptProvider>
          <div className={`min-h-screen ${isAdminRoute ? "bg-slate-100" : "bg-white overflow-x-clip"}`}>

          {/* =====================================================
              SCROLL TO TOP (LEARNER PORTAL)
          ===================================================== */}
          {!isAdminRoute && <ScrollToTop />}

          {/* =====================================================
              HEADER (LEARNER PORTAL)
          ===================================================== */}
          {!isAdminRoute && !isLearningPlayer && <Header />}

          <main className={isLearningPlayer ? "h-screen overflow-hidden" : ""}>
            <Toaster
              position="top-right"
              containerStyle={{
                top: isAdminRoute ? 20 : 85,
              }}
              toastOptions={{
                duration: 4000,
              }}
            />


          {/* ===================================================
              ALL ROUTES
          =================================================== */}
          <Routes>

            {/* =================================================
                HOME
            ================================================= */}
            <Route
              path="/"
              element={<Home />}
            />


            {/* =================================================
                ABOUT
            ================================================= */}
            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/about/history"
              element={<History />}
            />

            <Route
              path="/about/vision"
              element={<Vision />}
            />

            <Route
              path="/about/core-values"
              element={<CoreValues />}
            />

            <Route
              path="/about/our-team"
              element={<OurTeam />}
            />

            <Route
              path="/about/accreditations"
              element={<Accreditations />}
            />

            <Route
              path="/about/our-customers"
              element={<Ourcoustmers />}
            />

            <Route
              path="/about/industries"
              element={<Industries />}
            />

            <Route
              path="/about/relations"
              element={<Media />}
            />

            <Route
              path="/about/global-foot-print"
              element={<Global />}
            />


            {/* =================================================
                COURSE
            ================================================= */}
            <Route
              path="/course"
              element={<Course />}
            />

            <Route
              path="/enroll/:id"
              element={<Enroll />}
            />

            <Route
              path="/featured-enroll/:id"
              element={<FeaturedEnroll />}
            />


            {/* =================================================
                LEARNING
            ================================================= */}
            <Route
              path="/learning/:id"
              element={<Learning />}
            />

            <Route
              path="/assignment/:id"
              element={<Assignment />}
            />

            <Route
              path="/result/:id"
              element={<Result />}
            />

            <Route
              path="/certificate/:id"
              element={<Certificate />}
            />


            {/* =================================================
                CONTACT
            ================================================= */}
            <Route
              path="/contact"
              element={<Contact />}
            />


            {/* =================================================
                LESSON ROUTES
            ================================================= */}
            <Route
              path="/video/:courseId/:lessonId"
              element={<LessonVideo />}
            />

            <Route
              path="/content/:courseId/:lessonId"
              element={<LessonContent />}
            />

            <Route
              path="/slides/:courseId/:lessonId"
              element={<LessonSlides />}
            />


            {/* =================================================
                MAIN CATEGORY
                Dynamic DB category
            ================================================= */}
            <Route
              path="/category/:slug"
              element={<MainCategoryPage />}
            />

            {/* =================================================
                LEAD AUDITOR (LANDING / ENQUIRY / LAUNCHING SOON)
            ================================================= */}
            <Route path="/lead-auditor" element={<MainCategoryPage />} />
            <Route path="/lead-auditors" element={<MainCategoryPage />} />
            <Route path="/category/lead-auditor" element={<MainCategoryPage />} />
            <Route path="/broadbeachlearning.com/category/lead-auditor" element={<MainCategoryPage />} />
            <Route path="/lead-auditor/:slug" element={<CourseDetails />} />

            {/* =================================================
                INTERNAL AUDITOR (LANDING / ENQUIRY / LAUNCHING SOON)
            ================================================= */}
            <Route path="/internal-auditor" element={<MainCategoryPage />} />
            <Route path="/internal-auditors" element={<MainCategoryPage />} />
            <Route path="/category/internal-auditor" element={<MainCategoryPage />} />
            <Route path="/broadbeachlearning.com/category/internal-auditor" element={<MainCategoryPage />} />
            <Route path="/internal-auditor/:slug" element={<CourseDetails />} />

            {/* =================================================
                HEALTH & SAFETY / HSE (LANDING / ENQUIRY / LAUNCHING SOON)
            ================================================= */}
            <Route path="/health-safety-hse" element={<MainCategoryPage />} />
            <Route path="/health-safety" element={<MainCategoryPage />} />
            <Route path="/health-and-safety" element={<MainCategoryPage />} />
            <Route path="/h-and-s" element={<MainCategoryPage />} />
            <Route path="/hse" element={<MainCategoryPage />} />
            <Route path="/category/health-safety-hse" element={<MainCategoryPage />} />
            <Route path="/category/health-safety" element={<MainCategoryPage />} />
            <Route path="/category/health-and-safety" element={<MainCategoryPage />} />
            <Route path="/category/h-and-s" element={<MainCategoryPage />} />
            <Route path="/category/health-safety-environment" element={<MainCategoryPage />} />
            <Route path="/broadbeachlearning.com/category/health-safety-environment" element={<MainCategoryPage />} />
            <Route path="/health-safety-hse/:slug" element={<CourseDetails />} />
            <Route path="/health-safety/:slug" element={<CourseDetails />} />

            {/* =================================================
                PROFESSIONAL CERTIFICATIONS (LANDING / ENQUIRY / LAUNCHING SOON)
            ================================================= */}
            <Route path="/professional-certifications" element={<MainCategoryPage />} />
            <Route path="/professional-cert" element={<MainCategoryPage />} />
            <Route path="/professional-certs" element={<MainCategoryPage />} />
            <Route path="/professional-certification" element={<MainCategoryPage />} />
            <Route path="/category/professional-certifications" element={<MainCategoryPage />} />
            <Route path="/category/professional-cert" element={<MainCategoryPage />} />
            <Route path="/category/professional-certs" element={<MainCategoryPage />} />
            <Route path="/category/professional-certification" element={<MainCategoryPage />} />
            <Route path="/professional-certifications/:slug" element={<CourseDetails />} />
            <Route path="/professional-cert/:slug" element={<CourseDetails />} />

            {/* =================================================
                LEAN SIX SIGMA
            ================================================= */}
            <Route path="/lean-six-sigma" element={<MainCategoryPage />} />
            <Route path="/category/lean-six-sigma" element={<MainCategoryPage />} />
            <Route path="/broadbeachlearning.com/category/lean-six-sigma" element={<MainCategoryPage />} />
            <Route path="/lean-six-sigma/:slug" element={<CourseDetails />} />

            {/* =================================================
                AEROSPACE
            ================================================= */}
            <Route path="/aerospace" element={<MainCategoryPage />} />
            <Route path="/category/aerospace" element={<MainCategoryPage />} />
            <Route path="/broadbeachlearning.com/category/aerospace" element={<MainCategoryPage />} />
            <Route path="/aerospace/:slug" element={<CourseDetails />} />

            {/* =================================================
                ADDITIONAL CATEGORIES (LANDING / ENQUIRY / LAUNCHING SOON)
            ================================================= */}
            <Route path="/management-certifications" element={<MainCategoryPage />} />
            <Route path="/category/management-certifications" element={<MainCategoryPage />} />
            <Route path="/broadbeachlearning.com/category/management-certifications" element={<MainCategoryPage />} />
            <Route path="/information-security" element={<MainCategoryPage />} />
            <Route path="/category/information-security" element={<MainCategoryPage />} />
            <Route path="/category/information-security-business-continuity" element={<MainCategoryPage />} />
            <Route path="/environment" element={<MainCategoryPage />} />
            <Route path="/category/environment" element={<MainCategoryPage />} />
            <Route path="/food-safety" element={<MainCategoryPage />} />
            <Route path="/category/food-safety" element={<MainCategoryPage />} />

            {/* =================================================
                FREE COURSES
            ================================================= */}
            <Route
              path="/courses"
              element={<Course />}
            />
            <Route
              path="/free-courses"
              element={<FreeCoursesPage />}
            />
            <Route
              path="/free-certifications"
              element={<FreeCoursesPage />}
            />
            <Route
              path="/category/free-courses"
              element={<FreeCoursesPage />}
            />
            <Route
              path="/courses/free-courses"
              element={<FreeCoursesPage />}
            />
            <Route
              path="/free-course"
              element={<FreeCoursesPage />}
            />
            <Route
              path="/free-courses/:slug"
              element={<CourseDetails />}
            />
            <Route
              path="/free-course/:slug"
              element={<CourseDetails />}
            />
            <Route
              path="/courses/:slug"
              element={<CourseDetails />}
            />
            <Route
              path="/courses/:category/:slug"
              element={<CourseDetails />}
            />
            <Route
              path="/course/:slug"
              element={<CourseDetails />}
            />


            {/* =================================================
                CERTIFICATE ACCESS
                Existing dynamic route
            ================================================= */}
            <Route
              path="/certificate-access/:id"
              element={<CertificateAccess />}
            />


            {/* =================================================
                VERIFY CERTIFICATE
                New standalone page
            ================================================= */}
            <Route
              path="/certificate-access"
              element={<VerifyCertificate />}
            />
            <Route
              path="/verify-certificate"
              element={<VerifyCertificate />}
            />
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/register"
              element={<RegisterPage />}
            />
            <Route
              path="/my-courses"
              element={<MyCourses />}
            />

            <Route
              path="/my-profile"
              element={<MyProfile />}
            />
            <Route
              path="/profile"
              element={<Navigate to="/my-profile" replace />}
            />
            <Route
              path="/cookie-policy"
              element={<CookiePolicy />}
            />
            <Route
              path="/accessibility-statement"
              element={<AccessibilityStatement />}
            />
            <Route
              path="/blog"
              element={<BlogRedirect />}
            />
            <Route
              path="/blogs"
              element={<BlogRedirect />}
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route
              path="/accreditations-approvals"
              element={<AccreditationsApprovals />}
            />
            <Route
              path="/terms-conditions"
              element={<TermsAndConditions />}
            />
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />
            <Route
              path="/cancellation-refund-policy"
              element={<CancellationRefundPolicy />}
            />
            <Route
              path="/terms-of-use"
              element={<TermsOfUse />}
            />
            <Route
              path="/return-policy"
              element={<ReturnPolicy />}
            />
            <Route
              path="/data-compliance-policy"
              element={<DataCompliancePolicy />}
            />
            <Route
              path="/raise-a-ticket"
              element={<RaiseATicket />}
            />

            {/* =================================================
                BROADBEACH ACADEMY ADMIN PANEL (5 MODULES)
            ================================================= */}
            {/* Configurable cryptographically random admin login route */}
            <Route path={adminRoutes.login} element={<AdminLogin />} />

            {/* Support standard /admin/login directly */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path={adminRoutes.base}
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path={`${adminRoutes.base}/dashboard`}
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path={adminRoutes.onlineCerts}
              element={
                <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager", "support_agent", "read_only"]}>
                  <AdminLayout>
                    <OnlineCertMaster />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path={adminRoutes.manualCerts}
              element={
                <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager", "read_only"]}>
                  <AdminLayout>
                    <ManualCertMaster />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path={adminRoutes.tickets}
              element={
                <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager", "support_agent", "read_only"]}>
                  <AdminLayout>
                    <TicketMaster />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path={adminRoutes.trash}
              element={
                <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager"]}>
                  <AdminLayout>
                    <TrashBin />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path={adminRoutes.access}
              element={
                <AdminProtectedRoute allowedRoles={["super_admin"]}>
                  <AdminLayout>
                    <AdminAccess />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            {/* Backwards compatibility aliases if ADMIN_BASE_PATH is customized */}
            {ADMIN_BASE_PATH !== "/admin" && (
              <>
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/online-certs"
                  element={
                    <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager", "support_agent", "read_only"]}>
                      <AdminLayout>
                        <OnlineCertMaster />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/manual-certs"
                  element={
                    <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager", "read_only"]}>
                      <AdminLayout>
                        <ManualCertMaster />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tickets"
                  element={
                    <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager", "support_agent", "read_only"]}>
                      <AdminLayout>
                        <TicketMaster />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/trash"
                  element={
                    <AdminProtectedRoute allowedRoles={["super_admin", "admin", "cert_manager"]}>
                      <AdminLayout>
                        <TrashBin />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/access"
                  element={
                    <AdminProtectedRoute allowedRoles={["super_admin"]}>
                      <AdminLayout>
                        <AdminAccess />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />
              </>
            )}

            {/* =================================================
                404 CATCH-ALL ROUTE
            ================================================= */}
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>

        </main>


        {/* =====================================================
            COOKIE CONSENT PREFERENCES
        ===================================================== */}
        {!isAdminRoute && !isLearningPlayer && <CookieConsent />}

        {/* =====================================================
            FOOTER
        ===================================================== */}
        {!isAdminRoute && !isLearningPlayer && <Footer />}

      </div>
      </AuthPromptProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;