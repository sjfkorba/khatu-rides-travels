"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function CreateInvoicePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
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
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "invoices"), {
        ...form,
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

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow p-6 md:p-8">
        <h1 className="text-3xl font-black mb-6">Create Invoice</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input name="invoiceNumber" placeholder="Invoice Number" value={form.invoiceNumber} onChange={handleChange} className="border rounded-xl px-4 py-3" required />
          <input name="invoiceDate" type="date" value={form.invoiceDate} onChange={handleChange} className="border rounded-xl px-4 py-3" required />

          <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} className="border rounded-xl px-4 py-3" required />
          <input name="customerMobile" placeholder="Mobile Number" value={form.customerMobile} onChange={handleChange} className="border rounded-xl px-4 py-3" required />

          <input name="pickupLocation" placeholder="Pick-up Location" value={form.pickupLocation} onChange={handleChange} className="border rounded-xl px-4 py-3" />
          <input name="dropLocation" placeholder="Drop Location" value={form.dropLocation} onChange={handleChange} className="border rounded-xl px-4 py-3" />

          <input name="pickupTime" placeholder="Pick-up Time" value={form.pickupTime} onChange={handleChange} className="border rounded-xl px-4 py-3" />
          <input name="dropTime" placeholder="Drop Time" value={form.dropTime} onChange={handleChange} className="border rounded-xl px-4 py-3" />

          <input name="vehicleNumber" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={handleChange} className="border rounded-xl px-4 py-3" />
          <input name="vehicleType" placeholder="Vehicle Type" value={form.vehicleType} onChange={handleChange} className="border rounded-xl px-4 py-3" />

          <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} className="border rounded-xl px-4 py-3" required />

          <div className="md:col-span-2">
            <textarea
              name="remarks"
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={4}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold"
            >
              {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}