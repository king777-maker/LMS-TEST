import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  adminLogin as apiLogin,
  adminLogin2FA as apiLogin2FA,
  adminLogout as apiLogout,
  getAdminMe,
} from "../api/adminApi";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH, isSecretAdminLoginPath } from "../utils/adminRoutes";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("bb_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const saveAdminLocally = useCallback((adminData) => {
    if (adminData) {
      const email = String(adminData.email || "").toLowerCase().trim();
      const rawRole = String(adminData.role || "").toLowerCase().trim();
      const normalizedRole = (email === "admin@broadbeachlearning.com" || rawRole === "super_admin")
        ? "super_admin"
        : (rawRole || "admin");

      const normalizedData = {
        ...adminData,
        role: normalizedRole
      };

      setCurrentAdmin(normalizedData);
      try {
        localStorage.setItem("bb_admin_user", JSON.stringify(normalizedData));
      } catch (e) {
        console.error("Local storage error:", e);
      }
    } else {
      setCurrentAdmin(null);
      try {
        localStorage.removeItem("bb_admin_user");
      } catch (e) {
        console.error("Local storage error:", e);
      }
    }
  }, []);

  // Check auth against server session on mount
  const checkAdminAuth = useCallback(async () => {
    // Only check auth if we have a saved admin session locally or are visiting an admin route
    const hasLocalAdmin = !!localStorage.getItem("bb_admin_user");
    const isAdminPath =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith(ADMIN_BASE_PATH) ||
        window.location.pathname.startsWith("/admin") ||
        isSecretAdminLoginPath(window.location.pathname));

    if (!hasLocalAdmin && !isAdminPath) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getAdminMe();
      if (res?.status && res?.data) {
        saveAdminLocally(res.data);
      } else {
        saveAdminLocally(null);
      }
    } catch {
      // Authoritative enforcement: clear local state if server check fails
      saveAdminLocally(null);
    } finally {
      setLoading(false);
    }
  }, [saveAdminLocally]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Step 1 Login: email + password
  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      if (res?.mfa_required) {
        return {
          mfa_required: true,
          challenge_id: res.challenge_id,
          email: res.email,
          name: res.name,
          message: res.message,
        };
      }
      if (res?.status && res?.data) {
        saveAdminLocally(res.data);
        const displayName = res.data.name || res.data.username || "Administrator";
        toast.success(`Welcome back, ${displayName}!`, { id: "admin-login-toast" });
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || "Invalid credentials.");
    } catch (err) {
      saveAdminLocally(null);
      const msg = err.status === 401
        ? "Invalid email or password."
        : (err.message || "Admin authentication failed. Please check backend connection.");
      toast.error(msg, { id: "admin-login-error" });
      const formatted = new Error(msg);
      formatted.status = err.status;
      throw formatted;
    }
  };


  // Step 2 Login: 6-digit TOTP code
  const verifyLogin2FA = async ({ challenge_id, code }) => {
    try {
      const res = await apiLogin2FA({ challenge_id, code });
      if (res?.status && res?.data) {
        saveAdminLocally(res.data);
        toast.success(`Two-Step Verification Confirmed. Welcome back, ${res.data.name}!`, {
          id: "admin-2fa-toast",
        });
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || "Invalid authenticator code.");
    } catch (err) {
      toast.error(err.message || "2-Step verification failed.", { id: "admin-2fa-error" });
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Logout notification error:", e.message);
    } finally {
      saveAdminLocally(null);
      toast.success("Admin signed out.", { id: "admin-logout-toast" });
    }
  };

  // Direct switch for testing roles in demo mode
  const switchDemoRole = (role) => {
    const rolesMap = {
      super_admin: {
        id: 1,
        name: "Administrator",
        email: "admin@broadbeachlearning.com",
        role: "super_admin",
      },
      cert_manager: {
        id: 2,
        name: "Sarah Jenkins",
        email: "cert.manager@broadbeach.in",
        role: "cert_manager",
      },
      support_agent: {
        id: 3,
        name: "Amitabh Roy",
        email: "support.agent@broadbeach.in",
        role: "support_agent",
      },
      read_only: {
        id: 4,
        name: "Elena Rostova",
        email: "readonly.admin@broadbeach.in",
        role: "read_only",
      },
    };
    const user = rolesMap[role] || rolesMap.super_admin;
    saveAdminLocally(user);
    toast.success(`Active Role switched to: ${user.name} (${user.role})`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__switchDemoRole = switchDemoRole;
    }
  }, [switchDemoRole]);

  // Authoritative permissions helpers with standard 3-tier hierarchy
  const rawRole = (currentAdmin?.role || "guest").toLowerCase().trim();
  const email = (currentAdmin?.email || "").toLowerCase().trim();
  const isSuperAdmin = rawRole === "super_admin" || email === "admin@broadbeachlearning.com";
  const isAdmin = isSuperAdmin || rawRole === "admin" || rawRole === "cert_manager";
  const isCertManager = isAdmin;
  const isSupportAgent = isSuperAdmin || rawRole === "support_agent" || rawRole === "support";
  const isReadOnly = rawRole === "read_only";

  const canManageCertificates = isSuperAdmin || isAdmin;
  const canManageTickets = isSuperAdmin || isAdmin || isSupportAgent;
  const canManageAdmins = isSuperAdmin;
  const canPurgeTrash = isSuperAdmin;
  const role = isSuperAdmin ? "super_admin" : rawRole;

  const value = {
    currentAdmin,
    isAuthenticated: Boolean(currentAdmin),
    loading,
    login,
    verifyLogin2FA,
    logout,
    switchDemoRole,
    role,
    isSuperAdmin,
    isAdmin,
    isCertManager,
    isSupportAgent,
    isReadOnly,
    canManageCertificates,
    canManageTickets,
    canManageAdmins,
    canPurgeTrash,
    refreshAdmin: checkAdminAuth,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export default AdminContext;
