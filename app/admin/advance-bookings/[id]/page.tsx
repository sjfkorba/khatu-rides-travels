"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
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
  Plus,
  Receipt,
  X,
} from "lucide-react";

import {
  generateAdvanceBookingPdf,
  downloadAdvanceBookingPdf,
} from "@/lib/generateAdvanceBookingPdf";

import {
  downloadPaymentReceiptPdf,
} from "@/lib/generatePaymentReceiptPdf";

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

type PaymentMode =
  | "Cash"
  | "UPI"
  | "Bank Transfer"
  | "Card"
  | "Other";

type Payment = {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  transactionId?: string;
  note?: string;
  createdAt?: unknown;
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
  paidAmount?: number;
  balanceAmount: number;

  paymentStatus?: string;

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

const PAYMENT_MODES: PaymentMode[] = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card",
  "Other",
];

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
     BOOKING STATE
  ========================================================== */

  const [booking, setBooking] =
    useState<AdvanceBooking | null>(null);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] =
    useState(true);

  const [error, setError] = useState("");

  /* ==========================================================
     GENERAL ACTION STATE
  ========================================================== */

  const [deleting, setDeleting] = useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  /* ==========================================================
     PAYMENT MODAL
  ========================================================== */

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [savingPayment, setSavingPayment] =
    useState(false);

  const [deletingPaymentId, setDeletingPaymentId] =
    useState<string | null>(null);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState("");

  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("UPI");

  const [transactionId, setTransactionId] =
    useState("");

  const [paymentNote, setPaymentNote] =
    useState("");

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
                vehicleType: String(
                  vehicle?.vehicleType ||
                    "Vehicle"
                ),

                variant: vehicle?.variant
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

        const normalizedBooking: AdvanceBooking = {
          bookingNumber: String(
            raw.bookingNumber ||
              bookingId
          ),

          bookingType: String(
            raw.bookingType ||
              "Advance Booking"
          ),

          bookingDate: String(
            raw.bookingDate || ""
          ),

          journeyDate: String(
            raw.journeyDate || ""
          ),

          pickupTime: raw.pickupTime
            ? String(raw.pickupTime)
            : "",

          customerName: String(
            raw.customerName ||
              "Customer"
          ),

          customerMobile: String(
            raw.customerMobile || ""
          ),

          pickupLocation: String(
            raw.pickupLocation || ""
          ),

          dropLocation: String(
            raw.dropLocation || ""
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

          paidAmount:
            Number(
              raw.paidAmount ||
                0
            ),

          balanceAmount:
            Math.max(
              Number(
                raw.balanceAmount ??
                  totalAmount -
                    advanceAmount
              ),
              0
            ),

          paymentStatus:
            raw.paymentStatus
              ? String(
                  raw.paymentStatus
                )
              : "",

          status: String(
            raw.status ||
              "Pending"
          ),

          remarks: raw.remarks
            ? String(raw.remarks)
            : "",

          source: raw.source
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
     LOAD PAYMENTS
  ========================================================== */

  async function loadPayments() {
    if (!bookingId) return;

    try {
      setPaymentsLoading(true);

      const paymentsRef =
        collection(
          db,
          "advance_bookings",
          bookingId,
          "payments"
        );

      let snapshot;

      try {
        snapshot = await getDocs(
          query(
            paymentsRef,
            orderBy(
              "paymentDate",
              "desc"
            )
          )
        );
      } catch {
        snapshot =
          await getDocs(paymentsRef);
      }

      const list: Payment[] =
        snapshot.docs.map(
          (paymentDoc) => {
            const data =
              paymentDoc.data();

            return {
              id: paymentDoc.id,

              amount: Number(
                data.amount || 0
              ),

              paymentDate: String(
                data.paymentDate || ""
              ),

              paymentMode:
                PAYMENT_MODES.includes(
                  data.paymentMode
                )
                  ? data.paymentMode
                  : "Other",

              transactionId:
                data.transactionId
                  ? String(
                      data.transactionId
                    )
                  : "",

              note: data.note
                ? String(data.note)
                : "",

              createdAt:
                data.createdAt,
            };
          }
        );

      list.sort((a, b) =>
        String(
          b.paymentDate
        ).localeCompare(
          String(a.paymentDate)
        )
      );

      setPayments(list);
    } catch (err) {
      console.error(
        "Failed to load payments:",
        err
      );
    } finally {
      setPaymentsLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
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

  const displayTotal = booking
    ? Number(
        booking.totalAmount ||
          calculatedTotal
      )
    : 0;

  /*
   * Existing advance amount is treated as
   * already received ONLY when no payment
   * history exists.
   *
   * Once payment records exist,
   * payment history becomes authoritative.
   */

  const totalPaid = useMemo(() => {
    if (payments.length > 0) {
      return payments.reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.amount || 0
          ),
        0
      );
    }

    return Number(
      booking?.advanceAmount || 0
    );
  }, [payments, booking]);

  const balanceDue = Math.max(
    displayTotal - totalPaid,
    0
  );

  const paymentPercentage =
    displayTotal > 0
      ? Math.min(
          (totalPaid /
            displayTotal) *
            100,
          100
        )
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
    ).format(
      Number(amount || 0)
    );
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

  function getToday() {
    return new Date()
      .toISOString()
      .split("T")[0];
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
     OPEN PAYMENT MODAL
  ========================================================== */

  function openPaymentModal() {
    setPaymentAmount(
      balanceDue > 0
        ? String(balanceDue)
        : ""
    );

    setPaymentDate(
      getToday()
    );

    setPaymentMode("UPI");
    setTransactionId("");
    setPaymentNote("");

    setShowPaymentModal(true);
  }

  function closePaymentModal() {
    if (savingPayment) return;

    setShowPaymentModal(false);
  }

  /* ==========================================================
     SAVE PAYMENT
  ========================================================== */

  async function savePayment() {
    if (!booking || !bookingId) return;

    const amount =
      Number(
        paymentAmount
          .replace(/,/g, "")
          .trim()
      );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      alert(
        "Please enter a valid payment amount."
      );
      return;
    }

    if (amount > balanceDue) {
      alert(
        `Payment cannot be greater than the current balance of ${formatCurrency(
          balanceDue
        )}.`
      );
      return;
    }

    if (!paymentDate) {
      alert(
        "Please select payment date."
      );
      return;
    }

    if (
      paymentMode === "UPI" ||
      paymentMode ===
        "Bank Transfer"
    ) {
      if (
        !transactionId.trim()
      ) {
        const proceed =
          window.confirm(
            "Transaction / UTR number is empty. Do you want to continue?"
          );

        if (!proceed) return;
      }
    }

    try {
      setSavingPayment(true);

      const paymentsRef =
        collection(
          db,
          "advance_bookings",
          bookingId,
          "payments"
        );

      await addDoc(
        paymentsRef,
        {
          amount,
          paymentDate,
          paymentMode,
          transactionId:
            transactionId.trim(),
          note:
            paymentNote.trim(),
          createdAt:
            serverTimestamp(),
        }
      );

      /*
       * Recalculate totals from payment
       * history after save.
       */

      const newPaid =
        totalPaid + amount;

      const newBalance =
        Math.max(
          displayTotal -
            newPaid,
          0
        );

      let newStatus =
        booking.status;

      if (
        booking.status !==
          "Cancelled" &&
        booking.status !==
          "Completed"
      ) {
        if (
          newBalance === 0 &&
          displayTotal > 0
        ) {
          newStatus =
            "Confirmed";
        } else if (
          newPaid > 0
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
          paidAmount:
            newPaid,

          balanceAmount:
            newBalance,

          paymentStatus:
            newBalance === 0
              ? "Paid"
              : newPaid > 0
              ? "Partially Paid"
              : "Unpaid",

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

                paidAmount:
                  newPaid,

                advanceAmount:
                  newPaid,

                balanceAmount:
                  newBalance,

                paymentStatus:
                  newBalance === 0
                    ? "Paid"
                    : "Partially Paid",

                status:
                  newStatus,
              }
            : previous
      );

      await loadPayments();

      setShowPaymentModal(false);

      alert(
        "Payment added successfully."
      );
    } catch (err) {
      console.error(
        "Failed to save payment:",
        err
      );

      alert(
        "Payment save nahi ho saka. Please try again."
      );
    } finally {
      setSavingPayment(false);
    }
  }

  /* ==========================================================
     DELETE PAYMENT
  ========================================================== */

  async function deletePayment(
    payment: Payment
  ) {
    if (!booking || !bookingId) return;

    const confirmed =
      window.confirm(
        `Delete payment of ${formatCurrency(
          payment.amount
        )}?`
      );

    if (!confirmed) return;

    try {
      setDeletingPaymentId(
        payment.id
      );

      await deleteDoc(
        doc(
          db,
          "advance_bookings",
          bookingId,
          "payments",
          payment.id
        )
      );

      /*
       * Recalculate payment history
       */

      const paymentsRef =
        collection(
          db,
          "advance_bookings",
          bookingId,
          "payments"
        );

      const snapshot =
        await getDocs(
          paymentsRef
        );

      const newPaid =
        snapshot.docs.reduce(
          (sum, paymentDoc) =>
            sum +
            Number(
              paymentDoc.data()
                .amount || 0
            ),
          0
        );

      const newBalance =
        Math.max(
          displayTotal -
            newPaid,
          0
        );

      let newStatus =
        booking.status;

      if (
        booking.status !==
          "Cancelled" &&
        booking.status !==
          "Completed"
      ) {
        if (
          newBalance === 0 &&
          displayTotal > 0
        ) {
          newStatus =
            "Confirmed";
        } else if (
          newPaid > 0
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
          paidAmount:
            newPaid,

          advanceAmount:
            newPaid,

          balanceAmount:
            newBalance,

          paymentStatus:
            newBalance === 0
              ? "Paid"
              : newPaid > 0
              ? "Partially Paid"
              : "Unpaid",

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

                paidAmount:
                  newPaid,

                advanceAmount:
                  newPaid,

                balanceAmount:
                  newBalance,

                paymentStatus:
                  newBalance === 0
                    ? "Paid"
                    : newPaid > 0
                    ? "Partially Paid"
                    : "Unpaid",

                status:
                  newStatus,
              }
            : previous
      );

      await loadPayments();
    } catch (err) {
      console.error(
        "Failed to delete payment:",
        err
      );

      alert(
        "Payment delete nahi ho saka."
      );
    } finally {
      setDeletingPaymentId(
        null
      );
    }
  }

  /* ==========================================================
     PAYMENT RECEIPT
  ========================================================== */

  function downloadReceipt(
    payment: Payment
  ) {
    if (!booking) return;

    downloadPaymentReceiptPdf({
      bookingNumber:
        booking.bookingNumber,

      bookingType:
        booking.bookingType,

      customerName:
        booking.customerName,

      customerMobile:
        booking.customerMobile,

      paymentId:
        payment.id,

      paymentDate:
        payment.paymentDate,

      paymentMode:
        payment.paymentMode,

      transactionId:
        payment.transactionId,

      amount:
        payment.amount,

      totalAmount:
        displayTotal,

      paidAmount:
        totalPaid,

      balanceAmount:
        balanceDue,

      note:
        payment.note,
    });
  }

  /* ==========================================================
     FINAL INVOICE
  ========================================================== */

  function openFinalInvoice() {
    router.push(
      `/admin/advance-bookings/${bookingId}/invoice`
    );
  }

  /* ==========================================================
     PDF DATA
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
        totalPaid,

      balanceAmount:
        balanceDue,

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

      const printWindow =
        window.open(
          pdfUrl,
          "_blank"
        );

      if (!printWindow) {
        alert(
          "Print window blocked. Please allow pop-ups for this website."
        );

        return;
      }

      window.setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (error) {
          console.error(
            "Print failed:",
            error
          );
        }
      }, 1500);

      window.setTimeout(() => {
        try {
          URL.revokeObjectURL(
            pdfUrl
          );
        } catch {}
      }, 120000);
    } catch (err) {
      console.error(
        "PDF print failed:",
        err
      );

      alert(
        "PDF generate nahi ho saka."
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

      await downloadAdvanceBookingPdf(
        getPdfData()
      );
    } catch (err) {
      console.error(
        "PDF download failed:",
        err
      );

      alert(
        "PDF download nahi ho saka."
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
        "Direct sharing is not supported. PDF downloaded instead."
      );
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "PDF share failed:",
        err
      );

      alert(
        "PDF share nahi ho saka."
      );
    } finally {
      setPdfLoading(false);
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
      setUpdatingStatus(true);

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
        "Failed to update status:",
        err
      );

      alert(
        "Failed to update booking status."
      );
    } finally {
      setUpdatingStatus(false);
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

Your booking with Khatu Rides Travels Co.

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

Total Paid: ${formatCurrency(
        totalPaid
      )}

Balance Amount: ${formatCurrency(
        balanceDue
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

  if (error || !booking) {
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
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white"
          >
            <ArrowLeft size={15} />
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
                  className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"
                >
                  <ArrowLeft size={17} />
                  Back to Advance Bookings
                </Link>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg">
                    <FileText size={22} />
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

                {/* EDIT */}

                <Link
                  href={`/admin/advance-bookings/${bookingId}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  <Pencil size={15} />
                  Edit
                </Link>

                {/* FINAL INVOICE */}

                <button
                  type="button"
                  onClick={
                    openFinalInvoice
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#063B8F] px-4 py-3 text-xs font-black text-white shadow-lg hover:bg-[#052f72]"
                >
                  <Receipt size={15} />
                  Final Invoice
                </button>

                {/* PRINT */}

                <button
                  type="button"
                  onClick={openPrint}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-lg hover:bg-slate-800 disabled:opacity-60"
                >
                  {pdfLoading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Printer size={15} />
                  )}

                  Print Invoice
                </button>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-lg hover:bg-emerald-700 disabled:opacity-60"
                >
                  <Download size={15} />
                  Download PDF
                </button>

                {/* SHARE */}

                <button
                  type="button"
                  onClick={sharePdf}
                  disabled={pdfLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white shadow-lg hover:bg-blue-800 disabled:opacity-60"
                >
                  <Share2 size={15} />
                  Share PDF
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={deleteBooking}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-black text-red-600 hover:bg-red-100 disabled:opacity-60"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              DOCUMENT
          ================================================== */}

          <div className="print-shadow-none overflow-hidden rounded-[30px] bg-white shadow-xl">

            {/* HEADER */}

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

            {/* BOOKING SUMMARY */}

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

            {/* CUSTOMER + JOURNEY */}

            <div className="grid border-b border-slate-200 md:grid-cols-2">

              <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r md:px-9 md:py-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <User size={18} />
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
                    <Phone size={13} />

                    +91{" "}
                    {booking.customerMobile}
                  </a>

                </div>

              </div>

              <div className="p-6 md:px-9 md:py-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <MapPin size={18} />
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

            {/* VEHICLES */}

            <div className="print-break-inside p-6 md:px-9 md:py-8">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Car size={18} />
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
                  {calculatedVehicleCount} Vehicles
                </span>

              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">

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
                      No vehicle details available.
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
                PAYMENT MANAGEMENT
            ================================================== */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-7 md:px-9 md:py-9">

              <div className="flex flex-col gap-6">

                {/* PAYMENT HEADER */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <WalletCards size={20} />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Payment Management
                      </p>

                      <h3 className="text-lg font-black text-slate-950">
                        Booking Payments
                      </h3>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      openPaymentModal
                    }
                    disabled={
                      balanceDue <= 0
                    }
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-xs font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    <Plus size={17} />
                    Add Payment
                  </button>

                </div>

                {/* SUMMARY CARDS */}

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">

                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Total Booking
                    </p>

                    <p className="mt-2 text-2xl font-black text-slate-950">
                      {formatCurrency(
                        displayTotal
                      )}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">

                    <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                      Total Paid
                    </p>

                    <p className="mt-2 text-2xl font-black text-emerald-700">
                      {formatCurrency(
                        totalPaid
                      )}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-100">

                    <p className="text-[9px] font-black uppercase tracking-wider text-red-500">
                      Balance Due
                    </p>

                    <p className="mt-2 text-2xl font-black text-red-600">
                      {formatCurrency(
                        balanceDue
                      )}
                    </p>

                  </div>

                </div>

                {/* PROGRESS */}

                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Payment Progress
                    </span>

                    <span className="text-xs font-black text-slate-700">
                      {Math.round(
                        paymentPercentage
                      )}
                      %
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${paymentPercentage}%`,
                      }}
                    />

                  </div>

                </div>

                {/* PAYMENT HISTORY */}

                <div>

                  <div className="mb-4 flex items-center justify-between">

                    <div>
                      <h4 className="text-sm font-black text-slate-950">
                        Payment History
                      </h4>

                      <p className="mt-1 text-[9px] text-slate-400">
                        All payments received for this booking
                      </p>
                    </div>

                    {payments.length > 0 && (
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-[9px] font-black text-slate-600">
                        {payments.length}{" "}
                        Payment
                        {payments.length !==
                        1
                          ? "s"
                          : ""}
                      </span>
                    )}

                  </div>

                  {paymentsLoading ? (
                    <div className="flex items-center justify-center rounded-2xl bg-white py-10">

                      <Loader2
                        size={22}
                        className="animate-spin text-blue-700"
                      />

                    </div>
                  ) : payments.length ===
                    0 ? (

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <WalletCards size={22} />
                      </div>

                      <p className="mt-4 text-sm font-black text-slate-700">
                        No payment history yet
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add the first payment received from the customer.
                      </p>

                      <button
                        type="button"
                        onClick={
                          openPaymentModal
                        }
                        disabled={
                          balanceDue <= 0
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white disabled:bg-slate-300"
                      >
                        <Plus size={15} />
                        Add First Payment
                      </button>

                    </div>

                  ) : (

                    <div className="space-y-3">

                      {payments.map(
                        (
                          payment,
                          index
                        ) => (

                          <div
                            key={
                              payment.id
                            }
                            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                          >

                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                              <div className="flex min-w-0 items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                  <CheckCircle2
                                    size={18}
                                  />
                                </div>

                                <div className="min-w-0">

                                  <div className="flex flex-wrap items-center gap-2">

                                    <p className="text-lg font-black text-slate-950">
                                      {formatCurrency(
                                        payment.amount
                                      )}
                                    </p>

                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black text-emerald-700">
                                      RECEIVED
                                    </span>

                                  </div>

                                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500">

                                    <span>
                                      {formatDate(
                                        payment.paymentDate
                                      )}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      {payment.paymentMode}
                                    </span>

                                    {payment.transactionId && (
                                      <>
                                        <span>
                                          •
                                        </span>

                                        <span className="break-all">
                                          Ref:{" "}
                                          {
                                            payment.transactionId
                                          }
                                        </span>
                                      </>
                                    )}

                                  </div>

                                  {payment.note && (
                                    <p className="mt-2 text-[10px] leading-4 text-slate-400">
                                      {payment.note}
                                    </p>
                                  )}

                                </div>

                              </div>

                              <div className="flex flex-wrap gap-2 md:justify-end">

                                <button
                                  type="button"
                                  onClick={() =>
                                    downloadReceipt(
                                      payment
                                    )
                                  }
                                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 text-[10px] font-black text-blue-700 hover:bg-blue-100"
                                >
                                  <Receipt size={14} />
                                  Receipt
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deletePayment(
                                      payment
                                    )
                                  }
                                  disabled={
                                    deletingPaymentId ===
                                    payment.id
                                  }
                                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 text-[10px] font-black text-red-600 hover:bg-red-100 disabled:opacity-50"
                                >
                                  {deletingPaymentId ===
                                  payment.id ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={14}
                                    />
                                  )}

                                  Delete
                                </button>

                              </div>

                            </div>

                            <div className="mt-4 border-t border-slate-100 pt-3">

                              <div className="flex items-center justify-between">

                                <span className="text-[9px] font-bold text-slate-400">
                                  Payment #{payments.length - index}
                                </span>

                                <span className="text-[10px] font-black text-red-600">
                                  Balance after payment:{" "}
                                  {formatCurrency(
                                    Math.max(
                                      displayTotal -
                                        payments
                                          .slice(
                                            0,
                                            index +
                                              1
                                          )
                                          .reduce(
                                            (
                                              sum,
                                              item
                                            ) =>
                                              sum +
                                              Number(
                                                item.amount ||
                                                  0
                                              ),
                                            0
                                          ),
                                      0
                                    )
                                  )}
                                </span>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* REMARKS */}

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

            {/* FOOTER */}

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
                This document represents the booking
                details recorded by Khatu Rides Travels
                Co. Final vehicle allocation and
                operational details remain subject to
                booking terms, availability and
                confirmation.
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
                    Change the current advance booking status.
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
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

              <a
                href={`tel:+91${booking.customerMobile}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-xs font-black text-white shadow-lg hover:bg-red-600"
              >
                <Phone
                  size={16}
                  fill="currentColor"
                />
                Call Customer
              </a>

              <button
                type="button"
                onClick={
                  openCustomerWhatsApp
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-black text-white shadow-lg hover:bg-[#1ebe5d]"
              >
                <MessageCircle
                  size={16}
                  fill="currentColor"
                />
                WhatsApp Customer
              </button>

              <button
                type="button"
                onClick={
                  openFinalInvoice
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-5 text-xs font-black text-white shadow-lg hover:bg-[#052f72]"
              >
                <Receipt size={16} />
                Final Invoice
              </button>

            </div>

          </div>

          {/* QUICK DATA */}

          <div className="no-print mt-4 grid grid-cols-2 gap-3 pb-8 sm:grid-cols-4">

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

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />

              <p className="mt-3 text-[8px] font-black uppercase tracking-wider text-slate-400">
                Paid
              </p>

              <p className="mt-1 text-xs font-black text-emerald-600">
                {formatCurrency(
                  totalPaid
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <WalletCards
                size={17}
                className="text-red-600"
              />

              <p className="mt-3 text-[8px] font-black uppercase tracking-wider text-slate-400">
                Balance
              </p>

              <p className="mt-1 text-xs font-black text-red-600">
                {formatCurrency(
                  balanceDue
                )}
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* ======================================================
          ADD PAYMENT MODAL
      ====================================================== */}

      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">

          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:max-w-lg sm:rounded-[28px]">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <WalletCards size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Add Payment
                  </h2>

                  <p className="mt-1 text-[9px] font-semibold text-slate-400">
                    Booking {booking.bookingNumber}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={
                  closePaymentModal
                }
                disabled={
                  savingPayment
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-5 p-5 sm:p-6">

              {/* BALANCE INFO */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-950">
                    {formatCurrency(
                      displayTotal
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-[8px] font-black uppercase tracking-wider text-red-500">
                    Balance
                  </p>

                  <p className="mt-1 text-lg font-black text-red-600">
                    {formatCurrency(
                      balanceDue
                    )}
                  </p>
                </div>

              </div>

              {/* AMOUNT */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Payment Amount
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                    ₹
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    value={
                      paymentAmount
                    }
                    onChange={(e) =>
                      setPaymentAmount(
                        e.target.value.replace(
                          /[^\d.]/g,
                          ""
                        )
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 py-4 pl-10 pr-4 text-lg font-black text-slate-950 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    placeholder="5000"
                  />

                </div>

                {balanceDue > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentAmount(
                        String(
                          balanceDue
                        )
                      )
                    }
                    className="mt-2 text-[9px] font-black text-emerald-600 hover:text-emerald-700"
                  >
                    Pay full balance
                  </button>
                )}

              </div>

              {/* DATE */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Payment Date
                </label>

                <input
                  type="date"
                  value={
                    paymentDate
                  }
                  onChange={(e) =>
                    setPaymentDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              {/* PAYMENT MODE */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Payment Mode
                </label>

                <div className="grid grid-cols-2 gap-2">

                  {PAYMENT_MODES.map(
                    (mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setPaymentMode(
                            mode
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-black transition ${
                          paymentMode ===
                          mode
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  )}

                </div>
              </div>

              {/* TRANSACTION */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Transaction / UTR
                  <span className="ml-1 text-[9px] font-semibold text-slate-400">
                    (optional for Cash)
                  </span>
                </label>

                <input
                  type="text"
                  value={
                    transactionId
                  }
                  onChange={(e) =>
                    setTransactionId(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  placeholder="Enter UTR / transaction reference"
                />
              </div>

              {/* NOTE */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Note
                </label>

                <textarea
                  value={
                    paymentNote
                  }
                  onChange={(e) =>
                    setPaymentNote(
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                  placeholder="Optional payment note..."
                />
              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={
                    closePaymentModal
                  }
                  disabled={
                    savingPayment
                  }
                  className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    savePayment
                  }
                  disabled={
                    savingPayment ||
                    !paymentAmount ||
                    balanceDue <= 0
                  }
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {savingPayment ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={16}
                      />
                      Save Payment
                    </>
                  )}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}