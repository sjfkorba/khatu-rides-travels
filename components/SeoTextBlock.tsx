// components/SeoTextBlock.tsx
"use client";

import React, { useState } from "react";
import { calculateFare } from "@/lib/fareCalculator";

// =========================================================================
// 🗺️ HIGH-AUTHORITY HYPER-LOCAL CHHATTISGARH ROUTE & AREA DIRECTORY (SEO MAGNET)
// =========================================================================
const MASTER_ROUTES_DATABASE = {
  korba: [
    { 
      to: "Raipur Airport", 
      km: 210, 
      desc: "Instant pickup across BALCO township, NTPC Jamnipali, Gevra Mines, Dipka Area, and Katghora outer loops. Experience direct dynamic transport directly to Swami Vivekananda Airport (RPR) with flat per-kilometer pricing." 
    },
    { 
      to: "Bilaspur Junction", 
      km: 90, 
      desc: "Frequent business highway corridor starting from Transport Nagar, Urga, and Kusmunda coal zones to Bilaspur Railway station, Sarkanda, and High Court Bodri areas." 
    },
    { 
      to: "Raigarh Coal Belt", 
      km: 150, 
      desc: "Industrial commercial loop optimized for site managers traveling between Korba SECL sectors and Raigarh industrial power corridors, covering Chhal and Gharghoda mining borders." 
    },
    { 
      to: "Champa Junction", 
      km: 55, 
      desc: "Sleek feeder taxi service from local thermal zones to Champa Junction railway station, bridging Urga, Katghora, and regional rural administrative hubs smoothly." 
    },
    { 
      to: "Janjgir Core", 
      km: 65, 
      desc: "Fast outstation rides across state administrative corridors connecting the local municipal centers of Janjgir-Champa district directly with central Korba and industrial sectors." 
    },
    { 
      to: "Ambikapur Hub", 
      km: 160, 
      desc: "Surguja district highway loop connecting Katghora bypass, Pali hills, and Ambikapur core markets. Perfect gateway for mining experts and tourists heading to the scenic Mainpat hill station." 
    }
  ],
  raipur: [
    { 
      to: "Bilaspur Business", 
      km: 120, 
      desc: "The busiest twin-city business corridor in Central India. Coverage extends from Tatibandh, Pachpedi Naka, and Pandri cloth market to Bilaspur Vyapar Vihar, Uslapur, and Nyayadhani high-court zones." 
    },
    { 
      to: "Durg Bhilai Twin", 
      km: 40, 
      desc: "High-frequency micro-corridor connecting Raipur Lalpur and VIP Road neighborhoods to Bhilai Steel Plant sectors, Kumhari bypass, and Durg Junction with immediate dispatch." 
    },
    { 
      to: "Raigarh Industry", 
      km: 250, 
      desc: "Premium long-distance highway taxi designed for corporate delegates and industrial stakeholders moving between Raipur financial hubs and Raigarh metallurgical plants." 
    },
    { 
      to: "Ambikapur North", 
      km: 330, 
      desc: "NH-130 north highway link running from Raipur outer ring road, past Katghora bypass, up to the Surguja plateau. Gateway to mining clusters and Mainpat tourist networks." 
    },
    { 
      to: "Jharsuguda Interstate", 
      km: 340, 
      desc: "Cross-border interstate business outstation cab connecting Raipur industrial yards to Jharsuguda coal blocks and airport zones with pre-arranged road permits." 
    },
    { 
      to: "Jagdalpur Bastar", 
      km: 290, 
      desc: "Seamless travel solutions from Raipur city and Lalpur sectors down south via Kanker-Keskal valley road to the heart of Bastar tourism at Jagdalpur and Chitrakoot falls." 
    }
  ],
  bilaspur: [
    { 
      to: "Raigarh Link", 
      km: 160, 
      desc: "Connecting SECR Railway headquarters in Bilaspur (Sarkanda, Tifra, Vyapar Vihar) to Raigarh commercial yards, steel sectors, and adjacent energy hubs with flat oneway slabs." 
    },
    { 
      to: "Ambikapur Route", 
      km: 240, 
      desc: "North-bound mountain corridor starting from Sakri or Uslapur station, running through Katghora highways, straight into Surguja mining circuits and Mainpat travel bases." 
    },
    { 
      to: "Jharsuguda Junction", 
      km: 250, 
      desc: "Interstate trading outstation taxi routing from Bilaspur Nyayadhani sectors past Raigarh directly into Jharsuguda industrial town bypass with fully experienced drivers." 
    },
    { 
      to: "Janjgir Champa", 
      km: 60, 
      desc: "Reliable local transit connecting Sakri, Tifra, and Bilaspur city to Champa business circles and agricultural wholesale nodes under optimized minimum slab rules." 
    },
    { 
      to: "Ratanpur Temple", 
      km: 30, 
      desc: "Custom spiritual tourism ride loop from Bilaspur city directly to the sacred Maa Mahamaya Mandir in historical Ratanpur city. Spacious MUV Ertiga fleets available." 
    }
  ],
  raigarh: [
    { 
      to: "Jharsuguda Gateway", 
      km: 75, 
      desc: "Critical cross-border mining transit route. Get top-class sedan pickups across Raigarh city, Gharghoda, and Tamnar coal fields directly to Jharsuguda Railway junction and industrial parks." 
    },
    { 
      to: "Ambikapur Surguja", 
      km: 210, 
      desc: "High-altitude forest-track outstation cab managed by terrain-expert drivers. Links Raigarh steel plants directly to northern mining nodes and Surguja administrative sectors." 
    },
    { 
      to: "Jashpur Hills", 
      km: 160, 
      desc: "Hilly terrain route connecting eastern Chhattisgarh mineral zones to Jashpur administrative headquarters. Secure transit on competitive dynamic pricing blocks." 
    }
  ],
  ambikapur: [
    { 
      to: "Manendragarh Hub", 
      km: 110, 
      desc: "East-west northern corridor linking the Surguja administrative hub directly to the Manendragarh mining belt, coal blocks, and local railway yards with flat fare security." 
    },
    { 
      to: "Baikunthpur Core", 
      km: 85, 
      desc: "Clean administrative transit route for corporate teams and government officials routing outstation past hilly sectors with complete on-trip driver assistance." 
    }
  ]
};

