import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Plane,
  ShieldCheck,
  Star,
  TrainFront,
  Users,
} from "lucide-react";

import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";
import TrackedCallButton from "@/components/TrackedCallButton";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Footer from "@/components/Footer";

/* =========================================================
   BRAND / CONTACT
========================================================= */

const SITE_URL = "https://www.khaturidescg.in";

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

const DEFAULT_WHATSAPP_MESSAGE =
  "Namaste Khatu Rides Travels, mujhe Durg-Bhilai se taxi book karni hai. Please booking availability aur fare details share karein.";

/* =========================================================
   WHATSAPP ICON
========================================================= */

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.03 3C8.86 3 3.05 8.8 3.05 15.96c0 2.28.6 4.5 1.73 6.47L3 29l6.77-1.74a12.9 12.9 0 0 0 6.26 1.61h.01c7.16 0 12.96-5.81 12.96-12.96C29 8.79 23.19 3 16.03 3Z"
        fill="currentColor"
      />
      <path
        d="M22.77 18.66c-.37-.18-2.2-1.08-2.54-1.2-.34-.13-.59-.18-.84.18-.25.37-.96 1.2-1.18 1.45-.22.25-.44.28-.81.1-.37-.19-1.56-.57-2.97-1.82-1.1-.98-1.84-2.2-2.06-2.57-.22-.37-.02-.57.16-.75.16-.16.37-.43.55-.65.18-.22.24-.37.37-.62.12-.25.06-.47-.03-.65-.1-.18-.84-2.02-1.15-2.76-.3-.73-.61-.63-.84-.64h-.72c-.25 0-.65.09-.99.47-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.33 3.6 1.51 3.84.18.25 2.62 4 6.34 5.61.89.39 1.58.62 2.12.8.89.28 1.7.24 2.34.15.71-.11 2.2-.9 2.51-1.77.31-.87.31-1.61.22-1.77-.09-.15-.34-.25-.71-.43Z"
        fill="white"
      />
    </svg>
  );
}

/* =========================================================
   HIGH-INTENT ROUTES

   Only verified route URLs are used here.
========================================================= */

const ROUTES = [
  {
    from: "Bhilai",
    to: "Raipur",
    slug: "bhilai-to-raipur-taxi",
    distance: "Approx. 35 KM",
    duration: "Approx. 45 Minutes",
    type: "Intercity Cab",
    badge: "Very High Demand",
    description:
      "Bhilai se Raipur ke liye direct one-way aur return cab enquiry.",
  },
  {
    from: "Durg",
    to: "Raipur",
    slug: "durg-to-raipur-taxi",
    distance: "Approx. 40 KM",
    duration: "Approx. 1 Hour",
    type: "Intercity Cab",
    badge: "Popular",
    description:
      "Durg se Raipur ke liye comfortable cab booking for personal and business travel.",
  },
  {
    from: "Raipur",
    to: "Bhilai",
    slug: "raipur-to-bhilai-taxi",
    distance: "Approx. 35 KM",
    duration: "Approx. 45 Minutes",
    type: "Intercity Cab",
    badge: "Very High Demand",
    description:
      "Raipur se Bhilai ke liye convenient one-way cab booking.",
  },
  {
    from: "Raipur",
    to: "Durg",
    slug: "raipur-to-durg-taxi",
    distance: "Approx. 40 KM",
    duration: "Approx. 1 Hour",
    type: "Intercity Cab",
    badge: "Popular",
    description:
      "Raipur se Durg ke liye direct taxi service aur booking support.",
  },
];

/* =========================================================
   SERVICES
========================================================= */

const SERVICES = [
  {
    icon: Car,
    title: "One Way Taxi",
    text: "Durg-Bhilai se Raipur aur nearby destinations ke liye one-way cab booking.",
  },
  {
    icon: Navigation,
    title: "Round Trip Cab",
    text: "Business meetings, family travel aur scheduled return journeys ke liye round-trip cab.",
  },
  {
    icon: Building2,
    title: "Corporate Travel",
    text: "Office visits, staff movement, business meetings aur commercial travel requirements ke liye cab.",
  },
  {
    icon: Plane,
    title: "Airport Transfer",
    text: "Raipur Airport ke liye scheduled pickup aur drop requirements ke liye advance booking enquiry.",
  },
  {
    icon: TrainFront,
    title: "Railway Transfer",
    text: "Durg aur Bhilai region se railway travel ke liye pickup-drop cab requirements.",
  },
  {
    icon: Users,
    title: "Family & Group Cab",
    text: "Family aur group journeys ke liye sedan, Ertiga aur premium SUV options.",
  },
];

