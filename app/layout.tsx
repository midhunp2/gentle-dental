import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";

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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
        </Suspense>

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
      </body>
    </html>
  );
}
