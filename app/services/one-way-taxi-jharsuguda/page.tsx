import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Factory,
  MapPin,
  Navigation,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Star,
  TrainFront,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";

import Footer from "@/components/Footer";
import ReviewsCarousel from "@/components/ReviewsCarousel";

const SITE_URL = "https://www.khaturidescg.in";
const PAGE_URL = `${SITE_URL}/cabs/jharsuguda`;

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/* =========================================================
   MAJOR CHHATTISGARH HUBS
========================================================= */

const MAJOR_HUBS = [
  {
    name: "Raigarh",
    region: "Northern Chhattisgarh Gateway",
    description:
      "Book a Jharsuguda to Raigarh taxi for industrial travel, business meetings, railway connectivity, family visits and onward travel across northern Chhattisgarh.",
    subHubs: [
      "Kharsia",
      "Sarangarh",
      "Gharghoda",
      "Tamnar",
      "Dharamjaigarh",
      "Lailunga",
    ],
  },
  {
    name: "Korba",
    region: "Power & Industrial Hub",
    description:
      "Travel from Jharsuguda to Korba by outstation cab, with connectivity toward major industrial, mining, township and regional areas around Korba.",
    subHubs: [
      "Katghora",
      "Dipka",
      "Gevra",
      "Kusmunda",
      "Darri",
      "Balco",
      "Jamnipali",
    ],
  },
  {
    name: "Bilaspur",
    region: "Central Chhattisgarh Hub",
    description:
      "Jharsuguda to Bilaspur cab service for business travel, railway journeys, medical visits, family travel and onward connectivity across central Chhattisgarh.",
    subHubs: [
      "Champa",
      "Janjgir",
      "Sakti",
      "Mungeli",
      "Pendra Road",
      "Gaurela",
      "Ratanpur",
    ],
  },
  {
    name: "Raipur",
    region: "State Capital & Airport Gateway",
    description:
      "Book a Jharsuguda to Raipur taxi for airport transfers, corporate travel, railway journeys, government work, shopping, family travel and long-distance transportation.",
    subHubs: [
      "Raipur Airport",
      "Naya Raipur",
      "Abhanpur",
      "Arang",
      "Tilda",
      "Bhatapara",
      "Baloda Bazar",
    ],
  },
  {
    name: "Durg & Bhilai",
    region: "Industrial & Business Corridor",
    description:
      "Long-distance cab connectivity from Jharsuguda to Durg, Bhilai and surrounding industrial, residential, railway and business areas.",
    subHubs: [
      "Durg",
      "Bhilai",
      "Bhilai Nagar",
      "Bhilai Steel Plant Area",
      "Kumhari",
      "Charoda",
      "Risali",
    ],
  },
  {
    name: "Ambikapur",
    region: "Northern Chhattisgarh",
    description:
      "Book a long-distance taxi from Jharsuguda to Ambikapur for Surguja-region travel, family journeys, business trips and onward travel across northern Chhattisgarh.",
    subHubs: [
      "Surajpur",
      "Bishrampur",
      "Sitapur",
      "Lakhanpur",
      "Lundra",
      "Manendragarh",
      "Baikunthpur",
    ],
  },
  {
    name: "Jagdalpur",
    region: "Bastar Gateway",
    description:
      "Jharsuguda to Jagdalpur outstation taxi service for long-distance travel toward Bastar, tourism, business travel and family journeys.",
    subHubs: [
      "Kondagaon",
      "Kanker",
      "Dantewada",
      "Bacheli",
      "Kirandul",
      "Narayanpur",
      "Bastar",
    ],
  },
];

/* =========================================================
   SUB HUBS
========================================================= */

const SECONDARY_HUBS = [
  {
    name: "Raigarh Region",
    places:
      "Kharsia • Gharghoda • Tamnar • Dharamjaigarh • Sarangarh • Lailunga",
  },
  {
    name: "Korba Industrial Region",
    places:
      "Katghora • Dipka • Gevra • Kusmunda • Balco • Darri • Jamnipali",
  },
  {
    name: "Bilaspur Region",
    places:
      "Champa • Janjgir • Sakti • Mungeli • Ratanpur • Pendra Road • Gaurela",
  },
  {
    name: "Raipur Region",
    places:
      "Naya Raipur • Tilda • Arang • Abhanpur • Bhatapara • Baloda Bazar",
  },
  {
    name: "Durg-Bhilai Region",
    places: "Durg • Bhilai • Kumhari • Risali • Charoda",
  },
  {
    name: "Northern Chhattisgarh",
    places:
      "Ambikapur • Surajpur • Bishrampur • Lakhanpur • Sitapur • Manendragarh • Baikunthpur",
  },
  {
    name: "Bastar Region",
    places:
      "Jagdalpur • Kanker • Kondagaon • Dantewada • Kirandul • Bacheli • Narayanpur",
  },
  {
    name: "Janjgir-Champa Region",
    places: "Janjgir • Champa • Akaltara • Naila",
  },
];

