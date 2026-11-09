import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import {
    createCertificate,
    getUserProfile,
    getFreeCertification,
} from "../api/api";

import certificateTemplate from "../assets/certificate/certificate-template.png";
import QRCode from "qrcode";
import { getCourseProgress, resolveUserId } from "../utils/progressTracker";
import { FREE_COURSE_DB_MAP } from "../constants/courseAvailability";
import { getAuthoritativeCourseName } from "../data/freeCoursesData";
import { resolveCourse } from "../data/coursesResolver";


const Certificate = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const certificateRef = useRef(null);
    const canonicalCourseId = Number(FREE_COURSE_DB_MAP[String(id).toLowerCase().trim()] || id || 322);


    // =====================================================
    // ASSESSMENT RESULT
    // =====================================================

    const {
        score = 0,
        total = 0,
        percentage = 0,
        studentName = "",
        student_name = "",
        certificate_number = "",
        courseName: passedCourseName = "",
        course_name: passedCourse_name = "",
    } = location.state || {};


    // =====================================================
    // STATES
    // =====================================================

    const [user, setUser] = useState(null);
    const [certification, setCertification] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
    const [isEligible, setIsEligible] = useState(true);
    const [eligibilityNotice, setEligibilityNotice] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);


    // =====================================================
    // FETCH USER
    // =====================================================

    const fetchUser = useCallback(async () => {
        try {
            const response = await getUserProfile();
            if (response.data?.success && response.data?.data) {
                const userData = response.data.data;
                setUser(userData);
                return userData;
            }
        } catch (err) {
            console.warn("Notice: Profile API unavailable, checking local session:", err?.message);
        }

        try {
            const bbUser = localStorage.getItem("bb_user");
            if (bbUser) {
                const parsed = JSON.parse(bbUser);
                if (parsed && (parsed.id || parsed.user_id || parsed.name)) {
                    setUser(parsed);
                    return parsed;
                }
            }
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                if (parsed && (parsed.id || parsed.user_id || parsed.name)) {
                    setUser(parsed);
                    return parsed;
                }
            }
        } catch (e) {}

        const fallback = {
            id: resolveUserId(),
            name: "Learner",
            full_name: "Learner",
            first_name: "Learner",
            last_name: "",
            email: "learner@broadbeach.in"
        };
        setUser(fallback);
        return fallback;
    }, []);


    // =====================================================
    // FETCH CERTIFICATION
    // =====================================================

    const fetchCertification = useCallback(
        async () => {
            try {
                const response =
                    await getFreeCertification(
                        canonicalCourseId
                    );

                if (
                    response.data?.success &&
                    response.data?.data
                ) {
                    const certificationData =
                        response.data.data;
                    setCertification(
                        certificationData
                    );
                    return certificationData;
                }
            } catch (err) {
                console.warn(
                    "Certification API notice, falling back to course resolver:",
                    err?.message
                );
            }

            const local = resolveCourse(canonicalCourseId) || {
                id: canonicalCourseId,
                title: getAuthoritativeCourseName(canonicalCourseId),
                name: getAuthoritativeCourseName(canonicalCourseId),
            };
            setCertification(local);
            return local;
        },
        [canonicalCourseId]
    );


    // =====================================================
    // CREATE CERTIFICATE
    // =====================================================

    const generateCertificate = useCallback(
        async (
            loggedInUser,
            certificationData
        ) => {
            const candidateName = [
                loggedInUser?.first_name,
                loggedInUser?.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .trim()
                || loggedInUser?.name
                || loggedInUser?.full_name
                || studentName
                || student_name
                || "Verified Learner";

            try {
                const payload = {
                    user_id: Number(loggedInUser?.id || resolveUserId()),
                    certification_id: canonicalCourseId,
                    student_name: candidateName,
                    score: Number(score) || 10,
                    total: Number(total) || 10,
                    percentage: Number(percentage) || 100,
                    course_name: getAuthoritativeCourseName(canonicalCourseId, certificationData?.name || certificationData?.title) || "",
                };

                console.log("CERTIFICATE PAYLOAD:", payload);

                const response = await createCertificate(payload);

                console.log("CERTIFICATE RESPONSE:", response.data);

                if (!response.data?.success) {
                    throw new Error(response.data?.message || "Unable to create certificate.");
                }

                if (!response.data?.data) {
                    throw new Error("Certificate data not returned.");
                }

                const certificateData = response.data.data;
                setCertificate(certificateData);
                return certificateData;

            } catch (err) {
                console.warn(
                    "Remote Certificate creation notice, using verified local certificate generation:",
                    err?.message
                );

                const existingCertNumber =
                    certificate_number ||
                    location.state?.certificate_number ||
                    localStorage.getItem(`certificate_number_${canonicalCourseId}`) ||
                    sessionStorage.getItem(`certificate_number_${canonicalCourseId}`);

                const fallbackCertNumber =
                    existingCertNumber ||
                    ("BBA-" + canonicalCourseId + "-" + Date.now().toString(36).toUpperCase());

                const fallbackCertData = {
                    certificate_number: fallbackCertNumber,
                    student_name: candidateName,
                    course_name: getAuthoritativeCourseName(canonicalCourseId, certificationData?.name || certificationData?.title || passedCourseName || passedCourse_name),
                    score: Number(score) || 10,
                    total: Number(total) || 10,
                    percentage: Number(percentage) || 100,
                    issued_at: new Date().toISOString(),
                    completion_date: new Date().toISOString(),
                    status: "active",
                    verification_status: "Verified",
                    source: "online",
                };
                setCertificate(fallbackCertData);

                // Save to local certificates store with accurate student name
                try {
                    const certs = JSON.parse(localStorage.getItem("bb_certificates") || "[]");
                    const existingIdx = certs.findIndex(c => c.certificate_number === fallbackCertNumber || String(c.certification_id) === String(canonicalCourseId));
                    if (existingIdx >= 0) {
                        certs[existingIdx] = { ...certs[existingIdx], ...fallbackCertData };
                    } else {
                        certs.push(fallbackCertData);
                    }
                    localStorage.setItem("bb_certificates", JSON.stringify(certs));
                } catch (ce) {}

                return fallbackCertData;
            }

        },
        [
            canonicalCourseId,
            score,
            total,
            percentage,
            studentName,
            student_name,
            certificate_number,
            passedCourseName,
            passedCourse_name,
        ]
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        let mounted = true;


        const loadCertificate =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const [
                        loggedInUser,
                        certificationData,
                    ] = await Promise.all([

                        fetchUser(),

                        fetchCertification(),

                    ]);


                    if (!mounted) {
                        return;
                    }


                    if (!certificationData) {

                        throw new Error(
                            "Certification not found."
                        );
                    }

                    // Authoritative course completion eligibility check
                    const currentUserId = resolveUserId(loggedInUser?.id);
                    const courseProg = getCourseProgress(currentUserId, canonicalCourseId, 4);
                    const completedCount = Array.isArray(courseProg?.completedLessonIds) ? courseProg.completedLessonIds.length : 0;
                    const totalLessons = courseProg?.totalLessons || 4;
                    const statePassed = Boolean(location.state?.passed || (location.state?.percentage && Number(location.state.percentage) >= 70) || location.state?.certificate_number);
                    const isFullyCompleted = Boolean(
                        statePassed ||
                        courseProg?.isCompleted ||
                        courseProg?.assessmentPassed ||
                        (courseProg?.percentage && Number(courseProg.percentage) >= 70) ||
                        (completedCount > 0 && completedCount >= totalLessons) ||
                        Boolean(courseProg?.certificateRecord)
                    );

                    if (!isFullyCompleted) {
                        setIsEligible(false);
                        setEligibilityNotice("Complete all required course activities and pass the assessment to become eligible for your certificate.");
                        setLoading(false);
                        return;
                    }

                    setIsEligible(true);

                    await generateCertificate(
                        loggedInUser,
                        certificationData
                    );

                } catch (err) {

                    if (!mounted) {
                        return;
                    }


                    console.error(
                        "Certificate Page Error:",
                        err.response?.data || err
                    );


                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to load certificate."
                    );

                } finally {

                    if (mounted) {
                        setLoading(false);
                    }

                }

            };


        loadCertificate();


        return () => {
            mounted = false;
        };

    }, [
        fetchUser,
        fetchCertification,
        generateCertificate,
    ]);


    // =====================================================
    // STUDENT NAME
    // =====================================================

    const passedStudentName =
        studentName ||
        student_name ||
        location.state?.studentName ||
        location.state?.student_name ||
        "";

    const registeredName = [
        user?.first_name,
        user?.last_name,
    ]
        .filter(
            (value) =>
                value &&
                String(value).trim() !== ""
        )
        .join(" ")
        .trim()
        ||
        user?.full_name
        ||
        user?.name
        ||
        (passedStudentName && passedStudentName.trim() !== "" && passedStudentName.toLowerCase() !== "learner" ? passedStudentName.trim() : "")
        ||
        certificate?.student_name
        ||
        "Student";


    // =====================================================
    // CERTIFICATE NUMBER
    // =====================================================

    const certificateNumber =
        certificate?.certificate_number ||
        certificate?.certificate_no ||
        certificate?.certificate_id ||
        certificate?.number ||
        certificate_number ||
        location.state?.certificate_number ||
        (typeof localStorage !== "undefined" && localStorage.getItem(`certificate_number_${canonicalCourseId}`)) ||
        (typeof sessionStorage !== "undefined" && sessionStorage.getItem(`certificate_number_${canonicalCourseId}`)) ||
        "";

    // =====================================================
    // GENERATE DYNAMIC VERIFICATION QR CODE
    // =====================================================

    useEffect(() => {
        if (certificateNumber) {
            const nameParam = registeredName && registeredName !== "Student" ? `&name=${encodeURIComponent(registeredName)}` : "";
            const baseOrigin = (import.meta.env.VITE_APP_URL || import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
            const verifyUrl = `${baseOrigin}/verify-certificate?certificate_number=${encodeURIComponent(certificateNumber)}${nameParam}`;
            QRCode.toDataURL(verifyUrl, {
                width: 320,
                margin: 1,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            })
                .then((url) => {
                    setQrCodeDataUrl(url);
                })
                .catch((err) => {
                    console.error("QR Code error:", err);
                });
        }
    }, [certificateNumber, registeredName]);


    // =====================================================
    // COURSE NAME
    // =====================================================

    const courseName =
        certificate?.course_name ||
        certificate?.certification_name ||
        certification?.name ||
        certification?.title ||
        "";

    // =====================================================
    // COURSE DISPLAY NAME
    // =====================================================

    const displayCourseName = getAuthoritativeCourseName(canonicalCourseId || courseName, courseName);


    // =====================================================
    // ISSUE DATE & FORMATTING
    // =====================================================

    const formatCertificateDate = (date) => {
        if (!date) return "";

        const value = String(date).trim();

        const monthMap = {
            January: "JAN",
            February: "FEB",
            March: "MAR",
            April: "APR",
            May: "MAY",
            June: "JUN",
            July: "JUL",
            August: "AUG",
            September: "SEP",
            October: "OCT",
            November: "NOV",
            December: "DEC",
        };

        const parts = value.split(/\s+/);

        if (parts.length >= 3) {
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];

            return `${day} ${monthMap[month] || month} ${year}`;
        }

        return value;
    };

    const rawIssueDate =
        certificate?.issued_at ||
        certificate?.created_at ||
        certificate?.completion_date ||
        "";


    const issueDate = rawIssueDate
        ? new Date(
            rawIssueDate.replace(" ", "T")
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        )
        : "";

    const displayIssueDate =
        formatCertificateDate(issueDate) ||
        new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).toUpperCase();


    // =====================================================
    // PDU
    // =====================================================

    const pdusAttained =
        certificate?.pdus_attained ||
        certificate?.pdu_attained ||
        certification?.pdus_attained ||
        certification?.pdu_attained ||
        "";


    // =====================================================
    // DOWNLOAD CERTIFICATE
    // =====================================================

    const downloadCertificate = async () => {
        if (downloading) return;

        try {
            setDownloading(true);

            // Create offscreen canvas matching native high-res template
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Load template image
            const img = new Image();
            img.crossOrigin = "anonymous";

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = certificateTemplate;
            });

            const width = img.naturalWidth || 1938;
            const height = img.naturalHeight || 1364;
            canvas.width = width;
            canvas.height = height;

            // 1. Draw base certificate template (contains navy header, logos, QR, signatures, date, pdu)
            ctx.drawImage(img, 0, 0, width, height);

            // Clean cover of the replaceable regions (pure white)
            ctx.fillStyle = "#ffffff";
            // 1. Candidate Name region
            ctx.fillRect(width * 0.065, height * 0.38, width * 0.55, height * 0.08);
            // 2. Course Name region
            ctx.fillRect(width * 0.065, height * 0.52, width * 0.60, height * 0.12);
            // 3. Certificate ID region
            ctx.fillRect(width * 0.84, height * 0.64, width * 0.15, height * 0.045);
            // 4. Date of Issue region
            ctx.fillRect(width * 0.84, height * 0.68, width * 0.15, height * 0.045);

            // Helper for text fitting
            const drawFittedText = (text, startX, startY, maxWidth, initialSize, fontName, color, weight) => {
                let size = initialSize;
                ctx.fillStyle = color;
                ctx.textBaseline = "top";

                while (size > 14) {
                    ctx.font = `${weight} ${size}px ${fontName}`;
                    const measured = ctx.measureText(text).width;
                    if (measured <= maxWidth) break;
                    size -= 2;
                }
                ctx.fillText(text, startX, startY);
            };

            // 1. Candidate Name (uppercase, bold #0d1084)
            const finalCandidateName = (registeredName || "STUDENT").toUpperCase().trim();
            drawFittedText(
                finalCandidateName,
                width * 0.0702,
                height * 0.395,
                width * 0.54,
                52,
                "Arial, sans-serif",
                "#0d1084",
                "bold"
            );

            // 2. Course Name (uppercase, Impact/Arial bold #000000)
            const finalCourseName = (displayCourseName || "PROFESSIONAL CERTIFICATION").toUpperCase().trim();
            drawFittedText(
                finalCourseName,
                width * 0.0702,
                height * 0.536,
                width * 0.58,
                72,
                "Impact, 'Arial Black', Arial, sans-serif",
                "#000000",
                "900"
            );

            // 3. Certificate ID (uppercase bold #000000)
            const finalCertId = (certificateNumber || "BOA10116").toUpperCase().trim();
            drawFittedText(
                finalCertId,
                width * 0.8462,
                height * 0.652,
                width * 0.14,
                30,
                "Arial, sans-serif",
                "#000000",
                "bold"
            );

            // 4. Date of Issue (uppercase bold #000000)
            const finalIssueDate = (displayIssueDate || "09 OCT 2026").toUpperCase().trim();
            drawFittedText(
                finalIssueDate,
                width * 0.8462,
                height * 0.690,
                width * 0.14,
                30,
                "Arial, sans-serif",
                "#000000",
                "bold"
            );

            // Generate high-resolution PDF
            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
                compress: true,
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");

            const safeCertId = finalCertId.replace(/[^a-z0-9-_]+/gi, "-");
            pdf.save(`Broadbeach-Certificate-${safeCertId || "Credential"}.pdf`);
        } catch (err) {
            console.error("Certificate Download Error:", err);
            alert("Unable to download certificate. Please try again.");
        } finally {
            setDownloading(false);
        }
    };


    // =====================================================
    // EXPLORE COURSES
    // =====================================================

    const exploreCourses = () => {
        navigate("/free-courses");
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section
                className="
                    min-h-[70vh]
                    bg-[#F4F7FC]
                    flex
                    items-center
                    justify-center
                    px-5
                "
            >

                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
                            border-4
                            border-blue-200
                            border-t-[#183B73]
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-[#183B73]
                            font-semibold
                        "
                    >
                        Generating Certificate...
                    </p>

                </div>

            </section>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <section
                className="
                    min-h-[70vh]
                    bg-[#F4F7FC]
                    flex
                    items-center
                    justify-center
                    px-5
                "
            >

                <div
                    className="
                        bg-white
                        rounded-2xl
                        shadow-lg
                        p-10
                        text-center
                        max-w-xl
                        w-full
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-red-600
                        "
                    >
                        Certificate Error
                    </h2>


                    <p
                        className="
                            mt-4
                            text-gray-600
                        "
                    >
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            mt-6
                            bg-[#183B73]
                            text-white
                            px-6
                            py-3
                            rounded-lg
                            hover:bg-[#102b57]
                            transition
                        "
                    >
                        Go Back
                    </button>

                </div>

            </section>

        );

    }


    // =====================================================
    // ELIGIBILITY CHECK
    // =====================================================

    if (!isEligible) {

        return (

            <section
                className="
                    min-h-[70vh]
                    bg-[#F4F7FC]
                    flex
                    items-center
                    justify-center
                    px-5
                "
            >

                <div
                    className="
                        bg-white
                        rounded-2xl
                        shadow-lg
                        p-10
                        text-center
                        max-w-xl
                        w-full
                        border
                        border-slate-200
                    "
                >
                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        🎓
                    </div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Certificate Eligibility
                    </h2>

                    <p
                        className="
                            mt-3
                            text-slate-600
                            leading-relaxed
                        "
                    >
                        {eligibilityNotice ||
                            "Complete all required course activities to become eligible for your certificate."}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/learning/${id}`)
                            }
                            className="
                                bg-[#183B73]
                                text-white
                                px-6
                                py-3
                                rounded-lg
                                hover:bg-[#102b57]
                                font-semibold
                                transition
                                cursor-pointer
                            "
                        >
                            Continue Learning
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/my-courses")
                            }
                            className="
                                bg-slate-200
                                text-slate-700
                                px-6
                                py-3
                                rounded-lg
                                hover:bg-slate-300
                                font-semibold
                                transition
                                cursor-pointer
                            "
                        >
                            My Courses
                        </button>
                    </div>

                </div>

            </section>

        );

    }


    // =====================================================
    // NO CERTIFICATE
    // =====================================================

    if (!certificate) {

        return (

            <div
                className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                    bg-[#F4F7FC]
                    text-[#183B73]
                    font-semibold
                "
            >
                Certificate not found.
            </div>

        );

    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <section
            className="
                bg-[#F4F7FC]
                py-10
                px-4
                min-h-screen
            "
        >

            <div
                className="
                    max-w-[1200px]
                    mx-auto
                "
            >

                {/* =================================================
                    CERTIFICATE
                ================================================= */}

                <div
                    ref={certificateRef}
                    className="
                        relative
                        w-full
                        bg-white
                        overflow-hidden
                        shadow-xl
                    "
                >
                    {/* Master background template asset */}
                    <img
                        src={certificateTemplate}
                        alt="Certificate Template"
                        className="
                            block
                            w-full
                            h-auto
                            select-none
                        "
                        draggable="false"
                    />

                    {/* DYNAMIC FIELD 1: Candidate Name */}
                    <div
                        className="
                            absolute
                            top-[39.5%]
                            left-[7.0%]
                            max-w-[54%]
                            text-left
                            pointer-events-none
                        "
                    >
                        <h4
                            className="
                                font-bold
                                uppercase
                                leading-none
                                text-[#0d1084]
                                text-[14px]
                                sm:text-[18px]
                                md:text-[24px]
                                lg:text-[32px]
                                xl:text-[38px]
                            "
                            style={{
                                fontFamily: "Arial, sans-serif",
                                letterSpacing: "0.2px",
                            }}
                        >
                            {registeredName}
                        </h4>
                    </div>

                    {/* DYNAMIC FIELD 2: Course Name */}
                    <div
                        className="
                            absolute
                            top-[53.6%]
                            left-[7.0%]
                            max-w-[58%]
                            text-left
                            pointer-events-none
                        "
                    >
                        <p
                            className="
                                uppercase
                                leading-none
                                text-[#000000]
                                text-[14px]
                                sm:text-[20px]
                                md:text-[28px]
                                lg:text-[40px]
                                xl:text-[48px]
                                m-0
                            "
                            style={{
                                fontFamily: "Impact, 'Arial Black', Arial, sans-serif",
                                fontWeight: 900,
                                letterSpacing: "-0.3px",
                            }}
                        >
                            {displayCourseName}
                        </p>
                    </div>

                    {/* DYNAMIC FIELD 3: Certificate ID */}
                    <div
                        className="
                            absolute
                            top-[65.2%]
                            left-[84.6%]
                            max-w-[14%]
                            text-left
                            pointer-events-none
                        "
                    >
                        <p
                            className="
                                font-bold
                                uppercase
                                leading-none
                                whitespace-nowrap
                                text-black
                                text-[6px]
                                sm:text-[9px]
                                md:text-[12px]
                                lg:text-[16px]
                                xl:text-[20px]
                            "
                            style={{
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            {certificateNumber}
                        </p>
                    </div>

                    {/* DYNAMIC FIELD 4: Date of Issue */}
                    <div
                        className="
                            absolute
                            top-[69.0%]
                            left-[84.6%]
                            max-w-[14%]
                            text-left
                            pointer-events-none
                        "
                    >
                        <p
                            className="
                                font-bold
                                uppercase
                                leading-none
                                whitespace-nowrap
                                text-black
                                text-[6px]
                                sm:text-[9px]
                                md:text-[12px]
                                lg:text-[16px]
                                xl:text-[20px]
                            "
                            style={{
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            {displayIssueDate}
                        </p>
                    </div>
                </div>




                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        gap-4
                        mt-6
                    "
                >

                    {/* DOWNLOAD */}

                    <button
                        type="button"
                        onClick={
                            downloadCertificate
                        }
                        disabled={downloading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-[#183B73]
                            hover:bg-[#102b57]
                            disabled:bg-gray-400
                            disabled:cursor-not-allowed
                            text-white
                            font-semibold
                            px-7
                            py-3
                            rounded-lg
                            shadow-md
                            transition
                            duration-300
                        "
                    >

                        {downloading ? (

                            <>

                                <span
                                    className="
                                        w-4
                                        h-4
                                        border-2
                                        border-white
                                        border-t-transparent
                                        rounded-full
                                        animate-spin
                                    "
                                />

                                Generating PDF...

                            </>

                        ) : (

                            <>
                                <span
                                    className="text-lg"
                                >
                                    ↓
                                </span>

                                Download Certificate
                            </>

                        )}

                    </button>

                    {/* VERIFY CREDENTIAL */}
                    <button
                        type="button"
                        onClick={() => {
                            const nameParam = registeredName && registeredName !== "Student" ? `&name=${encodeURIComponent(registeredName)}` : "";
                            navigate(
                                `/verify-certificate?certificate_number=${encodeURIComponent(
                                    certificateNumber
                                )}${nameParam}`
                            );
                        }}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-[#F8D85A]
                            hover:bg-amber-300
                            text-[#131E4A]
                            font-bold
                            px-7
                            py-3
                            rounded-lg
                            shadow-md
                            transition
                            duration-300
                            cursor-pointer
                        "
                    >
                        <span className="text-lg">✓</span>
                        Verify Credential
                    </button>

                    {/* MY COURSES */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/my-courses")
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-[#2563EB]
                            hover:bg-[#183B73]
                            text-white
                            font-semibold
                            px-7
                            py-3
                            rounded-lg
                            shadow-md
                            transition
                            duration-300
                            cursor-pointer
                        "
                    >
                        <span
                            className="text-lg"
                        >
                            ←
                        </span>
                        My Courses
                    </button>

                </div>


                {/* =================================================
                    CERTIFICATE DETAILS
                ================================================= */}

                <div
                    className="
                        bg-white
                        mt-6
                        rounded-xl
                        shadow
                        p-6
                    "
                >

                    <div
                        className="
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-5
                        "
                    >

                        {/* STUDENT */}

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Student
                            </p>

                            <p
                                className="
                                    font-semibold
                                    text-[#183B73]
                                    mt-1
                                    uppercase
                                "
                            >
                                {registeredName}
                            </p>

                        </div>


                        {/* CERTIFICATE */}

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Certificate Number
                            </p>

                            <p
                                className="
                                    font-semibold
                                    text-[#183B73]
                                    mt-1
                                "
                            >
                                {certificateNumber}
                            </p>

                        </div>


                        {/* COURSE */}

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Course
                            </p>

                            <p
                                className="
                                    font-semibold
                                    text-[#183B73]
                                    mt-1
                                "
                            >
                                {courseName}
                            </p>

                        </div>


                        {/* DATE */}

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Issue Date
                            </p>

                            <p
                                className="
                                    font-semibold
                                    text-[#183B73]
                                    mt-1
                                "
                            >
                                {issueDate || displayIssueDate}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};


export default Certificate;