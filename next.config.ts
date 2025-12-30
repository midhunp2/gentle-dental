import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-headlessd10.pantheonsite.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gentledental.com",
        pathname: "/**",
      },
    ],
    // Maintain high image quality - use modern formats for better compression without quality loss
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    // High resolution device sizes to maintain quality on all screens
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Note: Quality is set per Image component (default 95 for high quality)
    // Next.js Image optimization maintains quality while optimizing file size
  },
  // Explicitly expose environment variables for client-side
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
