"use client";

import { useMemo, useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import type { DentalOffice } from "../lib/dentalOffices";
import { getGoogleMapsApiKey } from "../lib/config";

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
}

const MapComponent = ({
  center,
  offices,
  selectedOffice,
  onOfficeSelect,
}: MapComponentProps) => {
  const [infoWindowOffice, setInfoWindowOffice] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    }),
    []
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
      setIsLoaded(true);

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

  // Show loading state
  if (!scriptLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p style={{ color: "#666" }}>Loading map...</p>
      </div>
    );
  }

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

  return (
    <GoogleMap
      options={mapOptions}
      zoom={offices.length > 0 ? 11 : 8}
      center={center}
      mapContainerStyle={{ width: "100%", height: "100%", minHeight: "500px" }}
      onLoad={handleMapLoad}
    >
      {offices.map((office) => (
        <Marker
          key={office.id}
          position={{ lat: office.lat, lng: office.lng }}
          onClick={() => handleMarkerClick(office.id)}
          animation={
            selectedOffice === office.id &&
            isLoaded &&
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
  );
};

export default MapComponent;
