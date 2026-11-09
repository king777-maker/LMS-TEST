import {
    useState
} from "react";

import toast from "react-hot-toast";
import {
    inputClass,
    registerLabelClass,
} from "./formStyles";
import {
    registerUser
} from "../../api/api";

import FormField from "./FormField";
import CaptchaField from "./CaptchaField";




const RegisterForm = () => {


    // =========================================
    // CAPTCHA
    // =========================================

    const generateCaptcha = () => {

        return Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();

    };


    // =========================================
    // INITIAL DATA
    // =========================================

    const initialData = {

        first_name: "",
        last_name: "",
        date_of_birth: "",

        email: "",

        country_code: "+91",
        phone: "",

        address: "",

        city: "",
        zip_code: "",

        state: "",
        country: "",

        total_experience: "",

        highest_qualification: "",

        designation: "",

        nationality: "",

        current_organization: "",

        password: "",
        confirm_password: "",

        captcha: "",

    };


    // =========================================
    // STATE
    // =========================================

    const [registerData, setRegisterData] =
        useState(initialData);


    const [registerCaptcha, setRegisterCaptcha] =
        useState(generateCaptcha());


    const [registerLoading, setRegisterLoading] =
        useState(false);

    const [termsAccepted, setTermsAccepted] =
        useState(false);


    // =========================================
    // CHANGE
    // =========================================

    const handleRegisterChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setRegisterData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };


    // =========================================
    // REFRESH CAPTCHA
    // =========================================

    const refreshCaptcha = () => {

        setRegisterCaptcha(
            generateCaptcha()
        );


        setRegisterData((prev) => ({

            ...prev,

            captcha: "",

        }));

    };


    // =========================================
    // REGISTER
    // =========================================

    const handleRegister = async (e) => {

        e.preventDefault();

        // Affirmative Age & Terms Consent (DPDP Act 2023 Sec 9 & CPA 2019)
        if (!termsAccepted) {
            toast.error(
                "Please confirm that you are at least 18 years of age and agree to the Terms & Conditions and Privacy Policy."
            );
            return;
        }

        // =========================================
        // CAPTCHA
        // =========================================

        if (!registerData.captcha.trim()) {

            toast.error(
                "Please enter CAPTCHA."
            );

            return;

        }


        if (
            registerData.captcha
                .trim()
                .toUpperCase()
            !==
            registerCaptcha
                .trim()
                .toUpperCase()
        ) {

            toast.error(
                "Invalid CAPTCHA."
            );

            refreshCaptcha();

            return;

        }


        // =========================================
        // PASSWORD
        // =========================================

        if (
            registerData.password !==
            registerData.confirm_password
        ) {

            toast.error(
                "Password and Confirm Password do not match."
            );

            return;

        }


        // =========================================
        // DATA
        // =========================================

        const formData = {

            first_name:
                registerData.first_name.trim(),

            last_name:
                registerData.last_name.trim(),

            date_of_birth:
                registerData.date_of_birth,

            email:
                registerData.email.trim(),

            country_code:
                registerData.country_code,

            phone:
                registerData.phone.trim(),

            address:
                registerData.address.trim(),

            city:
                registerData.city.trim(),

            zip_code:
                registerData.zip_code.trim(),

            state:
                registerData.state.trim(),

            country:
                registerData.country.trim(),

            total_experience:
                registerData.total_experience,

            highest_qualification:
                registerData.highest_qualification.trim(),

            designation:
                registerData.designation.trim(),

            nationality:
                registerData.nationality.trim(),

            current_organization:
                registerData.current_organization.trim(),

            password:
                registerData.password,

            confirm_password:
                registerData.confirm_password,

        };


        try {

            setRegisterLoading(true);


            const response =
                await registerUser(formData);


            console.log(
                "REGISTER RESPONSE:",
                response.data
            );


            if (!response.data.success) {

                toast.error(
                    response.data.message ||
                    "Registration failed."
                );

                return;

            }


            toast.success(
                response.data.message ||
                "Registration successful!"
            );


            // =========================================
            // RESET
            // =========================================

            setRegisterData(
                initialData
            );


            refreshCaptcha();


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to register user."
            );


            refreshCaptcha();


        } finally {

            setRegisterLoading(false);

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div
            className="
                w-full
                lg:w-[58%]

                bg-white

                px-5
                sm:px-8
                md:px-10
                lg:px-10
                xl:px-14

                py-8
                sm:py-10
                lg:py-12

                lg:overflow-y-auto
            "
        >

            {/* TITLE */}

            <h2
                className="
                    !text-[25px]
                    sm:!text-[28px]
                    md:!text-[30px]
                    xl:!text-[34px]

                    font-bold

                    text-[#111827]

                    mb-7
                    sm:mb-8

                    pr-10
                    lg:pr-0
                "
            >
                First Time Here? Register
            </h2>


            {/* =========================================
                FORM
            ========================================= */}

            <form
                onSubmit={handleRegister}
                className="pb-4"
            >

                <div
                    className="
                        grid

                        grid-cols-1
                        md:grid-cols-2

                        gap-x-4
                        lg:gap-x-5

                        gap-y-4
                        sm:gap-y-5
                    "
                >

                    {/* FIRST NAME */}

                    <FormField
                        label="First Name"
                        name="first_name"
                        value={registerData.first_name}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                        required
                    />


                    {/* LAST NAME */}

                    <FormField
                        label="Last Name"
                        name="last_name"
                        value={registerData.last_name}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* DOB */}

                    <FormField
                        label="Date Of Birth"
                        type="date"
                        name="date_of_birth"
                        value={registerData.date_of_birth}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* EMAIL */}

                    <FormField
                        label="Email ID"
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                        autoComplete="email"
                        required
                    />


                    {/* COUNTRY CODE */}

                    <div>

                        <label
                            htmlFor="country_code"
                            className={registerLabelClass}
                        >
                            Country Code
                        </label>


                        <select
                            id="country_code"
                            name="country_code"
                            value={registerData.country_code}
                            onChange={handleRegisterChange}
                            className={inputClass}
                        >

                            <option value="+91">
                                +91 India
                            </option>

                            <option value="+1">
                                +1 USA
                            </option>

                            <option value="+44">
                                +44 UK
                            </option>

                            <option value="+971">
                                +971 UAE
                            </option>

                            <option value="+966">
                                +966 KSA
                            </option>

                        </select>

                    </div>


                    {/* PHONE */}

                    <FormField
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* ADDRESS */}

                    <div className="md:col-span-2">

                        <label
                            htmlFor="address"
                            className={registerLabelClass}
                        >
                            Address
                        </label>


                        <textarea
                            id="address"
                            name="address"
                            value={registerData.address}
                            onChange={handleRegisterChange}
                            rows="3"

                            className="
                                w-full

                                min-h-[90px]

                                px-4
                                py-3

                                bg-white
                                text-black

                                border
                                border-gray-300

                                rounded-xl

                                outline-none

                                resize-y

                                text-[14px]
                                sm:text-[15px]

                                focus:border-[#2168D8]
                                focus:ring-2
                                focus:ring-blue-100

                                transition
                            "
                        />

                    </div>


                    {/* CITY */}

                    <FormField
                        label="City"
                        name="city"
                        value={registerData.city}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* ZIP */}

                    <FormField
                        label="Zip Code"
                        name="zip_code"
                        value={registerData.zip_code}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* STATE */}

                    <FormField
                        label="State"
                        name="state"
                        value={registerData.state}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* COUNTRY */}

                    <FormField
                        label="Country"
                        name="country"
                        value={registerData.country}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* EXPERIENCE */}

                    <FormField
                        label="Total Years Experience"
                        type="number"
                        name="total_experience"
                        value={registerData.total_experience}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                        min="0"
                        step="0.1"
                    />


                    {/* QUALIFICATION */}

                    <FormField
                        label="Highest Qualification"
                        name="highest_qualification"
                        value={registerData.highest_qualification}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* DESIGNATION */}

                    <FormField
                        label="Your Designation"
                        name="designation"
                        value={registerData.designation}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* NATIONALITY */}

                    <FormField
                        label="Nationality"
                        name="nationality"
                        value={registerData.nationality}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                    />


                    {/* ORGANIZATION */}

                    <FormField
                        label="Current Organization"
                        name="current_organization"
                        value={registerData.current_organization}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                        wrapperClassName="md:col-span-2"
                    />


                    {/* PASSWORD */}

                    <FormField
                        label="Password"
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                        autoComplete="new-password"
                        minLength="8"
                        required
                    />


                    {/* CONFIRM PASSWORD */}

                    <FormField
                        label="Confirm Password"
                        type="password"
                        name="confirm_password"
                        value={registerData.confirm_password}
                        onChange={handleRegisterChange}
                        className={inputClass}
                        labelClassName={registerLabelClass}
                        autoComplete="new-password"
                        minLength="8"
                        required
                    />


                    {/* CAPTCHA */}

                    <div className="md:col-span-2">

                        <CaptchaField
                            captcha={registerCaptcha}
                            value={registerData.captcha}
                            onChange={handleRegisterChange}
                            onRefresh={refreshCaptcha}
                            label="Captcha"
                        />

                    </div>

                    {/* CONSENT & AGE DECLARATION (DPDP Act 2023 & Consumer Protection) */}
                    <div className="md:col-span-2 pt-3 border-t border-gray-100">
                        <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-700 leading-relaxed select-none">
                            <input
                                type="checkbox"
                                id="register-terms-consent"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2168D8] focus:ring-[#2168D8] cursor-pointer"
                                required
                            />
                            <span>
                                I confirm that I am at least 18 years of age (or registering under parental/guardian supervision), and I agree to Broadbeach Academy's{" "}
                                <a
                                    href="/terms-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2168D8] font-semibold underline hover:text-[#131E4A]"
                                >
                                    Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2168D8] font-semibold underline hover:text-[#131E4A]"
                                >
                                    Privacy Policy
                                </a>
                                .
                            </span>
                        </label>
                        <p className="mt-2 text-xs text-gray-500 leading-normal pl-7">
                            Personal data collected is processed strictly for enrollment, learning progression, and verifiable certificate issuance in accordance with the Digital Personal Data Protection Act, 2023. We do not sell your personal data or engage in behavioral advertising targeting students.
                        </p>
                    </div>

                </div>


                {/* =========================================
                    REGISTER BUTTON
                ========================================= */}

                <div
                    className="
                        flex
                        justify-center
                        sm:justify-end

                        mt-6
                        sm:mt-7
                    "
                >

                    <button
                        type="submit"
                        disabled={registerLoading}

                        className="
                            w-full
                            sm:w-[190px]

                            h-[52px]
                            sm:h-[54px]

                            bg-[#2168D8]
                            text-white

                            rounded-lg

                            font-bold

                            text-[14px]
                            sm:text-[15px]

                            hover:bg-[#FFDB58]
                            hover:text-[#131E4A]

                            disabled:opacity-60
                            disabled:cursor-not-allowed

                            transition-all
                            duration-300

                            cursor-pointer
                        "
                    >

                        {
                            registerLoading
                                ? "Registering..."
                                : "Register"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

};


export default RegisterForm;