// app/outstation-cabs/[route]/page.tsx

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";

import RouteHero from "@/components/RouteHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar";
import FloatingContact from "@/components/FloatingContact";

import {
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle2,
  CarFront,
  Search,
  Navigation,
  Users,
  Luggage,
  ChevronRight,
  Info,
  Route as RouteIcon,
  PhoneCall,
  ArrowRight,
  MessageCircle,
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
   MASTER HUB LISTS (CHHATTISGARH + INTERSTATE HUBS)
========================================================= */

type HubInfo = {
  slug: string;
  name: string;
  state: string;
  isInterstate: boolean;
};

const CG_HUBS: HubInfo[] = [
  { slug: "raipur", name: "Raipur", state: "Chhattisgarh", isInterstate: false },
  { slug: "naya-raipur", name: "Naya Raipur", state: "Chhattisgarh", isInterstate: false },
  { slug: "korba", name: "Korba", state: "Chhattisgarh", isInterstate: false },
  { slug: "bilaspur", name: "Bilaspur", state: "Chhattisgarh", isInterstate: false },
  { slug: "uslapur", name: "Uslapur", state: "Chhattisgarh", isInterstate: false },
  { slug: "durg", name: "Durg", state: "Chhattisgarh", isInterstate: false },
  { slug: "bhilai", name: "Bhilai", state: "Chhattisgarh", isInterstate: false },
  { slug: "raigarh", name: "Raigarh", state: "Chhattisgarh", isInterstate: false },
  { slug: "ambikapur", name: "Ambikapur", state: "Chhattisgarh", isInterstate: false },
  { slug: "jagdalpur", name: "Jagdalpur", state: "Chhattisgarh", isInterstate: false },
  { slug: "rajnandgaon", name: "Rajnandgaon", state: "Chhattisgarh", isInterstate: false },
  { slug: "champa", name: "Champa", state: "Chhattisgarh", isInterstate: false },
  { slug: "balco", name: "Balco", state: "Chhattisgarh", isInterstate: false },
  { slug: "dipka", name: "Dipka", state: "Chhattisgarh", isInterstate: false },
  { slug: "gevra", name: "Gevra", state: "Chhattisgarh", isInterstate: false },
  { slug: "kusmunda", name: "Kusmunda", state: "Chhattisgarh", isInterstate: false },
  { slug: "katghora", name: "Katghora", state: "Chhattisgarh", isInterstate: false },
  { slug: "bishrampur", name: "Bishrampur", state: "Chhattisgarh", isInterstate: false },
  { slug: "surajpur", name: "Surajpur", state: "Chhattisgarh", isInterstate: false },
  { slug: "ramanujganj", name: "Ramanujganj", state: "Chhattisgarh", isInterstate: false },
];

const INTERSTATE_HUBS: HubInfo[] = [
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra", isInterstate: true },
  { slug: "gondia", name: "Gondia", state: "Maharashtra", isInterstate: true },
  { slug: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh", isInterstate: true },
  { slug: "ujjain", name: "Ujjain", state: "Madhya Pradesh", isInterstate: true },
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand", isInterstate: true },
  { slug: "garhwa", name: "Garhwa", state: "Jharkhand", isInterstate: true },
  { slug: "daltonganj", name: "Daltonganj", state: "Jharkhand", isInterstate: true },
  { slug: "deoghar", name: "Deoghar", state: "Jharkhand", isInterstate: true },
  { slug: "jharsuguda", name: "Jharsuguda", state: "Odisha", isInterstate: true },
  { slug: "sambalpur", name: "Sambalpur", state: "Odisha", isInterstate: true },
  { slug: "rourkela", name: "Rourkela", state: "Odisha", isInterstate: true },
  { slug: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", isInterstate: true },
  { slug: "varanasi", name: "Varanasi", state: "Uttar Pradesh", isInterstate: true },
  { slug: "renukoot", name: "Renukoot", state: "Uttar Pradesh", isInterstate: true },
  { slug: "shaktinagar", name: "Shaktinagar", state: "Uttar Pradesh", isInterstate: true },
  { slug: "sonbhadra", name: "Sonbhadra", state: "Uttar Pradesh", isInterstate: true },
  { slug: "prayagraj", name: "Prayagraj", state: "Uttar Pradesh", isInterstate: true },
  { slug: "ayodhya", name: "Ayodhya", state: "Uttar Pradesh", isInterstate: true },
  { slug: "patna", name: "Patna", state: "Bihar", isInterstate: true },
  { slug: "gaya", name: "Gaya", state: "Bihar", isInterstate: true },
  { slug: "sasaram", name: "Sasaram", state: "Bihar", isInterstate: true },
];

const ALL_HUBS: HubInfo[] = [...CG_HUBS, ...INTERSTATE_HUBS];

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
  "ambikapur__shaktinagar": {
    distance: "Approx. 175 - 190 km",
    duration: "Approx. 4 - 4.5 hours",
    highway: "via Wadrafnagar & Renukoot",
  },
  "ambikapur__sonbhadra": {
    distance: "Approx. 185 - 210 km",
    duration: "Approx. 4.5 - 5 hours",
    highway: "via Wadrafnagar & Renukoot",
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
  "jharsuguda__korba": {
    distance: "Approx. 180 km",
    duration: "Approx. 4 - 4.5 hours",
    highway: "via Raigarh",
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

function getRouteFacts(originSlug: string, destSlug: string): RouteFacts | null {
  const key = [originSlug, destSlug].sort().join("__");
  return KNOWN_ROUTE_FACTS[key] ?? null;
}

/* =========================================================
   SLUG UTILITIES & STRICT ROUTE RESOLUTION
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createRouteSlug(fromSlug: string, toSlug: string) {
  return `${fromSlug}-to-${toSlug}`;
}

type ResolvedOutstationRoute = {
  originHub: HubInfo;
  destHub: HubInfo;
  origin: string;
  destination: string;
  canonicalSlug: string;
  reverseSlug: string;
  facts: RouteFacts | null;
};

function resolveOutstationRoute(rawRoute: string): ResolvedOutstationRoute | null {
  const decoded = decodeURIComponent(rawRoute).trim();
  const parts = decoded.split("-to-");
  if (parts.length !== 2) return null;

  const firstSlug = slugify(parts[0]);
  const secondSlug = slugify(parts[1]);
  if (!firstSlug || !secondSlug || firstSlug === secondSlug) return null;

  const originHub = ALL_HUBS.find((h) => h.slug === firstSlug);
  const destHub = ALL_HUBS.find((h) => h.slug === secondSlug);
  if (!originHub || !destHub) return null;

  return {
    originHub,
    destHub,
    origin: originHub.name,
    destination: destHub.name,
    canonicalSlug: createRouteSlug(originHub.slug, destHub.slug),
    reverseSlug: createRouteSlug(destHub.slug, originHub.slug),
    facts: getRouteFacts(originHub.slug, destHub.slug),
  };
}

/* =========================================================
   STATIC PARAMS (BIDIRECTIONAL PRIORITY INTERSTATE ROUTES)
========================================================= */

export const dynamicParams = true;

const PRIORITY_CG_SLUGS = new Set([
  "raipur",
  "korba",
  "bilaspur",
  "ambikapur",
  "raigarh",
  "durg",
  "bhilai",
  "jagdalpur",
]);

export async function generateStaticParams() {
  const routes: { route: string }[] = [];

  for (const cg of CG_HUBS) {
    if (!PRIORITY_CG_SLUGS.has(cg.slug)) continue;
    for (const inter of INTERSTATE_HUBS) {
      routes.push({ route: createRouteSlug(cg.slug, inter.slug) });
      routes.push({ route: createRouteSlug(inter.slug, cg.slug) });
    }
  }

  return routes;
}

/* =========================================================
   DYNAMIC INTERNAL LINKING
========================================================= */

function getRelatedOutstationRoutes(resolved: ResolvedOutstationRoute) {
  const { originHub, destHub, reverseSlug } = resolved;

  const links: { name: string; href: string }[] = [
    {
      name: `${destHub.name} to ${originHub.name} Outstation Cab`,
      href: `/outstation-cabs/${reverseSlug}`,
    },
  ];

  // If origin is in CG, suggest interstate destinations; if interstate, suggest CG destinations
  const pool = (originHub.isInterstate ? CG_HUBS : INTERSTATE_HUBS).filter(
    (h) => h.slug !== originHub.slug && h.slug !== destHub.slug
  );

  const startIdx = ALL_HUBS.findIndex((h) => h.slug === originHub.slug);
  const offset = startIdx >= 0 ? (startIdx * 3) % pool.length : 0;

  for (let i = 0; i < 5 && i < pool.length; i++) {
    const target = pool[(offset + i) % pool.length];
    links.push({
      name: `${originHub.name} to ${target.name} Outstation Taxi`,
      href: `/outstation-cabs/${createRouteSlug(originHub.slug, target.slug)}`,
    });
  }

  return links;
}

/* =========================================================
   OUTSTATION SEO, AEO & GEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string }>;
}): Promise<Metadata> {
  const { route: routeParam } = await params;
  const resolved = resolveOutstationRoute(routeParam);

  if (!resolved) {
    return {
      title: "Outstation Cab & Intercity Taxi Service",
      robots: { index: false, follow: true },
    };
  }

  const { origin, destination, canonicalSlug, facts } = resolved;
  const canonical = `${SITE_URL}/outstation-cabs/${canonicalSlug}`;

  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title = `${origin} to ${destination} Outstation Cab | One-Way & Round-Trip Taxi`;
  const fullTitle = `${title} | ${BUSINESS_NAME}`;

  const factSnippet = facts
    ? ` Distance: ${facts.distance} (${facts.duration}).`
    : "";

  const description = `Book 24/7 outstation taxi from ${origin} to ${destination} with ${BUSINESS_NAME}.${factSnippet} One-way drops, round trips, and intercity AC cabs (Swift Dzire, Ertiga, Innova Crysta) with verified highway drivers.`;

  const keywords = [
    `outstation cab ${origin} to ${destination}`,
    `${origin} to ${destination} outstation taxi`,
    `one way taxi ${origin} to ${destination}`,
    `${origin} to ${destination} round trip cab`,
    `intercity cab ${origin} to ${destination}`,
    `${origin} to ${destination} cab fare`,
    `Swift Dzire ${origin} to ${destination}`,
    `Ertiga cab ${origin} to ${destination}`,
    `Innova Crysta outstation ${origin} to ${destination}`,
    `24x7 highway taxi ${origin} to ${destination}`,
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
          alt: `${origin} to ${destination} Outstation Taxi - ${BUSINESS_NAME}`,
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

export default async function OutstationRoutePage({
  params,
}: {
  params: Promise<{ route: string }>;
}) {
  const { route: routeParam } = await params;
  const resolved = resolveOutstationRoute(routeParam);

  if (!resolved) {
    notFound();
  }

  // Redirect non-canonical uppercase or spaced slugs cleanly
  if (routeParam !== resolved.canonicalSlug) {
    permanentRedirect(`/outstation-cabs/${resolved.canonicalSlug}`);
  }

  const { origin, destination, originHub, destHub, canonicalSlug, facts } =
    resolved;
  const canonical = `${SITE_URL}/outstation-cabs/${canonicalSlug}`;
  const relatedRoutes = getRelatedOutstationRoutes(resolved);

  const faqs = [
    ...(facts
      ? [
          {
            question: `What is the road distance and travel time from ${origin} to ${destination} by outstation cab?`,
            answer: `The distance from ${origin} to ${destination} is ${facts.distance} (${facts.highway}), taking approximately ${facts.duration} by AC cab depending on traffic and highway conditions.`,
          },
        ]
      : []),
    {
      question: `Are toll taxes and inter-state border permits included in the ${origin} to ${destination} fare?`,
      answer: `When you book an outstation cab from ${origin} to ${destination} with ${BUSINESS_NAME}, your quotation clearly clarifies FASTag tolls, state border taxes, and driver allowance upfront so there are zero hidden surprises.`,
    },
    {
      question: `Can I book a one-way drop instead of a round trip from ${origin} to ${destination}?`,
      answer: `Yes! We offer both one-way drop taxis (pay only for one side) and multi-day round-trip packages from ${origin} to ${destination}.`,
    },
    {
      question: `Can I book a cab for early morning or late-night highway travel to ${destination}?`,
      answer: `Yes, our dispatch operates 24/7. Our drivers are verified and experienced in night and early morning highway travel between ${origin} (${originHub.state}) and ${destination} (${destHub.state}).`,
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
        name: `${origin} to ${destination} Outstation Cab | ${BUSINESS_NAME}`,
        description: `24/7 outstation one-way and round-trip AC cab service from ${origin} to ${destination}.`,
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
            name: "Outstation Cabs",
            item: `${SITE_URL}/outstation-cabs`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${origin} to ${destination}`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        serviceType: "Outstation Intercity Taxi",
        name: `${origin} to ${destination} Outstation Cab`,
        url: canonical,
        description: `Intercity and interstate cab service providing one-way drops and round-trip transfers from ${origin} to ${destination}${facts ? ` (${facts.distance}, ${facts.duration})` : ""} with verified highway drivers.`,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: [
          { "@type": "City", name: origin },
          { "@type": "City", name: destination },
          { "@type": "State", name: originHub.state },
          { "@type": "State", name: destHub.state },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${origin} to ${destination} Outstation Fleet`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Swift Dzire Outstation Sedan (${origin} to ${destination})`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Maruti Ertiga 7-Seater Outstation SUV (${origin} to ${destination})`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Toyota Innova Crysta Outstation Cab (${origin} to ${destination})`,
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

  const seoKeywords = [
    `Outstation taxi ${origin} to ${destination}`,
    `${origin} to ${destination} one way cab`,
    `${origin} to ${destination} round trip taxi`,
    `Intercity cab ${origin} to ${destination}`,
    `Swift Dzire cab ${origin} to ${destination}`,
    `Ertiga 7-seater ${origin} to ${destination}`,
    `Innova Crysta hire ${origin} to ${destination}`,
    `${origin} to ${destination} outstation fare`,
    `${origin} to ${destination} road distance`,
    `24x7 interstate taxi ${origin}`,
  ];

  const makeWhatsAppUrl = (vehicle?: string) => {
    const carLine = vehicle ? `\nPreferred Vehicle: ${vehicle}` : "";
    const msg = encodeURIComponent(
      `Hello ${BUSINESS_NAME}, I want to book an outstation cab.\n\nFrom: ${origin}\nTo: ${destination}${carLine}\n\nPlease share availability and best one-way / round-trip fare.`
    );
    return `https://wa.me/${WHATSAPP}?text=${msg}`;
  };

  return (
    <>
      <Navbar />
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
        {/* Unified SEO + AEO + GEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        {/* SEO Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-900 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span>Outstation Cabs</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-amber-400 font-semibold">
            {origin} to {destination}
          </span>
        </nav>

        <RouteHero initialPickup={origin} initialDrop={destination} />

        {/* OUTSTATION TRUST BAR */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/10">
              <div className="px-2 group">
                <Navigation className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">
                  All India Permit
                </p>
              </div>
              <div className="px-2 group">
                <ShieldCheck className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">
                  Verified Drivers
                </p>
              </div>
              <div className="px-2 group">
                <RouteIcon className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">
                  One-Way &amp; Round Trip
                </p>
              </div>
              <div className="px-2 group">
                <Clock className="w-7 h-7 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-300">
                  24/7 Dispatch
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTE OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider">
                <RouteIcon className="w-4 h-4" /> 24/7 Intercity &amp; Interstate Travel
              </div>

              <h1 className="text-3xl md:text-[42px] font-black text-slate-900 leading-[1.15]">
                Outstation Cab from{" "}
                <span className="text-amber-500">{origin}</span> to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  {destination}
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Long-distance highway travel made safe and comfortable! Book a
                reliable AC outstation cab from{" "}
                <strong className="text-slate-900">{origin}</strong> to{" "}
                <strong className="text-slate-900">{destination}</strong> with{" "}
                {BUSINESS_NAME}. Choose a one-way drop with zero return fare or
                a flexible multi-day round trip with transparent pricing.
              </p>

              {/* Verified Distance & Duration Facts (AEO/GEO) */}
              {facts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm">
                    <Navigation className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Road Distance
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        {facts.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm">
                    <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
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

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                {[
                  "Pay Only For One-Way Drop",
                  "Transparent Toll & Permit Quotes",
                  "Door-to-Door Pickup & Drop",
                  "Verified Highway Drivers",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-sm text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-700 text-white px-7 py-4 rounded-xl font-black text-sm hover:bg-indigo-800 shadow-lg transition"
                >
                  <PhoneCall className="w-4 h-4" /> Call {PHONE_DISPLAY}
                </a>
                <a
                  href={makeWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-7 py-4 rounded-xl font-black text-sm hover:bg-green-700 shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp for Fare
                </a>
              </div>
            </div>

            {/* Visual Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full -z-0" />

                <h2 className="text-2xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
                  <MapPin className="text-amber-500" /> Journey Details
                </h2>

                <div className="relative border-l-[3px] border-dashed border-indigo-200 ml-5 pl-8 space-y-12 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Pickup City ({originHub.state})
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      {origin}
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Drop City ({destHub.state})
                    </p>
                    <p className="text-2xl font-black text-slate-900">
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

                <div className="mt-8 p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl flex items-center gap-4 border border-slate-200">
                  <Info className="w-8 h-8 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      One-Way Policy
                    </p>
                    <p className="text-slate-800 font-semibold text-sm mt-0.5">
                      Why pay return fares? Book our one-way drop to{" "}
                      {destination} and save up to 40% on your travel cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FLEET & FARE GUIDE */}
        <section className="bg-white py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Outstation Fleet Options
              </h2>
              <p className="text-slate-600 mt-4 text-lg">
                Clean, commercial-permit AC cars for long-distance highway
                travel.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-amber-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        Sedan
                      </h3>
                      <p className="text-slate-500 text-sm font-semibold">
                        Maruti Swift Dzire
                      </p>
                    </div>
                    <CarFront className="w-10 h-10 text-slate-300 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div className="flex gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Users className="w-4 h-4" /> 4 Seats
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Luggage className="w-4 h-4" /> 2 Bags
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                      Cost Effective
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Best for solo travelers, corporate visits, or small
                      families on a budget.
                    </p>
                  </div>
                </div>
                <a
                  href={makeWhatsAppUrl("Swift Dzire Sedan")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-slate-900 text-white text-center text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Get Sedan Quote
                </a>
              </div>

              <div className="border border-amber-400 bg-amber-50/30 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Highway Favorite
                </div>
                <div>
                  <div className="flex justify-between items-start mb-6 mt-2">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        SUV (7-Seater)
                      </h3>
                      <p className="text-slate-500 text-sm font-semibold">
                        Maruti Ertiga
                      </p>
                    </div>
                    <CarFront className="w-10 h-10 text-amber-400" />
                  </div>
                  <div className="flex gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Users className="w-4 h-4" /> 6+1 Seats
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Luggage className="w-4 h-4" /> 3 Bags
                    </span>
                  </div>
                  <div className="bg-white border border-amber-200 p-4 rounded-2xl mb-6">
                    <p className="text-xs text-amber-600 font-bold uppercase mb-1">
                      Comfort Choice
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Extra legroom and luggage space for family and group
                      intercity trips.
                    </p>
                  </div>
                </div>
                <a
                  href={makeWhatsAppUrl("Maruti Ertiga 7-Seater")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-amber-400 text-slate-900 text-center text-sm font-black hover:bg-amber-500 transition-colors"
                >
                  Get Ertiga Quote
                </a>
              </div>

              <div className="border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-indigo-400 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        Premium SUV
                      </h3>
                      <p className="text-slate-500 text-sm font-semibold">
                        Toyota Innova Crysta
                      </p>
                    </div>
                    <CarFront className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="flex gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Users className="w-4 h-4" /> 7 Seats
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Luggage className="w-4 h-4" /> 4 Bags
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                      Premium Class
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Ultimate ride quality and comfort for long interstate
                      journeys.
                    </p>
                  </div>
                </div>
                <a
                  href={makeWhatsAppUrl("Toyota Innova Crysta")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-slate-900 text-white text-center text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Get Innova Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Intercity Travel FAQs
              </h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:shadow-md transition duration-300"
                >
                  <h3 className="font-black text-xl text-slate-900 flex items-start gap-3">
                    <span className="text-indigo-600">Q.</span> {faq.question}
                  </h3>
                  <p className="text-slate-600 mt-3 font-medium leading-relaxed ml-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED OUTSTATION ROUTES (INTERNAL LINKING) */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">
              Explore More Outstation Cab Routes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Check return trips and popular interstate taxi routes from{" "}
              {origin}.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRoutes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-indigo-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white">
                Popular Outstation Searches
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-xs sm:text-sm font-semibold text-slate-400 hover:border-amber-400 hover:text-white transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 