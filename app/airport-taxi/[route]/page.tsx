// app/airport-taxi/[route]/page.tsx

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
  CheckCircle2,
  PlaneTakeoff,
  Luggage,
  CarFront,
  Search,
  Route,
  BriefcaseBusiness,
  CalendarCheck,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

/* =========================================================
   SITE CONFIGURATION
========================================================= */

const SITE_URL = "https://khaturidescg.in";
const BUSINESS_NAME = "Khatu Rides Travels Co.";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";
const OG_IMAGE = `${SITE_URL}/hero/main%20image.png`;

/* =========================================================
   SLUG UTILITIES
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildRouteSlug(originSlug: string, destinationSlug: string) {
  return `${originSlug}-to-${destinationSlug}`;
}

/* =========================================================
   AIRPORT MASTER DATA (5 REGIONAL & INTERSTATE AIRPORTS)
========================================================= */

const AIRPORTS = [
  {
    slug: "raipur-airport",
    name: "Swami Vivekananda Airport (Mana)",
    shortName: "Raipur Airport",
    city: "Raipur",
    state: "Chhattisgarh",
    context:
      "Plan your pickup or drop around your scheduled flight time, terminal requirements and preferred vehicle.",
    pickupTip:
      "For Raipur Airport arrivals, share your flight number, arrival time and contact details when requesting your cab.",
    dropTip:
      "For Raipur Airport departures, share your reporting time and preferred pickup location so the journey can be planned accordingly.",
  },
  {
    slug: "bilaspur-airport",
    name: "Bilasa Devi Kevat Airport (Chakarbhata)",
    shortName: "Bilaspur Airport",
    city: "Bilaspur",
    state: "Chhattisgarh",
    context:
      "Arrange a point-to-point cab between Bilaspur Airport (Chakarbhata) and your selected city or destination.",
    pickupTip:
      "For Bilaspur Airport arrivals, confirm your flight schedule and pickup coordination requirements before the journey.",
    dropTip:
      "For Bilaspur Airport departures, confirm your flight reporting time and pickup point before requesting a fare quote.",
  },
  {
    slug: "jharsuguda-airport",
    name: "Veer Surendra Sai Airport (JRG)",
    shortName: "Jharsuguda Airport",
    city: "Jharsuguda",
    state: "Odisha",
    context:
      "Plan an intercity airport transfer between Jharsuguda Airport (JRG) and your chosen destination across Odisha and Chhattisgarh.",
    pickupTip:
      "Share your arrival schedule, flight number and destination address to coordinate your Jharsuguda Airport pickup.",
    dropTip:
      "Share your departure schedule and pickup address to receive a suitable Jharsuguda Airport transfer quotation.",
  },
  {
    slug: "ambikapur-airport",
    name: "Maa Mahamaya Airport (Darima)",
    shortName: "Ambikapur Airport",
    city: "Ambikapur",
    state: "Chhattisgarh",
    context:
      "Arrange a reliable point-to-point cab between Maa Mahamaya Airport (Darima, Ambikapur) and Surguja or nearby districts.",
    pickupTip:
      "For Darima Airport arrivals, share your arrival timing and destination address in advance for smooth pickup coordination.",
    dropTip:
      "For Darima Airport departures, share your reporting time and pickup point so your cab can reach on schedule.",
  },
  {
    slug: "ranchi-airport",
    name: "Birsa Munda Airport (IXR)",
    shortName: "Ranchi Airport",
    city: "Ranchi",
    state: "Jharkhand",
    context:
      "Plan a direct interstate airport transfer between Birsa Munda Airport (Ranchi) and major cities across Jharkhand and Chhattisgarh.",
    pickupTip:
      "For Ranchi Airport arrivals, share your flight number, landing time and final drop city when requesting your cab.",
    dropTip:
      "For Ranchi Airport departures, share your pickup address and flight reporting time to plan a comfortable highway transfer.",
  },
] as const;

