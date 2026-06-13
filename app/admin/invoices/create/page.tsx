"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Save } from "lucide-react";

type InvoiceForm = {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerMobile: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  dropTime: string;
  vehicleNumber: string;
  vehicleType: string;
  remarks: string;
  amount: string;
};

const initialForm: InvoiceForm = {
  invoiceNumber: "",
  invoiceDate: "",
  customerName: "",
  customerMobile: "",
  pickupLocation: "",
  dropLocation: "",
  pickupTime: "",
  dropTime: "",
  vehicleNumber: "",
  vehicleType: "",
  remarks: "",
  amount: "",
};

export default function CreateInvoicePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<InvoiceForm>(initialForm);

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    if (name === "customerMobile") {
      const clean = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    if (name === "amount") {
      const clean = value.replace(/[^\d.]/g, "");
      setForm((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function generateInvoiceNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `KRT-${yyyy}${mm}${dd}-${random}`;

    setForm((prev) => ({
      ...prev,
      invoiceNumber,
      invoiceDate: prev.invoiceDate || today,
    }));
  }

  function validateForm() {
    if (!form.invoiceNumber.trim()) {
      alert("Invoice number is required");
      return false;
    }

    if (!form.invoiceDate.trim()) {
      alert("Invoice date is required");
      return false;
    }

    if (!form.customerName.trim()) {
      alert("Customer name is required");
      return false;
    }

    if (!form.customerMobile.trim() || form.customerMobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!form.pickupLocation.trim()) {
      alert("Pick-up location is required");
      return false;
    }

    if (!form.dropLocation.trim()) {
      alert("Drop location is required");
      return false;
    }

    if (!form.vehicleType.trim()) {
      alert("Vehicle type is required");
      return false;
    }

    if (!form.amount.trim() || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "invoices"), {
        invoiceNumber: form.invoiceNumber.trim(),
        invoiceDate: form.invoiceDate,
        customerName: form.customerName.trim(),
        customerMobile: form.customerMobile.trim(),
        pickupLocation: form.pickupLocation.trim(),
        dropLocation: form.dropLocation.trim(),
        pickupTime: form.pickupTime.trim(),
        dropTime: form.dropTime.trim(),
        vehicleNumber: form.vehicleNumber.trim(),
        vehicleType: form.vehicleType.trim(),
        remarks: form.remarks.trim(),
        amount: Number(form.amount || 0),
        createdAt: serverTimestamp(),
      });

      router.push(`/admin/invoices/${docRef.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold mb-4"
          >
            <ArrowLeft size={18} />
            Back to Invoice Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                Create Invoice
              </h1>
              <p className="text-slate-600 mt-2">
                Fill the details below to create a new taxi invoice
              </p>
            </div>

            <button
              type="button"
              onClick={generateInvoiceNumber}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold"
            >
              <FileText size={18} />
              Auto Generate Invoice No
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Invoice Number
              </label>
              <input
                name="invoiceNumber"
                placeholder="Enter invoice number"
                value={form.invoiceNumber}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Invoice Date
              </label>
              <input
                name="invoiceDate"
                type="date"
                value={form.invoiceDate}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Customer Name
              </label>
              <input
                name="customerName"
                placeholder="Enter customer name"
                value={form.customerName}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Customer Mobile
              </label>
              <input
                name="customerMobile"
                placeholder="Enter mobile number"
                value={form.customerMobile}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={10}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Pick-up Location
              </label>
              <input
                name="pickupLocation"
                placeholder="Enter pick-up location"
                value={form.pickupLocation}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Drop Location
              </label>
              <input
                name="dropLocation"
                placeholder="Enter drop location"
                value={form.dropLocation}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Pick-up Time
              </label>
              <input
                name="pickupTime"
                type="time"
                value={form.pickupTime}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Drop Time
              </label>
              <input
                name="dropTime"
                type="time"
                value={form.dropTime}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Vehicle Number
              </label>
              <input
                name="vehicleNumber"
                placeholder="Enter vehicle number"
                value={form.vehicleNumber}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Vehicle Type
              </label>
              <input
                name="vehicleType"
                placeholder="Sedan / SUV / Hatchback"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Amount
              </label>
              <input
                name="amount"
                type="text"
                placeholder="Enter invoice amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                placeholder="Enter remarks or trip notes"
                value={form.remarks}
                onChange={handleChange}
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-6 py-3 rounded-2xl font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Saving..." : "Save Invoice"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-60 text-slate-900 px-6 py-3 rounded-2xl font-bold"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}