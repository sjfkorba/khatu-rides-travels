// components/dashboard/Cancellations.tsx
"use client";

import React from "react";

export default function Cancellations({ 
  userBookings = [], 
  setActiveTab 
}: {
  userBookings: any[];
  setActiveTab: (tab: any) => void;
}) {
  const cancelled = userBookings.filter((b: any) => (b?.status || "").toLowerCase() === "cancelled");

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Cancellations & Refunds</h3>
          <p className="text-xs text-slate-500 mt-0.5">Track your cancelled cab bookings and refund status</p>
        </div>
        <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-black px-3 py-1 rounded-full w-fit">
          {cancelled.length} Cancelled Trips
        </span>
      </div>

      {cancelled.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">🎉</span>
          <h4 className="text-sm font-black text-slate-900">No cancelled bookings</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All your scheduled outstation rides are safe and running smoothly without any cancellations.
          </p>
          <button 
            type="button"
            onClick={() => setActiveTab("book")} 
            className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-sm transition"
          >
            Book a Ride Now ➔
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {cancelled.map((trip: any) => {
            const pickupCity = trip?.pickup ? trip.pickup.split(",")[0] : "Pickup";
            const dropCity = trip?.drop ? trip.drop.split(",")[0] : "Drop";

            return (
              <div 
                key={trip.id || Math.random()} 
                className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-300"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                      {trip?.bookingType || "Trip"}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{trip?.invoiceId || "KR-N/A"}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {pickupCity} <span className="text-orange-600">➔</span> {dropCity}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {trip?.vehicleLabel || "Cab"} | Scheduled: <strong className="text-slate-700">{trip?.pickupDate || "N/A"}</strong>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 gap-1">
                  <span className="bg-red-100 text-red-700 border border-red-200 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                    ✕ Cancelled
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    Refund processed if applicable
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}