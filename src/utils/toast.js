import toast from "react-hot-toast";

// Set to keep track of active toast keys to prevent duplicate bursts
const activeToastKeys = new Set();
const TOAST_DEDUPE_MS = 2500;

const triggerDedupe = (key) => {
    if (!key) return true;
    if (activeToastKeys.has(key)) {
        return false;
    }
    activeToastKeys.add(key);
    setTimeout(() => {
        activeToastKeys.delete(key);
    }, TOAST_DEDUPE_MS);
    return true;
};

export const showToast = {
    success: (message, options = {}) => {
        const key = `success:${message}`;
        if (!triggerDedupe(key)) return;

        return toast.success(message, {
            duration: 4000,
            ariaProps: {
                role: "status",
                "aria-live": "polite",
            },
            style: {
                background: "#131E4A",
                color: "#FFFFFF",
                border: "1px solid rgba(247, 198, 0, 0.4)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 18px",
                borderRadius: "10px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            },
            iconTheme: {
                primary: "#F7C600",
                secondary: "#131E4A",
            },
            ...options,
        });
    },

    error: (message, options = {}) => {
        const key = `error:${message}`;
        if (!triggerDedupe(key)) return;

        // Ensure sensitive internal errors or raw exceptions are masked safely
        const safeMessage = typeof message === "string" && message.length > 0 && !message.includes("SQLSTATE") && !message.includes("Stack trace")
            ? message
            : "An unexpected error occurred. Please try again or contact support.";

        return toast.error(safeMessage, {
            duration: 5000,
            ariaProps: {
                role: "alert",
                "aria-live": "assertive",
            },
            style: {
                background: "#841A1A",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 100, 100, 0.4)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 18px",
                borderRadius: "10px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            },
            iconTheme: {
                primary: "#FFFFFF",
                secondary: "#841A1A",
            },
            ...options,
        });
    },

    info: (message, options = {}) => {
        const key = `info:${message}`;
        if (!triggerDedupe(key)) return;

        return toast(message, {
            duration: 4000,
            ariaProps: {
                role: "status",
                "aria-live": "polite",
            },
            style: {
                background: "#183B73",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 18px",
                borderRadius: "10px",
            },
            icon: "ℹ️",
            ...options,
        });
    },

    warning: (message, options = {}) => {
        const key = `warning:${message}`;
        if (!triggerDedupe(key)) return;

        return toast(message, {
            duration: 4500,
            ariaProps: {
                role: "alert",
                "aria-live": "polite",
            },
            style: {
                background: "#78350F",
                color: "#FEF3C7",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 18px",
                borderRadius: "10px",
            },
            icon: "⚠️",
            ...options,
        });
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },
};

export default showToast;
