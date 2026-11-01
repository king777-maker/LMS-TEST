import React from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { adminRoutes } from "../../utils/adminRoutes";
import AdminLogin from "../../pages/admin/AdminLogin";
import { FaLock } from "react-icons/fa";

const AdminProtectedRoute = ({ children, allowedRoles }) => {
  const { currentAdmin, isAuthenticated, isSuperAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07192F] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 text-sm font-semibold tracking-wide">
          Verifying Broadbeach Academy Administration Privileges...
        </p>
      </div>
    );
  }

  // When unauthenticated, render the dedicated Admin Login portal so the administrator can sign in
  if (!isAuthenticated || !currentAdmin) {
    return <AdminLogin />;
  }

  // Super Admin has authoritative, unconditional access to all administration modules
  const currentRole = (currentAdmin.role || "").toLowerCase().trim();
  const isSuper = Boolean(
    isSuperAdmin ||
    currentRole === "super_admin" ||
    currentAdmin.email === "admin@broadbeachlearning.com"
  );

  if (isSuper) {
    return children;
  }

  // Role validation for standard admin and support staff
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());

    // Check direct match or standard aliases
    let hasAccess = normalizedAllowed.includes(currentRole);
    if (!hasAccess && (currentRole === "admin" || currentRole === "cert_manager")) {
      hasAccess = normalizedAllowed.includes("admin") || normalizedAllowed.includes("cert_manager");
    }
    if (!hasAccess && (currentRole === "support" || currentRole === "support_agent" || currentRole === "staff")) {
      hasAccess = normalizedAllowed.includes("support") || normalizedAllowed.includes("support_agent") || normalizedAllowed.includes("staff");
    }

    if (!hasAccess) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-[#0B315B] mb-2">Access Restricted</h2>
          <p className="text-slate-600 max-w-md text-sm mb-6 leading-relaxed">
            Your current role (<strong className="capitalize">{currentAdmin.role?.replace("_", " ")}</strong>) does not have permission to access this module. Please contact the Super Administrator if you require elevated privileges.
          </p>
          <div className="flex gap-3">
            <Link
              to={adminRoutes.base}
              className="px-5 py-2.5 bg-[#0B315B] hover:bg-[#183B73] text-white text-sm font-bold rounded-xl transition"
            >
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default AdminProtectedRoute;
