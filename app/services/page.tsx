import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import Footer from "@/components/Footer";

const SITE_URL = "https://www.khaturidescg.in";
const PAGE_URL = `${SITE_URL}/services`;

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

const services = [
  {
    icon: Route,
    title: "One Way Cab",
    subtitle: "Pay for your one-way journey",
    description:
      "Travel from one city to another without booking a traditional round trip. Ideal for intercity and long-distance travel.",
    points: [
      "City-to-city travel",
      "One-way airport transfers",
      "Intercity routes",
      "Long-distance journeys",
    ],
    color: "blue",
  },
  {
    icon: Navigation,
    title: "Round Trip Taxi",
    subtitle: "Go & return with one booking",
    description:
      "Comfortable round-trip cab service for family travel, business visits, personal work and multi-day journeys.",
    points: [
      "Return journey planning",
      "Family travel",
      "Business trips",
      "Multi-day travel",
    ],
    color: "amber",
  },
  {
    icon: Plane,
    title: "Airport Taxi",
    subtitle: "Pickup & drop service",
    description:
      "Pre-book a cab for airport pickup or drop. Share your flight timing and destination with our travel desk.",
    points: [
      "Airport pickup",
      "Airport drop",
      "Early morning travel",
      "Family & corporate transfers",
    ],
    color: "sky",
  },
  {
    icon: TrainFront,
    title: "Railway Station Transfer",
    subtitle: "Station pickup & drop",
    description:
      "Book a cab for railway station pickup and drop from Korba, Bilaspur, Raipur and nearby locations.",
    points: [
      "Station pickup",
      "Station drop",
      "Train travel support",
      "Local & intercity transfers",
    ],
    color: "emerald",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Cab",
    subtitle: "Business travel made easier",
    description:
      "Cab services for meetings, plant visits, site inspections, employee movement and business travel.",
    points: [
      "Corporate meetings",
      "Industrial site visits",
      "Guest transportation",
      "Business travel",
    ],
    color: "violet",
  },
  {
    icon: Users,
    title: "Family & Group Travel",
    subtitle: "Spacious vehicles for groups",
    description:
      "Choose from sedan, MUV and SUV options according to passenger count, luggage and travel distance.",
    points: [
      "Family trips",
      "Group journeys",
      "Tour travel",
      "Large luggage requirements",
    ],
    color: "rose",
  },
  {
    icon: Sparkles,
    title: "Tour & Pilgrimage Cab",
    subtitle: "Complete journey support",
    description:
      "Cab travel for pilgrimage, temple visits, family tours and multi-city journeys across Central and North India.",
    points: [
      "Temple tours",
      "Pilgrimage travel",
      "Multi-city tours",
      "Custom travel plans",
    ],
    color: "orange",
  },
  {
    icon: Clock3,
    title: "Local Cab Service",
    subtitle: "Travel within the city",
    description:
      "Local cab requirements for meetings, shopping, appointments, railway stations, hospitals and personal work.",
    points: [
      "City travel",
      "Personal work",
      "Meetings",
      "Local transfers",
    ],
    color: "cyan",
  },
];

const popularRoutes = [
  ["Korba", "Raipur"],
  ["Raipur", "Korba"],
  ["Korba", "Bilaspur"],
  ["Bilaspur", "Korba"],
  ["Korba", "Raigarh"],
  ["Raigarh", "Korba"],
  ["Raipur", "Bilaspur"],
  ["Bilaspur", "Raipur"],
  ["Raipur", "Jagdalpur"],
  ["Bilaspur", "Jagdalpur"],
  ["Raipur", "Ambikapur"],
  ["Raipur", "Jharsuguda"],
];

const serviceAreas = [
  "Korba",
  "Raipur",
  "Bilaspur",
  "Raigarh",
  "Ambikapur",
  "Jagdalpur",
  "Durg",
  "Bhilai",
  "Jharsuguda",
  "Sambalpur",
  "Chhattisgarh",
  "Nearby destinations",
];

const whyChooseUs = [
  {
    icon: Phone,
    title: "Direct Travel Desk",
    text: "Talk directly with our booking team about your route, vehicle and travel requirement.",
  },
  {
    icon: WalletCards,
    title: "Fare Enquiry",
    text: "Share your journey details and ask for the applicable fare before confirming.",
  },
  {
    icon: ShieldCheck,
    title: "Multiple Vehicle Options",
    text: "Sedan, MUV and SUV options for different passenger and luggage requirements.",
  },
  {
    icon: Clock3,
    title: "24×7 Support",
    text: "Travel support for early morning, late evening and long-distance requirements.",
  },
];

