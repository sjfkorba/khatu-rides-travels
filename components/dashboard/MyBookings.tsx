// components/dashboard/MyBookings.tsx
"use client";

import React, { useState, useMemo } from "react";
import { generateTravelInvoicePdf } from "@/lib/generateInvoicePdf";

export default function MyBookings({ 
  userBookings = [], 
  setActiveTab 
}: {
  userBookings: any[];
  setActiveTab: (tab: any) => void;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter and search bookings logic
  const filteredBookings = useMemo(() => {
    return userBookings.filter((trip: any) => {
      const status = (trip?.status || "completed").toLowerCase();
      
      // Status filter matching
      if (filterStatus === "upcoming" && status !== "upcoming" && status !== "confirmed") return false;
      if (filterStatus === "completed" && status !== "completed" && status !== "confirmed" && status !== "success") return false;
      if (filterStatus === "cancelled" && status !== "cancelled") return false;

      // Search query matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const invoice = (trip?.invoiceId || "").toLowerCase();
        const pickup = (trip?.pickup || "").toLowerCase();
        const drop = (trip?.drop || "").toLowerCase();
        const vehicle = (trip?.vehicleLabel || "").toLowerCase();
        const name = (trip?.customerName || "").toLowerCase();

        return invoice.includes(query) || pickup.includes(query) || drop.includes(query) || vehicle.includes(query) || name.includes(query);
      }

      return true;
    });
  }, [userBookings, filterStatus, searchQuery]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 font-sans">
      
      {/* Header & Main Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Bookings History</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage, track, and download tickets for all your outstation cab rides</p>
        </div>
        <button 
          type="button"
          onClick={() => setActiveTab("book")} 
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md transition w-fit"
        >
          + Book New Ride
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      {userBookings.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Bookings" },
                { id: "upcoming", label: "Upcoming" },
                { id: "completed", label: "Completed" },
                { id: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shrink-0 ${
                    filterStatus === tab.id 
                      ? "bg-slate-900 text-white shadow-xs" 
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, route or vehicle..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 transition shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content List / Empty State */}
      {userBookings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">📦</span>
          <h4 className="text-sm font-black text-slate-900">No bookings found in your account yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please book your first intercity ride using our fare calculator to see your travel records here.
          </p>
          <button 
            type="button"
            onClick={() => setActiveTab("book")} 
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-sm transition"
          >
            Book a Ride Now ➔
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-xs font-bold text-slate-500">
          No bookings match your selected filter or search query.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((trip: any) => {
            const pickupCity = trip?.pickup ? trip.pickup.split(",")[0] : "Pickup";
            const dropCity = trip?.drop ? trip.drop.split(",")[0] : "Drop";
            const amountPaid = trip?.amountPaid || trip?.amount || 1;
            const totalFare = trip?.totalBilledAmount || amountPaid;
            const discountUsed = trip?.walletDiscountUsed || 0;
            const tripStatus = (trip?.status || "Completed").toUpperCase();

            return (
              <div 
                key={trip.id || Math.random()} 
                className="bg-slate-50 border border-slate-200/90 p-5 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition hover:border-slate-300 shadow-xs"
              >
                {/* Left Route & Vehicle Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {trip?.bookingType || "Oneway"}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {trip?.invoiceId || "KR-N/A"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {trip?.paymentMode || "Online"}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 tracking-tight mt-1">
                    {pickupCity} <span className="text-orange-600">➔</span> {dropCity}
                  </h4>

                  <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                    <strong className="text-slate-800 uppercase">{trip?.vehicleLabel || "Cab"}</strong> 
                    <span>•</span>
                    <span>Journey: <strong className="text-slate-700">{trip?.pickupDate || "N/A"} at {trip?.pickupTime || "N/A"}</strong></span>
                  </p>
                </div>

                {/* Right Financial & Action Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center sm:justify-end gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        tripStatus === "CANCELLED" 
                          ? "bg-red-100 text-red-700 border border-red-200" 
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {tripStatus}
                      </span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                      Paid: ₹{amountPaid.toLocaleString("en-IN")}
                    </div>
                    {discountUsed > 0 && (
                      <div className="text-[10px] font-black text-emerald-600">
                        Wallet Discount: -₹{discountUsed}
                      </div>
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
                    className="bg-[#0b101d] hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>📥</span> Download E-Ticket
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