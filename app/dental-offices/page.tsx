"use client";

import { useState, useEffect, Suspense, useRef, useCallback, useMemo, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import styles from "./dental-offices.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getGoogleMapsApiKey } from "../lib/config";
import { SkeletonBox, SkeletonText } from "../components/Ui/Skeleton/Skeleton";

// Hook to detect mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767.98);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export interface DentalOffice {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance?: number;
}

// Dental offices data with coordinates
export const dentalOffices: DentalOffice[] = [
  {
    id: "1",
    name: "Gentle Dental Boston - Newbury St",
    address: "274 Newbury St., Boston, MA 02116",
    phone: "(617) 675-4563",
    lat: 42.3496,
    lng: -71.0809,
  },
  {
    id: "2",
    name: "Gentle Dental South Boston",
    address: "368A West Broadway Boston, MA 02127",
    phone: "(617) 958-7278",
    lat: 42.3389,
    lng: -71.0503,
  },
  {
    id: "3",
    name: "Gentle Dental Somerville",
    address: "Somerville, MA",
    phone: "(617) 000-0000",
    lat: 42.3876,
    lng: -71.0995,
  },
  {
    id: "4",
    name: "Gentle Dental Malden",
    address: "225 Centre St. Malden, MA 02148",
    phone: "(781) 456-3137",
    lat: 42.4251,
    lng: -71.0662,
  },
  {
    id: "5",
    name: "Gentle Dental Saugus",
    address: "1423 Broadway Saugus, MA 01906",
    phone: "(781) 746-6521",
    lat: 42.4643,
    lng: -71.0101,
  },
  {
    id: "6",
    name: "Gentle Dental Wakefield",
    address: "Wakefield, MA",
    phone: "(781) 000-0000",
    lat: 42.5065,
    lng: -71.0729,
  },
  {
    id: "7",
    name: "Gentle Dental Waltham",
    address: "Waltham, MA",
    phone: "(781) 000-0000",
    lat: 42.3765,
    lng: -71.2356,
  },
  {
    id: "8",
    name: "Gentle Dental Franklin",
    address: "Franklin, MA",
    phone: "(508) 000-0000",
    lat: 42.0834,
    lng: -71.3967,
  },
  {
    id: "9",
    name: "Gentle Dental Worcester at the Trolley Yard",
    address: "Worcester, MA",
    phone: "(508) 000-0000",
    lat: 42.2626,
    lng: -71.8023,
  },
  {
    id: "10",
    name: "Gentle Dental Cambridge",
    address: "Cambridge, MA",
    phone: "(617) 000-0000",
    lat: 42.3736,
    lng: -71.1097,
  },
  {
    id: "11",
    name: "Gentle Dental Jamaica Plain",
    address: "Jamaica Plain, MA",
    phone: "(617) 000-0000",
    lat: 42.3098,
    lng: -71.1156,
  },
  {
    id: "12",
    name: "Gentle Dental Burlington",
    address: "Burlington, MA",
    phone: "(781) 000-0000",
    lat: 42.5048,
    lng: -71.1956,
  },
  {
    id: "13",
    name: "Gentle Dental Peabody",
    address: "Peabody, MA",
    phone: "(978) 000-0000",
    lat: 42.5279,
    lng: -70.9287,
  },
  {
    id: "14",
    name: "Gentle Dental Medford",
    address: "Medford, MA",
    phone: "(781) 000-0000",
    lat: 42.4184,
    lng: -71.1068,
  },
  {
    id: "15",
    name: "Gentle Dental Brighton",
    address: "Brighton, MA",
    phone: "(617) 000-0000",
    lat: 42.3476,
    lng: -71.1534,
  },
  {
    id: "16",
    name: "Gentle Dental Arlington",
    address: "Arlington, MA",
    phone: "(781) 000-0000",
    lat: 42.4154,
    lng: -71.1569,
  },
  {
    id: "17",
    name: "Gentle Dental Attleboro",
    address: "Attleboro, MA",
    phone: "(508) 000-0000",
    lat: 41.9445,
    lng: -71.2856,
  },
  {
    id: "18",
    name: "Gentle Dental Belmont",
    address: "Belmont, MA",
    phone: "(617) 000-0000",
    lat: 42.3958,
    lng: -71.1787,
  },
  {
    id: "19",
    name: "Gentle Dental Beverly",
    address: "Beverly, MA",
    phone: "(978) 000-0000",
    lat: 42.5584,
    lng: -70.88,
  },
  {
    id: "21",
    name: "Gentle Dental West Roxbury",
    address: "West Roxbury, MA",
    phone: "(617) 000-0000",
    lat: 42.2796,
    lng: -71.15,
  },
  {
    id: "22",
    name: "Gentle Dental Braintree",
    address: "Braintree, MA",
    phone: "(781) 000-0000",
    lat: 42.2223,
    lng: -71.002,
  },
  {
    id: "23",
    name: "Gentle Dental Brockton",
    address: "Brockton, MA",
    phone: "(508) 000-0000",
    lat: 42.0834,
    lng: -71.0184,
  },
  {
    id: "24",
    name: "Gentle Dental Brookline",
    address: "Brookline, MA",
    phone: "(617) 000-0000",
    lat: 42.3317,
    lng: -71.1212,
  },
  {
    id: "25",
    name: "Gentle Dental Chelmsford",
    address: "Chelmsford, MA",
    phone: "(978) 000-0000",
    lat: 42.5998,
    lng: -71.3673,
  },
  {
    id: "26",
    name: "Gentle Dental Concord, NH",
    address: "Concord, NH",
    phone: "(603) 000-0000",
    lat: 43.2081,
    lng: -71.5376,
  },
  {
    id: "27",
    name: "Gentle Dental Derry, NH",
    address: "Derry, NH",
    phone: "(603) 000-0000",
    lat: 42.8806,
    lng: -71.3273,
  },
  {
    id: "28",
    name: "Gentle Dental Dover, NH",
    address: "Dover, NH",
    phone: "(603) 000-0000",
    lat: 43.1979,
    lng: -70.8737,
  },
  {
    id: "29",
    name: "Gentle Dental Exeter, NH",
    address: "Exeter, NH",
    phone: "(603) 000-0000",
    lat: 42.9815,
    lng: -70.9478,
  },
  {
    id: "30",
    name: "Gentle Dental Hanover",
    address: "Hanover, MA",
    phone: "(781) 000-0000",
    lat: 42.1131,
    lng: -70.812,
  },
  {
    id: "31",
    name: "Gentle Dental Hudson",
    address: "Hudson, MA",
    phone: "(978) 000-0000",
    lat: 42.3918,
    lng: -71.5662,
  },
  {
    id: "32",
    name: "Gentle Dental Keene, NH",
    address: "Keene, NH",
    phone: "(603) 000-0000",
    lat: 42.9337,
    lng: -72.2781,
  },
  {
    id: "33",
    name: "Gentle Dental Manchester, NH",
    address: "Manchester, NH",
    phone: "(603) 000-0000",
    lat: 42.9956,
    lng: -71.4548,
  },
  {
    id: "34",
    name: "Gentle Dental Manchester Elm St",
    address: "Elm St, Manchester, NH",
    phone: "(603) 000-0000",
    lat: 42.9956,
    lng: -71.4548,
  },
  {
    id: "35",
    name: "Gentle Dental Manchester South Willow",
    address: "South Willow St, Manchester, NH",
    phone: "(603) 000-0000",
    lat: 42.98,
    lng: -71.45,
  },
  {
    id: "36",
    name: "Gentle Dental Methuen",
    address: "Methuen, MA",
    phone: "(978) 000-0000",
    lat: 42.7262,
    lng: -71.1909,
  },
  {
    id: "37",
    name: "Gentle Dental Milford",
    address: "Milford, MA",
    phone: "(508) 000-0000",
    lat: 42.1398,
    lng: -71.5167,
  },
  {
    id: "38",
    name: "Gentle Dental Nashua, NH",
    address: "Nashua, NH",
    phone: "(603) 000-0000",
    lat: 42.7654,
    lng: -71.4676,
  },
  {
    id: "39",
    name: "Gentle Dental Nashua - Main St",
    address: "Main St, Nashua, NH",
    phone: "(603) 000-0000",
    lat: 42.7654,
    lng: -71.4676,
  },
  {
    id: "40",
    name: "Gentle Dental South Nashua",
    address: "South Nashua, NH",
    phone: "(603) 000-0000",
    lat: 42.75,
    lng: -71.4676,
  },
  {
    id: "41",
    name: "Gentle Dental Natick",
    address: "Natick, MA",
    phone: "(508) 000-0000",
    lat: 42.2834,
    lng: -71.3496,
  },
  {
    id: "42",
    name: "Gentle Dental New Bedford",
    address: "New Bedford, MA",
    phone: "(508) 000-0000",
    lat: 41.6362,
    lng: -70.9342,
  },
  {
    id: "43",
    name: "Gentle Dental North Andover",
    address: "North Andover, MA",
    phone: "(978) 000-0000",
    lat: 42.6987,
    lng: -71.135,
  },
  {
    id: "44",
    name: "Gentle Dental Norwood",
    address: "Norwood, MA",
    phone: "(781) 000-0000",
    lat: 42.1945,
    lng: -71.1995,
  },
  {
    id: "45",
    name: "Gentle Dental Quincy",
    address: "Quincy, MA",
    phone: "(617) 000-0000",
    lat: 42.2529,
    lng: -71.0023,
  },
  {
    id: "46",
    name: "Gentle Dental Rochester, NH",
    address: "Rochester, NH",
    phone: "(603) 000-0000",
    lat: 43.3045,
    lng: -70.9756,
  },
  {
    id: "47",
    name: "Gentle Dental Seekonk",
    address: "Seekonk, MA",
    phone: "(508) 000-0000",
    lat: 41.8084,
    lng: -71.337,
  },
  {
    id: "48",
    name: "Gentle Dental Stoughton",
    address: "Stoughton, MA",
    phone: "(781) 000-0000",
    lat: 42.1251,
    lng: -71.1023,
  },
  {
    id: "49",
    name: "Gentle Dental Worcester - Shrewsbury St",
    address: "Shrewsbury St, Worcester, MA",
    phone: "(508) 000-0000",
    lat: 42.2626,
    lng: -71.8023,
  },
];

