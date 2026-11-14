import {
  FaBullseye,
  FaEye,
  FaAward,
} from "react-icons/fa";

const cards = [
  {
    icon: <FaEye />,
    title: "Our Vision",
    description:
      "Become the world's most trusted learning platform by making quality education accessible, flexible, and career-focused.",
  },
  {
    icon: <FaBullseye />,
    title: "Our Mission",
    description:
      "Deliver world-class online certification programs that empower professionals with practical skills and globally recognized credentials.",
  },
  {
    icon: <FaAward />,
    title: "Our Values",
    description:
      "Integrity, innovation, learner success, excellence, and continuous improvement are the core values behind everything we do.",
  },
];

const AboutMission = () => {
  return (
    <section className="bg-white py-24">

      <div className="max-w-[1400px] mx-auto px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {cards.map((item, index) => (

            <div
              key={index}
              className="
                bg-white
                rounded-[24px]
                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                p-12
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-[0_15px_50px_rgba(37,99,235,0.15)]
              "
            >

              {/* Icon */}

              <div
                className="
                  w-24
                  h-24
                  mx-auto
                  rounded-full
                  bg-[#EDF4FF]
                  flex
                  items-center
                  justify-center
                  text-[#2563EB]
                  text-4xl
                "
              >
                {item.icon}
              </div>

              {/* Title */}

              <h3
                className="
                  mt-8
                  text-[32px]
                  font-bold
                  text-[#1E3A66]
                "
              >
                {item.title}
              </h3>

              {/* Description */}

              <p
                className="
                  mt-6
                  text-[20px]
                  leading-10
                  text-[#667085]
                "
              >
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default AboutMission;