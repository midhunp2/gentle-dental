import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import {
  HeroBannerSkeleton,
  FeaturesSkeleton,
  DifferenceSkeleton,
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
        {/* Hero Banner Section - matches conditional rendering in page.tsx */}
        <section className={styles.BannerWrapper}>
          <HeroBannerSkeleton />
        </section>

        {/* Features Section (Icon Cards) - matches conditional rendering in page.tsx */}
        <section className={styles.FeaturesSection}>
          <FeaturesSkeleton />
        </section>

        {/* Difference Section (Text Image) - matches conditional rendering in page.tsx */}
        <section className={styles.DifferenceSection}>
          <DifferenceSkeleton />
        </section>

        {/* New Patient Section - always shown in page.tsx */}
        <section className={styles.NewPatientSection}>
          <NewPatientSkeleton />
        </section>

        {/* Locations Section - always shown in page.tsx */}
        <section className={styles.LocationsSection}>
          <LocationsSkeleton />
        </section>

        {/* Dentists Section - always shown in page.tsx */}
        <section className={styles.DentistsSection}>
          <DentistsSkeleton />
        </section>

        {/* Gum Disease Section - always shown in page.tsx */}
        <section className={styles.GumDiseaseSection}>
          <GumDiseaseSkeleton />
        </section>

        {/* Testimonials Section - always shown in page.tsx */}
        <section className={styles.TestimonialsSection}>
          <TestimonialsSkeleton />
        </section>

        {/* Insurance Section - always shown in page.tsx */}
        <section className={styles.InsuranceSection}>
          <InsuranceSkeleton />
        </section>
      </main>
      <Footer />
    </>
  );
}

