import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
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
  "Namaste Khatu Rides Travels, I want to book a taxi from Ambikapur. Please share availability and booking details.";

/* =========================================================
   AMBIKAPUR POPULAR ROUTES
========================================================= */

const ROUTES = [
  {
    from: "Ambikapur",
    to: "Korba",
    slug: "ambikapur-to-korba-taxi",
    distance: "Approx. 185 KM",
    type: "One Way Cab",
    badge: "Most Booked",
  },
  {
    from: "Ambikapur",
    to: "Raipur",
    slug: "ambikapur-to-raipur-taxi",
    distance: "Approx. 330 KM",
    type: "One Way Cab",
    badge: "Popular",
  },
  {
    from: "Ambikapur",
    to: "Bilaspur",
    slug: "ambikapur-to-bilaspur-taxi",
    distance: "Intercity Route",
    type: "One Way Cab",
    badge: "Popular",
  },
  {
    from: "Ambikapur",
    to: "Raigarh",
    slug: "ambikapur-to-raigarh-taxi",
    distance: "Intercity Route",
    type: "One Way Cab",
    badge: "Popular",
  },
  {
    from: "Ambikapur",
    to: "Jashpur",
    slug: "ambikapur-to-jashpur-taxi",
    distance: "Regional Route",
    type: "One Way Cab",
    badge: "Regional",
  },
  {
    from: "Ambikapur",
    to: "Manendragarh",
    slug: "ambikapur-to-manendragarh-taxi",
    distance: "Regional Route",
    type: "One Way Cab",
    badge: "Regional",
  },
  {
    from: "Ambikapur",
    to: "Surajpur",
    slug: "ambikapur-to-surajpur-taxi",
    distance: "Nearby Route",
    type: "Local / Outstation",
    badge: "Nearby",
  },
  {
    from: "Ambikapur",
    to: "Koriya",
    slug: "ambikapur-to-koriya-taxi",
    distance: "Regional Route",
    type: "Outstation Cab",
    badge: "Regional",
  },
];

/* =========================================================
   AIRPORT / RAILWAY TRANSFERS
========================================================= */

const TRANSFERS = [
  {
    icon: Plane,
    title: "Ambikapur to Raipur Airport",
    description:
      "Pre-book a comfortable intercity cab from Ambikapur for scheduled airport travel.",
    href: "/routes/ambikapur-to-raipur-airport-cab",
  },
  {
    icon: TrainFront,
    title: "Ambikapur Railway Transfer",
    description:
      "Book a cab for railway station pickup, drop and connecting journeys from Ambikapur.",
    href: "/routes/ambikapur-to-railway-station-cab",
  },
  {
    icon: Navigation,
    title: "Ambikapur Outstation Cab",
    description:
      "Plan long-distance travel from Ambikapur with sedan, MUV and premium vehicle options.",
    href: "/services/outstation-cab",
  },
];

/* =========================================================
   SERVICES
========================================================= */

const SERVICES = [
  {
    icon: Navigation,
    title: "One Way Taxi",
    text: "Book a direct one-way cab from Ambikapur to major cities, towns and nearby destinations.",
  },
  {
    icon: Car,
    title: "Round Trip Cab",
    text: "Comfortable round-trip taxi service for family visits, business travel and personal journeys.",
  },
  {
    icon: Plane,
    title: "Airport Transfer",
    text: "Pre-booked airport cab service for customers travelling from Ambikapur towards major airports.",
  },
  {
    icon: Users,
    title: "Family & Group Travel",
    text: "Spacious vehicles for families, groups and passengers travelling with luggage.",
  },
  {
    icon: TrainFront,
    title: "Railway Transfer",
    text: "Convenient cab booking for railway station pickup, drop and connecting travel.",
  },
  {
    icon: Clock3,
    title: "Outstation Cab",
    text: "Reliable long-distance cab options from Ambikapur for business and personal travel.",
  },
];

/* =========================================================
   FLEET
========================================================= */

