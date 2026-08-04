"use client";
import React from "react";

export default function PastRides({ userBookings, setActiveTab }: any) {
  const past = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "completed" || !b.status);
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <h3 className="text-xl font-black text-slate-900">Past Rides</h3>
      {past.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">🏁</span>
          <h4 className="text-sm font-black text-slate-900">No past travel history available</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Your completed trips will appear here automatically after journey completion.</p>
          <button onClick={() => setActiveTab("book")} className="mt-4 bg-orange-600 text-white text-xs font-black uppercase px-6 py-3 rounded-2xl">
            Book Your First Ride
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {past.map((trip: any) => (
            <div key={trip.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <div className="text-xs font-mono text-emerald-600 font-bold">{trip.invoiceId}</div>
                <div className="text-sm font-black text-slate-900">{trip.pickup?.split(",")[0]} ➔ {trip.drop?.split(",")[0]}</div>
              </div>
              <div className="text-right text-xs font-black text-emerald-600">₹{trip.amountPaid}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}