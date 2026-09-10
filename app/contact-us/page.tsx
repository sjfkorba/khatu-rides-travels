import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Calculator,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Contact Khatu Rides Travels | Taxi Booking in Chhattisgarh",

  description:
    "Contact Khatu Rides Travels for taxi booking in Chhattisgarh. Book one-way taxi, round trip cab, airport taxi and outstation cabs from Raipur, Korba, Bilaspur, Raigarh, Ambikapur and nearby cities. Call or WhatsApp for direct booking assistance.",

  keywords: [
    "Contact Khatu Rides Travels",
    "Khatu Rides Travels contact number",
    "Khatu Rides Travels Korba",
    "taxi booking Chhattisgarh",
    "cab booking Chhattisgarh",
    "taxi service in Chhattisgarh",
    "cab service in Chhattisgarh",
    "taxi service in Raipur",
    "taxi service in Korba",
    "taxi service in Bilaspur",
    "taxi service in Raigarh",
    "taxi service in Ambikapur",
    "taxi service in Jagdalpur",
    "taxi service in Durg",
    "taxi service in Bhilai",
    "Raipur taxi booking",
    "Korba taxi booking",
    "Raipur Airport taxi booking",
    "airport taxi Chhattisgarh",
    "one way taxi Chhattisgarh",
    "round trip cab Chhattisgarh",
    "outstation cab Chhattisgarh",
    "online cab booking Chhattisgarh",
    "Raipur to Korba taxi",
    "Korba to Raipur taxi",
    "Raipur to Bilaspur taxi",
    "Raipur to Raigarh taxi",
  ],

  alternates: {
    canonical: "/contact-us",
  },

  openGraph: {
    title:
      "Contact Khatu Rides Travels | Book Your Taxi in Chhattisgarh",
    description:
      "Call or WhatsApp Khatu Rides Travels for one-way taxi, round trip, airport taxi and outstation cab bookings across Chhattisgarh.",
    type: "website",
  },
};

const PHONE = "+919244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/XGzQoFuhnQkefhzo9";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Khatu%20Rides%20Travels%20Co.%2C%20Korba%2C%20Chhattisgarh&output=embed";

const generalWhatsAppMessage = encodeURIComponent(
  "Hello Khatu Rides Travels, I want to book a taxi. Please help me with the fare and availability."
);

const fareWhatsAppMessage = encodeURIComponent(
  "Hello Khatu Rides Travels, I want to know the cab fare for my journey."
);

const services = [
  {
    icon: Navigation,
    title: "One Way Taxi",
    description:
      "Book a one-way cab for intercity travel across Chhattisgarh and nearby destinations.",
    href: "/services/one-way-taxi-raipur",
  },
  {
    icon: Route,
    title: "Round Trip Cab",
    description:
      "Comfortable round trip taxi options for family, personal, business and longer journeys.",
    href: "/services/round-trip-cab",
  },
  {
    icon: Plane,
    title: "Airport Taxi",
    description:
      "Plan airport pickup and drop services, including Raipur Airport taxi requirements.",
    href: "/services/airport-taxi",
  },
  {
    icon: Car,
    title: "Outstation Cab",
    description:
      "Travel between cities and destinations with practical long-distance cab services.",
    href: "/services/outstation-cab",
  },
];

const serviceAreas = [
  {
    name: "Raipur",
    description: "Taxi booking & airport travel",
    href: "/services/one-way-taxi-raipur",
  },
  {
    name: "Korba",
    description: "Local & intercity cab service",
    href: "/services/one-way-taxi-korba",
  },
  {
    name: "Bilaspur",
    description: "One-way & city-to-city taxi",
    href: "/services/one-way-taxi-bilaspur",
  },
  {
    name: "Raigarh",
    description: "One-way & outstation travel",
    href: "/services/one-way-taxi-raigarh",
  },
  {
    name: "Ambikapur",
    description: "Intercity cab booking",
    href: "/services/one-way-taxi-ambikapur",
  },
  {
    name: "Jagdalpur",
    description: "Long-distance cab service",
    href: "/services/one-way-taxi-jagdalpur",
  },
  {
    name: "Durg",
    description: "Taxi & intercity travel",
    href: "/services/one-way-taxi-durg-bhilai",
  },
  {
    name: "Bhilai",
    description: "Cab & outstation service",
    href: "/services/one-way-taxi-durg-bhilai",
  },
];