/* =========================================================
   HUB MASTER DATA (84 VERIFIED REGIONAL & INTERSTATE HUBS)
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
  region: string;
  context: string;
};

const HUBS: Hub[] = [
  // Major Cities
  {
    name: "Raipur",
    slug: "raipur",
    category: "major-city",
    region: "Central Chhattisgarh",
    context:
      "Raipur serves as an important commercial and travel hub for people travelling across Chhattisgarh.",
  },
  {
    name: "Naya Raipur",
    slug: "naya-raipur",
    category: "major-city",
    region: "Central Chhattisgarh",
    context:
      "Naya Raipur (Atal Nagar) is an important destination for institutional, Mantralaya, business and planned-city travel.",
  },
  {
    name: "Bilaspur",
    slug: "bilaspur",
    category: "major-city",
    region: "North-Central Chhattisgarh",
    context:
      "Bilaspur has regular High Court, medical, business, family and intercity travel requirements connecting it with major regional hubs.",
  },
  {
    name: "Durg",
    slug: "durg",
    category: "major-city",
    region: "Central Chhattisgarh",
    context:
      "Durg is an important regional travel destination connected with the wider Raipur and Bhilai corridor.",
  },
  {
    name: "Bhilai",
    slug: "bhilai",
    category: "major-city",
    region: "Central Chhattisgarh",
    context:
      "Bhilai has regular Bhilai Steel Plant (BSP), corporate, educational and family travel requirements across the state.",
  },
  {
    name: "Korba",
    slug: "korba",
    category: "major-city",
    region: "North Chhattisgarh",
    context:
      "Korba is Chhattisgarh's power and industrial hub (NTPC, BALCO, SECL) with 24/7 intercity and airport transfer needs.",
  },
  {
    name: "Raigarh",
    slug: "raigarh",
    category: "major-city",
    region: "Eastern Chhattisgarh",
    context:
      "Raigarh connects JSPL industrial, commercial and personal travel across eastern Chhattisgarh and Odisha.",
  },
  {
    name: "Ambikapur",
    slug: "ambikapur",
    category: "major-city",
    region: "Northern Chhattisgarh",
    context:
      "Ambikapur serves as the primary Surguja hub connecting northern Chhattisgarh with Raipur, Bilaspur, UP, Jharkhand and Bihar.",
  },
  {
    name: "Jagdalpur",
    slug: "jagdalpur",
    category: "major-city",
    region: "Southern Chhattisgarh",
    context:
      "Jagdalpur is an important destination for regional, tourism and personal travel in the Bastar region.",
  },
  {
    name: "Rajnandgaon",
    slug: "rajnandgaon",
    category: "major-city",
    region: "Western Chhattisgarh",
    context:
      "Rajnandgaon connects western Chhattisgarh with major commercial and transport hubs.",
  },

  // Industrial & Transit Hubs
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
  ].map((name) => ({
    name,
    slug: slugify(name),
    category: "industrial" as const,
    region: "Chhattisgarh Industrial & Transit Region",
    context: `${name} is included in the regional travel network for corporate, industrial, railway and personal cab enquiries. Confirm the exact pickup point and destination while booking.`,
  })),

  // District Headquarters and Towns
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
  ].map((name) => ({
    name,
    slug: slugify(name),
    category: "district" as const,
    region: "Chhattisgarh Regional Network",
    context: `${name} is part of the wider regional travel coverage. Share your exact pickup and drop locations to confirm cab availability and the applicable fare.`,
  })),

  // Tourism Destinations
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
  ].map((name) => ({
    name,
    slug: slugify(name),
    category: "tourism" as const,
    region: "Tourism and Outstation Network",
    context: `${name} is included in the wider tourism and outstation enquiry network. Confirm your travel dates, itinerary and return requirements before booking.`,
  })),

  // Interstate Hubs (Odisha, Maharashtra, MP, Jharkhand, UP & Bihar)
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
  ].map((name) => ({
    name,
    slug: slugify(name),
    category: "interstate" as const,
    region: "Interstate Travel Network",
    context: `${name} is included in the wider interstate travel enquiry network. Vehicle availability, route conditions and applicable interstate charges should be confirmed before booking.`,
  })),
];

/* =========================================================
   ROUTE RESOLUTION
========================================================= */

type RouteInfo = {
  origin: string;
  destination: string;
  originSlug: string;
  destinationSlug: string;
  airport: (typeof AIRPORTS)[number];
  hub: Hub;
  isAirportPickup: boolean;
  canonicalSlug: string;
  reverseSlug: string;
};

