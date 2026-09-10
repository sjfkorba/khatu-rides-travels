import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
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
    "About Khatu Rides Travels | 10+ Years Trusted Taxi Service in Chhattisgarh",

  description:
    "Discover Khatu Rides Travels, a 10+ year experienced taxi service in Chhattisgarh. Book one-way taxi, round trip cab, airport taxi and outstation cabs from Raipur, Korba, Bilaspur, Raigarh and nearby cities with transparent fares and no hidden charges.",

  keywords: [
    "Khatu Rides Travels",
    "Khatu Rides Travels Korba",
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
    "Raipur taxi service",
    "Korba taxi service",
    "Bilaspur taxi service",
    "Raipur airport taxi",
    "airport taxi service in Chhattisgarh",
    "one way taxi Chhattisgarh",
    "one way cab Chhattisgarh",
    "round trip cab Chhattisgarh",
    "outstation cab Chhattisgarh",
    "outstation taxi service",
    "cab booking Chhattisgarh",
    "online cab booking Chhattisgarh",
    "Raipur to Korba taxi",
    "Korba to Raipur taxi",
    "Raipur to Bilaspur taxi",
    "Bilaspur to Raipur taxi",
    "Raipur to Raigarh taxi",
    "Raipur to Ambikapur taxi",
    "Raipur to Jagdalpur taxi",
  ],

  alternates: {
    canonical: "/about-us",
  },

  openGraph: {
    title:
      "About Khatu Rides Travels | 10+ Years of Trusted Taxi Service",
    description:
      "10+ years of offline taxi experience, now available through a modern online cab booking platform. Transparent fares, premium service and no hidden charges.",
    type: "website",
  },
};

const PHONE = "+919244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

const whatsappMessage = encodeURIComponent(
  "Hello Khatu Rides Travels, I want to book a cab."
);

const trustCards = [
  {
    icon: Award,
    title: "10+ Years Experience",
    text: "A decade-plus of practical experience in offline taxi and travel services.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Fares",
    text: "Clear pricing designed to avoid unnecessary surprises and hidden charges.",
  },
  {
    icon: Car,
    title: "Premium Travel",
    text: "Comfortable vehicles and a service experience focused on every journey.",
  },
  {
    icon: Users,
    title: "Customer First",
    text: "Every booking is handled with communication, support and responsibility.",
  },
];

const serviceCards = [
  {
    icon: Navigation,
    title: "One Way Taxi",
    text: "Book a one way cab between major cities and destinations across Chhattisgarh without paying for an unnecessary return journey.",
    href: "/services/one-way-taxi-raipur",
    label: "Explore One Way Taxi",
  },
  {
    icon: Route,
    title: "Round Trip Cab",
    text: "Comfortable round trip taxi services for family travel, business journeys, personal trips and longer intercity travel.",
    href: "/services/round-trip-cab",
    label: "Explore Round Trip",
  },
  {
    icon: Plane,
    title: "Airport Taxi",
    text: "Plan reliable airport pickup and drop services, including Raipur Airport taxi requirements for local and outstation travelers.",
    href: "/services/airport-taxi",
    label: "Explore Airport Taxi",
  },
  {
    icon: Car,
    title: "Outstation Cab",
    text: "Travel beyond your city with outstation cab services designed for comfortable and practical long-distance journeys.",
    href: "/services/outstation-cab",
    label: "Explore Outstation Cab",
  },
];

const cityLinks = [
  {
    city: "Raipur",
    href: "/services/one-way-taxi-raipur",
    description: "Taxi service, airport taxi and intercity cab booking",
  },
  {
    city: "Korba",
    href: "/services/one-way-taxi-korba",
    description: "Local and one-way taxi services from Korba",
  },
  {
    city: "Bilaspur",
    href: "/services/one-way-taxi-bilaspur",
    description: "Bilaspur taxi and city-to-city cab services",
  },
  {
    city: "Raigarh",
    href: "/services/one-way-taxi-raigarh",
    description: "One-way taxi and intercity travel services",
  },
  {
    city: "Ambikapur",
    href: "/services/one-way-taxi-ambikapur",
    description: "Cab services for Ambikapur and nearby destinations",
  },
  {
    city: "Jagdalpur",
    href: "/services/one-way-taxi-jagdalpur",
    description: "Long-distance and outstation cab services",
  },
  {
    city: "Durg",
    href: "/services/one-way-taxi-durg-bhilai",
    description: "Durg taxi service and intercity travel",
  },
  {
    city: "Bhilai",
    href: "/services/one-way-taxi-durg-bhilai",
    description: "Bhilai taxi and outstation cab services",
  },
];

