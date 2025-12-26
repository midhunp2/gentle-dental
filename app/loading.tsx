import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import {
  HeroBannerSkeleton,
  FeaturesSkeleton,
  DifferenceSkeleton,
  ServicesSkeleton,
  NewPatientSkeleton,
  LocationsSkeleton,
  DentistsSkeleton,
  GumDiseaseSkeleton,
  TestimonialsSkeleton,
  InsuranceSkeleton,
} from "./components/Skeleton/Skeleton";
import styles from "./home.module.css";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner Section */}
        <section className={styles.BannerWrapper}>
          <HeroBannerSkeleton />
        </section>

        {/* Features Section */}
        <section className={styles.FeaturesSection}>
          <FeaturesSkeleton />
        </section>

        {/* Difference Section */}
        <section className={styles.DifferenceSection}>
          <DifferenceSkeleton />
        </section>

        {/* Services Section */}
        <section className={styles.ServicesSection}>
          <ServicesSkeleton />
        </section>

        {/* New Patient Section */}
        <section className={styles.NewPatientSection}>
          <NewPatientSkeleton />
        </section>

        {/* Locations Section */}
        <section className={styles.LocationsSection}>
          <LocationsSkeleton />
        </section>

        {/* Dentists Section */}
        <section className={styles.DentistsSection}>
          <DentistsSkeleton />
        </section>

        {/* Gum Disease Section */}
        <section className={styles.GumDiseaseSection}>
          <GumDiseaseSkeleton />
        </section>

        {/* Testimonials Section */}
        <section className={styles.TestimonialsSection}>
          <TestimonialsSkeleton />
        </section>

        {/* Insurance Section */}
        <section className={styles.InsuranceSection}>
          <InsuranceSkeleton />
        </section>
      </main>
      <Footer />
    </>
  );
}

