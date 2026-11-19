// app/layout.tsx

import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

// ============================================================
// WEBSITE & BRANCH CONFIG
// ============================================================

const siteUrl = "https://khaturidescg.in";
const korbaPhone = "+91-9893694232"; // Korba Branch Dedicated GBP Number
const raipurPhone = "+91-9244137353"; // Raipur Branch Dedicated GBP Number

// ============================================================
// GLOBAL SEO, AEO & GEO METADATA
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Khatu Rides Travels Co. | Best Taxi Service in Korba & Raipur, Chhattisgarh",
    template: "%s | Khatu Rides Travels Co.",
  },

  description:
    "Khatu Rides Travels Co. is Chhattisgarh's trusted 24/7 taxi & outstation cab service operating from Korba (Bus Stand Road) and Raipur. Book one-way cabs, Swami Vivekananda Airport Raipur & Jharsuguda Airport transfers, corporate monthly car rentals (NTPC, BALCO, SECL), and intercity taxis across Bilaspur, Uslapur, Raigarh, Durg, Bhilai, Ambikapur, and Ranchi. Clean Swift Dzire, Ertiga, Innova Crysta & Tempo Traveller with verified drivers and zero hidden charges.",

  keywords: [
    // --- CORE BRAND & HIGH BUSINESS INTENT ---
    "Khatu Rides Travels Co.",
    "Khatu Rides Korba",
    "Khatu Rides Raipur",
    "best taxi service in chhattisgarh",
    "24x7 cab booking chhattisgarh",
    "one way taxi chhattisgarh",
    "outstation cab booking chhattisgarh",
    "intercity taxi service chhattisgarh",
    "online cab booking chhattisgarh",
    "corporate car rental chhattisgarh",
    "monthly cab service for companies",
    "airport pickup and drop taxi",
    "emergency taxi service near me",
    "wedding car rental chhattisgarh",
    "local hourly cab rental",
    "round trip taxi package",

    // --- KORBA DISTRICT & SUB-LOCALITIES (HIGH INTENT) ---
    "korba taxi service",
    "taxi service in korba",
    "cab booking in korba",
    "best cab service in korba",
    "car rental in korba",
    "korba taxi contact number",
    "24x7 taxi service in korba",
    "one way cab korba",
    "korba bus stand road taxi",
    "transport nagar korba taxi service",
    "tp nagar korba cab booking",
    "cseb chowk korba taxi",
    "niharika korba cab service",
    "ghantaghar korba taxi hire",
    "balco korba taxi service",
    "balco township cab booking",
    "ntpc korba taxi hire",
    "ntpc jamnipali cab service",
    "dipka korba taxi service",
    "gevra secl cab booking",
    "kusmunda korba taxi",
    "katghora taxi service",
    "bankimongra cab hire",
    "darri korba taxi service",
    "pali korba outstation cab",
    "urga korba taxi booking",
    "korba to raipur taxi",
    "korba to raipur airport cab fare",
    "korba to bilaspur one way taxi",
    "korba to uslapur railway station cab",
    "korba to raigarh taxi service",
    "korba to ambikapur cab",
    "korba to jharsuguda airport taxi",
    "korba to ranchi outstation cab",
    "korba to jagdalpur cab booking",
    "corporate taxi service in korba",
    "monthly car rental ntpc balco secl",

    // --- RAIPUR DISTRICT & SUB-LOCALITIES (HIGH INTENT) ---
    "raipur taxi service",
    "taxi service in raipur",
    "cab booking in raipur",
    "best cab service in raipur",
    "cab booking number raipur",
    "one way taxi raipur",
    "cabs in raipur chhattisgarh",
    "raipur airport taxi service",
    "swami vivekananda airport mana taxi",
    "raipur airport pickup drop cab",
    "early morning airport cab raipur",
    "raipur railway station taxi service",
    "telibandha raipur cab booking",
    "vip road raipur taxi service",
    "pandri raipur car rental",
    "shankar nagar raipur taxi",
    "tatibandh raipur cab hire",
    "naya raipur atal nagar taxi service",
    "pachpedi naka raipur cab",
    "bhatagaon bus stand raipur taxi",
    "raipur local taxi booking",
    "corporate car rental raipur",
    "commercial vehicle on rent raipur",
    "raipur to korba one way taxi",
    "raipur to bilaspur cab",
    "raipur to raigarh taxi",
    "raipur to ambikapur outstation cab",
    "raipur to durg bhilai taxi",
    "raipur to jagdalpur cab",
    "raipur to ranchi taxi service",
    "raipur to jharsuguda cab",

    // --- BILASPUR & JANJGIR-CHAMPA SUB-LOCALITIES ---
    "bilaspur taxi service",
    "bilaspur to korba taxi",
    "bilaspur to raipur airport cab",
    "uslapur railway station taxi service",
    "bilaspur junction cab pickup",
    "vyapar vihar bilaspur taxi",
    "chakarbhata bilaspur airport cab",
    "seepat ntpc bilaspur taxi",
    "champa railway station taxi",
    "naila janjgir cab booking",
    "sakti taxi service",
    "akaltara cab hire",

    // --- RAIGARH, DURG-BHILAI, AMBIKAPUR & JAGDALPUR ---
    "raigarh taxi service",
    "raigarh to raipur one way cab",
    "raigarh to korba taxi",
    "raigarh to bilaspur cab",
    "raigarh to jharsuguda airport taxi",
    "kharsia taxi service",
    "gharghoda cab booking",
    "durg bhilai taxi service",
    "bhilai steel plant corporate cab",
    "supela bhilai taxi booking",
    "nehru nagar bhilai cab",
    "durg railway station taxi",
    "ambikapur taxi service",
    "surguja outstation cab",
    "ambikapur to raipur taxi",
    "ambikapur to bilaspur cab",
    "jagdalpur bastar taxi service",

    // --- INTERSTATE HUBS: RANCHI (JHARKHAND) & JHARSUGUDA (ODISHA) ---
    "ranchi to korba taxi service",
    "ranchi to raipur one way cab",
    "ranchi to bilaspur taxi",
    "ranchi to raigarh cab",
    "ranchi to ambikapur taxi",
    "ranchi to uslapur cab",
    "ranchi to balco korba taxi",
    "ranchi to durg bhilai cab",
    "jharsuguda airport taxi service",
    "vss airport jharsuguda to korba cab",
    "jharsuguda to raigarh one way taxi",
    "jharsuguda to bilaspur cab",
    "jharsuguda to raipur taxi",

    // --- FLEET & VEHICLE-SPECIFIC HIGH-INTENT KEYWORDS ---
    "swift dzire taxi korba",
    "sedan cab booking raipur",
    "ertiga cab booking korba",
    "ertiga 7 seater taxi raipur",
    "innova crysta on rent in raipur",
    "innova crysta hire korba",
    "innova hycross taxi chhattisgarh",
    "suv taxi service korba",
    "luxury car rental korba raipur",
    "tempo traveller on rent raipur korba",
    "minibus taxi hire chhattisgarh",
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title:
      "Khatu Rides Travels Co. | Best Taxi Service in Korba & Raipur, Chhattisgarh",
    description:
      "24/7 one-way cabs, Raipur & Jharsuguda Airport transfers, corporate car rentals (NTPC, BALCO, SECL), and intercity taxis across Chhattisgarh, Ranchi & Odisha.",
    url: siteUrl,
    siteName: "Khatu Rides Travels Co.",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${siteUrl}/hero/main%20image.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Co. - Taxi & Outstation Cab Service in Korba and Raipur",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Khatu Rides Travels Co. | 24/7 Taxi Service in Korba & Raipur",
    description:
      "Book one-way outstation cabs, airport pickups, and corporate taxis across Korba, Raipur, Bilaspur, Raigarh, Ambikapur, Ranchi & Jharsuguda.",
    images: [`${siteUrl}/hero/main%20image.png`],
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
  // Unified SEO + AEO + GEO Knowledge Graph (@graph)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. PARENT ORGANIZATION ENTITY (GEO Authority)
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Khatu Rides Travels Co.",
        alternateName: ["Khatu Rides", "Khatu Rides Travels"],
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
        image: `${siteUrl}/hero/main%20image.png`,
        email: "khaturides@gmail.com",
        description:
          "Premier 24/7 taxi, one-way cab, airport transfer, and corporate fleet rental provider serving Korba, Raipur, Bilaspur, Raigarh, Durg-Bhilai, Ambikapur, Ranchi, and Jharsuguda.",
        knowsAbout: [
          "One Way Outstation Taxi Service",
          "Swami Vivekananda Airport Raipur Transfers",
          "Veer Surendra Sai Airport Jharsuguda Transfers",
          "Corporate Monthly Car Rental for NTPC, BALCO, and SECL",
          "Intercity Cab Service in Chhattisgarh, Jharkhand, and Odisha",
          "Swift Dzire, Maruti Ertiga, and Toyota Innova Crysta Rentals",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: korbaPhone,
            contactType: "customer service",
            areaServed: ["Korba", "Bilaspur", "Raigarh", "Ambikapur", "IN"],
            availableLanguage: ["Hindi", "English"],
          },
          {
            "@type": "ContactPoint",
            telephone: raipurPhone,
            contactType: "reservations",
            areaServed: ["Raipur", "Durg", "Bhilai", "Jagdalpur", "IN"],
            availableLanguage: ["Hindi", "English"],
          },
        ],
      },

      // 2. WEBSITE ENTITY
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Khatu Rides Travels Co.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "en-IN",
      },

      // 3. KORBA BRANCH ENTITY (Dedicated Phone & Exact GBP Address)
      {
        "@type": "TaxiService",
        "@id": `${siteUrl}/#korba-branch`,
        name: "Khatu Rides Travels Co.",
        url: siteUrl,
        image: `${siteUrl}/hero/main%20image.png`,
        logo: `${siteUrl}/logo.png`,
        telephone: korbaPhone,
        email: "khaturides@gmail.com",
        priceRange: "₹₹",
        parentOrganization: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "24/7 taxi service in Korba located at Bus Stand Road. Specializing in Korba to Raipur Airport drops, Bilaspur & Uslapur railway station transfers, corporate monthly cabs for NTPC, BALCO, SECL (Dipka, Gevra, Kusmunda), and intercity rides to Raigarh, Ambikapur, Ranchi, and Jharsuguda.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bus Stand Road",
          addressLocality: "Korba",
          addressRegion: "Chhattisgarh",
          postalCode: "495684",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 22.3595,
          longitude: 82.7501,
        },
        areaServed: [
          { "@type": "City", name: "Korba" },
          { "@type": "Place", name: "Transport Nagar, Korba" },
          { "@type": "Place", name: "Bus Stand Road, Korba" },
          { "@type": "Place", name: "CSEB Chowk, Korba" },
          { "@type": "Place", name: "Niharika, Korba" },
          { "@type": "Place", name: "BALCO Township, Korba" },
          { "@type": "Place", name: "NTPC Jamnipali, Korba" },
          { "@type": "Place", name: "Dipka, Korba" },
          { "@type": "Place", name: "Gevra, Korba" },
          { "@type": "Place", name: "Kusmunda, Korba" },
          { "@type": "Place", name: "Katghora, Korba" },
          { "@type": "City", name: "Bilaspur" },
          { "@type": "Place", name: "Uslapur, Bilaspur" },
          { "@type": "City", name: "Champa" },
          { "@type": "City", name: "Raigarh" },
          { "@type": "City", name: "Ambikapur" },
          { "@type": "City", name: "Jharsuguda" },
          { "@type": "City", name: "Ranchi" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Korba Taxi & Cab Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "One Way Outstation Taxi from Korba",
                description:
                  "Pay only for one-way drops from Korba to Raipur, Bilaspur, Uslapur, Raigarh, Ambikapur, Jharsuguda, and Ranchi.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Airport Taxi (Raipur & Jharsuguda Airport)",
                description:
                  "24/7 punctual pickup and drop cabs between Korba and Swami Vivekananda Airport Raipur or VSS Airport Jharsuguda.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Corporate & Industrial Monthly Car Rental",
                description:
                  "Dedicated monthly and daily corporate cabs for NTPC, BALCO, SECL, CSEB, and industrial plants in Korba.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Sedan, SUV & Luxury Vehicle Hire",
                description:
                  "Well-maintained Swift Dzire, Maruti Ertiga, Toyota Innova Crysta, and Tempo Travellers with verified drivers.",
              },
            },
          ],
        },
      },

      // 4. RAIPUR BRANCH ENTITY (Dedicated Phone & Raipur Airport Hub)
      {
        "@type": "TaxiService",
        "@id": `${siteUrl}/#raipur-branch`,
        name: "Khatu Rides One Way Taxi Raipur",
        url: siteUrl,
        image: `${siteUrl}/hero/main%20image.png`,
        logo: `${siteUrl}/logo.png`,
        telephone: raipurPhone,
        email: "khaturides@gmail.com",
        priceRange: "₹₹",
        parentOrganization: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "24/7 Raipur taxi service specializing in Swami Vivekananda Airport (Mana) pickups, early morning airport transfers, Raipur Railway Station cabs, corporate rentals, and one-way outstation taxis to Korba, Bilaspur, Durg, Bhilai, Raigarh, Ambikapur, and Jagdalpur.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Raipur", // Tip: Match exact Raipur GBP street address
          addressLocality: "Raipur",
          addressRegion: "Chhattisgarh",
          postalCode: "492001", // Tip: Match exact Raipur GBP PIN code
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 21.2514,
          longitude: 81.6296,
        },
        areaServed: [
          { "@type": "City", name: "Raipur" },
          { "@type": "Place", name: "Swami Vivekananda Airport, Mana, Raipur" },
          { "@type": "Place", name: "Telibandha, Raipur" },
          { "@type": "Place", name: "VIP Road, Raipur" },
          { "@type": "Place", name: "Pandri, Raipur" },
          { "@type": "Place", name: "Shankar Nagar, Raipur" },
          { "@type": "Place", name: "Tatibandh, Raipur" },
          { "@type": "Place", name: "Naya Raipur Atal Nagar" },
          { "@type": "City", name: "Durg" },
          { "@type": "City", name: "Bhilai" },
          { "@type": "City", name: "Bilaspur" },
          { "@type": "City", name: "Korba" },
          { "@type": "City", name: "Raigarh" },
          { "@type": "City", name: "Ambikapur" },
          { "@type": "City", name: "Jagdalpur" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Raipur Airport & Outstation Taxi Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Swami Vivekananda Airport Raipur Taxi",
                description:
                  "24/7 flight-tracked airport pickup and drop service including early morning 4 AM to 12 PM arrivals.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "One Way Cab from Raipur",
                description:
                  "Affordable one-way taxi drops from Raipur to Korba, Bilaspur, Raigarh, Durg, Bhilai, Ambikapur, and Jagdalpur.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Corporate Car Rental in Raipur & Naya Raipur",
                description:
                  "Executive sedans and SUVs for business meetings, conferences, and monthly commercial fleet requirements.",
              },
            },
          ],
        },
      },

      // 5. FAQ SCHEMA (AEO & GEO — Direct Answers for Google AI Overviews & Voice Search)
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How can I book a 24/7 taxi in Korba or Raipur with Khatu Rides Travels Co.?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can book a cab 24/7 by calling our Korba dispatch desk at +91-9893694232 or our Raipur branch at +91-9244137353, or directly online at khaturidescg.in for instant confirmation and transparent pricing.",
            },
          },
          {
            "@type": "Question",
            name: "Do you provide one-way taxi service between Korba, Bilaspur, and Raipur Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Khatu Rides Travels Co. specializes in one-way outstation cabs between Korba, Bilaspur, Uslapur, Raigarh, and Swami Vivekananda Airport Raipur so you only pay for your single-side drop with zero hidden charges.",
            },
          },
          {
            "@type": "Question",
            name: "Are cabs available for early morning flights at Raipur Airport and Jharsuguda Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we operate 24/7 including early morning (4:00 AM to 12:00 PM) and late-night airport pickups and drops at both Swami Vivekananda Airport Raipur and Veer Surendra Sai Airport Jharsuguda.",
            },
          },
          {
            "@type": "Question",
            name: "What vehicles are available for outstation and corporate travel in Chhattisgarh?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer AC Sedans (Swift Dzire, Hyundai Aura), 7-seater SUVs/MUVs (Maruti Ertiga, Toyota Innova Crysta, Innova Hycross), luxury cars, and Tempo Travellers with experienced, verified drivers.",
            },
          },
          {
            "@type": "Question",
            name: "Does Khatu Rides provide monthly corporate car rentals for NTPC, BALCO, and SECL in Korba?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we provide dedicated daily and monthly corporate cab services for executives, engineers, and staff across NTPC Jamnipali, BALCO Township, SECL Dipka, Gevra, Kusmunda, CSEB, and industrial plants in Korba and Raipur.",
            },
          },
          {
            "@type": "Question",
            name: "Do you offer interstate cabs from Ranchi and Jharsuguda to Chhattisgarh cities?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Khatu Rides operates direct interstate one-way and round-trip taxis connecting Ranchi and Jharsuguda with Korba, BALCO, Bilaspur, Uslapur, Raigarh, Ambikapur, Raipur, and Durg-Bhilai.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html
      lang="en-IN"
      className="scroll-smooth"
      style={
        {
          // Local system fonts: no build-time Google Fonts download required.
          "--font-sans":
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        } as React.CSSProperties
      }
    >
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
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body className="antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow w-full flex flex-col">{children}</main>

        {/* Public popup and footer are hidden automatically on every /admin route. */}
        <SiteChrome />
      </body>
    </html>
  );
}