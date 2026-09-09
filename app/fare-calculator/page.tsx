"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";

import FareCalculator from "@/components/FareCalculator";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "@/components/landing/data";

type FareResult = {
  fareOptions: any[];
  pickup: string;
  drop: string;
  bookingType: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  localPackage?: string;
  packageLabel?: string;
};

function formatINR(value: unknown) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${Math.round(amount).toLocaleString("en-IN")}`
    : "₹—";
}

function formatDuration(minutes: unknown) {
  const totalMinutes = Number(minutes);

  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return "—";
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);

  if (hours === 0) {
    return `${mins} ${mins === 1 ? "Minute" : "Minutes"}`;
  }

  if (mins === 0) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
  }

  return `${hours} ${hours === 1 ? "Hour" : "Hours"} ${mins} ${
    mins === 1 ? "Minute" : "Minutes"
  }`;
}

/**
 * 5% online booking discount.
 * We intentionally calculate from the fare returned by the existing
 * fare calculator so the pricing engine itself remains untouched.
 */
function getDiscountedFare(baseFare: unknown) {
  const original = Number(baseFare);

  if (!Number.isFinite(original)) {
    return {
      original: 0,
      payable: 0,
      savings: 0,
      discountPercent: 5,
    };
  }

  const payable = Math.round(original * 0.95);
  const savings = Math.max(0, Math.round(original - payable));

  return {
    original: Math.round(original),
    payable,
    savings,
    discountPercent: 5,
  };
}

function buildWhatsAppMessage(result: FareResult, option: any) {
  const discount = getDiscountedFare(option.finalFare);
  const distance = option.billedDistance ?? option.actualDistance ?? "—";
  const duration = formatDuration(option.durationMinutes);

  const returnDetails =
    result.returnDate || result.returnTime
      ? `\nReturn Date: ${result.returnDate || "—"}\nReturn Time: ${
          result.returnTime || "—"
        }`
      : "";

  const packageDetails =
    result.packageLabel || result.localPackage
      ? `\nPackage: ${result.packageLabel || result.localPackage}`
      : "";

  return `🚕 *Khatu Rides Travels – Cab Booking Enquiry*

Hello Khatu Rides Team,

I would like to enquire about booking a cab.

📍 *TRIP DETAILS*

Pickup: ${result.pickup || "—"}
Destination: ${result.drop || "—"}
Journey Type: ${result.bookingType || "—"}
Service: ${result.serviceType || "—"}
Journey Date: ${result.pickupDate || "—"}
Pickup Time: ${result.pickupTime || "—"}${returnDetails}${packageDetails}

🚘 *VEHICLE DETAILS*

Vehicle: ${option.vehicleLabel || "Cab"}

💰 *FARE DETAILS*

Original Fare: ${formatINR(discount.original)}
Online Booking Discount: ${discount.discountPercent}%
You Save: ${formatINR(discount.savings)}
*Estimated Payable: ${formatINR(discount.payable)}*

📏 *JOURNEY DETAILS*

Distance: ${distance} KM
Duration: ${duration}

Please confirm the vehicle availability and booking details.