function resolveRoute(route: string): RouteInfo | null {
  const parts = route.split("-to-");

  if (parts.length !== 2) {
    return null;
  }

  const firstSlug = slugify(parts[0]);
  const secondSlug = slugify(parts[1]);

  const firstAirport = AIRPORTS.find((airport) => airport.slug === firstSlug);
  const secondAirport = AIRPORTS.find((airport) => airport.slug === secondSlug);

  const firstHub = HUBS.find((hub) => hub.slug === firstSlug);
  const secondHub = HUBS.find((hub) => hub.slug === secondSlug);

  // Airport → Hub
  if (firstAirport && secondHub) {
    return {
      origin: firstAirport.shortName,
      destination: secondHub.name,
      originSlug: firstAirport.slug,
      destinationSlug: secondHub.slug,
      airport: firstAirport,
      hub: secondHub,
      isAirportPickup: true,
      canonicalSlug: buildRouteSlug(firstAirport.slug, secondHub.slug),
      reverseSlug: buildRouteSlug(secondHub.slug, firstAirport.slug),
    };
  }

  // Hub → Airport
  if (firstHub && secondAirport) {
    return {
      origin: firstHub.name,
      destination: secondAirport.shortName,
      originSlug: firstHub.slug,
      destinationSlug: secondAirport.slug,
      airport: secondAirport,
      hub: firstHub,
      isAirportPickup: false,
      canonicalSlug: buildRouteSlug(firstHub.slug, secondAirport.slug),
      reverseSlug: buildRouteSlug(secondAirport.slug, firstHub.slug),
    };
  }

  return null;
}

/* =========================================================
   STATIC PARAMS (84 hubs × 5 airports × 2 directions)
========================================================= */

export const dynamicParams = true;

export async function generateStaticParams() {
  const routes: { route: string }[] = [];

  for (const hub of HUBS) {
    for (const airport of AIRPORTS) {
      routes.push({
        route: buildRouteSlug(hub.slug, airport.slug),
      });

      routes.push({
        route: buildRouteSlug(airport.slug, hub.slug),
      });
    }
  }

  return routes;
}

/* =========================================================
   ROUTE-SPECIFIC SEO KEYWORDS (12 INTENT PHRASES)
========================================================= */

function getRouteKeywords(route: RouteInfo) {
  const { origin, destination, airport, hub, isAirportPickup } = route;

  const direction = isAirportPickup ? "airport pickup" : "airport drop";

  return [
    `${origin} to ${destination} taxi`,
    `${origin} to ${destination} cab service`,
    `${origin} to ${destination} taxi booking`,
    `${origin} to ${destination} cab fare`,
    `${origin} to ${destination} one way taxi`,
    `${origin} to ${destination} private cab`,
    `${direction} ${origin} to ${destination}`,
    `${airport.shortName} taxi service`,
    `${airport.name} to ${hub.name} cab`,
    `${hub.name} airport transfer`,
    `book cab from ${origin} to ${destination}`,
    `24x7 outstation taxi ${origin} ${destination}`,
  ];
}

/* =========================================================
   ROUTE-SPECIFIC PAGE COPY
========================================================= */

