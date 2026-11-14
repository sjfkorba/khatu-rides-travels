"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  CarFront,
  MapPin,
  Route,
  ShieldCheck,
  Wallet,
  Clock3,
  Navigation,
  Sparkles,
  IndianRupee,
  Info,
  ArrowUpRight,
} from "lucide-react";

type FareRow = {
  vehicleType: string;
  label: string;
  distance: number;
  durationMinutes: number;
  b2cFinalFare?: number;
  b2cMin?: number;
  b2cMax?: number;
  b2b: number;
};

const roundToHundred = (amount: number) =>
  Math.round(Math.max(0, Number(amount) || 0) / 100) * 100;

const INR = (amount: number) =>
  `₹${roundToHundred(amount).toLocaleString("en-IN")}`;

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
}

function bookingLabel(serviceType: string, bookingType: string) {
  if (serviceType === "local") return "Local package";
  if (bookingType === "roundtrip") return "Round trip";
  if (bookingType === "shared") return "Shared taxi";
  return "One way";
}

function FareResultsContent() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") ?? "";
  const drop = searchParams.get("drop") ?? "";
  const bookingType = searchParams.get("bookingType") ?? "oneway";
  const serviceType = searchParams.get("serviceType") ?? "outstation";
  const distance = Number(searchParams.get("distance") ?? 0);

  const results = useMemo<FareRow[]>(() => {
    try {
      const parsed = JSON.parse(searchParams.get("results") ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [searchParams]);

  const mapSrc = useMemo(() => {
    if (serviceType === "local" || !drop) {
      return `https://www.google.com/maps?q=${encodeURIComponent(pickup)}&output=embed`;
    }
    return `https://www.google.com/maps?output=embed&saddr=${encodeURIComponent(
      pickup
    )}&daddr=${encodeURIComponent(drop)}`;
  }, [pickup, drop, serviceType]);

  const validFares = results
    .map((row) => Number(row.b2cFinalFare ?? row.b2cMin ?? 0))
    .filter((fare) => fare > 0);
  const bestCustomerFare = validFares.length ? Math.min(...validFares) : 0;

  return (
    <main className="min-h-screen bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto max-w-6xl space-y-5 px-3 pb-8 pt-4 sm:space-y-6 sm:px-6 sm:pt-7">
        {/* High-contrast summary header */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-900">
                <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                Khatu Rides · Admin Workspace
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Fare summary
              </h1>
              <p className="mt-1.5 text-sm font-medium text-slate-600">
                Route details and vehicle-wise fare estimates
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-800 sm:h-14 sm:w-14">
              <Route className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Navigation className="h-4 w-4 text-blue-700" />
                Total distance
              </div>
              <p className="mt-2 text-2xl font-black tabular-nums text-slate-950">
                {distance || "—"}{" "}
                <span className="text-sm font-bold text-slate-600">km</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CarFront className="h-4 w-4 text-blue-700" />
                Trip category
              </div>
              <p className="mt-2 text-xl font-black text-slate-950">
                {bookingLabel(serviceType, bookingType)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Quote status
              </div>
              <p className="mt-2 text-xl font-black text-slate-950">
                Internal estimate
              </p>
            </div>
          </div>
        </section>

        {/* Route card */}
        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
            <div>
              <h2 className="text-base font-black text-slate-950 sm:text-lg">
                Journey route
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-600">
                Google Maps route overview
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified route view
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr]">
            <div className="p-4 pt-2 sm:p-5 sm:pt-3">
              <div className="relative space-y-5 pl-1">
                <div className="absolute left-[9px] top-5 h-[calc(100%-42px)] border-l-2 border-dashed border-slate-300" />
                <div className="relative flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-700" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                      Pickup point
                    </p>
                    <p className="mt-1 break-words text-sm font-extrabold leading-5 text-slate-900">
                      {pickup || "Pickup not provided"}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 ring-4 ring-white">
                    <MapPin className="h-3 w-3 text-rose-700" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                      {serviceType === "local" ? "Service type" : "Drop point"}
                    </p>
                    <p className="mt-1 break-words text-sm font-extrabold leading-5 text-slate-900">
                      {serviceType === "local"
                        ? "Local package"
                        : drop || "Drop not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-700">
                <Clock3 className="h-4 w-4 text-blue-800" />
                <span>
                  Route distance:{" "}
                  <strong className="text-slate-950">{distance || "—"} km</strong>
                </span>
              </div>
            </div>

            <div className="min-h-[250px] border-t border-slate-200 bg-slate-100 md:min-h-[300px] md:border-l md:border-t-0">
              <iframe
                title="Google Maps route"
                src={mapSrc}
                className="h-full min-h-[250px] w-full border-0 md:min-h-[300px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Vehicle fares */}
        <section>
          <div className="mb-3 flex items-end justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                Choose vehicle quote
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                Customer fare and vendor estimate shown separately
              </p>
            </div>
            <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold text-blue-900 sm:inline-flex">
              {results.length} vehicle options
            </span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950 shadow-sm">
              <div className="flex items-center gap-2 font-black">
                <Info className="h-4 w-4" />
                Fare details unavailable
              </div>
              <p className="mt-1.5 leading-5">
                Fare details URL mein nahi mile. Admin Fare Calculator se dobara
                calculate karein.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {results.map((row) => {
                const finalB2C = Number(row.b2cFinalFare ?? row.b2cMin ?? 0);
                const vendorMin = roundToHundred(Number(row.b2b || 0) * 0.95);
                const vendorMax = roundToHundred(Number(row.b2b || 0) * 1.05);
                const indicativeMargin = Math.max(
                  0,
                  roundToHundred(finalB2C) - vendorMax
                );
                const isLowest =
                  finalB2C > 0 && finalB2C === bestCustomerFare;

                return (
                  <article
                    key={row.vehicleType}
                    className={`relative overflow-hidden rounded-[26px] border bg-white shadow-[0_9px_28px_rgba(15,23,42,0.055)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,23,42,0.09)] ${
                      isLowest
                        ? "border-blue-300 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    {isLowest && (
                      <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-blue-900">
                        <Sparkles className="h-3 w-3" />
                        Lowest quote
                      </div>
                    )}

                    <div className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                        <CarFront className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 pr-20">
                        <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
                          {row.label}
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-600">
                          <span>{row.distance} km</span>
                          <span className="h-1 w-1 rounded-full bg-slate-400" />
                          <span>{formatDuration(row.durationMinutes)}</span>
                        </p>
                      </div>
                      <div className="ml-auto hidden shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-extrabold text-slate-700 sm:block">
                        {bookingLabel(serviceType, bookingType)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                      <div className="relative overflow-hidden rounded-[20px] bg-[#861b2b] p-4 text-white shadow-sm">
                        <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full bg-white/10" />
                        <div className="relative">
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-rose-50">
                            <IndianRupee className="h-3.5 w-3.5" />
                            Customer fare · B2C
                          </div>
                          <p className="mt-3 text-[28px] font-black leading-none tracking-tight tabular-nums sm:text-[30px]">
                            {INR(finalB2C)}
                          </p>
                          <p className="mt-2 text-[10px] font-semibold text-rose-50">
                            Final portal quote · single fare
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[20px] border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-orange-900">
                          <Wallet className="h-3.5 w-3.5" />
                          Vendor estimate · B2B
                        </div>
                        <p className="mt-3 text-xl font-black leading-none tracking-tight text-orange-950 tabular-nums sm:text-2xl">
                          {INR(vendorMin)} – {INR(vendorMax)}
                        </p>
                        <p className="mt-2 text-[10px] font-semibold text-orange-900">
                          Confidential · indicative ±5% band
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
                      <div>
                        <p className="text-[10px] font-bold text-slate-600">
                          Indicative margin after vendor max
                        </p>
                        <p className="mt-0.5 text-lg font-black text-emerald-800 tabular-nums">
                          {INR(indicativeMargin)}
                        </p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-800 shadow-sm">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex gap-3 rounded-[20px] border border-blue-200 bg-blue-50 p-4 text-[11px] leading-5 text-blue-950">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />
            <div>
              <p className="font-black">Pricing information</p>
              <p className="mt-1 font-medium">
                B2C final fare should be passed from the same Customer Portal
                calculation flow, including applicable engine rules and active
                fare adjustments. B2B is an independent vendor estimate; its
                ±5% band is indicative, not a confirmed supplier quote. Toll,
                parking, permits and other actual charges may be additional.
              </p>
            </div>
          </div>
        </section>

        <footer className="pb-2 text-center text-[10px] font-semibold tracking-wide text-slate-500">
          KHATU RIDES TRAVELS CO. · ADMIN PRICING WORKSPACE
        </footer>
      </div>
    </main>
  );
}

export default function FareResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f3f5f9] p-6 text-slate-900">
          <div className="rounded-3xl border border-slate-200 bg-white px-7 py-6 text-center shadow-lg">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
              <Route className="h-5 w-5 animate-pulse" />
            </div>
            <p className="font-black text-slate-950">Loading fare results…</p>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Khatu Rides Admin
            </p>
          </div>
        </main>
      }
    >
      <FareResultsContent />
    </Suspense>
  );
}
