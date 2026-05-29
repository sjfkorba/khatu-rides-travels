"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  IndianRupee,
  Plus,
  Search,
  Loader2,
  LogOut,
  MessageCircle,
  CreditCard,
  Fuel,
  User,
  CalendarDays,
  ReceiptText,
  X,
} from "lucide-react";

type Booking = {
  id: string;
  customerName: string;
  phone: string;
  pickup: string;
  drop: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  fare?: string;
  advance?: string;
  status?: string;
  payments?: PaymentEntry[];
};

type PaymentEntry = {
  id: string;
  amount: number;
  mode: string;
  type: string;
  date: string;
  note: string;
  bookingId?: string;
};

type MasterPayment = {
  id: string;
  customerName: string;
  phone: string;
  amount: number;
  mode: string;
  type: string;
  date: string;
  note: string;
  linkedBookings: string[];
};

const OWNER_PHONE = "9244137353";

const paymentModes = ["Cash", "UPI", "Bank Transfer", "Other"];
const paymentTypes = ["Advance", "Fuel / Diesel", "Balance", "Full Payment", "Other"];

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatDateIN(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
}

function money(v: any) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n : 0;
}

function bookingFare(b: Booking) {
  return money(b.fare);
}

function bookingReceived(b: Booking) {
  const ledger = b.payments || [];
  const ledgerTotal = ledger.reduce((sum, p) => sum + money(p.amount), 0);
  const oldAdvance = money(b.advance);
  return ledgerTotal > 0 ? ledgerTotal : oldAdvance;
}

function bookingBalance(b: Booking) {
  return Math.max(0, bookingFare(b) - bookingReceived(b));
}

