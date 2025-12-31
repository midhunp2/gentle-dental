import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";
import SkipLink from "./components/Ui/SkipLink/SkipLink";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find a Dentist | Dental Car Services | Gentle Dental of New England",
  description: "We offer a range of treatments including dental implants and cosmetic dentistry such as teeth whitening, crowns and veneers.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Resource hints for Jarvis scheduler - improves performance */}
        <link rel="dns-prefetch" href="https://schedule.jarvisanalytics.com" />
        <link rel="preconnect" href="https://schedule.jarvisanalytics.com" crossOrigin="anonymous" />
        {/* Resource hints for Google Maps - improves map loading performance */}
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        {/* Resource hints for Drupal CMS - CRITICAL for LCP performance (saves ~330ms) */}
        <link rel="dns-prefetch" href="https://dev-headlessd10.pantheonsite.io" />
        <link rel="preconnect" href="https://dev-headlessd10.pantheonsite.io" crossOrigin="anonymous" />
        {/* Resource hints for Font Awesome CDN */}
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        {/* Font Awesome - Loaded with preload for better performance */}
        <link 
          rel="preload" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" 
          as="style" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" 
        />
        {/* Font display optimization for Font Awesome */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'FontAwesome';
              font-display: swap;
            }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Remove Next.js loading bar */}
        <Script id="remove-loading-bar" strategy="afterInteractive">
          {`
            (function() {
              // Function to remove loading bars
              function removeLoadingBars() {
                // Remove nprogress elements
                const nprogress = document.getElementById('nprogress');
                if (nprogress) nprogress.remove();
                
                // Remove any elements with nprogress class
                document.querySelectorAll('.nprogress, .nprogress-bar, .nprogress-peg').forEach(el => el.remove());
                
                // Remove Next.js router loading indicators
                document.querySelectorAll('[data-nextjs-router-loading]').forEach(el => {
                  el.style.display = 'none';
                  el.remove();
                });
                
                // Remove any fixed position elements at top that look like loading bars (small height, blue color)
                document.querySelectorAll('div').forEach(el => {
                  const style = window.getComputedStyle(el);
                  if (style.position === 'fixed' && 
                      style.top === '0px' && 
                      parseInt(style.height) <= 5 &&
                      (style.zIndex === '9999' || parseInt(style.zIndex) > 9990)) {
                    el.style.display = 'none';
                    el.remove();
                  }
                });
              }
              
              // Run immediately
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', removeLoadingBars);
              } else {
                removeLoadingBars();
              }
              
              // Run after page load
              window.addEventListener('load', removeLoadingBars);
              
              // Watch for dynamically added elements
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.addedNodes.length) {
                    removeLoadingBars();
                  }
                });
              });
              observer.observe(document.body, { childList: true, subtree: true });
            })();
          `}
        </Script>
        <SkipLink />
        <div id="main-content" tabIndex={-1} style={{ outline: "none" }}>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </div>

        {/* Initialize dataLayer immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
            `,
          }}
        />

        {/* Load GTM AFTER browser is idle - Only on production/live domain */}
        <Script id="gtm-idle-loader" strategy="afterInteractive">
          {`
            (function() {
              // Check if we're on localhost or local development
              var hostname = window.location.hostname;
              var isLocal = hostname === 'localhost' || 
                           hostname === '127.0.0.1' || 
                           hostname === '0.0.0.0' ||
                           hostname.startsWith('192.168.') ||
                           hostname.startsWith('10.') ||
                           hostname.endsWith('.local') ||
                           hostname.includes('.local:');
              
              // Only load GTM on production/live domain
              if (isLocal) {
                console.log('GTM skipped: Running on local environment');
                return;
              }

              function loadGTM() {
                var gtmScript = document.createElement('script');
                gtmScript.async = true;
                gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-';
                document.head.appendChild(gtmScript);
              }

              if ('requestIdleCallback' in window) {
                requestIdleCallback(loadGTM, { timeout: 1500 });
              } else {
                window.addEventListener('load', function() {
                  setTimeout(loadGTM, 200);
                });
              }
            })();
          `}
        </Script>

        {/* GTM NoScript fallback - Only on production/live domain */}
        <Script id="gtm-noscript-check" strategy="afterInteractive">
          {`
            (function() {
              var hostname = window.location.hostname;
              var isLocal = hostname === 'localhost' || 
                           hostname === '127.0.0.1' || 
                           hostname === '0.0.0.0' ||
                           hostname.startsWith('192.168.') ||
                           hostname.startsWith('10.') ||
                           hostname.endsWith('.local') ||
                           hostname.includes('.local:');
              
              if (isLocal) {
                var noscriptIframe = document.querySelector('noscript iframe[src*="googletagmanager.com"]');
                if (noscriptIframe && noscriptIframe.parentElement) {
                  noscriptIframe.parentElement.remove();
                }
              }
            })();
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SpeedInsights />
      </body>
    </html>
  );
}
