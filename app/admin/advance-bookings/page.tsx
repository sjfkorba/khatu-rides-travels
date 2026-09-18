"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  downloadAdvanceBookingPdf,
} from "@/lib/generateAdvanceBookingPdf";

/* ============================================================
   TYPES
============================================================ */

type VehicleItem = {
  vehicleType?: string;
  variant?: string;
  quantity?: number | string;
  ratePerVehicle?: number | string;
  total?: number | string;
};

type AdvanceBooking = {
  id: string;

  bookingNumber?: string;
  bookingType?: string;

  bookingDate?: string;
  journeyDate?: string;
  pickupTime?: string;

  customerName?: string;
  customerMobile?: string;

  pickupLocation?: string;
  dropLocation?: string;

  vehicles?: VehicleItem[];

  totalVehicles?: number | string;
  totalAmount?: number | string;
  advanceAmount?: number | string;
  balanceAmount?: number | string;

  status?: string;
  remarks?: string;

  source?: string;

  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
};

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS_OPTIONS = [
  "All",
  "Confirmed",
  "Pending",
  "Partially Paid",
  "Completed",
  "Cancelled",
];

const BOOKING_TYPES = [
  "All",
  "Advance Booking",
  "Wedding Booking",
  "Event Booking",
  "Corporate Booking",
  "Tour Booking",
  "Group Booking",
];

/* ============================================================
   HELPERS
============================================================ */