// Dynamically import Google Maps to avoid SSR issues
// Lazy load map component with loading delay on mobile for better performance
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      minHeight: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f0f0"
    }}>
      <SkeletonBox height="100%" width="100%" />
    </div>
  )
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find matching office from the dental offices array
function findMatchingOffice(query: string): DentalOffice | null {
  const lowerQuery = query.toLowerCase().trim();

  // First, try exact match on office name
  let match = dentalOffices.find((office) =>
    office.name.toLowerCase().includes(lowerQuery)
  );

  // If no match, try matching on address/city
  if (!match) {
    match = dentalOffices.find((office) =>
      office.address.toLowerCase().includes(lowerQuery)
    );
  }

  // If still no match, try partial match on city name (extract city from address)
  if (!match) {
    match = dentalOffices.find((office) => {
      const addressParts = office.address.toLowerCase().split(",");
      const city = addressParts[0]?.trim() || "";
      return city.includes(lowerQuery) || lowerQuery.includes(city);
    });
  }

  return match || null;
}

// Memoized component for offices grid to improve performance
const OfficesGridContent = ({ locationFilter, isMobile }: { locationFilter: "all" | "ma" | "nh"; isMobile: boolean }) => {
  const gridContent = useMemo(() => {
    const filtered =
      locationFilter === "all"
        ? dentalOffices
        : locationFilter === "ma"
        ? dentalOffices.filter(
            (office) => !office.address.includes(", NH")
          )
        : dentalOffices.filter((office) =>
            office.address.includes(", NH")
          );

    // Sort alphabetically by city name
    const sorted = [...filtered].sort((a, b) => {
      const getBaseCity = (name: string) => {
        // Extract base city name for sorting (e.g., "Boston - Newbury St" -> "Boston")
        const displayName = name.replace("Gentle Dental ", "").trim();
        const parts = displayName.split(" - ");
        return parts[0].split(" at ")[0].trim();
      };
      return getBaseCity(a.name).localeCompare(getBaseCity(b.name));
    });

    // Split into columns - single column on mobile for better performance
    const columnCount = isMobile ? 1 : 3;
    const columnSize = Math.ceil(sorted.length / columnCount);
    const columns = Array.from({ length: columnCount }, (_, i) =>
      sorted.slice(i * columnSize, (i + 1) * columnSize)
    );

    return columns.map((column, colIndex) => (
      <div key={colIndex} className={styles.officeColumn}>
        {column.map((office) => {
          // Extract full location name for display (e.g., "Boston - Newbury St" or "Worcester at the Trolley Yard")
          const displayName = office.name
            .replace("Gentle Dental ", "")
            .trim();
          return (
            <div key={office.id} className={styles.officeListItem}>
              {displayName}
            </div>
          );
        })}
      </div>
    ));
  }, [locationFilter, isMobile]);

  return (
    <div className={styles.officesGrid} id="offices-grid" role="tabpanel" aria-labelledby="filter-tabs">
      {gridContent}
    </div>
  );
};

