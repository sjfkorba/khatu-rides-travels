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
const PAGE_URL = `${SITE_URL}/cabs/raipur`;

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

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
   MAJOR CHHATTISGARH HUBS FROM RAIPUR
========================================================= */

const MAJOR_HUBS = [
  {
    name: "Bilaspur",
    region: "North Chhattisgarh",
    description:
      "Raipur to Bilaspur taxi service for business travel, railway connectivity, medical visits, family journeys and onward travel toward northern Chhattisgarh.",
    subHubs: [
      "Bilaspur City",
      "Bilaspur Junction",
      "Ratanpur",
      "Mungeli",
      "Pendra Road",
      "Gaurela",
      "Janjgir",
    ],
  },
  {
    name: "Korba",
    region: "Power & Industrial Hub",
    description:
      "Long-distance cab connectivity from Raipur toward Korba and its major industrial, mining, township and regional areas.",
    subHubs: [
      "Katghora",
      "Dipka",
      "Gevra",
      "Kusmunda",
      "Balco",
      "Darri",
      "Jamnipali",
    ],
  },
  {
    name: "Raigarh",
    region: "Industrial & Eastern Gateway",
    description:
      "Raipur to Raigarh cab service for industrial travel, business visits, family journeys and connectivity toward eastern Chhattisgarh and Odisha.",
    subHubs: [
      "Kharsia",
      "Tamnar",
      "Gharghoda",
      "Sarangarh",
      "Pussore",
      "Dharamjaigarh",
      "Lailunga",
    ],
  },
  {
    name: "Ambikapur",
    region: "Surguja Region",
    description:
      "Outstation taxi from Raipur toward Ambikapur and northern Chhattisgarh for business, family, medical, educational and personal travel.",
    subHubs: [
      "Surajpur",
      "Bishrampur",
      "Lakhanpur",
      "Sitapur",
      "Lundra",
      "Baikunthpur",
      "Manendragarh",
    ],
  },
  {
    name: "Jagdalpur",
    region: "Bastar Gateway",
    description:
      "Raipur to Jagdalpur taxi service for Bastar tourism, business travel, family journeys and onward connectivity toward southern Chhattisgarh.",
    subHubs: [
      "Kanker",
      "Kondagaon",
      "Dantewada",
      "Bacheli",
      "Kirandul",
      "Narayanpur",
      "Bastar",
    ],
  },
  {
    name: "Durg & Bhilai",
    region: "Central Industrial Corridor",
    description:
      "Convenient intercity cab connectivity between Raipur, Durg and Bhilai for corporate, industrial, railway and family travel.",
    subHubs: [
      "Durg",
      "Bhilai",
      "Bhilai Nagar",
      "Risali",
      "Kumhari",
      "Charoda",
      "Bhilai Steel Plant",
    ],
  },
  {
    name: "Rajnandgaon",
    region: "Western Chhattisgarh",
    description:
      "Raipur to Rajnandgaon taxi service for business, family, railway and regional travel toward western Chhattisgarh.",
    subHubs: [
      "Rajnandgaon City",
      "Dongargarh",
      "Dongargaon",
      "Chhuikhadan",
      "Khairagarh",
      "Gandai",
      "Mohla",
    ],
  },
  {
    name: "Dhamtari",
    region: "South-Central Chhattisgarh",
    description:
      "Short and medium-distance cab connectivity from Raipur toward Dhamtari and nearby southern regional destinations.",
    subHubs: [
      "Dhamtari",
      "Kurud",
      "Magarlod",
      "Nagri",
      "Rudri",
      "Sihawa",
      "Gangrel",
    ],
  },
  {
    name: "Mahasamund",
    region: "Eastern Gateway",
    description:
      "Raipur to Mahasamund taxi connectivity for regional travel, business requirements, family journeys and onward Odisha-side routes.",
    subHubs: [
      "Mahasamund",
      "Bagbahara",
      "Pithora",
      "Saraipali",
      "Basna",
      "Komakhan",
      "Tumgaon",
    ],
  },
];

/* =========================================================
   RAIPUR SUB-HUB & LOCAL COVERAGE
========================================================= */