function num(
  value: number | string | undefined
) {
  const parsed = Number(
    String(value ?? "")
      .replace(/,/g, "")
      .trim()
  );

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function formatMoney(
  value: number | string | undefined
) {
  return `₹${new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  ).format(
    Math.round(
      num(value)
    )
  )}`;
}

function formatDate(
  value?: string
) {
  if (!value) return "-";

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function todayString() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeMobile(
  value?: string
) {
  return String(
    value ?? ""
  ).replace(
    /\D/g,
    ""
  );
}

function whatsappUrl(
  mobile?: string,
  booking?: AdvanceBooking
) {
  const phone =
    normalizeMobile(
      mobile
    );

  if (!phone) {
    return "#";
  }

  const message = [
    "Hello Khatu Rides,",
    "",
    `Booking: ${
      booking?.bookingNumber ||
      "-"
    }`,
    `Customer: ${
      booking?.customerName ||
      "-"
    }`,
    `Journey Date: ${
      formatDate(
        booking?.journeyDate
      )
    }`,
    `Pickup: ${
      booking?.pickupLocation ||
      "-"
    }`,
    `Destination: ${
      booking?.dropLocation ||
      "-"
    }`,
    `Total: ${
      formatMoney(
        booking?.totalAmount
      )
    }`,
    `Advance: ${
      formatMoney(
        booking?.advanceAmount
      )
    }`,
    `Balance: ${
      formatMoney(
        booking?.balanceAmount
      )
    }`,
  ].join("\n");

  return `https://wa.me/91${phone}?text=${encodeURIComponent(
    message
  )}`;
}

/* ============================================================
   ICONS
============================================================ */

function IconPlus() {
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
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconSearch() {
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
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function IconRefresh() {
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
    >
      <path d="M20 11a8 8 0 0 0-14.9-4" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 4" />
      <path d="M20 20v-5h-5" />
    </svg>
  );
}

function IconEye() {
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
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  );
}

function IconEdit() {
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
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconDownload() {
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
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function IconPhone() {
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
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.89c0 2.09.55 4.13 1.6 5.92L.1 24l6.34-1.64a11.87 11.87 0 0 0 5.6 1.43h.01c6.55 0 11.88-5.33 11.88-11.9 0-3.17-1.23-6.15-3.41-8.41ZM12.05 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.97 1-3.67-.23-.38a9.86 9.86 0 1 1 8.39 4.67Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function IconCalendar() {
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
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
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
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 17-1-5 2-5h12l2 5-1 5" />
      <path d="M4 12h16" />
      <circle
        cx="7"
        cy="17"
        r="1.5"
      />
      <circle
        cx="17"
        cy="17"
        r="1.5"
      />
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
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function IconFilter() {
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
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const value =
    status || "Pending";

  let classes =
    "bg-blue-50 text-[#063B8F] border-blue-100";

  if (
    value === "Confirmed"
  ) {
    classes =
      "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (
    value === "Partially Paid"
  ) {
    classes =
      "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (
    value === "Cancelled"
  ) {
    classes =
      "bg-red-50 text-red-700 border-red-100";
  }

  if (
    value === "Completed"
  ) {
    classes =
      "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black ${classes}`}
    >
      {value}
    </span>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AdvanceBookingsPage() {
  const router =
    useRouter();

  /* ==========================================================
     STATE
  ========================================================== */

  const [bookings, setBookings] =
    useState<
      AdvanceBooking[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("");

  /* ==========================================================
     LOAD BOOKINGS
  ========================================================== */

  async function loadBookings(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const bookingsQuery =
        query(
          collection(
            db,
            "advance_bookings"
          ),
          orderBy(
            "journeyDate",
            "asc"
          )
        );

      const snapshot =
        await getDocs(
          bookingsQuery
        );

      const data =
        snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...(item.data() as Omit<
              AdvanceBooking,
              "id"
            >),
          })
        );

      /*
       * Fallback sorting.
       * Keeps the page stable even if some
       * documents have missing journeyDate.
       */

      data.sort(
        (a, b) => {
          const aDate =
            String(
              a.journeyDate ||
                "9999-12-31"
            );

          const bDate =
            String(
              b.journeyDate ||
                "9999-12-31"
            );

          return aDate.localeCompare(
            bDate
          );
        }
      );

      setBookings(
        data
      );
    } catch (err: any) {
      console.error(
        "Load advance bookings error:",
        err
      );

      if (
        err?.code ===
        "permission-denied"
      ) {
        setError(
          "Permission denied. Please sign in as an admin."
        );
      } else if (
        err?.code ===
        "failed-precondition"
      ) {
        setError(
          "Firestore needs an index for this query. Please create the suggested index from the Firebase console."
        );
      } else {
        setError(
          err?.message ||
            "Unable to load advance bookings."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts =
    useMemo(() => {
      const today =
        todayString();

      return {
        total:
          bookings.length,

        upcoming:
          bookings.filter(
            (item) =>
              Boolean(
                item.journeyDate
              ) &&
              String(
                item.journeyDate
              ) >= today &&
              item.status !==
                "Cancelled" &&
              item.status !==
                "Completed"
          ).length,

        pending:
          bookings.filter(
            (item) =>
              item.status ===
              "Pending"
          ).length,

        confirmed:
          bookings.filter(
            (item) =>
              item.status ===
              "Confirmed"
          ).length,

        partial:
          bookings.filter(
            (item) =>
              item.status ===
              "Partially Paid"
          ).length,

        completed:
          bookings.filter(
            (item) =>
              item.status ===
              "Completed"
          ).length,

        cancelled:
          bookings.filter(
            (item) =>
              item.status ===
              "Cancelled"
          ).length,
      };
    }, [bookings]);

  /* ==========================================================
     FILTERED BOOKINGS
  ========================================================== */

  const filteredBookings =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return bookings
        .filter(
          (booking) => {
            if (
              statusFilter !==
                "All" &&
              booking.status !==
                statusFilter
            ) {
              return false;
            }

            if (
              typeFilter !==
                "All" &&
              booking.bookingType !==
                typeFilter
            ) {
              return false;
            }

            if (
              dateFilter &&
              booking.journeyDate !==
                dateFilter
            ) {
              return false;
            }

            if (!term) {
              return true;
            }

            const haystack =
              [
                booking.bookingNumber,
                booking.customerName,
                booking.customerMobile,
                booking.pickupLocation,
                booking.dropLocation,
                booking.bookingType,
                booking.status,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(
              term
            );
          }
        )
        .sort(
          (a, b) =>
            String(
              a.journeyDate ||
                "9999-12-31"
            ).localeCompare(
              String(
                b.journeyDate ||
                  "9999-12-31"
              )
            )
        );
    }, [
      bookings,
      search,
      statusFilter,
      typeFilter,
      dateFilter,
    ]);

  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setDateFilter("");
  }

  const hasFilters =
    Boolean(
      search ||
        statusFilter !==
          "All" ||
        typeFilter !==
          "All" ||
        dateFilter
    );

  /* ==========================================================
     PDF
  ========================================================== */

  async function handlePdf(
    booking: AdvanceBooking
  ) {
    try {
      await downloadAdvanceBookingPdf(
        booking
      );
    } catch (err) {
      console.error(
        "PDF download error:",
        err
      );

      window.alert(
        "Unable to generate PDF. Please try again."
      );
    }
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#063B8F]">
              Khatu Rides Admin
            </p>

            <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Advance Bookings
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                loadBookings(
                  true
                )
              }
              disabled={
                refreshing ||
                loading
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto sm:px-4"
              title="Refresh"
            >
              <span
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              >
                <IconRefresh />
              </span>

              <span className="ml-2 hidden text-xs font-black sm:inline">
                Refresh
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/advance-bookings/create"
                )
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#063B8F] px-4 text-xs font-black text-white shadow-[0_8px_24px_rgba(6,59,143,0.2)] transition hover:bg-[#052F72] sm:px-5"
            >
              <IconPlus />
              <span>
                New Booking
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#071A3A] via-[#063B8F] to-[#0755B5] p-5 text-white shadow-[0_18px_50px_rgba(7,26,58,0.15)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                Booking Management
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Advance Booking Dashboard
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Manage upcoming journeys, customer
                bookings, vehicle reservations, payments
                and booking status from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-200">
                  Total
                </p>

                <p className="mt-1 text-2xl font-black">
                  {
                    counts.total
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-200">
                  Upcoming
                </p>

                <p className="mt-1 text-2xl font-black text-amber-300">
                  {
                    counts.upcoming
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-200">
                  Pending
                </p>

                <p className="mt-1 text-2xl font-black">
                  {
                    counts.pending
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-200">
                  Confirmed
                </p>

                <p className="mt-1 text-2xl font-black">
                  {
                    counts.confirmed
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <div className="mt-0.5 shrink-0">
              <IconAlert />
            </div>

            <div className="min-w-0">
              <p className="font-black">
                Unable to load bookings
              </p>

              <p className="mt-1 text-xs leading-5">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  loadBookings()
                }
                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-[11px] font-black text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            STAT FILTERS
        ==================================================== */}

        <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "All"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "All"
                ? "border-[#063B8F] bg-blue-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              All
            </p>

            <p className="mt-1 text-2xl font-black text-slate-950">
              {
                counts.total
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Pending"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Pending"
                ? "border-blue-300 bg-blue-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Pending
            </p>

            <p className="mt-1 text-2xl font-black text-blue-700">
              {
                counts.pending
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Partially Paid"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Partially Paid"
                ? "border-amber-300 bg-amber-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-amber-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Partially Paid
            </p>

            <p className="mt-1 text-2xl font-black text-amber-700">
              {
                counts.partial
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Confirmed"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Confirmed"
                ? "border-emerald-300 bg-emerald-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-emerald-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Confirmed
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-700">
              {
                counts.confirmed
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Completed"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Completed"
                ? "border-slate-400 bg-slate-100 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Completed
            </p>

            <p className="mt-1 text-2xl font-black text-slate-700">
              {
                counts.completed
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Cancelled"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Cancelled"
                ? "border-red-300 bg-red-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-red-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Cancelled
            </p>

            <p className="mt-1 text-2xl font-black text-red-700">
              {
                counts.cancelled
              }
            </p>
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Showing
            </p>

            <p className="mt-1 text-2xl font-black text-[#063B8F]">
              {
                filteredBookings.length
              }
            </p>
          </div>
        </section>

        {/* ====================================================
            FILTER BAR
        ==================================================== */}

        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F]">
              <IconFilter />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-950">
                Search & Filter
              </h3>

              <p className="text-[10px] font-medium text-slate-500">
                Find any advance booking quickly
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.6fr_0.9fr_0.9fr_0.8fr_auto]">
            {/* Search */}

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch />
              </span>

              <input
                type="search"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search booking, customer, mobile, pickup or destination..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Status */}

            <div>
              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target
                      .value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
              >
                {STATUS_OPTIONS.map(
                  (
                    item
                  ) => (
                    <option
                      key={item}
                      value={
                        item
                      }
                    >
                      Status:{" "}
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Type */}

            <div>
              <select
                value={
                  typeFilter
                }
                onChange={(
                  event
                ) =>
                  setTypeFilter(
                    event.target
                      .value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
              >
                {BOOKING_TYPES.map(
                  (
                    item
                  ) => (
                    <option
                      key={item}
                      value={
                        item
                      }
                    >
                      Type:{" "}
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Date */}

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconCalendar />
              </span>

              <input
                type="date"
                value={
                  dateFilter
                }
                onChange={(
                  event
                ) =>
                  setDateFilter(
                    event.target
                      .value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-bold text-slate-700 outline-none focus:border-[#063B8F] focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Clear */}

            <button
              type="button"
              onClick={
                clearFilters
              }
              disabled={
                !hasFilters
              }
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </section>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#063B8F]" />

            <p className="mt-4 text-sm font-black text-slate-900">
              Loading advance bookings...
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Please wait.
            </p>
          </section>
        ) : filteredBookings.length ===
          0 ? (
          /* ==================================================
             EMPTY
          ================================================== */

          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#063B8F]">
              <IconCalendar />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-950">
              {hasFilters
                ? "No matching bookings"
                : "No advance bookings yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {hasFilters
                ? "Try changing your search or filters to find the booking."
                : "Create your first advance booking to start managing upcoming journeys."}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-xl bg-[#071A3A] px-5 py-3 text-xs font-black text-white"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/admin/advance-bookings/create"
                  )
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#063B8F] px-5 py-3 text-xs font-black text-white"
              >
                <IconPlus />
                Create Booking
              </button>
            )}
          </section>
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Advance Booking List
                  </h3>

                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    {filteredBookings.length} booking
                    {filteredBookings.length ===
                    1
                      ? ""
                      : "s"}{" "}
                    found
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black text-[#063B8F]">
                  Journey date order
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Booking
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Journey
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Vehicles
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map(
                      (
                        booking
                      ) => (
                        <tr
                          key={
                            booking.id
                          }
                          className="border-t border-slate-100 transition hover:bg-slate-50/70"
                        >
                          {/* Booking */}

                          <td className="px-5 py-4 align-top">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/advance-bookings/${booking.id}`
                                )
                              }
                              className="text-left"
                            >
                              <p className="text-xs font-black text-[#063B8F] hover:underline">
                                {booking.bookingNumber ||
                                  "Booking"}
                              </p>

                              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                                {booking.bookingType ||
                                  "Advance Booking"}
                              </p>
                            </button>
                          </td>

                          {/* Customer */}

                          <td className="px-5 py-4 align-top">
                            <p className="max-w-[170px] truncate text-sm font-black text-slate-900">
                              {booking.customerName ||
                                "-"}
                            </p>

                            <a
                              href={`tel:+91${normalizeMobile(
                                booking.customerMobile
                              )}`}
                              className="mt-1 block text-[11px] font-semibold text-slate-500 hover:text-[#063B8F]"
                            >
                              +91{" "}
                              {booking.customerMobile ||
                                "-"}
                            </a>
                          </td>

                          {/* Journey */}

                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 text-[#063B8F]">
                                <IconRoute />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900">
                                  {formatDate(
                                    booking.journeyDate
                                  )}
                                </p>

                                <p className="mt-1 max-w-[210px] text-[11px] font-semibold leading-4 text-slate-500">
                                  {booking.pickupLocation ||
                                    "-"}{" "}
                                  →{" "}
                                  {booking.dropLocation ||
                                    "-"}
                                </p>

                                {booking.pickupTime && (
                                  <p className="mt-1 text-[10px] font-bold text-slate-400">
                                    Pickup{" "}
                                    {booking.pickupTime}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Vehicles */}

                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 text-slate-500">
                                <IconCar />
                              </div>

                              <div>
                                <p className="text-sm font-black text-slate-900">
                                  {num(
                                    booking.totalVehicles
                                  )}
                                </p>

                                <p className="text-[10px] font-semibold text-slate-400">
                                  vehicle
                                  {num(
                                    booking.totalVehicles
                                  ) ===
                                  1
                                    ? ""
                                    : "s"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}

                          <td className="px-5 py-4 text-right align-top">
                            <p className="text-sm font-black text-slate-950">
                              {formatMoney(
                                booking.totalAmount
                              )}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                              Advance{" "}
                              {formatMoney(
                                booking.advanceAmount
                              )}
                            </p>

                            <p className="mt-0.5 text-[10px] font-semibold text-red-500">
                              Due{" "}
                              {formatMoney(
                                booking.balanceAmount
                              )}
                            </p>
                          </td>

                          {/* Status */}

                          <td className="px-5 py-4 align-top">
                            <StatusBadge
                              status={
                                booking.status
                              }
                            />
                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4 align-top">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/advance-bookings/${booking.id}`
                                  )
                                }
                                title="View"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#063B8F]"
                              >
                                <IconEye />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/advance-bookings/${booking.id}/edit`
                                  )
                                }
                                title="Edit"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                              >
                                <IconEdit />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handlePdf(
                                    booking
                                  )
                                }
                                title="Download PDF"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#063B8F]"
                              >
                                <IconDownload />
                              </button>

                              <a
                                href={`tel:+91${normalizeMobile(
                                  booking.customerMobile
                                )}`}
                                title="Call Customer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#063B8F] transition hover:bg-blue-100"
                              >
                                <IconPhone />
                              </a>

                              <a
                                href={whatsappUrl(
                                  booking.customerMobile,
                                  booking
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Customer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                              >
                                <IconWhatsApp />
                              </a>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* =================================================
                MOBILE / TABLET CARDS
            ================================================= */}

            <section className="space-y-3 lg:hidden">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Booking List
                  </h3>

                  <p className="text-[11px] font-medium text-slate-500">
                    {
                      filteredBookings.length
                    }{" "}
                    booking
                    {filteredBookings.length ===
                    1
                      ? ""
                      : "s"}
                  </p>
                </div>
              </div>

              {filteredBookings.map(
                (
                  booking
                ) => (
                  <article
                    key={
                      booking.id
                    }
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* Card Top */}

                    <div className="border-b border-slate-100 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/advance-bookings/${booking.id}`
                              )
                            }
                            className="text-left"
                          >
                            <p className="truncate text-sm font-black text-[#063B8F]">
                              {booking.bookingNumber ||
                                "Booking"}
                            </p>
                          </button>

                          <p className="mt-1 text-[10px] font-semibold text-slate-400">
                            {booking.bookingType ||
                              "Advance Booking"}
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            booking.status
                          }
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063B8F]">
                          <IconCalendar />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-950">
                            {formatDate(
                              booking.journeyDate
                            )}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
                            {booking.pickupLocation ||
                              "-"}{" "}
                            →{" "}
                            {booking.dropLocation ||
                              "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer */}

                    <div className="grid grid-cols-2 gap-3 border-b border-slate-100 p-4 sm:p-5">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Customer
                        </p>

                        <p className="mt-1 truncate text-sm font-black text-slate-900">
                          {booking.customerName ||
                            "-"}
                        </p>

                        <a
                          href={`tel:+91${normalizeMobile(
                            booking.customerMobile
                          )}`}
                          className="mt-0.5 block text-[11px] font-semibold text-[#063B8F]"
                        >
                          +91{" "}
                          {booking.customerMobile ||
                            "-"}
                        </a>
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Vehicles
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <IconCar />

                          <span className="text-sm font-black text-slate-900">
                            {num(
                              booking.totalVehicles
                            )}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-400">
                            vehicle
                            {num(
                              booking.totalVehicles
                            ) ===
                            1
                              ? ""
                              : "s"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}

                    <div className="grid grid-cols-3 gap-2 border-b border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-950">
                          {formatMoney(
                            booking.totalAmount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Advance
                        </p>

                        <p className="mt-1 text-sm font-black text-emerald-600">
                          {formatMoney(
                            booking.advanceAmount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Balance
                        </p>

                        <p className="mt-1 text-sm font-black text-red-600">
                          {formatMoney(
                            booking.balanceAmount
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="grid grid-cols-5 gap-2 p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/advance-bookings/${booking.id}`
                          )
                        }
                        className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-blue-50 hover:text-[#063B8F]"
                      >
                        <IconEye />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/advance-bookings/${booking.id}/edit`
                          )
                        }
                        className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                      >
                        <IconEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handlePdf(
                            booking
                          )
                        }
                        className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-blue-50 hover:text-[#063B8F]"
                      >
                        <IconDownload />
                      </button>

                      <a
                        href={`tel:+91${normalizeMobile(
                          booking.customerMobile
                        )}`}
                        className="flex min-h-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#063B8F]"
                      >
                        <IconPhone />
                      </a>

                      <a
                        href={whatsappUrl(
                          booking.customerMobile,
                          booking
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600"
                      >
                        <IconWhatsApp />
                      </a>
                    </div>
                  </article>
                )
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}