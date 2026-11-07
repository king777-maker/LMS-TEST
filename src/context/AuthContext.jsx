import toast from "react-hot-toast";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  testSession,
} from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bb_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync state to localStorage whenever user changes
  const saveUserLocally = useCallback((userData) => {
    if (userData) {
      // Normalize name & full_name
      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      const fullName =
        userData.name ||
        userData.full_name ||
        `${firstName} ${lastName}`.trim() ||
        "Student";

      // Persist or preserve token
      const existingToken = localStorage.getItem("bb_user_token") || "";
      const token = userData.token || userData.auth_token || existingToken;
      if (token) {
        try {
          localStorage.setItem("bb_user_token", token);
        } catch (e) {
          console.error("Local storage token error:", e);
        }
      }

      const normalized = {
        ...userData,
        name: fullName,
        full_name: fullName,
        ...(token ? { token } : {}),
      };

      setUser(normalized);
      try {
        localStorage.setItem("bb_user", JSON.stringify(normalized));
        localStorage.setItem("user", JSON.stringify(normalized));
        if (normalized.id || normalized.user_id) {
          localStorage.setItem("bb_user_id", String(normalized.id || normalized.user_id));
        }
      } catch (e) {
        console.error("Local storage error:", e);
      }
      return normalized;
    } else {
      setUser(null);
      try {
        localStorage.removeItem("bb_user");
        localStorage.removeItem("user");
        localStorage.removeItem("bb_user_id");
        localStorage.removeItem("bb_user_token");
      } catch (e) {
        console.error("Local storage error:", e);
      }
      return null;
    }
  }, []);

  // Check auth against server session on mount
  const checkAuth = useCallback(async () => {
    // Only verify profile if user was previously saved locally (guest visitors skip unauthenticated 401s)
    const hasStoredUser = !!localStorage.getItem("bb_user") || !!localStorage.getItem("bb_user_id") || !!localStorage.getItem("bb_user_token");
    if (!hasStoredUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Attempt profile endpoint
      const res = await getUserProfile();
      if (res?.data?.success && res.data.data) {
        saveUserLocally(res.data.data);
        return;
      }
    } catch (err) {
      // If backend profile is unreachable or returns 401, retain local user session
      // to avoid breaking client-side course tracking and offline-capable learning.
      console.warn("Backend profile check unauthenticated or unreachable; retaining active local session:", err?.message);
    } finally {
      setLoading(false);
    }
  }, [saveUserLocally]);

  useEffect(() => {
    checkAuth();

    // Listen to storage events from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "bb_user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleSessionExpired = () => {
      saveUserLocally(null);
      toast.error("Your session has expired. Please log in again.", {
        id: "session-expired-notice",
        icon: "🔒",
      });
    };
    window.addEventListener("bb_session_expired", handleSessionExpired);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bb_session_expired", handleSessionExpired);
    };
  }, [checkAuth, saveUserLocally]);

  // Login handler
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      if (response?.data?.success) {
        const userData = response.data.data || {
          email: credentials.email,
          name: credentials.email.split("@")[0],
        };
        const normalized = saveUserLocally(userData);
        return { success: true, data: normalized };
      }
      return {
        success: false,
        message: response?.data?.message || "Login failed.",
      };
    } catch (err) {
      // Fallback: If backend is temporarily unreachable or testing demo
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Backend logout notification failed:", err?.message);
    } finally {
      saveUserLocally(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("bb_logged_out"));
      }
      toast.success("You have been logged out successfully.", { id: "logout-toast" });
    }
  };

  // Register handler
  const register = async (data) => {
    const response = await registerUser(data);
    if (response?.data?.success) {
      // Auto login or return user
      if (response.data.data) {
        saveUserLocally(response.data.data);
      }
      return { success: true, data: response.data };
    }
    return {
      success: false,
      message: response?.data?.message || "Registration failed.",
    };
  };

  // Update Profile handler (Enforces Name Immutability)
  const updateProfile = async (formData) => {
    try {
      const response = await updateUserProfile(formData);
      if (response?.data?.success && response.data.data) {
        const updated = saveUserLocally(response.data.data);
        return { success: true, data: updated };
      }
      // If update succeeded without full user body, keep registered name intact
      const sanitized = { ...formData };
      delete sanitized.name;
      delete sanitized.full_name;
      delete sanitized.first_name;
      delete sanitized.last_name;
      const merged = { ...user, ...sanitized };
      const updated = saveUserLocally(merged);
      return { success: true, data: updated };
    } catch (err) {
      const respData = err?.response?.data;
      if (respData?.error === "NAME_IMMUTABLE" || respData?.code === "NAME_CHANGE_NOT_PERMITTED" || respData?.message?.includes("registered name cannot be changed")) {
        return {
          success: false,
          error: "NAME_IMMUTABLE",
          message: respData?.message || "Your registered name cannot be changed through your profile. If your name needs correction, please contact Broadbeach Academy support.",
        };
      }
      // If endpoint is offline, still update allowed non-name fields safely
      console.warn("Backend updateProfile fallback to local state:", err?.message);
      const sanitized = { ...formData };
      delete sanitized.name;
      delete sanitized.full_name;
      delete sanitized.first_name;
      delete sanitized.last_name;
      const merged = { ...user, ...sanitized };
      const updated = saveUserLocally(merged);
      return { success: true, data: updated, isLocalFallback: true };
    }
  };

  // Explicit helper to set user (e.g. from demo login or AuthModal)
  const setAuthUser = (userData) => {
    return saveUserLocally(userData);
  };

  const value = {
    user,
    currentUser: user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    register,
    updateProfile,
    refreshUser: checkAuth,
    setAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