const faqs = [
  {
    q: "What cab services does Khatu Rides provide?",
    a: "Khatu Rides provides one-way cab, round-trip taxi, airport transfer, railway station transfer, local taxi, outstation travel, corporate cab, family travel and tour or pilgrimage cab services.",
  },
  {
    q: "Can I book a cab from Korba to Raipur?",
    a: "Yes. Korba to Raipur is one of the major intercity travel requirements served by Khatu Rides. Call the travel desk to check vehicle availability and the applicable fare for your travel date.",
  },
  {
    q: "Do you provide one-way taxi service?",
    a: "Yes. One-way taxi service is available for selected routes. Share your pickup point, destination and travel date with the booking team to check availability and fare.",
  },
  {
    q: "Which vehicle should I book for a family?",
    a: "For a small group, a sedan may be suitable. For larger families, Ertiga, Innova or Innova Crysta can be considered depending on passenger count, luggage and comfort requirements.",
  },
  {
    q: "Can I book an airport pickup?",
    a: "Yes. Airport pickup and drop requirements can be booked by sharing the airport, pickup or drop location, travel date and preferred time.",
  },
  {
    q: "Do you provide corporate cab services?",
    a: "Yes. Corporate and industrial travel requirements can include meetings, site visits, guest transportation and business travel, subject to availability and booking requirements.",
  },
];

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.26.59 4.38 1.63 6.22L3 29l6.98-1.78A12.73 12.73 0 0 0 16 28.8c7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16 3.2Z"
        fill="currentColor"
      />
      <path
        d="M12.1 9.6c-.27-.6-.56-.61-.82-.62h-.7c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3s1.29 3.48 1.47 3.72c.18.24 2.49 3.99 6.14 5.43 3.04 1.2 3.66.96 4.32.9.66-.06 2.14-.87 2.44-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42-.36-.18-2.14-1.05-2.47-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.78-1.07-.95-1.79-2.13-2-2.49-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.78-1.95-1.08-2.67Z"
        fill="white"
      />
    </svg>
  );
}

export const metadata: Metadata = {
  title:
    "Taxi Services in Chhattisgarh | One Way, Outstation, Airport & Corporate Cab",
  description:
    "Book taxi and cab services from Khatu Rides Travels Co. for one-way, round trip, airport, railway station, local, outstation, corporate, family and tour travel across Chhattisgarh.",
  keywords: [
    "taxi services Chhattisgarh",
    "cab service Chhattisgarh",
    "taxi service Korba",
    "cab service Korba",
    "taxi service Raipur",
    "cab service Bilaspur",
    "one way taxi Chhattisgarh",
    "outstation cab Chhattisgarh",
    "airport taxi Chhattisgarh",
    "corporate cab Chhattisgarh",
    "family taxi Chhattisgarh",
    "tour cab Chhattisgarh",
    "Khatu Rides services",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Taxi & Cab Services | Khatu Rides Travels Co.",
    description:
      "One way, round trip, airport, railway, local, outstation, corporate and tour cab services.",
    url: PAGE_URL,
    siteName: "Khatu Rides Travels Co.",
    type: "website",
  },
};

