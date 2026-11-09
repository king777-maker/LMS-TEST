import {
    X
} from "lucide-react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";




const EnrollModal = ({
    isOpen,
    onClose,
}) => {


    // =========================================
    // HIDE MODAL
    // =========================================

    if (!isOpen) {

        return null;

    }


    // =========================================
    // UI
    // =========================================

    return (

        <div
            className="
                fixed
                inset-0

                z-[9999]

                bg-black/60
                backdrop-blur-[2px]

                flex
                items-center
                justify-center

                p-2
                sm:p-4
                md:p-5
                lg:p-6
            "
        >

            {/* =====================================
                OVERLAY CLICK
            ====================================== */}

            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    cursor-default
                "
            />


            {/* =====================================
                MODAL
            ====================================== */}

            <div
                className="
                    relative

                    z-10

                    w-full
                    max-w-[1450px]

                    max-h-[96vh]

                    bg-white

                    rounded-xl
                    sm:rounded-2xl

                    shadow-2xl

                    overflow-y-auto
                    lg:overflow-hidden
                "
            >


                {/* =====================================
                    CLOSE
                ====================================== */}

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"

                    className="
                        absolute

                        top-3
                        right-3

                        sm:top-4
                        sm:right-4

                        z-50

                        w-[38px]
                        h-[38px]

                        sm:w-[42px]
                        sm:h-[42px]

                        bg-white

                        text-[#131E4A]

                        rounded-full

                        shadow-lg

                        flex
                        items-center
                        justify-center

                        hover:bg-[#FFDB58]
                        hover:scale-105

                        transition-all
                        duration-200

                        cursor-pointer
                    "
                >

                    <X
                        size={21}
                        strokeWidth={2.5}
                    />

                </button>


                {/* =====================================
                    CONTENT
                ====================================== */}

                <div
                    className="
                        flex

                        flex-col
                        lg:flex-row

                        w-full

                        lg:h-[92vh]
                        lg:max-h-[900px]
                    "
                >

                    {/* LOGIN */}

                    <LoginForm
                        onClose={onClose}
                    />


                    {/* REGISTER */}

                    <RegisterForm />

                </div>

            </div>

        </div>

    );

};


export default EnrollModal;