const popularRoutes = [
  {
    title: "Raipur to Korba Taxi",
    href: "/routes/raipur-to-korba-taxi",
  },
  {
    title: "Raipur to Bilaspur Taxi",
    href: "/routes/raipur-to-bilaspur-taxi",
  },
  {
    title: "Raipur to Raigarh Taxi",
    href: "/routes/raipur-to-raigarh-taxi",
  },
  {
    title: "Raipur Airport Taxi",
    href: "/routes/raipur-airport-taxi",
  },
];

const bookingSteps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Tell Us Your Journey",
    description:
      "Send your pickup location, destination, travel date, time and passenger count.",
  },
  {
    number: "02",
    icon: Calculator,
    title: "Understand Your Fare",
    description:
      "Our team can help you understand the applicable fare and trip details before booking.",
  },
  {
    number: "03",
    icon: Car,
    title: "Confirm Your Cab",
    description:
      "Once the trip details are confirmed, proceed with your booking through direct support.",
  },
];

const faqs = [
  {
    question: "How can I book a taxi with Khatu Rides Travels?",
    answer:
      "You can contact Khatu Rides Travels directly by phone or WhatsApp. Share your pickup location, destination, travel date, time and passenger count so the team can assist you with the booking.",
  },
  {
    question: "What information should I send on WhatsApp for a taxi booking?",
    answer:
      "For a faster response, send your pickup location, destination, travel date, preferred pickup time, passenger count and whether you need a one-way, round-trip, airport or outstation cab.",
  },
  {
    question: "Do you provide taxi services from Raipur Airport?",
    answer:
      "Yes. Khatu Rides Travels provides airport pickup and drop assistance, including taxi requirements for Raipur Airport and travel to destinations across Chhattisgarh.",
  },
  {
    question: "Can I book a one-way taxi from Korba or Raipur?",
    answer:
      "Yes. One-way taxi services are available for selected intercity routes. Contact the team with your pickup and destination to check the applicable fare and availability.",
  },
  {
    question: "Does Khatu Rides Travels offer outstation cab services?",
    answer:
      "Yes. Khatu Rides Travels provides outstation cab services for longer-distance journeys, family trips, personal travel and business travel.",
  },
  {
    question: "How does Khatu Rides Travels approach pricing?",
    answer:
      "The company focuses on fair and affordable pricing with transparent communication rather than misleading discount claims. Customers are encouraged to confirm their trip details and applicable fare before booking.",
  },
];

