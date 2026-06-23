"use client";

import { useEffect, useState } from "react";
import FareCalculator from "@/components/FareCalculator";
import TopBar from "@/components/TopBar";

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Animated Sticky Top Header */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <TopBar />
      </div>

      <main className="min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden pt-16">
        
        {/* --- DYNAMIC HIGH-CONVERTING HERO SECTION (Ultra-Compact Version) --- */}
        {/* Heavily optimized padding heights (pt-3 pb-6 lg:pt-6 lg:pb-10) to secure perfect fold visibility */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-3 pb-6 lg:pt-6 lg:pb-10 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[250px] w-[750px] bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              
              {/* Premium One Way Taxi Partner Badge - Compressed */}
              <div className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
                ✨ One Way Taxi Partner
              </div>

              {/* Taglines Row - Scaled Down */}
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-extrabold text-orange-400/90 tracking-widest uppercase">
                <span>Luxury</span>
                <span className="text-slate-700">•</span>
                <span>Reliability</span>
                <span className="text-slate-700">•</span>
                <span>Excellence</span>
              </div>

              {/* Ultra-Compact Main Heading */}
              <h1 className="mt-1.5 text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Book Safe & Reliable Cabs{" "}
                <span className="block sm:inline bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Across Chhattisgarh
                </span>
              </h1>

              {/* Micro Description Paragraph - Hidden on Mobile, Highly Compact on Desktop */}
              <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-slate-300/80 font-normal hidden sm:block">
                Premium intercity travel with absolute billing transparency. Instantly calculated live fares with standard highway tolls included upfront.
              </p>

              {/* FULL WIDTH HIGH-VISIBILITY CALCULATOR CONTAINER FRAME */}
              {/* Width is wide layout (max-w-5xl) for clear name viewports, margins are tightened for fold protection */}
              <div className="mt-4 w-full max-w-5xl transition-all duration-300 drop-shadow-[0_12px_30px_rgba(0,0,0,0.4)] z-20">
                <div className="bg-white rounded-2xl md:rounded-3xl p-1 md:p-2 border border-slate-200 shadow-2xl relative">
                  {/* Mobile Pull Handle Indicator */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 rounded-full md:hidden mt-1" />
                  <div className="pt-2 md:pt-0">
                    <FareCalculator />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- PREMIUM SERVICE ADVANTAGES --- */}
        <section className="py-12 md:py-16 bg-white relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-inner">🛡️</div>
                <h3 className="text-base font-bold text-slate-900 mt-3">Safe Verified Network</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Every operator in our 35+ member state collective undergoes continuous background tracking.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shadow-inner">🧾</div>
                <h3 className="text-base font-bold text-slate-900 mt-3">Transparent Fixed Billing</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Fares calculated using the Khatu Rides algorithm are all-inclusive, handling regular tolls upfront.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-inner">🚘</div>
                <h3 className="text-base font-bold text-slate-900 mt-3">Top Fleet Choices</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Select between fuel-efficient Dzire models or heavily spacious premium MPVs like Ertiga and Innova.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEO REGIONAL TRAVEL HUBS SECTION --- */}
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Our Core Travel Hubs & Cities
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: "Raipur", desc: "Capital Transfers & Airport Pickups" },
                { name: "Korba", desc: "Industrial Hub Intercity Travel" },
                { name: "Bilaspur", desc: "High Court & Station Connections" },
                { name: "Raigarh", desc: "Corporate Enterprise Car Rental" },
                { name: "Durg - Bhilai", desc: "Twin City Fast Highway Commutes" },
                { name: "Jagdalpur", desc: "Bastar Heritage & Leisure Tours" },
                { name: "Jharsuguda", desc: "Inter-State Border Connect Deals" },
                { name: "All CG Routes", desc: "35+ Active Fleet Group Coverage" }
              ].map((city, idx) => (
                <div key={idx} className="rounded-xl bg-white border border-slate-200 p-3 sm:p-5 hover:border-indigo-500 hover:shadow-md transition-all group cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 sm:px-2 py-0.5 rounded border border-slate-200">HUB 0{idx+1}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 sm:mt-3 group-hover:text-indigo-600 transition-colors">{city.name}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-normal font-medium">{city.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HIGHWAY SEO RICH TEXT CONTENT --- */}
        <section className="py-12 md:py-16 bg-white border-t border-slate-200 mb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none mb-10 md:mb-14">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-4">
                Why Khatu Rides is Chhattisgarh's Preferred Taxi Service
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-center">
                When it comes to booking a taxi service in Raipur, Bilaspur, or Korba, reliability and fair pricing are critical. Khatu Rides was created to bridge the gap between regional travelers and verified local fleet networks. By coordinating an expert group of 35+ professional taxi operators across Chhattisgarh, we bring you structural support, real-time computerized outstation fare quotes, and comfortable long-distance travel without typical highway booking hassles.
              </p>
            </div>
          </div>
        </section>

        {/* --- BOTTOM COLUMN FLOATING FLICKER ACTION BUTTONS --- */}
        <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 md:hidden">
          <a
            href="tel:+919244137353"
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow-[0_4px_15px_rgba(37,99,235,0.4)] border border-blue-400 hover:scale-110 transition-transform active:scale-95 group relative"
          >
            <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
            <span>📞</span>
          </a>

          <a
            href="https://wa.me/919244137353?text=Hello%20Khatu%20Rides%20Travels%2C%20I%20want%20to%20book%20a%20cab%20instantly."
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-[0_4px_15px_rgba(16,185,129,0.4)] border border-emerald-400 hover:scale-110 transition-transform active:scale-95 group relative"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
            <span>💬</span>
          </a>
        </div>

      </main>
    </>
  );
}