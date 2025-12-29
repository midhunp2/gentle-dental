// Google Maps API Configuration
// This provides a reliable way to access the API key
// Always use environment variables - never hardcode API keys

// Helper function to get the API key
export const getGoogleMapsApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is required");
    return "";
  }
  
  return apiKey;
};

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();