const FLEET = [
  {
    name: "Maruti Suzuki Dzire",
    type: "Premium Sedan",
    image: "/dezire.png",
    passengers: "4 Passengers",
    luggage: "2 Bags",
    bestFor: ["Couples", "Small Family", "Business"],
    description:
      "A comfortable sedan for one-way journeys, business travel, airport transfers and regular outstation trips.",
  },
  {
    name: "Maruti Suzuki Ertiga",
    type: "Family MUV",
    image: "/ertiga.png",
    passengers: "6+1 Seater",
    luggage: "4 Bags",
    bestFor: ["Families", "Groups", "Long Trips"],
    description:
      "A spacious MUV for family travel, group journeys and longer routes from Ambikapur.",
  },
  {
    name: "Toyota Innova Crysta",
    type: "Premium SUV",
    image: "/crysta.png",
    passengers: "7 Passengers",
    luggage: "Large Luggage",
    bestFor: ["Premium Travel", "Families", "Corporate"],
    description:
      "Premium SUV comfort for long-distance journeys, family travel and executive requirements.",
  },
];

/* =========================================================
   AMBIKAPUR LOCAL AREAS
========================================================= */

const LOCAL_AREAS = [
  "Ambikapur City",
  "Gandhinagar",
  "Manendragarh Road",
  "Bilaspur Road",
  "Raigarh Road",
  "Darri Para",
  "Sadar Road",
  "Banaras Road",
  "Namnakala",
  "Bishunpur",
];

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    question: "How can I book a taxi from Ambikapur?",
    answer:
      "You can contact Khatu Rides Travels directly through the Call Now or WhatsApp buttons on this page. Share your pickup location, destination, travel date and preferred vehicle to discuss availability.",
  },
  {
    question: "Can I book an Ambikapur to Korba taxi?",
    answer:
      "Yes. Ambikapur to Korba cab booking is available for one-way and return travel requirements, subject to vehicle availability.",
  },
  {
    question: "Is Ambikapur to Raipur cab service available?",
    answer:
      "Yes. Customers can enquire about Ambikapur to Raipur one-way and round-trip cab requirements. Airport and other connecting travel can also be discussed during booking.",
  },
  {
    question: "Can I book an airport taxi from Ambikapur?",
    answer:
      "Yes. Airport transfer requirements can be pre-booked from Ambikapur. Share your flight schedule and pickup details with the booking team.",
  },
  {
    question: "Which cab is suitable for family travel from Ambikapur?",
    answer:
      "The Dzire is suitable for smaller groups, while the Ertiga and Innova Crysta provide additional passenger and luggage space for larger families and groups.",
  },
  {
    question: "Does Khatu Rides provide outstation cab service from Ambikapur?",
    answer:
      "Yes. Outstation taxi enquiries are accepted from Ambikapur for intercity and long-distance travel, subject to route and vehicle availability.",
  },
];

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
        d="M27.2 4.7A15.1 15.1 0 0 0 16.1.1C7.8.1 1.1 6.8 1.1 15.1c0 2.6.7 5.1 1.9 7.3L.9 31.9l9.8-2.6a15 15 0 0 0 5.4 1c8.3 0 15-6.7 15-15 0-4-1.5-7.7-3.9-10.6Z"
        fill="currentColor"
      />

      <path
        d="M23.5 18.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.3-.5.3-.9.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.2-1.2-3-.3-.7-.7-.6-.9-.6h-.8c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.2s1.3 3.7 1.5 4c.2.3 2.5 3.8 6 5.3.8.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.4-1 2.7-2 .3-1 .3-1.8.2-2-.1-.2-.4-.3-.8-.5Z"
        fill="white"
      />
    </svg>
  );
}

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    "Ambikapur Taxi Service | Ambikapur to Korba, Raipur & Bilaspur Cab | Khatu Rides Travels",

  description:
    "Book a taxi from Ambikapur to Korba, Raipur, Bilaspur, Raigarh and nearby destinations. One-way, round-trip, airport and outstation cab service by Khatu Rides Travels.",

  keywords: [
    "Ambikapur taxi service",
    "Ambikapur cab service",
    "taxi booking Ambikapur",
    "cab booking Ambikapur",
    "Ambikapur to Korba taxi",
    "Ambikapur to Raipur taxi",
    "Ambikapur to Bilaspur taxi",
    "Ambikapur to Raigarh taxi",
    "Ambikapur airport taxi",
    "Ambikapur outstation cab",
    "Ambikapur one way taxi",
    "Ambikapur round trip cab",
  ],

  alternates: {
    canonical: `${SITE_URL}/cabs/ambikapur`,
  },

  openGraph: {
    title: "Ambikapur Taxi Service | Khatu Rides Travels",

    description:
      "Book one-way, round-trip, airport and outstation cabs from Ambikapur.",

    url: `${SITE_URL}/cabs/ambikapur`,

    siteName: "Khatu Rides Travels",

    type: "website",

    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Ambikapur Taxi Service",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Ambikapur Taxi Service | Khatu Rides Travels",

    description:
      "Book a cab from Ambikapur to Korba, Raipur, Bilaspur, Raigarh and more.",

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

export default function AmbikapurCabPage() {
  /* =======================================================
     LOCAL BUSINESS SCHEMA
  ======================================================= */

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",

    name: "Khatu Rides Travels Co.",

    url: `${SITE_URL}/cabs/ambikapur`,

    telephone: `+91-${PHONE}`,

    image: `${SITE_URL}/logo.png`,

    priceRange: "₹₹",

    areaServed: [
      {
        "@type": "City",
        name: "Ambikapur",
      },
      {
        "@type": "AdministrativeArea",
        name: "Chhattisgarh",
      },
    ],

    address: {
      "@type": "PostalAddress",
      addressLocality: "Ambikapur",
      addressRegion: "Chhattisgarh",
      addressCountry: "IN",
    },
  };

  /* =======================================================
     SERVICE SCHEMA
  ======================================================= */

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Ambikapur Taxi and Cab Service",

    serviceType: "Taxi Service",

    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: `+91-${PHONE}`,
      url: SITE_URL,
    },

    areaServed: {
      "@type": "City",
      name: "Ambikapur",
    },
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
        name: "Ambikapur Cab Service",
        item: `${SITE_URL}/cabs/ambikapur`,
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
          PAGE
      ===================================================== */}

      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#071A3A]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="flex min-h-[82px] items-center justify-between gap-4">

              {/* LOGO */}

              <Link
                href="/"
                className="shrink-0"
                aria-label="Khatu Rides Travels Home"
              >
                <img
                  src="/logo.png"
                  alt="Khatu Rides Travels"
                  className="h-[58px] w-auto object-contain sm:h-[68px]"
                />
              </Link>

              {/* DESKTOP NAV */}

              <nav className="hidden items-center gap-7 lg:flex">

                <Link
                  href="/"
                  className="text-sm font-bold text-slate-700 transition hover:text-[#063B8F]"
                >
                  Home
                </Link>

                <Link
                  href="/#popular-routes"
                  className="text-sm font-bold text-slate-700 transition hover:text-[#063B8F]"
                >
                  Popular Routes
                </Link>

                <Link
                  href="/#tour-packages"
                  className="text-sm font-bold text-slate-700 transition hover:text-[#063B8F]"
                >
                  Tour Packages
                </Link>

                <Link
                  href="/#fleet"
                  className="text-sm font-bold text-slate-700 transition hover:text-[#063B8F]"
                >
                  Fleet
                </Link>

                <Link
                  href="/#services"
                  className="text-sm font-bold text-slate-700 transition hover:text-[#063B8F]"
                >
                  Services
                </Link>

              </nav>

              {/* DESKTOP CTA */}

              <div className="flex items-center gap-2">

                <a
                  href={`tel:+91${PHONE}`}
                  className="hidden min-h-11 items-center gap-2 rounded-xl bg-[#063B8F] px-5 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:bg-[#052E70] sm:flex"
                >
                  <Phone size={17} fill="currentColor" />
                  Call Now
                </a>

                <a
                  href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
                  className="hidden min-h-11 items-center gap-2 rounded-xl bg-[#00E676] px-5 text-sm font-black text-white shadow-[0_0_22px_rgba(0,230,118,.22)] transition hover:-translate-y-0.5 hover:bg-[#00D968] sm:flex"
                >
                  <WhatsAppIcon size={20} />
                  WhatsApp
                </a>

                <Link
                  href="/fare-calculator"
                  className="hidden min-h-11 items-center gap-2 rounded-xl bg-[#F5B800] px-5 text-sm font-black text-[#071A3A] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#FFD02A] md:flex"
                >
                  Fare Calculator
                </Link>

              </div>

            </div>

            {/* MOBILE HINDI LINE */}

            <div className="border-t border-slate-100 py-3 text-center lg:hidden">

              <p
                className="text-[22px] font-black leading-7 text-[#071A3A] sm:text-base"
                style={{
                  fontFamily:
                    '"Noto Sans Devanagari", "Nirmala UI", "Mangal", sans-serif',
                }}
              >
                अंबिकापुर से कहीं के लिए भी टैक्सी बुक करने के लिए संपर्क करें{" "}
                <a
                  href={`tel:+91${PHONE}`}
                  className="font-black text-[#E11D2E] underline decoration-2 underline-offset-2"
                >
                  9244137353
                </a>
              </p>

            </div>

          </div>

        </header>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden bg-[#071A3A]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,184,0,0.18),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(6,59,143,0.38),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-11 lg:px-8 lg:py-14">

            <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">

              {/* HERO COPY */}

              <div>

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#FFD75A]">
                  <MapPin size={14} fill="currentColor" />
                  Ambikapur Local Cab Service
                </div>

                <h1 className="max-w-3xl text-[42px] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-[66px]">

                  Ambikapur Taxi

                  <span className="block text-[#F5B800]">
                    Booking Service
                  </span>

                  <span className="block">
                    For Every Journey
                  </span>

                </h1>

                <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
                  Book one-way taxis, round-trip cabs, airport transfers and
                  outstation vehicles from Ambikapur with direct phone and
                  WhatsApp assistance.
                </p>

                {/* HERO CTA */}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                  {/* CALL */}

                  <TrackedCallButton
                    href={`tel:+91${PHONE}`}
                    className="group relative flex min-h-[68px] items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#FF1726] px-7 text-white shadow-[0_0_0_1px_rgba(255,23,38,.35),0_12px_30px_rgba(255,23,38,.35),0_0_45px_rgba(255,23,38,.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#FF0717] hover:shadow-[0_0_0_2px_rgba(255,255,255,.2),0_18px_45px_rgba(255,23,38,.45),0_0_65px_rgba(255,23,38,.3)]"
                  >

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#FF1726] shadow-lg">
                      <Phone size={23} fill="currentColor" />
                    </span>

                    <span className="relative text-left">

                      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
                        Instant Booking
                      </span>

                      <span className="block text-[18px] font-black uppercase leading-6">
                        CALL NOW
                      </span>

                      <span className="block text-[12px] font-bold text-white">
                        {PHONE_DISPLAY}
                      </span>

                    </span>

                  </TrackedCallButton>

                  {/* WHATSAPP */}

                  <TrackedWhatsAppButton
                    href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
                    className="group relative flex min-h-[68px] items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#00E676] px-7 text-white shadow-[0_0_0_1px_rgba(0,230,118,.35),0_12px_30px_rgba(0,230,118,.30),0_0_45px_rgba(0,230,118,.20)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#00D968] hover:shadow-[0_0_0_2px_rgba(255,255,255,.2),0_18px_45px_rgba(0,230,118,.42),0_0_65px_rgba(0,230,118,.28)]"
                  >

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#00B95C] shadow-lg">
                      <WhatsAppIcon size={24} />
                    </span>

                    <span className="relative text-left">

                      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
                        Quick Enquiry
                      </span>

                      <span className="block text-[18px] font-black uppercase leading-6">
                        WHATSAPP
                      </span>

                      <span className="block text-[12px] font-bold text-white">
                        Get Booking Details
                      </span>

                    </span>

                  </TrackedWhatsAppButton>

                </div>

                {/* TRUST */}

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-[11px] font-bold text-slate-300">

                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-[#F5B800]"
                    />
                    Direct Booking
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-[#F5B800]"
                    />
                    AC Cabs
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-[#F5B800]"
                    />
                    Outstation Travel
                  </span>

                </div>

              </div>

              {/* HERO IMAGE */}

              <div className="relative mx-auto w-full max-w-[560px]">

                <div className="absolute -inset-8 rounded-full bg-[#F5B800]/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">

                  <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-slate-200 to-slate-300">

                    <img
                      src="/hero/01.png"
                      alt="Khatu Rides Travels cab service in Ambikapur"
                      className="h-[320px] w-full object-cover sm:h-[300px]"
                    />

                   

                    

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            POPULAR ROUTES
        =================================================== */}

        <section
          id="popular-routes"
          className="bg-white py-12 sm:py-16 lg:py-20"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                  <span className="h-2 w-2 rounded-full bg-[#F5B800]" />
                  High Intent Routes
                </div>

                <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                  Ambikapur Se Starts — Popular Routes
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Explore popular cab routes starting from Ambikapur and
                  contact the booking team for your travel requirement.
                </p>

              </div>

              <a
                href={`tel:+91${PHONE}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FF1726] px-5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,23,38,.22)] transition hover:-translate-y-0.5 hover:bg-[#E90012]"
              >
                <Phone size={15} fill="currentColor" />
                Book by Call
              </a>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {ROUTES.map((route, index) => (

                <article
                  key={route.slug}
                  className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,.11)]"
                >

                  <div className="relative h-3 bg-[#071A3A]">

                    <div className="absolute inset-y-0 left-0 w-[42%] bg-[#F5B800]" />

                  </div>

                  <div className="p-5">

                    <div className="flex items-center justify-between gap-3">

                      <span className="rounded-full bg-[#FFF4C7] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#8A6200]">
                        {route.badge}
                      </span>

                      <span className="text-[10px] font-black text-slate-400">
                        #{String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    <div className="mt-6 flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F]">
                        <MapPin size={17} fill="currentColor" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          From Ambikapur
                        </p>

                        <h3 className="truncate text-xl font-black text-[#071A3A]">
                          {route.to}
                        </h3>

                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Distance
                        </p>

                        <p className="mt-1 text-xs font-black text-slate-700">
                          {route.distance}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Service
                        </p>

                        <p className="mt-1 text-xs font-black text-slate-700">
                          {route.type}
                        </p>

                      </div>

                    </div>

                    <Link
                      href={`/routes/${route.slug}`}
                      className="mt-4 flex min-h-11 items-center justify-between rounded-xl bg-[#071A3A] px-4 text-[11px] font-black uppercase tracking-wider text-white transition group-hover:bg-[#063B8F]"
                    >
                      View Route & Book
                      <ArrowRight size={15} />
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>

        {/* ===================================================
            AIRPORT / RAILWAY
        =================================================== */}

        <section className="bg-[#F3F6FA] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="max-w-2xl">

              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                <Plane size={14} />
                Airport & Railway Transfer
              </div>

              <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Ambikapur Airport & Railway Cab Service
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Plan your airport, railway and long-distance journey from
                Ambikapur with advance cab booking assistance.
              </p>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">

              {TRANSFERS.map((item) => {

                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4C7] text-[#063B8F]">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-5 text-lg font-black text-[#071A3A]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#063B8F]">
                      Book Transfer
                      <ChevronRight size={15} />
                    </div>

                  </Link>
                );

              })}

            </div>

          </div>

        </section>

        {/* ===================================================
            SERVICES
        =================================================== */}

        <section
          id="services"
          className="bg-white py-12 sm:py-16 lg:py-20"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">

              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                <span className="h-2 w-2 rounded-full bg-[#F5B800]" />
                Ambikapur Cab Services
              </div>

              <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Taxi Service For Every Journey
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                From local transfers to long-distance outstation travel,
                choose a cab service based on your journey requirements.
              </p>

            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {SERVICES.map((service) => {

                const Icon = service.icon;

                return (
                  <div
                    key={service.title}
                    className="group rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_15px_45px_rgba(15,23,42,.08)]"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071A3A] text-[#F5B800] transition group-hover:bg-[#063B8F]">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-5 text-lg font-black text-[#071A3A]">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {service.text}
                    </p>

                  </div>
                );

              })}

            </div>

          </div>

        </section>

        {/* ===================================================
            FLEET
        =================================================== */}

        <section
          id="fleet"
          className="bg-[#F3F6FA] py-12 sm:py-16 lg:py-20"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                  Choose Your Cab
                </div>

                <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                  Comfortable Fleet For Ambikapur Trips
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Choose a sedan, MUV or premium SUV according to passenger
                  count, luggage and journey requirements.
                </p>

              </div>

              <a
                href={`tel:+91${PHONE}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-[#052E70]"
              >
                <Phone size={15} fill="currentColor" />
                Ask For Cab
              </a>

            </div>

            <div className="mt-9 grid gap-6 lg:grid-cols-3">

              {FLEET.map((vehicle) => (

                <article
                  key={vehicle.name}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,.07)]"
                >

                  <div className="relative h-[230px] overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200">

                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} cab available in Ambikapur`}
                      className="h-full w-full object-contain p-4 transition duration-500 hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-[#071A3A] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white">
                      {vehicle.type}
                    </div>

                  </div>

                  <div className="p-6">

                    <h3 className="text-xl font-black text-[#071A3A]">
                      {vehicle.name}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Seating
                        </p>

                        <p className="mt-1 text-xs font-black text-slate-700">
                          {vehicle.passengers}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Luggage
                        </p>

                        <p className="mt-1 text-xs font-black text-slate-700">
                          {vehicle.luggage}
                        </p>

                      </div>

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {vehicle.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {vehicle.bestFor.map((tag) => (

                        <span
                          key={tag}
                          className="rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-amber-700"
                        >
                          {tag}
                        </span>

                      ))}

                    </div>

                    <TrackedWhatsAppButton
                      href={whatsappUrl(
                        `Namaste Khatu Rides Travels, I want to enquire about booking a ${vehicle.name} from Ambikapur. Please share availability and booking details.`
                      )}
                      className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00E676] px-5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(0,230,118,.18)] transition hover:bg-[#00D968]"
                    >
                      <WhatsAppIcon size={19} />
                      Enquire For This Cab
                    </TrackedWhatsAppButton>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>

        {/* ===================================================
            LOCAL COVERAGE
        =================================================== */}

        <section className="bg-[#071A3A] py-12 text-white sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">

              <div>

                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#F5B800]">
                  Local Pickup Coverage
                </div>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Cab Pickup Across Ambikapur
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Cab booking enquiries can be made from Ambikapur city and
                  surrounding residential and commercial areas.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                  <TrackedCallButton
                    href={`tel:+91${PHONE}`}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF1726] px-6 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(255,23,38,.28)] transition hover:bg-[#E90012]"
                  >
                    <Phone size={16} fill="currentColor" />
                    Call {PHONE_DISPLAY}
                  </TrackedCallButton>

                  <TrackedWhatsAppButton
                    href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00E676] px-6 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(0,230,118,.25)] transition hover:bg-[#00D968]"
                  >
                    <WhatsAppIcon size={19} />
                    WhatsApp Us
                  </TrackedWhatsAppButton>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {LOCAL_AREAS.map((area) => (

                  <div
                    key={area}
                    className="flex min-h-[74px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3"
                  >

                    <MapPin
                      size={17}
                      className="shrink-0 text-[#F5B800]"
                      fill="currentColor"
                    />

                    <span className="text-xs font-bold leading-5 text-slate-200">
                      {area}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            WHY KHATU RIDES
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">

              <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                Why Book With Us
              </div>

              <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Simple Booking. Comfortable Journey.
              </h2>

            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: ShieldCheck,
                  title: "Reliable Service",
                  text: "Cab options selected according to your travel requirement.",
                },
                {
                  icon: Phone,
                  title: "Direct Support",
                  text: "Contact the booking team directly through phone or WhatsApp.",
                },
                {
                  icon: Navigation,
                  title: "Route Coverage",
                  text: "Travel assistance for major routes starting from Ambikapur.",
                },
                {
                  icon: Star,
                  title: "Customer Focus",
                  text: "Focused on clear communication and convenient travel.",
                },
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-sm"
                  >

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4C7] text-[#063B8F]">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-4 text-base font-black text-[#071A3A]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>

                  </div>
                );

              })}

            </div>

          </div>

        </section>

        {/* ===================================================
            REVIEWS
        =================================================== */}

        <section className="bg-[#F3F6FA] py-12 sm:py-16">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mb-8 text-center">

              <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                Customer Experience
              </div>

              <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                What Our Customers Say
              </h2>

            </div>

            <ReviewsCarousel />

          </div>

        </section>

        {/* ===================================================
            SEO CONTENT
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 sm:p-9 lg:p-10">

              <div className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                Ambikapur Taxi Service
              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#071A3A] sm:text-3xl">
                Ambikapur Taxi Service & Outstation Cab Booking
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 sm:text-base">

                <p>
                  Khatu Rides Travels provides cab booking assistance from
                  Ambikapur for local travel, one-way journeys, round trips,
                  airport transfers, railway connections and outstation
                  travel. Customers can contact the booking team directly by
                  phone or WhatsApp and share their pickup, destination and
                  travel requirements.
                </p>

                <p>
                  Popular travel requirements from Ambikapur include
                  Ambikapur to Korba taxi, Ambikapur to Raipur taxi, and
                  intercity cab journeys towards Bilaspur, Raigarh and other
                  destinations. Customers can enquire about one-way or
                  round-trip cab options depending on their itinerary.
                </p>

                <p>
                  Ambikapur to Korba cab service is useful for regional travel,
                  business journeys and personal trips. Ambikapur to Raipur
                  taxi booking can be considered for city, business and
                  connecting travel requirements. Vehicle selection can be
                  based on passenger count, luggage and overall journey needs.
                </p>

                <p>
                  For longer journeys, customers can choose between sedan,
                  MUV and premium SUV options. Advance booking is recommended
                  when travel involves a fixed flight, railway connection or
                  important appointment.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            FAQ
        =================================================== */}

        <section className="bg-[#F3F6FA] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">

              <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                Frequently Asked Questions
              </div>

              <h2 className="text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Ambikapur Cab Booking FAQs
              </h2>

            </div>

            <div className="mt-8 space-y-3">

              {FAQS.map((faq, index) => (

                <details
                  key={faq.question}
                  open={index === 0}
                  className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#071A3A]">

                    {faq.question}

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#063B8F] transition group-open:rotate-90">
                      <ChevronRight size={16} />
                    </span>

                  </summary>

                  <p className="pt-4 text-sm leading-7 text-slate-500">
                    {faq.answer}
                  </p>

                </details>

              ))}

            </div>

          </div>

        </section>

        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <section className="relative overflow-hidden bg-[#071A3A] py-14 sm:py-16">

          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#F5B800]/10 blur-3xl" />

          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#063B8F]/40 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5B800] text-[#071A3A] shadow-xl">
              <Car size={25} />
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Need a Taxi From Ambikapur?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Share your pickup location, destination and travel date.
              Contact Khatu Rides Travels directly for booking assistance.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              {/* CALL */}

              <TrackedCallButton
                href={`tel:+91${PHONE}`}
                className="group relative flex min-h-[64px] items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-white/15 bg-[#FF1726] px-8 text-base font-black text-white shadow-[0_0_35px_rgba(255,23,38,.30)] transition-all hover:-translate-y-1 hover:bg-[#FF0717] hover:shadow-[0_0_55px_rgba(255,23,38,.42)]"
              >

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <Phone
                  size={21}
                  fill="currentColor"
                  className="relative"
                />

                <span className="relative">
                  CALL NOW — {PHONE_DISPLAY}
                </span>

              </TrackedCallButton>

              {/* WHATSAPP */}

              <TrackedWhatsAppButton
                href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
                className="group relative flex min-h-[64px] items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-white/15 bg-[#00E676] px-8 text-base font-black text-white shadow-[0_0_35px_rgba(0,230,118,.28)] transition-all hover:-translate-y-1 hover:bg-[#00D968] hover:shadow-[0_0_55px_rgba(0,230,118,.40)]"
              >

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <WhatsAppIcon size={22} />

                <span className="relative">
                  WHATSAPP ENQUIRY
                </span>

              </TrackedWhatsAppButton>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

      {/* =====================================================
          MOBILE FLOATING CALL / WHATSAPP
      ===================================================== */}

      <div className="fixed bottom-5 right-4 z-[80] sm:hidden">

        <details className="group relative">

          {/* MAIN RED PHONE BUTTON */}

          <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-full border-2 border-white bg-[#FF1726] text-white shadow-[0_10px_30px_rgba(255,23,38,.45),0_0_35px_rgba(255,23,38,.25)] transition-all duration-300 hover:scale-105 hover:bg-[#E90012]">
            <Phone
              size={25}
              strokeWidth={2.8}
              fill="currentColor"
            />
          </summary>

          {/* EXPANDED ACTIONS */}

          <div className="absolute bottom-[68px] right-0 flex flex-col gap-3">

            {/* CALL */}

            <TrackedCallButton
              href={`tel:+91${PHONE}`}
              className="flex min-h-[70px] items-center gap-4 rounded-2xl border-2 border-white/20 bg-[#FF1726] px-5 text-white shadow-[0_10px_35px_rgba(255,23,38,.40),0_0_35px_rgba(255,23,38,.20)]"
            >

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF1726] shadow-lg">

                <Phone
                  size={23}
                  fill="currentColor"
                />

              </span>

             

            </TrackedCallButton>

            {/* WHATSAPP */}

            <TrackedWhatsAppButton
              href={whatsappUrl(DEFAULT_WHATSAPP_MESSAGE)}
              className="flex min-h-[70px] items-center gap-4 rounded-2xl border-2 border-white/20 bg-[#00E676] px-5 text-white shadow-[0_10px_35px_rgba(0,230,118,.38),0_0_35px_rgba(0,230,118,.20)]"
            >

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#00B95C] shadow-lg">
                <WhatsAppIcon size={24} />
              </span>

             

            </TrackedWhatsAppButton>

          </div>

        </details>

      </div>
    </>
  );
}