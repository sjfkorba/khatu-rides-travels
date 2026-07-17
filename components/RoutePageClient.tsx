"use client";

import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Car,
  CheckCircle2,
  Star,
  Users,
  ArrowRight,
  Phone,
  Clock3,
  MapPinned,
  BadgeIndianRupee,
  Luggage,
  ChevronRight,
} from "lucide-react";
import FareCalculator from "@/components/FareCalculator";
import TrackedWhatsAppButton from "@/components/TrackedWhatsAppButton";

type RoutePageClientProps = {
  slug: string;
  route: {
    h1: string;
    desc: string;
    sectionTitle: string;
    sectionParagraphs: string[];
    from?: string;
    to?: string;
    distance?: string;
    time?: string;
    fareNote?: string;
    faqs?: { q: string; a: string }[];
  };
};

const cabOptions = [
  {
    name: "Maruti Dzire",
    img: "/dezire.png",
    tag: "Budget Sedan",
    seats: "4+1 Seats",
    luggage: "2 Bags",
    bestFor: "Best for one way taxi, solo travellers, couples, and budget intercity rides.",
  },
  {
    name: "Maruti Ertiga",
    img: "/ertiga.png",
    tag: "Family MPV",
    seats: "6+1 Seats",
    luggage: "4 Bags",
    bestFor: "Best for round trip cab bookings, family travel, and extra luggage comfort.",
  },
  {
    name: "Toyota Crysta",
    img: "/crysta.png",
    tag: "Premium SUV",
    seats: "6+1 Seats",
    luggage: "5 Bags",
    bestFor: "Best for premium outstation rides, airport transfers, business trips, and group travel.",
  },
];

