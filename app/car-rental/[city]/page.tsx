// app/car-rental/[city]/page.tsx

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";

import RentalHero from "@/components/RentalHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar";
import FloatingContact from "@/components/FloatingContact";

import {
  Briefcase,
  ShoppingBag,
  Map,
  Clock,
  ChevronRight,
  Search,
  MapPin,
  ArrowRight,
  PhoneCall,
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
   CITY MASTER DATA (28 SYNCED GBP LOCAL RENTAL HUBS)
========================================================= */

type CityInfo = {
  slug: string;
  name: string;
  state: string;
  landmarks: string[];
};

const CITIES: CityInfo[] = [
  {
    slug: "korba",
    name: "Korba",
    state: "Chhattisgarh",
    landmarks: [
      "Bus Stand Road",
      "Transport Nagar",
      "TP Nagar",
      "CSEB Chowk",
      "Niharika",
      "Ghantaghar",
      "BALCO Township",
      "NTPC Jamnipali",
      "Korba Railway Station",
    ],
  },
  {
    slug: "raipur",
    name: "Raipur",
    state: "Chhattisgarh",
    landmarks: [
      "Swami Vivekananda Airport (Mana)",
      "Raipur Railway Station",
      "VIP Road",
      "Telibandha",
      "Pandri",
      "Shankar Nagar",
      "Tatibandh",
      "AIIMS Raipur",
      "Nava Raipur Mantralaya",
    ],
  },
  {
    slug: "naya-raipur",
    name: "Naya Raipur",
    state: "Chhattisgarh",
    landmarks: [
      "Atal Nagar",
      "Mahanadi Bhawan (Mantralaya)",
      "Indravati Bhawan",
      "Jungle Safari",
      "Mana Airport",
      "Sector 19 & 27",
    ],
  },
  {
    slug: "bilaspur",
    name: "Bilaspur",
    state: "Chhattisgarh",
    landmarks: [
      "Bilaspur Junction",
      "Uslapur Railway Station",
      "Chakarbhata Airport",
      "Chhattisgarh High Court (Bodri)",
      "Apollo Hospital",
      "Vyapar Vihar",
      "Seepat NTPC",
    ],
  },
  {
    slug: "ambikapur",
    name: "Ambikapur",
    state: "Chhattisgarh",
    landmarks: [
      "Ambikapur Railway Station",
      "Maa Mahamaya Airport (Darima)",
      "Gandhi Chowk",
      "Ghadi Chowk",
      "Pratiksha Bus Stand",
      "Banaras Road",
      "Medical College Ambikapur",
    ],
  },
  {
    slug: "raigarh",
    name: "Raigarh",
    state: "Chhattisgarh",
    landmarks: [
      "Raigarh Railway Station",
      "JSPL Jindal Nagar",
      "Tamnar",
      "Gharghoda",
      "Punjipathra",
      "Chakradhar Nagar",
    ],
  },
  {
    slug: "durg",
    name: "Durg",
    state: "Chhattisgarh",
    landmarks: [
      "Durg Junction",
      "Malviya Nagar",
      "Padmanabhpur",
      "Pulgaon",
      "Borsi",
    ],
  },
  {
    slug: "bhilai",
    name: "Bhilai",
    state: "Chhattisgarh",
    landmarks: [
      "Bhilai Steel Plant (BSP)",
      "Civic Centre",
      "Supela",
      "Nehru Nagar",
      "IIT Bhilai",
      "Power House",
    ],
  },
  {
    slug: "jagdalpur",
    name: "Jagdalpur",
    state: "Chhattisgarh",
    landmarks: [
      "Jagdalpur Airport",
      "Jagdalpur Railway Station",
      "Dalpat Sagar",
      "Chitrakote Road",
      "Geedam Road",
    ],
  },
  {
    slug: "rajnandgaon",
    name: "Rajnandgaon",
    state: "Chhattisgarh",
    landmarks: [
      "Rajnandgaon Railway Station",
      "Dongargarh Road",
      "G.E. Road",
      "Medical College",
    ],
  },
  {
    slug: "champa",
    name: "Champa",
    state: "Chhattisgarh",
    landmarks: [
      "Champa Junction",
      "Naila Janjgir Road",
      "Bhojpur",
      "Main Market",
    ],
  },
  {
    slug: "janjgir",
    name: "Janjgir",
    state: "Chhattisgarh",
    landmarks: [
      "Naila Railway Station",
      "Kachahari Chowk",
      "Link Road",
      "Champa Road",
    ],
  },
  {
    slug: "kharsia",
    name: "Kharsia",
    state: "Chhattisgarh",
    landmarks: ["Kharsia Railway Station", "Main Market", "Raigarh Road"],
  },
  {
    slug: "katghora",
    name: "Katghora",
    state: "Chhattisgarh",
    landmarks: ["Katghora Bus Stand", "Ambikapur Highway", "Korba Road"],
  },
  {
    slug: "dipka",
    name: "Dipka",
    state: "Chhattisgarh",
    landmarks: ["SECL Dipka Colony", "Gevra Road", "Urja Nagar"],
  },
  {
    slug: "gevra",
    name: "Gevra",
    state: "Chhattisgarh",
    landmarks: ["SECL Gevra Area", "Gevra Road Station", "Dipka Chowk"],
  },
  {
    slug: "kusmunda",
    name: "Kusmunda",
    state: "Chhattisgarh",
    landmarks: ["SECL Kusmunda Colony", "Vikas Nagar", "Korba Bypass"],
  },
  {
    slug: "balco",
    name: "Balco",
    state: "Chhattisgarh",
    landmarks: ["BALCO Plant Gate", "BALCO Township", "Sector 1 to 5", "Parsabhata"],
  },
  {
    slug: "uslapur",
    name: "Uslapur",
    state: "Chhattisgarh",
    landmarks: ["Uslapur Railway Station", "Mungeli Road", "Nehru Chowk"],
  },
  {
    slug: "sakti",
    name: "Sakti",
    state: "Chhattisgarh",
    landmarks: ["Sakti Railway Station", "Main Market", "Champa Road"],
  },
  {
    slug: "surajpur",
    name: "Surajpur",
    state: "Chhattisgarh",
    landmarks: ["Surajpur Town", "Bishrampur Road", "Ambikapur Highway"],
  },
  {
    slug: "bishrampur",
    name: "Bishrampur",
    state: "Chhattisgarh",
    landmarks: ["SECL Bishrampur Colony", "Bishrampur Station", "Main Market"],
  },
  {
    slug: "garhwa",
    name: "Garhwa",
    state: "Jharkhand",
    landmarks: [
      "Garhwa Road Junction",
      "Ranka More",
      "Majhiaon More",
      "Chinia More",
      "Garhwa Town",
      "Nagar Untari",
    ],
  },
  {
    slug: "daltonganj",
    name: "Daltonganj",
    state: "Jharkhand",
    landmarks: [
      "Daltonganj Railway Station",
      "Medininagar",
      "Chiyanki",
      "Betla Road",
    ],
  },
  {
    slug: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    landmarks: [
      "Birsa Munda Airport (IXR)",
      "Ranchi Railway Station",
      "Hatia Station",
      "RIMS Hospital",
      "Lalpur",
      "Kanke",
    ],
  },
  {
    slug: "jharsuguda",
    name: "Jharsuguda",
    state: "Odisha",
    landmarks: [
      "Veer Surendra Sai Airport (JRG)",
      "Jharsuguda Junction",
      "Vedanta Township",
      "Brajrajnagar",
      "Belpahar",
      "Sarbahal",
    ],
  },
  {
    slug: "sambalpur",
    name: "Sambalpur",
    state: "Odisha",
    landmarks: [
      "Sambalpur Junction",
      "Burla",
      "Ainthapali",
      "Hirakud",
    ],
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    landmarks: [
      "Babatpur Airport (VNS)",
      "Varanasi Cantt Station",
      "DDU (Mughalsarai) Junction",
      "BHU Hospital",
      "Kashi Vishwanath Corridor",
    ],
  },
];

/* =========================================================
   UTILITIES & CITY RESOLUTION
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveCity(cityParam: string): CityInfo | null {
  const cleanSlug = slugify(decodeURIComponent(cityParam));
  return CITIES.find((c) => c.slug === cleanSlug) ?? null;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

function getNearbyCities(current: CityInfo) {
  const sameState = CITIES.filter(
    (c) => c.slug !== current.slug && c.state === current.state
  );
  const otherState = CITIES.filter(
    (c) => c.slug !== current.slug && c.state !== current.state
  );
  const pool = [...sameState, ...otherState];
  const idx = CITIES.findIndex((c) => c.slug === current.slug);
  const offset = idx >= 0 ? (idx * 3) % pool.length : 0;

  const result: CityInfo[] = [];
  for (let i = 0; i < 6 && i < pool.length; i++) {
    result.push(pool[(offset + i) % pool.length]);
  }
  return result;
}

/* =========================================================
   METADATA (SEO, AEO & GEO)
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const cityInfo = resolveCity(cityParam);

  if (!cityInfo) {
    return {
      title: "Local Car Rental & Hourly Cab Service",
      robots: { index: false, follow: true },
    };
  }

  const cityName = cityInfo.name;
  // Uses layout.tsx template: "%s | Khatu Rides Travels Co."
  const title = `Local Car Rental & Hourly Cab Service in ${cityName}`;
  const fullTitle = `${title} | ${BUSINESS_NAME}`;
  const description = `Book 4hr/40km, 8hr/80km & 12hr/120km local car rental with driver in ${cityName}, ${cityInfo.state}. Clean AC Swift Dzire, Ertiga & Innova Crysta for city tours, corporate meetings, hospital visits & shopping.`;
  const canonical = `${SITE_URL}/car-rental/${cityInfo.slug}`;

  const keywords = [
    `car rental ${cityName}`,
    `car rental with driver in ${cityName}`,
    `local taxi in ${cityName}`,
    `local cab service ${cityName}`,
    `hourly cab ${cityName}`,
    `8 hours 80 km taxi ${cityName}`,
    `4 hours 40 km cab ${cityName}`,
    `full day cab ${cityName}`,
    `half day taxi ${cityName}`,
    `rent a car ${cityName}`,
    `corporate cab rental ${cityName}`,
    `Swift Dzire rental ${cityName}`,
    `Ertiga 7 seater rental ${cityName}`,
    `Innova Crysta on rent in ${cityName}`,
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
          alt: `Local Car Rental & Hourly Cab Service in ${cityName} - ${BUSINESS_NAME}`,
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

export default async function CarRentalPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await params;
  const cityInfo = resolveCity(cityParam);

  if (!cityInfo) {
    notFound();
  }

  // Redirect uppercase or non-canonical slugs cleanly
  if (cityParam !== cityInfo.slug) {
    permanentRedirect(`/car-rental/${cityInfo.slug}`);
  }

  const cityName = cityInfo.name;
  const canonical = `${SITE_URL}/car-rental/${cityInfo.slug}`;
  const nearbyCities = getNearbyCities(cityInfo);

  const faqs = [
    {
      question: `What local hourly cab packages are available in ${cityName}?`,
      answer: `${BUSINESS_NAME} offers 3 flexible chauffeur-driven local car rental packages in ${cityName}: Half Day (4 Hours / 40 Kms), Full Day (8 Hours / 80 Kms), and Extended Day (12 Hours / 120 Kms) in AC Swift Dzire, Maruti Ertiga, and Toyota Innova Crysta.`,
    },
    {
      question: `What happens if I exceed the 8 Hours / 80 Kms limit in ${cityName}?`,
      answer: `If your local trip extends beyond the selected package limit, only standard extra per-kilometer and extra per-hour charges apply based on your chosen vehicle (Sedan, Ertiga, or Innova Crysta). All extra rates are confirmed upfront before pickup.`,
    },
    {
      question: `Can I take a local hourly rental cab outside ${cityName}?`,
      answer: `Hourly packages (4hr/40km, 8hr/80km, 12hr/120km) are designed for travel within ${cityName} city limits. For intercity or interstate travel, you can book our dedicated one-way or round-trip outstation cab service.`,
    },
    {
      question: `Do you provide local corporate & monthly car rentals with driver in ${cityName}?`,
      answer: `Yes, we provide daily hourly cabs as well as monthly corporate car rentals with verified drivers for offices, industrial plants, hospital visits, and family events across ${cityName}.`,
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
        name: `Local Car Rental & Hourly Cab Service in ${cityName} | ${BUSINESS_NAME}`,
        description: `Book 4hr/40km, 8hr/80km, and 12hr/120km local car rental with driver in ${cityName}, ${cityInfo.state}.`,
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
            name: "Local Car Rental",
            item: `${SITE_URL}/car-rental`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${cityName} Car Rental`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        serviceType: "Local Car Rental with Driver",
        name: `Local Hourly Cab Rental in ${cityName}`,
        description: `Full-day, half-day, and extended hourly AC cab rental packages in ${cityName}, ${cityInfo.state} including 4hr/40km, 8hr/80km, and 12hr/120km options with verified drivers.`,
        url: canonical,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: [
          { "@type": "City", name: cityName },
          { "@type": "State", name: cityInfo.state },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${cityName} Hourly Car Rental Packages`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Half Day Cab Rental in ${cityName} (4 Hours / 40 Kms)`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Full Day Cab Rental in ${cityName} (8 Hours / 80 Kms)`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Extended Day Cab Rental in ${cityName} (12 Hours / 120 Kms)`,
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
    `Local taxi in ${cityName}`,
    `Car rental with driver in ${cityName}`,
    `Full day cab ${cityName}`,
    `Half day taxi ${cityName}`,
    `8 hours 80 km cab ${cityName}`,
    `4 hours 40 km taxi ${cityName}`,
    `12 hours 120 km car rental ${cityName}`,
    `City tour taxi ${cityName}`,
    `Hospital visit cab ${cityName}`,
    `Corporate hourly cab ${cityName}`,
    `Swift Dzire rental ${cityName}`,
    `Ertiga full day fare ${cityName}`,
    `Innova Crysta rental ${cityName}`,
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello ${BUSINESS_NAME}, I want to book a local hourly car rental in ${cityName}.\n\nPackage: 4hr/40km, 8hr/80km, or 12hr/120km\n\nPlease share vehicle availability and package rates.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />
      <FloatingContact origin={cityName} destination="Local Hourly Rental" />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
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
          className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-pink-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span>Local Car Rental</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold">{cityName}</span>
        </nav>

        {/* Rental Hero Section */}
        <RentalHero initialCity={cityName} />

        {/* HOURLY PACKAGES TABLE SECTION */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Flexible Hourly Packages in {cityName}
              </h2>
              <p className="text-slate-600 mt-4 text-lg">
                No more booking multiple rides. Keep a clean AC cab with driver
                as long as you need across {cityName}.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Package 1 */}
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:shadow-xl hover:border-pink-300 transition-all text-center">
                <div className="bg-pink-100 text-pink-700 font-bold px-4 py-1.5 rounded-full inline-block mb-6 text-sm">
                  Half Day
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  4 Hrs
                </h3>
                <p className="text-xl font-bold text-slate-500 mb-6">
                  40 Kms Limit
                </p>
                <p className="text-slate-600 text-sm font-medium mb-8">
                  Perfect for short business meetings, quick shopping trips, or
                  station/airport transfers with waiting time in {cityName}.
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <a
                    href={`tel:${PHONE}`}
                    className="text-pink-600 font-bold hover:text-pink-700 flex items-center justify-center gap-2"
                  >
                    Get Quote <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Package 2 */}
              <div className="bg-gradient-to-b from-rose-50 to-pink-50 rounded-[32px] p-8 border-2 border-rose-400 shadow-lg relative text-center md:scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black px-6 py-1.5 rounded-full text-sm shadow-md uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="bg-rose-200 text-rose-800 font-bold px-4 py-1.5 rounded-full inline-block mt-4 mb-6 text-sm">
                  Full Day
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  8 Hrs
                </h3>
                <p className="text-xl font-bold text-rose-600 mb-6">
                  80 Kms Limit
                </p>
                <p className="text-slate-700 text-sm font-medium mb-8">
                  The standard choice for local city tours, multiple corporate
                  visits, hospital appointments, or family functions in{" "}
                  {cityName}.
                </p>
                <div className="border-t border-rose-200 pt-6">
                  <a
                    href={`tel:${PHONE}`}
                    className="bg-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-rose-600 transition-colors inline-block w-full"
                  >
                    Book Full Day Cab
                  </a>
                </div>
              </div>

              {/* Package 3 */}
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 hover:shadow-xl hover:border-pink-300 transition-all text-center">
                <div className="bg-indigo-100 text-indigo-700 font-bold px-4 py-1.5 rounded-full inline-block mb-6 text-sm">
                  Extended Day
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  12 Hrs
                </h3>
                <p className="text-xl font-bold text-slate-500 mb-6">
                  120 Kms Limit
                </p>
                <p className="text-slate-600 text-sm font-medium mb-8">
                  Ideal for weddings, full-day executive schedules, or visiting
                  nearby outskirts of {cityName}.
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <a
                    href={`tel:${PHONE}`}
                    className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center justify-center gap-2"
                  >
                    Get Quote <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* HYPERLOCAL PICKUP ZONES (GEO SIGNAL) */}
            {cityInfo.landmarks.length > 0 && (
              <div className="mt-14 rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                  <h3 className="text-lg font-black text-slate-900">
                    24/7 Doorstep Pickup Areas in {cityName}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cityInfo.landmarks.map((area) => (
                    <span
                      key={area}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.15),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black">
                Why Rent a Local Cab in {cityName}?
              </h2>
              <p className="text-slate-400 mt-4 text-lg">
                Your personal chauffeur-driven AC car (Swift Dzire, Ertiga &amp;
                Innova Crysta) for all local travel needs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <Briefcase className="w-10 h-10 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Business Meetings</h3>
                <p className="text-slate-400 text-sm">
                  Attend multiple corporate and industrial visits across{" "}
                  {cityName} without worrying about parking or waiting.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <ShoppingBag className="w-10 h-10 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Shopping Spree</h3>
                <p className="text-slate-400 text-sm">
                  Shop comfortably and keep all your bags safely in the car
                  while visiting markets and malls in {cityName}.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">City Sightseeing</h3>
                <p className="text-slate-400 text-sm">
                  Explore local temples, parks, and landmarks of {cityName} at
                  your own pace with family and friends.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <Clock className="w-10 h-10 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Hospital Visits</h3>
                <p className="text-slate-400 text-sm">
                  Comfortable, hygienic AC rides for senior citizens and
                  patients who need reliable waiting time at clinics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Hourly Rental FAQs in {cityName}
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
                >
                  <h3 className="font-black text-xl text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Direct CTA */}
            <div className="mt-12 text-center bg-rose-50 p-8 rounded-3xl border border-rose-200">
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Book Your Local Cab in {cityName} Today
              </h3>
              <p className="text-slate-600 mb-6">
                Call or WhatsApp {BUSINESS_NAME} for instant hourly package
                quotes and driver confirmation.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`tel:${PHONE}`}
                  className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg inline-flex justify-center items-center gap-2"
                >
                  <PhoneCall className="w-5 h-5" /> Call {PHONE_DISPLAY}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-green-700 transition shadow-lg inline-flex justify-center items-center gap-2"
                >
                  WhatsApp for Quote <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* KEYWORD CLOUD */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Search className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-800">
                Popular Car Rental Searches in {cityName}
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-500 hover:border-rose-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* INTERNAL LINKING: OTHER CITIES */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">
              Explore Local Car Rental in Other Cities
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Book hourly &amp; full-day chauffeur-driven cabs across
              Chhattisgarh, Jharkhand, Odisha &amp; UP.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyCities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/car-rental/${other.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:border-rose-400 hover:bg-rose-50"
                >
                  <span className="text-sm font-bold text-slate-800">
                    Car Rental in {other.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-rose-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}