export default function PaymentsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<MasterPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    amount: "",
    mode: "UPI",
    type: "Balance",
    date: todayDate(),
    note: "",
    linkedBookings: [] as string[],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const bookingSnap = await getDocs(collection(db, "bookings"));
      const paymentSnap = await getDocs(collection(db, "payments"));

      const bookingData = bookingSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Booking, "id">),
      }));

      const paymentData = paymentSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<MasterPayment, "id">),
      }));

      setBookings(bookingData);
      setPayments(paymentData);
    } catch (error: any) {
      alert(error?.code || error?.message || "Payments load nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsub: undefined | (() => void);

    async function checkAuth() {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      unsub = onAuthStateChanged(auth, (user) => {
        if (!user) router.push("/admin/login");
        else loadData();
      });
    }

    checkAuth();

    return () => {
      if (unsub) unsub();
    };
  }, [router]);

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();

    return bookings.filter((b) => {
      const match =
        b.customerName?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.pickup?.toLowerCase().includes(q) ||
        b.drop?.toLowerCase().includes(q);

      return q ? match : true;
    });
  }, [bookings, search]);

  const dueBookings = filteredBookings.filter((b) => bookingBalance(b) > 0);

  const totalBusiness = bookings.reduce((sum, b) => sum + bookingFare(b), 0);
  const totalReceived = bookings.reduce((sum, b) => sum + bookingReceived(b), 0);
  const totalDue = bookings.reduce((sum, b) => sum + bookingBalance(b), 0);
  const todayCollection = payments
    .filter((p) => p.date === todayDate())
    .reduce((sum, p) => sum + money(p.amount), 0);

  const selectedBookings = bookings.filter((b) =>
    form.linkedBookings.includes(b.id)
  );

  const openPaymentForBooking = (b: Booking) => {
    setForm({
      customerName: b.customerName || "",
      phone: b.phone || "",
      amount: String(bookingBalance(b) || ""),
      mode: "UPI",
      type: "Balance",
      date: todayDate(),
      note: "",
      linkedBookings: [b.id],
    });
    setShowAdd(true);
  };

  const toggleBooking = (id: string) => {
    setForm((prev) => ({
      ...prev,
      linkedBookings: prev.linkedBookings.includes(id)
        ? prev.linkedBookings.filter((x) => x !== id)
        : [...prev.linkedBookings, id],
    }));
  };

  const savePayment = async () => {
    const phone10 = form.phone.replace(/\D/g, "").slice(-10);
    const amount = money(form.amount);

    if (!form.customerName.trim() || phone10.length !== 10 || amount <= 0) {
      alert("Customer name, valid phone aur amount required hai.");
      return;
    }

    if (form.linkedBookings.length === 0) {
      alert("Kam se kam ek booking select karein.");
      return;
    }

    setSaving(true);

    try {
      const {
        addDoc,
        collection,
        doc,
        getDoc,
        updateDoc,
        serverTimestamp,
      } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const paymentPayload = {
        customerName: form.customerName.trim(),
        phone: phone10,
        amount,
        mode: form.mode,
        type: form.type,
        date: form.date,
        note: form.note.trim(),
        linkedBookings: form.linkedBookings,
        createdAt: serverTimestamp(),
      };

      const masterRef = await addDoc(collection(db, "payments"), paymentPayload);

      const splitAmount = Math.floor(amount / form.linkedBookings.length);
      let remaining = amount;

      for (let i = 0; i < form.linkedBookings.length; i++) {
        const bookingId = form.linkedBookings[i];
        const bookingRef = doc(db, "bookings", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) continue;

        const bookingData = bookingSnap.data() as Booking;
        const oldPayments = bookingData.payments || [];

        const partAmount =
          i === form.linkedBookings.length - 1 ? remaining : splitAmount;

        remaining -= partAmount;

        const newPayment: PaymentEntry = {
          id: masterRef.id,
          amount: partAmount,
          mode: form.mode,
          type: form.type,
          date: form.date,
          note: form.note.trim() || "Payment received",
          bookingId,
        };

        const newLedger = [...oldPayments, newPayment];
        const receivedAmount = newLedger.reduce(
          (sum, p) => sum + money(p.amount),
          0
        );
        const totalFare = money(bookingData.fare);
        const balanceAmount = Math.max(0, totalFare - receivedAmount);

        const paymentStatus =
          balanceAmount <= 0
            ? "Fully Paid"
            : receivedAmount > 0
            ? "Partial Paid"
            : "Unpaid";

        await updateDoc(bookingRef, {
          payments: newLedger,
          receivedAmount,
          balanceAmount,
          paymentStatus,
          updatedAt: serverTimestamp(),
        });
      }

      setShowAdd(false);
      setForm({
        customerName: "",
        phone: "",
        amount: "",
        mode: "UPI",
        type: "Balance",
        date: todayDate(),
        note: "",
        linkedBookings: [],
      });

      await loadData();
      alert("Payment successfully save ho gaya.");
    } catch (error: any) {
      alert(error?.code || error?.message || "Payment save nahi ho paya.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-xl font-black md:text-2xl">
              Payment Management
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Customer wise due, ledger aur combined payment tracking
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/bookings")}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-black"
            >
              <CalendarDays size={17} />
              Bookings
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <IndianRupee size={28} />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-black">Khatu Rides Accounts</h2>
              <p className="mt-1 text-sm text-white/60">
                Multiple bookings ka payment ek sath receive karke booking ledger me auto split hoga.
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-orange-600 px-4 py-3 text-sm font-black text-white"
            >
              + Add Payment
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat title="Total Business" value={`₹${totalBusiness}`} />
            <Stat title="Received" value={`₹${totalReceived}`} />
            <Stat title="Pending Due" value={`₹${totalDue}`} />
            <Stat title="Today Collection" value={`₹${todayCollection}`} />
          </div>
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">Due Bookings</h2>
              <p className="text-sm font-semibold text-slate-500">
                Jis booking ka balance pending hai, yaha dikhega.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 md:w-80">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, phone, route..."
                className="w-full bg-transparent text-sm font-bold outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-5 rounded-3xl bg-slate-50 p-8 text-center font-bold text-slate-500">
              <Loader2 className="mx-auto mb-2 animate-spin" />
              Loading payments...
            </div>
          ) : dueBookings.length === 0 ? (
            <div className="mt-5 rounded-3xl bg-green-50 p-8 text-center">
              <h3 className="font-black text-green-700">No Pending Due</h3>
              <p className="text-sm font-bold text-green-600">
                Abhi sab booking payment clear hai.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {dueBookings.map((b) => (
                <BookingDueCard
                  key={b.id}
                  booking={b}
                  onAddPayment={() => openPaymentForBooking(b)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Payment History</h2>

          <div className="mt-4 space-y-3">
            {payments.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
                Abhi koi payment entry nahi hai.
              </p>
            ) : (
              payments
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((p) => <PaymentHistoryCard key={p.id} payment={p} />)
            )}
          </div>
        </section>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[999] flex items-end bg-black/40 px-4 pb-4 md:items-center md:justify-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Add Payment</h2>
                <p className="text-sm font-semibold text-slate-500">
                  Ek ya multiple bookings ka payment link karein
                </p>
              </div>

              <button
                onClick={() => setShowAdd(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
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
                label="Amount Received"
                value={form.amount}
                onChange={(v) => setForm({ ...form, amount: v })}
              />

              <Input
                label="Payment Date"
                type="date"
                value={form.date}
                onChange={(v) => setForm({ ...form, date: v })}
              />

              <Select
                label="Payment Mode"
                value={form.mode}
                options={paymentModes}
                onChange={(v) => setForm({ ...form, mode: v })}
              />

              <Select
                label="Payment Type"
                value={form.type}
                options={paymentTypes}
                onChange={(v) => setForm({ ...form, type: v })}
              />

              <div className="md:col-span-2">
                <label className="text-xs font-black text-slate-400">Note</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Example: 2 bookings ka combined payment / diesel advance..."
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-50 p-4">
              <h3 className="mb-3 font-black">Link Bookings</h3>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredBookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => toggleBooking(b.id)}
                    className={`w-full rounded-2xl p-3 text-left ring-1 ${
                      form.linkedBookings.includes(b.id)
                        ? "bg-orange-50 ring-orange-300"
                        : "bg-white ring-slate-100"
                    }`}
                  >
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-black">{b.customerName}</p>
                        <p className="text-xs font-bold text-slate-500">
                          {b.pickup} → {b.drop}
                        </p>
                      </div>

                      <div className="text-right text-xs font-black">
                        <p>Fare ₹{bookingFare(b)}</p>
                        <p className="text-red-600">Due ₹{bookingBalance(b)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedBookings.length > 0 && (
                <p className="mt-3 text-sm font-black text-orange-700">
                  Selected: {selectedBookings.length} booking
                </p>
              )}
            </div>

            <button
              onClick={savePayment}
              disabled={saving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-black text-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              {saving ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-bold text-white/50">{title}</p>
      <h3 className="mt-1 text-2xl font-black">{value}</h3>
    </div>
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
  onChange: (v: string) => void;
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

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-orange-500"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function BookingDueCard({
  booking,
  onAddPayment,
}: {
  booking: Booking;
  onAddPayment: () => void;
}) {
  const received = bookingReceived(booking);
  const balance = bookingBalance(booking);

  const msg = `Namaste ji,

Khatu Rides Travels Co. se payment reminder.

Booking Details:
Customer: ${booking.customerName}
Route: ${booking.pickup} to ${booking.drop}
Total Fare: ₹${bookingFare(booking)}
Received: ₹${received}
Pending Balance: ₹${balance}

Kripya pending payment clear kar dijiye.

Khatu Rides Travels Co.
Call / WhatsApp: ${OWNER_PHONE}`;

  return (
    <div className="rounded-[26px] bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-black">{booking.customerName}</h3>
          <p className="mt-1 text-sm font-bold text-slate-500">{booking.phone}</p>
          <p className="mt-2 text-sm font-bold text-slate-700">
            {booking.pickup} → {booking.drop}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Mini label="Fare" value={`₹${bookingFare(booking)}`} />
          <Mini label="Paid" value={`₹${received}`} />
          <Mini label="Due" value={`₹${balance}`} red />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
        <button
          onClick={onAddPayment}
          className="rounded-2xl bg-orange-600 px-3 py-3 text-sm font-black text-white"
        >
          + Add Payment
        </button>

        <a
          href={`https://wa.me/91${booking.phone?.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(msg)}`}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-3 text-sm font-black text-white"
        >
          <MessageCircle size={16} />
          Reminder
        </a>

        <a
          href={`tel:${booking.phone}`}
          className="rounded-2xl bg-slate-950 px-3 py-3 text-center text-sm font-black text-white"
        >
          Call
        </a>
      </div>
    </div>
  );
}

function PaymentHistoryCard({ payment }: { payment: MasterPayment }) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{payment.customerName}</h3>
          <p className="text-sm font-bold text-slate-500">{payment.phone}</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-black text-green-700">₹{payment.amount}</p>
          <p className="text-xs font-bold text-slate-500">
            {formatDateIN(payment.date)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge icon={<CreditCard size={14} />} text={payment.mode} />
        <Badge icon={<Fuel size={14} />} text={payment.type} />
        <Badge icon={<ReceiptText size={14} />} text={`${payment.linkedBookings?.length || 0} bookings`} />
      </div>

      {payment.note && (
        <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500">
          {payment.note}
        </p>
      )}
    </div>
  );
}

function Mini({
  label,
  value,
  red,
}: {
  label: string;
  value: string;
  red?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2">
      <p className="text-[11px] font-bold text-slate-400">{label}</p>
      <p className={`font-black ${red ? "text-red-600" : "text-slate-950"}`}>
        {value}
      </p>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
      {icon}
      {text}
    </span>
  );
}