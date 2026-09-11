"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  BriefcaseBusiness,
  Luggage,
  Route,
  Headphones,
} from "lucide-react";

import ReviewsCarousel from "./ReviewsCarousel";

/* ============================================================
   BUSINESS CONFIG
============================================================ */

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

/* ============================================================
   ROUTE TYPES
============================================================ */

type RouteData = {
  title?: string;
  h1: string;
  desc: string;
  sectionTitle: string;
  sectionParagraphs: string[];
  from?: string;
  to?: string;
  slug?: string;
  distanceText?: string;
};

type RoutePageClientProps = {
  slug: string;
  route: RouteData;
};

/* ============================================================
   VEHICLE DATA
============================================================ */

const VEHICLES = [
  {
    name: "Maruti Dzire",
    image: "/dezire.png",
    category: "Comfort Sedan",
    seats: "4+1",
    luggage: "2–3 Bags",
    description:
      "A practical and comfortable sedan for couples, small families, business travellers and comfortable one-way taxi journeys.",
    bestFor: [
      "One Way Taxi",
      "Airport Transfer",
      "Business Travel",
      "Small Families",
    ],
  },
  {
    name: "Maruti Ertiga",
    image: "/ertiga.png",
    category: "Family MUV",
    seats: "6+1",
    luggage: "4–5 Bags",
    description:
      "A spacious family cab for group travel, round trips, longer journeys and passengers travelling with extra luggage.",
    bestFor: [
      "Family Travel",
      "Round Trip",
      "Group Travel",
      "Extra Luggage",
    ],
  },
  {
    name: "Toyota Innova Crysta",
    image: "/crysta.png",
    category: "Premium SUV",
    seats: "6+1",
    luggage: "5+ Bags",
    description:
      "Our premium travel option for customers looking for extra comfort, spacious seating and a more refined intercity cab experience.",
    bestFor: [
      "Premium Taxi",
      "Corporate Travel",
      "Long Distance",
      "Executive Travel",
    ],
  },
] as const;

/* ============================================================
   28 KEY SERVICE DESTINATIONS
   Used naturally inside route content.
============================================================ */

const SERVICE_DESTINATIONS = [
  "Raipur",
  "Korba",
  "Bilaspur",
  "Raigarh",
  "Ambikapur",
  "Jagdalpur",
  "Jharsuguda",
  "Sambalpur",
  "Durg",
  "Bhilai",
  "Rajnandgaon",
  "Dhamtari",
  "Mahasamund",
  "Kawardha",
  "Janjgir",
  "Champa",
  "Balod",
  "Bemetara",
  "Kanker",
  "Kondagaon",
  "Dantewada",
  "Sukma",
  "Bijapur",
  "Narayanpur",
  "Gariaband",
  "Baloda Bazar",
  "Mungeli",
  "Surajpur",
] as const;

/* ============================================================
   POPULAR ROUTE LINKS
   Only use routes that are known/common in the existing website.
============================================================ */

