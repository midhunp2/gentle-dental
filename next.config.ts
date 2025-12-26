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
    // Maintain high image quality
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    // Don't compress images too much - maintain quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