// Geocode location using Google Geocoding API
async function geocodeLocation(
  location: string
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    console.error("Google Maps API key not found");
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Get search suggestions based on query - optimized with early return
function getSearchSuggestions(query: string): DentalOffice[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase().trim();
  const suggestions: DentalOffice[] = [];
  const maxSuggestions = 10; // Limit suggestions for better performance

  // Find offices matching the query
  for (const office of dentalOffices) {
    if (suggestions.length >= maxSuggestions) break;
    
    const nameMatch = office.name.toLowerCase().includes(lowerQuery);
    const addressMatch = office.address.toLowerCase().includes(lowerQuery);

    if (nameMatch || addressMatch) {
      suggestions.push(office);
    }
  }

  // Sort by relevance (exact matches first, then partial)
  return suggestions.sort((a, b) => {
    const aNameExact = a.name.toLowerCase().startsWith(lowerQuery);
    const bNameExact = b.name.toLowerCase().startsWith(lowerQuery);
    if (aNameExact && !bNameExact) return -1;
    if (!aNameExact && bNameExact) return 1;
    return a.name.localeCompare(b.name);
  });
}

function DentalOfficesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [filteredOffices, setFilteredOffices] = useState<DentalOffice[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 42.3601, lng: -71.0589 }); // Boston default
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<DentalOffice[]>([]);
  const [locationFilter, setLocationFilter] = useState<"all" | "ma" | "nh">(
    "all"
  );
  const [visibleOffices, setVisibleOffices] = useState<Set<string>>(new Set());
  const [showOfficesGrid, setShowOfficesGrid] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const officesGridRef = useRef<HTMLDivElement>(null);
  const officeCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Section loading states - track when each section is ready
  const [sectionsLoaded, setSectionsLoaded] = useState({
    searchSection: false,
    officeList: false,
    map: false,
    officesGrid: false,
  });

  // Check if all sections are loaded
  const allSectionsLoaded = useMemo(() => {
    return Object.values(sectionsLoaded).every(loaded => loaded === true);
  }, [sectionsLoaded]);

  // Mark section as loaded
  const markSectionLoaded = useCallback((section: keyof typeof sectionsLoaded) => {
    setSectionsLoaded(prev => ({ ...prev, [section]: true }));
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const newSuggestions = getSearchSuggestions(searchQuery);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Mark search section as loaded after initial render
  useEffect(() => {
    // Small delay to simulate loading
    const timer = setTimeout(() => {
      markSectionLoaded("searchSection");
    }, 100);
    return () => clearTimeout(timer);
  }, [markSectionLoaded]);

  // Initialize from URL params
  useEffect(() => {
    const location = searchParams.get("p");
    const miles = searchParams.get("miles");
    if (location) {
      setSearchQuery(location);
      if (miles) {
        setRadius(Number(miles));
      }
      // Trigger search on mount if location is in URL
      handleSearchFromURL(location, miles ? Number(miles) : 5);
    } else {
      // Show all offices by default if no search params
      setFilteredOffices(dentalOffices);
      setHasSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Initialize visible offices - fewer on mobile for better performance
  useEffect(() => {
    const initialCount = isMobile ? 3 : 5;
    const initialVisible = new Set(
      filteredOffices.slice(0, initialCount).map((office) => office.id)
    );
    setVisibleOffices(initialVisible);
    // Mark office list as loaded when offices are ready (even if empty, the section is ready)
    const timer = setTimeout(() => {
      markSectionLoaded("officeList");
    }, 200);
    return () => clearTimeout(timer);
  }, [filteredOffices, isMobile, markSectionLoaded]);

  // Intersection Observer for lazy loading office cards
  // Optimized settings for mobile performance
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const officeId = entry.target.getAttribute("data-office-id");
            if (officeId) {
              setVisibleOffices((prev) => new Set(prev).add(officeId));
            }
          }
        });
      },
      {
        root: null,
        // Smaller rootMargin on mobile for better performance
        rootMargin: isMobile ? "30px" : "50px",
        threshold: isMobile ? 0.05 : 0.1,
      }
    );

    observerRef.current = observer;

    // Observe all office cards after a small delay to ensure DOM is ready
    // Longer delay on mobile to reduce initial work
    const timeoutId = setTimeout(() => {
      officeCardRefs.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }, isMobile ? 200 : 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [filteredOffices, isMobile]);

  // Callback for when map is loaded
  const handleMapLoaded = useCallback(() => {
    markSectionLoaded("map");
  }, [markSectionLoaded]);

  // Intersection Observer for lazy loading offices grid section
  // Delay map loading on mobile for better initial performance
  useEffect(() => {
    if (isMobile) {
      // Delay map loading on mobile until user interacts or scrolls
      const timer = setTimeout(() => {
        setShouldLoadMap(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShouldLoadMap(true);
    }
  }, [isMobile]);

  // Intersection Observer for lazy loading offices grid section
  useEffect(() => {
    if (!officesGridRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowOfficesGrid(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        // Smaller rootMargin on mobile
        rootMargin: isMobile ? "50px" : "100px",
        threshold: isMobile ? 0.05 : 0.1,
      }
    );

    observer.observe(officesGridRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  const handleSearchFromURL = async (location: string, miles: number) => {
    setIsLoading(true);
    try {
      // First, try to find a matching office in our array
      const matchingOffice = findMatchingOffice(location);

      if (matchingOffice) {
        // Use the office's coordinates directly
        const coordinates = {
          lat: matchingOffice.lat,
          lng: matchingOffice.lng,
        };
        setMapCenter(coordinates);
        filterOfficesByRadius(coordinates, miles);
        setHasSearched(true);
      } else {
        // If no match found, try geocoding
        const coordinates = await geocodeLocation(location);
        if (coordinates) {
          setMapCenter(coordinates);
          filterOfficesByRadius(coordinates, miles);
          setHasSearched(true);
        } else {
          // If geocoding fails, show all offices
          setFilteredOffices(dentalOffices);
          setHasSearched(false);
        }
      }
    } catch (error) {
      console.error("Error searching:", error);
      setFilteredOffices(dentalOffices);
      setHasSearched(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter offices within radius - memoized for performance
  const filterOfficesByRadius = useCallback((
    center: { lat: number; lng: number },
    radiusMiles: number
  ) => {
    const filtered = dentalOffices
      .map((office) => ({
        ...office,
        distance: calculateDistance(center, {
          lat: office.lat,
          lng: office.lng,
        }),
      }))
      .filter((office) => office.distance <= radiusMiles)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    setFilteredOffices(filtered);
    setHasSearched(true);
  }, []);

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If empty, show all offices
      setFilteredOffices(dentalOffices);
      setHasSearched(false);
      router.push("/dental-offices");
      return;
    }

    setIsLoading(true);
    try {
      // First, try to find a matching office in our array
      const matchingOffice = findMatchingOffice(searchQuery);

      if (matchingOffice) {
        // Use the office's coordinates directly
        const coordinates = {
          lat: matchingOffice.lat,
          lng: matchingOffice.lng,
        };
        setMapCenter(coordinates);
        filterOfficesByRadius(coordinates, radius);
        updateURL(searchQuery, radius);
      } else {
        // If no match found, try geocoding
        const coordinates = await geocodeLocation(searchQuery);
        if (coordinates) {
          setMapCenter(coordinates);
          filterOfficesByRadius(coordinates, radius);
          updateURL(searchQuery, radius);
        } else {
          // Show suggestions if geocoding fails
          const suggestions = getSearchSuggestions(searchQuery);
          if (suggestions.length > 0) {
            const message = `Location not found. Did you mean one of these?\n${suggestions
              .slice(0, 3)
              .map((o) => `- ${o.name}`)
              .join("\n")}`;
            alert(message);
            // Show all offices as fallback
            setFilteredOffices(dentalOffices);
            setHasSearched(false);
          } else {
            alert(
              "Location not found. Please try a different search term or browse all locations below."
            );
            setFilteredOffices(dentalOffices);
            setHasSearched(false);
          }
        }
      }
    } catch (error) {
      console.error("Error searching:", error);
      alert("An error occurred while searching. Please try again.");
      setFilteredOffices(dentalOffices);
      setHasSearched(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Update URL with search params
  const updateURL = (location: string, miles: number) => {
    router.push(
      `/dental-offices?p=${encodeURIComponent(location)}&miles=${miles}`
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      handleSearch();
    }
  };

  const handleSuggestionClick = (office: DentalOffice) => {
    setSearchQuery(office.name);
    setShowSuggestions(false);
    // Use the office's coordinates directly
    const coordinates = { lat: office.lat, lng: office.lng };
    setMapCenter(coordinates);
    filterOfficesByRadius(coordinates, radius);
    updateURL(office.name, radius);
  };

  // Skeleton loader for search section
  const SearchSectionSkeleton = () => (
    <div className={styles.searchSection}>
      <SkeletonBox
        height={20}
        width="90%"
        className={styles.skeletonSearchTitle}
      />
      <div className={styles.searchInputs}>
        <div className={styles.inputWrapper}>
          <SkeletonBox
            height={48}
            width="100%"
            className={styles.skeletonInput}
          />
        </div>
        <SkeletonBox
          height={48}
          width="100%"
          className={styles.skeletonSelect}
        />
      </div>
      <SkeletonBox
        height={48}
        width="40%"
        className={styles.skeletonSubmitButton}
      />
    </div>
  );

  // Skeleton loader for office list
  const OfficeListSkeleton = () => (
    <div className={styles.officeList}>
      <div className={styles.officeListSkeleton}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.officeCardSkeleton}>
            <SkeletonBox
              height={24}
              width="70%"
              className={styles.skeletonOfficeName}
            />
            <SkeletonText
              lines={2}
              height={16}
              className={styles.skeletonOfficeAddress}
            />
            <SkeletonBox
              height={20}
              width="40%"
              className={styles.skeletonOfficePhone}
            />
            <SkeletonBox
              height={48}
              width="100%"
              className={styles.skeletonBookButton}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // Skeleton loader for map
  const MapSkeleton = () => (
    <div className={styles.rightPanel}>
      <div className={styles.mapLoadingSkeleton}>
        <SkeletonBox
          height="100%"
          width="100%"
          className={styles.skeletonMap}
        />
      </div>
    </div>
  );

  // Skeleton loader for offices grid section
  const OfficesGridSectionSkeleton = () => (
    <div className={styles.officesListSection}>
      <SkeletonBox
        height={20}
        width="200px"
        className={styles.skeletonBreadcrumb}
      />
      <SkeletonBox
        height={32}
        width="300px"
        className={styles.skeletonOfficesTitle}
      />
      <SkeletonBox
        height={20}
        width="400px"
        className={styles.skeletonOfficesSubtitle}
      />
      <div className={styles.filterTabsSkeleton}>
        {[1, 2, 3].map((i) => (
          <SkeletonBox
            key={i}
            height={48}
            width="120px"
            className={styles.skeletonFilterTab}
          />
        ))}
      </div>
      <div className={styles.officesGridSkeleton}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonBox
            key={i}
            height={24}
            width="100%"
            className={styles.skeletonOfficeListItem}
          />
        ))}
      </div>
    </div>
  );

  return (
    <main className={styles.mainContainer} id="main-content">
      <div className={styles.contentWrapper}>
        {/* Left Panel - Search & List */}
        <div className={styles.leftPanel}>
          {!sectionsLoaded.searchSection ? (
            <SearchSectionSkeleton />
          ) : (
            <div className={styles.searchSection} role="search" aria-label="Find dental office">
            <h2 className={styles.searchTitle}>
              Enter your ZIP code or location to locate a practice nearest to
              you
            </h2>
            <div className={styles.searchInputs}>
              <div className={styles.inputWrapper}>
                <label htmlFor="location-search" className="sr-only">
                  Search by City, State or ZIP code
                </label>
                <Image
                  src="https://www.gentledental.com/themes/custom/gentledentaldptheme/images/location.svg"
                  alt=""
                  className={styles.locationIcon}
                  width={20}
                  height={20}
                  unoptimized
                  loading="lazy"
                  aria-hidden="true"
                />
                <input
                  id="location-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on suggestion
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by City, State or ZIP code"
                  className={styles.locationInput}
                  aria-label="Search by City, State or ZIP code"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions && suggestions.length > 0}
                  aria-controls="location-suggestions"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    className={styles.suggestionsDropdown}
                    id="location-suggestions"
                    role="listbox"
                    aria-label="Location suggestions"
                  >
                    {suggestions.slice(0, 5).map((office) => (
                      <div
                        key={office.id}
                        className={styles.suggestionItem}
                        onClick={() => handleSuggestionClick(office)}
                        onMouseDown={(e) => e.preventDefault()}
                        role="option"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSuggestionClick(office);
                          }
                        }}
                        aria-label={`${office.name}, ${office.address}`}
                      >
                        <div className={styles.suggestionName}>
                          {office.name}
                        </div>
                        <div className={styles.suggestionAddress}>
                          {office.address}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.radiusSelectWrapper}>
                <label htmlFor="radius-select" className="sr-only">
                  Search radius in miles
                </label>
                <select
                  id="radius-select"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className={styles.radiusSelect}
                  aria-label="Search radius in miles"
                >
                  <option value={5}>5 Miles</option>
                  <option value={10}>10 Miles</option>
                  <option value={15}>15 Miles</option>
                  <option value={25}>25 Miles</option>
                  <option value={50}>50 Miles</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className={styles.submitButton}
              disabled={isLoading}
              aria-label={isLoading ? "Searching for offices" : "Search for dental offices"}
            >
              {isLoading ? "SEARCHING..." : "SUBMIT"}
            </button>
          </div>
          )}

          {/* Office List */}
          {!sectionsLoaded.officeList ? (
            <OfficeListSkeleton />
          ) : (
          <div className={styles.officeList} role="list" aria-label="Dental offices list">
            {isLoading ? (
              <div className={styles.officeListSkeleton}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={styles.officeCardSkeleton}>
                    <SkeletonBox
                      height={24}
                      width="70%"
                      className={styles.skeletonOfficeName}
                    />
                    <SkeletonText
                      lines={2}
                      height={16}
                      className={styles.skeletonOfficeAddress}
                    />
                    <SkeletonBox
                      height={20}
                      width="40%"
                      className={styles.skeletonOfficePhone}
                    />
                    <SkeletonBox
                      height={48}
                      width="100%"
                      className={styles.skeletonBookButton}
                    />
                  </div>
                ))}
              </div>
            ) : filteredOffices.length > 0 ? (
              <>
                {hasSearched && (
                  <div className={styles.resultsCount} role="status" aria-live="polite">
                    Found {filteredOffices.length} office
                    {filteredOffices.length !== 1 ? "s" : ""} within {radius}{" "}
                    mile{radius !== 1 ? "s" : ""}
                  </div>
                )}
                {filteredOffices.map((office, index) => {
                  // Show fewer initial cards on mobile
                  const initialCount = isMobile ? 3 : 5;
                  const isVisible = visibleOffices.has(office.id) || index < initialCount;
                  const cardRef = (node: HTMLDivElement | null) => {
                    if (node) {
                      officeCardRefs.current.set(office.id, node);
                    } else {
                      officeCardRefs.current.delete(office.id);
                    }
                  };

                  return (
                    <article
                      key={office.id}
                      ref={cardRef}
                      data-office-id={office.id}
                      className={`${styles.officeCard} ${
                        selectedOffice === office.id ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedOffice(office.id)}
                      role="listitem"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedOffice(office.id);
                        }
                      }}
                      aria-label={`${office.name}, ${office.address}, Phone: ${office.phone}`}
                      aria-pressed={selectedOffice === office.id}
                    >
                      {isVisible ? (
                        <>
                          <h3 className={styles.officeName}>{office.name}</h3>
                          <p className={styles.officeAddress}>{office.address}</p>
                          <div>
                            <a
                              href={`tel:${office.phone}`}
                              className={styles.officePhone}
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Call ${office.name} at ${office.phone}`}
                            >
                              {office.phone}
                            </a>
                            <a
                              href="#"
                              className={styles.bookNowLink}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              aria-label={`Book appointment at ${office.name}`}
                            >
                              Book Now
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className={styles.officeCardSkeleton}>
                          <SkeletonBox
                            height={24}
                            width="70%"
                            className={styles.skeletonOfficeName}
                          />
                          <SkeletonText
                            lines={2}
                            height={16}
                            className={styles.skeletonOfficeAddress}
                          />
                          <SkeletonBox
                            height={20}
                            width="40%"
                            className={styles.skeletonOfficePhone}
                          />
                          <SkeletonBox
                            height={48}
                            width="100%"
                            className={styles.skeletonBookButton}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </>
            ) : (
              <div className={styles.noResults} role="status" aria-live="polite">
                <p>No offices found in this area.</p>
                <p>
                  Try expanding your search radius or searching a different
                  location.
                </p>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Right Panel - Map */}
        <div className={styles.rightPanel} aria-label="Map showing dental office locations">
          {shouldLoadMap ? (
            <MapComponent
              center={mapCenter}
              offices={filteredOffices}
              selectedOffice={selectedOffice}
              onOfficeSelect={setSelectedOffice}
              onMapLoaded={handleMapLoaded}
            />
          ) : (
            <div className={styles.mapLoadingSkeleton}>
              <SkeletonBox
                height="100%"
                width="100%"
                className={styles.skeletonMap}
              />
            </div>
          )}
        </div>
      </div>

      {/* Offices List Section */}
      <div className={styles.officesListSection} ref={officesGridRef}>
        <div className={styles.breadcrumbs}>
          <span>Gentle Dental</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>Dental Offices</span>
        </div>

        <h1 className={styles.officesTitle}>Gentle Dental Offices</h1>
        <p className={styles.officesSubtitle}>
          49 Convenient Locations throughout Massachusetts and New Hampshire
        </p>

        <div className={styles.filterTabs} role="tablist" aria-label="Filter offices by state">
          <button
            className={`${styles.filterTab} ${
              locationFilter === "all" ? styles.active : ""
            }`}
            onClick={() => setLocationFilter("all")}
            role="tab"
            aria-selected={locationFilter === "all"}
            aria-controls="offices-grid"
          >
            All Offices
          </button>
          <button
            className={`${styles.filterTab} ${
              locationFilter === "ma" ? styles.active : ""
            }`}
            onClick={() => setLocationFilter("ma")}
            role="tab"
            aria-selected={locationFilter === "ma"}
            aria-controls="offices-grid"
          >
            Massachusetts
          </button>
          <button
            className={`${styles.filterTab} ${
              locationFilter === "nh" ? styles.active : ""
            }`}
            onClick={() => setLocationFilter("nh")}
            role="tab"
            aria-selected={locationFilter === "nh"}
            aria-controls="offices-grid"
          >
            New Hampshire
          </button>
        </div>

        {showOfficesGrid ? (
          <OfficesGridContent locationFilter={locationFilter} isMobile={isMobile} />
        ) : (
          <div className={styles.officesGridSkeleton} id="offices-grid" role="tabpanel" aria-labelledby="filter-tabs">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonBox
                key={i}
                height={24}
                width="100%"
                className={styles.skeletonOfficeListItem}
              />
            ))}
          </div>
        )}

        <p className={styles.sundayNote}>*Open on Sundays</p>
      </div>
    </main>
  );
}

export default function DentalOfficesPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className={styles.mainContainer}>
            <div className={styles.contentWrapper}>
              <div className={styles.leftPanel}>
                <div className={styles.searchSection}>
                  <SkeletonBox
                    height={20}
                    width="90%"
                    className={styles.skeletonSearchTitle}
                  />
                  <div className={styles.searchInputs}>
                    <div className={styles.inputWrapper}>
                      <SkeletonBox
                        height={48}
                        width="100%"
                        className={styles.skeletonInput}
                      />
                    </div>
                    <SkeletonBox
                      height={48}
                      width="100%"
                      className={styles.skeletonSelect}
                    />
                  </div>
                  <SkeletonBox
                    height={48}
                    width="100%"
                    className={styles.skeletonSubmitButton}
                  />
                </div>
                <div className={styles.officeList}>
                  <div className={styles.officeListSkeleton}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className={styles.officeCardSkeleton}>
                        <SkeletonBox
                          height={24}
                          width="70%"
                          className={styles.skeletonOfficeName}
                        />
                        <SkeletonText
                          lines={2}
                          height={16}
                          className={styles.skeletonOfficeAddress}
                        />
                        <SkeletonBox
                          height={20}
                          width="40%"
                          className={styles.skeletonOfficePhone}
                        />
                        <SkeletonBox
                          height={48}
                          width="100%"
                          className={styles.skeletonBookButton}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.rightPanel}>
                <div className={styles.mapLoadingSkeleton}>
                  <SkeletonBox
                    height="100%"
                    width="100%"
                    className={styles.skeletonMap}
                  />
                </div>
              </div>
            </div>
            <div className={styles.officesListSection}>
              <SkeletonBox
                height={20}
                width="200px"
                className={styles.skeletonBreadcrumb}
              />
              <SkeletonBox
                height={32}
                width="300px"
                className={styles.skeletonOfficesTitle}
              />
              <SkeletonBox
                height={20}
                width="400px"
                className={styles.skeletonOfficesSubtitle}
              />
              <div className={styles.filterTabsSkeleton}>
                {[1, 2, 3].map((i) => (
                  <SkeletonBox
                    key={i}
                    height={48}
                    width="120px"
                    className={styles.skeletonFilterTab}
                  />
                ))}
              </div>
              <div className={styles.officesGridSkeleton}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonBox
                    key={i}
                    height={24}
                    width="100%"
                    className={styles.skeletonOfficeListItem}
                  />
                ))}
              </div>
            </div>
          </main>
        }
      >
        <DentalOfficesContent />
      </Suspense>
      <Footer />
    </>
  );
}
