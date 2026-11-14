const ImageCard = ({
    src,
    alt,
    className = "",
    contain = false,
}) => {

    return (

        <div
            className={`
                bg-white
                p-[5px]
                shadow-[0_2px_14px_rgba(0,0,0,0.15)]
                ${className}
            `}
        >

            <img
                src={src || "/assets/broadbeach_campus.jpg"}
                alt={alt || "Broadbeach Online Academy"}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/broadbeach_campus.jpg";
                }}
                className={`
                    w-full
                    h-full

                    ${
                        contain
                            ? "object-contain"
                            : "object-cover"
                    }
                `}
            />

        </div>

    );
};


export default ImageCard;