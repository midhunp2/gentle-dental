// GraphQL Response Types

export interface MediaImage {
  alt: string;
  url: string;
}

export interface BackgroundImage {
  mediaImage: MediaImage;
}

export interface ParagraphHeroSection {
  id: string;
  backgroundImage: BackgroundImage;
  headingLarge: string;
  headingSmall: string;
  searchPlaceholder: string;
  ctaText: string;
}

export interface IconCard {
  icontitle: string;
  icondescription: string;
  icon: {
    mediaImage: MediaImage;
  };
}

export interface ParagraphIconCardsSection {
  id: string;
  cards: IconCard[];
}

export interface Stat {
  number: string;
  label: string;
}

export interface CtaLink {
  url: string;
  title: string;
}

export interface ParagraphTextImageSection {
  id: string;
  heading: string;
  sectiondescription: string;
  image: {
    mediaImage: MediaImage;
  };
  ctaText: string;
  ctaLink: CtaLink;
  stats: Stat[];
}

export type ServiceItem = 
  | {
      id: string;
      image?: {
        mediaImage: MediaImage & { title?: string | null };
      };
      title?: {
        value: string;
      };
    }
  | {
      id: string;
      ctaLink?: CtaLink;
      ctaText?: string;
      description?: {
        value: string;
      };
      title?: {
        value: string;
      };
    };

export interface ParagraphServicesGrid {
  id: string;
  sectionTitle: string;
  services: ServiceItem[];
}

export interface ParagraphInsuranceLogo {
  id: string;
  name?: string;
}

export interface ParagraphIconCard {
  id: string;
  icondescription?: string;
  icontitle?: string;
  icon?: {
    mediaImage: MediaImage;
  };
}

export interface Location {
  id: string;
  name: string;
  image?: {
    mediaImage: MediaImage;
  };
  link?: CtaLink;
}

export interface ParagraphLocationsSection {
  id: string;
  sectionTitle?: string;
  locations?: Location[];
  viewAllButtonText?: string;
  viewAllButtonLink?: CtaLink;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface ParagraphTestimonialsSection {
  id: string;
  sectionTitle?: string;
  testimonials?: Testimonial[];
}

export interface ParagraphNewPatientSection {
  id: string;
  sectionTitle?: string;
  description?: string;
  offerPrice?: string;
  offerValue?: string;
  offerDetails?: string[];
  ctaText?: string;
  ctaLink?: CtaLink;
  viewAllButtonText?: string;
  viewAllButtonLink?: CtaLink;
}

export interface DentistPanel {
  id: string;
  image?: {
    mediaImage: MediaImage;
  };
  text?: string;
}

export interface ParagraphDentistsSection {
  id: string;
  sectionTitle?: string;
  dentistPanels?: DentistPanel[];
}

export interface ParagraphGumDiseaseSection {
  id: string;
  downloadLabel?: string;
  title?: string;
  subtitle?: string;
  bookImage?: {
    mediaImage: MediaImage;
  };
  emailPlaceholder?: string;
  buttonText?: string;
}

export interface InsuranceIcon {
  id: string;
  name?: string;
  image?: {
    mediaImage: MediaImage;
  };
}

export interface ParagraphServiceCard {
  id: string;
  image?: {
    mediaImage: MediaImage & { title?: string };
  };
  title?: {
    value: string;
  };
  link?: {
    url: string;
  };
}

export interface ParagraphStatItem {
  id: string;
  number?: string;
}

export interface TestimonialCard {
  name: string;
  rating: number | null;
  review: string;
  status: boolean;
}

export interface ParagraphTestimonialSection {
  id: string;
  title?: {
    value: string;
  };
  testimonialCards?: TestimonialCard[];
}

export interface InsuranceLogo {
  logo: {
    name: string;
    mediaImage: MediaImage;
  };
}

export interface ParagraphInsuranceSection {
  id: string;
  sectionTitle?: string;
  description?: {
    value: string;
  };
  logosSection?: InsuranceLogo[];
  ctaText?: string;
  ctaLink?: CtaLink;
}

export interface ParagraphLocationCard {
  id?: string;
  link?: CtaLink;
  locationCard?: string;
}

export interface ParagraphOfferBanner {
  id: string;
  ctaLink?: CtaLink;
  ctaText?: string;
  description?: {
    value: string;
  };
  heading?: string;
  price?: string;
}

export interface ParagraphHoverText {
  id: string;
  ctaText?: string;
  ctaLink?: {
    url: string;
  };
  description?: {
    value: string;
  };
  title?: {
    value: string;
  };
}

export interface ParagraphTestimonial {
  id: string;
  name?: string;
  rating?: number;
  review?: string;
}

export interface LocationCarouselItem {
  image?: {
    mediaImage: MediaImage;
  };
  link?: CtaLink;
  locationCard?: string;
}

export interface ParagraphLocationsSection {
  id: string;
  sectionTitle?: string;
  locations?: Location[];
  viewAllButtonText?: string;
  viewAllButtonLink?: CtaLink;
  ctaLink?: CtaLink;
  ctaText?: string;
  status?: boolean;
  locationCarousel?: LocationCarouselItem[];
}

export type HomePageSection =
  | ParagraphHeroSection
  | ParagraphIconCardsSection
  | ParagraphTextImageSection
  | ParagraphServicesGrid
  | ParagraphLocationsSection
  | ParagraphTestimonialsSection
  | ParagraphTestimonialSection
  | ParagraphNewPatientSection
  | ParagraphDentistsSection
  | ParagraphGumDiseaseSection
  | ParagraphInsuranceSection
  | ParagraphServiceCard
  | ParagraphStatItem
  | ParagraphLocationCard
  | ParagraphOfferBanner
  | ParagraphHoverText
  | ParagraphTestimonial
  | ParagraphInsuranceLogo
  | ParagraphIconCard;

export interface NodeHomepage {
  sections: HomePageSection[];
}

export interface RouteInternal {
  url: string;
  entity: NodeHomepage;
}

export interface PageByRouteResponse {
  route: RouteInternal;
}

