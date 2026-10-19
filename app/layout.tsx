// app/layout.tsx

import Script from "next/script";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";

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
// GLOBAL SEO METADATA (Korba & Raipur Dominance)
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
    // ========================================================
    // 1. RAIPUR & KORBA HIGH-INTENT (IMMEDIATE LEAD)
    // ========================================================
    "taxi service in raipur",
    "taxi service in korba",
    "cab booking number raipur",
    "taxi contact number korba",
    "best cab service in raipur",
    "24x7 taxi service in korba",
    "raipur local taxi booking",
    "korba cab hire",
    
    // ========================================================
    // 2. AIRPORT TRANSFERS (CRITICAL RAIPUR CONVERSIONS)
    // ========================================================
    "raipur airport taxi service",
    "swami vivekananda airport cab",
    "korba to raipur airport taxi",
    "bilaspur to raipur airport drop",
    "raipur airport to bhilai taxi",
    "raipur airport prepaid taxi",
    "chakarbhata airport bilaspur taxi",

    // ========================================================
    // 3. TOP REVENUE ROUTES (KORBA <-> RAIPUR <-> BILASPUR)
    // ========================================================
    "one way taxi raipur to korba",
    "korba to raipur cab fare",
    "raipur to bilaspur taxi",
    "bilaspur to korba cab",
    "raipur to raigarh taxi",
    "korba to jagdalpur outstation cab",
    
    // ========================================================
    // 4. CORPORATE & B2B (INDUSTRIAL KORBA & RAIPUR)
    // ========================================================
    "corporate car rental raipur",
    "monthly taxi service korba",
    "cab service near ntpc korba",
    "balco korba taxi hire",
    "secl gevra taxi service",
    "commercial vehicle on rent raipur",
    "wedding car rental raipur",
    "luxury car rental korba",

    // ========================================================
    // 5. REST OF CHHATTISGARH (CG NETWORK)
    // ========================================================
    "chhattisgarh taxi service",
    "durg bhilai cab service",
    "taxi service in raigarh",
    "ambikapur to raipur cab",
    "jagdalpur outstation taxi",
    "champa to korba cab",

    // ========================================================
    // 6. PREMIUM FLEET SPECIFIC
    // ========================================================
    "innova crysta on rent in raipur",
    "ertiga cab booking korba",
    "7 seater cab raipur",
    "swift dzire taxi korba"
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title: "Khatu Rides Travels Co. | Best Taxi Service in Raipur & Korba",
    description: "Trusted outstation, corporate, and airport taxi network operating heavily in Raipur, Korba, Bilaspur, and across Chhattisgarh.",
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
  // ==========================================================
  // LOCAL BUSINESS SCHEMA (Optimized for Korba & Raipur)
  // ==========================================================

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "Khatu Rides Travels Co.",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": `${siteUrl}/hero/main%20image.png`,
    "telephone": [
      "+919244137353",
      "+918319376115"
    ],
    "priceRange": "₹₹",
    "description": "Premium taxi service headquartered in Korba and Raipur. We offer fast Swami Vivekananda Airport transfers, corporate monthly rentals in industrial hubs, and outstation trips across Bilaspur, Durg, Bhilai, Raigarh, and Ambikapur.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Khatu Rides Travels Co.",
      "telephone": "+919244137353",
      "priceRange": "₹₹"
    },
    // Priority Area Array: Google reads the first elements as most important
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Korba" },
      { "@type": "AdministrativeArea", "name": "Raipur" },
      { "@type": "AdministrativeArea", "name": "Chhattisgarh" },
      { "@type": "AdministrativeArea", "name": "Bilaspur" },
      { "@type": "AdministrativeArea", "name": "Durg" },
      { "@type": "AdministrativeArea", "name": "Bhilai" },
      { "@type": "AdministrativeArea", "name": "Raigarh" },
      { "@type": "AdministrativeArea", "name": "Ambikapur" },
      { "@type": "AdministrativeArea", "name": "Jagdalpur" },
      { "@type": "AdministrativeArea", "name": "Jharsuguda" }
    ],
    "serviceType": [
      "Raipur Airport Transfers",
      "Korba Corporate Car Rentals",
      "One Way Taxi Drop",
      "Round Trip Intercity Cab",
      "Monthly Commercial Fleet"
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "servicePhone": {
        "@type": "ContactPoint",
        "telephone": "+919244137353",
        "contactType": "booking help desk",
        "areaServed": ["Korba", "Raipur", "IN"],
        "availableLanguage": ["Hindi", "English"]
      }
    }
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <html lang="en-IN" className={`${sansFont.variable} scroll-smooth`}>
      <head>
        {/* ====================================================
            GOOGLE TAG MANAGER / ADS BASE SCRIPT
        ==================================================== */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18196199181"
          strategy="afterInteractive"
        />

        {/* ====================================================
            GOOGLE ANALYTICS + GOOGLE ADS (Unchanged)
        ==================================================== */}
        <Script id="google-tag-and-conversions" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', 'G-FXZZCTGQ4', {
              anonymize_ip: true
            });
            gtag('config', 'AW-18196199181');

            window.gtag_report_conversion = function(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                  'send_to': 'AW-18196199181/DXCJCJiJxPYcEI3uz-RD',
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

        {/* ====================================================
            GLOBAL TAXI SERVICE JSON-LD
        ==================================================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />
      </head>

      <body className="antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col overflow-x-hidden">
        
        {/* MAIN WEBSITE CONTENT */}
        <main className="flex-grow w-full flex flex-col">
          {children}
        </main>

        {/* PUBLIC WEBSITE FOOTER */}
        <SiteFooter />
      </body>
    </html>
  );
}