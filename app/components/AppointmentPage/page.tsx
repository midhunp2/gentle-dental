"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./appointment.module.css";
import { AppointmentSchedulerSkeleton } from "../Skeleton/Skeleton";

// Global flag to prevent multiple scheduler initializations (React StrictMode protection)
let globalSchedulerInitialized = false;

const AppointmentPage = () => {
  const scriptLoadedRef = useRef(false);
  const schedulerInitializedRef = useRef(false);
  const jarvisSchedulerRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  const loadJarvisScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Check if scripts are already loaded
      if (scriptLoadedRef.current) {
        console.log("Jarvis scripts already loaded");
        resolve();
        return;
      }

      // Check if scripts already exist in DOM
      const existingInitScript = document.querySelector('script[src*="init.min.js"]');
      const existingSchedulerScript = document.querySelector('script[src*="jarvis-scheduler-v2.min.js"], script[id="jarvis-scheduler"]');
      
      // Check if custom element is already defined (prevents re-registration error)
      const customElementDefined = customElements.get('jarvis-scheduler-v2');
      
      if (existingInitScript && (window as any).JarvisAnalyticsScheduler) {
        console.log("Jarvis scripts found in DOM and jarvis object exists");
        // If custom element is already defined, we're good
        if (customElementDefined || existingSchedulerScript) {
          scriptLoadedRef.current = true;
          resolve();
          return;
        }
      }

      console.log("Loading Jarvis Analytics scripts...");
      
      // STEP 1: Load init.min.js first (creates JarvisAnalyticsScheduler constructor)
      const initScript = document.createElement("script");
      initScript.src = "https://schedule.jarvisanalytics.com/js/init.min.js";
      initScript.async = false; // Load synchronously to ensure order
      
      initScript.onload = () => {
        console.log("init.min.js loaded successfully");
        
        // STEP 2: Wait for JarvisAnalyticsScheduler constructor to be available
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds
        
        const checkConstructor = setInterval(() => {
          attempts++;
          if ((window as any).JarvisAnalyticsScheduler) {
            clearInterval(checkConstructor);
            console.log("JarvisAnalyticsScheduler constructor found");
            
            // STEP 3: Load jarvis-scheduler-v2.min.js (creates custom element)
            // Check if custom element is already defined (prevents error)
            if (customElements.get('jarvis-scheduler-v2')) {
              console.log("jarvis-scheduler-v2 custom element already defined");
              scriptLoadedRef.current = true;
              resolve();
              return;
            }
            
            // Check if script already exists in DOM
            if (existingSchedulerScript) {
              console.log("jarvis-scheduler-v2.min.js already in DOM");
              scriptLoadedRef.current = true;
              resolve();
              return;
            }
            
            // Suppress custom element re-registration errors
            const originalDefine = customElements.define.bind(customElements);
            customElements.define = function(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
              if (name === 'jarvis-scheduler-v2' && customElements.get(name)) {
                console.log("jarvis-scheduler-v2 custom element already defined, skipping re-registration");
                return;
              }
              return originalDefine(name, constructor, options);
            };
            
            const schedulerScript = document.createElement("script");
            schedulerScript.id = "jarvis-scheduler";
            schedulerScript.src = "https://schedule.jarvisanalytics.com/js/jarvis-scheduler-v2.min.js";
            schedulerScript.async = true;
            
            schedulerScript.onload = () => {
              console.log("jarvis-scheduler-v2.min.js loaded successfully");
              scriptLoadedRef.current = true;
              // Restore original define after a short delay
              setTimeout(() => {
                customElements.define = originalDefine;
              }, 1000);
              resolve();
            };
            
            schedulerScript.onerror = (error) => {
              console.error("Failed to load jarvis-scheduler-v2.min.js:", error);
              // Restore original define
              customElements.define = originalDefine;
              // Still resolve because init.min.js loaded and constructor exists
              console.log("Continuing without jarvis-scheduler-v2.min.js - constructor is available");
              scriptLoadedRef.current = true;
              resolve();
            };
            
            document.head.appendChild(schedulerScript);
          } else if (attempts >= maxAttempts) {
            clearInterval(checkConstructor);
            reject(new Error("JarvisAnalyticsScheduler constructor not available after init.min.js loaded"));
          }
        }, 100);
      };
      
      initScript.onerror = (error) => {
        console.error("Failed to load init.min.js:", error);
        reject(new Error("Failed to load init.min.js. Please check your network connection."));
      };
      
      document.head.appendChild(initScript);
    });
  };

  const initializeJarvisScheduler = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Prevent multiple initializations (React StrictMode + Fast Refresh protection)
      if ((window as any).__jarvisInitialized || globalSchedulerInitialized || schedulerInitializedRef.current) {
        console.log("Jarvis scheduler already initialized globally");
        resolve();
        return;
      }

      // CRITICAL: Ensure container exists in DOM before initialization
      const container = document.getElementById("jarvis-scheduler-container");
      if (!container) {
        console.error("Jarvis container not found - container must exist before initialization");
        setIsLoading(false);
        setShowManualTrigger(true);
        reject(new Error("Jarvis container element not found in DOM"));
        return;
      }

      console.log("Container found, initializing scheduler...");

      // Wait for full page load (like reference HTML does)
      const handlePageLoad = () => {
        console.log("Page fully loaded, creating scheduler instance...");
        
        try {
          // Check constructor is available
          if (!(window as any).JarvisAnalyticsScheduler) {
            console.error("JarvisAnalyticsScheduler constructor not available");
            setIsLoading(false);
            setShowManualTrigger(true);
            reject(new Error("JarvisAnalyticsScheduler constructor not available"));
            return;
          }

          // Create scheduler instance with containerId (CRITICAL for component mounting)
          const jarvis = new (window as any).JarvisAnalyticsScheduler({
            token: "52727|WstQGHi6U7ogt0V3YvL88pF5UsM2opZD63JeNhQ71731e6a2",
            locationId: "5915",
            companyId: "60",
            containerId: "jarvis-scheduler-container", // CRITICAL: Must match the container ID
            colors: (window as any).jarvisFormColors || {},
            showPhoneNumber: false,
          });
          
          // Store as global (like reference HTML expects)
          (window as any).jarvis = jarvis;
          jarvisSchedulerRef.current = jarvis;
          (window as any).jarvisScheduler = jarvis;
          
          // Mark as initialized (Fast Refresh safe)
          (window as any).__jarvisInitialized = true;
          globalSchedulerInitialized = true;
          schedulerInitializedRef.current = true;

        console.log("Jarvis scheduler instance created");
        console.log("Checking for mount methods...");
        
        // CRITICAL: Check for and call mount method
        // toggle() does NOT mount - it only opens an already-mounted component
        let mountCalled = false;
        
        // Check available methods on the jarvis instance
        const availableMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(jarvis));
        console.log("Available methods on jarvis:", availableMethods);
        
        // Try render() first (most common)
        if (typeof jarvis.render === 'function') {
          console.log("Calling jarvis.render() to mount component...");
          try {
            jarvis.render();
            mountCalled = true;
            console.log("jarvis.render() called successfully");
          } catch (err) {
            console.error("Error calling jarvis.render():", err);
          }
        }
        // Try loadApp() if render() doesn't exist
        else if (typeof jarvis.loadApp === 'function') {
          console.log("Calling jarvis.loadApp() to mount component...");
          try {
            jarvis.loadApp("jarvis-scheduler-container");
            mountCalled = true;
            console.log("jarvis.loadApp() called successfully");
          } catch (err) {
            console.error("Error calling jarvis.loadApp():", err);
          }
        }
        // Try open() if neither exists (modal-only mode)
        else if (typeof jarvis.open === 'function') {
          console.log("Calling jarvis.open() to mount component...");
          try {
            jarvis.open();
            mountCalled = true;
            console.log("jarvis.open() called successfully");
          } catch (err) {
            console.error("Error calling jarvis.open():", err);
          }
        }
        
        if (!mountCalled) {
          console.warn("⚠️ No mount method found (render, loadApp, or open). Component may auto-mount or may require manual trigger.");
        }

        console.log("Checking component mount status...");

        // Set up UTM tracking (like reference HTML)
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

          // Set up dataLayer tracking (like reference HTML)
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

          // Get location title from URL (like reference HTML)
          const urlParams = new URLSearchParams(window.location.search);
          const locationTitle = urlParams.get('location_title');

          // CRITICAL: Wait for component to mount before calling toggle()
          // Poll for jarvis.component.onOpen to exist (this confirms component mounted)
          let attempts = 0;
          const maxAttempts = 100; // 10 seconds (100 * 100ms)
          
          const checkComponentReady = setInterval(() => {
            attempts++;
            
            // Check if component is mounted (this.component exists and has onOpen)
            if (jarvis?.component?.onOpen) {
              clearInterval(checkComponentReady);
              console.log("✅ Scheduler component mounted successfully (component.onOpen exists)");
              
              // Now it's safe to toggle
              if (typeof jarvis.toggle === 'function') {
                console.log("Toggling scheduler...");
                try {
                  jarvis.toggle();
                  console.log("Scheduler toggled successfully");
                } catch (err) {
                  console.error("Error toggling scheduler:", err);
                }
              }

              // CRITICAL: Move component to container (like reference HTML does)
              // The jarvis-scheduler-v2 element is created globally, we must move it to our container
              const moveComponentToContainer = (): boolean => {
                const container = document.getElementById("jarvis-scheduler-container");
                if (!container) {
                  console.error("Container not found");
                  return false;
                }

                // Query globally first (like reference HTML does) - element is created outside container
                const component = document.querySelector("jarvis-scheduler-v2") as HTMLElement;
                
                if (component) {
                  // Check if it's already in our container
                  if (!container.contains(component)) {
                    console.log("Moving scheduler component to correct container...");
                    container.appendChild(component as Node);
                  }
                  
                  // Access shadow DOM and adjust positioning (like reference HTML)
                  if ((component as any).shadowRoot) {
                    const shadowApp = (component as any).shadowRoot.querySelector("#app");
                    if (shadowApp) {
                      shadowApp.style.position = "relative";
                      console.log("Shadow DOM accessed and styled");
                    }
                  }
                  
                  // Set city field if location title exists
                  if (locationTitle) {
                    const cityField = document.querySelector('#city-field') as HTMLInputElement;
                    if (cityField) {
                      cityField.value = locationTitle;
                      console.log("City field set to:", locationTitle);
                    }
                  }
                  
                  setIsLoading(false);
                  setShowManualTrigger(false);
                  return true; // Success
                }
                
                return false; // Component not found yet
              };

              // Try immediately
              if (moveComponentToContainer()) {
                console.log("✅ Component found and moved to container immediately");
              } else {
                console.log("Component not found yet, setting up MutationObserver...");
                
                // Use MutationObserver to watch for element creation
                let observerTimeout: ReturnType<typeof setTimeout>;
                const observer = new MutationObserver((mutations, obs) => {
                  if (moveComponentToContainer()) {
                    console.log("✅ Component found via MutationObserver and moved to container");
                    obs.disconnect();
                    clearTimeout(observerTimeout);
                  }
                });
                
                // Observe the document body for new elements
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
                
                // Also poll as fallback (in case MutationObserver misses it)
                let pollAttempts = 0;
                const maxPollAttempts = 50; // 5 seconds
                const pollInterval = setInterval(() => {
                  pollAttempts++;
                  if (moveComponentToContainer()) {
                    console.log("✅ Component found via polling and moved to container");
                    observer.disconnect();
                    clearInterval(pollInterval);
                    clearTimeout(observerTimeout);
                  } else if (pollAttempts >= maxPollAttempts) {
                    clearInterval(pollInterval);
                    observer.disconnect();
                    clearTimeout(observerTimeout);
                    console.error("⚠️ Component not found after polling timeout");
                    setIsLoading(false);
                    setShowManualTrigger(true);
                    // Component might still work, so we continue
                  }
                }, 100);
                
                // Set a timeout as final fallback
                observerTimeout = setTimeout(() => {
                  observer.disconnect();
                  clearInterval(pollInterval);
                  if (!moveComponentToContainer()) {
                    console.error("⚠️ Component not found after MutationObserver timeout");
                    setIsLoading(false);
                    setShowManualTrigger(true);
                    // Component might still work, so we continue
                  }
                }, 5000); // 5 second timeout
              }

              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(checkComponentReady);
            console.error("⚠️ Scheduler component did not mount after timeout");
            console.log("Debug info:", {
              hasJarvis: !!jarvis,
              hasComponent: !!jarvis?.component,
              componentKeys: jarvis?.component ? Object.keys(jarvis.component) : [],
              containerExists: !!document.getElementById("jarvis-scheduler-container"),
              availableMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(jarvis))
            });
              setIsLoading(false);
              setShowManualTrigger(true);
              reject(new Error("Scheduler component did not mount. Container may be invalid or scheduler initialization failed."));
            } else {
              // Log progress every 10 attempts
              if (attempts % 10 === 0) {
                console.log(`Waiting for component to mount... (attempt ${attempts}/${maxAttempts})`);
                console.log("Component status:", {
                  hasComponent: !!jarvis?.component,
                  componentType: typeof jarvis?.component
                });
              }
            }
          }, 100);

          // Cleanup interval on component unmount
          // Note: This will be cleaned up in useEffect cleanup
          
        } catch (error) {
          console.error("Error initializing Jarvis scheduler:", error);
          setIsLoading(false);
          setShowManualTrigger(true);
          reject(error);
        }
      };

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        handlePageLoad();
      } else {
        window.addEventListener('load', handlePageLoad);
      }
    });
  };

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // CRITICAL: Only initialize on the appointment page
    // Check if we're on the appointment route
    const isAppointmentPage = window.location.pathname === '/appointment' || 
                              window.location.pathname.includes('/appointment');
    
    if (!isAppointmentPage) {
      console.log("Not on appointment page, skipping scheduler initialization");
      setIsLoading(false);
      return;
    }

    const initScheduler = async () => {
      setIsLoading(true);
      setError(null);
      setShowManualTrigger(false);
      try {
        await loadJarvisScript();
        // initializeJarvisScheduler now waits for page load internally
        await initializeJarvisScheduler();
      } catch (error) {
        console.error("Error loading Jarvis Analytics:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load appointment scheduler. Please try again later."
        );
        setIsLoading(false);
      }
    };

    // Small delay to ensure router is initialized
    const timer = setTimeout(() => {
      initScheduler();
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      // Cleanup: Remove any jarvis-scheduler-v2 elements that might have been created
      // This prevents the scheduler from appearing on other pages
      const schedulerElements = document.querySelectorAll('jarvis-scheduler-v2');
      schedulerElements.forEach(el => {
        // Only remove if not in our container
        const container = document.getElementById('jarvis-scheduler-container');
        if (!container || !container.contains(el)) {
          console.log("Removing scheduler element from wrong location");
          el.remove();
        }
      });
      
      // Also remove any iframes or modals created by the scheduler
      const jarvisIframes = document.querySelectorAll('#jarvis-iframe, [id*="jarvis"]');
      jarvisIframes.forEach(el => {
        const container = document.getElementById('jarvis-scheduler-container');
        if (!container || !container.contains(el)) {
          (el as HTMLElement).remove();
        }
      });
      
      // Reset refs to allow re-initialization if user returns to page
      scriptLoadedRef.current = false;
      schedulerInitializedRef.current = false;
      jarvisSchedulerRef.current = null;
      
      // Reset global flag only if we're leaving the appointment page
      const isStillOnAppointmentPage = window.location.pathname === '/appointment' || 
                                        window.location.pathname.includes('/appointment');
      if (!isStillOnAppointmentPage) {
        (window as any).__jarvisInitialized = false;
        globalSchedulerInitialized = false;
      }
    };
  }, []);

  const handleManualTrigger = () => {
    const scheduler = jarvisSchedulerRef.current || (window as any).jarvis || (window as any).jarvisScheduler;
    if (!scheduler) {
      console.error("Scheduler not available");
      return;
    }

    console.log("Attempting to manually trigger scheduler...");

    // Use toggle() method (like reference HTML)
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
      {/* CRITICAL: Container must always exist in DOM, never conditionally rendered */}
      <div
        className={styles.schedulerWrapper}
        id="jarvis-scheduler-container"
        style={{ display: isLoading || error ? "none" : "block" }}
      />
      {!error && showManualTrigger && !isLoading && (
        <div className={styles.manualTrigger}>
          <p>The scheduler is ready but may need to be opened manually.</p>
          <button onClick={handleManualTrigger}>
            Open Appointment Scheduler
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;