/* =========================================================
   SERVICES
========================================================= */

const SERVICES = [
  {
    icon: Route,
    title: "One Way Taxi Service",
    description:
      "Point-to-point intercity cab booking from Jharsuguda to Chhattisgarh cities, towns, railway stations, industrial locations and other destinations.",
  },
  {
    icon: Car,
    title: "Round Trip Taxi",
    description:
      "Comfortable return cab service for business visits, family travel, medical appointments, personal work and multi-day journeys.",
  },
  {
    icon: TrainFront,
    title: "Railway Station Transfers",
    description:
      "Planned pickup and drop services for Jharsuguda Railway Station and major railway hubs across Chhattisgarh.",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Pre-planned airport pickup and drop services based on your flight schedule, destination and travel requirements.",
  },
  {
    icon: Factory,
    title: "Industrial Travel",
    description:
      "Cab solutions for plant visits, industrial locations, employees, contractors, vendors and business travellers.",
  },
  {
    icon: Building2,
    title: "Corporate Cab Service",
    description:
      "Professional transportation for meetings, client visits, employee movement, executive travel and corporate requirements.",
  },
];

/* =========================================================
   LOCAL JHARSUGUDA COVERAGE
========================================================= */

const LOCAL_AREAS = [
  "Jharsuguda Main Town",
  "Jharsuguda Railway Station",
  "Jharsuguda Airport",
  "Beheramal",
  "Sarbahal",
  "Brajarajnagar",
  "Belpahar",
  "Brajarajnagar Coal Belt",
  "Laikera",
  "Kolabira",
  "Kirmira",
  "Lakhanpur",
  "Rengali",
  "Bandhbahal",
  "Orient Area",
  "Industrial Belt",
];

/* =========================================================
   VEHICLES
========================================================= */

const VEHICLES = [
  {
    name: "Maruti Suzuki Dzire",
    type: "Premium Sedan",
    image: "/dezire.png",
    details: [
      "4+1 Seats",
      "Air Conditioned",
      "2 Bags",
      "Ideal for business travel",
    ],
  },
  {
    name: "Maruti Suzuki Ertiga",
    type: "Family MUV",
    image: "/ertiga.png",
    details: [
      "6+1 Seats",
      "Air Conditioned",
      "4 Bags",
      "Ideal for families",
    ],
  },
  {
    name: "Toyota Innova Crysta",
    type: "Premium SUV",
    image: "/crysta.png",
    details: [
      "6+1 Seats",
      "Premium Comfort",
      "Large Luggage",
      "Ideal for long journeys",
    ],
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    q: "Can I book a taxi from Jharsuguda to Chhattisgarh?",
    a: "Yes. You can enquire about one-way, round-trip and outstation taxi services from Jharsuguda to major Chhattisgarh destinations including Raigarh, Korba, Bilaspur, Raipur, Durg-Bhilai, Ambikapur and Jagdalpur.",
  },
  {
    q: "Do you provide Jharsuguda to Raigarh taxi service?",
    a: "Yes. One-way and round-trip taxi requirements from Jharsuguda to Raigarh can be discussed with the booking team. You can also enquire for nearby destinations such as Kharsia, Gharghoda, Tamnar and Sarangarh.",
  },
  {
    q: "Can I book a Jharsuguda to Korba cab?",
    a: "Yes. Jharsuguda to Korba is an important long-distance travel corridor. Cab enquiries can also be made for nearby locations including Katghora, Dipka, Gevra, Kusmunda, Balco and Darri.",
  },
  {
    q: "Can I book a taxi from Jharsuguda to Bilaspur?",
    a: "Yes. You can enquire for one-way and round-trip taxi services from Jharsuguda to Bilaspur. Nearby destinations such as Champa, Janjgir, Sakti, Mungeli and Ratanpur can also be discussed.",
  },
  {
    q: "Can I book a Jharsuguda to Raipur Airport cab?",
    a: "Yes. Pre-planned airport transfers from Jharsuguda to Raipur Airport can be arranged based on your flight schedule. Share your pickup location and flight timing with the booking team.",
  },
  {
    q: "Do you provide Jharsuguda to Durg and Bhilai taxi service?",
    a: "Yes. Long-distance cab enquiries can be made for Durg, Bhilai and surrounding industrial and residential areas. These services can be used for business travel, railway transfers, family journeys and personal travel.",
  },
  {
    q: "Can I book a taxi to smaller towns or industrial areas?",
    a: "Yes. You do not need to restrict your destination to a major city. Share your exact pickup and destination for smaller towns, industrial locations, railway stations, townships and regional destinations.",
  },
  {
    q: "Which cars are available for long-distance travel?",
    a: "Depending on availability, sedan, Ertiga and premium SUV options can be arranged. Vehicle selection can be based on passenger count, luggage, distance and comfort requirements.",
  },
];