function getRouteContent(route: RouteInfo) {
  const { origin, destination, airport, hub, isAirportPickup } = route;

  if (isAirportPickup) {
    return {
      eyebrow: "24/7 Airport Pickup Service",
      h1: `Airport Taxi from ${origin} to ${destination}`,
      intro: `Planning your journey from ${origin} to ${destination}? ${BUSINESS_NAME} provides 24/7 point-to-point cabs for airport arrivals. Share your flight schedule, pickup requirements and destination details to receive a transparent vehicle quotation.`,
      routeDescription: `This journey connects ${airport.name} with ${hub.name}. Your pickup arrangement is planned around your actual flight arrival schedule, luggage requirements and exact drop address.`,
      planningTitle: `Plan Your ${origin} Arrival Transfer`,
      planningDescription: airport.pickupTip,
      travelTitle: `Travelling from ${origin} to ${destination}`,
      travelDescription: `${hub.context} Before confirming your airport transfer, share your arrival time, number of passengers, luggage details and exact drop location.`,
      pickupLabel: "Airport Pickup",
      dropLabel: "Final Destination",
      faq: [
        {
          question: `Can I book a taxi from ${origin} to ${destination}?`,
          answer: `Yes. You can contact ${BUSINESS_NAME} at ${PHONE_DISPLAY} with your arrival date, flight schedule, passenger count and drop address to check 24/7 vehicle availability and receive a fixed quotation.`,
        },
        {
          question: `How should I arrange my ${origin} pickup?`,
          answer: `Share your flight number, expected arrival time, contact number and final destination in ${destination}. Confirm the meeting point and pickup coordination with our dispatch team before travelling.`,
        },
        {
          question: `Which car can I book from ${origin} to ${destination}?`,
          answer: `Clean AC Sedan (Swift Dzire), 7-seater SUV (Maruti Ertiga) and Toyota Innova Crysta options are available. Share your passenger count and luggage details so the best vehicle can be suggested.`,
        },
        {
          question: `Are early morning or late-night pickups available at ${origin}?`,
          answer: `Yes, ${BUSINESS_NAME} operates 24/7 including early morning and late-night flight arrivals. Pre-booking in advance ensures timely driver assignment.`,
        },
        {
          question: `How can I get the taxi fare from ${origin} to ${destination}?`,
          answer: `Call or WhatsApp our booking desk with your pickup date, time, exact drop address in ${destination} and preferred vehicle. We will share a transparent fare with complete inclusions.`,
        },
      ],
    };
  }

  return {
    eyebrow: "24/7 Airport Drop Service",
    h1: `Taxi from ${origin} to ${destination}`,
    intro: `Need a reliable cab from ${origin} to ${destination}? ${BUSINESS_NAME} provides 24/7 point-to-point airport drops. Share your departure schedule, pickup address, passenger count and preferred vehicle to receive a transparent travel quotation.`,
    routeDescription: `This journey connects ${hub.name} with ${airport.name}. Plan your pickup according to your flight reporting time, exact pickup address and preferred arrival buffer.`,
    planningTitle: `Plan Your ${destination} Drop`,
    planningDescription: airport.dropTip,
    travelTitle: `Travelling from ${origin} to ${destination}`,
    travelDescription: `${hub.context} For an airport drop, confirm your flight reporting time, pickup location, passenger count and luggage requirements before finalising your cab.`,
    pickupLabel: "Pickup Location",
    dropLabel: "Airport Drop",
    faq: [
      {
        question: `Can I book a one-way taxi from ${origin} to ${destination}?`,
        answer: `Yes. Share your travel date, pickup address in ${origin}, flight reporting time and passenger details with ${BUSINESS_NAME} at ${PHONE_DISPLAY} to book a one-way or round-trip airport drop.`,
      },
      {
        question: `How early should I book my ${origin} to ${destination} cab?`,
        answer: `It is advisable to share your travel details in advance so vehicle availability and doorstep pickup timing can be coordinated smoothly with sufficient buffer for airport reporting.`,
      },
      {
        question: `Which vehicle is suitable for ${origin} to ${destination}?`,
        answer: `A Swift Dzire sedan suits up to 4 passengers with standard luggage, while a Maruti Ertiga or Toyota Innova Crysta is ideal for families, corporate teams or extra luggage.`,
      },
      {
        question: `Are early morning cabs available from ${origin} to ${destination}?`,
        answer: `Yes, we operate 24/7 for early morning flights and late-night departures. Pre-booking confirms your driver and vehicle details ahead of pickup.`,
      },
      {
        question: `Are toll and parking charges included in the taxi fare?`,
        answer: `Toll, airport parking and applicable interstate charges are clearly clarified in your booking quotation before trip confirmation, with zero hidden costs.`,
      },
    ],
  };
}

/* =========================================================
   DYNAMIC RELATED ROUTES (INTERNAL LINKING & CRAWL DEPTH)
========================================================= */

