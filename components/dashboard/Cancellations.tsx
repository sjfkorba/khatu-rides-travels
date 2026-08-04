"use client";
import React from "react";

export default function Cancellations({ userBookings, setActiveTab }: any) {
  const cancelled = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "cancelled");
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <h3 className="text-xl font-black text-slate-900">Cancellations & Refunds</h3>
      {cancelled.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">🎉</span>
          <h4 className="text-sm font-black text-slate-900">No cancelled bookings</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">All your scheduled rides are safe and running without cancellations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cancelled.map((trip: any) => (
            <div key={trip.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <div className="text-xs font-mono text-red-600 font-bold">{trip.invoiceId}</div>
                <div className="text-sm font-black text-slate-900">{trip.pickup?.split(",")[0]} ➔ {trip.drop?.split(",")[0]}</div>
              </div>
              <div className="text-right text-xs font-black text-red-600">Cancelled</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}