/* =========================================================
   WHATSAPP ICON
========================================================= */

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3.25C9.04 3.25 3.4 8.89 3.4 15.85c0 2.22.58 4.31 1.69 6.14L3.25 28.75l6.94-1.8a12.5 12.5 0 0 0 5.81 1.43h.01c6.95 0 12.59-5.64 12.59-12.6C28.6 8.89 22.96 3.25 16 3.25Z"
        fill="currentColor"
      />
      <path
        d="M11.05 9.85c.25-.28.53-.3.77-.3.2 0 .42 0 .61.01.2.01.46-.08.72.47.26.56.9 2.19.98 2.35.08.16.13.35.02.56-.1.2-.15.35-.3.54-.15.18-.31.4-.45.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.07 1.3 2.37 1.45.3.15.48.13.66-.08.18-.2.76-.89.96-1.2.2-.31.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.23.57.36.08.13.08.77-.18 1.5-.25.72-1.47 1.38-2.03 1.46-.52.08-1.18.12-1.9-.12-.44-.15-1-.32-1.72-.64-3.03-1.3-5-4.33-5.15-4.53-.15-.2-1.23-1.64-1.23-3.13 0-1.48.77-2.2 1.05-2.5Z"
        fill="white"
      />
    </svg>
  );
}

/* =========================================================
   MOBILE FLOATING ACTION
========================================================= */

function FloatingActions() {
  const message = waLink(
    "Hello Khatu Rides, I want to book a cab from Jharsuguda. Please share available vehicle options and fare."
  );

  return (
    <details className="fixed bottom-5 right-4 z-50 md:hidden">
      <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-full border-2 border-white bg-[#FF1726] text-white shadow-[0_10px_30px_rgba(255,23,38,.45),0_0_35px_rgba(255,23,38,.25)] transition-all duration-300 hover:scale-105 hover:bg-[#E90012]">
        <Phone
          size={25}
          strokeWidth={2.8}
          fill="currentColor"
        />
      </summary>

      <div className="absolute bottom-[68px] right-0 flex w-[190px] flex-col gap-2">
        <a
          href={`tel:+91${PHONE}`}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF1726] px-4 text-[12px] font-black text-white shadow-xl"
        >
          <Phone size={17} fill="currentColor" />
          Call Now
        </a>

        <a
          href={message}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 text-[12px] font-black text-white shadow-xl"
        >
          <WhatsAppIcon size={19} />
          WhatsApp
        </a>
      </div>
    </details>
  );
}

