import {
    RefreshCw
} from "lucide-react";


const CaptchaField = ({
    captcha,
    value,
    onChange,
    onRefresh,
    label = "Security Code",
    dark = false,
}) => {

    return (

        <div>

            {/* LABEL */}

            <label
                className={`
                    block

                    text-[14px]
                    sm:text-[15px]
                    lg:text-[16px]

                    font-medium

                    mb-2

                    ${
                        dark
                            ? "text-white"
                            : "text-[#1F2937]"
                    }
                `}
            >
                {label}
            </label>


            {/* CAPTCHA */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row

                    gap-3
                "
            >

                <div className="flex gap-2 shrink-0">

                    {/* CODE */}

                    <div
                        className={`
                            min-w-[145px]
                            sm:min-w-[155px]

                            h-[50px]
                            sm:h-[52px]

                            px-4

                            rounded-lg

                            flex
                            items-center
                            justify-center

                            font-bold

                            text-[17px]
                            sm:text-[19px]

                            tracking-[4px]
                            sm:tracking-[5px]

                            select-none

                            ${
                                dark
                                    ? `
                                        bg-white
                                        text-[#131E4A]
                                    `
                                    : `
                                        bg-[#F4F7FC]
                                        text-[#131E4A]
                                        border
                                        border-gray-300
                                    `
                            }
                        `}
                    >
                        {captcha}
                    </div>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={onRefresh}
                        aria-label="Refresh captcha"
                        className={`
                            w-[50px]
                            sm:w-[52px]

                            h-[50px]
                            sm:h-[52px]

                            rounded-lg

                            flex
                            items-center
                            justify-center

                            shrink-0

                            hover:bg-[#FFDB58]

                            transition-all
                            duration-200

                            cursor-pointer

                            ${
                                dark
                                    ? `
                                        bg-white
                                        text-[#131E4A]
                                    `
                                    : `
                                        bg-[#F4F7FC]
                                        text-[#131E4A]
                                        border
                                        border-gray-300
                                    `
                            }
                        `}
                    >
                        <RefreshCw size={18} />
                    </button>

                </div>


                {/* CAPTCHA INPUT */}

                <div className="flex-1">

                    <input
                        type="text"
                        name="captcha"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter CAPTCHA"
                        autoComplete="off"
                        required

                        className="
                            w-full

                            h-[50px]
                            sm:h-[52px]

                            px-4

                            bg-white
                            text-black

                            border
                            border-gray-300

                            rounded-lg

                            text-[14px]
                            sm:text-[15px]

                            outline-none

                            focus:border-[#2168D8]
                            focus:ring-2
                            focus:ring-blue-100

                            transition
                        "
                    />

                </div>

            </div>

        </div>

    );

};


export default CaptchaField;