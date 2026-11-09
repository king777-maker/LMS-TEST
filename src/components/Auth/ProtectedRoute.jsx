import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

/**
 * ProtectedRoute
 * Enforces authentication for protected learning portal and dashboard routes.
 * Preserves the original requested URL and displays a clear message to the user.
 */
const ProtectedRoute = ({
  children,
  message = "Please log in first to start this course.",
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      toast.error(message, {
        id: "auth-gate-toast",
        duration: 4000,
        icon: "🔒",
        style: {
          borderRadius: "12px",
          background: "#131E4A",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#FFDB58",
          secondary: "#131E4A",
        },
      });
    }
  }, [loading, isAuthenticated, user, message]);

  // Show a smooth brand loading spinner while verifying server session
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-sm">
          Verifying your authentication & enrollment...
        </p>
      </div>
    );
  }

  // Not authenticated: redirect to /login and preserve original destination
  if (!isAuthenticated || !user) {
    const destination = location.pathname + location.search + location.hash;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(destination)}&message=${encodeURIComponent(message)}`}
        state={{ from: location, message }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
