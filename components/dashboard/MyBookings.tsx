"use client";
import React from "react";

export default function MyBookings({ userBookings, setActiveTab }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <h3 className="text-xl font-black text-slate-900">Your Bookings History</h3>
      {userBookings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">📦</span>
          <h4 className="text-sm font-black text-slate-900">Book your first cab</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Please book your first intercity ride using our fare calculator to see your travel records here.</p>
          <button onClick={() => setActiveTab("book")} className="mt-4 bg-orange-600 text-white text-xs font-black uppercase px-6 py-3 rounded-2xl shadow-sm">
            Book a Ride Now ➔
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userBookings.map((trip: any) => (
            <div key={trip.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">{trip.bookingType}</span>
                  <span className="text-xs font-mono font-bold text-orange-600">{trip.invoiceId}</span>
                </div>
                <h4 className="text-base font-black text-slate-900 mt-1">{trip.pickup?.split(",")[0]} ➔ {trip.drop?.split(",")[0]}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{trip.vehicleLabel} | {trip.pickupDate} at {trip.pickupTime}</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">{trip.status || "Completed"}</span>
                <div className="text-lg font-black text-emerald-600 mt-1">₹{trip.amountPaid?.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}