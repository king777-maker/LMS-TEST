import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FaChevronDown,
    FaBookOpen,
    FaUser,
    FaSignOutAlt,
} from "react-icons/fa";

import {
    Link,
    useNavigate,
} from "react-router-dom";


// =====================================================
// API URL
// =====================================================

const API_URL = (
    import.meta.env.VITE_API_URL ||
    "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api"
    // "http://localhost/broadbeach-backend/api"
).replace(/\/+$/, "");


const UserDropdown = ({
    loggedInUser,
    onLogout,
    logoutLoading: parentLogoutLoading = false,
}) => {

    const navigate = useNavigate();

    const [isOpen, setIsOpen] =
        useState(false);

    const [logoutLoading, setLogoutLoading] =
        useState(false);

    const dropdownRef =
        useRef(null);


    // =====================================================
    // USER EMAIL
    // =====================================================

    const email =
        loggedInUser?.email || "";


    // =====================================================
    // FIRST LETTER
    // =====================================================

    const firstLetter =
        email
            ?.charAt(0)
            .toUpperCase() || "U";


    // =====================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =====================================================

    useEffect(() => {

        const handleOutsideClick = (
            event
        ) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setIsOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // =====================================================
    // CLEAR CLIENT STORAGE
    // =====================================================

    const clearClientData = () => {

        // -----------------------------------------------
        // Local Storage
        // -----------------------------------------------

        try {

            localStorage.clear();

        } catch (error) {

            console.warn(
                "Unable to clear localStorage:",
                error
            );

        }


        // -----------------------------------------------
        // Session Storage
        // -----------------------------------------------

        try {

            sessionStorage.clear();

        } catch (error) {

            console.warn(
                "Unable to clear sessionStorage:",
                error
            );

        }


        // -----------------------------------------------
        // Remove accessible cookies
        // -----------------------------------------------

        try {

            const cookies =
                document.cookie.split(";");


            cookies.forEach(
                (cookie) => {

                    const cookieName =
                        cookie
                            .split("=")[0]
                            .trim();

                    if (!cookieName) {
                        return;
                    }


                    // Current path
                    document.cookie =
                        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;


                    // Root domain/path
                    document.cookie =
                        `${cookieName}=; Max-Age=0; path=/`;


                    // Common localhost path
                    document.cookie =
                        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/broadbeachlearning.com/`;

                }
            );

        } catch (error) {

            console.warn(
                "Unable to clear cookies:",
                error
            );

        }

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = async () => {

        // Prevent double click
        if (
            logoutLoading ||
            parentLogoutLoading
        ) {
            return;
        }

        setLogoutLoading(true);
        setIsOpen(false);

        try {

            console.log("Starting logout...");

            // =================================================
            // 1. CALL BACKEND LOGOUT
            // =================================================

            try {

                const response = await fetch(
                    `${API_URL}/logout`,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                let data = null;

                try {
                    data = await response.json();
                } catch {
                    data = null;
                }

                console.log(
                    "LOGOUT API RESPONSE:",
                    data
                );

                if (!response.ok) {

                    console.warn(
                        "Logout API returned:",
                        response.status
                    );

                }

            } catch (apiError) {

                // Backend logout failure should not
                // prevent frontend logout.

                console.warn(
                    "Logout API request failed:",
                    apiError
                );
            }

            // =================================================
            // 2. CALL PARENT LOGOUT IF PROVIDED
            // =================================================

            if (
                typeof onLogout === "function"
            ) {

                try {

                    await onLogout();

                } catch (parentError) {

                    console.warn(
                        "Parent logout handler failed:",
                        parentError
                    );
                }
            }

            // =================================================
            // 3. CLEAR FRONTEND AUTH DATA
            // =================================================

            clearClientData();

            // =================================================
            // 4. REDIRECT TO WEBSITE HOME
            // =================================================

            // IMPORTANT:
            // Production:
            // https://cadac.in/broadbeachlearning.com
            //
            // Local:
            // http://localhost:5173/broadbeachlearning.com

            const basePath =
                "/broadbeachlearning.com/";

            window.location.replace(basePath);

        } catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

            // Even if something fails,
            // clear client-side authentication.

            clearClientData();

            // Always return to application root.
            window.location.replace(
                "/broadbeachlearning.com/"
            );

        } finally {

            setLogoutLoading(false);

        }
    };

    // =====================================================
    // FINAL LOGOUT LOADING STATE
    // =====================================================

    const isLoggingOut =
        logoutLoading ||
        parentLogoutLoading;


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            ref={dropdownRef}
            className="
                relative
            "
        >

            {/* =================================================
                USER BUTTON
            ================================================= */}

            <button
                type="button"

                onClick={() =>
                    setIsOpen(
                        (current) =>
                            !current
                    )
                }

                disabled={isLoggingOut}

                className="
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                    group
                    disabled:opacity-70
                "
            >

                {/* =============================================
                    USER LETTER
                ============================================== */}

                <div
                    className="
                        w-[40px]
                        h-[40px]
                        rounded-full
                        bg-[#F8D85A]
                        text-[#102F53]
                        flex
                        items-center
                        justify-center
                        text-[16px]
                        font-bold
                        uppercase
                        shadow-sm
                        group-hover:bg-[#e8c645]
                        transition-all
                        duration-200
                    "
                >

                    {firstLetter}

                </div>


                {/* =============================================
                    ARROW
                ============================================== */}

                <FaChevronDown
                    className={`
                        text-[#F8D85A]
                        text-[11px]
                        transition-transform
                        duration-200

                        ${isOpen
                            ? "rotate-180"
                            : ""
                        }
                    `}
                />

            </button>


            {/* =================================================
                DROPDOWN
            ================================================= */}

            {isOpen && (

                <div
                    className="
                        absolute
                        top-[52px]
                        right-0
                        w-[250px]
                        bg-white
                        rounded-xl
                        shadow-[0_12px_32px_rgba(0,0,0,0.18)]
                        border
                        border-gray-100
                        overflow-hidden
                        z-[100]
                    "
                >

                    {/* =========================================
                        USER INFORMATION
                    ========================================== */}

                    <div
                        className="
                            px-4
                            py-3.5
                            bg-slate-50
                            border-b
                            border-gray-100
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            {/* =================================
                                LETTER
                            ================================== */}

                            <div
                                className="
                                    w-[38px]
                                    h-[38px]
                                    rounded-full
                                    bg-[#102F53]
                                    text-[#F8D85A]
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                    text-[15px]
                                    flex-shrink-0
                                "
                            >

                                {firstLetter}

                            </div>


                            {/* =================================
                                EMAIL
                            ================================== */}

                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        !text-[11px]
                                        text-gray-500
                                        mb-1
                                    "
                                >
                                    Signed in as
                                </p>


                                <p
                                    className="
                                        !text-[13px]
                                        font-semibold
                                        text-[#131E4A]
                                        truncate
                                    "
                                    title={email}
                                >

                                    {email}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MENU
                    ================================================= */}

                    <div
                        className="
                            py-2
                        "
                    >

                        {/* =============================================
                            MY COURSES
                        ============================================== */}

                        <Link
                            to="/my-courses"

                            onClick={() =>
                                setIsOpen(false)
                            }

                            className="
                                flex
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-[#374151]
                                hover:bg-[#F6F9FF]
                                hover:text-[#2168D8]
                                transition-all
                                duration-200
                            "
                        >

                            <FaBookOpen
                                className="
                                    text-[16px]
                                "
                            />

                            <span
                                className="
                                    text-[14px]
                                    font-medium
                                "
                            >
                                My Courses
                            </span>

                        </Link>


                        {/* =============================================
                            MY PROFILE
                        ============================================== */}

                        <Link
                            to="/my-profile"

                            onClick={() =>
                                setIsOpen(false)
                            }

                            className="
                                flex
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-[#374151]
                                hover:bg-[#F6F9FF]
                                hover:text-[#2168D8]
                                transition-all
                                duration-200
                            "
                        >

                            <FaUser
                                className="
                                    text-[15px]
                                "
                            />

                            <span
                                className="
                                    text-[14px]
                                    font-medium
                                "
                            >
                                My Profile
                            </span>

                        </Link>

                    </div>


                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <div
                        className="
                            border-t
                            border-gray-100
                            p-2
                        "
                    >

                        <button
                            type="button"

                            onClick={
                                handleLogout
                            }

                            disabled={
                                isLoggingOut
                            }

                            className="
                                w-full
                                flex
                                items-center
                                gap-3
                                px-3
                                py-3
                                rounded-lg
                                text-red-500
                                hover:bg-red-50
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition-all
                                duration-200
                                cursor-pointer
                            "
                        >

                            <FaSignOutAlt
                                className="
                                    text-[16px]
                                "
                            />


                            <span
                                className="
                                    text-[14px]
                                    font-medium
                                "
                            >

                                {isLoggingOut
                                    ? "Logging out..."
                                    : "Logout"
                                }

                            </span>

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};


export default UserDropdown;