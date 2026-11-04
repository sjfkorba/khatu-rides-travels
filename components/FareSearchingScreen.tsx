"use client";

import { useEffect, useState } from "react";
import { CarFront, Check, Circle, MapPin, Route, Sparkles } from "lucide-react";

type Props = { pickup: string; drop: string };

const steps = [
  "Checking available cars",
  "Calculating fares & offers",
  "Applying route & festival pricing",
  "Finding the best cab options",
];

export default function FareSearchingScreen({ pickup, drop }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }, 1500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-[65vh] w-full items-center justify-center bg-[#fffaf5] px-3 py-6 text-slate-900 sm:min-h-[70vh] sm:px-5">
      <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-orange-100 bg-white px-4 py-5 shadow-[0_12px_36px_rgba(234,88,12,0.10)] sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-orange-50 ring-4 ring-orange-50">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200">
              <CarFront size={34} strokeWidth={1.7} className="animate-pulse" />
              <span className="absolute -top-2 rounded-full border border-orange-500 bg-white px-2 py-0.5 text-[9px] font-black tracking-widest text-orange-600">
                TAXI
              </span>
              <span className="absolute -bottom-1 right-0 h-2.5 w-2.5 animate-ping rounded-full bg-orange-400" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-orange-700 sm:text-[10px]">
              <Sparkles size={12} /> Khatu Rides · Smart Fare Search
            </p>
            <h1 className="mt-2 text-lg font-black leading-tight tracking-tight sm:text-xl">
              Finding the Best Cabs
              <span className="block text-orange-600">for Your Trip</span>
            </h1>

            <div className="mx-auto mt-3 grid max-w-sm grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2.5 text-left">
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin size={14} className="shrink-0 text-orange-600" />
                <span className="truncate text-[10px] font-bold sm:text-xs">{pickup || "Pickup location"}</span>
              </div>
              <Route size={15} className="text-orange-400" />
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin size={14} className="shrink-0 text-orange-600" />
                <span className="truncate text-[10px] font-bold sm:text-xs">{drop || "Selected package"}</span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-sm space-y-2">
            {steps.map((label, index) => {
              const done = index < step;
              const active = index === step;

              return (
                <div
                  key={label}
                  className={`flex min-h-8 items-center gap-2.5 text-[11px] font-semibold sm:text-xs ${
                    active ? "text-orange-700" : done ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-green-100 text-green-700"
                        : active
                          ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? (
                      <Check size={13} />
                    ) : active ? (
                      <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                    ) : (
                      <Circle size={12} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">{label}{active ? "..." : ""}</span>
                  {active && <span className="text-[8px] font-extrabold tracking-wide text-orange-500 sm:text-[9px]">IN PROGRESS</span>}
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <p className="mt-2 text-center text-[9px] font-medium text-slate-500 sm:text-[10px]">
            Please wait while we find your best available fare.
          </p>
        </div>
      </section>
    </main>
  );
}