type OriginCity = keyof typeof MASTER_ROUTES_DATABASE;

export default function SeoTextBlock() {
  const [activeOrigin, setActiveOrigin] = useState<OriginCity>("korba");

  return (
    <section 
      className="bg-slate-950 text-slate-300 py-16 px-6 text-xs leading-relaxed border-t border-slate-900 text-left relative z-20"
      aria-labelledby="seo-text-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950 pointer-events-none opacity-40" />
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        
        {/* Core Header Node with Semantic SEO Target */}
        <header className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Interactive Highway Directory
            </span>
          </div>
          <h2 id="seo-text-heading" className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            Khatu Rides Travels Co. — Premium Car Rental & Outstation Intercity Taxi Solutions in Chhattisgarh
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Comprehensive travel blueprint, dynamic route architecture, and direct outstation fares for <a href="https://www.khaturidescg.in" className="text-orange-500 hover:underline">www.khaturidescg.in</a>.
          </p>
        </header>

        {/* 👑 THE ROUTE DIRECTORY SYSTEM (ORGANIC BOT MAGNET) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Explore Active One-Way Outstation Corridors
            </h3>
            
            {/* Origin Quick Selectors (Flutter-inspired Pills) */}
            <div className="flex flex-wrap gap-1.5 bg-white/[0.03] border border-white/5 p-1 rounded-2xl">
              {(Object.keys(MASTER_ROUTES_DATABASE) as OriginCity[]).map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveOrigin(city)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    activeOrigin === city 
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Interactive Cards with Glassmorphism & Hover Highlights */}
          <div className="grid gap-4 sm:grid-cols-2">
            {MASTER_ROUTES_DATABASE[activeOrigin].map((route, index) => {
              // Calculate Real-Time Fares Dynamically from our master calculation core
              const sedanFare = calculateFare({
                distance: route.km,
                vehicleType: "sedan",
                bookingType: "oneway",
              });
              const ertigaFare = calculateFare({
                distance: route.km,
                vehicleType: "ertiga",
                bookingType: "oneway",
              });

              return (
                <article
                  key={`${activeOrigin}-${route.to}-${index}`}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex flex-col justify-between hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {/* FIXED ARROW RENDERING WITH SMOOTH SPACING */}
                      <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="capitalize">{activeOrigin}</span>
                        <span className="text-white/60 font-medium">→</span>
                        <span className="capitalize">{route.to}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {route.km} KMs Estimated
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {route.desc}
                    </p>
                  </div>

                  {/* Dynamic Pricing Slabs under exact algorithm rules */}
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <span className="text-[8px] block text-slate-500 font-black uppercase tracking-wider">Sedan Fare</span>
                        <span className="text-xs font-black text-white">₹{sedanFare.finalFare}</span>
                      </div>
                      <div className="border-l border-white/[0.06] pl-4">
                        <span className="text-[8px] block text-slate-500 font-black uppercase tracking-wider">Ertiga Fare</span>
                        <span className="text-xs font-black text-white">₹{ertigaFare.finalFare}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="text-[9px] font-black uppercase tracking-widest bg-white/5 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 hover:border-orange-500 transition-all"
                    >
                      Instant Quote
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Dynamic Multi-Column SEO Knowledge Grid */}
        <div className="grid gap-8 sm:grid-cols-2 text-[11px] sm:text-xs text-slate-400 leading-relaxed border-t border-white/[0.03] pt-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              1. Reliable Intercity Travel Network
            </h3>
            <p>
              Welcome to <strong>Khatu Rides Travels Co.</strong>, the premier taxi service provider transforming intercity and local transit frameworks across Chhattisgarh. We build high-reliability car rental loops engineered specifically for commuters, corporate squads, and family units navigating critical routes between <strong className="text-white">Korba, Raipur, Bilaspur, Durg, Bhilai, Raigarh, Jharsuguda, and Ambikapur</strong>.
            </p>
            <p>
              By establishing an ecosystem anchored on structural fare transparency, absolute zero-cancellation guarantees, and thoroughly vetted professional drivers, Khatu Rides eliminates the historical friction points typical of traditional regional travel networks. Whether you require a swift one-way outstation taxi, an extended round-trip layout, or a structured 8-hour local package for corporate errantry, our platform dynamically delivers top-tier performance on every booking transition.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              2. Structural Fare Integrity & Zero Surge
            </h3>
            <p>
              Unlike standard aggregator algorithms that implement aggressive surge spikes during peak times or bad weather, our pricing framework on <strong className="text-white">www.khaturidescg.in</strong> operates on a highly scientific, transparent distance-multiplier system. 
            </p>
            <p>
              With our flat per-kilometer rates—starting at an economic <strong className="text-white">₹11/KM for Hatchbacks/Sedans (Maruti Suzuki Dzire)</strong>, <strong className="text-white">₹13/KM for Spacious MUVs (Maruti Suzuki Ertiga)</strong>, and <strong className="text-white">₹20/KM for Luxury SUVs (Toyota Innova Crysta)</strong>—customers enjoy direct visibility of their complete travel expenses. Our pricing guarantees zero hidden taxes, transparent tolls handling, and precise local state border permit processing for seamless regional transitions.
            </p>
          </div>
        </div>

     

      </div>
    </section>
  );
}