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
      "Khatu Rides Travels Co. | 24/7 Taxi & One-Way Cab Service in Korba, Raipur & Ambikapur",
    template: "%s | Khatu Rides Travels Co.",
  },

  description:
    "Khatu Rides Travels Co. is Chhattisgarh's trusted 24/7 taxi, one-way cab, and car rental service operating from Korba (Bus Stand Road) and Raipur. Book airport transfers for Swami Vivekananda Airport (Raipur), Jharsuguda (JRG), Bilaspur (Chakarbhata), Darima (Ambikapur) & Ranchi, corporate monthly cabs (NTPC, BALCO, SECL), and intercity taxis across Bilaspur, Uslapur, Raigarh, Durg-Bhilai, Ambikapur, Garhwa, Daltonganj, Varanasi, Renukoot, Prayagraj, Ayodhya, Patna & Gaya. Clean Swift Dzire, Ertiga, Innova Crysta & Tempo Traveller with verified drivers and zero hidden charges.",

  applicationName: "Khatu Rides Travels Co.",
  category: "Taxi Service & Car Rental Co.",
  authors: [{ name: "Khatu Rides Travels Co.", url: siteUrl }],
  creator: "Khatu Rides Travels Co.",
  publisher: "Khatu Rides Travels Co.",

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  keywords: [
    // --- CORE BRAND & GOOGLE GBP OFFICIAL TAXI / CAR RENTAL CATEGORIES ---
    "Khatu Rides Travels Co.",
    "Khatu Rides Korba",
    "Khatu Rides Raipur",
    "Khatu Rides One-Way Taxi Raipur",
    "rahul travels",
    "rahul travels jagdalpur",
    "rahul travels raipur",
    "rahul travels bilaspur",
    "rahul travels raigarh",
    "rahul travels jharsuguda",
    "rahul travels korba",
    "taxi service",
    "cab service",
    "car rental company",
    "car rental service",
    "airport shuttle service provider",
    "chauffeur service",
    "minibus taxi service",
    "transportation service",
    "sightseeing tour operator",
    "airport taxis",
    "corporate taxis",
    "long distance taxi",
    "sedans",
    "suv taxi",
    "luxury vehicles",
    "minivan taxi",
    "van taxi",
    "car pick-up and drop-off",
    "corporate rentals",
    "long-term car hire",
    "online car-hire booking",
    "best taxi service in chhattisgarh",
    "24x7 cab booking chhattisgarh",
    "one way taxi chhattisgarh",
    "one way cab service",
    "one way car rental and booking",
    "outstation cab booking chhattisgarh",
    "intercity taxi service chhattisgarh",
    "chhattisgarh and odisha intercity cab services",
    "chhattisgarh outstation car rental",
    "online cab booking chhattisgarh",
    "corporate car rental chhattisgarh",
    "monthly cab service for companies",
    "airport pickup and drop taxi",
    "railway station taxi services",
    "emergency taxi service near me",
    "wedding car rental chhattisgarh",
    "local city rental and hourly cab",
    "round trip taxi and cab packages",
    "outstation family vacation cab rental",
    "weekend family tour car rental",
    "industrial plant visitor taxi service",

    // --- KORBA DISTRICT, INDUSTRIAL BELT & OUTSTATION ROUTES ---
    "korba taxi service",
    "taxi service in korba",
    "cab booking in korba",
    "best cab service in korba",
    "car rental in korba",
    "korba local taxi service",
    "korba airport taxi service",
    "korba railway station taxi",
    "korba railway station pickup and drop",
    "korba outstation taxi service",
    "korba route cab services",
    "korba taxi contact number",
    "24 hours taxi korba",
    "24x7 taxi service in korba",
    "24x7 car rental korba",
    "night cab service korba",
    "late night taxi korba",
    "safe night travel korba",
    "emergency cab korba",
    "urgent taxi booking korba",
    "airport drop taxi korba",
    "one way cab korba",
    "round trip taxi korba",
    "intercity taxi korba",
    "outstation car rental korba",
    "korba bus stand road taxi",
    "transport nagar korba taxi service",
    "transport nagar local and outstation taxi",
    "korba transport nagar wedding car rental",
    "tp nagar korba cab booking",
    "cseb chowk korba taxi",
    "niharika korba cab service",
    "ghantaghar korba taxi hire",
    "balco korba taxi service",
    "balco township cab booking",
    "ntpc korba taxi hire",
    "ntpc jamnipali corporate cab service",
    "ntpc jamnipali shadi and baaraat cab service",
    "dipka korba taxi service",
    "gevra secl cab booking",
    "secl gevra dipka corporate cab rental",
    "secl and gevra wedding fleet booking",
    "24/7 emergency night cab gevra",
    "kusmunda korba taxi",
    "kusmunda colony airport drop cab",
    "katghora taxi service",
    "katghora one-way outstation drop",
    "katghora and pali marriage outstation cabs",
    "pali temple sightseeing cab",
    "bankimongra cab hire",
    "darri korba taxi service",
    "pali korba outstation cab",
    "urga korba taxi booking",
    "korba to pasan outstation drop",
    "korba to dipka taxi service",
    "korba to ntpc taxi service",
    "korba to raipur taxi",
    "korba to raipur one way cab",
    "korba to raipur premium taxi service",
    "korba to raipur airport taxi",
    "korba to raipur airport cab fare",
    "korba to bilaspur one way taxi",
    "korba to bilaspur express cab",
    "korba to uslapur railway station cab",
    "korba to raigarh taxi service",
    "korba to raigarh industrial corridor cab",
    "korba to ambikapur intercity taxi",
    "korba to jharsuguda airport taxi",
    "korba to ranchi outstation cab",
    "korba to jagdalpur cab booking",
    "corporate taxi service in korba",
    "corporate taxi booking korba",
    "cab for business trip korba",
    "monthly car rental ntpc balco secl",

    // --- RAIPUR DISTRICT, AIRPORT HUB & OUTSTATION ROUTES ---
    "raipur taxi service",
    "taxi service in raipur",
    "cab booking in raipur",
    "best taxi service in raipur",
    "best cab service in raipur",
    "raipur car rental with driver",
    "raipur local taxi service",
    "raipur local taxi fare",
    "hourly rental cab raipur",
    "cab booking number raipur",
    "one way taxi raipur",
    "one-way cab raipur",
    "raipur route cab services",
    "raipur outstation taxi service",
    "cabs in raipur chhattisgarh",
    "raipur airport taxi service",
    "raipur airport drop taxi",
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
    "nava raipur mantralaya cab",
    "pachpedi naka raipur cab",
    "bhatagaon bus stand raipur taxi",
    "corporate car rental raipur",
    "commercial vehicle on rent raipur",
    "raipur airport to korba taxi",
    "raipur to korba one way taxi",
    "raipur to korba taxi fare",
    "raipur to korba drop taxi",
    "raipur airport to bilaspur taxi",
    "raipur to bilaspur one way cab",
    "raipur to bilaspur taxi fare",
    "raipur to bilaspur drop taxi",
    "raipur airport to raigarh taxi",
    "raipur to raigarh one way cab",
    "raipur to raigarh taxi fare",
    "raipur to jindal raigarh cab",
    "raipur to tamnar taxi",
    "raipur airport to ambikapur taxi",
    "raipur to ambikapur one way cab",
    "raipur to ambikapur taxi fare",
    "raipur to surajpur taxi",
    "raipur to bishrampur cab",
    "raipur to durg bhilai taxi",
    "raipur to jagdalpur bastar cab",
    "raipur to nagpur cab service",
    "raipur to ranchi taxi service",
    "raipur to jharsuguda cab",
    "raipur to sambalpur one way taxi",
    "raipur to varanasi long distance taxi",

    // --- BILASPUR & JANJGIR-CHAMPA SUB-LOCALITIES ---
    "bilaspur taxi service",
    "bilaspur local taxi service",
    "bilaspur airport taxi service",
    "bilaspur railway station taxi",
    "bilaspur railway station pickup drop",
    "bilaspur outstation taxi service",
    "bilaspur route cab services",
    "outstation car rental bilaspur",
    "wedding car rental bilaspur",
    "bilaspur to korba one way cab",
    "bilaspur to raipur airport cab",
    "bilaspur to raigarh one way cab",
    "bilaspur to jharsuguda one way cab",
    "bilaspur to jagdalpur one way cab",
    "bilaspur to ambikapur one way cab",
    "uslapur railway station taxi service",
    "bilaspur junction cab pickup",
    "vyapar vihar bilaspur taxi",
    "chakarbhata bilaspur airport cab",
    "seepat ntpc bilaspur taxi",
    "champa local taxi service",
    "champa railway station pickup drop",
    "champa to korba taxi drop",
    "champa to bilaspur outstation cab",
    "champa to raipur airport taxi",
    "champa to janjgir naila cab",
    "naila janjgir cab booking",
    "sakti taxi service",
    "akaltara cab hire",

    // --- AMBIKAPUR ORIGIN HUB (CG, UP, JHARKHAND & BIHAR ROUTES) ---
    "ambikapur taxi service",
    "best taxi service in ambikapur",
    "ambikapur local taxi service",
    "ambikapur airport taxi service",
    "ambikapur railway station taxi",
    "ambikapur outstation taxi service",
    "online cab booking ambikapur",
    "surguja outstation cab",
    "ambikapur to raipur taxi service",
    "ambikapur to raipur one way cab",
    "ambikapur to raipur airport cab booking",
    "ambikapur to mana airport taxi",
    "ambikapur to aiims raipur taxi",
    "ambikapur to raipur cab fare",
    "bishrampur to raipur taxi",
    "surajpur to raipur cab",
    "ambikapur to bilaspur taxi",
    "ambikapur to bilaspur one way cab",
    "ambikapur to uslapur station cab",
    "ambikapur to chakarbhata airport cab",
    "ambikapur to high court bilaspur cab",
    "ambikapur to apollo hospital taxi",
    "mainpat to bilaspur taxi",
    "lakhanpur to bilaspur cab",
    "ambikapur to korba taxi",
    "ambikapur to korba one way cab",
    "ambikapur to balco taxi",
    "ambikapur to ntpc jamnipali cab",
    "ambikapur to dipka secl taxi",
    "ambikapur to gevra cab",
    "ambikapur to kusmunda taxi",
    "ambikapur to katghora cab",
    "ambikapur to raigarh taxi",
    "ambikapur to jspl raigarh taxi",
    "ambikapur to tamnar cab",
    "ambikapur to pathalgaon taxi",
    "ambikapur to durg taxi",
    "ambikapur to bhilai one way cab",
    "ambikapur to bhilai steel plant taxi",
    "ambikapur to varanasi taxi",
    "ambikapur to banaras one way cab",
    "ambikapur to bhu hospital cab",
    "ambikapur to babatpur airport cab",
    "ambikapur to kashi vishwanath taxi",
    "ambikapur to ddu junction cab",
    "ambikapur to mughalsarai taxi",
    "wadrafnagar to varanasi taxi",
    "pratappur to varanasi cab",
    "ambikapur to renukoot taxi",
    "ambikapur to hindalco renukoot cab",
    "ambikapur to shaktinagar ntpc cab",
    "ambikapur to anpara taxi",
    "ambikapur to obra cab",
    "ambikapur to robertsganj taxi",
    "ambikapur to sonbhadra cab",
    "ambikapur to singrauli taxi",
    "ambikapur to prayagraj taxi",
    "ambikapur to allahabad taxi",
    "ambikapur to sangam cab",
    "ambikapur to ayodhya ram mandir cab",
    "ambikapur to ayodhya dham taxi",
    "ambikapur to vindhyachal cab",
    "ambikapur to mirzapur taxi",
    "ambikapur to ranchi taxi",
    "ambikapur to birsa munda airport cab",
    "ambikapur to rims hospital ranchi cab",
    "ambikapur to hatia station taxi",
    "ambikapur to gumla taxi",
    "ambikapur to netarhat tour cab",
    "ambikapur to garhwa taxi",
    "ambikapur to garhwa road junction cab",
    "ambikapur to daltonganj taxi",
    "ambikapur to medininagar taxi",
    "ambikapur to palamu outstation cab",
    "ambikapur to betla national park cab",
    "ambikapur to ramanujganj cab",
    "ambikapur to balrampur taxi",
    "ambikapur to patna taxi",
    "ambikapur to patna airport taxi",
    "ambikapur to gaya taxi",
    "ambikapur to bodh gaya cab",
    "ambikapur to gaya pind daan cab",
    "ambikapur to sasaram taxi",
    "ambikapur to dehri on sone cab",
    "ambikapur to aurangabad bihar taxi",

    // --- RAIGARH, DURG-BHILAI, JAGDALPUR & SAMBALPUR ---
    "raigarh taxi service",
    "raigarh local taxi service",
    "raigarh airport taxi service",
    "raigarh railway station taxi",
    "raigarh outstation taxi service",
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
    "jagdalpur bastar taxi service",
    "jagdalpur to raipur one way taxi",
    "jagdalpur to bilaspur one way cab",
    "sambalpur taxi service",
    "sambalpur to raipur one way taxi",

    // --- GARHWA (JHARKHAND) ORIGIN HUB ---
    "garhwa taxi service",
    "taxi service in garhwa",
    "best taxi service in garhwa",
    "cab booking in garhwa",
    "garhwa road junction taxi",
    "garhwa railway station cab",
    "garhwa local taxi service",
    "garhwa outstation taxi",
    "garhwa one way taxi",
    "garhwa car rental with driver",
    "garhwa to ramanujganj taxi service",
    "garhwa to ambikapur taxi cab service",
    "garhwa to korba taxi cab service",
    "garhwa to balco korba taxi cab service",
    "garhwa to raipur taxi cab service",
    "garhwa to raipur airport taxi",
    "garhwa to bilaspur taxi cab service",
    "garhwa to bilaspur high court cab",
    "garhwa to raigarh taxi cab service",
    "garhwa to jindal raigarh cab",
    "garhwa to durg bhilai taxi cab service",
    "garhwa to bhilai steel plant cab",

    // --- RANCHI (JHARKHAND) & JHARSUGUDA AIRPORT (ODISHA) HUBS ---
    "ranchi to korba taxi service",
    "ranchi to korba one way cab",
    "ranchi to korba corporate cab",
    "ranchi to raipur one way cab",
    "ranchi airport to raipur cab",
    "ranchi to bilaspur taxi service",
    "ranchi to raigarh taxi service",
    "ranchi to ambikapur taxi service",
    "ranchi to uslapur taxi service",
    "ranchi airport to uslapur cab",
    "ranchi to balco taxi service",
    "ranchi airport to balco cab",
    "ranchi to durg bhilai taxi service",
    "ranchi airport to durg bhilai cab",
    "jharsuguda taxi service",
    "urgent taxi in jharsuguda",
    "jharsuguda airport taxi service",
    "jharsuguda airport to korba taxi",
    "vss airport jharsuguda to korba cab",
    "veer surendra sai airport to korba cab",
    "jharsuguda airport to balco taxi",
    "jharsuguda to dipka cab",
    "jharsuguda to gevra taxi",
    "jharsuguda airport to raigarh cab",
    "jharsuguda to raigarh one way taxi",
    "jharsuguda to bilaspur one way cab",
    "jharsuguda to raipur taxi",
    "jharsuguda to sambalpur outstation taxi",

    // --- FLEET & VEHICLE-SPECIFIC HIGH-INTENT KEYWORDS ---
    "swift dzire taxi korba",
    "sedan cab booking raipur",
    "ertiga cab booking korba",
    "ertiga 7 seater taxi raipur",
    "innova crysta on rent in raipur",
    "innova crysta hire korba",
    "innova crysta and ertiga rental raipur",
    "innova hycross taxi chhattisgarh",
    "suv taxi service korba",
    "luxury car rental korba raipur",
    "tempo traveller on rent raipur korba",
    "minibus taxi hire chhattisgarh",
  ],

  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": siteUrl,
    },
  },

  // Hyperlocal GEO Crawling Meta Tags
  other: {
    "geo.region": "IN-CT",
    "geo.placename": "Korba, Raipur, Ambikapur, Chhattisgarh",
    "geo.position": "22.3595;82.7501",
    ICBM: "22.3595, 82.7501",
  },

  openGraph: {
    title:
      "Khatu Rides Travels Co. | 24/7 Taxi & One-Way Cab Service in Korba, Raipur & Ambikapur",
    description:
      "24/7 one-way cabs, Raipur & Jharsuguda Airport transfers, corporate car rentals (NTPC, BALCO, SECL), and intercity taxis across Chhattisgarh, Jharkhand (Ranchi, Garhwa), Odisha, UP (Varanasi, Prayagraj, Ayodhya) & Bihar (Patna, Gaya).",
    url: siteUrl,
    siteName: "Khatu Rides Travels Co.",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${siteUrl}/hero/main%20image.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Co. - 24/7 Taxi & Outstation Cab Service in Korba, Raipur and Ambikapur",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Khatu Rides Travels Co. | 24/7 Taxi Service in Korba, Raipur & Ambikapur",
    description:
      "Book one-way outstation cabs, airport pickups, and corporate taxis across Korba, Raipur, Bilaspur, Raigarh, Ambikapur, Garhwa, Ranchi, Jharsuguda, Varanasi & Patna.",
    images: [`${siteUrl}/hero/main%20image.png`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
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
        alternateName: [
          "Khatu Rides",
          "Khatu Rides Travels",
          "Khatu Rides One-Way Taxi Raipur",
        ],
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
        image: `${siteUrl}/hero/main%20image.png`,
        email: "khaturides@gmail.com",
        description:
          "Premier 24/7 taxi, one-way cab, airport transfer, and corporate fleet rental provider serving Chhattisgarh (Korba, Raipur, Bilaspur, Raigarh, Durg-Bhilai, Ambikapur, Jagdalpur), Jharkhand (Ranchi, Garhwa, Daltonganj), Odisha (Jharsuguda, Sambalpur), Uttar Pradesh (Varanasi, Renukoot, Prayagraj, Ayodhya), and Bihar (Patna, Gaya, Sasaram).",
        knowsAbout: [
          "One Way Outstation Taxi Service",
          "Swami Vivekananda Airport Raipur Transfers",
          "Veer Surendra Sai Airport Jharsuguda Transfers",
          "Bilasa Devi Kevat Airport Chakarbhata Transfers",
          "Maa Mahamaya Airport Darima Ambikapur Transfers",
          "Birsa Munda Airport Ranchi Transfers",
          "Corporate Monthly Car Rental for NTPC, BALCO, SECL, and JSPL",
          "Intercity Cab Service in Chhattisgarh, Jharkhand, Odisha, Uttar Pradesh, and Bihar",
          "Swift Dzire, Maruti Ertiga, Toyota Innova Crysta, and Tempo Traveller Rentals",
          "Wedding Fleet and Pilgrimage Tour Cabs (Varanasi, Prayagraj, Ayodhya, Bodh Gaya)",
        ],
        areaServed: [
          { "@type": "State", name: "Chhattisgarh" },
          { "@type": "State", name: "Jharkhand" },
          { "@type": "State", name: "Odisha" },
          { "@type": "State", name: "Uttar Pradesh" },
          { "@type": "State", name: "Bihar" },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: korbaPhone,
            contactType: "customer service",
            areaServed: [
              "Korba",
              "Bilaspur",
              "Raigarh",
              "Ambikapur",
              "Garhwa",
              "Jharsuguda",
              "Ranchi",
              "Varanasi",
              "Patna",
              "IN",
            ],
            availableLanguage: ["Hindi", "English"],
          },
          {
            "@type": "ContactPoint",
            telephone: raipurPhone,
            contactType: "reservations",
            areaServed: [
              "Raipur",
              "Durg",
              "Bhilai",
              "Jagdalpur",
              "Bilaspur",
              "Korba",
              "Raigarh",
              "Ambikapur",
              "IN",
            ],
            availableLanguage: ["Hindi", "English"],
          },
        ],
      },

      // 2. WEBSITE ENTITY (Google Site Name)
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Khatu Rides Travels Co.",
        alternateName: [
          "Khatu Rides",
          "Khatu Rides Travels",
          "khaturidescg.in",
        ],
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
          "24/7 taxi service in Korba located at Bus Stand Road. Specializing in Korba to Raipur Airport drops, Bilaspur & Uslapur railway station transfers, corporate monthly cabs for NTPC, BALCO, SECL (Dipka, Gevra, Kusmunda), wedding fleets, and intercity rides across Ambikapur, Raigarh, Jharsuguda, Ranchi, Garhwa, Varanasi, Renukoot, Prayagraj, Ayodhya, Patna, and Gaya.",
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
          { "@type": "City", name: "Surajpur" },
          { "@type": "City", name: "Bishrampur" },
          { "@type": "City", name: "Jharsuguda" },
          { "@type": "City", name: "Ranchi" },
          { "@type": "City", name: "Garhwa" },
          { "@type": "City", name: "Daltonganj" },
          { "@type": "City", name: "Varanasi" },
          { "@type": "City", name: "Renukoot" },
          { "@type": "City", name: "Prayagraj" },
          { "@type": "City", name: "Ayodhya" },
          { "@type": "City", name: "Patna" },
          { "@type": "City", name: "Gaya" },
          { "@type": "City", name: "Sasaram" },
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
          name: "Korba & Ambikapur Hub Taxi Services",
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
                name: "Ambikapur Intercity & Interstate Taxi Hub",
                description:
                  "24/7 AC cabs from Ambikapur to Raipur, Bilaspur, Korba, Raigarh, Durg-Bhilai, Varanasi, Renukoot, Prayagraj, Ayodhya, Ranchi, Garhwa, Daltonganj, Patna, Gaya, and Sasaram.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Airport Taxi (Raipur, Jharsuguda, Bilaspur & Darima Airport)",
                description:
                  "24/7 punctual pickup and drop cabs for Swami Vivekananda Airport Raipur, VSS Airport Jharsuguda, Chakarbhata Airport, and Darima Airport.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Corporate & Industrial Monthly Car Rental",
                description:
                  "Dedicated monthly and daily corporate cabs for NTPC Jamnipali, BALCO, SECL (Dipka, Gevra, Kusmunda), CSEB, and JSPL industrial plants.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Sedan, SUV, Luxury & Wedding Fleet Hire",
                description:
                  "Well-maintained Swift Dzire, Maruti Ertiga, Toyota Innova Crysta, luxury wedding cars, and Tempo Travellers with verified drivers.",
              },
            },
          ],
        },
      },

      // 4. RAIPUR BRANCH ENTITY (Dedicated Phone & Raipur Airport Hub)
      {
        "@type": "TaxiService",
        "@id": `${siteUrl}/#raipur-branch`,
        name: "Khatu Rides One-Way Taxi Raipur",
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
          "24/7 Raipur taxi service specializing in Swami Vivekananda Airport (Mana) pickups, early morning airport transfers, Raipur Railway Station cabs, corporate rentals, and one-way outstation taxis to Korba, Bilaspur, Durg, Bhilai, Raigarh, Ambikapur, Jagdalpur, Nagpur, Varanasi, Garhwa, and Jharsuguda.",
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
          { "@type": "Place", name: "Nava Raipur Atal Nagar" },
          { "@type": "City", name: "Durg" },
          { "@type": "City", name: "Bhilai" },
          { "@type": "City", name: "Bilaspur" },
          { "@type": "City", name: "Korba" },
          { "@type": "City", name: "Raigarh" },
          { "@type": "City", name: "Ambikapur" },
          { "@type": "City", name: "Jagdalpur" },
          { "@type": "City", name: "Jharsuguda" },
          { "@type": "City", name: "Garhwa" },
          { "@type": "City", name: "Nagpur" },
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
          name: "Raipur Airport, Jharsuguda & Garhwa Outstation Taxi Services",
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
                  "Affordable one-way taxi drops from Raipur to Korba, Bilaspur, Raigarh, Durg, Bhilai, Ambikapur, Jagdalpur, Nagpur, and Varanasi.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Jharsuguda Airport & Garhwa Interstate Taxi Service",
                description:
                  "24/7 pre-booked one-way cabs from Jharsuguda Airport (JRG) and Garhwa Road Junction to Korba, BALCO, Dipka, Gevra, Raigarh, Bilaspur, Ambikapur, Raipur, and Durg-Bhilai.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Corporate & Hourly Car Rental in Raipur",
                description:
                  "Executive sedans, 7-seater Ertiga, and Innova Crysta for Mantralaya, Nava Raipur business meetings, and local 8hr/80km packages.",
              },
            },
          ],
        },
      },

      // 5. MAJOR INTERCITY ROUTE CATALOG (GEO Entity Graph for AI Search)
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#intercity-routes`,
        name: "Major Intercity & Interstate Taxi Routes by Khatu Rides Travels Co.",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Korba to Raipur Airport & City One-Way Taxi (200 km | 4 - 4.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Ambikapur to Raipur & Swami Vivekananda Airport Taxi (335 - 340 km | 6.5 - 7 hrs)",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Ambikapur to Bilaspur, Uslapur & Chakarbhata Airport Taxi (220 - 225 km | 4.5 - 5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Ambikapur to Korba, BALCO, NTPC & SECL Belt Taxi (180 - 185 km | 4 - 4.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Ambikapur to Varanasi (BHU, Babatpur Airport & Kashi) Taxi (325 - 340 km | 7.5 - 8.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Ambikapur to Renukoot, Shaktinagar & Sonbhadra Taxi (165 - 185 km | 3.5 - 4.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "Ambikapur to Prayagraj & Ayodhya Ram Mandir Taxi (410 - 520 km | 9 - 11.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 8,
            name: "Ambikapur to Ranchi (Birsa Munda Airport & RIMS) Taxi (305 - 330 km | 6.5 - 7.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 9,
            name: "Ambikapur & Garhwa to Daltonganj, Palamu & Chhattisgarh Belt Taxi (145 - 195 km | 3.5 - 5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 10,
            name: "Ambikapur to Patna, Gaya (Bodh Gaya) & Sasaram Taxi (270 - 440 km | 6 - 10 hrs)",
          },
          {
            "@type": "ListItem",
            position: 11,
            name: "Jharsuguda Airport (JRG) to Korba, BALCO, Dipka & Raigarh Taxi (180 km | 4 - 4.5 hrs)",
          },
          {
            "@type": "ListItem",
            position: 12,
            name: "Ranchi to Korba, Bilaspur, Uslapur, Raigarh, Raipur & Durg-Bhilai One-Way Taxi",
          },
        ],
      },

      // 6. FAQ SCHEMA (AEO & GEO — Direct Answers for Google AI Overviews & Voice Search)
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How can I book a 24/7 taxi in Korba, Raipur, or Ambikapur with Khatu Rides Travels Co.?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can book a cab 24/7 by calling our Korba Head Office at +91-9893694232 or our Raipur Airport Hub at +91-9244137353, or directly online at khaturidescg.in for instant driver confirmation and transparent fares.",
            },
          },
          {
            "@type": "Question",
            name: "Do you provide one-way taxi service between Korba, Bilaspur, Ambikapur, and Raipur Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Khatu Rides Travels Co. specializes in one-way outstation cabs connecting Korba, Bilaspur, Uslapur, Raigarh, and Ambikapur with Swami Vivekananda Airport Raipur so you pay only for your single-side drop with zero hidden charges.",
            },
          },
          {
            "@type": "Question",
            name: "Are cabs available for early morning flights at Raipur Airport and Jharsuguda Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we operate 24/7 including early morning (4:00 AM to 12:00 PM) and late-night flight-tracked airport pickups and drops at Swami Vivekananda Airport (Raipur), Veer Surendra Sai Airport (Jharsuguda), Chakarbhata Airport (Bilaspur), and Darima Airport (Ambikapur).",
            },
          },
          {
            "@type": "Question",
            name: "Can I book an outstation taxi from Ambikapur to Varanasi, Prayagraj, Ayodhya, Patna, or Ranchi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Khatu Rides offers 24/7 one-way and round-trip AC cabs (Swift Dzire, Maruti Ertiga, Innova Crysta) from Ambikapur to Varanasi (325-340 km), Renukoot/Shaktinagar (165-185 km), Prayagraj (410-425 km), Ayodhya (500-520 km), Ranchi (305-330 km), Garhwa/Daltonganj (145-195 km), and Patna/Gaya/Sasaram (270-440 km).",
            },
          },
          {
            "@type": "Question",
            name: "Do you operate direct cabs from Garhwa and Ranchi to Korba, BALCO, Raigarh, Bilaspur, and Raipur?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we provide doorstep pickups from Garhwa, Garhwa Road Junction, Ranka More, and Ranchi (including Birsa Munda Airport) for direct drops to Ramanujganj, Ambikapur, Korba, BALCO, Dipka, Gevra, Bilaspur, Uslapur, Raigarh, Raipur, and Durg-Bhilai.",
            },
          },
          {
            "@type": "Question",
            name: "What vehicles are available for outstation, wedding, and corporate travel in Chhattisgarh?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer clean AC Sedans (Swift Dzire, Hyundai Aura), 7-seater SUVs/MUVs (Maruti Ertiga, Toyota Innova Crysta, Innova Hycross), luxury wedding cars, and Tempo Travellers with experienced, verified highway drivers.",
            },
          },
          {
            "@type": "Question",
            name: "Does Khatu Rides provide monthly corporate car rentals for NTPC, BALCO, SECL, and JSPL?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we provide dedicated daily and monthly corporate cab services for executives, engineers, and staff across NTPC Jamnipali, BALCO Township, SECL Dipka, Gevra, Kusmunda, CSEB, JSPL Raigarh, and Nava Raipur Mantralaya.",
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