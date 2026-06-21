import FareCalculator from "@/components/FareCalculator";
import TopBar from "@/components/TopBar";
import { Metadata } from "next";

// Strong SEO Meta tags directly optimized for Chhattisgarh Cab Market
export const metadata: Metadata = {
  title: "Khatu Rides Travels | Best Cab Booking Service in Chhattisgarh",
  description: "Book safe, affordable one-way, round-trip, and local taxis in Raipur, Korba, Bilaspur, Raigarh, Jagdalpur, Durg-Bhilai, & Jharsuguda. 35+ Professional Network Group Fleet.",
  keywords: "Cab Booking Raipur, Taxi Service Korba, Bilaspur Car Rental, Raigarh Taxi, Jharsuguda Outstation Cab, Jagdalpur Travel, Durg Bhilai Taxi Service, Chhattisgarh Rides",
};

export default function HomePage() {
  return (
    <>
      <TopBar />

      <main className="min-h-screen bg-[#070b14] text-slate-200 antialiased overflow-x-hidden">
        
        {/* --- HERO HEADER SECTION (Mobile First Layout Optimization) --- */}
        <section className="relative overflow-hidden pt-6 pb-16 md:py-24">
          {/* Neon Subtle Gradient Accents */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_45%)]" />
          <div className="absolute -left-20 top-20 h-72 w-72 bg-blue-600/10 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile: flex-col-reverse ensures FareCalculator stays on top!
              Desktop: Normal lg:grid grid structure splits side-by-side.
            */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_1fr] gap-10 lg:items-center">
              
              {/* Left Side: Content Block (Appears Below Form on Mobile) */}
              <div className="text-center lg:text-left mt-8 lg:mt-0">
                <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  ✨ Premium Taxi Network Group
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl text-white">
                  Book Safe & Reliable Cabs
                  <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                    Across Chhattisgarh
                  </span>
                </h1>

                <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed text-slate-400">
                  Get absolute transparency with instantly calculated live fares. Compare premium 5-Seater Sedans to luxury 7-Seater Ertiga & Innova models. Book instantly on WhatsApp.
                </p>

                {/* Micro Metrics Grid */}
                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-800/60 pt-6 max-w-md mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <span className="block text-2xl font-black text-white">35+</span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Group Fleet</span>
                  </div>
                  <div className="text-center lg:text-left border-x border-slate-800/60 px-2">
                    <span className="block text-2xl font-black text-cyan-400">0₹</span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hidden Fees</span>
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="block text-2xl font-black text-white">24/7</span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Support</span>
                  </div>
                </div>
              </div>

              {/* Right Side: FareCalculator (Appears FIRST on Mobile) */}
              <div className="w-full max-w-md mx-auto lg:max-w-none">
                <FareCalculator />
              </div>

            </div>
          </div>
        </section>

        <hr className="border-slate-900 mx-auto max-w-7xl" />

        {/* --- SEO AREA HUBS SECTION --- */}
        <section className="py-16 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Our Core Travel Hubs & Cities
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Connecting prime commercial & cultural districts with non-stop premium availability.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {[
                { name: "Raipur", desc: "Capital Connect & Airport Pickups" },
                { name: "Korba", desc: "Industrial City & Local Packages" },
                { name: "Bilaspur", desc: "High Court & Station Transfers" },
                { name: "Raigarh", desc: "Corporate Travel & Dynamic Drops" },
                { name: "Durg - Bhilai", desc: "Twin City Daily Route Commute" },
                { name: "Jagdalpur", desc: "Bastar Tourism & Leisure Trips" },
                { name: "Jharsuguda", desc: "Inter-State Border Connect Deals" },
                { name: "All CG Routes", desc: "35+ Fleet Group Network Scope" }
              ].map((city, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-slate-900/40 border border-slate-800/50 p-4 hover:border-cyan-500/30 transition-all group"
                >
                  <span className="text-xs bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded-md">Hub 0{idx+1}</span>
                  <h3 className="text-base font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">{city.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">{city.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-slate-900 mx-auto max-w-7xl" />

        {/* --- PREMIUM SERVICE ADVANTAGES --- */}
        <section className="py-16 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-900/20 border border-slate-900 p-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">🛡️</div>
                <h3 className="text-base font-bold text-white mt-4">Safe Verified Network</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Every driver in our 35+ member state group undergoes strict background validation. Experience maximum safety during nighttime journeys.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/20 border border-slate-900 p-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">🧾</div>
                <h3 className="text-base font-bold text-white mt-4">Toll Taxes Included</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  No hidden cost arguments during highway tolls. Fares calculated using Khatu Rides algorithm explicitly cover standard highway tolls beforehand.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/20 border border-slate-900 p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">🚘</div>
                <h3 className="text-base font-bold text-white mt-4">Top Fleet Choices</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Choose exactly what matches your style. Compact premium 5-seater sedans or heavily spacious premium 7-seater vehicles like Ertiga, Innova Crysta, and Scorpio.
                </p>
              </div>
            </div>
          </div>
        </section>



      </main>
    </>
  );
}