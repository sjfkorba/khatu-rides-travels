"use client";

import FareCalculator from "@/components/FareCalculator";
import ImageCarousel from "@/components/ImageCarousel";
import Reviews from "@/components/Reviews";
import Fleet from "@/components/landing/Fleet";
import Navbar from "@/components/landing/Navbar";
import PopularRoutes from "@/components/landing/PopularRoutes";
import QuickServices from "@/components/landing/QuickServices";
import TourPackages from "@/components/landing/TourPackages";
import { PHONE_DISPLAY } from "@/components/landing/data";
import { MapPin, ShieldCheck, CarFront, PhoneCall } from "lucide-react";

const serviceAreas = [
  "Raipur",
  "Korba",
  "Bilaspur",
  "Raigarh",
  "Jharsuguda",
  "Jagdalpur",
  "Ambikapur",
  "Durg Bhilai",
];

export default function FareCalculatorPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffaf5] text-slate-900">
      <Navbar />

      {/* Hero with the fare calculator layered over the background image */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/splash-bg.png')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-slate-950/60"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-3 pb-8 pt-7 sm:px-6 sm:pb-10 sm:pt-9 lg:px-10 lg:pt-10">
          <div className="mx-auto mb-5 max-w-5xl text-center sm:mb-7">
           
            <h1 className="text-2xl font-black uppercase leading-tight tracking-tight text-white drop-shadow sm:text-4xl lg:text-[54px]">
              SERVICES FROM ACROSS CHHATTISGARH TO PAN INDIA
            </h1>
          
          </div>

          <div className="relative z-10 mx-auto max-w-[1240px] rounded-2xl bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] ring-1 ring-white/70 sm:rounded-[24px] sm:p-5 lg:p-6">
            <FareCalculator onFareCalculated={() => {}} />
          </div>

          <div className="mx-auto mt-6 max-w-[1240px] rounded-2xl border border-white/25 bg-white/95 px-3 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.16)] backdrop-blur sm:mt-7 sm:px-5 sm:py-4">
            <div className="mb-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-800 sm:text-xs">
              <MapPin className="h-4 w-4 text-orange-600" />
              Our Service Areas
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-slate-800 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-5 text-[10px] font-semibold text-slate-600 sm:py-6 sm:text-xs">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Transparent Pricing
        </span>
        <span className="flex items-center gap-1.5">
          <CarFront className="h-4 w-4 text-orange-600" />
          Multiple Vehicle Options
        </span>
        <a href="tel:9244137353" className="flex items-center gap-1.5 hover:text-orange-700">
          <PhoneCall className="h-4 w-4 text-orange-600" />
          24×7 Support · {PHONE_DISPLAY}
        </a>
      </section>

       <QuickServices />
       <ImageCarousel/>
             <PopularRoutes />
             <TourPackages />
             <Fleet />
             <Reviews/>
    </main>
  );
}