const SUB_HUBS = [
  {
    name: "Raipur City",
    places:
      "Raipur Railway Station • Telibandha • Shankar Nagar • Pandri • Tatibandh • Devendra Nagar • Kota",
  },
  {
    name: "Airport & New Raipur",
    places:
      "Swami Vivekananda Airport • Naya Raipur • Atal Nagar • Nava Raipur Business District • Sector Areas",
  },
  {
    name: "Industrial Corridor",
    places:
      "Urla • Siltara • Birgaon • Tilda • Mandir Hasaud • Kumhari • Bhilai-side industrial belt",
  },
  {
    name: "Baloda Bazar Region",
    places:
      "Baloda Bazar • Bhatapara • Simga • Kasdol • Palari • Bilaigarh-side connectivity",
  },
  {
    name: "Durg-Bhilai Region",
    places:
      "Durg • Bhilai • Risali • Charoda • Kumhari • Supela • Bhilai Nagar",
  },
  {
    name: "Dhamtari Region",
    places:
      "Dhamtari • Kurud • Rudri • Gangrel • Nagri • Sihawa • Magarlod",
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
      "Book a point-to-point cab from Raipur to cities, towns, airports, railway stations, industrial areas and regional destinations.",
  },
  {
    icon: Car,
    title: "Round Trip Cab",
    description:
      "Comfortable return taxi service for business visits, family journeys, medical appointments, functions and multi-day travel.",
  },
  {
    icon: Plane,
    title: "Raipur Airport Taxi",
    description:
      "Airport pickup and drop service planned around your flight schedule, pickup location and passenger requirements.",
  },
  {
    icon: TrainFront,
    title: "Railway Station Transfer",
    description:
      "Cab transfers from Raipur Railway Station and connectivity to major railway stations across Chhattisgarh.",
  },
  {
    icon: Factory,
    title: "Industrial Cab Service",
    description:
      "Transportation for industrial visits, plant locations, employees, contractors, vendors and business travellers.",
  },
  {
    icon: Building2,
    title: "Corporate Travel",
    description:
      "Professional cab arrangements for meetings, client visits, executive travel, employee movement and business trips.",
  },
];

/* =========================================================
   TRAVEL INTENTS
========================================================= */

const TRAVEL_INTENTS = [
  "Raipur Taxi",
  "One Way Cab",
  "Outstation Taxi",
  "Airport Cab",
  "Railway Transfer",
  "Round Trip",
  "Corporate Cab",
  "Industrial Travel",
  "Family Travel",
  "Long Distance Taxi",
  "Tourist Cab",
];

/* =========================================================
   LOCAL AREAS
========================================================= */

const LOCAL_AREAS = [
  "Raipur City",
  "Pandri",
  "Telibandha",
  "Shankar Nagar",
  "Devendra Nagar",
  "Tatibandh",
  "Kota",
  "Mowa",
  "Saddu",
  "Avanti Vihar",
  "Vip Road",
  "Mana",
  "Mandir Hasaud",
  "Naya Raipur",
  "Atal Nagar",
  "Urla",
  "Siltara",
  "Birgaon",
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
      "Business & Family Travel",
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
      "Family & Group Travel",
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
      "Long Distance Travel",
    ],
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    q: "Can I book a taxi from Raipur to other cities in Chhattisgarh?",
    a: "Yes. You can enquire about one-way, round-trip and outstation taxi services from Raipur to major destinations including Bilaspur, Korba, Raigarh, Ambikapur, Jagdalpur, Durg, Bhilai, Rajnandgaon, Dhamtari and Mahasamund.",
  },
  {
    q: "Do you provide Raipur to Bilaspur taxi service?",
    a: "Yes. A Raipur to Bilaspur cab can be requested for business travel, family journeys, railway connectivity, medical visits and other personal travel requirements.",
  },
  {
    q: "Can I book a Raipur to Korba cab?",
    a: "Yes. Taxi enquiries can be made for Raipur to Korba and nearby destinations including Katghora, Dipka, Gevra, Kusmunda, Balco and Darri.",
  },
  {
    q: "Do you provide Raipur to Raigarh taxi service?",
    a: "Yes. You can enquire about one-way or round-trip cab service from Raipur to Raigarh for industrial travel, business trips, family journeys and regional connectivity.",
  },
  {
    q: "Can I book a Raipur to Ambikapur taxi?",
    a: "Yes. Long-distance cab enquiries are available for Raipur to Ambikapur and nearby Surguja destinations such as Surajpur, Bishrampur, Lakhanpur and Sitapur.",
  },
  {
    q: "Can I book a Raipur to Jagdalpur cab?",
    a: "Yes. Raipur to Jagdalpur is an important Bastar travel corridor. You can also enquire about onward travel toward Kanker, Kondagaon, Dantewada, Bacheli and Kirandul.",
  },
  {
    q: "Do you provide Raipur Airport taxi service?",
    a: "Yes. Airport pickup and drop requirements can be planned according to your flight timing. Share your pickup point, flight details and passenger count when enquiring.",
  },
  {
    q: "Can I get a taxi to Raipur Railway Station?",
    a: "Yes. Pickup and drop requirements for Raipur Railway Station can be discussed, along with transfers to other railway stations across Chhattisgarh.",
  },
  {
    q: "Do you provide corporate and industrial cab services in Raipur?",
    a: "Yes. Corporate and industrial travel requirements can be discussed for meetings, plant visits, employee transportation, vendor travel, client visits and other business journeys.",
  },
  {
    q: "Can I book a taxi from a smaller town or village near Raipur?",
    a: "Yes. Share your exact pickup and destination. Cab enquiries can be made for smaller towns, villages, industrial locations, railway stations, hotels and regional destinations.",
  },
];