/* =========================================================
   LOCAL COVERAGE
========================================================= */

const LOCAL_AREAS = [
  "Durg City",
  "Bhilai",
  "Supela",
  "Nehru Nagar",
  "Civic Centre",
  "Power House",
  "Risali",
  "Smriti Nagar",
  "Junwani",
  "Kumhari",
  "Padmanabhpur",
  "Pulgaon",
];

/* =========================================================
   FLEET
========================================================= */

const FLEET = [
  {
    name: "Maruti Suzuki Dzire",
    type: "Premium Sedan • AC",
    image: "/dezire.png",
    capacity: "4 Passengers",
    luggage: "2 Bags",
    price: "₹11/km onwards",
    description:
      "Daily city travel, business trips aur small family journeys ke liye suitable sedan.",
  },
  {
    name: "Maruti Suzuki Ertiga",
    type: "Comfort MUV • 6+1",
    image: "/ertiga.png",
    capacity: "6 Passengers",
    luggage: "4 Bags",
    price: "₹13/km onwards",
    description:
      "Family aur group travel ke liye spacious MUV option.",
  },
  {
    name: "Toyota Innova Crysta",
    type: "Premium SUV",
    image: "/crysta.png",
    capacity: "7 Passengers",
    luggage: "Heavy Luggage",
    price: "₹20/km onwards",
    description:
      "Premium business travel, executive journeys aur long-distance trips ke liye.",
  },
];

/* =========================================================
   WHY US
========================================================= */

