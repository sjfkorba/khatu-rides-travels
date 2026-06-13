"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Share2,
  Trash2,
  Printer,
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
  const [pdfLoading, setPdfLoading] = useState(false);
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

  function formatCurrency(amount?: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  async function generatePdfBlob() {
    const element = invoiceRef.current;
    if (!element || !invoice) return null;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;

    const usableWidth = pageWidth - margin * 2;
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - margin * 2) {
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    } else {
      const fittedHeight = pageHeight - margin * 2;
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, fittedHeight);
    }

    return pdf.output("blob");
  }

  async function handleDownloadPdf() {
    try {
      setPdfLoading(true);
      const blob = await generatePdfBlob();
      if (!blob || !invoice) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber || "invoice"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleSharePdf() {
    try {
      setPdfLoading(true);
      const blob = await generatePdfBlob();
      if (!blob || !invoice) return;

      const file = new File(
        [blob],
        `${invoice.invoiceNumber || "invoice"}.pdf`,
        { type: "application/pdf" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: invoice.invoiceNumber || "Invoice",
          text: `Invoice ${invoice.invoiceNumber || ""}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error(error);
      alert("Share not supported on this device");
    } finally {
      setPdfLoading(false);
    }
  }

  function handlePrint() {
    window.print();
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
      <main className="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-700 font-semibold">
          <Loader2 className="animate-spin" size={20} />
          Loading invoice...
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow p-8 text-center">
          <h2 className="text-2xl font-black mb-2">Invoice not found</h2>
          <p className="text-slate-600 mb-6">
            This invoice may have been deleted or the link is invalid.
          </p>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold"
          >
            <ArrowLeft size={18} />
            Back to Invoices
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
        <div className="max-w-6xl mx-auto">
          <div className="print:hidden flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <Link
                href="/admin/invoices"
                className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold mb-3"
              >
                <ArrowLeft size={18} />
                Back to Invoice Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                Invoice Details
              </h1>
              <p className="text-slate-600 mt-1">
                View, print, download or share this invoice
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold"
              >
                <Printer size={18} />
                Print
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-3 rounded-2xl font-bold"
              >
                {pdfLoading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                Download PDF
              </button>

              <button
                onClick={handleSharePdf}
                disabled={pdfLoading}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-2xl font-bold"
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-3 rounded-2xl font-bold"
              >
                {deleteLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                Delete
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              ref={invoiceRef}
              className="w-full max-w-[900px] bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none print:rounded-none"
            >
              <div className="bg-slate-900 text-white px-6 md:px-10 py-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
                        <FileText size={22} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black">
                          Khatu Rides & Travels
                        </h2>
                        <p className="text-slate-300 text-sm">
                          Taxi Booking & Travel Services
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Professional travel invoice
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-slate-300 text-sm mb-1">Invoice Number</p>
                    <h3 className="text-2xl font-black">{invoice.invoiceNumber || "-"}</h3>
                    <p className="text-slate-300 text-sm mt-3 mb-1">Invoice Date</p>
                    <p className="font-semibold">{invoice.invoiceDate || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-10 py-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">
                      Customer Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-500">Customer Name</p>
                        <p className="text-lg font-bold text-slate-900">
                          {invoice.customerName || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Mobile Number</p>
                        <p className="font-semibold text-slate-800">
                          {invoice.customerMobile || "-"}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">
                      Travel Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-slate-500">Route</p>
                        <p className="font-bold text-slate-900">
                          {invoice.pickupLocation || "-"} → {invoice.dropLocation || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Pick-up Time</p>
                        <p className="font-semibold text-slate-800">
                          {invoice.pickupTime || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Drop Time</p>
                        <p className="font-semibold text-slate-800">
                          {invoice.dropTime || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Vehicle Number</p>
                        <p className="font-semibold text-slate-800">
                          {invoice.vehicleNumber || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Vehicle Type</p>
                        <p className="font-semibold text-slate-800">
                          {invoice.vehicleType || "-"}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <section className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
                    <h4 className="font-bold text-slate-900">Invoice Summary</h4>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-12 gap-4 font-semibold text-slate-500 text-sm border-b pb-3">
                      <div className="col-span-7">Description</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-3 text-right">Amount</div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 py-4 items-center border-b">
                      <div className="col-span-7">
                        Taxi booking service for customer trip from{" "}
                        <span className="font-bold">{invoice.pickupLocation || "-"}</span> to{" "}
                        <span className="font-bold">{invoice.dropLocation || "-"}</span>
                      </div>
                      <div className="col-span-2 text-center">1</div>
                      <div className="col-span-3 text-right font-bold">
                        {formatCurrency(invoice.amount)}
                      </div>
                    </div>

                    <div className="flex justify-end pt-5">
                      <div className="w-full max-w-sm space-y-3">
                        <div className="flex justify-between text-slate-700">
                          <span>Subtotal</span>
                          <span className="font-semibold">
                            {formatCurrency(invoice.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Tax</span>
                          <span className="font-semibold">₹0</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-slate-900 border-t pt-3">
                          <span>Total</span>
                          <span>{formatCurrency(invoice.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                    <h4 className="font-bold text-orange-900 mb-2">Remarks</h4>
                    <p className="text-slate-700 whitespace-pre-line">
                      {invoice.remarks?.trim() ? invoice.remarks : "No remarks added."}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <h4 className="font-bold text-slate-900 mb-2">Payment Note</h4>
                    <p className="text-slate-700">
                      Thank you for choosing Khatu Rides & Travels. Please keep this
                      invoice for your records and future support.
                    </p>
                  </div>
                </section>
              </div>

              <div className="bg-slate-900 text-slate-300 px-6 md:px-10 py-5 text-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p>Khatu Rides & Travels</p>
                  <p>Generated from admin invoice system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}