const SideCard = ({
    icon: Icon,
    title,
    children,
    className = "",
}) => {
    return (
        <div
            className={`
                bg-white
                rounded-2xl
                border
                border-slate-200/80
                shadow-xs
                hover:shadow-sm
                transition-shadow
                duration-200
                p-5
                sm:p-6
                ${className}
            `}
        >
            {title && (
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    {Icon && (
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-[#FFF7D6] flex items-center justify-center text-[#131E4A] shadow-xs">
                            <Icon size={18} />
                        </div>
                    )}
                    <h3 className="text-[#131E4A] font-bold text-sm sm:text-base tracking-tight">
                        {title}
                    </h3>
                </div>
            )}
            {children}
        </div>
    );
};

export default SideCard;