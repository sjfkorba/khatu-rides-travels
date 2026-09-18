"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  downloadFinalInvoicePdf,
  FinalInvoiceData,
} from "@/lib/generateFinalInvoicePdf";

type VehicleLine = {
  vehicleType?: string;
  variant?: string;
  quantity?: number;
  ratePerVehicle?: number;
  total?: number;
};

type Payment = {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  note?: string;
};

type Booking = {
  bookingNumber: string;
  bookingType?: string;
  bookingDate?: string;
  journeyDate?: string;
  pickupTime?: string;

  customerName: string;
  customerMobile: string;

  pickupLocation: string;
  dropLocation: string;

  vehicles?: VehicleLine[];

  totalAmount?: number;
  advanceAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;

  status?: string;
  remarks?: string;
};

function money(value: number) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function dateText(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FinalInvoicePage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = String(params.id);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const bookingSnap = await getDoc(
          doc(db, "advance_bookings", bookingId)
        );

        if (!bookingSnap.exists()) {
          setError("Booking not found.");
          return;
        }

        const bookingData = bookingSnap.data() as Booking;

        setBooking(bookingData);

        const paymentsRef = collection(
          db,
          "advance_bookings",
          bookingId,
          "payments"
        );

        let paymentDocs;

        try {
          paymentDocs = await getDocs(
            query(
              paymentsRef,
              orderBy("paymentDate", "desc")
            )
          );
        } catch {
          paymentDocs = await getDocs(paymentsRef);
        }

        const paymentList: Payment[] = paymentDocs.docs.map(
          (paymentDoc) => {
            const data = paymentDoc.data();

            return {
              id: paymentDoc.id,
              amount: Number(data.amount || 0),
              paymentDate: String(
                data.paymentDate || ""
              ),
              paymentMode: String(
                data.paymentMode || ""
              ),
              transactionId: data.transactionId
                ? String(data.transactionId)
                : "",
              note: data.note
                ? String(data.note)
                : "",
            };
          }
        );

        setPayments(paymentList);
      } catch (err) {
        console.error(err);
        setError("Unable to load invoice.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [bookingId]);

  const paidAmount = useMemo(() => {
    if (!booking) return 0;

    if (payments.length) {
      return payments.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
      );
    }

    return Number(
      booking.paidAmount ??
        booking.advanceAmount ??
        0
    );
  }, [booking, payments]);

  const totalAmount = Number(
    booking?.totalAmount || 0
  );

  const balanceAmount = Math.max(
    totalAmount - paidAmount,
    0
  );

  function downloadInvoice() {
    if (!booking) return;

    const data: FinalInvoiceData = {
      bookingNumber: booking.bookingNumber,
      bookingType: booking.bookingType,
      bookingDate: booking.bookingDate,
      journeyDate: booking.journeyDate,
      pickupTime: booking.pickupTime,

      customerName: booking.customerName,
      customerMobile: booking.customerMobile,

      pickupLocation: booking.pickupLocation,
      dropLocation: booking.dropLocation,

      vehicles: booking.vehicles || [],

      totalAmount,
      paidAmount,
      balanceAmount,

      status: booking.status,
      remarks: booking.remarks,

      payments,
    };

    downloadFinalInvoicePdf(data);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl bg-white p-10">
          Loading invoice...
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-black text-slate-900">
            {error || "Invoice unavailable"}
          </h1>

          <button
            onClick={() =>
              router.push(
                `/admin/advance-bookings/${bookingId}`
              )
            }
            className="mt-5 rounded-xl bg-[#071A3A] px-5 py-3 text-sm font-bold text-white"
          >
            Back to Booking
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* ACTION BAR */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() =>
              router.push(
                `/admin/advance-bookings/${bookingId}`
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
          >
            ← Back
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
            >
              Print
            </button>

            <button
              onClick={downloadInvoice}
              className="rounded-xl bg-[#063B8F] px-5 py-3 text-sm font-black text-white shadow-lg"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* INVOICE */}

        <section className="overflow-hidden rounded-[28px] bg-white shadow-xl">
          {/* HEADER */}

          <div className="bg-[#071A3A] p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div>
                <div className="text-xl font-black tracking-tight sm:text-2xl">
                  KHATU RIDES
                </div>

                <div className="mt-1 text-xs font-medium text-slate-300">
                  TRAVELS CO.
                </div>

                <div className="mt-4 text-xs text-slate-300">
                  Korba, Chhattisgarh
                </div>

                <div className="mt-1 text-xs text-slate-300">
                  +91 92441 37353
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                  Final Invoice
                </div>

                <div className="mt-3 text-lg font-black">
                  {booking.bookingNumber}
                </div>

                <div className="mt-1 text-xs text-slate-300">
                  {dateText(booking.bookingDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-5 sm:p-8">
            {/* CUSTOMER */}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Customer
                </div>

                <div className="mt-3 text-lg font-black text-slate-950">
                  {booking.customerName}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  +91 {booking.customerMobile}
                </div>

                <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {booking.bookingType || "Advance Booking"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Journey
                </div>

                <div className="mt-3 text-sm font-black text-slate-950">
                  {booking.pickupLocation}
                </div>

                <div className="my-2 text-xs font-bold text-amber-600">
                  ↓ TO
                </div>

                <div className="text-sm font-black text-slate-950">
                  {booking.dropLocation}
                </div>

                <div className="mt-3 flex gap-4 text-xs text-slate-500">
                  <span>
                    Date: {dateText(booking.journeyDate)}
                  </span>

                  <span>
                    Time: {booking.pickupTime || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* VEHICLES */}

            <div>
              <h2 className="mb-4 text-lg font-black text-slate-950">
                Vehicle / Service Details
              </h2>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1fr_60px_90px_100px] bg-[#071A3A] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white">
                  <div>Vehicle</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Amount</div>
                </div>

                {(booking.vehicles || []).map(
                  (vehicle, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_60px_90px_100px] border-t border-slate-100 px-4 py-4 text-sm"
                    >
                      <div className="font-bold text-slate-900">
                        {vehicle.vehicleType || "-"}
                        {vehicle.variant
                          ? ` • ${vehicle.variant}`
                          : ""}
                      </div>

                      <div className="text-center text-slate-600">
                        {vehicle.quantity || 0}
                      </div>

                      <div className="text-right text-slate-600">
                        {money(
                          Number(
                            vehicle.ratePerVehicle || 0
                          )
                        )}
                      </div>

                      <div className="text-right font-black text-slate-950">
                        {money(
                          Number(vehicle.total || 0)
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* PAYMENT SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Total
                </div>

                <div className="mt-2 text-2xl font-black text-slate-950">
                  {money(totalAmount)}
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Paid
                </div>

                <div className="mt-2 text-2xl font-black text-emerald-700">
                  {money(paidAmount)}
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                  Balance Due
                </div>

                <div className="mt-2 text-2xl font-black text-amber-800">
                  {money(balanceAmount)}
                </div>
              </div>
            </div>

            {/* PAYMENT HISTORY */}

            {payments.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-black text-slate-950">
                  Payment History
                </h2>

                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="font-black text-slate-950">
                          {money(payment.amount)}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {dateText(payment.paymentDate)}
                          {" • "}
                          {payment.paymentMode}
                        </div>

                        {payment.transactionId && (
                          <div className="mt-1 text-xs text-slate-400">
                            Ref: {payment.transactionId}
                          </div>
                        )}
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        Received
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REMARKS */}

            {booking.remarks && (
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Remarks
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {booking.remarks}
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="bg-[#071A3A] px-6 py-6 text-center text-white sm:px-8">
            <div className="text-sm font-black">
              Thank you for travelling with Khatu Rides!
            </div>

            <div className="mt-1 text-xs text-slate-400">
              www.khaturidescg.in • +91 92441 37353
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          .print\\:hidden {
            display: none !important;
          }

          section {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}