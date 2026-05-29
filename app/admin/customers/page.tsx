"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Wallet,
  CalendarDays,
  LogOut,
  User,
  IndianRupee,
  Eye,
  Loader2,
} from "lucide-react";

type Customer = {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;

  city?: string;
  type?: string;

  totalBookings?: number;
  totalBusiness?: number;
  totalReceived?: number;
  totalDue?: number;

  lastBookingDate?: string;
  lastPaymentDate?: string;
};

const OWNER_PHONE = "9244137353";

function formatMoney(value: any) {
  const num = Number(value || 0);
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    setLoading(true);

    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const snap = await getDocs(collection(db, "customers"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Customer, "id">),
      }));

      data.sort((a, b) =>
        (b.totalBusiness || 0) - (a.totalBusiness || 0)
      );

      setCustomers(data);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Customers load nahi ho paye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return customers.filter((c) => {
      return (
        c.customerName?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    });
  }, [customers, search]);

  const totalBusiness = customers.reduce(
    (sum, c) => sum + Number(c.totalBusiness || 0),
    0
  );

  const totalReceived = customers.reduce(
    (sum, c) => sum + Number(c.totalReceived || 0),
    0
  );

  const totalDue = customers.reduce(
    (sum, c) => sum + Number(c.totalDue || 0),
    0
  );

  const totalBookings = customers.reduce(
    (sum, c) => sum + Number(c.totalBookings || 0),
    0
  );

  const logout = async () => {
    try {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      await signOut(auth);
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-black">
              Customer Management
            </h1>
            <p className="text-sm text-slate-500">
              Khatu Rides CRM
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/leads")}
              className="rounded-full bg-orange-600 px-4 py-3 text-sm font-black text-white"
            >
              Leads
            </button>

            <button
              onClick={() => router.push("/admin/bookings")}
              className="rounded-full bg-slate-900 px-4 py-3 text-sm font-black text-white"
            >
              Bookings
            </button>

            <button
              onClick={() => router.push("/admin/payments")}
              className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-black text-white"
            >
              Payments
            </button>

            <button
              onClick={logout}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4">
        <section className="rounded-3xl bg-slate-950 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <Users size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Customer Database
              </h2>

              <p className="text-sm text-white/70">
                Repeat customers, B2B partners aur monthly accounts
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <StatCard
              title="Customers"
              value={customers.length}
            />

            <StatCard
              title="Bookings"
              value={totalBookings}
            />

            <StatCard
              title="Business"
              value={formatMoney(totalBusiness)}
            />

            <StatCard
              title="Pending Due"
              value={formatMoney(totalDue)}
            />
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Customer name ya mobile search kare..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          {loading ? (
            <div className="mt-8 text-center">
              <Loader2 className="mx-auto animate-spin" />
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  router={router}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-sm text-white/60">{title}</p>
      <h3 className="mt-1 text-2xl font-black">
        {value}
      </h3>
    </div>
  );
}

function CustomerCard({
  customer,
  router,
}: {
  customer: Customer;
  router: any;
}) {
  const phone = customer.phone?.replace(/\D/g, "").slice(-10);

  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-black">
            {customer.customerName}
          </h3>

          <p className="text-sm text-slate-500">
            {customer.phone}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {customer.totalBookings || 0} Bookings
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              Business {formatMoney(customer.totalBusiness)}
            </span>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              Due {formatMoney(customer.totalDue)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${phone}`}
            className="rounded-2xl bg-green-600 px-4 py-3 text-center font-black text-white"
          >
            <Phone size={18} className="mx-auto" />
          </a>

          <a
            href={`https://wa.me/91${phone}`}
            target="_blank"
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-center font-black text-white"
          >
            <MessageCircle size={18} className="mx-auto" />
          </a>

          <button
            onClick={() =>
              router.push(`/admin/customers/${customer.id}`)
            }
            className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
          >
            <Eye size={18} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}