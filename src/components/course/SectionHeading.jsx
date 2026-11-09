const SectionHeading = ({
    icon: Icon,
    title,
    description,
    badge,
    className = "",
}) => {
    return (
        <div className={`mb-5 sm:mb-6 ${className}`}>
            <div className="flex items-center gap-3 sm:gap-3.5">
                {Icon && (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#FFF7D6] flex items-center justify-center text-[#131E4A] shadow-xs">
                        <Icon size={20} />
                    </div>
                )}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-[#131E4A] text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                        {title}
                    </h2>
                    {badge && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E5FA8] border border-blue-200">
                            {badge}
                        </span>
                    )}
                </div>
            </div>

            {description && (
                <p className="mt-2.5 sm:mt-3 text-slate-500 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;