"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import {
  Plus,
  Car,
  MapPin,
  Phone,
  Trash2,
  X,
  Loader2,
  LogOut,
  IndianRupee,
  MessageCircle,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Route,
} from "lucide-react";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "on-trip"
  | "completed"
  | "cancelled";

type Booking = {
  id: string;
  vehicle?: string;

  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;

  date?: string;
  startTime?: string;
  endTime?: string;

  pickup: string;
  drop: string;
  customerName: string;
  phone: string;
  bookingType: string;
  fare: string;
  advance: string;
  status: BookingStatus;
  notes?: string;
};

const VEHICLE_NAME = "New Ertiga VXI 2026";
const OWNER_PHONE = "9244137353";
const DRIVER_PHONE = "9111025461";

const emptyForm = {
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  pickup: "",
  drop: "",
  customerName: "",
  phone: "",
  bookingType: "One Way",
  fare: "",
  advance: "",
  status: "confirmed" as BookingStatus,
  notes: "",
};

function formatDateIN(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
}

function toMinutes(time: string) {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number) {
  const h = Math.floor(total / 60).toString().padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function money(value: string | number) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function addDays(date: string, days: number) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function getNextDays(days: number) {
  const arr: string[] = [];
  const today = getToday();

  for (let i = 0; i < days; i++) {
    arr.push(addDays(today, i));
  }

  return arr;
}

function normalizeBooking(b: Booking) {
  return {
    pickupDate: b.pickupDate || b.date || "",
    pickupTime: b.pickupTime || b.startTime || "",
    returnDate: b.returnDate || b.date || "",
    returnTime: b.returnTime || b.endTime || "",
  };
}

function getBookingRangeMinutes(b: Booking) {
  const n = normalizeBooking(b);
  const start = new Date(`${n.pickupDate}T${n.pickupTime || "00:00"}`).getTime();
  const end = new Date(`${n.returnDate}T${n.returnTime || "23:59"}`).getTime();

  return { start, end };
}

function bookingTouchesDate(b: Booking, date: string) {
  const n = normalizeBooking(b);
  if (!n.pickupDate || !n.returnDate) return false;

  const dayStart = new Date(`${date}T00:00`).getTime();
  const dayEnd = new Date(`${date}T23:59`).getTime();
  const { start, end } = getBookingRangeMinutes(b);

  return start <= dayEnd && end >= dayStart;
}

function getBookingSegmentForDate(b: Booking, date: string) {
  const n = normalizeBooking(b);

  if (!bookingTouchesDate(b, date)) return null;

  const start =
    n.pickupDate === date ? toMinutes(n.pickupTime || "00:00") : 0;

  const end =
    n.returnDate === date ? toMinutes(n.returnTime || "23:59") : 1439;

  return {
    start,
    end,
    startTime: fromMinutes(start),
    endTime: fromMinutes(end),
  };
}

function getBookingsForDate(bookings: Booking[], date: string) {
  return bookings
    .filter((b) => b.status !== "cancelled")
    .filter((b) => bookingTouchesDate(b, date))
    .sort((a, b) => {
      const sa = getBookingSegmentForDate(a, date)?.start || 0;
      const sb = getBookingSegmentForDate(b, date)?.start || 0;
      return sa - sb;
    });
}

function getSlots(dayBookings: Booking[], date: string) {
  const active = dayBookings
    .filter((b) => b.status !== "cancelled")
    .map((b) => getBookingSegmentForDate(b, date))
    .filter(Boolean) as {
    start: number;
    end: number;
    startTime: string;
    endTime: string;
  }[];

  active.sort((a, b) => a.start - b.start);

  const slots: string[] = [];
  let current = 0;

  active.forEach((seg) => {
    if (current < seg.start) {
      slots.push(`${fromMinutes(current)} - ${fromMinutes(seg.start)}`);
    }

    if (seg.end > current) current = seg.end;
  });

  if (current < 1439) {
    slots.push(`${fromMinutes(current)} - 23:59`);
  }

  return slots;
}

function getBookedMinutes(dayBookings: Booking[], date: string) {
  return dayBookings.reduce((sum, b) => {
    const seg = getBookingSegmentForDate(b, date);
    if (!seg) return sum;
    return sum + Math.max(0, seg.end - seg.start);
  }, 0);
}

function getDayStatus(dayBookings: Booking[], date: string) {
  const active = dayBookings.filter((b) => b.status !== "cancelled");
  const bookedMinutes = getBookedMinutes(active, date);
  const freeMinutes = 1439 - bookedMinutes;

  if (active.length === 0) {
    return { label: "Full Day Available", freeHours: "24h" };
  }

  if (freeMinutes <= 180) {
    return {
      label: "Fully Booked",
      freeHours: `${Math.max(0, Math.round(freeMinutes / 60))}h free`,
    };
  }

  if (freeMinutes <= 420) {
    return {
      label: "Almost Full",
      freeHours: `${Math.round(freeMinutes / 60)}h free`,
    };
  }

  return {
    label: "Partially Available",
    freeHours: `${Math.round(freeMinutes / 60)}h free`,
  };
}

function rangesOverlap(a: Booking, b: Booking) {
  const ar = getBookingRangeMinutes(a);
  const br = getBookingRangeMinutes(b);
  return ar.start < br.end && ar.end > br.start;
}

export default function BookingCalendarPage() {
  const router = useRouter();
  const today = getToday();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    ...emptyForm,
    pickupDate: today,
    returnDate: today,
  });

  const loadBookings = async () => {
    setLoading(true);

    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const snap = await getDocs(collection(db, "bookings"));

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Booking, "id">),
      }));

      data.sort((a, b) => {
        const an = normalizeBooking(a);
        const bn = normalizeBooking(b);

        if (an.pickupDate === bn.pickupDate) {
          return an.pickupTime.localeCompare(bn.pickupTime);
        }

        return an.pickupDate.localeCompare(bn.pickupDate);
      });

      setBookings(data);
    } catch (error: any) {
      console.error("BOOKING LOAD ERROR:", error);
      alert(error?.code || error?.message || "Bookings load nahi ho payi.");
    } finally {
      setLoading(false);
    }
  };

  const selectedBookings = useMemo(() => {
    return getBookingsForDate(bookings, selectedDate);
  }, [bookings, selectedDate]);

  const freeSlots = useMemo(
    () => getSlots(selectedBookings, selectedDate),
    [selectedBookings, selectedDate]
  );

  const currentFormBooking: Booking = {
    id: "temp",
    pickupDate: form.pickupDate,
    pickupTime: form.pickupTime,
    returnDate: form.returnDate,
    returnTime: form.returnTime,
    pickup: form.pickup,
    drop: form.drop,
    customerName: form.customerName,
    phone: form.phone,
    bookingType: form.bookingType,
    fare: form.fare,
    advance: form.advance,
    status: form.status,
    notes: form.notes,
  };

  const hasConflict = useMemo(() => {
    if (
      !form.pickupDate ||
      !form.pickupTime ||
      !form.returnDate ||
      !form.returnTime
    ) {
      return false;
    }

    return bookings.some((b) => {
      if (b.status === "cancelled") return false;
      return rangesOverlap(currentFormBooking, b);
    });
  }, [
    bookings,
    form.pickupDate,
    form.pickupTime,
    form.returnDate,
    form.returnTime,
  ]);

  const addBooking = async () => {
    const phone10 = form.phone.replace(/\D/g, "").slice(-10);

    if (
      !form.pickupDate ||
      !form.pickupTime ||
      !form.returnDate ||
      !form.returnTime ||
      !form.pickup.trim() ||
      !form.drop.trim() ||
      !form.customerName.trim() ||
      phone10.length !== 10
    ) {
      alert(
        "Pickup date/time, return date/time, pickup, drop, customer name aur valid mobile number required hai."
      );
      return;
    }

    const start = new Date(`${form.pickupDate}T${form.pickupTime}`).getTime();
    const end = new Date(`${form.returnDate}T${form.returnTime}`).getTime();

    if (start >= end) {
      alert("Return date/time pickup date/time ke baad hona chahiye.");
      return;
    }

    if (hasConflict) {
      const ok = confirm(
        "Warning: Is booking duration me already booking hai. Fir bhi booking save karni hai?"
      );
      if (!ok) return;
    }

    setSaving(true);

    try {
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      await addDoc(collection(db, "bookings"), {
        vehicle: VEHICLE_NAME,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        returnDate: form.returnDate,
        returnTime: form.returnTime,

        // old compatibility
        date: form.pickupDate,
        startTime: form.pickupTime,
        endTime: form.returnTime,

        pickup: form.pickup.trim(),
        drop: form.drop.trim(),
        customerName: form.customerName.trim(),
        phone: phone10,
        bookingType: form.bookingType,
        fare: form.fare.trim(),
        advance: form.advance.trim(),
        status: form.status,
        notes: form.notes.trim(),
        createdAt: serverTimestamp(),
      });

      setShowAdd(false);
      setSelectedDate(form.pickupDate);
      setForm({
        ...emptyForm,
        pickupDate: today,
        returnDate: today,
      });

      await loadBookings();
      alert("Booking successfully save ho gayi.");
    } catch (error: any) {
      console.error("BOOKING SAVE ERROR:", error);
      alert(error?.code || error?.message || "Booking save nahi ho payi.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (booking: Booking, status: BookingStatus) => {
    try {
      const { updateDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await updateDoc(doc(db, "bookings", booking.id), { status });
      await loadBookings();
    } catch (error: any) {
      alert(error?.code || error?.message || "Status update nahi ho paya.");
    }
  };

  const deleteBooking = async (booking: Booking) => {
    if (!confirm("Kya aap is booking ko delete karna chahte hain?")) return;

    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await deleteDoc(doc(db, "bookings", booking.id));
      await loadBookings();
    } catch (error: any) {
      alert(error?.code || error?.message || "Booking delete nahi ho payi.");
    }
  };

  const logout = async () => {
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");

    await signOut(auth);
    router.push("/admin/login");
  };

  useEffect(() => {
    let unsub: undefined | (() => void);

    async function checkAuth() {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      unsub = onAuthStateChanged(auth, (user) => {
        if (!user) router.push("/admin/login");
        else loadBookings();
      });
    }

    checkAuth();

    return () => {
      if (unsub) unsub();
    };
  }, [router]);

  const next15Days = useMemo(() => {
    return getNextDays(15).map((date) => {
      const dayBookings = getBookingsForDate(bookings, date);

      return {
        date,
        bookings: dayBookings,
        slots: getSlots(dayBookings, date),
        status: getDayStatus(dayBookings, date),
      };
    });
  }, [bookings]);

  const selectedStatus = getDayStatus(selectedBookings, selectedDate);
  const todayBookings = getBookingsForDate(bookings, today);

  const selectedRevenue = selectedBookings.reduce(
    (sum, b) => sum + money(b.fare),
    0
  );

  const selectedAdvance = selectedBookings.reduce(
    (sum, b) => sum + money(b.advance),
    0
  );

  const selectedBalance = selectedRevenue - selectedAdvance;

  const month = today.slice(0, 7);
  const monthBookings = bookings.filter((b) => {
    const n = normalizeBooking(b);
    return n.pickupDate?.startsWith(month);
  });

  const monthRevenue = monthBookings.reduce(
    (sum, b) => sum + money(b.fare),
    0
  );

  const availableDays = next15Days.filter((d) => d.bookings.length === 0);
  const fullDays = next15Days.filter((d) => d.status.label === "Fully Booked");

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-xl font-black md:text-2xl">
              Ertiga Booking Manager
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Multi-day round trip, availability aur revenue dashboard
            </p>
          </div>

          <div className="flex gap-2">
            <button
  onClick={() => router.push("/admin/payments")}
  className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg"
>
  <Wallet size={18} />
  Payments
</button>
            <button
              onClick={() => router.push("/admin/leads")}
              className="rounded-full bg-slate-100 px-4 py-3 text-sm font-black"
            >
              Leads
            </button>

            <button
              onClick={logout}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5">
        <section className="rounded-[30px] bg-slate-950 p-5 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Car size={28} />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-black">{VEHICLE_NAME}</h2>
              <p className="mt-1 text-sm text-white/60">
                Round trip multi-day booking me beech ke din automatically full
                blocked honge.
              </p>
            </div>

            <span className="hidden rounded-full bg-green-500/15 px-4 py-2 text-sm font-black text-green-300 md:block">
              {selectedStatus.label}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <MiniStat title="Today Bookings" value={todayBookings.length} />
            <MiniStat title="Selected Bookings" value={selectedBookings.length} />
            <MiniStat title="Selected Revenue" value={`₹${selectedRevenue}`} />
            <MiniStat title="Month Revenue" value={`₹${monthRevenue}`} />
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-3">
          <AlertCard
            icon={<CheckCircle2 size={20} />}
            title="Available Days"
            value={`${availableDays.length} days`}
            text={
              availableDays
                .slice(0, 3)
                .map((d) => formatDateIN(d.date))
                .join(", ") || "No full free day"
            }
            tone="green"
          />

          <AlertCard
            icon={<AlertTriangle size={20} />}
            title="Full Booked Days"
            value={`${fullDays.length} days`}
            text={
              fullDays
                .slice(0, 3)
                .map((d) => formatDateIN(d.date))
                .join(", ") || "No fully booked day"
            }
            tone="red"
          />

          <AlertCard
            icon={<IndianRupee size={20} />}
            title="Selected Balance"
            value={`₹${selectedBalance}`}
            text={`Advance received: ₹${selectedAdvance}`}
            tone="orange"
          />
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-[30px] bg-white p-5 shadow-sm">
              <label className="text-sm font-black text-slate-500">
                Select Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
              />

              <button
                onClick={() => {
                  setForm({
                    ...emptyForm,
                    pickupDate: selectedDate,
                    returnDate: selectedDate,
                  });
                  setShowAdd(true);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-black text-white shadow-lg shadow-orange-200"
              >
                <Plus size={18} />
                Add Booking
              </button>
            </div>

            <div className="rounded-[30px] bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-black text-slate-900">
                <Clock3 size={18} />
                Free Time Slots
              </h3>

              <p className="mt-1 text-sm font-bold text-slate-500">
                Date: {formatDateIN(selectedDate)} • {selectedStatus.label} •{" "}
                {selectedStatus.freeHours}
              </p>

              <div className="mt-3 space-y-2">
                {freeSlots.length === 0 ? (
                  <p className="rounded-2xl bg-red-50 px-3 py-3 text-sm font-bold text-red-700">
                    Full day booked
                  </p>
                ) : (
                  freeSlots.map((slot) => (
                    <div
                      key={slot}
                      className="rounded-2xl bg-green-50 px-3 py-3 text-sm font-black text-green-700"
                    >
                      {slot}
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <section className="rounded-[30px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">
                  Schedule: {formatDateIN(selectedDate)}
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Multi-day booking selected date par bhi show hogi.
                </p>
              </div>

              {loading && <Loader2 className="animate-spin text-orange-600" />}
            </div>

            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
                Loading bookings...
              </div>
            ) : selectedBookings.length === 0 ? (
              <div className="rounded-3xl bg-green-50 p-8 text-center">
                <h3 className="font-black text-green-700">
                  Full Day Available
                </h3>
                <p className="mt-1 text-sm font-bold text-green-600">
                  Is date ke liye booking lene ka best chance hai.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    selectedDate={selectedDate}
                    updateStatus={updateStatus}
                    deleteBooking={deleteBooking}
                  />
                ))}
              </div>
            )}
          </section>
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-black">Next 15 Days Vehicle Plan</h2>
            <p className="text-sm font-medium text-slate-500">
              Multi-day trips ke beech wale dates automatically blocked dikhengi.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {next15Days.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black">{formatDateIN(day.date)}</h3>
                  <StatusPill label={day.status.label} />
                </div>

                <p className="mt-2 text-sm font-bold text-slate-500">
                  {day.bookings.length} bookings • {day.status.freeHours}
                </p>

                <p className="mt-2 line-clamp-2 text-xs font-semibold text-slate-400">
                  Free: {day.slots.join(", ") || "No free slot"}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[999] flex items-end bg-black/40 px-4 pb-4 md:items-center md:justify-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Add Ertiga Booking</h2>
                <p className="text-sm font-medium text-slate-500">
                  Pickup se return tak vehicle block rahegi
                </p>
              </div>

              <button
                onClick={() => setShowAdd(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {hasConflict && (
              <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                Warning: Is booking duration me already booking hai.
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Pickup Date"
                type="date"
                value={form.pickupDate}
                onChange={(v) => setForm({ ...form, pickupDate: v })}
              />

              <Input
                label="Pickup Time"
                type="time"
                value={form.pickupTime}
                onChange={(v) => setForm({ ...form, pickupTime: v })}
              />

              <Input
                label="Return Date"
                type="date"
                value={form.returnDate}
                onChange={(v) => setForm({ ...form, returnDate: v })}
              />

              <Input
                label="Return Time"
                type="time"
                value={form.returnTime}
                onChange={(v) => setForm({ ...form, returnTime: v })}
              />

              <Input
                label="Customer / Partner Name"
                value={form.customerName}
                onChange={(v) => setForm({ ...form, customerName: v })}
              />

              <Input
                label="Mobile Number"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />

              <Input
                label="Pickup Location"
                value={form.pickup}
                onChange={(v) => setForm({ ...form, pickup: v })}
              />

              <Input
                label="Drop Location"
                value={form.drop}
                onChange={(v) => setForm({ ...form, drop: v })}
              />

              <div>
                <label className="text-xs font-black text-slate-400">
                  Booking Type
                </label>
                <select
                  value={form.bookingType}
                  onChange={(e) =>
                    setForm({ ...form, bookingType: e.target.value })
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
                >
                  <option>One Way</option>
                  <option>Round Trip</option>
                  <option>Airport Pickup-Drop</option>
                  <option>Outstation</option>
                  <option>Commercial</option>
                </select>
              </div>

              <Input
                label="Total Fare"
                value={form.fare}
                onChange={(v) => setForm({ ...form, fare: v })}
              />

              <Input
                label="Advance"
                value={form.advance}
                onChange={(v) => setForm({ ...form, advance: v })}
              />

              <div>
                <label className="text-xs font-black text-slate-400">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as BookingStatus,
                    })
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="on-trip">On Trip</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black text-slate-400">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
                  placeholder="B2B partner, payment, driver note..."
                />
              </div>
            </div>

            <button
              onClick={addBooking}
              disabled={saving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-black text-white disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Plus size={18} />
              )}
              {saving ? "Saving..." : "Save Booking"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-bold text-white/50">{title}</p>
      <h3 className="mt-1 text-2xl font-black">{value}</h3>
    </div>
  );
}

function AlertCard({
  icon,
  title,
  value,
  text,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
  tone: "green" | "red" | "orange";
}) {
  const cls =
    tone === "green"
      ? "bg-green-50 text-green-700"
      : tone === "red"
      ? "bg-red-50 text-red-700"
      : "bg-orange-50 text-orange-700";

  return (
    <div className={`rounded-[26px] p-5 ${cls}`}>
      <div className="flex items-center gap-2 text-sm font-black">
        {icon}
        {title}
      </div>
      <h3 className="mt-3 text-2xl font-black">{value}</h3>
      <p className="mt-1 text-sm font-bold opacity-80">{text}</p>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  const cls =
    label === "Full Day Available"
      ? "bg-green-100 text-green-700"
      : label === "Fully Booked"
      ? "bg-red-100 text-red-700"
      : label === "Almost Full"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${cls}`}>
      {label}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
      />
    </div>
  );
}

function BookingCard({
  booking,
  selectedDate,
  updateStatus,
  deleteBooking,
}: {
  booking: Booking;
  selectedDate: string;
  updateStatus: (booking: Booking, status: BookingStatus) => void;
  deleteBooking: (booking: Booking) => void;
}) {
  const n = normalizeBooking(booking);
  const seg = getBookingSegmentForDate(booking, selectedDate);
  const phone10 = booking.phone.replace(/\D/g, "").slice(-10);
  const balance = money(booking.fare) - money(booking.advance);

  const statusClass =
    booking.status === "confirmed"
      ? "bg-green-100 text-green-700"
      : booking.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : booking.status === "on-trip"
      ? "bg-purple-100 text-purple-700"
      : booking.status === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

  const customerMessage = `Namaste ji,

Khatu Rides Travels Co. se bol rahe hain.

Aapki Ertiga booking details:
Pickup: ${formatDateIN(n.pickupDate)} ${n.pickupTime}
Return: ${formatDateIN(n.returnDate)} ${n.returnTime}
Route: ${booking.pickup} to ${booking.drop}
Booking Type: ${booking.bookingType}
Fare: ₹${booking.fare || "0"}
Advance: ₹${booking.advance || "0"}
Balance: ₹${balance}

Kripya booking details confirm kar dijiye.

Khatu Rides Travels Co.
Call / WhatsApp: ${OWNER_PHONE}`;

  const driverMessage = `Namaste Driver ji,

Aapko Ertiga booking duty assign ki ja rahi hai.

Booking Details:
Pickup: ${formatDateIN(n.pickupDate)} ${n.pickupTime}
Return: ${formatDateIN(n.returnDate)} ${n.returnTime}
Customer/Partner: ${booking.customerName}
Customer Mobile: ${booking.phone}
Pickup Location: ${booking.pickup}
Drop Location: ${booking.drop}
Booking Type: ${booking.bookingType}
Fare: ₹${booking.fare || "0"}
Advance: ₹${booking.advance || "0"}
Balance: ₹${balance}

Kripya time par location par pahunch kar customer se contact karein.

Khatu Rides Travels Co.
Admin: ${OWNER_PHONE}`;

  return (
    <div className="rounded-[26px] bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
              {seg?.startTime} - {seg?.endTime} on {formatDateIN(selectedDate)}
            </span>

            <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>
              {booking.status}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-black">{booking.customerName}</h3>

          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Phone size={15} />
            {booking.phone}
          </p>
        </div>

        <button
          onClick={() => deleteBooking(booking)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        <p className="flex items-center gap-2">
          <Clock3 size={16} className="text-orange-600" />
          Pickup: {formatDateIN(n.pickupDate)} {n.pickupTime} → Return:{" "}
          {formatDateIN(n.returnDate)} {n.returnTime}
        </p>

        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-orange-600" />
          {booking.pickup} → {booking.drop}
        </p>

        <p className="flex items-center gap-2">
          <Route size={16} className="text-orange-600" />
          {booking.bookingType}
        </p>

        <p className="flex items-center gap-2">
          <IndianRupee size={16} className="text-orange-600" />
          Fare: ₹{booking.fare || "0"} | Advance: ₹{booking.advance || "0"} |
          Balance: ₹{balance}
        </p>
      </div>

      {booking.notes && (
        <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500">
          {booking.notes}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-6">
        <a
          href={`tel:${booking.phone}`}
          className="rounded-2xl bg-green-600 px-3 py-3 text-center text-sm font-black text-white"
        >
          Call
        </a>

        <a
          href={`https://wa.me/91${phone10}?text=${encodeURIComponent(
            customerMessage
          )}`}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-3 text-sm font-black text-white"
        >
          <MessageCircle size={16} />
          Customer
        </a>

        <a
          href={`https://wa.me/91${DRIVER_PHONE}?text=${encodeURIComponent(
            driverMessage
          )}`}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-3 text-sm font-black text-white"
        >
          Driver
        </a>

        <button
          onClick={() => updateStatus(booking, "on-trip")}
          className="rounded-2xl bg-purple-600 px-3 py-3 text-sm font-black text-white"
        >
          On Trip
        </button>

        <button
          onClick={() => updateStatus(booking, "completed")}
          className="rounded-2xl bg-blue-600 px-3 py-3 text-sm font-black text-white"
        >
          Complete
        </button>

        <button
          onClick={() => updateStatus(booking, "cancelled")}
          className="rounded-2xl bg-red-600 px-3 py-3 text-sm font-black text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}