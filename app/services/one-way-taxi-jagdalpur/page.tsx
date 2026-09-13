import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
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
  "Namaste Khatu Rides Travels, mujhe Jagdalpur se taxi book karni hai. Please pickup, destination, vehicle availability aur fare details share karein.";

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
========================================================= */

const ROUTES = [
  {
    from: "Jagdalpur",
    to: "Raipur",
    slug: "jagdalpur-to-raipur-taxi",
    distance: "Approx. 300 KM",
    duration: "Approx. 6–7 Hours",
    badge: "High Intent",
    type: "Outstation One Way",
    text:
      "Jagdalpur se Raipur ke liye one-way cab booking, business travel, family travel aur scheduled journeys ke liye.",
  },
  {
    from: "Raipur",
    to: "Jagdalpur",
    slug: "raipur-to-jagdalpur-taxi",
    distance: "Approx. 300 KM",
    duration: "Approx. 6–7 Hours",
    badge: "High Intent",
    type: "Outstation One Way",
    text:
      "Raipur se Jagdalpur aur Bastar region ke liye comfortable outstation cab booking.",
  },
];

/* =========================================================
   TRAVEL SERVICES
========================================================= */

const SERVICES = [
  {
    icon: Car,
    title: "One Way Taxi",
    text:
      "Jagdalpur se Raipur aur other destinations ke liye one-way cab booking. Sirf drop journey ke liye direct enquiry option.",
  },
  {
    icon: Navigation,
    title: "Round Trip Cab",
    text:
      "Family travel, business visits aur return journey ke liye round-trip cab requirement discuss karein.",
  },
  {
    icon: Compass,
    title: "Bastar Sightseeing",
    text:
      "Jagdalpur se Bastar ke popular tourist destinations ke liye private cab aur sightseeing travel requirements ke liye enquiry.",
  },
  {
    icon: Plane,
    title: "Airport Transfer",
    text:
      "Jagdalpur Airport travel ke liye scheduled pickup-drop requirement advance me share karein.",
  },
  {
    icon: TrainFront,
    title: "Railway Transfer",
    text:
      "Jagdalpur Railway Station aur nearby pickup locations ke liye railway transfer cab enquiry.",
  },
  {
    icon: Building2,
    title: "Corporate Travel",
    text:
      "Business meetings, official visits, staff movement aur commercial travel ke liye vehicle booking.",
  },
];

/* =========================================================
   BASTAR DESTINATIONS
========================================================= */

const BASTAR_DESTINATIONS = [
  {
    title: "Chitrakote Waterfall",
    tag: "Bastar Sightseeing",
    text:
      "Jagdalpur se Chitrakote ke liye private cab journey, family outing aur sightseeing itinerary ke liye suitable.",
  },
  {
    title: "Tirathgarh Waterfall",
    tag: "Nature Trip",
    text:
      "Jagdalpur se Tirathgarh side travel ke liye day-trip aur private cab requirement enquire karein.",
  },
  {
    title: "Kanger Valley",
    tag: "Nature & Wildlife",
    text:
      "Kanger Valley region explore karne ke liye private vehicle aur planned sightseeing travel enquiry.",
  },
  {
    title: "Bastar Palace",
    tag: "Heritage",
    text:
      "Jagdalpur city ke heritage attractions explore karne ke liye local sightseeing cab requirement.",
  },
  {
    title: "Danteshwari Temple",
    tag: "Spiritual Travel",
    text:
      "Danteshwari Temple aur Jagdalpur ke spiritual destinations ke liye local cab travel.",
  },
  {
    title: "Bastar Local Circuit",
    tag: "Full Day Cab",
    text:
      "Multiple Bastar attractions cover karne ke liye private full-day sightseeing cab requirement discuss karein.",
  },
];

/* =========================================================
   LOCAL AREAS
========================================================= */

const LOCAL_AREAS = [
  "Jagdalpur City",
  "Dharampura",
  "Sanwli",
  "Adawal",
  "Geedam Road",
  "Raipur Road",
  "Danteshwari Temple Area",
  "Jagdalpur Railway Station",
  "Jagdalpur Airport",
  "Bastar Palace Area",
  "Kumharpara",
  "Maharana Pratap Chowk",
];

/* =========================================================
   TRAVEL REQUIREMENTS
========================================================= */

