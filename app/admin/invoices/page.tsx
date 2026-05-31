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
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

interface Invoice {
  id: string;

  invoiceNumber: string;

  invoiceDate: string;

  customerName: string;

  customerMobile: string;

  vehicleType: string;

  from: string;

  to: string;

  amount: number;
}

export default function InvoiceDashboard() {
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  async function loadInvoices() {
    try {
      const q = query(
        collection(db, "invoices"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(q);

      const data =
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Invoice
        );

      setInvoices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleDelete(
    id: string
  ) {
    const confirmDelete =
      confirm(
        "Delete this invoice?"
      );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "invoices", id)
      );

      loadInvoices();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete invoice"
      );
    }
  }

  const filtered =
    invoices.filter((invoice) => {
      const term =
        search.toLowerCase();

      return (
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(term) ||
        invoice.customerName
          ?.toLowerCase()
          .includes(term) ||
        invoice.customerMobile?.includes(
          term
        )
      );
    });

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-4xl font-black">
              Invoice Dashboard
            </h1>

            <p className="text-slate-600 mt-2">
              Khatu Rides & Travels
            </p>

          </div>

          <Link
            href="/admin/invoices/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            <Plus size={18} />

            Create Invoice
          </Link>

        </div>

        {/* Search */}

        <div className="bg-white rounded-3xl p-5 shadow mb-8">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search Invoice Number, Customer Name or Mobile"
              className="w-full border rounded-xl pl-12 pr-4 py-3"
            />

          </div>

        </div>

        {/* Table */}

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-900 text-white">

                  <th className="p-4 text-left">
                    Invoice No
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Customer
                  </th>

                  <th className="p-4 text-left">
                    Mobile
                  </th>

                  <th className="p-4 text-left">
                    Route
                  </th>

                  <th className="p-4 text-right">
                    Amount
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>

                    <td
                      colSpan={7}
                      className="p-10 text-center"
                    >
                      Loading...
                    </td>

                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>

                    <td
                      colSpan={7}
                      className="p-10 text-center"
                    >
                      No Invoices Found
                    </td>

                  </tr>
                ) : (
                  filtered.map(
                    (invoice) => (
                      <tr
                        key={
                          invoice.id
                        }
                        className="border-b"
                      >

                        <td className="p-4 font-bold">
                          {
                            invoice.invoiceNumber
                          }
                        </td>

                        <td className="p-4">
                          {
                            invoice.invoiceDate
                          }
                        </td>

                        <td className="p-4">
                          {
                            invoice.customerName
                          }
                        </td>

                        <td className="p-4">
                          {
                            invoice.customerMobile
                          }
                        </td>

                        <td className="p-4">
                          {
                            invoice.from
                          }
                          {" → "}
                          {
                            invoice.to
                          }
                        </td>

                        <td className="p-4 text-right font-bold">
                          ₹
                          {
                            invoice.amount
                          }
                        </td>

                        <td className="p-4">

                          <div className="flex justify-center gap-3">

                            <Link
                              href={`/admin/invoices/${invoice.id}`}
                              className="bg-blue-500 text-white p-2 rounded-lg"
                            >
                              <Eye
                                size={18}
                              />
                            </Link>

                            <Link
                              href={`/admin/invoices/${invoice.id}`}
                              className="bg-green-500 text-white p-2 rounded-lg"
                            >
                              <FileText
                                size={18}
                              />
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(
                                  invoice.id
                                )
                              }
                              className="bg-red-500 text-white p-2 rounded-lg"
                            >
                              <Trash2
                                size={18}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}