const routeLinks = [
  {
    label: "Raipur to Korba Taxi",
    href: "/routes/raipur-to-korba-taxi",
  },
  {
    label: "Korba to Raipur Taxi",
    href: "/routes/korba-to-raipur-taxi",
  },
  {
    label: "Raipur to Bilaspur Taxi",
    href: "/routes/raipur-to-bilaspur-taxi",
  },
  {
    label: "Bilaspur to Raipur Taxi",
    href: "/routes/bilaspur-to-raipur-taxi",
  },
  {
    label: "Raipur to Raigarh Taxi",
    href: "/routes/raipur-to-raigarh-taxi",
  },
  {
    label: "Raipur Airport Taxi",
    href: "/routes/raipur-airport-taxi",
  },
];

const faqs = [
  {
    question: "How long has Khatu Rides Travels been providing taxi services?",
    answer:
      "Khatu Rides Travels has more than 10 years of practical experience in offline taxi and travel services. The business is now expanding that experience into an online platform to make cab booking and travel planning more convenient for customers.",
  },
  {
    question: "Is Khatu Rides Travels a new taxi company?",
    answer:
      "No. The online platform is new, but the travel business has more than 10 years of offline taxi service experience. The online platform is an extension of that existing travel experience.",
  },
  {
    question: "Does Khatu Rides Travels offer cheap taxi fares?",
    answer:
      "The focus is not on misleading customers with unrealistic discount claims. Khatu Rides Travels aims to provide fair and affordable pricing with a premium travel experience and transparent communication.",
  },
  {
    question: "Does Khatu Rides Travels have hidden charges?",
    answer:
      "The company follows a transparent pricing philosophy and aims to communicate applicable trip charges clearly before booking. Customers are encouraged to confirm the final fare and trip details before starting their journey.",
  },
  {
    question: "What taxi services does Khatu Rides Travels provide?",
    answer:
      "Services include one-way taxi, round trip cab, airport taxi, outstation cab and local travel services across Chhattisgarh and nearby destinations.",
  },
  {
    question: "Which cities and routes are covered?",
    answer:
      "Khatu Rides Travels serves major locations including Raipur, Korba, Bilaspur, Raigarh, Ambikapur, Jagdalpur, Durg and Bhilai, along with several intercity and outstation routes.",
  },
];

