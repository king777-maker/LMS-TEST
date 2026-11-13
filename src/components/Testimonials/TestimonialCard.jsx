import { Star, Quote } from "lucide-react";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div
      className="
      relative
      bg-white
      rounded-[24px]
      shadow-lg
      p-7 sm:p-8
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-300
      h-full
      flex flex-col justify-between
      "
    >
      <div>
        {/* Quote Icon & Google Verified Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[#D9E8FF]">
            <Quote
              size={24}
              fill="currentColor"
              strokeWidth={1.5}
            />
          </div>

          {/* Authentic Google Review Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-600 shadow-2xs select-none">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Review</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-4 mb-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={15}
              fill={index < testimonial.rating ? "#FDBA12" : "none"}
              color="#FDBA12"
            />
          ))}
          {testimonial.date && (
            <span className="text-[11px] text-slate-400 font-medium ml-2">
              {testimonial.date}
            </span>
          )}
        </div>

        {/* Review */}
        <p
          className="
          text-[#4B5563]
          text-[14.5px]
          leading-relaxed
          min-h-[110px]
          italic
          "
        >
          "{testimonial.review}"
        </p>
      </div>

      {/* User */}
      <div className="flex items-center mt-6 pt-4 border-t border-slate-100">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="
          w-13
          h-13
          rounded-full
          object-cover
          border-3
          border-[#EDF4FF]
          shrink-0
          "
        />

        <div className="ml-3.5 min-w-0">
          <h4
            className="
            text-[#1D3557]
            font-bold
            text-[16px]
            truncate
            "
          >
            {testimonial.name}
          </h4>

          <p
            className="
            text-[#7C8799]
            text-xs
            mt-0.5
            truncate
            "
          >
            {testimonial.designation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