const POPULAR_ROUTE_LINKS = [
  {
    label: "Raipur to Korba Taxi",
    href: "/routes/raipur-to-korba-taxi",
  },
  {
    label: "Raipur to Bilaspur Taxi",
    href: "/routes/raipur-to-bilaspur-taxi",
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

/* ============================================================
   HELPERS
============================================================ */

function cleanCity(value?: string) {
  if (!value) return "";

  return value
    .replace(/,.*$/g, "")
    .replace(/\btaxi\b/gi, "")
    .replace(/\bcab\b/gi, "")
    .replace(/\bservice\b/gi, "")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function RoutePageClient({
  slug,
  route,
}: RoutePageClientProps) {
  const [contactOpen, setContactOpen] = useState(false);

  const routeFrom = cleanCity(
    route.from || route.h1.split(" to ")[0] || "Korba"
  );

  const routeTo = cleanCity(
    route.to ||
      route.h1
        .split(" to ")[1]
        ?.replace(/taxi|cab|service/gi, "") ||
      "Raipur"
  );

  const routeSlug =
    slug ||
    route.slug ||
    `${slugify(routeFrom)}-to-${slugify(routeTo)}-taxi`;

  const reverseSlug = `${slugify(routeTo)}-to-${slugify(routeFrom)}-taxi`;

  const whatsappMessage = `Hello Khatu Rides Travels Co.,

I want to enquire about ${routeFrom} to ${routeTo} taxi service.

Pickup: ${routeFrom}
Drop: ${routeTo}

Please share the available cab options and booking details.

Thank you.`;

  /* ============================================================
     ROUTE KEYWORDS
     Natural semantic coverage rather than keyword stuffing.
  ============================================================ */

  const routeIntentTerms = useMemo(
    () => [
      `${routeFrom} to ${routeTo} taxi`,
      `${routeFrom} to ${routeTo} cab`,
      `${routeFrom} to ${routeTo} taxi service`,
      `${routeFrom} to ${routeTo} cab service`,
      `${routeFrom} to ${routeTo} taxi booking`,
      `${routeFrom} to ${routeTo} cab booking`,
      `${routeFrom} to ${routeTo} one way taxi`,
      `${routeFrom} to ${routeTo} one way cab`,
      `${routeFrom} to ${routeTo} round trip taxi`,
      `${routeFrom} to ${routeTo} round trip cab`,
      `${routeFrom} to ${routeTo} outstation taxi`,
      `${routeFrom} to ${routeTo} outstation cab`,
      `${routeFrom} to ${routeTo} cab hire`,
      `${routeFrom} to ${routeTo} taxi booking online`,
    ],
    [routeFrom, routeTo]
  );

  /* ============================================================
     FAQ
  ============================================================ */

  const faqItems = useMemo(
    () => [
      {
        question: `How can I book a ${routeFrom} to ${routeTo} taxi?`,
        answer: `You can enquire about a ${routeFrom} to ${routeTo} taxi directly through WhatsApp or call Khatu Rides Travels. Share your pickup point, destination, travel date, passenger count and preferred cab type, and our booking team can assist you with the available option.`,
      },
      {
        question: `Is ${routeFrom} to ${routeTo} one way cab service available?`,
        answer: `Yes. Khatu Rides Travels provides intercity one-way cab and taxi booking for customers travelling from ${routeFrom} to ${routeTo}, subject to vehicle and schedule availability.`,
      },
      {
        question: `Can I book a ${routeFrom} to ${routeTo} round trip taxi?`,
        answer: `Yes. Customers travelling for family visits, business trips, personal work and longer stays can enquire about ${routeFrom} to ${routeTo} round trip taxi service.`,
      },
      {
        question: `Which cars are available for ${routeFrom} to ${routeTo} taxi service?`,
        answer: `Depending on availability and your travel requirement, Khatu Rides Travels offers comfortable sedan, family MUV and premium SUV options including Maruti Dzire, Maruti Ertiga and Toyota Innova Crysta.`,
      },
      {
        question: `Can I book an outstation cab from ${routeFrom} to ${routeTo}?`,
        answer: `Yes. ${routeFrom} to ${routeTo} travel can be booked as an outstation cab journey. Customers can choose a suitable vehicle according to passenger count, luggage and comfort requirements.`,
      },
      {
        question: `Do you provide pickup and drop from nearby locations?`,
        answer: `Khatu Rides Travels serves major cities and nearby pickup and drop locations across Chhattisgarh and neighbouring travel corridors. Share your exact pickup and drop point with the booking team to confirm service availability.`,
      },
      {
        question: `How do I get the fare for ${routeFrom} to ${routeTo} taxi?`,
        answer: `Taxi fare depends on the selected vehicle, trip type, route, travel schedule and applicable journey requirements. Contact Khatu Rides Travels with your complete trip details for the applicable fare information.`,
      },
    ],
    [routeFrom, routeTo]
  );

  /* ============================================================
     STRUCTURED DATA
  ============================================================ */

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${routeFrom} to ${routeTo} Taxi Service`,
    serviceType: `${routeFrom} to ${routeTo} taxi and cab booking`,
    description: `Intercity taxi and cab service from ${routeFrom} to ${routeTo}, including one-way taxi, round trip cab, outstation travel and premium vehicle options.`,
    areaServed: [
      {
        "@type": "City",
        name: routeFrom,
      },
      {
        "@type": "City",
        name: routeTo,
      },
      {
        "@type": "State",
        name: "Chhattisgarh",
      },
    ],
    provider: {
      "@type": "LocalBusiness",
      name: "Khatu Rides Travels Co.",
      telephone: "+91 92441 37353",
      url: "https://khaturidescg.in",
      image: "https://khaturidescg.in/logo.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Korba",
        addressRegion: "Chhattisgarh",
        addressCountry: "IN",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${routeFrom} to ${routeTo} Cab Options`,
      itemListElement: VEHICLES.map((vehicle) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${vehicle.name} ${routeFrom} to ${routeTo} Taxi`,
        },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://khaturidescg.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Taxi Routes",
        item: "https://khaturidescg.in/routes",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${routeFrom} to ${routeTo} Taxi`,
        item: `https://khaturidescg.in/routes/${routeSlug}`,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Khatu Rides Travels Co.",
    url: "https://khaturidescg.in",
    telephone: "+91 92441 37353",
    image: "https://khaturidescg.in/logo.png",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Korba",
      addressRegion: "Chhattisgarh",
      addressCountry: "IN",
    },
    areaServed: SERVICE_DESTINATIONS.map((city) => ({
      "@type": "City",
      name: city,
    })),
  };

  return (
    <>
      {/* ============================================================
          SCHEMA
      ============================================================ */}

      <Script
        id="route-service-schema"
        type="application/ld+json"
      >
        {JSON.stringify(serviceSchema)}
      </Script>

      <Script
        id="route-faq-schema"
        type="application/ld+json"
      >
        {JSON.stringify(faqSchema)}
      </Script>

      <Script
        id="route-breadcrumb-schema"
        type="application/ld+json"
      >
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <Script
        id="route-local-business-schema"
        type="application/ld+json"
      >
        {JSON.stringify(localBusinessSchema)}
      </Script>

      {/* ============================================================
          PAGE
      ============================================================ */}

      <main className="min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-950">

        {/* ========================================================
            HERO
        ======================================================== */}

        <section className="relative overflow-hidden bg-[#071A3A] text-white">

          {/* Background */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,59,143,.35),transparent_40%)]" />

          <div className="absolute right-[-100px] top-[-120px] h-[300px] w-[300px] rounded-full border border-white/5" />

          <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] rounded-full border border-white/5" />

          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 sm:pb-20 lg:px-10">

            {/* TOP BAR */}

            <div className="flex items-center justify-between gap-4">

              <Link
                href="/"
                aria-label="Khatu Rides Travels Home"
                className="inline-flex items-center"
              >
                <img
                  src="/nav_logo.png"
                  alt="Khatu Rides Travels Co."
                  className="h-12 w-auto object-contain sm:h-14"
                />
              </Link>

              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 sm:flex">

                <ShieldCheck
                  size={17}
                  className="text-emerald-400"
                />

                <span className="text-[11px] font-black uppercase tracking-[.12em] text-slate-200">
                  Trusted Intercity Cab Service
                </span>

              </div>

            </div>

            {/* BREADCRUMB */}

            <nav
              aria-label="Breadcrumb"
              className="mt-8 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-400"
            >

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <ChevronRight size={13} />

              <Link
                href="/routes"
                className="transition hover:text-white"
              >
                Taxi Routes
              </Link>

              <ChevronRight size={13} />

              <span className="text-slate-200">
                {routeFrom} to {routeTo}
              </span>

            </nav>

            {/* HERO CONTENT */}

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[.13em] text-amber-300">

                  <Route size={15} />

                  Route Taxi Booking

                </div>

                <h1 className="mt-6 max-w-4xl text-[38px] font-black leading-[1.06] tracking-[-.03em] text-white sm:text-[52px] lg:text-[64px]">

                  {routeFrom} to {routeTo}

                  <span className="mt-2 block text-amber-400">
                    Taxi & Cab Service
                  </span>

                </h1>

                <p className="mt-6 max-w-3xl text-[16px] font-medium leading-7 text-slate-300 sm:text-[18px] sm:leading-8">
                  {route.desc}
                </p>

                {/* ROUTE BADGES */}

                <div className="mt-7 flex flex-wrap gap-2.5">

                  {[
                    "One Way Taxi",
                    "Round Trip Cab",
                    "Outstation Travel",
                    "Premium Cars",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2.5 text-[11px] font-bold text-slate-200 sm:text-[12px]"
                    >
                      {item}
                    </span>
                  ))}

                </div>

                {/* HERO CTA */}

                <div className="mt-8 grid gap-3 sm:flex">

                  <a
                    href={`tel:${PHONE}`}
                    className="group flex min-h-[64px] items-center justify-center gap-3 rounded-2xl bg-[#980000] px-6 text-white shadow-[0_18px_45px_rgba(152,0,0,.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#ae0000] sm:min-w-[205px]"
                  >

                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#980000]">
                      <Phone size={21} />
                    </span>

                    <span className="text-left">

                      <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-white/70">
                        Direct Booking
                      </span>

                      <span className="mt-0.5 block text-[16px] font-black">
                        CALL NOW
                      </span>

                    </span>

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />

                  </a>

                  <a
                    href={createWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[64px] items-center justify-center gap-3 rounded-2xl bg-[#20C968] px-6 text-white shadow-[0_18px_45px_rgba(32,201,104,.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#18b85c] sm:min-w-[220px]"
                  >

                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#20C968]">
                      <MessageCircle size={22} />
                    </span>

                    <span className="text-left">

                      <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-white/75">
                        Quick Enquiry
                      </span>

                      <span className="mt-0.5 block text-[16px] font-black">
                        WHATSAPP BOOKING
                      </span>

                    </span>

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />

                  </a>

                </div>

              </div>

              {/* ROUTE VISUAL CARD */}

              <div className="relative">

                <div className="rounded-[30px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl sm:p-5">

                  <div className="rounded-[24px] bg-white p-5 text-slate-950 sm:p-6">

                    <div className="flex items-center justify-between">

                      <span className="text-[11px] font-black uppercase tracking-[.14em] text-slate-400">
                        Your Journey
                      </span>

                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                        <CheckCircle2 size={13} />
                        Booking Support
                      </span>

                    </div>

                    {/* ROUTE */}

                    <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">

                      <div>

                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                          <MapPin
                            size={20}
                            fill="currentColor"
                          />
                        </div>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Pickup
                        </p>

                        <p className="mt-1 text-[20px] font-black leading-tight">
                          {routeFrom}
                        </p>

                      </div>

                      <div className="flex flex-col items-center gap-2">

                        <div className="h-px w-12 bg-slate-200 sm:w-16" />

                        <Navigation
                          size={18}
                          className="text-[#063B8F]"
                        />

                      </div>

                      <div className="text-right">

                        <div className="mb-2 ml-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#063B8F]">
                          <MapPin
                            size={20}
                            fill="currentColor"
                          />
                        </div>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Drop
                        </p>

                        <p className="mt-1 text-[20px] font-black leading-tight">
                          {routeTo}
                        </p>

                      </div>

                    </div>

                    {/* FEATURES */}

                    <div className="mt-7 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-slate-50 p-4">

                        <ShieldCheck
                          size={19}
                          className="text-[#063B8F]"
                        />

                        <p className="mt-3 text-[13px] font-black">
                          Transparent
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-slate-500">
                          Clear booking information
                        </p>

                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">

                        <Headphones
                          size={19}
                          className="text-emerald-600"
                        />

                        <p className="mt-3 text-[13px] font-black">
                          Direct Support
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-slate-500">
                          Call or WhatsApp booking
                        </p>

                      </div>

                    </div>

                    {/* DISTANCE */}

                    {route.distanceText && (
                      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5">

                        <div className="flex items-center gap-2.5">

                          <Route
                            size={17}
                            className="text-amber-600"
                          />

                          <span className="text-[12px] font-bold text-slate-500">
                            Route Distance
                          </span>

                        </div>

                        <span className="text-[13px] font-black">
                          {route.distanceText}
                        </span>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================
            TRUST STRIP
        ======================================================== */}

        <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          <div className="-mt-7 grid overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.10)] sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: ShieldCheck,
                title: "Transparent Booking",
                text: "Clear communication before confirmation.",
              },
              {
                icon: Car,
                title: "Comfortable Fleet",
                text: "Sedan, MUV and premium SUV options.",
              },
              {
                icon: Clock3,
                title: "Travel Support",
                text: "Direct assistance for your journey.",
              },
              {
                icon: BadgeCheck,
                title: "Experienced Service",
                text: "Built around dependable intercity travel.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 p-5 sm:p-6 ${
                    index !== 0
                      ? "border-t border-slate-100 sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-amber-400">
                    <Icon size={21} />
                  </div>

                  <div>

                    <h2 className="text-[14px] font-black text-slate-950">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-[12px] font-medium leading-5 text-slate-500">
                      {item.text}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* ========================================================
            ROUTE INTRODUCTION
        ======================================================== */}

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">

          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">

            <div>

              <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                Route Information
              </span>

              <h2 className="mt-3 text-[32px] font-black leading-tight tracking-[-.025em] text-slate-950 sm:text-[42px]">
                {routeFrom} to {routeTo} Taxi Booking Made Simple
              </h2>

              <div className="mt-6 flex items-center gap-2 text-[13px] font-bold text-slate-500">

                <MapPin
                  size={17}
                  className="text-[#063B8F]"
                />

                Intercity taxi and cab service

              </div>

            </div>

            <div className="space-y-5 text-[16px] font-medium leading-8 text-slate-600">

              {route.sectionParagraphs.slice(0, 3).map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}

              <p>
                Customers searching for a{" "}
                <strong className="font-black text-slate-900">
                  {routeFrom} to {routeTo} taxi
                </strong>
                , one-way cab, round-trip taxi or outstation cab can contact
                Khatu Rides Travels directly and discuss their travel
                requirement before confirming the journey.
              </p>

            </div>

          </div>

        </section>

        {/* ========================================================
            SERVICE TYPES
        ======================================================== */}

        <section className="bg-white py-16 sm:py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="max-w-3xl">

              <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                Choose Your Journey
              </span>

              <h2 className="mt-3 text-[32px] font-black leading-tight tracking-[-.025em] sm:text-[42px]">
                Taxi & Cab Services for {routeFrom} to {routeTo}
              </h2>

              <p className="mt-5 text-[16px] font-medium leading-7 text-slate-600">
                Different travellers need different types of journeys. Our
                route service is structured around common intercity taxi,
                cab and outstation travel requirements.
              </p>

            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: ArrowRight,
                  title: "One Way Taxi",
                  text: `Direct ${routeFrom} to ${routeTo} cab booking for customers who only need a drop journey.`,
                },
                {
                  icon: Route,
                  title: "Round Trip Cab",
                  text: `A practical option for customers travelling ${routeFrom} to ${routeTo} and returning later.`,
                },
                {
                  icon: Car,
                  title: "Outstation Cab",
                  text: "Comfortable intercity travel for personal, family and business requirements.",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Business Travel",
                  text: "Professional cab options for meetings, work visits and scheduled intercity journeys.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(15,23,42,.08)]"
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071A3A] text-amber-400">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-5 text-[19px] font-black">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[14px] font-medium leading-7 text-slate-600">
                      {item.text}
                    </p>

                  </article>
                );
              })}

            </div>

          </div>

        </section>

        {/* ========================================================
            FLEET
        ======================================================== */}

        <section
          id="fleet"
          className="bg-[#f7f9fc] py-16 sm:py-20"
        >

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="max-w-3xl">

                <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                  Our Fleet
                </span>

                <h2 className="mt-3 text-[32px] font-black leading-tight tracking-[-.025em] sm:text-[42px]">
                  Choose the Right Cab for Your Journey
                </h2>

                <p className="mt-4 text-[16px] font-medium leading-7 text-slate-600">
                  Whether you need a practical sedan, a spacious family MUV
                  or a premium SUV, choose a vehicle according to your
                  passenger count, luggage and comfort requirement.
                </p>

              </div>

              <Link
                href="/fleet"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-[12px] font-black uppercase tracking-[.08em] text-slate-900 transition hover:border-amber-400 hover:bg-amber-50"
              >
                View Full Fleet
                <ArrowRight size={16} />
              </Link>

            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">

              {VEHICLES.map((vehicle) => (
                <article
                  key={vehicle.name}
                  className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,.06)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_24px_60px_rgba(15,23,42,.12)]"
                >

                  {/* IMAGE */}

                  <div className="relative flex min-h-[245px] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-100 via-white to-white px-5 pt-5 sm:min-h-[265px]">

                    <span className="absolute left-5 top-5 z-10 rounded-xl border border-white bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[.11em] text-slate-700 shadow-md">
                      {vehicle.category}
                    </span>

                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} for ${routeFrom} to ${routeTo} taxi service`}
                      className="max-h-[225px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="p-5 sm:p-6">

                    <h3 className="text-[24px] font-black tracking-tight text-slate-950">
                      {vehicle.name}
                    </h3>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2">

                          <Users
                            size={18}
                            className="text-[#063B8F]"
                          />

                          <span className="text-[10px] font-black uppercase tracking-[.1em] text-slate-400">
                            Seating
                          </span>

                        </div>

                        <p className="mt-2 text-[14px] font-black">
                          {vehicle.seats} Seats
                        </p>

                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2">

                          <Luggage
                            size={18}
                            className="text-[#063B8F]"
                          />

                          <span className="text-[10px] font-black uppercase tracking-[.1em] text-slate-400">
                            Luggage
                          </span>

                        </div>

                        <p className="mt-2 text-[14px] font-black">
                          {vehicle.luggage}
                        </p>

                      </div>

                    </div>

                    <p className="mt-5 text-[14px] font-medium leading-7 text-slate-600">
                      {vehicle.description}
                    </p>

                    {/* BEST FOR */}

                    <div className="mt-5 rounded-[22px] border border-amber-200 bg-amber-50/70 p-4">

                      <div className="flex items-center gap-2">

                        <Sparkles
                          size={15}
                          className="text-amber-600"
                        />

                        <p className="text-[10px] font-black uppercase tracking-[.13em] text-amber-700">
                          Best For
                        </p>

                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {vehicle.bestFor.map((item) => (
                          <span
                            key={item}
                            className="rounded-xl border border-white bg-white px-3 py-2 text-[10px] font-bold text-slate-600 shadow-sm"
                          >
                            {item}
                          </span>
                        ))}

                      </div>

                    </div>

                    {/* CTA */}

                    <a
                      href={createWhatsAppUrl(
                        `Hello Khatu Rides Travels Co.,

