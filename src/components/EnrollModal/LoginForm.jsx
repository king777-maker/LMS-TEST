import { useState } from "react";
import { RefreshCw, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser, testSession } from "../../api/api";

// =====================================================
// REUSABLE CLASSES
// =====================================================

const inputClass = `
    w-full h-[60px]
    bg-white text-black
    rounded-xl px-4
    border border-gray-200
    outline-none
    focus:ring-2 focus:ring-[#FFDB58]
`;

const labelClass = "block text-[16px] font-medium mb-3";

// =====================================================
// CAPTCHA
// =====================================================

const generateCaptcha = () =>
    Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

// =====================================================
// LOGIN FORM
// =====================================================

const LoginForm = ({ onClose }) => {

    // -------------------------------------------------
    // STATE
    // -------------------------------------------------

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        captcha: "",
    });

    const [loginCaptcha, setLoginCaptcha] = useState(
        generateCaptcha()
    );

    const [loginLoading, setLoginLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    // -------------------------------------------------
    // HANDLE INPUT
    // -------------------------------------------------

    const handleLoginChange = (e) => {
        const { name, value } = e.target;

        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // -------------------------------------------------
    // REFRESH CAPTCHA
    // -------------------------------------------------

    const refreshCaptcha = () => {
        setLoginCaptcha(generateCaptcha());

        setLoginData((prev) => ({
            ...prev,
            captcha: "",
        }));
    };

    // -------------------------------------------------
    // VALIDATE LOGIN
    // -------------------------------------------------

    const validateLogin = () => {

        if (!loginData.email.trim()) {
            toast.error("Email address is required.");
            return false;
        }

        if (!loginData.password.trim()) {
            toast.error("Password is required.");
            return false;
        }

        if (!loginData.captcha.trim()) {
            toast.error("Please enter CAPTCHA.");
            return false;
        }

        if (
            loginData.captcha.trim().toUpperCase() !==
            loginCaptcha.trim().toUpperCase()
        ) {
            toast.error("Invalid CAPTCHA.");
            refreshCaptcha();
            return false;
        }

        return true;
    };

    // -------------------------------------------------
    // LOGIN
    // -------------------------------------------------

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateLogin()) return;

        const formData = {
            email: loginData.email.trim(),
            password: loginData.password,
        };

        try {

            setLoginLoading(true);

            const response = await loginUser(formData);

            console.log("LOGIN RESPONSE:", response.data);

            // -----------------------------------------
            // LOGIN FAILED
            // -----------------------------------------

            if (!response.data?.success) {
                toast.error(
                    response.data?.message || "Login failed."
                );
                return;
            }

            // -----------------------------------------
            // TEST PHP SESSION
            // -----------------------------------------

            try {

                const sessionResponse = await testSession();

                console.log(
                    "PHP SESSION AFTER LOGIN:",
                    sessionResponse.data
                );

            } catch (sessionError) {

                console.error(
                    "PHP SESSION TEST ERROR:",
                    sessionError?.response?.data ||
                    sessionError
                );

            }

            // -----------------------------------------
            // GET USER
            // -----------------------------------------

            const user = response.data?.data;

            if (!user) {

                console.error(
                    "User data missing:",
                    response.data
                );

                toast.error(
                    "Unable to get logged in user."
                );

                return;
            }

            // -----------------------------------------
            // SAVE USER
            // -----------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // -----------------------------------------
            // NOTIFY HEADER
            // -----------------------------------------

            window.dispatchEvent(
                new CustomEvent("userLogin", {
                    detail: user,
                })
            );

            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            toast.success(
                response.data?.message ||
                "Login successful."
            );

            // -----------------------------------------
            // RESET
            // -----------------------------------------

            setLoginData({
                email: "",
                password: "",
                captcha: "",
            });

            setShowPassword(false);

            refreshCaptcha();

            // -----------------------------------------
            // CLOSE MODAL
            // -----------------------------------------

            onClose();

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Invalid email or password."
            );

            refreshCaptcha();

        } finally {

            setLoginLoading(false);

        }
    };

    // =================================================
    // UI
    // =================================================

    return (

        <div
            className="
                w-full lg:w-[42%]
                bg-gradient-to-b
                from-[#1953A6]
                to-[#2168C7]
                text-white
                px-6 sm:px-10 lg:px-12
                py-10 lg:py-12
                shrink-0
                overflow-y-auto
            "
        >

            {/* =========================================
                TITLE
            ========================================= */}

            <h2
                className="
                    !text-[27px]
                    md:!text-[32px]
                    xl:!text-[38px]
                    font-bold
                    text-white
                    mb-9
                "
            >
                Already User Login
            </h2>

            {/* =========================================
                FORM
            ========================================= */}

            <form
                onSubmit={handleLogin}
                className="space-y-7"
            >

                {/* =====================================
                    EMAIL
                ===================================== */}

                <div>

                    <label className={labelClass}>
                        Email Address
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Enter your email"
                        autoComplete="email"
                        className={inputClass}
                    />

                </div>

                {/* =====================================
                    PASSWORD
                ===================================== */}

                <div>

                    <label className={labelClass}>
                        Password
                    </label>

                    <div className="relative">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className={`${inputClass} pr-14`}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                flex
                                items-center
                                justify-center
                                w-8 h-8
                                text-gray-600
                                hover:text-[#1953A6]
                                transition-colors
                                duration-200
                            "
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >

                            {showPassword ? (
                                <EyeOff size={22} />
                            ) : (
                                <Eye size={22} />
                            )}

                        </button>

                    </div>

                </div>

                {/* =====================================
                    SECURITY CODE
                ===================================== */}

                <div>

                    <label className={labelClass}>
                        Security Code
                    </label>

                    <div className="flex items-center gap-3">

                        {/* CAPTCHA */}

                        <div
                            className="
                                h-[52px]
                                px-5
                                bg-white
                                text-[#131E4A]
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-[20px]
                                tracking-[5px]
                                select-none
                            "
                        >
                            {loginCaptcha}
                        </div>

                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={refreshCaptcha}
                            className="
                                w-[52px] h-[52px]
                                bg-white
                                text-black
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                hover:bg-[#FFDB58]
                                transition
                            "
                            aria-label="Refresh CAPTCHA"
                        >
                            <RefreshCw size={19} />
                        </button>

                    </div>

                </div>

                {/* =====================================
                    CAPTCHA INPUT
                ===================================== */}

                <input
                    type="text"
                    name="captcha"
                    value={loginData.captcha}
                    onChange={handleLoginChange}
                    placeholder="Enter CAPTCHA"
                    autoComplete="off"
                    className={inputClass}
                />

                {/* =====================================
                    LOGIN BUTTON
                ===================================== */}

                <button
                    type="submit"
                    disabled={loginLoading}
                    className="
                        w-full
                        h-[60px]
                        bg-white
                        text-black
                        rounded-xl
                        font-bold
                        text-[17px]
                        hover:bg-[#FFDB58]
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        transition
                    "
                >
                    {loginLoading
                        ? "Logging in..."
                        : "Login"}
                </button>

                <p className="text-center text-xs text-white/70 mt-4 leading-relaxed">
                    By signing in, you confirm your adherence to our{" "}
                    <a
                        href="/terms-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[#FFDB58] transition-colors"
                    >
                        Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[#FFDB58] transition-colors"
                    >
                        Privacy Policy
                    </a>.
                </p>

            </form>

        </div>
    );
};

export default LoginForm;