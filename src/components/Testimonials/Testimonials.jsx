import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import testimonialData from "./testimonialData";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  return (
    <section className="bg-[#F6F9FF] py-15">

      <div className="max-w-[1500px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs mb-3.5 select-none">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="text-xs font-bold text-slate-700">Google Reviews • 4.9 Rating (400+ Verified Reviews)</span>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
              Real Testimonials
            </h2>
            <span className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></span>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Real success stories from professionals and learners who transformed their careers with Broadbeach Academy.
          </p>
        </div>

        {/* Swiper */}

        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          spaceBetween={30}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >

          {testimonialData.map((testimonial) => (

            <SwiperSlide
              key={testimonial.id}
              className="pb-16"
            >

              <TestimonialCard
                testimonial={testimonial}
              />

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </section>
  );
};

export default Testimonials;