const TRAVEL_TYPES = [
  {
    number: "01",
    title: "Family Travel",
    text:
      "Family journeys ke liye comfortable vehicle, luggage capacity aur planned pickup requirement.",
  },
  {
    number: "02",
    title: "Business Travel",
    text:
      "Jagdalpur, Raipur aur nearby cities ke business meetings aur official travel ke liye cab.",
  },
  {
    number: "03",
    title: "Tour & Sightseeing",
    text:
      "Bastar waterfalls, nature destinations, temples aur local attractions cover karne ke liye private cab.",
  },
  {
    number: "04",
    title: "Airport Travel",
    text:
      "Flight schedule ke according airport pickup/drop requirement advance me coordinate karein.",
  },
  {
    number: "05",
    title: "Railway Travel",
    text:
      "Train arrival/departure ke according station pickup-drop cab requirement share karein.",
  },
  {
    number: "06",
    title: "Outstation Travel",
    text:
      "Jagdalpur se Chhattisgarh aur nearby states ke destinations ke liye one-way ya round-trip enquiry.",
  },
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
    text:
      "Couples, small families, solo travellers aur business trips ke liye comfortable sedan option.",
  },
  {
    name: "Maruti Suzuki Ertiga",
    type: "Comfort MUV • 6+1",
    image: "/ertiga.png",
    capacity: "6 Passengers",
    luggage: "4 Bags",
    price: "₹13/km onwards",
    text:
      "Family sightseeing aur group travel ke liye spacious MUV option.",
  },
  {
    name: "Toyota Innova Crysta",
    type: "Premium SUV",
    image: "/crysta.png",
    capacity: "7 Passengers",
    luggage: "Heavy Luggage",
    price: "₹20/km onwards",
    text:
      "Long-distance travel, premium family journeys aur executive travel ke liye.",
  },
];

/* =========================================================
   WHY CHOOSE US
========================================================= */

