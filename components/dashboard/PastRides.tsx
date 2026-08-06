// components/dashboard/PastRides.tsx
"use client";

import React, { useState, useMemo } from "react";
import { generateTravelInvoicePdf } from "@/lib/generateInvoicePdf";

export default function PastRides({ 
  userBookings = [], 
  setActiveTab 
}: {
  userBookings: any[];
  setActiveTab: (tab: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter for completed or past rides
  const pastRides = useMemo(() => {
    return userBookings.filter((b: any) => {
      const status = (b?.status || "").toLowerCase();
      const isPast = status === "completed" || status === "success" || status === "finished" || !b?.status;
      
      if (!isPast) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const invoice = (b?.invoiceId || "").toLowerCase();
        const pickup = (b?.pickup || "").toLowerCase();
        const drop = (b?.drop || "").toLowerCase();
        const vehicle = (b?.vehicleLabel || "").toLowerCase();

        return invoice.includes(query) || pickup.includes(query) || drop.includes(query) || vehicle.includes(query);
      }

      return true;
    });
  }, [userBookings, searchQuery]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 font-sans">
      
      {/* Header & Total Count Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Past Rides & Travel History</h3>
          <p className="text-xs text-slate-500 mt-0.5">View your successfully completed intercity journeys and download past invoices</p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3.5 py-1.5 rounded-full w-fit">
          {pastRides.length} Completed Trips
        </span>
      </div>

      {/* Search Bar (Shown only if history exists) */}
      {userBookings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past rides by Invoice ID or route..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 transition shadow-inner"
            />
          </div>
          <div className="text-xs font-black text-slate-600 px-2">
            Showing <strong className="text-orange-600">{pastRides.length}</strong> past records
          </div>
        </div>
      )}

      {/* Empty State / Content List */}
      {userBookings.length === 0 || pastRides.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">🏁</span>
          <h4 className="text-sm font-black text-slate-900">No past travel history available</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your completed outstation trips will appear here automatically after journey completion.
          </p>
          <button 
            type="button"
            onClick={() => setActiveTab("book")} 
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-sm transition"
          >
            Book Your First Ride ➔
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pastRides.map((trip: any) => {
            const pickupCity = trip?.pickup ? trip.pickup.split(",")[0] : "Pickup";
            const dropCity = trip?.drop ? trip.drop.split(",")[0] : "Drop";
            const amountPaid = trip?.amountPaid || trip?.amount || 1;
            const totalFare = trip?.totalBilledAmount || amountPaid;
            const discountUsed = trip?.walletDiscountUsed || 0;

            return (
              <div 
                key={trip.id || Math.random()} 
                className="bg-slate-50 border border-slate-200/90 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-300 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      {trip?.invoiceId || "KR-N/A"}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Completed
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 tracking-tight mt-1">
                    {pickupCity} <span className="text-orange-600">➔</span> {dropCity}
                  </h4>

                  <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                    <strong className="text-slate-800 uppercase">{trip?.vehicleLabel || "Cab"}</strong>
                    <span>•</span>
                    <span>Completed on: <strong className="text-slate-700">{trip?.pickupDate || "N/A"}</strong></span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400 font-bold">Total Paid</div>
                    <div className="text-lg font-black text-emerald-600">₹{amountPaid.toLocaleString("en-IN")}</div>
                    {discountUsed > 0 && (
                      <div className="text-[10px] font-black text-slate-500">Wallet Saved: ₹{discountUsed}</div>
                    )}
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      const receiptPayload = {
                        invoiceId: trip?.invoiceId || "KR-000000",
                        pickup: trip?.pickup || "Korba",
                        drop: trip?.drop || "Raipur",
                        date: trip?.pickupDate || "2026-08-06",
                        time: trip?.pickupTime || "10:00 AM",
                        vehicle: trip?.vehicleLabel || "Cab",
                        amount: amountPaid,
                        totalFare: totalFare,
                        discountUsed: discountUsed,
                        paymentMode: trip?.paymentMode || "ONLINE",
                        customerName: trip?.customerName || "Valued Customer",
                        customerPhone: trip?.customerPhone || "N/A"
                      };
                      generateTravelInvoicePdf(receiptPayload);
                    }} 
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider px-4.5 py-3 rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
                  >
                    <span>📥</span> Invoice PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}