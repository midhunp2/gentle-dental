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

export interface Service {
  title: {
    value: string;
  };
  image: {
    mediaImage: MediaImage;
  };
}

export interface ParagraphServicesGrid {
  id: string;
  sectionTitle: string;
  services: Service[];
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

export interface ParagraphInsuranceSection {
  id: string;
  sectionTitle?: string;
  description?: string;
  insuranceIcons?: InsuranceIcon[];
  ctaText?: string;
  ctaLink?: CtaLink;
}

export type HomePageSection =
  | ParagraphHeroSection
  | ParagraphIconCardsSection
  | ParagraphTextImageSection
  | ParagraphServicesGrid
  | ParagraphLocationsSection
  | ParagraphTestimonialsSection
  | ParagraphNewPatientSection
  | ParagraphDentistsSection
  | ParagraphGumDiseaseSection
  | ParagraphInsuranceSection;

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

