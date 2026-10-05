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
// GLOBAL SEO METADATA
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Khatu Rides Travels Co. | Best Taxi Service in Chhattisgarh",
    template: "%s | Khatu Rides Travels Co.",
  },

  description:
    "Book trusted taxi service in Chhattisgarh with Khatu Rides Travels Co. We provide affordable one way taxi, round trip cab, outstation taxi, airport transfer, local cab, corporate travel and commercial car rental across Chhattisgarh. Popular routes include Raipur to Bilaspur, Bilaspur to Raipur, Raipur to Korba, Korba to Raipur, Raipur to Raigarh, Raigarh to Raipur, Raipur to Durg, Durg to Raipur, Raipur to Bhilai, Bhilai to Raipur, Bilaspur to Korba, Korba to Bilaspur, Bilaspur to Raigarh, Raigarh to Bilaspur, Raipur to Ambikapur, Ambikapur to Raipur, Raipur to Jagdalpur, Jagdalpur to Raipur, Raipur to Champa, Champa to Raipur, Raipur to Janjgir, Janjgir to Raipur, Raipur to Sakti, Sakti to Raipur, Raipur to Kawardha, Kawardha to Raipur, Raipur to Dhamtari, Dhamtari to Raipur, Raipur to Mahasamund, Mahasamund to Raipur, Raipur to Baloda Bazar, Baloda Bazar to Raipur, Raipur to Kanker, Kanker to Raipur, Raipur to Rajnandgaon, Rajnandgaon to Raipur, Raipur to Dongargarh, Dongargarh to Raipur, Raipur to Korba Airport, Raipur Airport Taxi, Swami Vivekananda Airport pickup and drop, Bilaspur Airport taxi and intercity cab services. Travel comfortably in Swift Dzire, Ertiga, Innova, Innova Crysta, Sedan and SUV taxis with experienced drivers, transparent pricing, 24×7 booking, doorstep pickup, safe travel and instant booking support.",

  keywords: [ 
    // ========================================================
// KORBA HIGH-INTENT & IMMEDIATE BOOKING (DIRECT CALL/LEAD)
// ========================================================
"taxi contact number korba",
"cab booking number korba",
"korba taxi travel agency contact number",
"24x7 taxi service in korba",
"emergency cab booking korba",
"best cab service in korba",
"cheap cab booking korba",
"affordable taxi service korba",
"taxi stand korba contact number",
"local cab hire in korba",

// ========================================================
// KORBA CAR RENTAL (DAILY, HOURLY & DRIVER)
// ========================================================
"car rental in korba with driver",
"self drive car rental korba",
"luxury car rental korba",
"car hire in korba for outstation",
"full day cab hire korba",
"wedding car rental korba",
"monthly cab rental korba",

// ========================================================
// KORBA HIGH-FREQUENCY OUTSTATION & ONE-WAY DROP
// ========================================================
"one way taxi korba to raipur",
"korba to raipur one way cab fare",
"korba to bilaspur one way cab",
"korba to raigarh one way taxi",
"korba to ambikapur taxi service",
"korba to jagdalpur cab",
"korba to rourkela taxi",
"korba to prayagraj cab service",
"korba to amarkantak round trip cab",
"korba to varanasi outstation taxi",

// ========================================================
// AIRPORT & RAILWAY STATION CONNECTIVITY (CRITICAL CONVERSIONS)
// ========================================================
"korba to raipur airport taxi",
"korba to swami vivekananda airport cab",
"raipur airport drop from korba taxi fare",
"raipur airport to korba taxi booking",
"korba to jharsuguda airport cab",
"korba to bilaspur airport taxi service",
"korba railway station taxi pickup drop",
"champa railway station to korba taxi",

// ========================================================
// INDUSTRIAL & CORPORATE INTENT (NTPC, BALCO, SECL HUBS)
// ========================================================
"taxi service in balco korba",
"cab service near ntpc korba",
"taxi service secl gevra korba",
"kusmunda korba taxi hire",
"corporate cab booking in korba",
"monthly taxi hire for companies in korba",

// ========================================================
// VEHICLE SPECIFIC HIGH-INTENT KEYWORDS (KORBA)
// ========================================================
"innova crysta taxi in korba",
"ertiga cab booking korba",
"7 seater cab booking in korba",
"swift dzire on rent in korba",
"tempo traveller in korba for tour"
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title:
      "Khatu Rides Travels Co. | Best Taxi Service in Chhattisgarh",

    description:
      "Trusted cab booking network in Chhattisgarh for one way drops, round trips, outstation corporate tours and verified airport transfers.",

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
  // LOCAL BUSINESS / TAXI SERVICE STRUCTURED DATA
  // ==========================================================

  const businessSchema = {
    "@context": "https://schema.org",

    "@type": "TaxiService",

    name: "Khatu Rides Travels Co.",

    url: siteUrl,

    logo: `${siteUrl}/logo.png`,

    image: `${siteUrl}/logo.png`,

    telephone: [
      "+919244137353",
      "+918319376115",
    ],

    priceRange: "₹₹",

    description:
      "Khatu Rides Travels Co. Chhattisgarh ki trusted taxi aur cab booking service hai, jo Korba, Raipur, Bilaspur, Durg, Bhilai, Raigarh, Jharsuguda, Jagdalpur, Ambikapur aur nearby areas me reliable travel service provide karti hai. Dzire, Ertiga, Innova Crysta aur Sedan cars ke saath one way taxi, round trip cab, outstation tour, airport/railway pickup-drop aur commercial booking available hai.",

    provider: {
      "@type": "LocalBusiness",

      name: "Khatu Rides Travels Co.",

      telephone: "+919244137353",

      priceRange: "₹₹",
    },

    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Chhattisgarh",
      },

      {
        "@type": "AdministrativeArea",
        name: "Raipur",
      },

      {
        "@type": "AdministrativeArea",
        name: "Korba",
      },

      {
        "@type": "AdministrativeArea",
        name: "Bilaspur",
      },

      {
        "@type": "AdministrativeArea",
        name: "Raigarh",
      },

      {
        "@type": "AdministrativeArea",
        name: "Jharsuguda",
      },

      {
        "@type": "AdministrativeArea",
        name: "Jagdalpur",
      },

      {
        "@type": "AdministrativeArea",
        name: "Ambikapur",
      },

      {
        "@type": "AdministrativeArea",
        name: "Durg",
      },

      {
        "@type": "AdministrativeArea",
        name: "Bhilai",
      },
    ],

    serviceType: [
      "One Way Taxi Drop",
      "Round Trip Intercity Cab",
      "Outstation Commercial Fleet",
      "Corporate Travel Packages",
      "Swami Vivekananda Airport Transfers",
    ],

    availableChannel: {
      "@type": "ServiceChannel",

      servicePhone: {
        "@type": "ContactPoint",

        telephone: "+919244137353",

        contactType: "booking help desk",

        areaServed: "IN",

        availableLanguage: [
          "Hindi",
          "English",
        ],
      },
    },
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <html
      lang="en-IN"
      className={`${sansFont.variable} scroll-smooth`}
    >
      <head>
        {/* ====================================================
            GOOGLE TAG MANAGER / ADS BASE SCRIPT
        ==================================================== */}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18196199181"
          strategy="afterInteractive"
        />

        {/* ====================================================
            GOOGLE ANALYTICS + GOOGLE ADS
        ==================================================== */}

        <Script
          id="google-tag-and-conversions"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-FXZZCTGQ4', {
              anonymize_ip: true
            });

            gtag('config', 'AW-18196199181');

            /*
             * Global Google Ads Call Conversion Function
             */

            window.gtag_report_conversion = function(url) {

              var callback = function () {

                if (typeof(url) != 'undefined') {
                  window.location = url;
                }

              };

              if (typeof gtag === 'function') {

                gtag('event', 'conversion', {

                  'send_to':
                    'AW-18196199181/DXCJCJiJxPYcEI3uz-RD',

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

      <body
        className="
          antialiased
          bg-slate-50
          text-slate-800
          min-h-screen
          flex
          flex-col
          overflow-x-hidden
        "
      >
        {/* ====================================================
            MAIN WEBSITE CONTENT
        ==================================================== */}

        <main className="flex-grow w-full flex flex-col">
          {children}
        </main>

        {/* ====================================================
            PUBLIC WEBSITE FOOTER
            ----------------------------------------------------
            Footer automatically disappears on:
            /admin
            /admin/*
        ==================================================== */}

        <SiteFooter />
      </body>
    </html>
  );
}