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
  Luggage,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Fleet | Cars & Cabs for Taxi Booking in Chhattisgarh | Khatu Rides Travels",

  description:
    "Explore the Khatu Rides Travels fleet for taxi booking in Chhattisgarh. Choose from Toyota Crysta, Maruti Ertiga, Dzire and Scorpio for airport transfers, one-way taxi, round trips, outstation travel and family trips from Raipur, Korba, Bilaspur, Raigarh and nearby cities.",

  keywords: [
    "Khatu Rides Travels fleet",
    "Khatu Rides Travels cars",
    "cab fleet Chhattisgarh",
    "taxi fleet Chhattisgarh",
    "cars for taxi service Chhattisgarh",
    "taxi service in Chhattisgarh",
    "cab service in Chhattisgarh",
    "taxi booking Chhattisgarh",
    "cab booking Chhattisgarh",
    "car rental Chhattisgarh",
    "Toyota Crysta taxi Chhattisgarh",
    "Toyota Crysta cab Chhattisgarh",
    "Toyota Crysta taxi Raipur",
    "Toyota Crysta taxi Korba",
    "Toyota Crysta cab Bilaspur",
    "Toyota Crysta outstation cab",
    "Ertiga taxi Chhattisgarh",
    "Ertiga cab Chhattisgarh",
    "Ertiga taxi Raipur",
    "Ertiga taxi Korba",
    "Maruti Dzire taxi Chhattisgarh",
    "Dzire cab Chhattisgarh",
    "Dzire taxi Raipur",
    "Dzire taxi Korba",
    "Scorpio taxi Chhattisgarh",
    "Scorpio cab Chhattisgarh",
    "Scorpio taxi Raipur",
    "Scorpio outstation cab",
    "airport taxi Chhattisgarh",
    "Raipur airport taxi",
    "one way taxi Chhattisgarh",
    "round trip cab Chhattisgarh",
    "outstation cab Chhattisgarh",
    "family taxi Chhattisgarh",
    "premium taxi Chhattisgarh",
    "corporate cab Chhattisgarh",
    "Raipur taxi booking",
    "Korba taxi booking",
    "Bilaspur taxi booking",
    "Raigarh taxi booking",
    "Ambikapur taxi booking",
    "Jagdalpur taxi booking",
  ],

  alternates: {
    canonical: "/fleet",
  },

  openGraph: {
    title:
      "Our Fleet | Premium & Comfortable Cabs | Khatu Rides Travels",
    description:
      "Explore our sedan, SUV and premium cab options for airport, one-way, round trip and outstation travel across Chhattisgarh.",
    type: "website",
  },
};

const PHONE = "+919244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

const whatsappMessage = encodeURIComponent(
  "Hello Khatu Rides Travels, I want to book a cab. Please help me choose a suitable vehicle for my journey."
);

const vehicles = [
  {
    name: "Toyota Crysta",
    category: "Premium MUV",
    image: "/crysta.png",
    heroImage: "/crysta_hero.png",
    seats: "6+1",
    luggage: "3–4 Bags",
    ideal:
      "Premium family travel, corporate journeys, airport transfers and long-distance outstation trips.",
    description:
      "A spacious and premium choice for customers who want extra comfort, legroom and a refined travel experience.",
    features: [
      "Premium Comfort",
      "Spacious Cabin",
      "Long Distance",
      "Family Friendly",
    ],
    useCases: [
      "Airport Transfers",
      "Outstation Travel",
      "Family Trips",
      "Corporate Travel",
    ],
    accent: "amber",
  },
  {
    name: "Maruti Ertiga",
    category: "Family MUV",
    image: "/ertiga.png",
    heroImage: "/ertiga.png",
    seats: "6+1",
    luggage: "3–4 Bags",
    ideal:
      "Family trips, airport transfers, city-to-city travel and comfortable group journeys.",
    description:
      "A practical family-friendly cab offering a good balance of space, comfort and everyday travel convenience.",
    features: [
      "Family Friendly",
      "Spacious",
      "Comfortable",
      "Value Focused",
    ],
    useCases: [
      "Family Travel",
      "Airport Taxi",
      "One Way Taxi",
      "Round Trips",
    ],
    accent: "blue",
  },
  {
    name: "Maruti Dzire",
    category: "Comfort Sedan",
    image: "/dezire.png",
    heroImage: "/dezire.png",
    seats: "4+1",
    luggage: "2–3 Bags",
    ideal:
      "Couples, small families, airport transfers and comfortable intercity one-way travel.",
    description:
      "A comfortable sedan option for customers looking for a practical and smooth taxi experience for smaller groups.",
    features: [
      "Comfort Sedan",
      "Easy City Travel",
      "Airport Friendly",
      "Small Groups",
    ],
    useCases: [
      "One Way Taxi",
      "Airport Transfer",
      "Business Travel",
      "City Travel",
    ],
    accent: "slate",
  },
  {
    name: "Mahindra Scorpio",
    category: "Premium SUV",
    image: "/scorpio.png",
    heroImage: "/scorpio.png",
    seats: "6+1",
    luggage: "3–4 Bags",
    ideal:
      "Outstation journeys, family travel and customers looking for a strong SUV experience.",
    description:
      "A capable SUV option for longer journeys, family travel and routes where customers prefer SUV comfort and road presence.",
    features: [
      "Premium SUV",
      "Strong Road Presence",
      "Outstation Ready",
      "Family Travel",
    ],
    useCases: [
      "Outstation Cab",
      "Family Trips",
      "Long Routes",
      "Intercity Travel",
    ],
    accent: "orange",
  },
];

