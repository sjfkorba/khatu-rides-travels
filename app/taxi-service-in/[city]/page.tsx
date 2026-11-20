// app/taxi-service/[city]/page.tsx (routed via /taxi-service-in-[city])

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
  CreditCard,
  CheckCircle2,
  CarFront,
  Search,
  Navigation,
  ChevronRight,
  PhoneCall,
  MessageCircle,
  ArrowRight,
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
   HUB MASTER DATA (84 VERIFIED HUBS WITH ACCURATE STATES)
========================================================= */

type HubCategory =
  | "major-city"
  | "industrial"
  | "district"
  | "tourism"
  | "interstate";

type CityHub = {
  name: string;
  slug: string;
  state: string;
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

const HUBS: CityHub[] = [
  // 1. Major Cities & Commercial Hubs (Chhattisgarh)
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
  ].map((name) => ({
    name,
    slug: slugify(name),
    state: "Chhattisgarh",
    category: "major-city" as const,
  })),

  // 2. Industrial, Mining & Transit Belts (Chhattisgarh)
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
    state: "Chhattisgarh",
    category: "industrial" as const,
  })),

  // 3. District Headquarters & Regional Towns (Chhattisgarh)
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
    state: "Chhattisgarh",
    category: "district" as const,
  })),

  // 4. Tourist & Pilgrimage Spots
  ...[
    { name: "Dongargarh", state: "Chhattisgarh" },
    { name: "Mainpat", state: "Chhattisgarh" },
    { name: "Chitrakote", state: "Chhattisgarh" },
    { name: "Tirathgarh", state: "Chhattisgarh" },
    { name: "Sirpur", state: "Chhattisgarh" },
    { name: "Ratanpur", state: "Chhattisgarh" },
    { name: "Bhoramdeo", state: "Chhattisgarh" },
    { name: "Gangrel Dam", state: "Chhattisgarh" },
    { name: "Amarkantak", state: "Madhya Pradesh" },
    { name: "Bastar", state: "Chhattisgarh" },
  ].map(({ name, state }) => ({
    name,
    slug: slugify(name),
    state,
    category: "tourism" as const,
  })),

  // 5. Inter-State Border & Outstation Hubs
  ...[
    { name: "Jharsuguda", state: "Odisha" },
    { name: "Sambalpur", state: "Odisha" },
    { name: "Bargarh", state: "Odisha" },
    { name: "Rourkela", state: "Odisha" },
    { name: "Nagpur", state: "Maharashtra" },
    { name: "Gondia", state: "Maharashtra" },
    { name: "Jabalpur", state: "Madhya Pradesh" },
    { name: "Ujjain", state: "Madhya Pradesh" },
    { name: "Ranchi", state: "Jharkhand" },
    { name: "Garhwa", state: "Jharkhand" },
    { name: "Daltonganj", state: "Jharkhand" },
    { name: "Deoghar", state: "Jharkhand" },
    { name: "Patna", state: "Bihar" },
    { name: "Gaya", state: "Bihar" },
    { name: "Sasaram", state: "Bihar" },
    { name: "Varanasi", state: "Uttar Pradesh" },
    { name: "Renukoot", state: "Uttar Pradesh" },
    { name: "Shaktinagar", state: "Uttar Pradesh" },
    { name: "Sonbhadra", state: "Uttar Pradesh" },
    { name: "Prayagraj", state: "Uttar Pradesh" },
    { name: "Ayodhya", state: "Uttar Pradesh" },
  ].map(({ name, state }) => ({
    name,
    slug: slugify(name),
    state,
    category: "interstate" as const,
  })),
];

/* =========================================================
   CITY RESOLUTION & STATIC PARAMS
========================================================= */

function resolveCity(rawCity: string): CityHub | null {
  const cleanSlug = slugify(decodeURIComponent(rawCity));
  return HUBS.find((h) => h.slug === cleanSlug) ?? null;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return HUBS.map((hub) => ({
    city: hub.slug,
  }));
}

/* =========================================================
   DYNAMIC INTERNAL LINKS (OUTSTATION ROUTES + NEARBY CITIES)
========================================================= */

const TOP_DESTINATIONS = [
  "raipur",
  "korba",
  "bilaspur",
  "ambikapur",
  "raigarh",
  "ranchi",
  "jharsuguda",
  "varanasi",
];

function getPopularRoutesFromCity(current: CityHub) {
  return TOP_DESTINATIONS.filter((destSlug) => destSlug !== current.slug)
    .slice(0, 6)
    .map((destSlug) => {
      const destHub = HUBS.find((h) => h.slug === destSlug);
      return {
        name: `${current.name} to ${destHub?.name ?? destSlug} Taxi`,
        href: `/cab-service/${current.slug}-to-${destSlug}`,
      };
    });
}

