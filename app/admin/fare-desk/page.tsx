// app/admin/fare-desk/page.tsx
"use client";

import React from "react";
import TopBar from "@/components/TopBar";
import AdminFareCalculator from "@/components/AdminFareCalculator";

export default function AdminFareDeskPage() {
  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-slate-900 text-slate-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Dashboard Header Status Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                🔒 INTERNAL OPERATOR WORKSPACE
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                Khatu Rides Fleet Control Desk
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Live Google Map matrix lookup interconnected with real-time dynamic market supply & agency margin tracking.
              </p>
            </div>
            
            {/* Live Operational Clock Node */}
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-right shrink-0">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Live System Sync</span>
              <span className="text-sm font-black text-emerald-400 tracking-tight">Active API Tunnel Connected</span>
            </div>
          </div>

          {/* Business Analytics Quick Context Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase">Sedan Segment Target</span>
              <div className="text-base font-black text-white mt-0.5">₹15.00 / KM</div>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">Mileage Config: 24 KM/L</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase">Ertiga Segment Target</span>
              <div className="text-base font-black text-white mt-0.5">₹18.00 / KM</div>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">Mileage Config: 15 KM/L</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase">Innova Segment Target</span>
              <div className="text-base font-black text-white mt-0.5">₹20.00 / KM</div>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">Mileage Config: 8 KM/L</span>
            </div>
          </div>

          {/* Main Module Content Call */}
          <div className="bg-slate-950 border border-slate-800 p-2 sm:p-4 rounded-3xl shadow-2xl">
            <AdminFareCalculator />
          </div>

          {/* Operating Notes Warning Footer */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 text-xs font-semibold text-orange-400/90 leading-relaxed">
            ⚠️ *Operator Note:* B2B Driver Payout structures are set flat at standard ~82% ratios. For low-volume return risk spots (e.g., Ambikapur, Chirmiri, Sakti), allocation thresholds adjust to a tight ~68% parameter automatically. Extra adjustments or custom discounts are to be handled manually during physical confirmation on WhatsApp.
          </div>

          {/* 👑 NEW HIGH-INTENT BUSINESS KEYWORDS DESCRIPTION SECTION (800+ Characters) 👑 */}
          <div className="mt-8 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-slate-400 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              📈 Khatu Rides Travels Co. — Fleet Allocation Strategy & Market Dynamics
            </h3>
            <p className="text-xs leading-relaxed font-medium">
              This administrative portal serves as the primary **car rental billing system** and **taxi dispatch software** control room for locking premium **outstation cab booking** leads across central India. By implementing optimized route analytics, our engine processes **one-way taxi service rates**, **interstate car hire pricing**, and specialized commercial transit loops. Our network algorithm seamlessly monitors premium route avenues, including the **Raipur to Bilaspur taxi service**, industrial **Korba cab rental corridors**, and high-demand **Raipur airport taxi transfers**. Operators can directly generate verified transit vouchers for high-value tourist and business circuits such as the **Raipur to Jagdalpur Bastar taxi circuit**, and long-range **interstate taxi services** to major hubs like Odisha, Madhya Pradesh, Jharkhand, and Maharashtra.
            </p>
            <p className="text-xs leading-relaxed font-medium border-t border-slate-800/80 pt-3">
              To guarantee immediate fleet owner conversion and eliminate vendor dropouts, the system utilizes a real-time **commercial vehicle operation cost analyzer**. It divides total route kilometers by exact engine efficiency variables (Sedan at 24 KM/L, Ertiga at 15 KM/L, and Innova Crysta at 8 KM/L) paired with live **petrol and diesel price tracking** controls. It handles core cash parameters including professional **outstation driver allowance, driver bhatta fooding, and national highway toll plaza tracking**. For low-volume zones like **Ambikapur, Chirmiri, Sakti, Pithora, and Sheorinarayan**, the system applies automatic pricing cushions (1.25x loop adjustments) and robust multi-state long-route factors (1.55x interstate protection), establishing Khatu Rides Travels Co. as the most reliable, secure, and accurate **B2B taxi agent management platform** in Chhattisgarh.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}