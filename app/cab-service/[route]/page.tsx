// app/cab-service/[route]/page.tsx

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar";
import FloatingContact from "@/components/FloatingContact";

import {
  MapPin,
  ShieldCheck,
  Clock,
  CreditCard,
  CheckCircle2,
  CarFront,
  Search,
  Phone,
  ArrowRight,
  Navigation,
} from "lucide-react";

/* =========================================================
   SITE CONFIGURATION (SYNCED WITH app/layout.tsx)
========================================================= */

const SITE_URL = "https://khaturidescg.in";
const BUSINESS_NAME = "Khatu Rides Travels Co.";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";
const OG_IMAGE = `${SITE_URL}/hero/main%20image.png`;

/* =========================================================
   HUB MASTER DATA (84 VERIFIED HUBS SYNCED WITH GBP)
========================================================= */

type HubCategory =
  | "major-city"
  | "industrial"
  | "district"
  | "tourism"
  | "interstate";

type Hub = {
  name: string;
  slug: string;
  category: HubCategory;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createRouteSlug(fromSlug: string, toSlug: string) {
  return `${fromSlug}-to-${toSlug}`;
}

const HUBS: Hub[] = [
  // 1. Major Cities & Commercial Hubs
  ...[
    "Raipur",
    "Naya Raipur",
    "Bilaspur",
    "Durg",
    "Bhilai",
    "Korba",
    "Raigarh",
    "Ambikapur",
    "Jagdalpur",
    "Rajnandgaon",
  ].map((name) => ({ name, slug: slugify(name), category: "major-city" as const })),

  // 2. Industrial, Mining & Railway Transit Belts
  ...[
    "Champa",
    "Kharsia",
    "Katghora",
    "Dipka",
    "Gevra",
    "Kusmunda",
    "Balco",
    "Jamnipali",
    "NTPC Sipat",
    "Akaltara",
    "Janjgir",
    "Sakti",
    "Bhatapara",
    "Tilda",
    "Baloda Bazar",
    "Uslapur",
    "Bishrampur",
    "Tamnar",
    "Gharghoda",
  ].map((name) => ({ name, slug: slugify(name), category: "industrial" as const })),

  // 3. District Headquarters & Mid-Size Towns
  ...[
    "Mahasamund",
    "Dhamtari",
    "Gariaband",
    "Kawardha",
    "Bemetara",
    "Balod",
    "Kanker",
    "Kondagaon",
    "Dantewada",
    "Sukma",
    "Bijapur",
    "Narayanpur",
    "Mungeli",
    "Pendra",
    "Gaurela",
    "Baikunthpur",
    "Surajpur",
    "Balrampur",
    "Jashpur",
    "Pathalgaon",
    "Manendragarh",
    "Lakhanpur",
    "Ramanujganj",
    "Wadrafnagar",
  ].map((name) => ({ name, slug: slugify(name), category: "district" as const })),

  // 4. Tourist & Pilgrimage Spots
  ...[
    "Dongargarh",
    "Mainpat",
    "Chitrakote",
    "Tirathgarh",
    "Sirpur",
    "Ratanpur",
    "Bhoramdeo",
    "Gangrel Dam",
    "Amarkantak",
    "Bastar",
  ].map((name) => ({ name, slug: slugify(name), category: "tourism" as const })),

  // 5. Inter-State Border Hubs (Odisha, MH, MP, Jharkhand, UP & Bihar)
  ...[
    "Jharsuguda",
    "Sambalpur",
    "Bargarh",
    "Rourkela",
    "Nagpur",
    "Gondia",
    "Jabalpur",
    "Ranchi",
    "Garhwa",
    "Daltonganj",
    "Patna",
    "Gaya",
    "Sasaram",
    "Varanasi",
    "Renukoot",
    "Shaktinagar",
    "Sonbhadra",
    "Prayagraj",
    "Ayodhya",
    "Deoghar",
    "Ujjain",
  ].map((name) => ({ name, slug: slugify(name), category: "interstate" as const })),
];

/* =========================================================
   VERIFIED ROUTE FACTS (AEO & GEO DIRECT ANSWERS)
   Keys are sorted alphabetically so both directions match.
========================================================= */

type RouteFacts = {
  distance: string;
  duration: string;
  highway: string;
};

const KNOWN_ROUTE_FACTS: Record<string, RouteFacts> = {
  "ambikapur__raipur": {
    distance: "Approx. 335 - 340 km",
    duration: "Approx. 6.5 - 7 hours",
    highway: "via NH-130 (Bilaspur & Katghora)",
  },
  "ambikapur__bilaspur": {
    distance: "Approx. 220 - 225 km",
    duration: "Approx. 4.5 - 5 hours",
    highway: "via NH-130",
  },
  "ambikapur__korba": {
    distance: "Approx. 180 - 185 km",
    duration: "Approx. 4 - 4.5 hours",
    highway: "via NH-130 & Katghora",
  },
  "ambikapur__raigarh": {
    distance: "Approx. 210 - 215 km",
    duration: "Approx. 4.5 - 5 hours",
    highway: "via Sitapur & Pathalgaon",
  },
  "ambikapur__bhilai": {
    distance: "Approx. 370 - 380 km",
    duration: "Approx. 7.5 - 8 hours",
    highway: "via NH-130 & Raipur",
  },
  "ambikapur__durg": {
    distance: "Approx. 375 - 385 km",
    duration: "Approx. 7.5 - 8 hours",
    highway: "via NH-130 & Raipur",
  },
  "ambikapur__varanasi": {
    distance: "Approx. 325 - 340 km",
    duration: "Approx. 7.5 - 8.5 hours",
    highway: "via Renukoot & Robertsganj",
  },
  "ambikapur__renukoot": {
    distance: "Approx. 165 - 185 km",
    duration: "Approx. 3.5 - 4.5 hours",
    highway: "via Wadrafnagar & NH-343",
  },
  "ambikapur__prayagraj": {
    distance: "Approx. 410 - 425 km",
    duration: "Approx. 9 - 10 hours",
    highway: "via Renukoot & Mirzapur",
  },
  "ambikapur__ayodhya": {
    distance: "Approx. 500 - 520 km",
    duration: "Approx. 10.5 - 11.5 hours",
    highway: "via Varanasi / Sultanpur",
  },
  "ambikapur__ranchi": {
    distance: "Approx. 305 - 330 km",
    duration: "Approx. 6.5 - 7.5 hours",
    highway: "via Gumla & NH-43",
  },
  "ambikapur__garhwa": {
    distance: "Approx. 145 - 155 km",
    duration: "Approx. 3.5 - 4 hours",
    highway: "via Balrampur, Ramanujganj & NH-343",
  },
  "ambikapur__daltonganj": {
    distance: "Approx. 185 - 195 km",
    duration: "Approx. 4.5 - 5 hours",
    highway: "via Ramanujganj & Garhwa",
  },
  "ambikapur__sasaram": {
    distance: "Approx. 270 - 285 km",
    duration: "Approx. 6 - 6.5 hours",
    highway: "via Garhwa & Dehri-on-Sone",
  },
  "ambikapur__gaya": {
    distance: "Approx. 350 - 375 km",
    duration: "Approx. 8 - 8.5 hours",
    highway: "via Garhwa & Aurangabad",
  },
  "ambikapur__patna": {
    distance: "Approx. 410 - 440 km",
    duration: "Approx. 9 - 10 hours",
    highway: "via Garhwa, Sasaram & Arwal",
  },
  "korba__raipur": {
    distance: "Approx. 200 km",
    duration: "Approx. 4 - 4.5 hours",
    highway: "via Bilaspur & NH-130",
  },
  "bilaspur__raipur": {
    distance: "Approx. 125 km",
    duration: "Approx. 2 - 2.5 hours",
    highway: "via NH-130",
  },
  "raigarh__raipur": {
    distance: "Approx. 250 km",
    duration: "Approx. 5 - 5.5 hours",
    highway: "via NH-53",
  },
  "jharsuguda__korba": {
    distance: "Approx. 180 km",
    duration: "Approx. 4 - 4.5 hours",
    highway: "via Raigarh",
  },
  "garhwa__ramanujganj": {
    distance: "Approx. 60 km",
    duration: "Approx. 1.5 - 2 hours",
    highway: "via Ranka & Godarmana",
  },
  "garhwa__korba": {
    distance: "Approx. 310 km",
    duration: "Approx. 7 - 7.5 hours",
    highway: "via Ramanujganj, Ambikapur & Katghora",
  },
  "balco__garhwa": {
    distance: "Approx. 315 km",
    duration: "Approx. 7 - 7.5 hours",
    highway: "via Ramanujganj, Ambikapur & Katghora",
  },
  "bilaspur__garhwa": {
    distance: "Approx. 375 km",
    duration: "Approx. 8 - 8.5 hours",
    highway: "via Ramanujganj, Ambikapur & Katghora",
  },
  "garhwa__raigarh": {
    distance: "Approx. 335 km",
    duration: "Approx. 7.5 - 8 hours",
    highway: "via Ramanujganj, Ambikapur & Pathalgaon",
  },
  "garhwa__raipur": {
    distance: "Approx. 490 km",
    duration: "Approx. 10 - 11 hours",
    highway: "via Ramanujganj, Ambikapur & Bilaspur",
  },
  "bhilai__garhwa": {
    distance: "Approx. 530 km",
    duration: "Approx. 11 - 12 hours",
    highway: "via Ambikapur, Bilaspur & Raipur",
  },
  "durg__garhwa": {
    distance: "Approx. 530 km",
    duration: "Approx. 11 - 12 hours",
    highway: "via Ambikapur, Bilaspur & Raipur",
  },
};

function getRouteFacts(originSlug: string, destinationSlug: string): RouteFacts | null {
  const key = [originSlug, destinationSlug].sort().join("__");
  return KNOWN_ROUTE_FACTS[key] ?? null;
}

/* =========================================================
   ROUTE RESOLUTION & VALIDATION
========================================================= */

type ResolvedRoute = {
  originHub: Hub;
  destinationHub: Hub;
  origin: string;
  destination: string;
  canonicalSlug: string;
  reverseSlug: string;
  facts: RouteFacts | null;
};

function resolveRoute(route: string): ResolvedRoute | null {
  const parts = route.split("-to-");
  if (parts.length !== 2) return null;

  const firstSlug = slugify(decodeURIComponent(parts[0]));
  const secondSlug = slugify(decodeURIComponent(parts[1]));

  if (!firstSlug || !secondSlug || firstSlug === secondSlug) return null;

  const originHub = HUBS.find((h) => h.slug === firstSlug);
  const destinationHub = HUBS.find((h) => h.slug === secondSlug);

  if (!originHub || !destinationHub) return null;

  return {
    originHub,
    destinationHub,
    origin: originHub.name,
    destination: destinationHub.name,
    canonicalSlug: createRouteSlug(originHub.slug, destinationHub.slug),
    reverseSlug: createRouteSlug(destinationHub.slug, originHub.slug),
    facts: getRouteFacts(originHub.slug, destinationHub.slug),
  };
}

/* =========================================================
   STATIC PARAMS (FAST BUILD + FULL ON-DEMAND COVERAGE)
   Pre-renders high-volume hub routes at build time;
   all remaining valid hub pairs render & cache via ISR.
========================================================= */

export const dynamicParams = true;

const PRIORITY_SLUGS = new Set([
  "korba",
  "raipur",
  "bilaspur",
  "ambikapur",
  "raigarh",
  "durg",
  "bhilai",
  "garhwa",
  "ranchi",
  "jharsuguda",
  "uslapur",
  "balco",
]);

export async function generateStaticParams() {
  const routes: { route: string }[] = [];

  for (let i = 0; i < HUBS.length; i++) {
    for (let j = 0; j < HUBS.length; j++) {
      if (i === j) continue;
      if (PRIORITY_SLUGS.has(HUBS[i].slug) || PRIORITY_SLUGS.has(HUBS[j].slug)) {
        routes.push({
          route: createRouteSlug(HUBS[i].slug, HUBS[j].slug),
        });
      }
    }
  }

  return routes;
}

/* =========================================================
   RELATED ROUTES (DYNAMIC INTERNAL LINKING)
========================================================= */

function getRelatedRoutes(resolved: ResolvedRoute) {
  const { originHub, destinationHub, reverseSlug } = resolved;

  const links: { name: string; href: string }[] = [
    {
      name: `${destinationHub.name} to ${originHub.name} Taxi`,
      href: `/cab-service/${reverseSlug}`,
    },
  ];

  const candidates = HUBS.filter(
    (h) => h.slug !== originHub.slug && h.slug !== destinationHub.slug
  );
  const startIdx = HUBS.findIndex((h) => h.slug === originHub.slug);
  const offset = startIdx >= 0 ? (startIdx * 5) % candidates.length : 0;

  for (let i = 0; i < 5 && i < candidates.length; i++) {
    const target = candidates[(offset + i) % candidates.length];
    links.push({
      name: `${originHub.name} to ${target.name} Taxi`,
      href: `/cab-service/${createRouteSlug(originHub.slug, target.slug)}`,
    });
  }

  return links;
}

/* =========================================================
   METADATA (SEO, AEO & GEO)
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string }>;
}): Promise<Metadata> {
  const { route: routeParam } = await params;
  const resolved = resolveRoute(routeParam);

  if (!resolved) {
    return {
      title: "Outstation Cab & One-Way Taxi Service",
      robots: { index: false, follow: true },
    };
  }

  const { origin, destination, canonicalSlug, facts } = resolved;

  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title = `${origin} to ${destination} Taxi | One-Way & Outstation Cab`;
  const fullTitle = `${title} | ${BUSINESS_NAME}`;

  const factSnippet = facts
    ? ` Distance: ${facts.distance} (${facts.duration}).`
    : "";

  const description = `Book 24/7 ${origin} to ${destination} one-way taxi & round-trip AC cabs (Swift Dzire, Ertiga, Innova Crysta) with ${BUSINESS_NAME}.${factSnippet} Verified drivers & zero hidden charges.`;

  const canonical = `${SITE_URL}/cab-service/${canonicalSlug}`;

  const keywords = [
    `${origin} to ${destination} taxi`,
    `${origin} to ${destination} taxi service`,
    `${origin} to ${destination} one way cab`,
    `${origin} to ${destination} cab fare`,
    `${origin} to ${destination} round trip cab`,
    `outstation cab ${origin} to ${destination}`,
    `cab service in ${origin}`,
    `book taxi ${origin} to ${destination}`,
    `${origin} to ${destination} Dzire cab`,
    `${origin} to ${destination} Ertiga taxi`,
    `${origin} to ${destination} Innova Crysta`,
    `24x7 taxi ${origin} to ${destination}`,
    BUSINESS_NAME,
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: BUSINESS_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${origin} to ${destination} Taxi Service - ${BUSINESS_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}

/* =========================================================
   MAIN PAGE COMPONENT
========================================================= */

export default async function DynamicRoutePage({
  params,
}: {
  params: Promise<{ route: string }>;
}) {
  const { route: routeParam } = await params;
  const resolved = resolveRoute(routeParam);

  if (!resolved) {
    notFound();
  }

  // Redirect legacy URLs with spaces or uppercase to clean canonical slug
  if (routeParam !== resolved.canonicalSlug) {
    permanentRedirect(`/cab-service/${resolved.canonicalSlug}`);
  }

  const { origin, destination, canonicalSlug, facts } = resolved;
  const canonical = `${SITE_URL}/cab-service/${canonicalSlug}`;
  const relatedRoutes = getRelatedRoutes(resolved);

  const faqs = [
    ...(facts
      ? [
          {
            question: `What is the distance and travel time from ${origin} to ${destination} by taxi?`,
            answer: `The road distance from ${origin} to ${destination} is ${facts.distance} (${facts.highway}), taking ${facts.duration} by AC cab depending on traffic and road conditions.`,
          },
        ]
      : []),
    {
      question: `Do you provide one-way cabs from ${origin} to ${destination}?`,
      answer: `Yes! ${BUSINESS_NAME} specializes in dedicated one-way drops. You pay only for the one-way journey from ${origin} to ${destination}, saving you from return fare charges.`,
    },
    {
      question: `Do I need to pay any advance to book a ${origin} to ${destination} taxi?`,
      answer: `No, ${BUSINESS_NAME} operates with transparent booking and zero hidden charges. Call or WhatsApp us at ${PHONE_DISPLAY} to get instant driver confirmation and pay transparently for your trip.`,
    },
    {
      question: `What types of cars are available for ${origin} to ${destination}?`,
      answer: `Depending on your group size and luggage, you can book clean AC 4-seater Sedans (Swift Dzire), 7-seater SUVs/MUVs (Maruti Ertiga), or premium Toyota Innova Crysta cabs with verified highway drivers.`,
    },
    {
      question: `Is 24/7 early morning or late-night cab pickup available from ${origin}?`,
      answer: `Yes, our dispatch operates 24/7 for early morning train/flight connections, medical visits, corporate travel, and late-night pickups from ${origin} to ${destination}.`,
    },
  ];

  // Unified SEO + AEO + GEO Knowledge Graph (@graph)
  // Linked directly to layout.tsx #organization and #website
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${origin} to ${destination} Taxi | One-Way & Outstation Cab | ${BUSINESS_NAME}`,
        description: `24/7 one-way, round-trip, and outstation cab service from ${origin} to ${destination} by ${BUSINESS_NAME}.`,
        inLanguage: "en-IN",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${canonical}#service`,
        },
        breadcrumb: {
          "@id": `${canonical}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cab Service",
            item: `${SITE_URL}/cab-service`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${origin} to ${destination} Taxi`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: `${origin} to ${destination} Taxi & Outstation Cab Service`,
        serviceType: "Outstation Taxi Service",
        url: canonical,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: [
          { "@type": "Place", name: origin },
          { "@type": "Place", name: destination },
        ],
        description: `Book reliable 24/7 one-way, round-trip, and outstation AC cabs from ${origin} to ${destination}${facts ? ` (${facts.distance}, ${facts.duration})` : ""} with verified drivers and transparent fares.`,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${origin} to ${destination} Cab Fleet`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Swift Dzire Sedan (${origin} to ${destination})`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Maruti Ertiga 7-Seater SUV (${origin} to ${destination})`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Toyota Innova Crysta (${origin} to ${destination})`,
              },
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  // Visible Route-Specific Intent Keywords
  const seoKeywords = [
    `${origin} to ${destination} taxi service`,
    `One way cab from ${origin} to ${destination}`,
    `${origin} to ${destination} round trip cab`,
    `Outstation taxi ${origin} to ${destination}`,
    `Affordable cab fare ${origin} to ${destination}`,
    `Book Innova Crysta from ${origin} to ${destination}`,
    `${origin} to ${destination} Ertiga 7-seater taxi`,
    `Swift Dzire cab ${origin} to ${destination}`,
    `Corporate cab ${origin} to ${destination}`,
    `Car rental ${origin} to ${destination}`,
    `24x7 taxi booking ${origin} to ${destination}`,
    `${origin} to ${destination} distance by cab`,
    `Reliable taxi service in ${origin}`,
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello ${BUSINESS_NAME}, I want to book a cab.\n\nFrom: ${origin}\nTo: ${destination}\n\nPlease share vehicle availability and best one-way/round-trip fare.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />

      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* Unified SEO + AEO + GEO JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        {/* Dynamic Hero Section */}
        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* TRUST BAR */}
        <div className="bg-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-lg relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/20">
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">10K+</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Happy Customers
                </p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">4.9/5</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Customer Ratings
                </p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">₹0</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Hidden Charges
                </p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">24/7</p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Booking Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTE OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                <MapPin className="w-4 h-4" /> 24/7 Outstation & One-Way Route
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Reliable Cab Service from{" "}
                <span className="text-amber-500">{origin}</span> to{" "}
                <span className="text-amber-500">{destination}</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed">
                Traveling between <strong>{origin}</strong> and{" "}
                <strong>{destination}</strong> has never been easier. At{" "}
                {BUSINESS_NAME}, we specialize in safe intercity travel. Whether
                you need a <strong className="text-slate-800">One-Way Drop</strong>,
                a <strong className="text-slate-800">Round Trip</strong>, or an{" "}
                <strong className="text-slate-800">Airport / Railway Transfer</strong>,
                we provide clean AC taxis at transparent, fixed or per-kilometer
                pricing.
              </p>

              {facts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <Navigation className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Road Distance
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        {facts.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Est. Travel Time
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        {facts.duration}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="space-y-3 mt-4">
                {[
                  `Direct One-Way Taxis from ${origin} to ${destination}`,
                  "Flexible Round-Trip Outstation & Corporate Packages",
                  "Verified, Experienced & Polite Highway Chauffeurs",
                  "Doorstep Pickup and Exact Drop Locations 24/7",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Route Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-0" />
                <h2 className="text-2xl font-black text-slate-900 mb-8 relative z-10">
                  Route Highlights
                </h2>

                <div className="relative border-l-4 border-dashed border-slate-200 ml-4 pl-8 space-y-10 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Pickup Origin
                    </p>
                    <p className="text-xl font-black text-slate-900">{origin}</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-slate-900" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Drop Destination
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {destination}
                    </p>
                  </div>
                </div>

                {facts && (
                  <p className="mt-6 text-xs font-semibold text-slate-500">
                    Preferred Highway Corridor:{" "}
                    <span className="text-slate-800">{facts.highway}</span>
                  </p>
                )}

                <div className="mt-6 p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <CarFront className="w-10 h-10 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Available AC Fleet
                    </p>
                    <p className="text-slate-900 font-semibold">
                      Sedan (Swift Dzire) | SUV (Ertiga / Innova Crysta)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR FEATURES */}
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Why Choose Us for {origin} to {destination}?
              </h2>
              <p className="text-slate-400 mt-4 text-lg">
                We focus on your safety, comfort, and pocket. Experience standard
                cab services elevated to a reliable intercity standard.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Transparent Billing
                </h3>
                <p className="text-slate-400">
                  No hidden tolls or surprise driver allowances at the end of the
                  trip. The fare quote you confirm for the {destination} drop is
                  clear upfront.
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Safe & Verified
                </h3>
                <p className="text-slate-400">
                  All our vehicles undergo regular maintenance and sanitation.
                  Our drivers are verified and experienced on Chhattisgarh and
                  interstate highway routes.
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  On-Time Always
                </h3>
                <p className="text-slate-400">
                  Whether it is an early morning train/flight connection or a
                  late-night arrival at {destination}, our cabs coordinate
                  punctual doorstep pickups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO & AEO FAQs SECTION */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="h-1.5 w-20 bg-amber-400 mx-auto mt-4 rounded-full" />
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition duration-300"
                >
                  <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                    <span className="text-amber-500">Q.</span> {faq.question}
                  </h3>
                  <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA inside FAQ */}
            <div className="mt-12 text-center bg-amber-50 p-8 rounded-3xl border border-amber-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to book your {origin} to {destination} ride?
              </h3>
              <p className="text-slate-600 mb-6">
                Get an instant fare quote and driver confirmation in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`tel:${PHONE}`}
                  className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg flex justify-center items-center gap-2"
                >
                  <Phone className="w-5 h-5" /> Call Now to Book
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-green-700 transition shadow-lg flex justify-center items-center gap-2"
                >
                  WhatsApp for Fare <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR SEARCHES */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">
                Popular Searches for {origin} to {destination}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-500 shadow-sm hover:border-amber-300 hover:text-slate-800 hover:bg-amber-50 transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED ROUTES (INTERNAL LINKING FOR CRAWL DEPTH) */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">
              Explore More Intercity Cab Routes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Check return trips and popular outstation cab connections from{" "}
              {origin}.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRoutes.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-amber-400 hover:bg-amber-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-600 transition group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}