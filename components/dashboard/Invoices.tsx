"use client";
import React from "react";

export default function Invoices({ userBookings, setActiveTab }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">Invoices & Tax Receipts</h3>
        <span className="text-xs font-bold text-slate-500">GST Compliant Official Invoices</span>
      </div>
      {userBookings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">📄</span>
          <h4 className="text-sm font-black text-slate-900">No invoices generated yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Official PDF invoices will become available instantly after completing any cab booking.</p>
          <button onClick={() => setActiveTab("book")} className="mt-4 bg-orange-600 text-white text-xs font-black uppercase px-6 py-3 rounded-2xl">
            Book a Ride Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userBookings.map((inv: any) => (
            <div key={inv.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-orange-600">{inv.invoiceId}</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{inv.pickup?.split(",")[0]} ➔ {inv.drop?.split(",")[0]}</div>
                <div className="text-[10px] font-bold text-slate-500">Date: {inv.pickupDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-900">₹{inv.amountPaid?.toLocaleString("en-IN")}</span>
                <button onClick={() => alert(`Downloading PDF for invoice ${inv.invoiceId}...`)} className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow-xs">
                  📥 Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}