/* =========================================================
   SEO METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    "Jharsuguda Taxi Service | Jharsuguda to Chhattisgarh Cab | Khatu Rides",
  description:
    "Book a taxi from Jharsuguda to Raigarh, Korba, Bilaspur, Raipur, Durg-Bhilai, Ambikapur and Jagdalpur. One-way, round-trip, airport, railway and outstation cab services.",
  keywords: [
    "Jharsuguda taxi service",
    "Jharsuguda cab service",
    "Jharsuguda outstation cab",
    "Jharsuguda to Raigarh taxi",
    "Jharsuguda to Korba taxi",
    "Jharsuguda to Bilaspur taxi",
    "Jharsuguda to Raipur taxi",
    "Jharsuguda to Durg taxi",
    "Jharsuguda to Bhilai taxi",
    "Jharsuguda to Ambikapur taxi",
    "Jharsuguda to Jagdalpur taxi",
    "Jharsuguda airport taxi",
    "Jharsuguda railway station taxi",
    "Jharsuguda one way taxi",
    "Jharsuguda outstation taxi",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Jharsuguda Taxi Service | Chhattisgarh Cab Booking",
    description:
      "Book one-way, round-trip and outstation taxis from Jharsuguda to major Chhattisgarh hubs and regional destinations.",
    url: PAGE_URL,
    siteName: "Khatu Rides Travels Co.",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Co.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jharsuguda Taxi Service | Khatu Rides",
    description:
      "Jharsuguda to Raigarh, Korba, Bilaspur, Raipur, Durg-Bhilai, Ambikapur and Jagdalpur cab booking.",
    images: [`${SITE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   STRUCTURED DATA
========================================================= */

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${PAGE_URL}#business`,
  name: "Khatu Rides Travels Co.",
  url: SITE_URL,
  telephone: `+91${PHONE}`,
  image: `${SITE_URL}/logo.png`,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Korba",
    addressRegion: "Chhattisgarh",
    addressCountry: "IN",
  },
  areaServed: [
    "Jharsuguda",
    "Raigarh",
    "Korba",
    "Bilaspur",
    "Raipur",
    "Durg",
    "Bhilai",
    "Ambikapur",
    "Jagdalpur",
    "Chhattisgarh",
    "Odisha",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Jharsuguda Taxi and Outstation Cab Service",
  serviceType: "Taxi Service",
  provider: {
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    url: SITE_URL,
    telephone: `+91${PHONE}`,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Jharsuguda",
    },
    {
      "@type": "State",
      name: "Chhattisgarh",
    },
    {
      "@type": "State",
      name: "Odisha",
    },
  ],
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: PAGE_URL,
    servicePhone: {
      "@type": "ContactPoint",
      telephone: `+91${PHONE}`,
    },
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
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
      name: "Cab Services",
      item: `${SITE_URL}/#services`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Jharsuguda Taxi Service",
      item: PAGE_URL,
    },
  ],
};

/* =========================================================
   PAGE
========================================================= */

