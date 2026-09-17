"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  IndianRupee,
  Loader2,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
  XCircle,
} from "lucide-react";

import {
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ============================================================
   CONSTANTS
============================================================ */

const PHONE = "9244137353";
const PHONE_DISPLAY = "+91 92441 37353";

const WHATSAPP = "919244137353";

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

  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

/* ============================================================
   HELPERS
============================================================ */

function toNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value: unknown) {
  return `₹${toNumber(value).toLocaleString("en-IN")}`;
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizePhone(phone?: string) {
  return (phone || "").replace(/\D/g, "");
}

function getWhatsAppNumber(phone?: string) {
  const cleaned = normalizePhone(phone);

  if (!cleaned) {
    return WHATSAPP;
  }

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  return cleaned;
}

function getStatusClasses(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "partially paid":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "completed":
      return "border-violet-200 bg-violet-50 text-violet-700";

    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getStatusIcon(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
      return <CheckCircle2 size={13} />;

    case "cancelled":
      return <XCircle size={13} />;

    case "completed":
      return <CheckCircle2 size={13} />;

    default:
      return <Clock3 size={13} />;
  }
}

function getVehicleSummary(vehicles?: VehicleItem[]) {
  if (!vehicles?.length) {
    return "Vehicle not specified";
  }

  return vehicles
    .map((vehicle) => {
      const quantity = toNumber(vehicle.quantity) || 1;
      const name = vehicle.vehicleType || "Vehicle";

      return `${quantity} × ${name}${
        vehicle.variant ? ` (${vehicle.variant})` : ""
      }`;
    })
    .join(", ");
}

/* ============================================================
   PAGE
============================================================ */

export default function AdvanceBookingsPage() {
  const [bookings, setBookings] = useState<AdvanceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  /* ============================================================
     LOAD BOOKINGS
  ============================================================ */

  const loadBookings = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const snapshot = await getDocs(
        collection(db, "advance_bookings")
      );

      const data: AdvanceBooking[] = snapshot.docs.map((doc) => {
        const raw = doc.data();

        return {
          id: doc.id,
          ...raw,
        } as AdvanceBooking;
      });

      data.sort((a, b) => {
        const dateA =
          a.journeyDate ||
          a.createdAt?.toDate?.().toISOString() ||
          "";

        const dateB =
          b.journeyDate ||
          b.createdAt?.toDate?.().toISOString() ||
          "";

        return dateA.localeCompare(dateB);
      });

      setBookings(data);
    } catch (error) {
      console.error("Failed to load advance bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ============================================================
     FILTERED BOOKINGS
  ============================================================ */

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        [
          booking.bookingNumber,
          booking.customerName,
          booking.customerMobile,
          booking.pickupLocation,
          booking.dropLocation,
          booking.bookingType,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "All" ||
        (booking.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      let matchesDate = true;

      if (dateFilter !== "All") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const journey = booking.journeyDate
          ? new Date(`${booking.journeyDate}T00:00:00`)
          : null;

        if (journey) {
          if (dateFilter === "Today") {
            matchesDate =
              journey.getTime() === today.getTime();
          }

          if (dateFilter === "Upcoming") {
            matchesDate = journey >= today;
          }

          if (dateFilter === "Past") {
            matchesDate = journey < today;
          }
        } else {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, search, statusFilter, dateFilter]);

  /* ============================================================
     STATS
  ============================================================ */

  const stats = useMemo(() => {
    const total = bookings.length;

    const confirmed = bookings.filter(
      (booking) =>
        (booking.status || "").toLowerCase() === "confirmed"
    ).length;

    const pending = bookings.filter(
      (booking) =>
        (booking.status || "").toLowerCase() === "pending"
    ).length;

    const completed = bookings.filter(
      (booking) =>
        (booking.status || "").toLowerCase() === "completed"
    ).length;

    const cancelled = bookings.filter(
      (booking) =>
        (booking.status || "").toLowerCase() === "cancelled"
    ).length;

    const totalAmount = bookings.reduce(
      (sum, booking) => sum + toNumber(booking.totalAmount),
      0
    );

    const advanceAmount = bookings.reduce(
      (sum, booking) => sum + toNumber(booking.advanceAmount),
      0
    );

    const balanceAmount = bookings.reduce(
      (sum, booking) => sum + toNumber(booking.balanceAmount),
      0
    );

    const totalVehicles = bookings.reduce(
      (sum, booking) =>
        sum + toNumber(booking.totalVehicles),
      0
    );

    return {
      total,
      confirmed,
      pending,
      completed,
      cancelled,
      totalAmount,
      advanceAmount,
      balanceAmount,
      totalVehicles,
    };
  }, [bookings]);

  /* ============================================================
     WHATSAPP
  ============================================================ */

  const openWhatsApp = (booking: AdvanceBooking) => {
    const number = getWhatsAppNumber(
      booking.customerMobile
    );

    const vehicleText = booking.vehicles?.length
      ? booking.vehicles
          .map((vehicle) => {
            const quantity =
              toNumber(vehicle.quantity) || 1;

            return `${quantity} × ${
              vehicle.vehicleType || "Vehicle"
            }${
              vehicle.variant
                ? ` (${vehicle.variant})`
                : ""
            } @ ${formatCurrency(
              vehicle.ratePerVehicle
            )}`;
          })
          .join("\n")
      : "Vehicle details not available";

    const message = `Hello ${
      booking.customerName || ""
    },

This is Khatu Rides Travels Co.

Booking Number: ${
      booking.bookingNumber || "—"
    }

Booking Type: ${
      booking.bookingType || "Advance Booking"
    }

Journey Date: ${
      formatDate(booking.journeyDate)
    }

Pickup: ${
      booking.pickupLocation || "—"
    }

Destination: ${
      booking.dropLocation || "—"
    }

Pickup Time: ${
      booking.pickupTime || "—"
    }

Vehicles:
${vehicleText}

Total Booking Amount: ${
      formatCurrency(booking.totalAmount)
    }

Advance Received: ${
      formatCurrency(booking.advanceAmount)
    }

Balance Due: ${
      formatCurrency(booking.balanceAmount)
    }

Status: ${
      booking.status || "—"
    }

Thank you,
Khatu Rides Travels Co.
${PHONE_DISPLAY}`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-slate-950">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin"
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <img
                src="/logo.png"
                alt="Khatu Rides"
                className="h-full w-full object-contain p-1"
              />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-black tracking-tight sm:text-base">
                  Advance Bookings
                </h1>

                <span className="hidden rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700 sm:inline-flex">
                  Admin
                </span>
              </div>

              <p className="truncate text-[10px] font-medium text-slate-500">
                Pre-booking & vehicle reservation management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadBookings(true)}
              disabled={refreshing}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
            </button>

            <Link
              href="/admin/advance-bookings/create"
              className="flex h-10 items-center gap-2 rounded-xl bg-[#063B8F] px-3 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:bg-[#052f73] sm:px-4"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">
                New Booking
              </span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        {/* ======================================================
            PAGE INTRO
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-[26px] bg-[#071A3A] shadow-[0_20px_60px_rgba(7,26,58,0.18)]">
          <div className="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
                  <CalendarDays size={12} />
                  Booking Control Center
                </div>

                <h2 className="max-w-3xl text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Manage your{" "}
                  <span className="text-amber-300">
                    advance bookings
                  </span>{" "}
                  in one place.
                </h2>

                <p className="mt-2 max-w-2xl text-xs font-medium leading-5 text-blue-100/75 sm:text-sm">
                  Track upcoming journeys, vehicle reservations,
                  advance payments and pending balances from a
                  single dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-[9px] font-black uppercase tracking-wider text-blue-200/70">
                    Total Bookings
                  </p>
                  <p className="mt-1 text-xl font-black text-white">
                    {stats.total}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-amber-400 px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-900/60">
                    Vehicles Reserved
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {stats.totalVehicles}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            title="Total Bookings"
            value={stats.total}
            icon={<CalendarDays size={18} />}
            iconClass="bg-blue-50 text-blue-700"
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon={<CheckCircle2 size={18} />}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock3 size={18} />}
            iconClass="bg-amber-50 text-amber-700"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle2 size={18} />}
            iconClass="bg-violet-50 text-violet-700"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={<XCircle size={18} />}
            iconClass="bg-red-50 text-red-700"
            className="col-span-2 lg:col-span-1"
          />
        </section>

        {/* ======================================================
            FINANCIAL SUMMARY
        ====================================================== */}

        <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <FinanceCard
            label="Total Booking Value"
            value={stats.totalAmount}
            icon={<IndianRupee size={17} />}
            description="Gross value of all advance bookings"
          />

          <FinanceCard
            label="Advance Received"
            value={stats.advanceAmount}
            icon={<CheckCircle2 size={17} />}
            description="Amount already collected"
          />

          <FinanceCard
            label="Balance Due"
            value={stats.balanceAmount}
            icon={<Clock3 size={17} />}
            description="Amount still to be collected"
          />
        </section>

        {/* ======================================================
            FILTER BAR
        ====================================================== */}

        <section className="mb-5 rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* Search */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search booking number, customer, mobile, pickup or destination..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 hover:text-slate-800"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            {/* Status */}

            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={15}
                className="hidden text-slate-400 sm:block"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">
                  Partially Paid
                </option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date */}

            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="h-11 min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Past">Past</option>
            </select>

            <div className="flex h-11 items-center justify-center rounded-xl bg-slate-100 px-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {filteredBookings.length} Result
              {filteredBookings.length !== 1 ? "s" : ""}
            </div>
          </div>
        </section>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-[24px] border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Loader2
                  size={22}
                  className="animate-spin"
                />
              </div>

              <p className="text-xs font-bold text-slate-500">
                Loading advance bookings...
              </p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* ====================================================
             EMPTY STATE
          ==================================================== */

          <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={28} />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-950">
              No advance bookings found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs font-medium leading-5 text-slate-500">
              {search ||
              statusFilter !== "All" ||
              dateFilter !== "All"
                ? "Try changing your search or filters."
                : "Create your first advance booking to start managing vehicle reservations."}
            </p>

            {!search &&
              statusFilter === "All" &&
              dateFilter === "All" && (
                <Link
                  href="/admin/advance-bookings/create"
                  className="mx-auto mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#063B8F] px-5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-900/20"
                >
                  <Plus size={15} />
                  Create Advance Booking
                </Link>
              )}
          </div>
        ) : (
          /* ====================================================
             BOOKINGS
          ==================================================== */

          <section className="space-y-3">
            {/* Desktop Header */}

            <div className="hidden grid-cols-[1.1fr_1.3fr_1.2fr_1fr_1fr_100px] gap-4 rounded-xl bg-slate-100 px-5 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500 lg:grid">
              <div>Booking</div>
              <div>Customer</div>
              <div>Journey</div>
              <div>Vehicles</div>
              <div>Amount</div>
              <div className="text-right">Action</div>
            </div>

            {filteredBookings.map((booking) => {
              const totalAmount = toNumber(
                booking.totalAmount
              );

              const advanceAmount = toNumber(
                booking.advanceAmount
              );

              const balanceAmount = toNumber(
                booking.balanceAmount
              );

              const phone =
                normalizePhone(
                  booking.customerMobile
                ) || PHONE;

              return (
                <article
                  key={booking.id}
                  className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="p-4 sm:p-5">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_1.3fr_1.2fr_1fr_1fr_100px] lg:items-center lg:gap-4">
                      {/* ==================================================
                          BOOKING
                      ================================================== */}

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3 lg:block">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                              Booking Number
                            </p>

                            <p className="mt-1 truncate text-sm font-black text-[#063B8F]">
                              {booking.bookingNumber ||
                                booking.id.slice(0, 10)}
                            </p>
                          </div>

                          <StatusBadge
                            status={
                              booking.status ||
                              "Pending"
                            }
                            mobile
                          />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-700">
                            {booking.bookingType ||
                              "Advance Booking"}
                          </span>

                          {booking.source && (
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                              {booking.source}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 lg:hidden">
                          <StatusBadge
                            status={
                              booking.status ||
                              "Pending"
                            }
                          />
                        </div>
                      </div>

                      {/* ==================================================
                          CUSTOMER
                      ================================================== */}

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Customer
                        </p>

                        <p className="mt-1 truncate text-sm font-black text-slate-900">
                          {booking.customerName ||
                            "Unknown Customer"}
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-500">
                          {booking.customerMobile ||
                            "No mobile number"}
                        </p>

                        <div className="mt-2 flex gap-2 lg:hidden">
                          {booking.customerMobile && (
                            <>
                              <a
                                href={`tel:${phone}`}
                                className="flex h-9 items-center gap-1.5 rounded-lg bg-[#063B8F] px-3 text-[9px] font-black uppercase tracking-wider text-white"
                              >
                                <Phone size={13} />
                                Call
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  openWhatsApp(
                                    booking
                                  )
                                }
                                className="flex h-9 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-[9px] font-black uppercase tracking-wider text-white"
                              >
                                <MessageCircle
                                  size={13}
                                />
                                WhatsApp
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* ==================================================
                          JOURNEY
                      ================================================== */}

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Journey
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <CalendarDays
                            size={14}
                            className="shrink-0 text-blue-600"
                          />

                          <span className="text-xs font-black text-slate-900">
                            {formatDate(
                              booking.journeyDate
                            )}
                          </span>
                        </div>

                        {booking.pickupTime && (
                          <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                            <Clock3
                              size={12}
                              className="shrink-0"
                            />
                            {booking.pickupTime}
                          </div>
                        )}

                        <div className="mt-2 space-y-1">
                          <p className="truncate text-[10px] font-bold text-slate-600">
                            <span className="text-emerald-600">
                              FROM:
                            </span>{" "}
                            {booking.pickupLocation ||
                              "—"}
                          </p>

                          <p className="truncate text-[10px] font-bold text-slate-600">
                            <span className="text-red-500">
                              TO:
                            </span>{" "}
                            {booking.dropLocation ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      {/* ==================================================
                          VEHICLES
                      ================================================== */}

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Vehicles
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs font-black leading-5 text-slate-800">
                          {getVehicleSummary(
                            booking.vehicles
                          )}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-700">
                          <Users size={12} />

                          {toNumber(
                            booking.totalVehicles
                          ) || 0}{" "}
                          Vehicle
                          {toNumber(
                            booking.totalVehicles
                          ) !== 1
                            ? "s"
                            : ""}
                        </div>
                      </div>

                      {/* ==================================================
                          AMOUNT
                      ================================================== */}

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Amount
                        </p>

                        <p className="mt-1 text-base font-black text-slate-950">
                          {formatCurrency(
                            totalAmount
                          )}
                        </p>

                        <div className="mt-2 space-y-1">
                          <p className="text-[10px] font-semibold text-emerald-600">
                            Advance:{" "}
                            {formatCurrency(
                              advanceAmount
                            )}
                          </p>

                          <p className="text-[10px] font-semibold text-red-500">
                            Balance:{" "}
                            {formatCurrency(
                              balanceAmount
                            )}
                          </p>
                        </div>

                        {/* Payment Progress */}

                        {totalAmount > 0 && (
                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-slate-400">
                              <span>Paid</span>
                              <span>
                                {Math.min(
                                  100,
                                  Math.round(
                                    (advanceAmount /
                                      totalAmount) *
                                      100
                                  )
                                )}
                                %
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (advanceAmount /
                                      totalAmount) *
                                      100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div className="flex items-center justify-start gap-2 lg:justify-end">
                        <Link
                          href={`/admin/advance-bookings/${booking.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          title="View Booking"
                        >
                          <Eye size={16} />
                        </Link>

                        {booking.customerMobile && (
                          <>
                            <a
                              href={`tel:${phone}`}
                              className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#063B8F] text-white transition hover:bg-[#052f73] lg:flex"
                              title="Call Customer"
                            >
                              <Phone size={15} />
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                openWhatsApp(
                                  booking
                                )
                              }
                              className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white transition hover:bg-[#1ebe5d] lg:flex"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle
                                size={15}
                              />
                            </button>
                          </>
                        )}

                        <Link
                          href={`/admin/advance-bookings/${booking.id}`}
                          className="hidden h-10 items-center gap-1 rounded-xl bg-slate-100 px-3 text-[9px] font-black uppercase tracking-wider text-slate-700 transition hover:bg-slate-200 sm:flex"
                        >
                          View
                          <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* ====================================================
                      MOBILE ROUTE STRIP
                  ==================================================== */}

                  <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 lg:hidden">
                    <div className="flex items-center gap-2 overflow-hidden text-[10px] font-bold">
                      <span className="truncate text-slate-600">
                        {booking.pickupLocation ||
                          "Pickup"}
                      </span>

                      <ArrowRight
                        size={13}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="truncate text-slate-600">
                        {booking.dropLocation ||
                          "Destination"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* ======================================================
            FOOTER NOTE
        ====================================================== */}

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-700">
              Khatu Rides Travels Co.
            </p>

            <p className="mt-1 text-[9px] font-medium text-slate-400">
              Advance booking management system
            </p>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
            <Phone size={12} />
            {PHONE_DISPLAY}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  icon,
  iconClass,
  className = "",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FINANCE CARD
============================================================ */

function FinanceCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-slate-950">
            {formatCurrency(value)}
          </p>

          <p className="mt-1 text-[9px] font-medium text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
  mobile = false,
}: {
  status: string;
  mobile?: boolean;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider ${getStatusClasses(
        status
      )} ${mobile ? "lg:hidden" : ""}`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );
}