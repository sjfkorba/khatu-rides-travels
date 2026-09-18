"use client";

import { useEffect, useMemo, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

/* ============================================================
   TYPES
============================================================ */

type VehicleItem = {
  id: string;
  vehicleType: string;
  variant: string;
  quantity: string;
  rate: string;
};

type BookingData = {
  bookingNumber?: string;
  bookingType?: string;
  bookingDate?: string;
  journeyDate?: string;
  pickupTime?: string;

  customerName?: string;
  customerMobile?: string;

  pickupLocation?: string;
  dropLocation?: string;

  vehicles?: Array<{
    vehicleType?: string;
    variant?: string;
    quantity?: number | string;
    ratePerVehicle?: number | string;
    total?: number | string;
  }>;

  totalVehicles?: number | string;
  totalAmount?: number | string;
  advanceAmount?: number | string;
  balanceAmount?: number | string;

  status?: string;
  remarks?: string;

  source?: string;
};

/* ============================================================
   CONSTANTS
============================================================ */

const VEHICLE_OPTIONS = [
  "Verna",
  "Scorpio",
  "Innova",
  "Innova Crysta",
  "Ertiga",
  "Dzire",
  "Bolero",
  "Other",
];

const BOOKING_TYPES = [
  "Advance Booking",
  "Wedding Booking",
  "Event Booking",
  "Corporate Booking",
  "Tour Booking",
  "Group Booking",
];

const STATUS_OPTIONS = [
  "Confirmed",
  "Pending",
  "Partially Paid",
  "Completed",
  "Cancelled",
];

/* ============================================================
   HELPERS
============================================================ */

function createVehicle(): VehicleItem {
  return {
    id:
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    vehicleType: "Innova",
    variant: "",
    quantity: "1",
    rate: "",
  };
}

function formatMoney(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))}`;
}

function toNumber(value: string | number | undefined) {
  const parsed = Number(
    String(value ?? "")
      .replace(/,/g, "")
      .trim()
  );

  return Number.isFinite(parsed) ? parsed : 0;
}

function cleanString(value: unknown) {
  return String(value ?? "").trim();
}

/* ============================================================
   INLINE ICONS
   Avoids lucide-react Turbopack icon issues.
============================================================ */

function IconArrowLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconSave() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function IconRoute() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M8 5h3a4 4 0 0 1 4 4v2a4 4 0 0 0 4 4h0" />
      <path d="M6 7v10" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 17-1-5 2-5h12l2 5-1 5" />
      <path d="M4 12h16" />
      <path d="M7 17h10" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </svg>
  );
}

function IconRupee() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4h12" />
      <path d="M6 8h9a4 4 0 0 0 0-8" />
      <path d="M6 8l9 12" />
      <path d="M6 20h12" />
    </svg>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function EditAdvanceBookingPage() {
  const params =
    useParams<{ id: string }>();

  const router =
    useRouter();

  const bookingId =
    params?.id;

  /* ==========================================================
     STATE
  ========================================================== */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [bookingNumber, setBookingNumber] =
    useState("");

  const [bookingType, setBookingType] =
    useState("Advance Booking");

  const [bookingDate, setBookingDate] =
    useState("");

  const [journeyDate, setJourneyDate] =
    useState("");

  const [pickupTime, setPickupTime] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [customerMobile, setCustomerMobile] =
    useState("");

  const [pickupLocation, setPickupLocation] =
    useState("");

  const [dropLocation, setDropLocation] =
    useState("");

  const [vehicles, setVehicles] =
    useState<VehicleItem[]>([]);

  const [advanceAmount, setAdvanceAmount] =
    useState("");

  const [status, setStatus] =
    useState("Pending");

  const [remarks, setRemarks] =
    useState("");

  /* ==========================================================
     LOAD BOOKING
  ========================================================== */

  useEffect(() => {
    if (!bookingId) {
      setError(
        "Booking ID is missing."
      );

      setLoading(false);

      return;
    }

    let mounted = true;

    async function loadBooking() {
      try {
        setLoading(true);
        setError("");

        const bookingRef =
          doc(
            db,
            "advance_bookings",
            bookingId
          );

        const snapshot =
          await getDoc(
            bookingRef
          );

        if (!snapshot.exists()) {
          if (mounted) {
            setError(
              "This advance booking was not found."
            );
          }

          return;
        }

        const data =
          snapshot.data() as BookingData;

        if (!mounted) return;

        setBookingNumber(
          cleanString(
            data.bookingNumber
          )
        );

        setBookingType(
          cleanString(
            data.bookingType
          ) ||
            "Advance Booking"
        );

        setBookingDate(
          cleanString(
            data.bookingDate
          )
        );

        setJourneyDate(
          cleanString(
            data.journeyDate
          )
        );

        setPickupTime(
          cleanString(
            data.pickupTime
          )
        );

        setCustomerName(
          cleanString(
            data.customerName
          )
        );

        setCustomerMobile(
          cleanString(
            data.customerMobile
          )
        );

        setPickupLocation(
          cleanString(
            data.pickupLocation
          )
        );

        setDropLocation(
          cleanString(
            data.dropLocation
          )
        );

        const loadedVehicles =
          Array.isArray(
            data.vehicles
          )
            ? data.vehicles.map(
                (
                  vehicle,
                  index
                ) => ({
                  id:
                    typeof crypto !==
                      "undefined" &&
                    crypto.randomUUID
                      ? crypto.randomUUID()
                      : `${Date.now()}-${index}`,

                  vehicleType:
                    cleanString(
                      vehicle.vehicleType
                    ) ||
                    "Innova",

                  variant:
                    cleanString(
                      vehicle.variant
                    ),

                  quantity:
                    String(
                      vehicle.quantity ??
                        "1"
                    ),

                  rate:
                    String(
                      vehicle.ratePerVehicle ??
                        ""
                    ),
                })
              )
            : [];

        setVehicles(
          loadedVehicles.length
            ? loadedVehicles
            : [createVehicle()]
        );

        setAdvanceAmount(
          String(
            data.advanceAmount ??
              ""
          )
        );

        setStatus(
          cleanString(
            data.status
          ) ||
            "Pending"
        );

        setRemarks(
          cleanString(
            data.remarks
          )
        );
      } catch (err: any) {
        console.error(
          "Load advance booking error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load this booking."
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

  const totalAmount =
    useMemo(() => {
      return vehicles.reduce(
        (
          total,
          vehicle
        ) => {
          const quantity =
            Math.max(
              0,
              toNumber(
                vehicle.quantity
              )
            );

          const rate =
            Math.max(
              0,
              toNumber(
                vehicle.rate
              )
            );

          return (
            total +
            quantity *
              rate
          );
        },
        0
      );
    }, [vehicles]);

  const totalVehicles =
    useMemo(() => {
      return vehicles.reduce(
        (
          total,
          vehicle
        ) => {
          return (
            total +
            Math.max(
              0,
              toNumber(
                vehicle.quantity
              )
            )
          );
        },
        0
      );
    }, [vehicles]);

  const numericAdvance =
    Math.max(
      0,
      toNumber(
        advanceAmount
      )
    );

  const balanceAmount =
    Math.max(
      0,
      totalAmount -
        numericAdvance
    );

  /* ==========================================================
     VEHICLE HANDLERS
  ========================================================== */

  function updateVehicle(
    id: string,
    field: keyof VehicleItem,
    value: string
  ) {
    setVehicles(
      (current) =>
        current.map(
          (vehicle) =>
            vehicle.id === id
              ? {
                  ...vehicle,
                  [field]:
                    value,
                }
              : vehicle
        )
    );
  }

  function addVehicle() {
    setVehicles(
      (current) => [
        ...current,
        createVehicle(),
      ]
    );
  }

  function removeVehicle(
    id: string
  ) {
    if (
      vehicles.length <= 1
    ) {
      return;
    }

    setVehicles(
      (current) =>
        current.filter(
          (vehicle) =>
            vehicle.id !== id
        )
    );
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  function validateForm() {
    if (!customerName.trim()) {
      return "Please enter customer name.";
    }

    if (
      !/^[6-9][0-9]{9}$/.test(
        customerMobile.trim()
      )
    ) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!bookingDate) {
      return "Please select booking date.";
    }

    if (!journeyDate) {
      return "Please select journey date.";
    }

    if (!pickupLocation.trim()) {
      return "Please enter pickup location.";
    }

    if (!dropLocation.trim()) {
      return "Please enter destination.";
    }

    if (
      vehicles.length === 0
    ) {
      return "Please add at least one vehicle.";
    }

    for (
      let index = 0;
      index <
      vehicles.length;
      index++
    ) {
      const vehicle =
        vehicles[index];

      if (
        !vehicle.vehicleType.trim()
      ) {
        return `Please select vehicle for row ${
          index + 1
        }.`;
      }

      const quantity =
        toNumber(
          vehicle.quantity
        );

      if (
        quantity <= 0
      ) {
        return `Vehicle quantity must be greater than 0 in row ${
          index + 1
        }.`;
      }

      const rate =
        toNumber(
          vehicle.rate
        );

      if (
        rate < 0
      ) {
        return `Vehicle rate cannot be negative in row ${
          index + 1
        }.`;
      }
    }

    if (
      numericAdvance >
      totalAmount
    ) {
      return "Advance amount cannot be greater than total booking amount.";
    }

    if (
      remarks.length >
      2000
    ) {
      return "Remarks cannot exceed 2000 characters.";
    }

    return "";
  }

  /* ==========================================================
     SAVE
  ========================================================== */

  async function handleSave() {
    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!bookingId) {
      setError(
        "Booking ID is missing."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to save these changes?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const bookingRef =
        doc(
          db,
          "advance_bookings",
          bookingId
        );

      /*
       * IMPORTANT:
       * bookingNumber is intentionally kept
       * unchanged.
       */

      await updateDoc(
        bookingRef,
        {
          bookingNumber:
            bookingNumber,

          bookingType:
            bookingType,

          bookingDate:
            bookingDate,

          journeyDate:
            journeyDate,

          pickupTime:
            pickupTime,

          customerName:
            customerName.trim(),

          customerMobile:
            customerMobile.trim(),

          pickupLocation:
            pickupLocation.trim(),

          dropLocation:
            dropLocation.trim(),

          vehicles:
            vehicles.map(
              (vehicle) => {
                const quantity =
                  Math.max(
                    0,
                    toNumber(
                      vehicle.quantity
                    )
                  );

                const rate =
                  Math.max(
                    0,
                    toNumber(
                      vehicle.rate
                    )
                  );

                return {
                  vehicleType:
                    vehicle.vehicleType.trim(),

                  variant:
                    vehicle.variant.trim(),

                  quantity,

                  ratePerVehicle:
                    rate,

                  total:
                    quantity *
                    rate,
                };
              }
            ),

          totalVehicles:
            totalVehicles,

          totalAmount:
            totalAmount,

          advanceAmount:
            numericAdvance,

          balanceAmount:
            balanceAmount,

          status:
            status,

          remarks:
            remarks.trim(),

          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        "Booking updated successfully."
      );

      /*
       * Give the success message a moment
       * before returning to the detail screen.
       */

      setTimeout(() => {
        router.push(
          `/admin/advance-bookings/${bookingId}`
        );
      }, 700);
    } catch (err: any) {
      console.error(
        "Update advance booking error:",
        err
      );

      const code =
        err?.code || "";

      if (
        code ===
        "permission-denied"
      ) {
        setError(
          "Permission denied. Please make sure you are signed in as an admin."
        );
      } else if (
        code ===
        "not-found"
      ) {
        setError(
          "This booking no longer exists."
        );
      } else {
        setError(
          err?.message ||
            "Unable to update booking. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     LOADING SCREEN
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F7FB]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#063B8F]" />

            <p className="text-sm font-bold text-slate-900">
              Loading booking...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait while we fetch the booking details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR WITHOUT DATA
  ========================================================== */

  if (
    error &&
    !bookingNumber
  ) {
    return (
      <main className="min-h-screen bg-[#F5F7FB]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <IconAlert />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-950">
              Unable to open booking
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#071A3A] px-5 text-sm font-black text-white transition hover:bg-[#063B8F]"
            >
              <IconArrowLeft />
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#F5F7FB] pb-24">
      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/advance-bookings/${bookingId}`
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#063B8F]"
              aria-label="Back"
            >
              <IconArrowLeft />
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
                Advance Booking
              </p>

              <h1 className="truncate text-base font-black text-slate-950 sm:text-lg">
                Edit Booking
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/advance-bookings/${bookingId}`
                )
              }
              disabled={saving}
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#063B8F] px-5 text-xs font-black text-white shadow-[0_8px_24px_rgba(6,59,143,0.2)] transition hover:bg-[#052F72] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconSave />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* ====================================================
            PAGE INTRO
        ==================================================== */}

        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#071A3A] via-[#063B8F] to-[#0755B5] p-5 text-white shadow-[0_18px_50px_rgba(7,26,58,0.15)] sm:p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                Editing Existing Booking
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                {bookingNumber}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-100">
                Update customer, journey, vehicle,
                payment and booking status details.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                Current Booking Amount
              </p>

              <p className="mt-1 text-2xl font-black text-amber-300">
                {formatMoney(
                  totalAmount
                )}
              </p>

              <p className="mt-1 text-xs font-semibold text-blue-100">
                {totalVehicles} vehicle
                {totalVehicles === 1
                  ? ""
                  : "s"}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            ERROR / SUCCESS
        ==================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700">
            <div className="mt-0.5 shrink-0">
              <IconAlert />
            </div>

            <p className="leading-5">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-700">
            <div className="mt-0.5 shrink-0">
              <IconCheck />
            </div>

            <p className="leading-5">
              {success}
            </p>
          </div>
        )}

        {/* ====================================================
            FORM
        ==================================================== */}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {/* =================================================
                BASIC BOOKING
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F]">
                    <IconRoute />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Booking Information
                    </h3>

                    <p className="text-xs font-medium text-slate-500">
                      Basic booking and journey details
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {/* Booking Number */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Booking Number
                  </label>

                  <input
                    type="text"
                    value={bookingNumber}
                    readOnly
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-black text-slate-600 outline-none"
                  />

                  <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                    Booking number cannot be changed.
                  </p>
                </div>

                {/* Booking Type */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Booking Type
                  </label>

                  <div className="relative">
                    <select
                      value={
                        bookingType
                      }
                      onChange={(event) =>
                        setBookingType(
                          event.target.value
                        )
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-800 outline-none transition focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                    >
                      {BOOKING_TYPES.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <IconChevron />
                    </span>
                  </div>
                </div>

                {/* Status */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Status
                  </label>

                  <div className="relative">
                    <select
                      value={
                        status
                      }
                      onChange={(event) =>
                        setStatus(
                          event.target.value
                        )
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-800 outline-none transition focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                    >
                      {STATUS_OPTIONS.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <IconChevron />
                    </span>
                  </div>
                </div>

                {/* Booking Date */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Booking Date
                  </label>

                  <input
                    type="date"
                    value={
                      bookingDate
                    }
                    onChange={(event) =>
                      setBookingDate(
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* Journey Date */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Journey Date
                  </label>

                  <input
                    type="date"
                    value={
                      journeyDate
                    }
                    onChange={(event) =>
                      setJourneyDate(
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* Pickup Time */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Pickup Time
                  </label>

                  <input
                    type="time"
                    value={
                      pickupTime
                    }
                    onChange={(event) =>
                      setPickupTime(
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                CUSTOMER
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <IconUser />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Customer Details
                    </h3>

                    <p className="text-xs font-medium text-slate-500">
                      Customer contact information
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    value={
                      customerName
                    }
                    onChange={(event) =>
                      setCustomerName(
                        event.target.value
                      )
                    }
                    placeholder="Enter customer name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* Mobile */}

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Customer Mobile
                  </label>

                  <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-[#063B8F] focus-within:ring-4 focus-within:ring-blue-50">
                    <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-600">
                      +91
                    </div>

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={
                        customerMobile
                      }
                      onChange={(event) =>
                        setCustomerMobile(
                          event.target.value.replace(
                            /\D/g,
                            ""
                          ).slice(
                            0,
                            10
                          )
                        )
                      }
                      placeholder="10 digit mobile number"
                      className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                JOURNEY
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F]">
                    <IconRoute />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Journey Details
                    </h3>

                    <p className="text-xs font-medium text-slate-500">
                      Pickup and destination information
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Pickup Location
                  </label>

                  <input
                    type="text"
                    value={
                      pickupLocation
                    }
                    onChange={(event) =>
                      setPickupLocation(
                        event.target.value
                      )
                    }
                    placeholder="Pickup location"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Destination
                  </label>

                  <input
                    type="text"
                    value={
                      dropLocation
                    }
                    onChange={(event) =>
                      setDropLocation(
                        event.target.value
                      )
                    }
                    placeholder="Destination"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                VEHICLES
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <IconCar />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Vehicle Reservation
                    </h3>

                    <p className="text-xs font-medium text-slate-500">
                      Edit vehicle quantity and pricing
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    addVehicle
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-4 text-xs font-black text-white shadow-sm transition hover:bg-[#052F72]"
                >
                  <IconPlus />
                  Add Vehicle
                </button>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                {vehicles.map(
                  (
                    vehicle,
                    index
                  ) => {
                    const quantity =
                      toNumber(
                        vehicle.quantity
                      );

                    const rate =
                      toNumber(
                        vehicle.rate
                      );

                    const lineTotal =
                      quantity *
                      rate;

                    return (
                      <div
                        key={
                          vehicle.id
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        {/* Row Header */}

                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-[#063B8F]">
                              Vehicle #
                              {index +
                                1}
                            </p>

                            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                              Vehicle reservation details
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeVehicle(
                                vehicle.id
                              )
                            }
                            disabled={
                              vehicles.length <=
                              1
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-[11px] font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <IconTrash />
                            <span className="hidden sm:inline">
                              Remove
                            </span>
                          </button>
                        </div>

                        {/* Fields */}

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.65fr_0.9fr_0.95fr]">
                          {/* Vehicle */}

                          <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Vehicle
                            </label>

                            <div className="relative">
                              <select
                                value={
                                  vehicle.vehicleType
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateVehicle(
                                    vehicle.id,
                                    "vehicleType",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-bold text-slate-800 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                              >
                                {VEHICLE_OPTIONS.map(
                                  (
                                    item
                                  ) => (
                                    <option
                                      key={
                                        item
                                      }
                                      value={
                                        item
                                      }
                                    >
                                      {
                                        item
                                      }
                                    </option>
                                  )
                                )}
                              </select>

                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <IconChevron />
                              </span>
                            </div>
                          </div>

                          {/* Variant */}

                          <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Variant
                            </label>

                            <input
                              type="text"
                              value={
                                vehicle.variant
                              }
                              onChange={(
                                event
                              ) =>
                                updateVehicle(
                                  vehicle.id,
                                  "variant",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. VXI / ZXI"
                              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                            />
                          </div>

                          {/* Quantity */}

                          <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                vehicle.quantity
                              }
                              onChange={(
                                event
                              ) =>
                                updateVehicle(
                                  vehicle.id,
                                  "quantity",
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                            />
                          </div>

                          {/* Rate */}

                          <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Rate / Vehicle
                            </label>

                            <div className="relative">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                                ₹
                              </span>

                              <input
                                type="number"
                                min="0"
                                value={
                                  vehicle.rate
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateVehicle(
                                    vehicle.id,
                                    "rate",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="0"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-7 pr-3 text-sm font-bold text-slate-800 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                              />
                            </div>
                          </div>

                          {/* Total */}

                          <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Line Total
                            </label>

                            <div className="flex h-11 items-center rounded-xl border border-blue-100 bg-blue-50 px-3 text-sm font-black text-[#063B8F]">
                              {formatMoney(
                                lineTotal
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* Vehicle Summary */}

                <div className="grid gap-3 pt-1 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Vehicle Lines
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      {
                        vehicles.length
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Total Vehicles
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      {
                        totalVehicles
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-black text-[#063B8F]">
                      {formatMoney(
                        totalAmount
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                REMARKS
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h3 className="text-base font-black text-slate-950">
                  Booking Remarks
                </h3>

                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Add special instructions or internal notes
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <textarea
                  value={remarks}
                  onChange={(event) =>
                    setRemarks(
                      event.target.value
                    )
                  }
                  maxLength={2000}
                  rows={5}
                  placeholder="Enter booking notes, special instructions, customer requirements, etc."
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                />

                <div className="mt-2 flex justify-end">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {remarks.length}/2000
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-5">
            {/* Payment */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#071A3A] px-5 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                    <IconRupee />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-200">
                      Payment
                    </p>

                    <h3 className="text-lg font-black">
                      Payment Summary
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-500">
                    Total Booking
                  </span>

                  <span className="text-base font-black text-slate-950">
                    {formatMoney(
                      totalAmount
                    )}
                  </span>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Advance Amount
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        advanceAmount
                      }
                      onChange={(event) =>
                        setAdvanceAmount(
                          event.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-base font-black text-slate-900 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black text-slate-600">
                      Balance Due
                    </span>

                    <span
                      className={`text-xl font-black ${
                        balanceAmount >
                        0
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {formatMoney(
                        balanceAmount
                      )}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-xs font-bold ${
                    balanceAmount >
                    0
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {balanceAmount >
                  0
                    ? "Payment is still pending."
                    : "Booking is fully paid."}
                </div>
              </div>
            </section>

            {/* Booking Status */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Current Status
              </p>

              <div
                className={`mt-3 rounded-2xl px-4 py-4 ${
                  status ===
                  "Confirmed"
                    ? "bg-emerald-50"
                    : status ===
                      "Cancelled"
                    ? "bg-red-50"
                    : status ===
                      "Completed"
                    ? "bg-slate-100"
                    : "bg-blue-50"
                }`}
              >
                <p
                  className={`text-lg font-black ${
                    status ===
                    "Confirmed"
                      ? "text-emerald-700"
                      : status ===
                        "Cancelled"
                      ? "text-red-700"
                      : status ===
                        "Completed"
                      ? "text-slate-700"
                      : "text-[#063B8F]"
                  }`}
                >
                  {status}
                </p>

                <p className="mt-1 text-[11px] font-medium leading-5 text-slate-500">
                  This status will be saved with the
                  booking.
                </p>
              </div>
            </section>

            {/* Summary */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Booking Summary
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Customer
                  </span>

                  <span className="max-w-[180px] text-right text-xs font-black text-slate-900">
                    {customerName ||
                      "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Journey
                  </span>

                  <span className="max-w-[180px] text-right text-xs font-black text-slate-900">
                    {journeyDate ||
                      "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Vehicles
                  </span>

                  <span className="text-xs font-black text-slate-900">
                    {
                      totalVehicles
                    }
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Advance
                  </span>

                  <span className="text-xs font-black text-emerald-600">
                    {formatMoney(
                      numericAdvance
                    )}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black text-slate-700">
                      Balance
                    </span>

                    <span className="text-base font-black text-red-600">
                      {formatMoney(
                        balanceAmount
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Desktop Save */}

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={saving}
              className="hidden w-full min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#063B8F] px-5 text-sm font-black text-white shadow-[0_12px_30px_rgba(6,59,143,0.22)] transition hover:bg-[#052F72] disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            >
              <IconSave />

              {saving
                ? "Saving Changes..."
                : "Save Booking Changes"}
            </button>
          </aside>
        </div>
      </div>

      {/* ======================================================
          MOBILE BOTTOM ACTION BAR
      ====================================================== */}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-4 lg:hidden">
        <div className="mx-auto flex max-w-3xl gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/advance-bookings/${bookingId}`
              )
            }
            disabled={saving}
            className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={saving}
            className="flex min-h-12 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-[#063B8F] px-4 text-xs font-black text-white shadow-[0_8px_22px_rgba(6,59,143,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconSave />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}