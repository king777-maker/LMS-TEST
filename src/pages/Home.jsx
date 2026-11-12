import Hero from "../components/Hero/Hero";
import FeaturedCourses from "../components/FeaturedCourses/FeaturedCourses";
import CourseCategories from "../components/CourseCategories/CourseCategories";
import FreeCertifications from "../components/FreeCertifications/FreeCertifications";
import Testimonials from "../components/Testimonials/Testimonials";
import RecentBlogs from "../components/RecentBlogs/RecentBlogs";
import CTASection from "../components/CTASection/CTASection";
import SEO from "../components/common/SEO";

const Home = () => {
  return (
    <>
      <SEO
        title="Broadbeach Online Academy | Globally Accredited Certifications & Courses"
        description="Master ISO 9001, ISO 14001, ISO 45001, ISO 27001, Lean Six Sigma & Food Safety with accredited online training, assessments, and verified credentials."
        canonicalUrl="https://cadac.in/broadbeachlearning.com/"
      />
      <Hero />
      <CourseCategories />
      <FreeCertifications />
      <FeaturedCourses />
      <Testimonials />
      <RecentBlogs />
      <CTASection />
    </>
  );
};

export default Home;