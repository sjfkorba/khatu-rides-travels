"use client";
import React from "react";

export default function UpcomingRides({ userBookings, setActiveTab }: any) {
  const upcoming = userBookings.filter((b: any) => (b.status || "").toLowerCase() === "upcoming");
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <h3 className="text-xl font-black text-slate-900">Upcoming Rides</h3>
      {upcoming.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">⏰</span>
          <h4 className="text-sm font-black text-slate-900">No upcoming scheduled rides</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Book an outstation trip or airport transfer to see your schedule here.</p>
          <button onClick={() => setActiveTab("book")} className="mt-4 bg-orange-600 text-white text-xs font-black uppercase px-6 py-3 rounded-2xl">
            Book a Ride
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((trip: any) => (
            <div key={trip.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <div className="text-xs font-mono text-blue-600 font-bold">{trip.invoiceId}</div>
                <div className="text-sm font-black text-slate-900">{trip.pickup?.split(",")[0]} ➔ {trip.drop?.split(",")[0]}</div>
              </div>
              <div className="text-right text-xs font-bold text-blue-600">{trip.pickupDate}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}