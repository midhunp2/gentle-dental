import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.BannerWrapper}>
          <div className={styles.BannerContent}>
            <h1 className={styles.BannerTitle}>Quality Dental Care is</h1>
            <p className={styles.BannerSubtitle}>
              Right Around <br />
              the corner
            </p>
            <div className={styles.SearchBar}>
              <div className={styles.SearchInputWrapper}>
                <Image
                  src="https://www.gentledental.com/themes/custom/gentledentaldptheme/images/location.svg"
                  alt="Location"
                  className={styles.LocationIcon}
                  width={100}
                  height={100}
                  unoptimized
                />
                <input
                  type="text"
                  placeholder="Search by City, State or ZIP code"
                  className={styles.SearchInput}
                />
              </div>
              <button className={styles.SearchButton}>SEARCH</button>
            </div>
          </div>
        </section>
        <section className={styles.FeaturesSection}>
          <div className={styles.FeaturesContainer}>
            <div className={styles.FeatureCardWrapper}>
              <div className={styles.FeatureCard}>
                <h2 className={styles.FeatureTitle}>Personalized Service</h2>
                <div className={styles.FeatureIcon}>
                  <Image
                    src="/assets/images/personalized-service-icon.png"
                    alt="Personalized Service"
                    width={100}
                    height={100}
                    className={styles.IconImage}
                  />
                </div>
                <p className={styles.FeatureDescription}>
                  Our trustworthy doctors partner with you to create a
                  personalized treatment plan. We have been providing peace of
                  mind for you and your family for over 45 years.
                </p>
              </div>
            </div>
            <div className={styles.FeatureCard}>
              <h2 className={styles.FeatureTitle}>Award-Winning Care</h2>
              <div className={styles.FeatureIcon}>
                <Image
                  src="/assets/images/award-winning-care-icon.png"
                  alt="Award-Winning Care"
                  width={100}
                  height={100}
                  className={styles.IconImage}
                />
              </div>
              <p className={styles.FeatureDescription}>
                Gentle Dental has received more Boston Magazine &quot;Top
                Dentist&quot; distinctions than any other dental practice in New
                England. Our dentists and specialists provide the highest level
                of care at each newly renovated, all-digital office.
              </p>
            </div>
            <div className={styles.FeatureCard}>
              <h2 className={styles.FeatureTitle}>On Your Schedule</h2>
              <div className={styles.FeatureIcon}>
                <Image
                  src="/assets/images/dentistry-on-your-schedule.png"
                  alt="On Your Schedule"
                  width={100}
                  height={100}
                  className={styles.IconImage}
                />
              </div>
              <p className={styles.FeatureDescription}>
                Taking care of your health should fit within your schedule. We
                are open late and on weekends so you can get the care you need.
                Some of our locations are even open 7 days a week!
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
