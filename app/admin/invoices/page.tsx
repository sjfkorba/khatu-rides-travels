"use client";

import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  Trash2,
  Eye,
  FileText,
  Plus,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerMobile: string;
  vehicleType?: string;
  pickupLocation?: string;
  dropLocation?: string;
  amount: number;
}

export default function InvoiceDashboard() {
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  async function loadInvoices() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "invoices"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(
        (item) =>
          ({
            id: item.id,
            ...item.data(),
          }) as Invoice
      );

      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this invoice?");
    if (!confirmDelete) return;

    try {
      setDeleteId(id);
      await deleteDoc(doc(db, "invoices", id));
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice");
    } finally {
      setDeleteId(null);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return invoices;

    return invoices.filter((invoice) => {
      return (
        invoice.invoiceNumber?.toLowerCase().includes(term) ||
        invoice.customerName?.toLowerCase().includes(term) ||
        invoice.customerMobile?.toLowerCase().includes(term) ||
        invoice.pickupLocation?.toLowerCase().includes(term) ||
        invoice.dropLocation?.toLowerCase().includes(term) ||
        invoice.vehicleType?.toLowerCase().includes(term)
      );
    });
  }, [invoices, search]);

  function formatCurrency(amount?: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              Invoice Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Khatu Rides & Travels
            </p>
          </div>

          <Link
            href="/admin/invoices/create"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold"
          >
            <Plus size={18} />
            Create Invoice
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number, customer, mobile, route or vehicle"
              className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 text-left font-bold">Invoice No</th>
                  <th className="p-4 text-left font-bold">Date</th>
                  <th className="p-4 text-left font-bold">Customer</th>
                  <th className="p-4 text-left font-bold">Mobile</th>
                  <th className="p-4 text-left font-bold">Route</th>
                  <th className="p-4 text-left font-bold">Vehicle</th>
                  <th className="p-4 text-right font-bold">Amount</th>
                  <th className="p-4 text-center font-bold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-10 text-center text-slate-600 font-semibold"
                    >
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Loading invoices...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-10 text-center text-slate-500 font-semibold"
                    >
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filtered.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                        {invoice.invoiceNumber || "-"}
                      </td>

                      <td className="p-4 text-slate-700 whitespace-nowrap">
                        {invoice.invoiceDate || "-"}
                      </td>

                      <td className="p-4 text-slate-800 font-semibold whitespace-nowrap">
                        {invoice.customerName || "-"}
                      </td>

                      <td className="p-4 text-slate-700 whitespace-nowrap">
                        {invoice.customerMobile || "-"}
                      </td>

                      <td className="p-4 text-slate-700">
                        <div className="max-w-[220px]">
                          <p className="truncate">
                            {invoice.pickupLocation || "-"} → {invoice.dropLocation || "-"}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 whitespace-nowrap">
                        {invoice.vehicleType || "-"}
                      </td>

                      <td className="p-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(invoice.amount)}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/invoices/${invoice.id}`}
                            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg"
                            title="View Invoice"
                          >
                            <Eye size={18} />
                          </Link>

                          <Link
                            href={`/admin/invoices/${invoice.id}`}
                            className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg"
                            title="Open PDF Page"
                          >
                            <FileText size={18} />
                          </Link>

                          <button
                            onClick={() => handleDelete(invoice.id)}
                            disabled={deleteId === invoice.id}
                            className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white p-2.5 rounded-lg"
                            title="Delete Invoice"
                          >
                            {deleteId === invoice.id ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}