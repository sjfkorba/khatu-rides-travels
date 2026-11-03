
"use client";

import { downloadBookingTicket } from "@/lib/booking-pdf";
import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  CalendarDays,
  Clock,
  CarFront,
  UserRound,
  Phone,
  Mail,
  CreditCard,
  ReceiptText,
  Printer,
  Globe,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Route,
} from "lucide-react";

// ======================================================
// TYPES
// ======================================================

type Passenger = {
  name: string;
  mobile: string;
  email: string;
};

type Booking = {
  bookingId: string;
  passenger: Passenger;
  pickup: string;
  drop: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string | null;
  returnTime?: string | null;
  bookingType: string;
  vehicleLabel: string;
  distanceKm: number;
  totalFare: number;
  advancePaid: number;
  remainingFare: number;
  paymentId: string;
  status: string;
};

type ApiResponse = {
  success: boolean;
  booking?: Booking;
  error?: string;
};

// ======================================================
// HELPERS
// ======================================================

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function formatTripType(value: string) {
  const types: Record<string, string> = {
    oneway: "One Way",
    roundtrip: "Round Trip",
    local: "Local Rental",
    outstation: "Outstation",
  };

  return types[value?.toLowerCase()] || value || "Taxi Booking";
}

function formatDate(value?: string | null) {
  if (!value) return "Not specified";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ======================================================
// COMPACT DETAIL ITEM
// ======================================================

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-4 text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-900 [overflow-wrap:anywhere]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

// ======================================================
// FARE ITEM
// ======================================================

function FareItem({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "green" | "red";
}) {
  const valueColor =
    variant === "green"
      ? "text-green-700"
      : variant === "red"
        ? "text-red-700"
        : "text-slate-900";

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <p className="text-xs font-semibold leading-4 text-slate-500">
        {label}
      </p>
      <p className={`mt-2 break-words text-lg font-black leading-6 sm:text-xl ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function BookingSuccessClient({
  bookingId,
}: {
  bookingId: string;
}) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ====================================================
  // FETCH BOOKING DETAILS
  // ====================================================

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setError("Booking reference is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/online-bookings/${encodeURIComponent(bookingId)}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const responseText = await response.text();

      let data: ApiResponse;

      try {
        data = JSON.parse(responseText) as ApiResponse;
      } catch {
        console.error("Booking API returned non-JSON:", {
          status: response.status,
          response: responseText.slice(0, 1000),
        });

        throw new Error(
          `Booking server returned an invalid response (${response.status}). Please try again.`
        );
      }

      if (!response.ok || !data.success || !data.booking) {
        throw new Error(
          data.error || "Booking confirmation could not be loaded."
        );
      }

      setBooking(data.booking);
    } catch (err) {
      console.error("Booking confirmation error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load booking confirmation."
      );

      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <RefreshCw
              className="animate-spin text-red-700"
              size={30}
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Preparing Your Booking
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Retrieving your confirmation details...
          </p>
        </div>
      </main>
    );
  }

  // ====================================================
  // ERROR SCREEN
  // ====================================================

  if (error || !booking) {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-slate-50 px-4 py-6">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700">
            <ReceiptText size={28} />
          </div>

          <h1 className="mt-5 text-xl font-black text-slate-900">
            Booking Confirmation Unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-700">
            {error || "Booking details could not be retrieved."}
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            If your Razorpay payment was successful, please do not pay again.
            Contact Khatu Rides with your Booking ID and payment details.
          </p>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-600">
              Booking Reference
            </p>
            <p className="mt-1 break-all text-sm font-bold text-slate-900">
              {bookingId || "Not available"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadBooking()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-base font-bold text-white hover:bg-red-800"
          >
            <RefreshCw size={18} />
            Retry Loading Booking
          </button>

          <a
            href="tel:9244137353"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 text-base font-bold text-slate-800"
          >
            <Phone size={18} />
            Contact Khatu Rides
          </a>
        </section>
      </main>
    );
  }

  // ====================================================
  // PRINT / PDF
  // ====================================================

  const handlePrint = () => {
    window.print();
  };

  // ====================================================
  // CONFIRMED BOOKING SCREEN
  // ====================================================

  return (
    <main className="min-h-[100svh] bg-slate-100 px-3 py-3 text-slate-900 sm:px-5 sm:py-4 lg:flex lg:items-center lg:justify-center">

      <section
        id="booking-confirmation"
        className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
      >

        {/* ============================================= */}
        {/* COMPACT HEADER */}
        {/* ============================================= */}

        <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 size={29} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-red-700">
                  Khatu Rides Travels Co.
                </p>

                <h1 className="mt-0.5 text-xl font-black leading-6 text-slate-900 sm:text-2xl">
                  Booking Confirmed!
                </h1>

                <p className="mt-1 text-sm font-medium text-green-700">
                  Payment successfully verified
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-sm font-bold text-green-800">
              <ShieldCheck size={18} />
              Confirmed
            </div>

          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-red-50 px-3 py-2.5">

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Booking Reference
              </p>
              <p className="mt-0.5 break-all text-base font-black text-red-700 sm:text-lg">
                {booking.bookingId}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">
                Trip Type
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {formatTripType(booking.bookingType)}
              </p>
            </div>

          </div>
        </header>

        {/* ============================================= */}
        {/* MAIN DETAILS GRID */}
        {/* ============================================= */}

        <div className="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-12">

          {/* JOURNEY DETAILS */}

          <section className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4 lg:col-span-7">

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700">
                <Route size={20} />
              </div>

              <div>
                <h2 className="text-base font-black sm:text-lg">
                  Journey Details
                </h2>
                <p className="text-xs text-slate-500">
                  Your travel information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">

              <DetailItem
                icon={MapPin}
                label="Pickup Location"
                value={booking.pickup}
              />

              <DetailItem
                icon={MapPin}
                label="Drop Location"
                value={booking.drop || "Local Rental"}
              />

              <DetailItem
                icon={CalendarDays}
                label="Journey Date"
                value={formatDate(booking.pickupDate)}
              />

              <DetailItem
                icon={Clock}
                label="Pickup Time"
                value={booking.pickupTime}
              />

              {booking.returnDate && (
                <DetailItem
                  icon={CalendarDays}
                  label="Return Date"
                  value={formatDate(booking.returnDate)}
                />
              )}

              {booking.returnTime && (
                <DetailItem
                  icon={Clock}
                  label="Return Time"
                  value={booking.returnTime}
                />
              )}

              <DetailItem
                icon={CarFront}
                label="Selected Vehicle"
                value={booking.vehicleLabel}
              />

              <DetailItem
                icon={Route}
                label="Approx. Distance"
                value={`${booking.distanceKm || 0} KM`}
              />

            </div>
          </section>

          {/* PASSENGER DETAILS */}

          <section className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4 lg:col-span-5">

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700">
                <UserRound size={20} />
              </div>

              <div>
                <h2 className="text-base font-black sm:text-lg">
                  Passenger Details
                </h2>
                <p className="text-xs text-slate-500">
                  Booking contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">

              <DetailItem
                icon={UserRound}
                label="Passenger Name"
                value={booking.passenger?.name || ""}
              />

              <DetailItem
                icon={Phone}
                label="Mobile Number"
                value={booking.passenger?.mobile || ""}
              />

              <DetailItem
                icon={Mail}
                label="Email Address"
                value={booking.passenger?.email || ""}
              />

            </div>
          </section>

          {/* FARE SUMMARY */}

          <section className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4 lg:col-span-7">

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700">
                <CreditCard size={20} />
              </div>

              <div>
                <h2 className="text-base font-black sm:text-lg">
                  Fare & Payment Summary
                </h2>
                <p className="text-xs text-slate-500">
                  Your booking payment breakdown
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">

              <FareItem
                label="Total Fare"
                value={money(booking.totalFare)}
              />

              <FareItem
                label="Advance Paid"
                value={money(booking.advancePaid)}
                variant="green"
              />

              <FareItem
                label="Remaining"
                value={money(booking.remainingFare)}
                variant="red"
              />

            </div>
          </section>

          {/* PAYMENT VERIFIED */}

          <section className="min-w-0 rounded-xl border border-green-200 bg-green-50 p-3 sm:p-4 lg:col-span-5">

            <div className="flex items-center gap-2 text-green-800">
              <ShieldCheck size={21} />

              <h2 className="text-base font-black sm:text-lg">
                Payment Verified
              </h2>
            </div>

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-green-800">
              Razorpay Payment ID
            </p>

            <p className="mt-1 break-all text-sm font-bold leading-5 text-green-950">
              {booking.paymentId || "Not available"}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-800">
              <CheckCircle2 size={17} />
              Verified by Khatu Rides server
            </div>

          </section>

        </div>

        {/* ============================================= */}
        {/* ACTION BUTTONS */}
        {/* ============================================= */}

        <div className="no-print flex flex-col gap-2 border-t border-slate-200 bg-slate-50 p-3 sm:flex-row sm:justify-end sm:px-5">

          <button
            type="button"
            onClick={() => downloadBookingTicket(booking)}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:bg-red-800 sm:min-w-[220px]"
          >
            <Printer size={19} />
            Download PDF Ticket
          </button>

          <a
            href="https://khaturidescg.in"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-extrabold text-slate-800 transition hover:bg-slate-100 sm:min-w-[190px]"
          >
            <Globe size={19} />
            Visit Website
            <ArrowRight size={17} />
          </a>

        </div>

        {/* ============================================= */}
        {/* COMPACT FOOTER */}
        {/* ============================================= */}

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-sm">

          <p className="font-bold text-red-700">
            Khatu Rides Travels Co.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-slate-600">
            <a href="tel:9244137353" className="hover:text-red-700">
              <Phone size={14} className="mr-1 inline" />
              9244137353
            </a>

            <a
              href="https://khaturidescg.in"
              className="hover:text-red-700"
            >
              khaturidescg.in
            </a>
          </div>

        </footer>

      </section>

      {/* ============================================= */}
      {/* PRINT STYLES */}
      {/* ============================================= */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          html,
          body {
            background: #ffffff !important;
            color: #111827 !important;
          }

          body * {
            visibility: hidden;
          }

          #booking-confirmation,
          #booking-confirmation * {
            visibility: visible;
          }

          #booking-confirmation {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          #booking-confirmation .no-print {
            display: none !important;
          }

          button,
          a {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          section,
          div {
            break-inside: avoid;
          }
        }
      `}</style>

    </main>
  );
}
