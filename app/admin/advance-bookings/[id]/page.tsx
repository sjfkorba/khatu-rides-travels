"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Printer,
  Share2,
  Trash2,
  User,
  WalletCards,
  MessageCircle,
} from "lucide-react";

import {
  generateAdvanceBookingPdf,
  downloadAdvanceBookingPdf,
} from "@/lib/generateAdvanceBookingPdf";

/* ============================================================
   TYPES
============================================================ */

type VehicleItem = {
  vehicleType: string;
  variant?: string;
  quantity: number;
  ratePerVehicle: number;
  total: number;
};

type AdvanceBooking = {
  bookingNumber: string;
  bookingType: string;

  bookingDate: string;
  journeyDate: string;
  pickupTime?: string;

  customerName: string;
  customerMobile: string;

  pickupLocation: string;
  dropLocation: string;

  vehicles: VehicleItem[];

  totalVehicles: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;

  status: string;
  remarks?: string;

  source?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

/* ============================================================
   CONSTANTS
============================================================ */

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";
const WHATSAPP = "919244137353";

/* ============================================================
   PAGE
============================================================ */

export default function AdvanceBookingDetailPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  /* ==========================================================
     STATE
  ========================================================== */

  const [booking, setBooking] =
    useState<AdvanceBooking | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);

  const [advanceInput, setAdvanceInput] = useState("");
  const [updatingAdvance, setUpdatingAdvance] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  /* ==========================================================
     LOAD BOOKING
  ========================================================== */

  useEffect(() => {
    if (!bookingId) {
      setError("Invalid booking ID.");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadBooking() {
      try {
        setLoading(true);
        setError("");

        const bookingRef = doc(
          collection(db, "advance_bookings"),
          bookingId
        );

        const snapshot =
          await getDoc(bookingRef);

        if (!mounted) return;

        if (!snapshot.exists()) {
          setError(
            "Advance booking not found."
          );
          return;
        }

        const raw =
          snapshot.data() as Partial<AdvanceBooking>;

        const normalizedVehicles: VehicleItem[] =
          Array.isArray(raw.vehicles)
            ? raw.vehicles.map((vehicle) => ({
                vehicleType:
                  String(
                    vehicle?.vehicleType || "Vehicle"
                  ),

                variant:
                  vehicle?.variant
                    ? String(vehicle.variant)
                    : "",

                quantity: Math.max(
                  Number(vehicle?.quantity || 0),
                  0
                ),

                ratePerVehicle: Math.max(
                  Number(
                    vehicle?.ratePerVehicle || 0
                  ),
                  0
                ),

                total:
                  Number(vehicle?.quantity || 0) *
                  Number(
                    vehicle?.ratePerVehicle || 0
                  ),
              }))
            : [];

        const calculatedTotal =
          normalizedVehicles.reduce(
            (sum, vehicle) =>
              sum +
              Number(vehicle.quantity || 0) *
                Number(
                  vehicle.ratePerVehicle || 0
                ),
            0
          );

        const calculatedVehicleCount =
          normalizedVehicles.reduce(
            (sum, vehicle) =>
              sum +
              Number(vehicle.quantity || 0),
            0
          );

        /*
         * Prefer stored amount when available,
         * otherwise calculate from vehicle lines.
         */
        const storedTotal =
          Number(raw.totalAmount || 0);

        const totalAmount =
          storedTotal > 0
            ? storedTotal
            : calculatedTotal;

        const advanceAmount = Math.max(
          Number(raw.advanceAmount || 0),
          0
        );

        const balanceAmount = Math.max(
          totalAmount - advanceAmount,
          0
        );

        const normalizedBooking: AdvanceBooking = {
          bookingNumber:
            String(
              raw.bookingNumber ||
                bookingId
            ),

          bookingType:
            String(
              raw.bookingType ||
                "Advance Booking"
            ),

          bookingDate:
            String(
              raw.bookingDate || ""
            ),

          journeyDate:
            String(
              raw.journeyDate || ""
            ),

          pickupTime:
            raw.pickupTime
              ? String(raw.pickupTime)
              : "",

          customerName:
            String(
              raw.customerName ||
                "Customer"
            ),

          customerMobile:
            String(
              raw.customerMobile ||
                ""
            ),

          pickupLocation:
            String(
              raw.pickupLocation ||
                ""
            ),

          dropLocation:
            String(
              raw.dropLocation ||
                ""
            ),

          vehicles:
            normalizedVehicles,

          totalVehicles:
            Number(
              raw.totalVehicles ||
                calculatedVehicleCount
            ),

          totalAmount,

          advanceAmount,

          balanceAmount,

          status:
            String(
              raw.status ||
                "Pending"
            ),

          remarks:
            raw.remarks
              ? String(raw.remarks)
              : "",

          source:
            raw.source
              ? String(raw.source)
              : "admin",

          createdAt:
            raw.createdAt,

          updatedAt:
            raw.updatedAt,
        };

        setBooking(
          normalizedBooking
        );

        setAdvanceInput(
          String(advanceAmount)
        );
      } catch (err) {
        console.error(
          "Failed to load advance booking:",
          err
        );

        if (mounted) {
          setError(
            "Failed to load advance booking."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  /* ==========================================================
     CALCULATIONS
  ========================================================== */

  const calculatedTotal = useMemo(() => {
    if (!booking) return 0;

    return booking.vehicles.reduce(
      (sum, vehicle) =>
        sum +
        Number(vehicle.quantity || 0) *
          Number(
            vehicle.ratePerVehicle || 0
          ),
      0
    );
  }, [booking]);

  const calculatedVehicleCount =
    useMemo(() => {
      if (!booking) return 0;

      return booking.vehicles.reduce(
        (sum, vehicle) =>
          sum +
          Number(vehicle.quantity || 0),
        0
      );
    }, [booking]);

  /*
   * The stored booking amount is authoritative
   * when it exists. Otherwise use calculated total.
   */
  const displayTotal = booking
    ? Number(booking.totalAmount || calculatedTotal)
    : 0;

  /* ==========================================================
     FORMATTERS
  ========================================================== */

  function formatCurrency(
    amount: number
  ) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(Number(amount || 0));
  }

  function formatDate(
    dateString?: string
  ) {
    if (!dateString) return "—";

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  function getStatusClass(
    status: string
  ) {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "Partially Paid":
        return "bg-amber-100 text-amber-700 border-amber-200";

      case "Pending":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "Completed":
        return "bg-slate-100 text-slate-700 border-slate-200";

      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  /* ==========================================================
     PDF DATA
     
     Single source of truth for all PDF actions.
  ========================================================== */

  function getPdfData() {
    if (!booking) {
      throw new Error(
        "Booking data is not available."
      );
    }

    return {
      bookingNumber:
        booking.bookingNumber,

      bookingType:
        booking.bookingType,

      bookingDate:
        booking.bookingDate,

      journeyDate:
        booking.journeyDate,

      pickupTime:
        booking.pickupTime,

      customerName:
        booking.customerName,

      customerMobile:
        booking.customerMobile,

      pickupLocation:
        booking.pickupLocation,

      dropLocation:
        booking.dropLocation,

      vehicles:
        booking.vehicles.map(
          (vehicle) => ({
            vehicleType:
              vehicle.vehicleType,

            variant:
              vehicle.variant,

            quantity:
              Number(
                vehicle.quantity || 0
              ),

            ratePerVehicle:
              Number(
                vehicle.ratePerVehicle ||
                  0
              ),

            total:
              Number(
                vehicle.quantity || 0
              ) *
              Number(
                vehicle.ratePerVehicle ||
                  0
              ),
          })
        ),

      totalVehicles:
        calculatedVehicleCount,

      totalAmount:
        displayTotal,

      advanceAmount:
        Number(
          booking.advanceAmount || 0
        ),

      balanceAmount:
        Number(
          booking.balanceAmount || 0
        ),

      status:
        booking.status,

      remarks:
        booking.remarks || "",
    };
  }

  /* ==========================================================
     PRINT PDF
  ========================================================== */

  async function openPrint() {
    if (!booking) return;

    let pdfUrl = "";

    try {
      setPdfLoading(true);

      /*
       * Generate actual PDF Blob.
       */
      const blob =
        await generateAdvanceBookingPdf(
          getPdfData()
        );

      if (
        !blob ||
        blob.size === 0
      ) {
        throw new Error(
          "Generated PDF is empty."
        );
      }

      pdfUrl =
        URL.createObjectURL(blob);

      /*
       * Open generated PDF in a new tab.
       */
      const printWindow =
        window.open(
          pdfUrl,
          "_blank"
        );

      if (!printWindow) {
        alert(
          "Print window blocked. Please allow pop-ups for this website and try again."
        );

        return;
      }

      /*
       * PDF viewer needs some time to load.
       * We intentionally do not immediately revoke
       * the Blob URL.
       */
      window.setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (printError) {
          console.error(
            "Print command failed:",
            printError
          );
        }
      }, 1500);

      /*
       * Keep Blob URL alive long enough for
       * browser PDF viewer.
       */
      window.setTimeout(() => {
        try {
          URL.revokeObjectURL(
            pdfUrl
          );
        } catch {
          // Ignore cleanup error.
        }
      }, 120000);
    } catch (err) {
      console.error(
        "Advance booking PDF print failed:",
        err
      );

      alert(
        "PDF generate nahi ho saka. Please try again."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  /* ==========================================================
     DOWNLOAD PDF
  ========================================================== */

  async function downloadPdf() {
    if (!booking) return;

    try {
      setPdfLoading(true);

      const pdfData =
        getPdfData();

      const blob =
        await downloadAdvanceBookingPdf(
          pdfData
        );

      /*
       * Generator should return Blob.
       * We don't require it for the download,
       * but checking makes failures easier to detect.
       */
      if (
        blob &&
        blob.size === 0
      ) {
        throw new Error(
          "Downloaded PDF is empty."
        );
      }
    } catch (err) {
      console.error(
        "Advance booking PDF download failed:",
        err
      );

      alert(
        "PDF download nahi ho saka. Please try again."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  /* ==========================================================
     SHARE PDF
  ========================================================== */

  async function sharePdf() {
    if (!booking) return;

    try {
      setPdfLoading(true);

      const blob =
        await generateAdvanceBookingPdf(
          getPdfData()
        );

      if (
        !blob ||
        blob.size === 0
      ) {
        throw new Error(
          "Generated PDF is empty."
        );
      }

      const safeBookingNumber =
        String(
          booking.bookingNumber ||
            "Booking"
        ).replace(
          /[^a-zA-Z0-9-_]/g,
          "-"
        );

      const file =
        new File(
          [blob],
          `Khatu-Rides-Advance-Booking-${safeBookingNumber}.pdf`,
          {
            type: "application/pdf",
          }
        );

      /*
       * Native mobile/browser file sharing.
       */
      if (
        typeof navigator !==
          "undefined" &&
        typeof navigator.share ===
          "function" &&
        typeof navigator.canShare ===
          "function" &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title:
            `Khatu Rides - ${booking.bookingNumber}`,

          text:
            `Advance Booking Confirmation - ${booking.bookingNumber}`,

          files: [file],
        });

        return;
      }

      /*
       * Desktop fallback:
       * Download actual PDF.
       */
      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download =
        `Khatu-Rides-Advance-Booking-${safeBookingNumber}.pdf`;

      document.body.appendChild(
        anchor
      );

      anchor.click();

      anchor.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      alert(
        "Direct file sharing is not supported by this browser. PDF has been downloaded instead."
      );
    } catch (err) {
      /*
       * User cancelled native share.
       */
      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Advance booking PDF share failed:",
        err
      );

      alert(
        "PDF share nahi ho saka. Please download the PDF instead."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  /* ==========================================================
     UPDATE ADVANCE
  ========================================================== */

  async function updateAdvance() {
    if (!booking || !bookingId) return;

    const cleaned =
      advanceInput
        .replace(/,/g, "")
        .trim();

    const advance =
      Number(cleaned || 0);

    if (
      !Number.isFinite(
        advance
      ) ||
      advance < 0
    ) {
      alert(
        "Please enter a valid advance amount."
      );
      return;
    }

    if (
      advance >
      displayTotal
    ) {
      alert(
        "Advance amount cannot be greater than total booking amount."
      );
      return;
    }

    try {
      setUpdatingAdvance(
        true
      );

      const balance =
        Math.max(
          displayTotal -
            advance,
          0
        );

      /*
       * Automatically update payment status,
       * but don't override Cancelled/Completed
       * unnecessarily.
       */
      let newStatus =
        booking.status;

      if (
        booking.status !==
          "Cancelled" &&
        booking.status !==
          "Completed"
      ) {
        if (
          advance ===
          displayTotal
        ) {
          newStatus =
            "Confirmed";
        } else if (
          advance > 0
        ) {
          newStatus =
            "Partially Paid";
        } else {
          newStatus =
            "Pending";
        }
      }

      await updateDoc(
        doc(
          db,
          "advance_bookings",
          bookingId
        ),
        {
          advanceAmount:
            advance,

          balanceAmount:
            balance,

          status:
            newStatus,

          updatedAt:
            serverTimestamp(),
        }
      );

      setBooking(
        (previous) =>
          previous
            ? {
                ...previous,

                advanceAmount:
                  advance,

                balanceAmount:
                  balance,

                status:
                  newStatus,
              }
            : previous
      );

      setAdvanceInput(
        String(advance)
      );

      alert(
        "Advance amount updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update advance:",
        err
      );

      alert(
        "Failed to update advance amount."
      );
    } finally {
      setUpdatingAdvance(
        false
      );
    }
  }

  /* ==========================================================
     UPDATE STATUS
  ========================================================== */

  async function updateStatus(
    newStatus: string
  ) {
    if (!booking || !bookingId)
      return;

    if (!newStatus) return;

    try {
      setUpdatingStatus(
        true
      );

      await updateDoc(
        doc(
          db,
          "advance_bookings",
          bookingId
        ),
        {
          status:
            newStatus,

          updatedAt:
            serverTimestamp(),
        }
      );

      setBooking(
        (previous) =>
          previous
            ? {
                ...previous,
                status:
                  newStatus,
              }
            : previous
      );
    } catch (err) {
      console.error(
        "Failed to update booking status:",
        err
      );

      alert(
        "Failed to update booking status."
      );
    } finally {
      setUpdatingStatus(
        false
      );
    }
  }

  /* ==========================================================
     DELETE BOOKING
  ========================================================== */

  async function deleteBooking() {
    if (!booking || !bookingId)
      return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete booking ${booking.bookingNumber}?`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteDoc(
        doc(
          db,
          "advance_bookings",
          bookingId
        )
      );

      router.push(
        "/admin/advance-bookings"
      );
    } catch (err) {
      console.error(
        "Failed to delete booking:",
        err
      );

      alert(
        "Failed to delete booking."
      );

      setDeleting(false);
    }
  }

  /* ==========================================================
     CUSTOMER WHATSAPP
  ========================================================== */

  function openCustomerWhatsApp() {
    if (!booking) return;

    const vehicleText =
      booking.vehicles
        .map((vehicle) => {
          const variant =
            vehicle.variant
              ? ` (${vehicle.variant})`
              : "";

          return `${vehicle.quantity} × ${vehicle.vehicleType}${variant} @ ${formatCurrency(
            vehicle.ratePerVehicle
          )}`;
        })
        .join("\n");

    const message =
      `Hello ${booking.customerName},

Your advance booking with Khatu Rides Travels Co. has been recorded.

Booking No: ${booking.bookingNumber}
Booking Type: ${booking.bookingType}

Journey Date: ${formatDate(
        booking.journeyDate
      )}

Pickup: ${booking.pickupLocation}
Destination: ${booking.dropLocation}
Reporting Time: ${
        booking.pickupTime ||
        "As discussed"
      }

Vehicles:
${vehicleText}

Total Booking Amount: ${formatCurrency(
        displayTotal
      )}

Advance Received: ${formatCurrency(
        booking.advanceAmount
      )}

Balance Amount: ${formatCurrency(
        booking.balanceAmount
      )}

Status: ${booking.status}

Thank you,
Khatu Rides Travels Co.
${PHONE_DISPLAY}
www.khaturidescg.in`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
            <Loader2
              size={30}
              className="animate-spin text-blue-700"
            />
          </div>

          <p className="text-sm font-bold text-slate-600">
            Loading advance booking...
          </p>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    error ||
    !booking
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-[30px] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FileText size={28} />
          </div>

          <h1 className="mt-5 text-xl font-black text-slate-950">
            Booking Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "This advance booking does not exist."}
          </p>

          <Link
            href="/admin/advance-bookings"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white transition hover:bg-slate-800"
          >
            <ArrowLeft
              size={15}
            />
            Back to Advance Bookings
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-page {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-shadow-none {
            box-shadow: none !important;
          }

          .print-break-inside {
            break-inside: avoid;
          }
        }
      `}</style>

      <main className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="print-page mx-auto max-w-6xl">

          {/* ==================================================
              ADMIN HEADER
          ================================================== */}

          <div className="no-print mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <Link
                  href="/admin/advance-bookings"
                  className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
                >
                  <ArrowLeft
                    size={17}
                  />
                  Back to Advance Bookings
                </Link>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg">
                    <FileText
                      size={22}
                    />
                  </div>

                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                      Advance Booking
                    </h1>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {booking.bookingNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* TOP ACTIONS */}

              <div className="flex flex-wrap gap-2">

                <Link
                  href={`/admin/advance-bookings/${bookingId}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  <Pencil
                    size={15}
                  />
                  Edit
                </Link>

                {/* PRINT */}

                <button
                  type="button"
                  onClick={openPrint}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pdfLoading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Printer
                      size={15}
                    />
                  )}

                  Print Invoice
                </button>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pdfLoading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Download
                      size={15}
                    />
                  )}

                  Download PDF
                </button>

                {/* SHARE */}

                <button
                  type="button"
                  onClick={sharePdf}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Share2
                    size={15}
                  />

                  Share PDF
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={deleteBooking}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2
                      size={15}
                    />
                  )}

                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              INVOICE / SCREEN DOCUMENT
          ================================================== */}

          <div className="print-shadow-none overflow-hidden rounded-[30px] bg-white shadow-xl">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="relative overflow-hidden bg-[#061936] px-6 py-7 text-white md:px-9 md:py-9">

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative flex flex-col gap-7 md:flex-row md:items-start md:justify-between">

                <div>
                  <img
                    src="/logo.png"
                    alt="Khatu Rides Travels Co."
                    className="h-12 w-auto object-contain brightness-0 invert"
                  />

                  <p className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                    Travel • Taxi • Tours
                  </p>

                  <p className="mt-2 max-w-md text-xs leading-5 text-blue-100/65">
                    Local, outstation, airport,
                    corporate, wedding and tour
                    travel services.
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-200/60">
                    Booking Document
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                    ADVANCE BOOKING
                  </h2>

                  <p className="mt-2 text-sm font-black text-amber-300">
                    {booking.bookingNumber}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[9px] font-black ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black text-white">
                      {booking.bookingType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                BOOKING SUMMARY
            ================================================== */}

            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-9">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                <div>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Booking Date
                  </p>

                  <p className="mt-1 text-xs font-black text-slate-900">
                    {formatDate(
                      booking.bookingDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Journey Date
                  </p>

                  <p className="mt-1 text-xs font-black text-slate-900">
                    {formatDate(
                      booking.journeyDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Reporting Time
                  </p>

                  <p className="mt-1 text-xs font-black text-slate-900">
                    {booking.pickupTime ||
                      "As discussed"}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Total Vehicles
                  </p>

                  <p className="mt-1 text-xs font-black text-slate-900">
                    {calculatedVehicleCount}{" "}
                    Vehicles
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                CUSTOMER + JOURNEY
            ================================================== */}

            <div className="grid border-b border-slate-200 md:grid-cols-2">

              {/* CUSTOMER */}

              <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r md:px-9 md:py-7">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <User
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <h3 className="text-sm font-black text-slate-950">
                      Customer Details
                    </h3>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-lg font-black text-slate-950">
                    {booking.customerName}
                  </p>

                  <a
                    href={`tel:+91${booking.customerMobile}`}
                    className="no-print mt-2 inline-flex items-center gap-2 text-xs font-bold text-blue-700"
                  >
                    <Phone
                      size={13}
                    />
                    +91{" "}
                    {booking.customerMobile}
                  </a>

                  <p className="hidden print:block mt-2 text-xs font-bold text-slate-600">
                    +91{" "}
                    {booking.customerMobile}
                  </p>
                </div>
              </div>

              {/* JOURNEY */}

              <div className="p-6 md:px-9 md:py-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <MapPin
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Journey
                    </p>

                    <h3 className="text-sm font-black text-slate-950">
                      Travel Details
                    </h3>
                  </div>
                </div>

                <div className="mt-5 space-y-4">

                  <div className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-700 ring-4 ring-blue-100" />

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Pickup / Reporting
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-950">
                        {booking.pickupLocation ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="ml-1 h-5 border-l border-dashed border-slate-300" />

                  <div className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 ring-4 ring-red-100" />

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Destination
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-950">
                        {booking.dropLocation ||
                          "—"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ==================================================
                VEHICLES
            ================================================== */}

            <div className="print-break-inside p-6 md:px-9 md:py-8">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Car
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Vehicle Requirements
                    </p>

                    <h3 className="text-base font-black text-slate-950">
                      Booked Vehicles
                    </h3>
                  </div>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[9px] font-black text-blue-700">
                  {calculatedVehicleCount}{" "}
                  Vehicles
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">

                {/* TABLE HEADER */}

                <div className="hidden grid-cols-[1fr_110px_130px_140px] bg-slate-50 px-4 py-3 md:grid">

                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Vehicle
                  </p>

                  <p className="text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Qty
                  </p>

                  <p className="text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Rate
                  </p>

                  <p className="text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Amount
                  </p>

                </div>

                <div className="divide-y divide-slate-100">

                  {booking.vehicles.length ===
                  0 ? (
                    <div className="px-4 py-8 text-center text-xs font-bold text-slate-400">
                      No vehicle details
                      available.
                    </div>
                  ) : (
                    booking.vehicles.map(
                      (
                        vehicle,
                        index
                      ) => {

                        const lineTotal =
                          Number(
                            vehicle.quantity ||
                              0
                          ) *
                          Number(
                            vehicle.ratePerVehicle ||
                              0
                          );

                        return (
                          <div
                            key={`${vehicle.vehicleType}-${index}`}
                            className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_110px_130px_140px] md:items-center"
                          >

                            <div>
                              <p className="text-sm font-black text-slate-950">
                                {
                                  vehicle.vehicleType
                                }
                              </p>

                              {vehicle.variant && (
                                <p className="mt-1 text-[10px] font-bold text-blue-700">
                                  {
                                    vehicle.variant
                                  }
                                </p>
                              )}

                              <p className="mt-1 text-[9px] text-slate-400 md:hidden">
                                {
                                  vehicle.quantity
                                }{" "}
                                ×{" "}
                                {formatCurrency(
                                  vehicle.ratePerVehicle
                                )}
                              </p>
                            </div>

                            <div className="text-left md:text-right">
                              <span className="text-[9px] font-black uppercase text-slate-400 md:hidden">
                                Quantity{" "}
                              </span>

                              <span className="text-xs font-black text-slate-800">
                                {
                                  vehicle.quantity
                                }
                              </span>
                            </div>

                            <div className="text-left md:text-right">
                              <span className="text-[9px] font-black uppercase text-slate-400 md:hidden">
                                Rate{" "}
                              </span>

                              <span className="text-xs font-black text-slate-800">
                                {formatCurrency(
                                  vehicle.ratePerVehicle
                                )}
                              </span>
                            </div>

                            <div className="text-left md:text-right">
                              <span className="text-[9px] font-black uppercase text-slate-400 md:hidden">
                                Total{" "}
                              </span>

                              <span className="text-sm font-black text-blue-700">
                                {formatCurrency(
                                  lineTotal
                                )}
                              </span>
                            </div>

                          </div>
                        );
                      }
                    )
                  )}

                </div>

                {/* TOTAL */}

                <div className="border-t-2 border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between">

                    <p className="text-sm font-black text-slate-700">
                      Total Booking Amount
                    </p>

                    <p className="text-xl font-black text-slate-950">
                      {formatCurrency(
                        displayTotal
                      )}
                    </p>

                  </div>
                </div>

              </div>
            </div>

            {/* ==================================================
                PAYMENT
            ================================================== */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 md:px-9 md:py-8">

              <div className="grid gap-5 md:grid-cols-[1fr_360px]">

                {/* SUMMARY */}

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <WalletCards
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Payment
                      </p>

                      <h3 className="text-base font-black text-slate-950">
                        Payment Summary
                      </h3>
                    </div>

                  </div>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Total Booking
                      </span>

                      <span className="text-sm font-black text-slate-950">
                        {formatCurrency(
                          displayTotal
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Advance Received
                      </span>

                      <span className="text-sm font-black text-emerald-600">
                        −{" "}
                        {formatCurrency(
                          booking.advanceAmount
                        )}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-3">

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-black text-slate-700">
                          Balance Due
                        </span>

                        <span className="text-2xl font-black text-red-600">
                          {formatCurrency(
                            booking.balanceAmount
                          )}
                        </span>

                      </div>
                    </div>

                  </div>
                </div>

                {/* UPDATE ADVANCE */}

                <div className="no-print rounded-2xl border border-slate-200 bg-white p-5">

                  <p className="text-xs font-black text-slate-950">
                    Update Advance Payment
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-500">
                    Enter the amount received
                    from the customer.
                  </p>

                  <div className="mt-4 flex gap-2">

                    <input
                      type="text"
                      inputMode="decimal"
                      value={advanceInput}
                      onChange={(e) =>
                        setAdvanceInput(
                          e.target.value.replace(
                            /[^\d.]/g,
                            ""
                          )
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key ===
                          "Enter"
                        ) {
                          updateAdvance();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm font-black outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="₹ Advance"
                    />

                    <button
                      type="button"
                      onClick={
                        updateAdvance
                      }
                      disabled={
                        updatingAdvance
                      }
                      className="inline-flex min-w-[85px] items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingAdvance ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        "Update"
                      )}
                    </button>

                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="text-[9px] font-bold text-slate-500">
                      Current Balance
                    </span>

                    <span className="text-xs font-black text-red-600">
                      {formatCurrency(
                        booking.balanceAmount
                      )}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* ==================================================
                REMARKS
            ================================================== */}

            {booking.remarks && (
              <div className="border-t border-slate-200 px-6 py-6 md:px-9">

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

                  <p className="text-[9px] font-black uppercase tracking-wider text-amber-700">
                    Special Instructions /
                    Remarks
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-700">
                    {booking.remarks}
                  </p>

                </div>
              </div>
            )}

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="border-t border-slate-200 px-6 py-6 md:px-9">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-black text-slate-950">
                    Khatu Rides Travels Co.
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Korba, Chhattisgarh •
                    Travel & Taxi Services
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Booking Support
                  </p>

                  <p className="mt-1 text-xs font-black text-blue-700">
                    {PHONE_DISPLAY}
                  </p>
                </div>

              </div>

              <p className="mt-5 text-center text-[8px] font-medium leading-4 text-slate-400">
                This document represents the
                booking details recorded by
                Khatu Rides Travels Co. Final
                vehicle allocation and
                operational details remain
                subject to booking terms,
                availability and confirmation.
              </p>

            </div>
          </div>

          {/* ====================================================
              ADMIN ACTION PANEL
          ==================================================== */}

          <div className="no-print mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">

            {/* STATUS */}

            <div className="rounded-3xl bg-white p-5 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-black text-slate-950">
                    Booking Status
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    Change the current advance
                    booking status.
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  {updatingStatus && (
                    <Loader2
                      size={15}
                      className="animate-spin text-blue-700"
                    />
                  )}

                  <select
                    value={
                      booking.status
                    }
                    onChange={(e) =>
                      updateStatus(
                        e.target.value
                      )
                    }
                    disabled={
                      updatingStatus
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  >
                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Partially Paid">
                      Partially Paid
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                </div>
              </div>
            </div>

            {/* CUSTOMER ACTIONS */}

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">

              {/* CALL */}

              <a
                href={`tel:+91${booking.customerMobile}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-xs font-black text-white shadow-lg transition hover:bg-red-600"
              >
                <Phone
                  size={16}
                  fill="currentColor"
                />
                Call Customer
              </a>

              {/* WHATSAPP */}

              <button
                type="button"
                onClick={
                  openCustomerWhatsApp
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-black text-white shadow-lg transition hover:bg-[#1ebe5d]"
              >
                <MessageCircle
                  size={16}
                  fill="currentColor"
                />
                WhatsApp Customer
              </button>

              {/* DOWNLOAD */}

              <button
                type="button"
                onClick={
                  downloadPdf
                }
                disabled={
                  pdfLoading
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-xs font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pdfLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Download
                    size={16}
                  />
                )}

                Download PDF
              </button>

              {/* PRINT */}

              <button
                type="button"
                onClick={
                  openPrint
                }
                disabled={
                  pdfLoading
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-black text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pdfLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Printer
                    size={16}
                  />
                )}

                Print PDF
              </button>

            </div>
          </div>

          {/* ====================================================
              QUICK DATA CHECK
          ==================================================== */}

          <div className="no-print mt-4 grid grid-cols-2 gap-3 pb-8 sm:grid-cols-4">

            {/* JOURNEY */}

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <CalendarDays
                size={17}
                className="text-blue-700"
              />

              <p className="mt-3 text-[8px] font-black uppercase tracking-wider text-slate-400">
                Journey
              </p>

              <p className="mt-1 text-xs font-black text-slate-900">
                {formatDate(
                  booking.journeyDate
                )}
              </p>

            </div>

            {/* VEHICLES */}

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Car
                size={17}
                className="text-amber-600"
              />

              <p className="mt-3 text-[8px] font-black uppercase tracking-wider text-slate-400">
                Vehicles
              </p>

              <p className="mt-1 text-xs font-black text-slate-900">
                {calculatedVehicleCount}
              </p>

            </div>

            {/* ADVANCE */}

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />

              <p className="mt-3 text-[8px] font-black uppercase tracking-wider text-slate-400">
                Advance
              </p>

              <p className="mt-1 text-xs font-black text-emerald-600">
                {formatCurrency(
                  booking.advanceAmount
                )}
              </p>

            </div>

            {/* BALANCE */}

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Clock3
                size={17}
                className="text-red-600"
              />

              <p className="mt-3 text-[8px] font-black uppercase tracking-wider text-slate-400">
                Balance
              </p>

              <p className="mt-1 text-xs font-black text-red-600">
                {formatCurrency(
                  booking.balanceAmount
                )}
              </p>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}