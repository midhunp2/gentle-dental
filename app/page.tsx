"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import Image from "next/image";
import styles from "./home.module.css";
import { fetchPageByRoute } from "./lib/queries/query";
import type {
  PageByRouteResponse,
  ParagraphHeroSection,
  ParagraphIconCardsSection,
  ParagraphTextImageSection,
  HomePageSection,
} from "./lib/types";

interface Location {
  id: number;
  name: string;
  image: string;
  link?: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "Gentle Dental Waltham",
    image: "/assets/images/gentle-dental-waltham.webp",
  },
  {
    id: 2,
    name: "Gentle Dental Franklin",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
  {
    id: 3,
    name: "Gentle Dental Worcester at the Trolley Yard",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
  {
    id: 4,
    name: "Gentle Dental Malden",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
  {
    id: 5,
    name: "Gentle Dental Location 5",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
  {
    id: 6,
    name: "Gentle Dental Location 6",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
  {
    id: 7,
    name: "Gentle Dental Location 7",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
  {
    id: 8,
    name: "Gentle Dental Location 8",
    image: "/assets/images/gentle-dental-patients-come-first.jpg",
  },
];

const CARDS_PER_PAGE = 4;

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[][] = [
  [
    {
      id: 1,
      name: "Laura",
      location: "Gentle Dental Cambridge",
      rating: 5,
      text: "I would definitely recommend my experience at Gentle Dental Cambridge in Porter Square. A truly wonderful team of talented people! And they are paired with the most up-to-date technology. My experience was terrific! I needed a root canal and crowns in addition to a cavity filling. I was in safe hands! From start to finish, I was treated well and the procedures were completed in a timely manner.",
    },
    {
      id: 2,
      name: "Michel",
      location: "Gentle Dental Jamaica Plain",
      rating: 5,
      text: 'Dr. Mancini and his staff got me in for an appointment within an hour of my call and took care of a loose, temporary cap. To my surprise they were able to "install" my permanent crown even though the appointment for that procedure was scheduled a week later. Perfect fit! Made my day. Thank you Gentle Dental Jamaica Plain!',
    },
  ],
  [
    {
      id: 3,
      name: "Sarah",
      location: "Gentle Dental Waltham",
      rating: 5,
      text: "Excellent service from start to finish! The staff was friendly and professional. Dr. Smith explained everything clearly and made me feel comfortable throughout my visit. I highly recommend this location!",
    },
    {
      id: 4,
      name: "John",
      location: "Gentle Dental Franklin",
      rating: 5,
      text: "I've been coming here for years and the quality of care never disappoints. The office is clean, modern, and the team always goes above and beyond. Best dental experience I've ever had!",
    },
  ],
  [
    {
      id: 5,
      name: "Emily",
      location: "Gentle Dental Malden",
      rating: 5,
      text: "The team at Gentle Dental Malden is amazing! They made my dental visit stress-free and comfortable. The hygienist was gentle and thorough, and Dr. Johnson was very knowledgeable. I'm so glad I found this practice!",
    },
    {
      id: 6,
      name: "Michael",
      location: "Gentle Dental Worcester",
      rating: 5,
      text: "Outstanding care and attention to detail. The entire staff is professional and caring. They took the time to explain my treatment options and made sure I was comfortable every step of the way. Highly recommend!",
    },
  ],
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(locations.length / CARDS_PER_PAGE);
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const totalTestimonialPages = testimonials.length;
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [pageData, setPageData] = useState<PageByRouteResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const data = await fetchPageByRoute("/node/7");
        setPageData(data);
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPageData();
  }, []);

  // Helper function to check section type
  const isHeroSection = (
    section: HomePageSection
  ): section is ParagraphHeroSection => {
    return "headingLarge" in section && "headingSmall" in section;
  };

  const isIconCardsSection = (
    section: HomePageSection
  ): section is ParagraphIconCardsSection => {
    return "cards" in section && Array.isArray(section.cards);
  };

  const isTextImageSection = (
    section: HomePageSection
  ): section is ParagraphTextImageSection => {
    return "sectiondescription" in section && "stats" in section;
  };

  // Get sections from GraphQL data (only the 3 available types)
  const sections = pageData?.route?.entity?.sections || [];
  const heroSection = sections.find(isHeroSection);
  const iconCardsSection = sections.find(isIconCardsSection);
  const textImageSection = sections.find(isTextImageSection);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleDotClick = (index: number) => {
    setCurrentPage(index);
  };

  const handleTestimonialNext = () => {
    setCurrentTestimonialPage((prev) => (prev + 1) % totalTestimonialPages);
  };

  const handleTestimonialPrev = () => {
    setCurrentTestimonialPage(
      (prev) => (prev - 1 + totalTestimonialPages) % totalTestimonialPages
    );
  };

  const handleTestimonialDotClick = (index: number) => {
    setCurrentTestimonialPage(index);
  };

  // Don't render content while loading - Next.js will show loading.tsx automatically
  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main>
        {heroSection && (
          <section
            className={styles.BannerWrapper}
            style={{
              backgroundImage: heroSection.backgroundImage?.mediaImage?.url
                ? `url(${heroSection.backgroundImage.mediaImage.url})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className={styles.BannerContent}>
              <h1 className={styles.BannerTitle}>
                {heroSection.headingSmall || "Quality Dental Care is"}
              </h1>
              <p className={styles.BannerSubtitle}>
                {heroSection.headingLarge
                  ? heroSection.headingLarge.replace(/\s+/g, " ").split(" ").map((word, index, array) => {
                      const midPoint = Math.floor(array.length / 2);
                      return (
                        <span key={index}>
                          {word}
                          {index < array.length - 1 && " "}
                          {index === midPoint - 1 && <br />}
                        </span>
                      );
                    })
                  : "Right Around the corner"}
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
                    placeholder={
                      heroSection.searchPlaceholder ||
                      "Search by City, State or ZIP code"
                    }
                    className={styles.SearchInput}
                  />
                </div>
                <button className={styles.SearchButton}>
                  {heroSection.ctaText || "SEARCH"}
                </button>
              </div>
            </div>
          </section>
        )}
        {iconCardsSection && iconCardsSection.cards && iconCardsSection.cards.length > 0 && (
          <section className={styles.FeaturesSection}>
            <div className={styles.FeaturesContainer}>
              {iconCardsSection.cards.map((card, index) => (
                <div
                  key={card.icontitle || index}
                  className={index === 0 ? styles.FeatureCardWrapper : ""}
                >
                  <div className={styles.FeatureCard}>
                    <h2 className={styles.FeatureTitle}>{card.icontitle}</h2>
                    {card.icon?.mediaImage?.url && (
                      <div className={styles.FeatureIcon}>
                        <Image
                          src={card.icon.mediaImage.url}
                          alt={card.icon.mediaImage.alt || card.icontitle}
                          width={100}
                          height={100}
                          className={styles.IconImage}
                          quality={95}
                          unoptimized={false}
                        />
                      </div>
                    )}
                    <p className={styles.FeatureDescription}>
                      {card.icondescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {textImageSection && (
          <section className={styles.DifferenceSection}>
            <div className={styles.DifferenceContainer}>
              {textImageSection.image?.mediaImage?.url && (
                <div className={styles.DifferenceImage}>
                  <Image
                    src={textImageSection.image.mediaImage.url}
                    alt={textImageSection.image.mediaImage.alt || textImageSection.heading}
                    width={400}
                    height={600}
                    className={styles.PatientImage}
                    quality={95}
                    unoptimized={false}
                  />
                </div>
              )}
              <div className={styles.DifferenceContent}>
                <h2 className={styles.DifferenceTitle}>
                  {textImageSection.heading || "Patients Come First"}
                </h2>
                {textImageSection.sectiondescription && (
                  <div className={styles.DifferenceText}>
                    {textImageSection.sectiondescription.includes("<") ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: textImageSection.sectiondescription,
                        }}
                      />
                    ) : (
                      <p>{textImageSection.sectiondescription}</p>
                    )}
                  </div>
                )}
                {textImageSection.stats && textImageSection.stats.length > 0 && (
                  <div className={styles.StatisticsContainer}>
                    {textImageSection.stats.map((stat, index) => (
                      <div key={index} className={styles.Statistic}>
                        <div className={styles.StatisticNumber}>
                          {stat.number}
                        </div>
                        <div className={styles.StatisticLabel}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {textImageSection.ctaText && (
                  <button className={styles.LearnMoreButton}>
                    {textImageSection.ctaLink?.url ? (
                      <a
                        href={textImageSection.ctaLink.url}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {textImageSection.ctaText}
                      </a>
                    ) : (
                      textImageSection.ctaText
                    )}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
        <section className={styles.NewPatientSection}>
          <div className={styles.NewPatientBanner}>
            <div className={styles.NewPatientLeft}>
              <h2 className={styles.NewPatientTitle}>WELCOMING NEW PATIENTS</h2>
              <p className={styles.NewPatientDescription}>
                We&apos;re proud to always welcome patients into our practices.
                Whether you&apos;re new to town, need to restart your dental
                care, or are looking for a more convenient dentist, our New
                Patient Offer is a great introduction to our practice. New
                patients receive an exam, all necessary x-rays, a cleaning, and
                a personalized treatment plan for $79.
              </p>
            </div>
            <div className={styles.NewPatientRight}>
              <div className={styles.OfferPriceContainer}>
                <div className={styles.OfferPrice}>$79</div>
                <div className={styles.OfferDetails}>
                  <div className={styles.OfferDetailItem}>EXAM</div>
                  <div className={styles.OfferDetailItem}>X-RAYS</div>
                  <div className={styles.OfferDetailItem}>CLEANING</div>
                  <div className={styles.OfferDetailItem}>TREATMENT PLAN</div>
                </div>
              </div>
              <div className={styles.OfferValue}>A $400+ VALUE</div>
              <button className={styles.NewPatientLearnMoreButton}>
                LEARN MORE
              </button>
            </div>
          </div>
          <div className={styles.ViewAllOffersContainer}>
            <button className={styles.ViewAllOffersButton}>
              VIEW ALL OFFERS
            </button>
          </div>
        </section>
        <section className={styles.LocationsSection}>
          <div className={styles.LocationsContainer}>
            <h2 className={styles.LocationsTitle}>Locations</h2>
            <div className={styles.CarouselArrowsContainer}>
              <button
                className={`${styles.CarouselArrow} ${styles.CarouselArrowLeft}`}
                onClick={handlePrev}
                aria-label="Previous locations"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={`${styles.CarouselArrow} ${styles.CarouselArrowRight}`}
                onClick={handleNext}
                aria-label="Next locations"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.LocationsCarousel}>
              <div className={styles.CarouselContent}>
                <div
                  className={styles.CarouselTrack}
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <div key={pageIndex} className={styles.CarouselPage}>
                      {locations
                        .slice(
                          pageIndex * CARDS_PER_PAGE,
                          pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE
                        )
                        .map((location) => (
                          <div
                            key={location.id}
                            className={styles.LocationCard}
                          >
                            <div className={styles.LocationImageWrapper}>
                              <Image
                                src={location.image}
                                alt={location.name}
                                width={400}
                                height={300}
                                className={styles.LocationImage}
                              />
                              <div className={styles.LocationOverlay}>
                                <h3 className={styles.LocationName}>
                                  {location.name}
                                </h3>
                                <a
                                  href="#"
                                  className={styles.LocationLearnMore}
                                >
                                  LEARN MORE &gt;
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.CarouselDots}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.Dot} ${
                    index === currentPage ? styles.DotActive : ""
                  }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <div className={styles.SeeAllLocationsContainer}>
              <button className={styles.SeeAllLocationsButton}>
                SEE ALL LOCATIONS
              </button>
            </div>
          </div>
        </section>
        <section className={styles.DentistsSection}>
          <div className={styles.DentistsContainer}>
            <h2 className={styles.DentistsTitle}>Our Gentle Dental Dentists</h2>
            <div className={styles.DentistsGrid}>
              <div className={styles.DentistPanel}>
                <div className={styles.DentistImageWrapper}>
                  <Image
                    src="/assets/images/bu-logo.png"
                    alt="Boston University"
                    width={200}
                    height={200}
                    className={styles.DentistImage}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <p className={styles.DentistText}>
                  Dentists at Gentle Dental are graduates of top universities
                  including Harvard, Tufts, Boston University, and UCONN.
                </p>
              </div>
              <div className={styles.DentistPanel}>
                <div className={styles.DentistImageWrapper}>
                  <Image
                    src="/assets/images/dentists-group-photo.jpg"
                    alt="Gentle Dental Dentists"
                    width={400}
                    height={300}
                    className={styles.DentistImage}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <p className={styles.DentistText}>
                  Dentists at Gentle Dental have received more Boston Magazine
                  &quot;Top Dentist&quot; distinctions than any other dental
                  practice.
                </p>
              </div>
              <div className={styles.DentistPanel}>
                <div className={styles.DentistImageWrapper}>
                  <Image
                    src="/assets/images/readers-choice-award.png"
                    alt="Readers Choice Awards"
                    width={200}
                    height={200}
                    className={styles.DentistImage}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <p className={styles.DentistText}>
                  Year after year our offices are named &quot;Choice Dental
                  Office&quot; in their towns and regions by Readers Choice
                  Awards.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.GumDiseaseSection}>
          <div className={styles.GumDiseaseContainer}>
            <div className={styles.GumDiseaseLeft}>
              <Image
                src="/assets/images/know-the-eight-warning-signs.png"
                alt="Know the 8 Warning Signs of Gum Disease"
                width={100}
                height={100}
                className={styles.GumDiseaseBookImage}
              />
            </div>
            <div className={styles.GumDiseaseRight}>
              <div className={styles.GumDiseaseContent}>
                <p className={styles.GumDiseaseDownloadLabel}>DOWNLOAD NOW</p>
                <h2 className={styles.GumDiseaseTitle}>
                  Know the 8 Warning Signs of Gum Disease
                </h2>
                <p className={styles.GumDiseaseSubtitle}>
                  It&apos;s never too early to protect your smile. Download to
                  learn more!
                </p>
                <div className={styles.GumDiseaseForm}>
                  <div className={styles.EmailInputWrapper}>
                    <Image
                      src="/assets/images/mail-icon.png"
                      alt="Email"
                      width={20}
                      height={20}
                      className={styles.MailIcon}
                    />
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className={styles.EmailInput}
                    />
                  </div>
                  <button className={styles.DownloadButton}>DOWNLOAD</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.TestimonialsSection}>
          <div className={styles.TestimonialsContainer}>
            <h2 className={styles.TestimonialsTitle}>Hear From Our Patients</h2>
            <div className={styles.TestimonialsCarousel}>
              <button
                className={`${styles.TestimonialArrow} ${styles.TestimonialArrowLeft}`}
                onClick={handleTestimonialPrev}
                aria-label="Previous testimonials"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={styles.TestimonialsContent}>
                <div
                  className={styles.TestimonialsTrack}
                  style={{
                    transform: `translateX(-${currentTestimonialPage * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonialPair, pageIndex) => (
                    <div key={pageIndex} className={styles.TestimonialsPage}>
                      {testimonialPair.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className={styles.TestimonialCard}
                        >
                          <h3 className={styles.TestimonialName}>
                            {testimonial.name}
                          </h3>
                          <p className={styles.TestimonialLocation}>
                            {testimonial.location}
                          </p>
                          <div className={styles.TestimonialStars}>
                            {Array.from({ length: testimonial.rating }).map(
                              (_, i) => (
                                <span key={i} className={styles.Star}>
                                  ★
                                </span>
                              )
                            )}
                          </div>
                          <p className={styles.TestimonialText}>
                            {testimonial.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={`${styles.TestimonialArrow} ${styles.TestimonialArrowRight}`}
                onClick={handleTestimonialNext}
                aria-label="Next testimonials"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.TestimonialDots}>
              {Array.from({ length: totalTestimonialPages }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.TestimonialDot} ${
                    index === currentTestimonialPage
                      ? styles.TestimonialDotActive
                      : ""
                  }`}
                  onClick={() => handleTestimonialDotClick(index)}
                  aria-label={`Go to testimonial page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.InsuranceSection}>
          <div className={styles.InsuranceContainer}>
            <h2 className={styles.InsuranceTitle}>Insurances Accepted</h2>
            <div className={styles.InsuranceIconsGrid}>
              <div className={styles.InsuranceRow}>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 1</div>
                </div>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 2</div>
                </div>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 3</div>
                </div>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 4</div>
                </div>
              </div>
              <div className={styles.InsuranceRow}>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 5</div>
                </div>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 6</div>
                </div>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 7</div>
                </div>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 8</div>
                </div>
              </div>
              <div className={styles.InsuranceRow}>
                <div className={styles.InsuranceIcon}>
                  <div className={styles.InsuranceIconPlaceholder}>Icon 9</div>
                </div>
              </div>
            </div>
            <p className={styles.InsuranceDescription}>
              We are in-network providers with most major dental insurance
              companies. Call us to confirm coverage.
            </p>
            <button className={styles.InsuranceLearnMoreButton}>
              LEARN MORE
            </button>
          </div>
        </section>
      </main>

      <Footer />
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className={styles.scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="fa fa-chevron-up"></i>
        </button>
      )}
    </>
  );
}