const WHY_US = [
  {
    title: "Jagdalpur Travel Focus",
    text:
      "Jagdalpur se local, Bastar sightseeing, intercity aur outstation travel requirements ke liye dedicated booking flow.",
  },
  {
    title: "Direct Phone & WhatsApp",
    text:
      "Pickup, destination, date aur passenger details directly phone ya WhatsApp par share karke enquiry karein.",
  },
  {
    title: "One Way & Round Trip",
    text:
      "Sirf destination tak drop chahiye ya return journey bhi hai—dono travel requirements ke liye enquiry.",
  },
  {
    title: "Tour-Friendly Vehicles",
    text:
      "Small family se group travel tak passenger count aur luggage ke according vehicle option enquire kiya ja sakta hai.",
  },
  {
    title: "Airport & Railway Travel",
    text:
      "Jagdalpur airport aur railway travel ke liye scheduled pickup-drop requirements advance me share karein.",
  },
  {
    title: "Bastar Connectivity",
    text:
      "Jagdalpur ko base bana kar Bastar region ke tourism, business aur personal travel requirements ke liye cab support.",
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    q: "Jagdalpur se taxi kaise book karein?",
    a:
      `Jagdalpur se taxi book karne ke liye ${PHONE_DISPLAY} par call karein ya WhatsApp par pickup location, destination, travel date aur passenger count share karein. Booking requirement ke according vehicle aur journey details discuss ki ja sakti hain.`,
  },
  {
    q: "Kya Jagdalpur se Raipur taxi milti hai?",
    a:
      "Haan. Jagdalpur to Raipur ek high-intent outstation route hai. One-way aur return journey ke liye cab booking enquiry ki ja sakti hai.",
  },
  {
    q: "Jagdalpur se Raipur taxi kitne time me pahunchti hai?",
    a:
      "Project route data ke according Jagdalpur to Raipur journey approximately 300 KM aur around 6–7 hours ki listed hai. Actual journey duration traffic, road conditions, stops aur pickup/drop location par depend kar sakti hai.",
  },
  {
    q: "Kya Jagdalpur se Bastar sightseeing ke liye cab book kar sakte hain?",
    a:
      "Haan. Chitrakote, Tirathgarh, Kanger Valley, Bastar Palace, Danteshwari Temple aur other Bastar sightseeing requirements ke liye private cab enquiry ki ja sakti hai. Multiple destinations cover karne wali itinerary ke liye pickup, stops aur return requirement pehle discuss karna useful hota hai.",
  },
  {
    q: "Kya Jagdalpur Airport ke liye cab milti hai?",
    a:
      "Jagdalpur Airport pickup-drop requirement ke liye advance booking enquiry ki ja sakti hai. Booking ke waqt flight timing, pickup location aur passenger details share karein.",
  },
  {
    q: "Kya Jagdalpur Railway Station pickup-drop available hai?",
    a:
      "Railway station pickup-drop ke liye cab enquiry ki ja sakti hai. Train arrival ya departure timing ke saath pickup point share karna booking coordination ke liye helpful hota hai.",
  },
  {
    q: "Bastar trip ke liye kaunsi car best rahegi?",
    a:
      "Small family ya couple ke liye sedan suitable ho sakti hai. 5–6 passengers aur luggage ke liye Ertiga jaise MUV options aur larger/premium travel ke liye Innova Crysta enquire ki ja sakti hai.",
  },
  {
    q: "Kya Jagdalpur se one-way cab book kar sakte hain?",
    a:
      "Haan. One-way travel requirement ke liye destination, date, passenger count aur pickup location share karke fare aur vehicle availability enquire karein.",
  },
];

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    "Jagdalpur Taxi Service | Jagdalpur Cab Booking | Bastar Taxi | Khatu Rides Travels",

  description:
    "Book taxi in Jagdalpur for Raipur, Bastar sightseeing, airport, railway station, one-way, round-trip and outstation travel. Khatu Rides Travels offers cab booking support with sedan, Ertiga and Innova Crysta.",

  keywords: [
    "Jagdalpur taxi service",
    "Jagdalpur cab service",
    "taxi service in Jagdalpur",
    "Jagdalpur taxi booking",
    "Jagdalpur cab booking",
    "Bastar taxi service",
    "Bastar cab service",
    "Bastar taxi booking",
    "Jagdalpur to Raipur taxi",
    "Jagdalpur to Raipur cab",
    "Raipur to Jagdalpur taxi",
    "Raipur to Jagdalpur cab",
    "Jagdalpur outstation taxi",
    "Jagdalpur one way taxi",
    "Jagdalpur round trip cab",
    "Jagdalpur airport taxi",
    "Jagdalpur railway station taxi",
    "Jagdalpur sightseeing taxi",
    "Bastar sightseeing cab",
    "Chitrakote taxi",
    "Tirathgarh taxi",
    "Kanger Valley taxi",
    "Bastar tour cab",
    "Jagdalpur car rental",
    "Jagdalpur family taxi",
    "Jagdalpur corporate cab",
  ],

  alternates: {
    canonical: `${SITE_URL}/cabs/jagdalpur`,
  },

  openGraph: {
    title:
      "Jagdalpur Taxi Service | Jagdalpur Cab Booking | Bastar Taxi",
    description:
      "Jagdalpur taxi booking for Raipur, Bastar sightseeing, airport, railway, one-way and outstation travel.",
    url: `${SITE_URL}/cabs/jagdalpur`,
    siteName: "Khatu Rides Travels",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Khatu Rides Travels Jagdalpur Taxi Service",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Jagdalpur Taxi Service | Khatu Rides Travels",
    description:
      "Book taxi from Jagdalpur for Raipur, Bastar sightseeing, airport and outstation travel.",
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

export default function JagdalpurCabPage() {
  /* =======================================================
     LOCAL BUSINESS SCHEMA
  ======================================================= */

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    url: `${SITE_URL}/cabs/jagdalpur`,
    telephone: `+91-${PHONE}`,
    image: `${SITE_URL}/logo.png`,
    priceRange: "₹₹",

    address: {
      "@type": "PostalAddress",
      addressLocality: "Jagdalpur",
      addressRegion: "Chhattisgarh",
      addressCountry: "IN",
    },

    areaServed: [
      {
        "@type": "City",
        name: "Jagdalpur",
      },
      {
        "@type": "AdministrativeArea",
        name: "Bastar",
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
      "Outstation Cab",
      "Airport Transfer",
      "Railway Transfer",
      "Sightseeing Cab",
      "Corporate Cab",
    ],
  };

  /* =======================================================
     SERVICE SCHEMA
  ======================================================= */

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Jagdalpur Taxi and Cab Service",
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
        name: "Jagdalpur",
      },
      {
        "@type": "AdministrativeArea",
        name: "Bastar",
      },
    ],

    description:
      "Taxi and cab booking service from Jagdalpur for local travel, Raipur intercity travel, Bastar sightseeing, airport, railway and outstation journeys.",
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
        name: "Jagdalpur Taxi Service",
        item: `${SITE_URL}/cabs/jagdalpur`,
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
                  <Phone
                    size={18}
                    fill="currentColor"
                  />
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

            {/* MOBILE HINDI LINE */}

            <div className="border-t border-slate-100 py-3 sm:hidden">

              <div className="flex items-center justify-center gap-2 text-center">

                <Phone
                  size={22}
                  className="shrink-0 text-[#FF1726]"
                  fill="currentColor"
                />

                <p className="text-[22px] font-black leading-9 text-[#071A3A]">

                  जगदलपुर से कहीं के लिए भी टैक्सी बुक करने के लिए

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

          <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#FFC400]/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#063B8F]/50 blur-3xl" />

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

              <span>Jagdalpur Taxi Service</span>

            </div>

            <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">

              {/* HERO CONTENT */}

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#FFC400] backdrop-blur">

                  <span className="h-2 w-2 rounded-full bg-[#FFC400]" />

                  Jagdalpur • Bastar Cab Booking

                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">

                  Jagdalpur
                  <span className="block text-[#FFC400]">
                    Taxi Service
                  </span>

                </h1>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base sm:leading-7">

                  Jagdalpur se Raipur, Bastar sightseeing, airport,
                  railway station aur outstation destinations ke liye
                  one-way, round-trip aur private cab booking.
                  Pickup location, destination aur travel date share
                  karke direct booking enquiry karein.

                </p>

                {/* TRUST GRID */}

                <div className="mt-6 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">

                  {[
                    "One Way",
                    "Bastar Tours",
                    "Airport",
                    "Outstation",
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
                        Direct Booking
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
                        Quick Enquiry
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

                  Direct booking support • Vehicle & route enquiry

                </div>

              </div>

              {/* HERO VISUAL */}

              <div className="relative">

                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-2 shadow-2xl">

                  <div className="relative overflow-hidden rounded-[24px]">

                    <img
                      src="/hero/01.png"
                      alt="Khatu Rides Travels Jagdalpur Bastar taxi service"
                      className="h-[245px] w-full object-cover sm:h-[330px] lg:h-[400px]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#071A3A]/80 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">

                      <div className="rounded-2xl border border-white/15 bg-[#071A3A]/85 p-4 backdrop-blur-xl">

                        <div className="flex items-center justify-between gap-4">

                          <div>

                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FFC400]">
                              Travel Hub
                            </p>

                            <p className="mt-1 text-lg font-black text-white">
                              Jagdalpur • Bastar
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                              Local • Intercity • Tourism • Outstation
                            </p>

                          </div>

                          <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#FFC400] text-[#071A3A] sm:flex">

                            <MapPin
                              size={20}
                              fill="currentColor"
                            />

                          </div>

                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                <div className="absolute -bottom-4 -right-3 hidden rounded-2xl border border-white/20 bg-white p-4 shadow-2xl sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC400] text-[#071A3A]">
                      <Compass size={21} />
                    </div>

                    <div>

                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Bastar Travel
                      </p>

                      <p className="text-sm font-black text-[#071A3A]">
                        Explore by Cab
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

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                  High Intent Routes
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                  Jagdalpur Se Popular Cab Routes
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Jagdalpur aur Raipur ke beech frequently searched
                  outstation cab routes ke liye dedicated route pages.
                </p>

              </div>

              <Link
                href="/routes"
                className="inline-flex items-center gap-2 text-sm font-black text-[#063B8F] hover:text-[#FF1726]"
              >
                Explore All Routes
                <ArrowRight size={16} />
              </Link>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {ROUTES.map((route, index) => (

                <Link
                  key={route.slug}
                  href={`/routes/${route.slug}`}
                  className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#063B8F]/20 hover:shadow-[0_22px_50px_rgba(15,23,42,.10)]"
                >

                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[60px] bg-[#FFF4C2]" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-[#071A3A] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#FFC400]">
                        {route.badge}
                      </span>

                      <span className="text-xs font-black text-slate-300">
                        0{index + 1}
                      </span>

                    </div>

                    <div className="mt-6 flex items-center gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#071A3A] text-[#FFC400]">

                        <MapPin
                          size={23}
                          fill="currentColor"
                        />

                      </div>

                      <div>

                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                          {route.type}
                        </p>

                        <h3 className="mt-1 text-2xl font-black text-[#071A3A]">

                          {route.from}

                          <span className="text-[#FF1726]">
                            {" → "}
                          </span>

                          {route.to}

                        </h3>

                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="flex items-center gap-2">

                          <Navigation
                            size={14}
                            className="text-[#063B8F]"
                          />

                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                            Distance
                          </span>

                        </div>

                        <p className="mt-1 text-xs font-black text-slate-700">
                          {route.distance}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="flex items-center gap-2">

                          <Clock3
                            size={14}
                            className="text-[#063B8F]"
                          />

                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                            Duration
                          </span>

                        </div>

                        <p className="mt-1 text-xs font-black text-slate-700">
                          {route.duration}
                        </p>

                      </div>

                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-500">
                      {route.text}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#063B8F]">
                        View Route Details
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A3A] text-white transition group-hover:bg-[#063B8F]">
                        <ArrowRight size={16} />
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

              <div className="flex flex-wrap items-center gap-2">

                <span className="mr-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Search directly:
                </span>

                <Link
                  href="/routes/jagdalpur-to-raipur-taxi"
                  className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-[#063B8F] transition hover:bg-[#FFF4C2]"
                >
                  Jagdalpur to Raipur Taxi
                </Link>

                <Link
                  href="/routes/raipur-to-jagdalpur-taxi"
                  className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-[#063B8F] transition hover:bg-[#FFF4C2]"
                >
                  Raipur to Jagdalpur Taxi
                </Link>

                <Link
                  href="/fare-calculator"
                  className="rounded-full bg-[#FFC400] px-3 py-2 text-[10px] font-black text-[#071A3A] transition hover:bg-[#FFD23F]"
                >
                  Calculate Fare
                </Link>

              </div>

            </div>

          </div>
        </section>

        {/* ===================================================
            BASTAR TOURISM
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">

              {/* LEFT */}

              <div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4C2] px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#8A6400]">

                  <Compass size={13} />

                  Bastar Travel & Sightseeing

                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">

                  Jagdalpur Se
                  <span className="block text-[#063B8F]">
                    Bastar Explore Karein
                  </span>

                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">

                  Jagdalpur Bastar region ko explore karne ke liye ek
                  practical travel base hai. Agar aap Chitrakote,
                  Tirathgarh, Kanger Valley, heritage attractions,
                  temples ya multiple sightseeing points cover karna
                  chahte hain, to private cab ke saath apna travel plan
                  karna convenient ho sakta hai.

                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">

                  Single destination ke liye simple drop, multiple
                  sightseeing points ke liye day-trip ya family/group
                  journey—booking enquiry ke waqt itinerary, passengers,
                  luggage aur return requirement share karein.

                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  <TrackedWhatsAppButton
                    href={whatsappUrl(
                      "Namaste Khatu Rides Travels, mujhe Jagdalpur se Bastar sightseeing ke liye private cab chahiye. Please vehicle options aur booking details share karein."
                    )}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00E676] px-5 text-xs font-black text-white shadow-[0_10px_25px_rgba(0,230,118,.18)] transition hover:bg-[#00D467]"
                  >

                    <WhatsAppIcon size={18} />

                    Bastar Tour Enquiry

                    <ArrowRight size={14} />

                  </TrackedWhatsAppButton>

                  <TrackedCallButton
                    href={`tel:+91${PHONE}`}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#071A3A] px-5 text-xs font-black text-white transition hover:bg-[#063B8F]"
                  >

                    <Phone
                      size={16}
                      fill="currentColor"
                    />

                    Talk to Booking Team

                  </TrackedCallButton>

                </div>

              </div>

              {/* RIGHT */}

              <div className="grid gap-3 sm:grid-cols-2">

                {BASTAR_DESTINATIONS.map((destination) => (

                  <div
                    key={destination.title}
                    className="group rounded-[24px] border border-slate-200 bg-[#F7F9FC] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_35px_rgba(15,23,42,.08)]"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A3A] text-[#FFC400]">
                        <MapPin
                          size={18}
                          fill="currentColor"
                        />
                      </div>

                      <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-slate-400 shadow-sm">
                        {destination.tag}
                      </span>

                    </div>

                    <h3 className="mt-5 text-base font-black text-[#071A3A]">
                      {destination.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {destination.text}
                    </p>

                  </div>

                ))}

              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            AIRPORT / RAILWAY
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-5 lg:grid-cols-2">

              {/* AIRPORT */}

              <div className="overflow-hidden rounded-[30px] bg-[#071A3A] p-6 text-white sm:p-8">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-[#071A3A]">
                  <Plane size={22} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                  Airport Transfer
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Jagdalpur Airport Taxi
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Flight travel ke liye airport pickup ya drop requirement
                  advance me share karein. Booking enquiry ke waqt flight
                  timing, pickup location, passenger count aur luggage details
                  dena useful rahega.
                </p>

                <div className="mt-6 space-y-2">

                  {[
                    "Advance Airport Booking",
                    "Pickup & Drop Enquiry",
                    "Family & Business Travel",
                    "Sedan / MUV / SUV Options",
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
                    >

                      <CheckCircle2
                        size={16}
                        className="text-[#FFC400]"
                      />

                      <span className="text-[10px] font-black text-white">
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

              {/* RAILWAY */}

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 sm:p-8">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063B8F] text-white">
                  <TrainFront size={22} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                  Railway Transfer
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071A3A] sm:text-3xl">
                  Jagdalpur Railway Station Taxi
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Railway journey ke liye station pickup-drop cab requirement
                  booking team ko advance me share karein. Train timing,
                  passenger count aur exact pickup/drop point ke basis par
                  travel requirement discuss ki ja sakti hai.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">

                  {[
                    "Station Pickup",
                    "Station Drop",
                    "Family Travel",
                    "Business Travel",
                  ].map((item) => (

                    <div
                      key={item}
                      className="rounded-xl bg-slate-50 p-4"
                    >

                      <CheckCircle2
                        size={16}
                        className="text-[#063B8F]"
                      />

                      <p className="mt-2 text-[10px] font-black text-slate-600">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

                <TrackedWhatsAppButton
                  href={whatsappUrl(
                    "Namaste Khatu Rides Travels, mujhe Jagdalpur Railway Station ke liye cab booking karni hai. Please pickup/drop aur vehicle availability share karein."
                  )}
                  className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00E676] px-5 text-xs font-black text-white transition hover:bg-[#00D467]"
                >

                  <WhatsAppIcon size={18} />

                  Railway Booking Enquiry

                </TrackedWhatsAppButton>

              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            TRAVEL USE CASES
        =================================================== */}

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="text-center">

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                Travel Requirements
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Jagdalpur Me Kis Type Ki Cab Chahiye?
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Different journeys ke liye requirement alag hoti hai.
                Isliye booking enquiry me purpose, passengers aur destination
                clearly share karein.
              </p>

            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {TRAVEL_TYPES.map((item) => (

                <div
                  key={item.number}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,.08)]"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071A3A] text-[#FFC400]">
                      <span className="text-[10px] font-black">
                        {item.number}
                      </span>
                    </div>

                    <div>

                      <h3 className="text-base font-black text-[#071A3A]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.text}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        </section>

        {/* ===================================================
            LOCAL COVERAGE
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.06)] sm:p-9 lg:p-10">

              <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

                <div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-[#071A3A]">

                    <MapPin
                      size={22}
                      fill="currentColor"
                    />

                  </div>

                  <div className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                    Jagdalpur Local Coverage
                  </div>

                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A]">
                    Jagdalpur Local Taxi
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Jagdalpur city ke residential, commercial, railway,
                    airport aur major local areas se pickup requirements ke
                    liye cab booking enquiry.
                  </p>

                  <TrackedCallButton
                    href={`tel:+91${PHONE}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF1726] px-5 py-3 text-xs font-black text-white transition hover:bg-[#E90012]"
                  >

                    <Phone
                      size={15}
                      fill="currentColor"
                    />

                    Call for Local Taxi

                  </TrackedCallButton>

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

        <section className="bg-white py-12 sm:py-16 lg:py-20">

          <div
            id="fleet"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >

            <div>

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                Vehicle Options
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071A3A] sm:text-4xl">
                Jagdalpur Travel Ke Liye Car Options
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Passenger count, luggage, travel distance aur journey type
                ke according vehicle option enquire karein.
              </p>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">

              {FLEET.map((vehicle) => (

                <div
                  key={vehicle.name}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,.06)]"
                >

                  <div className="relative h-[210px] overflow-hidden bg-slate-100">

                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} cab in Jagdalpur`}
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
                      {vehicle.text}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          Capacity
                        </p>

                        <p className="mt-1 text-[10px] font-black text-slate-700">
                          {vehicle.capacity}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

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
                          `Namaste Khatu Rides Travels, mujhe Jagdalpur se cab book karni hai. Vehicle: ${vehicle.name}. Please availability aur fare details share karein.`
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
            CORPORATE / OUTSTATION
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">

              {/* CORPORATE */}

              <div className="relative overflow-hidden rounded-[30px] bg-[#071A3A] p-6 text-white sm:p-8">

                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#FFC400]/15 blur-3xl" />

                <div className="relative">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC400] text-[#071A3A]">
                    <Building2 size={22} />
                  </div>

                  <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                    Corporate & Business Travel
                  </p>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Jagdalpur Corporate Cab Booking
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    Official visits, business meetings, staff movement,
                    commercial travel aur scheduled intercity journeys ke
                    liye cab requirement discuss karein. Passenger count,
                    route aur travel schedule share karne par suitable
                    vehicle category enquire ki ja sakti hai.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">

                    {[
                      "Business",
                      "Staff Travel",
                      "Executive",
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
                      "Namaste Khatu Rides Travels, mujhe Jagdalpur se corporate cab booking ke baare me enquiry karni hai. Please vehicle options aur booking details share karein."
                    )}
                    className="mt-6 inline-flex items-center gap-3 rounded-xl bg-[#00E676] px-5 py-3 text-xs font-black text-white transition hover:bg-[#00D467]"
                  >

                    <WhatsAppIcon size={17} />

                    Corporate Enquiry

                    <ArrowRight size={14} />

                  </TrackedWhatsAppButton>

                </div>

              </div>

              {/* OUTSTATION */}

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 sm:p-8">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063B8F] text-white">
                  <Navigation size={22} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                  Outstation Travel
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071A3A] sm:text-3xl">
                  Jagdalpur Se Outstation Cab
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Jagdalpur se Raipur aur other outstation destinations ke
                  liye one-way ya round-trip cab requirement ke liye direct
                  enquiry. Long-distance journey ke liye passenger count,
                  luggage aur return requirement pehle discuss karein.
                </p>

                <div className="mt-6 space-y-2">

                  {[
                    "One Way Drop",
                    "Round Trip Journey",
                    "Family & Group Travel",
                    "Long Distance Travel",
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
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

                  Outstation Enquiry

                </TrackedCallButton>

              </div>

            </div>

          </div>
        </section>

        {/* ===================================================
            WHY CHOOSE US
        =================================================== */}

        <section className="bg-[#071A3A] py-12 text-white sm:py-16 lg:py-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">

              <div>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC400]">
                  Why Khatu Rides
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">

                  Jagdalpur Se Travel,
                  <span className="block text-[#FFC400]">
                    Sirf Cab Se Nahi — Proper Planning Ke Saath.
                  </span>

                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">

                  Local ride, Raipur journey, airport transfer ya Bastar
                  sightseeing—booking se pehle pickup, destination,
                  passengers, luggage aur journey type clearly discuss
                  karna better travel coordination me help karta hai.

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
                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-[#071A3A]">

                        <span className="text-[10px] font-black">
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
                Jagdalpur Customers & Travellers
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                Customer feedback and travel experiences from Khatu Rides.
              </p>

            </div>

            <ReviewsCarousel />

          </div>
        </section>

        {/* ===================================================
            DEEP SEO CONTENT
        =================================================== */}

        <section className="bg-[#F4F7FB] py-12 sm:py-16 lg:py-20">

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,.05)] sm:p-9 lg:p-10">

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#063B8F]">
                Complete Jagdalpur Taxi Guide
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#071A3A] sm:text-3xl">
                Jagdalpur Taxi Service & Cab Booking
              </h2>

              <div className="mt-7 space-y-7 text-sm leading-7 text-slate-600 sm:text-base">

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur Taxi Service for Local & Outstation Travel
                  </h3>

                  <p className="mt-2">

                    Jagdalpur me taxi ki requirement different travel
                    purposes ke liye ho sakti hai—local city travel,
                    railway station transfer, airport travel, business
                    visit, family journey, sightseeing ya long-distance
                    outstation trip. Khatu Rides Travels ke through
                    customers pickup location, destination, travel date,
                    passenger count aur vehicle requirement share karke
                    direct cab booking enquiry kar sakte hain.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur to Raipur Taxi
                  </h3>

                  <p className="mt-2">

                    Jagdalpur to Raipur ek important intercity travel
                    requirement hai. Project route data me is route ki
                    listed distance approximately 300 KM aur listed
                    duration approximately 6–7 hours hai. :contentReference[oaicite:1]

                    One-way journey ke liye dedicated route page available
                    hai, jahan traveller route-specific information check
                    kar sakta hai.

                  </p>

                  <p className="mt-3">

                    Agar aap Jagdalpur se Raipur kisi business meeting,
                    personal work, family journey ya onward travel ke liye
                    ja rahe hain, to booking enquiry ke waqt exact pickup
                    point aur destination share karna useful hota hai.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Raipur to Jagdalpur Cab
                  </h3>

                  <p className="mt-2">

                    Raipur se Jagdalpur travel karne wale passengers ke liye
                    bhi dedicated high-intent route page available hai.
                    Project data me Raipur to Jagdalpur ko Outstation One Way
                    route ke roop me classify kiya gaya hai. :contentReference[oaicite:2]

                    Travellers pickup location, destination aur journey
                    requirements ke according cab booking enquiry kar sakte hain.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur & Bastar Sightseeing Cab
                  </h3>

                  <p className="mt-2">

                    Bastar travel ke liye Jagdalpur ek useful starting point
                    ho sakta hai. Travellers waterfalls, nature destinations,
                    heritage locations aur spiritual attractions cover karne
                    ke liye private cab requirement enquire kar sakte hain.

                    Agar itinerary me ek se zyada destinations hain, to
                    booking ke waqt complete route, expected stops, travel
                    date, passengers aur return requirement share karna
                    important hai.

                  </p>

                  <p className="mt-3">

                    Chitrakote aur Tirathgarh jaise sightseeing destinations,
                    Kanger Valley region, Bastar Palace aur Danteshwari Temple
                    jaise attractions ke liye local sightseeing requirement
                    ke according private cab enquiry ki ja sakti hai.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur Airport Taxi
                  </h3>

                  <p className="mt-2">

                    Flight travel ke liye airport pickup ya drop cab booking
                    karte waqt flight timing aur exact pickup location
                    share karna useful hota hai. Family, solo traveller,
                    business passenger ya group travel ke according vehicle
                    category enquire ki ja sakti hai.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur Railway Station Cab
                  </h3>

                  <p className="mt-2">

                    Railway station travel ke liye station pickup aur drop
                    requirements ke saath train timing share karna booking
                    coordination ke liye helpful hota hai. Agar luggage
                    zyada hai ya family/group travel hai, to booking ke waqt
                    vehicle requirement bhi mention karein.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    One Way Taxi from Jagdalpur
                  </h3>

                  <p className="mt-2">

                    Agar aapko sirf ek destination tak jaana hai aur same
                    vehicle ke saath return nahi karna, to one-way taxi
                    requirement enquire ki ja sakti hai. Jagdalpur to Raipur
                    jaise intercity route ke liye one-way cab ek dedicated
                    travel option hai.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur Family & Group Cab
                  </h3>

                  <p className="mt-2">

                    Family sightseeing aur group travel ke liye passenger
                    count ke saath luggage requirement bhi booking me
                    important hoti hai. Small group ke liye sedan aur larger
                    family/group ke liye MUV ya premium SUV options enquire
                    kiye ja sakte hain.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    Jagdalpur Corporate Cab Booking
                  </h3>

                  <p className="mt-2">

                    Business meetings, official visits, staff movement aur
                    commercial travel requirements ke liye scheduled cab
                    booking enquiry ki ja sakti hai. Corporate requirement
                    ke case me travel date, pickup/drop locations, number of
                    passengers aur approximate schedule pehle share karna
                    useful hota hai.

                  </p>

                </div>

                <div>

                  <h3 className="text-lg font-black text-[#071A3A]">
                    How to Book a Taxi in Jagdalpur
                  </h3>

                  <p className="mt-2">

                    Jagdalpur taxi booking ke liye process simple rakha gaya
                    hai. Call ya WhatsApp par pickup location, destination,
                    travel date, passengers aur vehicle requirement share
                    karein. Booking enquiry ke baad route aur vehicle
                    requirement ke according further details discuss ki
                    ja sakti hain.

                  </p>

                </div>

                <div className="rounded-2xl border border-[#FFC400]/40 bg-[#FFF9DD] p-5">

                  <p className="text-sm font-black leading-6 text-[#071A3A]">
                    Jagdalpur se taxi book karni hai?
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-600">

                    Call{" "}

                    <a
                      href={`tel:+91${PHONE}`}
                      className="font-black text-[#FF1726]"
                    >
                      {PHONE_DISPLAY}
                    </a>

                    {" "}ya WhatsApp par apni journey details share karein.

                  </p>

                </div>

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
                Jagdalpur Taxi Booking FAQs
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Jagdalpur cab booking, Bastar sightseeing, airport,
                railway aur outstation travel se related common questions.
              </p>

            </div>

            <div className="mt-8 space-y-3">

              {FAQS.map((faq) => (

                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-[0_10px_30px_rgba(15,23,42,.05)]"
                >

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-black text-[#071A3A]">

                    <span>
                      {faq.q}
                    </span>

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

                  Jagdalpur Cab Booking

                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">

                  Jagdalpur Se Cab Book Karni Hai?

                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">

                  Local taxi, Raipur cab, Bastar sightseeing, airport,
                  railway ya outstation travel ke liye pickup aur destination
                  details share karein.

                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-[#FFC400]"
                    />
                    Local
                  </span>

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
                    Bastar Tours
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-[#FFC400]"
                    />
                    Outstation
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
          MOBILE FLOATING CALL / WHATSAPP
      ===================================================== */}

      <div className="fixed bottom-5 right-4 z-[80] sm:hidden">

        <details className="group relative">

          {/* RED PHONE ICON */}

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
              className="flex min-h-[70px] min-w-[215px] items-center gap-4 rounded-2xl border-2 border-white/20 bg-[#FF1726] px-4 text-white shadow-[0_10px_35px_rgba(255,23,38,.40),0_0_35px_rgba(255,23,38,.20)]"
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
              className="flex min-h-[70px] min-w-[215px] items-center gap-4 rounded-2xl border-2 border-white/20 bg-[#00E676] px-4 text-white shadow-[0_10px_35px_rgba(0,230,118,.38),0_0_35px_rgba(0,230,118,.20)]"
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