export default function ServicesPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Khatu Rides Travels Co. Taxi & Cab Services",
    url: PAGE_URL,
    description:
      "Taxi and cab services for local, one-way, round-trip, airport, railway, corporate, outstation and tour travel.",
    isPartOf: {
      "@type": "WebSite",
      name: "Khatu Rides Travels Co.",
      url: SITE_URL,
    },
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    url: SITE_URL,
    telephone: `+91${PHONE}`,
    areaServed: serviceAreas,
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Taxi & Cab Services",
    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: `+91${PHONE}`,
      url: SITE_URL,
    },
    areaServed: serviceAreas,
    serviceType: [
      "One Way Taxi",
      "Round Trip Taxi",
      "Airport Taxi",
      "Railway Station Transfer",
      "Corporate Cab",
      "Outstation Cab",
      "Local Taxi",
      "Tour & Pilgrimage Cab",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

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

      <main className="min-h-screen bg-slate-50 text-slate-950">
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061936]/95 shadow-lg backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="shrink-0">
              <img
                src="/logo.png"
                alt="Khatu Rides Travels Co."
                className="h-10 w-auto object-contain sm:h-11"
              />
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              <Link
                href="/"
                className="text-sm font-bold text-white/75 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/#popular-routes"
                className="text-sm font-bold text-white/75 transition hover:text-white"
              >
                Popular Routes
              </Link>

              <Link
                href="/tour-packages"
                className="text-sm font-bold text-white/75 transition hover:text-white"
              >
                Tour Packages
              </Link>

              <Link
                href="/fleet"
                className="text-sm font-bold text-white/75 transition hover:text-white"
              >
                Fleet
              </Link>

              <Link
                href="/services"
                className="text-sm font-black text-amber-300"
              >
                Services
              </Link>

              <Link
                href="/fare-calculator"
                className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Fare Calculator
              </Link>
            </nav>

            <a
              href={`tel:+91${PHONE}`}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-600 sm:px-5"
            >
              <Phone size={15} fill="currentColor" />
              <span>Call Now</span>
            </a>
          </div>
        </header>

        {/* ====================================================== */}
        {/* MOBILE STRIP */}
        {/* ====================================================== */}

        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center lg:hidden">
          <p className="text-[10px] font-black tracking-wide text-slate-700">
            🚕 ONE WAY • OUTSTATION • AIRPORT • CORPORATE • TOUR CAB
          </p>
        </div>

        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <section className="relative overflow-hidden bg-[#020B24]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(37,99,235,0.34),transparent_34%),radial-gradient(circle_at_88%_70%,rgba(245,158,11,0.17),transparent_32%)]" />

          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:45px_45px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-11 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2">
                <Sparkles size={14} className="text-amber-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                  Khatu Rides Services
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-[2.35rem] font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.25rem]">
                One Cab Service
                <span className="block text-amber-300">
                  For Every Journey.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-blue-100 sm:text-base sm:leading-7">
                One way, round trip, airport, railway, local, outstation,
                corporate और tour travel के लिए सही cab चुनिए। अपनी यात्रा
                बताइए और सीधे हमारे travel desk से बात कीजिए।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:+91${PHONE}`}
                  className="group flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 text-sm font-black text-white shadow-[0_15px_45px_rgba(239,68,68,0.35)] transition hover:-translate-y-1 hover:bg-red-600"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <Phone size={19} fill="currentColor" />
                  </span>

                  <span>
                    <span className="block text-[9px] uppercase tracking-wider text-red-100">
                      Get fare & availability
                    </span>
                    <span className="block text-base">
                      Call {PHONE_DISPLAY}
                    </span>
                  </span>

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 text-sm font-black text-white shadow-[0_15px_45px_rgba(37,211,102,0.25)] transition hover:-translate-y-1 hover:bg-[#1ebe5d]"
                >
                  <WhatsAppIcon size={21} />
                  WhatsApp Enquiry
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold text-blue-100/70">
                <span>✓ Local</span>
                <span>✓ One Way</span>
                <span>✓ Round Trip</span>
                <span>✓ Airport</span>
                <span>✓ Outstation</span>
              </div>
            </div>

            {/* Hero service panel */}
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative rounded-[30px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    [Route, "One Way", "City to City"],
                    [Plane, "Airport", "Pickup & Drop"],
                    [BriefcaseBusiness, "Corporate", "Business Travel"],
                    [Sparkles, "Tours", "Pilgrimage & Holiday"],
                  ].map(([Icon, title, subtitle]) => {
                    const ServiceIcon = Icon as typeof Route;

                    return (
                      <div
                        key={String(title)}
                        className="rounded-2xl border border-white/10 bg-white/[0.07] p-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                          <ServiceIcon size={20} />
                        </div>

                        <h2 className="mt-4 text-sm font-black text-white">
                          {String(title)}
                        </h2>

                        <p className="mt-1 text-[9px] font-semibold text-blue-100/55">
                          {String(subtitle)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <a
                  href={`tel:+91${PHONE}`}
                  className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 text-xs font-black text-slate-950 shadow-lg transition hover:bg-amber-300"
                >
                  <Phone size={16} fill="currentColor" />
                  Ask Which Service Is Right For You
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* QUICK CONVERSION BAR */}
        {/* ====================================================== */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            <a
              href={`tel:+91${PHONE}`}
              className="flex items-center gap-3 px-3 py-4 sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Phone size={17} fill="currentColor" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Need a cab?
                </p>
                <p className="text-xs font-black text-slate-950">
                  Call Now
                </p>
              </div>
            </a>

            <Link
              href="/fare-calculator"
              className="flex items-center gap-3 px-3 py-4 sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <WalletCards size={17} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Check
                </p>
                <p className="text-xs font-black text-slate-950">
                  Fare Calculator
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-3 px-5 py-4 lg:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Clock3 size={17} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Support
                </p>
                <p className="text-xs font-black text-slate-950">
                  24×7 Assistance
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 px-5 py-4 lg:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Travel
                </p>
                <p className="text-xs font-black text-slate-950">
                  Multiple Options
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SERVICES */}
        {/* ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              Our Services
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Find the service you need.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              अपनी यात्रा का purpose चुनिए और booking के लिए सीधे हमारी team
              से बात कीजिए।
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-slate-500">
                      Service
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-1 text-[10px] font-black text-blue-700">
                    {service.subtitle}
                  </p>

                  <p className="mt-3 min-h-[66px] text-xs leading-5 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {service.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-[9px] font-semibold text-slate-600"
                      >
                        <CheckCircle2
                          size={13}
                          className="shrink-0 text-emerald-500"
                        />
                        {point}
                      </div>
                    ))}
                  </div>

                  <a
                    href={`tel:+91${PHONE}`}
                    className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-3 text-[10px] font-black text-white shadow-lg shadow-red-500/10 transition hover:bg-red-600"
                  >
                    <Phone size={14} fill="currentColor" />
                    Call for This Service
                    <ChevronRight size={13} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* ====================================================== */}
        {/* MID CTA */}
        {/* ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[30px] bg-[#063B8F] px-5 py-8 shadow-2xl sm:px-8 lg:px-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                  Need Help Choosing?
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Tell us your route.
                  <span className="text-amber-300">
                    {" "}
                    We&apos;ll suggest the right cab.
                  </span>
                </h2>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-blue-100/75">
                  Pickup, destination, date और passengers की जानकारी बताकर
                  applicable fare और vehicle availability पूछें।
                </p>
              </div>

              <a
                href={`tel:+91${PHONE}`}
                className="flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 text-sm font-black text-white shadow-xl shadow-red-950/20 transition hover:-translate-y-1 hover:bg-red-600"
              >
                <Phone size={18} fill="currentColor" />
                Call {PHONE_DISPLAY}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* POPULAR ROUTES */}
        {/* ====================================================== */}

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                  Popular Travel Routes
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Need a cab between cities?
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Major intercity routes for one-way and round-trip cab
                  requirements.
                </p>
              </div>

              <Link
                href="/#popular-routes"
                className="inline-flex items-center gap-2 text-xs font-black text-blue-700"
              >
                View Popular Routes
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {popularRoutes.map(([from, to], index) => (
                <a
                  key={`${from}-${to}-${index}`}
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                    `Hello Khatu Rides, I need a cab from ${from} to ${to}. Please share fare and availability.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      One Way / Round Trip
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-950">
                      {from}
                      <span className="mx-1.5 text-blue-600">→</span>
                      {to}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white transition group-hover:bg-amber-400 group-hover:text-slate-950">
                    <ArrowRight size={14} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* CORPORATE / INDUSTRIAL */}
        {/* ====================================================== */}

        <section className="bg-slate-100">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div className="rounded-[28px] bg-[#061936] p-7 shadow-xl sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                <Building2 size={22} />
              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                Corporate & Industrial Travel
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                Business travel needs
                <span className="block text-amber-300">
                  reliable movement.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-6 text-blue-100/70">
                Meetings, site visits, guest transportation, plant visits और
                regional business travel के लिए cab requirements discuss करने
                के लिए हमारी travel desk team से बात करें।
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  "Site Visits",
                  "Plant Travel",
                  "Guest Pickup",
                  "Business Meetings",
                  "Employee Movement",
                  "Intercity Travel",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-[10px] font-bold text-blue-100/80"
                  >
                    <CheckCircle2
                      size={13}
                      className="mr-1.5 inline text-amber-300"
                    />
                    {item}
                  </div>
                ))}
              </div>

              <a
                href={`tel:+91${PHONE}`}
                className="mt-7 flex min-h-13 items-center justify-center gap-3 rounded-xl bg-red-500 px-5 text-xs font-black text-white transition hover:bg-red-600"
              >
                <Phone size={16} fill="currentColor" />
                Call for Corporate Requirement
              </a>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <MapPin size={22} />
              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-blue-700">
                Service Coverage
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Serving major destinations across the region.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Khatu Rides handles cab requirements from major cities and
                travel hubs across Chhattisgarh and nearby destinations,
                subject to route and vehicle availability.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[9px] font-black text-slate-600"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <a
                href={`tel:+91${PHONE}`}
                className="mt-7 flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-xs font-black text-white shadow-lg transition hover:bg-blue-800"
              >
                <Phone size={16} fill="currentColor" />
                Check Service Availability
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* WHY CHOOSE */}
        {/* ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              Why Khatu Rides
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              More than just a cab number.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-4 text-sm font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[10px] leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================== */}
        {/* SEO CONTENT */}
        {/* ====================================================== */}

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              Taxi Services
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Taxi & Cab Services Across Chhattisgarh
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
              <p>
                Khatu Rides Travels Co. provides cab and taxi services for
                different types of travel requirements across Chhattisgarh
                and nearby destinations. Customers can enquire about one-way
                taxi, round-trip cab, airport transfer, railway station
                transfer, local cab, outstation travel, corporate travel,
                family travel and tour or pilgrimage journeys.
              </p>

              <p>
                For intercity travel, one-way cab service can be useful when
                the passenger does not require the same vehicle for the return
                journey. Round-trip taxi service can be considered for
                journeys where the vehicle is required for the return trip or
                multiple days. The applicable fare depends on the route,
                vehicle category, travel date and booking requirement.
              </p>

              <p>
                Airport and railway station transfers are available for
                customers who need planned transportation to or from major
                travel hubs. Customers can share their pickup location,
                destination, date and preferred time with the travel desk to
                enquire about the suitable vehicle and availability.
              </p>

              <p>
                Khatu Rides also handles family travel, pilgrimage journeys,
                tour requirements and corporate or industrial travel. Vehicle
                selection can vary according to passenger count, luggage,
                route conditions and comfort requirements. Sedan, MUV and SUV
                options can be discussed with the booking team.
              </p>

              <p>
                For current fare and availability, the fastest way to plan a
                booking is to call the Khatu Rides travel desk. Tell us where
                you want to go, when you want to travel and how many passengers
                are travelling. Our team can then discuss the available
                vehicle and applicable fare for your requirement.
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* FAQ */}
        {/* ====================================================== */}

        <section className="bg-slate-100 py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                FAQs
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Taxi Service Questions
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-950">
                    {faq.q}

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 transition group-open:rotate-45">
                      <span className="text-lg font-normal text-slate-500">
                        +
                      </span>
                    </span>
                  </summary>

                  <p className="mt-4 text-xs leading-6 text-slate-500">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* FINAL CALL CTA */}
        {/* ====================================================== */}

        <section className="relative overflow-hidden bg-[#020B24]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.36),transparent_48%)]" />

          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/20">
              <Phone size={25} fill="currentColor" />
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              Book Your Cab
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Have a travel plan?
              <span className="block text-amber-300">
                Let&apos;s talk.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-blue-100/70 sm:text-base">
              Route, date, passengers और vehicle requirement बताइए। Fare और
              availability के लिए सीधे Khatu Rides travel desk को call करें।
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`tel:+91${PHONE}`}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-7 text-sm font-black text-white shadow-[0_15px_45px_rgba(239,68,68,0.3)] transition hover:-translate-y-1 hover:bg-red-600 sm:w-auto"
              >
                <Phone size={19} fill="currentColor" />
                Call Now — {PHONE_DISPLAY}
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-7 text-sm font-black text-white shadow-[0_15px_45px_rgba(37,211,102,0.22)] transition hover:-translate-y-1 hover:bg-[#1ebe5d] sm:w-auto"
              >
                <WhatsAppIcon size={20} />
                WhatsApp Us
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[9px] font-bold uppercase tracking-wider text-blue-200/40">
              <span>One Way</span>
              <span>Round Trip</span>
              <span>Airport</span>
              <span>Local</span>
              <span>Outstation</span>
              <span>Corporate</span>
              <span>Tours</span>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* FOOTER */}
        {/* ====================================================== */}

        <Footer />

        {/* ====================================================== */}
        {/* MOBILE FLOATING CALL */}
        {/* ====================================================== */}

        <div className="fixed bottom-4 right-4 z-[60] lg:hidden">
          <details className="group relative">
            <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-full bg-red-500 text-white shadow-[0_10px_35px_rgba(239,68,68,0.4)] [&::-webkit-details-marker]:hidden">
              <Phone
                size={23}
                fill="currentColor"
                className="transition group-open:hidden"
              />

              <X size={22} className="hidden group-open:block" />
            </summary>

            <div className="absolute bottom-[68px] right-0 w-[225px] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
              <a
                href={`tel:+91${PHONE}`}
                className="flex min-h-12 items-center gap-3 rounded-xl bg-red-500 px-4 text-xs font-black text-white"
              >
                <Phone size={17} fill="currentColor" />

                <span>
                  <span className="block text-[8px] uppercase text-red-100">
                    Quick Booking
                  </span>
                  Call Now
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex min-h-12 items-center gap-3 rounded-xl bg-[#25D366] px-4 text-xs font-black text-white"
              >
                <WhatsAppIcon size={18} />
                WhatsApp Enquiry
              </a>
            </div>
          </details>
        </div>
      </main>
    </>
  );
}