const WHY_US = [
  {
    title: "Durg-Bhilai Focused Booking",
    text: "Durg aur Bhilai region se local, intercity aur outstation cab requirements ke liye direct booking support.",
  },
  {
    title: "Fast Direct Enquiry",
    text: "Phone ya WhatsApp par pickup, destination aur travel details share karke booking requirement discuss karein.",
  },
  {
    title: "One Way & Return",
    text: "Sirf drop ke liye one-way cab ya return journey ke liye round-trip option enquire kiya ja sakta hai.",
  },
  {
    title: "Corporate Travel",
    text: "Business meetings, office travel aur commercial cab requirements ke liye vehicle options.",
  },
  {
    title: "Multiple Vehicle Options",
    text: "Sedan, MUV aur premium SUV options passenger count aur luggage ke according.",
  },
  {
    title: "Regional Connectivity",
    text: "Durg-Bhilai urban region se Raipur aur Chhattisgarh ke other destinations ke liye cab booking assistance.",
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    q: "Durg-Bhilai se taxi kaise book karein?",
    a: `Durg-Bhilai se taxi book karne ke liye ${PHONE_DISPLAY} par call karein ya WhatsApp par pickup location, destination, travel date aur passengers ki details share karein.`,
  },
  {
    q: "Kya Bhilai se Raipur taxi available hai?",
    a: "Haan. Bhilai to Raipur ek high-intent intercity route hai aur one-way ya return cab requirement ke liye booking enquiry ki ja sakti hai.",
  },
  {
    q: "Durg se Raipur taxi milti hai?",
    a: "Haan. Durg to Raipur ke liye direct taxi booking available hai. Vehicle aur journey requirement ke according suitable cab option enquire kiya ja sakta hai.",
  },
  {
    q: "Kya Durg-Bhilai se Raipur Airport cab book kar sakte hain?",
    a: "Raipur Airport transfer requirements ke liye direct booking enquiry ki ja sakti hai. Pickup location, flight timing aur passenger details booking ke waqt share karein.",
  },
  {
    q: "Kya Durg-Bhilai se outstation cab milti hai?",
    a: "Haan. Durg-Bhilai se outstation travel ke liye one-way aur round-trip cab requirements ke liye booking team se contact kiya ja sakta hai.",
  },
  {
    q: "Family ke liye kaunsi car best rahegi?",
    a: "4 passengers tak ke liye sedan suitable ho sakti hai. Larger family/group ke liye Ertiga ya Innova Crysta jaise spacious vehicle options enquire kiye ja sakte hain.",
  },
];

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    "Durg Bhilai Taxi Service | Durg & Bhilai Cab Booking | Khatu Rides Travels",

  description:
    "Book taxi from Durg and Bhilai for Raipur and nearby destinations. One-way taxi, round-trip cab, corporate travel, airport transfer and outstation cab booking with Khatu Rides Travels.",

  keywords: [
    "Durg taxi service",
    "Durg cab service",
    "taxi service in Durg",
    "Durg cab booking",
    "Durg taxi booking",
    "Bhilai taxi service",
    "Bhilai cab service",
    "taxi service in Bhilai",
    "Bhilai cab booking",
    "Bhilai taxi booking",
    "Durg Bhilai taxi service",
    "Durg Bhilai cab service",
    "Durg to Raipur taxi",
    "Durg to Raipur cab",
    "Bhilai to Raipur taxi",
    "Bhilai to Raipur cab",
    "Raipur to Bhilai taxi",
    "Raipur to Durg taxi",
    "Durg outstation taxi",
    "Bhilai outstation cab",
    "Durg one way taxi",
    "Bhilai one way taxi",
    "Durg corporate cab",
    "Bhilai corporate cab",
  ],

  alternates: {
    canonical: `${SITE_URL}/cabs/durg-bhilai`,
  },

  openGraph: {
    title:
      "Durg Bhilai Taxi Service | Durg & Bhilai Cab Booking",
    description:
      "Book one-way, round-trip, corporate, airport and outstation cabs from Durg-Bhilai with Khatu Rides Travels.",
    url: `${SITE_URL}/cabs/durg-bhilai`,
    siteName: "Khatu Rides Travels",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Durg Bhilai Taxi Service",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Durg Bhilai Taxi Service | Khatu Rides Travels",
    description:
      "Book taxi from Durg and Bhilai for Raipur, airport, corporate and outstation travel.",
    images: [`${SITE_URL}/logo.png`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function DurgBhilaiCabPage() {
  /* =======================================================
     LOCAL BUSINESS SCHEMA
  ======================================================= */

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    url: `${SITE_URL}/cabs/durg-bhilai`,
    telephone: `+91-${PHONE}`,
    image: `${SITE_URL}/logo.png`,
    priceRange: "₹₹",

    address: {
      "@type": "PostalAddress",
      addressLocality: "Durg",
      addressRegion: "Chhattisgarh",
      addressCountry: "IN",
    },

    areaServed: [
      {
        "@type": "City",
        name: "Durg",
      },
      {
        "@type": "City",
        name: "Bhilai",
      },
      {
        "@type": "AdministrativeArea",
        name: "Chhattisgarh",
      },
    ],

    serviceType: [
      "Taxi Service",
      "Cab Booking",
      "One Way Taxi",
      "Round Trip Cab",
      "Corporate Cab",
      "Airport Transfer",
      "Outstation Cab",
    ],
  };

  /* =======================================================
     SERVICE SCHEMA
  ======================================================= */

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Durg Bhilai Taxi Service",
    serviceType: "Taxi and Cab Booking Service",
    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: `+91-${PHONE}`,
      url: SITE_URL,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Durg",
      },
      {
        "@type": "City",
        name: "Bhilai",
      },
    ],
    description:
      "Taxi and cab booking service from Durg and Bhilai for local, intercity, airport, corporate and outstation travel.",
  };

  /* =======================================================
     BREADCRUMB SCHEMA
  ======================================================= */

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
        name: "Durg Bhilai Taxi Service",
        item: `${SITE_URL}/cabs/durg-bhilai`,
      },
    ],
  };

  return (
    <>
      {/* =====================================================
          STRUCTURED DATA
      ===================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema),
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
          MAIN PAGE
      ===================================================== */}

      <main className="min-h-screen overflow-hidden bg-white text-slate-900">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="relative z-50 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="flex min-h-[78px] items-center justify-between gap-4">

              {/* LOGO */}

              <Link
                href="/"
                className="flex shrink-0 items-center"
                aria-label="Khatu Rides Travels Home"
              >
                <img
                  src="/logo.png"
                  alt="Khatu Rides Travels"
                  className="h-14 w-auto object-contain sm:h-16"
                />
              </Link>

              {/* DESKTOP NAV */}

              <nav className="hidden items-center gap-1 lg:flex">

                <Link
                  href="/"
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
                >
                  Home
                </Link>

                <Link
                  href="/#popular-routes"
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
                >
                  Popular Routes
                </Link>

                <Link
                  href="/#tour-packages"
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
                >
                  Tour Packages
                </Link>

                <Link
                  href="/#fleet"
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-[#063B8F]"
                >
                  Fleet
                </Link>

                <Link
                  href="/fare-calculator"
                  className="ml-1 flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2.5 text-sm font-black text-[#071A3A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFD23F]"
                >
                  <Navigation size={16} />
                  Fare Calculator
                </Link>
              </nav>

              {/* DESKTOP CALL */}

              <TrackedCallButton
                href={`tel:+91${PHONE}`}
                className="hidden items-center gap-3 rounded-2xl bg-[#063B8F] px-5 py-3 text-white shadow-[0_10px_25px_rgba(6,59,143,.20)] transition hover:-translate-y-0.5 hover:bg-[#052F73] sm:flex"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Phone size={18} fill="currentColor" />
                </span>

                <span className="text-left">
                  <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-blue-100">
                    Call for Booking
                  </span>

                  <span className="block text-sm font-black">
                    {PHONE_DISPLAY}
                  </span>
                </span>
              </TrackedCallButton>
            </div>

            {/* MOBILE HINDI BOOKING LINE */}

            <div className="border-t border-slate-100 py-3 sm:hidden">
              <div className="flex items-center justify-center gap-2 text-center">

                <Phone
                  size={14}
                  className="shrink-0 text-[#FF1726]"
                  fill="currentColor"
                />

                <p className="text-[22px] font-black leading-9 text-[#071A3A]">
                  दुर्ग-भिलाई से कहीं के लिए भी टैक्सी बुक करने के लिए
                  
                  संपर्क करें{" "}
                  <a
                    href={`tel:+91${PHONE}`}
                    className="text-[#FF1726]"
                  >
                    9244137353
                  </a>
                </p>

              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden bg-[#071A3A]">

          <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#FFC400]/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#063B8F]/50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

            {/* BREADCRUMB */}

            <div className="mb-5 flex items-center gap-2 text-[10px] font-bold text-blue-200 sm:text-xs">

              <Link
                href="/"
                className="hover:text-white"
              >
                Home
              </Link>

              <ChevronRight size={12} />

              <span>Durg-Bhilai Taxi Service</span>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">

              {/* HERO COPY */}

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#FFC400] backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#FFC400]" />
                  Durg • Bhilai Cab Booking
                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Durg-Bhilai
                  <span className="block text-[#FFC400]">
                    Taxi Service
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base sm:leading-7">
                  Durg aur Bhilai se Raipur, nearby destinations aur
                  outstation travel ke liye one-way, round-trip,
                  corporate aur airport cab booking.
                </p>

                {/* QUICK TRUST */}

                <div className="mt-6 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">

                  {[
                    "One Way",
                    "Round Trip",
                    "Corporate",
                    "Airport",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3"
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-[#FFC400]"
                      />

                      <span className="text-[9px] font-black text-white sm:text-[10px]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                  <TrackedCallButton
                    href={`tel:+91${PHONE}`}
                    className="group flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border-2 border-white bg-[#FF1726] px-6 text-white shadow-[0_15px_35px_rgba(255,23,38,.30)] transition hover:-translate-y-1 hover:bg-[#E90012]"
                  >

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#FF1726]">
                      <Phone
                        size={20}
                        fill="currentColor"
                      />
                    </span>

                    <span className="text-left">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-red-100">
                        Fast Booking
                      </span>

                      <span className="block text-base font-black">
                        Call Now
                      </span>
                    </span>

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />

                  </TrackedCallButton>

                  <TrackedWhatsAppButton
                    href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
                    className="group flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-[#00E676] px-6 text-white shadow-[0_15px_35px_rgba(0,230,118,.25)] transition hover:-translate-y-1 hover:bg-[#00D467]"
                  >

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <WhatsAppIcon size={23} />
                    </span>

                    <span className="text-left">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-green-50">
                        Chat & Enquire
                      </span>

                      <span className="block text-base font-black">
                        WhatsApp
                      </span>
                    </span>

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />

                  </TrackedWhatsAppButton>

                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <ShieldCheck
                    size={15}
                    className="text-[#FFC400]"
                  />
                  Direct booking support • Route & vehicle enquiry
                </div>
              </div>

              {/* HERO IMAGE */}

              <div className="relative">

                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-2 shadow-2xl">

                  <div className="relative overflow-hidden rounded-[24px]">

                    <img
                      src="/hero/01.png"
                      alt="Khatu Rides Travels Durg Bhilai taxi service"
                      className="h-[245px] w-full object-cover sm:h-[330px] lg:h-[400px]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#071A3A]/75 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">

                      <div className="rounded-2xl border border-white/15 bg-[#071A3A]/85 p-4 backdrop-blur-xl">

                        <div className="flex items-center justify-between gap-4">

                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FFC400]">
                              Service Area
                            </p>

                            <p className="mt-1 text-lg font-black text-white">
                              Durg • Bhilai
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                              Chhattisgarh
                            </p>
                          </div>

                          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#FFC400] text-[#071A3A] sm:flex">
                            <MapPin
                              size={19}
                              fill="currentColor"
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FLOAT BADGE */}

                <div className="absolute -bottom-4 -right-3 hidden rounded-2xl border border-white/20 bg-white p-4 shadow-2xl sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC400] text-[#071A3A]">
                      <Car size={21} />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Cab Booking
                      </p>

                      <p className="text-sm font-black text-[#071A3A]">
                        Local & Outstation
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            HIGH INTENT ROUTES
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                  High Intent Cab Routes
                </div>

                <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                  Durg-Bhilai Se Popular Routes
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Durg aur Bhilai region se frequently searched
                  intercity cab routes ke liye direct booking enquiry.
                </p>

              </div>

              <Link
                href="/routes"
                className="inline-flex items-center gap-2 text-sm font-black text-[#063B8F] hover:text-[#FF1726]"
              >
                View All Routes
                <ArrowRight size={16} />
              </Link>

            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {ROUTES.map((route, index) => (
                <Link
                  key={route.slug}
                  href={`/routes/${route.slug}`}
                  className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#063B8F]/20 hover:shadow-[0_20px_45px_rgba(15,23,42,.10)]"
                >

                  <div className="flex items-center justify-between gap-3">

                    <span className="rounded-full bg-[#FFF4C2] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#8A6400]">
                      {route.badge}
                    </span>

                    <span className="text-[10px] font-black text-slate-400">
                      0{index + 1}
                    </span>

                  </div>

                  <div className="mt-6 flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071A3A] text-[#FFC400]">
                      <MapPin
                        size={21}
                        fill="currentColor"
                      />
                    </div>

                    <div className="min-w-0">

                      <h3 className="text-lg font-black leading-tight text-[#071A3A]">
                        {route.from}
                        <span className="text-[#FF1726]">
                          {" → "}
                        </span>
                        {route.to}
                      </h3>

                      <p className="mt-1 text-[10px] font-bold text-slate-400">
                        {route.type}
                      </p>

                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <div className="rounded-xl bg-slate-50 px-3 py-2">

                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Distance
                      </p>

                      <p className="mt-1 text-[9px] font-black text-slate-700">
                        {route.distance}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 px-3 py-2">

                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Journey
                      </p>

                      <p className="mt-1 text-[9px] font-black text-slate-700">
                        {route.duration}
                      </p>

                    </div>

                  </div>

                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    {route.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-[10px] font-black uppercase tracking-wider text-[#063B8F]">
                      Check Route
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#071A3A] text-white transition group-hover:bg-[#063B8F]">
                      <ArrowRight size={15} />
                    </span>

                  </div>

                </Link>
              ))}
            </div>

            {/* SEARCH INTENT LINKS */}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

              <div className="flex flex-wrap items-center gap-x-2 gap-y-2">

                <span className="mr-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Popular searches:
                </span>

                <Link
                  href="/routes/bhilai-to-raipur-taxi"
                  className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-[#063B8F] hover:bg-[#FFF4C2]"
                >
                  Bhilai to Raipur Taxi
                </Link>

                <Link
                  href="/routes/durg-to-raipur-taxi"
                  className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-[#063B8F] hover:bg-[#FFF4C2]"
                >
                  Durg to Raipur Taxi
                </Link>

                <Link
                  href="/routes/raipur-to-bhilai-taxi"
                  className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-[#063B8F] hover:bg-[#FFF4C2]"
                >
                  Raipur to Bhilai Taxi
                </Link>

                <Link
                  href="/routes/raipur-to-durg-taxi"
                  className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-[#063B8F] hover:bg-[#FFF4C2]"
                >
                  Raipur to Durg Taxi
                </Link>

                <Link
                  href="/fare-calculator"
                  className="rounded-full bg-[#FFC400] px-3 py-2 text-[10px] font-black text-[#071A3A] hover:bg-[#FFD23F]"
                >
                  Calculate Fare
                </Link>

              </div>
            </div>

          </div>
        </section>

        {/* ===================================================
            BUSINESS / CORPORATE TRAVEL
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">

              {/* CORPORATE */}

              <div className="relative overflow-hidden rounded-[30px] bg-[#071A3A] p-6 text-white sm:p-8">

                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#FFC400]/15 blur-3xl" />

                <div className="relative">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-[#071A3A]">
                    <Building2 size={22} />
                  </div>

                  <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                    Business & Corporate Travel
                  </p>

                  <h2 className="mt-2 max-w-2xl text-2xl font-black sm:text-3xl">
                    Durg-Bhilai Corporate Cab Booking
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    Business meetings, office visits, staff movement,
                    executive travel aur scheduled intercity journeys ke
                    liye suitable cab requirements enquire karein.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">

                    {[
                      "Business Trips",
                      "Staff Travel",
                      "Executive Ride",
                      "Intercity",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-center text-[9px] font-black text-white"
                      >
                        {item}
                      </div>
                    ))}

                  </div>

                  <TrackedWhatsAppButton
                    href={whatsappUrl(
                      "Namaste Khatu Rides Travels, mujhe Durg-Bhilai se corporate cab booking ke baare me enquiry karni hai. Please share vehicle and booking details."
                    )}
                    className="mt-6 inline-flex items-center gap-3 rounded-xl bg-[#00E676] px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(0,230,118,.20)] transition hover:bg-[#00D467]"
                  >
                    <WhatsAppIcon size={17} />
                    Corporate Enquiry
                    <ArrowRight size={14} />
                  </TrackedWhatsAppButton>

                </div>
              </div>

              {/* AIRPORT */}

              <div className="rounded-[30px] border border-slate-200 bg-[#F5F7FA] p-6 sm:p-8">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063B8F] text-white">
                  <Plane size={22} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                  Airport Transfer
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071A3A] sm:text-3xl">
                  Durg-Bhilai to Raipur Airport
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Raipur Airport transfer ke liye Durg-Bhilai region se
                  pickup requirement advance me share karein. Travel date,
                  pickup point aur flight timing ke basis par booking enquiry.
                </p>

                <div className="mt-6 space-y-2">

                  {[
                    "Advance Airport Booking",
                    "Scheduled Pickup & Drop",
                    "Family & Business Travel",
                    "Multiple Vehicle Options",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-[#063B8F]"
                      />

                      <span className="text-[10px] font-black text-slate-600">
                        {item}
                      </span>
                    </div>
                  ))}

                </div>

                <TrackedCallButton
                  href={`tel:+91${PHONE}`}
                  className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF1726] px-5 text-xs font-black text-white transition hover:bg-[#E90012]"
                >
                  <Phone
                    size={16}
                    fill="currentColor"
                  />
                  Airport Booking Call
                </TrackedCallButton>

              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            SERVICES
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                Cab Services in Durg & Bhilai
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Travel Needs, Covered
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Durg-Bhilai region se local, intercity, business,
                airport aur outstation travel requirements ke liye
                multiple cab options.
              </p>

            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {SERVICES.map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.title}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,.08)]"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071A3A] text-[#FFC400] transition group-hover:bg-[#063B8F]">
                        <Icon size={21} />
                      </div>

                      <div>

                        <h3 className="text-base font-black text-[#071A3A]">
                          {service.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {service.text}
                        </p>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================
            LOCAL COVERAGE
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.07)] sm:p-9 lg:p-10">

              <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">

                <div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-[#071A3A]">
                    <MapPin
                      size={22}
                      fill="currentColor"
                    />
                  </div>

                  <div className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                    Local Cab Coverage
                  </div>

                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A]">
                    Durg-Bhilai Local Taxi
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Durg aur Bhilai urban region ke different residential,
                    commercial aur major local areas se pickup requirements
                    ke liye taxi booking enquiry.
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                  {LOCAL_AREAS.map((area) => (
                    <div
                      key={area}
                      className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                    >

                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFC400]" />

                      <span className="text-[10px] font-bold leading-4 text-slate-600">
                        {area}
                      </span>

                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FLEET
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div
            id="fleet"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                  Our Fleet
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                  Select Your Vehicle
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Passenger count, luggage aur journey type ke according
                  suitable vehicle option enquire karein.
                </p>

              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">

              {FLEET.map((vehicle) => (
                <div
                  key={vehicle.name}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,.06)]"
                >

                  <div className="relative h-[205px] overflow-hidden bg-slate-100">

                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} cab in Durg Bhilai`}
                      className="h-full w-full object-contain p-4 transition duration-500 hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-[#071A3A] px-3 py-1.5 text-[9px] font-black text-white">
                      {vehicle.type}
                    </div>

                  </div>

                  <div className="p-5">

                    <h3 className="text-lg font-black text-[#071A3A]">
                      {vehicle.name}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {vehicle.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          Capacity
                        </p>

                        <p className="mt-1 text-[10px] font-black text-slate-700">
                          {vehicle.capacity}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          Luggage
                        </p>

                        <p className="mt-1 text-[10px] font-black text-slate-700">
                          {vehicle.luggage}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-sm font-black text-[#063B8F]">
                        {vehicle.price}
                      </span>

                      <TrackedWhatsAppButton
                        href={whatsappUrl(
                          `Namaste Khatu Rides Travels, mujhe Durg-Bhilai se cab book karni hai. Vehicle enquiry: ${vehicle.name}. Please share availability and fare.`
                        )}
                        className="flex items-center gap-2 rounded-xl bg-[#00E676] px-3 py-2 text-[9px] font-black text-white transition hover:bg-[#00D467]"
                      >
                        <WhatsAppIcon size={15} />
                        Enquire
                      </TrackedWhatsAppButton>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            WHY CHOOSE US
        =================================================== */}

        <section className="bg-[#071A3A] py-12 text-white sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">

              <div>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                  Why Khatu Rides
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Durg-Bhilai Se Travel,
                  <span className="block text-[#FFC400]">
                    Simple & Direct.
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
                  Local travel se lekar business trips aur outstation
                  journeys tak, booking requirement directly phone ya
                  WhatsApp par share karein.
                </p>

                <TrackedCallButton
                  href={`tel:+91${PHONE}`}
                  className="mt-7 inline-flex items-center gap-3 rounded-2xl border-2 border-white bg-[#FF1726] px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,23,38,.25)] transition hover:-translate-y-1 hover:bg-[#E90012]"
                >
                  <Phone
                    size={18}
                    fill="currentColor"
                  />

                  Call {PHONE_DISPLAY}

                  <ArrowRight size={16} />
                </TrackedCallButton>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {WHY_US.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-[#071A3A]">
                        <span className="text-xs font-black">
                          0{index + 1}
                        </span>
                      </div>

                      <div>

                        <h3 className="text-sm font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-[11px] leading-5 text-slate-400">
                          {item.text}
                        </p>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            REVIEWS
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mb-8 text-center">

              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4C2] px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#8A6400]">
                <Star
                  size={13}
                  fill="currentColor"
                />
                Customer Experience
              </div>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                What Our Customers Say
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                Customer feedback and travel experiences from Khatu Rides.
              </p>

            </div>

            <ReviewsCarousel />
          </div>
        </section>

        {/* ===================================================
            SEO CONTENT
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,.05)] sm:p-9 lg:p-10">

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                Durg Bhilai Taxi Service
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#071A3A] sm:text-3xl">
                Durg & Bhilai Taxi Service | Cab Booking
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 sm:text-base">

                <p>
                  Khatu Rides Travels provides taxi and cab booking assistance
                  from Durg and Bhilai for local, intercity, corporate,
                  airport and outstation travel. Customers can contact the
                  booking team directly by phone or WhatsApp and share their
                  pickup location, destination, travel date and passenger
                  requirements.
                </p>

                <p>
                  Bhilai to Raipur taxi aur Durg to Raipur taxi important
                  intercity travel requirements ke liye book ki ja sakti hain.
                  Bhilai aur Durg se Raipur ke liye business travel, family
                  travel, personal journeys aur scheduled city-to-city travel
                  requirements ke liye suitable cab option enquire kiya ja
                  sakta hai.
                </p>

                <p>
                  Durg-Bhilai region Chhattisgarh ke major urban and industrial
                  travel corridors me se ek hai. Isliye business meetings,
                  office visits, staff movement, commercial travel aur
                  executive journeys ke liye cab requirements ke according
                  vehicle selection kiya ja sakta hai.
                </p>

                <p>
                  Raipur Airport transfer ke liye Durg-Bhilai se pickup
                  requirements advance me share ki ja sakti hain. Airport
                  travel ke waqt pickup point, travel date aur flight timing
                  jaise details booking enquiry ke waqt discuss karna useful
                  hota hai.
                </p>

                <p>
                  Durg-Bhilai taxi service ke liye local pickup requirements
                  ke saath nearby destinations aur longer outstation journeys
                  ke liye bhi one-way ya round-trip cab enquiry ki ja sakti
                  hai. Passenger count aur luggage ke according sedan, MUV
                  ya premium SUV options available categories me enquire kiye
                  ja sakte hain.
                </p>

                <p>
                  Durg-Bhilai se taxi book karne ke liye{" "}
                  <a
                    href={`tel:+91${PHONE}`}
                    className="font-black text-[#063B8F] hover:text-[#FF1726]"
                  >
                    {PHONE_DISPLAY}
                  </a>{" "}
                  par call karein ya WhatsApp par journey details share karein.
                </p>

              </div>
            </article>
          </div>
        </section>

        {/* ===================================================
            FAQ
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                Frequently Asked Questions
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Durg-Bhilai Cab Booking FAQs
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Durg-Bhilai taxi booking aur cab service se related common questions.
              </p>

            </div>

            <div className="mt-8 space-y-3">

              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-[0_10px_30px_rgba(15,23,42,.05)]"
                >

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-black text-[#071A3A]">

                    <span>{faq.q}</span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071A3A] text-white transition group-open:rotate-45">
                      <span className="text-xl font-light leading-none">
                        +
                      </span>
                    </span>

                  </summary>

                  <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500 sm:text-sm">
                    {faq.a}
                  </p>

                </details>
              ))}

            </div>
          </div>
        </section>

        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <section className="bg-[#F4F7FB] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#071A3A] px-6 py-9 shadow-2xl sm:px-10 sm:py-12 lg:px-14">

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#FFC400]">
                  <span className="h-2 w-2 rounded-full bg-[#FFC400]" />
                  Durg-Bhilai Cab Booking
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Durg-Bhilai Se Cab Book Karni Hai?
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Pickup, destination, date aur passengers ki details share
                  karein. Direct booking requirement ke liye call ya WhatsApp
                  par enquiry karein.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-[#FFC400]"
                    />
                    One Way
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-[#FFC400]"
                    />
                    Round Trip
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-[#FFC400]"
                    />
                    Corporate
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-[#FFC400]"
                    />
                    Airport
                  </span>

                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <TrackedCallButton
                  href={`tel:+91${PHONE}`}
                  className="flex min-h-[56px] items-center justify-center gap-3 rounded-2xl border-2 border-white bg-[#FF1726] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,23,38,.30)] transition hover:bg-[#E90012]"
                >
                  <Phone
                    size={18}
                    fill="currentColor"
                  />
                  Call Now
                  <ArrowRight size={16} />
                </TrackedCallButton>

                <TrackedWhatsAppButton
                  href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
                  className="flex min-h-[56px] items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-[#00E676] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(0,230,118,.25)] transition hover:bg-[#00D467]"
                >
                  <WhatsAppIcon size={20} />
                  WhatsApp
                  <ArrowRight size={16} />
                </TrackedWhatsAppButton>

              </div>
            </div>
          </div>
        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

      {/* =====================================================
          MOBILE FLOATING ACTION
      ===================================================== */}

      <div className="fixed bottom-5 right-4 z-[80] sm:hidden">

        <details className="group relative">

          {/* =================================================
              RED PHONE TOGGLE
          ================================================= */}

          <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-full border-2 border-white bg-[#FF1726] text-white shadow-[0_10px_30px_rgba(255,23,38,.45),0_0_35px_rgba(255,23,38,.25)] transition-all duration-300 hover:scale-105 hover:bg-[#E90012]">
            <Phone
              size={25}
              strokeWidth={2.8}
              fill="currentColor"
            />
          </summary>

          {/* =================================================
              EXPANDED ACTIONS
          ================================================= */}

          <div className="absolute bottom-[68px] right-0 flex flex-col gap-3">

            {/* CALL */}

            <TrackedCallButton
              href={`tel:+91${PHONE}`}
              className="flex min-h-[70px] min-w-[210px] items-center gap-4 rounded-2xl border-2 border-white/20 bg-[#FF1726] px-4 text-white shadow-[0_10px_35px_rgba(255,23,38,.40),0_0_35px_rgba(255,23,38,.20)]"
            >

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF1726] shadow-lg">
                <Phone
                  size={23}
                  fill="currentColor"
                />
              </span>

              <span className="text-left">

                <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-red-100">
                  Direct Booking
                </span>

                <span className="mt-0.5 block text-base font-black">
                  Call Now
                </span>

                <span className="block text-[10px] font-bold text-red-100">
                  {PHONE_DISPLAY}
                </span>

              </span>
            </TrackedCallButton>

            {/* WHATSAPP */}

            <TrackedWhatsAppButton
              href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
              className="flex min-h-[70px] min-w-[210px] items-center gap-4 rounded-2xl border-2 border-white/20 bg-[#00E676] px-4 text-white shadow-[0_10px_35px_rgba(0,230,118,.38),0_0_35px_rgba(0,230,118,.20)]"
            >

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-lg">
                <WhatsAppIcon size={25} />
              </span>

              <span className="text-left">

                <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-green-50">
                  Quick Enquiry
                </span>

                <span className="mt-0.5 block text-base font-black">
                  WhatsApp
                </span>

                <span className="block text-[10px] font-bold text-green-50">
                  Chat for Booking
                </span>

              </span>
            </TrackedWhatsAppButton>

          </div>
        </details>
      </div>
    </>
  );
}