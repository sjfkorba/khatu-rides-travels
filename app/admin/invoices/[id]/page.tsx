"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerMobile: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  dropTime: string;
  vehicleNumber: string;
  vehicleType: string;
  remarks?: string;
  amount: number;
}

export default function InvoiceViewPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      try {
        if (!params?.id) return;

        const snap = await getDoc(doc(db, "invoices", params.id));

        if (snap.exists()) {
          setInvoice(snap.data() as Invoice);
        } else {
          setInvoice(null);
        }
      } catch (error) {
        console.error("Failed to load invoice:", error);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#f8fafc]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider">Generating Document View...</p>
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#f8fafc] px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-sm w-full shadow-sm">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Invoice Not Found</h1>
          <p className="text-xs text-slate-500 mt-1">Please verify the link or invoice ID.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f5f9] py-10 px-4 print-wrapper md:px-6">
      <div className="max-w-[210mm] mx-auto">
        
        {/* Web Action Toolbar */}
        <div className="flex justify-between items-center mb-6 no-print bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Document Aligned & Ready</p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>

        {/* Executive Premium Invoice Paper Layout */}
        <section className="invoice-print-area bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200/80 print:shadow-none print:border-0 print:rounded-none w-full print:w-[210mm] min-h-[297mm] flex flex-col justify-between">
          
          <div>
            {/* Vibrant Modern Brand Strip */}
            <div className="bg-slate-900 text-white p-8 md:p-10 relative overflow-hidden border-b-4 border-amber-500">
              <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-amber-500 transform skew-x-[15deg] translate-x-16 hidden sm:block"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="space-y-1">
                  <span className="bg-amber-500 text-slate-950 font-extrabold tracking-widest uppercase text-[9px] px-2 py-0.5 rounded">
                    Tax Invoice
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white pt-1">
                    Khatu Rides & Travels
                  </h1>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Premium Fleet & Logistics Operations
                  </p>
                  <div className="pt-3 text-[11px] text-slate-400 space-y-0.5 font-medium">
                    <p><span className="text-slate-500">Call Support:</span> +91 9244137353</p>
                    <p><span className="text-slate-500">Mail Hub:</span> bookings@khaturides.com</p>
                  </div>
                </div>

                {/* Micro Invoice Number & Date Meta - Perfectly Scaled */}
                <div className="sm:text-right space-y-2 pt-2 sm:pt-0">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice Identifier</p>
                    <p className="text-sm font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded inline-block">
                      #{invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium space-y-0.5 pt-1">
                    <p><span className="text-slate-500">Issue Date:</span> {invoice.invoiceDate}</p>
                    <p><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">PAID</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Alignment Core Details Grid */}
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100">
              {/* Client Base Column */}
              <div className="md:col-span-5 space-y-2">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">CLIENT SPECIFICATION</h2>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900">{invoice.customerName}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    <span className="text-slate-400 font-semibold">Registered Contact:</span> {invoice.customerMobile}
                  </p>
                </div>
              </div>

              {/* Transit/Vehicle Grid Column */}
              <div className="md:col-span-7 grid grid-cols-2 gap-x-6 gap-y-3.5 border-l border-slate-100 pl-0 md:pl-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Fleet Category</p>
                  <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {invoice.vehicleType || "Standard Sedan"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Plate Number</p>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-0.5 bg-slate-100 px-2 py-0.5 rounded inline-block border border-slate-200/40">
                    {invoice.vehicleNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reporting Timeline</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{invoice.pickupTime || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Release Timeline</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{invoice.dropTime || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Well-Sized Clean Journey Statement */}
            <div className="px-8 md:px-10 py-6">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">MANIFEST MATRIX</h2>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3.5 w-[55%]">Service Description</th>
                      <th className="p-3.5 text-right w-[45%]">Route Coordinates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 align-top space-y-1">
                        <p className="font-bold text-slate-900 text-sm">Commercial Fleet Transit Allowance</p>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Point-to-point specialized transport rental including professional pilot provisioning and statutory dynamic road charges.
                        </p>
                      </td>
                      <td className="p-4 text-right align-top space-y-1.5 font-medium text-slate-800">
                        <p className="text-[11px] text-slate-500"><span className="font-bold text-slate-900 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded mr-1.5">PICKUP</span> {invoice.pickupLocation}</p>
                        <p className="text-[11px] text-slate-500"><span className="font-bold text-slate-900 bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded mr-1.5">DROP-OFF</span> {invoice.dropLocation}</p>
                      </td>
                    </tr>
                    
                    {invoice.remarks && (
                      <tr className="bg-slate-50/50 text-[11px]">
                        <td className="p-3.5 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Executive Memo / Internal Logs</td>
                        <td className="p-3.5 text-right italic text-slate-600 font-medium">
                          {invoice.remarks}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Symmetrical Balanced Bottom Dashboard */}
          <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-200/60 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Authenticity Subtext */}
              <div className="md:col-span-6 space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AUTHENTICITY SUMMARY</p>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  This transaction log statement is programmatically generated from the central billing gateway. Physical authorization counters are not required.
                </p>
              </div>

              {/* Precise Financial Lockup */}
              <div className="md:col-span-6 space-y-5">
                
                {/* Total Component Block */}
                <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center shadow-sm border-b-4 border-amber-500">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block">Net Premium Payable</span>
                    <span className="text-[10px] text-slate-400 font-medium">All inclusive processing</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-black text-white tracking-tight">
                      ₹ {Number(invoice.amount).toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </div>

                {/* Executive Desk Signature Line */}
                <div className="flex justify-end pr-1">
                  <div className="text-center min-w-[170px]">
                    <div className="h-8 border-b border-dashed border-slate-300"></div>
                    <p className="text-[11px] font-bold text-slate-900 mt-1.5 tracking-tight">Executive Management</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Khatu Rides Hub</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </section>
      </div>

      {/* Global CSS Style Sheet Context Injection */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0mm;
        }
        
        @media print {
          html, body, .print-wrapper {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 210mm;
            height: 297mm;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-print-area {
            border: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}