const categories = [
  {
    icon: Car,
    title: "Comfort Sedans",
    description:
      "Ideal for smaller groups, airport transfers, business travel and one-way intercity taxi bookings.",
  },
  {
    icon: Users,
    title: "Family MUVs",
    description:
      "More cabin space for families and groups travelling between cities or to airports.",
  },
  {
    icon: ShieldCheck,
    title: "Premium SUVs",
    description:
      "A strong choice for longer journeys, family travel and customers seeking a premium SUV experience.",
  },
];

const travelNeeds = [
  {
    icon: Plane,
    title: "Airport Transfers",
    text:
      "Comfortable vehicle options for airport pickup and drop requirements, including Raipur Airport travel.",
  },
  {
    icon: Navigation,
    title: "One Way Taxi",
    text:
      "Choose a suitable sedan, MUV or SUV for your one-way intercity journey.",
  },
  {
    icon: Route,
    title: "Round Trip",
    text:
      "Practical and comfortable cab options for return journeys and multi-day travel.",
  },
  {
    icon: MapPin,
    title: "Outstation Travel",
    text:
      "Choose spacious vehicles for longer routes across Chhattisgarh and nearby destinations.",
  },
];

const cities = [
  "Raipur",
  "Korba",
  "Bilaspur",
  "Raigarh",
  "Ambikapur",
  "Jagdalpur",
  "Durg",
  "Bhilai",
];

