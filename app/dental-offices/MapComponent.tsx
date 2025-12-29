"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import type { DentalOffice } from "./data";
import { getGoogleMapsApiKey } from "../lib/config";
import { SkeletonBox } from "../components/Ui/Skeleton/Skeleton";
import styles from "./dental-offices.module.css";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        LatLngBounds: new () => {
          extend: (latLng: { lat: number; lng: number }) => void;
          getCenter: () => { lat: () => number; lng: () => number };
        };
        LatLng: new (lat: number, lng: number) => { lat: number; lng: number };
        Animation: {
          BOUNCE: number;
        };
      };
    };
  }
}

// Move libraries outside component to avoid re-render warnings
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

interface MapComponentProps {
  center: { lat: number; lng: number };
  offices: DentalOffice[];
  selectedOffice: string | null;
  onOfficeSelect: (id: string) => void;
  onMapLoaded?: () => void;
}

const MapComponent = ({
  center,
  offices,
  selectedOffice,
  onOfficeSelect,
  onMapLoaded,
}: MapComponentProps) => {
  const [infoWindowOffice, setInfoWindowOffice] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Get API key using config helper (handles env var and fallback)
  const apiKey = getGoogleMapsApiKey();

  // Use useLoadScript hook for better loading control
  // Only call if we have an API key to avoid errors
  const { isLoaded: scriptLoaded, loadError } = useLoadScript(
    apiKey
      ? {
          googleMapsApiKey: apiKey,
          libraries: libraries,
        }
      : {
          googleMapsApiKey: "",
          libraries: libraries,
        }
  );

  // Hide skeleton after map is loaded with a smooth transition
  useEffect(() => {
    if (isMapLoaded && scriptLoaded) {
      // Small delay to ensure smooth transition and prevent flickering
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        // Notify parent that map is loaded
        if (onMapLoaded) {
          onMapLoaded();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMapLoaded, scriptLoaded, onMapLoaded]);

  // Detect mobile for optimized map options
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767.98);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: !isMobile, // Disable on mobile for better performance
      scrollwheel: !isMobile, // Disable scrollwheel on mobile (use pinch instead)
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: !isMobile, // Hide on mobile to save space
      gestureHandling: isMobile ? "cooperative" : "auto", // Better mobile touch handling
      // Performance optimizations for mobile
      ...(isMobile && {
        disableDoubleClickZoom: false,
        keyboardShortcuts: false,
      }),
    }),
    [isMobile]
  );

  const handleMarkerClick = useCallback(
    (officeId: string) => {
      setInfoWindowOffice(officeId);
      onOfficeSelect(officeId);
    },
    [onOfficeSelect]
  );

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowOffice(null);
  }, []);

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      // Fit bounds to show all markers if there are offices
      if (offices.length > 0) {
        try {
          const bounds = new google.maps.LatLngBounds();
          offices.forEach((office) => {
            bounds.extend(new google.maps.LatLng(office.lat, office.lng));
          });
          map.fitBounds(bounds);
        } catch (error) {
          console.error("Error fitting bounds:", error);
        }
      }
      // Mark map as loaded
      setIsMapLoaded(true);
    },
    [offices]
  );

  // Check for API key
  if (!apiKey) {
    // Debug info for troubleshooting
    const envCheck =
      typeof window !== "undefined"
        ? `Client-side check: ${
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "Found" : "Not found"
          }`
        : "Server-side";

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          flexDirection: "column",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#d32f2f",
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          Google Maps API key not found
        </p>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
          Please ensure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in your
          .env.local file
        </p>
        <p style={{ color: "#999", fontSize: "12px", marginTop: "8px" }}>
          <strong>Important:</strong> After adding the key, you must restart
          your development server
        </p>
        <p style={{ color: "#999", fontSize: "12px" }}>
          Run:{" "}
          <code
            style={{
              background: "#e0e0e0",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            npm run dev
          </code>
        </p>
        <p
          style={{
            color: "#999",
            fontSize: "11px",
            marginTop: "12px",
            fontFamily: "monospace",
          }}
        >
          {envCheck}
        </p>
        <p style={{ color: "#999", fontSize: "11px", marginTop: "4px" }}>
          Check browser console (F12) for detailed debug info
        </p>
      </div>
    );
  }

  // Show skeleton loader while script is loading OR map is not loaded
  const isLoading = !scriptLoaded || !isMapLoaded || showSkeleton;

  // Show error state
  if (loadError) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <p style={{ color: "#d32f2f", fontSize: "16px", marginBottom: "10px" }}>
          Failed to load Google Maps
        </p>
        <p style={{ color: "#666", fontSize: "14px" }}>
          {loadError.message || "Please check your API key and try again."}
        </p>
      </div>
    );
  }

  // Render map with skeleton overlay until map is fully loaded
  return (
    <div 
      style={{ position: "relative", width: "100%", height: "100%", minHeight: "500px" }}
      role="application"
      aria-label="Interactive map showing dental office locations"
    >
      {/* Skeleton overlay - visible until map is fully loaded */}
      {isLoading && (
        <div
          className={styles.mapLoadingSkeleton}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            pointerEvents: "none",
            opacity: showSkeleton ? 1 : 0,
            transition: "opacity 0.3s ease-out",
          }}
          aria-hidden="true"
        >
          <SkeletonBox
            height="100%"
            width="100%"
            className={styles.skeletonMap}
          />
        </div>
      )}
      
      {/* Map component - rendered but hidden until loaded */}
      {scriptLoaded && (
        <div
          style={{
            opacity: isMapLoaded && !showSkeleton ? 1 : 0,
            transition: "opacity 0.4s ease-in",
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <GoogleMap
            options={mapOptions}
            zoom={offices.length > 0 ? 11 : 8}
            center={center}
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            onLoad={handleMapLoad}
          >
            {offices.map((office) => (
              <Marker
                key={office.id}
                position={{ lat: office.lat, lng: office.lng }}
                onClick={() => handleMarkerClick(office.id)}
                animation={
                  selectedOffice === office.id &&
                  typeof window !== "undefined" &&
                  window.google
                    ? window.google.maps.Animation.BOUNCE
                    : undefined
                }
              >
                {infoWindowOffice === office.id && (
                  <InfoWindow onCloseClick={handleInfoWindowClose}>
                    <div style={{ padding: "8px" }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {office.name}
                      </h3>
                      <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                        {office.address}
                      </p>
                      <a
                        href={`tel:${office.phone}`}
                        style={{
                          color: "#145091",
                          textDecoration: "none",
                          fontSize: "14px",
                        }}
                      >
                        {office.phone}
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
