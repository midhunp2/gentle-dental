// Google Maps API Configuration
// This provides a reliable way to access the API key
// In production, always use environment variables

export const GOOGLE_MAPS_API_KEY = 
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
  "AIzaSyCVEptUFaaRyupEM_QpM1TIwTBkOij6W2o"; // Fallback for development

// Helper function to get the API key
export const getGoogleMapsApiKey = (): string => {
  // In production, environment variable is required
  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is required in production");
      return "";
    }
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  }
  
  // In development, use env var if available, otherwise use fallback
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY;
};