function slugToPlaces(slug: string) {
  if (!slug) return { from: "Korba", to: "Raipur" };

  const cleaned = slug
    .replace(/-taxi|-cab|-cabs|-one-way|-round-trip|-roundtrip/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const separators = ["-to-", "_to_", " to "];

  for (const sep of separators) {
    if (cleaned.includes(sep)) {
      const [from, to] = cleaned.split(sep);
      return {
        from: formatPlace(from),
        to: formatPlace(to),
      };
    }
  }

  const parts = cleaned.split("-").filter(Boolean);
  if (parts.length >= 2) {
    const mid = Math.floor(parts.length / 2);
    return {
      from: formatPlace(parts.slice(0, mid).join(" ")),
      to: formatPlace(parts.slice(mid).join(" ")),
    };
  }

  return { from: "Korba", to: "Raipur" };
}

function formatPlace(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function buildKeywordGroups(from: string, to: string) {
  return {
    oneWay: [
      `${from} to ${to} taxi`,
      `${from} to ${to} cab`,
      `${from} to ${to} one way cab`,
      `${from} to ${to} one way taxi`,
      `${from} to ${to} outstation cab`,
      `${from} to ${to} outstation taxi`,
      `${from} to ${to} sedan cab`,
      `${from} to ${to} cab fare`,
      `${from} to ${to} taxi fare`,
      `book ${from} to ${to} taxi`,
      `book ${from} to ${to} cab`,
      `hire cab ${from} to ${to}`,
    ],
    roundTrip: [
      `${from} to ${to} round trip cab`,
      `${from} to ${to} round trip taxi`,
      `${from} to ${to} return cab`,
      `${from} to ${to} return taxi`,
      `${from} to ${to} family cab`,
      `${from} to ${to} airport cab`,
      `${from} to ${to} online cab booking`,
      `${from} to ${to} cab service`,
      `${to} to ${from} taxi`,
      `${to} to ${from} cab`,
      `${to} to ${from} one way cab`,
      `${to} to ${from} round trip taxi`,
    ],
  };
}

function buildFaqs(from: string, to: string, fareNote?: string) {
  return [
    {
      q: `Is ${from} to ${to} one way taxi available?`,
      a: `Yes, one way taxi from ${from} to ${to} is available for travellers who need a direct outstation drop with transparent pricing and easy booking confirmation.`,
    },
    {
      q: `Can I book ${from} to ${to} round trip cab service?`,
      a: `Yes, round trip cabs are available for family tours, business visits, return travel, and multi-stop journeys depending on route availability.`,
    },
    {
      q: `What cars are available for ${from} to ${to} cab booking?`,
      a: `You can book sedan, MPV, and premium SUV options such as Dzire, Ertiga, and Crysta based on seat requirement, luggage, and travel comfort.`,
    },
    {
      q: `How is ${from} to ${to} taxi fare calculated?`,
      a: fareNote
        ? fareNote
        : `Fare is usually calculated based on trip type, distance, vehicle category, tolls, parking, driver allowance when applicable, and pickup-drop requirements.`,
    },
    {
      q: `How do I confirm my ${from} to ${to} cab booking?`,
      a: `You can calculate fare, send your travel details on WhatsApp, and confirm your booking after receiving route and vehicle details from the support team.`,
    },
  ];
}

function SeoContent({
  from,
  to,
  tripType,
}: {
  from: string;
  to: string;
  tripType: "oneway" | "roundtrip";
}) {
  return (
    <section className="py-20 px-4 bg-slate-900/20">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
              Route Information
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              {tripType === "oneway" ? "One Way Booking" : "Round Trip Booking"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {from} to {to} {tripType === "oneway" ? "One Way Taxi" : "Round Trip Cab"} Service
          </h2>

          <p className="mt-6 text-slate-300 text-lg leading-8">
            Book {from} to {to} taxi service for reliable outstation travel with doorstep pickup,
            verified drivers, clean cars, and simple booking support. This route page is designed
            for travellers looking for transparent fare details, vehicle choices, and quick
            WhatsApp confirmation for both one way taxi and round trip cab bookings.
          </p>

          <p className="mt-5 text-slate-300 text-lg leading-8">
            Whether you need a budget sedan, a family MPV, or a premium SUV, you can choose the
            right cab based on passengers, luggage, and comfort preferences. The page layout also
            helps route-specific SEO by naturally covering fare, route intent, booking type,
            reverse route keywords, and commonly searched taxi terms for intercity travellers.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm text-slate-400">Popular search</p>
              <p className="mt-2 font-bold text-white">{from} to {to} cab fare</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm text-slate-400">Best for</p>
              <p className="mt-2 font-bold text-white">
                {tripType === "oneway" ? "Direct outstation drop" : "Return and family travel"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-sm text-slate-400">Booking mode</p>
              <p className="mt-2 font-bold text-white">Fare check + WhatsApp confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RoutePageClient({ slug, route }: RoutePageClientProps) {
  const derivedPlaces = useMemo(() => slugToPlaces(slug), [slug]);

  const from = route?.from || derivedPlaces.from;
  const to = route?.to || derivedPlaces.to;

  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");

  const keywordGroups = useMemo(() => buildKeywordGroups(from, to), [from, to]);
  const faqs = route?.faqs?.length ? route.faqs : buildFaqs(from, to, route?.fareNote);

  const primaryKeywords =
    tripType === "oneway" ? keywordGroups.oneWay : keywordGroups.roundTrip;

  return (
    <main className="min-h-screen bg-[#07101d] text-slate-100 selection:bg-orange-500 selection:text-white">
      <section className="relative overflow-hidden px-4 pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#07101d_0%,#0b1324_45%,#07101d_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* CALCULATOR FIRST - TOP CENTER ON DESKTOP, TOP ON MOBILE */}
          <div id="fare-calculator" className="max-w-4xl mx-auto">
            <div className="rounded-[32px] border border-white/10 bg-slate-900/75 p-4 shadow-2xl backdrop-blur-xl sm:p-6 md:p-8">
              <div className="mb-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                  Instant Fare Estimate
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">
                  Check {from} to {to} Cab Fare
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
                  Compare one way and round trip options, choose your vehicle, and confirm booking
                  instantly on WhatsApp.
                </p>
              </div>

              <div className="mb-5 flex justify-center">
                <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 p-1">
                  <button
                    type="button"
                    onClick={() => setTripType("oneway")}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      tripType === "oneway"
                        ? "bg-orange-500 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType("roundtrip")}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      tripType === "roundtrip"
                        ? "bg-orange-500 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Round Trip
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-3 sm:p-4">
                <FareCalculator onFareCalculated={(data) => console.log(data)} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={18} />
                    <p className="text-sm font-bold text-white">Quick quote</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Get fare estimate before final booking.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <ShieldCheck size={18} />
                    <p className="text-sm font-bold text-white">Verified support</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Confirm trip details directly on WhatsApp.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Zap size={18} />
                    <p className="text-sm font-bold text-white">Faster booking</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Built for high-intent outstation travel users.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT UNDER CALCULATOR */}
          <div className="mt-12 max-w-5xl mx-auto text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
              <ShieldCheck size={14} />
              Trusted Outstation Cab Booking
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              {route?.h1 || `${from} to ${to} Taxi Service`}
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-base leading-8 text-slate-300 sm:text-lg">
              {route?.desc ||
                `Book ${from} to ${to} cab service for one way and round trip travel with doorstep pickup, clear pricing, verified drivers, and instant WhatsApp booking support.`}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
                <span className="font-bold text-white">210+ Reviews</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
                One Way & Round Trip
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
                24x7 Booking Assistance
              </span>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const calc = document.getElementById("fare-calculator");
                  calc?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
              >
                Check Fare Now
                <ArrowRight size={18} />
              </button>

              <TrackedWhatsAppButton
                href="https://wa.me/919244137353"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500"
              >
                Book on WhatsApp
              </TrackedWhatsAppButton>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm text-left">
                <div className="flex items-center gap-2 text-orange-300">
                  <MapPinned size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Route</span>
                </div>
                <p className="mt-3 text-lg font-black text-white">
                  {from} → {to}
                </p>
                <p className="mt-1 text-sm text-slate-400">Intercity pickup and drop</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm text-left">
                <div className="flex items-center gap-2 text-orange-300">
                  <Clock3 size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Trip Type</span>
                </div>
                <p className="mt-3 text-lg font-black text-white">
                  {tripType === "oneway" ? "One Way Taxi" : "Round Trip Cab"}
                </p>
                <p className="mt-1 text-sm text-slate-400">Switch option before booking</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm text-left">
                <div className="flex items-center gap-2 text-orange-300">
                  <BadgeIndianRupee size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Pricing</span>
                </div>
                <p className="mt-3 text-lg font-black text-white">Transparent Fare</p>
                <p className="mt-1 text-sm text-slate-400">Simple pre-booking clarity</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm text-left">
                <div className="flex items-center gap-2 text-orange-300">
                  <Phone size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Support</span>
                </div>
                <p className="mt-3 text-lg font-black text-white">Instant Assistance</p>
                <p className="mt-1 text-sm text-slate-400">Quick booking help on WhatsApp</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "Doorstep pickup",
              "One way outstation taxi",
              "Round trip cab booking",
              "Instant WhatsApp support",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-slate-200 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-orange-400" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-300">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-lg font-black text-white">Verified Service</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Trusted booking support, route confirmation, and clear cab communication.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-300">
                  <BadgeIndianRupee size={20} />
                </div>
                <h3 className="text-lg font-black text-white">Transparent Pricing</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Fare estimate, trip type clarity, and easy pre-booking discussions on WhatsApp.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-300">
                  <Clock3 size={20} />
                </div>
                <h3 className="text-lg font-black text-white">Flexible Timing</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Perfect for planned travel, urgent drops, station pickups, and return trips.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-300">
                  <Phone size={20} />
                </div>
                <h3 className="text-lg font-black text-white">Direct Assistance</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Faster lead capture through action-first booking buttons and support flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-orange-400 font-black tracking-[0.18em] uppercase text-xs">
            Vehicle Options
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-white">Choose Your Cab</h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            Select the right cab category based on fare preference, passenger count, and luggage
            needs for {from} to {to} travel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {cabOptions.map((cab) => (
            <div
              key={cab.name}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-orange-950/10"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-orange-300 to-emerald-400 opacity-70" />

              <div className="h-44 rounded-[24px] border border-white/5 bg-slate-950/40 flex items-center justify-center p-4 mb-6">
                <img
                  src={cab.img}
                  alt={`${cab.name} for ${from} to ${to} cab booking`}
                  className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-orange-300">
                {cab.tag}
              </span>

              <h3 className="mt-4 text-2xl font-black text-white">{cab.name}</h3>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-orange-400" />
                  {cab.seats}
                </div>
                <div className="flex items-center gap-2">
                  <Luggage size={16} className="text-orange-400" />
                  {cab.luggage}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-400">{cab.bestFor}</p>

              <TrackedWhatsAppButton
                href="https://wa.me/919244137353"
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-orange-500/40 hover:bg-orange-500 hover:text-white"
              >
                Select {cab.name}
                <ChevronRight size={16} />
              </TrackedWhatsAppButton>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-orange-400 font-black tracking-[0.18em] uppercase text-xs">
                Khatu Rides Offered Routes:
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-white">
                {from} to {to} {tripType === "oneway" ? "One Way" : "Round Trip"} Keywords
              </h2>
            </div>

            <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 p-1">
              <button
                type="button"
                onClick={() => setTripType("oneway")}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  tripType === "oneway"
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setTripType("roundtrip")}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  tripType === "roundtrip"
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Round Trip
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              {primaryKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-100"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-xl font-black text-white">One Way Taxi</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {keywordGroups.oneWay.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-xl font-black text-white">Round Trip Taxi</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {keywordGroups.roundTrip.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Star className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-white">Verified Service · 210+ Reviews</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white">
            {route?.sectionTitle || `Why choose ${from} to ${to} taxi service`}
          </h2>

          {(route?.sectionParagraphs?.length
            ? route.sectionParagraphs
            : [
                `Our ${from} to ${to} cab booking service is designed for travellers who want a dependable outstation taxi with quick response time and clear communication. The page combines route-specific information, fare intent, and direct action buttons so users can move from search to booking with less friction.`,
                `You can book one way taxi service for direct drop travel or choose round trip cab booking when you need return support, waiting time flexibility, or family travel planning. This makes the page more aligned with genuine cab booking intent instead of being just a generic route listing.`,
                `From budget sedans to family MPVs and premium SUVs, travellers can match their trip needs with the right vehicle type. Strong route keywords, trust signals, and action-led layout help improve discoverability as well as booking conversion.`,
              ]
          ).map((para: string, i: number) => (
            <p key={i} className="mt-6 text-slate-300 leading-8 text-lg">
              {para}
            </p>
          ))}
        </div>
      </section>

      <SeoContent from={from} to={to} tripType={tripType} />

      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-orange-400 font-black tracking-[0.18em] uppercase text-xs">
            Frequently Asked Questions
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-white">
            {from} to {to} Cab Booking FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-[24px] border border-white/10 bg-white/[0.03] p-6 open:bg-white/[0.05]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-lg font-bold text-white">{faq.q}</span>
                <ChevronRight className="shrink-0 text-orange-400 transition group-open:rotate-90" size={20} />
              </summary>
              <p className="mt-4 pr-6 text-slate-300 leading-7">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-28 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[36px] border border-orange-500/20 bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-emerald-500/10 p-6 sm:p-8 md:p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                  Ready To Book
                </span>
                <h2 className="mt-4 text-3xl md:text-5xl font-black text-white">
                  Book {from} to {to} Cab in Minutes
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  Check fare, choose your trip type, and confirm your booking quickly through
                  WhatsApp support for one way or round trip outstation travel.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <TrackedWhatsAppButton
                  href="https://wa.me/919244137353"
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
                >
                  Book Now on WhatsApp
                </TrackedWhatsAppButton>

                <a
                  href="tel:+919244137353"
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-white/[0.08]"
                >
                  <Phone size={18} />
                  Call for Booking
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <TrackedWhatsAppButton
          href="https://wa.me/919244137353"
          className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-2xl shadow-emerald-950/40 transition hover:scale-[1.02] hover:bg-emerald-500"
        >
          Book on WhatsApp
        </TrackedWhatsAppButton>
      </div>

      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="grid grid-cols-2 gap-3 rounded-full border border-white/10 bg-slate-950/80 p-2 shadow-2xl backdrop-blur-xl">
          <a
            href="tel:+919244137353"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white/[0.06] px-4 py-3 text-center text-sm font-black uppercase tracking-[0.06em] text-white"
          >
            <Phone size={16} />
            Call Now
          </a>

          <TrackedWhatsAppButton
            href="https://wa.me/919244137353"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.06em] text-white"
          >
            Book Now
          </TrackedWhatsAppButton>
        </div>
      </div>
    </main>
  );
}