export default function ContactUsPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    image: "https://khaturidestravels.com/logo.png",
    url: "https://khaturidestravels.com/contact-us",
    telephone: PHONE,
    priceRange: "₹₹",
    description:
      "Khatu Rides Travels provides taxi booking, one-way taxi, round trip cab, airport taxi and outstation cab services across Chhattisgarh.",
    areaServed: [
      "Chhattisgarh",
      "Raipur",
      "Korba",
      "Bilaspur",
      "Raigarh",
      "Ambikapur",
      "Jagdalpur",
      "Durg",
      "Bhilai",
    ],
    serviceType: [
      "Taxi Service",
      "Cab Service",
      "Taxi Booking",
      "One Way Taxi",
      "Round Trip Cab",
      "Airport Taxi",
      "Outstation Cab",
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Khatu Rides Travels",
    description:
      "Contact Khatu Rides Travels for taxi booking, airport transfers, one-way taxi, round trip and outstation cab services across Chhattisgarh.",
    url: "https://khaturidestravels.com/contact-us",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: PHONE,
      url: "https://khaturidestravels.com/contact-us",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-950">

      {/* ============================================================
          STRUCTURED DATA
      ============================================================ */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#071A3A] text-white">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,196,0,0.12),transparent_32%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-16">

          {/* Breadcrumb */}

          <div className="mb-8 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.18em] text-slate-400">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <ChevronRight size={11} />

            <span className="text-amber-400">
              Contact Us
            </span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">

            {/* Hero Content */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[#071A3A]">
                  <Phone size={13} />
                </span>

                <span className="text-[9px] font-black uppercase tracking-[.18em] text-amber-300">
                  Direct Booking Support
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-.03em] sm:text-5xl lg:text-7xl">
                Your Journey Starts
                <span className="block text-amber-400">
                  With A Simple Conversation.
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
                Looking for a taxi in Raipur, Korba, Bilaspur, Raigarh
                or anywhere across Chhattisgarh? Talk directly to Khatu
                Rides Travels for one-way taxi, round trip, airport and
                outstation cab bookings.
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <p className="text-xs font-semibold leading-6 text-slate-300">
                  More than{" "}
                  <strong className="text-white">
                    10 years of offline taxi experience
                  </strong>
                  , now backed by a modern online booking platform.
                </p>
              </div>

              {/* Primary CTAs */}

              <div className="mt-8 grid gap-3 sm:flex">

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-7 text-xs font-black uppercase tracking-[.12em] text-white shadow-[0_15px_40px_rgba(37,211,102,.18)] transition-all hover:-translate-y-1 hover:bg-[#20bd5b] active:scale-[.98] sm:flex-none"
                >
                  <MessageCircle size={19} />
                  WhatsApp Booking
                  <ArrowRight size={15} />
                </a>

                <a
                  href={`tel:${PHONE}`}
                  className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-amber-400 px-7 text-xs font-black uppercase tracking-[.12em] text-[#071A3A] shadow-[0_15px_40px_rgba(245,196,0,.16)] transition-all hover:-translate-y-1 hover:bg-amber-300 active:scale-[.98] sm:flex-none"
                >
                  <Phone size={18} />
                  Call {PHONE_DISPLAY}
                </a>

              </div>

              {/* Hero Trust */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">

                <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />
                  Direct Booking
                </span>

                <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />
                  Transparent Fare
                </span>

                <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />
                  10+ Years Experience
                </span>

              </div>

            </div>

            {/* Hero Contact Card */}

            <div className="relative">

              <div className="relative mx-auto max-w-md overflow-hidden rounded-[34px] border border-white/10 bg-white/[.06] p-5 shadow-[0_30px_100px_rgba(0,0,0,.25)] backdrop-blur-xl sm:p-7">

                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />

                {/* Logo */}

                <div className="relative flex items-center justify-center rounded-[25px] bg-white p-5 shadow-xl">
                  <img
                    src="/logo.png"
                    alt="Khatu Rides Travels"
                    className="h-auto max-h-[105px] w-full object-contain"
                  />
                </div>

                {/* Call */}

                <a
                  href={`tel:${PHONE}`}
                  className="relative mt-4 flex items-center gap-4 rounded-2xl bg-white p-4 text-[#071A3A] transition-all hover:-translate-y-0.5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#063B8F] text-white">
                    <Phone size={21} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-black uppercase tracking-[.16em] text-slate-400">
                      Call For Booking
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {PHONE_DISPLAY}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-300"
                  />
                </a>

                {/* WhatsApp */}

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-3 flex items-center gap-4 rounded-2xl bg-[#25D366] p-4 text-white transition-all hover:-translate-y-0.5 hover:bg-[#20bd5b]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <MessageCircle size={21} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-black uppercase tracking-[.16em] text-white/70">
                      WhatsApp Booking
                    </p>

                    <p className="mt-1 text-sm font-black">
                      Send Your Trip Details
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </a>

                {/* Experience */}

                <div className="relative mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4">
                    <p className="text-3xl font-black text-amber-400">
                      10+
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-slate-400">
                      Years Experience
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4">
                    <p className="text-3xl font-black text-white">
                      4.9
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-slate-400">
                      Google Rating
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          CONTACT OPTIONS
      ============================================================ */}

      <section className="relative -mt-1 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="grid gap-4 md:grid-cols-3">

            {/* CALL */}

            <a
              href={`tel:${PHONE}`}
              className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,.07)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_55px_rgba(15,23,42,.10)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#063B8F] transition group-hover:bg-[#063B8F] group-hover:text-white">
                  <Phone size={24} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#063B8F]"
                />

              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-[#063B8F]">
                Fastest Contact
              </p>

              <h2 className="mt-1 text-xl font-black">
                Call For Booking
              </h2>

              <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                Speak directly with our team about your taxi requirement,
                route, fare and booking.
              </p>

              <p className="mt-5 text-lg font-black text-slate-950">
                {PHONE_DISPLAY}
              </p>

            </a>

            {/* WHATSAPP */}

            <a
              href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[26px] border border-emerald-100 bg-emerald-50/40 p-6 shadow-[0_15px_45px_rgba(15,23,42,.05)] transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_20px_55px_rgba(15,23,42,.09)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white">
                  <MessageCircle size={24} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-emerald-200 transition-all group-hover:translate-x-1 group-hover:text-emerald-600"
                />

              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-emerald-600">
                Easy Booking
              </p>

              <h2 className="mt-1 text-xl font-black">
                WhatsApp Booking
              </h2>

              <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                Send your pickup, destination, date and passenger details
                directly on WhatsApp.
              </p>

              <p className="mt-5 text-lg font-black text-slate-950">
                Start Chat →
              </p>

            </a>

            {/* FARE */}

            <Link
              href="/fare-calculator"
              className="group rounded-[26px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-[0_15px_45px_rgba(15,23,42,.05)] transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_55px_rgba(15,23,42,.09)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A]">
                  <Calculator size={24} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-amber-300 transition-all group-hover:translate-x-1 group-hover:text-amber-600"
                />

              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-amber-700">
                Before You Book
              </p>

              <h2 className="mt-1 text-xl font-black">
                Check Cab Fare
              </h2>

              <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                Estimate your journey fare and explore suitable cab options
                before contacting us.
              </p>

              <p className="mt-5 text-sm font-black text-slate-950">
                Open Fare Calculator →
              </p>

            </Link>

          </div>

        </div>
      </section>

      {/* ============================================================
          HOW BOOKING WORKS
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-slate-600 shadow-sm">
              <Sparkles
                size={13}
                className="text-amber-500"
              />
              Simple Booking Process
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Booking A Taxi Should Be Simple.
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              No complicated forms are required to start a conversation.
              Share your journey details and connect directly with our team.
            </p>

          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-3">

            {bookingSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <Icon size={25} />
                    </div>

                    <span className="text-5xl font-black text-slate-100">
                      {step.number}
                    </span>

                  </div>

                  <h3 className="mt-6 text-lg font-black text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                    {step.description}
                  </p>

                  {index < bookingSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-amber-500 shadow-sm">
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* Booking CTA */}

          <div className="mt-8 rounded-[30px] bg-[#071A3A] p-6 text-white shadow-[0_20px_60px_rgba(7,26,58,.15)] sm:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A]">
                  <MessageCircle size={21} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.2em] text-amber-400">
                    Ready To Travel?
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Send Your Journey Details On WhatsApp
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Pickup • Destination • Date • Time • Passengers
                  </p>
                </div>

              </div>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#20bd5b]"
              >
                WhatsApp Us
                <ArrowRight size={13} />
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          SERVICE TYPES
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="max-w-3xl">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              What Can We Help You With?
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Choose Your Travel Requirement
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              Whether you need a one-way taxi, airport transfer, round trip
              or outstation cab, start with the service that matches your
              journey.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,.04)] transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_55px_rgba(15,23,42,.09)]"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-all group-hover:bg-amber-400 group-hover:text-[#071A3A]">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-[.14em] text-[#063B8F]">
                    Learn More
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>
      </section>

      {/* ============================================================
          SERVICE AREAS
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid items-end gap-5 lg:grid-cols-[1fr_auto]">

            <div className="max-w-3xl">

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-slate-600">
                <MapPin
                  size={13}
                  className="text-amber-500"
                />
                Chhattisgarh Service Areas
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Taxi Booking Across Chhattisgarh
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
                Contact Khatu Rides Travels for taxi and cab requirements
                from major cities including Raipur, Korba, Bilaspur,
                Raigarh, Ambikapur, Jagdalpur, Durg and Bhilai.
              </p>

            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 lg:flex">
              <Navigation
                size={16}
                className="text-amber-600"
              />

              <span className="text-[9px] font-black uppercase tracking-wider text-amber-700">
                Local &amp; Intercity Travel
              </span>
            </div>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {serviceAreas.map((area) => (
              <Link
                key={area.name}
                href={area.href}
                className="group rounded-[24px] border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_15px_45px_rgba(15,23,42,.07)]"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-400 group-hover:text-[#071A3A]">
                    <MapPin size={19} />
                  </div>

                  <ArrowRight
                    size={14}
                    className="mt-2 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
                  />

                </div>

                <h3 className="mt-5 text-base font-black">
                  Taxi Service in {area.name}
                </h3>

                <p className="mt-1.5 text-[9px] font-medium leading-5 text-slate-400">
                  {area.description}
                </p>

              </Link>
            ))}

          </div>

        </div>
      </section>

      {/* ============================================================
          POPULAR ROUTES
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="rounded-[34px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-8 lg:p-10">

            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">

              <div>

                <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-700">
                  Popular Route Enquiries
                </span>

                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  Looking For A Specific
                  <span className="block text-[#063B8F]">
                    Taxi Route?
                  </span>
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
                  Explore route-specific taxi information for some of the
                  popular journeys customers enquire about across
                  Chhattisgarh.
                </p>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${fareWhatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#071A3A] px-5 py-3 text-[9px] font-black uppercase tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#063B8F]"
                >
                  Ask Route Fare
                  <ArrowRight size={13} />
                </a>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {popularRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#071A3A] text-amber-400">
                        <Route size={16} />
                      </span>

                      <span className="text-[10px] font-black text-slate-800">
                        {route.title}
                      </span>

                    </div>

                    <ChevronRight
                      size={15}
                      className="shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
                    />

                  </Link>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          OFFICE + GOOGLE MAP
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">

            {/* Office Details */}

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,.06)] sm:p-8">

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-[9px] font-black uppercase tracking-[.18em] text-amber-700">
                <MapPin size={13} />
                Visit Our Office
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Khatu Rides Travels Co.
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
                Our travel office is located in Korba, Chhattisgarh.
                Customers can use Google Maps to view the location and
                get directions.
              </p>

              {/* Address */}

              <div className="mt-7 flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <MapPin
                    size={18}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Office Location
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    Korba, Chhattisgarh
                  </p>

                  <p className="mt-1 text-[9px] font-medium leading-5 text-slate-400">
                    Serving Chhattisgarh and nearby travel destinations
                  </p>
                </div>

              </div>

              {/* Contact */}

              <div className="mt-4 space-y-3">

                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F]">
                    <Phone size={16} />
                  </span>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-0.5 text-sm font-black">
                      {PHONE_DISPLAY}
                    </p>
                  </div>

                </a>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-emerald-100 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                >

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MessageCircle size={16} />
                  </span>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                      WhatsApp
                    </p>

                    <p className="mt-0.5 text-sm font-black">
                      Booking Enquiries
                    </p>
                  </div>

                </a>

              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#071A3A] px-5 text-[9px] font-black uppercase tracking-[.12em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#063B8F]"
              >
                <MapPin size={13} />
                Open In Google Maps
                <ArrowRight size={13} />
              </a>

            </div>

            {/* Map */}

            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,.08)]">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                <div className="flex items-center gap-3">

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Navigation size={17} />
                  </span>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[.16em] text-amber-600">
                      Find Us
                    </p>

                    <p className="mt-0.5 text-sm font-black text-slate-950">
                      Our Korba Office
                    </p>
                  </div>

                </div>

                <span className="hidden rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[7px] font-black uppercase tracking-wider text-emerald-600 sm:block">
                  Google Maps
                </span>

              </div>

              <div className="relative min-h-[360px] overflow-hidden bg-slate-100 sm:min-h-[430px]">

                <iframe
                  title="Khatu Rides Travels Co. Google Maps Location"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                {/* Floating Label */}

                <div className="pointer-events-none absolute left-4 top-4">

                  <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2.5 shadow-[0_10px_25px_rgba(15,23,42,.18)] backdrop-blur-md">

                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-[#071A3A]">
                      <MapPin
                        size={14}
                        fill="currentColor"
                      />
                    </span>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-950">
                        Khatu Rides Travels
                      </p>

                      <p className="text-[7px] font-semibold text-slate-500">
                        Korba, Chhattisgarh
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          TRUST SECTION
      ============================================================ */}

      <section className="bg-[#071A3A] text-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-amber-300">
                <Award size={13} />
                Why Customers Contact Us
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                A Decade Of Experience.
                <span className="block text-amber-400">
                  A Better Way To Book.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300">
                Khatu Rides Travels brings more than 10 years of offline
                taxi service experience into a modern online platform.
                The goal is not simply to sell a cab — it is to make
                the booking and travel experience more dependable.
              </p>

              <Link
                href="/about-us"
                className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-white/15"
              >
                Learn About Our Story
                <ArrowRight size={13} />
              </Link>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A]">
                  <Award size={22} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  10+ Years Experience
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  More than a decade of practical offline taxi and travel
                  service experience.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <BadgeCheck size={22} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Transparent Approach
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  We focus on fair pricing and clear communication instead
                  of misleading discount claims.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
                  <Users size={22} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Direct Support
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  Customers can directly connect with the travel team for
                  booking and journey-related enquiries.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <Star size={22} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Premium Travel Feel
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  Affordable does not have to mean compromising on comfort,
                  communication or service quality.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          BUSINESS HOURS / SUPPORT
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="rounded-[30px] border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Clock3 size={24} />
              </div>

              <div className="flex-1">

                <p className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                  Booking Support
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                  Need Help With A Travel Requirement?
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-500">
                  Booking enquiries are accepted daily. For urgent travel
                  requirements or route-specific fare information, direct
                  phone or WhatsApp contact is the quickest way to reach us.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <a
                    href={`tel:${PHONE}`}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#052f70]"
                  >
                    <Phone size={14} />
                    Call Now
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#20bd5b]"
                  >
                    <MessageCircle size={14} />
                    WhatsApp Now
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FAQ
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Frequently Asked Questions
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Contact &amp; Booking Questions
            </h2>

          </div>

          <div className="mt-10 space-y-3">

            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm"
              >

                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 sm:px-6">

                  <span className="text-sm font-black text-slate-950">
                    {faq.question}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-open:rotate-90">
                    <ChevronRight size={15} />
                  </span>

                </summary>

                <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6">
                  <p className="text-xs font-medium leading-6 text-slate-500">
                    {faq.answer}
                  </p>
                </div>

              </details>
            ))}

          </div>

        </div>
      </section>

      {/* ============================================================
          FINAL CONVERSION CTA
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#071A3A] text-white">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-amber-400 text-[#071A3A] shadow-[0_15px_40px_rgba(245,196,0,.20)]">
            <Car size={28} />
          </div>

          <p className="mt-6 text-[9px] font-black uppercase tracking-[.22em] text-amber-400">
            Let&apos;s Plan Your Journey
          </p>

          <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Need A Taxi?
            <span className="block text-amber-400">
              Talk To Khatu Rides Travels.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
            One-way taxi • Round trip • Airport taxi • Outstation cab
            • Local &amp; intercity travel
          </p>

          <p className="mx-auto mt-2 max-w-xl text-xs font-medium leading-6 text-slate-400">
            Fair fare. Direct support. 10+ years of travel experience.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href={`https://wa.me/${WHATSAPP}?text=${generalWhatsAppMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 text-xs font-black uppercase tracking-[.12em] text-white shadow-[0_15px_40px_rgba(37,211,102,.18)] transition-all hover:-translate-y-1 hover:bg-[#20bd5b]"
            >
              <MessageCircle size={19} />
              WhatsApp Booking
              <ArrowRight size={15} />
            </a>

            <a
              href={`tel:${PHONE}`}
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-400 px-8 text-xs font-black uppercase tracking-[.12em] text-[#071A3A] shadow-[0_15px_40px_rgba(245,196,0,.18)] transition-all hover:-translate-y-1 hover:bg-amber-300"
            >
              <Phone size={18} />
              Call For Booking
            </a>

            <Link
              href="/fare-calculator"
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-8 text-xs font-black uppercase tracking-[.12em] text-white backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/15"
            >
              <Calculator size={18} />
              Check Fare
            </Link>

          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-7">

            <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
              <Award
                size={14}
                className="text-amber-400"
              />
              10+ Years Experience
            </span>

            <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />
              Transparent Pricing
            </span>

            <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
              <MapPin
                size={14}
                className="text-blue-400"
              />
              Chhattisgarh Service
            </span>

          </div>

        </div>
      </section>

    </main>
  );
}