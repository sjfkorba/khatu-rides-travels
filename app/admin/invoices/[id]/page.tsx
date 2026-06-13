"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Share2,
  Trash2,
  Printer,
  Phone,
  CarFront,
  MapPin,
  UserRound,
} from "lucide-react";

interface Invoice {
  id: string;
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
  remarks: string;
  amount: number;
  createdAt?: any;
}

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const id = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  async function loadInvoice() {
    if (!id) return;
    try {
      setLoading(true);
      const ref = doc(db, "invoices", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Invoice not found");
        router.push("/admin/invoices");
        return;
      }

      setInvoice({
        id: snap.id,
        ...snap.data(),
      } as Invoice);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoice();
  }, [id]);

  function formatDate(dateString?: string) {
    if (!dateString?.trim()) return "-";
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return dateString;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString.replace(/\//g, "-");

    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    return dateString;
  }

  function formatCurrency(amount?: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  function safeText(value?: string) {
    return value?.trim() ? value : "-";
  }

  function handlePrint() {
    window.print();
  }

  // Fast Native Share & WhatsApp Direct Routing Integration
  async function handleSharePdf() {
    const shareText = `*Invoice from Khatu Rides & Travels Co.*\n\n*Invoice No:* ${invoice?.invoiceNumber}\n*Customer:* ${invoice?.customerName}\n*Amount:* ${formatCurrency(invoice?.amount)}\n\nClick the link below to view or print the digital copy:\n${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice?.invoiceNumber}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share skipped", err);
      }
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, "_blank");
    }
  }

  async function handleDelete() {
    if (!invoice?.id) return;
    const ok = confirm("Delete this invoice permanently?");
    if (!ok) return;

    try {
      setDeleteLoading(true);
      await deleteDoc(doc(db, "invoices", invoice.id));
      alert("Invoice deleted successfully");
      router.push("/admin/invoices");
    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-700 font-semibold">
          <Loader2 className="animate-spin" size={20} />
          Loading invoice...
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-black mb-2 text-slate-900">Invoice not found</h2>
          <p className="text-slate-600 mb-6">Invalid Reference or Deleted Sheet.</p>
          <Link href="/admin/invoices" className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl font-bold">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-100 p-2 sm:p-4 md:p-8 print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto">
          {/* Dashboard Control Utility Bar */}
          <div className="print:hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm">
            <div>
              <Link href="/admin/invoices" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium text-sm mb-1">
                <ArrowLeft size={16} /> Back to List
              </Link>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Invoice View <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">A4 Single Page Locked</span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={handlePrint} className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
                <Printer size={16} /> Print / Save PDF
              </button>
              <button onClick={handleSharePdf} className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
                <Share2 size={16} /> Share Link
              </button>
              <button onClick={handleDelete} disabled={deleteLoading} className="inline-flex items-center justify-center p-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all disabled:opacity-50">
                {deleteLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
              </button>
            </div>
          </div>

          {/* Core Invoice Sheet Paper Shell */}
          <div className="flex justify-center overflow-x-auto select-none">
            <div ref={invoiceRef} className="invoice-sheet w-full max-w-[210mm] bg-white text-slate-900 shadow-md print:shadow-none font-sans">
              <div className="invoice-page flex flex-col justify-between p-6 sm:p-8">
                
                {/* Structural Wrapper Top */}
                <div>
                  {/* Dynamic Custom Branding Banner */}
                  <div className="bg-slate-900 text-white p-5 rounded-xl mb-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md">
                            <CarFront size={16} className="text-white" />
                          </div>
                          <h2 className="text-xl font-black tracking-tight">Khatu Rides & Travels Co.</h2>
                        </div>
                        <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                          Premium Car Rental & Logistics Solutions. Corporate Trips, Outstation & Local Transits.
                        </p>
                        <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300">
                          <span className="flex items-center gap-1"><Phone size={11} className="text-orange-400" /> +91 92441 37353</span>
                          <span>🌐 www.khaturidescg.in</span>
                          <span>📍 Chhattisgarh, India</span>
                        </div>
                      </div>

                      {/* Summary Data Badge */}
                      <div className="w-full sm:w-auto bg-white text-slate-900 p-3 rounded-lg shadow-md border border-slate-100 min-w-[200px]">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Invoice Information</span>
                          <span className="font-black text-slate-900 text-sm">#{safeText(invoice.invoiceNumber)}</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Date:</span>
                            <span className="font-semibold text-slate-800">{formatDate(invoice.invoiceDate)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Status:</span>
                            <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">PAID</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Meta & Vehicle Parameters Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-500 border-b border-slate-200/60 pb-1">
                          <UserRound size={13} />
                          <h3 className="text-[10px] font-bold uppercase tracking-wider">Customer Details</h3>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{safeText(invoice.customerName)}</p>
                      </div>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-2">
                        📱 {safeText(invoice.customerMobile)}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 md:col-span-2">
                      <div className="flex items-center gap-1.5 mb-1.5 text-slate-500 border-b border-slate-200/60 pb-1">
                        <CarFront size={13} />
                        <h3 className="text-[10px] font-bold uppercase tracking-wider">Vehicle Specification</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Vehicle Category:</span>
                          <span className="font-semibold text-slate-800">{safeText(invoice.vehicleType)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Registration Plate No:</span>
                          <span className="font-bold text-slate-900 bg-slate-200/70 px-1.5 py-0.5 rounded text-[11px] inline-block mt-0.5 border border-slate-300">{safeText(invoice.vehicleNumber)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Transit Pipeline Step-by-Step */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4">
                    <div className="flex items-center gap-1.5 mb-3 text-slate-500 border-b border-slate-200/60 pb-1">
                      <MapPin size={13} />
                      <h3 className="text-[10px] font-bold uppercase tracking-wider">Route Matrix & Timeline</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                      <div className="relative pl-4 border-l-2 border-orange-500">
                        <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wide block">PICKUP POINT</span>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{safeText(invoice.pickupLocation)}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">🕒 {safeText(invoice.pickupTime)}</p>
                      </div>

                      <div className="relative pl-4 border-l-2 border-emerald-500">
                        <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wide block">DROP DESTINATION</span>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{safeText(invoice.dropLocation)}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">🕒 {safeText(invoice.dropTime)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clean Minimal Matrix Item Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                    <div className="bg-slate-900 text-white px-4 py-2 grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider">
                      <div className="col-span-7 sm:col-span-8">Description Block</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-3 sm:col-span-2 text-right">Net Subtotal</div>
                    </div>
                    
                    <div className="px-4 py-3 border-b border-slate-100 bg-white grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-7 sm:col-span-8">
                        <p className="font-bold text-slate-900">
                          Professional Carriage Service: <span className="text-slate-700 font-medium">{safeText(invoice.pickupLocation)}</span> to <span className="text-slate-700 font-medium">{safeText(invoice.dropLocation)}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          Arrangement parameters include professional navigation allocation, vehicle runtime & fuel expenditures.
                        </p>
                      </div>
                      <div className="col-span-2 text-center font-semibold text-slate-700">1</div>
                      <div className="col-span-3 sm:col-span-2 text-right font-bold text-slate-900">{formatCurrency(invoice.amount)}</div>
                    </div>

                    {/* Compact Billing Calculations Block */}
                    <div className="bg-slate-50/70 p-3 flex justify-end border-t border-slate-100">
                      <div className="w-full sm:max-w-xs space-y-1.5 text-xs text-slate-600\\">
                        <div className="flex justify-between">
                          <span>Subtotal Base Rate:</span>
                          <span className="font-medium text-slate-900">{formatCurrency(invoice.amount)}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>State Tolls & Surcharges:</span>
                          <span className="font-medium text-slate-900">₹0</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-950">
                          <span className="text-slate-900 text-xs font-bold uppercase">Grand Total:</span>
                          <span className="text-base text-slate-900 font-black border-b-2 border-double border-slate-900 pb-0.5">{formatCurrency(invoice.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Special Instructions Remarks Area */}
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3">
                    <h4 className="text-[10px] font-bold text-orange-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      📝 Remarks / Travel Protocol Info
                    </h4>
                    <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                      {invoice.remarks?.trim()
                        ? invoice.remarks
                        : "Thank you for choosing Khatu Rides & Travels Co. Please keep this invoice for your travel record and support reference."}
                    </p>
                  </div>
                </div>

                {/* Lower Explicit Footer Section */}
                <div className="border-t border-slate-200 pt-3 mt-4 text-[11px] text-slate-500">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Khatu Rides & Travels Co.</p>
                      <p className="text-slate-500 text-[10px]">Digital Tax Receipt Generated Securely via Cloud Dashboard</p>
                    </div>
                    <div className="text-center sm:text-right text-[10px] bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60 font-medium text-slate-600">
                      ✓ System generated electronic receipt. Valid without signature authorization stamps.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Strict CSS Page Controls */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0mm !important;
        }

        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .invoice-sheet {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            padding: 12mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            display: block !important;
          }

          .invoice-page {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
        }

        @media screen {
          .invoice-sheet {
            min-height: 297mm;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
          }
        }
      `}</style>
    </>
  );
}