/* =========================================================
   MOBILE FLOATING ACTIONS
========================================================= */

function FloatingActions() {
  const message = waLink(
    "Hello Khatu Rides, I want to book a cab from Raipur. Please share available vehicle options and fare."
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
          <Phone
            size={17}
            fill="currentColor"
          />
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
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    "Raipur Taxi Service | Raipur Cab Booking | Chhattisgarh Outstation Taxi",
  description:
    "Book a taxi from Raipur to Bilaspur, Korba, Raigarh, Ambikapur, Jagdalpur, Durg-Bhilai, Rajnandgaon and major Chhattisgarh hubs. One-way, round-trip, airport, railway and outstation cabs.",
  keywords: [
    "Raipur taxi service",
    "Raipur cab service",
    "Raipur taxi booking",
    "Raipur outstation taxi",
    "Raipur one way cab",
    "Raipur to Bilaspur taxi",
    "Raipur to Korba taxi",
    "Raipur to Raigarh taxi",
    "Raipur to Ambikapur taxi",
    "Raipur to Jagdalpur taxi",
    "Raipur to Durg taxi",
    "Raipur to Bhilai taxi",
    "Raipur to Rajnandgaon taxi",
    "Raipur to Dhamtari taxi",
    "Raipur to Mahasamund taxi",
    "Raipur airport taxi",
    "Raipur railway station taxi",
    "Raipur airport cab",
    "Raipur outstation cab",
    "Chhattisgarh taxi service",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:
      "Raipur Taxi Service | Chhattisgarh Outstation Cab Booking",
    description:
      "Book one-way, round-trip, airport, railway and outstation taxis from Raipur to major Chhattisgarh hubs and regional destinations.",
    url: PAGE_URL,
    siteName: "Khatu Rides Travels Co.",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Co. Raipur Taxi Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Raipur Taxi Service | Khatu Rides Travels",
    description:
      "Raipur to Bilaspur, Korba, Raigarh, Ambikapur, Jagdalpur and major Chhattisgarh destinations.",
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
    addressLocality: "Raipur",
    addressRegion: "Chhattisgarh",
    addressCountry: "IN",
  },
  areaServed: [
    "Raipur",
    "Naya Raipur",
    "Bilaspur",
    "Korba",
    "Raigarh",
    "Ambikapur",
    "Jagdalpur",
    "Durg",
    "Bhilai",
    "Rajnandgaon",
    "Dhamtari",
    "Mahasamund",
    "Baloda Bazar",
    "Chhattisgarh",
    "Odisha",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Raipur Taxi and Outstation Cab Service",
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
      name: "Raipur",
    },
    {
      "@type": "State",
      name: "Chhattisgarh",
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
      name: "Raipur Taxi Service",
      item: PAGE_URL,
    },
  ],
};