export default function JharsugudaCabPage() {
  const heroWhatsApp = waLink(
    "Hello Khatu Rides, I need a cab from Jharsuguda to Chhattisgarh. Please share available vehicle options and fare."
  );

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      {/* =====================================================
          JSON-LD
      ===================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <img
              src="/logo.png"
              alt="Khatu Rides Travels Co."
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Home
            </Link>

            <Link
              href="/#popular-routes"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Popular Routes
            </Link>

            <Link
              href="/#services"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Services
            </Link>

            <Link
              href="/#fleet"
              className="text-sm font-bold text-slate-600 transition hover:text-[#063B8F]"
            >
              Fleet
            </Link>

            <Link
              href="/fare-calculator"
              className="rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-black text-slate-950 shadow-sm transition hover:bg-[#f2b900]"
            >
              Fare Calculator
            </Link>
          </nav>

          {/* Desktop CTAs */}

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={`tel:+91${PHONE}`}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#FF1726] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(255,23,38,.22)] transition hover:-translate-y-0.5"
            >
              <Phone size={16} fill="currentColor" />
              Call Now
            </a>

            <a
              href={heroWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(37,211,102,.22)] transition hover:-translate-y-0.5"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Mobile Hindi Line */}

        <div className="border-t border-slate-100 bg-[#071A3A] px-4 py-2.5 text-center sm:hidden">
          <p className="text-[22px] font-black leading-9 text-white">
            झारसुगुड़ा से कहीं के लिए भी टैक्सी बुक करने के लिए कॉल करें{" "}
            <a
              href={`tel:+91${PHONE}`}
              className="text-[#FFC400] underline decoration-[#FFC400]/40 underline-offset-2"
            >
              {PHONE}
            </a>
          </p>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#061735]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#FFC400] blur-[120px]" />
          <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-[#0b65d8] blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#FFC400] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                Odisha ↔ Chhattisgarh Intercity Cab
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Jharsuguda Taxi Service
                <span className="mt-2 block text-[#FFC400]">
                  Chhattisgarh & Major Hubs
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
                Book one-way, round-trip and outstation cabs from Jharsuguda
                to Raigarh, Korba, Bilaspur, Raipur, Durg-Bhilai, Ambikapur and
                Jagdalpur, with connectivity to nearby towns, industrial areas
                and regional destinations.
              </p>

              <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["7+", "Major Hubs"],
                  ["30+", "Regional Areas"],
                  ["24×7", "Booking Enquiry"],
                  ["AC", "Comfortable Cars"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur"
                  >
                    <p className="text-lg font-black text-white">
                      {value}
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:+91${PHONE}`}
                  className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#FF1726] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(255,23,38,.28)] transition hover:-translate-y-0.5"
                >
                  <Phone size={19} fill="currentColor" />
                  Call {PHONE}
                </a>

                <a
                  href={heroWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(37,211,102,.22)] transition hover:-translate-y-0.5"
                >
                  <WhatsAppIcon size={21} />
                  Get Cab on WhatsApp
                </a>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#25D366]" />
                  One Way Available
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#25D366]" />
                  Round Trip
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#25D366]" />
                  Airport & Railway
                </span>
              </div>
            </div>

            {/* Hero Visual */}

            <div className="relative">
              <div className="absolute -inset-5 rounded-[40px] bg-[#FFC400]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-2 shadow-2xl backdrop-blur">
                <div className="relative overflow-hidden rounded-[26px] bg-[#0b234b]">
                  <img
                    src="/hero/01.png"
                    alt="Khatu Rides Jharsuguda taxi service"
                    className="h-[300px] w-full object-cover sm:h-[390px]"
                  />

                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-[#061735]/90 p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FFC400]">
                          Jharsuguda → Chhattisgarh
                        </p>

                        <p className="mt-1 text-lg font-black text-white">
                          Tell us your destination
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-slate-950">
                        <Navigation size={19} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Star size={20} fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-950">
                      Trusted Cab Service
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                      Chhattisgarh & nearby destinations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK INTENT
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-hide sm:px-6 lg:px-8">
          {[
            "One Way Taxi",
            "Outstation Cab",
            "Round Trip Taxi",
            "Airport Transfer",
            "Railway Transfer",
            "Corporate Cab",
            "Industrial Travel",
            "Family Travel",
            "Long Distance Taxi",
          ].map((item) => (
            <a
              key={item}
              href={heroWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-black text-slate-700 transition hover:border-[#FFC400] hover:bg-amber-50"
            >
              {item}
            </a>
          ))}
        </div>
      </section>

      {/* =====================================================
          MAJOR HUBS
      ===================================================== */}

      <section
        className="bg-white py-14 sm:py-18"
        id="major-hubs"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Jharsuguda Outstation Network
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Jharsuguda to{" "}
              <span className="text-[#063B8F]">
                Major Chhattisgarh Hubs
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Travel from Jharsuguda to the major commercial, industrial,
              residential and transport hubs of Chhattisgarh with an
              outstation cab. Our coverage extends beyond major cities to
              important nearby towns, railway connections, industrial areas
              and regional destinations.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {MAJOR_HUBS.map((hub, index) => (
              <article
                key={hub.name}
                className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,.11)]"
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#FFC400]/10 blur-2xl transition group-hover:bg-[#FFC400]/20" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071A3A] text-[#FFC400]">
                        <MapPin
                          size={20}
                          fill="currentColor"
                        />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#063B8F]">
                          {String(index + 1).padStart(2, "0")} · Major Hub
                        </p>

                        <h3 className="mt-1 text-xl font-black text-slate-950">
                          Jharsuguda → {hub.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {hub.region}
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    {hub.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Nearby Sub-Hubs
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {hub.subHubs.map((sub) => (
                        <span
                          key={sub}
                          className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-600"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={waLink(
                      `Hello Khatu Rides, I need a cab from Jharsuguda to ${hub.name}. Please share available vehicles and fare.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#071A3A] text-xs font-black text-white transition hover:bg-[#063B8F]"
                  >
                    Enquire for {hub.name}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SUB HUB NETWORK
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Regional Coverage
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Major Cities Ke Saath{" "}
                <span className="text-[#063B8F]">
                  Sub-Hubs & Regional Areas
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                Your final destination may be a smaller town, industrial
                location, railway junction, township or regional area rather
                than a major city. Share your exact destination with the
                booking team for route and vehicle availability.
              </p>

              <div className="mt-6 rounded-2xl border border-[#FFC400]/40 bg-amber-50 p-5">
                <p className="text-xs font-black text-slate-950">
                  Destination not listed?
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                  Send your pickup location, destination, travel date and
                  passenger count on WhatsApp.
                </p>

                <a
                  href={heroWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[10px] font-black text-white"
                >
                  <WhatsAppIcon size={16} />
                  Ask on WhatsApp
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SECONDARY_HUBS.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#071A3A] text-[#FFC400]">
                      <Route size={16} />
                    </div>

                    <h3 className="text-sm font-black text-slate-950">
                      {item.name}
                    </h3>
                  </div>

                  <p className="mt-3 text-xs font-medium leading-5 text-slate-500">
                    {item.places}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AIRPORT + RAILWAY
      ===================================================== */}

      <section className="bg-[#071A3A] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Airport */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#FFC400]/10 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-slate-950">
                  <Plane size={22} />
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                  Airport Connectivity
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Jharsuguda & Raipur Airport Transfers
                </h2>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-300">
                  Plan airport pickup and drop services around your flight
                  schedule. Share the airport, pickup location and flight
                  timing so the cab requirement can be planned in advance.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    "Jharsuguda Airport",
                    "Raipur Airport",
                    "Airport Pickup",
                    "Airport Drop",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-[10px] font-bold text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={waLink(
                    "Hello Khatu Rides, I need an airport cab from Jharsuguda. Please help me plan the pickup/drop."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#FFC400] px-5 text-xs font-black text-slate-950"
                >
                  Plan Airport Cab
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Railway */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#0b65d8]/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063B8F] text-white">
                  <TrainFront size={22} />
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#66a7ff]">
                  Railway Connectivity
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Railway Station Pickup & Drop
                </h2>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-300">
                  Arrange station pickup and drop from Jharsuguda Railway
                  Station or enquire about long-distance travel to major
                  railway hubs across Chhattisgarh.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    "Jharsuguda Railway",
                    "Raigarh Railway",
                    "Korba Railway",
                    "Bilaspur Junction",
                    "Champa Junction",
                    "Raipur Railway",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-[10px] font-bold text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={waLink(
                    "Hello Khatu Rides, I need a railway station transfer from Jharsuguda. Please help me plan the cab."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-black text-white"
                >
                  Book Station Transfer
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        className="bg-white py-14 sm:py-18"
        id="services"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Taxi Services
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Complete Taxi Services{" "}
              <span className="text-[#063B8F]">
                from Jharsuguda
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              From short intercity transfers to long-distance outstation
              journeys, choose a cab service based on your destination,
              passengers, luggage and travel requirements.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.05)] transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    {service.description}
                  </p>

                  <a
                    href={heroWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#063B8F]"
                  >
                    Enquire Now
                    <ChevronRight size={13} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          INDUSTRIAL / CORPORATE
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] bg-[#061735]">
            <div className="grid lg:grid-cols-[1fr_.85fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FFC400]">
                  Business & Industrial Travel
                </span>

                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                  Corporate & Industrial Cab Travel Across the
                  Jharsuguda–Chhattisgarh Corridor
                </h2>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300">
                  Business and industrial travellers often require
                  transportation between Jharsuguda, Raigarh, Korba,
                  Bilaspur, Raipur and other industrial regions. Cab
                  requirements can include plant visits, employee travel,
                  contractor movement, vendor visits, client meetings and
                  executive transportation.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Plant & industrial visits",
                    "Employee transportation",
                    "Vendor & contractor travel",
                    "Client meetings",
                    "Railway & airport transfers",
                    "Multi-day business travel",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs font-bold text-slate-200"
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-[#25D366]"
                      />
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={waLink(
                    "Hello Khatu Rides, I need corporate or industrial cab service from Jharsuguda. Please discuss my travel requirement."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-[#FFC400] px-5 text-xs font-black text-slate-950"
                >
                  Discuss Corporate Travel
                  <ArrowRight size={15} />
                </a>
              </div>

              <div className="relative min-h-[280px] overflow-hidden bg-[#0a2754]">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute right-[-15%] top-[-15%] h-80 w-80 rounded-full border-[60px] border-[#FFC400]" />
                  <div className="absolute bottom-[-25%] left-[-10%] h-80 w-80 rounded-full border-[45px] border-[#0b65d8]" />
                </div>

                <div className="relative flex h-full flex-col justify-center p-8">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      [Factory, "Industrial"],
                      [Building2, "Corporate"],
                      [Users, "Employee"],
                      [Navigation, "Intercity"],
                    ].map(([Icon, label]) => {
                      const ItemIcon = Icon as typeof Factory;

                      return (
                        <div
                          key={label as string}
                          className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                        >
                          <ItemIcon
                            size={21}
                            className="text-[#FFC400]"
                          />

                          <p className="mt-3 text-xs font-black text-white">
                            {label as string}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCAL COVERAGE
      ===================================================== */}

      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Local Pickup Coverage
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Jharsuguda Local{" "}
                <span className="text-[#063B8F]">
                  Pickup Areas
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                Pickup service can be discussed for locations across
                Jharsuguda and nearby areas. Share the exact locality,
                landmark, railway station, airport or industrial location
                when making your booking enquiry.
              </p>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071A3A] text-[#FFC400]">
                  <MapPin
                    size={18}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-950">
                    Exact Pickup Location
                  </p>

                  <p className="mt-1 text-[10px] font-medium text-slate-500">
                    Share your landmark or exact pickup point.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {LOCAL_AREAS.map((area) => (
                <div
                  key={area}
                  className="flex min-h-[74px] items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-[#063B8F]"
                    />

                    <span className="text-xs font-bold leading-5 text-slate-700">
                      {area}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FLEET
      ===================================================== */}

      <section
        className="bg-[#f5f7fb] py-14 sm:py-18"
        id="fleet"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Comfortable Fleet
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Choose the Right Cab for{" "}
                <span className="text-[#063B8F]">
                  Your Journey
                </span>
              </h2>
            </div>

            <a
              href={heroWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#071A3A] px-5 text-xs font-black text-white"
            >
              Check Availability
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {VEHICLES.map((vehicle) => (
              <article
                key={vehicle.name}
                className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,.06)]"
              >
                <div className="relative h-[220px] overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.name} cab from Jharsuguda`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow">
                    {vehicle.type}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-black text-slate-950">
                    {vehicle.name}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {vehicle.details.map((detail) => (
                      <div
                        key={detail}
                        className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-600"
                      >
                        {detail}
                      </div>
                    ))}
                  </div>

                  <a
                    href={waLink(
                      `Hello Khatu Rides, I need a ${vehicle.name} from Jharsuguda. Please share availability and fare.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-xs font-black text-white"
                  >
                    <WhatsAppIcon size={17} />
                    Enquire This Car
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Why Khatu Rides
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Built for Long-Distance{" "}
              <span className="text-[#063B8F]">
                Intercity Travel
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              A straightforward booking experience for passengers travelling
              between Jharsuguda, Odisha and major destinations across
              Chhattisgarh.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Direct Booking",
                text: "Connect directly through phone or WhatsApp for your cab requirement.",
              },
              {
                icon: WalletCards,
                title: "Fare Discussion",
                text: "Discuss the destination, vehicle and trip requirement before booking.",
              },
              {
                icon: Clock3,
                title: "Planned Pickup",
                text: "Useful for airport, railway and long-distance journeys requiring advance planning.",
              },
              {
                icon: Zap,
                title: "Wide Coverage",
                text: "Major cities plus regional towns, industrial areas and sub-hubs.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-base font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Customer Experience
              </span>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Real Travellers. Real Journeys.
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex text-[#FFC400]">
                <Star size={17} fill="currentColor" />
                <Star size={17} fill="currentColor" />
                <Star size={17} fill="currentColor" />
                <Star size={17} fill="currentColor" />
                <Star size={17} fill="currentColor" />
              </div>

              <span className="text-xs font-black text-slate-700">
                Google Reviews
              </span>
            </div>
          </div>

          <ReviewsCarousel />
        </div>
      </section>

      {/* =====================================================
          DEEP SEO CONTENT
      ===================================================== */}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Jharsuguda Taxi Guide
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Jharsuguda Taxi Service for Chhattisgarh Travel
            </h2>

            <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
              Jharsuguda is an important transportation and industrial centre
              in western Odisha, with travel requirements toward neighbouring
              regions of Chhattisgarh. Passengers may need long-distance
              transportation for business travel, industrial visits, family
              functions, railway connections, airport transfers, medical
              appointments and personal work.
            </p>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              Khatu Rides Travels provides cab booking assistance from
              Jharsuguda toward major Chhattisgarh hubs including Raigarh,
              Korba, Bilaspur, Raipur, Durg-Bhilai, Ambikapur and Jagdalpur.
              Depending on the final destination, passengers can also enquire
              about nearby towns, industrial locations, railway stations,
              townships and regional sub-hubs.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Raigarh Taxi
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              A Jharsuguda to Raigarh taxi can be useful for industrial travel,
              business meetings, railway transfers, family journeys and onward
              travel across northern Chhattisgarh. Travellers continuing beyond
              Raigarh can also enquire about destinations such as Kharsia,
              Gharghoda, Tamnar, Dharamjaigarh and Sarangarh.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Korba Taxi
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Jharsuguda to Korba is an important long-distance travel corridor
              connecting western Odisha with the industrial and power region
              of Chhattisgarh. Cab enquiries can also be made for nearby
              destinations including Katghora, Dipka, Gevra, Kusmunda, Balco,
              Darri and Jamnipali.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Bilaspur Taxi
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Bilaspur is an important transport and commercial hub of central
              Chhattisgarh. A Jharsuguda to Bilaspur cab can be used for
              business travel, railway journeys, medical visits, family
              travel and personal requirements. Nearby destinations such as
              Champa, Janjgir, Sakti, Mungeli, Ratanpur and Pendra Road can
              also be discussed with the booking team.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Raipur Taxi & Airport Transfer
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Raipur is the capital of Chhattisgarh and an important commercial
              and transportation hub. A Jharsuguda to Raipur taxi can be useful
              for business meetings, airport transfers, railway journeys,
              government work, shopping, family travel and onward
              transportation across central Chhattisgarh.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Durg & Bhilai Taxi
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Durg and Bhilai are important industrial and residential centres
              of Chhattisgarh. Long-distance cab services from Jharsuguda can
              be useful for industrial visits, business meetings, railway
              transfers, family functions, employee travel and personal
              journeys.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Ambikapur Taxi
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Ambikapur is a major hub for the Surguja region of northern
              Chhattisgarh. Travellers can enquire about long-distance cab
              service from Jharsuguda to Ambikapur and nearby destinations such
              as Surajpur, Bishrampur, Lakhanpur, Sitapur, Baikunthpur and
              Manendragarh.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda to Jagdalpur Taxi
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Jagdalpur is the primary gateway to the Bastar region. A
              Jharsuguda to Jagdalpur taxi can be useful for long-distance
              tourism, business travel and family journeys. Travellers can
              also enquire about onward destinations including Kanker,
              Kondagaon, Dantewada, Kirandul, Bacheli and other Bastar areas.
            </p>

            <h3 className="mt-10 text-2xl font-black text-slate-950">
              Jharsuguda Taxi for Industrial & Corporate Travel
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              The Jharsuguda–Raigarh–Korba corridor includes important
              industrial and business destinations. Companies, employees,
              contractors, vendors and visiting professionals may require
              point-to-point transportation between plants, offices, railway
              stations, airports, hotels and residential locations. Cab
              requirements can be discussed according to the number of
              passengers, luggage and travel duration.
            </p>

            <div className="mt-10 rounded-[24px] border border-[#FFC400]/40 bg-amber-50 p-6">
              <h3 className="text-lg font-black text-slate-950">
                Need a Destination Not Listed Here?
              </h3>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                Send your exact pickup location and destination for a town,
                village, industrial site, railway station, airport, hotel or
                other regional location.
              </p>

              <a
                href={heroWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-black text-white"
              >
                <WhatsAppIcon size={17} />
                Send Your Route
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section
        className="bg-[#f5f7fb] py-14 sm:py-18"
        id="faq"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
              Booking Questions
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Jharsuguda Taxi FAQs
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-950">
                  {faq.q}

                  <ChevronRight
                    size={17}
                    className="shrink-0 transition group-open:rotate-90"
                  />
                </summary>

                <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium leading-6 text-slate-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#061735] py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-7 text-center backdrop-blur sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFC400] text-slate-950">
              <Car size={25} />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
              Where Do You Want to Travel from Jharsuguda?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-300">
              Raigarh, Korba, Bilaspur, Raipur, Durg-Bhilai, Ambikapur,
              Jagdalpur or a smaller regional destination — share your route
              and get assistance with your cab requirement.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:+91${PHONE}`}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF1726] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(255,23,38,.25)]"
              >
                <Phone size={19} fill="currentColor" />
                Call {PHONE_DISPLAY}
              </a>

              <a
                href={heroWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(37,211,102,.22)]"
              >
                <WhatsAppIcon size={20} />
                WhatsApp Booking
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] font-bold text-slate-400">
              <span>✓ One Way Taxi</span>
              <span>✓ Round Trip</span>
              <span>✓ Airport Cab</span>
              <span>✓ Railway Transfer</span>
              <span>✓ Outstation Travel</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

      {/* =====================================================
          MOBILE FLOATING CALL / WHATSAPP
      ===================================================== */}

      <FloatingActions />
    </main>
  );
}