I want to enquire about ${vehicle.name} for ${routeFrom} to ${routeTo} travel.

Pickup: ${routeFrom}
Drop: ${routeTo}
Vehicle: ${vehicle.name}

Please share availability and booking details.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#20C968] px-5 text-[11px] font-black uppercase tracking-[.1em] text-white shadow-[0_12px_28px_rgba(32,201,104,.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#18B85C] active:scale-[.98]"
                    >

                      <MessageCircle size={19} />

                      Enquire For This Cab

                      <ArrowRight size={16} />

                    </a>

                  </div>

                </article>
              ))}

            </div>

          </div>

        </section>

        {/* ========================================================
            WHY CHOOSE US
        ======================================================== */}

        <section className="bg-white py-16 sm:py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

              <div>

                <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                  Why Khatu Rides
                </span>

                <h2 className="mt-3 text-[32px] font-black leading-tight tracking-[-.025em] sm:text-[42px]">
                  A Taxi Service Built Around Trust
                </h2>

                <p className="mt-5 text-[16px] font-medium leading-8 text-slate-600">
                  Our focus is not simply putting a car on the road. We aim
                  to provide a smoother booking experience, clear
                  communication and a comfortable journey from pickup to
                  destination.
                </p>

                <div className="mt-7">

                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#980000] px-6 text-[12px] font-black uppercase tracking-[.1em] text-white shadow-[0_15px_35px_rgba(152,0,0,.20)] transition hover:-translate-y-0.5 hover:bg-[#ae0000]"
                  >

                    <Phone size={19} />

                    Talk to Our Booking Team

                    <ArrowRight size={17} />

                  </a>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {[
                  {
                    icon: ShieldCheck,
                    title: "Transparent Communication",
                    text: "We believe customers should understand the booking before confirming their journey.",
                  },
                  {
                    icon: Car,
                    title: "Comfort-Focused Fleet",
                    text: "Different vehicle categories for different passenger and luggage requirements.",
                  },
                  {
                    icon: Clock3,
                    title: "Planned Travel",
                    text: "Share your schedule early so the appropriate travel arrangement can be discussed.",
                  },
                  {
                    icon: Headphones,
                    title: "Direct Assistance",
                    text: "Speak directly with the booking team through phone or WhatsApp.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-[26px] border border-slate-200 bg-slate-50 p-6"
                    >

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Icon size={24} />
                      </div>

                      <h3 className="mt-5 text-[18px] font-black">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[14px] font-medium leading-7 text-slate-600">
                        {item.text}
                      </p>

                    </article>
                  );
                })}

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================
            PICKUP / DROP DESTINATIONS
        ======================================================== */}

        <section className="bg-[#071A3A] py-16 text-white sm:py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="max-w-4xl">

              <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-400">
                Pickup & Drop Coverage
              </span>

              <h2 className="mt-3 text-[32px] font-black leading-tight tracking-[-.025em] sm:text-[42px]">
                Taxi Connections Across Chhattisgarh
              </h2>

              <p className="mt-5 text-[16px] font-medium leading-8 text-slate-300">
                Customers do not always start or finish their journey from
                the main city centre. We therefore support enquiries for
                major cities and nearby travel destinations across
                Chhattisgarh and connected intercity corridors.
              </p>

            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">

              {SERVICE_DESTINATIONS.map((city) => (
                <div
                  key={city}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-4 text-center transition hover:border-amber-400/40 hover:bg-white/[0.10]"
                >

                  <MapPin
                    size={17}
                    className="mx-auto mb-2 text-amber-400"
                  />

                  <span className="text-[12px] font-bold text-slate-200 sm:text-[13px]">
                    {city}
                  </span>

                </div>
              ))}

            </div>

            <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.05] p-6 sm:p-7">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <h3 className="text-[19px] font-black">
                    Need a pickup or drop outside the main city?
                  </h3>

                  <p className="mt-2 max-w-2xl text-[14px] font-medium leading-6 text-slate-300">
                    Send us your exact location and destination. Our booking
                    team can confirm the applicable service availability.
                  </p>

                </div>

                <a
                  href={createWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#20C968] px-6 text-[12px] font-black uppercase tracking-[.09em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#18B85C]"
                >

                  <MessageCircle size={19} />

                  Check Availability

                  <ArrowRight size={17} />

                </a>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================
            ROUTE SEO CONTENT
        ======================================================== */}

        <section className="bg-[#f7f9fc] py-16 sm:py-20">

          <div className="mx-auto max-w-6xl px-5 sm:px-8">

            <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,.05)] sm:p-9 lg:p-11">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071A3A] text-amber-400">
                  <Navigation size={22} />
                </div>

                <div>

                  <span className="text-[10px] font-black uppercase tracking-[.15em] text-amber-600">
                    Route Guide
                  </span>

                  <h2 className="mt-1 text-[27px] font-black leading-tight sm:text-[34px]">
                    {routeFrom} to {routeTo} Taxi Service Information
                  </h2>

                </div>

              </div>

              <div className="mt-8 space-y-6 text-[15px] font-medium leading-8 text-slate-600 sm:text-[16px]">

                <p>
                  If you are looking for a{" "}
                  <strong className="font-black text-slate-950">
                    {routeFrom} to {routeTo} taxi
                  </strong>
                  ,{" "}
                  <strong className="font-black text-slate-950">
                    {routeFrom} to {routeTo} cab
                  </strong>
                  , one-way taxi or outstation cab, Khatu Rides Travels
                  provides a direct booking channel for this intercity
                  journey. Customers can discuss their travel date,
                  passenger requirement, vehicle preference and pickup or
                  drop details before confirming the booking.
                </p>

                <p>
                  For travellers who need a direct drop,{" "}
                  <strong className="font-black text-slate-950">
                    {routeFrom} to {routeTo} one way taxi
                  </strong>{" "}
                  can be a practical option. Customers travelling for
                  family visits, business requirements, personal work or
                  longer stays can also enquire about a{" "}
                  <strong className="font-black text-slate-950">
                    {routeFrom} to {routeTo} round trip cab
                  </strong>
                  .
                </p>

                <p>
                  Vehicle selection is another important part of intercity
                  travel. A sedan can work well for smaller groups, an
                  Ertiga provides additional passenger and luggage space,
                  while the Innova Crysta is suitable for customers looking
                  for a more premium and spacious road-travel experience.
                </p>

                <p>
                  Our route pages are designed to answer the questions that
                  customers normally have before booking a taxi: which
                  vehicle may suit the journey, whether one-way or return
                  travel is appropriate, how to contact the booking team,
                  and which nearby pickup or drop locations can be discussed.
                </p>

              </div>

              {/* SEARCH INTENT */}

              <div className="mt-9 rounded-[25px] border border-slate-200 bg-slate-50 p-5 sm:p-7">

                <h3 className="text-[20px] font-black">
                  Popular {routeFrom} to {routeTo} Taxi Searches
                </h3>

                <p className="mt-2 text-[13px] font-medium leading-6 text-slate-500">
                  Common commercial search variations naturally covered by
                  this route service page.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  {routeIntentTerms.map((keyword) => (
                    <div
                      key={keyword}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
                    >

                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span className="text-[13px] font-bold leading-5 text-slate-700">
                        {keyword}
                      </span>

                    </div>
                  ))}

                </div>

              </div>

            </article>

          </div>

        </section>

        {/* ========================================================
            REVERSE ROUTE
        ======================================================== */}

        <section className="bg-white py-16 sm:py-20">

          <div className="mx-auto max-w-6xl px-5 sm:px-8">

            <div className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-9">

              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">

                <div>

                  <span className="text-[11px] font-black uppercase tracking-[.15em] text-amber-600">
                    Reverse Journey
                  </span>

                  <h2 className="mt-3 text-[29px] font-black leading-tight sm:text-[36px]">
                    {routeTo} to {routeFrom} Taxi & Cab Service
                  </h2>

                  <p className="mt-4 max-w-3xl text-[15px] font-medium leading-7 text-slate-600">
                    Travelling in the opposite direction? Customers can also
                    enquire about a{" "}
                    <strong className="font-black text-slate-950">
                      {routeTo} to {routeFrom} taxi
                    </strong>
                    , one-way cab or return journey. Contact the booking
                    team with your travel details to check the applicable
                    service and vehicle availability.
                  </p>

                </div>

                <a
                  href={createWhatsAppUrl(
                    `Hello Khatu Rides Travels Co.,

I want to enquire about ${routeTo} to ${routeFrom} taxi service.

Pickup: ${routeTo}
Drop: ${routeFrom}

Please share booking details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#20C968] px-6 text-[12px] font-black uppercase tracking-[.08em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#18B85C]"
                >

                  <MessageCircle size={19} />

                  Enquire Reverse Route

                  <ArrowRight size={17} />

                </a>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================
            BOOKING PROCESS
        ======================================================== */}

        <section className="bg-[#f7f9fc] py-16 sm:py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="mx-auto max-w-3xl text-center">

              <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                Simple Booking Process
              </span>

              <h2 className="mt-3 text-[32px] font-black tracking-[-.025em] sm:text-[42px]">
                Book Your {routeFrom} to {routeTo} Cab in 3 Steps
              </h2>

              <p className="mt-4 text-[16px] font-medium leading-7 text-slate-600">
                No complicated process. Share the journey details, discuss
                the available option and confirm your booking directly.
              </p>

            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {[
                {
                  number: "01",
                  icon: MapPin,
                  title: "Share Your Route",
                  text: `Tell us your pickup point, ${routeTo} destination, travel date and passenger requirement.`,
                },
                {
                  number: "02",
                  icon: Car,
                  title: "Choose Your Cab",
                  text: "Select the vehicle category according to passenger count, luggage and comfort requirement.",
                },
                {
                  number: "03",
                  icon: CheckCircle2,
                  title: "Confirm Your Journey",
                  text: "Discuss the booking details with our team and confirm the trip through direct support.",
                },
              ].map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="relative rounded-[28px] border border-slate-200 bg-white p-7"
                  >

                    <span className="absolute right-5 top-5 text-[35px] font-black text-slate-100">
                      {step.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071A3A] text-amber-400">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-6 text-[20px] font-black">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[14px] font-medium leading-7 text-slate-600">
                      {step.text}
                    </p>

                  </article>
                );
              })}

            </div>

          </div>

        </section>

        {/* ========================================================
            REVIEWS
        ======================================================== */}

        <section className="bg-white py-16 sm:py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Star
                    size={19}
                    className="fill-amber-400 text-amber-400"
                  />

                  <span className="text-[12px] font-black uppercase tracking-[.12em] text-amber-600">
                    Customer Experience
                  </span>

                </div>

                <h2 className="mt-3 text-[32px] font-black tracking-[-.025em] sm:text-[40px]">
                  What Travellers Say
                </h2>

              </div>

              <p className="max-w-md text-[14px] font-medium leading-6 text-slate-500">
                Real customer experiences help travellers understand what
                to expect before choosing an intercity cab service.
              </p>

            </div>

            <ReviewsCarousel />

          </div>

        </section>

        {/* ========================================================
            POPULAR ROUTES
        ======================================================== */}

        <section className="bg-[#f7f9fc] py-16 sm:py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="max-w-3xl">

              <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                More Taxi Routes
              </span>

              <h2 className="mt-3 text-[32px] font-black tracking-[-.025em] sm:text-[40px]">
                Popular Cab Routes in Chhattisgarh
              </h2>

              <p className="mt-4 text-[16px] font-medium leading-7 text-slate-600">
                Explore other high-demand intercity taxi routes served by
                Khatu Rides Travels.
              </p>

            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {POPULAR_ROUTE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-[90px] items-center justify-between rounded-[22px] border border-slate-200 bg-white px-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_15px_35px_rgba(15,23,42,.07)]"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Route size={19} />
                    </div>

                    <span className="text-[14px] font-black leading-5">
                      {item.label}
                    </span>

                  </div>

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#063B8F]"
                  />

                </Link>
              ))}

            </div>

          </div>

        </section>

        {/* ========================================================
            FAQ
        ======================================================== */}

        <section className="bg-white py-16 sm:py-20">

          <div className="mx-auto max-w-5xl px-5 sm:px-8">

            <div className="text-center">

              <span className="text-[11px] font-black uppercase tracking-[.16em] text-amber-600">
                Frequently Asked Questions
              </span>

              <h2 className="mt-3 text-[32px] font-black tracking-[-.025em] sm:text-[42px]">
                {routeFrom} to {routeTo} Taxi Booking FAQs
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-[16px] font-medium leading-7 text-slate-600">
                Important information customers commonly want to know before
                booking an intercity taxi or cab.
              </p>

            </div>

            <div className="mt-10 space-y-4">

              {faqItems.map((item, index) => (
                <details
                  key={item.question}
                  className="group rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:p-6"
                  open={index === 0}
                >

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5">

                    <h3 className="text-[16px] font-black leading-6 text-slate-950 sm:text-[18px]">
                      {item.question}
                    </h3>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition group-open:rotate-90">
                      <ChevronRight size={18} />
                    </span>

                  </summary>

                  <p className="mt-4 max-w-4xl text-[14px] font-medium leading-7 text-slate-600 sm:text-[15px]">
                    {item.answer}
                  </p>

                </details>
              ))}

            </div>

          </div>

        </section>

        {/* ========================================================
            FINAL CTA
        ======================================================== */}

        <section className="relative overflow-hidden bg-[#071A3A] text-white">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,.18),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(6,59,143,.4),transparent_40%)]" />

          <div className="relative mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-20">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-amber-400 text-slate-950 shadow-[0_15px_40px_rgba(245,158,11,.25)]">

              <Car size={28} />

            </div>

            <span className="mt-6 inline-block text-[11px] font-black uppercase tracking-[.16em] text-amber-300">
              Ready to Travel?
            </span>

            <h2 className="mx-auto mt-3 max-w-4xl text-[34px] font-black leading-tight tracking-[-.025em] sm:text-[48px]">
              Book Your {routeFrom} to {routeTo} Taxi Today
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[16px] font-medium leading-7 text-slate-300 sm:text-[17px]">
              Share your travel requirement with Khatu Rides Travels and
              speak directly with our booking team about the right cab for
              your journey.
            </p>

            <div className="mt-8 grid gap-3 sm:flex sm:justify-center">

              <a
                href={`tel:${PHONE}`}
                className="group flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#980000] px-7 text-white shadow-[0_18px_45px_rgba(152,0,0,.3)] transition-all hover:-translate-y-1 hover:bg-[#ae0000]"
              >

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#980000]">
                  <Phone size={21} />
                </span>

                <span className="text-left">

                  <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-white/70">
                    Direct Booking
                  </span>

                  <span className="block text-[17px] font-black">
                    CALL NOW
                  </span>

                </span>

                <ArrowRight size={18} />

              </a>

              <a
                href={createWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#20C968] px-7 text-white shadow-[0_18px_45px_rgba(32,201,104,.24)] transition-all hover:-translate-y-1 hover:bg-[#18B85C]"
              >

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#20C968]">
                  <MessageCircle size={22} />
                </span>

                <span className="text-left">

                  <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-white/75">
                    Quick Enquiry
                  </span>

                  <span className="block text-[17px] font-black">
                    WHATSAPP BOOKING
                  </span>

                </span>

                <ArrowRight size={18} />

              </a>

            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] font-bold text-slate-400">

              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-emerald-400"
                />
                Transparent booking
              </span>

              <span className="flex items-center gap-2">
                <Car
                  size={16}
                  className="text-amber-400"
                />
                Multiple vehicle options
              </span>

              <span className="flex items-center gap-2">
                <Headphones
                  size={16}
                  className="text-blue-400"
                />
                Direct support
              </span>

            </div>

          </div>

        </section>

        {/* ========================================================
            MOBILE FLOATING CONTACT
        ======================================================== */}

        <div className="fixed bottom-5 right-4 z-[100] sm:bottom-7 sm:right-7">

          {/* EXPANDED OPTIONS */}

          <div
            className={[
              "mb-3 flex origin-bottom-right flex-col gap-3 transition-all duration-300",
              contactOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-4 scale-95 opacity-0",
            ].join(" ")}
          >

            {/* CALL */}

            <a
              href={`tel:${PHONE}`}
              className="group flex min-h-[70px] min-w-[245px] items-center gap-4 rounded-[21px] bg-[#980000] px-4 text-white shadow-[0_18px_50px_rgba(152,0,0,.38)] transition-all hover:-translate-y-1 hover:bg-[#ae0000]"
            >

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#980000]">
                <Phone
                  size={24}
                  strokeWidth={2.5}
                />
              </span>

              <span className="min-w-0 flex-1">

                <span className="block text-[10px] font-black uppercase tracking-[.15em] text-white/70">
                  Direct Booking
                </span>

                <span className="mt-0.5 block text-[18px] font-black leading-tight">
                  CALL NOW
                </span>

              </span>

              <ArrowRight
                size={20}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1"
              />

            </a>

            {/* WHATSAPP */}

            <a
              href={createWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[70px] min-w-[245px] items-center gap-4 rounded-[21px] bg-[#20C968] px-4 text-white shadow-[0_18px_50px_rgba(32,201,104,.32)] transition-all hover:-translate-y-1 hover:bg-[#18B85C]"
            >

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#20C968]">
                <MessageCircle
                  size={24}
                  strokeWidth={2.5}
                />
              </span>

              <span className="min-w-0 flex-1">

                <span className="block text-[10px] font-black uppercase tracking-[.15em] text-white/75">
                  Quick Enquiry
                </span>

                <span className="mt-0.5 block text-[18px] font-black leading-tight">
                  WHATSAPP
                </span>

              </span>

              <ArrowRight
                size={20}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1"
              />

            </a>

          </div>

          {/* CLOSED = ICON ONLY */}

          <button
            type="button"
            onClick={() => setContactOpen((value) => !value)}
            aria-expanded={contactOpen}
            aria-label={
              contactOpen
                ? "Close contact options"
                : "Open call and WhatsApp options"
            }
            className={[
              "flex h-[70px] w-[70px] items-center justify-center rounded-full border-[4px] border-white bg-[#071A3A] text-white shadow-[0_18px_55px_rgba(7,26,58,.35)] transition-all duration-300 active:scale-95",
              contactOpen
                ? "rotate-45 bg-[#063B8F]"
                : "hover:scale-105 hover:bg-[#063B8F]",
            ].join(" ")}
          >

            {contactOpen ? (
              <span className="text-[32px] font-bold leading-none">
                +
              </span>
            ) : (
              <Phone
                size={29}
                strokeWidth={2.5}
              />
            )}

          </button>

        </div>

      </main>
    </>
  );
}