Thank you.
*Khatu Rides Travels Co.*`;
}

function getWhatsAppUrl(result: FareResult, option: any) {
  const message = buildWhatsAppMessage(result, option);
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export default function FareCalculatorPage() {
  const [result, setResult] = useState<FareResult | null>(null);

  const reset = () => {
    setResult(null);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F7FB] text-slate-900">
      {/* =========================================================
    PREMIUM NAVBAR
========================================================= */}
<header className="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(15,23,42,0.07)] backdrop-blur-xl">
  <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">

    {/* =====================================================
        LOGO
    ===================================================== */}
    <Link
      href="/"
      className="group flex shrink-0 items-center"
      aria-label="Khatu Rides Travels Co. Home"
    >
      <img
        src="/nav_logo.png"
        alt="Khatu Rides Travels Co."
        className="h-10 w-auto object-contain transition duration-200 group-hover:scale-[1.02] sm:h-11 lg:h-12"
      />
    </Link>

    {/* =====================================================
        DESKTOP NAVIGATION
    ===================================================== */}
    <nav className="hidden items-center gap-1 lg:flex">

      {/* HOME */}
      <Link
        href="/"
        className="group flex min-h-10 items-center gap-2 rounded-xl bg-[#F4F7FB] px-4 text-[9px] font-black uppercase tracking-[0.08em] text-[#063B8F] transition hover:bg-blue-50"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v10h14V9" />
            <path d="M9 19v-6h6v6" />
          </svg>
        </span>

        Home
      </Link>

      {/* FARE CALCULATOR */}
      <Link
        href="/fare-calculator"
        className="flex min-h-10 items-center gap-2 rounded-xl px-4 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500 transition hover:bg-slate-50 hover:text-[#063B8F]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50">
          ₹
        </span>

        Fare Calculator
      </Link>

      {/* ROUTES */}
      <Link
        href="/#popular-routes"
        className="flex min-h-10 items-center rounded-xl px-4 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500 transition hover:bg-slate-50 hover:text-[#063B8F]"
      >
        Routes
      </Link>

      {/* SERVICES */}
      <Link
        href="/#services"
        className="flex min-h-10 items-center rounded-xl px-4 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500 transition hover:bg-slate-50 hover:text-[#063B8F]"
      >
        Services
      </Link>
    </nav>

    {/* =====================================================
        DESKTOP RIGHT SIDE
    ===================================================== */}
    <div className="hidden items-center gap-2 lg:flex">

      {/* TRUST PILL */}
      <div className="flex min-h-10 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
        </span>

        <div>
          <div className="text-[8px] font-black uppercase tracking-[0.08em] text-emerald-700">
            Trusted Service
          </div>

          <div className="text-[7px] font-bold text-emerald-600/70">
            Transparent fares
          </div>
        </div>
      </div>

      {/* CALL CTA */}
      <a
        href={`tel:${PHONE}`}
        className="group flex min-h-11 items-center gap-2.5 rounded-xl bg-[#063B8F] px-4.5 text-white shadow-[0_9px_24px_rgba(6,59,143,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#052F73] hover:shadow-[0_13px_30px_rgba(6,59,143,0.28)] active:translate-y-0"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
          <Phone className="h-3.5 w-3.5" />
        </span>

        <div className="text-left">
          <div className="text-[7px] font-bold uppercase tracking-[0.1em] text-blue-100/70">
            Book your cab
          </div>

          <div className="text-[10px] font-black tracking-[0.02em]">
            Call Now
          </div>
        </div>
      </a>
    </div>

    {/* =====================================================
        MOBILE NAVIGATION
    ===================================================== */}
    <div className="flex items-center gap-1.5 lg:hidden">

      {/* HOME */}
      <Link
        href="/"
        aria-label="Go to Home"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#063B8F] shadow-sm transition active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4.5 w-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v10h14V9" />
          <path d="M9 19v-6h6v6" />
        </svg>
      </Link>

      {/* CALL */}
      <a
        href={`tel:${PHONE}`}
        className="flex h-10 items-center gap-2 rounded-xl bg-[#063B8F] px-3.5 text-white shadow-[0_7px_18px_rgba(6,59,143,0.20)] transition active:scale-[0.97]"
      >
        <Phone className="h-3.5 w-3.5" />

        <span className="text-[9px] font-black uppercase tracking-[0.08em]">
          Call Now
        </span>
      </a>
    </div>
  </div>
</header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#071B33]">
        <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-blue-100/55">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-amber-300">
              Fare Calculator
            </span>
          </div>

          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-amber-300">
                <Star className="h-3.5 w-3.5 fill-current" />
                Khatu Rides Travels Co.
              </div>

              <h1 className="mt-3 max-w-4xl text-3xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                Check your cab fare
                <span className="text-amber-400">
                  {" "}
                  before you book.
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-[11px] font-medium leading-5 text-blue-100/70 sm:text-xs">
                Enter your journey details, compare available vehicles and
                get your booking fare instantly.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <HeroTrust
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                  text="Transparent pricing"
                />

                <HeroTrust
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  text="Multiple vehicles"
                />

                <HeroTrust
                  icon={<Clock3 className="h-3.5 w-3.5" />}
                  text="24×7 support"
                />
              </div>
            </div>

            <div className="hidden rounded-[22px] border border-white/10 bg-white/[0.05] p-4 lg:block">
              <div className="grid grid-cols-3 gap-6 text-center">
                <MiniMetric
                  icon={<ShieldCheck />}
                  value="Clear"
                  label="Fare view"
                />

                <MiniMetric
                  icon={<Clock3 />}
                  value="24×7"
                  label="Support"
                />

                <MiniMetric
                  icon={<Users />}
                  value="Multiple"
                  label="Cars"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CALCULATOR
      ========================================================= */}
      <section className="-mt-1 px-3 pb-12 sm:px-5 lg:px-8 lg:pb-16">
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <FareCalculator
            onFareCalculated={(data) => {
              setResult(data);

              requestAnimationFrame(() => {
                document
                  .getElementById("fare-results")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              });
            }}
          />

          {/* =====================================================
              BEFORE RESULTS
          ===================================================== */}
          {!result && (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <BenefitCard
                icon={<ShieldCheck />}
                title="Route-based fare"
                text="Road distance is checked before outstation fare calculation."
              />

              <BenefitCard
                icon={<CheckCircle2 />}
                title="Compare available cars"
                text="Choose the vehicle that fits your journey and budget."
              />

              <BenefitCard
                icon={<Phone />}
                title="Direct booking support"
                text="Need help? Speak directly with the Khatu Rides team."
              />
            </div>
          )}

          {/* =====================================================
              RESULTS
          ===================================================== */}
          {result && (
            <section
              id="fare-results"
              className="mt-5 scroll-mt-24"
            >
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.11)]">
                {/* -------------------------------------------------
                    RESULTS HEADER
                ------------------------------------------------- */}
                <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:px-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-amber-600">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        Fare results
                      </div>

                      <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:text-2xl">
                        Choose your preferred cab
                      </h2>

                      <p className="mt-1 text-[9px] font-semibold text-slate-400">
                        Book online and get an additional{" "}
                        <span className="font-black text-emerald-600">
                          5% booking discount
                        </span>
                        .
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={reset}
                      className="flex min-h-10 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-[9px] font-black uppercase tracking-wider text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      New Search
                    </button>
                  </div>

                  {/* ROUTE SUMMARY */}
                  <div className="mt-4 grid gap-3 rounded-[20px] border border-slate-100 bg-[#F7F9FC] p-3 sm:grid-cols-[1fr_auto_1fr_auto_auto] sm:items-center">
                    <RoutePoint
                      label="Pickup"
                      value={result.pickup}
                      tone="green"
                    />

                    <div className="hidden h-px w-10 bg-slate-200 sm:block" />

                    <RoutePoint
                      label="Destination"
                      value={result.drop}
                      tone="red"
                    />

                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Clock3 className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                          Journey
                        </div>

                        <div className="truncate text-[10px] font-black text-slate-800">
                          {result.pickupDate} · {result.pickupTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------
                    VEHICLE RESULTS
                ------------------------------------------------- */}
                <div className="grid gap-3 p-3 sm:p-5 lg:grid-cols-3 lg:gap-4">
                  {result.fareOptions.map(
                    (option: any, index: number) => (
                      <FareResultCard
                        key={option.id || index}
                        result={result}
                        option={option}
                        recommended={index === 0}
                      />
                    )
                  )}
                </div>

                {/* -------------------------------------------------
                    BOTTOM BOOKING CTA
                ------------------------------------------------- */}
                <div className="border-t border-slate-100 bg-[#F7F9FC] px-4 py-5 sm:px-6 lg:px-7">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                          Ready to book your cab?
                        </div>

                        <div className="mt-0.5 text-[8px] font-semibold leading-4 text-slate-400">
                          Call or WhatsApp our booking team to confirm
                          vehicle availability.
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <a
                        href={`tel:${PHONE}`}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-[9px] font-black uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(6,59,143,0.20)] transition hover:-translate-y-0.5 hover:bg-[#052F73] active:translate-y-0"
                      >
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>

                      <a
                        href={
                          result.fareOptions?.[0]
                            ? getWhatsAppUrl(result, result.fareOptions[0])
                            : `https://wa.me/${WHATSAPP}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#18C964] px-5 text-[9px] font-black uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(24,201,100,0.20)] transition hover:-translate-y-0.5 hover:bg-[#12B457] active:translate-y-0"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Send Booking Enquiry
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-[#071B33] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-black tracking-[-0.03em]">
              Khatu
              <span className="text-amber-400">
                Rides
              </span>
            </div>

            <p className="mt-1 text-[9px] font-medium text-blue-100/55">
              Safe Journey · Blessed Destinations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[8px] font-black uppercase tracking-wider text-blue-100/60">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>•</span>

            <a
              href={`tel:${PHONE}`}
              className="transition hover:text-white"
            >
              Call
            </a>

            <span>•</span>

            <Link
              href="/fare-calculator"
              className="text-amber-300"
            >
              Fare Calculator
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ===============================================================
   FARE RESULT CARD
   =============================================================== */

function FareResultCard({
  result,
  option,
  recommended,
}: {
  result: FareResult;
  option: any;
  recommended: boolean;
}) {
  const discount = getDiscountedFare(option.finalFare);

  const distance =
    option.billedDistance ||
    option.actualDistance ||
    "—";

  const duration =
    option.durationMinutes ||
    "—";

  return (
    <article
      className={`group relative overflow-hidden rounded-[24px] border bg-white transition duration-300 ${
        recommended
          ? "border-[#B8D0F2] shadow-[0_18px_50px_rgba(6,59,143,0.12)] lg:-translate-y-1"
          : "border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
      } hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.13)]`}
    >
      {/* RECOMMENDED BADGE */}
      {recommended && (
        <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-[#FBBF24] px-3 py-1.5 text-[7px] font-black uppercase tracking-[0.08em] text-[#071B33] shadow-[0_8px_20px_rgba(251,191,36,0.28)]">
          <Star className="h-3 w-3 fill-current" />
          Recommended
        </div>
      )}

      {/* =========================================================
          VEHICLE IMAGE AREA
          Full-width / full-height image treatment
      ========================================================= */}
      <div className="relative h-[190px] overflow-hidden bg-slate-100 sm:h-[205px]">
        {/* soft image backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200" />

        {option.vehicleImage ? (
          <img
            src={option.vehicleImage}
            alt={option.vehicleLabel || "Cab"}
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Cab
            </div>
          </div>
        )}

        {/* bottom readability gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/20 to-transparent" />

        {/* VEHICLE NAME FLOATING LABEL */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="w-fit max-w-[90%] rounded-[16px] border border-white/80 bg-white/95 px-3.5 py-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.16)] backdrop-blur-md">
            <div className="text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">
              Vehicle
            </div>

            <h3 className="mt-0.5 text-[12px] font-black leading-4 tracking-[-0.02em] text-slate-950 sm:text-[13px]">
              {option.vehicleLabel || "Cab"}
            </h3>
          </div>
        </div>
      </div>

      {/* =========================================================
          PRICE AREA
      ========================================================= */}
      <div className="p-4 sm:p-4.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[7px] font-black uppercase tracking-[0.15em] text-slate-400">
              Payable now
            </div>

            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-[29px] font-black leading-none tracking-[-0.055em] text-[#063B8F]">
                {formatINR(discount.payable)}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 line-through">
                {formatINR(discount.original)}
              </span>

              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-emerald-700">
                5% OFF
              </span>
            </div>

            <div className="mt-1 text-[7px] font-bold text-slate-400">
              {distance} km billed distance
            </div>
          </div>

          {/* SAVING BADGE */}
          <div className="shrink-0 rounded-[15px] border border-emerald-100 bg-emerald-50 px-2.5 py-2 text-center">
            <div className="text-[6px] font-black uppercase tracking-[0.12em] text-emerald-600">
              You Save
            </div>

            <div className="mt-0.5 text-[12px] font-black text-emerald-700">
              {formatINR(discount.savings)}
            </div>
          </div>
        </div>

        {/* DISCOUNT MESSAGE */}
        <div className="mt-3 flex items-center gap-2 rounded-[14px] border border-amber-100 bg-amber-50 px-3 py-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#071B33]">
            <Zap className="h-3.5 w-3.5 fill-current" />
          </div>

          <div className="min-w-0">
            <div className="text-[8px] font-black text-amber-800">
              Online booking benefit
            </div>

            <div className="text-[7px] font-semibold text-amber-700/70">
              Save 5% on this displayed fare
            </div>
          </div>
        </div>

        {/* =======================================================
            QUICK SPECS
        ======================================================= */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ResultBenefit
            icon={<Check />}
            text="Fuel included"
          />

          <ResultBenefit
            icon={<Check />}
            text="Driver included"
          />

          <ResultBenefit
            icon={<Check />}
            text="24×7 support"
          />

          <ResultBenefit
            icon={<Check />}
            text="6h+ cancellation"
          />
        </div>

        {/* ROUTE META */}
        <div className="mt-3 flex items-center justify-between gap-2 rounded-[13px] bg-slate-50 px-3 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />

            <span className="truncate text-[7px] font-black uppercase tracking-wider text-slate-500">
              {distance} KM
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200" />

          <div className="flex shrink-0 items-center gap-1.5">
            <Clock3 className="h-3 w-3 text-slate-400" />

            <span className="text-[7px] font-black uppercase tracking-wider text-slate-500">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* =======================================================
            BOOKING CTA
        ======================================================= */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={`tel:${PHONE}`}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-[13px] bg-[#063B8F] px-2 text-[8px] font-black uppercase tracking-[0.05em] text-white shadow-[0_10px_22px_rgba(6,59,143,0.20)] transition hover:-translate-y-0.5 hover:bg-[#052F73] active:translate-y-0"
          >
            <Phone className="h-3.5 w-3.5" />
            Book by Call
          </a>

          <a
            href={getWhatsAppUrl(result, option)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-[13px] bg-[#18C964] px-2 text-[8px] font-black uppercase tracking-[0.05em] text-white shadow-[0_10px_22px_rgba(24,201,100,0.20)] transition hover:-translate-y-0.5 hover:bg-[#12B457] active:translate-y-0"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Enquire on WhatsApp
          </a>
        </div>

        {/* CONFIRMATION MICRO COPY */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center">
          <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-500" />

          <span className="text-[6.5px] font-bold text-slate-400">
            Confirm availability with our booking team
          </span>
        </div>
      </div>
    </article>
  );
}

/* ===============================================================
   RESULT BENEFIT
   =============================================================== */

function ResultBenefit({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-[12px] bg-slate-50 px-2.5 py-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
        {icon}
      </span>

      <span className="truncate text-[7px] font-bold text-slate-600">
        {text}
      </span>
    </div>
  );
}

/* ===============================================================
   HERO TRUST
   =============================================================== */

function HeroTrust({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[8px] font-bold text-blue-100/65">
      <span className="text-emerald-300">
        {icon}
      </span>

      {text}
    </div>
  );
}

/* ===============================================================
   MINI METRIC
   =============================================================== */

function MiniMetric({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-amber-300">
        {icon}
      </div>

      <div className="mt-1 text-[9px] font-black text-white">
        {value}
      </div>

      <div className="text-[7px] font-bold text-blue-100/50">
        {label}
      </div>
    </div>
  );
}

/* ===============================================================
   BENEFIT CARD
   =============================================================== */

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-100">
        {icon}
      </div>

      <h3 className="mt-3 text-[11px] font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-[9px] font-semibold leading-4 text-slate-400">
        {text}
      </p>
    </div>
  );
}

/* ===============================================================
   ROUTE POINT
   =============================================================== */

function RoutePoint({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "red";
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-wider text-slate-400">
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            tone === "green"
              ? "bg-emerald-500"
              : "bg-rose-500"
          }`}
        />

        {label}
      </div>

      <div className="mt-1 truncate text-[10px] font-black text-slate-900">
        {value}
      </div>
    </div>
  );
}