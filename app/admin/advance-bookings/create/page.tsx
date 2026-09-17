"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  FileText,
  Loader2,
  Minus,
  Plus,
  Save,
  Users,
  WalletCards,
} from "lucide-react";

type VehicleItem = {
  id: string;
  vehicleType: string;
  variant: string;
  quantity: string;
  rate: string;
};

type BookingForm = {
  bookingNumber: string;
  bookingDate: string;
  journeyDate: string;

  customerName: string;
  customerMobile: string;

  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;

  bookingType: string;
  status: string;

  advanceAmount: string;
  remarks: string;
};

const initialForm: BookingForm = {
  bookingNumber: "",
  bookingDate: "",
  journeyDate: "",

  customerName: "",
  customerMobile: "",

  pickupLocation: "",
  dropLocation: "",
  pickupTime: "",

  bookingType: "Advance Booking",
  status: "Confirmed",

  advanceAmount: "",
  remarks: "",
};

const createVehicle = (): VehicleItem => ({
  id: `${Date.now()}-${Math.random()}`,
  vehicleType: "",
  variant: "",
  quantity: "1",
  rate: "",
});

const initialVehicles: VehicleItem[] = [createVehicle()];

const vehicleOptions = [
  "Verna",
  "Scorpio",
  "Innova",
  "Innova Crysta",
  "Ertiga",
  "Dzire",
  "Bolero",
  "Other",
];

