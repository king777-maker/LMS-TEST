import {
  CalendarDays,
  Clock3,
  ArrowRight,
  User,
} from "lucide-react";

const BlogCard = ({ blog }) => {
  return (
    <div
      className="
        group
        bg-white
        rounded-[24px]
        overflow-hidden
        shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        hover:-translate-y-2
        hover:shadow-2xl
        transition-all
        duration-300
        max-w-[500px]
        w-full
        mx-auto
      "
    >
      {/* Image */}

      <div className="relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="
            w-full
            h-[250px]
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />

        {/* Category Badge */}
        <span
          className="
            absolute
            top-4
            left-4
            bg-[#131E4A]/90
            backdrop-blur-xs
            text-amber-300
            text-[11px]
            font-bold
            px-3
            py-1.5
            rounded-full
            uppercase
            tracking-wider
            shadow-sm
            border border-white/20
          "
        >
          {blog.category}
        </span>
      </div>

      {/* Content */}

      <div className="p-7">

        {/* Title */}

        <h3
          className="
            text-[20px]
            font-bold
            text-[#1D3557]
            leading-tight
            min-h-[70px]
          "
        >
          {blog.title}
        </h3>

        {/* Description */}

        <p
          className="
            mt-1
            text-[#6B7280]
            text-[16px]
            leading-8
            min-h-[95px]
          "
        >
          {blog.description}
        </p>

        {/* Meta */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-5
            mt-2
            text-[#7C8799]
            text-sm
          "
        >
          {/* Author */}

          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{blog.author}</span>
          </div>

          {/* Date */}

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{blog.date}</span>
          </div>

          {/* Read Time */}

          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            <span>{blog.readTime}</span>
          </div>
        </div>

        {/* Divider */}

        <div className="border-t border-gray-200 my-6"></div>

        {/* Read Article */}

        <a
          href={blog.link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            text-[#2168D8]
            font-semibold
            group-hover:gap-3
            transition-all
            duration-300
          "
        >
          <span className="!text-[20px]">Read Article</span>

          <ArrowRight
            size={18}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </a>

      </div>
    </div>
  );
};

export default BlogCard;