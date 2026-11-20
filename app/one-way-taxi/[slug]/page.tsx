// app/one-way-taxi/[slug]/page.tsx

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
  Users,
  Luggage,
  ChevronRight,
  IndianRupee,
  PhoneCall,
  CalendarCheck,
  MessageCircle,
  Star,
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
   ONE-WAY HUB MASTER DATA (33 SYNCED GBP HUBS)
========================================================= */

type HubInfo = {
  slug: string;
  name: string;
  state: string;
};

const CITIES: HubInfo[] = [
  // Chhattisgarh Core & Industrial Hubs
  { slug: "raipur", name: "Raipur", state: "Chhattisgarh" },
  { slug: "naya-raipur", name: "Naya Raipur", state: "Chhattisgarh" },
  { slug: "korba", name: "Korba", state: "Chhattisgarh" },
  { slug: "bilaspur", name: "Bilaspur", state: "Chhattisgarh" },
  { slug: "uslapur", name: "Uslapur", state: "Chhattisgarh" },
  { slug: "ambikapur", name: "Ambikapur", state: "Chhattisgarh" },
  { slug: "raigarh", name: "Raigarh", state: "Chhattisgarh" },
  { slug: "durg", name: "Durg", state: "Chhattisgarh" },
  { slug: "bhilai", name: "Bhilai", state: "Chhattisgarh" },
  { slug: "jagdalpur", name: "Jagdalpur", state: "Chhattisgarh" },
  { slug: "rajnandgaon", name: "Rajnandgaon", state: "Chhattisgarh" },
  { slug: "champa", name: "Champa", state: "Chhattisgarh" },
  { slug: "balco", name: "Balco", state: "Chhattisgarh" },
  { slug: "dipka", name: "Dipka", state: "Chhattisgarh" },
  { slug: "gevra", name: "Gevra", state: "Chhattisgarh" },
  { slug: "kusmunda", name: "Kusmunda", state: "Chhattisgarh" },
  { slug: "katghora", name: "Katghora", state: "Chhattisgarh" },
  { slug: "surajpur", name: "Surajpur", state: "Chhattisgarh" },
  { slug: "bishrampur", name: "Bishrampur", state: "Chhattisgarh" },
  { slug: "ramanujganj", name: "Ramanujganj", state: "Chhattisgarh" },

  // Odisha, Maharashtra & MP Border Hubs
  { slug: "jharsuguda", name: "Jharsuguda", state: "Odisha" },
  { slug: "sambalpur", name: "Sambalpur", state: "Odisha" },
  { slug: "rourkela", name: "Rourkela", state: "Odisha" },
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra" },
  { slug: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh" },

  // Jharkhand, UP & Bihar Interstate Hubs
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand" },
  { slug: "garhwa", name: "Garhwa", state: "Jharkhand" },
  { slug: "daltonganj", name: "Daltonganj", state: "Jharkhand" },
  { slug: "varanasi", name: "Varanasi", state: "Uttar Pradesh" },
  { slug: "renukoot", name: "Renukoot", state: "Uttar Pradesh" },
  { slug: "prayagraj", name: "Prayagraj", state: "Uttar Pradesh" },
  { slug: "ayodhya", name: "Ayodhya", state: "Uttar Pradesh" },
  { slug: "patna", name: "Patna", state: "Bihar" },
  { slug: "gaya", name: "Gaya", state: "Bihar" },
  { slug: "sasaram", name: "Sasaram", state: "Bihar" },
];

/* =========================================================
   VERIFIED ROUTE FACTS (REPLACES FAKE MOCK MATH)
   Keys are sorted alphabetically so both directions match.
========================================================= */

type RouteFacts = {
  distance: string;
  duration: string;
  highway: string;
};

const KNOWN_ROUTE_FACTS: Record<string, RouteFacts> = {
  "bilaspur__korba": {
    distance: "Approx. 95 - 105 km",
    duration: "Approx. 2 - 2.5 hours",
    highway: "via Pali / Katghora Road",
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
   SLUG RESOLUTION & STRICT VALIDATION (NO JUNK 200 PAGES)
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ResolvedSlug =
  | {
      pageType: "route";
      originHub: HubInfo;
      destHub: HubInfo;
      origin: string;
      destination: string;
      canonicalSlug: string;
      reverseSlug: string;
      facts: RouteFacts | null;
    }
  | {
      pageType: "city";
      originHub: HubInfo;
      destHub: null;
      origin: string;
      destination: "";
      canonicalSlug: string;
      reverseSlug: null;
      facts: null;
    };

function resolveOneWaySlug(rawSlug: string): ResolvedSlug | null {
  const decoded = decodeURIComponent(rawSlug).trim();

  if (decoded.includes("-to-")) {
    const parts = decoded.split("-to-");
    if (parts.length !== 2) return null;

    const firstSlug = slugify(parts[0]);
    const secondSlug = slugify(parts[1]);
    if (!firstSlug || !secondSlug || firstSlug === secondSlug) return null;

    const originHub = CITIES.find((c) => c.slug === firstSlug);
    const destHub = CITIES.find((c) => c.slug === secondSlug);
    if (!originHub || !destHub) return null;

    return {
      pageType: "route",
      originHub,
      destHub,
      origin: originHub.name,
      destination: destHub.name,
      canonicalSlug: `${originHub.slug}-to-${destHub.slug}`,
      reverseSlug: `${destHub.slug}-to-${originHub.slug}`,
      facts: getRouteFacts(originHub.slug, destHub.slug),
    };
  }

  const cleanSlug = slugify(decoded);
  const originHub = CITIES.find((c) => c.slug === cleanSlug);
  if (!originHub) return null;

  return {
    pageType: "city",
    originHub,
    destHub: null,
    origin: originHub.name,
    destination: "",
    canonicalSlug: originHub.slug,
    reverseSlug: null,
    facts: null,
  };
}

/* =========================================================
   STATIC PARAMS (FAST BUILD + FULL ON-DEMAND ISR)
========================================================= */

export const dynamicParams = true;

const PRIORITY_SLUGS = new Set([
  "raipur",
  "korba",
  "bilaspur",
  "ambikapur",
  "raigarh",
  "durg",
  "bhilai",
  "jharsuguda",
  "ranchi",
  "garhwa",
  "varanasi",
  "nagpur",
]);

export async function generateStaticParams() {
  const routes: { slug: string }[] = [];

  for (const city of CITIES) {
    routes.push({ slug: city.slug });
  }

  for (const origin of CITIES) {
    for (const dest of CITIES) {
      if (origin.slug === dest.slug) continue;
      if (PRIORITY_SLUGS.has(origin.slug) && PRIORITY_SLUGS.has(dest.slug)) {
        routes.push({ slug: `${origin.slug}-to-${dest.slug}` });
      }
    }
  }

  return routes;
}

/* =========================================================
   DYNAMIC INTERNAL LINKING
========================================================= */

function getRelatedLinks(resolved: ResolvedSlug) {
  const links: { name: string; href: string }[] = [];

  if (resolved.pageType === "route") {
    links.push({
      name: `${resolved.destination} to ${resolved.origin} One-Way Taxi`,
      href: `/one-way-taxi/${resolved.reverseSlug}`,
    });
    links.push({
      name: `All One-Way Drops from ${resolved.origin}`,
      href: `/one-way-taxi/${resolved.originHub.slug}`,
    });
  }

  const candidates = CITIES.filter(
    (c) =>
      c.slug !== resolved.originHub.slug &&
      c.slug !== resolved.destHub?.slug
  );
  const idx = CITIES.findIndex((c) => c.slug === resolved.originHub.slug);
  const offset = idx >= 0 ? (idx * 3) % candidates.length : 0;

  while (links.length < 6 && links.length < candidates.length + 2) {
    const target = candidates[(offset + links.length) % candidates.length];
    const href = `/one-way-taxi/${resolved.originHub.slug}-to-${target.slug}`;
    if (!links.some((l) => l.href === href)) {
      links.push({
        name: `${resolved.origin} to ${target.name} One-Way Cab`,
        href,
      });
    } else {
      break;
    }
  }

  return links;
}

/* =========================================================
   HIGH-INTENT DYNAMIC SEO, AEO & GEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const resolved = resolveOneWaySlug(rawSlug);

  if (!resolved) {
    return {
      title: "One-Way Taxi & Outstation Drop Cab Service",
      robots: { index: false, follow: true },
    };
  }

  const { pageType, origin, destination, canonicalSlug, facts } = resolved;
  const canonical = `${SITE_URL}/one-way-taxi/${canonicalSlug}`;

  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title =
    pageType === "route"
      ? `${origin} to ${destination} One-Way Taxi | Zero Return Fare`
      : `One-Way Taxi Service in ${origin} | Outstation Drop Cabs`;

  const fullTitle = `${title} | ${BUSINESS_NAME}`;

  const factSnippet = facts ? ` Distance: ${facts.distance} (${facts.duration}).` : "";

  const description =
    pageType === "route"
      ? `Book 24/7 one-way drop taxi from ${origin} to ${destination} with ${BUSINESS_NAME}.${factSnippet} Pay only for one side—clean AC Swift Dzire, Ertiga & Innova Crysta with verified drivers.`
      : `Book affordable 24/7 one-way drop cabs from ${origin} with ${BUSINESS_NAME}. Pay strictly one-side fare with zero return charges for airport, railway, corporate & intercity travel.`;

  const keywords =
    pageType === "route"
      ? [
          `${origin} to ${destination} one way taxi`,
          `${origin} to ${destination} one way cab`,
          `book drop cab ${origin} to ${destination}`,
          `zero return fare taxi ${origin}`,
          `${origin} to ${destination} taxi fare`,
          `outstation drop ${origin} to ${destination}`,
          `Swift Dzire one way ${origin} to ${destination}`,
          `Ertiga drop taxi ${origin} to ${destination}`,
          `Innova Crysta one way ${origin} to ${destination}`,
          BUSINESS_NAME,
        ]
      : [
          `one way cab ${origin}`,
          `one way taxi service in ${origin}`,
          `drop taxi service ${origin}`,
          `outstation drop from ${origin}`,
          `no return fare cab ${origin}`,
          `intercity one way travel ${origin}`,
          `24x7 drop cab ${origin}`,
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
          alt: `${title} - ${BUSINESS_NAME}`,
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

export default async function OneWayTaxiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const resolved = resolveOneWaySlug(rawSlug);

  if (!resolved) {
    notFound();
  }

  // Redirect non-canonical uppercase or spaced slugs cleanly
  if (rawSlug !== resolved.canonicalSlug) {
    permanentRedirect(`/one-way-taxi/${resolved.canonicalSlug}`);
  }

  const { pageType, origin, destination, canonicalSlug, facts, originHub, destHub } =
    resolved;
  const canonical = `${SITE_URL}/one-way-taxi/${canonicalSlug}`;
  const relatedLinks = getRelatedLinks(resolved);

  const schemaName =
    pageType === "route"
      ? `${origin} to ${destination} One-Way Drop Taxi`
      : `One-Way Drop Taxi Service in ${origin}`;

  const faqs = [
    ...(pageType === "route" && facts
      ? [
          {
            question: `What is the distance and travel time for a one-way taxi from ${origin} to ${destination}?`,
            answer: `The road distance from ${origin} to ${destination} is ${facts.distance} (${facts.highway}), taking ${facts.duration} by AC cab depending on traffic and highway conditions.`,
          },
        ]
      : []),
    {
      question:
        pageType === "route"
          ? `Do I have to pay return fare for a ${origin} to ${destination} one-way cab?`
          : `How does one-way drop taxi pricing work from ${origin}?`,
      answer: `No, you never pay return fare on our one-way drop service. With ${BUSINESS_NAME}, you pay strictly for the single-side journey ${pageType === "route" ? `from ${origin} to ${destination}` : `from ${origin}`}, saving up to 40% compared to round-trip billing.`,
    },
    {
      question: `Which AC cars are available for one-way drops ${pageType === "route" ? `from ${origin} to ${destination}` : `from ${origin}`}?`,
      answer: `You can choose from clean AC 4-seater Sedans (Maruti Swift Dzire), 7-seater SUVs (Maruti Ertiga), or premium Toyota Innova Crysta cabs with verified highway drivers.`,
    },
    {
      question: `Are 24/7 early morning and late-night one-way pickups available in ${origin}?`,
      answer: `Yes, our dispatch operates 24/7 for early morning flight/train transfers, medical visits, and late-night outstation drops from ${origin}. Call ${PHONE_DISPLAY} for instant confirmation.`,
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
        name: `${schemaName} | ${BUSINESS_NAME}`,
        description: `24/7 one-way drop taxi service ${pageType === "route" ? `from ${origin} to ${destination}` : `from ${origin}`} with zero return fare.`,
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
            name: "One-Way Taxi",
            item: `${SITE_URL}/one-way-taxi`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pageType === "route" ? `${origin} to ${destination}` : origin,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        serviceType: "One-Way Outstation Taxi",
        name: schemaName,
        url: canonical,
        description: `Reliable 24/7 one-way drop taxi service ${pageType === "route" ? `from ${origin} to ${destination}` : `from ${origin}`}${facts ? ` (${facts.distance}, ${facts.duration})` : ""} with zero return fare and verified drivers.`,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed:
          pageType === "route" && destHub
            ? [
                { "@type": "City", name: origin },
                { "@type": "City", name: destination },
                { "@type": "State", name: originHub.state },
                { "@type": "State", name: destHub.state },
              ]
            : [
                { "@type": "City", name: origin },
                { "@type": "State", name: originHub.state },
              ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${schemaName} Fleet`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Swift Dzire One-Way Sedan (${pageType === "route" ? `${origin} to ${destination}` : origin})`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Maruti Ertiga 7-Seater One-Way SUV (${pageType === "route" ? `${origin} to ${destination}` : origin})`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Toyota Innova Crysta One-Way Drop (${pageType === "route" ? `${origin} to ${destination}` : origin})`,
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

  const seoKeywords =
    pageType === "route"
      ? [
          `One way cab ${origin} to ${destination}`,
          `Drop taxi ${origin} to ${destination}`,
          `Zero return fare cab ${origin} to ${destination}`,
          `${origin} to ${destination} taxi fare`,
          `Swift Dzire drop ${origin} to ${destination}`,
          `Ertiga 7-seater one way ${origin} to ${destination}`,
          `Innova Crysta drop ${origin} to ${destination}`,
          `24x7 night cab ${origin} to ${destination}`,
          `Airport & station drop ${origin} to ${destination}`,
          `Intercity taxi service ${origin}`,
        ]
      : [
          `One way cab in ${origin}`,
          `Outstation drop from ${origin}`,
          `${origin} one side taxi`,
          `Best drop cabs in ${origin}`,
          `Zero return fare taxi ${origin}`,
          `Airport drop from ${origin}`,
          `Long distance one way taxi ${origin}`,
          `Swift Dzire & Ertiga drop ${origin}`,
          `Interstate cab service ${origin}`,
          `24x7 reliable taxis in ${origin}`,
        ];

  const makeWhatsAppUrl = (vehicle?: string) => {
    const routeText =
      pageType === "route" ? `from ${origin} to ${destination}` : `from ${origin}`;
    const carText = vehicle ? `\nPreferred Car: ${vehicle}` : "";
    const msg = encodeURIComponent(
      `Hello ${BUSINESS_NAME}, I need a one-way drop cab ${routeText}.${carText}\n\nPlease share availability and fixed one-way fare.`
    );
    return `https://wa.me/${WHATSAPP}?text=${msg}`;
  };

  return (
    <>
      <Navbar />
      <FloatingContact origin={origin} destination={destination} />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans pb-20 md:pb-0">
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
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link
            href="/one-way-taxi"
            className="hover:text-emerald-400 transition-colors"
          >
            One-Way Taxi
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-emerald-400 font-semibold">
            {pageType === "route" ? `${origin} to ${destination}` : origin}
          </span>
        </nav>

        {/* Dynamic Hero Section */}
        <RouteHero
          initialPickup={origin}
          initialDrop={destination}
          titleText={
            pageType === "route"
              ? `One-Way Drop: ${origin} to ${destination}`
              : `Outstation Drops from ${origin}`
          }
          subtitleText="Pay only one side. Save up to 40% instantly."
        />

        {/* HIGH INTENT TRUST BAR */}
        <div className="bg-emerald-600 text-white py-4 border-b-4 border-emerald-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>4.9/5 Customer Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>100% Verified Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                <span>Zero Return Fare</span>
              </div>
              <a
                href={`tel:${PHONE}`}
                className="bg-slate-900 text-emerald-400 px-4 py-1.5 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Quick Quote
              </a>
            </div>
          </div>
        </div>

        {/* 1. MAIN CONVERSION SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-[55%] space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <IndianRupee className="w-4 h-4" /> Save Big on{" "}
                {pageType === "route" ? "This Route" : "Outstation Drops"}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15]">
                {pageType === "route" ? (
                  <>
                    Book One-Way Cab from{" "}
                    <span className="text-emerald-600 underline decoration-amber-400 underline-offset-4">
                      {origin}
                    </span>{" "}
                    to <span className="text-emerald-600">{destination}</span>
                  </>
                ) : (
                  <>
                    Top-Rated One-Way Taxi from{" "}
                    <span className="text-emerald-600 underline decoration-amber-400 underline-offset-4">
                      {origin}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {pageType === "route"
                  ? `Don't pay return fares for a one-way trip! Our dedicated drop taxi service from ${origin} to ${destination} guarantees smooth intercity travel at transparent one-side rates. Get doorstep pickup in ${origin} and direct drop-off anywhere in ${destination}.`
                  : `Starting your journey from ${origin}? Book our 24/7 outstation drop cabs and pay strictly for the distance you travel with zero empty return charges. Ideal for airport transfers, corporate visits, medical trips, and family travel.`}
              </p>

              {/* Verified Distance & Time Badges (AEO/GEO) */}
              {pageType === "route" && facts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                    <Navigation className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Road Distance
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        {facts.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                    <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
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

              {/* High Intent Business CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-1"
                >
                  <PhoneCall className="w-5 h-5" /> Call {PHONE_DISPLAY}
                </a>
                <a
                  href={makeWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 transition-all hover:-translate-y-1"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Smart Pricing & USP Card */}
            <div className="lg:w-[45%] w-full">
              <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0" />
                <h2 className="text-2xl font-black text-slate-900 mb-6 relative z-10">
                  Why Pay Double?
                </h2>

                <div className="space-y-4 relative z-10">
                  <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <span className="text-red-600 font-bold">X</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 line-through">
                        Standard Cabs (Round Trip Fare)
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Paying for driver&apos;s empty return.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-md transform scale-[1.02]">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-emerald-900 text-lg">
                        Khatu Rides (One-Way Drop Fare)
                      </p>
                      <p className="text-sm text-emerald-700 mt-1 font-medium">
                        You pay ONLY for the actual drop distance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC CITY / ROUTE INSIGHTS (FACT-BASED GEO) */}
        <section className="bg-emerald-900 text-white py-16 relative overflow-hidden">
          <div className="absolute opacity-5 -top-24 -left-24">
            <MapPin className="w-96 h-96" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black mb-6">
                  {pageType === "route"
                    ? `Journey Info: ${origin} to ${destination}`
                    : `Outstation One-Way Travel from ${origin}`}
                </h2>
                <div className="prose prose-invert prose-lg text-emerald-100">
                  {pageType === "route" ? (
                    <p>
                      Traveling from <strong>{origin}</strong> to{" "}
                      <strong>{destination}</strong> is convenient and
                      budget-friendly with our dedicated one-way cab network.{" "}
                      {facts ? (
                        <>
                          The road distance is{" "}
                          <strong>{facts.distance}</strong> ({facts.highway}),
                          taking approximately <strong>{facts.duration}</strong>{" "}
                          by AC cab.{" "}
                        </>
                      ) : (
                        <>
                          Our highway drivers choose the safest, fastest
                          intercity corridor for timely doorstep arrival.{" "}
                        </>
                      )}
                      All toll, state tax, and fare inclusions are confirmed
                      transparently before pickup with zero hidden surprises.
                    </p>
                  ) : (
                    <p>
                      As a major transit hub in{" "}
                      <strong>{originHub.state}</strong>,{" "}
                      <strong>{origin}</strong> serves daily travelers needing
                      direct outstation drops. Whether you are heading to an
                      airport, railway junction, corporate plant, or neighboring
                      state, booking a one-way taxi from {origin} gives you
                      door-to-door convenience at single-side pricing.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-800/50 p-6 rounded-2xl border border-emerald-700/50 backdrop-blur-sm text-center">
                  <Clock className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h3 className="font-bold text-lg">24/7 On-Time Pickup</h3>
                  <p className="text-xs text-emerald-200 mt-2">
                    Early morning &amp; night dispatch in {origin}
                  </p>
                </div>
                <div className="bg-emerald-800/50 p-6 rounded-2xl border border-emerald-700/50 backdrop-blur-sm text-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h3 className="font-bold text-lg">Safe Highway Drive</h3>
                  <p className="text-xs text-emerald-200 mt-2">
                    Verified highway drivers &amp; clean AC cabs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                How to Book Your One-Way Cab
              </h2>
              <p className="text-slate-600 mt-3 font-medium">
                3 simple steps to confirm your ride in under 2 minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6">
                  <PhoneCall className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  1. Request Quote
                </h3>
                <p className="text-sm text-slate-600">
                  Call or WhatsApp your pickup in {origin}
                  {pageType === "route" ? ` and drop in ${destination}` : ""}.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center mb-6">
                  <CarFront className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  2. Choose Car
                </h3>
                <p className="text-sm text-slate-600">
                  Pick a Swift Dzire Sedan, 7-seater Maruti Ertiga, or Toyota
                  Innova Crysta based on passengers &amp; luggage.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6">
                  <CalendarCheck className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  3. Ride &amp; Pay
                </h3>
                <p className="text-sm text-slate-600">
                  Driver arrives at your doorstep. Pay only the agreed one-way
                  drop fare transparently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FLEET OPTIONS (LIVE WORKING CTAs) */}
        <section className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Choose Your One-Way Drop Cab
              </h2>
              <p className="text-slate-600 mt-4 text-lg">
                Clean, well-maintained AC cars for comfortable outstation drops.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-400 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Sedan Drop
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Maruti Swift Dzire
                    </p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Users className="w-4 h-4" /> 4 Seats
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Luggage className="w-4 h-4" /> 2 Bags
                  </span>
                </div>
                <a
                  href={makeWhatsAppUrl("Swift Dzire Sedan")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-slate-100 text-slate-800 text-center font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Check Sedan Fare
                </a>
              </div>

              <div className="bg-white border border-amber-400 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Best Seller
                </div>
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      SUV Drop
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Maruti Ertiga (7-Seater)
                    </p>
                  </div>
                  <CarFront className="w-10 h-10 text-amber-500" />
                </div>
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Users className="w-4 h-4" /> 6+1 Seats
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Luggage className="w-4 h-4" /> 3 Bags
                  </span>
                </div>
                <a
                  href={makeWhatsAppUrl("Maruti Ertiga 7-Seater")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-amber-400 text-slate-900 text-center font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Check Ertiga Fare
                </a>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:border-slate-400 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Premium SUV
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Toyota Innova Crysta
                    </p>
                  </div>
                  <CarFront className="w-10 h-10 text-slate-300 group-hover:text-slate-700 transition-colors" />
                </div>
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Users className="w-4 h-4" /> 7 Seats
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Luggage className="w-4 h-4" /> 4 Bags
                  </span>
                </div>
                <a
                  href={makeWhatsAppUrl("Toyota Innova Crysta")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-slate-100 text-slate-800 text-center font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Check Innova Fare
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. AEO & GEO FAQs SECTION */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                One-Way Taxi FAQs
              </h2>
              <div className="h-1.5 w-20 bg-emerald-500 mx-auto mt-4 rounded-full" />
            </div>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200"
                >
                  <h3 className="font-black text-lg md:text-xl text-slate-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. RELATED ONE-WAY ROUTES (INTERNAL LINKING) */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">
              Explore More One-Way Taxi Routes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Book zero-return-fare drops across Chhattisgarh, Jharkhand,
              Odisha, UP &amp; Bihar.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 7. DYNAMIC KEYWORD CLOUD */}
        <section className="py-12 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                Popular One-Way Searches
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-xs sm:text-sm font-semibold text-slate-400 hover:border-emerald-400 hover:text-white transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL HIGH-INTENT LEAD BANNER */}
        <section className="fixed bottom-0 left-0 right-0 md:static md:bottom-auto bg-amber-400 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] md:shadow-none z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-900 text-center md:text-left hidden md:block">
              <h2 className="font-black text-xl">
                Ready for your one-way drop{" "}
                {pageType === "route" ? `to ${destination}` : `from ${origin}`}?
              </h2>
              <p className="text-sm font-semibold opacity-90">
                Call now for instant driver confirmation and transparent
                one-side fares.
              </p>
            </div>
            <a
              href={`tel:${PHONE}`}
              className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-lg text-center hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 animate-pulse text-amber-400" />{" "}
              Book Instantly
            </a>
          </div>
        </section>
      </main>
    </>
  );
}