export default function CreateAdvanceBookingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [vehicles, setVehicles] =
    useState<VehicleItem[]>(initialVehicles);

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const totalAmount = useMemo(() => {
    return vehicles.reduce((total, vehicle) => {
      const quantity = Number(vehicle.quantity || 0);
      const rate = Number(vehicle.rate || 0);

      return total + quantity * rate;
    }, 0);
  }, [vehicles]);

  const advanceAmount = Number(form.advanceAmount || 0);

  const balanceAmount = Math.max(
    totalAmount - advanceAmount,
    0
  );

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function handleFormChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    if (name === "customerMobile") {
      const clean = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        [name]: clean,
      }));

      return;
    }

    if (name === "advanceAmount") {
      const clean = value.replace(/[^\d.]/g, "");

      setForm((prev) => ({
        ...prev,
        [name]: clean,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleVehicleChange(
    id: string,
    field: keyof VehicleItem,
    value: string
  ) {
    setVehicles((prev) =>
      prev.map((vehicle) => {
        if (vehicle.id !== id) return vehicle;

        if (field === "quantity") {
          return {
            ...vehicle,
            quantity: value.replace(/\D/g, "").slice(0, 3),
          };
        }

        if (field === "rate") {
          return {
            ...vehicle,
            rate: value.replace(/[^\d.]/g, ""),
          };
        }

        return {
          ...vehicle,
          [field]: value,
        };
      })
    );
  }

  function addVehicle() {
    setVehicles((prev) => [...prev, createVehicle()]);
  }

  function removeVehicle(id: string) {
    if (vehicles.length === 1) return;

    setVehicles((prev) =>
      prev.filter((vehicle) => vehicle.id !== id)
    );
  }

  function generateBookingNumber() {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(100 + Math.random() * 900);

    const bookingNumber = `KRT-AB-${yyyy}${mm}${dd}-${random}`;

    setForm((prev) => ({
      ...prev,
      bookingNumber,
      bookingDate: prev.bookingDate || today,
    }));
  }

  function validateForm() {
    if (!form.bookingNumber.trim()) {
      alert("Booking number is required");
      return false;
    }

    if (!form.bookingDate.trim()) {
      alert("Booking date is required");
      return false;
    }

    if (!form.journeyDate.trim()) {
      alert("Journey date is required");
      return false;
    }

    if (!form.customerName.trim()) {
      alert("Customer name is required");
      return false;
    }

    if (
      !form.customerMobile.trim() ||
      form.customerMobile.length !== 10
    ) {
      alert("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!/^[6-9]/.test(form.customerMobile)) {
      alert("Please enter a valid Indian mobile number");
      return false;
    }

    if (!form.pickupLocation.trim()) {
      alert("Pick-up location is required");
      return false;
    }

    if (!form.dropLocation.trim()) {
      alert("Destination is required");
      return false;
    }

    if (vehicles.length === 0) {
      alert("Please add at least one vehicle");
      return false;
    }

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];

      if (!vehicle.vehicleType.trim()) {
        alert(`Vehicle type is required for vehicle #${i + 1}`);
        return false;
      }

      if (
        !vehicle.quantity.trim() ||
        Number(vehicle.quantity) <= 0
      ) {
        alert(`Enter valid quantity for vehicle #${i + 1}`);
        return false;
      }

      if (!vehicle.rate.trim() || Number(vehicle.rate) <= 0) {
        alert(`Enter valid rate for vehicle #${i + 1}`);
        return false;
      }
    }

    if (totalAmount <= 0) {
      alert("Total booking amount must be greater than zero");
      return false;
    }

    if (advanceAmount < 0) {
      alert("Advance amount cannot be negative");
      return false;
    }

    if (advanceAmount > totalAmount) {
      alert("Advance amount cannot be greater than total amount");
      return false;
    }

    return true;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const vehicleItems = vehicles.map((vehicle) => {
        const quantity = Number(vehicle.quantity || 0);
        const rate = Number(vehicle.rate || 0);

        return {
          vehicleType: vehicle.vehicleType.trim(),
          variant: vehicle.variant.trim(),
          quantity,
          ratePerVehicle: rate,
          total: quantity * rate,
        };
      });

      const docRef = await addDoc(
        collection(db, "advance_bookings"),
        {
          bookingNumber: form.bookingNumber.trim(),

          bookingType: "Advance Booking",

          bookingDate: form.bookingDate,
          journeyDate: form.journeyDate,
          pickupTime: form.pickupTime.trim(),

          customerName: form.customerName.trim(),
          customerMobile: form.customerMobile.trim(),

          pickupLocation: form.pickupLocation.trim(),
          dropLocation: form.dropLocation.trim(),

          vehicles: vehicleItems,

          totalVehicles: vehicleItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),

          totalAmount,
          advanceAmount,
          balanceAmount,

          status: form.status,
          remarks: form.remarks.trim(),

          source: "admin",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      router.push(`/admin/advance-bookings/${docRef.id}`);
    } catch (error) {
      console.error("Advance booking creation error:", error);

      alert(
        "Failed to create advance booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setVehicles([createVehicle()]);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="mb-6">
          <Link
            href="/admin/advance-bookings"
            className="mb-4 inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-slate-950"
          >
            <ArrowLeft size={18} />
            Back to Advance Bookings
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-800">
                <FileText size={14} />
                PRE-BOOKING SYSTEM
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Create Advance Booking
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Create a pre-booking with multiple vehicles, advance
                payment and balance amount.
              </p>
            </div>

            <button
              type="button"
              onClick={generateBookingNumber}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-slate-800"
            >
              <FileText size={18} />
              Auto Generate Booking No
            </button>
          </div>
        </div>

        {/* ====================================================== */}
        {/* FORM */}
        {/* ====================================================== */}

        <form onSubmit={handleSubmit}>
          {/* ==================================================== */}
          {/* BOOKING INFORMATION */}
          {/* ==================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Booking Information
                </h2>

                <p className="text-xs text-slate-500">
                  Basic pre-booking details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Booking Number */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Booking Number
                </label>

                <input
                  name="bookingNumber"
                  placeholder="KRT-AB-20261005-001"
                  value={form.bookingNumber}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Booking Date */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Booking Date
                </label>

                <input
                  name="bookingDate"
                  type="date"
                  value={form.bookingDate}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Journey Date */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Journey / Event Date
                </label>

                <input
                  name="journeyDate"
                  type="date"
                  value={form.journeyDate}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Booking Type */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Booking Type
                </label>

                <select
                  name="bookingType"
                  value={form.bookingType}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Advance Booking">
                    Advance Booking
                  </option>
                  <option value="Wedding Booking">
                    Wedding Booking
                  </option>
                  <option value="Event Booking">
                    Event Booking
                  </option>
                  <option value="Corporate Booking">
                    Corporate Booking
                  </option>
                  <option value="Tour Booking">
                    Tour Booking
                  </option>
                  <option value="Group Booking">
                    Group Booking
                  </option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Booking Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Partially Paid">
                    Partially Paid
                  </option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Pickup Time */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Pickup / Reporting Time
                </label>

                <input
                  name="pickupTime"
                  type="time"
                  value={form.pickupTime}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* CUSTOMER */}
          {/* ==================================================== */}

          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Users size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Customer & Journey
                </h2>

                <p className="text-xs text-slate-500">
                  Customer contact and journey details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Customer Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Customer Name
                </label>

                <input
                  name="customerName"
                  placeholder="Enter customer name"
                  value={form.customerName}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Customer Mobile */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Customer Mobile
                </label>

                <input
                  name="customerMobile"
                  placeholder="10 digit mobile number"
                  value={form.customerMobile}
                  onChange={handleFormChange}
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Pickup */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Pick-up / Reporting Location
                </label>

                <input
                  name="pickupLocation"
                  placeholder="e.g. NTPC Jamnipali"
                  value={form.pickupLocation}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Drop */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Destination
                </label>

                <input
                  name="dropLocation"
                  placeholder="e.g. Katghora"
                  value={form.dropLocation}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* VEHICLES */}
          {/* ==================================================== */}

          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Car size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Vehicle Requirements
                  </h2>

                  <p className="text-xs text-slate-500">
                    Add one or multiple vehicle categories
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addVehicle}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:bg-blue-800"
              >
                <Plus size={16} />
                Add Vehicle
              </button>
            </div>

            <div className="space-y-4">
              {vehicles.map((vehicle, index) => {
                const quantity = Number(vehicle.quantity || 0);
                const rate = Number(vehicle.rate || 0);
                const lineTotal = quantity * rate;

                return (
                  <div
                    key={vehicle.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white">
                          {index + 1}
                        </span>

                        <div>
                          <p className="text-sm font-black text-slate-950">
                            Vehicle #{index + 1}
                          </p>

                          <p className="text-[10px] text-slate-500">
                            Vehicle quantity & pricing
                          </p>
                        </div>
                      </div>

                      {vehicles.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeVehicle(vehicle.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                          title="Remove vehicle"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {/* Vehicle Type */}
                      <div>
                        <label className="mb-2 block text-xs font-black text-slate-600">
                          Vehicle Type
                        </label>

                        <select
                          value={vehicle.vehicleType}
                          onChange={(e) =>
                            handleVehicleChange(
                              vehicle.id,
                              "vehicleType",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">
                            Select Vehicle
                          </option>

                          {vehicleOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Variant */}
                      <div>
                        <label className="mb-2 block text-xs font-black text-slate-600">
                          Variant / Requirement
                        </label>

                        <input
                          value={vehicle.variant}
                          onChange={(e) =>
                            handleVehicleChange(
                              vehicle.id,
                              "variant",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Sunroof"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="mb-2 block text-xs font-black text-slate-600">
                          Quantity
                        </label>

                        <input
                          value={vehicle.quantity}
                          onChange={(e) =>
                            handleVehicleChange(
                              vehicle.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          inputMode="numeric"
                          placeholder="Qty"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-black outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {/* Rate */}
                      <div>
                        <label className="mb-2 block text-xs font-black text-slate-600">
                          Rate / Vehicle
                        </label>

                        <input
                          value={vehicle.rate}
                          onChange={(e) =>
                            handleVehicleChange(
                              vehicle.id,
                              "rate",
                              e.target.value
                            )
                          }
                          inputMode="numeric"
                          placeholder="₹ Amount"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-black outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Calculation
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-600">
                          {quantity || 0} ×{" "}
                          {formatCurrency(rate || 0)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Vehicle Total
                        </p>

                        <p className="mt-1 text-lg font-black text-blue-700">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==================================================== */}
          {/* PAYMENT SUMMARY */}
          {/* ==================================================== */}

          <section className="mt-6 rounded-3xl bg-[#061936] p-6 text-white shadow-xl md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <WalletCards size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black">
                  Booking Amount
                </h2>

                <p className="text-xs text-blue-100/60">
                  Total, advance and remaining balance
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Total */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-200/60">
                  Total Booking Amount
                </p>

                <p className="mt-2 text-3xl font-black text-amber-300">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              {/* Advance */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <label className="block text-[9px] font-black uppercase tracking-wider text-blue-200/60">
                  Advance Received
                </label>

                <input
                  name="advanceAmount"
                  value={form.advanceAmount}
                  onChange={handleFormChange}
                  inputMode="numeric"
                  placeholder="₹ 0"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-lg font-black text-slate-950 outline-none focus:ring-2 focus:ring-amber-300"
                />

                <p className="mt-2 text-[9px] text-blue-100/45">
                  Enter 0 if no advance received.
                </p>
              </div>

              {/* Balance */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-200/60">
                  Balance Amount
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {formatCurrency(balanceAmount)}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-white/[0.05] px-4 py-3">
                <p className="text-[8px] uppercase text-blue-200/45">
                  Vehicle Lines
                </p>

                <p className="mt-1 text-sm font-black">
                  {vehicles.length}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] px-4 py-3">
                <p className="text-[8px] uppercase text-blue-200/45">
                  Total Vehicles
                </p>

                <p className="mt-1 text-sm font-black">
                  {vehicles.reduce(
                    (sum, vehicle) =>
                      sum + Number(vehicle.quantity || 0),
                    0
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] px-4 py-3">
                <p className="text-[8px] uppercase text-blue-200/45">
                  Advance
                </p>

                <p className="mt-1 text-sm font-black text-emerald-300">
                  {formatCurrency(advanceAmount)}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] px-4 py-3">
                <p className="text-[8px] uppercase text-blue-200/45">
                  Balance
                </p>

                <p className="mt-1 text-sm font-black text-amber-300">
                  {formatCurrency(balanceAmount)}
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* REMARKS */}
          {/* ==================================================== */}

          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Remarks / Special Instructions
            </label>

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleFormChange}
              rows={4}
              placeholder="Example: 2 Verna Sunroof + 6 Scorpio required for baraat. Reporting at NTPC Jamnipali."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* ==================================================== */}
          {/* ACTIONS */}
          {/* ==================================================== */}

          <div className="mt-6 flex flex-col gap-3 pb-10 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <Save size={19} />
              )}

              {loading
                ? "Saving Booking..."
                : "Save Advance Booking"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-slate-200 px-6 text-sm font-black text-slate-900 transition hover:bg-slate-300 disabled:opacity-60"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}