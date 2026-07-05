"use client";

import FareCalculator from "./FareCalculator";

interface FareCalculatorHeroProps {
  onFareCalculated: (data: any) => void;
}

export default function FareCalculatorHero({
  onFareCalculated,
}: FareCalculatorHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] min-h-[720px] md:min-h-[760px]">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.88),rgba(15,23,42,0.55),rgba(249,115,22,0.18))]" />

      <div className="absolute inset-0 backdrop-blur-[3px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 h-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center min-h-[640px]">
          <div className="text-white max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-black">
              Premium Chauffeur Driven Rides
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              Safe night rides, outstation cabs and airport transfers with fixed
              fares
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-white/80 max-w-xl leading-7">
              Book reliable cabs with trained drivers, transparent pricing and
              quick support for local, airport and outstation travel.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4">
                <p className="text-2xl font-black">24x7</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/70 mt-1">
                  Live support
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4">
                <p className="text-2xl font-black">100%</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/70 mt-1">
                  Fare clarity
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4">
                <p className="text-2xl font-black">Fast</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/70 mt-1">
                  Booking flow
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 blur-2xl rounded-[36px]" />
            <div className="relative">
              <FareCalculator onFareCalculated={onFareCalculated} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}