/* =========================================================
   PAGE
========================================================= */

export default function RaipurCabPage() {
  const heroWhatsApp = waLink(
    "Hello Khatu Rides, I need a cab from Raipur to a Chhattisgarh destination. Please share available vehicle options and fare."
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

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={`tel:+91${PHONE}`}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#FF1726] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(255,23,38,.22)] transition hover:-translate-y-0.5"
            >
              <Phone
                size={16}
                fill="currentColor"
              />
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

        {/* MOBILE TOP LINE */}

        <div className="border-t border-slate-100 bg-[#071A3A] px-4 py-2.5 text-center sm:hidden">
          <p className="text-[22px] font-black leading-9 text-white">
            रायपुर से कहीं के लिए भी टैक्सी बुक करने के लिए कॉल करें{" "}
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
                Raipur City & Chhattisgarh Outstation Cab
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Raipur Taxi Service
                <span className="mt-2 block text-[#FFC400]">
                  Connect to Every Major Chhattisgarh Hub
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
                Book one-way, round-trip and outstation cabs from Raipur to
                Bilaspur, Korba, Raigarh, Ambikapur, Jagdalpur, Durg-Bhilai,
                Rajnandgaon, Dhamtari, Mahasamund and nearby regional
                destinations.
              </p>

              <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["9+", "Major Hubs"],
                  ["50+", "Regional Areas"],
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
                  <Phone
                    size={19}
                    fill="currentColor"
                  />
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
                  <CheckCircle2
                    size={14}
                    className="text-[#25D366]"
                  />
                  One Way
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#25D366]"
                  />
                  Round Trip
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#25D366]"
                  />
                  Airport & Railway
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[40px] bg-[#FFC400]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-2 shadow-2xl backdrop-blur">
                <div className="relative overflow-hidden rounded-[26px] bg-[#0b234b]">
                  <img
                    src="/hero/01.png"
                    alt="Khatu Rides Raipur taxi service"
                    className="h-[300px] w-full object-cover sm:h-[390px]"
                  />

                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-[#061735]/90 p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FFC400]">
                          Raipur → Chhattisgarh
                        </p>

                        <p className="mt-1 text-lg font-black text-white">
                          Tell us your destination
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-slate-950">
                        <Navigation
                          size={19}
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Star
                      size={20}
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-950">
                      Chhattisgarh Route Coverage
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                      City, airport & outstation travel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTENT BAR
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-hide sm:px-6 lg:px-8">
          {TRAVEL_INTENTS.map((item) => (
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
              Raipur Outstation Network
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Raipur to{" "}
              <span className="text-[#063B8F]">
                Major Chhattisgarh Hubs
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Raipur is one of the most important transportation and business
              centres in Chhattisgarh. From the capital city, travellers move
              toward northern, southern, eastern and western parts of the
              state for business, family travel, industrial visits, railway
              connections, airport transfers and personal journeys.
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
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071A3A] text-[#FFC400]">
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
                        Raipur → {hub.name}
                      </h3>
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
                      `Hello Khatu Rides, I need a cab from Raipur to ${hub.name}. Please share available vehicles and fare.`
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
          SUB HUBS
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Regional Connectivity
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Beyond Major Cities:{" "}
                <span className="text-[#063B8F]">
                  Raipur Sub-Hub Coverage
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                Many taxi journeys do not end at a district headquarters.
                Travellers may need pickup or drop at a township, industrial
                area, railway station, business location, hotel, village or
                nearby town. Share the exact destination and the booking team
                can discuss the cab requirement.
              </p>

              <div className="mt-6 rounded-2xl border border-[#FFC400]/40 bg-amber-50 p-5">
                <p className="text-xs font-black text-slate-950">
                  Your destination is not listed?
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                  Send your exact pickup and destination on WhatsApp.
                </p>

                <a
                  href={heroWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[10px] font-black text-white"
                >
                  <WhatsAppIcon size={16} />
                  Send Route
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SUB_HUBS.map((item) => (
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
            {/* AIRPORT */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#FFC400]/10 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-slate-950">
                  <Plane size={22} />
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                  Airport Cab Service
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Raipur Airport Pickup & Drop
                </h2>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-300">
                  Swami Vivekananda Airport is a major gateway for travellers
                  entering and leaving Chhattisgarh. Book a cab for airport
                  pickup, airport drop or onward travel from Raipur Airport.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    "Airport Pickup",
                    "Airport Drop",
                    "Flight-Based Planning",
                    "Long Distance Transfer",
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
                    "Hello Khatu Rides, I need a Raipur Airport cab. Please help me plan the airport pickup/drop."
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

            {/* RAILWAY */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#0b65d8]/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063B8F] text-white">
                  <TrainFront size={22} />
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#66a7ff]">
                  Railway Transfer
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Raipur Railway Station Cab
                </h2>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-300">
                  Arrange pickup and drop from Raipur Railway Station or plan
                  transfers to major railway hubs such as Bilaspur, Durg,
                  Bhilai, Korba and Jharsuguda.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    "Raipur Railway",
                    "Bilaspur Junction",
                    "Durg Railway",
                    "Bhilai Nagar",
                    "Korba Railway",
                    "Jharsuguda Railway",
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
                    "Hello Khatu Rides, I need a railway station cab from Raipur. Please help me plan the transfer."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-black text-white"
                >
                  Plan Station Transfer
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
              Complete Cab Services{" "}
              <span className="text-[#063B8F]">
                from Raipur
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              Choose the service according to your destination, passenger
              count, luggage, travel schedule and trip type.
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
          CORPORATE / INDUSTRIAL
      ===================================================== */}

      <section className="bg-[#f5f7fb] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] bg-[#061735]">
            <div className="grid lg:grid-cols-[1fr_.85fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FFC400]">
                  Corporate & Industrial Travel
                </span>

                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                  Corporate & Industrial Cab Service in Raipur
                </h2>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300">
                  Raipur connects several industrial, commercial and
                  administrative areas of Chhattisgarh. Businesses may need
                  reliable transportation between offices, plants, hotels,
                  airports, railway stations and neighbouring cities.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Plant & industrial visits",
                    "Employee transportation",
                    "Vendor & contractor travel",
                    "Client meetings",
                    "Airport & railway transfers",
                    "Multi-day business trips",
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
                    "Hello Khatu Rides, I need corporate or industrial cab service from Raipur. Please discuss my travel requirement."
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
          LOCAL RAIPUR COVERAGE
      ===================================================== */}

      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
                Local Pickup Coverage
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Raipur Local{" "}
                <span className="text-[#063B8F]">
                  Pickup Areas
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                Pickup can be discussed across Raipur city, Naya Raipur,
                airport-side areas, railway areas and major industrial
                locations. Share your exact landmark or pickup point when
                enquiring.
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
                    Share your landmark, hotel, office or locality.
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
                Cars for{" "}
                <span className="text-[#063B8F]">
                  Every Journey
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
                    alt={`${vehicle.name} cab from Raipur`}
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
                      `Hello Khatu Rides, I need a ${vehicle.name} from Raipur. Please share availability and fare.`
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
              Designed for{" "}
              <span className="text-[#063B8F]">
                Chhattisgarh Travel
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              From short regional journeys to long-distance intercity trips,
              the booking process is designed around the actual route and
              travel requirement.
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
                text: "Discuss destination, vehicle and trip requirements before confirming.",
              },
              {
                icon: Clock3,
                title: "Planned Travel",
                text: "Useful for airport, railway, corporate and long-distance journeys.",
              },
              {
                icon: Zap,
                title: "Wide Network",
                text: "Major cities, regional towns, industrial belts and sub-hubs.",
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
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
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
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#063B8F]">
            Raipur Taxi Guide
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
            Raipur Taxi Service for Chhattisgarh Travel
          </h2>

          <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
            Raipur is the capital and one of the most important transportation,
            commercial and administrative centres of Chhattisgarh. The city
            serves as a major starting point for travellers heading toward
            northern, southern, eastern and western parts of the state.
          </p>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            A taxi from Raipur can be useful for airport transfers, railway
            station travel, corporate meetings, industrial visits, family
            journeys, medical travel, tourism and long-distance intercity
            transportation. Khatu Rides provides cab booking assistance for
            these requirements based on the passenger's actual pickup,
            destination and vehicle requirement.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur to Bilaspur Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            A Raipur to Bilaspur taxi is useful for business travel, railway
            connectivity, medical appointments, family journeys and personal
            work. Bilaspur also provides connectivity toward Ratanpur, Mungeli,
            Pendra Road, Gaurela and Janjgir.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur to Korba Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Korba is one of the major power and industrial centres of
            Chhattisgarh. A Raipur to Korba cab can be useful for industrial
            visits, employee travel, business trips and family journeys.
            Nearby areas include Katghora, Dipka, Gevra, Kusmunda, Balco,
            Darri and Jamnipali.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur to Raigarh Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Raigarh is an important industrial and eastern Chhattisgarh hub.
            A Raipur to Raigarh taxi can be booked for business travel,
            industrial visits, family journeys and regional transportation.
            Travellers may also require onward connectivity toward Kharsia,
            Tamnar, Gharghoda, Sarangarh and Dharamjaigarh.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur to Ambikapur Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Ambikapur is an important northern Chhattisgarh hub. Long-distance
            cab travel from Raipur to Ambikapur can be useful for business,
            education, medical requirements, family journeys and regional
            travel. Nearby Surguja destinations include Surajpur, Bishrampur,
            Lakhanpur, Sitapur and Baikunthpur.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur to Jagdalpur Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Jagdalpur is the principal gateway to the Bastar region. A Raipur
            to Jagdalpur taxi can be useful for tourism, business travel,
            family journeys and long-distance transportation. Travellers can
            also enquire about onward destinations including Kanker, Kondagaon,
            Dantewada, Bacheli and Kirandul.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur to Durg & Bhilai Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Durg and Bhilai form an important industrial and residential
            corridor near Raipur. Taxi travel between Raipur, Durg and Bhilai
            can be useful for business meetings, industrial work, employee
            movement, railway transfers and family travel.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur Airport Cab Service
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Travellers arriving at or departing from Swami Vivekananda Airport
            can enquire about airport pickup and drop services. For airport
            travel, share your pickup location, flight timing and passenger
            count so the trip can be planned according to the journey.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur Railway Station Taxi
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Raipur Railway Station is a major railway gateway for the region.
            Taxi services can be requested for station pickup and drop, hotel
            transfers, business travel and onward journeys toward other
            Chhattisgarh cities.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur Corporate & Industrial Cab Service
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Businesses operating in and around Raipur may require transportation
            for employees, vendors, contractors, clients and plant visitors.
            Industrial areas such as Urla and Siltara and surrounding business
            corridors can generate regular transportation requirements between
            offices, plants, hotels, airports and railway stations.
          </p>

          <h3 className="mt-10 text-2xl font-black text-slate-950">
            Raipur Taxi for Regional Chhattisgarh Travel
          </h3>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Not every journey from Raipur is between two major cities.
            Travellers may need a cab to smaller towns, villages, industrial
            locations, railway stations, hotels, tourist destinations or
            regional areas. Providing the exact pickup and destination helps
            the booking team understand the actual route and vehicle
            requirement.
          </p>

          <div className="mt-10 rounded-[24px] border border-[#FFC400]/40 bg-amber-50 p-6">
            <h3 className="text-lg font-black text-slate-950">
              Need a Route Not Listed Above?
            </h3>

            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
              Send your pickup point and destination. We can discuss the
              suitable cab option for your journey.
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
              Raipur Taxi FAQs
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-600">
              Common questions about taxi booking from Raipur to major cities,
              airports, railway stations and regional destinations.
            </p>
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
              Where Do You Want to Travel from Raipur?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-300">
              Bilaspur, Korba, Raigarh, Ambikapur, Jagdalpur, Durg-Bhilai,
              Rajnandgaon, Dhamtari, Mahasamund or a smaller regional
              destination — share your route and get assistance with your cab
              requirement.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:+91${PHONE}`}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF1726] px-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(255,23,38,.25)]"
              >
                <Phone
                  size={19}
                  fill="currentColor"
                />
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
              <span>✓ Corporate Cab</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

      {/* =====================================================
          MOBILE FLOATING CALL + WHATSAPP
      ===================================================== */}

      <FloatingActions />
    </main>
  );
}