function getNearbyCityPages(current: CityHub) {
  const sameState = HUBS.filter(
    (h) => h.slug !== current.slug && h.state === current.state
  );
  const otherState = HUBS.filter(
    (h) => h.slug !== current.slug && h.state !== current.state
  );
  const pool = [...sameState, ...otherState];
  const idx = HUBS.findIndex((h) => h.slug === current.slug);
  const offset = idx >= 0 ? (idx * 3) % pool.length : 0;

  const links: { name: string; href: string }[] = [];
  for (let i = 0; i < 6 && i < pool.length; i++) {
    const target = pool[(offset + i) % pool.length];
    links.push({
      name: `Taxi Service in ${target.name}`,
      href: `/taxi-service-in-${target.slug}`,
    });
  }
  return links;
}

/* =========================================================
   SEO, AEO & GEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: rawCity } = await params;
  const cityInfo = resolveCity(rawCity);

  if (!cityInfo) {
    return {
      title: "24/7 Taxi & Outstation Cab Service",
      robots: { index: false, follow: true },
    };
  }

  const cityName = cityInfo.name;
  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title = `Best Taxi Service in ${cityName} | 24/7 Local & Outstation Cabs`;
  const fullTitle = `${title} | ${BUSINESS_NAME}`;
  const description = `Book 24/7 taxi service in ${cityName}, ${cityInfo.state} with ${BUSINESS_NAME}. Clean AC Swift Dzire, 7-seater Ertiga & Innova Crysta for one-way drops, round trips, airport transfers & corporate travel.`;
  const canonical = `${SITE_URL}/taxi-service-in-${cityInfo.slug}`;

  const keywords = [
    `taxi service in ${cityName}`,
    `cab service in ${cityName}`,
    `best taxi service in ${cityName}`,
    `book taxi ${cityName}`,
    `cab booking ${cityName}`,
    `outstation cab ${cityName}`,
    `one way taxi ${cityName}`,
    `airport drop from ${cityName}`,
    `${cityName} taxi contact number`,
    `car rental with driver in ${cityName}`,
    `Swift Dzire taxi ${cityName}`,
    `Ertiga 7 seater cab ${cityName}`,
    `Innova Crysta hire ${cityName}`,
    `24x7 taxi in ${cityName}`,
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
          alt: `Best Taxi Service in ${cityName} - ${BUSINESS_NAME}`,
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

export default async function CityTaxiPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: rawCity } = await params;
  const cityInfo = resolveCity(rawCity);

  if (!cityInfo) {
    notFound();
  }

  // Redirect legacy uppercase or space URLs cleanly
  if (rawCity !== cityInfo.slug) {
    permanentRedirect(`/taxi-service-in-${cityInfo.slug}`);
  }

  const cityName = cityInfo.name;
  const canonical = `${SITE_URL}/taxi-service-in-${cityInfo.slug}`;
  const popularRoutes = getPopularRoutesFromCity(cityInfo);
  const nearbyCities = getNearbyCityPages(cityInfo);

  const faqs = [
    {
      question: `How can I book a 24/7 taxi in ${cityName} with ${BUSINESS_NAME}?`,
      answer: `You can book a cab in ${cityName} anytime by calling or WhatsApping ${PHONE_DISPLAY}, or submitting your pickup details online. We confirm driver and vehicle details quickly with transparent pricing.`,
    },
    {
      question: `Do you provide one-way and round-trip outstation cabs from ${cityName}?`,
      answer: `Yes! We operate dedicated one-way drop cabs (pay only for one side) as well as multi-day round-trip outstation taxis from ${cityName} across ${cityInfo.state} and neighboring states.`,
    },
    {
      question: `Which vehicles are available for taxi booking in ${cityName}?`,
      answer: `Our clean AC fleet in ${cityName} includes 4-seater Sedans (Maruti Swift Dzire), 7-seater SUVs (Maruti Ertiga), and premium Toyota Innova Crysta cabs with verified local and highway drivers.`,
    },
    {
      question: `Are early morning railway station and airport drops available from ${cityName}?`,
      answer: `Yes, we operate 24/7 for early morning and late-night airport transfers (Raipur, Bilaspur, Jharsuguda, Ambikapur & Ranchi Airports) and railway station pickups from ${cityName}.`,
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
        name: `Best Taxi Service in ${cityName} | ${BUSINESS_NAME}`,
        description: `24/7 local, one-way, airport, and outstation taxi service in ${cityName}, ${cityInfo.state}.`,
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
            name: `Taxi Service in ${cityName}`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        serviceType: "Taxi & Outstation Cab Service",
        name: `24/7 Taxi & Cab Service in ${cityName}`,
        url: canonical,
        description: `Reliable 24/7 taxi service in ${cityName}, ${cityInfo.state} offering local hourly rentals, one-way drops, airport transfers, corporate travel, and outstation cabs.`,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: [
          { "@type": "City", name: cityName },
          { "@type": "State", name: cityInfo.state },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${cityName} Taxi & Cab Services`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `One-Way Outstation Cab from ${cityName}`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Airport & Railway Station Taxi in ${cityName}`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Local Hourly & Full-Day Car Rental in ${cityName}`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Corporate & Wedding Fleet Hire in ${cityName}`,
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
    `Taxi service in ${cityName}`,
    `Cab booking ${cityName}`,
    `Outstation taxi from ${cityName}`,
    `Airport drop from ${cityName}`,
    `One way taxi ${cityName}`,
    `Car rental with driver in ${cityName}`,
    `Swift Dzire cab ${cityName}`,
    `Ertiga 7-seater taxi ${cityName}`,
    `Innova Crysta hire ${cityName}`,
    `24x7 taxi contact ${cityName}`,
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello ${BUSINESS_NAME}, I need a taxi in ${cityName}.\n\nPlease share cab availability and best fare details.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />

      <FloatingContact origin={cityName} destination="Anywhere" />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* Unified SEO + AEO + GEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-amber-400 font-semibold">
            Taxi Service in {cityName}
          </span>
        </nav>

        {/* Hero: Prefill Pickup location as the City */}
        <RouteHero initialPickup={cityName} initialDrop="" />

        {/* TRUST BAR */}
        <div className="bg-slate-900 text-white py-6 border-b-4 border-amber-400 shadow-lg relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/20">
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">
                  10K+
                </p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Happy Customers
                </p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">
                  4.9/5
                </p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Customer Ratings
                </p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">
                  ₹0
                </p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Hidden Charges
                </p>
              </div>
              <div className="px-2">
                <p className="text-2xl md:text-3xl font-black text-amber-400">
                  24/7
                </p>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider mt-1 text-slate-300">
                  Available in {cityName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CITY OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                <Navigation className="w-4 h-4" /> 24/7 Cab Dispatch in{" "}
                {cityName}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Reliable Taxi Service in{" "}
                <span className="text-amber-500">{cityName}</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed">
                Need a safe, punctual ride from <strong>{cityName}</strong> (
                {cityInfo.state})? {BUSINESS_NAME} is your trusted travel
                partner. We provide{" "}
                <strong className="text-slate-800">Outstation Cabs</strong>,{" "}
                <strong className="text-slate-800">One-Way Drops</strong>,{" "}
                <strong className="text-slate-800">Airport Transfers</strong>,
                and{" "}
                <strong className="text-slate-800">
                  Local Hourly Rentals
                </strong>{" "}
                right from your doorstep in {cityName}.
              </p>

              <ul className="space-y-3 mt-4">
                {[
                  `Doorstep Pickup anywhere in ${cityName}`,
                  "Zero Return Fare for One-Way Outstation Trips",
                  "Verified, Local & Experienced Highway Chauffeurs",
                  "Clean AC Swift Dzire, 7-Seater Ertiga & Innova Crysta",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-4 rounded-xl font-black text-sm hover:bg-slate-800 shadow-lg transition"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" /> Call{" "}
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-7 py-4 rounded-xl font-black text-sm hover:bg-green-700 shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp for Fare
                </a>
              </div>
            </div>

            {/* Visual City Card */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-0" />
                <h2 className="text-2xl font-black text-slate-900 mb-8 relative z-10">
                  Start Your Journey from {cityName}
                </h2>

                <div className="relative border-l-4 border-dashed border-slate-200 ml-4 pl-8 space-y-10 py-2">
                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Pickup City ({cityInfo.state})
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {cityName}
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-slate-900" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Any Destination
                    </p>
                    <p className="text-xl font-black text-slate-400 italic">
                      Local, Airport or Outstation
                    </p>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <CarFront className="w-10 h-10 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      AC Fleet Available in {cityName}
                    </p>
                    <p className="text-slate-900 font-semibold">
                      Swift Dzire, Maruti Ertiga &amp; Innova Crysta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Why Choose Our Cabs in {cityName}?
              </h2>
              <p className="text-slate-400 mt-4 text-lg">
                Experience safe, punctual travel across {cityInfo.state} and
                interstate highways with our well-maintained fleet.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Clear Pricing
                </h3>
                <p className="text-slate-400">
                  Get a transparent fare quote before you travel from {cityName}
                  . Zero hidden charges and no last-minute surprises.
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Trusted Drivers
                </h3>
                <p className="text-slate-400">
                  We assign verified, polite chauffeurs experienced on local
                  roads and long-distance highway corridors from {cityName}.
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  24/7 On-Time Pickup
                </h3>
                <p className="text-slate-400">
                  Early morning airport drop or late-night railway pickup—we
                  coordinate punctual doorstep arrivals across {cityName}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR OUTSTATION ROUTES FROM THIS CITY (INTERNAL LINKING) */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Popular Outstation Taxi Routes from {cityName}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Book direct one-way or round-trip AC cabs starting from {cityName}.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularRoutes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:border-amber-400 hover:bg-amber-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
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
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">
                Popular Taxi Searches in {cityName}
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

        {/* NEARBY CITY TAXI PAGES (INTERNAL LINKING) */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">
              Explore Taxi Services in Nearby Cities
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              24/7 cab dispatch across Chhattisgarh, Jharkhand, Odisha, UP &amp;
              Bihar.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyCities.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-amber-400 hover:bg-amber-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}