const routes = [
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

const faqs = [
  {
    question:
      "Which cars are available with Khatu Rides Travels?",
    answer:
      "Our current fleet presentation includes Toyota Crysta, Maruti Ertiga, Maruti Dzire and Mahindra Scorpio. Vehicle availability can depend on the travel date, route and booking requirements, so customers should confirm availability before booking.",
  },
  {
    question:
      "Which is the best car for family travel in Chhattisgarh?",
    answer:
      "For family travel, customers generally prefer spacious MUV or SUV options such as Toyota Crysta, Maruti Ertiga or Mahindra Scorpio. The right vehicle depends on passenger count, luggage and journey distance.",
  },
  {
    question:
      "Which car is suitable for Raipur Airport taxi service?",
    answer:
      "For Raipur Airport transfers, both sedan and larger MUV options can be suitable. Maruti Dzire works well for smaller groups, while Ertiga or Crysta can be considered when more passenger or luggage space is required.",
  },
  {
    question:
      "Can I book Toyota Crysta for outstation travel?",
    answer:
      "Yes, Toyota Crysta is a suitable premium option for many family, corporate and outstation travel requirements. Contact Khatu Rides Travels with your route and travel date to confirm availability and fare.",
  },
  {
    question:
      "Do you provide one-way taxi services?",
    answer:
      "Yes. Khatu Rides Travels provides one-way taxi services for selected intercity routes across Chhattisgarh and nearby destinations. Fare and availability depend on the route and vehicle selected.",
  },
  {
    question:
      "Can I choose a specific vehicle for my taxi booking?",
    answer:
      "Customers can request a preferred vehicle category or model. Final vehicle allocation depends on availability for the requested date, route and travel requirement.",
  },
];

export default function FleetPage() {
  const fleetSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Khatu Rides Travels Fleet",
    description:
      "Cab and taxi fleet available for airport transfers, one-way taxi, round trips and outstation travel across Chhattisgarh.",
    itemListElement: vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Vehicle",
        name: vehicle.name,
        description: vehicle.description,
      },
    })),
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
          __html: JSON.stringify(fleetSchema),
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
          <div className="absolute -right-48 -top-48 h-[620px] w-[620px] rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute -bottom-56 -left-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(245,196,0,0.12),transparent_35%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24">

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
              Fleet
            </span>

          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">

            {/* Content */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2.5">

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[#071A3A]">
                  <Car size={13} />
                </span>

                <span className="text-[9px] font-black uppercase tracking-[.18em] text-amber-300">
                  Our Cab Fleet
                </span>

              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-[-.035em] sm:text-5xl lg:text-7xl">
                The Right Cab
                <span className="block text-amber-400">
                  For Every Journey.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
                Explore the Khatu Rides Travels fleet of comfortable
                sedans, spacious MUVs and premium SUVs for taxi
                bookings across Chhattisgarh.
              </p>

              <p className="mt-4 max-w-2xl text-xs font-medium leading-6 text-slate-400">
                From Raipur Airport transfers and one-way taxi bookings
                to family trips, corporate travel and long-distance
                outstation journeys — choose a vehicle that fits your
                travel requirement.
              </p>

              {/* CTA */}

              <div className="mt-8 grid gap-3 sm:flex">

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-7 text-xs font-black uppercase tracking-[.12em] text-white shadow-[0_15px_40px_rgba(37,211,102,.18)] transition-all hover:-translate-y-1 hover:bg-[#20bd5b]"
                >
                  <MessageCircle size={19} />
                  Book Your Cab
                  <ArrowRight size={15} />
                </a>

                <a
                  href={`tel:${PHONE}`}
                  className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-400 px-7 text-xs font-black uppercase tracking-[.12em] text-[#071A3A] shadow-[0_15px_40px_rgba(245,196,0,.16)] transition-all hover:-translate-y-1 hover:bg-amber-300"
                >
                  <Phone size={18} />
                  Call For Booking
                </a>

              </div>

              {/* Trust */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">

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
                  <BadgeCheck
                    size={14}
                    className="text-blue-400"
                  />
                  Direct Booking
                </span>

              </div>

            </div>

            {/* Hero Vehicle */}

            <div className="relative">

              <div className="absolute inset-x-10 bottom-4 h-16 rounded-full bg-black/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[.06] p-4 shadow-[0_35px_100px_rgba(0,0,0,.28)] backdrop-blur-xl sm:p-6">

                <div className="rounded-[28px] bg-gradient-to-b from-white/10 to-white/[.02] p-3">

                  <img
                    src="/crysta_hero.png"
                    alt="Toyota Crysta premium taxi cab Khatu Rides Travels"
                    className="h-auto w-full object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,.35)]"
                  />

                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[.18em] text-amber-400">
                      Featured Fleet
                    </p>

                    <p className="mt-1 text-lg font-black">
                      Toyota Crysta
                    </p>

                    <p className="text-[9px] font-medium text-slate-400">
                      Premium MUV • 6+1 Seating
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-[#071A3A]">
                    <Car size={19} />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FLEET INTRO / TRUST STRIP
      ============================================================ */}

      <section className="relative bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,.06)] sm:grid-cols-3">

            <div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:border-b-0 sm:border-r">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Award size={21} />
              </div>

              <div>
                <p className="text-xl font-black">
                  10+
                </p>

                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  Years Experience
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:border-b-0 sm:border-r">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#063B8F]">
                <Car size={21} />
              </div>

              <div>
                <p className="text-xl font-black">
                  Multiple
                </p>

                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  Vehicle Categories
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 p-5">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="text-xl font-black">
                  Direct
                </p>

                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  Booking Support
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          VEHICLE CATEGORIES
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-slate-600 shadow-sm">
              <Sparkles
                size={13}
                className="text-amber-500"
              />
              Choose Your Travel Style
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              A Fleet Built Around
              <span className="text-[#063B8F]">
                {" "}Different Journeys
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              Different journeys need different vehicles. Choose the
              vehicle category that best matches your passengers,
              luggage, route and comfort preference.
            </p>

          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,.04)]"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {category.title}
                  </h3>

                  <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                    {category.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ============================================================
          MAIN FLEET
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div className="max-w-3xl">

              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Explore Our Vehicles
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Our Taxi &amp; Cab Fleet
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
                Select a vehicle according to your group size, luggage,
                route and desired comfort level. Contact us to confirm
                the vehicle and availability for your journey.
              </p>

            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 md:flex">
              <Car
                size={16}
                className="text-amber-600"
              />

              <span className="text-[8px] font-black uppercase tracking-[.14em] text-amber-700">
                Premium • Comfortable • Practical
              </span>
            </div>

          </div>

          <div className="mt-12 grid gap-7 lg:grid-cols-2">

            {vehicles.map((vehicle) => (
              <FleetVehicleCard
                key={vehicle.name}
                vehicle={vehicle}
                whatsappMessage={whatsappMessage}
              />
            ))}

          </div>

        </div>
      </section>

      {/* ============================================================
          TRAVEL NEEDS
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="max-w-3xl">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Travel With The Right Vehicle
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Whatever The Journey,
              <span className="block text-[#063B8F]">
                We Have An Option For You.
              </span>
            </h2>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {travelNeeds.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#071A3A] text-amber-400">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
                    {item.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ============================================================
          WHY OUR FLEET
      ============================================================ */}

      <section className="bg-[#071A3A] text-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-amber-300">
                <ShieldCheck size={13} />
                Our Service Philosophy
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Affordable Travel.
                <span className="block text-amber-400">
                  Premium Experience.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300">
                Khatu Rides Travels does not try to win customers with
                unrealistic discount claims. Our focus is on providing
                a fair fare, dependable service and a comfortable travel
                experience backed by more than 10 years of offline
                travel experience.
              </p>

              <p className="mt-4 max-w-xl text-xs font-medium leading-6 text-slate-400">
                The vehicle you choose matters — but so does the service
                behind it. That is why we focus on communication,
                transparency and customer support throughout the booking
                process.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <TrustItem
                icon={ShieldCheck}
                title="Transparent Pricing"
                text="Clear communication about the applicable trip fare instead of misleading discount messaging."
              />

              <TrustItem
                icon={Award}
                title="10+ Years Experience"
                text="A decade of practical offline taxi and travel service experience."
              />

              <TrustItem
                icon={Car}
                title="Vehicle Choice"
                text="Different vehicle categories for small groups, families, airport travel and longer journeys."
              />

              <TrustItem
                icon={Users}
                title="Customer First"
                text="Direct support for booking questions, route requirements and vehicle preferences."
              />

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          CITY SEO
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

            <div>

              <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                Chhattisgarh Taxi Service
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Taxi &amp; Cab Services
                <span className="block text-[#063B8F]">
                  Across Chhattisgarh
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
                Our fleet can be used for taxi bookings, airport
                transfers, one-way travel, round trips and outstation
                journeys from major cities across Chhattisgarh.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">

                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-xs font-semibold leading-6 text-amber-800">
                  Vehicle availability may vary by city, route and
                  travel date. Contact us to confirm your preferred cab.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {cities.map((city) => (
                <div
                  key={city}
                  className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 text-center transition hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-md"
                >

                  <MapPin
                    size={18}
                    className="mx-auto text-amber-500"
                  />

                  <p className="mt-3 text-xs font-black text-slate-800">
                    {city}
                  </p>

                  <p className="mt-1 text-[7px] font-bold uppercase tracking-wider text-slate-400">
                    Taxi Service
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          ROUTE SEO
      ============================================================ */}

      <section className="bg-[#F8FAFC]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

              <div>

                <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
                  Popular Taxi Routes
                </span>

                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Planning An
                  <span className="text-[#063B8F]">
                    {" "}Intercity Journey?
                  </span>
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
                  Explore route-specific taxi information or contact us
                  directly for vehicle availability and booking assistance.
                </p>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#071A3A] px-5 py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#063B8F]"
                >
                  Ask About Your Route
                  <ArrowRight size={13} />
                </a>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-amber-300 hover:bg-white hover:shadow-sm"
                  >

                    <div className="flex items-center gap-3">

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Route size={16} />
                      </span>

                      <span className="text-[10px] font-black text-slate-800">
                        {route.title}
                      </span>

                    </div>

                    <ChevronRight
                      size={14}
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-500"
                    />

                  </Link>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FAQ
      ============================================================ */}

      <section className="bg-white">

        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-[9px] font-black uppercase tracking-[.2em] text-amber-600">
              Fleet FAQ
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Questions About Our Cabs
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
              Find quick answers about vehicle options, seating,
              airport travel, one-way taxi and outstation bookings.
            </p>

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

          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute -bottom-48 -right-32 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-amber-400 text-[#071A3A] shadow-[0_15px_40px_rgba(245,196,0,.20)]">
            <Car size={28} />
          </div>

          <p className="mt-6 text-[9px] font-black uppercase tracking-[.22em] text-amber-400">
            Choose Your Ride
          </p>

          <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Found The Right Vehicle?
            <span className="block text-amber-400">
              Let&apos;s Book Your Journey.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
            Tell us your pickup location, destination, travel date,
            passenger count and preferred vehicle. Our team will help
            you with the booking.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
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
              Call {PHONE_DISPLAY}
            </a>

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

/* ================================================================
   FLEET VEHICLE CARD
================================================================ */

function FleetVehicleCard({
  vehicle,
  whatsappMessage,
}: {
  vehicle: (typeof vehicles)[number];
  whatsappMessage: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_12px_45px_rgba(15,23,42,.06)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_25px_70px_rgba(15,23,42,.11)]">

      {/* Vehicle Image */}

      <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 to-white">

        <div className="absolute left-4 top-4 z-10">

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-[8px] font-black uppercase tracking-[.14em] text-slate-800 shadow-lg backdrop-blur">
            <Star
              size={11}
              className="fill-amber-400 text-amber-400"
            />
            {vehicle.category}
          </span>

        </div>

        <div className="absolute right-4 top-4 z-10">

          <span className="rounded-xl bg-[#071A3A] px-3 py-2 text-[8px] font-black uppercase tracking-wider text-amber-400 shadow-lg">
            Available On Booking
          </span>

        </div>

        <div className="flex min-h-[250px] items-center justify-center px-5 pt-10 sm:min-h-[285px]">

          <img
            src={vehicle.image}
            alt={`${vehicle.name} taxi cab for ${vehicle.category.toLowerCase()} service in Chhattisgarh`}
            className="max-h-[235px] w-full object-contain drop-shadow-[0_20px_20px_rgba(15,23,42,.14)] transition-transform duration-500 group-hover:scale-[1.035] sm:max-h-[265px]"
          />

        </div>

      </div>

      {/* Details */}

      <div className="p-6 sm:p-7">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-[9px] font-black uppercase tracking-[.18em] text-amber-600">
              {vehicle.category}
            </p>

            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              {vehicle.name}
            </h3>

          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071A3A] text-amber-400">
            <Car size={19} />
          </div>

        </div>

        {/* Specs */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">

            <Users
              size={15}
              className="text-[#063B8F]"
            />

            <div>
              <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                Seating
              </p>

              <p className="text-[10px] font-black text-slate-800">
                {vehicle.seats}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">

            <Luggage
              size={15}
              className="text-[#063B8F]"
            />

            <div>
              <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                Luggage
              </p>

              <p className="text-[10px] font-black text-slate-800">
                {vehicle.luggage}
              </p>
            </div>

          </div>

        </div>

        {/* Description */}

        <p className="mt-5 text-xs font-medium leading-6 text-slate-500">
          {vehicle.description}
        </p>

        {/* Ideal For */}

        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">

          <p className="text-[8px] font-black uppercase tracking-[.16em] text-amber-700">
            Best Suited For
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
            {vehicle.ideal}
          </p>

        </div>

        {/* Feature Chips */}

        <div className="mt-5 flex flex-wrap gap-2">

          {vehicle.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[7px] font-black uppercase tracking-wider text-slate-500"
            >
              <CheckCircle2
                size={10}
                className="text-emerald-500"
              />
              {feature}
            </span>
          ))}

        </div>

        {/* Use Cases */}

        <div className="mt-5">

          <p className="text-[8px] font-black uppercase tracking-[.16em] text-slate-400">
            Suitable For
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">

            {vehicle.useCases.map((item) => (
              <span
                key={item}
                className="text-[9px] font-bold text-slate-600"
              >
                • {item}
              </span>
            ))}

          </div>

        </div>

        {/* CTAs */}

        <div className="mt-6 grid gap-2 sm:grid-cols-2">

          <a
            href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-[8px] font-black uppercase tracking-wider text-white transition hover:bg-[#20bd5b]"
          >
            <MessageCircle size={14} />
            Book This Cab
          </a>

          <a
            href={`tel:${PHONE}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-4 text-[8px] font-black uppercase tracking-wider text-white transition hover:bg-[#052f70]"
          >
            <Phone size={14} />
            Call To Enquire
          </a>

        </div>

      </div>

    </article>
  );
}

/* ================================================================
   TRUST ITEM
================================================================ */

function TrustItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[.05] p-6">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-400">
        <Icon size={21} />
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
        {text}
      </p>

    </div>
  );
}