export default function AboutUsPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    image: "https://khaturidestravels.com/logo.png",
    url: "https://khaturidestravels.com/about-us",
    telephone: PHONE,
    priceRange: "₹₹",
    description:
      "Khatu Rides Travels provides one-way taxi, round trip cab, airport taxi and outstation cab services across Chhattisgarh and nearby destinations.",
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
      "One Way Taxi",
      "Airport Taxi",
      "Outstation Cab",
      "Round Trip Cab",
    ],
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
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#071A3A] text-white">

        {/* Background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,196,0,0.12),transparent_30%)]" />
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
              About Us
            </span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">

            {/* Hero Copy */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[#071A3A]">
                  <Award size={13} />
                </span>

                <span className="text-[9px] font-black uppercase tracking-[.18em] text-amber-300">
                  10+ Years of Taxi Service Experience
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-.03em] sm:text-5xl lg:text-7xl">
                More Than A Cab.
                <span className="block text-amber-400">
                  A Journey Built On Trust.
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
                Khatu Rides Travels is a customer-focused taxi and travel
                service built on more than a decade of real-world offline
                experience. From local taxi bookings to airport transfers,
                one-way cabs, round trips and outstation journeys, our goal
                has always been simple — make every journey comfortable,
                transparent and dependable.
              </p>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-400 sm:text-base">
                Today, that offline experience is being brought to the
                digital world through our own online cab booking platform.
              </p>

              {/* Hero CTAs */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-7 text-xs font-black uppercase tracking-[.12em] text-white shadow-[0_14px_35px_rgba(37,211,102,.20)] transition-all hover:-translate-y-1 hover:bg-[#20bd5b] active:scale-[.98]"
                >
                  <MessageCircle size={19} />
                  Book On WhatsApp
                  <ArrowRight size={15} />
                </a>

                <a
                  href={`tel:${PHONE}`}
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 text-xs font-black uppercase tracking-[.12em] text-[#071A3A] shadow-[0_14px_35px_rgba(0,0,0,.15)] transition-all hover:-translate-y-1 active:scale-[.98]"
                >
                  <Phone size={18} />
                  Call {PHONE_DISPLAY}
                </a>

              </div>

              {/* Hero Trust */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />
                  <span className="text-[9px] font-bold text-slate-300">
                    10+ Years Experience
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />
                  <span className="text-[9px] font-bold text-slate-300">
                    Transparent Fare
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />
                  <span className="text-[9px] font-bold text-slate-300">
                    No Fake Discount Promise
                  </span>
                </div>

              </div>

            </div>

            {/* Hero Brand Card */}

            <div className="relative">

              <div className="relative mx-auto max-w-md overflow-hidden rounded-[34px] border border-white/10 bg-white/[.06] p-5 shadow-[0_30px_100px_rgba(0,0,0,.25)] backdrop-blur-xl sm:p-7">

                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl" />

                {/* Logo */}

                <div className="relative flex items-center justify-center rounded-[26px] bg-white p-5 shadow-xl">
                  <img
                    src="/logo.png"
                    alt="Khatu Rides Travels"
                    className="h-auto max-h-[120px] w-full object-contain"
                  />
                </div>

                {/* Experience */}

                <div className="relative mt-5 rounded-[24px] border border-white/10 bg-[#0B234B] p-5">

                  <div className="flex items-end justify-between gap-4">

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[.2em] text-amber-400">
                        Experience
                      </p>

                      <p className="mt-1 text-5xl font-black tracking-tight text-white">
                        10+
                      </p>

                      <p className="text-xs font-bold text-slate-400">
                        Years in Taxi & Travel Services
                      </p>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A] shadow-lg">
                      <Award size={30} />
                    </div>

                  </div>

                </div>

                {/* Rating */}

                <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-[#071A3A]">
                    <Star
                      size={19}
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black">
                        4.9
                      </span>

                      <span className="text-[9px] font-bold text-slate-400">
                        / 5
                      </span>
                    </div>

                    <p className="text-[8px] font-black uppercase tracking-[.15em] text-slate-400">
                      Google Reviews
                    </p>
                  </div>

                </div>

                {/* Philosophy */}

                <div className="relative mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.15em] text-amber-300">
                    Our Philosophy
                  </p>

                  <p className="mt-1 text-sm font-bold leading-6 text-white">
                    Fair Fare. Premium Service. No Unnecessary Promises.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          EXPERIENCE STRIP
      ============================================================ */}

      <section className="relative -mt-1 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,.08)] sm:grid-cols-2 lg:grid-cols-4">

            {trustCards.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`group p-5 sm:p-6 ${
                    index < trustCards.length - 1
                      ? "border-b border-slate-100 lg:border-b-0 lg:border-r"
                      : ""
                  } ${
                    index === 1
                      ? "sm:border-r sm:border-slate-100 lg:border-r"
                      : ""
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-all group-hover:bg-amber-400 group-hover:text-[#071A3A]">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h2 className="text-sm font-black text-slate-950">
                        {item.title}
                      </h2>

                      <p className="mt-1.5 text-[10px] font-medium leading-5 text-slate-500">
                        {item.text}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ============================================================
          OUR STORY
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid items-start gap-10 lg:grid-cols-[.75fr_1.25fr]">

            {/* Section Intro */}

            <div className="lg:sticky lg:top-24">

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-[9px] font-black uppercase tracking-[.18em] text-amber-700">
                <Sparkles size={13} />
                Our Story
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Built Offline.
                <span className="block text-amber-500">
                  Built With Experience.
                </span>
              </h2>

              <p className="mt-5 text-sm font-medium leading-7 text-slate-500">
                Khatu Rides Travels did not begin as a website. It began
                with real customers, real roads and real travel requirements.
              </p>

            </div>

            {/* Story */}

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.06)] sm:p-8 lg:p-10">

              <div className="space-y-7 text-sm font-medium leading-8 text-slate-600">

                <p>
                  For more than <strong className="font-black text-slate-950">10 years</strong>,
                  Khatu Rides Travels has been serving customers through
                  offline taxi and travel services. Over the years, we have
                  understood that a taxi service is not simply about sending
                  a car from one city to another. It is about being dependable
                  when a customer has somewhere important to reach.
                </p>

                <p>
                  A family travelling between cities, a passenger catching a
                  flight from Raipur Airport, a business traveller travelling
                  for work, or a customer booking a one way taxi from Korba to
                  another city — every journey has a different requirement.
                  Our experience has come from understanding these requirements
                  on the ground.
                </p>

                <p>
                  That experience is now being transformed into a modern
                  <strong className="font-black text-slate-950">
                    {" "}online cab booking platform
                  </strong>
                  , making it easier for customers to explore services,
                  check fares, understand routes and connect with Khatu Rides
                  Travels directly.
                </p>

                <p>
                  The objective is not to become another website competing
                  only on the lowest advertised price. Our objective is to
                  bring the reliability of an experienced local travel business
                  into a better digital booking experience.
                </p>

              </div>

              {/* Story Highlight */}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">

                <div className="rounded-2xl bg-[#071A3A] p-5 text-white">
                  <p className="text-3xl font-black">
                    10+
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Years Experience
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-400 p-5 text-[#071A3A]">
                  <p className="text-3xl font-black">
                    2019
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#071A3A]/60">
                    Coding Journey Started
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5 text-slate-950">
                  <p className="text-3xl font-black">
                    1
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Founder-Built Platform
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FOUNDER STORY
      ============================================================ */}

      <section className="relative overflow-hidden bg-white">

        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">

            {/* Founder Visual */}

            <div className="relative">

              <div className="relative overflow-hidden rounded-[34px] bg-[#071A3A] p-7 shadow-[0_25px_80px_rgba(7,26,58,.18)] sm:p-10">

                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative">

                  <div className="flex h-24 w-24 items-center justify-center rounded-[26px] bg-amber-400 text-[#071A3A] shadow-xl">
                    <Code2 size={42} />
                  </div>

                  <p className="mt-8 text-[9px] font-black uppercase tracking-[.22em] text-amber-400">
                    Founder &amp; Builder
                  </p>

                  <h2 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                    Shatrughan
                    <span className="block text-amber-400">
                      Sharma
                    </span>
                  </h2>

                  <p className="mt-5 text-sm font-medium leading-7 text-slate-300">
                    Founder, Khatu Rides Travels Co.
                  </p>

                  <div className="mt-8 space-y-3">

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                        <Award size={17} />
                      </div>

                      <div>
                        <p className="text-[9px] font-black text-white">
                          Travel Business Experience
                        </p>

                        <p className="text-[8px] text-slate-400">
                          10+ years of offline service
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                        <Code2 size={17} />
                      </div>

                      <div>
                        <p className="text-[9px] font-black text-white">
                          Started Learning Coding
                        </p>

                        <p className="text-[8px] text-slate-400">
                          Self-learning journey started in 2019
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Founder Story */}

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-[9px] font-black uppercase tracking-[.18em] text-[#063B8F]">
                <Code2 size={13} />
                The Person Behind The Platform
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                A Travel Business Owner
                <span className="block text-[#063B8F]">
                  Who Learned To Build His Own Technology.
                </span>
              </h2>

              <div className="mt-6 space-y-5 text-sm font-medium leading-8 text-slate-600">

                <p>
                  Khatu Rides Travels is founded by{" "}
                  <strong className="font-black text-slate-950">
                    Shatrughan Sharma
                  </strong>
                  , whose journey represents the practical and
                  entrepreneurial spirit behind the company.
                </p>

                <p>
                  Shatrughan completed his education through a
                  <strong className="font-black text-slate-950">
                    {" "}Hindi-medium school
                  </strong>
                  and did not come from a traditional software-development
                  background. Instead of seeing that as a limitation, he
                  decided to learn a completely new skill.
                </p>

                <p>
                  In <strong className="font-black text-slate-950">2019</strong>,
                  he started learning coding and gradually began understanding
                  how websites, software and digital platforms could be used
                  to improve a traditional travel business.
                </p>

                <p>
                  Rather than simply purchasing a generic booking website,
                  he chose to understand the technology himself and build a
                  platform around the actual requirements of his travel
                  business and customers.
                </p>

              </div>

              {/* Founder Quote */}

              <div className="mt-8 rounded-[26px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-7">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-[#071A3A]">
                    <Target size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-black leading-6 text-slate-950 sm:text-base">
                      “The technology should make the travel experience
                      better — not make the customer feel confused.”
                    </p>

                    <p className="mt-2 text-[9px] font-black uppercase tracking-[.15em] text-amber-700">
                      Our Approach
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          OFFLINE TO ONLINE
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-slate-600 shadow-sm">
              <Sparkles size={13} className="text-amber-500" />
              From Offline Service To Online Booking
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Experience That Became A Platform
            </h2>

            <p className="mt-5 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              The digital platform is not replacing our offline experience.
              It is making that experience easier to access.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {/* Step 1 */}

            <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">

              <div className="absolute right-5 top-5 text-5xl font-black text-slate-100">
                01
              </div>

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A]">
                <Car size={25} />
              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                The Beginning
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                Real Offline Experience
              </h3>

              <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                More than a decade of working with customers, routes,
                drivers, vehicles and real travel requirements.
              </p>

            </div>

            {/* Step 2 */}

            <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">

              <div className="absolute right-5 top-5 text-5xl font-black text-slate-100">
                02
              </div>

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#063B8F] text-white">
                <Code2 size={25} />
              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-[#063B8F]">
                2019
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                Learning Technology
              </h3>

              <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                The founder began learning coding to understand how
                technology could solve practical problems in the travel
                business.
              </p>

            </div>

            {/* Step 3 */}

            <div className="relative overflow-hidden rounded-[30px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-7 shadow-sm">

              <div className="absolute right-5 top-5 text-5xl font-black text-amber-100">
                03
              </div>

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A]">
                <Navigation size={25} />
              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Today
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                Online Cab Platform
              </h3>

              <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                Customers can now discover services, explore routes,
                estimate fares and connect with Khatu Rides Travels online.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          OUR SERVICE PHILOSOPHY
      ============================================================ */}

      <section className="bg-[#071A3A] text-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-amber-300">
                <ShieldCheck size={13} />
                Our Service Philosophy
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Affordable Does Not Have To Mean
                <span className="block text-amber-400">
                  Compromised.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300">
                We do not want to win a booking simply by displaying the
                lowest possible number. We want to earn the customer’s trust
                by offering a fair fare and delivering a better travel
                experience.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Card */}

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-[#071A3A]">
                  <IndianRupee size={23} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Fair &amp; Affordable Pricing
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  Our aim is to keep taxi fares practical and affordable
                  without reducing the service experience to a race for
                  unrealistic low prices.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <BadgeCheck size={23} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  No Misleading Discounts
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  We do not believe in using a discount headline simply to
                  attract a customer and then surprising them later.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
                  <ShieldCheck size={23} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Transparent Communication
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  Customers should understand their trip, route and fare
                  before confirming a booking.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <Star size={23} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Premium Feel
                </h3>

                <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                  Comfortable travel, better communication and a professional
                  booking experience are part of the value we want customers
                  to receive.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          SERVICES
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div className="max-w-3xl">

              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Taxi &amp; Travel Services
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                One Travel Partner.
                <span className="block text-amber-500">
                  Multiple Ways To Travel.
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
                From a one-way taxi in Chhattisgarh to an airport transfer
                or a long-distance outstation cab, Khatu Rides Travels is
                designed around practical travel requirements.
              </p>

            </div>

            <Link
              href="/fare-calculator"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#071A3A] px-6 py-3.5 text-[9px] font-black uppercase tracking-[.12em] text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#063B8F]"
            >
              <IndianRupee size={14} />
              Check Cab Fare
              <ArrowRight size={13} />
            </Link>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {serviceCards.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,.05)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_50px_rgba(15,23,42,.10)]"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-all group-hover:bg-amber-400 group-hover:text-[#071A3A]">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-lg font-black text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                    {service.text}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-[.14em] text-[#063B8F]">
                    {service.label}
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
          CITY / LOCAL SEO
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-slate-600">
              <MapPin size={13} className="text-amber-500" />
              Service Areas
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Taxi Service Across Chhattisgarh
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              Khatu Rides Travels provides taxi and cab booking services for
              major cities and travel corridors across Chhattisgarh. Whether
              you are looking for a taxi service in Raipur, Korba, Bilaspur,
              Raigarh, Ambikapur, Jagdalpur, Durg or Bhilai, you can connect
              with our team for your travel requirement.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {cityLinks.map((city) => (
              <Link
                key={city.city}
                href={city.href}
                className="group rounded-[24px] border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_15px_40px_rgba(15,23,42,.07)]"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-400 group-hover:text-[#071A3A]">
                    <MapPin size={19} />
                  </div>

                  <ArrowRight
                    size={15}
                    className="mt-2 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-amber-500"
                  />

                </div>

                <h3 className="mt-5 text-base font-black text-slate-950">
                  Taxi Service in {city.city}
                </h3>

                <p className="mt-2 text-[10px] font-medium leading-5 text-slate-500">
                  {city.description}
                </p>

              </Link>
            ))}

          </div>

        </div>
      </section>

      {/* ============================================================
          ROUTES SEO
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="rounded-[34px] border border-slate-200 bg-gradient-to-br from-[#FFF9E8] via-white to-[#F8FAFC] p-6 shadow-[0_20px_70px_rgba(15,23,42,.06)] sm:p-8 lg:p-10">

            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">

              <div>

                <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                  Intercity Cab Booking
                </span>

                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  Popular Taxi Routes
                  <span className="block text-[#063B8F]">
                    We Help Customers Travel Better.
                  </span>
                </h2>

                <p className="mt-5 text-sm font-medium leading-7 text-slate-500">
                  Customers often search for specific route-based taxi
                  services rather than a generic cab. That is why Khatu Rides
                  Travels is building dedicated travel information and booking
                  options for important city-to-city routes.
                </p>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
                  Popular requirements include{" "}
                  <strong className="font-black text-slate-900">
                    Raipur to Korba taxi
                  </strong>
                  ,{" "}
                  <strong className="font-black text-slate-900">
                    Korba to Raipur taxi
                  </strong>
                  ,{" "}
                  <strong className="font-black text-slate-900">
                    Raipur to Bilaspur taxi
                  </strong>
                  ,{" "}
                  <strong className="font-black text-slate-900">
                    Raipur to Raigarh taxi
                  </strong>
                  and Raipur Airport taxi services.
                </p>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {routeLinks.map((route) => (
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
                        {route.label}
                      </span>

                    </div>

                    <ArrowRight
                      size={14}
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
          VALUES
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              What We Stand For
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              The Standards Behind Our Service
            </h2>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-emerald-50 text-emerald-600">
                <ShieldCheck size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Safe Travel
              </h3>

              <p className="mt-2 text-[10px] font-medium leading-5 text-slate-500">
                We want every customer to feel confident about their journey.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-blue-50 text-[#063B8F]">
                <Clock3 size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Responsible Service
              </h3>

              <p className="mt-2 text-[10px] font-medium leading-5 text-slate-500">
                Communication and responsibility matter as much as the vehicle.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-amber-50 text-amber-600">
                <IndianRupee size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Fair Pricing
              </h3>

              <p className="mt-2 text-[10px] font-medium leading-5 text-slate-500">
                Affordable fares without misleading discount messaging.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-orange-50 text-orange-600">
                <Star size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Customer Trust
              </h3>

              <p className="mt-2 text-[10px] font-medium leading-5 text-slate-500">
                Long-term trust is more valuable to us than one booking.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          DETAILED SEO CONTENT
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="prose prose-slate max-w-none">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              About Our Taxi Service
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A Trusted Taxi Service For Chhattisgarh Travel
            </h2>

            <div className="mt-7 space-y-6 text-sm font-medium leading-8 text-slate-600 sm:text-base">

              <p>
                Khatu Rides Travels is a taxi and travel service provider
                serving customers across Chhattisgarh and nearby destinations.
                With more than 10 years of offline travel experience, we
                understand the practical requirements involved in local,
                intercity, airport and outstation travel.
              </p>

              <p>
                Our services include{" "}
                <strong className="font-black text-slate-950">
                  one way taxi, one way cab, round trip cab, airport taxi,
                  outstation cab and local taxi services
                </strong>
                . Customers looking for a{" "}
                <strong className="font-black text-slate-950">
                  taxi service in Chhattisgarh
                </strong>{" "}
                can connect with Khatu Rides Travels for travel requirements
                from major cities such as Raipur, Korba, Bilaspur, Raigarh,
                Ambikapur, Jagdalpur, Durg and Bhilai.
              </p>

              <p>
                For airport travel, we provide airport pickup and drop
                assistance including{" "}
                <strong className="font-black text-slate-950">
                  Raipur Airport taxi
                </strong>{" "}
                requirements. For intercity travel, customers can enquire
                about route-specific services such as{" "}
                <strong className="font-black text-slate-950">
                  Raipur to Korba taxi, Korba to Raipur taxi, Raipur to
                  Bilaspur taxi, Bilaspur to Raipur taxi and Raipur to
                  Raigarh taxi
                </strong>
                .
              </p>

              <p>
                Our approach to pricing is straightforward. We do not want
                customers to choose us only because of an unrealistic
                discount headline. Instead, our objective is to offer an
                affordable and practical fare while maintaining a premium
                experience, clear communication and transparent trip details.
              </p>

              <p>
                The launch of our online platform is the next step in that
                journey. Customers can now discover Khatu Rides Travels
                online, explore taxi services and routes, use the fare
                calculator and contact the team directly for booking
                assistance.
              </p>

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
              About Khatu Rides Travels
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
          FINAL CTA
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
            Ready When You Are
          </p>

          <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Book Your Next Journey With
            <span className="block text-amber-400">
              Khatu Rides Travels.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
            One way taxi • Round trip cab • Airport taxi • Outstation cab
            • Local &amp; intercity travel
          </p>

          <p className="mx-auto mt-2 max-w-xl text-xs font-medium leading-6 text-slate-400">
            Fair fare. Comfortable travel. Direct booking support.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 text-xs font-black uppercase tracking-[.12em] text-white shadow-[0_15px_40px_rgba(37,211,102,.20)] transition-all hover:-translate-y-1 hover:bg-[#20bd5b] active:scale-[.98]"
            >
              <MessageCircle size={19} />
              WhatsApp Booking
              <ArrowRight size={15} />
            </a>

            <a
              href={`tel:${PHONE}`}
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-400 px-8 text-xs font-black uppercase tracking-[.12em] text-[#071A3A] shadow-[0_15px_40px_rgba(245,196,0,.18)] transition-all hover:-translate-y-1 hover:bg-amber-300 active:scale-[.98]"
            >
              <Phone size={18} />
              Call For Booking
            </a>

            <Link
              href="/fare-calculator"
              className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-8 text-xs font-black uppercase tracking-[.12em] text-white backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/15 active:scale-[.98]"
            >
              <IndianRupee size={18} />
              Check Fare
            </Link>

          </div>

          {/* Bottom Trust */}

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-7">

            <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />
              10+ Years Experience
            </span>

            <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
              <IndianRupee
                size={14}
                className="text-amber-400"
              />
              Transparent Pricing
            </span>

            <span className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
              <Navigation
                size={14}
                className="text-blue-400"
              />
              Chhattisgarh Routes
            </span>

          </div>

        </div>
      </section>

    </main>
  );
}