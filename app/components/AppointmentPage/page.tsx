"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./appointment.module.css";

// Dev-only logging
const isDev = process.env.NODE_ENV === 'development';
const log = isDev ? console.log : () => {};
const logError = isDev ? console.error : () => {};

let globalSchedulerInitialized = false;

const AppointmentPage = () => {
  const scriptLoadedRef = useRef(false);
  const schedulerInitializedRef = useRef(false);
  const jarvisSchedulerRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  const getContainer = useCallback(() => {
    return containerRef.current || document.getElementById("jarvis-scheduler-container");
  }, []);

  const loadJarvisScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (scriptLoadedRef.current) {
        resolve();
        return;
      }

      const existingInitScript = document.querySelector('script[src*="init.min.js"]');
      const existingSchedulerScript = document.querySelector('script[src*="jarvis-scheduler-v2.min.js"]');
      const customElementDefined = customElements.get('jarvis-scheduler-v2');
      
      if (existingInitScript && (window as any).JarvisAnalyticsScheduler && 
          (customElementDefined || existingSchedulerScript)) {
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
            
            if (customElements.get('jarvis-scheduler-v2')) {
              scriptLoadedRef.current = true;
              resolve();
              return;
            }
            
            // Prevent double registration of custom element
            if (!customElements.get('jarvis-scheduler-v2')) {
              const schedulerScript = document.createElement("script");
              schedulerScript.id = "jarvis-scheduler";
              schedulerScript.src = "https://schedule.jarvisanalytics.com/js/jarvis-scheduler-v2.min.js";
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
            reject(new Error("JarvisAnalyticsScheduler constructor not available"));
          }
        }, 150);
      };
      
      initScript.onerror = () => reject(new Error("Failed to load init.min.js"));
      document.head.appendChild(initScript);
    });
  }, []);

  const initializeJarvisScheduler = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).__jarvisInitialized || schedulerInitializedRef.current) {
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
            document.cookie = `referrer_url=${fullURL}; path=/; expires=${expirationDate.toUTCString()}`;
          } else {
            jarvis.referrer = extractUTM('referrer_url') || '';
          }

          // DataLayer tracking
          if (typeof jarvis.onNextStep === 'function') {
            jarvis.onNextStep((event: any) => {
              if (event.event === 'scheduling-success') {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({'event': 'online_scheduler_form'});
              }
            });
          }

          // CRITICAL: Call render() first to create the component
          if (typeof jarvis.render === 'function') {
            try {
              jarvis.render("jarvis-scheduler-container");
            } catch {
              try {
                jarvis.render({ containerId: "jarvis-scheduler-container" });
              } catch {
                jarvis.render();
              }
            }
          } else if (typeof jarvis.loadApp === 'function') {
            jarvis.loadApp("jarvis-scheduler-container");
          }

          const locationTitle = new URLSearchParams(window.location.search).get('location_title');
          
          // Wait for component element to be created in DOM (optimized polling)
          let attempts = 0;
          const maxAttempts = 40;
          let pollInterval: ReturnType<typeof setInterval> | null = null;
          
          const checkComponent = () => {
            attempts++;
            const component = document.querySelector("jarvis-scheduler-v2") as HTMLElement;
            
            if (component) {
              if (pollInterval) clearInterval(pollInterval);
              
              const container = getContainer();
              if (container && !container.contains(component)) {
                container.appendChild(component as Node);
              }
              
              // Style shadow DOM for visibility
              if ((component as any).shadowRoot) {
                const shadowApp = (component as any).shadowRoot.querySelector("#app");
                if (shadowApp) {
                  shadowApp.style.position = "relative";
                  shadowApp.style.visibility = "visible";
                  shadowApp.style.opacity = "1";
                  shadowApp.style.display = "block";
                  shadowApp.style.zIndex = "10001";
                }
                
                // Ensure all content in shadow root is visible
                const shadowContent = (component as any).shadowRoot.querySelectorAll("*");
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
                  const cityField = document.querySelector('#city-field') as HTMLInputElement;
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
                if (typeof jarvis.toggle === 'function') {
                  // Check if component exists (means it's initialized)
                  if (jarvis.component || toggleAttempts >= maxToggleAttempts) {
                    try {
                      jarvis.toggle();
                      
                      // After toggle, ensure modal is visible
                      setTimeout(() => {
                        // Find and ensure modal/overlay elements are visible
                        const modalElements = document.querySelectorAll('[id*="jarvis"], [class*="jarvis"], [class*="modal"], [class*="overlay"]');
                        modalElements.forEach((el: Element) => {
                          const htmlEl = el as HTMLElement;
                          htmlEl.style.display = "block";
                          htmlEl.style.visibility = "visible";
                          htmlEl.style.opacity = "1";
                          htmlEl.style.zIndex = "10000";
                        });
                        
                        // Ensure iframes are visible
                        const iframes = document.querySelectorAll('iframe[id*="jarvis"], iframe[src*="jarvis"]');
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
                setIsLoading(false);
                setShowManualTrigger(false);
                resolve();
              };
              
              // Start trying toggle after a short delay
              setTimeout(tryToggle, 200);
              
            } else if (attempts >= maxAttempts) {
              if (pollInterval) clearInterval(pollInterval);
              logError("Component not found after timeout");
              setShowManualTrigger(true);
              setIsLoading(false);
              resolve();
            }
          };
          
          // Start polling with optimized interval
          pollInterval = setInterval(checkComponent, 100);
          
        } catch (error) {
          logError("Error initializing Jarvis scheduler:", error);
          setShowManualTrigger(true);
          setIsLoading(false);
          reject(error);
        }
      };

      // Start immediately if DOM ready, otherwise wait for DOMContentLoaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
      } else {
        init();
      }
    });
  }, [getContainer]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const isAppointmentPage = window.location.pathname === '/appointment' || 
                              window.location.pathname.includes('/appointment');
    if (!isAppointmentPage) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        await loadJarvisScript();
        await initializeJarvisScheduler();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load scheduler");
        setIsLoading(false);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      scriptLoadedRef.current = false;
      schedulerInitializedRef.current = false;
    };
  }, [loadJarvisScript, initializeJarvisScheduler]);

  const handleManualTrigger = useCallback(() => {
    const scheduler = jarvisSchedulerRef.current || (window as any).jarvis;
    if (scheduler?.toggle) {
      scheduler.toggle();
      setIsLoading(false);
      setShowManualTrigger(false);
    }
  }, []);

  return (
    <div className={styles.appointmentPage}>
      {error && (
        <div className={styles.errorMessage}>
          <strong>Unable to load appointment scheduler</strong>
          <br />
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        className={styles.schedulerWrapper}
        id="jarvis-scheduler-container"
        style={{ display: "block", minHeight: "600px" }}
      />
      {!error && showManualTrigger && (
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
