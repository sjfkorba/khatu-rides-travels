// app/admin/fare-desk/page.tsx
"use client";

import React, { useState } from "react";

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
                Live Google Map distance lookup interconnected with real-time dynamic market supply matching logic.
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
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Market Payout Ratio: ~82%</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase">Ertiga Segment Target</span>
              <div className="text-base font-black text-white mt-0.5">₹18.00 / KM</div>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Market Payout Ratio: ~82%</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase">Innova Segment Target</span>
              <div className="text-base font-black text-white mt-0.5">₹20.00 / KM</div>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Market Payout Ratio: ~82%</span>
            </div>
          </div>

          {/* Main Module Content Call */}
          <div className="bg-slate-950 border border-slate-800 p-2 sm:p-4 rounded-3xl shadow-2xl">
            <AdminFareCalculator />
          </div>

          {/* Operating Notes Warning Footer */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 text-xs font-semibold text-orange-400/90 leading-relaxed">
            ⚠️ *Operator Note:* B2B Payout limits calculate dynamic margins to guarantee vendor allocation within 7 minutes. For extreme dry point nodes (e.g., Chirmiri, Sakti), payout structures automatically adjust retention targets downward to prevent unassigned loop dropouts.
          </div>

        </div>
      </main>
    </>
  );
}