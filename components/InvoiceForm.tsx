"use client";

import { useState } from "react";

export default function InvoiceForm() {
  const [data, setData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    customerName: "",
    customerMobile: "",
    vehicleType: "",
    from: "",
    to: "",
    remarks: "",
    amount: "",
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">

      <input
        placeholder="Invoice Number"
        className="border p-3 rounded-lg w-full"
      />

      <input
        type="date"
        className="border p-3 rounded-lg w-full"
      />

      <input
        placeholder="Customer Name"
        className="border p-3 rounded-lg w-full"
      />

      <input
        placeholder="Mobile Number"
        className="border p-3 rounded-lg w-full"
      />

      <input
        placeholder="Vehicle Type"
        className="border p-3 rounded-lg w-full"
      />

      <input
        placeholder="From"
        className="border p-3 rounded-lg w-full"
      />

      <input
        placeholder="To"
        className="border p-3 rounded-lg w-full"
      />

      <textarea
        placeholder="Remarks"
        className="border p-3 rounded-lg w-full"
      />

      <input
        placeholder="Amount"
        className="border p-3 rounded-lg w-full"
      />
    </div>
  );
}