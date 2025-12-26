"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./appointment.module.css";
import { AppointmentSchedulerSkeleton } from "../Skeleton/Skeleton";

// Global flag to prevent multiple scheduler initializations (React StrictMode protection)
let globalSchedulerInitialized = false;

const AppointmentPage = () => {
  const jarvisSchedulerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Prevent multiple initializations
    if (globalSchedulerInitialized || (window as any).__jarvisInitialized) {
      console.log("Jarvis scheduler already initialized");
      setIsLoading(false);
      return;
    }

    const initializeJarvis = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // STEP 1: Load init.min.js (creates JarvisAnalyticsScheduler constructor)
        const loadInitScript = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            // Check if already loaded
            if ((window as any).JarvisAnalyticsScheduler) {
              console.log("JarvisAnalyticsScheduler constructor already available");
              resolve();
              return;
            }

            // Check if script already exists
            const existingScript = document.querySelector('script[src*="init.min.js"]');
            if (existingScript) {
              console.log("init.min.js already in DOM, waiting for constructor...");
              // Wait for constructor to be available
              let attempts = 0;
              const checkConstructor = setInterval(() => {
                attempts++;
                if ((window as any).JarvisAnalyticsScheduler) {
                  clearInterval(checkConstructor);
                  resolve();
                } else if (attempts >= 50) {
                  clearInterval(checkConstructor);
                  reject(new Error("JarvisAnalyticsScheduler constructor not available"));
                }
              }, 100);
              return;
            }

            console.log("Loading init.min.js...");
            const initScript = document.createElement("script");
            initScript.src = "https://schedule.jarvisanalytics.com/js/init.min.js";
            initScript.async = false; // Load synchronously

            initScript.onload = () => {
              console.log("init.min.js loaded successfully");
              // Wait for constructor to be available
              let attempts = 0;
              const checkConstructor = setInterval(() => {
                attempts++;
                if ((window as any).JarvisAnalyticsScheduler) {
                  clearInterval(checkConstructor);
                  console.log("JarvisAnalyticsScheduler constructor found");
                  resolve();
                } else if (attempts >= 50) {
                  clearInterval(checkConstructor);
                  reject(new Error("JarvisAnalyticsScheduler constructor not available after init.min.js loaded"));
                }
              }, 100);
            };

            initScript.onerror = () => {
              reject(new Error("Failed to load init.min.js"));
            };

            document.head.appendChild(initScript);
          });
        };

        // Load init.min.js and wait for constructor
        await loadInitScript();

        // STEP 2: Create jarvis instance (like your script pattern)
        console.log("Creating JarvisAnalyticsScheduler instance...");
        const jarvis = new (window as any).JarvisAnalyticsScheduler({
          token: "52727|WstQGHi6U7ogt0V3YvL88pF5UsM2opZD63JeNhQ71731e6a2",
          locationId: "5915",
          companyId: "60",
          colors: (window as any).jarvisFormColors || {},
          showPhoneNumber: false,
        });

        // Store as global (like reference HTML expects)
        (window as any).jarvis = jarvis;
        jarvisSchedulerRef.current = jarvis;
        (window as any).jarvisScheduler = jarvis;

        console.log("Jarvis scheduler instance created");

        // STEP 3: Set up UTM tracking (like reference HTML lines 2-29)
        const extractUTM = (paramName: string) => {
          const paramValue = new URLSearchParams(window.location.search).get(paramName) || '';
          return paramValue || document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${paramName}\\s*=\\s*([^;]*).*$)|^.*$`), "$1") || '';
        };

        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
        const isUTMPresent = utmParams.some(param => extractUTM(param).length > 0);

        if (isUTMPresent) {
          const utmValues = utmParams.map(param => `${param}=${extractUTM(param)}`).join('&');
          const fullURL = `${window.location.href}?${utmValues}`;
          jarvis.referrer = fullURL;
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          const expires = expirationDate.toUTCString();
          document.cookie = `referrer_url=${fullURL}; path=/; expires=${expires}`;
        } else {
          jarvis.referrer = extractUTM('referrer_url') || '';
        }

        // STEP 4: Set up dataLayer tracking (like reference HTML lines 21-29)
        const dataLayerPush = (event: any) => {
          console.log(event.event);
          if (event.event == 'scheduling-success') {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({'event': 'online_scheduler_form'});
            console.log((window as any).dataLayer, 'jarvis.referrer', jarvis);
          }
        };

        if (typeof jarvis.onNextStep === 'function') {
          jarvis.onNextStep(dataLayerPush);
        }

        // STEP 5: Load jarvis-scheduler-v2.min.js (like reference HTML line 78)
        const loadSchedulerScript = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            // Check if already loaded
            const existingScript = document.querySelector('script[id="jarvis-scheduler"], script[src*="jarvis-scheduler-v2.min.js"]');
            if (existingScript) {
              console.log("jarvis-scheduler-v2.min.js already in DOM");
              resolve();
              return;
            }

            console.log("Loading jarvis-scheduler-v2.min.js...");
            const schedulerScript = document.createElement("script");
            schedulerScript.id = "jarvis-scheduler";
            schedulerScript.src = "https://schedule.jarvisanalytics.com/js/jarvis-scheduler-v2.min.js";
            schedulerScript.async = true; // Load asynchronously (like reference HTML)

            schedulerScript.onload = () => {
              console.log("jarvis-scheduler-v2.min.js loaded successfully");
              resolve();
            };

            schedulerScript.onerror = () => {
              reject(new Error("Failed to load jarvis-scheduler-v2.min.js"));
            };

            document.head.appendChild(schedulerScript);
          });
        };

        await loadSchedulerScript();

        // STEP 6: Set up window load handler (like reference HTML lines 31-51)
        const handleWindowLoad = () => {
          console.log("Window loaded, initializing scheduler UI...");

          const jarvis = (window as any).jarvis || jarvisSchedulerRef.current;
          if (!jarvis) {
            console.error("jarvis object not found");
            setIsLoading(false);
            setShowManualTrigger(true);
            return;
          }

          // Get location title from URL (like reference HTML lines 33-39)
          const urlParams = new URLSearchParams(window.location.search);
          const locationTitle = urlParams.get('location_title');

          // Toggle the Jarvis widget (like reference HTML line 41)
          if (typeof jarvis.toggle === 'function') {
            console.log("Toggling scheduler...");
            try {
              jarvis.toggle();
            } catch (err) {
              console.error("Error toggling scheduler:", err);
            }
          }

          // Access shadow DOM and adjust positioning (like reference HTML lines 43-49)
          setTimeout(() => {
            const component = document.querySelector("jarvis-scheduler-v2");
            if (component && (component as any).shadowRoot) {
              const shadowApp = (component as any).shadowRoot.querySelector("#app");
              if (shadowApp) {
                shadowApp.style.position = "relative";
                console.log("Shadow DOM accessed and styled");
              }
            }

            // Set city field if location title exists (like reference HTML lines 36-39)
            if (locationTitle) {
              const cityField = document.querySelector('#city-field') as HTMLInputElement;
              if (cityField) {
                cityField.value = locationTitle;
                console.log("City field set to:", locationTitle);
              }
            }

            setIsLoading(false);
            setShowManualTrigger(false);
          }, 100);
        };

        // Mark as initialized
        globalSchedulerInitialized = true;
        (window as any).__jarvisInitialized = true;

        // Wait for window load (like reference HTML line 31)
        if (document.readyState === 'complete') {
          handleWindowLoad();
        } else {
          window.addEventListener('load', handleWindowLoad);
        }

      } catch (error) {
        console.error("Error initializing Jarvis scheduler:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load appointment scheduler. Please try again later."
        );
        setIsLoading(false);
        setShowManualTrigger(true);
      }
    };

    // Small delay to ensure router is initialized
    const timer = setTimeout(() => {
      initializeJarvis();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleManualTrigger = () => {
    const scheduler = jarvisSchedulerRef.current || (window as any).jarvis || (window as any).jarvisScheduler;
    if (!scheduler) {
      console.error("Scheduler not available");
      return;
    }

    console.log("Attempting to manually trigger scheduler...");

    if (typeof scheduler.toggle === 'function') {
      console.log("Calling toggle()...");
      try {
        scheduler.toggle();
        console.log("toggle() called successfully");
        setIsLoading(false);
        setShowManualTrigger(false);
      } catch (err) {
        console.error("Error calling toggle():", err);
      }
    } else {
      console.error("toggle() method not available on scheduler");
    }
  };

  return (
    <div className={styles.appointmentPage}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Book Your Appointment</h1>
          <p className={styles.subtitle}>
            Schedule your visit with Gentle Dental. Choose a convenient date and
            time that works for you.
          </p>
          <div className={styles.instructions}>
            <div className={styles.instructionItem}>
              <div className={styles.instructionNumber}>1</div>
              <div>Select your preferred date and time from the calendar</div>
            </div>
            <div className={styles.instructionItem}>
              <div className={styles.instructionNumber}>2</div>
              <div>Fill in your contact information (name and email)</div>
            </div>
            <div className={styles.instructionItem}>
              <div className={styles.instructionNumber}>3</div>
              <div>Choose the service or reason for your visit</div>
            </div>
            <div className={styles.instructionItem}>
              <div className={styles.instructionNumber}>4</div>
              <div>Confirm your appointment and receive a confirmation</div>
            </div>
          </div>
        </div>

        {/* Scheduler Container */}
        <div className={styles.schedulerContainer}>
          {isLoading && <AppointmentSchedulerSkeleton />}
          {error && (
            <div className={styles.errorMessage}>
              <strong>Unable to load appointment scheduler</strong>
              <br />
              {error}
              <br />
              <br />
              <strong>Possible reasons:</strong>
              <ul style={{ textAlign: "left", marginTop: "10px" }}>
                <li>Network connection issue</li>
                <li>Browser extension blocking the script</li>
                <li>Content Security Policy restrictions</li>
                <li>Script server temporarily unavailable</li>
              </ul>
              <br />
              Please try:
              <ul style={{ textAlign: "left", marginTop: "10px" }}>
                <li>Refreshing the page</li>
                <li>Disabling browser extensions</li>
                <li>Checking your network connection</li>
                <li>Contacting us directly to schedule your appointment</li>
              </ul>
            </div>
          )}
          {/* Container must always exist in DOM */}
          <div
            className={styles.schedulerWrapper}
            id="jarvis-scheduler-container"
            style={{ display: isLoading || error ? "none" : "block" }}
          />
          {!error && showManualTrigger && !isLoading && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p style={{ marginBottom: "10px", color: "#666" }}>
                The scheduler is ready but may need to be opened manually.
              </p>
              <button
                onClick={handleManualTrigger}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ab4399",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#8b2d7a";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#ab4399";
                }}
              >
                Open Appointment Scheduler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
