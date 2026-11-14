// app/layout.tsx

import Script from "next/script";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

// ============================================================
// GLOBAL FONT
// ============================================================

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// ============================================================
// WEBSITE CONFIG
// ============================================================

const siteUrl = "https://khaturidescg.in";

// ============================================================
// GLOBAL SEO METADATA
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Khatu Rides Travels Co. | Best Taxi Service in Raipur & Korba, Chhattisgarh",
    template: "%s | Khatu Rides Travels Co.",
  },

  description:
    "Chhattisgarh's top-rated taxi service operating primarily from Raipur and Korba. We provide 24/7 airport transfers from Swami Vivekananda Airport, corporate monthly car rentals in Korba/Raipur, and outstation cabs across Bilaspur, Durg, Bhilai, Raigarh, and Ambikapur. Book Innova, Ertiga, and Sedans for one-way drops, round trips, and local hourly rentals.",

  keywords: [
    "cab booking in raipur",
    "one way taxi raipur",
    "raipur airport taxi service",
    "cabs in raipur chhattisgarh",
    "bilaspur to korba taxi",
    "korba taxi",
    "cab in raipur",
    "bilaspur to raipur cab",
    "raipur to bilaspur taxi",
    "car rental in korba",
    "raipur taxi service",
    "taxi service in raipur",
    "taxi service in korba",
    "cab booking number raipur",
    "taxi contact number korba",
    "best cab service in raipur",
    "24x7 taxi service in korba",
    "raipur local taxi booking",
    "korba cab hire",
    "one way taxi raipur to korba",
    "korba to raipur cab fare",
    "raipur to raigarh taxi",
    "korba to jagdalpur outstation cab",
    "corporate car rental raipur",
    "monthly taxi service korba",
    "cab service near ntpc korba",
    "balco korba taxi hire",
    "commercial vehicle on rent raipur",
    "luxury car rental korba",
    "chhattisgarh taxi service",
    "durg bhilai cab service",
    "ambikapur to raipur cab",
    "innova crysta on rent in raipur",
    "ertiga cab booking korba",
    "swift dzire taxi korba",
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title: "Khatu Rides Travels Co. | Best Taxi Service in Raipur & Korba",
    description:
      "Trusted outstation, corporate, and airport taxi network operating heavily in Raipur, Korba, Bilaspur, and across Chhattisgarh.",
    url: siteUrl,
    siteName: "Khatu Rides Travels Co.",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Khatu Rides Travels Co.",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/hero/main%20image.png`,
    telephone: ["+919244137353", "+918319376115"],
    priceRange: "₹₹",
    description:
      "Premium taxi service headquartered in Korba and Raipur. We offer fast Swami Vivekananda Airport transfers, corporate monthly rentals in industrial hubs, and outstation trips across Bilaspur, Durg, Bhilai, Raigarh, and Ambikapur.",
    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: "+919244137353",
      priceRange: "₹₹",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Korba" },
      { "@type": "AdministrativeArea", name: "Raipur" },
      { "@type": "AdministrativeArea", name: "Chhattisgarh" },
      { "@type": "AdministrativeArea", name: "Bilaspur" },
      { "@type": "AdministrativeArea", name: "Durg" },
      { "@type": "AdministrativeArea", name: "Bhilai" },
      { "@type": "AdministrativeArea", name: "Raigarh" },
      { "@type": "AdministrativeArea", name: "Ambikapur" },
      { "@type": "AdministrativeArea", name: "Jagdalpur" },
      { "@type": "AdministrativeArea", name: "Jharsuguda" },
    ],
    serviceType: [
      "Raipur Airport Transfers",
      "Korba Corporate Car Rentals",
      "One Way Taxi Drop",
      "Round Trip Intercity Cab",
      "Monthly Commercial Fleet",
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: {
        "@type": "ContactPoint",
        telephone: "+919244137353",
        contactType: "booking help desk",
        areaServed: ["Korba", "Raipur", "IN"],
        availableLanguage: ["Hindi", "English"],
      },
    },
  };

  return (
    <html lang="en-IN" className={`${sansFont.variable} scroll-smooth`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18502918680"
          strategy="afterInteractive"
        />

        <Script id="google-tag-and-conversions" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', 'G-FXZZCTGQ4', {
              anonymize_ip: true
            });
            gtag('config', 'AW-18502918680');

            window.gtag_report_conversion = function(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                  'send_to': 'AW-18502918680/j4qnCNWBlKQdEJjE8PZE',
                  'value': 1.0,
                  'currency': 'INR',
                  'event_callback': callback
                });
              } else {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              }
              return false;
            };
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />
      </head>

      <body className="antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow w-full flex flex-col">
          {children}
        </main>

        {/* Public popup and footer are hidden automatically on every /admin route. */}
        <SiteChrome />
      </body>
    </html>
  );
}
