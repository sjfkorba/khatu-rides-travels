"use client";
import React, { useState } from "react";
import FareCalculator from "@/components/FareCalculator";
import { motion } from "framer-motion";

export default function DashboardOverview({ 
  currentUser, 
  activeOffers = [], 
  currentOfferIndex, 
  customerData, 
  userBookings = [], 
  setActiveTab, 
  setPopupData, 
  setSelectedVehicleType, 
  setShowPopup, 
  setShowUserForm, 
  getVehicleImageByName, 
  calculateFare 
}: any) {
  const [activeCategory, setActiveCategory] = useState<"oneway" | "roundtrip" | "airport" | "rental">("oneway");

  const totalBookingsCount = userBookings.length;
  const completedCount = userBookings.filter((b: any) => (b?.status || "").toLowerCase() === "completed" || !b?.status).length;
  const upcomingCount = userBookings.filter((b: any) => (b?.status || "").toLowerCase() === "upcoming" || (b?.status || "").toLowerCase() === "confirmed").length;
  const cancelledCount = userBookings.filter((b: any) => (b?.status || "").toLowerCase() === "cancelled").length;
  const ongoingCount = userBookings.filter((b: any) => (b?.status || "").toLowerCase() === "ongoing").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      <div className="lg:col-span-8 space-y-6">
        
        {/* 👑 International Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0b101d] via-[#111827] to-[#1f2937] p-6 sm:p-8 shadow-2xl text-white flex flex-col justify-between border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                  ★ ELITE PRO MEMBER
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  ✓ ZERO KM LIMIT ON ONEWAY
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
                Hello, {currentUser?.displayName?.split(" ")[0] || "Traveler"}! ✈️
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                Book verified outstation cabs across Chhattisgarh & MP with instant driver assignment and transparent pricing.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center shrink-0 hidden sm:block shadow-inner">
              <span className="text-3xl block">🚖</span>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1 block">24x7 Ready</span>
            </div>
          </div>

          {/* Quick Service Selector Tabs */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 mt-6 border-t border-slate-800/80">
            {[
              { id: "oneway", label: "One-Way Drop", icon: "🛣️" },
              { id: "roundtrip", label: "Round Trip", icon: "🔄" },
              { id: "airport", label: "Airport Transfer", icon: "✈️" },
              { id: "rental", label: "Hourly Rental", icon: "⏱️" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setActiveTab("book");
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left group ${
                  activeCategory === cat.id 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 font-black" 
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <span className="text-base group-hover:scale-110 transition">{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 👑 Live Special Offers Marquee */}
        {activeOffers.length > 0 && (
          <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-lg space-y-3 overflow-hidden relative">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
                <span className="animate-pulse">🔥</span> HOT DEALS & SPECIAL ROUTES
              </span>
              <span className="text-[10px] font-black bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                Live Feed
              </span>
            </div>

            <div className="relative w-full overflow-hidden py-1">
              <motion.div
                className="flex gap-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                {[...activeOffers, ...activeOffers].map((offer: any, idx: number) => (
                  <div
                    key={`${offer.id}-${idx}`}
                    className="min-w-[300px] sm:min-w-[340px] rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-white border border-orange-200 p-4 flex items-center justify-between gap-3 shadow-xs shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <img src={getVehicleImageByName(offer.vehicleType)} alt="Car" className="w-14 h-11 object-cover rounded-xl border border-orange-200 shadow-xs bg-white" />
                      <div>
                        <span className="bg-orange-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider">{offer.tripType}</span>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{offer.fromCity} ➔ {offer.toCity}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold mt-0.5">
                          <span className="text-slate-500 capitalize text-[10px]">{offer.vehicleType}</span>
                          <span className="text-red-500 line-through text-[10px]">₹{offer.strikeFare}</span>
                          <span className="text-emerald-700 font-black text-xs">₹{offer.offerFare}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setActiveTab("book")} 
                      className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[10px] uppercase tracking-wider px-4 py-3 rounded-xl shadow-md shrink-0 transition"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* 👑 Interactive Fare Calculator Module */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>📍</span> Plan Your Journey
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Instant Fare Estimation</span>
          </div>

          <FareCalculator
            onFareCalculated={(data: any) => {
              if (!data || !data.fareOptions) return;
              let oneWayAvail = true;
              let baseSingleRouteDist = 150;

              const updatedFareOptions = data.fareOptions.map((opt: any) => {
                const rawDist = opt.billedDistance || 150;
                const baseSingleDist = data.bookingType === "roundtrip" ? Math.round(rawDist / 2) : rawDist;
                baseSingleRouteDist = baseSingleDist;

                const recalculated = calculateFare({
                  distance: baseSingleDist,
                  vehicleType: opt.vehicleType,
                  bookingType: data.bookingType,
                  serviceType: data.serviceType,
                  pickupDate: data.pickupDate,
                  pickupTime: data.pickupTime,
                  returnDate: data.returnDate,
                  returnTime: data.returnTime,
                  drop: data.drop,
                  pickup: data.pickup,
                });

                if (recalculated && typeof recalculated.isOneWayAvailable === "boolean") {
                  oneWayAvail = recalculated.isOneWayAvailable;
                }

                return { 
                  ...opt, 
                  finalFare: recalculated?.finalFare || opt.finalFare, 
                  billedDistance: recalculated?.billedDistance || baseSingleDist, 
                  durationMinutes: recalculated?.durationMinutes || 180 
                };
              });

              const updatedData = {
                ...data,
                fareOptions: updatedFareOptions,
                isOneWayAvailable: oneWayAvail,
                baseDistance: baseSingleRouteDist
              };

              setPopupData(updatedData);
              setSelectedVehicleType("sedan");
              setShowPopup(true);
              setShowUserForm(false);
            }}
          />
        </div>

        {/* 👑 Overview Stats Grid */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Your Travel Analytics</h3>
            <button 
              type="button"
              onClick={() => setActiveTab("trips")} 
              className="text-xs font-black text-orange-600 hover:text-orange-700 transition"
            >
              View All History ➔
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Total Bookings", count: totalBookingsCount, icon: "📋", color: "text-slate-900" },
              { label: "Completed", count: completedCount, icon: "✅", color: "text-emerald-600" },
              { label: "Upcoming", count: upcomingCount, icon: "⏰", color: "text-blue-600" },
              { label: "Cancelled", count: cancelledCount, icon: "❌", color: "text-red-600" },
              { label: "Ongoing", count: ongoingCount, icon: "🔄", color: "text-amber-600" },
            ].map((ov, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-center shadow-xs hover:border-slate-300 transition">
                <span className="text-xl">{ov.icon}</span>
                <div className={`text-xl font-black mt-1 ${ov.color}`}>{ov.count}</div>
                <div className="text-[10px] font-bold text-slate-500 mt-0.5">{ov.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 👑 Right Sidebar International Widgets */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/60 border border-orange-200 rounded-3xl p-6 shadow-xl space-y-4 text-left relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200">
              KRT Signup Wallet
            </span>
            <span className="text-2xl">🎁</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight relative z-10">
            ₹{customerData?.walletBalance?.toLocaleString("en-IN") || "1,101.00"}
          </div>
          <p className="text-[11px] font-bold text-slate-600 leading-snug relative z-10">
            ✨ Enjoy up to <strong className="text-orange-600">₹200 instant discount</strong> automatically applied from your welcome wallet on every outstation booking!
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-lg space-y-4 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Popular Destinations & Services</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Outstation", icon: "🛣️" },
              { label: "Airport Cab", icon: "✈️" },
              { label: "Round Trip", icon: "🔄" },
              { label: "Korba ➔ Raipur", icon: "🏙️" },
              { label: "Bilaspur Drop", icon: "🚖" },
              { label: "Corporate", icon: "💼" },
            ].map((qa, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => setActiveTab("book")} 
                className="bg-slate-50 hover:bg-orange-50 hover:border-orange-200 border border-slate-200/80 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition group shadow-xs"
              >
                <span className="text-xl group-hover:scale-110 transition">{qa.icon}</span>
                <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 24x7 Support Card */}
        <div className="bg-[#0b101d] text-white rounded-3xl p-6 shadow-xl space-y-4 text-left relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 bottom-0 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs font-black uppercase tracking-wider text-orange-400">24x7 Priority Support</h3>
            <span className="text-xl">🎧</span>
          </div>
          <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
            Our senior travel desk is always available for instant route allocation and driver coordination.
          </p>
          <div className="space-y-2 pt-1 relative z-10">
            <a 
              href="https://wa.me/919244137353" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition shadow-md"
            >
              💬 WhatsApp Chat Desk
            </a>
            <a 
              href="tel:+919244137353" 
              className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition border border-slate-700"
            >
              📞 Call: +91 92441 37353
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}