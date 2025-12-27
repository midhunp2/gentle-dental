import React from "react";
import styles from "./skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = "",
  variant = "rectangular",
  lines,
}) => {
  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || "1em",
    borderRadius: borderRadius || (variant === "circular" ? "50%" : "4px"),
  };

  if (lines && lines > 1) {
    return (
      <div className={`${styles.skeletonContainer} ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${styles.skeleton} ${styles[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? "80%" : "100%",
              marginBottom: index < lines - 1 ? "8px" : "0",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  height?: string | number;
}> = ({ lines = 1, className = "", height }) => (
  <Skeleton variant="text" lines={lines} className={className} height={height} />
);

export const SkeletonBox: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ width, height, className = "" }) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={height}
    className={className}
  />
);

export const SkeletonCircle: React.FC<{
  size?: string | number;
  className?: string;
}> = ({ size = 40, className = "" }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);

// Appointment Scheduler Skeleton
export const AppointmentSchedulerSkeleton: React.FC = () => {
  return (
    <div className={styles.appointmentSkeleton}>
      <SkeletonBox height={60} className={styles.skeletonHeader} />
      <div className={styles.skeletonCalendar}>
        <SkeletonBox height={40} className={styles.skeletonCalendarHeader} />
        <div className={styles.skeletonCalendarGrid}>
          {Array.from({ length: 35 }).map((_, index) => (
            <SkeletonBox
              key={index}
              height={50}
              className={styles.skeletonCalendarDay}
            />
          ))}
        </div>
      </div>
      <div className={styles.skeletonForm}>
        <SkeletonText lines={3} className={styles.skeletonFormField} />
        <SkeletonBox height={50} className={styles.skeletonButton} />
      </div>
    </div>
  );
};

// Hero Banner Skeleton
export const HeroBannerSkeleton: React.FC = () => {
  return (
    <div className={styles.heroSkeleton}>
      <SkeletonText
        lines={1}
        className={styles.skeletonTitle}
        height={30}
      />
      <SkeletonText
        lines={2}
        className={styles.skeletonSubtitle}
        height={54}
      />
      <SkeletonBox height={81} className={styles.skeletonSearchBar} />
    </div>
  );
};

// Features Section Skeleton
export const FeaturesSkeleton: React.FC = () => {
  return (
    <div className={styles.featuresSkeleton}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.featureCardSkeleton}>
          <SkeletonBox height={28} width={200} className={styles.skeletonFeatureTitle} />
          <SkeletonCircle size={120} className={styles.skeletonFeatureIcon} />
          <SkeletonText lines={3} className={styles.skeletonFeatureDescription} />
        </div>
      ))}
    </div>
  );
};

// Difference Section Skeleton
export const DifferenceSkeleton: React.FC = () => {
  return (
    <div className={styles.differenceSkeleton}>
      <SkeletonBox height={552} width={507} className={styles.skeletonDifferenceImage} />
      <div className={styles.differenceContentSkeleton}>
        <SkeletonBox height={36} width={300} className={styles.skeletonDifferenceTitle} />
        <SkeletonText lines={6} className={styles.skeletonDifferenceText} />
        <div className={styles.statisticsSkeleton}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.statisticSkeleton}>
              <SkeletonBox height={48} width={60} className={styles.skeletonStatisticNumber} />
              <SkeletonBox height={20} width={120} className={styles.skeletonStatisticLabel} />
            </div>
          ))}
        </div>
        <SkeletonBox height={48} width={150} className={styles.skeletonLearnMoreButton} />
      </div>
    </div>
  );
};

// Services Section Skeleton
export const ServicesSkeleton: React.FC = () => {
  return (
    <div className={styles.servicesSkeleton}>
      <div className={styles.servicesHeaderSkeleton}>
        <SkeletonBox height={43} width={250} className={styles.skeletonServicesTitle} />
        <SkeletonText lines={4} className={styles.skeletonServicesDescription} />
        <SkeletonBox height={48} width={200} className={styles.skeletonViewAllButton} />
      </div>
      <div className={styles.servicesGridSkeleton}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.serviceCardSkeleton}>
            <SkeletonBox height={300} width="100%" className={styles.skeletonServiceImage} />
            <div className={styles.skeletonServiceOverlay}>
              <SkeletonBox height={32} width={180} className={styles.skeletonServiceTitle} />
              <SkeletonText lines={2} className={styles.skeletonServiceDescription} />
              <SkeletonBox height={20} width={120} className={styles.skeletonServiceLink} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// New Patient Section Skeleton
export const NewPatientSkeleton: React.FC = () => {
  return (
    <div className={styles.newPatientSkeleton}>
      <div className={styles.newPatientBannerSkeleton}>
        <div className={styles.newPatientLeftSkeleton}>
          <SkeletonBox height={72} width={400} className={styles.skeletonNewPatientTitle} />
          <SkeletonText lines={4} className={styles.skeletonNewPatientDescription} />
        </div>
        <div className={styles.newPatientRightSkeleton}>
          <SkeletonBox height={150} width={150} className={styles.skeletonOfferPrice} />
          <div className={styles.offerDetailsSkeleton}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBox key={i} height={25} width={100} className={styles.skeletonOfferDetail} />
            ))}
          </div>
          <SkeletonBox height={24} width={200} className={styles.skeletonOfferValue} />
          <SkeletonBox height={48} width={150} className={styles.skeletonNewPatientButton} />
        </div>
      </div>
      <SkeletonBox height={48} width={200} className={styles.skeletonViewAllOffersButton} />
    </div>
  );
};

// Locations Section Skeleton
export const LocationsSkeleton: React.FC = () => {
  return (
    <div className={styles.locationsSkeleton}>
      <SkeletonBox height={30} width={200} className={styles.skeletonLocationsTitle} />
      <div className={styles.locationsCarouselSkeleton}>
        <div className={styles.carouselPageSkeleton}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.locationCardSkeleton}>
              <SkeletonBox height={300} width="100%" className={styles.skeletonLocationImage} />
              <div className={styles.skeletonLocationOverlay}>
                <SkeletonBox height={28} width={200} className={styles.skeletonLocationName} />
                <SkeletonBox height={20} width={120} className={styles.skeletonLocationLink} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.carouselDotsSkeleton}>
        {[1, 2, 3].map((i) => (
          <SkeletonCircle key={i} size={12} className={styles.skeletonDot} />
        ))}
      </div>
      <SkeletonBox height={48} width={200} className={styles.skeletonSeeAllButton} />
    </div>
  );
};

// Dentists Section Skeleton
export const DentistsSkeleton: React.FC = () => {
  return (
    <div className={styles.dentistsSkeleton}>
      <SkeletonBox height={36} width={400} className={styles.skeletonDentistsTitle} />
      <div className={styles.dentistsGridSkeleton}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.dentistPanelSkeleton}>
            <SkeletonBox height={200} width={200} className={styles.skeletonDentistImage} />
            <SkeletonText lines={3} className={styles.skeletonDentistText} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Gum Disease Section Skeleton
export const GumDiseaseSkeleton: React.FC = () => {
  return (
    <div className={styles.gumDiseaseSkeleton}>
      <SkeletonBox height={200} width={200} className={styles.skeletonGumDiseaseImage} />
      <div className={styles.gumDiseaseContentSkeleton}>
        <SkeletonBox height={16} width={150} className={styles.skeletonDownloadLabel} />
        <SkeletonBox height={48} width={400} className={styles.skeletonGumDiseaseTitle} />
        <SkeletonText lines={2} className={styles.skeletonGumDiseaseSubtitle} />
        <div className={styles.gumDiseaseFormSkeleton}>
          <SkeletonBox height={48} width={300} className={styles.skeletonEmailInput} />
          <SkeletonBox height={48} width={150} className={styles.skeletonDownloadButton} />
        </div>
      </div>
    </div>
  );
};

// Testimonials Section Skeleton
export const TestimonialsSkeleton: React.FC = () => {
  return (
    <div className={styles.testimonialsSkeleton}>
      <SkeletonBox height={36} width={300} className={styles.skeletonTestimonialsTitle} />
      <div className={styles.testimonialsCarouselSkeleton}>
        <div className={styles.testimonialCardSkeleton}>
          <SkeletonBox height={24} width={150} className={styles.skeletonTestimonialName} />
          <SkeletonBox height={20} width={200} className={styles.skeletonTestimonialLocation} />
          <div className={styles.skeletonStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBox key={i} height={20} width={20} className={styles.skeletonStar} />
            ))}
          </div>
          <SkeletonText lines={4} className={styles.skeletonTestimonialText} />
        </div>
      </div>
      <div className={styles.carouselDotsSkeleton}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCircle key={i} size={12} className={styles.skeletonDot} />
        ))}
      </div>
    </div>
  );
};

// Insurance Section Skeleton
export const InsuranceSkeleton: React.FC = () => {
  return (
    <div className={styles.insuranceSkeleton}>
      <SkeletonBox height={30} width={300} className={styles.skeletonInsuranceTitle} />
      <div className={styles.insuranceGridSkeleton}>
        <div className={styles.insuranceRowSkeleton}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox key={i} height={80} width={120} className={styles.skeletonInsuranceIcon} />
          ))}
        </div>
        <div className={styles.insuranceRowSkeleton}>
          {[5, 6, 7, 8].map((i) => (
            <SkeletonBox key={i} height={80} width={120} className={styles.skeletonInsuranceIcon} />
          ))}
        </div>
        <div className={styles.insuranceRowSkeleton}>
          <SkeletonBox height={80} width={120} className={styles.skeletonInsuranceIcon} />
        </div>
      </div>
      <SkeletonText lines={2} className={styles.skeletonInsuranceDescription} />
      <SkeletonBox height={48} width={150} className={styles.skeletonInsuranceButton} />
    </div>
  );
};

