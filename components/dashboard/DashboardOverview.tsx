"use client";
import React from "react";
import FareCalculator from "@/components/FareCalculator";
import { motion } from "framer-motion";

export default function DashboardOverview({ activeOffers, currentOfferIndex, customerData, userBookings, setActiveTab, setPopupData, setSelectedVehicleType, setShowPopup, setShowUserForm, getVehicleImageByName, calculateFare }: any) {
  const totalBookingsCount = userBookings.length;
  const completedCount = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "completed").length;
  const upcomingCount = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "upcoming").length;
  const cancelledCount = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "cancelled").length;
  const ongoingCount = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "ongoing").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-6">
        
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b101d] via-[#131c31] to-[#0b101d] p-6 sm:p-8 shadow-xl text-white flex flex-col justify-between border border-slate-800">
          <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm">ONE WAY में कोई KM LIMIT नहीं!</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">Book Your Ride</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Get best fares for One Way, Round Trip, Airport Transfer & more...</p>
            </div>
            <span className="text-5xl hidden sm:block">🚖</span>
          </div>
        </div>

        {/* Live Special Offers Marquee */}
        <div className="bg-white border border-orange-200 rounded-3xl p-5 shadow-md space-y-3 overflow-hidden">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-1">
              <span>🔥</span> LIVE SPECIAL ROUTE OFFERS
            </span>
            <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">Real-time DB Feed</span>
          </div>

          {activeOffers.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center text-xs font-bold text-slate-500">
              Presently no any offer are available.
            </div>
          ) : (
            <div className="relative w-full overflow-hidden py-1">
              <motion.div
                className="flex gap-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              >
                {[...activeOffers, ...activeOffers].map((offer: any, idx: number) => (
                  <div
                    key={`${offer.id}-${idx}`}
                    className="min-w-[280px] sm:min-w-[320px] rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 flex items-center justify-between gap-3 shadow-xs shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <img src={getVehicleImageByName(offer.vehicleType)} alt="Car" className="w-14 h-10 object-cover rounded-xl border border-orange-200 shadow-xs" />
                      <div>
                        <span className="bg-orange-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md">{offer.tripType}</span>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{offer.fromCity} ➔ {offer.toCity}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
                          <span className="text-slate-500 capitalize text-[10px]">{offer.vehicleType}</span>
                          <span className="text-red-500 line-through text-[10px]">₹{offer.strikeFare}</span>
                          <span className="text-emerald-600 font-black text-xs">₹{offer.offerFare}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab("book")} className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-[10px] uppercase px-3.5 py-2.5 rounded-xl shadow-xs shrink-0">
                      Book
                    </button>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>

        {/* Fare Calculator */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-md">
          <FareCalculator
            onFareCalculated={(data: any) => {
              let oneWayAvail = true;
              let baseSingleRouteDist = 150;
              const updatedData = {
                ...data,
                fareOptions: data.fareOptions.map((opt: any) => {
                  const rawDist = opt.billedDistance;
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
                  oneWayAvail = recalculated.isOneWayAvailable;
                  return { ...opt, finalFare: recalculated.finalFare, billedDistance: recalculated.billedDistance, durationMinutes: recalculated.durationMinutes };
                }),
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

        {/* Overview Stats */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Your Bookings Overview</h3>
            <button onClick={() => setActiveTab("trips")} className="text-xs font-black text-orange-600 hover:underline">View All Bookings ➔</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Total Bookings", count: totalBookingsCount, icon: "📋" },
              { label: "Completed", count: completedCount, icon: "✅" },
              { label: "Upcoming", count: upcomingCount, icon: "⏰" },
              { label: "Cancelled", count: cancelledCount, icon: "❌" },
              { label: "Ongoing", count: ongoingCount, icon: "🔄" },
            ].map((ov, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center shadow-xs">
                <span className="text-lg">{ov.icon}</span>
                <div className="text-lg font-black text-slate-900 mt-1">{ov.count}</div>
                <div className="text-[10px] font-bold text-slate-500 mt-0.5">{ov.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Sidebar Widgets */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-md space-y-4 text-left relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">KRT Signup Wallet</span>
            <span className="text-2xl">🎁</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">₹{customerData?.walletBalance?.toLocaleString("en-IN") || "1,101.00"}</div>
          <p className="text-[10px] font-bold text-slate-500 leading-snug">
            ✨ Use up to <strong className="text-orange-600">₹200</strong> discount from your wallet on every booking!
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Book a Ride", icon: "🚗" },
              { label: "Airport Transfer", icon: "✈️" },
              { label: "Outstation", icon: "🛣️" },
              { label: "Round Trip", icon: "🔄" },
              { label: "Local Package", icon: "🏙️" },
              { label: "Corporate Travel", icon: "💼" },
            ].map((qa, i) => (
              <button key={i} onClick={() => setActiveTab("book")} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition group shadow-xs">
                <span className="text-xl group-hover:scale-110 transition">{qa.icon}</span>
                <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Need Help?</h3>
            <span className="text-xl">🎧</span>
          </div>
          <p className="text-xs text-slate-500">Our support team is available 24x7</p>
          <div className="space-y-2">
            <a href="https://wa.me/919244137353" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase py-3 rounded-2xl transition shadow-sm">
              💬 Chat with Support
            </a>
            <a href="tel:+919244137353" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase py-3 rounded-2xl transition border border-slate-200">
              📞 9244137353
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}