function getRelatedRoutes(route: RouteInfo) {
  const { airport, hub, isAirportPickup, reverseSlug } = route;

  const links: { name: string; href: string }[] = [
    {
      name: isAirportPickup
        ? `${hub.name} to ${airport.shortName} Taxi`
        : `${airport.shortName} to ${hub.name} Taxi`,
      href: `/airport-taxi/${reverseSlug}`,
    },
  ];

  const currentIndex = HUBS.findIndex((h) => h.slug === hub.slug);
  const sameCategoryHubs = HUBS.filter(
    (h) => h.slug !== hub.slug && h.category === hub.category
  );
  const otherHubs = HUBS.filter(
    (h) => h.slug !== hub.slug && h.category !== hub.category
  );

  // Rotate deterministically so every page links to different nearby/relevant hubs
  const pool = [...sameCategoryHubs, ...otherHubs];
  const offset = currentIndex >= 0 ? (currentIndex * 3) % pool.length : 0;

  for (let i = 0; i < 5 && i < pool.length; i++) {
    const targetHub = pool[(offset + i) % pool.length];
    const slug = isAirportPickup
      ? buildRouteSlug(airport.slug, targetHub.slug)
      : buildRouteSlug(targetHub.slug, airport.slug);

    links.push({
      name: isAirportPickup
        ? `${airport.shortName} to ${targetHub.name} Taxi`
        : `${targetHub.name} to ${airport.shortName} Taxi`,
      href: `/airport-taxi/${slug}`,
    });
  }

  return links;
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string }>;
}): Promise<Metadata> {
  const { route: routeParam } = await params;
  const route = resolveRoute(routeParam);

  if (!route) {
    return {
      title: "Airport Taxi Service",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const content = getRouteContent(route);
  const keywords = getRouteKeywords(route);

  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title = content.h1;
  const fullTitle = `${content.h1} | ${BUSINESS_NAME}`;

  const description = `${content.intro.slice(0, 145)} Call ${PHONE_DISPLAY} for instant booking.`;

  const canonical = `${SITE_URL}/airport-taxi/${route.canonicalSlug}`;

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
          alt: `${content.h1} - ${BUSINESS_NAME}`,
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
   MAIN PAGE
========================================================= */

export default async function AirportRoutePage({
  params,
}: {
  params: Promise<{ route: string }>;
}) {
  const { route: routeParam } = await params;
  const route = resolveRoute(routeParam);

  if (!route) {
    notFound();
  }

  // Redirect non-canonical URLs cleanly
  if (routeParam !== route.canonicalSlug) {
    permanentRedirect(`/airport-taxi/${route.canonicalSlug}`);
  }

  const { origin, destination, airport, hub, isAirportPickup } = route;

  const content = getRouteContent(route);
  const seoKeywords = getRouteKeywords(route);
  const relatedRoutes = getRelatedRoutes(route);

  const canonical = `${SITE_URL}/airport-taxi/${route.canonicalSlug}`;

  /* =======================================================
     UNIFIED SEO + AEO + GEO STRUCTURED DATA (@graph)
     Links directly to layout.tsx #organization & #website
  ======================================================= */

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${content.h1} | ${BUSINESS_NAME}`,
        description: content.intro,
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
            name: "Airport Taxi",
            item: `${SITE_URL}/airport-taxi`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: content.h1,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: content.h1,
        serviceType: isAirportPickup
          ? "Airport Pickup Taxi Service"
          : "Airport Drop Taxi Service",
        description: content.intro,
        url: canonical,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: [
          { "@type": "Place", name: origin },
          { "@type": "Place", name: destination },
          { "@type": "Place", name: airport.name },
          { "@type": "Place", name: hub.region },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${origin} to ${destination} Cab Options`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Maruti Swift Dzire Sedan (${origin} to ${destination})`,
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
        mainEntity: content.faq.map((item) => ({
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

  const whatsappMessage = encodeURIComponent(
    `Hello Khatu Rides Travels Co., I want to enquire about an airport taxi.\n\nFrom: ${origin}\nTo: ${destination}\nAirport: ${airport.name}\nTrip Type: ${isAirportPickup ? "Airport Pickup" : "Airport Drop"}\n\nPlease share vehicle availability and fare details.`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />

      <FloatingContact origin={origin} destination={destination} />

      <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
        {/* =================================================
            UNIFIED JSON-LD (@graph)
        ================================================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        {/* =================================================
            ROUTE HERO
        ================================================= */}

        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* =================================================
            TRUST STRIP
        ================================================= */}

        <section className="relative z-10 border-b-4 border-amber-400 bg-[#071a3a] py-5 text-white shadow-lg">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 md:grid-cols-4 md:divide-x md:divide-white/15">
            {[
              {
                icon: PlaneTakeoff,
                title: "Airport Transfers",
                description: "Pickup & Drop Enquiries",
              },
              {
                icon: Clock,
                title: "24/7 Dispatch",
                description: "Early Morning & Night Cabs",
              },
              {
                icon: Luggage,
                title: "Vehicle Options",
                description: "Dzire, Ertiga & Innova",
              },
              {
                icon: MapPin,
                title: "Point-to-Point",
                description: "Doorstep Pickup Requests",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 px-2 md:justify-center"
                >
                  <Icon className="h-7 w-7 shrink-0 text-amber-400" />

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-white sm:text-xs">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-300 sm:text-[10px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================
            ROUTE INTRODUCTION
        ================================================= */}

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-800">
                <PlaneTakeoff className="h-4 w-4" />
                {content.eyebrow}
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {content.h1.split(origin)[0]}
                <span className="text-[#063b8f]">{origin}</span>
                {content.h1.split(origin).slice(1).join(origin)}
              </h1>

              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                {content.intro}
              </p>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-blue-700" />

                  <div>
                    <h2 className="font-black text-slate-900">
                      Route Overview
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {content.routeDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${PHONE}`}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#063b8f] px-5 text-sm font-black text-white shadow-lg transition hover:bg-[#052f72]"
                >
                  <PhoneCall className="h-5 w-5" />
                  Call to Book
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-5 text-sm font-black text-white shadow-lg transition hover:bg-green-700"
                >
                  Enquire on WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* =================================================
                PREMIUM ROUTE CARD
            ================================================= */}

            <div className="relative">
              <div className="absolute -inset-4 rounded-[35px] bg-gradient-to-br from-blue-100 via-white to-amber-100 blur-xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#fff5d6] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800">
                    Your Journey
                  </span>

                  <PlaneTakeoff className="h-7 w-7 text-[#063b8f]" />
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-950">
                  Trip Itinerary
                </h2>

                <div className="relative ml-4 mt-9 space-y-12 border-l-2 border-dashed border-slate-200 py-2 pl-8">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#071a3a] text-white shadow-lg">
                      {isAirportPickup ? (
                        <PlaneTakeoff className="h-4 w-4 text-amber-400" />
                      ) : (
                        <MapPin className="h-4 w-4 text-amber-400" />
                      )}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {content.pickupLabel}
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      {origin}
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[45px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg">
                      {isAirportPickup ? (
                        <MapPin className="h-4 w-4" />
                      ) : (
                        <PlaneTakeoff className="h-4 w-4" />
                      )}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {content.dropLabel}
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      {destination}
                    </p>
                  </div>
                </div>

                <div className="mt-9 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex items-center gap-3">
                    <Luggage className="h-9 w-9 shrink-0 text-blue-700" />

                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Choose a Suitable Vehicle
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Share passenger and luggage details to request a suitable sedan or SUV.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            ROUTE-SPECIFIC TRAVEL PLANNING
        ================================================= */}

        <section className="border-y border-slate-200 bg-white py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-[25px] border border-slate-100 bg-slate-50 p-7 sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                <CalendarCheck className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black text-slate-950">
                {content.planningTitle}
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                {content.planningDescription}
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Confirm your travel date and preferred pickup time.",
                  "Share the complete pickup and drop address.",
                  "Mention the number of passengers and luggage.",
                  "Confirm the fare and inclusions before booking.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[25px] bg-[#071a3a] p-7 text-white shadow-xl sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
                <Route className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black">{content.travelTitle}</h2>

              <p className="mt-4 leading-8 text-slate-300">
                {content.travelDescription}
              </p>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Booking Information
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-200">
                  The final fare depends on the confirmed travel details, vehicle selection, route and applicable charges. Ask the booking team for the complete quotation before confirming.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            VEHICLE OPTIONS
        ================================================= */}

        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Vehicle Options
              </span>

              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Choose Your Airport Travel Cab
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Select a vehicle according to your group size, luggage and comfort requirements. Availability is confirmed at booking.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  name: "Maruti Dzire",
                  type: "Sedan",
                  passengers: "Up to 4 passengers",
                  luggage: "Standard luggage",
                  image: "/dezire.png",
                },
                {
                  name: "Maruti Ertiga",
                  type: "6+1 MUV",
                  passengers: "Family and group travel",
                  luggage: "Additional luggage space",
                  image: "/ertiga.png",
                },
                {
                  name: "Toyota Innova / Crysta",
                  type: "Premium MUV",
                  passengers: "Group and executive travel",
                  luggage: "Spacious cabin",
                  image: "/crysta.png",
                },
              ].map((vehicle) => (
                <div
                  key={vehicle.name}
                  className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-5">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} taxi option for ${origin} to ${destination}`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-800">
                      {vehicle.type}
                    </span>

                    <h3 className="mt-3 text-xl font-black text-slate-950">
                      {vehicle.name}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <CarFront className="h-4 w-4 text-blue-700" />
                        {vehicle.passengers}
                      </p>

                      <p className="flex items-center gap-2">
                        <Luggage className="h-4 w-4 text-blue-700" />
                        {vehicle.luggage}
                      </p>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex min-h-11 items-center justify-center rounded-xl bg-[#071a3a] px-4 text-xs font-black text-white transition hover:bg-[#063b8f]"
                    >
                      Enquire for This Vehicle
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            WHY CHOOSE KHATU RIDES
        ================================================= */}

        <section className="relative overflow-hidden bg-[#071a3a] py-14 text-white lg:py-20">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">
                Khatu Rides Travels Co.
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Airport Travel Made Easier
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Plan your airport journey with clear booking communication, suitable vehicle options and route-specific travel coordination.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Booking Assistance",
                  description:
                    "Get help with vehicle selection, pickup details and travel coordination before confirming your trip.",
                },
                {
                  icon: Clock,
                  title: "Planned Pickup",
                  description:
                    "Share your flight schedule and pickup requirements so the journey can be planned around your timing.",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Business & Personal Travel",
                  description:
                    "Request airport transfers for individual travellers, families, business visits and corporate travel.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/10 bg-white/[0.055] p-7 transition hover:-translate-y-1 hover:bg-white/[0.09]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-xl font-black">{item.title}</h3>

                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================
            ROUTE FAQs
        ================================================= */}

        <section className="border-b border-slate-100 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Route Booking Help
              </span>

              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Frequently Asked Questions
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Common questions about {origin} to {destination} taxi booking.
              </p>
            </div>

            <div className="space-y-4">
              {content.faq.map((item, index) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition open:bg-white open:shadow-md sm:p-6"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-3 text-base font-black text-slate-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-black text-blue-800">
                      {index + 1}
                    </span>

                    <span className="flex-1 pt-1">{item.question}</span>

                    <span className="text-xl text-blue-700 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="ml-10 mt-4 text-sm leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            RELATED SEARCH KEYWORDS
        ================================================= */}

        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                <Search className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Related Airport Taxi Searches
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Search phrases related to this route and service.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            RELATED ROUTES (DYNAMIC INTERNAL LINKS)
        ================================================= */}

        <section className="border-t border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-950">
              Explore More Airport Taxi Routes
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Explore reverse and nearby airport transfer routes available for enquiry through {BUSINESS_NAME}.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRoutes.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {item.name}
                  </span>

                  <ArrowRight className="h-4 w-4 text-blue-700 transition group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="bg-gradient-to-r from-[#071a3a] to-[#063b8f] px-4 py-14 text-center text-white sm:px-6 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-black sm:text-4xl">
              Book Your {origin} to {destination} Taxi
            </h2>

            <p className="mt-4 leading-7 text-blue-100">
              Share your travel date, pickup details and vehicle preference. Contact {BUSINESS_NAME} for availability and a route-specific quotation.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE}`}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 text-sm font-black text-slate-950 shadow-xl transition hover:bg-amber-300"
              >
                <PhoneCall className="h-5 w-5" />
                Call {PHONE_DISPLAY}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 text-sm font-black text-white transition hover:bg-white/20"
              >
                Enquire on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}