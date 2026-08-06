// components/dashboard/Invoices.tsx
"use client";

import React, { useState, useMemo } from "react";
import { generateTravelInvoicePdf } from "@/lib/generateInvoicePdf";

export default function Invoices({ 
  userBookings = [], 
  setActiveTab 
}: {
  userBookings: any[];
  setActiveTab: (tab: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter invoices based on search query (Invoice ID or Route name)
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return userBookings;
    const query = searchQuery.toLowerCase();
    return userBookings.filter((inv) => 
      (inv?.invoiceId || "").toLowerCase().includes(query) ||
      (inv?.pickup || "").toLowerCase().includes(query) ||
      (inv?.drop || "").toLowerCase().includes(query) ||
      (inv?.vehicleLabel || "").toLowerCase().includes(query)
    );
  }, [userBookings, searchQuery]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 font-sans">
      
      {/* Header & GST Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Invoices & Tax Receipts</h3>
          <p className="text-xs text-slate-500 mt-0.5">Download official GST-compliant travel tax invoices for all completed rides</p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3.5 py-1.5 rounded-full w-fit">
          ✓ GST Compliant Official Invoices
        </span>
      </div>

      {/* Search & Filter Bar (Shown only if bookings exist) */}
      {userBookings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice ID or Route..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 transition shadow-inner"
            />
          </div>
          <div className="text-xs font-black text-slate-600 px-2">
            Showing <strong className="text-orange-600">{filteredInvoices.length}</strong> of {userBookings.length} Invoices
          </div>
        </div>
      )}

      {/* Main Content / Empty State */}
      {userBookings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">📄</span>
          <h4 className="text-sm font-black text-slate-900">No invoices generated yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Official PDF invoices will become available instantly after completing any cab booking on Khatu Rides.
          </p>
          <button 
            type="button"
            onClick={() => setActiveTab("book")} 
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-sm transition"
          >
            Book a Ride Now ➔
          </button>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-xs font-bold text-slate-500">
          No matching invoices found for &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv: any) => {
            const pickupCity = inv?.pickup ? inv.pickup.split(",")[0] : "Pickup";
            const dropCity = inv?.drop ? inv.drop.split(",")[0] : "Drop";
            const amountPaid = inv?.amountPaid || inv?.amount || 1;
            const totalFare = inv?.totalBilledAmount || amountPaid;
            const discountUsed = inv?.walletDiscountUsed || 0;

            return (
              <div 
                key={inv.id || Math.random()} 
                className="bg-slate-50 border border-slate-200/90 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-300"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      {inv?.invoiceId || "KR-N/A"}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {inv?.paymentMode || "Paid"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight mt-1">
                    {pickupCity} <span className="text-orange-600">➔</span> {dropCity}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {inv?.vehicleLabel || "Cab"} | Date: <strong className="text-slate-700">{inv?.pickupDate || "N/A"}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400 font-bold">Paid Online</div>
                    <div className="text-base sm:text-lg font-black text-slate-900">₹{amountPaid.toLocaleString("en-IN")}</div>
                    {discountUsed > 0 && (
                      <div className="text-[10px] font-black text-emerald-600">Saved ₹{discountUsed} via Wallet</div>
                    )}
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      // Format receipt object for PDF generator
                      const receiptPayload = {
                        invoiceId: inv?.invoiceId || "KR-000000",
                        pickup: inv?.pickup || "Korba",
                        drop: inv?.drop || "Raipur",
                        date: inv?.pickupDate || "2026-08-06",
                        time: inv?.pickupTime || "10:00 AM",
                        vehicle: inv?.vehicleLabel || "Cab",
                        amount: amountPaid,
                        totalFare: totalFare,
                        discountUsed: discountUsed,
                        paymentMode: inv?.paymentMode || "ONLINE",
                        customerName: inv?.customerName || "Valued Customer",
                        customerPhone: inv?.customerPhone || "N/A"
                      };
                      generateTravelInvoicePdf(receiptPayload);
                    }} 
                    className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
                  >
                    <span>📥</span> Download PDF
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