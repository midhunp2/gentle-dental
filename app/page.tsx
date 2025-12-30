"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import Image from "next/image";
import styles from "./home.module.css";
import AnimatedNumber from "./components/Ui/AnimatedNumber/AnimatedNumber";
import { fetchHomePage } from "./lib/queries/query";
import { onScroll, animate, stagger, set } from "animejs";
import type {
  PageByRouteResponse,
  ParagraphHeroSection,
  ParagraphIconCardsSection,
  ParagraphTextImageSection,
  ParagraphLocationsSection,
  ParagraphTestimonialSection,
  ParagraphInsuranceSection,
  ParagraphOfferBanner,
  ParagraphServicesGrid,
  ServiceItem,
  HomePageSection,
  InsuranceLogo,
  TestimonialCard,
} from "./lib/types";

// Dev-only logging
const isDev = process.env.NODE_ENV === "development";
const log = isDev ? console.log : () => {};
const logError = isDev ? console.error : () => {};

const CARDS_PER_PAGE = 4;

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [pageData, setPageData] = useState<PageByRouteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");

  // Jarvis scheduler refs and state
  const scriptLoadedRef = useRef(false);
  const schedulerInitializedRef = useRef(false);
  const jarvisSchedulerRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [jarvisError, setJarvisError] = useState<string | null>(null);
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  // Animation refs
  const featuresRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const differenceImageRef = useRef<HTMLDivElement | null>(null);
  const differenceContentRef = useRef<HTMLDivElement | null>(null);
  const newPatientRef = useRef<HTMLElement | null>(null);
  const testimonialsRef = useRef<HTMLElement | null>(null);
  const insuranceRef = useRef<HTMLElement | null>(null);
  const dentistsRef = useRef<HTMLElement | null>(null);

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
        const data = await fetchHomePage();
        setPageData(data);
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPageData();
  }, []);

  const getContainer = useCallback(() => {
    return (
      containerRef.current ||
      document.getElementById("jarvis-scheduler-container")
    );
  }, []);

  const loadJarvisScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (scriptLoadedRef.current) {
        resolve();
        return;
      }

      const existingInitScript = document.querySelector(
        'script[src*="init.min.js"]'
      );
      const existingSchedulerScript = document.querySelector(
        'script[src*="jarvis-scheduler-v2.min.js"]'
      );
      const customElementDefined = customElements.get("jarvis-scheduler-v2");

      if (
        existingInitScript &&
        (window as any).JarvisAnalyticsScheduler &&
        (customElementDefined || existingSchedulerScript)
      ) {
        scriptLoadedRef.current = true;
        resolve();
        return;
      }

      const initScript = document.createElement("script");
      initScript.src = "https://schedule.jarvisanalytics.com/js/init.min.js";
      initScript.async = true;
      initScript.defer = true;

      initScript.onload = () => {
        let attempts = 0;
        const maxAttempts = 20;
        const checkConstructor = setInterval(() => {
          attempts++;
          if ((window as any).JarvisAnalyticsScheduler) {
            clearInterval(checkConstructor);

            if (customElements.get("jarvis-scheduler-v2")) {
              scriptLoadedRef.current = true;
              resolve();
              return;
            }

            // Prevent double registration of custom element
            if (!customElements.get("jarvis-scheduler-v2")) {
              const schedulerScript = document.createElement("script");
              schedulerScript.id = "jarvis-scheduler";
              schedulerScript.src =
                "https://schedule.jarvisanalytics.com/js/jarvis-scheduler-v2.min.js";
              schedulerScript.async = true;
              schedulerScript.defer = true;

              schedulerScript.onload = () => {
                scriptLoadedRef.current = true;
                resolve();
              };

              schedulerScript.onerror = () => {
                scriptLoadedRef.current = true;
                resolve();
              };

              document.head.appendChild(schedulerScript);
            } else {
              scriptLoadedRef.current = true;
              resolve();
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(checkConstructor);
            reject(
              new Error("JarvisAnalyticsScheduler constructor not available")
            );
          }
        }, 150);
      };

      initScript.onerror = () =>
        reject(new Error("Failed to load init.min.js"));
      document.head.appendChild(initScript);
    });
  }, []);

  const initializeJarvisScheduler = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (
        (window as any).__jarvisInitialized ||
        schedulerInitializedRef.current
      ) {
        resolve();
        return;
      }

      const container = getContainer();
      if (!container) {
        setShowManualTrigger(true);
        reject(new Error("Container not found"));
        return;
      }

      // CRITICAL: Show container BEFORE initialization
      container.style.display = "block";
      container.style.visibility = "visible";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.right = "0";
      container.style.bottom = "0";
      container.style.margin = "0";
      container.style.padding = "0";

      const init = () => {
        if (!(window as any).JarvisAnalyticsScheduler) {
          setShowManualTrigger(true);
          reject(new Error("Constructor not available"));
          return;
        }

        try {
          const jarvis = new (window as any).JarvisAnalyticsScheduler({
            token: "52727|WstQGHi6U7ogt0V3YvL88pF5UsM2opZD63JeNhQ71731e6a2",
            locationId: "5915",
            companyId: "60",
            containerId: "jarvis-scheduler-container",
            colors: (window as any).jarvisFormColors || {},
            showPhoneNumber: false,
          });

          (window as any).jarvis = jarvis;
          jarvisSchedulerRef.current = jarvis;
          (window as any).__jarvisInitialized = true;
          schedulerInitializedRef.current = true;

          // UTM tracking
          const extractUTM = (paramName: string) => {
            const paramValue =
              new URLSearchParams(window.location.search).get(paramName) || "";
            return (
              paramValue ||
              document.cookie.replace(
                new RegExp(
                  `(?:(?:^|.*;\\s*)${paramName}\\s*=\\s*([^;]*).*$)|^.*$`
                ),
                "$1"
              ) ||
              ""
            );
          };

          const utmParams = [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
            "gclid",
          ];
          const isUTMPresent = utmParams.some(
            (param) => extractUTM(param).length > 0
          );

          if (isUTMPresent) {
            const utmValues = utmParams
              .map((param) => `${param}=${extractUTM(param)}`)
              .join("&");
            const fullURL = `${window.location.href}?${utmValues}`;
            jarvis.referrer = fullURL;
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            document.cookie = `referrer_url=${fullURL}; path=/; expires=${expirationDate.toUTCString()}`;
          } else {
            jarvis.referrer = extractUTM("referrer_url") || "";
          }

          // DataLayer tracking
          if (typeof jarvis.onNextStep === "function") {
            jarvis.onNextStep((event: any) => {
              if (event.event === "scheduling-success") {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({
                  event: "online_scheduler_form",
                });
              }
            });
          }

          // CRITICAL: Call render() first to create the component
          if (typeof jarvis.render === "function") {
            try {
              jarvis.render("jarvis-scheduler-container");
            } catch {
              try {
                jarvis.render({ containerId: "jarvis-scheduler-container" });
              } catch {
                jarvis.render();
              }
            }
          } else if (typeof jarvis.loadApp === "function") {
            jarvis.loadApp("jarvis-scheduler-container");
          }

          const locationTitle = new URLSearchParams(window.location.search).get(
            "location_title"
          );

          // Wait for component element to be created in DOM (optimized polling)
          let attempts = 0;
          const maxAttempts = 40;
          let pollInterval: ReturnType<typeof setInterval> | null = null;

          const checkComponent = () => {
            attempts++;
            const component = document.querySelector(
              "jarvis-scheduler-v2"
            ) as HTMLElement;

            if (component) {
              if (pollInterval) clearInterval(pollInterval);

              const container = getContainer();
              if (container && !container.contains(component)) {
                container.appendChild(component as Node);
              }

              // Style shadow DOM for visibility
              if ((component as any).shadowRoot) {
                const shadowApp = (component as any).shadowRoot.querySelector(
                  "#app"
                );
                if (shadowApp) {
                  shadowApp.style.position = "relative";
                  shadowApp.style.visibility = "visible";
                  shadowApp.style.opacity = "1";
                  shadowApp.style.display = "block";
                  shadowApp.style.zIndex = "10001";
                }

                // Ensure all content in shadow root is visible
                const shadowContent = (
                  component as any
                ).shadowRoot.querySelectorAll("*");
                shadowContent.forEach((el: HTMLElement) => {
                  if (el.style) {
                    el.style.visibility = "visible";
                    el.style.opacity = "1";
                  }
                });
              }

              // Ensure component itself is visible
              component.style.display = "block";
              component.style.visibility = "visible";
              component.style.opacity = "1";
              component.style.zIndex = "10000";
              component.style.position = "relative";

              // Set city field if location title exists
              if (locationTitle) {
                setTimeout(() => {
                  const cityField = document.querySelector(
                    "#city-field"
                  ) as HTMLInputElement;
                  if (cityField) {
                    cityField.value = locationTitle;
                  }
                }, 300);
              }

              // Wait for component to fully initialize, then call toggle()
              // Check if component property exists (indicates component is ready)
              let toggleAttempts = 0;
              const maxToggleAttempts = 10;

              const tryToggle = () => {
                toggleAttempts++;
                if (typeof jarvis.toggle === "function") {
                  // Check if component exists (means it's initialized)
                  if (jarvis.component || toggleAttempts >= maxToggleAttempts) {
                    try {
                      jarvis.toggle();

                      // After toggle, ensure modal is visible
                      setTimeout(() => {
                        // Find and ensure modal/overlay elements are visible
                        const modalElements = document.querySelectorAll(
                          '[id*="jarvis"], [class*="jarvis"], [class*="modal"], [class*="overlay"]'
                        );
                        modalElements.forEach((el: Element) => {
                          const htmlEl = el as HTMLElement;
                          htmlEl.style.display = "block";
                          htmlEl.style.visibility = "visible";
                          htmlEl.style.opacity = "1";
                          htmlEl.style.zIndex = "10000";
                        });

                        // Ensure iframes are visible
                        const iframes = document.querySelectorAll(
                          'iframe[id*="jarvis"], iframe[src*="jarvis"]'
                        );
                        iframes.forEach((iframe: Element) => {
                          const htmlIframe = iframe as HTMLElement;
                          htmlIframe.style.visibility = "visible";
                          htmlIframe.style.opacity = "1";
                          htmlIframe.style.zIndex = "10001";
                        });
                      }, 100);
                    } catch (err) {
                      logError("Error calling toggle:", err);
                    }
                  } else {
                    // Component not ready yet, try again
                    setTimeout(tryToggle, 100);
                    return;
                  }
                }
                setShowManualTrigger(false);
                resolve();
              };

              // Start trying toggle after a short delay
              setTimeout(tryToggle, 200);
            } else if (attempts >= maxAttempts) {
              if (pollInterval) clearInterval(pollInterval);
              logError("Component not found after timeout");
              setShowManualTrigger(true);
              resolve();
            }
          };

          // Start polling with optimized interval
          pollInterval = setInterval(checkComponent, 100);
        } catch (error) {
          logError("Error initializing Jarvis scheduler:", error);
          setShowManualTrigger(true);
          setJarvisError(
            error instanceof Error
              ? error.message
              : "Failed to initialize scheduler"
          );
          reject(error);
        }
      };

      // Start immediately if DOM ready, otherwise wait for DOMContentLoaded
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    });
  }, [getContainer]);

  // Function to open Jarvis scheduler popup
  const openJarvisScheduler = useCallback(async () => {
    try {
      // Load script if not already loaded
      await loadJarvisScript();

      // Initialize if not already initialized
      if (!schedulerInitializedRef.current) {
        await initializeJarvisScheduler();
      } else {
        // If already initialized, ensure container is visible and toggle it open
        const container = getContainer();
        if (container) {
          container.style.display = "block";
          container.style.visibility = "visible";
          container.style.width = "100%";
          container.style.height = "100%";
          container.style.position = "fixed";
          container.style.top = "0";
          container.style.left = "0";
          container.style.right = "0";
          container.style.bottom = "0";
          container.style.margin = "0";
          container.style.padding = "0";
        }
        const scheduler = jarvisSchedulerRef.current || (window as any).jarvis;
        if (scheduler?.toggle) {
          scheduler.toggle();
        }
      }
    } catch (error) {
      setJarvisError(
        error instanceof Error ? error.message : "Failed to load scheduler"
      );
    }
  }, [loadJarvisScript, initializeJarvisScheduler, getContainer]);

  // Expose function globally so Navbar can call it
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).openJarvisScheduler = openJarvisScheduler;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).openJarvisScheduler;
      }
    };
  }, [openJarvisScheduler]);

  const handleManualTrigger = useCallback(() => {
    const scheduler = jarvisSchedulerRef.current || (window as any).jarvis;
    if (scheduler?.toggle) {
      scheduler.toggle();
      setShowManualTrigger(false);
    }
  }, []);

  // Handle search button click
  const handleSearchClick = () => {
    if (searchLocation.trim()) {
      router.push(
        `/dental-offices?p=${encodeURIComponent(searchLocation.trim())}&miles=5`
      );
    } else {
      router.push("/dental-offices");
    }
  };

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

  // Helper functions to check section types
  const isLocationsSection = (
    section: HomePageSection
  ): section is ParagraphLocationsSection => {
    return (
      "locationCarousel" in section && Array.isArray(section.locationCarousel)
    );
  };

  const isTestimonialSection = (
    section: HomePageSection
  ): section is ParagraphTestimonialSection => {
    return (
      "testimonialCards" in section && Array.isArray(section.testimonialCards)
    );
  };

  const isInsuranceSection = (
    section: HomePageSection
  ): section is ParagraphInsuranceSection => {
    return "logosSection" in section && Array.isArray(section.logosSection);
  };

  const isOfferBannerSection = (
    section: HomePageSection
  ): section is ParagraphOfferBanner => {
    return "price" in section && "heading" in section;
  };

  const isServicesGridSection = (
    section: HomePageSection
  ): section is ParagraphServicesGrid => {
    return (
      "sectionTitle" in section &&
      "services" in section &&
      Array.isArray(section.services)
    );
  };

  // Helper to check if service is ParagraphServiceCard
  const isServiceCard = (
    service: ServiceItem
  ): service is Extract<ServiceItem, { image?: any }> => {
    return "image" in service;
  };

  // Get sections from GraphQL data
  const sections = pageData?.route?.entity?.sections || [];
  const heroSection = sections.find(isHeroSection);
  const iconCardsSection = sections.find(isIconCardsSection);
  const textImageSection = sections.find(isTextImageSection);
  const locationsSection = sections.find(isLocationsSection);
  const testimonialSection = sections.find(isTestimonialSection);
  const insuranceSection = sections.find(isInsuranceSection);
  const offerBannerSection = sections.find(isOfferBannerSection);
  const servicesGridSection = sections.find(isServicesGridSection);

  // Get dynamic locations from GraphQL data
  const locations = locationsSection?.locationCarousel || [];
  const totalPages = Math.max(1, Math.ceil(locations.length / CARDS_PER_PAGE));

  // Get dynamic testimonials from GraphQL data and group them into pairs
  const testimonialCards =
    testimonialSection?.testimonialCards?.filter((card) => card.status) || [];
  const testimonials: TestimonialCard[][] = [];
  for (let i = 0; i < testimonialCards.length; i += 2) {
    testimonials.push(testimonialCards.slice(i, i + 2));
  }
  const totalTestimonialPages = testimonials.length || 1;

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

  // Set up scroll animations
  useEffect(() => {
    if (loading) return;

    // Set initial states for animated elements
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll("article");
      set(cards, { opacity: 0, translateY: 50 });
    }

    if (servicesRef.current) {
      const grid = servicesRef.current.querySelector('[class*="ServicesGrid"]');
      const serviceCards = grid?.querySelectorAll("div[class*='ServiceCard']");
      if (serviceCards) {
        set(Array.from(serviceCards), { opacity: 0, scale: 0.8 });
      }
    }

    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll("div[role='listitem']");
      set(Array.from(stats), { opacity: 0, translateX: -30 });
    }

    if (differenceImageRef.current) {
      set(differenceImageRef.current, { opacity: 0, translateX: -50 });
    }

    if (differenceContentRef.current) {
      set(differenceContentRef.current, { opacity: 0, translateX: 50 });
    }

    if (newPatientRef.current) {
      set(newPatientRef.current, { opacity: 0, translateY: 30 });
    }

    if (testimonialsRef.current) {
      const testimonialCards = testimonialsRef.current.querySelectorAll("div[class*='TestimonialCard']");
      if (testimonialCards) {
        set(Array.from(testimonialCards), { opacity: 0, translateY: 40 });
      }
    }

    if (insuranceRef.current) {
      const logos = insuranceRef.current.querySelectorAll("div[class*='InsuranceIcon']");
      if (logos) {
        set(Array.from(logos), { opacity: 0, scale: 0.8 });
      }
    }

    if (dentistsRef.current) {
      const panels = dentistsRef.current.querySelectorAll("article");
      set(Array.from(panels), { opacity: 0, translateY: 50 });
    }

    // Animate Features Section (Icon Cards)
    if (featuresRef.current) {
      onScroll({
        target: featuresRef.current,
        onEnter: () => {
          const cards = featuresRef.current?.querySelectorAll("article");
          if (cards && cards.length > 0) {
            animate(cards, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              delay: stagger(100),
              easing: "easeOutQuad",
            });
          }
        },
        once: true,
      } as any);
    }

    // Animate Services Grid
    if (servicesRef.current) {
      onScroll({
        target: servicesRef.current,
        onEnter: () => {
          const grid = servicesRef.current?.querySelector('[class*="ServicesGrid"]');
          const serviceCards = grid?.querySelectorAll("div[class*='ServiceCard']");
          if (serviceCards && serviceCards.length > 0) {
            animate(Array.from(serviceCards), {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: 600,
              delay: stagger(100),
              easing: "easeOutBack",
            });
          }
        },
        once: true,
      } as any);
    }

    // Animate Stats Section
    if (statsRef.current) {
      onScroll({
        target: statsRef.current,
        onEnter: () => {
          const stats = statsRef.current?.querySelectorAll("div[role='listitem']");
          if (stats && stats.length > 0) {
            animate(Array.from(stats), {
              opacity: [0, 1],
              translateX: [-30, 0],
              duration: 700,
              delay: stagger(150),
              easing: "easeOutCubic",
            });
          }
        },
        once: true,
      } as any);
    }

    // Animate Difference Section Image
    if (differenceImageRef.current) {
      const differenceImage = differenceImageRef.current;
      onScroll({
        target: differenceImage,
        onEnter: () => {
          animate(differenceImage, {
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 900,
            easing: "easeOutCubic",
          });
        },
        once: true,
      } as any);
    }

    // Animate Difference Section Content
    if (differenceContentRef.current) {
      const differenceContent = differenceContentRef.current;
      onScroll({
        target: differenceContent,
        onEnter: () => {
          animate(differenceContent, {
            opacity: [0, 1],
            translateX: [50, 0],
            duration: 900,
            easing: "easeOutCubic",
          });
        },
        once: true,
      } as any);
    }

    // Animate New Patient Section
    if (newPatientRef.current) {
      const newPatient = newPatientRef.current;
      onScroll({
        target: newPatient,
        onEnter: () => {
          animate(newPatient, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: "easeOutQuad",
          });
        },
        once: true,
      } as any);
    }

    // Animate Testimonials Section
    if (testimonialsRef.current) {
      onScroll({
        target: testimonialsRef.current,
        onEnter: () => {
          const testimonialCards = testimonialsRef.current?.querySelectorAll("div[class*='TestimonialCard']");
          if (testimonialCards && testimonialCards.length > 0) {
            animate(Array.from(testimonialCards), {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 700,
              delay: stagger(150),
              easing: "easeOutQuad",
            });
          }
        },
        once: true,
      } as any);
    }

    // Animate Insurance Logos
    if (insuranceRef.current) {
      onScroll({
        target: insuranceRef.current,
        onEnter: () => {
          const logos = insuranceRef.current?.querySelectorAll("div[class*='InsuranceIcon']");
          if (logos && logos.length > 0) {
            animate(Array.from(logos), {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: 500,
              delay: stagger(50),
              easing: "easeOutBack",
            });
          }
        },
        once: true,
      } as any);
    }

    // Animate Dentists Section
    if (dentistsRef.current) {
      onScroll({
        target: dentistsRef.current,
        onEnter: () => {
          const panels = dentistsRef.current?.querySelectorAll("article");
          if (panels && panels.length > 0) {
            animate(Array.from(panels), {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              delay: stagger(150),
              easing: "easeOutQuad",
            });
          }
        },
        once: true,
      } as any);
    }
  }, [loading]);

  // Don't render content while loading - Next.js will show loading.tsx automatically
  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main id="main-content">
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
            aria-label="Hero banner"
          >
            <div className={styles.BannerContent}>
              <h1 className={styles.BannerTitle}>
                {heroSection.headingSmall || "Quality Dental Care is"}
              </h1>
              <p className={styles.BannerSubtitle}>
                {heroSection.headingLarge
                  ? heroSection.headingLarge
                      .replace(/\s+/g, " ")
                      .split(" ")
                      .map((word, index, array) => {
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
              <div className={styles.SearchBar} role="search" aria-label="Find a dental office">
                <div className={styles.SearchInputWrapper}>
                  <label htmlFor="hero-location-search" className="sr-only">
                    Search by City, State or ZIP code
                  </label>
                  <Image
                    src="https://www.gentledental.com/themes/custom/gentledentaldptheme/images/location.svg"
                    alt=""
                    className={styles.LocationIcon}
                    width={100}
                    height={100}
                    quality={95}
                    unoptimized
                    aria-hidden="true"
                  />
                  <input
                    id="hero-location-search"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearchClick();
                      }
                    }}
                    placeholder={
                      heroSection.searchPlaceholder ||
                      "Search by City, State or ZIP code"
                    }
                    className={styles.SearchInput}
                    aria-label="Search by City, State or ZIP code"
                  />
                </div>
                <button
                  className={styles.SearchButton}
                  onClick={handleSearchClick}
                  aria-label="Search for dental offices"
                >
                  {heroSection.ctaText || "SEARCH"}
                </button>
              </div>
            </div>
          </section>
        )}
        {iconCardsSection &&
          iconCardsSection.cards &&
          iconCardsSection.cards.length > 0 && (
            <section ref={featuresRef} className={styles.FeaturesSection} aria-label="Features">
              <div className={styles.FeaturesContainer} role="list">
                {iconCardsSection.cards.map((card, index) => (
                  <article
                    key={card.icontitle || index}
                    className={index === 0 ? styles.FeatureCardWrapper : ""}
                    role="listitem"
                  >
                    <div className={styles.FeatureCard}>
                      <h2 className={styles.FeatureTitle}>{card.icontitle}</h2>
                      {card.icon?.mediaImage?.url && (
                        <div className={styles.FeatureIcon} aria-hidden="true">
                          <Image
                            src={card.icon.mediaImage.url}
                            alt=""
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
                  </article>
                ))}
              </div>
            </section>
          )}
        {textImageSection && (
          <section className={styles.DifferenceSection} aria-labelledby="difference-heading">
            <div className={styles.DifferenceContainer}>
              {textImageSection.image?.mediaImage?.url && (
                <div ref={differenceImageRef} className={styles.DifferenceImage}>
                  <Image
                    src={textImageSection.image.mediaImage.url}
                    alt={
                      textImageSection.image.mediaImage.alt ||
                      textImageSection.heading ||
                      "Patient care illustration"
                    }
                    width={400}
                    height={600}
                    className={styles.PatientImage}
                    quality={95}
                    unoptimized={false}
                  />
                </div>
              )}
              <div ref={differenceContentRef} className={styles.DifferenceContent}>
                <h2 id="difference-heading" className={styles.DifferenceTitle}>
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
                {textImageSection.stats &&
                  textImageSection.stats.length > 0 && (
                    <div ref={statsRef} className={styles.StatisticsContainer} role="list" aria-label="Statistics">
                      {textImageSection.stats.map((stat, index) => (
                        <div key={index} className={styles.Statistic} role="listitem">
                          <div className={styles.StatisticNumber} aria-label={stat.number}>
                            <AnimatedNumber value={stat.number} />
                          </div>
                          <div className={styles.StatisticLabel}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                {textImageSection.ctaText && (
                  <button className={styles.LearnMoreButton} aria-label={textImageSection.ctaText}>
                    {textImageSection.ctaLink?.url ? (
                      <a
                        href={textImageSection.ctaLink.url}
                        style={{ textDecoration: "none", color: "inherit" }}
                        aria-label={textImageSection.ctaLink.title || textImageSection.ctaText}
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
        {servicesGridSection &&
          servicesGridSection.services &&
          servicesGridSection.services.length > 0 && (
            <section ref={servicesRef} className={styles.ServicesSection} aria-labelledby="services-heading">
              <div className={styles.ServicesContainer}>
                <div className={styles.ServicesHeader}>
                  <h2 id="services-heading" className={styles.ServicesTitle}>
                    {servicesGridSection.sectionTitle || "Our Services"}
                  </h2>
                  <p className={styles.ServicesDescription}>
                    Gentle Dental dentists provide award-winning care. From
                    cleanings and exams to more specialized services such as
                    root canals and crowns, we provide all dental services under
                    one roof saving you time and money. All Gentle Dental
                    practices offer orthodontics for both adults and children
                    including traditional braces and Invisalign® clear aligners.
                  </p>
                  <button className={styles.ViewAllServicesButton}>
                    VIEW ALL SERVICES
                  </button>
                </div>
                <div className={styles.ServicesGrid}>
                  {servicesGridSection.services.map((service, index) => {
                    if (
                      isServiceCard(service) &&
                      service.image?.mediaImage?.url
                    ) {
                      return (
                        <div
                          key={service.id || index}
                          className={styles.ServiceCard}
                        >
                          <div className={styles.ServiceImageWrapper}>
                            <Image
                              src={service.image.mediaImage.url}
                              alt={
                                service.image.mediaImage.alt ||
                                service.title?.value ||
                                "Service"
                              }
                              width={400}
                              height={300}
                              className={styles.ServiceImage}
                              quality={95}
                            />
                            <div className={styles.ServiceBottomOverlay}>
                              <h3 className={styles.ServiceCardTitle}>
                                {service.title?.value || "Service"}
                              </h3>
                            </div>
                            <div className={styles.ServiceOverlay}>
                              <h3 className={styles.ServiceCardTitle}>
                                {service.title?.value || "Service"}
                              </h3>
                              <p className={styles.ServiceCardDescription}>
                                Routine dental checkups are important for a
                                healthy and confident smile.
                              </p>
                              <a href="#" className={styles.ServiceLearnMore} aria-label={`Learn more about ${service.title?.value || "service"}`}>
                                LEARN MORE &gt;
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </section>
          )}
        <section ref={newPatientRef} className={styles.NewPatientSection} aria-labelledby="new-patient-heading">
          <div className={styles.NewPatientBanner}>
            <div className={styles.NewPatientLeft}>
              <h2 id="new-patient-heading" className={styles.NewPatientTitle}>
                {offerBannerSection?.heading || "WELCOMING NEW PATIENTS"}
              </h2>
              <p className={styles.NewPatientDescription}>
                {offerBannerSection?.description?.value ||
                  "We're proud to always welcome patients into our practices. " +
                    "Whether you're new to town, need to restart your dental " +
                    "care, or are looking for a more convenient dentist, our New " +
                    "Patient Offer is a great introduction to our practice. New " +
                    "patients receive an exam, all necessary x-rays, a cleaning, and " +
                    "a personalized treatment plan for $79."}
              </p>
            </div>
            <div className={styles.NewPatientRight}>
              {offerBannerSection?.price && (
                <div className={styles.OfferPriceContainer}>
                  <div className={styles.OfferPrice}>
                    <AnimatedNumber value={offerBannerSection.price} startValue="$100" />
                  </div>
                  <div className={styles.OfferDetails}>
                    <div className={styles.OfferDetailItem}>EXAM</div>
                    <div className={styles.OfferDetailItem}>X-RAYS</div>
                    <div className={styles.OfferDetailItem}>CLEANING</div>
                    <div className={styles.OfferDetailItem}>TREATMENT PLAN</div>
                  </div>
                </div>
              )}
              {!offerBannerSection?.price && (
                <div className={styles.OfferPriceContainer}>
                  <div className={styles.OfferPrice}>
                    <AnimatedNumber value="$79" startValue="$100" />
                  </div>
                  <div className={styles.OfferDetails}>
                    <div className={styles.OfferDetailItem}>EXAM</div>
                    <div className={styles.OfferDetailItem}>X-RAYS</div>
                    <div className={styles.OfferDetailItem}>CLEANING</div>
                    <div className={styles.OfferDetailItem}>TREATMENT PLAN</div>
                  </div>
                </div>
              )}
              <div className={styles.OfferValue}>A $400+ VALUE</div>
              {offerBannerSection?.ctaText &&
                (offerBannerSection.ctaLink?.url ? (
                  <a
                    href={offerBannerSection.ctaLink.url}
                    className={styles.NewPatientLearnMoreButton}
                    aria-label={offerBannerSection.ctaLink.title || offerBannerSection.ctaText}
                  >
                    {offerBannerSection.ctaText}
                  </a>
                ) : (
                  <button className={styles.NewPatientLearnMoreButton} aria-label={offerBannerSection.ctaText}>
                    {offerBannerSection.ctaText}
                  </button>
                ))}
              {!offerBannerSection?.ctaText && (
                <button className={styles.NewPatientLearnMoreButton} aria-label="Learn more about new patient offer">
                  LEARN MORE
                </button>
              )}
            </div>
          </div>
          <div className={styles.ViewAllOffersContainer}>
            <button className={styles.ViewAllOffersButton} aria-label="View all special offers">
              VIEW ALL OFFERS
            </button>
          </div>
        </section>
        {locations.length > 0 && (
          <section className={styles.LocationsSection} aria-labelledby="locations-heading">
            <div className={styles.LocationsContainer}>
              <h2 id="locations-heading" className={styles.LocationsTitle}>Locations</h2>
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
              <div className={styles.LocationsCarousel} role="region" aria-label="Locations carousel">
                <div className={styles.CarouselContent}>
                  <div
                    className={styles.CarouselTrack}
                    style={{
                      transform: `translateX(-${currentPage * 100}%)`,
                    }}
                    role="list"
                    aria-live="polite"
                    aria-atomic="false"
                  >
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <div key={pageIndex} className={styles.CarouselPage}>
                        {locations
                          .slice(
                            pageIndex * CARDS_PER_PAGE,
                            pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE
                          )
                          .map((location, idx) => (
                            <article
                              key={location.locationCard || idx}
                              className={styles.LocationCard}
                              role="listitem"
                            >
                              <div className={styles.LocationImageWrapper}>
                                {location.image?.mediaImage?.url && (
                                  <Image
                                    src={location.image.mediaImage.url}
                                    alt={
                                      location.image.mediaImage.alt ||
                                      location.locationCard ||
                                      "Location"
                                    }
                                    width={400}
                                    height={300}
                                    className={styles.LocationImage}
                                    quality={95}
                                  />
                                )}
                                <div className={styles.LocationOverlay}>
                                  <h3 className={styles.LocationName}>
                                    {location.locationCard || "Location"}
                                  </h3>
                                  <a
                                    href={location.link?.url || "#"}
                                    className={styles.LocationLearnMore}
                                    aria-label={`Learn more about ${location.locationCard || "location"}`}
                                  >
                                    LEARN MORE &gt;
                                  </a>
                                </div>
                              </div>
                            </article>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.CarouselDots} role="tablist" aria-label="Location carousel pages">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.Dot} ${
                      index === currentPage ? styles.DotActive : ""
                    }`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to page ${index + 1} of ${totalPages}`}
                    aria-selected={index === currentPage}
                    role="tab"
                  />
                ))}
              </div>
              {locationsSection?.ctaText && (
                <div className={styles.SeeAllLocationsContainer}>
                  {locationsSection.ctaLink?.url ? (
                    <a
                      href={locationsSection.ctaLink.url}
                      className={styles.SeeAllLocationsButton}
                      aria-label={locationsSection.ctaLink.title || locationsSection.ctaText}
                    >
                      {locationsSection.ctaText}
                    </a>
                  ) : (
                    <button className={styles.SeeAllLocationsButton} aria-label={locationsSection.ctaText}>
                      {locationsSection.ctaText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
        <section ref={dentistsRef} className={styles.DentistsSection} aria-labelledby="dentists-heading">
          <div className={styles.DentistsContainer}>
            <h2 id="dentists-heading" className={styles.DentistsTitle}>Our Gentle Dental Dentists</h2>
            <div className={styles.DentistsGrid} role="list">
              <article className={styles.DentistPanel} role="listitem">
                <div className={styles.DentistImageWrapper}>
                  <Image
                    src="/assets/images/boston-university-awards.webp"
                    alt="Boston University dental school awards"
                    width={200}
                    height={200}
                    className={styles.DentistImage}
                    quality={95}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <p className={styles.DentistText}>
                  Dentists at Gentle Dental are graduates of top universities
                  including Harvard, Tufts, Boston University, and UCONN.
                </p>
              </article>
              <article className={styles.DentistPanel} role="listitem">
                <div className={styles.DentistImageWrapper}>
                  <Image
                    src="/assets/images/top-dentist-home-page.webp"
                    alt="Gentle Dental dentists recognized as Top Dentists"
                    width={400}
                    height={300}
                    className={styles.DentistImage}
                    quality={95}
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
              </article>
              <article className={styles.DentistPanel} role="listitem">
                <div className={styles.DentistImageWrapper}>
                  <Image
                    src="/assets/images/readers-choice-2020.webp"
                    alt="Readers Choice Awards 2020"
                    width={200}
                    height={200}
                    className={styles.DentistImage}
                    quality={95}
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
              </article>
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
                quality={95}
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
                      src="/assets/images/envelope.png"
                      alt="Email"
                      width={20}
                      height={20}
                      className={styles.MailIcon}
                      quality={95}
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
        {testimonialSection &&
          testimonialSection.testimonialCards &&
          testimonialSection.testimonialCards.length > 0 && (
            <section ref={testimonialsRef} className={styles.TestimonialsSection}>
              <div className={styles.TestimonialsContainer}>
                <h2 className={styles.TestimonialsTitle}>
                  {testimonialSection.title?.value || "Hear From Our Patients"}
                </h2>
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
                        transform: `translateX(-${
                          currentTestimonialPage * 100
                        }%)`,
                      }}
                    >
                      {testimonials.map((testimonialPair, pageIndex) => (
                        <div
                          key={pageIndex}
                          className={styles.TestimonialsPage}
                        >
                          {testimonialPair.map((testimonial, idx) => (
                            <div
                              key={`${testimonial.name}-${idx}`}
                              className={styles.TestimonialCard}
                            >
                              <h3 className={styles.TestimonialName}>
                                {testimonial.name}
                              </h3>
                              {testimonial.rating !== null &&
                                testimonial.rating !== undefined && (
                                  <div className={styles.TestimonialStars}>
                                    {Array.from({
                                      length: testimonial.rating,
                                    }).map((_, i) => (
                                      <span key={i} className={styles.Star}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                )}
                              <p className={styles.TestimonialText}>
                                {testimonial.review}
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
                {totalTestimonialPages > 1 && (
                  <div className={styles.TestimonialDots}>
                    {Array.from({ length: totalTestimonialPages }).map(
                      (_, index) => (
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
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        {insuranceSection &&
          insuranceSection.logosSection &&
          insuranceSection.logosSection.length > 0 && (
            <section ref={insuranceRef} className={styles.InsuranceSection}>
              <div className={styles.InsuranceContainer}>
                <h2 className={styles.InsuranceTitle}>Insurances Accepted</h2>
                <div className={styles.InsuranceIconsGrid}>
                  {insuranceSection.logosSection
                    .reduce<InsuranceLogo[][]>((rows, logo, index) => {
                      let rowIndex: number;
                      if (index < 5) {
                        // First row: 5 icons (indices 0-4)
                        rowIndex = 0;
                      } else if (index < 10) {
                        // Second row: 5 icons (indices 5-9)
                        rowIndex = 1;
                      } else {
                        // Third row and beyond: remaining icons
                        rowIndex = 2;
                      }
                      if (!rows[rowIndex]) {
                        rows[rowIndex] = [];
                      }
                      rows[rowIndex].push(logo);
                      return rows;
                    }, [])
                    .map((row, rowIndex) => (
                      <div key={rowIndex} className={styles.InsuranceRow}>
                        {row.map((logoItem, idx) => (
                          <div
                            key={logoItem.logo.name || idx}
                            className={styles.InsuranceIcon}
                          >
                            {logoItem.logo.mediaImage?.url ? (
                              <Image
                                src={logoItem.logo.mediaImage.url}
                                alt={
                                  logoItem.logo.mediaImage.alt ||
                                  logoItem.logo.name ||
                                  "Insurance Logo"
                                }
                                width={150}
                                height={80}
                                quality={95}
                                style={{
                                  objectFit: "contain",
                                  maxWidth: "100%",
                                  height: "auto",
                                }}
                              />
                            ) : (
                              <div className={styles.InsuranceIconPlaceholder}>
                                {logoItem.logo.name ||
                                  `Icon ${
                                    rowIndex < 2
                                      ? rowIndex * 5 + idx + 1
                                      : 10 + idx + 1
                                  }`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
                {insuranceSection.description?.value && (
                  <p className={styles.InsuranceDescription}>
                    {insuranceSection.description.value}
                  </p>
                )}
                {!insuranceSection.description?.value && (
                  <p className={styles.InsuranceDescription}>
                    We are in-network providers with most major dental insurance companies. Call us to confirm coverage.
                  </p>
                )}
                {insuranceSection.ctaText &&
                  (insuranceSection.ctaLink?.url ? (
                    <a
                      href={insuranceSection.ctaLink.url}
                      className={styles.InsuranceLearnMoreButton}
                    >
                      {insuranceSection.ctaText}
                    </a>
                  ) : (
                    <button className={styles.InsuranceLearnMoreButton}>
                      {insuranceSection.ctaText}
                    </button>
                  ))}
                {!insuranceSection.ctaText && (
                  <button className={styles.InsuranceLearnMoreButton}>
                    LEARN MORE
                  </button>
                )}
              </div>
            </section>
          )}
      </main>
      {/* <div className={styles.MobileStickySection}>
        <div className={styles.MobileStickyDivider}></div>
        <div className={styles.MobileStickyContent}>
          <button className={styles.MobileStickyButton}>FIND A LOCATION</button>
          <button
            className={styles.MobileStickyButton}
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                (window as any).openJarvisScheduler
              ) {
                (window as any).openJarvisScheduler();
              }
            }}
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div> */}
      <Footer />
      {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className={styles.scrollToTop}
            aria-label="Scroll to top of page"
            title="Scroll to top"
          >
            <i className="fa fa-chevron-up" aria-hidden="true"></i>
          </button>
      )}
      {/* Jarvis Scheduler Container - Hidden by default */}
      <div
        ref={containerRef}
        className={styles.jarvisSchedulerWrapper}
        id="jarvis-scheduler-container"
        style={{
          display: "none",
          width: "0",
          height: "0",
          margin: "0",
          padding: "0",
        }}
      />
      {jarvisError && (
        <div className={styles.jarvisErrorMessage} role="alert" aria-live="assertive">
          <strong>Unable to load appointment scheduler</strong>
          <br />
          {jarvisError}
        </div>
      )}
      {!jarvisError && showManualTrigger && (
        <div className={styles.jarvisManualTrigger} role="status" aria-live="polite">
          <p>The scheduler is ready but may need to be opened manually.</p>
          <button onClick={handleManualTrigger} aria-label="Open appointment scheduler">
            Open Appointment Scheduler
          </button>
        </div>
      )}
    </>
  );
}
